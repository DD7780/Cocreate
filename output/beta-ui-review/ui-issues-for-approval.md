# Wider UI issues — approval required

Workflow is implemented first as requested. This report does not authorize changes to other screens. It includes the PDF's remaining requests and related patterns found in source and the local browser review. Detailed earlier source evidence is in [the original audit](ui-audit-and-cleanup-prompt.md).

| Priority | Issue | Proposed change |
| --- | --- | --- |
| High | Several top rows repeat AI/build status. At 320px, status truncates to “R…” and the rows take much of the usable screen. | One compact status area with precedence for errors/disconnection, then active work. Expand supporting details on demand; keep honest saved/synced status. |
| High | Error Dismiss clears local error but also renders shared lastError, so a persistent failure can remain visible. | Dismiss the displayed event for this viewer, retain the shared failure record and show new failures. Verify repeat/reload behavior. |
| High | Canvas/Artifacts still expose contradiction information through older sidebar labels/drawers, while Workflow is now the coherent review home. | Link those summaries to Workflow's Contradictions and use the same user-facing labels. Preserve review authority and the agreed baseline. |
| Medium | Build has both a separate Alt+X label and an appended shortcut; long text crowds mobile controls. | One Build label and one shortcut hint, with an accessible description that it submits only your own changes. |
| Medium | Permanent paragraphs explain features across AI setup, artifact empty states, browser, Blender and deployment panels. | Short labels and relevant inline examples; optional Help or first-use guidance. Retain permission, credential, cost and release consequences at the action. |
| Medium | Artifact selection mixes saved work, live sessions and deployment actions; unavailable features lack a consistently clear path. | Keep the same Artifact section, visually group work/sessions/actions and show accurate readiness/setup states. |
| Medium | Document creation exposes quoted-title syntax as a prerequisite. | A guided title/example that prepares an explicit draft. No inference until the user submits. |
| Medium | Mobile navigation and several stacked status rows compete with the working area. | Check phone/keyboard/200% zoom across Canvas, Artifacts, dialogs and empty/error states; simplify controls within the existing theme. |
| Later | Repeat explanations could become optional onboarding or demos. | A skippable first-use guide, replayable Help and storyboards for real demo recordings. Never show fake video controls. |

## Proposed implementation loop after approval

1. Confirm which rows the user approves and create one bounded UI packet. Keep server/public contracts unchanged unless a necessary change is explained first.
2. Capture baseline desktop/mobile/keyboard states. Fix one recurring pattern across approved screens, preserving existing user work and permission checks.
3. Verify realistic empty, loading, disconnected, failed, read-only and stale states. Viewing, help and onboarding must never dispatch inference.
4. Recheck theme, spacing, short copy and accessibility. Update canonical harness and record exact evidence and limitations.
5. Present the result for review. Production/main integration remains governed by its existing release gates.

Per-project editable harness controls are a separate product capability and are not included in this UI cleanup.
