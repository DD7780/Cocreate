import test from'node:test';
import assert from'node:assert/strict';
import type{InterpretationClassification,Requirement}from'../src/types.js';
import{acceptedRequirements,detectConflictGroups,eligibleRequirements,hasOpenContradictions,migrateLegacyContradictions,reconcileRequirements,submitConflictSelection}from'../server/requirements.js';

const interpretation=(participantId:string,feature:string,classification:InterpretationClassification='explicit_request',overrides:Partial<Requirement>={}):Requirement=>({id:`interpretation-${participantId}-${crypto.randomUUID()}`,participantId,participantName:participantId==='alice'?'Alice':'Bob',goals:[],features:feature?[feature]:[],design:[],constraints:[],questions:[],additions:feature?[feature]:[],modifications:[],withdrawals:[],classification,affectedRequirementIds:[],sourceRevision:1,sourceEditSeqs:[1],sourcePassages:feature?[feature]:[],revision:1,createdAt:new Date().toISOString(),...overrides});

test('shared requirements keep a stable identity across collaborators and canvas locations',()=>{
  const first=reconcileRequirements([],interpretation('alice','Add calculator history'));
  const second=reconcileRequirements(first.requirements,interpretation('bob','  Add calculator history  '),first.contradictions);
  assert.equal(second.requirements.length,1);
  assert.equal(second.requirements[0].id,first.requirements[0].id);
  assert.deepEqual(second.requirements[0].sources.map(source=>source.participantId).sort(),['alice','bob']);
  assert.equal(second.requirements[0].status,'accepted');
});

test('a proposal remains visible but is excluded from builder input',()=>{
  const result=reconcileRequirements([],interpretation('alice','Maybe add a currency converter','proposal'));
  assert.equal(result.requirements[0].status,'proposed');
  assert.equal(acceptedRequirements(result.requirements).length,0);
  assert.equal(result.acceptedChanged,false);
});

test('opposed accepted requirements create one focused consequential conflict',()=>{
  const first=reconcileRequirements([],interpretation('alice','Use dark mode'));
  const second=reconcileRequirements(first.requirements,interpretation('bob','Do not use dark mode'),first.contradictions);
  assert.equal(hasOpenContradictions(second.contradictions),true);
  assert.equal(second.contradictions.filter(item=>item.status==='open').length,1);
  assert.match(second.contradictions[0].question,/dark mode/i);
});

test('same-subject colors form one durable multi-option group',()=>{
  const red=reconcileRequirements([],interpretation('alice','Make the header red'));
  const green=reconcileRequirements(red.requirements,interpretation('bob','Make the header green'),red.conflictGroups);
  const blue=reconcileRequirements(green.requirements,interpretation('carol','Make the header blue'),green.conflictGroups);
  assert.equal(blue.conflictGroups.length,1);
  assert.equal(blue.conflictGroups[0].alternatives.length,3);
  assert.deepEqual(blue.conflictGroups[0].requiredResolverIds,['alice','bob','carol']);
  assert.equal(blue.conflictGroups[0].id,green.conflictGroups[0].id);
  assert.equal(blue.conflictGroups[0].revision,green.conflictGroups[0].revision+1);
});

test('different subjects and conditional scopes remain compatible',()=>{
  const header=reconcileRequirements([],interpretation('alice','Make the header red'));
  const footer=reconcileRequirements(header.requirements,interpretation('bob','Make the footer green'),header.conflictGroups);
  assert.equal(footer.conflictGroups.length,0);
  const light=reconcileRequirements([],interpretation('alice','Make the header red in light mode'));
  const dark=reconcileRequirements(light.requirements,interpretation('bob','Make the header green in dark mode'),light.conflictGroups);
  assert.equal(dark.conflictGroups.length,0);
});

test('proposals never enter accepted conflict groups',()=>{
  const red=reconcileRequirements([],interpretation('alice','Make the header red'));
  const proposal=reconcileRequirements(red.requirements,interpretation('bob','Make the header green','proposal'),red.conflictGroups);
  assert.equal(proposal.conflictGroups.length,0);
  assert.equal(acceptedRequirements(proposal.requirements).length,1);
});

