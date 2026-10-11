# 2guys1canvas implemented API contracts

Hosted optional admission: `/__cocreate/app-health` adds Boolean `capabilities` (`shared_browser`, `connected_blender`, `interactive_blender`, `generated_preview`) alongside the source fingerprint. These describe operator configuration only. Hosted browser frame/input/resume/publication and preview provider connection/release routes return HTTP 503 while disabled, including case/trailing-slash route variants. Connected Blender pairing/agent execution/new frames/input/completion are gated at manager authority, with poll cancellation and STOP/immutable-result acknowledgement retained. Saved private artifact routes keep fresh membership and hash verification; ZIP downloads now return `Cache-Control: no-store`, `Referrer-Policy: no-referrer` and `nosniff`. No new model tool, Canvas event, Workflow field or token-accounting contract is introduced. See [D-0066](docs/harness/decisions.md) and [the full admission/recovery table](docs/harness/hosted-beta-readiness.md).

Hosted beta preparation (2026-10-11): [the current release packet](docs/harness/hosted-beta-readiness.md) separates platform publication from generated-app previews. The user selected local preparation and will configure isolated staging and designated accounts. Server operator flags now default closed for hosted shared browsers, connected Blender and generated preview dispatch; the independent interactive Linux gate remains. Saved artifacts and cleanup/reconciliation retain existing authorization. Staging preparation rejects production targets and binds its public build configuration to its fingerprint. Real hosted account/recovery/provider acceptance and production release remain pending. Historical main pushes triggered Cloudflare production release, so main integration is held under the current local-only instruction; readiness changes go to codex/canvas-artifacts. Canvas, Workflow and token tracking are unchanged.

Fresh local verification (2026-10-11): implementation `7ba6296496f3d7f93b8d53d7694e7b77882f53bb`, CI 38135445261, passes PostgreSQL 3/3, compiler 10/10, browser isolation 17/17, dedicated Blender 3/3, two-profile Artifacts UI 5/5 with zero physical inference calls, and production-image regression 279/281 with zero failures (two desktop cases run separately above). Build and boundaries pass. This is controlled native/local evidence; real hosted acceptance and both releases remain pending. Exact fingerprint, CI image identity, release draft and recovery gates are retained in the current release packet.

Dated milestone verification (2026-10-11): exact source `24c24f9b82111ee397efac4e9377f404c03e2bd3`, CI 38125116322, passes PostgreSQL 3/3, compiler 10/10, browser isolation 17/17, dedicated interactive Blender 3/3 and ordinary regression 273/275 (two desktop cases independently run in the dedicated environment). Manual shared browsers support Windows/Linux with authenticated viewing/input, explicit owner grants/private login, controller fencing and private validated text downloads. Dedicated Linux Blender 4.5.14/private-Xvfb passes actual effective input/repeated isolation, two-participant observation/handoff/private saves, human/agent exclusion, reopening and STOP. Its real Artifacts UI demonstration passes 5/5 with two independent profiles and zero manual inference. Generated static-app preview preparation uses Cloudflare Pages with frozen hashes, reviewed approval, server credentials, permanent receipts/reconciliation and reviewed recovery; actual asset-helper protocol/cancellation checks pass 2/2 against controlled endpoints. No hosted rollout, real cloud release or account/billing acceptance is claimed. Windows GUI remains unsupported with failed dated evidence preserved. Canvas, Workflow and token tracking are unchanged; private snapshots use v6 with v1-v5 reads. Separate milestone packets retain all readiness history, recovery instructions and remaining hosted gates.

Shared-browser Linux execution contract: no HTTP payload can choose an executable or alter bounds. server/shared-browser-runtime.ts verifies the fixed image-owned binary hash record; withIsolatedBrowser applies the shared-session 600-second wall/60-second aggregate CPU/64 MiB protocol bounds and existing no-network namespace/512 MiB/64-task/8 MiB file limits. Routes, grants, epochs and private download contracts are unchanged. Missing records or delegation fail closed; image attestation is not acceptance proof.

## Generated frontend previews (2026-10-11)

All routes require current project/beta/coordinator access. `GET /api/rooms/:id/previews` returns public connection metadata, frozen plans and receipts, never credentials. `POST /previews/connections` accepts `{accountId,projectName,credential,actors}` and verifies an existing dedicated Direct Upload target read-only. Owner-only `POST /connections/:connectionId/grants` uses `{actors,expectedRevision}`; revoke increments revision; `POST /credential` replaces a scoped token only after verifying the same target. Grants invalidate old approvals.

`POST /previews/plans` accepts exact `{versionId,connectionId?,recoveryOf?}` and persists private compiled bytes plus source/output/plan hashes. Account-free plans cannot release. `POST /plans/:planId/release` requires `{planHash,approvePublicPreview:true}` from an explicitly granted current actor. One permanent receipt/plan is saved before dispatch; grant/target/owner membership are rechecked before account mutation. Provider work and compilation are each admitted at most twice per server, once per project, with no queue. `POST /plans/:planId/reconcile` takes `{}` and never uploads. The connection owner may reconcile an old/revoked plan read-only; only a durable terminal receipt or proven pre-creation cancellation releases its exact global reservation. `GET /plans/:planId/files/:file` independently serves verified private fixed files to project readers. API paths above are beneath `/api/rooms/:id/previews`.

