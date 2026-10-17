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

test("an indefinitely queued canonical commit ends the flush wait without releasing the write queue or acknowledging late", async t => {
  const canonical = gate(), messages: any[] = [];
  let hold = false, started = false;
  const f = setup({ saveSnapshot: async () => { if (hold) { started = true; await canonical.promise; } }, appendDocumentUpdate: async () => {} });
  try {
    const room = f.manager.create("flush-deadline"); f.manager.join(room, "alice", "Alice"); await room.persistQueue;
    const client = { participantId: "alice", readyState: 1, send(raw: unknown) { if (typeof raw === "string") messages.push(JSON.parse(raw)); }, close() {} } as ClientSocket;
    room.clients.add(client);edit(f.manager, room, "Keep this draft", client);hold = true;
    t.mock.timers.enable({ apis: ["setTimeout"] });
    f.manager.handleMessage(room, client, Buffer.from(JSON.stringify({ type: "flush", requestId: "deadline" })), false);
    await new Promise(resolve => setImmediate(resolve));assert.equal(started, true);
    const canonicalWrite = room.persistQueue;
    t.mock.timers.tick(20_000);await new Promise(resolve => setImmediate(resolve));
    assert.match(messages.find(item => item.type === "flush-error")?.message, /outcome is unknown/);
    assert.equal(room.persistQueue, canonicalWrite, "timeout does not release canonical write serialization");
    assert.equal(room.providerCalls.length, 0);assert.equal(room.submissions.length, 0);assert.equal(room.pending.get("alice")?.length, 1);
    canonical.release();await canonicalWrite;await new Promise(resolve => setImmediate(resolve));
    assert.equal(messages.filter(item => item.type === "flushed").length, 0);
    assert.equal(messages.filter(item => item.type === "saved").length, 1, "a later confirmed commit still reports its immutable receipt");
  } finally { t.mock.timers.reset();canonical.release();f.close(); }
});

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

test("flush acknowledges its canonical snapshot even while the separate recovery journal is delayed", async () => {
  const journal = gate(), canonical = gate();
  let hold = false, snapshotStarted = false;
  const messages: any[] = [];
  const f = setup({ saveSnapshot: async () => { if (hold) { snapshotStarted = true; await canonical.promise; } }, appendDocumentUpdate: async () => journal.promise });
  try {
    const room = f.manager.create("flush"); f.manager.join(room, "alice", "Alice"); await room.persistQueue;
    hold = true;
    const socket = { participantId: "alice", readyState: 1, send: (raw: string) => messages.push(JSON.parse(raw)), close() {} } as unknown as ClientSocket;
    edit(f.manager, room, "Build my catalog", socket);
    f.manager.handleMessage(room, socket, Buffer.from(JSON.stringify({ type: "flush", requestId: "build-save" })), false);
    await until(() => snapshotStarted, "flush must start a full snapshot without waiting for journal I/O", 500);
    assert.ok(!messages.some(item => item.type === "flushed"), "no acknowledgement precedes canonical commit");
    canonical.release();
    await until(() => messages.some(item => item.type === "flushed"), "canonical commit acknowledges the explicit flush", 500);
    assert.equal(messages.find(item => item.type === "flushed").requestId, "build-save");
    assert.equal(room.submissions.length, 0, "flush itself never starts inference");
  } finally { journal.release(); canonical.release(); f.close(); }
});

