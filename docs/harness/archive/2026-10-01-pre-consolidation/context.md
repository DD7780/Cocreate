> Historical snapshot before the 2026-10-01 consolidation. This file contains superseded claims and dated results; it is not contributor guidance or a current completion checklist. Use the [current document](../../../../context.md) and [archive index](README.md). No historical check was rerun for this snapshot.

# 2guys1canvas context handoff

## Reliability and shared context slice (2026-10-01)

The latest request supersedes older canvas-without-sidebar and unbounded-BYOK-recovery statements below. The canvas now has a compact Shared context sidebar with durable accepted revision snapshots, separate partial recorded usage, and workflow stage. The Studio Ivory shell remains; the requested new screenshot was absent, so a visual reference match is not verified.

Whole-project output exhaustion now requests an ordered manifest of at most eight one-file tasks, validates complete operations and saves each source checkpoint before proceeding. Initial generation and every recovery/repair/transport attempt share a 24-physical-call executor ceiling; configured spending limits remain enforced. BYOK still has no managed-credit gate. Context capacity, provider output ceiling and spending are distinct. The last compiled artifact remains available after failure. New accepted changes are compared against the last promoted accepted baseline to avoid unnecessary regeneration.

Participant submissions are captured durably and interpreted in capture order; only their authenticated edit batches and the accepted baseline enter interpretation. Exact Yjs insertions account for editor prefix reuse. Drafts, command receipts and accepted revision history survive snapshots; interrupted interpretations restore captured edits without automatic inference. Cloud saves serialize immutable revisions and acknowledge insertion clocks plus deletion ranges. Local coordinator leases fence processes; an additive server-only Postgres lease/atomic-snapshot migration is prepared but NOT applied. Hosted deployment requires that migration.

Final local tests passed **129/129** and the production build passed; graphify was refreshed. Local controlled-provider and independent-browser evidence is in [reliability-verification.md](../../reliability-verification.md). No paid-provider, hosted-account, live SQL or deployment verification is claimed. Earlier dated results below are historical.


## Studio Ivory UI (2026-10-01)

`src/studio-ivory.css` layers the active warm ivory, ink, cobalt, and terracotta palette over the established layouts in `src/styles.css`. One Google Fonts request loads only Inter and DM Serif Display. Local `pnpm build` and all 111 tests passed. Headless Chrome verified the canvas, Workflow, Artifacts, and Builder/API dialog at desktop, tablet, mobile, and 200% zoom widths without horizontal overflow; the canvas has no Shared Intent rail, while Workflow does. The local-mode welcome and hosted-style login screens were visually checked. Authenticated projects and invitation flows were restyled in CSS but were not account-tested in this visual run. No backend or API contract changed. The purple description below is historical.

## Reference-led UI refresh (2026-09-30)

The three user-provided references guide a purple, dark neubrutalist shell, white gridded full-width canvas, high-contrast workflow cards, and white artifact stage. Shared Intent renders in Workflow and Artifacts, not Canvas. Auth, project, invite, builder, and API setup styling follows the same palette. The older `comic.css` import was removed so it cannot override the theme. Local tests passed 111/111, build passed, and graphify was updated. Browser visual verification was attempted with an older capture script, which assumes a canvas Shared Intent panel; it needs updating before a responsive visual claim. No backend or API contract changed.

## Current implementation handoff (2026-09-30)

Visible branding is 2guys1canvas; technical CoCreate identifiers and deployed origins remain for compatibility. Local code validates the Resend sender before calling the provider, includes inviter/project/role/accept link/expiry, and requires a provider acceptance ID before reporting Sent. No sender is configured locally, so live delivery remains unverified. The shortcut picker is removed and legacy preferences resolve to fixed platform mappings. Detailed usage moved to Workflow and a separate canvas card. Shared Intent exposes accepted requirements, attention items, provenance, and decision history. The physical-call ledger scans all local events or hosted Postgres rows, while historical generation counters remain separate. Coverage remains partial. The rejected revoke-on-retry migration was never created. Both additive migrations were applied live after approval. Invitation, membership, and snapshot fingerprints were unchanged; 13 retained calls were backfilled. Live transaction checks rolled back their test rows after proving replay, non-revoking resend, confirmed-email acceptance preserving an editor role, and ledger deduplication. The final local suite passed 111/111, build passed, and Chrome verified conflict controls and desktop/mobile usage. Live email delivery and deployed app behavior remain unverified.

