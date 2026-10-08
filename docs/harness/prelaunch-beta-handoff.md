# Pre-launch and private beta change packet

Hosted release16e10f6 is active with Worker7b47bfd0/container38/image dd13ffb0. Public landing, durable waitlist/deduplication, recovery form, canonical/www/legacy redirects and anonymous protected boundaries pass real hosted checks. The additive waitlist clock fix is applied (10 migrations); all seven private table fingerprints match the pre-release baseline after synthetic cleanup. A repeated Linux startup crash remains retained; the normal-renderer/aggregate-CPU correction awaits CI. Independent signed-in owner/cofounder/unapproved and actual recovery/invitation completion remain unavailable. [Current packet](prelaunch-release-repair.md).

Latest 2026-10-08 status is in [the repair packet](prelaunch-release-repair.md): source main ca7bf55 is published, but production still serves the old ungated image. Fresh SQL observes the required migrations and exactly the designated two approvals. A supported same-host cgroup candidate and www redirect await Linux and hosted verification. Preserve the owner/ordinary approval operations below; no migration or account/member edits are required by this repair.

Dated source/local handoff from 2026-10-07. The [2026-10-08 custom-domain release packet](prelaunch-domain-release.md) supersedes earlier prepared/unapplied status: live migration history/definitions match, two verified founder approvals are saved, but the latest app image and Auth/domain rollout remain pending. Retain the original evidence below; do not reapply migrations from this historical instruction without checking live history.

Prepared 2026-10-07 from main `ee014a1`. Implemented and locally verified; hosted rollout remains pending.

Outcome: public `/` explains the current product and saves email plus explicit consent. `/app` opens the existing authenticated application only after separate beta approval. Existing project, callback, recovery and invitation URLs remain valid.

Scope: landing component and scoped stylesheet; existing SPA entry/auth navigation; server registration endpoint, private storage and approval checks; Worker trusted rate-limit identity; Supabase migration and policy checks; focused security/browser tests; product, architecture, API, checklist and handoff. Backend changes are required because navigation cannot protect private APIs, sockets or artifacts. Shared workflow contracts, inference, budgets and generation remain unchanged.

Evidence: project routes call SupabasePlatform; room middleware, socket upgrade/message/delivery and deferred dispatch call requireMembership. Invitation acceptance and list/create check separately. Direct Data API/RPC/Storage are covered by prepared policies. The originally missing Graphify tool now runs from the ignored workspace runtime; [scoped query](../../artifacts/prelaunch-beta/graph-query.log).

Verification: durable local waitlist restart/deduplication/error/rate checks; mocked hosted approval and revocation across HTTP, sockets and invitation acceptance; prepared SQL checks; existing regression suite, types, boundaries, production build; browser desktop/mobile/200% zoom and form/keyboard states. Local auth remains a development compatibility mode, not hosted beta authorization. No migration, deployment, email, tracking or paid inference is authorized by this change.

## Exact owner and approval process

Use the existing Supabase dashboard as a trusted project administrator, never a publishable/browser credential. Verify the intended project and the existing confirmed account's UUID in Authentication → Users. Waitlist registration does not create that account. There is no automatic first-user approval.

For an authorized hosted release, apply the complete migration history including [the beta migration](../../supabase/migrations/20261006204612_prelaunch_beta_access.sql), then configure the owner's verified Auth UUID in the SQL Editor. Replace the placeholder with that UUID:

```sql
insert into public.beta_access(user_id,is_owner,revoked_at)
values ('OWNER_AUTH_USER_UUID'::uuid,true,null)
on conflict(user_id) do update set is_owner=true, revoked_at=null;
```

The administrator-managed owner flag is trusted server-side configuration. It retains access even if a revoked timestamp is accidentally set. Changing/removing owner configuration is a separate explicit administrative operation. Do not deploy before verifying owner setup.

To manually approve a confirmed tester, verify their Auth UUID, then run:

```sql
insert into public.beta_access(user_id,revoked_at)
values ('TESTER_AUTH_USER_UUID'::uuid,null)
on conflict(user_id) do update set revoked_at=null, approved_at=now();
```

To revoke ordinary beta permission:

```sql
update public.beta_access set revoked_at=now()
where user_id='TESTER_AUTH_USER_UUID'::uuid and not is_owner;
```

