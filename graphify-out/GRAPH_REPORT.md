# Graph Report - beta-registration-fix  (2026-10-16)

## Corpus Check
- 243 files · ~227,307 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 6, .css 6, .example 1)

## Summary
- 2282 nodes · 5421 edges · 129 communities (93 shown, 36 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 166 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8ccb41b0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- README.md
- types.ts
- EventStore
- prisma/schema.prisma
- isolation.ts
- requirements.ts
- index.ts
- providers.ts
- rules
- ProjectApp.tsx
- event-store.ts
- verify-interpretation-topology.ts
- docs/harness/codebase-cleanup-verification.md
- codebase-audit.ts
- Multi-user Step 04 handoff - 2026-10-04
- package.json
- ai-presets.ts
- instructions.md
- verify-workflow-overview.ts
- dependencies
- ref_node_fs
- compilerOptions
- graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md
- context.md
- rooms.ts
- supabase-platform.ts
- supabase.ts
- .buildLoop
- live-collaboration-check.mjs
- managed-ai.test.ts
- .runAgent
- .tracked
- provider-reconnect.test.ts
- verify-harness-integration.ts
- AgentPanel.tsx
- prelaunch-release-repair.md
- CoordinatorUnavailableError
- verify-intent-ui.ts
- project.ts
- .ensureWorkflow
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
- verify-reliability.ts
- verify-candidate-evidence.ts
- 2guys1canvas harness implementation checklist
- harness/checklist.md
- .oxfmtrc.json
- verify-prelaunch-beta.ts
- verify-canvas-surface.ts
- devDependencies
- Step 08 - Durable workflow budget and accounting
- 2guys1canvas API reference
- dotenv
- Step 06 handoff — stable progress under ongoing steering
- 24-pixel SVG favicon
- measure-responsiveness.ts
- reliability.test.ts
- Steps 6–10 integration into main
- Harness architecture
- tool-registry.ts
- browser.ts
- 2guys1canvas context handoff
- 2guys1canvas product brief
- Step 09 - Conditional interpretation concurrency and topology evaluation
- compiler-worker.cjs
- .mcp.json
- safeLocalDestination
- BuildAccounting.tsx
- 2guys1canvas AI coding instructions
- token
- 2guys1canvas
- verify-coordinator-postgres.ts
- Multi-user harness improvement prompts
- WorkflowBoard.tsx
- founder-contacts.md
- Step 10 - Cross-system integration and final harness review
- Multi-user Step 03 handoff - 2026-10-03
- IntentReview.tsx
- Multi-user Step 01 evidence and handoff
- Multi-user Step 07 handoff - 2026-10-04
- .handleMessage
- intent-authority.ts
- intent-commands.ts
- ByokSetup.tsx
- workflow-overview.md
- landing-editorial.md
- Harness documentation cleanup — 2026-10-02
- submit-changes.test.ts
- woven-c-brand.md
- Build my changes recovery
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
10. `graphify-out/SOURCE_MAP.md` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Outcome and responsible boundary` --references--> `bundleProject()`  [INFERRED]
  docs/harness/multiuser-step04-handoff.md → server/project.ts
- `Actual runtime, verification and retained failures` --references--> `RoomManager`  [INFERRED]
  docs/harness/multiuser-step09-handoff.md → server/rooms.ts
- `Rooms and sessions` --references--> `RoomView`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/api.md → shared/types.ts
- `Reference-led presentation update (2026-09-30)` --references--> `Workspace()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → src/App.tsx
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

## Communities (129 total, 36 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.15
Nodes (10): Submission scheduling: current implementation and required hardening, Later-step source audit, createCoCreateServer(), acceptedContext(), contradictionsFromConflictGroups(), Room, now(), retainSubmissions() (+2 more)

### Community 2 - "types.ts"
Cohesion: 0.09
Nodes (24): Shared response models, aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes, AgentStatus, AIRateTier, AIRoutingEvidenceStatus (+16 more)

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 7 - "isolation.ts"
Cohesion: 0.15
Nodes (20): Linux verification follow-up — 2026-10-08, assertIsolationAvailable(), cancelled(), compileIsolated(), Dependency, hostEnvironment(), IsolatedRequest, IsolationOptions (+12 more)

### Community 8 - "requirements.ts"
Cohesion: 0.11
Nodes (34): acceptanceFor(), acceptedClassification(), acceptedRequirements(), alternativeSignature(), candidateEntries(), categories, classifications, classifyIntentText() (+26 more)

### Community 9 - "index.ts"
Cohesion: 0.08
Nodes (16): ws, yjs, b64(), createSession(), participantId(), roomToken(), Session, verifySession() (+8 more)

### Community 10 - "providers.ts"
Cohesion: 0.07
Nodes (35): boundedInput(), accounting, adapterFor(), adapters, anthropic, balancedObject(), bearer(), classify() (+27 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.14
Nodes (20): needsSessionRefresh(), clearProjectSessionCache(), CreateProjectDialog(), InviteResult, Modal(), PendingInvite, Project, ProjectGroup() (+12 more)

### Community 13 - "event-store.ts"
Cohesion: 0.14
Nodes (11): EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow, taskTransitions (+3 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.09
Nodes (28): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+20 more)

### Community 15 - "docs/harness/codebase-cleanup-verification.md"
Cohesion: 0.07
Nodes (9): apply, args, backup, client, dataArg, dataDir, mapping, mappingArg (+1 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.12
Nodes (23): typescript, cachedReview(), ImportReference, inputCost(), inspectSources(), add(), reachable(), resolve() (+15 more)

### Community 17 - "Multi-user Step 04 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (27): engines, node, name, packageManager, private, type, version, cross-env (+19 more)

### Community 20 - "ai-presets.ts"
Cohesion: 0.06
Nodes (41): Named AI connections (preferred API), aggregateCalls(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, EVALUATION_PROTOCOL_VERSION, EvaluationSummary (+33 more)

### Community 22 - "verify-workflow-overview.ts"
Cohesion: 0.10
Nodes (16): browser, dataDir, group, profile, room, token, browser, checks (+8 more)

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "ref_node_fs"
Cohesion: 0.05
Nodes (34): WebSocket collaboration, browser, output, profile, browser, outputDir, profile, browser (+26 more)

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.16
Nodes (4): TypeSafe state/questions API cited in pilot plan, TypeSafe coding-agent guidance cited in cleanup plan, TypeSafe confidence guidance cited in pilot plan, TypeSafe pricing cited in October 3 estimates

### Community 27 - "context.md"
Cohesion: 0.11
Nodes (4): authenticatedDelta(), kindOf(), requirementFingerprint(), ChangeKind

### Community 28 - "rooms.ts"
Cohesion: 0.09
Nodes (27): calculateCharge(), catalogRate(), workflowInstruction(), ArchivedVersion, AIConfig, keepLastSuccess(), shouldPromoteRevision(), ProjectSpec (+19 more)

### Community 29 - "supabase-platform.ts"
Cohesion: 0.05
Nodes (58): express, ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, artifactResponse(), ArtifactUnavailableError, ArtifactVersion (+50 more)

### Community 30 - "supabase.ts"
Cohesion: 0.15
Nodes (14): @supabase/supabase-js, legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution, authReturnKey (+6 more)

### Community 31 - ".buildLoop"
Cohesion: 0.17
Nodes (17): buildProgressFor(), previewDocument(), acceptedRequirementFingerprint(), blockedRequirementIds(), eligibleRequirements(), buildFingerprint(), assertPromotionEvidence(), candidateHash() (+9 more)

### Community 32 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 33 - "managed-ai.test.ts"
Cohesion: 0.10
Nodes (20): [command,file], BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases, MANAGED_CATALOG_SOURCE (+12 more)

### Community 34 - ".runAgent"
Cohesion: 0.17
Nodes (7): hasOpenContradictions(), EditRecord, StoredSubmission, emptyUsage(), documentText(), setup(), fixture()

### Community 35 - ".tracked"
Cohesion: 0.28
Nodes (5): listProviderModels(), AIFormat, AIProvider, createProgressFixture(), connectFixture()

### Community 37 - "provider-reconnect.test.ts"
Cohesion: 0.12
Nodes (8): y-protocols, deletionSignature(), CoCreateProvider, ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), FakeWebSocket

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.11
Nodes (19): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+11 more)

### Community 39 - "AgentPanel.tsx"
Cohesion: 0.14
Nodes (18): Canvas writing surface, Evidence and contracts, Local evidence, Requested outcome and boundaries, Verification plan, lucide-react, AIResolvedLayer, Participant (+10 more)

### Community 40 - "prelaunch-release-repair.md"
Cohesion: 0.13
Nodes (13): Exact owner and approval process, Pre-launch and private beta change packet, Release prerequisites and rollback, Verification and handoff, Conditional same-host alternative, Evidence and smallest next action, If delegation is unavailable, Linux browser isolation: bounded alternative and platform questions (+5 more)

### Community 41 - "CoordinatorUnavailableError"
Cohesion: 0.17
Nodes (8): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, CoordinatorUnavailableError, RemoteCoordinator

### Community 42 - "verify-intent-ui.ts"
Cohesion: 0.13
Nodes (13): Browser, browsers, dataDir, fake, inputs, open(), output, providerAddress (+5 more)

### Community 43 - "project.ts"
Cohesion: 0.10
Nodes (22): dir, manager, observations, platform, project, allowedExtensions, applyOperations(), bundleProject() (+14 more)

### Community 44 - ".ensureWorkflow"
Cohesion: 0.23
Nodes (3): WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 45 - "generator.ts"
Cohesion: 0.09
Nodes (30): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, callOpenAI(), classification, compactSharedRequirement(), compactText() (+22 more)

### Community 46 - "container.js"
Cohesion: 0.21
Nodes (6): @cloudflare/containers, baseEnv, CoCreateContainer, fetch(), scheduled(), legacyOriginResponse()

### Community 47 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.18
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 48 - "beta-requests.ts"
Cohesion: 0.07
Nodes (37): Beta access request change packet — 2026-10-09, Evidence and release status, Initial external configuration observations, Operations and manual acceptance, Outcome and bounded scope, Stage contracts and acceptance, Verified deployment — 2026-10-09, Beta registration visibility — 2026-10-16 (+29 more)

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
Nodes (28): App(), FormatChoice, Join(), People(), Product(), ProviderChoice, providerPresets, statusCopy (+20 more)

### Community 55 - "main.tsx"
Cohesion: 0.14
Nodes (12): react-dom, BrandMark(), ArtifactTab, artifactTabs, DemoTab, demoTabs, LandingPage(), moveTab() (+4 more)

### Community 56 - "workflow-budget.test.ts"
Cohesion: 0.34
Nodes (9): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), ProviderRequestRecord (+1 more)

### Community 57 - "verify-reliability.ts"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, open(), output, providerAddress, room (+2 more)

### Community 58 - "verify-candidate-evidence.ts"
Cohesion: 0.13
Nodes (17): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+9 more)

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (40): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+32 more)

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "verify-prelaunch-beta.ts"
Cohesion: 0.14
Nodes (13): approved, browser, checks, chrome, directory, local, output, platform (+5 more)

