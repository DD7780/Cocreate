# Graph Report - Devoffice  (2026-10-13)

## Corpus Check
- 313 files · ~294,280 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 6, .css 6, .example 1)

## Summary
- 2722 nodes · 7017 edges · 161 communities (118 shown, 43 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 216 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a467b42d`
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
- usage-ledger.ts
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
- verify-hosted-beta.ts
- 2guys1canvas API reference
- preview-routes.ts
- artifacts.ts
- live-collaboration-check.mjs
- ref_node_child_process
- registerSharedBrowserRoutes
- SupabasePlatform
- App.tsx
- CoCreateProvider
- verify-harness-integration.ts
- .insert
- prelaunch-release-repair.md
- reliability.test.ts
- event-store.ts
- index.ts
- measure-responsiveness.ts
- generator.ts
- providers.test.ts
- main.tsx
- beta-requests.ts
- IsolationRunner
- registerProjectRoutes
- Custom-domain private beta release packet
- scripts
- verify-build-progress.ts
- OpenRouterLeases
- AgentPanel.tsx
- browserExecutable
- isolation.ts
- Production release prerequisite packet — 2026-10-11
- 2guys1canvas harness implementation checklist
- docs/harness/reliability-verification.md
- types.ts
- .oxfmtrc.json
- BetaRequestService
- production-release.test.ts
- devDependencies
- verify-blender-execution.ts
- verify-intent-ui.ts
- blender-native-tests.ts
- scripts/managed-qualification.ts
- 24-pixel SVG favicon
- canvas-artifacts.test.ts
- interactive-blender-companion.ts
- verify-blender-session.ts
- Harness architecture
- api
- ref_node_fs
- 2guys1canvas context handoff
- 2guys1canvas product brief
- verify-preview-releases.ts
- intent-commands.ts
- .mcp.json
- Shared browser sessions — bounded change packet
- Steps 6–10 integration into main
- 2guys1canvas AI coding instructions
- verify-reliability.ts
- 2guys1canvas
- verify-canvas-artifacts.ts
- Multi-user harness improvement prompts
- blender-interactive-session.test.ts
- Minimal isolated staging resource packet — 2026-10-11
- local-drafts.test.ts
- interactive-blender.py
- verify-coordinator-postgres.ts
- Canvas → Artifacts change packet
- ai-presets.test.ts
- managed-catalog.ts
- workflow-budget.test.ts
- Connected Blender milestone — change packet
- container.js
- ai-accounting.ts
- LinuxJobGroup
- rooms.ts
- verify-shared-browser.ts
- verify-conflict-ui.ts
- verification.ts
- CloudflarePreviewProvider
- product.md
- browser.ts
- Beta setup and acceptance
- start-container.sh
- prepare-ci-cgroup.sh
- run-linux-check.sh
- scripts/blender-companion.ts
- Multi-user Step 03 handoff - 2026-10-03
- live-browser-collaboration-check.mjs
- Interactive Blender — bounded change packet
- generated-isolation.test.ts
- Step 10 - Cross-system integration and final harness review
- multiuser-step01-baseline.md
- run-linux-desktop-check.sh
- Generated frontend preview deployment — bounded change packet
- start-blender-display.sh
- Beta access request change packet — 2026-10-09
- Private artifact cache and revocation — bounded change packet
- check-staging-secrets.ts
- harness/architecture.md
- ref_node_crypto
- Hosted beta release packet — 2026-10-11
- Full beta staging continuation — 2026-10-12
- Staging preparation and secure login packet — 2026-10-12
- token
- cocreate.test.ts
- .createInvite
- Authorized hosted staging execution — 2026-10-13
- shared-browser-linux.md
- diagnose-browser-file-limit.ts

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
10. `Vercel TypeSafe-compatible endpoint documentation` - 33 edges

## Surprising Connections (you probably didn't know these)
- `Outcome and scope` --references--> `stagingConfiguration()`  [INFERRED]
  docs/harness/staging-preparation-checks.md → scripts/prepare-hosted-staging.ts
- `Current inspection and preparation result` --references--> `assertPrivateHostedFixture()`  [INFERRED]
  docs/harness/staging-preparation-checks.md → scripts/verify-hosted-beta.ts
- `Actual runtime, verification and retained failures` --references--> `RoomManager`  [INFERRED]
  docs/harness/multiuser-step09-handoff.md → server/rooms.ts
- `Outcome and bounded scope` --references--> `checkStagingPreparation()`  [INFERRED]
  docs/harness/full-beta-staging.md → scripts/check-staging-preparation.ts
- `Outcome and evidence` --references--> `artifactPath()`  [INFERRED]
  docs/harness/private-artifact-cache.md → server/artifacts.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Participant-scoped durable submission safety** — api_canonical_saved_receipts, api_flush_ordering, api_retired_legacy_build, api_durable_submit, api_capture_order [EXTRACTED 1.00]
- **Verified cleanup preserves workflow authority** — docs_harness_codebase_cleanup_verification_scaffold_removal, docs_harness_codebase_cleanup_verification_shared_extraction, docs_harness_architecture_durable_workflow, docs_harness_codebase_cleanup_verification_local_cleanup_checks [EXTRACTED 1.00]
- **October durable reliability contract** — docs_harness_reliability_verification_ordered_recovery, docs_harness_reliability_verification_ordered_submission_recovery, docs_harness_architecture_canonical_save_receipts, docs_harness_architecture_coordinator_fencing [EXTRACTED 1.00]
- **Feature edit authority and import boundaries** — instructions_feature_packet, instructions_shared_boundary, instructions_source_ownership, instructions_jev_advisory [EXTRACTED 1.00]
- **Collaborative submission-to-promoted-artifact flow** — product_core_loop, product_capture_order, product_durable_receipts, product_bounded_recovery [EXTRACTED 1.00]

## Communities (161 total, 43 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.06
Nodes (41): Submission scheduling: current implementation and required hardening, Later-step source audit, catalogRate(), effortAllowance(), registerBlenderRoutes(), deviceAccess(), initialBlenderState(), recoverBlenderState() (+33 more)

### Community 2 - "tool-registry.ts"
Cohesion: 0.15
Nodes (12): definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior, ToolContext, ToolDefinition (+4 more)

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 7 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.18
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 8 - "requirements.ts"
Cohesion: 0.10
Nodes (35): acceptanceFor(), acceptedClassification(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries(), categories, classifications (+27 more)

### Community 9 - "usage-ledger.ts"
Cohesion: 0.40
Nodes (5): aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes, AIUsage

### Community 10 - "providers.ts"
Cohesion: 0.08
Nodes (28): accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek, ensure() (+20 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.05
Nodes (65): @supabase/supabase-js, apply, args, backup, client, dataArg, dataDir, mapping (+57 more)

### Community 13 - "blender-sessions.ts"
Cohesion: 0.16
Nodes (23): InteractiveState, approveDevice(), BlenderDevice, BlenderState, CONNECTION_MS, createPair(), deny(), deviceHash() (+15 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.10
Nodes (24): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+16 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.13
Nodes (23): typescript, cachedReview(), ImportReference, inputCost(), inspectSources(), add(), reachable(), resolve() (+15 more)

### Community 17 - "project.ts"
Cohesion: 0.13
Nodes (18): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites, allowedExtensions, bundleProject() (+10 more)

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (27): engines, node, name, packageManager, private, type, version, cross-env (+19 more)

### Community 19 - "beta-access.test.ts"
Cohesion: 0.13
Nodes (14): approved, browser, checks, chrome, directory, local, output, platform (+6 more)

### Community 20 - "ai-presets.ts"
Cohesion: 0.10
Nodes (23): Named AI connections (preferred API), CatalogEntry, classifyTaskComplexity(), cost(), effortLevels, estimateLayerMaximum(), layer(), longContext (+15 more)

### Community 22 - "supabase-platform.ts"
Cohesion: 0.16
Nodes (15): RecoveryCheckpoint, versionStub(), browserDownloadBytes(), restoreBrowserDownload(), decryptSecret(), EncryptedSecret, encryptSecret(), keyFor() (+7 more)

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

### Community 28 - "verify-hosted-beta.ts"
Cohesion: 0.17
Nodes (13): AccountInspection, checkStagingPreparation(), keys(), stagingConfiguration(), StagingTarget, Account, HostedFixture, Role (+5 more)

### Community 29 - "2guys1canvas API reference"
Cohesion: 0.17
Nodes (12): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+4 more)

### Community 30 - "preview-routes.ts"
Cohesion: 0.18
Nodes (17): artifactHash(), canonicalJson(), restoreBlender(), PreviewProvider, registerPreviewRoutes(), fail(), hashPlan(), PreviewBytes (+9 more)

### Community 31 - "artifacts.ts"
Cohesion: 0.18
Nodes (21): ArtifactBody, artifactPath(), ArtifactUnavailableError, ArtifactVersion, bodyFromBytes(), captureArtifacts(), checkFiles(), checkpointArtifactBytes() (+13 more)

### Community 32 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 33 - "ref_node_child_process"
Cohesion: 0.05
Nodes (31): WebSocket collaboration, version, real, record, target, version, browser, output (+23 more)

### Community 34 - "registerSharedBrowserRoutes"
Cohesion: 0.25
Nodes (3): SharedBrowserExecutor, registerSharedBrowserRoutes(), validateBrowserInput()

### Community 35 - "SupabasePlatform"
Cohesion: 0.14
Nodes (8): fail(), normalizeProjectTitle(), SupabasePlatform, decodePersistedYjsUpdate(), encodePostgresBytea(), legacyBufferShape(), persistedRawBytes(), hostedFixture()

### Community 36 - "App.tsx"
Cohesion: 0.09
Nodes (31): Rooms and sessions, 2guys1canvas presentation and invitation boundary (2026-09-30), Reference-led presentation update (2026-09-30), Responsive delivery and synchronization, @tiptap/extension-collaboration-caret, @tiptap/react, BuildProgress, RoomView (+23 more)

### Community 37 - "CoCreateProvider"
Cohesion: 0.12
Nodes (8): y-protocols, deletionSignature(), CoCreateProvider, ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), FakeWebSocket

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.11
Nodes (19): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+11 more)

### Community 39 - ".insert"
Cohesion: 0.21
Nodes (3): WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 40 - "prelaunch-release-repair.md"
Cohesion: 0.13
Nodes (13): Exact owner and approval process, Pre-launch and private beta change packet, Release prerequisites and rollback, Verification and handoff, Conditional same-host alternative, Evidence and smallest next action, If delegation is unavailable, Linux browser isolation: bounded alternative and platform questions (+5 more)

### Community 41 - "reliability.test.ts"
Cohesion: 0.06
Nodes (28): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, address, Browser (+20 more)

### Community 42 - "event-store.ts"
Cohesion: 0.15
Nodes (12): ActorType, EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow (+4 more)

### Community 43 - "index.ts"
Cohesion: 0.12
Nodes (20): express, ws, artifactResponse(), b64(), participantId(), roomToken(), Session, verifySession() (+12 more)

### Community 44 - "measure-responsiveness.ts"
Cohesion: 0.24
Nodes (4): median(), run(), Sample, wait()

### Community 45 - "generator.ts"
Cohesion: 0.10
Nodes (28): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, clean(), demoExtract(), AgentChange, classification (+20 more)

### Community 46 - "providers.test.ts"
Cohesion: 0.17
Nodes (14): boundedInput(), callOpenAI(), listProviderModels(), providerConfig(), testOpenAIConnection(), validateBaseUrl(), adapterFor(), discoverModels() (+6 more)

### Community 47 - "main.tsx"
Cohesion: 0.11
Nodes (13): lucide-react, react, react-dom, AIConnection, ByokSetup(), Lease, request(), CanvasExample() (+5 more)

### Community 48 - "beta-requests.ts"
Cohesion: 0.18
Nodes (14): BetaDelivery, betaEmailPayload(), emailHtml(), InvitationDelivery, InvitationEmail, invitationEmailSenderFromEnv(), TransactionalEmailPayload, TransactionalEmailSender (+6 more)

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (9): BASIC_ACCOUNTING, BASIC_LIMIT, EXTENDED_LIMIT, IO_COUNTERS, IsolationRunner, PROCESS_INFORMATION, SECURITY_CAPABILITIES, STARTUPINFO (+1 more)

### Community 50 - "registerProjectRoutes"
Cohesion: 0.23
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

### Community 54 - "OpenRouterLeases"
Cohesion: 0.22
Nodes (6): BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases

### Community 55 - "AgentPanel.tsx"
Cohesion: 0.13
Nodes (18): AIResolvedLayer, NormalizedAIUsage, Participant, dollars(), rateSummary(), effortChoices, caption(), IntentReview() (+10 more)

### Community 56 - "browserExecutable"
Cohesion: 0.26
Nodes (7): approvedBrowserOrigin(), browserRequest(), publicBrowserAddress(), browserHash(), browserExecutable(), BrowserProtocol, assertSharedBrowserRuntime()

### Community 57 - "isolation.ts"
Cohesion: 0.22
Nodes (17): Linux verification follow-up — 2026-10-08, assertIsolationAvailable(), cancelled(), compileIsolated(), Dependency, hostEnvironment(), IsolatedRequest, IsolationOptions (+9 more)

### Community 58 - "Production release prerequisite packet — 2026-10-11"
Cohesion: 0.25
Nodes (8): Current official references, Exact implementation verification and updated resource preparation, Operator evidence and main-candidate preparation, Outcome and bounded scope, Production release prerequisite packet — 2026-10-11, Recovery, Required contracts and verification, Resource inspection and configuration

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (40): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+32 more)

### Community 60 - "docs/harness/reliability-verification.md"
Cohesion: 0.08
Nodes (10): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures, Actual runtime, verification and retained failures, Controlled comparison, Files, rollout and next work (+2 more)

### Community 61 - "types.ts"
Cohesion: 0.08
Nodes (25): Shared response models, AgentStatus, AIRateTier, AIRoutingEvidenceStatus, ArtifactInputVersion, CapabilityCheck, ConflictDetectionStatus, ConflictGroupState (+17 more)

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "BetaRequestService"
Cohesion: 0.42
Nodes (4): BetaRequestService, databaseError(), registerBetaRequestRoutes(), rowRequest()

### Community 64 - "production-release.test.ts"
Cohesion: 0.13
Nodes (17): Outcome and bounded scope, Check, documentationOnlyHandoff(), Proof, recoveryChecks, ReleaseEvidence, releaseGates(), roles (+9 more)

### Community 65 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 66 - "verify-blender-execution.ts"
Cohesion: 0.18
Nodes (6): outside, server, workspace, fs, path, BlenderScene

### Community 67 - "verify-intent-ui.ts"
Cohesion: 0.13
Nodes (13): Browser, browsers, dataDir, fake, inputs, open(), output, providerAddress (+5 more)

### Community 68 - "blender-native-tests.ts"
Cohesion: 0.15
Nodes (27): scene, binary(), BLENDER_MIME, blenderBytes(), checkBlenderResult(), companionLease(), Receipt, runBlenderCompanion() (+19 more)

### Community 69 - "scripts/managed-qualification.ts"
Cohesion: 0.31
Nodes (7): [command,file], MANAGED_CATALOG_VERSION, managedCatalog, MANAGED_QUALIFICATION_VERSION, managedFixtures, ManagedTrial, scoreManagedTrials()

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "canvas-artifacts.test.ts"
Cohesion: 0.13
Nodes (15): createSession(), ProviderDeployment, buildFixture(), files, manager(), version(), createArtifactFixture(), createCanvasArtifactsFixture() (+7 more)

### Community 72 - "interactive-blender-companion.ts"
Cohesion: 0.19
Nodes (13): LocalBlenderApproval, InteractiveCommand, collect(), lease(), Options, privateDirectory(), privateFile(), Receipt (+5 more)

### Community 73 - "verify-blender-session.ts"
Cohesion: 0.16
Nodes (10): Browser, browsers, checks, companionStop, interactive, localStates, open(), output (+2 more)

### Community 74 - "Harness architecture"
Cohesion: 0.10
Nodes (20): Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary, Execution flow (+12 more)

### Community 75 - "api"
Cohesion: 0.18
Nodes (19): BlenderSessionView, BrowserDownload, BrowserInput, BrowserReceipt, BrowserState, SharedBrowserSession, api(), tokenRole() (+11 more)

### Community 76 - "ref_node_fs"
Cohesion: 0.10
Nodes (7): yjs, browser, profile, runPreviewAssetHelper(), Requirement, pause(), waitFor()

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 79 - "verify-preview-releases.ts"
Cohesion: 0.23
Nodes (8): checks, click(), files, output, until(), viewer(), viewers, wait()

### Community 80 - "intent-commands.ts"
Cohesion: 0.21
Nodes (13): submittedOutput(), AcceptedIntentContext, generic, normalize(), sourceWords(), validateSubmittedInterpretation(), applyIntentCommand(), categories (+5 more)

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

### Community 95 - "blender-interactive-session.test.ts"
Cohesion: 0.45
Nodes (8): activeInteractive(), deny(), interactiveHash(), queueInteractive(), validateInteractiveState(), BlenderInput, INTERACTIVE_BLENDER_POLICY, validateBlenderInput()

### Community 96 - "Minimal isolated staging resource packet — 2026-10-11"
Cohesion: 0.22
Nodes (9): Cleanup and recovery plan, Cost estimate and limits, Current official documentation, Exact operations after concrete authorization, Minimal isolated staging resource packet — 2026-10-11, Read-only availability and quota check, Scope and authority, Track 1 — staging 2guys1canvas itself (+1 more)

### Community 97 - "local-drafts.test.ts"
Cohesion: 0.20
Nodes (7): browserDraftStore, draftKey(), DraftStore, LocalDraftStatus, persistDraft(), restoreDraft(), merge()

### Community 98 - "interactive-blender.py"
Cohesion: 0.11
Nodes (9): inspect(), key(), png(), finish(), probe(), save(), send(), tick() (+1 more)

### Community 99 - "verify-coordinator-postgres.ts"
Cohesion: 0.13
Nodes (11): pg, a, admin, b, checks, ownerA, ownerB, project (+3 more)

### Community 100 - "Canvas → Artifacts change packet"
Cohesion: 0.25
Nodes (8): Acceptance and evidence, Canvas → Artifacts change packet, Completed implementation, Evidence and required contracts, Final Linux acceptance, Fresh verification and retained limits, Handoff, demo and rollout boundaries, Outcome and scope

### Community 101 - "ai-presets.test.ts"
Cohesion: 0.33
Nodes (7): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), passed

### Community 102 - "managed-catalog.ts"
Cohesion: 0.25
Nodes (7): MANAGED_CATALOG_SOURCE, MANAGED_DEFAULT_BUILDER, MANAGED_INTERPRETER_CANDIDATES, managedBuilder(), ManagedCatalogEntry, managedSetup(), AIRate

### Community 103 - "workflow-budget.test.ts"
Cohesion: 0.34
Nodes (9): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), ProviderRequestRecord (+1 more)

### Community 104 - "Connected Blender milestone — change packet"
Cohesion: 0.20
Nodes (10): Acceptance gates, Connected Blender milestone — change packet, Documentation and evidence, Final local handoff, Foundations and permitted changes, Limits and rollout, Outcome and scope, Reproducible acceptance (+2 more)

### Community 105 - "container.js"
Cohesion: 0.21
Nodes (6): @cloudflare/containers, baseEnv, CoCreateContainer, fetch(), scheduled(), legacyOriginResponse()

### Community 106 - "ai-accounting.ts"
Cohesion: 0.21
Nodes (14): Bounded context and cost target, aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, AIRunCall (+6 more)

### Community 107 - "LinuxJobGroup"
Cohesion: 0.27
Nodes (3): LinuxJobGroup, unavailable(), wait()

### Community 108 - "rooms.ts"
Cohesion: 0.09
Nodes (32): ArchivedVersion, ArtifactReference, checkMarkdown(), DOCUMENT_MIME, documentBytes(), generateDocument(), MAX_MARKDOWN_BYTES, requiredHeadings() (+24 more)

### Community 109 - "verify-shared-browser.ts"
Cohesion: 0.24
Nodes (7): checks, output, site, until(), viewer(), viewers, wait()

### Community 110 - "verify-conflict-ui.ts"
Cohesion: 0.25
Nodes (7): browser, dataDir, group, profile, room, token, ConflictGroup

### Community 113 - "verification.ts"
Cohesion: 0.23
Nodes (12): previewDocument(), assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript (+4 more)

### Community 120 - "product.md"
Cohesion: 0.11
Nodes (4): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02

### Community 126 - "browser.ts"
Cohesion: 0.16
Nodes (16): executable, sandbox, assertVerificationBrowserAvailable(), linuxBrowserFileBytes, linuxBrowserFileDescriptors, unavailable(), withIsolatedBrowser(), IsolationError (+8 more)

### Community 127 - "Beta setup and acceptance"
Cohesion: 0.22
Nodes (9): Beta setup and acceptance, Blender companion, Canvas, artifacts and documents, Current staging continuation and manual build credential, Generated application preview, Operator setup, Release and cleanup, Separate tester identities (+1 more)

### Community 131 - "scripts/blender-companion.ts"
Cohesion: 0.29
Nodes (5): args, controller, list(), option(), terminal

### Community 133 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 135 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 136 - "Interactive Blender — bounded change packet"
Cohesion: 0.22
Nodes (9): Agent-to-human recovery and operator gate packet — 2026-10-11, Artifacts interaction demonstration packet, Companion and Artifacts integration packet, Current accepted local boundary — 2026-10-11, Interactive Blender — bounded change packet, Linux display prerequisite implementation — continuation, Native gate result — 2026-10-11, Outcome and prerequisite gate (+1 more)

### Community 138 - "Step 10 - Cross-system integration and final harness review"
Cohesion: 0.33
Nodes (6): Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review

### Community 139 - "multiuser-step01-baseline.md"
Cohesion: 0.08
Nodes (23): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff, Checks and honest scope, Durability, uncertainty and compatibility, Files and decision (+15 more)

### Community 142 - "Generated frontend preview deployment — bounded change packet"
Cohesion: 0.25
Nodes (8): Allowed files and verification, Asset helper continuation packet, Authority and durable contract, Generated frontend preview deployment — bounded change packet, Implemented local contract, Local source evidence — 2026-10-11, Supported stack and scope, Verification and recovery

### Community 144 - "Beta access request change packet — 2026-10-09"
Cohesion: 0.29
Nodes (7): Beta access request change packet — 2026-10-09, Evidence and release status, Initial external configuration observations, Operations and manual acceptance, Outcome and bounded scope, Stage contracts and acceptance, Verified deployment — 2026-10-09

### Community 145 - "Private artifact cache and revocation — bounded change packet"
Cohesion: 0.29
Nodes (5): Outcome and evidence, Private artifact cache and revocation — bounded change packet, Scope and contracts, Verification and recovery, Verified boundary revision

### Community 146 - "check-staging-secrets.ts"
Cohesion: 0.52
Nodes (5): parseStagingSecrets(), readStagingSecrets(), assertPrivateHostedFixture(), serverSecrets(), fixture

### Community 148 - "ref_node_crypto"
Cohesion: 0.15
Nodes (10): dir, manager, observations, platform, project, root, betaAccounts, betaDatabase (+2 more)

### Community 150 - "Hosted beta release packet — 2026-10-11"
Cohesion: 0.18
Nodes (11): Current documentation sources, Designated account verification and recovery, Exact implementation verification and handoff, Hosted beta release packet — 2026-10-11, Outcome and scope, Platform review, migration compatibility and recovery, Read-only production observations, Readiness matrix (+3 more)

### Community 151 - "Full beta staging continuation — 2026-10-12"
Cohesion: 0.33
Nodes (6): Contracts and acceptance, Exact tested candidate and initial staging publication, Full beta staging continuation — 2026-10-12, Recovery and pending work, Subsequent authorized execution and failed cache proof — 2026-10-13, Verification and handoff — 2026-10-13

### Community 152 - "Staging preparation and secure login packet — 2026-10-12"
Cohesion: 0.33
Nodes (6): Current inspection and preparation result, Outcome and scope, Required behavior, Secure tester access, Staging preparation and secure login packet — 2026-10-12, Verification and remaining gates

### Community 154 - "token"
Cohesion: 0.67
Nodes (3): Transport and authentication, request(), token()

### Community 155 - "cocreate.test.ts"
Cohesion: 0.60
Nodes (3): validateSource(), keepLastSuccess(), shouldPromoteRevision()

### Community 157 - "Authorized hosted staging execution — 2026-10-13"
Cohesion: 0.50
Nodes (4): Authorized hosted staging execution — 2026-10-13, Bounded operations, Execution and checks, Recovery

## Knowledge Gaps
- **786 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+781 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1152 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **43 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 34 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 34 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _786 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.0644307982994804 - nodes in this community are weakly interconnected._
- **Why does `RoomManager` connect `RoomManager` to `tool-registry.ts`, `EventStore`, `blender-native-tests.ts`, `ai-presets.test.ts`, `canvas-artifacts.test.ts`, `fixtures/multiuser-baseline.ts`, `reliability.test.ts`, `workflow-budget.test.ts`, `index.ts`, `rooms.ts`, `ref_node_fs`, `registerProjectRoutes`, `ref_node_crypto`, `docs/harness/reliability-verification.md`, `types.ts`, `preview-routes.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.12631578947368421 - nodes in this community are weakly interconnected._
- **Why does `EventStore` connect `EventStore` to `RoomManager`, `tool-registry.ts`, `verify-harness-integration.ts`, `fixtures/multiuser-baseline.ts`, `.insert`, `reliability.test.ts`, `event-store.ts`, `rooms.ts`, `ref_node_fs`, `artifacts.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._