import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import * as Y from 'yjs';
import { generateProjectPlan, extractRequirement } from '../server/generator.js';
import { ProviderError } from '../server/providers.js';
import { RoomManager } from '../server/rooms.js';
import { EventStore } from '../server/event-store.js';
import { CoordinatorUnavailableError, RemoteCoordinator } from '../server/coordinator.js';
import { applySteeringUpdate } from '../server/steering-edits.js';

const plan=(name:string,content:string)=>({operations:[{type:'write',path:name,content}],summary:'Updated',decisions:[],conflicts:[],specification:{agreed:[],proposed:[],questions:[]}});
const response=(value:unknown,status='completed')=>({output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}],status,incomplete_details:status==='incomplete'?{reason:'max_output_tokens'}:undefined,usage:{input_tokens:10,output_tokens:20}});
const interpreted=(text:string)=>({goals:[text],features:[],design:[],constraints:[],questions:[],additions:[],modifications:[],withdrawals:[],classification:'explicit_request',affectedRequirementIds:[],sourcePassages:[text],intents:[{text,category:'goal',classification:'explicit_request',rationale:'Direct request',sourcePassage:text,affectedRequirementIds:[]}]});
const connectFixture=async(manager:RoomManager,room:ReturnType<RoomManager['create']>,baseUrl:string)=>{
  const connection=(await manager.saveConnection(room,{name:'Synthetic',provider:'custom',baseUrl,apiFormat:'responses',apiKey:'synthetic'})).id;
  room.ai.connections![0].checks.builder={reachable:{status:'passed'},text:{status:'passed'},personal:{status:'passed'},builder:{status:'passed'}};
  await manager.assignAI(room,{connectionId:connection,model:'builder'},{connectionId:connection,model:'builder'});
};
const edit=(manager:RoomManager,room:ReturnType<RoomManager['create']>,text:string)=>{
  const doc=new Y.Doc();Y.applyUpdate(doc,Y.encodeStateAsUpdate(room.doc));const vector=Y.encodeStateVector(doc),p=new Y.XmlElement('paragraph'),t=new Y.XmlText();doc.getXmlFragment('default').push([p]);p.push([t]);t.insert(0,text);
  manager.handleMessage(room,{participantId:'alice',readyState:0,send(){}} as any,Buffer.concat([Buffer.from([0]),Buffer.from(Y.encodeStateAsUpdate(doc,vector))]),true);doc.destroy();
};
const waitFor=async(check:()=>boolean)=>{for(let i=0;i<250;i++){if(check())return;await new Promise(resolve=>setTimeout(resolve,20))}throw new Error('Timed out');};
const fixture=async(handler:(body:any)=>unknown|Promise<unknown>)=>{
  const server=http.createServer(async(req,res)=>{let raw='';for await(const chunk of req)raw+=chunk;const value=await handler(JSON.parse(raw));res.setHeader('content-type','application/json');res.end(JSON.stringify(value));});
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  return{baseUrl:`http://127.0.0.1:${(server.address() as {port:number}).port}`,close:()=>new Promise<void>(resolve=>server.close(()=>resolve()))};
};

