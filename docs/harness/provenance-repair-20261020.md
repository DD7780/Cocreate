# Submitted evidence repair — 2026-10-20

## Bounded change packet

Outcome: local Canvas submissions containing `resturant` must permit clarified restaurant requirements while preserving immutable, participant-specific evidence. Existing blocked records recover only through explicit human correction; no automatic inference or data migration.

Evidence: Graphify query `interpretation authenticated source passage validation proposed unresolved correction submission` located `intent-authority`, `generator`, `requirements`, and `rooms`. The frozen affected submission `54f4f5ef-4f6c-4666-9f1a-cf9db1895807` contains character edits and deletions; both generated quotes repair spelling and fail exact matching. Its single interpreter call succeeded; no requirements were accepted or builder dispatched. Safe read-only projection is in ignored `.runtime/provenance-repair/original-safe-evidence.json`.

Scope: server capture/interpretation/normalization and existing submission orchestration; shared intent reference field; Canvas blocked notice using the existing IntentReview commands; deterministic provider fixtures and regression tests. Allowed implementation files: `server/submitted-sources.ts`, `server/room-state.ts`, `server/rooms.ts`, `server/generator.ts`, `server/intent-authority.ts`, `server/requirements.ts`, `shared/types.ts`, `src/InterpretationNotice.tsx`, `src/App.tsx`, `src/BuildProgress.tsx`, `src/IntentReview.tsx`, styles, and affected tests/fixtures. Canonical context/product/architecture/API/checklist/decisions, README operation instructions and graph coverage are updated with implementation evidence.

Required contracts: server-issued passage IDs bound to captured submission, actor and edit sequences; immutable original quotation resolved by server; missing/foreign/fabricated references fail closed; legacy historical records retain exact evidence and explicit correction authority. No relaxed ambiguity/conflict, spending, request receipts, worker isolation, limits or retry policy. New source metadata uses existing edit records and Yjs identities rather than a separate provenance journal. Sources are frozen before interpretation, never read from a later shared document.

Verification: first red typo regression; ownership/deletion/fragment/identical-text/stale-source/ambiguity/conflict tests; explicit correction and replay/accounting regressions; deterministic provider plus real compiler/browser artifact; complete suite, type/production build, boundaries, Graphify and diff check. Live provider and hosted/Linux acceptance remain outside this local, unpaid repair.


## Confirmed cause and implementation

The captured request retained `resturant`, while both model quotations used `restaurant`. Exact quotation matching rejected both intents. Character edits additionally included backspaces: joining every insertion resurrected deleted characters. Transport and provider execution succeeded; the absence of accepted requirements prevented builder dispatch.

New edit records retain only new Yjs string identities relative to the server's prior state vector. Submission capture joins still-visible authenticated caller characters in document order, using stored insertion text; foreign identities split passages, including identical-looking text. Deleted characters disappear. Passages are frozen and persisted before the interpreter starts. The current document is used only to order/filter identities at capture time, never to authenticate later interpreter output or replace submitted evidence.

The interpreter schema requires `sourceRefs`. Every supplied ID must resolve within the frozen submission, actor and captured edit sequences. The server discards the advisory model quotation and resolves the displayed quote from original captured text. Missing, fabricated, foreign and mixed references remain unresolved and cannot enter the builder's accepted scope. Legacy direct validators retain exact matching for historical compatibility; all new provider extraction calls receive an explicit reference scope. Existing historical records are not migrated.

Normalization preserves explicit model uncertainty for referenced passages before and after source verification rather than promoting a proposal/question/ambiguity merely because another sentence in the cited passage starts with a directive. Consequential pronoun and conflict checks remain active. Empty rejected evidence stays empty across normalization/reload; the review UI identifies missing verified evidence instead of inventing a quotation from requirement text.

The Canvas notice lists the caller's blocked items beside build progress and opens the existing correction dialog. Empty/reviewing scope no longer appears as an accepted build. The dialog remains open after the last correction so the explicit accepted-build action remains available. Historical unverified quotations are marked as needing review.

## Verification and repair loop

- Red regression captured before implementation: exact supplied typo plus a model quote that repairs `resturant` to `restaurant` failed with `needs_clarification`. The same regression passes with valid source IDs and preserves the original typo quote. A second red regression caught pre-validation normalization promoting uncertainty from a multi-intent passage; proposal, question and ambiguity now survive both normalization boundaries.
- Eight focused evidence tests cover character typing/backspaces, caller/teammate separation, identical writing, missing/fabricated/foreign/mixed IDs, retransmitted old identities, deletion-only updates, multiple requirements per passage, later document edits, proposals/questions/ambiguity and conflicts.
- The deterministic provider flow rejects fabricated IDs before any builder call. Explicit correction makes no interpreter request, preserves interpretation history and budget values, and replay cannot duplicate acceptance. The explicit build consumes one additional call in the same budget scope; replay adds no call or artifact. A later exact typo submission reaches the real isolated compiler and the trusted filter verification; submission replay remains idempotent.
- Browser fixture at `http://localhost:5191/r/provenance-fixture`: exact typo submission accepted two clarified requirements and produced a visible Momo artifact. Original source quotes retain `resturant`. Search narrows and restores the visible list. A separate fabricated-reference submission shows the requested review notice and affected item while retaining v1. Saving its correction makes zero provider calls; only Build accepted changes produces v2, with a passing trusted favorite-toggle check. Restaurant appearance/hero prose remain explicitly unverified by the narrow functional checker.
- Initial full run: 257 tests, 247 passed, two failed, eight environment skips. A deliberately concurrent fixture compiler occupied the global isolation directory during the CPU-cleanup assertion. The other failure exposed a fixture helper parsing a plain-text setup probe; the helper is now limited to interpreter JSON responses.
- Second full run: 260 tests, 251 passed, one failed, eight skips. The eight-second controlled-publication test gate was not reached while Graphify's AST extraction ran concurrently. No application resource limit, retry or test deadline was increased. A final run is performed with no competing compiler/graph work.
- First complete serial run: 260 tests, 252 passed, zero failures and eight Linux-only skips (368.4 seconds). All 29 focused interpretation/correction checks pass after the final conservative normalization guard. The final unchanged-tree repeat is recorded below.
- Production TypeScript/Vite build passes with process-local `VITE_COCREATE_AUTH_MODE=local`; default hosted production compilation also passed. The existing chunk-size warning remains. Boundary audit: 163 files, zero violations, zero Jev inference.
- Graphify AST refresh: 2,290 nodes and 5,451 edges. Fourteen SQL files remain unparsed because `tree_sitter_sql` is unavailable; semantic labels were not refreshed through paid inference. Linux guest checks remain unavailable on this Windows host and are reported as skips.

