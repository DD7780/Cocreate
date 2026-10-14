# Beta UI review and cleanup plan

Prepared 15 October 2026. This is a review and implementation brief, not a release-readiness certificate. **Workflow is the only approved implementation scope. Wider UI fixes below await user approval.** Workflow implementation and fresh evidence are recorded in [the change packet](../../docs/harness/workflow-overview.md).

Source reviewed: `C:/Users/QUTA4/.codex/worktrees/7a24/Devoffice`, branch `codex/canvas-artifacts`, HEAD `c97f166`. The worktree has ongoing staging documentation changes that must be preserved. Input: both pages of `C:/Users/QUTA4/Downloads/UI problems for 2G1C.pdf`, including the annotated screenshots. Graphify was attempted but unavailable; source inspection was used instead. No credentials were read and no provider calls or deployment were made.

Latest steering: the user selected **Overview** in the preview and confirmed the selection on 15 October 2026. Present one user-facing **Contradictions** category; keep the existing underlying states and resolution authority. Build the chosen Workflow design before applying the wider cleanup, so that its information structure is settled. The finalized sequential prompts are in [implementation-prompts.md](implementation-prompts.md).

## 1. Workflow proposal: Overview selected

Two alternative layouts use the existing Studio Ivory palette: warm paper, dark ink, cobalt actions, serif headings, restrained square borders and compact spacing.

- **Overview (recommended):** a compact usage summary/chart followed by one Contradictions list. Users can see cost and outstanding choices without switching views.
- **Focused:** two local views, Usage and Contradictions. It provides more space for each, while showing the open count in the Contradictions label.

Both previews are illustrative, use sample data, and do not call models, save decisions, or modify the app. Overview is the approved layout; Focused is an unselected alternative. This layout selection does not authorize production deployment.

### Shared proposed behavior

1. Show reported tokens and estimated AI cost for the selected time range. Cost means model calls, not the operator's domain/container/cloud bills. A real billed amount needs authoritative billing evidence; otherwise use “Estimated AI cost.”
2. Use one chart with Tokens/AI cost selection and a small date-range control. Input/output tokens can be stacked; do not put quantities with different units on an unexplained shared axis. Supply an accessible data view, readable units, and touch/keyboard inspection.
3. Keep a compact partial/missing-data indicator visible. Place detailed call categories, rates and coverage definitions behind View details. Missing usage or pricing is unknown, not zero.
4. Include retries in actual usage. Remove the large Repairs and Estimated charge cards; do not delete their accounting records. Keep valid contextual spend permission disclosures at the moment they are needed.
5. Place incompatible submitted instructions in one Contradictions list. Each item shows the affected artifact/topic, attributed alternatives, status, participants still needed, and one Review action.
6. Use human labels: Waiting for choices, Different choices, Resolved. The server's `awaiting_choices`, `disagreement`, and `resolved` states remain distinct. Do not rename persisted contracts merely to simplify the UI.
7. Only affected contributors with edit authority submit their own choice, against the current group revision. Unanimous explicit choices resolve; silence and majority voting cannot resolve a conflict. Changed alternatives need new confirmation.
8. A closed differing-choice round needs discussion and explicit correction of the contributor's own submitted instruction. Do not render a working Reopen/Compromise action unless its existing contract is verified or a separately bounded extension is implemented and tested.
9. Keep original statements, sources, past rounds and the last agreed baseline available in an expanded detail view. Only the affected disputed behavior is blocked where the existing implementation supports it; independent eligible work remains possible.
10. Viewing, choosing, or correcting a decision does not independently authorize paid inference. Preserve the existing explicit Build/submission and spending gates.
11. Empty: “No contradictions.” Do not invent a health score or a congratulatory dashboard card. Resolved items live in collapsed history.
12. Remove the marketing hero, Open canvas CTA, Draft card, oversized summary cards, Work in progress/recent activity dashboard, repeated verification cards, large repair panels and effectiveness comparisons from the Workflow default view. Keep relevant execution/verification details with their artifacts or in diagnostics; preserve durable tasks/events/history.

