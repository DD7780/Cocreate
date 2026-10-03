import{spawn}from'node:child_process';import fs from'node:fs';import os from'node:os';import path from'node:path';
import{createCoCreateServer}from'../server/index.js';import{createSession}from'../server/auth.js';
import type{ConflictGroup}from'../shared/types.js';

const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'cocreate-conflict-ui-')),secret='conflict-ui-test';
const service=await createCoCreateServer({port:0,host:'127.0.0.1',serveClient:true,dataDir,sessionSecret:secret});
const room=service.manager.create('conflict-ui-room');service.manager.join(room,'alice','Alice');service.manager.join(room,'bob','Bob');
const group:ConflictGroup={id:'conflict-header',revision:1,round:1,subject:'header',scope:'global',requirementIds:[],alternatives:[{id:'red',label:'Red header',requirementIds:[],requirementRevisions:[],sources:[]},{id:'green',label:'Green header',requirementIds:[],requirementRevisions:[],sources:[]}],requiredResolverIds:['alice','bob'],selections:[],state:'awaiting_choices',detectionStatus:'confirmed',explanation:'Choose one header color.',affectedBuildScopes:[],history:[],createdAt:'2026-09-01T00:00:00Z',updatedAt:'2026-09-01T00:00:00Z'};
room.conflictGroups=[group];service.manager.save(room);
const{url}=await service.start(),token=createSession(secret,{roomId:room.id,participantId:'alice',name:'Alice',role:'editor'}),chrome='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',port=9800+process.pid%150,profile=path.join(os.tmpdir(),`cocreate-conflict-browser-${process.pid}`);
fs.mkdirSync(profile,{recursive:true});const browser=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--no-first-run',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
let socket:WebSocket|undefined;
try{
  let target:any;
  for(let i=0;i<80&&!target;i++){await new Promise(resolve=>setTimeout(resolve,100));try{target=await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'}).then(response=>response.json())}catch{}}
  if(!target)throw new Error('Chrome debugging endpoint unavailable');
  socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise<void>((resolve,reject)=>{socket!.addEventListener('open',()=>resolve(),{once:true});socket!.addEventListener('error',()=>reject(new Error('Chrome WebSocket failed')),{once:true})});
  let id=0;const pending=new Map<number,{resolve:(value:any)=>void;reject:(error:Error)=>void}>();socket.addEventListener('message',event=>{const result=JSON.parse(String(event.data));if(result.id&&pending.has(result.id)){const task=pending.get(result.id)!;pending.delete(result.id);result.error?task.reject(new Error(result.error.message)):task.resolve(result.result)}});
  const call=(method:string,params:Record<string,unknown>={})=>new Promise<any>((resolve,reject)=>{const next=++id;pending.set(next,{resolve,reject});socket!.send(JSON.stringify({id:next,method,params}))});
  const evaluate=async(expression:string)=>{const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});return result.result.value};
  await call('Page.enable');await call('Runtime.enable');await call('Page.navigate',{url});await new Promise(resolve=>setTimeout(resolve,250));
  await evaluate(`localStorage.setItem('cocreate-session-${room.id}',${JSON.stringify(token)})`);await call('Page.navigate',{url:`${url}/r/${room.id}`});
  for(let i=0;i<80;i++){if(await evaluate("document.body.innerText.includes('Build my changes')"))break;await new Promise(resolve=>setTimeout(resolve,100))}
  await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent.includes('Review items'))?.click()`);
  const form=await evaluate(`({radioCount:document.querySelectorAll('.conflict-choice input[type=radio]').length,legend:document.querySelector('.conflict-choice legend')?.textContent,button:document.querySelector('.conflict-choice button[type=submit]')?.textContent})`);
  if(form.radioCount!==3||!form.legend?.includes('header')||!form.button?.includes('Save my choice'))throw new Error(`Conflict control missing: ${JSON.stringify({form,debug:await evaluate("({text:document.body.innerText.slice(0,1800),buttons:[...document.querySelectorAll('button')].map(button=>button.textContent).slice(0,30)})")})}`);
  await evaluate(`document.querySelector('.conflict-choice input[value=red]').click();document.querySelector('.conflict-choice button[type=submit]').click()`);
  for(let i=0;i<40;i++){if(room.conflictGroups[0].selections.length)break;await new Promise(resolve=>setTimeout(resolve,100))}
  if(room.conflictGroups[0].selections[0]?.alternativeId!=='red')throw new Error('Browser choice was not saved');
  console.log(JSON.stringify({accessibleRadios:form.radioCount,choiceSaved:true}));
}finally{socket?.close();browser.kill();await service.stop()}
