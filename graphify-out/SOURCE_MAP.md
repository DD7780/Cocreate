# Repository graph coverage and source-map checkpoints

Current cgroup/www/fingerprint candidate AST checkpoint 2026-10-08: 2,126 nodes, 5,011 edges, 121 communities; [raw update](../artifacts/prelaunch-release-resume/cgroup-graph-final.log), no LLM calls. SQL parser/semantic labels remain historical. This records candidate source relationships, not Linux/hosted acceptance.

Deployment repair lifecycle AST refresh 2026-10-08: 2,078 nodes, 4,951 edges and 113 communities, without LLM calls; [raw refresh](../artifacts/prelaunch-domain-release/repair-graphify-lifecycle.log). SQL parser remains unavailable; this does not refresh historical semantic layers or prove live behavior.

Linux CI preparation AST checkpoint 2026-10-08: 2,069 nodes, 4,936 edges, 122 communities; zero LLM calls. SQL parser remains absent and curated semantic labels remain dated. Application runtime/hosted acceptance is separate.

Custom-domain AST checkpoint 2026-10-08: 2,067 nodes, 4,930 edges, 108 communities; [refresh](../artifacts/prelaunch-domain-release/graphify.log), zero LLM calls. SQL parser is absent, and previous community labels/curated semantics remain dated. Live migration status is separately observed applied in the [release packet](../docs/harness/prelaunch-domain-release.md); AST output proves no hosted behavior.

Pre-launch AST checkpoint 2026-10-07: Graphify 0.9.78 refreshed 2,058 nodes, 4,914 edges and 113 communities using the ignored workspace runtime, without LLM calls. [Query and refresh evidence](../artifacts/prelaunch-beta/graphify-final.log) accompany the landing/beta change. Optional SQL AST parser is still absent; migration statements and prepared database checks require direct review/authorized execution. This does not refresh every curated document semantic, historical inventory or old label, and establishes no hosted behavior.

Full cleanup checkpoint refreshed 2026-10-04 with Graphify 0.9.61 and its Windows workflow after the authorized codebase cleanup. Graph coverage is separate from application, hosted-provider and deployment verification.

## GitHub integration AST refresh (2026-10-04)

After integrating `origin/codex/byok-mvp` through `472698a` into the cleanup branch, `graphify update .` completed without LLM/API calls: **1,870 nodes, 3,983 edges, 112 communities, 0 dangling endpoints**. New intent-authority/commands/review, private artifact restoration, coordinator retry and isolated compiler modules are represented. [sync-ast-diagnostics.json](sync-ast-diagnostics.json) records actual represented-file fingerprints and limits. Community names follow current hubs; no LLM relabeling ran.

