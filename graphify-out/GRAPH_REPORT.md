# Graph Report - Devoffice  (2026-10-07)

## Corpus Check
- 201 files · ~182,539 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 5, .css 5, .example 1)

## Summary
- 2058 nodes · 4914 edges · 113 communities (82 shown, 31 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 147 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ee014a14`
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
- ref_node_crypto
- providers.ts
- rules
- ProjectApp.tsx
- event-store.ts
- verify-interpretation-topology.ts
- codebase-audit.ts
- intent-corrections.test.ts
- package.json
- ai-presets.ts
- instructions.md
- graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md
- dependencies
- index.ts
- compilerOptions
- .ensureWorkflow
- verification.ts
- IntentReview.tsx
- App.tsx
- local-drafts.test.ts
- live-collaboration-check.mjs
- OpenRouterLeases
- devDependencies
- product.md
- verify-reliability.ts
- CoCreateProvider
- verify-harness-integration.ts
- verify-candidate-evidence.ts
- build-shortcut.ts
- reliability.test.ts
- AgentPanel.tsx
- ai-presets.test.ts
- generator.ts
- fixtures/multiuser-baseline.ts
- measure-responsiveness.ts
- IsolationRunner
- Multi-user Step 07 handoff - 2026-10-04
- tool-registry.ts
- scripts
- verify-build-progress.ts
- workflow-budget.test.ts
- main.tsx
- live-browser-collaboration-check.mjs
- verify-artifact-growth.ts
- rooms.ts
- 2guys1canvas harness implementation checklist
- harness/checklist.md
- .oxfmtrc.json
- ref_node_fs
- container.js
- browser.ts
- Step 09 - Conditional interpretation concurrency and topology evaluation
- ref_node_assert
- supabase-platform.ts
- 24-pixel SVG favicon
- BuildAccounting.tsx
- providers.test.ts
- Harness architecture
- Steps 6–10 integration into main
- verify-intent-ui.ts
- 2guys1canvas context handoff
- 2guys1canvas product brief
- .mcp.json
- Step 05 handoff — attributable intent and contextual references
- Step 06 handoff — stable progress under ongoing steering
- 2guys1canvas AI coding instructions
- artifacts.ts
- 2guys1canvas
- verify-coordinator-postgres.ts
- Multi-user harness improvement prompts
- migrate-legacy-to-supabase.ts
- dotenv
- Step 10 - Cross-system integration and final harness review
- Multi-user Step 03 handoff - 2026-10-03
- inspectSources
- Multi-user Step 01 evidence and handoff
- Step 08 - Durable workflow budget and accounting
- Multi-user Step 04 handoff - 2026-10-04
- Pre-launch and private beta change packet
- generated-isolation.test.ts

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
- `Outcome and responsible boundary` --references--> `bundleProject()`  [INFERRED]
  docs/harness/multiuser-step04-handoff.md → server/project.ts
- `Actual runtime, verification and retained failures` --references--> `RoomManager`  [INFERRED]
  docs/harness/multiuser-step09-handoff.md → server/rooms.ts
- `Bounded context and cost target` --references--> `AIRunRecord`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → shared/types.ts
- `BYOK-only MVP slice (2026-09-28)` --references--> `main()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/checklist.md → scripts/codebase-audit.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Participant-scoped durable submission safety** — api_canonical_saved_receipts, api_flush_ordering, api_retired_legacy_build, api_durable_submit, api_capture_order [EXTRACTED 1.00]
- **Verified cleanup preserves workflow authority** — docs_harness_codebase_cleanup_verification_scaffold_removal, docs_harness_codebase_cleanup_verification_shared_extraction, docs_harness_architecture_durable_workflow, docs_harness_codebase_cleanup_verification_local_cleanup_checks [EXTRACTED 1.00]
- **October durable reliability contract** — docs_harness_reliability_verification_ordered_recovery, docs_harness_reliability_verification_ordered_submission_recovery, docs_harness_architecture_canonical_save_receipts, docs_harness_architecture_coordinator_fencing [EXTRACTED 1.00]
- **Feature edit authority and import boundaries** — instructions_feature_packet, instructions_shared_boundary, instructions_source_ownership, instructions_jev_advisory [EXTRACTED 1.00]
- **Collaborative submission-to-promoted-artifact flow** — product_core_loop, product_capture_order, product_durable_receipts, product_bounded_recovery [EXTRACTED 1.00]

## Communities (113 total, 31 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.08
Nodes (27): Submission scheduling: current implementation and required hardening, Later-step source audit, effortAllowance(), AIConfig, createCoCreateServer(), acceptedContext(), contradictionsFromConflictGroups(), hasOpenContradictions() (+19 more)

### Community 2 - "types.ts"
Cohesion: 0.08
Nodes (34): Named AI connections (preferred API), Shared response models, aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup, VERIFICATION_POLICY_VERSION, AgentStatus (+26 more)

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 5 - "api.md"
Cohesion: 0.06
Nodes (14): [command,file], MANAGED_CATALOG_SOURCE, MANAGED_CATALOG_VERSION, MANAGED_DEFAULT_BUILDER, MANAGED_INTERPRETER_CANDIDATES, managedBuilder(), managedCatalog, ManagedCatalogEntry (+6 more)

### Community 7 - "isolation.ts"
Cohesion: 0.22
Nodes (16): assertIsolationAvailable(), cancelled(), compileIsolated(), Dependency, hostEnvironment(), IsolatedRequest, isolationPolicy, linuxCommand() (+8 more)

### Community 8 - "requirements.ts"
Cohesion: 0.10
Nodes (37): buildProgressFor(), acceptanceFor(), acceptedClassification(), acceptedRequirementFingerprint(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries() (+29 more)

### Community 9 - "ref_node_crypto"
Cohesion: 0.13
Nodes (13): approved, browser, checks, chrome, directory, local, output, platform (+5 more)

### Community 10 - "providers.ts"
Cohesion: 0.08
Nodes (29): accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek, ensure() (+21 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.07
Nodes (51): @supabase/supabase-js, legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), safeLocalDestination(), SupabaseAuthConfig, SupabaseAuthResolution (+43 more)

### Community 13 - "event-store.ts"
Cohesion: 0.14
Nodes (11): EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow, taskTransitions (+3 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.10
Nodes (23): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+15 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.13
Nodes (19): BYOK-only MVP slice (2026-09-28), Historical workspace visual slice — 2026-09-28, typescript, cachedReview(), ImportReference, inputCost(), Inventory, JEV_INPUT_USD_PER_MILLION (+11 more)

### Community 17 - "intent-corrections.test.ts"
Cohesion: 0.15
Nodes (16): clean(), demoExtract(), AgentChange, generic, normalize(), sourceWords(), validateSubmittedInterpretation(), applyIntentCommand() (+8 more)

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (27): engines, node, name, packageManager, private, type, version, cross-env (+19 more)

### Community 20 - "ai-presets.ts"
Cohesion: 0.10
Nodes (21): maximumAllowanceCharge(), CatalogEntry, classifyTaskComplexity(), cost(), effortLevels, estimateLayerMaximum(), layer(), longContext (+13 more)

### Community 22 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.16
Nodes (4): TypeSafe state/questions API cited in pilot plan, TypeSafe coding-agent guidance cited in cleanup plan, TypeSafe confidence guidance cited in pilot plan, TypeSafe pricing cited in October 3 estimates

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "index.ts"
Cohesion: 0.10
Nodes (22): ws, browser, dataDir, group, profile, room, token, b64() (+14 more)

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - ".ensureWorkflow"
Cohesion: 0.23
Nodes (3): WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 28 - "verification.ts"
Cohesion: 0.18
Nodes (14): keepLastSuccess(), shouldPromoteRevision(), previewDocument(), assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind (+6 more)

### Community 29 - "IntentReview.tsx"
Cohesion: 0.20
Nodes (6): IntentTarget, InterpretationIntentCategory, SharedRequirementSource, caption(), Edit, IntentReview()

### Community 30 - "App.tsx"
Cohesion: 0.14
Nodes (20): Rooms and sessions, 2guys1canvas presentation and invitation boundary (2026-09-30), Reference-led presentation update (2026-09-30), Responsive delivery and synchronization, RoomView, App(), FormatChoice, Join() (+12 more)

### Community 31 - "local-drafts.test.ts"
Cohesion: 0.20
Nodes (7): browserDraftStore, draftKey(), DraftStore, LocalDraftStatus, persistDraft(), restoreDraft(), merge()

### Community 32 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 33 - "OpenRouterLeases"
Cohesion: 0.22
Nodes (6): BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases

### Community 34 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 35 - "product.md"
Cohesion: 0.11
Nodes (4): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02

### Community 36 - "verify-reliability.ts"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, open(), output, providerAddress, room (+2 more)

### Community 37 - "CoCreateProvider"
Cohesion: 0.13
Nodes (7): deletionSignature(), CoCreateProvider, ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), FakeWebSocket

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.11
Nodes (19): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+11 more)

### Community 39 - "verify-candidate-evidence.ts"
Cohesion: 0.13
Nodes (17): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+9 more)

