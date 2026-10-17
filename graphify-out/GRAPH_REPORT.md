# Graph Report - Devoffice  (2026-10-17)

## Corpus Check
- 251 files · ~236,880 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 6, .css 6, .example 1)

## Summary
- 2333 nodes · 5512 edges · 128 communities (112 shown, 16 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 189 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8515724c`
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
- landing-editorial.md
- ai-presets.ts
- instructions.md
- Workflow Overview change packet
- dependencies
- ref_node_child_process
- compilerOptions
- graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md
- context.md
- Shared response models
- artifacts.ts
- supabase.ts
- verification.ts
- live-collaboration-check.mjs
- managed-catalog.ts
- SupabasePlatform
- tool-registry.ts
- product.md
- provider-reconnect.test.ts
- verify-harness-integration.ts
- AgentPanel.tsx
- prelaunch-release-repair.md
- reliability.test.ts
- verify-intent-ui.ts
- project.ts
- registerProjectRoutes
- generator.ts
- container.js
- Workspace
- fixtures/build-progress.ts
- IsolationRunner
- Step 05 handoff — attributable intent and contextual references
- fixtures/multiuser-baseline.ts
- scripts
- verify-build-progress.ts
- App.tsx
- LandingPage.tsx
- CoCreateProvider
- ref_node_crypto
- verify-candidate-evidence.ts
- 2guys1canvas harness implementation checklist
- harness/architecture.md
- .github/workflows/code-checks.yml
- .oxfmtrc.json
- beta-access.test.ts
- verify-canvas-surface.ts
- devDependencies
- Step 08 - Durable workflow budget and accounting
- 2guys1canvas API reference
- react
- Step 06 handoff — stable progress under ongoing steering
- 24-pixel SVG favicon
- responsiveness.md
- local-drafts.test.ts
- providers.test.ts
- Harness architecture
- Custom-domain private beta release packet
- Founder contacts in the public footer
- 2guys1canvas context handoff
- 2guys1canvas product brief
- Step 09 - Conditional interpretation concurrency and topology evaluation
- beta-requests.ts
- .mcp.json
- request
- BuildAccounting.tsx
- 2guys1canvas AI coding instructions
- token
- 2guys1canvas
- verify-coordinator-postgres.ts
- Multi-user harness improvement prompts
- WorkflowBoard.tsx
- intent-authority.ts
- workflow-budget.test.ts
- Step 10 - Cross-system integration and final harness review
- Multi-user Step 03 handoff - 2026-10-03
- Steps 6–10 integration into main
- verify-workflow-overview.ts
- Multi-user Step 01 evidence and handoff
- role-compatible-models.md
- ProjectFile
- ref_esbuild_cjs
- ref_node_assert
- Multi-user Step 07 handoff - 2026-10-04
- ai-presets.test.ts
- linux-job-launcher.c
- ByokSetup.tsx
- main.tsx
- live-browser-collaboration-check.mjs
- Harness documentation cleanup — 2026-10-02
- supabase-platform.ts
- .loadSnapshot
- Multi-user Step 04 handoff - 2026-10-04
- contradiction-resolution-plan.md
- Cleanup protected workflow contracts
- byok-lease.ts
- start-container.sh
- prepare-ci-cgroup.sh
- run-linux-check.sh
- build-save-timeout-publication.md
- model-evaluation.md
- Durable WorkflowOverview projection

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 115 edges
2. `Room` - 76 edges
3. `createCoCreateServer()` - 64 edges
4. `SupabasePlatform` - 60 edges
5. `EventStore` - 54 edges
6. `2guys1canvas harness implementation checklist` - 40 edges
7. `registerProjectRoutes()` - 34 edges
8. `IsolationRunner` - 33 edges
9. `graphify-out/SOURCE_MAP.md` - 29 edges
10. `reconcileRequirements()` - 28 edges

## Surprising Connections (you probably didn't know these)
- `Outcome and responsible boundary` --references--> `bundleProject()`  [INFERRED]
  docs/harness/multiuser-step04-handoff.md → server/project.ts
- `Actual runtime, verification and retained failures` --references--> `RoomManager`  [INFERRED]
  docs/harness/multiuser-step09-handoff.md → server/rooms.ts
- `Reference-led presentation update (2026-09-30)` --references--> `Workspace()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → src/App.tsx
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

## Communities (128 total, 16 thin omitted)

### Community 0 - "rooms.ts"
Cohesion: 0.05
Nodes (63): Extracted workspace and steering helpers, Submission scheduling: current implementation and required hardening, Later-step source audit, ref_node_stream, calculateCharge(), catalogRate(), effortAllowance(), ArchivedVersion (+55 more)

### Community 1 - "README.md"
Cohesion: 0.09
Nodes (20): Historical documentation archive, Explicit pnpm native build allowlist, Current source facade and shared contracts, Shared bounded recovery and retained artifact, Current owner-controlled BYOK setup dialog, Cloudflare Worker/container deployment boundary, Controlled three-profile reliability check, Separate pinned direct TypeSafe audit adapter (+12 more)

### Community 2 - "types.ts"
Cohesion: 0.07
Nodes (29): Named AI connections (preferred API), AgentStatus, AIRateTier, AIRecommendation, AIRoutingEvidenceStatus, BuildProgress, CapabilityCheck, ConflictAlternative (+21 more)

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 5 - "api.md"
Cohesion: 0.10
Nodes (25): RoomView.requirementRevisions accepted snapshots, PKCE callback and account-choice flow, Immutable canonical WebSocket saved receipts, Capture-order interpretation and explicit recovery, Authoritative multi-option ConflictGroup, Revision-safe affected-contributor conflict selections, Workflow coordinator fencing RPC contracts, Durable idempotent participant submission (+17 more)

### Community 6 - "docs/harness/decisions.md"
Cohesion: 0.05
Nodes (43): D-0001 â€” Preserve the existing application while migrating additively, D-0002 â€” Personal interpretations are proposals, not builder authority, D-0003 â€” Build from the accepted registry, not the raw canvas, D-0004 â€” Deletion is not withdrawal, D-0005 â€” Pause on consequential accepted contradictions, D-0006 â€” Conflict groups and explicit affected-contributor agreement, D-0007 â€” Classify per intent and reprocess only by explicit participant action, D-0008 â€” Submit intent explicitly; collaborate continuously (+35 more)

### Community 7 - "isolation.ts"
Cohesion: 0.08
Nodes (39): Linux verification follow-up — 2026-10-08, ref_node_string_decoder, executable, sandbox, assertIsolationAvailable(), assertVerificationBrowserAvailable(), browserExecutable(), BrowserProtocol (+31 more)

### Community 8 - "requirements.ts"
Cohesion: 0.10
Nodes (38): applyIntentCommand(), categories, fail(), intentCommandHash(), parseIntentCommand(), acceptanceFor(), acceptedClassification(), acceptedRequirements() (+30 more)

### Community 9 - "index.ts"
Cohesion: 0.11
Nodes (20): browser, dataDir, group, profile, room, token, b64(), createSession() (+12 more)

### Community 10 - "providers.ts"
Cohesion: 0.08
Nodes (29): ref_node_async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+21 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.09
Nodes (19): safeLocalDestination(), completeOAuthCallback(), OAuthCallbackOutcome, authMessage(), Callback(), ForgotPassword(), intendedDestination(), InviteResult (+11 more)

### Community 13 - "event-store.ts"
Cohesion: 0.12
Nodes (13): EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow, taskTransitions (+5 more)

### Community 14 - "verify-interpretation-topology.ts"
Cohesion: 0.10
Nodes (23): baseline, batchSchema, changes(), compare(), currentBaseline, currentResult, files, frozenResult (+15 more)

### Community 15 - "docs/harness/codebase-cleanup-verification.md"
Cohesion: 0.06
Nodes (41): Explicit Jev provider and endpoint isolation, Browser shared server module boundary, October 4 cleanup completion, October4 structural semantic graph refresh, Vercel adapter and Jev smoke completion, AdvancedAISetup call-site correction, Bounded refactor and verification gates, Required-contract recall and context-reduction target (+33 more)

### Community 16 - "codebase-audit.ts"
Cohesion: 0.14
Nodes (24): ref_node_url, cachedReview(), ImportReference, inputCost(), inspectSources(), add(), reachable(), resolve() (+16 more)

### Community 17 - "ref_node_fs"
Cohesion: 0.09
Nodes (16): ref_node_assert_strict, ref_node_fs, ref_node_os, ref_node_path, ref_node_test, yjs, browser, profile (+8 more)

### Community 18 - "package.json"
Cohesion: 0.06
Nodes (31): engines, node, name, packageManager, private, type, version, cross-env (+23 more)

### Community 19 - "landing-editorial.md"
Cohesion: 0.18
Nodes (9): Approved pre-launch landing redesign, Bounded scope, Contracts to preserve, Outcome and authority, Verification and release, Local evidence and review handoff, Navigation and verification plan, Public entry cleanup (+1 more)

### Community 20 - "ai-presets.ts"
Cohesion: 0.09
Nodes (34): Bounded context and cost target, D-0014 â€” Versioned estimates, not inferred billing, aggregateCalls(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, CatalogEntry (+26 more)

### Community 21 - "instructions.md"
Cohesion: 0.10
Nodes (21): React/Vite and Express facade entrypoints, Explicit affected-contributor agreement, Advisory audit provider and model authority, Runtime external/model validation, Active memory-only OpenRouter BYOK, Durable batches and cloud save receipts, Stale-worker and promotion fencing, Same-change canonical documentation maintenance (+13 more)

### Community 22 - "Workflow Overview change packet"
Cohesion: 0.33
Nodes (6): Evidence and contracts, Implementation evidence, Outcome and scope, Verification and recovery, Workflow-only main integration — 2026-10-15, Workflow Overview change packet

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "ref_node_child_process"
Cohesion: 0.05
Nodes (30): ref_node_child_process, ref_node_module, browser, output, profile, browser, outputDir, profile (+22 more)

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.14
Nodes (19): Ambient declarations require reachability exceptions, Dated proposed codebase cleanup plan, Unmeasured optional-context reduction target, Planned deterministic reachability and boundary triage, Graph and grammar limitations in planning snapshot, Planned feature change evidence packet, Proposed model/hash/policy Jev answer cache, Proposed 20-prompt Jev evaluation (+11 more)

### Community 27 - "context.md"
Cohesion: 0.10
Nodes (18): Current browser/server coordinator facades, Current temporary OpenRouter BYOK, Durable caller-owned submission capture, Prepared coordinator migration and external verification gaps, Bounded one-file recovery checkpoints, Protected migration tool retained despite false obsolete judgment, October 1 local reliability evidence, Current Canvas Shared context rail (+10 more)

### Community 28 - "Shared response models"
Cohesion: 0.17
Nodes (10): Shared response models, aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes, AIUsage, Contradiction, SafeAIConnection (+2 more)

### Community 29 - "artifacts.ts"
Cohesion: 0.18
Nodes (21): ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, ArtifactUnavailableError, ArtifactVersion, bodyFromBytes(), canonicalJson() (+13 more)

### Community 30 - "supabase.ts"
Cohesion: 0.18
Nodes (12): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution, authReturnKey, resolved (+4 more)

### Community 31 - "verification.ts"
Cohesion: 0.26
Nodes (11): assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript, planVerification() (+3 more)

### Community 32 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 33 - "managed-catalog.ts"
Cohesion: 0.19
Nodes (10): [command,file], MANAGED_CATALOG_SOURCE, MANAGED_CATALOG_VERSION, MANAGED_DEFAULT_BUILDER, MANAGED_INTERPRETER_CANDIDATES, ManagedCatalogEntry, MANAGED_QUALIFICATION_VERSION, managedFixtures (+2 more)

### Community 34 - "SupabasePlatform"
Cohesion: 0.12
Nodes (6): betaDenied(), fail(), normalizeProjectTitle(), SupabasePlatform, encodePostgresBytea(), hostedFixture()

### Community 35 - "tool-registry.ts"
Cohesion: 0.13
Nodes (14): ActorType, FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior (+6 more)

### Community 36 - "product.md"
Cohesion: 0.07
Nodes (27): Durable workflow is the primary shared object, Bounded feature change packet, Graphify scoped source navigation, AST-only graph refresh, Graphify wiki broad navigation, Targets versus verified implementation, Offline Jev rankings are advisory, One logical coordinator (+19 more)

### Community 37 - "provider-reconnect.test.ts"
Cohesion: 0.14
Nodes (10): ref_y_protocols_awareness, states(), deletionSignature(), DOCUMENT_FLUSH_WAIT_MS, DOCUMENT_SAVE_TIMEOUT_MS, ConnectionStatus, ProviderDependencies, providerInternals (+2 more)

### Community 38 - "verify-harness-integration.ts"
Cohesion: 0.12
Nodes (19): address, Browser, browsers, candidates, checkpoints, converge(), dataDir, execute (+11 more)

### Community 39 - "AgentPanel.tsx"
Cohesion: 0.14
Nodes (20): Canvas writing surface, Evidence and contracts, Local evidence, Requested outcome and boundaries, Verification plan, AIEffort, AIResolvedLayer, Participant (+12 more)

### Community 40 - "prelaunch-release-repair.md"
Cohesion: 0.13
Nodes (13): Exact owner and approval process, Pre-launch and private beta change packet, Release prerequisites and rollback, Verification and handoff, Conditional same-host alternative, Evidence and smallest next action, If delegation is unavailable, Linux browser isolation: bounded alternative and platform questions (+5 more)

### Community 41 - "reliability.test.ts"
Cohesion: 0.11
Nodes (11): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries, CoordinatorUnavailableError, RemoteCoordinator (+3 more)

### Community 42 - "verify-intent-ui.ts"
Cohesion: 0.13
Nodes (13): Browser, browsers, dataDir, fake, inputs, open(), output, providerAddress (+5 more)

### Community 43 - "project.ts"
Cohesion: 0.10
Nodes (20): ref_node_events, ref_node_net, ref_node_path_posix, fs, path, server_isolation_esbuild_cjs, allowedExtensions, applyOperations() (+12 more)

### Community 44 - "registerProjectRoutes"
Cohesion: 0.22
Nodes (13): express, artifactResponse(), coordinatorRetry, coordinatorResponse(), InvitationEmailSender, appOrigin(), bearer(), displayName() (+5 more)

### Community 45 - "generator.ts"
Cohesion: 0.09
Nodes (30): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, clean(), demoExtract(), AgentChange, boundedInput() (+22 more)

### Community 46 - "container.js"
Cohesion: 0.21
Nodes (7): @cloudflare/containers, ref_cloudflare_workers, baseEnv, CoCreateContainer, fetch(), scheduled(), legacyOriginResponse()

### Community 47 - "Workspace"
Cohesion: 0.30
Nodes (9): Workspace(), ariaShortcut(), BUILD_SHORTCUT_STORAGE_KEY, BuildShortcutPreference, defaultBuildShortcut(), isBuildShortcut(), readBuildShortcut(), ShortcutEvent (+1 more)

### Community 48 - "fixtures/build-progress.ts"
Cohesion: 0.54
Nodes (3): createProgressFixture(), pause(), waitFor()

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

### Community 54 - "App.tsx"
Cohesion: 0.14
Nodes (10): WorkflowStatus, FormatChoice, ProviderChoice, providerPresets, statusCopy, tokenParticipant(), Workspace, SubmissionOptions (+2 more)

### Community 55 - "LandingPage.tsx"
Cohesion: 0.20
Nodes (10): lucide-react, BrandMark(), src_landing, ArtifactTab, artifactTabs, DemoTab, demoTabs, moveTab() (+2 more)

### Community 57 - "ref_node_crypto"
Cohesion: 0.07
Nodes (27): ref_node_crypto, ref_node_http, dir, manager, observations, platform, project, Browser (+19 more)

### Community 58 - "verify-candidate-evidence.ts"
Cohesion: 0.13
Nodes (17): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+9 more)

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (40): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+32 more)