test('CRDT attribution retains exact repeated-prefix insertions and excludes untouched teammates text',()=>{
  const server=new Y.Doc(),client=new Y.Doc(),paragraph=new Y.XmlElement('paragraph'),text=new Y.XmlText();
  client.getXmlFragment('default').push([paragraph]);paragraph.push([text]);text.insert(0,'Add favorites. Build catalog.');
  assert.equal(applySteeringUpdate(server,Y.encodeStateAsUpdate(client),'alice'),'Add favorites. Build catalog.');
  const vector=Y.encodeStateVector(client);text.insert(0,'Add filters. ');text.insert(text.length,' Offline sorting.');
  const inserted=applySteeringUpdate(server,Y.encodeStateAsUpdate(client,vector),'cara');
  assert.match(inserted,/Add filters\./);assert.match(inserted,/Offline sorting\./);assert.doesNotMatch(inserted,/favorites|catalog|ilters\. Add f/);
  assert.equal(applySteeringUpdate(server,Y.encodeStateAsUpdate(client,vector),'cara'),'','replayed CRDT changes contain no new steering');
  const prefixClient=new Y.Doc(),prefixServer=new Y.Doc(),p=new Y.XmlElement('paragraph'),t=new Y.XmlText();prefixClient.getXmlFragment('default').push([p]);p.push([t]);t.insert(0,'Add favorites.');Y.applyUpdate(prefixServer,Y.encodeStateAsUpdate(prefixClient));const prefixVector=Y.encodeStateVector(prefixClient);t.insert(5,'ilters. Add f');assert.equal(applySteeringUpdate(prefixServer,Y.encodeStateAsUpdate(prefixClient,prefixVector),'cara'),'Add filters. ');prefixClient.destroy();prefixServer.destroy();
  client.destroy();server.destroy();
});

test('physical recovery calls and spending reservations cannot exceed their shared frozen bounds',async()=>{
  let dispatched=0;
  const provider=await fixture(()=>{dispatched++;return response({value:'ok'});});
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'workflow-budget-')),manager=new RoomManager({dataDir:dir,debounceMs:10,encryptionSecret:'synthetic'}),room=manager.create('room');
  const {generateText}=await import('../server/providers.js');
  const setup={mode:'custom' as const,resolved:{personal:{model:'builder',rate:{currency:'USD' as const,inputPerMillion:1,outputPerMillion:2,reasoningBilling:'not_separately_reported' as const,reasoningNote:'Synthetic',sourceUrl:'https://example.test',verifiedAt:'2026-10-01'},maxInputTokens:5000,maxOutputTokens:500,connectionId:'x',connectionName:'x',provider:'custom' as const},builder:undefined as any,repairAttempts:1}};setup.resolved.builder=setup.resolved.personal;
  const call=()=> (manager as any).tracked(room,{purpose:'builder',provider:'custom',model:'builder',workflowRunId:'run',setup},()=>generateText({provider:'custom',baseUrl:provider.baseUrl,apiKey:'synthetic',apiFormat:'responses'},{model:'builder',instructions:'Test',input:'Test',maxOutputTokens:500}));
  try{room.executionBudget={calls:23,reservedUsd:0};await call();assert.equal(dispatched,1);await assert.rejects(call,/24 physical-call ceiling/);assert.equal(dispatched,1);room.executionBudget={calls:0,reservedUsd:0,maximumUsd:0};await assert.rejects(call,/spending limit/);assert.equal(dispatched,1);}finally{manager.shutdown();await provider.close();fs.rmSync(dir,{recursive:true,force:true});}
});

test('output exhaustion becomes coherent smaller tasks, checkpoints before continuing, and never applies truncated JSON',async()=>{
  const bodies:any[]=[],checkpoints:string[]=[];
  const provider=await fixture(body=>{bodies.push(body);const input=JSON.parse(body.input);if(bodies.length===1)return response(plan('src/App.tsx','invalid truncated source'),'incomplete');if(input.task){assert.equal(checkpoints.length,input.taskIndex-1);return response(plan(input.task.path,input.task.path.endsWith('.css')?'body{color:purple}':'export default function App(){return <main>Recovered</main>}'));}return response({tasks:[{title:'Styles',path:'src/styles.css',instruction:'Add styling'},{title:'Interface',path:'src/App.tsx',instruction:'Build UI'}]});});
  try{
    const result=await generateProjectPlan({mode:'openai',apiKey:'synthetic',model:'builder',provider:'custom',apiFormat:'responses',baseUrl:provider.baseUrl,maxOutputTokens:500,checkpoint:async value=>{checkpoints.push(value.task);assert.ok(value.files.every(file=>!file.content.includes('invalid truncated source')));}},[],undefined);
    assert.equal(bodies.length,4);assert.equal(result.usage.inputTokens,40);assert.equal(result.usage.outputTokens,80);assert.deepEqual(checkpoints,['Styles','Interface']);assert.equal(result.value.operations.length,2);assert.equal(bodies[1].max_output_tokens,500);assert.ok(!JSON.parse(bodies[1].input).currentProject,'planner requests a manifest instead of regenerated code');
  }finally{await provider.close();}
});

