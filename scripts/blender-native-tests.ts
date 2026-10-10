import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { randomUUID } from 'node:crypto';
import { BLENDER_OPERATIONS, type BlenderScene } from '../shared/blender.js';
import { queueScene } from '../server/blender-sessions.js';
import { executeBlender, approvedDirectory, collectBlenderResult } from '../server/blender-executor.js';
import { checkBlenderResult, blenderBytes, BLENDER_MIME } from '../server/blender-artifacts.js';
import { artifactHash, artifactPath, bodyFromBytes, ArtifactUnavailableError } from '../server/artifacts.js';
import { writeCompanionReceipt, runBlenderCompanion } from '../server/blender-companion.js';
import { createCanvasArtifactsFixture } from '../tests/fixtures/canvas-artifacts.js';
import { createArtifactFixture } from '../tests/fixtures/artifact-storage.js';
import { createCoCreateServer } from '../server/index.js';
import { createSession } from '../server/auth.js';
import { RoomManager } from '../server/rooms.js';
import type { BlenderResult, BlenderVersion } from '../shared/blender.js';

const scene: BlenderScene = { objects: [{kind:'cube',name:'Blue cube',location:[0,0,1],scale:[1,1,1],color:[0.1,0.25,0.8]}], camera:{location:[7,-9,6],target:[0,0,1]},lights:[{location:[2,-3,7],energy:1000}] };
if (process.platform !== 'win32' || !process.env.COCREATE_BLENDER_EXECUTABLE) throw new Error('Native Blender acceptance requires Windows x64 and COCREATE_BLENDER_EXECUTABLE; no simulated or host fallback.');
let verifiedResult: BlenderResult;

test('real Windows Blender creates bounded outputs; receipts, cancellation, timeout and fixed paths retain integrity',async()=>{
  const root=path.resolve('.runtime/blender-tests',randomUUID());fs.mkdirSync(root,{recursive:true});
  const executable=process.env.COCREATE_BLENDER_EXECUTABLE!,commandId=randomUUID();
  const run=await executeBlender({executable,workspace:root,commandId,scene});assert.ok(run.result);
  verifiedResult=run.result;
  const twins=await Promise.all([1,2].map(()=>executeBlender({executable,workspace:root,commandId:randomUUID(),scene})));
  for(const completed of [run,...twins]){assert.ok(completed.result);const pid=Number(completed.diagnostics.match(/ISOLATION_STARTED (\d+)/)?.[1]);assert.ok(pid);assert.throws(()=>process.kill(pid,0),{code:'ESRCH'});}
  const checked=checkBlenderResult(run.result,commandId,artifactHash(Buffer.from(JSON.stringify(scene))));assert.ok(checked.blend.length>1000);assert.ok(checked.png.length>1000);
  assert.throws(()=>checkBlenderResult({...run.result,png:'aGVsbG8='},commandId,run.result.evidence.sceneHash));
  assert.throws(()=>checkBlenderResult(run.result,randomUUID(),run.result.evidence.sceneHash));
  const receipt=path.join(root,'receipt.json');writeCompanionReceipt(receipt,{commandId,state:'running'});assert.equal(JSON.parse(fs.readFileSync(receipt,'utf8')).state,'running');
  const controller=new AbortController();setTimeout(()=>controller.abort(),250);
  await assert.rejects(executeBlender({executable,workspace:root,commandId:randomUUID(),scene,signal:controller.signal}),/cancelled/);
  await assert.rejects(executeBlender({executable,workspace:root,commandId:randomUUID(),scene,wallMs:50}),/timed out/);
  const bad=path.join(root,'outside');fs.mkdirSync(bad);fs.writeFileSync(path.join(bad,'scene.blend'),'private');fs.writeFileSync(path.join(bad,'render.png'),'private');
  assert.throws(()=>collectBlenderResult(bad,commandId,'bad'),/signatures/);
  assert.throws(()=>approvedDirectory(path.join(root,'missing')));
  const children=fs.readdirSync(root).filter(name=>fs.statSync(path.join(root,name)).isDirectory()&&name!=='outside');assert.equal(children.length,5);
  for(const directory of children)assert.equal(fs.readdirSync(path.join(root,directory)).includes('unrelated.blend'),false);
  // Test outputs stay under the ignored dedicated task root for inspection; never delete user workspaces.
});

