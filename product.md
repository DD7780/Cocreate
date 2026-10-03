# 2guys1canvas product brief

This file owns accepted behavior and requested targets. It is not implementation proof; statuses and evidence belong in the [checklist](docs/harness/checklist.md). Updated 2026-10-03 with Step 03 durable artifact recovery; other accepted human product decisions are preserved.

## Mission, users and scope

Help people direct one durable workflow together: contribute briefs and evidence, submit steering, inspect tasks/activity, resolve decisions and share versioned artifacts. Documents, code and previews are workflow artifacts; model conversations are replaceable. Small product teams and agencies prototyping with clients remain an unvalidated market hypothesis.

Priorities are intent and attribution, conflict resolution, evidence of working changes, total cost per accepted change, responsive writing, bounded context and recovery. Initial generated-product scope is small React/TypeScript frontend applications. Arbitrary backends, unrestricted packages/shell access, enterprise administration, autonomous swarms, new hosting and unrelated integrations are outside current scope. Shared preview means a shared version; shared end-user application data is separate. Simulated provider fixtures must be identified.

## Collaborative steering and authority

One Docs-like, vertically scrollable rich-text canvas supports presence, persistent edits, long documents and writing during builds. Typing, saving, navigation, project operations, presence, reconnect and polling never trigger inference.

**Build my changes** captures only the authenticated participant's pending changes, with a flush acknowledgement and replay-safe request ID. Ram's submission does not authorize Sham's draft. Keep one logical personal interpreter per participant and one active shared builder; mode or effort does not change agent count. Personal interpreters classify individual ideas, questions, explicit requests, decisions and withdrawals; only explicit requests and decisions enter the accepted registry. Submission alone does not turn a proposal into an instruction. Accepted requirements remain the baseline for one shared application.

Nearby eligible submissions use a short configurable collection window, initially three seconds. Capture order determines reconciliation; each candidate uses a fixed accepted revision. Later accepted steering remains pending for the next serialized build and can supersede the current candidate. Durable commands, tasks, events, decisions and artifacts are authoritative. One logical coordinator owns the workflow; stale workers cannot dispatch or promote after ownership loss. Owner unavailability has bounded connection retries and a clear reopen action, with the current page retaining edits. Reconnect never resubmits inference; explicit command retries preserve their request ID. Clients recover authoritative state and tolerate replay/out-of-order delivery. Presence is separate from durable workflow state.

Consequential contradictions retain faithful alternatives, attribution, history and the last agreed baseline. Only affected contributors resolve a round: silence is pending, unanimous explicit selections resolve, differing completed choices become Disagreements. Changed options or compromises need fresh confirmation. Block dependent disputed changes while safe independent work remains eligible. Conflict highlights, richer compromise/reopen controls and dependency precision remain accepted targets where not implemented.

The button and shortcut invoke the same authenticated submission. Alt+X is fixed on Windows/Linux and editor-focused; macOS mapping is disabled. Ignore repeat, composition, AltGraph, extra modifiers and dialog focus. Preserve focus and accessible binding metadata. D-0040 supersedes optional shortcut-remapping requirements.

## Hosted AI and limits

This is the authoritative current hosted AI contract (D-0035, refined by D-0042). Developer is the only active workflow. New hosted projects start without AI assignments; people can write/collaborate first. The owner validates an OpenRouter key without generation, explicitly selects a compatible builder and Interpretation model, then saves. The key lives only in a two-hour server-memory lease. Expiry or process restart requires reconnecting; editors need explicit owner authorization to spend. Never silently switch credentials, models, providers, funding or generated output.

Managed/founder dispatch, credits, presets, recommended combinations, old setup wizards and three-mode activation are inactive in the hosted MVP. Preserve historical project, billing and configuration records. Compatibility code is not permission to revive these flows.

| Limit | Meaning |
| --- | --- |
| Managed credit gate | Inactive for hosted BYOK; no founder-credit fallback |
| Provider account/key limits | The key owner's provider account controls its funds, quotas and restrictions |
| Configured spending limit | Any frozen limit present in execution configuration is enforced; current BYOK setup offers no platform dollar-budget control |
| Recovery calls | Current executor stops at 24 physical dispatch attempts across initial generation, recovery, repairs, transport retries and superseded candidates in that build loop |
| Per-call output | Requested output is separately bounded by provider completion metadata when available; higher effort does not establish a higher provider ceiling |
| Context capacity | Input plus reserved output must fit model context; cumulative reported usage does not measure occupancy |

The eight-task and 24-call constants are current choices, not inherently optimal budgets. Their adequacy needs evaluation. A durable workflow-wide budget across interpreters, setup, retries and uncertain outcomes remains separate deferred work.

## Build recovery and evidence

Distinguish output exhaustion, context overflow, spending limits, timeouts, malformed responses and transport failures. Do not repeat an oversized exhausted project request unchanged. Reduce it into small coherent targeted tasks, preserving accepted behavior instead of regenerating the entire product. Current recovery plans at most eight ordered one-file tasks, validates complete operations and awaits each durable source checkpoint. Truncated envelopes are never applied/promoted; continuation is allowed only when the format supports safe resumption, which the current whole JSON envelope does not.