test('a second output exhaustion stops a smaller task with actionable checkpoint evidence',async()=>{
  let calls=0,completed=0;
  const provider=await fixture(body=>{calls++;const input=JSON.parse(body.input);if(calls===1)return response({},'incomplete');if(!input.task)return response({tasks:[{title:'Styles',path:'src/styles.css',instruction:'Styles'},{title:'UI',path:'src/App.tsx',instruction:'UI'}]});return input.taskIndex===1?response(plan('src/styles.css','body{margin:0}')):response(plan('src/App.tsx','not applied'),'incomplete');});
  try{await assert.rejects(()=>generateProjectPlan({mode:'openai',apiKey:'synthetic',model:'builder',provider:'custom',apiFormat:'responses',baseUrl:provider.baseUrl,maxOutputTokens:500,checkpoint:async()=>{completed++;}},[],undefined),error=>error instanceof ProviderError&&error.kind==='truncated'&&/task 2\/2.*1 completed tasks.*working artifact is retained/i.test(error.message)&&error.usage?.outputTokens===80);assert.equal(calls,4);assert.equal(completed,1);}finally{await provider.close();}
});

test('coordinator leases serialize owners and fence expired workers after takeover',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'workflow-fence-'));const a=new EventStore(dir),b=new EventStore(dir);
  try{const epoch=a.claimCoordinator('room','a',100,1000);assert.throws(()=>b.claimCoordinator('room','b',100,1050),/Another coordinator/);const next=b.claimCoordinator('room','b',100,1101);assert.ok(next>epoch);assert.throws(()=>a.renewCoordinator('room','a',epoch,100,1102),/ownership expired or changed/);b.renewCoordinator('room','b',next,100,1102);a.releaseCoordinator('room','a',epoch);b.renewCoordinator('room','b',next,100,1103);}finally{a.close();b.close();fs.rmSync(dir,{recursive:true,force:true});}
});

test('remote coordinator renewal cannot silently reacquire ownership for an old worker',async()=>{
  let owner='',epoch=0,expired=false;
  const rpc=async(_name:string,input:Record<string,unknown>)=>{if(input.expected_epoch===null){if(owner&&owner!==input.target_owner_id&&!expired)return{data:null,error:{message:'owned'}};owner=String(input.target_owner_id);epoch++;expired=false;return{data:epoch,error:null};}return owner===input.target_owner_id&&epoch===input.expected_epoch&&!expired?{data:epoch,error:null}:{data:null,error:{message:'stale'}};};
  const a=new RemoteCoordinator(rpc),b=new RemoteCoordinator(rpc);
  try{await a.claim('room');await assert.rejects(()=>b.claim('room'),CoordinatorUnavailableError);expired=true;await b.claim('room');await assert.rejects(()=>a.assert('room'),CoordinatorUnavailableError);await assert.rejects(()=>a.claim('room'),CoordinatorUnavailableError);assert.throws(()=>a.fence('room'),/unavailable/);}finally{await a.close();await b.close();}
});

