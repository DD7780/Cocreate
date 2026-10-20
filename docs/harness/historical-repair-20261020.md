# Historical restoration repair — 2026-10-20

## Bounded change packet

Worktree: `C:/Users/QUTA4/.codex/worktrees/historical-coherent-restore/Devoffice`; branch `codex/restore-coherent-4ccc1fb`; starting commit `38475011222f1c540614b5e808ddf123a59ecf32`, initially clean. Preserve the complete `4ccc1fb` architecture and approved landing, the separate SPA correction, and all previous evidence. Original checkout and production data are outside this change.

Outcome: repair established causes of nine red regressions and native teardown interference, document provider-governed OpenRouter capacity separately, verify caller-only submission and retained artifacts with fixtures and the real isolated compiler, and prepare a non-destructive compatibility handoff. Durable commands, accepted requirements, ownership fences, serialized promotion and real verification remain authoritative.

Read: [restoration report](historical-coherent-restoration.md), referenced full-suite/browser logs, contributor steering and source. Graphify scoped promotion/lease/progress/isolation before inspection. New ignored evidence belongs in `.runtime/repair-20261020/`; old `.runtime/restoration-evidence/` remains intact. The prior loopback service at port 5185 is historical evidence, not the repaired build. No new paid call is authorized. No fetch/pull, push/deploy, production access, destructive migration or raised execution bounds.

Validation: reproduce focused failures before corrections; preserve native diagnostics and causal classifications per test. Then focused regressions, complete suite, strict production build, boundaries, AST graph update and two isolated browser participants. Linux, hosted identity/database and staging require their actual environments. Fixture HTTP is not live-provider evidence.

## Failure ledger

| Test / source | Observed failure | Reproduction | Root cause | Proposed correction | Verification |
| --- | --- | --- | --- | --- | --- |
| Interrupted canonical promotion — artifact-restoration:241 | Publication gate missed at 8 s | Passes unchanged reproduction; adjacent synchronous gate fails | Intermittent pre-publication timing; no canonical-save defect reproduced | Reduce measured compiler work; retain hidden-promotion assertions | Focused and both full runs pass |
| Lease loss after private upload — artifact-restoration:279 | Publication gate missed at 8 s | Passes unchanged reproduction | Gate timing observation, not evidence that stale owner promoted | Native work correction only; retain ownership fence and call-count assertions | Focused and both full runs pass |
| Archived version identity — artifact-restoration:348 | Publication gate missed at 8 s; old diagnostic still Building | Passes unchanged reproduction | Pre-gate execution latency; archived-ID defect not established | Native work correction; preserve immutable IDs and history | Focused and both full runs pass |
| Submitted state/idempotency/usage — auto-build-budget:28 | State wait expired | Passes unchanged reproduction | Initial-build deadline observation; no idempotency/usage defect reproduced | Reduce execution overhead without extending 5 s wait | Focused and both full runs pass |
| Fixed candidate progress — build-progress:6 | First promotion wait expired; old diagnostics explicitly show resource rejection | Passes unchanged reproduction | Native compiler rejection before promotion, not queue starvation in this evidence | Bound compiler background work; keep fixed-candidate/capture-order checks | Focused and both full runs pass |
| Sustained progress — build-progress:100 | Final drain wait expired | Passes unchanged reproduction in 17.45 s | Historical intermittent drain observation; exact old final state unavailable | Native correction lowers repeated execution work; do not invent a queue fix | Focused 9.72 s and both full runs pass |
| Required controls/retained regression — candidate-verification:41 | Native resource rejection | Three broken candidates pass baseline; adjacent valid compile gets same rejection | Native resource instability; measured compiler CPU pressure established, individual old kill counter unavailable | Disable static/dynamic tiering, bound tasks to four; preserve real behavior checks | All candidate checks and compiler adversity pass; both full runs pass |
| Required behavior explicit retry — reliability:20 | Expected v2, observed v1 | Passes unchanged reproduction | Intermittent execution/publication outcome; no durable retry defect reproduced | Native correction; retain prior artifact and explicit-retry assertions | Focused/both full runs pass; browser v2 failure → explicit retry v3 passes |
| Unavailable isolation — reliability:231 | Initial artifact setup wait expired | Passes unchanged reproduction | Test never reached unavailable-mode assertion; setup latency observation | Faster real compile; unchanged fail-closed preflight and zero-builder-spend assertions | Focused and both full runs pass |

