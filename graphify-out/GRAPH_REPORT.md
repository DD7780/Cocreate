# Graph Report - Devoffice  (2026-10-18)

## Corpus Check
- 271 files · ~249,468 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 6, .css 6, .example 1)

## Summary
- 2471 nodes · 6042 edges · 143 communities (125 shown, 18 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 220 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `49f2c302`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createTwoGuysOneCanvasServer
- README.md
- CoordinatorUnavailableError
- EventStore
- prisma/schema.prisma
- api.md
- docs/harness/decisions.md
- verify-candidate-evidence.ts
- requirements.ts
- ref_node_path
- providers.ts
- rules
- ProjectApp.tsx
- event-store.ts
- verify-interpretation-topology.ts
- AGENTS.md
- codebase-audit.ts
- product-naming.test.ts
- package.json
- generated-isolation.test.ts
- ai-presets.ts
- instructions.md
- SaveTrace
- dependencies
- artifacts.ts
- compilerOptions
- tool-registry.ts
- context.md
- types.ts
- rooms.ts
- ref_node_crypto
- project.ts
- verification.ts
- Saving and provider repair — 2026-10-17
- SupabasePlatform
- generator.ts
- Step 08 - Durable workflow budget and accounting
- WorkspaceScope
- verify-harness-integration.ts
- live-collaboration-check.mjs
- prelaunch-release-repair.md
- 2guys1canvas API reference
- verify-intent-ui.ts
- supabase-platform.ts
- RoomManager
- ref_node_child_process
- Workflow Overview change packet
- App.tsx
- artifact-restoration.test.ts
- IsolationRunner
- Multi-user Step 04 handoff - 2026-10-04
- fixtures/multiuser-baseline.ts
- scripts
- verify-build-progress.ts
- token
- main.tsx
- .save
- .buildLoop
- isolation.ts
- 2guys1canvas harness implementation checklist
- docs/harness/reliability-verification.md
- .github/workflows/code-checks.yml
- .oxfmtrc.json
- event-store.test.ts
- verify-canvas-surface.ts
- devDependencies
- managed-catalog.ts
- Room
- verify-capture-command.mjs
- generateStructured
- 24-pixel SVG favicon
- registerBetaRequestRoutes
- workflow-budget.test.ts
- graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md
- Harness architecture
- Custom-domain private beta release packet
- productEnvironment
- 2guys1canvas context handoff
- 2guys1canvas product brief
- local-drafts.ts
- beta-requests.ts
- .mcp.json
- LinuxJobGroup
- registerProjectRoutes
- 2guys1canvas AI coding instructions
- ref_node_assert_strict
- 2guys1canvas
- verify-coordinator-postgres.ts
- Multi-user harness improvement prompts
- WorkflowBoard.tsx
- verify-workflow-overview.ts
- linux-cgroup-isolation.test.ts
- cloudflare-container.test.ts
- Multi-user Step 03 handoff - 2026-10-03
- ai-accounting.ts
- index.ts
- ByokSetup.tsx
- .loadSnapshot
- yjs
- ref_esbuild_cjs
- ref_node_assert
- ui-assets.md
- check-product-naming.mjs
- auth-config.ts
- Beta access request change packet — 2026-10-09
- Step 05 handoff — attributable intent and contextual references
- linux-job-launcher.c
- Step 10 - Cross-system integration and final harness review
- IntentReview.tsx
- byok-lease.ts
- release-fingerprint.mjs
- usage-ledger.ts
- contradiction-resolution-plan.md
- Canonical product naming — 2026-10-17
- Approved pre-launch landing redesign
- RoomView
- managed-ai.test.ts
- Step 09 - Conditional interpretation concurrency and topology evaluation
- Build-save timeout publication — 2026-10-17
- Build my changes recovery
- start-container.sh
- prepare-ci-cgroup.sh
- run-linux-check.sh
- Steps 6–10 integration into main
- harness/architecture.md
- model-evaluation.md
- Public entry cleanup
- live-browser-collaboration-check.mjs
- Canvas capture command replacement — 2026-10-17
- Role-compatible OpenRouter models
- Woven C brand integration
- CaptureRecord
- Durable WorkflowOverview projection
- product.md
- Beta registration visibility — 2026-10-16

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 120 edges
2. `Room` - 79 edges
3. `createTwoGuysOneCanvasServer()` - 69 edges
4. `SupabasePlatform` - 63 edges
5. `EventStore` - 58 edges
6. `2guys1canvas harness implementation checklist` - 40 edges
7. `IsolationRunner` - 34 edges
8. `registerProjectRoutes()` - 34 edges
9. `productEnvironment()` - 34 edges
10. `yjs` - 32 edges

## Surprising Connections (you probably didn't know these)
- `Outcome and responsible boundary` --references--> `bundleProject()`  [INFERRED]
  docs/harness/multiuser-step04-handoff.md → server/project.ts
- `Actual runtime, verification and retained failures` --references--> `RoomManager`  [INFERRED]
  docs/harness/multiuser-step09-handoff.md → server/rooms.ts
- `Bounded context and cost target` --references--> `AIRunRecord`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → shared/types.ts
- `Results` --references--> `LocalWaitlist`  [INFERRED]
  docs/harness/beta-registration-visibility.md → server/beta.ts
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

## Communities (143 total, 18 thin omitted)

### Community 0 - "createTwoGuysOneCanvasServer"
Cohesion: 0.14
Nodes (9): ref_node_stream, listProviderModels(), createTwoGuysOneCanvasServer(), now(), AIEffort, AIFormat, AIProvider, AIWorkflowMode (+1 more)

### Community 1 - "README.md"
Cohesion: 0.11
Nodes (18): Historical documentation archive, Explicit pnpm native build allowlist, Current source facade and shared contracts, Shared bounded recovery and retained artifact, Current owner-controlled BYOK setup dialog, Cloudflare Worker/container deployment boundary, Controlled three-profile reliability check, Separate pinned direct TypeSafe audit adapter (+10 more)

### Community 2 - "CoordinatorUnavailableError"
Cohesion: 0.17
Nodes (8): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, CoordinatorUnavailableError, RemoteCoordinator

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 5 - "api.md"
Cohesion: 0.10
Nodes (25): RoomView.requirementRevisions accepted snapshots, PKCE callback and account-choice flow, Immutable canonical WebSocket saved receipts, Capture-order interpretation and explicit recovery, Authoritative multi-option ConflictGroup, Revision-safe affected-contributor conflict selections, Workflow coordinator fencing RPC contracts, Durable idempotent participant submission (+17 more)

### Community 6 - "docs/harness/decisions.md"
Cohesion: 0.05
Nodes (43): D-0001 â€” Preserve the existing application while migrating additively, D-0002 â€” Personal interpretations are proposals, not builder authority, D-0003 â€” Build from the accepted registry, not the raw canvas, D-0004 â€” Deletion is not withdrawal, D-0005 â€” Pause on consequential accepted contradictions, D-0006 â€” Conflict groups and explicit affected-contributor agreement, D-0007 â€” Classify per intent and reprocess only by explicit participant action, D-0008 â€” Submit intent explicitly; collaborate continuously (+35 more)

### Community 7 - "verify-candidate-evidence.ts"
Cohesion: 0.14
Nodes (16): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+8 more)