Writers publish v6 snapshots/manifests with explicit v1-v5 readers. Hosted uploads require configured server encryption plus the prepared service-role-only reservation RPC migration; missing gates fail closed. Live verification proves exact static file hashes and isolated render smoke only. No Worker/control-plane deploy or production mutation endpoint exists. [Scope, tests and recovery](docs/harness/frontend-preview-deployment.md).

## Shared browser (2026-10-11)

Project session/beta/current membership and coordinator gates apply. Connection-owner current editor/owner membership is independently required for session operations. Responses use no-store/nosniff/no-referrer. Session grants remain separate from saved file permissions.

| Route | Contract |
| --- | --- |
| `GET /api/rooms/:id/browser` | Granted session metadata/hashed-receipt summaries plus independently readable project download descriptors; no cookies/frames/input payloads. |
| `POST /api/rooms/:id/browser` | `{origin,observe,control}` exact operator-approved origin/current participant IDs; connection owner explicitly grants; new browser starts owner-private. |
| `GET /api/rooms/:id/browser/:sessionId/frame` | Authenticated PNG viewport, explicit observation and private-login gate; membership/epoch rechecked after capture. |
| `POST /api/rooms/:id/browser/:sessionId/input` | `{commandId,epoch,input}` validated navigate/click/text/key/scroll; active controller only; durable intent before dispatch; immutable same-ID replay returns state without execution. Completed means input acknowledgement; unknown is never retried. |
| `POST /api/rooms/:id/browser/:sessionId/control` | `{action,epoch,actorId?}` handoff/private_login/share_authenticated/pause/resume/cancel/disconnect. Owner-only login/share/disconnect/resume; handoff waits for pending receipt settlement. Pause closes profile, owner resume starts fresh private login without replay. |
| `GET /api/rooms/:id/browser/:sessionId/downloads` | Active controller sees bounded pending validated text file metadata, never arbitrary filesystem access. |
| `POST /api/rooms/:id/browser/:sessionId/downloads/:downloadId/publish` | Owner/current epoch explicitly publishes a bounded UTF-8 .txt/.md as immutable private artifact, including downloads obtained during private login. |
| `GET /api/rooms/:id/browser-downloads/:downloadId` | Fresh project reader independently downloads verified private text attachment; session grant unnecessary. |

First executor is pinned Windows x64 Chromium 154.0.8037.92, 960×640 viewport, ten-minute expiry and 30-second frame/input idle close. No cookies/profile restoration, arbitrary protocol/script endpoint, whole-desktop viewing, agent automation or universal website compatibility. v4 snapshot/manifest writes retain v1/v2/v3 readers. This does not implement interactive Blender or generated-app deployment. [Exact scope/evidence](docs/harness/shared-browser-sessions.md).

## Connected Blender (2026-10-11)

All project routes retain authenticated session/beta/current-membership/coordinator checks. Device routes accept only short-lived hashed opaque device credentials, never project reads. HTTPS outbound companion transport is required except loopback development. Responses use no-store; private images/downloads additionally use nosniff/no-referrer and recheck membership after awaited storage reads.

| Route | Contract |
| --- | --- |
| `POST /api/rooms/:id/blender/pair` | Current owner/editor creates a five-minute single-use random pairing token bound to actor/project; no inference. |
| `POST /api/blender/devices/:projectId/pair-info` | Pair capability in JSON returns bound owner/current participant IDs for local approval; expired/used tokens fail 401. |
| `POST /api/blender/devices/:projectId/pair` | Pair bearer consumed once. Strict locally approved device name, client-generated credential, Blender 4.5.14, create_scene/save/render and explicit observe/control IDs. Owner automatically retains both grants; control requires observation. No executable or local path enters server authority. |
| `GET /api/rooms/:id/blender/sessions` | Lists only sessions locally granted to authenticated observer. Project membership alone returns none. |
| `POST /api/rooms/:id/blender/sessions/:sessionId/control` | `{action,epoch,actorId?}`; pause/resume/cancel/handoff require current locally approved controller. Device owner may disconnect/revoke. Stale epochs 409; missing grants 403; handoff waits for cleanup/receipt settlement. |
| `POST /api/blender/devices/:projectId/:deviceId/poll` | Fresh owner/controller membership and device credential. Persist command-running claim before returning one validated structured command; restart marks outstanding commands interrupted, never launches them automatically. |
| `POST /api/blender/devices/:projectId/:deviceId/result` | `{commandId,epoch,state,result?,error?}` matching frozen command. Only bounded fixed scene/PNG bytes and matching scene/version/cleanup evidence; immutable exact completion replay acknowledged, changed replay rejected. Maximum request 8 MiB. No arbitrary file upload/path API. |
| `POST /api/blender/devices/:projectId/:deviceId/stop` | Local executor acknowledges cleanup then revokes connection. Server revocation/expiry independently denies later commands/results. |
| `GET /api/rooms/:id/blender/artifacts/:artifactId/versions/:version/:file` | `blend_<24hex>`, positive immutable version and fixed `scene.blend`/`render.png`; fresh project readers can download without session grants. `.blend` is attachment/octet-stream; PNG previews inline or attachment with `download=1`. Missing 404, corrupt/missing stored body 409, unauthenticated 401, denied 403. |

