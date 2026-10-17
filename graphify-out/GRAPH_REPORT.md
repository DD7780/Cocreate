# Graph Report - Devoffice  (2026-10-17)

## Corpus Check
- 263 files · ~245,844 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 6, .css 6, .example 1)

## Summary
- 2412 nodes · 5802 edges · 118 communities (101 shown, 17 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 209 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `633d513b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- README.md
- reliability.test.ts
- EventStore
- prisma/schema.prisma
- api.md
- docs/harness/decisions.md
- verify-candidate-evidence.ts
- requirements.ts
- index.ts
- providers.ts
- rules
- ProjectApp.tsx
- event-store.ts
- verify-interpretation-topology.ts
- docs/harness/codebase-cleanup-verification.md
- codebase-audit.ts
- ref_node_fs
- package.json
- compiler-worker.cjs
- ai-presets.ts
- instructions.md
- Workflow Overview change packet
- dependencies
- check-product-naming.mjs
- compilerOptions
- tool-registry.ts
- context.md
- rooms.ts
- WorkflowBoard.tsx
- product-naming.test.ts
- generateStructured
- verification.ts
- Build-save timeout publication — 2026-10-17
- supabase-platform.ts
- project.ts
- product.md
- yjs
- verify-harness-integration.ts
- live-collaboration-check.mjs
- prelaunch-release-repair.md
- TwoGuysOneCanvasProvider
- verify-intent-ui.ts
- AGENTS.md
- workflow-budget.test.ts
- generator.ts
- ai-presets.test.ts
- App.tsx
- artifact-restoration.test.ts
- IsolationRunner
- Step 05 handoff — attributable intent and contextual references
- fixtures/multiuser-baseline.ts
- scripts
- verify-build-progress.ts
- save-diagnostics.ts
- main.tsx
- Founder contacts in the public footer
- Step 10 - Cross-system integration and final harness review
- isolation.ts
- 2guys1canvas harness implementation checklist
- harness/architecture.md
- .github/workflows/code-checks.yml
- .oxfmtrc.json
- beta-access.test.ts
- verify-canvas-surface.ts
- devDependencies
- contradiction-resolution-plan.md
- submit-changes.test.ts
- verify-product-naming.mjs
- Step 06 handoff — stable progress under ongoing steering
- 24-pixel SVG favicon
- measure-responsiveness.ts
- local-drafts.ts
- Steps 6–10 integration into main
- Harness architecture
- Custom-domain private beta release packet
- Step 08 - Durable workflow budget and accounting
- 2guys1canvas context handoff
- 2guys1canvas product brief
- Step 09 - Conditional interpretation concurrency and topology evaluation
- beta-requests.ts
- .mcp.json
- Role-compatible OpenRouter models
- ui-assets.md
- 2guys1canvas AI coding instructions
- Build my changes recovery
- 2guys1canvas
- verify-coordinator-postgres.ts
- Multi-user harness improvement prompts
- AgentPanel.tsx
- intent-corrections.test.ts
- byok-lease.ts
- Public entry cleanup
- Multi-user Step 03 handoff - 2026-10-03
- Saving and provider repair — 2026-10-17
- verify-workflow-overview.ts
- Woven C brand integration
- Canonical save throughput — 2026-10-17
- fixtures/build-progress.ts
- ref_esbuild_cjs
- ref_node_assert
- Multi-user Step 07 handoff - 2026-10-04
- linux-job-launcher.c
- IntentReview.tsx
- types.ts
- container.js
- start-container.sh
- prepare-ci-cgroup.sh
- run-linux-check.sh
- Approved pre-launch landing redesign

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 115 edges
2. `Room` - 76 edges
3. `createTwoGuysOneCanvasServer()` - 67 edges
4. `SupabasePlatform` - 60 edges
5. `EventStore` - 55 edges
6. `2guys1canvas harness implementation checklist` - 40 edges
7. `IsolationRunner` - 34 edges
8. `registerProjectRoutes()` - 34 edges
9. `productEnvironment()` - 34 edges
10. `graphify-out/SOURCE_MAP.md` - 31 edges

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

## Communities (118 total, 17 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.07
Nodes (30): Submission scheduling: current implementation and required hardening, Later-step source audit, ref_node_stream, catalogRate(), effortAllowance(), AIConfig, listProviderModels(), createTwoGuysOneCanvasServer() (+22 more)

### Community 1 - "README.md"
Cohesion: 0.11
Nodes (18): Historical documentation archive, Explicit pnpm native build allowlist, Current source facade and shared contracts, Shared bounded recovery and retained artifact, Current owner-controlled BYOK setup dialog, Cloudflare Worker/container deployment boundary, Controlled three-profile reliability check, Separate pinned direct TypeSafe audit adapter (+10 more)

### Community 2 - "reliability.test.ts"
Cohesion: 0.09
Nodes (12): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, CoordinatorUnavailableError, RemoteCoordinator (+4 more)

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 5 - "api.md"
Cohesion: 0.06
Nodes (47): RoomView.requirementRevisions accepted snapshots, PKCE callback and account-choice flow, Immutable canonical WebSocket saved receipts, Capture-order interpretation and explicit recovery, Authoritative multi-option ConflictGroup, Revision-safe affected-contributor conflict selections, Workflow coordinator fencing RPC contracts, Persisted Developer task evidence (+39 more)

### Community 6 - "docs/harness/decisions.md"
Cohesion: 0.05
Nodes (43): D-0001 â€” Preserve the existing application while migrating additively, D-0002 â€” Personal interpretations are proposals, not builder authority, D-0003 â€” Build from the accepted registry, not the raw canvas, D-0004 â€” Deletion is not withdrawal, D-0005 â€” Pause on consequential accepted contradictions, D-0006 â€” Conflict groups and explicit affected-contributor agreement, D-0007 â€” Classify per intent and reprocess only by explicit participant action, D-0008 â€” Submit intent explicitly; collaborate continuously (+35 more)

### Community 7 - "verify-candidate-evidence.ts"
Cohesion: 0.13
Nodes (17): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+9 more)

### Community 8 - "requirements.ts"
Cohesion: 0.11
Nodes (36): buildProgressFor(), applyIntentCommand(), acceptanceFor(), acceptedClassification(), acceptedRequirementFingerprint(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds() (+28 more)

### Community 9 - "index.ts"
Cohesion: 0.09
Nodes (23): ref_node_assert_strict, ref_node_test, ws, b64(), createSession(), participantId(), roomToken(), Session (+15 more)

### Community 10 - "providers.ts"
Cohesion: 0.07
Nodes (35): ref_node_async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+27 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.06
Nodes (33): safeLocalDestination(), needsSessionRefresh(), clearProjectSessionCache(), completeOAuthCallback(), OAuthCallbackOutcome, authMessage(), BetaAccess(), Callback() (+25 more)

### Community 13 - "event-store.ts"
Cohesion: 0.12
Nodes (13): EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow, taskTransitions (+5 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.09
Nodes (24): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+16 more)

### Community 15 - "docs/harness/codebase-cleanup-verification.md"
Cohesion: 0.08
Nodes (35): One durable workflow and caller-only submission, Active temporary OpenRouter BYOK, Explicit Jev provider and endpoint isolation, Browser shared server module boundary, October 4 cleanup completion, October4 structural semantic graph refresh, Vercel adapter and Jev smoke completion, AdvancedAISetup call-site correction (+27 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.06
Nodes (43): Budgeted advisory Jev evidence packets, Report-only source reachability and import audit, ref_node_fs_promises, ref_node_url, typescript, cachedReview(), ImportReference, inputCost() (+35 more)

### Community 17 - "ref_node_fs"
Cohesion: 0.04
Nodes (44): ref_node_child_process, ref_node_fs, ref_node_module, ref_node_os, ref_node_path, browser, output, profile (+36 more)

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (29): engines, node, name, packageManager, private, type, version, cross-env (+21 more)

### Community 19 - "compiler-worker.cjs"
Cohesion: 0.33
Nodes (4): ref_node_net, fs, path, server_isolation_esbuild_cjs

### Community 20 - "ai-presets.ts"
Cohesion: 0.07
Nodes (38): Named AI connections (preferred API), D-0014 â€” Versioned estimates, not inferred billing, Deterministic inference-free routing, Model-routing evaluation protocol 2026-09-22.v3, Repeated trial qualification thresholds, aggregateCalls(), calculateCharge(), effectiveness() (+30 more)

### Community 21 - "instructions.md"
Cohesion: 0.10
Nodes (21): React/Vite and Express facade entrypoints, Explicit affected-contributor agreement, Advisory audit provider and model authority, Runtime external/model validation, Active memory-only OpenRouter BYOK, Durable batches and cloud save receipts, Stale-worker and promotion fencing, Same-change canonical documentation maintenance (+13 more)

### Community 22 - "Workflow Overview change packet"
Cohesion: 0.33
Nodes (6): Evidence and contracts, Implementation evidence, Outcome and scope, Verification and recovery, Workflow-only main integration — 2026-10-15, Workflow Overview change packet

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "check-product-naming.mjs"
Cohesion: 0.25
Nodes (7): classificationCounts, files, listed, policy, report, rows, unexplained

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "tool-registry.ts"
Cohesion: 0.13
Nodes (14): ActorType, FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior (+6 more)

### Community 27 - "context.md"
Cohesion: 0.10
Nodes (18): Current browser/server coordinator facades, Current temporary OpenRouter BYOK, ByokSetup is the mounted setup surface, Durable caller-owned submission capture, Prepared coordinator migration and external verification gaps, Bounded one-file recovery checkpoints, Protected migration tool retained despite false obsolete judgment, Current Canvas Shared context rail (+10 more)

### Community 28 - "rooms.ts"
Cohesion: 0.09
Nodes (35): Extracted workspace and steering helpers, ref_y_protocols_awareness, ArchivedVersion, AcceptedIntentContext, AISettings, BudgetWindow, collaborationBatchSize, DurableStore (+27 more)

### Community 29 - "WorkflowBoard.tsx"
Cohesion: 0.15
Nodes (21): Rooms and sessions, 2guys1canvas presentation and invitation boundary (2026-09-30), Responsive delivery and synchronization, ProviderRequestRecord, RoomView, src_workflow_overview, date(), number() (+13 more)

### Community 30 - "product-naming.test.ts"
Cohesion: 0.10
Nodes (21): ref_node_crypto, ref_node_vm, InvitationDelivery, InvitationEmail, invitationEmailSenderFromEnv(), transactionalEmailSenderFromEnv(), validSender(), infrastructureFiles (+13 more)

### Community 31 - "generateStructured"
Cohesion: 0.28
Nodes (7): adapterFor(), discoverModels(), generateStructured(), mergeUsage(), ProviderConfig, withProviderRetryReason(), schema

### Community 32 - "verification.ts"
Cohesion: 0.26
Nodes (11): assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript, planVerification() (+3 more)

### Community 33 - "Build-save timeout publication — 2026-10-17"
Cohesion: 0.50
Nodes (4): Bounded change packet, Build-save timeout publication — 2026-10-17, Integrated behavior, Verification and publication

### Community 34 - "supabase-platform.ts"
Cohesion: 0.05
Nodes (58): express, ref_supabase_server_core, ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, artifactResponse(), ArtifactUnavailableError (+50 more)

### Community 35 - "project.ts"
Cohesion: 0.12
Nodes (25): ref_node_path_posix, addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, generateProjectPlan(), mergeUsage(), allowedExtensions (+17 more)

### Community 36 - "product.md"
Cohesion: 0.11
Nodes (17): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02, Serialized eight-task and 24-call recovery, Disconnected-first OpenRouter BYOK setup, Attributed capture-order interpretation, Collaborative submission-to-artifact loop (+9 more)

### Community 37 - "yjs"
Cohesion: 0.18
Nodes (7): yjs, deletionSignature(), ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), FakeWebSocket

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.11
Nodes (20): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+12 more)

### Community 39 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 40 - "prelaunch-release-repair.md"
Cohesion: 0.13
Nodes (13): Exact owner and approval process, Pre-launch and private beta change packet, Release prerequisites and rollback, Verification and handoff, Conditional same-host alternative, Evidence and smallest next action, If delegation is unavailable, Linux browser isolation: bounded alternative and platform questions (+5 more)

### Community 42 - "verify-intent-ui.ts"
Cohesion: 0.06
Nodes (30): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+22 more)

### Community 43 - "AGENTS.md"
Cohesion: 0.18
Nodes (10): Durable workflow is the primary shared object, Bounded feature change packet, Graphify scoped source navigation, AST-only graph refresh, Graphify wiki broad navigation, Targets versus verified implementation, Offline Jev rankings are advisory, One logical coordinator (+2 more)

### Community 44 - "workflow-budget.test.ts"
Cohesion: 0.42
Nodes (8): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), usedBudget()

### Community 45 - "generator.ts"
Cohesion: 0.11
Nodes (21): boundedInput(), callOpenAI(), classification, compactRequirement(), compactSharedRequirement(), compactText(), DEFAULT_PROJECT_OUTPUT_TOKENS, extractRequirement() (+13 more)

### Community 46 - "ai-presets.test.ts"
Cohesion: 0.25
Nodes (9): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), effortLevels, AIWorkflowMode (+1 more)

### Community 47 - "App.tsx"
Cohesion: 0.09
Nodes (26): Reference-led presentation update (2026-09-30), kinds, previewInitType(), PreviewKind, previewMessageKind(), BuildProgress, WorkflowStatus, FormatChoice (+18 more)

### Community 48 - "artifact-restoration.test.ts"
Cohesion: 0.09
Nodes (21): ref_node_http, dir, manager, observations, platform, project, Browser, browsers (+13 more)

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (30): BASIC_ACCOUNTING, BASIC_LIMIT, DllImport, EXTENDED_LIMIT, FileSystemRights, IntPtr, IO_COUNTERS, PROCESS_INFORMATION (+22 more)

### Community 50 - "Step 05 handoff — attributable intent and contextual references"
Cohesion: 0.33
Nodes (6): Checks and honest scope, Durability, uncertainty and compatibility, Files and decision, Outcome and reproduced boundary, Step 05 handoff — attributable intent and contextual references, Unrun release dependencies and next step

### Community 51 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.16
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 52 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, audit:code, build, check:boundaries, deploy:cloudflare, dev, migrate:legacy, start (+1 more)

### Community 53 - "verify-build-progress.ts"
Cohesion: 0.15
Nodes (15): address, Browser, browsers, candidates, converge(), dataDir, fake, gates (+7 more)

### Community 54 - "save-diagnostics.ts"
Cohesion: 0.33
Nodes (5): safeId(), Stage, Timing, DOCUMENT_FLUSH_WAIT_MS, DOCUMENT_SAVE_TIMEOUT_MS

### Community 55 - "main.tsx"
Cohesion: 0.09
Nodes (22): Vite HTML client mount, lucide-react, react, ref_react_dom_client, BrandMark(), ByokSetup(), dollars(), Lease (+14 more)

### Community 56 - "Founder contacts in the public footer"
Cohesion: 0.33
Nodes (6): Approved scope, Founder contacts in the public footer, Icon presentation follow-up — 2026-10-16, Local verification, Verification plan, LandingPage()

### Community 57 - "Step 10 - Cross-system integration and final harness review"
Cohesion: 0.33
Nodes (6): Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review

### Community 58 - "isolation.ts"
Cohesion: 0.07
Nodes (42): Linux verification follow-up — 2026-10-08, ref_node_events, ref_node_string_decoder, executable, sandbox, assertIsolationAvailable(), assertVerificationBrowserAvailable(), browserExecutable() (+34 more)

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (40): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+32 more)

### Community 60 - "harness/architecture.md"
Cohesion: 0.10
Nodes (23): October 1 local reliability evidence, Bounded complete-file recovery, Participant-scoped IndexedDB recovery, Immutable insertion and deletion save receipts, Single coordinator and lease fencing, Remaining hosted owner routing and archive limits, Verified-email invitations preserve roles and links, Offline developer audit boundary (+15 more)

### Community 61 - ".github/workflows/code-checks.yml"
Cohesion: 0.43
Nodes (6): Frozen pnpm lockfile installation, Commit-pinned GitHub Actions, Code checks on push and pull request, CI pnpm 10.18.3 and Node 24, Import-boundary, test and build gates, Offline GitHub code validation

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "beta-access.test.ts"
Cohesion: 0.13
Nodes (15): ref_node_sqlite, approved, browser, checks, chrome, directory, local, output (+7 more)

### Community 64 - "verify-canvas-surface.ts"
Cohesion: 0.20
Nodes (9): browser, checks, errors, output, room, runtime, sockets, until() (+1 more)

### Community 65 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 66 - "contradiction-resolution-plan.md"
Cohesion: 0.40
Nodes (4): Conflict-group acceptance matrix, Additive ConflictGroup migration plan, Decisions needed and Disagreements UI target, Planned conflict alternatives and reopen mutations

### Community 67 - "submit-changes.test.ts"
Cohesion: 0.40
Nodes (3): SubmissionOptions, SubmissionResult, submitDraftChanges()

### Community 68 - "verify-product-naming.mjs"
Cohesion: 0.18
Nodes (8): esbuild, baseline, browser, checks, dir, frames, legacyPreview, output

### Community 69 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "measure-responsiveness.ts"
Cohesion: 0.24
Nodes (8): September 26 localhost responsiveness benchmark, Lazy route split transferred-byte evidence, Unmeasured production and provider timing, ref_node_perf_hooks, median(), run(), Sample, wait()

### Community 72 - "local-drafts.ts"
Cohesion: 0.18
Nodes (11): browserDraftStore, database(), draftKey(), DraftStore, LocalDraftStatus, mergeDatabase(), persistDraft(), readDatabase() (+3 more)

### Community 73 - "Steps 6–10 integration into main"
Cohesion: 0.50
Nodes (4): Fresh verification, Operational boundaries, Resolution and preserved contracts, Steps 6–10 integration into main

### Community 74 - "Harness architecture"
Cohesion: 0.10
Nodes (21): Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Bounded context and cost target, Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary (+13 more)

### Community 75 - "Custom-domain private beta release packet"
Cohesion: 0.22
Nodes (9): Acceptance evidence and handoff, Blocked deployment repair packet — 2026-10-08, Current execution status, Custom-domain private beta release packet, Latest verified handoff — 2026-10-08, Outcome and bounded scope, Prepared changes and compatibility, Verification, execution and recovery plan (+1 more)

### Community 76 - "Step 08 - Durable workflow budget and accounting"
Cohesion: 0.40
Nodes (5): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 79 - "Step 09 - Conditional interpretation concurrency and topology evaluation"
Cohesion: 0.40
Nodes (5): Actual runtime, verification and retained failures, Controlled comparison, Files, rollout and next work, Outcome and responsible boundary, Step 09 - Conditional interpretation concurrency and topology evaluation

### Community 80 - "beta-requests.ts"
Cohesion: 0.06
Nodes (41): Beta access request change packet — 2026-10-09, Evidence and release status, Initial external configuration observations, Operations and manual acceptance, Outcome and bounded scope, Stage contracts and acceptance, Verified deployment — 2026-10-09, Authorized main publication — 2026-10-16 (+33 more)

### Community 82 - "Role-compatible OpenRouter models"
Cohesion: 0.50
Nodes (4): Change packet — 2026-10-16, Live release, Role-compatible OpenRouter models, Verification and release

### Community 85 - "ui-assets.md"
Cohesion: 0.40
Nodes (4): DM Serif Display font, Inter font, Lucide React icons, Generated preview style isolation

### Community 90 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 91 - "Build my changes recovery"
Cohesion: 0.50
Nodes (4): Build my changes recovery, Change packet — 2026-10-16, Implementation and evidence, Publication and remaining acceptance

### Community 92 - "2guys1canvas"
Cohesion: 0.13
Nodes (15): 2guys1canvas, Active hosted MVP: OpenRouter BYOK, AI steering documents, Architecture, Checks, Connect AI, Current boundaries, Current product setup (2026-09-30) (+7 more)

### Community 93 - "verify-coordinator-postgres.ts"
Cohesion: 0.13
Nodes (11): pg, a, admin, b, checks, ownerA, ownerB, project (+3 more)

### Community 94 - "Multi-user harness improvement prompts"
Cohesion: 0.15
Nodes (13): Common contract, Multi-user harness improvement prompts, Starting instruction, Step 01 - Audit, scenarios and baseline, Step 02 - Coordinator fencing and owner routing, Step 03 - Artifact persistence and restoration, Step 04 - Generated execution isolation, Step 05 - Intent inspection, correction and contextual references (+5 more)

### Community 95 - "AgentPanel.tsx"
Cohesion: 0.13
Nodes (21): Canvas writing surface, Evidence and contracts, Local evidence, Requested outcome and boundaries, Verification plan, AIEffort, AIResolvedLayer, dollars() (+13 more)

### Community 96 - "intent-corrections.test.ts"
Cohesion: 0.15
Nodes (16): clean(), demoExtract(), AgentChange, generic, normalize(), sourceWords(), validateSubmittedInterpretation(), categories (+8 more)

### Community 97 - "byok-lease.ts"
Cohesion: 0.22
Nodes (9): BYOK_LEASE_MS, BYOK_MODEL_VERSION, BYOK_ROLE_LIMITS, Lease, LeaseModel, modelsFrom(), nonnegative(), AIReasoningConfig (+1 more)

### Community 98 - "Public entry cleanup"
Cohesion: 0.50
Nodes (4): Local evidence and review handoff, Navigation and verification plan, Public entry cleanup, Requested outcome and boundaries

### Community 99 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.10
Nodes (18): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff, Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision (+10 more)

### Community 100 - "Saving and provider repair — 2026-10-17"
Cohesion: 0.33
Nodes (6): Bounded change packet, Demonstrated defects and changes, Local verification and limits, Provider contract review and hosted evidence, Remaining acceptance and recovery, Saving and provider repair — 2026-10-17

### Community 101 - "verify-workflow-overview.ts"
Cohesion: 0.10
Nodes (16): browser, dataDir, group, profile, room, token, browser, checks (+8 more)

### Community 102 - "Woven C brand integration"
Cohesion: 0.50
Nodes (4): Approval and scope, Evidence and contracts, Verification and publication, Woven C brand integration

### Community 103 - "Canonical save throughput — 2026-10-17"
Cohesion: 0.67
Nodes (3): Bounded change packet, Canonical save throughput — 2026-10-17, Results

### Community 109 - "Multi-user Step 07 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Checks and retained attempts, Deliberately bounded coverage, Files, decision and handoff, Isolation and operator setup, Multi-user Step 07 handoff - 2026-10-04, Outcome and boundary

### Community 114 - "linux-job-launcher.c"
Cohesion: 0.29
Nodes (5): errno, prctl, signal, stdio, unistd

### Community 116 - "IntentReview.tsx"
Cohesion: 0.20
Nodes (13): IntentTarget, InterpretationIntentCategory, SharedRequirementSource, Join(), enter(), legacyKey(), readBrowserStorage(), removeBrowserStorage() (+5 more)

### Community 117 - "types.ts"
Cohesion: 0.10
Nodes (20): Shared response models, AgentStatus, AIConnection, AIRateTier, AIRoutingEvidenceStatus, CapabilityCheck, ConflictAlternative, ConflictDecisionRecord (+12 more)

### Community 121 - "container.js"
Cohesion: 0.12
Nodes (14): Bounded change packet, Canonical product naming — 2026-10-17, Compatibility plan and rollback, Completed inventory and fresh local verification, Production-image gate, Residual ledger and cutover, Verification, @cloudflare/containers (+6 more)

### Community 132 - "Approved pre-launch landing redesign"
Cohesion: 0.40
Nodes (5): Approved pre-launch landing redesign, Bounded scope, Contracts to preserve, Outcome and authority, Verification and release

## Knowledge Gaps
- **730 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+725 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1073 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SupabasePlatform` connect `supabase-platform.ts` to `reliability.test.ts`, `index.ts`, `beta-requests.ts`, `artifact-restoration.test.ts`, `product-naming.test.ts`, `beta-access.test.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `RoomManager` connect `RoomManager` to `intent-corrections.test.ts`, `supabase-platform.ts`, `EventStore`, `reliability.test.ts`, `fixtures/build-progress.ts`, `index.ts`, `requirements.ts`, `workflow-budget.test.ts`, `ai-presets.test.ts`, `Step 09 - Conditional interpretation concurrency and topology evaluation`, `artifact-restoration.test.ts`, `ref_node_fs`, `codebase-audit.ts`, `fixtures/multiuser-baseline.ts`, `types.ts`, `tool-registry.ts`, `rooms.ts`, `product-naming.test.ts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `2guys1canvas harness implementation checklist` connect `2guys1canvas harness implementation checklist` to `harness/architecture.md`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Are the 33 inferred relationships involving `createTwoGuysOneCanvasServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createTwoGuysOneCanvasServer()` has 33 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _730 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.07221243733911394 - nodes in this community are weakly interconnected._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.10507246376811594 - nodes in this community are weakly interconnected._