### Community 8 - "requirements.ts"
Cohesion: 0.09
Nodes (39): buildProgressFor(), acceptanceFor(), acceptedClassification(), acceptedRequirementFingerprint(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries() (+31 more)

### Community 9 - "ref_node_path"
Cohesion: 0.10
Nodes (12): ref_node_os, ref_node_path, browser, output, profile, schema, browser, profile (+4 more)

### Community 10 - "providers.ts"
Cohesion: 0.07
Nodes (35): ref_node_async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+27 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.06
Nodes (32): @supabase/supabase-js, safeLocalDestination(), needsSessionRefresh(), clearProjectSessionCache(), completeOAuthCallback(), OAuthCallbackOutcome, authMessage(), BetaAccess() (+24 more)

### Community 13 - "event-store.ts"
Cohesion: 0.12
Nodes (13): EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow, taskTransitions (+5 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.10
Nodes (23): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+15 more)

### Community 15 - "AGENTS.md"
Cohesion: 0.05
Nodes (53): Durable workflow is the primary shared object, Bounded feature change packet, Graphify scoped source navigation, AST-only graph refresh, Graphify wiki broad navigation, Targets versus verified implementation, Offline Jev rankings are advisory, One logical coordinator (+45 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.08
Nodes (36): September 26 localhost responsiveness benchmark, Lazy route split transferred-byte evidence, Unmeasured production and provider timing, Budgeted advisory Jev evidence packets, Report-only source reachability and import audit, ref_node_fs_promises, ref_node_perf_hooks, ref_node_url (+28 more)

### Community 17 - "product-naming.test.ts"
Cohesion: 0.11
Nodes (12): esbuild, ref_node_vm, baseline, browser, checks, dir, frames, legacyPreview (+4 more)

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (28): engines, node, name, packageManager, private, type, version, cross-env (+20 more)

### Community 19 - "generated-isolation.test.ts"
Cohesion: 0.17
Nodes (7): ref_node_events, ref_node_net, fs, path, server_isolation_esbuild_cjs, files, jobs

### Community 20 - "ai-presets.ts"
Cohesion: 0.09
Nodes (29): D-0014 â€” Versioned estimates, not inferred billing, maximumAllowanceCharge(), EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials() (+21 more)

### Community 21 - "instructions.md"
Cohesion: 0.08
Nodes (24): Planned feature change evidence packet, Protected submission, save and coordinator semantics, TypeSafe reranking workflow cited in pilot plan, React/Vite and Express facade entrypoints, Explicit affected-contributor agreement, Advisory audit provider and model authority, Runtime external/model validation, Active memory-only OpenRouter BYOK (+16 more)

### Community 22 - "SaveTrace"
Cohesion: 0.23
Nodes (4): safeId(), SaveTrace, Stage, Timing

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "artifacts.ts"
Cohesion: 0.15
Nodes (21): ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, ArtifactUnavailableError, ArtifactVersion, bodyFromBytes(), canonicalJson() (+13 more)

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "tool-registry.ts"
Cohesion: 0.13
Nodes (14): ActorType, FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior (+6 more)

### Community 27 - "context.md"
Cohesion: 0.10
Nodes (18): Current browser/server coordinator facades, Current temporary OpenRouter BYOK, Durable caller-owned submission capture, Prepared coordinator migration and external verification gaps, Bounded one-file recovery checkpoints, Protected migration tool retained despite false obsolete judgment, October 1 local reliability evidence, Current Canvas Shared context rail (+10 more)

### Community 28 - "types.ts"
Cohesion: 0.07
Nodes (31): Named AI connections (preferred API), Shared response models, applyIntentCommand(), categories, fail(), intentCommandHash(), parseIntentCommand(), AgentStatus (+23 more)

### Community 29 - "rooms.ts"
Cohesion: 0.09
Nodes (32): Extracted workspace and steering helpers, ref_y_protocols_awareness, ArchivedVersion, replayCaptureJournal(), AcceptedIntentContext, AISettings, BudgetWindow, collaborationBatchSize (+24 more)

### Community 30 - "ref_node_crypto"
Cohesion: 0.42
Nodes (6): ref_node_crypto, ref_node_module, betaAccounts, betaDatabase, SqlResult, betaPlatform()

### Community 31 - "project.ts"
Cohesion: 0.11
Nodes (27): ref_node_path_posix, addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, generateProjectPlan(), mergeUsage(), allowedExtensions (+19 more)

### Community 32 - "verification.ts"
Cohesion: 0.26
Nodes (11): assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript, planVerification() (+3 more)

### Community 33 - "Saving and provider repair — 2026-10-17"
Cohesion: 0.33
Nodes (6): Bounded change packet, Demonstrated defects and changes, Local verification and limits, Provider contract review and hosted evidence, Remaining acceptance and recovery, Saving and provider repair — 2026-10-17

### Community 34 - "SupabasePlatform"
Cohesion: 0.18
Nodes (3): fail(), normalizeProjectTitle(), SupabasePlatform

### Community 35 - "generator.ts"
Cohesion: 0.11
Nodes (24): clean(), demoExtract(), AgentChange, classification, compactRequirement(), compactSharedRequirement(), compactText(), DEFAULT_PROJECT_OUTPUT_TOKENS (+16 more)

### Community 36 - "Step 08 - Durable workflow budget and accounting"
Cohesion: 0.40
Nodes (5): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures

### Community 37 - "WorkspaceScope"
Cohesion: 0.15
Nodes (6): CaptureSource, WorkspaceScope(), CaptureCommandController, persistDraft(), restoreDraft(), TwoGuysOneCanvasProvider

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.12
Nodes (19): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+11 more)

### Community 39 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 40 - "prelaunch-release-repair.md"
Cohesion: 0.13
Nodes (13): Exact owner and approval process, Pre-launch and private beta change packet, Release prerequisites and rollback, Verification and handoff, Conditional same-host alternative, Evidence and smallest next action, If delegation is unavailable, Linux browser isolation: bounded alternative and platform questions (+5 more)

### Community 41 - "2guys1canvas API reference"
Cohesion: 0.14
Nodes (14): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+6 more)

