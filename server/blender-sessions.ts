import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { BLENDER_OPERATIONS, BLENDER_VERSION, validateBlenderScene, type BlenderCommand, type BlenderFrozenInput, type BlenderOperation, type BlenderScene, type BlenderSessionView } from '../shared/blender.js';
import {INTERACTIVE_BLENDER_POLICY} from '../shared/blender-interactive.js';
import {activeInteractive,validateInteractiveState,type InteractiveState} from './blender-interactive-state.js';

export const PAIR_MS = 5 * 60_000, CONNECTION_MS = 30 * 60_000, IDLE_MS = 10 * 60_000, HEARTBEAT_MS = 30_000;
export type BlenderDevice = Omit<BlenderSessionView,'interactive'> & { interactive?:InteractiveState; credentialHash: string; operations: BlenderOperation[]; lastActivityAt: number; command?: BlenderCommand };
export type BlenderState = { devices: BlenderDevice[]; pairs: Array<{ hash: string; actorId: string; expiresAt: number; used: boolean }> };
function deny(message: string, status = 403): never { throw Object.assign(new Error(message), { status }); }
export const deviceHash = (secret: string) => createHash('sha256').update(secret).digest('hex');
const equal = (a: string, b: string) => /^[a-f0-9]{64}$/.test(a) && /^[a-f0-9]{64}$/.test(b) && timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
export function initialBlenderState(value?: unknown): BlenderState {
  if (value === undefined) return { devices: [], pairs: [] };
  const state = value as BlenderState;
  if (!state || !Array.isArray(state.devices) || !Array.isArray(state.pairs) || state.devices.length > 8 || state.pairs.length > 32) deny('Stored Blender connection state is invalid.', 409);
  for (const device of state.devices) {
    if(device.interactive)validateInteractiveState(device.interactive);
    if (!device || !/^[a-f0-9-]{36}$/.test(device.id) || device.deviceId !== device.id || typeof device.ownerId !== 'string' || !device.ownerId || !Number.isSafeInteger(device.epoch) || device.epoch < 1 || !/^[a-f0-9]{64}$/.test(device.credentialHash) || !Array.isArray(device.observe) || !Array.isArray(device.control) || !Array.isArray(device.operations) || device.operations.some(op => !BLENDER_OPERATIONS.includes(op)) || !Number.isFinite(device.expiresAt) || !Number.isFinite(device.lastActivityAt) || !Number.isFinite(device.lastSeenAt)) deny('Stored Blender device is invalid.', 409);
    if (!['connected','disconnected','expired','revoked'].includes(device.state) || !['human','agent'].includes(device.mode) || typeof device.paused !== 'boolean' || typeof device.deviceName !== 'string' || device.deviceName.length > 80 || device.observe.some(id => typeof id !== 'string') || device.control.some(id => typeof id !== 'string' || !device.observe.includes(id)) || !device.control.includes(device.controllerId) || !device.control.includes(device.ownerId)) deny('Stored Blender grants are invalid.', 409);
    if (device.command) {
      const command = device.command, frozen = command.frozen;
      validateBlenderScene(command.scene);
      if (!/^[a-f0-9-]{36}$/.test(command.id) || !/^[a-f0-9-]{36}$/.test(command.taskId) || command.sessionId !== device.id || !Number.isSafeInteger(command.epoch) || !['queued','running','interrupted','cancel_requested','completed','cancelled','failed'].includes(command.state) || !frozen || typeof frozen.participantId !== 'string' || !frozen.participantId || typeof frozen.fingerprint !== 'string' || !Number.isSafeInteger(frozen.specificationRevision) || frozen.specificationRevision < 0 || !Array.isArray(frozen.submissionIds) || frozen.submissionIds.some(id => typeof id !== 'string') || !Array.isArray(frozen.requirementRevisions) || frozen.requirementRevisions.some(ref => typeof ref.id !== 'string' || !Number.isSafeInteger(ref.revision) || ref.revision < 1) || !Array.isArray(frozen.inputVersions) || frozen.inputVersions.some(ref => typeof ref.artifactId !== 'string' || !Number.isSafeInteger(ref.versionId) || ref.versionId < 1 || !/^sha256:[a-f0-9]{64}$/.test(ref.contentRef))) deny('Stored Blender command is invalid.', 409);
    }
  }
  for (const pair of state.pairs) if (!/^[a-f0-9]{64}$/.test(pair.hash) || typeof pair.actorId !== 'string' || !Number.isFinite(pair.expiresAt) || typeof pair.used !== 'boolean') deny('Stored Blender pairing is invalid.', 409);
  return structuredClone(state);
}
export function recoverBlenderState(value?: unknown) {
  const state = initialBlenderState(value);
  for (const device of state.devices) if (device.command && ['queued','running'].includes(device.command.state)) device.command.state = 'interrupted';
  for(const device of state.devices)if(device.interactive){device.interactive.state='unknown';for(const command of device.interactive.receipts)if(['queued','running','cancel_requested'].includes(command.state))command.state='unknown';if(device.command&&['interrupted','cancel_requested'].includes(device.command.state)){device.command.state='cancelled';device.command.error='Interactive coordinator restarted; stale execution is fenced and never replayed. Inspect local saved outputs before an explicit new task.';}device.mode='human';device.epoch++;device.state='disconnected';}
  return state;
}
export function createPair(state: BlenderState, actorId: string, clock = Date.now()) {
  const token = randomBytes(32).toString('base64url');
  state.pairs = state.pairs.filter(pair => pair.expiresAt > clock).slice(-31);
  state.pairs.push({ hash: deviceHash(token), actorId, expiresAt: clock + PAIR_MS, used: false });
  return { pairingToken: token, expiresAt: clock + PAIR_MS };
}
export function pairingOwner(state: BlenderState, token: string, clock = Date.now()) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) deny('Invalid pairing token.', 401);
  const pair = state.pairs.find(pair => equal(pair.hash, deviceHash(token)));
  if (!pair || pair.used || pair.expiresAt <= clock) deny('Pairing expired or already used.', 401);
  return pair;
}
export function approveDevice(state: BlenderState, token: string, input: unknown, participants: string[], clock = Date.now()) {
  const pair = pairingOwner(state, token, clock), request = input as Record<string, unknown>;
  if (!request || Object.keys(request).sort().join() !== ['credential', 'name', 'observe', 'control', 'operations', 'blenderVersion', 'localApproval',...(request.interactivePolicy!==undefined?['interactivePolicy']:[])].sort().join() || request.interactivePolicy!==undefined&&request.interactivePolicy!==INTERACTIVE_BLENDER_POLICY || request.localApproval !== true || request.blenderVersion !== BLENDER_VERSION || typeof request.name !== 'string' || !request.name.trim() || request.name.length > 80 || typeof request.credential !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(request.credential)) deny('A verified locally approved Blender device is required.', 400);
  const grants = (value: unknown) => { if (!Array.isArray(value) || value.length > 100 || value.some(id => typeof id !== 'string' || !participants.includes(id)) || new Set(value).size !== value.length) deny('Local session grants must name current participants.', 400); return value as string[]; };
  const observe = [...new Set([pair.actorId, ...grants(request.observe)])], control = [...new Set([pair.actorId, ...grants(request.control)])];
  if (control.some(id => !observe.includes(id))) deny('Controllers require a separate observation grant.', 400);
  if (!Array.isArray(request.operations) || request.operations.length !== 3 || BLENDER_OPERATIONS.some(op => !(request.operations as unknown[]).includes(op))) deny('The bounded milestone requires explicit create_scene, save and render permission.', 400);
  for (const device of state.devices) if (device.state !== 'revoked' && (clock >= device.expiresAt || clock - device.lastActivityAt >= IDLE_MS)) device.state = 'expired';
  if (state.devices.filter(device => !['revoked', 'expired'].includes(device.state)).length >= 4) deny('Disconnect an existing device before pairing another.', 409);
  const id = randomUUID();
  const device: BlenderDevice = { id, deviceId: id, deviceName: request.name.trim(), ownerId: pair.actorId, controllerId: pair.actorId, epoch: 1, mode: 'human', state: 'connected', expiresAt: clock + CONNECTION_MS, lastSeenAt: clock, lastActivityAt: clock, paused: false, observe, control, operations: [...BLENDER_OPERATIONS], credentialHash: deviceHash(request.credential) };
  pair.used = true;
  if(request.interactivePolicy===INTERACTIVE_BLENDER_POLICY)device.interactive={policy:INTERACTIVE_BLENDER_POLICY,state:'closed',receipts:[]};
  state.devices = [...state.devices.filter(item => !['revoked','expired'].includes(item.state)).slice(-7), device];
  return device;
}
export function deviceAccess(state: BlenderState, id: string, credential: string, clock = Date.now()) {
  const device = state.devices.find(item => item.id === id);
  if (!device || !/^[A-Za-z0-9_-]{43}$/.test(credential) || !equal(device.credentialHash, deviceHash(credential))) deny('Device authentication failed.', 401);
  if (device.state === 'revoked' || device.state === 'expired' || clock >= device.expiresAt || clock - device.lastActivityAt >= IDLE_MS) deny('Device expired or revoked. Re-pair locally; no automatic execution.', 401);
  return device;
}
export function sessionAccess(state: BlenderState, id: string, actorId: string, control = false) {
  const device = state.devices.find(item => item.id === id);
  if (!device || !(control ? device.control : device.observe).includes(actorId)) deny('A separate local session grant is required. Project membership grants saved-result access only.');
  return device;
}
export const inFlight = (device: BlenderDevice) => !!activeInteractive(device)||!!device.command && ['queued','running','interrupted','cancel_requested'].includes(device.command.state);
export function sessionCommand(state: BlenderState, id: string, actorId: string, input: unknown, clock = Date.now()) {
  const device = sessionAccess(state, id, actorId, true), request = input as { action?: unknown; epoch?: unknown; actorId?: unknown };
  if (!request || Object.keys(request).some(key => !['action','epoch','actorId'].includes(key)) || request.epoch !== device.epoch || !['pause','resume','cancel','disconnect','handoff'].includes(String(request.action))) deny('Stale or invalid controller command.', 409);
  if (request.action === 'disconnect') {
    if (actorId !== device.ownerId) deny('Only the device owner may revoke its connection.');
    device.state = 'revoked'; device.epoch++; device.credentialHash = deviceHash(randomBytes(32).toString('base64url'));
    if(device.interactive){const pending=activeInteractive(device);if(pending)pending.state='unknown';device.interactive.state='unknown';}
    if (inFlight(device)) device.command!.state = 'cancel_requested';
    return;
  }
  if (device.state !== 'connected' || clock >= device.expiresAt || clock - device.lastActivityAt >= IDLE_MS || clock - device.lastSeenAt > HEARTBEAT_MS) deny('Device connection is unavailable. Reconnect with local approval.', 409);
  if (actorId !== device.controllerId) deny('Only the current controller may issue this command.');
  if (request.action === 'handoff') {
    if (inFlight(device) || device.mode === 'agent' || device.interactive?.state==='unknown') deny('Wait for execution/cancellation acknowledgement before handing off control.', 409);
    if (typeof request.actorId !== 'string' || !device.control.includes(request.actorId)) deny('The target needs a locally approved control grant.');
    device.controllerId = request.actorId; device.epoch++;
  } else if (request.action === 'pause' || request.action === 'cancel') {
    device.paused = request.action === 'pause';
    if(device.command&&['queued','running','interrupted','cancel_requested'].includes(device.command.state))device.command.state='cancel_requested';
    if(device.interactive){const pending=activeInteractive(device);if(pending)pending.state='cancel_requested';device.interactive.state='unknown';}
  } else device.paused = false;
  device.lastActivityAt = clock;
}
export function queueScene(device: BlenderDevice, actorId: string, taskId: string, scene: BlenderScene, frozen: BlenderFrozenInput, clock = Date.now()) {
  if (device.controllerId !== actorId || !device.control.includes(actorId) || device.paused || device.state !== 'connected' || clock >= device.expiresAt || clock - device.lastSeenAt > HEARTBEAT_MS || clock - device.lastActivityAt >= IDLE_MS || inFlight(device)) deny('Connect a locally approved device, take explicit control and resume before submitting a Blender task.', 409);
  device.lastActivityAt = clock; device.mode = 'agent';
  device.command = { id: randomUUID(), sessionId: device.id, epoch: device.epoch, taskId, frozen: structuredClone(frozen), scene: validateBlenderScene(scene), state: 'queued' };
  return device.command;
}
export function sessionView(device: BlenderDevice): BlenderSessionView {
  const { credentialHash, operations, lastActivityAt, command, interactive, ...view } = device;
  const clock = Date.now();
  return { ...view, ...(interactive?{interactive:{policy:interactive.policy,state:interactive.state,pending:activeInteractive(device)?{id:activeInteractive(device)!.id,action:activeInteractive(device)!.action,state:activeInteractive(device)!.state}:undefined,lastSave:interactive.lastSave}}:{}), state: view.state === 'revoked' ? 'revoked' : clock >= view.expiresAt || clock - lastActivityAt >= IDLE_MS ? 'expired' : clock - view.lastSeenAt > HEARTBEAT_MS && view.state === 'connected' ? 'disconnected' : view.state, ...(command ? { task: { id: command.id, taskId: command.taskId, state: command.state, error: command.error } } : {}) };
}
