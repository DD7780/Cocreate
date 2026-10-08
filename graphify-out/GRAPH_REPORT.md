# Graph Report - Devoffice  (2026-10-08)

## Corpus Check
- 215 files · ~197,322 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 5, .css 5, .example 1)

## Summary
- 2130 nodes · 5021 edges · 114 communities (99 shown, 15 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 172 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2d74ede7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- rooms.ts
- README.md
- types.ts
- EventStore
- prisma/schema.prisma
- api.md
- docs/harness/decisions.md
- isolation.ts
- requirements.ts
- verify-prelaunch-beta.ts
- providers.ts
- rules
- ProjectApp.tsx
- event-store.ts
- verify-interpretation-topology.ts
- docs/harness/codebase-cleanup-verification.md
- codebase-audit.ts
- verification.ts
- package.json
- harness/architecture.md
- ai-presets.ts
- instructions.md
- managed-catalog.ts
- dependencies
- index.ts
- compilerOptions
- .ensureWorkflow
- context.md
- registerProjectRoutes
- IntentReview.tsx
- Workspace
- local-drafts.test.ts
- live-collaboration-check.mjs
- OpenRouterLeases
- project.ts
- SupabasePlatform
- intent-commands.ts
- CoCreateProvider
- verify-harness-integration.ts
- App.tsx
- Linux browser isolation: bounded alternative and platform questions
- reliability.test.ts
- AgentPanel.tsx
- migrate-legacy-to-supabase.ts
- tool-registry.ts
- generator.ts
- container.js
- fixtures/multiuser-baseline.ts
- measure-responsiveness.ts
- IsolationRunner
- Step 05 handoff — attributable intent and contextual references
- Custom-domain private beta release packet
- scripts
- verify-build-progress.ts
- AGENTS.md
- main.tsx
- workflow-budget.test.ts
- live-browser-collaboration-check.mjs
- verify-candidate-evidence.ts
- 2guys1canvas harness implementation checklist
- harness/checklist.md
- .github/workflows/code-checks.yml
- .oxfmtrc.json
- ref_node_child_process
- artifacts.ts
- devDependencies
- Step 08 - Durable workflow budget and accounting
- ai-accounting.ts
- supabase-platform.ts
- Step 06 handoff — stable progress under ongoing steering
- 24-pixel SVG favicon
- ref_esbuild_cjs
- ref_node_assert
- ref_node_fs
- Harness architecture
- Multi-user Step 07 handoff - 2026-10-04
- verify-intent-ui.ts
- 2guys1canvas context handoff
- 2guys1canvas product brief
- ai-evaluation.ts
- compiler-worker.cjs
- .mcp.json
- BuildAccounting.tsx
- ui-assets.md
- 2guys1canvas AI coding instructions
- artifact-restoration.test.ts
- 2guys1canvas
- verify-coordinator-postgres.ts
- Multi-user harness improvement prompts
- Steps 6–10 integration into main
- model-evaluation.md
- Multi-user Step 04 handoff - 2026-10-04
- Step 10 - Cross-system integration and final harness review
- Multi-user Step 03 handoff - 2026-10-03
- Pre-launch and private beta change packet
- responsiveness.md
- Multi-user Step 01 evidence and handoff
- contradiction-resolution-plan.md
- Step 09 - Conditional interpretation concurrency and topology evaluation
- Harness documentation cleanup — 2026-10-02
- Pre-launch release repair — 2026-10-08
- linux-job-launcher.c
- product.md
- start-container.sh
- prepare-ci-cgroup.sh
- run-linux-check.sh

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
- `Outcome and responsible boundary` --references--> `bundleProject()`  [INFERRED]
  docs/harness/multiuser-step04-handoff.md → server/project.ts
- `Actual runtime, verification and retained failures` --references--> `RoomManager`  [INFERRED]
  docs/harness/multiuser-step09-handoff.md → server/rooms.ts
- `Rooms and sessions` --references--> `RoomView`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/api.md → shared/types.ts
- `Outcome and boundaries` --references--> `RemoteCoordinator`  [INFERRED]
  docs/harness/multiuser-step02-handoff.md → server/coordinator.ts
- `Shared response models` --references--> `Requirement`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/api.md → shared/types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Participant-scoped durable submission safety** — api_canonical_saved_receipts, api_flush_ordering, api_retired_legacy_build, api_durable_submit, api_capture_order [EXTRACTED 1.00]
- **Verified cleanup preserves workflow authority** — docs_harness_codebase_cleanup_verification_scaffold_removal, docs_harness_codebase_cleanup_verification_shared_extraction, docs_harness_architecture_durable_workflow, docs_harness_codebase_cleanup_verification_local_cleanup_checks [EXTRACTED 1.00]
- **October durable reliability contract** — docs_harness_reliability_verification_ordered_recovery, docs_harness_reliability_verification_ordered_submission_recovery, docs_harness_architecture_canonical_save_receipts, docs_harness_architecture_coordinator_fencing [EXTRACTED 1.00]
- **Feature edit authority and import boundaries** — instructions_feature_packet, instructions_shared_boundary, instructions_source_ownership, instructions_jev_advisory [EXTRACTED 1.00]
- **Collaborative submission-to-promoted-artifact flow** — product_core_loop, product_capture_order, product_durable_receipts, product_bounded_recovery [EXTRACTED 1.00]

## Communities (114 total, 15 thin omitted)

### Community 0 - "rooms.ts"
Cohesion: 0.06
Nodes (58): Extracted workspace and steering helpers, Submission scheduling: current implementation and required hardening, Later-step source audit, ref_node_stream, calculateCharge(), catalogRate(), effortAllowance(), ArchivedVersion (+50 more)

### Community 1 - "README.md"
Cohesion: 0.10
Nodes (18): Historical documentation archive, Explicit pnpm native build allowlist, Current source facade and shared contracts, Shared bounded recovery and retained artifact, Current owner-controlled BYOK setup dialog, Cloudflare Worker/container deployment boundary, Controlled three-profile reliability check, Separate pinned direct TypeSafe audit adapter (+10 more)

### Community 2 - "types.ts"
Cohesion: 0.10
Nodes (22): Shared response models, aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes, AgentStatus, AIRateTier, AIRoutingEvidenceStatus (+14 more)

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 5 - "api.md"
Cohesion: 0.06
Nodes (47): RoomView.requirementRevisions accepted snapshots, PKCE callback and account-choice flow, Immutable canonical WebSocket saved receipts, Capture-order interpretation and explicit recovery, Authoritative multi-option ConflictGroup, Revision-safe affected-contributor conflict selections, Workflow coordinator fencing RPC contracts, Persisted Developer task evidence (+39 more)

### Community 6 - "docs/harness/decisions.md"
Cohesion: 0.05
Nodes (43): D-0001 â€” Preserve the existing application while migrating additively, D-0002 â€” Personal interpretations are proposals, not builder authority, D-0003 â€” Build from the accepted registry, not the raw canvas, D-0004 â€” Deletion is not withdrawal, D-0005 â€” Pause on consequential accepted contradictions, D-0006 â€” Conflict groups and explicit affected-contributor agreement, D-0007 â€” Classify per intent and reprocess only by explicit participant action, D-0008 â€” Submit intent explicitly; collaborate continuously (+35 more)

### Community 7 - "isolation.ts"
Cohesion: 0.07
Nodes (41): Linux verification follow-up — 2026-10-08, ref_node_events, ref_node_string_decoder, executable, sandbox, assertIsolationAvailable(), assertVerificationBrowserAvailable(), browserExecutable() (+33 more)

### Community 8 - "requirements.ts"
Cohesion: 0.10
Nodes (36): projection(), acceptanceFor(), acceptedClassification(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries(), categories (+28 more)

### Community 9 - "verify-prelaunch-beta.ts"
Cohesion: 0.07
Nodes (19): WebSocket collaboration, ref_node_vm, browser, outputDir, profile, browser, outputDir, profile (+11 more)

### Community 10 - "providers.ts"
Cohesion: 0.07
Nodes (35): ref_node_async_hooks, accounting, adapterFor(), adapters, anthropic, balancedObject(), bearer(), classify() (+27 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.06
Nodes (39): @supabase/supabase-js, legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), safeLocalDestination(), SupabaseAuthConfig, SupabaseAuthResolution (+31 more)

### Community 13 - "event-store.ts"
Cohesion: 0.17
Nodes (11): ActorType, EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow (+3 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.10
Nodes (23): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+15 more)

### Community 15 - "docs/harness/codebase-cleanup-verification.md"
Cohesion: 0.11
Nodes (24): Browser shared server module boundary, October 4 cleanup completion, October4 structural semantic graph refresh, AdvancedAISetup call-site correction, Bounded refactor and verification gates, Required-contract recall and context-reduction target, Dated Jev pilot pricing and cost assumptions, Advisory offline Jev pilot (+16 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.12
Nodes (27): Budgeted advisory Jev evidence packets, Report-only source reachability and import audit, ref_node_url, typescript, cachedReview(), ImportReference, inputCost(), inspectSources() (+19 more)

### Community 17 - "verification.ts"
Cohesion: 0.23
Nodes (12): previewDocument(), assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript (+4 more)

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (28): engines, node, name, packageManager, private, type, version, cross-env (+20 more)

### Community 19 - "harness/architecture.md"
Cohesion: 0.13
Nodes (18): Bounded complete-file recovery, Participant-scoped IndexedDB recovery, Immutable insertion and deletion save receipts, Single coordinator and lease fencing, One durable workflow and caller-only submission, Active temporary OpenRouter BYOK, Remaining hosted owner routing and archive limits, Verified-email invitations preserve roles and links (+10 more)

### Community 20 - "ai-presets.ts"
Cohesion: 0.09
Nodes (26): Named AI connections (preferred API), D-0014 â€” Versioned estimates, not inferred billing, CatalogEntry, classifyTaskComplexity(), cost(), effortLevels, estimateLayerMaximum(), layer() (+18 more)

### Community 21 - "instructions.md"
Cohesion: 0.10
Nodes (21): React/Vite and Express facade entrypoints, Explicit affected-contributor agreement, Advisory audit provider and model authority, Runtime external/model validation, Active memory-only OpenRouter BYOK, Durable batches and cloud save receipts, Stale-worker and promotion fencing, Same-change canonical documentation maintenance (+13 more)

### Community 22 - "managed-catalog.ts"
Cohesion: 0.17
Nodes (12): ref_node_fs_promises, [command,file], MANAGED_CATALOG_SOURCE, MANAGED_CATALOG_VERSION, MANAGED_DEFAULT_BUILDER, MANAGED_INTERPRETER_CANDIDATES, managedCatalog, ManagedCatalogEntry (+4 more)

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "index.ts"
Cohesion: 0.09
Nodes (27): ref_node_crypto, ref_node_sqlite, ws, b64(), createSession(), participantId(), roomToken(), Session (+19 more)

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - ".ensureWorkflow"
Cohesion: 0.23
Nodes (3): WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 27 - "context.md"
Cohesion: 0.10
Nodes (18): Current browser/server coordinator facades, Current temporary OpenRouter BYOK, Durable caller-owned submission capture, Prepared coordinator migration and external verification gaps, Bounded one-file recovery checkpoints, Protected migration tool retained despite false obsolete judgment, October 1 local reliability evidence, Current Canvas Shared context rail (+10 more)

### Community 28 - "registerProjectRoutes"
Cohesion: 0.20
Nodes (13): express, artifactResponse(), coordinatorRetry, coordinatorResponse(), InvitationEmailSender, appOrigin(), bearer(), displayName() (+5 more)

### Community 29 - "IntentReview.tsx"
Cohesion: 0.18
Nodes (8): IntentCommand, IntentCommandResult, IntentTarget, InterpretationIntentCategory, src_intent_review, caption(), Edit, IntentReview()

### Community 30 - "Workspace"
Cohesion: 0.24
Nodes (11): Reference-led presentation update (2026-09-30), tokenParticipant(), Workspace(), ariaShortcut(), BUILD_SHORTCUT_STORAGE_KEY, BuildShortcutPreference, defaultBuildShortcut(), isBuildShortcut() (+3 more)

### Community 31 - "local-drafts.test.ts"
Cohesion: 0.20
Nodes (7): browserDraftStore, draftKey(), DraftStore, LocalDraftStatus, persistDraft(), restoreDraft(), merge()

### Community 32 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 33 - "OpenRouterLeases"
Cohesion: 0.22
Nodes (6): BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases

### Community 34 - "project.ts"
Cohesion: 0.13
Nodes (24): ref_node_path_posix, addUsage(), recoverProjectPlan(), taskSchema, generateProjectPlan(), allowedExtensions, applyOperations(), budgetProjectFiles() (+16 more)

### Community 35 - "SupabasePlatform"
Cohesion: 0.13
Nodes (7): betaDenied(), fail(), hashToken(), normalizeProjectTitle(), SupabasePlatform, encodePostgresBytea(), hostedFixture()

### Community 36 - "intent-commands.ts"
Cohesion: 0.28
Nodes (8): applyIntentCommand(), categories, fail(), intentCommandHash(), parseIntentCommand(), IntentCorrection, InterpretationIntent, SharedRequirementSource

### Community 37 - "CoCreateProvider"
Cohesion: 0.12
Nodes (9): ref_y_protocols_awareness, states(), deletionSignature(), CoCreateProvider, ConnectionStatus, ProviderDependencies, providerInternals, retryDelay() (+1 more)

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.11
Nodes (20): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+12 more)

### Community 39 - "App.tsx"
Cohesion: 0.11
Nodes (16): 2guys1canvas presentation and invitation boundary (2026-09-30), Responsive delivery and synchronization, @tiptap/react, @tiptap/starter-kit, BuildProgress, RoomView, WorkflowStatus, FormatChoice (+8 more)

### Community 40 - "Linux browser isolation: bounded alternative and platform questions"
Cohesion: 0.40
Nodes (5): Conditional same-host alternative, Evidence and smallest next action, If delegation is unavailable, Linux browser isolation: bounded alternative and platform questions, Release and recovery

### Community 41 - "reliability.test.ts"
Cohesion: 0.11
Nodes (11): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, CoordinatorUnavailableError, RemoteCoordinator (+3 more)

### Community 42 - "AgentPanel.tsx"
Cohesion: 0.19
Nodes (14): AIResolvedLayer, Participant, dollars(), rateSummary(), effortChoices, api(), tokenRole(), Join() (+6 more)

### Community 43 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.13
Nodes (17): Explicit Jev provider and endpoint isolation, Vercel adapter and Jev smoke completion, Implemented Vercel Jev follow-up, Jev adapter verification and incomplete comparison, 20-file Vercel historical Jev smoke evidence, Protected migration Jev false positive retained, D-0044 Vercel credentials route through AI Gateway, ref_dotenv_config (+9 more)

### Community 44 - "tool-registry.ts"
Cohesion: 0.14
Nodes (13): FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior, ToolContext (+5 more)

### Community 45 - "generator.ts"
Cohesion: 0.09
Nodes (29): RecoveryCheckpoint, clean(), demoExtract(), AgentChange, boundedInput(), callOpenAI(), classification, compactRequirement() (+21 more)

### Community 46 - "container.js"
Cohesion: 0.22
Nodes (6): @cloudflare/containers, ref_cloudflare_workers, baseEnv, CoCreateContainer, fetch(), legacyOriginResponse()

### Community 47 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.18
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 48 - "measure-responsiveness.ts"
Cohesion: 0.47
Nodes (5): ref_node_perf_hooks, median(), run(), Sample, wait()

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (30): BASIC_ACCOUNTING, BASIC_LIMIT, DllImport, EXTENDED_LIMIT, FileSystemRights, IntPtr, IO_COUNTERS, PROCESS_INFORMATION (+22 more)

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

### Community 54 - "AGENTS.md"
Cohesion: 0.18
Nodes (10): Durable workflow is the primary shared object, Bounded feature change packet, Graphify scoped source navigation, AST-only graph refresh, Graphify wiki broad navigation, Targets versus verified implementation, Offline Jev rankings are advisory, One logical coordinator (+2 more)

### Community 55 - "main.tsx"
Cohesion: 0.10
Nodes (17): ByokSetup is the mounted setup surface, Vite HTML client mount, lucide-react, react, ref_react_dom_client, AIConnection, ByokSetup(), Lease (+9 more)

### Community 56 - "workflow-budget.test.ts"
Cohesion: 0.30
Nodes (11): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), WorkflowBudget (+3 more)

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
Cohesion: 0.20
Nodes (8): October 3 Graphify maintenance evidence, October 3 cleanup plan history, October 1 reliability verification history, October 1 Studio Ivory local checks history, Reliability source audit and controlled causes, Canvas Shared context and accepted revision history, graphify-out/SOURCE_MAP.md, Vercel TypeSafe-compatible endpoint documentation

### Community 61 - ".github/workflows/code-checks.yml"
Cohesion: 0.43
Nodes (6): Frozen pnpm lockfile installation, Commit-pinned GitHub Actions, Code checks on push and pull request, CI pnpm 10.18.3 and Node 24, Import-boundary, test and build gates, Offline GitHub code validation

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "ref_node_child_process"
Cohesion: 0.08
Nodes (20): ref_node_child_process, ref_node_module, browser, output, profile, buildFiles, config, files (+12 more)

### Community 64 - "artifacts.ts"
Cohesion: 0.15
Nodes (21): ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, ArtifactUnavailableError, ArtifactVersion, bodyFromBytes(), canonicalJson() (+13 more)

### Community 65 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 66 - "Step 08 - Durable workflow budget and accounting"
Cohesion: 0.40
Nodes (5): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures

### Community 67 - "ai-accounting.ts"
Cohesion: 0.24
Nodes (12): Bounded context and cost target, aggregateCalls(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, AIRate, AIRunCall (+4 more)

### Community 68 - "supabase-platform.ts"
Cohesion: 0.13
Nodes (18): ref_supabase_server_core, RecoveryCheckpoint, decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), AuthenticatedUser, normalizeInviteEmail() (+10 more)

### Community 69 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 73 - "ref_node_fs"
Cohesion: 0.10
Nodes (15): ref_node_assert_strict, ref_node_fs, ref_node_os, ref_node_path, ref_node_test, yjs, browser, profile (+7 more)

### Community 74 - "Harness architecture"
Cohesion: 0.10
Nodes (20): Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary, Execution flow (+12 more)

### Community 75 - "Multi-user Step 07 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Checks and retained attempts, Deliberately bounded coverage, Files, decision and handoff, Isolation and operator setup, Multi-user Step 07 handoff - 2026-10-04, Outcome and boundary

### Community 76 - "verify-intent-ui.ts"
Cohesion: 0.07
Nodes (29): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+21 more)

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 79 - "ai-evaluation.ts"
Cohesion: 0.29
Nodes (7): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), AIWorkflowMode

