# Graph Report - Devoffice  (2026-10-05)

## Corpus Check
- 193 files · ~173,724 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 6, .css 4, .example 1)

## Summary
- 2011 nodes · 4776 edges · 113 communities (102 shown, 11 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 165 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4f99c16a`
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
- SupabasePlatform
- providers.ts
- rules
- ProjectApp.tsx
- ByokSetup.tsx
- verify-interpretation-topology.ts
- docs/harness/codebase-cleanup-verification.md
- codebase-audit.ts
- generator.ts
- package.json
- harness/architecture.md
- ai-presets.ts
- instructions.md
- graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md
- dependencies
- index.ts
- compilerOptions
- supabase.ts
- context.md
- rooms.ts
- CoCreateProvider
- App.tsx
- yjs
- live-collaboration-check.mjs
- OpenRouterLeases
- devDependencies
- product.md
- verify-reliability.ts
- provider-reconnect.test.ts
- Workspace
- verify-candidate-evidence.ts
- registerProjectRoutes
- verify-harness-integration.ts
- AgentPanel.tsx
- ai-presets.test.ts
- AGENTS.md
- project.ts
- supabase-platform.ts
- .loadSnapshot
- measure-responsiveness.ts
- IsolationRunner
- invitation-email.ts
- tool-registry.ts
- scripts
- verify-build-progress.ts
- workflow-budget.test.ts
- main.tsx
- live-browser-collaboration-check.mjs
- event-store.ts
- cocreate.test.ts
- 2guys1canvas harness implementation checklist
- harness/checklist.md
- .github/workflows/code-checks.yml
- .oxfmtrc.json
- ref_node_path
- IntentReview.tsx
- browser.ts
- safeLocalDestination
- ref_node_assert_strict
- contradiction-resolution-plan.md
- artifacts.ts
- 24-pixel SVG favicon
- room-state.ts
- requirements.test.ts
- providers.test.ts
- Harness architecture
- main
- verify-intent-ui.ts
- 2guys1canvas context handoff
- 2guys1canvas product brief
- coordinator-fencing.test.ts
- RoomView
- .mcp.json
- Step 05 handoff — attributable intent and contextual references
- Step 06 handoff — stable progress under ongoing steering
- 2guys1canvas AI coding instructions
- artifact-restoration.test.ts
- 2guys1canvas
- verify-coordinator-postgres.ts
- Multi-user harness improvement prompts
- migrate-legacy-to-supabase.ts
- Multi-user Step 07 handoff - 2026-10-04
- intent-commands.ts
- Step 10 - Cross-system integration and final harness review
- Multi-user Step 03 handoff - 2026-10-03
- inspectSources
- verify-artifact-growth.ts
- Multi-user Step 01 evidence and handoff
- Step 08 - Durable workflow budget and accounting
- Multi-user Step 04 handoff - 2026-10-04
- Step 09 - Conditional interpretation concurrency and topology evaluation
- ui-assets.md
- compiler-worker.cjs
- oauth-callback.ts
- ProjectFile
- fetch

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 111 edges
2. `Room` - 74 edges
3. `createCoCreateServer()` - 60 edges
4. `EventStore` - 54 edges
5. `SupabasePlatform` - 49 edges
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
- `Reference-led presentation update (2026-09-30)` --references--> `Workspace()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → src/App.tsx
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

## Communities (113 total, 11 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.08
Nodes (33): Submission scheduling: current implementation and required hardening, Later-step source audit, ref_node_stream, calculateCharge(), catalogRate(), effortAllowance(), AIConfig, createCoCreateServer() (+25 more)

### Community 1 - "README.md"
Cohesion: 0.08
Nodes (22): Historical documentation archive, Explicit pnpm native build allowlist, Current source facade and shared contracts, Shared bounded recovery and retained artifact, Current owner-controlled BYOK setup dialog, Cloudflare Worker/container deployment boundary, Controlled three-profile reliability check, Separate pinned direct TypeSafe audit adapter (+14 more)

### Community 2 - "types.ts"
Cohesion: 0.10
Nodes (21): Named AI connections (preferred API), aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes, AgentStatus, AIRateTier, AIRecommendation (+13 more)

### Community 3 - "EventStore"
Cohesion: 0.06
Nodes (18): output, report, trials, EventStore, WorkflowActivity, WorkflowPhase, WorkflowTask, WorkflowTaskState (+10 more)

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 5 - "api.md"
Cohesion: 0.06
Nodes (42): RoomView.requirementRevisions accepted snapshots, PKCE callback and account-choice flow, Immutable canonical WebSocket saved receipts, Capture-order interpretation and explicit recovery, Authoritative multi-option ConflictGroup, Revision-safe affected-contributor conflict selections, Workflow coordinator fencing RPC contracts, Persisted Developer task evidence (+34 more)

### Community 6 - "docs/harness/decisions.md"
Cohesion: 0.05
Nodes (43): D-0001 â€” Preserve the existing application while migrating additively, D-0002 â€” Personal interpretations are proposals, not builder authority, D-0003 â€” Build from the accepted registry, not the raw canvas, D-0004 â€” Deletion is not withdrawal, D-0005 â€” Pause on consequential accepted contradictions, D-0006 â€” Conflict groups and explicit affected-contributor agreement, D-0007 â€” Classify per intent and reprocess only by explicit participant action, D-0008 â€” Submit intent explicitly; collaborate continuously (+35 more)

### Community 7 - "isolation.ts"
Cohesion: 0.15
Nodes (21): ref_node_events, ref_node_module, assertIsolationAvailable(), cancelled(), compileIsolated(), Dependency, hostEnvironment(), IsolatedRequest (+13 more)

### Community 8 - "requirements.ts"
Cohesion: 0.12
Nodes (31): applyIntentCommand(), acceptanceFor(), acceptedClassification(), alternativeSignature(), candidateEntries(), categories, classifications, classifyIntentText() (+23 more)

### Community 9 - "SupabasePlatform"
Cohesion: 0.17
Nodes (4): fail(), normalizeProjectTitle(), SupabasePlatform, encodePostgresBytea()

### Community 10 - "providers.ts"
Cohesion: 0.08
Nodes (31): ref_node_async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+23 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.09
Nodes (13): needsSessionRefresh(), InviteResult, PendingInvite, Project, ProjectList, ProjectMember, ProjectRole, Projects() (+5 more)

### Community 13 - "ByokSetup.tsx"
Cohesion: 0.25
Nodes (7): ByokSetup is the mounted setup surface, lucide-react, react, AIConnection, ByokSetup(), Lease, request()

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.10
Nodes (23): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+15 more)

