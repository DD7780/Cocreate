# Graph Report - Cocreate  (2026-10-04)

## Corpus Check
- 168 files · ~150,539 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 5, .css 3, .example 1)

## Summary
- 1870 nodes · 3983 edges · 112 communities (93 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 93 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c622da5f`
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
- project.ts
- 202609240001_projects_auth_persistence.sql
- SupabasePlatform
- providers.ts
- rules
- ProjectApp.tsx
- AgentPanel.tsx
- docs/harness/codebase-cleanup-verification.md
- connections-ui-smoke.mjs
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
- ai-accounting.ts
- CoCreateProvider
- api
- yjs
- live-collaboration-check.mjs
- OpenRouterLeases
- devDependencies
- product.md
- verify-reliability.ts
- FakeWebSocket
- App.tsx
- 202609270001_managed_ai_funding.sql
- registerProjectRoutes
- reliability.test.ts
- BuildAccounting.tsx
- ai-presets.test.ts
- AGENTS.md
- build-recovery.ts
- supabase-platform.ts
- .loadSnapshot
- measure-responsiveness.ts
- IsolationRunner
- project-auth.test.ts
- 202609250001_email_invitations_and_sharing.sql
- scripts
- managed-catalog.ts
- 202609300001_preserve_invites_and_idempotent_delivery.sql
- main.tsx
- live-browser-collaboration-check.mjs
- verify-conflict-ui.ts
- cocreate.test.ts
- 2guys1canvas harness implementation checklist
- harness/checklist.md
- .github/workflows/code-checks.yml
- .oxfmtrc.json
- capture-auth-ui.mjs
- capture-overhaul.mjs
- capture-ui.mjs
- safeLocalDestination
- contradiction-resolution-plan.md
- artifacts.ts
- 24-pixel SVG favicon
- rooms.ts
- builder-repair.test.ts
- providers.test.ts
- Harness architecture
- preview-smoke.mjs
- verify-intent-ui.ts
- 2guys1canvas context handoff
- 2guys1canvas product brief
- public.project_persistence_quarantine
- 2guys1canvas API reference
- .mcp.json
- 2guys1canvas AI coding instructions
- artifact-restoration.test.ts
- 2guys1canvas
- verify-coordinator-postgres.ts
- Multi-user harness improvement prompts
- migrate-legacy-to-supabase.ts
- ProviderError
- intent-authority.ts
- 20261001104120_workflow_coordinator_fencing.sql
- Multi-user Step 03 handoff - 2026-10-03
- 20261003203000_coordinator_dispatch_updates.sql
- usage-ledger.ts
- Multi-user Step 01 evidence and handoff
- Multi-user Step 02 handoff - 2026-10-03
- Multi-user Step 04 handoff - 2026-10-04
- Q: [$graphify](D:\Cocreate\\.codex\skills\graphify\SKILL.md) tell me how the page reading agent work and also the building agent work once I connect the api keys.
- Durable idempotent participant submission
- compiler-worker.cjs
- oauth-callback.ts
- verify-workspace-ui.mjs
- browser-smoke.mjs
- cloudflare-container.test.ts

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 101 edges
2. `Room` - 67 edges
3. `createCoCreateServer()` - 57 edges
4. `EventStore` - 53 edges
5. `SupabasePlatform` - 49 edges
6. `2guys1canvas harness implementation checklist` - 40 edges
7. `registerProjectRoutes()` - 34 edges
8. `IsolationRunner` - 30 edges
9. `ArtifactUnavailableError` - 25 edges
10. `reconcileRequirements()` - 24 edges

## Surprising Connections (you probably didn't know these)
- `run()` --calls--> `createCoCreateServer()`  [EXTRACTED]
  scripts/measure-responsiveness.ts → server/index.ts
- `record()` --calls--> `aggregateCalls()`  [EXTRACTED]
  tests/ai-accounting.test.ts → server/ai-accounting.ts
- `manager()` --calls--> `RoomManager`  [EXTRACTED]
  tests/artifact-restoration.test.ts → server/rooms.ts
- `runScenario()` --calls--> `RoomManager`  [EXTRACTED]
  tests/fixtures/multiuser-baseline.ts → server/rooms.ts
- `createArtifactFixture()` --calls--> `SupabasePlatform`  [EXTRACTED]
  tests/fixtures/artifact-storage.ts → server/supabase-platform.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Participant-scoped durable submission safety** — api_canonical_saved_receipts, api_flush_ordering, api_retired_legacy_build, api_durable_submit, api_capture_order [EXTRACTED 1.00]
- **Verified cleanup preserves workflow authority** — docs_harness_codebase_cleanup_verification_scaffold_removal, docs_harness_codebase_cleanup_verification_shared_extraction, docs_harness_architecture_durable_workflow, docs_harness_codebase_cleanup_verification_local_cleanup_checks [EXTRACTED 1.00]
- **October durable reliability contract** — docs_harness_reliability_verification_ordered_recovery, docs_harness_reliability_verification_ordered_submission_recovery, docs_harness_architecture_canonical_save_receipts, docs_harness_architecture_coordinator_fencing [EXTRACTED 1.00]
- **Feature edit authority and import boundaries** — instructions_feature_packet, instructions_shared_boundary, instructions_source_ownership, instructions_jev_advisory [EXTRACTED 1.00]
- **Collaborative submission-to-promoted-artifact flow** — product_core_loop, product_capture_order, product_durable_receipts, product_bounded_recovery [EXTRACTED 1.00]

## Communities (112 total, 9 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.05
Nodes (63): catalogRate(), effortAllowance(), AIConfig, createCoCreateServer(), acceptedContext(), acceptanceFor(), acceptedClassification(), acceptedRequirementFingerprint() (+55 more)

### Community 1 - "README.md"
Cohesion: 0.05
Nodes (47): Historical documentation archive, Explicit pnpm native build allowlist, Current source facade and shared contracts, Shared bounded recovery and retained artifact, Current owner-controlled BYOK setup dialog, Cloudflare Worker/container deployment boundary, Controlled three-profile reliability check, Separate pinned direct TypeSafe audit adapter (+39 more)

### Community 2 - "types.ts"
Cohesion: 0.09
Nodes (24): AgentStatus, AIRateTier, AIRoutingEvidenceStatus, CapabilityCheck, ConflictDetectionStatus, ConflictGroupState, IntentCommand, IntentCommandResult (+16 more)

### Community 3 - "EventStore"
Cohesion: 0.05
Nodes (28): output, report, trials, EventInput, EventStore, json(), redact(), RunState (+20 more)

### Community 4 - "prisma/schema.prisma"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 5 - "api.md"
Cohesion: 0.11
Nodes (23): RoomView.requirementRevisions accepted snapshots, PKCE callback and account-choice flow, Authoritative multi-option ConflictGroup, Revision-safe affected-contributor conflict selections, Persisted Developer task evidence, Email-bound project invitations, Shared 24-physical-call executor ceiling, Superseded local contracts and no-cap descriptions (+15 more)

### Community 6 - "docs/harness/decisions.md"
Cohesion: 0.05
Nodes (43): D-0001 â€” Preserve the existing application while migrating additively, D-0002 â€” Personal interpretations are proposals, not builder authority, D-0003 â€” Build from the accepted registry, not the raw canvas, D-0004 â€” Deletion is not withdrawal, D-0005 â€” Pause on consequential accepted contradictions, D-0006 â€” Conflict groups and explicit affected-contributor agreement, D-0007 â€” Classify per intent and reprocess only by explicit participant action, D-0008 â€” Submit intent explicitly; collaborate continuously (+35 more)

### Community 7 - "project.ts"
Cohesion: 0.06
Nodes (48): ActorType, assertIsolationAvailable(), cancelled(), compileIsolated(), Dependency, hostEnvironment(), IsolatedRequest, IsolationError (+40 more)

### Community 8 - "202609240001_projects_auth_persistence.sql"
Cohesion: 0.13
Nodes (22): auth.users, public.protect_project_identity, document_updates_project_sequence_idx, execution_events_project_sequence_idx, project_members_user_recent_idx, projects_updated_idx, protect_project_identity, public.artifact_versions (+14 more)

### Community 9 - "SupabasePlatform"
Cohesion: 0.17
Nodes (3): fail(), normalizeProjectTitle(), SupabasePlatform

### Community 10 - "providers.ts"
Cohesion: 0.08
Nodes (24): accounting, adapters, anthropic, balancedObject(), deepseek, ErrorKind, gemini, GenerateRequest (+16 more)

### Community 11 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "ProjectApp.tsx"
Cohesion: 0.09
Nodes (13): needsSessionRefresh(), InviteResult, PendingInvite, Project, ProjectList, ProjectMember, ProjectRole, Projects() (+5 more)

### Community 13 - "AgentPanel.tsx"
Cohesion: 0.13
Nodes (12): Mandatory contracts survive optional ranking, lucide-react, react, AIConnection, AIEffort, ConflictGroup, Participant, effortChoices (+4 more)

### Community 15 - "docs/harness/codebase-cleanup-verification.md"
Cohesion: 0.10
Nodes (30): Explicit Jev provider and endpoint isolation, Browser shared server module boundary, October 4 cleanup completion, October4 structural semantic graph refresh, Vercel adapter and Jev smoke completion, AdvancedAISetup call-site correction, Bounded refactor and verification gates, Required-contract recall and context-reduction target (+22 more)

### Community 16 - "connections-ui-smoke.mjs"
Cohesion: 0.50
Nodes (3): browser, profile, provider

### Community 17 - "generator.ts"
Cohesion: 0.12
Nodes (20): RecoveryCheckpoint, clean(), demoExtract(), AgentChange, classification, compactRequirement(), compactSharedRequirement(), compactText() (+12 more)

### Community 18 - "package.json"
Cohesion: 0.06
Nodes (31): engines, node, name, packageManager, private, type, version, cross-env (+23 more)

### Community 19 - "harness/architecture.md"
Cohesion: 0.10
Nodes (20): Bounded complete-file recovery, Participant-scoped IndexedDB recovery, Immutable insertion and deletion save receipts, Single coordinator and lease fencing, One durable workflow and caller-only submission, Active temporary OpenRouter BYOK, Remaining hosted owner routing and archive limits, Verified-email invitations preserve roles and links (+12 more)

### Community 20 - "ai-presets.ts"
Cohesion: 0.11
Nodes (21): D-0014 â€” Versioned estimates, not inferred billing, CatalogEntry, classifyTaskComplexity(), cost(), estimateLayerMaximum(), layer(), longContext, migrateLegacySpecialty() (+13 more)

### Community 21 - "instructions.md"
Cohesion: 0.10
Nodes (21): React/Vite and Express facade entrypoints, Explicit affected-contributor agreement, Advisory audit provider and model authority, Runtime external/model validation, Active memory-only OpenRouter BYOK, Durable batches and cloud save receipts, Stale-worker and promotion fencing, Same-change canonical documentation maintenance (+13 more)

### Community 22 - "graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md"
Cohesion: 0.13
Nodes (19): Ambient declarations require reachability exceptions, Dated proposed codebase cleanup plan, Unmeasured optional-context reduction target, Planned deterministic reachability and boundary triage, Graph and grammar limitations in planning snapshot, Planned feature change evidence packet, Proposed model/hash/policy Jev answer cache, Proposed 20-prompt Jev evaluation (+11 more)

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+13 more)

### Community 24 - "index.ts"
Cohesion: 0.23
Nodes (8): ws, b64(), createSession(), participantId(), roomToken(), Session, duration(), Options

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "supabase.ts"
Cohesion: 0.18
Nodes (12): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution, authReturnKey, resolved (+4 more)

### Community 27 - "context.md"
Cohesion: 0.11
Nodes (18): Current browser/server coordinator facades, Current temporary OpenRouter BYOK, ByokSetup is the mounted setup surface, Durable caller-owned submission capture, Prepared coordinator migration and external verification gaps, Bounded one-file recovery checkpoints, Protected migration tool retained despite false obsolete judgment, Current Canvas Shared context rail (+10 more)

### Community 28 - "ai-accounting.ts"
Cohesion: 0.23
Nodes (12): aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, AIWorkflowMode, LegacyAISpecialty (+4 more)

### Community 29 - "CoCreateProvider"
Cohesion: 0.18
Nodes (6): deletionSignature(), CoCreateProvider, ConnectionStatus, ProviderDependencies, providerInternals, retryDelay()

### Community 30 - "api"
Cohesion: 0.38
Nodes (7): api(), Join(), enter(), Product(), changeEffort(), ConflictChoice(), submit()

### Community 31 - "yjs"
Cohesion: 0.20
Nodes (8): yjs, browserDraftStore, draftKey(), DraftStore, LocalDraftStatus, persistDraft(), restoreDraft(), merge()

### Community 32 - "live-collaboration-check.mjs"
Cohesion: 0.20
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 33 - "OpenRouterLeases"
Cohesion: 0.22
Nodes (6): BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases

### Community 34 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 35 - "product.md"
Cohesion: 0.09
Nodes (20): Deterministic inference-free routing, Model-routing evaluation protocol 2026-09-22.v3, Repeated trial qualification thresholds, DM Serif Display font, Inter font, Lucide React icons, Generated preview style isolation, Serialized eight-task and 24-call recovery (+12 more)

### Community 36 - "verify-reliability.ts"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, open(), output, providerAddress, room (+2 more)

### Community 38 - "App.tsx"
Cohesion: 0.16
Nodes (15): WorkflowStatus, FormatChoice, ProviderChoice, providerPresets, statusCopy, tokenParticipant(), Workspace(), ariaShortcut() (+7 more)

### Community 39 - "202609270001_managed_ai_funding.sql"
Cohesion: 0.17
Nodes (9): public.initialize_managed_funding, public.managed_credit_accounts, public.managed_provider_requests, public.project_managed_funding, public.project_managed_spenders, project_managed_funding_init, public.reserve_managed_request(), public.settle_managed_request() (+1 more)

### Community 40 - "registerProjectRoutes"
Cohesion: 0.22
Nodes (12): express, artifactResponse(), coordinatorResponse(), InvitationEmailSender, appOrigin(), bearer(), displayName(), message() (+4 more)

### Community 41 - "reliability.test.ts"
Cohesion: 0.10
Nodes (7): coordinatorRetry, CoordinatorUnavailableError, RemoteCoordinator, Rpc, applySteeringUpdate(), plainText(), edit()

### Community 42 - "BuildAccounting.tsx"
Cohesion: 0.29
Nodes (10): AIResolvedLayer, NormalizedAIUsage, dollars(), rateSummary(), AgentPanel(), BuildAccounting(), comparableMetrics(), runKey() (+2 more)

### Community 43 - "ai-presets.test.ts"
Cohesion: 0.29
Nodes (8): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), effortLevels, passed

### Community 44 - "AGENTS.md"
Cohesion: 0.18
Nodes (10): Durable workflow is the primary shared object, Bounded feature change packet, Graphify scoped source navigation, AST-only graph refresh, Graphify wiki broad navigation, Targets versus verified implementation, Offline Jev rankings are advisory, One logical coordinator (+2 more)

### Community 45 - "build-recovery.ts"
Cohesion: 0.35
Nodes (10): addUsage(), recoverProjectPlan(), taskSchema, callOpenAI(), generateProjectPlan(), applyOperations(), budgetProjectFiles(), validateProjectPath() (+2 more)

### Community 46 - "supabase-platform.ts"
Cohesion: 0.17
Nodes (14): RecoveryCheckpoint, decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), AuthenticatedUser, hashToken(), normalizeInviteEmail() (+6 more)

### Community 47 - ".loadSnapshot"
Cohesion: 0.46
Nodes (4): decodePersistedYjsUpdate(), encodePostgresBytea(), legacyBufferShape(), persistedRawBytes()

### Community 48 - "measure-responsiveness.ts"
Cohesion: 0.28
Nodes (7): September 26 localhost responsiveness benchmark, Lazy route split transferred-byte evidence, Unmeasured production and provider timing, median(), run(), Sample, wait()

### Community 49 - "IsolationRunner"
Cohesion: 0.12
Nodes (20): BASIC_LIMIT, DllImport, EXTENDED_LIMIT, FileSystemRights, IntPtr, IO_COUNTERS, PROCESS_INFORMATION, SecurityIdentifier (+12 more)

### Community 50 - "project-auth.test.ts"
Cohesion: 0.20
Nodes (8): verifySession(), InvitationDelivery, InvitationEmail, invitationEmailSenderFromEnv(), validSender(), supabasePlatformFromEnv(), supabasePlatformInternals, deployedPublicEnv

### Community 51 - "202609250001_email_invitations_and_sharing.sql"
Cohesion: 0.36
Nodes (7): project_invites_creator_rate_idx, project_invites_one_active_email_idx, project_invites_project_created_idx, public.create_project_invite(), public.resend_project_invite(), public.project_invites, public.project_members

### Community 52 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, audit:code, build, check:boundaries, deploy:cloudflare, dev, migrate:legacy, start (+1 more)

### Community 53 - "managed-catalog.ts"
Cohesion: 0.17
Nodes (14): [command,file], MANAGED_CATALOG_SOURCE, MANAGED_CATALOG_VERSION, MANAGED_DEFAULT_BUILDER, MANAGED_INTERPRETER_CANDIDATES, managedBuilder(), managedCatalog, ManagedCatalogEntry (+6 more)

### Community 54 - "202609300001_preserve_invites_and_idempotent_delivery.sql"
Cohesion: 0.36
Nodes (5): project_invites_request_key_idx, public.create_project_invite_v2(), public.resend_project_invite(), public.project_invites, public.project_members

### Community 55 - "main.tsx"
Cohesion: 0.38
Nodes (5): Historical unreachable scaffold candidates, Vite HTML client mount, App, ProjectApp, clientAuthMode

### Community 56 - "live-browser-collaboration-check.mjs"
Cohesion: 0.38
Nodes (4): browser(), clients, json(), origin

### Community 57 - "verify-conflict-ui.ts"
Cohesion: 0.29
Nodes (6): browser, dataDir, group, profile, room, token

### Community 58 - "cocreate.test.ts"
Cohesion: 0.53
Nodes (3): keepLastSuccess(), shouldPromoteRevision(), previewDocument()

### Community 59 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (40): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+32 more)

### Community 60 - "harness/checklist.md"
Cohesion: 0.10
Nodes (20): October 1 local reliability evidence, October 3 Graphify maintenance evidence, October 3 cleanup plan history, October 1 reliability verification history, October 1 Studio Ivory local checks history, Authority and changes, Documentation validation and remaining limits, Evidence inspected (+12 more)

### Community 61 - ".github/workflows/code-checks.yml"
Cohesion: 0.43
Nodes (6): Frozen pnpm lockfile installation, Commit-pinned GitHub Actions, Code checks on push and pull request, CI pnpm 10.18.3 and Node 24, Import-boundary, test and build gates, Offline GitHub code validation

### Community 62 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "capture-auth-ui.mjs"
Cohesion: 0.40
Nodes (3): browser, output, profile

### Community 64 - "capture-overhaul.mjs"
Cohesion: 0.40
Nodes (3): browser, outputDir, profile

### Community 65 - "capture-ui.mjs"
Cohesion: 0.40
Nodes (3): browser, outputDir, profile

### Community 66 - "safeLocalDestination"
Cohesion: 0.36
Nodes (8): safeLocalDestination(), authMessage(), ForgotPassword(), intendedDestination(), Login(), ProjectApp(), Signup(), supabaseAuthCallbackUrl()

### Community 68 - "contradiction-resolution-plan.md"
Cohesion: 0.40
Nodes (4): Conflict-group acceptance matrix, Additive ConflictGroup migration plan, Decisions needed and Disagreements UI target, Planned conflict alternatives and reopen mutations

### Community 69 - "artifacts.ts"
Cohesion: 0.17
Nodes (21): ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, ArtifactUnavailableError, ArtifactVersion, bodyFromBytes(), canonicalJson() (+13 more)

### Community 70 - "24-pixel SVG favicon"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "rooms.ts"
Cohesion: 0.10
Nodes (27): ArchivedVersion, applyIntentCommand(), categories, fail(), intentCommandHash(), parseIntentCommand(), AISettings, BudgetWindow (+19 more)

### Community 73 - "providers.test.ts"
Cohesion: 0.24
Nodes (9): listProviderModels(), providerConfig(), testOpenAIConnection(), adapterFor(), discoverModels(), generateText(), ProviderConfig, withProviderAccounting() (+1 more)

### Community 74 - "Harness architecture"
Cohesion: 0.08
Nodes (25): 2guys1canvas presentation and invitation boundary (2026-09-30), Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Bounded context and cost target, Browser recovery and transport batching — 2026-09-28, Collaboration connection lifecycle, Connection and managed-access boundary, Deployment constraint (+17 more)

### Community 75 - "preview-smoke.mjs"
Cohesion: 0.50
Nodes (3): browser, profile, roomId

### Community 76 - "verify-intent-ui.ts"
Cohesion: 0.12
Nodes (15): Browser, browsers, dataDir, fake, inputs, open(), output, providerAddress (+7 more)

### Community 77 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 78 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 80 - "2guys1canvas API reference"
Cohesion: 0.12
Nodes (16): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+8 more)

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
Cohesion: 0.14
Nodes (11): pg, a, admin, b, checks, ownerA, ownerB, project (+3 more)

### Community 94 - "Multi-user harness improvement prompts"
Cohesion: 0.15
Nodes (13): Common contract, Multi-user harness improvement prompts, Starting instruction, Step 01 - Audit, scenarios and baseline, Step 02 - Coordinator fencing and owner routing, Step 03 - Artifact persistence and restoration, Step 04 - Generated execution isolation, Step 05 - Intent inspection, correction and contextual references (+5 more)

### Community 95 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.17
Nodes (10): @supabase/supabase-js, apply, args, backup, client, dataArg, dataDir, mapping (+2 more)

### Community 96 - "ProviderError"
Cohesion: 0.32
Nodes (7): boundedInput(), bearer(), classify(), ensure(), ProviderError, request(), sleep()

### Community 97 - "intent-authority.ts"
Cohesion: 0.36
Nodes (7): AcceptedIntentContext, generic, normalize(), sourceWords(), validateSubmittedInterpretation(), InterpretationIntent, SharedRequirement

### Community 98 - "20261001104120_workflow_coordinator_fencing.sql"
Cohesion: 0.29
Nodes (3): Workflow coordinator fencing RPC contracts, public.workflow_coordinator_leases, public.projects

### Community 99 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 101 - "usage-ledger.ts"
Cohesion: 0.38
Nodes (4): aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes

### Community 102 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.33
Nodes (6): Later-step source audit, Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 103 - "Multi-user Step 02 handoff - 2026-10-03"
Cohesion: 0.33
Nodes (6): Database rollout, compatibility and rollback, Files and decisions, Fresh verification and scope, Multi-user Step 02 handoff - 2026-10-03, Next task, Outcome and boundaries

### Community 104 - "Multi-user Step 04 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites

### Community 105 - "Q: [$graphify](D:\Cocreate\\.codex\skills\graphify\SKILL.md) tell me how the page reading agent work and also the building agent work once I connect the api keys."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: [$graphify](D:\Cocreate\\.codex\skills\graphify\SKILL.md) tell me how the page reading agent work and also the building agent work once I connect the api keys., Source Nodes

### Community 106 - "Durable idempotent participant submission"
Cohesion: 0.50
Nodes (4): Immutable canonical WebSocket saved receipts, Capture-order interpretation and explicit recovery, Durable idempotent participant submission, Ordered flush acknowledgment

### Community 108 - "oauth-callback.ts"
Cohesion: 0.50
Nodes (3): completeOAuthCallback(), OAuthCallbackOutcome, Callback()

## Knowledge Gaps
- **533 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+528 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 839 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `yjs` connect `yjs` to `live-collaboration-check.mjs`, `RoomManager`, `EventStore`, `integration.test.ts`, `App.tsx`, `rooms.ts`, `reliability.test.ts`, `artifact-restoration.test.ts`, `supabase-platform.ts`, `.loadSnapshot`, `measure-responsiveness.ts`, `auto-build-budget.test.ts`, `package.json`, `harness/architecture.md`, `project-auth.test.ts`, `cocreate.test.ts`, `context.md`, `CoCreateProvider`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `EventStore` connect `EventStore` to `RoomManager`, `artifacts.ts`, `usage-ledger.ts`, `project.ts`, `rooms.ts`, `reliability.test.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `RoomManager` connect `RoomManager` to `EventStore`, `rooms.ts`, `registerProjectRoutes`, `project.ts`, `reliability.test.ts`, `ai-presets.test.ts`, `auto-build-budget.test.ts`, `managed-catalog.ts`, `index.ts`, `artifact-restoration.test.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Are the 32 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 32 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _533 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.05121412803532009 - nodes in this community are weakly interconnected._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.05480225988700565 - nodes in this community are weakly interconnected._