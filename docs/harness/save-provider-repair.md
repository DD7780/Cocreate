# Saving and provider repair — 2026-10-17

## Bounded change packet

Baseline: main `633d513`, deployed app fingerprint `1052d6b2d91319e388ab2b40513865bc56fe7ac067636d417e33dab56c77a058`. Branch `codex/save-provider-repair` reuses the clean attached worktree. The stale, dirty shared desktop checkout is untouched. Its untracked `build-save-timeout-repair.md` is read-only incident evidence, including the 13:00–13:10 Nepal-time follow-up; its older implementation prompt does not override the new user request.

Outcome: a durable, insertion/deletion-covered caller save; one replay-safe authenticated capture; correctly classified/bounded physical attempts; selected-provider interpretation and a requirement-verified, promoted/reopenable product. Never equate local/controlled/CI evidence with hosted acceptance.

Scope: `server/providers.ts`, `server/rooms.ts`, `server/room-state.ts`, `server/supabase-platform.ts`, `server/index.ts`, existing submission/provider helpers, `shared/` diagnostics/receipt contracts and focused tests/browser tooling. Widen only for demonstrated connected behavior. No branding work, dependency, schema migration, permission relaxation, model/key substitution, limit increase, historical deletion or paid inference. Source publication follows applicable session authorization; live inference additionally needs an explicit spend cap and designated account/project.

Graphify queries connect provider request/classification/accounting and canonical queue/flush/authorization/delivery to their exact callers and existing tests. Current source confirms the generic HTTP 400 catch retries despite `retryable=false`. Current source also takes a new canonical snapshot on every flush even when an in-flight save already covers the required document; test whether that adds a second serialized remote operation. The latter is a source hypothesis, not a proven explanation of the earlier live stall.

Preserve queue ownership and coordinator fences through unknown writes, original request IDs, both insertion/deletion coverage, authenticated caller attribution, private artifact gates, independent recovery journal/high-water and the 20/30-second wait bounds. A timer ending a wait never cancels a canonical mutation or permits a new writer. Diagnostics contain bounded IDs/stages/timings/status/codes/parameter paths only, never prompts, keys, raw upstream bodies or reasoning.

Verification: first reproduce permanent HTTP 400 over actual loopback adapter, deferred/hung/queued writes, then focused provider/accounting/save/coordinator/sequence/replay tests. Browser: two participants, slow/failed/unknown save, late reply/reconnect, continued typing/deletion-only, double activation, first/existing product. Keep earlier failures. Run boundaries/full tests/build, native production-image gates, diff check, AST graph refresh and release attestation. Hosted save/interpret/accept/build/verify/promote/reopen are separate gates. If budget/access or rejected-field evidence is unavailable, report ready for hosted verification and the exact remaining dependency.

## Demonstrated defects and changes

The generic HTTP 400 loopback regression made three physical calls before repair. Classification fell through to network with retryable false, then catch ignored retry eligibility. Catch now obeys the flag; real network/timeouts explicitly opt into bounded retries. HTTP 200 envelopes containing API errors are classified before output validation and cannot trigger model-output repair. Each dispatched attempt retains its call ID and terminal accounting. Safe diagnostics allowlist status, known error type/code, bounded request ID and up to eight syntactic parameter paths. Messages no longer echo upstream private text.

A separate accounting regression showed that a once-failing terminal persistence callback could be mistaken for transport trouble and dispatch again. Pre-dispatch authorization errors retain their existing behavior; terminal callbacks preserve typed accounting failures or convert generic persistence errors into a terminal accounting error. Recovery must use the existing receipt; a database failure cannot justify another paid call. [Pre-fix evidence](../../artifacts/save-provider-repair/accounting-before.log).

A deferred covering snapshot reproduced a second unnecessary remote operation during flush. Flush now joins the current pending snapshot, then checks a canonical-confirmed receipt against insertion clocks, deletion signature and attributed sequence. A covering receipt is redelivered through fresh authorization without another commit. Deletion-only changes require a new snapshot. Non-covering late writes cannot schedule another save for an expired flush. Intent/promotion gates, ownership checks, serialization and 20/30-second budgets remain unchanged.

Each flush can emit at most four safe timing events, correlating request/connection IDs with ingress queue, membership/coordinator authority, save wait, canonical queue, preparation, artifact publication, remote commit and reply authorization/delivery. Each record includes at most four snapshot traces. Observational expiry never cancels a mutation, changes its identity, releases its queue or authorizes inference. A cache or restored local ledger never creates a hosted confirmed receipt.

