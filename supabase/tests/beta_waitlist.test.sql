-- Authorized disposable database only, after migrations; no extension or account fixtures.
-- All synthetic registrations and rate counters roll back.
begin;
set local role service_role;
do $$
declare fixture_email text := 'release-check-sql-fixture@example.test'; result boolean; row_count integer;
begin
  assert not has_function_privilege('anon','public.register_beta_waitlist(text,text)','execute');
  assert not has_function_privilege('authenticated','public.register_beta_waitlist(text,text)','execute');
  assert not exists(select 1 from public.beta_waitlist where email=fixture_email);
  for attempt in 1..6 loop
    result := public.register_beta_waitlist(fixture_email,repeat('e',64));
    assert result = (attempt <= 5), 'registration rate bound or success failed';
  end loop;
  select count(*) into row_count from public.beta_waitlist where email=fixture_email and consent_version='beta-updates-v1' and registered_at is not null;
  assert row_count=1, 'duplicate registration or durable consent failed';
end $$;
rollback;
