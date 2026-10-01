# Graph Report - Devoffice  (2026-10-01)

## Corpus Check
- 180 files · ~234,030 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 4, .css 4, .log 4)

## Summary
- 1728 nodes · 3147 edges · 115 communities (80 shown, 35 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 97 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `96c7cb66`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- SupabasePlatform
- requirements.ts
- providers.ts
- menubar.tsx
- ref_node_fs
- OpenRouterLeases
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
- marker.tsx
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
- 2guys1canvas context handoff
- provider-reconnect.test.ts
- local-drafts.test.ts
- alert-dialog.tsx
- chart.tsx
- toast.tsx
- live-collaboration-check.mjs
- Harness architecture
- ref_components_ui_button
- command.tsx
- field.tsx
- item.tsx
- Workspace
- attachment.tsx
- dialog.tsx
- migrate-legacy-to-supabase.ts
- CoCreateProvider
- managed-ai.test.ts
- navigation-menu.tsx
- select.tsx
- 2guys1canvas AI coding instructions
- devDependencies
- ai-presets.test.ts
- layout.tsx
- 2guys1canvas
- project.ts
- 2guys1canvas harness implementation checklist
- avatar.tsx
- context.md
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
- src_comic
- live-browser-collaboration-check.mjs
- ai-accounting.ts
- auth-config.ts
- alert.tsx
- button-group.tsx
- 2guys1canvas API reference
- .oxfmtrc.json
- collapsible.tsx
- .ensureWorkflow
- RoomView
- page.tsx
- utils.ts
- oauth-callback.ts
- request
- prisma7.config.ts
- CoCreate harness assessment
- direction.tsx
- .mcp.json
- hover-card.tsx
- radio-group.tsx
- Harness migration plan
- Responsiveness evidence
- model-evaluation.md
- cocreate.test.ts
- providers.test.ts
- requirements.test.ts
- demo.ts
- accordion.tsx
- input-otp.tsx
- zip.ts
- usage-ledger.ts
- vite
- engines

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 83 edges
2. `createCoCreateServer()` - 55 edges
3. `Harness decision log` - 44 edges
4. `react` - 43 edges
5. `EventStore` - 42 edges
6. `2guys1canvas harness implementation checklist` - 39 edges
7. `SupabasePlatform` - 34 edges
8. `registerProjectRoutes()` - 30 edges
9. `lucide-react` - 25 edges
10. `fail()` - 24 edges

## Surprising Connections (you probably didn't know these)
- `Reference-led presentation update (2026-09-30)` --references--> `Workspace()`  [INFERRED]
  docs/harness/architecture.md → src/App.tsx
- `Bounded context and cost target` --references--> `AIRunRecord`  [INFERRED]
  docs/harness/architecture.md → src/types.ts
- `Shared response models` --references--> `interpretation()`  [INFERRED]
  api.md → tests/requirements.test.ts
- `Shared response models` --references--> `Requirement`  [INFERRED]
  api.md → src/types.ts
- `Shared response models` --references--> `SafeAIConnection`  [INFERRED]
  api.md → src/types.ts

## Import Cycles
- None detected.

## Communities (115 total, 35 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.08
Nodes (21): Submission scheduling: current implementation and required hardening, ref_node_stream, calculateCharge(), catalogRate(), effortAllowance(), AIConfig, listProviderModels(), createCoCreateServer() (+13 more)

### Community 1 - "SupabasePlatform"
Cohesion: 0.07
Nodes (32): ref_supabase_server_core, decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), InvitationEmailSender, appOrigin(), bearer() (+24 more)

### Community 2 - "requirements.ts"
Cohesion: 0.13
Nodes (30): acceptanceFor(), acceptedClassification(), alternativeSignature(), candidateEntries(), categories, classifications, classifyIntentText(), clean() (+22 more)

### Community 3 - "providers.ts"
Cohesion: 0.08
Nodes (30): ref_node_async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+22 more)

### Community 4 - "menubar.tsx"
Cohesion: 0.06
Nodes (3): ref_base_ui_react_menu, ref_base_ui_react_menubar, ref_components_ui_dropdown_menu

### Community 5 - "ref_node_fs"
Cohesion: 0.08
Nodes (24): express, ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, browser, output, profile (+16 more)

