# Harness decision log

## D-0001 — Preserve the existing application while migrating additively

Status: accepted. Existing Yjs collaboration, provider connections, generated projects, and compatibility JSON remain in place. New durable records and projections are additive and legacy rooms are normalized lazily on load.

## D-0002 — Personal interpretations are proposals, not builder authority

Status: accepted. Every personal output carries a classification and source references. Only `explicit_request` and `decision` classifications are automatically accepted. `proposal`, `question`, and `ambiguity` remain visible but are excluded from build input.

## D-0003 — Build from the accepted registry, not the raw canvas

Status: accepted. A builder run captures an immutable specification revision and accepted requirement IDs. The provider request contains accepted requirements and bounded current project files; it does not contain raw canvas text. Attribution-only refreshes do not change the build fingerprint.

## D-0004 — Deletion is not withdrawal

Status: accepted. Removing text from the collaborative document does not itself revoke a requirement. An explicit withdrawal removes that participant's source; intent remains accepted while another participant still supports it.

## D-0005 — Pause on consequential accepted contradictions

Status: superseded by D-0006. The initial exact-negation detector paused the whole build; the current conflict-group model excludes unresolved requirement IDs while leaving independent accepted work eligible.

## D-0006 — Conflict groups and explicit affected-contributor agreement

Status: accepted. Conflicts are grouped by stable subject and scope with any number of faithful alternatives. The required resolver set is the unique source contributors. Missing choices remain pending; unanimous explicit choices resolve; completed differing choices become a disagreement. New or materially changed alternatives increment the revision/round and invalidate current confirmations. Unresolved requirement IDs are excluded from builder input while independent eligible requirements continue.

## D-0007 — Classify per intent and reprocess only by explicit participant action

Status: accepted. One contribution may contain requests, proposals, and questions, so the personal-agent contract and registry operate on attributed per-intent records rather than one contribution-level label. Deterministic contextual rules correct obvious semantic mismatches and missing labels fail closed to ambiguity. Persisted room history is not silently reclassified after classifier changes. The affected participant may reinterpret only their latest contribution from its recorded authenticated edit batch; the replacement removes only that interpretation's sources, preserves stable requirement identity and other contributors, and triggers a build only if accepted builder input actually changes. Settled decisions and explicit withdrawals require a new human correction.

## D-0008 — Submit intent explicitly; collaborate continuously

Status: accepted product direction; partial implementation. This supersedes automatic interpretation/building on document edits. Build my changes captures only the authenticated participant's unsubmitted changes; no inference occurs from typing, save or presence. Personal interpretation happens on submission; nearby eligible submissions share a short builder collection window (initial default three seconds). One shared accepted specification remains the baseline. Later work queues behind the active builder. Durable batch boundaries, restart resumption and legacy-route enforcement remain unfinished.

## D-0009 — Editor-focused Alt+X

Status: implemented in the submission shortcut slice; historical validation is recorded in the checklist. Windows/Linux default to Alt+X; macOS defaults to disabled. The button and shortcut share submission logic. Ignore repeat/composition/AltGraph and extra modifiers, exclude dialogs and non-editor focus, support disable/remap, and do not introduce an Enter shortcut.

## D-0010 — Simple owner setup with advanced provider control

Status: accepted target, recommendation UX not implemented. Prefer owner-provided connections and measured recommended personal/builder assignments; collaborators need no separate setup. Preserve explicit advanced assignments and dedicated API connections. Never silently change a provider/model, promise every model works, or imply free/funded inference. Validate capabilities and disclose unknown cost data.

## D-0011 — Show conflicts without destroying ideas

Status: accepted target, builds on D-0006; UI/mutation integration remains unfinished. Highlight accepted conflicts and show multi-option cards below Shared intent. Missing selections remain pending; unanimous affected-contributor agreement resolves; differing completed selections become Disagreements. Preserve alternatives, history and the last agreed baseline. Changed options and compromises start a new confirmation round. Block dependent disputed behavior; continue safe independent work without treating silence as consent.
