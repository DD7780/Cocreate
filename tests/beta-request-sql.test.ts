import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  betaAccounts as accounts,
  betaDatabase,
} from "./fixtures/beta-database.js";

test("beta request SQL enforces identity, privacy, pending uniqueness, atomic decisions and revocation", async () => {
  const db = await betaDatabase();
  try {
    console.log(
      db.concurrentConnections
        ? "Native PostgreSQL: independent concurrent connections"
        : "Embedded PostgreSQL: transaction semantics; native contention is a separate CI check",
    );
    const submit = (id: string, message = "") =>
      db.asRole(
        "service_role",
        "select * from public.request_beta_access($1,$2)",
        [id, message],
      );
    const decide = (id: string, requestId: string, decision: string) =>
      db.asRole(
        "service_role",
        "select * from public.decide_beta_access($1,$2,$3)",
        [id, requestId, decision],
      );
    await assert.rejects(submit(accounts.unconfirmed), /confirmed email/);
    await assert.rejects(submit(randomUUID()), /confirmed email/);
    await assert.rejects(submit(accounts.requester, "a".repeat(1001)), /1000/);
    for (const role of ["anon", "authenticated"] as const) {
      await assert.rejects(
        db.asRole(role, "select * from public.beta_access_requests"),
        /permission denied/,
      );
      await assert.rejects(
        db.asRole(role, "select * from public.beta_reviewers"),
        /permission denied/,
      );
      await assert.rejects(
        db.asRole(role, "select * from public.beta_email_deliveries"),
        /permission denied/,
      );
      await assert.rejects(
        db.asRole(role, "select * from public.request_beta_access($1,$2)", [
          accounts.requester,
          "",
        ]),
        /permission denied/,
      );
      await assert.rejects(
        db.asRole(role, "select private.beta_confirmed_email($1)", [
          accounts.requester,
        ]),
        /permission denied/,
      );
    }
    const requests = await Promise.all([
      submit(accounts.requester, "First message"),
      submit(accounts.requester, "Repeated message"),
    ]);
    const first = requests[0].rows[0];
    assert.equal(requests[1].rows[0].id, first.id);
    assert.equal(requests[1].rows[0].message, first.message);
    assert.ok(["First message", "Repeated message"].includes(first.message));
    assert.equal(
      Number(
        (await db.query("select count(*) n from public.beta_access_requests"))
          .rows[0].n,
      ),
      1,
    );
    assert.equal(
      Number(
        (await db.query("select count(*) n from public.beta_email_deliveries"))
          .rows[0].n,
      ),
      2,
    );
    await assert.rejects(
      db.query(
        "insert into public.beta_access_requests(requester_id,requester_email) values($1,'requester@example.test')",
        [accounts.requester],
      ),
      /duplicate key/,
    );
    await assert.rejects(
      decide(accounts.other, first.id, "approved"),
      /reviewer permission/,
    );
    await assert.rejects(
      decide(accounts.requester, first.id, "approved"),
      /reviewer permission/,
    );
    const decisions = await Promise.all([
      decide(accounts.founder, first.id, "approved"),
      decide(accounts.cofounder, first.id, "declined"),
    ]);
    assert.equal(decisions[0].rows[0].status, decisions[1].rows[0].status);
    const result = decisions[0].rows[0];
    const access = (
      await db.query("select * from public.beta_access where user_id=$1", [
        accounts.requester,
      ])
    ).rows;
    assert.equal(access.length, result.status === "approved" ? 1 : 0);
    if (access.length) assert.equal(access[0].is_owner, false);
    assert.equal(
      Number(
        (
          await db.query(
            "select count(*) n from public.beta_email_deliveries where kind<>$1",
            ["review"],
          )
        ).rows[0].n,
      ),
      1,
    );
    assert.equal(
      (await decide(accounts.cofounder, first.id, "approved")).rows[0].status,
      result.status,
    );
    assert.equal(
      Number(
        (await db.query("select count(*) n from public.beta_email_deliveries"))
          .rows[0].n,
      ),
      3,
    );
    if (result.status === "approved") {
      await db.query(
        "update public.beta_access set revoked_at=now() where user_id=$1",
        [accounts.requester],
      );
      await assert.rejects(submit(accounts.requester), /revoked/);
      await decide(accounts.founder, first.id, "approved");
      assert.ok(
        (
          await db.query(
            "select revoked_at from public.beta_access where user_id=$1",
            [accounts.requester],
          )
        ).rows[0].revoked_at,
      );
    }
    const second = (await submit(accounts.other, "Resubmit test")).rows[0];
    await decide(accounts.cofounder, second.id, "declined");
    assert.equal(
      (
        await db.query("select * from public.beta_access where user_id=$1", [
          accounts.other,
        ])
      ).rows.length,
      0,
    );
    await assert.rejects(submit(accounts.other), /seven days/);
    await db.query(
      "update public.beta_access_requests set decided_at=now()-interval '8 days' where id=$1",
      [second.id],
    );
    const third = (await submit(accounts.other, "New message")).rows[0];
    assert.notEqual(third.id, second.id);
    assert.equal(
      (
        await db.query(
          "select count(*)::int n from public.beta_access_requests where requester_id=$1",
          [accounts.other],
        )
      ).rows[0].n,
      2,
    );
    await db.query(
      "insert into public.beta_access(user_id,revoked_at) values($1,now())",
      [accounts.other],
    );
    await assert.rejects(
      decide(accounts.founder, third.id, "approved"),
      /revoked/,
    );
    assert.equal(
      (
        await db.query(
          "select status from public.beta_access_requests where id=$1",
          [third.id],
        )
      ).rows[0].status,
      "pending",
    );
    // Force a downstream failure: ordinary access insertion and the decision both roll back.
    await db.query("delete from public.beta_access where user_id=$1", [
      accounts.other,
    ]);
    await db.exec(
      "create function public.test_reject_notification() returns trigger language plpgsql as $$ begin if new.kind='approved' then raise exception 'synthetic outbox failure'; end if; return new; end $$; create trigger test_reject_notification before insert on public.beta_email_deliveries for each row execute function public.test_reject_notification();",
    );
    await assert.rejects(
      decide(accounts.founder, third.id, "approved"),
      /synthetic outbox failure/,
    );
    assert.equal(
      (
        await db.query("select * from public.beta_access where user_id=$1", [
          accounts.other,
        ])
      ).rows.length,
      0,
    );
    assert.equal(
      (
        await db.query(
          "select status from public.beta_access_requests where id=$1",
          [third.id],
        )
      ).rows[0].status,
      "pending",
    );
    await db.exec(
      "drop trigger test_reject_notification on public.beta_email_deliveries; drop function public.test_reject_notification();",
    );
    // Even a reviewer UUID cannot decide its own historical request.
    const own = (
      await db.query(
        "insert into public.beta_access_requests(requester_id,requester_email) values($1,'founder@example.test') returning id",
        [accounts.founder],
      )
    ).rows[0];
    await assert.rejects(
      decide(accounts.founder, own.id, "approved"),
      /own request/,
    );
    await db.query(
      "update public.beta_reviewers set revoked_at=now() where user_id=$1",
      [accounts.cofounder],
    );
    await assert.rejects(
      decide(accounts.cofounder, third.id, "approved"),
      /reviewer permission/,
    );
  } finally {
    await db.close();
  }
});