## Provider contract review and hosted evidence

Context7 resolved official OpenRouter docs and checked [structured output](https://openrouter.ai/docs/guides/features/structured-outputs), [reasoning](https://openrouter.ai/docs/guides/best-practices/reasoning-tokens) and [error metadata](https://openrouter.ai/docs/api/reference/errors-and-debugging). The regression captures the actual adapter's complete exported interpretation schema, strict object/required-property structure, chosen model, reasoning and output allowance. It verifies rejection never drops validation or silently changes configuration. This audits request construction; it does not prove that the live endpoint accepts every schema field.

Read-only [public model metadata](https://openrouter.ai/api/v1/models) on 2026-10-17 still lists google/gemini-3.7-flash with response_format, structured_outputs, max_tokens and reasoning support, context 1,048,576 and completion capacity 65,536. No demonstrated field incompatibility follows from these advertised capabilities. The precise earlier invalid argument remains unknown; no schema/model change is justified yet.

Scoped read-only hosted inspection finds snapshot revision 62, committed 2026-10-17 07:38:12.904481 UTC, attributed sequence 122, two retained submissions and zero products for the incident project. Six failed calls to the selected model were retained between 07:14:56.729 and 07:15:43.365 UTC, classified historically as network. Existing records cannot recover the missing HTTP status/argument. Service-wide timeout-manager activity and a later fast save do not identify the earlier flush stage. No hosted write or paid request was made by this repair.

## Local verification and limits

| Check | Result / evidence |
| --- | --- |
| Pre-fix regressions | Permanent 400 made three calls; covering flush queued two commits. [Provider](../../artifacts/save-provider-repair/provider-before.log), [save](../../artifacts/save-provider-repair/save-before.log). |
| Connected provider/accounting/authority/save/replay | Final connected candidate 59/59 pass, including BYOK, terminal-accounting, caller-only replay and final receipt redelivery. [Log](../../artifacts/save-provider-repair/connected-candidate.log). Earlier connected 55/55 and receipt follow-up 24/24 are retained. |
| Real SDK transport | Loopback Supabase SDK trace distinguishes artifact preparation from HTTP 500/XX000 commit failure; excludes private message/key/document sentinels. This is controlled HTTP, not hosted SQL. |
| Built-browser scenarios | Two isolated participant contexts; delayed success and repeated activation, typing while waiting, first/existing-product error, unknown outcome/late reply, stable uncertain request ID, reconnect and deletion-only flush. Zero provider calls. [Log](../../artifacts/save-provider-repair/browser-final.log). Capture endpoint is controlled; real caller-only receipts have separate connected regressions. |
| Boundaries/build | Boundaries 0 violations; production build passes. Initial build type errors and browser fixture failures retained. [Boundaries](../../artifacts/save-provider-repair/boundaries.log), [build](../../artifacts/save-provider-repair/build-candidate.log). |
| Graph | AST update: 2,412 nodes / 5,802 edges; no paid semantic update. Existing SQL parser unavailable. [Log](../../artifacts/save-provider-repair/graph-candidate.log). |
| Full Windows / production image | Initial Windows run: 282 pass / 12 fail / 8 skip; retained [log](../../artifacts/save-provider-repair/full-windows.log). It overlapped edits/build activity, and included old assertions/pre-dispatch reporting now resolved by connected checks. Native/timing/SPA failures require separate fresh verification. Production-image/native gates pending; append exact results before main. |

## Remaining acceptance and recovery

The patch is ready for release-candidate verification, not verified end to end. Retain the previous product and caller draft on any failure. For an unknown mutation, wait for canonical resolution and replay the same command ID; do not clear queues or infer rollback. Typing/save/reconnect/reopen remain inference-free.

After authorized rollout, use one designated signed-in account/project and an explicit total USD cap plus maximum physical calls for the selected interpreter/builder. Reconnect BYOK through the app after a restart; never send secrets in chat. Correlate one flush ID with its stages, then inspect only the safe provider rejection metadata. Stop on ownership loss, unknown consequential writes, budget exhaustion or isolation failure. If the upstream response still omits its rejected field, provide its safe status/code/request ID to provider support; do not guess or repeat the same spend.

Hosted acceptance must independently show saved, authenticated caller-only captured, interpreted, accepted, isolated compilation, requirement-linked functional verification, promoted and restored after reopening. Until that run is authorized, the intermittent production cause and rejected argument remain unresolved. Main/source publication alone does not complete this gate.
