# October 14 build-path restoration

## Request and baseline

On October 18 the user requested the version from four days earlier, then selected **Canvas → Build → Artifacts only**, retaining current branding, landing page and sign-in. Git main has no commits on October 10–14; `6c4402958bdec460b23c959bc99c8e824e53dd1c` (October 9) is the source baseline active at the October 14 cutoff. This identifies source, not proof of a successful provider build on that date.

Current main was preserved at `57e27b0`. Preparation is isolated in `codex/restore-oct14-build`; unrelated dirty checkouts, live documents, migrations and artifacts are untouched. No hosted rollback has been performed.

## Bounded change packet

- Outcome: evaluate restoration of the former caller-only submit/flush and interpretation/build path while keeping newer public pages/authentication and deployment guards.
- Scope: `server/{rooms,room-state,index}.ts`, `src/{App,provider}.tsx/ts`, and connected submission fixtures, tests and steering. Current intent authority, requirement classification, model generator, shared types, conflict component and branding remain in place. Preserve current isolation, private artifacts, Supabase journal recovery, physical accounting, hosted-secret validation and release fingerprint guards.
- Evidence: Graphify query for compiler/isolation/generation/rollback; current-main history and file comparisons with `6c44029`. The old compiler already had the same 10-second CPU allowance, 512 MiB Windows memory allowance and a stricter 20-second wall limit. A source rollback alone is not evidence that the current resource failure disappears.
- Preserve: authenticated attribution and membership, no inference on typing/reconnect, durable idempotency, one coordinator, fenced promotion, private artifact history, migration history and current product identity. Superseding submission rules is authorized by this explicit restoration request; production data compatibility remains mandatory.
- Verification: type/build/boundary checks; historical submission fixtures, current membership/accounting/persistence compatibility; real isolated compilation; two-author capture, incremental artifact and reconnect scenarios. No paid inference or deployment is part of an unverified candidate.
- Stop condition: do not publish a partial mixed-version server or claim restoration if current journal/receipt recovery would be lost or a required core check fails. Keep the candidate reviewable and explain the concrete blocker.

## Investigation result — not deployed

The historical compiler successfully compiled a minimal restaurant in 7,341 ms and a ten-file restaurant fixture in 5,452 ms on this Windows machine, with the historical sandbox restrictions intact and no provider calls. These are controlled local cases, not replay of the failed hosted candidate. Logs are `C:/Users/QUTA4/OneDrive/Desktop/Devoffice/output/oct14-historical-compiler.log` and `oct14-historical-restaurant.log`.

A trial restoring twelve connected core/client files from the cutoff uncovered mixed-contract type failures and, more importantly, incompatible durable metadata. Historical `RoomManager.save` omits `captureCursor`/`captureSources` and reconstructs command receipts without the newer permanent payload hash; historical submission recovery also replaces receipt objects. Current journal recovery and newer open tabs still require those fields/contracts. A naive partial restore cannot safely be deployed over recent project data. Merely restoring the entire old type/test tree would conceal, not solve, that interoperability problem.

The rejected trial diff is retained privately in `.runtime/oct14-restore/rejected-partial-restore.patch`. It was reverted before preparing the compatibility-aware implementation below. Other worktrees and production data remain unchanged. No completed deployment or live acceptance is claimed.

Read-only live checks identify runtime `af59b35b7f5cbef21098ca4ef1e754a4738dba4a909b41432c80c06ef02288a0`. In the supplied failed run both provider phases succeeded, compilation failed and no artifact was promoted. Its builder emitted 6,401 output tokens. This evidence does not establish whether a source regression, generated candidate or hosted resource condition caused the resource exit.

## Compatibility-aware candidate

The user clarified that the application as a whole worked then; a particular project URL is **not required**. Continue using the October 14 Git cutoff and the previously selected workflow-only scope. No request to reset project data or undo newer branding/authentication was inferred.

The isolated candidate restores the earlier caller-only WebSocket flush → authenticated `/submit` interaction, classic Canvas/Artifacts controls, capture-order personal queue and former OpenRouter output allowances (2,400 personal / 8,000 builder tokens). Submissions freeze the caller's pending batch at server admission after flush, matching the historical interaction; this is distinct from the superseded client-frozen command envelope. Keep selected models/credentials unchanged.

Preserved compatibility and protections:

- Current source attribution/final passages and conservative intent/conflict fixes remain; ordinary writing still does not authorize inference.
- Current coalesced persistence, authenticated WebSocket batches, hosted secrets, provider accounting and safe shutdown draining remain.
- Save acknowledgment uses a confirmed covering document receipt, with a 20-second server bound and 30-second client wait. Session renewal updates socket credentials without replacing the editor/document; outstanding flush IDs are replayed after the new handshake. A retired socket cannot acknowledge the newer connection's pending work.
- Existing capture journal cursors, provenance and permanent receipt hashes round-trip through historical submission snapshots. Read-only `/commands/:requestId` serves existing journal commands; new-style capture POST returns an explicit reload-required 410 rather than starting duplicate work.
- Current compiler isolation/diagnostics, retained-candidate zero-model recompilation, private artifacts, browser checks and promotion fencing remain. This is a selective behavior restoration, **not an exact historical binary or a database rollback**.
- Landing page, project/sign-in screens, branding, Supabase schema/history and deployed data are untouched. Legacy browser storage and preview protocol bridges remain readable.

The old test contracts were restored only where they exercise the replaced workflow. Current provider qualification, auth/beta, private storage fixtures, database capture SQL and compiler/browser adversity tests remain. Superseded capture-write/gesture-envelope tests are removed with that active path; their removal is not evidence that the underlying guarantees were verified. New `oct14-restore.test.ts` checks current metadata and actor-bound historical receipt reads.

Verification so far: production build/type check pass; a three-collaborator controlled integration test creates and incrementally maintains a product, retains the prior artifact after failure and reopens saved state. The corrected metadata/secret checks pass 7/7 with intent cases; provider compatibility passes 17/17, auth/receipt/SPA checks 24/24, and deferred revocation passes 1/1. These are separate targeted runs, not one combined suite. Real provider acceptance was not run.

The first Windows full run is retained at `output/oct14-restore-full.log`: 260 tests, 222 passed, 30 failed, eight Linux-only skips. Failures included absent verification-browser setup, old fixtures lacking current journal routes/secrets/schema names, and timing failures. The missing-browser run is not a production failure diagnosis. The corrected intermediate suite passed 259 tests with zero failures and eight Linux-only skips. Subsequent retained protection tests passed 21/21 and exposed/fixed autosave coalescing and token-renewal lifetime regressions. A final full run including those fixes and the retained protection suites is pending. No sandbox bounds were relaxed. Docker is unavailable on this host, so fresh native production-image gates require CI.

Built-browser acceptance passes with two independent Chrome profiles, actual isolated compilation, and local interpreter/builder HTTP fixtures: button build, Alt+X incremental build, caller-only interpretation, teammate draft retention, no inference on typing/reload, and writing retained through token renewal. Two interpreter calls and two builder calls were all local fixtures; paid calls: zero. Desktop and actual 390-pixel phone screenshots plus machine-readable checks are in `artifacts/oct14-restore/browser/`. Production build/type check and boundary checks pass. This proves the controlled workflow, not live provider/hosting readiness.

## Required continuation

Finish the fresh suite and required CI gates, review the exact source/compatibility diff, and validate the restored interaction in a built browser before release. Preserve original failures and report unsupported checks. Do not merge or deploy a failing candidate, reset the database, rewrite history or repeat paid generation to make the rollback look successful. A production restoration and designated-provider acceptance have not yet occurred.
