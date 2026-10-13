import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { randomUUID, createHash } from 'node:crypto';
import { serverSecrets } from '../server/credentials.js';
import { createCoCreateServer } from '../server/index.js';
import { documentationOnlyHandoff, releaseGates, type ReleaseEvidence } from '../scripts/prepare-main-release.js';
import { validateHostedFixture, verifyHostedBeta, type HostedFixture } from '../scripts/verify-hosted-beta.js';

const config = JSON.parse(fs.readFileSync('wrangler.jsonc','utf8'));
const fullBetaConfig = structuredClone(config);
Object.assign(fullBetaConfig.vars, { COCREATE_SHARED_BROWSER:'enabled', COCREATE_CONNECTED_BLENDER:'enabled', COCREATE_INTERACTIVE_BLENDER:'linux-xvfb-v1', COCREATE_GENERATED_PREVIEW:'enabled' });
const source = 'a'.repeat(40), fingerprint = 'b'.repeat(64), origin = 'https://cocreate-beta-staging.example.test';
const now = Date.now();
const proof = (names: string[]) => ({ environment: 'designated isolated staging' as const, sourceCommit: source, stagingOrigin: origin, releaseFingerprint: fingerprint, checkedAt: new Date(now).toISOString(), checks: names.map(name => ({ name, passed: true })) });
const roles = ['owner','editor','viewer','unapproved','outsider','revoked'];
function evidence(): ReleaseEvidence {
  return {
    staging: { origin, supabaseUrl: `https://${'a'.repeat(20)}.supabase.co`, releaseFingerprint: fingerprint, configSha256: 'c'.repeat(64), workerVersion: 'fixture-worker', containerVersion: 'fixture-container', imageDigest: `sha256:${'d'.repeat(64)}`, migrationsVerified: true, privateConfigurationVerified: true },
    permissions: { ...proof(['exact_candidate_health','public_prelaunch','beta_approval_required','storage_public_URL_denied','anonymous_direct_RLS','anonymous_project_api_denied','anonymous_artifact_denied','anonymous_socket_denied','viewer_submit_denied','viewer_budget_reset_denied','viewer_provider_connection_denied','viewer_project_edit_denied','viewer_role_escalation_denied', ...roles.flatMap(role => [`${role}_real_identity`,`${role}_direct_RLS`,`${role}_cross_project_RLS`,`${role}_private_storage`,`${role}_cross_project_denied`,`${role}_private_artifact`,`${role}_socket`]), ...['owner','editor','viewer'].flatMap(role => [`${role}_project_role`,`${role}_room_state`,`${role}_cross_project_artifact_denied`]),'outsider_approval_not_membership','revoked_approval_not_membership']), permissionChecksPassed: true },
    recovery: proof(['independent_signed_in_profiles','shared_canvas_convergence','independent_artifact_selection','document_version_download_recovery','caller_artifact_attribution','unsubmitted_zero_inference','concurrent_caller_only','duplicate_no_execution','artifact_usage_convergence','live_revocation','warm_private_download_revocation','beta_revoked_download_denied','private_download_restore','legacy_storage_cache_cutoff','stale_coordinator_fenced','disconnect_reconnect','process_replacement','previous_artifact_retained','no_paid_replay','uncertain_action_reconciliation','empty_cache_private_restore','auth_callback_recovery','manual_beta_gate','hosted_compiler_browser_boundary']),
    ci: { sourceCommit: source, conclusion: 'success', url: 'https://github.com/DD7780/Cocreate/actions/runs/1234' },
    compatibleRecoveryImage: { digest: `sha256:${'e'.repeat(64)}`, snapshotVersion: 6, tested: true },
    optional: {
      sharedBrowser: proof(['two_participants','private_login_grants','controller_handoff','stale_command_denied','network_file_isolation','stop_disconnect_recovery','private_download']),
      connectedBlender: proof(['two_participants','pairing_grants','controller_handoff','stop_recovery','private_outputs']),
      interactiveBlender: proof(['dedicated_host_boundary','actual_view_input','human_agent_exclusion','two_participants','stop_private_outputs']),
      generatedPreview: proof(['exact_approved_target_plan','scoped_server_credentials','durable_provider_receipt','live_exact_bytes_behavior','uncertain_reconciliation','reviewed_previous_version_recovery']),
    },
  };
}

