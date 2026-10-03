# 2guys1canvas

A multiplayer workflow workspace: co-write a brief, submit your own steering, inspect accepted requirements/tasks/usage and share versioned frontend artifacts. Developer is the only active workflow. Writing, autosave, navigation and reconnect never invoke inference.

## Start locally

Requires Node.js 22+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`. This starts the Vite client, HTTP/WebSocket server, local persistence and preview. Explicit local mode stores room records under `data/` and generated files under `generated/`; persistent storage is needed across replacement. Local room links/display-name sessions are trusted local compatibility, not hosted accounts. For another local participant use another browser/device or `?join=1`; LAN access uses the server machine's address and may require firewall configuration.

## Hosted setup and use

Hosted projects use Supabase account identity and current owner/editor/viewer membership. A URL alone grants nothing. Sign in, create/open a project and write first. The owner opens AI setup when ready. Follow the single [current BYOK setup and limit contract](product.md#hosted-ai-and-limits): temporary memory-only OpenRouter key, explicit compatible model selection and owner spending permission for editors. No managed/founder fallback or old setup wizard is active. Expiry/restart requires reconnecting.

**Build my changes** flushes and submits only your captured steering. Fixed editor-focused Alt+X does the same on Windows/Linux; macOS has no mapping. Empty/replayed submissions do not spend another generation request. Nearby accepted submissions share a short configurable collection window (default three seconds, `BUILD_DEBOUNCE_MS`), with `BUILD_COOLDOWN_MS` and `BUILD_MAX_WAIT_MS` bounding scheduling. Later accepted work queues behind a fixed-revision candidate. Explicit Retry build uses accepted requirements without reinterpreting edits. If the workflow owner is unavailable, connection retries stop with a reopen action while page edits remain retained. Reconnect never submits a build automatically; an explicit command retry uses the same request ID.

Exhausted project output uses smaller validated tasks and durable checkpoints within the current executor's 24-physical-call ceiling. Provider limits and frozen configured spending limits remain separate. Failure retains the last compiled preview, which is functionally unverified unless real acceptance checks passed. See [recovery/limits](product.md#build-recovery-and-evidence).

Canvas, Workflow and Artifacts expose Shared context and selected accepted revisions. Usage is recorded/partial; unknowns stay unknown and historical generation counters remain separate. Device-saved IndexedDB recovery and server-synced status are different. Full offline cold startup is unavailable. The current shell is Studio Ivory; the [supplied reference](docs/harness/references/shared-context-reference.jpg) is available, comparison pending.

## Hosted configuration and release prerequisites

Use `wrangler.jsonc` as the existing deployment configuration. Public Supabase URL/key/app origin reach the Vite build through container image variables; local builds use matching `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_COCREATE_APP_ORIGIN`. Keep `SUPABASE_SECRET_KEY`, session/encryption secrets, provider/email keys and migration credentials server-only. `COCREATE_APP_ORIGINS` and `COCREATE_PUBLIC_ORIGIN` identify allowed application origins.

The established production app origin is `https://cocreate.susan981314271.workers.dev`; its callback is `/api/auth/callback`. Google returns to the configured Supabase project's `/auth/v1/callback`, then Supabase returns to the separately allow-listed app callback. The historical verified project reference is `dnsapasubeoxxsgkiotw`; verify the intended target before any external operation. Allow localhost callback separately. The unrelated `cocreate.pages.dev` app is not this callback.

Keep confirmed email/password and Google authentication, confirmation/recovery SMTP and safe return paths. Project invitations use separate transactional email: server-only `RESEND_API_KEY` plus `COCREATE_EMAIL_FROM` on the exact verified domain. Provider response ID means accepted for delivery, not inbox receipt. Request retries preserve IDs; deliberate resend preserves prior links/roles. No live delivery is verified locally.

The [original coordinator migration](supabase/migrations/20261001104120_workflow_coordinator_fencing.sql) and [Step 02 hardening](supabase/migrations/20261003203000_coordinator_dispatch_updates.sql) remain **prepared/unapplied**. Their RPCs are required by current hosted code. Earlier applied schema/invitation/ledger records do not prove these migrations. Stable primary-container affinity and bounded authenticated owner retry responses are implemented locally; real contention and hosted rollout remain pending. See the [Step 02 handoff](docs/harness/multiuser-step02-handoff.md) for compatibility, rollback and disposable-database checks. Complete older artifact restoration and scaling remain incomplete.

The existing Cloudflare path uses a Worker, native container HTTP/WebSocket proxy and application readiness endpoints `/__cocreate/health` and `/__cocreate/app-health`. Encrypted `SESSION_SECRET` and `CREDENTIAL_ENCRYPTION_SECRET` are required runtime secrets. Build/deploy scripts are in `package.json`; production branch configuration historically uses main. A Git push can trigger configured CI, so verify the target's release behavior before publishing. This documentation cleanup does not deploy, configure secrets or apply migrations. Release readiness and post-deployment verification are in the [checklist](docs/harness/checklist.md).

Optional Postgres tooling uses transaction-mode `DATABASE_URL` and session-mode `DIRECT_URL`; placeholders in `.env.example` are non-operational. Preserve percent-encoded credentials locally. Prisma 7.10 is optional introspection/typed access; managed auth models are external and versioned Supabase SQL is the migration authority. Do not run Prisma Migrate against hosted tables without an explicit reconciled cutover.

Legacy import remains dry-run-first: `pnpm migrate:legacy -- --mapping scripts/trusted-owner-map.example.json`. Use trusted room-to-account UUIDs, never names or room-link ownership. Apply/confirm-target is a separately authorized operation after target/backup/hash/quarantine review.

## Checks and boundaries

```bash
pnpm test
pnpm build
pnpm start
```

The [Step 02 handoff](docs/harness/multiuser-step02-handoff.md) records fresh 148/148 local tests, production build and independent controlled Chrome checks. The [2026-10-01 report](docs/harness/reliability-verification.md) remains historical. Live hosted/provider/coordinator SQL and visual reference comparison remain pending.

Generated apps are bounded React/TypeScript frontends, with validated room-scoped operations, approved dependencies and restricted style-isolated preview/download. Compile runs in the server process; CSP and tool policy are not a process sandbox. Recent sources/projections restore through hosted snapshots, but complete historical artifact bodies and container-replacement recovery remain incomplete.

## Contributor entrypoints

Read [AGENTS.md](AGENTS.md), [context.md](context.md), [product.md](product.md) and [instructions.md](instructions.md). Use the canonical [architecture](docs/harness/architecture.md), [decisions](docs/harness/decisions.md), [checklist](docs/harness/checklist.md) and [API](api.md); each has a distinct responsibility. [UI assets](docs/ui-assets.md) records font/icon sources and the reference provenance.

Old managed-default, Recommended/Advanced wizard, three-mode activation and presentation guidance is preserved in the [historical archive](docs/harness/archive/2026-10-01-pre-consolidation/README.md), not current setup instructions. CoCreate-prefixed keys, paths and deployed origins remain compatibility identifiers; use 2guys1canvas for visible copy.