### Community 60 - "harness/architecture.md"
Cohesion: 0.11
Nodes (21): Participant-scoped IndexedDB recovery, Single coordinator and lease fencing, Remaining hosted owner routing and archive limits, Verified-email invitations preserve roles and links, Offline developer audit boundary, Physical provider attempt and partial accounting, Hosted byte preservation and membership authority, 40 ms Yjs batching and explicit flush (+13 more)

### Community 61 - ".github/workflows/code-checks.yml"
Cohesion: 0.43
Nodes (6): Frozen pnpm lockfile installation, Commit-pinned GitHub Actions, Code checks on push and pull request, CI pnpm 10.18.3 and Node 24, Import-boundary, test and build gates, Offline GitHub code validation

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "beta-access.test.ts"
Cohesion: 0.13
Nodes (14): ref_node_sqlite, approved, browser, checks, chrome, directory, local, output (+6 more)

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
Cohesion: 0.14
Nodes (14): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+6 more)

### Community 68 - "react"
Cohesion: 0.40
Nodes (5): react, @supabase/supabase-js, AuthenticatedRequest, BetaReview(), date()

### Community 69 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "responsiveness.md"
Cohesion: 0.50
Nodes (3): September 26 localhost responsiveness benchmark, Lazy route split transferred-byte evidence, Unmeasured production and provider timing