test('hosted startup never falls back to local signing or encryption secrets', async () => {
  const privateOptions = { sessionSecret: 'a'.repeat(40), encryptionSecret: 'b'.repeat(40) }, hosted = { COCREATE_HOSTED:'true' };
  assert.deepEqual(serverSecrets(privateOptions, hosted), privateOptions);
  for (const sessionSecret of [undefined,'short','replace-with-a-long-random-value','cocreate-local-session-secret',' '+ 'a'.repeat(40),'a'.repeat(513)]) assert.throws(() => serverSecrets({ ...privateOptions, sessionSecret }, hosted), /SESSION_SECRET/);
  assert.throws(() => serverSecrets({ sessionSecret:privateOptions.sessionSecret }, hosted), /CREDENTIAL_ENCRYPTION_SECRET/);
  assert.throws(() => serverSecrets({ sessionSecret:privateOptions.sessionSecret, encryptionSecret:privateOptions.sessionSecret }, hosted), /independent/);
  assert.equal(serverSecrets({}, {}).sessionSecret, 'cocreate-local-session-secret');
  assert.equal(serverSecrets({sessionSecret:'synthetic'}, {}).encryptionSecret, 'synthetic');
  const before = process.env.COCREATE_HOSTED;
  process.env.COCREATE_HOSTED = 'true';
  try { await assert.rejects(createCoCreateServer({ sessionSecret:'short', encryptionSecret:privateOptions.encryptionSecret }), /SESSION_SECRET/); }
  finally { before === undefined ? delete process.env.COCREATE_HOSTED : process.env.COCREATE_HOSTED = before; }
});

test('full beta release requires every intended capability and exact hosted evidence', () => {
  const absent = JSON.parse(fs.readFileSync('docs/harness/production-evidence.example.json','utf8'));
  const blocked = releaseGates(source,config,absent,now);
  assert.equal(blocked.readyForProductionReview,false);
  assert.ok(blocked.pending.includes('real_hosted_permissions'));
  assert.ok(blocked.pending.includes('hosted_collaboration_recovery'));
  assert.ok(blocked.pending.includes('v6_compatible_recovery_image'));
  const prepared = releaseGates(source,fullBetaConfig,evidence(),now);
  assert.equal(prepared.readyForProductionReview,true);
  assert.match(prepared.authorization,/Separate concrete user approval/);
  for (const [flag, key] of [['COCREATE_SHARED_BROWSER','sharedBrowser'],['COCREATE_CONNECTED_BLENDER','connectedBlender'],['COCREATE_INTERACTIVE_BLENDER','interactiveBlender'],['COCREATE_GENERATED_PREVIEW','generatedPreview']] as const) {
    const disabled = structuredClone(fullBetaConfig); disabled.vars[flag] = 'disabled';
    assert.ok(releaseGates(source,disabled,evidence(),now).pending.includes(`${flag}_enabled_and_verified`));
    const missing = evidence(); missing.optional[key] = null;
    assert.ok(releaseGates(source,fullBetaConfig,missing,now).pending.includes(`${flag}_enabled_and_verified`));
    const partial = evidence(); partial.optional[key]!.checks.pop();
    assert.equal(releaseGates(source,fullBetaConfig,partial,now).readyForProductionReview,false);
  }
  for (const name of ['shared_canvas_convergence','independent_artifact_selection','document_version_download_recovery','caller_artifact_attribution','warm_private_download_revocation','beta_revoked_download_denied','private_download_restore','legacy_storage_cache_cutoff']) {
    const missing = evidence(); missing.recovery!.checks = missing.recovery!.checks.filter(check => check.name !== name);
    assert.ok(releaseGates(source,fullBetaConfig,missing,now).pending.includes('hosted_collaboration_recovery'));
  }
});

test('release gates reject stale, failed, partial, production and mismatched candidate proof', () => {
  for (const mutate of [
    (input: ReleaseEvidence) => { input.permissions!.sourceCommit = 'f'.repeat(40); },
    (input: ReleaseEvidence) => { (input.permissions as any).environment = 'controlled test transport'; },
    (input: ReleaseEvidence) => { input.permissions!.checks = input.permissions!.checks.filter(check => check.name !== 'viewer_submit_denied'); },
    (input: ReleaseEvidence) => { input.permissions!.checks[0].passed = false; },
    (input: ReleaseEvidence) => { input.permissions!.checkedAt = new Date(now - 90_000_000).toISOString(); },
    (input: ReleaseEvidence) => { input.recovery!.releaseFingerprint = 'f'.repeat(64); },
    (input: ReleaseEvidence) => { input.staging!.supabaseUrl = config.vars.SUPABASE_URL; },
    (input: ReleaseEvidence) => { input.staging!.origin = config.vars.COCREATE_PUBLIC_ORIGIN; },
    (input: ReleaseEvidence) => { input.compatibleRecoveryImage!.snapshotVersion = 5; },
    (input: ReleaseEvidence) => { input.ci!.sourceCommit = 'f'.repeat(40); },
  ]) {
    const input = evidence(); mutate(input);
    assert.equal(releaseGates(source,fullBetaConfig,input,now).readyForProductionReview,false);
  }
  const unknown = structuredClone(config); unknown.vars.COCREATE_SHARED_BROWSER = 'typo';
  assert.equal(releaseGates(source,unknown,evidence(),now).readyForProductionReview,false);
  const alternateProduction = evidence(); alternateProduction.staging!.origin = config.vars.COCREATE_PUBLIC_ORIGIN + '.';
  assert.equal(releaseGates(source,config,alternateProduction,now).readyForProductionReview,false);
  assert.equal(documentationOnlyHandoff(['context.md','docs/harness/checklist.md','artifacts/release/receipt.json','graphify-out/graph.json']),true);
  for(const file of ['server/credentials.ts','public/terms.md','scripts/prepare-main-release.ts','tests/production-release.test.ts','wrangler.jsonc','.github/workflows/code-checks.yml'])assert.equal(documentationOnlyHandoff([file]),false,file);
});

