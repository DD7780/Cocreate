import test from 'node:test';
import assert from 'node:assert/strict';
import {WebSocket} from 'ws';
import {createCoCreateServer} from '../server/index.js';
import {createSession} from '../server/auth.js';

const rejectedStatus=(url:string)=>new Promise<number>((resolve,reject)=>{const ws=new WebSocket(url);ws.once('unexpected-response',(_request,response)=>{resolve(response.statusCode||0);response.resume()});ws.once('open',()=>reject(new Error('Expected the upgrade to be rejected.')));ws.once('error',()=>{})});

test('collaboration upgrades expose safe authentication and room failures',async()=>{
  const instance=await createCoCreateServer({port:0,host:'127.0.0.1',serveClient:false,sessionSecret:'handshake-session',encryptionSecret:'handshake-encryption'}),info=await instance.start();
  try{
    assert.equal(await rejectedStatus(`ws://127.0.0.1:${info.port}/ws?room=missing&token=invalid`),401);
    const response=await fetch(`${info.url}/api/rooms`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}),{roomId}=await response.json() as {roomId:string};
    assert.equal(await rejectedStatus(`ws://127.0.0.1:${info.port}/ws?room=${roomId}&token=invalid`),401);
    const missingToken=createSession('handshake-session',{roomId:'gone',participantId:'participant',name:'Tester'});
    assert.equal(await rejectedStatus(`ws://127.0.0.1:${info.port}/ws?room=gone&token=${encodeURIComponent(missingToken)}`),404);
  }finally{await instance.stop()}
});
