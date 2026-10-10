import fs from 'node:fs';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { prepareIsolation } from './isolation.js';
import { validateBlenderScene, BLENDER_POLICY, BLENDER_VERSION, type BlenderScene, type BlenderResult } from '../shared/blender.js';

export const blenderLimits = Object.freeze({ wallMs: 120_000, cpuSeconds: 60, memoryBytes: 2 * 1024 ** 3, processes: 1, outputBytes: 4 * 1024 ** 2, consoleBytes: 128 * 1024 });
const supportedExecutableHash = '57fa1d294ea76448c3bec84ca758caf4629611330abba7dcf55bb0c56a0a15ab';
const hash = (bytes: Uint8Array | string) => createHash('sha256').update(bytes).digest('hex');
export function approvedDirectory(directory: string) {
  const absolute = path.resolve(directory);
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isDirectory() || fs.realpathSync.native(absolute).toLowerCase() !== absolute.toLowerCase()) throw new Error('Choose an existing dedicated local directory without links or junctions.');
  let current = absolute;
  while (path.dirname(current) !== current) {
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error('Linked task directories are unavailable.');
    current = path.dirname(current);
  }
  return absolute;
}
function fixedFile(workspace: string, name: string, limit: number) {
  const filename = path.join(workspace, name), stat = fs.lstatSync(filename);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size < 1 || stat.size > limit || fs.realpathSync.native(filename).toLowerCase() !== filename.toLowerCase()) throw new Error('Blender output path, type or size is invalid.');
  const bytes = fs.readFileSync(filename);
  if (bytes.length !== stat.size) throw new Error('Blender output changed during collection.');
  return bytes;
}
export function collectBlenderResult(workspace: string, commandId: string, sceneHash: string): BlenderResult {
  const blend = fixedFile(approvedDirectory(workspace), 'scene.blend', blenderLimits.outputBytes);
  const png = fixedFile(workspace, 'render.png', 1024 * 1024);
  if (!blend.subarray(0, 7).equals(Buffer.from('BLENDER')) || !png.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) throw new Error('Blender output signatures are invalid.');
  return { blend: blend.toString('base64'), png: png.toString('base64'), evidence: { commandId, sceneHash, policy: BLENDER_POLICY, blenderVersion: BLENDER_VERSION, cleanupVerified: true } };
}
/** Companion-owned executable/workspace only. Neither is selectable by HTTP or a model. */
export async function executeBlender(options: { executable: string; workspace: string; commandId: string; scene?: BlenderScene; probe?: { outside: string; port: number }; signal?: AbortSignal; wallMs?: number }) {
  if (process.platform !== 'win32' || process.arch !== 'x64') throw new Error('Blender execution requires verified Windows x64 AppContainer isolation; no host fallback.');
  if (!/^[a-f0-9-]{36}$/.test(options.commandId) || options.signal?.aborted) throw new Error('Blender command cancelled or invalid.');
  const approved = approvedDirectory(options.workspace), executable = path.resolve(options.executable);
  if (path.basename(executable) !== 'blender.exe' || !fs.lstatSync(executable).isFile() || fs.realpathSync.native(executable).toLowerCase() !== executable.toLowerCase()) throw new Error('Choose a supported portable Blender executable without links.');
  const executableDirectory = approvedDirectory(path.dirname(executable));
  if (path.basename(executableDirectory) !== 'blender-4.5.14-windows-x64' || executableDirectory.toLowerCase().startsWith(approved.toLowerCase() + path.sep) || approved.toLowerCase().startsWith(executableDirectory.toLowerCase() + path.sep) || executableDirectory.toLowerCase() === approved.toLowerCase() || hash(fs.readFileSync(executable)) !== supportedExecutableHash) throw new Error('Select the verified official portable Blender 4.5.14 directory and a separate dedicated task workspace. Broad runtime roots and modified executables are denied.');
  const runtime = await prepareIsolation(), workspace = path.join(approved, randomUUID()), scene = options.probe ? undefined : validateBlenderScene(options.scene);
  fs.mkdirSync(workspace); // Never reuse or overwrite a user/task directory.
  fs.copyFileSync(fileURLToPath(new URL('./isolation/blender-scene.py', import.meta.url)), path.join(workspace, 'scene.py'));
  fs.writeFileSync(path.join(workspace, 'input.json'), JSON.stringify(options.probe ? { probe: true, ...options.probe } : { scene }), { flag: 'wx' });
  const profile = 'cocreate.isolation.' + path.basename(workspace).replaceAll('-', '');
  const wallMs = Math.min(blenderLimits.wallMs, Math.max(10, options.wallMs ?? blenderLimits.wallMs));
  let cancelled = false, timedOut = false, overflow = false;
  const diagnostics = await new Promise<string>((resolve, reject) => {
    const child = spawn(path.join(runtime, 'runner.exe'), [runtime, workspace, profile, String(process.pid), String(wallMs), 'blender', executable], {
      cwd: workspace, windowsHide: true, env: { SystemRoot: process.env.SystemRoot || 'C:\\Windows' }, stdio: ['ignore', 'pipe', 'pipe']
    });
    let consoleBytes = 0, diagnostic = '';
    const stop = () => { try { fs.writeFileSync(path.join(workspace, 'cancel'), 'stop'); } catch { /* Launcher also watches its parent and time. */ } };
    const abort = () => { cancelled = true; stop(); };
    const timer = setTimeout(() => { timedOut = true; stop(); }, wallMs);
    const sizeTimer = setInterval(() => {
      try {
        const bytes = fs.readdirSync(workspace).reduce((total, name) => {
          try { return total + fs.lstatSync(path.join(workspace, name)).size; }
          catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return total; throw error; } // Blender atomically renames its temporary outputs.
        }, 0);
        if (bytes > 6 * 1024 ** 2) { overflow = true; stop(); }
      } catch { overflow = true; stop(); }
    }, 50);
    options.signal?.addEventListener('abort', abort, { once: true });
    if (options.signal?.aborted) abort();
    const output = (chunk: Buffer) => { consoleBytes += chunk.length; if (consoleBytes > blenderLimits.consoleBytes) { overflow = true; stop(); } else diagnostic += chunk.toString(); };
    child.stdout.on('data', output); child.stderr.on('data', output);
    const clean = () => { clearTimeout(timer); clearInterval(sizeTimer); options.signal?.removeEventListener('abort', abort); };
    child.once('error', error => { clean(); reject(error); });
    child.once('close', code => {
      clean();
      if (cancelled || timedOut || overflow || code !== 0 || diagnostic.includes('ISOLATION_CLEANUP_FAILED') || !diagnostic.includes('ISOLATION_ACCOUNTING')) return reject(new Error(`Blender ${cancelled ? 'cancelled' : timedOut || code === 124 ? 'timed out' : overflow ? 'output limit exceeded' : 'isolated execution unavailable or failed'}. Dedicated process removed; no host fallback. ${diagnostic.slice(-1600)}`));
      resolve(diagnostic);
    });
  });
  if (options.probe) {
    const evidence = JSON.parse(fixedFile(workspace, 'probe.json', 4096).toString('utf8'));
    if (!evidence.outsideDenied || !evidence.networkDenied || !evidence.processDenied || !evidence.credentialsAbsent || evidence.version !== BLENDER_VERSION) throw new Error('Required Blender isolation boundary was not verified.');
    return { workspace, diagnostics, probe: evidence };
  }
  return { workspace, diagnostics, result: collectBlenderResult(workspace, options.commandId, hash(JSON.stringify(scene))) };
}
