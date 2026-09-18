# CoCreate product brief

Created: 2026-09-18. This file defines product intent, not proof of implementation.

## Mission

Help a small team turn a shared brainstorm into a working application without one person translating everyone's ideas into a single chat. People write together, inspect the resulting application, and refine the same product through further writing.

Core loop: shared document -> attributed interpretation -> accepted shared requirements -> one builder -> checked application -> shared Product preview.

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
- Preserve the existing neubrutalist UI direction: expressive brand/headings and calm, readable writing surfaces.

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
