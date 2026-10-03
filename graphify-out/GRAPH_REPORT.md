# Graph Report - Cocreate  (2026-10-04)

## Corpus Check
- 135 files · ~88,260 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 5, .css 2, .example 1)

## Summary
- 1493 nodes · 3791 edges · 78 communities (64 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 76 edges (avg confidence: 0.84)
- Token cost: local AST 0; host semantic token usage unavailable (not recorded as zero). No separate provider API calls.

## Community Hubs (Navigation)
- Workflow Coordinator and Room State
- Workspace Editor and BYOK Setup
- Durable Local Event Store
- Project Navigation and Hosted Auth
- Historical AI Settings and Accounting
- Database Introspection Declarations
- Reliability and Coordinator Contracts
- Accepted Product and Engineering Decisions
- Static Audit and Jev Review
- Hosted Project Tables and Migration
- Attributed Requirement Reconciliation
- Provider Dispatch and Validation
- Hosted Membership and Persistence
- Static Linter Configuration
- Application Package and Toolchain
- Cleanup Evidence and Feature Scope
- Collaboration Provider and Save Receipts
- Shared Types and Physical Usage
- Validated Operations and Build Recovery
- Interpretation and Project Generation
- HTTP Server and Local Authentication
- Workflow Architecture and Reliability Evidence
- Current Context and Studio Styles
- Historical Cleanup Planning Memory
- Current Coding and Authority Rules
- Test Runtime Dependencies
- Application Runtime Dependencies
- Local Setup and Deployment Configuration
- TypeScript Project Configuration
- Live Protocol Collaboration Check
- Temporary OpenRouter Credential Lease
- Development and Introspection Dependencies
- Current Workflow Product Contract
- Browser Smoke and Workspace Tooling
- Submission and Durable Recovery Tests
- Controlled Collaborative Browser Verification
- Historical Managed Funding Contracts
- Project Membership and Invitation Routes
- HTTP Collaboration and Browser Tests
- Agent Entrypoint and Feature Packets
- Invitation Mutation and Credential Encryption
- Validated CRDT Persistence Encoding
- Responsiveness Measurement Evidence
- Invitation Email Delivery Adapter
- Email Invitations and Sharing Migration
- Cloudflare Container Lifecycle
- Provider Contract Tests
- Idempotent Invitation Delivery Migration
- Live Browser Collaboration Check
- Conflict Resolution Browser Check
- Revision Promotion and Preview Tests
- GitHub Source Verification Gates
- Source Formatter Configuration
- Authentication Screenshot Capture
- Historical UI Screenshot Capture
- Workspace Screenshot Capture
- Project ZIP Artifact Export
- End-to-End Local Integration Tests
- Historical Conflict Resolution Plan
- Interface Fonts and Icons
- Application Favicon Geometry
- Generated Project Repair Tests
- Partial Physical Provider Usage Ledger
- Historical Harness Migration Plan
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
- `createCoCreateServer()` --calls--> `createSession()`  [EXTRACTED]
  server/index.ts → server/auth.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Participant-scoped durable submission safety** — api_canonical_saved_receipts, api_flush_ordering, api_retired_legacy_build, api_durable_submit, api_capture_order [EXTRACTED 1.00]
- **Verified cleanup preserves workflow authority** — docs_harness_codebase_cleanup_verification_scaffold_removal, docs_harness_codebase_cleanup_verification_shared_extraction, docs_harness_architecture_durable_workflow, docs_harness_codebase_cleanup_verification_local_cleanup_checks [EXTRACTED 1.00]
- **October durable reliability contract** — docs_harness_reliability_verification_ordered_recovery, docs_harness_reliability_verification_ordered_submission_recovery, docs_harness_architecture_canonical_save_receipts, docs_harness_architecture_coordinator_fencing [EXTRACTED 1.00]
- **Feature edit authority and import boundaries** — instructions_feature_packet, instructions_shared_boundary, instructions_source_ownership, instructions_jev_advisory [EXTRACTED 1.00]
- **Collaborative submission-to-promoted-artifact flow** — product_core_loop, product_capture_order, product_durable_receipts, product_bounded_recovery [EXTRACTED 1.00]

## Communities (78 total, 5 thin omitted)

### Community 0 - "Workflow Coordinator and Room State"
Cohesion: 0.08
Nodes (48): node:stream, catalogRate(), effortAllowance(), migrateLegacySpecialty(), workflowInstruction(), AIConfig, createCoCreateServer(), managedBuilder() (+40 more)

### Community 1 - "Workspace Editor and BYOK Setup"
Cohesion: 0.05
Nodes (61): ByokSetup is the mounted setup surface, lucide-react, react, @tiptap/extension-collaboration, @tiptap/extension-collaboration-caret, @tiptap/react, @tiptap/starter-kit, AIConnection (+53 more)

### Community 2 - "Durable Local Event Store"
Cohesion: 0.06
Nodes (29): node:sqlite, ActorType, EventInput, EventStore, json(), redact(), RunState, StoredEvent (+21 more)

### Community 3 - "Project Navigation and Hosted Auth"
Cohesion: 0.06
Nodes (37): @supabase/supabase-js, legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), safeLocalDestination(), SupabaseAuthConfig, SupabaseAuthResolution (+29 more)

