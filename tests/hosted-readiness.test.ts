import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { randomUUID, randomBytes } from 'node:crypto';
import { BLENDER_OPERATIONS, BLENDER_VERSION } from '../shared/blender.js';
import { INTERACTIVE_BLENDER_POLICY } from '../shared/blender-interactive.js';
import { sessionCommand } from '../server/blender-sessions.js';
import { capabilityEnabled } from '../server/capabilities.js';
import { stagingConfiguration } from '../scripts/prepare-hosted-staging.js';
import { validateHostedFixture, verifyHostedBeta } from '../scripts/verify-hosted-beta.js';
import { createCanvasArtifactsFixture } from './fixtures/canvas-artifacts.js';
import { createPreviewProviderFixture } from './fixtures/preview-provider.js';
import { applyOperations } from '../server/project.js';

const production = JSON.parse(fs.readFileSync('wrangler.jsonc', 'utf8'));
const target = { accountId: 'a'.repeat(32), workerName: 'cocreate-test-staging', origin: 'https://cocreate-test-staging.example.test', supabaseUrl: `https://${'a'.repeat(20)}.supabase.co`, publishableKey: 'sb_publishable_synthetic_public_key' };

test('hosted optional capability admission is explicit and invalid values fail closed', () => {
  for (const capability of ['shared_browser','connected_blender','generated_preview'] as const) {
    assert.equal(capabilityEnabled(capability, { COCREATE_HOSTED:'true' }), false);
    assert.equal(capabilityEnabled(capability, {}), true);
  }
  for (const value of ['disabled','true','','ENABLED','typo']) assert.equal(capabilityEnabled('shared_browser', { COCREATE_HOSTED:'true', COCREATE_SHARED_BROWSER:value }), false);
  assert.equal(capabilityEnabled('shared_browser', { COCREATE_HOSTED:'true', COCREATE_SHARED_BROWSER:'enabled' }), true);
});

test('staging preparation separates origin, database, namespace, public build and dispatch flags', () => {
  const config = stagingConfiguration(target, production);
  assert.equal(config.vars.COCREATE_PUBLIC_ORIGIN, target.origin);
  assert.equal(config.containers[0].image_vars.VITE_SUPABASE_URL, target.supabaseUrl);
  assert.equal(config.containers[0].image_vars.COCREATE_RELEASE_CONFIG, 'wrangler.staging.local.jsonc');
  assert.deepEqual(config.routes, []); assert.deepEqual(config.triggers.crons, []);
  assert.equal(config.durable_objects.bindings[0].script_name, undefined);
  for (const flag of ['COCREATE_SHARED_BROWSER','COCREATE_CONNECTED_BLENDER','COCREATE_INTERACTIVE_BLENDER','COCREATE_GENERATED_PREVIEW']) assert.equal(config.vars[flag], 'disabled');
  assert.throws(() => stagingConfiguration({ ...target, origin:production.vars.COCREATE_PUBLIC_ORIGIN }, production), /production/);
  assert.throws(() => stagingConfiguration({ ...target, origin:production.vars.COCREATE_PUBLIC_ORIGIN + '.' }, production), /production/);
  assert.throws(() => stagingConfiguration({ ...target, supabaseUrl:production.vars.SUPABASE_URL }, production), /production/);
  assert.throws(() => stagingConfiguration({ ...target, publishableKey:'sb_secret_private' }, production), /publishable/);
  assert.throws(() => stagingConfiguration({ ...target, origin:target.origin + '/path' }, production), /exact HTTPS/);
  assert.throws(() => stagingConfiguration({ ...target, workerName:production.name }, production), /separate/);
  assert.throws(() => stagingConfiguration({ ...target, secret:'synthetic' } as any, production), /only the five/);
});