### Accounting constraint discovered during source review

The room retains up to 500 provider-call records but sends only the latest 100 in RoomView. The implemented chart labels partial recent coverage and uses only actual timestamped records, reconciled by call ID. Authoritative server aggregation remains distinct. Complete historical date-range reporting would need a separately scoped read contract. Never manufacture earlier time series from cumulative totals.

### Project harness idea in the PDF

The PDF also proposes editing project-specific product/architecture/harness material. This is a separate capability, not equivalent to editing this repository's harness. It is not in these two initial previews. If requested, first map accepted requirements/decisions to a project-rules view and define contributor authority, versioning, draft-versus-accepted state, and explicit submission. Do not expose privileged runtime instructions, secrets, or deployment configuration as freely editable shared text.

### Harness changes after the layout is chosen

Record the accepted layout and one Contradictions grouping in product.md and decisions.md. Explicitly supersede earlier **presentation-only** directions to leave Workflow unchanged. Keep durable-workflow, token-accounting, contributor-authority and release gates intact. Update architecture.md for any view/data-flow change, api.md only if implemented contracts change, checklist.md with exact acceptance evidence, and context.md with the current handoff. Update instructions.md/README.md where actual operating rules change. Proposed previews are not accepted implementation evidence.

## 2. UI findings and general cleanup prompt

### Source-confirmed recurring issues

| Priority | Pattern and evidence | Required treatment |
| --- | --- | --- |
| P1 | Multiple persistent status surfaces: controlbar “Brainstorm together / AI not connected,” separate paused banner, BuildProgress, VerificationSummary, submission/reconnect/error notices (`src/App.tsx:626`, `BuildProgress.tsx`, `VerificationSummary.tsx`). | One coherent status area with clear precedence. Keep necessary saving, connectivity and actionable failure information distinct; collapse details instead of hiding real problems. |
| P1 | Contradiction choices are spread across Shared Context drawers and separate disagreement sections. The drawer says “This decision round is closed” without a clear user path; history prints raw participant and alternative IDs (`src/workspace/AgentPanel.tsx:139`, `:212`, `:227`). | One Contradictions home, readable contributor names/option labels, current-user next action, and correction path. Preserve read-only and stale-revision behavior. |
| P1 | Error Dismiss only clears local `error`, while rendering also depends on shared `state.lastError` (`src/App.tsx:639`). | Verify the persistent-error case in browser. Dismiss the displayed event locally without clearing shared execution truth for other users; new errors must still appear. |
| P2 | Marketing hero and dominant Open canvas CTA inside an authenticated workspace (`src/WorkflowBoard.tsx:12`). | Remove them; navigation already provides Canvas. |
| P2 | Oversized Draft/requirements/latest-artifact cards and sparse Work in progress/activity panels (`WorkflowBoard.tsx`, PDF page 1). | Remove the Draft and work dashboard views; retain any still-needed accepted/artifact facts as compact contextual rows, vertically grouped rather than oversized horizontal cards. |
| P2 | Dense overlapping totals: historical generation, physical calls, setup totals, last build, side-panel usage, and BuildAccounting breakdowns (`WorkflowBoard.tsx:14`, `AgentPanel.tsx`, `BuildAccounting.tsx`). | Use the authoritative reported-call projection once per scope. Keep a small synchronized sidebar summary if useful, with one destination for details. Do not sum legacy and physical counters. |
| P2 | Workflow's last-build charge lacks a currency marker and exposes raw outcomes (`WorkflowBoard.tsx:10` and `:14`). | Format amount, currency, uncertainty and range consistently; translate outcomes into user-facing text. |
| P2 | Feature instructions appear as permanent paragraphs in model setup, artifact empty states, intent review, browser, Blender, and preview release screens (`ByokSetup.tsx`, `Artifacts.tsx:79`, `IntentReview.tsx`, `SharedBrowser.tsx`, `BlenderSession.tsx`, `PreviewReleases.tsx`). | Replace repetitive education with descriptive labels, one-line contextual help, inline examples, and Help. Preserve consent, secret-entry, authorization and public-release warnings when acting. |
| P2 | Duplicated shortcut presentation: shortcut hint alongside Build my changes and its tooltip (`App.tsx:629`). | One visible “Build” control with one Alt+X hint; accessible description still explains that it submits only this participant's changes. Keep the existing editor-focus and platform rules. |
| P2 | Developer terminology leaks into end-user views: physical calls, specification revisions, raw model IDs, task titles and verification grammar. | Prefer user terms by default. Keep exact technical references in support/diagnostic details, and preserve verification uncertainty. |
| P2 | Artifact selection mixes saved items with browser/device/deployment tools. Options exist even before their capability/setup is available (`Artifacts.tsx:54`). | Keep Artifacts in the same UI. Group saved work versus sessions/actions and show honest availability plus a clear setup path. Do not remove the full beta feature scope. |
| P2 | Document empty state requires users to learn quoted title syntax (`Artifacts.tsx:79`). | Offer a concise example or guided title input that prepares an explicit draft. Do not generate merely because a user opens the panel or starts onboarding. |

