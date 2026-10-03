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

Implemented an offline report-only CLI using the documented TypeSafe HTTP API, pinned `jev-1.13.0`, independent Choice/Score questions, source/inventory/policy fingerprints, validated cached answers, bounded calls, conservative reservations and a per-physical-request ledger. It never deletes source or changes application inference.

The configured credential reached TypeSafe but returned **HTTP 401**. One physical request was recorded; no judgments or billed input-token usage were returned. Its $0.00029799 estimated reservation remains unknown rather than declaring the request free. The rejected key was not retried automatically. The user has been asked to correct the local TypeSafe credential. A historical `--snapshot 132d095` can still review the deleted scaffold and protected cases without restoring files.

No Jev quality/recall or cost benefit is claimed from an authentication failure. The proposed 20-prompt comparative evaluation remains incomplete; use Graphify/static checks as authority and treat future Jev rankings as advisory. The key, responses and request cache are ignored by Git and excluded from graph/deployment inputs.

## Limits and follow-ups

This slice reduces misleading context and isolates existing responsibilities; it does not establish the cause of the user's earlier unnamed regressions. No new framework, worker authority, API schema, migration or manual deployment is introduced. Further RoomManager/provider/project-navigation extraction should follow characterization and a concrete feature need rather than an arbitrary file-size target.

Live hosted accounts, Postgres fencing contention, provider behavior, email delivery and deployment remain unverified. The coordinator migration is prepared and unapplied. The missing reference image prevents a fidelity claim. The existing build chunk-size warning remains.

Push target: `codex/codebase-cleanup` in `DD7780/Cocreate`, leaving the documented main-branch deployment path for separate integration. Push/remote evidence is recorded after completion; no push is inferred from this plan.