Ignored local evidence: `.runtime/provenance-repair/` contains the red regression log, focused/compiler flow logs, all full-suite attempts, production builds, boundaries, graph refresh, original safe projection and browser screenshots (`artifact.png`, `original-quote.png`, `blocked-review.png`). Earlier restoration and native-repair evidence is preserved.

## Explicit recovery for the affected project

Open `http://localhost:5190/r/x607fXTNEpoJqfh4NXPxW4OD` using the original author's browser session. Refresh after the approved local server restart. Reconnect OpenRouter in AI setup when ready; its temporary key is intentionally memory-only and cannot survive restarting this historical server. Persisted drafts, model assignments, submission evidence, receipts, requirements, artifacts and usage remain on disk.

1. Select **Review and correct my interpretation** beside the build status.
2. Under **Current interpretations**, use **Correct my intent** for each of the two unresolved items. Review the wording, retain an appropriate category and choose **Explicit request**, then **Save intent correction**. Suggested wording: `Create a restaurant website in a neubrutalist style.` and `Show Momo as the hero product of the restaurant.`
3. Saving is inference-free and records new human correction authority with the earlier interpretation in history. It does not rewrite captured edits or reset accounting. Keep the same request when recovering an uncertain reply; the dialog retains its request ID.
4. After reviewing both corrected accepted items, select **Build accepted changes** once. That action may spend on the selected builder under the existing workflow allowance. It does not repeat interpretation. Replaying its receipt cannot start another build.

No correction, resubmission, reinterpretation or build is performed automatically on the real affected project. Its original failed-attribution interpretation and physical-call receipt remain intact. Reinterpretation is unnecessary for this recovery; do not use it as an automatic repair.

## Delivery boundary

Branch: `codex/restore-coherent-4ccc1fb`, based on the prior repaired commit `013d122139db307e710ee537dd53c60957e7f749`. The final commit identity is included in the delivery response; verification and restart preservation checks are complete. No application code was fetched, pushed or deployed, and no paid inference was used. Live-model, Linux and hosted-account acceptance remain unverified.


Local relaunch: the prior process had stopped before the user's continuation. On explicit approval to restart, the repaired server was launched at `http://localhost:5190` using the same `.runtime/repair-20261020/app/data` and session secret. Both project JSON hashes match before/after startup. The affected project remains one submission, 135 captured edits, two proposals, zero accepted requirements, zero artifacts and one recorded interpreter call in budget `5b38a778-d498-43a0-ba27-23f7ce0eabfe`. No inference or recovery command ran on it. A stopped-data backup including SQLite/WAL files and session secret is retained in ignored `.runtime/provenance-repair/app-backup-before-relaunch/`.


## Final verification

Final unchanged-tree run: **260 tests, 252 passed, zero failed, eight Linux-only skips**, 362.3 seconds (`full-test-complete.log`). The preceding serial run also passed 252/0/8. The final conservative normalization change has 29 focused passing checks and is included in the unchanged-tree run. No compiler/browser resource ceiling, retry count or fixture gate was increased. All earlier failures and their logs remain available.

Final production/type build passes (`build-complete.log`); boundary audit passes across 163 files with zero violations (`boundaries-complete.log`); Graphify AST refresh reports 2,290 nodes and 5,451 edges (`graph-complete.log`). Documentation links and staged whitespace checks pass. The large graph diff is generated coverage, not additional runtime functionality.

The actual affected route returns HTTP 200 and exactly the current built client. Both real project JSON hashes remain identical to the stopped-data backup comparison. The affected record still has two proposed intents and one physical call; recovery is deliberately left for the author's explicit correction/build actions. The preserved deterministic fixture v2 is visible after restart at `http://localhost:5191/r/provenance-fixture`; final browser evidence is `.runtime/provenance-repair/artifact-final.png`.

If the local server later stops, from this isolated checkout run `node --import tsx .runtime/repair-20261020/local-app.ts`. It uses the existing local data/session secret and serves port 5190. Reconnect the memory-only OpenRouter lease manually before an explicit build. No automatic reinterpretation is needed.
