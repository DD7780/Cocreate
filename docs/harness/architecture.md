# Harness architecture

## Workflow-first implementation map

CoCreate now treats each room as one durable workflow. `workflow_state` is the current workflow projection, `task_state` is the dependency-ready task projection, `events` remains the ordered append-only audit stream, `workspace_state` remains a replaceable room snapshot, `run_state` records executor attempts, and `artifacts` stores content-addressed snapshots and Yjs updates. These are additive projections in the existing SQLite source of truth, not a second event store.

Implemented Phase 1 slice:

- Room creation initializes one versioned workflow; the first room owner becomes its initial controller without transferring separate spending authority.
- Authenticated submissions queue the workflow. The existing Developer executor is wrapped in one durable task with source specification revision, assigned shared executor, acceptance criteria, evidence state, run ID, and promoted artifact version.
- Workflow and task transitions are validated and recorded as ordered events. Compilation yields `unverified` evidence rather than a false functional-verification claim.
- Restart interrupts nonterminal runs and matching tasks, then moves the workflow to `awaiting_input`; it never invents success or automatically repeats external work.
- `RoomView.workflow` gives late joiners a consistent workflow/task/artifact snapshot plus a safe recent activity window and cursor. The authenticated cursor endpoint retrieves later safe activity without returning event payloads, secrets, document contents, or chain-of-thought.
- The existing UI renders this durable overview, task plan, live activity, and artifact verification state beside the collaborative brief.

Not implemented in this slice: role migration beyond owner/controller identity, steering-command schemas beyond the existing authenticated submission path, pause/resume/cancel commands, control handoff, approval mutations, dependency scheduling, isolated concurrent workers, durable leases/fencing, deployed external artifact storage, and Analyst/Researcher tools. The current executor remains serialized. These gaps must not be simulated in the UI.

## Evidence-based routing boundary

`server/ai-presets.ts` is the single versioned model/rate catalog and deterministic resolver; `server/ai-accounting.ts` applies those frozen rates to normalized usage and comparable run groups; `server/ai-evaluation.ts` is the versioned benchmark protocol. Specialty is an evaluation and prompt dimension, not permission to invent a model advantage. The resolver uses one owner-selected connection by default, passed capabilities, effort allowances and remaining budget. Active runs freeze the result. Promoted versions record effective models, routing reason and versions, call-level pricing snapshots, token/cost usage, latency, and which verification gates actually ran.

## Connection and managed-access boundary

The implemented connection source is owner-provided BYOK (plus owner-hosted Ollama). The persistent API connections control leads with Recommended setup and explains that the owner's checked API models power it; Advanced remains a prominent round-trip to named-connection management. Saving encrypts credentials server-side; safe room state exposes only `hasCredential`, connection/model metadata, checks, and status. Model discovery is optional. An exact manual model ID can be checked. The explicit check performs authentication/reachability, basic text, interpreter structured-output, and current Developer project-operation requests; opening or editing settings never triggers inference. Collaborators are read-only.

Platform-managed AI is a separate future credential and billing domain, not another browser-supplied endpoint. It must remain feature-disabled until account authentication distinct from participant identity, owner-selected billing authorization, account/room quotas, concurrency and size limits, atomic reservations, uncertain-charge retention, and an auditable ledger exist. Managed credentials belong only in deployment secrets and must never enter room state, client bundles, logs, or generated output. There is no silent BYOK/managed fallback.

The mode contract exposes exactly Developer, Analyst, and Researcher while preserving n personal interpreters plus one shared executor. Developer reuses the current project executor. Researcher is unavailable until controlled retrieval, source capture, and evidence-validated report artifacts exist; Analyst is unavailable until validated data ingestion and genuinely isolated reproducible computation exist. Mode selection changes the shared executor workflow/tool/output/verification policy, not the number of permanent agents. Unavailable modes never fall through to Developer or host-side simulation.

## Source of truth

`data/cocreate.sqlite` is the transactional source for new harness records on the local single-server deployment. The append-only `events` table provides a per-workspace sequence, actor, run/step IDs, correlation and causation fields, schema version, input revision, content hash, and payload/artifact reference. Large Yjs updates and complete workspace snapshots are content-addressed in `artifacts`. `workspace_state` and `run_state` are replaceable derived views.

Every workspace save writes the immutable snapshot artifact, event, and current view in one SQLite transaction. If the current workspace view is absent, it can be reconstructed from the newest snapshot artifact in event order. Yjs update artifacts and their attribution event are also transactional. Event payloads redact sensitive-key fields; provider secrets enter persistence only after authenticated encryption in the existing room state.

