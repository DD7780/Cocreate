import type{AIRate,AIRunCall,AIRunRecord,AIEffort,AIWorkflowMode,LegacyAISpecialty,NormalizedAIUsage,TaskComplexity}from'../src/types.js';

export const VERIFICATION_POLICY_VERSION='compile-only.v1';
const million=1_000_000;

export function calculateCharge(usage:NormalizedAIUsage,rate:AIRate){
  const missing:string[]=[];
  if(usage.inputTokens===undefined)missing.push('input usage');
  if(usage.outputTokens===undefined)missing.push('output usage');
  if(usage.cachedInputTokens!==undefined&&rate.cachedInputPerMillion===undefined)missing.push('cached-input rate');
  if(usage.cacheWriteTokens!==undefined&&rate.cacheWrite5mPerMillion===undefined)missing.push('cache-write rate');
  if(missing.length)return{estimatedChargeUsd:undefined,incomplete:true,missing};
  const totalInput=usage.inputTokens!,cached=Math.min(totalInput,usage.cachedInputTokens||0),writes=Math.min(totalInput-cached,usage.cacheWriteTokens||0),uncached=Math.max(0,totalInput-cached-writes),tier=[...(rate.tiers||[])].sort((a,b)=>b.aboveInputTokens-a.aboveInputTokens).find(item=>totalInput>item.aboveInputTokens),inputMultiplier=tier?.inputMultiplier||1,outputMultiplier=tier?.outputMultiplier||1;
  // reasoningTokens is informational when already included in outputTokens; never add it twice.
  const estimatedChargeUsd=(uncached*rate.inputPerMillion*inputMultiplier+cached*(rate.cachedInputPerMillion||0)*inputMultiplier+writes*(rate.cacheWrite5mPerMillion||0)*inputMultiplier+usage.outputTokens!*rate.outputPerMillion*outputMultiplier)/million*(rate.platformMultiplier||1);
  return{estimatedChargeUsd,incomplete:false,missing:[],tier:tier?.label};
}

export function maximumAllowanceCharge(inputTokens:number,outputTokens:number,rate:AIRate){
  return calculateCharge({inputTokens,outputTokens,cachedInputTokens:0,reasoningIncludedInOutput:true},rate).estimatedChargeUsd!;
}

export function aggregateCalls(calls:AIRunCall[]){
  const known=(key:keyof NormalizedAIUsage)=>calls.some(call=>call.usage[key]!==undefined),sum=(key:keyof NormalizedAIUsage)=>calls.reduce((n,call)=>n+(typeof call.usage[key]==='number'?call.usage[key] as number:0),0);
  return{inputTokens:known('inputTokens')?sum('inputTokens'):undefined,cachedInputTokens:known('cachedInputTokens')?sum('cachedInputTokens'):undefined,cacheWriteTokens:known('cacheWriteTokens')?sum('cacheWriteTokens'):undefined,outputTokens:known('outputTokens')?sum('outputTokens'):undefined,reasoningTokens:known('reasoningTokens')?sum('reasoningTokens'):undefined,reasoningIncludedInOutput:true,estimatedChargeUsd:calls.every(call=>call.estimatedChargeUsd!==undefined)?calls.reduce((n,call)=>n+call.estimatedChargeUsd!,0):undefined,uncertainChargeUsd:calls.filter(call=>call.uncertain).reduce((n,call)=>n+(call.estimatedChargeUsd||0),0)||undefined,chargeIncomplete:calls.some(call=>call.chargeIncomplete||call.uncertain)};
}

export type EffectivenessGroup={configuration:string;workflowMode?:AIWorkflowMode;specialty?:LegacyAISpecialty;effort?:AIEffort;complexity:TaskComplexity;verificationPolicyVersion:string;sampleSize:number;verificationPassRate?:number;medianLatencyMs?:number;totalEstimatedCostUsd:number;costPerSuccessfulVerifiedBuildUsd?:number};
export function effectiveness(records:AIRunRecord[],minimumSamples=3):EffectivenessGroup[]{
  const groups=new Map<string,AIRunRecord[]>();for(const record of records){const configuration=[[...record.personalModels].sort().join(','),record.builderModel,record.workflowMode||record.specialty,record.effort,record.complexity,record.verificationPolicyVersion].join('|');groups.set(configuration,[...(groups.get(configuration)||[]),record])}
  return[...groups.entries()].map(([configuration,items])=>{const verified=items.filter(item=>item.verification.verified).length,costs=items.map(item=>item.usage.estimatedChargeUsd),complete=costs.every(value=>value!==undefined),latencies=items.map(item=>item.latencyMs).sort((a,b)=>a-b),enough=items.length>=minimumSamples;return{configuration,workflowMode:items[0].workflowMode,specialty:items[0].specialty,effort:items[0].effort,complexity:items[0].complexity,verificationPolicyVersion:items[0].verificationPolicyVersion,sampleSize:items.length,verificationPassRate:enough?verified/items.length:undefined,medianLatencyMs:enough?latencies[Math.floor(latencies.length/2)]:undefined,totalEstimatedCostUsd:complete?costs.reduce((n,value)=>n+value!,0):NaN,costPerSuccessfulVerifiedBuildUsd:enough&&verified&&complete?costs.reduce((n,value)=>n+value!,0)/verified:undefined}});
}
