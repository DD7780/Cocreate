# 2guys1canvas beta UI implementation prompts

Selected design: **Overview**, confirmed 15 October 2026. Latest instruction: implement **Workflow only**, then detect wider UI issues and obtain the user's approval before editing those screens. Prompt 2 is a proposed later change, not authorized implementation. Keep one Contradictions section. This document does not authorize deployment or main integration.

Reference review: [UI audit and cleanup plan](ui-audit-and-cleanup-prompt.md). User examples: `C:/Users/QUTA4/Downloads/UI problems for 2G1C.pdf`. Approved preview source: `C:/Users/QUTA4/.codex/visualizations/2026/10/01/01a0f6fa-d03f-7630-b0a6-47ee3f792021/workflow-beta-directions.html`, **Overview** variant. Preview metrics, participants and project names are illustrative; do not ship them.

## Prompt 1 — Implement the approved Workflow Overview

```text
Implement the user-selected Overview Workflow design in 2guys1canvas.
Complete the implementation and meaningful verification, not just a plan.

READ AND SCOPE
Read AGENTS.md and canonical context/product/instructions/architecture/
decisions/checklist/api documents. Inspect the actual current checkout,
preserve ongoing staging work, and prepare a bounded change packet.

Use the approved Overview variant and the attached review. Keep the current
Studio Ivory theme, project navigation, Canvas and Artifacts architecture.
The mock's example project/sidebar/avatars are context, not a new navigation
requirement. Use real project data in the implementation.

Older instructions to keep Workflow visually unchanged are superseded by
this explicit request. That supersession concerns presentation, not the
durable workflow, permissions, inference or accounting contracts.

DEFAULT LAYOUT
Use one concise Workflow title, then:
1. Compact AI usage summary and chart.
2. One Contradictions list with a collapsed resolved history.

Remove the authenticated marketing hero and Open canvas CTA, Draft stage
card, oversized requirements/latest-artifact cards, Work in progress and
recent-activity dashboard, large Repairs/Estimated charge cards and
effectiveness comparisons from this default view.

Preserve durable tasks, activity, artifact versions, verification evidence,
and accounting history. Keep relevant result/verification details with the
artifact or an inspectable detail view; removing a card must not delete data.
Avoid a second Shared Context panel repeating the same Workflow information.
Keep accepted context and its provenance reachable from existing controls.

AI USAGE
Show Reported tokens and Estimated AI cost with an explicit currency and
selected period. These concern model usage, not domain/container/cloud bills.
Do not label an estimate as paid or invoiced spending.

Provide Today and Last 7 days, plus Tokens/AI cost chart selection. Use one
consistent, labelled timezone for date boundaries across participants.
Show input/output token components; use a separate monetary scale when
switching to AI cost. Do not combine different units on an unexplained axis.

Use actual timestamps and authoritative physical-call records. Reconcile
each callId once: dispatch and later outcome/reconciliation are not two
calls. Include retries in the recorded total. Never add the historical
generation counter to the physical ledger.

Cached-input or reasoning counts can be subsets of input/output. Follow
existing normalization rules; do not add them a second time to total tokens.
Keep setup tests distinguishable in details; if excluded from a scope, label
that scope clearly. Do not infer per-person costs or divide shared calls
equally when attribution is absent.

IMPORTANT: the current room projection is bounded to 500 provider records.
Inspect current retention and durable queries before adding date ranges.
If a selected period is incompletely represented, display partial coverage
and its available date bounds. Never fabricate a time series from a total.
If correct aggregation needs a new read contract, implement it as a narrowly
scoped data extension with project authorization, bounded responses and
tests. Do not silently classify backend changes as UI-only.

Distinguish:
- No calls: real zero usage and an honest empty chart.
- Missing provider usage or price: unknown, pending, or partial.
- Known subtotal with unknown calls: subtotal plus concise coverage status.

Never plot missing measurements as recorded zeros or draw a misleading
continuous trend through unknown data. Avoid excessive decimals.

View details contains accessible daily values, call categories, models,
rates/price provenance where available, and the meaning of partial coverage.
Keep the default view brief. Reuse existing formatters/accounting helpers.

CONTRADICTIONS
Use one user-facing category containing both pending choices and completed
different choices. Keep server states awaiting_choices, disagreement,
resolved and obsolete intact; do not rename persistence/API contracts for
this display change.

Each item shows:
- Affected artifact/topic.
- Attributed alternatives, using names rather than raw IDs.
- Status: Waiting for choices, Different choices, or Resolved.
- Who still needs to respond, when applicable.
- One Review action.

Show only genuinely relevant conflict groups, preserving current confirmed
detection and provenance rules. Do not turn ordinary discussion, a proposal,
an AI suspicion, or an unsubmitted draft into an authoritative contradiction.

Review reveals original submitted statements, current alternatives,
the user's own choice, sources, revision/history and the last agreed baseline.
Reuse the current conflict and intent-correction APIs/components where
possible. Avoid duplicating decision logic between Workflow and the sidebar.

Only affected contributors with edit authority can save their own choice.
Retain revision checks, request-ID replay safety, stale-response handling,
and authoritative success/failure feedback. All required contributors must
explicitly agree. Silence, majority vote, AI preference, and an owner's
position cannot silently override the existing agreement policy.

A materially changed alternative starts a new round and invalidates old
confirmation. In Different choices, provide a clear path to discuss on
Canvas or review/correct the contributor's own instruction. Do not add a
fake functional Reopen/Compromise button where no verified contract exists.
Never allow correction of another contributor's support.

Conflicts retain their scope: do not pause every independent task merely
because one artifact/requirement is disputed. Preserve existing eligibility
and last-agreed-baseline behavior; do not claim finer scheduling exists
without evidence.

Move resolved items to collapsed history, updating counts from canonical
state. Empty state: No contradictions. Reading, choosing, correcting,
filtering or opening details does not independently authorize paid inference.

VISUAL AND INTERACTION QUALITY
Retain warm paper, dark ink, cobalt accents, existing typography and
restrained borders/shadows. Prefer compact vertical sections over oversized
cards. Do not add a new dashboard, quality score, feed or agent-flow builder.

Make the chart and decisions usable at narrow widths, 320/390px, and 200%
zoom. Reduce chart ticks instead of shrinking labels to illegibility. Supply
equivalent data access for keyboard/screen-reader users and touch users.
Use concise contextual help, not paragraphs explaining every feature.

VERIFY
Use controlled fixtures for:
- No usage, complete usage, missing token/price data, pending calls and
  coverage bounded to a truncated history.
- Duplicate dispatch/reconciliation, retries, subset reasoning/cached counts,
  currency formatting, date boundaries and period/chart switching.
- Two independent participants, an unaffected editor, and a viewer.
- Pending choices, unanimous selection, different choices, changed options,
  rejected stale submissions and replay-safe commands.
- Correct attribution, counts/history and scope-specific blocking.
- Zero inference from navigation, charts, review, correction and onboarding.
- Existing Canvas caller-only submission and artifact behavior still working.

Run focused meaningful tests, required type/build/regression/boundary checks,
and actual independent-browser UI verification. Keep controlled-provider,
local and hosted evidence separate. Do not spend live model credentials or
change external resources simply to check the interface.

HARNESS
Update affected canonical documents in this same change:
product.md and decisions.md for the approved Overview and single
Contradictions presentation; architecture.md for views/data flow;
checklist.md for current acceptance evidence; context.md for handoff;
instructions.md/README.md for changed operating rules; api.md only for
actual implemented contract changes.

Explicitly supersede earlier presentation-only Workflow freeze instructions.
Preserve durable tasks/events/decisions, accounting, participant authority,
explicit inference, privacy, and all full-beta release gates. Do not turn
an illustrative preview into verification evidence for the application.

LOOP
Inspect → define one bounded acceptance target → implement its shared root
and callers → run focused checks → inspect real UI → fix → update harness.
Finish this stage before the wider cleanup.

Follow existing feature-branch commit/push authorization. Keep main and
production held. UI/runtime changes invalidate unchanged-source staging
evidence for affected behavior; refresh the tested candidate and release
fingerprint through the existing release process.

Report changes, evidence, harness updates, unresolved concerns, branch and
commit. Do not mark complete while required implementation checks fail.
```

