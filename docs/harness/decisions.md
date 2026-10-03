# Harness decision log

## D-0035 — BYOK-only hosted MVP (2026-09-28)

Status: accepted and implemented locally. Supersedes D-0032 through D-0034 for active routing. New hosted projects start without AI. The owner validates an OpenRouter key without generation, explicitly selects a builder and interpreter, and saves. The key is held in a two-hour in-memory lease; reconnect after expiry or restart. Editors require owner authorization to spend. Managed/founder dispatch and old hosted connection flows are disabled. Historical configurations, catalogs and billing remain readable without migration or deletion. A local real-key submission exposed the obsolete call-count gate after successful interpretation. D-0036 removes it, shows physical-request tokens, and adds explicit build retry. Hosted two-account evidence remains pending.

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

Status: accepted product direction; partial implementation. This supersedes automatic interpretation/building on document edits. Build my changes captures only the authenticated participant's unsubmitted changes; no inference occurs from typing, save or presence. Personal interpretation happens on submission; nearby eligible submissions share a short builder collection window (initial default three seconds). One shared accepted specification remains the baseline. Later work queues behind the active builder. Durable batch boundaries, restart resumption and legacy-route enforcement remain unfinished.

## D-0009 — Editor-focused Alt+X

Status: implemented in the submission shortcut slice; historical validation is recorded in the checklist. Windows/Linux default to Alt+X; macOS defaults to disabled. The button and shortcut share submission logic. Ignore repeat/composition/AltGraph and extra modifiers, exclude dialogs and non-editor focus, support disable/remap, and do not introduce an Enter shortcut.

## D-0010 — Simple owner setup with advanced provider control

Status: implemented provisionally. The owner may opt into a versioned mode/effort preset only after the server resolves one existing connection to exact models that passed the relevant capability checks. The confirmation screen discloses models, provider-currency rates, assumptions, and a conservative per-build cap. Existing assignments and participant overrides remain available as Custom/Advanced; no provider or data destination changes silently. Recommendations remain provisional until paid comparative evaluations are explicitly authorized and completed. A mode changes executor workflow, tools, output, verification, and bounded allowances—not the number of agents or accepted requirements.

## D-0011 — Show conflicts without destroying ideas

Status: accepted target, builds on D-0006; UI/mutation integration remains unfinished. Highlight accepted conflicts and show multi-option cards below Shared intent. Missing selections remain pending; unanimous affected-contributor agreement resolves; differing completed selections become Disagreements. Preserve alternatives, history and the last agreed baseline. Changed options and compromises start a new confirmation round. Block dependent disputed behavior; continue safe independent work without treating silence as consent.

## D-0012 — Diagnose collaboration before retrying

Status: implemented. A browser WebSocket failure is not labeled as an internet outage. The provider checks the authenticated room-state contract to distinguish invalid sessions, missing rooms, and permission failures from transient transport failures. Only transient failures retry, using capped exponential backoff with jitter and generation guards. Terminal states require an explicit rejoin or return-home action. In-memory Yjs edits survive recoverable reconnects, but no offline-across-reload guarantee is made. This decision does not close the separate Cloudflare durable-storage gap.

## D-0013 — Evidence-gated, deterministic model routing

Status: implemented foundation; comparative recommendations remain hypotheses. Keep n personal interpreters and one shared executor. Developer uses the economical capability-validated same-provider baseline until repeated trials meet the versioned evaluation thresholds. Analyst and Researcher do not route until their real tools and acceptance verification exist. Routing is deterministic and free, respects the selected effort and remaining budget, never silently upgrades uncertain work, and freezes the assignment for an active run. Paid trials require an explicit evaluation budget. Cost is presented as provider rates per million tokens plus computed one-pass and worst-case allowances, not arbitrary effort-price ranges.

## D-0014 — Versioned estimates, not inferred billing

