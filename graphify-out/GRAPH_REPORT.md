# Graph Report - Devoffice  (2026-10-03)

## Corpus Check
- 222 files · ~321,332 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 59 file(s) not represented in the graph (top: .log 48, (none) 4, .css 4)

## Summary
- 2006 nodes · 3902 edges · 132 communities (104 shown, 28 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 122 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3fd6f356`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- SupabasePlatform
- requirements.ts
- providers.ts
- menubar.tsx
- ref_node_fs
- 2guys1canvas harness implementation checklist
- rules
- EventStore
- sidebar.tsx
- package.json
- generator.ts
- ref_lib_utils
- rooms.ts
- ai-presets.ts
- dependencies
- App.tsx
- pagination.tsx
- react
- components.json
- ProjectApp.tsx
- artifacts.ts
- tool-registry.ts
- index.ts
- ai-accounting.ts
- combobox.tsx
- Harness decision log
- compilerOptions
- context-menu.tsx
- event-store.ts
- types.ts
- drawer.tsx
- ai-presets.test.ts
- ref_class_variance_authority
- carousel.tsx
- supabase-platform.ts
- provider-reconnect.test.ts
- local-drafts.test.ts
- alert-dialog.tsx
- chart.tsx
- toast.tsx
- live-collaboration-check.mjs
- Harness architecture
- yjs
- artifact-restoration.test.ts
- field.tsx
- item.tsx
- Workspace
- attachment.tsx
- dialog.tsx
- migrate-legacy-to-supabase.ts
- button-group.tsx
- managed-catalog.ts
- navigation-menu.tsx
- select.tsx
- 2guys1canvas context handoff
- devDependencies
- providers.test.ts
- layout.tsx
- cocreate.test.ts
- project.ts
- 2guys1canvas product brief
- avatar.tsx
- context.md
- empty.tsx
- Collaborative contradiction-resolution plan
- supabase.ts
- 2guys1canvas API reference
- safeLocalDestination
- RoomView
- verify-reliability.ts
- CoCreateProvider
- tabs.tsx
- scripts
- dropdown-menu.tsx
- src_comic
- live-browser-collaboration-check.mjs
- Supabase identity and persistence boundary (2026-09-24)
- auth-config.ts
- registerProjectRoutes
- breadcrumb.tsx
- reliability.test.ts
- .oxfmtrc.json
- collapsible.tsx
- container.js
- page.tsx
- utils.ts
- oauth-callback.ts
- request
- fixtures/multiuser-baseline.ts
- build-recovery.ts
- direction.tsx
- .mcp.json
- 2guys1canvas AI coding instructions
- main.tsx
- harness/checklist.md
- Responsiveness evidence
- popover.tsx
- ByokSetup.tsx
- 2guys1canvas
- 2guys1canvas product brief
- verify-coordinator-postgres.ts
- Multi-user Step 03 handoff - 2026-10-03
- input-group.tsx
- Multi-user harness improvement prompts
- OpenRouterLeases
- .insert
- Harness status and outstanding work
- 2guys1canvas contributor instructions
- usage-ledger.ts
- 2guys1canvas implemented API contracts
- bubble.tsx
- requirements.test.ts
- CoCreate harness assessment
- lucide-react
- Reliability verification — 2026-10-01
- 2guys1canvas
- fetch
- migration-plan.md
- Multi-user Step 01 evidence and handoff
- tooltip.tsx
- .buildNow
- Harness documentation cleanup — 2026-10-02
- 2guys1canvas current handoff
- prisma7.config.ts
- UI assets and licenses

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 97 edges
2. `createCoCreateServer()` - 58 edges
3. `EventStore` - 53 edges
4. `SupabasePlatform` - 49 edges
5. `Harness decision log` - 47 edges
6. `react` - 43 edges
7. `2guys1canvas harness implementation checklist` - 40 edges
8. `registerProjectRoutes()` - 34 edges
9. `lucide-react` - 25 edges
10. `ArtifactUnavailableError` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Reference-led presentation update (2026-09-30)` --references--> `Workspace()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → src/App.tsx
- `Bounded context and cost target` --references--> `AIRunRecord`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → src/types.ts
- `Server contracts` --references--> `RoomView`  [INFERRED]
  docs/harness/contradiction-resolution-plan.md → src/types.ts
- `Coordinator and immutable saves` --references--> `RemoteCoordinator`  [INFERRED]
  docs/harness/architecture.md → server/coordinator.ts
- `Outcome and boundaries` --references--> `RemoteCoordinator`  [INFERRED]
  docs/harness/multiuser-step02-handoff.md → server/coordinator.ts

## Import Cycles
- None detected.

## Communities (132 total, 28 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.08
Nodes (22): Later-step source audit, ref_node_stream, catalogRate(), effortAllowance(), AIConfig, createCoCreateServer(), acceptedRequirementFingerprint(), hasOpenContradictions() (+14 more)

### Community 1 - "SupabasePlatform"
Cohesion: 0.13
Nodes (5): fail(), normalizeProjectTitle(), SupabasePlatform, encodePostgresBytea(), ProviderRequestRecord

### Community 2 - "requirements.ts"
Cohesion: 0.12
Nodes (32): acceptanceFor(), acceptedClassification(), alternativeSignature(), candidateEntries(), categories, classifications, classifyIntentText(), clean() (+24 more)

### Community 3 - "providers.ts"
Cohesion: 0.09
Nodes (27): ref_node_async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+19 more)

### Community 5 - "ref_node_fs"
Cohesion: 0.06
Nodes (31): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, browser, output, profile, browser (+23 more)

### Community 6 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (39): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27, Draggable effort toggle and visible project naming (2026-09-25) (+31 more)

### Community 7 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 9 - "sidebar.tsx"
Cohesion: 0.07
Nodes (12): Sidebar(), SidebarContext, SidebarContextProps, SidebarMenuButton(), sidebarMenuButtonVariants, SidebarRail(), SidebarTrigger(), useSidebar() (+4 more)

### Community 10 - "package.json"
Cohesion: 0.07
Nodes (29): engines, node, name, private, type, version, cross-env, prisma (+21 more)

### Community 11 - "generator.ts"
Cohesion: 0.11
Nodes (23): clean(), demoExtract(), demoOrchestrate(), shell(), AgentChange, bundleSource(), classification, compactRequirement() (+15 more)

### Community 12 - "ref_lib_utils"
Cohesion: 0.05
Nodes (9): ref_base_ui_react_preview_card, ref_base_ui_react_progress, ref_base_ui_react_radio, ref_base_ui_react_radio_group, ref_base_ui_react_separator, ref_base_ui_react_slider, ref_base_ui_react_switch, ref_lib_utils (+1 more)

### Community 13 - "rooms.ts"
Cohesion: 0.08
Nodes (22): ProviderAccountingError, AISettings, authenticatedDelta(), BudgetReservation, BudgetWindow, ClientSocket, colors, defaultDataDir (+14 more)

### Community 14 - "ai-presets.ts"
Cohesion: 0.10
Nodes (25): Named AI connections (preferred API), CatalogEntry, classifyTaskComplexity(), cost(), effortLevels, estimateLayerMaximum(), layer(), longContext (+17 more)

### Community 15 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, express, lucide-react, pg (+16 more)

### Community 16 - "App.tsx"
Cohesion: 0.09
Nodes (30): AgentPanel(), changeEffort(), reinterpret(), send(), AISetup(), api(), BuildAccounting(), comparableMetrics() (+22 more)

### Community 17 - "pagination.tsx"
Cohesion: 0.09
Nodes (4): PaginationLinkProps, ref_components_ui_button, ref_react_day_picker, ref_shadcn_react_message_scroller

### Community 18 - "react"
Cohesion: 0.08
Nodes (5): Alert(), alertVariants, ref_base_ui_react_input, ref_base_ui_react_scroll_area, react

### Community 19 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "ProjectApp.tsx"
Cohesion: 0.09
Nodes (9): InviteResult, PendingInvite, Project, ProjectList, ProjectMember, ProjectRole, ShareState, Workspace (+1 more)

### Community 21 - "artifacts.ts"
Cohesion: 0.17
Nodes (22): ArchivedVersion, ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, ArtifactUnavailableError, ArtifactVersion, bodyFromBytes() (+14 more)

### Community 22 - "tool-registry.ts"
Cohesion: 0.13
Nodes (14): ActorType, FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior (+6 more)

### Community 23 - "index.ts"
Cohesion: 0.11
Nodes (19): express, ref_node_assert_strict, ref_node_http, ref_node_test, ref_node_url, ws, b64(), createSession() (+11 more)

### Community 24 - "ai-accounting.ts"
Cohesion: 0.26
Nodes (12): aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, AIRate, AIRunCall (+4 more)

### Community 25 - "combobox.tsx"
Cohesion: 0.06
Nodes (4): ref_base_ui_react, ref_cmdk, ref_components_ui_dialog, ref_components_ui_input_group

### Community 26 - "Harness decision log"
Cohesion: 0.04
Nodes (47): D-0001 — Preserve the existing application while migrating additively, D-0002 — Personal interpretations are proposals, not builder authority, D-0003 — Build from the accepted registry, not the raw canvas, D-0004 — Deletion is not withdrawal, D-0005 — Pause on consequential accepted contradictions, D-0006 — Conflict groups and explicit affected-contributor agreement, D-0007 — Classify per intent and reprocess only by explicit participant action, D-0008 — Submit intent explicitly; collaborate continuously (+39 more)

### Community 27 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 29 - "event-store.ts"
Cohesion: 0.15
Nodes (12): ref_node_sqlite, EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow (+4 more)

### Community 30 - "types.ts"
Cohesion: 0.09
Nodes (23): Shared response models, Migration, AgentStatus, AIRateTier, AIResolvedLayer, AIRoutingEvidenceStatus, CapabilityCheck, ChangeKind (+15 more)

### Community 31 - "drawer.tsx"
Cohesion: 0.13
Nodes (5): DrawerContent(), DrawerContext, DrawerContextProps, useDrawer(), ref_base_ui_react_drawer

### Community 32 - "ai-presets.test.ts"
Cohesion: 0.33
Nodes (7): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), passed

### Community 33 - "ref_class_variance_authority"
Cohesion: 0.16
Nodes (10): Button(), buttonVariants, ToggleGroupContext, Toggle(), toggleVariants, ref_base_ui_react_button, ref_base_ui_react_toggle, ref_base_ui_react_toggle_group (+2 more)

### Community 34 - "carousel.tsx"
Cohesion: 0.17
Nodes (13): CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions, CarouselPlugin (+5 more)

### Community 35 - "supabase-platform.ts"
Cohesion: 0.13
Nodes (19): ref_supabase_server_core, RecoveryCheckpoint, decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), AuthenticatedUser, hashToken() (+11 more)

### Community 36 - "provider-reconnect.test.ts"
Cohesion: 0.18
Nodes (6): ref_y_protocols_awareness, deletionSignature(), ConnectionStatus, ProviderDependencies, providerInternals, FakeWebSocket

### Community 37 - "local-drafts.test.ts"
Cohesion: 0.20
Nodes (7): browserDraftStore, draftKey(), DraftStore, LocalDraftStatus, persistDraft(), restoreDraft(), merge()

### Community 39 - "chart.tsx"
Cohesion: 0.19
Nodes (11): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION, THEMES (+3 more)

### Community 41 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 42 - "Harness architecture"
Cohesion: 0.11
Nodes (18): Active hosted BYOK boundary (2026-09-28), Bounded context and cost target, Browser recovery and transport batching — 2026-09-28, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary, Execution flow, Harness architecture (+10 more)

### Community 43 - "yjs"
Cohesion: 0.20
Nodes (7): ref_node_fs_promises, ref_node_perf_hooks, yjs, median(), run(), Sample, wait()

### Community 44 - "artifact-restoration.test.ts"
Cohesion: 0.17
Nodes (11): ref_node_crypto, dir, manager, observations, platform, project, buildFixture(), files (+3 more)

### Community 45 - "field.tsx"
Cohesion: 0.17
Nodes (3): Field(), fieldVariants, ref_components_ui_label

### Community 46 - "item.tsx"
Cohesion: 0.18
Nodes (4): Item(), ItemMedia(), itemMediaVariants, itemVariants

### Community 47 - "Workspace"
Cohesion: 0.27
Nodes (10): tokenParticipant(), Workspace(), ariaShortcut(), BUILD_SHORTCUT_STORAGE_KEY, BuildShortcutPreference, defaultBuildShortcut(), isBuildShortcut(), readBuildShortcut() (+2 more)

### Community 48 - "attachment.tsx"
Cohesion: 0.20
Nodes (4): Attachment(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 50 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.17
Nodes (10): ref_dotenv_config, apply, args, backup, client, dataArg, dataDir, mapping (+2 more)

### Community 51 - "button-group.tsx"
Cohesion: 0.40
Nodes (3): ButtonGroup(), buttonGroupVariants, ref_components_ui_separator

### Community 52 - "managed-catalog.ts"
Cohesion: 0.16
Nodes (13): [command,file], MANAGED_CATALOG_SOURCE, MANAGED_CATALOG_VERSION, MANAGED_DEFAULT_BUILDER, MANAGED_INTERPRETER_CANDIDATES, managedBuilder(), managedCatalog, ManagedCatalogEntry (+5 more)

### Community 53 - "navigation-menu.tsx"
Cohesion: 0.20
Nodes (3): NavigationMenuTrigger(), navigationMenuTriggerStyle, ref_base_ui_react_navigation_menu

### Community 55 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 56 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, prisma, tsx, @types/express, @types/node, @types/pg, @types/react, @types/react-dom (+3 more)

### Community 57 - "providers.test.ts"
Cohesion: 0.17
Nodes (14): boundedInput(), callOpenAI(), listProviderModels(), providerConfig(), testOpenAIConnection(), adapterFor(), discoverModels(), generateStructured() (+6 more)

### Community 58 - "layout.tsx"
Cohesion: 0.20
Nodes (7): app_globals, geistMono, geistSans, metadata, nextConfig, ref_next, ref_next_font_google

### Community 59 - "cocreate.test.ts"
Cohesion: 0.19
Nodes (9): html(), InvitationDelivery, InvitationEmail, invitationEmailSenderFromEnv(), validSender(), keepLastSuccess(), shouldPromoteRevision(), previewDocument() (+1 more)

### Community 60 - "project.ts"
Cohesion: 0.14
Nodes (16): esbuild, ref_node_module, ref_node_path_posix, allowedExtensions, downloadableFiles(), generatedRoot, infrastructureFiles, loadProject() (+8 more)

### Community 61 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 63 - "context.md"
Cohesion: 0.42
Nodes (3): CoCreate steering entrypoint, graphify, Historical documentation archive

### Community 65 - "Collaborative contradiction-resolution plan"
Cohesion: 0.50
Nodes (4): Acceptance tests, Collaborative contradiction-resolution plan, Server contracts, UI

### Community 66 - "supabase.ts"
Cohesion: 0.25
Nodes (7): @supabase/supabase-js, authReturnKey, resolved, supabase, supabaseAppOrigin, supabaseConfigurationError, supabaseOAuthRedirectUrl

### Community 67 - "2guys1canvas API reference"
Cohesion: 0.15
Nodes (13): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30), Legacy AI routes (local compatibility only; hosted routes return 410) (+5 more)

### Community 68 - "safeLocalDestination"
Cohesion: 0.36
Nodes (8): safeLocalDestination(), authMessage(), ForgotPassword(), intendedDestination(), Login(), ProjectApp(), Signup(), supabaseAuthCallbackUrl()

### Community 69 - "RoomView"
Cohesion: 0.33
Nodes (6): Shared response models, Rooms and sessions, 2guys1canvas presentation and invitation boundary (2026-09-30), Responsive delivery and synchronization, RoomView, WorkflowBoard()

### Community 70 - "verify-reliability.ts"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, open(), output, providerAddress, room (+2 more)

### Community 71 - "CoCreateProvider"
Cohesion: 0.26
Nodes (3): SimpleHostedAISetup(), CoCreateProvider, retryDelay()

### Community 72 - "tabs.tsx"
Cohesion: 0.33
Nodes (3): TabsList(), tabsListVariants, ref_base_ui_react_tabs

### Community 73 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, deploy:cloudflare, dev, migrate:legacy, start, test

### Community 76 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 77 - "Supabase identity and persistence boundary (2026-09-24)"
Cohesion: 0.67
Nodes (3): Authentication, project naming, and sharing extension (2026-09-25), Invitation, physical usage, and conflict repair (2026-09-30), Supabase identity and persistence boundary (2026-09-24)

### Community 78 - "auth-config.ts"
Cohesion: 0.38
Nodes (6): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution

### Community 79 - "registerProjectRoutes"
Cohesion: 0.27
Nodes (10): artifactResponse(), InvitationEmailSender, appOrigin(), bearer(), displayName(), message(), recipientKey(), registerProjectRoutes() (+2 more)

### Community 80 - "breadcrumb.tsx"
Cohesion: 0.14
Nodes (6): Badge(), badgeVariants, Marker(), markerVariants, ref_base_ui_react_merge_props, ref_base_ui_react_use_render

### Community 81 - "reliability.test.ts"
Cohesion: 0.08
Nodes (19): Candidate generation, recovery and promotion, Coordinator and immutable saves, Current harness architecture, Durable authority and storage, Edits, submission and acceptance, Policy and deferred boundaries, Runtime map, Workflow inspection and accounting (+11 more)

### Community 82 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 85 - "container.js"
Cohesion: 0.25
Nodes (4): @cloudflare/containers, ref_cloudflare_workers, baseEnv, CoCreateContainer

### Community 88 - "oauth-callback.ts"
Cohesion: 0.50
Nodes (3): completeOAuthCallback(), OAuthCallbackOutcome, Callback()

### Community 89 - "request"
Cohesion: 0.33
Nodes (5): needsSessionRefresh(), Projects(), request(), selectedId(), ShareProjectDialog()

### Community 90 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.16
Nodes (14): output, report, trials, Room, Attempt, interpretation(), Observation, pause() (+6 more)

### Community 92 - "build-recovery.ts"
Cohesion: 0.24
Nodes (12): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, generateProjectPlan(), mergeUsage(), applyOperations(), budgetProjectFiles() (+4 more)

### Community 95 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 99 - "main.tsx"
Cohesion: 0.29
Nodes (6): ref_react_dom_client, App, ProjectApp, src_studio_ivory, src_styles, clientAuthMode

### Community 103 - "ByokSetup.tsx"
Cohesion: 0.33
Nodes (6): AdvancedAISetup(), ByokSetup(), run(), Lease, request(), AIConnection

### Community 104 - "2guys1canvas"
Cohesion: 0.13
Nodes (15): 2guys1canvas, Active hosted MVP: OpenRouter BYOK, AI steering documents, Architecture, Checks, Connect AI, Current boundaries, Current product setup (2026-09-30) (+7 more)

### Community 105 - "2guys1canvas product brief"
Cohesion: 0.25
Nodes (8): 2guys1canvas product brief, Accepted future work, Accounts, saved projects and sharing, Build recovery and evidence, Collaborative steering and authority, Hosted AI and limits, Mission, users and scope, Shared context, recorded usage and requested appearance

### Community 106 - "verify-coordinator-postgres.ts"
Cohesion: 0.13
Nodes (11): pg, a, admin, b, checks, ownerA, ownerB, project (+3 more)

### Community 107 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 108 - "input-group.tsx"
Cohesion: 0.22
Nodes (6): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, ref_components_ui_input, ref_components_ui_textarea

### Community 109 - "Multi-user harness improvement prompts"
Cohesion: 0.15
Nodes (13): Common contract, Multi-user harness improvement prompts, Starting instruction, Step 01 - Audit, scenarios and baseline, Step 02 - Coordinator fencing and owner routing, Step 03 - Artifact persistence and restoration, Step 04 - Generated execution isolation, Step 05 - Intent inspection, correction and contextual references (+5 more)

### Community 110 - "OpenRouterLeases"
Cohesion: 0.22
Nodes (6): BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases

### Community 111 - ".insert"
Cohesion: 0.22
Nodes (3): WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 112 - "Harness status and outstanding work"
Cohesion: 0.15
Nodes (13): Accepted deferred implementation, Context, accounting and recovery, Current implementation and dated evidence, Documentation cleanup verification, Durable workflow control and permissions, Evidence conventions, Execution, tools and evidence, Harness status and outstanding work (+5 more)

### Community 113 - "2guys1canvas contributor instructions"
Cohesion: 0.29
Nodes (7): 2guys1canvas contributor instructions, Permissions, persistence and sharing, Recovery, accounting and secrets, Stack and coding, Start and maintain authority, Validation and documentation maintenance, Workflow and source ownership

### Community 114 - "usage-ledger.ts"
Cohesion: 0.40
Nodes (5): aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes, AIUsage

### Community 115 - "2guys1canvas implemented API contracts"
Cohesion: 0.29
Nodes (7): 2guys1canvas implemented API contracts, Active temporary OpenRouter routes, Authenticated project routes, Local compatibility only, Preview and download, Transport and authorization, WebSocket collaboration and save receipts

### Community 116 - "bubble.tsx"
Cohesion: 0.38
Nodes (4): Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 117 - "requirements.test.ts"
Cohesion: 0.33
Nodes (5): acceptedRequirements(), blockedRequirementIds(), eligibleRequirements(), submitConflictSelection(), InterpretationClassification

### Community 118 - "CoCreate harness assessment"
Cohesion: 0.33
Nodes (5): CoCreate harness assessment, Existing capabilities preserved, First vertical slice selected, Material gaps found, Second verified slice — shared intent

### Community 119 - "lucide-react"
Cohesion: 0.09
Nodes (5): NativeSelectProps, ref_base_ui_react_accordion, ref_base_ui_react_checkbox, ref_input_otp, lucide-react

### Community 120 - "Reliability verification — 2026-10-01"
Cohesion: 0.33
Nodes (6): Executed checks, Implemented behavior, Reference availability update — 2026-10-02 (documentation only), Reliability verification — 2026-10-01, Remaining verification and operational limits — original 2026-10-01 run, Scope and verified causes

### Community 121 - "2guys1canvas"
Cohesion: 0.33
Nodes (6): 2guys1canvas, Checks and boundaries, Contributor entrypoints, Hosted configuration and release prerequisites, Hosted setup and use, Start locally

### Community 122 - "fetch"
Cohesion: 0.67
Nodes (3): Collaboration connection lifecycle, Cloudflare availability and collaboration repair evidence (2026-09-18), fetch()

### Community 123 - "migration-plan.md"
Cohesion: 0.40
Nodes (4): Harness migration plan, Later migrations, Rollback, Safe rollout

### Community 124 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.40
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 127 - ".buildNow"
Cohesion: 0.50
Nodes (3): Room reads, submissions and decisions, Building and preview, Submission scheduling: current implementation and required hardening

### Community 128 - "Harness documentation cleanup — 2026-10-02"
Cohesion: 0.50
Nodes (4): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02

### Community 129 - "2guys1canvas current handoff"
Cohesion: 0.67
Nodes (3): 2guys1canvas current handoff, Next work, Read next

## Knowledge Gaps
- **629 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+624 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1106 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `menubar.tsx`, `sidebar.tsx`, `package.json`, `App.tsx`, `pagination.tsx`, `ProjectApp.tsx`, `combobox.tsx`, `context-menu.tsx`, `drawer.tsx`, `ref_class_variance_authority`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `toast.tsx`, `field.tsx`, `item.tsx`, `attachment.tsx`, `dialog.tsx`, `select.tsx`, `avatar.tsx`, `dropdown-menu.tsx`, `breadcrumb.tsx`, `card.tsx`, `table.tsx`, `main.tsx`, `popover.tsx`, `ByokSetup.tsx`, `input-group.tsx`, `bubble.tsx`, `lucide-react`?**
  _High betweenness centrality (0.270) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `carousel.tsx`, `menubar.tsx`, `ByokSetup.tsx`, `toast.tsx`, `sidebar.tsx`, `dropdown-menu.tsx`, `package.json`, `breadcrumb.tsx`, `pagination.tsx`, `dialog.tsx`, `App.tsx`, `ProjectApp.tsx`, `navigation-menu.tsx`, `select.tsx`, `combobox.tsx`, `context-menu.tsx`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `2guys1canvas implemented API contracts` connect `2guys1canvas implemented API contracts` to `.buildNow`, `RoomView`, `context.md`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Are the 32 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 32 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _629 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.07719298245614035 - nodes in this community are weakly interconnected._
- **Should `SupabasePlatform` be split into smaller, more focused modules?**
  _Cohesion score 0.13063063063063063 - nodes in this community are weakly interconnected._