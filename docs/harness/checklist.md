# CoCreate harness implementation checklist

## Workflow-first pivot — Phase 1 durable workflow slice (2026-09-23)

- [x] Wrote the source-backed implementation map before changing orchestration boundaries. Reused the existing event/artifact/run store; did not introduce a competing source of truth.
- [x] Added additive `workflow_state` and `task_state` projections with stable IDs, schema migration version 2, validated workflow/task transitions, controller/control-epoch fields, requirement revisions, dependency arrays, assigned worker, acceptance criteria, evidence state, run linkage, artifact provenance, and timestamps.
- [x] Wrapped the current serialized Developer executor in one durable task created before dispatch. Queue, run, verification, stale, failure, cancellation, and completion outcomes append attributable events. Compilation/promote completes with `unverified` evidence unless real acceptance checks pass.
- [x] Restart recovery interrupts active runs and their tasks, moves the workflow to `awaiting_input`, and never automatically repeats the external operation.
- [x] Added `RoomView.workflow` plus authenticated `GET /api/rooms/:id/workflow/events?after=&limit=`. Activity is ordered and cursor-based, exposes safe summaries only, and omits raw payloads/private document content.
- [x] Added a workflow overview, readable task plan, safe live activity, and artifact verification state to the existing dark workspace while retaining the collaborative brief, submission shortcut, provider configuration, and Product preview.
- [x] Focused workflow/recovery and container tests passed 9/9 after correcting an obsolete final-event assertion; the schema initializer now applies SQLite busy timeout before requesting WAL mode.
- [x] `pnpm build` passed: 34.45 kB CSS / 6.95 kB gzip and 768.29 kB JavaScript / 243.46 kB gzip, with the existing non-failing chunk-size warning.
- [x] Full controlled suite passed 72/72 using the established temporary Windows user-info shim after the host `uv_os_get_passwd` ENOMEM fault; the shim was removed. No paid provider calls ran.
- [x] Current-source Windows Chrome smoke passed the durable workflow overview/controller/activity cursor, Recommended/Advanced semantics, editor-only Alt+X and remapping, focus preservation, Product empty state, invalid-session recovery, and 390px no-overflow layout.
- [ ] `graphify update .` could not run because the Graphify executable is not installed/on PATH and this workspace has no recorded Graphify Python runtime. The existing graph is stale for this slice; source, tests, build, and browser behavior were verified directly.
- [ ] Phase 2: durable membership roles, structured/revision-safe steering commands, conflict/decision integration, pause/resume/cancel, scoped approvals, and authorized control handoff.
- [ ] Phase 3: dependency scheduling, bounded workers in isolated workspaces, shared budget accounting, durable leases/fencing, stale-result integration guards, and serialized promotion.
- [ ] Phase 4: deployed durable records/blob storage across container replacement, uncertain-side-effect reconciliation, approval recovery, and adversarial authorization verification.

## Truncated structured-output recovery — 2026-09-22

- [x] Confirmed that a spending limit and a per-call output-token allowance are independent: increasing the USD ceiling does not change the provider request's `max_output_tokens`.
- [x] Added one bounded compact retry when a structured interpreter/executor response reaches its output-token allowance. The retry uses the existing two-call reservation and preserves reported usage from both calls.
- [x] If the compact retry also truncates, the error now explains the distinction and directs the owner to reapply a higher Recommended effort or choose a larger-output model.
- [x] Raised new Developer executor allowances to 8K / 12K / 20K / 32K for Light / Medium / High / Extra and aligned Advanced's default executor allowance with Medium at 12K. Existing frozen runs are not silently changed.
- [x] Current-source production build passed; current-source compiled tests passed 71/71, including synthetic one-retry, repeated-truncation, usage aggregation, spending-limit, routing, and submission coverage. No provider credits were used.

## Visible model discovery — 2026-09-22

- [x] Fixed Advanced API setup so the response from **Discover models** is retained immediately instead of depending only on a later room-state broadcast.
- [x] Added a visible discovered-model selector, model count, and result-specific status while preserving exact manual model-ID entry and existing capability checks.
- [x] Added a synthetic-provider Windows Chrome regression check proving two returned model IDs are visible and selectable and that discovery itself does not run a paid model test.
- [x] `pnpm build` passed. `node tests/connections-ui-smoke.mjs` passed against the production server with `synthetic/fast` and `synthetic/capable`; the compiled server suite passed 69/69. No provider credits were used. The direct `tsx` launcher was unavailable in the final environment because Node `uv_os_get_passwd` returned `ENOMEM`, so the already-compiled suite was run directly.

## Exactly three modes — 2026-09-22

- [x] Replaced the user-facing General app, Engineer, Designer, Web developer, and Motion designer selector with exactly Developer, Analyst, and Researcher.
- [x] Kept Light, Medium, High, and Extra as effort settings within the selected mode; Advanced manual model selection remains available.
- [x] Preserved n personal interpreters plus one shared executor. Developer configures the existing app workflow; no additional permanent agent roles were added.
- [x] Analyst is visibly unavailable with its validated-ingestion and isolated-computation prerequisite. Researcher is visibly unavailable with its controlled-retrieval, source-capture, and citation-verification prerequisite. Neither can be applied or silently routed through Developer.
- [x] Active legacy coding presets normalize to Developer without changing saved assignments, encrypted credentials, effort, participant overrides, resolved models, or spending ceiling. Historical run specialty fields remain intact.
- [x] Updated types, server routes, deterministic routing, evaluation protocol, accounting comparison keys, UI, browser assertions, and steering documents to the three-mode contract.
- [x] `pnpm build` passed; the focused mode/accounting suite passed 16/16 and the complete compiled suite passed 69/69 serially.
- [x] Fresh production-server Windows Chrome checks showed exactly the three modes, no legacy specialty labels, four effort controls, explicit Analyst/Researcher prerequisites, disabled unavailable-mode activation, preserved Advanced setup, Alt+X behavior, Product state, invalid-session recovery, and 390px layout. The rendered mode selector was visually inspected.
- [ ] No paid provider inference, Analyst/Researcher tool execution, deployment, or non-Chromium hardware/browser validation was run.
- [ ] `graphify update .` was attempted after this slice, but the Graphify executable remains unavailable; the stored graph is stale.