### Community 42 - "verify-intent-ui.ts"
Cohesion: 0.13
Nodes (13): Browser, browsers, dataDir, fake, inputs, open(), output, providerAddress (+5 more)

### Community 43 - "supabase-platform.ts"
Cohesion: 0.15
Nodes (16): ref_supabase_server_core, RecoveryCheckpoint, decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), AuthenticatedUser, hashToken() (+8 more)

### Community 44 - "RoomManager"
Cohesion: 0.20
Nodes (5): ClientSocket, emptyUsage(), RoomManager, setup(), fixture()

### Community 45 - "ref_node_child_process"
Cohesion: 0.12
Nodes (12): ref_node_child_process, browser, outputDir, profile, browser, outputDir, profile, browser (+4 more)

### Community 46 - "Workflow Overview change packet"
Cohesion: 0.33
Nodes (6): Evidence and contracts, Implementation evidence, Outcome and scope, Verification and recovery, Workflow-only main integration — 2026-10-15, Workflow Overview change packet

### Community 47 - "App.tsx"
Cohesion: 0.10
Nodes (23): Reference-led presentation update (2026-09-30), @tiptap/react, kinds, previewInitType(), PreviewKind, previewMessageKind(), WorkflowStatus, FormatChoice (+15 more)

### Community 48 - "artifact-restoration.test.ts"
Cohesion: 0.09
Nodes (20): dir, manager, observations, platform, project, Browser, browsers, dataDir (+12 more)

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (30): BASIC_ACCOUNTING, BASIC_LIMIT, DllImport, EXTENDED_LIMIT, FileSystemRights, IntPtr, IO_COUNTERS, PROCESS_INFORMATION (+22 more)

