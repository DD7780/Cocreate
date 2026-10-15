# Public entry cleanup

## Requested outcome and boundaries

The user requested a single sign-in section without the left marketing panel and a review of redundant public-page wording. Keep the approved three-column pre-launch page, useful expandable feature explanations, the Woven C identity and Studio Ivory theme. Use plain “Sign in” labels. Present this revision locally for review before publication.

Allowed files: ProjectApp.tsx presentation, styles.css/studio-ivory.css auth selectors, LandingPage.tsx copy, affected landing selectors, source fingerprint attestation and canonical harness notes. Retain every auth handler, field, validation, destination, account/recovery link, waitlist request/consent and access gate. No server, schema, provider or deployment changes. No live account/email action.

## Navigation and verification plan

AuthShell owns account-entry presentation; Login, Signup, ForgotPassword, ResetPassword, callback and invite states reuse it. LandingPage owns the public introduction, expandable details, demo and waitlist. Remove obsolete auth-story styles after removing its JSX. Make the shared shell a centered single column at desktop and phone sizes; preserve task-specific errors and recovery guidance.

Graphify query was attempted but the executable is unavailable; use source/caller inspection and attempt the required update after editing. Verify strict TypeScript/build, UI boundary/scope audit, desktop and phone rendering, keyboard/password controls and public links. Do not submit real auth or waitlist forms. Record actual results and limitations before handoff.

## Local evidence and review handoff

Base: main `64cce27ee2f25c5b90b0a969c8998c3ab2ca6d34`. Source fingerprint: `b3a477835e45a2f26171bd0c747dae8a8c4e10d798e283f008a40242f61ddffd` (same 96 manifest paths). Wrangler changes only the expected source fingerprint.

- Strict TypeScript and a production client build pass using the existing public image variables. The existing large workspace chunk warning remains; no dependency was added.
- UI audit: 156 files, zero boundary/scope violations, no provider calls. Nine focused session-refresh, beta-access/waitlist and shortcut regressions pass with zero failures/skips.
- The account card is centered at desktop widths, contains no auth-story panel, and fits at 390 px with no horizontal overflow. Password reveal/hide and Email-to-Password keyboard navigation work; the synthetic test value was cleared.
- Signup and password-recovery links retain `/app` as the return destination. Their forms render at phone width without overflow. No form was submitted.
- The pre-launch layout retains its introduction and 17 expandable explanations/FAQs; expansion works. Plain Sign in links still target `/login?returnTo=%2Fapp`. The waitlist form and required consent remain. No waitlist submission occurred.
- Browser console warnings/errors: none observed. Graphify query/update could not run because the executable is unavailable; no graph refresh is claimed.
- Evidence: [browser checks](../../artifacts/public-entry-cleanup/browser-checks.json), [desktop sign-in](../../artifacts/public-entry-cleanup/signin-desktop.png), [phone sign-in](../../artifacts/public-entry-cleanup/signin-phone.png), [pre-launch page](../../artifacts/public-entry-cleanup/prelaunch-desktop.png).

Local preview: `http://localhost:8719/login?returnTo=%2Fapp` and `http://localhost:8719/`. Local server mode is used only to serve the built presentation. This is not hosted authentication acceptance. No new real account, login, email, migration or release occurred. The user reviewed the preview and explicitly requested publication to main. Production-image CI and the main merge remain the publication gates; live rollout is a separate observation.

Rollback: restore presentation files and harness notes and reprepare attestation; no database or authentication state rollback is involved.


Founder contact follow-up: the user supplied both founders’ public details, approved expanded-footer placement and requested main publication. Current scope/evidence lives in [founder contacts](founder-contacts.md).
