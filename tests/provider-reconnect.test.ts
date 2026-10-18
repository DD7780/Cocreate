import test from 'node:test';
import assert from 'node:assert/strict';
import * as Y from 'yjs';
import { deletionSignature } from '../shared/document-state.js';
import {TwoGuysOneCanvasProvider,type ConnectionStatus,providerInternals} from '../src/provider.js';

class FakeWebSocket {
  static CONNECTING=0;static OPEN=1;static CLOSING=2;static CLOSED=3;static instances:FakeWebSocket[]=[];
  readyState=FakeWebSocket.CONNECTING;binaryType='';sent:unknown[]=[];
  onopen:null|(()=>unknown)=null;onmessage:null|((event:{data:any})=>unknown)=null;onerror:null|(()=>unknown)=null;onclose:null|(()=>unknown)=null;
  constructor(public url:string){FakeWebSocket.instances.push(this)}
  send(value:unknown){this.sent.push(value)}
  open(){this.readyState=FakeWebSocket.OPEN;this.onopen?.()}
  message(data:any){this.onmessage?.({data})}
  close(){this.readyState=FakeWebSocket.CLOSED;this.onclose?.()}
}

const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
const binary=(value:Uint8Array)=>value.buffer.slice(value.byteOffset,value.byteOffset+value.byteLength);

test('same-account credential renewal preserves writing and completes a pending save only on the renewed socket',async()=>{
  FakeWebSocket.instances=[];
  const doc=new Y.Doc();let timer=0,settled=false;
  const provider=new TwoGuysOneCanvasProvider(doc,'room','old-token',()=>{},()=>{},()=>{},
    {WebSocketImpl:FakeWebSocket as any,origin:'http://example.test',setTimer:()=>++timer,clearTimer:()=>{}});
  try{
    const first=FakeWebSocket.instances[0];first.open();
    doc.getText('draft').insert(0,'Keep my writing');
    const awareness=provider.awareness;
    const saving=provider.flush().then(()=>{settled=true;});
    const original=first.sent.filter((item):item is string=>typeof item==='string').map(item=>JSON.parse(item)).find(item=>item.type==='flush');
    provider.updateCredentials('renewed-token');
    assert.equal(provider.doc,doc);assert.equal(provider.awareness,awareness);
    assert.equal(doc.getText('draft').toString(),'Keep my writing');
    const renewed=FakeWebSocket.instances[1];assert.match(renewed.url,/renewed-token/);renewed.open();
    first.message(JSON.stringify({type:'flushed',requestId:original.requestId}));await tick();
    assert.equal(settled,false,'a retired transport cannot complete the current save');
    const empty=new Y.Doc();
    try{renewed.message(binary(Uint8Array.from([2,...Y.encodeStateVector(empty)])));}finally{empty.destroy();}
    const replay=renewed.sent.filter((item):item is string=>typeof item==='string').map(item=>JSON.parse(item)).find(item=>item.type==='flush');
    assert.equal(replay.requestId,original.requestId);
    renewed.message(JSON.stringify({type:'flushed',requestId:replay.requestId}));
    await saving;assert.equal(settled,true);
  }finally{provider.destroy();doc.destroy();}
});

test('delayed save acknowledgements cannot label newer pending edits saved and stale room states are ignored',()=>{
  FakeWebSocket.instances=[];const doc=new Y.Doc(),saved:string[]=[],states:number[]=[];
  const provider=new TwoGuysOneCanvasProvider(doc,'room','token',state=>states.push(state.persistRevision),()=>{},state=>saved.push(state),
    {WebSocketImpl:FakeWebSocket as any,origin:'http://example.test',setTimer:()=>0,clearTimer:()=>{}});
  const socket=FakeWebSocket.instances[0];socket.open();doc.getText('draft').insert(0,'A');const oldVector=Buffer.from(Y.encodeStateVector(doc)).toString('base64');doc.getText('draft').insert(1,'B');
  socket.message(JSON.stringify({type:'saved',revision:1,vector:oldVector,savedAt:'2026-10-01T00:00:00Z'}));assert.notEqual(saved.at(-1),'saved');
  socket.message(JSON.stringify({type:'saved',revision:2,vector:Buffer.from(Y.encodeStateVector(doc)).toString('base64')}));assert.equal(saved.at(-1),'saved');
  socket.message(JSON.stringify({type:'room-state',state:{persistRevision:5,workflow:{activityCursor:10}}}));
  socket.message(JSON.stringify({type:'room-state',state:{persistRevision:4,workflow:{activityCursor:9}}}));assert.deepEqual(states,[5]);
  provider.destroy();doc.destroy();
});

