# Interactive Blender — bounded change packet

Requested 2026-10-11. Base `e7d0741`, branch `codex/canvas-artifacts`. Background Blender evidence remains dated and does not establish interactive isolation.

## Outcome and prerequisite gate

Actual dedicated Blender application viewing/input inside Artifacts, never whole-desktop sharing by default. Reuse explicit local pairing/grants, one controller/epochs, exclusive companion lease, STOP and private versioned results. Human input and agent execution must be mutually exclusive and handoff must await cleanup.

First inspect the verified Windows x64/Blender 4.5.14 boundary. A GUI process needs a separately isolated desktop/window station or disposable guest with verified graphics/input/capture. Do not enable host-default-desktop capture, inject global input, grant network or widen filesystem access to make GUI startup pass. If the native boundary cannot deny unrelated windows/clipboard/files/credentials or cannot render a GUI, record actual probe evidence and keep interactive controls unavailable. Independent preview-release preparation continues.

## Scope and acceptance

Allowed: trusted native boundary probes/adapter and dedicated trusted Blender UI operations; companion session transport and receipts; shared validated input/view contracts; Artifacts viewer; private publication integration; focused tests and eight canonical documents. No arbitrary scripts, imported hostile scenes or whole-desktop fallbacks.

Before enabling: real GUI frames/input; unrelated-window/clipboard/path/network/credential denial; bounded processes/memory/CPU/wall/output; stale/unauthorized commands; human-versus-agent exclusion; immediate local STOP; disconnect/restart uncertainty without replay; two participants observing/handoff/stop/saved outputs. Record exact new commit and environment. A background render is not an interactive frame or acceptance proof.

## Native gate result — 2026-10-11

The probe-only launcher derives from the verified AppContainer runner, adds a unique private desktop with an explicit DACL and all eight Job UI restrictions, and removes `--background`. It never switches the user desktop, captures its screen or sends global input. Official portable Blender 4.5.14 retains its zero-capability AppContainer, one-process Job, isolated workspace, clean environment and thirty-second wall limit.

Fresh evidence: [environment-probe.json](../../artifacts/interactive-blender/environment-probe.json). The graphical process reported Win32 access/invalid-handle errors and an access violation before the trusted timer script could produce results. The launcher reached its wall limit (exit 124); the child was confirmed absent. Therefore **none** of the proposed graphical window, clipboard, input or frame checks passed. Posted input, even if it had succeeded, would not prove an actual editor change.

Reproduce only on the pinned Windows environment with `COCREATE_BLENDER_EXECUTABLE` set to the verified portable executable: `node --import tsx scripts/probe-interactive-blender.ts`. This is a diagnostic script, not a runtime adapter. Its native/Python hashes are recorded in the evidence; production launcher behavior is unchanged. Preserve this dated failure before any new probe.

Status: **blocked at the interactive environment gate**. No interactive endpoint/view/control is enabled. Existing background execution and private scene/render retrieval remain supported. Docker/VirtualBox/QEMU were absent and WSL was not installed in this checkout's host. A disposable graphics-capable guest or another narrowly isolated application environment must first demonstrate actual frames and effective input, plus all isolation and recovery checks above. Installing a guest, widening privileges or using the host's default desktop is not an accepted workaround. The requested two-participant interactive demonstration cannot be claimed. Independent generated-frontend preparation proceeds.

Exact probe milestone source: `f65b8caec28ba4a18fa57d6cecc392243b209b81`, committed/pushed on `codex/canvas-artifacts`. [Source CI run 38083869109](https://github.com/DD7780/Cocreate/actions/runs/38083869109) succeeded. That regression result does not execute or establish the Windows graphical probe boundary; the failed native evidence above remains authoritative. The subsequent preview milestone preserves this gate and its dated evidence.