### Community 4 - "Historical AI Settings and Accounting"
Cohesion: 0.07
Nodes (44): D-0014 â€” Versioned estimates, not inferred billing, Deterministic inference-free routing, Model-routing evaluation protocol 2026-09-22.v3, Repeated trial qualification thresholds, aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup (+36 more)

### Community 5 - "Database Introspection Declarations"
Cohesion: 0.08
Nodes (51): aal_level, artifact_state, artifact_versions, audit_log_entries, code_challenge_method, custom_oauth_providers, execution_events, execution_runs (+43 more)

### Community 6 - "Reliability and Coordinator Contracts"
Cohesion: 0.07
Nodes (35): RoomView.requirementRevisions accepted snapshots, PKCE callback and account-choice flow, Immutable canonical WebSocket saved receipts, Capture-order interpretation and explicit recovery, Authoritative multi-option ConflictGroup, Revision-safe affected-contributor conflict selections, Workflow coordinator fencing RPC contracts, Persisted Developer task evidence (+27 more)

### Community 7 - "Accepted Product and Engineering Decisions"
Cohesion: 0.05
Nodes (43): D-0001 â€” Preserve the existing application while migrating additively, D-0002 â€” Personal interpretations are proposals, not builder authority, D-0003 â€” Build from the accepted registry, not the raw canvas, D-0004 â€” Deletion is not withdrawal, D-0005 â€” Pause on consequential accepted contradictions, D-0006 â€” Conflict groups and explicit affected-contributor agreement, D-0007 â€” Classify per intent and reprocess only by explicit participant action, D-0008 â€” Submit intent explicitly; collaborate continuously (+35 more)

### Community 8 - "Static Audit and Jev Review"
Cohesion: 0.08
Nodes (34): Budgeted advisory Jev evidence packets, Report-only source reachability and import audit, node:fs/promises, node:url, typescript, ImportReference, inputCost(), inspectSources() (+26 more)

### Community 9 - "Hosted Project Tables and Migration"
Cohesion: 0.12
Nodes (37): auth.users, public.protect_project_identity, dotenv/config, apply, args, backup, client, dataArg (+29 more)

### Community 10 - "Attributed Requirement Reconciliation"
Cohesion: 0.10
Nodes (36): acceptanceFor(), acceptedClassification(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries(), categories, classifications (+28 more)

### Community 11 - "Provider Dispatch and Validation"
Cohesion: 0.08
Nodes (31): node:async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+23 more)

### Community 12 - "Hosted Membership and Persistence"
Cohesion: 0.14
Nodes (13): @supabase/server/core, AuthenticatedUser, fail(), normalizeProjectTitle(), PlatformConfig, ProjectInviteSummary, ProjectMemberSummary, ProjectRow (+5 more)

### Community 13 - "Static Linter Configuration"
Cohesion: 0.11
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 14 - "Application Package and Toolchain"
Cohesion: 0.08
Nodes (32): engines, node, name, packageManager, private, scripts, audit:code, build (+24 more)

