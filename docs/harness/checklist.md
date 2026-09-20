# CoCreate harness implementation checklist

## Evidence-based model routing slice — 2026-09-20

- [x] Replaced fixed $0.25/$0.75/$2/$4 defaults with rate-derived estimated one-pass maximum and separately labeled spending limit.
- [x] Added explicit catalog, pricing, routing-rule, and evaluation-protocol versions.
- [x] Retained one selected provider by default and preserved Advanced manual assignments.
- [x] Added deterministic complexity classification and no-model-call routing that retains the validated economical baseline while specialty evidence is absent.
- [x] Added five specialty task rubrics, repeated-trial thresholds, and satisfaction, verification, regression, latency, total-cost, and cost-per-verified-build metrics.
- [x] Added immutable promoted-version run records; compilation is separate from unmeasured requirement/regression verification.
- [x] `pnpm build` passed on 2026-09-20 (existing non-failing Vite chunk-size warning remains).
- [x] Earlier in-app Chromium evidence confirmed the five specialties and effort controls; the pricing/accounting wording below supersedes its old cost labels.
- [x] Compiled Node test fallback passed the complete then-current suite 57/57 plus the final routing suite 7/7 on 2026-09-20; the direct `tsx` launcher still fails before loading tests with the host's `uv_os_get_passwd ENOMEM` defect.
- [ ] No paid repeated trials were run because no evaluation budget was authorized; all specialty mappings remain hypotheses.
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
- [x] Added owner-only Recommended specialty/effort setup with explicit confirmation, exact checked models from one available connection, provider-currency rates, versioned provisional evidence, and preserved Advanced connections/assignments/overrides; no unannounced fallback.
- [-] Long-document scrolling, editor usability, shortcut accessibility, and reconnect behavior are verified in Windows Chrome. Linux, macOS, Firefox, and Safari hardware/browser runs remain outstanding.
- [-] Recommended runs now freeze model IDs/versions, output ceilings, repair ceilings and conservative server-side currency reservations with uncertain timeout retention. Input preparation remains compacted but does not yet expose retrievable omitted references; provider-specific cached/reasoning/tool billing may remain uncertain.

## Specialty preset evidence (2026-09-20)

- [x] Pure resolution rejects discovery-only models until personal/builder schema checks pass and preserves one connection/data destination.
- [x] Existing/manual assignments migrate to Custom; applying Recommended preserves dormant Advanced overrides.
- [x] Selector preview is read-only and owner-only; application re-resolves server-side and rejects an underfunded cap.
- [x] Submission and builder records freeze their resolved policy; reservations are persisted before calls and concurrent/repair reservations fail closed at the cap.
- [x] Controlled preset tests passed 4/4 and the complete compiled test suite passed 55/55. `pnpm run build` passed with only the existing Vite chunk-size warning.
- [x] In-app browser at a narrow/mobile viewport showed all five specialties, four effort levels, spend input, disabled unavailable confirmation, actionable missing-connection detail, and the preserved Advanced connection/assignment UI.
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
