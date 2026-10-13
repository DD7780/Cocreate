import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { betaDatabase } from './fixtures/beta-database.js';

test('raw private Storage reads stay server-only even with another permissive SELECT policy', async () => {
  const db = await betaDatabase();
  try {
    await db.exec(`create schema storage;
      create table storage.objects(bucket_id text, name text);
      alter table storage.objects enable row level security;
      grant usage on schema storage to authenticated, service_role;
      grant select on storage.objects to authenticated, service_role;
      create policy permissive_fixture on storage.objects for select to authenticated using (true);
      insert into storage.objects values ('cocreate-artifacts','fixture/private'),('unrelated-bucket','fixture/unrelated');`);
    await db.exec(fs.readFileSync(new URL('../supabase/migrations/20261013084500_private_artifact_server_delivery.sql', import.meta.url), 'utf8'));
    assert.deepEqual((await db.asRole('authenticated', 'select bucket_id from storage.objects')).rows,
      [{ bucket_id: 'unrelated-bucket' }]);
    assert.equal((await db.asRole('service_role', "select name from storage.objects where bucket_id='cocreate-artifacts'")).rows[0].name, 'fixture/private');
    await assert.rejects(db.asRole('anon', 'select name from storage.objects'), /permission denied/);
  } finally { await db.close(); }
});
