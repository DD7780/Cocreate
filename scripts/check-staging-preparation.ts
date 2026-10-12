import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { stagingConfiguration, type StagingTarget } from './prepare-hosted-staging.js';

export type AccountInspection = {
  checkedAt: string;
  source: 'provider_dashboard' | 'provider_api' | 'mixed' | 'incomplete';
  supabase: { organizationId: string; plan: string; activeVisibleProjects: number; freeEligibilityConfirmed: boolean | null };
  cloudflare: { accountId: string; workersPaidConfirmed: boolean | null; billingCycleStart: string | null; billingCycleEnd: string | null };
};

const keys = (value: unknown, expected: string[]) => {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).sort().join() !== expected.sort().join()) throw new Error('Inspection must contain only declared public fields.');
};

export function checkStagingPreparation(inspection: AccountInspection, target: StagingTarget | null, production: any, now = Date.now()) {
  keys(inspection, ['checkedAt','source','supabase','cloudflare']);
  keys(inspection.supabase, ['organizationId','plan','activeVisibleProjects','freeEligibilityConfirmed']);
  keys(inspection.cloudflare, ['accountId','workersPaidConfirmed','billingCycleStart','billingCycleEnd']);
  const { supabase, cloudflare } = inspection;
  if (typeof inspection.checkedAt !== 'string' || !['provider_dashboard','provider_api','mixed','incomplete'].includes(inspection.source) ||
      !/^[a-z]{20}$/.test(supabase.organizationId) || !/^[a-f0-9]{32}$/.test(cloudflare.accountId) ||
      !['free','pro','team','enterprise'].includes(supabase.plan) || !Number.isSafeInteger(supabase.activeVisibleProjects) || supabase.activeVisibleProjects < 0 ||
      ![true,false,null].includes(supabase.freeEligibilityConfirmed) || ![true,false,null].includes(cloudflare.workersPaidConfirmed) ||
      [cloudflare.billingCycleStart,cloudflare.billingCycleEnd].some(value => value !== null && (typeof value !== 'string' || !Number.isFinite(Date.parse(value))))) throw new Error('Invalid public account inspection.');
  const checks: Array<{ name: string; passed: boolean }> = [];
  const check = (name: string, passed: boolean) => checks.push({ name, passed });
  const age = now - Date.parse(inspection.checkedAt);
  check('fresh_account_inspection', Number.isFinite(age) && age >= -300_000 && age <= 86_400_000);
  check('provider_inspection_complete', inspection.source !== 'incomplete');
  check('expected_supabase_organization', supabase.organizationId === 'lflzfrqblfyjopsjuqxk');
  check('free_project_eligible', supabase.plan === 'free' && supabase.activeVisibleProjects < 2 && supabase.freeEligibilityConfirmed === true);
  check('expected_cloudflare_account', cloudflare.accountId === production.account_id);
  check('existing_workers_paid', cloudflare.workersPaidConfirmed === true);
  check('current_billing_cycle', cloudflare.billingCycleStart !== null && cloudflare.billingCycleEnd !== null && Date.parse(cloudflare.billingCycleStart) <= now && Date.parse(cloudflare.billingCycleEnd) > now);
  const readyForResourceReview = checks.every(item => item.passed);
  let config: any = null;
  if (target) {
    try {
      config = stagingConfiguration(target, production);
      if (target.accountId !== cloudflare.accountId || target.workerName !== 'cocreate-beta-staging' || target.origin !== 'https://cocreate-beta-staging.susan981314271.workers.dev' || config.containers.length !== 1 || config.containers[0].instance_type !== 'basic' || config.containers[0].max_instances !== 1 ||
          config.routes.length || config.triggers.crons.length || config.durable_objects.bindings.some((binding: any) => binding.script_name || binding.namespace_id) ||
          ['COCREATE_SHARED_BROWSER','COCREATE_CONNECTED_BLENDER','COCREATE_INTERACTIVE_BLENDER','COCREATE_GENERATED_PREVIEW'].some(flag => config.vars[flag] !== 'disabled')) config = null;
    } catch { config = null; }
  }
  check('allocated_isolated_public_target', config !== null);
  return {
    checkedAt: new Date(now).toISOString(), scope: 'Local preparation and operator inspection review; not independently authenticated provider or hosted proof',
    readyForResourceReview, publicConfigurationPrepared: config !== null,
    draftConfigurationSha256: config ? createHash('sha256').update(JSON.stringify(config)).digest('hex') : null,
    proposedResources: { supabaseProject: 'cocreate-beta-staging', worker: 'cocreate-beta-staging', container: 'one basic instance', pages: 'none for platform staging' },
    proposedOrigin: 'https://cocreate-beta-staging.susan981314271.workers.dev',
    login: { path: '/login', method: 'Separate designated account; password entered directly in staging UI or user password manager; no credentials in public evidence' },
    checks, pending: checks.filter(item => !item.passed).map(item => item.name),
    creationAuthorized: false, deploymentPerformed: false, hostedVerified: false, mainPushPerformed: false,
    authority: 'Review actual provider evidence and obtain concrete creation/metered-operation approval; this report cannot authorize any cloud mutation',
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const argument = (name: string) => { const index = process.argv.indexOf(name); return index < 0 ? undefined : process.argv[index + 1]; };
    const inspectionFile = argument('--inspection');
    if (!inspectionFile) throw new Error('Select a public account inspection.');
    const targetFile = argument('--target');
    const result = checkStagingPreparation(JSON.parse(fs.readFileSync(inspectionFile,'utf8')), targetFile ? JSON.parse(fs.readFileSync(targetFile,'utf8')) : null, JSON.parse(fs.readFileSync('wrangler.jsonc','utf8')));
    const candidateCommit = execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8',windowsHide:true}).trim();
    const workingTreeClean = execFileSync('git',['status','--porcelain'],{encoding:'utf8',windowsHide:true}).trim() === '';
    fs.mkdirSync('.runtime/hosted-beta', { recursive: true });
    fs.writeFileSync('.runtime/hosted-beta/preparation-checks.json',JSON.stringify({candidateCommit,workingTreeClean,...result},null,2)+'\n');
    console.log(JSON.stringify({ readyForResourceReview:result.readyForResourceReview, publicConfigurationPrepared:result.publicConfigurationPrepared, pending:result.pending, report:'.runtime/hosted-beta/preparation-checks.json', cloudMutationPerformed:false }));
    if (!result.readyForResourceReview || !result.publicConfigurationPrepared) process.exitCode = 2;
  } catch { console.error('Staging preparation check failed. Use only declared public inspection/target fields; no provider was contacted.'); process.exitCode = 1; }
}
