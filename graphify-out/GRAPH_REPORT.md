# Graph Report - Devoffice  (2026-10-17)

## Corpus Check
- 259 files · ~241,553 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 6, .css 6, .example 1)

## Summary
- 2379 nodes · 5703 edges · 115 communities (100 shown, 15 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 196 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ae3653b4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- README.md
- verify-candidate-evidence.ts
- EventStore
- prisma/schema.prisma
- api.md
- docs/harness/decisions.md
- productEnvironment
- requirements.ts
- index.ts
- providers.ts
- rules
- ProjectApp.tsx
- event-store.ts
- verify-interpretation-topology.ts
- docs/harness/codebase-cleanup-verification.md
- codebase-audit.ts
- ref_node_fs
- package.json
- generated-isolation.test.ts
- ai-presets.ts
- instructions.md
- workflow-overview.md
- dependencies
- check-product-naming.mjs
- compilerOptions
- graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md
- context.md
- types.ts
- rooms.ts
- product-environment.ts
- verification.ts
- linux-cgroup-isolation.test.ts
- ai-accounting.ts
- supabase-platform.ts
- tool-registry.ts
- AGENTS.md
- yjs
- verify-harness-integration.ts
- reliability.test.ts
- prelaunch-release-repair.md
- RemoteCoordinator
- verify-intent-ui.ts
- project.ts
- verify-save-timeout.mjs
- generator.ts
- live-browser-collaboration-check.mjs
- App.tsx
- ref_node_assert_strict
- IsolationRunner
- Step 05 handoff — attributable intent and contextual references
- fixtures/multiuser-baseline.ts
- scripts
- verify-build-progress.ts
- ProjectFile
- main.tsx
- artifact-restoration.test.ts
- isolation.ts
- 2guys1canvas harness implementation checklist
- harness/checklist.md
- .github/workflows/code-checks.yml
- .oxfmtrc.json
- product-naming.test.ts
- verify-canvas-surface.ts
- devDependencies
- 2guys1canvas API reference
- verify-product-naming.mjs
- Step 06 handoff — stable progress under ongoing steering
- 24-pixel SVG favicon
- measure-responsiveness.ts
- local-drafts.ts
- Harness architecture
- Custom-domain private beta release packet
- 2guys1canvas context handoff
- 2guys1canvas product brief
- beta-requests.ts
- .mcp.json
- BuildAccounting.tsx
- 2guys1canvas AI coding instructions
- token
- 2guys1canvas
- verify-coordinator-postgres.ts
- Multi-user harness improvement prompts
- WorkflowBoard.tsx
- intent-authority.ts
- workflow-budget.test.ts
- Multi-user Step 03 handoff - 2026-10-03
- verify-workflow-overview.ts
- Multi-user Step 01 evidence and handoff
- linux-cgroup.ts
- ref_esbuild_cjs
- ref_node_assert
- verify-reliability.ts
- Multi-user Step 07 handoff - 2026-10-04
- linux-job-launcher.c
- IntentReview.tsx
- ByokSetup.tsx
- product.md
- Canonical product naming — 2026-10-17
- save-throughput.test.ts
- Multi-user Step 04 handoff - 2026-10-04
- byok-lease.ts
- start-container.sh
- prepare-ci-cgroup.sh
- run-linux-check.sh
- harness/architecture.md
- ref_node_crypto

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 115 edges
2. `Room` - 76 edges
3. `createTwoGuysOneCanvasServer()` - 66 edges
4. `SupabasePlatform` - 60 edges
5. `EventStore` - 55 edges
6. `2guys1canvas harness implementation checklist` - 40 edges
7. `IsolationRunner` - 34 edges
8. `registerProjectRoutes()` - 34 edges
9. `productEnvironment()` - 34 edges
10. `graphify-out/SOURCE_MAP.md` - 30 edges

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

## Communities (115 total, 15 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.07
Nodes (35): Submission scheduling: current implementation and required hardening, Later-step source audit, ref_node_stream, catalogRate(), buildProgressFor(), CoordinatorUnavailableError, AIConfig, listProviderModels() (+27 more)

### Community 1 - "README.md"
Cohesion: 0.11
Nodes (18): Historical documentation archive, Explicit pnpm native build allowlist, Current source facade and shared contracts, Shared bounded recovery and retained artifact, Current owner-controlled BYOK setup dialog, Cloudflare Worker/container deployment boundary, Controlled three-profile reliability check, Separate pinned direct TypeSafe audit adapter (+10 more)

### Community 2 - "verify-candidate-evidence.ts"
Cohesion: 0.13
Nodes (17): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+9 more)

