# Graph Report - Devoffice  (2026-10-10)

## Corpus Check
- 235 files · ~218,793 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 6, .css 6, .example 1)

## Summary
- 2233 nodes · 5422 edges · 126 communities (90 shown, 36 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 162 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6c440295`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- README.md
- rooms.ts
- EventStore
- prisma/schema.prisma
- isolation.ts
- requirements.ts
- verify-conflict-ui.ts
- providers.ts
- rules
- ProjectApp.tsx
- event-store.ts
- verify-interpretation-topology.ts
- codebase-audit.ts
- tool-registry.ts
- package.json
- ai-presets.ts
- managed-ai.test.ts
- dependencies
- ref_node_path
- compilerOptions
- graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md
- registerProjectRoutes
- artifacts.ts
- supabase.ts
- supabase-platform.ts
- live-collaboration-check.mjs
- OpenRouterLeases
- project.ts
- SupabasePlatform
- build-shortcut.ts
- provider.ts
- verify-harness-integration.ts
- AgentPanel.tsx
- Linux browser isolation: bounded alternative and platform questions
- reliability.test.ts
- intent-commands.ts
- 2guys1canvas API reference
- measure-responsiveness.ts
- generator.ts
- container.js
- fixtures/multiuser-baseline.ts
- beta-requests.ts
- IsolationRunner
- Step 05 handoff — attributable intent and contextual references
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
- .oxfmtrc.json
- index.ts
- verify-coordinator-postgres.ts
- devDependencies
- multiuser-step09-handoff.md
- verify-intent-ui.ts
- migrate-legacy-to-supabase.ts
- Step 06 handoff — stable progress under ongoing steering
- 24-pixel SVG favicon
- react
- ref_node_fs
- .loadSnapshot
- Harness architecture
- verification.ts
- ai-accounting.ts
- 2guys1canvas context handoff
- 2guys1canvas product brief
- ai-presets.test.ts
- .ensureWorkflow
- .mcp.json
- safeLocalDestination
- BuildAccounting.tsx
- 2guys1canvas AI coding instructions
- artifact-restoration.test.ts
- 2guys1canvas
- CoCreateProvider
- Multi-user harness improvement prompts
- Multi-user Step 04 handoff - 2026-10-04
- ProjectFile
- BetaReview.tsx
- Multi-user Step 03 handoff - 2026-10-03
- Pre-launch release repair — 2026-10-08
- dotenv
- Multi-user Step 01 evidence and handoff
- contradiction-resolution-plan.md
- types.ts
- token
- Multi-user Step 07 handoff - 2026-10-04
- Steps 6–10 integration into main
- product.md
- start-container.sh
- prepare-ci-cgroup.sh
- run-linux-check.sh

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 115 edges
2. `Room` - 77 edges
3. `createCoCreateServer()` - 67 edges
4. `SupabasePlatform` - 60 edges
5. `EventStore` - 54 edges
6. `2guys1canvas harness implementation checklist` - 40 edges
7. `registerProjectRoutes()` - 34 edges
8. `IsolationRunner` - 33 edges
9. `ArtifactUnavailableError` - 30 edges
10. `reconcileRequirements()` - 28 edges

## Surprising Connections (you probably didn't know these)
- `Outcome and responsible boundary` --references--> `bundleProject()`  [INFERRED]
  docs/harness/multiuser-step04-handoff.md → server/project.ts
- `Actual runtime, verification and retained failures` --references--> `RoomManager`  [INFERRED]
  docs/harness/multiuser-step09-handoff.md → server/rooms.ts
- `Rooms and sessions` --references--> `RoomView`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/api.md → shared/types.ts
- `Reference-led presentation update (2026-09-30)` --references--> `Workspace()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → src/App.tsx
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

## Communities (126 total, 36 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.07
Nodes (36): Submission scheduling: current implementation and required hardening, Later-step source audit, calculateCharge(), catalogRate(), effortAllowance(), buildProgressFor(), AIConfig, listProviderModels() (+28 more)

### Community 2 - "rooms.ts"
Cohesion: 0.08
Nodes (32): ArchivedVersion, DOCUMENT_MIME, generateDocument(), requiredHeadings(), ProjectSpec, AISettings, BudgetWindow, DurableStore (+24 more)

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 7 - "isolation.ts"
Cohesion: 0.08
Nodes (38): Linux verification follow-up — 2026-10-08, executable, sandbox, assertIsolationAvailable(), assertVerificationBrowserAvailable(), browserExecutable(), BrowserProtocol, linuxBrowserFileBytes (+30 more)

### Community 8 - "requirements.ts"
Cohesion: 0.10
Nodes (35): applyIntentCommand(), acceptanceFor(), acceptedClassification(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries(), categories (+27 more)

### Community 9 - "verify-conflict-ui.ts"
Cohesion: 0.25
Nodes (7): browser, dataDir, group, profile, room, token, ConflictGroup

### Community 10 - "providers.ts"
Cohesion: 0.07
Nodes (34): accounting, adapterFor(), adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+26 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.15
Nodes (19): needsSessionRefresh(), CreateProjectDialog(), InviteResult, Modal(), PendingInvite, Project, ProjectGroup(), ProjectList (+11 more)

### Community 13 - "event-store.ts"
Cohesion: 0.13
Nodes (12): ActorType, EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow (+4 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.10
Nodes (24): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+16 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.12
Nodes (23): typescript, cachedReview(), ImportReference, inputCost(), inspectSources(), add(), reachable(), resolve() (+15 more)

### Community 17 - "tool-registry.ts"
Cohesion: 0.14
Nodes (13): FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior, ToolContext (+5 more)

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (26): engines, node, name, packageManager, private, type, version, cross-env (+18 more)

### Community 20 - "ai-presets.ts"
Cohesion: 0.12
Nodes (19): CatalogEntry, classifyTaskComplexity(), cost(), estimateLayerMaximum(), layer(), longContext, migrateLegacySpecialty(), modelCatalog (+11 more)

### Community 22 - "managed-ai.test.ts"
Cohesion: 0.18
Nodes (13): [command,file], MANAGED_CATALOG_SOURCE, MANAGED_CATALOG_VERSION, MANAGED_DEFAULT_BUILDER, MANAGED_INTERPRETER_CANDIDATES, managedBuilder(), managedCatalog, ManagedCatalogEntry (+5 more)

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "ref_node_path"
Cohesion: 0.06
Nodes (23): browser, output, profile, browser, outputDir, profile, browser, outputDir (+15 more)

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.14
Nodes (5): TypeSafe state/questions API cited in pilot plan, TypeSafe coding-agent guidance cited in cleanup plan, TypeSafe confidence guidance cited in pilot plan, TypeSafe pricing cited in October 3 estimates, TypeSafe reranking workflow cited in pilot plan

### Community 28 - "registerProjectRoutes"
Cohesion: 0.24
Nodes (12): artifactResponse(), coordinatorRetry, coordinatorResponse(), InvitationEmailSender, appOrigin(), bearer(), displayName(), message() (+4 more)

### Community 29 - "artifacts.ts"
Cohesion: 0.13
Nodes (28): ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, ArtifactUnavailableError, ArtifactVersion, bodyFromBytes(), canonicalJson() (+20 more)

### Community 30 - "supabase.ts"
Cohesion: 0.18
Nodes (12): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution, authReturnKey, resolved (+4 more)

### Community 31 - "supabase-platform.ts"
Cohesion: 0.16
Nodes (15): betaDenied(), decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), AuthenticatedUser, hashToken(), normalizeInviteEmail() (+7 more)

### Community 32 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 33 - "OpenRouterLeases"
Cohesion: 0.22
Nodes (6): BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases

### Community 34 - "project.ts"
Cohesion: 0.09
Nodes (19): fs, path, keepLastSuccess(), shouldPromoteRevision(), previewDocument(), allowedExtensions, applyOperations(), bundleProject() (+11 more)

### Community 35 - "SupabasePlatform"
Cohesion: 0.15
Nodes (4): fail(), normalizeProjectTitle(), SupabasePlatform, hostedFixture()

### Community 36 - "build-shortcut.ts"
Cohesion: 0.29
Nodes (8): ariaShortcut(), BUILD_SHORTCUT_STORAGE_KEY, BuildShortcutPreference, defaultBuildShortcut(), isBuildShortcut(), readBuildShortcut(), ShortcutEvent, shortcutLabel()

### Community 37 - "provider.ts"
Cohesion: 0.17
Nodes (7): y-protocols, deletionSignature(), ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), FakeWebSocket

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.11
Nodes (19): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+11 more)

