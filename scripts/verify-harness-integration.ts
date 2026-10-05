import { createArtifactFixture } from '../tests/fixtures/artifact-storage.js';
import { EventStore } from '../server/event-store.js';
import { DatabaseSync } from 'node:sqlite';
import { browserExecutable } from '../server/isolation/browser.js';
import { verifiedList } from '../tests/fixtures/verified-list.js';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'production';
process.env.COCREATE_AUTH_MODE = 'local';
const { createCoCreateServer } = await import('../server/index.js');
const { createSession } = await import('../server/auth.js');
const output = path.resolve(process.env.COCREATE_INTEGRATION_OUTPUT || 'artifacts/multiuser-step10/browser');
fs.mkdirSync(output, { recursive: true });
const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
async function until(check: () => Promise<boolean>, label: string) {
  for (let i = 0; i < 150; i++) { if (await check()) return; await wait(100); }
  throw new Error(`Progress browser timed out: ${label}`);
}
let interpreterCalls = 0, broken = false;
const gates = new Map<number, () => void>();
const candidates: Array<{revision:number;requirements:number}> = [];
const fake = http.createServer(async (request, response) => {
  let raw = ''; for await (const chunk of request) raw += chunk;
  const body = JSON.parse(raw), input = JSON.parse(body.input);
  let value: unknown;
  if (body.text.format.schema.required.includes('goals')) {
    interpreterCalls++;
    const text = input.authenticatedChanges.map((change:{after:string})=>change.after).join(' ');
    value = {goals:[text],features:[],design:[],constraints:[],questions:[],additions:[],modifications:[],withdrawals:[],classification:'explicit_request',affectedRequirementIds:[],sourcePassages:[text],
      intents:[{text,category:'goal',classification:'explicit_request',rationale:'Controlled direct request',sourcePassage:text,affectedRequirementIds:[]}]};
  } else {
    candidates.push({revision:room.specificationRevision,requirements:input.acceptedRequirements.length});
    await new Promise<void>(resolve=>gates.set(candidates.length,resolve));
    value = {operations:[{type:'write',path:'src/App.tsx',content:broken?verifiedList.replace('setQuery(e.target.value)','void e'):verifiedList}],summary:'Controlled progress sample',decisions:[],conflicts:[],specification:{agreed:[],proposed:[],questions:[]}};
  }
  if (!response.destroyed) {
    response.setHeader('content-type','application/json');
    response.end(JSON.stringify({output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}],status:'completed',usage:{input_tokens:100,output_tokens:50}}));
  }
});
await new Promise<void>(resolve=>fake.listen(0,'127.0.0.1',resolve));
const address = fake.address(); assert.ok(address && typeof address !== 'string');
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(),'step10-browser-'));
let service = await createCoCreateServer({port:0,host:'127.0.0.1',serveClient:true,dataDir,sessionSecret:'step10-browser',encryptionSecret:'step10-browser',debounceMs:20,buildDebounceMs:500,buildCooldownMs:0,buildMaxWaitMs:2_000,baseUrl:`http://127.0.0.1:${address.port}`});
let room = service.manager.create(`progress-${crypto.randomUUID()}`);
for (const [id,name] of [['alice','Alice'],['bob','Bob'],['cara','Cara']]) service.manager.join(room,id,name);
const connection = await service.manager.saveConnection(room,{name:'Controlled provider',provider:'custom',baseUrl:`http://127.0.0.1:${address.port}`,apiFormat:'responses',apiKey:'synthetic'});
room.ai.connections![0].checks.fixture={reachable:{status:'passed'},text:{status:'passed'},personal:{status:'passed'},builder:{status:'passed'}};
await service.manager.assignAI(room,{connectionId:connection.id,model:'fixture'},{connectionId:connection.id,model:'fixture'});
const {url:origin} = await service.start();
const execute=service.manager.tools.execute.bind(service.manager.tools);
service.manager.tools.execute=(async(name:any,input:any,context:any)=>{try{return await execute(name,input,context);}catch(error){console.error(JSON.stringify({phase:'fixture-tool-error',tool:name,code:(error as any).code,cause:(error as any).cause}));throw error;}}) as typeof service.manager.tools.execute;
type Browser = {call:(method:string,params?:object)=>Promise<any>;evaluate:(code:string)=>Promise<any>;socket:WebSocket;process:ReturnType<typeof spawn>;profile:string};
const browsers: Browser[] = [];
const session = (id:string) => createSession('step10-browser',{roomId:room.id,participantId:id,name:id,role:id==='alice'?'owner':'editor'});

