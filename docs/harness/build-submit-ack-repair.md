# Build submission acknowledgement repair — 2026-10-23

## Live follow-up: the first repair was incomplete

PR #12 is live as main `d309700` / Worker `9b82438e-c6ea-47da-a072-092dccfb1ef4`. Health and the public workspace bundle both match fingerprintc4c69126.... The user then reproduced the explicit error "The final document update was not acknowledged. Try again." on their own browser. There are still zero submissions/provider calls. Do not describe the local fixture or the first repair as live functional acceptance.

Read-only production edge-log aggregation for08:20–08:42UTC finds access/coordinator RPC medians183–185ms, p95 approximately225–231ms; snapshot commits have median221.5ms and p95523.15ms, with no error responses in those paths. A flush performs multiple such operations and currently waits behind one full remote authorization cycle per inbound keystroke/presence packet. Its three-second UI deadline is inadequate even after outbound projection coalescing.

Follow-up scope adds `server/index.ts` ingress scheduling, `src/provider.ts` flush wait and a real WebSocket/CoCreateProvider integration regression at these measured delays. Preserve every frame's ordering and content, fresh authorization before each bounded synchronous drain, per-frame owner/ticket checks, durable append/snapshot completion and fresh authorization for each actual outgoing reply. No authorization cache, inference replay, model change, data migration or paid calls. The save-only wait is now bounded at30 seconds; provider/spending/resource limits remain unchanged. Document append RPCs in the same window have median186ms/p95222.4ms (25 requests). A68-frame burst alone can require over13 seconds of serialized durable appends before access/reply/commit overhead; the new bound accounts for that measured path rather than treating three seconds as a persistence deadline.

The new real-socket regression fails before correction with the user's exact error. It then passes with a canonical acknowledgement after4808ms and zero inference, and a later revoked edit is refused. All16 focused transport/reconnect/revocation checks pass. A simulated-clock test accepts a matching reply after four seconds, rejects a missing reply at the finite30-second deadline, and immediately rejects an explicit save failure. Server commit/failure timing logs include only the server-owned project identity and duration, with no writing, credential or raw request payload. Strict types/build, boundaries (168 files, zero violations) and AST graph refresh (2345 nodes/5595 edges, known14 SQL parser omissions) pass. Final Windows and Linux image suites remain required for this follow-up.

## Outcome and scope

The user reports that Build my changes does nothing on the live direct-flow release. Project inspection finds saved participant edits but zero submissions, provider calls, or artifacts. Its configured models are left unchanged; no paid reproduction is authorized for those models. Trace the pre-submission collaboration barrier before changing generation.

Allowed scope: `src/App.tsx`, `src/provider.ts`, server socket delivery in `server/rooms.ts`/`server/room-state.ts`, relevant regression tests, release attestation, graph and affected steering. No database mutation, key/model replacement, inference replay, or authentication bypass.

## Evidence and contracts

Graphify locates Workspace.submitChanges, CoCreateProvider.flush, RoomManager.flushDocument/sendPacket, hosted membership validation and existing reconnect/hosted tests. The client awaits flush before HTTP submission, but silently catches flush failures. Hosted socket delivery serially reauthorizes every queued packet; replaceable saved/state projections can backlog the final acknowledgement. Keep every durable write, current membership/coordinator check, document update, command reply and caller-owned submission. Only obsolete unsent projections may be coalesced; never coalesce incremental document packets or explicit replies.

## Verification

Reproduce delivery backlog with a controlled authorization barrier, verify the latest canonical saved/state projection and flush reply arrive with bounded pending projection delivery, and verify revocation still prevents delivery. Exercise the visible save failure with a controlled local browser fixture. Run reconnect/hosted/reliability/direct regressions, strict build/types, boundaries, image CI and source attestation. Distinguish fixture evidence from live provider acceptance. The user owns manual paid product testing after release.

## Repair evidence

- Before correction, the deterministic 68-save burst regression fails: 70 serial authorization checks precede one flush reply. The repaired test delivers the latest saved revision and exactly one explicit flush reply with at most four checks. A separate revocation test delivers nothing after access is revoked and closes4403. Existing hosted/reconnect focus passes12/12; the two new delivery tests pass2/2.
- The first strict build rejects the new fixture's missing required debounce option and its incorrectly inferred fake socket receiver. Correct those test-only types; strict types and the production bundle then pass. No product limit or timeout changes.
- Controlled local browser: the first flush returns an explicit save failure. The draft remains visible, the error is shown, and provider/submission/artifact counts remain0/0/0. [Failure screenshot](../../artifacts/direct-submission/build-save-failure.png).
- With68 pending saved projections and80ms authorization latency per actual delivery, the next button click produces one direct submission, two controlled generation calls and a compiled/promoted artifact v1. The UI shows Available v1 and limited functional coverage. [Artifact screenshot](../../artifacts/direct-submission/build-after-delayed-ack.png). This is a fixture with real native execution/verification, not a paid-provider acceptance claim.
- `corepack pnpm build`, strict types, `check:boundaries` (167 files, zero violations) and `git diff --check` pass. Final Graphify refresh:2335 nodes/5569 edges, known14 SQL parser omissions, no AI calls. Full Windows suite and final-head Linux CI are in progress.

Production source before repair is main `ee12904`, matching the tested PR #11 tree and fingerprint372b5fa.... The repaired expected production fingerprint is `c4c69126a9f9a4d8d322a7710fb274cddecd49fd4d1936dcfeb62d295631b3c8`; staging is `5f54eeb416ea6bb11f08f1d129061dde564bab79e73ffeb2031f638fd368bfcd`. Roll back this focused repair by reviewed revert with a matching Worker/image/config; preserve project snapshots and never replay paid work. Check active production work before rollout. Memory-only BYOK connections may require reconnection after container replacement.
