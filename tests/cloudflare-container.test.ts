import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
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
  assert.deepEqual(config.routes,[{pattern:new URL(origin).hostname,custom_domain:true},{pattern:'www.2guys1canvas.com',custom_domain:true}]);
  assert.equal(config.vars.COCREATE_WWW_ORIGIN,'https://www.2guys1canvas.com');
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

test('www redirects exact paths and queries to canonical HTTPS without proxying an alternate application',()=>{
  const canonical='https://2guys1canvas.com',www='https://www.2guys1canvas.com';
  for(const method of ['GET','HEAD','POST']) {
    const response=legacyOriginResponse(new Request(`${www}/api/auth/callback?next=%2Finvite%2Fretained&code=fixture`,{method}),canonical,undefined,www)!;
    assert.equal(response.status,308);
    assert.equal(response.headers.get('Location'),`${canonical}/api/auth/callback?next=%2Finvite%2Fretained&code=fixture`);
  }
  assert.equal(legacyOriginResponse(new Request(`${www}/ws`,{headers:{Upgrade:'websocket'}}),canonical,undefined,www)!.status,421);
  const escape=legacyOriginResponse(new Request(`${www}//attacker.invalid/path?x=1`),canonical,undefined,www)!;
  assert.equal(new URL(escape.headers.get('Location')!).origin,canonical);
  assert.equal(legacyOriginResponse(new Request('https://www.attacker.invalid/app'),canonical,undefined,www),null);
});

test('the application exposes a container readiness endpoint',async()=>{
  const instance=await createCoCreateServer({port:0,host:'127.0.0.1',serveClient:false,sessionSecret:'health-session',encryptionSecret:'health-encryption'});
  const info=await instance.start();
  try{
    const response=await fetch(`${info.url}/__cocreate/app-health`);
    assert.equal(response.status,200);
    const {release_fingerprint, ...health} = await response.json();
    assert.deepEqual(health,{status:'ok',service:'cocreate-app'});
    if (release_fingerprint !== undefined) assert.match(release_fingerprint,/^[a-f0-9]{64}$/);
  }finally{await instance.stop()}
});

test('unknown API paths return JSON errors while the existing auth callback reaches the SPA', async () => {
  const prior = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  const instance = await createCoCreateServer({port:0,host:'127.0.0.1',serveClient:true,sessionSecret:'route-session',encryptionSecret:'route-encryption'});
  try {
    const {url} = await instance.start();
    for (const method of ['GET', 'POST']) {
      const response = await fetch(`${url}/api/unknown-release-check`, {method});
      assert.equal(response.status, 404);
      assert.match(response.headers.get('content-type') || '', /application\/json/);
      assert.deepEqual(await response.json(), {error:'API route not found.'});
    }
    for (const route of ['/api/auth/callback?next=%2Fapp', '/login', '/app', '/']) {
      const response = await fetch(url + route);
      assert.equal(response.status, 200);
      assert.match(response.headers.get('content-type') || '', /text\/html/);
    }
    const denied = await fetch(`${url}/api/beta/access`);
    // Local compatibility does not register the hosted beta route; it must still never return SPA HTML.
    assert.equal(denied.status, 404);
    assert.match(denied.headers.get('content-type') || '', /application\/json/);
  } finally {
    await instance.stop();
    prior === undefined ? delete process.env.NODE_ENV : process.env.NODE_ENV = prior;
  }
});

test('the Cloudflare container uses the native WebSocket-aware proxy',()=>{
  const worker=fs.readFileSync(path.join(root,'worker/container.js'),'utf8');
  const dockerfile=fs.readFileSync(path.join(root,'Dockerfile'),'utf8');
  const classBody=worker.slice(worker.indexOf('export class CoCreateContainer'),worker.indexOf('export default'));
  assert.doesNotMatch(classBody,/\basync\s+fetch\s*\(/);
  assert.doesNotMatch(classBody,/containerFetch\s*\(/);
  assert.match(worker,/getContainer\(env\.COCREATE_CONTAINER,\s*'primary'\)/);
  assert.match(worker,/return await container\.fetch/);
  assert.match(worker,/pingEndpoint\s*=\s*"localhost\/__cocreate\/app-health"/);
  assert.match(worker,/SESSION_SECRET:\s*env\.SESSION_SECRET/);
  assert.match(worker,/CREDENTIAL_ENCRYPTION_SECRET:\s*env\.CREDENTIAL_ENCRYPTION_SECRET/);
  assert.match(dockerfile,/CMD \["node", "--import", "tsx", "server\/index\.ts"\]/);
});

test('Worker gates HTTP and socket ingress until the running image matches the prepared source', async () => {
  const fingerprint = 'a'.repeat(64), requests: Request[] = [];
  let running: string | undefined;
  const source = fs.readFileSync(path.join(root,'worker/container.js'),'utf8').replace(/^import .*;\r?$/gm,'').replace('export class CoCreateContainer','class CoCreateContainer').replace('export default','globalThis.worker =');
  const context = vm.createContext({Container: class {}, env:{}, getContainer:()=>({fetch:async(request:Request)=>{
    requests.push(request);
    return new URL(request.url).pathname==='/__cocreate/app-health' ? Response.json({status:'ok',release_fingerprint:running}) : Response.json({forwarded:true});
  }}),legacyOriginResponse,Request,Response,Headers,URL,crypto:webcrypto,console:{error(){},log(){}}});
  vm.runInContext(source, context);
  const worker = context.worker as {fetch(request:Request,env:object):Promise<Response>};
  const config={COCREATE_RELEASE_FINGERPRINT:fingerprint,COCREATE_PUBLIC_ORIGIN:'https://2guys1canvas.com'};
  for (const request of [new Request('https://2guys1canvas.com/api/projects',{method:'POST'}),new Request('https://2guys1canvas.com/ws',{headers:{Upgrade:'websocket'}})]) {
    requests.length=0;
    assert.equal((await worker.fetch(request,config)).status,503);
    assert.equal(requests.length,1,'Old image health must never lead to protected forwarding.');
  }
  requests.length=0;running=fingerprint;
  assert.deepEqual(await (await worker.fetch(new Request('https://2guys1canvas.com/api/projects'),config)).json(),{forwarded:true});
  assert.equal(requests.length,2);
  requests.length=0;
  assert.equal((await worker.fetch(new Request('https://2guys1canvas.com/api/projects'),{...config,COCREATE_RELEASE_FINGERPRINT:''})).status,503);
  assert.equal(requests.length,0);
});


test('direct application startup refuses unavailable isolation before binding a server',()=>{
  const result=spawnSync(process.execPath,['--import','tsx','server/index.ts'],{cwd:root,env:{...process.env,COCREATE_ISOLATION_MODE:'unavailable',PORT:'0'},encoding:'utf8',timeout:15_000,windowsHide:true});
  assert.equal(result.error,undefined);assert.notEqual(result.status,0);
  assert.match(result.stderr,/Generated execution isolation is unavailable/);
  assert.doesNotMatch(result.stdout,/2guys1canvas ready/);
});