### Community 15 - "docs/harness/codebase-cleanup-verification.md"
Cohesion: 0.09
Nodes (31): Explicit Jev provider and endpoint isolation, Browser shared server module boundary, October 4 cleanup completion, October4 structural semantic graph refresh, Vercel adapter and Jev smoke completion, AdvancedAISetup call-site correction, Bounded refactor and verification gates, Required-contract recall and context-reduction target (+23 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.13
Nodes (16): Budgeted advisory Jev evidence packets, Report-only source reachability and import audit, ref_node_url, typescript, ImportReference, Inventory, JEV_INPUT_USD_PER_MILLION, JEV_MODEL (+8 more)

### Community 17 - "generator.ts"
Cohesion: 0.09
Nodes (30): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, clean(), demoExtract(), AgentChange, boundedInput() (+22 more)

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (27): engines, node, name, packageManager, private, type, version, cross-env (+19 more)

### Community 19 - "harness/architecture.md"
Cohesion: 0.12
Nodes (18): Bounded complete-file recovery, Participant-scoped IndexedDB recovery, Immutable insertion and deletion save receipts, Single coordinator and lease fencing, One durable workflow and caller-only submission, Active temporary OpenRouter BYOK, Remaining hosted owner routing and archive limits, Verified-email invitations preserve roles and links (+10 more)

### Community 20 - "ai-presets.ts"
Cohesion: 0.05
Nodes (49): D-0014 â€” Versioned estimates, not inferred billing, Deterministic inference-free routing, Model-routing evaluation protocol 2026-09-22.v3, Repeated trial qualification thresholds, ref_node_fs_promises, [command,file], aggregateCalls(), effectiveness() (+41 more)

### Community 21 - "instructions.md"
Cohesion: 0.08
Nodes (24): Planned feature change evidence packet, Protected submission, save and coordinator semantics, TypeSafe reranking workflow cited in pilot plan, React/Vite and Express facade entrypoints, Explicit affected-contributor agreement, Advisory audit provider and model authority, Runtime external/model validation, Active memory-only OpenRouter BYOK (+16 more)

### Community 22 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.17
Nodes (15): Ambient declarations require reachability exceptions, Dated proposed codebase cleanup plan, Unmeasured optional-context reduction target, Planned deterministic reachability and boundary triage, Graph and grammar limitations in planning snapshot, Proposed model/hash/policy Jev answer cache, Proposed 20-prompt Jev evaluation, Proposed report-only Jev pilot (+7 more)

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "index.ts"
Cohesion: 0.12
Nodes (20): ref_node_fs, ref_node_test, ws, browser, dataDir, group, profile, room (+12 more)

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "supabase.ts"
Cohesion: 0.18
Nodes (12): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution, authReturnKey, resolved (+4 more)

### Community 27 - "context.md"
Cohesion: 0.10
Nodes (18): Current browser/server coordinator facades, Current temporary OpenRouter BYOK, Durable caller-owned submission capture, Prepared coordinator migration and external verification gaps, Bounded one-file recovery checkpoints, Protected migration tool retained despite false obsolete judgment, October 1 local reliability evidence, Current Canvas Shared context rail (+10 more)

### Community 28 - "rooms.ts"
Cohesion: 0.14
Nodes (20): Extracted workspace and steering helpers, VERIFICATION_POLICY_VERSION, colors, defaultDataDir, equalBytes(), authenticatedDelta(), kindOf(), requirementFingerprint() (+12 more)

### Community 30 - "App.tsx"
Cohesion: 0.12
Nodes (13): @tiptap/extension-collaboration, @tiptap/react, @tiptap/starter-kit, BuildProgress, WorkflowStatus, FormatChoice, ProviderChoice, providerPresets (+5 more)

### Community 31 - "yjs"
Cohesion: 0.20
Nodes (7): yjs, browserDraftStore, DraftStore, LocalDraftStatus, persistDraft(), restoreDraft(), merge()

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
Nodes (17): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02, Serialized eight-task and 24-call recovery, Disconnected-first OpenRouter BYOK setup, Attributed capture-order interpretation, Collaborative submission-to-artifact loop (+9 more)

### Community 36 - "verify-reliability.ts"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, open(), output, providerAddress, room (+2 more)

### Community 37 - "provider-reconnect.test.ts"
Cohesion: 0.16
Nodes (8): ref_y_protocols_awareness, states(), deletionSignature(), ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), FakeWebSocket

