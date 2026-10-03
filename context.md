# 2guys1canvas context handoff

Updated 2026-10-04. This is the current handoff; [dated history](docs/harness/history/context-before-cleanup.md) preserves earlier results and superseded directions. Explicit user instructions take precedence.

## Current product and authority

The primary shared object is one durable workflow. Collaborators write together, explicitly submit their own pending steering, resolve accepted requirements/conflicts, and inspect versioned artifacts. Typing and reconnect do not trigger inference. Build my changes and editor-focused Alt+X use the same authenticated, flush-acknowledged, idempotent path; macOS has no active shortcut.

Hosted inference is temporary OpenRouter BYOK only. New projects start disconnected. Owners validate a key without generation, choose both models explicitly, and authorize editor spending. The credential stays in a two-hour server-memory lease; restart/expiry requires reconnecting. No managed credit, founder key, model, credential or demo fallback. Historical records and technical CoCreate identifiers remain compatible.

## Implemented reliability boundary

Participant submissions capture only caller-owned edits and reconcile in durable capture order. Pending batches, command receipts and accepted revision snapshots survive restart. Cloud save receipts cover actual insertion clocks AND deletion ranges; local persistence is not a cloud acknowledgement. One logical coordinator serializes integration/promotion and rejects stale owners.

Output exhaustion decomposes into at most eight coherent one-file tasks with complete envelopes and awaited durable checkpoints. Initial generation, recovery, repair and transport retries share one 24-physical-call executor ceiling across superseded candidates. Configured spending limits remain separate. Failure retains the last compiled artifact; compilation does not establish functional acceptance.

Canvas has a compact Shared context rail driven by selected accepted revision snapshots, a separate Recorded usage · partial card, and workflow stage. Studio Ivory is the active presentation: base layouts in `src/styles.css`, palette/states in `src/studio-ivory.css`.

## Source navigation and cleanup

Active browser entry: `src/main.tsx`; hosted project navigation: `src/ProjectApp.tsx`; canvas/editor facade: `src/App.tsx`. The server starts in `server/index.ts`; `server/rooms.ts` remains the coordinator facade. Public contracts and the pure Yjs receipt helper now live in `shared/`. Context/conflict and accounting views are separate under `src/workspace/`; pure steering text helpers live in `server/steering-text.ts`.

[Cleanup plan](docs/harness/codebase-cleanup-plan.md) records the proposed stages. Implementation and fresh verification are tracked in [the checklist](docs/harness/checklist.md) and [cleanup evidence](docs/harness/codebase-cleanup-verification.md). The old Advanced/managed setup functions were unmounted; current Workspace renders ByokSetup. Supported local server APIs and persisted compatibility records remain.

Use Graphify first for code questions, then verify against source. [SOURCE_MAP.md](graphify-out/SOURCE_MAP.md) describes extraction limits. `pnpm audit:code` reports static usage and import boundaries; optional Jev mode reviews candidates without editing them. Credentials/cache/request evidence remain local.

The offline audit supports Vercel AI Gateway through AI_GATEWAY_API_KEY and direct TypeSafe through TYPESAFE_API_KEY, with explicit provider selection. The Vercel 20-file historical triage succeeded at a reported $0.001711374. It wrongly flagged one protected migration tool as obsolete at low confidence; that file remains protected. This is file-triage evidence, not the proposed 20-feature context-recall evaluation.

## Verification and remaining work

October 1 local reliability evidence: 129 tests and production build passed; controlled providers and independent browser profiles exercised durable submission/reconnect/recovery. See [reliability-verification.md](docs/harness/reliability-verification.md). These are historical results, separate from the cleanup run.

The server-only Postgres coordinator-fencing migration is prepared but NOT applied. Live SQL contention, independent hosted accounts, permitted paid-provider behavior and deployment remain unverified. Owner routing, event-projection scale and older external artifact-body archival remain operational follow-ups. The requested visual reference was absent, so a reference match is unverified. Resend acceptance is not inbox delivery; live email delivery remains unverified.

Next work must use the current contracts in [product.md](product.md), [instructions.md](instructions.md), [architecture.md](docs/harness/architecture.md), [decisions.md](docs/harness/decisions.md), and [api.md](api.md). Do not infer completed hosted behavior from local mocks or plans.
