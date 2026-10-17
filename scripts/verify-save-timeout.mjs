// Controlled transport/submission checks; no model, cloud credentials or hosted mutations.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import express from 'express';
process.env.TWOGUYS1CANVAS_AUTH_MODE='local';
process.env.NODE_ENV='production';
const {createTwoGuysOneCanvasServer}=await import('../server/index.ts');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'2guys1canvas-save-ui-'));
const instance=await createTwoGuysOneCanvasServer({port:0,host:'127.0.0.1',serveClient:false,dataDir:dir,sessionSecret:'synthetic',encryptionSecret:'synthetic'});
// Managed worktrees live below .codex; allow that ancestor only in this local harness.
instance.app.use(express.static(path.resolve('.runtime/build-save-ui'),{dotfiles:'allow'}));
instance.app.get('*path',(_req,res)=>res.sendFile(path.resolve('.runtime/build-save-ui/index.html'),{dotfiles:'allow'}));
const {port:appPort}=await instance.start(),origin=`http://127.0.0.1:${appPort}`;
const request=async(url,body)=>fetch(origin+url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(response=>response.json());
const {roomId}=await request('/api/rooms',{}),session=await request('/api/session',{roomId,name:'Save QA'}),room=instance.manager.get(roomId);
const view=instance.manager.view.bind(instance.manager);
instance.manager.view=active=>{const state=view(active);return {...state,ai:{...state.ai,status:'connected'}}};
let mode='delay',flushCount=0,held,submissions=[];
const original=instance.manager.handleMessage.bind(instance.manager);
instance.manager.handleMessage=(active,ws,packet,binary)=>{
  if(!binary&&JSON.parse(packet.toString()).type==='flush'){
    flushCount++;held={active,ws,packet,binary};
    if(mode==='delay')return;
    if(mode==='failure'){ws.send(JSON.stringify({type:'flush-error',requestId:JSON.parse(packet.toString()).requestId,message:'Controlled snapshot failure. No build was started.'}));return}
    if(mode==='unknown')return;
  }
  return original(active,ws,packet,binary);
};
instance.manager.submitChanges=async(_room,actorId,requestId)=>{
  submissions.push({actorId,requestId});
  return {status:'submitted',message:'Controlled submission accepted; no inference.'};
};
const debugPort=9700+process.pid%200,profile=path.join(dir,'chrome');
const browser=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disable-gpu','--no-first-run',`--remote-debugging-port=${debugPort}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let socket;
const checks={};
try{
  let target;for(let i=0;i<80&&!target;i++){await sleep(100);try{target=await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`,{method:'PUT'}).then(response=>response.json())}catch{}}
  assert.ok(target,'Chrome debugging available');socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})});
  let id=0;const pending=new Map();socket.addEventListener('message',event=>{const result=JSON.parse(event.data);if(pending.has(result.id)){const entry=pending.get(result.id);pending.delete(result.id);result.error?entry.reject(Error(result.error.message)):entry.resolve(result.result)}});
  const call=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))});
  const evaluate=async expression=>{const value=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(value.exceptionDetails)throw Error(JSON.stringify(value.exceptionDetails));return value.result.value};
  const wait=async(check,label)=>{for(let i=0;i<100;i++){if(await check())return;await sleep(100)}throw Error('Timed out: '+label)};
  await call('Page.enable');await call('Runtime.enable');await call('Page.navigate',{url:origin});await sleep(300);
  await evaluate(`localStorage.setItem('2guys1canvas-session-${roomId}',${JSON.stringify(session.token)})`);
  await call('Page.navigate',{url:`${origin}/r/${roomId}`});
  await wait(()=>evaluate(`!!document.querySelector('.document-editor')&&!![...document.querySelectorAll('button')].find(b=>b.textContent.includes('Build my changes'))`),'workspace');
  await wait(()=>room.clients.size>0,'collaboration connection');await sleep(200);
  console.log('Workspace ready');
  const activate=async()=>evaluate(`(()=>{const editor=document.querySelector('.document-editor');editor.focus();const button=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Build my changes'));button.click();editor.dispatchEvent(new KeyboardEvent('keydown',{key:'x',code:'KeyX',altKey:true,bubbles:true}));button.click()})()`);
  const type=async text=>{await evaluate(`document.querySelector('.document-editor').focus()`);await call('Input.insertText',{text})};
  const release=()=>{const value=held;original(value.active,value.ws,value.packet,value.binary)};
  await type('Build a controlled catalog.');await activate();await wait(()=>flushCount===1,'flush');
  await sleep(4_000);assert.equal(submissions.length,0);await type(' Later edit while saving.');
  assert.match(await evaluate(`document.querySelector('.document-editor').innerText`),/Later edit/);release();
  await wait(()=>submissions.length===1,'one delayed submission');await sleep(200);assert.equal(flushCount,1);assert.equal(submissions[0].actorId,session.participantId);
  checks.delayedSuccessAndRepeatedActivation=true;checks.editableDuringWait=true;
  console.log('Delayed save and repeated activation passed');
  mode='failure';await type(' Keep this failed draft.');await activate();
  await wait(()=>evaluate(`document.querySelector('.error-banner')?.innerText.includes('Controlled snapshot failure')`),'visible save failure');
  assert.equal(submissions.length,1);assert.doesNotMatch(await evaluate(`document.querySelector('.error-banner').innerText`),/last working product/);
  checks.firstBuildError=true;
  console.log('First-build failure passed');
  // A real server version projection exercises the existing-product message without compiling a candidate.
  room.versions.push({id:1,summary:'Controlled existing product',files:[{path:'src/App.tsx',content:'export default function App(){return null}'}],bundle:'window.controlled=true',css:'',fileCount:1,createdAt:new Date().toISOString()});
  await instance.manager.save(room);for(const client of room.clients)client.send(JSON.stringify({type:'room-state',state:instance.manager.view(room)}));
  await wait(()=>evaluate(`document.querySelector('.error-banner')?.innerText.includes('last working product')`),'existing product retained');checks.existingProductError=true;
  mode='unknown';await evaluate(`(()=>{const original=window.setTimeout;window.setTimeout=(callback,delay,...args)=>original(callback,delay===30000?150:delay,...args)})()`);
  for(const client of room.clients){const send=client.send.bind(client);client.send=(data,...args)=>{if(mode==='unknown'&&typeof data==='string'&&JSON.parse(data).type==='saved')return;return send(data,...args)}}
  await type(' Unknown save draft.');await activate();
  await wait(()=>evaluate(`document.querySelector('.error-banner')?.innerText.includes('save outcome is unknown')`),'bounded unknown outcome');
  assert.equal(submissions.length,1);assert.match(await evaluate(`document.querySelector('.doc-meta').innerText`),/Unsynced changes/i);
  mode='normal';release();await sleep(300);assert.equal(submissions.length,1);checks.timeoutAndLateReply=true;
  await evaluate(`(()=>{const original=window.fetch;let drop=true;window.fetch=async(...args)=>{const result=await original(...args);if(drop&&String(args[0]).endsWith('/submit')){drop=false;throw Error('Controlled submission response lost')}return result}})()`);
  await activate();await wait(()=>evaluate(`document.querySelector('.error-banner')?.innerText.includes('Controlled submission response lost')`),'uncertain submit reply');
  assert.equal(submissions.length,2);await type(' New typing before explicit replay.');await activate();
  await wait(()=>submissions.length===3,'explicit replay');assert.equal(submissions[1].requestId,submissions[2].requestId);checks.uncertainSubmissionKeepsRequestId=true;
  assert.equal(room.providerCalls.length,0);checks.physicalCalls=0;
  console.log(JSON.stringify(checks));
}finally{
  socket?.close();if(browser.exitCode===null){browser.kill();await new Promise(resolve=>browser.once('exit',resolve))}await instance.stop();
  assert.equal(path.dirname(dir),path.resolve(os.tmpdir()));fs.rmSync(dir,{recursive:true,force:true});
}
