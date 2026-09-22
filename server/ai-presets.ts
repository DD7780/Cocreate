import type {
  AIEffort,
  AIProvider,
  AIRecommendation,
  AIRate,
  AIWorkflowMode,
  LegacyAISpecialty,
  ModelChecks,
  SharedRequirement,
  TaskComplexity,
} from '../src/types.js';
import{maximumAllowanceCharge}from'./ai-accounting.js';

export const PRESET_VERSION = '2026-09-22.v3';
export const PRICING_VERSION = '2026-09-20';
export const ROUTING_RULE_VERSION = '2026-09-22.v3';

export const workflowModes: Record<AIWorkflowMode, {label: string; benefit: string; instruction: string; available:boolean; unavailableReason?:string}> = {
  developer: {label: 'Developer', benefit: 'Build and verify the shared interactive product.', instruction: 'Implement the accepted requirements as a reliable, accessible application and preserve unaffected working behavior.', available:true},
  analyst: {label: 'Analyst', benefit: 'Analyze validated datasets with reproducible computation.', instruction: '', available:false, unavailableReason:'Unavailable: validated data ingestion and isolated reproducible computation are not implemented.'},
  researcher: {label: 'Researcher', benefit: 'Research with controlled retrieval and cited evidence.', instruction: '', available:false, unavailableReason:'Unavailable: controlled retrieval, source capture, and citation verification are not implemented.'},
};

export const migrateLegacySpecialty=(_specialty?:LegacyAISpecialty):AIWorkflowMode=>'developer';

export const effortLevels: Record<AIEffort, {
  label: string;
  benefit: string;
  personalInput: number;
  personalOutput: number;
  builderInput: number;
  builderOutput: number;
  repairAttempts: number;
  reasoning: string;
}> = {
  light: {label: 'Light', benefit: 'Fast drafts and small changes.', personalInput: 8_000, personalOutput: 1_600, builderInput: 24_000, builderOutput: 8_000, repairAttempts: 1, reasoning: 'low'},
  medium: {label: 'Medium · Recommended', benefit: 'Balanced quality, checks, and cost.', personalInput: 12_000, personalOutput: 2_400, builderInput: 40_000, builderOutput: 12_000, repairAttempts: 2, reasoning: 'medium'},
  high: {label: 'High', benefit: 'More room for difficult implementation work.', personalInput: 16_000, personalOutput: 3_200, builderInput: 56_000, builderOutput: 20_000, repairAttempts: 3, reasoning: 'high'},
  extra: {label: 'Extra', benefit: 'Largest bounded context and verification allowance.', personalInput: 20_000, personalOutput: 4_000, builderInput: 72_000, builderOutput: 32_000, repairAttempts: 3, reasoning: 'high'},
};

type CatalogEntry = {
  provider: Exclude<AIProvider, 'custom'|'ollama'>;
  model: string;
  adapter: string;
  roles: Array<'personal'|'builder'>;
  efforts: AIEffort[];
  contextTokens: number;
  outputTokens: number;
  reasoning: string[];
  rate: AIRate;
  evidence: string;
  limitation: string;
};

const rate=(inputPerMillion:number,outputPerMillion:number,sourceUrl:string,options:Partial<AIRate>={}):AIRate=>({currency:'USD',inputPerMillion,outputPerMillion,reasoningBilling:'included_in_output',reasoningNote:'Reasoning tokens are billed at the output rate and are already included in billed output usage; CoCreate never adds them twice.',sourceUrl,verifiedAt:PRICING_VERSION,...options});
const longContext=[{aboveInputTokens:272_000,inputMultiplier:2,outputMultiplier:1.5,label:'OpenAI >272K input tier'}];
const openRouter=(options:Partial<AIRate>={}):Partial<AIRate>=>({platformMultiplier:1.055,additionalCharges:['OpenRouter Standard currently adds a 5.5% platform fee; actual routed endpoint, service tier, BYOK terms, and tool charges can differ.'],...options});

