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
const output=path.resolve('artifacts/multiuser-step05/browser');fs.mkdirSync(output,{recursive:true});
const wait=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
const until=async(check:()=>Promise<boolean>,label:string)=>{for(let i=0;i<120;i++){if(await check())return;await wait(100);}throw new Error(`Timed out: ${label}`);};
let interpreterCalls=0,builderCalls=0;let releaseCandidate:(()=>void)|undefined;const inputs:any[]=[];
const fake=http.createServer(async(req,res)=>{
  let raw='';for await(const chunk of req)raw+=chunk;const body=JSON.parse(raw),input=JSON.parse(body.input);let value:unknown;
  if(body.text.format.schema.required.includes('goals')){
    interpreterCalls++;inputs.push(input);const text=input.authenticatedChanges.map((change:any)=>change.after).join(' ');
    value={goals:[text],features:[],design:[],constraints:[],questions:[],additions:[],modifications:[],withdrawals:[],classification:'explicit_request',affectedRequirementIds:[],sourcePassages:[text],intents:[{text,category:'goal',classification:'explicit_request',rationale:'Direct request',sourcePassage:text,affectedRequirementIds:[]}]};
  }else{builderCalls++;if(builderCalls===2)await new Promise<void>(resolve=>{releaseCandidate=resolve});else await wait(100);value={operations:[{type:'write',path:'src/App.tsx',content:'export default function App(){return <main>Shared catalog</main>}'}],summary:'Shared catalog',decisions:[],conflicts:[],specification:{agreed:[],proposed:[],questions:[]}};}
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
const browsers:Browser[]=[];
async function open(id:string,index:number){
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'reliability-chrome-')),port=9800+index+process.pid%200;
  const browser=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disk-cache-size=1','--media-cache-size=1','--disable-component-update','--disable-background-networking','--disable-sync','--disable-gpu','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
  let target:any;await until(async()=>{try{target=await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'}).then(value=>value.json());return!!target.webSocketDebuggerUrl;}catch{return false;}},'Chrome startup');
  const socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise<void>((resolve,reject)=>{socket.addEventListener('open',()=>resolve(),{once:true});socket.addEventListener('error',reject,{once:true});});
  let sequence=0;const pending=new Map<number,{resolve:(value:any)=>void;reject:(error:Error)=>void}>();
  socket.addEventListener('message',event=>{const result=JSON.parse(String(event.data)),task=pending.get(result.id);if(task){pending.delete(result.id);result.error?task.reject(new Error(result.error.message)):task.resolve(result.result);}});
  const call=(method:string,params={})=>new Promise<any>((resolve,reject)=>{const id=++sequence,timer=setTimeout(()=>reject(new Error(`${method} timed out`)),15000);pending.set(id,{resolve:value=>{clearTimeout(timer);resolve(value);},reject:error=>{clearTimeout(timer);reject(error);}});socket.send(JSON.stringify({id,method,params}));});
  const evaluate=async(expression:string)=>{const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));return result.result.value;};
  const instance={call,evaluate,socket,process:browser,profile};browsers.push(instance);
  await call('Page.enable');await call('Network.enable');await call('Runtime.enable');
  await call('Page.addScriptToEvaluateOnNewDocument',{source:`window.__sockets=[];window.__ownerRetryDiagnoses=0;const NativeWebSocket=window.WebSocket;window.WebSocket=class extends NativeWebSocket{constructor(...args){if(window.__ownerRetryFixture){const url=new URL(args[0]);url.pathname='/fixture-unavailable-ws';args[0]=url.href}super(...args);window.__sockets.push(this)}};window.__intentRequests=[];const nativeFetch=window.fetch.bind(window);window.fetch=(...args)=>{if(String(args[0]).includes('/intent-commands'))window.__intentRequests.push(JSON.parse(args[1].body));if(window.__ownerRetryFixture&&String(args[0]).includes('/state')){window.__ownerRetryDiagnoses++;return Promise.resolve(new Response('{}',{status:503,headers:{'Retry-After':'2'}}))}return nativeFetch(...args)};`});
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await call('Page.navigate',{url:origin});await wait(200);
  const token=createSession('browser-fixture',{roomId:room.id,participantId:id,name:id,role:id==='cara'?'viewer':id==='alice'?'owner':'editor'});await evaluate(`localStorage.setItem('cocreate-session-${room.id}',${JSON.stringify(token)})`);
  await call('Page.navigate',{url:`${origin}/r/${room.id}`});await until(()=>evaluate("!!document.querySelector('.document-editor') && !document.querySelector('.connection-banner')"),'workspace connection');return instance;
}
const write=async(browser:Browser,text:string)=>{await browser.evaluate("document.querySelector('.document-editor').focus()");await browser.call('Input.insertText',{text});};
const submit=async(browser:Browser)=>browser.evaluate("[...document.querySelectorAll('button')].find(button=>button.textContent==='Build my changes').click()");
const snapshot=async(browser:Browser,name:string)=>{const result=await browser.call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(output,name),Buffer.from(result.data,'base64'));};

