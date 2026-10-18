# Graph Report - Devoffice  (2026-10-18)

## Corpus Check
- 271 files · ~249,143 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 6, .css 6, .example 1)

## Summary
- 2470 nodes · 6041 edges · 111 communities (97 shown, 14 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 220 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b6f49aca`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- README.md
- CoordinatorUnavailableError
- EventStore
- prisma/schema.prisma
- api.md
- docs/harness/decisions.md
- verify-candidate-evidence.ts
- requirements.ts
- ref_node_fs
- providers.ts
- rules
- ProjectApp.tsx
- event-store.ts
- verify-interpretation-topology.ts
- docs/harness/codebase-cleanup-verification.md
- codebase-audit.ts
- verify-product-naming.mjs
- package.json
- generated-isolation.test.ts
- ai-presets.ts
- instructions.md
- SaveTrace
- dependencies
- artifacts.ts
- compilerOptions
- tool-registry.ts
- context.md
- rooms.ts
- WorkflowBoard.tsx
- ref_node_crypto
- project.ts
- verification.ts
- graphify-out/SOURCE_MAP.md
- SupabasePlatform
- generator.ts
- multiuser-step09-handoff.md
- provider.ts
- verify-harness-integration.ts
- live-collaboration-check.mjs
- harness/checklist.md
- 2guys1canvas API reference
- verify-intent-ui.ts
- supabase-platform.ts
- migrate-legacy-to-supabase.ts
- AGENTS.md
- workflow-overview.md
- App.tsx
- artifact-restoration.test.ts
- IsolationRunner
- Multi-user Step 04 handoff - 2026-10-04
- fixtures/multiuser-baseline.ts
- scripts
- verify-build-progress.ts
- token
- main.tsx
- isolation.ts
- 2guys1canvas harness implementation checklist
- docs/harness/reliability-verification.md
- .github/workflows/code-checks.yml
- .oxfmtrc.json
- beta-access.test.ts
- verify-canvas-surface.ts
- devDependencies
- ref_node_child_process
- Step 06 handoff — stable progress under ongoing steering
- 24-pixel SVG favicon
- graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md
- Harness architecture
- Custom-domain private beta release packet
- browser.ts
- 2guys1canvas context handoff
- 2guys1canvas product brief
- beta-requests.ts
- .mcp.json
- linux-cgroup.ts
- registerProjectRoutes
- 2guys1canvas AI coding instructions
- reliability.test.ts
- 2guys1canvas
- verify-coordinator-postgres.ts
- Multi-user harness improvement prompts
- AgentPanel.tsx
- linux-cgroup-isolation.test.ts
- productEnvironment
- Multi-user Step 03 handoff - 2026-10-03
- index.ts
- yjs
- ref_esbuild_cjs
- ref_node_assert
- linux-job-launcher.c
- product-naming.test.ts
- byok-lease.ts
- Canonical product naming — 2026-10-17
- BuildAccounting.tsx
- OpenRouterLeases
- start-container.sh
- prepare-ci-cgroup.sh
- run-linux-check.sh
- harness/architecture.md
- live-browser-collaboration-check.mjs
- Canvas capture command replacement — 2026-10-17
- product.md

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 120 edges
2. `Room` - 79 edges
3. `createTwoGuysOneCanvasServer()` - 69 edges
4. `SupabasePlatform` - 63 edges
5. `EventStore` - 58 edges
6. `2guys1canvas harness implementation checklist` - 40 edges
7. `IsolationRunner` - 34 edges
8. `registerProjectRoutes()` - 34 edges
9. `productEnvironment()` - 34 edges
10. `yjs` - 32 edges

## Surprising Connections (you probably didn't know these)
- `Outcome and responsible boundary` --references--> `bundleProject()`  [INFERRED]
  docs/harness/multiuser-step04-handoff.md → server/project.ts
- `Actual runtime, verification and retained failures` --references--> `RoomManager`  [INFERRED]
  docs/harness/multiuser-step09-handoff.md → server/rooms.ts
- `Bounded context and cost target` --references--> `AIRunRecord`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → shared/types.ts
- `Results` --references--> `LocalWaitlist`  [INFERRED]
  docs/harness/beta-registration-visibility.md → server/beta.ts
- `Outcome and boundaries` --references--> `RemoteCoordinator`  [INFERRED]
  docs/harness/multiuser-step02-handoff.md → server/coordinator.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Participant-scoped durable submission safety** — api_canonical_saved_receipts, api_flush_ordering, api_retired_legacy_build, api_durable_submit, api_capture_order [EXTRACTED 1.00]
- **Verified cleanup preserves workflow authority** — docs_harness_codebase_cleanup_verification_scaffold_removal, docs_harness_codebase_cleanup_verification_shared_extraction, docs_harness_architecture_durable_workflow, docs_harness_codebase_cleanup_verification_local_cleanup_checks [EXTRACTED 1.00]
- **October durable reliability contract** — docs_harness_reliability_verification_ordered_recovery, docs_harness_reliability_verification_ordered_submission_recovery, docs_harness_architecture_canonical_save_receipts, docs_harness_architecture_coordinator_fencing [EXTRACTED 1.00]
- **Feature edit authority and import boundaries** — instructions_feature_packet, instructions_shared_boundary, instructions_source_ownership, instructions_jev_advisory [EXTRACTED 1.00]
- **Collaborative submission-to-promoted-artifact flow** — product_core_loop, product_capture_order, product_durable_receipts, product_bounded_recovery [EXTRACTED 1.00]

## Communities (111 total, 14 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.07
Nodes (38): Later-step source audit, ref_node_stream, catalogRate(), effortAllowance(), buildProgressFor(), AIConfig, createTwoGuysOneCanvasServer(), acceptedContext() (+30 more)

### Community 1 - "README.md"
Cohesion: 0.06
Nodes (29): Historical documentation archive, Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review, DM Serif Display font (+21 more)

### Community 2 - "CoordinatorUnavailableError"
Cohesion: 0.17
Nodes (8): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, CoordinatorUnavailableError, RemoteCoordinator

### Community 3 - "EventStore"
Cohesion: 0.10
Nodes (4): CaptureRecord, EventStore, WorkflowTask, WorkflowTaskState

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 5 - "api.md"
Cohesion: 0.09
Nodes (28): RoomView.requirementRevisions accepted snapshots, PKCE callback and account-choice flow, Immutable canonical WebSocket saved receipts, Capture-order interpretation and explicit recovery, Authoritative multi-option ConflictGroup, Revision-safe affected-contributor conflict selections, Workflow coordinator fencing RPC contracts, Persisted Developer task evidence (+20 more)

### Community 6 - "docs/harness/decisions.md"
Cohesion: 0.05
Nodes (43): D-0001 â€” Preserve the existing application while migrating additively, D-0002 â€” Personal interpretations are proposals, not builder authority, D-0003 â€” Build from the accepted registry, not the raw canvas, D-0004 â€” Deletion is not withdrawal, D-0005 â€” Pause on consequential accepted contradictions, D-0006 â€” Conflict groups and explicit affected-contributor agreement, D-0007 â€” Classify per intent and reprocess only by explicit participant action, D-0008 â€” Submit intent explicitly; collaborate continuously (+35 more)

### Community 7 - "verify-candidate-evidence.ts"
Cohesion: 0.14
Nodes (16): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+8 more)

### Community 8 - "requirements.ts"
Cohesion: 0.10
Nodes (35): acceptanceFor(), acceptedClassification(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries(), categories, classifications (+27 more)

### Community 9 - "ref_node_fs"
Cohesion: 0.11
Nodes (15): ref_node_assert_strict, ref_node_fs, ref_node_os, ref_node_path, ref_node_test, browser, profile, bundleProject() (+7 more)

### Community 10 - "providers.ts"
Cohesion: 0.07
Nodes (36): ref_node_async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+28 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.06
Nodes (32): @supabase/supabase-js, safeLocalDestination(), needsSessionRefresh(), clearProjectSessionCache(), completeOAuthCallback(), OAuthCallbackOutcome, authMessage(), BetaAccess() (+24 more)

### Community 13 - "event-store.ts"
Cohesion: 0.12
Nodes (13): ActorType, EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow (+5 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.08
Nodes (35): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+27 more)

### Community 15 - "docs/harness/codebase-cleanup-verification.md"
Cohesion: 0.09
Nodes (31): Explicit Jev provider and endpoint isolation, Browser shared server module boundary, October 4 cleanup completion, October4 structural semantic graph refresh, Vercel adapter and Jev smoke completion, AdvancedAISetup call-site correction, Bounded refactor and verification gates, Required-contract recall and context-reduction target (+23 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.05
Nodes (49): September 26 localhost responsiveness benchmark, Lazy route split transferred-byte evidence, Unmeasured production and provider timing, Budgeted advisory Jev evidence packets, Report-only source reachability and import audit, ref_node_fs_promises, ref_node_perf_hooks, ref_node_url (+41 more)

### Community 17 - "verify-product-naming.mjs"
Cohesion: 0.07
Nodes (19): WebSocket collaboration, esbuild, ref_node_vm, browser, outputDir, profile, browser, outputDir (+11 more)

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (29): engines, node, name, packageManager, private, type, version, cross-env (+21 more)

### Community 19 - "generated-isolation.test.ts"
Cohesion: 0.17
Nodes (7): ref_node_events, ref_node_net, fs, path, server_isolation_esbuild_cjs, files, jobs

### Community 20 - "ai-presets.ts"
Cohesion: 0.06
Nodes (45): D-0014 â€” Versioned estimates, not inferred billing, Deterministic inference-free routing, Model-routing evaluation protocol 2026-09-22.v3, Repeated trial qualification thresholds, aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup (+37 more)

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
Cohesion: 0.15
Nodes (21): ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, ArtifactUnavailableError, ArtifactVersion, bodyFromBytes(), canonicalJson() (+13 more)

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "tool-registry.ts"
Cohesion: 0.14
Nodes (12): definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior, ToolContext, ToolDefinition (+4 more)

### Community 27 - "context.md"
Cohesion: 0.10
Nodes (18): Current browser/server coordinator facades, Current temporary OpenRouter BYOK, Durable caller-owned submission capture, Prepared coordinator migration and external verification gaps, Bounded one-file recovery checkpoints, Protected migration tool retained despite false obsolete judgment, October 1 local reliability evidence, Current Canvas Shared context rail (+10 more)

### Community 28 - "rooms.ts"
Cohesion: 0.05
Nodes (58): Extracted workspace and steering helpers, Named AI connections (preferred API), Shared response models, ArchivedVersion, replayCaptureJournal(), applyIntentCommand(), categories, fail() (+50 more)

### Community 29 - "WorkflowBoard.tsx"
Cohesion: 0.19
Nodes (16): src_workflow_overview, date(), number(), statuses, UsageChart(), WorkflowBoard(), empty(), known() (+8 more)

### Community 30 - "ref_node_crypto"
Cohesion: 0.23
Nodes (10): ref_node_crypto, buildFiles, config, files, fingerprint, hash, betaAccounts, betaDatabase (+2 more)

### Community 31 - "project.ts"
Cohesion: 0.17
Nodes (14): ref_node_path_posix, allowedExtensions, downloadableFiles(), FileOperation, generatedRoot, loadProject(), persistProject(), ProjectFile (+6 more)

### Community 32 - "verification.ts"
Cohesion: 0.23
Nodes (12): previewDocument(), assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript (+4 more)

### Community 33 - "graphify-out/SOURCE_MAP.md"
Cohesion: 0.06
Nodes (30): Bounded change packet, Build-save timeout publication — 2026-10-17, Integrated behavior, Verification and publication, Build my changes recovery, Change packet — 2026-10-16, Implementation and evidence, Publication and remaining acceptance (+22 more)

### Community 34 - "SupabasePlatform"
Cohesion: 0.16
Nodes (3): fail(), normalizeProjectTitle(), SupabasePlatform

### Community 35 - "generator.ts"
Cohesion: 0.07
Nodes (45): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, clean(), demoExtract(), AgentChange, boundedInput() (+37 more)

### Community 36 - "multiuser-step09-handoff.md"
Cohesion: 0.17
Nodes (10): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures, Actual runtime, verification and retained failures, Controlled comparison, Files, rollout and next work (+2 more)

### Community 37 - "provider.ts"
Cohesion: 0.05
Nodes (30): ref_y_protocols_awareness, states(), CaptureSource, MAX_CAPTURE_BYTES, WorkspaceScope(), ariaShortcut(), BUILD_SHORTCUT_STORAGE_KEY, BuildShortcutPreference (+22 more)

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.12
Nodes (19): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+11 more)

### Community 39 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 40 - "harness/checklist.md"
Cohesion: 0.07
Nodes (25): October 3 Graphify maintenance evidence, October 3 cleanup plan history, October 1 reliability verification history, October 1 Studio Ivory local checks history, Conflict-group acceptance matrix, Additive ConflictGroup migration plan, Decisions needed and Disagreements UI target, Planned conflict alternatives and reopen mutations (+17 more)

### Community 41 - "2guys1canvas API reference"
Cohesion: 0.17
Nodes (12): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+4 more)

### Community 42 - "verify-intent-ui.ts"
Cohesion: 0.13
Nodes (13): Browser, browsers, dataDir, fake, inputs, open(), output, providerAddress (+5 more)

### Community 43 - "supabase-platform.ts"
Cohesion: 0.11
Nodes (22): ref_supabase_server_core, RecoveryCheckpoint, decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), AuthenticatedUser, hashToken() (+14 more)

### Community 44 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.17
Nodes (10): ref_dotenv_config, apply, args, backup, client, dataArg, dataDir, mapping (+2 more)

### Community 45 - "AGENTS.md"
Cohesion: 0.18
Nodes (10): Durable workflow is the primary shared object, Bounded feature change packet, Graphify scoped source navigation, AST-only graph refresh, Graphify wiki broad navigation, Targets versus verified implementation, Offline Jev rankings are advisory, One logical coordinator (+2 more)

### Community 46 - "workflow-overview.md"
Cohesion: 0.29
Nodes (6): Evidence and contracts, Implementation evidence, Outcome and scope, Verification and recovery, Workflow-only main integration — 2026-10-15, Workflow Overview change packet

### Community 47 - "App.tsx"
Cohesion: 0.13
Nodes (13): Reference-led presentation update (2026-09-30), BuildProgress, WorkflowStatus, FormatChoice, ProviderChoice, providerPresets, statusCopy, tokenParticipant() (+5 more)

### Community 48 - "artifact-restoration.test.ts"
Cohesion: 0.09
Nodes (21): ref_node_http, dir, manager, observations, platform, project, Browser, browsers (+13 more)

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (30): BASIC_ACCOUNTING, BASIC_LIMIT, DllImport, EXTENDED_LIMIT, FileSystemRights, IntPtr, IO_COUNTERS, PROCESS_INFORMATION (+22 more)

### Community 50 - "Multi-user Step 04 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites

### Community 51 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.18
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 52 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, audit:code, build, check:boundaries, deploy:cloudflare, dev, migrate:legacy, start (+1 more)

### Community 53 - "verify-build-progress.ts"
Cohesion: 0.14
Nodes (15): address, Browser, browsers, candidates, converge(), dataDir, fake, gates (+7 more)

### Community 54 - "token"
Cohesion: 0.67
Nodes (3): Transport and authentication, request(), token()

### Community 55 - "main.tsx"
Cohesion: 0.07
Nodes (31): ByokSetup is the mounted setup surface, Approved scope, Founder contacts in the public footer, Icon presentation follow-up — 2026-10-16, Local verification, Verification plan, Vite HTML client mount, lucide-react (+23 more)

### Community 58 - "isolation.ts"
Cohesion: 0.22
Nodes (17): Linux verification follow-up — 2026-10-08, assertIsolationAvailable(), cancelled(), compileIsolated(), Dependency, hostEnvironment(), IsolatedRequest, IsolationOptions (+9 more)

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (40): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+32 more)

### Community 60 - "docs/harness/reliability-verification.md"
Cohesion: 0.10
Nodes (19): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff, Checks and honest scope, Durability, uncertainty and compatibility, Files and decision (+11 more)

### Community 61 - ".github/workflows/code-checks.yml"
Cohesion: 0.43
Nodes (6): Frozen pnpm lockfile installation, Commit-pinned GitHub Actions, Code checks on push and pull request, CI pnpm 10.18.3 and Node 24, Import-boundary, test and build gates, Offline GitHub code validation

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "beta-access.test.ts"
Cohesion: 0.12
Nodes (16): ref_node_sqlite, approved, browser, checks, chrome, directory, local, output (+8 more)

### Community 64 - "verify-canvas-surface.ts"
Cohesion: 0.20
Nodes (9): browser, checks, errors, output, room, runtime, sockets, until() (+1 more)

### Community 65 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 68 - "ref_node_child_process"
Cohesion: 0.06
Nodes (26): ref_node_child_process, ref_node_module, browser, output, profile, classificationCounts, files, listed (+18 more)

### Community 69 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 73 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.16
Nodes (16): Ambient declarations require reachability exceptions, Dated proposed codebase cleanup plan, Unmeasured optional-context reduction target, Planned deterministic reachability and boundary triage, Graph and grammar limitations in planning snapshot, Proposed model/hash/policy Jev answer cache, Proposed 20-prompt Jev evaluation, Proposed report-only Jev pilot (+8 more)

### Community 74 - "Harness architecture"
Cohesion: 0.08
Nodes (26): Rooms and sessions, 2guys1canvas presentation and invitation boundary (2026-09-30), Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Bounded context and cost target, Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary (+18 more)

### Community 75 - "Custom-domain private beta release packet"
Cohesion: 0.22
Nodes (9): Acceptance evidence and handoff, Blocked deployment repair packet — 2026-10-08, Current execution status, Custom-domain private beta release packet, Latest verified handoff — 2026-10-08, Outcome and bounded scope, Prepared changes and compatibility, Verification, execution and recovery plan (+1 more)

### Community 76 - "browser.ts"
Cohesion: 0.27
Nodes (10): ref_node_string_decoder, executable, sandbox, assertVerificationBrowserAvailable(), browserExecutable(), BrowserProtocol, unavailable(), withIsolatedBrowser() (+2 more)

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 80 - "beta-requests.ts"
Cohesion: 0.08
Nodes (35): Beta access request change packet — 2026-10-09, Evidence and release status, Initial external configuration observations, Operations and manual acceptance, Outcome and bounded scope, Stage contracts and acceptance, Verified deployment — 2026-10-09, Authorized main publication — 2026-10-16 (+27 more)

### Community 82 - "linux-cgroup.ts"
Cohesion: 0.22
Nodes (5): linuxBrowserMemoryBytes, LinuxJobGroup, linuxJobLauncher, unavailable(), wait()

### Community 85 - "registerProjectRoutes"
Cohesion: 0.21
Nodes (13): express, artifactResponse(), coordinatorRetry, coordinatorResponse(), InvitationEmailSender, appOrigin(), bearer(), displayName() (+5 more)

### Community 90 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 91 - "reliability.test.ts"
Cohesion: 0.19
Nodes (4): applySteeringUpdate(), plainText(), verifiedList, edit()

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
Cohesion: 0.17
Nodes (16): Canvas writing surface, Evidence and contracts, Local evidence, Requested outcome and boundaries, Verification plan, AIEffort, AIResolvedLayer, dollars() (+8 more)

### Community 97 - "linux-cgroup-isolation.test.ts"
Cohesion: 0.24
Nodes (8): linuxBrowserFileBytes, linuxBrowserFileDescriptors, output(), jobs(), linux, noGroups(), removed(), wait()

### Community 98 - "productEnvironment"
Cohesion: 0.19
Nodes (14): @cloudflare/containers, ref_cloudflare_workers, canonicalProductEnvironment(), productEnvironment(), legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig() (+6 more)

### Community 99 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 101 - "index.ts"
Cohesion: 0.07
Nodes (31): ws, browser, dataDir, group, profile, room, token, browser (+23 more)

### Community 104 - "yjs"
Cohesion: 0.13
Nodes (19): yjs, CAPTURE_VERSION, CaptureEnvelope, CaptureState, encodeCaptureBytes(), MAX_CAPTURE_UPDATES, deletionSignature(), Attempt (+11 more)

### Community 114 - "linux-job-launcher.c"
Cohesion: 0.29
Nodes (5): errno, prctl, signal, stdio, unistd

### Community 116 - "product-naming.test.ts"
Cohesion: 0.11
Nodes (20): infrastructureFiles, kinds, previewInitType(), PreviewKind, previewMessageKind(), IntentCommandResult, IntentTarget, InterpretationIntentCategory (+12 more)

### Community 117 - "byok-lease.ts"
Cohesion: 0.22
Nodes (9): BYOK_LEASE_MS, BYOK_MODEL_VERSION, BYOK_ROLE_LIMITS, Lease, LeaseModel, modelsFrom(), nonnegative(), AIReasoningConfig (+1 more)

### Community 121 - "Canonical product naming — 2026-10-17"
Cohesion: 0.18
Nodes (8): Bounded change packet, Canonical product naming — 2026-10-17, Compatibility plan and rollback, Completed inventory and fresh local verification, Production-image gate, Residual ledger and cutover, Verification, TwoGuysOneCanvasContainer

### Community 123 - "BuildAccounting.tsx"
Cohesion: 0.48
Nodes (6): NormalizedAIUsage, BuildAccounting(), comparableMetrics(), runKey(), tokenCount(), UsageSummary()

### Community 124 - "OpenRouterLeases"
Cohesion: 0.32
Nodes (3): OpenRouterLeases, catalog(), model()

### Community 132 - "harness/architecture.md"
Cohesion: 0.09
Nodes (23): Bounded complete-file recovery, Participant-scoped IndexedDB recovery, Immutable insertion and deletion save receipts, Single coordinator and lease fencing, One durable workflow and caller-only submission, Active temporary OpenRouter BYOK, Remaining hosted owner routing and archive limits, Verified-email invitations preserve roles and links (+15 more)

### Community 135 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 136 - "Canvas capture command replacement — 2026-10-17"
Cohesion: 0.20
Nodes (10): Allowed implementation and verification scope, Canvas capture command replacement — 2026-10-17, Change packet and baseline, Contract and authority, Deletion manifest, Final source and handoff — 2026-10-18, Implemented cutover and evidence ledger, Migration/release procedure and rollback (+2 more)

### Community 141 - "product.md"
Cohesion: 0.11
Nodes (17): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02, Serialized eight-task and 24-call recovery, Disconnected-first OpenRouter BYOK setup, Attributed capture-order interpretation, Collaborative submission-to-artifact loop (+9 more)

## Knowledge Gaps
- **748 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+743 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1094 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SupabasePlatform` connect `SupabasePlatform` to `CoordinatorUnavailableError`, `index.ts`, `ref_node_fs`, `supabase-platform.ts`, `beta-requests.ts`, `artifact-restoration.test.ts`, `registerProjectRoutes`, `SaveTrace`, `artifacts.ts`, `ref_node_crypto`, `beta-access.test.ts`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `yjs` connect `yjs` to `generator.ts`, `provider.ts`, `index.ts`, `live-collaboration-check.mjs`, `ref_node_fs`, `supabase-platform.ts`, `App.tsx`, `codebase-audit.ts`, `artifact-restoration.test.ts`, `package.json`, `fixtures/multiuser-baseline.ts`, `reliability.test.ts`, `rooms.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `EventStore` connect `EventStore` to `RoomManager`, `verify-harness-integration.ts`, `ref_node_fs`, `event-store.ts`, `fixtures/multiuser-baseline.ts`, `product-naming.test.ts`, `artifacts.ts`, `tool-registry.ts`, `reliability.test.ts`, `rooms.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Are the 35 inferred relationships involving `createTwoGuysOneCanvasServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createTwoGuysOneCanvasServer()` has 35 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _748 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.06954838709677419 - nodes in this community are weakly interconnected._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.06153846153846154 - nodes in this community are weakly interconnected._