## Current BYOK-only handoff (2026-09-28)

Hosted new projects start disconnected. The owner validates an OpenRouter key using `/key` without generation, explicitly selects both models from metadata-compatible `/models` entries, then saves. The server holds the key for two hours in process memory only. Expiry or restart blocks dispatch until reconnect. Owner authorization is required for editor spending. Managed dispatch and obsolete hosted AI routes are disabled; historical project and billing data remain. Local mocked tests and build are the current evidence; live OpenRouter and hosted two-account behavior remain unverified. A local real-key submission exposed an unintended three-call gate after successful interpretation; the BYOK gate was removed. Token usage from physical requests is now visible, including failed builds, and an explicit retry reuses accepted requirements after reconnect. Hosted two-account behavior remains unverified. Prior managed-default sections below are superseded.

## UI and local recovery slice — 2026-09-28

Implemented locally: managed builder selection no longer depends on a successful funding read; it checks the returned model ID. Selection stays inference-free and credit authorization still gates dispatch. Workflow now shows real tasks, verification states, recent activity and artifact navigation. Shared Intent previews accepted requirements. Setup opens on demand, without interrupting writing.

Browser drafts use IndexedDB scoped to room and participant, validated before restore after an authenticated state request. The browser copy is distinct from server-confirmed sync. Collaboration batches outgoing document changes for 40 ms and flushes before submission. This is recovery caching, not full offline project startup or a replacement for durable shared storage. Quota/corruption failures are visible; retention/purge controls and cloud-scale load measurements remain follow-up work.

The current visual direction is dark neubrutalist with lavender/lime accents, readable body text, hard shadows and brief original CSS comic effects. It supersedes earlier restrictive no-motion visual guidance. Reduced motion is supported. Desktop/mobile browser evidence: artifacts/ui-redesign/overhaul-checks.json. No deployment, paid inference, hosted migration or production scaling validation performed in this slice.


## Historical managed-model slice — 2026-09-27

The current product target is Developer-only, managed by default for new hosted projects, with a fixed economical personal interpreter and one owner-selected shared builder. The selector, rate/availability evidence, credit state, and Advanced/BYOK entry are implemented locally. Existing BYOK projects stay on their configuration until explicit opt-in, and their saved assignments survive a managed switch. Researcher/Analyst are removed from active setup; historical records remain readable. Earlier three-mode and BYOK-default paragraphs below are superseded history.

Managed OpenRouter calls use a server-only founder credential and a versioned exact-ID catalog. Supabase funding and authorized-spender rows are distinct from membership. Each physical managed call must reserve credit atomically before dispatch and settle reported cost; unknown outcomes retain the reservation. Hosted legacy build/process paths are disabled. The SQL migration is written but not applied here; there is no founder key, positive credit, or authorized live benchmark budget in this workspace. Local mocked-provider tests and production build are the only current execution evidence; do not infer live-provider or database concurrency correctness. Apply the migration, configure the server secret, deliberately fund an account and grant spenders, then test with two accounts and real provider requests before deployment. The qualification fixtures and scorer are prepared, but candidate comparisons remain unrun.

The 2026-09-26 collaboration diagnosis confirmed the hosted failure `contentRefs[(info & binary.BITS5)] is not a function`: Supabase/PostgREST stored Node `Buffer` JSON text in `bytea` for all 16 snapshots and 1,500 update rows examined, while the loader treated those JSON characters as a Yjs V1 update. The original data is recoverable: every update decoded from its legacy Buffer envelope passed Yjs validation and its stored SHA-256 hash. New writes use explicit PostgreSQL hex `bytea`; reads accept only supported representations, unwrap the exact legacy envelope, validate in an isolated `Y.Doc`, quarantine original bytes, and can rebuild from hash-verified update history. The additive quarantine/backup migration is applied: 16 snapshot and 1,500 update backups match their unchanged originals byte-for-byte; RLS is enabled and both `anon` and `authenticated` lack table read permission. The application code is not yet deployed.

