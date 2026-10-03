import type { AIRunRecord, NormalizedAIUsage } from "../../shared/types";
import { dollars } from "../ai/display";

const tokenCount = (value: number | undefined) =>
  value === undefined ? "Unknown" : value.toLocaleString();

const runKey = (run: AIRunRecord) =>
  [
    run.personalModels.slice().sort().join(","),
    run.builderModel,
    run.workflowMode || run.specialty,
    run.effort,
    run.complexity,
    run.verificationPolicyVersion,
  ].join("|");

function comparableMetrics(history: AIRunRecord[], latest: AIRunRecord) {
  const records = history.filter((run) => runKey(run) === runKey(latest)),
    complete = records.every(
      (run) => run.usage.estimatedChargeUsd !== undefined,
    ),
    verified = records.filter((run) => run.verification.verified).length,
    cost = complete
      ? records.reduce(
          (sum, run) => sum + (run.usage.estimatedChargeUsd || 0),
          0,
        )
      : undefined,
    latencies = records.map((run) => run.latencyMs).sort((a, b) => a - b),
    enough = records.length >= 3;
  return {
    samples: records.length,
    passRate: enough ? verified / records.length : undefined,
    median: enough ? latencies[Math.floor(latencies.length / 2)] : undefined,
    costPerVerified:
      enough && verified && cost !== undefined ? cost / verified : undefined,
  };
}

function UsageSummary({ usage }: { usage: NormalizedAIUsage }) {
  return (
    <dl className="usage-grid">
      <div>
        <dt>Input</dt>
        <dd>{tokenCount(usage.inputTokens)}</dd>
      </div>
      <div>
        <dt>Cached input</dt>
        <dd>{tokenCount(usage.cachedInputTokens)}</dd>
      </div>
      <div>
        <dt>Output</dt>
        <dd>{tokenCount(usage.outputTokens)}</dd>
      </div>
      <div>
        <dt>Reasoning</dt>
        <dd>
          {tokenCount(usage.reasoningTokens)}
          {usage.reasoningIncludedInOutput === true
            ? " (included in output)"
            : ""}
        </dd>
      </div>
    </dl>
  );
}

export function BuildAccounting({
  run,
  history,
}: {
  run: AIRunRecord;
  history: AIRunRecord[];
}) {
  const metrics = comparableMetrics(history, run),
    groups = [
      [
        "Interpretation",
        run.calls.filter((call) => call.phase === "interpretation"),
      ],
      ["Builder", run.calls.filter((call) => call.phase === "builder")],
      ["Repairs", run.calls.filter((call) => call.phase === "repair")],
    ] as const;
  return (
    <details className="build-accounting">
      <summary>Latest build usage and verification</summary>
      <div className="accounting-body">
        <header>
          <div>
            <span>Estimated charge</span>
            <strong>
              {run.usage.estimatedChargeUsd === undefined
                ? "Unavailable"
                : dollars(run.usage.estimatedChargeUsd)}
            </strong>
            <small>
              Pricing snapshot {run.pricingVersion}; provider invoice may
              differ.
            </small>
          </div>
          <div>
            <span>Outcome</span>
            <strong>{run.outcome}</strong>
            <small>
              {run.verification.verified
                ? "Verified by acceptance checks"
                : run.verification.compilationPassed
                  ? "Compiled; functional verification not yet measured"
                  : "Verification did not pass"}
            </small>
          </div>
        </header>
        <UsageSummary usage={run.usage} />
        <div className="call-breakdown">
          {groups.map(([label, calls]) => (
            <section key={label}>
              <strong>{label}</strong>
              <span>
                {calls.length} call{calls.length === 1 ? "" : "s"}
              </span>
              {calls.length === 0 ? (
                <small>None</small>
              ) : (
                calls.map((call, index) => (
                  <small key={`${label}-${index}`}>
                    {call.model}: {dollars(call.estimatedChargeUsd)} · input{" "}
                    {tokenCount(call.usage.inputTokens)} · cached{" "}
                    {tokenCount(call.usage.cachedInputTokens)} · output{" "}
                    {tokenCount(call.usage.outputTokens)}
                    {call.uncertain ? " · usage uncertain" : ""}
                  </small>
                ))
              )}
            </section>
          ))}
        </div>
        <div className="effectiveness">
          <strong>Comparable effectiveness</strong>
          {metrics.passRate === undefined ? (
            <span>
              Not enough comparable data ({metrics.samples} sample
              {metrics.samples === 1 ? "" : "s"}; 3 required).
            </span>
          ) : (
            <>
              <span>
                Verification pass rate {(metrics.passRate * 100).toFixed(0)}% ·
                median latency {Math.round((metrics.median || 0) / 1000)}s.
              </span>
              <span>
                Estimated cost per successful verified build:{" "}
                {metrics.costPerVerified === undefined
                  ? "Not enough data"
                  : dollars(metrics.costPerVerified)}
                .
              </span>
            </>
          )}
        </div>
        <div className="pricing-sources">
          {[
            ...new Map(
              run.calls
                .filter((call) => call.rate)
                .map((call) => [call.rate!.sourceUrl, call.rate!]),
            ).values(),
          ].map((rate) => (
            <a
              key={rate.sourceUrl}
              href={rate.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Official {rate.currency} pricing · verified {rate.verifiedAt}
            </a>
          ))}
        </div>
      </div>
    </details>
  );
}