### Community 3 - "EventStore"
Cohesion: 0.09
Nodes (5): ArtifactBody, EventStore, WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 5 - "api.md"
Cohesion: 0.09
Nodes (28): RoomView.requirementRevisions accepted snapshots, PKCE callback and account-choice flow, Immutable canonical WebSocket saved receipts, Capture-order interpretation and explicit recovery, Authoritative multi-option ConflictGroup, Revision-safe affected-contributor conflict selections, Workflow coordinator fencing RPC contracts, Persisted Developer task evidence (+20 more)

### Community 6 - "docs/harness/decisions.md"
Cohesion: 0.05
Nodes (48): D-0001 â€” Preserve the existing application while migrating additively, D-0002 â€” Personal interpretations are proposals, not builder authority, D-0003 â€” Build from the accepted registry, not the raw canvas, D-0004 â€” Deletion is not withdrawal, D-0005 â€” Pause on consequential accepted contradictions, D-0006 â€” Conflict groups and explicit affected-contributor agreement, D-0007 â€” Classify per intent and reprocess only by explicit participant action, D-0008 â€” Submit intent explicitly; collaborate continuously (+40 more)

### Community 7 - "productEnvironment"
Cohesion: 0.21
Nodes (13): ref_node_child_process, ref_node_module, ref_node_string_decoder, executable, sandbox, assertVerificationBrowserAvailable(), browserExecutable(), BrowserProtocol (+5 more)

### Community 8 - "requirements.ts"
Cohesion: 0.09
Nodes (42): applyIntentCommand(), categories, fail(), intentCommandHash(), parseIntentCommand(), acceptanceFor(), acceptedClassification(), acceptedRequirements() (+34 more)

### Community 9 - "index.ts"
Cohesion: 0.12
Nodes (19): express, ws, browser, dataDir, group, profile, room, token (+11 more)