Status: implemented accounting foundation. Keep changing rates in `server/ai-presets.ts` only, with currency, official source, and verification date. Display the estimated one-pass maximum separately from the user spending limit and state its participant/builder/repair scope. Persist normalized call-level usage and frozen pricing references; cached input is used only when reported, reasoning already included in output is not billed twice, and missing or timed-out usage stays uncertain. Count one shared builder once. Historical effectiveness includes failures and repairs, requires comparable configuration/policy groups and a minimum sample, and never treats compilation alone as verified success. Charges remain estimates until confirmed by provider billing.

## D-0015 — Recommended leads; owner API powers it

Status: implemented 2026-09-21 and supersedes the brief direct-entry variant. The persistent API connections control and disconnected first-run state lead with CoCreate Recommended. The screen explicitly states that Recommended resolves checked models from the owner's saved API and provides prominent Connect/manage Advanced actions; Advanced returns to Recommended without erasing connections or assignments. Only the owner may save secrets, discover/test models, disconnect, or assign layers; collaborators see redacted status. Tests run only on an explicit action, may consume provider usage, and report reachability, text, interpreter schema, and current Developer executor operations separately.

## D-0016 — Managed AI requires accounts and a ledger

Status: accepted boundary; not implemented. Signed room participant sessions are not billing identities. Do not expose platform-funded inference until reliable account authentication, owner billing authorization, quotas, concurrency/size limits, atomic reservations, reconciliation, uncertain-charge records, and an auditable credit ledger exist. Managed deployment credentials never enter browser-controlled state, and BYOK never falls back to managed credit silently.

## D-0017 — Three room modes replace coding specialties

Status: implemented contract and migration; only Developer execution is available. The user-facing modes are exactly Developer, Analyst, and Researcher, with effort subordinate to mode and n interpreters plus one shared executor preserved. Developer reuses the bounded app pipeline. Researcher is displayed as unavailable pending controlled retrieval, source capture, and citation evidence. Analyst is displayed as unavailable pending validated data ingestion and isolated reproducible computation. All five legacy coding presets normalize to Developer without inference and without changing models, credentials, effort, participant overrides, or historical run records. Advanced manual assignments remain available.

## D-0018 — Spending ceilings do not replace per-call token allowances

Status: implemented 2026-09-22. A room's USD spending limit authorizes aggregate bounded cost but never silently expands a frozen request's input/output allowance. New Developer effort allowances provide more realistic space for complete project operations, and Advanced defaults to the Medium executor output allowance. One compact retry is permitted after structured-output truncation because the existing reservation already accounts for two schema attempts; both attempts' reported usage is retained. A second truncation remains a failure with actionable effort/model guidance. No provider, model, or effort is silently upgraded.

## D-0019 — Effort is a canvas-side build control

Status: revised and implemented 2026-09-23. Light, Medium, High, and Extra are shown in one compact ChatGPT-style selector beside the shared canvas. Only the owner of a connected room can change effort. A dedicated inference-free mutation re-resolves Recommended under its current mode and spending ceiling, or updates Custom/Advanced allowances while preserving all manual models and participant overrides. Submitted setup snapshots and active builds remain frozen. Disconnected and collaborator views stay visible but read-only with an explanation.

## D-0020 — The durable workflow is the primary shared object

Status: accepted; Phase 1 foundation implemented 2026-09-23. A room owns one logical coordinator and one durable workflow. Documents and generated products are workflow artifacts; model conversations are replaceable. Existing canvas-first decisions remain historical but are superseded where they describe the document or product as the primary object. The existing serialized Developer executor is represented as a durable task before dispatch, with source revision, acceptance criteria, assignment, evidence state, run linkage, and artifact provenance. Ordered events and SQLite projections are authoritative. Compilation alone records unverified evidence. Bounded parallel workers, leases/fencing, scoped approvals, pause/resume/cancel, and control handoff remain future phases and must not be presented as implemented.

## D-0021 — Recover JSON serialization locally without weakening validation

