# 2guys1canvas

**Prior hosted release (2026-10-09):** Beta request/approval source `ba96cfd` is deployed at https://2guys1canvas.com and published to main. Native PostgreSQL concurrency, compiler 10/10, browser 15/15 and full regression 244/244 pass with zero skips. Worker `088c7975`, container version 41 and image `fd66e1b1` serve the prepared fingerprint. The additive migration, two confirmed reviewer UUID grants, approved sender and retry cron are configured. Hosted anonymous routes pass; the user will manually verify signed-in requests, both reviewer inboxes, decisions, requester email and private-project denial. No live test account/email or paid inference was run by this session. [Current evidence](docs/harness/beta-access-requests.md).

The public pre-launch page is `/`, sign-in is `/login`, and the approved app is `/app`. Waitlist registration is private interest only and grants no account, beta approval or project membership. Confirmed signed-in accounts request beta access from the pending screen. Founder and cofounder use **Review beta requests** or `/beta/review` to give ordinary access or decline; requester email reports the result. A decline has a seven-day cooldown. Reviewer grants and revocation remain trusted UUID-based administration. [Feature operations and manual checks](docs/harness/beta-access-requests.md) describe deployment and delivery limits.

A multiplayer workflow workspace: co-write a brief, submit your own steering, inspect accepted requirements/tasks/usage and share independently versioned application and Markdown artifacts. Developer is the only active workflow. Writing, autosave, navigation and reconnect never invoke inference.

## Start locally

Requires Node.js 22.13+ and pnpm. Generated compilation requires Windows AppContainer plus the trusted .NET Framework C# compiler, or Linux Bubblewrap and util-linux/prlimit with usable user namespaces. Unsupported or unavailable isolation fails closed. After install, run `pnpm exec tsx scripts/prepare-isolation.ts` to exercise the actual compiler boundary without inference. For covered list acceptance checks on Windows, run `./scripts/prepare-verification-browser.ps1` from PowerShell: it prepares the pinned/hash-checked official headless-shell runtime and exercises the actual OS-contained browser without inference. Builds never download it automatically. Linux container preparation installs Debian Chromium headless shell; run `pnpm exec tsx scripts/prepare-verification-browser.ts` in the intended runtime, Linux CI adversity is verified; broader production adversity is deferred. An operator may explicitly set server-only `COCREATE_VERIFICATION_BROWSER`; unavailable/incompatible browsers fail before builder dispatch for covered checks, with no host fallback. Windows has historical local evidence; current Linux CI and hosted startup evidence are in the release packet.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`. This starts the Vite client, HTTP/WebSocket server, local persistence and preview. Explicit local mode stores room records under `data/` and generated files under `generated/`; persistent storage is needed across replacement. Local room links/display-name sessions are trusted local compatibility, not hosted accounts. For another local participant use another browser/device or `?join=1`; LAN access uses the server machine's address and may require firewall configuration.

## Hosted setup and use