The auth callback now initializes the existing Supabase session before classifying callback failure, exchanges a PKCE code at most once, removes callback parameters from browser history, and distinguishes cancellation from expiration. If a valid session survives a cancelled/reused callback, access is not granted by dismissal: the screen identifies the signed-in account and requires an explicit Continue or Switch account action.

The 2026-09-25 account/sharing slice adds Supabase email/password signup, confirmation resend, login, recovery, authenticated password update, and safe destination preservation alongside Google PKCE. The existing project system supports named creation, owner-only rename, clearly visible folder-outline sidebar affordances, and an explicit pencil rename control in the workspace header, plus a Share project dialog backed by email-bound editor/viewer invitations, explicit sharing permission, pending invite resend/revoke, and truthful transactional-email states. The canvas effort UI is an accessible draggable Low/Medium/High/Extra toggle while preserving the historical `light` value and inference-free future-submission behavior. The SQL migration and code are complete locally; live migration, Supabase Auth/SMTP dashboard verification, and a real Resend sender/key remain external verification work unless recorded otherwise.

The 2026-09-23 workflow-first pivot has an implemented Phase 1 foundation. Each room now initializes a durable, versioned workflow projection and assigns its first owner as initial controller. The existing serialized Developer run is persisted as a task before dispatch with source specification revision, acceptance criteria, shared-executor assignment, evidence state, run linkage, and promoted artifact version. Task/workflow transitions append ordered events; restart interrupts nonterminal runs and tasks and moves the workflow to `awaiting_input` without retrying side effects. `RoomView.workflow` and the authenticated cursor endpoint expose safe shared activity summaries, and the existing dark UI renders the workflow overview, task plan, live activity, and artifact verification state. Compilation remains explicitly unverified.

The 2026-09-24 structured-output repair addresses complex builder responses that contain recoverable JSON serialization defects. Raw newlines/tabs/carriage returns inside string values, trailing commas, fenced JSON, and a complete object surrounded by prose are normalized locally before any paid repair. The unchanged schema and project-operation validators remain authoritative. Unclosed envelopes are treated as probable truncation and use the existing single compact retry; no extra provider call or silent model/effort change was added.

Still unavailable: contributor/controller/viewer role migration, structured steering commands beyond the existing authenticated submission, pause/resume/cancel, control handoff, scoped approval decisions, dependency scheduling, isolated concurrent workers, durable coordinator leases/fencing, deployed external artifact persistence, and Analyst/Researcher toolchains. The product must not simulate these. The next coherent slice is Phase 2 command/authorization groundwork, beginning with durable membership roles and revision-safe steering records before pause or handoff UI.

The 2026-09-23 presentation rollback restores the clean dark editorial UI and removes all liquid-metal, mercury, shader, and glass treatments. AI effort remains beside the canvas as one compact selector for Light, Medium, High, and Extra. The owner can now apply it to Recommended or Advanced rooms: Advanced preserves its assignments and changes the bounded allowances for future frozen submissions; collaborators and disconnected rooms remain read-only.

The 2026-09-21 connection experience now leads with CoCreate Recommended, as explicitly requested, while making its funding/model source clear: capability-tested models come from the owner's saved API connection. **Connect your API** and **Connect or manage API · Advanced** expose add/edit/disconnect, optional discovery, exact manual model testing, four separate capability results, and personal-interpreter/shared-executor assignment; **View recommended setup** returns without erasing those settings. No passive UI action runs a model.

The three-mode migration is implemented at the setup, API, persistence-normalization, routing, and record-contract layers. CoCreate exposes exactly Developer, Analyst, and Researcher; efforts remain Light/Medium/High/Extra within a mode. Developer reuses the current app executor. Analyst and Researcher are explicitly unavailable because their required ingestion/computation and retrieval/citation tools do not exist. Legacy coding presets normalize to Developer without changing assignments, encrypted credentials, effort, overrides, or historical run records.

