# 2guys1canvas implemented API contracts

Source-inspected 2026-10-02 against `server/index.ts`, `server/project-routes.ts`, `server/rooms.ts`, `server/byok-lease.ts`, `server/supabase-platform.ts` and `src/types.ts`. This reference records implemented contracts, not live API verification. [Product](product.md) owns acceptance; [architecture](docs/harness/architecture.md) owns persistence boundaries; [checklist](docs/harness/checklist.md) owns remaining checks.

## Transport and authorization

HTTP/socket requests use the client host; local default is `http://localhost:5173`. JSON body limit is 40 KB. Prefer `Authorization: Bearer <token>` over the currently supported room-route token query parameter; never log credentials or authenticated URLs.

Hosted project routes use a Supabase access token verified for issuer/audience/signature/expiry. `POST /api/projects/:id/session` verifies account and membership, claims coordinator ownership, hydrates the room if needed and returns a separate five-minute signed project ticket. Participant ID equals account UUID. Room/preview/download middleware requires that ticket, current membership and coordinator authority; mutations require owner/editor. A URL alone grants nothing. Viewers cannot submit edits or room commands.

Local mode uses HMAC-SHA256 signed room participant tokens `{roomId, participantId, name}`; local creation/join has no account identity or expiry guarantee. These compatibility sessions are not hosted authorization. Invalid room tickets return 401, missing rooms 404 and denied permission usually 403; caught operation/provider failures commonly return 400 `{error}`. Operation success is not functional acceptance.

Hosted use requires the service-role coordinator RPCs in [20261001104120_workflow_coordinator_fencing.sql](supabase/migrations/20261001104120_workflow_coordinator_fencing.sql). This migration is recorded as prepared/unapplied; live SQL/account behavior is unverified. Missing RPCs fail closed and non-owner instances are not automatically routed to the owner.

## Authenticated project routes

| Method and path | Permission | Request/result |
| --- | --- | --- |
| GET `/api/projects?search=&archived=&offset=&limit=` | Authenticated account | Membership-scoped recent-first paginated list |
| POST `/api/projects` | Authenticated account | `{title?, workflowMode?}`; only Developer; creates project/owner and returns project with 201 |
| PATCH `/api/projects/:id` | Owner | `{title?, archived?}`; rename/archive/restore |
| POST `/api/projects/:id/session` | Member | `{token, participantId, role, expiresAt}` |
| GET `/api/projects/:id/sharing` | Owner or explicit sharing member | Members and pending invitations |
| POST `/api/projects/:id/invites` | Owner or explicit sharing member | `{emails?: string[], email?, role?, ttlHours?, requestId?}`; 1–10 normalized recipients, editor/viewer, defaults editor/72 hours; per-recipient results |
| POST `/api/projects/:id/invites/:inviteId/resend` | Same sharing authority | `{ttlHours?, requestId?}`; creates another link, preserves earlier link |
| DELETE `/api/projects/:id/invites/:inviteId` | Same sharing authority | Explicit pending-invite revoke |
| PATCH `/api/projects/:id/members/:memberId` | Sharing authority; owner for sharing grant | `{role?, canShare?}`; non-owner roles editor/viewer |
| POST `/api/invites/accept` | Matching confirmed account | `{token}` → `{projectId}`; transactional/idempotent |
| Any `/api/projects/:id/managed-funding`, `/managed-spenders/:memberId` | Authenticated member | 410; managed funding inactive |

Titles are trimmed, required and at most 120 characters; omitted creation title becomes Untitled project. Tokens are 256-bit random values, authorized through SHA-256 hashes. New invite links also store encrypted tokens for request replay; legacy links/hashes remain valid until expiry, acceptance or explicit revoke. Request IDs use 8–100 letters/digits/underscore/hyphen; omission generates a new ID, so callers should retain one for uncertain replies. Multi-recipient creation derives an email-specific replay key. Changed payload under a reused key fails. Deliberate resend preserves old pending links and acceptance preserves existing membership roles. Creation/resend is limited to 30 per actor/hour.

