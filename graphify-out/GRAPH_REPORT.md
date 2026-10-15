# Graph Report - Devoffice  (2026-10-15)

## Corpus Check
- 318 files · ~301,766 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 6, .css 6, .example 1)

## Summary
- 2762 nodes · 7077 edges · 158 communities (120 shown, 38 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 217 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dc10fac6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- README.md
- tool-registry.ts
- EventStore
- prisma/schema.prisma
- fixtures/multiuser-baseline.ts
- requirements.ts
- ProviderRequestRecord
- providers.ts
- rules
- ProjectApp.tsx
- blender-sessions.ts
- verify-interpretation-topology.ts
- codebase-audit.ts
- project.ts
- package.json
- beta-access.test.ts
- ai-presets.ts
- instructions.md
- supabase-platform.ts
- dependencies
- probe-interactive-blender.ts
- compilerOptions
- graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md
- ref_node_path
- 2guys1canvas API reference
- index.ts
- artifacts.ts
- live-collaboration-check.mjs
- ref_node_os
- registerSharedBrowserRoutes
- SupabasePlatform
- App.tsx
- yjs
- verify-harness-integration.ts
- verify-candidate-evidence.ts
- prelaunch-release-repair.md
- reliability.test.ts
- event-store.ts
- blender-native-tests.ts
- measure-responsiveness.ts
- generator.ts
- IntentReview.tsx
- main.tsx
- beta-requests.ts
- IsolationRunner
- registerProjectRoutes
- Custom-domain private beta release packet
- scripts
- verify-build-progress.ts
- managed-ai.test.ts
- AgentPanel.tsx
- browser.ts
- isolation.ts
- Production release prerequisite packet — 2026-10-11
- 2guys1canvas harness implementation checklist
- types.ts
- .oxfmtrc.json
- BetaRequestService
- CoCreateProvider
- devDependencies
- compiler-worker.cjs
- verify-intent-ui.ts
- server/blender-companion.ts
- Bounded staging GitHub executor
- 24-pixel SVG favicon
- artifact-restoration.test.ts
- interactive-blender-companion.ts
- verify-blender-session.ts
- Harness architecture
- api
- ref_node_assert
- 2guys1canvas context handoff
- 2guys1canvas product brief
- verify-preview-releases.ts
- intent-corrections.test.ts
- .mcp.json
- Shared browser sessions — bounded change packet
- Steps 6–10 integration into main
- 2guys1canvas AI coding instructions
- verify-reliability.ts
- 2guys1canvas
- verify-canvas-artifacts.ts
- Multi-user harness improvement prompts
- interactive-blender-executor.ts
- Minimal isolated staging resource packet — 2026-10-11
- local-drafts.test.ts
- interactive-blender.py
- verify-coordinator-postgres.ts
- Canvas → Artifacts change packet
- blender.ts
- Scoped staging build credentials — 2026-10-13
- workflow-budget.test.ts
- Connected Blender milestone — change packet
- cloudflare-container.test.ts
- ByokSetup.tsx
- linux-cgroup-isolation.test.ts
- rooms.ts
- canvas-artifacts.ts
- preview-state.ts
- verification.ts
- .loadSnapshot
- Multi-user Step 04 handoff - 2026-10-04
- Beta setup and acceptance
- start-container.sh
- prepare-ci-cgroup.sh
- run-linux-check.sh
- scripts/blender-companion.ts
- Multi-user Step 03 handoff - 2026-10-03
- Step 06 handoff — stable progress under ongoing steering
- Interactive Blender — bounded change packet
- Multi-user Step 07 handoff - 2026-10-04
- Step 10 - Cross-system integration and final harness review
- Step 05 handoff — attributable intent and contextual references
- browser-session.ts
- run-linux-desktop-check.sh
- Generated frontend preview deployment — bounded change packet
- start-blender-display.sh
- Beta access request change packet — 2026-10-09
- Private artifact cache and revocation — bounded change packet
- Multi-user Step 01 evidence and handoff
- harness/architecture.md
- ref_node_fs
- Step 08 - Durable workflow budget and accounting
- Hosted beta release packet — 2026-10-11
- Step 09 - Conditional interpretation concurrency and topology evaluation
- Harness documentation cleanup — 2026-10-02
- Staging legacy cache recovery request — prepared, not sent
- token
- credentials.ts
- Authorized hosted staging execution — 2026-10-13

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 137 edges
2. `Room` - 98 edges
3. `createCoCreateServer()` - 75 edges
4. `SupabasePlatform` - 63 edges
5. `EventStore` - 56 edges
6. `2guys1canvas harness implementation checklist` - 40 edges
7. `ArtifactUnavailableError` - 39 edges
8. `IsolationRunner` - 34 edges
9. `registerProjectRoutes()` - 34 edges
10. `Vercel TypeSafe-compatible endpoint documentation` - 34 edges

## Surprising Connections (you probably didn't know these)
- `Outcome and responsible boundary` --references--> `bundleProject()`  [INFERRED]
  docs/harness/multiuser-step04-handoff.md → server/project.ts
- `Actual runtime, verification and retained failures` --references--> `RoomManager`  [INFERRED]
  docs/harness/multiuser-step09-handoff.md → server/rooms.ts
- `Bounded context and cost target` --references--> `AIRunRecord`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → shared/types.ts
- `Rooms and sessions` --references--> `RoomView`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/api.md → shared/types.ts
- `Responsive delivery and synchronization` --references--> `RoomView`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → shared/types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Participant-scoped durable submission safety** — api_canonical_saved_receipts, api_flush_ordering, api_retired_legacy_build, api_durable_submit, api_capture_order [EXTRACTED 1.00]
- **Verified cleanup preserves workflow authority** — docs_harness_codebase_cleanup_verification_scaffold_removal, docs_harness_codebase_cleanup_verification_shared_extraction, docs_harness_architecture_durable_workflow, docs_harness_codebase_cleanup_verification_local_cleanup_checks [EXTRACTED 1.00]
- **October durable reliability contract** — docs_harness_reliability_verification_ordered_recovery, docs_harness_reliability_verification_ordered_submission_recovery, docs_harness_architecture_canonical_save_receipts, docs_harness_architecture_coordinator_fencing [EXTRACTED 1.00]
- **Feature edit authority and import boundaries** — instructions_feature_packet, instructions_shared_boundary, instructions_source_ownership, instructions_jev_advisory [EXTRACTED 1.00]
- **Collaborative submission-to-promoted-artifact flow** — product_core_loop, product_capture_order, product_durable_receipts, product_bounded_recovery [EXTRACTED 1.00]

## Communities (158 total, 38 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.06
Nodes (41): Submission scheduling: current implementation and required hardening, Later-step source audit, catalogRate(), effortAllowance(), registerBlenderRoutes(), deviceAccess(), initialBlenderState(), recoverBlenderState() (+33 more)

### Community 2 - "tool-registry.ts"
Cohesion: 0.15
Nodes (12): ActorType, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior, ToolContext (+4 more)

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 7 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.18
Nodes (14): output, report, trials, ToolRegistry, Attempt, interpretation(), Observation, pause() (+6 more)

### Community 8 - "requirements.ts"
Cohesion: 0.10
Nodes (34): acceptanceFor(), acceptedClassification(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries(), categories, classifications (+26 more)

### Community 9 - "ProviderRequestRecord"
Cohesion: 0.36
Nodes (5): aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes, ProviderRequestRecord

### Community 10 - "providers.ts"
Cohesion: 0.07
Nodes (36): boundedInput(), accounting, adapterFor(), adapters, anthropic, balancedObject(), bearer(), classify() (+28 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.05
Nodes (65): @supabase/supabase-js, apply, args, backup, client, dataArg, dataDir, mapping (+57 more)

### Community 13 - "blender-sessions.ts"
Cohesion: 0.21
Nodes (20): activeInteractive(), approveDevice(), BlenderState, CONNECTION_MS, createPair(), deny(), deviceHash(), equal() (+12 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.10
Nodes (24): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+16 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.13
Nodes (23): typescript, cachedReview(), ImportReference, inputCost(), inspectSources(), add(), reachable(), resolve() (+15 more)

### Community 17 - "project.ts"
Cohesion: 0.17
Nodes (14): allowedExtensions, downloadableFiles(), FileOperation, generatedRoot, infrastructureFiles, loadProject(), persistProject(), ProjectFile (+6 more)

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (28): engines, node, name, packageManager, private, type, version, cross-env (+20 more)

### Community 19 - "beta-access.test.ts"
Cohesion: 0.12
Nodes (15): approved, browser, checks, chrome, directory, local, output, platform (+7 more)

### Community 20 - "ai-presets.ts"
Cohesion: 0.06
Nodes (41): aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, EVALUATION_PROTOCOL_VERSION, EvaluationSummary (+33 more)

### Community 22 - "supabase-platform.ts"
Cohesion: 0.20
Nodes (12): ArtifactBody, artifactPath(), ArtifactReference, checkReference(), decodeArtifactBody(), verifyArtifact(), AuthenticatedUser, PlatformConfig (+4 more)

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "probe-interactive-blender.ts"
Cohesion: 0.17
Nodes (8): base, executable, native, outside, runtime, server, source, workspace

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.16
Nodes (4): TypeSafe state/questions API cited in pilot plan, TypeSafe coding-agent guidance cited in cleanup plan, TypeSafe confidence guidance cited in pilot plan, TypeSafe pricing cited in October 3 estimates

### Community 28 - "ref_node_path"
Cohesion: 0.05
Nodes (53): Contracts and acceptance, Exact tested candidate and initial staging publication, Full beta staging continuation — 2026-10-12, Outcome and bounded scope, Recovery and pending work, Subsequent authorized execution and failed cache proof — 2026-10-13, Verification and handoff — 2026-10-13, Current inspection and preparation result (+45 more)

### Community 29 - "2guys1canvas API reference"
Cohesion: 0.13
Nodes (15): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+7 more)

### Community 30 - "index.ts"
Cohesion: 0.09
Nodes (31): express, artifactResponse(), participantId(), roomToken(), Session, coordinatorRetry, coordinatorResponse(), Rpc (+23 more)

### Community 31 - "artifacts.ts"
Cohesion: 0.19
Nodes (19): ArchivedVersion, ArtifactUnavailableError, ArtifactVersion, canonicalJson(), captureArtifacts(), checkFiles(), checkpointArtifactBytes(), envelope() (+11 more)

### Community 32 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 33 - "ref_node_os"
Cohesion: 0.06
Nodes (27): browser, output, profile, browser, outputDir, profile, browser, outputDir (+19 more)

### Community 34 - "registerSharedBrowserRoutes"
Cohesion: 0.25
Nodes (3): SharedBrowserExecutor, registerSharedBrowserRoutes(), validateBrowserInput()

### Community 35 - "SupabasePlatform"
Cohesion: 0.16
Nodes (5): fail(), normalizeProjectTitle(), SupabasePlatform, encodePostgresBytea(), hostedFixture()

### Community 36 - "App.tsx"
Cohesion: 0.10
Nodes (28): 2guys1canvas presentation and invitation boundary (2026-09-30), Reference-led presentation update (2026-09-30), @tiptap/extension-collaboration, BuildProgress, WorkflowStatus, App(), FormatChoice, Join() (+20 more)

### Community 37 - "yjs"
Cohesion: 0.17
Nodes (8): y-protocols, yjs, deletionSignature(), ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), FakeWebSocket

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.11
Nodes (19): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+11 more)

### Community 39 - "verify-candidate-evidence.ts"
Cohesion: 0.14
Nodes (16): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+8 more)

