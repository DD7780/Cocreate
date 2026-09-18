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
