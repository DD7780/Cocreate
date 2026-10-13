begin;

-- A provider's cached authenticated URL can outlive project/beta revocation.
-- Private bytes are delivered through the app's current-membership-checked,
-- no-store routes. Its server-only service role still restores immutable bodies.
-- Restrictive policy also holds if another permissive SELECT policy is added.
create policy artifact_objects_server_delivery on storage.objects as restrictive
for select to authenticated
using (bucket_id <> 'cocreate-artifacts');

commit;
