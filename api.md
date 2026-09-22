# CoCreate API reference

Source-inspected 2026-09-21. Describes the current implementation, not proposed endpoints. Canonical sources: `server/index.ts`, `server/rooms.ts`, `server/ai-presets.ts`, `server/auth.ts`, `src/types.ts`, and `src/provider.ts`.

## Transport and authentication

HTTP and WebSocket use the same host as the client; local default is http://localhost:5173. JSON bodies use Content-Type: application/json and the server's body limit is 40 KB.

Authenticated HTTP routes accept Authorization: Bearer <session-token>. A `token` query parameter is also currently supported; prefer headers where possible to avoid URL leakage. Tokens must not be logged or included in documentation examples.

Session tokens are custom HMAC-SHA256-signed base64url payload/signature pairs, not JWTs. Payload: `{roomId, participantId, name}`. The current verifier has no expiry check. There is no account/OAuth login flow. Room links grant the ability to join; first participant becomes owner. This is not enterprise authorization.

Invalid sessions return 401 with `{error: string}`; missing or mismatched rooms return 404; owner-only operations return 403 for other participants. Many caught operation/provider failures are currently mapped to HTTP 400 with `{error: string}`. Capability failure can also be expressed within a successful JSON response; inspect check statuses.

## Rooms and sessions

| Method and path | Auth | Request | Response |
| --- | --- | --- | --- |
| POST /api/rooms | None | Empty object | `{roomId, inviteUrl}`; inviteUrl is `/r/<roomId>` |
| POST /api/session | None | `{roomId: string, name: string, token?: string}` | `{token: string, participantId: string, owner: boolean}` |
| GET /api/rooms/:id/state | Participant | None | `RoomView` |

Session names are trimmed and limited to 40 characters. Supplying a valid token for the same room reuses that participant identity. Do not invent a client-chosen participant ID.

## Named AI connections (preferred API)

All operations below require the room owner. Saving a connection does not certify inference or coding quality.

The browser's persistent **API connections** control leads with Recommended setup and links prominently to this named-connection contract in Advanced. Recommended resolution uses exact capability-checked models from the owner's saved connection; it does not supply platform credentials. Model tests run only through the explicit `check` request and may consume provider usage. The four returned checks mean authentication/reachability, basic text, interpreter structured output, and the current Developer project-operation schema; they do not certify broad quality or Researcher/Analyst capabilities. Collaborators can read only the redacted `RoomView.ai` status and cannot call these mutations successfully.

| Method and path | Request | Response |
| --- | --- | --- |
| POST /api/rooms/:id/ai/connections | `{id?: string, name: string, provider: AIProvider, baseUrl?: string, apiFormat?: AIFormat, apiKey?: string}` | `{id: string}` |
| GET /api/rooms/:id/ai/recommendation | query: `mode`, `effort` | Server-resolved `AIRecommendation`; read-only and makes no model call |
| POST /api/rooms/:id/ai/recommendation | `{mode, effort, maximumSpendUsd}` | Applied Developer `AIRecommendation` or actionable 400; unavailable modes cannot be applied |
| POST /api/rooms/:id/ai/connections/:connectionId/models | Empty object | `{models: AIModel[]}` |
| POST /api/rooms/:id/ai/connections/:connectionId/check | `{model: string}` | `ModelChecks` |
| DELETE /api/rooms/:id/ai/connections/:connectionId | None | `{ok: true}` |
| POST /api/rooms/:id/ai/assignments | `{personal: AgentAssignment, builder: AgentAssignment, participantOverrides?: Record<string, AgentAssignment>}` | `{ok: true}` |

Use `id` to update an existing connection. For a credential-requiring provider, an existing encrypted credential can be reused when no new key is supplied. Ollama does not require a fake key. Read safe connection state from RoomView.ai; no saved secret is returned.

```ts
type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'openrouter'
  | 'deepseek' | 'custom' | 'ollama';
type AIFormat = 'responses' | 'chat-completions';
type AgentAssignment = { connectionId: string; model: string };
type AIModel = {
  id: string; name: string; contextLength?: number;
  textOutput?: boolean | 'unknown';
};
type CapabilityCheck = {
  status: 'unverified' | 'passed' | 'failed'; reason?: string;
};
type ModelChecks = {
  reachable: CapabilityCheck; text: CapabilityCheck;
  personal: CapabilityCheck; builder: CapabilityCheck; checkedAt?: string;
};
```

Formats are configuration options, not a promise that all providers share the OpenAI protocol. Adapters own provider-specific behavior. Successful model discovery returns the account-visible IDs and the client presents them as selectable options while preserving exact manual entry. Discovery is not proof that the account can generate with every listed model. Capability checks issue inference requests and may consume usage.

## Legacy AI routes (currently retained)

Owner-only; use the named-connection API for new UI work.

