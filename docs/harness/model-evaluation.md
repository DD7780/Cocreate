# Model-routing evaluation protocol

Version: `2026-09-20.v1`. No paid evaluation has been authorized or run.

The canonical executable catalog is `server/ai-presets.ts`. Provider capability checks prove API/schema compatibility only. They do not prove that a model is better at a specialty. Until repeated live trials qualify a mapping, every specialty uses the economical capability-validated baseline on the owner's selected connection and is labelled `hypothesis`.

`server/ai-evaluation.ts` defines a representative task and verification rubric for General app, Engineer, Designer, Web developer, and Motion designer. A candidate needs at least three trials of every task in that specialty, at least 85% requirement satisfaction, at least 80% verification passes, and no more than 0.1 regressions per trial. Comparison reports median latency, total interpretation + generation + repair cost, and cost per verified build. Compilation is only one verification signal.

No model call chooses a model. Routing uses specialty, deterministic task complexity, the selected effort ceiling, capability-checked models on the selected connection, and remaining budget. Unknown complexity keeps the chosen preset without upgrading. Cross-provider routing requires an explicit owner choice. Assignments are frozen for an active run.

The setup UI uses standard input, cached-input where published, and output USD per million tokens. It also shows a one-pass allowance estimate and a worst-case bounded-repair estimate. The editable hard cap is derived from the latter with a 15% reporting margin; it is not a promise of the provider invoice.
