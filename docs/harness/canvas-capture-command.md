# Canvas capture command replacement — 2026-10-17

## Change packet and baseline

Current main and isolated checkout both resolve to 038fa80. Runtime 0526cae and fingerprint ee2e582c… are preserved. Branch codex/canvas-capture-command reuses the clean managed worktree; the old dirty desktop checkout and the user's local preview data are protected. No hosted project is selected for mutation. The user previously chose manual provider acceptance; this request supplies no spend cap or migration authorization.

Replace the flush-then-submit boundary with one HTTP capture command. Keep WebSocket document/presence collaboration and the existing coordinator, interpreter, accepted registry, collection, builder, verification and private artifact engine. Receipt acknowledgement must depend only on canonical command admission, never provider work, artifact uploads or a full workflow checkpoint.

## Contract and authority

- One immutable versioned gesture envelope contains request ID, insertion/deletion cutoff and bounded uniquely identified local update bytes. It contains no client actor authority or whole-document brief.
- The server authenticates membership/actor, validates source identity and hashes, applies only new authenticated updates, and selects exactly the actor's eligible source records. Later IDs remain drafts. Pre-cutover attributed records require verified cutoff coverage.
- A fenced canonical capture journal transaction binds project/actor/request ID to payload hash, stable submission ID, source bytes/batch, accepted context, non-secret frozen configuration, document recovery bytes and capture order. Local SQLite uses the same contract; hosted acknowledgement requires the Postgres RPC. This journal extends the existing command authority, not a second workflow scheduler.
- Full checkpoints carry a capture cursor. Recovery overlays newer immutable commands and their Yjs bytes without overwriting newer checkpoint state. Old checkpoints cannot delete journal commands. Interrupted interpretation restores author drafts and requires explicit action; status/reconnect never dispatches inference.
- HTTP returns 202 after confirmed capture; authorized receipt lookup recovers unknown delivery. An unresolved mutation retains identity and blocks conflicting admission until fenced canonical lookup resolves it. No timeout cancels a writer or proves rollback.
- The account/project-scoped client controller persists source outbox and immutable pending identity using existing Yjs browser recovery storage. Ticket replacement changes credentials/transport, not command/document lifetime. Real scope loss still disposes access.

## Allowed implementation and verification scope

Client: Workspace/ProjectWorkspace, provider, replacement command controller, local recovery helpers and all direct callers. Shared: public capture envelopes/receipts and pure validators/coverage helpers. Server: room admission/recovery and receipt projection, event store, platform RPC adapter, authenticated routes, source provenance. Prepare one additive SQL migration with private RLS/service-only functions. Preserve provider retry/accounting repairs, isolation and all downstream authority checks.

Use graph neighbors confirmed in source: RoomManager.submitChanges, queueCapturedSubmission, recoverSubmissions, authenticatedDelta/applySteeringUpdate, immutable save receipts, EventStore, SupabasePlatform and ticket lifecycle. Reproduce provider destruction and acknowledgement held by interpreter before changing them.

## Deletion manifest

| Superseded component | Replacement / removal gate |
| --- | --- |
| src/submit-changes.ts and imports | One account/project-scoped immutable capture controller; remove after behavioral regressions move. |
| Provider flush map, flush timers/rejection and flush() | Ordinary collaboration saving remains; build receipt recovery uses HTTP command identity. |
| Workspace submissionRequest ref and flush/action chain | Controller creates frozen envelope at gesture; both button/shortcut use it. |
| POST /submit implementation | Explicit 426 upgrade response; no fallback engine and no draft consumption. |
| WebSocket flush/flushed/flush-error build wiring | Remove unused prerequisite after caller search; keep saved/save-error collaboration receipts. |
| RoomManager old capture/save/await-interpret body | One canonical capture admission returning before worker execution. Existing worker scheduler remains. |
| Implementation-specific tests/scripts | Replace with equivalent behavioral guarantees and explicit controlled processing waits. |

## Release and rollback gates

Reproduce teardown and blocked-interpreter behavior. Verify atomic receipt/source ownership, two authors/cutoffs/deletions, replay/hash mismatch, lost reply/cold restart, ticket refresh, revocation, snapshot overlap, ownership loss and failed provider/verification. Exercise native disposable Postgres contention and RLS denial without touching hosted data. Run built browser scenarios, boundaries, expanded cross-layer audit, strict build, full/native production-image tests, diff and AST graph refresh.

The prepared migration is additive and preserves all history. Older source ignores the journal and is not a safe rollback after new captures; rollback requires draining/quiescing command admission and materializing every journal entry into a compatible checkpoint, or keeping the replacement reader. No table/history deletion or destructive down migration. Production migration/release remains a separate dependent action until its exact package is verified and authorized.

## Implemented cutover and evidence ledger

The active path is Workspace button/editor shortcut → CaptureCommandController → POST commands/capture → canonical admission transaction → installed submission → existing steering queue/registry/collection/builder/verification/promotion. GET commands/requestId never dispatches. The server derives actor identity; payload includes only caller source IDs/bytes and a frozen Yjs clock/deletion frontier. HTTP/WebSocket source IDs make either delivery order idempotent. Pending author batches remain intact until canonical commit confirmation. Recovery bytes also retain unsubmitted coauthor provenance, avoiding lost attribution after an older checkpoint.