This refresh is structural. Changed document/CSS/image semantic relationships were not re-extracted. The full curated inventory and raw-relationship evidence below describe the earlier cleanup checkpoint, not complete current semantic coverage. The CLI preserved that curated checkpoint in its ignored dated backup before rebuilding. Application test/build evidence is in [the integration checklist](../docs/harness/checklist.md#github-branch-integration-2026-10-04), separate from graph integrity.

## Cleanup full-map checkpoint (before GitHub integration)

- **144/144 project files in scope** have graph representation and current SHA-256 fingerprints. The native corpus includes 111 code/configuration files, 22 project documents and one SVG. Ten additional files receive explicit file/schema/reference coverage, including CSS, Dockerfile, Wrangler JSONC and Prisma declarations. Graphify also reinjects one dated planning-memory document, which is marked historical.
- **1,511 nodes, 3,830 projected edges, 92 named communities.** The prior full map contained 2,017 nodes, 4,792 edges and 199 project files. Removed scaffold is pruned; shared contracts, extracted UI/room helpers, audit tooling, CI and current steering are mapped.
- Full AST extraction completed without failed sources. Semantic fragments and source hashes match current files. At completion, incremental detection reports zero changed/deleted supported files.
- [source-inventory.json](source-inventory.json) records project source fingerprints. [relationships.json](relationships.json) preserves all **4,681 raw relationships**, with direction, source location and confidence, before graph projection.

`.graphifyignore` excludes `.codex/`, graph outputs, generated `artifacts/`, lockfile entries and dated `docs/harness/history/` snapshots. Current steering links to complete historical snapshots when needed. Dependency declarations remain indexed through `package.json`. Ignored local data, dependencies, builds and environment secrets stay outside the corpus. `.env.example` has template file representation only; environment values are not graph content. The credential scan passed.

## Start here

| Area | Sources | Boundary |
| --- | --- | --- |
| Browser entry and auth | `index.html`, `src/main.tsx`, `src/ProjectApp.tsx` | Vite mount and authenticated project navigation |
| Editor and setup | `src/App.tsx`, `src/ByokSetup.tsx`, `src/api.ts` | Workspace facade, current BYOK surface and request helper |
| Context and usage views | `src/workspace/`, `src/ai/` | Decisions/accounting presentation and display/options |
| Shared contracts | `shared/types.ts`, `shared/document-state.ts` | Browser/server types and pure deletion-receipt support |
| Workflow authority | `server/rooms.ts`, `server/room-state.ts`, `server/steering-text.ts`, `server/requirements.ts` | One coordinator, attributed steering and accepted revisions |
| Durability and recovery | `server/coordinator.ts`, `server/event-store.ts`, `server/build-recovery.ts` | Durable checkpoints, fencing and bounded recovery |
| Hosted authority | `server/supabase-platform.ts`, `server/project-routes.ts`, `supabase/migrations/` | Membership, invitations, persistence and named SQL RPC references |
| Providers and usage | `server/byok-lease.ts`, `server/providers.ts`, `server/usage-ledger.ts` | Temporary lease, physical dispatch and partial usage |
| Developer checks | `scripts/codebase-audit.ts`, `tests/codebase-audit.test.ts`, `.github/workflows/code-checks.yml` | Static boundaries/scope, advisory Jev review and source verification |
| Deployment and schema | `Dockerfile`, `wrangler.jsonc`, `worker/container.js`, `prisma/` | Build/start links and database introspection declarations |
| Styles | `src/styles.css`, `src/studio-ivory.css` | Loaded CSS references; no CSS language AST |
| Product authority | Current root steering, `api.md`, `docs/harness/` | Implemented contracts, dated plans and evidence limits |

Historical managed accounting/modules, SQL migrations and accepted decisions remain available for compatibility. The unmounted Advanced/managed setup functions and inactive Next.js/component scaffold were removed. Dated planning memory describes pre-cleanup candidates; it does not restore deleted code or override current policy.

## Integrity and limits

[diagnostics.json](diagnostics.json) records **zero missing/dangling endpoints and zero exact duplicate edges**. External modules remain marked external. Five known false member self-calls were corrected using their source (`response.json`, hash `.digest`, store `.merge`, and container `.fetch`). One false dynamic import from the audit test's source-text fixture was removed; it never loaded a real `tests/App` module.

Six genuine recursive self-links remain. There are 347 raw parallel relationships sharing endpoints in the undirected projection. Graphify consolidates file representations and suppresses some import/containment edges. The refresh removes 40 containment self-loops created during consolidation. Use `relationships.json` for individual call sites, relation variants and direction. Static call resolution remains approximate; these corrections do not prove every call edge exact.

SQL extraction covers seven migrations and the RLS test with local `tree-sitter-sql==0.3.11`; this is a Graphify tooling dependency. Prisma coverage describes models/enums and referenced field types, not live database state. Unsupported configuration and CSS have file/reference coverage rather than full language ASTs. The prepared coordinator-fencing migration remains unapplied and live-unverified.

## Verification and accounting

Ran `graphify update . --force`, full AST extraction, parallel host-agent semantic refresh, supplementary source links, named community export, HTML generation, source/semantic hash checks, diagnostics and representative queries. Application cleanup evidence—133 tests, strict compilation, local/default builds and controlled three-profile browser checks—is in [cleanup verification](../docs/harness/codebase-cleanup-verification.md). Live hosted/provider/deployment claims remain limited there.

AST extraction used no model tokens or provider API. Host semantic token telemetry is unavailable; [cost.json](cost.json) records it as unknown and preserves earlier known totals. Jev's separate successful 20-file Vercel triage and earlier failed dispatches are recorded in audit evidence, not counted as Graphify provider calls. The adapter uses separate credential/endpoint/model identities; the gateway alias is explicitly unpinned and has a bounded cache lifetime. Graphify's sample benchmark estimated about 4.5x fewer query tokens; this is a corpus-sizing estimate, not measured billing or answer quality.

After later edits, `graphify update .` refreshes supported structure. It does not recreate document meaning or supplementary CSS/Prisma/configuration links. Whole-repository refreshes must update those layers, diagnostics and fingerprints together.
