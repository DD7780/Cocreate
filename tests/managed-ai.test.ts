import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { RoomManager } from '../server/rooms.js';
import { OpenRouterLeases } from '../server/byok-lease.js';
import { generateText } from '../server/providers.js';
import { managedBuilder, managedCatalog, managedSetup } from '../server/managed-catalog.js';
import { scoreManagedTrials } from '../server/managed-qualification.js';

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

test('managed assignments remain historical and cannot dispatch', () => {
  const dataDir=mkdtempSync(join(tmpdir(),'cocreate-managed-disabled-'));
  const manager=new RoomManager({debounceMs:1000,encryptionSecret:'test',dataDir,managedOpenRouterKey:'founder-test-key'});
  try{
    const room=manager.create('historical');manager.join(room,'owner','Owner');
    manager.selectManagedBuilder(room,'google/gemini-3.8-flash');
    assert.equal(manager.view(room).ai.status,'disconnected');
    assert.equal(JSON.stringify(manager.view(room)).includes('founder-test-key'),false);
    assert.throws(()=>(manager as any).tracked(room,{purpose:'builder',provider:'openrouter',model:room.ai.builder!.model,actorId:'owner',setup:room.ai.setup},async()=>{throw new Error('provider called')}),/disabled in the MVP/);
    assert.equal(room.providerCalls.length,0);
  }finally{manager.shutdown();rmSync(dataDir,{recursive:true,force:true})}
});

test('temporary OpenRouter setup validates without generation and saves no secret',async()=>{
  const originalFetch=globalThis.fetch,urls:string[]=[];
  const model=(id:string)=>({id,name:id,architecture:{output_modalities:['text']},supported_parameters:['response_format'],pricing:{prompt:'0.000001',completion:'0.000002'},context_length:64000});
  globalThis.fetch=async(input)=>{const url=String(input);urls.push(url);if(url.endsWith('/key'))return new Response(JSON.stringify({data:{limit_remaining:10}}),{status:200});if(url.endsWith('/models'))return new Response(JSON.stringify({data:[model('google/gemini-3.8-flash'),model('deepseek/deepseek-v4.1-flash')]}),{status:200});throw new Error('Generation request was made during setup')};
  const dataDir=mkdtempSync(join(tmpdir(),'cocreate-byok-'));
  const manager=new RoomManager({debounceMs:1000,encryptionSecret:'test',dataDir,mvpByokOnly:true});
  try{
    const room=manager.create('byok');manager.join(room,'owner','Owner');manager.join(room,'editor','Editor');
    assert.equal(manager.view(room).ai.status,'disconnected');
    const lease=await manager.connectTemporaryOpenRouter(room,'owner','sk-or-test-private-key');
    assert.equal(urls.length,2);
    assert.ok(urls.every(url=>url.endsWith('/key')||url.endsWith('/models')));
    assert.equal(manager.view(room).ai.status,'disconnected');
    assert.throws(()=>manager.saveTemporaryModels(room,'owner',lease.handle,'','google/gemini-3.8-flash'),/Choose a currently compatible/);
    assert.throws(()=>manager.saveTemporaryModels(room,'owner',lease.handle,'deepseek/deepseek-v4.1-flash','forged/model'),/Choose a currently compatible/);
    manager.saveTemporaryModels(room,'owner',lease.handle,'deepseek/deepseek-v4.1-flash','google/gemini-3.8-flash');
    assert.equal(manager.view(room).ai.personalModel,'deepseek/deepseek-v4.1-flash');
    assert.equal(manager.view(room).ai.builderModel,'google/gemini-3.8-flash');
    assert.equal((manager as any).aiConfigFrom(room,'personal',room.ai.personal).model,'deepseek/deepseek-v4.1-flash');
    assert.equal((manager as any).aiConfigFrom(room,'builder',room.ai.builder).model,'google/gemini-3.8-flash');
    assert.equal(manager.view(room).ai.status,'connected');
    assert.throws(()=>manager.byok.require(room.id,lease.handle,'editor'),/not authorized/);
    manager.authorizeTemporarySpender(room,'owner','editor',true);
    assert.equal(manager.byok.require(room.id,lease.handle,'editor').handle,lease.handle);
    const state=JSON.stringify(manager.view(room)),saved=readFileSync(join(dataDir,'byok.json'),'utf8');
    assert.equal(state.includes('sk-or-test-private-key'),false);
    assert.equal(saved.includes('sk-or-test-private-key'),false);
    manager.disconnectTemporaryOpenRouter(room,'owner');
    assert.equal(manager.view(room).ai.status,'disconnected');
    assert.throws(()=>manager.byok.require(room.id,lease.handle,'owner'),/expired or was lost/);
  }finally{manager.shutdown();globalThis.fetch=originalFetch;rmSync(dataDir,{recursive:true,force:true})}
});

