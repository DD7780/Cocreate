import test from 'node:test';
import assert from 'node:assert/strict';
import { submitDraftChanges } from '../src/submit-changes.js';
import { createProgressFixture } from './fixtures/build-progress.js';

function feedback() {
  const notices: string[] = [], errors: string[] = [];
  return { notices, errors, onNotice: (message: string) => notices.push(message), onError: (message: string) => errors.push(message) };
}

test('save rejection is reported, keeps an uncertain request ID, and never submits', async () => {
  const view = feedback(), requestId = { current: 'uncertain-earlier-request' };
  let submissions = 0;
  await submitDraftChanges({ ...view, requestId,
    flush: async () => { throw new Error('The document could not be durably saved.'); },
    submit: async () => { submissions++; return { status: 'queued' }; },
  });
  assert.equal(submissions, 0);
  assert.match(view.notices[0], /Saving/);
  assert.equal(view.notices.at(-1), '');
  assert.match(view.errors.at(-1)!, /durably saved/);
  assert.equal(requestId.current, 'uncertain-earlier-request');
});

for (const [actor, teammate] of [['alice', 'bob'], ['bob', 'alice']]) {
  test(`${actor === 'alice' ? 'owner' : 'invited editor'} retries a confirmed failure on the next click and captures only their own edits`, async () => {
    let authorizations = 0;
    const f = await createProgressFixture({ buildDebounceMs: 60_000, buildMaxWaitMs: 60_000,
      authorize: async () => { if (++authorizations === 1) throw new Error('Controlled temporary authorization failure'); },
    });
    try {
      f.edit(actor, 'Please build a project dashboard');
      f.edit(teammate, 'Please add a calendar');
      const view = feedback(), requestId: { current: string | undefined } = { current: undefined };
      const options = { ...view, requestId, flush: async () => {}, submit: (id: string) => f.manager.submitChanges(f.room, actor, id) };
      await submitDraftChanges(options);
      assert.match(view.errors.at(-1)!, /temporary authorization failure/);
      assert.equal(f.room.submissions.length, 1);
      assert.equal(f.room.submissions[0].status, 'failed');
      assert.equal(f.personal.length, 0);
      const failedRequestId = requestId.current;
      await submitDraftChanges(options);
      assert.equal(f.room.submissions.length, 2);
      assert.notEqual(f.room.submissions[1].requestId, failedRequestId);
      assert.equal(f.room.submissions[1].status, 'queued');
      assert.equal(f.personal.length, 1);
      assert.equal(f.personal[0].actor, actor);
      assert.equal(f.room.pending.get(teammate)?.length, 1);
      assert.equal(f.room.pending.get(actor)?.length || 0, 0);
      assert.equal(requestId.current, undefined);
      assert.match(view.notices.at(-1)!, /accepted and queued/);
      assert.equal(view.errors.at(-1), '');
    } finally { await f.close(); }
  });
}

test('a lost successful reply replays the original receipt without inference or consuming newer edits', async () => {
  const f = await createProgressFixture({ buildDebounceMs: 60_000, buildMaxWaitMs: 60_000 });
  try {
    f.edit('alice', 'Please build a project dashboard');
    const view = feedback(), requestId: { current: string | undefined } = { current: undefined }, sent: string[] = [];
    let loseReply = true;
    const options = { ...view, requestId, flush: async () => {}, submit: async (id: string) => {
      sent.push(id);
      const result = await f.manager.submitChanges(f.room, 'alice', id);
      if (loseReply) { loseReply = false; throw new Error('Connection lost after submission'); }
      return result;
    } };
    await submitDraftChanges(options);
    assert.equal(requestId.current, sent[0]);
    assert.match(view.errors.at(-1)!, /Connection lost/);
    f.edit('alice', 'Please add a search field');
    await submitDraftChanges(options);
    assert.deepEqual(sent, [sent[0], sent[0]]);
    assert.equal(f.room.submissions.length, 1);
    assert.equal(f.personal.length, 1);
    assert.equal(f.room.pending.get('alice')?.length, 1);
    assert.equal(requestId.current, undefined);
    assert.match(view.notices.at(-1)!, /already submitted/);
  } finally { await f.close(); }
});

test('recovery stops after one fresh attempt and retains its identity on another uncertain failure', async () => {
  const view = feedback(), requestId: { current: string | undefined } = { current: 'confirmed-failed-request' }, sent: string[] = [];
  await submitDraftChanges({ ...view, requestId, flush: async () => {}, submit: async id => {
    sent.push(id);
    if (sent.length === 1) return { status: 'failed' };
    throw new Error('Fresh attempt reply lost');
  } });
  assert.equal(sent.length, 2);
  assert.equal(sent[0], 'confirmed-failed-request');
  assert.notEqual(sent[1], sent[0]);
  assert.equal(requestId.current, sent[1]);
  assert.match(view.errors.at(-1)!, /reply lost/);
  assert.equal(view.notices.at(-1), '');
});

test('a failed response is shown as failure and does not automatically submit again', async () => {
  const view = feedback(), requestId: { current: string | undefined } = { current: undefined };
  let submissions = 0;
  await submitDraftChanges({ ...view, requestId, flush: async () => {}, submit: async () => {
    submissions++; return { status: 'failed', message: 'Your edits are retained; submit again.' };
  } });
  assert.equal(submissions, 1);
  assert.equal(requestId.current, undefined);
  assert.equal(view.notices.at(-1), '');
  assert.match(view.errors.at(-1)!, /edits are retained/);
});