### Community 50 - "Multi-user Step 04 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites

### Community 51 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.16
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 52 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, audit:code, build, check:boundaries, deploy:cloudflare, dev, migrate:legacy, start (+1 more)

### Community 53 - "verify-build-progress.ts"
Cohesion: 0.14
Nodes (15): address, Browser, browsers, candidates, converge(), dataDir, fake, gates (+7 more)

### Community 54 - "token"
Cohesion: 0.67
Nodes (3): Transport and authentication, request(), token()

### Community 55 - "main.tsx"
Cohesion: 0.09
Nodes (22): Approved scope, Founder contacts in the public footer, Icon presentation follow-up — 2026-10-16, Local verification, Verification plan, Vite HTML client mount, ref_react_dom_client, BrandMark() (+14 more)

### Community 56 - ".save"
Cohesion: 0.25
Nodes (6): acceptedContext(), contradictionsFromConflictGroups(), hasOpenContradictions(), buildFingerprint(), retainSubmissions(), documentText()

### Community 57 - ".buildLoop"
Cohesion: 0.20
Nodes (7): Later-step source audit, calculateCharge(), catalogRate(), effortAllowance(), AIConfig, BudgetReservation, AISetupPolicy

### Community 58 - "isolation.ts"
Cohesion: 0.23
Nodes (17): Linux verification follow-up — 2026-10-08, assertIsolationAvailable(), cancelled(), compileIsolated(), Dependency, hostEnvironment(), IsolatedRequest, IsolationError (+9 more)

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (40): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+32 more)