test("a delayed journal failure cannot mark a successfully committed document unsynced", async () => {
  const journal = gate(), messages: any[] = [];
  const f = setup({ saveSnapshot: async () => {}, appendDocumentUpdate: async () => { await journal.promise; throw new Error("Journal unavailable"); } });
  try {
    const room = f.manager.create("late-journal"); f.manager.join(room, "alice", "Alice"); await room.persistQueue;
    const socket = { participantId: "alice", readyState: 1, send: (raw: string) => messages.push(JSON.parse(raw)), close() {} } as unknown as ClientSocket;
    edit(f.manager, room, "Saved draft", socket);
    f.manager.handleMessage(room, socket, Buffer.from(JSON.stringify({ type: "flush", requestId: "saved" })), false);
    await until(() => messages.some(item => item.type === "flushed"), "canonical snapshot committed");
    journal.release(); await room.documentQueue?.catch(() => {}); await pause();
    assert.ok(!messages.some(item => item.type === "save-error"));
    assert.equal(room.pending.get("alice")?.length, 1);
  } finally { journal.release(); f.close(); }
});

test("flush persists deletions and attributed edits, and a failed canonical save never acknowledges or consumes them", async () => {
  const journal = gate(), messages: any[] = [];
  let failSave = false, captured: any;
  const f = setup({ saveSnapshot: async (_id, _revision, snapshot) => {
    if (failSave) throw new Error("Canonical commit unavailable");
    captured = snapshot;
  }, appendDocumentUpdate: async () => journal.promise });
  try {
    const room = f.manager.create("deletion"); f.manager.join(room, "alice", "Alice"); await room.persistQueue;
    const socket = { participantId: "alice", readyState: 1, send: (raw: string) => messages.push(JSON.parse(raw)), close() {} } as unknown as ClientSocket;
    edit(f.manager, room, "Remove this draft", socket);
    const doc = new Y.Doc();
    try {
      Y.applyUpdate(doc, Y.encodeStateAsUpdate(room.doc)); const vector = Y.encodeStateVector(doc);
      doc.getXmlFragment("default").delete(0, 1);
      f.manager.handleMessage(room, socket, Buffer.concat([Buffer.from([0]), Buffer.from(Y.encodeStateAsUpdate(doc, vector))]), true);
    } finally { doc.destroy(); }
    f.manager.handleMessage(room, socket, Buffer.from(JSON.stringify({ type: "flush", requestId: "deleted" })), false);
    await until(() => messages.some(item => item.type === "flushed"), "deletion snapshot commits despite blocked journal");
    const restored = new Y.Doc();
    try {
      Y.applyUpdate(restored, Buffer.from(captured.update, "base64"));
      assert.equal(restored.getXmlFragment("default").length, 0);
      assert.equal(captured.editHistory.length, 2);
      assert.equal(captured.pending[0][1].length, 2);
    } finally { restored.destroy(); }
    failSave = true;
    edit(f.manager,room,'Retain this newer unsaved draft',socket);
    f.manager.handleMessage(room, socket, Buffer.from(JSON.stringify({ type: "flush", requestId: "failed" })), false);
    await until(() => messages.some(item => item.type === "flush-error" && item.requestId === "failed"), "failed canonical commit rejects flush");
    assert.ok(!messages.some(item => item.type === "flushed" && item.requestId === "failed"));
    assert.equal(room.pending.get("alice")?.length, 3);
    assert.equal(room.submissions.length, 0);
  } finally { journal.release(); f.close(); }
});

for (const revoke of [false, true, "later"] as const) test(`outbound receipt bursts use bounded fresh authorization batches; revoked=${revoke}`, async () => {
  const permission = gate(), messages: any[] = [], f = setup();
  let checks = 0;
  try {
    const room = f.manager.create("delivery"); f.manager.join(room, "alice", "Alice");
    const socket = { participantId: "alice", readyState: 1,
      authorizeRead: async () => { checks++; await permission.promise; if (revoke === true || (revoke === "later" && checks > 1)) throw new Error("Revoked"); },
      send: (raw: string) => messages.push(JSON.parse(raw)),
      close() { (this as { readyState: number }).readyState = 3; },
    } as unknown as ClientSocket;
    room.clients.add(socket);
    for (let i = 0; i < 70; i++) f.manager.save(room);
    f.manager.handleMessage(room, socket, Buffer.from(JSON.stringify({ type: "flush", requestId: "after-burst" })), false);
    await pause(); permission.release(); await pause(); await socket.deliveryQueue;
    if (revoke) {
      assert.equal(socket.readyState, 3);
      assert.equal(messages.length, revoke === "later" ? 32 : 0, "no queued receipt is sent after its fresh authorization fails");
    } else {
      await until(() => messages.some(item => item.type === "flushed"), "flush acknowledgement delivered");
      assert.ok(checks <= 4, `expected bounded batching, got ${checks} individual lookups`);
      const revisions = messages.filter(item => item.type === "saved").map(item => item.revision);
      assert.equal(revisions.length, 71, "resend the confirmed receipt without a duplicate snapshot");
      assert.deepEqual(revisions, [...revisions].sort((a, b) => a - b));
      assert.equal(messages.at(-1).type, "flushed");
    }
  } finally { permission.release(); f.close(); }
});