### Community 40 - "prelaunch-release-repair.md"
Cohesion: 0.13
Nodes (13): Exact owner and approval process, Pre-launch and private beta change packet, Release prerequisites and rollback, Verification and handoff, Conditional same-host alternative, Evidence and smallest next action, If delegation is unavailable, Linux browser isolation: bounded alternative and platform questions (+5 more)

### Community 41 - "reliability.test.ts"
Cohesion: 0.11
Nodes (11): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, CoordinatorUnavailableError, RemoteCoordinator (+3 more)

### Community 42 - "event-store.ts"
Cohesion: 0.12
Nodes (13): EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow, taskTransitions (+5 more)

### Community 43 - "blender-native-tests.ts"
Cohesion: 0.31
Nodes (10): scene, artifactHash(), bodyFromBytes(), binary(), BLENDER_MIME, blenderBytes(), checkBlenderResult(), restoreBlender() (+2 more)

### Community 44 - "measure-responsiveness.ts"
Cohesion: 0.24
Nodes (4): median(), run(), Sample, wait()

### Community 45 - "generator.ts"
Cohesion: 0.12
Nodes (26): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, clean(), demoExtract(), AgentChange, classification (+18 more)

### Community 46 - "IntentReview.tsx"
Cohesion: 0.18
Nodes (7): IntentCommandResult, IntentTarget, InterpretationIntentCategory, SharedRequirementSource, caption(), Edit, IntentReview()

