import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

test('staging uses the allocated separate Worker, database and image attestation without production routes or mail',()=>{
  const production=JSON.parse(fs.readFileSync('wrangler.jsonc','utf8'));
  const staging=JSON.parse(fs.readFileSync('wrangler.staging.jsonc','utf8'));
  assert.equal(staging.name,'cocreate-beta-staging');
  assert.notEqual(staging.name,production.name);
  assert.equal(staging.vars.SUPABASE_URL,'https://ctnjxvwyttnjehnbfktq.supabase.co');
  assert.notEqual(staging.vars.SUPABASE_URL,production.vars.SUPABASE_URL);
  assert.deepEqual(staging.routes,[]);assert.deepEqual(staging.triggers,{crons:[]});
  assert.equal(staging.vars.COCREATE_SUBMISSION_MODE,'direct');
  assert.equal(staging.containers[0].image_vars.COCREATE_RELEASE_CONFIG,'wrangler.staging.jsonc');
  assert.equal(staging.containers[0].image_vars.VITE_SUPABASE_URL,staging.vars.SUPABASE_URL);
  assert.equal(staging.containers[0].image_vars.VITE_COCREATE_APP_ORIGIN,staging.vars.COCREATE_PUBLIC_ORIGIN);
  assert.ok(Object.keys(staging.vars).every(name=>!/(SECRET|PASSWORD|SERVICE_ROLE)/.test(name)));
  for(const config of ['wrangler.jsonc','wrangler.staging.jsonc']) {
    const result=spawnSync(process.execPath,['scripts/release-fingerprint.mjs','--config',config],{encoding:'utf8',windowsHide:true});
    assert.equal(result.status,0,result.stderr);
    assert.equal(JSON.parse(result.stdout).fingerprint,(config=== 'wrangler.jsonc' ? production : staging).vars.COCREATE_RELEASE_FINGERPRINT);
  }
  assert.notEqual(staging.vars.COCREATE_RELEASE_FINGERPRINT,production.vars.COCREATE_RELEASE_FINGERPRINT);
  const denied=spawnSync(process.execPath,['scripts/release-fingerprint.mjs','--config','unexpected.json'],{encoding:'utf8',windowsHide:true});
  assert.notEqual(denied.status,0);
});
