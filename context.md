# CoCreate context handoff

As of 2026-09-19. Recheck the source and checklist before acting; this handoff records controlled tests, a production build, and a Windows Chrome interaction check, but no live-provider semantic evaluation.

## Product

Multiple users write in one shared canvas. Event-driven personal agents interpret authenticated contributions; a shared requirement registry separates proposals from accepted intent; one builder produces a shared application preview. Priorities: intent correctness, contradictions, low hallucination, cost efficiency, responsiveness, bounded context, and recovery.

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
- `server/providers.ts`: seven provider adapters and capability checks.
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

Do not treat these as completed because a README, UI label, or earlier conversation described the target architecture.

## Latest validation

On 2026-09-19, the submission/Alt+X slice passed the full 45-test controlled suite, `pnpm build`, and a production-mode Windows Chrome interaction check. Coverage includes no inference on typing, participant draft isolation, idempotent and empty submissions without extra model calls, three-person submission-driven generation, exact shortcut filtering, preferences/remapping, dialog exclusion, focus preservation, accessibility metadata, and the mobile/product regression. Linux and macOS hardware were not exercised; macOS disabled-by-default behavior is unit-tested. Live-provider semantic evaluation was not run. Earlier intent-classification, builder-operation, durable conflict-group, and Cloudflare collaboration coverage remains included.

## Local workflow

`pnpm dev` starts the application, normally at http://localhost:5173. `pnpm test` runs the TypeScript test suite. `pnpm build` checks TypeScript and builds the Vite client. `pnpm start` serves production mode after a build. See README.md for prerequisites and configuration. This document does not establish whether a server is currently running.

## Suggested next work

Choose the next incomplete criterion from the canonical checklist after inspecting actual code. Highest-risk boundaries are real execution isolation and durable coordination; verification gates are required before calling results functionally verified. Preserve the current working vertical slice and avoid a new framework or swarm rewrite.

Update this handoff after verified milestones. Record date, source revision when available, actual test evidence, blockers, and the next task; keep secrets and transient credentials out.
