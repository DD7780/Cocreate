import test from 'node:test';
import assert from 'node:assert/strict';
import * as Y from 'yjs';
import {createProgressFixture,pause} from './fixtures/build-progress.js';
import {captureEnvelope} from './fixtures/capture.js';
import {RoomManager} from '../server/rooms.js';
import {CaptureCommandController,captureTransport,type LocalCommandState} from '../src/capture-command.js';
import {encodeCaptureBytes,type CaptureEnvelope,type CaptureReceipt} from '../shared/capture-command.js';
import {replayCaptureJournal,type CaptureRecord} from '../server/capture-journal.js';
import type {DraftStore} from '../src/local-drafts.js';

const options={buildDebounceMs:60_000,buildMaxWaitMs:60_000};
const gate=()=>{let release!:()=>void;const promise=new Promise<void>(resolve=>release=resolve);return {promise,release};};
function cache():DraftStore{const rows=new Map<string,Uint8Array>();return {read:async key=>rows.get(key),merge:async(key,value)=>{rows.set(key,Y.mergeUpdates([rows.get(key),value].filter((item):item is Uint8Array=>!!item)));}};}
const receipt=(envelope:CaptureEnvelope,state:CaptureReceipt['state']='captured'):CaptureReceipt=>({durable:true,commandId:'command',requestId:envelope.requestId,actorId:'alice',cursor:1,sourceRevision:1,acceptedRevision:0,state,productVersion:null});

test('an expired HTTP wait reports an unknown outcome with recovery action and never retries itself',async t=>{
  let calls=0;t.mock.timers.enable({apis:['setTimeout']});
  try{
    const transport=captureTransport('room',()=> 'synthetic',async(_url,init)=>{
      calls++;return new Promise<Response>((_resolve,reject)=>init?.signal?.addEventListener('abort',()=>reject(new Error('private network diagnostic'))));
    });
    const failed=assert.rejects(transport.lookup('retained-request'),error=>error instanceof Error&&/Receipt lookup outcome is unknown.*original command.*Build my changes/.test(error.message)&&!error.message.includes('private network'));
    t.mock.timers.tick(15_000);await failed;assert.equal(calls,1);
  }finally{t.mock.timers.reset();}
});

test('capture returns before interpretation, binds permanent identity and freezes each author cutoff',async()=>{
  const f=await createProgressFixture({...options,personalDelayMs:600});
  try{
    f.edit('alice','Build a dashboard');f.edit('bob','Add calendar');
    const envelope=captureEnvelope(f.room,'alice','first');
    f.edit('alice','Later search draft');
    const before=Date.now(),first=await f.manager.captureChanges(f.room,'alice',envelope);
    assert.equal(first.state,'captured');assert.ok(Date.now()-before<500);assert.equal(f.personal.length,0);
    assert.equal(f.room.submissions.length,1);assert.equal(f.room.submissions[0].capturedChanges?.length,1);
    assert.equal(f.room.submissions[0].capturedChanges?.[0].after,'Build a dashboard');
    assert.equal(f.room.pending.get('alice')?.[0].after,'Later search draft');assert.equal(f.room.pending.get('bob')?.length,1);
    assert.equal((await f.manager.captureChanges(f.room,'alice',envelope)).commandId,first.commandId);
    assert.equal((await f.manager.captureReceipt(f.room,'alice','first'))?.commandId,first.commandId);
    assert.equal(await f.manager.captureReceipt(f.room,'bob','first'),undefined);
    await assert.rejects(()=>f.manager.captureChanges(f.room,'alice',{...envelope,sourceIds:['changed']}),/different input/);
    const bob=await f.manager.captureChanges(f.room,'bob',captureEnvelope(f.room,'bob','bob-first'));assert.ok(bob.cursor>first.cursor);
  }finally{await f.close();}
});

