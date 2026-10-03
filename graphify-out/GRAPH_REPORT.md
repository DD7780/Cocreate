# Graph Report - Cocreate  (2026-10-04)

## Corpus Check
- 135 files · ~89,401 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 5, .css 2, .example 1)

## Summary
- 1511 nodes · 3830 edges · 92 communities (77 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 80 edges (avg confidence: 0.84)
- Token cost: local AST 0; host semantic token usage unavailable (not recorded as zero). No separate provider API calls.

## Community Hubs (Navigation)
- Workflow Coordinator and Room State
- Local Setup and Deployment Configuration
- Shared Types and Physical Usage
- Durable Local Event Store
- Database Introspection Declarations
- Reliability and Coordinator Contracts
- Accepted Product and Engineering Decisions
- Validated Operations and Build Recovery
- Hosted Project Tables and Migration
- Hosted Membership and Persistence
- Provider Dispatch and Validation
- Static Linter Configuration
- Project Navigation and Hosted Auth
- Workspace Editor and BYOK Setup
- Test Runtime Dependencies
- Cleanup Evidence and Feature Scope
- Browser and Filesystem Tooling
- Interpretation and Project Generation
- Application Package and Toolchain
- Workflow Architecture and Reliability Evidence
- Historical AI Settings and Accounting
- Current Coding and Authority Rules
- Historical Cleanup Planning Memory
- Application Runtime Dependencies
- HTTP Server and Local Authentication
- TypeScript Project Configuration
- Browser Supabase Auth Configuration
- Current Context and Studio Styles
- Historical AI Usage Accounting
- Collaboration Provider and Save Receipts
- Context Decisions and Effort Controls
- Participant Local Draft Persistence
- Live Protocol Collaboration Check
- Temporary OpenRouter Credential Lease
- Development and Introspection Dependencies
- Current Workflow Product Contract
- Controlled Collaborative Browser Verification
- Provider Reconnect Protocol Tests
- Explicit Submission and Build Shortcut
- Historical Managed Funding Contracts
- Project Membership and Invitation Routes
- Submission and Durable Recovery Tests
- Recorded Usage and Accounting Views
- Historical AI Qualification Tests
- Agent Entrypoint and Feature Packets
- Complete-File Build Recovery
- Invitation Mutation and Credential Encryption
- Validated CRDT Persistence Encoding
- Responsiveness Measurement Evidence
- Historical Managed Qualification Tooling
- Invitation Email Delivery Adapter
- Email Invitations and Sharing Migration
- Package Verification and Operations Commands
- Historical Managed Catalog Qualification
- Idempotent Invitation Delivery Migration
- Active Vite Client Entrypoint
- Live Browser Collaboration Check
- Conflict Resolution Browser Check
- Revision Promotion and Preview Tests
- Vercel Jev Triage Evidence
- Current and Historical Verification Checklist
- GitHub Source Verification Gates
- Source Formatter Configuration
- Authentication Screenshot Capture
- Historical UI Screenshot Capture
- Workspace Screenshot Capture
- Sign-In and Recovery Navigation
- End-to-End Local Integration Tests
- Historical Conflict Resolution Plan
- Interface Fonts and Icons
- Application Favicon Geometry
- Local Demonstration Interpretation
- Generated Project Repair Tests
- Provider Contract Tests
- Browser Auth Session Refresh
- Generated Preview Browser Smoke
- Historical Harness Migration Plan
- Historical Model Evaluation Protocol
- Vite Application Build Configuration
- Persisted CRDT Repair Migration
- Historical Harness Source Assessment
- Supabase Tool Connection Configuration
- Durable Physical Provider Ledger

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 87 edges
2. `Room` - 61 edges
3. `createCoCreateServer()` - 55 edges
4. `EventStore` - 48 edges
5. `SupabasePlatform` - 38 edges
6. `registerProjectRoutes()` - 31 edges
7. `fail()` - 24 edges
8. `rules` - 22 edges
9. `yjs` - 21 edges
10. `reconcileRequirements()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `run()` --calls--> `createCoCreateServer()`  [EXTRACTED]
  scripts/measure-responsiveness.ts → server/index.ts
- `Offline GitHub code validation` --conceptually_related_to--> `Import-boundary, test and build gates`  [INFERRED]
  README.md → .github/workflows/code-checks.yml
- `record()` --calls--> `aggregateCalls()`  [EXTRACTED]
  tests/ai-accounting.test.ts → server/ai-accounting.ts
- `Graph and grammar limitations in planning snapshot` --references--> `graphify-out/SOURCE_MAP.md`  [EXTRACTED]
  graphify-out/memory/query_20261003_174828_a1ca891f_graphify__d__cocreate___codex_skills_graphify_sk.md → context.md
- `cost()` --calls--> `maximumAllowanceCharge()`  [EXTRACTED]
  server/ai-presets.ts → server/ai-accounting.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Participant-scoped durable submission safety** — api_canonical_saved_receipts, api_flush_ordering, api_retired_legacy_build, api_durable_submit, api_capture_order [EXTRACTED 1.00]
- **Verified cleanup preserves workflow authority** — docs_harness_codebase_cleanup_verification_scaffold_removal, docs_harness_codebase_cleanup_verification_shared_extraction, docs_harness_architecture_durable_workflow, docs_harness_codebase_cleanup_verification_local_cleanup_checks [EXTRACTED 1.00]
- **October durable reliability contract** — docs_harness_reliability_verification_ordered_recovery, docs_harness_reliability_verification_ordered_submission_recovery, docs_harness_architecture_canonical_save_receipts, docs_harness_architecture_coordinator_fencing [EXTRACTED 1.00]
- **Feature edit authority and import boundaries** — instructions_feature_packet, instructions_shared_boundary, instructions_source_ownership, instructions_jev_advisory [EXTRACTED 1.00]
- **Collaborative submission-to-promoted-artifact flow** — product_core_loop, product_capture_order, product_durable_receipts, product_bounded_recovery [EXTRACTED 1.00]

## Communities (92 total, 6 thin omitted)

### Community 0 - "Workflow Coordinator and Room State"
Cohesion: 0.07
Nodes (55): node:stream, y-protocols/awareness, catalogRate(), effortAllowance(), migrateLegacySpecialty(), workflowInstruction(), AIConfig, createCoCreateServer() (+47 more)

### Community 1 - "Local Setup and Deployment Configuration"
Cohesion: 0.05
Nodes (48): Explicit pnpm native build allowlist, Current source facade and shared contracts, Shared bounded recovery and retained artifact, Current owner-controlled BYOK setup dialog, Cloudflare Worker/container deployment boundary, Controlled three-profile reliability check, Separate pinned direct TypeSafe audit adapter, Gateway-reported cost versus input-token estimates (+40 more)

### Community 2 - "Shared Types and Physical Usage"
Cohesion: 0.06
Nodes (53): acceptanceFor(), acceptedClassification(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries(), categories, classifications (+45 more)

### Community 3 - "Durable Local Event Store"
Cohesion: 0.09
Nodes (16): node:sqlite, EventInput, EventStore, json(), redact(), RunState, StoredEvent, StoredRun (+8 more)

### Community 4 - "Database Introspection Declarations"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 5 - "Reliability and Coordinator Contracts"
Cohesion: 0.07
Nodes (35): RoomView.requirementRevisions accepted snapshots, PKCE callback and account-choice flow, Immutable canonical WebSocket saved receipts, Capture-order interpretation and explicit recovery, Authoritative multi-option ConflictGroup, Revision-safe affected-contributor conflict selections, Workflow coordinator fencing RPC contracts, Persisted Developer task evidence (+27 more)

### Community 6 - "Accepted Product and Engineering Decisions"
Cohesion: 0.05
Nodes (43): D-0001 â€” Preserve the existing application while migrating additively, D-0002 â€” Personal interpretations are proposals, not builder authority, D-0003 â€” Build from the accepted registry, not the raw canvas, D-0004 â€” Deletion is not withdrawal, D-0005 â€” Pause on consequential accepted contradictions, D-0006 â€” Conflict groups and explicit affected-contributor agreement, D-0007 â€” Classify per intent and reprocess only by explicit participant action, D-0008 â€” Submit intent explicitly; collaborate continuously (+35 more)

### Community 7 - "Validated Operations and Build Recovery"
Cohesion: 0.10
Nodes (33): esbuild, node:module, node:path/posix, ActorType, allowedExtensions, applyOperations(), bundleProject(), downloadableFiles() (+25 more)

### Community 8 - "Hosted Project Tables and Migration"
Cohesion: 0.11
Nodes (36): auth.users, public.protect_project_identity, dotenv/config, apply, args, backup, client, dataArg (+28 more)

### Community 9 - "Hosted Membership and Persistence"
Cohesion: 0.14
Nodes (13): @supabase/server/core, AuthenticatedUser, fail(), normalizeProjectTitle(), PlatformConfig, ProjectInviteSummary, ProjectMemberSummary, ProjectRow (+5 more)

### Community 10 - "Provider Dispatch and Validation"
Cohesion: 0.08
Nodes (30): node:async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+22 more)

### Community 11 - "Static Linter Configuration"
Cohesion: 0.11
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 12 - "Project Navigation and Hosted Auth"
Cohesion: 0.08
Nodes (15): completeOAuthCallback(), OAuthCallbackOutcome, Callback(), InviteResult, PendingInvite, Project, ProjectList, ProjectMember (+7 more)

### Community 13 - "Workspace Editor and BYOK Setup"
Cohesion: 0.09
Nodes (22): ByokSetup is the mounted setup surface, lucide-react, react, @tiptap/extension-collaboration, @tiptap/extension-collaboration-caret, @tiptap/react, @tiptap/starter-kit, AIConnection (+14 more)

### Community 14 - "Test Runtime Dependencies"
Cohesion: 0.13
Nodes (12): node:assert/strict, node:http, node:test, yjs, Requirement, response(), send(), waitFor() (+4 more)

### Community 15 - "Cleanup Evidence and Feature Scope"
Cohesion: 0.12
Nodes (22): Browser shared server module boundary, October 4 cleanup completion, AdvancedAISetup call-site correction, Bounded refactor and verification gates, Required-contract recall and context-reduction target, Dated Jev pilot pricing and cost assumptions, Advisory offline Jev pilot, Static reachability is insufficient for deletion (+14 more)

### Community 16 - "Browser and Filesystem Tooling"
Cohesion: 0.14
Nodes (13): node:child_process, node:fs, node:os, node:path, browser, profile, ConflictGroup, browser (+5 more)

### Community 17 - "Interpretation and Project Generation"
Cohesion: 0.14
Nodes (23): boundedInput(), callOpenAI(), classification, compactRequirement(), compactSharedRequirement(), compactText(), DEFAULT_PROJECT_OUTPUT_TOKENS, extractRequirement() (+15 more)

### Community 18 - "Application Package and Toolchain"
Cohesion: 0.09
Nodes (23): engines, node, name, packageManager, private, type, version, cross-env (+15 more)

### Community 19 - "Workflow Architecture and Reliability Evidence"
Cohesion: 0.12
Nodes (21): October 1 local reliability evidence, Bounded complete-file recovery, Participant-scoped IndexedDB recovery, Immutable insertion and deletion save receipts, Single coordinator and lease fencing, One durable workflow and caller-only submission, Active temporary OpenRouter BYOK, Remaining hosted owner routing and archive limits (+13 more)

### Community 20 - "Historical AI Settings and Accounting"
Cohesion: 0.12
Nodes (20): D-0014 â€” Versioned estimates, not inferred billing, CatalogEntry, classifyTaskComplexity(), cost(), estimateLayerMaximum(), layer(), longContext, modelCatalog (+12 more)

### Community 21 - "Current Coding and Authority Rules"
Cohesion: 0.10
Nodes (21): React/Vite and Express facade entrypoints, Explicit affected-contributor agreement, Advisory audit provider and model authority, Runtime external/model validation, Active memory-only OpenRouter BYOK, Durable batches and cloud save receipts, Stale-worker and promotion fencing, Same-change canonical documentation maintenance (+13 more)

### Community 22 - "Historical Cleanup Planning Memory"
Cohesion: 0.13
Nodes (19): Ambient declarations require reachability exceptions, Dated proposed codebase cleanup plan, Unmeasured optional-context reduction target, Planned deterministic reachability and boundary triage, Graph and grammar limitations in planning snapshot, Planned feature change evidence packet, Proposed model/hash/policy Jev answer cache, Proposed 20-prompt Jev evaluation (+11 more)

### Community 23 - "Application Runtime Dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, express, lucide-react, react (+12 more)

### Community 24 - "HTTP Server and Local Authentication"
Cohesion: 0.22
Nodes (12): node:stream, node:crypto, ws, b64(), createSession(), participantId(), roomToken(), Session (+4 more)

### Community 25 - "TypeScript Project Configuration"
Cohesion: 0.20
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 26 - "Browser Supabase Auth Configuration"
Cohesion: 0.19
Nodes (15): @supabase/supabase-js, legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), safeLocalDestination(), SupabaseAuthConfig, SupabaseAuthResolution (+7 more)

### Community 27 - "Current Context and Studio Styles"
Cohesion: 0.15
Nodes (13): Current browser/server coordinator facades, Current temporary OpenRouter BYOK, Durable caller-owned submission capture, Prepared coordinator migration and external verification gaps, Bounded one-file recovery checkpoints, Protected migration tool retained despite false obsolete judgment, Current Canvas Shared context rail, Source boundary audit and advisory Jev review (+5 more)

### Community 28 - "Historical AI Usage Accounting"
Cohesion: 0.28
Nodes (12): aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, AIRunCall, LegacyAISpecialty (+4 more)

### Community 29 - "Collaboration Provider and Save Receipts"
Cohesion: 0.33
Nodes (4): RoomView, CoCreateProvider, ProviderDependencies, retryDelay()

### Community 30 - "Context Decisions and Effort Controls"
Cohesion: 0.28
Nodes (10): effortChoices, api(), tokenRole(), Product(), AgentPanel(), changeEffort(), reinterpret(), send() (+2 more)

### Community 31 - "Participant Local Draft Persistence"
Cohesion: 0.24
Nodes (10): browserDraftStore, draftKey(), DraftStore, LocalDraftStatus, persistDraft(), restoreDraft(), memory(), merge() (+2 more)

### Community 32 - "Live Protocol Collaboration Check"
Cohesion: 0.30
Nodes (13): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+5 more)

### Community 33 - "Temporary OpenRouter Credential Lease"
Cohesion: 0.30
Nodes (6): BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases

### Community 34 - "Development and Introspection Dependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 35 - "Current Workflow Product Contract"
Cohesion: 0.14
Nodes (13): Serialized eight-task and 24-call recovery, Disconnected-first OpenRouter BYOK setup, Attributed capture-order interpretation, Collaborative submission-to-artifact loop, Developer-only activatable workflow, Immutable cloud save and replay receipts, Verified email-bound invitations, Small React/TypeScript frontend scope (+5 more)

### Community 36 - "Controlled Collaborative Browser Verification"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, fakeAddress, open(), output, room (+2 more)

### Community 37 - "Provider Reconnect Protocol Tests"
Cohesion: 0.24
Nodes (6): deletionSignature(), ConnectionStatus, providerInternals, binary(), FakeWebSocket, tick()

### Community 38 - "Explicit Submission and Build Shortcut"
Cohesion: 0.34
Nodes (10): Workspace(), ariaShortcut(), BUILD_SHORTCUT_STORAGE_KEY, BuildShortcutPreference, defaultBuildShortcut(), isBuildShortcut(), readBuildShortcut(), ShortcutEvent (+2 more)

### Community 39 - "Historical Managed Funding Contracts"
Cohesion: 0.22
Nodes (11): public.initialize_managed_funding, public.managed_credit_accounts, public.managed_provider_requests, public.project_managed_funding, public.project_managed_spenders, project_managed_funding_init, public.create_project(), public.initialize_managed_funding() (+3 more)

### Community 40 - "Project Membership and Invitation Routes"
Cohesion: 0.27
Nodes (10): express, appOrigin(), bearer(), displayName(), message(), recipientKey(), registerProjectRoutes(), requestKey() (+2 more)

### Community 41 - "Submission and Durable Recovery Tests"
Cohesion: 0.28
Nodes (10): applySteeringUpdate(), plainText(), connectFixture(), edit(), fixture(), interpreted(), plan(), response() (+2 more)

### Community 42 - "Recorded Usage and Accounting Views"
Cohesion: 0.28
Nodes (10): AIResolvedLayer, AIRunRecord, NormalizedAIUsage, dollars(), rateSummary(), BuildAccounting(), comparableMetrics(), runKey() (+2 more)

### Community 43 - "Historical AI Qualification Tests"
Cohesion: 0.33
Nodes (8): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), effortLevels, passed

### Community 44 - "Agent Entrypoint and Feature Packets"
Cohesion: 0.18
Nodes (10): Durable workflow is the primary shared object, Bounded feature change packet, Graphify scoped source navigation, AST-only graph refresh, Graphify wiki broad navigation, Targets versus verified implementation, Offline Jev rankings are advisory, One logical coordinator (+2 more)

### Community 45 - "Complete-File Build Recovery"
Cohesion: 0.24
Nodes (10): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, budgetProjectFiles(), ProjectPlan, generateStructured(), mergeUsage() (+2 more)

### Community 46 - "Invitation Mutation and Credential Encryption"
Cohesion: 0.36
Nodes (6): decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), hashToken(), normalizeInviteEmail()

### Community 47 - "Validated CRDT Persistence Encoding"
Cohesion: 0.36
Nodes (4): decodePersistedYjsUpdate(), encodePostgresBytea(), legacyBufferShape(), persistedRawBytes()

### Community 48 - "Responsiveness Measurement Evidence"
Cohesion: 0.24
Nodes (8): September 26 localhost responsiveness benchmark, Lazy route split transferred-byte evidence, Unmeasured production and provider timing, node:perf_hooks, median(), run(), Sample, wait()

### Community 49 - "Historical Managed Qualification Tooling"
Cohesion: 0.38
Nodes (6): node:fs/promises, [command,file], MANAGED_QUALIFICATION_VERSION, managedFixtures, ManagedTrial, scoreManagedTrials()

### Community 50 - "Invitation Email Delivery Adapter"
Cohesion: 0.40
Nodes (7): html(), InvitationDelivery, InvitationEmail, InvitationEmailSender, invitationEmailSenderFromEnv(), plain(), validSender()

### Community 51 - "Email Invitations and Sharing Migration"
Cohesion: 0.44
Nodes (8): project_invites_creator_rate_idx, project_invites_one_active_email_idx, project_invites_project_created_idx, public.accept_project_invite(), public.create_project_invite(), public.resend_project_invite(), public.project_invites, public.project_members

### Community 52 - "Package Verification and Operations Commands"
Cohesion: 0.22
Nodes (9): scripts, audit:code, build, check:boundaries, deploy:cloudflare, dev, migrate:legacy, start (+1 more)

### Community 53 - "Historical Managed Catalog Qualification"
Cohesion: 0.22
Nodes (7): MANAGED_CATALOG_SOURCE, MANAGED_CATALOG_VERSION, MANAGED_DEFAULT_BUILDER, MANAGED_INTERPRETER_CANDIDATES, managedCatalog, ManagedCatalogEntry, AIRate

### Community 54 - "Idempotent Invitation Delivery Migration"
Cohesion: 0.44
Nodes (7): project_invites_request_key_idx, public.accept_project_invite(), public.create_project_invite_v2(), public.resend_project_invite(), public.resend_project_invite_v2(), public.project_invites, public.project_members

### Community 55 - "Active Vite Client Entrypoint"
Cohesion: 0.32
Nodes (6): Historical unreachable scaffold candidates, Vite HTML client mount, react-dom/client, App, ProjectApp, clientAuthMode

### Community 56 - "Live Browser Collaboration Check"
Cohesion: 0.50
Nodes (6): browser(), clients, json(), origin, type(), waitFor()

### Community 57 - "Conflict Resolution Browser Check"
Cohesion: 0.46
Nodes (6): browser, dataDir, group, profile, room, token

### Community 58 - "Revision Promotion and Preview Tests"
Cohesion: 0.43
Nodes (3): keepLastSuccess(), shouldPromoteRevision(), previewDocument()

### Community 59 - "Vercel Jev Triage Evidence"
Cohesion: 0.48
Nodes (7): Explicit Jev provider and endpoint isolation, Vercel adapter and Jev smoke completion, Implemented Vercel Jev follow-up, Jev adapter verification and incomplete comparison, 20-file Vercel historical Jev smoke evidence, Protected migration Jev false positive retained, D-0044 Vercel credentials route through AI Gateway

### Community 60 - "Current and Historical Verification Checklist"
Cohesion: 0.29
Nodes (6): October4 structural semantic graph refresh, October 3 Graphify maintenance evidence, October 3 cleanup plan history, October 1 reliability verification history, October 1 Studio Ivory local checks history, Final graph refresh and review checks

### Community 61 - "GitHub Source Verification Gates"
Cohesion: 0.43
Nodes (6): Frozen pnpm lockfile installation, Commit-pinned GitHub Actions, Code checks on push and pull request, CI pnpm 10.18.3 and Node 24, Import-boundary, test and build gates, Offline GitHub code validation

### Community 62 - "Source Formatter Configuration"
Cohesion: 0.52
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 63 - "Authentication Screenshot Capture"
Cohesion: 0.60
Nodes (4): browser, output, profile, wait()

### Community 64 - "Historical UI Screenshot Capture"
Cohesion: 0.60
Nodes (4): browser, outputDir, profile, wait()

### Community 65 - "Workspace Screenshot Capture"
Cohesion: 0.60
Nodes (4): browser, outputDir, profile, wait()

### Community 66 - "Sign-In and Recovery Navigation"
Cohesion: 0.47
Nodes (6): authMessage(), ForgotPassword(), intendedDestination(), Login(), Signup(), supabaseAuthCallbackUrl()

### Community 67 - "End-to-End Local Integration Tests"
Cohesion: 0.60
Nodes (4): json(), output(), recipeSource(), waitFor()

### Community 68 - "Historical Conflict Resolution Plan"
Cohesion: 0.40
Nodes (4): Conflict-group acceptance matrix, Additive ConflictGroup migration plan, Decisions needed and Disagreements UI target, Planned conflict alternatives and reopen mutations

### Community 69 - "Interface Fonts and Icons"
Cohesion: 0.40
Nodes (4): DM Serif Display font, Inter font, Lucide React icons, Generated preview style isolation

### Community 70 - "Application Favicon Geometry"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 71 - "Local Demonstration Interpretation"
Cohesion: 0.70
Nodes (3): clean(), demoExtract(), AgentChange

### Community 72 - "Generated Project Repair Tests"
Cohesion: 0.60
Nodes (3): projectSchema, plan(), response()

### Community 73 - "Provider Contract Tests"
Cohesion: 0.60
Nodes (3): ProviderConfig, json(), schema

### Community 75 - "Generated Preview Browser Smoke"
Cohesion: 0.70
Nodes (3): browser, profile, roomId

### Community 76 - "Historical Harness Migration Plan"
Cohesion: 0.50
Nodes (3): Additive local event-store rollout, Later harness migration prerequisites, Preserve SQLite and backups during rollback

### Community 77 - "Historical Model Evaluation Protocol"
Cohesion: 0.67
Nodes (3): Deterministic inference-free routing, Model-routing evaluation protocol 2026-09-22.v3, Repeated trial qualification thresholds

## Knowledge Gaps
- **144 isolated node(s):** `name`, `version`, `private`, `type`, `@supabase/server` (+139 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 357 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `yjs` connect `Test Runtime Dependencies` to `Live Protocol Collaboration Check`, `Workflow Coordinator and Room State`, `End-to-End Local Integration Tests`, `Provider Reconnect Protocol Tests`, `Submission and Durable Recovery Tests`, `Hosted Membership and Persistence`, `Workspace Editor and BYOK Setup`, `Validated CRDT Persistence Encoding`, `Responsiveness Measurement Evidence`, `Application Package and Toolchain`, `Revision Promotion and Preview Tests`, `Collaboration Provider and Save Receipts`, `Participant Local Draft Persistence`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `Planned deterministic reachability and boundary triage` connect `Historical Cleanup Planning Memory` to `Workflow Coordinator and Room State`, `Provider Dispatch and Validation`, `Project Navigation and Hosted Auth`, `Workspace Editor and BYOK Setup`, `Active Vite Client Entrypoint`, `HTTP Server and Local Authentication`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `EventStore` connect `Durable Local Event Store` to `Workflow Coordinator and Room State`, `Submission and Durable Recovery Tests`, `Test Runtime Dependencies`, `Validated Operations and Build Recovery`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Are the 32 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 32 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _144 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Workflow Coordinator and Room State` be split into smaller, more focused modules?**
  _Cohesion score 0.06928059218135554 - nodes in this community are weakly interconnected._
- **Should `Local Setup and Deployment Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.053763440860215055 - nodes in this community are weakly interconnected._