test('remote saves commit in revision order and acknowledge the actual snapshot',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'workflow-saves-')),pending:{revision:number;resolve:(value:unknown)=>void}[]=[];
  const manager=new RoomManager({dataDir:dir,debounceMs:10,encryptionSecret:'synthetic',durableStore:{saveSnapshot:async(_id,revision)=>new Promise(resolve=>pending.push({revision,resolve})),appendDocumentUpdate:async()=>{}}});
  const room=manager.create('room'),messages:any[]=[];room.clients.add({readyState:1,send:(raw:unknown)=>{if(typeof raw==='string')messages.push(JSON.parse(raw))}} as any);
  try{const one=manager.save(room),two=manager.save(room);await waitFor(()=>pending.length===1);assert.equal(pending[0].revision,1);pending.shift()!.resolve(true);await waitFor(()=>pending.length===1);assert.equal(pending[0].revision,2);pending.shift()!.resolve(true);await one;await waitFor(()=>pending.length===1);assert.equal(pending[0].revision,3);pending.shift()!.resolve(true);await two;assert.deepEqual(messages.filter(item=>item.type==='saved').map(item=>item.revision),[1,2,3]);assert.ok(messages.every(item=>item.vector));}finally{manager.shutdown();fs.rmSync(dir,{recursive:true,force:true});}
});

test('failed cloud snapshots reject flushes and interrupted captured edits return to their author',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'workflow-flush-'));
  const manager=new RoomManager({dataDir:dir,debounceMs:10,encryptionSecret:'synthetic',durableStore:{saveSnapshot:async()=>{throw new Error('Cloud unavailable')},appendDocumentUpdate:async()=>{}}});
  try{
    const room=manager.create('room');manager.join(room,'alice','Alice');const messages:any[]=[];
    const client={participantId:'alice',readyState:1,send(raw:unknown){if(typeof raw==='string')messages.push(JSON.parse(raw));}} as any;
    room.clients.add(client);manager.handleMessage(room,client,Buffer.from(JSON.stringify({type:'flush',requestId:'flush-1'})),false);
    await waitFor(()=>messages.some(item=>item.type==='flush-error'));assert.ok(!messages.some(item=>item.type==='flushed'));assert.ok(!messages.some(item=>item.type==='saved'));
    const recovered=manager.hydrate('other',{participants:[{id:'alice',name:'Alice'}],editHistory:[],pending:[],submissions:[{capturedChanges:[{seq:1,participantId:'alice',after:'Build catalog',before:'',kind:'insert'}],id:'command',requestId:'one',participantId:'alice',editSeqs:[1],status:'interpreting'}]});
    assert.equal(recovered.pending.get('alice')?.[0].after,'Build catalog');assert.equal(recovered.submissions[0].status,'failed');assert.equal(recovered.pending.get('bob'),undefined);
  }finally{manager.shutdown();fs.rmSync(dir,{recursive:true,force:true});}
});

test('context overflow is distinct from output exhaustion and does not trigger paid recovery calls',async()=>{
  let calls=0;const server=http.createServer((_req,res)=>{calls++;res.writeHead(400,{'content-type':'application/json'});res.end(JSON.stringify({error:{message:'maximum context length exceeded'}}));});
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{await assert.rejects(()=>generateProjectPlan({mode:'openai',apiKey:'synthetic',model:'builder',provider:'custom',apiFormat:'responses',baseUrl:`http://127.0.0.1:${(server.address() as any).port}`},[],undefined),error=>error instanceof ProviderError&&error.kind==='context_limit');assert.equal(calls,1);}finally{await new Promise<void>(resolve=>server.close(()=>resolve()));}
});

test('interpretation submits every captured source without silently clipping old edits or long text',async()=>{
  let captured:any[]=[];const provider=await fixture(body=>{captured=JSON.parse(body.input).authenticatedChanges;return response(interpreted('Build catalog'));});
  try{
    const changes=Array.from({length:30},(_,index)=>({seq:index+1,kind:'insert' as const,before:'',after:`Request ${index} ${'text '.repeat(100)} END`}));
    const result=await extractRequirement({mode:'openai',apiKey:'synthetic',model:'builder',provider:'custom',apiFormat:'responses',baseUrl:provider.baseUrl},'alice','Alice',changes,'',undefined,1);
    assert.equal(captured.length,30);assert.equal(captured[0].after,changes[0].after);assert.deepEqual(result.value.sourceEditSeqs,changes.map(change=>change.seq));
  }finally{await provider.close();}
});