### Community 6 - "OpenRouterLeases"
Cohesion: 0.22
Nodes (6): BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel, modelsFrom(), OpenRouterLeases

### Community 7 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 9 - "sidebar.tsx"
Cohesion: 0.05
Nodes (18): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, Sidebar(), SidebarContext, SidebarContextProps, SidebarMenuButton() (+10 more)

### Community 10 - "package.json"
Cohesion: 0.07
Nodes (26): name, private, type, version, cross-env, pg, prisma, @prisma/adapter-pg (+18 more)

### Community 11 - "generator.ts"
Cohesion: 0.10
Nodes (25): boundedInput(), bundleSource(), callOpenAI(), classification, compactRequirement(), compactSharedRequirement(), compactText(), DEFAULT_PROJECT_OUTPUT_TOKENS (+17 more)

### Community 12 - "ref_lib_utils"
Cohesion: 0.07
Nodes (6): ref_base_ui_react_separator, ref_base_ui_react_slider, ref_base_ui_react_switch, ref_base_ui_react_tooltip, ref_lib_utils, ref_react_resizable_panels

### Community 13 - "rooms.ts"
Cohesion: 0.08
Nodes (22): ProviderAccountingError, AISettings, BudgetReservation, BudgetWindow, ClientSocket, colors, defaultDataDir, DurableStore (+14 more)

### Community 14 - "ai-presets.ts"
Cohesion: 0.11
Nodes (23): Named AI connections (preferred API), maximumAllowanceCharge(), CatalogEntry, classifyTaskComplexity(), cost(), estimateLayerMaximum(), layer(), longContext (+15 more)

### Community 15 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, express, lucide-react, pg (+16 more)

### Community 16 - "App.tsx"
Cohesion: 0.07
Nodes (38): AdvancedAISetup(), AgentPanel(), changeEffort(), reinterpret(), send(), AISetup(), api(), BuildAccounting() (+30 more)

### Community 17 - "lucide-react"
Cohesion: 0.10
Nodes (4): NativeSelectProps, PaginationLinkProps, ref_base_ui_react_checkbox, lucide-react

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
Nodes (5): ref_node_assert_strict, ref_node_crypto, ref_node_test, yjs, root

### Community 22 - "tool-registry.ts"
Cohesion: 0.13
Nodes (14): bundleProject(), FileOperation, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior (+6 more)

### Community 23 - "index.ts"
Cohesion: 0.17
Nodes (13): ref_node_http, ref_node_url, ws, b64(), createSession(), participantId(), roomToken(), Session (+5 more)

### Community 24 - "marker.tsx"
Cohesion: 0.27
Nodes (6): Badge(), badgeVariants, Marker(), markerVariants, ref_base_ui_react_merge_props, ref_base_ui_react_use_render

### Community 26 - "Harness decision log"
Cohesion: 0.05
Nodes (44): D-0001 — Preserve the existing application while migrating additively, D-0002 — Personal interpretations are proposals, not builder authority, D-0003 — Build from the accepted registry, not the raw canvas, D-0004 — Deletion is not withdrawal, D-0005 — Pause on consequential accepted contradictions, D-0006 — Conflict groups and explicit affected-contributor agreement, D-0007 — Classify per intent and reprocess only by explicit participant action, D-0008 — Submit intent explicitly; collaborate continuously (+36 more)

### Community 27 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 29 - "event-store.ts"
Cohesion: 0.12
Nodes (13): ref_node_sqlite, ActorType, EventInput, json(), redact(), RunState, StoredEvent, StoredRun (+5 more)

### Community 30 - "types.ts"
Cohesion: 0.10
Nodes (24): Shared response models, Migration, Lease, AgentStatus, AIConnection, AIRateTier, AIRoutingEvidenceStatus, AIRunRecord (+16 more)

### Community 31 - "drawer.tsx"
Cohesion: 0.13
Nodes (5): DrawerContent(), DrawerContext, DrawerContextProps, useDrawer(), ref_base_ui_react_drawer

### Community 32 - "2guys1canvas product brief"
Cohesion: 0.11
Nodes (19): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Historical managed-model product brief, Historical workspace visual slice — 2026-09-28 (+11 more)

