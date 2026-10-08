import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {isolationPolicy} from '../server/isolation.js';
import {browserExecutable} from '../server/isolation/browser.js';

if (process.platform !== 'linux') throw new Error('Linux operator diagnostic only.');
// Trusted version queries only: no candidate code, network, app mounts or application-policy changes.
// CI additionally limits this entire container to 1 GiB; compare virtual reservation with physical memory.
const executable = browserExecutable();
const sandbox = ['--unshare-all', '--die-with-parent', '--new-session', '--clearenv',
  '--ro-bind', path.dirname(executable), '/browser', '--proc', '/proc', '--dev', '/dev', '--tmpfs', '/tmp'];
for (const directory of ['/lib', '/lib64', '/usr/lib']) {
  if (fs.existsSync(directory)) sandbox.push('--ro-bind', directory, directory);
}
for (const addressSpace of [isolationPolicy.linuxAddressSpaceBytes, undefined]) {
  const limits = ['--cpu=5', '--nproc=64', '--nofile=64'];
  if (addressSpace !== undefined) limits.push(`--as=${addressSpace}`);
  const result = spawnSync('/usr/bin/prlimit', [...limits, '--', '/usr/bin/bwrap', ...sandbox,
    '/browser/' + path.basename(executable), '--version'], {
    env: {PATH:'/usr/bin:/bin', LANG:'C.UTF-8'}, encoding:'utf8', timeout:5_000, maxBuffer:16_000,
  });
  console.log(JSON.stringify({scope:'Trusted version metadata only', addressSpace:addressSpace ?? 'CI cgroup only',
    status:result.status, signal:result.signal, error:result.error?.message,
    stdout:result.stdout?.slice(0,2000), stderr:result.stderr?.slice(0,4000)}));
}
