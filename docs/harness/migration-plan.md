# Harness migration plan

## Safe rollout

1. Create `data/cocreate.sqlite` with additive, versioned schema migrations. Do not modify existing room JSON or generated projects.
2. On first access to a legacy room, copy its JSON to `data/backups/pre-event-store/<room>.json`, then transact an immutable snapshot artifact, import event, and current view.
3. Treat SQLite as authoritative for an imported/new room. Continue atomic JSON writes after each committed database save as a compatibility rollback aid.
4. Mark persisted nonterminal runs `interrupted` when a room is reconstructed. Require explicit orchestration logic in a later phase to reconcile or resume; do not replay side effects automatically.
5. Add typed/audited tool routing incrementally. Preserve the existing provider, collaboration, validation, preview, and generated-project formats.
6. On room load, normalize legacy personal summaries as explicit requests and derive the initial shared registry without deleting or rewriting the compatibility snapshot. Persist the registry, contradictions, and specification revision additively on the next save.

## Rollback

Stop the server before rollback. Preserve `data/cocreate.sqlite*` and `data/backups/`; do not delete them. The compatibility JSON files can be read by the pre-migration application, and generated projects remain in their original paths. Changes recorded only after a JSON compatibility write failure may exist only in SQLite and must be exported before running the old application.

## Later migrations

- Add approval records and normalized action hashes before any approval-gated tool is enabled.
- Move the snapshot-backed requirement registry into normalized SQL projections and add full replay tests. The additive shared registry and restart migration now exist, but are not separate database views.
- Replace in-process coordination with a durable per-workspace lease before horizontal scaling.
- Move build/test/preview tools into a real sandbox and add resource cancellation enforcement.
- For Cloudflare production, select and test a durable application store. Do not call container-local SQLite durable until persistence across container replacement is demonstrated.
- Introduce retention only after checkpoint/replay verification and a backup/restore drill.
