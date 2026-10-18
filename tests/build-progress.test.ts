import {usedBudget} from './fixtures/workflow-budget.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createProgressFixture, pause, waitFor } from './fixtures/build-progress.js';

test('later captured submissions cannot starve a fixed accepted candidate and drain in capture order',async()=>{
  const f=await createProgressFixture({hold:true,buildDebounceMs:500,buildMaxWaitMs:1_000});
  try{
    await f.submit('alice','Build a catalog','initial-catalog');
    await waitFor(()=>f.gates.has(1),'first candidate');
    f.edit('cara','Add an unsubmitted draft');
    for(let i=1;i<=4;i++)assert.equal((await f.submit('bob',`Add feature ${i}`,`queued-feature-${i}`)).status,'submitted');
    assert.equal(f.personal.length,1);assert.equal(f.room.specificationRevision,1);
    const queued=f.manager.view(f.room).buildProgress!;
    assert.equal(queued.buildingRevision,1);assert.equal(queued.pendingSubmissions,4);assert.equal(queued.availableVersion,null);
    const calls=f.personal.length+f.builders.length;await f.manager.submitChanges(f.room,'bob','queued-feature-4');assert.equal(f.personal.length+f.builders.length,calls);
    f.release(1);
    await waitFor(()=>f.room.versions.length===1,'first promotion while submissions wait').catch(error=>{console.error('Progress diagnostics',JSON.stringify({status:f.room.status,error:f.room.lastError,active:!!f.room.buildTask,versions:f.room.versions.map(item=>item.id),submissions:f.room.submissions.map(item=>item.status),personal:f.personal.length,builders:f.builders.length,budget:f.room.executionBudget}));throw error;});
    assert.equal(f.room.versions[0].specificationRevision,1);
    await waitFor(()=>f.gates.has(2),'next collected candidate');
    assert.equal(f.builders[1].accepted,5);assert.equal(f.room.executionBudget?.calls,7);
    assert.equal(f.manager.view(f.room).buildProgress!.availableRevision,1);
    assert.equal(f.manager.view(f.room).buildProgress!.buildingRevision,5);
    f.release(2);
    await waitFor(()=>!f.room.buildTask&&!f.room.buildTimer&&f.room.submissions.every(item=>item.status==='built'),'finite drain').catch(error=>{console.error('Drain diagnostics',JSON.stringify({status:f.room.status,error:f.room.lastError,active:!!f.room.buildTask,timer:!!f.room.buildTimer,closed:f.room.buildAdmissionClosed,versions:f.room.versions.map(item=>({id:item.id,revision:item.specificationRevision})),submissions:f.room.submissions.map(item=>({status:item.status,error:item.error})),personal:f.personal.length,builders:f.builders.length,budget:f.room.executionBudget}));throw error;});
    assert.deepEqual(f.personal.map(item=>item.actor),['alice','bob','bob','bob','bob']);
    assert.equal(f.builders.length,2);assert.equal(f.room.versions.length,2);assert.equal(f.room.pending.get('cara')?.length,1);
    assert.equal(f.manager.view(f.room).workflow.tasks.filter(item=>item.state==='stale').length,0);
    assert.equal(f.room.executionBudget?.closed,true);
  }finally{await f.close();}
});

test('collection deadline closes admission despite an interpretation backlog',async()=>{
  const f=await createProgressFixture({hold:true,personalDelayMs:100,buildMaxWaitMs:80});
  try{
    const pending=Array.from({length:6},(_,i)=>f.submit(i%2?'bob':'alice',`Add numbered capability ${i}`,`deadline-feature-${i}`));
    const settled=Promise.all(pending);
    await waitFor(()=>f.gates.has(1),'deadline candidate');await settled;
    assert.ok(f.personal.length<6,'queued interpretations cannot extend the closed collection');
    assert.ok(f.room.submissions.some(item=>item.status==='submitted'));
    assert.equal(f.manager.view(f.room).buildProgress!.buildingRevision,f.room.specificationRevision);
    assert.ok(f.builders[0].accepted<=2,'only the first acceptance and at most one already-running interpretation pass the cutoff');
    f.release(1);await waitFor(()=>f.room.versions.length===1,'bounded first progress');
  }finally{await f.close();}
});

test('pending captured steering survives actual local restart without inference or replay spending',async()=>{
  const f=await createProgressFixture({hold:true});
  try{
    await f.submit('alice','Build a catalog','restart-initial');await waitFor(()=>f.gates.has(1),'held candidate');
    await f.submit('bob','Add saved favorites','restart-pending');await f.room.persistQueue;
    const calls=f.personal.length+f.builders.length;
    await f.reopen();await pause(100);
    assert.equal(f.personal.length+f.builders.length,calls);assert.ok(f.room.pending.get('bob')?.some(item=>item.after.includes('favorites')));
    assert.equal((await f.manager.submitChanges(f.room,'bob','restart-pending')).status,'failed');assert.equal(f.personal.length+f.builders.length,calls);
    assert.equal(f.room.buildTask,undefined);assert.equal(f.room.buildTimer,undefined);
  }finally{await f.close();}
});

