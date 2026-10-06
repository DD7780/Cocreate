-- Prepared pgTAP checks. Run only against an authorized disposable local DB
-- after the complete migration history; this transaction rolls back its fixtures.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path=public,extensions;
select plan(12);
select ok(not has_table_privilege('anon','public.beta_waitlist','select'), 'anonymous cannot read registrations');
select ok(not has_table_privilege('authenticated','public.beta_waitlist','select'), 'accounts cannot read registrations');
select ok(not has_table_privilege('authenticated','public.beta_access','insert'), 'accounts cannot approve themselves');
select ok(not has_function_privilege('anon','public.register_beta_waitlist(text,text)','execute'), 'registration RPC is server-only');
select ok(not has_function_privilege('authenticated','public.register_beta_waitlist(text,text)','execute'), 'accounts cannot bypass HTTP abuse checks');
select ok(has_function_privilege('service_role','public.register_beta_waitlist(text,text)','execute'), 'server can register');
insert into auth.users(id,email,email_confirmed_at) values
  ('00000000-0000-4000-8000-000000000001','owner@beta-fixture.invalid',now()),
  ('00000000-0000-4000-8000-000000000002','approved@beta-fixture.invalid',now()),
  ('00000000-0000-4000-8000-000000000003','pending@beta-fixture.invalid',now());
insert into public.beta_access(user_id,is_owner,revoked_at) values
  ('00000000-0000-4000-8000-000000000001',true,now()),
  ('00000000-0000-4000-8000-000000000002',false,null);
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000003',true);
set local role authenticated;
select is(private.has_beta_access(),false,'pending identity is denied');
select throws_ok($$select public.create_project('Denied fixture','developer')$$,'42501','beta access pending','direct create RPC is denied');
select throws_ok($$select public.accept_project_invite('retained-fixture-token')$$,'42501','beta access pending','invitation fails before token consumption');
reset role;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',true);
set local role authenticated;
select is(private.has_beta_access(),true,'configured owner retains access');
reset role;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000002',true);
set local role authenticated;
select is(private.has_beta_access(),true,'approved identity has beta permission');
reset role;
update public.beta_access set revoked_at=now() where user_id='00000000-0000-4000-8000-000000000002';
set local role authenticated;
select is(private.has_beta_access(),false,'revocation is read afresh without JWT refresh');
reset role;
select * from finish();
rollback;