The 2026-09-22 truncation repair separates aggregate USD ceilings from per-call token allowances in UI, errors, routing, and documentation. New Developer executor allowances are 8K / 12K / 20K / 32K by effort; Advanced defaults to 12K. One compact retry consumes the existing structured-output repair allowance and aggregates provider usage from both attempts. A second truncation does not silently increase effort or change providers/models.

Model routing has a versioned deterministic foundation. Developer uses the economical capability-validated model on the owner's chosen connection; no authorized repeated benchmark exists. Analyst and Researcher cannot route because their required tool-backed workflows are unavailable. The UI reports source-linked published rates, separate layer allowances, an explicitly scoped one-pass maximum, a distinct spending limit, and the latest build's normalized usage/estimated charge. See `docs/harness/model-evaluation.md`.

As of 2026-09-21. Recheck the source and checklist before acting; this handoff records controlled tests, a production build, browser interaction checks, and live collaboration diagnostics, but no paid live-provider semantic evaluation.

The 2026-09-26 accounting repair begins at the physical provider HTTP boundary. Room-scoped model discovery and explicit capability checks now create unique attempt records for transport retries and structured-output repairs, record normalized usage/outcomes without private inputs, and show setup usage separately from latest-build and cumulative generation totals. The controlled suite passes 93/93 and production build passes. Interpretation/executor adoption of this ledger, a single durable cross-agent execution budget, awaited hosted pre-dispatch persistence, context token budgeting, capability-result reuse, and restart reconciliation remain unfinished and must not be presented as complete.

## Product

Multiple users write in one shared canvas. Explicit participant submissions invoke personal agents to interpret authenticated contributions; typing itself makes no model call; a shared requirement registry separates proposals from accepted intent; one builder produces a shared application preview. Priorities: intent correctness, contradictions, low hallucination, cost efficiency, responsiveness, bounded context, and recovery.

## Read next

- Product intent: [product.md](../../../../product.md).
- Coding guidance: [instructions.md](../../../../instructions.md) and [AGENTS.md](../../../../AGENTS.md).
- Existing canonical architecture: [docs/harness/architecture.md](../../architecture.md).
- Existing canonical progress record: [docs/harness/checklist.md](../../checklist.md).
- Assessment/migration/decisions: [docs/harness/assessment.md](../../assessment.md), [migration-plan.md](../../migration-plan.md), [decisions.md](../../decisions.md).
- Backend and collaboration contracts: [api.md](../../../../api.md).

No duplicate root architecture.md or progress.md was created because the existing architecture and checklist already cover those roles.

## Current implementation landmarks

- `src/`: React/Vite workspace, TipTap/Yjs editor, provider settings, preview.
- `server/index.ts`: HTTP routes and WebSocket upgrade/authentication.
- `server/rooms.ts`: room lifecycle, interpretation, scheduling, provider assignments, shared intent, and version promotion.
- `server/requirements.ts`: shared intent reconciliation and contradiction handling.
- `server/providers.ts`: seven provider adapters, capability checks, and normalized cached/reasoning usage.
- `server/ai-presets.ts`, `server/ai-accounting.ts`: canonical versioned pricing, allowances, charge arithmetic, run aggregation, and comparable effectiveness metrics.
- `server/generator.ts`: model prompts, structured schemas, and context preparation.
- `server/event-store.ts`: SQLite event/artifact history and derived state.
- `server/tool-registry.ts`: audited apply/build/promote tools and application policy.
- `server/project.ts`, `server/preview.ts`: generated project operations and restricted browser preview.
- `worker/`, `wrangler.jsonc`, `Dockerfile`: Cloudflare deployment path; do not deploy as part of unrelated work.

## Implemented versus unfinished

The current architecture/checklist records ordered SQLite events, snapshot recovery, JSON migration backups, interrupted run handling, typed apply/build/promote tools, per-intent classification with rationale/source attribution, targeted authenticated reinterpretation, stable shared intent, proposal exclusion, durable multi-option conflict groups, unresolved-requirement exclusion, bounded compilation repair, and revision/fingerprint-guarded promotion.