## Reliable API connection entry — Phase 1, 2026-09-21

- [x] Reproduced the missing-testing experience: named connections, four capability checks, manual model IDs, encrypted credentials, and assignments existed, but the route between Recommended and Advanced did not clearly explain how owner API models power the preset.
- [x] Following explicit product direction, API connections leads with Recommended. It states that the owner's checked API powers the setup, exposes prominent Connect/manage Advanced actions, and returns to Recommended without deleting connections, assignments, or overrides.
- [x] Preserved add/edit/disconnect, seven provider choices, endpoint/format configuration, secret reuse, optional discovery, manual model IDs, and interpreter/shared-executor assignments.
- [x] Renamed and explained model results as Authentication & reachability, Text generation, Interpreter structured output, and Developer executor operations. UI states that explicit tests make real provider requests and may consume usage; opening or changing settings remains inference-free.
- [x] Production build passed with the existing non-failing chunk warning. The first parallel compiled suite reached 65/66 before one SQLite initialization returned `database is locked`; the isolated assignment file passed 4/4. After adding the collaborator authorization/redaction case, the focused connection suite passed 2/2 and the full compiled suite passed 67/67 with test concurrency set to one.
- [x] Fresh production-server Windows Chrome checks passed the Recommended-first API entry, all seven providers, Ollama no-key guidance, assignment labels, Advanced/Recommended round-trip, Alt+X regression, Product state, invalid-session recovery, and 390px layout. A captured Advanced modal render was visually inspected for layout and legibility.
- [ ] Managed AI/account authentication/quotas/ledger/payments are not implemented. No deployment secrets or payment-provider configuration were added.
- [x] The three-mode contract and Developer migration are implemented; Researcher and Analyst correctly remain unavailable until their tool and verification prerequisites exist.
- [ ] No paid provider test, payment event, deployment, or live commercial validation was run.
- [ ] `graphify update .` was attempted after the code changes, but the Graphify executable is still unavailable; the stored graph remains stale for this slice.

## Evidence-based model routing slice — 2026-09-20

- [x] Replaced fixed $0.25/$0.75/$2/$4 defaults with rate-derived estimated one-pass maximum and separately labeled spending limit.
- [x] Added explicit catalog, pricing, routing-rule, and evaluation-protocol versions.
- [x] Retained one selected provider by default and preserved Advanced manual assignments.
- [x] Added deterministic complexity classification and no-model-call routing that retains the validated economical Developer baseline while comparison evidence is absent.
- [x] Added an implemented Developer task rubric, explicit unavailable-mode evaluation results, repeated-trial thresholds, and satisfaction, verification, regression, latency, total-cost, and cost-per-verified-build metrics.
- [x] Added immutable promoted-version run records; compilation is separate from unmeasured requirement/regression verification.
- [x] `pnpm build` passed on 2026-09-20 (existing non-failing Vite chunk-size warning remains).
- [x] Earlier in-app Chromium evidence for the retired five-specialty selector is historical and superseded by the three-mode verification section above.
- [x] Compiled Node test fallback passed the complete then-current suite 57/57 plus the final routing suite 7/7 on 2026-09-20; the direct `tsx` launcher still fails before loading tests with the host's `uv_os_get_passwd ENOMEM` defect.
- [ ] No paid repeated trials were run because no evaluation budget was authorized; the Developer model recommendation remains a hypothesis.
- [ ] `graphify update .` was attempted but this workspace still has no Graphify executable; the existing graph is stale for this slice.

## Pricing presentation and accounting slice — 2026-09-20

- [x] Expanded the canonical catalog in `server/ai-presets.ts` with official source URLs, verification dates, USD input/cached-input/cache-write/output rates, reasoning treatment, long-context tiers, and known routing/storage charges. Unsupported cached pricing is absent, never zero.
- [x] Setup displays interpreter and builder rates/allowances separately, explains per-interpreter versus shared-builder scope, and labels the estimated one-pass maximum, incomplete bounded maximum, and spending safety ceiling distinctly.
- [x] Provider normalization records cached input, cache writes, output, and separately available reasoning usage. Reasoning already included in output is not charged twice.
- [x] Persisted run ledgers break calls into interpretation, builder, and repair phases; retain pricing snapshots, unknown/timeout usage, estimated charge, outcome, latency, and explicit verification status; one shared builder is counted once.
- [x] Product exposes the latest run ledger and comparable metrics. Fewer than three comparable runs or zero verified successes report `Not enough data`; compilation-only runs are not marked verified.
- [x] Synthetic accounting/provider tests cover uncached/cached/cache-write math, included reasoning, multiple interpreters plus one builder, repairs/failures/missing usage, tiers, pricing-version changes, estimate/spending-limit separation, sample thresholds, and no-success handling. No provider credits were used.
- [x] After one assertion correction and compatibility cleanup, the compiled Node fallback passed 66/66 controlled tests. The direct `pnpm test` launcher still fails before loading tests with the host `uv_os_get_passwd ENOMEM` defect.
- [x] Final `pnpm build` passed with only the existing non-failing Vite chunk warning. Fresh-server Windows headless Chrome passed Recommended pricing labels, Advanced owner setup, editor-only Alt+X, remapping/focus, Product empty state, invalid-session recovery, and 390px no-overflow checks.
- [ ] No live provider invoice reconciliation, paid model evaluation, successful-run accounting screenshot, Linux/macOS hardware run, or non-Chromium browser run was attempted.