Legacy `data/<room>.json` files remain compatibility backups during migration. A legacy room is copied to `data/backups/pre-event-store/` before its first lazy import. New saves dual-write the database first and the JSON compatibility file second. Generated projects are not moved or erased.

## Execution flow

```text
authenticated Yjs edit
  -> document.update_recorded + hashed update artifact
  -> participant draft (no model call)
  -> explicit Build my changes submission
     - WebSocket flush acknowledgement includes the final edit
     - authenticated edit sequence IDs + document revision + immutable snapshot
  -> participant-scoped personal interpretation
  -> classified, source-referenced personal interpretation
  -> stable shared-requirement reconciliation
     - proposals/questions/ambiguities remain proposed
     - explicit requests and decisions become accepted
     - explicit withdrawals remove only the contributor's support
  -> deterministic contradiction scan
     - same subject + scope alternatives -> one revisioned conflict group
     - unresolved alternatives are excluded; independent accepted work stays eligible
     - required resolvers remain pending until each submits an explicit choice
  -> requirement.registry_reconciled + workspace snapshot
  -> builder run queued -> executing
     - immutable specification revision and accepted requirement IDs recorded
     - raw canvas and proposed intent excluded from builder context
  -> tool.requested -> tool.authorized -> tool.started -> tool outcome
     - project.apply_operations
     - project.bundle
  -> run.verifying
  -> latest-revision guard
  -> audited project.promote
  -> product.promoted snapshot
  -> run.ready
```

A compile failure records the tool failure and moves the same run through `repairing` back to `executing`, with at most three attempts. A superseding revision cancels the old run before promotion. Server recovery changes nonterminal persisted runs to `interrupted`; it never invents success or automatically repeats the operation.

## Shared intent registry

Personal-agent output is a proposal to the shared registry, never direct builder authority. Each interpretation records a classification, affected requirement IDs, document revision, authenticated edit sequence numbers, and short source passages. Shared requirement IDs are deterministic from normalized intent and do not depend on collaborator or canvas position. Each requirement carries a revision, status, acceptance criteria, authority, and contributor sources.

Classifier version `intent-v2` represents each distinct intent separately rather than applying one batch label to every extracted item. The structured output and deterministic normalization retain category, classification, rationale, exact source passage, participant, revision, and edit sequence attribution per intent. Direct commands, polite action requests, stated wants/needs, and negated requirements are explicit requests; optional or hypothetical ideas are proposals; informational requests are questions; recorded settled choices are decisions; genuinely unclear text is ambiguity. Quotes and examples are not accepted merely because they contain an imperative. Missing or invalid labels fail closed to ambiguity. Mixed contributions therefore can add an accepted request, retain a proposal, and surface a question in one pass without contaminating builder input.

Existing persisted classifications are not globally rewritten. A participant can explicitly reinterpret their latest contribution: the server reuses its authenticated source edits, runs the same current classifier, supersedes only the old interpretation's sources, preserves stable requirement IDs and other contributors, and appends an `interpretation.reinterpreted` snapshot event. Decisions and explicit withdrawals require a human correction instead. Reinterpretation schedules generation only when the eligible accepted-requirement fingerprint changes.

The current precedence rule is deliberately conservative: explicit requests and recorded decisions are accepted automatically; proposals, questions, and ambiguity are retained but never sent to the builder. Deleting canvas text is not a withdrawal. A withdrawal must be explicit, and it removes only that collaborator's source; a requirement supported by another collaborator remains accepted.

The builder receives an immutable snapshot of eligible accepted requirements only. Build fingerprints ignore attribution-only refreshes, so an unchanged interpretation or a proposal does not spend a builder request. Unresolved alternatives are excluded while independent accepted requirements remain eligible. If nothing eligible remains, the builder defers and preserves the last working preview. Promotion rechecks the eligible-requirement fingerprint so a candidate created before a new conflict cannot publish disputed behavior.

Conflict groups are stable by subject and scope and can contain two or more alternatives. Each revision records requirement IDs/revisions, faithful labels, contributor sources, required resolvers, explicit selections, resolution round/history, state, and affected build scope. A changed alternative creates a new revision/round and clears current confirmations while preserving history. Deterministic rules—not a model—keep missing responses pending, resolve unanimous selections, and classify completed differing selections as disagreement. Participant-authenticated mutation endpoints and the decision UI are the next slice.

## Policy boundary

