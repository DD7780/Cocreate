# Harness status and outstanding work

Updated 2026-10-03 after Step 02 local implementation and verification; hosted SQL/deployment acceptance remains pending. This is the canonical active completion record. Product targets are in [product.md](../../product.md), contracts in [api.md](../../api.md), and boundaries in [architecture.md](architecture.md). Do not treat acceptance, source implementation and runtime verification as the same status.

## Evidence conventions

`[x]` means the specifically scoped evidence stated on that line exists; `[-]` means partial; `[ ]` means outstanding. A local/mock check never establishes hosted/provider/SQL correctness. The documentation cleanup reran no tests; fresh Step 01 checks are dated separately below. Older counts, attempts and limitations remain historical in the [dated archive](archive/2026-10-01-pre-consolidation/README.md).

## Multi-user roadmap Step 01

- [x] Read the complete roadmap/common contract and canonical steering; queried Graphify then verified later-step gaps against source. [Evidence matrix and Step 02 handoff](multiuser-step01-baseline.md) give executable local scenarios or precise external prerequisites for each material gap. Diagnostic fixtures only; application runtime unchanged.
- [x] Eleven controlled observation scenarios repeated three times (33 trials), with privacy-preserving timing/usage/outcome measurements and source hashes: [raw baseline](../../artifacts/multiuser-step01/baseline.json), [runner log](../../artifacts/multiuser-step01/baseline-run.log). Known-gap assertions are observations, not completed fixes or provider quality evidence.
- [x] Fresh local suite `pnpm test`: **140/140 passed**, including stale-owner local/RPC-mock checks and the eleven new scenarios; [log](../../artifacts/multiuser-step01/full-tests.log). Production `pnpm build` passed; [log](../../artifacts/multiuser-step01/build.log). SQLite experimental/chunk-size warnings remain informational.
- [x] Three independent Chrome profiles with synthetic signed local sessions and controlled provider: simultaneous submits/third draft, offline/reconnect/reload without inference, r3/v2/usage convergence, historical revision/drawers, rendered incorrect product and 1440/1024/768/390 px overflow checks. [Browser report](../../artifacts/multiuser-step01/browser/browser-checks.json), [local-auth fixture build](../../artifacts/multiuser-step01/browser-client-build.log), [browser log](../../artifacts/multiuser-step01/browser.log). Screenshots inspected; reference fidelity and complete save-state UX remain open. No hosted accounts or live provider.
- [x] AST-only `graphify update .`: 1,902 nodes/3,549 edges, no LLM calls; [log](../../artifacts/multiuser-step01/graphify.log). Optional SQL parser unavailable, so SQL was audited directly and real execution stays outstanding. Reviewed diagnostic diff, verified eleven source hashes, checked affected local documentation links and `git diff --check`; [verification summary](../../artifacts/multiuser-step01/verification.json).
- [ ] Steps 02–10 implementation and their acceptance remain unstarted by this task. Next: Step 02, with real SQL contention, migration application and owner-routing dependencies; Step 01 does not close those requirements.

## Multi-user roadmap Step 02

