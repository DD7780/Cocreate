# 2guys1canvas current handoff

Updated 2026-10-03 after the multi-user Step 01 audit and local baseline. Explicit user instructions take precedence. Product acceptance, local implementation and hosted verification are separate statuses.

Standing user instruction: commit and push each completed multi-user roadmap step to GitHub, with its verification evidence and handoff; report the destination branch/commit. Continue to execute only the step requested in each task.

The durable workflow is the primary shared object. Writing is collaborative and inference-free. **Build my changes** and editor-focused Alt+X capture the authenticated participant's steering; the accepted registry supplies the shared baseline. One logical coordinator serializes integration and promotion. Consequential conflicts require explicit affected-contributor agreement.

Current hosted inference is temporary OpenRouter BYOK, Developer only. The authoritative setup and limit contract is in [product.md](product.md#hosted-ai-and-limits). Source implements an eight-task recovery manifest and a 24-physical-call executor ceiling, with awaited candidate checkpoints and any frozen configured spending limit. These are implementation bounds, not proven optimal values. Failure retains the last compiled artifact; compilation does not establish functional correctness.

Source implements capture-order interpretation, persisted draft batches and command receipts, immutable cloud save receipts including deletions, accepted revision history, and local coordinator epochs. Hosted snapshots embed workflow/event/task/run projections and recent generated sources; older artifact bodies are not fully recoverable from them. The additive [coordinator migration](supabase/migrations/20261001104120_workflow_coordinator_fencing.sql) is recorded as **prepared, unapplied**. No newer applied evidence was found in the repository. Hosted code requires its RPCs and fails closed without them. Multi-instance routing to the active owner remains unresolved.

The interface loads Studio Ivory and places Shared context beside Canvas, with accepted revision selection, separate partial usage and workflow stage. The [supplied reference](docs/harness/references/shared-context-reference.jpg) is now available; **comparison pending**. Its appearance is a requested target, not verified implementation. The earlier reliability run lacked the image; its dated result stays unchanged.

The 2026-10-01 reliability run reported **129/129 local tests**, a passing production build and three independent local Chrome sessions using a controlled provider. See [dated evidence and limits](docs/harness/reliability-verification.md). This cleanup reran no application tests, browser checks or builds, made no deployment, applied no migration and spent no provider credits.

## Next work

The [staged multi-user roadmap](docs/harness/multiuser-improvement-prompts.md) was read in full. Step 01 added eleven controlled observation scenarios, a repeated measured workload and fresh independent-browser reload/incorrect-product evidence. Read the [Step 01 evidence and handoff](docs/harness/multiuser-step01-baseline.md); status and exact checks are in the canonical checklist. Application runtime remains unchanged. Known gaps include unvalidated contextual/source passages, discarded superseded candidates, artifact bodies missing from projection restoration, host-process tools, compiling-wrong promotion and non-durable executor allowance. Passing observation tests does not close these gaps.

Next implementation task is **Step 02 only when requested**: coordinator fencing and owner routing, with the prepared/unapplied SQL and real contention prerequisites carried forward. Step 02 and subsequent fixes were not started here; no provider comparison, paid inference, migration or deployment ran.

Use the [canonical checklist](docs/harness/checklist.md). Immediate outstanding checks are reference-viewport and responsive comparison; reviewed Postgres fencing execution and independent hosted accounts; authorized end-to-end BYOK and invitation delivery; and owner routing, snapshot scale and archival artifact restoration. Migration, deployment, email sending and provider spending require separate authorization. Keep acceptance evidence, isolation, approvals and model-aware context budgets visible as deferred work.

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
