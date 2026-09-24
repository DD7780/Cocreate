import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const origin=(process.env.COCREATE_LIVE_ORIGIN||'').replace(/\/$/,'');
if(!origin)throw new Error('Set COCREATE_LIVE_ORIGIN to the deployed CoCreate origin.');
const chrome='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const json=async(pathname,body)=>{const response=await fetch(`${origin}${pathname}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const value=await response.json();if(!response.ok)throw new Error(`${pathname} returned ${response.status}`);return value};
const created=await json('/api/rooms',{}),roomId=created.roomId;
const ram=await json('/api/session',{roomId,name:'Live Browser Ram'}),sham=await json('/api/session',{roomId,name:'Live Browser Sham'});

async function browser(label,token,port){
  const profile=path.join(os.tmpdir(),`cocreate-live-${label}-${process.pid}-${Date.now()}`);fs.mkdirSync(profile,{recursive:true});
  const processHandle=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-gpu-sandbox','--disable-gpu-compositing','--disable-software-rasterizer','--disable-features=Vulkan','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
  try{
  let target;
  for(let attempt=0;attempt<80&&!target;attempt++){await new Promise(resolve=>setTimeout(resolve,100));try{target=await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'}).then(response=>response.json())}catch{}}
  if(!target)throw new Error(`${label} Chrome debugging endpoint did not start.`);
  const socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})});
  let id=0;const pending=new Map();socket.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.id&&pending.has(message.id)){const task=pending.get(message.id);pending.delete(message.id);message.error?task.reject(new Error(message.error.message)):task.resolve(message.result)}});
  const call=(method,params={})=>new Promise((resolve,reject)=>{const callId=++id,timer=setTimeout(()=>{pending.delete(callId);reject(new Error(`${label} ${method} timed out.`))},45_000);pending.set(callId,{resolve:value=>{clearTimeout(timer);resolve(value)},reject});socket.send(JSON.stringify({id:callId,method,params}))});
  const evaluate=async expression=>(await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
  await call('Page.enable');await call('Runtime.enable');await call('Network.enable');
  await call('Page.addScriptToEvaluateOnNewDocument',{source:`{const NativeWebSocket=globalThis.WebSocket;globalThis.__cocreateTestSockets=[];globalThis.__blockCocreateTestSocket=false;globalThis.WebSocket=new Proxy(NativeWebSocket,{construct(target,args){const socket=new target(globalThis.__blockCocreateTestSocket?'ws://127.0.0.1:9':args[0],args[1]);globalThis.__cocreateTestSockets.push(socket);return socket}})}`});
  await call('Page.navigate',{url:origin});await new Promise(resolve=>setTimeout(resolve,350));
  await evaluate(`localStorage.setItem('cocreate-session-${roomId}',${JSON.stringify(token)});localStorage.setItem('cocreate-name',${JSON.stringify(label)})`);await call('Page.navigate',{url:`${origin}/r/${roomId}`});
  return{processHandle,socket,call,evaluate,close(){socket.close();processHandle.kill()}};
  }catch(error){processHandle.kill();throw error}
}

const waitFor=async(label,check,timeout=20_000)=>{const started=Date.now();while(Date.now()-started<timeout){if(await check())return;await new Promise(resolve=>setTimeout(resolve,100))}throw new Error(`${label} timed out.`)};
const type=async(client,text)=>{await client.evaluate(`document.querySelector('.document-editor')?.focus()`);await client.call('Input.insertText',{text})};
const clients=[];
try{
  const portBase=9600+(process.pid%200),first=await browser('Ram',ram.token,portBase);clients.push(first);const second=await browser('Sham',sham.token,portBase+1);clients.push(second);
  await Promise.all([waitFor('Ram connected',async()=>await first.evaluate(`!!document.querySelector('.document-editor')&&!document.querySelector('.connection-banner')`)),waitFor('Sham connected',async()=>await second.evaluate(`!!document.querySelector('.document-editor')&&!document.querySelector('.connection-banner')`))]);
  await type(first,'Ram live edit. ');await waitFor('Ram to Sham sync',async()=>String(await second.evaluate(`document.querySelector('.document-editor')?.innerText||''`)).includes('Ram live edit.'));
  await type(second,'Sham live edit. ');await waitFor('Sham to Ram sync',async()=>String(await first.evaluate(`document.querySelector('.document-editor')?.innerText||''`)).includes('Sham live edit.'));
  const usageBefore=(await fetch(`${origin}/api/rooms/${roomId}/state`,{headers:{Authorization:`Bearer ${ram.token}`}}).then(response=>response.json())).usage.requests;
  const tracked=await first.evaluate(`({count:globalThis.__cocreateTestSockets?.length||0,states:(globalThis.__cocreateTestSockets||[]).map(socket=>socket.readyState)})`);
  if(!tracked.count||!tracked.states.includes(1))throw new Error(`Test harness did not capture the active WebSocket: ${JSON.stringify(tracked)}`);
  await first.evaluate(`globalThis.__blockCocreateTestSocket=true;globalThis.__cocreateTestSockets.findLast(socket=>socket.readyState===1)?.close()`);
  await waitFor('disconnect state',async()=>String(await first.evaluate(`document.body.innerText`)).includes('Live collaboration disconnected'));
  await type(first,'Ram offline edit. ');await first.evaluate(`(()=>{const editor=document.querySelector('.document-editor');return editor.dispatchEvent(new KeyboardEvent('keydown',{key:'x',altKey:true,bubbles:true,cancelable:true}))})()`);
  await waitFor('disconnected build block',async()=>String(await first.evaluate(`document.body.innerText`)).includes('Your in-memory edits are retained'));
  await first.evaluate(`globalThis.__blockCocreateTestSocket=false`);
  await waitFor('Ram reconnect',async()=>!(await first.evaluate(`!!document.querySelector('.connection-banner')`)),30_000);
  await waitFor('offline edit recovery',async()=>String(await second.evaluate(`document.querySelector('.document-editor')?.innerText||''`)).includes('Ram offline edit.'),30_000);
  const usageAfter=(await fetch(`${origin}/api/rooms/${roomId}/state`,{headers:{Authorization:`Bearer ${ram.token}`}}).then(response=>response.json())).usage.requests;
  if(usageAfter!==usageBefore)throw new Error('Collaboration recovery unexpectedly triggered an AI request.');
  console.log(JSON.stringify({twoBrowserParticipants:true,bidirectionalSync:true,disconnectedBuildBlocked:true,reconnected:true,offlineEditRecovered:true,modelCallsDuringRecovery:usageAfter-usageBefore}));
}finally{for(const client of clients)client.close()}