- [x] Local implementation complete: coalesced bounded claim/renewal, permanent lost-owner fencing, cancellation, fresh pre-dispatch/pre-promotion checks and authenticated owner retry. Retained existing primary-container affinity; no forwarding or second room hydration on non-owner ingress. [Handoff and rationale](multiuser-step02-handoff.md), D-0045.
- [x] Focused checks **31/31 passed**: delayed renewal/close, malformed epochs, loss during dispatch intent, loss after compilation, command replay, stale SQL-response invalidation, two server ingress/membership/WS checks and retained-draft bounded retry. [Log](../../artifacts/multiuser-step02/focused-tests.log). These are local/controlled/RPC mocks, not real Postgres contention.
- [x] Required final `pnpm test`: **148/148 passed**, zero failures; [log](../../artifacts/multiuser-step02/full-tests.log). Production `pnpm build` and strict verification-script typecheck passed; [build](../../artifacts/multiuser-step02/build.log), [script types](../../artifacts/multiuser-step02/script-types.log).
- [x] Three independent Chrome profiles/local signed sessions and controlled provider passed simultaneous submissions, reconnect/reload without inference, revision/usage convergence and responsive 1440/1024/768/390 px checks. Controlled owner outage reached a terminal reopen message after seven diagnoses, retained the draft and added zero interpreter/builder calls. [Browser report](../../artifacts/multiuser-step02/browser/browser-checks.json), [log](../../artifacts/multiuser-step02/browser.log), [fixture build](../../artifacts/multiuser-step02/browser-client-build.log). Retry, terminal, desktop and mobile screenshots inspected; reference/full save-state acceptance remains open.
- [x] Prepared additive [SQL hardening](../../supabase/migrations/20261003203000_coordinator_dispatch_updates.sql) and a [guarded real-contention runner](../../scripts/verify-coordinator-postgres.ts), with rollout/rollback notes in the handoff. Original SQL remains unchanged. Graph AST refresh, diff and affected documentation link checks passed; [graph log](../../artifacts/multiuser-step02/graphify.log), [verification summary](../../artifacts/multiuser-step02/verification.json).
- [-] Step 02 local scope is complete; **real database/hosted acceptance pending**. No migrated disposable local Supabase/Postgres database, psql/Postgres runtime or Docker is available. Runner refused execution without explicit disposable target/owner inputs: [prerequisite evidence](../../artifacts/multiuser-step02/postgres-prerequisite.log). No SQL was executed, migration applied, deployment made or paid inference used. Mocks do not establish two real database-backed instances cannot both mutate/promote.
- [ ] Steps 03-10 remain unstarted. Next requested task may execute Step 03 after reading this handoff/common contract, carrying unapplied migration and real contention/deployment prerequisites forward.

## Current implementation and dated evidence

