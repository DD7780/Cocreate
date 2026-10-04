import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { RoomManager } from '../server/rooms.js';
import { generateText } from '../server/providers.js';
import { openBudget, updateBudget, restoreBudget, recoverWorkflowBudget, remainingAllowanceUsd } from '../server/workflow-budget.js';
import type { ProviderRequestRecord } from '../src/types.js';

const entry=(callId:string,patch:Partial<ProviderRequestRecord>={}):ProviderRequestRecord=>({callId,workspaceId:'room',purpose:'interpretation',provider:'custom',configurationVersion:'controlled',startedAt:'2026-10-04T00:00:00Z',outcome:'dispatching',estimatedInputTokens:10,estimatedOutputTokens:50,usage:{},usageStatus:'estimated',reservedChargeUsd:.4,...patch});

test('physical reservations retain uncertainty, settle once, and reject delayed intent or usage downgrade',()=>{
  const budget=openBudget('workflow',1);
  updateBudget(budget,entry('one'));updateBudget(budget,entry('one'));
  updateBudget(budget,entry('one',{outcome:'unknown',endedAt:'2026-10-04T00:01:00Z',usageStatus:'unknown'}));
  assert.equal(budget.calls,1);assert.equal(budget.reservedUsd,.4);assert.equal(budget.uncertainCalls,1);
  const final=entry('one',{outcome:'succeeded',endedAt:'2026-10-04T00:02:00Z',usageStatus:'measured',usage:{inputTokens:10,outputTokens:2},estimatedChargeUsd:.05,chargeIncomplete:false});
  updateBudget(budget,final);updateBudget(budget,final);updateBudget(budget,entry('one'));
  updateBudget(budget,entry('one',{outcome:'unknown',endedAt:'2026-10-04T00:03:00Z',usageStatus:'unknown'}));
  assert.equal(budget.calls,1);assert.equal(budget.reservedUsd,.05);assert.equal(budget.uncertainCalls,0);
  updateBudget(budget,entry('two',{reservedChargeUsd:.9}));
  assert.throws(()=>updateBudget(budget,entry('three')),/spending limit/);
  assert.equal(budget.calls,2);
  assert.ok(Math.abs(remainingAllowanceUsd(budget,2)-.05)<1e-9,'a future setting cannot expand an active scope');
  budget.closed=true;assert.equal(remainingAllowanceUsd(budget,2),2,'a new explicit cycle uses its future setting');
  assert.equal(budget.maximumUsd,1);assert.equal(budget.calls,2,'closed scope history remains intact');
});

test('ledger repairs a stale snapshot without replenishment and legacy interrupted scope fails closed',()=>{
  const budget=openBudget('workflow',1);const snapshot=structuredClone(budget);
  const dispatched=updateBudget(budget,entry('one'));
  const restored=restoreBudget(snapshot,[dispatched,dispatched])!;
  assert.equal(restored.calls,1);assert.equal(restored.reservedUsd,.4);assert.equal(restored.uncertainCalls,1);
  assert.throws(()=>restoreBudget({...snapshot,maximumCalls:100},[]),/invalid/);
  const legacy=recoverWorkflowBudget({status:'Error'},[])!;
  assert.equal(legacy.calls,0);assert.equal(legacy.legacyAllowanceUnknown,true);
  assert.throws(()=>updateBudget(legacy,entry('next')),/explicit owner reset/);
});

async function fixture(durableStore?:any,authorizeBudgetReset?:(projectId:string,actorId:string)=>Promise<void>) {
  let calls=0;
  const server=http.createServer(async(req,res)=>{for await(const _chunk of req){}calls++;res.setHeader('content-type','application/json');res.end(JSON.stringify({output_text:'OK',usage:{input_tokens:10,output_tokens:2}}));});
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'durable-budget-'));
  let manager=new RoomManager({dataDir:dir,debounceMs:10,encryptionSecret:'synthetic',durableStore,authorizeBudgetReset});
  let room=manager.create('room');manager.join(room,'owner','Owner');
  const config={provider:'custom' as const,baseUrl:`http://127.0.0.1:${(server.address() as any).port}`,apiKey:'synthetic',apiFormat:'responses' as const};
  return {get manager(){return manager;},get room(){return room;},get calls(){return calls;},
    call(purpose='interpretation',setup?:any){return (manager as any).tracked(room,{purpose,provider:'custom',model:'fixture',submissionId:purpose==='interpretation'?'submission':undefined,workflowRunId:purpose==='builder'?'run':undefined,setup,estimatedOutputTokens:64},()=>generateText(config,{model:'fixture',instructions:'Test',input:'Test',maxOutputTokens:64}));},
    reopen(){manager.shutdown();manager=new RoomManager({dataDir:dir,debounceMs:10,encryptionSecret:'synthetic'});room=manager.get('room')!;},
    close(){manager.shutdown();server.closeAllConnections();server.close();const target=path.resolve(dir);assert.equal(path.dirname(target),path.resolve(os.tmpdir()));assert.match(path.basename(target),/^durable-budget-/);fs.rmSync(target,{recursive:true,force:true});},
  };
}

