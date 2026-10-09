# Graph Report - Devoffice  (2026-10-09)

## Corpus Check
- 227 files · ~208,490 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 6, .css 5, .example 1)

## Summary
- 2181 nodes · 5176 edges · 120 communities (104 shown, 16 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 179 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ba96cfd3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- README.md
- types.ts
- EventStore
- prisma/schema.prisma
- api.md
- docs/harness/decisions.md
- isolation.ts
- requirements.ts
- ref_node_fs
- providers.ts
- rules
- ProjectApp.tsx
- event-store.ts
- verify-interpretation-topology.ts
- docs/harness/codebase-cleanup-verification.md
- codebase-audit.ts
- tool-registry.ts
- package.json
- harness/architecture.md
- ai-presets.ts
- instructions.md
- managed-catalog.ts
- dependencies
- cloudflare-container.test.ts
- compilerOptions
- graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md
- context.md
- index.ts
- artifacts.ts
- supabase.ts
- supabase-platform.ts
- live-collaboration-check.mjs
- OpenRouterLeases
- project.ts
- SupabasePlatform
- AGENTS.md
- CoCreateProvider
- verify-harness-integration.ts
- AgentPanel.tsx
- Linux browser isolation: bounded alternative and platform questions
- CoordinatorUnavailableError
- rooms.ts
- verify-reliability.ts
- .insert
- generator.ts
- container.js
- fixtures/multiuser-baseline.ts
- beta-requests.ts
- IsolationRunner
- multiuser-step05-handoff.md
- Custom-domain private beta release packet
- scripts
- verify-build-progress.ts
- App.tsx
- main.tsx
- workflow-budget.test.ts
- live-browser-collaboration-check.mjs
- verify-candidate-evidence.ts
- 2guys1canvas harness implementation checklist
- harness/checklist.md
- .github/workflows/code-checks.yml
- .oxfmtrc.json
- beta-access.test.ts
- browser.ts
- devDependencies
- multiuser-step09-handoff.md
- 2guys1canvas API reference
- migrate-legacy-to-supabase.ts
- Step 06 handoff — stable progress under ongoing steering
- 24-pixel SVG favicon
- ref_esbuild_cjs
- ref_node_assert
- reliability.test.ts
- Harness architecture
- verification.ts
- LinuxJobGroup
- 2guys1canvas context handoff
- 2guys1canvas product brief
- ai-presets.test.ts
- generated-isolation.test.ts
- .mcp.json
- safeLocalDestination
- VerificationSummary.tsx
- 2guys1canvas AI coding instructions
- ref_node_crypto
- 2guys1canvas
- verify-coordinator-postgres.ts
- Multi-user harness improvement prompts
- IntentReview.tsx
- linux-cgroup-isolation.test.ts
- react
- Step 10 - Cross-system integration and final harness review
- Multi-user Step 03 handoff - 2026-10-03
- Multi-user Step 02 handoff - 2026-10-03
- .createInvite
- Multi-user Step 01 evidence and handoff
- contradiction-resolution-plan.md
- release-fingerprint.mjs
- ByokSetup.tsx
- oauth-callback.ts
- cocreate.test.ts
- model-evaluation.md
- Multi-user Step 07 handoff - 2026-10-04
- Pre-launch and private beta change packet
- Pre-launch release repair — 2026-10-08
- linux-job-launcher.c
- preview-smoke.mjs
- product.md
- start-container.sh
- prepare-ci-cgroup.sh
- run-linux-check.sh

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 111 edges
2. `Room` - 74 edges
3. `createCoCreateServer()` - 63 edges
4. `SupabasePlatform` - 60 edges
5. `EventStore` - 54 edges
6. `2guys1canvas harness implementation checklist` - 40 edges
7. `registerProjectRoutes()` - 34 edges
8. `IsolationRunner` - 33 edges
9. `reconcileRequirements()` - 28 edges
10. `ArtifactUnavailableError` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Outcome and boundaries` --references--> `RemoteCoordinator`  [INFERRED]
  docs/harness/multiuser-step02-handoff.md → server/coordinator.ts
- `Actual runtime, verification and retained failures` --references--> `RoomManager`  [INFERRED]
  docs/harness/multiuser-step09-handoff.md → server/rooms.ts
- `Bounded context and cost target` --references--> `AIRunRecord`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → shared/types.ts
- `Reference-led presentation update (2026-09-30)` --references--> `Workspace()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → src/App.tsx
- `Outcome and responsible boundary` --references--> `bundleProject()`  [INFERRED]
  docs/harness/multiuser-step04-handoff.md → server/project.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Participant-scoped durable submission safety** — api_canonical_saved_receipts, api_flush_ordering, api_retired_legacy_build, api_durable_submit, api_capture_order [EXTRACTED 1.00]
- **Verified cleanup preserves workflow authority** — docs_harness_codebase_cleanup_verification_scaffold_removal, docs_harness_codebase_cleanup_verification_shared_extraction, docs_harness_architecture_durable_workflow, docs_harness_codebase_cleanup_verification_local_cleanup_checks [EXTRACTED 1.00]
- **October durable reliability contract** — docs_harness_reliability_verification_ordered_recovery, docs_harness_reliability_verification_ordered_submission_recovery, docs_harness_architecture_canonical_save_receipts, docs_harness_architecture_coordinator_fencing [EXTRACTED 1.00]
- **Feature edit authority and import boundaries** — instructions_feature_packet, instructions_shared_boundary, instructions_source_ownership, instructions_jev_advisory [EXTRACTED 1.00]
- **Collaborative submission-to-promoted-artifact flow** — product_core_loop, product_capture_order, product_durable_receipts, product_bounded_recovery [EXTRACTED 1.00]

## Communities (120 total, 16 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.07
Nodes (35): Submission scheduling: current implementation and required hardening, Later-step source audit, ref_node_stream, calculateCharge(), catalogRate(), effortAllowance(), buildProgressFor(), AIConfig (+27 more)

### Community 1 - "README.md"
Cohesion: 0.11
Nodes (18): Historical documentation archive, Explicit pnpm native build allowlist, Current source facade and shared contracts, Shared bounded recovery and retained artifact, Current owner-controlled BYOK setup dialog, Cloudflare Worker/container deployment boundary, Controlled three-profile reliability check, Separate pinned direct TypeSafe audit adapter (+10 more)

### Community 2 - "types.ts"
Cohesion: 0.06
Nodes (37): Named AI connections (preferred API), Shared response models, ArchivedVersion, ProjectSpec, AISettings, BudgetWindow, DurableStore, ProjectRole (+29 more)

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 5 - "api.md"
Cohesion: 0.05
Nodes (44): RoomView.requirementRevisions accepted snapshots, PKCE callback and account-choice flow, Immutable canonical WebSocket saved receipts, Capture-order interpretation and explicit recovery, Authoritative multi-option ConflictGroup, Revision-safe affected-contributor conflict selections, Workflow coordinator fencing RPC contracts, Persisted Developer task evidence (+36 more)

### Community 6 - "docs/harness/decisions.md"
Cohesion: 0.05
Nodes (43): D-0001 â€” Preserve the existing application while migrating additively, D-0002 â€” Personal interpretations are proposals, not builder authority, D-0003 â€” Build from the accepted registry, not the raw canvas, D-0004 â€” Deletion is not withdrawal, D-0005 â€” Pause on consequential accepted contradictions, D-0006 â€” Conflict groups and explicit affected-contributor agreement, D-0007 â€” Classify per intent and reprocess only by explicit participant action, D-0008 â€” Submit intent explicitly; collaborate continuously (+35 more)

### Community 7 - "isolation.ts"
Cohesion: 0.24
Nodes (16): Linux verification follow-up — 2026-10-08, assertIsolationAvailable(), cancelled(), compileIsolated(), Dependency, hostEnvironment(), IsolatedRequest, linuxCommand() (+8 more)

### Community 8 - "requirements.ts"
Cohesion: 0.13
Nodes (31): acceptanceFor(), acceptedClassification(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries(), categories, classifications (+23 more)

### Community 9 - "ref_node_fs"
Cohesion: 0.06
Nodes (29): ref_node_assert_strict, ref_node_fs, ref_node_os, ref_node_path, ref_node_test, ws, browser, output (+21 more)

### Community 10 - "providers.ts"
Cohesion: 0.07
Nodes (35): ref_node_async_hooks, accounting, adapterFor(), adapters, anthropic, balancedObject(), bearer(), classify() (+27 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.09
Nodes (15): needsSessionRefresh(), BetaAccess(), clearProjectSessionCache(), InviteResult, PendingInvite, Project, ProjectList, ProjectMember (+7 more)

### Community 13 - "event-store.ts"
Cohesion: 0.13
Nodes (12): ActorType, EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow (+4 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.09
Nodes (26): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+18 more)

### Community 15 - "docs/harness/codebase-cleanup-verification.md"
Cohesion: 0.11
Nodes (24): Browser shared server module boundary, October 4 cleanup completion, October4 structural semantic graph refresh, AdvancedAISetup call-site correction, Bounded refactor and verification gates, Required-contract recall and context-reduction target, Dated Jev pilot pricing and cost assumptions, Advisory offline Jev pilot (+16 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.08
Nodes (36): September 26 localhost responsiveness benchmark, Lazy route split transferred-byte evidence, Unmeasured production and provider timing, Budgeted advisory Jev evidence packets, Report-only source reachability and import audit, ref_node_fs_promises, ref_node_perf_hooks, ref_node_url (+28 more)

### Community 17 - "tool-registry.ts"
Cohesion: 0.12
Nodes (18): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites, bundleProject(), definitions (+10 more)

### Community 18 - "package.json"
Cohesion: 0.06
Nodes (30): engines, node, name, packageManager, private, type, version, cross-env (+22 more)

### Community 19 - "harness/architecture.md"
Cohesion: 0.15
Nodes (15): Bounded complete-file recovery, Participant-scoped IndexedDB recovery, Immutable insertion and deletion save receipts, Single coordinator and lease fencing, One durable workflow and caller-only submission, Active temporary OpenRouter BYOK, Remaining hosted owner routing and archive limits, Verified-email invitations preserve roles and links (+7 more)

### Community 20 - "ai-presets.ts"
Cohesion: 0.09
Nodes (34): D-0014 â€” Versioned estimates, not inferred billing, aggregateCalls(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, CatalogEntry, classifyTaskComplexity() (+26 more)

### Community 21 - "instructions.md"
Cohesion: 0.08
Nodes (24): Planned feature change evidence packet, Protected submission, save and coordinator semantics, TypeSafe reranking workflow cited in pilot plan, React/Vite and Express facade entrypoints, Explicit affected-contributor agreement, Advisory audit provider and model authority, Runtime external/model validation, Active memory-only OpenRouter BYOK (+16 more)

### Community 22 - "managed-catalog.ts"
Cohesion: 0.19
Nodes (10): [command,file], MANAGED_CATALOG_SOURCE, MANAGED_CATALOG_VERSION, MANAGED_DEFAULT_BUILDER, MANAGED_INTERPRETER_CANDIDATES, ManagedCatalogEntry, MANAGED_QUALIFICATION_VERSION, managedFixtures (+2 more)

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "cloudflare-container.test.ts"
Cohesion: 0.11
Nodes (11): WebSocket collaboration, ref_node_vm, browser, outputDir, profile, browser, outputDir, profile (+3 more)

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.16
Nodes (16): Ambient declarations require reachability exceptions, Dated proposed codebase cleanup plan, Unmeasured optional-context reduction target, Planned deterministic reachability and boundary triage, Graph and grammar limitations in planning snapshot, Proposed model/hash/policy Jev answer cache, Proposed 20-prompt Jev evaluation, Proposed report-only Jev pilot (+8 more)

### Community 27 - "context.md"
Cohesion: 0.10
Nodes (18): Current browser/server coordinator facades, Current temporary OpenRouter BYOK, Durable caller-owned submission capture, Prepared coordinator migration and external verification gaps, Bounded one-file recovery checkpoints, Protected migration tool retained despite false obsolete judgment, October 1 local reliability evidence, Current Canvas Shared context rail (+10 more)

### Community 28 - "index.ts"
Cohesion: 0.13
Nodes (20): express, artifactResponse(), b64(), participantId(), roomToken(), Session, coordinatorRetry, coordinatorResponse() (+12 more)

### Community 29 - "artifacts.ts"
Cohesion: 0.18
Nodes (21): ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, ArtifactUnavailableError, ArtifactVersion, bodyFromBytes(), canonicalJson() (+13 more)

### Community 30 - "supabase.ts"
Cohesion: 0.18
Nodes (12): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution, authReturnKey, resolved (+4 more)

### Community 31 - "supabase-platform.ts"
Cohesion: 0.14
Nodes (17): ref_supabase_server_core, RecoveryCheckpoint, AuthenticatedUser, normalizeInviteEmail(), PlatformConfig, ProjectInviteSummary, ProjectMemberSummary, ProjectRole (+9 more)

### Community 32 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 33 - "OpenRouterLeases"
Cohesion: 0.22
Nodes (6): BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases

### Community 34 - "project.ts"
Cohesion: 0.12
Nodes (26): ref_node_path_posix, addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, generateProjectPlan(), mergeUsage(), allowedExtensions (+18 more)

### Community 35 - "SupabasePlatform"
Cohesion: 0.14
Nodes (4): fail(), normalizeProjectTitle(), SupabasePlatform, hostedFixture()

### Community 36 - "AGENTS.md"
Cohesion: 0.18
Nodes (10): Durable workflow is the primary shared object, Bounded feature change packet, Graphify scoped source navigation, AST-only graph refresh, Graphify wiki broad navigation, Targets versus verified implementation, Offline Jev rankings are advisory, One logical coordinator (+2 more)

### Community 37 - "CoCreateProvider"
Cohesion: 0.12
Nodes (9): ref_y_protocols_awareness, states(), deletionSignature(), CoCreateProvider, ConnectionStatus, ProviderDependencies, providerInternals, retryDelay() (+1 more)

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.12
Nodes (19): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+11 more)

### Community 39 - "AgentPanel.tsx"
Cohesion: 0.14
Nodes (20): AIResolvedLayer, NormalizedAIUsage, Participant, dollars(), rateSummary(), effortChoices, api(), tokenRole() (+12 more)

### Community 40 - "Linux browser isolation: bounded alternative and platform questions"
Cohesion: 0.40
Nodes (5): Conditional same-host alternative, Evidence and smallest next action, If delegation is unavailable, Linux browser isolation: bounded alternative and platform questions, Release and recovery

### Community 42 - "rooms.ts"
Cohesion: 0.11
Nodes (23): Extracted workspace and steering helpers, applyIntentCommand(), categories, fail(), intentCommandHash(), parseIntentCommand(), managedBuilder(), managedCatalog (+15 more)

### Community 43 - "verify-reliability.ts"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, open(), output, providerAddress, room (+2 more)

### Community 44 - ".insert"
Cohesion: 0.20
Nodes (3): WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 45 - "generator.ts"
Cohesion: 0.09
Nodes (27): clean(), demoExtract(), AgentChange, boundedInput(), callOpenAI(), classification, compactRequirement(), compactSharedRequirement() (+19 more)

### Community 46 - "container.js"
Cohesion: 0.21
Nodes (7): @cloudflare/containers, ref_cloudflare_workers, baseEnv, CoCreateContainer, fetch(), scheduled(), legacyOriginResponse()

### Community 47 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.16
Nodes (14): output, report, trials, ToolRegistry, Attempt, interpretation(), Observation, pause() (+6 more)

### Community 48 - "beta-requests.ts"
Cohesion: 0.10
Nodes (28): Beta access request change packet — 2026-10-09, Evidence and release status, Initial external configuration observations, Operations and manual acceptance, Outcome and bounded scope, Stage contracts and acceptance, BetaDelivery, betaEmailPayload() (+20 more)

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (30): BASIC_ACCOUNTING, BASIC_LIMIT, DllImport, EXTENDED_LIMIT, FileSystemRights, IntPtr, IO_COUNTERS, PROCESS_INFORMATION (+22 more)

### Community 50 - "multiuser-step05-handoff.md"
Cohesion: 0.29
Nodes (6): Checks and honest scope, Durability, uncertainty and compatibility, Files and decision, Outcome and reproduced boundary, Step 05 handoff — attributable intent and contextual references, Unrun release dependencies and next step

### Community 51 - "Custom-domain private beta release packet"
Cohesion: 0.22
Nodes (9): Acceptance evidence and handoff, Blocked deployment repair packet — 2026-10-08, Current execution status, Custom-domain private beta release packet, Latest verified handoff — 2026-10-08, Outcome and bounded scope, Prepared changes and compatibility, Verification, execution and recovery plan (+1 more)

### Community 52 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, audit:code, build, check:boundaries, deploy:cloudflare, dev, migrate:legacy, start (+1 more)

### Community 53 - "verify-build-progress.ts"
Cohesion: 0.15
Nodes (15): address, Browser, browsers, candidates, converge(), dataDir, fake, gates (+7 more)

### Community 54 - "App.tsx"
Cohesion: 0.09
Nodes (23): WorkflowStatus, FormatChoice, ProviderChoice, providerPresets, statusCopy, tokenParticipant(), Workspace(), ariaShortcut() (+15 more)

### Community 55 - "main.tsx"
Cohesion: 0.14
Nodes (11): Vite HTML client mount, lucide-react, ref_react_dom_client, src_landing, questions, App, LandingPage, ProjectApp (+3 more)

### Community 56 - "workflow-budget.test.ts"
Cohesion: 0.19
Nodes (15): projection(), ProviderAccountingError, aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes, openBudget(), recoverWorkflowBudget() (+7 more)

### Community 57 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 58 - "verify-candidate-evidence.ts"
Cohesion: 0.14
Nodes (16): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+8 more)

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (40): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+32 more)

### Community 60 - "harness/checklist.md"
Cohesion: 0.11
Nodes (19): October 3 Graphify maintenance evidence, October 3 cleanup plan history, October 1 reliability verification history, October 1 Studio Ivory local checks history, Fresh verification, Operational boundaries, Resolution and preserved contracts, Steps 6–10 integration into main (+11 more)

### Community 61 - ".github/workflows/code-checks.yml"
Cohesion: 0.43
Nodes (6): Frozen pnpm lockfile installation, Commit-pinned GitHub Actions, Code checks on push and pull request, CI pnpm 10.18.3 and Node 24, Import-boundary, test and build gates, Offline GitHub code validation

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "beta-access.test.ts"
Cohesion: 0.13
Nodes (15): ref_node_sqlite, approved, browser, checks, chrome, directory, local, output (+7 more)

### Community 64 - "browser.ts"
Cohesion: 0.18
Nodes (15): ref_node_child_process, ref_node_module, ref_node_string_decoder, executable, sandbox, assertVerificationBrowserAvailable(), browserExecutable(), BrowserProtocol (+7 more)

### Community 65 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 66 - "multiuser-step09-handoff.md"
Cohesion: 0.17
Nodes (10): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures, Actual runtime, verification and retained failures, Controlled comparison, Files, rollout and next work (+2 more)

### Community 67 - "2guys1canvas API reference"
Cohesion: 0.17
Nodes (12): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+4 more)

### Community 68 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.13
Nodes (17): Explicit Jev provider and endpoint isolation, Vercel adapter and Jev smoke completion, Implemented Vercel Jev follow-up, Jev adapter verification and incomplete comparison, 20-file Vercel historical Jev smoke evidence, Protected migration Jev false positive retained, D-0044 Vercel credentials route through AI Gateway, ref_dotenv_config (+9 more)

### Community 69 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 73 - "reliability.test.ts"
Cohesion: 0.17
Nodes (6): ref_node_http, yjs, applySteeringUpdate(), plainText(), verifiedList, edit()

### Community 74 - "Harness architecture"
Cohesion: 0.08
Nodes (27): Rooms and sessions, 2guys1canvas presentation and invitation boundary (2026-09-30), Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Bounded context and cost target, Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary (+19 more)

### Community 75 - "verification.ts"
Cohesion: 0.23
Nodes (12): previewDocument(), assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript (+4 more)

### Community 76 - "LinuxJobGroup"
Cohesion: 0.27
Nodes (3): LinuxJobGroup, unavailable(), wait()

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 79 - "ai-presets.test.ts"
Cohesion: 0.33
Nodes (7): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), passed

