# Graph Report - Devoffice  (2026-10-04)

## Corpus Check
- 257 files · ~375,151 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 139 file(s) not represented in the graph (top: .log 126, .css 6, (none) 4)

## Summary
- 2251 nodes · 4482 edges · 140 communities (108 shown, 32 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 143 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `472698a1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RoomManager
- ref_node_assert_strict
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
- SupabasePlatform
- ai-presets.ts
- dependencies
- App.tsx
- pagination.tsx
- react
- components.json
- ProjectApp.tsx
- artifacts.ts
- multiuser-step05/verify-evidence.cjs
- index.ts
- types.ts
- combobox.tsx
- Harness decision log
- compilerOptions
- context-menu.tsx
- event-store.ts
- intent-commands.ts
- drawer.tsx
- IsolationRunner
- toggle-group.tsx
- carousel.tsx
- tool-registry.ts
- provider-reconnect.test.ts
- local-drafts.test.ts
- alert-dialog.tsx
- chart.tsx
- toast.tsx
- live-collaboration-check.mjs
- Harness architecture
- supabase-platform.ts
- artifact-restoration.test.ts
- field.tsx
- item.tsx
- Workspace
- attachment.tsx
- dialog.tsx
- migrate-legacy-to-supabase.ts
- registerProjectRoutes
- managed-ai.test.ts
- navigation-menu.tsx
- select.tsx
- 2guys1canvas context handoff
- devDependencies
- providers.test.ts
- layout.tsx
- rooms.ts
- breadcrumb.tsx
- 2guys1canvas product brief
- avatar.tsx
- harness/architecture.md
- empty.tsx
- multiuser-step06/verify-evidence.cjs
- supabase.ts
- verify-intent-ui.ts
- safeLocalDestination
- progress.tsx
- verify-reliability.ts
- CoCreateProvider
- tabs.tsx
- scripts
- intent-authority.ts
- src_comic
- live-browser-collaboration-check.mjs
- ai-accounting.ts
- auth-config.ts
- ref_class_variance_authority
- button-group.tsx
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
- coordinator-fencing.test.ts
- Responsiveness evidence
- popover.tsx
- 2guys1canvas API reference
- 2guys1canvas
- 2guys1canvas product brief
- verify-coordinator-postgres.ts
- Multi-user Step 03 handoff - 2026-10-03
- input-group.tsx
- Multi-user harness improvement prompts
- isolation.ts
- .insert
- Harness status and outstanding work
- 2guys1canvas contributor instructions
- reproduce.ts
- RoomView
- verify-build-progress.ts
- dropdown-menu.tsx
- CoCreate harness assessment
- Reliability verification — 2026-10-01
- 2guys1canvas
- project.ts
- tooltip.tsx
- Multi-user Step 01 evidence and handoff
- Step 06 handoff — stable progress under ongoing steering
- cocreate.test.ts
- Multi-user Step 04 handoff - 2026-10-04
- documentation-cleanup.md
- measure-responsiveness.ts
- main.tsx
- ui-assets.md
- ByokSetup.tsx
- marker.tsx
- 2guys1canvas current handoff
- Collaborative contradiction-resolution plan
- BuildProgress.tsx
- prisma7.config.ts
- model-evaluation.md
- engines

## God Nodes (most connected - your core abstractions)
1. `RoomManager` - 107 edges
2. `createCoCreateServer()` - 58 edges
3. `EventStore` - 53 edges
4. `Harness decision log` - 50 edges
5. `SupabasePlatform` - 49 edges
6. `react` - 44 edges
7. `2guys1canvas harness implementation checklist` - 40 edges
8. `registerProjectRoutes()` - 34 edges
9. `IsolationRunner` - 30 edges
10. `lucide-react` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Bounded context and cost target` --references--> `AIRunRecord`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/architecture.md → src/types.ts
- `Server contracts` --references--> `RoomView`  [INFERRED]
  docs/harness/contradiction-resolution-plan.md → src/types.ts
- `BYOK-only MVP slice (2026-09-28)` --references--> `main()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/checklist.md → artifacts/multiuser-step06/verify-evidence.cjs
- `Cloudflare availability and collaboration repair evidence (2026-09-18)` --references--> `main()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/checklist.md → artifacts/multiuser-step06/verify-evidence.cjs
- `Historical workspace visual slice — 2026-09-28` --references--> `main()`  [INFERRED]
  docs/harness/archive/2026-10-01-pre-consolidation/product.md → artifacts/multiuser-step06/verify-evidence.cjs

## Import Cycles
- None detected.

## Communities (140 total, 32 thin omitted)

### Community 0 - "RoomManager"
Cohesion: 0.07
Nodes (27): Later-step source audit, ref_node_stream, catalogRate(), effortAllowance(), buildProgressFor(), AIConfig, createCoCreateServer(), acceptedContext() (+19 more)

### Community 1 - "ref_node_assert_strict"
Cohesion: 0.15
Nodes (6): ref_node_assert_strict, ref_node_os, Room, Requirement, pause(), waitFor()

### Community 2 - "requirements.ts"
Cohesion: 0.12
Nodes (31): acceptanceFor(), acceptedClassification(), acceptedRequirements(), alternativeSignature(), blockedRequirementIds(), candidateEntries(), categories, classifications (+23 more)

### Community 3 - "providers.ts"
Cohesion: 0.08
Nodes (32): ref_node_async_hooks, accounting, adapters, anthropic, balancedObject(), bearer(), classify(), deepseek (+24 more)

### Community 5 - "ref_node_fs"
Cohesion: 0.08
Nodes (23): ref_node_child_process, ref_node_fs, ref_node_path, browser, output, profile, browser, outputDir (+15 more)

### Community 6 - "2guys1canvas harness implementation checklist"
Cohesion: 0.05
Nodes (38): 2guys1canvas harness implementation checklist, BYOK-only MVP slice (2026-09-28), Collaboration persistence and auth callback repair (2026-09-26), Collaboration reconnect repair (2026-09-19), Dark editorial presentation slice (2026-09-19), Developer-only managed-model slice — 2026-09-27, Draggable effort toggle and visible project naming (2026-09-25), Email invitations, complete auth, project names, and segmented effort (2026-09-25) (+30 more)

### Community 7 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 9 - "sidebar.tsx"
Cohesion: 0.07
Nodes (12): Sidebar(), SidebarContext, SidebarContextProps, SidebarMenuButton(), sidebarMenuButtonVariants, SidebarRail(), SidebarTrigger(), useSidebar() (+4 more)

### Community 10 - "package.json"
Cohesion: 0.07
Nodes (29): name, private, type, version, cross-env, esbuild, esbuild-wasm, prisma (+21 more)

### Community 11 - "generator.ts"
Cohesion: 0.10
Nodes (27): clean(), demoExtract(), demoOrchestrate(), shell(), AgentChange, boundedInput(), bundleSource(), callOpenAI() (+19 more)

### Community 12 - "ref_lib_utils"
Cohesion: 0.06
Nodes (8): ref_base_ui_react_preview_card, ref_base_ui_react_radio, ref_base_ui_react_radio_group, ref_base_ui_react_separator, ref_base_ui_react_slider, ref_base_ui_react_switch, ref_lib_utils, ref_react_resizable_panels

### Community 13 - "SupabasePlatform"
Cohesion: 0.15
Nodes (5): fail(), hashToken(), normalizeProjectTitle(), SupabasePlatform, ProviderRequestRecord

### Community 14 - "ai-presets.ts"
Cohesion: 0.09
Nodes (30): Named AI connections (preferred API), EVALUATION_PROTOCOL_VERSION, EvaluationSummary, EvaluationTrial, qualifiesModeMapping(), representativeTasks, summarizeTrials(), CatalogEntry (+22 more)

### Community 15 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @cloudflare/containers, cross-env, dotenv, esbuild, esbuild-wasm, express, lucide-react (+17 more)

### Community 16 - "App.tsx"
Cohesion: 0.08
Nodes (31): AgentPanel(), changeEffort(), AISetup(), api(), BuildAccounting(), comparableMetrics(), ConflictChoice(), submit() (+23 more)

### Community 17 - "pagination.tsx"
Cohesion: 0.09
Nodes (4): PaginationLinkProps, ref_components_ui_button, ref_react_day_picker, ref_shadcn_react_message_scroller

### Community 18 - "react"
Cohesion: 0.10
Nodes (3): ref_base_ui_react_input, ref_base_ui_react_scroll_area, react

### Community 19 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "ProjectApp.tsx"
Cohesion: 0.09
Nodes (9): InviteResult, PendingInvite, Project, ProjectList, ProjectMember, ProjectRole, ShareState, Workspace (+1 more)

### Community 21 - "artifacts.ts"
Cohesion: 0.16
Nodes (21): ArtifactBody, artifactHash(), artifactPath(), ArtifactReference, ArtifactUnavailableError, ArtifactVersion, bodyFromBytes(), canonicalJson() (+13 more)

### Community 22 - "multiuser-step05/verify-evidence.cjs"
Cohesion: 0.11
Nodes (15): assert, browser, crypto, decisions, documents, fs, full, graph (+7 more)

### Community 23 - "index.ts"
Cohesion: 0.13
Nodes (19): ref_node_crypto, ref_node_test, ws, browser, dataDir, group, profile, room (+11 more)

### Community 24 - "types.ts"
Cohesion: 0.07
Nodes (30): Shared response models, Migration, aggregatePhysicalUsage(), empty(), PhysicalUsage, setupPurposes, AgentStatus, AIRate (+22 more)

### Community 25 - "combobox.tsx"
Cohesion: 0.06
Nodes (4): ref_base_ui_react, ref_cmdk, ref_components_ui_dialog, ref_components_ui_input_group

### Community 26 - "Harness decision log"
Cohesion: 0.04
Nodes (50): D-0001 — Preserve the existing application while migrating additively, D-0002 — Personal interpretations are proposals, not builder authority, D-0003 — Build from the accepted registry, not the raw canvas, D-0004 — Deletion is not withdrawal, D-0005 — Pause on consequential accepted contradictions, D-0006 — Conflict groups and explicit affected-contributor agreement, D-0007 — Classify per intent and reprocess only by explicit participant action, D-0008 — Submit intent explicitly; collaborate continuously (+42 more)

### Community 27 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+9 more)

### Community 29 - "event-store.ts"
Cohesion: 0.14
Nodes (13): ref_node_sqlite, EventInput, json(), redact(), RunState, StoredEvent, StoredRun, StoredWorkflow (+5 more)

### Community 30 - "intent-commands.ts"
Cohesion: 0.12
Nodes (15): applyIntentCommand(), categories, fail(), intentCommandHash(), parseIntentCommand(), src_intent_review, caption(), Edit (+7 more)

### Community 31 - "drawer.tsx"
Cohesion: 0.13
Nodes (5): DrawerContent(), DrawerContext, DrawerContextProps, useDrawer(), ref_base_ui_react_drawer

### Community 32 - "IsolationRunner"
Cohesion: 0.09
Nodes (28): BASIC_LIMIT, DllImport, EXTENDED_LIMIT, FileSystemRights, IntPtr, IO_COUNTERS, PROCESS_INFORMATION, SecurityIdentifier (+20 more)

### Community 33 - "toggle-group.tsx"
Cohesion: 0.22
Nodes (6): ToggleGroupContext, Toggle(), toggleVariants, ref_base_ui_react_toggle, ref_base_ui_react_toggle_group, ref_components_ui_toggle

### Community 34 - "carousel.tsx"
Cohesion: 0.17
Nodes (13): CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions, CarouselPlugin (+5 more)

### Community 35 - "tool-registry.ts"
Cohesion: 0.13
Nodes (13): ActorType, definitions, digest(), inputSummary(), outputSummary(), stable(), ToolBehavior, ToolContext (+5 more)

### Community 36 - "provider-reconnect.test.ts"
Cohesion: 0.18
Nodes (6): ref_y_protocols_awareness, deletionSignature(), ConnectionStatus, ProviderDependencies, providerInternals, FakeWebSocket

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

### Community 43 - "supabase-platform.ts"
Cohesion: 0.11
Nodes (20): ref_supabase_server_core, RecoveryCheckpoint, decryptSecret(), EncryptedSecret, encryptSecret(), keyFor(), AuthenticatedUser, normalizeInviteEmail() (+12 more)

### Community 44 - "artifact-restoration.test.ts"
Cohesion: 0.27
Nodes (6): yjs, buildFixture(), files, manager(), version(), createArtifactFixture()

### Community 45 - "field.tsx"
Cohesion: 0.17
Nodes (3): Field(), fieldVariants, ref_components_ui_label

### Community 46 - "item.tsx"
Cohesion: 0.18
Nodes (4): Item(), ItemMedia(), itemMediaVariants, itemVariants

### Community 47 - "Workspace"
Cohesion: 0.24
Nodes (11): Reference-led presentation update (2026-09-30), tokenParticipant(), Workspace(), ariaShortcut(), BUILD_SHORTCUT_STORAGE_KEY, BuildShortcutPreference, defaultBuildShortcut(), isBuildShortcut() (+3 more)

### Community 48 - "attachment.tsx"
Cohesion: 0.20
Nodes (4): Attachment(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 50 - "migrate-legacy-to-supabase.ts"
Cohesion: 0.17
Nodes (10): ref_dotenv_config, apply, args, backup, client, dataArg, dataDir, mapping (+2 more)

### Community 51 - "registerProjectRoutes"
Cohesion: 0.11
Nodes (19): express, artifactResponse(), coordinatorRetry, coordinatorResponse(), html(), InvitationDelivery, InvitationEmail, InvitationEmailSender (+11 more)

### Community 52 - "managed-ai.test.ts"
Cohesion: 0.18
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

### Community 57 - "providers.test.ts"
Cohesion: 0.28
Nodes (7): listProviderModels(), adapterFor(), discoverModels(), generateText(), ProviderConfig, withProviderAccounting(), schema

### Community 58 - "layout.tsx"
Cohesion: 0.20
Nodes (7): app_globals, geistMono, geistSans, metadata, nextConfig, ref_next, ref_next_font_google

### Community 59 - "rooms.ts"
Cohesion: 0.09
Nodes (21): ArchivedVersion, ProviderAccountingError, AISettings, authenticatedDelta(), BudgetReservation, BudgetWindow, ClientSocket, colors (+13 more)

### Community 60 - "breadcrumb.tsx"
Cohesion: 0.13
Nodes (8): Badge(), badgeVariants, Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants, ref_base_ui_react_merge_props, ref_base_ui_react_use_render

### Community 61 - "2guys1canvas product brief"
Cohesion: 0.11
Nodes (19): 2guys1canvas product brief, Accepted workflow pivot (2026-09-19), Active MVP (2026-09-28), Active MVP (2026-09-28), Active presentation update (2026-09-30), Authenticated saved projects (2026-09-24), Current reliability and shared context requirement (2026-10-01), Historical managed-model product brief (+11 more)

### Community 63 - "harness/architecture.md"
Cohesion: 0.23
Nodes (7): CoCreate steering entrypoint, graphify, Historical documentation archive, Harness migration plan, Later migrations, Rollback, Safe rollout

### Community 65 - "multiuser-step06/verify-evidence.cjs"
Cohesion: 0.10
Nodes (20): assert, browser, comparison, count(), crypto, decisions, documents, focused (+12 more)

### Community 66 - "supabase.ts"
Cohesion: 0.25
Nodes (7): @supabase/supabase-js, authReturnKey, resolved, supabase, supabaseAppOrigin, supabaseConfigurationError, supabaseOAuthRedirectUrl

### Community 67 - "verify-intent-ui.ts"
Cohesion: 0.11
Nodes (16): Transport and authentication, Browser, browsers, dataDir, fake, inputs, open(), output (+8 more)

### Community 68 - "safeLocalDestination"
Cohesion: 0.36
Nodes (8): safeLocalDestination(), authMessage(), ForgotPassword(), intendedDestination(), Login(), ProjectApp(), Signup(), supabaseAuthCallbackUrl()

### Community 70 - "verify-reliability.ts"
Cohesion: 0.19
Nodes (10): Browser, browsers, dataDir, fake, open(), output, providerAddress, room (+2 more)

### Community 71 - "CoCreateProvider"
Cohesion: 0.26
Nodes (3): SimpleHostedAISetup(), CoCreateProvider, retryDelay()

### Community 72 - "tabs.tsx"
Cohesion: 0.33
Nodes (3): TabsList(), tabsListVariants, ref_base_ui_react_tabs

### Community 73 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, deploy:cloudflare, dev, migrate:legacy, start, test

### Community 74 - "intent-authority.ts"
Cohesion: 0.36
Nodes (7): AcceptedIntentContext, generic, normalize(), sourceWords(), validateSubmittedInterpretation(), InterpretationIntent, SharedRequirement

### Community 76 - "live-browser-collaboration-check.mjs"
Cohesion: 0.33
Nodes (4): browser(), clients, json(), origin

### Community 77 - "ai-accounting.ts"
Cohesion: 0.22
Nodes (13): aggregateCalls(), calculateCharge(), effectiveness(), EffectivenessGroup, maximumAllowanceCharge(), VERIFICATION_POLICY_VERSION, AIRunCall, LegacyAISpecialty (+5 more)

### Community 78 - "auth-config.ts"
Cohesion: 0.38
Nodes (6): legacyKeyProjectRef(), parseOrigin(), required, resolveSupabaseAuthConfig(), SupabaseAuthConfig, SupabaseAuthResolution

### Community 79 - "ref_class_variance_authority"
Cohesion: 0.22
Nodes (6): Alert(), alertVariants, Button(), buttonVariants, ref_base_ui_react_button, ref_class_variance_authority

### Community 80 - "button-group.tsx"
Cohesion: 0.40
Nodes (3): ButtonGroup(), buttonGroupVariants, ref_components_ui_separator

### Community 81 - "reliability.test.ts"
Cohesion: 0.08
Nodes (20): Candidate generation, recovery and promotion, Coordinator and immutable saves, Current harness architecture, Durable authority and storage, Edits, submission and acceptance, Policy and deferred boundaries, Runtime map, Step 05 intent authority and commit boundary (+12 more)

### Community 82 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 84 - "lucide-react"
Cohesion: 0.09
Nodes (5): NativeSelectProps, ref_base_ui_react_accordion, ref_base_ui_react_checkbox, ref_input_otp, lucide-react

### Community 85 - "container.js"
Cohesion: 0.18
Nodes (7): Collaboration connection lifecycle, Cloudflare availability and collaboration repair evidence (2026-09-18), @cloudflare/containers, ref_cloudflare_workers, baseEnv, CoCreateContainer, fetch()

### Community 88 - "oauth-callback.ts"
Cohesion: 0.50
Nodes (3): completeOAuthCallback(), OAuthCallbackOutcome, Callback()

### Community 89 - "request"
Cohesion: 0.33
Nodes (5): needsSessionRefresh(), Projects(), request(), selectedId(), ShareProjectDialog()

### Community 90 - "fixtures/multiuser-baseline.ts"
Cohesion: 0.17
Nodes (13): output, report, trials, Attempt, interpretation(), Observation, pause(), plan() (+5 more)

### Community 92 - "Step 05 handoff — attributable intent and contextual references"
Cohesion: 0.33
Nodes (6): Checks and honest scope, Durability, uncertainty and compatibility, Files and decision, Outcome and reproduced boundary, Step 05 handoff — attributable intent and contextual references, Unrun release dependencies and next step

### Community 95 - "2guys1canvas AI coding instructions"
Cohesion: 0.12
Nodes (16): 2guys1canvas AI coding instructions, Active hosted AI boundary (2026-09-28), Active hosted AI boundary (2026-09-28), Active reliability boundary (2026-10-01), Agent and state rules, Coding conventions, Current naming and UI boundary (2026-09-30), Documentation maintenance in the same change (+8 more)

### Community 99 - "coordinator-fencing.test.ts"
Cohesion: 0.11
Nodes (6): ref_node_http, dir, manager, observations, platform, project

### Community 103 - "2guys1canvas API reference"
Cohesion: 0.17
Nodes (12): 2guys1canvas API reference, Active hosted OpenRouter BYOK (2026-09-28), Authenticated project API (Supabase mode, 2026-09-24), Client integration notes — 2026-09-28, Durable workflow projection, Historical hosted managed AI, Invitation and usage update (2026-09-30), Legacy AI routes (local compatibility only; hosted routes return 410) (+4 more)

### Community 104 - "2guys1canvas"
Cohesion: 0.14
Nodes (14): 2guys1canvas, Active hosted MVP: OpenRouter BYOK, AI steering documents, Architecture, Checks, Connect AI, Current boundaries, Current product setup (2026-09-30) (+6 more)

### Community 105 - "2guys1canvas product brief"
Cohesion: 0.25
Nodes (8): 2guys1canvas product brief, Accepted future work, Accounts, saved projects and sharing, Build recovery and evidence, Collaborative steering and authority, Hosted AI and limits, Mission, users and scope, Shared context, recorded usage and requested appearance

### Community 106 - "verify-coordinator-postgres.ts"
Cohesion: 0.13
Nodes (11): pg, a, admin, b, checks, ownerA, ownerB, project (+3 more)

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
Cohesion: 0.07
Nodes (33): ref_node_events, ref_node_module, ref_node_net, ref_node_url, BYOK_LEASE_MS, BYOK_MODEL_VERSION, Lease, LeaseModel (+25 more)

### Community 112 - "Harness status and outstanding work"
Cohesion: 0.12
Nodes (16): Accepted deferred implementation, Context, accounting and recovery, Current implementation and dated evidence, Documentation cleanup verification, Durable workflow control and permissions, Evidence conventions, Execution, tools and evidence, Harness status and outstanding work (+8 more)

### Community 113 - "2guys1canvas contributor instructions"
Cohesion: 0.29
Nodes (7): 2guys1canvas contributor instructions, Permissions, persistence and sharing, Recovery, accounting and secrets, Stack and coding, Start and maintain authority, Validation and documentation maintenance, Workflow and source ownership

### Community 114 - "reproduce.ts"
Cohesion: 0.40
Nodes (3): changed, original, shared

### Community 115 - "RoomView"
Cohesion: 0.12
Nodes (17): 2guys1canvas implemented API contracts, Active temporary OpenRouter routes, Authenticated project routes, Local compatibility only, Preview and download, Room reads, submissions and decisions, Shared response models, Step 05 intent command contracts (+9 more)

### Community 116 - "verify-build-progress.ts"
Cohesion: 0.15
Nodes (15): address, Browser, browsers, candidates, converge(), dataDir, fake, gates (+7 more)

### Community 118 - "CoCreate harness assessment"
Cohesion: 0.40
Nodes (5): CoCreate harness assessment, Existing capabilities preserved, First vertical slice selected, Material gaps found, Second verified slice — shared intent

### Community 120 - "Reliability verification — 2026-10-01"
Cohesion: 0.29
Nodes (7): Executed checks, Implemented behavior, Reference availability update — 2026-10-02 (documentation only), Reliability verification — 2026-10-01, Remaining verification and operational limits — original 2026-10-01 run, Scope and verified causes, Step 05 local intent verification — 2026-10-04

### Community 121 - "2guys1canvas"
Cohesion: 0.33
Nodes (6): 2guys1canvas, Checks and boundaries, Contributor entrypoints, Hosted configuration and release prerequisites, Hosted setup and use, Start locally

### Community 122 - "project.ts"
Cohesion: 0.11
Nodes (28): Outcome and responsible boundary, ref_node_path_posix, addUsage(), recoverProjectPlan(), RecoveryCheckpoint, taskSchema, generateProjectPlan(), mergeUsage() (+20 more)

### Community 124 - "Multi-user Step 01 evidence and handoff"
Cohesion: 0.40
Nodes (5): Multi-user Step 01 evidence and handoff, Outcome and scope, Reproduction and measurements, Scenario inventory, Verification and file handoff

### Community 125 - "Step 06 handoff — stable progress under ongoing steering"
Cohesion: 0.33
Nodes (6): Files and compatibility, Handoff and outstanding dependencies, Measured comparison, Outcome and policy, Step 06 handoff — stable progress under ongoing steering, Verification and retained attempts

### Community 126 - "cocreate.test.ts"
Cohesion: 0.53
Nodes (3): keepLastSuccess(), shouldPromoteRevision(), previewDocument()

### Community 127 - "Multi-user Step 04 handoff - 2026-10-04"
Cohesion: 0.40
Nodes (5): Exact checks and what they establish, Files and decision, Multi-user Step 04 handoff - 2026-10-04, Next task, Prepared deployment and remaining prerequisites

### Community 128 - "documentation-cleanup.md"
Cohesion: 0.40
Nodes (4): Authority and changes, Documentation validation and remaining limits, Evidence inspected, Harness documentation cleanup — 2026-10-02

### Community 129 - "measure-responsiveness.ts"
Cohesion: 0.38
Nodes (6): ref_node_fs_promises, ref_node_perf_hooks, median(), run(), Sample, wait()

### Community 130 - "main.tsx"
Cohesion: 0.29
Nodes (6): ref_react_dom_client, App, ProjectApp, src_studio_ivory, src_styles, clientAuthMode

### Community 132 - "ByokSetup.tsx"
Cohesion: 0.33
Nodes (6): AdvancedAISetup(), ByokSetup(), run(), Lease, request(), AIConnection

### Community 134 - "2guys1canvas current handoff"
Cohesion: 0.67
Nodes (3): 2guys1canvas current handoff, Next work, Read next

### Community 135 - "Collaborative contradiction-resolution plan"
Cohesion: 0.50
Nodes (4): Acceptance tests, Collaborative contradiction-resolution plan, Server contracts, UI

### Community 136 - "BuildProgress.tsx"
Cohesion: 0.50
Nodes (3): src_build_progress, BuildProgress(), BuildProgress

## Knowledge Gaps
- **713 isolated node(s):** `supabase`, `$schema`, `singleQuote`, `printWidth`, `sortPackageJson` (+708 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1230 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `main.tsx`, `menubar.tsx`, `marker.tsx`, `ByokSetup.tsx`, `sidebar.tsx`, `package.json`, `App.tsx`, `pagination.tsx`, `ProjectApp.tsx`, `combobox.tsx`, `context-menu.tsx`, `intent-commands.ts`, `drawer.tsx`, `toggle-group.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `toast.tsx`, `field.tsx`, `item.tsx`, `attachment.tsx`, `dialog.tsx`, `select.tsx`, `breadcrumb.tsx`, `avatar.tsx`, `ref_class_variance_authority`, `lucide-react`, `table.tsx`, `popover.tsx`, `input-group.tsx`, `dropdown-menu.tsx`, `card.tsx`?**
  _High betweenness centrality (0.241) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `carousel.tsx`, `menubar.tsx`, `ByokSetup.tsx`, `toast.tsx`, `sidebar.tsx`, `package.json`, `context-menu.tsx`, `App.tsx`, `pagination.tsx`, `dialog.tsx`, `ProjectApp.tsx`, `dropdown-menu.tsx`, `navigation-menu.tsx`, `select.tsx`, `combobox.tsx`, `breadcrumb.tsx`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `yjs` connect `artifact-restoration.test.ts` to `measure-responsiveness.ts`, `ref_node_assert_strict`, `coordinator-fencing.test.ts`, `provider-reconnect.test.ts`, `local-drafts.test.ts`, `live-collaboration-check.mjs`, `package.json`, `supabase-platform.ts`, `App.tsx`, `reliability.test.ts`, `fixtures/multiuser-baseline.ts`, `rooms.ts`, `cocreate.test.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Are the 32 inferred relationships involving `createCoCreateServer()` (e.g. with `.applyRecommendedAI()` and `.assignAI()`) actually correct?**
  _`createCoCreateServer()` has 32 INFERRED edges - model-reasoned connections that need verification._
- **What connects `supabase`, `$schema`, `singleQuote` to the rest of the system?**
  _713 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RoomManager` be split into smaller, more focused modules?**
  _Cohesion score 0.0749084249084249 - nodes in this community are weakly interconnected._
- **Should `ref_node_assert_strict` be split into smaller, more focused modules?**
  _Cohesion score 0.14761904761904762 - nodes in this community are weakly interconnected._