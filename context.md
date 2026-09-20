# CoCreate context handoff

Model routing has a versioned deterministic foundation. Specialties do not currently select different models: no authorized repeated benchmark exists, so the economical capability-validated model on the owner's chosen connection remains the baseline. The UI reports source-linked published rates, separate layer allowances, an explicitly scoped one-pass maximum, a distinct spending limit, and the latest build's normalized usage/estimated charge. See `docs/harness/model-evaluation.md`.

As of 2026-09-20. Recheck the source and checklist before acting; this handoff records controlled tests, a production build, browser interaction checks, and live collaboration diagnostics, but no paid live-provider semantic evaluation.

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

Recommended owner setup now provides five specialty emphases and four bounded effort levels while retaining the full Advanced connection/assignment flow. `server/ai-presets.ts` is the canonical versioned catalog. Resolution requires existing role-specific capability checks, confirms exact models/rates, freezes settings for submissions/builds, and uses conservative persisted reservations. Existing rooms stay Custom until explicit opt-in. The accounting layer preserves cached/cache-write/reasoning categories, call-level pricing snapshots, repair/failure costs, and uncertain timeouts without logging prompts or secrets. Product shows the latest run and only derives comparable effectiveness after three matching records; compilation alone is not verified. There is no credit ledger; USD estimates are not invoices, and missing billing categories remain uncertain. The compiled 66-test suite and production build pass after the normal `tsx` launcher was blocked by the host `uv_os_get_passwd ENOMEM`; fresh-server Windows Chrome also passed pricing labels, Advanced setup, shortcut, Product, recovery, and mobile checks. Graph status is recorded in the checklist. No paid inference was run.

Prioritize closing the legacy `/build` all-draft flush and verifying source ownership in personal outputs: submission snapshots currently contain shared canvas context. Add retrievable references for omitted context, provider-billing confirmation/import where authorized, and an explicitly budgeted comparative live evaluation before promoting recommendations beyond provisional. Complete durable submission/batch/run links and restart resumption; the current 200-record list bounds deduplication and the debounce is not a frozen batch barrier. Before durable hosted launch, resolve container-replacement data loss and the execution/verification limitations listed above.

## Dark editorial presentation slice (2026-09-19)

The workspace presentation now uses a consolidated dark editorial token system with restrained neubrutalist accents. The shared document remains visually primary, the supporting intent panel is secondary, the generated Product preview stays style-isolated, and mobile retains visible API, invitation, submission, and navigation controls. This slice changes presentation and dialog focus return only; it does not change submission, provider, collaboration, conflict, or generation semantics. Windows Chrome responsive/interaction checks, a two-participant reconnect probe, all 51 controlled tests, and the production build passed. Other browsers/platforms and native 200% zoom remain untested; Graphify could not be updated because no executable or Python/uv runtime is available in this workspace.

Verification evidence and platform limitations are recorded in the canonical checklist. Font and icon sources are recorded in `docs/ui-assets.md`.
