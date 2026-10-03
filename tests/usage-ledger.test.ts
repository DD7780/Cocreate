import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import os from'node:os';import path from'node:path';
import{aggregatePhysicalUsage}from'../server/usage-ledger.js';
import{EventStore}from'../server/event-store.js';
import type{ProviderRequestRecord}from'../shared/types.js';
const call=(callId:string,overrides:Partial<ProviderRequestRecord>={}):ProviderRequestRecord=>({callId,workspaceId:'room',purpose:'builder',provider:'openrouter',configurationVersion:'test',startedAt:'2026-09-30T00:00:00Z',outcome:'succeeded',estimatedInputTokens:0,usage:{inputTokens:10,outputTokens:5},usageStatus:'measured',...overrides});
test('physical usage deduplicates dispatch/reconcile and keeps setup and unknown calls visible',()=>{
  const result=aggregatePhysicalUsage([call('one',{outcome:'dispatching',usage:{}}),call('one'),call('two',{purpose:'capability_text',usage:{inputTokens:2,outputTokens:3}}),call('three',{outcome:'unknown',usage:{},usageStatus:'unknown'})]);
  assert.equal(result.recorded.requests,3);assert.equal(result.recorded.inputTokens,12);assert.equal(result.recorded.outputTokens,8);
  assert.equal(result.generation.requests,2);assert.equal(result.setup.requests,1);assert.equal(result.unknownUsageRequests,1);
  assert.equal(result.coverage,'partial');
});
test('SQLite accounting restores more than the recent 500 calls without double counting',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'cocreate-usage-'));
  try{
    let store=new EventStore(dir);
    for(let index=0;index<520;index++){
      const entry=call(`call-${index}`);
      store.append({workspaceId:'room',actorId:'provider',actorType:'system',eventType:'provider.request_dispatched',payload:{...entry,outcome:'dispatching',usage:{}}});
      store.append({workspaceId:'room',actorId:'provider',actorType:'system',eventType:'provider.request_reconciled',payload:entry});
    }
    store.close();store=new EventStore(dir);
    const restored=store.allProviderRequestRecordsForWorkspace('room');
    assert.equal(restored.length,520);assert.equal(aggregatePhysicalUsage(restored).recorded.inputTokens,5200);
    store.close();
  }finally{fs.rmSync(dir,{recursive:true,force:true})}
});
test('optional token fields remain optional and replay cannot replace a newer final usage record',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'usage-replay-')),store=new EventStore(dir);
  try{
    const latest=call('one',{endedAt:'2026-10-01T01:00:00Z',usage:{inputTokens:10,outputTokens:5,cachedInputTokens:undefined,reasoningTokens:undefined}});
    store.append({workspaceId:'room',actorId:'provider',actorType:'system',eventType:'provider.request_reconciled',payload:latest});
    const projection=store.exportHarness('room');store.restoreHarness('room',projection);
    store.append({workspaceId:'room',actorId:'provider',actorType:'system',eventType:'provider.request_reconciled',payload:call('one',{endedAt:'2026-10-01T00:00:00Z',usage:{inputTokens:1,outputTokens:2}})});
    store.append({workspaceId:'room',actorId:'provider',actorType:'system',eventType:'provider.request_dispatched',payload:call('one',{outcome:'dispatching',usage:{}})});
    const total=aggregatePhysicalUsage(store.allProviderRequestRecordsForWorkspace('room'));
    assert.equal(total.recorded.requests,1);assert.equal(total.recorded.inputTokens,10);assert.equal(total.recorded.outputTokens,5);assert.equal(total.unknownUsageRequests,0);
  }finally{store.close();fs.rmSync(dir,{recursive:true,force:true});}
});