test('permission runner exercises actual contracts without treating disabled grants or uncertain replies as proof', async () => {
  const projectId = randomUUID(), bytes = Buffer.from('Controlled private fixture'), bytesHash = createHash('sha256').update(bytes).digest('hex');
  const fixture: HostedFixture = {
    sourceCommit: source, releaseFingerprint: fingerprint,
    target: { accountId:'a'.repeat(32), workerName:'cocreate-test-staging', origin, supabaseUrl:`https://${'a'.repeat(20)}.supabase.co`, publishableKey:'sb_publishable_controlled_fixture' },
    projectId, otherProjectId:randomUUID(),
    accounts: Object.fromEntries(roles.map(role => [role,{ userId:randomUUID(),accessToken:`synthetic_private_token_${role}` }])) as HostedFixture['accounts'],
    artifactPath:`/api/rooms/${projectId}/download/1`, artifactSha256:bytesHash,
    storagePath:`${projectId}/bodies/${bytesHash}`, storageSha256:bytesHash,
    browserSessionId:randomUUID(), blenderSessionId:randomUUID(),
  };
  validateHostedFixture(fixture,config);
  assert.throws(() => validateHostedFixture({ ...fixture,sourceCommit:'not-a-commit' },config));
  const original = globalThis.fetch; let uncertain = false, uncertainRequests = 0;
  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input)), token = (init?.headers as Record<string,string>)?.Authorization?.slice(7);
    const role = roles.find(role => fixture.accounts[role as keyof typeof fixture.accounts].accessToken === token || token === `ticket_${role}`);
    const member = !!role && ['owner','editor','viewer'].includes(role);
    const response = (body: unknown, status = 200) => new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});
    if(url.pathname === '/__cocreate/app-health')return response({ release_fingerprint:fingerprint });
    if(url.pathname === '/')return response({});
    if(url.pathname === '/auth/v1/user')return response({ id:fixture.accounts[role as keyof typeof fixture.accounts].userId });
    if(url.pathname === '/rest/v1/projects')return response(member && url.searchParams.get('id') === `eq.${projectId}` ? [{ id:projectId }] : []);
    if(url.pathname.startsWith('/storage/'))return response({},403);
    if(url.pathname.endsWith('/session'))return member && !url.pathname.includes(fixture.otherProjectId) ? response({role,participantId:fixture.accounts[role as keyof typeof fixture.accounts].userId,token:`ticket_${role}`}) : response({},403);
    if(url.pathname === '/api/projects')return role ? response({projects:[]},role === 'unapproved' ? 403 : 200) : response({},401);
    if(init?.method === 'PATCH')return response({},403);
    if(init?.method === 'POST') {
      if(uncertain && url.pathname.endsWith('/submit')) { uncertainRequests++; throw new Error('Controlled unknown response'); }
      return response({},403);
    }
    if(url.pathname.endsWith('/state'))return response({});
    if(url.pathname.endsWith('/frame'))return response({},503);
    if(url.pathname.includes(fixture.otherProjectId))return response({},401);
    if(url.pathname === fixture.artifactPath)return token && member ? new Response(bytes,{headers:{'Cache-Control':'no-store'}}) : response({},401);
    throw new Error('Unrecognized controlled request');
  };
  try {
    const result = await verifyHostedBeta(fixture,async () => true);
    assert.equal(result.permissionChecksPassed,true,JSON.stringify(result.checks.filter(check => !check.passed)));
    assert.equal(result.complete,false);
    assert.equal(result.environment,'controlled test transport');
    assert.ok(result.pending.some(item => item.includes('capability disabled')));
    assert.doesNotMatch(JSON.stringify(result),/synthetic_private_token/);
    uncertain = true;
    const failed = await verifyHostedBeta(fixture,async () => true);
    assert.equal(failed.permissionChecksPassed,false);
    assert.equal(failed.checks.find(check => check.name === 'viewer_submit_denied')?.passed,false);
    assert.equal(uncertainRequests,1,'the runner does not retry an uncertain mutation');
  } finally { globalThis.fetch = original; }
});
