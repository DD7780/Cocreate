# Graph Report - Devoffice  (2026-09-29)

## Corpus Check
- 174 files · ~133,964 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 6, .css 2, .example 1)

## Summary
- 1654 nodes · 2948 edges · 115 communities (79 shown, 36 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 97 edges (avg confidence: 0.85)
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
- Structural and Semantic Extraction Pipeline
- alert-dialog.tsx
- chart.tsx
- item.tsx
- toast.tsx
- providers.test.ts
- attachment.tsx
- field.tsx
- alert.tsx
- sheet.tsx
- lucide-react
- navigation-menu.tsx
- select.tsx
- container.js
- RoomView
- intent-classification.test.ts
- index.ts
- devDependencies
- ai-evaluation.ts
- command.tsx
- CoCreate product brief
- avatar.tsx
- bubble.tsx
- pagination.tsx
- empty.tsx
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
- tooltip.tsx
- page.tsx
- collapsible.tsx
- ProjectApp.tsx
- CoCreate API reference
- ref_class_variance_authority
- ai-presets.test.ts
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
- supabase.ts
- utils.ts
- cocreate.test.ts
- direction.tsx
- live-browser-collaboration-check.mjs
- managed-ai.test.ts
- ai-accounting.ts
- api
- provider-reconnect.test.ts
- live-collaboration-check.mjs
- migrate-legacy-to-supabase.ts
- .ensureWorkflow
- Workspace
- input-group.tsx
- ByokSetup.tsx
- popover.tsx
- safeLocalDestination
- measure-responsiveness.ts
- auth-config.ts
- request
- input-otp.tsx
- oauth-callback.ts
- fetch
- Responsiveness evidence
- prisma7.config.ts
- vite
- model-evaluation.md
- ui-assets.md
- .mcp.json
- engines
- hover-card.tsx
- radio-group.tsx
- .activityForWorkspace

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 81 edges
2. `createCoCreateServer()` - 52 edges
3. `react` - 43 edges
4. `EventStore` - 40 edges
5. `Harness decision log` - 39 edges
6. `CoCreate harness implementation checklist` - 34 edges
7. `SupabasePlatform` - 30 edges
8. `registerProjectRoutes()` - 26 edges
9. `lucide-react` - 25 edges
10. `fail()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `Bounded context and cost target` --references--> `AIRunRecord`  [INFERRED]
  docs/harness/architecture.md → src/types.ts
- `Shared response models` --references--> `Requirement`  [INFERRED]
  api.md → src/types.ts
- `Shared response models` --references--> `AIRunRecord`  [INFERRED]
  api.md → src/types.ts
- `Shared response models` --references--> `SafeAIConnection`  [INFERRED]
  api.md → src/types.ts
- `Shared response models` --references--> `AISetupPolicy`  [INFERRED]
  api.md → src/types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Operational Pipeline** — _codex_skills_graphify_skill_extraction_pipeline, _codex_skills_graphify_references_update_incremental_update, _codex_skills_graphify_references_query_query_navigation [EXTRACTED 1.00]
- **Four-Tile Favicon Composition** — public_favicon_four_tile_mark, public_favicon_large_diagonal_tiles, public_favicon_small_diagonal_tiles, public_favicon_three_tone_blue_palette [EXTRACTED 1.00]

## Communities (115 total, 36 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.09
Nodes (17): Submission scheduling: current implementation and required hardening, ref_node_stream, catalogRate(), effortAllowance(), AIConfig, createCoCreateServer(), hasOpenContradictions(), buildFingerprint() (+9 more)

### Community 1 - "ref_node_assert_strict"
Cohesion: 0.13
Nodes (7): ref_node_assert_strict, ref_node_http, ref_node_test, yjs, browser, profile, provider

### Community 2 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 3 - "App.tsx"
Cohesion: 0.11
Nodes (16): BuildAccounting(), comparableMetrics(), effortChoices, FormatChoice, ManagedFundingView, ManagedModelView, modeChoices, ProviderChoice (+8 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.07
Nodes (12): Sidebar(), SidebarContext, SidebarContextProps, SidebarMenuButton(), sidebarMenuButtonVariants, SidebarRail(), SidebarTrigger(), useSidebar() (+4 more)

### Community 5 - "ai-presets.ts"
Cohesion: 0.12
Nodes (20): CatalogEntry, classifyTaskComplexity(), cost(), effortLevels, estimateLayerMaximum(), layer(), longContext, migrateLegacySpecialty() (+12 more)

### Community 6 - "providers.ts"
Cohesion: 0.08
Nodes (32): ref_node_async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+24 more)

### Community 7 - "generator.ts"
Cohesion: 0.09
Nodes (29): clean(), demoExtract(), demoOrchestrate(), shell(), AgentChange, boundedInput(), bundleSource(), callOpenAI() (+21 more)

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
Cohesion: 0.12
Nodes (15): ActorType, bundleProject(), FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable() (+7 more)

### Community 16 - "drawer.tsx"
Cohesion: 0.13
Nodes (5): DrawerContent(), DrawerContext, DrawerContextProps, useDrawer(), ref_base_ui_react_drawer

### Community 17 - "carousel.tsx"
Cohesion: 0.17
Nodes (13): CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions, CarouselPlugin (+5 more)

### Community 18 - "Structural and Semantic Extraction Pipeline"
Cohesion: 0.15
Nodes (13): URL Ingestion and Folder Watch, Optional Graph Exports, Semantic Extraction Contract, GitHub and Cross-Repository Merge, Automatic Graph Hooks, Constrained Query Navigation, Graph Work Memory, Whisper Media Transcription (+5 more)

### Community 20 - "chart.tsx"
Cohesion: 0.19
Nodes (11): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION, THEMES (+3 more)

### Community 21 - "item.tsx"
Cohesion: 0.18
Nodes (4): Item(), ItemMedia(), itemMediaVariants, itemVariants

### Community 23 - "providers.test.ts"
Cohesion: 0.24
Nodes (8): testOpenAIConnection(), adapterFor(), discoverModels(), generateText(), ProviderConfig, withProviderAccounting(), ProviderRequestRecord, schema

### Community 24 - "attachment.tsx"
Cohesion: 0.20
Nodes (4): Attachment(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 25 - "field.tsx"
Cohesion: 0.17
Nodes (3): Field(), fieldVariants, ref_components_ui_label

### Community 29 - "lucide-react"
Cohesion: 0.12
Nodes (4): NativeSelectProps, ref_base_ui_react_accordion, ref_base_ui_react_checkbox, lucide-react

### Community 30 - "navigation-menu.tsx"
Cohesion: 0.20
Nodes (3): NavigationMenuTrigger(), navigationMenuTriggerStyle, ref_base_ui_react_navigation_menu

### Community 32 - "container.js"
Cohesion: 0.25
Nodes (4): @cloudflare/containers, ref_cloudflare_workers, baseEnv, CoCreateContainer

### Community 33 - "RoomView"
Cohesion: 0.25
Nodes (7): Rooms and sessions, Responsive delivery and synchronization, Acceptance tests, Collaborative contradiction-resolution plan, Server contracts, UI, RoomView

### Community 34 - "intent-classification.test.ts"
Cohesion: 0.27
Nodes (10): candidateEntries(), classifyIntentText(), clean(), contradictionSignature(), intentId(), normalized(), normalizeInterpretation(), scopedClaim() (+2 more)

### Community 35 - "index.ts"
Cohesion: 0.06
Nodes (45): express, ref_node_crypto, ref_node_url, ref_supabase_server_core, ws, b64(), createSession(), participantId() (+37 more)

### Community 36 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, prisma, tsx, @types/express, @types/node, @types/pg, @types/react, @types/react-dom (+3 more)

### Community 37 - "ai-evaluation.ts"
Cohesion: 0.29
Nodes (7): EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), AIWorkflowMode

### Community 38 - "command.tsx"
Cohesion: 0.15
Nodes (3): ref_cmdk, ref_components_ui_dialog, ref_components_ui_input_group

### Community 40 - "CoCreate product brief"
Cohesion: 0.14
Nodes (14): Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Authenticated saved projects (2026-09-24), CoCreate product brief, Historical workspace visual slice — 2026-09-28, Measures, Mission, Priorities (+6 more)

### Community 42 - "bubble.tsx"
Cohesion: 0.38
Nodes (4): Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 44 - "pagination.tsx"
Cohesion: 0.09
Nodes (4): PaginationLinkProps, ref_components_ui_button, ref_react_day_picker, ref_shadcn_react_message_scroller

### Community 46 - "CoCreate"
Cohesion: 0.29
Nodes (7): CoCreate HTML Shell, React Main Entry Point, Allowed Native Builds, CoCreate pnpm Workspace, CoCreate, Generated Project Sandbox, Provider Capability and Credential Security

### Community 47 - "requirements.ts"
Cohesion: 0.16
Nodes (23): acceptanceFor(), acceptedClassification(), acceptedRequirementFingerprint(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), categories, classifications (+15 more)

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
Cohesion: 0.09
Nodes (26): Shared response models, Migration, AgentStatus, AIRate, AIRateTier, AIRoutingEvidenceStatus, AIUsage, CapabilityCheck (+18 more)

### Community 57 - "breadcrumb.tsx"
Cohesion: 0.14
Nodes (6): Badge(), badgeVariants, Marker(), markerVariants, ref_base_ui_react_merge_props, ref_base_ui_react_use_render

### Community 58 - "rooms.ts"
Cohesion: 0.09
Nodes (23): decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), ProviderAccountingError, AISettings, BudgetReservation, BudgetWindow (+15 more)

### Community 62 - "ProjectApp.tsx"
Cohesion: 0.09
Nodes (9): InviteResult, PendingInvite, Project, ProjectList, ProjectMember, ProjectRole, ShareState, Workspace (+1 more)

### Community 63 - "CoCreate API reference"
Cohesion: 0.13
Nodes (15): Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, CoCreate API reference, Durable workflow projection, Historical hosted managed AI, Legacy AI routes (currently retained) (+7 more)

### Community 64 - "ref_class_variance_authority"
Cohesion: 0.16
Nodes (10): Button(), buttonVariants, ToggleGroupContext, Toggle(), toggleVariants, ref_base_ui_react_button, ref_base_ui_react_toggle, ref_base_ui_react_toggle_group (+2 more)

### Community 65 - "ai-presets.test.ts"
Cohesion: 0.12
Nodes (17): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, browser, output, profile, browser (+9 more)

### Community 66 - "CoCreate harness implementation checklist"
Cohesion: 0.06
Nodes (33): BYOK-only MVP slice (2026-09-28), CoCreate harness implementation checklist, Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27, Draggable effort toggle and visible project naming (2026-09-25), Email invitations, complete auth, project names, and segmented effort (2026-09-25) (+25 more)

### Community 68 - "ref_lib_utils"
Cohesion: 0.09
Nodes (5): ref_base_ui_react_separator, ref_base_ui_react_slider, ref_base_ui_react_switch, ref_lib_utils, ref_react_resizable_panels

### Community 70 - "CoCreate context handoff"
Cohesion: 0.12
Nodes (16): 2026-09-24 — Supabase project transition, CoCreate context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27, Historical validation (reported by the implementation slice) (+8 more)

### Community 71 - "Harness architecture"
Cohesion: 0.12
Nodes (17): Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Bounded context and cost target, Browser recovery prototype and transport batching — 2026-09-28, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary, Execution flow (+9 more)

### Community 72 - "event-store.ts"
Cohesion: 0.17
Nodes (11): ref_node_sqlite, EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow (+3 more)

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

### Community 78 - "supabase.ts"
Cohesion: 0.17
Nodes (11): ref_react_dom_client, App, ProjectApp, src_styles, authReturnKey, clientAuthMode, resolved, supabase (+3 more)

### Community 81 - "cocreate.test.ts"
Cohesion: 0.36
Nodes (6): listProviderModels(), providerConfig(), validateBaseUrl(), keepLastSuccess(), shouldPromoteRevision(), validateProviderUrl()

### Community 85 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 86 - "managed-ai.test.ts"
Cohesion: 0.10
Nodes (19): [command,file], BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases, MANAGED_CATALOG_SOURCE (+11 more)

### Community 87 - "ai-accounting.ts"
Cohesion: 0.21
Nodes (14): aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, AIRunCall, AIRunRecord (+6 more)

### Community 88 - "api"
Cohesion: 0.20
Nodes (14): AgentPanel(), changeEffort(), reinterpret(), send(), AISetup(), api(), dollars(), HostedAISetup() (+6 more)

### Community 89 - "provider-reconnect.test.ts"
Cohesion: 0.17
Nodes (6): ref_y_protocols_awareness, ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), FakeWebSocket

### Community 90 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 91 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.15
Nodes (11): ref_dotenv_config, @supabase/supabase-js, apply, args, backup, client, dataArg, dataDir (+3 more)

### Community 92 - ".ensureWorkflow"
Cohesion: 0.23
Nodes (3): WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 93 - "Workspace"
Cohesion: 0.27
Nodes (10): tokenParticipant(), Workspace(), ariaShortcut(), BUILD_SHORTCUT_STORAGE_KEY, BuildShortcutPreference, defaultBuildShortcut(), isBuildShortcut(), readBuildShortcut() (+2 more)

### Community 94 - "input-group.tsx"
Cohesion: 0.22
Nodes (6): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, ref_components_ui_input, ref_components_ui_textarea

### Community 95 - "ByokSetup.tsx"
Cohesion: 0.33
Nodes (6): AdvancedAISetup(), ByokSetup(), run(), Lease, request(), AIConnection

### Community 97 - "safeLocalDestination"
Cohesion: 0.36
Nodes (8): safeLocalDestination(), authMessage(), ForgotPassword(), intendedDestination(), Login(), ProjectApp(), Signup(), supabaseAuthCallbackUrl()

### Community 98 - "measure-responsiveness.ts"
Cohesion: 0.38
Nodes (6): ref_node_fs_promises, ref_node_perf_hooks, median(), run(), Sample, wait()

### Community 99 - "auth-config.ts"
Cohesion: 0.38
Nodes (6): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution

### Community 100 - "request"
Cohesion: 0.33
Nodes (5): needsSessionRefresh(), Projects(), request(), selectedId(), ShareProjectDialog()

### Community 102 - "oauth-callback.ts"
Cohesion: 0.50
Nodes (3): completeOAuthCallback(), OAuthCallbackOutcome, Callback()

### Community 103 - "fetch"
Cohesion: 0.67
Nodes (3): Collaboration connection lifecycle, Cloudflare availability and collaboration repair evidence (2026-09-18), fetch()

## Knowledge Gaps
- **467 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+462 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 926 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `App.tsx`, `sidebar.tsx`, `package.json`, `combobox.tsx`, `menubar.tsx`, `context-menu.tsx`, `drawer.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `item.tsx`, `toast.tsx`, `attachment.tsx`, `field.tsx`, `alert.tsx`, `dialog.tsx`, `sheet.tsx`, `lucide-react`, `select.tsx`, `command.tsx`, `card.tsx`, `avatar.tsx`, `bubble.tsx`, `message.tsx`, `pagination.tsx`, `breadcrumb.tsx`, `ProjectApp.tsx`, `ref_class_variance_authority`, `supabase.ts`, `input-group.tsx`, `ByokSetup.tsx`, `popover.tsx`, `input-otp.tsx`?**
  _High betweenness centrality (0.293) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `App.tsx`, `sidebar.tsx`, `input-otp.tsx`, `command.tsx`, `package.json`, `pagination.tsx`, `combobox.tsx`, `context-menu.tsx`, `menubar.tsx`, `carousel.tsx`, `toast.tsx`, `ByokSetup.tsx`, `ProjectApp.tsx`, `breadcrumb.tsx`, `dialog.tsx`, `sheet.tsx`, `navigation-menu.tsx`, `select.tsx`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `CoCreate API reference` connect `CoCreate API reference` to `context.md`, `RoomView`, `types.ts`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Are the 32 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 32 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _467 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.09080223332353805 - nodes in this community are weakly interconnected._
- **Should `ref_node_assert_strict` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._