Approval/revocation changes neither subscriptions, memberships, invitation tokens nor roles. The pending page can recheck immediately; the UI also checks every 30 seconds. Protected requests/messages/deliveries read fresh permission. A completely silent socket need not close instantly, but subsequent protected delivery/message checks deny access. An approved person still needs project membership. Pending invitations stay unaccepted with their original expiry and safe return URL; approval does not extend them.

Administrator-only waitlist inspection:

```sql
select email,consent_version,registered_at
from public.beta_waitlist order by registered_at;
```

No email/job/tracking was added. Any invitation/update campaign, unsubscribe or retention operation needs its own explicitly authorized operation; consent is not permission for this coding task to send email. Existing account confirmation/recovery and explicitly requested project-invite flows retain their behavior.

## Release prerequisites and rollback

Keep the current domain, application and callback allowlists. Build hosted with existing Supabase configuration; containers remain `COCREATE_HOSTED=true` with Supabase auth. Requesting local auth in hosted configuration now fails closed. No administrative key or approval authority belongs in VITE variables.

Hosted waitlist authority is Postgres, not container disk. Durable fixed-window limits are five validated attempts/client/15 minutes and 500 globally/hour, including duplicates. Worker-derived opaque IP keys overwrite caller headers and carry server-verified HMAC proof; direct peers cannot select arbitrary forwarded identities. Keep SESSION_SECRET private/stable. NAT/direct-container clients can share limits. Invalid consent/email/honeypot and cross-site requests fail without success. Retry-After conservatively allows 15 minutes. Expired counters are removed transactionally; registrations are not automatically deleted.

Authorize a designated disposable SQL target before running [prepared pgTAP checks](../../supabase/tests/beta_access.test.sql). Verify real anonymous/account grants, direct REST/RPC/Storage, independent users, invitation preservation, owner seed, socket revocation and callback/recovery before release. The two prepared coordinator migrations and Linux/Storage rollout checks remain outstanding. No SQL migration, pgTAP execution or Supabase advisor run occurred here.

Rollback by restoring the prior application release without dropping waitlist/approval records. Beta restrictive policies keep denying unapproved direct access. Do not relax them or publish local auth as an emergency bypass; policy rollback needs separate authorization. Preserve pending invitations and private project data.

## Verification and handoff

- [Focused tests](../../artifacts/prelaunch-beta/focused-tests.log): 6/6 pass, covering durable-first registration/restart/deduplication, failed writes, rate identity/expiry, owner/private approval, pending invites and HTTP/socket revocation. Hosted authentication/approval/storage are mocked.
- [Full suite](../../artifacts/prelaunch-beta/full-tests.log): complete correctly permissioned local Windows run passes; exact count is recorded in the checklist/verification manifest. The interrupted default-sandbox run remains separate, with native isolation unavailable.
- [Browser checks](../../artifacts/prelaunch-beta/browser/checks.json): public form loading/success/error, keyboard skip/reduced motion, 320/390/768/1440 layouts, pending invite/account switch, login/recovery and approved/owner app entry. The 200% equivalent layout uses 720 CSS pixels at scale 2 for 1440 physical pixels. Fonts were blocked to prevent external calls in this controlled test; existing Inter/DM Serif declarations are retained.
- [Production build](../../artifacts/prelaunch-beta/build-final.log) passes with the existing workspace chunk-size warning. [Final types](../../artifacts/prelaunch-beta/types-final.log) and import boundaries are recorded in the manifest.
- [AST refresh](../../artifacts/prelaunch-beta/graphify-final.log): 2,058 nodes, 4,914 edges, 113 communities, no LLM calls. Optional SQL AST parser is absent; SQL is inspected directly and execution remains unverified.
- Earlier wrong-mode focused and browser navigation-timing results are retained. They are verification-script/environment issues; they are not hosted evidence or passing full-suite results.

The working local preview is running at `http://localhost:5173/` in explicit development/local-auth mode. The existing room URL remains HTTP 200, with its persisted state read-only checked as idle. Preview startup did not register anyone, send email or trigger inference. The optional three-person demonstration was not selected; the required illustration shows two fictional contributors.

The page follows the clear headline/product example/benefits/CTA/FAQ structure in the [requested article](https://www.prelaunch.com/blog/pre-launch-landing-page). The [YouTube reference](https://youtu.be/YRN5ONLk2bk) was inaccessible; no lessons/design claims are derived from it. Current [Supabase RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security) and Context7 guidance informed policy/grant boundaries. Local checks establish neither hosted identity, real RLS/Storage/SQL behavior, email delivery, live provider quality nor deployed readiness.