test('staging fingerprint binds the selected configuration and rejects changed build settings', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hosted-config-'));
  const selected = path.join(dir, 'staging.json');
  const original = fs.readFileSync('wrangler.jsonc','utf8');
  try {
    fs.writeFileSync(selected, JSON.stringify(stagingConfiguration(target, production)));
    const run = (args: string[]) => spawnSync(process.execPath, ['scripts/release-fingerprint.mjs','--config',selected,...args], {encoding:'utf8',windowsHide:true});
    const prepared = run(['--write-target']); assert.equal(prepared.status,0,prepared.stderr);
    assert.equal(run([]).status,0);
    const config = JSON.parse(fs.readFileSync(selected,'utf8'));
    assert.match(config.vars.COCREATE_RELEASE_FINGERPRINT,/^[a-f0-9]{64}$/);
    assert.notEqual(config.vars.COCREATE_RELEASE_FINGERPRINT,production.vars.COCREATE_RELEASE_FINGERPRINT);
    config.containers[0].image_vars.VITE_COCREATE_APP_ORIGIN = 'https://changed.example.test';
    fs.writeFileSync(selected,JSON.stringify(config));
    assert.notEqual(run([]).status,0);
    assert.equal(fs.readFileSync('wrangler.jsonc','utf8'),original);
  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
});

test('disabled routes reject forged dispatch before runtime/provider work while preserving reads', async () => {
  const flags = ['COCREATE_SHARED_BROWSER','COCREATE_CONNECTED_BLENDER','COCREATE_GENERATED_PREVIEW'] as const;
  const before = flags.map(key => process.env[key]);
  const provider = await createPreviewProviderFixture();
  const f = await createCanvasArtifactsFixture({ previewProvider:provider.provider });
  try {
    for (const key of flags) process.env[key] = 'disabled';
    const headers = { Authorization:`Bearer ${f.token('alice')}`, 'Content-Type':'application/json' };
    for (const [route, body] of [
      ['/browser', { origin:'https://example.com' }],
      ['/browser/fake/input', { epoch:1, commandId:randomUUID(), input:{ kind:'click', x:1, y:1 } }],
      ['/blender/pair', {}],
      ['/previews/connections', { accountId:provider.target.accountId, projectName:provider.target.projectName, credential:'synthetic_scoped_token' }],
      ['/previews/plans/fake/release', { approvePublicPreview:true }],
      ['/previews/plans/fake/RELEASE/', { approvePublicPreview:true }],
      ['/previews/CONNECTIONS/', { accountId:provider.target.accountId,projectName:provider.target.projectName,credential:'synthetic_scoped_token' }],
    ] as const) {
      const response = await fetch(`${f.url}/api/rooms/${f.room.id}${route}`, { method:'POST', headers, body:JSON.stringify(body) });
      assert.equal(response.status, 503, route);
    }
    assert.equal((await fetch(`${f.url}/api/rooms/${f.room.id}/browser/fake/frame`, { headers })).status, 503);
    await assert.rejects(f.manager.blenderPair(f.room, 'alice', async () => {}), /disabled/);
    await assert.rejects((f.manager as any).executeBlenderTask(f.room, {}, [], [], 1, 'synthetic'), /disabled/);
    assert.equal(provider.control.posts, 0); assert.equal(provider.control.reads, 0); assert.equal(f.calls.length, 0);
    assert.equal((await fetch(`${f.url}/api/rooms/${f.room.id}/previews`, { headers })).status, 200);
    const health = await (await fetch(f.url + '/__cocreate/app-health')).json() as any;
    assert.equal(health.capabilities.generated_preview, false); assert.equal(health.capabilities.shared_browser, false);
    f.room.versions.push({ id:1, createdAt:new Date().toISOString(), summary:'Controlled saved artifact', files:applyOperations(undefined,[{type:'write',path:'src/App.tsx',content:'export default function App(){return <main>Saved</main>}'}]), bundle:'fixture',css:'',fileCount:1 });
    const saved = await fetch(`${f.url}/api/rooms/${f.room.id}/download/1`, { headers });
    assert.equal(saved.status, 200); assert.equal(saved.headers.get('cache-control'), 'no-store');
  } finally {
    flags.forEach((key, i) => { if (before[i] === undefined) delete process.env[key]; else process.env[key] = before[i]; });
    await f.close(); await provider.close();
  }
});

