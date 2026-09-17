# Graph Report - Devoffice  (2026-09-18)

## Corpus Check
- 120 files · ~39,394 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 5, .css 2, .codex-disabled 1)

## Summary
- 1067 nodes · 1702 edges · 83 communities (53 shown, 30 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f11b2e6b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- index.ts
- rules
- App.tsx
- sidebar.tsx
- rooms.ts
- providers.ts
- demo.ts
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
- generator.ts
- attachment.tsx
- field.tsx
- react
- dialog.tsx
- tool-registry.ts
- navigation-menu.tsx
- select.tsx
- container.js
- input-group.tsx
- pagination.tsx
- devDependencies
- accordion.tsx
- empty.tsx
- avatar.tsx
- bubble.tsx
- message-scroller.tsx
- popover.tsx
- CoCreate
- types.ts
- progress.tsx
- ref_class_variance_authority
- .oxfmtrc.json
- scripts
- Four-Tile Modular Mark
- layout.tsx
- project.ts
- button-group.tsx
- input-otp.tsx
- marker.tsx
- requirements.ts
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
- event-store.ts
- Harness architecture
- lucide-react
- Harness decision log
- CoCreate harness assessment
- Harness migration plan
- zip.ts
- scroll-area.tsx
- main.tsx
- utils.ts
- direction.tsx

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 57 edges
2. `react` - 41 edges
3. `createCoCreateServer()` - 33 edges
4. `EventStore` - 26 edges
5. `lucide-react` - 23 edges
6. `rules` - 21 edges
7. `compilerOptions` - 16 edges
8. `reconcileRequirements()` - 15 edges
9. `AIProvider` - 12 edges
10. `ProviderError` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Graphify Project Instructions` --conceptually_related_to--> `Constrained Query Navigation`  [INFERRED]
  AGENTS.md → .codex/skills/graphify/references/query.md
- `CoCreate` --conceptually_related_to--> `CoCreate HTML Shell`  [INFERRED]
  README.md → index.html
- `CoCreate` --conceptually_related_to--> `CoCreate pnpm Workspace`  [INFERRED]
  README.md → pnpm-workspace.yaml
- `createCoCreateServer()` --calls--> `createSession()`  [EXTRACTED]
  server/index.ts → server/auth.ts
- `createCoCreateServer()` --calls--> `verifySession()`  [EXTRACTED]
  server/index.ts → server/auth.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Operational Pipeline** — _codex_skills_graphify_skill_extraction_pipeline, _codex_skills_graphify_references_update_incremental_update, _codex_skills_graphify_references_query_query_navigation [EXTRACTED 1.00]
- **Four-Tile Favicon Composition** — public_favicon_four_tile_mark, public_favicon_large_diagonal_tiles, public_favicon_small_diagonal_tiles, public_favicon_three_tone_blue_palette [EXTRACTED 1.00]

## Communities (83 total, 30 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.12
Nodes (9): createCoCreateServer(), hasOpenContradictions(), buildFingerprint(), documentText(), emptyUsage(), now(), RoomManager, AIFormat (+1 more)

### Community 1 - "index.ts"
Cohesion: 0.09
Nodes (21): ref_dotenv_config, ref_node_assert_strict, ref_node_http, ref_node_os, ref_node_sqlite, ref_node_test, ref_node_url, ws (+13 more)

### Community 2 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 3 - "App.tsx"
Cohesion: 0.11
Nodes (19): @tiptap/extension-collaboration, @tiptap/extension-collaboration-caret, @tiptap/starter-kit, AgentPanel(), send(), AISetup(), api(), FormatChoice (+11 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.07
Nodes (12): Sidebar(), SidebarContext, SidebarContextProps, SidebarMenuButton(), sidebarMenuButtonVariants, SidebarRail(), SidebarTrigger(), useSidebar() (+4 more)

### Community 5 - "rooms.ts"
Cohesion: 0.16
Nodes (15): ref_node_crypto, decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), AISettings, ClientSocket, colors (+7 more)

### Community 6 - "providers.ts"
Cohesion: 0.11
Nodes (21): adapters, anthropic, bearer(), classify(), deepseek, ensure(), ErrorKind, gemini (+13 more)

### Community 7 - "demo.ts"
Cohesion: 0.27
Nodes (10): clean(), demoExtract(), demoOrchestrate(), shell(), AgentChange, compactRequirement(), compactText(), extractRequirement() (+2 more)

### Community 8 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): engines, node, name, private, type, version, cross-env, dotenv (+14 more)

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

### Community 23 - "generator.ts"
Cohesion: 0.11
Nodes (25): AIConfig, boundedInput(), bundleSource(), callOpenAI(), compactSharedRequirement(), generateProjectPlan(), listProviderModels(), ModelResult (+17 more)

### Community 24 - "attachment.tsx"
Cohesion: 0.20
Nodes (4): Attachment(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 25 - "field.tsx"
Cohesion: 0.17
Nodes (3): Field(), fieldVariants, ref_components_ui_label

### Community 26 - "react"
Cohesion: 0.10
Nodes (5): Alert(), alertVariants, NativeSelectProps, ref_base_ui_react_input, react

### Community 29 - "tool-registry.ts"
Cohesion: 0.13
Nodes (14): bundleProject(), FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior (+6 more)

### Community 30 - "navigation-menu.tsx"
Cohesion: 0.20
Nodes (3): NavigationMenuTrigger(), navigationMenuTriggerStyle, ref_base_ui_react_navigation_menu

### Community 32 - "container.js"
Cohesion: 0.24
Nodes (5): @cloudflare/containers, baseEnv, CoCreateContainer, fetch(), randomSecret()

### Community 33 - "input-group.tsx"
Cohesion: 0.22
Nodes (6): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, ref_components_ui_input, ref_components_ui_textarea

### Community 36 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, tsx, @types/express, @types/node, @types/react, @types/react-dom, @types/ws, typescript (+1 more)

### Community 42 - "bubble.tsx"
Cohesion: 0.38
Nodes (4): Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 46 - "CoCreate"
Cohesion: 0.29
Nodes (7): CoCreate HTML Shell, React Main Entry Point, Allowed Native Builds, CoCreate pnpm Workspace, CoCreate, Generated Project Sandbox, Provider Capability and Credential Security

### Community 47 - "types.ts"
Cohesion: 0.12
Nodes (15): AgentStatus, AIModel, AIUsage, CapabilityCheck, ChangeKind, Contradiction, InterpretationClassification, ModelChecks (+7 more)

### Community 49 - "ref_class_variance_authority"
Cohesion: 0.20
Nodes (7): Button(), buttonVariants, TabsList(), tabsListVariants, ref_base_ui_react_button, ref_base_ui_react_tabs, ref_class_variance_authority

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
Cohesion: 0.16
Nodes (16): esbuild, ref_node_fs_promises, ref_node_module, ref_node_path_posix, allowedExtensions, applyOperations(), downloadableFiles(), generatedRoot (+8 more)

### Community 55 - "button-group.tsx"
Cohesion: 0.40
Nodes (3): ButtonGroup(), buttonGroupVariants, ref_components_ui_separator

### Community 57 - "marker.tsx"
Cohesion: 0.27
Nodes (6): Badge(), badgeVariants, Marker(), markerVariants, ref_base_ui_react_merge_props, ref_base_ui_react_use_render

### Community 58 - "requirements.ts"
Cohesion: 0.28
Nodes (15): acceptanceFor(), acceptedClassification(), acceptedRequirementFingerprint(), acceptedRequirements(), candidateEntries(), clean(), contradictionSignature(), detectContradictions() (+7 more)

### Community 64 - "toggle-group.tsx"
Cohesion: 0.22
Nodes (6): ToggleGroupContext, Toggle(), toggleVariants, ref_base_ui_react_toggle, ref_base_ui_react_toggle_group, ref_components_ui_toggle

### Community 65 - "ref_node_path"
Cohesion: 0.21
Nodes (10): ref_node_child_process, ref_node_fs, ref_node_path, browser, profile, browser, profile, browser (+2 more)

### Community 66 - "CoCreate harness implementation checklist"
Cohesion: 0.20
Nodes (9): CoCreate harness implementation checklist, Foundation and first vertical slice, Phase 1 — durable records and recovery, Phase 2 — tools and policy, Phase 3 — durable orchestration, Phase 4 — verification and bounded repair, Phase 5 — approvals and inspection UI, Phase 6 — end-to-end hardening scenarios (+1 more)

### Community 67 - "CoCreateProvider"
Cohesion: 0.31
Nodes (5): ref_y_protocols_awareness, tokenParticipant(), Workspace(), CoCreateProvider, RoomView

### Community 68 - "ref_lib_utils"
Cohesion: 0.10
Nodes (5): ref_base_ui_react_checkbox, ref_base_ui_react_separator, ref_base_ui_react_slider, ref_base_ui_react_switch, ref_lib_utils

### Community 70 - "event-store.ts"
Cohesion: 0.22
Nodes (8): ActorType, EventInput, json(), redact(), RunState, StoredEvent, StoredRun, transitions

### Community 71 - "Harness architecture"
Cohesion: 0.22
Nodes (8): Deployment constraint, Execution flow, Harness architecture, Policy boundary, Recovery and consistency, Retention and privacy, Shared intent registry, Source of truth

### Community 72 - "lucide-react"
Cohesion: 0.25
Nodes (3): ref_components_ui_button, lucide-react, ref_react_day_picker

### Community 73 - "Harness decision log"
Cohesion: 0.29
Nodes (6): D-0001 — Preserve the existing application while migrating additively, D-0002 — Personal interpretations are proposals, not builder authority, D-0003 — Build from the accepted registry, not the raw canvas, D-0004 — Deletion is not withdrawal, D-0005 — Pause on consequential accepted contradictions, Harness decision log

### Community 74 - "CoCreate harness assessment"
Cohesion: 0.33
Nodes (5): CoCreate harness assessment, Existing capabilities preserved, First vertical slice selected, Material gaps found, Second verified slice — shared intent

### Community 75 - "Harness migration plan"
Cohesion: 0.40
Nodes (4): Harness migration plan, Later migrations, Rollback, Safe rollout

### Community 76 - "zip.ts"
Cohesion: 0.50
Nodes (4): ProjectFile, crc32(), createZip(), table

### Community 78 - "main.tsx"
Cohesion: 0.50
Nodes (3): ref_react_dom_client, App(), src_styles

## Knowledge Gaps
- **231 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+226 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 646 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `App.tsx`, `sidebar.tsx`, `package.json`, `combobox.tsx`, `menubar.tsx`, `context-menu.tsx`, `drawer.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `item.tsx`, `toast.tsx`, `attachment.tsx`, `field.tsx`, `dialog.tsx`, `sheet.tsx`, `select.tsx`, `input-group.tsx`, `pagination.tsx`, `table.tsx`, `breadcrumb.tsx`, `card.tsx`, `avatar.tsx`, `bubble.tsx`, `message.tsx`, `message-scroller.tsx`, `popover.tsx`, `input-otp.tsx`, `marker.tsx`, `toggle-group.tsx`, `lucide-react`, `scroll-area.tsx`, `main.tsx`?**
  _High betweenness centrality (0.320) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `App.tsx`, `sidebar.tsx`, `package.json`, `combobox.tsx`, `menubar.tsx`, `context-menu.tsx`, `carousel.tsx`, `toast.tsx`, `react`, `dialog.tsx`, `sheet.tsx`, `navigation-menu.tsx`, `select.tsx`, `pagination.tsx`, `breadcrumb.tsx`, `accordion.tsx`, `message-scroller.tsx`, `input-otp.tsx`, `ref_lib_utils`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `createCoCreateServer()` (e.g. with `.assignAI()` and `.buildNow()`) actually correct?**
  _`createCoCreateServer()` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _231 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.12155388471177944 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08771929824561403 - nodes in this community are weakly interconnected._