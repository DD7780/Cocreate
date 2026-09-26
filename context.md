# CoCreate context handoff

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

## Product

Multiple users write in one shared canvas. Explicit participant submissions invoke personal agents to interpret authenticated contributions; typing itself makes no model call; a shared requirement registry separates proposals from accepted intent; one builder produces a shared application preview. Priorities: intent correctness, contradictions, low hallucination, cost efficiency, responsiveness, bounded context, and recovery.

## Read next

- Product intent: [product.md](product.md).
- Coding guidance: [instructions.md](instructions.md) and [AGENTS.md](AGENTS.md).
- Existing canonical architecture: [docs/harness/architecture.md](docs/harness/architecture.md).
- Existing canonical progress record: [docs/harness/checklist.md](docs/harness/checklist.md).
- Assessment/migration/decisions: [docs/harness/assessment.md](docs/harness/assessment.md), [migration-plan.md](docs/harness/migration-plan.md), [decisions.md](docs/harness/decisions.md).
- Backend and collaboration contracts: [api.md](api.md).

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
