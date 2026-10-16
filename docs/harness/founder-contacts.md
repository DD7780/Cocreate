# Founder contacts in the public footer

## Icon presentation follow-up — 2026-10-16

Outcome: match the user's contact-row screenshot with a small filled envelope, boxed LinkedIn mark, serif labels and vertically stacked links for each founder. Include only the requested Email and LinkedIn destinations; the screenshot's x.com row is reference styling, not a supplied founder account.

Bounded scope: `src/LandingPage.tsx`, `src/landing.css`, affected harness guidance/evidence and required release attestation. Reuse the installed icon library; no dependency, data/API, contact destination, auth or waitlist changes. Keep decorative icons hidden from assistive technology, preserve person-specific accessible labels/new-tab protections, readable contrast, visible keyboard focus and stacked phone profiles.

Evidence: Graphify query `founder footer contact email LinkedIn landing page` surfaced this packet, `LandingPage` and its scoped stylesheet. Source footer links are at `LandingPage.tsx` around line 1304; contact styles are at `landing.css` around line 2556. Current-main base is `680c84b`; unrelated changes in the primary checkout remain untouched.

Verification: production build, import boundaries and UI-only scope audit; controlled desktop/phone browser checks for reference styling, all four original hrefs, accessibility/focus and overflow. This presentation-only change needs no new unit tests or unrelated full runtime suite. Refresh the graph, prepare/verify the release fingerprint, and push to main. Per the user's standing instruction, stop at GitHub publication and do not inspect Cloudflare deployment.

Local evidence: the [reference](references/founder-contact-icons.png) was visually compared with the built [desktop](../../artifacts/founder-contact-icons/desktop.png) and [phone](../../artifacts/founder-contact-icons/phone.png) screenshots. Filled envelope/boxed LinkedIn marks, serif labels and vertical alignment match the requested style; text retains the existing readable muted color. No links or forms were activated. [Browser assertions](../../artifacts/founder-contact-icons/browser-checks.json) pass at 1440, 390, 320 and 720 CSS pixels (the last at 2× scale), preserving all four exact hrefs, person-specific accessible names, external-link protections, phone profile stacking and keyboard outline. External requests were blocked. `corepack pnpm build`, `corepack pnpm check:boundaries`, `corepack pnpm audit:code -- --check --scope ui --base 680c84b` and `git diff --check` pass. The audit covers 161 files, zero boundary/scope violations and no model calls; the existing workspace chunk-size warning remains. Logs are retained in `artifacts/founder-contact-icons/`. No Cloudflare or live deployment inspection is part of this slice.

Graphify AST update completes with 2,299 nodes / 5,470 edges / 124 communities and no model calls. Prepared and verified the required 97-path release fingerprint: `13fff5d2cbf55176f556d89e6324fe76488c5af20a8f84a5e9b293b93db66cda`. The deployment configuration changes only that attestation value. Publication is a normal main push; automatic GitHub checks are separate from the local checks above, and no live deployment claim is made. Earlier verification plans/results below describe the original 2026-10-15 footer feature.

## Approved scope

The user approved moving Meet the founders into an expanded footer underneath the logo/description/Sign in row, supplied both founders' public contact details and explicitly requested integration and main publication. Display Susan Bhatta and Aaryan Bastakoti as co-founders. Use the supplied Gmail addresses as mailto links and the exact supplied LinkedIn profile URLs as external links. Remove the generic team sign-off from the introduction.

Allowed files: LandingPage.tsx, landing.css, release fingerprint and affected harness/evidence. Preserve the current landing layout, anonymous waitlist, consent, sign-in routes, private access gates and the newer Canvas presentation already on main. No new contact form, backend, account configuration or dependencies. Links do not send messages automatically.

## Verification plan

Use a current-main baseline. Inspect landing/footer callers and styles. Graphify query/update are required attempts; the executable is currently unavailable. Check TypeScript/build, the UI audit and diff. Verify actual built desktop/phone footer layout, exact contact hrefs, external-link protections, retained sign-in target and absence of the old sign-off. Do not send email, submit waitlist/auth forms or log into LinkedIn. Pass production-image CI before the authorized merge. Report source publication separately from live rollout.

Rollback: revert only footer/sign-off presentation and its documentation, then reprepare source attestation. No data/auth rollback is required.

## Local verification

Base: main `6fd5c86d6444f12714a1018f360728e121fb3a52`, retaining the concurrent Canvas writing-surface release. Prepared fingerprint: `37e30983d111437b4ad978691343e3dddc0bfddc732b03f1c007c4b1813c1d5e`; unchanged 96 manifest paths.

- Strict TypeScript and the production client build pass. The pre-existing large workspace chunk warning remains. No dependencies added.
- UI audit inventories 157 files with zero boundary/scope violations and no provider calls. Diff whitespace check passes.
- Actual built footer at 1440 px has two profiles; at 390 px they stack, with no horizontal overflow. Both names render correctly. The original sign-off is absent; footer Sign in retains `/login?returnTo=%2Fapp`.
- All four hrefs match the user-supplied email/profile details. LinkedIn anchors include noopener/noreferrer and accessible new-tab labels; email links are ordinary mailto anchors. No contact action was executed.
- Browser console warnings/errors: none observed. No auth/waitlist form was submitted. No live authentication acceptance is claimed.
- Graphify query and update were attempted; the executable is unavailable, so its graph was not refreshed.
- Evidence: [browser checks](../../artifacts/founder-contacts/browser-checks.json), [desktop](../../artifacts/founder-contacts/desktop.png), [phone](../../artifacts/founder-contacts/phone.png).

Production-image CI remains the authorized main-merge gate. Live rollout is a separate observation from publication.