### Community 47 - "main.tsx"
Cohesion: 0.18
Nodes (7): react-dom, CanvasExample(), LandingPage(), questions, App, LandingPage, ProjectApp

### Community 48 - "beta-requests.ts"
Cohesion: 0.18
Nodes (14): BetaDelivery, betaEmailPayload(), emailHtml(), InvitationDelivery, InvitationEmail, invitationEmailSenderFromEnv(), TransactionalEmailPayload, TransactionalEmailSender (+6 more)

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (9): BASIC_ACCOUNTING, BASIC_LIMIT, EXTENDED_LIMIT, IO_COUNTERS, IsolationRunner, PROCESS_INFORMATION, SECURITY_CAPABILITIES, STARTUPINFO (+1 more)

### Community 50 - "registerProjectRoutes"
Cohesion: 0.22
Nodes (10): InvitationEmailSender, appOrigin(), bearer(), displayName(), message(), recipientKey(), registerProjectRoutes(), requestKey() (+2 more)

### Community 51 - "Custom-domain private beta release packet"
Cohesion: 0.22
Nodes (9): Acceptance evidence and handoff, Blocked deployment repair packet — 2026-10-08, Current execution status, Custom-domain private beta release packet, Latest verified handoff — 2026-10-08, Outcome and bounded scope, Prepared changes and compatibility, Verification, execution and recovery plan (+1 more)

