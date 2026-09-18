# CoCreate

CoCreate is a local-first collaborative vibe-coding canvas. Multiple collaborators brainstorm and co-write in one Google Docs–style document while private idea lenses preserve who contributed what. One serialized builder continuously synthesizes the whole canvas into a shared React product shown in a restricted browser preview.

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

Everyone brainstorms and co-writes in the same rich canvas. Each collaborator's evolving contribution is maintained separately as additions, modifications, and withdrawals so ideas are combined without losing authorship. Edits are coalesced into stable revisions: the personal agent waits for a short idle window, and the builder waits for room-wide stability, skips semantically unchanged summaries, and enforces a cooldown between automatic builds. New edits cancel stale in-flight work where the provider supports cancellation. **Build now** bypasses those timers, incorporates every pending contribution, then runs the single builder immediately. A failed generation keeps the last successful Product visible and reports the error.

The timing defaults are configurable with `AGENT_DEBOUNCE_MS` (4 seconds), `BUILD_DEBOUNCE_MS` (10 seconds), `BUILD_COOLDOWN_MS` (30 seconds), and `BUILD_MAX_WAIT_MS` (60 seconds). Model inputs are compacted before dispatch, and provider-reported request/input/output token totals are persisted in each room's state for comparison and budgeting.

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

Before deployment, add `SESSION_SECRET` and `CREDENTIAL_ENCRYPTION_SECRET` as encrypted Worker secrets in the Cloudflare dashboard or with `wrangler secret put`. Both values are required by the container and must never be added to `wrangler.jsonc` or the repository. The Worker uses Cloudflare's native container proxy so ordinary HTTP requests and WebSocket upgrades follow the same startup and routing path; `/__cocreate/health` checks the Worker and `/__cocreate/app-health` checks the application inside the container.

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
