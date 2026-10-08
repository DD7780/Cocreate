-- Fix reserved CURRENT_TIME resolving as timetz rather than the local timestamp.
-- Replace only this invoker function; existing grants, records and policies remain intact.
create or replace function public.register_beta_waitlist(registration_email text, client_key text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare registration_clock timestamptz := clock_timestamp(); window_id bigint; count_now integer; key_now text; maximum integer; period integer;
begin
  if registration_email <> lower(trim(registration_email)) or length(registration_email)>254 or registration_email ~ '[[:cntrl:]]' or registration_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or client_key !~ '^[a-f0-9]{64}$' then raise exception 'invalid registration'; end if;
  delete from public.beta_registration_attempts where expires_at <= registration_clock;
  for period, maximum in values (3600,500),(900,5) loop
    window_id := floor(extract(epoch from registration_clock)/period);
    key_now := case when period=3600 then 'global' else client_key end || ':' || window_id;
    count_now := null;
    insert into public.beta_registration_attempts(bucket,attempts,expires_at)
    values(key_now,1,to_timestamp((window_id+1)*period))
    on conflict(bucket) do update set attempts=public.beta_registration_attempts.attempts+1
      where public.beta_registration_attempts.attempts < maximum
    returning attempts into count_now;
    if count_now is null then return false; end if;
  end loop;
  insert into public.beta_waitlist(email,consent_version) values(registration_email,'beta-updates-v1') on conflict(email) do nothing;
  return true;
end $$;
