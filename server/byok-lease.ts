import { randomUUID } from 'node:crypto';

export const BYOK_LEASE_MS = 2 * 60 * 60 * 1000;
export const BYOK_MODEL_VERSION = 'openrouter-mvp-2026-09-28';
const OPENROUTER = 'https://openrouter.ai/api/v1';

export type LeaseModel = { id: string; name: string; inputPerMillion: number; outputPerMillion: number; contextLength: number };
type Lease = { handle: string; projectId: string; ownerId: string; key: string; expiresAt: number;
  builders: LeaseModel[]; interpreters: LeaseModel[]; spenders: Set<string> };

function modelsFrom(value: unknown): LeaseModel[] {
  if (!Array.isArray(value)) throw new Error('OpenRouter model information is unavailable.');
  return value.flatMap((model: any) => {
    if (typeof model?.id !== 'string' || !model?.architecture?.output_modalities?.includes('text') ||
      !model?.supported_parameters?.includes('response_format')) return [];
    const input = Number(model.pricing?.prompt), output = Number(model.pricing?.completion), context = Number(model.context_length);
    if (![input, output, context].every(Number.isFinite) || input < 0 || output < 0 || context < 16_000) return [];
    return [{ id: model.id, name: String(model.name || model.id), inputPerMillion: input * 1_000_000,
      outputPerMillion: output * 1_000_000, contextLength: context }];
  });
}

export class OpenRouterLeases {
  private leases = new Map<string, Lease>();
  private current(projectId: string): Lease | undefined {
    const lease = this.leases.get(projectId);
    if (lease && lease.expiresAt <= Date.now()) { this.leases.delete(projectId); return undefined; }
    return lease;
  }
  status(projectId: string) {
    const lease = this.current(projectId);
    return lease && { handle: lease.handle, sponsorId: lease.ownerId, expiresAt: new Date(lease.expiresAt).toISOString(),
      builders: lease.builders, interpreters: lease.interpreters, authorizedSpenderIds: [...lease.spenders] };
  }
  async connect(projectId: string, ownerId: string, key: string) {
    const secret = key.trim();
    if (!/^sk-or-/.test(secret) || secret.length > 300) throw new Error('Enter an OpenRouter API key.');
    const headers = { Authorization: `Bearer ${secret}` };
    const info = await fetch(`${OPENROUTER}/key`, { headers, signal: AbortSignal.timeout(10_000) });
    if (!info.ok) throw new Error(info.status === 401 || info.status === 403 ? 'OpenRouter rejected this key.' : 'OpenRouter key validation failed.');
    const detail = await info.json() as { data?: { limit_remaining?: number; expires_at?: string; is_management_key?: boolean } };
    if (detail.data?.is_management_key) throw new Error('Use an OpenRouter inference key, not a management key.');
    if (typeof detail.data?.limit_remaining === 'number' && detail.data.limit_remaining <= 0) throw new Error('This OpenRouter key has no remaining spending allowance.');
    if (detail.data?.expires_at && Date.parse(detail.data.expires_at) <= Date.now()) throw new Error('This OpenRouter key has expired.');
    const catalog = await fetch(`${OPENROUTER}/models`, { headers, signal: AbortSignal.timeout(10_000) });
    if (!catalog.ok) throw new Error('OpenRouter model discovery failed.');
    const data = await catalog.json() as { data?: unknown };
    const compatible = modelsFrom(data.data);
    const builders = compatible, interpreters = compatible;
    if (!builders.length || !interpreters.length) throw new Error('No currently compatible builder and interpretation models were returned.');
    const lease: Lease = { handle: randomUUID(), projectId, ownerId, key: secret,
      expiresAt: Date.now() + BYOK_LEASE_MS, builders, interpreters, spenders: new Set([ownerId]) };
    this.leases.set(projectId, lease);
    return this.status(projectId)!;
  }
  require(projectId: string, handle: string, actorId?: string): Lease {
    const lease = this.current(projectId);
    if (!lease || lease.handle !== handle) throw new Error('OpenRouter connection expired or was lost after restart. Ask the owner to reconnect.');
    if (actorId && !lease.spenders.has(actorId)) throw new Error('The project owner has not authorized your builds on this OpenRouter connection.');
    return lease;
  }
  key(projectId: string, handle: string, actorId?: string) { return this.require(projectId, handle, actorId).key; }
  model(projectId: string, handle: string, role: 'builder' | 'personal', modelId: string) {
    const lease = this.require(projectId, handle);
    const list = role === 'builder' ? lease.builders : lease.interpreters;
    if (!list.some(model => model.id === modelId)) throw new Error(`Choose a currently compatible ${role === 'builder' ? 'builder' : 'interpretation'} model.`);
  }
  authorize(projectId: string, ownerId: string, memberId: string, allowed: boolean) {
    const lease = this.current(projectId);
    if (!lease || lease.ownerId !== ownerId) throw new Error('Only the connected project owner may authorize spending.');
    if (memberId === ownerId && !allowed) throw new Error('The sponsor cannot revoke their own spending authorization.');
    if (allowed) lease.spenders.add(memberId); else lease.spenders.delete(memberId);
    return this.status(projectId)!;
  }
  disconnect(projectId: string, ownerId: string) {
    const lease = this.current(projectId);
    if (lease && lease.ownerId !== ownerId) throw new Error('Only the connected project owner may disconnect.');
    this.leases.delete(projectId);
  }
}