### Community 72 - "local-drafts.test.ts"
Cohesion: 0.20
Nodes (7): browserDraftStore, draftKey(), DraftStore, LocalDraftStatus, persistDraft(), restoreDraft(), merge()

### Community 73 - "providers.test.ts"
Cohesion: 0.28
Nodes (7): adapterFor(), discoverModels(), generateStructured(), mergeUsage(), ProviderConfig, withProviderRetryReason(), schema

### Community 74 - "Harness architecture"
Cohesion: 0.10
Nodes (21): Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary, Execution flow (+13 more)

### Community 75 - "Custom-domain private beta release packet"
Cohesion: 0.22
Nodes (9): Acceptance evidence and handoff, Blocked deployment repair packet — 2026-10-08, Current execution status, Custom-domain private beta release packet, Latest verified handoff — 2026-10-08, Outcome and bounded scope, Prepared changes and compatibility, Verification, execution and recovery plan (+1 more)

### Community 76 - "Founder contacts in the public footer"
Cohesion: 0.33
Nodes (6): Approved scope, Founder contacts in the public footer, Icon presentation follow-up — 2026-10-16, Local verification, Verification plan, LandingPage()

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
Cohesion: 0.08
Nodes (37): Beta access request change packet — 2026-10-09, Evidence and release status, Initial external configuration observations, Operations and manual acceptance, Outcome and bounded scope, Stage contracts and acceptance, Verified deployment — 2026-10-09, Authorized main publication — 2026-10-16 (+29 more)

