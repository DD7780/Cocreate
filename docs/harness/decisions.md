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

Status: accepted for the current slice. Exact-negation conflicts between accepted requirements produce one deterministic question and set the room to `Decision needed`. The whole build is paused until resolution because dependency-scoped blocking and an owner resolution action are not implemented yet.