### Community 64 - "verify-canvas-surface.ts"
Cohesion: 0.20
Nodes (9): browser, checks, errors, output, room, runtime, sockets, until() (+1 more)

### Community 65 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 66 - "Step 08 - Durable workflow budget and accounting"
Cohesion: 0.40
Nodes (5): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures

### Community 67 - "2guys1canvas API reference"
Cohesion: 0.15
Nodes (13): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+5 more)

### Community 69 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "measure-responsiveness.ts"
Cohesion: 0.47
Nodes (4): median(), run(), Sample, wait()

### Community 72 - "reliability.test.ts"
Cohesion: 0.22
Nodes (3): applySteeringUpdate(), plainText(), edit()

### Community 73 - "Steps 6–10 integration into main"
Cohesion: 0.40
Nodes (4): Fresh verification, Operational boundaries, Resolution and preserved contracts, Steps 6–10 integration into main

### Community 74 - "Harness architecture"
Cohesion: 0.09
Nodes (24): 2guys1canvas presentation and invitation boundary (2026-09-30), Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary (+16 more)

### Community 75 - "tool-registry.ts"
Cohesion: 0.13
Nodes (14): ActorType, FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior (+6 more)

### Community 76 - "browser.ts"
Cohesion: 0.12
Nodes (18): assertVerificationBrowserAvailable(), browserExecutable(), BrowserProtocol, linuxBrowserFileBytes, linuxBrowserFileDescriptors, unavailable(), withIsolatedBrowser(), IsolationError (+10 more)

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 79 - "Step 09 - Conditional interpretation concurrency and topology evaluation"
Cohesion: 0.40
Nodes (5): Actual runtime, verification and retained failures, Controlled comparison, Files, rollout and next work, Outcome and responsible boundary, Step 09 - Conditional interpretation concurrency and topology evaluation

