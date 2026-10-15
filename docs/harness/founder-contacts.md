# Founder contacts in the public footer

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