Serialize validation, compilation, integration and promotion. Stop within call/spending bounds. Preserve the last validated working artifact as the product target; current retention is of a compilation-checked artifact that remains functionally unverified. Failures must show failed task, recovery attempts, retained artifact and a valid next action. Explicit Retry build uses accepted requirements without reinterpreting edits; restart/reconnect never automatically retries inference. Private promoted artifacts and relevant candidate checkpoints must survive server cache replacement through verified durable references. Publish and verify bodies before finalizing references. Missing, corrupt or unavailable stored data is an actionable recovery failure, distinct from an empty project; it never authorizes automatic regeneration. Preserve command replay and archived version identity across recovery and rollback.

Acceptance and affected-behavior regression evidence must eventually gate promotion. Measure missed requirements, attribution errors, unwanted changes, false/missed contradictions, regressions, queue delay, cost per verified accepted update and accepted-intent-to-preview time. Establish baselines before claiming improvements. Compare personal interpreters with a shared attributed interpreter rather than assuming more agents are cheaper. Estimates remain separate from provider-confirmed billing; changing prices belong in versioned source metadata.

## Shared context, recorded usage and requested appearance

The current shell is Studio Ivory, loaded from `src/studio-ivory.css` over `src/styles.css`: warm ivory, ink, cobalt and terracotta, Inter text and selected DM Serif Display headings. This describes source, not the requested appearance. Earlier no-Canvas-rail and comic-effects guidance is superseded for active presentation.

The user supplied [this visual reference](docs/harness/references/shared-context-reference.jpg), copied unchanged from `C:/Users/QUTA4/Downloads/watermarked_img_15731704898281132106.jpg`. **Reference available; comparison pending.** Use its viewport, sidebar hierarchy, layout, typography, spacing, borders and purple accents as the current target. Embedded text and external application chrome are not product instructions. No reference match is claimed.

Canvas has a supporting **Shared context** sidebar, also reachable in Workflow/Artifacts. Required content: **Shared Intent** revision/accepted-count selector; bordered **Accepted requirements** card driven by the selected durable accepted snapshot; empty explanation that accepted instructions appear after submission/acceptance; **View requirements**; separate bordered **Recorded usage · partial** card with prominent total, **reported tokens** and **View usage**; then workflow stage. Keep drafts, raw chat and model memory outside accepted requirements. Proposals, conflicts, sources and decision history remain discoverable.

The main usage panel shows last build status, last build charge, recorded physical calls and generation calls. Reported tokens sum persisted reported input/output without adding cache/reasoning subsets twice. Physical calls count recorded attempts including retries; generation is the subset excluding connection/capability tests and includes interpretations, builds, recovery and repairs. Deduplicate by call ID; missing usage stays unknown. Show scope, first recorded date and reasons for partial coverage. Keep estimates, historical logical generation counters and any separately calculated context occupancy distinct. Authorized participants should converge on the same workflow totals.

Compare at the reference viewport and smaller screens, with readable contrast and keyboard access. Understandable client states include syncing, saved, submitting, accepted, queued, building, disconnected and failed. Device-saved is distinct from server-synced; unsaved edits must not be labeled saved. Detailed status/failure and visual checks are requested targets, not assumed complete because cards render locally.

## Accounts, saved projects and sharing

Hosted access uses Google or confirmed email/password identity and a private searchable project list. Preserve signup, confirmation resend, login, recovery, authenticated password update, logout and safe same-origin return destinations. Passwords never enter application tables/logs. Project creation/open/switch/rename/archive/invitation is inference-free. Names are trimmed, required and at most 120 characters; IDs stay stable. Owner/editor/viewer membership is explicit; URLs/cache contents confer no permission. Backend reads and mutations recheck authority.

Project invitations are application records, separate from account confirmation/recovery email. Owners or explicit `can_share` members invite normalized email recipients as editor/viewer with expiring hashed random tokens. Acceptance requires a matching confirmed account and is transactional/idempotent. Resend creates another valid link without invalidating earlier pending links; stable request IDs replay the same creation/resend. Existing member roles stay unchanged on acceptance. Explicit revoke is separate; owners control sharing permission. Provider acceptance means Sent, not inbox delivery. D-0037 rejects revoke-on-retry because it would invalidate existing links.

## Accepted future work

Retain workflow control handoff, revision-safe structured steering, pause/resume/cancel, scoped durable approvals, dependency scheduling and bounded workers in isolated workspaces as deferred accepted direction (D-0020). Parallel workers require justified independence and serialized integration; no swarm rewrite is required. Generated compilation now uses a real isolated process with secret stripping, enforced limits and cancellation (D-0047). Local Windows acceptance passes; prepared Linux deployment/kernel acceptance remains launch work. Requirement-linked functional evidence, model-aware context retrieval with omitted-material references, uncertain-outcome reconciliation, retention controls and real hosted artifact recovery remain outstanding. Local Step 03/04 evidence is scoped in the checklist; history discarded before archival cannot be invented. Durable permissions must cover changed actions as well as approval recovery. An Update ready interaction should preserve active preview use where practical.

Analyst and Researcher remain deferred until validated ingestion/isolated computation or controlled retrieval/source capture/citation verification exists. Historical three-mode activation and managed-default setup are superseded; these tool prerequisites are not rejected. Payment checkout and any managed relaunch are separate work, not current MVP obligations.

Acceptance example: three people request recipes, ingredient filters and favorites; attribution survives, proposals stay separate, and one builder produces the working application. Later sorting preserves filters/favorites; conflicts stay visible and failed updates retain preview. Launch claims require durable deployed records/artifacts and evidence in the [checklist](docs/harness/checklist.md), not a date or UI label.

Decision rationale is in [decisions.md](docs/harness/decisions.md); older narrative is in the [archive](docs/harness/archive/2026-10-01-pre-consolidation/README.md).
