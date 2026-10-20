# Publish the verified restoration to main — 2026-10-20

The user explicitly requested publishing the working local restoration to main and replacing the previous non-working version. This authorizes source publication; it does not request a deployment, database migration, paid inference or deletion of user data.

## Change packet and publication contract

- Verified application source: `732fc572a25e9fae0e52d86be13e729188c4deed` on `codex/restore-coherent-4ccc1fb`.
- Inspected remote main: `dd8752f0e7784574bf073970ea9391653a6213f9`, the October 9 restoration. Its ancestry diverges at `4ccc1fbb186ca11f92a847bff550915649555013`.
- Replace the active tracked application with the verified snapshot. A publication merge has current remote main as its first parent and the prepared restored source as its second parent, retaining the restored tree instead of reintroducing superseded application changes. Push this descendant normally; never force-push main. Recheck remote main before publication and stop/re-evaluate if it moved.
- Preserve superseded October 9 release evidence at its existing report/artifact paths, clearly mark the report historical, and retain every earlier commit for rollback. Do not remove other worktrees, drafts, databases, credentials or runtime evidence.
- Allowed preparation edits: this handoff and affected context/checklist/provenance repair documentation, the two historical evidence files, `release-source-files.json` and `wrangler.jsonc` fingerprint. The release helper must include the new source modules and attest current inputs. No application behavior, schema, environment file, isolation ceiling, test deadline or retry change is authorized or required for publication.
- Inspection confirmed `.github/workflows/code-checks.yml` runs checks on push and has no deployment step. Do not run Wrangler deployment or SQL changes. Hosted compatibility and actual Linux acceptance remain separate from the completed Windows/fixture checks.

## Verification

The verified snapshot passed the complete suite twice serially: 260 total, 252 passed, zero failed, eight Linux-only skips. Production/type build, 163-file boundary audit, Graphify, deterministic source ownership and real isolated compiler/browser artifact/recovery flows pass. The user's local application on port 5190 preserves both project JSON hashes. See [the provenance repair](provenance-repair-20261020.md) and [native repair evidence](historical-repair-20261020.md).

Preparation checks require a fresh release fingerprint, complete source-manifest coverage, no application-source difference from `732fc572`, documentation/link and whitespace review, and production build/type/boundary validation. GitHub checks triggered by main publication will be reported separately; source publication is not a claim of successful hosted rollout.


## Prepared publication evidence

Fresh production/type build using the configured public hosted image variables passes; output is isolated under ignored `.runtime/main-publication/hosted-dist` so the running local client remains untouched. Boundary audit: 163 files, zero violations and zero inference. Release manifest covers all tracked runtime inputs, including `server/submitted-sources.ts` and `src/InterpretationNotice.tsx`; 96 source/build files attest fingerprint `e5d11c325dfadea872cee1e0bcdc37acde0b91140906eb0db8cb0e15d12bf92c`. The release helper re-verifies that fingerprint successfully.

A direct Git comparison confirms no application-source or dependency/build-code difference from `732fc572` across server, client, shared contracts, workers, public assets, Dockerfile, package/lockfiles, TypeScript/Vite configuration and HTML entrypoint. Preparation changes only source-attestation metadata and documentation/evidence. Documentation links and `git diff --check` pass. Remote main was rechecked at `dd8752f` before publication. The previous active version remains reachable as the publication commit's first parent; it is superseded in the active application tree.
