import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyTaskComplexity,resolveRecommendation,routeBuilderForRun} from '../server/ai-presets.js';
import {qualifiesSpecialtyMapping,summarizeTrials,type EvaluationTrial} from '../server/ai-evaluation.js';
import {RoomManager} from '../server/rooms.js';

const passed = {
  reachable: {status: 'passed'},
  text: {status: 'passed'},
  personal: {status: 'passed'},
  builder: {status: 'passed'},
} as const;

test('General app / Medium resolves one validated connection and exposes honest rates', () => {
  const recommendation = resolveRecommendation([{
    id: 'openrouter',
    name: 'Team OpenRouter',
    provider: 'openrouter',
    models: [{id: 'openai/gpt-5.6-luna'}, {id: 'openai/gpt-5.6-terra'}],
    checks: {'openai/gpt-5.6-luna': passed, 'openai/gpt-5.6-terra': passed},
  }], 'general', 'medium');
  assert.equal(recommendation.available, true);
  assert.equal(recommendation.personal?.model, 'openai/gpt-5.6-luna');
  assert.equal(recommendation.builder?.model, 'openai/gpt-5.6-luna', 'unmeasured specialties retain the economical baseline');
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
  const trial=(trial:number):EvaluationTrial=>({specialty:'general',taskId:'general-crud',model:'baseline',trial,requirementsSatisfied:4,requirementsTotal:4,verificationPassed:true,regressions:0,latencyMs:1000+trial,interpretationCostUsd:.01,generationCostUsd:.02,repairCostUsd:.03});
  const two=[trial(1),trial(2)],three=[...two,trial(3)];
  assert.equal(qualifiesSpecialtyMapping(two,'general').qualified,false);
  assert.equal(qualifiesSpecialtyMapping(three,'general').qualified,true);
  assert.equal(summarizeTrials(three).totalCostUsd,.18);
});

test('unmeasured specialties share the baseline and routing respects remaining budget',()=>{
  const connections=[{id:'openrouter',name:'Team OpenRouter',provider:'openrouter' as const,models:[{id:'openai/gpt-5.6-luna'},{id:'openai/gpt-5.6-terra'}],checks:{'openai/gpt-5.6-luna':passed,'openai/gpt-5.6-terra':passed}}];
  const general=resolveRecommendation(connections,'general','medium'),motion=resolveRecommendation(connections,'motion_designer','medium');
  assert.equal(general.builder?.model,motion.builder?.model);
  const setup={mode:'recommended' as const,specialty:'general' as const,effort:'medium' as const,status:general.status,resolved:{personal:general.personal!,builder:general.builder!,builderCandidates:general.builderCandidates,repairAttempts:general.repairAttempts}};
  const routed=routeBuilderForRun(setup,[{description:'Add a heading',acceptanceCriteria:[]} as any],10);
  assert.equal(routed.assignment.model,general.builder?.model);
  assert.throws(()=>routeBuilderForRun(setup,[{description:'Add a heading',acceptanceCriteria:[]} as any],0),/only \$0\.000 remains/);
});

test('discovery without passed capability checks is unavailable and actionable', () => {
  const recommendation = resolveRecommendation([{
    id: 'openrouter', name: 'Team OpenRouter', provider: 'openrouter',
    models: [{id: 'openai/gpt-5.6-luna'}, {id: 'openai/gpt-5.6-terra'}], checks: {},
  }], 'general', 'medium');
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
    const preview = manager.recommendAI(room, 'general', 'medium');
    assert.equal(manager.view(room).ai.status, 'disconnected', 'previewing a preset must not apply it');
    manager.applyRecommendedAI(room, 'general', 'medium', preview.defaultMaximumSpendUsd);
    const view = manager.view(room);
    assert.equal(view.ai.setup?.mode, 'recommended');
    assert.deepEqual(view.ai.participantOverrides, {friend:{connectionId,model:'openai/gpt-5.6-luna'}}, 'Advanced overrides remain saved');
    const setup = room.ai.setup!;
    (manager as any).reserveBudget(room, 'personal', setup);
    (manager as any).reserveBudget(room, 'builder', setup, 2);
    (manager as any).reserveBudget(room, 'builder', setup, 2);
    assert.throws(() => (manager as any).reserveBudget(room, 'builder', setup, 2), /remaining.*budget/i);
  } finally { manager.shutdown(); }
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
