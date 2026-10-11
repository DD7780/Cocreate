# Graph Report - Devoffice  (2026-10-11)

## Corpus Check
- 294 files · ~274,056 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 6, .css 6, .example 1)

## Summary
- 2631 nodes · 6810 edges · 147 communities (110 shown, 37 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 208 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7aef2006`
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
- artifact-restoration.test.ts
- providers.ts
- rules
- ProjectApp.tsx
- blender-sessions.ts
- verify-interpretation-topology.ts
- docs/harness/codebase-cleanup-verification.md
- codebase-audit.ts
- project.ts
- package.json
- rooms.ts
- ai-presets.ts
- instructions.md
- blender-interactive-session.test.ts
- dependencies
- ref_node_fs
- compilerOptions
- graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md
- SharedBrowserExecutor
- 2guys1canvas API reference
- preview-routes.ts
- supabase-platform.ts
- live-collaboration-check.mjs
- intent-commands.ts
- shared-browser-routes.ts
- SupabasePlatform
- App.tsx
- CoCreateProvider
- verify-harness-integration.ts
- AgentPanel.tsx
- prelaunch-release-repair.md
- reliability.test.ts
- event-store.ts
- safeLocalDestination
- measure-responsiveness.ts
- generator.ts
- container.js
- browser.ts
- beta-requests.ts
- IsolationRunner
- probe-interactive-blender.ts
- Custom-domain private beta release packet
- scripts
- verify-build-progress.ts
- managed-ai.test.ts
- main.tsx
- verify-coordinator-postgres.ts
- isolation.ts
- verify-candidate-evidence.ts
- 2guys1canvas harness implementation checklist
- harness/architecture.md
- .oxfmtrc.json
- beta-access.test.ts
- verify-blender-execution.ts
- devDependencies
- Step 08 - Durable workflow budget and accounting
- verify-intent-ui.ts
- blender.ts
- Step 05 handoff — attributable intent and contextual references
- 24-pixel SVG favicon
- BetaRequestService
- interactive-blender-companion.ts
- verify-blender-session.ts
- Harness architecture
- api
- index.ts
- 2guys1canvas context handoff
- 2guys1canvas product brief
- verify-preview-releases.ts
- OpenRouterLeases
- .mcp.json
- Shared browser sessions — bounded change packet
- Steps 6–10 integration into main
- 2guys1canvas AI coding instructions
- verify-reliability.ts
- 2guys1canvas
- verify-canvas-artifacts.ts
- Multi-user harness improvement prompts
- .loadSnapshot
- diagnose-browser-file-limit.ts
- scripts/blender-companion.ts
- interactive-blender.py
- ai-accounting.ts
- Canvas → Artifacts change packet
- ref_node_assert
- ref_node_path
- workflow-budget.test.ts
- Connected Blender milestone — change packet
- types.ts
- live-browser-collaboration-check.mjs
- supabase.ts
- LinuxJobGroup
- verify-shared-browser.ts
- release-fingerprint.mjs
- BetaReview.tsx
- registerProjectRoutes
- product.md
- verification.ts
- byok-lease.ts
- start-container.sh
- prepare-ci-cgroup.sh
- run-linux-check.sh
- capabilities.ts
- usage-ledger.ts
- Multi-user Step 03 handoff - 2026-10-03
- dotenv
- Interactive Blender — bounded change packet
- Step 09 - Conditional interpretation concurrency and topology evaluation
- Step 10 - Cross-system integration and final harness review
- verify-conflict-ui.ts
- run-linux-desktop-check.sh
- Generated frontend preview deployment — bounded change packet
- start-blender-display.sh
- Beta access request change packet — 2026-10-09
- harness/checklist.md
- Hosted beta release packet — 2026-10-11

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 137 edges
2. `Room` - 98 edges
3. `createCoCreateServer()` - 73 edges
4. `SupabasePlatform` - 63 edges
5. `EventStore` - 56 edges
6. `2guys1canvas harness implementation checklist` - 40 edges
7. `ArtifactUnavailableError` - 39 edges
8. `IsolationRunner` - 34 edges
9. `registerProjectRoutes()` - 34 edges
10. `registerPreviewRoutes()` - 28 edges

## Surprising Connections (you probably didn't know these)
- `Outcome and responsible boundary` --references--> `bundleProject()`  [INFERRED]
  docs/harness/multiuser-step04-handoff.md → server/project.ts
- `Actual runtime, verification and retained failures` --references--> `RoomManager`  [INFERRED]
  docs/harness/multiuser-step09-handoff.md → server/rooms.ts
- `Rooms and sessions` --references--> `RoomView`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/api.md → shared/types.ts
- `Responsive delivery and synchronization` --references--> `RoomView`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → shared/types.ts
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

## Communities (147 total, 37 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.06
Nodes (40): Submission scheduling: current implementation and required hardening, Later-step source audit, catalogRate(), effortAllowance(), registerBlenderRoutes(), sessionView(), buildProgressFor(), requireCapability() (+32 more)

### Community 2 - "tool-registry.ts"
Cohesion: 0.13
Nodes (14): ActorType, FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior (+6 more)

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 7 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.14
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 8 - "requirements.ts"
Cohesion: 0.10
Nodes (35): acceptanceFor(), acceptedClassification(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries(), categories, classifications (+27 more)

### Community 9 - "artifact-restoration.test.ts"
Cohesion: 0.12
Nodes (10): dir, manager, observations, platform, project, buildFixture(), files, manager() (+2 more)

### Community 10 - "providers.ts"
Cohesion: 0.07
Nodes (35): boundedInput(), accounting, adapterFor(), adapters, anthropic, balancedObject(), bearer(), classify() (+27 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.14
Nodes (20): needsSessionRefresh(), clearProjectSessionCache(), CreateProjectDialog(), InviteResult, Modal(), PendingInvite, Project, ProjectGroup() (+12 more)

### Community 13 - "blender-sessions.ts"
Cohesion: 0.16
Nodes (27): activeInteractive(), InteractiveState, approveDevice(), BlenderDevice, BlenderState, CONNECTION_MS, createPair(), deny() (+19 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.10
Nodes (24): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+16 more)

### Community 15 - "docs/harness/codebase-cleanup-verification.md"
Cohesion: 0.06
Nodes (9): apply, args, backup, client, dataArg, dataDir, mapping, mappingArg (+1 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.13
Nodes (23): typescript, cachedReview(), ImportReference, inputCost(), inspectSources(), add(), reachable(), resolve() (+15 more)

### Community 17 - "project.ts"
Cohesion: 0.12
Nodes (25): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, generateProjectPlan(), mergeUsage(), allowedExtensions, applyOperations() (+17 more)

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (27): engines, node, name, packageManager, private, type, version, cross-env (+19 more)

### Community 19 - "rooms.ts"
Cohesion: 0.08
Nodes (41): ArchivedVersion, ArtifactBody, artifactHash(), ArtifactReference, canonicalJson(), binary(), BLENDER_MIME, blenderBytes() (+33 more)

### Community 20 - "ai-presets.ts"
Cohesion: 0.08
Nodes (27): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), CatalogEntry, classifyTaskComplexity() (+19 more)

### Community 22 - "blender-interactive-session.test.ts"
Cohesion: 0.51
Nodes (7): deny(), interactiveHash(), queueInteractive(), validateInteractiveState(), BlenderInput, INTERACTIVE_BLENDER_POLICY, validateBlenderInput()

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "ref_node_fs"
Cohesion: 0.08
Nodes (20): version, real, record, target, version, browser, output, profile (+12 more)

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.16
Nodes (4): TypeSafe state/questions API cited in pilot plan, TypeSafe coding-agent guidance cited in cleanup plan, TypeSafe confidence guidance cited in pilot plan, TypeSafe pricing cited in October 3 estimates

### Community 29 - "2guys1canvas API reference"
Cohesion: 0.13
Nodes (15): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+7 more)

### Community 30 - "preview-routes.ts"
Cohesion: 0.14
Nodes (20): decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), boundedBody(), CloudflarePreviewProvider, PreviewProvider, registerPreviewRoutes() (+12 more)

### Community 31 - "supabase-platform.ts"
Cohesion: 0.12
Nodes (28): artifactPath(), ArtifactUnavailableError, ArtifactVersion, bodyFromBytes(), captureArtifacts(), checkFiles(), checkpointArtifactBytes(), checkReference() (+20 more)

### Community 32 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 33 - "intent-commands.ts"
Cohesion: 0.20
Nodes (14): submittedOutput(), AcceptedIntentContext, generic, normalize(), sourceWords(), validateSubmittedInterpretation(), applyIntentCommand(), categories (+6 more)

### Community 34 - "shared-browser-routes.ts"
Cohesion: 0.18
Nodes (19): express, artifactResponse(), Session, approvedBrowserOrigin(), browserRequest(), publicBrowserAddress(), browserDownloadBytes(), browserHash() (+11 more)

### Community 35 - "SupabasePlatform"
Cohesion: 0.12
Nodes (9): betaDenied(), fail(), hashToken(), normalizeInviteEmail(), normalizeProjectTitle(), SupabasePlatform, encodePostgresBytea(), hostedFixture() (+1 more)

### Community 36 - "App.tsx"
Cohesion: 0.07
Nodes (35): 2guys1canvas presentation and invitation boundary (2026-09-30), Reference-led presentation update (2026-09-30), BuildProgress, Participant, WorkflowStatus, App(), FormatChoice, Join() (+27 more)

### Community 37 - "CoCreateProvider"
Cohesion: 0.12
Nodes (8): y-protocols, deletionSignature(), CoCreateProvider, ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), FakeWebSocket

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.11
Nodes (19): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+11 more)

### Community 39 - "AgentPanel.tsx"
Cohesion: 0.14
Nodes (17): AIResolvedLayer, NormalizedAIUsage, dollars(), rateSummary(), effortChoices, caption(), IntentReview(), AgentPanel() (+9 more)

### Community 40 - "prelaunch-release-repair.md"
Cohesion: 0.13
Nodes (13): Exact owner and approval process, Pre-launch and private beta change packet, Release prerequisites and rollback, Verification and handoff, Conditional same-host alternative, Evidence and smallest next action, If delegation is unavailable, Linux browser isolation: bounded alternative and platform questions (+5 more)

### Community 41 - "reliability.test.ts"
Cohesion: 0.11
Nodes (11): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, CoordinatorUnavailableError, RemoteCoordinator (+3 more)

### Community 42 - "event-store.ts"
Cohesion: 0.14
Nodes (13): EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow, taskTransitions (+5 more)

### Community 43 - "safeLocalDestination"
Cohesion: 0.21
Nodes (18): safeLocalDestination(), completeOAuthCallback(), OAuthCallbackOutcome, AcceptInvite(), AuthLinks(), authMessage(), AuthShell(), BetaAccess() (+10 more)

### Community 44 - "measure-responsiveness.ts"
Cohesion: 0.28
Nodes (4): median(), run(), Sample, wait()

### Community 45 - "generator.ts"
Cohesion: 0.11
Nodes (20): clean(), demoExtract(), AgentChange, classification, compactRequirement(), compactSharedRequirement(), compactText(), DEFAULT_PROJECT_OUTPUT_TOKENS (+12 more)

### Community 46 - "container.js"
Cohesion: 0.21
Nodes (6): @cloudflare/containers, baseEnv, CoCreateContainer, fetch(), scheduled(), legacyOriginResponse()

### Community 47 - "browser.ts"
Cohesion: 0.16
Nodes (16): assertVerificationBrowserAvailable(), browserExecutable(), linuxBrowserFileBytes, linuxBrowserFileDescriptors, unavailable(), withIsolatedBrowser(), IsolationError, IsolationOptions (+8 more)

### Community 48 - "beta-requests.ts"
Cohesion: 0.20
Nodes (14): BetaDelivery, betaEmailPayload(), emailHtml(), InvitationDelivery, InvitationEmail, invitationEmailSenderFromEnv(), TransactionalEmailPayload, TransactionalEmailSender (+6 more)

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (9): BASIC_ACCOUNTING, BASIC_LIMIT, EXTENDED_LIMIT, IO_COUNTERS, IsolationRunner, PROCESS_INFORMATION, SECURITY_CAPABILITIES, STARTUPINFO (+1 more)

### Community 50 - "probe-interactive-blender.ts"
Cohesion: 0.17
Nodes (8): base, executable, native, outside, runtime, server, source, workspace

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
Cohesion: 0.18
Nodes (13): [command,file], MANAGED_CATALOG_SOURCE, MANAGED_CATALOG_VERSION, MANAGED_DEFAULT_BUILDER, MANAGED_INTERPRETER_CANDIDATES, managedBuilder(), managedCatalog, ManagedCatalogEntry (+5 more)

### Community 55 - "main.tsx"
Cohesion: 0.16
Nodes (8): lucide-react, react-dom, CanvasExample(), LandingPage(), questions, App, LandingPage, ProjectApp

### Community 56 - "verify-coordinator-postgres.ts"
Cohesion: 0.13
Nodes (11): pg, a, admin, b, checks, ownerA, ownerB, project (+3 more)

### Community 57 - "isolation.ts"
Cohesion: 0.14
Nodes (21): Linux verification follow-up — 2026-10-08, executable, sandbox, assertIsolationAvailable(), cancelled(), compileIsolated(), Dependency, hostEnvironment() (+13 more)

### Community 58 - "verify-candidate-evidence.ts"
Cohesion: 0.13
Nodes (17): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+9 more)

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (40): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+32 more)

### Community 60 - "harness/architecture.md"
Cohesion: 0.06
Nodes (17): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff, Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04 (+9 more)

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "beta-access.test.ts"
Cohesion: 0.13
Nodes (13): approved, browser, checks, chrome, directory, local, output, platform (+5 more)

### Community 64 - "verify-blender-execution.ts"
Cohesion: 0.20
Nodes (5): outside, server, workspace, fs, path

### Community 65 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 66 - "Step 08 - Durable workflow budget and accounting"
Cohesion: 0.40
Nodes (5): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures

### Community 67 - "verify-intent-ui.ts"
Cohesion: 0.11
Nodes (16): Transport and authentication, Browser, browsers, dataDir, fake, inputs, open(), output (+8 more)

### Community 68 - "blender.ts"
Cohesion: 0.17
Nodes (21): companionLease(), LocalBlenderApproval, Receipt, runBlenderCompanion(), writePrivateConnection(), approvedDirectory(), blenderLimits, collectBlenderResult() (+13 more)

### Community 69 - "Step 05 handoff — attributable intent and contextual references"
Cohesion: 0.15
Nodes (12): Checks and honest scope, Durability, uncertainty and compatibility, Files and decision, Outcome and reproduced boundary, Step 05 handoff — attributable intent and contextual references, Unrun release dependencies and next step, Files and compatibility, Handoff and outstanding dependencies (+4 more)

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "BetaRequestService"
Cohesion: 0.37
Nodes (4): BetaRequestService, databaseError(), registerBetaRequestRoutes(), rowRequest()

### Community 72 - "interactive-blender-companion.ts"
Cohesion: 0.19
Nodes (14): writeCompanionReceipt(), InteractiveCommand, collect(), lease(), Options, privateDirectory(), privateFile(), Receipt (+6 more)

### Community 73 - "verify-blender-session.ts"
Cohesion: 0.16
Nodes (10): Browser, browsers, checks, companionStop, interactive, localStates, open(), output (+2 more)

### Community 74 - "Harness architecture"
Cohesion: 0.10
Nodes (21): Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary, Execution flow (+13 more)

### Community 75 - "api"
Cohesion: 0.27
Nodes (15): react, RoomView, api(), tokenRole(), Artifacts(), artifactSelectionKey(), readSelection(), Selection (+7 more)

### Community 76 - "index.ts"
Cohesion: 0.13
Nodes (16): ws, scene, b64(), createSession(), participantId(), roomToken(), verifySession(), Rpc (+8 more)

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 79 - "verify-preview-releases.ts"
Cohesion: 0.14
Nodes (15): checks, click(), files, output, until(), viewer(), viewers, wait() (+7 more)

### Community 82 - "Shared browser sessions — bounded change packet"
Cohesion: 0.33
Nodes (6): Acceptance and evidence gates, Authority, privacy and recovery, Implemented local boundary and handoff, Outcome and boundary, Scope and evidence, Shared browser sessions — bounded change packet

### Community 85 - "Steps 6–10 integration into main"
Cohesion: 0.50
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

### Community 95 - ".loadSnapshot"
Cohesion: 0.52
Nodes (3): decodePersistedYjsUpdate(), legacyBufferShape(), persistedRawBytes()

### Community 97 - "scripts/blender-companion.ts"
Cohesion: 0.29
Nodes (5): args, controller, list(), option(), terminal

### Community 98 - "interactive-blender.py"
Cohesion: 0.11
Nodes (9): inspect(), key(), png(), finish(), probe(), save(), send(), tick() (+1 more)

### Community 99 - "ai-accounting.ts"
Cohesion: 0.21
Nodes (14): Bounded context and cost target, aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, AIRunCall (+6 more)

### Community 100 - "Canvas → Artifacts change packet"
Cohesion: 0.25
Nodes (8): Acceptance and evidence, Canvas → Artifacts change packet, Completed implementation, Evidence and required contracts, Final Linux acceptance, Fresh verification and retained limits, Handoff, demo and rollout boundaries, Outcome and scope

### Community 101 - "ref_node_assert"
Cohesion: 0.12
Nodes (5): yjs, bundleProject(), Requirement, pause(), waitFor()

### Community 102 - "ref_node_path"
Cohesion: 0.08
Nodes (21): browser, outputDir, profile, browser, outputDir, profile, stagingConfiguration(), StagingTarget (+13 more)

### Community 103 - "workflow-budget.test.ts"
Cohesion: 0.34
Nodes (9): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), ProviderRequestRecord (+1 more)

### Community 104 - "Connected Blender milestone — change packet"
Cohesion: 0.20
Nodes (10): Acceptance gates, Connected Blender milestone — change packet, Documentation and evidence, Final local handoff, Foundations and permitted changes, Limits and rollout, Outcome and scope, Reproducible acceptance (+2 more)

### Community 105 - "types.ts"
Cohesion: 0.07
Nodes (32): Named AI connections (preferred API), Shared response models, AgentStatus, AIConnection, AIRate, AIRateTier, AIRecommendation, AIRoutingEvidenceStatus (+24 more)

### Community 106 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 107 - "supabase.ts"
Cohesion: 0.16
Nodes (13): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution, authReturnKey, clientAuthMode (+5 more)

### Community 108 - "LinuxJobGroup"
Cohesion: 0.27
Nodes (3): LinuxJobGroup, unavailable(), wait()

### Community 109 - "verify-shared-browser.ts"
Cohesion: 0.24
Nodes (7): checks, output, site, until(), viewer(), viewers, wait()

### Community 110 - "release-fingerprint.mjs"
Cohesion: 0.29
Nodes (6): buildFiles, config, configIndex, files, fingerprint, hash

### Community 113 - "BetaReview.tsx"
Cohesion: 0.40
Nodes (5): @supabase/supabase-js, AuthenticatedRequest, BetaReview(), date(), ReviewList

### Community 115 - "registerProjectRoutes"
Cohesion: 0.26
Nodes (10): InvitationEmailSender, appOrigin(), bearer(), displayName(), message(), recipientKey(), registerProjectRoutes(), requestKey() (+2 more)

### Community 120 - "product.md"
Cohesion: 0.11
Nodes (4): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02

### Community 126 - "verification.ts"
Cohesion: 0.26
Nodes (11): assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript, planVerification() (+3 more)

### Community 127 - "byok-lease.ts"
Cohesion: 0.33
Nodes (5): BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom()

### Community 131 - "capabilities.ts"
Cohesion: 0.50
Nodes (4): capabilityConfiguration(), capabilityEnabled(), OptionalCapability, settings

### Community 132 - "usage-ledger.ts"
Cohesion: 0.50
Nodes (4): aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes

### Community 133 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 136 - "Interactive Blender — bounded change packet"
Cohesion: 0.22
Nodes (9): Agent-to-human recovery and operator gate packet — 2026-10-11, Artifacts interaction demonstration packet, Companion and Artifacts integration packet, Current accepted local boundary — 2026-10-11, Interactive Blender — bounded change packet, Linux display prerequisite implementation — continuation, Native gate result — 2026-10-11, Outcome and prerequisite gate (+1 more)

### Community 137 - "Step 09 - Conditional interpretation concurrency and topology evaluation"
Cohesion: 0.40
Nodes (5): Actual runtime, verification and retained failures, Controlled comparison, Files, rollout and next work, Outcome and responsible boundary, Step 09 - Conditional interpretation concurrency and topology evaluation

### Community 138 - "Step 10 - Cross-system integration and final harness review"
Cohesion: 0.33
Nodes (6): Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review

### Community 139 - "verify-conflict-ui.ts"
Cohesion: 0.25
Nodes (7): browser, dataDir, group, profile, room, token, ConflictGroup

### Community 142 - "Generated frontend preview deployment — bounded change packet"
Cohesion: 0.25
Nodes (8): Allowed files and verification, Asset helper continuation packet, Authority and durable contract, Generated frontend preview deployment — bounded change packet, Implemented local contract, Local source evidence — 2026-10-11, Supported stack and scope, Verification and recovery

### Community 146 - "Beta access request change packet — 2026-10-09"
Cohesion: 0.29
Nodes (7): Beta access request change packet — 2026-10-09, Evidence and release status, Initial external configuration observations, Operations and manual acceptance, Outcome and bounded scope, Stage contracts and acceptance, Verified deployment — 2026-10-09

### Community 147 - "harness/checklist.md"
Cohesion: 0.15
Nodes (4): Shared browser Linux executor — bounded continuation packet, Verification history and lifecycle repair packet, graphify-out/SOURCE_MAP.md, Vercel TypeSafe-compatible endpoint documentation

### Community 150 - "Hosted beta release packet — 2026-10-11"
Cohesion: 0.20
Nodes (10): Current documentation sources, Designated account verification and recovery, Hosted beta release packet — 2026-10-11, Outcome and scope, Platform review, migration compatibility and recovery, Read-only production observations, Readiness matrix, Required contracts and verification (+2 more)

## Knowledge Gaps
- **736 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+731 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1099 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 34 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 34 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _736 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.06436781609195402 - nodes in this community are weakly interconnected._
- **Why does `RoomManager` connect `RoomManager` to `shared-browser-routes.ts`, `EventStore`, `tool-registry.ts`, `ref_node_assert`, `fixtures/multiuser-baseline.ts`, `workflow-budget.test.ts`, `Step 09 - Conditional interpretation concurrency and topology evaluation`, `artifact-restoration.test.ts`, `types.ts`, `index.ts`, `reliability.test.ts`, `registerProjectRoutes`, `rooms.ts`, `ai-presets.ts`, `managed-ai.test.ts`, `preview-routes.ts`, `supabase-platform.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.12631578947368421 - nodes in this community are weakly interconnected._
- **Why does `2guys1canvas API reference` connect `2guys1canvas API reference` to `types.ts`, `verify-intent-ui.ts`, `api.md`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._