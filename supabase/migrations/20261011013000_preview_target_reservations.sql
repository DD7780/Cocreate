-- Prepared only. Apply to the authorized hosted target before enabling preview uploads.
-- Non-expiring reservations deliberately survive crashes and uncertain provider outcomes.
create table if not exists public.preview_target_reservations (
  target_key text primary key check(target_key ~ '^[a-f0-9]{64}$'),
  project_id uuid not null references public.projects(id),
  plan_id uuid not null
);
alter table public.preview_target_reservations enable row level security;
revoke all on public.preview_target_reservations from public,anon,authenticated;

create or replace function public.reserve_preview_target(target_key text,target_project_id uuid,target_plan_id uuid,target_owner_id uuid,expected_epoch bigint)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare lease public.workflow_coordinator_leases; prior public.preview_target_reservations;
begin
  select * into lease from public.workflow_coordinator_leases where project_id=target_project_id for update;
  if not found or lease.owner_id<>target_owner_id or lease.epoch<>expected_epoch or lease.expires_at<=clock_timestamp() then raise exception 'coordinator unavailable'; end if;
  insert into public.preview_target_reservations values(target_key,target_project_id,target_plan_id) on conflict do nothing;
  select * into prior from public.preview_target_reservations r where r.target_key=reserve_preview_target.target_key for update;
  return prior.project_id=target_project_id and prior.plan_id=target_plan_id;
end $$;
create or replace function public.release_preview_target(target_key text,target_project_id uuid,target_plan_id uuid,target_owner_id uuid,expected_epoch bigint)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare lease public.workflow_coordinator_leases;
begin
  select * into lease from public.workflow_coordinator_leases where project_id=target_project_id for update;
  if not found or lease.owner_id<>target_owner_id or lease.epoch<>expected_epoch or lease.expires_at<=clock_timestamp() then raise exception 'coordinator unavailable'; end if;
  delete from public.preview_target_reservations r where r.target_key=release_preview_target.target_key and r.project_id=target_project_id and r.plan_id=target_plan_id;
  return true;
end $$;
revoke execute on function public.reserve_preview_target(text,uuid,uuid,uuid,bigint) from public,anon,authenticated;
revoke execute on function public.release_preview_target(text,uuid,uuid,uuid,bigint) from public,anon,authenticated;
grant execute on function public.reserve_preview_target(text,uuid,uuid,uuid,bigint) to service_role;
grant execute on function public.release_preview_target(text,uuid,uuid,uuid,bigint) to service_role;
