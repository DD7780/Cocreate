import { randomUUID } from 'node:crypto';
import type { ProviderRequestRecord } from "../shared/types.js";
import { ProviderAccountingError } from './providers.js';

export type WorkflowBudget = {
  id: string; kind: 'workflow' | 'setup'; startedAt: string;
  maximumCalls: number; maximumUsd?: number; closed?: boolean; legacyAllowanceUnknown?: boolean;
  calls: number; reservedUsd: number; uncertainCalls: number;
  attempts: Record<string, ProviderRequestRecord>;
};

export function openBudget(kind: WorkflowBudget['kind'], maximumUsd?: number): WorkflowBudget {
  if (maximumUsd !== undefined && (!Number.isFinite(maximumUsd) || maximumUsd <= 0))
    throw new ProviderAccountingError('Invalid configured spending limit.');
  return { id: randomUUID(), kind, startedAt: new Date().toISOString(), maximumCalls: 24,
    maximumUsd, calls: 0, reservedUsd: 0, uncertainCalls: 0, attempts: {} };
}

export function remainingAllowanceUsd(budget:WorkflowBudget|undefined, futureMaximumUsd?:number) {
  if(!budget||budget.closed)return futureMaximumUsd??Number.POSITIVE_INFINITY;
  return budget.maximumUsd===undefined?Number.POSITIVE_INFINITY:budget.maximumUsd-budget.reservedUsd;
}

export function updateBudget(budget: WorkflowBudget, record: ProviderRequestRecord) {
  const previous = budget.attempts[record.callId];
  if(previous && ['workspaceId','purpose','provider','model','configurationVersion','startedAt','estimatedInputTokens','estimatedOutputTokens'].some(key=>
      previous[key as keyof ProviderRequestRecord]!==record[key as keyof ProviderRequestRecord]))
    throw new ProviderAccountingError('Provider attempt ID was reused with another reservation.');
  if (previous && (record.outcome === 'dispatching' ||
      (previous.endedAt || '') > (record.endedAt || '') ||
      (previous.usageStatus === 'measured' && record.usageStatus !== 'measured'))) return previous;
  if (!previous) {
    if(budget.legacyAllowanceUnknown)
      throw new ProviderAccountingError('Previous workflow allowance is unavailable. An explicit owner reset is required.');
    if (record.reservedChargeUsd !== undefined && (!Number.isFinite(record.reservedChargeUsd) || record.reservedChargeUsd < 0))
      throw new ProviderAccountingError('Invalid provider reservation.');
    if (record.outcome !== 'dispatching') throw new ProviderAccountingError('Unreserved provider result.');
    if (budget.closed || budget.calls >= budget.maximumCalls)
      throw new ProviderAccountingError('Workflow stopped at the 24 physical-call ceiling. The last working artifact is retained.');
    if (budget.maximumUsd !== undefined && (record.reservedChargeUsd === undefined ||
        budget.reservedUsd + record.reservedChargeUsd > budget.maximumUsd + 1e-9))
      throw new ProviderAccountingError('Workflow stopped at the configured spending limit. The last working artifact is retained.');
  }
  const entry = { ...record, budgetScopeId: budget.id, budgetScopeKind: budget.kind,
    reservedChargeUsd: previous?.reservedChargeUsd ?? record.reservedChargeUsd };
  budget.attempts[entry.callId] = entry;
  summarize(budget);
  return entry;
}

function summarize(budget:WorkflowBudget) {
  budget.calls = Object.keys(budget.attempts).length;
  budget.reservedUsd = 0; budget.uncertainCalls = 0;
  for (const attempt of Object.values(budget.attempts)) {
    const reported=attempt.providerCostUsd;
    const amount=reported !== undefined && Number.isFinite(reported) && reported>=0 ? reported :
      attempt.usageStatus==='measured'&&!attempt.chargeIncomplete ? attempt.estimatedChargeUsd : undefined;
    const measured = amount !== undefined && Number.isFinite(amount) && amount>=0 &&
      !['unknown', 'dispatching'].includes(attempt.outcome);
    budget.reservedUsd += measured ? amount! : attempt.reservedChargeUsd || 0;
    if (!measured) budget.uncertainCalls++;
  }
}

/** The full ledger repairs a snapshot that predates an acknowledged dispatch/result. */
export function restoreBudget(budget: WorkflowBudget | undefined, records: ProviderRequestRecord[]) {
  if (!budget) return undefined;
  if (budget.maximumCalls !== 24 || !budget.id || !budget.attempts ||
      !Number.isSafeInteger(budget.calls) || budget.calls < 0 ||
      !Number.isFinite(budget.reservedUsd) || budget.reservedUsd < 0)
    throw new ProviderAccountingError('The durable budget is invalid; opening it cannot reset the allowance.');
  for (const record of records) {
    if (record.budgetScopeId !== budget.id) continue;
    if (!budget.attempts[record.callId]) {
      budget.attempts[record.callId] = { ...record, outcome: 'dispatching', endedAt: undefined };
    }
    updateBudget(budget, record);
  }
  summarize(budget);
  return budget;
}

/** Older writers never saved executor allowances. Pending legacy work needs an explicit reset. */
export function recoverWorkflowBudget(meta: any, records: ProviderRequestRecord[]) {
  if (meta?.executionBudget) return restoreBudget(meta.executionBudget, records);
  const interrupted = meta?.status === 'Error' || meta?.submissions?.some((item:any) =>
    ['submitted','interpreting','queued'].includes(item.status));
  if (!interrupted) return undefined;
  const budget = openBudget('workflow', meta?.ai?.setup?.maximumSpendUsd);
  budget.legacyAllowanceUnknown=true;
  return budget;
}
