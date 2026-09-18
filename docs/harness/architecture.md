# Harness architecture

## Source of truth

`data/cocreate.sqlite` is the transactional source for new harness records on the local single-server deployment. The append-only `events` table provides a per-workspace sequence, actor, run/step IDs, correlation and causation fields, schema version, input revision, content hash, and payload/artifact reference. Large Yjs updates and complete workspace snapshots are content-addressed in `artifacts`. `workspace_state` and `run_state` are replaceable derived views.

Every workspace save writes the immutable snapshot artifact, event, and current view in one SQLite transaction. If the current workspace view is absent, it can be reconstructed from the newest snapshot artifact in event order. Yjs update artifacts and their attribution event are also transactional. Event payloads redact sensitive-key fields; provider secrets enter persistence only after authenticated encryption in the existing room state.

Legacy `data/<room>.json` files remain compatibility backups during migration. A legacy room is copied to `data/backups/pre-event-store/` before its first lazy import. New saves dual-write the database first and the JSON compatibility file second. Generated projects are not moved or erased.

## Execution flow

```text
authenticated Yjs edit
  -> document.update_recorded + hashed update artifact
  -> debounced personal interpretation
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

This architecture is reliable only where `data/` and `generated/` reside on persistent storage. Local/server deployments meet that condition. The current Cloudflare Container image does not yet provide a persistent volume or bridge application records into Durable Object storage, so container replacement can lose state. That is a documented production blocker rather than a silent fallback.
