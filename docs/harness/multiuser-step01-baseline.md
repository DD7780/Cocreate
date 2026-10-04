# Multi-user Step 01 evidence and handoff

Prepared 2026-10-03 for the [complete roadmap](multiuser-improvement-prompts.md). Completion status lives only in the [canonical checklist](checklist.md). This is dated audit evidence, not acceptance of the pack's proposed later designs or proof their fixes are implemented.

## Outcome and scope

Read the entire supplied roadmap and required canonical steering. Queried Graphify before source investigation, then verified boundaries directly. Added controlled-provider observations and reused existing authority/recovery tests and the three-profile browser harness. Application runtime, public API, migration, provider selection and product behavior remain unchanged. Preserved unrelated documentation edits, deleted local helpers and older artifacts. No paid inference, external account action, migration or deployment occurred. The 2026-10-01 results remain historical.

New tests intentionally assert **current observations, including gaps**. Passing them does not accept deficient behavior. Later fixes must replace gap assertions with the agreed safe outcome while retaining this dated evidence.

## Reproduction and measurements

Run from the repository root in PowerShell:

```powershell
pnpm.cmd test
pnpm.cmd build
$env:COCREATE_AUTH_MODE = 'local'
pnpm.cmd exec tsx scripts/multiuser-baseline.ts
$env:VITE_COCREATE_AUTH_MODE = 'local'
pnpm.cmd exec vite build --configLoader runner
Remove-Item Env:VITE_COCREATE_AUTH_MODE
$env:COCREATE_RELIABILITY_OUTPUT = 'artifacts/multiuser-step01/browser'
pnpm.cmd exec tsx scripts/verify-reliability.ts
pnpm.cmd build # restore the default production bundle after the local browser fixture
graphify update .
```

The [runner](../../scripts/multiuser-baseline.ts) repeats eleven scenarios three times sequentially, each with a fresh SQLite store, synthetic participants and loopback provider. Collection is 20 ms, max-wait 100 ms, cooldown zero; the first slow interpreter waits 80 ms. For two/five arrivals, each builder barrier releases only after the next interpretation accepts; final release follows the last arrival. Observation timeout is ten seconds. These accelerated settings and controlled outputs are not production traffic or live model quality.

[Raw baseline](../../artifacts/multiuser-step01/baseline.json) contains bounded numeric/flag observations, timing, reported usage and SHA-256 source hashes, excluding prompts, bodies, participant identities and credentials. Capture-to-provider-handler timing includes persistence/transport/queue; handler elapsed includes imposed delays/barriers. Ledger start/end measures physical interpretation requests including dispatch persistence and response reading, not semantic acceptance. Acceptance-to-promotion is a preview-availability proxy. Browser acceptance-to-rendered DOM after explicit preview navigation includes build, polling, navigation and rendering, not paint timing. Missing failed-call usage stays unknown. Fixture tokens are synthetic reports, not invoice/cost evidence.

Final three-repeat sample: delayed first interpreter physical duration 104–148 ms; second captured submission reaches the provider after 192.8–217.2 ms versus 58.2–79.9 ms for the first. Five-arrival last-acceptance-to-promotion is 380–481 ms after four discarded candidates. Full exported projection sizes for 0/10/50 added history events are 4,942/9,910/29,830 bytes in all repeats. These bounded observations expose waiting/waste/growth; they do not establish a production service-level bound or justify changing topology.

## Scenario inventory

The [shared fixture](../../tests/fixtures/multiuser-baseline.ts) runs through [observation tests](../../tests/multiuser-baseline.test.ts) and the repeated runner.

