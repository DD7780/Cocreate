import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import { randomBytes, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { prepareIsolation } from './isolation.js';
import { approvedDirectory, executeBlender } from './blender-executor.js';
import { BLENDER_OPERATIONS, BLENDER_VERSION, validateBlenderScene, type BlenderCommand, type BlenderResult } from '../shared/blender.js';

export type LocalBlenderApproval = { projectId: string; ownerId: string; ownerName: string; expiresAt: number; participants: Array<{ id: string; name: string }>; executable: string; workspace: string; observe: string[]; control: string[]; operations: readonly string[] };
type Receipt = { commandId: string; epoch: number; state: 'running' | 'completed' | 'cancelled' | 'failed'; result?: BlenderResult; error?: string };
/** Atomic durable receipts precede launch; a repeated command never creates a second process. */
export function writeCompanionReceipt(filename: string, value: unknown) {
  const temporary = filename + '.' + randomUUID() + '.tmp';
  const file = fs.openSync(temporary, 'wx', 0o600);
  try { fs.writeFileSync(file, JSON.stringify(value)); fs.fsyncSync(file); } finally { fs.closeSync(file); }
  fs.renameSync(temporary, filename);
}
async function writePrivateConnection(filename: string, value: unknown) {
  const runtime = await prepareIsolation(), temporary = path.join(path.dirname(filename), `.cocreate-blender-connection.${randomUUID()}.tmp`);
  fs.closeSync(fs.openSync(temporary,'wx',0o600));
  try {
    // Protect the empty file before any bearer bytes are written, including in public task directories.
    execFileSync(path.join(runtime,'runner.exe'),['protect-companion',temporary],{windowsHide:true,stdio:'ignore',env:{SystemRoot:process.env.SystemRoot||'C:\\Windows'}});
    const file=fs.openSync(temporary,'w');
    try { fs.writeFileSync(file,JSON.stringify(value));fs.fsyncSync(file); } finally { fs.closeSync(file); }
    fs.renameSync(temporary,filename);
  } catch(error) {fs.unlinkSync(temporary);throw error;}
}
export async function runBlenderCompanion(options: {
  server: string; projectId: string; pairingToken?: string; resume?: boolean; executable: string; workspace: string;
  observe: string[]; control: string[]; operations: string[]; name: string;
  approveLocal: (approval: LocalBlenderApproval) => Promise<boolean>; signal: AbortSignal;
  onState?: (state: string) => void;
}) {
  const server = new URL(options.server);
  if (server.username || server.password || server.search || server.hash || server.pathname !== '/' || !(server.protocol === 'https:' || server.protocol === 'http:' && ['127.0.0.1','localhost','[::1]'].includes(server.hostname))) throw new Error('Use an HTTPS server origin, or loopback HTTP for controlled development.');
  const workspace = approvedDirectory(options.workspace), connectionFile = path.join(workspace, '.cocreate-blender-connection.json');
  if (fs.existsSync(connectionFile) && !options.resume) throw new Error('An existing companion connection file is present. Use explicit --resume or choose a fresh dedicated workspace; it will not be overwritten.');
  if (fs.existsSync(connectionFile) && fs.lstatSync(connectionFile).isSymbolicLink()) throw new Error('Linked companion connection file rejected.');
  const spool = path.join(workspace, '.cocreate-blender-receipts');
  if (fs.existsSync(spool)) approvedDirectory(spool); else fs.mkdirSync(spool);
  const api = async (endpoint: string, body: unknown, credential?: string) => {
    const response = await fetch(new URL(endpoint, server), { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10_000), headers: { 'Content-Type':'application/json', ...(credential ? { Authorization:`Bearer ${credential}` } : {}) }, body: JSON.stringify(body) });
    const value = await response.json();
    if (!response.ok) throw Object.assign(new Error(value.error || 'Companion connection failed.'), { status: response.status });
    return value;
  };
  const base = `/api/blender/devices/${encodeURIComponent(options.projectId)}`;
  const saved = options.resume && fs.existsSync(connectionFile) ? JSON.parse(fs.readFileSync(connectionFile,'utf8')) : undefined;
  if (saved && (saved.server !== server.origin || saved.projectId !== options.projectId || saved.executable !== path.resolve(options.executable) || saved.workspace !== workspace || !/^[a-f0-9-]{36}$/.test(saved.id) || !/^[A-Za-z0-9_-]{43}$/.test(saved.credential))) throw new Error('Saved device connection does not match the locally selected origin/executable/workspace. Re-pair explicitly.');
  const info = saved ? { projectId: saved.projectId, ownerId: saved.ownerId, ownerName: saved.ownerName, expiresAt: saved.expiresAt, participants: saved.participants } : await api(`${base}/pair-info`, { pairingToken: options.pairingToken });
  if (!BLENDER_OPERATIONS.every(op => options.operations.includes(op)) || options.operations.length !== 3) throw new Error('Explicitly allow only create_scene,save,render for this milestone.');
  const approval: LocalBlenderApproval = { ...info, executable: path.resolve(options.executable), workspace, observe: saved?.observe || options.observe, control: saved?.control || options.control, operations: BLENDER_OPERATIONS };
  if (!await options.approveLocal(approval) || options.signal.aborted) throw new Error('Local device owner declined connection.');
  // Probe the actual selected runtime, not merely its filename or reported metadata.
  const outside = path.join(os.tmpdir(), 'cocreate-blender-private-' + randomUUID());
  fs.writeFileSync(outside,'test-only-private-sentinel',{flag:'wx'});
  const listener = net.createServer(socket => socket.end());
  await new Promise<void>(resolve => listener.listen(0,'127.0.0.1',resolve));
  try { await executeBlender({ executable: options.executable, workspace, commandId: randomUUID(), probe: { outside, port: (listener.address() as net.AddressInfo).port }, signal: options.signal }); }
  finally { listener.close(); fs.unlinkSync(outside); }
  const credential = saved?.credential || randomBytes(32).toString('base64url');
  const session = saved || await api(`${base}/pair`, { credential, name: options.name, observe: options.observe, control: options.control, operations: [...BLENDER_OPERATIONS], blenderVersion: BLENDER_VERSION, localApproval: true }, options.pairingToken);
  const deviceBase = `${base}/${encodeURIComponent(session.id)}`;
  if (!saved) {
    try { await writePrivateConnection(connectionFile, { ...approval, server: server.origin, projectId: options.projectId, id: session.id, credential, expiresAt: session.expiresAt }); }
    catch (error) { await api(`${deviceBase}/stop`, {}, credential).catch(() => undefined); throw error; }
  }
  options.onState?.('Connected · background Blender execution · local STOP / Ctrl+C cancels and disconnects');
  let active: { command: BlenderCommand; controller: AbortController; promise: Promise<void> } | undefined, lastSuccess = Date.now(), receiptFailure: unknown;
  const readReceipt = (command: BlenderCommand): Receipt | undefined => {
    const filename = path.join(spool, `${command.id}.json`);
    if (!fs.existsSync(filename)) return;
    if (fs.lstatSync(filename).isSymbolicLink()) throw new Error('Linked execution receipt rejected.');
    const receipt = JSON.parse(fs.readFileSync(filename,'utf8')) as Receipt;
    if (receipt.commandId !== command.id || receipt.epoch !== command.epoch || !['running','completed','cancelled','failed'].includes(receipt.state)) throw new Error('Local execution receipt is corrupt; explicit recovery required.');
    return receipt;
  };
  const abort = () => active?.controller.abort(); options.signal.addEventListener('abort',abort,{once:true});
  try {
    while (!options.signal.aborted) {
      if (receiptFailure) throw receiptFailure;
      try {
        const packet = await api(`${deviceBase}/poll`, {}, credential); lastSuccess = Date.now();
        const command = packet.command as BlenderCommand | null;
        if (Date.now() >= packet.session.expiresAt || packet.session.state !== 'connected') throw Object.assign(new Error('Device connection expired or revoked.'),{status:401});
        if (active && (!command || command.id !== active.command.id || command.epoch !== active.command.epoch || ['cancel_requested','interrupted'].includes(command.state))) { active.controller.abort(); await active.promise; active = undefined; }
        if (command) {
          if (!/^[a-f0-9-]{36}$/.test(command.id) || command.sessionId !== session.id || command.epoch !== packet.session.epoch) throw new Error('Invalid or stale device command.');
          const scene = validateBlenderScene(command.scene), filename = path.join(spool, `${command.id}.json`);
          const receipt = readReceipt(command);
          if (receipt && !active) {
            const settled = receipt.state === 'running' ? { ...receipt, state:'failed', error:'Interrupted local execution. No replay; explicitly retry.' } : receipt;
            await api(`${deviceBase}/result`, settled, credential);
          } else if (!active && ['cancel_requested','interrupted'].includes(command.state)) {
            const settled: Receipt = { commandId:command.id, epoch:command.epoch, state:'cancelled', error:'Cancelled before execution.' };
            writeCompanionReceipt(filename, settled); await api(`${deviceBase}/result`,settled,credential);
          } else if (!active && !receipt) {
            writeCompanionReceipt(filename,{commandId:command.id,epoch:command.epoch,state:'running'});
            const controller = new AbortController();
            const promise = (async () => {
              let receipt: Receipt;
              try {
                options.onState?.(`Executing dedicated task ${command.taskId}`);
                const run = await executeBlender({ executable:options.executable, workspace, commandId:command.id, scene, signal:controller.signal });
                receipt = {commandId:command.id,epoch:command.epoch,state:'completed',result:run.result};
              } catch (error) { receipt = {commandId:command.id,epoch:command.epoch,state:controller.signal.aborted?'cancelled':'failed',error:error instanceof Error?error.message.slice(0,1000):'Blender execution failed.'}; }
              writeCompanionReceipt(filename,receipt);
              options.onState?.(`Task ${receipt.state} · outputs retained for authenticated upload reconciliation`);
            })();
            active = {command,controller,promise};
            void promise.then(() => { if (active?.command.id === command.id) active = undefined; }, error => {
              // A failed durable receipt cannot be retried as a fresh execution in this connection.
              receiptFailure = error; active?.controller.abort();
            });
          }
        }
      } catch (error) {
        const status = Number((error as {status?:number}).status);
        options.onState?.(error instanceof Error?error.message:'Disconnected');
        if ([401,403].includes(status) || Date.now()-lastSuccess > 10_000) { active?.controller.abort(); break; }
      }
      await new Promise<void>(resolve => { const timer=setTimeout(resolve,1000); const wake=()=>{clearTimeout(timer);resolve();}; options.signal.addEventListener('abort',wake,{once:true}); setTimeout(()=>options.signal.removeEventListener('abort',wake),1100).unref(); });
    }
  } finally {
    active?.controller.abort(); await active?.promise.catch(() => undefined);
    options.signal.removeEventListener('abort',abort);
    await api(`${deviceBase}/stop`,{},credential).catch(()=>undefined);
    if (fs.existsSync(connectionFile)) fs.unlinkSync(connectionFile);
    options.onState?.('Stopped · dedicated job removed · connection closed. Saved project artifacts remain available.');
  }
}
