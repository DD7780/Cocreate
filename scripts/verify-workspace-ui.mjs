import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const origin=process.env.COCREATE_ORIGIN||'http://localhost:5173';
const chrome='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const room=await fetch(`${origin}/api/rooms`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}).then(response=>response.json());
const session=await fetch(`${origin}/api/session`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({roomId:room.roomId,name:'UI QA'})}).then(response=>response.json());
const port=9700+process.pid%200;
const profile=path.join(os.tmpdir(),`2guys1canvas-ui-${process.pid}`);
fs.mkdirSync(profile,{recursive:true});
const browser=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--no-first-run',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
let socket;
try{
  let target;
  for(let attempt=0;attempt<80&&!target;attempt++){
    await new Promise(resolve=>setTimeout(resolve,100));
    try{target=await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'}).then(response=>response.json())}catch{}
  }
  if(!target)throw new Error('Chrome debugging endpoint unavailable');
  socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})});
  let nextId=0;
  const pending=new Map();
  socket.addEventListener('message',event=>{const result=JSON.parse(event.data);if(result.id&&pending.has(result.id)){const {resolve,reject}=pending.get(result.id);pending.delete(result.id);result.error?reject(new Error(result.error.message)):resolve(result.result)}});
  const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++nextId;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))});
  const evaluate=async expression=>(await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:origin});
  await new Promise(resolve=>setTimeout(resolve,300));
  await evaluate(`localStorage.setItem('cocreate-session-${room.roomId}',${JSON.stringify(session.token)})`);
  await call('Page.navigate',{url:`${origin}/r/${room.roomId}`});
  for(let i=0;i<50;i++){if(await evaluate("document.body.innerText.includes('Build my changes')"))break;await new Promise(resolve=>setTimeout(resolve,100))}
  const canvas=await evaluate(`({text:document.body.innerText,shortcut:!!document.querySelector('[aria-label="Build shortcut"]'),card:document.querySelector('.project-token-card')?.innerText,buildHint:document.querySelector('.build-shortcut-hint')?.innerText,width:document.documentElement.scrollWidth,viewport:innerWidth})`);
  if(!canvas.text.includes('2guys1canvas')||canvas.shortcut||!canvas.card?.includes('Recorded physical usage')||canvas.buildHint!=='Alt + X'||canvas.width>canvas.viewport)throw new Error(`Desktop canvas failed: ${JSON.stringify(canvas)}`);
  await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent.includes('View usage'))?.click()`);
  await new Promise(resolve=>setTimeout(resolve,200));
  const workflow=await evaluate(`({text:document.body.innerText,usage:document.querySelector('#workflow-usage')?.innerText})`);
  if(!workflow.usage?.includes('No build yet')||!workflow.usage?.includes('Setup tests'))throw new Error(`Workflow usage failed: ${JSON.stringify(workflow)}`);
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await new Promise(resolve=>setTimeout(resolve,200));
  const mobile=await evaluate('({width:document.documentElement.scrollWidth,viewport:innerWidth,usage:!!document.querySelector("#workflow-usage")})');
  if(mobile.width>mobile.viewport||!mobile.usage)throw new Error(`Mobile workflow failed: ${JSON.stringify(mobile)}`);
  console.log(JSON.stringify({desktop:true,mobile:true,usage:true,shortcutPickerAbsent:true}));
}finally{socket?.close();browser.kill()}