Status is evidence-based: `[x]` verified, `[-]` partial, `[ ]` not implemented.

## Collaboration persistence and auth callback repair (2026-09-26)

| Agreed requirement | Current implementation | Verification | Remaining gap |
| --- | --- | --- | --- |
| Durable collaborative canvas must survive reload/build | Yjs V1 bytes now use explicit Postgres hex writes; legacy Buffer JSON is strictly decoded and validated before hydration | Read-only production audit: 16/16 snapshots had the reported malformed representation; 1,500/1,500 legacy updates decoded, passed Yjs validation, and matched stored hashes | Deploy application code; two-account live production replay remains |
| Failed records must not destroy good data | Original rows remain untouched; quarantine is server-only; invalid snapshots recover only from validated/hash-matching history | Synthetic codec regression passes; production backup contains 16 snapshots and 1,500 updates matching originals byte-for-byte; RLS enabled with no `anon`/`authenticated` read grant | Live recovery path remains to be exercised after deployment |
| Submission captures acknowledged participant edits once | Existing WebSocket flush precedes idempotent participant-scoped `/submit`; serialized builder promotion remains unchanged | Existing collaboration, idempotency, reconnect, and integration tests pass | Two separately authenticated hosted sessions were not available locally |
| Login must not show a false expired-link error | Callback initializes session, strips parameters, exchanges once, distinguishes cancellation, and offers explicit Continue/Switch for a surviving session | Focused callback tests cover success, cancellation, reused code, existing session, and safe return paths | Live Google cancellation/reused-link checks require designated accounts |
| Preserve agreed product direction | Workflow-first authority, Developer/Analyst/Researcher availability, effort, model selection, accounting, sharing, and visual direction remain unchanged | Canonical documents reconciled with source | Analyst/Researcher tools remain intentionally unavailable |

- [x] Confirmed the exact production root cause using redacted hashes and byte prefixes; no token, credential, project content, or raw project identifier was logged.
- [x] Added strict byte encoding/decoding, isolated Yjs validation, original-byte quarantine, and hash-verified update-history recovery.
- [x] Added callback single-flight/session-aware behavior without weakening Google, password, confirmation, recovery, invitation, RLS, or membership checks.
- [x] Full deterministic suite passed 92/92; production TypeScript/Vite build passed with only the existing large-chunk warning. No paid provider request was made.
- [x] Applied the additive production quarantine migration. It copied all 1,516 affected records without changing originals; byte equality, RLS, and denied client read privileges were verified.
- [ ] Application code is not deployed. Production is therefore backed up and diagnosed but not yet claimed fixed.
- [ ] Fresh/valid/expired/reused/cancelled auth and the full two-account hosted collaboration checklist require live designated sessions.

## Email invitations, complete auth, project names, and segmented effort (2026-09-25)

- [x] Added Google-preserving email/password signup, confirmation resend, login, non-enumerating recovery, authenticated password update, logout, and safe local return destinations through the existing Supabase client.
- [x] Added non-destructive invitation schema changes: normalized recipient email, delivery state, explicit member `can_share`, active-recipient uniqueness, bounded create/resend rate, hashed tokens, and transactional confirmed-email acceptance.
- [x] Added server-authorized member/invitation listing, multi-recipient editor/viewer invitations, resend, revoke, role updates, owner-controlled sharing permission, and a server-only Resend adapter with deterministic idempotency keys and truthful failure/configuration states.
- [x] Replaced immediate link sharing with the Share project dialog; it shows current members, roles, pending invitations, delivery state, resend/revoke controls, and recipient-bound copy links as a secondary action.
- [x] Added named or Untitled project creation, owner-only header/sidebar rename, stable IDs, 120-character server validation, polling-based participant refresh, folder-outline icons, truncation, and full-title tooltips.
- [x] Replaced the canvas effort select with a Low/Medium/High/Extra accessible radio group while retaining stored `light`; canonical rates and this-project provider usage remain immediately below it.
- [x] TypeScript passed and the full synthetic suite passed 91/91. Focused auth/invitation tests passed 12/12 without provider credits.
- [x] Applied `202609250001_email_invitations_and_sharing.sql` to the configured `dnsapasubeoxxsgkiotw` Supabase project through its session-mode pooler; read-only follow-up found `can_share`, recipient/delivery/resend columns, and create/resend/accept functions.
- [-] Public Auth settings report email and Google enabled, signup enabled, and auto-confirm disabled. Account confirmation, recovery, allowed redirect URLs, RLS/role denial, wrong-account/expired/revoked/duplicate acceptance, and cross-account rename/invite behavior still require designated live accounts and inbox testing.
- [ ] Configure and verify Supabase custom SMTP plus `RESEND_API_KEY`/`COCREATE_EMAIL_FROM`; a provider-accepted invitation and designated-recipient receipt have not been observed.
- [x] Production build passed with the existing non-failing large-chunk warning. Production-mode Windows Chrome smoke passed Recommended/Advanced setup, the four-option segmented effort control, editor-only Alt+X/remap/focus, compact workflow, Artifacts empty state, invalid-session recovery, and 390px zero-overflow layout.

## Draggable effort toggle and visible project naming (2026-09-25)