Status: implemented 2026-09-24. Before spending the existing bounded schema-repair call, CoCreate may deterministically normalize raw control characters inside JSON string values, trailing commas, Markdown fences, and a balanced object surrounded by prose. This is serialization recovery, not inference: no keys, values, file operations, or code semantics are invented, and the recovered value must still pass the exact response schema plus existing project path/content validation. An unclosed object/string is classified as probable truncation so the existing compact retry and effort guidance apply even when a provider reports a normal stop. No additional provider retry was added.
## D-0021 — Supabase is the hosted project authority

Accepted 2026-09-24. Supabase Auth provides account identity, Postgres owns project/membership/harness records, and private Storage owns generated artifact blobs. Express/Yjs and the existing agent runtime remain in place. Local SQLite/JSON remains an explicit local-development mode or cache and may not silently take authority after a hosted failure.

## D-0022 — Membership precedes collaboration tickets

Accepted 2026-09-24. A room URL is not authority. The server verifies a Supabase bearer token and current project membership before issuing a five-minute role-scoped collaboration ticket. Viewers cannot update Yjs or invoke mutations. The ticket lifetime is the current bounded revocation window; immediate socket closure on membership removal remains follow-up work.

## D-0023 — Durable acknowledgement follows the remote commit

Accepted 2026-09-24. Hosted clients receive `saved` only after the Supabase snapshot commit. Local memory, a received WebSocket frame, or a SQLite cache write is insufficient. Failures remain visibly unsynced and do not discard the last promoted artifact.

## D-0024 — Keep bearer-token SPA auth instead of adding inactive Next.js middleware

Accepted 2026-09-24. CoCreate remains a Vite SPA with an Express API. Its browser Supabase client persists and automatically refreshes PKCE sessions; the authenticated request boundary refreshes near-expiry sessions and permits one refresh-and-retry on a 401. Express continues to verify bearer JWTs with `@supabase/server`. `@supabase/ssr` may support a future cookie-based SSR host, but Next.js server components, `next/headers`, and middleware/proxy files are not valid runtime entrypoints in this repository and must not be presented as implemented session handling.

## D-0025 — Prisma is not a second migration authority

Accepted 2026-09-24. Prisma 7.10 is pinned as an optional typed Postgres access and introspection layer. Its runtime URL uses Supavisor transaction mode and its CLI URL uses session mode. Cross-schema introspection includes Supabase `auth` only to model public foreign keys, and the managed auth tables/enums are explicitly external to Prisma Migrate. Existing versioned SQL under `supabase/migrations` remains authoritative; no Prisma migration may be applied to the hosted database until an explicit cutover reconciles migration histories, RLS, functions, grants, and Storage policies.

## D-0026 — OAuth callbacks follow the verified Worker origin

Accepted 2026-09-24. The canonical CoCreate production origin is `https://cocreate.susan981314271.workers.dev`. Google returns to the selected Supabase project at `/auth/v1/callback`; Supabase then returns to CoCreate at the separately allow-listed `/api/auth/callback`. Production callback selection is derived from an explicit build-time app origin rather than a hardcoded third-party Pages deployment or browser location. Hosted sign-in fails closed when the URL, key, JWKS, or project references disagree. Localhost remains a separately configured development callback, and callback codes are exchanged at most once.

## D-0027 — Email-bound project invitations remain separate from account invitations

Accepted 2026-09-25. Supabase Auth owns Google and email/password account identity, confirmation, and recovery. CoCreate owns project invitations and membership. Each invitation is project-scoped, recipient-email-bound, role-bounded, expiring, revocable, rate-limited, and stored by token hash; acceptance requires a matching confirmed Supabase account and is transactional/idempotent. Owners and members with explicit sharing permission may manage invitations and non-owner roles, while only owners grant sharing permission. Transactional email is server-side and provider acceptance is recorded as sent without claiming confirmed delivery.

## D-0028 — Low is a presentation label for the existing light effort value

Accepted 2026-09-25. The canvas renders Low, Medium, High, and Extra as an accessible segmented radio group. `light` remains the stored/API value to avoid rewriting snapshots and historical records. Effort changes are inference-free, affect future submissions only, preserve manual assignments and the spending ceiling, and do not mutate active or queued work.

