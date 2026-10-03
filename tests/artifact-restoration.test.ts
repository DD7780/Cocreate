import http from 'node:http';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import * as Y from 'yjs';
import { RoomManager } from '../server/rooms.js';
import { createCoCreateServer } from '../server/index.js';
import { createSession } from '../server/auth.js';
import { ArtifactUnavailableError, artifactPath, bodyFromBytes, canonicalJson, versionArtifactBytes } from '../server/artifacts.js';
import { applyOperations, bundleProject } from '../server/project.js';
import { createArtifactFixture } from './fixtures/artifact-storage.js';
const files = applyOperations(undefined, [{ type: 'write', path: 'src/App.tsx', content: 'export default function App(){return <main>Restored artifact</main>}' }]);
const version = (id: number) => ({ id, createdAt: '2026-10-03T00:00:00Z', summary: `Version ${id}`, files, bundle: `window.fixtureVersion=${id}`, css: 'main{color:blue}', fileCount: files.length });
const manager = (durableStore?: any) => { const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'artifact-step03-')); return { dir, value: new RoomManager({ debounceMs: 1000, encryptionSecret: 'synthetic', dataDir: dir, durableStore }) }; };
function clean(item: ReturnType<typeof manager>) { item.value.shutdown(); const resolved = path.resolve(item.dir); assert.equal(path.dirname(resolved), path.resolve(os.tmpdir())); assert.match(path.basename(resolved), /^artifact-step03-/); fs.rmSync(resolved, { recursive: true, force: true }); }
test('empty cache restores compiled preview, current checkpoint, old version and receipts without inference', async () => {
    const fixture = await createArtifactFixture(), project = randomUUID(), platform = fixture.platform();
    await platform.claimCoordinator(project);
    const first = manager(platform), room = first.value.create(project);
    first.value.join(room, 'alice', 'Alice');
    let second: ReturnType<typeof manager> | undefined;
    try {
        const connection = await first.value.saveConnection(room, { name: 'Controlled replay configuration', provider: 'custom', baseUrl: fixture.origin, apiFormat: 'responses', apiKey: 'synthetic' });
        room.ai.connections![0].checks.builder = { reachable: { status: 'passed' }, text: { status: 'passed' }, personal: { status: 'passed' }, builder: { status: 'passed' } };
        await first.value.assignAI(room, { connectionId: connection.id, model: 'builder' }, { connectionId: connection.id, model: 'builder' });
        await room.persistQueue;
        fixture.trace.length = 0;
        const compiled = await bundleProject(files);
        room.versions = Array.from({ length: 8 }, (_, index) => ({ ...version(index + 1), bundle: compiled.javascript, css: compiled.css }));
        room.recoveryCheckpoint = { fingerprint: 'fixed-input', revision: 4, files, task: 'Completed task', index: 1, total: 2 };
        const archival = first.value.eventStore.writeArtifact('Controlled historical event body', 'text/plain');
        first.value.eventStore.append({ workspaceId: project, actorId: 'fixture', actorType: 'system', eventType: 'fixture.artifact', artifactRef: archival.ref });
        room.commandReceipts = { '["alice","replayed-command"]': { id: 'submission', participantId: 'alice', requestId: 'replayed-command', status: 'built' } };
        assert.equal(await first.value.save(room), true);
        const canonical = fixture.snapshots.get(project)!.harness_state;
        assert.equal(canonical.versions.length, 6);
        assert.equal(canonical.artifactHistory.length, 8);
        assert.equal(canonical.versions[0].files, undefined);
        assert.equal(canonical.versions[0].bundle, undefined);
        assert.equal(canonical.recoveryCheckpoint.files, undefined);
        assert.equal(canonical.artifactBodies, undefined);
        assert.ok(fixture.trace.indexOf('download') < fixture.trace.indexOf('commit'));
        assert.equal(fs.existsSync(path.join(process.cwd(), 'generated', 'rooms', project)), false);
        const nextPlatform = fixture.platform();
        await nextPlatform.claimCoordinator(project);
        second = manager(nextPlatform);
        assert.equal(second.value.eventStore.hasWorkspace(project), false);
        const restored = second.value.hydrate(project, await nextPlatform.loadSnapshot(project));
        assert.equal(restored.versions.at(-1)!.bundle, compiled.javascript);
        assert.deepEqual(restored.versions.at(-1)!.files, files);
        assert.deepEqual(restored.recoveryCheckpoint?.files, files);
        assert.equal(restored.recoveryCheckpoint?.fingerprint, 'fixed-input');
        assert.ok(second.value.eventStore.readArtifact(restored.recoveryCheckpoint!.artifactRef!));
        assert.equal(second.value.eventStore.readArtifact(archival.ref), null);
        assert.equal((await second.value.readArchivedArtifact(restored, archival.ref)).toString(), 'Controlled historical event body');
        const old = await second.value.restoredVersion(restored, 1);
        assert.equal(old!.bundle, compiled.javascript);
        assert.deepEqual(old!.files, files);
        const reply = await second.value.submitChanges(restored, 'alice', 'replayed-command');
        assert.equal(reply.submissionId, 'submission');
        assert.equal(restored.providerCalls.length, 0);
        assert.equal(second.value.view(restored).versions.length, 8);
    }
    finally {
        if (second)
            clean(second);
        clean(first);
        await fixture.close();
    }
});
test('upload/verification interruption never commits a reference; failed commit replay reuses immutable bodies', async () => {
    const fixture = await createArtifactFixture(), project = randomUUID(), platform = fixture.platform();
    await platform.claimCoordinator(project);
    const item = manager(platform), room = item.value.create(project);
    try {
        await item.value.save(room);
        const before = structuredClone(fixture.snapshots.get(project));
        room.versions = [version(1)];
        fixture.controls.failUpload = true;
        assert.equal(await item.value.save(room), false);
        assert.deepEqual(fixture.snapshots.get(project), before);
        fixture.controls.failUpload = false;
        fixture.controls.failCommit = true;
        assert.equal(await item.value.save(room), false);
        assert.deepEqual(fixture.snapshots.get(project), before);
        assert.equal(fixture.objects.size, 1);
        const uploadCount = fixture.counts.uploads;
        fixture.controls.failCommit = false;
        const replay = fixture.platform();
        await replay.claimCoordinator(project);
        // A new process must handle the real SDK AlreadyExists response and verify its bytes.
        const payload = item.value.eventStore.readWorkspaceSnapshot<any>(project);
        await replay.saveSnapshot(project, room.persistRevision, { ...payload, artifactBodies: item.value.eventStore.artifactBodiesForWorkspace(project, [room.versions[0].artifactRef!]) });
        assert.equal(fixture.counts.uploads, uploadCount + 1);
        assert.equal(fixture.objects.size, 1);
        assert.equal(fixture.snapshots.get(project)!.harness_state.versions[0].artifactRef, room.versions[0].artifactRef);
    }
    finally {
        clean(item);
        await fixture.close();
    }
});
test('missing/corrupt stored bodies are explicit failures, distinct from an empty project', async () => {
    const fixture = await createArtifactFixture(), project = randomUUID(), platform = fixture.platform();
    await platform.claimCoordinator(project);
    const item = manager(platform), room = item.value.create(project);
    try {
        assert.equal(await platform.loadSnapshot(randomUUID()), null);
        await room.persistQueue;
        const before = structuredClone(fixture.snapshots.get(project));
        room.versions = [version(1)];
        fixture.controls.corruptUpload = true;
        assert.equal(await item.value.save(room), false);
        assert.deepEqual(fixture.snapshots.get(project), before);
        fixture.objects.clear();
        fixture.controls.corruptUpload = false;
        assert.equal(await item.value.save(room), true);
        const reference = room.artifactManifest![0], key = artifactPath(project, reference), original = fixture.objects.get(key)!;
        fixture.objects.set(key, Buffer.from('tampered'));
        await assert.rejects(platform.loadSnapshot(project), (error: ArtifactUnavailableError) => error.reason === 'corrupt');
        fixture.objects.delete(key);
        await assert.rejects(platform.loadSnapshot(project), (error: ArtifactUnavailableError) => error.reason === 'missing');
        fixture.objects.set(key, original);
        const restored = await platform.loadSnapshot(project);
        assert.equal((restored as Record<string, any>).versions.length, 1);
    }
    finally {
        clean(item);
        await fixture.close();
    }
});
test('private bucket and project-bound artifact identity fail closed; no public URL is created', async () => {
    const fixture = await createArtifactFixture(), project = randomUUID(), platform = fixture.platform();
    await platform.claimCoordinator(project);
    const body = bodyFromBytes(versionArtifactBytes(project, version(1)), 'application/vnd.cocreate.product+json');
    try {
        fixture.controls.publicBucket = true;
        await assert.rejects(platform.publishArtifactBodies(project, [body]), ArtifactUnavailableError);
        assert.equal(fixture.counts.uploads, 0);
        fixture.controls.publicBucket = false;
        await platform.publishArtifactBodies(project, [body]);
        const denied = await fetch(`${fixture.origin}/storage/v1/object/cocreate-artifacts/${artifactPath(project, body)}`);
        assert.equal(denied.status, 403);
        const other = randomUUID();
        fixture.objects.set(artifactPath(other, body), fixture.objects.get(artifactPath(project, body))!);
        fixture.snapshots.set(other, { revision: 1, yjs_state: '\\x0000', committed_at: new Date().toISOString(), harness_state: { artifactSchemaVersion: 1, artifactManifest: [body], versions: [{ ...version(1), files: undefined, bundle: undefined, artifactRef: body.ref }] } });
        await assert.rejects(platform.loadSnapshot(other), ArtifactUnavailableError);
        assert.throws(() => artifactPath('../escape', body), ArtifactUnavailableError);
    }
    finally {
        await fixture.close();
    }
});
test('authenticated lazy historical reads reject revoked users, including revocation during download', async () => {
    const fixture = await createArtifactFixture(), project = randomUUID(), platform = fixture.platform();
    await platform.claimCoordinator(project);
    const initial = manager(platform), room = initial.value.create(project);
    room.versions = Array.from({ length: 8 }, (_, i) => version(i + 1));
    let role: 'viewer' | undefined = 'viewer';
    let service: Awaited<ReturnType<typeof createCoCreateServer>> | undefined;
    const coldDir = fs.mkdtempSync(path.join(os.tmpdir(), 'artifact-step03-'));
    try {
        await initial.value.save(room);
        const cold = fixture.platform();
        await cold.claimCoordinator(project);
        cold.requireMembership = async () => { if (!role)
            throw Object.assign(new Error('Project access denied.'), { status: 403 }); return role; };
        service = await createCoCreateServer({ platform: cold, dataDir: coldDir, port: 0, host: '127.0.0.1', serveClient: false, sessionSecret: 'synthetic' });
        const meta = await cold.loadSnapshot(project);
        const hydrated = service.manager.hydrate(project, meta);
        service.manager.join(hydrated, 'alice', 'Alice');
        const { url } = await service.start(), token = createSession('synthetic', { roomId: project, participantId: 'alice', accountId: 'alice', name: 'Alice', role: 'viewer' }), headers = { Authorization: `Bearer ${token}` };
        await hydrated.persistQueue;
        role = undefined;
        const before = fixture.counts.downloads;
        assert.equal((await fetch(`${url}/preview/${project}/1`, { headers })).status, 403);
        assert.equal(fixture.counts.downloads, before);
        role = 'viewer';
        fixture.controls.afterDownload = () => { role = undefined; };
        assert.equal((await fetch(`${url}/api/rooms/${project}/download/1`, { headers })).status, 403);
        fixture.controls.afterDownload = undefined;
        role = 'viewer';
        const zip = await fetch(`${url}/api/rooms/${project}/download/1`, { headers });
        assert.equal(zip.status, 200);
        assert.equal(zip.headers.get('Content-Type'), 'application/zip');
        assert.equal((await fetch(`${url}/preview/${project}/99`, { headers })).status, 404);
    }
    finally {
        await service?.stop();
        clean(initial);
        assert.equal(path.dirname(path.resolve(coldDir)), path.resolve(os.tmpdir()));
        fs.rmSync(coldDir, { recursive: true, force: true });
        await fixture.close();
    }
});
const deferred = () => { let resolve!: () => void; const promise = new Promise<void>(done => { resolve = done; }); return { promise, resolve }; };
async function buildFixture() {
    let calls = 0;
    const provider = http.createServer(async (req, res) => {
        let raw = '';
        for await (const chunk of req)
            raw += chunk;
        const request = JSON.parse(raw);
        calls++;
        const text = 'Add a header.';
        const value = request.text.format.schema.required.includes('goals') ? { goals: [text], features: [], design: [], constraints: [], questions: [], additions: [], modifications: [], withdrawals: [], classification: 'explicit_request', affectedRequirementIds: [], sourcePassages: [text], intents: [{ text, category: 'goal', classification: 'explicit_request', rationale: 'Controlled request', sourcePassage: text, affectedRequirementIds: [] }] } : { operations: [{ type: 'write', path: 'src/App.tsx', content: 'export default function App(){return <main>New header</main>}' }], summary: 'New header', decisions: [], conflicts: [], specification: { agreed: [], proposed: [], questions: [] } };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ output: [{ content: [{ type: 'output_text', text: JSON.stringify(value) }] }], status: 'completed', usage: { input_tokens: 10, output_tokens: 20 } }));
    });
    await new Promise<void>(resolve => provider.listen(0, '127.0.0.1', resolve));
    const address = provider.address();
    assert.ok(address && typeof address !== 'string');
    const fixture = await createArtifactFixture(), platform = fixture.platform(), project = randomUUID();
    await platform.claimCoordinator(project);
    const item = manager(platform), room = item.value.create(project);
    item.value.join(room, 'alice', 'Alice');
    const connection = await item.value.saveConnection(room, { name: 'Controlled provider', provider: 'custom', baseUrl: `http://127.0.0.1:${address.port}`, apiFormat: 'responses', apiKey: 'synthetic' });
    room.ai.connections![0].checks.builder = { reachable: { status: 'passed' }, text: { status: 'passed' }, personal: { status: 'passed' }, builder: { status: 'passed' } };
    await item.value.assignAI(room, { connectionId: connection.id, model: 'builder' }, { connectionId: connection.id, model: 'builder' });
    room.versions = [version(1)];
    await item.value.save(room);
    const doc = new Y.Doc(), paragraph = new Y.XmlElement('paragraph'), textNode = new Y.XmlText();
    Y.applyUpdate(doc, Y.encodeStateAsUpdate(room.doc));
    const vector = Y.encodeStateVector(doc);
    doc.getXmlFragment('default').push([paragraph]);
    paragraph.push([textNode]);
    textNode.insert(0, 'Add a header.');
    item.value.handleMessage(room, { participantId: 'alice', readyState: 0, send() { } } as any, Buffer.concat([Buffer.from([0]), Buffer.from(Y.encodeStateAsUpdate(doc, vector))]), true);
    doc.destroy();
    return { fixture, platform, item, room, calls: () => calls, async close() { await room.buildTask; await room.persistQueue; clean(item); await fixture.close(); await new Promise<void>(resolve => provider.close(() => resolve())); } };
}
async function gateEntered(promise: Promise<void>) { let timer: NodeJS.Timeout | undefined; try {
    await Promise.race([promise, new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Controlled publication gate was not reached')), 8000); })]);
}
finally {
    clearTimeout(timer);
} }
test('an interrupted canonical promotion stays hidden; concurrent saves retain edits and the prior artifact', async () => {
    const context = await buildFixture(), entered = deferred(), release = deferred();
    context.fixture.controls.failVersion = 2;
    context.fixture.controls.beforeCommit = async (body) => { if (body.target_harness_state.versions.some((value: any) => value.id === 2)) {
        entered.resolve();
        await release.promise;
    } };
    try {
        await context.item.value.submitChanges(context.room, 'alice', 'controlled-build');
        await gateEntered(entered.promise);
        assert.equal(context.item.value.view(context.room).latestVersion, 1);
        assert.equal(context.item.value.version(context.room, 2), null);
        assert.equal(context.fixture.snapshots.get(context.room.id)!.harness_state.versions.at(-1).id, 1);
        context.room.doc.getMap('fixture').set('later-edit', 'retained');
        const laterSave = context.item.value.save(context.room, 'fixture.autosave');
        const before = context.calls();
        release.resolve();
        await context.room.buildTask;
        assert.equal(await laterSave, true);
        await context.room.persistQueue;
        assert.equal(context.item.value.view(context.room).latestVersion, 1);
        assert.equal(context.item.value.version(context.room, 2), null);
        const canonical = context.fixture.snapshots.get(context.room.id)!;
        assert.equal(canonical.harness_state.versions.at(-1).id, 1);
        assert.equal(canonical.harness_state.artifactHistory.length, 1);
        const restored = new Y.Doc();
        Y.applyUpdate(restored, Buffer.from(canonical.yjs_state.slice(2), 'hex'));
        assert.equal(restored.getMap('fixture').get('later-edit'), 'retained');
        restored.destroy();
        await context.item.value.submitChanges(context.room, 'alice', 'controlled-build');
        assert.equal(context.calls(), before);
        assert.equal(before, 2);
    }
    finally {
        release.resolve();
        await context.close();
    }
});
test('lease loss after private body upload cannot promote or start another physical attempt', async () => {
    const context = await buildFixture(), entered = deferred(), release = deferred();
    const publish = context.platform.publishArtifactBodies.bind(context.platform);
    context.platform.publishArtifactBodies = async (project, bodies) => { const result = await publish(project, bodies); if (bodies.some(body => body.mimeType === 'application/vnd.cocreate.product+json' && JSON.parse(Buffer.from(body.base64, 'base64').toString()).version.id === 2)) {
        entered.resolve();
        await release.promise;
    } return result; };
    try {
        await context.item.value.submitChanges(context.room, 'alice', 'controlled-build');
        await gateEntered(entered.promise);
        assert.equal(context.item.value.view(context.room).latestVersion, 1);
        context.platform.coordinator.invalidate(context.room.id);
        release.resolve();
        await context.room.buildTask;
        assert.equal(context.room.versions.length, 1);
        assert.equal(context.calls(), 2);
        assert.equal(context.fixture.snapshots.get(context.room.id)!.harness_state.versions.at(-1).id, 1);
    }
    finally {
        release.resolve();
        await context.close();
    }
});
test('synchronous publication failure clears the pending gate and preserves the previous product', async () => {
    const context = await buildFixture(), entered = deferred();
    const save = context.item.value.save.bind(context.item.value);
    context.item.value.save = (room, eventType, ...args) => { if (eventType === 'product.promoted') {
        entered.resolve();
        throw new ArtifactUnavailableError('corrupt');
    } return save(room, eventType, ...args); };
    try {
        await context.item.value.submitChanges(context.room, 'alice', 'synchronous-publication-failure');
        await gateEntered(entered.promise);
        await context.room.steeringQueue;
        await context.room.buildTask;
        await context.room.persistQueue;
        assert.equal(context.room.pendingPromotion, undefined);
        assert.equal(context.item.value.view(context.room).latestVersion, 1);
        assert.equal(context.room.versions.length, 1);
        assert.equal(context.room.status, 'Error');
        assert.equal(context.calls(), 2);
        context.room.doc.getMap('fixture').set('after-error', 'retained');
        assert.equal(await context.item.value.save(context.room), true);
        assert.equal(context.fixture.snapshots.get(context.room.id)!.harness_state.versions.at(-1).id, 1);
    }
    finally {
        await context.close();
    }
});
test('legacy inline checkpoint publication is verified and malformed metadata fails explicitly', async () => {
    const fixture = await createArtifactFixture(), project = randomUUID(), platform = fixture.platform();
    await platform.claimCoordinator(project);
    try {
        const checkpoint = { fingerprint: 'legacy-fixed-input', revision: 1, files, task: 'Legacy completed task', index: 1, total: 2 };
        await platform.saveSnapshot(project, 1, { update: Buffer.from(Y.encodeStateAsUpdate(new Y.Doc())).toString('base64'), versions: [version(1)], recoveryCheckpoint: checkpoint });
        const canonical = fixture.snapshots.get(project)!.harness_state;
        assert.equal(canonical.recoveryCheckpoint.files, undefined);
        assert.ok(canonical.recoveryCheckpoint.artifactRef);
        assert.deepEqual((await platform.loadSnapshot(project) as any).recoveryCheckpoint.files, files);
        canonical.artifactHistory = [null];
        await assert.rejects(platform.loadSnapshot(project), ArtifactUnavailableError);
        assert.throws(() => versionArtifactBytes(project, { ...version(1), files: [{ path: '../escape', content: 'invalid' }] }), ArtifactUnavailableError);
    }
    finally {
        await fixture.close();
    }
});


test('new promotion after a retained-product rollback never overwrites an archived version identity',async()=>{
  const context=await buildFixture();
  try{
    context.room.versions.push(version(2));await context.item.value.save(context.room);
    context.room.versions.pop();await context.item.value.save(context.room);
    const entered=deferred();context.fixture.controls.beforeCommit=async body=>{if(body.target_harness_state.versions.some((value:any)=>value.id===3))entered.resolve()};
    await context.item.value.submitChanges(context.room,'alice','after-retained-product-rollback');await gateEntered(entered.promise);await context.room.buildTask;await context.room.persistQueue;
    assert.equal(context.item.value.view(context.room).latestVersion,3);
    assert.equal((await context.item.value.restoredVersion(context.room,2))!.bundle,version(2).bundle);
    assert.deepEqual(context.room.artifactHistory!.map(version=>version.id),[1,2,3]);
  }finally{await context.close()}
});