- [x] Upgraded the canvas effort picker to a true four-position range toggle: pointer dragging, track selection, and keyboard changes commit through the same owner-only inference-free effort mutation.
- [x] Kept Low mapped to stored `light`; disabled/read-only states, frozen active runs, Recommended/Advanced behavior, and future-submission semantics are unchanged.
- [x] Kept project names mandatory for named creation (with an explicit Untitled choice), retained owner-only persisted rename, and added an always-visible pencil affordance beside the current title.
- [x] Increased the visibility of the existing folder-outline icon before every sidebar project while preserving truncation and full-title tooltips.
- [ ] Verification pending for this slice.
- [ ] Firefox, Safari, Linux, macOS, hosted account/project UI, and native screen-reader testing remain outstanding.
- [ ] `graphify update .` was attempted after the code changes, but the Graphify executable is not installed/on PATH; the existing graph remains stale for this slice.

## Foundation and first vertical slice

- [x] Repository capability/gap assessment exists. Evidence: `docs/harness/assessment.md`.
- [x] Architecture, migration, rollback, retention, and deployment constraints are documented.
- [x] Versioned SQLite schema with append-only ordered events, content-addressed artifacts, and derived workspace/run views.
- [x] Existing/new room snapshots are immutable artifacts; a missing workspace view reconstructs from event history.
- [x] Legacy JSON is backed up before lazy import; generated projects are untouched; JSON compatibility writes remain.
- [x] Document updates record authenticated participant attribution, input revision, hash, and Yjs artifact.
- [x] Builder runs use enforced legal states and recovery marks nonterminal work `interrupted`.
- [x] Candidate apply, compile verification, and promotion pass through one typed tool registry with durable request/policy/start/outcome events.
- [x] Personal-agent and unknown tool use is denied before execution.
- [x] Promotion remains revision-guarded, bounded to three compile/repair attempts, and preserves the last successful Product on failure.
- [-] Personal interpretations, the stable shared-requirement registry, contradictions, and promoted products are durably snapshotted and attributed, but requirement/specification/evidence projections are not yet separate SQL tables/views.
- [-] Started-without-outcome tool calls remain visibly unknown through their event trail and interrupted run, but automatic idempotent reconciliation is not implemented.

## Phase 1 — durable records and recovery

- [-] Workspace, participant, document, interpretation, run, tool, artifact, and product events exist. Session, usage-budget, verification-evidence, decision, and approval event coverage remains.
- [x] Local restart reconstructs document, requirements, latest successful product, and run state without an AI call.
- [ ] Pending approvals survive restart (approval schema exists; approval workflow does not).
- [ ] Replay/projection tests cover every derived view and schema migration.
- [ ] Cloudflare deployment uses a proven durable application store.

## Phase 2 — tools and policy

- [-] Registry metadata and deny-by-default policy exist for apply/build/promote. File list/read/search, test commands, preview lifecycle, browser checks, web, and database tools remain.
- [ ] Real process/container isolation with secret stripping, enforceable timeout, resource limits, and cancellation.
- [ ] Approval-bound operations and standing permissions.
- [ ] Cross-workspace and path/resource-scope adversarial test matrix.

## Phase 3 — durable orchestration

- [-] Builder lifecycle is durable and participant extraction is revision-guarded. Personal-agent run states, immutable build-input records, and durable leases remain.
- [x] Personal outputs classify each distinct intent as proposal/question/explicit request/decision/ambiguity; mixed contributions retain separate rationale/source attribution, and only explicit requests and decisions enter accepted builder input.
- [x] Targeted reinterpretation reuses the latest authenticated edit batch, versions the interpretation, preserves stable requirement identity and other contributors, refuses decisions/withdrawals, and avoids duplicate builds when accepted input is unchanged.
- [x] Accepted same-subject/scope alternatives form durable multi-option groups; pending, unanimous, disagreement, stale-revision, authorization, and idempotency rules are deterministic.
- [-] Unresolved alternatives are excluded and independent accepted requirements remain buildable; dependency metadata is currently coarse subject/scope rather than a full dependency graph.
- [ ] Context assembly uses explicit budgets and references to omitted material.

## Phase 4 — verification and bounded repair

- [-] Compile/tool evidence and bounded repair are recorded. Accepted requirements are not yet mapped to targeted/browser/regression evidence.
- [-] Proposed, accepted, withdrawn, and superseded requirement states exist. Implemented/verified/failed/unverified evidence states remain.
- [ ] Browser acceptance and affected-behavior regression checks gate promotion.

## Phase 5 — approvals and inspection UI

- [ ] Normalized action-hash approvals with role authorization and restart persistence.
- [ ] Compact Run details UI with trigger, requirements, steps, tools, approvals, evidence, failures, and usage.
- [ ] “Update ready” behavior that preserves active preview interaction where practical.

## Phase 6 — end-to-end hardening scenarios

- [x] Simultaneous participant edits remain attributed (existing controlled integration/unit tests).
- [-] Explicitly submitted accepted changes produce a compiled, revision-guarded product with audited tools; browser acceptance is not a promotion gate.
- [x] Proposal is not silently accepted; focused tests prove it is visible and excluded from builder input.
- [-] Deterministic known structured contradictions form multi-option groups and preserve restart state. Authenticated selection endpoints, compromise/reopen flows, semantic detection, cards, and highlights remain.
- [x] Edit during build cannot stale-overwrite newer input (revision-guard test).
- [x] Forbidden tool operation is denied before execution (focused policy test).
- [ ] Approval survives restart and cannot authorize a changed action.
- [x] Crash/restart leaves an executing run as `interrupted`, never successful.
- [ ] Uncertain external outcome is reconciled before retry.
- [x] Failed candidate preserves last successful preview (existing integration test).
- [x] Repeated compile repair stops after three attempts (existing integration test).
- [-] Provider assignments/state survive restart; provider-switch preservation needs a dedicated scenario.
- [-] Event payload secret-field redaction is tested; broader logs/artifacts credential scanning remains.
- [ ] Cross-workspace record and generated-file access denial is adversarially tested.
- [x] Restart reconstructs document, requirements, latest product, and run state without an AI call.

