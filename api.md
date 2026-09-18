# CoCreate API reference

Source-inspected 2026-09-18. Describes the current implementation, not proposed endpoints. Canonical sources: `server/index.ts`, `server/rooms.ts`, `server/auth.ts`, `src/types.ts`, and `src/provider.ts`.

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

| Method and path | Request | Response |
| --- | --- | --- |
| POST /api/rooms/:id/ai/connections | `{id?: string, name: string, provider: AIProvider, baseUrl?: string, apiFormat?: AIFormat, apiKey?: string}` | `{id: string}` |
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

Formats are configuration options, not a promise that all providers share the OpenAI protocol. Adapters own provider-specific behavior. Model discovery is not proof that the account can generate with every listed model. Capability checks issue inference requests and may consume usage.

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
| POST /api/rooms/:id/process | Participant | `{correction?: string}` | `{ok: true}` after processing the authenticated participant |
| POST /api/rooms/:id/runtime-error | Participant | `{message: string, version: number}` | `{ok: true}` |
| GET /api/rooms/:id/download/:version | Participant | None | application/zip attachment; legacy versions without files return 404 text |
| GET /preview/:id/:version | No explicit session check | None | text/html; missing version returns 404 text |

`ok: true` is an operation response, not evidence that every requirement passed browser acceptance. Inspect room status, lastError, and latestVersion. The preview route is currently accessible by its room/version URL; do not describe it as session-protected. It sends Cache-Control: no-store and Referrer-Policy: no-referrer.

No current route exposes approval decisions, owner contradiction resolution, a public run-history API, pause, or rollback. Do not invent those client contracts from target architecture documents.

## Shared response models

Import exact contracts from `src/types.ts`; do not maintain a second application type definition from this prose.

RoomView includes:
- `roomId`, `ownerId`, `participants`, `ai`.
- `status`: Waiting for ideas | Understanding edits | Decision needed | Building | Updated | Error.
- `requirements`, `contradictions`, `specificationRevision`, `requirementsRevision`.
- `latestVersion: number | null`, `versions`, optional `lastError`.
- `debounceMs`, `buildDebounceMs`, `buildCooldownMs`, `usage`.
- Optional `savedAt` and `persistRevision`.

`AIConnection` includes safe named connections, optional default personal/builder assignments, and participant overrides. `SafeAIConnection` includes ID/name/provider/base URL, optional API format, hasCredential, status, model list, per-model checks, and optional lastError. It never includes a raw key.

`SharedRequirement` includes ID/revision/category/description/acceptanceCriteria/status/authority/sources/timestamps. Current statuses: proposed, accepted, withdrawn, superseded. Current categories: goal, feature, design, constraint. Implemented/verified evidence states are planned, not current fields.

`Contradiction` includes ID, requirement IDs, reason, question, open/resolved status, consequential flag, and timestamps. `Version` includes ID, createdAt, summary, optional fileCount/conflicts. `AIUsage` includes request counts and input/output token totals; it is not a currency-cost contract.

## WebSocket collaboration

Connect to `/ws?room=<roomId>&token=<session-token>` using ws or wss to match the page. Invalid room/session upgrades are rejected. The shared document uses the Yjs `default` XML fragment.

Binary frames use one discriminator byte followed by payload:
- 0: Yjs document update; client sends edits, server sends synchronization and relayed updates.
- 1: Yjs awareness update.
- 2: Server state vector; client replies with a type-0 update containing its missing changes when present.

Client JSON: `{type: 'awareness-client', clientId: number}`.

Server JSON:
- `{type: 'room-state', state: RoomView}`.
- `{type: 'saved', revision: number, savedAt: string}`.

The current browser provider retries after approximately one second and keeps the Y.Doc in memory. Do not promise persisted offline browser edits across a page reload: this client does not implement a durable browser Yjs store.

## Maintenance

When routes, authorization, shared types, or WebSocket messages change, update this file alongside implementation and contract tests. Separate implemented contracts from proposed extensions. This reference was checked against source, not against a live API session.
