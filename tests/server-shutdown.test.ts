import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createCoCreateServer } from '../server/index.js';
import { createSession, verifySession } from '../server/auth.js';

test('server shutdown drains authenticated HTTP before closing durable state', async () => {
  const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'shutdown-integration-'));
  const service=await createCoCreateServer({port:0,host:'127.0.0.1',serveClient:false,dataDir,sessionSecret:'shutdown-test'});
  const room=service.manager.create('shutdown-project');
  service.manager.join(room,'alice','Alice');
  let entered!:()=>void, release!:()=>void;
  const started=new Promise<void>(resolve=>{entered=resolve});
  const held=new Promise<void>(resolve=>{release=resolve});
  const route=service.manager.view.bind(service.manager);
  // Hold an already authenticated room read after ingress, as a historical body read can be held.
  service.app.get('/fixture-draining-read',async (req,res)=>{
    const session=verifySession('shutdown-test',String(req.headers.authorization||'').replace(/^Bearer /,''));
    if(!session||session.roomId!==room.id||session.participantId!=='alice')return void res.sendStatus(403);
    entered();await held;
    try {res.json(route(room));} catch(error){res.status(500).json({error:String(error)});}
  });
  let stopping:Promise<void>|undefined;
  try {
    const {url}=await service.start();
    const token=createSession('shutdown-test',{roomId:room.id,participantId:'alice',name:'Alice'});
    const read=fetch(`${url}/fixture-draining-read`,{headers:{authorization:`Bearer ${token}`},signal:AbortSignal.timeout(5_000)});
    await started;
    stopping=service.stop();
    await new Promise(resolve=>setImmediate(resolve));
    // Closing ingress must not dispose the durable store while this HTTP request owns it.
    assert.equal(service.manager.eventStore.hasWorkspace(room.id),true);
    release();
    const response=await read;assert.equal(response.status,200);
    assert.equal((await response.json()).roomId,room.id);
    await stopping;
    assert.equal(service.server.listening,false);
    assert.throws(()=>service.manager.eventStore.hasWorkspace(room.id),/not open/);
  } finally {
    release();await stopping;
    if(service.server.listening)await service.stop();
    assert.equal(path.dirname(path.resolve(dataDir)),path.resolve(os.tmpdir()));
    assert.match(path.basename(dataDir),/^shutdown-integration-/);
    fs.rmSync(dataDir,{recursive:true,force:true});
  }
});