### Community 40 - "build-shortcut.ts"
Cohesion: 0.29
Nodes (8): ariaShortcut(), BUILD_SHORTCUT_STORAGE_KEY, BuildShortcutPreference, defaultBuildShortcut(), isBuildShortcut(), readBuildShortcut(), ShortcutEvent, shortcutLabel()

### Community 41 - "reliability.test.ts"
Cohesion: 0.10
Nodes (13): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, coordinatorRetry, CoordinatorUnavailableError (+5 more)

### Community 42 - "AgentPanel.tsx"
Cohesion: 0.28
Nodes (11): AIResolvedLayer, dollars(), rateSummary(), effortChoices, api(), tokenRole(), AgentPanel(), changeEffort() (+3 more)

### Community 43 - "ai-presets.test.ts"
Cohesion: 0.33
Nodes (7): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), passed

### Community 45 - "generator.ts"
Cohesion: 0.07
Nodes (46): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, boundedInput(), callOpenAI(), classification, compactRequirement() (+38 more)

### Community 47 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.18
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 48 - "measure-responsiveness.ts"
Cohesion: 0.28
Nodes (4): median(), run(), Sample, wait()

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (9): BASIC_ACCOUNTING, BASIC_LIMIT, EXTENDED_LIMIT, IO_COUNTERS, IsolationRunner, PROCESS_INFORMATION, SECURITY_CAPABILITIES, STARTUPINFO (+1 more)