Important limitations explicitly remain:
- Compilation runs inside the server process; real process isolation is unfinished.
- Active-builder coordination is process-local, not a durable multi-instance lease.
- Approval schemas exist, but durable approval workflows and UI are unfinished.
- Deterministic conflict grouping covers known same-subject/scope color alternatives and exact negation. Authenticated selection APIs, decision cards, document highlights, compromise/reopen actions, and bounded semantic detection remain.
- Browser acceptance/regression evidence does not yet gate promotion.
- Full model-aware context budgets and recoverable references to omitted material remain.
- Automatic reconciliation of uncertain external outcomes remains.
- Events/artifacts are retained indefinitely; bounded retention is future work.
- Cloudflare HTTP and WebSocket routing now use the platform-native container proxy with an application readiness endpoint and encrypted Worker secrets. Container replacement can still lose application data with the current persistence configuration.
- Collaboration connection handling now has explicit connecting/connected/reconnecting/terminal states, authenticated session/room diagnosis, capped jittered retries, stale-socket/listener cleanup, and in-memory Yjs resynchronization. This improves recovery and makes unrecoverable rooms actionable; it does not provide offline-across-reload or container-replacement durability.

Do not treat these as completed because a README, UI label, or earlier conversation described the target architecture.

## Historical validation (reported by the implementation slice)

On 2026-09-19, the submission/Alt+X slice passed the full 45-test controlled suite, `pnpm build`, and a production-mode Windows Chrome interaction check. Coverage includes no inference on typing, participant edit-record submission scoping (not complete personal-model context isolation), idempotent and empty submissions without extra model calls, three-person submission-driven generation, exact shortcut filtering, preferences/remapping, dialog exclusion, focus preservation, accessibility metadata, and the mobile/product regression. Linux and macOS hardware were not exercised; macOS disabled-by-default behavior is unit-tested. Live-provider semantic evaluation was not run. Earlier intent-classification, builder-operation, durable conflict-group, and Cloudflare collaboration coverage remains included.

## Local workflow

`pnpm dev` starts the application, normally at http://localhost:5173. `pnpm test` runs the TypeScript test suite. `pnpm build` checks TypeScript and builds the Vite client. `pnpm start` serves production mode after a build. See README.md for prerequisites and configuration. This document does not establish whether a server is currently running.

## Responsiveness slice (2026-09-26)

After the collaboration/auth regression suite passed, a five-sample, two-participant localhost benchmark identified redundant full-state traffic on every incremental edit and an eager workspace bundle on authentication routes. The retained changes remove that redundant state broadcast, rely on the authenticated WebSocket for successful initial state, and lazy-load the editor/workspace after the project shell. Small-document peer traffic fell from 10,958 to 8,797 bytes in the measured scenario; the login/projects JavaScript path fell from 310.98 kB to about 129.19 kB gzip. Local timing samples overlap, so no latency improvement is claimed. Full evidence, limitations, and commands are in `docs/harness/responsiveness.md`; 92 tests, the production build, and Windows Chrome smoke passed.

## Suggested next work

Choose the next incomplete criterion from the canonical checklist after inspecting actual code. Highest-risk boundaries are real execution isolation and durable coordination; verification gates are required before calling results functionally verified. Preserve the current working vertical slice and avoid a new framework or swarm rewrite.

Update this handoff after verified milestones. Record date, source revision when available, actual test evidence, blockers, and the next task; keep secrets and transient credentials out.

## Collaboration reconnect evidence (2026-09-19)

The then-current live Worker version served both readiness endpoints and passed an isolated two-participant bidirectional Yjs/flush/reconnect probe. Simultaneous tail evidence showed a real browser repeatedly receiving failed upgrades while fresh rooms succeeded, narrowing the immediate defect to opaque terminal upgrade failures plus an unbounded client retry loop rather than the already-correct native Cloudflare proxy. The deployed image matched the local production asset hashes, but exact source-to-container provenance was unavailable.