### Community 10 - "providers.ts"
Cohesion: 0.07
Nodes (35): ref_node_async_hooks, accounting, adapterFor(), adapters, anthropic, balancedObject(), bearer(), classify() (+27 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.06
Nodes (33): @supabase/supabase-js, safeLocalDestination(), needsSessionRefresh(), clearProjectSessionCache(), completeOAuthCallback(), OAuthCallbackOutcome, authMessage(), BetaAccess() (+25 more)

### Community 13 - "event-store.ts"
Cohesion: 0.13
Nodes (12): ActorType, EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow (+4 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.10
Nodes (23): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+15 more)

### Community 15 - "docs/harness/codebase-cleanup-verification.md"
Cohesion: 0.05
Nodes (50): Bounded complete-file recovery, Immutable insertion and deletion save receipts, One durable workflow and caller-only submission, Active temporary OpenRouter BYOK, Explicit Jev provider and endpoint isolation, Browser shared server module boundary, October 4 cleanup completion, October4 structural semantic graph refresh (+42 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.12
Nodes (27): Budgeted advisory Jev evidence packets, Report-only source reachability and import audit, ref_node_url, typescript, cachedReview(), ImportReference, inputCost(), inspectSources() (+19 more)

### Community 17 - "ref_node_fs"
Cohesion: 0.07
Nodes (25): ref_node_fs, ref_node_os, ref_node_path, browser, output, profile, browser, outputDir (+17 more)

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (29): engines, node, name, packageManager, private, type, version, cross-env (+21 more)

### Community 19 - "generated-isolation.test.ts"
Cohesion: 0.17
Nodes (7): ref_node_events, ref_node_net, fs, path, server_isolation_esbuild_cjs, files, jobs

### Community 20 - "ai-presets.ts"
Cohesion: 0.08
Nodes (32): Deterministic inference-free routing, Model-routing evaluation protocol 2026-09-22.v3, Repeated trial qualification thresholds, EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks (+24 more)

### Community 21 - "instructions.md"
Cohesion: 0.08
Nodes (24): Planned feature change evidence packet, Protected submission, save and coordinator semantics, TypeSafe reranking workflow cited in pilot plan, React/Vite and Express facade entrypoints, Explicit affected-contributor agreement, Advisory audit provider and model authority, Runtime external/model validation, Active memory-only OpenRouter BYOK (+16 more)

### Community 22 - "workflow-overview.md"
Cohesion: 0.29
Nodes (6): Evidence and contracts, Implementation evidence, Outcome and scope, Verification and recovery, Workflow-only main integration — 2026-10-15, Workflow Overview change packet

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "check-product-naming.mjs"
Cohesion: 0.25
Nodes (7): classificationCounts, files, listed, policy, report, rows, unexplained

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.16
Nodes (16): Ambient declarations require reachability exceptions, Dated proposed codebase cleanup plan, Unmeasured optional-context reduction target, Planned deterministic reachability and boundary triage, Graph and grammar limitations in planning snapshot, Proposed model/hash/policy Jev answer cache, Proposed 20-prompt Jev evaluation, Proposed report-only Jev pilot (+8 more)

### Community 27 - "context.md"
Cohesion: 0.10
Nodes (17): Current browser/server coordinator facades, Current temporary OpenRouter BYOK, Durable caller-owned submission capture, Prepared coordinator migration and external verification gaps, Bounded one-file recovery checkpoints, Protected migration tool retained despite false obsolete judgment, Current Canvas Shared context rail, Source boundary audit and advisory Jev review (+9 more)

### Community 28 - "types.ts"
Cohesion: 0.07
Nodes (37): Named AI connections (preferred API), Shared response models, AISettings, BudgetWindow, collaborationBatchSize, ProjectRole, RunWindow, StoredConnection (+29 more)

### Community 29 - "rooms.ts"
Cohesion: 0.12
Nodes (22): Extracted workspace and steering helpers, [command,file], MANAGED_CATALOG_SOURCE, MANAGED_CATALOG_VERSION, MANAGED_DEFAULT_BUILDER, MANAGED_INTERPRETER_CANDIDATES, managedBuilder(), managedCatalog (+14 more)

### Community 30 - "product-environment.ts"
Cohesion: 0.17
Nodes (13): @cloudflare/containers, ref_cloudflare_workers, canonicalProductEnvironment(), legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig (+5 more)

### Community 31 - "verification.ts"
Cohesion: 0.23
Nodes (12): previewDocument(), assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript (+4 more)

### Community 32 - "linux-cgroup-isolation.test.ts"
Cohesion: 0.28
Nodes (7): linuxBrowserFileBytes, linuxBrowserFileDescriptors, jobs(), linux, noGroups(), removed(), wait()

### Community 33 - "ai-accounting.ts"
Cohesion: 0.22
Nodes (13): aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, AIEffort, AIRunCall (+5 more)

### Community 34 - "supabase-platform.ts"
Cohesion: 0.05
Nodes (60): ref_supabase_server_core, ArchivedVersion, artifactHash(), artifactPath(), ArtifactReference, artifactResponse(), ArtifactUnavailableError, ArtifactVersion (+52 more)

### Community 35 - "tool-registry.ts"
Cohesion: 0.14
Nodes (13): FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior, ToolContext (+5 more)

### Community 36 - "AGENTS.md"
Cohesion: 0.12
Nodes (14): Durable workflow is the primary shared object, Bounded feature change packet, Graphify scoped source navigation, AST-only graph refresh, Graphify wiki broad navigation, Targets versus verified implementation, Offline Jev rankings are advisory, One logical coordinator (+6 more)

### Community 37 - "yjs"
Cohesion: 0.06
Nodes (26): ref_y_protocols_awareness, yjs, binary(), connect(), createSession(), json(), origin, ramConnection (+18 more)

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.12
Nodes (19): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+11 more)

### Community 40 - "prelaunch-release-repair.md"
Cohesion: 0.10
Nodes (17): Conflict-group acceptance matrix, Additive ConflictGroup migration plan, Decisions needed and Disagreements UI target, Planned conflict alternatives and reopen mutations, Exact owner and approval process, Pre-launch and private beta change packet, Release prerequisites and rollback, Verification and handoff (+9 more)

### Community 41 - "RemoteCoordinator"
Cohesion: 0.18
Nodes (7): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, RemoteCoordinator

### Community 42 - "verify-intent-ui.ts"
Cohesion: 0.13
Nodes (13): Browser, browsers, dataDir, fake, inputs, open(), output, providerAddress (+5 more)

### Community 43 - "project.ts"
Cohesion: 0.17
Nodes (15): ref_node_path_posix, validateSource(), keepLastSuccess(), shouldPromoteRevision(), allowedExtensions, applyOperations(), bundleProject(), downloadableFiles() (+7 more)

### Community 44 - "verify-save-timeout.mjs"
Cohesion: 0.18
Nodes (8): browser, checks, dir, original, profile, room, submissions, view

### Community 45 - "generator.ts"
Cohesion: 0.11
Nodes (27): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, boundedInput(), callOpenAI(), classification, compactRequirement() (+19 more)

### Community 46 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 47 - "App.tsx"
Cohesion: 0.08
Nodes (29): Reference-led presentation update (2026-09-30), kinds, previewInitType(), PreviewKind, previewMessageKind(), BuildProgress, WorkflowStatus, FormatChoice (+21 more)

### Community 48 - "ref_node_assert_strict"
Cohesion: 0.11
Nodes (7): ref_node_assert_strict, ref_node_http, ref_node_test, Requirement, pause(), waitFor(), output()

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (30): BASIC_ACCOUNTING, BASIC_LIMIT, DllImport, EXTENDED_LIMIT, FileSystemRights, IntPtr, IO_COUNTERS, PROCESS_INFORMATION (+22 more)

### Community 50 - "Step 05 handoff — attributable intent and contextual references"
Cohesion: 0.33
Nodes (6): Checks and honest scope, Durability, uncertainty and compatibility, Files and decision, Outcome and reproduced boundary, Step 05 handoff — attributable intent and contextual references, Unrun release dependencies and next step

### Community 51 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.16
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 52 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, audit:code, build, check:boundaries, deploy:cloudflare, dev, migrate:legacy, start (+1 more)

### Community 53 - "verify-build-progress.ts"
Cohesion: 0.15
Nodes (15): address, Browser, browsers, candidates, converge(), dataDir, fake, gates (+7 more)

### Community 54 - "ProjectFile"
Cohesion: 0.50
Nodes (4): ProjectFile, crc32(), createZip(), table

### Community 55 - "main.tsx"
Cohesion: 0.09
Nodes (22): Approved scope, Founder contacts in the public footer, Icon presentation follow-up — 2026-10-16, Local verification, Verification plan, Vite HTML client mount, ref_react_dom_client, BrandMark() (+14 more)

### Community 57 - "artifact-restoration.test.ts"
Cohesion: 0.17
Nodes (10): dir, manager, observations, platform, project, buildFixture(), files, manager() (+2 more)

### Community 58 - "isolation.ts"
Cohesion: 0.23
Nodes (17): Linux verification follow-up — 2026-10-08, assertIsolationAvailable(), cancelled(), compileIsolated(), Dependency, hostEnvironment(), IsolatedRequest, IsolationError (+9 more)

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (40): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+32 more)