### Community 82 - "request"
Cohesion: 0.28
Nodes (7): needsSessionRefresh(), BetaAccess(), clearProjectSessionCache(), Projects(), request(), selectedId(), ShareProjectDialog()

### Community 85 - "BuildAccounting.tsx"
Cohesion: 0.36
Nodes (7): NormalizedAIUsage, VerificationSummary(), BuildAccounting(), comparableMetrics(), runKey(), tokenCount(), UsageSummary()

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
Nodes (20): Rooms and sessions, 2guys1canvas presentation and invitation boundary (2026-09-30), Responsive delivery and synchronization, RoomView, src_workflow_overview, date(), number(), statuses (+12 more)

### Community 96 - "intent-authority.ts"
Cohesion: 0.53
Nodes (5): AcceptedIntentContext, generic, normalize(), sourceWords(), validateSubmittedInterpretation()

### Community 97 - "workflow-budget.test.ts"
Cohesion: 0.34
Nodes (10): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), ProviderRequestRecord (+2 more)

### Community 98 - "Step 10 - Cross-system integration and final harness review"
Cohesion: 0.33
Nodes (6): Baseline comparison and decisions, Checks, attempts and scope, Files and reproduction, Outcome and final boundaries, Release prerequisites and next work, Step 10 - Cross-system integration and final harness review