### Community 52 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, audit:code, build, check:boundaries, deploy:cloudflare, dev, migrate:legacy, start (+1 more)

### Community 53 - "verify-build-progress.ts"
Cohesion: 0.15
Nodes (15): address, Browser, browsers, candidates, converge(), dataDir, fake, gates (+7 more)

### Community 54 - "managed-ai.test.ts"
Cohesion: 0.10
Nodes (19): [command,file], BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases, MANAGED_CATALOG_SOURCE (+11 more)

### Community 55 - "AgentPanel.tsx"
Cohesion: 0.18
Nodes (16): AIResolvedLayer, NormalizedAIUsage, Participant, dollars(), rateSummary(), effortChoices, AgentPanel(), changeEffort() (+8 more)

### Community 56 - "browser.ts"
Cohesion: 0.30
Nodes (9): browserHash(), assertVerificationBrowserAvailable(), browserExecutable(), BrowserProtocol, unavailable(), withIsolatedBrowser(), IsolationError, IsolationOptions (+1 more)

### Community 57 - "isolation.ts"
Cohesion: 0.16
Nodes (19): Linux verification follow-up — 2026-10-08, assertIsolationAvailable(), cancelled(), compileIsolated(), Dependency, hostEnvironment(), IsolatedRequest, isolationPolicy (+11 more)

### Community 58 - "Production release prerequisite packet — 2026-10-11"
Cohesion: 0.25
Nodes (8): Current official references, Exact implementation verification and updated resource preparation, Operator evidence and main-candidate preparation, Outcome and bounded scope, Production release prerequisite packet — 2026-10-11, Recovery, Required contracts and verification, Resource inspection and configuration

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (40): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+32 more)

### Community 61 - "types.ts"
Cohesion: 0.06
Nodes (42): Named AI connections (preferred API), Shared response models, browser, dataDir, group, profile, room, token (+34 more)

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "BetaRequestService"
Cohesion: 0.42
Nodes (4): BetaRequestService, databaseError(), registerBetaRequestRoutes(), rowRequest()

### Community 65 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 67 - "verify-intent-ui.ts"
Cohesion: 0.13
Nodes (13): Browser, browsers, dataDir, fake, inputs, open(), output, providerAddress (+5 more)

### Community 68 - "server/blender-companion.ts"
Cohesion: 0.17
Nodes (16): outside, server, workspace, companionLease(), Receipt, runBlenderCompanion(), writeCompanionReceipt(), writePrivateConnection() (+8 more)

