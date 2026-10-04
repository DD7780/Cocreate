# Step 06 handoff — stable progress under ongoing steering

Updated 2026-10-04. Execute Step 06 only from the fully read [roadmap/common contract](multiuser-improvement-prompts.md), following the [Step 05 handoff](multiuser-step05-handoff.md). Local verification and hosted readiness are separate. Step 07 is unstarted. The standing user instruction authorizes committing and pushing this step to the existing `codex/byok-mvp` branch; the task response records the verified commit. Local preview: `http://localhost:5173`.

## Outcome and policy

The reproduced boundary was ordinary accepted steering changing the fixed candidate before promotion. Five controlled arrivals spent five builder attempts, discarded four, and produced nothing before the final release. Step 06 uses **bounded-collection-v1** (D-0049): close interpretation admission at the collection deadline, finish only the already executing interpreter, and run one fixed accepted candidate. Later caller commands persist their complete captured batches, accepted context, model/setup and replay identity without inference. Resume them in capture order after completion. Held commands do not block explicit intent/conflict decisions on the steering queue.

Default quiet collection is three seconds, maximum wait sixty seconds from the first capture, and cooldown thirty seconds. The admission deadline is the later of the cooldown endpoint and the earlier quiet/maximum-wait endpoint, clamped to now. Queued interpretations cannot extend it; an executing interpreter still has its existing provider timeout. Provider, compiler and executor limits bound the remaining stages separately. There is no fixed end-to-end SLA. The deadline test uses a six-command backlog, 100 ms interpretation delay and 80 ms collection maximum; no more than the initial plus already executing interpretation enters the first candidate.

Ordinary held captures do not change the accepted registry during generation. Explicit corrections/withdrawals and conflict decisions still cancel invalidated assumptions. Existing frozen revision/fingerprint/ownership, operation and isolated compilation gates remain intact. No stale candidate becomes an authoritative current product. Source checkpoints retain their existing matching-fingerprint/source validation rule; attribution-only acceptance reuses an already current product without another builder call. Its recorded artifact revision remains the original revision.

The progress bar distinguishes building/accepted revision, available version and its recorded revision, any queued accepted revision and submitted changes waiting for interpretation. A captured command has no invented accepted revision. Older products say their revision was not recorded. This projection derives from existing authoritative state rather than adding another durable ledger.

The in-memory 24-call executor ceiling survives successive candidates while the capture queue remains pending, including cancellation. It clears on a successful drain (including unchanged-fingerprint reuse) or explicit failed-build retry. Interpretation/setup and restart persistence remain outside this scope; **Step 08 is still required**. Held captures restore to author drafts on error or restart, with failed replay receipts and explicit new submission required. Recovery/reconnect never repeats inference. Deferred interpretation rechecks current hosted owner/editor membership and existing funding/ownership rules before physical dispatch.

## Measured comparison

Same five authored commands, controlled output and per-candidate release barriers, using the actual Windows compiler. Before source was Step 05 commit `472698a1f240e0315789369dc8ba3facafbd394b`; after source hashes are in the verification summary. The observation fixture's release order changes only as required to await the now-preserved candidate before the next starts. Historical Step 01 samples remain unchanged.

| Observation | Before | After |
| --- | ---: | ---: |
| Promotions before final release | 0 | 4 |
| Discarded/stale candidates | 4 | 0 |
| Final promotions | 1 | 5 |
| Builder calls | 5 | 5 |
| All physical calls (five interpreters + five builders) | 10 | 10 |
| Last accepted event to final promoted event | 8,397 ms | 3,029 ms |

See [before log](../../artifacts/multiuser-step06/before-continuous.log), [after log](../../artifacts/multiuser-step06/after-continuous.log), [comparison](../../artifacts/multiuser-step06/comparison.json) and [runner](../../artifacts/multiuser-step06/reproduce.ts). This single before/after sample measures useful progress and wasted work; it establishes neither total call savings nor a production latency distribution. The separate four-capture finite burst drains in two builder calls. The sustained-arrival test admits another command during each of three active candidates, verifies intermediate promotions without an empty queue, then drains revision 4 with four retained executor calls.

## Files and compatibility

