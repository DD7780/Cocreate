import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { RemoteCoordinator, CoordinatorUnavailableError } from '../server/coordinator.js';
import { RoomManager } from '../server/rooms.js';
import { extractRequirement } from '../server/generator.js';
import { SupabasePlatform } from '../server/supabase-platform.js';
const deferred = <T>() => { let resolve!: (value: T) => void; const promise = new Promise<T>(r => { resolve = r; }); return { promise, resolve }; };
const ok = (data: unknown) => ({ data, error: null });
test('remote claims and renewals coalesce; timeout permanently fences a delayed renewal', async () => {
    let calls = 0;
    const renewal = deferred<ReturnType<typeof ok>>();
    const coordinator = new RemoteCoordinator(async (_name, input) => { calls++; return input.expected_epoch === null ? ok(1) : renewal.promise; }, { timeoutMs: 20 });
    let lost = 0;
    coordinator.onLost(() => lost++);
    try {
        await Promise.all([coordinator.claim('project'), coordinator.claim('project')]);
        assert.equal(calls, 1);
        const a = coordinator.assert('project'), b = coordinator.assert('project');
        assert.equal(a, b);
        await assert.rejects(a, CoordinatorUnavailableError);
        assert.equal(lost, 1);
        renewal.resolve(ok(1));
        await new Promise(resolve => setImmediate(resolve));
        assert.throws(() => coordinator.fence('project'), CoordinatorUnavailableError);
        await assert.rejects(coordinator.claim('project'), CoordinatorUnavailableError);
        assert.equal(calls, 2);
    }
    finally {
        await coordinator.close();
    }
});
test('closing during a claim releases the late epoch without reviving ownership', async () => {
    const claim = deferred<ReturnType<typeof ok>>();
    const released: number[] = [];
    const coordinator = new RemoteCoordinator(async (name, input) => { if (name.startsWith('release')) {
        released.push(Number(input.expected_epoch));
        return ok(null);
    } return claim.promise; });
    const claiming = coordinator.claim('project');
    const rejected = assert.rejects(claiming, CoordinatorUnavailableError);
    const closing = coordinator.close();
    claim.resolve(ok(9));
    await Promise.all([closing, rejected]);
    assert.deepEqual(released, [9]);
    assert.throws(() => coordinator.fence('project'), CoordinatorUnavailableError);
});
test('closing during renewal cannot validate an old worker; malformed epochs fail closed', async () => {
    const renewal = deferred<ReturnType<typeof ok>>();
    const coordinator = new RemoteCoordinator(async (name, input) => name.startsWith('release') ? ok(null) : input.expected_epoch === null ? ok(1) : renewal.promise);
    await coordinator.claim('project');
    const renewing = coordinator.assert('project'), rejected = assert.rejects(renewing, CoordinatorUnavailableError);
    const closing = coordinator.close();
    renewal.resolve(ok(1));
    await Promise.all([closing, rejected]);
    for (const epoch of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1, '1', null]) {
        const invalid = new RemoteCoordinator(async () => ok(epoch));
        try {
            await assert.rejects(invalid.claim('project'), CoordinatorUnavailableError);
        }
        finally {
            await invalid.close();
        }
    }
});
test('loss during durable dispatch intent prevents physical provider HTTP and subsequent mutations', async () => {
    let requests = 0;
    const server = http.createServer((_req, res) => { requests++; res.end('{}'); });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const entered = deferred<void>(), release = deferred<void>();
    let listener!: (id: string) => void;
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'coordinator-dispatch-'));
    const manager = new RoomManager({ debounceMs: 1000, encryptionSecret: 'synthetic', dataDir: dir, durableStore: { saveSnapshot: async () => { }, appendDocumentUpdate: async () => { }, assertCoordinator: async () => { }, onCoordinatorLost: callback => { listener = callback; return () => { }; }, recordProviderRequest: async (record) => { if (record.outcome === 'dispatching') {
                entered.resolve();
                await release.promise;
            } } } });
    try {
        const room = manager.create('project');
        manager.join(room, 'alice', 'Alice');
        const controller = new AbortController();
        room.agentControllers.set('alice', controller);
        room.buildController = new AbortController();
        const codes: number[] = [];
        room.clients.add({ readyState: 1, send() { }, close(code: number) { codes.push(code); this.readyState = 3; } } as any);
        const work = (manager as any).tracked(room, { purpose: 'personal_interpreter', provider: 'custom', model: 'synthetic', actorId: 'alice' }, () => extractRequirement({ mode: 'openai', apiKey: 'synthetic', model: 'synthetic', provider: 'custom', apiFormat: 'responses', baseUrl: `http://127.0.0.1:${(server.address() as {
                port: number;
            }).port}` }, 'alice', 'Alice', [], '', undefined, 1));
        const rejected = assert.rejects(work);
        await entered.promise;
        listener('project');
        release.resolve();
        await rejected;
        assert.equal(requests, 0);
        assert.equal(controller.signal.aborted, true);
        assert.equal(room.buildController.signal.aborted, true);
        assert.deepEqual(codes, [1012]);
        assert.throws(() => manager.save(room), CoordinatorUnavailableError);
        assert.equal(room.versions.length, 0);
    }
    finally {
        release.resolve();
        manager.shutdown();
        await new Promise<void>(resolve => server.close(() => resolve()));
        fs.rmSync(dir, { recursive: true, force: true });
    }
});
test('hosted dispatch and document writes carry fences; stale SQL results invalidate the owner', async () => {
    const platform = new SupabasePlatform({ url: 'https://synthetic.supabase.co', anonKey: 'synthetic', secretKey: 'synthetic' } as any);
    const calls: Array<{
        name: string;
        input: any;
    }> = [];
    (platform.admin as any).rpc = async (name: string, input: any) => { calls.push({ name, input }); return ok(name === 'claim_workflow_coordinator' ? 3 : true); };
    try {
        await platform.claimCoordinator('project');
        await platform.appendDocumentUpdate('project', 1, 'alice', new Uint8Array([0, 0]));
        await platform.recordProviderRequest({ workspaceId: 'project', callId: 'call', outcome: 'dispatching' } as any);
        await platform.recordProviderRequest({ workspaceId: 'project', callId: 'call', outcome: 'succeeded' } as any);
        for (const name of ['append_workflow_document_update', 'record_workflow_provider_dispatch']) {
            const call = calls.find(c => c.name === name)!;
            assert.equal(call.input.expected_epoch, 3);
            assert.equal(call.input.target_owner_id, platform.coordinator.ownerId);
        }
        assert.equal(calls.at(-1)!.name, 'record_project_provider_request');
        assert.equal(calls.at(-1)!.input.expected_epoch, undefined);
        let lost = 0;
        platform.onCoordinatorLost(() => lost++);
        (platform.admin as any).rpc = async () => ({ data: null, error: { code: '40001', message: 'private owner metadata' } });
        await assert.rejects(platform.appendDocumentUpdate('project', 2, 'alice', new Uint8Array([0, 0])), CoordinatorUnavailableError);
        assert.equal(lost, 1);
        assert.throws(() => platform.coordinator.fence('project'), CoordinatorUnavailableError);
    }
    finally {
        await platform.coordinator.close();
    }
});