test('retry delay is capped exponential backoff with bounded jitter',()=>{
  assert.equal(providerInternals.retryDelay(1,()=>0),400);
  assert.equal(providerInternals.retryDelay(2,()=>0.5),1_000);
  assert.equal(providerInternals.retryDelay(20,()=>1),12_000);
});

test('a receipt predating a deletion cannot mark the deleted draft saved',()=>{
  FakeWebSocket.instances=[];const doc=new Y.Doc(),saved:string[]=[];
  const provider=new TwoGuysOneCanvasProvider(doc,'room','token',()=>{},()=>{},state=>saved.push(state),{WebSocketImpl:FakeWebSocket as any,origin:'http://example.test',setTimer:()=>1,clearTimer:()=>{}});
  const socket=FakeWebSocket.instances[0];socket.open();doc.getText('draft').insert(0,'Remove me');
  const vector=Buffer.from(Y.encodeStateVector(doc)).toString('base64'),deletions=deletionSignature(doc);
  doc.getText('draft').delete(0,9);socket.message(JSON.stringify({type:'saved',revision:1,vector,deletions}));assert.equal(saved.at(-1),'saving');
  socket.message(JSON.stringify({type:'saved',revision:2,vector,deletions:deletionSignature(doc)}));assert.equal(saved.at(-1),'saved');
  provider.destroy();doc.destroy();
});

test('invalid sessions become actionable terminal errors without retrying',async()=>{
  FakeWebSocket.instances=[];const states:ConnectionStatus[]=[],timers:(()=>void)[]=[];
  const provider=new TwoGuysOneCanvasProvider(new Y.Doc(),'room','bad',()=>{},state=>states.push(state),()=>{},
    {WebSocketImpl:FakeWebSocket as any,origin:'https://example.test',fetchImpl:async()=>new Response('{}',{status:401}),setTimer:callback=>{timers.push(callback);return timers.length},clearTimer:()=>{}});
  FakeWebSocket.instances[0].close();await tick();
  const last=states.at(-1);assert.equal(last?.state,'error');assert.equal(last?.state==='error'&&last.reason,'invalid-session');assert.equal(timers.length,0);
  provider.destroy();
});

test('transient failures use one timer, stop after the cap, and never duplicate sockets',async()=>{
  FakeWebSocket.instances=[];const states:ConnectionStatus[]=[],timers=new Map<number,()=>void>();let timerId=0;
  const provider=new TwoGuysOneCanvasProvider(new Y.Doc(),'room','token',()=>{},state=>states.push(state),()=>{},
    {WebSocketImpl:FakeWebSocket as any,origin:'https://example.test',fetchImpl:async()=>new Response('{}',{status:200}),maxRetries:2,random:()=>0.5,setTimer:callback=>{timers.set(++timerId,callback);return timerId},clearTimer:id=>{timers.delete(id)}});
  for(let attempt=0;attempt<3;attempt++){FakeWebSocket.instances.at(-1)!.close();await tick();const timer=[...timers.entries()].at(-1);if(timer){timers.delete(timer[0]);timer[1]()}}
  const last=states.at(-1);assert.equal(FakeWebSocket.instances.length,3);assert.equal(last?.state,'error');assert.equal(last?.state==='error'&&last.reason,'unavailable');assert.equal(timers.size,0);
  provider.destroy();
});

test('an edit made while disconnected is offered to the server after reconnect state-vector sync',async()=>{
  FakeWebSocket.instances=[];const callbacks:(()=>void)[]=[];const doc=new Y.Doc();
  const provider=new TwoGuysOneCanvasProvider(doc,'room','token',()=>{},()=>{},()=>{},
    {WebSocketImpl:FakeWebSocket as any,origin:'http://example.test',fetchImpl:async()=>new Response('{}',{status:200}),random:()=>0.5,setTimer:callback=>{callbacks.push(callback);return callbacks.length},clearTimer:()=>{}});
  FakeWebSocket.instances[0].close();await tick();doc.getText('draft').insert(0,'kept offline');callbacks.shift()?.();
  const restored=FakeWebSocket.instances[1];restored.open();const remote=new Y.Doc(),vector=Y.encodeStateVector(remote),packet=new Uint8Array(vector.length+1);packet[0]=2;packet.set(vector,1);restored.message(binary(packet));
  const update=restored.sent.find(value=>value instanceof Uint8Array&&value[0]===0) as Uint8Array;assert.ok(update);Y.applyUpdate(remote,update.slice(1));assert.equal(remote.getText('draft').toString(),'kept offline');
  provider.destroy();
});