test('real Blender outputs use immutable private SDK Storage, cold restoration, fresh membership and corrupt-body denial',async()=>{
  assert.ok(verifiedResult,'real native output acceptance must precede Storage acceptance');
  const storage=await createArtifactFixture(),projectId=randomUUID(),platform=storage.platform();await platform.claimCoordinator(projectId);
  const f=await createCanvasArtifactsFixture({durableStore:platform,projectId}),artifactId='blend_'+randomUUID().replaceAll('-','').slice(0,24),title='Private scene';
  const bytes=blenderBytes(projectId,artifactId,1,verifiedResult),body=bodyFromBytes(bytes,BLENDER_MIME),checked=checkBlenderResult(verifiedResult,verifiedResult.evidence.commandId,verifiedResult.evidence.sceneHash);
  const version:BlenderVersion={id:1,projectId,artifactId,title,taskId:randomUUID(),participantId:'alice',submissionIds:[],specificationRevision:0,requirementRevisions:[],inputVersions:[],fingerprint:'native-storage-test',contentRef:body.ref,contentHash:artifactHash(bytes),byteLength:bytes.length,createdAt:new Date().toISOString(),outputs:checked.outputs,evidence:verifiedResult.evidence};
  const latestBytes=blenderBytes(projectId,artifactId,2,verifiedResult),latestBody=bodyFromBytes(latestBytes,BLENDER_MIME),latest={...version,id:2,contentRef:latestBody.ref,contentHash:artifactHash(latestBytes),byteLength:latestBytes.length};
  const coldDir=fs.mkdtempSync(path.join(os.tmpdir(),'canvas-artifacts-blender-cold-'));let cold:Awaited<ReturnType<typeof createCoCreateServer>>|undefined;
  try{
    await platform.publishArtifactBodies(projectId,[body,latestBody]);f.manager.eventStore.restoreArtifactBodies([body,latestBody]);f.room.blenderArtifacts=[{kind:'blender',id:artifactId,title,projectId,versions:[version,latest]}];await f.manager.save(f.room);
    const snapshot=storage.snapshots.get(projectId)!.harness_state;assert.equal(snapshot.artifactSchemaVersion,3);assert.equal(snapshot.blenderArtifacts.length,1);assert.equal(snapshot.artifactBodies,undefined);
    const replacement=storage.platform();await replacement.claimCoordinator(projectId);let allowed=true;
    replacement.requireMembership=async()=>{if(!allowed)throw Object.assign(new Error('Project access denied.'),{status:403});return 'viewer';};
    cold=await createCoCreateServer({platform:replacement,dataDir:coldDir,port:0,host:'127.0.0.1',serveClient:false,sessionSecret:'synthetic'});
    const restored=cold.manager.hydrate(projectId,await replacement.loadSnapshot(projectId)),origin=(await cold.start()).url;
    const token=createSession('synthetic',{roomId:projectId,participantId:'bob',accountId:'bob',name:'Bob',role:'viewer'}),endpoint=`${origin}/api/rooms/${projectId}/blender/artifacts/${artifactId}/versions/1/render.png`,headers={Authorization:`Bearer ${token}`};
    assert.deepEqual(cold.manager.blenderSessions(restored,'bob'),[]);
    // Force a historical private-body read after the empty-cache latest restoration.
    storage.controls.afterDownload=()=>{allowed=false;};
    assert.equal((await fetch(endpoint,{headers})).status,403);storage.controls.afterDownload=undefined;allowed=true;
    const download=await fetch(endpoint,{headers});assert.equal(download.status,200);assert.equal(artifactHash(new Uint8Array(await download.arrayBuffer())),version.outputs.png.hash);
    assert.equal((await fetch(endpoint.replace(projectId,randomUUID()),{headers})).status,401);
    const objectPath=artifactPath(projectId,body),original=storage.objects.get(objectPath)!;storage.objects.set(objectPath,Buffer.from('corrupt'));
    const probe=new RoomManager({dataDir:path.join(coldDir,'probe'),debounceMs:1000,encryptionSecret:'synthetic',durableStore:replacement});
    try{const room=probe.hydrate(projectId,await replacement.loadSnapshot(projectId));await assert.rejects(probe.blenderContent(room,artifactId,1),ArtifactUnavailableError);}finally{probe.shutdown();}
    storage.objects.set(objectPath,original);
    assert.equal(f.calls.length,0,'restoration/download must not infer');
  }finally{if(cold)await cold.stop();await f.close();await storage.close();if(path.dirname(coldDir)!==path.resolve(os.tmpdir()))throw new Error('Unsafe test cleanup');fs.rmSync(coldDir,{recursive:true,force:true});}
});