## D-0029 — Persist Yjs as explicit bytes and validate before hydration

Accepted 2026-09-26. Editor, transport, snapshot, and update history use Yjs V1. Supabase `bytea` writes use explicit PostgreSQL hex rather than Node Buffer objects. Stored bytes are decoded by one established path and applied first to an isolated document; arbitrary byte stripping or decoder guessing is forbidden. The exact historical Buffer-JSON defect may be unwrapped only after backing up the original row. Unreadable rows are quarantined, never overwritten, and snapshot recovery may use only individually valid, hash-matching update history.

## D-0030 — Callback failure does not erase or silently use a valid session

Accepted 2026-09-26. OAuth callback processing first resolves persisted session state, exchanges each PKCE code once, and removes sensitive query parameters. Cancellation, missing codes, and rejected/reused codes are distinct from initialization. When a prior valid session survives, CoCreate identifies that account and requires an explicit continue or switch-account action; dismissing an error never authorizes a workspace. Backend membership remains authoritative.

## D-0031 — Count physical provider requests at the HTTP boundary

Accepted 2026-09-26. A user action, workflow run, or combined provider usage object is not the accounting unit. Every outbound provider HTTP attempt receives a unique call ID and records dispatch intent, purpose, retry reason, frozen configuration/pricing references, timing, outcome, provider request ID when available, and normalized usage. Transport retries and structured-output repairs are separate calls. Setup tests are displayed separately from generation, unknown usage is not coerced to zero, and prompt/document/credential content is excluded from the ledger.

## D-0032 — Developer-only managed default with preserved Advanced settings

Accepted 2026-09-27; supersedes D-0019 and earlier three-mode/default-BYOK presentation decisions for new hosted projects. Developer is the only activatable workflow. New projects preselect a managed shared builder with a fixed economical interpreter. Normal setup has one Builder selector and no effort control. Existing BYOK projects remain unchanged until explicit owner opt-in, and returning to managed retains custom settings. Researcher/Analyst history is readable but cannot be newly activated.

## D-0033 — Founder funding is an explicit project authorization

Accepted 2026-09-27. The hosted account/project funding row and owner-authorized spender row are distinct from invitation membership. A physical managed request requires membership, configured server credential, positive credit or bounded allowance, spending/concurrency limits, atomic reservation, and durable reconciliation. Unknown provider outcomes keep the reservation. Managed and BYOK never silently fund one another. Credit starts at zero; checkout is separate. Migration and live billing tests remain pending.

## D-0034 — Curated builders and measured qualification

Accepted 2026-09-27. The versioned server allowlist has no more than 15 enabled exact IDs. Gemini 3.8 Flash remains the provisional default, DeepSeek V4.1 Flash the budget featured choice, and Claude Sonnet 5 the higher-capability candidate. Published metadata is not a quality ranking. The managed interpreter is provisionally DeepSeek pending comparative tests against GPT-6 Luna and Qwen3.8 Flash. Model/configuration/rate policy freezes per submission. A repeatable fixture and scoring gate exist; paid comparative results have not been run.

## D-0035 — Device recovery complements durable shared authority

Accepted 2026-09-28. Use participant-scoped IndexedDB for document recovery and short transport batching for edit bursts. Keep cloud records authoritative for permissions, accepted intent, tasks, artifacts and credits. Do not acknowledge a cloud save from a local transaction. Local recovery requires a valid room session; full offline startup and cache retention controls are not claimed.

## D-0036 — Calm workspace with restrained original comic motion

Accepted 2026-09-28. The latest user directive supersedes earlier visual restrictions: dark neubrutalist framing, lavender/lime accents and brief original action effects with reduced-motion support. No copied artwork or animation packs. Workflow presents durable task/evidence state; setup remains available without interrupting the canvas.

## D-0037 — Invitation retries preserve all prior links and roles

