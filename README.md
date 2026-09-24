# CoCreate

CoCreate is a local-first multiplayer agent-workflow workspace. Multiple authorized collaborators share one durable workflow: they co-write a brief, explicitly submit steering, inspect the real task plan and ordered activity, preserve requirement attribution, and receive versioned shared artifacts. The current Developer template uses one serialized executor to produce a React product in a restricted preview; Analyst and Researcher remain unavailable until their real tools and verification exist.

The right-side workflow panel is backed by durable server records. It shows the workflow phase/controller, planned and active tasks, safe activity summaries with an event cursor, and the latest promoted artifact's verification state. Compilation is labeled unverified unless functional acceptance checks actually passed. A server restart interrupts unfinished runs/tasks and waits for review rather than silently repeating side effects.

## Start

Requires Node.js 22+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`. The single command starts the React app, HTTP API, WebSocket collaboration server, local persistence, and preview service. Room data is stored in `data/` and survives restarts.

To test with multiple people, create a room, copy **Invite**, and open the URL on another browser or device. Add `?join=1` to a room URL when you want a new participant identity in another tab of the same browser. Other devices on the same network can use `http://COMPUTER_IP:5173`; Windows Firewall may ask you to allow local network access.

## Connect AI

Open **API connections** as the room owner. Recommended setup is the primary experience and explains that the owner's saved API powers its model assignments. Use **Connect your API** or **Connect or manage API · Advanced** to add or edit a provider, configure its endpoint, save an encrypted credential, optionally discover models in a visible selector, manually enter an exact model ID, explicitly run model tests, and assign the personal interpreter and shared executor. Return with **View recommended setup**, choose one of the three modes and a spending limit, inspect the models resolved from that checked connection, and apply the setup. Light, Medium, High, and Extra are selected later from the compact AI effort picker beside the canvas.

The only user-facing modes are **Developer**, **Analyst**, and **Researcher**. Light, Medium, High, and Extra are effort settings inside a mode. Developer uses the implemented app-building executor. Analyst is visibly unavailable until validated data ingestion and isolated reproducible computation exist; Researcher is visibly unavailable until controlled retrieval, source capture, and citation verification exist. CoCreate does not simulate either unavailable workflow. Existing General app, Engineer, Designer, Web developer, and Motion designer presets migrate to Developer without changing their saved models, credentials, effort, overrides, or historical runs.

The four model-test results separate authentication/reachability, text generation, interpreter structured output, and current Developer executor operations. Tests make real provider requests and may consume provider usage; opening settings, saving a connection, viewing recommendations, or changing selections does not run them.

Choose **Advanced: Choose my own models** to manage any number of named OpenAI, Anthropic, Google Gemini, OpenRouter, DeepSeek, custom OpenAI-compatible, or Ollama connections, exact manual model IDs, separate personal/builder assignments, and participant overrides. Existing rooms remain Custom until the owner explicitly opts into Recommended; switching views does not remove credentials, assignments, or overrides.

The four checks are intentionally separate: endpoint/authentication reachability, usable text generation, the internal requirements schema, and the internal project-operation schema. Passing them verifies the API contract for a small request; it does not certify a model's general coding quality. CoCreate never silently changes provider or model when a request fails.

Ollama defaults to `http://localhost:11434` and does not need a fake key. Here, localhost means the machine running the CoCreate server. Other HTTP endpoints are rejected; use HTTPS for remote/custom providers. When `COCREATE_HOSTED=true`, localhost and private-network targets are blocked to reduce server-side request-forgery risk.

Keys never enter the shared document or generated app; they are encrypted at rest using `CREDENTIAL_ENCRYPTION_SECRET` and are never returned to the browser.

Only the room owner can add, update, test, assign, or disconnect credentials or change the shared mode, effort, and spending policy. Collaborators receive read-only safe status and can use configured agents without receiving a key. [`server/ai-presets.ts`](server/ai-presets.ts) is the single versioned catalog for source-linked USD input, cached-input, cache-write, output, reasoning, tier, and routing-fee terms. Recommended setup shows per-interpreter and shared-executor allowances, an explicitly scoped estimated one-pass maximum, an incomplete marker when not every billable category is bounded, and a separate user-controlled spending limit. These are estimates, not provider invoices. Missing provider usage or billing categories remain unknown and are never shown as free. CoCreate has no managed-credit ledger, account authentication, or payment system; platform-managed AI is deliberately unavailable until those authorization and accounting prerequisites exist.

The spending limit is a total safety ceiling; it does not increase a model call's output-token allowance. The canvas-side effort control applies 8K / 12K / 20K / 32K executor output allowances for Light / Medium / High / Extra to future submissions in both Recommended and Advanced rooms. Advanced defaults to Medium and keeps its manually chosen models and participant overrides when effort changes. CoCreate locally recovers common JSON-envelope serialization defects without a provider call and still applies the exact schema and project validators. Incomplete output gets one bounded compact retry with usage retained; if that also fails, choose a higher effort or a model with stronger structured-output support.

## Product loop

