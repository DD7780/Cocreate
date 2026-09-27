begin;

-- Historical modes remain readable; new project creation is Developer only.
create or replace function public.create_project(project_title text default 'Untitled project', project_mode text default 'developer')
returns public.projects language plpgsql security definer set search_path = '' as $$
declare created public.projects;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if project_mode <> 'developer' then raise exception 'new projects support software building only'; end if;
  insert into public.profiles(id,display_name,avatar_url)
  values(auth.uid(),coalesce(auth.jwt()->'user_metadata'->>'full_name',''),auth.jwt()->'user_metadata'->>'avatar_url')
  on conflict(id) do update set display_name=excluded.display_name,avatar_url=excluded.avatar_url,updated_at=now();
  insert into public.projects(owner_id,title,workflow_mode)
  values(auth.uid(),left(coalesce(nullif(trim(project_title),''),'Untitled project'),120),'developer')
  returning * into created;
  insert into public.project_members(project_id,user_id,role) values(created.id,auth.uid(),'owner');
  return created;
end $$;

-- Server-only entitlement ledger. Existing projects retain their saved AI setup.
create table public.managed_credit_accounts (
  account_id uuid primary key references auth.users(id),
  balance_usd numeric(14,6) not null default 0 check (balance_usd >= 0),
  reserved_usd numeric(14,6) not null default 0 check (reserved_usd >= 0),
  spent_usd numeric(14,6) not null default 0 check (spent_usd >= 0),
  billing_hold boolean not null default false,
  max_concurrent integer not null default 2 check (max_concurrent between 1 and 8),
  updated_at timestamptz not null default now()
);

create table public.project_managed_funding (
  project_id uuid primary key references public.projects(id) on delete cascade,
  funding_account_id uuid not null references public.managed_credit_accounts(account_id),
  max_concurrent integer not null default 1 check (max_concurrent between 1 and 4),
  daily_limit_usd numeric(14,6) not null default 2 check (daily_limit_usd between 0 and 100),
  max_request_usd numeric(14,6) not null default 0.75 check (max_request_usd between 0.01 and 10),
  updated_at timestamptz not null default now()
);

create table public.project_managed_spenders (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  authorized_by uuid not null references auth.users(id),
  authorized_at timestamptz not null default now(),
  primary key(project_id,user_id)
);

create table public.managed_provider_requests (
  call_id uuid primary key,
  project_id uuid not null references public.projects(id),
  actor_id uuid not null references auth.users(id),
  funding_account_id uuid not null references public.managed_credit_accounts(account_id),
  model_id text not null,
  catalog_version text not null,
  reserved_usd numeric(14,6) not null check (reserved_usd > 0),
  actual_usd numeric(14,6),
  state text not null check (state in ('reserved','settled','uncertain')),
  provider_request_id text,
  usage jsonb,
  created_at timestamptz not null default now(),
  settled_at timestamptz
);
create index managed_requests_project_day on public.managed_provider_requests(project_id,created_at);
create index managed_requests_account_active on public.managed_provider_requests(funding_account_id,state);

alter table public.managed_credit_accounts enable row level security;
alter table public.project_managed_funding enable row level security;
alter table public.project_managed_spenders enable row level security;
alter table public.managed_provider_requests enable row level security;
revoke all on public.managed_credit_accounts, public.project_managed_funding,
  public.project_managed_spenders, public.managed_provider_requests from anon, authenticated;
grant all on public.managed_credit_accounts, public.project_managed_funding,
  public.project_managed_spenders, public.managed_provider_requests to service_role;

insert into public.managed_credit_accounts(account_id)
select distinct owner_id from public.projects on conflict do nothing;
insert into public.project_managed_funding(project_id,funding_account_id)
select id,owner_id from public.projects on conflict do nothing;
insert into public.project_managed_spenders(project_id,user_id,authorized_by)
select id,owner_id,owner_id from public.projects on conflict do nothing;

create function public.initialize_managed_funding() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  insert into public.managed_credit_accounts(account_id) values(new.owner_id) on conflict do nothing;
  insert into public.project_managed_funding(project_id,funding_account_id) values(new.id,new.owner_id);
  insert into public.project_managed_spenders(project_id,user_id,authorized_by) values(new.id,new.owner_id,new.owner_id);
  return new;
end $$;
create trigger project_managed_funding_init after insert on public.projects
for each row execute function public.initialize_managed_funding();

