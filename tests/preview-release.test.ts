import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createCanvasArtifactsFixture } from './fixtures/canvas-artifacts.js';
import { createPreviewProviderFixture } from './fixtures/preview-provider.js';
import { applyOperations } from '../server/project.js';
import { previewState, previewView, restorePreviewBytes } from '../server/preview-state.js';
import { createArtifactFixture } from './fixtures/artifact-storage.js';
const token = 'synthetic_scoped_token_123456789';
export function seedPreviewVersion(f: Awaited<ReturnType<typeof createCanvasArtifactsFixture>>, id = 1) {
    const files = applyOperations(undefined, [{ type: 'write', path: 'src/App.tsx', content: `export default function App(){return <main><h1>Controlled preview v${id}</h1><button>Test button</button></main>}` }]);
    f.room.versions.push({ id, createdAt: new Date().toISOString(), summary: `Controlled v${id}`, files, bundle: 'fixture', css: '', fileCount: files.length });
}
const call = async (f: Awaited<ReturnType<typeof createCanvasArtifactsFixture>>, actor: string, path: string, body?: unknown) => {
    const res = await fetch(`${f.url}/api/rooms/${f.room.id}/previews${path}`, { method: body === undefined ? 'GET' : 'POST', headers: { authorization: `Bearer ${f.token(actor)}`, 'content-type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    return { status: res.status, body: await res.json() as any };
};
const connect = async (f: Parameters<typeof call>[0], target: Awaited<ReturnType<typeof createPreviewProviderFixture>>['target'], actors: string[] = []) => { const r = await call(f, 'alice', '/connections', { accountId: target.accountId, projectName: target.projectName, credential: token, actors }); assert.equal(r.status, 200, JSON.stringify(r.body)); return r.body.connections.at(-1); };
const prepare = async (f: Parameters<typeof call>[0], connectionId?: string, versionId = 1, recoveryOf?: string) => { const r = await call(f, 'alice', '/plans', { versionId, ...(connectionId ? { connectionId } : {}), ...(recoveryOf ? { recoveryOf } : {}) }); assert.equal(r.status, 200, JSON.stringify(r.body)); return r.body.plans.at(-1); };
const release = async (f: Parameters<typeof call>[0], actor: string, p: any) => call(f, actor, `/plans/${p.id}/release`, { planHash: p.planHash, approvePublicPreview: true });
test('two participants prepare frozen private frontend bytes without credentials or inference; v5 cold restore binds every file and project', async () => {
    const store = await createArtifactFixture(), platform = store.platform(), projectId = randomUUID();
    await platform.claimCoordinator(projectId);
    const provider = await createPreviewProviderFixture(), f = await createCanvasArtifactsFixture({ durableStore: platform, projectId, previewProvider: provider.provider });
    try {
        seedPreviewVersion(f);
        const plan = await prepare(f);
        assert.equal(plan.connection, undefined);
        assert.equal(f.calls.length, 0);
        const saved = structuredClone(f.room.preview!);
        assert.equal((await call(f, 'bob', '')).body.plans[0].planHash, plan.planHash);
        assert.equal((await release(f, 'alice', plan)).status, 403);
        const body = await f.manager.readArchivedArtifact(f.room, plan.contentRef);
        const bytes = restorePreviewBytes(body, plan);
        assert.match(bytes.assets['index.html'], /Content-Security-Policy/);
        seedPreviewVersion(f, 2);
        assert.equal(restorePreviewBytes(body, plan).sourceHash, plan.sourceHash);
        const next = store.platform();
        await connect(f, provider.target);
        await next.claimCoordinator(projectId);
        const restored: any = await next.loadSnapshot(projectId);
        assert.equal(restored.artifactSchemaVersion, 5);
        assert.equal(restored.preview.plans[0].planHash, plan.planHash);
        assert.equal(restored.preview.connections.length, 1);
        assert.equal(JSON.stringify(restored.preview).includes(token), false);
        assert.equal(JSON.stringify((await call(f, 'bob', '')).body).includes('credential'), false);
        assert.ok(restored.artifactBodies.some((b: any) => b.ref === plan.contentRef));
        const foreign = { ...plan, projectId: randomUUID() };
        assert.throws(() => restorePreviewBytes(body, foreign));
        assert.throws(() => previewState({ ...saved, plans: [{ ...plan, sourceHash: 'b'.repeat(64) }] }));
        assert.throws(() => restorePreviewBytes(Buffer.from('{}'), plan));
    }
    finally {
        await f.close();
        await store.close();
        await provider.close();
    }
});
test('actual provider adapter and independent participants enforce owner grants, exact approvals, single dispatch, live bytes and previous-version recovery', async () => {
    const provider = await createPreviewProviderFixture(), f = await createCanvasArtifactsFixture({ previewProvider: provider.provider });
    try {
        seedPreviewVersion(f);
        const c = await connect(f, provider.target), p = await prepare(f, c.id);
        assert.equal((await release(f, 'bob', p)).status, 403);
        assert.equal(provider.control.posts, 0);
        assert.equal((await call(f, 'alice', `/plans/${p.id}/release`, { planHash: 'a'.repeat(64), approvePublicPreview: true })).status, 409);
        const first = await release(f, 'alice', p);
        assert.equal(first.status, 200);
        assert.equal(first.body.receipts[0].state, 'verified', JSON.stringify(first.body));
        assert.equal(provider.control.posts, 1);
        const replay = await release(f, 'alice', p);
        assert.equal(replay.body.replayed, true);
        assert.equal(provider.control.posts, 1);
        assert.equal(JSON.stringify(first.body).includes(token), false);
        assert.equal(JSON.stringify(first.body).includes('credential'), false);
        assert.equal(JSON.stringify(previewView(f.room.preview!)).includes(token), false);
        assert.equal((await call(f, 'bob', `/connections/${c.id}/grants`, { actors: ['bob'], expectedRevision: 1 })).status, 403);
        assert.equal((await call(f, 'alice', `/connections/${c.id}/grants`, { actors: ['bob'], expectedRevision: 1 })).status, 200);
        assert.equal((await call(f, 'alice', `/connections/${c.id}/grants`, { actors: [], expectedRevision: 1 })).status, 409);
        seedPreviewVersion(f, 2);
        const p2 = await prepare(f, c.id, 2);
        assert.equal(p2.previousPlanId, p.id);
        const second = await release(f, 'bob', p2);
        assert.equal(second.body.receipts.at(-1).state, 'verified');
        assert.equal(provider.control.posts, 2);
        const recovery = await prepare(f, c.id, 1, p.id);
        assert.equal(recovery.contentRef, p.contentRef);
        assert.equal(recovery.sourceHash, p.sourceHash);
        assert.notEqual(recovery.branch, p.branch);
        const recovered = await release(f, 'alice', recovery);
        assert.equal(recovered.body.receipts.at(-1).state, 'verified', recovered.body.receipts.at(-1).detail);
        assert.equal(provider.control.posts, 3);
        const bob = await fetch(`${f.url}/api/rooms/${f.room.id}/previews/plans/${recovery.id}/files/app.js`, { headers: { authorization: `Bearer ${f.token('bob')}` } });
        assert.equal(bob.status, 200);
        assert.match(await bob.text(), /Controlled preview v1/);
        const outsider = await fetch(`${f.url}/api/rooms/${randomUUID()}/previews`, { headers: { authorization: `Bearer ${f.token('bob')}` } });
        assert.ok([403, 404].includes(outsider.status));
        assert.equal(f.calls.length, 0);
        assert.equal(f.room.submissions.length, 0);
    }
    finally {
        await f.close();
        await provider.close();
    }
});
test('uncertain provider outcome holds a durable global lock, never retries, survives restart, and reconciles exact live bytes', async () => {
    const provider = await createPreviewProviderFixture(), f = await createCanvasArtifactsFixture({ previewProvider: provider.provider });
    try {
        seedPreviewVersion(f);
        const c = await connect(f, provider.target, ['bob']), p = await prepare(f, c.id);
        provider.control.failAfterCreate = true;
        const result = await release(f, 'alice', p);
        assert.equal(result.body.receipts[0].state, 'unknown');
        assert.equal(provider.control.posts, 1);
        assert.throws(() => f.manager.eventStore.reservePreviewTarget((() => { const target = f.room.preview!.connections[0].target; return (requireHash({ account: target.accountId, project: target.projectId, environment: 'preview' })); })(), randomUUID(), randomUUID()), /unfinished/);
        await f.reopen();
        assert.equal(f.room.preview!.receipts[0].state, 'unknown');
        assert.equal((await release(f, 'alice', p)).body.replayed, true);
        assert.equal(provider.control.posts, 1);
        provider.control.hidden = true;
        await call(f, 'alice', `/plans/${p.id}/reconcile`, {});
        assert.equal(f.room.preview!.receipts[0].state, 'unknown');
        provider.control.hidden = false;
        provider.control.corrupt = true;
        const mismatch = await call(f, 'alice', `/plans/${p.id}/reconcile`, {});
        assert.equal(mismatch.status, 409);
        assert.equal(f.room.preview!.receipts[0].state, 'accepted');
        provider.control.corrupt = false;
        await call(f, 'bob', `/plans/${p.id}/reconcile`, {});
        assert.equal(f.room.preview!.receipts[0].state, 'verified');
        assert.equal(provider.control.posts, 1);
    }
    finally {
        await f.close();
        await provider.close();
    }
});
test('target changes, revoked grants and authority loss during asset upload cannot authorize deployment creation', async () => {
    const provider = await createPreviewProviderFixture(), f = await createCanvasArtifactsFixture({ previewProvider: provider.provider });
    try {
        seedPreviewVersion(f);
        const c = await connect(f, provider.target, ['bob']), p = await prepare(f, c.id);
        provider.control.changedTarget = true;
        assert.equal((await release(f, 'alice', p)).status, 409);
        assert.equal(provider.control.posts, 0);
        provider.control.changedTarget = false;
        let end!: () => void;
        provider.control.hold = new Promise<void>(resolve => { end = resolve; });
        const pending = release(f, 'bob', p);
        while (provider.control.assetUploads === 0)
            await new Promise(resolve => setTimeout(resolve, 20));
        assert.equal((await release(f, 'bob', p)).status, 409);
        assert.equal((await call(f, 'alice', `/plans/${p.id}/reconcile`, {})).status, 409);
        assert.equal(provider.control.posts, 0);
        assert.equal((await call(f, 'alice', `/connections/${c.id}/revoke`, {})).status, 200);
        end();
        const result = await pending;
        assert.equal(provider.control.posts, 0);
        assert.equal(result.body.receipts[0].state, 'unknown');
        assert.equal((await release(f, 'bob', p)).status, 403);
        assert.equal((await call(f, 'bob', `/plans/${p.id}/reconcile`, {})).status, 403);
        assert.equal((await call(f, 'alice', `/plans/${p.id}/reconcile`, {})).status, 200);
        assert.equal(f.room.preview!.receipts[0].state, 'failed');
        assert.equal(provider.control.posts, 0);
    }
    finally {
        await f.close();
        await provider.close();
    }
});
import { previewHash as requireHash } from '../server/preview-state.js';
test('weak server encryption cannot accept cloud credentials while account-free preparation stays available', async () => {
    const provider = await createPreviewProviderFixture(), f = await createCanvasArtifactsFixture({ previewProvider: provider.provider, encryptionSecret: 'short' });
    try {
        seedPreviewVersion(f);
        await prepare(f);
        const result = await call(f, 'alice', '/connections', { accountId: provider.target.accountId, projectName: provider.target.projectName, credential: token, actors: [] });
        assert.equal(result.status, 503);
        assert.equal(provider.control.reads, 0);
        assert.equal(f.room.preview!.connections.length, 0);
        assert.equal((await call(f, 'bob', '')).status, 200);
    }
    finally {
        await f.close();
        await provider.close();
    }
});
test('credential rotation invalidates prepared approval and server disconnect cancels active asset work without replay', async () => {
    const provider = await createPreviewProviderFixture(), f = await createCanvasArtifactsFixture({ previewProvider: provider.provider });
    try {
        seedPreviewVersion(f);
        const c = await connect(f, provider.target), old = await prepare(f, c.id);
        const rotated = await call(f, 'alice', `/connections/${c.id}/credential`, { credential: 'replacement_synthetic_scoped_token_123456789' });
        assert.equal(rotated.status, 200);
        assert.equal(rotated.body.connections[0].revision, 2);
        assert.equal((await release(f, 'alice', old)).status, 403);
        const p = await prepare(f, c.id);
        provider.control.hold = new Promise<void>(() => { });
        const pending = release(f, 'alice', p);
        const deadline = Date.now() + 5000;
        while (provider.control.assetUploads === 0 && Date.now() < deadline)
            await new Promise(resolve => setTimeout(resolve, 20));
        assert.equal(provider.control.assetUploads, 1);
        await f.reopen();
        const result = await pending;
        assert.equal(result.body.receipts[0].state, 'unknown');
        assert.equal(provider.control.posts, 0);
        assert.equal(f.room.preview!.receipts[0].dispatchPhase, 'assets');
        await call(f, 'alice', `/plans/${p.id}/reconcile`, {});
        assert.equal(f.room.preview!.receipts[0].state, 'failed');
        assert.equal(provider.control.posts, 0);
    }
    finally {
        await f.close();
        await provider.close();
    }
});