Server email uses `RESEND_API_KEY` and a syntactically valid verified-domain `COCREATE_EMAIL_FROM`. Missing/invalid config returns `configuration_required` and actionable delivery error per address. Only a successful provider response with ID means `sent`; this is acceptance, not inbox delivery. Replayed already-sent invitations do not resend. Provider idempotency has a retention window; uncertain outcomes outside it need reconciliation.

Browser auth is Google PKCE plus email/password signup, confirmation resend, login, recovery, authenticated password change and logout. Safe same-origin return paths include invite links. Callback derives from configured app origin: established production `https://cocreate.susan981314271.workers.dev/api/auth/callback`, separately configured localhost development, with legacy `/auth/callback` recovery. Callback restores session, exchanges a code once and removes parameters. A failed/cancelled new login with an existing session requires explicit Continue/Switch account. Project requests refresh near expiry and allow one refresh/retry after 401. None of these client states replaces backend membership.

## Active temporary OpenRouter routes

All mutations below require the room/project owner, including a current hosted owner check.

| Method and path | Request/result |
| --- | --- |
| POST `/api/rooms/:id/ai/openrouter/connect` | `{apiKey}`; validates key and discovers compatible models without generation; returns redacted handle/sponsor/expiry/model/spender metadata |
| POST `/api/rooms/:id/ai/openrouter/models` | `{handle, interpreterModel, builderModel}`; validates both exact returned IDs and saves assignments |
| PUT `/api/rooms/:id/ai/openrouter/spenders/:memberId` | `{authorized: boolean}`; target must be owner/editor |
| POST `/api/rooms/:id/ai/openrouter/disconnect` | Revokes memory lease and disconnects |

The key is never serialized into room state/snapshots and lasts two hours in process memory. Expiry/restart requires reconnecting. Discovery compatibility requires text output, structured response support, finite rates/context and minimum context; metadata compatibility is not a paid capability or quality test. Requested builder/interpreter output is 8,000/2,400, lowered by completion metadata and context bounds. `top_provider.max_completion_tokens` is distinct from `context_length`.

