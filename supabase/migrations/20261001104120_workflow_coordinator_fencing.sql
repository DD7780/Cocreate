-- Additive, server-only workflow ownership. Existing snapshots and projects stay intact.
create table public.workflow_coordinator_leases (
  project_id uuid primary key references public.projects(id) on delete cascade,
  owner_id uuid not null,
  epoch bigint not null check (epoch > 0),
  expires_at timestamptz not null
);
alter table public.workflow_coordinator_leases enable row level security;
revoke all on public.workflow_coordinator_leases from public, anon, authenticated;
grant all on public.workflow_coordinator_leases to service_role;

create function public.claim_workflow_coordinator(target_project_id uuid, target_owner_id uuid, expected_epoch bigint default null)
returns bigint language plpgsql security invoker set search_path = '' as $$
declare lease public.workflow_coordinator_leases; next_epoch bigint;
begin
  perform pg_advisory_xact_lock(hashtextextended('workflow:' || target_project_id::text, 0));
  select * into lease from public.workflow_coordinator_leases where project_id = target_project_id for update;
  if expected_epoch is not null then
    if lease.project_id is null or lease.owner_id <> target_owner_id or lease.epoch <> expected_epoch or lease.expires_at <= clock_timestamp() then
      raise exception 'Coordinator lease expired or was replaced';
    end if;
    update public.workflow_coordinator_leases set expires_at = clock_timestamp() + interval '30 seconds' where project_id = target_project_id;
    return lease.epoch;
  end if;
  if lease.expires_at > clock_timestamp() and lease.owner_id <> target_owner_id then
    raise exception 'Another coordinator owns this workflow';
  end if;
  next_epoch := case when lease.owner_id = target_owner_id and lease.expires_at > clock_timestamp() then lease.epoch else coalesce(lease.epoch, 0) + 1 end;
  insert into public.workflow_coordinator_leases values (target_project_id, target_owner_id, next_epoch, clock_timestamp() + interval '30 seconds')
    on conflict (project_id) do update set owner_id=excluded.owner_id, epoch=excluded.epoch, expires_at=excluded.expires_at;
  return next_epoch;
end $$;

create function public.release_workflow_coordinator(target_project_id uuid, target_owner_id uuid, expected_epoch bigint)
returns void language sql security invoker set search_path = '' as $$
  update public.workflow_coordinator_leases set expires_at='epoch' where project_id=target_project_id and owner_id=target_owner_id and epoch=expected_epoch;
$$;

create function public.commit_workflow_snapshot(target_project_id uuid, target_owner_id uuid, expected_epoch bigint,
  target_revision bigint, target_yjs_state bytea, target_harness_state jsonb, target_content_hash text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare lease public.workflow_coordinator_leases; prior public.project_snapshots;
begin
  perform pg_advisory_xact_lock(hashtextextended('workflow:' || target_project_id::text, 0));
  select * into lease from public.workflow_coordinator_leases where project_id=target_project_id for update;
  if lease.project_id is null or lease.owner_id<>target_owner_id or lease.epoch<>expected_epoch or lease.expires_at<=clock_timestamp() then
    raise exception 'Stale coordinator cannot commit or promote';
  end if;
  select * into prior from public.project_snapshots where project_id=target_project_id for update;
  if prior.revision>target_revision or (prior.revision=target_revision and prior.content_hash<>target_content_hash) then
    raise exception 'Snapshot revision is stale or conflicting';
  end if;
  insert into public.project_snapshots(project_id,revision,yjs_state,harness_state,content_hash,committed_at)
    values(target_project_id,target_revision,target_yjs_state,target_harness_state,target_content_hash,clock_timestamp())
    on conflict(project_id) do update set revision=excluded.revision,yjs_state=excluded.yjs_state,harness_state=excluded.harness_state,content_hash=excluded.content_hash,committed_at=excluded.committed_at;
  update public.projects set updated_at=clock_timestamp() where id=target_project_id;
  return true;
end $$;

revoke execute on function public.claim_workflow_coordinator(uuid,uuid,bigint) from public,anon,authenticated;
revoke execute on function public.release_workflow_coordinator(uuid,uuid,bigint) from public,anon,authenticated;
revoke execute on function public.commit_workflow_snapshot(uuid,uuid,bigint,bigint,bytea,jsonb,text) from public,anon,authenticated;
grant execute on function public.claim_workflow_coordinator(uuid,uuid,bigint) to service_role;
grant execute on function public.release_workflow_coordinator(uuid,uuid,bigint) to service_role;
grant execute on function public.commit_workflow_snapshot(uuid,uuid,bigint,bigint,bytea,jsonb,text) to service_role;
