import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHmac } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { WebSocket } from "ws";
import { createCoCreateServer } from "../server/index.js";
import { createSession } from "../server/auth.js";
import {
  LocalWaitlist,
  validateRegistration,
  waitlistClientKey,
  waitlistMessage,
} from "../server/beta.js";
import {
  SupabasePlatform,
  supabasePlatformFromEnv,
} from "../server/supabase-platform.js";

const temp = () => fs.mkdtempSync(path.join(os.tmpdir(), "cocreate-beta-"));
const cleanup = (dir: string) => {
  assert.ok(path.resolve(dir).startsWith(path.resolve(os.tmpdir()) + path.sep));
  fs.rmSync(dir, { recursive: true, force: true });
};

test("anonymous registration commits before success, retries dedupe, and restart preserves consent and limits", async () => {
  const dir = temp();
  let service = await createCoCreateServer({
    dataDir: dir,
    serveClient: false,
    port: 0,
    host: "127.0.0.1",
  });
  try {
    let { url } = await service.start();
    const send = (body: unknown) =>
      fetch(url + "/api/beta/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    assert.equal(
      (await send({ email: "test@example.test", consent: false })).status,
      400,
    );
    assert.equal(
      (
        await send({
          email: "test@example.test",
          consent: true,
          website: "bot",
        })
      ).status,
      400,
    );
    const replies = await Promise.all(
      Array.from({ length: 4 }, () =>
        send({ email: " Test@Example.Test ", consent: true }),
      ),
    );
    for (const response of replies) {
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { message: waitlistMessage });
    }
    let db = new DatabaseSync(path.join(dir, "beta-waitlist.sqlite"));
    assert.deepEqual(
      db
        .prepare("SELECT email,consent_version FROM registrations")
        .all()
        .map((row) => ({ ...row })),
      [{ email: "test@example.test", consent_version: "beta-updates-v1" }],
    );
    db.close();
    assert.equal((await fetch(url + "/api/beta/waitlist")).status, 404);
    await service.stop();
    service = await createCoCreateServer({
      dataDir: dir,
      serveClient: false,
      port: 0,
      host: "127.0.0.1",
    });
    ({ url } = await service.start());
    assert.equal(
      (await send({ email: "test@example.test", consent: true })).status,
      200,
    );
    const limited = await send({ email: "new@example.test", consent: true });
    assert.equal(limited.status, 429);
    assert.equal(limited.headers.get("Retry-After"), "900");
    db = new DatabaseSync(path.join(dir, "beta-waitlist.sqlite"));
    assert.equal(
      (
        db.prepare("SELECT count(*) n FROM registrations").get() as {
          n: number;
        }
      ).n,
      1,
    );
    db.close();
  } finally {
    await service.stop();
    cleanup(dir);
  }
});

test("failed durable writes cannot show registration success; rate window expiry allows safe retry", () => {
  const dir = temp(),
    store = new LocalWaitlist(dir),
    key = "synthetic";
  try {
    for (let i = 0; i < 5; i++)
      assert.equal(store.register("test@example.test", key, 10), true);
    assert.equal(store.register("test@example.test", key, 20), false);
    assert.equal(store.register("test@example.test", key, 900_001), true);
    const db = new DatabaseSync(path.join(dir, "beta-waitlist.sqlite"));
    db.exec("DROP TABLE registrations");
    db.close();
    assert.throws(
      () => store.register("retry@example.test", "other", 900_002),
      /no such table/,
    );
  } finally {
    store.close();
    cleanup(dir);
  }
});

test("registration requires valid email and explicit consent, and forwarded rate identities require Worker proof", () => {
  for (const input of [
    null,
    {},
    { email: "bad", consent: true },
    { email: "bad\u0000@example.test", consent: true },
    { email: "a@b.test", consent: "true" },
    { email: "a@b.test", consent: true, website: "bot" },
  ])
    assert.throws(() => validateRegistration(input));
  assert.equal(
    validateRegistration({ email: " A@B.TEST ", consent: true }),
    "a@b.test",
  );
  const req = {
    headers: {
      "x-forwarded-for": "1.2.3.4",
      "x-cocreate-waitlist-key": "a".repeat(64),
    },
    socket: { remoteAddress: "127.0.0.1" },
  } as any;
  const first = waitlistClientKey(req, "secret");
  req.headers["x-forwarded-for"] = "8.8.8.8";
  assert.equal(waitlistClientKey(req, "secret"), first);
  assert.notEqual(first, "a".repeat(64));
  req.headers["x-cocreate-waitlist-proof"] = createHmac("sha256", "secret")
    .update("waitlist-proxy-v1")
    .digest("hex");
  assert.equal(waitlistClientKey(req, "secret"), "a".repeat(64));
  assert.equal(
    supabasePlatformFromEnv({
      COCREATE_HOSTED: "true",
      COCREATE_AUTH_MODE: "local",
    }).mode,
    "supabase",
  );
});

