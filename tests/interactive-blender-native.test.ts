import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { randomUUID } from 'node:crypto';
import { InteractiveBlenderExecutor, assertInteractiveBlenderRuntime } from '../server/interactive-blender-executor.js';
import { validateBlenderInput } from '../shared/blender-interactive.js';
import { createCanvasArtifactsFixture } from './fixtures/canvas-artifacts.js';
import { runBlenderCompanion } from '../server/blender-companion.js';
test('interactive Blender input denies script, paths, clipboard, global shortcuts and unchecked coordinates', () => {
    for (const input of [{ kind: 'eval', script: 'x' }, { kind: 'text', text: 'import os' }, { kind: 'key', key: 'F4' }, { kind: 'key', key: 'g', ctrl: true }, { kind: 'click', x: 960, y: 0 }, { kind: 'save', path: '/host/file' }])
        assert.throws(() => validateBlenderInput(input));
    assert.deepEqual(validateBlenderInput({ kind: 'text', text: '-2.5' }), { kind: 'text', text: '-2.5' });
    if (process.platform !== 'linux')
        assert.throws(() => assertInteractiveBlenderRuntime(), /unavailable/);
});
test('native companion lets two independent participants observe, hand off, stop and retrieve private saved outputs', { skip: process.platform !== 'linux' || process.env.COCREATE_INTERACTIVE_BLENDER !== 'linux-xvfb-v1', timeout: 180000 }, async () => {
    const f = await createCanvasArtifactsFixture(), controller = new AbortController(), workspace = path.resolve('.runtime', 'gui-companion-' + randomUUID());
    fs.mkdirSync(workspace, { mode: 0o700 });
    let running: Promise<void> | undefined, failed: unknown;
    const base = `/api/rooms/${f.room.id}/blender`;
    const request = async (actor: string, endpoint: string, body?: unknown) => {
        const response = await fetch(f.url + base + endpoint, { method: body === undefined ? 'GET' : 'POST', headers: { Authorization: 'Bearer ' + f.token(actor), 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
        return { status: response.status, body: response.headers.get('content-type')?.includes('json') ? await response.json() : Buffer.from(await response.arrayBuffer()) };
    };
    const until = async (check: () => boolean, label: string) => {
        const end = Date.now() + 45000;
        while (Date.now() < end) {
            if (failed)
                throw failed;
            if (check())
                return;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        throw Error('Native participant acceptance timed out: ' + label);
    };
    try {
        const pair = (await request('alice', '/pair', {})).body;
        running = runBlenderCompanion({ server: f.url, projectId: f.room.id, pairingToken: pair.pairingToken, interactive: true, executable: '/opt/cocreate-blender/blender', workspace, observe: ['bob'], control: ['bob'], operations: ['create_scene', 'save', 'render'], name: 'Native private display', signal: controller.signal, approveLocal: async (approval) => {
                assert.equal(approval.ownerId, 'alice');
                assert.deepEqual(approval.control, ['bob']);
                return true;
            } });
        void running.catch(error => failed = error);
        await until(() => !!f.room.blender?.devices.length, 'paired after actual GUI preflight');
        const id = f.room.blender!.devices[0].id;
        const command = async (actor: string, epoch: number, action: string, input?: unknown) => {
            const value = await request(actor, `/sessions/${id}/input`, { requestId: randomUUID(), epoch, action, ...(input ? { input } : {}) });
            assert.equal(value.status, 200, JSON.stringify(value.body));
            await until(() => !f.room.blender!.devices[0].interactive!.receipts.some(item => item.id === value.body.id && ['queued', 'running', 'cancel_requested'].includes(item.state)), 'command cleanup acknowledgement');
            assert.equal(f.room.blender!.devices[0].interactive!.receipts.find(item => item.id === value.body.id)!.state, 'completed');
        };
        await command('alice', 1, 'open');
        await new Promise(resolve => setTimeout(resolve, 1200));
        const alice = await request('alice', `/sessions/${id}/frame`), bob = await request('bob', `/sessions/${id}/frame`);
        assert.equal(alice.status, 200);
        assert.equal(bob.status, 200);
        assert.deepEqual(alice.body, bob.body);
        assert.ok(alice.body.length > 1000);
        assert.equal((await request('alice', `/sessions/${id}/control`, { action: 'handoff', epoch: 1, actorId: 'bob' })).status, 200);
        assert.equal((await request('alice', `/sessions/${id}/input`, { requestId: randomUUID(), epoch: 1, action: 'input', input: { kind: 'key', key: 'g' } })).status, 409);
        await command('bob', 2, 'input', { kind: 'key', key: 'Escape' });
        await command('bob', 2, 'input', { kind: 'click', x: 450, y: 300 });
        for (const key of ['g', 'x'])
            await command('bob', 2, 'input', { kind: 'key', key });
        await command('bob', 2, 'input', { kind: 'text', text: '2' });
        await command('bob', 2, 'input', { kind: 'key', key: 'Return' });
        await command('bob', 2, 'save');
        const saved = f.room.blender!.devices[0].interactive!.lastSave!;
        assert.ok(saved);
        for (const actor of ['alice', 'bob']) {
            const file = await request(actor, `/artifacts/${saved.artifactId}/versions/${saved.versionId}/scene.blend`);
            assert.equal(file.status, 200);
            assert.equal(file.body.subarray(0, 7).toString(), 'BLENDER');
        }
        await command('bob', 2, 'open');
        await f.submit('bob', 'Create a Blender scene titled "Agent proof" with a blue cube, camera and lighting. Save the scene and render an image.');
        const building = f.build();
        await until(() => f.room.blender!.devices[0].mode === 'agent', 'agent fence installed');
        assert.equal((await request('bob', `/sessions/${id}/input`, { requestId: randomUUID(), epoch: 2, action: 'input', input: { kind: 'key', key: 'g' } })).status, 409);
        await building;
        assert.ok(f.room.blenderArtifacts?.some(item => item.title === 'Agent proof'), f.room.lastError);
        assert.equal(f.calls.length, 2, 'Only explicit Canvas interpretation and builder calls');
        await command('bob', 2, 'open');
        controller.abort();
        await running;
        assert.equal(f.room.blender!.devices[0].state, 'revoked');
        assert.equal((await request('bob', `/sessions/${id}/frame`)).status, 409);
        console.log('INTERACTIVE_TWO_PARTICIPANTS', JSON.stringify({ sessionId: id, frames: true, handoffEpoch: 2, privateSavedVersion: saved.versionId, humanAgentExclusion: true, localStop: true, controlledInferenceCalls: 2 }));
    }
    finally {
        controller.abort();
        await running?.catch(() => undefined);
        await f.close();
        fs.rmSync(workspace, { recursive: true, force: true });
    }
});
test('private Linux Blender has actual frames and effective input while host display, files, network and secrets stay isolated', { skip: process.platform !== 'linux' || process.env.COCREATE_INTERACTIVE_BLENDER !== 'linux-xvfb-v1' }, async () => {
    const outside = path.resolve('.runtime/private-blender-sentinel-' + randomUUID());
    fs.writeFileSync(outside, 'private host file');
    const listener = net.createServer(socket => socket.destroy());
    await new Promise<void>(resolve => listener.listen(0, '127.0.0.1', resolve));
    const executor = new InteractiveBlenderExecutor();
    try {
        const proof = await executor.start({ outside, port: (listener.address() as net.AddressInfo).port });
        console.log('INTERACTIVE_NATIVE_PROOF', JSON.stringify(proof));
        const first = await executor.frame();
        assert.ok(first.length > 1000);
        const before = await executor.call('inspect'), cube = before.objects.find((item: any) => item.name === 'Cube');
        assert.ok(cube);
        assert.equal(before.active, 'Cube');
        await executor.call('key', { key: 'Escape' });
        await executor.call('click', { x: 450, y: 300 });
        await new Promise(resolve => setTimeout(resolve, 200));
        // A real Blender translation, not merely a successful message post.
        for (const key of ['g', 'x']) {
            await executor.call('key', { key });
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        await executor.call('text', { text: '2' });
        await new Promise(resolve => setTimeout(resolve, 100));
        await executor.call('key', { key: 'Return' });
        await new Promise(resolve => setTimeout(resolve, 300));
        const after = await executor.call('inspect'), changed = after.objects.find((item: any) => item.name === 'Cube');
        assert.ok(Math.abs(changed.location[0] - cube.location[0] - 2) < .01, JSON.stringify({ before, after }));
        assert.deepEqual(await executor.call('probe'), proof, 'Isolation holds after effective human input');
        const second = await executor.frame();
        assert.notDeepEqual(first, second);
        await executor.call('save');
        await executor.waitClosed();
        assert.equal(fs.readFileSync(path.join(executor.workspace, 'scene.blend')).subarray(0, 7).toString(), 'BLENDER');
        const render = fs.readFileSync(path.join(executor.workspace, 'render.png'));
        assert.equal(render.readUInt32BE(16), 512);
        assert.equal(render.readUInt32BE(20), 512);
        console.log('INTERACTIVE_NATIVE_SAVED', JSON.stringify({ blendBytes: fs.statSync(path.join(executor.workspace, 'scene.blend')).size, renderBytes: render.length, effectiveTranslation: 2, cleanupVerified: true }));
    }
    finally {
        await executor.close();
        fs.unlinkSync(outside);
        await new Promise<void>(resolve => listener.close(() => resolve()));
    }
});
