# Graph Report - Devoffice  (2026-09-28)

## Corpus Check
- 170 files · ~207,770 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 4, .css 3, .log 2)

## Summary
- 1658 nodes · 2960 edges · 108 communities (75 shown, 33 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 94 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d1cd902a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- ref_node_assert_strict
- rules
- App.tsx
- sidebar.tsx
- ai-presets.ts
- providers.ts
- generator.ts
- components.json
- package.json
- dependencies
- compilerOptions
- combobox.tsx
- menubar.tsx
- context-menu.tsx
- tool-registry.ts
- drawer.tsx
- carousel.tsx
- Graphify Project Instructions
- alert-dialog.tsx
- chart.tsx
- item.tsx
- toast.tsx
- migrate-legacy-to-supabase.ts
- attachment.tsx
- field.tsx
- alert.tsx
- dialog.tsx
- ai-accounting.ts
- lucide-react
- navigation-menu.tsx
- select.tsx
- container.js
- RoomView
- local-drafts.test.ts
- index.ts
- devDependencies
- cocreate.test.ts
- command.tsx
- api
- CoCreate product brief
- avatar.tsx
- bubble.tsx
- input-group.tsx
- .ensureWorkflow
- ai-presets.test.ts
- CoCreate
- requirements.ts
- progress.tsx
- tabs.tsx
- .oxfmtrc.json
- scripts
- Four-Tile Modular Mark
- layout.tsx
- project.ts
- button-group.tsx
- types.ts
- breadcrumb.tsx
- rooms.ts
- message-scroller.tsx
- page.tsx
- collapsible.tsx
- ProjectApp.tsx
- CoCreate API reference
- ref_class_variance_authority
- event-store.test.ts
- CoCreate harness implementation checklist
- CoCreateProvider
- ref_lib_utils
- EventStore
- CoCreate context handoff
- Harness architecture
- event-store.ts
- Harness decision log
- CoCreate harness assessment
- Harness migration plan
- CoCreate AI coding instructions
- react
- providers.test.ts
- utils.ts
- requirements.test.ts
- direction.tsx
- managed-ai.test.ts
- pagination.tsx
- yjs
- live-collaboration-check.mjs
- live-browser-collaboration-check.mjs
- resizable.tsx
- Workspace
- popover.tsx
- connections-ui-smoke.mjs
- ref_node_path
- capture-auth-ui.mjs
- fetch
- Responsiveness evidence
- prisma7.config.ts
- vite
- model-evaluation.md
- ui-assets.md
- .mcp.json
- engines
- capture-overhaul.mjs

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 79 edges
2. `createCoCreateServer()` - 51 edges
3. `react` - 42 edges
4. `EventStore` - 39 edges
5. `Harness decision log` - 39 edges
6. `CoCreate harness implementation checklist` - 34 edges
7. `SupabasePlatform` - 30 edges
8. `registerProjectRoutes()` - 26 edges
9. `lucide-react` - 24 edges
10. `fail()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `Bounded context and cost target` --references--> `AIRunRecord`  [INFERRED]
  docs/harness/architecture.md → src/types.ts
- `Shared response models` --references--> `interpretation()`  [INFERRED]
  api.md → tests/requirements.test.ts
- `Shared response models` --references--> `Requirement`  [INFERRED]
  api.md → src/types.ts
- `Shared response models` --references--> `AIRunRecord`  [INFERRED]
  api.md → src/types.ts
- `Shared response models` --references--> `SafeAIConnection`  [INFERRED]
  api.md → src/types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Four-Tile Favicon Composition** — public_favicon_four_tile_mark, public_favicon_large_diagonal_tiles, public_favicon_small_diagonal_tiles, public_favicon_three_tone_blue_palette [EXTRACTED 1.00]

## Communities (108 total, 33 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.09
Nodes (19): Submission scheduling: current implementation and required hardening, ref_node_stream, catalogRate(), effortAllowance(), AIConfig, createCoCreateServer(), acceptedRequirementFingerprint(), hasOpenContradictions() (+11 more)

### Community 1 - "ref_node_assert_strict"
Cohesion: 0.16
Nodes (5): ref_node_assert_strict, ref_node_http, ref_node_test, needsSessionRefresh(), root

### Community 2 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 3 - "App.tsx"
Cohesion: 0.10
Nodes (18): BuildAccounting(), comparableMetrics(), effortChoices, FormatChoice, ManagedFundingView, ManagedModelView, modeChoices, ProviderChoice (+10 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.07
Nodes (12): Sidebar(), SidebarContext, SidebarContextProps, SidebarMenuButton(), sidebarMenuButtonVariants, SidebarRail(), SidebarTrigger(), useSidebar() (+4 more)

### Community 5 - "ai-presets.ts"
Cohesion: 0.11
Nodes (22): Named AI connections (preferred API), CatalogEntry, classifyTaskComplexity(), cost(), estimateLayerMaximum(), layer(), longContext, migrateLegacySpecialty() (+14 more)

### Community 6 - "providers.ts"
Cohesion: 0.08
Nodes (32): ref_node_async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+24 more)

### Community 7 - "generator.ts"
Cohesion: 0.09
Nodes (32): clean(), demoExtract(), demoOrchestrate(), shell(), AgentChange, boundedInput(), bundleSource(), callOpenAI() (+24 more)

### Community 8 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 9 - "package.json"
Cohesion: 0.07
Nodes (26): name, private, type, version, cross-env, pg, prisma, @prisma/adapter-pg (+18 more)

### Community 10 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, express, lucide-react, pg (+16 more)

### Community 11 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 13 - "menubar.tsx"
Cohesion: 0.06
Nodes (3): ref_base_ui_react_menu, ref_base_ui_react_menubar, ref_components_ui_dropdown_menu

### Community 15 - "tool-registry.ts"
Cohesion: 0.13
Nodes (14): bundleProject(), FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior (+6 more)

### Community 16 - "drawer.tsx"
Cohesion: 0.13
Nodes (5): DrawerContent(), DrawerContext, DrawerContextProps, useDrawer(), ref_base_ui_react_drawer

### Community 17 - "carousel.tsx"
Cohesion: 0.17
Nodes (13): CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions, CarouselPlugin (+5 more)

### Community 20 - "chart.tsx"
Cohesion: 0.19
Nodes (11): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION, THEMES (+3 more)

### Community 21 - "item.tsx"
Cohesion: 0.18
Nodes (4): Item(), ItemMedia(), itemMediaVariants, itemVariants

### Community 23 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.17
Nodes (10): ref_dotenv_config, apply, args, backup, client, dataArg, dataDir, mapping (+2 more)

### Community 24 - "attachment.tsx"
Cohesion: 0.20
Nodes (4): Attachment(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 25 - "field.tsx"
Cohesion: 0.17
Nodes (3): Field(), fieldVariants, ref_components_ui_label

### Community 27 - "dialog.tsx"
Cohesion: 0.07
Nodes (3): ref_base_ui_react_dialog, ref_components_ui_button, ref_react_day_picker

### Community 28 - "ai-accounting.ts"
Cohesion: 0.20
Nodes (15): aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, AIRate, AIRunCall (+7 more)

### Community 29 - "lucide-react"
Cohesion: 0.09
Nodes (5): NativeSelectProps, ref_base_ui_react_accordion, ref_base_ui_react_checkbox, ref_input_otp, lucide-react

### Community 30 - "navigation-menu.tsx"
Cohesion: 0.11
Nodes (5): EmptyMedia(), emptyMediaVariants, NavigationMenuTrigger(), navigationMenuTriggerStyle, ref_base_ui_react_navigation_menu

### Community 32 - "container.js"
Cohesion: 0.25
Nodes (4): @cloudflare/containers, ref_cloudflare_workers, baseEnv, CoCreateContainer

### Community 33 - "RoomView"
Cohesion: 0.25
Nodes (7): Rooms and sessions, Responsive delivery and synchronization, Acceptance tests, Collaborative contradiction-resolution plan, Server contracts, UI, RoomView

### Community 34 - "local-drafts.test.ts"
Cohesion: 0.20
Nodes (7): browserDraftStore, draftKey(), DraftStore, LocalDraftStatus, persistDraft(), restoreDraft(), merge()

### Community 35 - "index.ts"
Cohesion: 0.06
Nodes (45): express, ref_node_crypto, ref_node_url, ref_supabase_server_core, ws, b64(), createSession(), participantId() (+37 more)

### Community 36 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, prisma, tsx, @types/express, @types/node, @types/pg, @types/react, @types/react-dom (+3 more)

### Community 38 - "command.tsx"
Cohesion: 0.15
Nodes (3): ref_cmdk, ref_components_ui_dialog, ref_components_ui_input_group

### Community 39 - "api"
Cohesion: 0.17
Nodes (16): AdvancedAISetup(), AgentPanel(), changeEffort(), reinterpret(), send(), AISetup(), api(), dollars() (+8 more)

### Community 40 - "CoCreate product brief"
Cohesion: 0.14
Nodes (14): Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Authenticated saved projects (2026-09-24), CoCreate product brief, Historical workspace visual slice — 2026-09-28, Measures, Mission, Priorities (+6 more)

### Community 42 - "bubble.tsx"
Cohesion: 0.38
Nodes (4): Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 43 - "input-group.tsx"
Cohesion: 0.22
Nodes (6): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, ref_components_ui_input, ref_components_ui_textarea

### Community 44 - ".ensureWorkflow"
Cohesion: 0.23
Nodes (3): WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 45 - "ai-presets.test.ts"
Cohesion: 0.25
Nodes (9): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), effortLevels, AIWorkflowMode (+1 more)

### Community 46 - "CoCreate"
Cohesion: 0.29
Nodes (7): CoCreate HTML Shell, React Main Entry Point, Allowed Native Builds, CoCreate pnpm Workspace, CoCreate, Generated Project Sandbox, Provider Capability and Credential Security

### Community 47 - "requirements.ts"
Cohesion: 0.13
Nodes (30): acceptanceFor(), acceptedClassification(), alternativeSignature(), candidateEntries(), categories, classifications, classifyIntentText(), clean() (+22 more)

### Community 49 - "tabs.tsx"
Cohesion: 0.33
Nodes (3): TabsList(), tabsListVariants, ref_base_ui_react_tabs

### Community 50 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 51 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, deploy:cloudflare, dev, migrate:legacy, start, test

### Community 52 - "Four-Tile Modular Mark"
Cohesion: 0.33
Nodes (6): Application Identity, Four-Tile Modular Mark, Large Opposing Diagonal Tiles, Small Opposing Diagonal Tiles, Favicon SVG Icon, Three-Tone Blue Palette

### Community 53 - "layout.tsx"
Cohesion: 0.20
Nodes (7): app_globals, geistMono, geistSans, metadata, nextConfig, ref_next, ref_next_font_google

### Community 54 - "project.ts"
Cohesion: 0.13
Nodes (19): esbuild, ref_node_module, ref_node_path_posix, allowedExtensions, applyOperations(), downloadableFiles(), generatedRoot, infrastructureFiles (+11 more)

### Community 55 - "button-group.tsx"
Cohesion: 0.40
Nodes (3): ButtonGroup(), buttonGroupVariants, ref_components_ui_separator

### Community 56 - "types.ts"
Cohesion: 0.11
Nodes (21): Shared response models, Migration, AgentStatus, AIConnection, AIRateTier, AIRoutingEvidenceStatus, AIUsage, CapabilityCheck (+13 more)

### Community 57 - "breadcrumb.tsx"
Cohesion: 0.14
Nodes (6): Badge(), badgeVariants, Marker(), markerVariants, ref_base_ui_react_merge_props, ref_base_ui_react_use_render

### Community 58 - "rooms.ts"
Cohesion: 0.09
Nodes (23): decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), ProviderAccountingError, AISettings, BudgetReservation, BudgetWindow (+15 more)

### Community 62 - "ProjectApp.tsx"
Cohesion: 0.05
Nodes (42): ref_react_dom_client, @supabase/supabase-js, legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), safeLocalDestination(), SupabaseAuthConfig (+34 more)

### Community 63 - "CoCreate API reference"
Cohesion: 0.17
Nodes (12): Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, CoCreate API reference, Durable workflow projection, Historical hosted managed AI, Legacy AI routes (currently retained) (+4 more)

### Community 64 - "ref_class_variance_authority"
Cohesion: 0.16
Nodes (10): Button(), buttonVariants, ToggleGroupContext, Toggle(), toggleVariants, ref_base_ui_react_button, ref_base_ui_react_toggle, ref_base_ui_react_toggle_group (+2 more)

### Community 65 - "event-store.test.ts"
Cohesion: 0.18
Nodes (8): ref_node_fs, ref_node_os, ref_node_sqlite, browser, outputDir, profile, browser, profile

### Community 66 - "CoCreate harness implementation checklist"
Cohesion: 0.06
Nodes (33): BYOK-only MVP slice (2026-09-28), CoCreate harness implementation checklist, Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27, Draggable effort toggle and visible project naming (2026-09-25), Email invitations, complete auth, project names, and segmented effort (2026-09-25) (+25 more)

### Community 68 - "ref_lib_utils"
Cohesion: 0.06
Nodes (8): ref_base_ui_react_preview_card, ref_base_ui_react_radio, ref_base_ui_react_radio_group, ref_base_ui_react_separator, ref_base_ui_react_slider, ref_base_ui_react_switch, ref_base_ui_react_tooltip, ref_lib_utils

### Community 70 - "CoCreate context handoff"
Cohesion: 0.12
Nodes (16): 2026-09-24 — Supabase project transition, CoCreate context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27, Historical validation (reported by the implementation slice) (+8 more)

### Community 71 - "Harness architecture"
Cohesion: 0.12
Nodes (17): Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Bounded context and cost target, Browser recovery and transport batching — 2026-09-28, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary, Execution flow (+9 more)

### Community 72 - "event-store.ts"
Cohesion: 0.13
Nodes (12): ActorType, EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow (+4 more)

### Community 73 - "Harness decision log"
Cohesion: 0.05
Nodes (39): D-0001 — Preserve the existing application while migrating additively, D-0002 — Personal interpretations are proposals, not builder authority, D-0003 — Build from the accepted registry, not the raw canvas, D-0004 — Deletion is not withdrawal, D-0005 — Pause on consequential accepted contradictions, D-0006 — Conflict groups and explicit affected-contributor agreement, D-0007 — Classify per intent and reprocess only by explicit participant action, D-0008 — Submit intent explicitly; collaborate continuously (+31 more)

### Community 74 - "CoCreate harness assessment"
Cohesion: 0.33
Nodes (5): CoCreate harness assessment, Existing capabilities preserved, First vertical slice selected, Material gaps found, Second verified slice — shared intent

### Community 75 - "Harness migration plan"
Cohesion: 0.40
Nodes (4): Harness migration plan, Later migrations, Rollback, Safe rollout

### Community 76 - "CoCreate AI coding instructions"
Cohesion: 0.15
Nodes (13): Active hosted AI boundary (2026-09-28), Agent and state rules, CoCreate AI coding instructions, Coding conventions, Documentation maintenance in the same change, Existing stack and boundaries, Local draft and visual invariants (2026-09-28), Preserve the workflow-first, submission-first contract (+5 more)

### Community 77 - "react"
Cohesion: 0.09
Nodes (3): ref_base_ui_react_input, ref_base_ui_react_scroll_area, react

### Community 78 - "providers.test.ts"
Cohesion: 0.24
Nodes (8): testOpenAIConnection(), adapterFor(), discoverModels(), generateText(), ProviderConfig, withProviderAccounting(), ProviderRequestRecord, schema

### Community 81 - "requirements.test.ts"
Cohesion: 0.29
Nodes (7): acceptedRequirements(), blockedRequirementIds(), eligibleRequirements(), submitConflictSelection(), InterpretationClassification, Requirement, interpretation()

### Community 86 - "managed-ai.test.ts"
Cohesion: 0.10
Nodes (19): [command,file], BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases, MANAGED_CATALOG_SOURCE (+11 more)

### Community 89 - "yjs"
Cohesion: 0.17
Nodes (7): ref_y_protocols_awareness, yjs, ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), FakeWebSocket

### Community 90 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 91 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 93 - "Workspace"
Cohesion: 0.27
Nodes (10): tokenParticipant(), Workspace(), ariaShortcut(), BUILD_SHORTCUT_STORAGE_KEY, BuildShortcutPreference, defaultBuildShortcut(), isBuildShortcut(), readBuildShortcut() (+2 more)

### Community 97 - "connections-ui-smoke.mjs"
Cohesion: 0.22
Nodes (7): ref_node_child_process, browser, profile, provider, browser, profile, roomId

### Community 98 - "ref_node_path"
Cohesion: 0.32
Nodes (7): ref_node_fs_promises, ref_node_path, ref_node_perf_hooks, median(), run(), Sample, wait()

### Community 99 - "capture-auth-ui.mjs"
Cohesion: 0.40
Nodes (3): browser, output, profile

### Community 103 - "fetch"
Cohesion: 0.67
Nodes (3): Collaboration connection lifecycle, Cloudflare availability and collaboration repair evidence (2026-09-18), fetch()

### Community 112 - "capture-overhaul.mjs"
Cohesion: 0.40
Nodes (3): browser, outputDir, profile

## Knowledge Gaps
- **469 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+464 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 927 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `App.tsx`, `sidebar.tsx`, `package.json`, `combobox.tsx`, `menubar.tsx`, `context-menu.tsx`, `drawer.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `item.tsx`, `toast.tsx`, `attachment.tsx`, `field.tsx`, `alert.tsx`, `dialog.tsx`, `lucide-react`, `select.tsx`, `command.tsx`, `avatar.tsx`, `bubble.tsx`, `input-group.tsx`, `breadcrumb.tsx`, `message-scroller.tsx`, `ProjectApp.tsx`, `ref_class_variance_authority`, `message.tsx`, `pagination.tsx`, `table.tsx`, `popover.tsx`?**
  _High betweenness centrality (0.284) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `App.tsx`, `sidebar.tsx`, `command.tsx`, `message-scroller.tsx`, `package.json`, `combobox.tsx`, `menubar.tsx`, `context-menu.tsx`, `carousel.tsx`, `toast.tsx`, `pagination.tsx`, `ProjectApp.tsx`, `breadcrumb.tsx`, `dialog.tsx`, `navigation-menu.tsx`, `select.tsx`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `CoCreate API reference` connect `CoCreate API reference` to `context.md`, `RoomView`, `types.ts`, `ai-presets.ts`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Are the 31 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 31 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _469 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.08691910499139414 - nodes in this community are weakly interconnected._
- **Should `rules` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._