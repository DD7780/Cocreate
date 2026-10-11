import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import { betaDatabase } from './fixtures/beta-database.js';
test('global preview reservation SQL denies client roles, fences coordinators and preserves uncertain locks across projects', async () => {
    const db = await betaDatabase();
    try {
        console.log(db.concurrentConnections ? 'Native PostgreSQL: independent preview reservation connections' : 'Embedded PostgreSQL: preview SQL permissions/transactions; native contention requires CI');
        await db.exec('create table public.projects(id uuid primary key); create table public.workflow_coordinator_leases(project_id uuid primary key,owner_id uuid not null,epoch bigint not null,expires_at timestamptz not null);');
        await db.exec(fs.readFileSync(new URL('../supabase/migrations/20261011013000_preview_target_reservations.sql', import.meta.url), 'utf8'));
        const projects = [randomUUID(), randomUUID()], owners = [randomUUID(), randomUUID()], plans = [randomUUID(), randomUUID()], key = 'a'.repeat(64);
        for (let i = 0; i < 2; i++) {
            await db.query('insert into public.projects values($1)', [projects[i]]);
            await db.query("insert into public.workflow_coordinator_leases values($1,$2,1,clock_timestamp()+interval '1 hour')", [projects[i], owners[i]]);
        }
        const invoke = (name: string, i: number, epoch = 1) => db.asRole('service_role', `select public.${name}($1,$2,$3,$4,$5) as result`, [key, projects[i], plans[i], owners[i], epoch]);
        for (const role of ['anon', 'authenticated'] as const) {
            await assert.rejects(db.asRole(role, 'select * from public.preview_target_reservations'), /permission denied/);
            await assert.rejects(db.asRole(role, 'select public.reserve_preview_target($1,$2,$3,$4,$5)', [key, projects[0], plans[0], owners[0], 1]), /permission denied/);
        }
        assert.equal((await invoke('reserve_preview_target', 0)).rows[0].result, true);
        assert.equal((await invoke('reserve_preview_target', 0)).rows[0].result, true);
        assert.equal((await invoke('reserve_preview_target', 1)).rows[0].result, false);
        await invoke('release_preview_target', 1);
        assert.equal((await invoke('reserve_preview_target', 1)).rows[0].result, false);
        await assert.rejects(invoke('release_preview_target', 0, 2), /coordinator unavailable/);
        await db.query("update public.workflow_coordinator_leases set expires_at='epoch' where project_id=$1", [projects[0]]);
        await assert.rejects(invoke('reserve_preview_target', 0), /coordinator unavailable/);
        assert.equal((await invoke('reserve_preview_target', 1)).rows[0].result, false);
        await db.query("update public.workflow_coordinator_leases set epoch=2,expires_at=clock_timestamp()+interval '1 hour' where project_id=$1", [projects[0]]);
        await invoke('release_preview_target', 0, 2);
        const results = db.concurrentConnections ? await Promise.all([invoke('reserve_preview_target', 0, 2), invoke('reserve_preview_target', 1)]) : [await invoke('reserve_preview_target', 0, 2), await invoke('reserve_preview_target', 1)];
        assert.equal(results.filter(r => r.rows[0].result === true).length, 1);
    }
    finally {
        await db.close();
    }
});
