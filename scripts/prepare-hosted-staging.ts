import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export type StagingTarget = { accountId: string; workerName: string; origin: string; supabaseUrl: string; publishableKey: string };

export function stagingConfiguration(target: StagingTarget, production: any) {
  if (Object.keys(target).sort().join() !== 'accountId,origin,publishableKey,supabaseUrl,workerName') throw new Error('Use only the five public staging target fields. Secrets are configured separately.');
  if (!/^[a-f0-9]{32}$/.test(target.accountId) || !/^cocreate-[a-z0-9-]*staging$/.test(target.workerName) || target.workerName === production.name) throw new Error('Select an explicit separate staging Worker and account.');
  const origin = new URL(target.origin), backend = new URL(target.supabaseUrl);
  const exactOrigin = (url: URL, value: string) => url.origin === value && url.protocol === 'https:' && !url.username && !url.password;
  if (!exactOrigin(origin, target.origin) || !exactOrigin(backend, target.supabaseUrl) || !/^[a-z]{20}\.supabase\.co$/.test(backend.hostname)) throw new Error('Select exact HTTPS staging and Supabase origins.');
  const productionHosts = [production.vars.COCREATE_PUBLIC_ORIGIN, production.vars.COCREATE_LEGACY_ORIGIN, production.vars.COCREATE_WWW_ORIGIN].filter(Boolean).map(value => new URL(String(value)).hostname);
  if (productionHosts.includes(origin.hostname) || backend.origin === production.vars.SUPABASE_URL) throw new Error('Staging must not use the production origin or database.');
  if (!/^sb_publishable_[A-Za-z0-9_-]{10,}$/.test(target.publishableKey)) throw new Error('Use a publishable key, never a server secret.');
  const config = structuredClone(production);
  config.name = target.workerName; config.account_id = target.accountId;
  config.routes = []; config.triggers = { crons: [] }; config.preview_urls = false;
  config.vars = {
    COCREATE_APP_ORIGINS: target.origin, COCREATE_PUBLIC_ORIGIN: target.origin,
    SUPABASE_URL: target.supabaseUrl, SUPABASE_PUBLISHABLE_KEY: target.publishableKey,
    SUPABASE_JWKS_URL: `${target.supabaseUrl}/auth/v1/.well-known/jwks.json`,
    SUPABASE_ARTIFACT_BUCKET: 'cocreate-artifacts', COCREATE_RELEASE_FINGERPRINT: 'pending',
    COCREATE_SHARED_BROWSER: 'disabled', COCREATE_CONNECTED_BLENDER: 'disabled',
    COCREATE_INTERACTIVE_BLENDER: 'disabled', COCREATE_GENERATED_PREVIEW: 'disabled',
  };
  config.containers[0].image_vars = {
    VITE_COCREATE_AUTH_MODE: 'supabase', VITE_COCREATE_APP_ORIGIN: target.origin,
    VITE_SUPABASE_URL: target.supabaseUrl, VITE_SUPABASE_PUBLISHABLE_KEY: target.publishableKey,
    COCREATE_RELEASE_CONFIG: 'wrangler.staging.local.jsonc',
  };
  config.containers[0].max_instances = 1;
  // A new Worker owns a new namespace; never name a production script or namespace.
  config.durable_objects = { bindings: [{ name: 'COCREATE_CONTAINER', class_name: 'CoCreateContainer' }] };
  return config;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const targetIndex = process.argv.indexOf('--target');
  if (targetIndex < 0 || !process.argv[targetIndex + 1]) throw new Error('Usage: node --import tsx scripts/prepare-hosted-staging.ts --target <public-target.json>. This only writes local configuration.');
  const target = JSON.parse(fs.readFileSync(process.argv[targetIndex + 1], 'utf8'));
  const config = stagingConfiguration(target, JSON.parse(fs.readFileSync('wrangler.jsonc', 'utf8')));
  const output = 'wrangler.staging.local.jsonc';
  fs.writeFileSync(output, JSON.stringify(config, null, 2) + '\n', { mode: 0o600 });
  const result = spawnSync(process.execPath, ['scripts/release-fingerprint.mjs', '--config', output, '--write-target'], { encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) throw new Error('Staging fingerprint preparation failed. Inspect local configuration; no provider was contacted.');
  console.log(JSON.stringify({ configuration: output, identity: JSON.parse(result.stdout), scope: 'Local preparation only; no cloud resource, migration, credential or release' }));
}