test('explicit selections stay pending, then resolve or disagree without model voting',()=>{
  const red=reconcileRequirements([],interpretation('alice','Make the header red'));
  const green=reconcileRequirements(red.requirements,interpretation('bob','Make the header green'),red.conflictGroups),group=green.conflictGroups[0],choice=group.alternatives[0].id;
  const pending=submitConflictSelection(group,{participantId:'alice',groupRevision:group.revision,alternativeId:choice,requestId:'choice-a'});
  assert.equal(pending.state,'awaiting_choices');
  assert.equal(pending.selections.length,1);
  const resolved=submitConflictSelection(pending,{participantId:'bob',groupRevision:group.revision,alternativeId:choice,requestId:'choice-b'});
  assert.equal(resolved.state,'resolved');
  assert.equal(resolved.lastAgreedBaseline?.alternativeId,choice);
  assert.equal(submitConflictSelection(resolved,{participantId:'bob',groupRevision:group.revision,alternativeId:choice,requestId:'choice-b'}),resolved);
  assert.throws(()=>submitConflictSelection(resolved,{participantId:'alice',groupRevision:group.revision,alternativeId:choice,requestId:'choice-after-resolution'}),/Reopen the conflict/);
  const other=group.alternatives.find(item=>item.id!==choice)!.id,split=submitConflictSelection(pending,{participantId:'bob',groupRevision:group.revision,alternativeId:other,requestId:'choice-b-split'});
  assert.equal(split.state,'disagreement');
  assert.equal(split.alternatives.length,2);
  assert.throws(()=>submitConflictSelection(split,{participantId:'alice',groupRevision:group.revision,alternativeId:other,requestId:'choice-after-disagreement'}),/Reopen the conflict/);
});

test('legacy pairwise contradictions migrate without losing identity or affected contributors',()=>{
  const red=reconcileRequirements([],interpretation('alice','Make the header red'));
  const green=reconcileRequirements(red.requirements,interpretation('bob','Make the header green'),red.conflictGroups),detected=green.contradictions[0];
  const migrated=migrateLegacyContradictions(green.requirements,[detected],'2026-09-18T00:00:00.000Z');
  assert.equal(migrated[0].id,detected.id);
  assert.equal(migrated[0].alternatives.length,2);
  assert.deepEqual(migrated[0].requiredResolverIds,['alice','bob']);
  assert.equal(migrated[0].state,'awaiting_choices');
});

test('selection submissions are authorized, revision-safe, and idempotent',()=>{
  const red=reconcileRequirements([],interpretation('alice','Make the header red'));
  const green=reconcileRequirements(red.requirements,interpretation('bob','Make the header green'),red.conflictGroups),group=green.conflictGroups[0],choice=group.alternatives[0].id;
  assert.throws(()=>submitConflictSelection(group,{participantId:'mallory',groupRevision:group.revision,alternativeId:choice,requestId:'unauthorized'}),/affected contributor/);
  assert.throws(()=>submitConflictSelection(group,{participantId:'alice',groupRevision:group.revision-1,alternativeId:choice,requestId:'stale'}),/Refresh and review/);
  const once=submitConflictSelection(group,{participantId:'alice',groupRevision:group.revision,alternativeId:choice,requestId:'same'}),twice=submitConflictSelection(once,{participantId:'alice',groupRevision:group.revision,alternativeId:choice,requestId:'same'});
  assert.equal(twice.selections.length,1);
  const blueRequirement=reconcileRequirements(green.requirements,interpretation('carol','Make the header blue'),green.conflictGroups),changed=blueRequirement.conflictGroups[0];
  assert.throws(()=>submitConflictSelection(changed,{participantId:'alice',groupRevision:group.revision,alternativeId:choice,requestId:'old-round'}),/Refresh and review/);
});

test('unresolved alternatives are excluded while independent accepted work remains eligible',()=>{
  const red=reconcileRequirements([],interpretation('alice','Make the header red'));
  const green=reconcileRequirements(red.requirements,interpretation('bob','Make the header green'),red.conflictGroups);
  const independent=reconcileRequirements(green.requirements,interpretation('carol','Add calculator history'),green.conflictGroups),eligible=eligibleRequirements(independent.requirements,independent.conflictGroups);
  assert.deepEqual(eligible.map(item=>item.description),['Add calculator history']);
  assert.equal(detectConflictGroups(independent.requirements,independent.conflictGroups).filter(item=>item.state==='awaiting_choices').length,1);
});

test('explicit withdrawal removes only that collaborator source and preserves supported intent',()=>{
  const first=reconcileRequirements([],interpretation('alice','Add calculator history'));
  const second=reconcileRequirements(first.requirements,interpretation('bob','Add calculator history'),first.contradictions);
  const id=second.requirements[0].id;
  const aliceWithdrawal=interpretation('alice','','explicit_request',{withdrawals:['calculator history'],affectedRequirementIds:[id]});
  const third=reconcileRequirements(second.requirements,aliceWithdrawal,second.contradictions);
  assert.equal(third.requirements[0].status,'accepted');
  assert.deepEqual(third.requirements[0].sources.map(source=>source.participantId),['bob']);
  const bobWithdrawal=interpretation('bob','','explicit_request',{withdrawals:['calculator history'],affectedRequirementIds:[id]});
  const fourth=reconcileRequirements(third.requirements,bobWithdrawal,third.contradictions);
  assert.equal(fourth.requirements[0].status,'withdrawn');
  assert.equal(acceptedRequirements(fourth.requirements).length,0);
});