### States to check in the browser before claiming all UI issues fixed

Inventory all authenticated screens and shared patterns: project list, invitations and roles, Canvas, model/key setup, Artifacts, documents, browser sessions, desktop pairing/control, preview-release review, beta-pending/error/recovery, and the selected Workflow. Check owner/editor/viewer, new/populated project, disconnected AI, running/failed build, incomplete usage, pending/closed/resolved contradiction, revoked access and reconnect.

Source review identifies issues and risks; it does not establish live keyboard behavior, overlap, contrast, mobile usability or hosted feature readiness. Screenshots in the PDF are user evidence for their depicted state. Conduct browser checks at desktop, narrow desktop/tablet, 390/320px and 200% zoom. Watch long titles, many participants, large amounts, incomplete data, empty states, modal focus, touch targets and nested scrolling.

### Executable general UI cleanup prompt

```text
Make the existing 2guys1canvas UI ready for beta users, using the attached
UI review and the user's selected Workflow layout.

This is implementation work after Workflow design approval. Do not
choose or deploy a different Workflow layout on the user's behalf.

Read AGENTS.md and the canonical steering documents. Inspect the current
branch and preserve ongoing staging work. Use repository graph tools
where available, verifying findings against source.

Prepare two bounded change packets:
A. Implement the approved Workflow design using its finalized prompt.
B. Apply the wider UI cleanup below after A is verified.

Use Studio Ivory: existing typography, warm surfaces, cobalt actions,
restrained borders/shadows, spacing and navigation. Premium means clear
hierarchy and careful interaction, not extra ornament or new dashboards.

For B, inventory every visible screen and shared component. Reproduce
the attached issues and find the same patterns across the application.
Record each issue with its screen/state, evidence, proposed fix and
acceptance criterion. Fix all in-scope instances, not only the examples.

STATUS AND ACTIONS
- Merge the duplicated idle/AI-disconnected/paused messages into one
  status area; retain actionable connectivity/saving/error states.
- Use “Build” plus one Alt+X hint. Preserve caller-only submission,
  editor focus, key filtering, macOS behavior and the shared click path.
- Verify and fix the persistent-error Dismiss case without clearing
  shared failure truth or hiding future events.
- Keep primary actions contextual. Avoid several competing filled CTAs.
- Label model configuration clearly; keep connection and spend grants
  discoverable without technical explanations occupying the workspace.

COPY AND INFORMATION DENSITY
- Remove marketing copy and repetitive feature instructions from the
  authenticated workspace.
- Use descriptive controls, concise helper text where needed, and a
  single Help destination for longer explanations.
- Preserve essential authorization, secret handling, factual/verification
  limits, public exposure and cost disclosures at the relevant action.
- Keep raw IDs, model strings and protocol/revision details in inspectable
  support views rather than the default experience.
- Replace oversized/sparse information cards with compact meaningful
  rows. Keep breathing room and readable text; do not shrink everything.
- Do not shrink or remove the actual Canvas/preview working area merely
  to eliminate white space.

ARTIFACTS AND CONNECTIONS
- Group saved artifacts and live sessions/actions clearly within the
  existing Artifacts section.
- Show real availability and a short setup path for browser, companion,
  and preview deployment; do not remove intended full-beta features.
- Keep participant-local viewer selection and server permissions intact.
- Make pairing/login/cost/approval steps guided and understandable.
  Never embed credentials in tours, examples, screenshots or logs.
- A guided document title/example prepares a draft or explicit reviewed
  submission; opening an empty state must not start inference.

ONBOARDING AND DEMOS
- Add a lightweight optional first-use tour: Canvas, Build, Artifacts,
  then Contradictions/Usage. Allow Skip, dismissal, and replay from Help.
- Use non-destructive highlights and preserve the user's draft/focus.
- Next, Skip, replay, navigation and loading must produce zero inference.
- Record completion per authenticated participant; do not mark the
  entire team's tour complete when one person finishes.
- Prepare concise demo-video storyboards and a Help placement plan.
  Integrate real assets only when supplied or produced. No placeholder
  video links, forced autoplay, or video dependence for core actions.

VERIFICATION
- Check independent owner/editor/viewer sessions and the state matrix
  in this review.
- Test meaningful interactions: submission/shortcut boundaries,
  dismiss/new error behavior, tour persistence, private viewer selection,
  modal keyboard focus and denied actions.
- Check responsive widths, 200% zoom, keyboard-only navigation, readable
  contrast and touch targets. Include screenshots of difficult states.
- Do not add tests that merely assert the removed copy is absent.
- Use controlled fixtures; do not spend live inference or alter cloud
  resources for UI verification.
- Run required type/build/regression checks, pnpm check:boundaries,
  and the repository's UI-scope audit using the recorded base commit.
  Any justified non-UI data/command change gets its own bounded scope
  and authority/security tests. Never smuggle it into a styling change.
- Update graphify after code changes, or report its actual unavailable
  tooling and do not claim an update that did not run.

HARNESS
Update affected product.md, decisions.md, architecture.md, checklist.md,
context.md, instructions.md and README.md in the same implementation.
Update api.md only for actual implemented contract changes.

Explicitly supersede obsolete presentation instructions to leave
Workflow untouched. Preserve durable tasks/events, physical accounting,
caller attribution, unanimity, revision safety, explicit inference,
private access and all existing full-beta release gates.

WORKING LOOP
Reproduce → define a small acceptance target → fix the shared root
pattern and all callers → inspect/test → update harness → continue.

Finish the selected Workflow first, then general cleanup. Report what
changed, exact evidence, unresolved cases, harness changes, branch and
commit. Follow existing feature-branch commit/push authorization; do not
push main or deploy because a UI check passed.
```

### Completion boundaries

The two illustrative layouts were rendered and inspected at a 1024px browser viewport and a 320px mobile viewport. Browser interaction checks covered carousel switching, unified Contradictions tabs, the Tokens/AI-cost chart switch, date-range changes, the daily data view, and simulated current-contributor choice saving. Resolved sample items moved into history and the open count decreased. The mobile root had no horizontal overflow; crowded weekday labels were reduced to four. Screenshots are retained under this review's output directory. These checks verify the preview, not the application's implementation.

No application implementation, canonical accepted-decision update, production deployment or live-model test was performed for this review. The Workflow layout choice is complete and both implementation prompts are finalized in implementation-prompts.md. The implementation agent must update the canonical harness alongside the code. Broader hosted beta blockers are independent of UI quality and remain owned by existing release packets.