### Community 69 - "Bounded staging GitHub executor"
Cohesion: 0.18
Nodes (9): Bounded review and admission, Evidence and interpretation, Hosted acceptance, recovery and cleanup, Staging Builds ownership repair — 15 October 2026 Nepal, Bounded staging GitHub executor, Change packet and authority, Concrete additional operation — approval required before activation, Costs, resources and cleanup (+1 more)

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "artifact-restoration.test.ts"
Cohesion: 0.17
Nodes (10): dir, manager, observations, platform, project, buildFixture(), files, manager() (+2 more)

### Community 72 - "interactive-blender-companion.ts"
Cohesion: 0.23
Nodes (12): LocalBlenderApproval, InteractiveCommand, collect(), lease(), Options, privateDirectory(), privateFile(), Receipt (+4 more)

### Community 73 - "verify-blender-session.ts"
Cohesion: 0.16
Nodes (10): Browser, browsers, checks, companionStop, interactive, localStates, open(), output (+2 more)

### Community 74 - "Harness architecture"
Cohesion: 0.09
Nodes (22): Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Bounded context and cost target, Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary (+14 more)

### Community 75 - "api"
Cohesion: 0.25
Nodes (16): react, PreviewView, RoomView, api(), tokenRole(), Artifacts(), artifactSelectionKey(), readSelection() (+8 more)

### Community 76 - "ref_node_assert"
Cohesion: 0.10
Nodes (11): ws, b64(), createSession(), verifySession(), projectSchema, keepLastSuccess(), shouldPromoteRevision(), supabasePlatformInternals (+3 more)

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 79 - "verify-preview-releases.ts"
Cohesion: 0.17
Nodes (9): checks, click(), files, input(), output, until(), viewer(), viewers (+1 more)

### Community 80 - "intent-corrections.test.ts"
Cohesion: 0.16
Nodes (15): submittedOutput(), AcceptedIntentContext, generic, normalize(), sourceWords(), validateSubmittedInterpretation(), applyIntentCommand(), categories (+7 more)

### Community 82 - "Shared browser sessions — bounded change packet"
Cohesion: 0.33
Nodes (6): Acceptance and evidence gates, Authority, privacy and recovery, Implemented local boundary and handoff, Outcome and boundary, Scope and evidence, Shared browser sessions — bounded change packet

### Community 85 - "Steps 6–10 integration into main"
Cohesion: 0.40
Nodes (4): Fresh verification, Operational boundaries, Resolution and preserved contracts, Steps 6–10 integration into main

### Community 90 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 91 - "verify-reliability.ts"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, open(), output, providerAddress, room (+2 more)

### Community 92 - "2guys1canvas"
Cohesion: 0.13
Nodes (15): 2guys1canvas, Active hosted MVP: OpenRouter BYOK, AI steering documents, Architecture, Checks, Connect AI, Current boundaries, Current product setup (2026-09-30) (+7 more)

### Community 93 - "verify-canvas-artifacts.ts"
Cohesion: 0.21
Nodes (7): Browser, browsers, checks, open(), output, until(), wait()

### Community 94 - "Multi-user harness improvement prompts"
Cohesion: 0.15
Nodes (13): Common contract, Multi-user harness improvement prompts, Starting instruction, Step 01 - Audit, scenarios and baseline, Step 02 - Coordinator fencing and owner routing, Step 03 - Artifact persistence and restoration, Step 04 - Generated execution isolation, Step 05 - Intent inspection, correction and contextual references (+5 more)

### Community 95 - "interactive-blender-executor.ts"
Cohesion: 0.29
Nodes (10): deny(), interactiveHash(), InteractiveState, queueInteractive(), validateInteractiveState(), BlenderDevice, interactiveBlenderLimits, BlenderInput (+2 more)

### Community 96 - "Minimal isolated staging resource packet — 2026-10-11"
Cohesion: 0.22
Nodes (9): Cleanup and recovery plan, Cost estimate and limits, Current official documentation, Exact operations after concrete authorization, Minimal isolated staging resource packet — 2026-10-11, Read-only availability and quota check, Scope and authority, Track 1 — staging 2guys1canvas itself (+1 more)

### Community 97 - "local-drafts.test.ts"
Cohesion: 0.20
Nodes (7): browserDraftStore, draftKey(), DraftStore, LocalDraftStatus, persistDraft(), restoreDraft(), merge()

### Community 98 - "interactive-blender.py"
Cohesion: 0.08
Nodes (12): check(), main(), run(), inspect(), key(), png(), finish(), probe() (+4 more)