### Community 99 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 100 - "Steps 6–10 integration into main"
Cohesion: 0.40
Nodes (4): Fresh verification, Operational boundaries, Resolution and preserved contracts, Steps 6–10 integration into main

### Community 101 - "verify-workflow-overview.ts"
Cohesion: 0.10
Nodes (16): ref_node_fs_promises, ref_node_perf_hooks, ws, median(), run(), Sample, wait(), browser (+8 more)

### Community 102 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.40
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 103 - "role-compatible-models.md"
Cohesion: 0.40
Nodes (4): Change packet — 2026-10-16, Live release, Role-compatible OpenRouter models, Verification and release

### Community 104 - "ProjectFile"
Cohesion: 0.50
Nodes (4): ProjectFile, crc32(), createZip(), table

### Community 109 - "Multi-user Step 07 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Checks and retained attempts, Deliberately bounded coverage, Files, decision and handoff, Isolation and operator setup, Multi-user Step 07 handoff - 2026-10-04, Outcome and boundary

### Community 113 - "ai-presets.test.ts"
Cohesion: 0.29
Nodes (8): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), effortLevels, passed

### Community 114 - "linux-job-launcher.c"
Cohesion: 0.29
Nodes (5): errno, prctl, signal, stdio, unistd

### Community 117 - "ByokSetup.tsx"
Cohesion: 0.24
Nodes (8): ByokSetup is the mounted setup surface, AIConnection, TemporaryModel, ByokSetup(), dollars(), Lease, ModelChoice(), request()

