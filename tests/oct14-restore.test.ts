import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {RoomManager} from '../server/rooms.js';
import {hostedSecretsError} from '../server/credentials.js';
import * as Y from 'yjs';

test('restored workflow preserves current capture provenance and permanent receipt metadata through save and reopen',async()=>{
  const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'canvas-restore-'));
  const options={dataDir,debounceMs:60_000,encryptionSecret:'synthetic-restore-encryption-key'};
  let manager=new RoomManager(options);
  try{
    const room=manager.create('restore-roundtrip');
    room.captureCursor=17;
    room.captureSources=new Map([['source-17',{actorId:'alice',hash:'immutable-source-hash'}]]);
    room.documentSequence=90;
    const key=JSON.stringify(['alice','captured-before-restore']);
    room.commandReceipts={[key]:{id:'submission-17',participantId:'alice',requestId:'captured-before-restore',status:'built',payloadHash:'permanent-payload-hash'}};
    room.submissions=[{id:'submission-17',participantId:'alice',requestId:'captured-before-restore',status:'built',payloadHash:'permanent-payload-hash',captureCursor:17,productVersion:3,editSeqs:[90],documentRevision:90,snapshot:'[]',createdAt:new Date().toISOString()}];
    await manager.save(room);
    manager.shutdown();
    manager=new RoomManager(options);
    const restored=manager.get('restore-roundtrip')!;
    assert.equal(restored.captureCursor,17);
    assert.deepEqual(restored.captureSources?.get('source-17'),{actorId:'alice',hash:'immutable-source-hash'});
    assert.equal(restored.documentSequence,90);
    assert.equal(restored.commandReceipts?.[key].payloadHash,'permanent-payload-hash');
    assert.equal(restored.submissions[0].productVersion,3);
    await manager.save(restored);
    const persisted=manager.eventStore.readWorkspaceSnapshot<any>(restored.id);
    assert.equal(persisted.captureCursor,17);
    assert.equal(persisted.commandReceipts[key].payloadHash,'permanent-payload-hash');
  }finally{manager.shutdown();fs.rmSync(dataDir,{recursive:true,force:true});}
});

test('restoration does not reinstate the known development secret in hosted mode',()=>{
  assert.ok(hostedSecretsError(undefined,undefined));
  assert.ok(hostedSecretsError('2guys1canvas-local-session-secret','2guys1canvas-local-session-secret'));
  assert.equal(hostedSecretsError('synthetic-signing-secret-of-at-least-32-bytes','synthetic-encryption-secret-of-at-least-32-bytes'),null);
});

test('prior immutable commands remain readable only under their recorded actor identity',async()=>{
  const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'canvas-prior-command-'));
  const manager=new RoomManager({dataDir,debounceMs:60_000,encryptionSecret:'synthetic-restore-encryption-key'});
  try{
    const room=manager.create('prior-command');
    manager.join(room,'alice','Alice');
    manager.eventStore.commitCapture(room.id,{
      cursor:0,payloadHash:'prior-hash',documentUpdate:Buffer.from(Y.encodeStateAsUpdate(room.doc)).toString('base64'),
      documentSequence:4,ownerId:'alice',participant:room.participants.get('alice')!,
      submission:{id:'prior-submission',requestId:'prior-request',participantId:'alice',editSeqs:[],documentRevision:4,snapshot:'[]',createdAt:new Date().toISOString(),status:'failed'},
    },{ownerId:(manager as any).coordinatorId,epoch:room.coordinatorEpoch});
    const receipt=await manager.captureReceipt(room,'alice','prior-request');
    assert.equal(receipt?.durable,true);
    assert.equal(receipt?.commandId,'prior-submission');
    assert.equal(receipt?.state,'failed');
    assert.equal(await manager.captureReceipt(room,'bob','prior-request'),undefined);
    assert.equal(manager.eventStore.allProviderRequestRecordsForWorkspace(room.id).length,0);
  }finally{manager.shutdown();fs.rmSync(dataDir,{recursive:true,force:true});}
});