### Community 60 - "docs/harness/reliability-verification.md"
Cohesion: 0.07
Nodes (28): Bounded complete-file recovery, Immutable insertion and deletion save receipts, Single coordinator and lease fencing, Active temporary OpenRouter BYOK, Cleanup protected workflow contracts, Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements (+20 more)

### Community 61 - ".github/workflows/code-checks.yml"
Cohesion: 0.43
Nodes (6): Frozen pnpm lockfile installation, Commit-pinned GitHub Actions, Code checks on push and pull request, CI pnpm 10.18.3 and Node 24, Import-boundary, test and build gates, Offline GitHub code validation

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "event-store.test.ts"
Cohesion: 0.11
Nodes (16): ref_node_sqlite, approved, browser, checks, chrome, directory, local, output (+8 more)

### Community 64 - "verify-canvas-surface.ts"
Cohesion: 0.20
Nodes (9): browser, checks, errors, output, room, runtime, sockets, until() (+1 more)

### Community 65 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 66 - "managed-catalog.ts"
Cohesion: 0.16
Nodes (13): [command,file], MANAGED_CATALOG_SOURCE, MANAGED_CATALOG_VERSION, MANAGED_DEFAULT_BUILDER, MANAGED_INTERPRETER_CANDIDATES, managedBuilder(), managedCatalog, ManagedCatalogEntry (+5 more)

### Community 68 - "verify-capture-command.mjs"
Cohesion: 0.14
Nodes (11): browser, capture, captureGate, checks, dir, envelopes, fake, interpreterGate (+3 more)

### Community 69 - "generateStructured"
Cohesion: 0.18
Nodes (11): boundedInput(), callOpenAI(), reqSchema, adapterFor(), discoverModels(), generateStructured(), generateText(), mergeUsage() (+3 more)

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "registerBetaRequestRoutes"
Cohesion: 0.38
Nodes (5): Results, BetaRequestService, databaseError(), registerBetaRequestRoutes(), rowRequest()

### Community 72 - "workflow-budget.test.ts"
Cohesion: 0.34
Nodes (10): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), ProviderRequestRecord (+2 more)

### Community 73 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.16
Nodes (16): Ambient declarations require reachability exceptions, Dated proposed codebase cleanup plan, Unmeasured optional-context reduction target, Planned deterministic reachability and boundary triage, Graph and grammar limitations in planning snapshot, Proposed model/hash/policy Jev answer cache, Proposed 20-prompt Jev evaluation, Proposed report-only Jev pilot (+8 more)

### Community 74 - "Harness architecture"
Cohesion: 0.09
Nodes (22): Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Bounded context and cost target, Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary (+14 more)

### Community 75 - "Custom-domain private beta release packet"
Cohesion: 0.22
Nodes (9): Acceptance evidence and handoff, Blocked deployment repair packet — 2026-10-08, Current execution status, Custom-domain private beta release packet, Latest verified handoff — 2026-10-08, Outcome and bounded scope, Prepared changes and compatibility, Verification, execution and recovery plan (+1 more)

