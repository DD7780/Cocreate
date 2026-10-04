# Multi-user harness improvement prompts

Prepared 2026-10-03. This is an execution prompt pack, not implementation evidence or a replacement for the canonical checklist. Run one step per implementation task. Read the common contract with every prompt. The later design details are proposals to validate against current product decisions, not automatic supersession.

## Common contract

Read AGENTS.md, context.md, product.md, instructions.md, docs/harness/architecture.md, docs/harness/checklist.md, docs/harness/decisions.md and api.md. Inspect the working tree; preserve unrelated changes. Use Graphify first for codebase questions and verify against source. Use ctx7 for library-specific documentation as required by AGENTS.md.

Preserve durable workflow authority, inference-free writing/reconnect, caller-only authenticated submissions, affected-contributor conflict agreement, fixed candidate revisions, one logical coordinator and serialized integration/promotion. No silent model, provider, credential or funding fallback. Model outputs do not confer permissions. Keep compilation distinct from functional verification.

Work only on the selected step. Read its predecessor handoff and recheck relevant source. Complete reversible implementation and local verification autonomously. Prepare reviewable migrations/deployments before requesting any authorization still required for external actions. No paid inference, messages or external changes without authorization. A hosted blocker does not prevent independent local work, but cannot be marked passed.

Loop: reproduce a concrete failure; identify the responsible boundary; implement the smallest coherent fix; run focused outcome checks and relevant regressions; inspect the diff; update affected canonical steering; write a handoff. Repeat within this step until its checks pass or a specific external dependency remains. Do not conceal failed checks or silently weaken requirements.

For functional changes run required pnpm test and pnpm build checks when feasible, independent-browser checks for visible collaboration, and graphify update . after code changes. Documentation-only steps require link/reference and diff checks, not unrelated application tests.

Handoff: outcome; files changed; decisions and rationale; exact checks/results with local/mock/hosted/live scope; unresolved dependencies; next step. Record status in the canonical checklist, not a parallel progress ledger. Do not mark a step completed solely because code compiles.

## Step 01 - Audit, scenarios and baseline

Prompt: Audit the current multi-user harness against this pack. Verify each claimed gap against source and existing evidence. Build controlled-provider scenarios for simultaneous submissions, a slow/failed interpreter, later steering during a build, continuous arrivals, reconnect/reload, stale ownership, ambiguous references and failed generated behavior. Reuse fixtures where possible. Add bounded privacy-preserving measurements only where necessary: queue time, interpretation time, accepted-to-preview time, superseded work, reported usage and outcome. Establish repeatable workloads and baseline observations. Explain which later steps are necessary, already satisfied or dependent on another decision.

Acceptance: each material gap has evidence and an executable scenario or a precise external verification dependency. No invented measurements. Existing behavior remains unchanged apart from necessary diagnostic instrumentation. Historical results remain historical.

Outside scope: implementing the subsequent fixes, provider comparisons, deployment and live migrations.

Next: Step 02. Pass the evidence and fixture locations to every later step.

## Step 02 - Coordinator fencing and owner routing

Prompt: Verify coordinator claim, renewal, expiry, loss, takeover and atomic fenced commits. Prevent stale owners from dispatching or promoting. Design the smallest routing strategy compatible with the existing deployment. Requests reaching a non-owner must reach the owner or receive a bounded actionable retry response; never create a second writer. Preserve authenticated caller identity, current authorization and command idempotency across routing. Prepare any necessary additive migration with rollback/compatibility notes. Implement locally and provide contention checks for the intended database environment.

Acceptance: two competing instances cannot both mutate/promote; stale epochs fail; duplicate forwarded commands do not duplicate inference; lease loss and owner unavailability terminate clearly; routing cannot forward secrets or bypass membership. Distinguish SQL mocks from real database execution. Do not claim hosted readiness without real contention checks.

Outside scope: artifact retention redesign and agent concurrency.