function hostedFixture() {
  const approvals = new Map<
    string,
    { is_owner: boolean; revoked_at: string | null }
  >([
    ["owner", { is_owner: true, revoked_at: "revoked" }],
    ["alice", { is_owner: false, revoked_at: null }],
  ]);
  const members = new Map([
    ["owner", "owner"],
    ["alice", "editor"],
  ]);
  let consumed = 0;
  let lookupError = false;
  const platform = new SupabasePlatform({
    url: "https://synthetic.supabase.co",
    publishableKey: "sb_publishable_synthetic",
    secretKey: "sb_secret_synthetic",
  });
  const admin = {
    from: (table: string) => {
      const filters: Record<string, string> = {};
      const query = {
        select: () => query,
        eq: (key: string, value: string) => {
          filters[key] = value;
          return query;
        },
        maybeSingle: async () => ({
          data:
            table === "beta_access"
              ? approvals.get(filters.user_id) || null
              : filters.project_id === "project" && members.has(filters.user_id)
                ? { role: members.get(filters.user_id), can_share: false }
                : null,
          error: lookupError ? { message: "private configuration" } : null,
        }),
      };
      return query;
    },
  };
  Object.defineProperty(platform, "admin", { value: admin });
  platform.verifyUser = async (token) => {
    if (!["owner", "alice", "pending"].includes(token))
      throw Object.assign(new Error("Invalid account"), { status: 401 });
    return {
      id: token,
      email: `${token}@example.test`,
      user_metadata: { is_owner: true, beta_approved: true },
    };
  };
  (platform as any).userClient = () => ({
    rpc: async () => {
      consumed++;
      return { data: "project", error: null };
    },
  });
  platform.saveSnapshot = async () => ({
    contentHash: "test",
    artifactManifest: [],
  });
  platform.appendDocumentUpdate = async () => {};
  platform.assertCoordinator = async () => {};
  return {
    platform,
    approvals,
    members,
    get consumed() {
      return consumed;
    },
    failLookup() {
      lookupError = true;
    },
  };
}

test("approval is fresh private authority, owner retains access, and approval grants no foreign membership", async () => {
  const fixture = hostedFixture();
  assert.equal(await fixture.platform.hasBetaAccess("owner"), true);
  assert.equal(await fixture.platform.hasBetaAccess("pending"), false);
  await assert.rejects(
    fixture.platform.requireMembership("project", "pending"),
    /pending approval/,
  );
  assert.equal(
    await fixture.platform.requireMembership("project", "alice"),
    "editor",
  );
  await assert.rejects(
    fixture.platform.requireMembership("foreign", "alice"),
    /permission/,
  );
  fixture.approvals.get("alice")!.revoked_at = new Date().toISOString();
  await assert.rejects(
    fixture.platform.requireMembership("project", "alice"),
    /pending approval/,
  );
  await assert.rejects(
    fixture.platform.listProjects("pending"),
    /pending approval/,
  );
  await assert.rejects(
    fixture.platform.createProject("pending"),
    /pending approval/,
  );
  fixture.failLookup();
  await assert.rejects(fixture.platform.hasBetaAccess("owner"), /unavailable/);
});

test("pending invitation acceptance leaves the invite untouched and returns to the existing contract after approval", async () => {
  const fixture = hostedFixture();
  await assert.rejects(
    fixture.platform.acceptInvite("pending", "retained-token"),
    /pending approval/,
  );
  assert.equal(fixture.consumed, 0);
  fixture.approvals.set("pending", { is_owner: false, revoked_at: null });
  assert.equal(
    await fixture.platform.acceptInvite("pending", "retained-token"),
    "project",
  );
  assert.equal(fixture.consumed, 1);
});