test('canonical commit gates consumption and dispatch while unrelated snapshots do not gate admission',async()=>{
  const f=await createProgressFixture(options),commit=gate(),snapshot=gate();let entered=false;
  try{
    await f.room.persistQueue;f.edit('alice','Build a dashboard');
    const config=(f.manager as any).config;
    config.durableStore={saveSnapshot:async()=>snapshot.promise,appendDocumentUpdate:async()=>{},readCapture:async()=>undefined,commitCapture:async(_id:string,record:CaptureRecord)=>{entered=true;await commit.promise;return {...record,cursor:1};}};
    const old=f.manager.save(f.room);await pause(5);
    const admission=f.manager.captureChanges(f.room,'alice',captureEnvelope(f.room,'alice','blocked'));
    await pause(25);assert.ok(entered);assert.equal(f.room.pending.get('alice')?.length,1);assert.equal(f.room.submissions.length,0);assert.equal(f.personal.length,0);
    commit.release();const result=await admission;assert.equal(result.state,'captured');assert.equal(f.room.pending.get('alice')?.length,0);assert.equal(f.personal.length,0);
    snapshot.release();await old;
  }finally{commit.release();snapshot.release();await f.close();}
});

test('lost canonical commit reply is recovered without dispatch; newer commands survive an older checkpoint',async()=>{
  const f=await createProgressFixture(options);let committed:CaptureRecord|undefined;
  try{
    await f.room.persistQueue;const checkpoint=f.manager.eventStore.readWorkspaceSnapshot(f.room.id);
    f.edit('alice','Build a dashboard');f.edit('bob','Keep coauthor draft');
    (f.manager as any).config.durableStore={saveSnapshot:async()=>{},appendDocumentUpdate:async()=>{},readCapture:async()=>committed,commitCapture:async(_id:string,record:CaptureRecord)=>{committed={...structuredClone(record),cursor:1};throw new Error('Lost reply');}};
    const envelope=captureEnvelope(f.room,'alice','lost');
    await assert.rejects(()=>f.manager.captureChanges(f.room,'alice',envelope),/Lost reply/);
    assert.equal(f.room.pending.get('alice')?.length,1);assert.equal(f.personal.length,0);
    const found=await f.manager.captureReceipt(f.room,'alice','lost');assert.equal(found?.state,'interrupted');assert.equal(f.personal.length,0);
    const replayed=replayCaptureJournal(checkpoint,[committed!]);
    const restored=f.manager.hydrate('cold-replay',replayed);
    assert.match(restored.doc.getXmlFragment('default').toString(),/dashboard/);
    assert.equal(restored.submissions[0].interrupted,true);assert.equal(restored.pending.get('alice')?.length,1);assert.equal(restored.providerCalls.length,0);assert.equal(restored.pending.get('bob')?.[0].after,'Keep coauthor draft');
    assert.equal((await f.manager.captureChanges(f.room,'alice',envelope)).commandId,found?.commandId);
  }finally{await f.close();}
});

test('local command freezes unsent updates before awaits, retains identity across reload, and looks up before any resend',async()=>{
  const store=cache(),controller=new CaptureCommandController('scope',store),doc=new Y.Doc(),delivery=gate(),states:LocalCommandState[]=[];
  await controller.restore();const updates:Uint8Array[]=[];doc.on('update',(update:Uint8Array)=>updates.push(update));
  doc.getText('draft').insert(0,'first');controller.record(updates[0]);let sent:CaptureEnvelope|undefined,calls=0;
  const pending=controller.capture(doc,[],{lookup:async()=>{throw new Error('must not lookup new');},send:async envelope=>{sent=structuredClone(envelope);calls++;await delivery.promise;throw new Error('Lost reply');}},state=>states.push(state));
  doc.getText('draft').insert(5,' later');controller.record(updates[1]);await pause(5);delivery.release();await assert.rejects(pending,/Lost reply/);
  assert.equal(sent?.updates.length,1);controller.dispose();
  const renewed=new CaptureCommandController('scope',store);await renewed.restore();let lookedUp='';
  const recovered=await renewed.capture(doc,[],{lookup:async id=>{lookedUp=id;return receipt(sent!);},send:async()=>{calls++;throw new Error('must not resend found');}},()=>{});
  assert.equal(lookedUp,sent?.requestId);assert.equal(recovered.commandId,'command');assert.equal(calls,1);assert.equal(renewed.sources().length,1);assert.deepEqual(states,['preparing','sending','unknown']);renewed.dispose();doc.destroy();
});

