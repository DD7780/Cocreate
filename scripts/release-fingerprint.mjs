import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

// Attest source/build inputs without a self-referential Git revision or mutable runtime environment.
const manifest = 'release-source-files.json';
const buildFiles = ['Dockerfile', 'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'vite.config.ts', 'tsconfig.json', 'index.html', 'scripts/start-container.sh', 'scripts/release-fingerprint.mjs', manifest];
if (process.argv.includes('--write-config')) {
  const tracked = spawnSync('git', ['ls-files', '-z', '--', 'server', 'src', 'shared', 'worker', 'public'], {encoding: 'utf8', windowsHide: true});
  if (tracked.status !== 0) throw new Error('Tracked release inputs unavailable.');
  const names = [...new Set([...tracked.stdout.split('\0').filter(Boolean), ...buildFiles])].sort();
  fs.writeFileSync(manifest, JSON.stringify(names, null, 2) + '\n');
}
const files = JSON.parse(fs.readFileSync(manifest, 'utf8'));
if (!Array.isArray(files) || files.some(file => typeof file !== 'string' || path.isAbsolute(file) || file.includes('..') || file.includes('\\') || (!/^(server|src|shared|worker|public)\//.test(file) && !buildFiles.includes(file)))) throw new Error('Invalid release input manifest.');
const config = JSON.parse(fs.readFileSync('wrangler.jsonc', 'utf8'));
const {COCREATE_RELEASE_FINGERPRINT: _ignored, ...vars} = config.vars;
const hash = createHash('sha256');
for (const file of files.sort()) {
  const name = file.replaceAll('\\', '/');
  if (!fs.lstatSync(file).isFile()) throw new Error('Release input must be a regular file.');
  let content = fs.readFileSync(file);
  if (/\.(?:[cm]?[jt]sx?|c|cs|ps1|sh|css|html|json|jsonc|yaml|yml|svg)$/.test(file) || file === 'Dockerfile') content = Buffer.from(content.toString('utf8').replaceAll('\r\n', '\n'));
  hash.update(name + '\0' + content.length + '\0'); hash.update(content);
}
hash.update(JSON.stringify({vars, image_vars: config.containers[0].image_vars}));
const fingerprint = hash.digest('hex');
if (process.argv.includes('--write-config')) {
  config.vars.COCREATE_RELEASE_FINGERPRINT = fingerprint;
  fs.writeFileSync('wrangler.jsonc', JSON.stringify(config, null, 2) + '\n');
} else if (config.vars.COCREATE_RELEASE_FINGERPRINT !== fingerprint) {
  throw new Error('Release source fingerprint is stale; prepare it before publishing.');
}
if (process.argv.includes('--write-image')) {
  for (const [name, expected] of Object.entries(config.containers[0].image_vars)) {
    if (process.env[name] !== expected) throw new Error(`Public image build variable differs from the prepared release: ${name}`);
  }
  fs.writeFileSync('/usr/local/share/cocreate-release.json', JSON.stringify({fingerprint}), {mode: 0o444});
}
console.log(JSON.stringify({fingerprint, sourceFiles: files.length, scope: 'Source/build input attestation only; not runtime acceptance'}));
