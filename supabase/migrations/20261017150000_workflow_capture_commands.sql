begin;

-- Canonical command journal; snapshots remain derived checkpoints.
create table public.workflow_capture_commands (
  cursor bigint generated always as identity primary key,
  project_id uuid not null references public.projects(id) on delete restrict,
  actor_id uuid not null references auth.users(id) on delete restrict,
  request_id text not null check (request_id ~ '^[A-Za-z0-9_-]{1,100}$'),
  payload_hash text not null check (payload_hash ~ '^[a-f0-9]{64}$'),
  submission_id uuid not null unique,
  command_record jsonb not null,
  committed_at timestamptz not null default clock_timestamp(),
  unique (project_id, actor_id, request_id)
);
create index workflow_capture_commands_project_order on public.workflow_capture_commands(project_id,cursor);
alter table public.workflow_capture_commands enable row level security;
revoke all on public.workflow_capture_commands from public,anon,authenticated;
grant select,insert on public.workflow_capture_commands to service_role;
grant usage,select on sequence public.workflow_capture_commands_cursor_seq to service_role;

create table public.workflow_capture_sources (
  project_id uuid not null references public.projects(id) on delete restrict,
  source_id text not null check(source_id ~ '^[A-Za-z0-9_-]{1,100}$'),
  actor_id uuid not null references auth.users(id) on delete restrict,
  source_hash text not null check(source_hash ~ '^[a-f0-9]{64}$'),
  primary key(project_id,source_id)
);
alter table public.workflow_capture_sources enable row level security;
revoke all on public.workflow_capture_sources from public,anon,authenticated;
grant select,insert on public.workflow_capture_sources to service_role;

create function public.commit_workflow_capture(target_project_id uuid,target_owner_id uuid,expected_epoch bigint,
  target_actor_id uuid,target_request_id text,target_payload_hash text,target_record jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare lease public.workflow_coordinator_leases; prior public.workflow_capture_commands; result public.workflow_capture_commands; source jsonb; existing_source public.workflow_capture_sources;
begin
  perform pg_advisory_xact_lock(hashtextextended('workflow:'||target_project_id::text,0));
  select * into lease from public.workflow_coordinator_leases where project_id=target_project_id for update;
  if lease.project_id is null or lease.owner_id is distinct from target_owner_id or lease.epoch is distinct from expected_epoch or lease.expires_at<=clock_timestamp() then
    raise exception 'Stale capture coordinator' using errcode='40001';
  end if;
  if not exists(select 1 from public.project_members where project_id=target_project_id and user_id=target_actor_id and role in ('owner','editor')) then
    raise exception 'Capture membership denied' using errcode='42501';
  end if;
  select * into prior from public.workflow_capture_commands where project_id=target_project_id and actor_id=target_actor_id and request_id=target_request_id;
  if found then
    if prior.payload_hash is distinct from target_payload_hash then raise exception 'Capture identity conflict' using errcode='22023'; end if;
    return prior.command_record||jsonb_build_object('cursor',prior.cursor);
  end if;
  if target_record is null or octet_length(target_record::text)>16777216 or target_record->>'payloadHash' is distinct from target_payload_hash
    or target_record#>>'{submission,participantId}' is distinct from target_actor_id::text
    or target_record#>>'{submission,requestId}' is distinct from target_request_id
    or target_record#>>'{submission,status}' is distinct from 'submitted' then
    raise exception 'Invalid capture record' using errcode='22023';
  end if;
  for source in select value from jsonb_array_elements(target_record#>'{submission,capturedChanges}') loop
    if source->>'sourceId' is not null then
      select * into existing_source from public.workflow_capture_sources where project_id=target_project_id and source_id=source->>'sourceId';
      if found and (existing_source.actor_id is distinct from target_actor_id or existing_source.source_hash is distinct from source->>'sourceHash') then
        raise exception 'Capture source identity conflict' using errcode='22023';
      end if;
      insert into public.workflow_capture_sources values(target_project_id,source->>'sourceId',target_actor_id,source->>'sourceHash') on conflict do nothing;
    end if;
  end loop;
  insert into public.workflow_capture_commands(project_id,actor_id,request_id,payload_hash,submission_id,command_record)
    values(target_project_id,target_actor_id,target_request_id,target_payload_hash,(target_record#>>'{submission,id}')::uuid,target_record)
    returning * into result;
  return result.command_record||jsonb_build_object('cursor',result.cursor);
end $$;

-- The same project lock makes an absent lookup definitive after an uncertain commit.
create function public.read_workflow_capture(target_project_id uuid,target_owner_id uuid,expected_epoch bigint,
  target_actor_id uuid,target_request_id text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare lease public.workflow_coordinator_leases; result public.workflow_capture_commands;
begin
  perform pg_advisory_xact_lock(hashtextextended('workflow:'||target_project_id::text,0));
  select * into lease from public.workflow_coordinator_leases where project_id=target_project_id for update;
  if lease.project_id is null or lease.owner_id is distinct from target_owner_id or lease.epoch is distinct from expected_epoch or lease.expires_at<=clock_timestamp() then
    raise exception 'Stale capture coordinator' using errcode='40001';
  end if;
  if not exists(select 1 from public.project_members where project_id=target_project_id and user_id=target_actor_id) then
    raise exception 'Capture membership denied' using errcode='42501';
  end if;
  select * into result from public.workflow_capture_commands where project_id=target_project_id and actor_id=target_actor_id and request_id=target_request_id;
  if not found then return null; end if;
  return result.command_record||jsonb_build_object('cursor',result.cursor);
end $$;

revoke execute on function public.commit_workflow_capture(uuid,uuid,bigint,uuid,text,text,jsonb) from public,anon,authenticated;
revoke execute on function public.read_workflow_capture(uuid,uuid,bigint,uuid,text) from public,anon,authenticated;
grant execute on function public.commit_workflow_capture(uuid,uuid,bigint,uuid,text,text,jsonb) to service_role;
grant execute on function public.read_workflow_capture(uuid,uuid,bigint,uuid,text) to service_role;
commit;
