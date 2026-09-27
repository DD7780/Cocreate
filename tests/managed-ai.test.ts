import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { RoomManager } from '../server/rooms.js';
import { managedBuilder, managedCatalog, managedSetup } from '../server/managed-catalog.js';
import { scoreManagedTrials } from '../server/managed-qualification.js';
import { generateText } from '../server/providers.js';

test('managed catalog is bounded, exact, and rejects forged builder IDs', () => {
  assert.equal(managedCatalog.length, 13);
  assert.equal(managedCatalog.filter(item => item.featured).length, 3);
  assert.equal(managedSetup().resolved?.builder.model, 'google/gemini-3.8-flash');
  assert.equal(managedBuilder('openai/gpt-6-astra'), undefined);
  assert.equal(managedBuilder('google/gemini-3.8-flash:free'), undefined);
});

test('qualification keeps a single successful fixture provisional', () => {
  const result=scoreManagedTrials([{modelId:'google/gemini-3.8-flash',fixtureId:'restaurant-red-logo',
    trial:1,catalogVersion:'test',physicalCalls:1,repairs:0,inputTokens:100,outputTokens:50,
    reasoningTokens:0,billedCostUsd:.01,latencyMs:1000,
    checks:{'red logo visible':true},visualScore:4,visualReviewer:'human',
    schemaValid:true,compilationPassed:true,evidence:'browser recording #1'}]);
  assert.equal(result[0].qualificationReady,false);
  assert.ok(result[0].missingFixtures.includes('dashboard-state'));
});

test('managed reservations block provider dispatch and keep the founder key out of room state', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'cocreate-managed-'));
  const originalFetch = globalThis.fetch;
  let fetches = 0, reserves = 0;
  globalThis.fetch = async () => { fetches++; throw new Error('Provider dispatch must be blocked.'); };
  const manager = new RoomManager({ debounceMs: 1000, encryptionSecret: 'test-secret',
    managedOpenRouterKey: 'founder-test-key', dataDir,
    durableStore: {
      saveSnapshot: async () => ({}), appendDocumentUpdate: async () => ({}),
      reserveManagedRequest: async () => { reserves++; throw new Error('Insufficient managed credits'); },
      settleManagedRequest: async () => { throw new Error('No request was dispatched.'); },
    },
  });
  try {
    const room = manager.create('managed-test');
    manager.join(room, 'owner', 'Owner');
    manager.selectManagedBuilder(room, 'google/gemini-3.8-flash');
    assert.equal(JSON.stringify(manager.view(room)).includes('founder-test-key'), false);
    assert.throws(() => manager.selectManagedBuilder(room, 'forged/model'), /not enabled/i);
    await assert.rejects(() => (manager as any).tracked(room, {
      purpose: 'interpretation', provider: 'openrouter', model: room.ai.personal!.model,
      actorId: 'owner', setup: room.ai.setup, estimatedOutputTokens: 64,
    }, () => generateText({provider:'openrouter',baseUrl:'https://openrouter.ai/api/v1',apiKey:'founder-test-key'},
      {model:room.ai.personal!.model,instructions:'Reply OK.',input:'Test',maxOutputTokens:64})), /Insufficient managed credits/);
    assert.equal(reserves, 1);
    assert.equal(fetches, 0);
  } finally { manager.shutdown(); globalThis.fetch = originalFetch; rmSync(dataDir,{recursive:true,force:true}); }
});

test('managed provider request applies privacy policy and reconciles measured usage', async () => {
  const dataDir = mkdtempSync(join(tmpdir(), 'cocreate-managed-'));
  const originalFetch = globalThis.fetch;
  const reservations:unknown[] = [],settlements:unknown[] = [];
  globalThis.fetch = async (_url,init) => {
    const body = JSON.parse(String(init?.body));
    assert.deepEqual(body.provider,{allow_fallbacks:false,data_collection:'deny',zdr:true,require_parameters:true,max_price:{prompt:.75,completion:3.75}});
    assert.equal(body.model,'google/gemini-3.8-flash');
    assert.equal(body.reasoning,undefined);
    return new Response(JSON.stringify({choices:[{message:{content:'OK'},finish_reason:'stop'}],usage:{prompt_tokens:20,completion_tokens:2,cost:.000123}}),{status:200,headers:{'content-type':'application/json'}});
  };
  const manager = new RoomManager({ debounceMs: 1000, encryptionSecret: 'test-secret',
    managedOpenRouterKey: 'founder-test-key', dataDir,
    durableStore: {saveSnapshot:async()=>({}),appendDocumentUpdate:async()=>({}),
      reserveManagedRequest:async input=>{reservations.push(input)},
      settleManagedRequest:async input=>{settlements.push(input)}},
  });
  try {
    const room=manager.create('managed-test');manager.join(room,'owner','Owner');
    manager.selectManagedBuilder(room,'google/gemini-3.8-flash');
    const result=await (manager as any).tracked(room,{purpose:'builder',provider:'openrouter',
      model:room.ai.builder!.model,actorId:'owner',setup:room.ai.setup,estimatedOutputTokens:64},
      ()=>generateText({provider:'openrouter',baseUrl:'https://openrouter.ai/api/v1',apiKey:'founder-test-key'},
        {model:room.ai.builder!.model,instructions:'Reply OK.',input:'Test',maxOutputTokens:64}));
    assert.equal(result.text,'OK');
    assert.equal(reservations.length,1);assert.equal(settlements.length,1);
    assert.equal((settlements[0] as {actualUsd:number}).actualUsd,.000123);
    assert.equal(room.providerCalls.at(-1)?.outcome,'succeeded');
  } finally { manager.shutdown();globalThis.fetch=originalFetch;rmSync(dataDir,{recursive:true,force:true}); }
});