test("hosted incoming edit bursts retain order, caller attribution and fresh revocation checks without one lookup per frame", async () => {
  const permission = gate(), dir = fs.mkdtempSync(path.join(os.tmpdir(), "save-ingress-"));
  let hold = false, allowed = true, checks = 0;
  const platform = {
    saveSnapshot: async () => {}, appendDocumentUpdate: async () => {}, assertCoordinator: async () => {}, coordinator: { close: async () => {} },
    requireMembership: async () => { checks++; if (hold) await permission.promise; if (!allowed) throw new Error("Revoked"); return "editor"; },
  };
  const service = await createTwoGuysOneCanvasServer({ platform: platform as any, dataDir: dir, serveClient: false, port: 0, host: "127.0.0.1", sessionSecret: "synthetic" });
  let socket: WebSocket | undefined;
  const doc = new Y.Doc();
  try {
    const room = service.manager.create("project"); service.manager.join(room, "alice", "Alice"); await room.persistQueue;
    const { port, url } = await service.start();
    const token = createSession("synthetic", { roomId: "project", participantId: "alice", accountId: "alice", name: "Alice", role: "editor" });
    const messages: any[] = [];
    socket = new WebSocket(`ws://127.0.0.1:${port}/ws?room=project&token=${encodeURIComponent(token)}`, { origin: url });
    socket.on("message", (raw, binary) => { if (!binary) messages.push(JSON.parse(raw.toString())); });
    await until(() => messages.some(item => item.type === "room-state"), "socket initialized");
    await pause(20); checks = 0; hold = true;
    for (let i = 0; i < 70; i++) socket.send(packet(doc, `Request ${i}`));
    socket.send(JSON.stringify({ type: "flush", requestId: "burst" }));
    await pause(30); permission.release();
    await until(() => messages.some(item => item.type === "flushed" && item.requestId === "burst"), "burst saved");
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

test('flush joins a covering in-flight commit instead of adding a second slow canonical HTTP operation',async t=>{
  const held=[gate(),gate()];let hold=false,writes=0;const messages:any[]=[];
  const f=setup({saveSnapshot:async()=>{if(hold){const index=writes++;await held[Math.min(index,1)].promise}},appendDocumentUpdate:async()=>{}});
  let room:Room|undefined;
  try{
    room=f.manager.create('covering-inflight');f.manager.join(room,'alice','Alice');await room.persistQueue;
    const client={participantId:'alice',readyState:1,send(raw:unknown){if(typeof raw==='string')messages.push(JSON.parse(raw))},close(){}} as ClientSocket;
    room.clients.add(client);edit(f.manager,room,'Only this caller draft',client);clearTimeout(room.saveTimer);hold=true;
    const saving=f.manager.save(room);await until(()=>writes===1,'first remote write');
    t.mock.timers.enable({apis:['setTimeout']});
    f.manager.handleMessage(room,client,Buffer.from(JSON.stringify({type:'flush',requestId:'covering-request'})),false);
    t.mock.timers.tick(15000);
    held[0].release();await saving;await new Promise(resolve=>setImmediate(resolve));
    assert.equal(writes,1,'the same document must not start a second serialized remote operation');
    assert.ok(messages.some(item=>item.type==='flushed'&&item.requestId==='covering-request'));
    assert.equal(room.submissions.length,0);assert.equal(room.providerCalls.length,0);
  }finally{t.mock.timers.reset();held.forEach(item=>item.release());await room?.persistQueue;f.close()}
});

test('a confirmed insertion receipt cannot satisfy a later deletion-only flush',async()=>{
  let writes=0,hold=false;const pending=gate(),messages:any[]=[];
  const f=setup({saveSnapshot:async()=>{writes++;if(hold)await pending.promise},appendDocumentUpdate:async()=>{}});
  let room:Room|undefined;
  try{
    room=f.manager.create('deletion-receipt');f.manager.join(room,'alice','Alice');await room.persistQueue;
    const client={participantId:'alice',readyState:1,send(raw:unknown){if(typeof raw==='string')messages.push(JSON.parse(raw))},close(){}} as ClientSocket;
    room.clients.add(client);edit(f.manager,room,'Original paragraph',client);clearTimeout(room.saveTimer);await f.manager.save(room);
    const copy=new Y.Doc();Y.applyUpdate(copy,Y.encodeStateAsUpdate(room.doc));const vector=Y.encodeStateVector(copy);copy.getXmlFragment('default').delete(0,1);
    f.manager.handleMessage(room,client,Buffer.concat([Buffer.from([0]),Buffer.from(Y.encodeStateAsUpdate(copy,vector))]),true);copy.destroy();clearTimeout(room.saveTimer);
    const before=writes;hold=true;f.manager.handleMessage(room,client,Buffer.from(JSON.stringify({type:'flush',requestId:'deleted-request'})),false);
    await until(()=>writes>before,'deletion must be durably written');assert.ok(!messages.some(item=>item.type==='flushed'&&item.requestId==='deleted-request'));
    pending.release();await room.persistQueue;await new Promise(resolve=>setImmediate(resolve));assert.ok(messages.some(item=>item.type==='flushed'&&item.requestId==='deleted-request'));
  }finally{pending.release();await room?.persistQueue;f.close()}
});

test('a covering confirmed receipt needs no further write, but fresh outbound authority still applies',async()=>{
  let writes=0,checks=0;const messages:any[]=[];
  const f=setup({saveSnapshot:async()=>{writes++},appendDocumentUpdate:async()=>{}});
  try{
    const room=f.manager.create('confirmed-receipt');f.manager.join(room,'alice','Alice');await room.persistQueue;
    const client={participantId:'alice',readyState:1,authorizeRead:async()=>{checks++;throw new Error('Revoked')},send:(raw:string)=>messages.push(JSON.parse(raw)),close(){(this as {readyState:number}).readyState=3}} as unknown as ClientSocket;
    const before=writes;f.manager.handleMessage(room,client,Buffer.from(JSON.stringify({type:'flush',requestId:'cached-receipt'})),false);
    await until(()=>client.readyState===3,'fresh authority rejects cached receipt');
    assert.equal(writes,before);assert.equal(checks,1);assert.equal(messages.length,0);
  }finally{f.close()}
});

test('an expired flush awaiting an older snapshot never queues its own write after the late commit',async t=>{
  let hold=false,writes=0;const pending=gate(),messages:any[]=[];
  const f=setup({saveSnapshot:async()=>{if(hold){writes++;await pending.promise}},appendDocumentUpdate:async()=>{}});
  let room:Room|undefined;
  try{
    room=f.manager.create('expired-older');f.manager.join(room,'alice','Alice');await room.persistQueue;
    const client={participantId:'alice',readyState:1,send:(raw:string)=>messages.push(JSON.parse(raw)),close(){}} as unknown as ClientSocket;
    hold=true;const older=f.manager.save(room);await until(()=>writes===1,'older snapshot pending');
    edit(f.manager,room,'A newer caller draft',client);clearTimeout(room.saveTimer);
    t.mock.timers.enable({apis:['setTimeout']});
    f.manager.handleMessage(room,client,Buffer.from(JSON.stringify({type:'flush',requestId:'expired-older'})),false);
    await new Promise(resolve=>setImmediate(resolve));t.mock.timers.tick(20000);await new Promise(resolve=>setImmediate(resolve));
    assert.ok(messages.some(item=>item.type==='flush-error'));pending.release();await older;await new Promise(resolve=>setImmediate(resolve));
    assert.equal(writes,1);assert.ok(!messages.some(item=>item.type==='flushed'));assert.equal(room.pending.get('alice')?.length,1);assert.equal(room.providerCalls.length,0);
  }finally{t.mock.timers.reset();pending.release();await room?.persistQueue;f.close()}
});

test('ownership loss during a joined save prevents the confirmed receipt from acknowledging the old coordinator',async()=>{
  let hold=false,lose!:(id:string)=>void;const pending=gate(),messages:any[]=[];
  const f=setup({saveSnapshot:async()=>{if(hold)await pending.promise},appendDocumentUpdate:async()=>{},onCoordinatorLost:listener=>{lose=listener;return()=>{}}});
  let room:Room|undefined;
  try{
    room=f.manager.create('joined-ownership');f.manager.join(room,'alice','Alice');await room.persistQueue;
    const client={participantId:'alice',readyState:1,send:(raw:string)=>messages.push(JSON.parse(raw)),close(){(this as {readyState:number}).readyState=3}} as unknown as ClientSocket;
    room.clients.add(client);edit(f.manager,room,'Retain on lost ownership',client);clearTimeout(room.saveTimer);hold=true;
    const saving=f.manager.save(room);f.manager.handleMessage(room,client,Buffer.from(JSON.stringify({type:'flush',requestId:'lost-owner'})),false);
    lose(room.id);pending.release();await saving;await new Promise(resolve=>setImmediate(resolve));
    assert.equal(client.readyState,3);assert.ok(!messages.some(item=>item.type==='flushed'));assert.equal(room.submissions.length,0);
  }finally{pending.release();await room?.persistQueue;f.close()}
});

test('real SDK snapshot diagnostics distinguish artifact preparation and remote commit with safe HTTP/SQL metadata',async t=>{
  const logs:string[]=[];t.mock.method(console,'info',(value:string)=>logs.push(value));
  const fixture=await createArtifactFixture(),platform=fixture.platform(),project=randomUUID(),f=setup(platform);
  try{
    await platform.claimCoordinator(project);
    const room=f.manager.create(project);f.manager.join(room,'alice','Alice');await room.persistQueue;
    const client={participantId:'alice',readyState:1,send(){},close(){}} as unknown as ClientSocket;
    edit(f.manager,room,'Synthetic private draft',client);clearTimeout(room.saveTimer);fixture.controls.failCommit=true;
    f.manager.handleMessage(room,client,Buffer.from(JSON.stringify({type:'flush',requestId:'sdk-safe-stages'})),false);
    await until(()=>logs.some(line=>JSON.parse(line).outcome==='failed'),'failed SDK flush traced',5000);
    const failure=logs.map(line=>JSON.parse(line)).find(line=>line.outcome==='failed');
    const stages=failure.snapshots[0].stages;
    assert.ok(stages.find((item:any)=>item.stage==='artifact-prepare'&&typeof item.durationMs==='number'));
    assert.ok(stages.find((item:any)=>item.stage==='remote-commit'&&item.status===500&&item.code==='XX000'));
    assert.doesNotMatch(logs.join(''),/Synthetic private draft|synthetic-service-key|Controlled commit interruption/);
    assert.equal(room.providerCalls.length,0);assert.equal(room.pending.get('alice')?.length,1);
  }finally{f.close();await fixture.close()}
});
