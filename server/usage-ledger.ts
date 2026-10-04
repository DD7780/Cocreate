import type{AIUsage,ProviderRequestRecord}from'../src/types.js';

const setupPurposes=new Set(['model_discovery','connection_test','capability_text','capability_personal','capability_builder']);
const empty=():AIUsage=>({requests:0,personalRequests:0,builderRequests:0,inputTokens:0,outputTokens:0,estimatedCostUsd:0,uncertainCostUsd:0});
export type PhysicalUsage={recorded:AIUsage;generation:AIUsage;setup:AIUsage;unknownUsageRequests:number;recordedFrom?:string;coverage:'partial'};

/** A physical call has one callId and may have a dispatch followed by a reconciliation. */
export function aggregatePhysicalUsage(records:ProviderRequestRecord[]):PhysicalUsage{
  const byCall=new Map<string,ProviderRequestRecord>();
  for(const record of records){if(!record.callId)continue;const previous=byCall.get(record.callId);if(!previous||(record.outcome!=='dispatching'&&(previous.outcome==='dispatching'||(record.endedAt||'')>=(previous.endedAt||'')))||previous.outcome==='dispatching')byCall.set(record.callId,record)}
  const recorded=empty(),generation=empty(),setup=empty();let unknownUsageRequests=0,recordedFrom:string|undefined;
  for(const call of byCall.values()){
    const bucket=setupPurposes.has(call.purpose)?setup:generation;
    for(const target of [recorded,bucket]){
      target.requests++;
      target.inputTokens+=call.usage?.inputTokens||0;
      target.outputTokens+=call.usage?.outputTokens||0;
      target.cachedInputTokens=(target.cachedInputTokens||0)+(call.usage?.cachedInputTokens||0);
      target.cacheWriteTokens=(target.cacheWriteTokens||0)+(call.usage?.cacheWriteTokens||0);
      target.reasoningTokens=(target.reasoningTokens||0)+(call.usage?.reasoningTokens||0);
      target.estimatedCostUsd=(target.estimatedCostUsd||0)+(call.estimatedChargeUsd||0);
      if(call.chargeIncomplete||call.outcome==='dispatching'||call.outcome==='unknown'||call.usageStatus!=='measured')target.uncertainCostUsd=(target.uncertainCostUsd||0)+(call.reservedChargeUsd??call.estimatedChargeUsd??0);
    }
    if(call.usage?.inputTokens===undefined||call.usage?.outputTokens===undefined||call.usageStatus!=='measured'||call.outcome==='dispatching'||call.outcome==='unknown')unknownUsageRequests++;
    if(!recordedFrom||call.startedAt<recordedFrom)recordedFrom=call.startedAt;
  }
  return{recorded,generation,setup,unknownUsageRequests,recordedFrom,coverage:'partial'};
}
