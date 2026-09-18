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

## Coding conventions

- Prefer readable, focused TypeScript functions and explicit boundary types. Avoid introducing compressed one-line modules or broad unrelated formatting changes.
- Follow local module/import conventions. Do not blanket-change lint or formatter configuration.
- Keep provider-specific requests in adapters, orchestration in the room/harness layer, and UI presentation out of provider logic.
- Validate external input and structured model output before use. Never cast invalid data into a trusted schema merely to satisfy TypeScript.
- Keep credentials server-side and encrypted. Do not log keys, dump environment files, or return secrets in room state.
- Reuse existing accessible UI primitives. Preserve editor formatting, participant colors, keyboard navigation, and preview style isolation.

## Agent and state rules

- Durable records are authoritative; model memory and summaries are replaceable.
- Personal interpretations propose changes to shared requirements. They do not independently edit code.
- Preserve source attribution and requirement identities. A deletion is not automatically the original author's withdrawal.
- Do not silently resolve consequential contradictions by recency. Record assumptions for reversible details.
- Keep one active writer per room. Do not claim an in-memory promise is a durable multi-process lease.
- Record action intent, authorization, outcomes, and unknown outcomes honestly.
- Never silently switch models, providers, or simulated generation.
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
