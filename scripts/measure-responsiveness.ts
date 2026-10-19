import {performance} from 'node:perf_hooks';
import os from 'node:os';
import path from 'node:path';
import {mkdtemp,rm} from 'node:fs/promises';
import {WebSocket} from 'ws';
import * as Y from 'yjs';
import {createCoCreateServer} from '../server/index.js';

type Sample={openMs:number;propagationMs:number;flushMs:number;catchUpMs:number;messages:number;bytes:number;stateMessages:number;subscriptions:number};
const wait=(predicate:()=>boolean,timeout=5_000)=>new Promise<void>((resolve,reject)=>{const started=performance.now(),timer=setInterval(()=>{if(predicate()){clearInterval(timer);resolve()}else if(performance.now()-started>timeout){clearInterval(timer);reject(new Error('Benchmark timed out'))}},2)});
const median=(values:number[])=>{const sorted=[...values].sort((a,b)=>a-b);return sorted[Math.floor(sorted.length/2)]||0};

async function run(size:number,samples:number){
  const results:Sample[]=[];
  for(let sample=0;sample<samples;sample++){
    const dataDir=await mkdtemp(path.join(os.tmpdir(),'cocreate-responsive-'));
    const app=await createCoCreateServer({port:0,host:'127.0.0.1',serveClient:false,dataDir,sessionSecret:'benchmark-session',encryptionSecret:'benchmark-encryption'}),info=await app.start();
    try{
      const post=async(url:string,body:unknown,token?:string)=>fetch(`${info.url}${url}`,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify(body)}).then(response=>response.json());
      const roomId=(await post('/api/rooms',{})).roomId,alice=await post('/api/session',{roomId,name:'Alice'}),bob=await post('/api/session',{roomId,name:'Bob'});
      const seed=app.manager.get(roomId)!.doc.getXmlFragment('default');seed.insert(0,[new Y.XmlText('x'.repeat(size))]);
      const connect=async(token:string)=>{const doc=new Y.Doc();let messages=0,bytes=0,stateMessages=0;const opened=performance.now(),socket=new WebSocket(`${info.url.replace('http','ws')}/ws?room=${roomId}&token=${token}`);socket.on('message',(raw,isBinary)=>{messages++;bytes+=raw instanceof Buffer?raw.byteLength:Buffer.byteLength(String(raw));if(isBinary){const value=new Uint8Array(raw as Buffer);if(value[0]===0)Y.applyUpdate(doc,value.slice(1),'remote')}else{try{if(JSON.parse(String(raw)).type==='room-state')stateMessages++}catch{}}});await new Promise<void>((resolve,reject)=>{socket.once('open',resolve);socket.once('error',reject)});await wait(()=>doc.getXmlFragment('default').toJSON().length>=size);return{doc,socket,openMs:performance.now()-opened,stats:()=>({messages,bytes,stateMessages})}};
      const first=await connect(alice.token),second=await connect(bob.token);let propagated=false;second.doc.on('update',(_update,origin)=>{if(origin==='remote')propagated=true});const text=first.doc.getXmlFragment('default').firstChild as Y.XmlText,started=performance.now();const before=Y.encodeStateVector(app.manager.get(roomId)!.doc);text.insert(text.length,'z');const update=Y.encodeStateAsUpdate(first.doc,before);first.socket.send(Buffer.concat([Buffer.from([0]),Buffer.from(update)]));await wait(()=>propagated);const propagationMs=performance.now()-started;
      const requestId=`flush-${sample}`,flushStarted=performance.now();let flushed=false;const flushListener=(raw:Buffer,isBinary:boolean)=>{if(!isBinary){try{if(JSON.parse(String(raw)).requestId===requestId)flushed=true}catch{}}};first.socket.on('message',flushListener);first.socket.send(JSON.stringify({type:'flush',requestId}));await wait(()=>flushed);const flushMs=performance.now()-flushStarted;first.socket.off('message',flushListener);
      first.socket.close();await new Promise(resolve=>setTimeout(resolve,20));const reconnect=await connect(alice.token),catchUpMs=reconnect.openMs,stats=second.stats();results.push({openMs:second.openMs,propagationMs,flushMs,catchUpMs,messages:stats.messages,bytes:stats.bytes,stateMessages:stats.stateMessages,subscriptions:2});second.socket.close();reconnect.socket.close();
    }finally{await app.stop();await rm(dataDir,{recursive:true,force:true})}
  }
  return{documentCharacters:size,samples,cold:true,participants:2,median:{openMs:median(results.map(r=>r.openMs)),propagationMs:median(results.map(r=>r.propagationMs)),flushMs:median(results.map(r=>r.flushMs)),catchUpMs:median(results.map(r=>r.catchUpMs)),messages:median(results.map(r=>r.messages)),bytes:median(results.map(r=>r.bytes)),stateMessages:median(results.map(r=>r.stateMessages)),subscriptions:2},raw:results};
}

console.log(JSON.stringify({environment:{node:process.version,platform:`${process.platform} ${os.release()}`,cpu:os.cpus()[0]?.model,transport:'localhost WebSocket; synthetic Yjs documents; no provider calls',note:'Small repeated engineering sample, not a production percentile.'},small:await run(2_000,5),large:await run(200_000,5)},null,2));
