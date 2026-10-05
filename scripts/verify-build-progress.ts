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
const output = path.resolve('artifacts/multiuser-step06/browser');
fs.mkdirSync(output, { recursive: true });
const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
async function until(check: () => Promise<boolean>, label: string) {
  for (let i = 0; i < 150; i++) { if (await check()) return; await wait(100); }
  throw new Error(`Progress browser timed out: ${label}`);
}
let interpreterCalls = 0;
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
    value = {operations:[{type:'write',path:'src/App.tsx',content:'export default function App(){return <main>Shared progress fixture</main>}'}],summary:'Controlled progress sample',decisions:[],conflicts:[],specification:{agreed:[],proposed:[],questions:[]}};
  }
  if (!response.destroyed) {
    response.setHeader('content-type','application/json');
    response.end(JSON.stringify({output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}],status:'completed',usage:{input_tokens:100,output_tokens:50}}));
  }
});
await new Promise<void>(resolve=>fake.listen(0,'127.0.0.1',resolve));
const address = fake.address(); assert.ok(address && typeof address !== 'string');
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(),'progress-browser-'));
const service = await createCoCreateServer({port:0,host:'127.0.0.1',serveClient:true,dataDir,sessionSecret:'progress-browser',encryptionSecret:'progress-browser',debounceMs:20,buildDebounceMs:500,buildCooldownMs:0,buildMaxWaitMs:2_000,baseUrl:`http://127.0.0.1:${address.port}`});
const room = service.manager.create(`progress-${crypto.randomUUID()}`);
for (const [id,name] of [['alice','Alice'],['bob','Bob'],['cara','Cara']]) service.manager.join(room,id,name);
const connection = await service.manager.saveConnection(room,{name:'Controlled provider',provider:'custom',baseUrl:`http://127.0.0.1:${address.port}`,apiFormat:'responses',apiKey:'synthetic'});
room.ai.connections![0].checks.fixture={reachable:{status:'passed'},text:{status:'passed'},personal:{status:'passed'},builder:{status:'passed'}};
await service.manager.assignAI(room,{connectionId:connection.id,model:'fixture'},{connectionId:connection.id,model:'fixture'});
const {url:origin} = await service.start();
type Browser = {call:(method:string,params?:object)=>Promise<any>;evaluate:(code:string)=>Promise<any>;socket:WebSocket;process:ReturnType<typeof spawn>;profile:string};
const browsers: Browser[] = [];
const session = (id:string) => createSession('progress-browser',{roomId:room.id,participantId:id,name:id,role:id==='cara'?'viewer':id==='alice'?'owner':'editor'});