/** Canonical model and pricing data. UI and resolver consume this list; do not duplicate it. */
export const modelCatalog: CatalogEntry[] = [
  {provider:'openai',model:'gpt-5.6-luna',adapter:'responses',roles:['personal','builder'],efforts:['light','medium','high','extra'],contextTokens:1_050_000,outputTokens:128_000,reasoning:['none','low','medium','high','xhigh','max'],rate:rate(.20,1.20,'https://developers.openai.com/api/docs/models/gpt-5.6-luna',{cachedInputPerMillion:.02,cacheWrite5mPerMillion:.25,tiers:longContext}),evidence:'Published capabilities and CoCreate schema checks only.',limitation:'No authorized repeated live benchmark has been run; Developer quality is an untested hypothesis.'},
  {provider:'openai',model:'gpt-5.6-terra',adapter:'responses',roles:['builder'],efforts:['medium','high','extra'],contextTokens:1_050_000,outputTokens:128_000,reasoning:['none','low','medium','high','xhigh','max'],rate:rate(2,12,'https://developers.openai.com/api/docs/models/gpt-5.6-terra',{cachedInputPerMillion:.20,cacheWrite5mPerMillion:2.50,tiers:longContext}),evidence:'Published capabilities and CoCreate schema checks only.',limitation:'No paid cross-model benchmark has been run; recommendation is provisional.'},
  {provider:'anthropic',model:'claude-haiku-4-5-20251001',adapter:'messages',roles:['personal'],efforts:['light','medium','high','extra'],contextTokens:200_000,outputTokens:64_000,reasoning:['extended'],rate:rate(1,5,'https://platform.claude.com/docs/en/about-claude/pricing',{cachedInputPerMillion:.10,cacheWrite5mPerMillion:1.25,cacheWrite1hPerMillion:2}),evidence:'Published capabilities and CoCreate schema checks only.',limitation:'No paid cross-model benchmark has been run; recommendation is provisional.'},
  {provider:'anthropic',model:'claude-sonnet-5',adapter:'messages',roles:['builder'],efforts:['light','medium','high','extra'],contextTokens:1_000_000,outputTokens:128_000,reasoning:['adaptive'],rate:rate(2,10,'https://platform.claude.com/docs/en/about-claude/pricing',{cachedInputPerMillion:.20,cacheWrite5mPerMillion:2.50,cacheWrite1hPerMillion:4}),evidence:'Published capabilities and CoCreate schema checks only.',limitation:'No paid cross-model benchmark has been run; recommendation is provisional.'},
  {provider:'gemini',model:'gemini-2.5-flash',adapter:'generateContent',roles:['personal','builder'],efforts:['light','medium','high','extra'],contextTokens:1_000_000,outputTokens:65_536,reasoning:['thinking'],rate:rate(.30,2.50,'https://ai.google.dev/gemini-api/docs/pricing',{cachedInputPerMillion:.03,additionalCharges:['Explicit context-cache storage is $1.00 per million tokens per hour and is not used by CoCreate.']}),evidence:'Published capabilities and CoCreate schema checks only.',limitation:'The same economical model is used at all effort levels; no paid comparative benchmark has been run.'},
  {provider:'deepseek',model:'deepseek-flash',adapter:'chat-completions',roles:['personal','builder'],efforts:['light','medium','high','extra'],contextTokens:1_000_000,outputTokens:384_000,reasoning:['thinking'],rate:rate(.30,1.20,'https://api-docs.deepseek.com/quick_start/pricing/',{cachedInputPerMillion:.006,additionalCharges:['Conservative estimates use peak rates; official off-peak rates are lower and time-dependent.']}),evidence:'Published capabilities and CoCreate schema checks only.',limitation:'Rates use peak pricing because DeepSeek pricing varies by time; no paid comparative benchmark has been run.'},
  {provider:'deepseek',model:'deepseek-v4-pro',adapter:'chat-completions',roles:['builder'],efforts:['high','extra'],contextTokens:1_000_000,outputTokens:384_000,reasoning:['thinking'],rate:rate(1.32,3.96,'https://api-docs.deepseek.com/quick_start/pricing/',{cachedInputPerMillion:.044,additionalCharges:['Conservative estimates use peak rates; official off-peak rates are lower and time-dependent.']}),evidence:'Published capabilities and CoCreate schema checks only.',limitation:'Rates use peak pricing because DeepSeek pricing varies by time; no paid comparative benchmark has been run.'},
  {provider:'openrouter',model:'openai/gpt-5.6-luna',adapter:'chat-completions',roles:['personal','builder'],efforts:['light','medium','high','extra'],contextTokens:1_050_000,outputTokens:128_000,reasoning:['none','low','medium','high'],rate:rate(.20,1.20,'https://openrouter.ai/openai/gpt-5.6-luna',openRouter({cachedInputPerMillion:.02,cacheWrite5mPerMillion:.25,tiers:longContext})),evidence:'Published capabilities and CoCreate schema checks only.',limitation:'Routed endpoint and account terms can change the final invoice.'},
  {provider:'openrouter',model:'openai/gpt-5.6-terra',adapter:'chat-completions',roles:['builder'],efforts:['medium','high','extra'],contextTokens:1_050_000,outputTokens:128_000,reasoning:['none','low','medium','high'],rate:rate(2,12,'https://openrouter.ai/docs/api/api-reference/models/get-models',openRouter({cachedInputPerMillion:.20,cacheWrite5mPerMillion:2.50,tiers:longContext})),evidence:'Published capabilities and CoCreate schema checks only.',limitation:'Routed endpoint and account terms can change the final invoice.'},
  {provider:'openrouter',model:'anthropic/claude-haiku-4.5',adapter:'chat-completions',roles:['personal'],efforts:['light','medium','high','extra'],contextTokens:200_000,outputTokens:64_000,reasoning:['extended'],rate:rate(1,5,'https://openrouter.ai/docs/api/api-reference/models/get-models',openRouter({cachedInputPerMillion:.10,cacheWrite5mPerMillion:1.25,cacheWrite1hPerMillion:2})),evidence:'Published capabilities and CoCreate schema checks only.',limitation:'Routed endpoint and account terms can change the final invoice.'},
  {provider:'openrouter',model:'anthropic/claude-sonnet-5',adapter:'chat-completions',roles:['builder'],efforts:['light','medium','high','extra'],contextTokens:1_000_000,outputTokens:128_000,reasoning:['adaptive'],rate:rate(2,10,'https://openrouter.ai/docs/api/api-reference/models/get-models',openRouter({cachedInputPerMillion:.20,cacheWrite5mPerMillion:2.50,cacheWrite1hPerMillion:4})),evidence:'Published capabilities and CoCreate schema checks only.',limitation:'Routed endpoint and account terms can change the final invoice.'},
];
export function catalogRate(provider:AIProvider,model:string){return modelCatalog.find(item=>item.provider===provider&&item.model===model)?.rate}

