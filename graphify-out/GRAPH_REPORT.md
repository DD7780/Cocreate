# Graph Report - Devoffice  (2026-10-03)

## Corpus Check
- 206 files · ~283,116 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 29 file(s) not represented in the graph (top: .log 18, (none) 4, .css 4)

## Summary
- 1902 nodes · 3549 edges · 125 communities (93 shown, 32 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 116 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0ae3b193`
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
- ref_node_assert_strict
- tool-registry.ts
- index.ts
- combobox.tsx
- Harness decision log
- compilerOptions
- context-menu.tsx
- event-store.ts
- types.ts
- drawer.tsx
- 2guys1canvas product brief
- ref_class_variance_authority
- carousel.tsx
- 2guys1canvas current handoff
- provider-reconnect.test.ts
- yjs
- alert-dialog.tsx
- chart.tsx
- toast.tsx
- live-collaboration-check.mjs
- Harness architecture
- message-scroller.tsx
- command.tsx
- field.tsx
- item.tsx
- Workspace
- attachment.tsx
- lucide-react
- migrate-legacy-to-supabase.ts
- providers.test.ts
- managed-ai.test.ts
- navigation-menu.tsx
- select.tsx
- 2guys1canvas context handoff
- devDependencies
- ai-presets.test.ts
- layout.tsx
- 2guys1canvas
- project.ts
- 2guys1canvas product brief
- avatar.tsx
- harness/checklist.md
- empty.tsx
- popover.tsx
- supabase.ts
- 2guys1canvas API reference
- safeLocalDestination
- RoomView
- verify-reliability.ts
- progress.tsx
- tabs.tsx
- scripts
- measure-responsiveness.ts
- src_comic
- live-browser-collaboration-check.mjs
- ai-accounting.ts
- auth-config.ts
- alert.tsx
- button-group.tsx
- reliability.test.ts
- .oxfmtrc.json
- collapsible.tsx
- card.tsx
- container.js
- page.tsx
- utils.ts
- oauth-callback.ts
- request
- fixtures/multiuser-baseline.ts
- CoCreate harness assessment
- direction.tsx
- .mcp.json
- 2guys1canvas AI coding instructions
- main.tsx
- Harness migration plan
- Responsiveness evidence
- model-evaluation.md
- ByokSetup.tsx
- 2guys1canvas
- CoCreateProvider
- resizable.tsx
- Reliability verification — 2026-10-01
- input-group.tsx
- Multi-user harness improvement prompts
- build-recovery.ts
- .ensureWorkflow
- Harness status and outstanding work
- event-store.test.ts
- Current harness architecture
- 2guys1canvas implemented API contracts
- bubble.tsx
- multiuser-step01-baseline.md
- 2guys1canvas contributor instructions
- accordion.tsx
- native-select.tsx
- Harness documentation cleanup — 2026-10-02
- fetch
- ui-assets.md
- prisma7.config.ts

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 90 edges
2. `createCoCreateServer()` - 55 edges
3. `EventStore` - 50 edges
4. `Harness decision log` - 45 edges
5. `react` - 43 edges
6. `2guys1canvas harness implementation checklist` - 40 edges
7. `SupabasePlatform` - 38 edges
8. `registerProjectRoutes()` - 31 edges
9. `lucide-react` - 25 edges
10. `fail()` - 24 edges

## Surprising Connections (you probably didn't know these)
- `Coordinator and immutable saves` --references--> `RemoteCoordinator`  [INFERRED]
  docs/harness/architecture.md → server/coordinator.ts
- `Reference-led presentation update (2026-09-30)` --references--> `Workspace()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → src/App.tsx
- `Shared response models` --references--> `Requirement`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/api.md → src/types.ts
- `Shared response models` --references--> `AIRunRecord`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/api.md → src/types.ts
- `Bounded context and cost target` --references--> `AIRunRecord`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → src/types.ts

## Import Cycles
- None detected.

## Communities (125 total, 32 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.07
Nodes (26): Room reads, submissions and decisions, Building and preview, Submission scheduling: current implementation and required hardening, Later-step source audit, ref_node_stream, calculateCharge(), catalogRate(), effortAllowance() (+18 more)

### Community 1 - "SupabasePlatform"
Cohesion: 0.05
Nodes (43): express, ref_node_crypto, ref_supabase_server_core, RemoteCoordinator, Rpc, decryptSecret(), EncryptedSecret, encryptSecret() (+35 more)

### Community 2 - "requirements.ts"
Cohesion: 0.10
Nodes (36): acceptanceFor(), acceptedClassification(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries(), categories, classifications (+28 more)

### Community 3 - "providers.ts"
Cohesion: 0.08
Nodes (30): ref_node_async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+22 more)

### Community 4 - "menubar.tsx"
Cohesion: 0.06
Nodes (3): ref_base_ui_react_menu, ref_base_ui_react_menubar, ref_components_ui_dropdown_menu

### Community 5 - "ref_node_fs"
Cohesion: 0.09
Nodes (24): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, browser, output, profile, browser (+16 more)

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
Nodes (31): engines, node, name, private, type, version, cross-env, esbuild (+23 more)

### Community 11 - "generator.ts"
Cohesion: 0.15
Nodes (17): demoOrchestrate(), shell(), bundleSource(), classification, compactRequirement(), compactText(), DEFAULT_PROJECT_OUTPUT_TOKENS, extractRequirement() (+9 more)

### Community 12 - "ref_lib_utils"
Cohesion: 0.07
Nodes (8): ref_base_ui_react_checkbox, ref_base_ui_react_preview_card, ref_base_ui_react_radio, ref_base_ui_react_radio_group, ref_base_ui_react_separator, ref_base_ui_react_slider, ref_base_ui_react_switch, ref_lib_utils

### Community 13 - "rooms.ts"
Cohesion: 0.09
Nodes (24): AISettings, authenticatedDelta(), BudgetReservation, BudgetWindow, ClientSocket, colors, defaultDataDir, DurableStore (+16 more)

### Community 14 - "ai-presets.ts"
Cohesion: 0.10
Nodes (24): Named AI connections (preferred API), CatalogEntry, classifyTaskComplexity(), cost(), estimateLayerMaximum(), layer(), longContext, migrateLegacySpecialty() (+16 more)

### Community 15 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, express, lucide-react, pg (+16 more)

### Community 16 - "App.tsx"
Cohesion: 0.08
Nodes (32): AgentPanel(), changeEffort(), reinterpret(), send(), AISetup(), api(), BuildAccounting(), comparableMetrics() (+24 more)

### Community 18 - "react"
Cohesion: 0.07
Nodes (4): ref_base_ui_react_input, ref_base_ui_react_scroll_area, ref_input_otp, react

### Community 19 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "ProjectApp.tsx"
Cohesion: 0.09
Nodes (9): InviteResult, PendingInvite, Project, ProjectList, ProjectMember, ProjectRole, ShareState, Workspace (+1 more)

### Community 21 - "ref_node_assert_strict"
Cohesion: 0.13
Nodes (5): ref_node_assert_strict, ref_node_http, ref_node_test, projectSchema, needsSessionRefresh()

### Community 22 - "tool-registry.ts"
Cohesion: 0.13
Nodes (15): ActorType, bundleProject(), FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable() (+7 more)

### Community 23 - "index.ts"
Cohesion: 0.11
Nodes (21): ref_node_url, ws, browser, dataDir, group, profile, room, token (+13 more)

### Community 26 - "Harness decision log"
Cohesion: 0.04
Nodes (45): D-0001 — Preserve the existing application while migrating additively, D-0002 — Personal interpretations are proposals, not builder authority, D-0003 — Build from the accepted registry, not the raw canvas, D-0004 — Deletion is not withdrawal, D-0005 — Pause on consequential accepted contradictions, D-0006 — Conflict groups and explicit affected-contributor agreement, D-0007 — Classify per intent and reprocess only by explicit participant action, D-0008 — Submit intent explicitly; collaborate continuously (+37 more)

### Community 27 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 29 - "event-store.ts"
Cohesion: 0.14
Nodes (11): EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow, taskTransitions (+3 more)

### Community 30 - "types.ts"
Cohesion: 0.10
Nodes (22): Shared response models, Shared response models, Migration, AgentStatus, AIRateTier, AIRoutingEvidenceStatus, CapabilityCheck, ChangeKind (+14 more)

### Community 31 - "drawer.tsx"
Cohesion: 0.13
Nodes (5): DrawerContent(), DrawerContext, DrawerContextProps, useDrawer(), ref_base_ui_react_drawer

### Community 32 - "2guys1canvas product brief"
Cohesion: 0.25
Nodes (8): 2guys1canvas product brief, Accepted future work, Accounts, saved projects and sharing, Build recovery and evidence, Collaborative steering and authority, Hosted AI and limits, Mission, users and scope, Shared context, recorded usage and requested appearance

### Community 33 - "ref_class_variance_authority"
Cohesion: 0.16
Nodes (10): Button(), buttonVariants, ToggleGroupContext, Toggle(), toggleVariants, ref_base_ui_react_button, ref_base_ui_react_toggle, ref_base_ui_react_toggle_group (+2 more)

### Community 34 - "carousel.tsx"
Cohesion: 0.17
Nodes (13): CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions, CarouselPlugin (+5 more)

### Community 35 - "2guys1canvas current handoff"
Cohesion: 0.67
Nodes (3): 2guys1canvas current handoff, Next work, Read next

### Community 36 - "provider-reconnect.test.ts"
Cohesion: 0.18
Nodes (6): ref_y_protocols_awareness, deletionSignature(), ConnectionStatus, ProviderDependencies, providerInternals, FakeWebSocket

### Community 37 - "yjs"
Cohesion: 0.19
Nodes (8): yjs, browserDraftStore, draftKey(), DraftStore, LocalDraftStatus, persistDraft(), restoreDraft(), merge()

### Community 39 - "chart.tsx"
Cohesion: 0.19
Nodes (11): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION, THEMES (+3 more)

### Community 41 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 42 - "Harness architecture"
Cohesion: 0.10
Nodes (20): Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Browser recovery and transport batching — 2026-09-28, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary, Execution flow, Harness architecture (+12 more)

### Community 44 - "command.tsx"
Cohesion: 0.15
Nodes (3): ref_cmdk, ref_components_ui_dialog, ref_components_ui_input_group

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

### Community 49 - "lucide-react"
Cohesion: 0.07
Nodes (4): ref_base_ui_react_dialog, ref_components_ui_button, lucide-react, ref_react_day_picker

### Community 50 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.17
Nodes (10): ref_dotenv_config, apply, args, backup, client, dataArg, dataDir, mapping (+2 more)

### Community 51 - "providers.test.ts"
Cohesion: 0.17
Nodes (14): boundedInput(), callOpenAI(), listProviderModels(), providerConfig(), testOpenAIConnection(), adapterFor(), discoverModels(), generateStructured() (+6 more)

### Community 52 - "managed-ai.test.ts"
Cohesion: 0.09
Nodes (21): ref_node_fs_promises, [command,file], BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases (+13 more)

### Community 53 - "navigation-menu.tsx"
Cohesion: 0.20
Nodes (3): NavigationMenuTrigger(), navigationMenuTriggerStyle, ref_base_ui_react_navigation_menu

### Community 55 - "2guys1canvas context handoff"
Cohesion: 0.10
Nodes (20): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+12 more)

