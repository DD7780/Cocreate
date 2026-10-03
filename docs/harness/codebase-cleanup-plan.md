# Codebase cleanup and inexpensive Jev assistance

Plan prepared 2026-10-03 and implementation authorized 2026-10-04. The findings below describe the pre-cleanup snapshot; [implementation evidence](codebase-cleanup-verification.md) records completed slices, actual checks and remaining limits. No migration or deployment is performed by this cleanup. The reported regressions have not been individually reproduced.

Correction from implementation call-site checks: `AdvancedAISetup` and its parent setup components were defined but unmounted. Current `Workspace` opens `ByokSetup`; the unused UI chain can be removed while preserving supported server APIs and historical data. The earlier instruction below to retain that component was based on an incomplete parent-call check.

Follow-up: the supplied credential was Vercel-issued, so the implemented CLI now supports Vercel AI Gateway's TypeSafe-compatible endpoint and model ID as well as direct TypeSafe. A 20-file historical triage succeeded; one protected migration tool was incorrectly flagged at low confidence and retained. The 20-feature comparative/holdout evaluation below remains proposed; see [actual evidence](codebase-cleanup-verification.md).

## Recommendation

Reduce misleading context first, remove proven unused scaffold second, and extract responsibilities from the largest modules in small verified changes. Use Graphify to retrieve relevant relationships, deterministic tools to establish usage and enforce boundaries, and Jev optionally to rank ambiguous candidates and feature context. Keep the coding agent responsible for proposing edits and the compiler/tests responsible for verification.