- POST `/api/rooms/:id/ai/test`: `{apiKey, model, provider?, baseUrl?, apiFormat?}`; returns `{ok: true, model, provider, apiFormat, usage}`. Usage is provider-normalized and may omit unavailable values. This is not ModelChecks.
- POST `/api/rooms/:id/ai/models`: `{apiKey, provider?, baseUrl?, apiFormat?}`; returns `{models, provider, baseUrl, apiFormat}`.
- POST `/api/rooms/:id/ai/connect`: `{apiKey, personalModel, builderModel?, provider?, baseUrl?, apiFormat?}`; returns `{ok: true}`. Missing builderModel defaults to personalModel.
- POST `/api/rooms/:id/ai/disconnect`: empty object; returns `{ok: true}`.

## Building and preview

| Method and path | Auth | Request | Response |
| --- | --- | --- | --- |
| POST /api/rooms/:id/build | Participant | Empty object | `{ok: true}` after awaited buildNow |
| POST /api/rooms/:id/submit | Participant | `{requestId: string}` | Participant-scoped submission result; retained repeated request IDs are idempotent and an empty draft returns `No new changes to submit` |
| POST /api/rooms/:id/process | Participant | `{correction?: string}` | `{ok: true}` after processing the authenticated participant |
| POST /api/rooms/:id/reinterpret | Participant | Empty object | `{ok: true}` after reprocessing that participant's latest authenticated edit batch |
| POST /api/rooms/:id/runtime-error | Participant | `{message: string, version: number}` | `{ok: true}` |
| GET /api/rooms/:id/download/:version | Participant | None | application/zip attachment; legacy versions without files return 404 text |
| GET /preview/:id/:version | No explicit session check | None | text/html; missing version returns 404 text |

The submission route consumes only the authenticated participant's unsubmitted edit records. It snapshots their edit sequence IDs, participant revision, shared document context, previous interpretation reference, creation time, and lifecycle status before inference. The shared snapshot can include other participants' unsubmitted text as personal-model context; source scoping is not yet a complete isolation guarantee. The current room submission list retains only the last 200 entries, limiting request-ID deduplication. The legacy `/build` route remains callable and flushes all participants' pending drafts through `buildNow`; the active UI does not use it. This legacy route conflicts with the intended participant-only submission contract and requires hardening.

`ok: true` is an operation response, not evidence that every requirement passed browser acceptance. Inspect room status, lastError, and latestVersion. The preview route is currently accessible by its room/version URL; do not describe it as session-protected. It sends Cache-Control: no-store and Referrer-Policy: no-referrer.

Reinterpretation is deliberately targeted: it reuses the authenticated edit sequence recorded on the participant's latest interpretation, replaces only that interpretation's requirement sources, retains stable shared-requirement IDs and other contributors, and creates a new immutable snapshot/event. It does not globally reclassify a room. Settled decisions and explicit withdrawals require a new human correction; missing historical edits produce an explicit error. An unchanged accepted-requirement fingerprint does not schedule another build.

No current route exposes approval decisions, owner contradiction resolution, a public run-history API, pause, or rollback. Do not invent those client contracts from target architecture documents.

No current route exposes managed platform credentials, accounts, balances, purchases, webhooks, a credit ledger, room billing authorization, Researcher retrieval, or Analyst data upload. Recommended setup stores the selected workflow mode when it is available; only Developer can currently be applied. Analyst and Researcher recommendation previews return `modeAvailable: false` with an actionable prerequisite and never simulate execution.

## Shared response models

Import exact contracts from `src/types.ts`; do not maintain a second application type definition from this prose.

RoomView includes:
- `roomId`, `ownerId`, `participants`, `ai`.
- `status`: Waiting for ideas | Collecting submissions | Understanding edits | Decision needed | Building | Updated | Error.
- `requirements`, authoritative `conflictGroups`, derived compatibility `contradictions`, `specificationRevision`, `requirementsRevision`.
- `latestVersion: number | null`, `versions`, optional `lastError`.
- `debounceMs`, `buildDebounceMs`, `buildCooldownMs`, cumulative `usage`, and the last 50 `aiRuns`.
- Optional `savedAt` and `persistRevision`.

`AIConnection` includes safe named connections, optional default personal/shared-executor assignments, participant overrides, and an optional `AISetupPolicy`. A policy is either `custom` or a versioned `recommended` workflow-mode/effort configuration with exact resolved layers and a user-controlled spending limit. `SafeAIConnection` includes ID/name/provider/base URL, optional API format, hasCredential, status, model list, per-model checks, and optional lastError. It never includes a raw key. On normalization, any legacy General app, Engineer, Designer, Web developer, or Motion designer active preset gains `workflowMode: developer`; its assignments, encrypted credential, effort, overrides, resolved layers, and spending ceiling are unchanged. Historical run `specialty` fields remain readable and are not rewritten.