### Community 15 - "Cleanup Evidence and Feature Scope"
Cohesion: 0.09
Nodes (28): Browser shared server module boundary, October 4 cleanup completion, October4 structural semantic graph refresh, October 3 Graphify maintenance evidence, October 3 cleanup plan history, October 1 reliability verification history, October 1 Studio Ivory local checks history, AdvancedAISetup call-site correction (+20 more)

### Community 16 - "Collaboration Provider and Save Receipts"
Cohesion: 0.15
Nodes (10): y-protocols/awareness, deletionSignature(), CoCreateProvider, ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), binary() (+2 more)

### Community 17 - "Shared Types and Physical Usage"
Cohesion: 0.10
Nodes (26): AISettings, BudgetWindow, RunWindow, SubmissionStatus, AgentStatus, AIModel, AIRateTier, AIRoutingEvidenceStatus (+18 more)

### Community 18 - "Validated Operations and Build Recovery"
Cohesion: 0.12
Nodes (23): esbuild, node:module, node:path/posix, addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, generateProjectPlan() (+15 more)

### Community 19 - "Interpretation and Project Generation"
Cohesion: 0.13
Nodes (21): clean(), demoExtract(), AgentChange, boundedInput(), callOpenAI(), classification, compactRequirement(), compactSharedRequirement() (+13 more)

### Community 20 - "HTTP Server and Local Authentication"
Cohesion: 0.17
Nodes (13): node:stream, node:crypto, ws, b64(), createSession(), participantId(), roomToken(), Session (+5 more)

### Community 21 - "Workflow Architecture and Reliability Evidence"
Cohesion: 0.12
Nodes (21): October 1 local reliability evidence, Bounded complete-file recovery, Participant-scoped IndexedDB recovery, Immutable insertion and deletion save receipts, Single coordinator and lease fencing, One durable workflow and caller-only submission, Active temporary OpenRouter BYOK, Remaining hosted owner routing and archive limits (+13 more)

### Community 22 - "Current Context and Studio Styles"
Cohesion: 0.13
Nodes (17): Current browser/server coordinator facades, Current temporary OpenRouter BYOK, Durable caller-owned submission capture, Prepared coordinator migration and external verification gaps, Bounded one-file recovery checkpoints, Current Canvas Shared context rail, Source boundary audit and advisory Jev review, Studio Ivory active theme (+9 more)

### Community 23 - "Historical Cleanup Planning Memory"
Cohesion: 0.13
Nodes (19): Ambient declarations require reachability exceptions, Dated proposed codebase cleanup plan, Unmeasured optional-context reduction target, Planned deterministic reachability and boundary triage, Graph and grammar limitations in planning snapshot, Planned feature change evidence packet, Proposed model/hash/policy Jev answer cache, Proposed 20-prompt Jev evaluation (+11 more)

### Community 24 - "Current Coding and Authority Rules"
Cohesion: 0.10
Nodes (20): React/Vite and Express facade entrypoints, Explicit affected-contributor agreement, Runtime external/model validation, Active memory-only OpenRouter BYOK, Durable batches and cloud save receipts, Stale-worker and promotion fencing, Same-change canonical documentation maintenance, Durable state and serialized coordinator authority (+12 more)

### Community 25 - "Test Runtime Dependencies"
Cohesion: 0.19
Nodes (9): node:assert/strict, node:fs, node:os, node:path, node:test, root, temporaryData(), legacyInterpretation() (+1 more)

### Community 26 - "Application Runtime Dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, express, lucide-react, react (+12 more)

### Community 27 - "Local Setup and Deployment Configuration"
Cohesion: 0.12
Nodes (13): Explicit pnpm native build allowlist, Current source facade and shared contracts, Shared bounded recovery and retained artifact, Current owner-controlled BYOK setup dialog, Cloudflare Worker/container deployment boundary, Controlled three-profile reliability check, Hosted Supabase identity and email-bound sharing, Pinned local development environment (+5 more)

### Community 28 - "TypeScript Project Configuration"
Cohesion: 0.20
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 29 - "Live Protocol Collaboration Check"
Cohesion: 0.30
Nodes (13): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+5 more)

### Community 30 - "Temporary OpenRouter Credential Lease"
Cohesion: 0.30
Nodes (6): BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases

### Community 31 - "Development and Introspection Dependencies"
Cohesion: 0.14
Nodes (14): devDependencies, pg, prisma, @prisma/adapter-pg, @prisma/client, tsx, @types/express, @types/node (+6 more)

### Community 32 - "Current Workflow Product Contract"
Cohesion: 0.14
Nodes (13): Serialized eight-task and 24-call recovery, Disconnected-first OpenRouter BYOK setup, Attributed capture-order interpretation, Collaborative submission-to-artifact loop, Developer-only activatable workflow, Immutable cloud save and replay receipts, Verified email-bound invitations, Small React/TypeScript frontend scope (+5 more)

### Community 33 - "Browser Smoke and Workspace Tooling"
Cohesion: 0.22
Nodes (8): node:child_process, browser, profile, browser, profile, browser, profile, roomId

### Community 34 - "Submission and Durable Recovery Tests"
Cohesion: 0.26
Nodes (11): yjs, applySteeringUpdate(), plainText(), connectFixture(), edit(), fixture(), interpreted(), plan() (+3 more)

### Community 35 - "Controlled Collaborative Browser Verification"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, fakeAddress, open(), output, room (+2 more)

### Community 36 - "Historical Managed Funding Contracts"
Cohesion: 0.22
Nodes (11): public.initialize_managed_funding, public.managed_credit_accounts, public.managed_provider_requests, public.project_managed_funding, public.project_managed_spenders, project_managed_funding_init, public.create_project(), public.initialize_managed_funding() (+3 more)

### Community 37 - "Project Membership and Invitation Routes"
Cohesion: 0.27
Nodes (10): express, appOrigin(), bearer(), displayName(), message(), recipientKey(), registerProjectRoutes(), requestKey() (+2 more)

### Community 38 - "HTTP Collaboration and Browser Tests"
Cohesion: 0.23
Nodes (7): node:http, response(), send(), waitFor(), browser, profile, provider

### Community 39 - "Agent Entrypoint and Feature Packets"
Cohesion: 0.18
Nodes (10): Durable workflow is the primary shared object, Bounded feature change packet, Graphify scoped source navigation, AST-only graph refresh, Graphify wiki broad navigation, Targets versus verified implementation, Offline Jev rankings are advisory, One logical coordinator (+2 more)

### Community 40 - "Invitation Mutation and Credential Encryption"
Cohesion: 0.36
Nodes (6): decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), hashToken(), normalizeInviteEmail()

### Community 41 - "Validated CRDT Persistence Encoding"
Cohesion: 0.36
Nodes (4): decodePersistedYjsUpdate(), encodePostgresBytea(), legacyBufferShape(), persistedRawBytes()

### Community 42 - "Responsiveness Measurement Evidence"
Cohesion: 0.24
Nodes (8): September 26 localhost responsiveness benchmark, Lazy route split transferred-byte evidence, Unmeasured production and provider timing, node:perf_hooks, median(), run(), Sample, wait()

### Community 43 - "Invitation Email Delivery Adapter"
Cohesion: 0.40
Nodes (7): html(), InvitationDelivery, InvitationEmail, InvitationEmailSender, invitationEmailSenderFromEnv(), plain(), validSender()

### Community 44 - "Email Invitations and Sharing Migration"
Cohesion: 0.44
Nodes (8): project_invites_creator_rate_idx, project_invites_one_active_email_idx, project_invites_project_created_idx, public.accept_project_invite(), public.create_project_invite(), public.resend_project_invite(), public.project_invites, public.project_members

### Community 45 - "Cloudflare Container Lifecycle"
Cohesion: 0.31
Nodes (4): @cloudflare/containers, cloudflare:workers, baseEnv, CoCreateContainer

### Community 46 - "Provider Contract Tests"
Cohesion: 0.33
Nodes (7): listProviderModels(), adapterFor(), discoverModels(), generateText(), ProviderConfig, json(), schema

### Community 47 - "Idempotent Invitation Delivery Migration"
Cohesion: 0.44
Nodes (7): project_invites_request_key_idx, public.accept_project_invite(), public.create_project_invite_v2(), public.resend_project_invite(), public.resend_project_invite_v2(), public.project_invites, public.project_members