async function open(id:string,index:number): Promise<Browser> {
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'progress-chrome-')),port=9900+index+process.pid%200;
  const processHandle=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disk-cache-size=1','--media-cache-size=1','--disable-component-update','--disable-background-networking','--disable-sync','--disable-gpu','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
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
  await call('Page.enable'); await call('Runtime.enable');
  await call('Page.addScriptToEvaluateOnNewDocument',{source:"window.__progressRequests=[];const nativeFetch=window.fetch.bind(window);window.fetch=(...args)=>{if(String(args[0]).endsWith('/submit'))window.__progressRequests.push(JSON.parse(args[1].body));return nativeFetch(...args)}"});
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
try {
  const a=await open('alice',0),b=await open('bob',1),c=await open('cara',2);
  await submit(a,'Build a shared catalog.');await until(async()=>gates.has(1),'first candidate');
  await submit(b,'Add progress favorites.');await until(async()=>room.submissions.filter(item=>item.status==='submitted').length===1,'first durable pending command');
  await submit(a,'Add progress sorting.');await until(async()=>room.submissions.filter(item=>item.status==='submitted').length===2,'second durable pending command');
  assert.equal(interpreterCalls,1);assert.equal(room.specificationRevision,1);
  await converge('Building r1');await converge('2 submitted changes waiting');
  const replay=await b.evaluate('window.__progressRequests[0]');
  const replayResponse=await fetch(`${origin}/api/rooms/${room.id}/submit`,{method:'POST',headers:{authorization:`Bearer ${session('bob')}`,'content-type':'application/json'},body:JSON.stringify(replay)});
  assert.equal(replayResponse.status,200);assert.equal(interpreterCalls,1);
  await b.call('Page.reload');await until(()=>b.evaluate("!!document.querySelector('.document-editor')&&!document.querySelector('.connection-banner')"),'reload during candidate');await converge('2 submitted changes waiting');
  const viewerDenied=await fetch(`${origin}/api/rooms/${room.id}/submit`,{method:'POST',headers:{authorization:`Bearer ${session('cara')}`,'content-type':'application/json'},body:JSON.stringify({requestId:'viewer-progress-request'})});assert.equal(viewerDenied.status,403);
  await screenshot(a,'pending-desktop.png');
  gates.get(1)!();await until(async()=>room.versions.length===1&&gates.has(2),'first artifact with next candidate');
  assert.equal(candidates[1].requirements,3);assert.equal(room.executionBudget?.calls,2);
  await converge('Building r3');await converge('Available v1');await converge('r1');
  await submit(b,'Add progress labels.');await until(async()=>room.submissions.filter(item=>item.status==='submitted').length===1,'continued steering');await converge('1 submitted change waiting');
  await screenshot(a,'available-during-build.png');
  gates.get(2)!();await until(async()=>room.versions.length===2&&gates.has(3),'second progress under continued steering');
  await converge('Building r4');await converge('Available v2');
  gates.get(3)!();await until(async()=>room.versions.length===3&&!room.buildTask&&!room.buildTimer,'final drain');
  await converge('Available v3');assert.deepEqual(room.versions.map(item=>item.specificationRevision),[1,3,4]);
  assert.equal(interpreterCalls,4);assert.equal(candidates.length,3);assert.equal(room.aiRuns.at(-1)!.verification.verified,false);
  const count=interpreterCalls+candidates.length;await a.call('Page.reload');await until(()=>a.evaluate("!!document.querySelector('.document-editor')&&!document.querySelector('.connection-banner')"),'final reload');await converge('Available v3');assert.equal(interpreterCalls+candidates.length,count);
  for(const width of [1440,390]) {
    await a.call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});await wait(100);
    assert.ok(await a.evaluate('document.documentElement.scrollWidth<=innerWidth'));
    await screenshot(a,width===390?'mobile.png':'desktop.png');
  }
  const report={scope:'Three independent signed local owner/editor/viewer Chrome profiles, real SQLite, controlled loopback provider and Windows isolated compiler; no hosted accounts, paid inference or SQL execution',participants:3,capturedPendingDurable:true,reloadDuringBuild:true,replayAddsNoInference:true,viewerDenied:true,convergedRevisionLabels:true,progressWithFurtherCaptures:true,promotedRevisions:room.versions.map(item=>item.specificationRevision),interpreterCalls,builderCalls:candidates.length,physicalCalls:service.manager.view(room).physicalUsage.recorded.requests,functionalVerified:false};
  fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
} catch (error) {
  console.error(JSON.stringify({phase:'browser-failure',status:room.status,error:room.lastError,acceptedRevision:room.specificationRevision,versions:room.versions.map(item=>({id:item.id,revision:item.specificationRevision})),candidates,submissions:room.submissions.map(item=>({actor:item.participantId,status:item.status,error:item.error})),runs:room.aiRuns.map(item=>({outcome:item.outcome,verification:item.verification}))}));
  throw error;
} finally {
  for(const release of gates.values())release();
  for(const browser of browsers)await browser.call('Page.navigate',{url:'about:blank'}).catch(()=>{});
  for(const browser of browsers){browser.socket.close();browser.process.kill();}
  await service.stop();fake.closeAllConnections();await new Promise<void>(resolve=>fake.close(()=>resolve()));await wait(500);
  for(const browser of browsers){if(path.dirname(path.resolve(browser.profile))!==path.resolve(os.tmpdir())||!/^progress-chrome-[A-Za-z0-9]+$/.test(path.basename(browser.profile)))throw new Error('Unsafe Chrome cleanup');fs.rmSync(browser.profile,{recursive:true,force:true,maxRetries:6,retryDelay:200});}
  if(path.dirname(path.resolve(dataDir))!==path.resolve(os.tmpdir())||!path.basename(dataDir).startsWith('progress-browser-'))throw new Error('Unsafe data cleanup');fs.rmSync(dataDir,{recursive:true,force:true});
}
