import { CoordinatorUnavailableError } from '../server/coordinator.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { WebSocket } from 'ws';
import { createCoCreateServer } from '../server/index.js';
import { createSession } from '../server/auth.js';

test('hosted reads, mutations and live delivery check current membership rather than a stale ticket role',async()=>{
  let role:'owner'|'editor'|'viewer'|undefined='editor';
  const platform={saveSnapshot:async()=>{},appendDocumentUpdate:async()=>{},assertCoordinator:async()=>{},coordinator:{close:async()=>{}},requireMembership:async(_project:string,account:string,allowed=['owner','editor','viewer'])=>{if(account!=='alice'||!role||!allowed.includes(role))throw new Error('Membership denied');return role;}};
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'hosted-auth-')),secret='synthetic',service=await createCoCreateServer({platform:platform as any,serveClient:false,port:0,host:'127.0.0.1',dataDir:dir,sessionSecret:secret});
  let socket:WebSocket|undefined;
  try{
    const room=service.manager.create('project');service.manager.join(room,'alice','Alice');const {url,port}=await service.start();
    const token=createSession(secret,{roomId:'project',participantId:'alice',accountId:'alice',name:'Alice',role:'editor'}),headers={Authorization:`Bearer ${token}`,'Content-Type':'application/json'};
    assert.equal((await fetch(`${url}/api/rooms/project/state`)).status,401);
    assert.equal((await fetch(`${url}/api/rooms/project/state`,{headers})).status,200);
    role='viewer';assert.equal((await fetch(`${url}/api/rooms/project/submit`,{method:'POST',headers,body:'{"requestId":"one"}'})).status,403);
    role=undefined;assert.equal((await fetch(`${url}/api/rooms/project/state`,{headers})).status,403);
    assert.equal((await fetch(`${url}/preview/project/1`,{headers})).status,403);
    const status=await new Promise<number>((resolve,reject)=>{const rejected=new WebSocket(`ws://127.0.0.1:${port}/ws?room=project&token=${encodeURIComponent(token)}`,{origin:url});rejected.once('unexpected-response',(_req,res)=>{resolve(res.statusCode||0);res.resume()});rejected.once('open',()=>reject(new Error('Revoked upgrade accepted')));rejected.on('error',()=>{});});assert.equal(status,403);
    role='editor';socket=new WebSocket(`ws://127.0.0.1:${port}/ws?room=project&token=${encodeURIComponent(token)}`,{origin:url});
    const received:string[]=[];
    await new Promise<void>((resolve,reject)=>{socket!.on('message',(raw,binary)=>{if(!binary){const value=raw.toString();received.push(value);if(JSON.parse(value).type==='room-state')resolve();}});socket!.once('error',reject);});
    received.length=0;role=undefined;const closed=new Promise<number>(resolve=>socket!.once('close',resolve));await service.manager.save(room);assert.equal(await closed,4403);assert.equal(received.length,0,'a revoked idle reader receives no later saved or document state');
  }finally{socket?.terminate();await service.stop();fs.rmSync(dir,{recursive:true,force:true});}
});

test('non-owner ingress retries without hydrating a second writer or bypassing membership',async()=>{
  let role:string|undefined='editor',ownershipChecks=0;const dirs:string[]=[];
  const make=async(owns:boolean)=>{
    const dir=fs.mkdtempSync(path.join(os.tmpdir(),'owner-routing-'));dirs.push(dir);
    const platform={saveSnapshot:async()=>{},appendDocumentUpdate:async()=>{},coordinator:{close:async()=>{}},verifyUser:async()=>({id:'alice'}),requireMembership:async(_id:string,_user:string,allowed=['owner','editor','viewer'])=>{if(!role||!allowed.includes(role))throw Object.assign(new Error('Membership denied'),{status:403});return role},claimCoordinator:async()=>{ownershipChecks++;if(!owns)throw new CoordinatorUnavailableError()},assertCoordinator:async()=>{ownershipChecks++;if(!owns)throw new Error('private coordinator UUID or credential')},loadSnapshot:async()=>null,loadProviderRecords:async()=>[]};
    const service=await createCoCreateServer({platform:platform as any,serveClient:false,port:0,host:'127.0.0.1',dataDir:dir,sessionSecret:'synthetic'});return{service,...await service.start()};
  };
  const owner=await make(true),other=await make(false);
  try{
    const room=owner.service.manager.create('project');owner.service.manager.join(room,'alice','Alice');
    const token=createSession('synthetic',{roomId:'project',participantId:'alice',accountId:'alice',name:'Alice',role:'editor'}),headers={Authorization:`Bearer ${token}`,'Content-Type':'application/json'};
    for(const route of ['/api/rooms/project/state','/api/rooms/project/submit','/api/projects/project/session']){
      const response=await fetch(other.url+route,{method:route.endsWith('state')?'GET':'POST',headers,body:route.endsWith('state')?undefined:'{"requestId":"retained-command"}'});
      assert.equal(response.status,503);assert.equal(response.headers.get('Retry-After'),'2');assert.equal(response.headers.get('Location'),null);
      const body=await response.json() as any;assert.equal(body.code,'coordinator_unavailable');assert.match(body.error,/same request ID/);assert.doesNotMatch(JSON.stringify(body),/private|UUID|credential/);
    }
    assert.equal(other.service.manager.rooms.size,0);assert.equal(room.submissions.length,0);
    const upgrade=await new Promise<{status:number;retry:unknown}>(resolve=>{const socket=new WebSocket(`ws://127.0.0.1:${other.port}/ws?room=project&token=${encodeURIComponent(token)}`,{origin:other.url});socket.once('unexpected-response',(_req,res)=>{resolve({status:res.statusCode||0,retry:res.headers['retry-after']});res.resume()});socket.on('error',()=>{})});assert.deepEqual(upgrade,{status:503,retry:'2'});
    assert.equal((await fetch(owner.url+'/api/rooms/project/state',{headers})).status,200);
    const prior=ownershipChecks;role=undefined;assert.equal((await fetch(other.url+'/api/rooms/project/state',{headers})).status,403);assert.equal(ownershipChecks,prior);
    role='viewer';assert.equal((await fetch(other.url+'/api/rooms/project/submit',{method:'POST',headers,body:'{"requestId":"retained-command"}'})).status,403);assert.equal(ownershipChecks,prior);
    assert.equal((await fetch(other.url+'/api/rooms/project/state')).status,401);assert.equal(ownershipChecks,prior);
  }finally{await owner.service.stop();await other.service.stop();for(const dir of dirs)fs.rmSync(dir,{recursive:true,force:true})}
});
