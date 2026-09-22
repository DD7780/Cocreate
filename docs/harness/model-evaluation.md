# Model-routing evaluation protocol

Version: `2026-09-21.v2`. No paid evaluation has been authorized or run.

The canonical executable catalog and mode availability map are in `server/ai-presets.ts`. Provider capability checks prove API/schema compatibility only. They do not prove that a model is better for a workflow. Developer uses the economical capability-validated baseline on the owner's selected connection and is labelled `hypothesis` until repeated live trials qualify it. Analyst and Researcher have no routing candidates because their required tools are not implemented.

`server/ai-evaluation.ts` defines a representative Developer task and verification rubric. A candidate needs at least three trials of every implemented-mode task, at least 85% requirement satisfaction, at least 80% verification passes, and no more than 0.1 regressions per trial. Comparison reports median latency, total interpretation + generation + repair cost, and cost per verified build. Compilation is only one verification signal. Analyst and Researcher cannot qualify while their task lists are empty; the evaluator returns an explicit tool-workflow prerequisite instead of treating zero trials as success.

No model call chooses a model. Developer routing uses deterministic task complexity, the selected effort ceiling, capability-checked models on the selected connection, and remaining budget. Unknown complexity keeps the chosen preset without upgrading. Cross-provider routing requires an explicit owner choice. Assignments are frozen for an active run. Unavailable modes never silently route through Developer.

The setup UI uses standard input, cached-input where published, and output USD per million tokens. It also shows a one-pass allowance estimate and a worst-case bounded-repair estimate. The editable hard cap is derived from the latter with a 15% reporting margin; it is not a promise of the provider invoice.
