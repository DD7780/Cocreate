# Graph Report - Devoffice  (2026-10-04)

## Corpus Check
- 290 files · ~401,592 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 206 file(s) not represented in the graph (top: .log 193, .css 6, (none) 4)

## Summary
- 2369 nodes · 4825 edges · 143 communities (109 shown, 34 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5784de62`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- ref_node_fs
- requirements.ts
- providers.ts
- menubar.tsx
- ref_node_path
- 2guys1canvas harness implementation checklist
- rules
- EventStore
- sidebar.tsx
- package.json
- generator.ts
- ref_lib_utils
- dropdown-menu.tsx
- ai-presets.ts
- dependencies
- App.tsx
- pagination.tsx
- react
- components.json
- ProjectApp.tsx
- supabase-platform.ts
- multiuser-step05/verify-evidence.cjs
- index.ts
- intent-authority.ts
- combobox.tsx
- Harness decision log
- compilerOptions
- context-menu.tsx
- event-store.ts
- types.ts
- drawer.tsx
- IsolationRunner
- ref_class_variance_authority
- carousel.tsx
- tool-registry.ts
- provider-reconnect.test.ts
- local-drafts.test.ts
- alert-dialog.tsx
- chart.tsx
- toast.tsx
- live-collaboration-check.mjs
- Harness architecture
- multiuser-step07/verify-evidence.cjs
- artifact-restoration.test.ts
- field.tsx
- item.tsx
- build-shortcut.ts
- attachment.tsx
- dialog.tsx
- migrate-legacy-to-supabase.ts
- workflow-budget.test.ts
- managed-catalog.ts
- navigation-menu.tsx
- select.tsx
- 2guys1canvas context handoff
- devDependencies
- build-recovery.ts
- layout.tsx
- rooms.ts
- providers.test.ts
- 2guys1canvas product brief
- command.tsx
- harness/checklist.md
- empty.tsx
- multiuser-step06/verify-evidence.cjs
- supabase.ts
- verify-intent-ui.ts
- safeLocalDestination
- progress.tsx
- verify-reliability.ts
- CoCreateProvider
- ai-accounting.ts
- scripts
- .ensureWorkflow
- src_comic
- live-browser-collaboration-check.mjs
- toggle-group.tsx
- auth-config.ts
- message-scroller.tsx
- breadcrumb.tsx
- reliability.test.ts
- .oxfmtrc.json
- collapsible.tsx
- lucide-react
- container.js
- page.tsx
- utils.ts
- oauth-callback.ts
- request
- fixtures/multiuser-baseline.ts
- Step 05 handoff — attributable intent and contextual references
- direction.tsx
- .mcp.json
- 2guys1canvas AI coding instructions
- popover.tsx
- Responsiveness evidence
- RoomView
- verify-candidate-evidence.ts
- 2guys1canvas
- 2guys1canvas product brief
- Multi-user Step 03 handoff - 2026-10-03
- input-group.tsx
- Multi-user harness improvement prompts
- isolation.ts
- tabs.tsx
- Harness status and outstanding work
- 2guys1canvas contributor instructions
- Multi-user Step 07 handoff - 2026-10-04
- 2guys1canvas implemented API contracts
- verify-build-progress.ts
- browser.ts
- CoCreate harness assessment
- Reliability verification — 2026-10-01
- 2guys1canvas
- project.ts
- ref_node_http
- Multi-user Step 01 evidence and handoff
- Step 06 handoff — stable progress under ongoing steering
- button-group.tsx
- Multi-user Step 04 handoff - 2026-10-04
- documentation-cleanup.md
- measure-responsiveness.ts
- verification.ts
- UI assets and licenses
- Harness migration plan
- tooltip.tsx
- 2guys1canvas current handoff
- generated-isolation.test.ts
- marker.tsx
- Step 08 - Durable workflow budget and accounting
- local-idle-probe.cjs
- resizable.tsx
- fetch

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 111 edges
2. `createCoCreateServer()` - 59 edges
3. `EventStore` - 53 edges
4. `Harness decision log` - 52 edges
5. `SupabasePlatform` - 49 edges
6. `react` - 44 edges
7. `2guys1canvas harness implementation checklist` - 40 edges
8. `registerProjectRoutes()` - 34 edges
9. `IsolationRunner` - 31 edges
10. `reconcileRequirements()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `Outcome and responsible boundary` --references--> `bundleProject()`  [INFERRED]
  docs/harness/multiuser-step04-handoff.md → server/project.ts
- `Reference-led presentation update (2026-09-30)` --references--> `Workspace()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → src/App.tsx
- `Bounded context and cost target` --references--> `AIRunRecord`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → src/types.ts
- `Coordinator and immutable saves` --references--> `RemoteCoordinator`  [INFERRED]
  docs/harness/architecture.md → server/coordinator.ts
- `Outcome and boundaries` --references--> `RemoteCoordinator`  [INFERRED]
  docs/harness/multiuser-step02-handoff.md → server/coordinator.ts

## Import Cycles
- None detected.

## Communities (143 total, 34 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.07
Nodes (28): Room reads, submissions and decisions, Building and preview, Submission scheduling: current implementation and required hardening, Later-step source audit, ref_node_stream, catalogRate(), effortAllowance(), AIConfig (+20 more)

### Community 1 - "ref_node_fs"
Cohesion: 0.11
Nodes (8): fs, ref_node_assert_strict, ref_node_fs, ref_node_test, yjs, root, pause(), waitFor()

### Community 2 - "requirements.ts"
Cohesion: 0.08
Nodes (42): changed, original, shared, buildProgressFor(), applyIntentCommand(), acceptanceFor(), acceptedClassification(), acceptedRequirementFingerprint() (+34 more)

### Community 3 - "providers.ts"
Cohesion: 0.08
Nodes (29): ref_node_async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+21 more)

### Community 5 - "ref_node_path"
Cohesion: 0.08
Nodes (25): ref_node_child_process, ref_node_os, ref_node_path, browser, output, profile, browser, outputDir (+17 more)

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
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, cross-env, dotenv (+25 more)

### Community 11 - "generator.ts"
Cohesion: 0.11
Nodes (22): boundedInput(), bundleSource(), callOpenAI(), classification, compactRequirement(), compactSharedRequirement(), compactText(), DEFAULT_PROJECT_OUTPUT_TOKENS (+14 more)

### Community 12 - "ref_lib_utils"
Cohesion: 0.07
Nodes (7): ref_base_ui_react_preview_card, ref_base_ui_react_radio, ref_base_ui_react_radio_group, ref_base_ui_react_separator, ref_base_ui_react_slider, ref_base_ui_react_switch, ref_lib_utils

### Community 14 - "ai-presets.ts"
Cohesion: 0.08
Nodes (31): Named AI connections (preferred API), EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), CatalogEntry (+23 more)

### Community 15 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+17 more)

### Community 16 - "App.tsx"
Cohesion: 0.07
Nodes (38): AdvancedAISetup(), AgentPanel(), changeEffort(), AISetup(), api(), BuildAccounting(), comparableMetrics(), ConflictChoice() (+30 more)

### Community 18 - "react"
Cohesion: 0.09
Nodes (4): ref_base_ui_react_avatar, ref_base_ui_react_input, ref_base_ui_react_scroll_area, react

### Community 19 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "ProjectApp.tsx"
Cohesion: 0.09
Nodes (9): InviteResult, PendingInvite, Project, ProjectList, ProjectMember, ProjectRole, ShareState, Workspace (+1 more)

### Community 21 - "supabase-platform.ts"
Cohesion: 0.06
Nodes (54): ref_supabase_server_core, ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, artifactResponse(), ArtifactUnavailableError, ArtifactVersion (+46 more)

### Community 22 - "multiuser-step05/verify-evidence.cjs"
Cohesion: 0.06
Nodes (26): assert, browser, crypto, decisions, documents, fs, full, graph (+18 more)

### Community 23 - "index.ts"
Cohesion: 0.10
Nodes (24): express, ws, b64(), createSession(), participantId(), roomToken(), Session, verifySession() (+16 more)

### Community 24 - "intent-authority.ts"
Cohesion: 0.18
Nodes (14): clean(), demoExtract(), demoOrchestrate(), shell(), AgentChange, extractRequirement(), AcceptedIntentContext, generic (+6 more)

### Community 26 - "Harness decision log"
Cohesion: 0.04
Nodes (52): D-0001 — Preserve the existing application while migrating additively, D-0002 — Personal interpretations are proposals, not builder authority, D-0003 — Build from the accepted registry, not the raw canvas, D-0004 — Deletion is not withdrawal, D-0005 — Pause on consequential accepted contradictions, D-0006 — Conflict groups and explicit affected-contributor agreement, D-0007 — Classify per intent and reprocess only by explicit participant action, D-0008 — Submit intent explicitly; collaborate continuously (+44 more)

### Community 27 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 29 - "event-store.ts"
Cohesion: 0.18
Nodes (10): EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow, taskTransitions (+2 more)

### Community 30 - "types.ts"
Cohesion: 0.08
Nodes (28): categories, fail(), intentCommandHash(), parseIntentCommand(), src_intent_review, caption(), Edit, IntentReview() (+20 more)

### Community 31 - "drawer.tsx"
Cohesion: 0.13
Nodes (5): DrawerContent(), DrawerContext, DrawerContextProps, useDrawer(), ref_base_ui_react_drawer

### Community 32 - "IsolationRunner"
Cohesion: 0.09
Nodes (28): BASIC_LIMIT, DllImport, EXTENDED_LIMIT, FileSystemRights, IntPtr, IO_COUNTERS, PROCESS_INFORMATION, SecurityIdentifier (+20 more)

### Community 33 - "ref_class_variance_authority"
Cohesion: 0.22
Nodes (6): Alert(), alertVariants, Button(), buttonVariants, ref_base_ui_react_button, ref_class_variance_authority

### Community 34 - "carousel.tsx"
Cohesion: 0.17
Nodes (13): CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions, CarouselPlugin (+5 more)

### Community 35 - "tool-registry.ts"
Cohesion: 0.14
Nodes (13): ActorType, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior, ToolContext (+5 more)

### Community 36 - "provider-reconnect.test.ts"
Cohesion: 0.17
Nodes (7): ref_y_protocols_awareness, deletionSignature(), ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), FakeWebSocket

### Community 37 - "local-drafts.test.ts"
Cohesion: 0.18
Nodes (9): tokenParticipant(), Workspace(), browserDraftStore, draftKey(), DraftStore, LocalDraftStatus, persistDraft(), restoreDraft() (+1 more)

### Community 39 - "chart.tsx"
Cohesion: 0.19
Nodes (11): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION, THEMES (+3 more)

### Community 41 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 42 - "Harness architecture"
Cohesion: 0.10
Nodes (21): Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Bounded context and cost target, Browser recovery and transport batching — 2026-09-28, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary, Execution flow (+13 more)

### Community 43 - "multiuser-step07/verify-evidence.cjs"
Cohesion: 0.24
Nodes (10): assert, crypto, documents, fs, main(), path, read(), root (+2 more)

### Community 44 - "artifact-restoration.test.ts"
Cohesion: 0.13
Nodes (14): child, timer, workspace, ref_node_crypto, dir, manager, observations, platform (+6 more)

### Community 45 - "field.tsx"
Cohesion: 0.17
Nodes (3): Field(), fieldVariants, ref_components_ui_label

### Community 46 - "item.tsx"
Cohesion: 0.18
Nodes (4): Item(), ItemMedia(), itemMediaVariants, itemVariants

### Community 47 - "build-shortcut.ts"
Cohesion: 0.29
Nodes (8): ariaShortcut(), BUILD_SHORTCUT_STORAGE_KEY, BuildShortcutPreference, defaultBuildShortcut(), isBuildShortcut(), readBuildShortcut(), ShortcutEvent, shortcutLabel()

### Community 48 - "attachment.tsx"
Cohesion: 0.20
Nodes (4): Attachment(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 49 - "dialog.tsx"
Cohesion: 0.07
Nodes (3): ref_base_ui_react_dialog, ref_components_ui_button, ref_react_day_picker

### Community 50 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.15
Nodes (11): ref_dotenv_config, @supabase/supabase-js, apply, args, backup, client, dataArg, dataDir (+3 more)

### Community 51 - "workflow-budget.test.ts"
Cohesion: 0.30
Nodes (11): ProviderAccountingError, openBudget(), recoverWorkflowBudget(), remainingAllowanceUsd(), restoreBudget(), summarize(), updateBudget(), WorkflowBudget (+3 more)

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

### Community 57 - "build-recovery.ts"
Cohesion: 0.27
Nodes (9): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, generateProjectPlan(), mergeUsage(), budgetProjectFiles(), ProjectPlan (+1 more)

### Community 58 - "layout.tsx"
Cohesion: 0.20
Nodes (7): app_globals, geistMono, geistSans, metadata, nextConfig, ref_next, ref_next_font_google

### Community 59 - "rooms.ts"
Cohesion: 0.08
Nodes (25): ArchivedVersion, AISettings, authenticatedDelta(), BudgetReservation, BudgetWindow, ClientSocket, colors, defaultDataDir (+17 more)

### Community 60 - "providers.test.ts"
Cohesion: 0.24
Nodes (8): adapterFor(), discoverModels(), generateStructured(), mergeUsage(), ProviderConfig, withProviderAccounting(), withProviderRetryReason(), schema

### Community 61 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 62 - "command.tsx"
Cohesion: 0.15
Nodes (3): ref_cmdk, ref_components_ui_dialog, ref_components_ui_input_group

### Community 63 - "harness/checklist.md"
Cohesion: 0.28
Nodes (4): CoCreate steering entrypoint, graphify, Historical documentation archive, Model-routing evaluation protocol

### Community 65 - "multiuser-step06/verify-evidence.cjs"
Cohesion: 0.08
Nodes (23): assert, browser, comparison, count(), crypto, decisions, documents, focused (+15 more)

### Community 66 - "supabase.ts"
Cohesion: 0.15
Nodes (12): ref_react_dom_client, App, ProjectApp, src_studio_ivory, src_styles, authReturnKey, clientAuthMode, resolved (+4 more)

### Community 67 - "verify-intent-ui.ts"
Cohesion: 0.07
Nodes (28): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30), Legacy AI routes (local compatibility only; hosted routes return 410) (+20 more)

### Community 68 - "safeLocalDestination"
Cohesion: 0.36
Nodes (8): safeLocalDestination(), authMessage(), ForgotPassword(), intendedDestination(), Login(), ProjectApp(), Signup(), supabaseAuthCallbackUrl()

### Community 70 - "verify-reliability.ts"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, open(), output, providerAddress, room (+2 more)

### Community 72 - "ai-accounting.ts"
Cohesion: 0.11
Nodes (23): Shared response models, Shared response models, Migration, aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge() (+15 more)

### Community 73 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, deploy:cloudflare, dev, migrate:legacy, start, test

### Community 74 - ".ensureWorkflow"
Cohesion: 0.23
Nodes (3): WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 76 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 77 - "toggle-group.tsx"
Cohesion: 0.22
Nodes (6): ToggleGroupContext, Toggle(), toggleVariants, ref_base_ui_react_toggle, ref_base_ui_react_toggle_group, ref_components_ui_toggle

### Community 78 - "auth-config.ts"
Cohesion: 0.38
Nodes (6): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution

### Community 80 - "breadcrumb.tsx"
Cohesion: 0.13
Nodes (8): Badge(), badgeVariants, Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants, ref_base_ui_react_merge_props, ref_base_ui_react_use_render

### Community 81 - "reliability.test.ts"
Cohesion: 0.07
Nodes (21): Candidate generation, recovery and promotion, Coordinator and immutable saves, Current harness architecture, Durable authority and storage, Edits, submission and acceptance, Policy and deferred boundaries, Requirement-linked candidate verification (Step 07), Runtime map (+13 more)

### Community 82 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 84 - "lucide-react"
Cohesion: 0.09
Nodes (5): NativeSelectProps, ref_base_ui_react_accordion, ref_base_ui_react_checkbox, ref_input_otp, lucide-react

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
Cohesion: 0.15
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 92 - "Step 05 handoff — attributable intent and contextual references"
Cohesion: 0.33
Nodes (6): Checks and honest scope, Durability, uncertainty and compatibility, Files and decision, Outcome and reproduced boundary, Step 05 handoff — attributable intent and contextual references, Unrun release dependencies and next step

### Community 95 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 102 - "RoomView"
Cohesion: 0.13
Nodes (13): Rooms and sessions, 2guys1canvas presentation and invitation boundary (2026-09-30), Responsive delivery and synchronization, Acceptance tests, Collaborative contradiction-resolution plan, Server contracts, UI, src_build_progress (+5 more)

### Community 103 - "verify-candidate-evidence.ts"
Cohesion: 0.12
Nodes (18): address, Browser, browsers, candidates, converge(), dataDir, execute, fake (+10 more)

### Community 104 - "2guys1canvas"
Cohesion: 0.13
Nodes (15): 2guys1canvas, Active hosted MVP: OpenRouter BYOK, AI steering documents, Architecture, Checks, Connect AI, Current boundaries, Current product setup (2026-09-30) (+7 more)

### Community 105 - "2guys1canvas product brief"
Cohesion: 0.25
Nodes (8): 2guys1canvas product brief, Accepted future work, Accounts, saved projects and sharing, Build recovery and evidence, Collaborative steering and authority, Hosted AI and limits, Mission, users and scope, Shared context, recorded usage and requested appearance

### Community 107 - "Multi-user Step 03 handoff - 2026-10-03"
Cohesion: 0.29
Nodes (7): Compatibility, rollback and hosted dependencies, Exact verification and scope, Files and decision, Measured growth and retention proposal, Multi-user Step 03 handoff - 2026-10-03, Next task, Outcome and responsible boundary

### Community 108 - "input-group.tsx"
Cohesion: 0.22
Nodes (6): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, ref_components_ui_input, ref_components_ui_textarea

### Community 109 - "Multi-user harness improvement prompts"
Cohesion: 0.15
Nodes (13): Common contract, Multi-user harness improvement prompts, Starting instruction, Step 01 - Audit, scenarios and baseline, Step 02 - Coordinator fencing and owner routing, Step 03 - Artifact persistence and restoration, Step 04 - Generated execution isolation, Step 05 - Intent inspection, correction and contextual references (+5 more)

### Community 110 - "isolation.ts"
Cohesion: 0.21
Nodes (18): ref_node_module, ref_node_url, assertIsolationAvailable(), cancelled(), compileIsolated(), Dependency, hostEnvironment(), IsolatedRequest (+10 more)

### Community 111 - "tabs.tsx"
Cohesion: 0.33
Nodes (3): TabsList(), tabsListVariants, ref_base_ui_react_tabs

### Community 112 - "Harness status and outstanding work"
Cohesion: 0.11
Nodes (18): Accepted deferred implementation, Context, accounting and recovery, Current implementation and dated evidence, Documentation cleanup verification, Durable workflow control and permissions, Evidence conventions, Execution, tools and evidence, Harness status and outstanding work (+10 more)

### Community 113 - "2guys1canvas contributor instructions"
Cohesion: 0.25
Nodes (8): 2guys1canvas contributor instructions, Permissions, persistence and sharing, Recovery, accounting and secrets, Stack and coding, Start and maintain authority, Step 07 acceptance boundary, Validation and documentation maintenance, Workflow and source ownership

### Community 114 - "Multi-user Step 07 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Checks and retained attempts, Deliberately bounded coverage, Files, decision and handoff, Isolation and operator setup, Multi-user Step 07 handoff - 2026-10-04, Outcome and boundary

### Community 115 - "2guys1canvas implemented API contracts"
Cohesion: 0.22
Nodes (9): 2guys1canvas implemented API contracts, Active temporary OpenRouter routes, Authenticated project routes, Local compatibility only, Preview and download, Step 05 intent command contracts, Step 07 verification evidence, Transport and authorization (+1 more)

### Community 116 - "verify-build-progress.ts"
Cohesion: 0.15
Nodes (15): address, Browser, browsers, candidates, converge(), dataDir, fake, gates (+7 more)

### Community 117 - "browser.ts"
Cohesion: 0.36
Nodes (8): ref_node_string_decoder, assertVerificationBrowserAvailable(), browserExecutable(), BrowserProtocol, unavailable(), withIsolatedBrowser(), IsolationError, IsolationOptions

### Community 118 - "CoCreate harness assessment"
Cohesion: 0.40
Nodes (5): CoCreate harness assessment, Existing capabilities preserved, First vertical slice selected, Material gaps found, Second verified slice — shared intent

### Community 120 - "Reliability verification — 2026-10-01"
Cohesion: 0.22
Nodes (9): Executed checks, Implemented behavior, Reference availability update — 2026-10-02 (documentation only), Reliability verification — 2026-10-01, Remaining verification and operational limits — original 2026-10-01 run, Scope and verified causes, Step 05 local intent verification — 2026-10-04, Step 06 local progress verification — 2026-10-04 (+1 more)

### Community 121 - "2guys1canvas"
Cohesion: 0.33
Nodes (6): 2guys1canvas, Checks and boundaries, Contributor entrypoints, Hosted configuration and release prerequisites, Hosted setup and use, Start locally

### Community 122 - "project.ts"
Cohesion: 0.14
Nodes (18): ref_node_path_posix, allowedExtensions, applyOperations(), downloadableFiles(), FileOperation, generatedRoot, infrastructureFiles, loadProject() (+10 more)

### Community 123 - "ref_node_http"
Cohesion: 0.12
Nodes (10): dir, manager, options, room, server, ref_node_http, ../../server/.step08-before.js, browser (+2 more)

### Community 124 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.40
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 125 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 126 - "button-group.tsx"
Cohesion: 0.40
Nodes (3): ButtonGroup(), buttonGroupVariants, ref_components_ui_separator

### Community 127 - "Multi-user Step 04 handoff - 2026-10-04"
Cohesion: 0.33
Nodes (6): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Outcome and responsible boundary, Prepared deployment and remaining prerequisites

### Community 128 - "documentation-cleanup.md"
Cohesion: 0.40
Nodes (4): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02

### Community 129 - "measure-responsiveness.ts"
Cohesion: 0.38
Nodes (6): ref_node_fs_promises, ref_node_perf_hooks, median(), run(), Sample, wait()

### Community 130 - "verification.ts"
Cohesion: 0.24
Nodes (12): previewHtml(), assertPromotionEvidence(), candidateHash(), CHECK_VERSION, checksFor(), Kind, ListObservation, observerScript (+4 more)

### Community 132 - "Harness migration plan"
Cohesion: 0.50
Nodes (4): Harness migration plan, Later migrations, Rollback, Safe rollout

### Community 134 - "2guys1canvas current handoff"
Cohesion: 0.67
Nodes (3): 2guys1canvas current handoff, Next work, Read next

### Community 135 - "generated-isolation.test.ts"
Cohesion: 0.17
Nodes (7): ref_node_events, ref_node_net, fs, path, server_isolation_esbuild_cjs, files, jobs

### Community 137 - "Step 08 - Durable workflow budget and accounting"
Cohesion: 0.40
Nodes (5): Boundary and scope, Gap, outcomes and bounds, Rollout, compatibility and next work, Step 08 - Durable workflow budget and accounting, Verification and retained failures

### Community 138 - "local-idle-probe.cjs"
Cohesion: 0.33
Nodes (5): {DatabaseSync}, db, fs, path, ref_node_sqlite

### Community 142 - "fetch"
Cohesion: 0.67
Nodes (3): Collaboration connection lifecycle, Cloudflare availability and collaboration repair evidence (2026-09-18), fetch()

## Knowledge Gaps
- **768 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+763 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1290 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `menubar.tsx`, `marker.tsx`, `sidebar.tsx`, `package.json`, `dropdown-menu.tsx`, `App.tsx`, `pagination.tsx`, `ProjectApp.tsx`, `combobox.tsx`, `context-menu.tsx`, `types.ts`, `drawer.tsx`, `ref_class_variance_authority`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `toast.tsx`, `field.tsx`, `item.tsx`, `attachment.tsx`, `dialog.tsx`, `select.tsx`, `command.tsx`, `supabase.ts`, `toggle-group.tsx`, `message-scroller.tsx`, `breadcrumb.tsx`, `lucide-react`, `table.tsx`, `popover.tsx`, `message.tsx`, `input-group.tsx`, `card.tsx`?**
  _High betweenness centrality (0.247) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `carousel.tsx`, `menubar.tsx`, `toast.tsx`, `sidebar.tsx`, `package.json`, `dropdown-menu.tsx`, `message-scroller.tsx`, `breadcrumb.tsx`, `dialog.tsx`, `pagination.tsx`, `App.tsx`, `ProjectApp.tsx`, `navigation-menu.tsx`, `select.tsx`, `combobox.tsx`, `context-menu.tsx`, `command.tsx`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `2guys1canvas implemented API contracts` connect `2guys1canvas implemented API contracts` to `RoomManager`, `ai-accounting.ts`, `harness/checklist.md`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Are the 33 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 33 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _768 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.06895986895986896 - nodes in this community are weakly interconnected._
- **Should `ref_node_fs` be split into smaller, more focused modules?**
  _Cohesion score 0.11174242424242424 - nodes in this community are weakly interconnected._