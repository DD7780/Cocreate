# Graph Report - Devoffice  (2026-10-23)

## Corpus Check
- 252 files · ~235,509 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: (none) 6, .css 6, .jsonc 2)

## Summary
- 2335 nodes · 5569 edges · 130 communities (115 shown, 15 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 198 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `db487137`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- README.md
- rooms.ts
- EventStore
- prisma/schema.prisma
- api.md
- docs/harness/decisions.md
- isolation.ts
- requirements.ts
- verify-reliability.ts
- providers.ts
- rules
- ProjectApp.tsx
- ref_node_fs
- verify-interpretation-topology.ts
- docs/harness/codebase-cleanup-verification.md
- codebase-audit.ts
- linux-cgroup.ts
- package.json
- Multi-user Step 03 handoff - 2026-10-03
- ai-presets.ts
- instructions.md
- verify-intent-ui.ts
- dependencies
- ref_node_assert_strict
- compilerOptions
- SupabasePlatform
- context.md
- event-store.ts
- artifacts.ts
- supabase.ts
- graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md
- live-collaboration-check.mjs
- managed-ai.test.ts
- intent-authority.ts
- Submitted evidence repair — 2026-10-20
- fixtures/multiuser-baseline.ts
- provider-reconnect.test.ts
- verify-harness-integration.ts
- App.tsx
- harness/checklist.md
- verify-workflow-overview.ts
- OpenRouterLeases
- browser.ts
- WorkflowBoard.tsx
- generator.ts
- container.js
- build-recovery.ts
- beta-requests.ts
- IsolationRunner
- BetaReview.tsx
- Custom-domain private beta release packet
- scripts
- verify-build-progress.ts
- Multi-user Step 07 handoff - 2026-10-04
- main.tsx
- 2guys1canvas API reference
- live-browser-collaboration-check.mjs
- verify-candidate-evidence.ts
- 2guys1canvas harness implementation checklist
- supabase-platform.ts
- .github/workflows/code-checks.yml
- .oxfmtrc.json
- ref_node_crypto
- Verification and repair log
- devDependencies
- Step 08 - Durable workflow budget and accounting
- registerProjectRoutes
- Workspace
- AGENTS.md
- 24-pixel SVG favicon
- ref_esbuild_cjs
- ref_node_assert
- migrate-legacy-to-supabase.ts
- Harness architecture
- tool-registry.ts
- project.ts
- 2guys1canvas context handoff
- 2guys1canvas product brief
- AgentPanel.tsx
- verify-coordinator-postgres.ts
- .mcp.json
- CoCreateProvider
- generateStructured
- 2guys1canvas AI coding instructions
- artifact-restoration.test.ts
- 2guys1canvas
- coordinator-fencing.test.ts
- Multi-user harness improvement prompts
- verification.ts
- workflow-budget.test.ts
- generated-isolation.test.ts
- Step 10 - Cross-system integration and final harness review
- IntentReview.tsx
- Cleanup protected workflow contracts
- Historical restoration repair — 2026-10-20
- ai-presets.test.ts
- local-drafts.test.ts
- Step 06 handoff — stable progress under ongoing steering
- ByokSetup.tsx
- Multi-user Step 04 handoff - 2026-10-04
- index.ts
- .loadSnapshot
- workflow-overview.md
- safeLocalDestination
- release-fingerprint.mjs
- linux-job-launcher.c
- Step 05 handoff — attributable intent and contextual references
- Multi-user Step 01 evidence and handoff
- Step 09 - Conditional interpretation concurrency and topology evaluation
- Linux browser isolation: bounded alternative and platform questions
- Direct submission beta change packet
- product.md
- usage-ledger.ts
- Pre-launch release repair — 2026-10-08
- harness/architecture.md
- CoordinatorUnavailableError
- oauth-callback.ts
- token
- start-container.sh
- prepare-ci-cgroup.sh
- run-linux-check.sh

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 115 edges
2. `Room` - 76 edges
3. `createCoCreateServer()` - 66 edges
4. `SupabasePlatform` - 60 edges
5. `EventStore` - 54 edges
6. `2guys1canvas harness implementation checklist` - 40 edges
7. `registerProjectRoutes()` - 34 edges
8. `IsolationRunner` - 33 edges
9. `reconcileRequirements()` - 29 edges
10. `yjs` - 28 edges

## Surprising Connections (you probably didn't know these)
- `Browser completion and fixture correctness` --references--> `withIsolatedBrowser()`  [INFERRED]
  docs/harness/historical-repair-20261020.md → server/isolation/browser.ts
- `Outcome and responsible boundary` --references--> `bundleProject()`  [INFERRED]
  docs/harness/multiuser-step04-handoff.md → server/project.ts
- `Actual runtime, verification and retained failures` --references--> `RoomManager`  [INFERRED]
  docs/harness/multiuser-step09-handoff.md → server/rooms.ts
- `Rooms and sessions` --references--> `RoomView`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/api.md → shared/types.ts
- `Responsive delivery and synchronization` --references--> `RoomView`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → shared/types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Participant-scoped durable submission safety** — api_canonical_saved_receipts, api_flush_ordering, api_retired_legacy_build, api_durable_submit, api_capture_order [EXTRACTED 1.00]
- **Verified cleanup preserves workflow authority** — docs_harness_codebase_cleanup_verification_scaffold_removal, docs_harness_codebase_cleanup_verification_shared_extraction, docs_harness_architecture_durable_workflow, docs_harness_codebase_cleanup_verification_local_cleanup_checks [EXTRACTED 1.00]
- **October durable reliability contract** — docs_harness_reliability_verification_ordered_recovery, docs_harness_reliability_verification_ordered_submission_recovery, docs_harness_architecture_canonical_save_receipts, docs_harness_architecture_coordinator_fencing [EXTRACTED 1.00]
- **Feature edit authority and import boundaries** — instructions_feature_packet, instructions_shared_boundary, instructions_source_ownership, instructions_jev_advisory [EXTRACTED 1.00]
- **Collaborative submission-to-promoted-artifact flow** — product_core_loop, product_capture_order, product_durable_receipts, product_bounded_recovery [EXTRACTED 1.00]

## Communities (130 total, 15 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.07
Nodes (37): Submission scheduling: current implementation and required hardening, Source trace, Later-step source audit, ref_node_stream, catalogRate(), effortAllowance(), AIConfig, createCoCreateServer() (+29 more)

### Community 1 - "README.md"
Cohesion: 0.09
Nodes (20): Historical documentation archive, Explicit pnpm native build allowlist, Current source facade and shared contracts, Shared bounded recovery and retained artifact, Current owner-controlled BYOK setup dialog, Cloudflare Worker/container deployment boundary, Controlled three-profile reliability check, Separate pinned direct TypeSafe audit adapter (+12 more)

### Community 2 - "rooms.ts"
Cohesion: 0.06
Nodes (56): Extracted workspace and steering helpers, Named AI connections (preferred API), Shared response models, Bounded context and cost target, ArchivedVersion, AcceptedIntentContext, applyIntentCommand(), categories (+48 more)

### Community 3 - "EventStore"
Cohesion: 0.11
Nodes (3): EventStore, WorkflowPhase, WorkflowTask

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 5 - "api.md"
Cohesion: 0.09
Nodes (28): RoomView.requirementRevisions accepted snapshots, PKCE callback and account-choice flow, Immutable canonical WebSocket saved receipts, Capture-order interpretation and explicit recovery, Authoritative multi-option ConflictGroup, Revision-safe affected-contributor conflict selections, Workflow coordinator fencing RPC contracts, Persisted Developer task evidence (+20 more)

### Community 6 - "docs/harness/decisions.md"
Cohesion: 0.05
Nodes (43): D-0001 â€” Preserve the existing application while migrating additively, D-0002 â€” Personal interpretations are proposals, not builder authority, D-0003 â€” Build from the accepted registry, not the raw canvas, D-0004 â€” Deletion is not withdrawal, D-0005 â€” Pause on consequential accepted contradictions, D-0006 â€” Conflict groups and explicit affected-contributor agreement, D-0007 â€” Classify per intent and reprocess only by explicit participant action, D-0008 â€” Submit intent explicitly; collaborate continuously (+35 more)

### Community 7 - "isolation.ts"
Cohesion: 0.20
Nodes (19): Linux verification follow-up — 2026-10-08, Outcome and bounded scope, assertIsolationAvailable(), cancelled(), compileIsolated(), Dependency, hostEnvironment(), IsolatedRequest (+11 more)

### Community 8 - "requirements.ts"
Cohesion: 0.10
Nodes (39): buildProgressFor(), acceptanceFor(), acceptedClassification(), acceptedRequirementFingerprint(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries() (+31 more)

### Community 9 - "verify-reliability.ts"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, open(), output, providerAddress, room (+2 more)

### Community 10 - "providers.ts"
Cohesion: 0.09
Nodes (28): ref_node_async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+20 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.09
Nodes (15): needsSessionRefresh(), BetaAccess(), clearProjectSessionCache(), InviteResult, PendingInvite, Project, ProjectList, ProjectMember (+7 more)

### Community 13 - "ref_node_fs"
Cohesion: 0.05
Nodes (35): WebSocket collaboration, ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, browser, output, profile (+27 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.10
Nodes (23): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+15 more)

### Community 15 - "docs/harness/codebase-cleanup-verification.md"
Cohesion: 0.09
Nodes (31): Explicit Jev provider and endpoint isolation, Browser shared server module boundary, October 4 cleanup completion, October4 structural semantic graph refresh, Vercel adapter and Jev smoke completion, AdvancedAISetup call-site correction, Bounded refactor and verification gates, Required-contract recall and context-reduction target (+23 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.09
Nodes (33): September 26 localhost responsiveness benchmark, Lazy route split transferred-byte evidence, Unmeasured production and provider timing, ref_node_fs_promises, ref_node_perf_hooks, ref_node_url, cachedReview(), ImportReference (+25 more)

### Community 17 - "linux-cgroup.ts"
Cohesion: 0.22
Nodes (5): linuxBrowserMemoryBytes, LinuxJobGroup, linuxJobLauncher, unavailable(), wait()

### Community 18 - "package.json"
Cohesion: 0.06
Nodes (30): engines, node, name, packageManager, private, type, version, cross-env (+22 more)

### Community 19 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 20 - "ai-presets.ts"
Cohesion: 0.08
Nodes (35): D-0014 â€” Versioned estimates, not inferred billing, Deterministic inference-free routing, Model-routing evaluation protocol 2026-09-22.v3, Repeated trial qualification thresholds, aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup (+27 more)

### Community 21 - "instructions.md"
Cohesion: 0.08
Nodes (24): Planned feature change evidence packet, Protected submission, save and coordinator semantics, TypeSafe reranking workflow cited in pilot plan, React/Vite and Express facade entrypoints, Explicit affected-contributor agreement, Advisory audit provider and model authority, Runtime external/model validation, Active memory-only OpenRouter BYOK (+16 more)

### Community 22 - "verify-intent-ui.ts"
Cohesion: 0.13
Nodes (13): Browser, browsers, dataDir, fake, inputs, open(), output, providerAddress (+5 more)

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "ref_node_assert_strict"
Cohesion: 0.10
Nodes (11): ref_node_assert_strict, yjs, bundleProject(), pause(), waitFor(), provenanceFixture(), typoSource, citeSources() (+3 more)

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "SupabasePlatform"
Cohesion: 0.13
Nodes (6): betaDenied(), fail(), normalizeProjectTitle(), SupabasePlatform, encodePostgresBytea(), hostedFixture()

### Community 27 - "context.md"
Cohesion: 0.10
Nodes (18): Current browser/server coordinator facades, Current temporary OpenRouter BYOK, Durable caller-owned submission capture, Prepared coordinator migration and external verification gaps, Bounded one-file recovery checkpoints, Protected migration tool retained despite false obsolete judgment, October 1 local reliability evidence, Current Canvas Shared context rail (+10 more)

### Community 28 - "event-store.ts"
Cohesion: 0.13
Nodes (12): EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow, taskTransitions (+4 more)

### Community 29 - "artifacts.ts"
Cohesion: 0.17
Nodes (22): ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, ArtifactUnavailableError, ArtifactVersion, bodyFromBytes(), canonicalJson() (+14 more)

### Community 30 - "supabase.ts"
Cohesion: 0.18
Nodes (12): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution, authReturnKey, resolved (+4 more)

### Community 31 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.16
Nodes (16): Ambient declarations require reachability exceptions, Dated proposed codebase cleanup plan, Unmeasured optional-context reduction target, Planned deterministic reachability and boundary triage, Graph and grammar limitations in planning snapshot, Proposed model/hash/policy Jev answer cache, Proposed 20-prompt Jev evaluation, Proposed report-only Jev pilot (+8 more)

### Community 32 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 33 - "managed-ai.test.ts"
Cohesion: 0.17
Nodes (14): [command,file], MANAGED_CATALOG_SOURCE, MANAGED_CATALOG_VERSION, MANAGED_DEFAULT_BUILDER, MANAGED_INTERPRETER_CANDIDATES, managedBuilder(), managedCatalog, ManagedCatalogEntry (+6 more)

### Community 34 - "intent-authority.ts"
Cohesion: 0.15
Nodes (18): clean(), demoExtract(), AgentChange, extractRequirement(), generic, normalize(), sourceWords(), validateSubmittedInterpretation() (+10 more)

### Community 35 - "Submitted evidence repair — 2026-10-20"
Cohesion: 0.25
Nodes (8): Bounded change packet, Confirmed cause and implementation, Delivery boundary, Explicit recovery for the affected project, Final verification, Submitted evidence repair — 2026-10-20, Subsequent main publication authorization, Verification and repair loop

### Community 36 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.15
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 37 - "provider-reconnect.test.ts"
Cohesion: 0.16
Nodes (8): ref_y_protocols_awareness, states(), deletionSignature(), ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), FakeWebSocket

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.12
Nodes (19): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+11 more)

### Community 39 - "App.tsx"
Cohesion: 0.11
Nodes (23): react, @tiptap/extension-collaboration, BuildProgress, Participant, RoomView, WorkflowStatus, api(), tokenRole() (+15 more)

### Community 40 - "harness/checklist.md"
Cohesion: 0.13
Nodes (15): October 3 Graphify maintenance evidence, October 3 cleanup plan history, October 1 reliability verification history, October 1 Studio Ivory local checks history, Conflict-group acceptance matrix, Additive ConflictGroup migration plan, Decisions needed and Disagreements UI target, Planned conflict alternatives and reopen mutations (+7 more)

### Community 41 - "verify-workflow-overview.ts"
Cohesion: 0.15
Nodes (9): browser, checks, errors, midnight, output, room, runtime, sockets (+1 more)

### Community 42 - "OpenRouterLeases"
Cohesion: 0.23
Nodes (6): BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases

### Community 43 - "browser.ts"
Cohesion: 0.16
Nodes (16): ref_node_events, ref_node_string_decoder, executable, sandbox, assertVerificationBrowserAvailable(), browserExecutable(), BrowserProtocol, linuxBrowserFileBytes (+8 more)

### Community 44 - "WorkflowBoard.tsx"
Cohesion: 0.19
Nodes (16): src_workflow_overview, date(), number(), statuses, UsageChart(), WorkflowBoard(), empty(), known() (+8 more)

### Community 45 - "generator.ts"
Cohesion: 0.12
Nodes (19): boundedInput(), callOpenAI(), classification, compactRequirement(), compactSharedRequirement(), compactText(), DEFAULT_PROJECT_OUTPUT_TOKENS, intentSchema (+11 more)

### Community 46 - "container.js"
Cohesion: 0.21
Nodes (7): @cloudflare/containers, ref_cloudflare_workers, baseEnv, CoCreateContainer, fetch(), scheduled(), legacyOriginResponse()

### Community 47 - "build-recovery.ts"
Cohesion: 0.22
Nodes (11): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, generateProjectPlan(), mergeUsage(), budgetProjectFiles(), Usage (+3 more)

### Community 48 - "beta-requests.ts"
Cohesion: 0.09
Nodes (31): Beta access request change packet — 2026-10-09, Evidence and release status, Initial external configuration observations, Operations and manual acceptance, Outcome and bounded scope, Stage contracts and acceptance, Verified deployment — 2026-10-09, ref_node_module (+23 more)

### Community 49 - "IsolationRunner"
Cohesion: 0.08
Nodes (30): BASIC_ACCOUNTING, BASIC_LIMIT, DllImport, EXTENDED_LIMIT, FileSystemRights, IntPtr, IO_COUNTERS, PROCESS_INFORMATION (+22 more)

### Community 50 - "BetaReview.tsx"
Cohesion: 0.40
Nodes (5): @supabase/supabase-js, AuthenticatedRequest, BetaReview(), date(), ReviewList

### Community 51 - "Custom-domain private beta release packet"
Cohesion: 0.25
Nodes (8): Acceptance evidence and handoff, Blocked deployment repair packet — 2026-10-08, Current execution status, Custom-domain private beta release packet, Latest verified handoff — 2026-10-08, Prepared changes and compatibility, Verification, execution and recovery plan, Verified targets and current state

### Community 52 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, audit:code, build, check:boundaries, deploy:cloudflare, dev, migrate:legacy, start (+1 more)

### Community 53 - "verify-build-progress.ts"
Cohesion: 0.15
Nodes (15): address, Browser, browsers, candidates, converge(), dataDir, fake, gates (+7 more)

### Community 54 - "Multi-user Step 07 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Checks and retained attempts, Deliberately bounded coverage, Files, decision and handoff, Isolation and operator setup, Multi-user Step 07 handoff - 2026-10-04, Outcome and boundary

### Community 55 - "main.tsx"
Cohesion: 0.12
Nodes (15): Vite HTML client mount, ref_react_dom_client, src_landing, ArtifactTab, artifactTabs, DemoTab, demoTabs, moveTab() (+7 more)

### Community 56 - "2guys1canvas API reference"
Cohesion: 0.15
Nodes (13): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+5 more)

