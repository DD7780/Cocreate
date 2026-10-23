import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as Y from 'yjs';
import {provenanceFixture} from './fixtures/provenance.js';
import {directInstruction} from '../server/direct-prompt.js';
import {planVerification} from '../server/verification.js';
import {RoomManager} from '../server/rooms.js';

const waitFor=async(check:()=>boolean)=>{const end=Date.now()+40_000;while(!check()){if(Date.now()>end)throw new Error('Direct fixture timed out');await new Promise(resolve=>setTimeout(resolve,25));}};
function writer(manager:RoomManager,room:ReturnType<RoomManager['create']>,actor:string) {
  const doc=new Y.Doc();Y.applyUpdate(doc,Y.encodeStateAsUpdate(room.doc));
  return {close:()=>doc.destroy(),edit:(text:string)=>{
    Y.applyUpdate(doc,Y.encodeStateAsUpdate(room.doc));
    const vector=Y.encodeStateVector(doc),p=new Y.XmlElement('paragraph'),t=new Y.XmlText();
    doc.transact(()=>{doc.getXmlFragment('default').push([p]);p.push([t]);t.insert(0,text);});
    manager.handleMessage(room,{participantId:actor,readyState:0,send(){}} as any,Buffer.concat([Buffer.from([0]),Buffer.from(Y.encodeStateAsUpdate(doc,vector))]),true);
  }};
}

test('direct capture serializes prompts and native builds, excludes drafts, preserves history, and retries the same prompt/allowance',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'direct-flow-')),f=await provenanceFixture(dir,0,false,'direct');
  const {room,calls,control}=f,manager=f.app.manager;
  manager.join(room,'alice','Alice');manager.join(room,'bob','Bob');
  const a=writer(manager,room,'alice'),b=writer(manager,room,'bob');
  try {
    room.conflictGroups=[{id:'historical-conflict',state:'disagreement'} as any];
    room.intentBuildPending=true;
    const historical=structuredClone(room.conflictGroups);
    b.edit('PRIVATE UNSUBMITTED DRAFT');a.edit('Build a catalog with a working filter');
    assert.equal(calls.length,0);
    control.holdBuilder=true;
    const first=await manager.submitChanges(room,'alice','first');
    assert.match(first.message,/saved for building/);
    await waitFor(()=>calls.some(call=>call.purpose==='builder'));
    const frozen=structuredClone(room.submissions[0]);
    const durable=manager.eventStore.readWorkspaceSnapshot<any>(room.id);
    assert.equal(durable.submissions[0].prompt,frozen.prompt);
    assert.deepEqual(durable.submissions[0].frozenBuild,frozen.frozenBuild);
    assert.equal(frozen.mode,'direct');assert.equal(frozen.prompt,'Build a catalog with a working filter');
    assert.equal(room.sharedRequirements.length,0);assert.deepEqual(room.conflictGroups,historical);
    assert.ok(!JSON.stringify(calls).includes('PRIVATE UNSUBMITTED DRAFT'));
    assert.deepEqual(calls[1].input.submittedInstructions.map((item:any)=>item.id),[first.submissionId]);
    a.edit('Maybe make the resturant dark');
    const second=await manager.submitChanges(room,'alice','second');
    assert.equal(second.status,'submitted');assert.equal(calls.length,2);
    assert.deepEqual(room.submissions[0].frozenBuild,frozen.frozenBuild);
    await manager.submitChanges(room,'alice','first');assert.equal(calls.length,2);
    assert.throws(()=>manager.selectConflict(room,'historical-conflict',{} as any),/paused/);
    assert.throws(()=>manager.mutateIntent(room,'alice',{}),/paused/);
    assert.throws(()=>manager.buildAcceptedChanges(room,'alice','old-tab'),/paused/);
    f.release();
    await waitFor(()=>room.versions.length===2&&!room.buildTask);
    assert.deepEqual(calls.map(call=>call.purpose),['interpretation','builder','interpretation','builder']);
    assert.match(room.submissions[1].prompt!,/Maybe make the restaurant dark/);
    assert.equal(room.aiRuns.at(-1)?.verification.evidence?.checks.find(item=>item.kind==='filter')?.passed,true);
    assert.equal(room.pending.get('bob')?.length,1);assert.deepEqual(room.conflictGroups,historical);
    assert.equal(room.intentBuildPending,true);
    a.edit('Make the restaurant light instead of dark');control.failBuild=true;
    const third=await manager.submitChanges(room,'alice','third');
    await waitFor(()=>room.status==='Error'&&!room.buildTask);
    assert.equal(room.versions.length,2);assert.equal(room.submissions[2].status,'failed');
    const budget=structuredClone(room.executionBudget!),personal=calls.filter(item=>item.purpose==='interpretation').length;
    const prompt=room.submissions[2].prompt,selected=structuredClone(room.submissions[2].builderAssignment);
    control.failBuild=false;
    const retry=await manager.retryBuild(room,'alice','retry-third');
    assert.equal(retry.submissionId,third.submissionId);
    await manager.retryBuild(room,'alice','retry-third');
    await waitFor(()=>room.versions.length===3&&!room.buildTask);
    assert.equal(room.submissions.length,3);assert.equal(room.submissions[2].prompt,prompt);
    assert.deepEqual(room.submissions[2].builderAssignment,selected);
    assert.equal(calls.filter(item=>item.purpose==='interpretation').length,personal);
    assert.equal(room.executionBudget!.id,budget.id);assert.equal(room.executionBudget!.calls,budget.calls+1);
    assert.equal(manager.view(room).submissionMode,'direct');
    assert.equal(manager.view(room).directSubmissions!.at(-1)!.artifactVersion,3);
    a.edit('ALICE UNSUBMITTED NEXT DRAFT');b.edit('Make the header green');
    await manager.submitChanges(room,'bob','bob-first');
    await waitFor(()=>room.versions.length===4&&!room.buildTask);
    const bobCall=calls.filter(item=>item.purpose==='interpretation').at(-1)!;
    assert.equal(bobCall.input.participantId,'bob');
    assert.match(JSON.stringify(bobCall.input),/PRIVATE UNSUBMITTED DRAFT/);
    assert.ok(!JSON.stringify(bobCall.input).includes('ALICE UNSUBMITTED NEXT DRAFT'));
    assert.equal(room.pending.get('alice')?.length,1);
    room.submissions.push({id:'legacy-queued',requestId:'legacy',participantId:'bob',mode:'intent',editSeqs:[],documentRevision:0,snapshot:'',createdAt:new Date().toISOString(),status:'queued'});
    a.edit('Make a failed change');control.failBuild=true;
    const failed=await manager.submitChanges(room,'alice','replace-failed');
    await waitFor(()=>room.status==='Error'&&!room.buildTask);
    const failedBudget=room.executionBudget!.id;
    control.failBuild=false;a.edit('Keep the working product and make the header blue instead');
    await manager.submitChanges(room,'alice','replacement');
    await waitFor(()=>room.versions.length===5&&!room.buildTask);
    assert.equal(room.submissions.find(item=>item.id===failed.submissionId)!.status,'failed');
    assert.equal(room.submissions.find(item=>item.id==='legacy-queued')!.status,'queued');
    assert.equal(room.executionBudget!.id,failedBudget);assert.equal(room.executionBudget!.closed,true);
    assert.equal(manager.view(room).buildProgress!.phase,'idle');
  } finally {a.close();b.close();await f.close();assert.equal(path.dirname(path.resolve(dir)),path.resolve(os.tmpdir()));fs.rmSync(dir,{recursive:true,force:true});}
});