Connections expire after 30 minutes or 10 idle minutes; heartbeat state becomes disconnected after 30 seconds. Companion cancels on failed outbound transport after a bounded approximately ten-second detection window. Pause requests cancellation; resume does not retry. Viewer closure is inference/execution-free. Local receipt-before-launch, epoch fencing and interrupted recovery forbid duplicate execution. Explicit Retry build can reconcile completed uploads with unchanged accepted fingerprint/original connection/epoch; expired/revoked connections require local re-pairing and do not authorize orphan upload.

`shared/blender.ts` defines strict data-only `BlenderScene`, command/session/grant contracts and `BlenderArtifact/BlenderVersion`. `WorkflowTask.kind` adds `blender_scene`; `AIRunRecord.artifactKind` adds `blender`, with narrow output/cleanup verification and independent physical accounting. Snapshot and private manifest schema **3** add device state and Blender descriptors; body envelope remains **1**. v1/v2 app/document readers remain; unknown/malformed versions fail closed. Retain v3 readers and immutable bodies for rollback. An exclusive local workspace lease rejects simultaneous companion resume before dispatch. No new SQL/bucket, cloud provisioning, general desktop transport or hosted release is implemented.

**Prior hosted release (2026-10-09):** Beta request/approval source `ba96cfd` is deployed at https://2guys1canvas.com and published to main. Native PostgreSQL concurrency, compiler 10/10, browser 15/15 and full regression 244/244 pass with zero skips. Worker `088c7975`, container version 41 and image `fd66e1b1` serve the prepared fingerprint. The additive migration, two confirmed reviewer UUID grants, approved sender and retry cron are configured. Hosted anonymous routes pass; the user will manually verify signed-in requests, both reviewer inboxes, decisions, requester email and private-project denial. No live test account/email or paid inference was run by this session. [Current evidence](docs/harness/beta-access-requests.md).

Image-backed `/__cocreate/app-health` adds an optional `release_fingerprint` containing the non-secret SHA-256 of prepared source/build inputs. It comes from immutable root-owned image metadata, not request data or Worker environment. The candidate Worker requires equality with its trusted configured fingerprint before forwarding any ordinary application HTTP/socket request; missing/mismatched image returns503. This blocks the old ungated image during non-atomic Worker/image rollout. Worker health and canonical/legacy redirects remain independent of app readiness. The fingerprint identifies source/build inputs, not complete runtime or authentication acceptance.

Earlier release audits are retained in the linked release packet; their old-image observations are historical.

Source-inspected 2026-10-10 through Canvas → Artifacts expansion; this branch is not a deployed release. This reference records implemented contracts. [Product](product.md) owns acceptance; [architecture](docs/harness/architecture.md) owns persistence boundaries; [checklist](docs/harness/checklist.md) owns verification status.

## Canvas → Artifacts contracts

`RoomView.artifacts` exposes a project-scoped union: stable `application` plus `doc_<24 hex>` Markdown artifacts, each with its own version descriptors. Existing `versions/latestVersion` and app preview/ZIP routes remain application-only compatibility fields. Document versions include title, project/artifact/task/participant IDs, submitted capture IDs, accepted specification/requirement revisions, frozen input version refs, fingerprint, private content ref/SHA-256/byte length, UTF-8 encoding, creation/check timestamps and `markdown-v1` checks with factual accuracy `unverified`. New application descriptors add corresponding provenance/integrity fields; older application records may lack them.

Authenticated caller-only submissions keep their existing receipt/permission contract. Exact explicit passages such as `Write a Markdown document titled "Brief" with sections "Summary" and "Risks".` acquire a trusted Markdown output target. Reusing the normalized title revises that project document. Missing title/unsupported output becomes clarification without builder dispatch. Explicit `artifact:<id>@v<number>` references select same-project private evidence; previous document content is included automatically. Eight selections/100,000 serialized input bytes and 256 KiB output apply. Document tasks use the existing allowance, physical-call ledger and explicit retry route/BYOK permission; retry does not reinterpret drafts or reset allowance.

`GET /api/rooms/:id/artifacts/:artifactId/versions/:version` requires an authorized project session, including viewer membership. Returns `{markdown,version}` only for published Markdown. `?download=1` returns UTF-8 `text/markdown` attachment with a fixed ID/version `.md` filename. Uses no-store, nosniff and no-referrer; hosted membership/coordinator is checked again after awaited private reads. Invalid ID/nonpositive version returns 400; missing/wrong-project/pending version returns 404; missing session 401; revoked access 403; missing/corrupt private body is the existing actionable artifact 409; unavailable coordinator retains existing retry response. Selecting a view grants no permission.