### Community 60 - "harness/checklist.md"
Cohesion: 0.09
Nodes (24): October 1 local reliability evidence, October 3 Graphify maintenance evidence, October 3 cleanup plan history, October 1 reliability verification history, October 1 Studio Ivory local checks history, Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work (+16 more)

### Community 61 - ".github/workflows/code-checks.yml"
Cohesion: 0.43
Nodes (6): Frozen pnpm lockfile installation, Commit-pinned GitHub Actions, Code checks on push and pull request, CI pnpm 10.18.3 and Node 24, Import-boundary, test and build gates, Offline GitHub code validation

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "product-naming.test.ts"
Cohesion: 0.09
Nodes (16): ref_node_sqlite, approved, browser, checks, chrome, directory, local, output (+8 more)

### Community 64 - "verify-canvas-surface.ts"
Cohesion: 0.20
Nodes (9): browser, checks, errors, output, room, runtime, sockets, until() (+1 more)

### Community 65 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 67 - "2guys1canvas API reference"
Cohesion: 0.17
Nodes (12): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+4 more)

### Community 68 - "verify-product-naming.mjs"
Cohesion: 0.11
Nodes (13): WebSocket collaboration, esbuild, ref_node_vm, connected(), baseline, browser, checks, dir (+5 more)

### Community 69 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "measure-responsiveness.ts"
Cohesion: 0.22
Nodes (9): September 26 localhost responsiveness benchmark, Lazy route split transferred-byte evidence, Unmeasured production and provider timing, ref_node_fs_promises, ref_node_perf_hooks, median(), run(), Sample (+1 more)

