import { openBudget, updateBudget } from '../../server/workflow-budget.js';
export function usedBudget(calls:number, maximumUsd?:number) {
  const budget=openBudget('workflow');budget.maximumUsd=maximumUsd;
  for(let i=0;i<calls;i++)updateBudget(budget,{callId:`historical-${i}`,workspaceId:'room',purpose:'builder',provider:'custom',configurationVersion:'fixture',startedAt:budget.startedAt,outcome:'dispatching',estimatedInputTokens:0,usage:{},usageStatus:'unknown',reservedChargeUsd:0});
  return budget;
}
