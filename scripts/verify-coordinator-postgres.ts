/** Runs only against an explicitly named disposable, already-migrated local database. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
const connectionString = process.env.COCREATE_COORDINATOR_TEST_DATABASE_URL;
const owner = process.env.COCREATE_COORDINATOR_TEST_OWNER_ID;
if (!connectionString || !owner)
    throw new Error('Set COCREATE_COORDINATOR_TEST_DATABASE_URL and COCREATE_COORDINATOR_TEST_OWNER_ID for a disposable migrated local Supabase database. No SQL executed.');
const target = new URL(connectionString);
if (!['localhost', '127.0.0.1', '[::1]'].includes(target.hostname) || !target.pathname.endsWith('/coordinator_step02_test'))
    throw new Error('Only loopback database coordinator_step02_test is allowed. No SQL executed.');
if (!/^[0-9a-f-]{36}$/i.test(owner))
    throw new Error('Provide an existing synthetic auth.users UUID.');
const project = randomUUID(), ownerA = randomUUID(), ownerB = randomUUID(), checks: string[] = [];
let created = false;
const admin = new Client({ connectionString, connectionTimeoutMillis: 3000, query_timeout: 6000, application_name: 'coordinator-step02-audit' }), a = new Client({ connectionString, connectionTimeoutMillis: 3000, query_timeout: 6000, application_name: 'coordinator-step02-a' }), b = new Client({ connectionString, connectionTimeoutMillis: 3000, query_timeout: 6000, application_name: 'coordinator-step02-b' });
const sql = { claim: 'select public.claim_workflow_coordinator($1,$2,$3) as epoch', commit: 'select public.commit_workflow_snapshot($1,$2,$3,$4,$5,$6,$7) as committed', append: 'select public.append_workflow_document_update($1,$2,$3,$4,$5,$6,$7)', dispatch: 'select public.record_workflow_provider_dispatch($1,$2,$3,$4,$5)' };
const claim = async (client: Client, id: string, epoch: number | null) => Number((await client.query(sql.claim, [project, id, epoch])).rows[0].epoch);
const snapshot = (id: string, epoch: number, revision: number, body = 'fixture') => [project, id, epoch, revision, Buffer.from(body), { fixture: body }, 'a'.repeat(64)];
const rejects = async (work: Promise<unknown>, code: string) => assert.rejects(work, (error: {
    code?: string;
}) => error.code === code);
async function waitForLock(pid: number) {
    const until = Date.now() + 3000;
    while (Date.now() < until) {
        const result = await admin.query('select wait_event_type from pg_stat_activity where pid=$1', [pid]);
        if (result.rows[0]?.wait_event_type === 'Lock')
            return;
        await new Promise(resolve => setTimeout(resolve, 20));
    }
    throw new Error('Expected a real database lock wait, but none was observed.');
}
try {
    await Promise.all([admin.connect(), a.connect(), b.connect()]);
    for (const client of [a, b]) {
        await client.query("set statement_timeout='5s'");
        await client.query('set role service_role');
    }
    const pid = Number((await b.query('select pg_backend_pid() as pid')).rows[0].pid);
    await admin.query('insert into public.projects(id,owner_id,title) values($1,$2,$3)', [project, owner, 'Step 02 disposable contention fixture']);
    created = true;
    await a.query('begin');
    const epochA = await claim(a, ownerA, null);
    const competing = rejects(claim(b, ownerB, null), '55P03');
    await waitForLock(pid);
    await a.query('commit');
    await competing;
    checks.push('two-connection claim serialization: exactly one owner');
    assert.equal(await claim(a, ownerA, epochA), epochA);
    checks.push('renewal preserves epoch');
    await a.query(sql.commit, snapshot(ownerA, epochA, 1));
    const before = (await admin.query('select committed_at from public.project_snapshots where project_id=$1', [project])).rows[0].committed_at;
    await a.query(sql.commit, snapshot(ownerA, epochA, 1));
    assert.deepEqual((await admin.query('select committed_at from public.project_snapshots where project_id=$1', [project])).rows[0].committed_at, before);
    await rejects(a.query(sql.commit, snapshot(ownerA, epochA, 1, 'contradictory bytes with same claimed hash')), '22023');
    checks.push('identical revision replay is inert; conflicting bytes/JSON rejected even with same hash');
    await a.query(sql.append, [project, ownerA, epochA, 1, owner, Buffer.from('update'), 'b'.repeat(64)]);
    await a.query(sql.append, [project, ownerA, epochA, 1, owner, Buffer.from('update'), 'b'.repeat(64)]);
    await rejects(a.query(sql.append, [project, ownerA, epochA, 1, owner, Buffer.from('conflict'), 'b'.repeat(64)]), '22023');
    checks.push('document append replay and sequence collision');
    const record = { workspaceId: project, callId: 'synthetic-call', outcome: 'dispatching' };
    await a.query(sql.dispatch, [project, ownerA, epochA, record.callId, record]);
    checks.push('fenced provider intent recorded, no provider HTTP');
    await admin.query("update public.workflow_coordinator_leases set expires_at=clock_timestamp()-interval '1 second' where project_id=$1", [project]);
    await rejects(claim(a, ownerA, epochA), '40001');
    const epochB = await claim(b, ownerB, null);
    assert.ok(epochB > epochA);
    for (const work of [a.query(sql.commit, snapshot(ownerA, epochA, 2)), a.query(sql.append, [project, ownerA, epochA, 2, owner, Buffer.from('stale'), 'c'.repeat(64)]), a.query(sql.dispatch, [project, ownerA, epochA, 'stale-call', { ...record, callId: 'stale-call' }])])
        await rejects(work, '40001');
    await a.query('select public.release_workflow_coordinator($1,$2,$3)', [project, ownerA, epochA]);
    assert.equal(await claim(b, ownerB, epochB), epochB);
    checks.push('expired renewal, higher-epoch takeover, stale snapshot/update/dispatch and stale release');
    // The waiter begins while B owns the workflow. A takes over in the blocking transaction.
    await a.query('begin');
    await a.query("select pg_advisory_xact_lock(hashtextextended('workflow:'||$1::text,0))", [project]);
    await a.query("update public.workflow_coordinator_leases set expires_at=clock_timestamp()-interval '1 second' where project_id=$1", [project]);
    const next = await claim(a, ownerA, null);
    assert.ok(next > epochB);
    const staleCommit = rejects(b.query(sql.commit, snapshot(ownerB, epochB, 2)), '40001');
    await waitForLock(pid);
    await a.query('commit');
    await staleCommit;
    assert.equal(Number((await admin.query('select revision from public.project_snapshots where project_id=$1', [project])).rows[0].revision), 1);
    checks.push('blocked commit rechecks ownership after takeover, canonical snapshot unchanged');
    await a.query('begin');
    await a.query("select pg_advisory_xact_lock(hashtextextended('workflow:'||$1::text,0))", [project]);
    const blockedRenewal = rejects(claim(b, ownerA, next), '40001');
    await waitForLock(pid);
    await a.query("update public.workflow_coordinator_leases set expires_at=clock_timestamp()-interval '1 second' where project_id=$1", [project]);
    await a.query('commit');
    await blockedRenewal;
    checks.push('renewal rechecks expiry after waiting for the lock');
    for (const role of ['anon', 'authenticated']) {
        await b.query('reset role');
        await b.query(`set role ${role}`);
        await rejects(b.query(sql.claim, [project, ownerB, null]), '42501');
        await rejects(b.query(sql.commit, snapshot(ownerB, next, 2)), '42501');
        await rejects(b.query(sql.append, [project, ownerB, next, 2, owner, Buffer.from('denied'), 'd'.repeat(64)]), '42501');
        await rejects(b.query(sql.dispatch, [project, ownerB, next, 'denied', record]), '42501');
    }
    checks.push('anon/authenticated cannot invoke coordinator write RPCs');
    const output = 'artifacts/multiuser-step02/postgres-contention.json';
    fs.mkdirSync('artifacts/multiuser-step02', { recursive: true });
    fs.writeFileSync(output, JSON.stringify({ verifiedAt: new Date().toISOString(), scope: 'real disposable local Postgres; migrations pre-applied; synthetic project; no hosted runtime or provider HTTP', checks }, null, 2));
    console.log(JSON.stringify({ passed: checks.length, output }));
}
finally {
    await Promise.allSettled([a.query('rollback'), b.query('rollback')]);
    if (created) {
        await admin.query('delete from public.project_provider_requests where project_id=$1', [project]);
        await admin.query('delete from public.projects where id=$1 and title=$2', [project, 'Step 02 disposable contention fixture']);
    }
    await Promise.allSettled([a.end(), b.end(), admin.end()]);
}