### Community 76 - "productEnvironment"
Cohesion: 0.21
Nodes (13): ref_node_string_decoder, executable, sandbox, assertVerificationBrowserAvailable(), browserExecutable(), BrowserProtocol, unavailable(), withIsolatedBrowser() (+5 more)

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 79 - "local-drafts.ts"
Cohesion: 0.22
Nodes (9): browserDraftStore, database(), draftKey(), DraftStore, LocalDraftStatus, mergeDatabase(), readDatabase(), validatedUpdate() (+1 more)

### Community 80 - "beta-requests.ts"
Cohesion: 0.14
Nodes (19): BetaDelivery, betaEmailPayload(), emailHtml(), InvitationDelivery, InvitationEmail, TransactionalEmailPayload, TransactionalEmailSender, transactionalEmailSenderFromEnv() (+11 more)

### Community 82 - "LinuxJobGroup"
Cohesion: 0.29
Nodes (3): LinuxJobGroup, unavailable(), wait()

### Community 85 - "registerProjectRoutes"
Cohesion: 0.22
Nodes (10): artifactResponse(), InvitationEmailSender, appOrigin(), bearer(), displayName(), message(), recipientKey(), registerProjectRoutes() (+2 more)

### Community 90 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 91 - "ref_node_assert_strict"
Cohesion: 0.12
Nodes (11): ref_node_assert_strict, ref_node_http, ref_node_test, model(), createProgressFixture(), pause(), waitFor(), captureAndProcess() (+3 more)

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
Cohesion: 0.10
Nodes (32): Canvas writing surface, Evidence and contracts, Local evidence, Requested outcome and boundaries, Verification plan, react, AIResolvedLayer, dollars() (+24 more)

### Community 96 - "verify-workflow-overview.ts"
Cohesion: 0.15
Nodes (9): browser, checks, errors, midnight, output, room, runtime, sockets (+1 more)

### Community 97 - "linux-cgroup-isolation.test.ts"
Cohesion: 0.24
Nodes (8): linuxBrowserFileBytes, linuxBrowserFileDescriptors, output(), jobs(), linux, noGroups(), removed(), wait()

### Community 98 - "cloudflare-container.test.ts"
Cohesion: 0.23
Nodes (7): @cloudflare/containers, ref_cloudflare_workers, root, baseEnv, fetch(), scheduled(), legacyOriginResponse()

### Community 99 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 100 - "ai-accounting.ts"
Cohesion: 0.27
Nodes (9): aggregateCalls(), effectiveness(), EffectivenessGroup, VERIFICATION_POLICY_VERSION, LegacyAISpecialty, TaskComplexity, call(), rate() (+1 more)

### Community 101 - "index.ts"
Cohesion: 0.08
Nodes (30): express, ref_node_fs, ws, browser, dataDir, group, profile, room (+22 more)

### Community 102 - "ByokSetup.tsx"
Cohesion: 0.24
Nodes (8): ByokSetup is the mounted setup surface, lucide-react, AIConnection, ByokSetup(), dollars(), Lease, ModelChoice(), request()

### Community 103 - ".loadSnapshot"
Cohesion: 0.33
Nodes (4): decodePersistedYjsUpdate(), encodePostgresBytea(), legacyBufferShape(), persistedRawBytes()

### Community 104 - "yjs"
Cohesion: 0.09
Nodes (24): yjs, states(), CAPTURE_VERSION, captureCovers(), CaptureEnvelope, CaptureState, decodeCaptureBytes(), encodeCaptureBytes() (+16 more)

### Community 107 - "ui-assets.md"
Cohesion: 0.21
Nodes (7): Bounded change packet, Canonical save throughput — 2026-10-17, Results, DM Serif Display font, Inter font, Lucide React icons, Generated preview style isolation

### Community 108 - "check-product-naming.mjs"
Cohesion: 0.25
Nodes (7): classificationCounts, files, listed, policy, report, rows, unexplained