test('hosted fixture rejects production, reused identities and unsafe paths; identity mismatch sends no credentials', async () => {
  const projectId = randomUUID();
  const fixture = { target, sourceCommit:'a'.repeat(40), releaseFingerprint:'a'.repeat(64), projectId, otherProjectId:randomUUID(),
    accounts:Object.fromEntries(['owner','editor','viewer','unapproved','outsider','revoked'].map(role => [role, { userId:randomUUID(), accessToken:`synthetic_private_token_${role}` }])),
    artifactPath:`/api/rooms/${projectId}/download/1`, artifactSha256:'b'.repeat(64), storagePath:`${projectId}/bodies/${'b'.repeat(64)}`, storageSha256:'b'.repeat(64), browserSessionId:randomUUID(), blenderSessionId:randomUUID() } as any;
  validateHostedFixture(fixture, production);
  assert.throws(() => validateHostedFixture({ ...fixture, target:{ ...target, origin:production.vars.COCREATE_PUBLIC_ORIGIN } }, production));
  assert.throws(() => validateHostedFixture({ ...fixture, artifactPath:fixture.artifactPath + '?token=secret' }, production));
  assert.throws(() => validateHostedFixture({ ...fixture, storagePath:'../private' }, production));
  assert.throws(() => validateHostedFixture({ ...fixture, accounts:{ ...fixture.accounts, editor:fixture.accounts.owner } }, production));
  const original = globalThis.fetch; const seen: RequestInit[] = [];
  globalThis.fetch = async (_url, init) => { seen.push(init || {}); return new Response(JSON.stringify({ release_fingerprint:'c'.repeat(64) })); };
  try {
    const evidence = await verifyHostedBeta(fixture);
    assert.equal(evidence.complete, false); assert.equal(evidence.checks[0].passed, false);
    assert.equal(seen.length, 1); assert.equal((seen[0].headers as any).Authorization, undefined);
    assert.doesNotMatch(JSON.stringify(evidence), /synthetic_private_token/);
  } finally { globalThis.fetch = original; }
});

test('disabling Blender cancels pending input, fences late completion and leaves STOP/disconnect available', async () => {
  const before = process.env.COCREATE_CONNECTED_BLENDER, interactive = process.env.COCREATE_INTERACTIVE_BLENDER;
  process.env.COCREATE_CONNECTED_BLENDER = 'enabled'; process.env.COCREATE_INTERACTIVE_BLENDER = 'linux-xvfb-v1';
  const f = await createCanvasArtifactsFixture();
  try {
    const pair = await f.manager.blenderPair(f.room, 'alice', async () => {});
    const credential = randomBytes(32).toString('base64url');
    const device = await f.manager.blenderApprove(f.room, pair.pairingToken, { credential, name:'Controlled receipt fixture', observe:['bob'], control:['bob'], operations:[...BLENDER_OPERATIONS], blenderVersion:BLENDER_VERSION, localApproval:true, interactivePolicy:INTERACTIVE_BLENDER_POLICY }, async () => {});
    const command = await f.manager.blenderInteractiveCommand(f.room, device.id, 'alice', { requestId:randomUUID(),epoch:1,action:'open' }, async () => {});
    process.env.COCREATE_CONNECTED_BLENDER = 'disabled';
    const poll = await f.manager.blenderPoll(f.room, device.id, credential, async () => {});
    assert.equal(poll.session.paused, true); assert.equal(poll.interactive?.state, 'cancel_requested');
    await assert.rejects(f.manager.blenderInteractiveResult(f.room, device.id, credential, { commandId:command.id,epoch:1,state:'completed' }, async () => {}), /disabled/);
    assert.throws(() => f.manager.blenderReadFrame(f.room, device.id, 'alice'), /disabled/);
    assert.doesNotThrow(() => sessionCommand(f.room.blender!, device.id, 'alice', { action:'disconnect',epoch:1 }));
    assert.equal(f.room.blender!.devices[0].state, 'revoked'); assert.equal(f.calls.length, 0);
  } finally {
    before === undefined ? delete process.env.COCREATE_CONNECTED_BLENDER : process.env.COCREATE_CONNECTED_BLENDER = before;
    interactive === undefined ? delete process.env.COCREATE_INTERACTIVE_BLENDER : process.env.COCREATE_INTERACTIVE_BLENDER = interactive;
    await f.close();
  }
});