### Community 99 - "verify-coordinator-postgres.ts"
Cohesion: 0.13
Nodes (11): pg, a, admin, b, checks, ownerA, ownerB, project (+3 more)

### Community 100 - "Canvas → Artifacts change packet"
Cohesion: 0.25
Nodes (8): Acceptance and evidence, Canvas → Artifacts change packet, Completed implementation, Evidence and required contracts, Final Linux acceptance, Fresh verification and retained limits, Handoff, demo and rollout boundaries, Outcome and scope

### Community 101 - "blender.ts"
Cohesion: 0.27
Nodes (10): BlenderCommand, BlenderFrozenInput, BlenderOperation, blenderSceneSchema, BlenderSessionView, fail(), object(), validateBlenderScene() (+2 more)

### Community 102 - "Scoped staging build credentials — 2026-10-13"
Cohesion: 0.22
Nodes (9): Authorized renewal preparation — 15 October Nepal, Bounded change packet, Dated admission and actual dispatch, Exact build and recovery controls, Failed build and next bounded credential window, Official evidence and current status, Original proposed access and expiry — dated 13 October, Private manual entry and admission (+1 more)

### Community 103 - "workflow-budget.test.ts"
Cohesion: 0.37
Nodes (8): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), usedBudget()

### Community 104 - "Connected Blender milestone — change packet"
Cohesion: 0.20
Nodes (10): Acceptance gates, Connected Blender milestone — change packet, Documentation and evidence, Final local handoff, Foundations and permitted changes, Limits and rollout, Outcome and scope, Reproducible acceptance (+2 more)

### Community 105 - "cloudflare-container.test.ts"
Cohesion: 0.16
Nodes (7): @cloudflare/containers, root, baseEnv, CoCreateContainer, fetch(), scheduled(), legacyOriginResponse()

### Community 106 - "ByokSetup.tsx"
Cohesion: 0.29
Nodes (5): lucide-react, AIConnection, ByokSetup(), Lease, request()

### Community 107 - "linux-cgroup-isolation.test.ts"
Cohesion: 0.13
Nodes (12): linuxBrowserFileBytes, linuxBrowserFileDescriptors, linuxBrowserMemoryBytes, LinuxJobGroup, linuxJobLauncher, unavailable(), wait(), jobs() (+4 more)

### Community 108 - "rooms.ts"
Cohesion: 0.12
Nodes (25): checkMarkdown(), DOCUMENT_MIME, documentBytes(), generateDocument(), MAX_MARKDOWN_BYTES, requiredHeadings(), restoreDocument(), snapshotDocuments() (+17 more)

### Community 109 - "canvas-artifacts.ts"
Cohesion: 0.12
Nodes (11): checks, output, site, until(), viewer(), viewers, wait(), approvedBrowserOrigin() (+3 more)

### Community 110 - "preview-state.ts"
Cohesion: 0.38
Nodes (4): EncryptedSecret, fail(), previewState, restorePreviewBytes()

### Community 113 - "verification.ts"
Cohesion: 0.21
Nodes (13): assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript, planVerification() (+5 more)

### Community 115 - ".loadSnapshot"
Cohesion: 0.52
Nodes (3): decodePersistedYjsUpdate(), legacyBufferShape(), persistedRawBytes()

### Community 126 - "Multi-user Step 04 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites

### Community 127 - "Beta setup and acceptance"
Cohesion: 0.22
Nodes (9): Beta setup and acceptance, Blender companion, Canvas, artifacts and documents, Dated staging continuation before scoped build admission, Generated application preview, Operator setup, Release and cleanup, Separate tester identities (+1 more)

### Community 131 - "scripts/blender-companion.ts"
Cohesion: 0.29
Nodes (5): args, controller, list(), option(), terminal

### Community 133 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 135 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 136 - "Interactive Blender — bounded change packet"
Cohesion: 0.22
Nodes (9): Agent-to-human recovery and operator gate packet — 2026-10-11, Artifacts interaction demonstration packet, Companion and Artifacts integration packet, Current accepted local boundary — 2026-10-11, Interactive Blender — bounded change packet, Linux display prerequisite implementation — continuation, Native gate result — 2026-10-11, Outcome and prerequisite gate (+1 more)

