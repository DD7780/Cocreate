# Harness documentation cleanup — 2026-10-02

This is an audit record, not another architecture or checklist. The [current checklist](checklist.md) owns outstanding work. Application behavior was unchanged.

## Authority and changes

Read AGENTS, context, product, instructions, architecture, checklist, decisions, API and dated reliability evidence. Queried Graphify before source investigation, then verified boundaries directly. Audited the actual human reliability/shared-context/collaboration request and the later cleanup request; no assistant-generated prompt was treated as product authority.

Consolidated duplicate BYOK instructions/checklists into the single [product contract](../../product.md#hosted-ai-and-limits), with implementation mechanics in architecture/API and status in checklist. Replaced chronological active patches with a current map and preserved lengthy prior narrative in a [clearly inactive archive](archive/2026-10-01-pre-consolidation/README.md). README now follows the same contract; older assessment/migration/conflict/routing plans are explicitly scoped as history or deferred compatibility.

Kept D-0035 for BYOK and assigned D-0043 to device recovery. Kept D-0021 for hosted authority and assigned D-0044 to serialization recovery. Corrected the erroneous BYOK gate-removal reference to D-0035 with D-0042's later recovery refinement; D-0036 still names historical comic motion. Inspected references by meaning instead of globally replacing numbers.

Retired unbounded BYOK executor guidance, no-Canvas-sidebar layouts, optional remapping, managed-default/wizard/three-mode activation and obsolete effects from active rules. Preserved inactive compatibility/rationale. Kept invitation revoke-on-retry rejected and current non-revoking resend active. Accepted future control, approval, isolation, dependency, tool and evidence requirements remain deferred.

The supplied reference was inspected for availability and copied unchanged into [documentation assets](references/shared-context-reference.jpg). Current status: **reference available; comparison pending**. Historical missing-image evidence remains dated. Current Studio Ivory is not described as a reference match; image text is not authority.

No new product decision was needed: D-0042 already covers the human reliability request. Made its outstanding visible status vocabulary, complete failure details, source-ownership/reinterpretation audit, bounds evaluation and reference/hosted checks explicit, with basis and partial/pending status. Optional architecture expansions were not promoted to mandatory work.

## Evidence inspected

Source: `server/build-recovery.ts` (schema max eight, complete file tasks, awaited checkpoints); `server/rooms.ts` (24-call dispatch guard, spending configuration, capture queue, receipts, drafts, immutable saves, accepted revisions and fixed-revision promotion); `server/coordinator.ts`, `server/event-store.ts` and the coordinator SQL (epochs/fences, snapshot projections, artifact-body exclusions); `server/index.ts`, project routes/platform, invitation SQL and sender (retired routes, current membership, tickets, non-revoking replay and delivery states); provider/generator/usage source (completion bounds, physical IDs, partial totals); client provider/drafts/shortcut/App/WorkflowBoard/main (receipts, recovery, fixed mapping, active styling and UI fields).

Evidence records: [2026-10-01 reliability report](reliability-verification.md), committed test/build/auth logs and browser JSON/screenshots; prior checklist/context records of 2026-09-30 SQL checks and 2026-09-26 byte backups; original user request attachments. Historical results were read, not rerun or expanded into hosted claims.

## Documentation validation and remaining limits

Validation covered 24 Markdown files, 44 unique decision definitions, 109 decision references and 162 local links/anchors, with no unresolved references or broken targets. A separate pass checked 44 current named source paths. The reference copy was byte-for-byte identical. `git diff --check` passed after removing documentation whitespace defects. Final working-tree review confirmed edits are documentation/reference assets; source/tests/migrations/Graphify output have no new diff, and unrelated hook/Graphify deletions and existing artifacts were preserved.

No application tests/builds, new browser checks, Graphify update, live provider/email calls, deployment or migration application occurred. Prepared/unapplied coordinator SQL remains the recorded status; no newer repository evidence establishes live application. Owner routing, full older artifact bodies, projection scaling, live account/provider behavior, reference comparison and functional acceptance remain open in the checklist. Source inspection does not reconfirm current external database/deployment state.

Unresolved implementation/design work includes multi-instance owner routing, durable workflow-wide funding/budgets, full artifact archival, approval/control and isolation design, and adequate context/recovery/retention limits. These are existing deferred gaps, not newly accepted architecture proposals. There is no unresolved decision-ID ambiguity after the repair.
