# Beta setup and acceptance

This guide covers the full intended beta. Deployment of the platform and deployment of a generated application are separate operations. A feature awaiting its connection or hosted acceptance remains blocked, rather than removed from the release scope. [Current staging packet](full-beta-staging.md) owns exact verification and pending work.

## Operator setup

Use only the separate Supabase project `ctnjxvwyttnjehnbfktq` and Worker `cocreate-beta-staging`. The proposed login URL is `https://cocreate-beta-staging.susan981314271.workers.dev/login`; the Worker now exists and its health passes, but application login currently returns 503 until a successful container-backed deployment is recorded. No custom production domain, production namespace, cron or production secret belongs in this setup. The [allocated public target](staging-target.allocated.json) supplies build configuration; it contains a publishable key only.

The approved basic host is the first platform test environment. Build through the existing Cloudflare Workers Builds architecture because local Docker is unavailable. Use the frozen `codex/beta-staging-20261013` branch at tested source `6f6ef3ac304b9b095a06cea43bb93207f130734e`, disable preview branch builds, and set these explicit commands:

```text
Build: node --import tsx scripts/prepare-hosted-staging.ts --target docs/harness/staging-target.allocated.json
Deploy: node node_modules/wrangler/bin/wrangler.js deploy --config wrangler.staging.local.jsonc
```

Never use a default deploy command against production to test a feature branch. Workers Builds' selected "production branch" is the deployment branch of the separate staging Worker; it does not authorize main. Confirm the actual build commit, generated configuration hash/fingerprint, Worker version, container version and uploaded registry digest. A successful Worker-only version or local CI image ID is insufficient. Wait for container-backed health and exact fingerprint before issuing signed-in tests. Worker and image activation are not transactional: inspect active versions after a failure before retrying. [Official deployment documentation](https://developers.cloudflare.com/containers/guides/deploy/) was checked 2026-10-12.

Keep `.runtime/hosted-beta/server-secrets.json` private and Git-ignored, owned by the operator. On this workstation the owner is QUTA4, with QUTA4/SYSTEM-only file and directory ACLs; operator checks run as QUTA4. Preserve independent `SESSION_SECRET` and `CREDENTIAL_ENCRYPTION_SECRET` across restarts. Enter the staging project's modern `SUPABASE_SECRET_KEY` as a quoted JSON string. Run `node --import tsx scripts/check-staging-secrets.ts` before using the file. Failures suppress values, JSON excerpts and underlying errors. Never print the file or pass a key in command arguments, public build variables, Canvas or receipts. The 2026-10-13 exposed staging key must be replaced/revoked before it is used; production credentials were not read or changed.

Configure these three values as staging Worker secrets, rather than build arguments. Verify the server key against the staging backend through an authenticated read without printing headers or bodies. The source schema is initialized with 12 migrations and private `cocreate-artifacts`; participant access still needs separate proof. Retain exact migration history/source hashes. Do not replay an uncertain migration or repair provider timestamps to filenames.