| Scenario | Observed outcome | Limit |
| --- | --- | --- |
| `simultaneous-slow` | Two accepts in capture order, third draft retained, replay adds zero calls; three attempts, 30 input/60 output tokens. | Local orchestration; no topology comparison. |
| `failed-interpreter` | Non-retryable context failure restores its author's draft; next participant accepts/builds; three attempts, 20/40 tokens, one unknown-usage call. | Controlled HTTP failure, not timeout/provider quality. |
| `later-steering` | Two arrivals, one stale candidate, one final promotion; executor counter remains two before final release; four attempts, 40/80 tokens. | Fixed-revision rejection works; discarded work is measurable. |
| `continuous-arrivals` | Five finite arrivals, four stale candidates, zero promotions while arriving, one after stopping; executor counter remains five; ten attempts, 100/200 tokens. | Finite draining and supersession waste, not endless starvation or bounded sustained progress. |
| `ambiguous-reference` | “Make that blue” accepts without a resolved target when returned as an explicit request. | Controlled contextual ambiguity, separate from ordinary detail omissions. |
| `invented-passage` | A fabricated directive/passage absent from captured edits accepts; server-stamped author remains the caller. | Passage-validation gap, not impersonation of another contributor or live failure frequency. |
| `incorrect-product` | Working-filter requirement compiles/promotes without filter controls; functional `verified=false`. | Deliberately wrong candidate; browser also renders and observes absent controls. |
| `snapshot-body-gap` | Empty-store projection restore preserves an event reference but cannot read its body. | Primitive recovery, not cloud Storage integration. |
| `projection-growth` | All 0/10/50 added events remain embedded; export byte size grows. | Small envelope sample excludes receipts/body/network and production capacity. |
| `isolation-policy` | Three tools declare host-process execution and before-start-only cancellation. | Safe policy probe plus source inspection, not a hostile escape test. |
| `restart-budget` | Saved executor counter absent after restart; zero automatic inference. | Narrow in-memory executor budget, not disappearance of all durable accounting. |

Existing fixtures rerun with the full suite: [reliability](../../tests/reliability.test.ts) covers SQLite expired-owner takeover, RPC-mock stale-owner/reacquisition rejection, immutable saves, failed acceptance rollback, checkpoints/bounds and draft restart; [hosted reliability](../../tests/hosted-reliability.test.ts) covers current membership/revocation with a mocked platform; [reconnect](../../tests/provider-reconnect.test.ts) covers socket generations/cursors; [local drafts](../../tests/local-drafts.test.ts) covers contributor scoping, corruption/quota failures and two-tab updates; [ledger](../../tests/usage-ledger.test.ts) covers unknown usage, 520-call restore and replay/final-record preference. Local/mock checks do not establish hosted or SQL correctness.

## Later-step source audit

| Step | Source evidence and already satisfied behavior | Necessary or decision-dependent work |
| --- | --- | --- |
| 02 | [Coordinator](../../server/coordinator.ts), [local leases](../../server/event-store.ts), [dispatch/save/promotion](../../server/rooms.ts), [fenced hosted commit](../../server/supabase-platform.ts), [prepared migration](../../supabase/migrations/20261001104120_workflow_coordinator_fencing.sql). Local takeover and mock lost-owner rejection covered. | Routing to the owner is absent; real transactional contention unverified. Routing must fit the deployment; use the precise database matrix below. |
| 03 | `exportHarness/restoreHarness`, `RoomManager.save`, `SupabasePlatform.storeArtifact`. Existing Storage primitive reserves metadata, uploads, downloads/hash-checks and finalizes, but no runtime caller wires it to promotion. | Reuse primitive for body publication/rehydration; test interruption, missing/corrupt bodies and replay. All events remain embedded and receipts/history persist indefinitely. Retention/compaction requires a recovery/idempotency policy; small growth measurements do not prove capacity. |
| 04 | [Tool registry](../../server/tool-registry.ts), [project compile](../../server/project.ts), [preview](../../server/preview.ts). Role/path checks and preview CSP exist; tools directly call host functions and timeout metadata does not enforce a process lifetime. | Real process/container boundary, stripped secrets, network/resource/time limits and cancellation necessary. Step 07 depends on this boundary. |
| 05 | [Interpreter stamping](../../server/generator.ts), [normalization](../../server/requirements.ts), `submitChanges/reinterpretLatest/processNow`, [routes](../../server/index.ts), [drawer](../../src/App.tsx). Caller stamping, revision/source display and contributor-only withdrawal reconciliation exist. | Durable revision-safe correction/withdrawal commands/UI absent; hosted process route retired. Legacy reinterpret uses shared context outside capture order. Ambiguous/invented passages reproduce gaps. Command/revision/replay design is needed; a drawer or fresh submission is not completed structured correction. |
| 06 | `scheduleBuild/tryScheduledBuild/buildLoop`: max-wait still waits on active interpretation, candidates freeze revision/fingerprint, counters span supersession. Finite workload drains and stale promotion rejection works. | Four discarded candidates establish controlled waste. Sustained progress, cancellation/reuse and revision-labelled UX need a policy. Promoting stale authoritative candidates would conflict with the accepted fixed-revision rule. |
| 07 | `buildLoop` records criteria but promotes after compilation/revision/ownership checks with task evidence unverified. Failure retention and honest unverified data exist. | Compiling-wrong promotion reproduces missing functional gate. Requirement/revision/hash/check-version evidence and isolated functional/regression checks necessary after Step 04. No complete semantic-correctness claim. |
| 08 | [Physical attempts](../../server/providers.ts), [ledger](../../server/usage-ledger.ts), `recordPhysicalRequest/save/buildLoop`. Unique calls, unknown usage, hosted pre-dispatch recording and 24-call supersession bound exist. | Whole-workflow reservations/reconciliation/restart budget necessary; executor allowance absent from saved payload. Budget/reset/setup scope and any visible dollar control require decisions. Eight/24 not proven optimal. |
| 09 | `submitChanges` serial steering queue preserves capture order and catches rejected predecessors; failed first job does not block the second forever. | Delayed fixture shows queue waiting, not a material production bottleneck or superior topology. Retain serial topology absent stronger post-improvement measurements. Parallel interpretation and any live comparison remain conditional. |
| 10 | Fresh three-profile local browser check and local/mock suite establish current convergence/recovery. | Integration of later fixes, real hosted accounts, contention, isolation adversity and private Storage recovery remain external/later dependencies. Implementation and hosted readiness are separate. |

