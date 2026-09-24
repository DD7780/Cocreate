import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { createSession, verifySession } from '../server/auth.js';
import { supabasePlatformFromEnv, supabasePlatformInternals } from '../server/supabase-platform.js';

test('project tickets are scoped and expire',()=>{
  const secret='synthetic-ticket-secret',valid=createSession(secret,{roomId:'project-a',participantId:'user-a',accountId:'user-a',name:'Test User',role:'editor',exp:Math.floor(Date.now()/1000)+60}),expired=createSession(secret,{roomId:'project-a',participantId:'user-a',name:'Test User',role:'editor',exp:Math.floor(Date.now()/1000)-1});
  assert.equal(verifySession(secret,valid)?.role,'editor');
  assert.equal(verifySession(secret,valid)?.roomId,'project-a');
  assert.equal(verifySession(secret,expired),null);
  assert.equal(verifySession('another-secret',valid),null);
});

test('hosted Supabase mode fails closed when the server secret is absent',()=>{
  const result=supabasePlatformFromEnv({COCREATE_HOSTED:'true',SUPABASE_URL:'https://example.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test'} as NodeJS.ProcessEnv);
  assert.equal(result.mode,'supabase');assert.equal(result.platform,null);assert.match(result.error||'',/SUPABASE_SECRET_KEY/);
});

test('invite tokens are hashed before persistence',()=>{
  const digest=supabasePlatformInternals.hashToken('synthetic-invite-token');
  assert.equal(digest.length,64);assert.equal(digest.includes('synthetic-invite-token'),false);
});

test('migration enables RLS and keeps authoritative runtime writes server-only',()=>{
  const sql=fs.readFileSync(new URL('../supabase/migrations/202609240001_projects_auth_persistence.sql',import.meta.url),'utf8');
  for(const table of ['projects','project_members','project_snapshots','project_document_updates','workflow_records','execution_runs','execution_events','artifact_versions'])assert.match(sql,new RegExp(`alter table public\\.${table} enable row level security`));
  assert.match(sql,/revoke all on all tables in schema public from anon, authenticated/);
  assert.doesNotMatch(sql,/grant insert[^;]*execution_runs to authenticated/i);
  assert.match(sql,/bucket_id = 'cocreate-artifacts'/);
});
