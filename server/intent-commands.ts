import { createHash } from 'node:crypto';
import type { IntentCommand, IntentCorrection, InterpretationIntent, Requirement, SharedRequirement, SharedRequirementSource } from '../shared/types.js';
import { normalizeInterpretation, reconcileRequirements } from './requirements.js';
import { submittedOutput } from './document-intent.js';

function fail(message:string,status=409):never {throw Object.assign(new Error(message),{status});}
const categories = new Set(['goal','feature','design','constraint','question']);
export function parseIntentCommand(value:any):IntentCommand {
  if (!value || !/^[A-Za-z0-9_-]{8,100}$/.test(value.requestId) || !Number.isSafeInteger(value.specificationRevision) || value.specificationRevision<0)
    fail('Provide a request ID and current specification revision.',400);
  const target=value.target;
  if (!target || !['requirement','interpretation'].includes(target.kind) || typeof target.id!=='string' || !target.id || target.id.length>150 ||
    !Number.isSafeInteger(target.revision) || target.revision<1 || (target.kind==='interpretation' && (typeof target.intentId!=='string'||!target.intentId||target.intentId.length>150)))
    fail('Provide a current requirement or interpretation intent revision.',400);
  if (!['correct','withdraw'].includes(value.action)) fail('Choose correct or withdraw.',400);
  const command:IntentCommand={requestId:value.requestId,specificationRevision:value.specificationRevision,
    target:target.kind==='requirement'?{kind:'requirement',id:target.id,revision:target.revision}:{kind:'interpretation',id:target.id,intentId:target.intentId,revision:target.revision},action:value.action};
  if(value.action==='correct') {
    const text=typeof value.text==='string'?value.text.trim():'';
    if(!text || text.length>2000 || !categories.has(value.category) || !['explicit_request','proposal','question'].includes(value.classification))
      fail('Provide up to 2,000 characters, a category and an explicit request, proposal or question.',400);
    Object.assign(command,{text,category:value.category,classification:value.classification});
  }
  return command;
}
export const intentCommandHash=(command:IntentCommand)=>createHash('sha256').update(JSON.stringify(command)).digest('hex');

/** Only this authenticated actor's exact support is removed; old interpretations are immutable history. */
export function applyIntentCommand(requirements:SharedRequirement[],latest:Requirement|undefined,participant:{id:string;name:string},command:IntentCommand,at:string) {
  const next=structuredClone(requirements),target=command.target;
  let text:string,sources:SharedRequirementSource[],originalIntent:InterpretationIntent|undefined;
  if(target.kind==='requirement') {
    const requirement=next.find(item=>item.id===target.id);
    if(!requirement)fail('Requirement not found.',404);
    if(requirement.revision!==target.revision)fail('This requirement changed. Refresh and review it before correcting.');
    sources=requirement.sources.filter(source=>source.participantId===participant.id);
    if(!sources.length)fail('You can change only your own attributable intent.',403);
    text=requirement.description;
  }else{
    if(!latest || latest.id!==target.id || latest.revision!==target.revision)fail('Your interpretation changed. Refresh and review it before correcting.');
    originalIntent=latest.intents?.find(intent=>intent.id===target.intentId&&!intent.withdrawn);
    if(!originalIntent || latest.participantId!==participant.id)fail('You can change only your own current intent.',403);
    text=originalIntent.text;
    sources=next.flatMap(item=>item.sources.filter(source=>source.participantId===participant.id&&source.interpretationId===latest.id&&
      (source.intentId===target.intentId || (!source.intentId&&item.description===originalIntent!.text&&source.passages.includes(originalIntent!.sourcePassage)))));
  }
  for(const requirement of next) {
    const retained=requirement.sources.filter(source=>!sources.some(removed=>JSON.stringify(source)===JSON.stringify(removed)));
    if(retained.length===requirement.sources.length)continue;
    requirement.sources=retained;requirement.revision++;requirement.updatedAt=at;
    if(!retained.length){requirement.status='withdrawn';requirement.authority='unresolved';}
  }
  const id=`human_${createHash('sha256').update(participant.id+':'+command.requestId).digest('hex').slice(0,24)}`;
  const intent:InterpretationIntent={id:id+'_intent',text:command.text||text,category:command.category||originalIntent?.category||'feature',
    classification:command.classification||originalIntent?.classification||'explicit_request',rationale:command.action==='withdraw'?'Withdrawn explicitly by its author.':'Corrected explicitly by its author.',
    sourcePassage:command.text||text,affectedRequirementIds:[],participantId:participant.id,participantName:participant.name,
    sourceRevision:originalIntent?.sourceRevision||sources[0]?.documentRevision||latest?.sourceRevision||1,
    sourceEditSeqs:originalIntent?.sourceEditSeqs||sources.flatMap(source=>source.editSeqs),authority:'human_correction',validation:{status:'verified'},withdrawn:command.action==='withdraw'};
  // Retain other latest intents as inspection records; reconciliation adds only the corrected entry.
  if (!intent.withdrawn && intent.classification === 'explicit_request') {
    const correctedTarget = target.kind === 'requirement' ? requirements.find(item => item.id === target.id)?.output : originalIntent?.output;
    const routed = submittedOutput(intent.sourcePassage, correctedTarget);
    if (routed.reason) fail(routed.reason, 400);
    intent.output = routed.output;
  }
  const preserved=(latest?.intents||[]).filter(item=>target.kind==='interpretation'?item.id!==target.intentId:!sources.some(source=>source.intentId===item.id||(!source.intentId&&source.interpretationId===latest?.id&&item.text===text&&source.passages.includes(item.sourcePassage))));
  const interpretation=normalizeInterpretation({id:latest?.id||id,participantId:participant.id,participantName:participant.name,revision:(latest?.revision||0)+1,
    sourceRevision:intent.sourceRevision,sourceEditSeqs:intent.sourceEditSeqs,sourcePassages:[intent.sourcePassage],createdAt:at,intents:preserved.concat(intent),classifierVersion:'intent-v2'});
  const onlyCorrection={...interpretation,intents:[intent]};
  const registry=reconcileRequirements(next,onlyCorrection).requirements;
  const audit:IntentCorrection={requestId:command.requestId,participantId:participant.id,participantName:participant.name,target:command.target,
    action:command.action,before:text,after:command.text,recordedAt:at,sources:structuredClone(sources)};
  return{requirements:registry,interpretation,audit};
}