### Community 48 - "Live Browser Collaboration Check"
Cohesion: 0.50
Nodes (6): browser(), clients, json(), origin, type(), waitFor()

### Community 49 - "Conflict Resolution Browser Check"
Cohesion: 0.46
Nodes (6): browser, dataDir, group, profile, room, token

### Community 50 - "Revision Promotion and Preview Tests"
Cohesion: 0.43
Nodes (3): keepLastSuccess(), shouldPromoteRevision(), previewDocument()

### Community 51 - "GitHub Source Verification Gates"
Cohesion: 0.43
Nodes (6): Frozen pnpm lockfile installation, Commit-pinned GitHub Actions, Code checks on push and pull request, CI pnpm 10.18.3 and Node 24, Import-boundary, test and build gates, Offline GitHub code validation

### Community 52 - "Source Formatter Configuration"
Cohesion: 0.52
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 53 - "Authentication Screenshot Capture"
Cohesion: 0.60
Nodes (4): browser, output, profile, wait()

### Community 54 - "Historical UI Screenshot Capture"
Cohesion: 0.60
Nodes (4): browser, outputDir, profile, wait()

### Community 55 - "Workspace Screenshot Capture"
Cohesion: 0.60
Nodes (4): browser, outputDir, profile, wait()

### Community 56 - "Project ZIP Artifact Export"
Cohesion: 0.60
Nodes (4): ProjectFile, crc32(), createZip(), table

### Community 57 - "End-to-End Local Integration Tests"
Cohesion: 0.60
Nodes (4): json(), output(), recipeSource(), waitFor()

### Community 58 - "Historical Conflict Resolution Plan"
Cohesion: 0.40
Nodes (4): Conflict-group acceptance matrix, Additive ConflictGroup migration plan, Decisions needed and Disagreements UI target, Planned conflict alternatives and reopen mutations

### Community 59 - "Interface Fonts and Icons"
Cohesion: 0.40
Nodes (4): DM Serif Display font, Inter font, Lucide React icons, Generated preview style isolation

### Community 60 - "Application Favicon Geometry"
Cohesion: 0.70
Nodes (4): Large upper-left and lower-right tiles; small opposite tiles, 24-pixel SVG favicon, Four blue tiles arranged in a square, Rounded tile corners with three blue fills

### Community 61 - "Generated Project Repair Tests"
Cohesion: 0.60
Nodes (3): projectSchema, plan(), response()

### Community 62 - "Partial Physical Provider Usage Ledger"
Cohesion: 0.50
Nodes (4): aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes

### Community 63 - "Historical Harness Migration Plan"
Cohesion: 0.50
Nodes (3): Additive local event-store rollout, Later harness migration prerequisites, Preserve SQLite and backups during rollback

## Knowledge Gaps
- **135 isolated node(s):** `name`, `version`, `private`, `type`, `@supabase/server` (+130 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 348 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `yjs` connect `Submission and Durable Recovery Tests` to `Workflow Coordinator and Room State`, `Workspace Editor and BYOK Setup`, `HTTP Collaboration and Browser Tests`, `Validated CRDT Persistence Encoding`, `Responsiveness Measurement Evidence`, `Hosted Membership and Persistence`, `Application Package and Toolchain`, `Collaboration Provider and Save Receipts`, `Shared Types and Physical Usage`, `Revision Promotion and Preview Tests`, `HTTP Server and Local Authentication`, `Test Runtime Dependencies`, `Live Protocol Collaboration Check`, `End-to-End Local Integration Tests`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `EventStore` connect `Durable Local Event Store` to `Workflow Coordinator and Room State`, `Test Runtime Dependencies`, `Submission and Durable Recovery Tests`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `public.reserve_managed_request()` connect `Historical Managed Funding Contracts` to `Hosted Membership and Persistence`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 32 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 32 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _135 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Workflow Coordinator and Room State` be split into smaller, more focused modules?**
  _Cohesion score 0.07500655651717808 - nodes in this community are weakly interconnected._
- **Should `Workspace Editor and BYOK Setup` be split into smaller, more focused modules?**
  _Cohesion score 0.05088919288645691 - nodes in this community are weakly interconnected._