test('failed cloud acceptance restores the accepted baseline and the captured participant draft',async()=>{
  const provider=await fixture(()=>response(interpreted('Build catalog'))),dir=fs.mkdtempSync(path.join(os.tmpdir(),'acceptance-rollback-'));
  const manager=new RoomManager({dataDir:dir,debounceMs:10,encryptionSecret:'synthetic',durableStore:{saveSnapshot:async(_id,_revision,payload)=>{if(payload.specificationRevision===1)throw new Error('Cloud unavailable');},appendDocumentUpdate:async()=>{}}});
  try{const room=manager.create('room');manager.join(room,'alice','Alice');await connectFixture(manager,room,provider.baseUrl);edit(manager,room,'Build catalog');await assert.rejects(()=>manager.submitChanges(room,'alice','request-one'),/durably saved/);assert.equal(room.specificationRevision,0);assert.equal(room.sharedRequirements.length,0);assert.equal(room.participants.get('alice')?.latest,undefined);assert.equal(room.pending.get('alice')?.[0].after,'Build catalog');assert.equal(room.submissions[0].status,'failed');assert.equal(room.requirementRevisions?.at(-1)?.revision,0);await room.persistQueue;}finally{manager.shutdown();await provider.close();fs.rmSync(dir,{recursive:true,force:true});}
});

test('an exhausted recovery leaves the previously promoted and compiled artifact available',async()=>{
  let exhaust=false;
  const provider=await fixture(body=>{const input=JSON.parse(body.input);if(body.text.format.schema.required.includes('goals'))return response(interpreted(input.authenticatedChanges.map((item:any)=>item.after).join(' ')));return exhaust?response({},'incomplete'):response(plan('src/App.tsx','export default function App(){return <main>Working catalog</main>}'));});
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'artifact-retention-')),manager=new RoomManager({dataDir:dir,debounceMs:10,buildDebounceMs:20,buildCooldownMs:0,encryptionSecret:'synthetic'});
  try{const room=manager.create(`retained-${crypto.randomUUID()}`);manager.join(room,'alice','Alice');await connectFixture(manager,room,provider.baseUrl);edit(manager,room,'Build catalog');await manager.submitChanges(room,'alice','one');await waitFor(()=>room.versions.length===1&&!room.buildTask);const working=structuredClone(room.versions[0]);exhaust=true;edit(manager,room,'Add favorites');await manager.submitChanges(room,'alice','two');await waitFor(()=>room.status==='Error'&&!room.buildTask);assert.equal(room.versions.length,1);assert.deepEqual(room.versions[0],working);assert.match(room.lastError||'',/Working artifact v1 retained/);assert.match(room.lastError||'',/24 physical calls/);assert.equal(manager.view(room).latestVersion,1);}finally{manager.shutdown();await provider.close();fs.rmSync(dir,{recursive:true,force:true});}
});

