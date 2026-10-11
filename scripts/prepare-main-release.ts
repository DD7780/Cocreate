import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const hash = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const sha = /^[a-f0-9]{64}$/, commit = /^[a-f0-9]{40}$/;
const roles = ['owner','editor','viewer','unapproved','outsider','revoked'];
const recoveryChecks = ['independent_signed_in_profiles','unsubmitted_zero_inference','concurrent_caller_only','duplicate_no_execution','artifact_usage_convergence','live_revocation','stale_coordinator_fenced','disconnect_reconnect','process_replacement','previous_artifact_retained','no_paid_replay','uncertain_action_reconciliation','empty_cache_private_restore','auth_callback_recovery','manual_beta_gate','hosted_compiler_browser_boundary'];
export const documentationOnlyHandoff = (changed: string[]) => changed.every(file => /^(?:docs\/|artifacts\/|graphify-out\/)/.test(file) || /^(?:README|AGENTS|context|product|instructions|api)\.md$/.test(file));
type Check = { name: string; passed: boolean };
type Proof = { environment: 'designated isolated staging'; sourceCommit: string; stagingOrigin: string; releaseFingerprint: string; checkedAt: string; checks: Check[] };
export type ReleaseEvidence = {
  staging: { origin: string; supabaseUrl: string; releaseFingerprint: string; configSha256: string; workerVersion: string; containerVersion: string; imageDigest: string; migrationsVerified: boolean; privateConfigurationVerified: boolean } | null;
  permissions: (Proof & { permissionChecksPassed: boolean }) | null;
  recovery: Proof | null;
  ci: { sourceCommit: string; conclusion: string; url: string } | null;
  compatibleRecoveryImage: { digest: string; snapshotVersion: number; tested: boolean } | null;
  optional: { sharedBrowser: Proof | null; connectedBlender: Proof | null; interactiveBlender: Proof | null; generatedPreview: Proof | null };
};