### Community 109 - "auth-config.ts"
Cohesion: 0.36
Nodes (7): canonicalProductEnvironment(), legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution

### Community 110 - "Beta access request change packet — 2026-10-09"
Cohesion: 0.29
Nodes (7): Beta access request change packet — 2026-10-09, Evidence and release status, Initial external configuration observations, Operations and manual acceptance, Outcome and bounded scope, Stage contracts and acceptance, Verified deployment — 2026-10-09

### Community 113 - "Step 05 handoff — attributable intent and contextual references"
Cohesion: 0.33
Nodes (6): Checks and honest scope, Durability, uncertainty and compatibility, Files and decision, Outcome and reproduced boundary, Step 05 handoff — attributable intent and contextual references, Unrun release dependencies and next step

### Community 114 - "linux-job-launcher.c"
Cohesion: 0.29
Nodes (5): errno, prctl, signal, stdio, unistd

### Community 115 - "Step 10 - Cross-system integration and final harness review"
Cohesion: 0.33
Nodes (6): Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review

### Community 116 - "IntentReview.tsx"
Cohesion: 0.19
Nodes (14): IntentCommand, IntentTarget, InterpretationIntentCategory, Join(), enter(), legacyKey(), readBrowserStorage(), removeBrowserStorage() (+6 more)

### Community 117 - "byok-lease.ts"
Cohesion: 0.22
Nodes (9): BYOK_LEASE_MS, BYOK_MODEL_VERSION, BYOK_ROLE_LIMITS, Lease, LeaseModel, modelsFrom(), nonnegative(), AIReasoningConfig (+1 more)

### Community 118 - "release-fingerprint.mjs"
Cohesion: 0.33
Nodes (5): buildFiles, config, files, fingerprint, hash

### Community 119 - "usage-ledger.ts"
Cohesion: 0.40
Nodes (5): aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes, AIUsage

### Community 120 - "contradiction-resolution-plan.md"
Cohesion: 0.40
Nodes (4): Conflict-group acceptance matrix, Additive ConflictGroup migration plan, Decisions needed and Disagreements UI target, Planned conflict alternatives and reopen mutations

### Community 121 - "Canonical product naming — 2026-10-17"
Cohesion: 0.18
Nodes (8): Bounded change packet, Canonical product naming — 2026-10-17, Compatibility plan and rollback, Completed inventory and fresh local verification, Production-image gate, Residual ledger and cutover, Verification, TwoGuysOneCanvasContainer

### Community 122 - "Approved pre-launch landing redesign"
Cohesion: 0.40
Nodes (5): Approved pre-launch landing redesign, Bounded scope, Contracts to preserve, Outcome and authority, Verification and release

### Community 123 - "RoomView"
Cohesion: 0.21
Nodes (12): Rooms and sessions, 2guys1canvas presentation and invitation boundary (2026-09-30), Responsive delivery and synchronization, AIRunRecord, NormalizedAIUsage, RoomView, VerificationSummary(), BuildAccounting() (+4 more)

### Community 125 - "Step 09 - Conditional interpretation concurrency and topology evaluation"
Cohesion: 0.40
Nodes (5): Actual runtime, verification and retained failures, Controlled comparison, Files, rollout and next work, Outcome and responsible boundary, Step 09 - Conditional interpretation concurrency and topology evaluation

### Community 126 - "Build-save timeout publication — 2026-10-17"
Cohesion: 0.50
Nodes (4): Bounded change packet, Build-save timeout publication — 2026-10-17, Integrated behavior, Verification and publication

### Community 127 - "Build my changes recovery"
Cohesion: 0.50
Nodes (4): Build my changes recovery, Change packet — 2026-10-16, Implementation and evidence, Publication and remaining acceptance

### Community 131 - "Steps 6–10 integration into main"
Cohesion: 0.50
Nodes (4): Fresh verification, Operational boundaries, Resolution and preserved contracts, Steps 6–10 integration into main