### Community 39 - "AgentPanel.tsx"
Cohesion: 0.16
Nodes (15): AIResolvedLayer, Participant, dollars(), rateSummary(), effortChoices, api(), tokenRole(), enter() (+7 more)

### Community 40 - "Linux browser isolation: bounded alternative and platform questions"
Cohesion: 0.40
Nodes (5): Conditional same-host alternative, Evidence and smallest next action, If delegation is unavailable, Linux browser isolation: bounded alternative and platform questions, Release and recovery

### Community 41 - "reliability.test.ts"
Cohesion: 0.11
Nodes (11): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, CoordinatorUnavailableError, RemoteCoordinator (+3 more)

### Community 42 - "intent-commands.ts"
Cohesion: 0.19
Nodes (13): submittedOutput(), AcceptedIntentContext, generic, normalize(), sourceWords(), validateSubmittedInterpretation(), categories, fail() (+5 more)

### Community 43 - "2guys1canvas API reference"
Cohesion: 0.13
Nodes (15): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+7 more)

### Community 44 - "measure-responsiveness.ts"
Cohesion: 0.24
Nodes (4): median(), run(), Sample, wait()

### Community 45 - "generator.ts"
Cohesion: 0.09
Nodes (31): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, clean(), demoExtract(), AgentChange, boundedInput() (+23 more)