Workflow tasks add `document_generation` alongside `developer_build`; states use the existing durable lifecycle. `document.input_frozen`, `document.checked`, `document.promoted`, `document.completed` and failure events record execution. Candidate content is hidden during canonical promotion. The Canvas expansion introduced snapshot v2 document descriptors; current `artifactContractVersion=6` and hosted `artifactSchemaVersion=6` include document/Blender descriptors and immutable body refs, with explicit legacy inline/v1-v5 reading. Unknown snapshot versions fail closed; no new SQL contract is introduced. See [architecture](docs/harness/architecture.md#canvas--artifacts-execution-and-viewers) and [evidence](docs/harness/canvas-artifacts.md).

## Transport and authorization

Unknown `/api` routes return HTTP 404 JSON `{error:"API route not found."}` before SPA fallback. The existing GET `/api/auth/callback` still reaches the client for PKCE/recovery processing. Fresh hosted smoke checks confirm this response.

Pre-launch routes share the existing origin. `/` is public; `/app` enters the approved project list; existing login/signup/callback/recovery/project/invitation paths retain their contracts.

| Method/path | Authority | Contract |
| --- | --- | --- |
| POST `/api/beta/waitlist` | Anonymous | `{email:string, consent:true, website?:""}`; normalized email ≤254 characters. Durable unique insert then 200 `{message:"You’re registered. We’ll email you when a beta spot is available."}` for initial/duplicate/retry attempts. No account lookup/creation or email. |
| GET `/api/beta/access` | Verified Supabase bearer | `{approved:boolean}` for that account only; `no-store`. Missing/invalid identity 401; unavailable lookup 503. |
| GET `/api/beta/request` | Verified Supabase bearer | Own `{approved,reviewer,revoked,request,resubmitAt}` state; latest durable request or null. |
| POST `/api/beta/request` | Verified confirmed bearer | `{message?:string}` ≤1,000 characters. Verified account/email only; supplied account IDs are ignored. Creates one pending request/two durable reviewer notices or returns the existing pending request unchanged. |
| GET `/api/beta/review?request=UUID` | Active confirmed UUID reviewer + fresh beta access | `{pending,recent,selected}`: oldest 100 pending, latest 30 decisions and optional linked request. Read-only; ordinary approved users receive 403. |
| POST `/api/beta/requests/:id/decision` | Same reviewer; cannot decide own request | `{decision:"approved"|"declined"}` → recorded request. First decision wins; ordinary approval commits atomically. Repeats do not reverse or duplicate notification. |

Beta requests contain `{id,requesterId,requesterEmail,status,message,requestedAt,decidedAt,decidedBy}`. Request/review responses are `no-store`; explicit Bearer identity is required, with no cookie/query fallback. Mutations reject cross-site/disallowed Origin requests. Missing/invalid identity returns 401, unconfirmed/reviewer/revocation denial 403, malformed input 400, already-approved/cooldown conflict 409 and unavailable persistence 503. Declined requests permit resubmission after seven days. GET decision URLs fall through to JSON 404. No public reviewer grant, reversal, revocation or email-resend route exists.

`beta_reviewers`, `beta_access_requests` and `beta_email_deliveries` are private RLS tables without anon/authenticated grants. Service-only invoker RPCs implement requests/decisions and leased delivery; two private service-only definer helpers narrowly verify/lock confirmed Auth accounts. Frozen payloads and stable Resend keys survive two-minute lease recovery, with five attempts within 23 hours of first dispatch. Decision mail links to `/app`; review mail links to `/beta/review?request=UUID`, without authorization tokens. See [manual hosted acceptance](docs/harness/beta-access-requests.md).

Registration returns 400 for invalid input/missing consent, 403 for cross-site origin, 429 with `Retry-After: 900` for durable rate limits, and a generic 503 retry error for failed persistence. Five attempts/client/15-minute fixed window and 500 globally/hour include duplicates. No public registration read/list/approval route exists.

Hosted membership/sharing/list/create/accept require fresh beta access alongside current project authority. Pending access returns 403; unavailable lookup fails closed. Room middleware, socket upgrade/message/delivery, previews/downloads, historical reads and deferred dispatch inherit the gate. Invitation acceptance checks before the transactional RPC, preserving a pending invite and original expiry. Callback/recovery precede the UI gate and return paths remain same-origin validated. The [policies observed applied on 2026-10-08](supabase/migrations/20261006204612_prelaunch_beta_access.sql) and [operator process](docs/harness/prelaunch-beta-handoff.md) are rollout prerequisites. Local compatibility auth is not hosted beta control.

HTTP/socket requests use the client host; local default is `http://localhost:5173`. JSON body limit is 40 KB. Prefer `Authorization: Bearer <token>` over the currently supported room-route token query parameter; never log credentials or authenticated URLs.

Hosted project routes use a Supabase access token verified for issuer/audience/signature/expiry. `POST /api/projects/:id/session` verifies account and membership, claims coordinator ownership, hydrates the room if needed and returns a separate five-minute signed project ticket. Participant ID equals account UUID. Room/preview/download middleware requires that ticket, current membership and coordinator authority; historical artifact reads recheck membership/ownership after awaited retrieval before returning bytes; mutations require owner/editor. A URL alone grants nothing. Viewers cannot submit edits or room commands.

Local mode uses HMAC-SHA256 signed room participant tokens `{roomId, participantId, name}`; local creation/join has no account identity or expiry guarantee. These compatibility sessions are not hosted authorization. Invalid room tickets return 401, missing rooms 404 and denied permission usually 403; caught operation/provider failures commonly return 400 `{error}`. Operation success is not functional acceptance.

Hosted use requires the service-role RPCs in the [original fencing migration](supabase/migrations/20261001104120_workflow_coordinator_fencing.sql) and [Step 02 hardening migration](supabase/migrations/20261003203000_coordinator_dispatch_updates.sql). Both were observed applied on 2026-10-08 with matching source function bodies; SQL contention and independent hosted-account behavior remain unverified. Missing RPCs fail closed. Current routing retains the Worker primary-container affinity and returns a bounded retry on non-owner ingress.

Ownership unavailable or lost returns HTTP **503**, `Retry-After: 2`, `Cache-Control: no-store`, and `{code:"coordinator_unavailable", retryAfterMs:2000, retryable:true, error}`. The safe message says to retry with the same request ID and reopen the project if it persists. Membership denial remains 403 and invalid tickets 401; current authorization is checked first. WebSocket rejection uses HTTP 503/Retry-After; an established socket losing ownership closes with 1012, while access revocation closes with 4403. No Location header or owner/credential disclosure is returned. The client retries connection only, then shows a terminal reopen action with page edits retained.

Private artifact restoration failures return HTTP **409**, `Cache-Control: no-store`, and `{code:"artifact_unavailable", reason:"missing"|"corrupt"|"unavailable", error}`. Opening a project with missing/corrupt required current product or checkpoint fails explicitly, rather than hydrating an empty room. Reopen retries reads without inference. Preview `/preview/:id/:version` and download `/api/rooms/:id/download/:version` can fetch archived version bodies lazily; an unknown version remains 404, while membership denial remains 403. The application streams verified preview/ZIP bytes and exposes no Storage credentials, public URLs or signed download URLs. Version metadata/history can include older newly archived versions; current/latest excludes a pending promotion. Legacy history absent from canonical records remains unavailable.

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

Browser auth is Google PKCE plus email/password signup, confirmation resend, login, recovery, authenticated password change and logout. Safe same-origin return paths include invite links. Callback derives from configured app origin: release target `https://2guys1canvas.com/api/auth/callback` (canonical hosted configuration is now observed), separately configured localhost development, with legacy `/auth/callback` recovery. Callback restores session, exchanges a code once and removes parameters. A failed/cancelled new login with an existing session requires explicit Continue/Switch account. Project requests refresh near expiry and allow one refresh/retry after 401. None of these client states replaces backend membership.

## Active temporary OpenRouter routes

All mutations below require the room/project owner, including a current hosted owner check.

| Method and path | Request/result |
| --- | --- |
| POST `/api/rooms/:id/ai/openrouter/connect` | `{apiKey}`; validates key and discovers compatible models without generation; returns redacted handle/sponsor/expiry/model/spender metadata |
| POST `/api/rooms/:id/ai/openrouter/models` | `{handle, interpreterModel, builderModel}`; validates both exact returned IDs and saves assignments |
| PUT `/api/rooms/:id/ai/openrouter/spenders/:memberId` | `{authorized: boolean}`; target must be owner/editor |
| POST `/api/rooms/:id/ai/openrouter/disconnect` | Revokes memory lease and disconnects |

The key is never serialized into room state/snapshots and lasts two hours in process memory. Expiry/restart requires reconnecting. Discovery compatibility requires text output, structured response support, finite rates/context and minimum context; metadata compatibility is not a paid capability or quality test. Requested builder/interpreter output is 8,000/2,400, lowered by completion metadata and context bounds. `top_provider.max_completion_tokens` is distinct from `context_length`.

The policy and limit distinctions have one authoritative home in [product.md](product.md#hosted-ai-and-limits). Recovery has at most eight one-file manifest tasks. The durable workflow scope has 24 physical attempts including interpretation, generation, repairs and transport retries; setup operations have separate named scopes. Retry/reconnect/restart/supersession preserve the allowance. Room state exposes `workflowBudget` (scope ID, calls/maximum, committed-or-held USD, optional frozen USD maximum, uncertain-call count and closed flag); missing prices are not a zero-cost claim. Any frozen configured spending limit also applies; no managed-credit fallback exists.

Named-connection/preset/effort routes under `/api/rooms/:id/ai` are 410 in hosted mode after the four temporary routes above. Managed catalog/funding/spender/builder routes are 410 in both modes. Old persisted configuration remains readable; it does not enable managed dispatch.

Owner-only `POST /api/rooms/:id/workflow-budget/reset` takes `{requestId, expectedScopeId}`. It checks current owner/membership, coordinator fence and absence of active/queued interpretations or builds; a stale scope or reused actor/request ID with another payload is rejected. A durable receipt permits exact replay without another reset. It creates a fresh 24-call scope with the current configured limit, keeps historical ledger uncertainty and performs no inference. Snapshot uncertainty fences the coordinator; reconnect recovers the canonical receipt. Compatibility `ai/test` now requires a project-bound setup scope.

## Room reads, submissions and decisions

| Method and path | Authorization | Contract |
| --- | --- | --- |
| GET `/api/rooms/:id/state` | Participant/current hosted member | `RoomView` |
| GET `/api/rooms/:id/workflow/events?after=&limit=` | Same | Integer cursor ≥0; limit 1–100; `{events, cursor, latestCursor, hasMore}` |
| POST `/api/rooms/:id/submit` | Participant/current owner or editor | `{requestId: string}`, nonempty ≤100; `{submissionId?, status, message}` |
| POST `/api/rooms/:id/retry-build` | Same plus BYOK spender when applicable | `{requestId}`, nonempty ≤100; explicit accepted-build retry |
| POST `/api/rooms/:id/conflicts/:groupId/selections` | Owner/editor AND affected contributor | `{groupRevision, expectedUpdatedAt, alternativeId, requestId}`; current revision/timestamp required; stale 409; replay returns prior decision |
| POST `/api/rooms/:id/build` | Participant | 410 in both modes; use caller-only submit |
| POST `/api/rooms/:id/process` | Authenticated participant | Retired HTTP 410; use caller submit or explicit intent commands |
| POST `/api/rooms/:id/reinterpret` | Authenticated participant | Retired HTTP 410; explicit intent review/correction replaces inference |
| POST `/api/rooms/:id/runtime-error` | Participant/current hosted owner/editor | `{message, version}`; latest-version failure can restore previous preview |

Primary submissions persist complete captured author batches, accepted-baseline context, frozen model/setup, source revision and lifecycle before inference. Reconciliation follows capture order. Active submissions survive the recent-history cutoff; receipts keyed by participant/request ID remain independently persisted. Replay never consumes new edits; empty draft returns `No new changes to submit` without inference. During closed admission/building, submit returns HTTP 200 with `status:"submitted"` and `Changes saved; interpretation waits for the current build to finish.` It acknowledges durable capture, not accepted intent or a product. After completion, captures interpret serially; hosted current owner/editor membership is rechecked at deferred physical dispatch, alongside existing BYOK authorization and coordinator checks. Failure/interruption restores edits for explicit new submission. Explicit intent/conflict changes still invalidate affected candidates; ordinary captured arrivals cannot supersede them. Internal `buildNow` is a local harness helper, not callable public all-draft authorization.

Retry build does not reinterpret edits. It uses current selected models/accepted requirements and can reuse a checkpoint only for the same fingerprint. Public reinterpretation is retired. The internal diagnostic method reuses only recorded caller edits and frozen accepted metadata on the steering queue, checks coordinator ownership, independently validates output, and rejects settled decisions/withdrawals. It is not a public correction or funding path.

Workflow activity exposes ordered safe summaries, not raw payloads, private document content, unrestricted logs or reasoning. Cursor is last returned event (or supplied cursor on empty); latestCursor/hasMore support backlog pagination. Current serialized builds are durable tasks before dispatch with source revision, assignment, acceptance criteria, run link and evidence. The recovery manifest is internal checkpoint work, not concurrent task scheduling.

Step 10 changes no HTTP/WebSocket route or request schema. Server shutdown stops HTTP ingress and drains in-flight responses before closing SQLite/coordinator state; a new process/client must recover canonical state and preserve receipt identity. Native isolation failures retain bounded numeric job accounting (user/kernel 100 ns ticks, process/termination counts, wall milliseconds) alongside existing memory/exit diagnostics; this is operator evidence, not new model authority or a higher quota.

Step 09 adds no HTTP/WebSocket, worker, shared-interpreter or model-selection contract. Interpretation remains serial. After restart, completed interpretations can remain `queued` awaiting an explicit build; deferred `submitted`/`interpreting` captures recover as failed receipts and author drafts without inference. Exact receipt replay does not reinterpret or start work. The [Step 09 evaluation](docs/harness/multiuser-step09-handoff.md) is an operator-only controlled runner.

## Preview and download

GET `/api/rooms/:id/download/:version` requires participant authorization and returns a runnable ZIP, or 404 when legacy source files are unavailable. GET `/preview/:id/:version` requires ticket/current membership in hosted mode; local mode permits URL access. Preview returns no-store/no-referrer and a restrictive CSP. Compilation uses the isolated process boundary in `server/isolation.ts`; preview restrictions remain separate. Compilation alone is unverified. Step 07 promotion requires candidate-bound evidence for covered accepted criteria; unknown criteria remain explicitly unverified.

There are no public pause/resume/cancel, control-handoff, approval, general rollback, Researcher retrieval or Analyst ingestion routes. Phase/approval schemas are not implemented commands.

## Shared response models

Import exact types from `shared/types.ts`; prose is not a second schema.

| Model/field | Implemented meaning |
| --- | --- |
| `RoomView` | Room/owner/participants, safe AI, status, requirements/conflicts, specification/requirements revision, versions/latestVersion/error, timing, workflow, save metadata and usage |
| `requirementRevisions` | Durable `{revision, accepted}` snapshots; selected UI revision excludes unsubmitted drafts |
| `status` | Waiting for ideas, Collecting submissions, Understanding edits, Decision needed, Building, Updated, Error |
| `buildProgress` | Optional projection: policy bounded-collection-v1; phase collecting/building/pending/idle/failed; acceptedRevision, optional buildingRevision/queuedRevision, availableVersion (nullable), optional availableRevision/collectionEndsAt (ISO), pendingSubmissions |
| `Version.specificationRevision` | Optional accepted revision frozen when this product was promoted; retained in archived metadata. Older artifacts omit it rather than inventing a revision |
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

Workflow phases include draft/queued/running/awaiting_input/awaiting_approval/pause_requested/paused/completed/failed/cancel_requested/cancelled; only current submission/build/recovery transitions have behavior. Future phase names do not prove controls. Requirement-linked run evidence is described below; the registry does not yet carry a separate complete evidence lifecycle.

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

Step 04 changes no HTTP command or model tool selection surface. `project.bundle` receives the coordinator AbortSignal and records `isolated-process` plus policy version in tool evidence. Actual OS preflight precedes builder dispatch. Unavailable isolation, cancellation and resource/timeout failures retain the existing artifact and stop without unsafe fallback or provider repair. An explicit retry is required after operator repair. Docker startup also preflights; Linux compiler readiness and normal compile/import checks now pass in disposable CI, while browser preflight fails under its address-space ceiling; intended Cloudflare kernel and full adversity remain unverified. See [Step 04 handoff](docs/harness/multiuser-step04-handoff.md).

## Step 05 intent command contracts

Owner/editor authentication, current project membership and coordinator routing apply to both routes. Membership/ticket expiry are rechecked when queued commands execute; hosted BYOK spender authorization additionally applies to builds. Request IDs use 8–100 ASCII letters/digits/underscore/hyphen. Caller identity is stamped server-side; body attribution/validation/history fields grant no authority.

- POST `/api/rooms/:id/intent-commands`: `{requestId,specificationRevision,target,action,text?,category?,classification?}`. Target is `{kind:'requirement',id,revision}` or the caller's current `{kind:'interpretation',id,intentId,revision}`. Action is `correct` or `withdraw`. Correction requires nonempty text of at most 2,000 characters, category goal/feature/design/constraint/question and classification explicit_request/proposal/question. Return `{requestId,specificationRevision,action,buildPending}` only after canonical save. Actor/request-ID replay returns its original result before stale checks; changed payload returns 409. Stale specification/target returns 409, unrelated support 403, absent requirement 404, malformed input 400. Uncertain save returns 503 and fences this coordinator; canonical recovery plus the same request ID is required. No inference is dispatched.
- POST `/api/rooms/:id/intent-build`: `{requestId}`. Requires corrected accepted intent pending, eligible requirements, saved connected AI and the existing BYOK sponsor permission. Persist a queued submission/receipt before explicit builder dispatch; no interpretation. Replay returns the existing status. It is separate from failed-build retry and from caller draft submission.
- POST `/api/rooms/:id/process` and `/reinterpret`: authenticated HTTP 410 with directions to explicit intent review/caller submission; no inference.

Room state adds optional additive `interpretationHistory`, `intentCorrections` (actor/target/before/after/time/original sources), and `intentBuildPending`. Individual intents add authority authenticated_submission/human_correction, validation verified/needs_clarification with reason, accepted-context references with requirement revision/contributor IDs, and explicit withdrawn flag. Shared sources add intent ID and authority. Legacy fields remain readable without fabricated verification. Permanent intent receipts remain canonical/private rather than a full public room-state ledger.

Captured submissions store frozen accepted context with ID/revision/category/description/status/authority and attributable sources. Raw shared draft material is excluded from interpreter input. Exact captured passage and known-reference checks are enforced outside prompts; model affected IDs cannot overwrite coauthors or implicitly withdraw support. Candidate promotion waits for any pending intent commit and rechecks accepted fingerprint/requested revision/ownership. Compilation alone remains functionally unverified; Step 07 covered checks are described below. See [Step 05 handoff](docs/harness/multiuser-step05-handoff.md) for local and unrun hosted scopes.

## Step 07 verification evidence

No new HTTP route or client-selected verification policy is added. Version.aiRun and recent aiRuns expose optional verification.evidence: policyVersion, specificationRevision, sourceHash, candidateHash (full source plus compiled JS/CSS), planHash, checkedAt, optional browserVersion, checks (kind/version/implemented/passed/message), and requirement rows (ID/revision/criteria hash, criterion hash/check IDs/status, implementation observed/missing/unknown, status verified/failed/unverified). Legacy records omit evidence. requirementSatisfaction and regressionCheck reflect only recorded coverage; verified is true only when every accepted criterion in the frozen plan is covered and passes. Unknown criteria never become passed through compilation.

The role-gated project.verify tool audits request/start/success/failure with hashes and bounded numeric isolation diagnostics; models cannot dispatch it. The server records candidate.verification_recorded under the builder run/revision before promotion. build.compilation_reused records sourceVersion/current revision/candidate hash only for byte-identical available source with this coordinator instance's successful compilation provenance; fresh functional evidence remains required. project.promote requires trusted coordinator evidence matching its candidate and accepted revision; models/HTTP callers cannot supply this context. Required failures result in a failed run/task and actionable room.lastError, with unchanged available version. CompilationPassed remains true for compiling behavior failures. Functional failures have no automatic provider repair; explicit authorized retry/new steering is required. Replayed commands and reconnect remain inference-free. The UI presents the latest attempted scope and per-requirement observations without relabeling the available artifact as the failed candidate. Private archived product metadata preserves the original report.

## Interactive Blender environment gate (2026-10-11)

Dated Windows GUI history (2026-10-11): the dedicated-desktop/AppContainer probe failed before any frame or effective input could be verified; the bounded process was removed. Windows interactive sessions remain unavailable. Later Linux private-display native acceptance supersedes this capability blocker only for that different verified environment; the original failed probe evidence is preserved. D-0060 supports background execution and saved renders only; D-0061 supports a separately isolated shared browser. See [the interactive packet](docs/harness/interactive-blender.md) for dated failure evidence, recovery and the required graphics-capable isolated environment. No whole-desktop fallback, global input or extra capabilities are permitted. Canvas, Workflow and token tracking are unchanged. Generated-app preview preparation is independent.

## Dedicated interactive Blender transport (v6; Linux native accepted, hosted pending)

Native Linux source acceptance passes 3/3 at `389eb29` (CI 38124222015). Server-side operator admission is required for pairing, frames, input, agent dispatch and new human/agent completion. Removing the flag requests cleanup on device poll and rejects result-before-next-poll promotion, while immutable completed receipt acknowledgement and close/STOP remain available. Enabled human/agent work retains its proven boundary; hosted and subsequent Artifacts UI acceptance remain separate.

The optional `interactivePolicy: linux-private-xvfb-blender-v1` pairing field requires explicit local approval in the dedicated Linux companion. Default Windows pairing remains background only. The operator selects `COCREATE_INTERACTIVE_BLENDER=linux-xvfb-v1` and the dedicated delegated cgroup; neither HTTP nor model input can select binaries, flags, displays or capabilities.

- `POST /api/rooms/:id/blender/sessions/:sessionId/input`: authenticated current controller sends `{requestId, epoch, action: open|input|save|close, input?}`. Input is a strict shared viewport click, supported key or numeric text. Durable ID/hash/epoch receipt precedes delivery; one pending command and at most 64 receipts per connection. Matching duplicates return the receipt; conflicts, old epochs and interrupted input never dispatch. Re-pair after the bound.
- `GET .../sessions/:sessionId/frame`: fresh project/owner/controller authority and separate observation grant; no-store 960x640 PNG, current epoch, maximum 1 MiB, expires after 2.5 seconds. No frame/credential/input payload enters RoomView or model context. Each participant selects its viewer independently.
- Device `POST .../:deviceId/poll` returns one interactive command or the existing agent command. `POST .../:deviceId/frame` publishes an ephemeral current-epoch frame; `POST .../:deviceId/interactive-result` acknowledges `{commandId,epoch,state: completed|unknown|cancelled,result?}`. Result is permitted only for save, binds the command hash and Linux policy, and requires actual process cleanup. No arbitrary commands or desktop transport exists.
- Human save closes the whole dedicated job before immutable private `.blend`/PNG publication. Provenance identifies the human command/actor and creates no inference or workflow task. Canvas-generated scene tasks reuse the existing workflow/accounting and execute only in a fresh job after human cleanup. Handoff waits for pending action/cancellation acknowledgement. Pause/cancel closes the human job; explicit close acknowledges cleanup before handoff after uncertainty. Resume never recreates or replays a job.

Snapshot v6 stores private bounded command receipts and saved output references; v1-v5 restoration is retained. Restart marks pending GUI actions unknown, clears ephemeral frames, disconnects and increments the control epoch. Local durable receipts prevent repeated execution after companion restart; only immutable result uploads may reconcile. STOP, expiry and ten-second network-loss cancellation remove the entire group. Failed native gates keep interactive deployment disabled; a background render or simulated frame is not GUI evidence.
