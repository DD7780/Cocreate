# Harness architecture

Current source map, 2026-10-04. [Historical architecture](history/architecture-before-cleanup.md) retains superseded managed/default, presentation and orchestration notes. [Decisions](decisions.md) record accepted direction; [api.md](../../api.md) records implemented contracts. Plans and mocks do not establish live hosted behavior.

## Module boundaries

| Area | Source | Responsibility |
| --- | --- | --- |
| Browser bootstrap | `src/main.tsx` | Vite entry, auth-mode selection, lazy project/workspace loading, two active stylesheets |
| Hosted navigation/auth | `src/ProjectApp.tsx`, `src/supabase.ts`, `src/oauth-callback.ts` | PKCE/session lifecycle, project and invitation navigation |
| Workspace/editor | `src/App.tsx`, `src/provider.ts`, `src/local-drafts.ts` | Canvas interaction, scoped Yjs transport/cache, explicit submission |
| Context and accounting views | `src/workspace/AgentPanel.tsx`, `src/workspace/BuildAccounting.tsx`, `src/WorkflowBoard.tsx` | Accepted revision selection/conflicts, partial usage and durable workflow views |
| Active AI setup | `src/ByokSetup.tsx` | Temporary key validation, explicit model selection, spender authorization |
| Shared contracts | `shared/types.ts`, `shared/document-state.ts` | Public types and pure insertion/deletion receipt support; no UI/server implementation |
| Server facade | `server/index.ts`, `server/rooms.ts` | HTTP/WebSocket auth, room state, serialized submission/build/promotion |
| Pure steering | `server/steering-text.ts`, `server/steering-edits.ts`, `server/requirements.ts` | Text/delta helpers, attributed capture and accepted requirements/conflicts |
| Generation/recovery | `server/generator.ts`, `server/build-recovery.ts`, `server/project.ts`, `server/preview.ts` | Validated file operations, checkpoints, compilation and preview |
| Durable ownership/persistence | `server/coordinator.ts`, `server/event-store.ts`, `server/supabase-platform.ts`, SQL migrations | Events/snapshots, leases/fencing, hosted membership/RPC authority |
| Providers/accounting | `server/providers.ts`, `server/byok-lease.ts`, `server/usage-ledger.ts` | Adapted physical requests, temporary credentials, reported partial usage |
| Developer audit | `scripts/codebase-audit.ts` | Static usage/boundaries and optional advisory Jev review; never participant runtime inference |

Offline Jev dispatch selects direct TypeSafe or Vercel explicitly with separate credential variables and fixed endpoints. Vercel's TypeSafe-compatible route uses `typesafe-ai/jev`, an unpinned gateway alias; direct calls retain `jev-1.13.0`. Provider/endpoint fingerprints isolate caches, gateway aliases expire after 24 hours, and gateway-reported costs are distinct from token estimates. There is no automatic retry, credential crossover or provider/model fallback. The 20-file Vercel smoke run is recorded in [cleanup verification](codebase-cleanup-verification.md).

The cleanup moves contracts and pure helpers without changing request/event shapes or coordinator authority. Historical managed accounting/catalog modules remain for compatibility, tests and persisted data; inactive UI does not prove the corresponding storage contracts are removable.

## Workflow and submission

One durable workflow owns commands, tasks, ordered events, decisions and versioned artifacts. Personal interpretation proposes steering; it never independently edits code. Authorized submissions capture only the caller's pending Yjs-derived changes and the accepted baseline, preserving request IDs and source identities. Interpretation is serialized in durable capture order; later accepted changes can supersede a fixed-revision build candidate and stay queued.

Keep one logical coordinator and serialized integration/promotion. Local SQLite coordinator leases use owner epochs per shared data directory. Hosted coordinator leases renew every ten seconds for a thirty-second lease; after loss the process fails closed rather than reacquiring old work. Snapshot/promotion checks reject stale epochs/revisions.

Output exhaustion creates an ordered manifest of at most eight complete one-file tasks. Recovery envelopes pass existing validators; each checkpoint is durable before proceeding. Initial execution, repair, recovery and transport retries consume one shared 24-physical-call ceiling across superseded candidates, alongside configured spending reservations. The last compiled artifact survives failed candidates. Compilation and checkpoints remain unverified source/artifacts unless acceptance checks pass.

## Collaboration and persistence

Browser IndexedDB (`cocreate-drafts-v1/documents`) is room/participant-scoped device recovery, bounded to 8 MiB per record. Merge competing updates transactionally, validate on an isolated Y.Doc before editor hydration, and show storage failure. Cache no credentials, billing or authority. Cold offline project startup and retention/purge controls are not established.

The provider batches local updates for 40 ms. Submission flush drains pending frames before requesting the existing acknowledgement. Reconnect uses state-vector synchronization without inference. Incremental document frames avoid unnecessary RoomView broadcasts; authoritative workflow/permission/build transitions still broadcast state. HTTP state reads diagnose failed reconnect; WebSocket is the normal initial state/document path.

Pending batches, replay receipts and accepted revision history persist in immutable snapshots. A full snapshot can recover a failed update append, but a failed snapshot cannot authorize flush. Save acknowledgements include canonical insertion clocks AND deletion ranges from `shared/document-state.ts`; local commitment is not a cloud receipt. Clients reject old cursors and only mark edits saved when both receipts cover them.

Hosted Yjs bytea must preserve exact original bytes. Validate encoded snapshots/update history, quarantine unreadable records rather than replacing them, and recover only from verified updates. Auth/membership are server-verified for HTTP, upgrades, incoming messages and outbound state/document delivery. SQLite and legacy JSON support local compatibility; they never silently replace failed hosted persistence.

## Hosted inference and usage

Temporary OpenRouter BYOK is the only active hosted mode. `/key` validates without generation; `/models` supplies metadata; explicit exact-ID choices and owner spending permission gate dispatch. Lease credentials stay in memory for two hours and are never serialized. No managed/founder/model/key/demo fallback. Existing local provider APIs and historical managed storage/accounting stay compatible.

At the lowest dispatch boundary, each physical request has ID/purpose and retained usage/outcome. Repairs/retries are separate calls. Historical generation counters, setup tests and deduplicated physical ledger are distinct; old/missing usage remains unknown and coverage partial. Model/rate/policy snapshots preserve historical estimates. Context capacity, output metadata, conservative byte estimates and spending are different measures; none is a tokenizer or provider invoice.

## Presentation and hosted limits

`src/styles.css` supplies layouts; `src/studio-ivory.css` supplies the active palette/states. Inter and DM Serif Display load once. Canvas's compact Shared context rail uses selected durable accepted snapshots, a separate Recorded usage · partial card and workflow stage; Workflow/Artifacts retain conflicts, provenance and decisions. Preview styling stays isolated.

Invitation acceptance requires the intended authenticated verified-email identity and preserves existing roles. Resends create additional valid links; send/replay is request-ID idempotent. Resend provider IDs mean accepted for delivery, not inbox arrival. Secrets stay server-side.

The additive service-role coordinator-fencing migration is prepared but NOT applied. Its advisory/row locks, lease contention and atomic snapshot behavior require live Postgres and independent hosted-account tests. Request owner routing remains unimplemented; another process fails closed. Older external artifact bodies and full event-projection scale remain operational gaps. See [reliability-verification.md](reliability-verification.md) and the [checklist](checklist.md).