### Community 80 - "compiler-worker.cjs"
Cohesion: 0.33
Nodes (4): ref_node_net, fs, path, server_isolation_esbuild_cjs

### Community 82 - "BuildAccounting.tsx"
Cohesion: 0.48
Nodes (6): NormalizedAIUsage, BuildAccounting(), comparableMetrics(), runKey(), tokenCount(), UsageSummary()

### Community 85 - "ui-assets.md"
Cohesion: 0.40
Nodes (4): DM Serif Display font, Inter font, Lucide React icons, Generated preview style isolation

### Community 90 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 91 - "artifact-restoration.test.ts"
Cohesion: 0.08
Nodes (24): ref_node_http, dir, manager, observations, platform, project, Browser, browsers (+16 more)

### Community 92 - "2guys1canvas"
Cohesion: 0.13
Nodes (15): 2guys1canvas, Active hosted MVP: OpenRouter BYOK, AI steering documents, Architecture, Checks, Connect AI, Current boundaries, Current product setup (2026-09-30) (+7 more)

### Community 93 - "verify-coordinator-postgres.ts"
Cohesion: 0.13
Nodes (11): pg, a, admin, b, checks, ownerA, ownerB, project (+3 more)

### Community 94 - "Multi-user harness improvement prompts"
Cohesion: 0.15
Nodes (13): Common contract, Multi-user harness improvement prompts, Starting instruction, Step 01 - Audit, scenarios and baseline, Step 02 - Coordinator fencing and owner routing, Step 03 - Artifact persistence and restoration, Step 04 - Generated execution isolation, Step 05 - Intent inspection, correction and contextual references (+5 more)