Accepted 2026-09-30. The earlier revoke-on-retry migration was rejected and never applied. A new request ID identifies one creation or resend; a replay returns its encrypted token and uses the same provider idempotency key. A deliberate resend creates another link without revoking earlier pending links. Acceptance preserves existing member roles. No migration deletes invitation, membership, or delivery rows. Unbound legacy links previously revoked for recipient security are not resurrected.

## D-0038 — Physical usage has an explicit coverage boundary

Accepted 2026-09-30. Deduplicate dispatch/reconciliation by call ID in the local event store and hosted Postgres ledger. Backfill only the recent provider calls actually retained in hosted snapshots. Display the older generation counter separately, never add it to the physical-call total, and mark coverage partial until historical source data is reconciled. Unknown provider usage remains unknown.

## D-0039 — Conflict choices require current authority and revision

Accepted 2026-09-30. Only a current owner/editor who is an affected contributor can select. Require the current group revision and decision timestamp, serialize room choices, reuse request IDs for retries, reject stale submissions with 409, and acknowledge only after persistence. Do not treat browser controls as an authorization boundary or an in-memory queue as a distributed lease.

## D-0040 — Visible rename and fixed shortcut

Accepted 2026-09-30. User-facing identity is 2guys1canvas; CoCreate technical identifiers remain for compatibility. D-0009's optional disable/remap UI is superseded: the fixed editor-focused mapping is Alt+X on Windows/Linux and disabled on macOS. The button and shortcut retain the same authenticated submission path.

## D-0041 — Usage and Shared Intent display

Accepted 2026-09-30. Detailed build, call, and setup usage is in Workflow; a separate canvas card displays recorded generation plus setup tokens. Physical usage keeps partial historical coverage explicit. Shared Intent keeps accepted requirements, proposals, conflict alternatives, disagreements, sources, and decision history reachable.

## D-0042 — Bounded recovery and durable collaboration receipts

Accepted 2026-10-01 from this user's explicit request. Whole-project output exhaustion decomposes into at most eight coherent one-file tasks with durable source checkpoints and one 24-physical-call executor ceiling shared across recovery, retries and superseded candidates. Configured spending, context capacity and provider completion limits stay separate. Never increase effort as unverified output-limit advice. Failed candidates retain the last compiled artifact.

Capture only authenticated participant steering, serialize acceptance in durable capture order, persist draft batches and replay receipts, and acknowledge immutable canonical snapshots with insertion AND deletion receipts. Local owner epochs and prepared service-role Postgres fencing reject stale promotion. Reconnect does not trigger inference. Shared context returns to Canvas with selected durable accepted revision snapshots and separate partial usage. This supersedes earlier no-canvas-sidebar and no-recovery-call-ceiling statements; BYOK still never falls back to managed credit. Missing screenshot, live SQL and hosted-account verification remain explicit limitations.

## D-0043 — Smaller feature context and advisory cleanup judgments

Accepted 2026-10-04 through the user's explicit cleanup instruction. Preserve canonical current steering and linked dated history, make browser/shared/server source boundaries explicit, and remove only source-verified inactive scaffolding. Keep coordinator authority, public runtime contracts, migration histories and supported compatibility APIs. Graphify retrieves relationships; static checks and verification establish implementation facts. Offline Jev typed judgments are advisory development tooling and cannot authorize deletions, provider dispatch or promotion. No Jev calls are added to participant writing/submission. Refactor readable modules in bounded changes with characterization checks and a feature scope packet.

## D-0044 — Vercel credentials route through AI Gateway

Accepted 2026-10-04 after the user identified the supplied key as Vercel-issued. The offline audit uses AI_GATEWAY_API_KEY with Vercel's TypeSafe-compatible endpoint and typesafe-ai/jev ID. Direct TypeSafe remains explicit with its own TYPESAFE_API_KEY and pinned model. Never send a gateway credential to the direct provider, silently fall back, or describe a gateway alias as a pinned underlying model. Isolate caches by provider/endpoint and expire alias answers after 24 hours. Record returned gateway costs alongside conservative estimates and unknown outcomes. A successful 20-file triage is not proof of safe deletion or feature-context recall.
