begin;

-- Keep every existing token valid. Multiple pending links may coexist for one email.
drop index if exists public.project_invites_one_active_email_idx;
alter table public.project_invites
  add column if not exists request_key text,
  add column if not exists encrypted_token text,
  add column if not exists source_invite_id uuid;
create unique index if not exists project_invites_request_key_idx
  on public.project_invites(project_id, created_by, request_key)
  where request_key is not null;

create function public.create_project_invite_v2(
  target_project_id uuid, actor_id uuid, recipient text,
  invite_role public.project_role, invite_hash text, invite_expires_at timestamptz,
  delivery_request_key text, token_ciphertext text
)
returns public.project_invites language plpgsql security definer set search_path = '' as $$
declare existing public.project_invites; created public.project_invites;
declare normalized_email text := lower(trim(recipient));
begin
  if invite_role = 'owner' then raise exception 'owner invitations are not allowed'; end if;
  if normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'invalid recipient email'; end if;
  if length(delivery_request_key) < 8 or length(delivery_request_key) > 100 or token_ciphertext is null then
    raise exception 'invalid delivery request';
  end if;
  if not exists (select 1 from public.project_members pm where pm.project_id = target_project_id
    and pm.user_id = actor_id and (pm.role = 'owner' or pm.can_share)) then
    raise exception 'sharing permission required' using errcode = '42501';
  end if;
  select * into existing from public.project_invites
    where project_id = target_project_id and created_by = actor_id and request_key = delivery_request_key;
  if existing.id is not null then
    if existing.recipient_email <> normalized_email or existing.intended_role <> invite_role then
      raise exception 'request ID already belongs to another invitation';
    end if;
    return existing;
  end if;
  if (select count(*) from public.project_invites pi where pi.created_by = actor_id
    and pi.created_at > now() - interval '1 hour') >= 30 then raise exception 'invitation rate limit reached'; end if;
  insert into public.project_invites(project_id, token_hash, recipient_email, intended_role,
    created_by, expires_at, request_key, encrypted_token)
  values(target_project_id, invite_hash, normalized_email, invite_role, actor_id,
    invite_expires_at, delivery_request_key, token_ciphertext)
  on conflict (project_id, created_by, request_key) where request_key is not null do nothing
  returning * into created;
  if created.id is not null then return created; end if;
  select * into existing from public.project_invites
    where project_id = target_project_id and created_by = actor_id and request_key = delivery_request_key;
  if existing.recipient_email <> normalized_email or existing.intended_role <> invite_role then
    raise exception 'request ID already belongs to another invitation';
  end if;
  return existing;
end;
$$;

create function public.resend_project_invite_v2(
  prior_invite_id uuid, actor_id uuid, invite_hash text, invite_expires_at timestamptz,
  delivery_request_key text, token_ciphertext text
)
returns public.project_invites language plpgsql security definer set search_path = '' as $$
declare prior public.project_invites; existing public.project_invites; created public.project_invites;
begin
  select * into prior from public.project_invites where id = prior_invite_id for update;
  if prior.id is null then raise exception 'invitation is no longer pending'; end if;
  if length(delivery_request_key) < 8 or length(delivery_request_key) > 100 or token_ciphertext is null then
    raise exception 'invalid delivery request';
  end if;
  if not exists (select 1 from public.project_members pm where pm.project_id = prior.project_id
    and pm.user_id = actor_id and (pm.role = 'owner' or pm.can_share)) then
    raise exception 'sharing permission required' using errcode = '42501';
  end if;
  select * into existing from public.project_invites where project_id = prior.project_id
    and created_by = actor_id and request_key = delivery_request_key;
  if existing.id is not null then
    if existing.source_invite_id is distinct from prior_invite_id then raise exception 'request ID already belongs to another invitation'; end if;
    return existing;
  end if;
  if prior.revoked_at is not null or prior.accepted_at is not null then
    raise exception 'invitation is no longer pending';
  end if;
  if (select count(*) from public.project_invites pi where pi.created_by = actor_id
    and pi.created_at > now() - interval '1 hour') >= 30 then raise exception 'invitation rate limit reached'; end if;
  insert into public.project_invites(project_id, token_hash, recipient_email, intended_role,
    created_by, expires_at, request_key, encrypted_token, source_invite_id, resend_count)
  values(prior.project_id, invite_hash, prior.recipient_email, prior.intended_role, actor_id,
    invite_expires_at, delivery_request_key, token_ciphertext, prior.id, prior.resend_count + 1)
  on conflict (project_id, created_by, request_key) where request_key is not null do nothing
  returning * into created;
  if created.id is not null then return created; end if;
  select * into existing from public.project_invites where project_id = prior.project_id
    and created_by = actor_id and request_key = delivery_request_key;
  if existing.source_invite_id is distinct from prior_invite_id then raise exception 'request ID already belongs to another invitation'; end if;
  return existing;
end;
$$;

-- Older running servers must also stop revoking links during a rolling release.
create or replace function public.resend_project_invite(
  prior_invite_id uuid, actor_id uuid, invite_hash text, invite_expires_at timestamptz
)
returns public.project_invites language plpgsql security definer set search_path = '' as $$
declare prior public.project_invites; created public.project_invites;
begin
  select * into prior from public.project_invites where id = prior_invite_id for update;
  if prior.id is null or prior.revoked_at is not null or prior.accepted_at is not null then
    raise exception 'invitation is no longer pending';
  end if;
  if not exists (select 1 from public.project_members pm where pm.project_id = prior.project_id
    and pm.user_id = actor_id and (pm.role = 'owner' or pm.can_share)) then
    raise exception 'sharing permission required' using errcode = '42501';
  end if;
  if (select count(*) from public.project_invites pi where pi.created_by = actor_id
    and pi.created_at > now() - interval '1 hour') >= 30 then raise exception 'invitation rate limit reached'; end if;
  insert into public.project_invites(project_id,token_hash,recipient_email,intended_role,created_by,expires_at,resend_count)
  values(prior.project_id,invite_hash,prior.recipient_email,prior.intended_role,actor_id,invite_expires_at,prior.resend_count+1)
  returning * into created;
  return created;
end;
$$;

-- Existing role assignments, including editor and viewer, survive acceptance of any link.
create or replace function public.accept_project_invite(invite_hash text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare invite public.project_invites; verified_email text;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  select lower(email) into verified_email from auth.users
    where id = auth.uid() and email_confirmed_at is not null;
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
  values(invite.project_id, auth.uid(), invite.intended_role)
  on conflict (project_id, user_id) do nothing;
  update public.project_invites set accepted_by = auth.uid(), accepted_at = now() where id = invite.id;
  return invite.project_id;
end;
$$;

revoke all on function public.create_project_invite_v2(uuid,uuid,text,public.project_role,text,timestamptz,text,text) from public,anon,authenticated;
revoke all on function public.resend_project_invite_v2(uuid,uuid,text,timestamptz,text,text) from public,anon,authenticated;
grant execute on function public.create_project_invite_v2(uuid,uuid,text,public.project_role,text,timestamptz,text,text) to service_role;
grant execute on function public.resend_project_invite_v2(uuid,uuid,text,timestamptz,text,text) to service_role;

commit;