Next: Step 03 after local checks; carry unapplied database/deployment dependencies explicitly.

## Step 03 - Artifact persistence and restoration

Prompt: Complete private artifact persistence and recovery across disposable-container/cache replacement. Audit existing Storage primitives before adding anything. Publish durable bodies before finalizing canonical references; make publication replay-safe. Restore promoted versions and relevant checkpoints by verified references/hashes. Distinguish missing/corrupt artifacts from empty projects. Test interruption between upload and canonical commit. Measure snapshot/event/receipt growth and propose retention or compaction that preserves recovery and idempotency.

Acceptance: an empty local cache restores the promoted artifact and required candidate state; unauthorized reads fail; corruption is detected; interrupted publication cannot expose a nonexistent artifact; retry is idempotent. Document older history limitations and remaining hosted tests.

Outside scope: destructive cleanup or historical data migration without a reviewed plan.

Next: Step 04.

## Step 04 - Generated execution isolation

Prompt: Isolate generated compilation and verification using the smallest real process/container boundary compatible with the runtime. Strip application/provider/deployment secrets; scope writable files; enforce network policy, time, memory and process limits. Implement cancellation and cleanup. Fail clearly if isolation is unavailable. Preserve operation validation and preview restrictions as additional boundaries. Prepare deployment configuration without deploying it.

Acceptance: controlled adversarial fixtures cannot read host secrets, traverse workspaces, use unauthorized network access or escape limits; cancellation removes child work; ordinary builds succeed; isolation failure cannot fall back to unsafe host execution. Explain what each test actually establishes.

Outside scope: unrestricted packages, shell tools or unrelated platform expansion.

Next: Step 05. Step 07 must use this verification boundary.

## Step 05 - Intent inspection, correction and contextual references

Prompt: Let participants inspect accepted/proposed/ambiguous interpretations with source passages and revisions, then explicitly correct or withdraw their attributable intent. Implement revision-safe, durable, replay-safe mutations and accessible UI. Preserve teammates' sources and requirement history. Invalidate affected candidate assumptions through current promotion guards.

For ambiguous references, separate authorized caller steering from relevant accepted context and explanatory shared material. Attach authorship/revision/authority metadata. Teammates' drafts cannot become their accepted instructions through someone else's submission. Clarify consequential uncertainty; do not require approval for every ordinary request. Validate known source ownership/references outside prompts and audit the legacy reinterpretation path.

Acceptance: correction survives reload/replay; stale correction is rejected; a participant cannot rewrite teammates' intent; deletion alone is not withdrawal; ambiguous 'that' references fail safely or resolve with evidence; malicious context and invented model attribution do not gain authority. Include multi-client and keyboard checks.

Outside scope: changing conflict governance or introducing inference on typing.

Next: Step 06.

## Step 06 - Stable build progress under ongoing steering

Prompt: Use baseline measurements to reproduce starvation or wasted supersession. Design a bounded collection/checkpoint policy that keeps later steering durable and delivers useful progress. Preserve current revision-safe promotion unless a justified decision explicitly changes it. Do not promote a candidate stale under current rules merely to improve throughput. If showing an older completed result is useful, distinguish a revision-labelled historical preview from authoritative current promotion. Define when work is cancelled, queued or safely reused. Checkpoint reuse requires valid assumptions and matching source requirements. Surface building/available/pending revisions clearly.

Acceptance: finite controlled workloads drain; sustained arrivals demonstrate a defined progress policy within stated bounds; consequential changes cannot bypass safety/verification; pending steering survives restart; budgets do not reset on supersession; clients agree on revision labels. Compare discarded calls and latency with baseline.

Outside scope: concurrent interpretation and arbitrary parallel builders.

Next: Step 07. If the desired policy conflicts with accepted fixed-revision rules, document the concrete tradeoff before changing that contract.

## Step 07 - Requirement-linked verification and promotion

