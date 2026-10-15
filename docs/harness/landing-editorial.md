# Approved pre-launch landing redesign

## Outcome and authority

On 2026-10-15 the user approved the six-iteration local preview and explicitly requested publication to main. Replace the older public root page with the approved three-column editorial design: a team introduction; section introductions; expandable plain-language feature explanations. Keep Studio Ivory and Inter. Place the workspace example below, followed by FAQ and the existing private beta waitlist. Restore the plain sign-in above the introduction beta invitation; use “Already a beta tester?” and an outlined sign-in at the overview bottom; retain footer sign-in.

This authorizes the landing release through the existing push-triggered deployment path. It does not authorize merging the separate artifact/browser/Blender/staging foundations, changing account grants, creating cloud resources or spending on model inference.

## Bounded scope

Allowed client files: src/LandingPage.tsx and src/landing.css. Preserve src/main.tsx routing and every other app screen. Update the existing landing browser-check expectations, add a focused server-render/accessibility regression, and maintain affected canonical harness documents. Reprepare the existing release-source-files.json/wrangler source attestation; change no provider/account/resource configuration. No server/shared/schema/authentication/permission changes.

Graphify query was attempted but the executable is unavailable in this environment. Source navigation instead verified src/main.tsx → LandingPage.tsx → landing.css, the waitlist handler, server beta route tests and existing browser checker. Attempt graph refresh after implementation and retain its actual outcome.

## Contracts to preserve

- Public root only; existing /login?returnTo=%2Fapp, private /app, invitation, callback and recovery boundaries remain unchanged. Knowing a project link confers no access.
- Reuse the actual POST /api/beta/waitlist with email, consent and website honeypot. Preserve maxlength, required consent, pending/disabled state, success only after acknowledged persistence, retryable errors, and non-enumerating server semantics. The preview no-submit handler and badge must not enter production.
- Typing and browsing do not infer. Explain the actual build button and editor-focused Windows/Linux Alt+X without starting AI work from the landing demonstration.
- Use one Contradictions category. Keep explicit contributor agreement, serial updates, last working result, usage uncertainty, current OpenRouter BYOK and explicit model selection claims accurate. The existing runtime is unchanged.
- Mark document/browser/Blender illustrations as expanded-beta examples under verification, not publicly available tools. Model routing and built-in cloud publishing remain planned. Do not advertise arbitrary model/tool availability.
- Keyboard-operable native feature/FAQ details, independent tab groups, responsive layout, visible focus, reduced-motion support, no tracking/new dependencies.

## Verification and release

Fresh local checks on the implementation:

- TypeScript strict check and production Vite build pass. The first HTML-to-JSX check caught string-valued numeric attributes; these were corrected before the passing check. The existing large workspace chunk warning remains; no dependencies or app runtime modules changed.
- UI scope/boundaries pass: 155 inventoried files, zero boundary violations and no files outside the allowed UI/documentation scope. No Jev or other provider calls occurred.
- Existing beta access/request/Workflow regressions pass 14/14 with no failures or skips. These use local/synthetic state and controlled transport, not real accounts or email.
- The built React page passes keyboard tabs in both example groups, mobile horizontal output navigation, native disclosure keyboard collapse, capability-link expansion, and desktop/mobile overflow checks at 1920, 1280, 768, 390 and 320 pixels.
- A synthetic local signup displayed the real API success message and disabled repeat submission; the local SQLite registration count is one. Existing regression tests retain failed-write, consent, abuse-limit, request/reviewer and private-access checks. No hosted signup, account or mailbox was exercised.
- [Browser evidence](../../artifacts/landing-editorial/browser-checks.json), [desktop](../../artifacts/landing-editorial/local-desktop.png), [synthetic local signup](../../artifacts/landing-editorial/local-signup-mobile.png).
- Prepared source fingerprint: `f4ddcf64eec0f6fd1bfa3a793a41c945f73ac86769c39f5556eb493dfeb80758`, 94 unchanged manifest paths. The manifest contents are unchanged; only the trusted expected hash changes in wrangler.jsonc.
- Graphify query and update were attempted; the executable is unavailable. No generated graph was represented as refreshed.

Production-image CI and main publication are the next gates. Live rollout and live account/signup acceptance remain separate; local browser evidence does not establish hosted behavior.

Rollback: revert this landing change and reprepare source fingerprint, keeping beta/security/migrations and unrelated Workflow release intact. Do not roll back account or Storage policies for a UI release.