### Community 132 - "harness/architecture.md"
Cohesion: 0.13
Nodes (13): Participant-scoped IndexedDB recovery, Remaining hosted owner routing and archive limits, Verified-email invitations preserve roles and links, Offline developer audit boundary, Physical provider attempt and partial accounting, Hosted byte preservation and membership authority, 40 ms Yjs batching and explicit flush, October 3 Graphify maintenance evidence (+5 more)

### Community 133 - "model-evaluation.md"
Cohesion: 0.67
Nodes (3): Deterministic inference-free routing, Model-routing evaluation protocol 2026-09-22.v3, Repeated trial qualification thresholds

### Community 134 - "Public entry cleanup"
Cohesion: 0.50
Nodes (4): Local evidence and review handoff, Navigation and verification plan, Public entry cleanup, Requested outcome and boundaries

### Community 135 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 136 - "Canvas capture command replacement — 2026-10-17"
Cohesion: 0.18
Nodes (11): Allowed implementation and verification scope, Authorized beta migration — 2026-10-18, Canvas capture command replacement — 2026-10-17, Change packet and baseline, Contract and authority, Deletion manifest, Final source and handoff — 2026-10-18, Implemented cutover and evidence ledger (+3 more)

### Community 137 - "Role-compatible OpenRouter models"
Cohesion: 0.50
Nodes (4): Change packet — 2026-10-16, Live release, Role-compatible OpenRouter models, Verification and release

### Community 138 - "Woven C brand integration"
Cohesion: 0.50
Nodes (4): Approval and scope, Evidence and contracts, Verification and publication, Woven C brand integration

### Community 140 - "Durable WorkflowOverview projection"
Cohesion: 0.67
Nodes (3): Persisted Developer task evidence, Authenticated workflow event cursor, Durable WorkflowOverview projection

### Community 141 - "product.md"
Cohesion: 0.11
Nodes (17): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02, Serialized eight-task and 24-call recovery, Disconnected-first OpenRouter BYOK setup, Attributed capture-order interpretation, Collaborative submission-to-artifact loop (+9 more)

### Community 142 - "Beta registration visibility — 2026-10-16"
Cohesion: 0.67
Nodes (3): Authorized main publication — 2026-10-16, Beta registration visibility — 2026-10-16, Bounded change packet

## Knowledge Gaps
- **749 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+744 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1095 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SupabasePlatform` connect `SupabasePlatform` to `CoordinatorUnavailableError`, `index.ts`, `.loadSnapshot`, `registerBetaRequestRoutes`, `ref_node_path`, `supabase-platform.ts`, `beta-requests.ts`, `artifact-restoration.test.ts`, `registerProjectRoutes`, `SaveTrace`, `artifacts.ts`, `ref_node_crypto`, `event-store.test.ts`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `yjs` connect `yjs` to `index.ts`, `live-collaboration-check.mjs`, `.loadSnapshot`, `supabase-platform.ts`, `App.tsx`, `codebase-audit.ts`, `local-drafts.ts`, `package.json`, `artifact-restoration.test.ts`, `product-naming.test.ts`, `fixtures/multiuser-baseline.ts`, `ref_node_assert_strict`, `rooms.ts`, `event-store.test.ts`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `EventStore` connect `EventStore` to `.save`, `verify-harness-integration.ts`, `ref_node_path`, `CaptureRecord`, `RoomManager`, `event-store.ts`, `product-naming.test.ts`, `fixtures/multiuser-baseline.ts`, `artifacts.ts`, `tool-registry.ts`, `ref_node_assert_strict`, `rooms.ts`, `event-store.test.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Are the 35 inferred relationships involving `createTwoGuysOneCanvasServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createTwoGuysOneCanvasServer()` has 35 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _749 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createTwoGuysOneCanvasServer` be split into smaller, more focused modules?**
  _Cohesion score 0.1365079365079365 - nodes in this community are weakly interconnected._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.10507246376811594 - nodes in this community are weakly interconnected._