### Community 46 - "container.js"
Cohesion: 0.21
Nodes (6): @cloudflare/containers, baseEnv, CoCreateContainer, fetch(), scheduled(), legacyOriginResponse()

### Community 47 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.18
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 48 - "beta-requests.ts"
Cohesion: 0.09
Nodes (29): Beta access request change packet — 2026-10-09, Evidence and release status, Initial external configuration observations, Operations and manual acceptance, Outcome and bounded scope, Stage contracts and acceptance, Verified deployment — 2026-10-09, BetaDelivery (+21 more)

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (9): BASIC_ACCOUNTING, BASIC_LIMIT, EXTENDED_LIMIT, IO_COUNTERS, IsolationRunner, PROCESS_INFORMATION, SECURITY_CAPABILITIES, STARTUPINFO (+1 more)

### Community 50 - "Step 05 handoff — attributable intent and contextual references"
Cohesion: 0.33
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
Cohesion: 0.10
Nodes (24): @tiptap/extension-collaboration-caret, WorkflowStatus, App(), FormatChoice, Join(), People(), Product(), ProviderChoice (+16 more)

### Community 55 - "main.tsx"
Cohesion: 0.15
Nodes (9): lucide-react, react-dom, CanvasExample(), LandingPage(), questions, App, LandingPage, ProjectApp (+1 more)

### Community 56 - "workflow-budget.test.ts"
Cohesion: 0.34
Nodes (9): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), ProviderRequestRecord (+1 more)

### Community 57 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 58 - "verify-candidate-evidence.ts"
Cohesion: 0.13
Nodes (17): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+9 more)

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (40): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+32 more)

### Community 60 - "harness/checklist.md"
Cohesion: 0.13
Nodes (12): Acceptance and evidence, Canvas → Artifacts change packet, Evidence and required contracts, Outcome and scope, Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries (+4 more)

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "index.ts"
Cohesion: 0.10
Nodes (20): express, approved, browser, checks, chrome, directory, local, output (+12 more)

### Community 64 - "verify-coordinator-postgres.ts"
Cohesion: 0.13
Nodes (11): pg, a, admin, b, checks, ownerA, ownerB, project (+3 more)

### Community 65 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 66 - "multiuser-step09-handoff.md"
Cohesion: 0.17
Nodes (10): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures, Actual runtime, verification and retained failures, Controlled comparison, Files, rollout and next work (+2 more)

### Community 67 - "verify-intent-ui.ts"
Cohesion: 0.13
Nodes (13): Browser, browsers, dataDir, fake, inputs, open(), output, providerAddress (+5 more)

### Community 68 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.18
Nodes (9): apply, args, backup, client, dataArg, dataDir, mapping, mappingArg (+1 more)

### Community 69 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "react"
Cohesion: 0.36
Nodes (8): react, Artifacts(), artifactSelectionKey(), readSelection(), Selection, inline(), MarkdownDocument(), safeDocumentLink()

### Community 72 - "ref_node_fs"
Cohesion: 0.06
Nodes (21): ws, yjs, Browser, browsers, checks, open(), output, until() (+13 more)

### Community 73 - ".loadSnapshot"
Cohesion: 0.39
Nodes (4): decodePersistedYjsUpdate(), encodePostgresBytea(), legacyBufferShape(), persistedRawBytes()

### Community 74 - "Harness architecture"
Cohesion: 0.08
Nodes (25): 2guys1canvas presentation and invitation boundary (2026-09-30), Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary (+17 more)

### Community 75 - "verification.ts"
Cohesion: 0.26
Nodes (11): assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript, planVerification() (+3 more)

