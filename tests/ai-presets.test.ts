import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {classifyTaskComplexity,resolveRecommendation,routeBuilderForRun} from '../server/ai-presets.js';
import {qualifiesModeMapping,summarizeTrials,type EvaluationTrial} from '../server/ai-evaluation.js';
import {RoomManager} from '../server/rooms.js';

const passed = {
  reachable: {status: 'passed'},
  text: {status: 'passed'},
  personal: {status: 'passed'},
  builder: {status: 'passed'},
} as const;

test('Developer / Medium resolves one validated connection and exposes honest rates', () => {
  const recommendation = resolveRecommendation([{
    id: 'openrouter',
    name: 'Team OpenRouter',
    provider: 'openrouter',
    models: [{id: 'openai/gpt-5.6-luna'}, {id: 'openai/gpt-5.6-terra'}],
    checks: {'openai/gpt-5.6-luna': passed, 'openai/gpt-5.6-terra': passed},
  }], 'developer', 'medium');
  assert.equal(recommendation.available, true);
  assert.equal(recommendation.personal?.model, 'openai/gpt-5.6-luna');
  assert.equal(recommendation.builder?.model, 'openai/gpt-5.6-luna', 'Developer retains the economical baseline');
  assert.equal(recommendation.personal?.connectionId, recommendation.builder?.connectionId);
  assert.equal(recommendation.status, 'hypothesis');
  assert.ok((recommendation.maximumEstimateUsd || 0) > (recommendation.onePassEstimateUsd || 0));
  assert.equal(recommendation.status, 'hypothesis');
  assert.ok(recommendation.defaultMaximumSpendUsd >= recommendation.maximumEstimateUsd!);
  assert.match(recommendation.personal!.rate.sourceUrl, /^https:/);
});

test('complexity is deterministic and does not spend a model call',()=>{
  const requirement=(description:string,acceptanceCriteria:string[]=[])=>({description,acceptanceCriteria}) as any;
  assert.equal(classifyTaskComplexity([]),'uncertain');
  assert.equal(classifyTaskComplexity([requirement('Add a heading')]),'simple');
  assert.equal(classifyTaskComplexity([requirement('Add authentication and offline persistence',['Sign in works'])]),'complex');
});

test('evaluation requires repeated task evidence and counts repairs in total cost',()=>{
  const trial=(trial:number):EvaluationTrial=>({workflowMode:'developer',taskId:'developer-app',model:'baseline',trial,requirementsSatisfied:4,requirementsTotal:4,verificationPassed:true,regressions:0,latencyMs:1000+trial,interpretationCostUsd:.01,generationCostUsd:.02,repairCostUsd:.03});
  const two=[trial(1),trial(2)],three=[...two,trial(3)];
  assert.equal(qualifiesModeMapping(two,'developer').qualified,false);
  assert.equal(qualifiesModeMapping(three,'developer').qualified,true);
  assert.equal(qualifiesModeMapping([],'analyst').qualified,false);
  assert.match(qualifiesModeMapping([],'researcher').reason,/no implemented tool-backed/i);
  assert.equal(summarizeTrials(three).totalCostUsd,.18);
});

test('Developer routing respects the remaining budget',()=>{
  const connections=[{id:'openrouter',name:'Team OpenRouter',provider:'openrouter' as const,models:[{id:'openai/gpt-5.6-luna'},{id:'openai/gpt-5.6-terra'}],checks:{'openai/gpt-5.6-luna':passed,'openai/gpt-5.6-terra':passed}}];
  const developer=resolveRecommendation(connections,'developer','medium');
  const setup={mode:'recommended' as const,workflowMode:'developer' as const,effort:'medium' as const,status:developer.status,resolved:{personal:developer.personal!,builder:developer.builder!,builderCandidates:developer.builderCandidates,repairAttempts:developer.repairAttempts}};
  const routed=routeBuilderForRun(setup,[{description:'Add a heading',acceptanceCriteria:[]} as any],10);
  assert.equal(routed.assignment.model,developer.builder?.model);
  assert.throws(()=>routeBuilderForRun(setup,[{description:'Add a heading',acceptanceCriteria:[]} as any],0),/only \$0\.000 remains/);
});

test('all three modes are explicit and unimplemented workflows remain unavailable',()=>{
  const connections=[{id:'openrouter',name:'Team OpenRouter',provider:'openrouter' as const,models:[{id:'openai/gpt-5.6-luna'}],checks:{'openai/gpt-5.6-luna':passed}}];
  assert.equal(resolveRecommendation(connections,'developer','light').modeAvailable,true);
  const analyst=resolveRecommendation(connections,'analyst','medium'),researcher=resolveRecommendation(connections,'researcher','high');
  assert.equal(analyst.available,false);assert.equal(analyst.modeAvailable,false);assert.match(analyst.unavailableReason||'',/data ingestion/i);
  assert.equal(researcher.available,false);assert.equal(researcher.modeAvailable,false);assert.match(researcher.unavailableReason||'',/retrieval/i);
});

test('discovery without passed capability checks is unavailable and actionable', () => {
  const recommendation = resolveRecommendation([{
    id: 'openrouter', name: 'Team OpenRouter', provider: 'openrouter',
    models: [{id: 'openai/gpt-5.6-luna'}, {id: 'openai/gpt-5.6-terra'}], checks: {},
  }], 'developer', 'medium');
  assert.equal(recommendation.available, false);
  assert.match(recommendation.missing.join(' '), /capability checks/i);
});

