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
const output = path.resolve('artifacts/multiuser-step07/browser');
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
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(),'progress-browser-'));
const service = await createCoCreateServer({port:0,host:'127.0.0.1',serveClient:true,dataDir,sessionSecret:'progress-browser',encryptionSecret:'progress-browser',debounceMs:20,buildDebounceMs:500,buildCooldownMs:0,buildMaxWaitMs:2_000,baseUrl:`http://127.0.0.1:${address.port}`});
const room = service.manager.create(`progress-${crypto.randomUUID()}`);
for (const [id,name] of [['alice','Alice'],['bob','Bob'],['cara','Cara']]) service.manager.join(room,id,name);
const connection = await service.manager.saveConnection(room,{name:'Controlled provider',provider:'custom',baseUrl:`http://127.0.0.1:${address.port}`,apiFormat:'responses',apiKey:'synthetic'});
room.ai.connections![0].checks.fixture={reachable:{status:'passed'},text:{status:'passed'},personal:{status:'passed'},builder:{status:'passed'}};
await service.manager.assignAI(room,{connectionId:connection.id,model:'fixture'},{connectionId:connection.id,model:'fixture'});
const {url:origin} = await service.start();
const execute=service.manager.tools.execute.bind(service.manager.tools);
service.manager.tools.execute=(async(name:any,input:any,context:any)=>{try{return await execute(name,input,context);}catch(error){console.error(JSON.stringify({phase:'fixture-tool-error',tool:name,code:(error as any).code,cause:(error as any).cause}));throw error;}}) as typeof service.manager.tools.execute;
type Browser = {call:(method:string,params?:object)=>Promise<any>;evaluate:(code:string)=>Promise<any>;socket:WebSocket;process:ReturnType<typeof spawn>;profile:string};
const browsers: Browser[] = [];
const session = (id:string) => createSession('progress-browser',{roomId:room.id,participantId:id,name:id,role:id==='cara'?'viewer':id==='alice'?'owner':'editor'});