### Community 38 - "Workspace"
Cohesion: 0.24
Nodes (11): tokenParticipant(), Workspace(), ariaShortcut(), BUILD_SHORTCUT_STORAGE_KEY, BuildShortcutPreference, defaultBuildShortcut(), isBuildShortcut(), readBuildShortcut() (+3 more)

### Community 39 - "verify-candidate-evidence.ts"
Cohesion: 0.14
Nodes (16): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+8 more)

### Community 40 - "registerProjectRoutes"
Cohesion: 0.19
Nodes (13): express, artifactResponse(), coordinatorRetry, coordinatorResponse(), InvitationEmailSender, appOrigin(), bearer(), displayName() (+5 more)

### Community 41 - "verify-harness-integration.ts"
Cohesion: 0.05
Nodes (32): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, ref_node_sqlite, address (+24 more)

### Community 42 - "AgentPanel.tsx"
Cohesion: 0.14
Nodes (20): AIResolvedLayer, NormalizedAIUsage, Participant, dollars(), rateSummary(), effortChoices, api(), tokenRole() (+12 more)

### Community 43 - "ai-presets.test.ts"
Cohesion: 0.29
Nodes (8): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), AIWorkflowMode, passed

### Community 44 - "AGENTS.md"
Cohesion: 0.18
Nodes (10): Durable workflow is the primary shared object, Bounded feature change packet, Graphify scoped source navigation, AST-only graph refresh, Graphify wiki broad navigation, Targets versus verified implementation, Offline Jev rankings are advisory, One logical coordinator (+2 more)

### Community 45 - "project.ts"
Cohesion: 0.23
Nodes (13): ref_node_path_posix, allowedExtensions, applyOperations(), bundleProject(), downloadableFiles(), generatedRoot, infrastructureFiles, loadProject() (+5 more)

### Community 46 - "supabase-platform.ts"
Cohesion: 0.14
Nodes (17): ref_supabase_server_core, RecoveryCheckpoint, decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), AuthenticatedUser, hashToken() (+9 more)

### Community 47 - ".loadSnapshot"
Cohesion: 0.52
Nodes (3): decodePersistedYjsUpdate(), legacyBufferShape(), persistedRawBytes()

### Community 48 - "measure-responsiveness.ts"
Cohesion: 0.24
Nodes (8): September 26 localhost responsiveness benchmark, Lazy route split transferred-byte evidence, Unmeasured production and provider timing, ref_node_perf_hooks, median(), run(), Sample, wait()

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (30): BASIC_ACCOUNTING, BASIC_LIMIT, DllImport, EXTENDED_LIMIT, FileSystemRights, IntPtr, IO_COUNTERS, PROCESS_INFORMATION (+22 more)

