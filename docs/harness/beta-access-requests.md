# Beta access request change packet — 2026-10-09

## Outcome and bounded scope

A confirmed, signed-in visitor requests beta access from the pending screen. Both verified reviewers receive a notification and explicitly approve or decline on `/beta/review`. The requester receives the committed result. Public waitlist, identity, ordinary beta permission, reviewer permission and project membership remain separate.

Scope: `shared/beta-access.ts`, `server/beta-requests.ts`, `server/beta-email.ts`, existing email sender/platform/server wiring, `src/BetaReview.tsx`, `src/ProjectApp.tsx`, theme CSS, additive Supabase migration/test, focused tests, release manifest/config and affected canonical guidance. No inference, project sharing side effects or owner promotion.

Graphify query `authentication beta_access waitlist email delivery permission checks` identified `server/beta.ts` L110, `server/supabase-platform.ts` L269, `server/invitation-email.ts`, `src/ProjectApp.tsx` L1618 and `tests/beta-access.test.ts`. Source confirms bearer identity, fresh beta and independent membership gates, Resend invitation transport, 30-second pending recheck and private administrator-only beta tables.

## Stage contracts and acceptance

1. Private `beta_reviewers` UUID grants, confirmed live identity and active beta access. Cofounder remains an ordinary beta user. Neither metadata nor email grants authority. Ordinary users cannot list/decide; reviewers cannot approve themselves.
2. Confirmed session account owns the request. Optional message ≤1,000 characters. Unique pending request per account; concurrent/repeated submission returns it unchanged. Decline resubmission cooldown is seven days. Approved requests and revoked access cannot be revived through submission.
3. Transactional outbox saves one immutable notification per reviewer alongside the request. Provider failure cannot erase it. Safe HTML escaping; token-free review URL. Durable leases, five bounded attempts and a 23-hour retry horizon after first dispatch preserve Resend's 24-hour deduplication window. Frozen provider payload survives deployment/configuration changes.
4. POST-only decisions recheck reviewer permission in SQL; first pending decision wins under locks. Approval and ordinary `beta_access` insertion commit atomically. Decline grants nothing. No reversal endpoint. Bearer-only mutations reject cross-origin/cross-site traffic and never use cookie identity.
5. Decision transaction saves independent requester notification. Approval links to `/app`; pending page polls existing access and request status. Membership and revocation gates remain fresh.
6. Focused server/provider/SQL concurrency/security tests, boundary checks, strict build and the established Linux release gate. The user will test the live flow manually this time; do not create live test accounts or send live test emails. Automated fixtures use only synthetic local accounts and a mocked provider. Report the exact deployed revision only after active image attestation and anonymous hosted checks; authenticated hosted and inbox outcomes remain awaiting the user's verification.

## Initial external configuration observations

Live read-only Auth/database checks verified both designated account UUIDs and confirmed emails. Existing founder owns the global beta row; cofounder has ordinary approval. Production Worker has `RESEND_API_KEY` but no `COCREATE_EMAIL_FROM` binding. No preview database exists. Sender and designated test inbox requested; independent implementation proceeds. No production migration or email sent by inspection.

## Evidence and release status

Implementation is deployed as attested below. Strict TypeScript, build and import boundaries pass. Focused beta/request/SQL/project-auth checks pass 25/25, with no skips. Existing invitation sender regressions also passed. Local PostgreSQL semantics run against the already locked PGlite dependency; independent concurrent native PostgreSQL connections are a separate CI gate, followed by the unchanged production-image compiler/browser/full regression gates. No dependency was added.

The sender is `2guys1canvas <beta@2guys1canvas.com>`, as approved by the user. They report Resend Sending verified, with Receiving pending; receiving is not used by this outbound feature. Existing Resend credentials stay server-only. The selected Tokyo sending region is retained. The Worker checks the private due-mail RPC every five minutes and wakes the existing primary container only when needed; the application drains bounded batches on startup/mutations and every minute while running.

Production migration `20261008191401_beta_access_requests` is applied. Its eight function bodies match source exactly, RLS is enabled on all three new tables, and anon/authenticated table/execute grants are absent. Both confirmed UUID grants are active; cofounder `is_owner=false` is preserved. Request and outbox tables contain no live test rows. The CLI-prepared migration file was renamed to the version assigned by the hosted migration tool, so source and live history agree.

