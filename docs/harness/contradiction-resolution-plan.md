# Collaborative contradiction-resolution plan

Recorded: 2026-09-18. This plan is additive to the canonical architecture and checklist.

## Migration

1. Add durable `ConflictGroup` records to the existing room snapshot; do not create a second requirement registry.
2. On load, preserve existing pairwise `Contradiction` records by converting them into conflict groups using their referenced shared requirements and sources. Continue exposing a derived legacy contradiction view until the UI/API migration is complete.
3. Group accepted alternatives by deterministic subject and scope. A material alternative change increments the group revision and resolution round, archives the earlier choices, and clears current confirmations.
4. Derive builder eligibility from the shared requirement registry plus unresolved conflict groups. Never delete an idea to make it ineligible.

## Server contracts

Planned participant-authenticated mutations:

- `POST /api/rooms/:id/conflicts/:groupId/selections` with `{revision, alternativeId | "reject_both", requestId}`.
- `POST /api/rooms/:id/conflicts/:groupId/alternatives` with `{revision, description, requirementIds?, requestId}`.
- `POST /api/rooms/:id/conflicts/:groupId/reopen` with `{revision, requestId}`.

Selections will use the authenticated participant ID, reject stale revisions, be idempotent by request ID, and broadcast the resulting `RoomView`. The first implementation slice establishes and tests the domain rules and durable migration before exposing these mutations.

## UI

Add “Decisions needed” directly below Shared intent and a separate “Disagreements” section. Cards will show every faithful alternative, contributor attribution, pending/responded participants, and explicit selection controls. Later editor decorations will use source passages without modifying Yjs document content; missing anchors will fall back to excerpts and source revisions.

## Acceptance tests

The first slice covers deterministic same-subject color grouping with two and three alternatives, compatible different subjects/conditions, proposal exclusion, explicit unanimous resolution, disagreement, pending/offline participants, stale revision rejection, idempotent submissions, legacy migration, restart recovery, and unresolved-requirement builder exclusion. Later slices add authenticated endpoint tests, live synchronization, compromise flows, decoration integrity, and three-session browser checks.
