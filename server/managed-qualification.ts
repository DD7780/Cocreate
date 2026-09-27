export const MANAGED_QUALIFICATION_VERSION = '2026-09-27.v1';

export const managedFixtures = [
  {id:'restaurant-red-logo',role:'builder',brief:'Build one restaurant website with a red logo.',checks:['red logo visible','restaurant content','working navigation','responsive layout']},
  {id:'dashboard-state',role:'builder',brief:'Build a dashboard with forms, validation, and persistent state.',checks:['form validation','state updates','persistence','accessible feedback']},
  {id:'style-edit',role:'builder',brief:'Change only the existing product colors and typography.',checks:['requested visual change','existing behavior retained','targeted edits']},
  {id:'feature-preservation',role:'builder',brief:'Add a new filter to an existing application without changing previous behavior.',checks:['new filter works','previous behavior retained','no unrelated rewrites']},
  {id:'compiler-repair',role:'builder',brief:'Repair a compiler error in an otherwise working application.',checks:['compiles','working artifact preserved','minimal correction']},
  {id:'compatible-submissions',role:'interpreter',brief:'Two authenticated users submit compatible changes.',checks:['both intents attributed correctly','one shared accepted specification','no draft attribution']},
  {id:'contradictory-requirements',role:'interpreter',brief:'Two authenticated users request opposing consequential behavior.',checks:['conflict remains visible','no invented compromise','affected contributors identified']},
  {id:'negation-withdrawal',role:'interpreter',brief:'Classify negation, explicit withdrawal, and an informal spelling mistake.',checks:['negation respected','withdrawal attributed to author','spelling does not invent intent']},
  {id:'proposal-request',role:'interpreter',brief:'Distinguish a speculative proposal and a direct build request.',checks:['proposal remains proposed','request accepted','source passages preserved']},
] as const;

export type ManagedTrial = {
  modelId:string; fixtureId:string; trial:number; catalogVersion:string;
  physicalCalls:number; repairs:number; inputTokens:number; outputTokens:number;
  reasoningTokens:number; billedCostUsd:number; latencyMs:number;
  checks:Record<string,boolean>; visualScore?:number; visualReviewer?:string;
  attributionCorrect?:boolean; schemaValid:boolean; compilationPassed?:boolean;
  evidence:string;
};

export function scoreManagedTrials(trials:ManagedTrial[]) {
  const groups=new Map<string,ManagedTrial[]>();
  for(const trial of trials){
    const fixture=managedFixtures.find(item=>item.id===trial.fixtureId);
    if(!fixture||!trial.modelId||!Number.isInteger(trial.trial)||trial.trial<1)
      throw new Error('Trial has an invalid model, fixture, or repetition number.');
    if(!Number.isFinite(trial.billedCostUsd)||trial.billedCostUsd<0||!Number.isFinite(trial.latencyMs)||trial.latencyMs<0)
      throw new Error('Trial cost and latency must be measured non-negative values.');
    if(!trial.evidence.trim())throw new Error('Each trial needs a non-model evidence reference.');
    const key=`${trial.modelId}|${trial.fixtureId}`;
    groups.set(key,[...(groups.get(key)||[]),trial]);
  }
  return [...new Set(trials.map(item=>item.modelId))].map(modelId=>{
    const modelTrials=trials.filter(item=>item.modelId===modelId);
    const missing=managedFixtures.filter(fixture=>(groups.get(`${modelId}|${fixture.id}`)||[]).length<3).map(item=>item.id);
    const checked=modelTrials.flatMap(item=>Object.values(item.checks));
    const passed=modelTrials.filter(item=>item.schemaValid&&Object.values(item.checks).every(Boolean)).length;
    const visual=modelTrials.filter(item=>item.visualScore!==undefined&&item.visualReviewer);
    return {modelId,trialCount:modelTrials.length,missingFixtures:missing,
      checkPassRate:checked.length?checked.filter(Boolean).length/checked.length:null,
      schemaPassRate:modelTrials.length?modelTrials.filter(item=>item.schemaValid).length/modelTrials.length:null,
      acceptedArtifactRate:modelTrials.length?passed/modelTrials.length:null,
      costPerAcceptedArtifactUsd:passed?modelTrials.reduce((n,item)=>n+item.billedCostUsd,0)/passed:null,
      totalCostUsd:modelTrials.reduce((n,item)=>n+item.billedCostUsd,0),
      physicalCalls:modelTrials.reduce((n,item)=>n+item.physicalCalls,0),
      repairs:modelTrials.reduce((n,item)=>n+item.repairs,0),
      totalInputTokens:modelTrials.reduce((n,item)=>n+item.inputTokens,0),
      totalOutputTokens:modelTrials.reduce((n,item)=>n+item.outputTokens,0),
      totalReasoningTokens:modelTrials.reduce((n,item)=>n+item.reasoningTokens,0),
      medianLatencyMs:modelTrials.length?[...modelTrials].map(item=>item.latencyMs).sort((a,b)=>a-b)[Math.floor(modelTrials.length/2)]:null,
      humanVisualMean:visual.length?visual.reduce((n,item)=>n+item.visualScore!,0)/visual.length:null,
      qualificationReady:missing.length===0&&visual.length>=3&&modelTrials.every(item=>item.evidence.trim().length>0),
    };
  });
}