test('independent participants submit in durable capture order, retain later build inputs and saved drafts on reload',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'workflow-submissions-')),seen:string[]=[];let builds=0,releaseFirstBuild:()=>void=()=>{};const firstBuildGate=new Promise<void>(resolve=>{releaseFirstBuild=resolve});
  const provider=await fixture(async body=>{const input=JSON.parse(body.input);if(body.text.format.schema.required.includes('goals')){seen.push(input.participantName);if(input.participantName==='Alice')await new Promise(resolve=>setTimeout(resolve,80));const text=input.authenticatedChanges.map((change:any)=>change.after).join(' ');assert.doesNotMatch(text,/unsubmitted/);assert.doesNotMatch(input.sharedBrainstormCanvas,/unsubmitted/);return response({goals:[text],features:[],design:[],constraints:[],questions:[],additions:[],modifications:[],withdrawals:[],classification:'explicit_request',affectedRequirementIds:[],sourcePassages:[text],intents:[{text,category:'goal',classification:'explicit_request',rationale:'Direct request',sourcePassage:text,affectedRequirementIds:[]}]});}builds++;if(builds===1)await firstBuildGate;return response(plan('src/App.tsx',`export default function App(){return <main>Build ${builds}</main>}`));});
  let manager=new RoomManager({dataDir:dir,debounceMs:10,buildDebounceMs:20,buildCooldownMs:0,encryptionSecret:'synthetic'}),room=manager.create('room');
  const docs:Y.Doc[]=[];
  const write=(id:string,text:string)=>{let doc=docs[['alice','bob','cara'].indexOf(id)];if(!doc){doc=new Y.Doc();docs[['alice','bob','cara'].indexOf(id)]=doc;Y.applyUpdate(doc,Y.encodeStateAsUpdate(room.doc));}const vector=Y.encodeStateVector(doc),p=new Y.XmlElement('paragraph'),t=new Y.XmlText();doc.transact(()=>{doc.getXmlFragment('default').push([p]);p.push([t]);t.insert(0,text);});manager.handleMessage(room,{participantId:id,readyState:0,send(){}} as any,Buffer.concat([Buffer.from([0]),Buffer.from(Y.encodeStateAsUpdate(doc,vector))]),true);};
  try{for(const [id,name] of [['alice','Alice'],['bob','Bob'],['cara','Cara']])manager.join(room,id,name);const connection=(await manager.saveConnection(room,{name:'Synthetic',provider:'custom',baseUrl:provider.baseUrl,apiFormat:'responses',apiKey:'synthetic'})).id;room.ai.connections![0].checks.builder={reachable:{status:'passed'},text:{status:'passed'},personal:{status:'passed'},builder:{status:'passed'}};await manager.assignAI(room,{connectionId:connection,model:'builder'},{connectionId:connection,model:'builder'});
    write('alice','Build a catalog');write('bob','Add favorites');write('cara','unsubmitted filters');const a=manager.submitChanges(room,'alice','request-a'),b=manager.submitChanges(room,'bob','request-b');await Promise.all([a,b]);assert.deepEqual(seen,['Alice','Bob']);assert.equal(room.sharedRequirements.filter(item=>item.status==='accepted').length,2);await waitFor(()=>builds===1);write('alice','Add sorting');await manager.submitChanges(room,'alice','request-c');releaseFirstBuild();await waitFor(()=>room.versions.length===1&&!room.buildTask);assert.ok(builds>=2,'the fixed active build is superseded and later accepted steering is processed');assert.equal(room.submissions.filter(item=>item.status==='built').length,3);assert.equal(room.pending.get('cara')?.length,1);assert.equal((await manager.submitChanges(room,'bob','request-b')).submissionId,room.submissions.find(item=>item.requestId==='request-b')!.id);manager.save(room);manager.shutdown();manager=new RoomManager({dataDir:dir,debounceMs:10,encryptionSecret:'synthetic'});room=manager.get('room')!;assert.equal(room.pending.get('cara')?.length,1);assert.equal(room.commandReceipts?.[JSON.stringify(['bob','request-b'])].status,'built');assert.equal(room.requirementRevisions?.at(-1)?.revision,room.specificationRevision);
  }finally{releaseFirstBuild();manager.shutdown();for(const doc of docs)doc?.destroy();await provider.close();fs.rmSync(dir,{recursive:true,force:true});}
});

