import test from 'node:test';
import assert from 'node:assert/strict';
import type { ProviderRequestRecord } from '../shared/types';
import { projectWorkflowUsage, usageCost, usageTokens } from '../src/workspace/workflow-usage';

const now = new Date('2026-10-15T18:00:00Z');
const call = (id: string, fields: Partial<ProviderRequestRecord> = {}): ProviderRequestRecord => ({
  callId: id, workspaceId: 'room', provider: 'openrouter', purpose: 'builder', configurationVersion: 'test',
  startedAt: '2026-10-15T12:00:00Z', endedAt: '2026-10-15T12:01:00Z', outcome: 'succeeded', estimatedInputTokens: 20,
  usage: { inputTokens: 20, outputTokens: 10, cachedInputTokens: 5, reasoningTokens: 7 }, usageStatus: 'measured', estimatedChargeUsd: 0.01, ...fields,
});

test('physical calls reconcile once, retain retries and separate setup without adding token subsets', () => {
  const result = projectWorkflowUsage([
    call('one', { outcome: 'dispatching', usage: {}, usageStatus: 'unknown' }), call('one'),
    call('one', { outcome: 'dispatching', endedAt: '2026-10-15T12:02:00Z', usage: {}, usageStatus: 'unknown' }),
    call('retry', { parentCallId: 'one', purpose: 'operation_repair' }), call('setup', { purpose: 'capability_text' }),
    call('one', { endedAt: '2026-10-15T12:00:30Z', usage: { inputTokens: 999, outputTokens: 999 } }),
  ], 'week', now);
  assert.equal(result.total.calls, 3);
  assert.equal(result.total.input, 60); assert.equal(result.total.output, 30);
  assert.equal(result.total.usd, 0.03);
  assert.equal(result.generation.calls, 2); assert.equal(result.setupTests.calls, 1);
  assert.equal(result.total.incompleteTokens, 0);
});

test('missing counts and missing prices remain unavailable or explicitly partial known subtotals', () => {
  const missing = call('unknown', { usage: {}, usageStatus: 'unknown', estimatedChargeUsd: undefined, outcome: 'unknown' });
  const unknown = projectWorkflowUsage([missing], 'today', now).total;
  assert.equal(usageTokens(unknown), 'Unavailable'); assert.equal(usageCost(unknown), 'Unavailable');
  const mixed = projectWorkflowUsage([call('known'), missing], 'today', now).total;
  assert.equal(usageTokens(mixed), '30'); assert.equal(usageCost(mixed), '$0.01');
  assert.equal(mixed.incompleteTokens, 1); assert.equal(mixed.incompleteCost, 1);
  const estimated = projectWorkflowUsage([call('estimated', { usageStatus: 'estimated', chargeIncomplete: true })], 'today', now).total;
  assert.equal(usageTokens(estimated), 'Unavailable'); assert.equal(estimated.incompleteCost, 1);
  const inputOnly = projectWorkflowUsage([call('input-only', { usageStatus: 'incomplete', usage: { inputTokens: 20 } })], 'today', now).buckets[3];
  assert.equal(inputOnly.inputReports, 1); assert.equal(inputOnly.outputReports, 0); assert.equal(inputOnly.incompleteTokens, 1);
});

test('UTC date boundaries are consistent across participants and exclude outside or invalid timestamps', () => {
  const records = [call('start', { startedAt: '2026-10-09T00:00:00Z' }), call('old', { startedAt: '2026-10-08T23:59:59Z' }),
    call('today', { startedAt: '2026-10-16T04:59:59+05:00' }), call('tomorrow', { startedAt: '2026-10-16T00:00:00Z' }), call('invalid', { startedAt: 'bad' })];
  const week = projectWorkflowUsage(records, 'week', now);
  assert.equal(week.total.calls, 2); assert.equal(week.buckets.length, 7);
  assert.equal(week.buckets[0].calls, 1); assert.equal(week.buckets[6].calls, 1); assert.equal(week.invalidDates, 1);
  const today = projectWorkflowUsage(records, 'today', now);
  assert.equal(today.total.calls, 1); assert.equal(today.buckets[5].calls, 1);
});

test('empty periods, real zero pricing and tiny charges differ from unknown reports', () => {
  const empty = projectWorkflowUsage([], 'week', now).total;
  assert.equal(usageTokens(empty), '0'); assert.equal(usageCost(empty), '$0.00');
  const zero = projectWorkflowUsage([call('zero', { estimatedChargeUsd: 0, usage: { inputTokens: 0, outputTokens: 0 } })], 'week', now).total;
  assert.equal(usageTokens(zero), '0'); assert.equal(usageCost(zero), '$0.00'); assert.equal(zero.incompleteCost, 0);
  assert.equal(usageCost(projectWorkflowUsage([call('tiny', { estimatedChargeUsd: 0.0002 })], 'week', now).total), '$0.0002');
  assert.equal(usageCost(projectWorkflowUsage([call('smaller', { estimatedChargeUsd: 0.000002 })], 'week', now).total), '<$0.0001');
});
