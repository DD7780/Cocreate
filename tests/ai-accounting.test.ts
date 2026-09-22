import test from'node:test';
import assert from'node:assert/strict';
import{aggregateCalls,calculateCharge,effectiveness,maximumAllowanceCharge,VERIFICATION_POLICY_VERSION}from'../server/ai-accounting.js';
import{resolveRecommendation}from'../server/ai-presets.js';
import type{AIRate,AIRunCall,AIRunRecord}from'../src/types.js';

// Synthetic test data only. These values do not describe a live provider invoice.
const rate=(version='test-pricing-v1',overrides:Partial<AIRate>={}):AIRate=>({currency:'USD',inputPerMillion:2,cachedInputPerMillion:.2,cacheWrite5mPerMillion:2.5,outputPerMillion:10,reasoningBilling:'included_in_output',reasoningNote:'Synthetic reasoning tokens are already included in output.',sourceUrl:`https://example.test/${version}`,verifiedAt:'2099-01-01',...overrides});
const call=(phase:AIRunCall['phase'],overrides:Partial<AIRunCall>={}):AIRunCall=>({phase,provider:'openai',model:'synthetic-model',pricingVersion:'test-pricing-v1',rate:rate(),usage:{inputTokens:1_000,cachedInputTokens:0,outputTokens:500,reasoningIncludedInOutput:true},estimatedChargeUsd:.007,chargeIncomplete:false,uncertain:false,outcome:'succeeded',...overrides});

test('calculates uncached, cached, and cache-write charges without assuming cache hits',()=>{
  const uncached=calculateCharge({inputTokens:1_000_000,cachedInputTokens:0,outputTokens:100_000},rate());
  const cached=calculateCharge({inputTokens:1_000_000,cachedInputTokens:600_000,cacheWriteTokens:100_000,outputTokens:100_000},rate());
  assert.equal(uncached.estimatedChargeUsd,3);
  assert.equal(cached.estimatedChargeUsd,1.97);
  assert.equal(maximumAllowanceCharge(1_000_000,100_000,rate()),3,'maximum estimates conservatively use uncached input');
});

test('reasoning usage is informational and never billed twice',()=>{
  const withoutDetail=calculateCharge({inputTokens:10_000,outputTokens:5_000},rate());
  const withIncludedReasoning=calculateCharge({inputTokens:10_000,outputTokens:5_000,reasoningTokens:4_000,reasoningIncludedInOutput:true},rate());
  assert.equal(withIncludedReasoning.estimatedChargeUsd,withoutDetail.estimatedChargeUsd);
});

test('aggregates multiple interpreters and one shared builder exactly once',()=>{
  const calls=[call('interpretation',{participantId:'p1'}),call('interpretation',{participantId:'p2'}),call('builder',{estimatedChargeUsd:.02})];
  const aggregate=aggregateCalls(calls);
  assert.equal(calls.filter(item=>item.phase==='builder').length,1);
  assert.equal(aggregate.inputTokens,3_000);
  assert.equal(aggregate.estimatedChargeUsd,.034);
});

test('repairs and failures remain in totals while missing usage remains unknown',()=>{
  const known=[call('builder',{estimatedChargeUsd:.02}),call('repair',{estimatedChargeUsd:.03,outcome:'failed'})];
  assert.equal(aggregateCalls(known).estimatedChargeUsd,.05);
  const unknown=aggregateCalls([...known,call('repair',{usage:{},estimatedChargeUsd:undefined,chargeIncomplete:true,uncertain:true,outcome:'unknown'})]);
  assert.equal(unknown.estimatedChargeUsd,undefined);
  assert.equal(unknown.chargeIncomplete,true);
});

test('applies long-context tiers and preserves pricing-version changes per call',()=>{
  const tiered=rate('v1',{tiers:[{aboveInputTokens:100_000,inputMultiplier:2,outputMultiplier:1.5,label:'synthetic long context'}]});
  assert.equal(calculateCharge({inputTokens:200_000,outputTokens:100_000},tiered).estimatedChargeUsd,2.3);
  const oldCall=call('interpretation',{pricingVersion:'v1',rate:rate('v1'),estimatedChargeUsd:.01}),newCall=call('builder',{pricingVersion:'v2',rate:rate('v2',{outputPerMillion:20}),estimatedChargeUsd:.02});
  assert.deepEqual([oldCall.pricingVersion,newCall.pricingVersion],['v1','v2']);
  assert.equal(aggregateCalls([oldCall,newCall]).estimatedChargeUsd,.03);
});

test('estimates stay distinct from the user spending limit',()=>{
  const passed={reachable:{status:'passed' as const},text:{status:'passed' as const},personal:{status:'passed' as const},builder:{status:'passed' as const}};
  const recommendation=resolveRecommendation([{id:'test',name:'Synthetic',provider:'openrouter',models:[{id:'openai/gpt-5.6-luna'}],checks:{'openai/gpt-5.6-luna':passed}}],'developer','medium');
  assert.equal(recommendation.available,true);
  assert.equal(recommendation.estimateComplete,false);
  assert.match(recommendation.estimateScope,/one submitted participant interpretation/i);
  assert.ok(recommendation.defaultMaximumSpendUsd>=recommendation.maximumEstimateUsd!);
  assert.notEqual(recommendation.onePassEstimateUsd,recommendation.defaultMaximumSpendUsd);
});

const record=(id:string,verified:boolean,cost:number|undefined,latencyMs:number,calls:AIRunCall[]=[call('builder')]):AIRunRecord=>({runId:id,catalogVersion:'test-catalog',pricingVersion:'test-pricing-v1',routingRuleVersion:'test-routing',verificationPolicyVersion:VERIFICATION_POLICY_VERSION,workflowMode:'developer',effort:'medium',complexity:'standard',evidenceStatus:'hypothesis',routingReason:'Synthetic fixture',personalModels:['synthetic-interpreter'],builderModel:'synthetic-builder',calls,usage:{...aggregateCalls(calls),estimatedChargeUsd:cost},latencyMs,outcome:verified?'promoted':'failed',verification:{operationsApplied:verified,compilationPassed:verified,requirementSatisfaction:verified?'passed':'failed',regressionCheck:verified?'passed':'failed',verified}});

test('effectiveness requires comparable samples and includes failed repairs in cost',()=>{
  assert.equal(effectiveness([record('one',true,.10,1000)])[0].verificationPassRate,undefined);
  const records=[record('one',true,.10,1000),record('two',false,.20,3000,[call('builder'),call('repair',{estimatedChargeUsd:.10,outcome:'failed'})]),record('three',true,.30,2000)];
  const metric=effectiveness(records)[0];
  assert.equal(metric.sampleSize,3);
  assert.equal(metric.verificationPassRate,2/3);
  assert.equal(metric.medianLatencyMs,2000);
  assert.ok(Math.abs(metric.totalEstimatedCostUsd-.6)<1e-12);
  assert.ok(Math.abs(metric.costPerSuccessfulVerifiedBuildUsd!-.3)<1e-12);
  const noSuccess=effectiveness(records.map((item,index)=>record(`failed-${index}`,false,item.usage.estimatedChargeUsd,item.latencyMs)))[0];
  assert.equal(noSuccess.costPerSuccessfulVerifiedBuildUsd,undefined,'no verified success is not reported as $0');
});