The typed registry describes purpose, input/output shape, read/write behavior, permission, execution environment, timeout/resource limits, retry/idempotency, logging, and cancellation behavior. Current generated-project tools allow only the shared builder in the current workspace. Personal agents and unknown tools are denied before execution. Tool events contain paths, counts, hashes, and safe errors—not source bodies or provider credentials.

This is an application policy boundary, not yet a process security boundary. The declared environment is `host-process-restricted-api` to avoid falsely labeling it isolated. A later phase must place build/test/preview execution in a real sandbox without provider credentials or host filesystem access.

## Recovery and consistency

- SQLite uses WAL, foreign keys, an immediate transaction for ordered event writes, and a unique `(workspace_id, workspace_seq)` constraint.
- Legal run transitions are enforced in code. Terminal states cannot return to execution.
- The latest successful version remains in the workspace snapshot until a newer verified candidate is promoted.
- JSON write failure after a committed database transaction does not invalidate the database record; JSON is a rollback aid, not the primary source for migrated rooms.
- The current one-process builder promise remains the local active-run coordinator. A durable lease is still required before multiple server instances are supported.

## Retention and privacy

The MVP retains events and content-addressed artifacts indefinitely; snapshots are deduplicated by SHA-256. No automatic destructive retention job exists. Future pruning must first preserve a reconstructable checkpoint and be an explicit audited migration. Private model reasoning is not stored; concise structured outputs, state snapshots, decisions, errors, hashes, and tool outcomes are stored.

## Deployment constraint

This architecture is reliable only where `data/` and `generated/` reside on persistent storage. Local/server deployments meet that condition. The Cloudflare Worker uses the native `Container.fetch()` proxy for both HTTP and WebSocket traffic, a container application-health endpoint, and encrypted Worker secrets passed as container environment variables. The current Cloudflare Container image still does not provide a persistent volume or bridge application records into Durable Object storage, so container replacement can lose state. That is a documented production blocker rather than a silent fallback.

## Submission scheduling: current implementation and required hardening

Source audit, 2026-09-19: `submitChanges` persists the caller's edit sequence IDs, participant revision, document snapshot, previous interpretation reference, request ID and lifecycle status. It invokes the personal interpreter immediately; the three-second scheduling window is a builder debounce, not a durable closed-batch barrier. Submissions are retained in room state with a last-200 limit. Idempotency is therefore bounded by retained records, not permanent. Persisted submissions do not yet establish automatic safe queue resumption after restart.

Two authorization/context gaps remain: the captured snapshot comes from the shared document, so another participant's draft can be present as personal-model context even though only the caller's edit records are submitted; the legacy `/build` endpoint calls `buildNow`, which flushes all participants' pending drafts. The active UI uses `/submit`, but UI behavior alone does not enforce the intended boundary. Close or explicitly restrict legacy mutation paths, validate interpreted sources against submitted edits, and use scoped reference context before claiming end-to-end draft isolation.

Target hardening: persist submission-to-batch-to-run membership, freeze source/specification revisions, collect completed eligible interpretations deterministically, and queue later submissions without mixing them into an active run. Recover pending/interrupted work from records with bounded retries, stable deduplication keys and an eventual durable per-room lease. Revalidate promotion against relevant accepted input. Never manufacture success from a persisted `queued` label.

## Bounded context and cost target

The n personal agents are logical participant identities, not n permanently running model sessions. One logical builder reconstructs each request from durable accepted requirements, unresolved-conflict exclusions, relevant project files and concise verification evidence. Storage and context are separate: records may outlive a model session, but stored records must not all be injected into its next request.

Recommended setup is resolved server-side from the versioned canonical catalog in `server/ai-presets.ts`. A candidate is eligible only when an owner connection contains the exact model ID and the existing reachability, text, and role-specific schema checks passed. Resolution prefers one connection and never silently changes provider or data destination. Existing explicit assignments remain Custom.

Each recommended configuration records workflow mode, effort, exact personal/shared-executor layers, separate input/output/reasoning allowances, repair ceiling, preset/pricing versions, an explicitly scoped one-pass maximum, completeness, and a user spending limit. Submission records freeze the personal assignment and policy; executor runs freeze their resolved configuration and include it in run events. Legacy active coding presets gain `workflowMode: developer` during normalization without altering their resolved layers, assignments, credentials, effort, overrides, or spend ceiling. Historical `AIRunRecord.specialty` values remain readable and are not rewritten. Conservative reservations assume no cache hits and are serialized in the room snapshot before dispatch. Provider-normalized input, cached input, cache writes, output, and separately available reasoning usage reconcile the reservation. Reasoning included in output is never counted twice. Missing usage and timeouts retain an uncertain reservation. A shared executor call is recorded once regardless of participant count; interpretation, builder, and repair calls remain distinct.