- [x] 2026-10-01 local reliability run: 129/129 tests, production build, three independent signed local Chrome profiles with a controlled provider, responsive checks at 1440/1024/768/390 px, and AST Graphify refresh. See [report](reliability-verification.md) and [browser evidence](../../artifacts/reliability/browser-checks.json). No paid provider, hosted accounts, coordinator SQL execution or deployment was verified.
- [x] Source audit: current hosted setup follows the single [BYOK contract](../../product.md#hosted-ai-and-limits). New projects disconnected; generation-free validation, temporary memory lease, explicit exact model choices, owner-authorized spenders, expiry/restart reconnect and explicit accepted-build retry. Managed dispatch/old hosted AI routes are disabled.
- [x] Source plus 2026-10-01 controlled evidence: output-exhaustion recovery has a manifest of at most eight one-file tasks, validated complete operations, awaited source checkpoints and one 24-physical-call executor ceiling across recovery/retries/superseded candidates. Configured spending remains enforced; constants are not proven optimal.
- [x] Source plus controlled evidence: capture-order submissions, caller-only captured batches, persistent request receipts, retained active submissions, failed acceptance rollback, interrupted draft recovery, fixed-revision stale candidate rejection and legacy HTTP build retirement.
- [x] Source plus controlled evidence: ordered immutable saves, insertion/deletion receipts, flush failure before submission, reconnect cursor reset and rejection of older same-connection states.
- [x] Source plus local/RPC-mock evidence: SQLite owner takeover fencing and hosted lost-owner rejection. The additive coordinator migration exists; this line does not mark it applied.
- [x] Source plus controlled evidence: partial physical ledger deduplication/restore, final-record preference and optional usage field handling; recorded and generation scopes are separate from historical counters.
- [x] Source plus local browser evidence: Canvas Shared context, durable accepted revision selector, empty explanation, requirement drawer/action, separate partial usage card, stage and usage navigation. This does not establish reference fidelity.
- [x] 2026-09-30 historical SQL checks: non-revoking invitation and physical-ledger migrations were reported applied, preserving invitation/membership/snapshot fingerprints; replay, resend, confirmed-email role preservation and ledger reconciliation checks rolled back their synthetic rows. Preserve this narrower evidence; it does not prove the newer coordinator migration or deployed app.
- [x] Source plus earlier local coverage: participant-scoped validated IndexedDB recovery, 40 ms batching, bounded reconnect diagnosis, current project permissions, conflict selection and fixed platform shortcut.
- [x] Foundational source/evidence: versioned ordered SQLite events/content-addressed artifacts, legacy backups, safe workflow task/activity projections, audited apply/build/promote, unverified compilation state and restart interruption without inference.

## Immediate verification and operational work

- [ ] **Reference available; comparison pending.** Compare [supplied image](references/shared-context-reference.jpg) at its reference viewport, then responsive sidebar/card/actions, readable contrast and keyboard access. Current Studio Ivory is not a verified match. The earlier missing-image fact remains in the dated report.
- [ ] Review/apply both prepared coordinator migrations only under separate authorization, then run the Step 02 real Postgres contention runner and independent-instance takeover, stale epoch/atomic commit and membership checks. Repository status remains **prepared/unapplied**; no newer applied evidence was found. Hosted code fails closed without its RPCs.
- [ ] Independent hosted account checks: simultaneous submissions, third participant's unsubmitted draft, edit/reconnect/reload, submission during build, duplicate command, state/usage/artifact convergence, viewer denial and revoked access. Local browser sessions do not close these criteria.
- [ ] Authorized live BYOK checks: full generation, output-exhaustion recovery, provider completion metadata/account limits, bounded spending/calls, failure retention, reconnect/retry, owner/editor authority and actual provider accounting. Earlier real-key interpretation stopped at an obsolete gate and does not prove successful live builds.
- [ ] Live invitations: configure a verified sender/key, authorized test recipient and verify provider acceptance plus inbox/webhook result; account confirmation/recovery SMTP and fresh/expired/reused/cancelled auth flows also need designated accounts. No email was sent in this cleanup.
- [ ] Hosted authenticated project/invitation/mobile visual review; Firefox/Safari, Linux/macOS hardware, native zoom and screen-reader interaction checks remain open.
- [ ] Deployment and source-to-container provenance; post-deployment independent-account checks and rollback evidence. Historical Worker proxy success does not prove current app deployment.
- [x] Step 02 local routing policy: existing stable primary-container affinity plus bounded actionable authenticated HTTP 503/Retry-After on non-owner ingress. Identity/membership and request receipts preserved; no credential forwarding.
- [ ] Verify that owner retry/affinity and real fencing hold in the intended hosted deployment before increasing instances; local transport/RPC mocks cannot close this release prerequisite.
- [-] Step 01 measured a bounded 0/10/50-event embedded projection workload. Permanent receipt/body growth, per-delivery membership queries, large projects, real networks and production concurrency remain unmeasured; no retention/capacity claim follows from the sample.
- [ ] Complete private Storage archival/promotion/rehydration and older artifact-body restoration across cache/container replacement.

## Remaining reliability acceptance

These are gaps/refinements of existing D-0042 and the original human reliability request, not additional architecture decisions.

- [-] Actionable failure copy includes failed recovery task/completed count, retained version, call bound and next action. Verify recovery-attempt information and all failure categories in the visible UI; do not equate a server error string with complete client acceptance.
- [-] Shared client states expose save/connection and build progress. Audit understandable syncing, saved, submitting, accepted, queued, building, disconnected and failed states, with participant-specific status and no false saved label.
- [-] Source scoping removes unsubmitted canvas context from the primary submission path. Step 01 reproduces accepted unresolved references and invented source passages while preserving stamped caller identity. Validation fixes, broader replacement edits and legacy reinterpretation ordering/context remain open.
- [-] Duplicate commands, restart drafts and stale owners have controlled coverage. Audit durable submission/batch/run linkage and receipt retention policy; automatic interrupted resumption remains unimplemented and must not silently spend.
- [ ] Evaluate recovery task/call bounds against realistic authorized workloads; do not label eight/24 optimal or increase effort as unverified output-cap advice.
- [-] Current accepted revisions and usage converge in three controlled browser sessions. Reference fidelity, complete usage-panel scope/reason labels, keyboard/contrast acceptance and hosted replay/convergence remain to verify.

## Accepted deferred implementation

### Durable workflow control and permissions

- [ ] Structured revision-safe steering beyond current submissions, controller/contributor/viewer workflow roles distinct from current project roles, and authorized control handoff.
- [ ] Pause/resume/cancel with enforceable execution effects, scoped standing permissions and approvals bound to normalized action hashes; changed actions must not reuse approval.
- [ ] Approval persistence/recovery, adversarial authority checks and uncertain external outcomes reconciled before retry.
- [ ] Replay/projection and schema-migration coverage for every derived view; session/verification/decision/approval event coverage.
- [-] Conflict selection API/cards, affected-contributor choices and stale rejection exist. Complete document highlights, compromise/reopen confirmation, bounded semantic detection and finer dependency scope; preserve disagreement history.

### Execution, tools and evidence

- [ ] Real process/container isolation, stripped secrets, enforceable timeout/resource limits/cancellation.
- [ ] Dependency scheduling and justified bounded workers in isolated workspaces with one serialized integration/promotion boundary.
- [-] Registry policies cover apply/build/promote. File list/read/search, approved test commands, preview/browser, web and database tool expansion remain deferred, not blanket authority.
- [ ] Approval-bound and cross-workspace/path/resource adversarial matrix; broad logs/artifacts credential scanning and provider-switch preservation scenarios.
- [-] Compile/tool evidence and bounded repairs exist. Map accepted requirements to implemented/verified/failed evidence and targeted acceptance/regression checks that gate promotion.
- [ ] Compact run details covering trigger, requirements, steps, tools, approvals, failures, evidence and usage; Update ready behavior preserving active preview interaction where practical.

### Context, accounting and recovery

- [ ] Provider-aware input token budgeting and retrievable references for omitted context.
- [-] Personal/executor physical ledger adoption, pre-dispatch hosted persistence and hydration exist. Reconcile orphaned/uncertain dispatches after restart and older pre-ledger calls only from actual provider/export evidence.
- [ ] One durable per-workflow budget across interpreters, executor, setup/tests, repairs/retries, cancellation and uncertain outcomes; executor's current 24-call budget is narrower.
- [ ] Capability-result expiry/reuse keyed by provider/model/configuration/test version; authorized comparative quality/cost/latency and invoice reconciliation.
- [ ] Full offline project startup, device retention/account purge controls and event/artifact retention policy; cache never substitutes for access authority.
- [ ] Analyst ingestion/isolated computation and Researcher retrieval/source/citation verification prerequisites before any activation.

Managed relaunch, checkout, old wizard/mode UI and retired effects are not active backlog obligations. Preserve their rationale/compatibility in [decisions](decisions.md) and [archive](archive/2026-10-01-pre-consolidation/README.md). The rejected invitation revoke-on-retry idea is closed by D-0037; current resend preserves prior links and roles.

## Documentation cleanup verification

- [x] Read canonical documents, queried Graphify before source investigation, verified selected source boundaries and audited the original human request.
- [x] Consolidated active guidance and historical evidence; fixed duplicate decision IDs by meaning; retained accepted deferred requirements.
- [x] Documentation links, decision IDs/references and `git diff --check` validated at cleanup completion; see [audit record](documentation-cleanup.md) for scope and results.
- No application tests/builds, browser comparison, Graphify update, provider spending, migration or deployment was performed for this documentation change.
