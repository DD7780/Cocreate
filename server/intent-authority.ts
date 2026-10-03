import type { InterpretationIntent, Requirement, SharedRequirement } from '../src/types.js';
import type { AgentChange } from './generator.js';

export type AcceptedIntentContext = Pick<SharedRequirement, 'id' | 'revision' | 'category' | 'description' | 'authority' | 'sources' | 'status'>;
const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
const unresolved = /\b(?:make|change|remove|delete|use|update|replace|move|rename|style|color|keep|disable|enable|fix)\s+(?:that|it|this|these|those|them)(?:\s|[.!?]|$)/i;
const sourceWords = (value: string) => normalize(value).toLowerCase().match(/[a-z0-9_-]+/g) || [];
const generic = new Set('make change remove delete use update replace move rename style color keep disable enable fix add build create show please the a an that this it these those them to and blue red green yellow black white'.split(' '));

/** Validate provenance and references independently of the model's classification or authorship. */
export function validateSubmittedInterpretation(
  interpretation: Requirement,
  changes: AgentChange[],
  acceptedContext: AcceptedIntentContext[],
  previous?: Requirement,
): Requirement {
  const authored=changes.map(change=>change.after).filter(Boolean);
  // Authenticated insertion fragments may span keyboard updates. Never use deleted before-text or shared drafts.
  const passages=[...authored.map(normalize),normalize(authored.join('')),normalize(authored.join(' '))].filter(Boolean);
  const known = new Map(acceptedContext.filter(item => item.status === 'accepted').map(item => [item.id, item]));
  const intents = (interpretation.intents || []).map((candidate): InterpretationIntent => {
    // Only schema fields survive the provider boundary; it cannot stamp human authority/history.
    const intent: InterpretationIntent = {
      id: candidate.id, text: candidate.text, category: candidate.category, classification: candidate.classification,
      rationale: candidate.rationale, sourcePassage: candidate.sourcePassage,
      affectedRequirementIds: [...candidate.affectedRequirementIds],
      participantId: interpretation.participantId, participantName: interpretation.participantName,
      sourceRevision: interpretation.sourceRevision, sourceEditSeqs: [...interpretation.sourceEditSeqs],
      authority: 'authenticated_submission',
    };
    const passage = normalize(intent.sourcePassage);
    const carry = previous?.intents?.find(item => item.validation?.status === 'verified' && !item.withdrawn &&
      item.text === intent.text && item.sourcePassage === intent.sourcePassage && item.classification === intent.classification);
    const supported = !!passage && passages.some(source => source.includes(passage));
    let reason: string | undefined;
    if (!supported && !carry) reason = 'The quoted source is absent from your authenticated captured edits. Correct this interpretation explicitly.';
    const unknown = intent.affectedRequirementIds.some(id => !known.has(id));
    if (unknown) reason = 'A referenced requirement is not in the captured accepted revision. Review and clarify the target.';
    const requested = intent.affectedRequirementIds.map(id => known.get(id)).filter((item): item is AcceptedIntentContext => !!item);
    const surrounding = passages.filter(source=>source.includes(passage)).flatMap(source=>source.split(/[.;!?]/)).filter(sentence=>sentence.includes(passage)).join(' ');
    if (unresolved.test(passage) || unresolved.test(surrounding)) {
      const evidence=surrounding||passage;
      const words = new Set(sourceWords(evidence).filter(word => !generic.has(word)));
      const named = [...known.values()].filter(item => sourceWords(item.description).some(word => words.has(word)));
      const explicit = requested.filter(item => evidence.includes(item.id) || (named.length === 1 && named[0].id === item.id));
      if (explicit.length !== 1) reason = 'The target of “that/it/this” is unclear. Name the feature or correct the intent using a specific description.';
    }
    if (intent.category === 'withdrawal' && (!/\b(withdraw|remove|drop|cancel|no longer want|do not want)\b/i.test(passage) ||
      !requested.length || requested.some(item => !item.sources.some(source => source.participantId === interpretation.participantId)))) {
      reason = 'Withdrawal requires an explicit request naming your own recorded intent. Deletion and teammates’ context do not authorize it.';
    }
    intent.contextReferences = requested.map(item => ({requirementId:item.id, revision:item.revision,
      participantIds:[...new Set(item.sources.map(source => source.participantId))], authority:'accepted_context'}));
    if (carry && !supported && !reason) return {...carry, contextReferences:intent.contextReferences};
    intent.validation = reason ? {status:'needs_clarification', reason} : {status:'verified'};
    if (reason) { intent.classification = 'ambiguity'; intent.affectedRequirementIds = []; intent.rationale = reason; }
    return intent;
  });
  const classifications = [...new Set(intents.map(intent => intent.classification))];
  const withdrawals = intents.filter(intent => intent.category === 'withdrawal' && intent.validation?.status === 'verified' &&
    (intent.classification === 'explicit_request' || intent.classification === 'decision'));
  return {...interpretation, intents, classification:classifications.length === 1 ? classifications[0] : 'ambiguity',
    sourcePassages:[...new Set(intents.filter(intent => intent.validation?.status === 'verified').map(intent => intent.sourcePassage))],
    affectedRequirementIds:[], withdrawals:withdrawals.map(intent => intent.text)};
}

export function acceptedContext(requirements: SharedRequirement[]): AcceptedIntentContext[] {
  return requirements.filter(item => item.status === 'accepted').map(item => structuredClone({
    id:item.id, revision:item.revision, category:item.category, description:item.description, authority:item.authority,
    sources:item.sources, status:item.status,
  }));
}