## Verification evidence for this slice

- Intent-classification and targeted-reprocessing fix (2026-09-18): the original restaurant assignment regression failed before the behavior change, then passed after per-intent normalization and reconciliation. The controlled matrix covers direct imperatives, polite requests, stated wants, spelling mistakes, missing details, genuine proposals, informational questions, quoted imperatives, hypotheticals, negated requirements, mixed contributions, and missing labels. A provider-backed RoomManager test proves authenticated-source reuse, immutable `interpretation.reinterpreted` history, stable IDs, no duplicate build on unchanged retry, and decision protection. Full `pnpm test` passed 41/41; `pnpm build` passed with only the existing non-failing Vite chunk-size warning. Live-provider semantic evaluation was not run.

- Builder-operation reliability fix (2026-09-18): the operation schema now requires string `content` for every write/delete, model plans are validated against the current project before tool execution, one bounded corrective generation receives the exact validation failure, and terminal run records retain the last attempt number. Focused suite 18/18 passed; full `pnpm test` 36/36 passed; `pnpm build` passed with only the existing non-failing Vite chunk-size warning.
- Durable conflict-group slice (2026-09-18): focused suite 18/18 passed; full `pnpm test` 35/35 passed; `pnpm build` passed with only the existing non-failing Vite chunk-size warning. Coverage includes completed-round immutability, idempotent retries, and legacy pairwise-record migration.
- Covered: red/green and red/green/blue grouping, compatible subjects/conditions, proposal exclusion, pending/unanimous/disagreement outcomes, stale and unauthorized submissions, idempotency, restart persistence, and independent builder eligibility.

## Cloudflare availability and collaboration repair evidence (2026-09-18)

- [x] Removed the custom container `fetch()`/`containerFetch()` path and restored Cloudflare's native WebSocket-aware container proxy.
- [x] Added a container application-health endpoint and configured `pingEndpoint` for readiness checks.
- [x] Replaced runtime-generated secrets with required encrypted Worker secrets; `SESSION_SECRET` and `CREDENTIAL_ENCRYPTION_SECRET` were configured without storing their values in the repository.
- [x] Focused application, Yjs collaboration, and deployment-regression tests passed: 10 tests, 0 failures.
- [x] Production client build passed and Wrangler's Worker-only deployment dry-run validated the Worker bundle, Durable Object binding, and container declaration.
- [x] The corrected Worker proxy was deployed as version `fc69aa28-191b-48c7-82af-7dc537acb5af`; the public homepage returned HTTP 200 and a live two-participant check confirmed authenticated WebSocket edit synchronization.
- [-] Local container-image dry-run is unavailable because Docker Desktop is not running. The Worker repair is live against the existing image; the direct Node container startup command will take effect on the next full Cloudflare image build from `main`.
- [ ] Container-local SQLite and generated files remain ephemeral across container replacement; a proven durable application store is still required.
- Not yet claimed: HTTP mutation contracts, browser synchronization/cards/highlights, compromise confirmation, or live-model semantic detection.

## Submission shortcut slice (2026-09-19)

- [x] Typing and autosaving make no provider calls; only an authenticated participant submission invokes their interpreter.
- [x] Submissions persist request ID, participant, edit sequence IDs, document revision, immutable shared-document snapshot, previous interpretation reference, lifecycle status, and timestamps.
- [x] A WebSocket flush acknowledgement orders the final collaborative update before submission capture.
- [-] A three-second debounce batches eligible accepted changes while one builder remains serialized. Full draft isolation is not established: personal-model context includes shared text, and the legacy build API can flush all drafts. Durable frozen batch membership remains unfinished.
- [x] **Build my changes** and editor-scoped Alt+X use the same submission function. Empty and repeated submissions make no additional model call.
- [x] Exact shortcut filtering covers repeats, composition, AltGraph, Ctrl/Shift/Meta additions, ordinary Enter/B, disable, and Alt+S/Alt+Y remapping. macOS defaults to disabled.
- [x] Tooltip and `aria-keyshortcuts` expose the active binding; the preference is stored locally.
- [x] Production-mode Chrome check passed for editor-only handling, dialog exclusion, focus preservation, remapping, product view, and 390px layout.
- [x] Full controlled suite passed 45/45 and `pnpm build` passed with only the existing non-failing Vite chunk-size warning.
- [-] Windows Chrome was exercised. Linux browser behavior is covered by shared event semantics but was not run on Linux; macOS default behavior is unit-tested but was not run on macOS hardware.
- [ ] The broader attached workflow still needs durable cross-restart resumption of queued submissions and richer per-submission status UI.

- TypeScript: `node node_modules/typescript/bin/tsc --noEmit --pretty false` passed.
- Focused event/recovery/policy tests: 5 passed with direct Node test execution of TypeScript-emitted files.
- Full controlled suite for the shared-intent slice: 27 passed with the repository-standard `pnpm test`, including the three-collaborator accepted-requirement-to-preview flow.
- Focused shared-intent/recovery suite: 10 passed, covering stable IDs, attribution, proposal exclusion, contradiction gating, explicit multi-author withdrawal, automatic build suppression, and restart recovery.
- Production build: `pnpm build` passed; Vite emitted the client bundle with a non-failing large-chunk warning.
- The standard `tsx --test tests/*.test.ts` launcher completed successfully.
- Live provider generation: not run; no credential is required or requested for this controlled slice.

