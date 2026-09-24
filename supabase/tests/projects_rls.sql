begin;
select plan(10);

-- Synthetic identities and projects only. Run with `supabase test db`.
select tests.create_supabase_user('owner');
select tests.create_supabase_user('editor');
select tests.create_supabase_user('outsider');
select tests.authenticate_as('owner');
select lives_ok($$ select public.create_project('Synthetic project', 'developer') $$, 'authenticated user creates project and owner membership atomically');

select is((select count(*) from public.projects), 1::bigint, 'owner can read project');
select is((select count(*) from public.project_members), 1::bigint, 'owner can read membership');
select tests.authenticate_as('outsider');
select is((select count(*) from public.projects), 0::bigint, 'outsider cannot read project');
select is((select count(*) from public.project_members), 0::bigint, 'outsider cannot read memberships');
select throws_ok($$ insert into public.project_members(project_id,user_id,role) select id, auth.uid(), 'owner' from public.projects $$, '42501', null, 'browser cannot self-promote');
select throws_ok($$ insert into public.execution_runs(project_id,run_id,state) values (gen_random_uuid(),'forged','{}') $$, '42501', null, 'browser cannot forge runtime records');
select tests.authenticate_as('editor');
select is((select count(*) from public.projects), 0::bigint, 'uninvited editor cannot read project');
select tests.clear_authentication();
select is((select count(*) from public.projects), 0::bigint, 'anonymous user cannot read projects');
select is((select count(*) from storage.objects where bucket_id='cocreate-artifacts'), 0::bigint, 'anonymous user cannot list artifacts');

select * from finish();
rollback;
