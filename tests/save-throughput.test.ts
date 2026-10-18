import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import * as Y from "yjs";
import { WebSocket } from "ws";
import { RoomManager, type Room } from "../server/rooms.js";
import type { ClientSocket, DurableStore } from "../server/room-state.js";
import { createTwoGuysOneCanvasServer } from "../server/index.js";
import { createSession } from "../server/auth.js";
import { createArtifactFixture } from "./fixtures/artifact-storage.js";

const pause = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));
function gate() {
  let release!: () => void;
  const promise = new Promise<void>(resolve => { release = resolve; });
  return { promise, release };
}
async function until(check: () => boolean, message: string, ms = 2000) {
  const end = Date.now() + ms;
  while (!check() && Date.now() < end) await pause(10);
  assert.ok(check(), message);
}
function setup(durableStore?: DurableStore) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "save-throughput-"));
  const manager = new RoomManager({ dataDir: dir, debounceMs: 10, encryptionSecret: "synthetic", durableStore });
  return { manager, dir, close() {
    manager.shutdown();
    assert.equal(path.dirname(path.resolve(dir)), path.resolve(os.tmpdir()));
    fs.rmSync(dir, { recursive: true, force: true });
  } };
}
function packet(doc: Y.Doc, value: string) {
  const vector = Y.encodeStateVector(doc), paragraph = new Y.XmlElement("paragraph"), text = new Y.XmlText();
  doc.transact(() => { doc.getXmlFragment("default").push([paragraph]); paragraph.push([text]); text.insert(0, value); });
  return Buffer.concat([Buffer.from([0]), Buffer.from(Y.encodeStateAsUpdate(doc, vector))]);
}
function edit(manager: RoomManager, room: Room, value: string, socket?: ClientSocket) {
  const doc = new Y.Doc();
  try {
    Y.applyUpdate(doc, Y.encodeStateAsUpdate(room.doc));
    manager.handleMessage(room, socket || { participantId: "alice", readyState: 0, send() {}, close() {} } as unknown as ClientSocket, packet(doc, value), true);
  } finally { doc.destroy(); }
}

test("routine autosaves keep one active snapshot and coalesce later typing instead of queuing stale copies", async () => {
  const blocked = gate(), captures: string[] = [];
  let hold = false;
  const f = setup({ saveSnapshot: async (_id, _revision, snapshot) => {
    if (hold) { captures.push(String(snapshot.update)); await blocked.promise; }
  }, appendDocumentUpdate: async () => {} });
  try {
    const room = f.manager.create("autosaves"); f.manager.join(room, "alice", "Alice");
    await room.persistQueue;
    hold = true;
    for (let i = 0; i < 5; i++) { edit(f.manager, room, `Change ${i}`); await pause(220); }
    assert.equal(captures.length, 1, "only one remote save is active while blocked");
    blocked.release();
    await until(() => captures.length >= 2, "latest edits receive a following save");
    await pause(50);
    assert.ok(captures.length <= 2, `expected two coalesced snapshots, got ${captures.length}`);
    const restored = new Y.Doc();
    try {
      Y.applyUpdate(restored, Buffer.from(captures.at(-1)!, "base64"));
      assert.equal(restored.getXmlFragment("default").toString(), room.doc.getXmlFragment("default").toString());
      assert.equal(room.pending.get("alice")?.length, 5);
      assert.equal(room.submissions.length, 0);
    } finally { restored.destroy(); }
  } finally { blocked.release(); f.close(); }
});

test("hosted restore allocates above the remote journal high water and fails closed when that lookup is unavailable", async () => {
  const fixture = await createArtifactFixture(), platform = fixture.platform(), project = randomUUID();
  const first = setup(platform), second = setup();
  try {
    await platform.claimCoordinator(project);
    const room = first.manager.create(project); first.manager.join(room, "alice", "Alice"); await room.persistQueue;
    edit(first.manager, room, "Original draft"); await first.manager.save(room);
    fixture.controls.latestDocumentSequence = 40;
    const snapshot = await platform.loadSnapshot(project);
    assert.equal(snapshot!.documentSequence, 40);
    const restored = second.manager.hydrate(project, snapshot);
    edit(second.manager, restored, "New draft");
    assert.equal(restored.editHistory.at(-1)!.seq, 41);
    await second.manager.save(restored);
    assert.equal(second.manager.eventStore.readWorkspaceSnapshot<any>(project).documentSequence, 41);
    fixture.controls.failDocumentSequence = true;
    await assert.rejects(platform.loadSnapshot(project), /sequence/i);
  } finally { first.close(); second.close(); await fixture.close(); }
});

test("hosted incoming edit bursts retain order, caller attribution and fresh revocation checks without one lookup per frame", async () => {
  const permission = gate(), dir = fs.mkdtempSync(path.join(os.tmpdir(), "save-ingress-"));
  let hold = false, allowed = true, checks = 0;
  const platform = {
    saveSnapshot: async () => {}, appendDocumentUpdate: async () => {}, assertCoordinator: async () => {}, coordinator: { close: async () => {} },
    requireMembership: async () => { checks++; if (hold) await permission.promise; if (!allowed) throw new Error("Revoked"); return "editor"; },
  };
  const service = await createTwoGuysOneCanvasServer({ platform: platform as any, dataDir: dir, serveClient: false, port: 0, host: "127.0.0.1", sessionSecret: "synthetic-signing-secret-for-hosted-fixtures-2026", encryptionSecret: "synthetic-encryption-secret-for-hosted-fixtures-2026" });
  let socket: WebSocket | undefined;
  const doc = new Y.Doc();
  try {
    const room = service.manager.create("project"); service.manager.join(room, "alice", "Alice"); await room.persistQueue;
    const { port, url } = await service.start();
    const token = createSession("synthetic-signing-secret-for-hosted-fixtures-2026", { roomId: "project", participantId: "alice", accountId: "alice", name: "Alice", role: "editor" });
    const messages: any[] = [];
    socket = new WebSocket(`ws://127.0.0.1:${port}/ws?room=project&token=${encodeURIComponent(token)}`, { origin: url });
    socket.on("message", (raw, binary) => { if (!binary) messages.push(JSON.parse(raw.toString())); });
    await until(() => messages.some(item => item.type === "room-state"), "socket initialized");
    await pause(20); checks = 0; hold = true;
    for (let i = 0; i < 70; i++) socket.send(packet(doc, `Request ${i}`));
    await pause(30); permission.release();
    await until(() => room.editHistory.length===70, "ordered burst applied");
    assert.equal(room.editHistory.length, 70);
    assert.deepEqual(room.editHistory.map(item => item.seq), Array.from({ length: 70 }, (_, i) => i + 1));
    assert.ok(room.editHistory.every(item => item.participantId === "alice"));
    assert.ok(checks <= 12, `burst caused ${checks} serialized permission lookups`);
    assert.equal(room.submissions.length, 0);
    allowed = false;
    const closed = new Promise<number>(resolve => socket!.once("close", resolve));
    socket.send(packet(doc, "Must not be applied"));
    assert.equal(await closed, 4403);
    assert.equal(room.editHistory.length, 70, "a fresh later batch cannot reuse the earlier permission");
  } finally {
    permission.release(); socket?.terminate(); doc.destroy(); await service.stop();
    assert.equal(path.dirname(path.resolve(dir)), path.resolve(os.tmpdir())); fs.rmSync(dir, { recursive: true, force: true });
  }
});
