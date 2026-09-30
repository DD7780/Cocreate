# Graph Report - Devoffice  (2026-09-30)

## Corpus Check
- 178 files · ~212,560 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 4, .log 4, .css 3)

## Summary
- 1705 nodes · 3100 edges · 104 communities (68 shown, 36 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 99 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c82d4e62`
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
- ref_node_fs
- attachment.tsx
- field.tsx
- alert.tsx
- dialog.tsx
- supabase.ts
- lucide-react
- navigation-menu.tsx
- select.tsx
- command.tsx
- input-group.tsx
- index.ts
- devDependencies
- empty.tsx
- dropdown-menu.tsx
- usage-ledger.test.ts
- 2guys1canvas product brief
- avatar.tsx
- safeLocalDestination
- local-drafts.test.ts
- Workspace
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
- migrate-legacy-to-supabase.ts
- page.tsx
- collapsible.tsx
- ProjectApp.tsx
- bubble.tsx
- ref_class_variance_authority
- verify-conflict-ui.ts
- 2guys1canvas harness implementation checklist
- CoCreateProvider
- ref_lib_utils
- EventStore
- 2guys1canvas context handoff
- Harness architecture
- auth-config.ts
- Harness decision log
- CoCreate harness assessment
- Harness migration plan
- 2guys1canvas AI coding instructions
- react
- request
- utils.ts
- tooltip.tsx
- direction.tsx
- live-browser-collaboration-check.mjs
- managed-ai.test.ts
- pagination.tsx
- yjs
- live-collaboration-check.mjs
- Collaborative contradiction-resolution plan
- resizable.tsx
- oauth-callback.ts
- prisma7.config.ts
- cocreate.test.ts
- popover.tsx
- vite
- engines
- Responsiveness evidence
- model-evaluation.md
- ui-assets.md
- .mcp.json

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 83 edges
2. `createCoCreateServer()` - 55 edges
3. `Harness decision log` - 44 edges
4. `react` - 42 edges
5. `EventStore` - 42 edges
6. `2guys1canvas harness implementation checklist` - 36 edges
7. `SupabasePlatform` - 34 edges
8. `registerProjectRoutes()` - 30 edges
9. `lucide-react` - 24 edges
10. `fail()` - 24 edges

## Surprising Connections (you probably didn't know these)
- `Shared response models` --references--> `Requirement`  [INFERRED]
  api.md → src/types.ts
- `Shared response models` --references--> `AIRunRecord`  [INFERRED]
  api.md → src/types.ts
- `Bounded context and cost target` --references--> `AIRunRecord`  [INFERRED]
  docs/harness/architecture.md → src/types.ts
- `Shared response models` --references--> `SafeAIConnection`  [INFERRED]
  api.md → src/types.ts
- `Shared response models` --references--> `AIRate`  [INFERRED]
  api.md → src/types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Four-Tile Favicon Composition** — public_favicon_four_tile_mark, public_favicon_large_diagonal_tiles, public_favicon_small_diagonal_tiles, public_favicon_three_tone_blue_palette [EXTRACTED 1.00]

## Communities (104 total, 36 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.09
Nodes (19): Submission scheduling: current implementation and required hardening, ref_node_stream, calculateCharge(), catalogRate(), effortAllowance(), AIConfig, listProviderModels(), createCoCreateServer() (+11 more)

### Community 2 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 3 - "App.tsx"
Cohesion: 0.08
Nodes (35): AdvancedAISetup(), AgentPanel(), changeEffort(), reinterpret(), send(), AISetup(), api(), BuildAccounting() (+27 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.07
Nodes (12): Sidebar(), SidebarContext, SidebarContextProps, SidebarMenuButton(), sidebarMenuButtonVariants, SidebarRail(), SidebarTrigger(), useSidebar() (+4 more)

### Community 5 - "ai-presets.ts"
Cohesion: 0.06
Nodes (46): Named AI connections (preferred API), Bounded context and cost target, aggregateCalls(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, EVALUATION_PROTOCOL_VERSION (+38 more)

### Community 6 - "providers.ts"
Cohesion: 0.07
Nodes (36): ref_node_async_hooks, accounting, adapterFor(), adapters, anthropic, balancedObject(), bearer(), classify() (+28 more)

### Community 7 - "generator.ts"
Cohesion: 0.08
Nodes (34): clean(), demoExtract(), demoOrchestrate(), shell(), AgentChange, boundedInput(), bundleSource(), callOpenAI() (+26 more)

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

### Community 15 - "tool-registry.ts"
Cohesion: 0.12
Nodes (15): ActorType, bundleProject(), FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable() (+7 more)

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

### Community 23 - "ref_node_fs"
Cohesion: 0.08
Nodes (25): ref_node_child_process, ref_node_fs, ref_node_http, ref_node_os, ref_node_path, browser, output, profile (+17 more)

### Community 24 - "attachment.tsx"
Cohesion: 0.20
Nodes (4): Attachment(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 25 - "field.tsx"
Cohesion: 0.17
Nodes (3): Field(), fieldVariants, ref_components_ui_label

### Community 28 - "supabase.ts"
Cohesion: 0.15
Nodes (12): ref_react_dom_client, src_comic, App, ProjectApp, src_styles, authReturnKey, clientAuthMode, resolved (+4 more)

### Community 29 - "lucide-react"
Cohesion: 0.11
Nodes (4): ref_base_ui_react_accordion, ref_base_ui_react_checkbox, ref_input_otp, lucide-react

### Community 30 - "navigation-menu.tsx"
Cohesion: 0.20
Nodes (3): NavigationMenuTrigger(), navigationMenuTriggerStyle, ref_base_ui_react_navigation_menu

### Community 32 - "command.tsx"
Cohesion: 0.15
Nodes (3): ref_cmdk, ref_components_ui_dialog, ref_components_ui_input_group

### Community 34 - "input-group.tsx"
Cohesion: 0.22
Nodes (6): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, ref_components_ui_input, ref_components_ui_textarea

### Community 35 - "index.ts"
Cohesion: 0.05
Nodes (52): express, ref_node_crypto, ref_node_url, ref_supabase_server_core, ws, b64(), createSession(), participantId() (+44 more)

### Community 36 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, prisma, tsx, @types/express, @types/node, @types/pg, @types/react, @types/react-dom (+3 more)

### Community 39 - "usage-ledger.test.ts"
Cohesion: 0.32
Nodes (5): aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes, AIUsage

### Community 40 - "2guys1canvas product brief"
Cohesion: 0.13
Nodes (15): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Historical workspace visual slice — 2026-09-28, Measures, Mission (+7 more)

### Community 43 - "safeLocalDestination"
Cohesion: 0.36
Nodes (8): safeLocalDestination(), authMessage(), ForgotPassword(), intendedDestination(), Login(), ProjectApp(), Signup(), supabaseAuthCallbackUrl()

### Community 44 - "local-drafts.test.ts"
Cohesion: 0.20
Nodes (7): browserDraftStore, draftKey(), DraftStore, LocalDraftStatus, persistDraft(), restoreDraft(), merge()

### Community 45 - "Workspace"
Cohesion: 0.27
Nodes (10): tokenParticipant(), Workspace(), ariaShortcut(), BUILD_SHORTCUT_STORAGE_KEY, BuildShortcutPreference, defaultBuildShortcut(), isBuildShortcut(), readBuildShortcut() (+2 more)

### Community 46 - "CoCreate"
Cohesion: 0.29
Nodes (7): CoCreate HTML Shell, React Main Entry Point, Allowed Native Builds, CoCreate pnpm Workspace, CoCreate, Generated Project Sandbox, Provider Capability and Credential Security

### Community 47 - "requirements.ts"
Cohesion: 0.13
Nodes (33): acceptanceFor(), acceptedClassification(), acceptedRequirementFingerprint(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries(), categories (+25 more)

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
Cohesion: 0.08
Nodes (26): Shared response models, Migration, AgentStatus, AIConnection, AIRateTier, AIRoutingEvidenceStatus, CapabilityCheck, ConflictAlternative (+18 more)

### Community 57 - "breadcrumb.tsx"
Cohesion: 0.14
Nodes (6): Badge(), badgeVariants, Marker(), markerVariants, ref_base_ui_react_merge_props, ref_base_ui_react_use_render

### Community 58 - "rooms.ts"
Cohesion: 0.09
Nodes (20): ProviderAccountingError, AISettings, BudgetReservation, BudgetWindow, ClientSocket, colors, defaultDataDir, DurableStore (+12 more)

### Community 59 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.15
Nodes (11): ref_dotenv_config, @supabase/supabase-js, apply, args, backup, client, dataArg, dataDir (+3 more)

### Community 62 - "ProjectApp.tsx"
Cohesion: 0.09
Nodes (9): InviteResult, PendingInvite, Project, ProjectList, ProjectMember, ProjectRole, ShareState, Workspace (+1 more)

### Community 63 - "bubble.tsx"
Cohesion: 0.38
Nodes (4): Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 64 - "ref_class_variance_authority"
Cohesion: 0.16
Nodes (10): Button(), buttonVariants, ToggleGroupContext, Toggle(), toggleVariants, ref_base_ui_react_button, ref_base_ui_react_toggle, ref_base_ui_react_toggle_group (+2 more)

### Community 65 - "verify-conflict-ui.ts"
Cohesion: 0.29
Nodes (6): browser, dataDir, group, profile, room, token

### Community 66 - "2guys1canvas harness implementation checklist"
Cohesion: 0.04
Nodes (42): Collaboration connection lifecycle, 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27 (+34 more)

### Community 68 - "ref_lib_utils"
Cohesion: 0.07
Nodes (7): ref_base_ui_react_preview_card, ref_base_ui_react_radio, ref_base_ui_react_radio_group, ref_base_ui_react_separator, ref_base_ui_react_slider, ref_base_ui_react_switch, ref_lib_utils

### Community 69 - "EventStore"
Cohesion: 0.07
Nodes (16): ref_node_sqlite, EventInput, EventStore, json(), redact(), RunState, StoredEvent, StoredRun (+8 more)

### Community 70 - "2guys1canvas context handoff"
Cohesion: 0.12
Nodes (17): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+9 more)

### Community 71 - "Harness architecture"
Cohesion: 0.06
Nodes (36): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+28 more)

### Community 72 - "auth-config.ts"
Cohesion: 0.38
Nodes (6): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution

### Community 73 - "Harness decision log"
Cohesion: 0.05
Nodes (44): D-0001 — Preserve the existing application while migrating additively, D-0002 — Personal interpretations are proposals, not builder authority, D-0003 — Build from the accepted registry, not the raw canvas, D-0004 — Deletion is not withdrawal, D-0005 — Pause on consequential accepted contradictions, D-0006 — Conflict groups and explicit affected-contributor agreement, D-0007 — Classify per intent and reprocess only by explicit participant action, D-0008 — Submit intent explicitly; collaborate continuously (+36 more)

### Community 74 - "CoCreate harness assessment"
Cohesion: 0.33
Nodes (5): CoCreate harness assessment, Existing capabilities preserved, First vertical slice selected, Material gaps found, Second verified slice — shared intent

### Community 75 - "Harness migration plan"
Cohesion: 0.40
Nodes (4): Harness migration plan, Later migrations, Rollback, Safe rollout

### Community 76 - "2guys1canvas AI coding instructions"
Cohesion: 0.14
Nodes (14): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change, Existing stack and boundaries, Local draft and visual invariants (2026-09-28) (+6 more)

### Community 77 - "react"
Cohesion: 0.11
Nodes (4): NativeSelectProps, ref_base_ui_react_input, ref_base_ui_react_scroll_area, react

### Community 78 - "request"
Cohesion: 0.33
Nodes (5): needsSessionRefresh(), Projects(), request(), selectedId(), ShareProjectDialog()

### Community 85 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 86 - "managed-ai.test.ts"
Cohesion: 0.08
Nodes (25): ref_node_fs_promises, ref_node_perf_hooks, [command,file], median(), run(), Sample, wait(), BYOK_LEASE_MS (+17 more)

### Community 87 - "pagination.tsx"
Cohesion: 0.09
Nodes (4): PaginationLinkProps, ref_components_ui_button, ref_react_day_picker, ref_shadcn_react_message_scroller

### Community 89 - "yjs"
Cohesion: 0.13
Nodes (7): ref_y_protocols_awareness, yjs, ConnectionStatus, ProviderDependencies, providerInternals, retryDelay(), FakeWebSocket

### Community 90 - "live-collaboration-check.mjs"
Cohesion: 0.19
Nodes (12): binary(), connect(), createSession(), json(), origin, ramConnection, ramDoc, rejectedConnection() (+4 more)

### Community 91 - "Collaborative contradiction-resolution plan"
Cohesion: 0.50
Nodes (3): Acceptance tests, Collaborative contradiction-resolution plan, UI

### Community 93 - "oauth-callback.ts"
Cohesion: 0.50
Nodes (3): completeOAuthCallback(), OAuthCallbackOutcome, Callback()

### Community 95 - "cocreate.test.ts"
Cohesion: 0.53
Nodes (3): keepLastSuccess(), shouldPromoteRevision(), previewDocument()

## Knowledge Gaps
- **494 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+489 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 953 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `App.tsx`, `sidebar.tsx`, `package.json`, `combobox.tsx`, `menubar.tsx`, `context-menu.tsx`, `drawer.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `item.tsx`, `toast.tsx`, `attachment.tsx`, `field.tsx`, `alert.tsx`, `dialog.tsx`, `supabase.ts`, `lucide-react`, `select.tsx`, `command.tsx`, `card.tsx`, `input-group.tsx`, `dropdown-menu.tsx`, `avatar.tsx`, `message.tsx`, `breadcrumb.tsx`, `ProjectApp.tsx`, `bubble.tsx`, `ref_class_variance_authority`, `pagination.tsx`, `table.tsx`, `popover.tsx`?**
  _High betweenness centrality (0.291) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `command.tsx`, `App.tsx`, `sidebar.tsx`, `dropdown-menu.tsx`, `package.json`, `combobox.tsx`, `menubar.tsx`, `context-menu.tsx`, `react`, `carousel.tsx`, `toast.tsx`, `pagination.tsx`, `ProjectApp.tsx`, `breadcrumb.tsx`, `dialog.tsx`, `navigation-menu.tsx`, `select.tsx`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `2guys1canvas API reference` connect `Harness architecture` to `context.md`, `types.ts`, `ai-presets.ts`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Are the 33 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 33 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _494 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.08727770177838577 - nodes in this community are weakly interconnected._
- **Should `rules` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._