test('concurrent interpretation and builder admission stops at 24, setup is separate, SQLite restart retains attempts',async()=>{
  const f=await fixture();
  try {
    const results=await Promise.allSettled(Array.from({length:26},(_,i)=>f.call(i%2?'builder':'interpretation')));
    assert.equal(results.filter(item=>item.status==='fulfilled').length,24);assert.equal(f.calls,24);
    const id=f.room.executionBudget!.id;
    await f.call('capability_text');assert.equal(f.calls,25);assert.equal(f.room.executionBudget!.calls,24);
    const records=f.manager.eventStore.allProviderRequestRecordsForWorkspace('room');
    assert.equal(new Set(records.map(record=>record.callId)).size,25);
    assert.equal(records.filter(record=>record.budgetScopeKind==='setup').length,1);
    f.reopen();assert.equal(f.room.executionBudget!.id,id);assert.equal(f.room.executionBudget!.calls,24);
    await assert.rejects(f.call('builder'),/24 physical-call/);assert.equal(f.calls,25);
  }finally{f.close();}
});

test('owner reset is idle, fenced and durable; replay/collision cannot reset again or dispatch inference',async()=>{
  const f=await fixture();
  try {
    await f.call();const id=f.room.executionBudget!.id;
    await assert.rejects(f.manager.resetWorkflowBudget(f.room,'editor','reset',id),/Only/);
    await f.manager.resetWorkflowBudget(f.room,'owner','reset',id);const next=f.room.executionBudget!.id;
    assert.notEqual(next,id);assert.equal(f.calls,1);
    f.reopen();await f.manager.resetWorkflowBudget(f.room,'owner','reset',id);
    assert.equal(f.room.executionBudget!.id,next);
    await assert.rejects(f.manager.resetWorkflowBudget(f.room,'owner','reset',next),/reused/);
    await f.call();assert.equal(f.room.executionBudget!.calls,1);assert.equal(f.calls,2);
  }finally{f.close();}
});

test('remote reservation acknowledgement precedes HTTP; uncertain save fences further calls',async()=>{
  let release:(()=>void)|undefined,hold=false,reject=false;const records:ProviderRequestRecord[]=[];
  const f=await fixture({assertCoordinator:async()=>{},recordProviderRequest:async(record:ProviderRequestRecord)=>{records.push(record);},saveSnapshot:async(_id:string,_rev:number,payload:any)=>{
    if(payload.executionBudget?.calls===1&&hold){await new Promise<void>(resolve=>{release=resolve});if(reject)throw new Error('lost acknowledgement');}
  }});
  try {
    await f.room.persistQueue;hold=true;const attempt=f.call();
    for(let i=0;i<100&&!release;i++)await new Promise(resolve=>setTimeout(resolve,10));
    assert.ok(release);assert.equal(f.calls,0);assert.equal(records.length,0);
    reject=true;release!();await assert.rejects(attempt,/persistence failed/);
    await assert.rejects(f.call());assert.equal(f.calls,0);
    assert.equal(f.room.executionBudget!.uncertainCalls,1);
  }finally{f.close();}
});

test('work starting during owner authorization cannot reset an active allowance',async()=>{
  let release!:()=>void,entered!:()=>void;
  const enteredGate=new Promise<void>(resolve=>{entered=resolve});
  const gate=new Promise<void>(resolve=>{release=resolve});
  const f=await fixture(undefined,async()=>{entered();await gate;});
  try {
    await f.call();const id=f.room.executionBudget!.id;
    const reset=f.manager.resetWorkflowBudget(f.room,'owner','racing-reset',id);
    await enteredGate;f.room.buildTask=Promise.resolve();release();
    await assert.rejects(reset,/changed while authorizing/);
    assert.equal(f.room.executionBudget!.id,id);assert.equal(f.room.executionBudget!.calls,1);
    assert.equal(f.calls,1);assert.equal(f.room.budgetResetReceipts,undefined);
  }finally{release();f.room.buildTask=undefined;f.close();}
});
