# Harness architecture

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

The latest 50 `AIRunRecord` values persist in room state without prompts, document contents, or credentials. Each call retains its rate/source/version snapshot so later catalog changes do not rewrite historical estimates. Run totals include failed attempts and repairs. New effectiveness groups compare model configuration, workflow mode, effort, deterministic complexity, and verification-policy version; legacy records continue grouping by their stored specialty. UI metrics require at least three comparable runs; no verified successes render “Not enough data,” never $0. Compilation is recorded separately and does not make `verified` true.

This remains an enforceable estimate, not a provider invoice, credit ledger, or tax accounting system. Unsupported cache prices are absent rather than zero; provider/account-specific fees and usage categories remain explicit uncertainty. Recoverable references to omitted context remain a work item. Cache by source/specification/model-policy version where safe; unchanged drafts and unchanged eligible fingerprints should not create extra inference. Never silently switch models to meet a budget.

## Collaboration connection lifecycle

The browser owns one generation-guarded WebSocket provider per mounted workspace. It distinguishes initial connection, confirmed connection, transient reconnect, and terminal authentication/room/permission failure. An authenticated state read disambiguates the browser's otherwise opaque failed-upgrade event. Transient retries use capped exponential backoff with jitter; provider disposal invalidates stale handlers, clears its timer, rejects outstanding flushes, and removes Yjs/awareness listeners.

Edits remain in the in-memory Y.Doc while disconnected and are offered after the server sends its state vector. “Saved” means the server emitted a saved acknowledgement; disconnected edits are labeled unsynced. A flush that loses its socket cannot cross into the submission endpoint, so reconnect handling itself never invokes a model. This is session recovery, not durable offline storage.

The Node upgrade handler returns explicit 401/404 responses where the transport exposes them and emits safe structured categories with correlation IDs. Cloudflare continues to use the native Container `fetch()` proxy. Container-local SQLite and generated files remain ephemeral across replacement; the observed production failure did not provide enough room/session identity to prove replacement as its trigger, so durable hosted persistence remains a separate unfinished requirement.
