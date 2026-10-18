begin;

-- Hosted default privileges may grant service_role mutation rights at CREATE TABLE.
-- Canonical journals permit insertion and lookup, never history rewriting.
revoke all on public.workflow_capture_commands, public.workflow_capture_sources from service_role;
grant select, insert on public.workflow_capture_commands, public.workflow_capture_sources to service_role;
revoke all on sequence public.workflow_capture_commands_cursor_seq from service_role;
grant usage, select on sequence public.workflow_capture_commands_cursor_seq to service_role;

commit;