Precise Step 02 external dependency: an authorized disposable Postgres/Supabase target with prepared RPCs applied, server-only service credentials and two independent server instances sharing that target. Test simultaneous claims, renewals, expiry/takeover, old-epoch renewal/commit rejection, equal-revision conflicting snapshots, atomic Yjs/hash/snapshot commit and anon/authenticated RPC denial. Verify losing-owner bytes/revisions unchanged, forwarded identity/current membership/command replay and unavailable-owner bounded retry. The migration remains **prepared/unapplied**; existing mocks cannot close these checks.

For Steps 03/10, authorized private Storage and independent hosted owner/editor/viewer accounts must test empty-cache missing/corrupt body recovery, interruption between upload and commit, replay/hash equality, old-version/checkpoint access and unauthorized read denial. For Step 04, first configure the intended local process/container mechanism; then run adversarial secret/filesystem/network/time/memory/cancellation scenarios and unavailable-isolation fail-closed checks. These are precise later dependencies, not checks Step 01 passed.

## Verification and file handoff

Evidence is under [artifacts/multiuser-step01](../../artifacts/multiuser-step01); exact final results are in the checklist. The [browser report](../../artifacts/multiuser-step01/browser/browser-checks.json) covers three distinct Chrome profiles/local signed sessions, simultaneous submissions, retained third draft, offline/reconnect/reload without inference, convergence at specification r3/product v2, historic revision selection, drawers/navigation and no horizontal overflow at 1440/1024/768/390 px. Three interpreters/two builders report 500 input/250 output tokens. Incorrect product renders with zero filter controls and `verified=false`; acceptance-to-observed preview was 2,250 ms including fixture overhead. Local HMAC sessions are not Supabase accounts. Desktop/mobile screenshots were inspected. Reference fidelity, full saved-state labels, keyboard/screen-reader/other browsers remain open; a reopened desktop displayed an unsynced label, so save-state UX is not closed.

Development failures corrected and rerun: diagnostic growth assertion used camel-case instead of raw snake-case export names; first build found TS7022 on the fixture loop variable, fixed with a numeric annotation; first browser attempt used the default hosted-auth bundle and timed out, fixed by explicitly building local auth. Runtime behavior and assertions were not weakened.

Final `pnpm test`: 140/140 pass, zero failures (38,128.4 ms); `pnpm build`: TypeScript and default production bundle pass. SQLite experimental and Vite chunk-size warnings remain. AST-only Graphify update passed (1,902 nodes, 3,549 edges); optional SQL parser is unavailable, so SQL claims rely on direct source reading and remain unverified in a real database. The [verification summary](../../artifacts/multiuser-step01/verification.json) checks report bounds, all eleven source hashes, local links and unchanged runtime source; `git diff --check` passed.

New files: fixture, observation test, repeated runner and this handoff. Existing browser verifier now isolates output/room IDs, removes authored-content logging and adds reload/rendered incorrect-behavior evidence. Context, architecture, checklist and dated reliability entry point link the evidence; product, decisions and API contracts need no new decision/behavior changes. Graph refresh is derived output; no dependency versions changed.

When requested, execute **Step 02 only**, reading this handoff and the common contract. Start with lease/RPC/immutable-save fixtures and the prepared additive migration; establish deployment routing and real database prerequisites. Reuse these fixtures in later tasks; replace gap assertions as fixes land and compare identical workloads before scheduling/topology changes. Preserve one coordinator, caller authority, fixed revisions, no fallback and inference-free reconnect. Step 01 did not start subsequent implementation.
