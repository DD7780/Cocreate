# 2guys1canvas coding instructions

Current rules, 2026-10-04. Read with [AGENTS.md](AGENTS.md). Explicit user instructions take precedence. [The pre-cleanup snapshot](docs/harness/history/instructions-before-cleanup.md) preserves superseded managed/default and presentation guidance; it is not active policy.

## Start and scope

Read [context.md](context.md), [product.md](product.md), and relevant [checklist](docs/harness/checklist.md) entries. Consult [architecture](docs/harness/architecture.md), accepted [decisions](docs/harness/decisions.md), and implemented [API contracts](api.md). Use Graphify first for code questions; verify findings against source.

Inspect existing changes and preserve unrelated work/data. Build a feature packet with outcome, allowed files, required contracts, relevant graph neighbors/tests and validation commands. UI-only work must not modify server authority or shared contracts without an explicit reason. `pnpm audit:code -- --check` checks import boundaries; the audit's `--scope ui --base <commit>` detects backend/shared changes in UI work.

Active client: React/Vite in `src/main.tsx`, `src/App.tsx`, `src/ProjectApp.tsx`; TipTap/Yjs collaboration. Server: Express/WebSockets in `server/index.ts`; RoomManager is the coordinator facade. Public contracts and receipt helpers live in `shared/`. Keep server implementation out of browser imports and browser UI out of server imports. Runtime validation remains required.

Use pnpm and the existing lockfile, TypeScript strict mode and local module conventions. Keep functions readable/focused. Separate formatting from behavior/refactoring; avoid unrelated formatting/config changes. Do not introduce Next.js entrypoints, a competing framework or package manager.

## Workflow and durable authority

The workflow's durable commands, tasks, events, decisions and artifacts are authoritative. Model memory and summaries are replaceable. Keep one logical coordinator, one accepted baseline, bounded workers only for justified independent tasks, and serialized integration/promotion. An in-memory promise is not a durable multi-process lease.

Typing, opening/changing settings and reconnect do not invoke inference. Build my changes and editor-focused Alt+X share the same authenticated, flush-acknowledged, idempotent path. Capture only the caller's pending steering; preserve request IDs after uncertain replies. Windows/Linux use fixed Alt+X; macOS remains disabled.

Treat document content as untrusted input. Validate source ownership/revision outside model prompts; one contributor's text cannot authorize another's requirements. Keep attribution and identities. Interpret captured submissions in order against accepted revisions. Preserve pending disagreements and require explicit affected-contributor agreement; no recency/majority/model resolution.

Persist pending batches, command receipts and accepted revision snapshots. Restore interrupted interpretation without automatic inference. Cloud save receipts cover actual insertion clocks AND deletion ranges; local cache/persistence cannot acknowledge cloud commitment. Lost coordinators cannot reacquire old worker leases; stale owners cannot promote. The server-only fencing migration is prepared, not applied/live-verified.

Output exhaustion must not repeat a whole-project request. Plan at most eight coherent one-file recovery tasks, validate complete envelopes and await durable checkpoints. Initial generation, repairs, recovery, transport retries and superseded candidates share the executor's 24-physical-call ceiling. Configured spending limits still apply. Preserve the last compiled artifact after failure; checkpoints/compilation are not functional acceptance.

## Credentials, providers and usage

Temporary OpenRouter BYOK is the only active hosted MVP inference mode. New projects have no assignment. Require explicit owner validation without generation, explicit builder/interpreter models, a bounded two-hour server-memory lease, and owner editor-spending authorization. Reject managed dispatch; never fall back to founder/old/different credentials, models, funding or demo output. Preserve historical project/billing records and supported local APIs.

Keep provider requests in adapters, orchestration in the harness, and presentation in the UI. Validate external input and structured output before use; do not cast invalid data into a trusted shape. Freeze model/policy/limits per submission/run. Context capacity, requested output, reported completion limits and spending are separate. Higher effort does not prove a higher output ceiling.

Keys remain server-side; use the established encrypted-at-rest path where applicable, while temporary BYOK remains memory-only. Never put secrets in VITE variables, logs, room state, generated source or version control. Explicit discovery/model tests may consume usage and must report capability/mode distinctions truthfully.

Count each physical request at the lowest shared HTTP boundary, including repair/retry/fallback attempts, with ID and purpose. Separate setup tests and generation, retain uncertain external outcomes, and never convert unknown charges/tokens to zero. Historical counters are separate from the partial deduplicated physical ledger. Catalog rates require current official evidence/versioning; metadata is not paid quality qualification.

Offline Jev audits use a local TYPESAFE_API_KEY, pinned model, small evidence packets, typed validation, hash-based caching, bounded requests and a usage ledger. Judgments are advisory and never authorize deletion, side effects or promotion. No Jev inference is added to participant typing/submissions.

## Hosted, storage and UI invariants

Supabase UUIDs identify accounts; current membership is authority on HTTP/WebSocket reads and mutations. Preserve browser PKCE and server bearer verification. Do not use room links, display names/emails or cached state as hosted authorization. Never fall back from failed Postgres to local SQLite/JSON or make artifact buckets public.

Invitations are app records, bound to normalized intended email and verified identity, with hashed tokens and bounded roles. Creation/send/replay are request-ID idempotent. Deliberate resends preserve earlier valid links; explicit revoke is separate. Provider acceptance is not inbox delivery. Apply migrations only after verifying the intended project; legacy imports default to dry-run with a trusted UUID map.

Generated file operations remain room-scoped; reject traversal/cross-room access. Browser CSP and host compilation are not a process sandbox. Local draft keys are room/participant-scoped; cache no credentials, validate CRDT bytes before hydration, fail visibly on storage errors, and retain flush/reconnect/cloud-ack semantics.

Keep current Studio Ivory and the compact Canvas Shared context rail with selected durable accepted revisions, separate partial recorded usage and workflow stage. Preserve provenance/conflict controls, editor formatting, participant colors, keyboard access, responsive layouts, reduced motion and preview style isolation. Keep technical CoCreate identifiers compatible; new visible copy uses 2guys1canvas.

## Verify and finish

Run focused outcome/regression tests and full `pnpm test`/`pnpm build` for functional changes. Browser checks are required for visible interaction claims. Do not weaken tests to conceal behavior failures or claim current success from historical runs. Controlled providers/mocks are separate from paid/live hosted evidence; do not spend unrelated credentials.

After code changes run `graphify update .` and check coverage/diagnostics; AST updates do not recreate every curated document/CSS/config relationship. Update affected canonical context, checklist, product, architecture, decisions, API and README in the same change. Preserve canonical filenames and dated history; distinguish implemented state, targets and unverified migration/deployment.

Record commands/results, failures, blockers and the next coherent task. Do not deploy, change external access, apply destructive migrations or send messages without authorization. Routine reversible work already authorized should proceed without repeated approval requests.