### Community 56 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, prisma, tsx, @types/express, @types/node, @types/pg, @types/react, @types/react-dom (+3 more)

### Community 57 - "ai-presets.test.ts"
Cohesion: 0.25
Nodes (9): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), effortLevels, AIWorkflowMode (+1 more)

### Community 58 - "layout.tsx"
Cohesion: 0.20
Nodes (7): app_globals, geistMono, geistSans, metadata, nextConfig, ref_next, ref_next_font_google

### Community 59 - "2guys1canvas"
Cohesion: 0.33
Nodes (6): 2guys1canvas, Checks and boundaries, Contributor entrypoints, Hosted configuration and release prerequisites, Hosted setup and use, Start locally

### Community 60 - "project.ts"
Cohesion: 0.17
Nodes (14): ref_node_module, ref_node_path_posix, allowedExtensions, generatedRoot, infrastructureFiles, loadProject(), persistProject(), ProjectFile (+6 more)

### Community 61 - "2guys1canvas product brief"
Cohesion: 0.10
Nodes (20): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+12 more)

### Community 63 - "harness/checklist.md"
Cohesion: 0.35
Nodes (3): CoCreate steering entrypoint, graphify, Historical documentation archive

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
Cohesion: 0.22
Nodes (9): Rooms and sessions, 2guys1canvas presentation and invitation boundary (2026-09-30), Responsive delivery and synchronization, Acceptance tests, Collaborative contradiction-resolution plan, Server contracts, UI, RoomView (+1 more)

