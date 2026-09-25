begin;

alter table public.project_members
  add column if not exists can_share boolean not null default false;

alter table public.project_invites
  add column if not exists recipient_email text,
  add column if not exists delivery_state text not null default 'pending',
  add column if not exists delivery_error text,
  add column if not exists provider_message_id text,
  add column if not exists last_sent_at timestamptz,
  add column if not exists resend_count integer not null default 0;

alter table public.project_invites
  drop constraint if exists project_invites_delivery_state_check;
alter table public.project_invites
  add constraint project_invites_delivery_state_check
  check (delivery_state in ('pending', 'sent', 'failed', 'configuration_required'));

-- Legacy link-only invitations were not bound to an email and must never grant access.
update public.project_invites
set revoked_at = coalesce(revoked_at, now()),
    delivery_state = 'failed',
    delivery_error = 'Legacy unbound invitation revoked during email-invitation migration.'
where recipient_email is null and accepted_at is null;

create index if not exists project_invites_project_created_idx
  on public.project_invites(project_id, created_at desc);
create index if not exists project_invites_creator_rate_idx
  on public.project_invites(created_by, created_at desc);
create unique index if not exists project_invites_one_active_email_idx
  on public.project_invites(project_id, lower(recipient_email))
  where revoked_at is null and accepted_at is null and recipient_email is not null;

create or replace function public.create_project_invite(
  target_project_id uuid,
  actor_id uuid,
  recipient text,
  invite_role public.project_role,
  invite_hash text,
  invite_expires_at timestamptz
)
returns public.project_invites
language plpgsql
security definer
set search_path = ''
as $$
declare created public.project_invites;
declare normalized_email text := lower(trim(recipient));
begin
  if invite_role = 'owner' then raise exception 'owner invitations are not allowed'; end if;
  if normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'invalid recipient email'; end if;
  if not exists (
    select 1 from public.project_members pm
    where pm.project_id = target_project_id and pm.user_id = actor_id
      and (pm.role = 'owner' or pm.can_share)
  ) then raise exception 'sharing permission required' using errcode = '42501'; end if;
  if (select count(*) from public.project_invites pi where pi.created_by = actor_id and pi.created_at > now() - interval '1 hour') >= 30
  then raise exception 'invitation rate limit reached'; end if;

  insert into public.project_invites(project_id, token_hash, recipient_email, intended_role, created_by, expires_at)
  values (target_project_id, invite_hash, normalized_email, invite_role, actor_id, invite_expires_at)
  returning * into created;
  return created;
end;
$$;

create or replace function public.resend_project_invite(
  prior_invite_id uuid,
  actor_id uuid,
  invite_hash text,
  invite_expires_at timestamptz
)
returns public.project_invites
language plpgsql
security definer
set search_path = ''
as $$
declare prior public.project_invites;
declare created public.project_invites;
begin
  select * into prior from public.project_invites where id = prior_invite_id for update;
  if prior.id is null or prior.revoked_at is not null or prior.accepted_at is not null then
    raise exception 'invitation is no longer pending';
  end if;
  if not exists (
    select 1 from public.project_members pm
    where pm.project_id = prior.project_id and pm.user_id = actor_id
      and (pm.role = 'owner' or pm.can_share)
  ) then raise exception 'sharing permission required' using errcode = '42501'; end if;
  if (select count(*) from public.project_invites pi where pi.created_by = actor_id and pi.created_at > now() - interval '1 hour') >= 30
  then raise exception 'invitation rate limit reached'; end if;

  update public.project_invites set revoked_at = now() where id = prior.id;
  insert into public.project_invites(
    project_id, token_hash, recipient_email, intended_role, created_by, expires_at, resend_count
  ) values (
    prior.project_id, invite_hash, prior.recipient_email, prior.intended_role, actor_id,
    invite_expires_at, prior.resend_count + 1
  ) returning * into created;
  return created;
end;
$$;

create or replace function public.accept_project_invite(invite_hash text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare invite public.project_invites;
declare verified_email text;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  select lower(email) into verified_email
  from auth.users where id = auth.uid() and email_confirmed_at is not null;
  if verified_email is null then raise exception 'verified email required'; end if;

  select * into invite from public.project_invites where token_hash = invite_hash for update;
  if invite.id is null then raise exception 'invitation unavailable'; end if;
  if invite.accepted_at is not null and invite.accepted_by = auth.uid() then return invite.project_id; end if;
  if invite.revoked_at is not null or invite.accepted_at is not null or invite.expires_at <= now() then
    raise exception 'invitation invalid, expired, revoked, or already used';
  end if;
  if invite.recipient_email is null or lower(invite.recipient_email) <> verified_email then
    raise exception 'invitation belongs to another verified email' using errcode = '42501';
  end if;

  insert into public.project_members(project_id, user_id, role)
  values (invite.project_id, auth.uid(), invite.intended_role)
  on conflict (project_id, user_id) do update
    set role = case when public.project_members.role = 'owner' then 'owner'::public.project_role else excluded.role end;
  update public.project_invites set accepted_by = auth.uid(), accepted_at = now() where id = invite.id;
  return invite.project_id;
end;
$$;

revoke all on function public.create_project_invite(uuid, uuid, text, public.project_role, text, timestamptz) from public, anon, authenticated;
revoke all on function public.resend_project_invite(uuid, uuid, text, timestamptz) from public, anon, authenticated;
grant execute on function public.create_project_invite(uuid, uuid, text, public.project_role, text, timestamptz) to service_role;
grant execute on function public.resend_project_invite(uuid, uuid, text, timestamptz) to service_role;
revoke all on function public.accept_project_invite(text) from public, anon;
grant execute on function public.accept_project_invite(text) to authenticated, service_role;

commit;
