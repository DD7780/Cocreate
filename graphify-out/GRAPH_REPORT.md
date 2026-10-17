# Graph Report - Devoffice  (2026-10-17)

## Corpus Check
- 269 files · ~246,370 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 6, .css 6, .example 1)

## Summary
- 2462 nodes · 6005 edges · 146 communities (128 shown, 18 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 220 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `038fa80c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- README.md
- CoordinatorUnavailableError
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
- ref_node_child_process
- package.json
- compiler-worker.cjs
- ai-presets.ts
- instructions.md
- workflow-overview.md
- dependencies
- artifacts.ts
- compilerOptions
- tool-registry.ts
- context.md
- rooms.ts
- WorkflowBoard.tsx
- ref_node_crypto
- canvas.test.ts
- verification.ts
- Build-save timeout publication — 2026-10-17
- SupabasePlatform
- project.ts
- product.md
- yjs
- verify-harness-integration.ts
- live-collaboration-check.mjs
- prelaunch-release-repair.md
- TwoGuysOneCanvasProvider
- verify-intent-ui.ts
- supabase-platform.ts
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
- graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md
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
- managed-catalog.ts
- product-naming.test.ts
- Step 06 handoff — stable progress under ongoing steering
- 24-pixel SVG favicon
- measure-responsiveness.ts
- WorkspaceScope
- Steps 6–10 integration into main
- Harness architecture
- Custom-domain private beta release packet
- Step 08 - Durable workflow budget and accounting
- 2guys1canvas context handoff
- 2guys1canvas product brief
- Step 09 - Conditional interpretation concurrency and topology evaluation
- beta-requests.ts
- .mcp.json
- role-compatible-models.md
- registerProjectRoutes
- 2guys1canvas AI coding instructions
- Build my changes recovery
- 2guys1canvas
- verify-coordinator-postgres.ts
- Multi-user harness improvement prompts
- AgentPanel.tsx
- verify-capture-command.mjs
- byok-lease.ts
- Public entry cleanup
- Multi-user Step 03 handoff - 2026-10-03
- Saving and provider repair — 2026-10-17
- verify-workflow-overview.ts
- supabase.ts
- Canonical save throughput — 2026-10-17
- ref_node_assert_strict
- ref_esbuild_cjs
- ref_node_assert
- registerBetaRequestRoutes
- verify-reliability.ts
- Multi-user Step 07 handoff - 2026-10-04
- ai-accounting.ts
- .ensureWorkflow
- linux-job-launcher.c
- linux-cgroup-isolation.test.ts
- readBrowserStorage
- types.ts
- 2guys1canvas API reference
- cloudflare-container.test.ts
- migrate-legacy-to-supabase.ts
- Canonical product naming — 2026-10-17
- ByokSetup.tsx
- BuildAccounting.tsx
- OpenRouterLeases
- LinuxJobGroup
- reliability.test.ts
- build-shortcut.ts
- start-container.sh
- prepare-ci-cgroup.sh
- run-linux-check.sh
- invitation-email.ts
- landing-editorial.md
- Cleanup protected workflow contracts
- Beta access request change packet — 2026-10-09
- live-browser-collaboration-check.mjs
- Canvas capture command replacement — 2026-10-17
- Multi-user Step 02 handoff - 2026-10-03
- usage-ledger.ts
- Multi-user Step 01 evidence and handoff
- Multi-user Step 04 handoff - 2026-10-04
- Harness documentation cleanup — 2026-10-02
- model-evaluation.md
- token
- Beta registration visibility — 2026-10-16
- engines

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 119 edges
2. `Room` - 78 edges
3. `createTwoGuysOneCanvasServer()` - 68 edges
4. `SupabasePlatform` - 63 edges
5. `EventStore` - 58 edges
6. `2guys1canvas harness implementation checklist` - 40 edges
7. `IsolationRunner` - 34 edges
8. `registerProjectRoutes()` - 34 edges
9. `productEnvironment()` - 34 edges
10. `graphify-out/SOURCE_MAP.md` - 32 edges

## Surprising Connections (you probably didn't know these)
- `Outcome and boundaries` --references--> `RemoteCoordinator`  [INFERRED]
  docs/harness/multiuser-step02-handoff.md → server/coordinator.ts
- `Actual runtime, verification and retained failures` --references--> `RoomManager`  [INFERRED]
  docs/harness/multiuser-step09-handoff.md → server/rooms.ts
- `Results` --references--> `LocalWaitlist`  [INFERRED]
  docs/harness/beta-registration-visibility.md → server/beta.ts
- `Outcome and responsible boundary` --references--> `bundleProject()`  [INFERRED]
  docs/harness/multiuser-step04-handoff.md → server/project.ts
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

## Communities (146 total, 18 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.06
Nodes (39): Later-step source audit, ref_node_stream, calculateCharge(), catalogRate(), effortAllowance(), createTwoGuysOneCanvasServer(), acceptedContext(), contradictionsFromConflictGroups() (+31 more)

### Community 1 - "README.md"
Cohesion: 0.10
Nodes (18): Historical documentation archive, Explicit pnpm native build allowlist, Current source facade and shared contracts, Shared bounded recovery and retained artifact, Current owner-controlled BYOK setup dialog, Cloudflare Worker/container deployment boundary, Controlled three-profile reliability check, Separate pinned direct TypeSafe audit adapter (+10 more)

### Community 2 - "CoordinatorUnavailableError"
Cohesion: 0.16
Nodes (4): coordinatorRetry, CoordinatorUnavailableError, RemoteCoordinator, Rpc

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 5 - "api.md"
Cohesion: 0.09
Nodes (28): RoomView.requirementRevisions accepted snapshots, PKCE callback and account-choice flow, Immutable canonical WebSocket saved receipts, Capture-order interpretation and explicit recovery, Authoritative multi-option ConflictGroup, Revision-safe affected-contributor conflict selections, Workflow coordinator fencing RPC contracts, Persisted Developer task evidence (+20 more)

### Community 6 - "docs/harness/decisions.md"
Cohesion: 0.05
Nodes (43): D-0001 â€” Preserve the existing application while migrating additively, D-0002 â€” Personal interpretations are proposals, not builder authority, D-0003 â€” Build from the accepted registry, not the raw canvas, D-0004 â€” Deletion is not withdrawal, D-0005 â€” Pause on consequential accepted contradictions, D-0006 â€” Conflict groups and explicit affected-contributor agreement, D-0007 â€” Classify per intent and reprocess only by explicit participant action, D-0008 â€” Submit intent explicitly; collaborate continuously (+35 more)

### Community 7 - "verify-candidate-evidence.ts"
Cohesion: 0.13
Nodes (17): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+9 more)

### Community 8 - "requirements.ts"
Cohesion: 0.10
Nodes (38): projection(), buildProgressFor(), applyIntentCommand(), acceptanceFor(), acceptedClassification(), acceptedRequirementFingerprint(), acceptedRequirements(), alternativeSignature() (+30 more)

### Community 9 - "index.ts"
Cohesion: 0.09
Nodes (30): ref_node_fs, ref_node_os, ref_node_path, ws, browser, dataDir, group, profile (+22 more)

### Community 10 - "providers.ts"
Cohesion: 0.07
Nodes (37): ref_node_async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+29 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.07
Nodes (25): safeLocalDestination(), needsSessionRefresh(), clearProjectSessionCache(), completeOAuthCallback(), OAuthCallbackOutcome, authMessage(), BetaAccess(), ForgotPassword() (+17 more)

### Community 13 - "event-store.ts"
Cohesion: 0.13
Nodes (12): ActorType, EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow (+4 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.09
Nodes (24): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+16 more)

### Community 15 - "docs/harness/codebase-cleanup-verification.md"
Cohesion: 0.09
Nodes (31): Explicit Jev provider and endpoint isolation, Browser shared server module boundary, October 4 cleanup completion, October4 structural semantic graph refresh, Vercel adapter and Jev smoke completion, AdvancedAISetup call-site correction, Bounded refactor and verification gates, Required-contract recall and context-reduction target (+23 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.12
Nodes (27): Budgeted advisory Jev evidence packets, Report-only source reachability and import audit, ref_node_url, typescript, cachedReview(), ImportReference, inputCost(), inspectSources() (+19 more)

### Community 17 - "ref_node_child_process"
Cohesion: 0.08
Nodes (19): ref_node_child_process, browser, output, profile, classificationCounts, files, listed, policy (+11 more)

### Community 18 - "package.json"
Cohesion: 0.08
Nodes (25): name, packageManager, private, type, version, cross-env, esbuild-wasm, prisma (+17 more)

### Community 19 - "compiler-worker.cjs"
Cohesion: 0.33
Nodes (4): ref_node_net, fs, path, server_isolation_esbuild_cjs

### Community 20 - "ai-presets.ts"
Cohesion: 0.11
Nodes (20): Named AI connections (preferred API), D-0014 â€” Versioned estimates, not inferred billing, CatalogEntry, cost(), layer(), longContext, migrateLegacySpecialty(), modelCatalog (+12 more)

### Community 21 - "instructions.md"
Cohesion: 0.10
Nodes (21): React/Vite and Express facade entrypoints, Explicit affected-contributor agreement, Advisory audit provider and model authority, Runtime external/model validation, Active memory-only OpenRouter BYOK, Durable batches and cloud save receipts, Stale-worker and promotion fencing, Same-change canonical documentation maintenance (+13 more)

### Community 22 - "workflow-overview.md"
Cohesion: 0.29
Nodes (6): Evidence and contracts, Implementation evidence, Outcome and scope, Verification and recovery, Workflow-only main integration — 2026-10-15, Workflow Overview change packet

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "artifacts.ts"
Cohesion: 0.16
Nodes (21): ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, ArtifactUnavailableError, ArtifactVersion, bodyFromBytes(), canonicalJson() (+13 more)

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "tool-registry.ts"
Cohesion: 0.13
Nodes (15): Outcome and responsible boundary, bundleProject(), FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable() (+7 more)

### Community 27 - "context.md"
Cohesion: 0.10
Nodes (18): Current browser/server coordinator facades, Current temporary OpenRouter BYOK, Durable caller-owned submission capture, Prepared coordinator migration and external verification gaps, Bounded one-file recovery checkpoints, Protected migration tool retained despite false obsolete judgment, October 1 local reliability evidence, Current Canvas Shared context rail (+10 more)

### Community 28 - "rooms.ts"
Cohesion: 0.10
Nodes (25): Extracted workspace and steering helpers, ArchivedVersion, replayCaptureJournal(), AISettings, BudgetWindow, collaborationBatchSize, DurableStore, ProjectRole (+17 more)

### Community 29 - "WorkflowBoard.tsx"
Cohesion: 0.19
Nodes (17): tokenRole(), src_workflow_overview, date(), number(), statuses, UsageChart(), WorkflowBoard(), empty() (+9 more)

### Community 30 - "ref_node_crypto"
Cohesion: 0.38
Nodes (6): ref_node_crypto, ref_node_module, betaAccounts, betaDatabase, SqlResult, betaPlatform()

### Community 31 - "canvas.test.ts"
Cohesion: 0.15
Nodes (15): boundedInput(), callOpenAI(), listProviderModels(), providerConfig(), testOpenAIConnection(), validateBaseUrl(), validateSource(), keepLastSuccess() (+7 more)

### Community 32 - "verification.ts"
Cohesion: 0.26
Nodes (11): assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript, planVerification() (+3 more)

### Community 33 - "Build-save timeout publication — 2026-10-17"
Cohesion: 0.50
Nodes (4): Bounded change packet, Build-save timeout publication — 2026-10-17, Integrated behavior, Verification and publication

### Community 34 - "SupabasePlatform"
Cohesion: 0.14
Nodes (4): fail(), normalizeProjectTitle(), SupabasePlatform, encodePostgresBytea()

### Community 35 - "project.ts"
Cohesion: 0.12
Nodes (26): ref_node_path_posix, addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, generateProjectPlan(), mergeUsage(), allowedExtensions (+18 more)

### Community 36 - "product.md"
Cohesion: 0.07
Nodes (27): Durable workflow is the primary shared object, Bounded feature change packet, Graphify scoped source navigation, AST-only graph refresh, Graphify wiki broad navigation, Targets versus verified implementation, Offline Jev rankings are advisory, One logical coordinator (+19 more)

### Community 37 - "yjs"
Cohesion: 0.11
Nodes (14): ref_y_protocols_awareness, yjs, CAPTURE_VERSION, CaptureEnvelope, CaptureSource, CaptureState, MAX_CAPTURE_BYTES, MAX_CAPTURE_UPDATES (+6 more)

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.12
Nodes (19): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+11 more)

### Community 39 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 40 - "prelaunch-release-repair.md"
Cohesion: 0.13
Nodes (13): Exact owner and approval process, Pre-launch and private beta change packet, Release prerequisites and rollback, Verification and handoff, Conditional same-host alternative, Evidence and smallest next action, If delegation is unavailable, Linux browser isolation: bounded alternative and platform questions (+5 more)

### Community 42 - "verify-intent-ui.ts"
Cohesion: 0.13
Nodes (13): Browser, browsers, dataDir, fake, inputs, open(), output, providerAddress (+5 more)

### Community 43 - "supabase-platform.ts"
Cohesion: 0.12
Nodes (21): ref_supabase_server_core, RecoveryCheckpoint, decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), AuthenticatedUser, hashToken() (+13 more)

### Community 44 - "workflow-budget.test.ts"
Cohesion: 0.38
Nodes (9): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), ProviderRequestRecord (+1 more)

### Community 45 - "generator.ts"
Cohesion: 0.14
Nodes (20): clean(), demoExtract(), AgentChange, AIConfig, classification, compactRequirement(), compactSharedRequirement(), compactText() (+12 more)

### Community 46 - "ai-presets.test.ts"
Cohesion: 0.24
Nodes (10): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), classifyTaskComplexity(), effortLevels (+2 more)

### Community 47 - "App.tsx"
Cohesion: 0.11
Nodes (17): Reference-led presentation update (2026-09-30), kinds, previewInitType(), PreviewKind, previewMessageKind(), BuildProgress, WorkflowStatus, FormatChoice (+9 more)

### Community 48 - "artifact-restoration.test.ts"
Cohesion: 0.12
Nodes (11): ref_node_http, dir, manager, observations, platform, project, buildFixture(), files (+3 more)

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (30): BASIC_ACCOUNTING, BASIC_LIMIT, DllImport, EXTENDED_LIMIT, FileSystemRights, IntPtr, IO_COUNTERS, PROCESS_INFORMATION (+22 more)

### Community 50 - "Step 05 handoff — attributable intent and contextual references"
Cohesion: 0.33
Nodes (6): Checks and honest scope, Durability, uncertainty and compatibility, Files and decision, Outcome and reproduced boundary, Step 05 handoff — attributable intent and contextual references, Unrun release dependencies and next step

### Community 51 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.18
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 52 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, audit:code, build, check:boundaries, deploy:cloudflare, dev, migrate:legacy, start (+1 more)

### Community 53 - "verify-build-progress.ts"
Cohesion: 0.15
Nodes (15): address, Browser, browsers, candidates, converge(), dataDir, fake, gates (+7 more)

### Community 54 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.14
Nodes (19): Ambient declarations require reachability exceptions, Dated proposed codebase cleanup plan, Unmeasured optional-context reduction target, Planned deterministic reachability and boundary triage, Graph and grammar limitations in planning snapshot, Planned feature change evidence packet, Proposed model/hash/policy Jev answer cache, Proposed 20-prompt Jev evaluation (+11 more)

### Community 55 - "main.tsx"
Cohesion: 0.12
Nodes (17): Vite HTML client mount, react, ref_react_dom_client, BrandMark(), src_landing, ArtifactTab, artifactTabs, DemoTab (+9 more)

### Community 56 - "Founder contacts in the public footer"
Cohesion: 0.33
Nodes (6): Approved scope, Founder contacts in the public footer, Icon presentation follow-up — 2026-10-16, Local verification, Verification plan, LandingPage()

### Community 57 - "Step 10 - Cross-system integration and final harness review"
Cohesion: 0.33
Nodes (6): Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review

### Community 58 - "isolation.ts"
Cohesion: 0.11
Nodes (33): Linux verification follow-up — 2026-10-08, ref_node_events, ref_node_string_decoder, executable, sandbox, assertIsolationAvailable(), assertVerificationBrowserAvailable(), browserExecutable() (+25 more)

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (40): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+32 more)

### Community 60 - "harness/architecture.md"
Cohesion: 0.12
Nodes (17): Participant-scoped IndexedDB recovery, Single coordinator and lease fencing, Remaining hosted owner routing and archive limits, Verified-email invitations preserve roles and links, Offline developer audit boundary, Physical provider attempt and partial accounting, Hosted byte preservation and membership authority, 40 ms Yjs batching and explicit flush (+9 more)

### Community 61 - ".github/workflows/code-checks.yml"
Cohesion: 0.43
Nodes (6): Frozen pnpm lockfile installation, Commit-pinned GitHub Actions, Code checks on push and pull request, CI pnpm 10.18.3 and Node 24, Import-boundary, test and build gates, Offline GitHub code validation

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "beta-access.test.ts"
Cohesion: 0.12
Nodes (16): ref_node_sqlite, approved, browser, checks, chrome, directory, local, output (+8 more)

### Community 64 - "verify-canvas-surface.ts"
Cohesion: 0.09
Nodes (18): WebSocket collaboration, browser, outputDir, profile, browser, outputDir, profile, browser (+10 more)

### Community 65 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 66 - "contradiction-resolution-plan.md"
Cohesion: 0.40
Nodes (4): Conflict-group acceptance matrix, Additive ConflictGroup migration plan, Decisions needed and Disagreements UI target, Planned conflict alternatives and reopen mutations

### Community 67 - "managed-catalog.ts"
Cohesion: 0.14
Nodes (15): ref_node_fs_promises, [command,file], MANAGED_CATALOG_SOURCE, MANAGED_CATALOG_VERSION, MANAGED_DEFAULT_BUILDER, MANAGED_INTERPRETER_CANDIDATES, managedBuilder(), managedCatalog (+7 more)

### Community 68 - "product-naming.test.ts"
Cohesion: 0.12
Nodes (10): esbuild, ref_node_vm, baseline, browser, checks, dir, frames, legacyPreview (+2 more)

### Community 69 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "measure-responsiveness.ts"
Cohesion: 0.24
Nodes (8): September 26 localhost responsiveness benchmark, Lazy route split transferred-byte evidence, Unmeasured production and provider timing, ref_node_perf_hooks, median(), run(), Sample, wait()

### Community 72 - "WorkspaceScope"
Cohesion: 0.12
Nodes (14): WorkspaceScope(), CaptureCommandController, captureTransport(), browserDraftStore, database(), draftKey(), DraftStore, LocalDraftStatus (+6 more)

### Community 73 - "Steps 6–10 integration into main"
Cohesion: 0.40
Nodes (4): Fresh verification, Operational boundaries, Resolution and preserved contracts, Steps 6–10 integration into main

### Community 74 - "Harness architecture"
Cohesion: 0.08
Nodes (25): Rooms and sessions, 2guys1canvas presentation and invitation boundary (2026-09-30), Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary, Deployment constraint (+17 more)

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
Cohesion: 0.20
Nodes (15): @supabase/supabase-js, BetaDelivery, betaEmailPayload(), emailHtml(), TransactionalEmailPayload, betaDeclineCooldownDays, betaMessageLimit, BetaRequest (+7 more)

### Community 82 - "role-compatible-models.md"
Cohesion: 0.40
Nodes (4): Change packet — 2026-10-16, Live release, Role-compatible OpenRouter models, Verification and release

### Community 85 - "registerProjectRoutes"
Cohesion: 0.22
Nodes (12): express, artifactResponse(), coordinatorResponse(), InvitationEmailSender, appOrigin(), bearer(), displayName(), message() (+4 more)

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
Cohesion: 0.17
Nodes (15): Canvas writing surface, Evidence and contracts, Local evidence, Requested outcome and boundaries, Verification plan, AIEffort, AIResolvedLayer, dollars() (+7 more)

### Community 96 - "verify-capture-command.mjs"
Cohesion: 0.12
Nodes (13): vite, @vitejs/plugin-react, browser, capture, captureGate, checks, dir, envelopes (+5 more)

### Community 97 - "byok-lease.ts"
Cohesion: 0.25
Nodes (8): BYOK_LEASE_MS, BYOK_MODEL_VERSION, BYOK_ROLE_LIMITS, Lease, LeaseModel, modelsFrom(), nonnegative(), AIReasoningConfig

### Community 98 - "Public entry cleanup"
Cohesion: 0.50
Nodes (4): Local evidence and review handoff, Navigation and verification plan, Public entry cleanup, Requested outcome and boundaries

### Community 99 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 100 - "Saving and provider repair — 2026-10-17"
Cohesion: 0.33
Nodes (6): Bounded change packet, Demonstrated defects and changes, Local verification and limits, Provider contract review and hosted evidence, Remaining acceptance and recovery, Saving and provider repair — 2026-10-17

### Community 101 - "verify-workflow-overview.ts"
Cohesion: 0.15
Nodes (9): browser, checks, errors, midnight, output, room, runtime, sockets (+1 more)

### Community 102 - "supabase.ts"
Cohesion: 0.17
Nodes (13): canonicalProductEnvironment(), legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution, authReturnKey (+5 more)

### Community 103 - "Canonical save throughput — 2026-10-17"
Cohesion: 0.67
Nodes (3): Bounded change packet, Canonical save throughput — 2026-10-17, Results

### Community 104 - "ref_node_assert_strict"
Cohesion: 0.14
Nodes (13): ref_node_assert_strict, ref_node_test, states(), encodeCaptureBytes(), LocalCommandState, options, createProgressFixture(), pause() (+5 more)

### Community 107 - "registerBetaRequestRoutes"
Cohesion: 0.38
Nodes (5): Results, BetaRequestService, databaseError(), registerBetaRequestRoutes(), rowRequest()

### Community 108 - "verify-reliability.ts"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, open(), output, providerAddress, room (+2 more)

### Community 109 - "Multi-user Step 07 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Checks and retained attempts, Deliberately bounded coverage, Files, decision and handoff, Isolation and operator setup, Multi-user Step 07 handoff - 2026-10-04, Outcome and boundary

### Community 110 - "ai-accounting.ts"
Cohesion: 0.22
Nodes (12): aggregateCalls(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, estimateLayerMaximum(), AIRunCall, LegacyAISpecialty (+4 more)

### Community 113 - ".ensureWorkflow"
Cohesion: 0.23
Nodes (3): WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 114 - "linux-job-launcher.c"
Cohesion: 0.29
Nodes (5): errno, prctl, signal, stdio, unistd

### Community 115 - "linux-cgroup-isolation.test.ts"
Cohesion: 0.18
Nodes (10): linuxBrowserFileBytes, linuxBrowserFileDescriptors, browser, profile, output(), jobs(), linux, noGroups() (+2 more)

### Community 116 - "readBrowserStorage"
Cohesion: 0.27
Nodes (9): Join(), enter(), legacyKey(), readBrowserStorage(), removeBrowserStorage(), writeBrowserStorage(), caption(), IntentReview() (+1 more)

### Community 117 - "types.ts"
Cohesion: 0.08
Nodes (32): Shared response models, categories, fail(), intentCommandHash(), parseIntentCommand(), AgentStatus, AIRateTier, AIRoutingEvidenceStatus (+24 more)

### Community 118 - "2guys1canvas API reference"
Cohesion: 0.17
Nodes (12): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+4 more)

### Community 119 - "cloudflare-container.test.ts"
Cohesion: 0.23
Nodes (7): @cloudflare/containers, ref_cloudflare_workers, root, baseEnv, fetch(), scheduled(), legacyOriginResponse()

### Community 120 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.17
Nodes (10): ref_dotenv_config, apply, args, backup, client, dataArg, dataDir, mapping (+2 more)

### Community 121 - "Canonical product naming — 2026-10-17"
Cohesion: 0.18
Nodes (8): Bounded change packet, Canonical product naming — 2026-10-17, Compatibility plan and rollback, Completed inventory and fresh local verification, Production-image gate, Residual ledger and cutover, Verification, TwoGuysOneCanvasContainer

### Community 122 - "ByokSetup.tsx"
Cohesion: 0.22
Nodes (9): ByokSetup is the mounted setup surface, lucide-react, AIConnection, TemporaryModel, ByokSetup(), dollars(), Lease, ModelChoice() (+1 more)

### Community 123 - "BuildAccounting.tsx"
Cohesion: 0.29
Nodes (9): Bounded context and cost target, AIRunRecord, NormalizedAIUsage, VerificationSummary(), BuildAccounting(), comparableMetrics(), runKey(), tokenCount() (+1 more)

### Community 125 - "LinuxJobGroup"
Cohesion: 0.29
Nodes (3): LinuxJobGroup, unavailable(), wait()

### Community 126 - "reliability.test.ts"
Cohesion: 0.22
Nodes (3): applySteeringUpdate(), plainText(), edit()

### Community 127 - "build-shortcut.ts"
Cohesion: 0.29
Nodes (8): ariaShortcut(), BUILD_SHORTCUT_STORAGE_KEY, BuildShortcutPreference, defaultBuildShortcut(), isBuildShortcut(), readBuildShortcut(), ShortcutEvent, shortcutLabel()

### Community 131 - "invitation-email.ts"
Cohesion: 0.24
Nodes (6): InvitationDelivery, InvitationEmail, invitationEmailSenderFromEnv(), TransactionalEmailSender, transactionalEmailSenderFromEnv(), validSender()

### Community 132 - "landing-editorial.md"
Cohesion: 0.16
Nodes (9): Approved pre-launch landing redesign, Bounded scope, Contracts to preserve, Outcome and authority, Verification and release, Approval and scope, Evidence and contracts, Verification and publication (+1 more)

### Community 133 - "Cleanup protected workflow contracts"
Cohesion: 0.25
Nodes (9): Bounded complete-file recovery, Immutable insertion and deletion save receipts, One durable workflow and caller-only submission, Active temporary OpenRouter BYOK, Cleanup protected workflow contracts, Three-profile controlled local cleanup browser checks, Three independent local browser profile verification, Ordered complete-file recovery and checkpoint durability (+1 more)

### Community 134 - "Beta access request change packet — 2026-10-09"
Cohesion: 0.29
Nodes (7): Beta access request change packet — 2026-10-09, Evidence and release status, Initial external configuration observations, Operations and manual acceptance, Outcome and bounded scope, Stage contracts and acceptance, Verified deployment — 2026-10-09

### Community 135 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 136 - "Canvas capture command replacement — 2026-10-17"
Cohesion: 0.33
Nodes (6): Allowed implementation and verification scope, Canvas capture command replacement — 2026-10-17, Change packet and baseline, Contract and authority, Deletion manifest, Release and rollback gates

### Community 137 - "Multi-user Step 02 handoff - 2026-10-03"
Cohesion: 0.33
Nodes (6): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries

### Community 138 - "usage-ledger.ts"
Cohesion: 0.40
Nodes (5): aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes, AIUsage

### Community 139 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.40
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 140 - "Multi-user Step 04 handoff - 2026-10-04"
Cohesion: 0.40
Nodes (5): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Prepared deployment and remaining prerequisites

### Community 141 - "Harness documentation cleanup — 2026-10-02"
Cohesion: 0.50
Nodes (4): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02

### Community 142 - "model-evaluation.md"
Cohesion: 0.67
Nodes (3): Deterministic inference-free routing, Model-routing evaluation protocol 2026-09-22.v3, Repeated trial qualification thresholds

### Community 143 - "token"
Cohesion: 0.67
Nodes (3): Transport and authentication, request(), token()

### Community 144 - "Beta registration visibility — 2026-10-16"
Cohesion: 0.67
Nodes (3): Authorized main publication — 2026-10-16, Beta registration visibility — 2026-10-16, Bounded change packet

## Knowledge Gaps
- **745 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+740 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1090 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `yjs` connect `yjs` to `measure-responsiveness.ts`, `live-collaboration-check.mjs`, `WorkspaceScope`, `ref_node_assert_strict`, `supabase-platform.ts`, `index.ts`, `App.tsx`, `artifact-restoration.test.ts`, `package.json`, `fixtures/multiuser-baseline.ts`, `rooms.ts`, `reliability.test.ts`, `canvas.test.ts`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `SupabasePlatform` connect `SupabasePlatform` to `CoordinatorUnavailableError`, `invitation-email.ts`, `index.ts`, `supabase-platform.ts`, `registerBetaRequestRoutes`, `beta-requests.ts`, `artifact-restoration.test.ts`, `registerProjectRoutes`, `artifacts.ts`, `ref_node_crypto`, `beta-access.test.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `EventStore` connect `EventStore` to `RoomManager`, `product-naming.test.ts`, `verify-harness-integration.ts`, `ref_node_assert_strict`, `index.ts`, `event-store.ts`, `.ensureWorkflow`, `fixtures/multiuser-baseline.ts`, `artifacts.ts`, `tool-registry.ts`, `rooms.ts`, `reliability.test.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Are the 35 inferred relationships involving `createTwoGuysOneCanvasServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createTwoGuysOneCanvasServer()` has 35 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _745 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.06172146784872629 - nodes in this community are weakly interconnected._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._