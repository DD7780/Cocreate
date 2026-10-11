import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { randomUUID, createHash } from 'node:crypto';
import { LinuxJobGroup, linuxJobLauncher } from './isolation/linux-cgroup.js';
import { validateBlenderScene, type BlenderScene } from '../shared/blender.js';
import { validateBlenderInput, type BlenderInput } from '../shared/blender-interactive.js';
export const interactiveBlenderLimits = Object.freeze({ wallMs: 600000, cpuSeconds: 60, memoryBytes: 2 * 1024 ** 3, tasks: 64, profileBytes: 8 * 1024 ** 2, protocolBytes: 64 * 1024 ** 2 });
const hash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
const unavailable = () => new Error('Dedicated Linux Blender graphics isolation is unavailable; no host desktop or execution fallback.');
export function assertInteractiveBlenderRuntime() {
    if (process.platform !== 'linux' || process.arch !== 'x64' || process.env.COCREATE_INTERACTIVE_BLENDER !== 'linux-xvfb-v1')
        throw unavailable();
    const record = JSON.parse(fs.readFileSync('.runtime/linux-blender-runtime.json', 'utf8'));
    if (record.schemaVersion !== 1 || record.version !== '4.5.14' || record.executable !== '/opt/cocreate-blender/blender' || record.archiveHash !== '9ba871ff2ecd36526b77432745980b7e6664ecd0c7ca11c48849073dcfe06da3' || fs.realpathSync(record.executable) !== record.executable || hash(fs.readFileSync(record.executable)) !== record.executableHash)
        throw unavailable();
}
/** Parent-owned pipes control only one private display. The child sees no host display, credentials or network. */
export class InteractiveBlenderExecutor {
    private child?: ReturnType<typeof spawn>;
    private group?: LinuxJobGroup;
    private done?: Promise<void>;
    private failure?: Error;
    private closing = false;
    private cleanup?: Promise<void>;
    private closed?: Promise<void>;
    private timers: NodeJS.Timeout[] = [];
    private pending = new Map<string, {
        resolve: (value: any) => void;
        reject: (error: Error) => void;
    }>();
    private readyResolve?: (value: any) => void;
    private readyReject?: (error: Error) => void;
    readonly workspace = path.resolve('.runtime/isolation/jobs', randomUUID());
    async start(probe: {
        outside: string;
        port: number;
    }, scene?: BlenderScene, signal?: AbortSignal) {
        assertInteractiveBlenderRuntime();
        if (this.child || signal?.aborted)
            throw unavailable();
        fs.mkdirSync(this.workspace, { recursive: true, mode: 0o700 });
        fs.mkdirSync(path.join(this.workspace, 'tmp'), { mode: 0o700 });
        fs.mkdirSync(path.join(this.workspace, 'tmp', '.X11-unix'), { mode: 0o700 });
        fs.writeFileSync(path.join(this.workspace, 'input.json'), JSON.stringify({ ...probe, ...(scene ? { scene: validateBlenderScene(scene) } : {}) }), { flag: 'wx' });
        const ready = new Promise<any>((resolve, reject) => {
            this.readyResolve = resolve;
            this.readyReject = reject;
        });
        void ready.catch(() => undefined);
        const args = ['--cpu=60', '--fsize=' + interactiveBlenderLimits.profileBytes, '--nofile=256', '--', '/usr/bin/bwrap', '--unshare-all', '--cap-drop', 'ALL', '--die-with-parent', '--new-session', '--clearenv', '--ro-bind', '/opt/cocreate-blender', '/blender', '--ro-bind', path.resolve('server/isolation'), '/control', '--bind', this.workspace, '/session', '--ro-bind', '/usr/bin/Xvfb', '/bin/Xvfb', '--ro-bind', '/usr/bin/dash', '/bin/sh', '--ro-bind', '/usr/bin/sleep', '/bin/sleep', '--proc', '/proc', '--dev', '/dev', '--bind', path.join(this.workspace, 'tmp'), '/tmp'];
        args.push('--ro-bind', '/usr/bin/xkbcomp', '/usr/bin/xkbcomp');
        for (const directory of ['/lib', '/lib64', '/usr/lib', '/usr/share/X11', '/usr/share/fonts', '/etc/fonts', '/usr/share/fontconfig'])
            if (fs.existsSync(directory))
                args.push('--ro-bind', directory, directory);
        for (const [key, value] of Object.entries({ DISPLAY: ':99', HOME: '/session', TMPDIR: '/tmp', LANG: 'C.UTF-8', LIBGL_ALWAYS_SOFTWARE: '1', LP_NUM_THREADS: '2', OMP_NUM_THREADS: '2', BLENDER_USER_CONFIG: '/session/config', BLENDER_USER_SCRIPTS: '/session/scripts', PYTHONNOUSERSITE: '1' }))
            args.push('--setenv', key, value);
        args.push('--chdir', '/session', '/bin/sh', '/control/start-blender-display.sh');
        try {
            this.group = LinuxJobGroup.create(60, true);
        }
        catch (error) {
            fs.rmSync(this.workspace, { recursive: true, force: true });
            throw error;
        }
        const child = this.child = spawn(linuxJobLauncher, ['/usr/bin/prlimit', ...args], { windowsHide: true, detached: true, stdio: ['pipe', 'pipe', 'pipe'], env: { PATH: '/usr/bin:/bin', LANG: 'C.UTF-8' } });
        let received = 0, diagnostics = '', buffer = '';
        child.stdin!.on('error', () => this.stop(unavailable()));
        child.stdout!.on('data', chunk => {
            received += chunk.length;
            if (received > interactiveBlenderLimits.protocolBytes)
                return this.stop(new Error('Dedicated display protocol budget exceeded.'));
            buffer += chunk.toString();
            if (Buffer.byteLength(buffer) > 2 * 1024 ** 2)
                return this.stop(new Error('Dedicated display message exceeded its bound.'));
            let end: number;
            while ((end = buffer.indexOf('\n')) >= 0) {
                const line = buffer.slice(0, end);
                buffer = buffer.slice(end + 1);
                if (!line.startsWith('COCREATE_GUI '))
                    continue;
                try {
                    const reply = JSON.parse(line.slice(13));
                    if (reply.id === 'ready') {
                        this.readyResolve?.(reply.value);
                        this.readyResolve = undefined;
                    }
                    const waiting = this.pending.get(reply.id);
                    if (waiting) {
                        this.pending.delete(reply.id);
                        reply.error ? waiting.reject(new Error('Dedicated app action is uncertain; inspect without replay.')) : waiting.resolve(reply.value);
                    }
                }
                catch {
                    this.stop(unavailable());
                }
            }
        });
        child.stderr!.on('data', chunk => {
            diagnostics += chunk.toString();
            if (Buffer.byteLength(diagnostics) > 128 * 1024)
                this.stop(new Error('Dedicated display diagnostics exceeded their bound.'));
        });
        child.once('error', () => this.stop(unavailable()));
        this.done = new Promise<void>(resolve => child.once('close', code => {
            if (!this.closing && code !== 0)
                this.stop(new Error('Isolated Blender exited; explicit reopening is required. ' + diagnostics.slice(-1200)));
            if (this.readyResolve)
                this.stop(unavailable());
            for (const waiting of this.pending.values())
                waiting.reject(this.failure || new Error('Dedicated app closed; action outcome requires inspection.'));
            this.pending.clear();
            resolve();
        }));
        const abort = () => this.stop(new Error('Dedicated Blender cancelled and all job descendants removed.'));
        signal?.addEventListener('abort', abort, { once: true });
        this.timers.push(setTimeout(() => this.stop(new Error('Dedicated Blender wall bound exceeded.')), interactiveBlenderLimits.wallMs));
        this.timers.push(setInterval(() => {
            try {
                if (this.group!.cpuExceeded())
                    throw new Error('Dedicated Blender aggregate CPU budget exceeded.');
                let bytes = 0;
                const inspect = (directory: string) => {
                    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
                        const filename = path.join(directory, entry.name);
                        let stat: fs.Stats;
                        try {
                            stat = fs.lstatSync(filename);
                        }
                        catch (error) {
                            if ((error as NodeJS.ErrnoException).code === 'ENOENT')
                                continue;
                            throw error;
                        }
                        if (stat.isSymbolicLink())
                            throw unavailable();
                        if (stat.isDirectory())
                            inspect(filename);
                        else
                            bytes += stat.size;
                    }
                };
                inspect(this.workspace);
                if (bytes > interactiveBlenderLimits.profileBytes)
                    throw new Error('Dedicated Blender private file budget exceeded.');
            }
            catch (error) {
                this.stop(error instanceof Error ? error : unavailable());
            }
        }, 100));
        this.done.finally(() => {
            signal?.removeEventListener('abort', abort);
            for (const timer of this.timers)
                clearTimeout(timer);
        });
        try {
            await this.group.attach(child, signal);
            const timer = setTimeout(() => this.stop(new Error('Dedicated Blender graphical startup timed out.')), 30000);
            let opened;
            try {
                opened = await ready;
            }
            finally {
                clearTimeout(timer);
            }
            const evidence = opened.probe;
            if (!evidence?.outsideDenied || !evidence.networkDenied || !evidence.hostDisplayDenied || !evidence.privateDisplay || !evidence.credentialsAbsent || !evidence.capabilitiesAbsent || !evidence.cgroupAuthorityAbsent || evidence.background !== false || evidence.windows !== 1 || evidence.version !== '4.5.14' || !/(llvmpipe|softpipe)/i.test(evidence.renderer))
                throw unavailable();
            return evidence;
        }
        catch (error) {
            await this.close().catch(() => undefined);
            throw error;
        }
    }
    private stop(error: Error) {
        this.failure ??= error;
        this.readyReject?.(this.failure);
        this.readyReject = undefined;
        for (const waiting of this.pending.values())
            waiting.reject(this.failure);
        this.pending.clear();
        try {
            this.group?.kill();
        }
        catch {
        }
        if (this.child?.pid)
            try {
                process.kill(-this.child.pid, 'SIGKILL');
            }
            catch {
                this.child.kill('SIGKILL');
            }
    }
    async call(kind: 'frame' | 'inspect' | 'probe' | 'save' | BlenderInput['kind'], fields: Record<string, unknown> = {}) {
        if (this.failure || !this.child || this.closing || this.pending.size)
            throw this.failure || new Error('Dedicated app is busy or unavailable.');
        if (['click', 'key', 'text'].includes(kind))
            validateBlenderInput({ kind, ...fields });
        const id = randomUUID(), promise = new Promise<any>((resolve, reject) => this.pending.set(id, { resolve, reject }));
        const timer = setTimeout(() => this.stop(new Error('Dedicated app action outcome unknown; never blindly replay.')), 15000);
        this.child.stdin!.write(JSON.stringify({ id, kind, ...fields }) + '\n');
        try {
            return await promise;
        }
        finally {
            clearTimeout(timer);
        }
    }
    async frame() {
        const value = await this.call('frame'), bytes = Buffer.from(value.png || '', 'base64');
        if (bytes.length < 45 || bytes.length > 1024 ** 2 || !bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) || bytes.readUInt32BE(16) !== 960 || bytes.readUInt32BE(20) !== 640) {
            this.stop(unavailable());
            throw unavailable();
        }
        return bytes;
    }
    private async cleanupGroup() {
        this.cleanup ??= this.group?.cleanup() || Promise.resolve();
        await this.cleanup;
        this.group = undefined;
    }
    async waitClosed() {
        await this.done;
        await this.cleanupGroup();
        if (this.failure)
            throw this.failure;
    }
    close() {
        return this.closed ??= (async () => {
            this.closing = true;
            this.stop(new Error('Dedicated session closed.'));
            await this.done;
            await this.cleanupGroup();
            if (path.dirname(this.workspace) !== path.resolve('.runtime/isolation/jobs'))
                throw unavailable();
            fs.rmSync(this.workspace, { recursive: true, force: true });
        })();
    }
}
