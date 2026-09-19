# CoCreate

CoCreate is a local-first collaborative vibe-coding canvas. Multiple collaborators brainstorm and co-write in one Google Docs–style document while private idea lenses preserve who contributed what. Participants explicitly submit their own changes, and one serialized builder synthesizes eligible submissions into a shared React product shown in a restricted browser preview.

## Start

Requires Node.js 22+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`. The single command starts the React app, HTTP API, WebSocket collaboration server, local persistence, and preview service. Room data is stored in `data/` and survives restarts.

To test with multiple people, create a room, copy **Invite**, and open the URL on another browser or device. Add `?join=1` to a room URL when you want a new participant identity in another tab of the same browser. Other devices on the same network can use `http://COMPUTER_IP:5173`; Windows Firewall may ask you to allow local network access.

## Connect AI

Open **API connections** as the room owner. Add any number of named OpenAI, Anthropic, Google Gemini, OpenRouter, DeepSeek, custom OpenAI-compatible, or Ollama connections. Save the provider settings and credential, optionally discover account models, or enter an exact model ID manually. Run capability checks before assigning that connection/model to the default personal idea agent, shared builder, or a participant override.

The four checks are intentionally separate: endpoint/authentication reachability, usable text generation, the internal requirements schema, and the internal project-operation schema. Passing them verifies the API contract for a small request; it does not certify a model's general coding quality. CoCreate never silently changes provider or model when a request fails.

Ollama defaults to `http://localhost:11434` and does not need a fake key. Here, localhost means the machine running the CoCreate server. Other HTTP endpoints are rejected; use HTTPS for remote/custom providers. When `COCREATE_HOSTED=true`, localhost and private-network targets are blocked to reduce server-side request-forgery risk.

Keys never enter the shared document or generated app; they are encrypted at rest using `CREDENTIAL_ENCRYPTION_SECRET` and are never returned to the browser.

Only the room owner can add, update, test, assign, or disconnect credentials. Collaborators receive safe status and can use configured agents without receiving a key. Token/rate-limit values are treated as unknown when the provider does not return them; CoCreate does not label models as free or estimate cost without maintained pricing data.

## Product loop

Everyone brainstorms and co-writes in the same rich canvas. Typing, formatting, autosaving, and reconnecting do not invoke a model. **Build my changes** captures only the authenticated participant's unsubmitted edit records, acknowledges the final collaborative update, and starts a short collection window so nearby submissions can share one serialized build without losing attribution. Only the caller's edit records are submitted, and the builder receives the accepted registry. Personal-model context still includes a shared document snapshot, and the legacy build API can flush other drafts; complete source isolation and legacy-route enforcement remain hardening work. An empty submission reports **No new changes to submit** without an AI call. A failed generation keeps the last successful Product visible and reports the error.

On Windows and Linux, **Alt + X** invokes the same submission function while the shared editor has focus. The button exposes this through its tooltip and `aria-keyshortcuts`. The adjacent shortcut preference can remap it to Alt + S or Alt + Y, or disable it. macOS defaults to no shortcut so Option + X retains its normal text-input behavior; Mac users may explicitly choose a shortcut.

The submission collection window defaults to three seconds and is configurable with `BUILD_DEBOUNCE_MS`; `BUILD_COOLDOWN_MS` and `BUILD_MAX_WAIT_MS` still bound shared builder scheduling. Model inputs are compacted before dispatch, and provider-reported request/input/output token totals are persisted in each room's state for comparison and budgeting.

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
