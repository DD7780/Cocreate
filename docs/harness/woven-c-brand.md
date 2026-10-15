# Woven C brand integration

## Approval and scope

On 2026-10-15 the user selected concept 04, Woven Canvas, and explicitly requested integration into the application on main. The accepted symbol uses cobalt and dark-ink interwoven curves forming a C. Implement a clean transparent SVG reconstruction for small application use; do not embed the generated concept sheet or its text/background as the logo.

Allowed surface: one public master SVG, a matching adaptive SVG favicon, a reusable presentational BrandMark, current landing/auth/project/local/workspace branding slots, landing/global brand styles, index favicon metadata and affected harness. Existing action icons, screen layout, controls, provider/account authority, private access and routes remain unchanged. No staging/foundation merge or new dependencies.

## Evidence and contracts

Base is main 4ccc1fbb186ca11f92a847bff550915649555013. Source navigation finds branding in LandingPage, App join/topbar and ProjectApp auth/sidebar/empty states. main.tsx selects the root lazily and retains its existing routing. BrandMark is decorative alongside existing visible names; keep accessible link names and explicit image dimensions. Preserve hiding of the compact workspace mark at the existing narrow breakpoint, all build/shortcut semantics and the real waitlist.

One master asset supplies every application mark. Favicon shares its path geometry; only the ink color adapts on dark browser chrome. Keep wordmarks as accessible text, retaining the approved Inter direction. Do not introduce generated raster lettering or a giant concept PNG into the bundle.

Graphify query was attempted but the executable is unavailable. Source inspection is used instead; record the graph refresh result after the edit.

## Verification and publication

Fresh local evidence:

- Strict TypeScript and production Vite builds pass, including a render check using the existing production public build variables. A separate explicit local-mode build supports the synthetic canvas check. Build variables and dist output are local-only; no configuration contract changed. The pre-existing large workspace chunk warning remains.
- UI scope audit inventories 156 files, with zero boundary violations and no files outside UI scope. SVG XML parses successfully; the master and favicon contain the same four path geometries, with no scripts or external references.
- Existing beta access/request/Workflow regression tests pass 14/14, zero failures/skips. No inference, live identity or email was invoked.
- Browser checks confirm all three landing marks load, the favicon link is declared, both real AuthShell positions load the SVG and sign-in renders at 390 px without overflow. No credentials were entered or authentication submitted.
- A synthetic local room shows the 34 px woven C in the workspace header. The existing compact-header hide behavior is retained at 390 px, with no overflow; AI remains disconnected and no build was invoked. Real signed-in project-sidebar/account behavior was not reverified; its JSX now uses the same compiled image component.
- [Browser checks](../../artifacts/woven-c-brand/browser-checks.json), [landing](../../artifacts/woven-c-brand/landing.png), [sign-in](../../artifacts/woven-c-brand/signin.png), [workspace](../../artifacts/woven-c-brand/workspace.png).
- Prepared source fingerprint: `31f869056b15e343a7a7acaa6a10a5956e6102bafdde56fd2dbb37ec98a3aa19`; 96 manifest paths, adding only src/BrandMark.tsx and public/brand/woven-c.svg.
- Graphify query and update were attempted; the executable is unavailable. Its graph is not represented as refreshed.

Production-image CI and the authorized main merge remain the publication gate. Public rollout and hosted account acceptance are separate observations. No live account/email, paid inference, migration or cloud resource changes are part of this branding slice.

Rollback: revert the logo-only client/public/index/harness changes and reprepare source attestation. No data/schema/auth rollback is required. Public deployment acceptance is separate from source publication.