### Community 33 - "ref_class_variance_authority"
Cohesion: 0.16
Nodes (10): Button(), buttonVariants, ToggleGroupContext, Toggle(), toggleVariants, ref_base_ui_react_button, ref_base_ui_react_toggle, ref_base_ui_react_toggle_group (+2 more)

### Community 34 - "carousel.tsx"
Cohesion: 0.17
Nodes (13): CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions, CarouselPlugin (+5 more)

### Community 35 - "2guys1canvas context handoff"
Cohesion: 0.11
Nodes (19): 2026-09-24 — Supabase project transition, 2guys1canvas context handoff, Collaboration reconnect evidence (2026-09-19), Current BYOK-only handoff (2026-09-28), Current implementation handoff (2026-09-30), Current implementation landmarks, Dark editorial presentation slice (2026-09-19), Historical managed-model slice — 2026-09-27 (+11 more)

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

### Community 42 - "Harness architecture"
Cohesion: 0.10
Nodes (20): Active hosted BYOK boundary (2026-09-28), Authentication, project naming, and sharing extension (2026-09-25), Bounded context and cost target, Browser recovery and transport batching — 2026-09-28, Connection and managed-access boundary, Deployment constraint, Evidence-based routing boundary, Execution flow (+12 more)

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
Cohesion: 0.15
Nodes (11): ref_dotenv_config, @supabase/supabase-js, apply, args, backup, client, dataArg, dataDir (+3 more)

### Community 52 - "managed-ai.test.ts"
Cohesion: 0.18
Nodes (13): [command,file], MANAGED_CATALOG_SOURCE, MANAGED_CATALOG_VERSION, MANAGED_DEFAULT_BUILDER, MANAGED_INTERPRETER_CANDIDATES, managedBuilder(), managedCatalog, ManagedCatalogEntry (+5 more)

### Community 53 - "navigation-menu.tsx"
Cohesion: 0.20
Nodes (3): NavigationMenuTrigger(), navigationMenuTriggerStyle, ref_base_ui_react_navigation_menu

### Community 55 - "2guys1canvas AI coding instructions"
Cohesion: 0.13
Nodes (15): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change, Existing stack and boundaries (+7 more)

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
Cohesion: 0.13
Nodes (15): 2guys1canvas, Active hosted MVP: OpenRouter BYOK, AI steering documents, Architecture, Checks, Connect AI, Current boundaries, Current product setup (2026-09-30) (+7 more)

### Community 60 - "project.ts"
Cohesion: 0.17
Nodes (15): esbuild, ref_node_module, ref_node_path_posix, allowedExtensions, applyOperations(), downloadableFiles(), generatedRoot, infrastructureFiles (+7 more)

### Community 61 - "2guys1canvas harness implementation checklist"
Cohesion: 0.04
Nodes (45): Collaboration connection lifecycle, 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), BYOK-only MVP slice (2026-09-28), Cloudflare availability and collaboration repair evidence (2026-09-18), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19) (+37 more)

### Community 63 - "context.md"
Cohesion: 0.38
Nodes (3): CoCreate steering entrypoint, graphify, UI assets and licenses

### Community 66 - "supabase.ts"
Cohesion: 0.15
Nodes (12): ref_react_dom_client, App, ProjectApp, src_studio_ivory, src_styles, authReturnKey, clientAuthMode, resolved (+4 more)

### Community 67 - "verify-conflict-ui.ts"
Cohesion: 0.29
Nodes (6): browser, dataDir, group, profile, room, token

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
Nodes (6): ref_node_fs_promises, ref_node_perf_hooks, median(), run(), Sample, wait()

### Community 76 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 77 - "ai-accounting.ts"
Cohesion: 0.22
Nodes (12): aggregateCalls(), effectiveness(), EffectivenessGroup, VERIFICATION_POLICY_VERSION, AIRate, AIRunCall, LegacyAISpecialty, NormalizedAIUsage (+4 more)

### Community 78 - "auth-config.ts"
Cohesion: 0.38
Nodes (6): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution

### Community 80 - "button-group.tsx"
Cohesion: 0.40
Nodes (3): ButtonGroup(), buttonGroupVariants, ref_components_ui_separator

