# CoCreate harness implementation checklist

Status is evidence-based: `[x]` verified, `[-]` partial, `[ ]` not implemented.

## Foundation and first vertical slice

- [x] Repository capability/gap assessment exists. Evidence: `docs/harness/assessment.md`.
- [x] Architecture, migration, rollback, retention, and deployment constraints are documented.
- [x] Versioned SQLite schema with append-only ordered events, content-addressed artifacts, and derived workspace/run views.
- [x] Existing/new room snapshots are immutable artifacts; a missing workspace view reconstructs from event history.
- [x] Legacy JSON is backed up before lazy import; generated projects are untouched; JSON compatibility writes remain.
- [x] Document updates record authenticated participant attribution, input revision, hash, and Yjs artifact.
- [x] Builder runs use enforced legal states and recovery marks nonterminal work `interrupted`.
- [x] Candidate apply, compile verification, and promotion pass through one typed tool registry with durable request/policy/start/outcome events.
- [x] Personal-agent and unknown tool use is denied before execution.
- [x] Promotion remains revision-guarded, bounded to three compile/repair attempts, and preserves the last successful Product on failure.
- [-] Personal interpretations and promoted products are durably snapshotted and attributed, but normalized requirement/specification/evidence projections are not yet separate tables/views.
- [-] Started-without-outcome tool calls remain visibly unknown through their event trail and interrupted run, but automatic idempotent reconciliation is not implemented.

## Phase 1 — durable records and recovery

- [-] Workspace, participant, document, interpretation, run, tool, artifact, and product events exist. Session, usage-budget, verification-evidence, decision, and approval event coverage remains.
- [x] Local restart reconstructs document, requirements, latest successful product, and run state without an AI call.
- [ ] Pending approvals survive restart (approval schema exists; approval workflow does not).
- [ ] Replay/projection tests cover every derived view and schema migration.
- [ ] Cloudflare deployment uses a proven durable application store.

## Phase 2 — tools and policy

- [-] Registry metadata and deny-by-default policy exist for apply/build/promote. File list/read/search, test commands, preview lifecycle, browser checks, web, and database tools remain.
- [ ] Real process/container isolation with secret stripping, enforceable timeout, resource limits, and cancellation.
- [ ] Approval-bound operations and standing permissions.
- [ ] Cross-workspace and path/resource-scope adversarial test matrix.

## Phase 3 — durable orchestration

- [-] Builder lifecycle is durable and participant extraction is revision-guarded. Personal-agent run states, immutable build-input records, and durable leases remain.
- [ ] Meaningful-edit classification separates proposals/discussion from accepted implementation instructions.
- [ ] Context assembly uses explicit budgets and references to omitted material.

## Phase 4 — verification and bounded repair

- [-] Compile/tool evidence and bounded repair are recorded. Accepted requirements are not yet mapped to targeted/browser/regression evidence.
- [ ] Distinct proposed/accepted/implemented/verified/failed/unverified/superseded requirement statuses.
- [ ] Browser acceptance and affected-behavior regression checks gate promotion.

## Phase 5 — approvals and inspection UI

- [ ] Normalized action-hash approvals with role authorization and restart persistence.
- [ ] Compact Run details UI with trigger, requirements, steps, tools, approvals, evidence, failures, and usage.
- [ ] “Update ready” behavior that preserves active preview interaction where practical.

## Phase 6 — end-to-end hardening scenarios

- [x] Simultaneous participant edits remain attributed (existing controlled integration/unit tests).
- [-] Normal edit produces a compiled, revision-guarded product with audited tools; browser acceptance is not a promotion gate.
- [ ] Proposal is not silently accepted.
- [ ] Conflicts request a decision.
- [x] Edit during build cannot stale-overwrite newer input (revision-guard test).
- [x] Forbidden tool operation is denied before execution (focused policy test).
- [ ] Approval survives restart and cannot authorize a changed action.
- [x] Crash/restart leaves an executing run as `interrupted`, never successful.
- [ ] Uncertain external outcome is reconciled before retry.
- [x] Failed candidate preserves last successful preview (existing integration test).
- [x] Repeated compile repair stops after three attempts (existing integration test).
- [-] Provider assignments/state survive restart; provider-switch preservation needs a dedicated scenario.
- [-] Event payload secret-field redaction is tested; broader logs/artifacts credential scanning remains.
- [ ] Cross-workspace record and generated-file access denial is adversarially tested.
- [x] Restart reconstructs document, requirements, latest product, and run state without an AI call.

## Verification evidence for this slice

- TypeScript: `node node_modules/typescript/bin/tsc --noEmit --pretty false` passed.
- Focused event/recovery/policy tests: 5 passed with direct Node test execution of TypeScript-emitted files.
- Full controlled suite after rebasing onto current `main`: 23 passed with `node --test --test-concurrency=1` against TypeScript-emitted test files, including the automatic-build token-budget scenario.
- Production build: `pnpm build` passed; Vite emitted the client bundle with a non-failing large-chunk warning.
- The normal `pnpm test` launcher could not start because this machine's `tsx` dependency failed in `os.userInfo()` with `uv_os_get_passwd ENOMEM`; the same tests were compiled by TypeScript and executed directly instead of retrying the unchanged failing launcher.
- Live provider generation: not run; no credential is required or requested for this controlled slice.