### Community 82 - "safeLocalDestination"
Cohesion: 0.21
Nodes (18): safeLocalDestination(), completeOAuthCallback(), OAuthCallbackOutcome, AcceptInvite(), AuthLinks(), authMessage(), AuthShell(), BetaAccess() (+10 more)

### Community 85 - "BuildAccounting.tsx"
Cohesion: 0.26
Nodes (8): Bounded context and cost target, AIRunRecord, BuildProgress, BuildAccounting(), comparableMetrics(), runKey(), tokenCount(), UsageSummary()

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
Cohesion: 0.15
Nodes (17): tokenRole(), IntentReview(), date(), number(), statuses, UsageChart(), WorkflowBoard(), empty() (+9 more)

### Community 97 - "founder-contacts.md"
Cohesion: 0.20
Nodes (8): Approved scope, Founder contacts in the public footer, Local verification, Verification plan, Local evidence and review handoff, Navigation and verification plan, Public entry cleanup, Requested outcome and boundaries

### Community 98 - "Step 10 - Cross-system integration and final harness review"
Cohesion: 0.33
Nodes (6): Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review

### Community 99 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 101 - "IntentReview.tsx"
Cohesion: 0.22
Nodes (7): react, IntentCommand, IntentCommandResult, IntentTarget, InterpretationIntentCategory, caption(), Edit

