# Isolated coherent restoration — 2026-10-19

## Target and preservation

Selected complete tree: `4ccc1fbb186ca11f92a847bff550915649555013`, authored October 15, 2026 at 17:07:32 +05:45 (Asia/Katmandu). Branch: `codex/restore-coherent-4ccc1fb`. This is a historical source candidate, not an assertion that rollback fixes the observed failures.

First-parent ancestry is `6c44029` (October 9) → `ab28741` (Workflow presentation, October 15) → `4ccc1fb` (approved editorial landing) → `64cce27` (logo) → `3f50357` (public entry copy) → `6fd5c86` (sidebar-free Canvas) → `9187865` (founder contacts) → `1b004ac` (submission repair, October 16). No mainline commits exist October 10–14. `git diff 6c44029 4ccc1fb -- server shared` is empty. The approved landing therefore postdates the approximate requested dates while retaining the earlier core. Choosing its whole tree avoids an invented combination of versions. Later presentation changes are excluded; none is required to retain the approved editorial page.

The previous `codex/restore-oct14-build` work explicitly mixed historical behavior with later capture, provider and persistence protections. That remains a recoverable reference, but is not this restoration baseline. Cached `origin/main` is `33d54e8f5eff1e7442c74eece2f3914bb09fb8b8`; local `main` is older (`96c7cb6`). Neither was modified. No fetch, pull, push, migration or deployment is authorized/performed here.

The original checkout remains on `codex/prelaunch-beta` at `915bebdabe71e495b1fbb14436f783e500a84a50`. An ignored preservation inventory in the original checkout's `.runtime/historical-coherent-restore/` records all eight original worktrees, branches, HEADs, dirty paths and environment-file metadata without secret values. Existing dirty files, ignored environments, local databases, generated projects and artifacts remain in place. Work uses a newly created managed checkout and new `.runtime/restoration-local/data` only.

## Bounded change packet

- Outcome: evaluate the complete historical Canvas → caller-only submission → shared builder → Artifacts workflow with its approved public landing.
- Scope: baseline tree unchanged; restoration documentation, isolated local configuration, and explicitly identified verification harness changes only. Any application correction requires reproduced evidence and a separate commit.
- Evidence: local Git objects/first-parent ancestry and file diffs; historical AGENTS/steering/API; Graphify `submitChanges flush buildLoop promote`, verified against source. Later architecture and fixes are excluded.
- Contracts: existing `shared/types.ts`; HMAC authenticated local participants; durable author-specific capture/receipts, capture-order interpretation, accepted intent/conflict agreement, serialized integration, real OS compiler, candidate verification and fenced promotion. Local participants are not verified Supabase accounts.
- Verification: historical frozen lockfile/pnpm, production type/build, boundaries, full existing suite, controlled multi-profile browser, real isolated compilation, and (only with configured temporary OpenRouter credentials and the user's $2 ceiling) two real-provider submissions. Fixture and live evidence must remain separate.

## Source trace

1. TipTap/Yjs edits pass through `src/provider.ts` to the authenticated WebSocket in `server/index.ts`; `RoomManager.queueEdit` records participant-specific pending edits. Ordinary typing does not run interpretation.
2. The existing persistence path records document bytes and pending attribution. `saved` messages cover insertion clocks and deletion signature. The button/Alt+X in `src/App.tsx` waits for `CoCreateProvider.flush()` before POST `/api/rooms/:id/submit`.
3. `RoomManager.submitChanges` freezes only the authenticated participant's pending batch and accepted context, persists the submission, and passes it to the serial `queueCapturedSubmission` path. Receipts replay without consuming another author's drafts.
4. Personal interpretation proposes attributable registry changes; reconciliation and consequential-conflict agreement determine accepted requirements. One builder owns the fixed accepted revision.
5. `buildLoop` preflights real isolation, executes validated generated operations, invokes the isolated compiler and the historical verification plan, then durably promotes the artifact under revision/ownership checks. Failure retains the prior product. Compilation alone does not verify arbitrary requested behavior.

## Verification and repair log

Logs are in `.runtime/restoration-evidence/`; earlier dated repository evidence is not a fresh result. No provider key is copied from existing project data, serialized into reports, or committed. The user authorized OpenRouter with an economical DeepSeek model and a total $2 ceiling; availability and enforceable allowance must be checked before paid dispatch.

- `corepack pnpm install --frozen-lockfile`: passed; 404 packages reused, historical lockfile unchanged, pnpm 10.18.3 / Node 22.23.2. No newer application Git objects fetched.
- `VITE_COCREATE_AUTH_MODE=local corepack pnpm build`: passed before corrections; strict types plus 1,753 transformed modules. Existing bundle-size warning retained.
- `corepack pnpm check:boundaries`: passed, 155 files, zero boundary violations, no Jev calls.
- Initial complete-suite attempt: running; historical promotion waits and native-browser cleanup/resource failures have reproduced. This candidate is not a green rollback.

### Separate correction 1: SPA entry under hidden checkout parents

Failure: `/` loaded but `/app`, `/login` and `/r/test` returned HTTP 404. `dist/index.html` existed. The stack identified `res.sendFile` at `server/index.ts:808`. Installed `send` source checks every absolute-path segment for dotfiles; the managed checkout has a `.codex` parent. Current Express documentation confirms the supported `root` option.

Change: send fixed filename `index.html` relative to existing `dist` as `root`. No request-selected path is passed to `sendFile`; default dotfile protection remains. This is a local-path correction, not a copied later workflow repair: one server line plus `tests/historical-spa-path.test.ts`.

Afterward: focused regression 1/1 passes for app/login/room routes under a hidden checkout, private-dotfile non-disclosure and unknown API 404. Actual browser opens Canvas, accepts a counter requirement and visibly reports **Synced**. Opening AI setup makes no inference. Paid execution remains pending temporary OpenRouter key connection. The available OpenAI environment key was not used after the user selected OpenRouter.

Current OpenRouter catalog returned `deepseek/deepseek-v4.1-flash`, `response_format` support and input/output rates $0.0328/$0.08 per million tokens. These are October 19 catalog observations, not an invoice or quality guarantee; no application pricing table changed. The historical temporary-key UI has no dollar-limit control, so testing needs a key with at most $2 remaining or an independently enforced allowance before paid dispatch. Sources: [models](https://openrouter.ai/api/v1/models), [key limits](https://openrouter.ai/docs/api/api-reference/api-keys/create-a-new-api-key), [Express sendFile](https://expressjs.com/en/5x/api.html#res.sendFile).

## Release compatibility

This checkout starts with empty local data. Do not run it against current production snapshots or existing user databases. Newer capture journals, cursor/provenance fields, permanent payload hashes, canonical naming bridges, schema changes and open browser contracts require a separately reviewed compatibility/export or forward restoration plan. The restoration patch is for review only; applying it directly to production would not establish data compatibility. No historical SQL rollback or destructive cleanup is part of this task.
