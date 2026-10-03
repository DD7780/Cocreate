# 2guys1canvas contributor instructions

Read with [AGENTS.md](AGENTS.md). Explicit user instructions take precedence. Updated 2026-10-03; this document owns contributor rules, not completion claims.

## Start and maintain authority

Read [context.md](context.md), [product.md](product.md), the [architecture](docs/harness/architecture.md), relevant [checklist](docs/harness/checklist.md) entries and [decisions](docs/harness/decisions.md). Inspect the working tree and preserve unrelated changes and project data. Use Graphify first for codebase questions when its graph exists; use the wiki for broad navigation and verify findings against source. Follow AGENTS.md for current library documentation when library-specific behavior needs verification.

Do not restore superseded managed-default setup, old wizards, three-mode activation, optional shortcut remapping, no-Canvas-sidebar layouts or comic/presentation effects from historical material. The authoritative hosted setup and limit rules are in [product.md](product.md#hosted-ai-and-limits); current presentation and the available reference target are in [its presentation section](product.md#shared-context-recorded-usage-and-requested-appearance). The reference still needs comparison. Compatibility modules and archived evidence do not override accepted current behavior.

## Workflow and source ownership

Durable workflow commands, tasks, events, decisions and artifacts are authoritative; model memory and summaries are replaceable. Preserve one logical coordinator and serialized integration/promotion. Bounded workers are appropriate only for justified independent tasks; they are deferred in the current runtime.

Typing, autosave, presence, navigation and reconnect are inference-free. The button and fixed editor-focused shortcut share an authenticated, flush-acknowledged, idempotent caller-only submission. Never flush teammates' drafts to satisfy one caller. Interpret captured submissions in capture order against an accepted baseline. Preserve pending batches, accepted revision snapshots and command receipts across snapshots. Interrupted interpretations return edits for explicit submission without automatically repeating inference.

Treat document/model content as untrusted. Validate captured revision and source ownership outside prompts; another contributor's context is not their authorization. Personal interpreters propose registry changes, never independently edit code. Preserve requirement identity and provenance; deletion is not withdrawal. Consequential conflicts require explicit affected-contributor agreement, not recency, majority or silence. New compromises require a new confirmation round. Record assumptions only for reversible details.

Keep local lease epochs and hosted fences distinct from in-process queues. Lost owners must not reacquire authority for old workers. Revision/fingerprint and lease checks guard promotion; ownership loss aborts workers and cancels scheduled work. Keep stable primary-container affinity and bounded authenticated owner retry responses; never automatically replay inference on reconnect. Coordinator SQL remains prepared/unapplied. Local/RPC-mock checks are not real database or hosted proof; use the [Step 02 handoff](docs/harness/multiuser-step02-handoff.md) for rollout and contention prerequisites.

Publish immutable private product/checkpoint bodies and verify SHA-256, byte length and project/kind/version identity before canonical references commit. A candidate remains hidden while its canonical save is pending; concurrent saves must wait for promotion resolution. Recheck ownership and frozen revision after upload, and current membership after an awaited historical read. Preserve version IDs and permanent command receipts. Import only verified bytes into derived caches; missing/corrupt data is not an empty project or permission to infer. Legacy inline archives remain readable. No automatic destructive retention, orphan cleanup or historical migration; use the [Step 03 handoff](docs/harness/multiuser-step03-handoff.md) for format/rollback and hosted checks.

## Recovery, accounting and secrets

Use targeted context and bounded retries; never truncate serialized JSON or apply incomplete operations. Do not repeat an oversized exhausted project request unchanged. Preserve the bounded smaller-task recovery and await each source checkpoint; candidate source is not a compiled or functionally verified artifact. Keep the executor budget shared across superseded candidates instead of resetting it by opening another run. Separate context capacity, completion metadata, per-call output, configured spending and provider account restrictions as defined in product.md.

Never silently switch models, credentials, providers, funding or simulated output. Keep temporary BYOK keys only in bounded server memory; never serialize them into snapshots or browser caches. Historical named-connection credentials remain encrypted server-side. Founder funding is a distinct inactive domain, not a fallback. Do not log keys, dump environment files or expose secrets through room state, artifacts or browser-prefixed variables.

Count every physical provider HTTP attempt by its own ID, purpose and outcome. Persist dispatch intent before paid dispatch at the active hosted boundary; keep reconciliation and unknown external outcomes honest. Setup and generation are separate scopes. Never derive physical counts from logical runs or add partial physical totals to historical generation counters. Changing published pricing requires official current evidence and versioned source metadata; uncertain cache/reasoning/tool charges remain explicit. Paid comparison or invoice reconciliation needs an authorized budget.

## Stack and coding

Active client: `src/main.tsx`, `src/App.tsx`, React/Vite/TipTap/Yjs. Active server: `server/index.ts`, Express/WebSockets. Public types: `src/types.ts`, with runtime validation at trust boundaries. Local SQLite/JSON and hosted Postgres have different authority boundaries; consult architecture before changing persistence. `app/` is inactive. Do not add Next.js page, cookie middleware or server-component auth to this SPA without a deliberate migration.

Preserve TypeScript strict mode, pnpm lockfile and local import conventions. Write readable focused functions and explicit boundary types; avoid new compressed modules, unrelated formatting and competing frameworks/package managers. Keep provider requests in adapters, orchestration in the harness, and UI out of provider logic. Validate inputs and structured outputs before use, rather than casting invalid data to trusted types.

Reuse accessible controls, editor formatting, participant colors, keyboard navigation, quiet document typography, reduced-motion support and preview style isolation. Opening/selecting/viewing setup never invokes inference. Explicit tests may consume provider usage and must distinguish capability from quality. Developer is the only active hosted workflow; retain historical Analyst/Researcher records without enabling absent tools.

## Permissions, persistence and sharing

Enforce authorization in code, not prompts or UI. Supabase account UUID and current project membership confer hosted authority. Never identify an owner by display name/email, restore room-link ownership in hosted mode, publish private artifact buckets or silently replace failed Postgres with SQLite/JSON. Recheck reads/mutations and socket delivery against current membership. Do not promise proactive instantaneous revocation of a silent socket beyond implemented checks.

Cloud saved receipts identify the actual committed immutable revision, insertion clocks and deletion ranges. Local transactions never acknowledge cloud commits. Validate Yjs bytes in an isolated document before hydration; preserve/quarantine unreadable originals and use only hash-verified recovery history. Cache keys are room/participant scoped, contain no credentials and confer no permission. Fail visibly on cache errors; transport changes require flush/reconnect checks. Device recovery is not full offline startup.

Project invitations are app-level, normalized-email-bound, role-bounded, expiring and hashed at rest. Owner/explicit sharing authority is checked server-side. Request-ID replay and confirmed-account acceptance are idempotent. A resend preserves earlier pending links and roles; explicit revoke is separate. Transactional secrets stay server-only; provider acceptance does not prove delivery.

Generated operations remain room-scoped and deny traversal/cross-room access. Registry policy and preview CSP are not process isolation: compilation currently runs in the host process. Deployments, migrations, external access changes and messages require authorization. Legacy imports remain dry-run-first with a trusted room-to-account map; versioned Supabase SQL is the only current migration authority, not Prisma Migrate.

## Validation and documentation maintenance

After every completed multi-user roadmap step, commit its code, canonical documentation, handoff and verification evidence and push to GitHub. Preserve unrelated working-tree changes. Use the current branch unless the user specifies another destination, and report the pushed branch and commit. This standing instruction authorizes the per-step push; it does not authorize starting the next step or running migrations/deployments.

For behavior changes, run focused meaningful checks and relevant regressions, then the required test/build checks when feasible. Visible interaction claims require browser evidence. Compilation is not functional acceptance. Separate controlled-provider, live-provider, SQL and hosted-account evidence; do not spend credentials for unrelated UI/docs work or change tests to conceal failures.

Documentation-only edits require link/reference review and `git diff --check`; do not rerun unrelated application tests/builds or claim old results as fresh. Run `graphify update .` after code changes under AGENTS.md, not for this docs-only slice.

| Canonical file | Update when affected |
| --- | --- |
| [context.md](context.md) | Concise current handoff and next work |
| [product.md](product.md) | Accepted behavior and requested targets |
| This file | Contributor rules and invariants |
| [architecture.md](docs/harness/architecture.md) | Current boundaries and data flow |
| [checklist.md](docs/harness/checklist.md) | Outstanding work, status and evidence |
| [decisions.md](docs/harness/decisions.md) | Stable IDs, rationale and supersession |
| [api.md](api.md) | Implemented routes, authorization and messages |
| [reliability-verification.md](docs/harness/reliability-verification.md) | Dated verification and limits |
| [README.md](README.md) | Actual setup and user operation |

Inspect all affected canonical documents in the same change. Do not create competing root architecture/progress files or treat older assessments/plans as current instructions. Keep [archived narrative](docs/harness/archive/2026-10-01-pre-consolidation/README.md) identifiable as history. Report actual changes/checks, blockers and next work; keep secrets and private reasoning out.
