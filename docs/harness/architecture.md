# Current harness architecture

Source-audited 2026-10-03 for multi-user Step 01. This document describes current boundaries, not a second product specification or completion checklist. [Product](../../product.md) owns accepted behavior; [checklist](checklist.md) owns status; [decisions](decisions.md) owns rationale; [API](../../api.md) owns implemented contracts. The documentation cleanup performed no runtime checks; fresh local/mock observations are separately recorded in the [Step 01 evidence](multiuser-step01-baseline.md). Application boundaries remain unchanged.

## Runtime map

| Boundary | Source and responsibility |
| --- | --- |
| Browser | `src/main.tsx`, `src/ProjectApp.tsx`, `src/App.tsx`: project/auth shell, workspace and derived UI |
| Collaboration client | `src/provider.ts`: socket generations, CRDT exchange, flush/save receipts; `src/local-drafts.ts`: participant-scoped device recovery |
| HTTP/socket server | `server/index.ts`: transport, local sessions, project tickets, current membership checks and route retirement |
| Project access | `server/project-routes.ts`, `server/supabase-platform.ts`: accounts, membership, project operations and remote persistence |
| Coordinator/orchestration | `server/rooms.ts`: capture, interpretation order, registry, fixed-revision build loop and promotion; `server/coordinator.ts`: hosted owner epochs |
| Intent | `server/requirements.ts`, `server/generator.ts`: attributed classification, registry reconciliation and conflict groups |
| Generation | `server/generator.ts`, `server/build-recovery.ts`: context, schemas, targeted generation and awaited recovery checkpoints |
| Provider/accounting | `server/providers.ts`, `server/byok-lease.ts`, `server/usage-ledger.ts`: adapters, temporary keys, physical dispatch records and aggregation |
| Local durable store | `server/event-store.ts`: SQLite events, projections, artifacts and local coordinator leases |
| Candidate/tools/preview | `server/tool-registry.ts`, `server/project.ts`, `server/preview.ts`: policy, scoped operations, host-process compile and restricted preview |
| Deployment | `worker/`, `wrangler.jsonc`, `Dockerfile`: native container proxy/readiness and configured runtime; not a deployment claim |