Hosted projects use Supabase account identity and current owner/editor/viewer membership. A URL alone grants nothing. Sign in, create/open a project and write first. The owner opens AI setup when ready. Follow the single [current BYOK setup and limit contract](product.md#hosted-ai-and-limits): temporary memory-only OpenRouter key, explicit compatible model selection and owner spending permission for editors. No managed/founder fallback or old setup wizard is active. Expiry/restart requires reconnecting.

**Build my changes** flushes and submits only your captured steering. Fixed editor-focused Alt+X does the same on Windows/Linux; macOS has no mapping. Empty/replayed submissions do not spend another generation request. Nearby accepted submissions share a collection window (default three seconds, `BUILD_DEBOUNCE_MS`), with `BUILD_COOLDOWN_MS` and `BUILD_MAX_WAIT_MS` bounding scheduling. Admission closes at the cutoff, allowing only an already executing interpretation to finish. Later submissions are durably saved and wait for the fixed-revision candidate before interpretation. The progress bar shows building/accepted revision, available product/revision and waiting submissions. Explicit corrections can still cancel invalidated work. Retry build uses accepted requirements without reinterpreting edits. If the workflow owner is unavailable, connection retries stop with a reopen action while page edits remain retained. Reconnect never submits a build automatically; an explicit command retry uses the same request ID.

Exhausted project output uses smaller validated tasks and durable checkpoints within the durable workflow’s 24-physical-call ceiling (including interpretation). Provider limits and frozen configured spending limits remain separate. Failure retains the last compiled preview, which is functionally unverified unless real acceptance checks passed. See [recovery/limits](product.md#build-recovery-and-evidence).

Canvas, Workflow and Artifacts expose Shared context and selected accepted revisions. Open **View requirements** to inspect sources/revisions and correct or withdraw your own support. Saving intent is inference-free; stale forms ask you to review the latest revision. A coauthor’s support and history remain intact. **Build accepted changes** explicitly rebuilds corrected accepted intent with the saved AI/BYOK permission. Historical revisions are read only; typing or deleting text alone does not withdraw accepted intent. Usage is recorded/partial; unknowns stay unknown and historical generation counters remain separate. Device-saved IndexedDB recovery and server-synced status are different. Full offline cold startup is unavailable. The current shell is Studio Ivory; the [supplied reference](docs/harness/references/shared-context-reference.jpg) is available, comparison pending.

## Generate and inspect documents

In Canvas write `Write a Markdown document titled "Launch brief" with sections "Summary" and "Risks".` and choose **Build my changes**. Open **Artifacts**, choose the document/version, read it, view source or download `.md`. Reuse its quoted title to revise it. Application instructions keep the existing preview/ZIP behavior, and document updates retain an unchanged application. Artifact selections are saved per project/participant on each device.

For a two-person demonstration, Alice submits "Launch brief" while Bob leaves "Notes" unsubmitted. Bob's draft makes no calls until he submits it. Alice keeps Brief open while Bob selects Notes; Alice revises Brief and can then inspect v1 while Bob keeps Notes. Reload both sessions: selections and published versions survive without inference. Workflow keeps its existing recorded/partial usage. Failures retain published content; explicit retry requires the existing connected key/spending authority. Missing private content requires recovery, not automatic regeneration.

Document checks cover bounded UTF-8, requested headings and stored integrity; factual accuracy remains unverified. HTML/images are inert and links constrained. The initial renderer is a small Markdown subset; source/download preserve the complete text. Other formats and browser/desktop/Blender/provisioning/deployment tools are unavailable. Documents can use verified private versions as evidence via their displayed `artifact:<id>@v<number>` reference; inputs cannot authorize tools. See [current source verification and limits](docs/harness/canvas-artifacts.md). This change has not been deployed and requires no hosted migration.

For the repeatable synthetic two-profile browser check, build with `VITE_COCREATE_AUTH_MODE=local`, then run `pnpm exec tsx scripts/verify-canvas-artifacts.ts`. Set `COCREATE_UI_BROWSER` to an installed Chrome/headless-shell executable when the script default is unavailable. It saves checks/screenshots under `artifacts/canvas-artifacts/browser` and uses no live accounts or paid provider calls.

## Hosted configuration and release prerequisites

Use `wrangler.jsonc` as the existing deployment configuration. Public Supabase URL/key/app origin reach the Vite build through container image variables; local builds use matching `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_COCREATE_APP_ORIGIN`. Keep `SUPABASE_SECRET_KEY`, session/encryption secrets, provider/email keys and migration credentials server-only. `COCREATE_APP_ORIGINS` and `COCREATE_PUBLIC_ORIGIN` identify allowed application origins.

The production app origin is `https://2guys1canvas.com`; its callback is `/api/auth/callback`. The former workers.dev origin redirects to the canonical domain. Google returns to the configured Supabase project's `/auth/v1/callback`, then Supabase returns to the separately allow-listed app callback. The historical verified project reference is `dnsapasubeoxxsgkiotw`; verify the intended target before any external operation. Allow localhost callback separately. The unrelated `cocreate.pages.dev` app is not this callback.

Keep confirmed email/password and Google authentication, confirmation/recovery SMTP and safe return paths. Project invitations and beta notifications share the existing Resend transport: server-only `RESEND_API_KEY` plus `COCREATE_EMAIL_FROM` on the exact verified sending domain. Production sender is `2guys1canvas <beta@2guys1canvas.com>`. Receiving verification is not required for this outbound feature. Apply the additive beta request migration before deploying; configure both verified UUIDs in private `beta_reviewers`, preserving existing beta/owner roles. The five-minute Worker cron checks private due mail and wakes the existing container when needed. Provider response ID means accepted for delivery, not inbox receipt. Invitation retries preserve IDs; deliberate resend preserves prior links/roles. Beta delivery retains immutable provider payloads and keys with five attempts inside 23 hours. Failed/uncertain exhausted delivery requires operator reconciliation. No live delivery is verified locally.

The [original coordinator migration](supabase/migrations/20261001104120_workflow_coordinator_fencing.sql) and [Step 02 hardening](supabase/migrations/20261003203000_coordinator_dispatch_updates.sql) were observed applied in the 2026-10-08 live audit, with matching repository function bodies. Their RPCs are required by current hosted code; actual contention/takeover is still unverified. Stable primary-container affinity and bounded authenticated owner retry responses are implemented locally; real contention and hosted rollout remain pending. See the [Step 02 handoff](docs/harness/multiuser-step02-handoff.md) for compatibility, rollback and disposable-database checks. Step 03 implements verified private body publication and empty-cache restoration locally; real Storage/RLS/container recovery, previously discarded history and production scaling remain unverified. See the [Step 03 handoff](docs/harness/multiuser-step03-handoff.md).

Artifact recovery requires the existing **private** `cocreate-artifacts` bucket (or server `SUPABASE_ARTIFACT_BUCKET` with equivalent project-scoped policies). Server-only credentials upload/read immutable `<projectId>/bodies/<sha256>` objects; project members receive bytes through authenticated application routes. Public buckets fail closed. Publication verifies bodies before the canonical snapshot; opening restores the current six products/checkpoint and older archived products on demand. Missing/corrupt data reports a recovery failure; reopening does not rebuild or spend. Local-only mode still needs its data directory retained.

No new artifact SQL migration or historical migration runs in Step 03. New snapshots use `artifactSchemaVersion=2` with document descriptors and dehydrated body references; v1 application snapshots remain readable; old app versions cannot read them. After any new-format commit, do not roll back only the app. A reviewed rollback must drain writers, verify/materialize current bodies back into a compatible inline canonical snapshot under the owner fence, preserve request receipts/history/objects, then validate the older reader. No rollback or cleanup was executed. Keeping the current reader and immutable bodies is preferable; full compatibility notes are in the handoff.

The existing Cloudflare path uses a Worker, native container HTTP/WebSocket proxy and application readiness endpoints `/__cocreate/health` and `/__cocreate/app-health`. Encrypted `SESSION_SECRET` and `CREDENTIAL_ENCRYPTION_SECRET` are required runtime secrets. Build/deploy scripts are in `package.json`; production branch configuration historically uses main. GitHub checks now confirm pushes trigger Cloudflare Builds and Supabase integration; publication is a deployment action. This documentation cleanup does not deploy, configure secrets or apply migrations. Release readiness and post-deployment verification are in the [checklist](docs/harness/checklist.md).

Optional Postgres tooling uses transaction-mode `DATABASE_URL` and session-mode `DIRECT_URL`; placeholders in `.env.example` are non-operational. Preserve percent-encoded credentials locally. Prisma 7.10 is optional introspection/typed access; managed auth models are external and versioned Supabase SQL is the migration authority. Do not run Prisma Migrate against hosted tables without an explicit reconciled cutover.

Legacy import remains dry-run-first: `pnpm migrate:legacy -- --mapping scripts/trusted-owner-map.example.json`. Use trusted room-to-account UUIDs, never names or room-link ownership. Apply/confirm-target is a separately authorized operation after target/backup/hash/quarantine review.

## Checks and boundaries

```bash
pnpm test
pnpm build
pnpm start
```

The [Step 04 handoff](docs/harness/multiuser-step04-handoff.md) records current isolated-compilation checks, full test/build results and independent controlled Chrome regressions. The [Step 03 handoff](docs/harness/multiuser-step03-handoff.md) retains its dated recovery evidence. The [2026-10-01 report](docs/harness/reliability-verification.md) remains historical. Live hosted/provider/coordinator SQL and visual reference comparison remain pending.

Generated apps are bounded React/TypeScript frontends, with validated room-scoped operations, approved dependencies and restricted style-isolated preview/download. Compile uses pinned esbuild WASM in an OS-restricted child process; candidate code is never evaluated during compilation. Windows AppContainer/Job Object enforces secret stripping, network denial, memory/CPU/process/wall limits and cancellation. The prepared non-root Docker image adds Bubblewrap/prlimit and mandatory actual-boundary startup preflight; Linux/kernel acceptance is unrun here. Failure retains the previous artifact with no host fallback. See [Step 04 isolation/deployment handoff](docs/harness/multiuser-step04-handoff.md); CSP and tool policy remain additional boundaries. Current product/checkpoint bodies restore by private verified references; newly archived older versions restore on demand. Historical versions discarded before archival remain unavailable, and real deployed container replacement is unverified.

## Contributor entrypoints

Read [AGENTS.md](AGENTS.md), [context.md](context.md), [product.md](product.md) and [instructions.md](instructions.md). Use the canonical [architecture](docs/harness/architecture.md), [decisions](docs/harness/decisions.md), [checklist](docs/harness/checklist.md) and [API](api.md); each has a distinct responsibility. [UI assets](docs/ui-assets.md) records font/icon sources and the reference provenance.

Old managed-default, Recommended/Advanced wizard, three-mode activation and presentation guidance is preserved in the [historical archive](docs/harness/archive/2026-10-01-pre-consolidation/README.md), not current setup instructions. CoCreate-prefixed keys, paths and deployed origins remain compatibility identifiers; use 2guys1canvas for visible copy.


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

Set `AI_GATEWAY_API_KEY` privately in `.env.local` for Vercel AI Gateway; the audit selects Vercel when this variable is present. Use `--jev-provider vercel` explicitly to avoid ambiguity. This uses Vercel's [TypeSafe-compatible endpoint](https://vercel.com/docs/ai-gateway/sdks-and-apis/typesafe) and `typesafe-ai/jev` model ID. The gateway ID is an alias, not a pinned underlying version. Direct TypeSafe access remains available with `TYPESAFE_API_KEY` and `--jev-provider typesafe`, using pinned `jev-1.13.0`; a Vercel key must not be placed in that variable.

Use `--files` for a comma-separated graph/search shortlist, always retaining required authority/protocol contracts. `--snapshot <commit>` reviews committed source as a dated baseline. Reports, cached typed answers and physical-request accounting stay in ignored `artifacts/codebase-audit/`. Cache fingerprints include provider/endpoint; unpinned gateway-alias answers expire after 24 hours. Gateway-reported cost is recorded separately from input-token estimates. Requests have no automatic retries or cross-provider fallback; estimates are not provider-side spending caps. Jev judgments do not authorize removals or promotion. See [the plan](docs/harness/codebase-cleanup-plan.md) and [verification](docs/harness/codebase-cleanup-verification.md).

For the controlled three-profile browser reliability check, first build with `VITE_COCREATE_AUTH_MODE=local`, then run `pnpm exec tsx scripts/verify-reliability.ts`. Set `COCREATE_VERIFICATION_OUTPUT` to an isolated evidence directory. This check uses synthetic provider responses; it does not verify real hosted accounts or paid inference. Browser checks require the installed Chrome path used by the script.

GitHub code checks run installation from the lockfile, import boundaries, the existing test suite and production build. They make no Jev or paid provider requests.

Step 07 shows **Acceptance checks passed**, **Update blocked**, or **Limited acceptance coverage** with per-requirement implementation/check results. Supported exact filter, favorites and sorting criteria get trusted isolated-browser checks; other prose stays unverified. Failed covered behavior retains the previous product and stops without automatic provider repairs. Open the details to see the failed behavior before explicitly retrying or changing accepted steering. Read the [Step 07 handoff](docs/harness/multiuser-step07-handoff.md) for coverage, setup and local/hosted scope. Step 08 persists physical reservations through restart and keeps retries in the same allowance. Setup calls are separate. Read the [Step 08 handoff](docs/harness/multiuser-step08-handoff.md) for the owner reset contract and external rollout limits. Step 09 retains serial personal interpretation after controlled topology evaluation. Read the [Step 09 handoff](docs/harness/multiuser-step09-handoff.md) for tradeoffs and pending native/live checks. Step 10 exercises the combined local workflow and fixes HTTP shutdown ordering so in-flight reads finish before durable state closes. Read the [Step 10 handoff](docs/harness/multiuser-step10-handoff.md) for fresh checks, retained failures and release prerequisites. The canonical checklist distinguishes local integration evidence from hosted release readiness.
