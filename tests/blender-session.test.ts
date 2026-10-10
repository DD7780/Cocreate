import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, randomBytes } from 'node:crypto';
import { createPair, pairingOwner, approveDevice, deviceAccess, sessionAccess, sessionCommand, queueScene, recoverBlenderState, initialBlenderState, PAIR_MS, CONNECTION_MS, IDLE_MS } from '../server/blender-sessions.js';
import { validateBlenderScene, BLENDER_OPERATIONS, BLENDER_VERSION, type BlenderScene } from '../shared/blender.js';
import { submittedOutput } from '../server/document-intent.js';
import { snapshotBlender } from '../server/blender-artifacts.js';
import { createCanvasArtifactsFixture } from './fixtures/canvas-artifacts.js';

const scene: BlenderScene = { objects: [{kind:'cube',name:'Blue cube',location:[0,0,1],scale:[1,1,1],color:[0.1,0.25,0.8]}], camera:{location:[7,-9,6],target:[0,0,1]},lights:[{location:[2,-3,7],energy:1000}] };
const freeze = {participantId:'alice',fingerprint:'accepted-test',specificationRevision:1,submissionIds:['submission'],requirementRevisions:[{id:'requirement',revision:1}],inputVersions:[]};
function connection(clock=Date.now()) {
  const state=initialBlenderState(),pair=createPair(state,'alice',clock),credential=randomBytes(32).toString('base64url');
  const device=approveDevice(state,pair.pairingToken,{credential,name:'Test device',observe:['bob'],control:['bob'],operations:[...BLENDER_OPERATIONS],blenderVersion:BLENDER_VERSION,localApproval:true},['alice','bob','eve'],clock);
  return {state,pair,credential,device};
}
test('pairing is authenticated capability, expiring/single-use and locally approved; device revocation and session grants are distinct',()=>{
  const now=Date.now(),f=connection(now);
  assert.throws(()=>pairingOwner(f.state,f.pair.pairingToken,now),/already used/);
  const next=createPair(f.state,'alice',now);
  assert.throws(()=>pairingOwner(f.state,next.pairingToken,now+PAIR_MS),/expired/);
  assert.throws(()=>approveDevice(f.state,next.pairingToken,{localApproval:false},['alice'],now),/locally approved/);
  assert.throws(()=>deviceAccess(f.state,f.device.id,'bad',now),/authentication/);
  assert.throws(()=>deviceAccess(f.state,f.device.id,f.credential,now+CONNECTION_MS),/expired/);
  assert.throws(()=>deviceAccess(f.state,f.device.id,f.credential,now+IDLE_MS),/expired/);
  assert.throws(()=>sessionCommand(f.state,f.device.id,'alice',{action:'resume',epoch:1},now+IDLE_MS),/unavailable/);
  const expired=connection(now),renewed=createPair(expired.state,'alice',now+CONNECTION_MS);
  approveDevice(expired.state,renewed.pairingToken,{credential:randomBytes(32).toString('base64url'),name:'Renewed device',observe:[],control:[],operations:[...BLENDER_OPERATIONS],blenderVersion:BLENDER_VERSION,localApproval:true},['alice'],now+CONNECTION_MS);
  assert.equal(expired.device.state,'expired');
  assert.throws(()=>sessionAccess(f.state,f.device.id,'eve'),/separate local/);
  const readOnly=connection(now);readOnly.device.control=['alice'];
  assert.equal(sessionAccess(readOnly.state,readOnly.device.id,'bob').id,readOnly.device.id);
  assert.throws(()=>sessionAccess(readOnly.state,readOnly.device.id,'bob',true),/separate local/);
  sessionCommand(f.state,f.device.id,'alice',{action:'disconnect',epoch:1},now);
  assert.throws(()=>deviceAccess(f.state,f.device.id,f.credential,now),/authentication|revoked/);
});
test('one mutable controller fences stale epochs/concurrent commands, waits for cleanup before handoff, and recovers without dispatch',()=>{
  const f=connection(),id=f.device.id;
  assert.throws(()=>queueScene(f.device,'bob',randomUUID(),scene,freeze),/explicit control/);
  const command=queueScene(f.device,'alice',randomUUID(),scene,freeze);
  assert.throws(()=>queueScene(f.device,'alice',randomUUID(),scene,freeze),/explicit control/);
  assert.throws(()=>sessionCommand(f.state,id,'alice',{action:'handoff',epoch:1,actorId:'bob'}),/acknowledgement/);
  sessionCommand(f.state,id,'alice',{action:'pause',epoch:1});assert.equal(command.state,'cancel_requested');assert.equal(f.device.paused,true);
  assert.throws(()=>sessionCommand(f.state,id,'alice',{action:'handoff',epoch:1,actorId:'bob'}),/acknowledgement/);
  command.state='cancelled';f.device.mode='human';
  sessionCommand(f.state,id,'alice',{action:'handoff',epoch:1,actorId:'bob'});assert.equal(f.device.controllerId,'bob');assert.equal(f.device.epoch,2);
  assert.throws(()=>sessionCommand(f.state,id,'alice',{action:'resume',epoch:1}),/Stale/);
  assert.throws(()=>sessionCommand(f.state,id,'alice',{action:'resume',epoch:2}),/current controller/);
  sessionCommand(f.state,id,'bob',{action:'resume',epoch:2});
  queueScene(f.device,'bob',randomUUID(),scene,{...freeze,participantId:'bob'});
  const restored=recoverBlenderState(f.state);assert.equal(restored.devices[0].command?.state,'interrupted');
  assert.throws(()=>sessionCommand(restored,id,'bob',{action:'handoff',epoch:2,actorId:'alice'}),/acknowledgement/);
});
test('structured scenes deny scripts, paths, network, nonfinite values, excessive geometry and unsupported routing',()=>{
  assert.deepEqual(validateBlenderScene(scene),scene);
  for(const extra of [{python:'import os'},{path:'../private'},{url:'https://example.com'},{shell:'cmd.exe'}])assert.throws(()=>validateBlenderScene({...scene,...extra}));
  assert.throws(()=>validateBlenderScene({...scene,objects:[{...scene.objects[0],name:'../private'}]}));
  assert.throws(()=>validateBlenderScene({...scene,objects:[{...scene.objects[0],location:[NaN,0,0]}]}));
  assert.throws(()=>validateBlenderScene({...scene,objects:Array(13).fill(scene.objects[0])}));
  assert.throws(()=>validateBlenderScene({...scene,camera:{location:[0,0,0],target:[0,0,0]}}));
  assert.equal(submittedOutput('Create a Blender scene titled "Demo". Save and render it.').output?.kind,'blender');
  assert.ok(submittedOutput('Create a Blender scene with a Python script.').reason);
  assert.ok(submittedOutput('Create a Blender scene and import a file.').reason);
  assert.ok(submittedOutput('Import an existing scene.',{kind:'blender',id:'blend_'+'a'.repeat(24),title:'Demo'}).reason);
  assert.ok(submittedOutput('Create a Blender scene and write a Markdown document titled "Notes".').reason);
  assert.throws(()=>snapshotBlender({artifactContractVersion:2,blenderArtifacts:[{}]},'project'));
});
test('HTTP device/session authority, serialized handoff, replay and restart retain no automatic execution',async()=>{
  const f=await createCanvasArtifactsFixture();
  const request=async(route:string,actor='alice',body?:unknown)=>fetch(f.url+route,{method:body===undefined?'GET':'POST',headers:{Authorization:`Bearer ${f.token(actor)}`,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
  try {
    const base=`/api/rooms/${f.room.id}/blender`,deviceBase=`/api/blender/devices/${f.room.id}`;
    assert.equal((await fetch(f.url+base+'/pair',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status,401);
    const pair=await (await request(base+'/pair','alice',{})).json(),credential=randomBytes(32).toString('base64url');
    const claim=()=>fetch(f.url+deviceBase+'/pair',{method:'POST',headers:{Authorization:`Bearer ${pair.pairingToken}`,'Content-Type':'application/json'},body:JSON.stringify({credential,name:'Controlled device',observe:[],control:[],operations:[...BLENDER_OPERATIONS],blenderVersion:BLENDER_VERSION,localApproval:true})});
    const response=await claim();assert.equal(response.status,200);const session=await response.json();
    assert.equal((await claim()).status,401);
    assert.deepEqual((await (await request(base+'/sessions','bob')).json()).sessions,[]);
    assert.equal((await request(base+`/sessions/${session.id}/control`,'bob',{action:'pause',epoch:1})).status,403);
    assert.equal((await request(base+`/sessions/${session.id}/control`,'alice',{action:'handoff',epoch:1,actorId:'bob'})).status,403);
    assert.equal(f.calls.length,0);
    await f.reopen();assert.equal(f.calls.length,0);assert.equal(f.room.blender?.devices[0].id,session.id);
    assert.equal((await request(base+`/sessions/${session.id}/control`,'alice',{action:'disconnect',epoch:1})).status,200);
    const poll=await fetch(f.url+deviceBase+`/${session.id}/poll`,{method:'POST',headers:{Authorization:`Bearer ${credential}`,'Content-Type':'application/json'},body:'{}'});assert.equal(poll.status,401);
  }finally{await f.close();}
});