async function open(id:string,index:number): Promise<Browser> {
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'step10-chrome-')),port=9900+index+process.pid%200;
  const processHandle=spawn(browserExecutable(),['--single-process','--no-sandbox','--no-zygote','--headless=new','--disk-cache-size=1','--media-cache-size=1','--disable-component-update','--disable-background-networking','--disable-sync','--disable-gpu','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore',windowsHide:true});
  let target:any;
  await until(async()=>{try{target=await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'}).then(value=>value.json());return!!target.webSocketDebuggerUrl;}catch{return false;}},'Chrome startup');
  const socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise<void>((resolve,reject)=>{socket.addEventListener('open',()=>resolve(),{once:true});socket.addEventListener('error',reject,{once:true});});
  let sequence=0;
  const pending=new Map<number,{resolve:(value:any)=>void;reject:(error:Error)=>void}>();
  socket.addEventListener('message',event=>{
    const result=JSON.parse(String(event.data)),task=pending.get(result.id);
    if(task){pending.delete(result.id);result.error?task.reject(new Error(result.error.message)):task.resolve(result.result);}
  });
  const call=(method:string,params={})=>new Promise<any>((resolve,reject)=>{
    const id=++sequence,timer=setTimeout(()=>{pending.delete(id);reject(new Error(`${method} timed out`));},15_000);
    pending.set(id,{resolve:value=>{clearTimeout(timer);resolve(value);},reject:error=>{clearTimeout(timer);reject(error);}});
    socket.send(JSON.stringify({id,method,params}));
  });
  const evaluate=async(code:string)=>{
    const result=await call('Runtime.evaluate',{expression:code,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const browser={call,evaluate,socket,process:processHandle,profile}; browsers.push(browser);
  await call('Page.enable'); await call('Runtime.enable'); await call('Network.enable');
  await call('Page.addScriptToEvaluateOnNewDocument',{source:"window.__sockets=[];const NativeWebSocket=window.WebSocket;window.WebSocket=class extends NativeWebSocket{constructor(...args){super(...args);window.__sockets.push(this)}};window.__progressRequests=[];const nativeFetch=window.fetch.bind(window);window.fetch=(...args)=>{if(String(args[0]).endsWith('/submit'))window.__progressRequests.push(JSON.parse(args[1].body));return nativeFetch(...args)}"});
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:origin}); await wait(200);
  await evaluate(`localStorage.setItem('cocreate-session-${room.id}',${JSON.stringify(session(id))})`);
  await call('Page.navigate',{url:`${origin}/r/${room.id}`});
  await until(()=>evaluate("!!document.querySelector('.document-editor')&&!document.querySelector('.connection-banner')"),'workspace connection');
  return browser;
}
async function submit(browser:Browser,text:string) {
  await browser.evaluate("document.querySelector('.document-editor').focus()");
  await browser.call('Input.insertText',{text});
  await browser.evaluate("[...document.querySelectorAll('button')].find(button=>button.textContent==='Build my changes').click()");
}
const progress = (browser:Browser) => browser.evaluate("document.querySelector('.build-progress')?.innerText||''");
async function converge(expected:string) {
  await until(async()=>{const labels=await Promise.all(browsers.map(progress));return labels.every(label=>label.includes(expected))&&new Set(labels).size===1;},`converged ${expected}`);
}
async function screenshot(browser:Browser,name:string) {
  const image=await browser.call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  fs.writeFileSync(path.join(output,name),Buffer.from(image.data,'base64'));
}
const request = async (id:string, route:string, body:unknown) => {
  const response = await fetch(`${origin}/api/rooms/${room.id}/${route}`, {method:'POST', headers:{authorization:`Bearer ${session(id)}`,'content-type':'application/json'}, body:JSON.stringify(body)});
  return {status:response.status, body:await response.json()};
};
const connected = (browser:Browser) => browser.evaluate("!!document.querySelector('.document-editor')&&!document.querySelector('.connection-banner')");
const states = () => Promise.all(browsers.map(browser => browser.evaluate(`fetch('/api/rooms/${room.id}/state',{headers:{Authorization:'Bearer '+localStorage.getItem('cocreate-session-${room.id}')}}).then(response=>response.json()).then(state=>({revision:state.specificationRevision,artifact:state.latestVersion,usage:state.physicalUsage,budget:state.workflowBudget,accepted:state.requirements.filter(item=>item.status==='accepted').map(item=>item.id).sort()}))`)));
const checkpoints: Array<Record<string,unknown>> = [];
const replacementDirs:string[]=[];
let artifactFixture:Awaited<ReturnType<typeof createArtifactFixture>>|undefined;
try {
  const a=await open('alice',0), b=await open('bob',1), c=await open('cara',2);
  const write = async (browser:Browser,text:string) => {
    await browser.evaluate("document.querySelector('.document-editor').focus()");
    await browser.call('Input.insertText',{text});
    await until(()=>a.evaluate(`document.querySelector('.document-editor').innerText.includes(${JSON.stringify(text)})`),'edit synchronization');
  };
  const clickSubmit = (browser:Browser) => browser.evaluate("[...document.querySelectorAll('button')].find(button=>button.textContent==='Build my changes').click()");
  await write(a,'Build a catalog with a working filter');
  await write(b,'Add favorites');
  await write(c,'Draft a catalog export');
  assert.equal(interpreterCalls,0);
  await Promise.all([clickSubmit(a),clickSubmit(b)]);
  await until(async()=>gates.has(1),'concurrent candidate');
  assert.equal(interpreterCalls,2);assert.equal(room.pending.get('cara')?.length,1);
  assert.deepEqual(new Set(room.sharedRequirements.flatMap(item=>item.sources.map(source=>source.participantId))),new Set(['alice','bob']));
  gates.get(1)!();await until(async()=>room.versions.length===1&&!room.buildTask,'verified baseline');
  await converge('Available v1');assert.equal(room.aiRuns.at(-1)!.verification.verified,true);
  let prior=structuredClone(room.versions[0]);
  checkpoints.push({phase:'concurrent',revision:room.specificationRevision,version:prior.id,physicalCalls:service.manager.view(room).physicalUsage.recorded.requests});

  // Keep two future captures behind a fixed candidate, then block a later regression.
  await submit(a,'Add sorting');await until(async()=>gates.has(2),'held candidate');
  const frozen=candidates[1].revision, callsAtHold=interpreterCalls;
  await submit(b,'Add a clear title');
  await submit(c,'Add an export label');
  await until(async()=>room.submissions.filter(item=>item.status==='submitted').length===2,'two deferred captures');
  assert.equal(interpreterCalls,callsAtHold);assert.equal(room.specificationRevision,frozen);
  gates.get(2)!();await until(async()=>gates.has(3),'next captured candidate');
  assert.equal(room.versions.length,2);assert.deepEqual(room.versions[0],prior);
  prior=structuredClone(room.versions[1]);
  assert.equal(interpreterCalls,5);assert.equal(candidates[2].revision,5);
  broken=true;gates.get(3)!();await until(async()=>room.status==='Error'&&!room.buildTask,'failed behavior settled');
  assert.equal(room.versions.length,2);assert.deepEqual(room.versions.at(-1),prior);await converge('Available v2');
  await until(async()=>{const values=await Promise.all(browsers.map(browser=>browser.evaluate("document.querySelector('.verification-summary')?.textContent||''")));return values.every(value=>value.includes('Update blocked'))&&new Set(values).size===1;},'failed evidence convergence');
  assert.match(room.lastError||'',/Required behavior verification failed/);
  assert.equal(candidates.length,3,'no automatic functional repairs');
  await screenshot(a,'blocked-desktop.png');
  checkpoints.push({phase:'continuous-and-failed',buildingRevision:frozen,revision:room.specificationRevision,version:room.versions.at(-1)!.id,interpreterCalls,builderCalls:candidates.length});

  const beforeCorrection=interpreterCalls+candidates.length;
  const target=room.sharedRequirements.find(item=>item.description==='Build a catalog with a working filter')!;
  const correction={requestId:'step10-correct-filter',specificationRevision:room.specificationRevision,target:{kind:'requirement',id:target.id,revision:target.revision},action:'correct',text:'Create a catalog with a functional search',category:'goal',classification:'explicit_request'};
  const corrected=await request('alice','intent-commands',correction);
  assert.equal(corrected.status,200,JSON.stringify(corrected.body));assert.equal(room.specificationRevision,6);
  assert.equal((await request('alice','intent-commands',correction)).status,200);
  assert.equal(interpreterCalls+candidates.length,beforeCorrection);
  assert.equal((await request('bob','intent-commands',{...correction,requestId:'step10-foreign-correction',specificationRevision:6,target:{...correction.target,revision:room.sharedRequirements.find(item=>item.id===target.id)!.revision}})).status,403);
  await until(async()=>{const values=await states();return values.every(value=>value.revision===6)&&new Set(values.map(value=>JSON.stringify(value))).size===1;},'corrected baseline convergence');
  // A separate explicit build authorizes spending; correction alone did not.
  broken=false;assert.equal((await request('alice','intent-build',{requestId:'step10-build-corrected'})).status,200);
  await until(async()=>gates.has(4),'explicit corrected build');gates.get(4)!();
  await until(async()=>room.versions.length===3&&!room.buildTask,'corrected product');
  assert.equal(interpreterCalls,5);assert.equal(candidates.length,4);
  assert.equal(room.versions.at(-1)!.specificationRevision,6);
  assert.equal(room.aiRuns.at(-1)!.verification.evidence?.status,'unverified');
  assert.ok(room.aiRuns.at(-1)!.verification.evidence?.checks.every(check=>check.passed));
  assert.deepEqual(new Set(room.aiRuns.at(-1)!.verification.evidence!.checks.map(check=>check.kind)),new Set(['filter','favorites','sort']));
  await converge('Available v3');

  const beforeReconnect=interpreterCalls+candidates.length;
  await c.call('Network.enable');
  await c.call('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
  await c.evaluate('window.__sockets.forEach(socket=>socket.close())');
  await c.evaluate("document.querySelector('.document-editor').focus()");await c.call('Input.insertText',{text:'Offline draft remains unsubmitted'});
  await c.call('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await until(()=>connected(c),'offline reconnect');
  await until(()=>a.evaluate("document.querySelector('.document-editor').innerText.includes('Offline draft remains unsubmitted')"),'restored draft');
  await c.call('Page.reload');await until(()=>connected(c),'client reload');
  assert.ok(await c.evaluate("document.querySelector('.document-editor').innerText.includes('Offline draft remains unsubmitted')"));
  assert.equal(interpreterCalls+candidates.length,beforeReconnect);
  const replay=await b.evaluate('window.__progressRequests[0]');assert.equal((await request('bob','submit',replay)).status,200);
  assert.equal(interpreterCalls+candidates.length,beforeReconnect);
  const denied=await fetch(`${origin}/api/rooms/${room.id}/submit`,{method:'POST',headers:{authorization:`Bearer ${createSession('step10-browser',{roomId:room.id,participantId:'cara',name:'cara',role:'viewer'})}`,'content-type':'application/json'},body:JSON.stringify({requestId:'step10-viewer-denied'})});assert.equal(denied.status,403);
  const beforeRestore=await states();assert.deepEqual(beforeRestore[0],beforeRestore[1]);assert.deepEqual(beforeRestore[1],beforeRestore[2]);
  assert.equal(beforeRestore[0].usage.recorded.requests,9);assert.equal(beforeRestore[0].usage.generation.requests,9);
  assert.equal(beforeRestore[0].usage.recorded.inputTokens+beforeRestore[0].usage.recorded.outputTokens,1350);
  checkpoints.push({phase:'corrected-reconnected',...beforeRestore[0],extraInference:0});

  // Real SDK with controlled private Storage/PostgREST. No real SQL/RLS claim.
  room.recoveryCheckpoint={fingerprint:'step10-restoration',revision:room.specificationRevision,files:room.versions.at(-1)!.files!,task:'Retained source',index:1,total:2};
  await service.manager.save(room);await room.persistQueue;
  const leaseReader=new DatabaseSync(service.manager.eventStore.file,{readOnly:true});
  let previousLease:{owner_id:string;epoch:number};
  try{previousLease=leaseReader.prepare('SELECT owner_id,epoch FROM coordinator_leases WHERE workspace_id=?').get(room.id) as typeof previousLease;}finally{leaseReader.close();}
  const roomId=room.id;
  await service.stop();
  service=await createCoCreateServer({port:Number(new URL(origin).port),host:'127.0.0.1',serveClient:true,dataDir,sessionSecret:'step10-browser',encryptionSecret:'step10-browser',debounceMs:20,buildDebounceMs:500,buildCooldownMs:0,buildMaxWaitMs:2_000,baseUrl:`http://127.0.0.1:${address.port}`});
  room=service.manager.get(roomId)!;assert.ok(room);await service.start();
  assert.ok(room.coordinatorEpoch>previousLease.epoch);
  const stale=new EventStore(dataDir);
  try{assert.throws(()=>stale.renewCoordinator(room.id,previousLease.owner_id,previousLease.epoch),/ownership expired or changed/);}finally{stale.close();}
  await Promise.all(browsers.map(browser=>browser.call('Page.reload')));
  for(const browser of browsers)await until(()=>connected(browser),'same-store coordinator takeover');
  for(const state of await states())assert.deepEqual(state,beforeRestore[0]);
  assert.equal(interpreterCalls+candidates.length,beforeReconnect);
  checkpoints.push({phase:'sqlite-takeover',fromEpoch:previousLease.epoch,toEpoch:room.coordinatorEpoch,clientsConverged:true,staleRenewalDenied:true,extraInference:0});
  artifactFixture=await createArtifactFixture();const platform=artifactFixture.platform();await platform.claimCoordinator(room.id);
  const localState=service.manager.eventStore.readWorkspaceSnapshot<any>(room.id);
  await platform.saveSnapshot(room.id,room.persistRevision,{...localState,harnessProjection:service.manager.eventStore.exportHarness(room.id),artifactBodies:service.manager.eventStore.artifactBodiesForWorkspace(room.id,[...room.versions.map(version=>version.artifactRef!),room.recoveryCheckpoint!.artifactRef!])});
  const oldEpoch=room.coordinatorEpoch;
  const competing=new EventStore(dataDir);
  try{assert.throws(()=>competing.claimCoordinator(room.id,'step10-competitor'),/Another coordinator/);}finally{competing.close();}
  await service.stop();
  const replacementDir=fs.mkdtempSync(path.join(os.tmpdir(),'step10-replacement-'));replacementDirs.push(replacementDir);
  service=await createCoCreateServer({port:Number(new URL(origin).port),host:'127.0.0.1',serveClient:true,dataDir:replacementDir,sessionSecret:'step10-browser',encryptionSecret:'step10-browser',debounceMs:20,buildDebounceMs:500,buildCooldownMs:0,buildMaxWaitMs:2_000,baseUrl:`http://127.0.0.1:${address.port}`});
  assert.equal(service.manager.eventStore.hasWorkspace(room.id),false);
  room=service.manager.hydrate(room.id,await platform.loadSnapshot(room.id));await service.start();
  assert.equal(room.recoveryCheckpoint?.fingerprint,'step10-restoration');
  assert.ok(service.manager.eventStore.readArtifact(room.recoveryCheckpoint!.artifactRef!));
  await Promise.all(browsers.map(browser=>browser.call('Page.reload')));
  for(const browser of browsers)await until(()=>connected(browser),'replacement reconnect');
  const restored=await states();for(const state of restored)assert.deepEqual(state,beforeRestore[0]);
  const downloaded=await a.evaluate(`fetch('/api/rooms/${room.id}/download/1',{headers:{Authorization:'Bearer '+localStorage.getItem('cocreate-session-${room.id}')}}).then(async response=>({status:response.status,bytes:Array.from(new Uint8Array(await response.arrayBuffer()).slice(0,2))}))`);
  assert.equal(downloaded.status,200);assert.deepEqual(downloaded.bytes,[80,75]);
  assert.equal((await request('alice','intent-commands',correction)).status,200);
  assert.equal((await request('bob','submit',replay)).status,200);
  assert.equal(interpreterCalls+candidates.length,beforeReconnect);
  await a.evaluate("[...document.querySelectorAll('button')].find(button=>button.textContent==='Artifacts').click()");
  await until(()=>a.evaluate("document.querySelector('iframe')?.src.includes('/preview/')||false"),'restored preview');
  const frames=await a.call('Page.getFrameTree');const frame=frames.frameTree.childFrames.find((value:any)=>value.frame.url.includes('/preview/')).frame.id;
  const world=await a.call('Page.createIsolatedWorld',{frameId:frame,worldName:'step10-restored-product'});
  await until(async()=>{const result=await a.call('Runtime.evaluate',{contextId:world.executionContextId,expression:"document.querySelectorAll('#root li').length",returnByValue:true});return result.result.value===3;},'restored product rendered');
  await screenshot(a,'restored-product.png');
  await a.evaluate("[...document.querySelectorAll('.tabs button')].find(button=>button.textContent==='Canvas').click()");
  for(const width of [1440,390]){await a.call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});await wait(100);assert.ok(await a.evaluate('document.documentElement.scrollWidth<=innerWidth'));await screenshot(a,width===390?'mobile.png':'desktop.png');}
  const report={scope:'Three independent signed local owner/editor/editor headless profiles, real SQLite and Windows isolated compiler/browser, loopback provider and SDK-backed controlled Storage/PostgREST. No hosted identity/SQL/RLS/live billing/deployment.',participants:3,checkpoints,candidates,interpreterCalls,builderCalls:candidates.length,physicalCalls:restored[0].usage.recorded.requests,reportedTokens:restored[0].usage.recorded.inputTokens+restored[0].usage.recorded.outputTokens,concurrentCallerOnly:true,deferredCapturesBehindFixedCandidate:true,failedChecksRetainArtifact:true,noAutomaticFunctionalRepair:true,inferenceFreeCorrectionReplayReconnectReload:true,foreignCorrectionDenied:true,viewerSubmitDenied:true,clientStateAndUsageConverged:true,activeLocalCompetitorDenied:true,cacheReplacement:{oldEpoch,scope:'Stopped coordinator, empty derived cache, new instance; competing stale epochs covered separately by focused tests',checkpoint:true,archivedZip:true,renderedPreview:true,receiptReplay:true,extraInference:0},coveredChecksPassUnknownCriteriaUnverified:true,responsiveWidths:[1440,390],referenceComparison:'pending'};
  fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
} catch(error) {
  const failure={phase:'browser-failure',checkpoints,status:room.status,error:room.lastError,acceptedRevision:room.specificationRevision,versions:room.versions.map(item=>({id:item.id,revision:item.specificationRevision})),interpreterCalls,builderCalls:candidates.length,runs:room.aiRuns.map(item=>({outcome:item.outcome,verification:item.verification}))};
  fs.writeFileSync(path.join(output,'failure.json'),JSON.stringify(failure,null,2));console.error(JSON.stringify(failure));throw error;
} finally {
  for(const release of gates.values())release();
  for(const browser of browsers)await browser.call('Page.navigate',{url:'about:blank'}).catch(()=>{});
  for(const browser of browsers){browser.socket.close();browser.process.kill();}
  await service.stop();await artifactFixture?.close();fake.closeAllConnections();await new Promise<void>(resolve=>fake.close(()=>resolve()));await wait(500);
  for(const dir of [...browsers.map(browser=>browser.profile),dataDir,...replacementDirs]){
    if(path.dirname(path.resolve(dir))!==path.resolve(os.tmpdir())||!/^step10-(chrome|browser|replacement)-[A-Za-z0-9]+$/.test(path.basename(dir)))throw new Error('Unsafe Step 10 temporary cleanup');
    fs.rmSync(dir,{recursive:true,force:true,maxRetries:6,retryDelay:200});
  }
}