## Pivot source audit and acceptance gaps (2026-09-19)

Documentation-only source inspection; historical test counts above are retained, not new executions.

- [ ] Enforce participant-only submission on every public mutation path; remove/restrict legacy all-draft `/build` behavior and audit `/process` and reinterpretation semantics.
- [ ] Personal output can authorize only captured participant edits; adversarial tests show another user's unsubmitted imperative in shared context cannot become accepted intent.
- [ ] Persist immutable submission/batch/run links; test simultaneous submissions, slow interpreters, edits during a build, and next-batch isolation.
- [ ] Resume queued/interrupted submissions safely after restart; define durable deduplication retention beyond the last-200 room list and prevent retry double spending.
- [ ] Complete authenticated conflict-choice APIs and cards below Shared intent, document highlights, multi-option Disagreements, compromise/reopen rounds and stale-choice rejection. Silence must stay pending; dependent work must stay blocked.
- [x] Added owner-only Recommended mode/effort setup with explicit confirmation, exact checked models from one available connection, provider-currency rates, versioned provisional evidence, and preserved Advanced connections/assignments/overrides; no unannounced fallback.
- [-] Long-document scrolling, editor usability, shortcut accessibility, and reconnect behavior are verified in Windows Chrome. Linux, macOS, Firefox, and Safari hardware/browser runs remain outstanding.
- [-] Recommended runs now freeze model IDs/versions, output ceilings, repair ceilings and conservative server-side currency reservations with uncertain timeout retention. Input preparation remains compacted but does not yet expose retrievable omitted references; provider-specific cached/reasoning/tool billing may remain uncertain.

## Specialty preset evidence (2026-09-20)

- [x] Pure resolution rejects discovery-only models until personal/builder schema checks pass and preserves one connection/data destination.
- [x] Existing/manual assignments migrate to Custom; applying Recommended preserves dormant Advanced overrides.
- [x] Selector preview is read-only and owner-only; application re-resolves server-side and rejects an underfunded cap.
- [x] Submission and builder records freeze their resolved policy; reservations are persisted before calls and concurrent/repair reservations fail closed at the cap.
- [x] Controlled preset tests passed 4/4 and the complete compiled test suite passed 55/55. `pnpm run build` passed with only the existing Vite chunk-size warning.
- [x] The former five-specialty mobile evidence is retained only as historical UI evidence and is superseded by the three-mode browser assertions.
- [ ] No paid live-provider quality/cost/latency evaluation was run; recommendations and catalog evidence are explicitly provisional. Desktop wide viewport and Linux/macOS hardware were not exercised in this slice.
- [ ] Demonstrate hosted records and generated artifacts survive container replacement before a durable hosted launch claim.

## Collaboration reconnect repair (2026-09-19)

- [x] Production diagnosis confirmed that the deployed native container proxy and fresh room path were healthy while a real browser repeatedly received failed WebSocket upgrades. The exact old room/session category was unavailable because credentials and room IDs were correctly redacted; ephemeral container replacement remains a plausible but unproven trigger.
- [x] Connection states now distinguish connecting, connected, bounded transient reconnecting, invalid session, missing room, permission failure, and retry exhaustion. Server upgrade rejections emit safe category/correlation records without tokens or document content.
- [x] Transient retries use capped exponential backoff with jitter; socket generations, retry timers, flush promises, Yjs listeners, and awareness listeners are cleaned up on replacement/disposal.
- [x] Recoverable disconnected edits remain in memory and resynchronize through the existing Yjs state-vector exchange. Save UI labels disconnected pending edits as unsynced.
- [x] Flush rejection on disconnect states that no build started; reconnect logic makes no provider request.
- [x] Focused connection/proxy tests passed 8/8, the full controlled suite passed 51/51, and `pnpm build` passed with only the existing Vite chunk-size warning.
- [x] Windows Chrome interaction coverage passed for existing submission/Alt+X behavior plus the new actionable invalid-session state. The in-app browser automation helper was unavailable; the repository Chrome DevTools smoke harness provided the successful browser run.
- [ ] Post-deployment two-browser synchronization/recovery and deployed revision evidence must be recorded after publishing this change.
- [ ] Cloudflare container-local SQLite and generated files remain ephemeral across replacement. No destructive persistence migration was attempted because replacement was not confirmed as the specific incident trigger.

## Dark editorial presentation slice (2026-09-19)

- [x] Replaced the accumulated visual override layers with one semantic dark token system, fine borders, restrained shadows, small radii, and no gradients or glow effects.
- [x] Kept the editor as the dominant surface with readable body typography and an approximately 820px writing measure; the supporting panel remains secondary and stacks below the document at narrower widths.
- [x] Preserved the Document, Product, split-view, provider connection, Build my changes, invitation, participant, collaboration, and last-working-preview interactions.
- [x] Kept generated Product content style-isolated; workspace CSS does not restyle the generated iframe document.
- [x] API connections remains an accessible labeled dialog and returns focus to its launcher on close.
- [x] Font/icon sources and licenses are recorded in `docs/ui-assets.md`; no copied reference assets or new imagery were added.
- [x] Windows Chrome visual/interaction checks passed at 1440px, 1280px, 1024px, 768px, and 390px, plus a 720 CSS-pixel effective viewport representing 1440px at 200% zoom. Every case retained essential controls with zero horizontal overflow; split view, long-document scrolling, Product, dialog labelling, and dialog focus return passed.
- [x] A local two-participant WebSocket/Yjs probe passed bidirectional editing, save acknowledgement, interruption, reconnect, and post-reconnect synchronization without provider calls.
- [x] The full controlled suite passed 51/51 and `pnpm build` passed. The build retained the existing non-failing Vite large-chunk warning.
- [x] Measured token contrast pairs exceed WCAG AA for normal text: primary/panel 14.20:1, secondary/panel 8.58:1, accent/panel 12.30:1, accent text/accent 13.03:1, and error/panel 8.17:1. The strong structural line against the raised surface is 3.31:1.
- [-] Windows Chrome was exercised. Firefox, Safari, Linux, macOS hardware, and a native browser 200% zoom session were not exercised; the 200% result is an equivalent CSS viewport simulation.
- [ ] `graphify update .` could not run because this workspace has no Graphify executable, Python installation, or `uv` runtime. Source/tests were verified directly; the existing graph remains stale for this slice.

