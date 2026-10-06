begin;

-- Server-owned configuration, not JWT/user-editable metadata. An owner row is
-- seeded separately by the trusted database administrator before release.
create table public.beta_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_owner boolean not null default false,
  approved_at timestamptz not null default now(),
  revoked_at timestamptz
);
create table public.beta_waitlist (
  email text primary key check (email = lower(trim(email)) and length(email) <= 254),
  consent_version text not null check (consent_version = 'beta-updates-v1'),
  registered_at timestamptz not null default now()
);
create table public.beta_registration_attempts (
  bucket text primary key,
  attempts integer not null,
  expires_at timestamptz not null
);
alter table public.beta_access enable row level security;
alter table public.beta_waitlist enable row level security;
alter table public.beta_registration_attempts enable row level security;
revoke all on public.beta_access, public.beta_waitlist, public.beta_registration_attempts from public, anon, authenticated;
grant select, insert, update, delete on public.beta_access, public.beta_waitlist, public.beta_registration_attempts to service_role;

create schema if not exists private;
create function private.has_beta_access() returns boolean
language sql stable security definer set search_path = '' as $$
  select (select auth.uid()) is not null and exists (
    select 1 from public.beta_access
    where user_id = (select auth.uid()) and (is_owner or revoked_at is null)
  );
$$;
revoke all on function private.has_beta_access() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.has_beta_access() to authenticated;

-- Restrictive policies narrow existing membership/role policies; they grant
-- no project authority. Explicitly enumerate application tables only.
do $$ declare table_name text; begin
  foreach table_name in array array[
    'profiles','projects','project_members','project_invites','project_snapshots',
    'project_document_updates','workflow_records','workflow_tasks','execution_runs',
    'execution_events','model_config_references','usage_history','artifact_versions',
    'managed_credit_accounts','project_managed_funding','project_managed_spenders',
    'managed_provider_requests','project_provider_requests','project_persistence_quarantine',
    'workflow_coordinator_leases'
  ] loop
    if to_regclass('public.' || table_name) is not null then
      execute format('create policy beta_access_required on public.%I as restrictive for all to authenticated using ((select private.has_beta_access())) with check ((select private.has_beta_access()))', table_name);
    end if;
  end loop;
end $$;

create or replace function public.is_project_member(target_project_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select private.has_beta_access() and exists (
    select 1 from public.project_members pm
    where pm.project_id = target_project_id and pm.user_id = (select auth.uid())
  );
$$;
create or replace function public.current_project_role(target_project_id uuid)
returns public.project_role language sql stable security definer set search_path = '' as $$
  select pm.role from public.project_members pm
  where private.has_beta_access() and pm.project_id = target_project_id and pm.user_id = (select auth.uid());
$$;
create policy beta_artifact_access_required on storage.objects as restrictive
for all to authenticated
using (bucket_id <> 'cocreate-artifacts' or (select private.has_beta_access()))
with check (bucket_id <> 'cocreate-artifacts' or (select private.has_beta_access()));

-- SECURITY DEFINER RPCs bypass table RLS: gate before any durable side effect.
create or replace function public.create_project(project_title text default 'Untitled project', project_mode text default 'developer')
returns public.projects language plpgsql security definer set search_path = '' as $$
declare created public.projects;
begin
  if not private.has_beta_access() then raise exception 'beta access pending' using errcode = '42501'; end if;
  if project_mode <> 'developer' then raise exception 'new projects support software building only'; end if;
  insert into public.profiles(id,display_name,avatar_url)
  values(auth.uid(),coalesce(auth.jwt()->'user_metadata'->>'full_name',''),auth.jwt()->'user_metadata'->>'avatar_url')
  on conflict(id) do update set display_name=excluded.display_name,avatar_url=excluded.avatar_url,updated_at=now();
  insert into public.projects(owner_id,title,workflow_mode)
  values(auth.uid(),left(coalesce(nullif(trim(project_title),''),'Untitled project'),120),'developer') returning * into created;
  insert into public.project_members(project_id,user_id,role) values(created.id,auth.uid(),'owner');
  return created;
end $$;
create or replace function public.accept_project_invite(invite_hash text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare invite public.project_invites; verified_email text;
begin
  if not private.has_beta_access() then raise exception 'beta access pending' using errcode = '42501'; end if;
  select lower(email) into verified_email from auth.users where id = auth.uid() and email_confirmed_at is not null;
  if verified_email is null then raise exception 'verified email required'; end if;
  select * into invite from public.project_invites where token_hash = invite_hash for update;
  if invite.id is null then raise exception 'invitation unavailable'; end if;
  if invite.accepted_at is not null and invite.accepted_by = auth.uid() then return invite.project_id; end if;
  if invite.revoked_at is not null or invite.accepted_at is not null or invite.expires_at <= now() then raise exception 'invitation invalid, expired, revoked, or already used'; end if;
  if invite.recipient_email is null or lower(invite.recipient_email) <> verified_email then raise exception 'invitation belongs to another verified email' using errcode = '42501'; end if;
  insert into public.project_members(project_id,user_id,role) values(invite.project_id,auth.uid(),invite.intended_role) on conflict(project_id,user_id) do nothing;
  update public.project_invites set accepted_by=auth.uid(),accepted_at=now() where id=invite.id;
  return invite.project_id;
end $$;
revoke all on function public.create_project(text,text), public.accept_project_invite(text), public.is_project_member(uuid), public.current_project_role(uuid) from public, anon;
grant execute on function public.create_project(text,text), public.accept_project_invite(text), public.is_project_member(uuid), public.current_project_role(uuid) to authenticated;

-- Atomic private registration + durable fixed-window rate limiting, surviving
-- container replacement. No account lookup, account creation or email dispatch.
create function public.register_beta_waitlist(registration_email text, client_key text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare current_time timestamptz := clock_timestamp(); window_id bigint; count_now integer; key_now text; maximum integer; period integer;
begin
  if registration_email <> lower(trim(registration_email)) or length(registration_email)>254 or registration_email ~ '[[:cntrl:]]' or registration_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or client_key !~ '^[a-f0-9]{64}$' then raise exception 'invalid registration'; end if;
  delete from public.beta_registration_attempts where expires_at <= current_time;
  for period, maximum in values (3600,500),(900,5) loop
    window_id := floor(extract(epoch from current_time)/period);
    key_now := case when period=3600 then 'global' else client_key end || ':' || window_id;
    count_now := null;
    insert into public.beta_registration_attempts(bucket,attempts,expires_at)
    values(key_now,1,to_timestamp((window_id+1)*period))
    on conflict(bucket) do update set attempts=public.beta_registration_attempts.attempts+1
      where public.beta_registration_attempts.attempts < maximum
    returning attempts into count_now;
    if count_now is null then return false; end if;
  end loop;
  insert into public.beta_waitlist(email,consent_version) values(registration_email,'beta-updates-v1') on conflict(email) do nothing;
  return true;
end $$;
revoke all on function public.register_beta_waitlist(text,text) from public, anon, authenticated;
grant execute on function public.register_beta_waitlist(text,text) to service_role;
commit;
