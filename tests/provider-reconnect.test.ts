import test from 'node:test';
import assert from 'node:assert/strict';
import * as Y from 'yjs';
import {CoCreateProvider,type ConnectionStatus,providerInternals} from '../src/provider.js';

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

test('retry delay is capped exponential backoff with bounded jitter',()=>{
  assert.equal(providerInternals.retryDelay(1,()=>0),400);
  assert.equal(providerInternals.retryDelay(2,()=>0.5),1_000);
  assert.equal(providerInternals.retryDelay(20,()=>1),12_000);
});

test('invalid sessions become actionable terminal errors without retrying',async()=>{
  FakeWebSocket.instances=[];const states:ConnectionStatus[]=[],timers:(()=>void)[]=[];
  const provider=new CoCreateProvider(new Y.Doc(),'room','bad',()=>{},state=>states.push(state),()=>{},
    {WebSocketImpl:FakeWebSocket as any,origin:'https://example.test',fetchImpl:async()=>new Response('{}',{status:401}),setTimer:callback=>{timers.push(callback);return timers.length},clearTimer:()=>{}});
  FakeWebSocket.instances[0].close();await tick();
  const last=states.at(-1);assert.equal(last?.state,'error');assert.equal(last?.state==='error'&&last.reason,'invalid-session');assert.equal(timers.length,0);
  provider.destroy();
});

test('transient failures use one timer, stop after the cap, and never duplicate sockets',async()=>{
  FakeWebSocket.instances=[];const states:ConnectionStatus[]=[],timers=new Map<number,()=>void>();let timerId=0;
  const provider=new CoCreateProvider(new Y.Doc(),'room','token',()=>{},state=>states.push(state),()=>{},
    {WebSocketImpl:FakeWebSocket as any,origin:'https://example.test',fetchImpl:async()=>new Response('{}',{status:200}),maxRetries:2,random:()=>0.5,setTimer:callback=>{timers.set(++timerId,callback);return timerId},clearTimer:id=>{timers.delete(id)}});
  for(let attempt=0;attempt<3;attempt++){FakeWebSocket.instances.at(-1)!.close();await tick();const timer=[...timers.entries()].at(-1);if(timer){timers.delete(timer[0]);timer[1]()}}
  const last=states.at(-1);assert.equal(FakeWebSocket.instances.length,3);assert.equal(last?.state,'error');assert.equal(last?.state==='error'&&last.reason,'unavailable');assert.equal(timers.size,0);
  provider.destroy();
});

test('an edit made while disconnected is offered to the server after reconnect state-vector sync',async()=>{
  FakeWebSocket.instances=[];const callbacks:(()=>void)[]=[];const doc=new Y.Doc();
  const provider=new CoCreateProvider(doc,'room','token',()=>{},()=>{},()=>{},
    {WebSocketImpl:FakeWebSocket as any,origin:'http://example.test',fetchImpl:async()=>new Response('{}',{status:200}),random:()=>0.5,setTimer:callback=>{callbacks.push(callback);return callbacks.length},clearTimer:()=>{}});
  FakeWebSocket.instances[0].close();await tick();doc.getText('draft').insert(0,'kept offline');callbacks.shift()?.();
  const restored=FakeWebSocket.instances[1];restored.open();const remote=new Y.Doc(),vector=Y.encodeStateVector(remote),packet=new Uint8Array(vector.length+1);packet[0]=2;packet.set(vector,1);restored.message(binary(packet));
  const update=restored.sent.find(value=>value instanceof Uint8Array&&value[0]===0) as Uint8Array;assert.ok(update);Y.applyUpdate(remote,update.slice(1));assert.equal(remote.getText('draft').toString(),'kept offline');
  provider.destroy();
});

test('disconnect rejects an in-flight flush and destroy removes document listeners',async()=>{
  FakeWebSocket.instances=[];const timers=new Map<number,()=>void>();let timerId=0,saves=0;
  const doc=new Y.Doc(),provider=new CoCreateProvider(doc,'room','token',()=>{},()=>{},()=>{saves++},
    {WebSocketImpl:FakeWebSocket as any,origin:'http://example.test',fetchImpl:async()=>new Response('{}',{status:200}),setTimer:callback=>{timers.set(++timerId,callback);return timerId},clearTimer:id=>{timers.delete(id)}});
  const socket=FakeWebSocket.instances[0];socket.open();const flushing=provider.flush();socket.close();await assert.rejects(flushing,/No build was started/);provider.destroy();const before=saves;doc.getText('draft').insert(0,'after destroy');assert.equal(saves,before);
});