async function open(id:string,index:number): Promise<Browser> {
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'progress-chrome-')),port=9900+index+process.pid%200;
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
  await submit(a,'Build a catalog with a working filter');await until(async()=>gates.has(1),'first candidate');
  gates.get(1)!();await until(async()=>room.versions.length===1&&!room.buildTask,'verified first product');
  await converge('Available v1');assert.equal(room.aiRuns.at(-1)!.verification.verified,true);
  const prior=structuredClone(room.versions[0]);
  broken=true;await submit(b,'Add favorites');await until(async()=>gates.has(2),'regression candidate');
  gates.get(2)!();await until(async()=>room.status==='Error'&&!room.buildTask,'failed behavior gate');
  assert.deepEqual(room.versions,[prior]);await converge('Available v1');
  const summary=(browser:Browser)=>browser.evaluate("document.querySelector('.verification-summary')?.textContent||''");
  await until(async()=>{const values=await Promise.all(browsers.map(summary));return values.every(value=>value.includes('Update blocked'))&&new Set(values).size===1;},'failed evidence convergence');
  await a.call('Page.bringToFront');
  await a.evaluate("document.querySelector('.verification-summary summary').focus()");
  await a.call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});
  await a.call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await until(()=>a.evaluate("document.querySelector('details.verification-summary').open"),'keyboard details activation');
  assert.match(await summary(a),/Failed: Filtering did not narrow/);
  await screenshot(a,'failed-desktop.png');
  const replay=await b.evaluate('window.__progressRequests[0]'), calls=interpreterCalls+candidates.length;
  const replayResponse=await fetch(`${origin}/api/rooms/${room.id}/submit`,{method:'POST',headers:{authorization:`Bearer ${session('bob')}`,'content-type':'application/json'},body:JSON.stringify(replay)});
  assert.equal(replayResponse.status,200);assert.equal(interpreterCalls+candidates.length,calls);
  await b.call('Page.reload');await until(()=>b.evaluate("!!document.querySelector('.document-editor')&&!document.querySelector('.connection-banner')"),'failed build reload');
  assert.match(await summary(b),/Update blocked/);assert.equal(interpreterCalls+candidates.length,calls);
  const viewerDenied=await fetch(`${origin}/api/rooms/${room.id}/submit`,{method:'POST',headers:{authorization:`Bearer ${session('cara')}`,'content-type':'application/json'},body:JSON.stringify({requestId:'viewer-verification-request'})});assert.equal(viewerDenied.status,403);
  await b.evaluate("[...document.querySelectorAll('button')].find(button=>button.textContent==='Artifacts').click()");
  await until(()=>b.evaluate("!!document.querySelector('iframe')?.src.includes('/preview/')"),'retained artifact visible');
  assert.match(await b.evaluate("document.querySelector('iframe').getAttribute('src')"),new RegExp(`/preview/${room.id}/1`));
  const frameTree=await b.call('Page.getFrameTree');
  const previewFrame=frameTree.frameTree.childFrames.find((frame:any)=>frame.frame.url.includes('/preview/')).frame.id;
  const world=await b.call('Page.createIsolatedWorld',{frameId:previewFrame,worldName:'retained-product-check'});
  await until(async()=>{const result=await b.call('Runtime.evaluate',{contextId:world.executionContextId,expression:"document.querySelectorAll('#root li').length",returnByValue:true});return result.result.value===3;},'retained product rendered');
  await screenshot(b,'retained-product.png');
  broken=false;await submit(a,'Add a clear title');await until(async()=>gates.has(3),'explicit revised build');
  gates.get(3)!();await until(async()=>room.versions.length===2&&!room.buildTask,'partially covered product');
  await converge('Available v2');assert.equal(room.aiRuns.at(-1)!.verification.evidence?.status,'unverified');
  assert.ok(room.aiRuns.at(-1)!.verification.evidence?.checks.every(check=>check.passed));
  await until(async()=>{const values=await Promise.all(browsers.map(summary));return values.every(value=>value.includes('Limited acceptance coverage')&&value.includes('1 requirement unverified'))&&new Set(values).size===1;},'honest coverage convergence');
  await a.call('Page.reload');await until(()=>a.evaluate("!!document.querySelector('.document-editor')&&!document.querySelector('.connection-banner')"),'final reload');
  const finalCalls=interpreterCalls+candidates.length;assert.equal(finalCalls,6);
  await a.evaluate("document.querySelector('details.verification-summary').open=true");
  for(const width of [1440,390]) {
    await a.call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});await wait(100);
    assert.ok(await a.evaluate('document.documentElement.scrollWidth<=innerWidth'));
    await screenshot(a,width===390?'mobile.png':'desktop.png');
  }
  assert.equal(interpreterCalls+candidates.length,finalCalls);
  const report={scope:'Three independent signed local owner/editor/viewer Chrome profiles; real SQLite and Windows OS-isolated compiler/browser; controlled loopback provider. Hosted/live/SQL not run.',participants:3,failedCandidateBlocked:true,priorProductVisible:true,failedEvidenceConverged:true,passedChecksWithHonestUnverifiedCoverage:true,reloadAddsNoInference:true,replayAddsNoInference:true,viewerDenied:true,keyboardDetails:true,responsiveWidths:[1440,390],promotedRevisions:room.versions.map(item=>item.specificationRevision),interpreterCalls,builderCalls:candidates.length,physicalCalls:service.manager.view(room).physicalUsage.recorded.requests,evidence:room.aiRuns.map(run=>run.verification.evidence)};
  fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
} catch(error) {
  console.error(JSON.stringify({phase:'browser-failure',status:room.status,error:room.lastError,acceptedRevision:room.specificationRevision,versions:room.versions.map(item=>({id:item.id,revision:item.specificationRevision})),runs:room.aiRuns.map(item=>({outcome:item.outcome,verification:item.verification}))}));throw error;
} finally {
  for(const release of gates.values())release();
  for(const browser of browsers)await browser.call('Page.navigate',{url:'about:blank'}).catch(()=>{});
  for(const browser of browsers){browser.socket.close();browser.process.kill();}
  await service.stop();fake.closeAllConnections();await new Promise<void>(resolve=>fake.close(()=>resolve()));await wait(500);
  for(const browser of browsers){if(path.dirname(path.resolve(browser.profile))!==path.resolve(os.tmpdir())||!/^progress-chrome-[A-Za-z0-9]+$/.test(path.basename(browser.profile)))throw new Error('Unsafe Chrome cleanup');fs.rmSync(browser.profile,{recursive:true,force:true,maxRetries:6,retryDelay:200});}
  if(path.dirname(path.resolve(dataDir))!==path.resolve(os.tmpdir())||!path.basename(dataDir).startsWith('progress-browser-'))throw new Error('Unsafe data cleanup');fs.rmSync(dataDir,{recursive:true,force:true});
}
