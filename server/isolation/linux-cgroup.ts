import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import type {ChildProcess} from 'node:child_process';
import {IsolationError, isolationPolicy} from '../isolation.js';

export const linuxBrowserMemoryBytes = 512 * 1024 * 1024;
export const linuxJobLauncher = '/usr/local/bin/cocreate-job-launcher';
const unavailable = () => new IsolationError('isolation_unavailable', 'Delegated physical-memory isolation is unavailable; no host fallback is permitted.');
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** Server-owned cgroup authority is never mounted into a candidate's namespace. */
export class LinuxJobGroup {
  private constructor(readonly directory: string) {}

  static create(): LinuxJobGroup {
    const configured = process.env.COCREATE_LINUX_CGROUP_ROOT || '/sys/fs/cgroup/cocreate';
    if (!path.isAbsolute(configured) || fs.realpathSync(configured) !== configured || fs.statfsSync(configured).type !== 0x63677270) throw unavailable();
    const jobs = path.join(configured, 'jobs');
    if (fs.realpathSync(jobs) !== jobs || fs.readFileSync(path.join(jobs, 'memory.max'), 'utf8').trim() !== String(linuxBrowserMemoryBytes) || fs.readFileSync(path.join(jobs, 'pids.max'), 'utf8').trim() !== '64') throw unavailable();
    const directory = path.join(jobs, randomUUID());
    fs.mkdirSync(directory);
    try {
      for (const [file, value] of Object.entries({'memory.max': String(linuxBrowserMemoryBytes), 'memory.swap.max': '0', 'memory.oom.group': '1', 'pids.max': '64'})) {
        fs.writeFileSync(path.join(directory, file), value);
        if (fs.readFileSync(path.join(directory, file), 'utf8').trim() !== value) throw unavailable();
      }
      fs.accessSync(path.join(directory, 'cgroup.kill'), fs.constants.W_OK);
      return new LinuxJobGroup(directory);
    } catch (error) { fs.rmdirSync(directory); throw error; }
  }

  async attach(child: ChildProcess, signal?: AbortSignal): Promise<void> {
    const pid = child.pid;
    if (!pid || !Number.isSafeInteger(pid)) throw unavailable();
    for (let attempt = 0; attempt < 500; attempt++) {
      if (signal?.aborted) throw new IsolationError('isolation_cancelled', 'Verification cancelled before candidate execution.');
      if (child.exitCode !== null || child.signalCode !== null) throw unavailable();
      const status = fs.readFileSync(`/proc/${pid}/status`, 'utf8');
      if (/^State:\s+T\s/m.test(status)) {
        fs.writeFileSync(path.join(this.directory, 'cgroup.procs'), String(pid));
        const members = fs.readFileSync(path.join(this.directory, 'cgroup.procs'), 'utf8').trim().split(/\s+/);
        if (!members.includes(String(pid))) throw unavailable();
        process.kill(pid, 'SIGCONT');
        return;
      }
      await wait(5);
    }
    throw unavailable();
  }

  memoryExceeded(): boolean {
    return /^oom_kill\s+[1-9]\d*$/m.test(fs.readFileSync(path.join(this.directory, 'memory.events'), 'utf8'));
  }

  tasksExceeded(): boolean {
    return /^max\s+[1-9]\d*$/m.test(fs.readFileSync(path.join(this.directory, 'pids.events'), 'utf8'));
  }

  cpuExceeded(): boolean {
    const usage = fs.readFileSync(path.join(this.directory, 'cpu.stat'), 'utf8').match(/^usage_usec\s+(\d+)$/m);
    if (!usage) throw unavailable();
    return Number(usage[1]) >= isolationPolicy.cpuSeconds * 1_000_000;
  }

  kill(): void { fs.writeFileSync(path.join(this.directory, 'cgroup.kill'), '1'); }

  async cleanup(): Promise<void> {
    this.kill();
    for (let attempt = 0; attempt < 400; attempt++) {
      if (/^populated 0$/m.test(fs.readFileSync(path.join(this.directory, 'cgroup.events'), 'utf8'))) {
        fs.rmdirSync(this.directory);
        return;
      }
      await wait(5);
    }
    throw unavailable();
  }
}