type ResolvableConnection = {id:string;name:string;provider:AIProvider;models:Array<{id:string}>;checks:Record<string,ModelChecks>};

const passed = (checks: ModelChecks|undefined, role: 'personal'|'builder') =>
  checks?.reachable.status === 'passed' && checks.text.status === 'passed' && checks[role].status === 'passed';

const cost=(input:number,output:number,model:CatalogEntry)=>maximumAllowanceCharge(input,output,model.rate);

function preferred(entries: CatalogEntry[], role: 'personal'|'builder', effort: AIEffort) {
  const eligible = entries.filter(item => item.roles.includes(role) && item.efforts.includes(effort));
  return [...eligible].sort((a,b)=>cost(100_000,20_000,a)-cost(100_000,20_000,b))[0];
}

const layer=(connection:ResolvableConnection,item:CatalogEntry,input:number,output:number)=>({connectionId:connection.id,connectionName:connection.name,provider:connection.provider,model:item.model,rate:item.rate,maxInputTokens:input,maxOutputTokens:output,reasoning:item.reasoning});
const roundCap=(value:number)=>Math.max(.01,Math.ceil(value*1.15*100)/100);

export function resolveRecommendation(connections: ResolvableConnection[], workflowMode: AIWorkflowMode, effort: AIEffort): AIRecommendation {
  const limits = effortLevels[effort];
  const mode=workflowModes[workflowMode];
  const missing: string[] = [];
  if(!mode.available){
    const reason=mode.unavailableReason||`${mode.label} is unavailable.`;
    return {available:false,workflowMode,modeAvailable:false,unavailableReason:reason,effort,presetVersion:PRESET_VERSION,pricingVersion:PRICING_VERSION,routingRuleVersion:ROUTING_RULE_VERSION,status:'hypothesis',routingReason:reason,estimateComplete:false,estimateScope:'Unavailable until the required workflow tools and verification are implemented.',defaultMaximumSpendUsd:.01,repairAttempts:limits.repairAttempts,assumptions:[],missing:[reason]};
  }
  // The first connection is the owner's active/default choice. Never hop providers implicitly.
  for(const connection of connections.slice(0,1)) {
    const providerEntries = modelCatalog.filter(item => item.provider === connection.provider);
    const knownEntries = providerEntries.filter(item => connection.models.some(model => model.id === item.model) || !!connection.checks[item.model]);
    const personal = preferred(knownEntries, 'personal', effort);
    const builder = preferred(knownEntries, 'builder', effort),builderEntries=knownEntries.filter(item=>item.roles.includes('builder')&&item.efforts.includes(effort)).sort((a,b)=>cost(limits.builderInput,limits.builderOutput,a)-cost(limits.builderInput,limits.builderOutput,b));
    if(!personal || !builder) continue;
    if(!passed(connection.checks[personal.model], 'personal') || !passed(connection.checks[builder.model], 'builder')) {
      missing.push(`${connection.name}: run the required capability checks for ${personal.model}${personal.model===builder.model?'':` and ${builder.model}`}.`);
      continue;
    }
    const personalCost = cost(limits.personalInput, limits.personalOutput, personal);
    const builderCost = cost(limits.builderInput, limits.builderOutput, builder),maximum=personalCost+builderCost*limits.repairAttempts*2;
    return {
      available: true,
      workflowMode,
      modeAvailable:true,
      effort,
      presetVersion: PRESET_VERSION,
      pricingVersion: PRICING_VERSION,
      routingRuleVersion:ROUTING_RULE_VERSION,status:'hypothesis',routingReason:'Developer uses the economical capability-validated baseline; no authorized repeated comparative benchmark exists.',
      personal:layer(connection,personal,limits.personalInput,limits.personalOutput),builder:layer(connection,builder,limits.builderInput,limits.builderOutput),builderCandidates:builderEntries.filter(item=>passed(connection.checks[item.model],'builder')).map(item=>layer(connection,item,limits.builderInput,limits.builderOutput)),
      onePassEstimateUsd:personalCost+builderCost,maximumEstimateUsd:maximum,estimateComplete:false,estimateScope:'One submitted participant interpretation plus one shared builder call. Repairs and additional submitted participants are excluded from the one-pass figure; the displayed maximum includes bounded builder repairs but only one interpreter.',defaultMaximumSpendUsd:roundCap(maximum),
      repairAttempts: limits.repairAttempts,
      assumptions: ['One personal interpretation and one shared builder call are included in the one-pass allowance.', `The worst-case cap reserves up to ${limits.repairAttempts} builder attempts and one structured-output repair inside each attempt.`, 'Prices are per million tokens; actual provider billing may include categories the API does not report.'],
      missing: [],
    };
  }
  if(!connections.length) missing.push('Save a supported API connection first.');
  else if(!missing.length) missing.push('The selected connection has no validated catalog baseline for this setup. Run capability checks or explicitly choose another connection in Advanced.');
  return {available:false,workflowMode,modeAvailable:true,effort,presetVersion:PRESET_VERSION,pricingVersion:PRICING_VERSION,routingRuleVersion:ROUTING_RULE_VERSION,status:'hypothesis',routingReason:'No validated same-connection baseline is available.',estimateComplete:false,estimateScope:'Unavailable until exact validated models are selected.',defaultMaximumSpendUsd:.01,repairAttempts:limits.repairAttempts,assumptions:[],missing};
}

