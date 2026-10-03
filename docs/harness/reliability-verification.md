# Reliability verification — 2026-10-01

This report remains the historical 2026-10-01 result. Fresh 2026-10-03 audit/scenario evidence is separately recorded in the [multi-user Step 01 baseline and handoff](multiuser-step01-baseline.md); completion status remains in the [canonical checklist](checklist.md).

## Scope and verified causes

The request was read from the pasted attachment. Its referenced screenshot was absent: the attachment directory contained only Pasted text.txt. Existing unrelated deleted hook/Graphify skill files and older artifacts were preserved.

Source inspection and controlled reproductions identified these causes:

- The builder sent a monolithic file-operation envelope. Its structured-output exhaustion repair repeated the same oversized input at the same output allowance, then recommended higher effort without a verified provider completion ceiling. Hosted BYOK freezes builder/interpreter allowances at 8,000/2,400 before lower metadata caps; effort does not increase those allowances. OpenRouter completion metadata is separate from context_length.
- Concurrent personal interpretations reconciled in provider completion order. Unsubmitted shared canvas text was included as context, draft batches were absent from snapshots, replay receipts were limited to recent submissions, and no durable process-owner fence protected promotion.
- An asynchronous cloud save acknowledged mutable room revision/time instead of the snapshot actually committed. A state vector alone also cannot identify deletion-only changes. Clients could accept older states or reject a lower authoritative cursor after reconnect.
- A plain before/after text diff reused common prefixes and mangled authenticated insertion attribution. Independent browser sessions reproduced “Add filters” as “ilters. Add f”; synchronous CRDT capture plus equivalent insertion normalization fixes this case.
- Optional undefined cache/reasoning usage fields were redacted into placeholders, incorrectly marking measured input/output as unknown. Replayed older reconciliation could replace a newer final record. Shared Intent had no Canvas rail or revision snapshots.

## Implemented behavior

Output exhaustion is recognized before parsing/application. Initial project generation skips the oversized retry and requests a manifest of at most eight ordered, coherent one-file tasks. Each returns a complete validated operation; each checkpoint save is awaited before another task. Source checkpoints are candidates, not compiled/promoted artifacts. Schema and compiler repairs remain bounded, with a shared 24-physical-call executor limit across recovery and superseded candidates. Frozen configured spending reservations apply to every dispatch. Failed planning/tasks include an actionable next action, completed task count and retained artifact/call-bound evidence. A successful compilation remains functionally unverified.

Changed/removed accepted requirements are compared with the last promoted baseline to focus generation. Checkpoint source can seed an explicit retry of the same accepted fingerprint. The last compiled artifact is retained when a candidate fails. No truncated JSON continuation, credential/model fallback or automatic retry after restart is introduced.

Captured participant batches include every source change without the old 24-edit/400-character interpreter clipping; oversized complete input fails visibly with retained drafts. active submissions are retained beyond the recent-history window. They reconcile in capture order and survive restart as retained drafts if interpretation was interrupted. Receipts keyed by participant/request ID protect replay beyond recent submission history. Later accepted steering supersedes a fixed-revision candidate and stays queued for the following build. Failed acceptance commits roll back the registry and restore the author’s batch. Immutable save receipts include insertion clocks and deletion ranges. A new authenticated socket accepts its first authoritative state, then filters older states within that connection. The legacy HTTP build endpoint returns 410 instead of flushing teammates’ drafts.

SQLite leases serialize local owners; a server-process Postgres coordinator and an additive atomic fenced-snapshot migration are prepared. Hosted HTTP reads/mutations and WebSocket upgrades, received messages and outbound delivery recheck membership. A revoked idle reader receives no further state. Current project sources, checkpoints, drafts, revision snapshots, receipts and workflow/event/task/run projections are restorable from hosted snapshots; historical artifact bodies remain local.