## Prompt 2 — Apply the general beta UI cleanup

```text
After the approved Workflow Overview is implemented and verified, make the
rest of 2guys1canvas consistent, understandable and ready for beta users.
Use the supplied PDF and source-backed UI audit. Find and fix the recurring
patterns throughout the app, not only the photographed examples.

Read canonical steering and preserve unrelated staging changes. Prepare a
bounded change packet with screens, states, files and acceptance criteria.
Keep Studio Ivory and the existing Canvas/Artifacts/full-beta capabilities.
Do not restart the Workflow design decision or remove intended features.

1. AUDIT AND REPRODUCE
Inventory project list, login/beta-pending, invitations/roles, Canvas,
AI/key/model setup, Artifacts/documents, browser sessions, desktop pairing/
control, release review, help, errors and reconnect/recovery states.

For owner/editor/viewer and fresh/populated projects, record each issue with
screen, state, evidence, shared root, fix and acceptance criterion. Inspect
mobile, keyboard, long-content and failure states as well as the happy path.

2. CONSOLIDATE STATUS AND ACTIONS
Combine redundant Brainstorm together / AI not connected / Generation is
paused surfaces into one coherent status area. Retain accurate syncing,
connectivity, active task, pending submission and actionable failure states.
Use status precedence and expanded details rather than several permanent
information banners. Never hide an unsaved draft or blocked operation.

Use a visible Build label with one Alt+X hint. Accessible help must preserve
the meaning “submit my changes.” Keep the click and editor shortcut on the
same authenticated path, focus filtering, composition/repeat guards and
platform behavior. Do not change the submission authority.

Reproduce the shared-lastError case: Dismiss currently only clears local
error. Implement a local event-scoped dismissal so the rendered error can
be dismissed without clearing shared execution truth or another user's
error. New errors must still appear. Do not silently retry paid work.

Clarify model/connection configuration labels. Keep primary actions
contextual instead of adding competing filled buttons on every surface.

3. SIMPLIFY COPY AND DENSITY
Remove marketing hero text and repetitive feature education from the
authenticated workspace. Use descriptive labels, short contextual help,
and one Help destination for longer explanations.

Preserve necessary consent, credential privacy, spend authorization,
public-release exposure, destructive-action and verification-limit text at
the relevant decision. Do not remove security controls as “clutter.”

Replace raw IDs/statuses, specification jargon and provider protocol names
with readable user terms. Keep exact diagnostic detail inspectable.
Do not label a compiled or saved artifact fully verified when it is not.

Replace oversized sparse summary cards with compact vertical information.
Maintain readability and breathing room. The actual editor and artifact
preview are working areas, not empty space to be removed.

4. IMPROVE ARTIFACT AND SETUP FLOWS
Within existing Artifacts, distinguish saved work from live sessions and
release actions. Keep independent participant viewer selection.

Show real capability availability and a concise setup path; no misleading
enabled controls, fabricated live sessions, or silent full-beta exclusions.
Shorten session setup copy through guided steps and contextual help while
preserving connection ownership, private login, grants, STOP and handoff.

For a document empty state, provide a concise example or title input that
prepares a draft/explicit reviewed submission. Merely opening it, entering
the tour or navigating must not start inference.

5. ADD LIGHTWEIGHT FIRST-USE GUIDANCE
Provide an optional non-destructive tour covering Canvas, Build, Artifacts,
and Usage/Contradictions. Include Skip and replay from Help. Preserve drafts,
selection and focus. Record completion per authenticated participant; one
teammate must not complete it for the whole project.

Navigation, Next, Skip, replay and loading must produce zero inference.
Do not force a lengthy blocking tour before the user can work.

Prepare short demo-video storyboards and Help placement. Use real assets
only when supplied or produced; no fake video links or forced autoplay.
Essential actions must be understandable without watching a video.

The PDF's editable per-project harness idea remains a separate feature
proposal. Updating the repository harness is required here; exposing
privileged system instructions or new project-rule editing is not.

6. VERIFY THE WHOLE EXPERIENCE
Test independent owner/editor/viewer profiles; connected/disconnected AI;
empty/populated artifacts; running/failed/interrupted operations;
partial accounting; contradictory choices; revoked access; and reconnect.

Check desktop, tablet/narrow desktop, 390/320px, 200% zoom, keyboard-only
navigation, screen-reader names, contrast and touch targets. Capture useful
screenshots and check long titles, many contributors, notices and modals.

Test meaningful behavior: submission boundaries, error dismissal/new events,
tour persistence, permission-aware actions, independent selections, and
modal focus/return. Do not write copy-mirroring tests for trivial changes.

Run required type/build/regression and pnpm check:boundaries checks. Use
the repository UI-scope audit with a recorded base commit. Any required
backend/shared contract extension needs separate bounded scope and tests.
Use controlled fixtures, not live inference or cloud mutations, for UI checks.

7. UPDATE HARNESS AND HAND OFF
Update affected product.md, decisions.md, architecture.md, checklist.md,
context.md, instructions.md and README.md. Update api.md only where actual
contracts changed. Record accepted copy/interaction conventions so future
features do not recreate repeated explanatory panels.

Preserve inference-free writing, caller attribution, accounting, unanimity,
private access, persisted histories and existing full-beta release gates.
Run graphify update after code changes; report unavailable tooling honestly.

LOOP
Reproduce → fix the shared root and all affected callers → verify affected
states → inspect the UI → update harness → continue through the inventory.

Follow existing feature-branch commit/push instructions; do not push main,
deploy, send messages, apply hosted migrations or spend live credentials
because this UI cleanup passed.

Finish with the issue inventory and its outcomes, tested screenshots/states,
harness changes, remaining limitations, exact branch/commit, and the updated
candidate that must undergo the existing hosted release checks.
```
