import test from 'node:test';
import assert from 'node:assert/strict';
import * as Y from 'yjs';
import {createProgressFixture,pause} from './fixtures/build-progress.js';
import {captureEnvelope} from './fixtures/capture.js';
import {encodeCaptureBytes} from '../shared/capture-command.js';
import {deletionSignature} from '../shared/document-state.js';
const options={buildDebounceMs:60_000,buildMaxWaitMs:60_000};
test('HTTP-first unsent sources and subsequent WebSocket delivery have one authenticated batch',async()=>{
  const f=await createProgressFixture(options),doc=new Y.Doc();
  try{
    Y.applyUpdate(doc,Y.encodeStateAsUpdate(f.room.doc));const vector=Y.encodeStateVector(doc);
    const paragraph=new Y.XmlElement('paragraph'),text=new Y.XmlText();doc.transact(()=>{doc.getXmlFragment('default').push([paragraph]);paragraph.push([text]);text.insert(0,'Build a dashboard');});
    const source={id:crypto.randomUUID(),update:encodeCaptureBytes(Y.encodeStateAsUpdate(doc,vector))};
    const envelope={version:1 as const,requestId:'http-first',cutoff:{vector:encodeCaptureBytes(Y.encodeStateVector(doc)),deletions:deletionSignature(doc)},sourceIds:[source.id],updates:[source]};
    const result=await f.manager.captureChanges(f.room,'alice',envelope);
    f.manager.handleMessage(f.room,{participantId:'alice',readyState:0,send(){},close(){}} as never,Buffer.from(JSON.stringify({type:'document-update',sourceId:source.id,update:source.update})),false);
    assert.equal(f.room.editHistory.length,1);assert.equal(f.room.pending.get('alice')?.length,0);assert.equal(f.room.submissions.length,1);
    await assert.rejects(()=>f.manager.captureChanges(f.room,'bob',{...envelope,requestId:'forged-source'}),/conflicts with authenticated provenance/);
    assert.equal((await f.manager.captureReceipt(f.room,'alice','http-first'))?.commandId,result.commandId);
  }finally{doc.destroy();await f.close();}
});
test('a deletion-only command uses deletion coverage and does not withdraw accepted intent during capture',async()=>{
  const f=await createProgressFixture(options),doc=new Y.Doc();
  try{
    f.edit('alice','Build a dashboard');await f.manager.captureChanges(f.room,'alice',captureEnvelope(f.room,'alice','insert'));
    await new Promise(resolve=>setImmediate(resolve));await f.room.steeringQueue;
    const revision=f.room.specificationRevision;assert.ok(revision>0);
    Y.applyUpdate(doc,Y.encodeStateAsUpdate(f.room.doc));const vector=Y.encodeStateVector(doc);doc.getXmlFragment('default').delete(0,1);
    const source={id:crypto.randomUUID(),update:encodeCaptureBytes(Y.encodeStateAsUpdate(doc,vector))};
    const envelope={version:1 as const,requestId:'delete',cutoff:{vector:encodeCaptureBytes(Y.encodeStateVector(doc)),deletions:deletionSignature(doc)},sourceIds:[source.id],updates:[source]};
    await assert.rejects(()=>f.manager.captureChanges(f.room,'alice',{...envelope,cutoff:{...envelope.cutoff,deletions:'[]'}}),/cutoff/);
    const result=await f.manager.captureChanges(f.room,'alice',envelope);assert.equal(result.state,'captured');
    assert.equal(f.room.submissions[1].capturedChanges?.[0].kind,'delete');assert.equal(f.room.specificationRevision,revision);
  }finally{doc.destroy();await f.close();}
});
test('membership revocation before canonical admission creates no command and preserves drafts',async()=>{
  let revoked=false;const f=await createProgressFixture({...options,authorize:async()=>{if(revoked)throw Object.assign(new Error('Revoked'),{status:403});}});
  try{
    f.edit('alice','Build a dashboard');revoked=true;
    await assert.rejects(()=>f.manager.captureChanges(f.room,'alice',captureEnvelope(f.room,'alice','revoked')),/Revoked/);
    assert.equal(f.room.submissions.length,0);assert.equal(f.room.pending.get('alice')?.length,1);assert.equal(f.personal.length,0);
    await assert.rejects(()=>f.manager.captureReceipt(f.room,'alice','revoked'),/Revoked/);
  }finally{await f.close();}
});
test('unsupported old submission messages require upgrade without saving or inference',async()=>{
  const f=await createProgressFixture(options),messages:any[]=[];
  try{
    f.edit('alice','Build a dashboard');
    f.manager.handleMessage(f.room,{participantId:'alice',readyState:1,send(raw:string){messages.push(JSON.parse(raw));},close(){}} as never,Buffer.from(JSON.stringify({type:'flush',requestId:'old'})),false);
    await pause(10);assert.equal(messages[0].type,'flush-error');assert.equal(messages[0].code,'capture_upgrade_required');assert.equal(f.room.submissions.length,0);assert.equal(f.personal.length,0);
  }finally{await f.close();}
});
