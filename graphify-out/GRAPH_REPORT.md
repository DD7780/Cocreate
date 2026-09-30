# Graph Report - Devoffice  (2026-09-30)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1502 nodes · 2876 edges · 99 communities (68 shown, 31 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `76debc8c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- SupabasePlatform
- requirements.ts
- providers.ts
- menubar.tsx
- ref_node_fs
- managed-ai.test.ts
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
- lucide-react
- react
- components.json
- ProjectApp.tsx
- ref_node_assert_strict
- tool-registry.ts
- index.ts
- breadcrumb.tsx
- combobox.tsx
- api
- compilerOptions
- context-menu.tsx
- event-store.ts
- types.ts
- drawer.tsx
- ai-accounting.ts
- ref_class_variance_authority
- carousel.tsx
- project.ts
- provider-reconnect.test.ts
- local-drafts.test.ts
- alert-dialog.tsx
- chart.tsx
- toast.tsx
- live-collaboration-check.mjs
- demo.ts
- ref_components_ui_button
- command.tsx
- field.tsx
- item.tsx
- Workspace
- attachment.tsx
- dialog.tsx
- migrate-legacy-to-supabase.ts
- CoCreateProvider
- input-group.tsx
- navigation-menu.tsx
- select.tsx
- devDependencies
- ai-presets.test.ts
- layout.tsx
- providers.test.ts
- pagination.tsx
- container.js
- avatar.tsx
- empty.tsx
- popover.tsx
- supabase.ts
- verify-conflict-ui.ts
- safeLocalDestination
- bubble.tsx
- progress.tsx
- tabs.tsx
- scripts
- measure-responsiveness.ts
- main.tsx
- live-browser-collaboration-check.mjs
- ByokSetup.tsx
- auth-config.ts
- alert.tsx
- button-group.tsx
- tooltip.tsx
- .oxfmtrc.json
- collapsible.tsx
- resizable.tsx
- zip.ts
- page.tsx
- utils.ts
- oauth-callback.ts
- request
- prisma7.config.ts
- vite
- .activityForWorkspace
- direction.tsx
- .mcp.json
- engines

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 83 edges
2. `createCoCreateServer()` - 55 edges
3. `react` - 43 edges
4. `EventStore` - 42 edges
5. `SupabasePlatform` - 34 edges
6. `registerProjectRoutes()` - 30 edges
7. `lucide-react` - 25 edges
8. `fail()` - 24 edges
9. `rules` - 21 edges
10. `reconcileRequirements()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `run()` --calls--> `createCoCreateServer()`  [EXTRACTED]
  scripts/measure-responsiveness.ts → server/index.ts
- `record()` --calls--> `aggregateCalls()`  [EXTRACTED]
  tests/ai-accounting.test.ts → server/ai-accounting.ts
- `RoomManager` --references--> `EventStore`  [EXTRACTED]
  server/rooms.ts → server/event-store.ts
- `RoomManager` --references--> `ToolRegistry`  [EXTRACTED]
  server/rooms.ts → server/tool-registry.ts
- `Workspace()` --calls--> `CoCreateProvider`  [EXTRACTED]
  src/App.tsx → src/provider.ts

## Import Cycles
- None detected.

## Communities (99 total, 31 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.08
Nodes (19): ref_node_stream, catalogRate(), effortAllowance(), AIConfig, listProviderModels(), createCoCreateServer(), acceptedRequirementFingerprint(), hasOpenContradictions() (+11 more)

### Community 1 - "SupabasePlatform"
Cohesion: 0.06
Nodes (41): express, ref_supabase_server_core, yjs, decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), html() (+33 more)

### Community 2 - "requirements.ts"
Cohesion: 0.10
Nodes (37): acceptanceFor(), acceptedClassification(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries(), categories, classifications (+29 more)

### Community 3 - "providers.ts"
Cohesion: 0.08
Nodes (30): ref_node_async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+22 more)

### Community 4 - "menubar.tsx"
Cohesion: 0.06
Nodes (3): ref_base_ui_react_menu, ref_base_ui_react_menubar, ref_components_ui_dropdown_menu

### Community 5 - "ref_node_fs"
Cohesion: 0.09
Nodes (24): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, browser, output, profile, browser (+16 more)

### Community 6 - "managed-ai.test.ts"
Cohesion: 0.09
Nodes (21): ref_node_crypto, ref_node_fs_promises, [command,file], BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom() (+13 more)

### Community 7 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 9 - "sidebar.tsx"
Cohesion: 0.07
Nodes (12): Sidebar(), SidebarContext, SidebarContextProps, SidebarMenuButton(), sidebarMenuButtonVariants, SidebarRail(), SidebarTrigger(), useSidebar() (+4 more)

### Community 10 - "package.json"
Cohesion: 0.07
Nodes (27): name, private, type, version, cross-env, esbuild, pg, prisma (+19 more)

### Community 11 - "generator.ts"
Cohesion: 0.11
Nodes (22): boundedInput(), callOpenAI(), classification, compactSharedRequirement(), DEFAULT_PROJECT_OUTPUT_TOKENS, generateProjectPlan(), intentSchema, mergeUsage() (+14 more)

### Community 12 - "ref_lib_utils"
Cohesion: 0.07
Nodes (7): ref_base_ui_react_preview_card, ref_base_ui_react_radio, ref_base_ui_react_radio_group, ref_base_ui_react_separator, ref_base_ui_react_slider, ref_base_ui_react_switch, ref_lib_utils

### Community 13 - "rooms.ts"
Cohesion: 0.09
Nodes (23): AISettings, BudgetReservation, BudgetWindow, ClientSocket, colors, defaultDataDir, DurableStore, EditRecord (+15 more)

### Community 14 - "ai-presets.ts"
Cohesion: 0.11
Nodes (22): CatalogEntry, classifyTaskComplexity(), cost(), estimateLayerMaximum(), layer(), longContext, migrateLegacySpecialty(), modelCatalog (+14 more)

### Community 15 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, express, lucide-react, pg (+16 more)

### Community 16 - "App.tsx"
Cohesion: 0.11
Nodes (17): BuildAccounting(), comparableMetrics(), effortChoices, FormatChoice, ManagedFundingView, ManagedModelView, modeChoices, ProviderChoice (+9 more)

### Community 17 - "lucide-react"
Cohesion: 0.09
Nodes (5): NativeSelectProps, ref_base_ui_react_accordion, ref_base_ui_react_checkbox, ref_input_otp, lucide-react

### Community 18 - "react"
Cohesion: 0.09
Nodes (3): ref_base_ui_react_input, ref_base_ui_react_scroll_area, react

### Community 19 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "ProjectApp.tsx"
Cohesion: 0.09
Nodes (9): InviteResult, PendingInvite, Project, ProjectList, ProjectMember, ProjectRole, ShareState, Workspace (+1 more)

### Community 21 - "ref_node_assert_strict"
Cohesion: 0.14
Nodes (6): ref_node_assert_strict, ref_node_http, ref_node_test, b64(), createSession(), needsSessionRefresh()

### Community 22 - "tool-registry.ts"
Cohesion: 0.13
Nodes (13): ActorType, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior, ToolContext (+5 more)

### Community 23 - "index.ts"
Cohesion: 0.16
Nodes (13): ref_node_url, participantId(), roomToken(), Session, verifySession(), duration(), Options, keepLastSuccess() (+5 more)

### Community 24 - "breadcrumb.tsx"
Cohesion: 0.14
Nodes (6): Badge(), badgeVariants, Marker(), markerVariants, ref_base_ui_react_merge_props, ref_base_ui_react_use_render

### Community 26 - "api"
Cohesion: 0.14
Nodes (18): AgentPanel(), changeEffort(), reinterpret(), send(), AISetup(), api(), ConflictChoice(), submit() (+10 more)

### Community 27 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 29 - "event-store.ts"
Cohesion: 0.13
Nodes (13): ref_node_sqlite, EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow (+5 more)

### Community 30 - "types.ts"
Cohesion: 0.12
Nodes (16): AgentStatus, AIRateTier, AIRoutingEvidenceStatus, CapabilityCheck, ConflictDecisionRecord, ConflictDetectionStatus, ConflictGroupState, InterpretationIntentCategory (+8 more)

### Community 31 - "drawer.tsx"
Cohesion: 0.13
Nodes (5): DrawerContent(), DrawerContext, DrawerContextProps, useDrawer(), ref_base_ui_react_drawer

### Community 32 - "ai-accounting.ts"
Cohesion: 0.22
Nodes (14): aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, AIRate, AIRunCall (+6 more)

### Community 33 - "ref_class_variance_authority"
Cohesion: 0.16
Nodes (10): Button(), buttonVariants, ToggleGroupContext, Toggle(), toggleVariants, ref_base_ui_react_button, ref_base_ui_react_toggle, ref_base_ui_react_toggle_group (+2 more)

### Community 34 - "carousel.tsx"
Cohesion: 0.17
Nodes (13): CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions, CarouselPlugin (+5 more)

### Community 35 - "project.ts"
Cohesion: 0.20
Nodes (14): ref_node_module, ref_node_path_posix, allowedExtensions, applyOperations(), bundleProject(), FileOperation, generatedRoot, infrastructureFiles (+6 more)

### Community 36 - "provider-reconnect.test.ts"
Cohesion: 0.17
Nodes (6): ref_y_protocols_awareness, ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), FakeWebSocket

### Community 37 - "local-drafts.test.ts"
Cohesion: 0.20
Nodes (7): browserDraftStore, draftKey(), DraftStore, LocalDraftStatus, persistDraft(), restoreDraft(), merge()

### Community 39 - "chart.tsx"
Cohesion: 0.19
Nodes (11): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION, THEMES (+3 more)

### Community 41 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 42 - "demo.ts"
Cohesion: 0.20
Nodes (13): clean(), demoExtract(), demoOrchestrate(), shell(), AgentChange, bundleSource(), compactRequirement(), compactText() (+5 more)

### Community 43 - "ref_components_ui_button"
Cohesion: 0.15
Nodes (3): ref_components_ui_button, ref_react_day_picker, ref_shadcn_react_message_scroller

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

### Community 50 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.17
Nodes (10): ref_dotenv_config, apply, args, backup, client, dataArg, dataDir, mapping (+2 more)

### Community 52 - "input-group.tsx"
Cohesion: 0.22
Nodes (6): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, ref_components_ui_input, ref_components_ui_textarea

### Community 53 - "navigation-menu.tsx"
Cohesion: 0.20
Nodes (3): NavigationMenuTrigger(), navigationMenuTriggerStyle, ref_base_ui_react_navigation_menu

### Community 56 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, prisma, tsx, @types/express, @types/node, @types/pg, @types/react, @types/react-dom (+3 more)

### Community 57 - "ai-presets.test.ts"
Cohesion: 0.25
Nodes (9): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), effortLevels, AIWorkflowMode (+1 more)

### Community 58 - "layout.tsx"
Cohesion: 0.20
Nodes (7): app_globals, geistMono, geistSans, metadata, nextConfig, ref_next, ref_next_font_google

### Community 59 - "providers.test.ts"
Cohesion: 0.24
Nodes (8): adapterFor(), discoverModels(), generateStructured(), mergeUsage(), ProviderConfig, withProviderAccounting(), withProviderRetryReason(), schema

### Community 61 - "container.js"
Cohesion: 0.22
Nodes (5): @cloudflare/containers, ref_cloudflare_workers, baseEnv, CoCreateContainer, fetch()

### Community 66 - "supabase.ts"
Cohesion: 0.25
Nodes (7): @supabase/supabase-js, authReturnKey, resolved, supabase, supabaseAppOrigin, supabaseConfigurationError, supabaseOAuthRedirectUrl

### Community 67 - "verify-conflict-ui.ts"
Cohesion: 0.25
Nodes (7): browser, dataDir, group, profile, room, token, ConflictGroup

### Community 68 - "safeLocalDestination"
Cohesion: 0.36
Nodes (8): safeLocalDestination(), authMessage(), ForgotPassword(), intendedDestination(), Login(), ProjectApp(), Signup(), supabaseAuthCallbackUrl()

### Community 69 - "bubble.tsx"
Cohesion: 0.38
Nodes (4): Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 72 - "tabs.tsx"
Cohesion: 0.33
Nodes (3): TabsList(), tabsListVariants, ref_base_ui_react_tabs

### Community 73 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, deploy:cloudflare, dev, migrate:legacy, start, test

### Community 74 - "measure-responsiveness.ts"
Cohesion: 0.38
Nodes (6): ref_node_perf_hooks, ws, median(), run(), Sample, wait()

### Community 75 - "main.tsx"
Cohesion: 0.29
Nodes (6): ref_react_dom_client, src_comic, App, ProjectApp, src_styles, clientAuthMode

### Community 76 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 77 - "ByokSetup.tsx"
Cohesion: 0.33
Nodes (6): AdvancedAISetup(), ByokSetup(), run(), Lease, request(), AIConnection

### Community 78 - "auth-config.ts"
Cohesion: 0.38
Nodes (6): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution

### Community 80 - "button-group.tsx"
Cohesion: 0.40
Nodes (3): ButtonGroup(), buttonGroupVariants, ref_components_ui_separator

### Community 82 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 85 - "zip.ts"
Cohesion: 0.50
Nodes (4): ProjectFile, crc32(), createZip(), table

### Community 88 - "oauth-callback.ts"
Cohesion: 0.50
Nodes (3): completeOAuthCallback(), OAuthCallbackOutcome, Callback()

### Community 89 - "request"
Cohesion: 0.50
Nodes (4): Projects(), request(), selectedId(), ShareProjectDialog()

## Knowledge Gaps
- **335 isolated node(s):** `InvitationDelivery`, `InvitationEmail`, `AuthenticatedUser`, `PlatformConfig`, `ProjectInviteSummary` (+330 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 790 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `menubar.tsx`, `sidebar.tsx`, `package.json`, `App.tsx`, `lucide-react`, `ProjectApp.tsx`, `breadcrumb.tsx`, `combobox.tsx`, `context-menu.tsx`, `drawer.tsx`, `ref_class_variance_authority`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `toast.tsx`, `ref_components_ui_button`, `command.tsx`, `field.tsx`, `item.tsx`, `attachment.tsx`, `dialog.tsx`, `input-group.tsx`, `select.tsx`, `sheet.tsx`, `pagination.tsx`, `avatar.tsx`, `card.tsx`, `popover.tsx`, `bubble.tsx`, `message.tsx`, `main.tsx`, `ByokSetup.tsx`, `alert.tsx`?**
  _High betweenness centrality (0.291) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `carousel.tsx`, `menubar.tsx`, `toast.tsx`, `sidebar.tsx`, `package.json`, `ref_components_ui_button`, `command.tsx`, `ByokSetup.tsx`, `pagination.tsx`, `App.tsx`, `dialog.tsx`, `ProjectApp.tsx`, `navigation-menu.tsx`, `select.tsx`, `sheet.tsx`, `breadcrumb.tsx`, `combobox.tsx`, `context-menu.tsx`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `yjs` connect `SupabasePlatform` to `provider-reconnect.test.ts`, `local-drafts.test.ts`, `live-collaboration-check.mjs`, `package.json`, `measure-responsiveness.ts`, `rooms.ts`, `App.tsx`, `ref_node_assert_strict`, `index.ts`, `event-store.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Are the 33 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 33 INFERRED edges - model-reasoned connections that need verification._
- **What connects `InvitationDelivery`, `InvitationEmail`, `AuthenticatedUser` to the rest of the system?**
  _335 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.08273748723186926 - nodes in this community are weakly interconnected._
- **Should `SupabasePlatform` be split into smaller, more focused modules?**
  _Cohesion score 0.0620253164556962 - nodes in this community are weakly interconnected._