### Community 80 - "generated-isolation.test.ts"
Cohesion: 0.17
Nodes (7): ref_node_events, ref_node_net, fs, path, server_isolation_esbuild_cjs, files, jobs

### Community 82 - "safeLocalDestination"
Cohesion: 0.36
Nodes (8): safeLocalDestination(), authMessage(), ForgotPassword(), intendedDestination(), Login(), ProjectApp(), Signup(), supabaseAuthCallbackUrl()

### Community 85 - "VerificationSummary.tsx"
Cohesion: 0.33
Nodes (4): BuildProgress, src_build_progress, BuildProgress(), VerificationSummary()

### Community 90 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 91 - "ref_node_crypto"
Cohesion: 0.27
Nodes (6): ref_node_crypto, buildFixture(), files, manager(), version(), createArtifactFixture()

### Community 92 - "2guys1canvas"
Cohesion: 0.13
Nodes (15): 2guys1canvas, Active hosted MVP: OpenRouter BYOK, AI steering documents, Architecture, Checks, Connect AI, Current boundaries, Current product setup (2026-09-30) (+7 more)

### Community 93 - "verify-coordinator-postgres.ts"
Cohesion: 0.13
Nodes (11): pg, a, admin, b, checks, ownerA, ownerB, project (+3 more)