### Community 81 - "2guys1canvas API reference"
Cohesion: 0.15
Nodes (13): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Building and preview, Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30) (+5 more)

### Community 82 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 84 - ".ensureWorkflow"
Cohesion: 0.23
Nodes (3): WorkflowPhase, WorkflowTask, WorkflowTaskState

### Community 85 - "RoomView"
Cohesion: 0.20
Nodes (9): Rooms and sessions, 2guys1canvas presentation and invitation boundary (2026-09-30), Responsive delivery and synchronization, Acceptance tests, Collaborative contradiction-resolution plan, Server contracts, UI, RoomView (+1 more)

### Community 88 - "oauth-callback.ts"
Cohesion: 0.50
Nodes (3): completeOAuthCallback(), OAuthCallbackOutcome, Callback()

### Community 89 - "request"
Cohesion: 0.33
Nodes (5): needsSessionRefresh(), Projects(), request(), selectedId(), ShareProjectDialog()

### Community 92 - "CoCreate harness assessment"
Cohesion: 0.33
Nodes (5): CoCreate harness assessment, Existing capabilities preserved, First vertical slice selected, Material gaps found, Second verified slice — shared intent

### Community 100 - "Harness migration plan"
Cohesion: 0.40
Nodes (4): Harness migration plan, Later migrations, Rollback, Safe rollout

### Community 103 - "cocreate.test.ts"
Cohesion: 0.21
Nodes (8): html(), InvitationDelivery, InvitationEmail, invitationEmailSenderFromEnv(), validSender(), keepLastSuccess(), shouldPromoteRevision(), previewDocument()

### Community 105 - "providers.test.ts"
Cohesion: 0.28
Nodes (7): testOpenAIConnection(), adapterFor(), discoverModels(), generateText(), ProviderConfig, withProviderAccounting(), schema

### Community 107 - "requirements.test.ts"
Cohesion: 0.29
Nodes (7): acceptedRequirements(), blockedRequirementIds(), eligibleRequirements(), submitConflictSelection(), InterpretationClassification, Requirement, interpretation()

### Community 108 - "demo.ts"
Cohesion: 0.38
Nodes (6): clean(), demoExtract(), demoOrchestrate(), shell(), AgentChange, ProductSource

### Community 111 - "zip.ts"
Cohesion: 0.50
Nodes (4): ProjectFile, crc32(), createZip(), table

### Community 112 - "usage-ledger.ts"
Cohesion: 0.50
Nodes (4): aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes

## Knowledge Gaps
- **514 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+509 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 970 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `menubar.tsx`, `sidebar.tsx`, `package.json`, `App.tsx`, `lucide-react`, `ProjectApp.tsx`, `marker.tsx`, `combobox.tsx`, `context-menu.tsx`, `types.ts`, `drawer.tsx`, `ref_class_variance_authority`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `toast.tsx`, `ref_components_ui_button`, `command.tsx`, `field.tsx`, `item.tsx`, `attachment.tsx`, `dialog.tsx`, `select.tsx`, `avatar.tsx`, `popover.tsx`, `supabase.ts`, `bubble.tsx`, `message.tsx`, `alert.tsx`, `table.tsx`, `sheet.tsx`, `breadcrumb.tsx`, `input-otp.tsx`?**
  _High betweenness centrality (0.293) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `menubar.tsx`, `sidebar.tsx`, `package.json`, `App.tsx`, `ProjectApp.tsx`, `combobox.tsx`, `context-menu.tsx`, `types.ts`, `carousel.tsx`, `toast.tsx`, `ref_components_ui_button`, `command.tsx`, `dialog.tsx`, `navigation-menu.tsx`, `select.tsx`, `sheet.tsx`, `breadcrumb.tsx`, `accordion.tsx`, `input-otp.tsx`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `2guys1canvas API reference` connect `2guys1canvas API reference` to `types.ts`, `RoomView`, `ai-presets.ts`, `context.md`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Are the 33 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 33 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _514 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.08463949843260188 - nodes in this community are weakly interconnected._
- **Should `SupabasePlatform` be split into smaller, more focused modules?**
  _Cohesion score 0.07462686567164178 - nodes in this community are weakly interconnected._