test('temporary key lease expires and is lost after restart',async()=>{
  const oldFetch=globalThis.fetch,oldNow=Date.now;
  globalThis.fetch=async(input)=>new Response(JSON.stringify(String(input).endsWith('/key')?{data:{}}:{data:[{id:'deepseek/deepseek-v4.1-flash',name:'DeepSeek',architecture:{output_modalities:['text']},supported_parameters:['response_format'],pricing:{prompt:'0.000001',completion:'0.000002'},context_length:64000}]}),{status:200});
  try{const leases=new OpenRouterLeases(),start=oldNow();Date.now=()=>start;const lease=await leases.connect('project','owner','sk-or-private');assert.equal(new OpenRouterLeases().status('project'),undefined);Date.now=()=>start+2*60*60*1000+1;assert.equal(leases.status('project'),undefined);assert.throws(()=>leases.require('project',lease.handle),/expired or was lost/)}finally{Date.now=oldNow;globalThis.fetch=oldFetch}
});

test('explicit builder reaches the OpenRouter request; unauthorized editor cannot dispatch',async()=>{
  const originalFetch=globalThis.fetch,requests:{url:string;model?:string;authorization?:string}[]=[];
  const model=(id:string)=>({id,name:id,architecture:{output_modalities:['text']},supported_parameters:['response_format'],pricing:{prompt:'0.000001',completion:'0.000002'},context_length:64000});
  globalThis.fetch=async(input,init)=>{const url=String(input);requests.push({url,model:init?.body?JSON.parse(String(init.body)).model:undefined,authorization:new Headers(init?.headers).get('Authorization')||undefined});if(url.endsWith('/key'))return new Response(JSON.stringify({data:{limit_remaining:10}}),{status:200});if(url.endsWith('/models'))return new Response(JSON.stringify({data:[model('google/gemini-3.8-flash'),model('deepseek/deepseek-v4.1-flash')]}),{status:200});return new Response(JSON.stringify({choices:[{message:{content:'OK'},finish_reason:'stop'}],usage:{prompt_tokens:8,completion_tokens:2}}),{status:200,headers:{'content-type':'application/json'}})};
  const dataDir=mkdtempSync(join(tmpdir(),'cocreate-byok-dispatch-')),manager=new RoomManager({debounceMs:1000,encryptionSecret:'test',dataDir,mvpByokOnly:true});
  try{
    const room=manager.create('dispatch');manager.join(room,'owner','Owner');manager.join(room,'editor','Editor');
    const lease=await manager.connectTemporaryOpenRouter(room,'owner','sk-or-test-private-key');manager.saveTemporaryModels(room,'owner',lease.handle,'deepseek/deepseek-v4.1-flash','google/gemini-3.8-flash');
    const setup=structuredClone(room.ai.setup),config=(manager as any).aiConfigFrom(room,'builder',room.ai.builder,setup);
    (manager as any).reserveBudget(room,'builder',setup);
    await assert.rejects((manager as any).tracked(room,{purpose:'builder',provider:'openrouter',model:config.model,actorId:'editor',setup,estimatedOutputTokens:32},()=>generateText(config,{model:config.model,instructions:'Reply OK.',input:'Test',maxOutputTokens:32})),/not authorized/);
    assert.equal(requests.filter(item=>item.url.endsWith('/chat/completions')).length,0);
    const result=await (manager as any).tracked(room,{purpose:'builder',provider:'openrouter',model:config.model,actorId:'owner',setup,estimatedOutputTokens:32},()=>generateText(config,{model:config.model,instructions:'Reply OK.',input:'Test',maxOutputTokens:32}));
    assert.equal(result.text,'OK');
    assert.equal(requests.at(-1)?.model,'google/gemini-3.8-flash');
    assert.equal(requests.at(-1)?.authorization,'Bearer sk-or-test-private-key');
    assert.equal(room.providerCalls.at(-1)?.outcome,'succeeded');
  }finally{manager.shutdown();globalThis.fetch=originalFetch;rmSync(dataDir,{recursive:true,force:true})}
});
