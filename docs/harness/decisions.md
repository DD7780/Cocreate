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

Status: implemented provisionally. The owner may opt into a versioned mode/effort preset only after the server resolves one existing connection to exact models that passed the relevant capability checks. The confirmation screen discloses models, provider-currency rates, assumptions, and a conservative per-build cap. Existing assignments and participant overrides remain available as Custom/Advanced; no provider or data destination changes silently. Recommendations remain provisional until paid comparative evaluations are explicitly authorized and completed. A mode changes executor workflow, tools, output, verification, and bounded allowances—not the number of agents or accepted requirements.

## D-0011 — Show conflicts without destroying ideas

Status: accepted target, builds on D-0006; UI/mutation integration remains unfinished. Highlight accepted conflicts and show multi-option cards below Shared intent. Missing selections remain pending; unanimous affected-contributor agreement resolves; differing completed selections become Disagreements. Preserve alternatives, history and the last agreed baseline. Changed options and compromises start a new confirmation round. Block dependent disputed behavior; continue safe independent work without treating silence as consent.

## D-0012 — Diagnose collaboration before retrying

Status: implemented. A browser WebSocket failure is not labeled as an internet outage. The provider checks the authenticated room-state contract to distinguish invalid sessions, missing rooms, and permission failures from transient transport failures. Only transient failures retry, using capped exponential backoff with jitter and generation guards. Terminal states require an explicit rejoin or return-home action. In-memory Yjs edits survive recoverable reconnects, but no offline-across-reload guarantee is made. This decision does not close the separate Cloudflare durable-storage gap.

## D-0013 — Evidence-gated, deterministic model routing

Status: implemented foundation; comparative recommendations remain hypotheses. Keep n personal interpreters and one shared executor. Developer uses the economical capability-validated same-provider baseline until repeated trials meet the versioned evaluation thresholds. Analyst and Researcher do not route until their real tools and acceptance verification exist. Routing is deterministic and free, respects the selected effort and remaining budget, never silently upgrades uncertain work, and freezes the assignment for an active run. Paid trials require an explicit evaluation budget. Cost is presented as provider rates per million tokens plus computed one-pass and worst-case allowances, not arbitrary effort-price ranges.

## D-0014 — Versioned estimates, not inferred billing

Status: implemented accounting foundation. Keep changing rates in `server/ai-presets.ts` only, with currency, official source, and verification date. Display the estimated one-pass maximum separately from the user spending limit and state its participant/builder/repair scope. Persist normalized call-level usage and frozen pricing references; cached input is used only when reported, reasoning already included in output is not billed twice, and missing or timed-out usage stays uncertain. Count one shared builder once. Historical effectiveness includes failures and repairs, requires comparable configuration/policy groups and a minimum sample, and never treats compilation alone as verified success. Charges remain estimates until confirmed by provider billing.

## D-0015 — Recommended leads; owner API powers it

Status: implemented 2026-09-21 and supersedes the brief direct-entry variant. The persistent API connections control and disconnected first-run state lead with CoCreate Recommended. The screen explicitly states that Recommended resolves checked models from the owner's saved API and provides prominent Connect/manage Advanced actions; Advanced returns to Recommended without erasing connections or assignments. Only the owner may save secrets, discover/test models, disconnect, or assign layers; collaborators see redacted status. Tests run only on an explicit action, may consume provider usage, and report reachability, text, interpreter schema, and current Developer executor operations separately.

## D-0016 — Managed AI requires accounts and a ledger

Status: accepted boundary; not implemented. Signed room participant sessions are not billing identities. Do not expose platform-funded inference until reliable account authentication, owner billing authorization, quotas, concurrency/size limits, atomic reservations, reconciliation, uncertain-charge records, and an auditable credit ledger exist. Managed deployment credentials never enter browser-controlled state, and BYOK never falls back to managed credit silently.

## D-0017 — Three room modes replace coding specialties

Status: implemented contract and migration; only Developer execution is available. The user-facing modes are exactly Developer, Analyst, and Researcher, with effort subordinate to mode and n interpreters plus one shared executor preserved. Developer reuses the bounded app pipeline. Researcher is displayed as unavailable pending controlled retrieval, source capture, and citation evidence. Analyst is displayed as unavailable pending validated data ingestion and isolated reproducible computation. All five legacy coding presets normalize to Developer without inference and without changing models, credentials, effort, participant overrides, or historical run records. Advanced manual assignments remain available.
