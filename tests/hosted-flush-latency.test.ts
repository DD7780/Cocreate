import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as Y from 'yjs';
import {WebSocket} from 'ws';
import {createCoCreateServer} from '../server/index.js';
import {createSession} from '../server/auth.js';
import {CoCreateProvider} from '../src/provider.js';

const pause = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

test('a real hosted socket flush survives measured authorization and snapshot latency after typing', async context => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hosted-flush-latency-'));
  let permitted = true;
  const platform = {
    async requireMembership() {
      await pause(400);
      if (!permitted) throw Object.assign(new Error('Membership revoked'), {status: 403});
      return 'editor';
    },
    async assertCoordinator() { await pause(200); },
    async saveSnapshot() { await pause(500); },
    async appendDocumentUpdate() { await pause(200); },
    coordinator: {async close() {}},
  };
  const service = await createCoCreateServer({platform: platform as any, dataDir: dir, submissionMode: 'direct', serveClient: false, port: 0, host: '127.0.0.1', sessionSecret: 'latency-fixture'});
  const room = service.manager.create('latency-project');
  service.manager.join(room, 'alice', 'Alice');
  await room.persistQueue;
  const {url} = await service.start();
  class OriginSocket extends WebSocket {
    constructor(address: string) { super(address, {origin: url}); }
  }
  const token = createSession('latency-fixture', {roomId: room.id, participantId: 'alice', accountId: 'alice', name: 'Alice', role: 'editor'});
  const doc = new Y.Doc();
  let ready!: () => void;
  const connected = new Promise<void>(resolve => { ready = resolve; });
  const provider = new CoCreateProvider(doc, room.id, token, () => ready(), () => {}, () => {}, {
    origin: url, WebSocketImpl: OriginSocket as unknown as typeof globalThis.WebSocket,
    setTimer: (callback, ms) => setTimeout(callback, ms) as unknown as number,
    clearTimer: timer => clearTimeout(timer),
  });
  try {
    await connected;
    const paragraph = new Y.XmlElement('paragraph'), text = new Y.XmlText();
    paragraph.insert(0, [text]);
    doc.getXmlFragment('default').insert(0, [paragraph]);
    for (const character of 'Build a site') {
      text.insert(text.length, character);
      await pause(45);
    }
    const started = performance.now();
    await provider.flush();
    context.diagnostic(`Canonical save acknowledged in ${Math.round(performance.now() - started)}ms after typing; zero inference.`);
    assert.equal(room.doc.getXmlFragment('default').toString(), doc.getXmlFragment('default').toString());
    assert.ok(room.pending.get('alice')?.length, 'saved edits remain eligible for explicit submission');
    assert.equal(room.submissions.length, 0, 'saving never starts inference');
    assert.equal(room.providerCalls.length, 0);
    const savedDocument = room.doc.getXmlFragment('default').toString();
    permitted = false;
    text.insert(text.length, ' revoked');
    await assert.rejects(provider.flush(), /disconnected|Reconnect/);
    assert.equal(room.doc.getXmlFragment('default').toString(), savedDocument, 'a later drain rechecks access before applying queued edits');
  } finally {
    provider.destroy();
    doc.destroy();
    await service.stop();
    fs.rmSync(dir, {recursive: true, force: true});
  }
});
