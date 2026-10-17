import assert from 'node:assert/strict';
import * as Y from 'yjs';
import {TwoGuysOneCanvasProvider} from '../../src/provider.js';
import {createProgressFixture} from '../../tests/fixtures/build-progress.js';
class Socket {
  static OPEN=1;static CONNECTING=0;static CLOSING=2;readyState=1;
  send(){}close(){}onopen:any;onmessage:any;onclose:any;onerror:any;
}
const doc=new Y.Doc(),provider=new TwoGuysOneCanvasProvider(doc,'synthetic','synthetic',()=>{},()=>{},()=>{},{WebSocketImpl:Socket as any,origin:'http://synthetic.test',setTimer:()=>1,clearTimer:()=>{}});
const flush=provider.flush();provider.destroy();
await assert.rejects(flush,error=>error instanceof Error&&error.message==='The document connection closed.');doc.destroy();
console.log('Provider destruction rejects an in-flight flush with the screenshot message. The original browser teardown trigger is not proven.');
const fixture=await createProgressFixture({personalDelayMs:1000,buildDebounceMs:60000,buildMaxWaitMs:60000});
try{
  fixture.edit('alice','Please add a dashboard');
  let acknowledged=false;const submitting=fixture.manager.submitChanges(fixture.room,'alice','baseline').then(()=>{acknowledged=true});
  await new Promise(resolve=>setTimeout(resolve,150));const beforeInterpreter=acknowledged;
  await submitting;
  console.log(JSON.stringify({acknowledgedBeforeInterpreter:beforeInterpreter,physicalControlledInterpreterCalls:fixture.personal.length}));
  assert.equal(beforeInterpreter,true,'capture must acknowledge independently of blocked interpretation');
}finally{await fixture.close()}
