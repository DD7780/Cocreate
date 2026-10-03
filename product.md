# 2guys1canvas product brief

Current intent, 2026-10-04. Implementation evidence belongs in [the checklist](docs/harness/checklist.md) and [context.md](context.md). [Historical product directions](docs/harness/history/product-before-cleanup.md) are retained for reference; they do not override this brief.

## Mission and core loop

Help a team direct one durable agent workflow together with attributable evidence and shared artifacts. The workflow, its commands, tasks, events, decisions and versioned artifacts are authoritative. A document or model conversation is supporting context.

Collaborative brief → authenticated steering submission → accepted requirements and conflict gate → coordinator task plan → bounded execution → verification → revision-safe artifact promotion. Real-time writing stays free of inference.

## Active MVP

Developer is the only activatable workflow. Researchers/Analysts and historical managed records remain readable where needed, but new activation is rejected. People sign in, create/open a project, write and collaborate, then explicitly Build my changes. Capture only the authenticated participant's unsubmitted steering; never flush another participant's draft. Alt+X is editor-focused on Windows/Linux and disabled on macOS.

New hosted projects have no AI assignment. The owner connects an OpenRouter key with generation-free validation, explicitly chooses builder and Interpretation models, and saves. Keys live only in a two-hour server-memory lease. Editors require owner spending authorization; expiry/restart requires reconnecting. No managed/founder funding, credits, presets, old wizard or silent fallback in the active hosted UI. Local compatibility APIs and historical billing/project data remain distinct from the active setup surface.

Settings changes, writing and reconnecting do not invoke inference. Explicit model tests may consume provider usage and must say so. Provider account limits, requested output/context capacity, configured spending and the executor's recovery bound are separate concepts.

## Collaboration, decisions and recovery

Interpret caller-owned captured batches in durable capture order against an accepted baseline. Distinguish proposals, questions, explicit requests, decisions, ambiguities and withdrawals. Preserve source identities and provenance. Do not silently resolve consequential conflict by recency, model voting or majority; affected contributors explicitly decide at the current revision.

Persist pending batches, replay receipts and accepted revision snapshots. A save acknowledgement represents an actual immutable cloud commit and covers both insertion clocks and deletion ranges. Device caching complements shared authority and never replaces membership, billing or server-confirmed save state.

Use one logical coordinator, bounded independent workers only when justified, and serialized integration/promotion. Output-exhausted generation plans at most eight coherent one-file tasks; validate complete envelopes and await checkpoints. A shared 24-physical-call executor ceiling includes initial generation, recovery, repairs, transport retries and superseded candidates. Keep any configured spending limit. Failed candidates retain the last compiled artifact and offer an explicit retry; compilation is not functional verification.

## Workspace experience

Workflow, Canvas and Artifacts are the primary views. Canvas includes a compact Shared context rail: accepted-count/revision selector, selected Accepted requirements/View requirements, a bordered Recorded usage · partial card/View usage, and workflow stage. Unsubmitted drafts remain separate. Workflow/Artifacts retain accepted requirements, proposals, conflict alternatives, disagreements, sources and decision history.

Workflow displays real durable tasks, evidence states and ordered activity. Usage separates reported physical calls, setup tests, and historical generation counters. Deduplicate physical records; never describe unknown usage as zero or combine historical counters into a complete project total.

Studio Ivory is the active visual direction: warm ivory, dark ink, restrained cobalt and terracotta, a subtle canvas grid and precise hard shadows. Inter is the interface/document face; DM Serif Display is for selected headings. Keep accessible controls, participant colors, calm writing typography, reduced motion, responsive navigation and preview style isolation. A match to the missing reference image is not verified.

## Scope and non-goals

The generated-product scope is small React/TypeScript frontend applications. Arbitrary backends, unrestricted package installation, production systems and unsandboxed shell execution are outside this scope. Do not introduce autonomous swarms, another framework, new hosting or unrelated integrations as cleanup.

Auth and membership are server-verified. Invitations bind to the intended verified email/account and preserve roles; deliberate resends create another valid link without revoking earlier pending links. Provider email acceptance is not delivery confirmation.

Maintain precise source/contract boundaries and smaller feature context as described in [the cleanup plan](docs/harness/codebase-cleanup-plan.md). Offline Jev assistance is development tooling, not a change to participant inference or product authority.
