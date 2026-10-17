import test from 'node:test';
import assert from 'node:assert/strict';
import {SaveTrace} from '../server/save-diagnostics.js';

test('flush diagnostics bound metadata, retain stage correlation, and observe a late commit without authorizing work',t=>{
  const logs:string[]=[];t.mock.method(console,'info',(value:string)=>logs.push(value));
  const trace=new SaveTrace({requestId:'flush_synthetic',connectionId:'connection_synthetic'});
  const snapshot=new SaveTrace({revision:42});trace.attach(snapshot);
  trace.end('ingress-queue');snapshot.start('remote-commit');trace.finish('unknown');
  snapshot.end('remote-commit',{code:'40P01',message:'private document'},409);snapshot.committed();trace.finish('acknowledged');
  for(let i=0;i<100;i++)trace.emit('late_commit');
  assert.equal(logs.length,4);assert.ok(trace.finished);
  const last=JSON.parse(logs.at(-1)!);assert.equal(last.requestId,'flush_synthetic');assert.equal(last.snapshots[0].revision,42);
  assert.deepEqual(last.snapshots[0].stages[0].code,'40P01');assert.equal(last.snapshots[0].stages[0].status,409);
  assert.doesNotMatch(logs.join(''),/private document/);
});

test('untrusted IDs and error codes cannot become diagnostic content',t=>{
  const logs:string[]=[];t.mock.method(console,'info',(value:string)=>logs.push(value));
  const trace=new SaveTrace({requestId:'sk-synthetic-credential',connectionId:'private document'});
  trace.start('remote-commit');trace.end('remote-commit',{code:'private document'});trace.finish('failed');
  assert.doesNotMatch(logs.join(''),/sk-synthetic|private document/);assert.equal(JSON.parse(logs.at(-1)!).outcome,'failed');
});
