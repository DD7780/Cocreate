import { StringDecoder } from 'node:string_decoder';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { IsolationError, isolationPolicy, prepareIsolation, type IsolationOptions } from '../isolation.js';
import {LinuxJobGroup, linuxJobLauncher} from './linux-cgroup.js';

export type BrowserProtocol = {
  call(method: string, params?: object, sessionId?: string): Promise<any>;
};
export const linuxBrowserFileDescriptors = 256;
// Native Mojo transfers include framing; the parent still rejects protocol output above 4 MiB.
export const linuxBrowserFileBytes = 8 * 1024 * 1024;
const unavailable = () => new IsolationError('isolation_unavailable', 'Isolated verification browser is unavailable. Prepare the verification runtime, then explicitly retry; the previous artifact is retained.');
export const browserExecutable = () => path.resolve(process.env.COCREATE_VERIFICATION_BROWSER ||
  (process.platform === 'win32' ? '.runtime/browser/154.0.8037.92/chrome-headless-shell-win64/chrome-headless-shell.exe' : '/usr/lib/chromium/chromium-headless-shell'));

/** Trusted CDP lives in the parent. Generated code has no access to its checks, pipes or Node process. */
export async function withIsolatedBrowser<T>(action: (browser: BrowserProtocol) => Promise<T>, options: IsolationOptions = {}): Promise<T> {
  if (options.signal?.aborted) throw new IsolationError('isolation_cancelled', 'Verification cancelled.');
  if (process.env.COCREATE_ISOLATION_MODE && process.env.COCREATE_ISOLATION_MODE !== 'os') throw unavailable();
  const runtime = await prepareIsolation(), executable = browserExecutable();
  if (!fs.existsSync(executable)) throw unavailable();
  const jobs = path.resolve('.runtime/isolation/jobs'), workspace = path.join(jobs, randomUUID());
  const profile = 'cocreate.isolation.' + path.basename(workspace).replaceAll('-', '');
  const wallMs = Math.min(isolationPolicy.wallMs, Math.max(10, options.wallMs ?? isolationPolicy.wallMs));
  fs.mkdirSync(path.join(workspace, 'browser-profile'), {recursive: true});
  const flags = ['--headless=new', '--no-sandbox', '--no-zygote', '--disable-gpu', '--in-process-gpu',
    // Native PulseAudio allocates a 64 MiB memfd before any page; these checks do not verify audio.
    '--disable-audio-output',
    '--disable-crashpad-for-testing', '--disable-background-networking', '--disable-component-update', '--disable-sync',
    '--no-first-run', '--no-default-browser-check', '--disk-cache-size=1', '--media-cache-size=1', '--remote-debugging-pipe'];
  // Chromium reserves more virtual space than RLIMIT_AS permits. Physical memory is enforced by the job cgroup.
  const linux = ['--cpu=' + isolationPolicy.cpuSeconds,
    // The attached cgroup limits browser tasks; RLIMIT_NPROC also counts unrelated Node server threads.
    '--fsize=' + linuxBrowserFileBytes, '--nofile=' + linuxBrowserFileDescriptors, '--', '/usr/bin/bwrap',
    // Node inherits only the explicitly listed CDP pipes; Bubblewrap passes them to its exec child.
    '--json-status-fd', '5', '--unshare-all', '--cap-drop', 'ALL', '--die-with-parent', '--new-session', '--clearenv',
    '--ro-bind', path.dirname(executable), '/browser', '--ro-bind', workspace, '/job',
    '--bind', path.join(workspace, 'browser-profile'), '/profile', '--setenv', 'HOME', '/profile', '--setenv', 'XDG_CACHE_HOME', '/profile/cache',
    '--proc', '/proc', '--dev', '/dev', '--tmpfs', '/tmp'];
  for (const directory of ['/lib', '/lib64', '/usr/lib', '/etc/fonts', '/usr/share/fonts', '/usr/share/fontconfig']) if (process.platform === 'linux' && fs.existsSync(directory)) linux.push('--ro-bind', directory, directory);
  linux.push('--chdir', '/profile', '/browser/' + path.basename(executable), ...flags, '--user-data-dir=/profile', 'about:blank');
  const command = process.platform === 'win32' ? {executable: path.join(runtime, 'runner.exe'), args: [runtime, workspace, profile, String(process.pid), String(wallMs), 'browser', executable]} :
    process.platform === 'linux' ? {executable: '/usr/bin/prlimit', args: linux} : undefined;
  if (!command) throw unavailable();
  let group: LinuxJobGroup | undefined;
  try { if (process.platform === 'linux') group = LinuxJobGroup.create(); }
  catch (error) { fs.rmSync(workspace, {recursive: true, force: true}); const failure = unavailable(); failure.cause = error; throw failure; }
  const child = spawn(group ? linuxJobLauncher : command.executable, group ? [command.executable, ...command.args] : command.args, {cwd: workspace, windowsHide: true, detached: process.platform !== 'win32',
    env: process.platform === 'win32' ? {SystemRoot: process.env.SystemRoot || 'C:\\Windows', APPDATA: process.env.APPDATA, LOCALAPPDATA: process.env.LOCALAPPDATA, USERPROFILE: process.env.USERPROFILE} : {PATH: '/usr/bin:/bin', LANG: 'C.UTF-8'},
    stdio: process.platform === 'win32' ? ['pipe', 'pipe', 'pipe'] : ['ignore', 'ignore', 'pipe', 'pipe', 'pipe', 'pipe']});
  const input = process.platform === 'win32' ? child.stdin! : child.stdio[3] as NodeJS.WritableStream;
  const output = process.platform === 'win32' ? child.stdout! : child.stdio[4] as NodeJS.ReadableStream;
  let sequence = 0, buffer = '', received = 0, stderr = '', failure: Error | undefined, exited = false, finishing = false, forcedTermination = false;
  let linuxPid = 0, sandboxExit: number | undefined;
  let hardStop: NodeJS.Timeout | undefined;
  let cpuTimer: NodeJS.Timeout | undefined;
  const decoder = new StringDecoder('utf8');
  const pending = new Map<number, {resolve(value: any): void; reject(error: Error): void}>();
  const stop = (error: Error) => {
    failure ??= error;
    if (process.platform === 'win32' && !exited) {
      try { fs.writeFileSync(path.join(workspace, 'cancel'), 'cancel'); } catch { child.kill(); }
      hardStop ??= setTimeout(() => {forcedTermination = true; child.kill();}, 1_000);
    }
    else if (child.pid) { try { group?.kill(); } catch {} try { process.kill(-child.pid, 'SIGKILL'); } catch { child.kill(); } }
    for (const task of pending.values()) task.reject(failure);
    pending.clear();
  };
  const abort = () => stop(new IsolationError('isolation_cancelled', 'Verification cancelled and its isolated browser removed.'));
  const timer = setTimeout(() => stop(new IsolationError('isolation_timeout', 'Verification exceeded its wall-time bound.')), wallMs);
  options.signal?.addEventListener('abort', abort, {once: true});
  if (options.signal?.aborted) abort();
  input.on('error', () => {if(!finishing)stop(unavailable());});
  child.on('error', () => stop(unavailable()));
  child.stderr!.on('data', chunk => {
    stderr += chunk;
    if (Buffer.byteLength(stderr) > 16_000) stop(new IsolationError('isolation_resource_limit', 'Browser diagnostics exceeded their bound.'));
    const started = stderr.match(/ISOLATION_STARTED (\d+)/);
    if (started) {options.onStarted?.(Number(started[1])); options.onStarted = undefined;}
  });
  if (process.platform === 'linux') {
    let statusBuffer = '', statusBytes = 0;
    const status = child.stdio.at(5) as NodeJS.ReadableStream;
    status.on('error', () => stop(unavailable()));
    status.on('data', chunk => {
      statusBytes += Buffer.byteLength(chunk);
      if (statusBytes > 16_000) {stop(unavailable()); return;}
      statusBuffer += chunk; let end: number;
      while ((end = statusBuffer.indexOf('\n')) >= 0) {
        const line = statusBuffer.slice(0, end); statusBuffer = statusBuffer.slice(end + 1);
        try {
          const value = JSON.parse(line), pid = value['child-pid'];
          if (Number.isSafeInteger(pid) && pid > 0) {linuxPid = pid; options.onStarted?.(pid); options.onStarted = undefined;}
          if (Number.isInteger(value['exit-code'])) sandboxExit = value['exit-code'];
        } catch {stop(unavailable());}
      }
    });
  }
  output.on('data', chunk => {
    received += Buffer.byteLength(chunk);
    if (received > isolationPolicy.outputBytes) {stop(new IsolationError('isolation_resource_limit', 'Browser output exceeded its bound.')); return;}
    buffer += decoder.write(chunk);
    let end: number;
    while ((end = buffer.indexOf('\0')) >= 0) {
      const message = buffer.slice(0, end); buffer = buffer.slice(end + 1);
      try {
        const reply = JSON.parse(message), task = pending.get(reply.id);
        if (reply.method === 'Inspector.targetCrashed' || reply.method === 'Target.targetCrashed') {
          const resource = group?.cpuExceeded() ? 'CPU' : group?.memoryExceeded() ? 'memory' : group?.tasksExceeded() ? 'process' : undefined;
          const error = resource
            ? new IsolationError('isolation_resource_limit', `Verification renderer exceeded its ${resource} bound.`) : unavailable();
          error.cause = {event: reply.method, status: reply.params?.status, errorCode: reply.params?.errorCode};
          stop(error);
        }
        if (task) {pending.delete(reply.id); reply.error ? task.reject(new Error('Browser protocol command failed.')) : task.resolve(reply.result);}
      } catch {stop(unavailable());}
    }
  });
  const closed = new Promise<void>(resolve => child.once('close', code => {
    exited = true;
    if (code !== 0 && !(finishing && !failure && (code === 122 || (forcedTermination && code === null && child.signalCode === 'SIGTERM') || (process.platform === 'linux' && (code === 137 || child.signalCode === 'SIGKILL'))))) {
      const error = code === 124 ? new IsolationError('isolation_timeout', 'Verification exceeded its wall-time bound.') :
        code === 125 || code === 153 || /Too many open files/.test(stderr) || group?.memoryExceeded() || group?.tasksExceeded() || sandboxExit === 137 || sandboxExit === 152 || sandboxExit === 153 ? new IsolationError('isolation_resource_limit', 'Verification stopped within its memory/process/CPU/file limits.') : unavailable();
      error.cause = {exitCode: code, phase: finishing ? 'cleanup' : 'execution', diagnostic: stderr.slice(0, 1000)};
      // Pipe closure can precede the authoritative resource exit; keep explicit cancel/time/output outcomes.
      if (error instanceof IsolationError && error.code === 'isolation_resource_limit' && failure instanceof IsolationError && failure.code === 'isolation_unavailable') failure = error;
      if (failure && failure.cause === undefined) failure.cause = error.cause;
      stop(error);
    }
    for (const task of pending.values()) task.reject(failure || unavailable());
    pending.clear(); resolve();
  }));
  const browser: BrowserProtocol = {call(method, params = {}, sessionId) {
    if (failure) return Promise.reject(failure);
    const id = ++sequence, message = JSON.stringify({id, method, params, sessionId}) + '\0';
    if (Buffer.byteLength(message) > isolationPolicy.outputBytes) return Promise.reject(new IsolationError('isolation_resource_limit', 'Browser input exceeded its bound.'));
    return new Promise((resolve, reject) => {pending.set(id, {resolve, reject}); input.write(message);});
  }};
  try {
    if (group) {
      try {await group.attach(child, options.signal);}
      catch (error) {stop(error instanceof IsolationError ? error : unavailable()); throw failure;}
      group.cpuExceeded();
      // Preserve the CPU budget across all renderer/utility descendants, not just each process.
      cpuTimer = setInterval(() => {
        try {if (group!.cpuExceeded()) stop(new IsolationError('isolation_resource_limit', 'Verification exceeded its aggregate CPU bound.'));}
        catch {stop(unavailable());}
      }, 25);
    }
    await browser.call('Browser.getVersion');
    // Browser-level crash events require target discovery; attached renderer sessions alone do not report them.
    if (group) await browser.call('Target.setDiscoverTargets', {discover: true});
    const result = await action(browser);
    if (failure) throw failure;
    return result;
  } finally {
    // The parent terminates the completed untrusted job; browser shutdown code is not a cleanup authority.
    finishing = true;
    clearInterval(cpuTimer);
    if (!exited && process.platform === 'win32') {
      try {fs.writeFileSync(path.join(workspace, 'cancel'), 'cancel');} catch {child.kill();}
      hardStop ??= setTimeout(() => {forcedTermination = true; child.kill();}, 1_000);
    } else if (!exited && child.pid) {try {group?.kill();} catch {} try {process.kill(-child.pid, 'SIGKILL');} catch {child.kill();}}
    await closed; clearTimeout(timer); clearTimeout(hardStop);
    options.signal?.removeEventListener('abort', abort);
    if (process.platform === 'win32') await new Promise<void>(resolve => {
      const cleanup = spawn(path.join(runtime, 'runner.exe'), ['cleanup', profile], {windowsHide: true, stdio: 'ignore'});
      const timeout = setTimeout(() => cleanup.kill(), 3_000);
      cleanup.once('error', () => {clearTimeout(timeout); resolve();}); cleanup.once('close', () => {clearTimeout(timeout); resolve();});
    });
    if (group) await group.cleanup();
    if (linuxPid) {
      let removed = false;
      for (let attempt = 0; attempt < 400; attempt++) {
        try {process.kill(linuxPid, 0);} catch (error) {if ((error as NodeJS.ErrnoException).code === 'ESRCH') {removed = true; break;} throw unavailable();}
        await new Promise(resolve => setTimeout(resolve, 5));
      }
      if (!removed) throw unavailable();
    }
    if (path.dirname(path.resolve(workspace)) !== jobs) throw unavailable();
    fs.rmSync(workspace, {recursive: true, force: true, maxRetries: 5, retryDelay: 100});
    if (failure) throw failure;
  }
}

let readiness: Promise<unknown> | undefined;
let readyExecutable: string | undefined;
export async function assertVerificationBrowserAvailable(signal?: AbortSignal) {
  if (signal?.aborted) throw new IsolationError('isolation_cancelled', 'Verification cancelled.');
  if (!fs.existsSync(browserExecutable()) || (process.env.COCREATE_ISOLATION_MODE && process.env.COCREATE_ISOLATION_MODE !== 'os')) throw unavailable();
  if (readyExecutable !== browserExecutable()) {readiness = undefined; readyExecutable = browserExecutable();}
  readiness ??= withIsolatedBrowser(browser => browser.call('Browser.getVersion')).catch(error => {readiness = undefined; throw error;});
  await readiness;
  if (signal?.aborted) throw new IsolationError('isolation_cancelled', 'Verification cancelled.');
}