### Community 50 - "Multi-user Step 07 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Checks and retained attempts, Deliberately bounded coverage, Files, decision and handoff, Isolation and operator setup, Multi-user Step 07 handoff - 2026-10-04, Outcome and boundary

### Community 51 - "tool-registry.ts"
Cohesion: 0.13
Nodes (14): ActorType, FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior (+6 more)

### Community 52 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, audit:code, build, check:boundaries, deploy:cloudflare, dev, migrate:legacy, start (+1 more)

### Community 53 - "verify-build-progress.ts"
Cohesion: 0.15
Nodes (15): address, Browser, browsers, candidates, converge(), dataDir, fake, gates (+7 more)

### Community 54 - "workflow-budget.test.ts"
Cohesion: 0.34
Nodes (9): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), ProviderRequestRecord (+1 more)

### Community 55 - "main.tsx"
Cohesion: 0.11
Nodes (14): lucide-react, react, react-dom, AIConnection, ByokSetup(), Lease, request(), CanvasExample() (+6 more)

### Community 56 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 57 - "verify-artifact-growth.ts"
Cohesion: 0.33
Nodes (5): dir, manager, observations, platform, project

### Community 58 - "rooms.ts"
Cohesion: 0.08
Nodes (35): y-protocols, catalogRate(), ArchivedVersion, ArtifactReference, AcceptedIntentContext, Usage, AISettings, BudgetReservation (+27 more)

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (38): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27, Draggable effort toggle and visible project naming (2026-09-25), Email invitations, complete auth, project names, and segmented effort (2026-09-25) (+30 more)

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "ref_node_fs"
Cohesion: 0.08
Nodes (21): express, browser, output, profile, browser, outputDir, profile, browser (+13 more)

### Community 64 - "container.js"
Cohesion: 0.18
Nodes (6): Collaboration connection lifecycle, Cloudflare availability and collaboration repair evidence (2026-09-18), @cloudflare/containers, baseEnv, CoCreateContainer, fetch()

### Community 65 - "browser.ts"
Cohesion: 0.36
Nodes (7): assertVerificationBrowserAvailable(), browserExecutable(), BrowserProtocol, unavailable(), withIsolatedBrowser(), IsolationError, IsolationOptions

### Community 66 - "Step 09 - Conditional interpretation concurrency and topology evaluation"
Cohesion: 0.40
Nodes (5): Actual runtime, verification and retained failures, Controlled comparison, Files, rollout and next work, Outcome and responsible boundary, Step 09 - Conditional interpretation concurrency and topology evaluation

### Community 67 - "ref_node_assert"
Cohesion: 0.11
Nodes (3): yjs, pause(), waitFor()

### Community 69 - "supabase-platform.ts"
Cohesion: 0.06
Nodes (35): artifactResponse(), RecoveryCheckpoint, betaDenied(), coordinatorResponse(), decryptSecret(), EncryptedSecret, encryptSecret(), keyFor() (+27 more)

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "BuildAccounting.tsx"
Cohesion: 0.67
Nodes (5): BuildAccounting(), comparableMetrics(), runKey(), tokenCount(), UsageSummary()