### Community 137 - "Multi-user Step 07 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Checks and retained attempts, Deliberately bounded coverage, Files, decision and handoff, Isolation and operator setup, Multi-user Step 07 handoff - 2026-10-04, Outcome and boundary

### Community 138 - "Step 10 - Cross-system integration and final harness review"
Cohesion: 0.33
Nodes (6): Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review

### Community 139 - "Step 05 handoff — attributable intent and contextual references"
Cohesion: 0.33
Nodes (6): Checks and honest scope, Durability, uncertainty and compatibility, Files and decision, Outcome and reproduced boundary, Step 05 handoff — attributable intent and contextual references, Unrun release dependencies and next step

### Community 140 - "browser-session.ts"
Cohesion: 0.33
Nodes (5): BrowserDownload, BrowserInput, BrowserReceipt, BrowserState, SharedBrowserSession

### Community 142 - "Generated frontend preview deployment — bounded change packet"
Cohesion: 0.25
Nodes (8): Allowed files and verification, Asset helper continuation packet, Authority and durable contract, Generated frontend preview deployment — bounded change packet, Implemented local contract, Local source evidence — 2026-10-11, Supported stack and scope, Verification and recovery

### Community 144 - "Beta access request change packet — 2026-10-09"
Cohesion: 0.29
Nodes (7): Beta access request change packet — 2026-10-09, Evidence and release status, Initial external configuration observations, Operations and manual acceptance, Outcome and bounded scope, Stage contracts and acceptance, Verified deployment — 2026-10-09

### Community 145 - "Private artifact cache and revocation — bounded change packet"
Cohesion: 0.25
Nodes (6): Legacy cutoff remains failed — 2026-10-13, Outcome and evidence, Private artifact cache and revocation — bounded change packet, Scope and contracts, Verification and recovery, Verified boundary revision

### Community 146 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.40
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 147 - "harness/architecture.md"
Cohesion: 0.13
Nodes (4): Shared browser Linux executor — bounded continuation packet, Verification history and lifecycle repair packet, graphify-out/SOURCE_MAP.md, Vercel TypeSafe-compatible endpoint documentation

### Community 148 - "ref_node_fs"
Cohesion: 0.12
Nodes (15): version, real, record, target, version, buildFiles, config, configIndex (+7 more)

### Community 149 - "Step 08 - Durable workflow budget and accounting"
Cohesion: 0.40
Nodes (5): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures

### Community 150 - "Hosted beta release packet — 2026-10-11"
Cohesion: 0.18
Nodes (11): Current documentation sources, Designated account verification and recovery, Exact implementation verification and handoff, Hosted beta release packet — 2026-10-11, Outcome and scope, Platform review, migration compatibility and recovery, Read-only production observations, Readiness matrix (+3 more)

### Community 151 - "Step 09 - Conditional interpretation concurrency and topology evaluation"
Cohesion: 0.40
Nodes (5): Actual runtime, verification and retained failures, Controlled comparison, Files, rollout and next work, Outcome and responsible boundary, Step 09 - Conditional interpretation concurrency and topology evaluation

### Community 152 - "Harness documentation cleanup — 2026-10-02"
Cohesion: 0.50
Nodes (4): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02

### Community 153 - "Staging legacy cache recovery request — prepared, not sent"
Cohesion: 0.50
Nodes (4): Admission after an actual provider change, Draft for the project owner to submit privately, Reviewable operation, Staging legacy cache recovery request — prepared, not sent

### Community 154 - "token"
Cohesion: 0.67
Nodes (3): Transport and authentication, request(), token()

### Community 156 - "credentials.ts"
Cohesion: 0.39
Nodes (5): decryptSecret(), encryptSecret(), keyFor(), hashToken(), normalizeInviteEmail()

### Community 157 - "Authorized hosted staging execution — 2026-10-13"
Cohesion: 0.40
Nodes (5): Authorized hosted staging execution — 2026-10-13, Bounded operations, Execution and checks, Recovery, Scoped build execution and continuation — 15 October Nepal

## Knowledge Gaps
- **806 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+801 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1175 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **38 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Named AI connections (preferred API)` connect `types.ts` to `interactive-blender.py`, `2guys1canvas API reference`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Are the 34 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 34 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _806 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.0644307982994804 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Why does `check()` connect `interactive-blender.py` to `types.ts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._