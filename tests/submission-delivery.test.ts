import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { RoomManager } from '../server/rooms.js';
import type { ClientSocket } from '../server/room-state.js';

test('obsolete saved projections cannot queue one authorization per keystroke ahead of a flush reply', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'submission-delivery-'));
  const manager = new RoomManager({dataDir: dir, debounceMs: 10, encryptionSecret: 'synthetic'});
  let release!: () => void, checks = 0;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const messages: Array<{type: string; revision?: number; requestId?: string}> = [];
  const client = {
    participantId: 'alice', readyState: 1,
    send(raw: unknown) { messages.push(JSON.parse(String(raw))); },
    close() {},
    async authorizeRead() { checks++; await gate; },
  } as unknown as ClientSocket;
  try {
    const room = manager.create('room');
    manager.join(room, 'alice', 'Alice');
    room.clients.add(client);
    for (let i = 0; i < 68; i++) await manager.save(room);
    manager.handleMessage(room, client, Buffer.from(JSON.stringify({type: 'flush', requestId: 'build-barrier'})), false);
    await Promise.resolve();
    release();
    for (let i = 0; i < 100 && !messages.some(item => item.type === 'flushed'); i++) {
      await new Promise(resolve => setImmediate(resolve));
    }
    assert.ok(messages.some(item => item.type === 'flushed' && item.requestId === 'build-barrier'));
    assert.equal(messages.filter(item => item.type === 'saved').at(-1)?.revision, room.persistRevision);
    assert.ok(checks <= 4, `${checks} serial authorization checks delay a single build barrier`);
    assert.equal(messages.filter(item => item.type === 'flushed').length, 1);
  } finally {
    release();
    manager.shutdown();
    fs.rmSync(dir, {recursive: true, force: true});
  }
});

test('coalesced projections still require current access before any delivery', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'submission-revocation-'));
  const manager = new RoomManager({dataDir: dir, debounceMs: 10, encryptionSecret: 'synthetic'});
  let release!: () => void, permitted = true, closed = 0;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const messages: unknown[] = [];
  const transport = {
    participantId: 'alice', readyState: 1,
    send(raw: unknown) { messages.push(raw); },
    close(code: number) { closed = code; transport.readyState = 3; },
    async authorizeRead() {
      await gate;
      if (!permitted) throw new Error('Membership revoked');
    },
  };
  const client = transport as unknown as ClientSocket;
  try {
    const room = manager.create('room');
    manager.join(room, 'alice', 'Alice');
    room.clients.add(client);
    for (let i = 0; i < 10; i++) manager.join(room, 'alice', `Alice ${i}`);
    permitted = false;
    release();
    await client.deliveryQueue;
    assert.equal(closed, 4403);
    assert.deepEqual(messages, []);
    assert.equal(client.pendingProjections?.size, 0);
  } finally {
    release();
    manager.shutdown();
    fs.rmSync(dir, {recursive: true, force: true});
  }
});
