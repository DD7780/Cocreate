import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const origin=process.env.COCREATE_ORIGIN||'http://localhost:5173';
const profile=path.join(os.tmpdir(),`cocreate-browser-smoke-${process.pid}-${Date.now()}`);
const debugPort=9300+(process.pid%300);
const chrome='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
fs.mkdirSync(profile,{recursive:true});

const created=await fetch(`${origin}/api/rooms`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}).then(response=>response.json());
const roomId=created.roomId;
const session=await fetch(`${origin}/api/session`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({roomId,name:'Browser QA'})}).then(response=>response.json());
const browser=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-gpu-sandbox','--disable-gpu-compositing','--disable-software-rasterizer','--disable-features=Vulkan','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${debugPort}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});
let browserErrors='';
browser.stderr.on('data',chunk=>{browserErrors=(browserErrors+chunk).slice(-4000)});
let socket;

try{
  let target;
  for(let attempt=0;attempt<50&&!target;attempt++){
    await new Promise(resolve=>setTimeout(resolve,100));
    try{target=await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`,{method:'PUT'}).then(response=>response.json())}catch{}
  }
  if(!target)throw new Error('Chrome debugging endpoint did not start');
  socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})});
  let id=0;
  const pending=new Map();
  const exceptions=[];
  const call=(method,params={})=>new Promise((resolve,reject)=>{const callId=++id;const timer=setTimeout(()=>{pending.delete(callId);reject(new Error(`Chrome protocol timed out during ${method}. ${browserErrors}`))},15_000);pending.set(callId,{resolve:value=>{clearTimeout(timer);resolve(value)},reject:error=>{clearTimeout(timer);reject(error)}});socket.send(JSON.stringify({id:callId,method,params}))});
  socket.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.method==='Runtime.exceptionThrown'){const detail=message.params.exceptionDetails;exceptions.push(detail.exception?.description||detail.text)}if(message.id&&pending.has(message.id)){const task=pending.get(message.id);pending.delete(message.id);message.error?task.reject(new Error(message.error.message)):task.resolve(message.result)}});
  socket.addEventListener('close',()=>{for(const task of pending.values())task.reject(new Error(`Chrome debugging socket closed. ${browserErrors}`));pending.clear()});
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:origin});
  await new Promise(resolve=>setTimeout(resolve,500));
  await call('Runtime.evaluate',{expression:`localStorage.setItem('cocreate-session-${roomId}',${JSON.stringify(session.token)});localStorage.setItem('cocreate-name','Browser QA');localStorage.removeItem('cocreate-build-shortcut')`});
  await call('Page.navigate',{url:`${origin}/r/${roomId}`});
  const evaluate=async expression=>(await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
  let text='';
  for(let attempt=0;attempt<40&&!text.includes('AI setup');attempt++){await new Promise(resolve=>setTimeout(resolve,100));text=await evaluate('document.body.innerText')}
  if(!text.includes('AI setup')||!text.includes('Generation is paused')){
    const diagnostic=await evaluate(`Promise.race([fetch('/api/rooms/${roomId}/state?token=${encodeURIComponent(session.token)}').then(async response=>({status:response.status,body:await response.text(),stored:localStorage.getItem('cocreate-session-${roomId}'),path:location.pathname})).catch(error=>({error:String(error)})),new Promise(resolve=>setTimeout(()=>resolve({error:'diagnostic timeout'}),2000))])`);
    throw new Error(`Workspace connection controls did not render: ${text||'empty document'}; exceptions=${exceptions.join('; ')||'none'}; ${JSON.stringify(diagnostic)}`);
  }

  for(const mode of['Developer','Analyst','Researcher'])if(!text.includes(mode))throw new Error(`Recommended setup is missing ${mode}: ${text}`);
  for(const removed of['General app','Engineer','Designer','Web developer','Motion designer'])if(text.includes(removed))throw new Error(`Legacy specialty remains user-facing: ${removed}`);
  const recommendedText=text.toLowerCase();
  if(!text.includes('Your API powers Recommended')||!text.includes('Know the ceiling before you build')||!recommendedText.includes('this build')||!recommendedText.includes('room spend')||!recommendedText.includes('limit')||!text.includes('Model rates')||!text.includes('validated data ingestion')||!text.includes('retrieval, source capture')||!text.includes('Connect your API'))throw new Error(`Recommended API-powered setup is incomplete: ${text}`);
  const setupSemantics=await evaluate(`({modes:[...document.querySelectorAll('[aria-label="CoCreate mode"] [role="radio"]')].map(node=>({label:node.textContent,checked:node.getAttribute('aria-checked')})),modalHasEffort:!!document.querySelector('[role="dialog"] [aria-label*="AI effort"]'),limitLabel:document.querySelector('input[aria-label="Spending limit (USD)"]')?.getAttribute('aria-label')})`);
  if(setupSemantics.modes.length!==3||setupSemantics.modes.filter(item=>item.checked==='true').length!==1||setupSemantics.modalHasEffort||setupSemantics.limitLabel!=='Spending limit (USD)')throw new Error(`Recommended selection semantics failed: ${JSON.stringify(setupSemantics)}`);
  if(process.env.COCREATE_RECOMMENDED_SCREENSHOT){
    const capture=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
    fs.writeFileSync(process.env.COCREATE_RECOMMENDED_SCREENSHOT,Buffer.from(capture.data,'base64'));
  }
  const unavailableMode=await evaluate(`(async()=>{[...document.querySelectorAll('button')].find(button=>button.textContent.includes('Analyst')).click();await new Promise(resolve=>setTimeout(resolve,250));const use=[...document.querySelectorAll('button')].find(button=>button.textContent.includes('Use Analyst'));return{disabled:use?.disabled,text:document.body.innerText}})()`);
  if(!unavailableMode.disabled||!unavailableMode.text.includes('validated data ingestion and isolated reproducible computation are not implemented'))throw new Error('Analyst did not remain explicitly unavailable');
  await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent.includes('Developer')).click()`);
  await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent.includes('Connect your API')).click()`);
  await new Promise(resolve=>setTimeout(resolve,250));
  text=await evaluate('document.body.innerText');
  if(!text.toLowerCase().includes('bring your own key · advanced')||!text.includes('API key')||!text.includes('may consume provider usage')||!text.includes('View recommended setup')||text.includes('Try demo'))throw new Error(`Owner API panel is incomplete or still exposes demo UI: ${text}`);
  if(process.env.COCREATE_SCREENSHOT){
    const capture=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
    fs.writeFileSync(process.env.COCREATE_SCREENSHOT,Buffer.from(capture.data,'base64'));
  }
  const dialogIgnored=await evaluate(`(()=>{const input=document.querySelector('[role="dialog"] input');input.focus();return input.dispatchEvent(new KeyboardEvent('keydown',{key:'x',altKey:true,bubbles:true,cancelable:true}))})()`);
  if(!dialogIgnored)throw new Error('Dialog incorrectly handled Alt+X');
  await evaluate(`[...document.querySelectorAll('button')].find(button=>button.getAttribute('aria-label')==='Close API connections').click()`);
  const canvasEffort=await evaluate(`(()=>{const group=document.querySelector('fieldset[aria-label="AI effort beside canvas"]'),options=[...group?.querySelectorAll('input[type="radio"]')||[]].map(option=>({label:option.parentElement?.innerText,value:option.value,checked:option.checked}));return{disabled:group?.disabled,options}})()`);
  if(canvasEffort.options.length!==4||canvasEffort.options.filter(item=>item.checked).map(item=>item.value).join()!=='medium'||!canvasEffort.disabled||canvasEffort.options.map(item=>item.label).join('|')!=='Low|Medium|High|Extra')throw new Error(`Segmented AI effort control did not render safely while Recommended is inactive: ${JSON.stringify(canvasEffort)}`);
  const workflowOverview=await evaluate(`(()=>{const panel=document.querySelector('.workflow-compact');return{text:panel?.textContent||'',summary:panel?.querySelector('summary')?.textContent||''}})()`);
  if(!workflowOverview.summary.includes('draft')||!workflowOverview.text.includes('No submitted work is planned yet'))throw new Error(`Durable workflow overview is incomplete: ${JSON.stringify(workflowOverview)}`);
  if(process.env.COCREATE_WORKSPACE_SCREENSHOT){
    const capture=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
    fs.writeFileSync(process.env.COCREATE_WORKSPACE_SCREENSHOT,Buffer.from(capture.data,'base64'));
  }

  const shortcut=await evaluate(`(()=>{const button=[...document.querySelectorAll('button')].find(item=>item.textContent.includes('Build my changes'));const editor=document.querySelector('.document-editor');const metadata={aria:button?.getAttribute('aria-keyshortcuts'),title:button?.getAttribute('title')};editor.focus();const handled=!editor.dispatchEvent(new KeyboardEvent('keydown',{key:'x',altKey:true,bubbles:true,cancelable:true}));return{...metadata,handled,focused:document.activeElement===editor}})()`);
  await new Promise(resolve=>setTimeout(resolve,150));
  text=await evaluate('document.body.innerText');
  if(shortcut.aria!=='Alt+X'||!shortcut.title.includes('Alt + X')||!shortcut.handled||!shortcut.focused||!text.includes('Connect an AI model before submitting changes.'))throw new Error('Editor Alt+X metadata, handling, focus, or shared availability explanation failed');

  const remap=await evaluate(`(async()=>{const select=document.querySelector('[aria-label="Build shortcut"]');const setter=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set;setter.call(select,'alt+s');select.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(resolve=>setTimeout(resolve,50));const editor=document.querySelector('.document-editor');const oldHandled=!editor.dispatchEvent(new KeyboardEvent('keydown',{key:'x',altKey:true,bubbles:true,cancelable:true}));const newHandled=!editor.dispatchEvent(new KeyboardEvent('keydown',{key:'s',altKey:true,bubbles:true,cancelable:true}));return{oldHandled,newHandled}})()`);
  if(remap.oldHandled||!remap.newHandled)throw new Error('Remapped shortcut preference was not respected');

  await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent.includes('Artifacts')).click()`);
  await new Promise(resolve=>setTimeout(resolve,200));
  text=await evaluate('document.body.innerText');
  if(!text.includes('Connect an AI model to generate your app.'))throw new Error('Disconnected Product state is incorrect');
  if(process.env.COCREATE_PRODUCT_SCREENSHOT){
    const capture=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
    fs.writeFileSync(process.env.COCREATE_PRODUCT_SCREENSHOT,Buffer.from(capture.data,'base64'));
  }
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await new Promise(resolve=>setTimeout(resolve,200));
  const metrics=await evaluate('({width:document.documentElement.scrollWidth,viewport:innerWidth,text:document.body.innerText})');
  if(metrics.width>metrics.viewport||!metrics.text.includes('Artifacts'))throw new Error('Mobile workspace overflow or navigation failure');
  await evaluate(`localStorage.setItem('cocreate-session-${roomId}','invalid-session')`);
  await call('Page.navigate',{url:`${origin}/r/${roomId}`});
  let invalidText='';
  for(let attempt=0;attempt<120&&!invalidText.includes('Rejoin room');attempt++){await new Promise(resolve=>setTimeout(resolve,100));invalidText=await evaluate('document.body.innerText')}
  if(!invalidText.includes('participant session expired or is invalid')||!invalidText.includes('Rejoin room'))throw new Error(`Invalid session did not render an actionable terminal state: ${invalidText}`);
  console.log(JSON.stringify({roomId,ownerPanel:true,altXEditorOnly:true,remap:true,editorFocusPreserved:true,productEmptyState:true,invalidSessionActionable:true,mobileWidth:metrics.width,viewport:metrics.viewport}));
}finally{
  socket?.close();
  browser.kill();
}
