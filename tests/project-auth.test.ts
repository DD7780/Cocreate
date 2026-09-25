import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { createSession, verifySession } from '../server/auth.js';
import { normalizeInviteEmail, normalizeProjectTitle, supabasePlatformFromEnv, supabasePlatformInternals } from '../server/supabase-platform.js';
import { invitationEmailSenderFromEnv } from '../server/invitation-email.js';
import { resolveSupabaseAuthConfig, safeLocalDestination } from '../src/auth-config.js';
import { completeOAuthCallback } from '../src/oauth-callback.js';

const deployedPublicEnv={
  VITE_COCREATE_APP_ORIGIN:'https://cocreate.susan981314271.workers.dev',
  VITE_SUPABASE_URL:'https://dnsapasubeoxxsgkiotw.supabase.co',
  VITE_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_synthetic',
};

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

test('server Supabase configuration rejects mismatched credentials and JWKS',()=>{
  const mismatch=`x.${Buffer.from(JSON.stringify({ref:'another-project'})).toString('base64url')}.x`,base={COCREATE_HOSTED:'true',SUPABASE_URL:'https://dnsapasubeoxxsgkiotw.supabase.co',SUPABASE_SECRET_KEY:'sb_secret_synthetic'};
  assert.match(supabasePlatformFromEnv({...base,SUPABASE_PUBLISHABLE_KEY:mismatch} as NodeJS.ProcessEnv).error||'',/different projects/);
  assert.match(supabasePlatformFromEnv({...base,SUPABASE_PUBLISHABLE_KEY:'sb_publishable_synthetic',SUPABASE_JWKS_URL:'https://another-project.supabase.co/auth/v1/.well-known/jwks.json'} as NodeJS.ProcessEnv).error||'',/does not match/);
});

test('public auth configuration is explicit and derives the Worker callback',()=>{
  const resolved=resolveSupabaseAuthConfig(deployedPublicEnv);
  assert.deepEqual(resolved.config,{
    url:deployedPublicEnv.VITE_SUPABASE_URL,
    publishableKey:deployedPublicEnv.VITE_SUPABASE_PUBLISHABLE_KEY,
    appOrigin:deployedPublicEnv.VITE_COCREATE_APP_ORIGIN,
    redirectTo:'https://cocreate.susan981314271.workers.dev/api/auth/callback',
  });
  assert.equal(resolved.error,null);
  assert.match(resolveSupabaseAuthConfig({}).error||'',/Missing build variables/);
  const mismatchedKey=`x.${Buffer.from(JSON.stringify({ref:'another-project'})).toString('base64url')}.x`;
  assert.match(resolveSupabaseAuthConfig({...deployedPublicEnv,VITE_SUPABASE_PUBLISHABLE_KEY:mismatchedKey}).error||'',/different projects/);
  assert.match(resolveSupabaseAuthConfig({...deployedPublicEnv,VITE_COCREATE_APP_ORIGIN:'https://example.com/path'}).error||'',/without a path/);
});

test('Wrangler uses matching server and Vite build-time Supabase configuration',()=>{
  const wrangler=JSON.parse(fs.readFileSync(new URL('../wrangler.jsonc',import.meta.url),'utf8'));
  const image=wrangler.containers[0].image_vars;
  assert.equal(image.VITE_SUPABASE_URL,wrangler.vars.SUPABASE_URL);
  assert.equal(image.VITE_SUPABASE_PUBLISHABLE_KEY,wrangler.vars.SUPABASE_PUBLISHABLE_KEY);
  assert.equal(image.VITE_COCREATE_APP_ORIGIN,wrangler.vars.COCREATE_APP_ORIGINS);
  assert.equal(image.VITE_COCREATE_APP_ORIGIN,'https://cocreate.susan981314271.workers.dev');
});

test('Google callback exchanges once, reports errors, and restores only local destinations',async()=>{
  let exchanges=0;
  assert.deepEqual(await completeOAuthCallback('?code=synthetic','/projects/123',async code=>{exchanges++;assert.equal(code,'synthetic');return{error:null}}),{status:'success',destination:'/projects/123'});
  assert.equal(exchanges,1);
  assert.equal((await completeOAuthCallback('?error=access_denied','/projects',async()=>{throw new Error('must not exchange')})).status,'denied');
  assert.equal((await completeOAuthCallback('','/projects',async()=>{throw new Error('must not exchange')})).status,'error');
  assert.equal((await completeOAuthCallback('?code=used','/projects',async()=>({error:{message:'Code already used'}}))).status,'error');
  assert.equal(safeLocalDestination('/projects/123?tab=canvas','/projects','https://cocreate.example'),'/projects/123?tab=canvas');
  assert.equal(safeLocalDestination('https://evil.example/steal','/projects','https://cocreate.example'),'/projects');
  assert.equal(safeLocalDestination('//evil.example/steal','/projects','https://cocreate.example'),'/projects');
});

