import { createArtifactFixture } from '../tests/fixtures/artifact-storage.js';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';

process.env.NODE_ENV='production';
process.env.COCREATE_AUTH_MODE='local';
const { createCoCreateServer }=await import('../server/index.js');
const { createSession }=await import('../server/auth.js');
const output=path.resolve(process.env.COCREATE_RELIABILITY_OUTPUT || 'artifacts/reliability');fs.mkdirSync(output,{recursive:true});
const wait=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
const until=async(check:()=>Promise<boolean>,label:string)=>{for(let i=0;i<120;i++){if(await check())return;await wait(100);}throw new Error(`Timed out: ${label}`);};
let interpreterCalls=0,builderCalls=0;
const fake=http.createServer(async(req,res)=>{
  let raw='';for await(const chunk of req)raw+=chunk;const body=JSON.parse(raw),input=JSON.parse(body.input);let value:unknown;
  if(body.text.format.schema.required.includes('goals')){
    interpreterCalls++;const text=input.authenticatedChanges.map((change:any)=>change.after).join(' ');
    value={goals:[text],features:[],design:[],constraints:[],questions:[],additions:[],modifications:[],withdrawals:[],classification:'explicit_request',affectedRequirementIds:[],sourcePassages:[text],intents:[{text,category:'goal',classification:'explicit_request',rationale:'Direct request',sourcePassage:text,affectedRequirementIds:[]}]};
  }else{builderCalls++;await wait(100);value={operations:[{type:'write',path:'src/App.tsx',content:'export default function App(){return <main>Shared catalog</main>}'}],summary:'Shared catalog',decisions:[],conflicts:[],specification:{agreed:[],proposed:[],questions:[]}};}
  res.setHeader('content-type','application/json');res.end(JSON.stringify({output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}],status:'completed',usage:{input_tokens:100,output_tokens:50}}));
});
await new Promise<void>(resolve=>fake.listen(0,'127.0.0.1',resolve));
const providerAddress=fake.address();
if(!providerAddress||typeof providerAddress==='string')throw new Error('Controlled provider did not bind a TCP port.');
const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'reliability-browser-'));
let service=await createCoCreateServer({port:0,host:'127.0.0.1',serveClient:true,dataDir,sessionSecret:'browser-fixture',encryptionSecret:'browser-fixture',debounceMs:20,buildDebounceMs:80,buildCooldownMs:0,baseUrl:`http://127.0.0.1:${providerAddress.port}`});
let room=service.manager.create(`browser-${crypto.randomUUID()}`);
for(const [id,name] of [['alice','Alice'],['bob','Bob'],['cara','Cara']])service.manager.join(room,id,name);
const connection=(await service.manager.saveConnection(room,{name:'Controlled provider',provider:'custom',baseUrl:`http://127.0.0.1:${providerAddress.port}`,apiFormat:'responses',apiKey:'synthetic'})).id;
room.ai.connections![0].checks.builder={reachable:{status:'passed'},text:{status:'passed'},personal:{status:'passed'},builder:{status:'passed'}};
await service.manager.assignAI(room,{connectionId:connection,model:'builder'},{connectionId:connection,model:'builder'});
const {url:origin}=await service.start();
type Browser={evaluate:(expression:string)=>Promise<any>;call:(method:string,params?:object)=>Promise<any>;socket:WebSocket;process:ReturnType<typeof spawn>;profile:string};
const browsers:Browser[]=[];let serviceStopped=false;let artifactFixture:Awaited<ReturnType<typeof createArtifactFixture>>|undefined;
async function open(id:string,index:number){
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'reliability-chrome-')),port=9800+index+process.pid%200;
  const browser=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
  let target:any;await until(async()=>{try{target=await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'}).then(value=>value.json());return!!target.webSocketDebuggerUrl;}catch{return false;}},'Chrome startup');
  const socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise<void>((resolve,reject)=>{socket.addEventListener('open',()=>resolve(),{once:true});socket.addEventListener('error',reject,{once:true});});
  let sequence=0;const pending=new Map<number,{resolve:(value:any)=>void;reject:(error:Error)=>void}>();
  socket.addEventListener('message',event=>{const result=JSON.parse(String(event.data)),task=pending.get(result.id);if(task){pending.delete(result.id);result.error?task.reject(new Error(result.error.message)):task.resolve(result.result);}});
  const call=(method:string,params={})=>new Promise<any>((resolve,reject)=>{const id=++sequence,timer=setTimeout(()=>reject(new Error(`${method} timed out`)),15000);pending.set(id,{resolve:value=>{clearTimeout(timer);resolve(value);},reject:error=>{clearTimeout(timer);reject(error);}});socket.send(JSON.stringify({id,method,params}));});
  const evaluate=async(expression:string)=>{const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));return result.result.value;};
  const instance={call,evaluate,socket,process:browser,profile};browsers.push(instance);
  await call('Page.enable');await call('Network.enable');await call('Runtime.enable');
  await call('Page.addScriptToEvaluateOnNewDocument',{source:`window.__sockets=[];window.__ownerRetryDiagnoses=0;const NativeWebSocket=window.WebSocket;window.WebSocket=class extends NativeWebSocket{constructor(...args){if(window.__ownerRetryFixture){const url=new URL(args[0]);url.pathname='/fixture-unavailable-ws';args[0]=url.href}super(...args);window.__sockets.push(this)}};const nativeFetch=window.fetch.bind(window);window.fetch=(...args)=>{if(window.__ownerRetryFixture&&String(args[0]).includes('/state')){window.__ownerRetryDiagnoses++;return Promise.resolve(new Response('{}',{status:503,headers:{'Retry-After':'2'}}))}return nativeFetch(...args)};`});
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await call('Page.navigate',{url:origin});await wait(200);
  const token=createSession('browser-fixture',{roomId:room.id,participantId:id,name:id});await evaluate(`localStorage.setItem('cocreate-session-${room.id}',${JSON.stringify(token)})`);
  await call('Page.navigate',{url:`${origin}/r/${room.id}`});await until(()=>evaluate("!!document.querySelector('.document-editor') && !document.querySelector('.connection-banner')"),'workspace connection');return instance;
}
const write=async(browser:Browser,text:string)=>{await browser.evaluate("document.querySelector('.document-editor').focus()");await browser.call('Input.insertText',{text});};
const submit=async(browser:Browser)=>browser.evaluate("[...document.querySelectorAll('button')].find(button=>button.textContent==='Build my changes').click()");
const snapshot=async(browser:Browser,name:string)=>{const result=await browser.call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(output,name),Buffer.from(result.data,'base64'));};
try{
  const a=await open('alice',0),b=await open('bob',1),c=await open('cara',2);
  await write(a,'Build catalog. ');await until(()=>b.evaluate("document.querySelector('.document-editor').textContent.includes('Build catalog')"),'peer edit');
  await write(b,'Add favorites. ');await until(()=>a.evaluate("document.querySelector('.document-editor').textContent.includes('Add favorites')"),'peer edit');
  await write(c,'Add filters. ');await until(()=>a.evaluate("document.querySelector('.document-editor').textContent.includes('Add filters')"),'third edit');
  assert.equal(interpreterCalls,0,'typing must not call providers');await Promise.all([submit(a),submit(b)]);
  await until(async()=>room.versions.length===1&&!room.buildTask,'first shared artifact');assert.equal(interpreterCalls,2);assert.equal(builderCalls,1);assert.equal(room.pending.get('cara')?.length,1);
  const callCount=interpreterCalls;await c.call('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});await c.evaluate('window.__sockets.forEach(socket=>socket.close())');await write(c,'Offline sorting. ');
  await c.call('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await until(()=>c.evaluate("!document.querySelector('.connection-banner')"),'reconnect');await until(()=>a.evaluate("document.querySelector('.document-editor').textContent.includes('Offline sorting')"),'offline edit restored');assert.equal(interpreterCalls,callCount);
  await c.call('Page.reload');await until(()=>c.evaluate("!!document.querySelector('.document-editor') && !document.querySelector('.connection-banner') && document.querySelector('.document-editor').textContent.includes('Offline sorting')"),'reload recovered draft');
  assert.equal(interpreterCalls,callCount,'reload must not infer');assert.equal(room.pending.get('cara')?.length,2,'reload retains the caller draft');await submit(c);
  await until(async()=>room.versions.length===2&&!room.buildTask,'third submission');assert.equal(interpreterCalls,3);assert.equal(builderCalls,2);assert.match(room.sharedRequirements.find(item=>item.description.includes('sorting'))?.description||'',/Add filters\./);
  const previewRun=room.aiRuns.at(-1)!;assert.equal(previewRun.verification.verified,false);assert.equal(previewRun.verification.compilationPassed,true);
  const acceptedAt=service.manager.eventStore.eventsForWorkspace(room.id).filter(event=>event.eventType==='requirement.registry_reconciled').at(-1)!.occurredAt;
  const previewToken=createSession('browser-fixture',{roomId:room.id,participantId:'alice',name:'alice'});
  await a.call('Page.navigate',{url:`${origin}/preview/${room.id}/${room.versions.length}?token=${encodeURIComponent(previewToken)}`});await until(()=>a.evaluate("document.body.innerText.includes('Shared catalog')"),'rendered controlled product');
  const acceptedToRenderedPreviewMs=Date.now()-Date.parse(acceptedAt);
  const filterControls=await a.evaluate("document.querySelectorAll('input,select').length");assert.equal(filterControls,0,'controlled product deliberately omits the accepted filter');
  await a.call('Page.navigate',{url:`${origin}/r/${room.id}`});await until(()=>a.evaluate("!!document.querySelector('.document-editor') && !document.querySelector('.connection-banner')"),'return from preview');
  const states=await Promise.all(browsers.map(browser=>browser.evaluate(`fetch('/api/rooms/${room.id}/state',{headers:{Authorization:'Bearer '+localStorage.getItem('cocreate-session-${room.id}')}}).then(response=>response.json()).then(state=>({revision:state.specificationRevision,artifact:state.latestVersion,usage:state.physicalUsage,accepted:state.requirements.filter(item=>item.status==='accepted').map(item=>item.id).sort()}))`)));
  assert.deepEqual(states[0],states[1]);assert.deepEqual(states[1],states[2]);
  await a.evaluate("{const select=document.querySelector('.intent-revision-selector select');select.value='2';select.dispatchEvent(new Event('change',{bubbles:true}))}");await wait(100);assert.equal(await a.evaluate("document.querySelectorAll('.accepted-requirements-card li').length"),2);assert.ok(!await a.evaluate("document.querySelector('.accepted-requirements-card').innerText.includes('Offline sorting')"));await a.evaluate("{const select=document.querySelector('.intent-revision-selector select');select.value='latest';select.dispatchEvent(new Event('change',{bubbles:true}))}");await wait(100);
  await snapshot(a,'desktop.png');await a.evaluate("[...document.querySelectorAll('button')].find(button=>button.textContent.includes('View requirements')).click()");assert.ok(await a.evaluate("document.querySelector('.context-drawer').innerText.includes('Build catalog')"));await a.evaluate("document.querySelector('[aria-label=\"Close intent details\"]').click()");
  await a.evaluate("[...document.querySelectorAll('button')].find(button=>button.textContent.includes('View usage')).click()");await until(()=>a.evaluate("!!document.querySelector('#workflow-usage')"),'usage action');await snapshot(a,'workflow.png');
  await a.evaluate("[...document.querySelectorAll('.tabs button')].find(button=>button.textContent==='Canvas').click()");await wait(100);
  const responsive=[];for(const width of [1440,1024,768,390]){await a.call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});await wait(150);const layout=await a.evaluate('({width:document.documentElement.scrollWidth,viewport:innerWidth,card:!!document.querySelector(".project-token-card"),selector:!!document.querySelector(".intent-revision-selector select")})');assert.ok(layout.width<=width,`Overflow at ${width}: ${JSON.stringify(layout)}`);assert.ok(layout.card&&layout.selector);responsive.push({width,...layout});if(width===390){await a.evaluate("document.querySelector('.agent-panel').scrollIntoView()");await snapshot(a,'mobile.png');await a.evaluate("[...document.querySelectorAll('button')].find(button=>button.textContent.includes('View requirements')).click()");assert.ok(await a.evaluate("!!document.querySelector('dialog.intent-review[open]')"));await a.evaluate("document.querySelector('[aria-label=\"Close intent details\"]').click()");}}
  let artifactRestoration:Record<string,unknown>|undefined;
  if(process.env.COCREATE_ARTIFACT_BROWSER_RESTORE==='true'){
    const beforeCalls={interpreterCalls,builderCalls};
    room.recoveryCheckpoint={fingerprint:'controlled-restoration',revision:room.specificationRevision,files:room.versions.at(-1)!.files!,task:'Retained candidate',index:1,total:2};
    await service.manager.save(room);await room.persistQueue;
    artifactFixture=await createArtifactFixture();const platform=artifactFixture.platform();await platform.claimCoordinator(room.id);
    const localState=service.manager.eventStore.readWorkspaceSnapshot<any>(room.id);
    await platform.saveSnapshot(room.id,room.persistRevision,{...localState,harnessProjection:service.manager.eventStore.exportHarness(room.id),artifactBodies:service.manager.eventStore.artifactBodiesForWorkspace(room.id,[...room.versions.map(version=>version.artifactRef!),room.recoveryCheckpoint.artifactRef!])});
    await service.stop();serviceStopped=true;
    const replacementDir=fs.mkdtempSync(path.join(os.tmpdir(),'reliability-replacement-'));
    service=await createCoCreateServer({port:Number(new URL(origin).port),host:'127.0.0.1',serveClient:true,dataDir:replacementDir,sessionSecret:'browser-fixture',encryptionSecret:'browser-fixture',debounceMs:20,buildDebounceMs:80,buildCooldownMs:0,baseUrl:`http://127.0.0.1:${providerAddress.port}`});serviceStopped=false;
    assert.equal(service.manager.eventStore.hasWorkspace(room.id),false);
    room=service.manager.hydrate(room.id,await platform.loadSnapshot(room.id));await service.start();
    assert.equal(room.recoveryCheckpoint?.fingerprint,'controlled-restoration');assert.ok(service.manager.eventStore.readArtifact(room.recoveryCheckpoint!.artifactRef!));
    await Promise.all(browsers.map(browser=>browser.call('Page.reload')));
    for(const browser of browsers)await until(()=>browser.evaluate("!!document.querySelector('.document-editor') && !document.querySelector('.connection-banner')"),'restored workspace reconnect');
    const restoredStates=await Promise.all(browsers.map(browser=>browser.evaluate(`fetch('/api/rooms/${room.id}/state',{headers:{Authorization:'Bearer '+localStorage.getItem('cocreate-session-${room.id}')}}).then(response=>response.json()).then(state=>({revision:state.specificationRevision,artifact:state.latestVersion,accepted:state.requirements.filter(item=>item.status==='accepted').map(item=>item.id).sort()}))`)));
    for(const state of restoredStates){assert.equal(state.revision,states[0].revision);assert.equal(state.artifact,states[0].artifact);assert.deepEqual(state.accepted,states[0].accepted)}
    const downloaded=await a.evaluate(`fetch('/api/rooms/${room.id}/download/1',{headers:{Authorization:'Bearer '+localStorage.getItem('cocreate-session-${room.id}')}}).then(async response=>({status:response.status,bytes:Array.from(new Uint8Array(await response.arrayBuffer()).slice(0,2))}))`);assert.equal(downloaded.status,200);assert.deepEqual(downloaded.bytes,[80,75]);
    await a.call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
    await a.call('Page.navigate',{url:`${origin}/preview/${room.id}/2?token=${encodeURIComponent(previewToken)}`});await until(()=>a.evaluate("document.body.innerText.includes('Shared catalog')"),'restored rendered product');await snapshot(a,'restored-product.png');
    await a.call('Page.navigate',{url:`${origin}/r/${room.id}`});await until(()=>a.evaluate("!!document.querySelector('.document-editor') && !document.querySelector('.connection-banner')"),'restored workspace');await snapshot(a,'restored-workspace.png');
    assert.deepEqual({interpreterCalls,builderCalls},beforeCalls);
    artifactRestoration={scope:'Three local signed Chrome profiles after empty server-cache replacement; canonical snapshot/private bodies through real SDK over controlled Storage/PostgREST, not hosted accounts or real SQL',currentVersion:2,revision:3,checkpointRestored:true,zipRestored:true,previewRendered:true,clientsConverged:true,extraInterpreterCalls:0,extraBuilderCalls:0};
  }
  let ownerRetry:Record<string,unknown>|undefined;
  if(process.env.COCREATE_COORDINATOR_BROWSER_RETRY==='true'){
    // Controlled browser transport failure; hosted authorization/SQL are separate fixtures.
    const beforeCalls={interpreterCalls,builderCalls};
    await a.call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
    await a.evaluate('window.__ownerRetryFixture=true;window.__sockets.forEach(socket=>socket.close())');
    await until(()=>a.evaluate("document.querySelector('.connection-banner')?.textContent.includes('Waiting for the workflow owner')"),'owner retry banner');
    await write(a,'Retained during owner outage. ');await snapshot(a,'owner-reconnecting.png');
    let terminal=false;for(let attempt=0;attempt<100;attempt++){terminal=await a.evaluate("!!document.querySelector('.connection-banner.terminal')");if(terminal)break;await wait(500)}
    assert.ok(terminal,'owner retry reaches its terminal bound');
    const message=await a.evaluate("document.querySelector('.connection-banner').textContent");assert.match(message,/workflow owner.*Reopen/);
    assert.ok(await a.evaluate("document.querySelector('.document-editor').textContent.includes('Retained during owner outage')"));
    assert.deepEqual({interpreterCalls,builderCalls},beforeCalls);await snapshot(a,'owner-unavailable.png');
    ownerRetry={scope:'Chrome with controlled WebSocket failure and HTTP 503 diagnosis; no hosted account or SQL',terminal,diagnoses:await a.evaluate('window.__ownerRetryDiagnoses'),retainedDraft:true,extraInterpreterCalls:interpreterCalls-beforeCalls.interpreterCalls,extraBuilderCalls:builderCalls-beforeCalls.builderCalls};
  }
  const report={scope:'Three independent Chrome profiles and signed local participant sessions; local-auth browser bundle, controlled provider, no hosted account or paid inference',participants:3,ownerRetry,artifactRestoration,simultaneousSubmissions:true,selectedRevisionVerified:true,offlineEditsRecovered:true,reloadDraftRecovered:true,noInferenceOnReconnect:true,noInferenceOnReload:true,converged:states[0],interpreterCalls,builderCalls,responsive,acceptedToRenderedPreviewMs,previewTimingScope:'Last durable acceptance to DOM observation after explicit preview navigation; includes server/build, polling, navigation and render overhead, not paint timing or production latency',compilingIncorrectCandidatePromoted:true,functionalVerified:previewRun.verification.verified,filterControls,referenceComparison:'Not performed in this baseline; supplied reference is available and comparison remains pending'};
  fs.writeFileSync(path.join(output,'browser-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{
  for(const browser of browsers){browser.socket.close();browser.process.kill();}
  if(!serviceStopped)await service.stop();await artifactFixture?.close();await new Promise<void>(resolve=>fake.close(()=>resolve()));
}