### Community 57 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 58 - "verify-candidate-evidence.ts"
Cohesion: 0.14
Nodes (16): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+8 more)

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (40): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+32 more)

### Community 60 - "supabase-platform.ts"
Cohesion: 0.16
Nodes (15): ref_supabase_server_core, decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), AuthenticatedUser, hashToken(), normalizeInviteEmail() (+7 more)

### Community 61 - ".github/workflows/code-checks.yml"
Cohesion: 0.43
Nodes (6): Frozen pnpm lockfile installation, Commit-pinned GitHub Actions, Code checks on push and pull request, CI pnpm 10.18.3 and Node 24, Import-boundary, test and build gates, Offline GitHub code validation

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "ref_node_crypto"
Cohesion: 0.13
Nodes (15): ref_node_crypto, ref_node_sqlite, approved, browser, checks, chrome, directory, local (+7 more)

### Community 64 - "Verification and repair log"
Cohesion: 0.17
Nodes (12): Available local application, Bounded change packet, Controlled failed-build browser outcome, Final regression outcome and review artifacts, Isolated coherent restoration — 2026-10-19, Live-provider checks and operator configuration, Native/browser investigation, Real-provider browser outcome (+4 more)

### Community 65 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 66 - "Step 08 - Durable workflow budget and accounting"
Cohesion: 0.40
Nodes (5): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures

