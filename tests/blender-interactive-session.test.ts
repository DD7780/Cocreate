import test from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes,randomUUID} from 'node:crypto';
import {createCanvasArtifactsFixture} from './fixtures/canvas-artifacts.js';
import {INTERACTIVE_BLENDER_POLICY} from '../shared/blender-interactive.js';
import {BLENDER_VERSION,BLENDER_OPERATIONS} from '../shared/blender.js';
import {recoverBlenderState,queueScene} from '../server/blender-sessions.js';

test('interactive HTTP receipts fence participants, agent conflicts and uncertain recovery; frames are private and ephemeral',async()=>{
  const f=await createCanvasArtifactsFixture();
  const request=async(path:string,actor:string,body?:unknown)=>{const response=await fetch(f.url+path,{method:body===undefined?'GET':'POST',headers:{Authorization:'Bearer '+f.token(actor),'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:response.status,body:response.headers.get('content-type')?.includes('json')?await response.json():await response.arrayBuffer()};};
  const base=`/api/rooms/${f.room.id}/blender`,devices=`/api/blender/devices/${f.room.id}`;
  const credential=randomBytes(32).toString('base64url');
  try{
    const pair=(await request(base+'/pair','alice',{})).body;
    const response=await fetch(f.url+devices+'/pair',{method:'POST',headers:{Authorization:'Bearer '+pair.pairingToken,'Content-Type':'application/json'},body:JSON.stringify({credential,name:'Protocol fixture (no native proof)',observe:['bob'],control:['bob'],operations:[...BLENDER_OPERATIONS],blenderVersion:BLENDER_VERSION,localApproval:true,interactivePolicy:INTERACTIVE_BLENDER_POLICY})});assert.equal(response.status,200);
    const session=await response.json(),sessionPath=base+'/sessions/'+session.id;
    const device=async(operation:string,body:unknown)=>{const response=await fetch(f.url+devices+'/'+session.id+'/'+operation,{method:'POST',headers:{Authorization:'Bearer '+credential,'Content-Type':'application/json'},body:JSON.stringify(body)});return {status:response.status,body:await response.json()};};
    assert.equal((await request(sessionPath+'/input','bob',{requestId:randomUUID(),epoch:1,action:'open'})).status,409);
    const open={requestId:randomUUID(),epoch:1,action:'open'},first=await request(sessionPath+'/input','alice',open);assert.equal(first.status,200);
    assert.equal((await request(sessionPath+'/input','alice',open)).body.id,first.body.id);
    assert.equal((await request(sessionPath+'/input','alice',{...open,action:'close'})).status,409);
    assert.equal((await request(sessionPath+'/control','alice',{action:'handoff',epoch:1,actorId:'bob'})).status,409);
    const current=f.room.blender!.devices[0];assert.throws(()=>queueScene(current,'alice',randomUUID(),f.control.scene,{participantId:'alice',fingerprint:'fixture',specificationRevision:1,submissionIds:[],requirementRevisions:[],inputVersions:[]}));
    await device('poll',{});assert.equal((await device('interactive-result',{commandId:open.requestId,epoch:1,state:'completed'})).status,200);
    const frame=Buffer.alloc(45);Buffer.from([137,80,78,71,13,10,26,10]).copy(frame);frame.writeUInt32BE(960,16);frame.writeUInt32BE(640,20);frame.write('IEND',37);
    assert.equal((await device('frame',{epoch:1,png:frame.toString('base64')})).status,200);
    assert.equal((await request(sessionPath+'/frame','alice')).status,200);assert.equal((await request(sessionPath+'/frame','bob')).status,200);
    f.manager.join(f.room,'eve','Eve');assert.equal((await request(sessionPath+'/frame','eve')).status,403);
    assert.equal(JSON.stringify(f.room.blender).includes(frame.toString('base64')),false);
    assert.equal((await request(sessionPath+'/control','alice',{action:'handoff',epoch:1,actorId:'bob'})).status,200);
    assert.equal((await request(sessionPath+'/frame','bob')).status,409,'old-epoch frames are fenced');
    assert.equal((await request(sessionPath+'/input','alice',{requestId:randomUUID(),epoch:1,action:'input',input:{kind:'key',key:'g'}})).status,409);
    const input={requestId:randomUUID(),epoch:2,action:'input',input:{kind:'key',key:'g'}};assert.equal((await request(sessionPath+'/input','bob',input)).status,200);
    const recovered=recoverBlenderState(f.room.blender);assert.equal(recovered.devices[0].interactive!.state,'unknown');assert.equal(recovered.devices[0].interactive!.receipts.at(-1)!.state,'unknown');assert.equal(recovered.devices[0].epoch,3);
    await f.reopen();assert.equal(f.calls.length,0);assert.equal((await request(sessionPath+'/frame','bob')).status,409);
    assert.equal((await request(sessionPath+'/input','bob',input)).status,409);
  }finally{await f.close();}
});
