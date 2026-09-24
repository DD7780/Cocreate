# Harness decision log

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
