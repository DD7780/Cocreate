import test from'node:test';
import assert from'node:assert/strict';
import type{InterpretationClassification,Requirement}from'../src/types.js';
import{acceptedRequirements,hasOpenContradictions,reconcileRequirements}from'../server/requirements.js';

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