### Community 73 - "providers.test.ts"
Cohesion: 0.28
Nodes (7): adapterFor(), discoverModels(), generateStructured(), mergeUsage(), withProviderAccounting(), withProviderRetryReason(), schema

### Community 74 - "Harness architecture"
Cohesion: 0.10
Nodes (20): Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Bounded context and cost target, Browser recovery and transport batching — 2026-09-28, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary, Execution flow (+12 more)

### Community 75 - "Steps 6–10 integration into main"
Cohesion: 0.50
Nodes (4): Fresh verification, Operational boundaries, Resolution and preserved contracts, Steps 6–10 integration into main

### Community 76 - "verify-intent-ui.ts"
Cohesion: 0.06
Nodes (30): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+22 more)

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.11
Nodes (19): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+11 more)

### Community 82 - "Step 05 handoff — attributable intent and contextual references"
Cohesion: 0.33
Nodes (6): Checks and honest scope, Durability, uncertainty and compatibility, Files and decision, Outcome and reproduced boundary, Step 05 handoff — attributable intent and contextual references, Unrun release dependencies and next step

### Community 85 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 90 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 91 - "artifacts.ts"
Cohesion: 0.13
Nodes (25): ArtifactBody, artifactHash(), artifactPath(), ArtifactUnavailableError, ArtifactVersion, bodyFromBytes(), canonicalJson(), captureArtifacts() (+17 more)

### Community 92 - "2guys1canvas"
Cohesion: 0.13
Nodes (15): 2guys1canvas, Active hosted MVP: OpenRouter BYOK, AI steering documents, Architecture, Checks, Connect AI, Current boundaries, Current product setup (2026-09-30) (+7 more)

### Community 93 - "verify-coordinator-postgres.ts"
Cohesion: 0.13
Nodes (11): pg, a, admin, b, checks, ownerA, ownerB, project (+3 more)

### Community 94 - "Multi-user harness improvement prompts"
Cohesion: 0.15
Nodes (13): Common contract, Multi-user harness improvement prompts, Starting instruction, Step 01 - Audit, scenarios and baseline, Step 02 - Coordinator fencing and owner routing, Step 03 - Artifact persistence and restoration, Step 04 - Generated execution isolation, Step 05 - Intent inspection, correction and contextual references (+5 more)

### Community 95 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.14
Nodes (9): apply, args, backup, client, dataArg, dataDir, mapping, mappingArg (+1 more)

### Community 98 - "Step 10 - Cross-system integration and final harness review"
Cohesion: 0.33
Nodes (6): Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review

### Community 99 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 100 - "inspectSources"
Cohesion: 0.53
Nodes (6): inspectSources(), add(), reachable(), resolve(), visit(), posix()

### Community 102 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.40
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 103 - "Step 08 - Durable workflow budget and accounting"
Cohesion: 0.40
Nodes (5): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures

### Community 104 - "Multi-user Step 04 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites

### Community 105 - "Pre-launch and private beta change packet"
Cohesion: 0.50
Nodes (4): Exact owner and approval process, Pre-launch and private beta change packet, Release prerequisites and rollback, Verification and handoff

### Community 107 - "generated-isolation.test.ts"
Cohesion: 0.17
Nodes (4): fs, path, files, jobs

## Knowledge Gaps
- **591 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+586 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 895 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `2guys1canvas harness implementation checklist` connect `2guys1canvas harness implementation checklist` to `codebase-audit.ts`, `container.js`, `harness/checklist.md`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Are the 33 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 33 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _591 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.08290859667006456 - nodes in this community are weakly interconnected._
- **Why does `RoomManager` connect `RoomManager` to `Step 09 - Conditional interpretation concurrency and topology evaluation`, `EventStore`, `types.ts`, `supabase-platform.ts`, `ref_node_assert`, `reliability.test.ts`, `ai-presets.test.ts`, `fixtures/multiuser-baseline.ts`, `intent-corrections.test.ts`, `tool-registry.ts`, `workflow-budget.test.ts`, `index.ts`, `verify-artifact-growth.ts`, `rooms.ts`, `artifacts.ts`, `ref_node_fs`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Why does `yjs` connect `ref_node_assert` to `live-collaboration-check.mjs`, `supabase-platform.ts`, `CoCreateProvider`, `reliability.test.ts`, `fixtures/multiuser-baseline.ts`, `measure-responsiveness.ts`, `package.json`, `index.ts`, `rooms.ts`, `artifacts.ts`, `verification.ts`, `App.tsx`, `local-drafts.test.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._