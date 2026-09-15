# Graph Report - cocreate  (2026-09-16)

## Corpus Check
- 114 files · ~35,794 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .css 2, .example 1)

## Summary
- 894 nodes · 1289 edges · 88 communities (33 shown, 22 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `327bba22`
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
- drawer.tsx
- carousel.tsx
- Structural and Semantic Extraction Pipeline
- chart.tsx
- item.tsx
- toast.tsx
- generator.ts
- attachment.tsx
- field.tsx
- react
- navigation-menu.tsx
- container.js
- input-group.tsx
- pagination.tsx
- devDependencies
- lucide-react
- empty.tsx
- bubble.tsx
- CoCreate
- alert.tsx
- tabs.tsx
- .oxfmtrc.json
- scripts
- Four-Tile Modular Mark
- layout.tsx
- extractRequirement
- button-group.tsx
- marker.tsx
- native-select.tsx
- page.tsx
- toggle-group.tsx
- preview-smoke.mjs
- badge.tsx
- button.tsx
- toggle.tsx
- vite
- browser-smoke.mjs
- connections-ui-smoke.mjs
- next.config.ts
- engines
- Q: Why did typing letters in the canvas consume many tokens, possibly more than building? Identify affected modules, data flow, dependencies, and tests; do not implement.
- Q: Is the Build now feature useless if the product is already built and API calls happen whenever I type in the canvas? What is its purpose?
- Q: Keep automatic building, but reduce aggressive model API calls and token consumption. What potential solution options fit this codebase?

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 54 edges
2. `react` - 41 edges
3. `createCoCreateServer()` - 33 edges
4. `lucide-react` - 23 edges
5. `rules` - 21 edges
6. `compilerOptions` - 16 edges
7. `AIProvider` - 12 edges
8. `ProviderError` - 11 edges
9. `AIFormat` - 11 edges
10. `generateStructured()` - 9 edges

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

## Communities (88 total, 22 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.11
Nodes (11): createCoCreateServer(), loadProject(), persistProject(), buildFingerprint(), documentText(), emptyUsage(), now(), requirementFingerprint() (+3 more)

### Community 1 - "index.ts"
Cohesion: 0.08
Nodes (30): esbuild, ws, b64(), createSession(), participantId(), roomToken(), Session, verifySession() (+22 more)

### Community 2 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 3 - "App.tsx"
Cohesion: 0.09
Nodes (20): @tiptap/extension-collaboration-caret, @tiptap/react, yjs, AgentPanel(), send(), AISetup(), api(), App() (+12 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.08
Nodes (8): Sidebar(), SidebarContext, SidebarContextProps, SidebarMenuButton(), sidebarMenuButtonVariants, SidebarRail(), SidebarTrigger(), useSidebar()

### Community 5 - "rooms.ts"
Cohesion: 0.09
Nodes (28): decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), AIConfig, projectSchema, reqSchema, AISettings (+20 more)

### Community 6 - "providers.ts"
Cohesion: 0.10
Nodes (23): adapters, anthropic, bearer(), classify(), deepseek, ensure(), ErrorKind, gemini (+15 more)

### Community 7 - "demo.ts"
Cohesion: 0.32
Nodes (7): clean(), demoExtract(), demoOrchestrate(), shell(), AgentChange, ProductSource, Requirement

### Community 8 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (19): name, private, type, version, cross-env, dotenv, express, react-dom (+11 more)

### Community 10 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, express, lucide-react, react (+10 more)

### Community 11 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 16 - "drawer.tsx"
Cohesion: 0.14
Nodes (4): DrawerContent(), DrawerContext, DrawerContextProps, useDrawer()

### Community 17 - "carousel.tsx"
Cohesion: 0.19
Nodes (12): CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions, CarouselPlugin (+4 more)

### Community 18 - "Structural and Semantic Extraction Pipeline"
Cohesion: 0.15
Nodes (13): URL Ingestion and Folder Watch, Optional Graph Exports, Semantic Extraction Contract, GitHub and Cross-Repository Merge, Automatic Graph Hooks, Constrained Query Navigation, Graph Work Memory, Whisper Media Transcription (+5 more)

### Community 20 - "chart.tsx"
Cohesion: 0.21
Nodes (10): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION, THEMES (+2 more)

### Community 21 - "item.tsx"
Cohesion: 0.18
Nodes (4): Item(), ItemMedia(), itemMediaVariants, itemVariants

### Community 23 - "generator.ts"
Cohesion: 0.18
Nodes (15): boundedInput(), callOpenAI(), listProviderModels(), ModelResult, productSchema, providerConfig(), testOpenAIConnection(), validateBaseUrl() (+7 more)

### Community 24 - "attachment.tsx"
Cohesion: 0.20
Nodes (4): Attachment(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 32 - "container.js"
Cohesion: 0.27
Nodes (5): @cloudflare/containers, baseEnv, CoCreateContainer, fetch(), randomSecret()

### Community 33 - "input-group.tsx"
Cohesion: 0.28
Nodes (4): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants

### Community 36 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, tsx, @types/express, @types/node, @types/react, @types/react-dom, @types/ws, typescript (+1 more)

### Community 42 - "bubble.tsx"
Cohesion: 0.38
Nodes (4): Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 46 - "CoCreate"
Cohesion: 0.29
Nodes (7): CoCreate HTML Shell, React Main Entry Point, Allowed Native Builds, CoCreate pnpm Workspace, CoCreate, Generated Project Sandbox, Provider Capability and Credential Security

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
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 54 - "extractRequirement"
Cohesion: 0.36
Nodes (8): bundleSource(), compactRequirement(), compactText(), extractRequirement(), generateProduct(), generateProjectPlan(), validateSource(), budgetProjectFiles()

### Community 65 - "preview-smoke.mjs"
Cohesion: 0.50
Nodes (3): browser, profile, roomId

### Community 85 - "Q: Why did typing letters in the canvas consume many tokens, possibly more than building? Identify affected modules, data flow, dependencies, and tests; do not implement."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did typing letters in the canvas consume many tokens, possibly more than building? Identify affected modules, data flow, dependencies, and tests; do not implement., Source Nodes

### Community 86 - "Q: Is the Build now feature useless if the product is already built and API calls happen whenever I type in the canvas? What is its purpose?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Is the Build now feature useless if the product is already built and API calls happen whenever I type in the canvas? What is its purpose?, Source Nodes

### Community 87 - "Q: Keep automatic building, but reduce aggressive model API calls and token consumption. What potential solution options fit this codebase?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Keep automatic building, but reduce aggressive model API calls and token consumption. What potential solution options fit this codebase?, Source Nodes

## Knowledge Gaps
- **201 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+196 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 559 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `.buildLoop()` (3× useful, score=2.999255283) _(code changed — re-verify)_
- `.queueEdit()` (3× useful, score=2.999255283) _(code changed — re-verify)_
- `.runAgent()` (3× useful, score=2.999255283) _(code changed — re-verify)_
- `.scheduleBuild()` (3× useful, score=2.999255283) _(code changed — re-verify)_
- `.requestBuild()` (2× useful, score=1.999675855) _(code changed — re-verify)_
- `generateProjectPlan()` (2× useful, score=1.999486798) _(code changed — re-verify)_
- `.handleMessage()` (2× useful, score=1.999347912) _(code changed — re-verify)_

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `App.tsx`, `sidebar.tsx`, `package.json`, `combobox.tsx`, `menubar.tsx`, `context-menu.tsx`, `dropdown-menu.tsx`, `drawer.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `item.tsx`, `toast.tsx`, `attachment.tsx`, `field.tsx`, `dialog.tsx`, `sheet.tsx`, `command.tsx`, `select.tsx`, `input-group.tsx`, `pagination.tsx`, `table.tsx`, `breadcrumb.tsx`, `card.tsx`, `avatar.tsx`, `bubble.tsx`, `message.tsx`, `message-scroller.tsx`, `popover.tsx`, `alert.tsx`, `input-otp.tsx`, `marker.tsx`, `native-select.tsx`, `toggle-group.tsx`?**
  _High betweenness centrality (0.336) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `App.tsx`, `sidebar.tsx`, `package.json`, `combobox.tsx`, `menubar.tsx`, `context-menu.tsx`, `dropdown-menu.tsx`, `carousel.tsx`, `toast.tsx`, `react`, `dialog.tsx`, `sheet.tsx`, `command.tsx`, `navigation-menu.tsx`, `select.tsx`, `pagination.tsx`, `breadcrumb.tsx`, `message-scroller.tsx`, `input-otp.tsx`, `native-select.tsx`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `RoomManager` connect `RoomManager` to `index.ts`, `App.tsx`, `rooms.ts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `createCoCreateServer()` (e.g. with `.assignAI()` and `.buildNow()`) actually correct?**
  _`createCoCreateServer()` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _201 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.11186440677966102 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0753045404208195 - nodes in this community are weakly interconnected._