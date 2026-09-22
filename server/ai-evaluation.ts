import type {AIWorkflowMode} from '../src/types.js';

export const EVALUATION_PROTOCOL_VERSION='2026-09-20.v1';
export const representativeTasks:Record<AIWorkflowMode,Array<{id:string;brief:string;checks:string[]}>>={
  developer:[{id:'developer-app',brief:'Build a responsive interactive app with deterministic logic, persistence, accessible states, and browser verification.',checks:['requirements','browser behavior','logic','persistence','accessibility','regressions']}],
  analyst:[],
  researcher:[],
};

export type EvaluationTrial={workflowMode:AIWorkflowMode;taskId:string;model:string;trial:number;requirementsSatisfied:number;requirementsTotal:number;verificationPassed:boolean;regressions:number;latencyMs:number;interpretationCostUsd:number;generationCostUsd:number;repairCostUsd:number};
export type EvaluationSummary={trials:number;requirementSatisfaction:number;verificationPassRate:number;regressionRate:number;medianLatencyMs:number;totalCostUsd:number;costPerVerifiedBuildUsd:number|null};

export function summarizeTrials(trials:EvaluationTrial[]):EvaluationSummary{
  const sorted=trials.map(item=>item.latencyMs).sort((a,b)=>a-b),verified=trials.filter(item=>item.verificationPassed).length,totalRequirements=trials.reduce((n,item)=>n+item.requirementsTotal,0),totalCost=trials.reduce((n,item)=>n+item.interpretationCostUsd+item.generationCostUsd+item.repairCostUsd,0);
  return{trials:trials.length,requirementSatisfaction:totalRequirements?trials.reduce((n,item)=>n+item.requirementsSatisfied,0)/totalRequirements:0,verificationPassRate:trials.length?verified/trials.length:0,regressionRate:trials.length?trials.reduce((n,item)=>n+item.regressions,0)/trials.length:0,medianLatencyMs:sorted.length?sorted[Math.floor(sorted.length/2)]:0,totalCostUsd:totalCost,costPerVerifiedBuildUsd:verified?totalCost/verified:null};
}

/** A mode mapping is measured only after its real tools exist and repeated task-complete trials pass. */
export function qualifiesModeMapping(trials:EvaluationTrial[],workflowMode:AIWorkflowMode){
  const tasks=representativeTasks[workflowMode],summary=summarizeTrials(trials);
  if(!tasks.length)return{qualified:false,summary,reason:`${workflowMode[0].toUpperCase()+workflowMode.slice(1)} has no implemented tool-backed evaluation workflow.`};
  const covered=tasks.every(task=>trials.filter(item=>item.workflowMode===workflowMode&&item.taskId===task.id).length>=3);
  return{qualified:covered&&summary.requirementSatisfaction>=.85&&summary.verificationPassRate>=.8&&summary.regressionRate<=.1,summary,reason:covered?'Quality thresholds evaluated.':'At least three trials for every representative task are required.'};
}