test("durable email leases freeze payload, fence stale workers, bound retries and stop before idempotency expiry", async () => {
  const db = await betaDatabase();
  try {
    await db.asRole(
      "service_role",
      "select * from public.request_beta_access($1,$2)",
      [accounts.requester, "Outbox test"],
    );
    const claim = (lease: string) =>
      db.asRole("service_role", "select * from public.claim_beta_email($1)", [
        lease,
      ]);
    const lease = randomUUID(),
      row = (await claim(lease)).rows[0];
    assert.equal(row.attempts, 1);
    const payload = {
      from: "beta@verified.test",
      to: ["reviewer@example.test"],
      subject: "Review",
      html: "<p>Review</p>",
      text: "Review",
    };
    const prepare = (token: string, body: unknown) =>
      db.asRole(
        "service_role",
        "select public.prepare_beta_email($1,$2,$3) payload",
        [row.id, token, JSON.stringify(body)],
      );
    const finish = (token: string, id: string | null) =>
      db.asRole(
        "service_role",
        "select public.finish_beta_email($1,$2,$3,$4) saved",
        [row.id, token, id, id ? null : "Synthetic failure"],
      );
    assert.deepEqual((await prepare(lease, payload)).rows[0].payload, payload);
    assert.equal((await finish(lease, null)).rows[0].saved, true);
    await db.query(
      "update public.beta_email_deliveries set next_attempt_at=now() where id=$1",
      [row.id],
    );
    const next = randomUUID();
    await claim(next);
    assert.equal(
      (await finish(lease, "stale-provider-id")).rows[0].saved,
      false,
    );
    assert.deepEqual(
      (await prepare(next, { ...payload, from: "changed@verified.test" }))
        .rows[0].payload,
      payload,
    );
    assert.equal((await finish(next, "accepted-once")).rows[0].saved, true);
    assert.equal(
      (
        await db.query(
          "select state,provider_message_id from public.beta_email_deliveries where id=$1",
          [row.id],
        )
      ).rows[0].state,
      "sent",
    );
    await db.query(
      "update public.beta_email_deliveries set attempts=5,first_attempt_at=now()-interval '25 hours' where state<>'sent'",
    );
    assert.equal((await claim(randomUUID())).rows.length, 0);
    assert.equal(
      (
        await db.query(
          "select state from public.beta_email_deliveries where id<>$1",
          [row.id],
        )
      ).rows[0].state,
      "failed",
    );
  } finally {
    await db.close();
  }
});
