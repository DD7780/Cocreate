import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawn, type ChildProcess} from 'node:child_process';
import {once} from 'node:events';
import {LinuxJobGroup, linuxJobLauncher} from '../server/isolation/linux-cgroup.js';
import {withIsolatedBrowser, linuxBrowserFileDescriptors, linuxBrowserFileBytes} from '../server/isolation/browser.js';
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
function probe(code: string, limits: string[] = []): ChildProcess {
  const target = [process.execPath, '--input-type=module', '-e', code];
  return spawn(linuxJobLauncher, limits.length ? ['/usr/bin/prlimit', ...limits, '--', ...target] : target, {env: {PATH: '/usr/bin:/bin'}, detached: true, stdio: ['ignore', 'pipe', 'pipe']});
}

test('Linux browser cold starts execute JavaScript repeatedly and clean every descendant', linux, async () => {
  for (let attempt = 0; attempt < 3; attempt++) {
    let pid = 0;
    await withIsolatedBrowser(async browser => {
      const {targetId} = await browser.call('Target.createTarget', {url:'about:blank'});
      const {sessionId} = await browser.call('Target.attachToTarget', {targetId,flatten:true});
      const result = await browser.call('Runtime.evaluate', {expression:'1+1',returnByValue:true}, sessionId);
      assert.equal(result.result.value, 2);
    }, {onStarted: value => {pid = value;}});
    assert.ok(pid); await removed(pid); noGroups();
  }
});

test('Linux CPU accounting includes busy descendants in the same finite job budget', linux, async () => {
  const group = LinuxJobGroup.create();
  const child = probe("import {spawn} from 'node:child_process';const children=Array.from({length:2},()=>spawn(process.execPath,['-e','while(true){}'],{stdio:'ignore'}));console.log(children.map(c=>c.pid).join(','));setInterval(()=>{},1000)");
  let output = ''; child.stdout!.on('data', chunk => output += chunk);
  const closed = once(child, 'close'); let descendants: number[] = [];
  try {
    await group.attach(child);
    for (let i = 0; i < 400 && !output; i++) await wait(5);
    descendants = output.trim().split(',').map(Number); assert.equal(descendants.length, 2);
    for (const pid of descendants) assert.ok(Number.isSafeInteger(pid) && pid > 0);
    for (let i = 0; i < 800 && !group.cpuExceeded(); i++) await wait(25);
    assert.equal(group.cpuExceeded(), true);
    for (const pid of descendants) process.kill(pid, 0);
    group.kill(); await closed;
  } finally {child.kill('SIGKILL'); await group.cleanup();}
  await removed(child.pid!); for (const pid of descendants) await removed(pid); noGroups();
});

test('Linux browser file-size ceiling rejects growth and cleans the bounded job', linux, async () => {
  const group = LinuxJobGroup.create();
  const child = probe("import fs from 'node:fs';try{fs.ftruncateSync(fs.openSync('/tmp/browser-file-ceiling-probe','w'),9*1024*1024);throw Error('File ceiling was not enforced')}catch(error){if(error.code!=='EFBIG')throw error;console.log('FILE_LIMIT_ENFORCED:EFBIG')}", ['--fsize=' + linuxBrowserFileBytes]);
  let output = ''; child.stdout!.on('data', chunk => output += chunk);
  const closed = once(child, 'close');
  try {
    await group.attach(child);
    await closed;
    assert.equal(child.exitCode, 0);
    assert.match(output, /FILE_LIMIT_ENFORCED:EFBIG/);
    assert.equal(fs.statSync('/tmp/browser-file-ceiling-probe').size, 0);
  } finally {child.kill('SIGKILL'); await group.cleanup(); fs.rmSync('/tmp/browser-file-ceiling-probe', {force:true});}
  await removed(child.pid!); noGroups();
});

test('Linux browser file-descriptor ceiling rejects growth and cleans the bounded job', linux, async () => {
  const group = LinuxJobGroup.create();
  const child = probe("import fs from 'node:fs'; let count=0;for(;count<512;count++){try{fs.openSync('/dev/null','r')}catch(e){if(e.code!=='EMFILE')throw e;console.log('FD_LIMIT_ENFORCED:'+count);break}}setInterval(()=>{},1000)", ['--nofile=' + linuxBrowserFileDescriptors]);
  let output = ''; child.stdout!.on('data', chunk => output += chunk);
  const closed = once(child, 'close');
  try {
    await group.attach(child);
    for (let i = 0; i < 400 && !output; i++) await wait(5);
    assert.match(output, /FD_LIMIT_ENFORCED:/);
    assert.ok(Number(output.trim().split(':')[1]) < linuxBrowserFileDescriptors);
    group.kill(); await closed;
  } finally {child.kill('SIGKILL'); await group.cleanup();}
  await removed(child.pid!); noGroups();
});

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
    assert.equal(group.tasksExceeded(), true);
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
    assert.match(fs.readFileSync(`/proc/${pid}/limits`, 'utf8'), /^Max file size\s+8388608\s+8388608\s+bytes[ \t]*$/m);
    assert.match(fs.readFileSync(`/proc/${pid}/limits`, 'utf8'), /^Max open files\s+256\s+256\s+files[ \t]*$/m);
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
