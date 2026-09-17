import{createHash}from'node:crypto';
import type{Contradiction,Requirement,SharedRequirement,SharedRequirementCategory,SharedRequirementSource}from'../src/types.js';

const clean=(value:string)=>value.replace(/\s+/g,' ').trim();
const normalized=(value:string)=>clean(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const stableId=(prefix:string,value:string)=>`${prefix}_${createHash('sha256').update(value).digest('hex').slice(0,12)}`;
const unique=(items:string[])=>[...items.reduce((map,item)=>{const value=clean(item),key=normalized(value);if(key&&!map.has(key))map.set(key,value);return map},new Map<string,string>()).values()];

export function normalizeInterpretation(value:any):Requirement{
  return{...value,id:value.id||crypto.randomUUID(),participantId:value.participantId||'unknown',participantName:value.participantName||'Unknown collaborator',goals:value.goals||[],features:value.features||[],design:value.design||[],constraints:value.constraints||[],questions:value.questions||[],additions:value.additions||[],modifications:value.modifications||[],withdrawals:value.withdrawals||[],classification:value.classification||'explicit_request',affectedRequirementIds:value.affectedRequirementIds||[],sourceRevision:value.sourceRevision??value.revision??1,sourceEditSeqs:value.sourceEditSeqs||[],sourcePassages:value.sourcePassages||[],revision:value.revision||1,createdAt:value.createdAt||new Date().toISOString()};
}

const candidateEntries=(interpretation:Requirement)=>{
  const entries:Array<{category:SharedRequirementCategory;description:string}>=[];
  const add=(category:SharedRequirementCategory,items:string[])=>unique(items).forEach(description=>entries.push({category,description}));
  add('goal',interpretation.goals);add('feature',interpretation.features);add('design',interpretation.design);add('constraint',interpretation.constraints);
  return[...new Map(entries.map(entry=>[`${entry.category}:${normalized(entry.description)}`,entry])).values()];
};

const sourceFor=(interpretation:Requirement):SharedRequirementSource=>({participantId:interpretation.participantId,participantName:interpretation.participantName,interpretationId:interpretation.id,documentRevision:interpretation.sourceRevision,editSeqs:interpretation.sourceEditSeqs,passages:interpretation.sourcePassages});
const acceptanceFor=(category:SharedRequirementCategory,description:string)=>category==='design'?`The verified product visibly follows this design direction: ${description}`:category==='constraint'?`The verified product respects this constraint: ${description}`:`A user can verify this behavior in the product: ${description}`;
const sameSource=(a:SharedRequirementSource,b:SharedRequirementSource)=>a.participantId===b.participantId&&a.interpretationId===b.interpretationId;
const acceptedClassification=(value:Requirement['classification'])=>value==='explicit_request'||value==='decision';

function contradictionSignature(value:string){
  const lower=normalized(value),negative=/\b(?:do not|don t|must not|should not|never|without|no)\b/.test(lower);
  const subject=lower.replace(/\b(?:do not|don t|must not|should not|never|without|no|must|should|please|use|add|include|support|enable|require|requires|required|the|a|an)\b/g,' ').replace(/\s+/g,' ').trim();
  return{negative,subject};
}

export function detectContradictions(requirements:SharedRequirement[],previous:Contradiction[]=[],at=new Date().toISOString()):Contradiction[]{
  const accepted=requirements.filter(item=>item.status==='accepted'),found=new Map<string,Contradiction>();
  for(let left=0;left<accepted.length;left++)for(let right=left+1;right<accepted.length;right++){
    const a=accepted[left],b=accepted[right],sa=contradictionSignature(a.description),sb=contradictionSignature(b.description);
    if(!sa.subject||sa.subject!==sb.subject||sa.negative===sb.negative)continue;
    const requirementIds=[a.id,b.id].sort(),id=stableId('conflict',requirementIds.join(':')),old=previous.find(item=>item.id===id);
    found.set(id,{id,requirementIds,reason:`Accepted requirements disagree about “${sa.subject}”.`,question:`Should the product ${sa.negative?a.description:b.description}, or ${sa.negative?b.description:a.description}?`,status:'open',consequential:true,createdAt:old?.createdAt||at});
  }
  for(const old of previous)if(!found.has(old.id))found.set(old.id,old.status==='resolved'?old:{...old,status:'resolved',resolvedAt:at});
  return[...found.values()].sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
}

export function reconcileRequirements(current:SharedRequirement[],interpretationInput:Requirement,previousContradictions:Contradiction[]=[],at=new Date().toISOString()){
  const interpretation=normalizeInterpretation(interpretationInput),next=current.map(item=>({...item,sources:[...item.sources]})),source=sourceFor(interpretation),entries=candidateEntries(interpretation),affected=new Set(interpretation.affectedRequirementIds),explicitlyAccepted=acceptedClassification(interpretation.classification);
  for(const entry of entries){
    const targetId=entries.length===1&&affected.size===1?[...affected][0]:stableId('req',`${entry.category}:${normalized(entry.description)}`);
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
  const contradictions=detectContradictions(next,previousContradictions,at),before=JSON.stringify({requirements:current,contradictions:previousContradictions}),after=JSON.stringify({requirements:next,contradictions});
  return{requirements:next,contradictions,changed:before!==after,acceptedChanged:acceptedRequirementFingerprint(current)!==acceptedRequirementFingerprint(next)};
}

export const acceptedRequirements=(requirements:SharedRequirement[])=>requirements.filter(item=>item.status==='accepted').sort((a,b)=>a.id.localeCompare(b.id));
export const acceptedRequirementFingerprint=(requirements:SharedRequirement[])=>JSON.stringify(acceptedRequirements(requirements).map(item=>({id:item.id,category:item.category,description:item.description,acceptanceCriteria:item.acceptanceCriteria,status:item.status})));
export const hasOpenContradictions=(items:Contradiction[])=>items.some(item=>item.status==='open'&&item.consequential);