### Community 70 - "verify-reliability.ts"
Cohesion: 0.21
Nodes (9): Browser, browsers, dataDir, fake, open(), output, room, until() (+1 more)

### Community 72 - "tabs.tsx"
Cohesion: 0.33
Nodes (3): TabsList(), tabsListVariants, ref_base_ui_react_tabs

### Community 73 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, deploy:cloudflare, dev, migrate:legacy, start, test

### Community 74 - "measure-responsiveness.ts"
Cohesion: 0.47
Nodes (5): ref_node_perf_hooks, median(), run(), Sample, wait()

### Community 76 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 77 - "ai-accounting.ts"
Cohesion: 0.23
Nodes (12): Bounded context and cost target, aggregateCalls(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, AIRunCall, AIRunRecord (+4 more)

### Community 78 - "auth-config.ts"
Cohesion: 0.38
Nodes (6): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution

### Community 80 - "button-group.tsx"
Cohesion: 0.17
Nodes (9): Badge(), badgeVariants, ButtonGroup(), buttonGroupVariants, Marker(), markerVariants, ref_base_ui_react_merge_props, ref_base_ui_react_use_render (+1 more)

### Community 81 - "reliability.test.ts"
Cohesion: 0.22
Nodes (3): applySteeringUpdate(), plainText(), edit()

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
Cohesion: 0.50
Nodes (4): Projects(), request(), selectedId(), ShareProjectDialog()

### Community 90 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.16
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 92 - "CoCreate harness assessment"
Cohesion: 0.40
Nodes (5): CoCreate harness assessment, Existing capabilities preserved, First vertical slice selected, Material gaps found, Second verified slice — shared intent

### Community 95 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 99 - "main.tsx"
Cohesion: 0.29
Nodes (6): ref_react_dom_client, App, ProjectApp, src_studio_ivory, src_styles, clientAuthMode

### Community 100 - "Harness migration plan"
Cohesion: 0.50
Nodes (4): Harness migration plan, Later migrations, Rollback, Safe rollout

### Community 103 - "ByokSetup.tsx"
Cohesion: 0.33
Nodes (6): AdvancedAISetup(), ByokSetup(), run(), Lease, request(), AIConnection

### Community 104 - "2guys1canvas"
Cohesion: 0.13
Nodes (15): 2guys1canvas, Active hosted MVP: OpenRouter BYOK, AI steering documents, Architecture, Checks, Connect AI, Current boundaries, Current product setup (2026-09-30) (+7 more)

### Community 105 - "CoCreateProvider"
Cohesion: 0.26
Nodes (3): SimpleHostedAISetup(), CoCreateProvider, retryDelay()

### Community 107 - "Reliability verification — 2026-10-01"
Cohesion: 0.33
Nodes (6): Executed checks, Implemented behavior, Reference availability update — 2026-10-02 (documentation only), Reliability verification — 2026-10-01, Remaining verification and operational limits — original 2026-10-01 run, Scope and verified causes

### Community 108 - "input-group.tsx"
Cohesion: 0.22
Nodes (6): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, ref_components_ui_input, ref_components_ui_textarea

### Community 109 - "Multi-user harness improvement prompts"
Cohesion: 0.15
Nodes (13): Common contract, Multi-user harness improvement prompts, Starting instruction, Step 01 - Audit, scenarios and baseline, Step 02 - Coordinator fencing and owner routing, Step 03 - Artifact persistence and restoration, Step 04 - Generated execution isolation, Step 05 - Intent inspection, correction and contextual references (+5 more)

### Community 110 - "build-recovery.ts"
Cohesion: 0.24
Nodes (12): addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, compactSharedRequirement(), generateProjectPlan(), mergeUsage(), applyOperations() (+4 more)

### Community 111 - ".ensureWorkflow"
Cohesion: 0.23
Nodes (3): WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 112 - "Harness status and outstanding work"
Cohesion: 0.18
Nodes (11): Accepted deferred implementation, Context, accounting and recovery, Current implementation and dated evidence, Documentation cleanup verification, Durable workflow control and permissions, Evidence conventions, Execution, tools and evidence, Harness status and outstanding work (+3 more)

### Community 113 - "event-store.test.ts"
Cohesion: 0.25
Nodes (6): ref_node_sqlite, clean(), demoExtract(), AgentChange, ProductSource, Requirement

### Community 114 - "Current harness architecture"
Cohesion: 0.25
Nodes (8): Candidate generation, recovery and promotion, Coordinator and immutable saves, Current harness architecture, Durable authority and storage, Edits, submission and acceptance, Policy and deferred boundaries, Runtime map, Workflow inspection and accounting

### Community 115 - "2guys1canvas implemented API contracts"
Cohesion: 0.29
Nodes (7): 2guys1canvas implemented API contracts, Active temporary OpenRouter routes, Authenticated project routes, Local compatibility only, Preview and download, Transport and authorization, WebSocket collaboration and save receipts

### Community 116 - "bubble.tsx"
Cohesion: 0.38
Nodes (4): Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 117 - "multiuser-step01-baseline.md"
Cohesion: 0.29
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 118 - "2guys1canvas contributor instructions"
Cohesion: 0.29
Nodes (7): 2guys1canvas contributor instructions, Permissions, persistence and sharing, Recovery, accounting and secrets, Stack and coding, Start and maintain authority, Validation and documentation maintenance, Workflow and source ownership

### Community 121 - "Harness documentation cleanup — 2026-10-02"
Cohesion: 0.50
Nodes (4): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02

### Community 122 - "fetch"
Cohesion: 0.67
Nodes (3): Collaboration connection lifecycle, Cloudflare availability and collaboration repair evidence (2026-09-18), fetch()

## Knowledge Gaps
- **599 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+594 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1064 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `menubar.tsx`, `sidebar.tsx`, `package.json`, `App.tsx`, `pagination.tsx`, `ProjectApp.tsx`, `breadcrumb.tsx`, `combobox.tsx`, `context-menu.tsx`, `drawer.tsx`, `ref_class_variance_authority`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `toast.tsx`, `message-scroller.tsx`, `command.tsx`, `field.tsx`, `item.tsx`, `attachment.tsx`, `lucide-react`, `select.tsx`, `avatar.tsx`, `popover.tsx`, `alert.tsx`, `button-group.tsx`, `card.tsx`, `table.tsx`, `main.tsx`, `ByokSetup.tsx`, `input-group.tsx`, `bubble.tsx`, `native-select.tsx`?**
  _High betweenness centrality (0.278) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `menubar.tsx`, `sidebar.tsx`, `package.json`, `ref_lib_utils`, `App.tsx`, `pagination.tsx`, `react`, `ProjectApp.tsx`, `breadcrumb.tsx`, `combobox.tsx`, `context-menu.tsx`, `carousel.tsx`, `toast.tsx`, `message-scroller.tsx`, `command.tsx`, `navigation-menu.tsx`, `select.tsx`, `ByokSetup.tsx`, `accordion.tsx`, `native-select.tsx`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `2guys1canvas implemented API contracts` connect `2guys1canvas implemented API contracts` to `RoomManager`, `types.ts`, `harness/checklist.md`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Are the 32 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 32 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _599 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.07338693052978768 - nodes in this community are weakly interconnected._
- **Should `SupabasePlatform` be split into smaller, more focused modules?**
  _Cohesion score 0.05274725274725275 - nodes in this community are weakly interconnected._