import type { ProviderRequestRecord } from '../../shared/types';

export type UsageRange = 'today' | 'week';
export type UsageTotals = {
  calls: number;
  input: number;
  output: number;
  usd: number;
  tokenReports: number;
  inputReports: number;
  outputReports: number;
  costReports: number;
  incompleteTokens: number;
  incompleteCost: number;
};
export type UsageBucket = UsageTotals & { key: string; label: string };
const setup = new Set(['model_discovery', 'connection_test', 'capability_text', 'capability_personal', 'capability_builder']);
const empty = (): UsageTotals => ({ calls: 0, input: 0, output: 0, usd: 0, tokenReports: 0, inputReports: 0, outputReports: 0, costReports: 0, incompleteTokens: 0, incompleteCost: 0 });
const known = (value: number | undefined): value is number => value !== undefined && Number.isFinite(value) && value >= 0;

// The room supplies a bounded window, not a complete historical ledger.
export function projectWorkflowUsage(records: ProviderRequestRecord[], range: UsageRange, now: Date) {
  const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const start = midnight - (range === 'week' ? 6 * 86_400_000 : 0);
  const end = midnight + 86_400_000;
  const width = range === 'week' ? 86_400_000 : 4 * 3_600_000;
  const buckets: UsageBucket[] = Array.from({ length: range === 'week' ? 7 : 6 }, (_, i) => {
    const date = new Date(start + i * width);
    return { ...empty(), key: date.toISOString(), label: range === 'week' ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : `${String(date.getUTCHours()).padStart(2, '0')}:00` };
  });
  const byCall = new Map<string, ProviderRequestRecord>();
  for (const call of records) {
    if (!call.callId) continue;
    const previous = byCall.get(call.callId);
    if (!previous || previous.outcome === 'dispatching' || (call.outcome !== 'dispatching' && (call.endedAt || '') >= (previous.endedAt || ''))) byCall.set(call.callId, call);
  }
  const total = empty(), generation = empty(), setupTests = empty();
  let invalidDates = 0;
  const calls: ProviderRequestRecord[] = [];
  for (const call of byCall.values()) {
    const timestamp = Date.parse(call.startedAt);
    if (!Number.isFinite(timestamp)) { invalidDates++; continue; }
    if (timestamp < start || timestamp >= end) continue;
    calls.push(call);
    const reported = call.usageStatus === 'measured' || call.usageStatus === 'incomplete';
    const input = reported && known(call.usage.inputTokens), output = reported && known(call.usage.outputTokens);
    const cost = known(call.estimatedChargeUsd);
    const unsettled = call.outcome === 'dispatching' || call.outcome === 'unknown';
    for (const target of [total, setup.has(call.purpose) ? setupTests : generation, buckets[Math.floor((timestamp - start) / width)]]) {
      target.calls++;
      if (input) { target.input += call.usage.inputTokens!; target.inputReports++; }
      if (output) { target.output += call.usage.outputTokens!; target.outputReports++; }
      if (input || output) target.tokenReports++;
      if (!input || !output || call.usageStatus !== 'measured' || unsettled) target.incompleteTokens++;
      if (cost) { target.usd += call.estimatedChargeUsd!; target.costReports++; }
      if (!cost || call.chargeIncomplete || unsettled) target.incompleteCost++;
    }
  }
  return { total, generation, setupTests, buckets, calls: calls.sort((a, b) => b.startedAt.localeCompare(a.startedAt)), invalidDates, start: new Date(start), end: new Date(end) };
}

export function usageTokens(value: UsageTotals) {
  return value.calls && !value.tokenReports ? 'Unavailable' : (value.input + value.output).toLocaleString('en-US');
}
export function usageCost(value: UsageTotals) {
  if (value.calls && !value.costReports) return 'Unavailable';
  if (value.usd > 0 && value.usd < 0.0001) return '<$0.0001';
  if (value.usd > 0 && value.usd < 0.01) return `$${value.usd.toFixed(4)}`;
  return `$${value.usd.toFixed(2)}`;
}
