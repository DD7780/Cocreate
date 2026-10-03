import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import { once } from 'node:events';
import { runIsolated, prepareIsolation, IsolationError, isolationPolicy } from '../server/isolation.js';
import { applyOperations, bundleProject } from '../server/project.js';

const jobs=path.resolve('.runtime/isolation/jobs');
const files=applyOperations(undefined,[{type:'write',path:'src/App.tsx',content:"import{useState}from'react';export default function App(){const[value]=useState('Working isolated product');return <main>{value}</main>}"}]);
function noChild(pid:number){assert.throws(()=>process.kill(pid,0),{code:'ESRCH'});}
function noJobs(){assert.deepEqual(fs.existsSync(jobs)?fs.readdirSync(jobs):[],[]);}

test('ordinary compilation runs in the real OS boundary and never evaluates candidate top-level code',async()=>{
  await prepareIsolation();const result=await bundleProject(files);
  assert.match(result.javascript,/Working isolated product/);assert.match(result.javascript,/createRoot/);assert.ok(result.css.length);
  const literal=applyOperations(undefined,[{type:'write',path:'src/App.tsx',content:"throw new Error('Candidate execution marker');export default function App(){return <main>Literal compiled content</main>}"}]);
  assert.match((await bundleProject(literal)).javascript,/Candidate execution marker/);noJobs();
});

test('AppContainer without Node permissions denies an existing private host file, writes and live loopback network',{skip:process.platform!=='win32'},async()=>{
  const outside=fs.mkdtempSync(path.join(os.tmpdir(),'isolation-private-fixture-')),secret=path.join(outside,'private.txt');
  fs.writeFileSync(secret,'synthetic private sentinel');let connects=0;
  const server=net.createServer(socket=>{connects++;socket.destroy()});server.listen(0,'127.0.0.1');await once(server,'listening');
  const address=server.address();assert.ok(address&&typeof address!=='string');
  const prior=process.env.COCREATE_SYNTHETIC_SECRET;process.env.COCREATE_SYNTHETIC_SECRET='synthetic-only';
  try{
    const result=await runIsolated({operation:'probe',outside:secret,port:address.port},{osProbe:true}) as any;
    assert.equal(result.readOutside.allowed,false);assert.equal(result.writeOutside.allowed,false);
    assert.equal(result.network.allowed,false);assert.equal(connects,0);assert.equal(result.environment.includes('COCREATE_SYNTHETIC_SECRET'),false);
    assert.equal(fs.readFileSync(secret,'utf8'),'synthetic private sentinel');noChild(result.pid);noJobs();
  }finally{prior===undefined?delete process.env.COCREATE_SYNTHETIC_SECRET:process.env.COCREATE_SYNTHETIC_SECRET=prior;await new Promise<void>(resolve=>server.close(()=>resolve()));assert.equal(path.dirname(path.resolve(outside)),path.resolve(os.tmpdir()));fs.rmSync(outside,{recursive:true,force:true})}
});

test('restricted process strips injection/secrets and denies subprocesses, workers and cross-workspace reads',async()=>{
  const server=net.createServer(socket=>socket.destroy());server.listen(0,'127.0.0.1');await once(server,'listening');const address=server.address();assert.ok(address&&typeof address!=='string');
  const keys=['NODE_OPTIONS','SUPABASE_SECRET_KEY','OPENAI_API_KEY','SESSION_SECRET','COCREATE_SYNTHETIC_SECRET'];const prior=keys.map(key=>process.env[key]);
  for(const key of keys)process.env[key]='synthetic injection or secret';
  try{
    const result=await runIsolated({operation:'probe',outside:path.resolve('context.md'),port:address.port}) as any;
    assert.equal(result.readOutside.allowed,false);assert.equal(result.writeOutside.allowed,false);assert.equal(result.spawn.allowed,false);assert.equal(result.worker.allowed,false);assert.equal(result.network.allowed,false);
    assert.ok(keys.every(key=>!result.environment.includes(key)));noChild(result.pid);noJobs();
  }finally{keys.forEach((key,index)=>{prior[index]===undefined?delete process.env[key]:process.env[key]=prior[index]});await new Promise<void>(resolve=>server.close(()=>resolve()))}
});

test('candidate imports cannot read absolute files, traverse workspaces or download packages/styles',async()=>{
  for(const content of ["import secret from '/etc/passwd';export default function App(){return <main>{secret}</main>}","import secret from '../../other-workspace/private';export default function App(){return <main>{secret}</main>}","import remote from 'https://fixture.invalid/code.js';export default function App(){return <main>{remote}</main>}"]){
    await assert.rejects(bundleProject(applyOperations(undefined,[{type:'write',path:'src/App.tsx',content}])),/not approved|leaves the candidate workspace/);noJobs();
  }
  await assert.rejects(bundleProject(applyOperations(undefined,[{type:'write',path:'src/styles.css',content:"@import 'https://fixture.invalid/style.css';"}])),/not approved/);noJobs();
});

test('wall timeout terminates a running child and cleans its private input',async()=>{
  let pid=0;
  await assert.rejects(runIsolated({operation:'spin'},{wallMs:500,onStarted:value=>pid=value}),(error:IsolationError)=>error.code==='isolation_timeout');
  assert.ok(pid);noChild(pid);noJobs();
});

test('cancellation waits for real child termination and cleanup; pre-abort starts nothing',async()=>{
  const controller=new AbortController();let pid=0;
  await assert.rejects(runIsolated({operation:'spin'},{signal:controller.signal,onStarted:value=>{pid=value;controller.abort()}}),(error:IsolationError)=>error.code==='isolation_cancelled');
  assert.ok(pid);noChild(pid);noJobs();
  const prior=new AbortController();prior.abort();await assert.rejects(bundleProject(files,prior.signal),(error:IsolationError)=>error.code==='isolation_cancelled');noJobs();
});

test('memory exhaustion cannot escape the OS bound and leaves no child work',async()=>{
  let pid=0;
  await assert.rejects(runIsolated({operation:'allocate'},{onStarted:value=>pid=value}),(error:IsolationError)=>error.code==='isolation_resource_limit');
  assert.equal(isolationPolicy.windowsMemoryBytes,512*1024*1024);assert.ok(pid);noChild(pid);noJobs();
});

test('unavailable isolation fails explicitly and cannot fall back to host compilation',async()=>{
  const prior=process.env.COCREATE_ISOLATION_MODE;process.env.COCREATE_ISOLATION_MODE='unavailable';
  try{await assert.rejects(bundleProject(files),(error:IsolationError)=>error.code==='isolation_unavailable'&&error.message.includes('no host execution fallback'));noJobs()}
  finally{prior===undefined?delete process.env.COCREATE_ISOLATION_MODE:process.env.COCREATE_ISOLATION_MODE=prior}
});


test('CPU bound stops a busy child before the longer wall deadline',async()=>{
  let pid=0;const started=Date.now();
  await assert.rejects(runIsolated({operation:'spin'},{onStarted:value=>pid=value}),(error:IsolationError)=>error.code==='isolation_resource_limit');
  assert.ok(Date.now()-started<isolationPolicy.wallMs);assert.ok(pid);noChild(pid);noJobs();
});

test('untrusted output is bounded before it reaches application memory or artifacts',async()=>{
  let pid=0;
  await assert.rejects(runIsolated({operation:'flood'},{onStarted:value=>pid=value}),(error:IsolationError)=>error.code==='isolation_resource_limit'&&(error.cause as {limit?:string})?.limit==='output');
  assert.ok(pid);noChild(pid);noJobs();
});
