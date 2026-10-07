# Graph Report - Devoffice  (2026-10-08)

## Corpus Check
- 205 files · ~189,298 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 5, .css 5, .example 1)

## Summary
- 2078 nodes · 4951 edges · 113 communities (81 shown, 32 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 150 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dbd5cfc9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- README.md
- types.ts
- EventStore
- prisma/schema.prisma
- api.md
- isolation.ts
- requirements.ts
- beta-access.test.ts
- providers.ts
- rules
- ProjectApp.tsx
- event-store.ts
- verify-interpretation-topology.ts
- codebase-audit.ts
- verification.ts
- package.json
- ai-presets.ts
- instructions.md
- graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md
- dependencies
- index.ts
- compilerOptions
- ai-presets.test.ts
- workflow-budget.test.ts
- CoCreateProvider
- App.tsx
- local-drafts.test.ts
- live-collaboration-check.mjs
- OpenRouterLeases
- tool-registry.ts
- verify-reliability.ts
- yjs
- verify-harness-integration.ts
- verify-candidate-evidence.ts
- Pre-launch and private beta change packet
- reliability.test.ts
- AgentPanel.tsx
- project.ts
- supabase.ts
- generator.ts
- fixtures/multiuser-baseline.ts
- measure-responsiveness.ts
- IsolationRunner
- Step 06 handoff — stable progress under ongoing steering
- safeLocalDestination
- scripts
- verify-build-progress.ts
- rooms.ts
- main.tsx
- main
- Linux browser isolation: bounded alternative and platform questions
- 2guys1canvas harness implementation checklist
- harness/checklist.md
- .oxfmtrc.json
- ref_node_fs
- container.js
- devDependencies
- Step 08 - Durable workflow budget and accounting
- ref_node_assert
- Harness documentation cleanup — 2026-10-02
- supabase-platform.ts
- 24-pixel SVG favicon
- BuildAccounting.tsx
- oauth-callback.ts
- migrate-legacy-to-supabase.ts
- Harness architecture
- CoCreateContainer
- verify-intent-ui.ts
- 2guys1canvas context handoff
- 2guys1canvas product brief
- .mcp.json
- 2guys1canvas AI coding instructions
- artifact-restoration.test.ts
- 2guys1canvas
- verify-coordinator-postgres.ts
- Multi-user harness improvement prompts
- ByokSetup.tsx
- Step 05 handoff — attributable intent and contextual references
- Step 10 - Cross-system integration and final harness review
- Multi-user Step 03 handoff - 2026-10-03
- inspectSources
- Multi-user Step 07 handoff - 2026-10-04
- Multi-user Step 01 evidence and handoff
- cocreate.test.ts
- Steps 6–10 integration into main
- Step 09 - Conditional interpretation concurrency and topology evaluation

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 111 edges
2. `Room` - 74 edges
3. `createCoCreateServer()` - 62 edges
4. `SupabasePlatform` - 56 edges
5. `EventStore` - 54 edges
6. `2guys1canvas harness implementation checklist` - 40 edges
7. `registerProjectRoutes()` - 34 edges
8. `IsolationRunner` - 33 edges
9. `reconcileRequirements()` - 28 edges
10. `ArtifactUnavailableError` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Deploy on Cloudflare` --references--> `main()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/repository-readme.md → scripts/codebase-audit.ts
- `Actual runtime, verification and retained failures` --references--> `RoomManager`  [INFERRED]
  docs/harness/multiuser-step09-handoff.md → server/rooms.ts
- `BYOK-only MVP slice (2026-09-28)` --references--> `main()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/checklist.md → scripts/codebase-audit.ts
- `Cloudflare availability and collaboration repair evidence (2026-09-18)` --references--> `main()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/checklist.md → scripts/codebase-audit.ts
- `Historical workspace visual slice — 2026-09-28` --references--> `main()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/product.md → scripts/codebase-audit.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Participant-scoped durable submission safety** — api_canonical_saved_receipts, api_flush_ordering, api_retired_legacy_build, api_durable_submit, api_capture_order [EXTRACTED 1.00]
- **Verified cleanup preserves workflow authority** — docs_harness_codebase_cleanup_verification_scaffold_removal, docs_harness_codebase_cleanup_verification_shared_extraction, docs_harness_architecture_durable_workflow, docs_harness_codebase_cleanup_verification_local_cleanup_checks [EXTRACTED 1.00]
- **October durable reliability contract** — docs_harness_reliability_verification_ordered_recovery, docs_harness_reliability_verification_ordered_submission_recovery, docs_harness_architecture_canonical_save_receipts, docs_harness_architecture_coordinator_fencing [EXTRACTED 1.00]
- **Feature edit authority and import boundaries** — instructions_feature_packet, instructions_shared_boundary, instructions_source_ownership, instructions_jev_advisory [EXTRACTED 1.00]
- **Collaborative submission-to-promoted-artifact flow** — product_core_loop, product_capture_order, product_durable_receipts, product_bounded_recovery [EXTRACTED 1.00]

## Communities (113 total, 32 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.08
Nodes (31): Submission scheduling: current implementation and required hardening, Later-step source audit, calculateCharge(), catalogRate(), effortAllowance(), AIConfig, listProviderModels(), createCoCreateServer() (+23 more)

### Community 2 - "types.ts"
Cohesion: 0.07
Nodes (32): Named AI connections (preferred API), Shared response models, generic, normalize(), sourceWords(), validateSubmittedInterpretation(), AgentStatus, AIModel (+24 more)

### Community 3 - "EventStore"
Cohesion: 0.10
Nodes (4): EventStore, WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 5 - "api.md"
Cohesion: 0.06
Nodes (14): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+6 more)

### Community 7 - "isolation.ts"
Cohesion: 0.07
Nodes (37): Acceptance evidence and handoff, Blocked deployment repair packet — 2026-10-08, Current execution status, Custom-domain private beta release packet, Linux verification follow-up — 2026-10-08, Outcome and bounded scope, Prepared changes and compatibility, Verification, execution and recovery plan (+29 more)

### Community 8 - "requirements.ts"
Cohesion: 0.09
Nodes (40): buildProgressFor(), acceptanceFor(), acceptedClassification(), acceptedRequirementFingerprint(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries() (+32 more)

### Community 9 - "beta-access.test.ts"
Cohesion: 0.13
Nodes (14): approved, browser, checks, chrome, directory, local, output, platform (+6 more)

### Community 10 - "providers.ts"
Cohesion: 0.09
Nodes (27): accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek, ensure() (+19 more)

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
Cohesion: 0.13
Nodes (12): typescript, ImportReference, Inventory, JEV_INPUT_USD_PER_MILLION, JEV_MODEL, requestReview(), ReviewAnswer, reviewService() (+4 more)

### Community 17 - "verification.ts"
Cohesion: 0.23
Nodes (12): previewDocument(), assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript (+4 more)

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (26): engines, node, name, packageManager, private, type, version, cross-env (+18 more)

### Community 20 - "ai-presets.ts"
Cohesion: 0.05
Nodes (45): [command,file], aggregateCalls(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, CatalogEntry, classifyTaskComplexity() (+37 more)

### Community 22 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.17
Nodes (4): TypeSafe state/questions API cited in pilot plan, TypeSafe coding-agent guidance cited in cleanup plan, TypeSafe confidence guidance cited in pilot plan, TypeSafe pricing cited in October 3 estimates

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "index.ts"
Cohesion: 0.10
Nodes (23): ws, browser, dataDir, group, profile, room, token, b64() (+15 more)

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "ai-presets.test.ts"
Cohesion: 0.33
Nodes (7): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), passed

### Community 28 - "workflow-budget.test.ts"
Cohesion: 0.34
Nodes (9): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), ProviderRequestRecord (+1 more)

### Community 30 - "App.tsx"
Cohesion: 0.11
Nodes (26): Reference-led presentation update (2026-09-30), @tiptap/extension-collaboration, @tiptap/react, BuildProgress, Participant, WorkflowStatus, App(), FormatChoice (+18 more)

### Community 31 - "local-drafts.test.ts"
Cohesion: 0.20
Nodes (7): browserDraftStore, draftKey(), DraftStore, LocalDraftStatus, persistDraft(), restoreDraft(), merge()

### Community 32 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 33 - "OpenRouterLeases"
Cohesion: 0.22
Nodes (6): BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases

### Community 34 - "tool-registry.ts"
Cohesion: 0.15
Nodes (12): definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior, ToolContext, ToolDefinition (+4 more)

### Community 36 - "verify-reliability.ts"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, open(), output, providerAddress, room (+2 more)

### Community 37 - "yjs"
Cohesion: 0.18
Nodes (7): yjs, deletionSignature(), ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), FakeWebSocket

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.11
Nodes (19): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+11 more)

### Community 39 - "verify-candidate-evidence.ts"
Cohesion: 0.13
Nodes (17): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+9 more)

### Community 40 - "Pre-launch and private beta change packet"
Cohesion: 0.50
Nodes (4): Exact owner and approval process, Pre-launch and private beta change packet, Release prerequisites and rollback, Verification and handoff

### Community 41 - "reliability.test.ts"
Cohesion: 0.11
Nodes (11): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, CoordinatorUnavailableError, RemoteCoordinator (+3 more)

### Community 42 - "AgentPanel.tsx"
Cohesion: 0.16
Nodes (15): AIEffort, AIResolvedLayer, dollars(), rateSummary(), effortChoices, api(), tokenRole(), Product() (+7 more)

### Community 43 - "project.ts"
Cohesion: 0.17
Nodes (14): allowedExtensions, downloadableFiles(), FileOperation, generatedRoot, infrastructureFiles, loadProject(), persistProject(), ProjectFile (+6 more)

### Community 44 - "supabase.ts"
Cohesion: 0.18
Nodes (12): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution, authReturnKey, resolved (+4 more)

### Community 45 - "generator.ts"
Cohesion: 0.09
Nodes (39): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, clean(), demoExtract(), AgentChange, boundedInput() (+31 more)

### Community 47 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.18
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 48 - "measure-responsiveness.ts"
Cohesion: 0.24
Nodes (4): median(), run(), Sample, wait()

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (9): BASIC_ACCOUNTING, BASIC_LIMIT, EXTENDED_LIMIT, IO_COUNTERS, IsolationRunner, PROCESS_INFORMATION, SECURITY_CAPABILITIES, STARTUPINFO (+1 more)

### Community 50 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 51 - "safeLocalDestination"
Cohesion: 0.26
Nodes (16): safeLocalDestination(), AcceptInvite(), AuthLinks(), authMessage(), AuthShell(), BetaAccess(), clearProjectSessionCache(), ConfigurationError() (+8 more)

### Community 52 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, audit:code, build, check:boundaries, deploy:cloudflare, dev, migrate:legacy, start (+1 more)

### Community 53 - "verify-build-progress.ts"
Cohesion: 0.15
Nodes (15): address, Browser, browsers, candidates, converge(), dataDir, fake, gates (+7 more)

### Community 54 - "rooms.ts"
Cohesion: 0.09
Nodes (31): ArchivedVersion, AcceptedIntentContext, applyIntentCommand(), categories, fail(), intentCommandHash(), parseIntentCommand(), AISettings (+23 more)

### Community 55 - "main.tsx"
Cohesion: 0.15
Nodes (9): react, react-dom, CanvasExample(), LandingPage(), questions, App, LandingPage, ProjectApp (+1 more)

### Community 56 - "main"
Cohesion: 0.38
Nodes (7): BYOK-only MVP slice (2026-09-28), Historical workspace visual slice — 2026-09-28, cachedReview(), inputCost(), main(), reviewQuestions(), validateReview()

### Community 57 - "Linux browser isolation: bounded alternative and platform questions"
Cohesion: 0.40
Nodes (5): Conditional same-host alternative, Evidence and smallest next action, If delegation is unavailable, Linux browser isolation: bounded alternative and platform questions, Release and recovery

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (38): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27, Draggable effort toggle and visible project naming (2026-09-25), Email invitations, complete auth, project names, and segmented effort (2026-09-25) (+30 more)

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "ref_node_fs"
Cohesion: 0.07
Nodes (24): browser, output, profile, browser, outputDir, profile, browser, outputDir (+16 more)

### Community 64 - "container.js"
Cohesion: 0.28
Nodes (6): Collaboration connection lifecycle, Cloudflare availability and collaboration repair evidence (2026-09-18), @cloudflare/containers, baseEnv, fetch(), legacyOriginResponse()

### Community 65 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 66 - "Step 08 - Durable workflow budget and accounting"
Cohesion: 0.40
Nodes (5): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures

### Community 67 - "ref_node_assert"
Cohesion: 0.11
Nodes (3): projectSchema, pause(), waitFor()

### Community 68 - "Harness documentation cleanup — 2026-10-02"
Cohesion: 0.50
Nodes (4): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02

### Community 69 - "supabase-platform.ts"
Cohesion: 0.05
Nodes (57): express, ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, artifactResponse(), ArtifactUnavailableError, ArtifactVersion (+49 more)

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "BuildAccounting.tsx"
Cohesion: 0.31
Nodes (9): Bounded context and cost target, AIRunRecord, NormalizedAIUsage, VerificationSummary(), BuildAccounting(), comparableMetrics(), runKey(), tokenCount() (+1 more)

### Community 72 - "oauth-callback.ts"
Cohesion: 0.50
Nodes (3): completeOAuthCallback(), OAuthCallbackOutcome, Callback()

### Community 73 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.12
Nodes (12): dotenv, prisma, @supabase/supabase-js, apply, args, backup, client, dataArg (+4 more)

### Community 74 - "Harness architecture"
Cohesion: 0.09
Nodes (24): Rooms and sessions, 2guys1canvas presentation and invitation boundary (2026-09-30), Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Browser recovery and transport batching — 2026-09-28, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary (+16 more)

### Community 76 - "verify-intent-ui.ts"
Cohesion: 0.11
Nodes (16): Transport and authentication, Browser, browsers, dataDir, fake, inputs, open(), output (+8 more)

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.11
Nodes (19): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+11 more)

### Community 90 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 91 - "artifact-restoration.test.ts"
Cohesion: 0.17
Nodes (10): dir, manager, observations, platform, project, buildFixture(), files, manager() (+2 more)

### Community 92 - "2guys1canvas"
Cohesion: 0.13
Nodes (15): 2guys1canvas, Active hosted MVP: OpenRouter BYOK, AI steering documents, Architecture, Checks, Connect AI, Current boundaries, Current product setup (2026-09-30) (+7 more)

### Community 93 - "verify-coordinator-postgres.ts"
Cohesion: 0.13
Nodes (11): pg, a, admin, b, checks, ownerA, ownerB, project (+3 more)

### Community 94 - "Multi-user harness improvement prompts"
Cohesion: 0.15
Nodes (13): Common contract, Multi-user harness improvement prompts, Starting instruction, Step 01 - Audit, scenarios and baseline, Step 02 - Coordinator fencing and owner routing, Step 03 - Artifact persistence and restoration, Step 04 - Generated execution isolation, Step 05 - Intent inspection, correction and contextual references (+5 more)

### Community 95 - "ByokSetup.tsx"
Cohesion: 0.29
Nodes (5): lucide-react, AIConnection, ByokSetup(), Lease, request()

### Community 97 - "Step 05 handoff — attributable intent and contextual references"
Cohesion: 0.33
Nodes (6): Checks and honest scope, Durability, uncertainty and compatibility, Files and decision, Outcome and reproduced boundary, Step 05 handoff — attributable intent and contextual references, Unrun release dependencies and next step

### Community 98 - "Step 10 - Cross-system integration and final harness review"
Cohesion: 0.33
Nodes (6): Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review

### Community 99 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 100 - "inspectSources"
Cohesion: 0.53
Nodes (6): inspectSources(), add(), reachable(), resolve(), visit(), posix()

### Community 101 - "Multi-user Step 07 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Checks and retained attempts, Deliberately bounded coverage, Files, decision and handoff, Isolation and operator setup, Multi-user Step 07 handoff - 2026-10-04, Outcome and boundary

### Community 102 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.40
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 104 - "cocreate.test.ts"
Cohesion: 0.20
Nodes (10): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites, validateSource(), keepLastSuccess() (+2 more)

### Community 110 - "Steps 6–10 integration into main"
Cohesion: 0.50
Nodes (4): Fresh verification, Operational boundaries, Resolution and preserved contracts, Steps 6–10 integration into main

### Community 118 - "Step 09 - Conditional interpretation concurrency and topology evaluation"
Cohesion: 0.40
Nodes (5): Actual runtime, verification and retained failures, Controlled comparison, Files, rollout and next work, Outcome and responsible boundary, Step 09 - Conditional interpretation concurrency and topology evaluation

## Knowledge Gaps
- **602 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+597 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 906 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `RoomManager` connect `RoomManager` to `types.ts`, `EventStore`, `tool-registry.ts`, `supabase-platform.ts`, `ref_node_assert`, `requirements.ts`, `reliability.test.ts`, `fixtures/multiuser-baseline.ts`, `rooms.ts`, `Step 09 - Conditional interpretation concurrency and topology evaluation`, `index.ts`, `ai-presets.test.ts`, `artifact-restoration.test.ts`, `workflow-budget.test.ts`, `ref_node_fs`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Are the 33 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 33 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _602 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.07793820835274026 - nodes in this community are weakly interconnected._
- **Why does `2guys1canvas harness implementation checklist` connect `2guys1canvas harness implementation checklist` to `main`, `container.js`, `harness/checklist.md`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Why does `yjs` connect `yjs` to `live-collaboration-check.mjs`, `ref_node_assert`, `supabase-platform.ts`, `cocreate.test.ts`, `reliability.test.ts`, `requirements.ts`, `fixtures/multiuser-baseline.ts`, `measure-responsiveness.ts`, `package.json`, `rooms.ts`, `index.ts`, `artifact-restoration.test.ts`, `App.tsx`, `local-drafts.test.ts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._