## Non-metal presentation rollback and compact effort picker (2026-09-23)

- [x] Restored the pre-metal dark editorial stylesheet and removed the WebGL mercury renderer, metallic icon gradients, liquid motion, and glassmorphism overrides.
- [x] Preserved Recommended/Advanced setup, exactly three modes, server-enforced effort allowances, owner permissions, submission behavior, shortcuts, collaboration, and Product isolation.
- [x] Replaced the four large canvas-side effort cards with one compact Light/Medium/High/Extra selector; Medium remains visibly marked Recommended.
- [x] Controlled suite passed 71/71 after the established temporary Windows user-info shim worked around a pre-discovery `uv_os_get_passwd` ENOMEM host fault; the shim was not retained.
- [x] Production build passed with 31.99 kB CSS and 766.03 kB JavaScript, retaining only the existing non-failing large-chunk warning.
- [x] Windows Chrome smoke passed Recommended/Advanced semantics, the compact disabled Medium-default effort picker, shortcut behavior, Product state, invalid-session recovery, and 390px zero-overflow layout. Desktop visual inspection confirmed the restored non-metal workspace and compact selector.
- [-] Firefox, Safari, Linux, macOS hardware, connected-owner effort changes, and native 200% zoom were not exercised in this rollback slice.

## Functional canvas effort control (2026-09-23)

- [x] Added an owner-only, inference-free `/ai/effort` mutation used by the canvas control for both Recommended and Advanced/Custom rooms.
- [x] Advanced effort changes preserve personal, builder, and participant-override assignments while applying canonical per-call input/output and repair allowances; existing rooms default safely to Medium.
- [x] Submission and build setup snapshots keep active work revision-safe; later effort changes affect future submissions only.
- [x] Focused server tests passed 18/18 for allowance mapping, assignment preservation, authorization, validation, and existing recommendation behavior.
- [x] Full synthetic regression suite passed 75/75; the first run exposed and the fix preserved Advanced Medium's established three-attempt builder behavior. The final suite includes a connected Custom owner changing effort through the HTTP route without a provider call.
- [x] Production TypeScript/Vite build passed. The existing Windows Chrome smoke passed the disconnected/read-only effort state, editor-only shortcut behavior, remapping, focus preservation, Product state, invalid-session recovery, and 390px viewport checks.
- [-] A connected-owner effort change was verified through server/integration tests but not through a live provider-backed browser session; no provider credits were spent. Firefox, Safari, Linux, and macOS were not exercised.
- [!] `graphify query` and `graphify update .` were attempted as required, but the executable and an installed Python runtime are unavailable in this environment; the existing graph was not refreshed.

## Structured-output serialization recovery (2026-09-24)

- [x] Added deterministic local recovery for raw JSON string control characters, trailing commas, Markdown fences, and a balanced object surrounded by prose; recovered values still pass the unchanged exact schema and project-operation validators.
- [x] Incomplete JSON envelopes are classified as probable truncation even when the provider reports a normal stop, then use the existing single compact retry and combined usage accounting.
- [x] Repeated malformed output now gives actionable effort/model guidance while retaining the last working Product; no additional provider call, model switch, or effort increase was introduced.
- [x] Focused synthetic provider and builder tests passed 10/10, including multiline TSX recovery without a paid retry and inferred-truncation accounting.
- [x] Full controlled regression suite passed 78/78 and the production TypeScript/Vite build passed, retaining only the existing non-failing large-chunk warning.
- [x] Windows Chrome smoke passed owner panel, editor-only shortcut/remapping, focus preservation, Product empty state, invalid-session recovery, and 390px viewport coverage. The parser change itself was verified through controlled provider fixtures and did not spend provider credits.
- [!] `graphify query` and `graphify update .` were attempted, but the executable remains unavailable in this environment; the existing graph was not refreshed.
- [ ] `graphify update .` remains unavailable because no Graphify executable is installed in this workspace; source, build, controlled tests, and browser behavior were verified directly.
## Supabase saved-project slice — 2026-09-24

- [x] Added the public Supabase project URL and publishable/anon key to the canonical Cloudflare `wrangler.jsonc` runtime variables. The server-only `SUPABASE_SECRET_KEY` remains an encrypted deployment secret and is not stored in the repository; no competing `wrangler.toml` was introduced.
- [x] Traced the obsolete `amygxtdgjlphxaetqzkk`/Twitch URL to the unrelated `cocreate.pages.dev` application. A fresh Worker sign-in reached Google through the intended `dnsapasubeoxxsgkiotw` project but exposed the real CoCreate defect: Supabase returned to that unrelated Pages application.
- [x] Removed the unsafe callback default. Hosted sign-in now requires an explicit Supabase URL, publishable key, and app origin; production derives `https://cocreate.susan981314271.workers.dev/api/auth/callback`, container image variables reach the Vite build, and server-side URL/JWKS/legacy-key project mismatches fail closed.
- [x] OAuth correction validation passed on 2026-09-24: 9/9 focused auth tests, 88/88 full controlled tests, and the TypeScript/Vite production build. Tests cover exact Google provider selection, callback derivation, one-time code exchange, denied/missing/expired/reused callback failures, local-destination validation, Wrangler build-variable parity, and server project/JWKS mismatch rejection. No provider credits were spent.