Both recommendation routes are owner-only. Previewing a recommendation is pure resolution: it does not check capabilities, call a provider, change assignments, or start a build. Applying re-resolves on the server, requires passed role capabilities, rejects a maximum below its conservative bound, and affects future submissions/runs. Manual `/ai/assignments` activation marks the room Custom and preserves overrides.

Recommendations expose `workflowMode`, `modeAvailable`, optional `unavailableReason`, `routingRuleVersion`, `routingReason`, `status`, same-connection `builderCandidates`, `onePassEstimateUsd`, `maximumEstimateUsd`, `estimateScope`, and `estimateComplete`. The one-pass scope is one submitted participant interpretation plus one shared executor call, without repairs or additional participant interpretations, and assumes uncached input. The bounded maximum includes configured executor/structured-output repairs but only one interpreter, so it is marked incomplete when team size or other provider charges are unknown. `status: hypothesis` means compatibility and prices are known but comparative quality is not measured. The spending limit is a safety ceiling, not an expected charge.

`AIRate` is a frozen catalog snapshot containing USD input/output rates, optional cached-input/cache-write rates, reasoning treatment, optional long-context tiers/platform multiplier/other charges, official source URL, and verification date. `AIRunRecord` freezes the effective models and routing/pricing/verification-policy versions; call-level `interpretation`, `builder`, and `repair` entries; normalized usage; estimated charge; uncertainty; latency; outcome; and separate verification fields. Provider reasoning tokens marked as included in output are informational and are never added to the charge again. A timeout or omitted provider field remains unknown. `compilationPassed` must not be read as requirement or regression proof.

`SharedRequirement` includes ID/revision/category/description/acceptanceCriteria/status/authority/sources/timestamps. Current statuses: proposed, accepted, withdrawn, superseded. Current categories: goal, feature, design, constraint. Implemented/verified evidence states are planned, not current fields.

Each participant `Requirement` interpretation may include `classifierVersion` and an `intents` array. Every intent has its own text, category, classification, short rationale, exact source passage, affected requirement IDs, participant attribution, source revision, and authenticated edit sequence IDs. Current classifications are `proposal`, `question`, `explicit_request`, `decision`, and `ambiguity`. Missing or invalid classifications normalize to `ambiguity`, never silently to an accepted request. Legacy interpretation arrays remain readable and are migrated into per-intent records during normalization.

`ConflictGroup` includes stable ID/revision/round, subject/scope, all alternatives and requirement revisions, contributor sources, required resolver IDs, explicit selections, state (`awaiting_choices`, `disagreement`, `resolved`, or `obsolete`), detection status, decision history, optional last agreed baseline, affected build scopes, and timestamps. `Contradiction` remains a derived compatibility view during the UI/API transition. No selection mutation endpoint is implemented in this slice.

`Version` includes ID, createdAt, summary, optional fileCount/conflicts, and the promoted run's `aiRun`. `AIUsage` includes request counts, input/output totals, optional cached/cache-write/reasoning totals, and optional estimated/uncertain cost. It is an operational estimate, not confirmed provider billing.

## WebSocket collaboration

Connect to `/ws?room=<roomId>&token=<session-token>` using ws or wss to match the page. Invalid room/session upgrades are rejected. The shared document uses the Yjs `default` XML fragment.

Binary frames use one discriminator byte followed by payload:
- 0: Yjs document update; client sends edits, server sends synchronization and relayed updates.
- 1: Yjs awareness update.
- 2: Server state vector; client replies with a type-0 update containing its missing changes when present.

Client JSON:
- `{type: 'awareness-client', clientId: number}`.
- `{type: 'flush', requestId: string}` asks the server to acknowledge all earlier ordered WebSocket frames before the client captures a submission.

Server JSON:
- `{type: 'room-state', state: RoomView}`.
- `{type: 'saved', revision: number, savedAt: string}`.
- `{type: 'flushed', requestId: string}`.

The browser provider reports `connecting`, `connected`, bounded `reconnecting`, and terminal `error` states. Transient failures use capped exponential backoff with jitter (six attempts, capped at roughly 10 seconds before jitter). Before retrying, the client calls the existing authenticated room-state route: 401 becomes an invalid-session action, 404 becomes a missing-room action, and 403 becomes a permission error. Upgrade rejection responses and server logs contain only a safe category/correlation ID; tokens and authenticated URLs are not logged by application code.

The provider keeps its Y.Doc in memory and answers the server state vector after a successful reconnect, so edits made during a recoverable disconnect are resynchronized. A disconnected or unacknowledged flush rejects before `/submit` is called. Do not promise persisted offline browser edits across a page reload: this client does not implement a durable browser Yjs store.

## Maintenance

When routes, authorization, shared types, or WebSocket messages change, update this file alongside implementation and contract tests. Separate implemented contracts from proposed extensions. This reference was checked against source, not against a live API session.