Previous full suite: 249 total, 232 passed, nine failed, eight Linux-only skips. Those results remain red until fresh evidence establishes corrections. Intermittent browser-profile `EBUSY` and resource failures must not be conflated with every timeout.

## Separate corrections and causal evidence

### Native compiler work

Unchanged focused reproduction: **41/43 pass**; the synchronous publication fixture misses its 8-second gate and the first native candidate compile is rejected by the kernel. The originally reported nine cases pass individually in this reproduction, demonstrating intermittency rather than a reproducible defect in each lease/promotion algorithm. Old fixed-progress diagnostics explicitly record a compiler resource rejection before promotion; old archived-version diagnostics still show Building at the gate deadline.

Six identical isolated compilations before correction take 2.72–3.04 seconds wall time and approximately 9.5–11.1 seconds aggregate user+kernel CPU, close to the unchanged 10-second job limit. Memory peaks are below 512 MiB. Disabling only static tiering does not remove this CPU pressure. A single compilation task lowers CPU but takes about 5.6 seconds, so it is unsuitable for existing workflow deadlines. Reassessment against installed `node --v8-options` and V8 flag definitions identified **dynamic tiering as a separate switch**. Final startup flags disable both tiering modes and bound parallel compilation tasks to four. Six resulting compiles pass with identical 609,086-byte bundles, steady wall time 1.45–1.85 seconds and roughly 1.2–1.5 seconds CPU. No sandbox quota, timeout or retry changed. Sources: [V8 pipeline](https://v8.dev/docs/wasm-compilation-pipeline), [V8 flag definitions](https://chromium.googlesource.com/v8/v8/+/ba401aa9c13aefad97074d0ad229588e07119ed6/src/flags/flag-definitions.h); installed Node 22.23.2 flag output is authoritative for availability.

Files: `server/isolation.ts`, `server/isolation/windows-runner.cs`. Later local commit `8278cb2` was inspected as evidence, not cherry-picked; its single-task setting was measured and rejected here. Windows AppContainer, Job Object, secret stripping, process/memory/CPU/wall/output bounds and Linux namespace/cgroup boundaries remain. Linux flags are source-verified only until actual Linux execution.

### Browser completion and fixture correctness

`withIsolatedBrowser` previously treated a renderer death notification caused by terminating the **completed** job as an execution crash. Guard crash classification with `!finishing`; genuine execution crashes and authoritative resource exits remain failures. The existing native verification/cancellation/adversity checks pass after this narrow change. Local `56daee1` confirms the same guard; its filesystem deletion fallback is deliberately excluded. Old profile `EBUSY` evidence remains preserved; no fresh occurrence in the focused run. This does not prove the external filesystem race can never recur.

The three-profile browser fixture requests the recognized `Add favorites` behavior but supplies only plain text. Give that controlled sample a real accessible favorite toggle and two catalog entries. Preserve its deliberate omission of unsupported filter prose and its assertions distinguishing compilation from functional coverage. Its obsolete `.context-drawer` selector is corrected to the actual `dialog.intent-review[open]`, waiting for that dialog using the existing bounded helper before checking its content. No production verifier assertion is relaxed. Background Chrome launch uses `windowsHide`; teardown requests `Browser.close` and awaits process closure even after an assertion fails.

The first broader three-profile rerun **reproduced `EBUSY`** before builder dispatch, despite the green full suite. Preserve it in `three-profile-browser/failure.json`, `settled-after-failure.json` and `quarantine/29b617ff-04c9-4e35-b28a-3daa69aca9dc`. No native launcher/browser process remained on subsequent inspection; the preserved profile could be moved, and an independently copied profile could be removed. This rules out a persistent corrupt path or general permission failure; it does not identify the exact Windows lock owner.

The cleanup path synchronously invoked Node's native recursive removal immediately after child closure, blocking the event loop while retrying. Use awaited `fs.promises.rm` for browser/compiler workspaces, retaining **exactly** the existing path guards, retry counts/delays and propagation of cleanup errors. This permits native close callbacks to drain and uses Node's asynchronous removal implementation; the precise libuv/Windows handle responsible remains an inference, not a measured fact. The next three-profile run cleared native cleanup and both artifact builds, then reached the stale-selector fixture defect above. Official reference: [Node filesystem APIs](https://nodejs.org/docs/latest-v22.x/api/fs.html#fspromisesrmpath-options). No PowerShell deletion fallback, quarantine-on-success, ignored failure, added retry or extended execution limit is introduced.

### OpenRouter capacity (independent product correction)

The user's 2026-10-20 direction supersedes historical role-based input/output limits **for OpenRouter workflow generation**. Interpretation, structured repair, builder, operation/compiler repair and recovery planner/file tasks omit output-token fields. OpenRouter adapters no longer insert a default when none is requested. Full prepared input bypasses the application's approximate token gate and 140 KB context rejection; complete eligible project files are supplied rather than dropped by the old 36/24 KB context selection. Generated-source/file-count/byte/capability bounds remain product/execution safeguards, not provider token limits. Explicit small setup probes retain their separately selected output bound. Other provider adapters retain their historical policy.

OpenRouter controls effective capacity, including context remaining after input, model/provider defaults, reasoning output and account restrictions. Capacity is **not unlimited**. Current official docs describe optional `max_tokens`/`max_completion_tokens` and shared reasoning/output allowance: [parameters](https://openrouter.ai/docs/api_reference/parameters), [model metadata](https://openrouter.ai/docs/guides/overview/models).

The temporary model selection records full catalog context for conservative output reservations (rather than trusting one route's top-provider completion ceiling). Accounting estimates remain distinct from enforcement. Each uncapped workflow dispatch with configured USD limits requires priced temporary-lease metadata and reserves that context-sized output before HTTP; legacy named OpenRouter connections with no reliable capacity cannot pass a configured spending limit using an invented small reservation. Byte-based input estimates, physical attempt IDs, response usage/cost reconciliation, unknown outcomes, 24-call scope, eight-task recovery, checkpoint waits and truthful truncation/context errors remain. A full-context reservation can reject a small dollar budget before the provider runs; this is intentional, not permission to increase spending. Provider prices/limits may still change externally; estimates are not invoices.

Mocked assertions cover omission through interpretation/repair/builder/recovery, full context over old selection limits, context rejection without repair, exact physical records, explicit setup probes and pre-dispatch spend refusal. No new paid inference has run. Prior credentials/authorization are not reused.

## Non-destructive release compatibility plan

Comparison uses only local objects: restored `4ccc1fb` and cached main `33d54e8f5eff1e7442c74eece2f3914bb09fb8b8`. This is not a statement about today's remote deployment.

| Boundary | Historical restoration | Locally cached newer contract | Required before staging existing data |
| --- | --- | --- | --- |
| Persistence | SQLite schema versions 1/2, snapshots/events and private immutable bodies | Schema 3 capture command/source tables; `replayCaptureJournal` after snapshot cursor; document sequences | Export a consistent disposable copy of snapshot, ordered update history, full command journal, projection/events and all referenced bodies. Hash inventory and preserve originals. Never let the older writer replace a newer checkpoint without journal replay. |
| Capture receipts | Actor/request ID snapshot receipts; attributed captured edits | Immutable payload hash, capture cursor, source ID/hash, interrupted/no-build/product outcome | Preserve exact command IDs, payload hashes and outcome records; do not regenerate receipts from prose or infer missing provenance. Unknown acknowledged commands must block replay until reconciled. |
| Provenance | Participant edit sequences and captured passages | Authored spans/deleted spans, passage references, source hashes and ownership map | Keep richer records in a lossless sidecar or retained canonical service. Read-only inventory first; no dropping or fabricating attribution. |
| Hosted schema | Historical snapshot/coordinator/artifact RPCs | Additive `20261018044323_workflow_capture_commands.sql` and `20261018044503_workflow_capture_privileges.sql`; fenced capture commit/read RPCs | Check exact applied history/functions/privileges in a staging clone. Do not roll migrations back. Choose a reviewed forward-compatible bridge or fresh-project-only release; this branch supplies neither migration automatically. |
| Authentication/configuration | Local HMAC compatibility; hosted UUID membership/beta tickets; historical names | Startup validates separate hosted signing/encryption secrets; canonical `TWOGUYS1CANVAS_*` aliases, release identity | Inventory names without values. Prove keys remain server-only, require real hosted accounts/role/revocation tests, and verify the deployment image/Worker fingerprint. Local HMAC is insufficient. |
| Browser protocol | `/submit`, binary Yjs, vector/deletion save acknowledgement, historical localStorage key | New capture types/source IDs/receipts; command lookup and explicit 410 reload bridge; renamed recovery/storage compatibility | Test retained old/new browser tabs and disconnected writes against the selected bridge. Preserve local drafts; never auto-resubmit paid work. Clear reload instruction only after original command lookup and attribution reconciliation. |
| Artifacts/recovery | SHA-256 private product bodies, historical checkpoints | Additional compile-retry checkpoint metadata and preview environment/protocol contracts | Verify every reference/body identity, archive/version ID and required evidence; preserve unavailable/corrupt states and retained product. Do not treat unknown fields as permission to rebuild. |

Sequence: immutable export and verified restore into a new staging database/bucket; read-only format/provenance report; explicitly reviewed compatibility decision; fixture tests for mixed-version browser/receipts and unknown outcomes; actual PostgreSQL contention and Linux compiler/browser adversity; independent hosted participants and revocation; separately budgeted provider acceptance; stage-only promotion/rollback drill. No production data or service was accessed or migrated by this repair.

## Fresh verification

- Focused workflow/native: **43/43**, including all nine original cases and shutdown/required-behavior checks (`focused-native.log`).
- Compiler isolation/adversity: **10/10** (`compiler-adversity.log`), covering real OS restrictions and CPU/memory/output/cancellation enforcement.
- Provider policy/accounting: **19/19** (`provider-budget-final.log`), mocked HTTP only.
- Final production types/build: passed (`build-final.log`), 1,753 modules and existing large-chunk warning retained.
- Final boundaries: 157 files, zero violations (`boundaries-final.log`).
- Final full suite after awaited cleanup: **251 total, 243 passed, zero failed, eight Linux-only skips**, exit 0, 290.14 seconds (`full-tests-final.log`). Earlier green pre-cleanup run: 291.98 seconds; its subsequent red broader browser probe is preserved rather than erased. All nine original cases pass in both full runs.
- Three independent Chrome profiles with real compilation/native verification, offline/reload drafts, converged views, four responsive widths and empty-cache private artifact/checkpoint/ZIP/preview restoration: passed (`three-profile-final/browser-checks.json`). Three interpretations and two builder calls, no inference on reload/reconnect/cache replacement. The controlled fixture deliberately omits unsupported filter prose; automated acceptance remains honestly partial.
- Separate two-participant evidence assertions pass (`browser-evidence-check.log`), covering the browser steps below. No new paid-provider execution occurred.
- No remaining isolation jobs or native runner/headless-shell processes after final suite. The sync-cleanup failure is retained in quarantine; final async-cleanup runs pass without suppressing errors or extending retry policy. The exact prior Windows lock owner was not identified.
- Final AST-only graph update: 2,261 nodes / 5,344 edges (`graphify-final.log`). Fourteen SQL files lack the optional parser; no model labeling/API calls ran. Added-documentation local links resolve and `git diff --check` passes.

## Review identities

Starting repair commit: `38475011222f1c540614b5e808ddf123a59ecf32`, on `codex/restore-coherent-4ccc1fb`.

| Focused correction | Commit |
| --- | --- |
| Native CPU work, completed-job crash guard and awaited workspace cleanup | `37f7c98137052c762b227fc10c62b86814286465` |
| OpenRouter capacity and conservative spending policy, with mocked regressions | `120b4f2e9cd1a6098418d8d4f5e08ff10968421a` |
| Browser fixture functionality, intent selector and awaited browser teardown | `0186dc7978cf3e525c4c6e480d055e00817dcc22` |

The final documentation/graph commit is reported with the handoff. No commits were pushed.

## Two-participant browser evidence

Two real local HMAC participant identities use independent `localhost` and `127.0.0.1` storage origins. The loopback fixture and later fully intercepted OpenRouter fixture are explicitly synthetic; generated candidates compile in the real OS boundary. No previous key or paid allowance is used.

1. Both people type and save; `browser-before-submit.json` shows zero requests, zero accepted requirements and two distinct pending author batches. A controlled process restart first refuses takeover while the existing 30-second local coordinator lease remains live, then reconnect/reload restores both batches without inference. No lease duration was changed.
2. Owner submits the counter; v1 has Increment, with the editor's Reset draft excluded. Visible counter changes 0 → 1 (`artifact-v1.png`).
3. Owner writes an unsubmitted red-header draft. Editor submits Reset with editor-focused Alt+X; v2 has working Increment and Reset, while accepted requirements still exclude red (`browser-v2.json`, `artifact-v2.png`).
4. Reload retains v2, both accepted requirements and the owner draft at four total fixture calls (`browser-reload.json`).
5. Editor's caption is accepted, but three existing bounded builder attempts return invalid JSX. The UI reports **Working artifact v2 retained**; v2 remains interactive 0 → 1 (`browser-failed-build.json`, `failed-retained-v2.png`).
6. The legacy custom-connection UI shows Retry but correctly refuses the BYOK-only retry contract. Reconfigure only the ignored test harness to intercept OpenRouter key/models/generation HTTP, using a deliberately invalid synthetic credential. After reconnect/reload, zero generation calls run automatically. Explicit Retry builds v3 with the caption using **one builder call and no reinterpretation**; prior scope accounting and the owner's red draft remain (`browser-retried.json`, `retried-v3.png`).
7. Owner explicitly submits red; then editor explicitly submits blue. Both accepted source records remain, with a confirmed consequential header conflict requiring both named contributors. No selection is fabricated. Workflow shows **Contradictions 1**, both attributed alternatives and Waiting for choices (`browser-conflict.json`, `conflict.png`). Independent undisputed requirements remain eligible under the historical policy; the conflicted colors are excluded from the next builder input. Local conflict-choice controls do not establish hosted role acceptance; that remains a staging gate.
8. Final restart loads repaired source and preserves v5, thirteen durable synthetic physical calls and the unresolved conflict, with zero automatic new calls (`browser-final.json` and current local state). The 13 calls are five interpretations, five successful builders and three failed compilation attempts. They are not paid-provider evidence.

The normal repaired application is separate at `http://localhost:5190/`, bound only to loopback with fresh `.runtime/repair-20261020/app/data`, local auth and no provider credential configured. The retained interactive fixture is `http://localhost:5188/r/repair-20261020`; its fake OpenRouter transport must not be mistaken for live-model execution. Both launchers are ignored local operator configuration. The earlier port 5185 service and evidence remain untouched.

## Remaining staging gates and skip explanations

No Docker executable is available and `wsl --list --verbose` reports WSL is not installed. The eight existing `linux-cgroup-isolation.test.ts` cases intentionally skip on Windows:

| Skipped case | Why pending |
| --- | --- |
| Browser cold starts / JavaScript / descendant cleanup | Requires actual Linux browser, Bubblewrap and delegated cgroup lifecycle |
| Aggregate descendant CPU | Requires real Linux cgroup CPU accounting/enforcement |
| File-size ceiling | Requires Linux RLIMIT_FSIZE behavior in the generated job |
| File-descriptor ceiling | Requires Linux RLIMIT_NOFILE in the browser |
| Bootstrap authority drop / stopped-child attachment | Requires Linux privilege dropping and cgroup attachment before execution |
| PID ceiling / whole-group kill | Requires Linux cgroup PID limits and descendant reaping |
| Physical-memory exhaustion | Requires Linux memory cgroup kill and host survival evidence |
| Missing delegation failure | Requires an actual unavailable Linux cgroup delegation setup |

Windows results do not replace these checks. Hosted accounts, PostgreSQL contention/schema/role tests, production-format compatibility rehearsal and staging image/Worker identity remain pending in the non-destructive plan above. New paid-provider execution would require fresh explicit model/budget authorization; it is unnecessary for the completed fixture checks. Approved landing/reference redesign and broader arbitrary-prose verification are outside this repair.

Preservation recheck: all eight pre-existing worktree HEADs, original grouped dirty-status inventories and environment-file sizes/timestamps match the original inventory. No existing data/env/credentials were changed. Failed profiles and all old logs remain recoverable. No remote code fetch, push, deployment or migration occurred.