test('explicit correction bypasses deferred submissions, cancels assumptions and retains executor allowance',async()=>{
  const f=await createProgressFixture({hold:true});
  try{
    await f.submit('alice','Build a catalog','correct-initial');await waitFor(()=>f.gates.has(1),'candidate');
    await f.submit('bob','Add saved favorites','correct-pending');
    const budgetId=f.room.executionBudget?.id;const target=f.room.sharedRequirements[0];
    await f.manager.mutateIntent(f.room,'alice',{requestId:'correct-during-build',specificationRevision:f.room.specificationRevision,target:{kind:'requirement',id:target.id,revision:target.revision},action:'correct',text:'Build a searchable catalog',category:'goal',classification:'explicit_request'});
    await waitFor(()=>!f.room.buildTask,'correction abort');
    assert.equal(f.room.versions.length,0);assert.equal(f.room.executionBudget?.id,budgetId);assert.ok(f.room.executionBudget!.calls>=2);
    // Bob's already authorized captured command may subsequently build the corrected baseline.
    await waitFor(()=>f.gates.has(2),'authorized next candidate');
    assert.equal(f.room.executionBudget?.calls,4);f.release(2);await waitFor(()=>f.room.versions.length===1,'corrected promotion');
    assert.ok(f.room.versions[0].specificationRevision!>1);
  }finally{await f.close();}
});

test('current membership is rechecked before deferred interpretation dispatch',async()=>{
  let revoked=false;
  const f=await createProgressFixture({hold:true,authorize:async actor=>{if(revoked&&actor==='bob')throw new Error('Membership revoked');}});
  try{
    await f.submit('alice','Build a catalog','membership-initial');await waitFor(()=>f.gates.has(1),'candidate');
    await f.submit('bob','Add member favorites','membership-pending');revoked=true;f.release(1);
    await waitFor(()=>f.room.submissions.find(item=>item.requestId==='membership-pending')?.status==='failed','revocation before dispatch');
    assert.equal(f.personal.length,1);assert.equal(f.builders.length,1);assert.ok(f.room.pending.get('bob')?.length);
  }finally{await f.close();}
});

test('continuous captures do not replenish the executor ceiling between collected candidates',async()=>{
  const f=await createProgressFixture({hold:true});
  try{
    f.room.executionBudget=usedBudget(22);
    await f.submit('alice','Build a catalog','budget-initial');await waitFor(()=>f.gates.has(1),'last permitted candidate');
    await f.submit('bob','Add bounded favorites','budget-pending');f.release(1);
    await waitFor(()=>f.room.status==='Error','next dispatch bound');
    assert.equal(f.builders.length,1);assert.equal(f.room.executionBudget?.calls,24);assert.equal(f.room.versions.length,1);
    assert.match(f.room.lastError!,/24 physical-call ceiling/);
    assert.equal(f.manager.view(f.room).buildProgress!.availableRevision,1);
  }finally{await f.close();}
});

test('sustained captures make revision-labelled progress each cycle without a quiet global queue',async()=>{
  const f=await createProgressFixture({hold:true});
  try{
    await f.submit('alice','Build a catalog','sustained-initial');
    for(let i=1;i<=3;i++){
      await waitFor(()=>f.gates.has(i),'active sustained candidate');
      await f.submit('bob',`Add sustained capability ${i}`,`sustained-capture-${i}`);
      assert.ok(f.manager.view(f.room).buildProgress!.pendingSubmissions>0);
      f.release(i);await waitFor(()=>f.room.versions.length===i,'progress with further work pending');
      assert.equal(f.room.versions.at(-1)!.specificationRevision,i);
    }
    await waitFor(()=>f.gates.has(4),'final candidate');assert.equal(f.room.executionBudget?.calls,8);
    f.release(4);await waitFor(()=>!f.room.buildTask&&!f.room.buildTimer&&f.room.submissions.every(item=>item.status==='built'),'sustained workload drain');
    assert.equal(f.room.versions.length,4);assert.equal(f.manager.view(f.room).workflow.tasks.filter(item=>item.state==='stale').length,0);
  }finally{await f.close();}
});

test('attribution-only deferred acceptance neither rebuilds nor leaves a stuck budget or queue',async()=>{
  const f=await createProgressFixture({hold:true});
  try{
    await f.submit('alice','Build a catalog','same-initial');await waitFor(()=>f.gates.has(1),'candidate');
    await f.submit('bob','Build a catalog','same-pending');f.release(1);
    await waitFor(()=>!f.room.buildTask&&!f.room.buildTimer&&f.room.submissions.every(item=>item.status==='built'),'already-current drain');
    assert.equal(f.builders.length,1);assert.equal(f.room.executionBudget?.closed,true);
    assert.equal(f.room.sharedRequirements[0].sources.length,2);assert.equal(f.manager.view(f.room).buildProgress!.availableRevision,1);
    assert.equal(f.manager.view(f.room).buildProgress!.acceptedRevision,2);
  }finally{await f.close();}
});
