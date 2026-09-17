# CoCreate harness assessment

Recorded: 2026-09-17. This assessment is based on the repository, not prior progress claims.

## Existing capabilities preserved

- A React/Vite Document and Product interface with Yjs collaborative editing, participant presence, and signed participant sessions.
- Per-participant debounced interpretation, revision guards, and one serialized builder loop per in-memory workspace.
- Provider-independent adapters for OpenAI, Anthropic, Gemini, OpenRouter, DeepSeek, custom OpenAI-compatible endpoints, and Ollama. Provider/model assignments and encrypted credentials are workspace-owner controlled.
- Validated room-scoped source operations, an allowlist of frontend dependencies, esbuild compilation, preview CSP/sandboxing, versioned downloads, and retention of the last successful Product after a failed candidate.
- JSON room snapshots and generated project files that survive a normal restart on a persistent local filesystem.
- Tests for attribution, concurrent Yjs edits, provider contracts, revision-safe promotion, bounded compile repair, last-success retention, and restart loading.

## Material gaps found

- JSON snapshots were mutable state, not an append-only history. There were no event IDs, causal/run identifiers, durable run states, approval records, or artifact hashes.
- A restart during a build had no truthful persisted state. In-memory serialization prevented concurrent builders only within one process and had no durable lease.
- Builder operations called project helpers directly. There was no shared typed tool registry, persisted policy decision, or deny-by-default execution boundary.
- Compile success was the main verification signal. Requirements were not linked to explicit acceptance evidence, and browser acceptance was not part of promotion.
- There was no approval workflow or compact Run details UI.
- Generated-code compilation executes in the CoCreate server process. Path/dependency/capability checks limit inputs, but this is not a security isolation boundary.
- SQLite durability depends on a persistent filesystem. The current Cloudflare Container configuration does not mount durable storage for `data/` or `generated/`; Durable Object storage currently holds only generated server secrets. Production recovery on that target is therefore not yet satisfied.
- The README described local JSON persistence and a “sandboxed” product more strongly than the implementation justified.

## First vertical slice selected

The first slice establishes an append-only SQLite event history and derived workspace/run views; records document attribution and builder lifecycle; recovers in-flight runs as interrupted; routes candidate edits, compilation, and promotion through a typed, audited, deny-by-default tool boundary; and promotes only after compilation and the existing revision guard. It intentionally does not claim approvals, browser verification, durable distributed leases, or OS/container isolation are complete.

## Second verified slice — shared intent

Added an additive shared-requirement registry between personal interpretation and scheduling. It assigns stable cross-collaborator IDs, records source revisions/edit sequences/passages, distinguishes proposed from accepted intent, requires explicit withdrawal, detects exact-negation conflicts, and records the immutable accepted requirement IDs/revision on each builder run. The builder no longer receives raw canvas text or proposed requirements. Existing rooms migrate lazily from personal summaries, and the compact UI exposes accepted/proposed counts plus the current decision question.

Still open: owner conflict-resolution actions, dependency-scoped conflict blocking, implemented/verified evidence per requirement, normalized SQL requirement projections, durable leases, approval UI, browser-gated acceptance, and real process/container isolation.
