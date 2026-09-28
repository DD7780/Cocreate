import test from 'node:test';
import assert from 'node:assert/strict';
import * as Y from 'yjs';
import {draftKey,persistDraft,restoreDraft,type DraftStore,type LocalDraftStatus} from '../src/local-drafts';
const tick=()=>new Promise(resolve=>setTimeout(resolve,10));
function memory(): DraftStore {
  const records=new Map<string,Uint8Array>();
  return {async read(key){return records.get(key)},async merge(key,update){const old=records.get(key);records.set(key,old?Y.mergeUpdates([old,update]):update)}};
}
test('drafts recover after a reload and remain scoped to the contributor and room',async()=>{
  const store=memory(),doc=new Y.Doc(),key=draftKey('room','alice'),states:LocalDraftStatus[]=[];
  const stop=persistDraft(doc,key,status=>states.push(status),store);
  doc.getText('draft').insert(0,'red restaurant');await tick();stop();
  const recovered=new Y.Doc();await restoreDraft(recovered,key,store);
  assert.equal(recovered.getText('draft').toString(),'red restaurant');assert.equal(states.at(-1),'saved');
  const other=new Y.Doc();await restoreDraft(other,draftKey('room','bob'),store);assert.equal(other.getText('draft').length,0);
  doc.destroy();recovered.destroy();other.destroy();
});
test('storage failure is visible and never claims a local save',async()=>{
  const states:LocalDraftStatus[]=[],doc=new Y.Doc();
  const stop=persistDraft(doc,'key',status=>states.push(status),{async read(){return undefined},async merge(){throw new Error('quota')}});
  doc.getText('draft').insert(0,'retained in memory');await tick();assert.equal(states.at(-1),'unavailable');assert.ok(!states.includes('saved'));stop();doc.destroy();
});
test('corrupt cached updates do not mutate the live document',async()=>{
  const doc=new Y.Doc();doc.getText('draft').insert(0,'safe');
  await assert.rejects(restoreDraft(doc,'key',{async read(){return new Uint8Array([255,255,255])},async merge(){}}));
  assert.equal(doc.getText('draft').toString(),'safe');doc.destroy();
});
test('two tabs preserve both CRDT updates and teardown stops writes',async()=>{
  const store=memory(),a=new Y.Doc(),b=new Y.Doc();let writes=0;
  const counted={read:store.read,async merge(key:string,value:Uint8Array){writes++;await store.merge(key,value)}};
  const stopA=persistDraft(a,'same',()=>{},counted),stopB=persistDraft(b,'same',()=>{},counted);
  a.getText('draft').insert(0,'A');b.getText('draft').insert(0,'B');await tick();stopA();stopB();
  const restored=new Y.Doc();await restoreDraft(restored,'same',store);assert.equal(restored.getText('draft').length,2);
  const before=writes;a.getText('draft').insert(0,'C');await tick();assert.equal(writes,before);a.destroy();b.destroy();restored.destroy();
});