- [x] Versioned SQL schema for profiles, projects, memberships, hashed one-time invites, snapshots/updates, harness records, usage, artifact metadata, RLS, restricted grants, atomic creation/acceptance functions, and private Storage policy.
- [x] Google OAuth PKCE client routes (`/login`, production `/api/auth/callback`, and the legacy `/auth/callback` recovery path), session restore/automatic refresh/sign-out, near-expiry refresh plus one bounded 401 retry for authenticated project requests, local return-path validation, and explicit configuration/denied states.
- [x] Server JWT verification through `@supabase/server` with project issuer/audience/JWKS pinning; no browser-supplied user ID is trusted.
- [x] Project list/create/rename/archive/session/invite endpoints, authenticated invite-link acceptance, and owner/editor/viewer mapping scoped to the current membership; no model call on project operations.
- [x] Five-minute project-scoped collaboration ticket, origin validation, viewer update/command denial, client ticket refresh, and protected preview/download routes.
- [x] Hosted snapshot acknowledgement after remote commit; save failure emits unsynced state; ordered update writes are idempotent.
- [x] Authenticated project shell and compact collapsible context panel with automatic conflict expansion and long-detail drawer.
- [x] Dry-run-first, idempotent legacy importer with backup requirement, deterministic ID mapping, trusted UUID ownership map, hashes, counts, and quarantine of unmapped rooms.
- [x] Final local verification passed on 2026-09-24: `pnpm test` passed 83/83, including the synthetic session-expiry boundary, and `pnpm build` passed TypeScript and the Vite production build. The build retained only the existing non-failing large-chunk warning; no provider credits were used.
- [x] The unauthenticated Google sign-in screen was rendered and visually checked in Windows Chromium at `/login`. Authenticated project, invite, refresh, and two-account collaboration behavior remain unclaimed until the remote prerequisites below are available.
- [x] Pinned Prisma CLI/client/Postgres adapter 7.10.0, initialized the Prisma 7 schema/config, separated transaction-mode runtime and session-mode CLI URLs, and retained Supabase SQL migrations as the sole current schema authority.
- [x] Applied `202609240001_projects_auth_persistence.sql` through Supabase CLI 2.117.0. A follow-up dry run reported the remote database up to date; read-only checks found 13 public tables, RLS on all 13, 17 public policies, one private `cocreate-artifacts` bucket, and one matching migration-history record.
- [x] Prisma introspected 40 models across `public` and Supabase-managed `auth`, declared all auth tables/enums external to Prisma Migrate, validated/formatted the schema, and generated the ignored Prisma 7 ESM client. A read-only Prisma query through Supavisor transaction mode succeeded.
- [x] Synchronized the ignored local `DATABASE_URL` credential with `DIRECT_URL` without exposing it. A final read-only Prisma query using the stored transaction-pooler URL succeeded; both current application tables were empty as expected for a fresh project.
- [x] Added the official project-scoped Supabase remote MCP configuration in `.mcp.json`. OAuth authentication remains a local user action because Claude Code is not installed in this environment; no access token is stored in the repository.
- [ ] Complete a real user Google sign-in and two-account collaboration check after confirming the dashboards: Google authorized redirect URI `https://dnsapasubeoxxsgkiotw.supabase.co/auth/v1/callback`; Supabase Site URL `https://cocreate.susan981314271.workers.dev`; Supabase allowed redirect `https://cocreate.susan981314271.workers.dev/api/auth/callback`. Dashboard access and the second test account are not available in this workspace, so mocked auth is not counted.
- [ ] Run `supabase test db` against a local Supabase CLI stack and complete immediate socket closure on membership revocation. Current ticket expiry bounds access to five minutes.
- [ ] Move complete generated artifact restoration to private Storage. Upload/finalization boundary exists, but room promotion/rehydration still embeds recent generated files in the snapshot.

## Responsiveness evidence slice — 2026-09-26

- [x] Added a repeatable two-participant localhost benchmark for 2k- and 200k-character Yjs documents with five cold samples; environment, raw samples, medians, traffic, subscriptions, sync, flush, and reconnect are recorded in `docs/harness/responsiveness.md`.
- [x] Removed the redundant full room-state broadcast from the typing path. Incremental Yjs propagation, pending durable edit records, save acknowledgement, permissions, and explicit submission remain unchanged. The measured single-edit peer scenario fell from 9 to 8 messages and from 10,958 to 8,797 bytes for the small document.
- [x] Removed the duplicate initial HTTP room-state fetch; initial state and document sync now share the authenticated WebSocket. The HTTP read remains for terminal reconnect diagnosis.
- [x] Split the hosted auth/project shell from the heavy workspace/editor chunk. Initial login/projects JavaScript fell from 310.98 kB gzip to about 129.19 kB gzip before opening a workspace (58% reduction).
- [x] Full controlled suite passed 92/92, TypeScript/Vite production build passed, and Windows Chrome production smoke passed after its stale effort-control assertion was aligned with the current accessible range control.
- [-] Localhost timing medians overlapped, so no latency improvement is claimed. Real Supabase login timing, warm-cache/project-switch traces, throttled real networks, two real browser accounts, provider queue/execution timing, Firefox, Safari, Linux, and macOS remain unmeasured.
- [!] `graphify query` and `graphify update .` were attempted, but the Graphify executable remains unavailable in this workspace.
