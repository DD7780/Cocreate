## CoCreate steering entrypoint

Before CoCreate work, read [context.md](context.md), [product.md](product.md), and [instructions.md](instructions.md). Use [docs/harness/architecture.md](docs/harness/architecture.md) for design, [docs/harness/checklist.md](docs/harness/checklist.md) for progress, [docs/harness/decisions.md](docs/harness/decisions.md) for accepted decisions, and [api.md](api.md) for implemented contracts.

Preserve the workflow-first, submission-first pivot: the durable workflow is the primary shared object; real-time writing does not trigger inference; Build my changes / editor-focused Alt+X submits only the authenticated participant's steering to that workflow. Durable commands, tasks, events, decisions, and artifacts—not model memory—are authoritative. Keep one logical coordinator, use bounded workers only for justified independent tasks, and serialize integration/promotion. Distinguish target behavior from verified implementation. Update affected steering documents in the same change, following instructions.md. Explicit user instructions take precedence.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
