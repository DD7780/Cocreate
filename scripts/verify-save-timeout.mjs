// Controlled transport/submission checks; no model, cloud credentials or hosted mutations.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import express from 'express';
import {build} from 'vite';
process.env.TWOGUYS1CANVAS_AUTH_MODE='local';
process.env.VITE_TWOGUYS1CANVAS_AUTH_MODE='local';
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
const teammate=await request('/api/session',{roomId,name:'Teammate QA'});
const view=instance.manager.view.bind(instance.manager);
instance.manager.view=active=>{const state=view(active);return {...state,ai:{...state.ai,status:'connected'}}};
let mode='delay',flushCount=0,held,submissions=[];
const original=instance.manager.handleMessage.bind(instance.manager);
instance.manager.handleMessage=(active,ws,packet,binary,trace)=>{
  if(!binary&&JSON.parse(packet.toString()).type==='flush'){
    flushCount++;held={active,ws,packet,binary,trace};
    if(mode==='delay')return;
    if(mode==='failure'){ws.send(JSON.stringify({type:'flush-error',requestId:JSON.parse(packet.toString()).requestId,message:'Controlled snapshot failure. No build was started.'}));return}
    if(mode==='unknown')return;
  }
  return original(active,ws,packet,binary,trace);
};
instance.manager.submitChanges=async(active,actorId,requestId)=>{
  submissions.push({actorId,requestId,sequences:(active.pending.get(actorId)||[]).map(item=>item.seq)});
  return {status:'submitted',message:'Controlled submission accepted; no inference.'};
};
const debugPort=9700+process.pid%200,profile=path.join(dir,'chrome');
const browser=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disable-gpu','--no-first-run',`--remote-debugging-port=${debugPort}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let socket;
const sockets=[];
const checks={};
try{
  await build({configLoader:'runner',build:{outDir:'.runtime/build-save-ui',emptyOutDir:true}});
  let target;for(let i=0;i<80&&!target;i++){await sleep(100);try{target=await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`,{method:'PUT'}).then(response=>response.json())}catch{}}
  assert.ok(target,'Chrome debugging available');
  let id=0;const pending=new Map();
  const attach=async target=>{
    const connection=new WebSocket(target.webSocketDebuggerUrl);sockets.push(connection);
    await new Promise((resolve,reject)=>{connection.addEventListener('open',resolve,{once:true});connection.addEventListener('error',reject,{once:true})});
    connection.addEventListener('message',event=>{const result=JSON.parse(event.data);if(pending.has(result.id)){const entry=pending.get(result.id);pending.delete(result.id);result.error?entry.reject(Error(result.error.message)):entry.resolve(result.result)}});
    return connection;
  };
  socket=await attach(target);const primarySocket=socket;
  const call=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))});
  const evaluate=async expression=>{const value=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(value.exceptionDetails)throw Error(JSON.stringify(value.exceptionDetails));return value.result.value};
  const wait=async(check,label)=>{for(let i=0;i<100;i++){if(await check())return;await sleep(100)}throw Error('Timed out: '+label)};
  await call('Page.enable');await call('Runtime.enable');await call('Page.navigate',{url:origin});await sleep(300);
  await evaluate(`localStorage.setItem('2guys1canvas-session-${roomId}',${JSON.stringify(session.token)})`);
  await call('Page.navigate',{url:`${origin}/r/${roomId}`});
  await wait(()=>evaluate(`!!document.querySelector('.document-editor')&&!![...document.querySelectorAll('button')].find(b=>b.textContent.includes('Build my changes'))`),'workspace');
  await wait(()=>room.clients.size>0,'collaboration connection');await sleep(200);
  const browserTarget=await fetch(`http://127.0.0.1:${debugPort}/json/version`).then(response=>response.json());
  socket=await attach(browserTarget);
  const {browserContextId}=await call('Target.createBrowserContext');
  const {targetId}=await call('Target.createTarget',{url:'about:blank',browserContextId});
  const peerTarget=(await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(response=>response.json())).find(item=>item.id===targetId);
  socket=await attach(peerTarget);const peerSocket=socket;
  await call('Page.enable');await call('Runtime.enable');await call('Page.navigate',{url:origin});await sleep(300);
  await evaluate(`localStorage.setItem('2guys1canvas-session-${roomId}',${JSON.stringify(teammate.token)})`);
  await call('Page.navigate',{url:`${origin}/r/${roomId}`});
  await wait(()=>evaluate(`!!document.querySelector('.document-editor')`),'teammate workspace');
  await wait(()=>room.clients.size===2,'two participant connections');socket=primarySocket;
  console.log('Workspace ready');
  const activate=async()=>evaluate(`(()=>{const editor=document.querySelector('.document-editor');editor.focus();const button=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Build my changes'));button.click();editor.dispatchEvent(new KeyboardEvent('keydown',{key:'x',code:'KeyX',altKey:true,bubbles:true}));button.click()})()`);
  const type=async text=>{await evaluate(`document.querySelector('.document-editor').focus()`);await call('Input.insertText',{text})};
  const release=()=>{const value=held;original(value.active,value.ws,value.packet,value.binary,value.trace)};
  await type('Build a controlled catalog.');await activate();await wait(()=>flushCount===1,'flush');
  socket=peerSocket;await type(' Teammate draft must remain separate.');socket=primarySocket;
  await sleep(4_000);assert.equal(submissions.length,0);await type(' Later edit while saving.');
  assert.match(await evaluate(`document.querySelector('.document-editor').innerText`),/Later edit/);release();
  await wait(()=>submissions.length===1,'one delayed submission');await sleep(200);assert.equal(flushCount,1);assert.equal(submissions[0].actorId,session.participantId);
  const peerSequences=new Set((room.pending.get(teammate.participantId)||[]).map(item=>item.seq));
  assert.ok(peerSequences.size>0);assert.ok(submissions[0].sequences.every(seq=>!peerSequences.has(seq)));
  checks.twoParticipantsCallerOnly=true;
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
  const beforeReconnect=submissions.length;
  await evaluate(`localStorage.setItem('2guys1canvas-session-${roomId}',${JSON.stringify(session.token)})`);
  await call('Page.reload');
  await wait(()=>evaluate(`!!document.querySelector('.document-editor')`),'reopened workspace');
  await wait(()=>room.clients.size===2,'participant reconnect');await sleep(300);
  assert.equal(submissions.length,beforeReconnect);assert.match(await evaluate(`document.querySelector('.document-editor').innerText`),/Teammate draft/);checks.reconnectWithoutInference=true;
  await type(' Delete only this temporary tail.');
  await wait(()=>room.editHistory.at(-1)?.participantId===session.participantId,'insertion attributed');
  await sleep(250);const vectorBefore=room.editHistory.length;
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Backspace',code:'Backspace',windowsVirtualKeyCode:8});
  await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Backspace',code:'Backspace',windowsVirtualKeyCode:8});
  await wait(()=>room.editHistory.length>vectorBefore,'deletion attributed');
  assert.equal(submissions.length,beforeReconnect);await activate();await wait(()=>submissions.length===beforeReconnect+1,'deletion-only explicit flush');
  assert.equal(submissions.at(-1).actorId,session.participantId);checks.deletionOnlySave=true;
  assert.equal(room.providerCalls.length,0);checks.physicalCalls=0;
  console.log(JSON.stringify(checks));
}finally{
  for(const connection of sockets)connection.close();if(browser.exitCode===null){browser.kill();await new Promise(resolve=>browser.once('exit',resolve))}await instance.stop();
  assert.equal(path.dirname(dir),path.resolve(os.tmpdir()));fs.rmSync(dir,{recursive:true,force:true});
}
