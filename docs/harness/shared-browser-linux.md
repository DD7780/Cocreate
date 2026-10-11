# Shared browser Linux executor — bounded continuation packet

2026-10-11, base `ac20bc1`, `codex/canvas-artifacts`. Finish the runtime prerequisite for the existing Linux production image; do not change session ownership, grants, private login, controller fencing, downloads, Canvas or Workflow accounting.

Scope: build-time trusted Chromium binary attestation; shared browser admission; existing Bubblewrap/cgroup adapter; strict bounds and actual Linux session tests; Docker build preparation, canonical steering/runtime/API/recovery instructions. No deployment or cloud account mutation.

Linux uses the already verified stopped-parent launcher and cgroup admission before execution, capability-free namespaces with no network, scoped read-only runtime and fresh private writable profile. Extend only shared-session wall/aggregate CPU/output limits to the Windows-equivalent 600 seconds/60 CPU seconds/64 MiB protocol output; retain the 512 MiB physical bound, 64 kernel tasks, 8 MiB single-file bound and 16 MiB monitored profile. Compiler/acceptance browser budgets stay unchanged. Every descendant is killed before profile cleanup. Linux task counts are distinct from Windows's one-process boundary.

Image construction records the exact fixed-path Debian Chromium binary/version/hash. Admission verifies the bytes against that trusted image record. Missing/mismatched attestations or unavailable cgroup delegation fail closed; the attestation alone is not runtime isolation proof. Actual controlled websites and two independent authenticated participants must pass native network/file denial, lifetime beyond the acceptance-tool limit, private login/share/handoff/stale commands, private downloads, pause/reopen/disconnect and no uncertain replay. Exercise aggregate CPU cancellation and child cleanup under the extended session budget. Run focused checks locally where supported and exact-source native Linux CI; preserve Windows evidence as dated history.

Hosted rollout, operator origin selection, real authenticated accounts/Storage/RLS/revocation/replacement remain separate. Never enable a host execution fallback when the Linux runtime preflight fails.