### Community 67 - "registerProjectRoutes"
Cohesion: 0.25
Nodes (11): artifactResponse(), coordinatorResponse(), InvitationEmailSender, appOrigin(), bearer(), displayName(), message(), recipientKey() (+3 more)

### Community 68 - "Workspace"
Cohesion: 0.27
Nodes (10): tokenParticipant(), Workspace(), ariaShortcut(), BUILD_SHORTCUT_STORAGE_KEY, BuildShortcutPreference, defaultBuildShortcut(), isBuildShortcut(), readBuildShortcut() (+2 more)

### Community 69 - "AGENTS.md"
Cohesion: 0.12
Nodes (14): Durable workflow is the primary shared object, Bounded feature change packet, Graphify scoped source navigation, AST-only graph refresh, Graphify wiki broad navigation, Targets versus verified implementation, Offline Jev rankings are advisory, One logical coordinator (+6 more)

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 73 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.17
Nodes (10): ref_dotenv_config, apply, args, backup, client, dataArg, dataDir, mapping (+2 more)

### Community 74 - "Harness architecture"
Cohesion: 0.09
Nodes (23): 2guys1canvas presentation and invitation boundary (2026-09-30), Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary (+15 more)

### Community 75 - "tool-registry.ts"
Cohesion: 0.13
Nodes (14): ActorType, FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior (+6 more)