### Community 50 - "invitation-email.ts"
Cohesion: 0.33
Nodes (5): html(), InvitationDelivery, InvitationEmail, invitationEmailSenderFromEnv(), validSender()

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
Nodes (10): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), ProviderRequestRecord (+2 more)

### Community 55 - "main.tsx"
Cohesion: 0.24
Nodes (8): Historical unreachable scaffold candidates, Vite HTML client mount, ref_react_dom_client, App, ProjectApp, src_studio_ivory, src_styles, clientAuthMode

### Community 56 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 57 - "event-store.ts"
Cohesion: 0.18
Nodes (10): EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow, taskTransitions (+2 more)

### Community 58 - "cocreate.test.ts"
Cohesion: 0.53
Nodes (3): keepLastSuccess(), shouldPromoteRevision(), previewDocument()

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (38): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27, Draggable effort toggle and visible project naming (2026-09-25), Email invitations, complete auth, project names, and segmented effort (2026-09-25) (+30 more)

### Community 60 - "harness/checklist.md"
Cohesion: 0.24
Nodes (8): October 3 Graphify maintenance evidence, October 3 cleanup plan history, October 1 reliability verification history, October 1 Studio Ivory local checks history, Reliability source audit and controlled causes, Canvas Shared context and accepted revision history, graphify-out/SOURCE_MAP.md, Vercel TypeSafe-compatible endpoint documentation

### Community 61 - ".github/workflows/code-checks.yml"
Cohesion: 0.43
Nodes (6): Frozen pnpm lockfile installation, Commit-pinned GitHub Actions, Code checks on push and pull request, CI pnpm 10.18.3 and Node 24, Import-boundary, test and build gates, Offline GitHub code validation

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "ref_node_path"
Cohesion: 0.08
Nodes (23): ref_node_child_process, ref_node_os, ref_node_path, browser, output, profile, browser, outputDir (+15 more)

### Community 64 - "IntentReview.tsx"
Cohesion: 0.18
Nodes (8): IntentCommandResult, IntentTarget, InterpretationIntentCategory, SharedRequirementSource, src_intent_review, caption(), Edit, IntentReview()

### Community 65 - "browser.ts"
Cohesion: 0.42
Nodes (7): ref_node_string_decoder, assertVerificationBrowserAvailable(), browserExecutable(), BrowserProtocol, unavailable(), withIsolatedBrowser(), IsolationError

### Community 66 - "safeLocalDestination"
Cohesion: 0.36
Nodes (8): safeLocalDestination(), authMessage(), ForgotPassword(), intendedDestination(), Login(), ProjectApp(), Signup(), supabaseAuthCallbackUrl()

### Community 67 - "ref_node_assert_strict"
Cohesion: 0.17
Nodes (4): ref_node_assert_strict, ref_node_http, pause(), waitFor()

### Community 68 - "contradiction-resolution-plan.md"
Cohesion: 0.40
Nodes (4): Conflict-group acceptance matrix, Additive ConflictGroup migration plan, Decisions needed and Disagreements UI target, Planned conflict alternatives and reopen mutations

### Community 69 - "artifacts.ts"
Cohesion: 0.16
Nodes (21): ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, ArtifactUnavailableError, ArtifactVersion, bodyFromBytes(), canonicalJson() (+13 more)

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "room-state.ts"
Cohesion: 0.09
Nodes (20): Shared response models, Bounded context and cost target, ArchivedVersion, ProjectSpec, AISettings, BudgetWindow, DurableStore, ProjectRole (+12 more)

### Community 72 - "requirements.test.ts"
Cohesion: 0.29
Nodes (7): buildProgressFor(), acceptedRequirementFingerprint(), acceptedRequirements(), blockedRequirementIds(), eligibleRequirements(), submitConflictSelection(), InterpretationClassification

### Community 73 - "providers.test.ts"
Cohesion: 0.32
Nodes (6): listProviderModels(), adapterFor(), discoverModels(), generateText(), ProviderConfig, schema

### Community 74 - "Harness architecture"
Cohesion: 0.10
Nodes (20): Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Browser recovery and transport batching — 2026-09-28, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary, Execution flow, Harness architecture (+12 more)

### Community 75 - "main"
Cohesion: 0.38
Nodes (7): BYOK-only MVP slice (2026-09-28), Historical workspace visual slice — 2026-09-28, cachedReview(), inputCost(), main(), reviewQuestions(), validateReview()