The Canvas rail now shows Shared context, a Shared Intent accepted revision selector, an Accepted requirements card, an empty explanation, View requirements, a separate Recorded usage · partial card and workflow stage. Reported tokens sum persisted input/output without adding cache/reasoning subsets again. Physical calls include recorded attempts/retries; generation is the subset excluding connection/capability tests, including interpretation/recovery/repair. Missing usage stays explicitly unknown; estimates and historical logical counters are separate. Coverage remains partial because earlier history may be missing; these totals are not context occupancy.

## Executed checks

- pnpm test: **129/129 passed**. Tests include smaller-task exhaustion/recovery, checkpoint ordering, retained compiled artifact, context overflow without recovery, call/spend bounds, simultaneous captured submissions, later steering during build, duplicate commands, restart drafts, cloud flush failure, acceptance rollback, owner takeover, hosted membership revocation, deletion receipts, reconnect ordering and usage restore/replay.
- One earlier concurrent full run hit an existing five-second build-wait timeout under simultaneous build/graph load. The test passed unchanged in focused verification; the final isolated full run passed 129/129 in 21 seconds.
- pnpm build: strict TypeScript and production Vite build passed. Vite retains its existing >500 kB chunk warning.
- scripts/verify-reliability.ts: **three independent headless Chrome profiles with signed local participant sessions**, controlled provider and no paid inference. Simultaneous Alice/Bob submissions create one shared artifact; Cara’s unsubmitted draft stays separate. Cara edits offline, reconnects without inference, and explicitly submits. All three converge on accepted r3/artifact v2 and five physical/generation attempts, 500 reported input plus 250 output tokens, with zero incomplete usage calls. Two builder calls and three interpreter calls occur. Historical accepted r2 selection is verified.
- Browser layouts/actions: 1440, 1024, 768 and 390 px; no horizontal overflow, selectors/cards remain present, requirements drawer and usage navigation work, and mobile requirements action opens. Latest desktop/mobile/workflow screenshots were visually inspected. See ../../artifacts/reliability/browser-checks.json and its PNGs.
- graphify update .: completed AST refresh, 1,797 nodes/3,331 edges/115 communities. SQL files were skipped because tree_sitter_sql is unavailable; no semantic labeling/provider calls were made.
- git diff --check: passed.

## Remaining verification and operational limits — original 2026-10-01 run

The additive supabase/migrations/20261001104120_workflow_coordinator_fencing.sql is **not applied**. There is no local psql/Docker runtime; SQL execution, concurrent Postgres fencing, live hosted accounts and paid providers are unverified. Hosted code fails closed until the migration exists. No deployment occurred.

The missing reference prevents exact viewport/layout/typography comparison. The Studio Ivory shell was retained while requested purple sidebar accents and hierarchy were implemented; do not call this a reference match.

Multiple server instances require routing to the active owner; another process currently fails closed. Full event projections embedded in snapshots and per-delivery membership queries need load measurements. Older artifact bodies are not transferred by cache reconstruction. Input reservation uses conservative request bytes rather than a provider tokenizer. Source checkpoints and compilation do not establish functional correctness of generated products. Broader collaborative replacement edits and production scaling remain outside the exercised insertion fixtures.


## Reference availability update — 2026-10-02 (documentation only)

The user subsequently supplied the image at `C:/Users/QUTA4/Downloads/watermarked_img_15731704898281132106.jpg`. An unchanged portable copy is [shared-context-reference.jpg](references/shared-context-reference.jpg). Current status is **reference available; comparison pending**. The missing-image limitation above describes the 2026-10-01 run only; no comparison was performed retroactively and no reference match is claimed. Embedded image text is not product authority.

The cleanup source audit found no newer repository evidence that the coordinator migration was applied, owner routing resolved, older artifact-body restoration completed or projection scale measured. Their recorded operational limits remain. Source inspection does not reconfirm live database/deployment state. No application tests, build, browser checks, provider calls, migration or deployment were run for this update. Documentation validation is recorded separately in [documentation-cleanup.md](documentation-cleanup.md).
