# CoCreate product brief

CoCreate exposes exactly three modes: Developer, Analyst, and Researcher. A mode configures the one shared executor's workflow, tools, output, and verification; it never creates additional permanent agents. Light, Medium, High, and Extra are effort settings within each mode. Setup defaults to one provider connection, never buys a routing call, preserves Advanced assignments, and shows canonical provider rates, separately scoped allowances, an estimated one-pass maximum, and a distinct user spending limit.

The user spending limit bounds aggregate cost; it is not a token allowance. Developer effort controls the per-call input/output limits. Structured truncation receives one bounded compact retry with both attempts accounted; repeated truncation asks the owner to select a higher effort or larger-output model instead of silently upgrading.

Developer is implemented using the bounded app-building pipeline. Analyst and Researcher are shown but unavailable: Analyst requires validated data ingestion and isolated reproducible computation; Researcher requires controlled retrieval, source capture, and citation verification. The UI and server reject unavailable-mode activation rather than simulating it. Legacy coding presets migrate to Developer while their exact connections, models, credentials, effort, participant overrides, and historical records remain intact. Platform-managed AI remains unavailable until reliable account authentication, billing authorization, quotas, atomic reservations, and an auditable ledger exist.

Created: 2026-09-18. This file defines product intent, not proof of implementation.

## Mission

Help a small team turn a shared brainstorm into a working application without one person translating everyone's ideas into a single chat. People write together, inspect the resulting application, and refine the same product through further writing.

Core loop: shared document -> explicit participant submission -> attributed interpretation -> accepted shared requirements and conflict gate -> one builder -> checked application -> shared Product preview. Writing is real-time; generation is submission-driven, not triggered by every edit.

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
- Use a clean dark editorial workspace with restrained neubrutalist accents: expressive serif brand/headings, calm high-contrast writing surfaces, compact controls, and fine structural borders. The document remains the primary surface; supporting panels must not compete with it.

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
