# CoCreate context handoff

As of 2026-09-18. Recheck the source and checklist before acting; this handoff records controlled tests and a production build, but no live-provider semantic evaluation.

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
- Cloudflare container replacement can lose application data with the current persistence configuration.

Do not treat these as completed because a README, UI label, or earlier conversation described the target architecture.

## Latest validation

On 2026-09-18, the intent-classification fix passed its five focused tests, the full 41-test controlled suite, and `pnpm build`. The original “Create a website for my restaurant” regression was demonstrated failing before the fix. Coverage now includes a deterministic semantic matrix, mixed intents, safe ambiguity defaults, legacy normalization, authenticated targeted reinterpretation, stable shared-requirement identity, no duplicate build for unchanged accepted input, and protection of decisions/withdrawals. Earlier builder-operation and durable conflict-group coverage remains included. Browser interaction and live-model semantic evaluation were not exercised.

## Local workflow

`pnpm dev` starts the application, normally at http://localhost:5173. `pnpm test` runs the TypeScript test suite. `pnpm build` checks TypeScript and builds the Vite client. `pnpm start` serves production mode after a build. See README.md for prerequisites and configuration. This document does not establish whether a server is currently running.

## Suggested next work

Choose the next incomplete criterion from the canonical checklist after inspecting actual code. Highest-risk boundaries are real execution isolation and durable coordination; verification gates are required before calling results functionally verified. Preserve the current working vertical slice and avoid a new framework or swarm rewrite.

Update this handoff after verified milestones. Record date, source revision when available, actual test evidence, blockers, and the next task; keep secrets and transient credentials out.