### Community 72 - "local-drafts.ts"
Cohesion: 0.18
Nodes (11): browserDraftStore, database(), draftKey(), DraftStore, LocalDraftStatus, mergeDatabase(), persistDraft(), readDatabase() (+3 more)

### Community 74 - "Harness architecture"
Cohesion: 0.10
Nodes (21): Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Bounded context and cost target, Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary (+13 more)

### Community 75 - "Custom-domain private beta release packet"
Cohesion: 0.22
Nodes (9): Acceptance evidence and handoff, Blocked deployment repair packet — 2026-10-08, Current execution status, Custom-domain private beta release packet, Latest verified handoff — 2026-10-08, Outcome and bounded scope, Prepared changes and compatibility, Verification, execution and recovery plan (+1 more)

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 80 - "beta-requests.ts"
Cohesion: 0.08
Nodes (35): Beta access request change packet — 2026-10-09, Evidence and release status, Initial external configuration observations, Operations and manual acceptance, Outcome and bounded scope, Stage contracts and acceptance, Verified deployment — 2026-10-09, Authorized main publication — 2026-10-16 (+27 more)

### Community 85 - "BuildAccounting.tsx"
Cohesion: 0.48
Nodes (6): NormalizedAIUsage, BuildAccounting(), comparableMetrics(), runKey(), tokenCount(), UsageSummary()

### Community 90 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 91 - "token"
Cohesion: 0.67
Nodes (3): Transport and authentication, request(), token()

### Community 92 - "2guys1canvas"
Cohesion: 0.13
Nodes (15): 2guys1canvas, Active hosted MVP: OpenRouter BYOK, AI steering documents, Architecture, Checks, Connect AI, Current boundaries, Current product setup (2026-09-30) (+7 more)

### Community 93 - "verify-coordinator-postgres.ts"
Cohesion: 0.13
Nodes (11): pg, a, admin, b, checks, ownerA, ownerB, project (+3 more)

### Community 94 - "Multi-user harness improvement prompts"
Cohesion: 0.15
Nodes (13): Common contract, Multi-user harness improvement prompts, Starting instruction, Step 01 - Audit, scenarios and baseline, Step 02 - Coordinator fencing and owner routing, Step 03 - Artifact persistence and restoration, Step 04 - Generated execution isolation, Step 05 - Intent inspection, correction and contextual references (+5 more)

### Community 95 - "WorkflowBoard.tsx"
Cohesion: 0.09
Nodes (37): Rooms and sessions, 2guys1canvas presentation and invitation boundary (2026-09-30), Responsive delivery and synchronization, Canvas writing surface, Evidence and contracts, Local evidence, Requested outcome and boundaries, Verification plan (+29 more)

### Community 96 - "intent-authority.ts"
Cohesion: 0.29
Nodes (8): clean(), demoExtract(), AgentChange, AcceptedIntentContext, generic, normalize(), sourceWords(), validateSubmittedInterpretation()

### Community 97 - "workflow-budget.test.ts"
Cohesion: 0.42
Nodes (8): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), usedBudget()

### Community 99 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 101 - "verify-workflow-overview.ts"
Cohesion: 0.15
Nodes (9): browser, checks, errors, midnight, output, room, runtime, sockets (+1 more)