Everyone brainstorms and co-writes in the same rich canvas. Typing, formatting, autosaving, and reconnecting do not invoke a model. **Build my changes** captures only the authenticated participant's unsubmitted edit records, acknowledges the final collaborative update, and starts a short collection window so nearby submissions can share one serialized build without losing attribution. Only the caller's edit records are submitted, and the builder receives the accepted registry. Personal-model context still includes a shared document snapshot, and the legacy build API can flush other drafts; complete source isolation and legacy-route enforcement remain hardening work. An empty submission reports **No new changes to submit** without an AI call. A failed generation keeps the last successful Product visible and reports the error.

On Windows and Linux, **Alt + X** invokes the same submission function while the shared editor has focus. The button exposes this through its tooltip and `aria-keyshortcuts`. The adjacent shortcut preference can remap it to Alt + S or Alt + Y, or disable it. macOS defaults to no shortcut so Option + X retains its normal text-input behavior; Mac users may explicitly choose a shortcut.

The submission collection window defaults to three seconds and is configurable with `BUILD_DEBOUNCE_MS`; `BUILD_COOLDOWN_MS` and `BUILD_MAX_WAIT_MS` still bound shared builder scheduling. Model inputs are compacted before dispatch. Each completed run stores a versioned call ledger with provider-reported input, cached input, cache writes, output, and separately available reasoning usage; pricing snapshots; interpretation/builder/repair breakdowns; latency; outcome; and explicit verification fields. Reasoning already included in provider output is not counted twice, the shared builder is counted once, and missing/timeout usage remains uncertain rather than zero.

The generated scope is deliberately bounded: a real multi-file React and TypeScript frontend under `generated/rooms/<room-id>`. The builder may use approved local React dependencies, relative source modules, CSS, JSON, and isolated app storage; it cannot request networks, cookies, parent-window access, dynamic imports, or backend code. Every file operation is validated, the project is compiled before promotion, and a failed update keeps the last working Product. The Product view can refresh, open in a new tab, or download a complete runnable project ZIP.

## Checks

```bash
pnpm test
pnpm build
pnpm start
```

## Deploy on Cloudflare

CoCreate deploys as a Cloudflare Worker backed by one Cloudflare Container because the application includes a Node.js server, WebSockets, build tooling, and local project files. Cloudflare Containers require a Workers Paid plan.

For a Git-connected production Worker:

1. Keep the Worker name as `cocreate`, matching `wrangler.jsonc`.
2. Set the production branch to `main`.
3. Use `pnpm build` as the build command and `pnpm deploy:cloudflare` as the deploy command.
4. Push to `main` and allow several minutes for the first container image to build and provision.

Before deployment, add `SESSION_SECRET` and `CREDENTIAL_ENCRYPTION_SECRET` as encrypted Worker secrets in the Cloudflare dashboard or with `wrangler secret put`. Both values are required by the container and must never be added to `wrangler.jsonc` or the repository. The Worker uses Cloudflare's native container proxy so ordinary HTTP requests and WebSocket upgrades follow the same startup and routing path; `/__cocreate/health` checks the Worker and `/__cocreate/app-health` checks the application inside the container. Collaboration retries are bounded and diagnose invalid sessions or missing rooms through the authenticated room-state route. Recoverable edits remain in the current tab and resynchronize with Yjs, but they are not durable across a reload.

Tests cover signed participant attribution, character-level Yjs edits across three WebSocket clients, evolving requirements, owner-only provider setup, mixed-provider role assignment, secret redaction, serialized builds, failed-build retention, append-only recovery, interrupted run states, deny-before-execution tool policy, validated multi-file operations, runnable downloads, and preview compilation. Adapter contract fixtures cover all seven adapters, model discovery/manual IDs, authentication errors, successful text and structured output, schema failures, empty/truncated output, rate-limit retries, and cancellation. They do not spend or require a real API key.

## Architecture

- `src/` — React workspace with Document/Product tabs, split view, participant presence, owner settings, and save/build status.
- `server/rooms.ts` — room isolation, Yjs persistence, presence, participant debouncing, exactly-one serialized orchestrator, versioning, rollback.
- `server/providers.ts` — provider adapters, native authentication/request parsing, retries, error classification, model discovery, usage normalization, and schema validation.
- `server/generator.ts` — provider-independent agent prompts, internal structured schemas, and deliberately budgeted whole-file context.
- `server/ai-presets.ts`, `server/ai-accounting.ts` — canonical published-rate catalog, deterministic allowances, normalized charge calculations, run aggregation, and comparable effectiveness metrics.
- `server/project.ts` — room-scoped file operations, project persistence, dependency policy, and compile validation.
- `server/event-store.ts` — SQLite event history, content-addressed artifacts, derived workspace/run views, migrations, and recovery.
- `server/tool-registry.ts` — typed generated-project tools, deny-by-default policy, and audited execution outcomes.
- `server/credentials.ts` — authenticated encryption for room provider credentials.
- `server/preview.ts` — unique-origin CSP preview with isolated room application storage.
- `docs/harness/` — evidence-based assessment, architecture, migration plan, and tracked acceptance checklist.