The application remains a Vite SPA plus Node/Express/Yjs. `app/` is not its active entrypoint. Seven provider adapters and managed/preset modules remain for local compatibility/history; they do not imply seven active hosted setup paths. Current hosted AI policy is [BYOK](../../product.md#hosted-ai-and-limits). Prisma is an optional typed/introspection layer; Supabase SQL remains schema authority.

## Durable authority and storage

A project maps to one room and one durable workflow. Browser state, model memory and summaries are projections, not authority. The local mode stores ordered append-only SQLite events with workspace sequence, actor, input revision, hash and artifact reference, plus derived workspace/run/workflow/task views. Artifacts are content-addressed. Legacy JSON is backed up before lazy import and compatibility writes remain. Restore interrupts nonterminal runs/tasks and moves the workflow to awaiting input without repeating provider side effects.

Hosted Supabase Auth supplies identity; Postgres supplies project/membership and canonical snapshot/update/usage authority. SQLite/JSON is cache/local mode and must not silently take authority on hosted failure. The implementation embeds `events`, `workflow_state`, `task_state` and `run_state` in `project_snapshots.harness_state.harnessProjection`; it does not currently use every separately declared hosted harness table as a normalized live projection. Restore validates workspace IDs and replaces these local projection rows transactionally.

Snapshots also retain pending participant edit batches, active submissions, permanent participant/request receipts, accepted revision snapshots, current checkpoint, recent six versions with source files, recent 50 AI runs and retained provider records. The hosted physical-call ledger provides a broader separate record source. Exported projections contain artifact references, **not their bodies**. Private Storage upload/finalization primitives exist, but promotion/rehydration does not yet fully archive/restore older artifact bodies. Container replacement recovery is therefore partial, not a complete historical restoration guarantee. Full projections and indefinite receipts/history need scale/retention design.

Yjs V1 updates are written as explicit PostgreSQL hex bytes. Restore validates in an isolated document. The exact legacy Node Buffer JSON envelope is accepted only through strict decoding with original-byte quarantine; snapshot recovery uses individually valid updates matching stored SHA-256. Decoder guessing or destructive replacement is not permitted.

## Edits, submission and acceptance

1. Authenticated socket edits apply to Yjs and create participant-attributed edit records. Presence/awareness is ephemeral. Edits schedule persistence, not inference.
2. Browser updates coalesce for 40 ms. Submission drains them, requests flush, and waits for ordered document writes plus a canonical snapshot. Flush failure prevents the HTTP submit.
3. `submitChanges` checks the authenticated participant, temporary spender authority and request replay. It captures a structured clone of that participant's pending batch, frozen models/setup, document revision and accepted-registry context. It removes only that batch from pending and saves before interpretation.
4. All nonterminal submissions survive the recent terminal-history cutoff. Receipts keyed by `[participantId, requestId]` protect replay beyond that cutoff. Empty/replayed commands do not consume new edits.
5. A room steering queue interprets captured submissions in capture order. The primary submission path sends the complete authenticated edit batch and accepted baseline, without teammates' raw unsubmitted canvas context or the old edit clipping. Oversized input fails visibly.
6. Personal outputs classify each intent and reconcile attributable sources into stable requirements. Explicit requests/decisions become accepted; proposals/questions/ambiguity stay visible. Persistence failure rolls back acceptance and restores the author's batch. Interrupted interpretations restore captured edits for explicit resubmission.
7. Nearby eligible accepted changes use the configured build collection window. The builder freezes eligible requirements/revision/fingerprint; later acceptance supersedes stale candidates and remains queued for subsequent processing.

This isolates the submitted input, not a proven general semantic firewall. Step 01 controlled fixtures reproduce acceptance of an unresolved “that” reference and a model-invented source passage absent from captured edits, while server-stamped author identity remains the caller. There is no general source-passage or contextual-target validation gate. Broader replacement edits still need work. Explicit reinterpretation is a legacy targeted path using recorded author edits and shared document context, not the new capture queue; it needs its own ordering/context audit. Automatic restart resumption is not implemented: restoration is inference-free and awaits human action.

Deletion is not withdrawal. Conflict groups hold stable subject/scope, alternatives, contributor set, group revision/round, selections and decision history. The authenticated selection route checks current editor/owner membership AND affected contributor, revision/timestamp and request ID, serializes choices and awaits persistence. Silence stays pending; disagreement retains options; unresolved requirement IDs are excluded while independent accepted work remains eligible. Detection is deterministic for known structured cases, with coarse dependency scopes; broad semantic detection, document highlights and richer compromise/reopen UI are incomplete.

## Coordinator and immutable saves

Local coordinators use SQLite leases with owner ID, epoch and expiry. This serializes processes sharing the same store; separate containers do not thereby share ownership. Hosted `RemoteCoordinator` claims/renews a Postgres epoch, checks before dispatch/promotion and supplies an epoch to atomic snapshot commit. A lost process cannot reclaim for its old workers. The migration `20261001104120_workflow_coordinator_fencing.sql` contains service-role-only claim/release/commit RPCs and is recorded as **prepared/unapplied**; no newer repository evidence proves live execution. Missing RPCs fail closed. Multi-instance requests are not routed to the current owner: a non-owner process fails closed. Owner affinity/routing remains unresolved.

Each save captures its revision, timestamp, Yjs insertion vector and deletion-range signature alongside an immutable clone. The persist queue serializes remote commits. Only the committed snapshot's receipt is sent as saved; errors remain unsynced. Ordered update append failure may recover through a confirmed full snapshot; snapshot failure cannot be called saved. Local SQLite completion cannot acknowledge Postgres.

Within a socket generation, the browser rejects older workflow/snapshot cursors and save revisions. A new authenticated connection resets these cursors and accepts its first canonical state, including a lower cursor after failed prior writes. Saved status requires the receipt to cover both local insertions and deletions. Device-saved status follows a separate IndexedDB transaction. Cache keys include room and participant, bytes are validated before merge after authenticated state, and quota/corruption errors are visible. Full offline cold startup and account purge/retention controls are incomplete.

Hosted reads/mutations, preview/download access, socket upgrade, received messages and outbound packets recheck membership; current role limits viewer writes. Socket tickets expire after five minutes. Revoked members receive no later delivery after the delivery check, but there is no proactive push closing every completely silent idle socket immediately. This distinction and per-delivery query cost remain relevant.

## Candidate generation, recovery and promotion

The shared builder receives accepted eligible requirements and bounded project files, never raw canvas as authority. Changed/removed requirements are compared with the last promoted baseline. It applies validated room-scoped operations through typed tools, compiles, then promotes only if revision/fingerprint and ownership still agree.

Hosted BYOK uses requested builder/interpreter outputs of 8,000/2,400 before lower reported completion/context caps; effort is not proof of a higher provider ceiling. Complete input sizing remains conservative bytes rather than provider tokenization. Omitted-file names are available but full model-aware retrieval/references remain incomplete.

Whole-project output exhaustion skips the repeated oversized retry and requests a schema-constrained manifest of one to eight ordered one-file tasks. Each task returns exactly one complete write at the planned path, passes operation validation and awaits a durable checkpoint before continuing. Whole JSON envelopes are not resumed by concatenating truncated text. Checkpoints are source candidates; an explicit retry may reuse them only for the same accepted fingerprint.

The room's executor execution budget is initialized once for the build loop and cleared when that loop ends. The physical dispatch boundary enforces **24 calls**, including recovery, validation/compiler repairs, transport retries and superseded candidates. Any frozen configured spending maximum is also enforced. The manifest bound is not a worker scheduler or a workflow-wide budget. Hosted BYOK does not use managed credit; provider account limits remain separate. Current constants require empirical adequacy evaluation, not optimality claims.

Compile/repair attempts remain bounded (two for temporary BYOK, at most three for compatibility configurations) within the shared physical bound. Source/path validation, tool policy, revision and lease gates protect integration. Failed candidates retain the last compiled preview and include recovery/task/call information plus a next action. Compilation alone records unverified functional evidence. Runtime error reporting can restore the previous version; there is no general rollback/control API.

## Workflow inspection and accounting

The durable workflow projection includes phase/revision, initial controller and control epoch, tasks, recent safe activity/cursor and promoted artifact evidence. Current serialized builds are durable tasks before dispatch; recovery file tasks are a manifest/checkpoint sequence inside the build, not independently scheduled workers. Phase schemas include future controls but no public pause/resume/cancel/approval/handoff routes implement them.

Provider adapters record unique physical attempts, dispatch intent, purpose, frozen metadata, provider usage and outcome without prompts, secrets or private reasoning. Hosted persistence is awaited before dispatch. Local aggregation scans all recorded events; hosted mode reads the server-only physical ledger. Reconciliation deduplicates by call ID, preferring final/newer records over delayed dispatch/older outcomes. Recent UI windows do not define the full available aggregation scope.

Generation includes interpretation/build/recovery/repair; setup purposes are connection/text/interpreter/builder capability tests. Reported-token totals use input plus output only; cache/reasoning subsets are not added twice. Missing usage, uncertain cost and pre-ledger gaps remain explicit. Coverage is partial; historical logical generation counters and estimates stay separate. Broader orphaned-dispatch reconciliation and durable workflow-wide budgets are incomplete.

Current UI loads Studio Ivory. Shared context is visible in Canvas/Workflow/Artifacts, with selected accepted revision snapshots, separate partial usage and stage. Conflict/provenance details use the existing drawer and controls. The [available reference target](../../product.md#shared-context-recorded-usage-and-requested-appearance) has not been compared. Historical themes and managed setup are retained only as [archive/compatibility history](archive/2026-10-01-pre-consolidation/README.md).

## Policy and deferred boundaries

Tool metadata/schema/role/workspace filters deny unauthorized apply/build/promote operations. Generated paths/capabilities are restricted and previews use CSP/style isolation; host-process compilation is **not a process sandbox**. Real isolation with stripped secrets, timeout, resource limits and cancellation remains required work.

Accepted deferred direction includes structured revision-safe commands, scoped persistent approvals, controller handoff, pause/resume/cancel, dependency scheduling, justified bounded isolated workers, serialized integration, uncertain-side-effect reconciliation, targeted/browser regression evidence and complete durable artifacts. Analyst/Researcher toolchains remain unavailable. None is implied implemented by a schema or label. See the [checklist](checklist.md) for evidence, live verification and remaining work.