test('empty prompt output fails explicitly without a builder and retains captured writing and replay identity',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'direct-empty-')),f=await provenanceFixture(dir,0,false,'direct');
  f.app.manager.join(f.room,'alice','Alice');const a=writer(f.app.manager,f.room,'alice');
  try {
    f.control.emptyPrompt=true;a.edit('Maybe build a resturant website');
    await assert.rejects(f.app.manager.submitChanges(f.room,'alice','empty'),/empty|schema|minimum/i);
    assert.equal(f.calls.length,1);assert.equal(f.room.versions.length,0);
    assert.equal(f.room.submissions[0].status,'failed');assert.equal(f.room.pending.get('alice')?.length,1);
    const replay=await f.app.manager.submitChanges(f.room,'alice','empty');
    assert.equal(replay.submissionId,f.room.submissions[0].id);assert.equal(f.calls.length,1);
  } finally {a.close();await f.close();assert.equal(path.dirname(path.resolve(dir)),path.resolve(os.tmpdir()));fs.rmSync(dir,{recursive:true,force:true});}
});

test('direct checks retain covered behavior until an explicit submitted removal, and leave arbitrary prose unverified',()=>{
  const s=(writing:string,prompt=writing)=>({id:'submission',participantId:'alice',prompt,instructionRevision:1,submittedSources:{sources:[{text:writing}]} } as any);
  const first=directInstruction(s('Build a catalog with a working filter. Add favorites'));
  assert.deepEqual(planVerification([first],1).kinds,['filter','favorites']);
  const next=directInstruction(s('Make the background blue'),[first]);
  assert.deepEqual(planVerification([next],2).kinds,['filter','favorites']);
  const removed=directInstruction(s('Remove filtering. Remove favorites. Add a restaurant hero'),[next]);
  assert.deepEqual(planVerification([removed],3).kinds,[]);
  assert.ok(removed.acceptanceCriteria.includes('Add a restaurant hero'));
});

test('restart never replays a prepared direct prompt; existing artifacts and intent records survive hydration',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'direct-recovery-')),manager=new RoomManager({dataDir:dir,debounceMs:10,encryptionSecret:'fixture'});
  try {
    const room=manager.hydrate('existing',{participants:[{id:'alice',name:'Alice'}],sharedRequirements:[{id:'historical'}],conflictGroups:[{id:'open',state:'disagreement'}],submissions:[{id:'saved',mode:'direct',prompt:'Prepared once',status:'queued',participantId:'alice',requestId:'original',editSeqs:[]}],status:'Building'});
    assert.equal(room.submissions[0].status,'failed');assert.equal(room.submissions[0].prompt,'Prepared once');
    assert.equal(room.sharedRequirements[0].id,'historical');assert.equal(room.conflictGroups[0].state,'disagreement');
    assert.equal(room.buildTask,undefined);assert.equal(room.agentTasks.size,0);
    const later=manager.hydrate('later-success',{submissions:[{id:'old-failure',mode:'direct',prompt:'Old failed prompt',status:'failed'},{id:'new-success',mode:'direct',prompt:'Later successful update',status:'built'}],status:'Updated'});
    assert.notEqual(later.status,'Error');
  } finally {manager.shutdown();assert.equal(path.dirname(path.resolve(dir)),path.resolve(os.tmpdir()));fs.rmSync(dir,{recursive:true,force:true});}
});