Prompt: Turn acceptance criteria into observable checks and associate evidence with requirement revision, candidate hash and check version. Track implemented, verified, failed and unverified separately. Combine static validation, compilation, targeted functional/browser checks and affected-feature regressions. Gate authoritative promotion on the required evidence. Keep repairs bounded and retain the previous artifact on failure. Use Step 04 isolation. Treat generated tests as untrusted candidate content; agents cannot weaken gates or redefine requirements to pass.

Acceptance: a compiling but incorrect fixture is blocked; unchanged behavior regresses neither silently nor undetected in covered scenarios; changed candidates cannot reuse stale evidence; failures preserve the previous artifact and actionable status; honest unverified state remains possible where checks do not cover behavior. Demonstrate the full chain from accepted requirement to evidence to promotion.

Outside scope: claiming complete semantic correctness or adding unrelated workflows.

Next: Step 08.

## Step 08 - Durable workflow budget and accounting

Prompt: Extend existing physical-call accounting toward a durable budget across interpretation, generation, repair and retries. Define the budget scope/reset action explicitly; setup tests need an explicit scope instead of silently spending build allowances. Persist reservations before dispatch and reconcile reported outcomes. Unknown outcomes retain uncertainty until reconciled. Concurrent reservations and command replay must not double spend. Restart must not reset budgets. Preserve hosted BYOK funding policy; adding a user-facing spending control requires an explicit product decision.

Acceptance: controlled concurrency cannot exceed configured reservations; each physical attempt has one ledger identity; replay and reconciliation do not inflate totals; unknown outcomes are not zero; restart and supersession do not replenish allowance. Evaluate existing eight-task/24-call bounds without automatically increasing them.

Outside scope: managed relaunch, payments and unauthorized provider spending.

Next: Step 09.

## Step 09 - Conditional interpretation concurrency and topology evaluation

Prompt: Measure whether serial interpretation is a material bottleneck after earlier improvements. If not, retain it and report evidence. If justified, add bounded independent interpretation with durable capture-order commit. Freeze each input/baseline, persist completion, detect stale assumptions, and prevent an earlier failed job blocking the queue forever. Reinterpret only through an authorized bounded policy; no hidden inference after reconnect. Keep one integration owner.

Compare logical personal interpreters with a shared attributed interpreter using identical controlled fixtures. Report correctness, attribution, conflict detection, latency and cost proxies; do not infer live model quality from fixtures. Live comparisons require a separate approved budget. Do not change physical topology without supporting evidence.

Acceptance: reversed completion order still yields deterministic acceptance; one slow/failed task has defined bounded handling; stale context cannot silently overwrite newer intent; replay/restart retain ordering; calls stay accounted. A decision to retain the existing topology is a valid outcome.

Outside scope: swarms, parallel promotion and assuming more agents improve quality.

Next: Step 10.

## Step 10 - Cross-system integration and final harness review

Prompt: Exercise three independent authenticated clients through concurrent submissions, intent correction, continuous steering, disconnect/reload, coordinator takeover, artifact restoration, failed verification and usage reconciliation. Verify the complete interaction between prior steps. Run isolated execution adversity and stale-promotion checks. Repeat real hosted scenarios only with authorized environment/account access; keep unrun external checks explicit.

Consolidate canonical architecture, decisions, API, checklist and handoff around the final implementation. Remove superseded active instructions without deleting rejection rationale. Report baseline comparisons, evidence scope, remaining blockers and deployment prerequisites.

Acceptance: end-to-end authority, recovery, revision, evidence and accounting invariants hold in the tested environment. No required unrun check is labelled passed. Implementation completion and hosted release readiness are separately stated.

## Starting instruction

Copy this into the next implementation task:

Read docs/harness/multiuser-improvement-prompts.md. Execute Step 01 only, using its common contract. Audit current source, establish reproducible scenarios and baseline evidence, update the canonical checklist and provide the handoff for Step 02. Do not implement later steps in this task.
