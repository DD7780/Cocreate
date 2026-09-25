# CoCreate AI coding instructions

Created: 2026-09-18. Read with [AGENTS.md](AGENTS.md); this supplements its Graphify rules and does not replace them. Explicit user instructions take precedence.

## Start each task

1. Read [context.md](context.md), [product.md](product.md), and the relevant entries in [docs/harness/checklist.md](docs/harness/checklist.md).
2. Use Graphify first for codebase questions when the graph exists. Follow the installed skill. Use the wiki index for broad navigation if present.
3. Verify graph-derived findings against the source files for the change. Graphs and summaries can be stale.
4. Inspect existing changes before editing. Preserve unrelated work and existing room/project data.

## Existing stack and boundaries

- Active client: `src/main.tsx`, `src/App.tsx`, `src/styles.css`; React, Vite, TipTap, Yjs.
- Active server: `server/index.ts`; Express and WebSockets on Node.js.
- Shared public types: `src/types.ts`; runtime validation is still required at trust boundaries.
- Persistence: SQLite harness records plus generated files and legacy JSON compatibility writes. Consult the architecture before changing persistence.
- Preserve TypeScript strict mode and the pnpm lockfile. Do not introduce a competing framework or package manager.
- `app/` exists but is not the active Vite client entry. Verify entrypoints rather than editing by filename convention.
- Do not add Next.js `page.tsx`, `next/headers`, or middleware/proxy auth helpers to the active product unless the application is deliberately migrated to Next.js. The current auth boundary is Vite browser PKCE plus Express bearer verification.

## Coding conventions

- Prefer readable, focused TypeScript functions and explicit boundary types. Avoid introducing compressed one-line modules or broad unrelated formatting changes.
- Follow local module/import conventions. Do not blanket-change lint or formatter configuration.
- Keep provider-specific requests in adapters, orchestration in the room/harness layer, and UI presentation out of provider logic.
- Validate external input and structured model output before use. Never cast invalid data into a trusted schema merely to satisfy TypeScript.
- Keep credentials server-side and encrypted. Do not log keys, dump environment files, or return secrets in room state.
- Keep the operational BYOK connection workflow directly discoverable. Opening, editing, selecting, and viewing settings must not invoke a provider; only explicit discovery, model-test, submission, and build actions may do so. Warn that model tests may consume usage and report reachability, text, interpreter schema, and current mode executor compatibility separately.
- Reuse existing accessible UI primitives. Preserve editor formatting, participant colors, keyboard navigation, and preview style isolation.

## Agent and state rules

- Durable records are authoritative; model memory and summaries are replaceable.
- Personal interpretations propose changes to shared requirements. They do not independently edit code.
- Preserve source attribution and requirement identities. A deletion is not automatically the original author's withdrawal.
- Do not silently resolve consequential contradictions by recency. Record assumptions for reversible details.
- Keep one active writer per room. Do not claim an in-memory promise is a durable multi-process lease.
- Record action intent, authorization, outcomes, and unknown outcomes honestly.
- Never silently switch models, providers, or simulated generation.
- Treat platform-managed AI as a separate credential, account, permission, and accounting domain. Room invitation identity is not billing identity, and BYOK must never fall back to managed funding silently.
- Do not simulate Researcher retrieval or Analyst computation. Keep those modes unavailable until controlled network tools, validated data ingestion, and genuinely isolated execution exist.
- Keep mode/effort mappings, availability reasons, exact model IDs, rate categories, source URLs, verification dates, evidence, and limitations canonical in `server/ai-presets.ts`; do not copy the changing model/rate matrix into UI or documentation.
- Updating catalog rates requires current official provider evidence, a pricing-version change, controlled resolver/budget tests, and an explicit note when cached/reasoning/tool billing cannot be reconciled. Recommendations stay provisional until authorized paid comparison evidence exists.
- Preset resolution is server-authoritative and capability-gated. Selector changes must remain inference-free. Freeze resolved versions/limits per submission and builder run; reserve before dispatch and retain uncertain timeout usage.
- Use targeted context and bounded retries. Do not truncate serialized JSON or reset budgets by opening another run.