### Community 94 - "Multi-user harness improvement prompts"
Cohesion: 0.15
Nodes (13): Common contract, Multi-user harness improvement prompts, Starting instruction, Step 01 - Audit, scenarios and baseline, Step 02 - Coordinator fencing and owner routing, Step 03 - Artifact persistence and restoration, Step 04 - Generated execution isolation, Step 05 - Intent inspection, correction and contextual references (+5 more)

### Community 95 - "IntentReview.tsx"
Cohesion: 0.20
Nodes (7): IntentCommandResult, IntentTarget, InterpretationIntentCategory, src_intent_review, caption(), Edit, IntentReview()

### Community 96 - "linux-cgroup-isolation.test.ts"
Cohesion: 0.24
Nodes (8): linuxBrowserFileBytes, linuxBrowserFileDescriptors, output(), jobs(), linux, noGroups(), removed(), wait()

### Community 97 - "react"
Cohesion: 0.33
Nodes (6): react, @supabase/supabase-js, AuthenticatedRequest, BetaReview(), date(), ReviewList

### Community 98 - "Step 10 - Cross-system integration and final harness review"
Cohesion: 0.33
Nodes (6): Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review

### Community 99 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 100 - "Multi-user Step 02 handoff - 2026-10-03"
Cohesion: 0.33
Nodes (6): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries

