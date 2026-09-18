# Graph Report - Devoffice  (2026-09-18)

## Corpus Check
- 126 files · ~43,463 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .css 2, .example 1)

## Summary
- 1130 nodes · 1811 edges · 87 communities (53 shown, 34 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 46 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d17bebbd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- integration.test.ts
- rules
- App.tsx
- sidebar.tsx
- rooms.ts
- providers.ts
- generator.ts
- components.json
- package.json
- dependencies
- compilerOptions
- combobox.tsx
- menubar.tsx
- context-menu.tsx
- EventStore
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
- dialog.tsx
- lucide-react
- navigation-menu.tsx
- select.tsx
- container.js
- yjs
- pagination.tsx
- devDependencies
- accordion.tsx
- CoCreate product brief
- avatar.tsx
- bubble.tsx
- message-scroller.tsx
- popover.tsx
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
- input-otp.tsx
- marker.tsx
- ref_class_variance_authority
- tooltip.tsx
- page.tsx
- collapsible.tsx
- hover-card.tsx
- resizable.tsx
- toggle-group.tsx
- ref_node_path
- CoCreate harness implementation checklist
- CoCreateProvider
- ref_lib_utils
- radio-group.tsx
- CoCreate context handoff
- Harness architecture
- ref_components_ui_button
- Harness decision log
- CoCreate harness assessment
- Harness migration plan
- CoCreate AI coding instructions
- scroll-area.tsx
- react
- utils.ts
- cocreate.test.ts
- direction.tsx
- separator.tsx

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 57 edges
2. `react` - 41 edges
3. `createCoCreateServer()` - 33 edges
4. `EventStore` - 26 edges
5. `lucide-react` - 23 edges
6. `rules` - 21 edges
7. `reconcileRequirements()` - 18 edges
8. `compilerOptions` - 16 edges
9. `AIProvider` - 12 edges
10. `ProviderError` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Shared response models` --references--> `SafeAIConnection`  [INFERRED]
  api.md → src/types.ts
- `Rooms and sessions` --references--> `RoomView`  [INFERRED]
  api.md → src/types.ts
- `Server contracts` --references--> `RoomView`  [INFERRED]
  docs/harness/contradiction-resolution-plan.md → src/types.ts
- `Shared response models` --references--> `SharedRequirement`  [INFERRED]
  api.md → src/types.ts
- `Shared response models` --references--> `Contradiction`  [INFERRED]
  api.md → src/types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Operational Pipeline** — _codex_skills_graphify_skill_extraction_pipeline, _codex_skills_graphify_references_update_incremental_update, _codex_skills_graphify_references_query_query_navigation [EXTRACTED 1.00]
- **Four-Tile Favicon Composition** — public_favicon_four_tile_mark, public_favicon_large_diagonal_tiles, public_favicon_small_diagonal_tiles, public_favicon_three_tone_blue_palette [EXTRACTED 1.00]

## Communities (87 total, 34 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.09
Nodes (24): ref_dotenv_config, express, ref_node_url, b64(), createSession(), participantId(), roomToken(), Session (+16 more)

### Community 1 - "integration.test.ts"
Cohesion: 0.18
Nodes (4): ref_node_assert_strict, ref_node_http, ref_node_test, ws

### Community 2 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 3 - "App.tsx"
Cohesion: 0.13
Nodes (16): @tiptap/extension-collaboration, @tiptap/extension-collaboration-caret, @tiptap/react, @tiptap/starter-kit, AgentPanel(), send(), AISetup(), api() (+8 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.05
Nodes (18): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, Sidebar(), SidebarContext, SidebarContextProps, SidebarMenuButton() (+10 more)

### Community 5 - "rooms.ts"
Cohesion: 0.13
Nodes (18): ref_node_crypto, decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), AIConfig, projectSchema, reqSchema (+10 more)

### Community 6 - "providers.ts"
Cohesion: 0.10
Nodes (22): adapters, anthropic, bearer(), classify(), deepseek, ensure(), ErrorKind, gemini (+14 more)

### Community 7 - "generator.ts"
Cohesion: 0.18
Nodes (17): clean(), demoExtract(), demoOrchestrate(), shell(), AgentChange, bundleSource(), compactRequirement(), compactSharedRequirement() (+9 more)

### Community 8 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): engines, node, name, private, type, version, cross-env, dotenv (+12 more)

### Community 10 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, express, lucide-react, react (+10 more)

### Community 11 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 12 - "combobox.tsx"
Cohesion: 0.06
Nodes (4): ref_base_ui_react, ref_cmdk, ref_components_ui_dialog, ref_components_ui_input_group

### Community 13 - "menubar.tsx"
Cohesion: 0.06
Nodes (3): ref_base_ui_react_menu, ref_base_ui_react_menubar, ref_components_ui_dropdown_menu

### Community 15 - "EventStore"
Cohesion: 0.06
Nodes (28): ActorType, EventInput, EventStore, json(), redact(), RunState, StoredEvent, StoredRun (+20 more)

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
Cohesion: 0.22
Nodes (11): boundedInput(), callOpenAI(), providerConfig(), testOpenAIConnection(), adapterFor(), discoverModels(), generateStructured(), generateText() (+3 more)

### Community 24 - "attachment.tsx"
Cohesion: 0.20
Nodes (4): Attachment(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 25 - "field.tsx"
Cohesion: 0.17
Nodes (3): Field(), fieldVariants, ref_components_ui_label

### Community 29 - "lucide-react"
Cohesion: 0.18
Nodes (3): NativeSelectProps, ref_base_ui_react_checkbox, lucide-react

### Community 30 - "navigation-menu.tsx"
Cohesion: 0.11
Nodes (5): EmptyMedia(), emptyMediaVariants, NavigationMenuTrigger(), navigationMenuTriggerStyle, ref_base_ui_react_navigation_menu

### Community 32 - "container.js"
Cohesion: 0.24
Nodes (5): @cloudflare/containers, baseEnv, CoCreateContainer, fetch(), randomSecret()

### Community 33 - "yjs"
Cohesion: 0.20
Nodes (8): Rooms and sessions, Acceptance tests, Collaborative contradiction-resolution plan, Server contracts, UI, ref_y_protocols_awareness, yjs, RoomView

### Community 36 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, tsx, @types/express, @types/node, @types/react, @types/react-dom, @types/ws, typescript (+1 more)

### Community 40 - "CoCreate product brief"
Cohesion: 0.20
Nodes (10): CoCreate product brief, Measures, Mission, Priorities, Product acceptance example, Related records, Required experience, Roadmap (+2 more)

### Community 42 - "bubble.tsx"
Cohesion: 0.32
Nodes (5): Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants, ref_base_ui_react_use_render

### Community 46 - "CoCreate"
Cohesion: 0.29
Nodes (7): CoCreate HTML Shell, React Main Entry Point, Allowed Native Builds, CoCreate pnpm Workspace, CoCreate, Generated Project Sandbox, Provider Capability and Credential Security

### Community 47 - "requirements.ts"
Cohesion: 0.05
Nodes (62): Building and preview, CoCreate API reference, Legacy AI routes (currently retained), Maintenance, Named AI connections (preferred API), Shared response models, Transport and authentication, WebSocket collaboration (+54 more)

### Community 49 - "tabs.tsx"
Cohesion: 0.33
Nodes (3): TabsList(), tabsListVariants, ref_base_ui_react_tabs

### Community 50 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 51 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, deploy:cloudflare, dev, start, test

### Community 52 - "Four-Tile Modular Mark"
Cohesion: 0.33
Nodes (6): Application Identity, Four-Tile Modular Mark, Large Opposing Diagonal Tiles, Small Opposing Diagonal Tiles, Favicon SVG Icon, Three-Tone Blue Palette

### Community 53 - "layout.tsx"
Cohesion: 0.20
Nodes (7): app_globals, geistMono, geistSans, metadata, nextConfig, ref_next, ref_next_font_google

### Community 54 - "project.ts"
Cohesion: 0.14
Nodes (14): esbuild, ref_node_fs_promises, ref_node_module, ref_node_path_posix, allowedExtensions, generatedRoot, infrastructureFiles, ProjectFile (+6 more)

### Community 55 - "button-group.tsx"
Cohesion: 0.33
Nodes (4): ButtonGroup(), buttonGroupVariants, ref_base_ui_react_merge_props, ref_components_ui_separator

### Community 58 - "ref_class_variance_authority"
Cohesion: 0.32
Nodes (6): Badge(), badgeVariants, Button(), buttonVariants, ref_base_ui_react_button, ref_class_variance_authority

### Community 64 - "toggle-group.tsx"
Cohesion: 0.22
Nodes (6): ToggleGroupContext, Toggle(), toggleVariants, ref_base_ui_react_toggle, ref_base_ui_react_toggle_group, ref_components_ui_toggle

### Community 65 - "ref_node_path"
Cohesion: 0.21
Nodes (10): ref_node_child_process, ref_node_fs, ref_node_path, browser, profile, browser, profile, browser (+2 more)

### Community 66 - "CoCreate harness implementation checklist"
Cohesion: 0.22
Nodes (9): CoCreate harness implementation checklist, Foundation and first vertical slice, Phase 1 — durable records and recovery, Phase 2 — tools and policy, Phase 3 — durable orchestration, Phase 4 — verification and bounded repair, Phase 5 — approvals and inspection UI, Phase 6 — end-to-end hardening scenarios (+1 more)

### Community 67 - "CoCreateProvider"
Cohesion: 0.48
Nodes (3): tokenParticipant(), Workspace(), CoCreateProvider

### Community 68 - "ref_lib_utils"
Cohesion: 0.11
Nodes (4): ref_base_ui_react_input, ref_base_ui_react_slider, ref_base_ui_react_switch, ref_lib_utils

### Community 70 - "CoCreate context handoff"
Cohesion: 0.25
Nodes (8): CoCreate context handoff, Current implementation landmarks, Implemented versus unfinished, Latest validation, Local workflow, Product, Read next, Suggested next work

### Community 71 - "Harness architecture"
Cohesion: 0.25
Nodes (8): Deployment constraint, Execution flow, Harness architecture, Policy boundary, Recovery and consistency, Retention and privacy, Shared intent registry, Source of truth

### Community 73 - "Harness decision log"
Cohesion: 0.25
Nodes (7): D-0001 — Preserve the existing application while migrating additively, D-0002 — Personal interpretations are proposals, not builder authority, D-0003 — Build from the accepted registry, not the raw canvas, D-0004 — Deletion is not withdrawal, D-0005 — Pause on consequential accepted contradictions, D-0006 — Conflict groups and explicit affected-contributor agreement, Harness decision log

### Community 74 - "CoCreate harness assessment"
Cohesion: 0.33
Nodes (5): CoCreate harness assessment, Existing capabilities preserved, First vertical slice selected, Material gaps found, Second verified slice — shared intent

### Community 75 - "Harness migration plan"
Cohesion: 0.40
Nodes (4): Harness migration plan, Later migrations, Rollback, Safe rollout

### Community 76 - "CoCreate AI coding instructions"
Cohesion: 0.25
Nodes (8): Agent and state rules, CoCreate AI coding instructions, Coding conventions, Existing stack and boundaries, Safety and scope, Session handoff, Start each task, Validation and completion

### Community 78 - "react"
Cohesion: 0.29
Nodes (4): react, ref_react_dom_client, App(), src_styles

### Community 81 - "cocreate.test.ts"
Cohesion: 0.47
Nodes (4): validateBaseUrl(), keepLastSuccess(), shouldPromoteRevision(), validateProviderUrl()

## Knowledge Gaps
- **265 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+260 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 674 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `App.tsx`, `sidebar.tsx`, `package.json`, `combobox.tsx`, `menubar.tsx`, `context-menu.tsx`, `drawer.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `item.tsx`, `toast.tsx`, `attachment.tsx`, `field.tsx`, `alert.tsx`, `dialog.tsx`, `sheet.tsx`, `lucide-react`, `select.tsx`, `pagination.tsx`, `table.tsx`, `breadcrumb.tsx`, `card.tsx`, `avatar.tsx`, `bubble.tsx`, `message.tsx`, `message-scroller.tsx`, `popover.tsx`, `input-otp.tsx`, `marker.tsx`, `toggle-group.tsx`, `ref_lib_utils`, `ref_components_ui_button`, `scroll-area.tsx`?**
  _High betweenness centrality (0.333) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `pagination.tsx`, `App.tsx`, `sidebar.tsx`, `breadcrumb.tsx`, `accordion.tsx`, `ref_components_ui_button`, `package.json`, `combobox.tsx`, `menubar.tsx`, `context-menu.tsx`, `message-scroller.tsx`, `carousel.tsx`, `toast.tsx`, `input-otp.tsx`, `dialog.tsx`, `sheet.tsx`, `navigation-menu.tsx`, `select.tsx`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `CoCreate API reference` connect `requirements.ts` to `context.md`, `yjs`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `createCoCreateServer()` (e.g. with `.assignAI()` and `.buildNow()`) actually correct?**
  _`createCoCreateServer()` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _265 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.08637747336377473 - nodes in this community are weakly interconnected._
- **Should `rules` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._