The policy and limit distinctions have one authoritative home in [product.md](product.md#hosted-ai-and-limits). Current executor recovery has at most eight one-file manifest tasks and a 24-physical-call budget; this does not bound all workflow interpretation/setup requests. Any frozen configured spending limit also applies; no managed-credit fallback exists.

Named-connection/preset/effort routes under `/api/rooms/:id/ai` are 410 in hosted mode after the four temporary routes above. Managed catalog/funding/spender/builder routes are 410 in both modes. Old persisted configuration remains readable; it does not enable managed dispatch.

## Room reads, submissions and decisions

| Method and path | Authorization | Contract |
| --- | --- | --- |
| GET `/api/rooms/:id/state` | Participant/current hosted member | `RoomView` |
| GET `/api/rooms/:id/workflow/events?after=&limit=` | Same | Integer cursor ≥0; limit 1–100; `{events, cursor, latestCursor, hasMore}` |
| POST `/api/rooms/:id/submit` | Participant/current owner or editor | `{requestId: string}`, nonempty ≤100; `{submissionId?, status, message}` |
| POST `/api/rooms/:id/retry-build` | Same plus BYOK spender when applicable | `{requestId}`, nonempty ≤100; explicit accepted-build retry |
| POST `/api/rooms/:id/conflicts/:groupId/selections` | Owner/editor AND affected contributor | `{groupRevision, expectedUpdatedAt, alternativeId, requestId}`; current revision/timestamp required; stale 409; replay returns prior decision |
| POST `/api/rooms/:id/build` | Participant | 410 in both modes; use caller-only submit |
| POST `/api/rooms/:id/process` | Participant | Hosted 410; local `{correction?}` uses only caller pending edits/explicit correction |
| POST `/api/rooms/:id/reinterpret` | Participant/current hosted owner/editor | Reuses latest authenticated author edit batch; managed config 409 |
| POST `/api/rooms/:id/runtime-error` | Participant/current hosted owner/editor | `{message, version}`; latest-version failure can restore previous preview |

Primary submissions persist complete captured author batches, accepted-baseline context, frozen model/setup, source revision and lifecycle before inference. Reconciliation follows capture order. Active submissions survive the recent-history cutoff; receipts keyed by participant/request ID remain independently persisted. Replay never consumes new edits; empty draft returns `No new changes to submit` without inference. Failure/interruption restores edits for explicit new submission. Later accepted work supersedes an obsolete fixed-revision candidate and remains queued for the next build. Internal `buildNow` is a local harness helper, not callable public all-draft authorization.

Retry build does not reinterpret edits. It uses current selected models/accepted requirements and can reuse a checkpoint only for the same fingerprint. Reinterpretation is targeted, preserves other contributors/stable IDs, rejects settled decisions/withdrawals, and schedules no build for unchanged accepted input. It is a legacy path whose broader context/ordering audit remains open; do not infer primary-submit hardening automatically applies to it.

Workflow activity exposes ordered safe summaries, not raw payloads, private document content, unrestricted logs or reasoning. Cursor is last returned event (or supplied cursor on empty); latestCursor/hasMore support backlog pagination. Current serialized builds are durable tasks before dispatch with source revision, assignment, acceptance criteria, run link and evidence. The recovery manifest is internal checkpoint work, not concurrent task scheduling.

## Preview and download

GET `/api/rooms/:id/download/:version` requires participant authorization and returns a runnable ZIP, or 404 when legacy source files are unavailable. GET `/preview/:id/:version` requires ticket/current membership in hosted mode; local mode permits URL access. Preview returns no-store/no-referrer and a restrictive CSP. Restricted browser preview is not host-process compilation isolation. Successful compile/promotion has `unverified` functional evidence unless real acceptance establishes more.

There are no public pause/resume/cancel, control-handoff, approval, general rollback, Researcher retrieval or Analyst ingestion routes. Phase/approval schemas are not implemented commands.

## Shared response models

Import exact types from `src/types.ts`; prose is not a second schema.

| Model/field | Implemented meaning |
| --- | --- |
| `RoomView` | Room/owner/participants, safe AI, status, requirements/conflicts, specification/requirements revision, versions/latestVersion/error, timing, workflow, save metadata and usage |
| `requirementRevisions` | Durable `{revision, accepted}` snapshots; selected UI revision excludes unsubmitted drafts |
| `status` | Waiting for ideas, Collecting submissions, Understanding edits, Decision needed, Building, Updated, Error |
| `workflow` | Workflow ID/schema/phase/revision/controller/epoch/tasks, recent activity/cursor and last artifact evidence |
| `SharedRequirement` | Stable ID/revision/category/description/acceptance criteria/status/authority/sources/timestamps; statuses proposed/accepted/withdrawn/superseded |
| Attributed intent | Classification proposal/question/explicit_request/decision/ambiguity, rationale/passage/source revision/edit sequences; invalid labels fail closed to ambiguity |
| `ConflictGroup` | Stable ID/revision/round, subject/scope, alternatives/source contributors, required resolvers, selections/history/baseline/build scopes; states awaiting_choices/disagreement/resolved/obsolete |
| `contradictions` | Derived compatibility view; conflictGroups is authority |
| `Version.aiRun` / `aiRuns` | Frozen run/model/pricing/routing metadata, call usage/cost/outcome/latency and separate verification; recent 50 run window |
| `providerCalls` | Recent 100 safe physical request records for display, not the full ledger |
| `physicalUsage` | Full available deduplicated ledger aggregation: recorded/generation/setup, unknownUsageRequests, recordedFrom, coverage partial |
| `usage`, `setupUsage` | Separate historical generation/windowed setup values; do not add to physicalUsage |

Every physical HTTP attempt has a unique call ID, purpose/retry reason, dispatch/final outcome, timing, provider/config/pricing references, reported usage/charge and optional termination reason. Retries and schema repairs are separate attempts. Exhaustion keeps reported usage. Aggregate by ID with final/newer outcome preference. Reported tokens are input plus output; cache/reasoning subsets are not added again. Generation excludes connection/text/interpreter/builder capability tests. Missing fields/outcomes remain unknown; estimates are not invoices, and coverage is partial because pre-ledger history may be absent. Cumulative usage is not context occupancy.

Workflow phases include draft/queued/running/awaiting_input/awaiting_approval/pause_requested/paused/completed/failed/cancel_requested/cancelled; only current submission/build/recovery transitions have behavior. Future phase names do not prove controls. Requirements do not yet carry a complete implemented/verified evidence lifecycle.

## WebSocket collaboration and save receipts

Connect `/ws?room=<roomId>&token=<ticket>` over ws/wss matching the page. Hosted origin must pass configured `COCREATE_APP_ORIGINS` and current membership/coordinator checks. Upgrade, every inbound message and every outbound delivery recheck authority; viewers receive state/awareness but cannot edit. Expired tickets close the socket. Revoked access prevents later delivery, but no proactive instantaneous closure of a completely silent socket is claimed.

Binary frames: discriminator 0 Yjs V1 update, 1 awareness, 2 server state vector. Document fragment is `default`. Browser answers the vector with missing update bytes. Outgoing edits may coalesce for 40 ms.

| Direction/message | Contract |
| --- | --- |
| Client `{type:'awareness-client', clientId}` | Associates awareness identity |
| Client `{type:'flush', requestId}` | Orders after pending document frames and confirmed canonical snapshot |
| Server `{type:'room-state', state}` | Authoritative shared projection |
| Server `{type:'saved', revision, savedAt, vector, deletions}` | Immutable committed snapshot receipt: base64 insertion vector plus canonical deletion-range JSON signature |
| Server `{type:'flushed', requestId}` | Confirmed flush before submit |
| Server `{type:'flush-error', requestId, message}` | Rejects flush; client does not submit |
| Server `{type:'save-error', revision, message}` | Unsynced state |
| Server `{type:'permission-error', message}` | Actionable access failure |

Saved status requires coverage of local insertion clocks and deletion signature. Only successful remote snapshot commit acknowledges hosted saving; ordered append failure can recover through a confirmed full snapshot, snapshot failure cannot. Browser filters older cursors/revisions within a connection and resets on a new authenticated generation so a lower canonical cursor can recover failed prior writes.

Client connection states are connecting/connected/bounded reconnecting/terminal error. Transient retries use capped jittered backoff (six attempts, roughly ten-second cap before jitter); authenticated state diagnosis distinguishes 401/404/403 from transport failure. Replacement cleans stale listeners/timers/flush promises. In-memory edits and validated participant-scoped IndexedDB copies aid recovery after authenticated state restore, but do not provide full offline cold startup or access permission. Device-saved is separate from synced.

## Local compatibility only

POST `/api/rooms` returns `{roomId, inviteUrl}`; POST `/api/session` takes `{roomId,name,token?}` and returns `{token,participantId,owner}`. Display name is trimmed and capped at 40; a valid same-room token reuses identity. Hosted creation/join returns 404/403 instead.

Owner-only named connections remain locally implemented: POST `/ai/connections` takes ID/name/provider/baseUrl/apiFormat/key; POST `/ai/connections/:connectionId/models` returns models; POST `/check` takes model and returns reachability/text/personal/builder checks; DELETE connection disconnects; POST `/ai/assignments` sets personal/builder/participant overrides. Supported adapters are OpenAI, Anthropic, Gemini, OpenRouter, DeepSeek, custom and Ollama; format options are responses/chat-completions, not universal protocol compatibility. Discovery is not quality proof; explicit capability tests may use inference.

Local GET/POST `/ai/recommendation` and POST `/ai/effort` are owner-only compatibility configuration. Only Developer activation is accepted; effort values light/medium/high/extra preserve `light` storage despite Low label. They freeze future configuration, not active work. Old `/ai/test`, `/models`, `/connect`, `/disconnect` remain local compatibility too. These routes are retired hosted; managed dispatch is disabled. Exact dormant type details and dated behavior remain in the [historical API snapshot](docs/harness/archive/2026-10-01-pre-consolidation/api.md).

Update this reference with route/type/message changes and actual validation. Source inspection here is not a live session, SQL execution or deployment claim.