Jev makes typed judgments; it does not generate code or replacement files. It is useful as a cheap reviewer and context selector alongside a coding agent. [TypeSafe guidance for coding agents](https://docs.typesafe.ai/introduction/coding-agents)

Do this as an offline development workflow. Adding Jev to participant submissions or the running application is outside this plan. Preserve the existing hosted BYOK boundary and inference-free writing and settings.

## Findings and limits

Graphify supplied the initial navigation; literal-import analysis and source reads checked the findings. The graph covers 199 source/document/configuration files. A separate audit parsed 150 TypeScript/JavaScript files, resolving local imports and re-exports, literal dynamic imports, and type imports conservatively. Roots included the active browser/server/container entrypoints, all test and script files, and Vite/Prisma configuration. These counts describe this snapshot, not a complete proof of dead code.

| Finding | Evidence | Implication |
| --- | --- | --- |
| 65 likely scaffold files, about 249 KB, have no import path from those roots | 60 files under `components/ui/`; `app/layout.tsx`, `app/page.tsx`, `hooks/use-mobile.ts`, `lib/utils.ts`, `next.config.ts`. The active client starts in [src/main.tsx](../../src/main.tsx). | First removal candidates after build, entrypoint, package-script and external-use checks. They are not authorized deletions. |
| An additional unreachable file must stay | [src/vite-env.d.ts](../../src/vite-env.d.ts) supplies ambient declarations. | Import reachability alone cannot decide deletion. |
| Very large compressed modules | [server/rooms.ts](../../server/rooms.ts): about 92 KB in 275 lines; [src/App.tsx](../../src/App.tsx): about 83 KB in 220 lines. [src/ProjectApp.tsx](../../src/ProjectApp.tsx), [server/index.ts](../../server/index.ts), and [server/providers.ts](../../server/providers.ts) are also compressed. | A feature change can expose many unrelated responsibilities to the editing agent. Reformat and extract separately. |
| Shared contracts were located under the client directory | Server modules imported `src/types.ts`; `rooms.ts` also imported `src/document-state.ts`. They now live in [shared/types.ts](../../shared/types.ts) and [shared/document-state.ts](../../shared/document-state.ts). The helper computes Yjs deletion receipts without browser DOM dependencies. | Make the shared boundary explicit; do not mistake every server-to-`src` import for a browser dependency. |
| Obsolete-looking functions have no other literal references in the audited source | `LegacyAISetup` in `src/App.tsx`; `bundleSource`, `generateProduct`, and `previewHtml` in [server/generator.ts](../../server/generator.ts). | Check exports, runtime consumers and tests before individual removal. The old generation prompt also supplies misleading architectural context. |
| Historical guidance competes with current guidance | [instructions.md](../../instructions.md) repeats the hosted BYOK section verbatim and retains superseded managed-default guidance below it. [product.md](../../product.md), [context.md](../../context.md), and [architecture.md](architecture.md) mix dated directions. | Give agents a concise current contract with explicitly linked history. Preserve historical evidence and accepted decisions. |
| Some runtime dependencies have no source import in this audit | `@prisma/adapter-pg`, `@prisma/client`, `@supabase/ssr`, `pg`. [README.md](../../README.md) documents future SSR and Prisma CLI/introspection use. | Audit purpose and deployment use individually. Retain Prisma configuration/schema and authoritative SQL migrations. Do not remove dependencies from import counts alone. |

There were no static runtime import cycles in this audit. The apparent `generator.ts`/`demo.ts` cycle includes a type-only import. No client-to-server source import was found. These checks do not establish the cause of UI/backend regressions: shared contracts, state handling, broad edits, and contradictory instructions are plausible risks, not proven diagnoses.

The tree-sitter grammar reported parse errors in some compressed modules; this is an extractor limitation, not proof that TypeScript compilation fails. Nonliteral dynamic loads, external consumers, configuration discovery and generated declarations require separate checks. Graph proximity and community degree are not runtime dependency evidence.

## Protected behavior

Before every stage, retain the current contracts in [instructions.md](../../instructions.md), [architecture.md](architecture.md), [decisions.md](decisions.md), and [api.md](../../api.md):

- The durable workflow and its commands, tasks, events, decisions and artifacts remain authoritative. One logical coordinator serializes integration and promotion.
- Typing and reconnecting do not invoke inference. Build my changes and editor-focused Alt+X submit only the authenticated participant's steering through the same flush-acknowledged, idempotent path.
- Pending submissions, accepted snapshots, insertion clocks **and deletion ranges**, replay receipts, coordinator fencing, and last compiled artifact recovery retain their semantics.
- Ordered recovery tasks, awaited checkpoints, and the shared 24-physical-call executor ceiling stay intact across repairs, retries and superseded candidates.
- Hosted inference remains temporary OpenRouter BYOK with explicit owner choices and spending permission; no credential/model/managed fallback.
- Historical billing/usage records, storage identifiers, auth/membership authority, SQL migrations, and uncertain usage are preserved. Local advanced provider setup is distinct from obsolete hosted setup.

The prepared coordinator-fencing migration remains unapplied and live-unverified. Refactoring is not permission to apply it.

## Ordered implementation

Each stage produces a small reviewable change. Do not combine framework changes, formatting, removals and orchestration changes in one patch.

### 0. Establish a runnable baseline

Preserve the existing dirty Graphify/steering work. Restore the documented pnpm environment and install from the existing lockfile with `pnpm install --frozen-lockfile`, then run `pnpm test` and `pnpm build`. Record failures before edits. Use an isolated checkout/worktree or otherwise preserve current changes; do not reset the workspace.

Check local and hosted-mode behavior separately: writing and submission; accepted requirements and preview recovery; AI setup/reconnect and usage. Use controlled providers first. Reproduce one concrete reported UI/backend regression when available, with a before/after symptom and a regression check.

At planning time Node was available, `pnpm --version` failed because pnpm was absent, and the local TypeScript installation was absent. Application tests/build were not rerun. The 129/129 result in the steering documents is historical October 1 evidence.

### 1. Make current context unambiguous

Keep the canonical steering filenames. Replace repeated active rules with one current section; move superseded detailed plans to explicitly dated history with links. Preserve accepted decisions and verification limits. Give the agent a short current architecture/entrypoint map rather than every historical design direction.

Create a feature change packet: requested outcome, current relevant rules, allowed files, required shared contracts, graph-selected neighbors, relevant tests, and verification commands. Confirm graph-derived facts against source. This improves context before any risky refactor.

Gate: current BYOK, submission, save-receipt and recovery rules are findable once; historical directions cannot be mistaken for active requirements. No product behavior changes.

### 2. Remove proven obsolete scaffold

Review the 65 unreachable scaffold candidates as one coherent legacy UI/framework group. Check `index.html`, build configuration, package scripts, deployment/container inputs, literal and nonliteral loads, ambient declarations, and external uses. Review `app/globals.css`, `components.json`, and the unimported `src/comic.css` separately. Keep both actively imported stylesheets, `src/styles.css` and `src/studio-ivory.css`.

Use the package manager for justified dependency changes and keep the lockfile synchronized. Confirm whether unused Prisma runtime packages should be removed or belong to tooling; retain the introspection workflow until an explicit replacement exists. Remove documented speculative SSR support only after its future role is intentionally retired.

Gate: build and full existing suite pass; startup/deployment inputs still resolve; active screens behave the same. A missing reference in Graphify is insufficient evidence.

### 3. Remove unused functions individually

Audit `LegacyAISetup`, `bundleSource`, `generateProduct`, and `previewHtml` for callers and exported consumers. Remove only independently proven dead functions and now-unused imports. `generateProjectPlan`, `validateSource`, current preview generation, and demo interpretation remain unless separately proven obsolete. Implementation corrected the initial local-flow assumption: `AdvancedAISetup` and its parents are unmounted and were removed; supported local server APIs remain.

Gate: compiler and relevant generation/preview/setup tests pass, then full suite/build. Do not delete an entire imported module because one export is unused.

### 4. Clarify shared boundaries

Proposed target: a small `shared/` directory for public contracts and the pure Yjs receipt helper. Update TypeScript `include` and all import paths deliberately. Use temporary compatibility re-exports only when needed during migration, then remove them after callers move.

Keep runtime validation at HTTP/WebSocket and persisted-state boundaries. Moving a type does not validate data. Characterize current request/response and event shapes, optional usage fields, deletion-only save receipts, and local/hosted differences before changing their owners.

Gate: browser modules do not import server implementation; server modules do not import browser UI. Tests compare externally observable behavior and durable state, not only type names. Synchronize `api.md` if an implemented contract actually changes.

### 5. Extract large modules without changing authority

First reformat one compressed file in a dedicated mechanical change, using a pinned formatter and inspecting syntax/behavior equivalence. Then extract small responsibilities with the current facade and behavior preserved:

- Client: workspace presentation, agent/requirement panels, conflict/usage views, setup dialogs, and editor/transport hooks. Keep local and hosted setup distinctions visible.
- Server: pure view/usage projections first, then provider configuration, then submission persistence and build coordination only after characterization checks. Retain `RoomManager` as the facade until ownership is explicit.
- CSS: remove proven unused styles after browser checks; isolate preview styles and retain accessible controls, reduced motion and responsive behavior.

Keep one coordinator, one accepted baseline, existing queues/fences and shared retry accounting. Module extraction must not introduce independent writers or replacement state stores. Do not rewrite the application in another framework.

Gate: targeted tests plus full suite/build; browser checks for changed interactions and viewports. Relevant existing checks include `reliability`, `hosted-reliability`, `build-shortcut`, `provider-reconnect`, `conflict-route`, `local-drafts`, `usage-ledger`, and `project-auth` tests. Inspect browser scripts' intended mode before treating older setup labels as obsolete. Preserve label assertions when they are actual UX contracts; use stable roles/selectors for incidental navigation.

### 6. Prevent future broad changes

Use the feature packet as a scope gate. A UI-only change should not edit backend authority or persisted-state code without an explicit shared-contract reason. Automate import-boundary and changed-file checks. Required protocol/authority neighbors and tests always enter context, even if Jev rates them low. High-risk shared-contract changes still run the full suite.

After application code changes, run `graphify update .`, inspect coverage and restore/refresh the source-map supplementation where necessary. AST-only updates do not recreate every curated relationship for CSS/configuration/document concepts; consult [SOURCE_MAP.md](../../graphify-out/SOURCE_MAP.md). Update affected canonical steering documents in the same change.

## Jev pilot design

Start report-only, using a local development CLI, not a new product feature. No API integration has been implemented in this planning change.

1. Code builds evidence packets: file hash, entrypoint reachability, importers, export references, package/config uses, active versus historical role, relevant snippets, change brief, and applicable protected contracts. Exclude secrets and runtime customer data.
2. Graphify and lexical search retrieve a shortlist. Keep mandatory contracts outside optional filtering. Jev cannot recover a needed file omitted from retrieval. [TypeSafe reranking workflow](https://docs.typesafe.ai/cookbooks/rerank_typesafe)
3. Ask independent typed questions over each shared packet: a **Choice** between active, test/tooling, compatibility/history, obsolete-scaffold candidate, and uncertain; a **Score** of relevance to this particular feature; optionally a **Choice** selecting an evidence ID or "insufficient evidence". Code turns selected IDs into source excerpts. Jev does not generate an explanation or deletion patch.
4. Batch independent questions in one request. Dependent questions require a later call because parallel answers do not see one another. Use the documented `state` and `questions` API, with Choice criteria keyed by option and Score criteria as descriptive ordered levels. [API](https://docs.typesafe.ai/api), [fan-out](https://docs.typesafe.ai/patterns/fan-out)
5. Pin the evaluated model, initially `jev-1.13.0`. Cache on model, source/dependency hashes, graph snapshot, policy/question versions and change brief. Invalidate answers when any of these change. Log actual input-token usage and every physical request/retry; keep API credentials outside browser code and repository logs.
6. A coding agent reviews the report and proposes bounded edits. Deterministic scope checks, compiler, tests and browser verification decide whether the change passes. No Jev answer triggers automatic deletion, migration or promotion.

Confidence expresses concentration of model answers, not proof of correctness. Calibrate thresholds using this repository; do not interpret a value of 0.95 as a 95% safe-deletion guarantee. Compute reachability, counts, dates, token budgets and spend in code. Keep evidence small: the model's documented weaknesses include multi-hop reasoning and irrelevant context. [Confidence guidance](https://docs.typesafe.ai/confidence), [Jev 1.13 limitations](https://docs.typesafe.ai/model-jaggedness/jev-1.13)

Evaluate 20 representative historical feature prompts before relying on ranking: five UI, five backend, five shared-contract and five ambiguous changes. Label required files/tests with source review; include ambient declarations, type-only imports, historical financial records and local-mode setup as traps. Compare Graphify/search alone with Graphify/search plus Jev. Measure required-file recall, false obsolete classifications, context size, real input-token usage and total coding/verification cost. Keep a holdout subset. Require zero missed protected contracts and zero false deletion clearance in the pilot; this small result does not establish universal safety. If Jev adds no measurable benefit, retain the deterministic workflow alone.

## Cost estimate

Current listed pricing is **$0.042 per million input tokens**, with free output tokens. The documented limits are 64K total request tokens and 32K for state plus the longest single question. Keep packets substantially smaller. These are current provider specifications, not repository measurements. [Models and pricing](https://docs.typesafe.ai/models)

Compute `cost_usd = billed_input_tokens / 1_000_000 * 0.042` using actual API usage. These examples assume complete billed input, including questions:

| Example | Assumed billed input | Jev estimate |
| --- | ---: | ---: |
| 20 pilot packets, 6,000 tokens each | 120,000 | $0.00504 |
| One 199-file pass, 6,000 tokens each | 1,194,000 | $0.050148 |
| 100 feature-context queries, 3,000 tokens each | 300,000 | $0.0126 |

One pass can therefore cost about five cents under these assumptions. Two complete passes would be about $0.1003 before retries. Actual packets may be larger or smaller; static checks and cache hits need no Jev calls. Coding-agent tokens, installation, tests and review time are excluded and may dominate total cost.

Use a $0.10 initial operating target, bounded request/retry counts and a usage ledger. An estimate is not a hard provider-side spending cap; configure an account limit if available and required. Do not silently retry indefinitely or switch models after failure: retain the uncertain candidate for review. No paid requests were made to establish this plan.

## Completion criteria and next slice

Success means fewer misleading files in feature context, explicit client/shared/server boundaries, smaller responsibilities, and preserved behavior—not a target number of deletions. Measure context reduction against the 20-prompt baseline, aiming initially for 40% fewer optional context tokens while retaining every labeled required contract. This is a target, not a measured improvement.

For each implementation slice: record reference evidence, preserve protected behavior, pass applicable checks, refresh graph coverage, update steering, and retain a reversible patch. Run local/hosted-mode verification appropriate to the slice. Do not claim live hosted behavior from mocks.

The first implementation slice should establish the baseline and clean up duplicated/superseded steering context. The first code-removal slice should then validate and remove only the legacy scaffold group. Jev evaluation can run alongside that inventory; it is not a prerequisite for the free deterministic cleanup.

Graphify query trace: vocabulary expansion used `legacy entrypoints dependencies room workflow provider requirements configuration shared types styles historical`; scoped queries navigated entrypoints, RoomManager, shared public types, and current/historical hosted boundaries. Subsequent source checks, not graph degree, supplied the removal candidates above. This plan and its new steering entries are documentation-only additions and have not received a fresh graph extraction.