test('applying a preset is opt-in, preserves Advanced overrides, and reserves atomically', async () => {
  const manager = new RoomManager({debounceMs: 500, encryptionSecret: 'preset-test-secret'});
  const room = manager.create(`preset-${crypto.randomUUID()}`);
  try {
    const connectionId = (await manager.saveConnection(room, {name:'Team OpenRouter',provider:'openrouter',baseUrl:'https://openrouter.ai/api/v1',apiKey:'secret'})).id;
    const connection = room.ai.connections!.find(item => item.id === connectionId)!;
    connection.models = [{id:'openai/gpt-5.6-luna',name:'Luna'}, {id:'openai/gpt-5.6-terra',name:'Terra'}];
    connection.checks['openai/gpt-5.6-luna'] = passed;
    connection.checks['openai/gpt-5.6-terra'] = passed;
    room.ai.participantOverrides = {friend:{connectionId,model:'openai/gpt-5.6-luna'}};
    const preview = manager.recommendAI(room, 'developer', 'medium');
    assert.equal(manager.view(room).ai.status, 'disconnected', 'previewing a preset must not apply it');
    manager.applyRecommendedAI(room, 'developer', 'medium', preview.defaultMaximumSpendUsd);
    const view = manager.view(room);
    assert.equal(view.ai.setup?.mode, 'recommended');
    assert.equal(view.ai.setup?.workflowMode, 'developer');
    assert.deepEqual(view.ai.participantOverrides, {friend:{connectionId,model:'openai/gpt-5.6-luna'}}, 'Advanced overrides remain saved');
    const setup = room.ai.setup!;
    (manager as any).reserveBudget(room, 'personal', setup);
    (manager as any).reserveBudget(room, 'builder', setup, 2);
    (manager as any).reserveBudget(room, 'builder', setup, 2);
    assert.throws(() => (manager as any).reserveBudget(room, 'builder', setup, 2), /remaining.*budget/i);
  } finally { manager.shutdown(); }
});

test('legacy coding presets migrate to Developer without rewriting assignments, overrides, effort, or history', async()=>{
  const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'cocreate-mode-migration-')),roomId=`mode-migration-${crypto.randomUUID()}`,manager=new RoomManager({debounceMs:500,encryptionSecret:'migration-test-secret',dataDir}),room=manager.create(roomId);
  let managerClosed=false,restoredManager:RoomManager|undefined,restoredClosed=false;
  try{
    const connectionId=(await manager.saveConnection(room,{name:'Existing',provider:'openrouter',baseUrl:'https://openrouter.ai/api/v1',apiKey:'secret'})).id;
    const personal={connectionId,model:'existing-personal'},builder={connectionId,model:'existing-builder'},overrides={friend:{connectionId,model:'existing-friend'}};
    room.ai.personal=personal;room.ai.builder=builder;room.ai.participantOverrides=overrides;room.ai.setup={mode:'recommended',specialty:'motion_designer',effort:'high',maximumSpendUsd:7,resolved:{personal:{connectionId,connectionName:'Existing',provider:'openrouter',model:personal.model,rate:{} as any,maxInputTokens:10,maxOutputTokens:5},builder:{connectionId,connectionName:'Existing',provider:'openrouter',model:builder.model,rate:{} as any,maxInputTokens:20,maxOutputTokens:10},repairAttempts:2}};
    room.aiRuns=[{specialty:'designer',runId:'historical',catalogVersion:'legacy',pricingVersion:'legacy',routingRuleVersion:'legacy',verificationPolicyVersion:'legacy',complexity:'standard',evidenceStatus:'hypothesis',routingReason:'Historical',personalModels:[personal.model],builderModel:builder.model,calls:[],usage:{chargeIncomplete:true},latencyMs:1,outcome:'promoted',verification:{operationsApplied:true,compilationPassed:true,requirementSatisfaction:'not_measured',regressionCheck:'not_run',verified:false}}];
    (manager as any).save(room);manager.shutdown();managerClosed=true;
    restoredManager=new RoomManager({debounceMs:500,encryptionSecret:'migration-test-secret',dataDir});
    const restored=restoredManager.get(roomId)!;const view=restoredManager.view(restored);
    assert.equal(view.ai.setup?.workflowMode,'developer');assert.equal(view.ai.setup?.effort,'high');assert.equal(view.ai.setup?.maximumSpendUsd,7);
    assert.deepEqual(view.ai.personal,personal);assert.deepEqual(view.ai.builder,builder);assert.deepEqual(view.ai.participantOverrides,overrides);
    assert.equal(restored.aiRuns[0].specialty,'designer');assert.equal(restored.aiRuns[0].workflowMode,undefined);
    assert.ok(restored.ai.connections?.[0].encryptedKey,'the encrypted credential remains stored');
    restoredManager.shutdown();restoredClosed=true;
  }finally{if(!managerClosed)manager.shutdown();if(restoredManager&&!restoredClosed)restoredManager.shutdown();fs.rmSync(dataDir,{recursive:true,force:true})}
});

test('manual assignments remain Custom after migration and activation', async () => {
  const manager = new RoomManager({debounceMs: 500, encryptionSecret: 'custom-test-secret'});
  const room = manager.create(`custom-${crypto.randomUUID()}`);
  try {
    const connectionId = (await manager.saveConnection(room, {name:'Manual',provider:'openrouter',baseUrl:'https://openrouter.ai/api/v1',apiKey:'secret'})).id;
    room.ai.connections![0].checks.manual = passed;
    await manager.assignAI(room, {connectionId,model:'manual'}, {connectionId,model:'manual'}, {friend:{connectionId,model:'manual'}});
    assert.equal(manager.view(room).ai.setup?.mode, 'custom');
    assert.deepEqual(manager.view(room).ai.participantOverrides, {friend:{connectionId,model:'manual'}});
  } finally { manager.shutdown(); }
});
