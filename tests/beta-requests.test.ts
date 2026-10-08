import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import fs from "node:fs";
import vm from "node:vm";
import { randomUUID } from "node:crypto";
import {
  betaAccounts as accounts,
  betaDatabase,
} from "./fixtures/beta-database.js";
import { betaPlatform } from "./fixtures/beta-platform.js";
import {
  BetaRequestService,
  registerBetaRequestRoutes,
} from "../server/beta-requests.js";
import { betaEmailPayload } from "../server/beta-email.js";
import {
  transactionalEmailSenderFromEnv,
  type TransactionalEmailPayload,
} from "../server/invitation-email.js";

test("authenticated requests and review links preserve server identity, CSRF, reviewer and private project boundaries", async () => {
  const db = await betaDatabase(),
    platform = betaPlatform(db),
    app = express();
  app.use(express.json());
  const closeQueue = registerBetaRequestRoutes(app, platform, {});
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const origin = `http://127.0.0.1:${address.port}`;
  const call = (
    path: string,
    actor?: string,
    body?: unknown,
    extra: Record<string, string> = {},
  ) =>
    fetch(origin + path, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        ...(actor ? { Authorization: `Bearer ${actor}` } : {}),
        "Content-Type": "application/json",
        ...extra,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  try {
    assert.equal((await call("/api/beta/request", undefined, {})).status, 401);
    assert.equal(
      (
        await call(
          "/api/beta/request",
          undefined,
          {},
          { Cookie: "session=forged" },
        )
      ).status,
      401,
    );
    assert.equal(
      (await call("/api/beta/request", accounts.unconfirmed, {})).status,
      403,
    );
    assert.equal(
      (
        await call(
          "/api/beta/request",
          accounts.requester,
          {},
          { Origin: "https://attacker.invalid" },
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await call(
          "/api/beta/request",
          accounts.requester,
          {},
          { "Sec-Fetch-Site": "cross-site" },
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await call("/api/beta/request", accounts.requester, {
          message: "a".repeat(1001),
        })
      ).status,
      400,
    );
    const created = await call("/api/beta/request", accounts.requester, {
      message: "<script>alert(1)</script>",
      requesterId: accounts.founder,
      userId: accounts.founder,
    });
    assert.equal(created.status, 200);
    const request = await created.json();
    assert.equal(request.requesterId, accounts.requester);
    assert.equal(request.requesterEmail, "requester@example.test");
    assert.equal(
      (await (await call("/api/beta/request", accounts.requester, {})).json())
        .id,
      request.id,
    );
    assert.equal(
      (await call("/api/beta/review", accounts.requester)).status,
      403,
    );
    assert.equal(
      (
        await call(
          `/api/beta/requests/${request.id}/decision`,
          accounts.requester,
          { decision: "approved" },
        )
      ).status,
      403,
    );
    const before = (
      await db.query(
        "select status,decided_at,decided_by from public.beta_access_requests",
      )
    ).rows;
    for (const actor of [accounts.founder, accounts.cofounder]) {
      const opened = await call(
        `/api/beta/review?request=${request.id}`,
        actor,
      );
      assert.equal(opened.status, 200);
      assert.equal(opened.headers.get("Cache-Control"), "no-store");
      assert.equal((await opened.json()).selected.id, request.id);
    }
    assert.deepEqual(
      (
        await db.query(
          "select status,decided_at,decided_by from public.beta_access_requests",
        )
      ).rows,
      before,
    );
    assert.equal(
      (
        await call(
          `/api/beta/requests/${request.id}/decision`,
          accounts.founder,
        )
      ).status,
      404,
    );
    const approved = await call(
      `/api/beta/requests/${request.id}/decision`,
      accounts.cofounder,
      { decision: "approved" },
    );
    assert.equal(approved.status, 200);
    assert.equal((await approved.json()).decidedBy, accounts.cofounder);
    assert.equal(
      (await (await call("/api/beta/request", accounts.requester)).json())
        .approved,
      true,
    );
    await assert.rejects(
      platform.requireMembership(randomUUID(), accounts.requester),
      /permission/,
    );
    await db.query(
      "update public.beta_access set revoked_at=now() where user_id=$1",
      [accounts.requester],
    );
    assert.equal(
      (await (await call("/api/beta/request", accounts.requester)).json())
        .revoked,
      true,
    );
    await assert.rejects(
      platform.requireBetaAccess(accounts.requester),
      /pending approval/,
    );
    assert.equal(
      (await call("/api/beta/request", accounts.requester, {})).status,
      403,
    );
    await db.query(
      "update public.beta_reviewers set revoked_at=now() where user_id=$1",
      [accounts.cofounder],
    );
    assert.equal(
      (await call("/api/beta/review", accounts.cofounder)).status,
      403,
    );
  } finally {
    await closeQueue();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
    await db.close();
  }
});

test("reviewer and requester emails are durable, escaped and retried with an identical provider key and payload", async () => {
  const db = await betaDatabase(),
    platform = betaPlatform(db),
    calls: { key: string; payload: TransactionalEmailPayload }[] = [];
  const accepted = new Map<string, string>();
  let dropAcknowledgement = true;
  const sender = transactionalEmailSenderFromEnv(
    {
      RESEND_API_KEY: "re_synthetic",
      COCREATE_EMAIL_FROM: "2guys1canvas <beta@verified.test>",
    },
    async (_input, init) => {
      const key = new Headers(init?.headers).get("Idempotency-Key")!,
        payload = JSON.parse(String(init?.body));
      calls.push({ key, payload });
      if (!accepted.has(key)) accepted.set(key, randomUUID());
      if (dropAcknowledgement) {
        dropAcknowledgement = false;
        throw new Error(
          "Synthetic lost acknowledgement after provider acceptance",
        );
      }
      return Response.json({ id: accepted.get(key) });
    },
  );
  const service = new BetaRequestService(
    platform,
    sender,
    "https://2guys1canvas.com",
  );
  try {
    const request = await service.create(accounts.requester, {
      message: '<img src=x onerror=alert(1)> & "Hello"',
    });
    assert.equal(await service.deliverOne(), true);
    const pending = (
      await db.query(
        "select id from public.beta_email_deliveries where attempts=1 and state='pending'",
      )
    ).rows[0];
    assert.ok(pending);
    await db.query(
      "update public.beta_email_deliveries set next_attempt_at=now() where id=$1",
      [pending.id],
    );
    while (await service.deliverOne()) {
      /* drain only due messages */
    }
    assert.equal(accepted.size, 2);
    assert.equal(calls.length, 3);
    const retried = calls.filter((call) => call.key === calls[0].key);
    assert.equal(retried.length, 2);
    assert.deepEqual(retried[0], retried[1]);
    assert.deepEqual(
      new Set(calls.map((call) => call.payload.to[0])),
      new Set(["founder@example.test", "cofounder@example.test"]),
    );
    for (const call of calls) {
      assert.doesNotMatch(call.payload.html, /<img|onerror=alert\(1\)>/);
      assert.match(call.payload.html, /&lt;img/);
      assert.match(call.payload.html, /\/beta\/review\?request=/);
      assert.doesNotMatch(
        call.payload.html,
        /access_token|authorization|[?&]token=/i,
      );
    }
    await service.decide(accounts.founder, request.id, "approved");
    await service.decide(accounts.cofounder, request.id, "approved");
    assert.equal(await service.deliverOne(), true);
    assert.equal(await service.deliverOne(), false);
    assert.equal(accepted.size, 3);
    const notification = calls.at(-1)!;
    assert.equal(notification.payload.to[0], "requester@example.test");
    assert.match(
      notification.payload.html,
      /href="https:\/\/2guys1canvas.com\/app"/,
    );
    assert.equal(
      (
        await db.query(
          "select count(*)::int n from public.beta_email_deliveries where state='sent'",
        )
      ).rows[0].n,
      3,
    );
  } finally {
    await db.close();
  }
});

test("missing email configuration never dispatches; invalid origins cannot produce review links", () => {
  assert.equal(transactionalEmailSenderFromEnv({}).configured, false);
  const request = {
    id: randomUUID(),
    requesterId: accounts.requester,
    requesterEmail: "requester@example.test",
    status: "pending" as const,
    message: "",
    requestedAt: new Date().toISOString(),
    decidedAt: null,
    decidedBy: null,
  };
  const delivery = {
    id: randomUUID(),
    requestId: request.id,
    recipientEmail: "reviewer@example.test",
    kind: "review" as const,
    payload: null,
  };
  assert.throws(() =>
    betaEmailPayload(
      delivery,
      request,
      "beta@verified.test",
      "https://attacker.test/path",
    ),
  );
  assert.throws(() =>
    betaEmailPayload(
      delivery,
      request,
      "beta@verified.test",
      "https://user:secret@attacker.test/",
    ),
  );
});

test("the durable scheduler wakes only due email work and exposes no public delivery endpoint", async () => {
  let due = false,
    wakes = 0,
    lookups = 0;
  const fingerprint = "a".repeat(64);
  const source = fs
    .readFileSync(new URL("../worker/container.js", import.meta.url), "utf8")
    .replace(/^import .*;\r?$/gm, "")
    .replace("export class CoCreateContainer", "class CoCreateContainer")
    .replace("export default", "globalThis.worker=");
  const context = vm.createContext({
    Container: class {},
    env: {},
    Request,
    Response,
    AbortSignal,
    fetch: async () => {
      lookups++;
      return Response.json(due);
    },
    getContainer: () => ({
      fetch: async () => {
        wakes++;
        return Response.json({ release_fingerprint: fingerprint });
      },
    }),
  });
  vm.runInContext(source, context);
  const env = {
    RESEND_API_KEY: "re_synthetic",
    COCREATE_EMAIL_FROM: "beta@verified.test",
    SUPABASE_SECRET_KEY: "sb_secret_synthetic",
    SUPABASE_URL: "https://synthetic.supabase.co",
    COCREATE_RELEASE_FINGERPRINT: fingerprint,
  };
  await context.worker.scheduled({}, {});
  assert.equal(lookups, 0);
  await context.worker.scheduled({}, env);
  assert.equal(lookups, 1);
  assert.equal(wakes, 0);
  due = true;
  await context.worker.scheduled({}, env);
  assert.equal(wakes, 1);
  await assert.rejects(
    context.worker.scheduled(
      {},
      { ...env, COCREATE_RELEASE_FINGERPRINT: "b".repeat(64) },
    ),
    /still updating/,
  );
});
