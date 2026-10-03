# 2guys1canvas

A multiplayer workspace for steering one durable software-building workflow. Collaborators write together, explicitly submit their own changes, resolve requirements and inspect shared versioned artifacts. Typing and reconnect do not invoke inference.

## Run locally

Requires Node.js 22.13+ and the pinned pnpm 10.18.3. Corepack can run it without a global pnpm installation:

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Open http://localhost:5173. React/Vite, the Express API, WebSockets and previews share the server. Local records live in `data/`; generated files live in `generated/`. Local mode is for a trusted single server/LAN with persistent storage. Use separate browser profiles for separate participant identities; `?join=1` requests a fresh local join.

The environment template is [.env.example](.env.example). Configure server values in `.env` and browser `VITE_*` values through Vite's environment files/build environment. Local development uses `COCREATE_AUTH_MODE=local` and `VITE_COCREATE_AUTH_MODE=local`; hosted mode uses Supabase. Never put secrets in `VITE_*` or Git. Offline Jev credentials go only in the ignored `.env.local` file.

## Current workflow and AI setup

Workflow, Canvas and Artifacts expose durable tasks, accepted requirements, activity and versions. Canvas has a compact Shared context rail with accepted revision selection and a separate Recorded usage · partial card. Build my changes submits only the caller's pending steering. Editor-focused Alt+X is fixed on Windows/Linux; macOS has no active shortcut.

The current setup dialog is temporary OpenRouter BYOK. An owner validates a key without generation, chooses both Interpretation and builder models explicitly, saves, and authorizes editor spending. The key stays in server memory for two hours; restart/expiry requires reconnecting. No managed/founder credit or key/model/demo fallback. Historical local provider APIs and managed project/accounting records remain compatible; obsolete Advanced/managed UI functions are removed.

Output exhaustion recovers through at most eight coherent one-file tasks with validated envelopes and awaited checkpoints. Initial generation, repair, recovery and transport retries share one 24-physical-call executor ceiling across superseded candidates. Configured spending and provider limits remain separate. Failure retains the last compiled artifact; compilation alone does not mean functional verification.

Recorded physical requests and setup tests retain reported tokens and unknown usage. Historical generation counters are separate; coverage stays explicitly partial. Device caching complements actual cloud save receipts and never supplies permissions or a cloud acknowledgement.

## Verify and maintain

```powershell
corepack pnpm test
corepack pnpm build
corepack pnpm check:boundaries
corepack pnpm audit:code
```

The audit reports import reachability, ambient declarations, unknown dynamic loads and client/server/shared boundaries. It never edits or deletes source. Optional report-only Jev review:

```powershell
corepack pnpm audit:code -- --jev --limit 20 --budget-usd 0.10 --brief "Describe the feature change"
corepack pnpm audit:code -- --check --scope ui --base origin/main
```

Set `TYPESAFE_API_KEY` privately in `.env.local`. Use `--files` for a comma-separated graph/search shortlist, always retaining required authority/protocol contracts. `--snapshot <commit>` reviews committed source as a dated baseline. Reports, cached typed answers and physical-request accounting stay in ignored `artifacts/codebase-audit/`. Requests have no automatic retries; estimates are not provider-side spending caps. Jev judgments do not authorize removals or promotion. See [the plan](docs/harness/codebase-cleanup-plan.md) and [verification](docs/harness/codebase-cleanup-verification.md).

For the controlled three-profile browser reliability check, first build with `VITE_COCREATE_AUTH_MODE=local`, then run `pnpm exec tsx scripts/verify-reliability.ts`. Set `COCREATE_VERIFICATION_OUTPUT` to an isolated evidence directory. This check uses synthetic provider responses; it does not verify real hosted accounts or paid inference. Browser checks require the installed Chrome path used by the script.

GitHub code checks run installation from the lockfile, import boundaries, the existing test suite and production build. They make no Jev or paid provider requests.

## Architecture and hosted operation

Browser entry is `src/main.tsx`; project/auth navigation is `src/ProjectApp.tsx`; `src/App.tsx` coordinates the editor and extracted `src/workspace/` views. `shared/` holds public contracts and pure receipt support. `server/index.ts` and `server/rooms.ts` remain the HTTP/WebSocket and coordinator facades. Providers, durable state, validated project operations and preview generation have separate modules. Consult [architecture](docs/harness/architecture.md), [API](api.md), [decisions](docs/harness/decisions.md) and [checklist](docs/harness/checklist.md).

Hosted identity is Supabase UUID plus current membership, with browser PKCE and server bearer verification. Invitations bind to verified intended email/accounts, preserve roles, and keep earlier valid links after deliberate resend. Configure `RESEND_API_KEY` and `COCREATE_EMAIL_FROM` server-side; provider acceptance is not inbox delivery.

Supabase SQL migrations remain authoritative. Prisma 7.10, its matching client/adapter and PostgreSQL driver are development/introspection tooling, not the application persistence path. `prisma7.config.ts` loads `.env.local` and uses `DIRECT_URL`; the schema includes external Supabase-owned auth declarations. Do not use Prisma Migrate against production without an explicit migration-history cutover. Hosted runtime does not silently fall back to SQLite/JSON.

Cloudflare Worker/container configuration is in `wrangler.jsonc`, `worker/container.js` and `Dockerfile`; deployment command is `pnpm deploy:cloudflare`. Technical CoCreate identifiers/origins remain compatible. The prepared server-only coordinator-fencing migration is NOT applied; live SQL contention, independent hosted accounts, owner routing and complete external artifact recovery remain unverified follow-ups. A Git push is not evidence of deployment health. Generated preview CSP and host-process compilation are not a process sandbox.

Current agent steering is [AGENTS.md](AGENTS.md), [context.md](context.md), [product.md](product.md) and [instructions.md](instructions.md). [Historical setup](docs/harness/history/readme-before-cleanup.md) preserves older screens/plans without placing them in current feature context. Use Graphify first, verify against source, and run `graphify update .` after code changes.