### Community 118 - "main.tsx"
Cohesion: 0.25
Nodes (7): Vite HTML client mount, ref_react_dom_client, App, ProjectApp, src_studio_ivory, src_styles, clientAuthMode

### Community 119 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 120 - "Harness documentation cleanup — 2026-10-02"
Cohesion: 0.50
Nodes (4): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02

### Community 121 - "supabase-platform.ts"
Cohesion: 0.15
Nodes (16): ref_supabase_server_core, RecoveryCheckpoint, decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), AuthenticatedUser, hashToken() (+8 more)

### Community 122 - ".loadSnapshot"
Cohesion: 0.52
Nodes (3): decodePersistedYjsUpdate(), legacyBufferShape(), persistedRawBytes()

### Community 123 - "Multi-user Step 04 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites

### Community 124 - "contradiction-resolution-plan.md"
Cohesion: 0.40
Nodes (4): Conflict-group acceptance matrix, Additive ConflictGroup migration plan, Decisions needed and Disagreements UI target, Planned conflict alternatives and reopen mutations

### Community 125 - "Cleanup protected workflow contracts"
Cohesion: 0.25
Nodes (9): Bounded complete-file recovery, Immutable insertion and deletion save receipts, One durable workflow and caller-only submission, Active temporary OpenRouter BYOK, Cleanup protected workflow contracts, Three-profile controlled local cleanup browser checks, Three independent local browser profile verification, Ordered complete-file recovery and checkpoint durability (+1 more)

### Community 127 - "byok-lease.ts"
Cohesion: 0.16
Nodes (11): BYOK_LEASE_MS, BYOK_MODEL_VERSION, BYOK_ROLE_LIMITS, Lease, LeaseModel, modelsFrom(), nonnegative(), OpenRouterLeases (+3 more)

### Community 132 - "build-save-timeout-publication.md"
Cohesion: 0.14
Nodes (11): Bounded change packet, Build-save timeout publication — 2026-10-17, Integrated behavior, Verification and publication, Build my changes recovery, Change packet — 2026-10-16, Implementation and evidence, Publication and remaining acceptance (+3 more)

### Community 133 - "model-evaluation.md"
Cohesion: 0.67
Nodes (3): Deterministic inference-free routing, Model-routing evaluation protocol 2026-09-22.v3, Repeated trial qualification thresholds

### Community 135 - "Durable WorkflowOverview projection"
Cohesion: 0.67
Nodes (3): Persisted Developer task evidence, Authenticated workflow event cursor, Durable WorkflowOverview projection

## Knowledge Gaps
- **700 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+695 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1037 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `RoomManager` connect `rooms.ts` to `workflow-budget.test.ts`, `EventStore`, `tool-registry.ts`, `index.ts`, `reliability.test.ts`, `registerProjectRoutes`, `Step 09 - Conditional interpretation concurrency and topology evaluation`, `fixtures/build-progress.ts`, `ai-presets.test.ts`, `ref_node_fs`, `fixtures/multiuser-baseline.ts`, `ref_node_crypto`, `Shared response models`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `yjs` connect `ref_node_fs` to `live-collaboration-check.mjs`, `rooms.ts`, `verify-workflow-overview.ts`, `provider-reconnect.test.ts`, `local-drafts.test.ts`, `reliability.test.ts`, `index.ts`, `fixtures/build-progress.ts`, `package.json`, `fixtures/multiuser-baseline.ts`, `App.tsx`, `supabase-platform.ts`, `.loadSnapshot`, `ref_node_crypto`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Are the 33 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 33 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _700 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `rooms.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05474613686534217 - nodes in this community are weakly interconnected._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.09116809116809117 - nodes in this community are weakly interconnected._