create function public.reserve_managed_request(
  p_call_id uuid, p_project_id uuid, p_actor_id uuid, p_model_id text,
  p_catalog_version text, p_reserved_usd numeric
) returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare f public.project_managed_funding%rowtype;
declare a public.managed_credit_accounts%rowtype;
declare day_total numeric;
declare project_active integer;
declare account_active integer;
begin
  if p_reserved_usd is null or p_reserved_usd <= 0 then raise exception 'Invalid managed reservation'; end if;
  select * into f from public.project_managed_funding where project_id=p_project_id for update;
  if not found then raise exception 'Managed funding is not configured for this project'; end if;
  select * into a from public.managed_credit_accounts where account_id=f.funding_account_id for update;
  if not found then raise exception 'Funding account is unavailable'; end if;
  if a.billing_hold then raise exception 'Managed funding is on billing hold pending reconciliation'; end if;
  if not exists(select 1 from public.project_members m where m.project_id=p_project_id and m.user_id=p_actor_id and m.role in ('owner','editor'))
    or not exists(select 1 from public.project_managed_spenders s where s.project_id=p_project_id and s.user_id=p_actor_id)
  then raise exception 'This participant is not authorized to spend project credits'; end if;
  if p_reserved_usd > f.max_request_usd then raise exception 'Request exceeds the project per-call limit'; end if;
  if a.balance_usd - a.reserved_usd < p_reserved_usd then raise exception 'Insufficient managed credits'; end if;
  select count(*) into project_active from public.managed_provider_requests where project_id=p_project_id and state in ('reserved','uncertain');
  select count(*) into account_active from public.managed_provider_requests where funding_account_id=f.funding_account_id and state in ('reserved','uncertain');
  if project_active >= f.max_concurrent or account_active >= a.max_concurrent then raise exception 'Managed request concurrency limit reached'; end if;
  select coalesce(sum(coalesce(actual_usd,reserved_usd)),0) into day_total
  from public.managed_provider_requests where project_id=p_project_id and created_at >= date_trunc('day',now());
  if day_total + p_reserved_usd > f.daily_limit_usd then raise exception 'Project daily managed limit reached'; end if;
  insert into public.managed_provider_requests(call_id,project_id,actor_id,funding_account_id,model_id,catalog_version,reserved_usd,state)
  values(p_call_id,p_project_id,p_actor_id,f.funding_account_id,p_model_id,p_catalog_version,p_reserved_usd,'reserved');
  update public.managed_credit_accounts set reserved_usd=reserved_usd+p_reserved_usd,updated_at=now() where account_id=f.funding_account_id;
end $$;

create function public.settle_managed_request(
  p_call_id uuid, p_actual_usd numeric, p_provider_request_id text, p_usage jsonb
) returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare r public.managed_provider_requests%rowtype;
begin
  select * into r from public.managed_provider_requests where call_id=p_call_id for update;
  if not found then raise exception 'Managed request reservation not found'; end if;
  if r.state <> 'reserved' then raise exception 'Managed request already reconciled'; end if;
  if p_actual_usd is null then
    update public.managed_provider_requests set state='uncertain',provider_request_id=p_provider_request_id,usage=p_usage,settled_at=now() where call_id=p_call_id;
    return; -- Keep the full reservation until provider billing is reconciled.
  end if;
  if p_actual_usd < 0 then raise exception 'Invalid managed usage charge'; end if;
  if p_actual_usd > r.reserved_usd then
    update public.managed_credit_accounts set billing_hold=true,updated_at=now() where account_id=r.funding_account_id;
    update public.managed_provider_requests set state='uncertain',actual_usd=p_actual_usd,
      provider_request_id=p_provider_request_id,usage=p_usage,settled_at=now() where call_id=p_call_id;
    return; -- Operator must reconcile the overage; do not release reserved credit.
  end if;
  update public.managed_credit_accounts set
    reserved_usd=reserved_usd-r.reserved_usd,
    balance_usd=balance_usd-p_actual_usd,
    spent_usd=spent_usd+p_actual_usd,updated_at=now()
  where account_id=r.funding_account_id;
  update public.managed_provider_requests set state='settled',actual_usd=p_actual_usd,
    provider_request_id=p_provider_request_id,usage=p_usage,settled_at=now() where call_id=p_call_id;
end $$;

revoke all on function public.initialize_managed_funding(),
  public.reserve_managed_request(uuid,uuid,uuid,text,text,numeric),
  public.settle_managed_request(uuid,numeric,text,jsonb) from public, anon, authenticated;
grant execute on function public.reserve_managed_request(uuid,uuid,uuid,text,text,numeric),
  public.settle_managed_request(uuid,numeric,text,jsonb) to service_role;

commit;
