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

Implementation is prepared. Strict TypeScript, build and import boundaries pass. Focused beta/request/SQL/project-auth checks pass 25/25, with no skips. Existing invitation sender regressions also passed. Local PostgreSQL semantics run against the already locked PGlite dependency; independent concurrent native PostgreSQL connections are a separate CI gate, followed by the unchanged production-image compiler/browser/full regression gates. No dependency was added.

The sender is `2guys1canvas <beta@2guys1canvas.com>`, as approved by the user. They report Resend Sending verified, with Receiving pending; receiving is not used by this outbound feature. Existing Resend credentials stay server-only. The selected Tokyo sending region is retained. The Worker checks the private due-mail RPC every five minutes and wakes the existing primary container only when needed; the application drains bounded batches on startup/mutations and every minute while running.

Production migration, explicit reviewer UUID grants, CI and active deployment observations will be recorded below. Current production remains source `915bebd` until those gates pass. No live account, request or email flow has been tested by this implementation session.

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