Deleted: src/submit-changes.ts; provider flush map, flush(), timeout/rejection/response handlers; Workspace submissionRequest and flush/action chain; RoomManager.submitChanges and full-snapshot/await-interpret admission; flushDocument and its ingress/delivery trace plumbing; shared/save-timing.ts; obsolete verify-save-timeout.mjs. Removed unused processNow/manual-correction inference and buildNow/flushAgents bypasses after caller checks (only two internal tests used buildNow; they now exercise the accepted-candidate worker/public retry boundary separately). Historical baseline.ts under artifacts is dated pre-change evidence, excluded from active compilation.

Kept: ordinary saved/save-error document receipts with insertion/deletion coverage; coalesced saving and recovery journal; existing single worker/scheduler, BYOK/budgets/physical ledger, source fences and private artifacts. /submit only returns HTTP 426. A legacy WS flush receives only an immediate flush-error/capture_upgrade_required so already-cached clients can show the reload instruction; it cannot capture, save or infer. Retire these upgrade-only gates after the replacement fingerprint is deployed and 30 days without legacy-client ingress, with a separate compatibility review. No fallback engine or feature flag exists.

Replacement tests use immutable test envelopes and explicit processing waits for older downstream scenarios; the fixture helper is not imported by runtime source. Superseded flush-only tests are removed; coverage now lives in capture-command, capture-http, submit-changes, provider-reconnect, local-drafts, save-throughput and existing authority/accounting/artifact suites. No security/resource assertion was weakened.

Fresh preparation evidence:
- baseline.log: provider destruction produces the inspected message; acknowledgement stays coupled to delayed interpretation. This does not prove the screenshot's destruction trigger.
- vertical-slice.log/focused-first.log and later intermediate logs preserve recovery-copy and installed-object dispatch bugs discovered and fixed during replacement.
- capture-focused-final.log: 22/22 pass, no skips (before final diagnostics/local-fence metadata additions); actual HTTP includes a 50 KiB unsent update, 202 receipt, replay conflict, actor-scoped lookup, unauthorized denial and upgrade-only old route.
- sql-first.log: actual prepared migration passes embedded PostgreSQL identity, provenance, stale-fence, RLS/grants, immutable-history and revocation checks. Native independent-connection contention is a separate CI step, not claimed by this embedded run.
- browser-fourth.log and browser/checks.json: built actual Workspace, controlled loopback interpreter, renewal while capture pending, duplicate click/shortcut, editable later drafts, receipt before blocked interpretation, lost response/reload/lookup with no resend and account scope change. Three controlled interpreter calls, zero paid calls, zero products (questions only).
- build-first.log: strict TypeScript + Vite build passed. Boundaries and expanded --scope full audit pass with zero boundary violations and zero Jev calls. Generated graph refreshed AST-only; missing optional SQL parser warning remains.
- windows-full-first.log: 257 passed, 20 failed, 8 platform skips. Failures include Windows resource/locked private-job cleanup, dependent compiler timing and the pre-existing dot-path SPA case; this is not a green regression claim. Preserve original failed artifacts and use native production-image gates independently.

The first three browser runs failed because the synthetic harness inherited a configured endpoint override and did not reach its loopback interpreter. The corrected harness pins its synthetic endpoint explicitly; no paid provider credentials are used. Native CI, final source identity and release status are recorded below when complete.

## Migration/release procedure and rollback

Review the exact additive migration `supabase/migrations/20261017150000_workflow_capture_commands.sql` and the tested source fingerprint together. It adds canonical immutable command/source journals, service-only RLS/grants and fenced commit/read RPCs. It does not rewrite documents, artifacts, receipts or existing history. Checkpoint writes continue under the existing coordinator row fence; journal replay after captureCursor prevents older checkpoints erasing new commands. Canonical read and commit share the project lock, making absence linearizable after an uncertain write. Owner/epoch/expiry and current membership are rechecked in SQL; SQLite admission checks its lease in the same transaction.

Before an authorized hosted rollout, retain a database backup, inspect migration history without reapplying old SQL, quiesce old coordinator ingress, apply this exact versioned migration, verify private grants/RLS and deploy the matching reader/server/client as one release. Admission fails closed if the new canonical RPC is unavailable. Resume capture only with the compatible reader; verify health/served fingerprint before the designated account's manual acceptance. No hosted mutation is part of preparation.

Rollback is forward-compatible: quiesce admission, retain all command/source tables and materialize every journal entry into a compatible checkpoint, or keep the replacement reader. Never deploy a journal-unaware old reader over newer commands; never drop tables, reset user storage or replay provider work to make rollback appear successful. A migration failure before any capture can leave old source active because the change is additive; do not run destructive down SQL.

Log copies with trailing whitespace are normalized for git diff checks; exact original bytes are retained beside them as .log.raw.gz. Candidate focused checks now pass 26/26 with no skips, including generic save diagnostics and throughput.