### Community 95 - "Steps 6–10 integration into main"
Cohesion: 0.50
Nodes (4): Fresh verification, Operational boundaries, Resolution and preserved contracts, Steps 6–10 integration into main

### Community 96 - "model-evaluation.md"
Cohesion: 0.67
Nodes (3): Deterministic inference-free routing, Model-routing evaluation protocol 2026-09-22.v3, Repeated trial qualification thresholds

### Community 97 - "Multi-user Step 04 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites

### Community 98 - "Step 10 - Cross-system integration and final harness review"
Cohesion: 0.33
Nodes (6): Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review

### Community 99 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 100 - "Pre-launch and private beta change packet"
Cohesion: 0.50
Nodes (4): Exact owner and approval process, Pre-launch and private beta change packet, Release prerequisites and rollback, Verification and handoff

### Community 101 - "responsiveness.md"
Cohesion: 0.50
Nodes (3): September 26 localhost responsiveness benchmark, Lazy route split transferred-byte evidence, Unmeasured production and provider timing

### Community 102 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.40
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 103 - "contradiction-resolution-plan.md"
Cohesion: 0.40
Nodes (4): Conflict-group acceptance matrix, Additive ConflictGroup migration plan, Decisions needed and Disagreements UI target, Planned conflict alternatives and reopen mutations