### Community 76 - "project.ts"
Cohesion: 0.14
Nodes (18): ref_node_path_posix, allowedExtensions, applyOperations(), downloadableFiles(), generatedRoot, infrastructureFiles, loadProject(), persistProject() (+10 more)

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 79 - "AgentPanel.tsx"
Cohesion: 0.23
Nodes (11): AIResolvedLayer, NormalizedAIUsage, dollars(), rateSummary(), effortChoices, AgentPanel(), BuildAccounting(), comparableMetrics() (+3 more)

### Community 80 - "verify-coordinator-postgres.ts"
Cohesion: 0.13
Nodes (11): pg, a, admin, b, checks, ownerA, ownerB, project (+3 more)

### Community 85 - "generateStructured"
Cohesion: 0.18
Nodes (11): directInstruction(), directPromptSchema, prepareDirectPrompt(), adapterFor(), generateStructured(), generateText(), mergeUsage(), ProviderConfig (+3 more)

### Community 90 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 91 - "artifact-restoration.test.ts"
Cohesion: 0.12
Nodes (11): ref_node_http, dir, manager, observations, platform, project, buildFixture(), files (+3 more)

### Community 92 - "2guys1canvas"
Cohesion: 0.13
Nodes (15): 2guys1canvas, Active hosted MVP: OpenRouter BYOK, AI steering documents, Architecture, Checks, Connect AI, Current boundaries, Current product setup (2026-09-30) (+7 more)

