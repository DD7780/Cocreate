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
  -> requirement.interpretation_recorded + workspace snapshot
  -> builder run queued -> executing
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