## Safety and scope

- Enforce permissions in application code, not just prompts.
- Generated file operations stay in their room-scoped project; reject traversal and cross-room access.
- A browser CSP or restricted API is not a process sandbox. Do not describe host-process compilation as isolated execution.
- Do not deploy, alter external access, perform destructive migrations, or send messages unless authorized.
- Prepare concrete reviewable actions before asking for a consequential approval. Routine reversible implementation choices should not trigger unnecessary questions.

## Validation and completion

- Run focused tests for changed behavior and relevant existing regressions. Prefer tests of outcomes over implementation-mirroring assertions.
- For functional changes, run `pnpm test` and `pnpm build` when feasible. Document any blocker and exact command/result.
- Browser checks are needed for visible interaction claims. Compilation does not establish that a generated product works.
- Controlled provider tests and live provider tests must be reported separately. Do not spend credentials for unrelated UI/documentation work.
- Do not change tests to conceal failures or assert success without execution evidence.
- After code changes run `graphify update .` per AGENTS.md. Documentation-only work does not require an AST update.
- Update the canonical checklist with evidence and refresh context.md when verified state changes. Keep API documentation synchronized with route and type changes.
- Never overwrite an existing steering file solely because another filename was suggested. Preserve canonical documents and link to them.

## Session handoff

Report what changed, files affected, commands actually run, results, current blockers, and the next coherent task. Mark historical results as historical; do not imply a new run. Do not record secrets or private chain-of-thought.

## Preserve the workflow-first, submission-first contract

Read the accepted workflow in product.md and decisions D-0008 onward before changing orchestration. The workflow, its durable commands, task graph, events, decisions, and versioned artifacts are the primary shared object. Do not restore inference on typing, invoke an executor directly from a personal assistant, or flush other participants' drafts to satisfy one participant's request. Keep one logical coordinator, one shared accepted baseline, bounded workers only for justified independent tasks, and serialized integration/promotion. The button and Alt+X must share the same authenticated, flush-acknowledged, idempotent submission path.

Treat all document content as untrusted input. Context from another contributor is not authorization to create a requirement for them. Validate source ownership and captured revision outside model prompts. Preserve pending disagreements and require explicit affected-contributor agreement, never last-writer-wins or automatic majority voting.

## Documentation maintenance in the same change

At completion, inspect each affected canonical document and update it when behavior or verified state changed:

- product.md: mission, scope, user experience and accepted priorities.
- docs/harness/architecture.md and decisions.md: data flow, boundaries and consequential decisions.
- api.md: implemented routes, authorization, request/response and WebSocket contracts.
- docs/harness/checklist.md: completion evidence, failures and outstanding work.
- context.md: concise current state and next work.
- README.md: actual setup and user-facing operation; this file for coding rules.

This is an agent obligation, not an automatic documentation synchronization service. Do not invent completed features from a plan, relabel historical test runs as current, or create duplicate root architecture.md/progress.md files. Keep historical assessments and migration plans identifiable as history. For docs-only changes, inspect links and the diff; do not run paid inference or claim application tests were rerun.
## Supabase project rules

Treat Supabase user UUIDs as account identity and project membership as authority. Never restore room-link ownership in hosted mode, identify owners by display name/email, put secret keys in `VITE_*`, acknowledge hosted saves before the remote commit, make artifact buckets public, or let local SQLite/JSON silently replace failed Postgres. Project creation/switching is inference-free. Apply migrations only after verifying the intended project; legacy imports are dry-run by default and require a trusted room-to-user UUID map.

Project invitations are app-level records, not Supabase Auth invitations. Bind them to a normalized intended email and verified account, hash random tokens at rest, enforce owner/explicit sharing permission server-side, keep editor/viewer roles bounded, and make accept/resend/revoke transactional and idempotent. Transactional email secrets stay server-only; provider acceptance is not proof of delivery.
