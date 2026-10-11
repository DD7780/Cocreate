// Trusted image-build record, never acceptance proof or a runtime fallback.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

if (process.platform !== 'linux' || process.arch !== 'x64') throw new Error('The Linux x64 image owns this record.');
const executable = '/usr/lib/chromium/chromium-headless-shell';
const real = fs.realpathSync(executable);
if (real !== executable || !fs.statSync(real).isFile()) throw new Error('Fixed trusted Debian runtime required.');
const version = execFileSync(real, ['--version'], { timeout: 5000, maxBuffer: 4096, env: { PATH: '/usr/bin:/bin' } }).toString().trim();
if (!/^(?:Chromium|Google Chrome|HeadlessChrome) \d+\.\d+\.\d+\.\d+/.test(version)) throw new Error('Unknown Chromium version format.');
const record = { schemaVersion: 1, platform: 'linux', architecture: 'x64', executable, version, sha256: createHash('sha256').update(fs.readFileSync(real)).digest('hex') };
const target = path.resolve('.runtime/shared-browser-runtime.json');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, JSON.stringify(record), { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({ scope: 'Image binary attestation only; runtime isolation unverified', ...record }));