Hosted Yjs persistence uses the V1 update format throughout the editor, WebSocket discriminator-0 frames, snapshots, and update history. PostgreSQL `bytea` writes are explicit `\\x` hex strings rather than Node Buffers, preventing PostgREST from serializing `{type:"Buffer",data:[...]}` text. The reader recognizes only PostgreSQL hex, byte arrays, or the exact legacy Buffer envelope, validates each decoded update in an isolated `Y.Doc`, and refuses to hydrate invalid bytes. Original invalid/legacy bytes are copied into the server-only `project_persistence_quarantine` table before recovery. A corrupt snapshot may recover only by replaying individually decoded, SHA-256-matching updates; failed records stay quarantined and other projects remain unaffected.

The browser auth callback is a single-flight PKCE state transition. It restores the current session before handling callback errors, removes code/error parameters with `history.replaceState`, and never conflates initialization with an expired link. A surviving session after a cancelled or reused callback is presented with explicit Continue-as-account and Switch-account actions. Project list, ticket issuance, HTTP mutation, and WebSocket upgrade authorization continue to be enforced by server-verified identity and membership.

The spending limit is an aggregate safety ceiling and never becomes a per-call token control. The canonical effort table gives Developer executor outputs of 8K / 12K / 20K / 32K. Recommended stores resolved budgeted layers; Advanced stores the chosen effort (default Medium) and derives the same input/output ceilings at dispatch without changing its manual models or overrides. Advanced Medium retains its established three builder attempts because it has no Recommended reservation policy; Light reduces that retry ceiling. Each submission snapshots its setup before interpretation and each build freezes it again, so a later canvas change affects future work only. Structured parsing first applies a deterministic, non-inference normalization limited to raw newline/tab/carriage-return characters inside JSON strings, trailing commas, fenced output, and a balanced object surrounded by prose; the normalized value must still pass the unchanged exact schema and project-operation validators. An unclosed JSON envelope is treated as probable truncation even when a provider incorrectly reports a normal stop, and receives the same single compact retry. Provider-reported usage from both attempts is retained. A second failure remains explicit without increasing the frozen effort allowance or silently switching models/providers.

The latest 50 `AIRunRecord` values persist in room state without prompts, document contents, or credentials. Each call retains its rate/source/version snapshot so later catalog changes do not rewrite historical estimates. Run totals include failed attempts and repairs. New effectiveness groups compare model configuration, workflow mode, effort, deterministic complexity, and verification-policy version; legacy records continue grouping by their stored specialty. UI metrics require at least three comparable runs; no verified successes render “Not enough data,” never $0. Compilation is recorded separately and does not make `verified` true.

This remains an enforceable estimate, not a provider invoice, credit ledger, or tax accounting system. Unsupported cache prices are absent rather than zero; provider/account-specific fees and usage categories remain explicit uncertainty. Recoverable references to omitted context remain a work item. Cache by source/specification/model-policy version where safe; unchanged drafts and unchanged eligible fingerprints should not create extra inference. Never silently switch models to meet a budget.

## Responsive delivery and synchronization

Hosted authentication and project navigation load independently from the editor/Tiptap/Yjs workspace chunk. Opening a workspace lazily loads that secondary code and then establishes one project-scoped provider. The WebSocket is the sole successful initial room-state/document path; HTTP state reads are reserved for diagnosing failed reconnects.

Document edits use incremental Yjs frames. The server records each authorized edit, schedules its durable snapshot acknowledgement, and forwards the incremental frame without broadcasting an otherwise unchanged full `RoomView`. Workflow, participant, permission, AI, decision, and build transitions still broadcast authoritative room state. This isolation removes React-wide state updates from the keystroke path without weakening persistence or submission boundaries.

Performance evidence is kept in `docs/harness/responsiveness.md`. Engineering samples must identify environment, data size, participants, count, and cold/warm condition; they are not production percentiles. Provider queue and execution timings remain separate from interface responsiveness and require authorized representative runs.

## Collaboration connection lifecycle

The browser owns one generation-guarded WebSocket provider per mounted workspace. It distinguishes initial connection, confirmed connection, transient reconnect, and terminal authentication/room/permission failure. An authenticated state read disambiguates the browser's otherwise opaque failed-upgrade event. Transient retries use capped exponential backoff with jitter; provider disposal invalidates stale handlers, clears its timer, rejects outstanding flushes, and removes Yjs/awareness listeners.