test('unknown lookup failure never mints a fresh identity; definitive absence resends identical deletion envelope',async()=>{
  const controller=new CaptureCommandController('scope',cache()),doc=new Y.Doc();await controller.restore();
  doc.getText('draft').insert(0,'delete');doc.on('update',(bytes:Uint8Array)=>controller.record(bytes));doc.getText('draft').delete(0,6);
  let original:CaptureEnvelope|undefined;
  await assert.rejects(()=>controller.capture(doc,[],{lookup:async()=>undefined,send:async value=>{original=structuredClone(value);throw new Error('unknown');}},()=>{}));
  await assert.rejects(()=>controller.capture(doc,[],{lookup:async()=>{throw new Error('lookup unavailable');},send:async()=>{throw new Error('must not send');}},()=>{}),/lookup unavailable/);
  await controller.capture(doc,[],{lookup:async()=>undefined,send:async value=>{assert.deepEqual(value,original);return receipt(value);}},()=>{});controller.dispose();doc.destroy();
});

test('a command backup restores unsent source bytes even if the ordinary document backup was lost',async()=>{
  const store=cache(),first=new CaptureCommandController('scope',store),doc=new Y.Doc();await first.restore();
  doc.on('update',(bytes:Uint8Array)=>first.record(bytes));doc.getText('draft').insert(0,'unsent recovery');
  const source=first.sources()[0];await pause(5);first.dispose();doc.destroy();
  const reopened=new CaptureCommandController('scope',store),restored=new Y.Doc();await reopened.restore(restored);
  assert.equal(restored.getText('draft').toString(),'unsent recovery');assert.equal(reopened.sources()[0].id,source.id);
  await reopened.capture(restored,[],{lookup:async()=>undefined,send:async value=>{assert.equal(value.updates[0].id,source.id);return receipt(value);}},()=>{});reopened.dispose();restored.destroy();
});

test('closing a scope during delivery does not turn a confirmed capture into a new request on reload',async()=>{
  const store=cache(),controller=new CaptureCommandController('scope',store),doc=new Y.Doc(),held=gate();await controller.restore();
  doc.getText('draft').insert(0,'kept');let sends=0;
  const pending=controller.capture(doc,[],{lookup:async()=>undefined,send:async envelope=>{sends++;await held.promise;return receipt(envelope);}},()=>{});
  await pause(5);controller.dispose();held.release();assert.equal((await pending).durable,true);
  const restored=new CaptureCommandController('scope',store);await restored.restore();assert.equal(restored.sources().length,0);assert.equal(sends,1);restored.dispose();doc.destroy();
});

test('a canonical/checkpoint disagreement is quarantined and a stale local lease cannot append a command',async()=>{
  const f=await createProgressFixture(options);
  try{
    f.edit('alice','Build a dashboard');await f.manager.captureChanges(f.room,'alice',captureEnvelope(f.room,'alice','consistent'));
    const record=f.manager.eventStore.captureRecords(f.room.id)[0];
    assert.throws(()=>f.manager.eventStore.commitCapture(f.room.id,record,{ownerId:'stale-owner',epoch:f.room.coordinatorEpoch}),/Stale/);
    f.room.commandReceipts![JSON.stringify(['alice','consistent'])].payloadHash='wrong';
    await assert.rejects(()=>f.manager.captureReceipt(f.room,'alice','consistent'),/disagrees/);
  }finally{await f.close();}
});