### Community 101 - ".createInvite"
Cohesion: 0.39
Nodes (5): decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), hashToken()

### Community 102 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.40
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 103 - "contradiction-resolution-plan.md"
Cohesion: 0.40
Nodes (4): Conflict-group acceptance matrix, Additive ConflictGroup migration plan, Decisions needed and Disagreements UI target, Planned conflict alternatives and reopen mutations

### Community 104 - "release-fingerprint.mjs"
Cohesion: 0.33
Nodes (5): buildFiles, config, files, fingerprint, hash

### Community 105 - "ByokSetup.tsx"
Cohesion: 0.33
Nodes (5): ByokSetup is the mounted setup surface, AIConnection, ByokSetup(), Lease, request()

### Community 106 - "oauth-callback.ts"
Cohesion: 0.50
Nodes (3): completeOAuthCallback(), OAuthCallbackOutcome, Callback()

### Community 107 - "cocreate.test.ts"
Cohesion: 0.47
Nodes (4): verifySession(), validateSource(), keepLastSuccess(), shouldPromoteRevision()

### Community 108 - "model-evaluation.md"
Cohesion: 0.67
Nodes (3): Deterministic inference-free routing, Model-routing evaluation protocol 2026-09-22.v3, Repeated trial qualification thresholds

### Community 109 - "Multi-user Step 07 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Checks and retained attempts, Deliberately bounded coverage, Files, decision and handoff, Isolation and operator setup, Multi-user Step 07 handoff - 2026-10-04, Outcome and boundary

