import type {AISpecialty} from '../src/types.js';

export const EVALUATION_PROTOCOL_VERSION='2026-09-20.v1';
export const representativeTasks:Record<AISpecialty,Array<{id:string;brief:string;checks:string[]}>>={
  general:[{id:'general-crud',brief:'Build a responsive personal inventory app with create, edit, search, persistence, and empty/error states.',checks:['requirements','browser behavior','persistence','accessibility']}],
  engineer:[{id:'engineer-rules',brief:'Build a rules-driven quote calculator with validation, deterministic calculations, tests, and recovery from invalid input.',checks:['requirements','logic tests','edge cases','regressions']}],
  designer:[{id:'designer-system',brief:'Build an editorial portfolio with a coherent type scale, responsive layout, accessible contrast, and keyboard navigation.',checks:['requirements','visual rubric','responsive states','accessibility']}],
  web_developer:[{id:'web-navigation',brief:'Build a multi-view service site with routing, forms, validation, loading states, and responsive navigation.',checks:['requirements','browser flows','forms','responsive states']}],
  motion_designer:[{id:'motion-story',brief:'Build an interactive product story with purposeful transitions, stable performance, and reduced-motion behavior.',checks:['requirements','motion rubric','performance','reduced motion']}],
};

export type EvaluationTrial={specialty:AISpecialty;taskId:string;model:string;trial:number;requirementsSatisfied:number;requirementsTotal:number;verificationPassed:boolean;regressions:number;latencyMs:number;interpretationCostUsd:number;generationCostUsd:number;repairCostUsd:number};
export type EvaluationSummary={trials:number;requirementSatisfaction:number;verificationPassRate:number;regressionRate:number;medianLatencyMs:number;totalCostUsd:number;costPerVerifiedBuildUsd:number|null};

export function summarizeTrials(trials:EvaluationTrial[]):EvaluationSummary{
  const sorted=trials.map(item=>item.latencyMs).sort((a,b)=>a-b),verified=trials.filter(item=>item.verificationPassed).length,totalRequirements=trials.reduce((n,item)=>n+item.requirementsTotal,0),totalCost=trials.reduce((n,item)=>n+item.interpretationCostUsd+item.generationCostUsd+item.repairCostUsd,0);
  return{trials:trials.length,requirementSatisfaction:totalRequirements?trials.reduce((n,item)=>n+item.requirementsSatisfied,0)/totalRequirements:0,verificationPassRate:trials.length?verified/trials.length:0,regressionRate:trials.length?trials.reduce((n,item)=>n+item.regressions,0)/trials.length:0,medianLatencyMs:sorted.length?sorted[Math.floor(sorted.length/2)]:0,totalCostUsd:totalCost,costPerVerifiedBuildUsd:verified?totalCost/verified:null};
}

/** A specialty mapping is measured only after repeated, task-complete trials. */
export function qualifiesSpecialtyMapping(trials:EvaluationTrial[],specialty:AISpecialty){
  const tasks=representativeTasks[specialty],summary=summarizeTrials(trials),covered=tasks.every(task=>trials.filter(item=>item.specialty===specialty&&item.taskId===task.id).length>=3);
  return{qualified:covered&&summary.requirementSatisfaction>=.85&&summary.verificationPassRate>=.8&&summary.regressionRate<=.1,summary,reason:covered?'Quality thresholds evaluated.':'At least three trials for every representative task are required.'};
}
