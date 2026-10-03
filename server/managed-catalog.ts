import type { AIRate, AISetupPolicy } from '../shared/types.js';

/** Metadata snapshot from OpenRouter's public /api/v1/models on 2026-09-27.
 * Published rates are informational; live quality qualification is pending.
 * Managed dispatch is funding-gated and limited to the featured provisional IDs.
 * This list never imports new models at runtime.
 */
export const MANAGED_CATALOG_VERSION = '2026-09-27.v1';
export const MANAGED_CATALOG_SOURCE = 'https://openrouter.ai/api/v1/models';
export const MANAGED_DEFAULT_BUILDER = 'google/gemini-3.8-flash';
export const MANAGED_INTERPRETER_CANDIDATES = [
  'deepseek/deepseek-v4.1-flash', 'openai/gpt-6-luna', 'qwen/qwen3.8-flash',
] as const;

export type ManagedCatalogEntry = {
  id: string; name: string; description: string; contextTokens: number;
  maxOutputTokens: number; rate: AIRate; supportedParameters: string[];
  reasoningEfforts: string[]; schemaSupported: boolean; editingStatus: 'untested';
  availability: 'metadata_verified' | 'pending_qualification'; featured: boolean;
  endpointPolicy: 'zdr_no_collection'; qualification: 'not_run';
};

const row = (id: string, name: string, description: string, input: number, output: number,
  cached: number | undefined, contextTokens: number, maxOutputTokens: number,
  schemaSupported: boolean, reasoningEfforts: string[], featured = false): ManagedCatalogEntry => ({
    id, name, description, contextTokens, maxOutputTokens,
    rate: { currency: 'USD', inputPerMillion: input, outputPerMillion: output,
      ...(cached === undefined ? {} : { cachedInputPerMillion: cached }),
      reasoningBilling: 'not_separately_reported',
      reasoningNote: 'Provider reasoning and endpoint charges require reconciliation against actual usage.',
      sourceUrl: `https://openrouter.ai/${id}`, verifiedAt: '2026-09-27' },
    supportedParameters: schemaSupported ? ['max_tokens', 'response_format', 'structured_outputs'] : ['max_tokens'],
    reasoningEfforts, schemaSupported, editingStatus: 'untested',
    availability: featured ? 'metadata_verified' : 'pending_qualification', featured,
    endpointPolicy: 'zdr_no_collection', qualification: 'not_run',
  });

export const managedCatalog: readonly ManagedCatalogEntry[] = [
  row('deepseek/deepseek-v4.1-flash', 'DeepSeek V4.1 Flash', 'Budget builder candidate', .035, .29, .001, 1048576, 384000, true, ['max', 'high', 'low'], true),
  row('openai/gpt-6-luna', 'GPT-6 Luna', 'Fast builder and interpreter candidate', .1, .5, .01, 1050000, 128000, true, ['max', 'xhigh', 'high', 'medium', 'low', 'none']),
  row('qwen/qwen3.8-flash', 'Qwen3.8 Flash', 'Economical builder and interpreter candidate', .15, .47, .016, 1000000, 131072, true, []),
  row('z-ai/glm-5.3-flash', 'GLM-5.3 Flash', 'Economical coding candidate', .045, .14, .01, 1310720, 128000, true, ['max', 'high', 'low']),
  row('minimax/minimax-m2.7', 'MiniMax M2.7', 'Coding candidate', .21, .84, .042, 204800, 176947, false, []),
  row('moonshotai/kimi-k2.7-code', 'Kimi K2.7 Code', 'Code focused candidate', .6562, 3.3, .18, 262144, 235929, false, []),
  row('z-ai/glm-5.3', 'GLM-5.3', 'General coding candidate', 1.4, 4.4, .26, 1310720, 943717, false, ['max', 'high', 'low']),
  row('google/gemini-3.8-flash', 'Gemini 3.8 Flash', 'Provisional shared builder default', .75, 3.75, .075, 1048576, 65536, true, ['high', 'medium', 'low'], true),
  row('qwen/qwen3.8-max-0902', 'Qwen3.8 Max 0902', 'Higher capability candidate', 2, 6, .25, 1000000, 131072, true, ['xhigh', 'high', 'medium', 'low', 'minimal']),
  row('anthropic/claude-sonnet-5', 'Claude Sonnet 5', 'Higher capability builder candidate', 2, 10, .2, 1000000, 128000, true, ['max', 'xhigh', 'high', 'medium', 'low'], true),
  row('openai/gpt-6-sol', 'GPT-6 Sol', 'Coding candidate', 2, 10, .2, 1050000, 128000, true, ['max', 'xhigh', 'high', 'medium', 'low', 'none']),
  row('anthropic/claude-opus-5.5', 'Claude Opus 5.5', 'High capability candidate', 4, 20, .2, 1000000, 128000, true, ['max', 'xhigh', 'high', 'medium', 'low']),
  row('openai/gpt-6-astra', 'GPT-6 Astra', 'High capability candidate', 10, 50, 1, 1050000, 128000, true, ['max', 'xhigh', 'high', 'medium', 'low']),
];

export function managedBuilder(id: string) {
  return managedCatalog.find(item => item.id === id && item.availability === 'metadata_verified');
}

export function managedSetup(builderId = MANAGED_DEFAULT_BUILDER): AISetupPolicy {
  const builder = managedBuilder(builderId);
  const personal = managedCatalog.find(item => item.id === MANAGED_INTERPRETER_CANDIDATES[0]);
  if (!builder || !personal) throw new Error('Managed catalog configuration is incomplete.');
  const layer = (item: ManagedCatalogEntry, maxInputTokens: number, maxOutputTokens: number) => ({
    connectionId: 'managed', connectionName: '2guys1canvas managed OpenRouter', provider: 'openrouter' as const,
    model: item.id, rate: item.rate, maxInputTokens, maxOutputTokens,
    reasoning: item.reasoningEfforts,
  });
  return { mode: 'managed', workflowMode: 'developer', effort: 'medium',
    presetVersion: MANAGED_CATALOG_VERSION, pricingVersion: MANAGED_CATALOG_VERSION,
    routingRuleVersion: MANAGED_CATALOG_VERSION, status: 'hypothesis',
    routingReason: 'User-selected shared builder; comparative qualification has not been run.',
    resolved: { personal: layer(personal, 50000, 2400),
      builder: layer(builder, 150000, 12000), repairAttempts: 2 } };
}
