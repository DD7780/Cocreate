import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as Y from 'yjs';
import {createTwoGuysOneCanvasServer} from '../server/index.js';
import {createSession} from '../server/auth.js';
import {encodeCaptureBytes} from '../shared/capture-command.js';
import {deletionSignature} from '../shared/document-state.js';

test('real authenticated HTTP capture accepts bounded unsent bytes, returns 202 and scopes canonical status; old clients only upgrade',async()=>{
  const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'capture-http-'));
  const service=await createTwoGuysOneCanvasServer({dataDir,port:0,host:'127.0.0.1',serveClient:false,sessionSecret:'fixture',encryptionSecret:'fixture',baseUrl:'http://127.0.0.1:1'}),doc=new Y.Doc();
  try{
    const room=service.manager.create('capture-http');for(const actor of ['alice','bob'])service.manager.join(room,actor,actor);
    const connection=await service.manager.saveConnection(room,{name:'No-dispatch fixture',provider:'custom',baseUrl:'http://127.0.0.1:1',apiFormat:'responses',apiKey:'synthetic'});
    room.ai.connections![0].checks.fixture={reachable:{status:'passed'},text:{status:'passed'},personal:{status:'passed'},builder:{status:'passed'}};
    await service.manager.assignAI(room,{connectionId:connection.id,model:'fixture'},{connectionId:connection.id,model:'fixture'});room.buildAdmissionClosed=true;
    const {url}=await service.start(),token=(actor:string)=>createSession('fixture',{roomId:room.id,participantId:actor,name:actor});
    const paragraph=new Y.XmlElement('paragraph'),text=new Y.XmlText();doc.transact(()=>{doc.getXmlFragment('default').push([paragraph]);paragraph.push([text]);text.insert(0,'a'.repeat(50_000));});
    const source={id:crypto.randomUUID(),update:encodeCaptureBytes(Y.encodeStateAsUpdate(doc))};
    const envelope={version:1,requestId:'http-command',sourceIds:[source.id],updates:[source],cutoff:{vector:encodeCaptureBytes(Y.encodeStateVector(doc)),deletions:deletionSignature(doc)}};
    const headers={authorization:`Bearer ${token('alice')}`,'content-type':'application/json'};
    const response=await fetch(`${url}/api/rooms/${room.id}/commands/capture`,{method:'POST',headers,body:JSON.stringify(envelope)});
    assert.equal(response.status,202);const receipt=await response.json();assert.equal(receipt.state,'captured');assert.equal(receipt.actorId,'alice');assert.equal(room.providerCalls.length,0);
    const found=await fetch(`${url}/api/rooms/${room.id}/commands/http-command`,{headers});assert.equal(found.status,200);assert.equal((await found.json()).commandId,receipt.commandId);
    const other=await fetch(`${url}/api/rooms/${room.id}/commands/http-command`,{headers:{authorization:`Bearer ${token('bob')}`}});assert.equal(other.status,404);assert.equal((await other.json()).code,'capture_not_found');
    assert.equal((await fetch(`${url}/api/rooms/${room.id}/commands/http-command`)).status,401);
    assert.equal((await fetch(`${url}/api/rooms/${room.id}/submit`,{method:'POST',headers,body:'{}'})).status,426);
    const conflict=await fetch(`${url}/api/rooms/${room.id}/commands/capture`,{method:'POST',headers,body:JSON.stringify({...envelope,sourceIds:[]})});assert.equal(conflict.status,409);assert.equal(room.submissions.length,1);assert.equal(room.providerCalls.length,0);
  }finally{doc.destroy();await service.stop();assert.equal(path.dirname(path.resolve(dataDir)),path.resolve(os.tmpdir()));fs.rmSync(dataDir,{recursive:true,force:true});}
});