export function releaseGates(sourceCommit: string, config: any, evidence: ReleaseEvidence, now = Date.now()) {
  if (!commit.test(sourceCommit)) throw new Error('Select the exact candidate commit.');
  const gates: Check[] = [];
  const check = (name: string, passed: boolean) => gates.push({ name, passed });
  const stage = evidence.staging;
  const exactStage = !!stage && sha.test(stage.releaseFingerprint) && sha.test(stage.configSha256) &&
    stage.origin.startsWith('https://') && new URL(stage.origin).origin === stage.origin &&
    ![config.vars.COCREATE_PUBLIC_ORIGIN, config.vars.COCREATE_WWW_ORIGIN, config.vars.COCREATE_LEGACY_ORIGIN].filter(Boolean).some(value => new URL(String(value)).hostname === new URL(stage.origin).hostname.replace(/\.$/, '')) &&
    /^https:\/\/[a-z]{20}\.supabase\.co$/.test(stage.supabaseUrl) && stage.supabaseUrl !== config.vars.SUPABASE_URL;
  check('isolated_staging_identity', exactStage);
  check('staging_provider_receipt', !!stage?.workerVersion && !!stage?.containerVersion && /^sha256:[a-f0-9]{64}$/.test(stage?.imageDigest || ''));
  check('staging_schema_private_configuration', stage?.migrationsVerified === true && stage?.privateConfigurationVerified === true);
  const validProof = (proof: Proof | null | undefined) => !!proof && proof.environment === 'designated isolated staging' && exactStage && proof.sourceCommit === sourceCommit && proof.stagingOrigin === stage!.origin && proof.releaseFingerprint === stage!.releaseFingerprint && Number.isFinite(Date.parse(proof.checkedAt)) && now - Date.parse(proof.checkedAt) >= -300_000 && now - Date.parse(proof.checkedAt) <= 86_400_000 && Array.isArray(proof.checks) && proof.checks.length > 0 && new Set(proof.checks.map(item => item.name)).size === proof.checks.length && proof.checks.every(item => item.passed === true);
  const requiredPermissionNames = ['exact_candidate_health','public_prelaunch','beta_approval_required','storage_public_URL_denied','anonymous_direct_RLS','anonymous_project_api_denied','anonymous_artifact_denied','anonymous_socket_denied','viewer_submit_denied','viewer_budget_reset_denied','viewer_provider_connection_denied','viewer_project_edit_denied','viewer_role_escalation_denied', ...roles.flatMap(role => [`${role}_real_identity`,`${role}_direct_RLS`,`${role}_cross_project_RLS`,`${role}_private_storage`,`${role}_cross_project_denied`,`${role}_private_artifact`,`${role}_socket`]), ...['owner','editor','viewer'].flatMap(role => [`${role}_project_role`,`${role}_room_state`,`${role}_cross_project_artifact_denied`]),'outsider_approval_not_membership','revoked_approval_not_membership'];
  const contains = (proof: Proof | null | undefined, names: string[]) => validProof(proof) && names.every(name => proof!.checks.some(item => item.name === name && item.passed === true));
  check('real_hosted_permissions', evidence.permissions?.permissionChecksPassed === true && contains(evidence.permissions, requiredPermissionNames));
  check('hosted_collaboration_recovery', contains(evidence.recovery, recoveryChecks));
  check('exact_candidate_CI', evidence.ci?.sourceCommit === sourceCommit && evidence.ci?.conclusion === 'success' && /^https:\/\/github\.com\/DD7780\/Cocreate\/actions\/runs\/\d+$/.test(evidence.ci?.url || ''));
  check('v6_compatible_recovery_image', evidence.compatibleRecoveryImage?.snapshotVersion === 6 && evidence.compatibleRecoveryImage?.tested === true && /^sha256:[a-f0-9]{64}$/.test(evidence.compatibleRecoveryImage?.digest || ''));
  for (const [flag, proof, required] of [
    ['COCREATE_SHARED_BROWSER', evidence.optional?.sharedBrowser, ['two_participants','private_login_grants','controller_handoff','stale_command_denied','network_file_isolation','stop_disconnect_recovery','private_download']],
    ['COCREATE_CONNECTED_BLENDER', evidence.optional?.connectedBlender, ['two_participants','pairing_grants','controller_handoff','stop_recovery','private_outputs']],
    ['COCREATE_INTERACTIVE_BLENDER', evidence.optional?.interactiveBlender, ['dedicated_host_boundary','actual_view_input','human_agent_exclusion','two_participants','stop_private_outputs']],
    ['COCREATE_GENERATED_PREVIEW', evidence.optional?.generatedPreview, ['exact_approved_target_plan','scoped_server_credentials','durable_provider_receipt','live_exact_bytes_behavior','uncertain_reconciliation','reviewed_previous_version_recovery']],
  ] as const) {
    const enabled = flag === 'COCREATE_INTERACTIVE_BLENDER' ? config.vars[flag] === 'linux-xvfb-v1' : config.vars[flag] === 'enabled';
    const validFlag = config.vars[flag] === 'disabled' || enabled;
    check(`${flag}_verified_or_disabled`, validFlag && (!enabled || contains(proof, [...required])));
  }
  check('interactive_requires_connected_Blender', config.vars.COCREATE_INTERACTIVE_BLENDER === 'disabled' || config.vars.COCREATE_CONNECTED_BLENDER === 'enabled');
  return { readyForProductionReview: gates.every(item => item.passed), gates, pending: gates.filter(item => !item.passed).map(item => item.name), authorization: 'Separate concrete user approval required; evidence files do not authorize a push or deployment' };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const argument = process.argv.indexOf('--evidence');
    if (argument < 0 || !process.argv[argument + 1]) throw new Error('Select a public evidence manifest.');
    const git = (...args: string[]) => { const result = spawnSync('git', args, { encoding: 'utf8', windowsHide: true }); if (result.status !== 0) throw new Error('Candidate Git inspection failed.'); return result.stdout.trim(); };
    const candidateCommit = git('rev-parse','HEAD'), mainCommit = git('rev-parse','origin/main');
    const tested = process.argv.indexOf('--tested-source');
    const sourceCommit = tested < 0 ? candidateCommit : process.argv[tested + 1];
    if (!sourceCommit || !commit.test(sourceCommit) || git('merge-base',sourceCommit,candidateCommit) !== sourceCommit) throw new Error('Select an ancestor implementation commit.');
    const changed = git('diff','--name-only',sourceCommit,candidateCommit).split('\n').filter(Boolean);
    const docsOnlyHandoff = documentationOnlyHandoff(changed);
    const fastForward = git('merge-base',mainCommit,candidateCommit) === mainCommit;
    const configBytes = fs.readFileSync('wrangler.jsonc'), config = JSON.parse(configBytes.toString());
    const fingerprint = spawnSync(process.execPath, ['scripts/release-fingerprint.mjs'], { encoding: 'utf8', windowsHide: true });
    if (fingerprint.status !== 0) throw new Error('Prepare the candidate fingerprint before release review.');
    const evidence = JSON.parse(fs.readFileSync(process.argv[argument + 1], 'utf8')) as ReleaseEvidence;
    const result = releaseGates(sourceCommit, config, evidence);
    result.gates.push({ name: 'main_fast_forward', passed: fastForward }, { name: 'tested_source_unchanged', passed: docsOnlyHandoff }, { name: 'clean_working_tree', passed: git('status','--porcelain') === '' });
    result.pending = result.gates.filter(item => !item.passed).map(item => item.name);
    result.readyForProductionReview = result.pending.length === 0;
    const plan = { preparedAt: new Date().toISOString(), candidateCommit, sourceCommit, mainCommit, integration: fastForward ? 'fast-forward; source tree unchanged' : 'integration required and affected checks must rerun', tree: git('rev-parse','HEAD^{tree}'), fingerprint: config.vars.COCREATE_RELEASE_FINGERPRINT, configSha256: hash(configBytes), target: { accountId: config.account_id, worker: config.name, origin: config.vars.COCREATE_PUBLIC_ORIGIN, supabaseUrl: config.vars.SUPABASE_URL }, capabilities: Object.fromEntries(Object.entries(config.vars).filter(([key]) => /^COCREATE_(SHARED_BROWSER|CONNECTED_BLENDER|INTERACTIVE_BLENDER|GENERATED_PREVIEW)$/.test(key))), ...result, platformDeployed: false, generatedPreviewDeployed: false };
    fs.mkdirSync('.runtime/hosted-beta', { recursive: true });
    fs.writeFileSync('.runtime/hosted-beta/main-candidate.json', JSON.stringify(plan, null, 2) + '\n', { mode: 0o600 });
    console.log(JSON.stringify({ candidateCommit, sourceCommit, mainCommit, readyForProductionReview: result.readyForProductionReview, pending: result.pending, plan: '.runtime/hosted-beta/main-candidate.json', pushPerformed: false }));
    if (!result.readyForProductionReview) process.exitCode = 2;
  } catch { console.error('Main-candidate preparation failed. Inspect public configuration/evidence and Git state; no push or deployment performed.'); process.exitCode = 1; }
}
