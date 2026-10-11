import { createHash } from 'node:crypto';
import { INTERACTIVE_BLENDER_POLICY, validateBlenderInput, type BlenderInput } from '../shared/blender-interactive.js';
import type { BlenderDevice } from './blender-sessions.js';
export type InteractiveCommand = {
    id: string;
    actorId: string;
    epoch: number;
    action: 'open' | 'input' | 'save' | 'close';
    input?: BlenderInput;
    hash: string;
    state: 'queued' | 'running' | 'cancel_requested' | 'completed' | 'unknown' | 'cancelled';
    outputHash?: string;
};
export type InteractiveState = {
    policy: typeof INTERACTIVE_BLENDER_POLICY;
    state: 'closed' | 'open' | 'unknown';
    receipts: InteractiveCommand[];
    lastSave?: {
        artifactId: string;
        versionId: number;
    };
};
function deny(): never {
    throw Object.assign(new Error('Dedicated Blender command is stale, busy or unavailable. Inspect the receipt; interrupted input is never replayed.'), { status: 409 });
}
export const interactiveHash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const activeInteractive = (device: BlenderDevice) => device.interactive?.receipts.find(item => ['queued', 'running', 'cancel_requested'].includes(item.state));
export function validateInteractiveState(value: unknown): InteractiveState {
    const state = value as InteractiveState;
    if (!state || Object.keys(state).some(key => !['policy', 'state', 'receipts', 'lastSave'].includes(key)) || state.policy !== INTERACTIVE_BLENDER_POLICY || !['closed', 'open', 'unknown'].includes(state.state) || !Array.isArray(state.receipts) || state.receipts.length > 64)
        deny();
    const ids = new Set<string>();
    let pending = 0;
    for (const receipt of state.receipts) {
        if (!receipt || Object.keys(receipt).some(key => !['id', 'actorId', 'epoch', 'action', 'input', 'hash', 'state', 'outputHash'].includes(key)) || !/^[a-f0-9-]{36}$/.test(receipt.id) || ids.has(receipt.id) || typeof receipt.actorId !== 'string' || !receipt.actorId || receipt.actorId.length > 100 || !Number.isSafeInteger(receipt.epoch) || receipt.epoch < 1 || !['open', 'input', 'save', 'close'].includes(receipt.action) || !['queued', 'running', 'completed', 'cancel_requested', 'unknown', 'cancelled'].includes(receipt.state) || !/^[a-f0-9]{64}$/.test(receipt.hash) || receipt.outputHash !== undefined && !/^[a-f0-9]{64}$/.test(receipt.outputHash))
            deny();
        if (receipt.action === 'input')
            validateBlenderInput(receipt.input);
        else if (receipt.input !== undefined)
            deny();
        if (receipt.hash !== interactiveHash({ id: receipt.id, actorId: receipt.actorId, epoch: receipt.epoch, action: receipt.action, ...(receipt.input ? { input: receipt.input } : {}) }))
            deny();
        if (['queued', 'running', 'cancel_requested'].includes(receipt.state))
            pending++;
        ids.add(receipt.id);
    }
    if (pending > 1 || state.lastSave && (!/^blend_[a-f0-9]{24}$/.test(state.lastSave.artifactId) || !Number.isSafeInteger(state.lastSave.versionId) || state.lastSave.versionId < 1))
        deny();
    return structuredClone(state);
}
export function queueInteractive(device: BlenderDevice, actorId: string, input: unknown) {
    const request = input as {
        requestId: string;
        epoch: number;
        action: InteractiveCommand['action'];
        input?: unknown;
    };
    const state = device.interactive;
    if (!state || !request || Object.keys(request).some(key => !['requestId', 'epoch', 'action', 'input'].includes(key)) || !/^[a-f0-9-]{36}$/.test(request.requestId) || request.epoch !== device.epoch || device.controllerId !== actorId || !device.control.includes(actorId) || !['open', 'input', 'save', 'close'].includes(request.action))
        deny();
    const checked = request.action === 'input' ? validateBlenderInput(request.input) : undefined;
    if (request.action !== 'input' && request.input !== undefined)
        deny();
    const command: InteractiveCommand = { id: request.requestId, actorId, epoch: request.epoch, action: request.action, ...(checked ? { input: checked } : {}), hash: '', state: 'queued' };
    command.hash = interactiveHash({ id: command.id, actorId, epoch: command.epoch, action: command.action, ...(checked ? { input: checked } : {}) });
    const prior = state.receipts.find(item => item.id === command.id);
    if (prior) {
        if (prior.hash !== command.hash)
            deny();
        return prior;
    }
    if (state.receipts.length >= 64 || activeInteractive(device) || device.mode !== 'human' || device.command && ['queued', 'running', 'interrupted', 'cancel_requested'].includes(device.command.state) || device.paused && request.action !== 'close' || device.state !== 'connected' || Date.now() >= device.expiresAt || Date.now() - device.lastSeenAt > 30000 || Date.now() - device.lastActivityAt >= 600000)
        deny();
    if (request.action === 'open' && state.state === 'open' || ['input', 'save'].includes(request.action) && state.state !== 'open')
        deny();
    state.receipts.push(command);
    device.lastActivityAt = Date.now();
    return command;
}
