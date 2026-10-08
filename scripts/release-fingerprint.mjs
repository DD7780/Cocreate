import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

// Attest source/build inputs without a self-referential Git revision or mutable runtime environment.
const files = [];
function collect(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(file);
    else if (entry.isFile()) files.push(file);
    else throw new Error('Release input must be a regular file.');
  }
}
for (const directory of ['server', 'src', 'shared', 'worker', 'public']) collect(directory);
files.push('Dockerfile', 'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'vite.config.ts', 'tsconfig.json', 'index.html', 'scripts/start-container.sh', 'scripts/release-fingerprint.mjs');
const config = JSON.parse(fs.readFileSync('wrangler.jsonc', 'utf8'));
const {COCREATE_RELEASE_FINGERPRINT: _ignored, ...vars} = config.vars;
const hash = createHash('sha256');
for (const file of files.sort()) {
  const name = file.replaceAll('\\', '/');
  let content = fs.readFileSync(file);
  if (/\.(?:[cm]?[jt]sx?|c|sh|css|json|yaml|yml|svg)$/.test(file) || file === 'Dockerfile') content = Buffer.from(content.toString('utf8').replaceAll('\r\n', '\n'));
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
