# CoCreate product brief

CoCreate is a multiplayer agent-workflow workspace. Multiple authorized people collaborate on one durable workflow: they contribute briefs and evidence, submit explicit steering, inspect execution, resolve requirement decisions, and share versioned artifacts. The workflow—not the shared document or a model conversation—is the primary object. Documents, code, previews, reports, datasets, and charts are artifacts of that workflow.

CoCreate exposes exactly three workflow templates: Developer, Analyst, and Researcher. A template configures the coordinator's task policy, tools, output, and verification; it never creates one permanent worker per participant. Low, Medium, High, and Extra are the user-facing effort settings within each template; the stored `light` value remains backward compatible and is displayed as Low. Setup defaults to one provider connection, never buys a routing call, preserves Advanced assignments, and shows canonical provider rates, separately scoped allowances, an estimated one-pass maximum, and a distinct user spending limit.

Provider usage is presented by scope. Connection discovery/capability-test usage is separate from the latest build and cumulative project generation usage. A physical provider retry or structured-output repair is a separate request, even when the user initiated one logical action; missing usage remains unknown rather than zero.

Hosted collaboration must preserve original Yjs bytes end to end. Stored snapshots and updates are validated before entering a live document; unreadable records are quarantined without replacement, and verified update history is the only automatic recovery source. Authentication has explicit initializing, authenticated, unauthenticated, and actionable-error states. A failed or cancelled new login never hides an existing session or grants access through dialog dismissal; continuing that session or switching accounts is explicit, and backend membership remains authoritative.

The user spending limit bounds aggregate cost; it is not a token allowance. Developer effort controls the per-call input/output limits. CoCreate may locally normalize narrowly defined JSON-envelope defects such as raw control characters inside strings or trailing commas, but the result must still pass the exact schema and project-operation validators. Incomplete structured output receives one bounded compact retry with both attempts accounted; repeated failure asks the owner to select a higher effort or compatible model instead of silently upgrading.

Developer is implemented using the bounded app-building pipeline. Analyst and Researcher are shown but unavailable: Analyst requires validated data ingestion and isolated reproducible computation; Researcher requires controlled retrieval, source capture, and citation verification. The UI and server reject unavailable-mode activation rather than simulating it. Legacy coding presets migrate to Developer while their exact connections, models, credentials, effort, participant overrides, and historical records remain intact. Platform-managed AI remains unavailable until reliable account authentication, billing authorization, quotas, atomic reservations, and an auditable ledger exist.

Created: 2026-09-18. This file defines product intent, not proof of implementation.

## Mission

Help a team direct one durable agent workflow together without collapsing authority into a single chat. People can inspect the task plan and ordered activity, contribute context, steer future work, resolve conflicts, and promote shared artifacts with attributable evidence.

Core loop: collaborative brief -> authenticated steering submission -> accepted shared requirements and conflict gate -> coordinator task plan -> bounded worker execution -> verification -> revision-safe shared artifact promotion. Writing and comments remain real-time; execution is submission-driven, not triggered by every edit.

## Users

- Collaborator: contributes ideas and tests the product without needing to operate a coding environment.
- Workspace owner: connects providers, assigns models, and manages the room's AI configuration.
- Initial market hypothesis: small product teams and agencies prototyping with clients. Willingness to pay and market fit are not yet validated.

## Priorities

1. Preserve intent and attribution; resolve consequential contradictions.
2. Produce working changes supported by evidence rather than model claims.
3. Minimize total cost per accepted change, including retries and repairs.
4. Keep writing responsive while interpretation and generation run.
5. Stay within model context budgets through retrieval and durable state.
6. Recover without inventing missing execution history.

## Required experience

- One Docs-like collaborative canvas with rich text, presence, and persistent edits.
- One logical personal interpreter per participant; invoke it only when that participant explicitly submits authenticated changes.
- One active shared coding agent per room. Agent sessions can restart; durable project state must survive.
- Distinguish ideas, questions, explicit requests, decisions, and withdrawals.
- Keep writing free of model calls. Provide **Build my changes** to capture one participant's unsubmitted edits, briefly batch nearby submissions, and run one shared builder without including another participant's draft.
- Product shows the generated interactive application, not a generic progress tracker or canned demo.
- Keep the last successful preview when a candidate fails.
- Dedicated API connections UI with owner-managed credentials and role/model assignments.
- The persistent API connections entry leads with CoCreate Recommended, clearly states that an owner-provided API powers it, and provides a prominent route to add/edit/disconnect, discovery/manual model testing, and assignments in Advanced. Tests are explicit, may consume provider usage, and separate reachability, text, interpreter schema, and current Developer executor compatibility.
- For every assigned layer, show source-linked, date-verified input, cached-input when supported, output, and reasoning billing terms. Do not render unavailable cache rates as zero.
- Keep per-interpreter allowances distinct from the number of submitted participants and count the one shared builder once. After a build, show normalized provider usage, interpretation/builder/repair charges, outcome, and verification status; unknown usage remains unknown.
- Use a clean dark editorial workspace with restrained neubrutalist accents: expressive serif brand/headings, calm high-contrast writing surfaces, compact controls, and fine structural borders. Do not use liquid-metal, metallic, glassmorphism, or decorative shader effects. The document remains the primary surface; supporting panels must not compete with it.
- Present Low, Medium, High, and Extra in one compact ChatGPT-style draggable AI effort toggle beside the canvas, with pointer, click, and keyboard operation. The owner can use it with either Recommended or Advanced assignments; Advanced keeps its chosen models while the level changes bounded input/output and repair allowances for future frozen submissions.

## Scope and non-goals

The first generated-product scope is small React/TypeScript frontend applications. Arbitrary backends, unrestricted package installation, production systems, and unsandboxed shell access are outside that scope.

