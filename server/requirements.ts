import{createHash}from'node:crypto';
import type{ConflictAlternative,ConflictDecisionRecord,ConflictGroup,ConflictSelection,Contradiction,InterpretationClassification,InterpretationIntent,InterpretationIntentCategory,Requirement,SharedRequirement,SharedRequirementCategory,SharedRequirementSource}from'../src/types.js';

const clean=(value:string)=>value.replace(/\s+/g,' ').trim();
const normalized=(value:string)=>clean(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const stableId=(prefix:string,value:string)=>`${prefix}_${createHash('sha256').update(value).digest('hex').slice(0,12)}`;
const unique=(items:string[])=>[...items.reduce((map,item)=>{const value=clean(item),key=normalized(value);if(key&&!map.has(key))map.set(key,value);return map},new Map<string,string>()).values()];

export const INTERPRETATION_CLASSIFIER_VERSION='intent-v2';
const classifications=new Set<InterpretationClassification>(['proposal','question','explicit_request','decision','ambiguity']);
const categories=new Set<InterpretationIntentCategory>(['goal','feature','design','constraint','question','withdrawal']);
export function classifyIntentText(text:string,model?:InterpretationClassification):InterpretationClassification{
  const value=clean(text),lower=value.toLowerCase(),quoted=/^(?:example|example:|quote|quoted|someone said|they said)\b|^[“”"']/.test(lower),proposal=/\b(maybe|perhaps|one idea|what if|we might|we could|could potentially|later)\b/.test(lower),hypothetical=/^(?:if|suppose|imagine)\b|\bif we (?:were to|did|created|built|added)\b/.test(lower),polite=/^(?:please\s+)?(?:can|could|would) you\s+(?:create|build|make|add|change|remove|implement|design|include|support|enable)\b/.test(lower),directive=/^(?:please\s+)?(?:create|build|make|add|change|remove|implement|design|include|support|enable|use|do not|don't|must|show)\b/.test(lower)||/^i (?:want|need|require|would like)\b/.test(lower),informational=/^(?:how|why|when|where|which|who|would .* be useful|can (?:this|the) .* support)\b/.test(lower)&&!polite;
  if(quoted||hypothetical)return model==='question'?'question':'proposal';
  if(polite||directive)return'explicit_request';
  if(proposal)return model==='question'?'question':'proposal';
  if(informational)return'question';
  return model&&classifications.has(model)?model:'ambiguity';
}
const intentId=(participantId:string,category:string,text:string)=>stableId('intent',`${participantId}:${category}:${normalized(text)}`);
export function normalizeInterpretation(value:any):Requirement{
  const participantId=value.participantId||'unknown',participantName=value.participantName||'Unknown collaborator',sourceRevision=value.sourceRevision??value.revision??1,sourceEditSeqs=value.sourceEditSeqs||[],sourcePassages=value.sourcePassages||[],rawClassification=classifications.has(value.classification)?value.classification as InterpretationClassification:'ambiguity',legacy:Array<{category:InterpretationIntentCategory;text:string}>=[...(value.goals||[]).map((text:string)=>({category:'goal' as const,text})),...(value.features||[]).map((text:string)=>({category:'feature' as const,text})),...(value.design||[]).map((text:string)=>({category:'design' as const,text})),...(value.constraints||[]).map((text:string)=>({category:'constraint' as const,text})),...(value.questions||[]).map((text:string)=>({category:'question' as const,text}))],rawIntents=Array.isArray(value.intents)&&value.intents.length?value.intents:legacy.map(item=>({...item,classification:rawClassification,rationale:'Migrated from the contribution-level classification.',sourcePassage:sourcePassages.find((passage:string)=>normalized(passage).includes(normalized(item.text))||normalized(item.text).includes(normalized(passage)))||item.text,affectedRequirementIds:value.affectedRequirementIds||[]})),intents:InterpretationIntent[]=rawIntents.filter((item:any)=>item&&typeof item.text==='string'&&item.text.trim()).map((item:any)=>{const category=categories.has(item.category)?item.category as InterpretationIntentCategory:'feature',model=classifications.has(item.classification)?item.classification as InterpretationClassification:undefined,classification=classifyIntentText(item.sourcePassage||item.text,model);return{id:item.id||intentId(participantId,category,item.text),text:clean(item.text),category,classification,rationale:classification!==model?`The wording is a ${classification.replace('_',' ')} under CoCreate’s intent rules.`:clean(item.rationale||'Classified from the contributor’s wording and context.'),sourcePassage:clean(item.sourcePassage||item.text),affectedRequirementIds:Array.isArray(item.affectedRequirementIds)?item.affectedRequirementIds:[],participantId,participantName,sourceRevision,sourceEditSeqs}}),summary=[...new Set(intents.map(item=>item.classification))],classification:InterpretationClassification=summary.length===1?summary[0]:summary.length?'ambiguity':rawClassification;
  return{...value,id:value.id||crypto.randomUUID(),participantId,participantName,goals:value.goals||[],features:value.features||[],design:value.design||[],constraints:value.constraints||[],questions:value.questions||[],additions:value.additions||[],modifications:value.modifications||[],withdrawals:value.withdrawals||[],classification,affectedRequirementIds:value.affectedRequirementIds||[],sourceRevision,sourceEditSeqs,sourcePassages,revision:value.revision||1,createdAt:value.createdAt||new Date().toISOString(),intents,classifierVersion:value.classifierVersion||'legacy-v1'};
}

const candidateEntries=(interpretation:Requirement)=>{
  const normalizedInterpretation=normalizeInterpretation(interpretation),entries=(normalizedInterpretation.intents||[]).filter((intent):intent is InterpretationIntent&{category:SharedRequirementCategory}=>['goal','feature','design','constraint'].includes(intent.category)).map(intent=>({category:intent.category,description:intent.text,classification:intent.classification,sourcePassage:intent.sourcePassage,affectedRequirementIds:intent.affectedRequirementIds}));
  return[...new Map(entries.map(entry=>[`${entry.category}:${normalized(entry.description)}`,entry])).values()];
};

const sourceFor=(interpretation:Requirement,passage?:string):SharedRequirementSource=>({participantId:interpretation.participantId,participantName:interpretation.participantName,interpretationId:interpretation.id,documentRevision:interpretation.sourceRevision,editSeqs:interpretation.sourceEditSeqs,passages:passage?[passage]:interpretation.sourcePassages});
const acceptanceFor=(category:SharedRequirementCategory,description:string)=>category==='design'?`The verified product visibly follows this design direction: ${description}`:category==='constraint'?`The verified product respects this constraint: ${description}`:`A user can verify this behavior in the product: ${description}`;
const sameSource=(a:SharedRequirementSource,b:SharedRequirementSource)=>a.participantId===b.participantId&&a.interpretationId===b.interpretationId;
const acceptedClassification=(value:Requirement['classification'])=>value==='explicit_request'||value==='decision';

function contradictionSignature(value:string){
  const lower=normalized(value),negative=/\b(?:do not|don t|must not|should not|never|without|no)\b/.test(lower);
  const subject=lower.replace(/\b(?:do not|don t|must not|should not|never|without|no|must|should|please|use|add|include|support|enable|require|requires|required|the|a|an)\b/g,' ').replace(/\s+/g,' ').trim();
  return{negative,subject};
}

type ConflictClaim={key:string;subject:string;scope:string;value:string};
const colors=new Set(['red','green','blue','yellow','orange','purple','pink','black','white','gray','grey','teal','cyan','indigo','violet','brown']);
const scopedClaim=(requirement:SharedRequirement):ConflictClaim|null=>{
  const text=normalized(requirement.description),tokens=text.split(' '),color=tokens.find(token=>colors.has(token)),subjectMatch=text.match(/\b(header|footer|background|sidebar|navigation|nav|button|buttons|card|cards|title|heading|logo|checkout|login)\b/),condition=text.match(/\b(?:in|during|for|when)\s+(light mode|dark mode|mobile|desktop|errors?|success|checkout)\b/);
  if(color&&subjectMatch){const subject=subjectMatch[1],scope=condition?.[1]||'global';return{key:`appearance:${subject}:${scope}`,subject,scope,value:`color:${color}`}}
  const signature=contradictionSignature(requirement.description);
  if(!signature.subject)return null;
  return{key:`behavior:${signature.subject}:global`,subject:signature.subject,scope:'global',value:signature.negative?'deny':'allow'};
};
const uniqueSources=(sources:SharedRequirementSource[])=>[...new Map(sources.map(source=>[`${source.participantId}:${source.interpretationId}`,source])).values()];
const groupHistory=(group:ConflictGroup,at:string):ConflictDecisionRecord[]=>group.selections.length||group.state!=='awaiting_choices'?group.history.concat({round:group.round,groupRevision:group.revision,state:group.state,selections:group.selections,selectedAlternativeId:group.lastAgreedBaseline?.alternativeId,recordedAt:at}):group.history;
const alternativeSignature=(alternatives:ConflictAlternative[],resolverIds:string[])=>JSON.stringify({alternatives:alternatives.map(item=>({id:item.id,requirementRevisions:item.requirementRevisions})),resolverIds});

export function migrateLegacyContradictions(requirements:SharedRequirement[],legacy:Contradiction[],at=new Date().toISOString()):ConflictGroup[]{
  return legacy.map(item=>{const linked=requirements.filter(requirement=>item.requirementIds.includes(requirement.id)),alternatives=linked.map(requirement=>({id:stableId('alt',`${item.id}:${requirement.id}`),label:requirement.description,requirementIds:[requirement.id],requirementRevisions:[{id:requirement.id,revision:requirement.revision}],sources:requirement.sources})),requiredResolverIds=[...new Set(alternatives.flatMap(alternative=>alternative.sources.map(source=>source.participantId)))].sort();return{id:item.id,revision:1,round:1,subject:item.reason,scope:'legacy',requirementIds:item.requirementIds,alternatives,requiredResolverIds,selections:[],state:item.status==='resolved'?'resolved':'awaiting_choices',detectionStatus:'confirmed',explanation:item.reason,affectedBuildScopes:['legacy'],history:[],createdAt:item.createdAt,updatedAt:item.resolvedAt||at}});
}

export function detectConflictGroups(requirements:SharedRequirement[],previous:ConflictGroup[]=[],at=new Date().toISOString()):ConflictGroup[]{
  const buckets=new Map<string,{claim:ConflictClaim;requirements:SharedRequirement[]}>();
  for(const requirement of requirements.filter(item=>item.status==='accepted')){const claim=scopedClaim(requirement);if(!claim)continue;const bucket=buckets.get(claim.key)||{claim,requirements:[]};bucket.requirements.push(requirement);buckets.set(claim.key,bucket)}
  const found=new Map<string,ConflictGroup>();
  for(const bucket of buckets.values()){
    const byValue=new Map<string,SharedRequirement[]>();for(const requirement of bucket.requirements){const claim=scopedClaim(requirement)!;byValue.set(claim.value,(byValue.get(claim.value)||[]).concat(requirement))}if(byValue.size<2)continue;
    const id=stableId('conflict',bucket.claim.key),alternatives=[...byValue.entries()].map(([value,items])=>({id:stableId('alt',`${id}:${value}`),label:items[0].description,requirementIds:items.map(item=>item.id).sort(),requirementRevisions:items.map(item=>({id:item.id,revision:item.revision})).sort((a,b)=>a.id.localeCompare(b.id)),sources:uniqueSources(items.flatMap(item=>item.sources))})).sort((a,b)=>a.id.localeCompare(b.id)),requirementIds=alternatives.flatMap(item=>item.requirementIds).sort(),requiredResolverIds=[...new Set(alternatives.flatMap(item=>item.sources.map(source=>source.participantId)))].sort(),old=previous.find(item=>item.id===id),same=!!old&&alternativeSignature(old.alternatives,old.requiredResolverIds)===alternativeSignature(alternatives,requiredResolverIds);
    found.set(id,same?{...old,alternatives,requirementIds,requiredResolverIds,updatedAt:old.updatedAt}:{id,revision:(old?.revision||0)+1,round:(old?.round||0)+1,subject:bucket.claim.subject,scope:bucket.claim.scope,requirementIds,alternatives,requiredResolverIds,selections:[],state:'awaiting_choices',detectionStatus:'confirmed',explanation:`Accepted requirements specify incompatible alternatives for ${bucket.claim.subject} in ${bucket.claim.scope} scope.`,affectedBuildScopes:[bucket.claim.key],history:old?groupHistory(old,at):[],lastAgreedBaseline:old?.lastAgreedBaseline,createdAt:old?.createdAt||at,updatedAt:at});
  }
  for(const old of previous)if(!found.has(old.id))found.set(old.id,old.state==='obsolete'?old:{...old,revision:old.revision+1,state:'obsolete',selections:[],history:groupHistory(old,at),obsoleteReason:'The conflicting accepted alternatives are no longer active.',updatedAt:at});
  return[...found.values()].sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
}

export function contradictionsFromConflictGroups(groups:ConflictGroup[]):Contradiction[]{return groups.filter(group=>group.state!=='obsolete').map(group=>({id:group.id,requirementIds:group.requirementIds,reason:group.explanation,question:`Choose one shared alternative for ${group.subject}: ${group.alternatives.map(item=>item.label).join(' | ')}`,status:group.state==='resolved'?'resolved':'open',consequential:true,createdAt:group.createdAt,resolvedAt:group.state==='resolved'?group.updatedAt:undefined}))}

export function submitConflictSelection(group:ConflictGroup,input:{participantId:string;groupRevision:number;alternativeId:string|'reject_both';requestId:string;submittedAt?:string}):ConflictGroup{
  if(input.groupRevision!==group.revision)throw new Error(`Conflict revision changed from ${input.groupRevision} to ${group.revision}. Refresh and review the alternatives before choosing again.`);
  if(group.state==='obsolete')throw new Error('This conflict is obsolete and no longer accepts selections.');
  if(!group.requiredResolverIds.includes(input.participantId))throw new Error('Only an affected contributor can submit a selection for this conflict.');
  if(input.alternativeId!=='reject_both'&&!group.alternatives.some(item=>item.id===input.alternativeId))throw new Error('Choose an alternative from the current conflict revision.');
  const duplicate=group.selections.find(item=>item.requestId===input.requestId);if(duplicate){if(duplicate.participantId!==input.participantId||duplicate.alternativeId!==input.alternativeId)throw new Error('That request ID was already used for a different selection.');return group}
  if(group.state!=='awaiting_choices')throw new Error('This decision round is complete. Reopen the conflict before submitting a new selection.');
  const submittedAt=input.submittedAt||new Date().toISOString(),selections=group.selections.filter(item=>item.participantId!==input.participantId).concat({participantId:input.participantId,alternativeId:input.alternativeId,groupRevision:group.revision,requestId:input.requestId,submittedAt}).sort((a,b)=>a.participantId.localeCompare(b.participantId)),complete=group.requiredResolverIds.every(id=>selections.some(item=>item.participantId===id)),choices=new Set(selections.map(item=>item.alternativeId)),state:ConflictGroup['state']=complete?(choices.size===1?'resolved':'disagreement'):'awaiting_choices',selectedAlternativeId=state==='resolved'?selections[0].alternativeId:undefined,history=state===group.state?group.history:group.history.concat({round:group.round,groupRevision:group.revision,state,selections,selectedAlternativeId,recordedAt:submittedAt}),lastAgreedBaseline=state==='resolved'&&selectedAlternativeId!=='reject_both'?{alternativeId:selectedAlternativeId!,requirementIds:group.alternatives.find(item=>item.id===selectedAlternativeId)?.requirementIds||[],decidedAt:submittedAt}:group.lastAgreedBaseline;
  return{...group,selections,state,history,lastAgreedBaseline,updatedAt:submittedAt};
}

export function reconcileRequirements(current:SharedRequirement[],interpretationInput:Requirement,previousConflicts:Array<ConflictGroup|Contradiction>=[],at=new Date().toISOString()){
  const interpretation=normalizeInterpretation(interpretationInput),next=current.map(item=>({...item,sources:[...item.sources]})),entries=candidateEntries(interpretation),affected=new Set(interpretation.affectedRequirementIds);
  for(const entry of entries){
    const source=sourceFor(interpretation,entry.sourcePassage),entryAffected=new Set([...affected,...entry.affectedRequirementIds]),explicitlyAccepted=acceptedClassification(entry.classification),targetId=entries.length===1&&entryAffected.size===1?[...entryAffected][0]:stableId('req',`${entry.category}:${normalized(entry.description)}`);
    const index=next.findIndex(item=>item.id===targetId||`${item.category}:${normalized(item.description)}`===`${entry.category}:${normalized(entry.description)}`);
    if(index<0){next.push({id:targetId,revision:1,category:entry.category,description:entry.description,acceptanceCriteria:[acceptanceFor(entry.category,entry.description)],status:explicitlyAccepted?'accepted':'proposed',authority:explicitlyAccepted?'automatic':'unresolved',sources:[source],createdAt:at,updatedAt:at});continue}
    const item=next[index],sources=item.sources.some(existing=>sameSource(existing,source))?item.sources:item.sources.concat(source),description=entry.description,status=item.status==='accepted'||explicitlyAccepted?'accepted':item.status==='withdrawn'?'proposed':item.status;
    const changed=description!==item.description||status!==item.status||sources.length!==item.sources.length;
    next[index]={...item,description,status,authority:status==='accepted'?(item.authority==='owner'?'owner':'automatic'):'unresolved',sources,revision:changed?item.revision+1:item.revision,updatedAt:changed?at:item.updatedAt};
  }
  const withdrawalTerms=interpretation.withdrawals.map(normalized).filter(Boolean);
  for(let index=0;index<next.length;index++){
    const item=next[index],explicitTarget=affected.has(item.id),textTarget=withdrawalTerms.some(term=>normalized(item.description).includes(term)||term.includes(normalized(item.description)));
    if(!explicitTarget&&!textTarget)continue;
    const sources=item.sources.filter(existing=>existing.participantId!==interpretation.participantId);
    if(sources.length===item.sources.length)continue;
    next[index]={...item,sources,status:sources.length?item.status:'withdrawn',authority:sources.length?item.authority:'unresolved',revision:item.revision+1,updatedAt:at};
  }
  next.sort((a,b)=>a.id.localeCompare(b.id));
  const previousGroups=previousConflicts.filter((item):item is ConflictGroup=>'alternatives'in item),legacy=previousConflicts.filter((item):item is Contradiction=>!('alternatives'in item)),baseline=previousGroups.length?previousGroups:migrateLegacyContradictions(current,legacy,at),conflictGroups=detectConflictGroups(next,baseline,at),contradictions=contradictionsFromConflictGroups(conflictGroups),before=JSON.stringify({requirements:current,conflictGroups:baseline}),after=JSON.stringify({requirements:next,conflictGroups});
  return{requirements:next,conflictGroups,contradictions,changed:before!==after,acceptedChanged:acceptedRequirementFingerprint(current,baseline)!==acceptedRequirementFingerprint(next,conflictGroups)};
}

export function supersedeInterpretationSources(requirements:SharedRequirement[],interpretationId:string,at=new Date().toISOString()){
  return requirements.map(item=>{const sources=item.sources.filter(source=>source.interpretationId!==interpretationId);if(sources.length===item.sources.length)return item;return{...item,sources,status:sources.length?item.status:'superseded' as const,authority:sources.length?item.authority:'unresolved' as const,revision:item.revision+1,updatedAt:at}});
}

export const acceptedRequirements=(requirements:SharedRequirement[])=>requirements.filter(item=>item.status==='accepted').sort((a,b)=>a.id.localeCompare(b.id));
export const blockedRequirementIds=(groups:ConflictGroup[])=>new Set(groups.filter(group=>group.state==='awaiting_choices'||group.state==='disagreement').flatMap(group=>group.requirementIds));
export const eligibleRequirements=(requirements:SharedRequirement[],groups:ConflictGroup[])=>{const blocked=blockedRequirementIds(groups),resolved=new Map(groups.filter(group=>group.state==='resolved').map(group=>[group.id,group]));return acceptedRequirements(requirements).filter(item=>{if(blocked.has(item.id))return false;for(const group of resolved.values())if(group.requirementIds.includes(item.id)){const selected=group.selections[0]?.alternativeId;if(selected==='reject_both')return false;return group.alternatives.find(alternative=>alternative.id===selected)?.requirementIds.includes(item.id)??false}return true})};
export const acceptedRequirementFingerprint=(requirements:SharedRequirement[],groups:ConflictGroup[]=[])=>JSON.stringify(eligibleRequirements(requirements,groups).map(item=>({id:item.id,category:item.category,description:item.description,acceptanceCriteria:item.acceptanceCriteria,status:item.status})));
export const hasOpenContradictions=(items:Array<ConflictGroup|Contradiction>)=>items.some(item=>'alternatives'in item?(item.state==='awaiting_choices'||item.state==='disagreement')&&item.detectionStatus==='confirmed':item.status==='open'&&item.consequential);