### Community 102 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.40
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 109 - "Multi-user Step 07 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Checks and retained attempts, Deliberately bounded coverage, Files, decision and handoff, Isolation and operator setup, Multi-user Step 07 handoff - 2026-10-04, Outcome and boundary

### Community 115 - "intent-authority.ts"
Cohesion: 0.36
Nodes (7): AcceptedIntentContext, generic, normalize(), sourceWords(), validateSubmittedInterpretation(), InterpretationIntent, Requirement

### Community 116 - "intent-commands.ts"
Cohesion: 0.32
Nodes (7): applyIntentCommand(), categories, fail(), intentCommandHash(), parseIntentCommand(), IntentCorrection, SharedRequirementSource

### Community 117 - "ByokSetup.tsx"
Cohesion: 0.33
Nodes (4): AIConnection, ByokSetup(), Lease, request()

### Community 118 - "workflow-overview.md"
Cohesion: 0.29
Nodes (6): Evidence and contracts, Implementation evidence, Outcome and scope, Verification and recovery, Workflow-only main integration — 2026-10-15, Workflow Overview change packet

### Community 119 - "landing-editorial.md"
Cohesion: 0.33
Nodes (5): Approved pre-launch landing redesign, Bounded scope, Contracts to preserve, Outcome and authority, Verification and release

### Community 120 - "Harness documentation cleanup — 2026-10-02"
Cohesion: 0.50
Nodes (4): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02

### Community 121 - "submit-changes.test.ts"
Cohesion: 0.40
Nodes (3): SubmissionOptions, SubmissionResult, submitDraftChanges()

### Community 123 - "woven-c-brand.md"
Cohesion: 0.40
Nodes (4): Approval and scope, Evidence and contracts, Verification and publication, Woven C brand integration

### Community 124 - "Build my changes recovery"
Cohesion: 0.50
Nodes (4): Build my changes recovery, Change packet — 2026-10-16, Implementation and evidence, Publication and remaining acceptance

## Knowledge Gaps
- **679 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+674 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1001 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `RoomManager` connect `RoomManager` to `managed-ai.test.ts`, `types.ts`, `EventStore`, `.tracked`, `.runAgent`, `reliability.test.ts`, `index.ts`, `project.ts`, `tool-registry.ts`, `Step 09 - Conditional interpretation concurrency and topology evaluation`, `fixtures/multiuser-baseline.ts`, `.handleMessage`, `ai-presets.ts`, `ref_node_fs`, `workflow-budget.test.ts`, `rooms.ts`, `supabase-platform.ts`, `.buildLoop`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Are the 33 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 33 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _679 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Why does `2guys1canvas harness implementation checklist` connect `2guys1canvas harness implementation checklist` to `harness/checklist.md`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0873015873015873 - nodes in this community are weakly interconnected._
- **Why does `yjs` connect `index.ts` to `live-collaboration-check.mjs`, `provider-reconnect.test.ts`, `measure-responsiveness.ts`, `reliability.test.ts`, `project.ts`, `fixtures/multiuser-baseline.ts`, `package.json`, `App.tsx`, `context.md`, `rooms.ts`, `supabase-platform.ts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._