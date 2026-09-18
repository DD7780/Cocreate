import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {createCoCreateServer} from '../server/index.js';

const root=process.cwd();

test('the application exposes a container readiness endpoint',async()=>{
  const instance=await createCoCreateServer({port:0,host:'127.0.0.1',serveClient:false,sessionSecret:'health-session',encryptionSecret:'health-encryption'});
  const info=await instance.start();
  try{
    const response=await fetch(`${info.url}/__cocreate/app-health`);
    assert.equal(response.status,200);
    assert.deepEqual(await response.json(),{status:'ok',service:'cocreate-app'});
  }finally{await instance.stop()}
});

test('the Cloudflare container uses the native WebSocket-aware proxy',()=>{
  const worker=fs.readFileSync(path.join(root,'worker/container.js'),'utf8');
  const dockerfile=fs.readFileSync(path.join(root,'Dockerfile'),'utf8');
  const classBody=worker.slice(worker.indexOf('export class CoCreateContainer'),worker.indexOf('export default'));
  assert.doesNotMatch(classBody,/\basync\s+fetch\s*\(/);
  assert.doesNotMatch(classBody,/containerFetch\s*\(/);
  assert.match(worker,/getContainer\(env\.COCREATE_CONTAINER,\s*"primary"\)\.fetch/);
  assert.match(worker,/pingEndpoint\s*=\s*"localhost\/__cocreate\/app-health"/);
  assert.match(worker,/SESSION_SECRET:\s*env\.SESSION_SECRET/);
  assert.match(worker,/CREDENTIAL_ENCRYPTION_SECRET:\s*env\.CREDENTIAL_ENCRYPTION_SECRET/);
  assert.match(dockerfile,/CMD \["node", "--import", "tsx", "server\/index\.ts"\]/);
});