### Community 110 - "Pre-launch and private beta change packet"
Cohesion: 0.50
Nodes (4): Exact owner and approval process, Pre-launch and private beta change packet, Release prerequisites and rollback, Verification and handoff

### Community 113 - "Pre-launch release repair — 2026-10-08"
Cohesion: 0.50
Nodes (4): Bounded change packet, Final smoke verification and publication — 2026-10-08, Fresh evidence, Pre-launch release repair — 2026-10-08

### Community 114 - "linux-job-launcher.c"
Cohesion: 0.29
Nodes (5): errno, prctl, signal, stdio, unistd

### Community 115 - "preview-smoke.mjs"
Cohesion: 0.50
Nodes (3): browser, profile, roomId

### Community 120 - "product.md"
Cohesion: 0.11
Nodes (17): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02, Serialized eight-task and 24-call recovery, Disconnected-first OpenRouter BYOK setup, Attributed capture-order interpretation, Collaborative submission-to-artifact loop (+9 more)

## Knowledge Gaps
- **634 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+629 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 961 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `RoomManager` connect `RoomManager` to `multiuser-step09-handoff.md`, `EventStore`, `types.ts`, `requirements.ts`, `ref_node_fs`, `rooms.ts`, `reliability.test.ts`, `verify-interpretation-topology.ts`, `fixtures/multiuser-baseline.ts`, `ai-presets.test.ts`, `workflow-budget.test.ts`, `ref_node_crypto`, `index.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `2guys1canvas harness implementation checklist` connect `2guys1canvas harness implementation checklist` to `harness/checklist.md`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `yjs` connect `reliability.test.ts` to `live-collaboration-check.mjs`, `types.ts`, `CoCreateProvider`, `ref_node_fs`, `rooms.ts`, `cocreate.test.ts`, `verify-interpretation-topology.ts`, `fixtures/multiuser-baseline.ts`, `codebase-audit.ts`, `package.json`, `harness/architecture.md`, `App.tsx`, `ref_node_crypto`, `supabase-platform.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Are the 33 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 33 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _634 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.07475010864841374 - nodes in this community are weakly interconnected._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.10507246376811594 - nodes in this community are weakly interconnected._