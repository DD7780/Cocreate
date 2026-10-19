# October 9 source restoration — 2026-10-19

## Change packet

Outcome: the user reports broad regressions after the October 15 UI changes and canvas enlargement. They explicitly selected the complete October 9 version `6c4402958bdec460b23c959bc99c8e824e53dd1c` and requested publication to main without pulling the broken current GitHub source. This is a historical source restoration; the particular reported failures have not been independently reproduced.

Scope: restore the selected tracked snapshot, including client, server, shared contracts, tests, release configuration and its documentation. Only this dated packet, current steering notices, verification evidence and refreshed Graphify outputs may differ from that snapshot. Do not selectively retain later UI, submission, model or October 18 restoration changes. Keep the existing package version and release fingerprint because the release inputs must match the selected source exactly. This is not UI-only work.

Evidence: local first-parent history puts the first October 15 UI release `ab28741` immediately after `6c44029`; the later canvas enlargement is `6fd5c86`. The user selected the October 9 cutoff explicitly. Graphify query `canvas workflow build receipt release` locates `src/App.tsx`, `src/WorkflowBoard.tsx`, `shared/types.ts`, `server/rooms.ts`, durable receipts and coordinator contracts. Source and the selected Git tree remain authoritative where graph locations are dated.

Contracts: the October 9 implementations of authenticated caller-only submission, inference-free collaborative writing, durable receipts, accepted revision history, serialized coordinator/promotion, bounded accounting, private artifacts, membership and beta access apply. Restore their matching server, shared and client files together. No database rollback, data deletion, email or paid provider request is part of this restoration.

Publication: work in an isolated local worktree so the original staged/unstaged Graphify changes remain intact. Preserve both the original local main `bf295bf` and the remote main tip observed through metadata, `33d54e8f5eff1e7442c74eece2f3914bb09fb8b8`. Publish a new main commit with the restored tree and the actual remote main as parent, using normal non-forced Git pushes. Do not fetch, pull, merge or inspect the broken remote source. Only hash-verified commit headers are imported to preserve ancestry without downloading remote trees, blobs or source. A pushed verification branch makes the prepared objects and production-image CI available before main promotion. If the remote tip moves, stop promotion and recheck metadata.

Verification: compare every runtime/build input and regression test byte-for-byte against `6c44029`; run boundaries, strict TypeScript/production build, release fingerprint, the full existing test suite and production-image CI. Refresh Graphify with AST-only `graphify update .`. Local runtime limitations and historical evidence must remain distinct from fresh CI or hosted results. No new behavior or mirrored restoration test is required.

## Fresh verification

Runtime, contracts, tests, migrations and build inputs exactly match `6c44029`. Boundaries pass (151 files, zero violations); strict TypeScript and production build pass. The original 91-input release fingerprint verifies as `8e34b57fd99591db7557bf4d3b8308df28b193e0319f3d9efb45b18c30b219fb`. Independent read-only review found no P1/P2 restoration issues; reported user failures were not reproduced. Local build uses the existing installed dependencies; CI must verify the frozen lockfile in the intended Linux production image.

AST-only `graphify update .` completes with 2,296 nodes, 5,254 edges and 127 communities, without LLM calls. Semantic documentation relationships remain dated; the extractor reports 14 unsupported files. The installed Claude skill version warning is unrelated to the Codex skill used here. Current packet and source remain authoritative.

Full regression, production-image CI and publication are in progress. Historical October 9 results elsewhere in this snapshot do not establish the October 19 restoration, main publication or live deployment.