const token=(id:string)=>createSession('browser-fixture',{roomId:room.id,participantId:id,name:id,role:id==='cara'?'viewer':id==='alice'?'owner':'editor'});
const request=async(id:string,route:string,body:unknown)=>{const response=await fetch(`${origin}/api/rooms/${room.id}/${route}`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token(id)},body:JSON.stringify(body)});return{status:response.status,body:await response.json()};};
const click=async(browser:Browser,text:string)=>browser.evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent.trim()===${JSON.stringify(text)}).click()`);
const review=async(browser:Browser)=>{await browser.call('Page.bringToFront');await browser.evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent.includes('View requirements')).focus()`);await browser.call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});await browser.call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});try{await until(()=>browser.evaluate("!!document.querySelector('dialog.intent-review[open]')"),'intent dialog opened by Enter');}catch(error){console.log(await browser.evaluate("({active:document.activeElement.outerHTML,dialogs:[...document.querySelectorAll('dialog,[role=dialog]')].map(x=>x.outerHTML.slice(0,800)),text:document.body.innerText})"));await snapshot(browser,'failed-open.png');throw error;}};
const typeCorrection=async(browser:Browser,text:string)=>{await browser.evaluate("document.querySelector('.intent-correction textarea').focus();document.querySelector('.intent-correction textarea').select()");await browser.call('Input.insertText',{text});};
const enterSave=async(browser:Browser)=>{await browser.evaluate("document.querySelector('.intent-correction button[type=submit]').focus()");await browser.call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});await browser.call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});};
const escape=async(browser:Browser)=>{await browser.call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await browser.call('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});};
try{
  const a=await open('alice',0),b=await open('bob',1),c=await open('cara',2);
  await write(a,'Add catalog history.');await until(()=>b.evaluate("document.querySelector('.document-editor').innerText.includes('Add catalog history.')"),'first source synchronization');
  await write(b,'Add catalog history.');
  await Promise.all([submit(a),submit(b)]);await until(async()=>room.versions.length===1&&!room.buildTask,'coauthored baseline build');
  assert.equal(interpreterCalls,2);assert.equal(builderCalls,1);assert.equal(room.sharedRequirements.length,1);assert.equal(room.sharedRequirements[0].sources.length,2);
  await review(a);await review(b);await review(c);
  assert.equal(await c.evaluate("document.querySelectorAll('dialog .intent-actions button').length"),0);
  assert.equal((await request('cara','intent-commands',{})).status,403);
  assert.equal((await request('alice','process',{})).status,410);assert.equal((await request('alice','reinterpret',{})).status,410);
  await a.call('Page.bringToFront');for(let i=0;i<24;i++){await a.call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await a.call('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});assert.ok(await a.evaluate("document.querySelector('dialog').contains(document.activeElement)"),'native dialog retains Tab focus');}
  for(let i=0;i<12;i++){await a.call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9,modifiers:8});await a.call('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9,modifiers:8});assert.ok(await a.evaluate("document.querySelector('dialog').contains(document.activeElement)"),'dialog retains Shift+Tab focus');}
  await escape(a);await until(()=>a.evaluate("!document.querySelector('dialog.intent-review')"),'Escape closes dialog');
  assert.ok(await a.evaluate("document.activeElement.textContent.includes('View requirements')"),'focus returns to opener');await review(a);
  await click(a,'Correct my support');await typeCorrection(a,'Add searchable catalog history.');
  await click(b,'Correct my support');await typeCorrection(b,'Add catalog exporting.');await enterSave(b);
  await until(async()=>room.specificationRevision===3,'Bob correction saved');
  assert.equal(room.sharedRequirements.find(item=>item.description==='Add catalog history.')!.sources[0].participantId,'alice');
  assert.equal(room.sharedRequirements.find(item=>item.description==='Add catalog exporting.')!.sources[0].participantId,'bob');
  assert.equal(builderCalls,1);assert.equal(interpreterCalls,2);
  await enterSave(a);await until(()=>a.evaluate("document.querySelector('[role=alert]')?.innerText.includes('specification changed')"),'stale form rejected');
  assert.equal(room.specificationRevision,3);await snapshot(a,'stale-correction.png');
  await click(a,'Cancel edit');await escape(a);await review(a);await click(a,'Correct my support');await typeCorrection(a,'Add searchable catalog history.');await a.evaluate("window.__nativeStorageSet=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key.startsWith('cocreate-intent-command-'))throw new DOMException('Controlled recovery quota failure','QuotaExceededError');return window.__nativeStorageSet.call(this,key,value)}");await enterSave(a);
  await until(async()=>room.specificationRevision===4,'Alice correction saved');
  assert.ok(await a.evaluate("document.querySelector('dialog').innerText.includes('Device recovery copy is unavailable')"));await a.evaluate("Storage.prototype.setItem=window.__nativeStorageSet");
  const literal=await a.evaluate('window.__intentRequests.at(-1)');const replay=await request('alice','intent-commands',literal);assert.equal(replay.status,200);assert.equal(replay.body.specificationRevision,4);assert.equal(room.intentCorrections!.length,2);
  const savedCalls={interpreterCalls,builderCalls};
  await a.call('Page.reload');await until(()=>a.evaluate("!!document.querySelector('.document-editor')&&!document.querySelector('.connection-banner')"),'reload connected');await review(a);
  await until(()=>b.evaluate("document.querySelector('dialog').innerText.includes('Add searchable catalog history.')"),'teammate converged after correction');
  assert.deepEqual({interpreterCalls,builderCalls},savedCalls);
  await a.evaluate("[...document.querySelectorAll('dialog summary')].find(item=>item.textContent==='Correction and interpretation history').click()");
  assert.ok(await a.evaluate("document.querySelector('dialog').innerText.includes('Before: Add catalog history.')"),'correction audit survives reload');
  assert.ok(await a.evaluate("document.querySelector('dialog').innerText.includes('Add catalog exporting.')"),'teammate intent survives correction');
  await snapshot(a,'corrected-history.png');
  await click(a,'Build accepted changes');await until(async()=>!!releaseCandidate,'explicit corrected candidate started');assert.equal(interpreterCalls,2);assert.equal(builderCalls,2);
  // Change the accepted assumption while the controlled provider holds a real candidate.
  await until(()=>a.evaluate("!document.querySelector('dialog button')?.disabled"),'build button request settled');
  await a.evaluate("[...document.querySelectorAll('dialog article')].find(article=>article.querySelector('strong')?.textContent==='Add searchable catalog history.').querySelector('.intent-actions button').click()");
  await typeCorrection(a,'Add searchable catalog history with dates.');await enterSave(a);await until(async()=>room.specificationRevision===5,'correction during candidate saved');
  releaseCandidate!();await until(async()=>!room.buildTask,'invalidated candidate stopped');assert.equal(room.versions.length,1);assert.equal(builderCalls,2);
  assert.equal(room.intentBuildPending,true);assert.equal(room.buildTimer,undefined);
  await click(a,'Build accepted changes');await until(async()=>room.versions.length===2&&!room.buildTask,'explicit revised build completed');assert.equal(builderCalls,3);assert.equal(interpreterCalls,2);
  assert.equal(room.versions.at(-1)!.aiRun!.verification.verified,false,'compilation remains distinct from functional verification');
  for(const input of inputs){assert.ok(Array.isArray(input.acceptedContext));assert.equal(input.sharedBrainstormCanvas,undefined);}
  await a.evaluate("[...document.querySelectorAll('dialog article')].find(article=>article.querySelector('strong')?.textContent==='Add searchable catalog history with dates.').querySelectorAll('.intent-actions button')[1].click()");
  await click(a,'Confirm withdrawal');await until(async()=>room.specificationRevision===6,'explicit withdrawal saved');
  assert.equal(room.sharedRequirements.find(item=>item.description==='Add searchable catalog history with dates.')!.status,'withdrawn');assert.equal(room.sharedRequirements.find(item=>item.description==='Add catalog exporting.')!.status,'accepted');
  assert.equal(builderCalls,3);assert.equal(interpreterCalls,2);
  for(const width of [1440,390]){await a.call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});await wait(100);const layout=await a.evaluate("({body:document.documentElement.scrollWidth,viewport:innerWidth,dialog:document.querySelector('dialog').getBoundingClientRect().width})");assert.ok(layout.body<=width&&layout.dialog<=width);await snapshot(a,width===390?'mobile.png':'desktop.png');}
  const report={scope:'Three independent local Chrome profiles with signed owner/editor/viewer sessions, SQLite, loopback controlled provider and Windows isolated compilation; no hosted accounts, real SQL, or paid inference',participants:3,coauthorPreserved:true,revisionConflictVisible:true,correctionReloaded:true,replayReceiptCount:room.intentCorrections!.length,viewerDenied:true,legacyRoutesRetired:true,nativeTabTrap:true,escapeAndReturnFocus:true,keyboardSave:true,deviceCacheFailureVisible:true,explicitWithdrawal:true,acceptedContextSeparated:true,candidateInvalidation:true,oldProductRetained:true,noInferenceOnCorrectionReloadReplay:true,interpreterCalls,builderCalls,finalSpecificationRevision:room.specificationRevision,functionalVerified:false};
  fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{
  releaseCandidate?.();for(const browser of browsers){browser.socket.close();browser.process.kill();}
  await service.stop();fake.closeAllConnections();await new Promise<void>(resolve=>fake.close(()=>resolve()));await wait(500);
  for(const browser of browsers){const resolved=path.resolve(browser.profile);if(path.dirname(resolved)!==path.resolve(os.tmpdir())||!/^reliability-chrome-[A-Za-z0-9]+$/.test(path.basename(resolved)))throw new Error('Unsafe browser cleanup');fs.rmSync(resolved,{recursive:true,force:true,maxRetries:6,retryDelay:200});}
  if(path.dirname(path.resolve(dataDir))!==path.resolve(os.tmpdir()))throw new Error('Unsafe fixture cleanup');fs.rmSync(dataDir,{recursive:true,force:true});
}