test('auth source preserves Google and adds password, confirmation, and recovery flows',()=>{
  const source=fs.readFileSync(new URL('../src/ProjectApp.tsx',import.meta.url),'utf8');
  assert.match(source,/signInWithOAuth\(\{provider:'google'/);
  assert.match(source,/redirectTo:supabaseAuthCallbackUrl\(returnTo\)/);
  assert.match(source,/signInWithPassword/);
  assert.match(source,/auth\.signUp/);
  assert.match(source,/auth\.resend/);
  assert.match(source,/resetPasswordForEmail/);
  assert.match(source,/updateUser\(\{password/);
  assert.match(source,/location\.pathname==='\/api\/auth\/callback'/);
  assert.doesNotMatch(source,/provider:'twitch'|cocreate\.pages\.dev|amygxtdgjlphxaetqzkk/);
});

test('project names and invitation emails use canonical validation',()=>{
  assert.equal(normalizeProjectTitle('  Roadmap  '),'Roadmap');
  assert.throws(()=>normalizeProjectTitle('   '),/cannot be empty/);
  assert.throws(()=>normalizeProjectTitle('x'.repeat(121)),/120 characters/);
  assert.equal(normalizeInviteEmail('  PERSON@Example.COM '),'person@example.com');
  assert.throws(()=>normalizeInviteEmail('not-an-email'),/valid recipient/);
});

test('transactional invitation email is truthful and idempotent at the provider boundary',async()=>{
  const unconfigured=invitationEmailSenderFromEnv({} as NodeJS.ProcessEnv);
  assert.equal(unconfigured.configured,false);
  assert.equal((await unconfigured.send({invitationId:'i1',recipientEmail:'person@example.com',inviterName:'Owner',projectTitle:'Plan',role:'viewer',inviteUrl:'https://example.com/invite/token'})).state,'configuration_required');
  let request:{url:string;init:RequestInit}|undefined;
  const configured=invitationEmailSenderFromEnv({RESEND_API_KEY:'re_synthetic',COCREATE_EMAIL_FROM:'CoCreate <invites@example.com>'} as NodeJS.ProcessEnv,async(input,init)=>{request={url:String(input),init:init||{}};return new Response(JSON.stringify({id:'email_synthetic'}),{status:200,headers:{'Content-Type':'application/json'}})});
  const sent=await configured.send({invitationId:'i2',recipientEmail:'person@example.com',inviterName:'<Owner>',projectTitle:'Plan & Ship',role:'editor',inviteUrl:'https://example.com/invite/token'});
  assert.deepEqual(sent,{state:'sent',providerMessageId:'email_synthetic'});
  assert.equal(request?.url,'https://api.resend.com/emails');
  assert.equal((request?.init.headers as Record<string,string>)['Idempotency-Key'],'cocreate-project-invite-i2');
  const payload=JSON.parse(String(request?.init.body)) as {html:string};
  assert.doesNotMatch(payload.html,/<Owner>|Plan & Ship/);
  const failed=invitationEmailSenderFromEnv({RESEND_API_KEY:'re_synthetic',COCREATE_EMAIL_FROM:'invites@example.com'} as NodeJS.ProcessEnv,async()=>new Response(JSON.stringify({message:'synthetic rejection'}),{status:422,headers:{'Content-Type':'application/json'}}));
  assert.deepEqual(await failed.send({invitationId:'i3',recipientEmail:'person@example.com',inviterName:'Owner',projectTitle:'Plan',role:'viewer',inviteUrl:'https://example.com/invite/token'}),{state:'failed',error:'synthetic rejection'});
});

test('email invitation migration binds recipients and enforces sharing permissions',()=>{
  const sql=fs.readFileSync(new URL('../supabase/migrations/202609250001_email_invitations_and_sharing.sql',import.meta.url),'utf8');
  assert.match(sql,/recipient_email text/);
  assert.match(sql,/pm\.role = 'owner' or pm\.can_share/);
  assert.match(sql,/email_confirmed_at is not null/);
  assert.match(sql,/lower\(invite\.recipient_email\) <> verified_email/);
  assert.match(sql,/for update/);
  assert.match(sql,/on conflict \(project_id, user_id\) do update/);
  assert.match(sql,/grant execute on function public\.accept_project_invite\(text\) to authenticated/);
  const platform=fs.readFileSync(new URL('../server/supabase-platform.ts',import.meta.url),'utf8');
  assert.match(platform,/Only the owner can change your own project role/);
  assert.match(platform,/A viewer cannot grant editor access/);
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
