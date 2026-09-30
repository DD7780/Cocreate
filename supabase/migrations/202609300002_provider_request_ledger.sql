begin;

create table if not exists public.project_provider_requests (
  project_id uuid not null references public.projects(id),
  call_id text not null,
  record jsonb not null,
  first_recorded_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key(project_id,call_id)
);
create index if not exists project_provider_requests_project_time_idx
  on public.project_provider_requests(project_id,first_recorded_at);
alter table public.project_provider_requests enable row level security;
revoke all on public.project_provider_requests from anon,authenticated;
grant select,insert,update on public.project_provider_requests to service_role;

-- Only the retained snapshot window is recoverable. Do not synthesize older calls.
insert into public.project_provider_requests(project_id,call_id,record)
select snapshot.project_id,call.value->>'callId',call.value
from public.project_snapshots snapshot
cross join lateral jsonb_array_elements(
  case when jsonb_typeof(snapshot.harness_state->'providerCalls') = 'array'
    then snapshot.harness_state->'providerCalls' else '[]'::jsonb end
) as call(value)
where nullif(call.value->>'callId','') is not null
  and call.value->>'workspaceId' = snapshot.project_id::text
on conflict(project_id,call_id) do nothing;

-- Reconciliations replace dispatches; a delayed dispatch never erases final usage.
create function public.record_project_provider_request(target_project_id uuid, target_call_id text, request_record jsonb)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if target_call_id = '' or request_record->>'callId' is distinct from target_call_id
    or request_record->>'workspaceId' is distinct from target_project_id::text then
    raise exception 'provider request identity mismatch';
  end if;
  insert into public.project_provider_requests(project_id,call_id,record)
  values(target_project_id,target_call_id,request_record)
  on conflict(project_id,call_id) do update
    set record = excluded.record, updated_at = now()
    where public.project_provider_requests.record->>'outcome' = 'dispatching'
       or excluded.record->>'outcome' <> 'dispatching';
end;
$$;
revoke all on function public.record_project_provider_request(uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.record_project_provider_request(uuid,text,jsonb) to service_role;

commit;
