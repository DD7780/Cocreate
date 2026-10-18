import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { RoomManager } from '../server/rooms.js';
import { extractRequirement, generateProjectPlan } from '../server/generator.js';
import { generateStructured, ProviderError } from '../server/providers.js';

const schema = { type: 'object', additionalProperties: false, required: ['value'], properties: { value: { type: 'string' } } };

test('saved Kimi/Muse policies reach interpretation, generation and bounded file recovery', async () => {
  const originalFetch = globalThis.fetch, bodies: any[] = [];
  const dataDir = mkdtempSync(join(tmpdir(), 'byok-role-dispatch-'));
  const manager = new RoomManager({ dataDir, debounceMs: 1000, encryptionSecret: 'fixture', mvpByokOnly: true });
  const text = 'Make a blue page.';
  let builderCalls = 0;
  globalThis.fetch = async (input, init) => {
    if (String(input).endsWith('/key')) return Response.json({ data: {} });
    if (String(input).endsWith('/models')) return Response.json({ data: ['moonshotai/kimi-k3', 'meta/muse-spark-open'].map(id => ({
      id, name: id, architecture: { input_modalities: ['text'], output_modalities: ['text'] },
      supported_parameters: ['max_tokens', 'response_format', 'structured_outputs', 'reasoning'],
      pricing: { prompt: '0.000001', completion: '0.000002' }, context_length: 1_048_576,
      top_provider: { context_length: 1_048_576, max_completion_tokens: 943_718 },
      reasoning: { mandatory: id.startsWith('meta/'), supported_efforts: ['max', 'medium', 'low'], default_effort: id.startsWith('moonshotai/') ? 'max' : 'medium' },
    })) });
    const body = JSON.parse(String(init?.body)); bodies.push(body);
    let value: unknown, finish = 'stop';
    if (body.model === 'moonshotai/kimi-k3') {
      value = { goals: [text], features: [], design: [], constraints: [], questions: [], additions: [], modifications: [], withdrawals: [], classification: 'explicit_request', affectedRequirementIds: [], sourcePassages: [text], intents: [{ text, category: 'goal', classification: 'explicit_request', rationale: 'Direct request', sourcePassage: text, affectedRequirementIds: [] }] };
    } else if (++builderCalls === 1) { value = {}; finish = 'length'; }
    else if (body.response_format.json_schema.schema.required.includes('tasks')) value = { tasks: [{ title: 'Blue page', path: 'src/App.tsx', instruction: 'Create the page.' }] };
    else value = { summary: 'Blue page', decisions: [], conflicts: [], specification: { agreed: [], proposed: [], questions: [] }, operations: [{ type: 'write', path: 'src/App.tsx', content: 'export default function App(){return <main>Blue page</main>}' }] };
    return Response.json({ choices: [{ message: { content: JSON.stringify(value) }, finish_reason: finish }], usage: { prompt_tokens: 10, completion_tokens: 10 } });
  };
  try {
    const room = manager.create('role-dispatch'); manager.join(room, 'owner', 'Owner');
    const lease = await manager.connectTemporaryOpenRouter(room, 'owner', 'sk-or-fixture-private');
    manager.saveTemporaryModels(room, 'owner', lease.handle, 'moonshotai/kimi-k3', 'meta/muse-spark-open');
    assert.equal(bodies.length, 0, 'connect/save must remain inference-free');
    const personal = (manager as any).aiConfigFrom(room, 'personal', room.ai.personal);
    const builder = (manager as any).aiConfigFrom(room, 'builder', room.ai.builder);
    await extractRequirement(personal, 'owner', 'Owner', [{ seq: 1, kind: 'insert', before: '', after: text }], '', undefined, 1);
    const result = await generateProjectPlan(builder, [], undefined);
    assert.equal(result.value.operations.length, 1);
    assert.equal(bodies.length, 4);
    assert.deepEqual(bodies.map(body => body.max_tokens), [2_400, 8_000, 2_000, 8_000]);
    for (const body of bodies) {
      assert.deepEqual(body.reasoning, { effort: 'low' });
      assert.equal(body.provider.require_parameters, true);
      assert.equal(body.response_format.type, 'json_schema');
      assert.equal(body.response_format.json_schema.strict, true);
    }
  } finally { globalThis.fetch = originalFetch; manager.shutdown(); rmSync(dataDir, { recursive: true, force: true }); }
});

test('OpenRouter schema rejection cannot fall back to unstructured paid generation', async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; return Response.json({ error: { message: 'This model does not support structured outputs.' } }, { status: 400 }); };
  try {
    await assert.rejects(() => generateStructured({ provider: 'openrouter', baseUrl: 'https://openrouter.ai/api/v1', apiKey: 'fixture' }, { model: 'fixture', input: '{}', instructions: 'Return JSON.', schema }), error => error instanceof ProviderError && error.kind === 'unsupported');
    assert.equal(calls, 1);
  } finally { globalThis.fetch = originalFetch; }
});

test('credit errors retain safe diagnostics and suggest a free choice without echoing upstream text or retrying', async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; return Response.json({ error: { message: 'Requested 8000 tokens, but can only afford 1000.' } }, { status: 402 }); };
  try {
    await assert.rejects(() => generateStructured({ provider: 'openrouter', baseUrl: 'https://openrouter.ai/api/v1', apiKey: 'fixture' }, { model: 'fixture', input: '{}', instructions: 'Return JSON.', schema }), error => error instanceof ProviderError && error.kind === 'balance' && /FREE model/.test(error.message) && !/can only afford 1000/.test(error.message) && error.diagnostics?.httpStatus===402);
    assert.equal(calls, 1);
  } finally { globalThis.fetch = originalFetch; }
});
