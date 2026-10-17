// Synthetic local browser/storage evidence; no hosted account, email or inference.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn,spawnSync} from 'node:child_process';
import express from 'express';
import {build as bundle} from 'esbuild';
import {build} from 'vite';
import vm from 'node:vm';
import {previewDocument} from '../server/preview.ts';
process.env.TWOGUYS1CANVAS_AUTH_MODE='local';
process.env.NODE_ENV='production';
const {createTwoGuysOneCanvasServer}=await import('../server/index.ts');
const output=path.resolve('artifacts/product-name-cleanup/browser');
fs.mkdirSync(output,{recursive:true});
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'2guys1canvas-name-ui-'));
const service=await createTwoGuysOneCanvasServer({port:0,host:'127.0.0.1',serveClient:false,dataDir:dir,sessionSecret:'synthetic',encryptionSecret:'synthetic'});
let hosted=false;
service.app.use((req,res,next)=>express.static(path.resolve(hosted?'.runtime/product-name-hosted':'.runtime/product-name-ui'),{dotfiles:'allow'})(req,res,next));
service.app.get('*path',(_req,res)=>res.sendFile(path.resolve(hosted?'.runtime/product-name-hosted/index.html':'.runtime/product-name-ui/index.html'),{dotfiles:'allow'}));
const {url:origin}=await service.start();
const post=(url,body)=>fetch(origin+url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(r=>r.json());
const {roomId}=await post('/api/rooms',{}),session=await post('/api/session',{roomId,name:'Naming QA'});
const bridge=await bundle({stdin:{contents:`import * as Y from 'yjs'; import {browserDraftStore,draftKey} from './src/local-drafts.ts'; import {clearProjectSessionCache} from './src/browser-storage.ts'; import {previewMessageKind,previewInitType} from './shared/preview-protocol.ts'; window.namingTest={Y,browserDraftStore,draftKey,clearProjectSessionCache,previewMessageKind,previewInitType};`,resolveDir:process.cwd()},bundle:true,write:false,format:'iife'});
const baseline=spawnSync('git',['show','ae3653b:server/preview.ts'],{encoding:'utf8',windowsHide:true});assert.equal(baseline.status,0);
const legacyPreview=vm.runInNewContext(baseline.stdout.replace('export function previewDocument(bundle:string,css:string)','function previewDocument(bundle,css)')+';previewDocument');
const previewCode="localStorage.setItem('restored',localStorage.getItem('kept'));";
const frames={legacy:legacyPreview(previewCode,''),current:previewDocument(previewCode,'')};
const debugPort=9700+process.pid%200;
const browser=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disable-gpu','--no-first-run',`--remote-debugging-port=${debugPort}`,`--user-data-dir=${path.join(dir,'chrome')}`,'about:blank'],{stdio:'ignore',windowsHide:true});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let socket;
const checks={scope:'Built local UI; synthetic authenticated room/account and real browser storage. No hosted service, live email or provider calls.'};
try{
  process.env.VITE_TWOGUYS1CANVAS_AUTH_MODE='local';
  await build({configLoader:'runner',build:{outDir:'.runtime/product-name-ui',emptyOutDir:true}});
  process.env.VITE_TWOGUYS1CANVAS_AUTH_MODE='supabase';
  process.env.VITE_SUPABASE_URL='https://naming.supabase.co';
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY='sb_publishable_synthetic';
  process.env.VITE_TWOGUYS1CANVAS_APP_ORIGIN=origin;
  await build({configLoader:'runner',build:{outDir:'.runtime/product-name-hosted',emptyOutDir:true}});
  let target;for(let i=0;i<80&&!target;i++){await sleep(100);try{target=await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`,{method:'PUT'}).then(r=>r.json())}catch{}}
  assert.ok(target,'Chrome debugging available');socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})});
  let id=0;const pending=new Map();socket.addEventListener('message',event=>{const result=JSON.parse(event.data);const entry=pending.get(result.id);if(entry){pending.delete(result.id);result.error?entry.reject(Error(result.error.message)):entry.resolve(result.result)}});
  const call=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))});
  const evaluate=async expression=>{const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value};
  const until=async expression=>{for(let i=0;i<120;i++){try{if(await evaluate(expression))return}catch(error){if(!/navigated|context.*destroyed|Cannot find context/i.test(String(error)))throw error}await sleep(100)}throw Error('Timeout: '+expression)};
  const screenshot=async name=>fs.writeFileSync(path.join(output,name+'.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
  const scan=async name=>{const findings=await evaluate(`(()=>{const copy=document.body.cloneNode(true);copy.querySelectorAll('.document-editor,script,style').forEach(node=>node.remove());return {title:document.title,matches:[copy.innerText||copy.textContent,...[...copy.querySelectorAll('[aria-label],[title],img[alt]')].map(node=>node.getAttribute('aria-label')||node.title||node.alt)].filter(text=>/co[-_ ]?create/i.test(text))}})()`);assert.deepEqual(findings.matches,[],name+' visible/accessible platform copy');assert.match(findings.title,/2guys1canvas/);checks[name]=true;await screenshot(name)};
  await call('Page.enable');await call('Runtime.enable');await call('Network.enable');
  await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await call('Network.setBlockedURLs',{urls:['https://*.supabase.co/*','https://fonts.googleapis.com/*','https://fonts.gstatic.com/*']});
  await call('Page.addScriptToEvaluateOnNewDocument',{source:bridge.outputFiles[0].text});
  await call('Page.navigate',{url:origin});await until(`!!document.querySelector('.landing h1')`);await scan('landing');
  // Seed the original session and IndexedDB record, without altering the canonical server document.
  await evaluate(`(async()=>{const {Y,draftKey}=namingTest;const doc=new Y.Doc(),p=new Y.XmlElement('paragraph'),text=new Y.XmlText();text.insert(0,'Legacy CoCreate authored restaurant');p.insert(0,[text]);doc.getXmlFragment('default').insert(0,[p]);const key=draftKey(${JSON.stringify(roomId)},${JSON.stringify(session.participantId)});await new Promise((resolve,reject)=>{const r=indexedDB.open('cocreate-drafts-v1',1);r.onupgradeneeded=()=>r.result.createObjectStore('documents');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction('documents','readwrite');tx.objectStore('documents').put(Y.encodeStateAsUpdate(doc),key);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>reject(tx.error)}});localStorage.setItem('cocreate-session-${roomId}',${JSON.stringify(session.token)})})()`);
  await call('Page.navigate',{url:origin+'/r/'+roomId});
  await until(`document.querySelector('.document-editor')?.innerText.includes('Legacy CoCreate authored restaurant')`);
  await scan('canvas');checks.legacyAuthenticatedReopen=true;
  await evaluate(`document.querySelector('.document-editor').focus()`);await call('Input.insertText',{text:' Retained new edit. '});
  await until(`document.querySelector('.doc-meta')?.textContent.includes('Saved on this device')`);
  // Exercise actual IndexedDB transactions, deletion sets, concurrent writers, actor scoping and corruption.
  checks.indexedDB=await evaluate(`(async()=>{
    const {Y,browserDraftStore,draftKey,clearProjectSessionCache}=namingTest;
    const raw=async(name,key,value)=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open(name,1);r.onupgradeneeded=()=>r.result.createObjectStore('documents');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{return await new Promise((resolve,reject)=>{const tx=db.transaction('documents',value===undefined?'readonly':'readwrite'),s=tx.objectStore('documents'),r=value===undefined?s.get(key):s.put(value,key);tx.oncomplete=()=>resolve(r.result);tx.onabort=tx.onerror=()=>reject(tx.error)})}finally{db.close()}};
    const text=bytes=>{const d=new Y.Doc();Y.applyUpdate(d,bytes);return d.getXmlFragment('default').toString()};
    const active=draftKey(${JSON.stringify(roomId)},${JSON.stringify(session.participantId)});
    for(const name of ['2guys1canvas-drafts-v1','cocreate-drafts-v1']){const value=text(await raw(name,active));if(!value.includes('Retained new edit.')||!value.includes('CoCreate'))throw Error('Draft lost in '+name)}
    if(await browserDraftStore.read(draftKey(${JSON.stringify(roomId)},'another-actor'))!==undefined)throw Error('Actor key crossed');
    const key=draftKey('legacy-fixture','actor'),old=new Y.Doc();old.getText('value').insert(0,'keep delete');await raw('cocreate-drafts-v1',key,Y.encodeStateAsUpdate(old));
    await browserDraftStore.read(key);const vector=Y.encodeStateVector(old);old.getText('value').delete(4,7);await raw('cocreate-drafts-v1',key,Y.mergeUpdates([await raw('cocreate-drafts-v1',key),Y.encodeStateAsUpdate(old,vector)]));
    const reopened=new Y.Doc();Y.applyUpdate(reopened,await browserDraftStore.read(key));if(reopened.getText('value').toString()!=='keep')throw Error('Deletion lost');
    const a=new Y.Doc(),b=new Y.Doc();a.getText('a').insert(0,'A');b.getText('b').insert(0,'B');await Promise.all([browserDraftStore.merge(key,Y.encodeStateAsUpdate(a)),browserDraftStore.merge(key,Y.encodeStateAsUpdate(b))]);
    const concurrent=new Y.Doc();Y.applyUpdate(concurrent,await browserDraftStore.read(key));if(concurrent.getText('a').toString()!=='A'||concurrent.getText('b').toString()!=='B')throw Error('Concurrent merge lost');
    const bad='corrupt-original';await raw('cocreate-drafts-v1',bad,new Uint8Array([255]));let rejected=false;try{await browserDraftStore.read(bad)}catch{rejected=true}if(!rejected||(await raw('cocreate-drafts-v1',bad))[0]!==255||await raw('2guys1canvas-drafts-v1',bad)!==undefined)throw Error('Corrupt original changed');
    rejected=false;try{await browserDraftStore.merge(key,new Uint8Array(8*1024*1024+1))}catch{rejected=true}if(!rejected)throw Error('Oversize accepted');
    const quotaKey='quota-fixture',quotaDoc=new Y.Doc();quotaDoc.getText('value').insert(0,'preserve');await raw('cocreate-drafts-v1',quotaKey,Y.encodeStateAsUpdate(quotaDoc));
    const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){if(this.transaction.db.name==='2guys1canvas-drafts-v1')throw new DOMException('Synthetic quota','QuotaExceededError');return put.apply(this,args)};
    rejected=false;try{await browserDraftStore.read(quotaKey)}catch{rejected=true}finally{IDBObjectStore.prototype.put=put}if(!rejected||await raw('2guys1canvas-drafts-v1',quotaKey)!==undefined)throw Error('Quota failure not preserved');
    for(const prefix of ['cocreate','2guys1canvas']){localStorage.setItem(prefix+'-session-test','owned');localStorage.setItem(prefix+'-product-storage-test','owned')}localStorage.setItem('user-owned','CoCreate user content');clearProjectSessionCache(localStorage,sessionStorage);if(Object.keys(localStorage).some(k=>/^(cocreate|2guys1canvas)-(session-|product-storage-)/.test(k))||localStorage.getItem('user-owned')!=='CoCreate user content')throw Error('Signout ownership');
    return {restoredBoth:true,deletionOnly:true,concurrentMerge:true,actorScoped:true,corruptionRetained:true,oversizeRejected:true,quotaOriginalRetained:true,signOutBothNamespaces:true};
  })()`);
  for(const [label,button] of [['workflow','Workflow'],['artifacts','Artifacts']]){await evaluate(`(()=>{[...document.querySelectorAll('.tabs button')].find(b=>b.textContent.includes('${button}')).click()})()`);await sleep(200);await scan(label)}
  checks.previewMatrix=[];
  for(const parent of ['legacy','current'])for(const frame of ['legacy','current']){
    const result=await evaluate(`new Promise((resolve,reject)=>{const frame=document.createElement('iframe');frame.sandbox='allow-scripts';const timeout=setTimeout(()=>{cleanup();reject(Error('Preview handshake timeout'))},3000);function cleanup(){clearTimeout(timeout);removeEventListener('message',receive);frame.remove()}function receive(event){if(event.source!==frame.contentWindow)return;const type=event.data?.type,kind=${JSON.stringify(parent)}==='current'?namingTest.previewMessageKind(type):type==='cocreate-storage-ready'?'storage-ready':type==='cocreate-storage-set'?'storage-set':null;if(kind==='storage-ready')frame.contentWindow.postMessage({type:${JSON.stringify(parent)}==='current'?namingTest.previewInitType(type):'cocreate-storage-init',values:{kept:'retained user value'}},'*');if(kind==='storage-set'&&event.data.key==='restored'){cleanup();resolve(event.data.value)}}addEventListener('message',receive);frame.srcdoc=${JSON.stringify(frames[frame])};document.body.append(frame)})`);
    assert.equal(result,'retained user value');checks.previewMatrix.push(parent+' parent / '+frame+' frame');
  }
  await evaluate(`document.querySelector('.api-connections').click()`);await until(`!!document.querySelector('[role=dialog],.modal')`);await scan('builder');
  // Switch to the actual hosted-auth client bundle with a synthetic SDK session and local response fixtures.
  hosted=true;
  await call('Page.addScriptToEvaluateOnNewDocument',{source:`const realFetch=window.fetch;window.fetch=(input,init)=>{const url=String(input);let body;if(url==='/api/beta/access')body={approved:true};if(url==='/api/beta/request')body={approved:true,reviewer:false,revoked:false,request:null,resubmitAt:null};if(url==='/api/projects?limit=50')body={projects:[],total:0,nextOffset:null};return body?Promise.resolve(new Response(JSON.stringify(body),{headers:{'Content-Type':'application/json'}})):realFetch(input,init)};`});
  await call('Page.navigate',{url:origin+'/login'});await until(`!!document.querySelector('.auth-form')`);await scan('auth');
  await evaluate(`localStorage.setItem('sb-naming-auth-token',JSON.stringify({access_token:'synthetic',refresh_token:'synthetic-refresh',expires_at:Math.floor(Date.now()/1000)+3600,expires_in:3600,token_type:'bearer',user:{id:'synthetic',email:'qa@example.test',user_metadata:{}}}))`);
  await call('Page.navigate',{url:origin+'/app'});await until(`!!document.querySelector('.project-app')`);await scan('projects');
  await evaluate(`(()=>{[...document.querySelectorAll('button')].find(b=>/New project/i.test(b.textContent)).click()})()`);await until(`!!document.querySelector('[role=dialog],.modal')`);await scan('project-dialog');
  assert.equal(service.manager.get(roomId).providerCalls.length,0);checks.physicalProviderCalls=0;
  fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify(checks,null,2)+'\n');console.log(JSON.stringify(checks,null,2));
}catch(error){fs.writeFileSync(path.join(output,'failure.json'),JSON.stringify({checks,error:String(error)},null,2));throw error}
finally{socket?.close();browser.kill();await service.stop();assert.equal(path.dirname(dir),path.resolve(os.tmpdir()));/* Chrome may retain its temporary profile briefly; no workspace data is removed. */}