### Community 104 - "Step 09 - Conditional interpretation concurrency and topology evaluation"
Cohesion: 0.40
Nodes (5): Actual runtime, verification and retained failures, Controlled comparison, Files, rollout and next work, Outcome and responsible boundary, Step 09 - Conditional interpretation concurrency and topology evaluation

### Community 105 - "Harness documentation cleanup — 2026-10-02"
Cohesion: 0.50
Nodes (4): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02

### Community 108 - "Pre-launch release repair — 2026-10-08"
Cohesion: 0.67
Nodes (3): Bounded change packet, Fresh evidence, Pre-launch release repair — 2026-10-08

### Community 114 - "linux-job-launcher.c"
Cohesion: 0.29
Nodes (5): errno, prctl, signal, stdio, unistd

### Community 120 - "product.md"
Cohesion: 0.14
Nodes (13): Serialized eight-task and 24-call recovery, Disconnected-first OpenRouter BYOK setup, Attributed capture-order interpretation, Collaborative submission-to-artifact loop, Developer-only activatable workflow, Immutable cloud save and replay receipts, Verified email-bound invitations, Small React/TypeScript frontend scope (+5 more)

## Knowledge Gaps
- **626 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+621 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 954 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `RoomManager` connect `rooms.ts` to `types.ts`, `EventStore`, `Step 09 - Conditional interpretation concurrency and topology evaluation`, `ref_node_fs`, `reliability.test.ts`, `tool-registry.ts`, `fixtures/multiuser-baseline.ts`, `index.ts`, `workflow-budget.test.ts`, `artifact-restoration.test.ts`, `registerProjectRoutes`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `yjs` connect `ref_node_fs` to `live-collaboration-check.mjs`, `rooms.ts`, `supabase-platform.ts`, `CoCreateProvider`, `App.tsx`, `reliability.test.ts`, `fixtures/multiuser-baseline.ts`, `measure-responsiveness.ts`, `package.json`, `harness/architecture.md`, `index.ts`, `artifact-restoration.test.ts`, `local-drafts.test.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `2guys1canvas context handoff` connect `2guys1canvas context handoff` to `context.md`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Are the 33 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 33 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _626 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `rooms.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.058663558663558664 - nodes in this community are weakly interconnected._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._