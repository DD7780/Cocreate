import assert from 'node:assert/strict';
import test from 'node:test';
import { OpenRouterLeases } from '../server/byok-lease.js';

function model(id: string, overrides: Record<string, unknown> = {}) {
  return {
    id, name: id,
    architecture: { input_modalities: ['text'], output_modalities: ['text'] },
    supported_parameters: ['response_format', 'structured_outputs', 'max_tokens'],
    pricing: { prompt: '0.000001', completion: '0.000002' },
    context_length: 128_000,
    top_provider: { context_length: 128_000, max_completion_tokens: 32_000 },
    ...overrides,
  };
}

async function catalog(models: unknown[]) {
  const originalFetch = globalThis.fetch;
  const urls: string[] = [];
  globalThis.fetch = async input => {
    const url = String(input);
    urls.push(url);
    assert.ok(url.endsWith('/key') || url.endsWith('/models'), 'setup must not generate');
    return new Response(JSON.stringify(url.endsWith('/key') ? { data: {} } : { data: models }));
  };
  try {
    const leases = new OpenRouterLeases();
    const lease = await leases.connect('project', 'owner', 'sk-or-fixture-key');
    assert.equal(urls.length, 2);
    return { leases, lease };
  } finally { globalThis.fetch = originalFetch; }
}

test('BYOK roles exclude unknown capacity and JSON-mode-only choices', async () => {
  const { lease, leases } = await catalog([
    model('both'),
    model('interpretation-only', { context_length: 32_000, top_provider: { context_length: 32_000, max_completion_tokens: 8_000 } }),
    model('unknown-output', { top_provider: { context_length: 128_000 } }),
    model('json-only', { supported_parameters: ['response_format', 'max_tokens'] }),
    model('small-output', { top_provider: { context_length: 128_000, max_completion_tokens: 2_000 } }),
    model('small-provider-context', { top_provider: { context_length: 16_000, max_completion_tokens: 32_000 } }),
    model('no-text-input', { architecture: { input_modalities: ['image'], output_modalities: ['text'] } }),
  ]);
  assert.deepEqual(lease.builders.map(item => item.id), ['both']);
  assert.deepEqual(lease.interpreters.map(item => item.id).sort(), ['both', 'interpretation-only']);
  assert.throws(() => leases.model('project', lease.handle, 'builder', 'interpretation-only'), /compatible builder/);
  leases.model('project', lease.handle, 'personal', 'interpretation-only');
});

test('FREE requires explicit zero pricing; missing prices never become zero', async () => {
  const { lease } = await catalog([
    model('paid'),
    model('free', { pricing: { prompt: '0', completion: '0' } }),
    model('request-fee', { pricing: { prompt: '0', completion: '0', request: '0.01' } }),
    model('reasoning-fee', { pricing: { prompt: '0', completion: '0', internal_reasoning: '0.000001' } }),
    model('missing-price', { pricing: { prompt: null, completion: '' } }),
    model('unknown-fee', { pricing: { prompt: '0', completion: '0', request: 'unknown' } }),
  ]);
  assert.deepEqual(lease.builders.filter(item => item.isFree).map(item => item.id), ['free']);
  assert.ok(!lease.builders.some(item => ['missing-price', 'unknown-fee'].includes(item.id)));
  assert.equal(lease.builders.find(item => item.id === 'request-fee')?.requestPriceUsd, 0.01);
});

test('bounded reasoning settings replace default-max; unknown mandatory reasoning is excluded', async () => {
  const { lease } = await catalog([
    model('kimi-k3', { supported_parameters: ['max_tokens', 'response_format', 'structured_outputs', 'reasoning'], reasoning: { mandatory: false, default_effort: 'max', supported_efforts: ['max', 'high', 'low', 'none'] } }),
    model('muse-open', { supported_parameters: ['max_tokens', 'response_format', 'structured_outputs', 'reasoning'], reasoning: { mandatory: true, default_effort: 'medium', supported_efforts: ['xhigh', 'high', 'medium', 'low'] } }),
    model('optional-thinking', { supported_parameters: ['max_tokens', 'response_format', 'structured_outputs', 'reasoning'], reasoning: { mandatory: false } }),
    model('unknown-thinking', { supported_parameters: ['max_tokens', 'response_format', 'structured_outputs', 'reasoning'], reasoning: { mandatory: true } }),
    model('uncontrolled-thinking', { reasoning: { mandatory: true, supported_efforts: ['low'] } }),
    model('all-efforts', { supported_parameters: ['max_tokens', 'response_format', 'structured_outputs', 'reasoning'], reasoning: { mandatory: true, supported_efforts: null } }),
    model('minimal-only', { supported_parameters: ['max_tokens', 'response_format', 'structured_outputs', 'reasoning'], reasoning: { mandatory: true, supported_efforts: ['high', 'minimal'] } }),
  ]);
  assert.deepEqual(lease.builders.map(item => item.id), ['kimi-k3', 'muse-open', 'optional-thinking', 'all-efforts', 'minimal-only']);
  assert.deepEqual(lease.builders.map(item => item.reasoningConfig), [{ effort: 'low' }, { effort: 'low' }, { enabled: false }, { effort: 'low' }, { effort: 'minimal' }]);
});