test("unapproved accounts cannot read APIs, previews, downloads, socket upgrades/messages or later delivery", async () => {
  const dir = temp(),
    fixture = hostedFixture(),
    secret = "synthetic-beta",
    service = await createCoCreateServer({
      platform: fixture.platform,
      dataDir: dir,
      serveClient: false,
      port: 0,
      host: "127.0.0.1",
      sessionSecret: secret,
    });
  const sockets: WebSocket[] = [];
  try {
    const room = service.manager.create("project");
    service.manager.join(room, "alice", "Alice");
    service.manager.join(room, "pending", "Pending");
    const { url, port } = await service.start();
    const ticket = (actor: string) =>
      createSession(secret, {
        roomId: "project",
        participantId: actor,
        accountId: actor,
        name: actor,
        role: "editor",
      });
    const headers = (actor: string) => ({
      Authorization: `Bearer ${ticket(actor)}`,
      "Content-Type": "application/json",
    });
    for (const route of [
      "/api/rooms/project/state",
      "/preview/project/1",
      "/api/rooms/project/download/1",
    ])
      assert.equal(
        (await fetch(url + route, { headers: headers("pending") })).status,
        403,
      );
    assert.equal(
      (
        await fetch(url + "/api/projects", {
          headers: { Authorization: "Bearer pending" },
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await fetch(url + "/api/projects", {
          method: "POST",
          headers: {
            Authorization: "Bearer pending",
            "Content-Type": "application/json",
          },
          body: "{}",
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await fetch(url + "/api/invites/accept", {
          method: "POST",
          headers: {
            Authorization: "Bearer pending",
            "Content-Type": "application/json",
          },
          body: '{"token":"preserved"}',
        })
      ).status,
      403,
    );
    assert.equal(fixture.consumed, 0);
    const access = await fetch(url + "/api/beta/access", {
      headers: { Authorization: "Bearer pending" },
    });
    assert.equal(access.status, 200);
    assert.deepEqual(await access.json(), { approved: false });
    assert.equal((await fetch(url + "/api/beta/access")).status, 401);
    assert.equal(
      (
        await fetch(url + "/api/rooms/project/state", {
          headers: headers("alice"),
        })
      ).status,
      200,
    );
    assert.equal(
      (
        await fetch(url + "/api/rooms/project/state", {
          headers: headers("owner"),
        })
      ).status,
      200,
    );
    const connect = (actor: string) => {
      const socket = new WebSocket(
        `ws://127.0.0.1:${port}/ws?room=project&token=${encodeURIComponent(ticket(actor))}`,
        { origin: url },
      );
      sockets.push(socket);
      return socket;
    };
    const denied = connect("pending");
    assert.equal(
      await new Promise((resolve) => {
        denied.once("unexpected-response", (_req, res) => {
          resolve(res.statusCode);
          res.resume();
        });
        denied.on("error", () => {});
      }),
      403,
    );
    const active = connect("alice");
    await new Promise<void>((resolve, reject) => {
      active.on("message", (raw, binary) => {
        if (!binary && JSON.parse(String(raw)).type === "room-state") resolve();
      });
      active.once("error", reject);
    });
    const received: string[] = [];
    active.on("message", (raw) => received.push(String(raw)));
    fixture.approvals.get("alice")!.revoked_at = "revoked";
    const closed = new Promise<number>((resolve) =>
      active.once("close", resolve),
    );
    await service.manager.save(room);
    assert.equal(await closed, 4403);
    assert.equal(received.length, 0);
    assert.equal(
      (
        await fetch(url + "/api/rooms/project/state", {
          headers: headers("alice"),
        })
      ).status,
      403,
    );
    fixture.approvals.get("alice")!.revoked_at = null;
    const writer = connect("alice");
    await new Promise<void>((resolve) => writer.once("open", resolve));
    fixture.approvals.get("alice")!.revoked_at = "revoked";
    const writerClosed = new Promise<number>((resolve) =>
      writer.once("close", resolve),
    );
    writer.send(
      JSON.stringify({ type: "flush-request", requestId: "revoked-flush" }),
    );
    assert.equal(await writerClosed, 4403);
  } finally {
    for (const socket of sockets) socket.terminate();
    await service.stop();
    cleanup(dir);
  }
});
