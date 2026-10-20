# Isolated coherent restoration — 2026-10-19

Follow-up 2026-10-20: [the repair ledger and final validation](historical-repair-20261020.md) record the focused native corrections, provider-capacity policy, final 243-pass/zero-fail/eight-skip Windows suite, successful multi-participant/browser recovery and non-destructive staging compatibility plan. Preserve the red observations below as historical evidence. Current normal local app is on port 5190; fixture demonstration is on 5188. No production deployment is established.

## Target and preservation

Selected complete tree: `4ccc1fbb186ca11f92a847bff550915649555013`, authored October 15, 2026 at 17:07:32 +05:45 (Asia/Katmandu). Branch: `codex/restore-coherent-4ccc1fb`. This is a historical source candidate, not an assertion that rollback fixes the observed failures.

First-parent ancestry is `6c44029` (October 9) → `ab28741` (Workflow presentation, October 15) → `4ccc1fb` (approved editorial landing) → `64cce27` (logo) → `3f50357` (public entry copy) → `6fd5c86` (sidebar-free Canvas) → `9187865` (founder contacts) → `1b004ac` (submission repair, October 16). No mainline commits exist October 10–14. `git diff 6c44029 4ccc1fb -- server shared` is empty. The approved landing therefore postdates the approximate requested dates while retaining the earlier core. Choosing its whole tree avoids an invented combination of versions. Later presentation changes are excluded; none is required to retain the approved editorial page.

The previous `codex/restore-oct14-build` work explicitly mixed historical behavior with later capture, provider and persistence protections. That remains a recoverable reference, but is not this restoration baseline. Cached `origin/main` is `33d54e8f5eff1e7442c74eece2f3914bb09fb8b8`; local `main` is older (`96c7cb6`). Neither was modified. No fetch, pull, push, migration or deployment is authorized/performed here.

The original checkout remains on `codex/prelaunch-beta` at `915bebdabe71e495b1fbb14436f783e500a84a50`. An ignored preservation inventory in the original checkout's `.runtime/historical-coherent-restore/` records all eight original worktrees, branches, HEADs, dirty paths and environment-file metadata without secret values. Existing dirty files, ignored environments, local databases, generated projects and artifacts remain in place. Work uses a newly created managed checkout and new `.runtime/restoration-local/data` only.

## Bounded change packet

