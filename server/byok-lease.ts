import { randomUUID } from 'node:crypto';
import type { AIReasoningConfig, TemporaryModel } from '../shared/types.js';

export const BYOK_LEASE_MS = 2 * 60 * 60 * 1000;
export const BYOK_MODEL_VERSION = 'openrouter-roles-2026-10-16';
export const BYOK_ROLE_LIMITS = {
  builder: { contextLength: 64_000, maxInputTokens: 60_000, maxOutputTokens: 16_000 },
  personal: { contextLength: 32_000, maxInputTokens: 20_000, maxOutputTokens: 8_000 },
} as const;
const OPENROUTER = 'https://openrouter.ai/api/v1';

export type LeaseModel = TemporaryModel;
type Lease = { handle: string; projectId: string; ownerId: string; key: string; expiresAt: number;
  builders: LeaseModel[]; interpreters: LeaseModel[]; spenders: Set<string> };

function nonnegative(value: unknown): number | undefined {
  if (typeof value !== 'number' && (typeof value !== 'string' || !value.trim())) return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

function modelsFrom(value: unknown): LeaseModel[] {
  if (!Array.isArray(value)) throw new Error('OpenRouter model information is unavailable.');
  return value.flatMap((model: any) => {
    if (typeof model?.id !== 'string' || !model.id.trim() ||
      !Array.isArray(model.architecture?.input_modalities) || !model.architecture.input_modalities.includes('text') ||
      !Array.isArray(model.architecture?.output_modalities) || !model.architecture.output_modalities.includes('text') ||
      !Array.isArray(model.supported_parameters) ||
      !['response_format', 'structured_outputs', 'max_tokens'].every(parameter => model.supported_parameters.includes(parameter))) return [];
    const input = nonnegative(model.pricing?.prompt), output = nonnegative(model.pricing?.completion);
    const prices = Object.values(model.pricing || {}).map(nonnegative);
    const requestPriceUsd = model.pricing?.request === undefined ? 0 : nonnegative(model.pricing.request);
    const context = Math.min(nonnegative(model.context_length) ?? 0, nonnegative(model.top_provider?.context_length) ?? 0);
    const maxOutputTokens = nonnegative(model.top_provider?.max_completion_tokens);
    if (input === undefined || output === undefined || requestPriceUsd === undefined ||
      prices.some(price => price === undefined) || context < BYOK_ROLE_LIMITS.personal.contextLength ||
      maxOutputTokens === undefined || maxOutputTokens < BYOK_ROLE_LIMITS.personal.maxOutputTokens) return [];
    let reasoningConfig: AIReasoningConfig | undefined;
    if (model.reasoning || model.supported_parameters.includes('reasoning') || model.supported_parameters.includes('reasoning_effort')) {
      // Do not inherit an unbounded/default-max reasoning policy inside a small JSON response allowance.
      if (!model.supported_parameters.includes('reasoning')) return [];
      const efforts = model.reasoning?.supported_efforts;
      if (efforts === null || (Array.isArray(efforts) && efforts.includes('low'))) reasoningConfig = { effort: 'low' };
      else if (Array.isArray(efforts) && efforts.includes('minimal')) reasoningConfig = { effort: 'minimal' };
      else if (model.reasoning?.mandatory === false) reasoningConfig = { enabled: false };
      else return []; // Unknown/mandatory reasoning without a supported bounded setting is not a qualified choice.
    }
    return [{ id: model.id, name: String(model.name || model.id), inputPerMillion: input * 1_000_000,
      outputPerMillion: output * 1_000_000, contextLength: context, maxOutputTokens,
      isFree: prices.every(price => price === 0), requestPriceUsd, ...(reasoningConfig ? { reasoningConfig } : {}) }];
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
    const eligible = (role: keyof typeof BYOK_ROLE_LIMITS) => compatible.filter(model =>
      model.contextLength >= BYOK_ROLE_LIMITS[role].contextLength && model.maxOutputTokens >= BYOK_ROLE_LIMITS[role].maxOutputTokens);
    const builders = eligible('builder'), interpreters = eligible('personal');
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
