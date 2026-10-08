begin;

create table public.beta_reviewers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz
);
create table public.beta_access_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  requester_email text not null,
  status text not null default 'pending' check (status in ('pending','approved','declined')),
  message text not null default '' check (length(message) <= 1000),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references auth.users(id),
  check ((status = 'pending' and decided_at is null and decided_by is null)
      or (status <> 'pending' and decided_at is not null and decided_by is not null))
);
create unique index beta_one_pending_request on public.beta_access_requests(requester_id) where status='pending';
create index beta_requests_by_account on public.beta_access_requests(requester_id, requested_at desc);
create index beta_requests_by_status on public.beta_access_requests(status, requested_at desc);

create table public.beta_email_deliveries (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.beta_access_requests(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  recipient_email text not null,
  kind text not null check (kind in ('review','approved','declined')),
  state text not null default 'pending' check (state in ('pending','sending','sent','failed')),
  attempts integer not null default 0 check (attempts between 0 and 5),
  next_attempt_at timestamptz not null default now(),
  first_attempt_at timestamptz,
  lease_token uuid,
  lease_until timestamptz,
  provider_payload jsonb,
  provider_message_id text,
  last_error text,
  created_at timestamptz not null default now(),
  unique(request_id, recipient_id, kind)
);
create index beta_email_due on public.beta_email_deliveries(next_attempt_at) where state in ('pending','sending');

alter table public.beta_reviewers enable row level security;
alter table public.beta_access_requests enable row level security;
alter table public.beta_email_deliveries enable row level security;
-- All access is through verified server identity; direct Data API roles have no grants.
revoke all on public.beta_reviewers, public.beta_access_requests, public.beta_email_deliveries from public, anon, authenticated;
grant select, insert, update, delete on public.beta_reviewers, public.beta_access_requests, public.beta_email_deliveries to service_role;

-- Service-role RPCs cannot read auth.users. Confine that authority to two private,
-- service-only lookups rather than granting the application the entire Auth table.
create function private.beta_confirmed_email(target_account uuid) returns text
language sql stable security definer set search_path='' as $$
  select lower(email) from auth.users where id=target_account and email_confirmed_at is not null and not is_anonymous;
$$;
create function private.beta_lock_confirmed_account(target_account uuid) returns text
language plpgsql security definer set search_path='' as $$
declare account_email text;
begin
  select lower(email) into account_email from auth.users
    where id=target_account and email_confirmed_at is not null and not is_anonymous for update;
  return account_email;
end $$;
revoke all on function private.beta_confirmed_email(uuid), private.beta_lock_confirmed_account(uuid) from public, anon, authenticated;
grant usage on schema private to service_role;
grant execute on function private.beta_confirmed_email(uuid), private.beta_lock_confirmed_account(uuid) to service_role;

create function public.request_beta_access(actor_id uuid, requester_message text default '')
returns public.beta_access_requests language plpgsql security invoker set search_path='' as $$
declare latest public.beta_access_requests; account_email text; access_row public.beta_access; reviewer_count integer;
begin
  -- One account lock orders concurrent requests, decisions and pending deduplication.
  account_email:=private.beta_lock_confirmed_account(actor_id);
  if account_email is null then raise exception 'confirmed email required' using errcode='42501'; end if;
  if requester_message is null or length(requester_message)>1000 then raise exception 'message must be at most 1000 characters' using errcode='22023'; end if;
  select * into access_row from public.beta_access where user_id=actor_id for update;
  if access_row.user_id is not null then
    if access_row.is_owner or access_row.revoked_at is null then raise exception 'beta access already approved' using errcode='22023'; end if;
    raise exception 'revoked access requires an explicit administrator action' using errcode='42501';
  end if;
  select * into latest from public.beta_access_requests where requester_id=actor_id order by requested_at desc,id desc limit 1 for update;
  if latest.status='pending' then return latest; end if;
  if latest.status='approved' then raise exception 'approved access cannot be revived by a request' using errcode='42501'; end if;
  if latest.status='declined' and latest.decided_at+interval '7 days'>now() then raise exception 'wait seven days after a decline before requesting again' using errcode='22023'; end if;
  perform 1 from public.beta_reviewers r
    join public.beta_access b on b.user_id=r.user_id
    where r.revoked_at is null and private.beta_confirmed_email(r.user_id) is not null and (b.is_owner or b.revoked_at is null) for share of r,b;
  get diagnostics reviewer_count=row_count;
  if reviewer_count<>2 then raise exception 'two confirmed reviewers must be configured' using errcode='55000'; end if;
  insert into public.beta_access_requests(requester_id,requester_email,message)
    values(actor_id,account_email,trim(requester_message)) returning * into latest;
  insert into public.beta_email_deliveries(request_id,recipient_id,recipient_email,kind)
    select latest.id,r.user_id,private.beta_confirmed_email(r.user_id),'review' from public.beta_reviewers r
    join public.beta_access b on b.user_id=r.user_id
    where r.revoked_at is null and private.beta_confirmed_email(r.user_id) is not null and (b.is_owner or b.revoked_at is null);
  return latest;
end $$;

create function public.decide_beta_access(actor_id uuid, target_request_id uuid, decision text)
returns public.beta_access_requests language plpgsql security invoker set search_path='' as $$
declare result public.beta_access_requests; target_account uuid; access_row public.beta_access;
begin
  if decision not in ('approved','declined') or decision is null then raise exception 'invalid beta decision' using errcode='22023'; end if;
  -- Lock permission rows so concurrent reviewer revocation precedes or follows the decision.
  perform 1 from public.beta_reviewers r join public.beta_access b on b.user_id=r.user_id
    where r.user_id=actor_id and r.revoked_at is null and (b.is_owner or b.revoked_at is null)
      and private.beta_confirmed_email(r.user_id) is not null for share of r,b;
  if not found then raise exception 'beta reviewer permission required' using errcode='42501'; end if;
  select requester_id into target_account from public.beta_access_requests where id=target_request_id;
  if target_account is null then raise exception 'request unavailable' using errcode='22023'; end if;
  if target_account=actor_id then raise exception 'reviewers cannot decide their own request' using errcode='42501'; end if;
  if private.beta_lock_confirmed_account(target_account) is null then raise exception 'requester confirmed email required' using errcode='42501'; end if;
  select * into result from public.beta_access_requests where id=target_request_id for update;
  if result.status<>'pending' then return result; end if;
  select * into access_row from public.beta_access where user_id=target_account for update;
  if access_row.revoked_at is not null and not access_row.is_owner then raise exception 'revoked access requires an explicit administrator action' using errcode='42501'; end if;
  if decision='approved' then
    insert into public.beta_access(user_id,is_owner) values(target_account,false) on conflict(user_id) do nothing;
    -- Recheck a concurrent administrator insertion; never clear a revocation.
    select * into access_row from public.beta_access where user_id=target_account for update;
    if access_row.revoked_at is not null and not access_row.is_owner then raise exception 'revoked access requires an explicit administrator action' using errcode='42501'; end if;
  end if;
  update public.beta_access_requests set status=decision,decided_at=now(),decided_by=actor_id
    where id=target_request_id returning * into result;
  insert into public.beta_email_deliveries(request_id,recipient_id,recipient_email,kind)
    values(result.id,result.requester_id,result.requester_email,decision) on conflict do nothing;
  return result;
end $$;

create function public.claim_beta_email(delivery_lease uuid)
returns setof public.beta_email_deliveries language plpgsql security invoker set search_path='' as $$
declare target uuid;
begin
  update public.beta_email_deliveries d set state='failed',last_error='Reviewer permission or confirmed recipient address changed.'
    where d.kind='review' and d.state in ('pending','sending') and (d.lease_until is null or d.lease_until<=now())
      and not exists(select 1 from public.beta_reviewers r join public.beta_access b on b.user_id=r.user_id
        where r.user_id=d.recipient_id and r.revoked_at is null and (b.is_owner or b.revoked_at is null)
          and private.beta_confirmed_email(r.user_id)=d.recipient_email);
  -- Never retry an ambiguous dispatch beyond the provider's 24-hour key retention.
  update public.beta_email_deliveries set state='failed',last_error='Retry budget expired; delivery may be uncertain.',lease_token=null,lease_until=null
    where state in ('pending','sending') and (lease_until is null or lease_until<=now())
      and (attempts>=5 or first_attempt_at+interval '23 hours'<=now());
  select id into target from public.beta_email_deliveries
    where state in ('pending','sending') and next_attempt_at<=now()
      and (lease_until is null or lease_until<=now()) and attempts<5
    order by created_at,id limit 1 for update skip locked;
  if target is null then return; end if;
  return query update public.beta_email_deliveries set state='sending',lease_token=delivery_lease,
    attempts=attempts+1,lease_until=now()+interval '2 minutes' where id=target returning *;
end $$;

create function public.prepare_beta_email(target_delivery uuid, delivery_lease uuid, payload jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare result jsonb;
begin
  update public.beta_email_deliveries set provider_payload=coalesce(provider_payload,payload),
    first_attempt_at=coalesce(first_attempt_at,now())
    where id=target_delivery and state='sending' and lease_token=delivery_lease and lease_until>now()
      and attempts<=5 and (first_attempt_at is null or first_attempt_at+interval '23 hours'>now())
    returning provider_payload into result;
  if result is null then raise exception 'email lease lost' using errcode='40001'; end if;
  return result;
end $$;

create function public.finish_beta_email(target_delivery uuid, delivery_lease uuid, message_id text, delivery_error text)
returns boolean language plpgsql security invoker set search_path='' as $$
begin
  update public.beta_email_deliveries set
    state=case when message_id is not null then 'sent' when attempts>=5 then 'failed' else 'pending' end,
    provider_message_id=message_id,last_error=left(delivery_error,240),lease_token=null,lease_until=null,
    next_attempt_at=now()+make_interval(secs=>case attempts when 1 then 60 when 2 then 300 when 3 then 900 else 3600 end)
    where id=target_delivery and state='sending' and lease_token=delivery_lease and lease_until>now();
  return found;
end $$;

create function public.has_due_beta_email() returns boolean
language sql stable security invoker set search_path='' as $$
  select exists(select 1 from public.beta_email_deliveries
    where state in ('pending','sending') and next_attempt_at<=now()
      and (lease_until is null or lease_until<=now()));
$$;

revoke all on function public.request_beta_access(uuid,text), public.decide_beta_access(uuid,uuid,text),
  public.claim_beta_email(uuid), public.prepare_beta_email(uuid,uuid,jsonb), public.finish_beta_email(uuid,uuid,text,text), public.has_due_beta_email() from public, anon, authenticated;
grant execute on function public.request_beta_access(uuid,text), public.decide_beta_access(uuid,uuid,text),
  public.claim_beta_email(uuid), public.prepare_beta_email(uuid,uuid,jsonb), public.finish_beta_email(uuid,uuid,text,text), public.has_due_beta_email() to service_role;

commit;