Do not add billing, enterprise administration, extra dashboards, autonomous developer swarms, new hosting, or integrations without an explicit requirement. Do not replace real generation with simulated output. Test fixtures may simulate providers but must be identified as such.

Shared preview means everyone sees the same application version; shared end-user data inside that generated application is a separate capability.

## Roadmap

The authoritative implementation checklist is [docs/harness/checklist.md](docs/harness/checklist.md). Do not maintain a competing completion list here.

1. Reliable attributed collaboration, shared intent, and recorded build flow.
2. Real execution isolation, durable coordination, and recoverable approvals.
3. Acceptance evidence, bounded repair, and safe preview promotion.
4. Model-aware context budgets, usage limits, and cost/latency evaluation.
5. Production persistence and deployment hardening only after core behavior is demonstrated.

## Product acceptance example

Three people describe a recipe browser, ingredient filters, and favorites. Their contributions remain attributed; accepted requirements reach one builder; Product shows the requested working application. Adding sorting should preserve filtering and favorites. A proposal must not silently become an instruction. A consequential contradiction should be visible. A failed update must retain the working preview.

## Measures

Measure missed requirements, attribution mistakes, unwanted changes, false/missed contradictions, regressions, cost per verified accepted update, queue delay, and time from accepted intent to preview. Establish baselines before claiming improvement. Compare personal interpreters with a shared attributed interpreter rather than assuming more agents are cheaper.

## Related records

- [Architecture](docs/harness/architecture.md)
- [Implementation progress](docs/harness/checklist.md)
- [API contract](api.md)
- [AI coding instructions](instructions.md)
- [Context handoff](context.md)

## Accepted workflow pivot (2026-09-19)

These are product requirements; implementation evidence and remaining gaps belong in the canonical checklist.

- Keep a vertically scrollable canvas usable for long documents, keyboard navigation, and continued writing during builds.
- **Build my changes** submits the caller's captured unsubmitted edits. Ram's submission does not authorize Sham's draft. Previously accepted shared requirements remain the baseline: everyone develops one application, not a separate product per participant.
- Use a short, configurable collection window (initial default three seconds, not a compulsory twenty-second delay). Combine nearby eligible submissions with attribution. Freeze each build's inputs; later submissions wait for the next serialized build.
- Invoke logical personal agents only on explicit submission or targeted reinterpretation. Typing, saving, presence, reconnect, and polling must not invoke a model. Submitting a speculative idea does not change its classification into an accepted requirement.
- **Alt+X** is the Windows/Linux editor-focused shortcut for the same Build my changes action. No Enter binding. Ignore repeat, composition, AltGraph, and additional modifiers; support disabling/remapping and retain focus. macOS defaults to no shortcut to preserve Option text input.
- Show accepted-requirement contradictions as highlights and multi-option decision cards below Shared intent. Only affected contributors resolve a round; silence stays pending. Unanimous explicit choices resolve; differing completed choices move the group to **Disagreements** without deleting the alternatives. Preserve the last agreed baseline and block dependent changes while safe independent work continues. A compromise or changed alternative requires fresh confirmation.
- **Recommended** setup is available as an owner opt-in: choose Developer, Analyst, or Researcher, then Light, Medium, High, or Extra and a spending limit. Only Developer is currently runnable. The server resolves exact personal/shared-executor assignments only on an existing capability-checked connection. Mode changes executor workflow, tools, output, and verification—not accepted requirements or agent count. Medium is the default. Collaborators reuse the room configuration. Existing manual assignments and participant overrides remain available as Custom in Advanced. The estimated one-pass maximum explicitly covers one submitted participant interpretation and one shared executor call, excludes repairs/additional participants, and assumes no cache hits; the separately labeled bounded maximum remains incomplete where provider charges cannot be bounded. Recommendations are provisional; do not imply universal compatibility, free provider access, platform-funded usage, arbitrary backends, or unavailable Analyst/Researcher execution.

Launch readiness requires durable deployed records/artifacts across container replacement and honest verification/permission boundaries. A fixed launch date does not convert an unchecked criterion into a completed feature.
## Authenticated saved projects (2026-09-24)

CoCreate's hosted product begins with Google or confirmed email/password sign-in and a private, searchable project list. Email signup, confirmation resend, password recovery, authenticated password update, logout, and safe same-origin return destinations use Supabase Auth; passwords never enter application tables or logs. One project maps to one existing room/workflow. Creating, opening, switching, renaming, archiving, or inviting never invokes a model. Project names are trimmed, required, limited to 120 characters, and persist on the stable project ID. Owner, editor, and viewer memberships are explicit; a URL alone grants nothing.

Project sharing is an application-level, email-bound invitation flow. An owner or a member with explicit `can_share` permission chooses recipients and an editor/viewer role. The server stores only a hash of each expiring random token, sends the recipient-specific link through configured transactional email, and reports provider acceptance separately from confirmed delivery. Acceptance requires an authenticated, email-confirmed account whose normalized email matches the invitation; it is transactional and idempotent. Pending invitations can be resent or revoked, and owners control members' sharing permission. Supabase Auth SMTP remains responsible only for account confirmation/recovery email.

The canvas keeps submission-first execution, the existing Developer/Analyst/Researcher availability, Alt+X, and the last working artifact. Its four-position Low/Medium/High/Extra radio group changes only future submission configuration, makes no inference request, preserves manual assignments and spending limits, and keeps published model rates plus this-project provider usage immediately below it.

The desktop shell uses a compact 240–280px context rail. Shared intent, conflicts, disagreements, and workflow are collapsible; an active conflict opens automatically; long records open in a drawer; the full rail can collapse. This is implemented presentation over authoritative room state, not a second intent source.