test('ownership loss after compilation blocks promotion; command replay adds no physical call',async()=>{
  let calls=0,lose!:(id:string)=>void,release!:()=>void,entered!:()=>void,promotions=0,canonicalVersions=0;
  const gate=new Promise<void>(resolve=>{release=resolve}),bundling=new Promise<void>(resolve=>{entered=resolve});
  const provider=await fixture(body=>{calls++;return response(body.text.format.schema.required.includes('goals')?interpreted('Build catalog'):plan('src/App.tsx','export default function App(){return <main>Compiled fixture</main>}'))});
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'lost-promotion-')),manager=new RoomManager({dataDir:dir,debounceMs:10,buildDebounceMs:20,buildCooldownMs:0,encryptionSecret:'synthetic',durableStore:{saveSnapshot:async(_id,_revision,payload)=>{canonicalVersions=(payload.versions as any[]).length},appendDocumentUpdate:async()=>{},assertCoordinator:async()=>{},recordProviderRequest:async()=>{},onCoordinatorLost:callback=>{lose=callback;return()=>{}}}});
  const execute=manager.tools.execute.bind(manager.tools);
  manager.tools.execute=(async(name:any,input:any,context:any)=>{const result=await execute(name,input,context);if(name==='project.bundle'){entered();await gate}if(name==='project.promote')promotions++;return result}) as typeof manager.tools.execute;
  try{
    const room=manager.create(`lost-${crypto.randomUUID()}`);manager.join(room,'alice','Alice');await connectFixture(manager,room,provider.baseUrl);edit(manager,room,'Build catalog');
    const first=await manager.submitChanges(room,'alice','same-command');await bundling;const before=calls;
    assert.equal((await manager.submitChanges(room,'alice','same-command')).submissionId,first.submissionId);assert.equal(calls,before);assert.equal(calls,2);
    lose(room.id);release();await room.buildTask;await room.persistQueue;
    assert.equal(promotions,0);assert.equal(room.versions.length,0);assert.equal(canonicalVersions,0);assert.throws(()=>manager.save(room),CoordinatorUnavailableError);
  }finally{release();manager.shutdown();await provider.close();fs.rmSync(dir,{recursive:true,force:true})}
});


test('unavailable isolation retains the promoted artifact and stops before builder dispatch or repairs',async()=>{
  let builders=0,interpreters=0;
  const provider=await fixture(body=>{
    if(body.text.format.schema.required.includes('goals')){interpreters++;const input=JSON.parse(body.input);return response(interpreted(input.authenticatedChanges.map((item:any)=>item.after).join(' ')))}
    builders++;return response(plan('src/App.tsx','export default function App(){return <main>Retained isolated product</main>}'));
  });
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'isolation-build-retention-'));
  const manager=new RoomManager({dataDir:dir,debounceMs:10,buildDebounceMs:20,buildCooldownMs:0,encryptionSecret:'synthetic'});
  const prior=process.env.COCREATE_ISOLATION_MODE;
  try{
    const room=manager.create(`isolated-${crypto.randomUUID()}`);manager.join(room,'alice','Alice');await connectFixture(manager,room,provider.baseUrl);
    edit(manager,room,'Build catalog');await manager.submitChanges(room,'alice','one');await waitFor(()=>room.versions.length===1&&!room.buildTask);
    const working=structuredClone(room.versions[0]);assert.equal(builders,1);
    process.env.COCREATE_ISOLATION_MODE='unavailable';edit(manager,room,'Add favorites');const command=await manager.submitChanges(room,'alice','two');
    await waitFor(()=>room.status==='Error'&&!room.buildTask);
    assert.deepEqual(room.versions,[working]);assert.equal(manager.view(room).latestVersion,1);
    assert.match(room.lastError||'',/isolation is unavailable/);assert.match(room.lastError||'',/explicitly retry/);
    assert.equal(builders,1,'no builder or repair dispatch after isolation preflight failure');assert.equal(interpreters,2,'only explicit caller submissions interpreted');
    assert.equal((await manager.submitChanges(room,'alice','two')).submissionId,command.submissionId);assert.equal(builders,1);assert.equal(interpreters,2);
  }finally{prior===undefined?delete process.env.COCREATE_ISOLATION_MODE:process.env.COCREATE_ISOLATION_MODE=prior;manager.shutdown();await provider.close();fs.rmSync(dir,{recursive:true,force:true})}
});
