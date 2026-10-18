// Built-client acceptance over loopback fixtures. No real provider or hosted project is used.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';
import express from 'express';
import {build} from 'vite';
import {restaurantFiles} from '../tests/fixtures/restaurant.ts';

process.env.TWOGUYS1CANVAS_AUTH_MODE='local';
process.env.VITE_TWOGUYS1CANVAS_AUTH_MODE='local';
process.env.NODE_ENV='production';
const {createTwoGuysOneCanvasServer}=await import('../server/index.ts');
const {createSession,verifySession}=await import('../server/auth.ts');
const output=path.resolve('artifacts/oct14-restore/browser');
fs.mkdirSync(output,{recursive:true});
const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'2guys1canvas-restore-ui-'));
const actors=[],prompts=[];
let builders=0;
const provider=http.createServer(async(req,res)=>{
  try{
    let raw='';for await(const chunk of req)raw+=chunk;
    const body=JSON.parse(raw),input=JSON.parse(body.input);
    let value;
    if(body.text?.format?.schema?.required?.includes('goals')){
      actors.push(input.participantName);
      const passage=input.authenticatedChanges.map(change=>change.after).join(' ');
      value={goals:[passage],features:[],design:[],constraints:[],questions:[],additions:[],modifications:[],withdrawals:[],classification:'explicit_request',affectedRequirementIds:[],sourcePassages:[passage],intents:[{text:passage,category:'goal',classification:'explicit_request',rationale:'Controlled explicit request',sourcePassage:passage,affectedRequirementIds:[]}]};
    }else{
      builders++;prompts.push(input.acceptedRequirements);
      const files=restaurantFiles();
      if(builders>1)files.find(file=>file.path==='src/App.tsx').content=files.find(file=>file.path==='src/App.tsx').content.replace('</main>','<section><h2>Contact us</h2><p>Visit Mountain Momo</p></section></main>');
      value={operations:files.map(file=>({type:'write',...file})),summary:'Controlled restaurant product',decisions:[],conflicts:[],specification:{agreed:input.acceptedRequirements.map(item=>item.description),proposed:[],questions:[]}};
    }
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}],status:'completed',usage:{input_tokens:20,output_tokens:30}}));
  }catch(error){res.writeHead(500).end(JSON.stringify({error:String(error)}));}
});
await new Promise(resolve=>provider.listen(0,'127.0.0.1',resolve));
const providerOrigin=`http://127.0.0.1:${provider.address().port}`;
const secret='synthetic-restoration-signing-secret-32-bytes';
const instance=await createTwoGuysOneCanvasServer({port:0,host:'127.0.0.1',serveClient:false,dataDir,baseUrl:providerOrigin,sessionSecret:secret,encryptionSecret:'synthetic-restoration-encryption-secret-32-bytes',buildDebounceMs:500,buildCooldownMs:0});
const html='.runtime/restore-browser.html',bundle='.runtime/build-restore-ui';
instance.app.use(express.static(path.resolve(bundle),{dotfiles:'allow'}));
instance.app.get('*path',(_req,res)=>res.sendFile(path.resolve(bundle,html),{dotfiles:'allow'}));
const {port}=await instance.start(),origin=`http://127.0.0.1:${port}`;
const post=async(route,body)=>{
  const response=await fetch(origin+route,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  assert.equal(response.status,200);return response.json();
};
const {roomId}=await post('/api/rooms',{});
const alice=await post('/api/session',{roomId,name:'Alice'}),bob=await post('/api/session',{roomId,name:'Bob'});
const room=instance.manager.get(roomId);
const aliceId=verifySession(secret,alice.token).participantId,bobId=verifySession(secret,bob.token).participantId;
const connection=await instance.manager.saveConnection(room,{name:'Loopback fixture',provider:'custom',baseUrl:providerOrigin,apiFormat:'responses',apiKey:'synthetic'});
room.ai.connections[0].checks.fixture={reachable:{status:'passed'},text:{status:'passed'},personal:{status:'passed'},builder:{status:'passed'}};
await instance.manager.assignAI(room,{connectionId:connection.id,model:'fixture'},{connectionId:connection.id,model:'fixture'});
fs.mkdirSync('.runtime',{recursive:true});
fs.writeFileSync(html,'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module" src="/.runtime/restore-browser.tsx"></script></body></html>');
fs.writeFileSync('.runtime/restore-browser.tsx',"import React from 'react';import{createRoot}from'react-dom/client';import '../src/styles.css';import '../src/studio-ivory.css';import{Workspace}from'../src/App';const root=createRoot(document.getElementById('root')!);window.mountWorkspace=(id,token)=>root.render(<Workspace id={id} tokenOverride={token}/>);");
const clients=[];
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(check,label,timeout=150_000){
  const deadline=Date.now()+timeout;
  while(Date.now()<deadline){if(await check())return;if(room.status==='Error')throw new Error(`${label}: ${room.lastError}`);await pause(100);}
  throw new Error(`${label} timed out; ${room.status}; ${room.lastError||'no build error'}`);
}
async function browser(label,token,index){
  const debugPort=9400+process.pid%100+index;
  const child=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${debugPort}`,`--user-data-dir=${path.join(dataDir,label)}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
  let target;
  for(let attempt=0;attempt<100&&!target;attempt++){await pause(100);try{target=await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`,{method:'PUT'}).then(response=>response.json());}catch{}}
  assert.ok(target,`${label} browser starts`);
  const socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
  let id=0;const pending=new Map();
  socket.addEventListener('message',event=>{const message=JSON.parse(event.data);if(pending.has(message.id)){const task=pending.get(message.id);pending.delete(message.id);message.error?task.reject(Error(message.error.message)):task.resolve(message.result);}});
  const call=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
    const key=++id;const timer=setTimeout(()=>{pending.delete(key);reject(Error(`${label}: ${method} timed out`));},15_000);
    pending.set(key,{resolve:value=>{clearTimeout(timer);resolve(value);},reject:error=>{clearTimeout(timer);reject(error);}});socket.send(JSON.stringify({id:key,method,params,...(sessionId?{sessionId}:{})}));
  });
  const evaluate=async expression=>{
    const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw new Error(`${label}: ${result.exceptionDetails.exception?.description||result.exceptionDetails.text}`);
    return result.result.value;
  };
  const client={label,child,socket,call,evaluate};clients.push(client);
  await call('Page.enable');await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:origin+'/restore-ui'});
  await until(()=>evaluate("typeof window.mountWorkspace==='function'"),`${label} built entry`);
  await evaluate(`window.mountWorkspace(${JSON.stringify(roomId)},${JSON.stringify(token)})`);
  await until(()=>evaluate("!!document.querySelector('.document-editor[contenteditable=true]')"),`${label} editor`);
  return client;
}
async function type(client,text){await client.evaluate("document.querySelector('.document-editor').focus()");await client.call('Input.insertText',{text});}
async function previewText(client){
  // A sandboxed preview may be a separate renderer target rather than a parent-frame context.
  const targets=await client.call('Target.getTargets');
  const iframe=targets.targetInfos.find(target=>target.type==='iframe'&&target.url.includes('/preview/'));
  if(iframe){
    if(client.previewTarget?.id!==iframe.targetId){
      const attached=await client.call('Target.attachToTarget',{targetId:iframe.targetId,flatten:true});
      client.previewTarget={id:iframe.targetId,sessionId:attached.sessionId};
    }
    const {sessionId}=client.previewTarget;
    const tree=await client.call('Page.getFrameTree',{},sessionId);
    const context=await client.call('Page.createIsolatedWorld',{frameId:tree.frameTree.frame.id,worldName:'trusted-restoration-check'},sessionId);
    return (await client.call('Runtime.evaluate',{expression:'document.body.innerText',contextId:context.executionContextId,returnByValue:true},sessionId)).result.value||'';
  }
  const tree=await client.call('Page.getFrameTree');
  const frame=tree.frameTree.childFrames?.find(item=>item.frame.url.includes('/preview/'));
  if(!frame)return '';
  const context=await client.call('Page.createIsolatedWorld',{frameId:frame.frame.id,worldName:'trusted-restoration-check'});
  return (await client.call('Runtime.evaluate',{expression:'document.body.innerText',contextId:context.executionContextId,returnByValue:true})).result.value||'';
}
let phase='built-entry';
try{
  await build({configLoader:'runner',build:{outDir:bundle,emptyOutDir:true,rollupOptions:{input:path.resolve(html)}}});
  phase='open-editors';
  const a=await browser('alice',alice.token,0),b=await browser('bob',bob.token,1);
  phase='type-drafts';
  await type(a,'Create a restaurant website with momos as the hero product.');
  await until(()=>room.pending.get(aliceId)?.length,'Alice draft');
  await type(b,'Maybe add a loyalty programme later.');
  await until(()=>room.pending.get(bobId)?.length,'Bob draft');
  assert.equal(actors.length+builders,0,'typing is inference-free');
  phase='first-build';
  await a.evaluate("[...document.querySelectorAll('button')].find(button=>button.textContent.includes('Build my changes')).click()");
  await until(()=>room.versions.length===1&&!room.buildTask,'first product');
  await a.evaluate("[...document.querySelectorAll('button')].find(button=>button.textContent.trim()==='Artifacts').click()");
  phase='first-preview';
  await until(async()=>(await previewText(a)).includes('Fresh momo'),'visible first artifact');
  assert.deepEqual(actors,['Alice']);assert.ok(room.pending.get(bobId)?.length);
  assert.ok(!JSON.stringify(prompts).includes('loyalty'),'unsubmitted teammate prose is excluded');
  await a.evaluate("[...document.querySelectorAll('button')].find(button=>button.textContent.trim()==='Canvas').click()");
  phase='credential-renewal';
  const renewed=createSession(secret,{...verifySession(secret,alice.token),exp:Math.floor(Date.now()/1000)+1800});
  await a.evaluate(`window.mountWorkspace(${JSON.stringify(roomId)},${JSON.stringify(renewed)})`);
  await until(()=>a.evaluate("document.querySelector('.document-editor')?.textContent.includes('momos')"),'same-account renewal preserves writing');
  await a.evaluate("const editor=document.querySelector('.document-editor');editor.focus();const range=document.createRange();range.selectNodeContents(editor);range.collapse(false);const selection=getSelection();selection.removeAllRanges();selection.addRange(range)");
  phase='incremental-build';
  await type(a,' Add a contact section.');
  await until(()=>room.pending.get(aliceId)?.length,'later Alice draft');
  await a.evaluate("document.querySelector('.document-editor').dispatchEvent(new KeyboardEvent('keydown',{key:'x',altKey:true,bubbles:true,cancelable:true}))");
  await until(()=>room.versions.length===2&&!room.buildTask,'incremental Alt+X build');
  assert.deepEqual(actors,['Alice','Alice']);assert.equal(builders,2);assert.ok(room.pending.get(bobId)?.length);
  await a.evaluate("[...document.querySelectorAll('button')].find(button=>button.textContent.trim()==='Artifacts').click()");
  phase='incremental-preview';
  await until(async()=>(await previewText(a)).includes('Contact us'),'visible incremental artifact');
  const screenshot=await a.call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(output,'desktop.png'),Buffer.from(screenshot.data,'base64'));
  await a.call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  const mobile=await a.evaluate('({width:document.documentElement.scrollWidth,viewport:innerWidth})');assert.equal(mobile.viewport,390,'mobile uses the real device viewport');assert.ok(mobile.width<=mobile.viewport+1,'mobile does not overflow');
  const phone=await a.call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(output,'mobile.png'),Buffer.from(phone.data,'base64'));
  const before=actors.length+builders;
  await a.call('Page.reload');await until(()=>a.evaluate("typeof window.mountWorkspace==='function'"),'reload entry');
  await a.evaluate(`window.mountWorkspace(${JSON.stringify(roomId)},${JSON.stringify(renewed)})`);
  await until(()=>a.evaluate("document.querySelector('.document-editor')?.textContent.includes('loyalty')"),'reloaded shared document');
  await pause(300);assert.equal(actors.length+builders,before,'reload does not infer');
  const checks={firstArtifact:true,incrementalArtifact:true,buttonAndAltX:true,callerOnly:true,teammateDraftRetained:true,typingInferenceFree:true,renewalPreservesWriting:true,reloadInferenceFree:true,interpreterCalls:actors.length,builderCalls:builders,paidCalls:0,mobile};
  fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify(checks,null,2));console.log(JSON.stringify(checks));
}catch(error){
  console.error(JSON.stringify({phase,error:error.message,status:room.status,versions:room.versions.map(item=>item.id),actors,builders}));
  throw error;
}finally{
  for(const client of clients){await client.call('Browser.close').catch(()=>{});client.socket.close();client.child.kill();}
  await instance.stop();provider.closeAllConnections();await new Promise(resolve=>provider.close(resolve));
}