### Community 76 - "verify-intent-ui.ts"
Cohesion: 0.11
Nodes (16): Transport and authentication, Browser, browsers, dataDir, fake, inputs, open(), output (+8 more)

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.11
Nodes (19): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+11 more)

### Community 80 - "RoomView"
Cohesion: 0.40
Nodes (5): Rooms and sessions, 2guys1canvas presentation and invitation boundary (2026-09-30), Responsive delivery and synchronization, RoomView, WorkflowBoard()

### Community 82 - "Step 05 handoff — attributable intent and contextual references"
Cohesion: 0.33
Nodes (6): Checks and honest scope, Durability, uncertainty and compatibility, Files and decision, Outcome and reproduced boundary, Step 05 handoff — attributable intent and contextual references, Unrun release dependencies and next step

### Community 85 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 90 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 91 - "artifact-restoration.test.ts"
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

### Community 95 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.15
Nodes (11): ref_dotenv_config, @supabase/supabase-js, apply, args, backup, client, dataArg, dataDir (+3 more)

### Community 96 - "Multi-user Step 07 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Checks and retained attempts, Deliberately bounded coverage, Files, decision and handoff, Isolation and operator setup, Multi-user Step 07 handoff - 2026-10-04, Outcome and boundary

### Community 97 - "intent-commands.ts"
Cohesion: 0.18
Nodes (13): AcceptedIntentContext, generic, normalize(), sourceWords(), validateSubmittedInterpretation(), categories, fail(), intentCommandHash() (+5 more)

### Community 98 - "Step 10 - Cross-system integration and final harness review"
Cohesion: 0.33
Nodes (6): Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review

### Community 99 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 100 - "inspectSources"
Cohesion: 0.53
Nodes (6): inspectSources(), add(), reachable(), resolve(), visit(), posix()

### Community 101 - "verify-artifact-growth.ts"
Cohesion: 0.33
Nodes (5): dir, manager, observations, platform, project

### Community 102 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.40
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 103 - "Step 08 - Durable workflow budget and accounting"
Cohesion: 0.40
Nodes (5): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures

### Community 104 - "Multi-user Step 04 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites

### Community 105 - "Step 09 - Conditional interpretation concurrency and topology evaluation"
Cohesion: 0.40
Nodes (5): Actual runtime, verification and retained failures, Controlled comparison, Files, rollout and next work, Outcome and responsible boundary, Step 09 - Conditional interpretation concurrency and topology evaluation

### Community 106 - "ui-assets.md"
Cohesion: 0.40
Nodes (4): DM Serif Display font, Inter font, Lucide React icons, Generated preview style isolation

### Community 107 - "compiler-worker.cjs"
Cohesion: 0.33
Nodes (4): ref_node_net, fs, path, server_isolation_esbuild_cjs

### Community 108 - "oauth-callback.ts"
Cohesion: 0.50
Nodes (3): completeOAuthCallback(), OAuthCallbackOutcome, Callback()

### Community 109 - "ProjectFile"
Cohesion: 0.50
Nodes (4): ProjectFile, crc32(), createZip(), table

### Community 110 - "fetch"
Cohesion: 0.67
Nodes (3): Collaboration connection lifecycle, Cloudflare availability and collaboration repair evidence (2026-09-18), fetch()

## Knowledge Gaps
- **580 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+575 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 886 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `2guys1canvas harness implementation checklist` connect `2guys1canvas harness implementation checklist` to `main`, `harness/checklist.md`, `fetch`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `yjs` connect `yjs` to `live-collaboration-check.mjs`, `ref_node_assert_strict`, `EventStore`, `provider-reconnect.test.ts`, `room-state.ts`, `verify-harness-integration.ts`, `supabase-platform.ts`, `.loadSnapshot`, `measure-responsiveness.ts`, `package.json`, `index.ts`, `cocreate.test.ts`, `artifact-restoration.test.ts`, `rooms.ts`, `App.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `RoomManager` connect `RoomManager` to `EventStore`, `ref_node_assert_strict`, `verify-artifact-growth.ts`, `room-state.ts`, `registerProjectRoutes`, `Step 09 - Conditional interpretation concurrency and topology evaluation`, `verify-harness-integration.ts`, `ai-presets.test.ts`, `coordinator-fencing.test.ts`, `tool-registry.ts`, `workflow-budget.test.ts`, `index.ts`, `artifact-restoration.test.ts`, `rooms.ts`, `ref_node_path`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Are the 33 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 33 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _580 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.07704042715484363 - nodes in this community are weakly interconnected._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.07661290322580645 - nodes in this community are weakly interconnected._