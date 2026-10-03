# Harness decision log

Updated 2026-10-02. Each stable identifier names one decision. Accepted behavior, local implementation and hosted verification are separate; the [checklist](checklist.md) owns evidence-backed status. Superseded/rejected records below preserve rationale, not current instructions. Current setup/limits live in [product.md](../../product.md#hosted-ai-and-limits).

Identifier repair: D-0035 retains BYOK; device recovery is D-0043. D-0021 retains hosted Supabase authority; JSON serialization recovery is D-0044. The one erroneous D-0036 gate-removal reference was corrected by meaning to D-0035, refined by D-0042. D-0036 remains historical comic motion. No decision was inferred from an assistant-generated prompt.

## D-0001 — Preserve the existing application while migrating additively

Status: accepted. Existing Yjs collaboration, provider connections, generated projects, and compatibility JSON remain in place. New durable records and projections are additive and legacy rooms are normalized lazily on load.

## D-0002 — Personal interpretations are proposals, not builder authority

Status: accepted. Every personal output carries a classification and source references. Only `explicit_request` and `decision` classifications are automatically accepted. `proposal`, `question`, and `ambiguity` remain visible but are excluded from build input.

## D-0003 — Build from the accepted registry, not the raw canvas

Status: accepted. A builder run captures an immutable specification revision and accepted requirement IDs. The provider request contains accepted requirements and bounded current project files; it does not contain raw canvas text. Attribution-only refreshes do not change the build fingerprint.

## D-0004 — Deletion is not withdrawal

Status: accepted. Removing text from the collaborative document does not itself revoke a requirement. An explicit withdrawal removes that participant's source; intent remains accepted while another participant still supports it.

## D-0005 — Pause on consequential accepted contradictions

Status: superseded by D-0006. The initial exact-negation detector paused the whole build; the current conflict-group model excludes unresolved requirement IDs while leaving independent accepted work eligible.

## D-0006 — Conflict groups and explicit affected-contributor agreement

Status: accepted. Conflicts are grouped by stable subject and scope with any number of faithful alternatives. The required resolver set is the unique source contributors. Missing choices remain pending; unanimous explicit choices resolve; completed differing choices become a disagreement. New or materially changed alternatives increment the revision/round and invalidate current confirmations. Unresolved requirement IDs are excluded from builder input while independent eligible requirements continue.

## D-0007 — Classify per intent and reprocess only by explicit participant action

Status: accepted. One contribution may contain requests, proposals, and questions, so the personal-agent contract and registry operate on attributed per-intent records rather than one contribution-level label. Deterministic contextual rules correct obvious semantic mismatches and missing labels fail closed to ambiguity. Persisted room history is not silently reclassified after classifier changes. The affected participant may reinterpret only their latest contribution from its recorded authenticated edit batch; the replacement removes only that interpretation's sources, preserves stable requirement identity and other contributors, and triggers a build only if accepted builder input actually changes. Settled decisions and explicit withdrawals require a new human correction.

## D-0008 — Submit intent explicitly; collaborate continuously

Status: accepted direction; primary submission hardening implemented locally, hosted verification pending. This supersedes inference on document edits. Build my changes captures only authenticated participant steering; typing/save/presence are inference-free. Nearby eligible submissions share a short collection window, initially three seconds, against one accepted baseline. D-0042 adds capture-order reconciliation, persistent batches/receipts and legacy HTTP build retirement. Restart restores interrupted drafts without automatic inference; safe automatic resumption and complete batch/run linkage remain deferred.

## D-0009 — Editor-focused Alt+X

Status: accepted editor-focus/filtering rule; optional disable/remap behavior superseded by D-0040. The button and shortcut share authenticated submission. Current mapping is fixed Alt+X on Windows/Linux and disabled on macOS. Ignore repeat/composition/AltGraph/extra modifiers, exclude dialogs/non-editor focus and preserve focus. No Enter shortcut. Older remapping checks are historical evidence, not a current requirement.

## D-0010 — Simple owner setup with advanced provider control

Current status: historical setup/presentation contract, superseded for the active hosted MVP by D-0035. Retain compatibility and rationale; do not revive this flow as current contributor guidance.

Historical record: Status: implemented provisionally. The owner may opt into a versioned mode/effort preset only after the server resolves one existing connection to exact models that passed the relevant capability checks. The confirmation screen discloses models, provider-currency rates, assumptions, and a conservative per-build cap. Existing assignments and participant overrides remain available as Custom/Advanced; no provider or data destination changes silently. Recommendations remain provisional until paid comparative evaluations are explicitly authorized and completed. A mode changes executor workflow, tools, output, verification, and bounded allowances—not the number of agents or accepted requirements.

## D-0011 — Show conflicts without destroying ideas

Status: accepted target, based on D-0006. Selection API, affected-contributor authorization, stale rejection and accessible choice cards are implemented locally under D-0039. Document highlights, richer compromise/reopen actions and finer dependency handling remain incomplete. Retain alternatives/history/last agreed baseline, explicit unanimity and fresh confirmation for changed options. Silence is never consent; block dependent disputed behavior while safe independent work remains eligible.

## D-0012 — Diagnose collaboration before retrying

Status: implemented. A browser WebSocket failure is not labeled as an internet outage. The provider checks the authenticated room-state contract to distinguish invalid sessions, missing rooms, and permission failures from transient transport failures. Only transient failures retry, using capped exponential backoff with jitter and generation guards. Terminal states require an explicit rejoin or return-home action. In-memory Yjs edits survive recoverable reconnects, with participant-scoped IndexedDB recovery later added by D-0043; full offline cold startup is not guaranteed. This decision does not close the separate Cloudflare durable-storage gap.

## D-0013 — Evidence-gated, deterministic model routing

Current status: evidence-gated routing principles remain accepted; the described preset resolver is local/historical compatibility, inactive hosted under D-0035. Comparative recommendations remain hypotheses.

Historical resolver rationale: Status: implemented foundation; comparative recommendations remain hypotheses. Keep n personal interpreters and one shared executor. Developer uses the economical capability-validated same-provider baseline until repeated trials meet the versioned evaluation thresholds. Analyst and Researcher do not route until their real tools and acceptance verification exist. Routing is deterministic and free, respects the selected effort and remaining budget, never silently upgrades uncertain work, and freezes the assignment for an active run. Paid trials require an explicit evaluation budget. Cost is presented as provider rates per million tokens plus computed one-pass and worst-case allowances, not arbitrary effort-price ranges.

## D-0014 — Versioned estimates, not inferred billing

Status: accepted accounting principles; implementation foundations exist. Version changing rates in their source catalogs: historical recommendation rates in `server/ai-presets.ts`, inactive managed rates in `server/managed-catalog.ts`, and current BYOK metadata frozen at selection. Keep currency/source/date and estimates distinct from spending limits and provider-confirmed invoices. Persist call-level reported usage/pricing references, uncertainty, repairs/failures and scope. Cached input applies only when reported; reasoning included in output is not charged twice. Effectiveness comparisons require comparable policies and a minimum sample; compilation alone is not verified success. D-0031 and D-0038 govern current physical-ledger scope.

## D-0015 — Recommended leads; owner API powers it

Current status: historical setup/presentation contract, superseded for the active hosted MVP by D-0035. Retain compatibility and rationale; do not revive this flow as current contributor guidance.

Historical record: Status: implemented 2026-09-21 and supersedes the brief direct-entry variant. The persistent API connections control and disconnected first-run state lead with CoCreate Recommended. The screen explicitly states that Recommended resolves checked models from the owner's saved API and provides prominent Connect/manage Advanced actions; Advanced returns to Recommended without erasing connections or assignments. Only the owner may save secrets, discover/test models, disconnect, or assign layers; collaborators see redacted status. Tests run only on an explicit action, may consume provider usage, and report reachability, text, interpreter schema, and current Developer executor operations separately.

## D-0016 — Managed AI requires accounts and a ledger

Status: accepted boundary for any future managed relaunch; inactive under D-0035. Signed participant sessions are not billing identities. Account identity, billing/spender authorization, quotas, concurrency/size limits, atomic reservations, reconciliation, unknown charges and an auditable ledger are prerequisites for platform-funded inference. D-0033 records partial local managed implementation, not live readiness. Server credentials never enter browser state; BYOK never silently falls back to managed funding.

## D-0017 — Three room modes replace coding specialties

Current status: historical setup/presentation contract, superseded for the active hosted MVP by D-0035. Retain compatibility and rationale; do not revive this flow as current contributor guidance. Analyst/Researcher tool and verification prerequisites remain accepted deferred direction.

Historical record: Status: implemented contract and migration; only Developer execution is available. The user-facing modes are exactly Developer, Analyst, and Researcher, with effort subordinate to mode and n interpreters plus one shared executor preserved. Developer reuses the bounded app pipeline. Researcher is displayed as unavailable pending controlled retrieval, source capture, and citation evidence. Analyst is displayed as unavailable pending validated data ingestion and isolated reproducible computation. All five legacy coding presets normalize to Developer without inference and without changing models, credentials, effort, participant overrides, or historical run records. Advanced manual assignments remain available.

## D-0018 — Spending ceilings do not replace per-call token allowances

Status: accepted separation of aggregate spending and per-call tokens. Historical 2026-09-22 effort allowances and compact project retry are superseded for the active hosted builder by D-0035/D-0042. Frozen spending cannot expand requested output or prove provider capacity. The current exhausted whole-project envelope uses smaller-task recovery rather than an unchanged oversized retry. Retain reported usage for every attempt, schema validation and no silent provider/model/effort upgrade. Raising effort is not verified output-ceiling advice.

## D-0019 — Effort is a canvas-side build control

Current status: historical setup/presentation contract, superseded for the active hosted MVP by D-0035. Retain compatibility and rationale; do not revive this flow as current contributor guidance.

Historical record: Status: revised and implemented 2026-09-23. Light, Medium, High, and Extra are shown in one compact ChatGPT-style selector beside the shared canvas. Only the owner of a connected room can change effort. A dedicated inference-free mutation re-resolves Recommended under its current mode and spending ceiling, or updates Custom/Advanced allowances while preserving all manual models and participant overrides. Submitted setup snapshots and active builds remain frozen. Disconnected and collaborator views stay visible but read-only with an explanation.

## D-0020 — The durable workflow is the primary shared object

Status: accepted primary-object decision; serialized durable workflow/task foundation implemented locally. One room has one logical coordinator and workflow. Documents/products are artifacts; model conversations are replaceable. Builds record source revision, criteria, assignment, evidence, run linkage and artifact provenance; ordered durable events/projections are authority. Compilation records unverified evidence. D-0042 adds local leases and prepared hosted fencing, with live SQL still unverified. Structured steering/control roles, bounded independent isolated workers, dependency scheduling, scoped approvals, pause/resume/cancel and control handoff remain accepted deferred direction.

## D-0021 — Supabase is the hosted project authority

Status: accepted hosted authority boundary (2026-09-24), partially implemented and not fully hosted-verified. Supabase Auth supplies accounts; Postgres owns projects, memberships, canonical snapshots/updates and physical ledger. Snapshot-embedded event/workflow/task/run projections are the current harness persistence, not a complete normalized-table migration. Private Storage is the accepted artifact authority target; upload/finalization primitives exist, older artifact-body promotion/restoration remains incomplete. Express/Yjs stay in place. SQLite/JSON is local development/cache and never silently replaces failed hosted authority.

## D-0022 — Membership precedes collaboration tickets

Status: accepted 2026-09-24; strengthened by D-0042. Verify account/current project membership before issuing a five-minute role-scoped collaboration ticket; room URLs are not permission. Viewers cannot update Yjs or invoke mutations. Current code rechecks HTTP reads/mutations, upgrades, inbound messages and outbound packets; revocation blocks subsequent delivery. Ticket expiry bounds a completely silent idle socket, and proactive immediate closure without traffic remains unimplemented. Live hosted revocation and query-cost checks remain pending.

## D-0023 — Durable acknowledgement follows the remote commit

Status: accepted 2026-09-24; refined by D-0042. Hosted saved follows confirmed canonical remote commit, never local memory/SQLite/frame receipt. The acknowledgement names the immutable committed revision/time plus insertion clocks AND deletion ranges. Failure stays unsynced and retains the promoted artifact. Older mutable acknowledgement descriptions are superseded.

## D-0024 — Keep bearer-token SPA auth instead of adding inactive Next.js middleware

Accepted 2026-09-24. CoCreate remains a Vite SPA with an Express API. Its browser Supabase client persists and automatically refreshes PKCE sessions; the authenticated request boundary refreshes near-expiry sessions and permits one refresh-and-retry on a 401. Express continues to verify bearer JWTs with `@supabase/server`. `@supabase/ssr` may support a future cookie-based SSR host, but Next.js server components, `next/headers`, and middleware/proxy files are not valid runtime entrypoints in this repository and must not be presented as implemented session handling.

## D-0025 — Prisma is not a second migration authority

Accepted 2026-09-24. Prisma 7.10 is pinned as an optional typed Postgres access and introspection layer. Its runtime URL uses Supavisor transaction mode and its CLI URL uses session mode. Cross-schema introspection includes Supabase `auth` only to model public foreign keys, and the managed auth tables/enums are explicitly external to Prisma Migrate. Existing versioned SQL under `supabase/migrations` remains authoritative; no Prisma migration may be applied to the hosted database until an explicit cutover reconciles migration histories, RLS, functions, grants, and Storage policies.

## D-0026 — OAuth callbacks follow the verified Worker origin

Accepted 2026-09-24. The canonical CoCreate production origin is `https://cocreate.susan981314271.workers.dev`. Google returns to the selected Supabase project at `/auth/v1/callback`; Supabase then returns to CoCreate at the separately allow-listed `/api/auth/callback`. Production callback selection is derived from an explicit build-time app origin rather than a hardcoded third-party Pages deployment or browser location. Hosted sign-in fails closed when the URL, key, JWKS, or project references disagree. Localhost remains a separately configured development callback, and callback codes are exchanged at most once.

## D-0027 — Email-bound project invitations remain separate from account invitations

Accepted 2026-09-25. Supabase Auth owns Google and email/password account identity, confirmation, and recovery. CoCreate owns project invitations and membership. Each invitation is project-scoped, recipient-email-bound, role-bounded, expiring, revocable, rate-limited, and stored by token hash; acceptance requires a matching confirmed Supabase account and is transactional/idempotent. Owners and members with explicit sharing permission may manage invitations and non-owner roles, while only owners grant sharing permission. Transactional email is server-side and provider acceptance is recorded as sent without claiming confirmed delivery.

## D-0028 — Low is a presentation label for the existing light effort value

Current status: historical setup/presentation contract, superseded for the active hosted MVP by D-0035. Retain compatibility and rationale; do not revive this flow as current contributor guidance.

Historical record: Accepted 2026-09-25. The canvas renders Low, Medium, High, and Extra as an accessible segmented radio group. `light` remains the stored/API value to avoid rewriting snapshots and historical records. Effort changes are inference-free, affect future submissions only, preserve manual assignments and the spending ceiling, and do not mutate active or queued work.

## D-0029 — Persist Yjs as explicit bytes and validate before hydration

Accepted 2026-09-26. Editor, transport, snapshot, and update history use Yjs V1. Supabase `bytea` writes use explicit PostgreSQL hex rather than Node Buffer objects. Stored bytes are decoded by one established path and applied first to an isolated document; arbitrary byte stripping or decoder guessing is forbidden. The exact historical Buffer-JSON defect may be unwrapped only after backing up the original row. Unreadable rows are quarantined, never overwritten, and snapshot recovery may use only individually valid, hash-matching update history.

## D-0030 — Callback failure does not erase or silently use a valid session

Accepted 2026-09-26. OAuth callback processing first resolves persisted session state, exchanges each PKCE code once, and removes sensitive query parameters. Cancellation, missing codes, and rejected/reused codes are distinct from initialization. When a prior valid session survives, CoCreate identifies that account and requires an explicit continue or switch-account action; dismissing an error never authorizes a workspace. Backend membership remains authoritative.

## D-0031 — Count physical provider requests at the HTTP boundary

Accepted 2026-09-26. A user action, workflow run, or combined provider usage object is not the accounting unit. Every outbound provider HTTP attempt receives a unique call ID and records dispatch intent, purpose, retry reason, frozen configuration/pricing references, timing, outcome, provider request ID when available, and normalized usage. Transport retries and structured-output repairs are separate calls. Setup tests are displayed separately from generation, unknown usage is not coerced to zero, and prompt/document/credential content is excluded from the ledger.

## D-0032 — Developer-only managed default with preserved Advanced settings

Current status: historical setup/presentation contract, superseded for the active hosted MVP by D-0035. Retain compatibility and rationale; do not revive this flow as current contributor guidance.

Historical record: Accepted 2026-09-27; supersedes D-0019 and earlier three-mode/default-BYOK presentation decisions for new hosted projects. Developer is the only activatable workflow. New projects preselect a managed shared builder with a fixed economical interpreter. Normal setup has one Builder selector and no effort control. Existing BYOK projects remain unchanged until explicit owner opt-in, and returning to managed retains custom settings. Researcher/Analyst history is readable but cannot be newly activated.

## D-0033 — Founder funding is an explicit project authorization

Current status: historical setup/presentation contract, superseded for the active hosted MVP by D-0035. Retain compatibility and rationale; do not revive this flow as current contributor guidance.

Historical record: Accepted 2026-09-27. The hosted account/project funding row and owner-authorized spender row are distinct from invitation membership. A physical managed request requires membership, configured server credential, positive credit or bounded allowance, spending/concurrency limits, atomic reservation, and durable reconciliation. Unknown provider outcomes keep the reservation. Managed and BYOK never silently fund one another. Credit starts at zero; checkout is separate. Migration and live billing tests remain pending.

## D-0034 — Curated builders and measured qualification

Current status: historical setup/presentation contract, superseded for the active hosted MVP by D-0035. Retain compatibility and rationale; do not revive this flow as current contributor guidance.

Historical record: Accepted 2026-09-27. The versioned server allowlist has no more than 15 enabled exact IDs. Gemini 3.8 Flash remains the provisional default, DeepSeek V4.1 Flash the budget featured choice, and Claude Sonnet 5 the higher-capability candidate. Published metadata is not a quality ranking. The managed interpreter is provisionally DeepSeek pending comparative tests against GPT-6 Luna and Qwen3.8 Flash. Model/configuration/rate policy freezes per submission. A repeatable fixture and scoring gate exist; paid comparative results have not been run.

## D-0035 — BYOK-only hosted MVP (2026-09-28)

Status: accepted hosted policy, implemented locally; hosted/provider verification pending. Supersedes D-0032 through D-0034 for active routing. New projects start without AI; owner validates OpenRouter without generation, explicitly selects builder/interpreter, and uses a two-hour memory-only key lease. Editors need owner spending authorization; expiry/restart needs reconnect. Managed/founder dispatch and old hosted setup are disabled; historical project/billing/configuration records remain.

A local real-key interpretation exposed an unintended legacy call gate; its removal and explicit retry/physical-token display belong to this BYOK decision, not comic-motion D-0036. D-0042 subsequently requires the bounded 24-physical-call executor recovery ceiling and frozen configured spending enforcement. BYOK has no managed-credit gate; provider limits remain separate. See the single current contract in [product.md](../../product.md#hosted-ai-and-limits).

## D-0036 — Calm workspace with restrained original comic motion

Status: historical presentation decision accepted 2026-09-28; superseded for active presentation by subsequent explicit reference/Studio Ivory requests and D-0042's Shared context target. The earlier lavender/lime neubrutalist shell and brief original comic action effects had reduced-motion support and no copied artwork/animation packs. Preserve this rationale and historical artifacts, but do not require these effects now. Workflow evidence, uninterrupted writing and accessible quiet document text remain accepted independent behavior. This identifier never means BYOK gate removal.

## D-0037 — Invitation retries preserve all prior links and roles

Accepted 2026-09-30. The earlier revoke-on-retry migration was rejected and never applied because retrying a send must not invalidate existing valid links or membership roles. A new request ID identifies one creation or resend; a replay returns its encrypted token and uses the same provider idempotency key. A deliberate resend creates another link without revoking earlier pending links. Acceptance preserves existing member roles. No migration deletes invitation, membership, or delivery rows. Unbound legacy links previously revoked for recipient security are not resurrected.

## D-0038 — Physical usage has an explicit coverage boundary

Accepted 2026-09-30. Deduplicate dispatch/reconciliation by call ID in the local event store and hosted Postgres ledger. Backfill only the recent provider calls actually retained in hosted snapshots. Display the older generation counter separately, never add it to the physical-call total, and mark coverage partial until historical source data is reconciled. Unknown provider usage remains unknown.

## D-0039 — Conflict choices require current authority and revision

Accepted 2026-09-30. Only a current owner/editor who is an affected contributor can select. Require the current group revision and decision timestamp, serialize room choices, reuse request IDs for retries, reject stale submissions with 409, and acknowledge only after persistence. Do not treat browser controls as an authorization boundary or an in-memory queue as a distributed lease.

## D-0040 — Visible rename and fixed shortcut

Accepted 2026-09-30. User-facing identity is 2guys1canvas; CoCreate technical identifiers remain for compatibility. D-0009's optional disable/remap UI is superseded: the fixed editor-focused mapping is Alt+X on Windows/Linux and disabled on macOS. The button and shortcut retain the same authenticated submission path.

## D-0041 — Usage and Shared Intent display

Accepted 2026-09-30. Detailed build, call, and setup usage is in Workflow; a separate canvas card displays recorded generation plus setup tokens. Physical usage keeps partial historical coverage explicit. Shared Intent keeps accepted requirements, proposals, conflict alternatives, disagreements, sources, and decision history reachable.

## D-0042 — Bounded recovery and durable collaboration receipts

Status: accepted 2026-10-01 from the actual human reliability request; local implementation/controlled evidence exists, hosted and visual verification pending. Whole-project output exhaustion decomposes into at most eight coherent ordered one-file tasks with awaited source checkpoints and one 24-physical-call executor ceiling across recovery, retries and superseded candidates. These are current bounds, not proven optimal values. Configured spending, context capacity and provider completion limits stay separate. No unverified higher-effort output advice or truncated envelope promotion. Failed candidates retain the last compiled artifact, show failed task/recovery progress/call bound/next action; functional acceptance remains separate.

Capture only authenticated participant steering, reconcile in capture order and persist pending batches, active submissions and replay receipts. Later accepted work stays queued behind a fixed-revision candidate. Immutable canonical saves acknowledge insertion AND deletion receipts. Local epochs fence owners; hosted service-role atomic fencing is prepared in an unapplied migration. Reconnect/restoration is inference-free. Controlled local evidence does not establish live SQL, hosted accounts or multi-instance routing.

Shared context returns to Canvas with selected durable accepted revisions and separate partial recorded usage, also reachable in Workflow/Artifacts. This supersedes no-Canvas-sidebar and unbounded-recovery guidance. Counters deduplicate physical attempts, define generation separately, preserve unknowns and disclose scope. The supplied reference is now available; comparison pending. The earlier run lacked it and remains dated. Status vocabulary, complete actionable failure presentation, reference viewport/keyboard/contrast and hosted convergence remain explicit checklist checks, not new architecture decisions.

## D-0043 — Device recovery complements durable shared authority

Accepted 2026-09-28. Use participant-scoped IndexedDB for document recovery and short transport batching for edit bursts. Keep cloud records authoritative for permissions, accepted intent, tasks, artifacts and credits. Do not acknowledge a cloud save from a local transaction. Local recovery requires a valid room session; full offline startup and cache retention controls are not claimed. Renumbered from the device-recovery duplicate D-0035 during 2026-10-02 cleanup; BYOK retains D-0035.

## D-0044 — Recover JSON serialization locally without weakening validation

Status: implemented local serialization recovery accepted 2026-09-24; renumbered from the duplicate D-0021 during 2026-10-02 cleanup. Normalize raw control characters in JSON strings, trailing commas, fences and a balanced object surrounded by prose without inventing keys/values/operations/code semantics. Recovered output must pass the exact schema and project validators. Unclosed envelopes are probable truncation; active whole-project recovery follows D-0042 rather than historical effort/compact-retry advice. Normalization itself uses no provider call.

## D-0045 - Primary-container affinity with bounded owner retry

Accepted for Step 02, 2026-10-03. Retain the existing Worker stable primary container and one configured instance. A request reaching a non-owner receives authenticated, redacted HTTP 503/Retry-After 2; do not forward credentials or redirect to an owner address. This is the smallest strategy compatible with the present deployment and preserves current membership/caller identity. Clients retry connection within a fixed bound, retain page edits and show an explicit reopen action. Inference commands are never automatically repeated; explicit replay preserves participant/request identity.

Bound and coalesce coordinator RPCs; permanent loss invalidates old workers, including delayed responses. Fence canonical snapshots, document appends and dispatch intents under one project advisory/lease lock order, with fresh checks before HTTP dispatch and promotion. Preserve exact replay and reject conflicting payloads. External attempts already dispatched remain uncertain/reconcilable. Prepared additive SQL and a guarded real-contention runner do not establish live database correctness. Drain old writers before rollout; real Postgres contention and hosted deployment checks remain release prerequisites. Artifact retention and worker concurrency are outside this step.


## D-0046 - Verified private bodies before canonical artifact references

Accepted for Step 03, 2026-10-03. Reuse the existing private Storage bucket and project-scoped member read policies. Persist deterministic, immutable content-addressed product/checkpoint envelopes, verify SHA-256/length/project/kind/version identity, and publish before the existing fenced snapshot commits its manifest/history. The previously unused compatibility ZIP metadata method is not the active publication authority. Keep one coordinator, a fixed candidate revision and serialized promotion; recheck after upload, hide uncommitted products and defer concurrent autosaves until commit or rollback. Preserve increasing archived version IDs after rollback, command receipts and inference-free recovery.

Restore current products/checkpoints eagerly and historical bodies lazily into verified disposable caches. Missing/corrupt data fails distinctly from an empty project. Interrupted publication can leave private orphan bodies; exact replay reuses verified bytes. No public URLs or automatic regeneration. Legacy inline data remains readable; discarded legacy history cannot be fabricated. Dehydrated schema-1 snapshots require this reader, so an older app-only rollback is unsafe without reviewed verified re-materialization under drained writers. Propose checkpoint/event-tail compaction with independent permanent receipts, but do not prune history or migrate historical data in this step. Controlled SDK/HTTP and browser checks do not establish hosted RLS, Storage, SQL or deployed recovery.


## D-0047 - Mandatory OS boundary for generated compilation

Accepted for Step 04, 2026-10-04. Replace in-process native compilation with pinned esbuild WASM in a trusted isolated Node worker. Keep the approved dependency graph and virtual candidate sources; do not evaluate candidate top-level code, allow packages/shell commands or expose test probes through model/HTTP APIs. Windows uses zero-capability AppContainer plus a suspended-before-assignment Job Object, with Node permissions as an additional restriction. Strip inherited secrets/injection flags, scope filesystem access, enforce memory/CPU/process/wall/output limits and terminate/clean up on cancellation or parent loss. OS-only filesystem/network tests and restricted-process/resource tests have distinct evidence scopes.

Prepare non-root Bubblewrap/prlimit Linux configuration and mandatory startup preflight without deploying. Linux/container kernel and WASM limit compatibility are unverified here and remain release prerequisites; permission flags alone do not establish OS isolation. Unsupported/unavailable boundaries fail closed. Preflight before builder dispatch and stop isolation/resource failures without provider repair; retain the previous artifact and require explicit retry after operator repair. Preserve fixed revisions, owner fencing and serialized promotion. Compilation is the current verification stage and still yields functionally unverified evidence; Step 07 must run its future checks through this boundary. No workflow concurrency or intent-policy changes are accepted by this decision.