### Community 102 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.40
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 104 - "linux-cgroup.ts"
Cohesion: 0.23
Nodes (5): linuxBrowserMemoryBytes, LinuxJobGroup, linuxJobLauncher, unavailable(), wait()

### Community 107 - "verify-reliability.ts"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, open(), output, providerAddress, room (+2 more)

### Community 109 - "Multi-user Step 07 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Checks and retained attempts, Deliberately bounded coverage, Files, decision and handoff, Isolation and operator setup, Multi-user Step 07 handoff - 2026-10-04, Outcome and boundary

### Community 114 - "linux-job-launcher.c"
Cohesion: 0.29
Nodes (5): errno, prctl, signal, stdio, unistd

### Community 116 - "IntentReview.tsx"
Cohesion: 0.18
Nodes (14): IntentCommand, IntentCommandResult, IntentTarget, InterpretationIntentCategory, Join(), enter(), legacyKey(), readBrowserStorage() (+6 more)

### Community 117 - "ByokSetup.tsx"
Cohesion: 0.22
Nodes (9): ByokSetup is the mounted setup surface, lucide-react, AIConnection, TemporaryModel, ByokSetup(), dollars(), Lease, ModelChoice() (+1 more)

### Community 120 - "product.md"
Cohesion: 0.11
Nodes (17): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02, Serialized eight-task and 24-call recovery, Disconnected-first OpenRouter BYOK setup, Attributed capture-order interpretation, Collaborative submission-to-artifact loop (+9 more)

### Community 121 - "Canonical product naming — 2026-10-17"
Cohesion: 0.22
Nodes (6): Bounded change packet, Canonical product naming — 2026-10-17, Compatibility plan and rollback, Residual ledger and cutover, Verification, TwoGuysOneCanvasContainer

### Community 122 - "save-throughput.test.ts"
Cohesion: 0.24
Nodes (6): DurableStore, edit(), packet(), pause(), setup(), until()

### Community 123 - "Multi-user Step 04 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites

### Community 127 - "byok-lease.ts"
Cohesion: 0.16
Nodes (11): BYOK_LEASE_MS, BYOK_MODEL_VERSION, BYOK_ROLE_LIMITS, Lease, LeaseModel, modelsFrom(), nonnegative(), OpenRouterLeases (+3 more)

### Community 132 - "harness/architecture.md"
Cohesion: 0.05
Nodes (38): Participant-scoped IndexedDB recovery, Single coordinator and lease fencing, Remaining hosted owner routing and archive limits, Verified-email invitations preserve roles and links, Offline developer audit boundary, Physical provider attempt and partial accounting, Hosted byte preservation and membership authority, 40 ms Yjs batching and explicit flush (+30 more)

### Community 133 - "ref_node_crypto"
Cohesion: 0.23
Nodes (10): ref_node_crypto, buildFiles, config, files, fingerprint, hash, betaAccounts, betaDatabase (+2 more)

## Knowledge Gaps
- **717 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+712 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1059 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `RoomManager` connect `RoomManager` to `workflow-budget.test.ts`, `supabase-platform.ts`, `EventStore`, `tool-registry.ts`, `reliability.test.ts`, `index.ts`, `project.ts`, `types.ts`, `ref_node_assert_strict`, `ref_node_fs`, `fixtures/multiuser-baseline.ts`, `ai-presets.ts`, `artifact-restoration.test.ts`, `save-throughput.test.ts`, `harness/checklist.md`, `rooms.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `yjs` connect `yjs` to `supabase-platform.ts`, `measure-responsiveness.ts`, `local-drafts.ts`, `reliability.test.ts`, `project.ts`, `App.tsx`, `ref_node_assert_strict`, `package.json`, `fixtures/multiuser-baseline.ts`, `artifact-restoration.test.ts`, `save-throughput.test.ts`, `types.ts`, `rooms.ts`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Are the 33 inferred relationships involving `createTwoGuysOneCanvasServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createTwoGuysOneCanvasServer()` has 33 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _717 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.07324929971988796 - nodes in this community are weakly interconnected._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.10507246376811594 - nodes in this community are weakly interconnected._