## Current boundaries

This MVP uses SQLite plus local generated-project files and is intended for a trusted LAN or single server with persistent storage. Room links are high-entropy access links; there is no account system or enterprise authorization. The current Cloudflare Container configuration does not persist application data across container replacement, so production recovery there is not yet guaranteed. Generated apps are frontend-only and run in a restricted browser preview, but compilation still occurs inside the CoCreate server process; a dedicated sandboxed build/runtime service is required before treating generated build execution as a security boundary. See `docs/harness/` for the exact completed and remaining acceptance criteria.

## AI steering documents

Start with [AGENTS.md](AGENTS.md), [context.md](context.md), [product.md](product.md), and [instructions.md](instructions.md). Canonical design and progress live in [docs/harness/architecture.md](docs/harness/architecture.md), [decisions.md](docs/harness/decisions.md), and [checklist.md](docs/harness/checklist.md); implemented contracts live in [api.md](api.md). Product requirements are not completion evidence. Update affected documents alongside changes; do not duplicate architecture or progress files at the root.

The workspace uses a dark editorial presentation with restrained neubrutalist accents. Third-party font and icon sources are recorded in [docs/ui-assets.md](docs/ui-assets.md); generated Product previews remain visually isolated from workspace styling.
## Supabase saved projects

Hosted CoCreate uses Supabase Google Auth, Postgres project/membership records, and private Storage while keeping Express, Yjs, and the existing agent harness. Production browser configuration is injected into the Vite build through the container `image_vars` in `wrangler.jsonc`; local builds use the matching `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_COCREATE_APP_ORIGIN` variables. Missing, malformed, or project-mismatched values fail closed. Keep `SUPABASE_SECRET_KEY`, provider credentials, session/encryption secrets, and migration credentials server-only.

CoCreate is a Vite SPA with an Express API, not a Next.js application. The browser client therefore uses `@supabase/supabase-js` with persisted PKCE sessions and automatic refresh; authenticated project requests refresh near-expiry sessions and retry one 401 once. `@supabase/ssr` is installed for a possible future cookie/SSR host, but Next.js `page.tsx`, `next/headers`, and middleware/proxy files are intentionally not active entrypoints here.

1. The initial hosted schema migration is applied to the verified target project. For later schema changes, continue using versioned files under `supabase/migrations` and the Supabase CLI; run `supabase test db` against a local stack when available.
2. In Google Cloud, authorize the Supabase provider callback `https://dnsapasubeoxxsgkiotw.supabase.co/auth/v1/callback`. This is Google's return to Supabase, not the application's callback.
3. In Supabase Auth URL Configuration, set the Site URL to `https://cocreate.susan981314271.workers.dev` and allow the exact application callback `https://cocreate.susan981314271.workers.dev/api/auth/callback`. Allow `http://localhost:5173/api/auth/callback` separately for local development. `cocreate.pages.dev` is a different application and must not be used for CoCreate OAuth.
4. Set `COCREATE_APP_ORIGINS` to the exact local/production origins and configure the listed server/public environment variables.
5. Start CoCreate and verify sign in → create → write → sign out → sign in → reopen before enabling collaborators.

Direct Postgres tooling may use the optional pooler templates in `.env.example`. Supply the database password locally and percent-encode reserved characters in its URI user-info component. Normal Supabase API access does not require these URLs, and their placeholders are intentionally non-operational.

Prisma 7.10 is pinned with matching client and PostgreSQL adapter packages. `.env.local` separates the transaction-mode `DATABASE_URL` used by serverless runtime connections from the session-mode `DIRECT_URL` used by Prisma CLI operations. `prisma7.config.ts` deliberately loads `.env.local` and points CLI operations at `DIRECT_URL`; Prisma 7 keeps connection URLs out of `schema.prisma`. The schema is introspected across `public` and `auth` only because public foreign keys reference `auth.users`; all Supabase-owned auth tables and enums are declared external to Prisma Migrate. Supabase SQL migrations remain authoritative, so do not run Prisma Migrate against production until the two migration histories have an explicit cutover plan. Both URLs must contain the same percent-encoded database password.

The repository includes a project-scoped Supabase MCP server in `.mcp.json`. Claude Code users must authenticate it interactively from a regular terminal with `/mcp`; the OAuth credential is held by the MCP client and must not be committed. The configured database, development, debugging, functions, and branching groups can mutate the selected project, so review proposed tool calls before approval.

Legacy import is dry-run-first: `pnpm migrate:legacy -- --mapping scripts/trusted-owner-map.example.json`. It never maps names or room-link holders to accounts. Review the report, verify `SUPABASE_URL`, then use `--apply --confirm-target`; the tool backs up local data first, hashes inputs, reruns idempotently, and quarantines unmapped rooms.

Live OAuth, remote RLS, and Storage evidence are pending until a complete server secret and dashboard configuration are available. The arithmetic/unit suite does not impersonate that evidence.
