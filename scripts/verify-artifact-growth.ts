import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { RoomManager } from '../server/rooms.js';
import { applyOperations } from '../server/project.js';
import { createArtifactFixture } from '../tests/fixtures/artifact-storage.js';
const fixture = await createArtifactFixture(), project = randomUUID(), platform = fixture.platform();
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'artifact-growth-'));
const manager = new RoomManager({ debounceMs: 1000, encryptionSecret: 'synthetic', dataDir: dir, durableStore: platform });
const observations: Record<string, number>[] = [];
try {
    await platform.claimCoordinator(project);
    const room = manager.create(project);
    await room.persistQueue;
    let previous = 0;
    for (const count of [0, 10, 50]) {
        for (let index = previous + 1; index <= count; index++) {
            const files = applyOperations(undefined, [{ type: 'write', path: 'src/App.tsx', content: `// Controlled growth fixture ${index}\nexport default function App(){return <main>Fixture</main>}\n/*${'x'.repeat(1024)}*/` }]);
            room.versions.push({ id: index, createdAt: '2026-10-03T00:00:00Z', summary: 'Controlled growth fixture', files, bundle: `window.controlledGrowth=${index}`, fileCount: files.length });
            room.versions = room.versions.slice(-6);
            room.commandReceipts ||= {};
            room.commandReceipts[JSON.stringify(['fixture', `request-${index}`])] = { id: `submission-${index}`, participantId: 'fixture', requestId: `request-${index}`, status: 'built' };
            manager.eventStore.append({ workspaceId: project, actorId: 'fixture', actorType: 'system', eventType: 'fixture.history', payload: { index } });
            assert.equal(await manager.save(room), true);
        }
        previous = count;
        const snapshot = fixture.snapshots.get(project)!.harness_state;
        observations.push({ submittedVersions: count, snapshotBytes: Buffer.byteLength(JSON.stringify(snapshot)),
            events: snapshot.harnessProjection.events.length, eventBytes: Buffer.byteLength(JSON.stringify(snapshot.harnessProjection.events)),
            receipts: Object.keys(snapshot.commandReceipts).length, receiptBytes: Buffer.byteLength(JSON.stringify(snapshot.commandReceipts)),
            archivedVersions: snapshot.artifactHistory.length, manifestBytes: Buffer.byteLength(JSON.stringify(snapshot.artifactManifest)),
            storageObjects: fixture.objects.size, storageBytes: [...fixture.objects.values()].reduce((sum, bytes) => sum + bytes.length, 0),
            uploads: fixture.counts.uploads, downloads: fixture.counts.downloads,
            sqliteBytes: fs.statSync(manager.eventStore.file).size + (fs.existsSync(`${manager.eventStore.file}-wal`) ? fs.statSync(`${manager.eventStore.file}-wal`).size : 0) });
        assert.equal(snapshot.artifactHistory.length, count);
        assert.equal(Object.keys(snapshot.commandReceipts).length, count);
    }
    assert.ok(observations[2].snapshotBytes > observations[1].snapshotBytes);
    const output = 'artifacts/multiuser-step03/artifact-growth.json';
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, JSON.stringify({ measuredAt: new Date().toISOString(), scope: 'Synthetic 0/10/50 version+receipt workload; real SDK over controlled loopback Storage/PostgREST; no real SQL, hosted account, provider inference or production capacity measurement', observations,
        retentionProposal: 'Preserve immutable bodies and version manifests; split immutable command receipts/physical outcomes from projection snapshots; use verified projection checkpoints plus append-only event tails. Define cursor/recovery and request-ID guarantees before compaction. Inventory unreferenced private uploads before any separately reviewed cleanup. No data was compacted or deleted.' }, null, 2));
    console.log(JSON.stringify({ output, observations }));
}
finally {
    manager.shutdown();
    await fixture.close();
    const resolved = path.resolve(dir);
    assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()));
    assert.match(path.basename(resolved), /^artifact-growth-/);
    fs.rmSync(resolved, { recursive: true, force: true });
}
