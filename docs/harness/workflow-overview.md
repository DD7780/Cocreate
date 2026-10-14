# Workflow Overview change packet

Accepted scope, 2026-10-15: implement the selected Overview preview in Workflow first. Detect and report wider UI issues afterwards; those screens require the user's approval before editing.

## Outcome and scope

Replace Workflow's marketing hero, large stage/artifact cards, task/activity panels and standalone build-accounting panels with recorded AI usage and one Contradictions list. Keep Studio Ivory, existing navigation and access to accepted intent. Canvas, Artifacts, global banners, onboarding, model setup and all server/shared contracts are outside this change.

Allowed implementation: WorkflowBoard, its scoped stylesheet and usage projection, App's Workflow mount, extraction of the existing contributor selection control from AgentPanel, focused tests/browser verification and affected canonical harness documents. The extraction retains the existing sidebar presentation.

## Evidence and contracts

Workflow currently mounts both BuildAccounting and AgentPanel. AgentPanel owns the authenticated selection POST and IntentReview opens revision-bound own-support correction. ProviderRequestRecord and ConflictGroup are existing shared contracts; usage-ledger defines reconciliation. Graphify query was attempted but its CLI is unavailable; source imports/contracts were inspected directly. WorkflowBoard, AgentPanel, IntentReview and usage-ledger match the newer canvas-artifacts checkout; implementation continues in the authorized workspace after the approval service could not admit writes to the managed checkout. No staging files are changed.

Use timestamped physical calls, deduplicated by callId with final/newer outcomes preferred. Input plus output only; cache/reasoning subsets are not additional tokens. Separate generation and setup in details. Today/Last 7 days use UTC. RoomView exposes the latest 100 calls (internal retention is 500); charts are explicitly partial recorded coverage, never all-time totals. Unknown tokens/cost remain unknown or known subtotals. USD cost is estimated AI cost, not provider invoices or infrastructure spending.

One Contradictions list maps awaiting_choices/disagreement/resolved to Waiting for choices/Different choices/Resolved. Preserve obsolete/history, named attribution, sources, missing contributors, prior agreed baseline, current actor's selection and exact revision/request-ID checks. Only affected editors choose; all affected contributors must explicitly agree. Closed different-choice rounds use existing own-support correction or Canvas discussion. Viewing, changing period and reviewing never dispatch inference. Saving choices retains the existing accepted-fingerprint scheduler; agreement may resume submitted work with current AI/funding authority. Show this consequence beside Save my choice. Explicit Build accepted changes remains separate in IntentReview.

## Verification and recovery

Check deduplication, retries, subset tokens, midnight/period boundaries, mixed missing prices/usage, setup separation and bounded coverage. Exercise independent owner/editor/viewer profiles, pending/resolved/different-choice states, reload, stale commands, keyboard/mobile/zoom and zero-inference navigation. Run build, boundaries and UI scope audit, plus relevant intent/conflict/accounting regressions. Record actual results below before handoff.

No migration, credentials, provider pricing change, deployment or main integration. Rollback is the prior client; durable records and server rules are unchanged. Existing full hosted beta gates remain open.

## Implementation evidence

Initial authorized-workspace verification: strict TypeScript and default/locally authenticated production builds passed. Focused accounting/usage/conflict/intent checks passed 31/31. Import/UI scope audit passed with zero boundary violations and no server/shared changes. Seven scenarios in three isolated owner/editor/viewer browser contexts passed with zero inference dispatches, including shared choices, closed rounds, current intent modal, reload, mobile widths and keyboard chart selection. Screenshots and machine-readable receipts are in `artifacts/workflow-overview/`.

The full local suite completed with 190 passed, 44 failed and 8 skipped out of 242. Failure evidence is retained in `artifacts/workflow-overview/regression.log`; generated-execution isolation is unavailable in the outer Windows environment and publication/build-dependent cases fail or time out. This is not a passing release gate. No runtime/server changes were made to suppress it. Fresh Linux CI and full hosted beta gates remain required.

Graphify query/update cannot run through the absent CLI; the existing runtime package also denies access. Existing dirty graph output is preserved, not claimed refreshed. The separate managed checkout write failed because automatic approval review reached its service usage limit. Source verification continues in the authorized workspace; an isolated source snapshot based on dc10fac6a139ae314951bc2192c9527c513eb99e preserves newer browser/Blender/artifact/staging code. That branch advances c97f166 through documentation-only changes.

Integration checks on that newer source passed strict compilation, the locally authenticated production build, the same 31 focused tests and seven browser scenarios. Test fixtures have disconnected AI and a synthetic reconciled ledger; zero inference in these scenarios is not a promise that agreement with connected AI cannot resume submitted work. The existing Canvas/Artifacts/Blender acceptance scripts now assert the new Overview's recorded-period count, without changing their underlying requirements. An additional Canvas/Artifacts run could not pass Page.enable in this outer environment; it is not marked successful. Linux/hosted checks remain pending.
