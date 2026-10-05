# 2guys1canvas current handoff

Updated 2026-10-05 for Step 10 integration review. Explicit user instructions take precedence. Local completion and hosted readiness remain separate.

Standing user instruction: commit and push each completed multi-user roadmap step to GitHub, with its verification evidence and handoff; report the destination branch/commit. Continue to execute only the step requested in each task.

The durable workflow is the primary shared object. Writing is collaborative and inference-free. **Build my changes** and editor-focused Alt+X capture the authenticated participant's steering; the accepted registry supplies the shared baseline. One logical coordinator serializes integration and promotion. Consequential conflicts require explicit affected-contributor agreement.

Current hosted inference is temporary OpenRouter BYOK, Developer only. The authoritative setup and limit contract is in [product.md](product.md#hosted-ai-and-limits). Source implements an eight-task recovery manifest and a 24-physical-call durable workflow ceiling, with awaited candidate checkpoints and any frozen configured spending limit. These are implementation bounds, not proven optimal values. Failure retains the last compiled artifact; compilation does not establish functional correctness.

Source implements capture-order interpretation, persisted draft batches and command receipts, immutable cloud save receipts including deletions, accepted revision history, and local coordinator epochs. Hosted snapshots retain workflow projections and verified private references. Step 03 publishes immutable product/checkpoint bodies before canonical commit, restores the current six products and checkpoint into an empty cache, and retrieves older archived versions on demand. Previously discarded history cannot be recreated. Step 02 bounds hosted claim/renewal RPCs, permanently fences lost workers, cancels their work and adds authenticated HTTP 503 owner retry responses. The existing Worker retains stable primary-container affinity. Both the original [coordinator migration](supabase/migrations/20261001104120_workflow_coordinator_fencing.sql) and [Step 02 hardening](supabase/migrations/20261003203000_coordinator_dispatch_updates.sql) remain **prepared/unapplied**. Missing required RPCs fail closed; real database contention and deployment remain unverified.

The interface loads Studio Ivory and places Shared context beside Canvas, with accepted revision selection, separate partial usage and workflow stage. The [supplied reference](docs/harness/references/shared-context-reference.jpg) is now available; **comparison pending**. Its appearance is a requested target, not verified implementation. The earlier reliability run lacked the image; its dated result stays unchanged.

The 2026-10-01 reliability run reported **129/129 local tests**, a passing production build and three independent local Chrome sessions using a controlled provider. See [dated evidence and limits](docs/harness/reliability-verification.md). The 2026-10-02 documentation cleanup reran no application checks; fresh Step 02 evidence is recorded below.

## Current handoff and next work

Step 10's [integration handoff](docs/harness/multiuser-step10-handoff.md) and [canonical checklist](docs/harness/checklist.md) own the latest results. Three independent signed local browser profiles exercise caller-only concurrent submissions, fixed candidates with later captures, failed functional verification, explicit inference-free correction, reconnect/reload, private-body/cache replacement, receipt replay and converged accounting. The final browser run has nine physical calls, 1,350 reported tokens and products v1/r2, v2/r3 and v3/r6; unknown price outcomes retain uncertainty. The server now closes HTTP ingress and drains in-flight requests before disposing SQLite/coordinator state. Native job accounting adds bounded numeric diagnostics without changing isolation quotas or authority.

Preserve the [Step 01 baseline](docs/harness/multiuser-step01-baseline.md) and predecessor handoffs as dated evidence. Steps 02–08 implement local fencing, private artifact recovery, Windows isolation, attributable correction, bounded collection, narrow list verification and durable physical budgets. Step 09 retains serial personal interpretation and one integration owner (D-0052); its offline comparisons enable no scheduler/shared-interpreter path. Earlier full/native failures remain retained; a later focused pass does not turn an earlier whole-suite failure into a pass. Current whole-suite status and exact commands belong in the Step 10 handoff/checklist.

The current complete local regression gate passes 212/212 in Step 10; earlier failed runs remain retained. Next work requires separately authorized release prerequisites: apply the two prepared coordinator migrations to the verified target, run real Postgres contention, independent hosted-account and private Storage/RLS/container-replacement checks, then intended Linux compiler/browser adversity and source-to-deployment/rollback verification. Live BYOK/quality/invoice comparisons and invitation delivery need designated accounts, recipient and budget. No migration, deployment, paid inference or email ran in Step 10. Reference comparison, broader functional coverage, scale/retention and legacy history absent from canonical records remain open. Do not start a new roadmap step or deploy from this handoff automatically.

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
