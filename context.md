# 2guys1canvas current handoff

Updated 2026-10-04 after Step 05 intent correction implementation and local verification. Explicit user instructions take precedence. Local completion and hosted readiness remain separate.

GitHub integration: the local cleanup checkout now includes `origin/codex/byok-mvp` through `472698a`, retaining the shared-contract/module cleanup and Jev gateway audit. Default/local-auth builds and boundary checks pass. The fresh full suite passed 188/191 before focused reruns; CPU-limit timing and final controlled intent-UI acceptance remain unresolved. See [current sync evidence](docs/harness/checklist.md#github-branch-integration-2026-10-04); prior Step 05 counts are incoming dated evidence.

Standing user instruction: commit and push each completed multi-user roadmap step to GitHub, with its verification evidence and handoff; report the destination branch/commit. Continue to execute only the step requested in each task.

The durable workflow is the primary shared object. Writing is collaborative and inference-free. **Build my changes** and editor-focused Alt+X capture the authenticated participant's steering; the accepted registry supplies the shared baseline. One logical coordinator serializes integration and promotion. Consequential conflicts require explicit affected-contributor agreement.

Current hosted inference is temporary OpenRouter BYOK, Developer only. The authoritative setup and limit contract is in [product.md](product.md#hosted-ai-and-limits). Source implements an eight-task recovery manifest and a 24-physical-call executor ceiling, with awaited candidate checkpoints and any frozen configured spending limit. These are implementation bounds, not proven optimal values. Failure retains the last compiled artifact; compilation does not establish functional correctness.

Source implements capture-order interpretation, persisted draft batches and command receipts, immutable cloud save receipts including deletions, accepted revision history, and local coordinator epochs. Hosted snapshots retain workflow projections and verified private references. Step 03 publishes immutable product/checkpoint bodies before canonical commit, restores the current six products and checkpoint into an empty cache, and retrieves older archived versions on demand. Previously discarded history cannot be recreated. Step 02 bounds hosted claim/renewal RPCs, permanently fences lost workers, cancels their work and adds authenticated HTTP 503 owner retry responses. The existing Worker retains stable primary-container affinity. Both the original [coordinator migration](supabase/migrations/20261001104120_workflow_coordinator_fencing.sql) and [Step 02 hardening](supabase/migrations/20261003203000_coordinator_dispatch_updates.sql) remain **prepared/unapplied**. Missing required RPCs fail closed; real database contention and deployment remain unverified.

The interface loads Studio Ivory and places Shared context beside Canvas, with accepted revision selection, separate partial usage and workflow stage. The [supplied reference](docs/harness/references/shared-context-reference.jpg) is now available; **comparison pending**. Its appearance is a requested target, not verified implementation. The earlier reliability run lacked the image; its dated result stays unchanged.

The 2026-10-01 reliability run reported **129/129 local tests**, a passing production build and three independent local Chrome sessions using a controlled provider. See [dated evidence and limits](docs/harness/reliability-verification.md). The 2026-10-02 documentation cleanup reran no application checks; fresh Step 02 evidence is recorded below.

## Next work

The [roadmap](docs/harness/multiuser-improvement-prompts.md) was read in full. Step 01 established eleven controlled observation scenarios; retain its [baseline](docs/harness/multiuser-step01-baseline.md). Step 02 completed local fencing/routing implementation and verification: **148/148 tests**, production build, script typecheck, three independent controlled Chrome profiles and AST Graphify refresh. Read the [Step 02 handoff](docs/harness/multiuser-step02-handoff.md) for exact scope, evidence and migration compatibility. No real coordinator SQL, hosted accounts, paid inference, migration or deployment ran.

Step 03 local implementation and verification are complete: **158/158 tests**, production build, strict script typecheck, empty-cache restoration in three independent controlled Chrome profiles and AST Graphify refresh. Read the [Step 03 handoff](docs/harness/multiuser-step03-handoff.md). Storage/PostgREST used the real SDK against a controlled loopback fixture; real Storage/RLS/SQL and deployment remain pending. No paid inference or historical data migration ran.

Step 04 routes compilation through AppContainer/Job Object on Windows, strips secrets, enforces limits and cancels/cleans child work. The build loop preflights before builder dispatch and retains the prior artifact without repairs or host fallback on infrastructure failure. Read the [Step 04 handoff](docs/harness/multiuser-step04-handoff.md) for fresh checks and scope. The Linux Bubblewrap/non-root Docker configuration is prepared but unrun; intended kernel/container acceptance remains required.

Step 05 local implementation and verification are complete: explicit inference-free author-scoped correction/withdrawal, permanent revision/payload receipts, preserved coauthor/history, independent source/context validation and an accessible modal review UI. **186/186 tests**, production build, strict script types and three independent controlled Chrome profiles passed. Read the [Step 05 handoff](docs/harness/multiuser-step05-handoff.md) for evidence, retained failed attempts and recovery scope. Next task is **Step 06 only when requested**: stable build progress under ongoing steering. Step 06 was not started. Carry prepared coordinator SQL, the guarded disposable-database runner and hosted rollout checks forward; passing mocks and browser transport fixtures does not establish hosted readiness.

Use the [canonical checklist](docs/harness/checklist.md). Outstanding checks include reference comparison, real Postgres fencing contention, independent hosted accounts, authorized live BYOK/invitation delivery, production snapshot scale, real private Storage/RLS recovery and restoration of legacy history absent from canonical records. Migration, deployment, email sending and provider spending require separate authorization. Linux deployment isolation acceptance, requirement-linked functional acceptance and durable workflow budgets remain outstanding.

## Read next

| Document | Responsibility |
| --- | --- |
| [product.md](product.md) | Accepted behavior and requested targets |
| [instructions.md](instructions.md), [AGENTS.md](AGENTS.md) | Contributor rules and task entrypoint |
| [architecture.md](docs/harness/architecture.md) | Current boundaries and data flow |
| [checklist.md](docs/harness/checklist.md) | Outstanding work and evidence-backed status |
| [decisions.md](docs/harness/decisions.md) | Stable decisions, rationale and supersession |
| [api.md](api.md) | Source-verified implemented contracts |
| [reliability-verification.md](docs/harness/reliability-verification.md) | Dated checks and their limits |

Active source: `src/` for the Vite client, `server/index.ts` for HTTP/WebSockets, `server/rooms.ts` for orchestration, and `server/event-store.ts` for local durable projections. Inactive `app/` scaffolding has been removed. Setup commands belong in [README.md](README.md). Long chronological handoffs are preserved in the [historical archive](docs/harness/archive/2026-10-01-pre-consolidation/README.md); they do not override current documents.


## Source navigation and cleanup

Active browser entry: `src/main.tsx`; hosted project navigation: `src/ProjectApp.tsx`; canvas/editor facade: `src/App.tsx`. The server starts in `server/index.ts`; `server/rooms.ts` remains the coordinator facade. Public contracts and the pure Yjs receipt helper now live in `shared/`. Context/conflict and accounting views are separate under `src/workspace/`; pure steering text helpers live in `server/steering-text.ts`.

[Cleanup plan](docs/harness/codebase-cleanup-plan.md) records the proposed stages. Implementation and fresh verification are tracked in [the checklist](docs/harness/checklist.md) and [cleanup evidence](docs/harness/codebase-cleanup-verification.md). The old Advanced/managed setup functions were unmounted; current Workspace renders ByokSetup. Supported local server APIs and persisted compatibility records remain.

Use Graphify first for code questions, then verify against source. [SOURCE_MAP.md](graphify-out/SOURCE_MAP.md) describes extraction limits. `pnpm audit:code` reports static usage and import boundaries; optional Jev mode reviews candidates without editing them. Credentials/cache/request evidence remain local.

The offline audit supports Vercel AI Gateway through AI_GATEWAY_API_KEY and direct TypeSafe through TYPESAFE_API_KEY, with explicit provider selection. The Vercel 20-file historical triage succeeded at a reported $0.001711374. It wrongly flagged one protected migration tool as obsolete at low confidence; that file remains protected. This is file-triage evidence, not the proposed 20-feature context-recall evaluation.
