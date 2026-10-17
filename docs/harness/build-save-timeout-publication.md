# Build-save timeout publication — 2026-10-17

## Bounded change packet

The user explicitly requested publication to main for beta. Integrate the remaining acknowledgement/status repair from local `27f5088` onto current main `8515724`, preserving its newer canonical-save throughput fix, current interface and replay-aware submission helper. Do not cherry-pick the older server journal wait, old UI, stale decision identifiers or generated graph wholesale.

Scope: `src/provider.ts`, the conditional previous-product message in `src/App.tsx`, `shared/save-timing.ts`, the server flush wait, focused provider/throughput tests, controlled browser harness, release source manifest/fingerprint and affected canonical guidance. No migration, production data mutation, paid inference, provider change or Cloudflare inspection.

Contracts: one caller-authorized submission after confirmed canonical save, insertion/deletion receipt coverage, stable uncertain-submit identity, current membership/coordinator checks, serialized canonical writes and promotion. Preserve coalesced autosaves, fresh authorized frame batches, journal high-water restore and canonical flush independent of the recovery journal. Saving, reconnect and late replies cannot start inference.

## Integrated behavior

The server ends its explicit canonical-save acknowledgement wait after 20 seconds. The client allows 30 seconds including ingress/authorization and reply delivery. These finite supported budgets supersede the earlier 15-second client limit; the measured backlog fixes remain in place. Timeout ends the wait without cancelling or releasing an in-flight canonical write. Its later valid save receipt can update status; no expired flush emits late success or revives its submission. The provider switches from saving to unsynced on timeout/rejection, the existing workspace helper surfaces the error, and the banner mentions an available previous product only when one exists.

Reused actual-provider tests cover delayed acknowledgement while typing, missing/late acknowledgement, explicit rejection and deletion-only reconnect. A new actual-server fake-clock test covers a hung canonical write, no submission/inference before acknowledgement, retained pending edits, unchanged write queue and late valid save receipt without `flushed`. The current journal/sequence/revocation and submit-replay regressions remain in the focused gate. No test restores the superseded journal-blocked flush contract.

## Verification and publication

Fresh local focused provider, submit, throughput and coordinator checks pass **39/39**, zero skips. Production build and import boundaries pass, and all six controlled-browser groups pass with zero physical provider calls. [Focused log](../../artifacts/build-save-publication/focused.log), [build](../../artifacts/build-save-publication/build.log), [boundaries](../../artifacts/build-save-publication/boundaries.log), [browser](../../artifacts/build-save-publication/browser.log). The 98-file release attestation verifies as `6c63bcd11ba42c1da1c633dcda405debffa597745d34f4a5c1a0c7ab75d3cb4f`. Graphify refresh and GitHub production-image CI are recorded as they finish. The earlier standalone repair's failed Windows whole-suite result remains historical evidence on `codex/build-save-timeout`; it is not a result for this integration. Main's prior Linux gate was 273/273.

The browser harness uses the actual built current workspace/provider and real local flush, with controlled AI availability and a no-inference submission handler. Its local-auth bundle is separate at `.runtime/build-save-ui`; production auth settings remain unchanged. It verifies a delayed acknowledgement with one submission under repeated button/shortcut activation, continued typing, truthful first/existing-product failures, unknown save with no submission, no late-reply auto-build, and explicit replay retaining its request ID after a dropped response. Browser timing acceleration is separate from the server's fake-clock 20-second test; authoritative caller capture and failed-receipt recovery remain server/helper regressions.

Publication uses the existing main-triggered beta pipeline after the candidate's full production-image CI passes. GitHub publication is separate from hosted rollout and authenticated real-provider acceptance. No Cloudflare control-plane inspection or manual deployment is needed.