test('a new connection can recover a lower authoritative cursor after uncommitted server events disappear',async()=>{
  FakeWebSocket.instances=[];const callbacks:(()=>void)[]=[],states:number[]=[];
  const provider=new TwoGuysOneCanvasProvider(new Y.Doc(),'room','token',state=>states.push(state.persistRevision!),()=>{},()=>{},
    {WebSocketImpl:FakeWebSocket as any,origin:'http://example.test',fetchImpl:async()=>new Response('{}',{status:200}),setTimer:callback=>{callbacks.push(callback);return callbacks.length},clearTimer:()=>{}});
  FakeWebSocket.instances[0].message(JSON.stringify({type:'room-state',state:{persistRevision:20,workflow:{activityCursor:30}}}));
  FakeWebSocket.instances[0].close();await tick();callbacks.shift()?.();
  FakeWebSocket.instances[1].message(JSON.stringify({type:'room-state',state:{persistRevision:18,workflow:{activityCursor:28}}}));
  FakeWebSocket.instances[1].message(JSON.stringify({type:'room-state',state:{persistRevision:17,workflow:{activityCursor:27}}}));
  assert.deepEqual(states,[20,18]);provider.destroy();
});

test('disconnect rejects an in-flight flush and destroy removes document listeners',async()=>{
  FakeWebSocket.instances=[];const timers=new Map<number,()=>void>();let timerId=0,saves=0;
  const doc=new Y.Doc(),provider=new TwoGuysOneCanvasProvider(doc,'room','token',()=>{},()=>{},()=>{saves++},
    {WebSocketImpl:FakeWebSocket as any,origin:'http://example.test',fetchImpl:async()=>new Response('{}',{status:200}),setTimer:callback=>{timers.set(++timerId,callback);return timerId},clearTimer:id=>{timers.delete(id)}});
  const socket=FakeWebSocket.instances[0];socket.open();const flushing=provider.flush();socket.close();await assert.rejects(flushing,/No build was started/);provider.destroy();const before=saves;doc.getText('draft').insert(0,'after destroy');assert.equal(saves,before);
});

test('burst edits share one transport update and explicit flush drains before acknowledgement',async()=>{
  FakeWebSocket.instances=[];const callbacks=new Map<number,()=>void>();let timerId=0;
  const doc=new Y.Doc(),provider=new TwoGuysOneCanvasProvider(doc,'room','token',()=>{},()=>{},()=>{},
    {WebSocketImpl:FakeWebSocket as any,origin:'http://example.test',setTimer:callback=>{callbacks.set(++timerId,callback);return timerId},clearTimer:id=>{callbacks.delete(id)}});
  const socket=FakeWebSocket.instances[0];socket.open();
  doc.getText('draft').insert(0,'A');doc.getText('draft').insert(1,'B');
  assert.equal(socket.sent.filter(value=>value instanceof Uint8Array&&value[0]===0).length,0);
  const pending=provider.flush();
  const packets=socket.sent.filter(value=>value instanceof Uint8Array&&value[0]===0) as Uint8Array[];
  assert.equal(packets.length,1);const remote=new Y.Doc();Y.applyUpdate(remote,packets[0].slice(1));assert.equal(remote.getText('draft').toString(),'AB');
  const request=JSON.parse(socket.sent.at(-1) as string);assert.equal(request.type,'flush');socket.message(JSON.stringify({type:'flushed',requestId:request.requestId}));await pending;
  provider.destroy();doc.destroy();remote.destroy();
});

test('owner unavailability honors bounded retry hints, retains edits, and ends without inference',async()=>{
  FakeWebSocket.instances=[];const doc=new Y.Doc(),states:ConnectionStatus[]=[],callbacks:(()=>void)[]=[],delays:number[]=[];let diagnoses=0;
  const provider=new TwoGuysOneCanvasProvider(doc,'room','token',()=>{},status=>states.push(status),()=>{},{WebSocketImpl:FakeWebSocket as any,origin:'http://example.test',maxRetries:2,random:()=>0.5,fetchImpl:async(_url,options)=>{diagnoses++;assert.equal(options?.method,undefined);return new Response('{}',{status:503,headers:{'Retry-After':'9999'}})},setTimer:(callback,delay)=>{callbacks.push(callback);delays.push(delay);return callbacks.length},clearTimer:()=>{}});
  try{
    FakeWebSocket.instances[0].close();await tick();doc.getText('draft').insert(0,'retained steering');
    assert.equal(delays[0],10000);callbacks.shift()?.();FakeWebSocket.instances[1].close();await tick();assert.equal(delays[1],10000);
    callbacks.shift()?.();FakeWebSocket.instances[2].close();await tick();
    const last=states.at(-1);assert.equal(last?.state,'error');assert.match(last!.message,/workflow owner.*Reopen/);assert.equal(doc.getText('draft').toString(),'retained steering');assert.equal(diagnoses,3);assert.equal(callbacks.length,0);
  }finally{provider.destroy();doc.destroy()}
});