Edits remain in the in-memory Y.Doc while disconnected and are offered after the server sends its state vector. “Saved” means the server emitted a saved acknowledgement; disconnected edits are labeled unsynced. A flush that loses its socket cannot cross into the submission endpoint, so reconnect handling itself never invokes a model. This is session recovery, not durable offline storage.

The Node upgrade handler returns explicit 401/404 responses where the transport exposes them and emits safe structured categories with correlation IDs. Cloudflare continues to use the native Container `fetch()` proxy. Container-local SQLite and generated files remain ephemeral across replacement; the observed production failure did not provide enough room/session identity to prove replacement as its trigger, so durable hosted persistence remains a separate unfinished requirement.
## Supabase identity and persistence boundary (2026-09-24)

- Supabase Auth is the hosted identity authority. The Vite client uses Google OAuth with PKCE and `@supabase/supabase-js` automatic session refresh; authenticated project requests proactively refresh near expiry and make at most one refresh-and-retry after a 401. The Express runtime verifies bearer JWTs with `@supabase/server`, pinned to the configured issuer, `authenticated` audience, and JWKS. `@supabase/ssr` is installed but is not the active auth transport because this repository has no Next/server-component cookie runtime.
- OAuth has two deliberately distinct return boundaries. Google returns to Supabase at `https://dnsapasubeoxxsgkiotw.supabase.co/auth/v1/callback`; Supabase returns the browser to CoCreate at `${VITE_COCREATE_APP_ORIGIN}/api/auth/callback`. The production origin is the verified Worker `https://cocreate.susan981314271.workers.dev`; localhost is an explicit development origin, never a production fallback. Wrangler runtime variables configure the server, while container `image_vars` inject the public `VITE_` values before Vite compiles the browser bundle. Missing, malformed, or cross-project values disable hosted sign-in.
- Postgres is the hosted authority for projects, memberships, invites, ordered document updates, snapshots, workflows, tasks, runs, events, model references, usage, and artifact metadata. The existing SQLite event store is a local-development store or reconstructable hosted process cache, never an automatic hosted fallback.
- A project session endpoint verifies the account and membership, rehydrates the room without inference, and issues a five-minute HMAC ticket scoped to project, account, and role. The browser refreshes it before expiry. Viewer document updates and all non-GET room commands are denied server-side. Ticket expiry bounds stale access; future membership administration should also close sockets immediately.
- A hosted `saved` acknowledgement is emitted only after the versioned Supabase snapshot commit. A failed remote write emits `save-error` and remains unsynced. Ordered Yjs updates are idempotent by project/sequence and content hash.
- `cocreate-artifacts` is private. Artifact rows use pending/finalized/failed states; immutable upload and hash verification precede metadata finalization. Preview and download routes require a scoped project ticket and generated previews retain their sandbox/CSP boundary.
- The client receives only the Supabase URL and publishable key. `SUPABASE_SECRET_KEY` is server-only and must never use a `VITE_` prefix.
- Prisma 7.10 is configured as a pinned Postgres access/introspection layer. Runtime connections use the Supavisor transaction pooler through `DATABASE_URL`; CLI introspection uses the session pooler through `DIRECT_URL`. Cross-schema foreign keys require `public` and `auth` during introspection, but Supabase-owned auth tables and enums are external to Prisma Migrate. The existing `supabase/migrations` history remains authoritative until a deliberate, verified migration-authority cutover; adding Prisma does not create a second accepted schema history.

### Authentication, project naming, and sharing extension (2026-09-25)

- Google PKCE and email/password share the same Supabase identity/session boundary. Email confirmation and recovery return through the application callback with a validated local destination; application code never stores passwords.
- Project titles remain fields on the existing stable project row. Creation and owner-only rename trim and validate 1–120 characters; polling refreshes title changes for other participants without inference or route changes.
- `project_members.can_share` is an explicit capability. Owners always share; permitted members may invite, resend, revoke, and change non-owner editor/viewer roles. Only owners may grant/revoke `can_share`, and the owner role cannot be changed through this API.
- `project_invites` records normalized recipient email and delivery metadata. Security-definer database functions serialize create/resend/accept checks; active recipient uniqueness, row locking, expiration/revocation checks, confirmed-email matching, and `(project_id,user_id)` membership uniqueness make acceptance idempotent.
- Resend is the transactional email adapter. `RESEND_API_KEY` and `COCREATE_EMAIL_FROM` remain server-only; `COCREATE_PUBLIC_ORIGIN` constructs canonical invitation URLs. A deterministic provider idempotency key is derived from the invitation ID. Unconfigured or rejected delivery is persisted and shown rather than treated as successful.