### Community 93 - "coordinator-fencing.test.ts"
Cohesion: 0.20
Nodes (3): express, coordinatorRetry, Rpc

### Community 94 - "Multi-user harness improvement prompts"
Cohesion: 0.15
Nodes (13): Common contract, Multi-user harness improvement prompts, Starting instruction, Step 01 - Audit, scenarios and baseline, Step 02 - Coordinator fencing and owner routing, Step 03 - Artifact persistence and restoration, Step 04 - Generated execution isolation, Step 05 - Intent inspection, correction and contextual references (+5 more)

### Community 95 - "verification.ts"
Cohesion: 0.26
Nodes (11): assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript, planVerification() (+3 more)

### Community 96 - "workflow-budget.test.ts"
Cohesion: 0.34
Nodes (10): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), ProviderRequestRecord (+2 more)

### Community 97 - "generated-isolation.test.ts"
Cohesion: 0.17
Nodes (6): ref_node_net, fs, path, server_isolation_esbuild_cjs, files, jobs

### Community 98 - "Step 10 - Cross-system integration and final harness review"
Cohesion: 0.33
Nodes (6): Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review

### Community 99 - "IntentReview.tsx"
Cohesion: 0.20
Nodes (7): IntentCommandResult, IntentTarget, InterpretationIntentCategory, src_intent_review, caption(), Edit, IntentReview()