Native PostgreSQL independent-connection tests, Docker build and Linux compiler/browser/adversity gates passed in candidate run [37830042544](https://github.com/DD7780/Cocreate/actions/runs/37830042544). The full run passed 241 tests and failed one test-file process with SIGKILL; suspected retained WASM fixture memory. The fixture now releases its closed database reference and invokes exposed test GC before the next database. The CI test command exposes GC; physical limits and all assertions are retained. A fresh complete run is required before main publication.

Candidate `ba96cfd`, [run 37952048052](https://github.com/DD7780/Cocreate/actions/runs/37952048052), passes the native SQL gate and all six new beta tests in the production image. Full regression is 243/244, zero skips: an existing Linux browser cold-start check reports isolation unavailable while the dedicated compiler 10/10 and browser 15/15 gates pass. One bounded failed-job retry is requested with unchanged source, limits and assertions; preserve this failure as historical evidence rather than calling the first run green.

Controlled local browser checks pass pending form submission, a read-only linked review, escaped text, cofounder approval, approved app entry and decline cooldown, with no overflow at 390/1440 pixels. [Evidence](../../artifacts/beta-access-requests/browser/checks.json) uses synthetic Auth transport and actual embedded SQL only; no external Auth/email/inference. Initial fixture assertions incorrectly matched CSS-transformed button case and the existing app's project-button wording; corrected assertions pass without product changes.

Security advisor follow-up identifies the intentionally private RLS tables as having no client policies ([notice](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)). Existing guarded project RPC/event-trigger grants and disabled leaked-password protection are unchanged from the preceding audit; no new feature definer function is client-executable. The prior source `915bebd` is superseded by the attested release below. No live account, request or email flow has been tested by this implementation session.

## Verified deployment — 2026-10-09

Beta request/approval source `ba96cfd` is deployed at https://2guys1canvas.com and published to main. Native PostgreSQL concurrency, compiler 10/10, browser 15/15 and full regression 244/244 pass with zero skips. Worker `088c7975`, container version 41 and image `fd66e1b1` serve the prepared fingerprint. The additive migration, two confirmed reviewer UUID grants, approved sender and retry cron are configured. Hosted anonymous routes pass; the user will manually verify signed-in requests, both reviewer inboxes, decisions, requester email and private-project denial. No live test account/email or paid inference was run by this session.

Source revision: `ba96cfd30bdc8b7c48362369be09c3502ce935a2`. Fingerprint: `8e34b57fd99591db7557bf4d3b8308df28b193e0319f3d9efb45b18c30b219fb`. [Candidate CI](https://github.com/DD7780/Cocreate/actions/runs/37952048052) passed on attempt 2; earlier failures above remain historical. The normal main push triggered the existing Cloudflare release. [Active platform metadata](../../artifacts/beta-access-requests/active-deployment.json) confirms the Worker/image, sender binding, retained resources/zero SSH keys and cron. [Hosted anonymous checks](../../artifacts/beta-access-requests/hosted-anonymous.json) verify the exact fingerprint, public SPA routes, protected APIs and non-mutating decision GET. [Local checks](../../artifacts/beta-access-requests/local-checks.json), [local browser](../../artifacts/beta-access-requests/browser/checks.json) and [schema/grants](../../artifacts/beta-access-requests/schema-checks.json) retain their separate scopes.

Main's independent [run 37954107608](https://github.com/DD7780/Cocreate/actions/runs/37954107608) also passes native SQL 2/2, compiler 10/10, browser 15/15 and full 244/244 with zero skips; [summary](../../artifacts/beta-access-requests/verified-main.json). Cloudflare build `fd9ea3ec-3fe7-4c3a-8564-f6bcc84f5ae3` succeeds for the same source. During non-atomic rollout, the new Worker with the old image returned the expected updating 503; the active version 41 image then passed all 11 anonymous checks with exact fingerprint equality. No gate, isolation quota or assertion was weakened.

Manual acceptance remains open under the user's explicit choice. Sending-domain verification is their report, and a configured key/sender is not inbox proof. No live Auth account/request or email test was created by the agent. Documentation/evidence uses a skip-ci commit after source release, without changing attested application/build inputs.

## Operations and manual acceptance

Reviewer permission is independently granted in private `beta_reviewers` using the verified account UUID. Both confirmed founder and cofounder retain their existing beta rows; the cofounder remains `is_owner=false`. Revoking a reviewer grant removes list/decision authority and cancels undispatched reviewer mail on the next claim. Revoking ordinary beta access still blocks private app/project access. Never edit user metadata to grant either permission.

Email rows expose `state`, `attempts`, `provider_message_id` and a bounded generic `last_error` to trusted administration only. `sent` means provider acceptance, not inbox receipt. After five attempts or the 23-hour dispatch horizon, failed/uncertain mail requires explicit operator reconciliation; there is no automatic reset or public resend endpoint. Removing email configuration retains queued rows without dispatch.

Manual checklist for the user:

1. Sign up with a separate tester account, confirm its email, sign in at `/app`, and submit **Request beta access** with an optional message. Check the pending status; repeat submission must keep one request.
2. Check both reviewer inboxes. Open **Review request**, sign in with founder or cofounder, and verify that opening/refreshing the link leaves it pending.
3. Choose **Give access**. Check the recorded reviewer/time, the requester's approval email and its `/app` link. Recheck access from the tester's pending screen; it should enter without deployment.
4. Confirm the tester cannot open another account's private project without membership. Repeat the decision using the second reviewer; it must show the existing result and send no second result email.
5. With another tester request, choose **Decline**. Check the decline email, absent beta access and displayed seven-day cooldown. Revoked access must remain blocked and require a separate administrator action.

Rollback: retain the additive tables, request history and delivery records. Restore a previously attested Worker/image together through the established release path; the old app does not expose this feature or drain its queue. Disable the cron if restoring an app that lacks the due-mail contract. Do not delete requests, clear revoked rows, reset delivery attempts or remove project data as rollback.