### Community 76 - "ai-accounting.ts"
Cohesion: 0.23
Nodes (12): aggregateCalls(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, AIRate, AIRunCall, LegacyAISpecialty (+4 more)

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 79 - "ai-presets.test.ts"
Cohesion: 0.25
Nodes (9): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), effortLevels, AIWorkflowMode (+1 more)

### Community 80 - ".ensureWorkflow"
Cohesion: 0.24
Nodes (3): WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 82 - "safeLocalDestination"
Cohesion: 0.19
Nodes (19): safeLocalDestination(), completeOAuthCallback(), OAuthCallbackOutcome, AcceptInvite(), AuthLinks(), authMessage(), AuthShell(), BetaAccess() (+11 more)

### Community 85 - "BuildAccounting.tsx"
Cohesion: 0.23
Nodes (9): Bounded context and cost target, AIRunRecord, BuildProgress, NormalizedAIUsage, BuildAccounting(), comparableMetrics(), runKey(), tokenCount() (+1 more)

### Community 90 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 91 - "artifact-restoration.test.ts"
Cohesion: 0.09
Nodes (20): dir, manager, observations, platform, project, Browser, browsers, dataDir (+12 more)

### Community 92 - "2guys1canvas"
Cohesion: 0.13
Nodes (15): 2guys1canvas, Active hosted MVP: OpenRouter BYOK, AI steering documents, Architecture, Checks, Connect AI, Current boundaries, Current product setup (2026-09-30) (+7 more)

### Community 94 - "Multi-user harness improvement prompts"
Cohesion: 0.15
Nodes (13): Common contract, Multi-user harness improvement prompts, Starting instruction, Step 01 - Audit, scenarios and baseline, Step 02 - Coordinator fencing and owner routing, Step 03 - Artifact persistence and restoration, Step 04 - Generated execution isolation, Step 05 - Intent inspection, correction and contextual references (+5 more)

### Community 95 - "Multi-user Step 04 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites

### Community 96 - "ProjectFile"
Cohesion: 0.50
Nodes (4): ProjectFile, crc32(), createZip(), table

### Community 97 - "BetaReview.tsx"
Cohesion: 0.40
Nodes (5): @supabase/supabase-js, AuthenticatedRequest, BetaReview(), date(), ReviewList

### Community 99 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 100 - "Pre-launch release repair — 2026-10-08"
Cohesion: 0.50
Nodes (4): Bounded change packet, Final smoke verification and publication — 2026-10-08, Fresh evidence, Pre-launch release repair — 2026-10-08

### Community 102 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.40
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 103 - "contradiction-resolution-plan.md"
Cohesion: 0.19
Nodes (4): Exact owner and approval process, Pre-launch and private beta change packet, Release prerequisites and rollback, Verification and handoff

### Community 105 - "types.ts"
Cohesion: 0.07
Nodes (29): Named AI connections (preferred API), Shared response models, AgentStatus, AIConnection, AIRateTier, AIRecommendation, AIRoutingEvidenceStatus, CapabilityCheck (+21 more)

### Community 106 - "token"
Cohesion: 0.67
Nodes (3): Transport and authentication, request(), token()

### Community 109 - "Multi-user Step 07 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Checks and retained attempts, Deliberately bounded coverage, Files, decision and handoff, Isolation and operator setup, Multi-user Step 07 handoff - 2026-10-04, Outcome and boundary

### Community 113 - "Steps 6–10 integration into main"
Cohesion: 0.40
Nodes (4): Fresh verification, Operational boundaries, Resolution and preserved contracts, Steps 6–10 integration into main

### Community 120 - "product.md"
Cohesion: 0.11
Nodes (4): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02

## Knowledge Gaps
- **641 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+636 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 962 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `yjs` connect `ref_node_fs` to `live-collaboration-check.mjs`, `rooms.ts`, `project.ts`, `provider.ts`, `reliability.test.ts`, `.loadSnapshot`, `measure-responsiveness.ts`, `fixtures/multiuser-baseline.ts`, `package.json`, `App.tsx`, `artifact-restoration.test.ts`, `supabase-platform.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Are the 34 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 34 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _641 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.0739704118352659 - nodes in this community are weakly interconnected._
- **Why does `RoomManager` connect `RoomManager` to `rooms.ts`, `multiuser-step09-handoff.md`, `EventStore`, `ref_node_fs`, `types.ts`, `reliability.test.ts`, `ai-presets.test.ts`, `fixtures/multiuser-baseline.ts`, `tool-registry.ts`, `managed-ai.test.ts`, `workflow-budget.test.ts`, `artifact-restoration.test.ts`, `registerProjectRoutes`, `index.ts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.11255411255411256 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._