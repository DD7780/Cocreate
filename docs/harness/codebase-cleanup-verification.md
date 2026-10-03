# Codebase cleanup verification

Implementation slice, 2026-10-04. The user authorized cleanup, Jev assistance and a push to the existing repository. [The plan](codebase-cleanup-plan.md) retains the pre-cleanup findings and the correction to the Advanced setup assumption.

## Changes

- Removed 65 import-unreachable legacy TS/JS scaffold files: 60 `components/ui/` files and the inactive Next.js entry/config plus old hook/util files. Removed associated `app/globals.css`, `components.json` and unimported `src/comic.css`: 68 files total. The active Vite entry, both loaded stylesheets, ambient declarations, migrations and persisted compatibility contracts remain.
- Removed unmounted `LegacyAISetup`, Advanced/managed setup parent chain and exclusively used UI helpers. Current Workspace still opens ByokSetup. Removed unused `bundleSource`, `generateProduct`, `previewHtml`, their schema/imports and the obsolete demo renderer; retained demo interpretation, project generation and supported server APIs.
- Moved public types and the pure Yjs deletion receipt helper into `shared/`, updating imports and TypeScript scope. Extracted context/conflict and build-accounting views, shared display/options/request helpers, pure steering text and server room-state declarations. RoomManager retains one coordinator and its queues, ownership, persistence, accounting and promotion semantics.
- Formatted six compressed modules separately before refactoring. Compared emitted JavaScript ASTs, normalizing redundant parentheses, object-key quoting and adjacent React text children: no semantic differences found. An auth source guard tied to exact whitespace was made format-tolerant without removing its auth-flow assertions.
- Replaced repetitive current steering with concise canonical documents; relocated complete dated snapshots into linked `history/`, outside default Graphify context. Accepted decisions and evidence limits remain. Added a feature packet, import/scope audit and GitHub test/build checks.
- Removed unused speculative `@supabase/ssr`. Prisma client/adapter and `pg` remain as pinned development/introspection tooling; SQL migrations remain authoritative. pnpm is pinned to the verified 10.18.3, with the existing four build-script allowances expressed in its supported configuration.

## Local evidence

Initial baseline: `corepack pnpm@10.18.3 install --frozen-lockfile`, **129/129 tests**, and production build passed. The install restored the missing local toolchain without changing dependency versions.

After removal and extraction: **133/133 tests passed** with `pnpm test`; `pnpm check:boundaries` audited 94 TS/JS files with **zero static unreachable candidates, zero client/server/shared boundary violations**, and no unresolved local-code import/parse failures. The four added tests cover conservative usage handling, boundary/unknown-load reporting, UI/worker and documentation-only scope rejection, and untrusted Jev answers. Scope checks include all nonignored untracked files. Local audit artifacts are also excluded from Docker build inputs. Counts are a snapshot, not proof against external/dynamic/configuration use.

A submission test transiently hit its five-second deadline during concurrent compiler/browser work. Its failure diagnostics now include workflow/error/call counts; the isolated rerun and full 133-test run passed without weakening its assertions or increasing its timeout.

The controlled browser script initially timed out because it served a default hosted-mode build without hosted configuration. Rebuilding with `VITE_COCREATE_AUTH_MODE=local` resolved that mismatch. Three independent signed local Chrome profiles then passed simultaneous submission, third-participant unsubmitted-draft isolation, offline edits, reconnect without inference, convergence of accepted requirements/artifacts/usage, selected revision views, and layouts at 1024/768/390 px. Three interpretation calls and two builder calls used synthetic provider responses. Evidence stays in ignored `artifacts/codebase-audit/browser/`; this run did not overwrite October 1 evidence.

TypeScript strict compilation passed after adding shared/scripts scope and narrowing the controlled provider's TCP address instead of assuming `server.address()` is non-null. Fresh local-mode and default hosted-mode production builds passed. The browser flow passed again after the final runtime extraction. Compilation is not live hosted verification.

Graphify's supported code layer was updated with `graphify update . --force`, followed by full AST extraction, refreshed document semantics and supplementary file/configuration/schema links. Final coverage and integrity are recorded in [SOURCE_MAP.md](../../graphify-out/SOURCE_MAP.md). The read-only pre-landing review found no outstanding contract regressions after scope, Docker and local-evidence accounting fixes. All 115 checked local Markdown links resolve.

## Jev status and accounting

Implemented an offline report-only CLI with independent Choice/Score questions, source/inventory/policy fingerprints, validated cached answers, bounded calls, conservative reservations and a per-physical-request ledger. It never deletes source or changes application inference. Direct TypeSafe uses pinned `jev-1.13.0`; Vercel uses its [TypeSafe-compatible API](https://vercel.com/docs/ai-gateway/sdks-and-apis/typesafe), AI_GATEWAY_API_KEY and `typesafe-ai/jev`. The gateway ID is an alias, not a pinned underlying version. Provider/endpoint fingerprints isolate caches, alias answers expire after 24 hours, and redirects/retries/fallbacks are disabled.

Earlier calls wrongly sent a Vercel-issued credential to direct TypeSafe and returned HTTP 401. One follow-up also hit local TLS trust failure; using the system certificate store resolved that transport problem. Failed/uncertain dispatches remain recorded without declaring usage free. The local credential was moved to AI_GATEWAY_API_KEY; it remains ignored and excluded from graph/Docker inputs.

The explicit Vercel run reviewed 20 source files from `--snapshot 132d095` without restoring deleted code: **20 successful HTTP requests, 40,747 reported input tokens, $0.001711374 gateway-reported cost**, within the $0.10 operating target. The token-price estimate agreed with returned cost. Earlier unknown reservations are separate from this successful run's cost. Raw typed responses and per-request records remain in ignored `artifacts/codebase-audit/`.

Jev classified seven of eight removed scaffold examples as obsolete candidates; it labeled `next.config.ts` as tooling. Of twelve retained/protected examples it wrongly classified `scripts/migrate-legacy-to-supabase.ts` as an obsolete candidate, with confidence about 0.24 and relevance 2.22/3. The migration tool remains protected and unchanged. No additional source removals followed these judgments. This failure supports keeping deterministic authority/migration gates outside ranking.

Fresh provider-adapter checks pass, including endpoint/credential isolation, a single attempt on HTTP failure, model validation, reported-cost handling and alias-cache expiry. The full suite passes **134/134** and strict production build passes. No product UI/backend behavior changed in this adapter follow-up. The proposed 20-feature comparative/holdout evaluation remains incomplete; this 20-file smoke run does not establish feature-context recall, safe-deletion accuracy or total coding-cost savings.

## Limits and follow-ups

This slice reduces misleading context and isolates existing responsibilities; it does not establish the cause of the user's earlier unnamed regressions. No new framework, worker authority, API schema, migration or manual deployment is introduced. Further RoomManager/provider/project-navigation extraction should follow characterization and a concrete feature need rather than an arbitrary file-size target.

Live hosted accounts, Postgres fencing contention, provider behavior, email delivery and deployment remain unverified. The coordinator migration is prepared and unapplied. The missing reference image prevents a fidelity claim. The existing build chunk-size warning remains.

Push target: `codex/codebase-cleanup` in `DD7780/Cocreate`, leaving the documented main-branch deployment path for separate integration. Push/remote evidence is recorded after completion; no push is inferred from this plan.
