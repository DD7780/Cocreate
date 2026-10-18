# Graph Report - Devoffice  (2026-10-18)

## Corpus Check
- 277 files · ~254,056 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 6, .css 6, .example 1)

## Summary
- 2496 nodes · 6189 edges · 121 communities (105 shown, 16 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 224 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ac83c474`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- README.md
- product-naming.test.ts
- EventStore
- prisma/schema.prisma
- api.md
- docs/harness/decisions.md
- WorkflowBoard.tsx
- requirements.ts
- browser.ts
- providers.ts
- rules
- ProjectApp.tsx
- event-store.ts
- verify-interpretation-topology.ts
- docs/harness/codebase-cleanup-verification.md
- codebase-audit.ts
- capture-command.test.ts
- package.json
- 2guys1canvas API reference
- ai-presets.ts
- instructions.md
- SaveTrace
- dependencies
- artifacts.ts
- compilerOptions
- .insert
- context.md
- IntentReview.tsx
- rooms.ts
- ref_node_assert_strict
- tool-registry.ts
- save-throughput.test.ts
- Saving and provider repair — 2026-10-17
- SupabasePlatform
- generator.ts
- LinuxJobGroup
- reliability.test.ts
- verify-harness-integration.ts
- live-collaboration-check.mjs
- prelaunch-release-repair.md
- CoordinatorUnavailableError
- verify-intent-ui.ts
- .loadSnapshot
- beta-requests.ts
- ref_node_fs
- Workflow Overview change packet
- App.tsx
- verify-reliability.ts
- IsolationRunner
- multiuser-step09-handoff.md
- fixtures/multiuser-baseline.ts
- scripts
- verify-build-progress.ts
- OpenRouterLeases
- LandingPage.tsx
- migrate-legacy-to-supabase.ts
- project.ts
- isolation.ts
- 2guys1canvas harness implementation checklist
- landing-editorial.md
- .github/workflows/code-checks.yml
- .oxfmtrc.json
- beta-access.test.ts
- ByokSetup.tsx
- devDependencies
- verification.ts
- verify-canvas-surface.ts
- verify-capture-command.mjs
- measure-responsiveness.ts
- 24-pixel SVG favicon
- multiuser-step10-handoff.md
- ref_node_crypto
- graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md
- Harness architecture
- Custom-domain private beta release packet
- Build-save timeout publication — 2026-10-17
- 2guys1canvas context handoff
- 2guys1canvas product brief
- Public entry cleanup
- main.tsx
- .mcp.json
- artifact-reliability.test.ts
- registerProjectRoutes
- 2guys1canvas AI coding instructions
- 2guys1canvas
- verify-coordinator-postgres.ts
- Multi-user harness improvement prompts
- AgentPanel.tsx
- verify-workflow-overview.ts
- supabase-platform.ts
- product-environment.ts
- Multi-user Step 03 handoff - 2026-10-03
- index.ts
- artifact-restoration.test.ts
- ref_esbuild_cjs
- ref_node_assert
- CaptureRecord
- Step 05 handoff — attributable intent and contextual references
- linux-job-launcher.c
- docs/harness/reliability-verification.md
- byok-lease.ts
- contradiction-resolution-plan.md
- Canonical product naming — 2026-10-17
- product.md
- BuildAccounting.tsx
- harness/architecture.md
- start-container.sh
- prepare-ci-cgroup.sh
- run-linux-check.sh
- live-browser-collaboration-check.mjs
- Canvas capture command replacement — 2026-10-17
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 120 edges
2. `Room` - 79 edges
3. `createTwoGuysOneCanvasServer()` - 71 edges
4. `SupabasePlatform` - 63 edges
5. `EventStore` - 58 edges
6. `2guys1canvas harness implementation checklist` - 40 edges
7. `yjs` - 34 edges
8. `IsolationRunner` - 34 edges
9. `registerProjectRoutes()` - 34 edges
10. `productEnvironment()` - 34 edges

## Surprising Connections (you probably didn't know these)
- `Actual runtime, verification and retained failures` --references--> `RoomManager`  [INFERRED]
  docs/harness/multiuser-step09-handoff.md → server/rooms.ts
- `Bounded context and cost target` --references--> `AIRunRecord`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → shared/types.ts
- `Rooms and sessions` --references--> `RoomView`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/api.md → shared/types.ts
- `Responsive delivery and synchronization` --references--> `RoomView`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → shared/types.ts
- `Results` --references--> `LocalWaitlist`  [INFERRED]
  docs/harness/beta-registration-visibility.md → server/beta.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Participant-scoped durable submission safety** — api_canonical_saved_receipts, api_flush_ordering, api_retired_legacy_build, api_durable_submit, api_capture_order [EXTRACTED 1.00]
- **Verified cleanup preserves workflow authority** — docs_harness_codebase_cleanup_verification_scaffold_removal, docs_harness_codebase_cleanup_verification_shared_extraction, docs_harness_architecture_durable_workflow, docs_harness_codebase_cleanup_verification_local_cleanup_checks [EXTRACTED 1.00]
- **October durable reliability contract** — docs_harness_reliability_verification_ordered_recovery, docs_harness_reliability_verification_ordered_submission_recovery, docs_harness_architecture_canonical_save_receipts, docs_harness_architecture_coordinator_fencing [EXTRACTED 1.00]
- **Feature edit authority and import boundaries** — instructions_feature_packet, instructions_shared_boundary, instructions_source_ownership, instructions_jev_advisory [EXTRACTED 1.00]
- **Collaborative submission-to-promoted-artifact flow** — product_core_loop, product_capture_order, product_durable_receipts, product_bounded_recovery [EXTRACTED 1.00]

## Communities (121 total, 16 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.08
Nodes (30): Later-step source audit, catalogRate(), effortAllowance(), createTwoGuysOneCanvasServer(), acceptedContext(), hasOpenContradictions(), BudgetReservation, ClientSocket (+22 more)

### Community 1 - "README.md"
Cohesion: 0.10
Nodes (18): Historical documentation archive, Explicit pnpm native build allowlist, Current source facade and shared contracts, Shared bounded recovery and retained artifact, Current owner-controlled BYOK setup dialog, Cloudflare Worker/container deployment boundary, Controlled three-profile reliability check, Separate pinned direct TypeSafe audit adapter (+10 more)

### Community 2 - "product-naming.test.ts"
Cohesion: 0.09
Nodes (13): esbuild, ref_node_vm, baseline, browser, checks, dir, frames, legacyPreview (+5 more)

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 5 - "api.md"
Cohesion: 0.06
Nodes (42): RoomView.requirementRevisions accepted snapshots, PKCE callback and account-choice flow, Immutable canonical WebSocket saved receipts, Capture-order interpretation and explicit recovery, Authoritative multi-option ConflictGroup, Revision-safe affected-contributor conflict selections, Workflow coordinator fencing RPC contracts, Persisted Developer task evidence (+34 more)

### Community 6 - "docs/harness/decisions.md"
Cohesion: 0.05
Nodes (48): D-0001 â€” Preserve the existing application while migrating additively, D-0002 â€” Personal interpretations are proposals, not builder authority, D-0003 â€” Build from the accepted registry, not the raw canvas, D-0004 â€” Deletion is not withdrawal, D-0005 â€” Pause on consequential accepted contradictions, D-0006 â€” Conflict groups and explicit affected-contributor agreement, D-0007 â€” Classify per intent and reprocess only by explicit participant action, D-0008 â€” Submit intent explicitly; collaborate continuously (+40 more)

### Community 7 - "WorkflowBoard.tsx"
Cohesion: 0.19
Nodes (16): src_workflow_overview, date(), number(), statuses, UsageChart(), WorkflowBoard(), empty(), known() (+8 more)

### Community 8 - "requirements.ts"
Cohesion: 0.08
Nodes (48): buildProgressFor(), applyIntentCommand(), categories, fail(), intentCommandHash(), parseIntentCommand(), acceptanceFor(), acceptedClassification() (+40 more)

### Community 9 - "browser.ts"
Cohesion: 0.12
Nodes (25): ref_node_child_process, ref_node_module, executable, sandbox, assertVerificationBrowserAvailable(), browserExecutable(), BrowserProtocol, linuxBrowserFileBytes (+17 more)

### Community 10 - "providers.ts"
Cohesion: 0.07
Nodes (41): ref_node_async_hooks, accounting, adapterFor(), adapters, anthropic, balancedObject(), bearer(), classify() (+33 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.07
Nodes (25): safeLocalDestination(), needsSessionRefresh(), clearProjectSessionCache(), completeOAuthCallback(), OAuthCallbackOutcome, authMessage(), BetaAccess(), ForgotPassword() (+17 more)

### Community 13 - "event-store.ts"
Cohesion: 0.13
Nodes (12): ActorType, EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow (+4 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.08
Nodes (36): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+28 more)

### Community 15 - "docs/harness/codebase-cleanup-verification.md"
Cohesion: 0.08
Nodes (35): One durable workflow and caller-only submission, Active temporary OpenRouter BYOK, Explicit Jev provider and endpoint isolation, Browser shared server module boundary, October 4 cleanup completion, October4 structural semantic graph refresh, Vercel adapter and Jev smoke completion, AdvancedAISetup call-site correction (+27 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.12
Nodes (27): Budgeted advisory Jev evidence packets, Report-only source reachability and import audit, ref_node_url, typescript, cachedReview(), ImportReference, inputCost(), inspectSources() (+19 more)

### Community 17 - "capture-command.test.ts"
Cohesion: 0.05
Nodes (40): ref_y_protocols_awareness, states(), CAPTURE_VERSION, CaptureEnvelope, CaptureSource, CaptureState, encodeCaptureBytes(), MAX_CAPTURE_BYTES (+32 more)

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (29): engines, node, name, packageManager, private, type, version, cross-env (+21 more)

### Community 19 - "2guys1canvas API reference"
Cohesion: 0.13
Nodes (15): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+7 more)

### Community 20 - "ai-presets.ts"
Cohesion: 0.07
Nodes (42): Deterministic inference-free routing, Model-routing evaluation protocol 2026-09-22.v3, Repeated trial qualification thresholds, aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge() (+34 more)

### Community 21 - "instructions.md"
Cohesion: 0.08
Nodes (24): Planned feature change evidence packet, Protected submission, save and coordinator semantics, TypeSafe reranking workflow cited in pilot plan, React/Vite and Express facade entrypoints, Explicit affected-contributor agreement, Advisory audit provider and model authority, Runtime external/model validation, Active memory-only OpenRouter BYOK (+16 more)

### Community 22 - "SaveTrace"
Cohesion: 0.23
Nodes (4): safeId(), SaveTrace, Stage, Timing

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "artifacts.ts"
Cohesion: 0.18
Nodes (22): ArchivedVersion, ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, ArtifactUnavailableError, ArtifactVersion, bodyFromBytes() (+14 more)

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - ".insert"
Cohesion: 0.20
Nodes (3): WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 27 - "context.md"
Cohesion: 0.10
Nodes (18): Current browser/server coordinator facades, Current temporary OpenRouter BYOK, Durable caller-owned submission capture, Prepared coordinator migration and external verification gaps, Bounded one-file recovery checkpoints, Protected migration tool retained despite false obsolete judgment, October 1 local reliability evidence, Current Canvas Shared context rail (+10 more)

### Community 28 - "IntentReview.tsx"
Cohesion: 0.20
Nodes (13): IntentTarget, InterpretationIntentCategory, Join(), enter(), legacyKey(), readBrowserStorage(), removeBrowserStorage(), writeBrowserStorage() (+5 more)

### Community 29 - "rooms.ts"
Cohesion: 0.06
Nodes (55): Extracted workspace and steering helpers, Shared response models, AISettings, BudgetWindow, collaborationBatchSize, DurableStore, ProjectRole, RunWindow (+47 more)

### Community 30 - "ref_node_assert_strict"
Cohesion: 0.12
Nodes (5): ref_node_assert_strict, ref_node_http, ref_node_os, ref_node_test, yjs

### Community 31 - "tool-registry.ts"
Cohesion: 0.11
Nodes (21): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites, IsolationDiagnostics, safeIsolationDiagnostics() (+13 more)

### Community 32 - "save-throughput.test.ts"
Cohesion: 0.17
Nodes (11): dir, manager, observations, platform, project, createArtifactFixture(), edit(), packet() (+3 more)

### Community 33 - "Saving and provider repair — 2026-10-17"
Cohesion: 0.33
Nodes (6): Bounded change packet, Demonstrated defects and changes, Local verification and limits, Provider contract review and hosted evidence, Remaining acceptance and recovery, Saving and provider repair — 2026-10-17

### Community 34 - "SupabasePlatform"
Cohesion: 0.13
Nodes (3): fail(), normalizeProjectTitle(), SupabasePlatform

### Community 35 - "generator.ts"
Cohesion: 0.11
Nodes (27): clean(), demoExtract(), AgentChange, AIConfig, boundedInput(), callOpenAI(), classification, compactRequirement() (+19 more)

### Community 36 - "LinuxJobGroup"
Cohesion: 0.29
Nodes (3): LinuxJobGroup, unavailable(), wait()

### Community 37 - "reliability.test.ts"
Cohesion: 0.22
Nodes (3): applySteeringUpdate(), plainText(), edit()

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.06
Nodes (36): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+28 more)

### Community 39 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 40 - "prelaunch-release-repair.md"
Cohesion: 0.13
Nodes (13): Exact owner and approval process, Pre-launch and private beta change packet, Release prerequisites and rollback, Verification and handoff, Conditional same-host alternative, Evidence and smallest next action, If delegation is unavailable, Linux browser isolation: bounded alternative and platform questions (+5 more)

### Community 41 - "CoordinatorUnavailableError"
Cohesion: 0.17
Nodes (8): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, CoordinatorUnavailableError, RemoteCoordinator

### Community 42 - "verify-intent-ui.ts"
Cohesion: 0.11
Nodes (16): Transport and authentication, Browser, browsers, dataDir, fake, inputs, open(), output (+8 more)

### Community 43 - ".loadSnapshot"
Cohesion: 0.29
Nodes (5): replayCaptureJournal(), decodePersistedYjsUpdate(), encodePostgresBytea(), legacyBufferShape(), persistedRawBytes()

### Community 44 - "beta-requests.ts"
Cohesion: 0.09
Nodes (31): Beta access request change packet — 2026-10-09, Evidence and release status, Initial external configuration observations, Operations and manual acceptance, Outcome and bounded scope, Stage contracts and acceptance, Verified deployment — 2026-10-09, Authorized main publication — 2026-10-16 (+23 more)

### Community 45 - "ref_node_fs"
Cohesion: 0.05
Nodes (35): WebSocket collaboration, ref_node_fs, ref_node_net, ref_node_path, browser, output, profile, browser (+27 more)

### Community 46 - "Workflow Overview change packet"
Cohesion: 0.33
Nodes (6): Evidence and contracts, Implementation evidence, Outcome and scope, Verification and recovery, Workflow-only main integration — 2026-10-15, Workflow Overview change packet

### Community 47 - "App.tsx"
Cohesion: 0.10
Nodes (22): Reference-led presentation update (2026-09-30), kinds, previewInitType(), PreviewKind, previewMessageKind(), WorkflowStatus, FormatChoice, Product() (+14 more)

### Community 48 - "verify-reliability.ts"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, open(), output, providerAddress, room (+2 more)

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (30): BASIC_ACCOUNTING, BASIC_LIMIT, DllImport, EXTENDED_LIMIT, FileSystemRights, IntPtr, IO_COUNTERS, PROCESS_INFORMATION (+22 more)

### Community 50 - "multiuser-step09-handoff.md"
Cohesion: 0.17
Nodes (10): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures, Actual runtime, verification and retained failures, Controlled comparison, Files, rollout and next work (+2 more)

### Community 51 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.14
Nodes (14): output, report, trials, ToolRegistry, Attempt, interpretation(), Observation, pause() (+6 more)

### Community 52 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, audit:code, build, check:boundaries, deploy:cloudflare, dev, migrate:legacy, start (+1 more)

### Community 53 - "verify-build-progress.ts"
Cohesion: 0.11
Nodes (18): ref_node_stream, ref_node_string_decoder, address, Browser, browsers, candidates, converge(), dataDir (+10 more)

### Community 54 - "OpenRouterLeases"
Cohesion: 0.32
Nodes (3): OpenRouterLeases, catalog(), model()

### Community 55 - "LandingPage.tsx"
Cohesion: 0.14
Nodes (14): Approved scope, Founder contacts in the public footer, Icon presentation follow-up — 2026-10-16, Local verification, Verification plan, BrandMark(), src_landing, ArtifactTab (+6 more)

### Community 56 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.17
Nodes (10): ref_dotenv_config, apply, args, backup, client, dataArg, dataDir, mapping (+2 more)

### Community 57 - "project.ts"
Cohesion: 0.11
Nodes (25): ref_node_path_posix, measurements, addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, allowedExtensions, applyOperations() (+17 more)

### Community 58 - "isolation.ts"
Cohesion: 0.18
Nodes (19): Linux verification follow-up — 2026-10-08, ref_node_events, assertIsolationAvailable(), cancelled(), compileIsolated(), Dependency, hostEnvironment(), IsolatedRequest (+11 more)

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (40): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+32 more)

### Community 60 - "landing-editorial.md"
Cohesion: 0.33
Nodes (5): Approved pre-launch landing redesign, Bounded scope, Contracts to preserve, Outcome and authority, Verification and release

### Community 61 - ".github/workflows/code-checks.yml"
Cohesion: 0.43
Nodes (6): Frozen pnpm lockfile installation, Commit-pinned GitHub Actions, Code checks on push and pull request, CI pnpm 10.18.3 and Node 24, Import-boundary, test and build gates, Offline GitHub code validation

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "beta-access.test.ts"
Cohesion: 0.12
Nodes (16): ref_node_sqlite, approved, browser, checks, chrome, directory, local, output (+8 more)

### Community 64 - "ByokSetup.tsx"
Cohesion: 0.24
Nodes (8): ByokSetup is the mounted setup surface, lucide-react, TemporaryModel, ByokSetup(), dollars(), Lease, ModelChoice(), request()

### Community 65 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 66 - "verification.ts"
Cohesion: 0.24
Nodes (12): assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript, planVerification() (+4 more)

### Community 67 - "verify-canvas-surface.ts"
Cohesion: 0.20
Nodes (9): browser, checks, errors, output, room, runtime, sockets, until() (+1 more)

### Community 68 - "verify-capture-command.mjs"
Cohesion: 0.14
Nodes (11): browser, capture, captureGate, checks, dir, envelopes, fake, interpreterGate (+3 more)

### Community 69 - "measure-responsiveness.ts"
Cohesion: 0.24
Nodes (8): September 26 localhost responsiveness benchmark, Lazy route split transferred-byte evidence, Unmeasured production and provider timing, ref_node_perf_hooks, median(), run(), Sample, wait()

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "multiuser-step10-handoff.md"
Cohesion: 0.29
Nodes (6): Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review

### Community 72 - "ref_node_crypto"
Cohesion: 0.23
Nodes (10): ref_node_crypto, buildFiles, config, files, fingerprint, hash, betaAccounts, betaDatabase (+2 more)

### Community 73 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.16
Nodes (16): Ambient declarations require reachability exceptions, Dated proposed codebase cleanup plan, Unmeasured optional-context reduction target, Planned deterministic reachability and boundary triage, Graph and grammar limitations in planning snapshot, Proposed model/hash/policy Jev answer cache, Proposed 20-prompt Jev evaluation, Proposed report-only Jev pilot (+8 more)

### Community 74 - "Harness architecture"
Cohesion: 0.08
Nodes (24): 2guys1canvas presentation and invitation boundary (2026-09-30), Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Bounded context and cost target, Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary, Deployment constraint (+16 more)

### Community 75 - "Custom-domain private beta release packet"
Cohesion: 0.22
Nodes (9): Acceptance evidence and handoff, Blocked deployment repair packet — 2026-10-08, Current execution status, Custom-domain private beta release packet, Latest verified handoff — 2026-10-08, Outcome and bounded scope, Prepared changes and compatibility, Verification, execution and recovery plan (+1 more)

### Community 76 - "Build-save timeout publication — 2026-10-17"
Cohesion: 0.50
Nodes (4): Bounded change packet, Build-save timeout publication — 2026-10-17, Integrated behavior, Verification and publication

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 79 - "Public entry cleanup"
Cohesion: 0.50
Nodes (4): Local evidence and review handoff, Navigation and verification plan, Public entry cleanup, Requested outcome and boundaries

### Community 80 - "main.tsx"
Cohesion: 0.10
Nodes (19): Vite HTML client mount, react, ref_react_dom_client, @supabase/supabase-js, AuthenticatedRequest, BetaReview(), date(), App (+11 more)

### Community 82 - "artifact-reliability.test.ts"
Cohesion: 0.23
Nodes (13): AuthoredPassage, AuthoredSpan, captureAuthoredPassages(), deletedSpans(), insertedSpans(), AcceptedIntentContext, generic, normalize() (+5 more)

### Community 85 - "registerProjectRoutes"
Cohesion: 0.22
Nodes (13): express, artifactResponse(), coordinatorRetry, coordinatorResponse(), InvitationEmailSender, appOrigin(), bearer(), displayName() (+5 more)

### Community 90 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 92 - "2guys1canvas"
Cohesion: 0.13
Nodes (15): 2guys1canvas, Active hosted MVP: OpenRouter BYOK, AI steering documents, Architecture, Checks, Connect AI, Current boundaries, Current product setup (2026-09-30) (+7 more)

### Community 93 - "verify-coordinator-postgres.ts"
Cohesion: 0.13
Nodes (11): pg, a, admin, b, checks, ownerA, ownerB, project (+3 more)

### Community 94 - "Multi-user harness improvement prompts"
Cohesion: 0.15
Nodes (13): Common contract, Multi-user harness improvement prompts, Starting instruction, Step 01 - Audit, scenarios and baseline, Step 02 - Coordinator fencing and owner routing, Step 03 - Artifact persistence and restoration, Step 04 - Generated execution isolation, Step 05 - Intent inspection, correction and contextual references (+5 more)

### Community 95 - "AgentPanel.tsx"
Cohesion: 0.18
Nodes (15): Canvas writing surface, Evidence and contracts, Local evidence, Requested outcome and boundaries, Verification plan, AIResolvedLayer, dollars(), rateSummary() (+7 more)

### Community 96 - "verify-workflow-overview.ts"
Cohesion: 0.15
Nodes (9): browser, checks, errors, midnight, output, room, runtime, sockets (+1 more)

### Community 97 - "supabase-platform.ts"
Cohesion: 0.15
Nodes (16): ref_supabase_server_core, RecoveryCheckpoint, decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), AuthenticatedUser, hashToken() (+8 more)

### Community 98 - "product-environment.ts"
Cohesion: 0.17
Nodes (13): @cloudflare/containers, ref_cloudflare_workers, canonicalProductEnvironment(), legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig (+5 more)

### Community 99 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 101 - "index.ts"
Cohesion: 0.13
Nodes (20): ws, browser, dataDir, group, profile, room, token, b64() (+12 more)

### Community 103 - "artifact-restoration.test.ts"
Cohesion: 0.32
Nodes (4): buildFixture(), files, manager(), version()

### Community 113 - "Step 05 handoff — attributable intent and contextual references"
Cohesion: 0.33
Nodes (6): Checks and honest scope, Durability, uncertainty and compatibility, Files and decision, Outcome and reproduced boundary, Step 05 handoff — attributable intent and contextual references, Unrun release dependencies and next step

### Community 114 - "linux-job-launcher.c"
Cohesion: 0.29
Nodes (5): errno, prctl, signal, stdio, unistd

### Community 115 - "docs/harness/reliability-verification.md"
Cohesion: 0.08
Nodes (26): Bounded complete-file recovery, Immutable insertion and deletion save receipts, Single coordinator and lease fencing, Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff (+18 more)

### Community 117 - "byok-lease.ts"
Cohesion: 0.25
Nodes (8): BYOK_LEASE_MS, BYOK_MODEL_VERSION, BYOK_ROLE_LIMITS, Lease, LeaseModel, modelsFrom(), nonnegative(), AIReasoningConfig

### Community 120 - "contradiction-resolution-plan.md"
Cohesion: 0.40
Nodes (4): Conflict-group acceptance matrix, Additive ConflictGroup migration plan, Decisions needed and Disagreements UI target, Planned conflict alternatives and reopen mutations

### Community 121 - "Canonical product naming — 2026-10-17"
Cohesion: 0.18
Nodes (8): Bounded change packet, Canonical product naming — 2026-10-17, Compatibility plan and rollback, Completed inventory and fresh local verification, Production-image gate, Residual ledger and cutover, Verification, TwoGuysOneCanvasContainer

### Community 122 - "product.md"
Cohesion: 0.11
Nodes (17): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02, Serialized eight-task and 24-call recovery, Disconnected-first OpenRouter BYOK setup, Attributed capture-order interpretation, Collaborative submission-to-artifact loop (+9 more)

### Community 123 - "BuildAccounting.tsx"
Cohesion: 0.39
Nodes (7): NormalizedAIUsage, VerificationSummary(), BuildAccounting(), comparableMetrics(), runKey(), tokenCount(), UsageSummary()

### Community 126 - "harness/architecture.md"
Cohesion: 0.07
Nodes (31): Participant-scoped IndexedDB recovery, Remaining hosted owner routing and archive limits, Verified-email invitations preserve roles and links, Offline developer audit boundary, Physical provider attempt and partial accounting, Hosted byte preservation and membership authority, 40 ms Yjs batching and explicit flush, Artifact reliability repairs — 2026-10-18 (+23 more)

### Community 135 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 136 - "Canvas capture command replacement — 2026-10-17"
Cohesion: 0.17
Nodes (12): Allowed implementation and verification scope, Authorized beta migration — 2026-10-18, Canvas capture command replacement — 2026-10-17, Change packet and baseline, Contract and authority, Deletion manifest, Final source and handoff — 2026-10-18, Implemented cutover and evidence ledger (+4 more)

### Community 141 - "AGENTS.md"
Cohesion: 0.12
Nodes (14): Durable workflow is the primary shared object, Bounded feature change packet, Graphify scoped source navigation, AST-only graph refresh, Graphify wiki broad navigation, Targets versus verified implementation, Offline Jev rankings are advisory, One logical coordinator (+6 more)

## Knowledge Gaps
- **754 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+749 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1096 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `EventStore` connect `EventStore` to `RoomManager`, `product-naming.test.ts`, `reliability.test.ts`, `verify-harness-integration.ts`, `CaptureRecord`, `event-store.ts`, `fixtures/multiuser-baseline.ts`, `artifacts.ts`, `.insert`, `rooms.ts`, `ref_node_assert_strict`, `tool-registry.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `yjs` connect `ref_node_assert_strict` to `save-throughput.test.ts`, `supabase-platform.ts`, `product-naming.test.ts`, `measure-responsiveness.ts`, `reliability.test.ts`, `live-collaboration-check.mjs`, `artifact-restoration.test.ts`, `index.ts`, `.loadSnapshot`, `App.tsx`, `capture-command.test.ts`, `package.json`, `artifact-reliability.test.ts`, `fixtures/multiuser-baseline.ts`, `rooms.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Are the 35 inferred relationships involving `createTwoGuysOneCanvasServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createTwoGuysOneCanvasServer()` has 35 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _754 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.07721139430284858 - nodes in this community are weakly interconnected._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.09538461538461539 - nodes in this community are weakly interconnected._