Configure Supabase Auth Site URL to the exact staging origin and permit only the exact staging `/api/auth/callback` redirect. Keep production origins and wildcard callbacks out. Password sign-in does not need Google configuration. If Google, confirmation/reset email or invitations are to be tested, configure their staging-only provider/sender and designated recipients explicitly; do not copy production secrets or send unapproved mail. [Official redirect guidance](https://supabase.com/docs/guides/auth/redirect-urls) supports exact allowlists.

## Separate tester identities

Designate owner, editor, viewer, unapproved, outsider and revoked users in staging. Use trusted staging administration to create/confirm fixture users without sending invitations, then distribute their unique passwords through the user's password manager. User-chosen passwords and key changes are entered by the user in the appropriate private/provider interface. No shared login, administrator key or token-bearing URL is a tester login. [Supabase user administration](https://supabase.com/docs/guides/auth/users) distinguishes account creation from invitations that send email.

Manual beta approval and project membership are separate. Owner/editor/viewer are approved members of the fixture project; the viewer cannot submit, reset funding, edit members or connect providers. Unapproved has no beta approval. Outsider is approved without fixture membership. Revoked remains approved but loses membership. Use a second fixture project that none of those actors may access. Keep permissions probes away from real user data.

Two participants sign in through `/login` using independent browser profiles. Their passwords are distinct from the database password used to create Supabase. Store short-lived real test access tokens only in the private `.runtime/hosted-beta/credentials.json` fixture, with operator-only ACLs. Run the existing hosted verifier against the exact tested commit/fingerprint. Real Auth identity, API, sockets, direct RLS and hash-verified private Storage are required; administrator queries and synthetic transports cannot pass this gate. Expired credentials require refresh, not relaxed checks.

## Canvas, artifacts and documents

Both participants edit the shared Canvas; typing, navigation and unsubmitted drafts must produce zero inference. Each explicitly submits only their own edits through **Build my changes**. The accepted registry and durable Workflow remain authoritative; verify physical usage converges without changing its accounting rules. Each participant selects their own artifact/version in Artifacts without changing the other participant's viewer.

For a document, submit an explicit request with a quoted title, such as `Write a Markdown document titled "Beta notes" with sections Goals and Checks.` Verify the generated document's actor/input/version references, visible Markdown and private download. Create a second version, recover the first after reload and empty-cache restoration, and confirm access is lost after revocation. Applications remain subject to compilation and browser verification; a document check is not application correctness or factual accuracy.

Real generation requires the participant's private provider connection or temporary OpenRouter BYOK plus a bounded model/spending configuration. Enter the key only in the app's connection interface. Paid acceptance calls need a concrete approved budget; infrastructure approval alone does not authorize them. Controlled CI demonstrates protocol and recovery but cannot establish live model quality.

## Shared browsers

Open Artifacts' browser view, select an operator-approved website origin, and **Open private browser**. The connection owner explicitly chooses observers/controllers and completes private login. Project membership alone must reveal neither cookies nor authenticated screens. Only **Share this authenticated screen with granted participants** makes the authenticated view available to those participants.

Use the dedicated viewport and authenticated input controls. One controller owns the current epoch; **Hand off control** must fence old commands. Both participants choose their views independently. Exercise private-login return, pause/cancel, expiry, disconnect/reconnect and unknown input receipts. Never blindly repeat uncertain actions. The isolated native browser and trusted bounded origin broker must pass real hosted network/file/kernel restrictions; existing application acceptance browsing is a different capability. Controlled hostile pages cannot grant authority. Downloads support validated UTF-8 `.txt`/`.md` only, published as private project artifacts after explicit validation/publication.

## Blender companion

Use **Connect my computer** inside Artifacts, then run the repository companion on the device you own. Install the documented Node/dependency environment and the checksum-verified official portable Blender **4.5.14** runtime separately; keep runtime and a fresh dedicated non-linked workspace separate. The companion currently requires repository dependencies; a signed standalone installer is not supplied. A pairing token is single-use and short-lived; keep it off chat, Canvas, public logs and Git.

```text
node --import tsx scripts/blender-companion.ts --server <staging-origin> --project <project-id> --pair <private-one-time-token> --blender <verified-executable> --workspace <dedicated-workspace> --observe <participant-ids> --control <participant-ids> --operations create_scene,save,render
```

The device owner reviews the exact project, executable, directory and participant grants and types `CONNECT`. Windows x64 uses verified AppContainer/Job Object background execution, a local exclusive lease and protected credential files. It supports structured basic new scenes, saves and renders; it does not stream the Windows desktop, import arbitrary `.blend` files or run generated scripts. Local STOP/Ctrl+C cancels/disconnects. Saved outputs are private immutable artifacts.

For actual interactive viewing/input, use the separately verified **Linux private-Xvfb** environment and `--interactive`. It needs the pinned runtime, private display, owner-only workspace, zero application capabilities and delegated cgroups with the verified 3 GiB parent/2 GiB desktop boundary. The basic 1 GiB staging container does not prove that boundary. A separate owner-operated Linux companion may be paired, but its own installation, transport, network/isolation and STOP behavior must be verified; do not assume the server's environment supplies companion isolation. Any larger/new billed host needs a concrete costed approval. Windows GUI/general whole-desktop/other-application control is not implemented.

Demonstrate two granted observers, explicit controller handoff, stale input denial, human/agent exclusion, STOP during work, disconnect recovery, save/reopen and private scene/render retrieval. Background execution proof does not pass these interactive gates. Network loss cancels work; resume never relaunches recorded commands. Reconcile retained completed output explicitly under original authority; expired/revoked devices cannot automatically publish orphan files.

## Generated application preview

The implemented adapter is static Cloudflare **Pages Direct Upload**. This needs a dedicated Pages project only for the generated app, independently of platform staging. The proposed `cocreate-generated-preview-beta` target has not been created and requires separate resource approval. Static-only expected cost is $0 within documented limits; no Functions, backend or paid resource is included.

The connection owner opens **Connect an existing Cloudflare Pages project** in Artifacts, selects the exact account/project/preview target and enters a scoped Pages Edit token through that private form. **Verify connection** performs read-only target checks. Explicit release grants remain separate from project membership. Credentials stay encrypted server-side; do not repurpose the operator's broad saved Cloudflare authorization.

Select an actual retained application version and **Prepare preview plan**. Review its exact source/output/plan hashes, verified target/environment, unique branch and public exposure. Only **Approve and upload preview** authorizes that concrete release. Retain durable provider receipts and verify immutable live bytes/behavior. Unknown outcomes require **Reconcile outcome**; never blindly upload again. Recover previous bytes through **Prepare recovery of these exact files**, then a new separately reviewed approval. This is not deploying 2guys1canvas or a backend application.

## Release and cleanup

Require fresh full-beta hosted evidence and a successful exact-source CI run before production review. Disabled, unconfigured or unverified capabilities remain named blocked gates. Retain a tested v6-compatible uploaded registry recovery image and immutable private bodies; a local Docker image ID is not a recovery receipt. Rollback must preserve schema, private artifacts and permanent command receipts; never replay paid work or unknown provider actions.

For cleanup, stop/revoke sessions and drain/reconcile fixture work first. Review exact staging Worker/container/namespace IDs, staging Supabase ref and any separately created preview target IDs before deletion. Preserve sanitized receipts/recovery bytes, revoke dedicated test tokens and verify absence afterward. Do not delete production resources or shared images. Failed/uncertain cleanup stays explicit and may continue billing; the approved estimate is not a hard spending cap. [Detailed costs and cleanup](minimal-staging-resources.md) remain applicable.

## Current staging continuation and manual build credential

The server key now verifies and all three secrets are uploaded; the user confirms old-key revocation. Auth has the exact staging Site URL/callback. Seven test identities and two private fixture projects are provisioned without mail. Their unique passwords and fresh tokens are in the QUTA4/SYSTEM-only, ignored .runtime/hosted-beta/test-accounts.json. Retrieve/distribute passwords through your local password manager; never copy administrator keys, JWTs or bearer URLs into chat/Canvas. The Cloudflare Worker URL is allocated, but login remains 503 until container deployment. These credentials do not make the hosted beta usable yet.

The user chose to configure a build credential; the GitHub connection is unsubmitted. Use an account-owned token with Workers Editor scoped to the existing cocreate-beta-staging Worker and an explicit expiry. Container registry/Containers/Cloudchamber deployment permissions must be reviewed separately for this account; Workers CI Write is needed to configure the Builds API. Do not choose the automatic broad token or the production build token, and do not add routes/KV/R2/D1/AI permissions by default. Official [granular Workers authorization](https://developers.cloudflare.com/workers/authorization/) supports individual-Worker scope and notes OAuth login does not support it. The exact combined container/Builds token scope still needs provider validation; no narrow scope is claimed verified. Enter the token only into private/provider configuration. Then verify account/Worker scope, connect the frozen newly-tested staging candidate, disable previews, and use the explicit staging build/deploy commands above. Never deploy the old 6f6ef3a branch as the updated cache-boundary candidate.

D-0071 delivers participant artifact bytes through app routes with current membership checks. Raw participant Storage reads are denied even for approved owners; app downloads remain available. The original cached-URL tests failed, so keep a separate legacy cache-cutoff release gate. Header/policy changes do not prove existing cached copies have vanished. Do not delete immutable outputs or restore raw Storage grants to remove a warning. Local HTTP/WS tests using real staging accounts/backends help preparation but cannot satisfy Cloudflare-hosted release gates.

The updated frozen build branch is codex/beta-staging-20261013-a53a920 at exact green a53a920 source; the older branch remains historical. Use the QUTA4/SYSTEM-only .runtime/hosted-beta/tester-logins.csv for password-manager import of the six participant-role credentials; it contains no administrator key or JWT. Hosted login remains unavailable until the scoped build connection and actual container health pass. The docs-only evidence handoff changes no tested source.
