# 2guys1canvas current handoff

Updated 2026-10-03 after Step 02 coordinator fencing and bounded owner retry implementation. Explicit user instructions take precedence. Local completion and hosted readiness remain separate.

Standing user instruction: commit and push each completed multi-user roadmap step to GitHub, with its verification evidence and handoff; report the destination branch/commit. Continue to execute only the step requested in each task.

The durable workflow is the primary shared object. Writing is collaborative and inference-free. **Build my changes** and editor-focused Alt+X capture the authenticated participant's steering; the accepted registry supplies the shared baseline. One logical coordinator serializes integration and promotion. Consequential conflicts require explicit affected-contributor agreement.

Current hosted inference is temporary OpenRouter BYOK, Developer only. The authoritative setup and limit contract is in [product.md](product.md#hosted-ai-and-limits). Source implements an eight-task recovery manifest and a 24-physical-call executor ceiling, with awaited candidate checkpoints and any frozen configured spending limit. These are implementation bounds, not proven optimal values. Failure retains the last compiled artifact; compilation does not establish functional correctness.

Source implements capture-order interpretation, persisted draft batches and command receipts, immutable cloud save receipts including deletions, accepted revision history, and local coordinator epochs. Hosted snapshots retain workflow projections and recent generated sources; older artifact bodies are not fully recoverable. Step 02 bounds hosted claim/renewal RPCs, permanently fences lost workers, cancels their work and adds authenticated HTTP 503 owner retry responses. The existing Worker retains stable primary-container affinity. Both the original [coordinator migration](supabase/migrations/20261001104120_workflow_coordinator_fencing.sql) and [Step 02 hardening](supabase/migrations/20261003203000_coordinator_dispatch_updates.sql) remain **prepared/unapplied**. Missing required RPCs fail closed; real database contention and deployment remain unverified.

The interface loads Studio Ivory and places Shared context beside Canvas, with accepted revision selection, separate partial usage and workflow stage. The [supplied reference](docs/harness/references/shared-context-reference.jpg) is now available; **comparison pending**. Its appearance is a requested target, not verified implementation. The earlier reliability run lacked the image; its dated result stays unchanged.

The 2026-10-01 reliability run reported **129/129 local tests**, a passing production build and three independent local Chrome sessions using a controlled provider. See [dated evidence and limits](docs/harness/reliability-verification.md). The 2026-10-02 documentation cleanup reran no application checks; fresh Step 02 evidence is recorded below.

## Next work

The [roadmap](docs/harness/multiuser-improvement-prompts.md) was read in full. Step 01 established eleven controlled observation scenarios; retain its [baseline](docs/harness/multiuser-step01-baseline.md). Step 02 completed local fencing/routing implementation and verification: **148/148 tests**, production build, script typecheck, three independent controlled Chrome profiles and AST Graphify refresh. Read the [Step 02 handoff](docs/harness/multiuser-step02-handoff.md) for exact scope, evidence and migration compatibility. No real coordinator SQL, hosted accounts, paid inference, migration or deployment ran.

Next task is **Step 03 only when requested**: artifact persistence and restoration. Step 03 was not started. Carry prepared coordinator SQL, the guarded disposable-database runner and hosted rollout checks forward; passing mocks and browser transport fixtures does not establish hosted readiness.

Use the [canonical checklist](docs/harness/checklist.md). Outstanding checks include reference comparison, real Postgres fencing contention, independent hosted accounts, authorized live BYOK/invitation delivery, snapshot scale and archival artifact restoration. Migration, deployment, email sending and provider spending require separate authorization. Isolation, functional acceptance and durable workflow budgets remain deferred.

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

Active source: `src/` for the Vite client, `server/index.ts` for HTTP/WebSockets, `server/rooms.ts` for orchestration, and `server/event-store.ts` for local durable projections. `app/` is not the active client. Setup commands belong in [README.md](README.md). Long chronological handoffs are preserved in the [historical archive](docs/harness/archive/2026-10-01-pre-consolidation/README.md); they do not override current documents.