- Outcome: evaluate the complete historical Canvas → caller-only submission → shared builder → Artifacts workflow with its approved public landing.
- Scope: select the historical application as a whole. The only runtime exception is the separately recorded one-line SPA-path correction in `server/index.ts`, covered by `tests/historical-spa-path.test.ts`. Restoration steering, isolated local configuration, diagnostic-only changes to `scripts/verify-reliability.ts` and graph maintenance accompany it. No later core fix or architecture was cherry-picked.
- Evidence: local Git objects/first-parent ancestry and file diffs; historical AGENTS/steering/API; Graphify `submitChanges flush buildLoop promote`, verified against source. Later architecture and fixes are excluded.
- Contracts: existing `shared/types.ts`; HMAC authenticated local participants; durable author-specific capture/receipts, capture-order interpretation, accepted intent/conflict agreement, serialized integration, real OS compiler, candidate verification and fenced promotion. Local participants are not verified Supabase accounts.
- Verification: historical frozen lockfile/pnpm, production type/build, boundaries, full existing suite, controlled multi-profile browser, real isolated compilation, and (only with configured temporary OpenRouter credentials and the user's $2 ceiling) two real-provider submissions. Fixture and live evidence must remain separate.

## Source trace

1. TipTap/Yjs edits pass through `src/provider.ts` to the authenticated WebSocket in `server/index.ts`; `RoomManager.queueEdit` records participant-specific pending edits. Ordinary typing does not run interpretation.
2. The existing persistence path records document bytes and pending attribution. `saved` messages cover insertion clocks and deletion signature. The button/Alt+X in `src/App.tsx` waits for `CoCreateProvider.flush()` before POST `/api/rooms/:id/submit`.
3. `RoomManager.submitChanges` freezes only the authenticated participant's pending batch and accepted context, persists the submission, and passes it to the serial `queueCapturedSubmission` path. Receipts replay without consuming another author's drafts.
4. Personal interpretation proposes attributable registry changes; reconciliation and consequential-conflict agreement determine accepted requirements. One builder owns the fixed accepted revision.
5. `buildLoop` preflights real isolation, executes validated generated operations, invokes the isolated compiler and the historical verification plan, then durably promotes the artifact under revision/ownership checks. Failure retains the prior product. Compilation alone does not verify arbitrary requested behavior.

## Verification and repair log

Logs are in `.runtime/restoration-evidence/`; earlier dated repository evidence is not a fresh result. No provider key is copied from existing project data, serialized into reports, or committed. The user authorized OpenRouter with an economical DeepSeek model and a total $2 ceiling; availability and enforceable allowance must be checked before paid dispatch.

- `corepack pnpm install --frozen-lockfile`: passed; 404 packages reused, historical lockfile unchanged, pnpm 10.18.3 / Node 22.23.2. No newer application Git objects fetched.
- `VITE_COCREATE_AUTH_MODE=local corepack pnpm build`: passed before corrections; strict types plus 1,753 transformed modules. Existing bundle-size warning retained.
- `corepack pnpm check:boundaries`: passed, 155 files, zero boundary violations, no Jev calls.
- Initial complete-suite attempt: **248 tests: 212 passed, 28 failed, eight Linux-only skips**, 576.9 seconds, exit 1. The run began from the baseline and overlapped only the separate SPA correction (which does not change native/promotion behavior). New SPA regression was run separately. Historical promotion waits and native-browser cleanup/resource failures reproduced. This candidate is not a green rollback.

### Separate correction 1: SPA entry under hidden checkout parents

Failure: `/` loaded but `/app`, `/login` and `/r/test` returned HTTP 404. `dist/index.html` existed. The stack identified `res.sendFile` at `server/index.ts:808`. Installed `send` source checks every absolute-path segment for dotfiles; the managed checkout has a `.codex` parent. Current Express documentation confirms the supported `root` option.

Change: send fixed filename `index.html` relative to existing `dist` as `root`. No request-selected path is passed to `sendFile`; default dotfile protection remains. This is a local-path correction, not a copied later workflow repair: one server line plus `tests/historical-spa-path.test.ts`.

Afterward: focused regression 1/1 passes for app/login/room routes under a hidden checkout, private-dotfile non-disclosure and unknown API 404. Actual browser opens Canvas, accepts a counter requirement and visibly reports **Synced**. Opening AI setup makes no inference. Paid execution remains pending temporary OpenRouter key connection. The available OpenAI environment key was not used after the user selected OpenRouter.

Current OpenRouter catalog returned `deepseek/deepseek-v4.1-flash`, `response_format` support and input/output rates $0.0328/$0.08 per million tokens. These are October 19 catalog observations, not an invoice or quality guarantee; no application pricing table changed. The historical temporary-key UI has no dollar-limit control, so testing needs a key with at most $2 remaining or an independently enforced allowance before paid dispatch. Sources: [models](https://openrouter.ai/api/v1/models), [key limits](https://openrouter.ai/docs/api/api-reference/api-keys/create-a-new-api-key), [Express sendFile](https://expressjs.com/en/5x/api.html#res.sendFile).

### Native/browser investigation

`pnpm exec tsx .runtime/compiler-probe.ts`: a real isolated React counter compiled in 5,323 ms, producing 608,192 JavaScript bytes and 159 CSS bytes. No provider call was involved. This proves compilation of that input, not product workflow acceptance.

The unchanged three-profile `scripts/verify-reliability.ts` timed out at the first shared artifact. A separate diagnostic-only harness change records safe failure/settled state and a screenshot, without altering assertions, limits or application behavior. At timeout the two personal fixture calls succeeded, one fixture builder call ran, and the build remained active. Awaiting that existing bounded task showed `compilationPassed:true`, then `EBUSY` deleting a generated isolated verification-browser profile; no version was promoted. The suite's first native-profile cleanup failure also left a directory that invalidated subsequent empty-jobs assertions. Some additional failures are actual native resource outcomes or fixture deadlines; do not attribute every red test to the leftover directory.

One failed synthetic job was moved into evidence quarantine using a verified absolute path. A separate recursive-delete probe was rejected by automatic approval review (no detailed reason supplied); no alternate deletion was attempted. Failed directories/evidence remain recoverable. No sandbox limit, timeout, retry policy, functional gate or host-execution fallback changed. The broader native cleanup/resource problem remains a release blocker.

### Live-provider checks and operator configuration

The supplied OpenRouter key was passed on masked standard input to the existing local temporary-connection API, held only by the server lease, and never written to a script, environment file, log or Git. A raw-key-pattern scan of restoration data/evidence found zero matches. The unrelated OpenAI environment key was not used.

The isolated operator launcher configures the **existing** `AISetupPolicy.maximumSpendUsd=1` durably before each paid capture. It allows only the three designated test captures: one diagnosed failure, its explicit resubmission in the same retained workflow budget, then the editor's incremental change in the next workflow budget. Thus at most two $1 workflow allowances cover the user's $2 ceiling; physical attempts/repairs stay within each historical durable scope. This is local test configuration, not a production API or a restored architecture change.

Both participants typed/saved with zero inference. An initial same-origin-tab attempt correctly failed spending authorization because localStorage shared the second identity; no provider request ran. The actual ownership scenario uses distinct `localhost`/`127.0.0.1` browser storage origins and distinct signed local participant IDs, not hosted Supabase accounts.

The first real `deepseek/deepseek-v4.1-flash` interpretation and its bounded structured-output repair each exhausted 2,400 output tokens (2,372/2,400 reported reasoning tokens). No accepted requirement or artifact resulted. The held/reconciled workflow amount was $0.0032576; this is accounting evidence, not a provider invoice. No allowance was increased. The model was explicitly changed, with user-visible notice, to current compatible non-reasoning `deepseek/deepseek-chat-v3-0324` (catalog $0.29/$1.14 per million input/output tokens). Its resubmission interpreted in 213 output tokens with zero reported reasoning and accepted only the owner's counter requirement; the editor's Reset draft remained pending.

### Real-provider browser outcome

The owner used **Build my changes** to publish **v1/r1**. Its visible Artifacts counter incremented from 0 to 1. The editor's Reset draft remained unsubmitted and absent from accepted requirements/product. The owner then wrote an unsubmitted purple-page request. Provider-call count stayed four while both drafts were saved. The editor used focused **Alt+X** to submit Reset; **v2/r2** appeared with a working Reset button, and the original increment behavior still worked. The owner's purple request remained pending and was absent from the two accepted requirements. These are two real signed local participants in separate storage origins, not hosted-account acceptance.

The complete live attempt used seven physical HTTP calls: two failed reasoning-model responses, successful non-reasoning interpretation/build, then failed interpretation plus successful bounded structured repair/build for Reset. Sum of provider-reported response costs: **$0.00876682** (not invoice reconciliation). Both durable workflow scopes stayed within their separate $1 ceilings; unknown-cost flags remain in source accounting. No fake output, raised token allowance or silent provider/model fallback was used in this live project. Reload retained the Canvas drafts and v2 without another inference call.

Screenshots: `.runtime/restoration-evidence/live-artifact-v1.png` and `live-artifact-v2.png`; safe state/call/provenance summaries: `live-before-submit.json`, `live-before-second.json`, `live-final.json`. The generated title is `TeamCounter` rather than the requested `Team Counter`; the observed counter/reset behavior passes, not a claim of exact arbitrary semantic satisfaction. The UI correctly still labels its automated acceptance coverage limited/unverified; manual checks do not rewrite durable verification evidence.

Fresh final build passed; focused SPA/auth/reconnect checks passed **12/12**; boundaries passed over 156 files with zero violations. `graphify update .` succeeded using AST only (2,242 nodes/5,304 edges); 14 SQL files lack optional parser coverage. No API/model inference ran for graph maintenance.

Eight pre-existing checkout HEADs and dirty inventories are unchanged. The preservation inventory also captured the newly created restoration checkout before its intentional branch/commits; that entry is expected to change. No raw OpenRouter key was found in restoration evidence or local project files.

### Available local application

The real application remains at `http://localhost:5185/`; the live test project is `/r/CsL3s_hlvsthjy2lg2JiThI8`. Owner storage is on `localhost`; the second participant uses the same path on `127.0.0.1`. Preview, Canvas and both generated versions remain in isolated local data. The launcher deliberately blocks additional paid captures in this test project once the three designated captures have been consumed. Interacting with the generated counter and writing/reloading do not spend. Other new local projects start without an AI key; the existing temporary connection expires after two hours or server restart.

The `.runtime/restoration-local.ts` launcher and all test configurations/evidence are local ignored files; they are not deployment settings. It binds only loopback, uses newly generated development session secrets, and never connects production databases. `NODE_ENV=production` serves a built client; `COCREATE_AUTH_MODE=local` explicitly avoids hosted identity/database configuration.

### Controlled failed-build browser outcome

A separate, explicitly labeled loopback fixture produced a working counter through the historical application and real OS compiler. A subsequent `FAIL_BUILD` submission returned invalid JSX for all three existing bounded builder attempts. The app reported the compilation error and **Working artifact v1 retained**. Artifacts still displayed v1 and its counter remained interactive (0 → 1) with the failure visible. Screenshot: `.runtime/restoration-evidence/controlled-failed-build-retained.png`; safe state: `retention/state.json`. Two personal and four builder fixture HTTP calls ran; paid-provider calls: zero. The fixture process was stopped afterward, preserving its isolated data.

Initial fixture setup exposed an inherited `OPENAI_BASE_URL` overriding a saved custom loopback URL. Its zero-call connection failure was a test configuration problem, not evidence that document saving or OpenRouter was broken. The corrected fixture explicitly set its server-owned test base URL. A second full suite is therefore run with process-local `OPENAI_BASE_URL`, `PROVIDER_BASE_URL_OVERRIDE` and `OPENAI_API_KEY` cleared, local auth selected, the existing verification browser explicitly configured, and prior failed jobs moved into quarantine. This changes neither the running real-provider app's environment nor any existing environment file. Retain both whole-suite runs; clearing configuration does not retrospectively turn the first red result green.

### Final regression outcome and review artifacts

The second whole suite completed: **249 tests, 232 passed, nine failed, eight Linux-only skips**, exit 1, 486.3 seconds. The extra test is the new SPA-path regression. Failures remain in interrupted promotion/lease/version fixtures (23/24/27), submitted-build state (34), fixed-candidate/sustained progress (47/53), native behavior regression verification (60), required-behavior retry/version publication (208, expected v2 but observed v1), and unavailable-isolation setup (224). Several failures are deadline observations without a proven underlying production cause; native resource rejection is established in test 60. Both full logs and the intermittent cleanup failure remain retained. No assertions, deadlines, retries or isolation limits were relaxed. The candidate is **not approved for production**.

Final focused results remain 12/12, production build/types pass, zero import-boundary violations, documentation links resolve, and `git diff --check` passes. Final running-app check reports Updated, artifact v2/r2 and the same seven provider calls/$0.00876682. The successful live/controlled browser scenarios do not replace the failed whole-suite gate or establish hosted account, SQL, Linux or production data acceptance.

Prepared local review artifacts under `.runtime/restoration-evidence/`:

- `restore-vs-cached-main.patch`: application/configuration/tests/steering comparison against exact cached main `33d54e8f5eff1e7442c74eece2f3914bb09fb8b8`. Generated `artifacts/` and `graphify-out/` are excluded from this patch so current evidence archives remain; the branch retains its refreshed graph separately. The patch was checked with `git apply --cached --check` against a separate temporary index initialized from that exact commit, without changing any existing checkout/index.
- `separate-corrections.patch`: comparison from `4ccc1fb` showing the isolated runtime correction, its regression test, diagnostic harness and steering; graph output excluded for readable review.
- Local branch `codex/restore-coherent-4ccc1fb` preserves the whole selected historical tree plus the explicitly identified corrections/evidence. No push, PR, fetch/pull or deployment ran. A normal merge of an old-baseline branch is not an automatic main rollback; review the prepared comparison before any integration.

Next release work: diagnose and close the nine red regressions and intermittent native cleanup/resource failure without increasing quotas blindly; review current-data/browser contract compatibility and source identity; then run intended staging/Linux/hosted-account gates before separately authorized production release. Do not apply this patch directly over existing user data.

## Release compatibility

This checkout starts with empty local data. Do not run it against current production snapshots or existing user databases. Newer capture journals, cursor/provenance fields, permanent payload hashes, canonical naming bridges, schema changes and open browser contracts require a separately reviewed compatibility/export or forward restoration plan. The restoration patch is for review only; applying it directly to production would not establish data compatibility. No historical SQL rollback or destructive cleanup is part of this task.