- `server/rooms.ts`: captured admission, bounded cutoff, serial resumption, restoration and executor lifetime; new `server/build-progress.ts` derives the view. `server/index.ts` supplies the existing membership check for deferred dispatch.
- `src/types.ts`, `server/artifacts.ts`: optional `buildProgress` and `Version.specificationRevision`, preserved in archive metadata. Existing bodies/hashes and routes remain compatible; unknown legacy revisions are not fabricated. Rollback readers must preserve new metadata. No SQL migration is added.
- `src/BuildProgress.tsx`, `src/build-progress.css`, `src/App.tsx`: accessible shared progress bar. `vite.config.ts` excludes generated/data/evidence/graph/runtime outputs from the local watcher; editing application source still reloads it. Official Vite watcher documentation was fetched through ctx7. This prevents verification outputs from reloading the user's room.
- `tests/build-progress.test.ts`, `tests/fixtures/build-progress.ts`: real disposable SQLite/loopback provider/Windows isolation outcome checks. Existing baseline/reliability regressions now require publication of the fixed candidate followed by later captured steering, replacing their obsolete supersession expectation. Earlier baseline files remain historical evidence.
- `scripts/verify-build-progress.ts`: three isolated Chrome profiles, synthetic signed local owner/editor/viewer sessions, controlled provider, replay/reload/current revision convergence and desktop/mobile screenshots. Canonical product/API/architecture/instructions/context/decisions/checklist/README/verification documents update together.

## Verification and retained attempts

Final required `pnpm test` passed **194/194**, zero failures/skips; [log](../../artifacts/multiuser-step06/full-tests-final.log). Default production build and strict standalone browser-script types passed. AST-only Graphify refreshed **2,251 nodes / 4,482 edges / 140 communities**, no LLM calls; optional SQL parser is unavailable and semantic labels were not regenerated. Final documentation links, decision IDs, source hashes and diff are recorded in the [canonical checklist](checklist.md) and [verification summary](../../artifacts/multiuser-step06/verification.json). The targeted progress/reliability run passed **23/23**, with all eight new outcome tests; [log](../../artifacts/multiuser-step06/progress-reliability.log). Browser checks passed in three independent profiles: durable captures during a held r1, no extra interpretation on literal request replay, viewer submit 403, reload without inference, revision-label convergence, r1/r3/r4 promotions under further captures, seven physical calls, and no overflow at 1440/390 px. [Report](../../artifacts/multiuser-step06/browser/checks.json), [passing log](../../artifacts/multiuser-step06/browser-second.log). Pending/available/desktop/mobile screenshots were inspected. Compilation is explicitly functionally unverified.

Failed attempts remain available: the first setup omitted a room ID (fixed; scoped test workers stopped); the initial burst's 30 ms collection did not promise all four commands in its second candidate (fixture explicitly uses 500 ms/one-second bounds now); earlier provider/compiler publication deadlines failed; and the first browser run timed out at the first publication. Its shutdown also let a closing browser request reach a closed SQLite store; the fixture now navigates clients away before closing. Browser rerun passed without increasing its deadline. Typecheck errors (async save result and physical-usage field path) were fixed. The first full suite passed **192/194**: one drain deadline and one legacy supersession assertion. The revised regression checks each of two sequential publications with the existing per-publication wait helper. No provider timeout, compiler limit, promotion invariant or existing wait helper was increased or disabled. New diagnostics preserve status/budget/candidate information if a drain fails again.

Scope is controlled loopback provider, real local SQLite and Windows OS compilation, with signed local browser sessions. No paid inference, live provider, hosted account, SQL execution, migration, deployment, project-record deletion or external message ran. Unrelated deleted hook/skill files and old artifacts remain untouched. Local watcher logs are private runtime outputs and are excluded from the commit.

## Handoff and outstanding dependencies

Next requested task: **Step 07**, requirement-linked functional evidence and promotion through Step 04 isolation. The deliberately incorrect compiling fixture still promotes with `verified:false`; this Step 06 result must not be called functional correctness. Do not start Step 07 here.

Carry forward both prepared/unapplied coordinator migrations and real Postgres contention/uncertain-save acceptance; real hosted membership/funding/replay tests; real private Storage/RLS and disposable deployed cache replacement; Linux kernel/container isolation adversity; production projection/receipt scale; and appearance-reference comparison. Hosted progress/load and paid-provider timing remain unverified. Step 08 must persist and reserve a workflow-wide budget across interpretation/setup/retries/restart and unknown outcomes. No new release or migration is authorized by local completion.
