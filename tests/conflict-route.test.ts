import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import os from'node:os';import path from'node:path';
import{createCoCreateServer}from'../server/index.js';import{createSession}from'../server/auth.js';
import type{ConflictGroup}from'../shared/types.js';

test('conflict endpoint enforces editor role, contributor identity, stale choices, and retry identity',async()=>{
  const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'cocreate-conflicts-')),secret='test-conflict-secret';
  const service=await createCoCreateServer({port:0,host:'127.0.0.1',serveClient:false,dataDir,sessionSecret:secret});
  try{
    const room=service.manager.create('conflict-room');service.manager.join(room,'alice','Alice');service.manager.join(room,'bob','Bob');
    const group:ConflictGroup={id:'conflict-test',revision:1,round:1,subject:'header',scope:'global',requirementIds:[],alternatives:[{id:'red',label:'Red header',requirementIds:[],requirementRevisions:[],sources:[]},{id:'green',label:'Green header',requirementIds:[],requirementRevisions:[],sources:[]}],requiredResolverIds:['alice','bob'],selections:[],state:'awaiting_choices',detectionStatus:'confirmed',explanation:'Choose a header color.',affectedBuildScopes:[],history:[],createdAt:'2026-09-01T00:00:00Z',updatedAt:'2026-09-01T00:00:00Z'};
    room.conflictGroups=[group];service.manager.save(room);
    const {url}=await service.start();
    const post=async(participantId:string,role:'editor'|'viewer',body:Record<string,unknown>)=>{const token=createSession(secret,{roomId:room.id,participantId,name:participantId,role});const response=await fetch(`${url}/api/rooms/${room.id}/conflicts/${group.id}/selections`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(body)});return{status:response.status,body:await response.json() as any}};
    const base={groupRevision:1,expectedUpdatedAt:group.updatedAt,alternativeId:'red',requestId:'request-a'};
    assert.equal((await post('alice','viewer',base)).status,403);
    assert.match((await post('mallory','editor',base)).body.error,/affected contributor/);
    const first=await post('alice','editor',base);assert.equal(first.status,200);assert.equal(first.body.selections.length,1);
    const retry=await post('alice','editor',base);assert.equal(retry.status,200);assert.equal(retry.body.selections.length,1);
    assert.equal((await post('bob','editor',{...base,requestId:'request-b'})).status,409);
    assert.equal((await post('bob','editor',{...base,requestId:'request-b',expectedUpdatedAt:first.body.updatedAt})).status,200);
  }finally{await service.stop();fs.rmSync(dataDir,{recursive:true,force:true})}
});
