-- Additive Step 02 hardening. Apply after coordinator fencing and provider ledger migrations.
begin;

create or replace function public.claim_workflow_coordinator(target_project_id uuid, target_owner_id uuid, expected_epoch bigint default null)
returns bigint language plpgsql security invoker set search_path = '' as $$
declare lease public.workflow_coordinator_leases; next_epoch bigint;
begin
  if target_project_id is null or target_owner_id is null then
    raise exception 'Project and coordinator owner are required' using errcode='22023';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('workflow:' || target_project_id::text, 0));
  select * into lease from public.workflow_coordinator_leases where project_id = target_project_id for update;
  if expected_epoch is not null then
    if lease.project_id is null or lease.owner_id is distinct from target_owner_id or lease.epoch is distinct from expected_epoch or lease.expires_at <= clock_timestamp() then
      raise exception 'Coordinator lease expired or was replaced' using errcode='40001';
    end if;
    update public.workflow_coordinator_leases set expires_at = clock_timestamp() + interval '30 seconds' where project_id = target_project_id;
    return lease.epoch;
  end if;
  if lease.expires_at > clock_timestamp() and lease.owner_id <> target_owner_id then
    raise exception 'Another coordinator owns this workflow' using errcode='55P03';
  end if;
  next_epoch := case when lease.owner_id = target_owner_id and lease.expires_at > clock_timestamp() then lease.epoch else coalesce(lease.epoch, 0) + 1 end;
  insert into public.workflow_coordinator_leases values (target_project_id, target_owner_id, next_epoch, clock_timestamp() + interval '30 seconds')
    on conflict (project_id) do update set owner_id=excluded.owner_id, epoch=excluded.epoch, expires_at=excluded.expires_at;
  return next_epoch;
end $$;

create or replace function public.release_workflow_coordinator(target_project_id uuid, target_owner_id uuid, expected_epoch bigint)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(hashtextextended('workflow:' || target_project_id::text, 0));
  update public.workflow_coordinator_leases set expires_at='epoch' where project_id=target_project_id and owner_id=target_owner_id and epoch=expected_epoch;
end $$;

create or replace function public.commit_workflow_snapshot(target_project_id uuid, target_owner_id uuid, expected_epoch bigint,
  target_revision bigint, target_yjs_state bytea, target_harness_state jsonb, target_content_hash text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare lease public.workflow_coordinator_leases; prior public.project_snapshots;
begin
  perform pg_advisory_xact_lock(hashtextextended('workflow:' || target_project_id::text, 0));
  select * into lease from public.workflow_coordinator_leases where project_id=target_project_id for update;
  if lease.project_id is null or lease.owner_id is distinct from target_owner_id or lease.epoch is distinct from expected_epoch or lease.expires_at<=clock_timestamp() then
    raise exception 'Stale coordinator cannot commit or promote' using errcode='40001';
  end if;
  select * into prior from public.project_snapshots where project_id=target_project_id for update;
  if target_revision is null or target_revision<0 or target_yjs_state is null or target_harness_state is null or target_content_hash is null then
    raise exception 'Invalid snapshot payload' using errcode='22023';
  end if;
  if prior.revision>target_revision or (prior.revision=target_revision and (prior.content_hash is distinct from target_content_hash or prior.yjs_state is distinct from target_yjs_state or prior.harness_state is distinct from target_harness_state)) then
    raise exception 'Snapshot revision is stale or conflicting' using errcode='22023';
  end if;
  if prior.revision=target_revision then return true; end if;
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

-- Every workflow writer takes the project advisory lock, then the lease row.
create function public.append_workflow_document_update(target_project_id uuid, target_owner_id uuid, expected_epoch bigint,
  target_sequence bigint, target_actor_id uuid, target_update_bytes bytea, target_update_hash text)
returns void language plpgsql security invoker set search_path = '' as $$
declare lease public.workflow_coordinator_leases; prior public.project_document_updates;
begin
  perform pg_advisory_xact_lock(hashtextextended('workflow:' || target_project_id::text, 0));
  select * into lease from public.workflow_coordinator_leases where project_id=target_project_id for update;
  if lease.project_id is null or lease.owner_id is distinct from target_owner_id or lease.epoch is distinct from expected_epoch or lease.expires_at<=clock_timestamp() then
    raise exception 'Stale coordinator cannot append updates' using errcode='40001';
  end if;
  if target_sequence is null or target_sequence<1 or target_actor_id is null or target_update_bytes is null or target_update_hash is null then
    raise exception 'Invalid update payload' using errcode='22023';
  end if;
  select * into prior from public.project_document_updates where project_id=target_project_id and sequence=target_sequence;
  if prior.project_id is not null then
    if prior.actor_id is distinct from target_actor_id or prior.update_bytes is distinct from target_update_bytes or prior.update_hash is distinct from target_update_hash then
      raise exception 'Conflicting document update sequence' using errcode='22023';
    end if;
    return;
  end if;
  insert into public.project_document_updates(project_id,sequence,actor_id,update_bytes,update_hash)
    values(target_project_id,target_sequence,target_actor_id,target_update_bytes,target_update_hash);
end $$;

create function public.record_workflow_provider_dispatch(target_project_id uuid, target_owner_id uuid, expected_epoch bigint,
  target_call_id text, request_record jsonb)
returns void language plpgsql security invoker set search_path = '' as $$
declare lease public.workflow_coordinator_leases;
begin
  perform pg_advisory_xact_lock(hashtextextended('workflow:' || target_project_id::text, 0));
  select * into lease from public.workflow_coordinator_leases where project_id=target_project_id for update;
  if lease.project_id is null or lease.owner_id is distinct from target_owner_id or lease.epoch is distinct from expected_epoch or lease.expires_at<=clock_timestamp() then
    raise exception 'Stale coordinator cannot dispatch' using errcode='40001';
  end if;
  if request_record->>'outcome' is distinct from 'dispatching' then
    raise exception 'Dispatch intent required' using errcode='22023';
  end if;
  perform public.record_project_provider_request(target_project_id,target_call_id,request_record);
end $$;

revoke execute on function public.append_workflow_document_update(uuid,uuid,bigint,bigint,uuid,bytea,text) from public,anon,authenticated;
revoke execute on function public.record_workflow_provider_dispatch(uuid,uuid,bigint,text,jsonb) from public,anon,authenticated;
grant execute on function public.append_workflow_document_update(uuid,uuid,bigint,bigint,uuid,bytea,text) to service_role;
grant execute on function public.record_workflow_provider_dispatch(uuid,uuid,bigint,text,jsonb) to service_role;

commit;
