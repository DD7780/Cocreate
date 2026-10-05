import test from 'node:test';
import assert from 'node:assert/strict';
import { createProgressFixture, pause } from './fixtures/build-progress.js';

test('serial acceptance and deferred capture order survive SQLite restart without replay spending', async () => {
  const f = await createProgressFixture({ personalDelayMs: 80 });
  try {
    // Observe interpretation alone; existing progress tests own collection/build integration.
    (f.manager as unknown as { scheduleBuild: () => void }).scheduleBuild = () => {};
    await Promise.all(['alice', 'bob', 'cara'].map((actor, index) =>
      f.submit(actor, `Add numbered feature ${index}`, `ordered-${index}`)));
    assert.deepEqual(f.personal.map(item => item.actor), ['alice', 'bob', 'cara']);
    const accepted = structuredClone(f.room.sharedRequirements), scopeId = f.room.executionBudget!.id;
    assert.equal(accepted.filter(item => item.status === 'accepted').length, 3);
    assert.equal(f.room.executionBudget!.calls, 3);

    f.room.buildAdmissionClosed = true;
    assert.equal((await f.submit('bob', 'Add saved pending favorites', 'held-first')).status, 'submitted');
    assert.equal((await f.submit('cara', 'Add saved pending sorting', 'held-second')).status, 'submitted');
    assert.equal(f.personal.length, 3);
    await f.reopen(); await pause(50);
    assert.deepEqual(f.room.sharedRequirements, accepted);
    assert.deepEqual(f.room.submissions.slice(-2).map(item => [item.requestId, item.status]),
      [['held-first', 'failed'], ['held-second', 'failed']]);
    assert.ok(f.room.pending.get('bob')!.some(item => item.after.includes('pending favorites')));
    assert.ok(f.room.pending.get('cara')!.some(item => item.after.includes('pending sorting')));
    assert.equal(f.room.executionBudget!.id, scopeId);
    assert.equal(f.room.executionBudget!.calls, 3);
    assert.equal((await f.manager.submitChanges(f.room, 'alice', 'ordered-0')).status, 'queued');
    assert.equal((await f.manager.submitChanges(f.room, 'bob', 'held-first')).status, 'failed');
    assert.equal((await f.manager.submitChanges(f.room, 'cara', 'held-second')).status, 'failed');
    assert.equal(f.personal.length, 3);
    assert.equal(f.room.buildTask, undefined); assert.equal(f.room.buildTimer, undefined);
  } finally { await f.close(); }
});

test('a failed authority check does not poison capture order or spend the later caller allowance twice', async () => {
  const f = await createProgressFixture({ authorize: async actor => { if (actor === 'alice') throw new Error('Membership revoked'); } });
  try {
    (f.manager as unknown as { scheduleBuild: () => void }).scheduleBuild = () => {};
    f.edit('cara', 'Keep this draft unsubmitted');
    const results = await Promise.allSettled([
      f.submit('alice', 'Build an unauthorized catalog', 'rejected-first'),
      f.submit('bob', 'Add authorized favorites', 'accepted-second'),
    ]);
    assert.deepEqual(results.map(item => item.status), ['rejected', 'fulfilled']);
    assert.deepEqual(f.personal.map(item => item.actor), ['bob']);
    assert.equal(f.room.sharedRequirements.filter(item => item.status === 'accepted').length, 1);
    assert.ok(f.room.sharedRequirements.every(item => item.sources.every(source => source.participantId === 'bob')));
    assert.ok(f.room.pending.get('alice')!.some(item => item.after.includes('unauthorized catalog')));
    assert.ok(f.room.pending.get('cara')!.some(item => item.after.includes('unsubmitted')));
    assert.equal((await f.manager.submitChanges(f.room, 'alice', 'rejected-first')).status, 'failed');
    assert.equal((await f.manager.submitChanges(f.room, 'bob', 'accepted-second')).status, 'queued');
    assert.equal(f.room.executionBudget!.calls, 1);
    assert.equal(f.manager.eventStore.allProviderRequestRecordsForWorkspace(f.room.id).length, 1);
    assert.equal(f.personal.length, 1);
  } finally { await f.close(); }
});
