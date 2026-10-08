import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawn, type ChildProcess} from 'node:child_process';
import {once} from 'node:events';
import {LinuxJobGroup, linuxJobLauncher} from '../server/isolation/linux-cgroup.js';
import {withIsolatedBrowser} from '../server/isolation/browser.js';
import {IsolationError} from '../server/isolation.js';

const linux = {skip: process.platform !== 'linux'};
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const jobs = () => path.join(process.env.COCREATE_LINUX_CGROUP_ROOT || '/sys/fs/cgroup/cocreate', 'jobs');
const noGroups = () => assert.deepEqual(fs.readdirSync(jobs(), {withFileTypes: true}).filter(entry => entry.isDirectory()), []);
async function removed(pid: number) {
  for (let i = 0; i < 400; i++) {
    try {process.kill(pid, 0);} catch (error) {assert.equal((error as NodeJS.ErrnoException).code, 'ESRCH'); return;}
    await wait(5);
  }
  assert.fail('A job descendant remains after whole-group cleanup.');
}
function probe(code: string): ChildProcess {
  return spawn(linuxJobLauncher, [process.execPath, '--input-type=module', '-e', code], {env: {PATH: '/usr/bin:/bin'}, detached: true, stdio: ['ignore', 'pipe', 'pipe']});
}

test('Linux bootstrap drops authority and attaches a stopped trusted child before execution', linux, async () => {
  assert.equal(process.getuid!(), 1000);
  assert.match(fs.readFileSync('/proc/self/status', 'utf8'), /^CapEff:\s+0+$/m);
  const root = path.dirname(jobs());
  assert.throws(() => fs.writeFileSync(path.join(root, 'memory.max'), 'max'), {code: 'EACCES'});
  const group = LinuxJobGroup.create();
  const child = probe("import fs from 'node:fs'; console.log(fs.readFileSync('/proc/self/cgroup','utf8')); setInterval(()=>{},1000)");
  let output = '';
  child.stdout!.on('data', chunk => output += chunk);
  const closed = once(child, 'close');
  try {
    for (let i = 0; i < 200; i++) {
      if (/^State:\s+T\s/m.test(fs.readFileSync(`/proc/${child.pid}/status`, 'utf8'))) break;
      await wait(5);
    }
    assert.match(fs.readFileSync(`/proc/${child.pid}/status`, 'utf8'), /^State:\s+T\s/m);
    assert.equal(output, '', 'Trusted launcher must not execute its target before attachment.');
    await group.attach(child);
    for (let i = 0; i < 200 && !output; i++) await wait(5);
    assert.ok(output.trim().endsWith('/cocreate/jobs/' + path.basename(group.directory)));
    assert.equal(fs.readFileSync(path.join(group.directory, 'memory.max'), 'utf8').trim(), '536870912');
    assert.equal(fs.readFileSync(path.join(group.directory, 'memory.swap.max'), 'utf8').trim(), '0');
    group.kill(); await closed;
  } finally {child.kill('SIGKILL'); await group.cleanup();}
  await removed(child.pid!); noGroups();
});

test('Linux PID ceiling denies fork growth and whole-group kill removes descendants', linux, async () => {
  const group = LinuxJobGroup.create();
  // Fixed operator-owned resource probe; no candidate, project, secrets or network.
  const child = probe("import {spawn} from 'node:child_process'; for(let i=0;i<80;i++){const p=spawn('/bin/sleep',['60'],{stdio:'ignore'}); const outcome=await new Promise(r=>{p.once('spawn',()=>r('started'));p.once('error',e=>r(e.code));}); if(outcome==='EAGAIN'){console.log('PID_LIMIT_ENFORCED');break;} if(outcome!=='started')throw Error('Unexpected probe failure');} setInterval(()=>{},1000)");
  let output = ''; child.stdout!.on('data', chunk => output += chunk);
  const closed = once(child, 'close'); let descendants: number[] = [];
  const deadline = setTimeout(() => group.kill(), 10_000);
  try {
    await group.attach(child);
    for (let i = 0; i < 1000 && !output && child.exitCode === null; i++) await wait(5);
    assert.match(output, /PID_LIMIT_ENFORCED/);
    assert.match(fs.readFileSync(path.join(group.directory, 'pids.events'), 'utf8'), /^max\s+[1-9]\d*$/m);
    descendants = fs.readFileSync(path.join(group.directory, 'cgroup.procs'), 'utf8').trim().split(/\s+/).map(Number);
    assert.ok(descendants.length > 1);
    group.kill(); await closed;
  } finally {clearTimeout(deadline); child.kill('SIGKILL'); await group.cleanup();}
  for (const pid of descendants) await removed(pid);
  noGroups();
});

test('real Linux browser physical-memory exhaustion kills its job while the application survives', linux, async () => {
  let pid = 0;
  await assert.rejects(withIsolatedBrowser(async browser => {
    const {targetId} = await browser.call('Target.createTarget', {url: 'about:blank'});
    const {sessionId} = await browser.call('Target.attachToTarget', {targetId, flatten: true});
    await browser.call('Runtime.evaluate', {expression: 'globalThis.blocks=[];while(true){const block=new Uint8Array(32*1024*1024);block.fill(37);globalThis.blocks.push(block)}'}, sessionId);
  }, {onStarted: value => pid = value}), error => error instanceof IsolationError && error.code === 'isolation_resource_limit');
  assert.ok(pid); await removed(pid); noGroups();
  assert.equal(process.kill(process.pid, 0), true);
  await withIsolatedBrowser(browser => browser.call('Browser.getVersion'));
  noGroups();
});

test('missing Linux delegation fails closed and removes the candidate profile', linux, async () => {
  const before = process.env.COCREATE_LINUX_CGROUP_ROOT;
  try {
    process.env.COCREATE_LINUX_CGROUP_ROOT = '/app';
    await assert.rejects(withIsolatedBrowser(browser => browser.call('Browser.getVersion')), error => error instanceof IsolationError && error.code === 'isolation_unavailable');
    assert.deepEqual(fs.readdirSync(path.resolve('.runtime/isolation/jobs')), []);
  } finally {before === undefined ? delete process.env.COCREATE_LINUX_CGROUP_ROOT : process.env.COCREATE_LINUX_CGROUP_ROOT = before;}
  noGroups();
});
