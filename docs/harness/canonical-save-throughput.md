# Canonical save throughput — 2026-10-17

## Bounded change packet

Outcome: the reported project repeatedly times out before Build my changes can submit. Keep the 15-second client limit and mandatory canonical save, but prevent routine collaboration/persistence work from creating an ever-growing queue in front of that acknowledgement. The previous recovery change surfaced the error; it did not fix the production queue.

Evidence: read-only inspection of the user-designated project found a 387-byte document, a 302,200-byte harness snapshot and 503 retained edits. Snapshot revision 988 committed at 03:46:07 UTC after capture at 03:44:51 UTC, about 77 seconds behind. Supabase logs also report 48 conflicting document-update sequences during 03:30–03:47 UTC. Source serializes full autosave snapshots, each incoming and outgoing WebSocket packet's remote permission checks, and update-journal appends ahead of flush. A restored snapshot can allocate sequence numbers already used by its newer journal tail. No production rows or deployment settings were changed by inspection.

Scope: `server/rooms.ts`, `server/room-state.ts`, `server/index.ts`, `server/supabase-platform.ts`, focused queue/restore/hosted tests and affected canonical guidance; existing release attestation and Graphify refresh. Public submission/flush shapes and client timeout stay unchanged. No migration, new dependency, hosted data repair, permission cache, paid inference or Cloudflare inspection.

Contracts: coalesce only routine document autosaves; consequential command/accounting/promotion writes keep their ordered receipts. Flush waits for its complete canonical snapshot, not the separate append-only recovery journal, and never acknowledges a failed canonical commit. Authorize bounded, ordered WebSocket batches immediately before synchronous apply/delivery; no permission result is reused across batches. Preserve revocation, role/expiry checks, coordinator fencing, caller-only capture, inference-free editing, immutable artifacts, save receipts and uncertain command IDs. Restore the journal high-water sequence before allocating new edits; never overwrite conflicting historical rows.

Verification: first reproduce queued autosaves, blocked journal/flush, slow permission bursts and snapshot/journal sequence skew. Verify bounded queue work, snapshot/deletion coverage, no submission before commit, fresh authorization/revocation, ordered delivery and retained data on failure. Then existing provider/submission, hosted membership, receipt, coordinator, artifact and accounting regressions; strict build and boundaries; controlled browser build submission using synthetic provider/identity only. Full production-image CI is separate from local Windows isolation limitations. Update source attestation and push to main; stop at GitHub publication as requested.

## Results

Implementation and regression evidence pending.