### Community 100 - "Cleanup protected workflow contracts"
Cohesion: 0.25
Nodes (9): Bounded complete-file recovery, Immutable insertion and deletion save receipts, One durable workflow and caller-only submission, Active temporary OpenRouter BYOK, Cleanup protected workflow contracts, Three-profile controlled local cleanup browser checks, Three independent local browser profile verification, Ordered complete-file recovery and checkpoint durability (+1 more)

### Community 101 - "Historical restoration repair — 2026-10-20"
Cohesion: 0.17
Nodes (12): Bounded change packet, Browser completion and fixture correctness, Failure ledger, Fresh verification, Historical restoration repair — 2026-10-20, Native compiler work, Non-destructive release compatibility plan, OpenRouter capacity (independent product correction) (+4 more)

### Community 102 - "ai-presets.test.ts"
Cohesion: 0.33
Nodes (7): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), passed

### Community 103 - "local-drafts.test.ts"
Cohesion: 0.20
Nodes (7): browserDraftStore, draftKey(), DraftStore, LocalDraftStatus, persistDraft(), restoreDraft(), merge()

### Community 104 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 105 - "ByokSetup.tsx"
Cohesion: 0.29
Nodes (6): ByokSetup is the mounted setup surface, lucide-react, AIConnection, ByokSetup(), Lease, request()

### Community 106 - "Multi-user Step 04 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites

### Community 107 - "index.ts"
Cohesion: 0.16
Nodes (14): ref_node_test, ws, b64(), createSession(), participantId(), roomToken(), Session, verifySession() (+6 more)

### Community 108 - ".loadSnapshot"
Cohesion: 0.52
Nodes (3): decodePersistedYjsUpdate(), legacyBufferShape(), persistedRawBytes()

### Community 109 - "workflow-overview.md"
Cohesion: 0.29
Nodes (6): Evidence and contracts, Implementation evidence, Outcome and scope, Verification and recovery, Workflow-only main integration — 2026-10-15, Workflow Overview change packet

### Community 110 - "safeLocalDestination"
Cohesion: 0.36
Nodes (8): safeLocalDestination(), authMessage(), ForgotPassword(), intendedDestination(), Login(), ProjectApp(), Signup(), supabaseAuthCallbackUrl()

