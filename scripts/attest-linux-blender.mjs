import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const executable = '/opt/cocreate-blender/blender';
if (process.platform !== 'linux' || process.arch !== 'x64' || fs.realpathSync(executable) !== executable) throw new Error('Fixed Linux x64 runtime required.');
const version = execFileSync(executable, ['--version'], { timeout: 5000, maxBuffer: 4096, env: { PATH: '/usr/bin:/bin' } }).toString();
if (!version.startsWith('Blender 4.5.14')) throw new Error('Pinned Blender release required.');
fs.mkdirSync('.runtime', { recursive: true });
fs.writeFileSync('.runtime/linux-blender-runtime.json', JSON.stringify({ schemaVersion: 1, executable, version: '4.5.14', archiveHash: '9ba871ff2ecd36526b77432745980b7e6664ecd0c7ca11c48849073dcfe06da3', executableHash: createHash('sha256').update(fs.readFileSync(executable)).digest('hex') }), { flag: 'wx', mode: 0o600 });