export function classifyTaskComplexity(requirements:SharedRequirement[]):TaskComplexity{
  if(!requirements.length)return'uncertain';const criteria=requirements.reduce((n,item)=>n+item.acceptanceCriteria.length,0),text=requirements.map(item=>`${item.description} ${item.acceptanceCriteria.join(' ')}`).join(' ').toLowerCase();
  if(requirements.length>=6||criteria>=12||/(authentication|real[- ]time|payment|migration|animation|accessibility|integration|offline|database)/.test(text))return'complex';
  if(requirements.length<=2&&criteria<=3)return'simple';return'standard';
}

export function routeBuilderForRun(setup:NonNullable<import('../src/types.js').AISetupPolicy>,requirements:SharedRequirement[],remainingBudgetUsd:number){
  const complexity=classifyTaskComplexity(requirements),baseline=setup.resolved?.builder;
  if(!baseline)throw new Error('The frozen setup has no builder assignment.');
  const required=estimateLayerMaximum(baseline)||0;
  if(required>remainingBudgetUsd)throw new Error(`The validated baseline needs up to $${required.toFixed(3)} for one call, but only $${remainingBudgetUsd.toFixed(3)} remains.`);
  const reason=complexity==='uncertain'
    ?'Complexity was uncertain, so the selected preset baseline was kept within its ceiling; no silent upgrade occurred.'
    :`${complexity[0].toUpperCase()+complexity.slice(1)} Developer task under the ${setup.effort||'custom'} effort ceiling. The economical validated baseline was kept.`;
  return{assignment:{connectionId:baseline.connectionId,model:baseline.model},layer:baseline,complexity,evidenceStatus:setup.status||'hypothesis',reason};
}

export function workflowInstruction(mode?: AIWorkflowMode) {
  return mode ? workflowModes[mode].instruction : '';
}

export function estimateLayerMaximum(layer: AIRecommendation['personal']) {
  if(!layer) return undefined;
  return maximumAllowanceCharge(layer.maxInputTokens,layer.maxOutputTokens,layer.rate);
}
