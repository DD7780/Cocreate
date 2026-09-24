begin;

create extension if not exists pgcrypto;

create type public.project_role as enum ('owner', 'editor', 'viewer');
create type public.artifact_state as enum ('pending', 'finalized', 'failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  legacy_room_id text unique,
  owner_id uuid not null references auth.users(id),
  title text not null default 'Untitled project' check (char_length(title) between 1 and 120),
  workflow_mode text not null default 'developer' check (workflow_mode in ('developer', 'analyst', 'researcher')),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.project_role not null,
  joined_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table public.project_invites (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  token_hash text not null unique,
  intended_role public.project_role not null check (intended_role <> 'owner'),
  created_by uuid not null references auth.users(id),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  accepted_by uuid references auth.users(id),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.project_snapshots (
  project_id uuid primary key references public.projects(id) on delete cascade,
  revision bigint not null default 0,
  yjs_state bytea not null default ''::bytea,
  harness_state jsonb not null default '{}'::jsonb,
  content_hash text not null,
  committed_at timestamptz not null default now()
);

create table public.project_document_updates (
  project_id uuid not null references public.projects(id) on delete cascade,
  sequence bigint not null,
  actor_id uuid references auth.users(id),
  update_bytes bytea not null,
  update_hash text not null,
  created_at timestamptz not null default now(),
  primary key (project_id, sequence),
  unique (project_id, update_hash)
);

create table public.workflow_records (
  project_id uuid primary key references public.projects(id) on delete cascade,
  workflow_id text not null,
  phase text not null,
  revision bigint not null,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.workflow_tasks (
  project_id uuid not null references public.projects(id) on delete cascade,
  task_id text not null,
  state jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (project_id, task_id)
);

create table public.execution_runs (
  project_id uuid not null references public.projects(id) on delete cascade,
  run_id text not null,
  state jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (project_id, run_id)
);

create table public.execution_events (
  project_id uuid not null references public.projects(id) on delete cascade,
  sequence bigint not null,
  event_id text not null,
  summary jsonb not null,
  occurred_at timestamptz not null,
  primary key (project_id, sequence),
  unique (project_id, event_id)
);

create table public.model_config_references (
  project_id uuid not null references public.projects(id) on delete cascade,
  config_id text not null,
  encrypted_reference jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (project_id, config_id)
);

create table public.usage_history (
  project_id uuid not null references public.projects(id) on delete cascade,
  run_id text not null,
  normalized_usage jsonb not null,
  pricing_version text,
  recorded_at timestamptz not null default now(),
  primary key (project_id, run_id)
);

create table public.artifact_versions (
  project_id uuid not null references public.projects(id) on delete cascade,
  revision bigint not null,
  storage_path text not null,
  content_hash text not null,
  state public.artifact_state not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  finalized_at timestamptz,
  primary key (project_id, revision),
  unique (storage_path)
);

create index project_members_user_recent_idx on public.project_members(user_id, joined_at desc);
create index projects_updated_idx on public.projects(updated_at desc);
create index document_updates_project_sequence_idx on public.project_document_updates(project_id, sequence);
create index execution_events_project_sequence_idx on public.execution_events(project_id, sequence);

create or replace function public.is_project_member(target_project_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.project_members pm
    where pm.project_id = target_project_id and pm.user_id = (select auth.uid())
  );
$$;

create or replace function public.current_project_role(target_project_id uuid)
returns public.project_role language sql stable security definer set search_path = '' as $$
  select pm.role from public.project_members pm
  where pm.project_id = target_project_id and pm.user_id = (select auth.uid());
$$;

revoke all on function public.is_project_member(uuid) from public;
revoke all on function public.current_project_role(uuid) from public;
grant execute on function public.is_project_member(uuid), public.current_project_role(uuid) to authenticated;

create or replace function public.create_project(project_title text default 'Untitled project', project_mode text default 'developer')
returns public.projects language plpgsql security definer set search_path = '' as $$
declare created public.projects;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if project_mode not in ('developer', 'analyst', 'researcher') then raise exception 'invalid workflow mode'; end if;
  insert into public.profiles(id, display_name, avatar_url)
  values (auth.uid(), coalesce(auth.jwt()->'user_metadata'->>'full_name', ''), auth.jwt()->'user_metadata'->>'avatar_url')
  on conflict (id) do update set display_name = excluded.display_name, avatar_url = excluded.avatar_url, updated_at = now();
  insert into public.projects(owner_id, title, workflow_mode)
  values (auth.uid(), left(coalesce(nullif(trim(project_title), ''), 'Untitled project'), 120), project_mode)
  returning * into created;
  insert into public.project_members(project_id, user_id, role) values (created.id, auth.uid(), 'owner');
  return created;
end;
$$;

create or replace function public.accept_project_invite(invite_hash text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare invite public.project_invites;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  select * into invite from public.project_invites
  where token_hash = invite_hash and revoked_at is null and accepted_at is null and expires_at > now()
  for update;
  if invite.id is null then raise exception 'invite invalid, expired, revoked, or already used'; end if;
  insert into public.project_members(project_id, user_id, role)
  values (invite.project_id, auth.uid(), invite.intended_role)
  on conflict (project_id, user_id) do nothing;
  update public.project_invites set accepted_by = auth.uid(), accepted_at = now() where id = invite.id;
  return invite.project_id;
end;
$$;

revoke all on function public.create_project(text, text), public.accept_project_invite(text) from public;
grant execute on function public.create_project(text, text), public.accept_project_invite(text) to authenticated;

create or replace function public.protect_project_identity()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.id <> old.id or new.owner_id <> old.owner_id then raise exception 'project identity is immutable'; end if;
  new.updated_at := now();
  return new;
end;
$$;
create trigger protect_project_identity before update on public.projects for each row execute function public.protect_project_identity();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.project_invites enable row level security;
alter table public.project_snapshots enable row level security;
alter table public.project_document_updates enable row level security;
alter table public.workflow_records enable row level security;
alter table public.workflow_tasks enable row level security;
alter table public.execution_runs enable row level security;
alter table public.execution_events enable row level security;
alter table public.model_config_references enable row level security;
alter table public.usage_history enable row level security;
alter table public.artifact_versions enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, update on public.projects to authenticated;
grant select on public.project_members, public.project_snapshots, public.project_document_updates,
  public.workflow_records, public.workflow_tasks, public.execution_runs, public.execution_events,
  public.model_config_references, public.usage_history, public.artifact_versions to authenticated;
grant select, insert, update on public.project_invites to authenticated;

create policy profiles_self_select on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy profiles_self_update on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy projects_member_select on public.projects for select to authenticated using (public.is_project_member(id));
create policy projects_owner_update on public.projects for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy members_member_select on public.project_members for select to authenticated using (public.is_project_member(project_id));
create policy invites_owner_select on public.project_invites for select to authenticated using (public.current_project_role(project_id) = 'owner');
create policy invites_owner_insert on public.project_invites for insert to authenticated with check (public.current_project_role(project_id) = 'owner' and created_by = (select auth.uid()) and intended_role <> 'owner');
create policy invites_owner_update on public.project_invites for update to authenticated using (public.current_project_role(project_id) = 'owner') with check (public.current_project_role(project_id) = 'owner' and intended_role <> 'owner');

create policy snapshots_member_select on public.project_snapshots for select to authenticated using (public.is_project_member(project_id));
create policy updates_member_select on public.project_document_updates for select to authenticated using (public.is_project_member(project_id));
create policy workflow_member_select on public.workflow_records for select to authenticated using (public.is_project_member(project_id));
create policy tasks_member_select on public.workflow_tasks for select to authenticated using (public.is_project_member(project_id));
create policy runs_member_select on public.execution_runs for select to authenticated using (public.is_project_member(project_id));
create policy events_member_select on public.execution_events for select to authenticated using (public.is_project_member(project_id));
create policy configs_owner_select on public.model_config_references for select to authenticated using (public.current_project_role(project_id) = 'owner');
create policy usage_member_select on public.usage_history for select to authenticated using (public.is_project_member(project_id));
create policy artifacts_member_select on public.artifact_versions for select to authenticated using (public.is_project_member(project_id) and state = 'finalized');

insert into storage.buckets(id, name, public) values ('cocreate-artifacts', 'cocreate-artifacts', false)
on conflict (id) do update set public = false;

create or replace function public.storage_project_id(object_name text)
returns uuid language plpgsql immutable set search_path = '' as $$
begin
  return split_part(object_name, '/', 1)::uuid;
exception when invalid_text_representation then
  return null;
end;
$$;
revoke all on function public.storage_project_id(text) from public;
grant execute on function public.storage_project_id(text) to authenticated;

create policy artifact_objects_member_select on storage.objects for select to authenticated using (
  bucket_id = 'cocreate-artifacts'
  and public.is_project_member(public.storage_project_id(name))
);

commit;