test('real outbound companion executes only submitted caller task, publishes private versions and reconciles failed upload without repeated inference/execution',async()=>{
  const f=await createCanvasArtifactsFixture(),workspace=path.resolve('.runtime/blender-companion-tests',randomUUID());fs.mkdirSync(workspace,{recursive:true});
  const realFetch=globalThis.fetch,providerOrigin=f.room.ai.connections![0].baseUrl;
  globalThis.fetch=async(input,init)=>{
    const url=String(input);
    if(url==='https://openrouter.ai/api/v1/key')return new Response(JSON.stringify({data:{}}));
    if(url==='https://openrouter.ai/api/v1/models')return new Response(JSON.stringify({data:[{id:'controlled',name:'Controlled',architecture:{output_modalities:['text']},supported_parameters:['response_format'],pricing:{prompt:'0',completion:'0'},context_length:64000}]}));
    return realFetch(url.startsWith('https://openrouter.ai/')?`${providerOrigin}/chat/completions`:input,init);
  };
  const lease=await f.manager.connectTemporaryOpenRouter(f.room,'alice','sk-or-blender-synthetic');
  f.manager.saveTemporaryModels(f.room,'alice',lease.handle,'controlled','controlled');
  const stop=new AbortController(),states:string[]=[];let stopDuringTask=false;
  const call=async(route:string,actor:string,body?:unknown)=>fetch(f.url+route,{method:body===undefined?'GET':'POST',headers:{Authorization:`Bearer ${f.token(actor)}`,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
  const until=async(check:()=>boolean,label:string)=>{const limit=Date.now()+30_000;while(!check()){if(Date.now()>limit)throw new Error(label+': '+f.room.lastError+' '+states.slice(-3).join(' | '));await new Promise(resolve=>setTimeout(resolve,50));}};
  const pair=await(await call(`/api/rooms/${f.room.id}/blender/pair`,'alice',{})).json();
  let localApprovals=0;
  const companion=runBlenderCompanion({server:f.url,projectId:f.room.id,pairingToken:pair.pairingToken,executable:process.env.COCREATE_BLENDER_EXECUTABLE!,workspace,observe:['bob'],control:['bob'],operations:[...BLENDER_OPERATIONS],name:'Verified test device',signal:stop.signal,onState:state=>{states.push(state);if(stopDuringTask&&state.startsWith('Executing dedicated'))setTimeout(()=>stop.abort(),250);},approveLocal:async approval=>{assert.equal(approval.ownerId,'alice');assert.equal(approval.workspace,workspace);assert.deepEqual(approval.control,['bob']);localApprovals++;return true;}});
  void companion.catch(()=>undefined); // Observe early preflight rejection while the test waits for pairing.
  try {
    await until(()=>!!f.room.blender?.devices.length,'device did not pair');assert.equal(localApprovals,1);
    const sessionId=f.room.blender!.devices[0].id,base=`/api/rooms/${f.room.id}/blender/sessions/${sessionId}/control`;
    f.edit('bob','Write a Markdown document titled "Bob notes".');
    f.edit('alice','Create a Blender scene titled "Demo" with a blue cube, camera and lighting. Save the scene and render an image.');
    await new Promise(resolve=>setTimeout(resolve,150));assert.equal(f.calls.length,0);
    await f.manager.submitChanges(f.room,'alice','blender-first');await f.build();
    assert.equal(f.room.blenderArtifacts?.[0].versions.length,1,f.room.lastError);assert.equal(f.room.documentArtifacts?.length||0,0);assert.ok(f.room.pending.get('bob')?.length);
    assert.deepEqual(f.calls.map(call=>call.kind),['interpretation','blender']);
    const artifact=f.room.blenderArtifacts![0],version=artifact.versions[0];assert.equal(version.participantId,'alice');assert.ok(version.outputs.blend.byteLength>1000);assert.equal(f.manager.view(f.room).physicalUsage?.recorded.requests,2);
    const file=`/api/rooms/${f.room.id}/blender/artifacts/${artifact.id}/versions/1/scene.blend`;
    const download=await call(file,'bob');assert.equal(download.status,200);assert.equal(artifactHash(new Uint8Array(await download.arrayBuffer())),version.outputs.blend.hash);
    assert.equal((await fetch(f.url+file)).status,401);
    assert.equal((await call(file.replace(f.room.id,randomUUID()),'bob')).status,404);
    assert.equal((await call(base,'bob',{action:'pause',epoch:1})).status,403);
    // A transient private publication failure keeps the first success. Stored execution evidence is reused by explicit retry.
    let failUpload=true;
    const config=(f.manager as any).config,original=config.durableStore;
    config.durableStore={saveSnapshot:async()=>({}),appendDocumentUpdate:async()=>undefined,publishArtifactBodies:async()=>{if(failUpload)throw new Error('Controlled private upload unavailable');},assertCoordinator:async()=>undefined};
    await f.submit('alice','Update Blender scene titled "Demo" with a red cube, save it and render an image.','blender-update');await f.build();
    assert.equal(f.room.blenderArtifacts![0].versions.length,1);assert.match(f.room.lastError!,/upload unavailable/);
    const before=f.calls.length,executionCount=states.filter(state=>state.startsWith('Executing dedicated')).length;failUpload=false;
    f.manager.retryBuild(f.room,'alice','blender-reconcile');await f.build();
    assert.equal(f.calls.length,before,'retry must reconcile existing output without inference');assert.equal(states.filter(state=>state.startsWith('Executing dedicated')).length,executionCount);assert.equal(f.room.blenderArtifacts![0].versions.length,2,f.room.lastError);
    config.durableStore=original;
    // A companion crash receipt survives independently of server dispatch state. It must settle, never relaunch.
    const device=f.room.blender!.devices[0],recovered=queueScene(device,'alice',randomUUID(),scene,{participantId:'alice',fingerprint:'crash-recovery',specificationRevision:1,submissionIds:[],requirementRevisions:[],inputVersions:[]});
    writeCompanionReceipt(path.join(workspace,'.cocreate-blender-receipts',recovered.id+'.json'),{commandId:recovered.id,epoch:recovered.epoch,state:'running'});
    await f.manager.save(f.room);
    await until(()=>f.room.blender!.devices[0].command?.state==='failed','recorded execution did not reconcile');
    assert.equal(states.filter(state=>state.startsWith('Executing dedicated')).length,executionCount);
    assert.equal(f.calls.length,before);
    assert.equal((await call(base,'alice',{action:'handoff',epoch:1,actorId:'bob'})).status,200);
    assert.equal(f.room.blender!.devices[0].controllerId,'bob');assert.equal(f.room.blender!.devices[0].epoch,2);
    assert.equal((await call(base,'alice',{action:'pause',epoch:1})).status,409);
    assert.equal((await call(base,'bob',{action:'handoff',epoch:2,actorId:'alice'})).status,200);
    stopDuringTask=true;
    await f.submit('alice','Update Blender scene titled "Demo" with a green cube, save it and render an image.','blender-stop-during-task');await f.build();
    await companion;assert.equal(f.room.blender!.devices[0].state,'revoked');assert.equal(f.room.blenderArtifacts![0].versions.length,2,'local stop must retain prior successful versions');
    const count=f.calls.length;await f.reopen();assert.equal(f.calls.length,count);assert.equal(f.room.blenderArtifacts![0].versions.length,2);
    assert.equal((await call(`/api/rooms/${f.room.id}/blender/artifacts/${artifact.id}/versions/1/render.png`,'bob')).status,200);
  }finally{stop.abort();await companion.catch(()=>undefined);globalThis.fetch=realFetch;await f.close();}
});