### Community 113 - "release-fingerprint.mjs"
Cohesion: 0.29
Nodes (6): buildFiles, config, configOption, files, fingerprint, hash

### Community 114 - "linux-job-launcher.c"
Cohesion: 0.29
Nodes (5): errno, prctl, signal, stdio, unistd

### Community 115 - "Step 05 handoff — attributable intent and contextual references"
Cohesion: 0.33
Nodes (6): Checks and honest scope, Durability, uncertainty and compatibility, Files and decision, Outcome and reproduced boundary, Step 05 handoff — attributable intent and contextual references, Unrun release dependencies and next step

### Community 116 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.40
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 117 - "Step 09 - Conditional interpretation concurrency and topology evaluation"
Cohesion: 0.40
Nodes (5): Actual runtime, verification and retained failures, Controlled comparison, Files, rollout and next work, Outcome and responsible boundary, Step 09 - Conditional interpretation concurrency and topology evaluation

### Community 118 - "Linux browser isolation: bounded alternative and platform questions"
Cohesion: 0.40
Nodes (5): Conditional same-host alternative, Evidence and smallest next action, If delegation is unavailable, Linux browser isolation: bounded alternative and platform questions, Release and recovery

### Community 119 - "Direct submission beta change packet"
Cohesion: 0.20
Nodes (10): Candidate CI and follow-up synchronization, Candidate prepared for review, Direct submission beta change packet, Outcome and baseline, Release follow-up — 2026-10-23, Repair and verification ledger — 2026-10-21, Required contracts, Rollout and recovery contract (+2 more)

### Community 120 - "product.md"
Cohesion: 0.11
Nodes (17): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02, Serialized eight-task and 24-call recovery, Disconnected-first OpenRouter BYOK setup, Attributed capture-order interpretation, Collaborative submission-to-artifact loop (+9 more)

### Community 121 - "usage-ledger.ts"
Cohesion: 0.50
Nodes (4): aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes

### Community 122 - "Pre-launch release repair — 2026-10-08"
Cohesion: 0.50
Nodes (4): Bounded change packet, Final smoke verification and publication — 2026-10-08, Fresh evidence, Pre-launch release repair — 2026-10-08

### Community 123 - "harness/architecture.md"
Cohesion: 0.06
Nodes (31): Participant-scoped IndexedDB recovery, Single coordinator and lease fencing, Remaining hosted owner routing and archive limits, Verified-email invitations preserve roles and links, Offline developer audit boundary, Physical provider attempt and partial accounting, Hosted byte preservation and membership authority, 40 ms Yjs batching and explicit flush (+23 more)

### Community 124 - "CoordinatorUnavailableError"
Cohesion: 0.17
Nodes (8): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, CoordinatorUnavailableError, RemoteCoordinator

### Community 125 - "oauth-callback.ts"
Cohesion: 0.50
Nodes (3): completeOAuthCallback(), OAuthCallbackOutcome, Callback()

### Community 126 - "token"
Cohesion: 0.67
Nodes (3): Transport and authentication, request(), token()

## Knowledge Gaps
- **711 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+706 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1047 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `yjs` connect `ref_node_assert_strict` to `live-collaboration-check.mjs`, `rooms.ts`, `intent-authority.ts`, `fixtures/multiuser-baseline.ts`, `provider-reconnect.test.ts`, `App.tsx`, `local-drafts.test.ts`, `index.ts`, `.loadSnapshot`, `codebase-audit.ts`, `package.json`, `artifact-restoration.test.ts`, `supabase-platform.ts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `RoomManager` connect `RoomManager` to `workflow-budget.test.ts`, `managed-ai.test.ts`, `rooms.ts`, `registerProjectRoutes`, `EventStore`, `fixtures/multiuser-baseline.ts`, `ai-presets.test.ts`, `index.ts`, `tool-registry.ts`, `ref_node_fs`, `Step 09 - Conditional interpretation concurrency and topology evaluation`, `ref_node_assert_strict`, `artifact-restoration.test.ts`, `coordinator-fencing.test.ts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `2guys1canvas harness implementation checklist` connect `2guys1canvas harness implementation checklist` to `README.md`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Are the 33 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 33 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _711 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.07234792033599784 - nodes in this community are weakly interconnected._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.0873015873015873 - nodes in this community are weakly interconnected._