The repair adds authenticated failure diagnosis, safe server categories/correlation IDs, capped retry/backoff, lifecycle cleanup, actionable UI, unsynced labeling, and tests that reject a flush on disconnect before submission. Before publishing, the full suite passed 51/51, the production build passed, and the Windows Chrome smoke test passed including invalid-session recovery UI. Post-deployment verification and identifiers belong in the checklist after deployment.

## Steering update and next slice (2026-09-19)

The earlier documentation-only audit established submission-first generation, one shared product, the three-second default collection window, Alt+X, and multi-option affected-contributor agreement. Recommended owner setup has since been implemented as the opt-in, capability-gated flow described below; manual connections/assignments remain Advanced/Custom. Preserve the scrollable writing surface and calm body typography.

Recommended owner setup now shows exactly three modes and four bounded effort levels while retaining the full Advanced connection/assignment flow. `server/ai-presets.ts` is the canonical versioned catalog and availability source. Developer resolution requires existing role-specific capability checks, confirms exact models/rates, freezes settings for submissions/builds, and uses conservative persisted reservations. Existing Custom rooms remain Custom until explicit opt-in; legacy Recommended coding presets normalize to Developer. The accounting layer preserves cached/cache-write/reasoning categories, call-level pricing snapshots, repair/failure costs, uncertain timeouts, and legacy historical specialty fields without logging prompts or secrets. Product shows the latest run and only derives comparable effectiveness after three matching records; compilation alone is not verified. There is no credit ledger; USD estimates are not invoices, and missing billing categories remain uncertain. Current validation evidence is recorded in the checklist. No paid inference was run.

Prioritize closing the legacy `/build` all-draft flush and verifying source ownership in personal outputs: submission snapshots currently contain shared canvas context. Add retrievable references for omitted context, provider-billing confirmation/import where authorized, and an explicitly budgeted comparative live evaluation before promoting recommendations beyond provisional. Complete durable submission/batch/run links and restart resumption; the current 200-record list bounds deduplication and the debounce is not a frozen batch barrier. Before durable hosted launch, resolve container-replacement data loss and the execution/verification limitations listed above.

## Dark editorial presentation slice (2026-09-19)

The workspace presentation now uses a consolidated dark editorial token system with restrained neubrutalist accents. The shared document remains visually primary, the supporting intent panel is secondary, the generated Product preview stays style-isolated, and mobile retains visible API, invitation, submission, and navigation controls. This slice changes presentation and dialog focus return only; it does not change submission, provider, collaboration, conflict, or generation semantics. Windows Chrome responsive/interaction checks, a two-participant reconnect probe, all 51 controlled tests, and the production build passed. Other browsers/platforms and native 200% zoom remain untested; Graphify could not be updated because no executable or Python/uv runtime is available in this workspace.

Verification evidence and platform limitations are recorded in the canonical checklist. Font and icon sources are recorded in `docs/ui-assets.md`.
## 2026-09-24 — Supabase project transition

The repository now contains the authenticated project shell, Supabase schema/RLS, bearer verification, membership-scoped collaboration tickets, remote snapshot/update persistence boundary, protected previews, private artifact finalization primitive, and dry-run legacy importer. Hosted mode is deliberately fail-closed. A live trace proved that the Worker reached Google through the intended `dnsapasubeoxxsgkiotw` Supabase project but returned to an unrelated `cocreate.pages.dev` application. CoCreate now derives its application callback from an explicit canonical origin: `https://cocreate.susan981314271.workers.dev/api/auth/callback` in production and the separately allow-listed localhost callback in development. The browser uses Google OAuth with PKCE and automatic refresh; its authenticated request boundary also refreshes near expiry and performs one bounded refresh-and-retry after a 401. `@supabase/ssr` is installed but Next.js helpers were deliberately not added because CoCreate uses Vite and Express, not Next server components/cookie middleware. Server-only Supabase and application secrets remain deployment configuration and are never browser-prefixed. Live completion still requires the exact Google and Supabase dashboard values recorded in the checklist and a real user sign-in. See the saved-project checklist for remaining evidence and the artifact-restoration limitation.
