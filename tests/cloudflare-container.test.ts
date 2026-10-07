import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {createCoCreateServer} from '../server/index.js';
import {legacyOriginResponse} from '../worker/legacy-origin.js';

const root=process.cwd();

test('the pre-launch deployment binds hosted auth and callbacks to the custom domain',()=>{
  const config=JSON.parse(fs.readFileSync(path.join(root,'wrangler.jsonc'),'utf8'));
  const origin='https://2guys1canvas.com';
  assert.equal(config.vars.COCREATE_PUBLIC_ORIGIN,origin);
  assert.equal(config.vars.COCREATE_APP_ORIGINS,origin);
  assert.equal(config.workers_dev,true);
  assert.equal(config.vars.COCREATE_LEGACY_ORIGIN,'https://cocreate.susan981314271.workers.dev');
  assert.equal(config.preview_urls,false);
  assert.deepEqual(config.routes,[{pattern:new URL(origin).hostname,custom_domain:true}]);
  assert.equal(config.containers.length,1);
  const image=config.containers[0].image_vars;
  assert.equal(image.VITE_COCREATE_APP_ORIGIN,origin);
  assert.equal(image.VITE_COCREATE_AUTH_MODE,'supabase');
  assert.equal(image.VITE_SUPABASE_URL,config.vars.SUPABASE_URL);
  assert.equal(image.VITE_SUPABASE_PUBLISHABLE_KEY,config.vars.SUPABASE_PUBLISHABLE_KEY);
  assert.ok(Object.keys(image).every(name=>!/(SECRET|PASSWORD|SERVICE_ROLE|OWNER|BETA_ACCESS)/.test(name)));
});

test('legacy links preserve their destination without allowing host escape or protected ingress',()=>{
  const canonical='https://2guys1canvas.com',legacy='https://cocreate.susan981314271.workers.dev';
  const response=legacyOriginResponse(new Request(`${legacy}/invite/retained-token?next=%2Fapp`),canonical,legacy)!;
  assert.equal(response.status,308);
  assert.equal(response.headers.get('Location'),`${canonical}/invite/retained-token?next=%2Fapp`);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
  assert.equal(legacyOriginResponse(new Request(`${legacy}/app`,{method:'HEAD'}),canonical,legacy)!.status,308);
  const escape=legacyOriginResponse(new Request(`${legacy}//attacker.invalid/path?next=https%3A%2F%2Fattacker.invalid`),canonical,legacy)!;
  assert.equal(new URL(escape.headers.get('Location')!).origin,canonical);
  assert.equal(legacyOriginResponse(new Request(`${legacy}/api/projects`,{method:'POST'}),canonical,legacy)!.status,421);
  assert.equal(legacyOriginResponse(new Request(`${legacy}/ws`,{headers:{Upgrade:'websocket'}}),canonical,legacy)!.status,421);
  assert.equal(legacyOriginResponse(new Request(`${canonical}/api/projects`),canonical,legacy),null);
  assert.equal(legacyOriginResponse(new Request(`${legacy}/app`),'https://attacker.invalid/path',legacy)!.status,503);
  assert.equal(legacyOriginResponse(new Request(`${legacy}/app`),'invalid origin',legacy)!.status,503);
});

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


test('direct application startup refuses unavailable isolation before binding a server',()=>{
  const result=spawnSync(process.execPath,['--import','tsx','server/index.ts'],{cwd:root,env:{...process.env,COCREATE_ISOLATION_MODE:'unavailable',PORT:'0'},encoding:'utf8',timeout:15_000,windowsHide:true});
  assert.equal(result.error,undefined);assert.notEqual(result.status,0);
  assert.match(result.stderr,/Generated execution isolation is unavailable/);
  assert.doesNotMatch(result.stdout,/2guys1canvas ready/);
});
