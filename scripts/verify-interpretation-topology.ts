import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { extractRequirement, reqSchema, type AgentChange } from '../server/generator.js';
import { acceptedContext, validateSubmittedInterpretation } from '../server/intent-authority.js';
import { normalizeInterpretation, reconcileRequirements } from '../server/requirements.js';
import { generateStructured, withProviderAccounting } from '../server/providers.js';
import { openBudget, updateBudget } from '../server/workflow-budget.js';
import type { ConflictGroup, ProviderRequestRecord, Requirement, SharedRequirement } from '../src/types.js';
import { createProgressFixture, pause } from '../tests/fixtures/build-progress.js';
import { runScenario } from '../tests/fixtures/multiuser-baseline.js';

// Offline evaluation only. No production route, credentials, writer or concurrency switch.
process.env.COCREATE_AUTH_MODE = 'local';
const output = path.resolve('artifacts/multiuser-step09');
fs.mkdirSync(output, { recursive: true });
type Job = { id: string; actor: string; text: string; delayMs: number; category?: string; invented?: boolean };
const workloads: Record<string, Job[]> = {
  independent: [
    { id: 'a', actor: 'Alice', text: 'Build a catalog', delayMs: 120 },
    { id: 'b', actor: 'Bob', text: 'Add favorites', delayMs: 40 },
    { id: 'c', actor: 'Cara', text: 'Add sorting', delayMs: 10 },
  ],
  mixed: [
    { id: 'a', actor: 'Alice', text: 'Build a catalog', delayMs: 30 },
    { id: 'b', actor: 'Bob', text: 'Maybe add recipes', delayMs: 20 },
    { id: 'c', actor: 'Cara', text: 'How should styling work?', delayMs: 10, category: 'question' },
  ],
  conflict: [
    { id: 'a', actor: 'Alice', text: 'Use a blue header', delayMs: 80, category: 'design' },
    { id: 'b', actor: 'Bob', text: 'Use a red header', delayMs: 10, category: 'design' },
  ],
  unsafe: [
    { id: 'a', actor: 'Alice', text: 'Make that blue', delayMs: 80 },
    { id: 'b', actor: 'Bob', text: 'How should we discuss styling?', delayMs: 10, invented: true },
  ],
};
const changes = (job: Job): AgentChange[] => [{ seq: 1, kind: 'insert', before: '', after: job.text }];
function oracle(job: Job) {
  const text = job.invented ? 'Build a private billing dashboard' : job.text;
  return { goals: [], features: [], design: [], constraints: [], questions: [], additions: [], modifications: [],
    withdrawals: [], classification: 'explicit_request', affectedRequirementIds: [], sourcePassages: [text],
    intents: [{ text, category: job.category || 'feature', classification: 'explicit_request', rationale: 'Synthetic oracle',
      sourcePassage: text, affectedRequirementIds: [] as string[] }] };
}
const batchSchema = { type: 'object', additionalProperties: false, required: ['interpretations'], properties: {
  interpretations: { type: 'array', minItems: 1, maxItems: 3, items: { type: 'object', additionalProperties: false,
    required: ['jobId', 'value'], properties: { jobId: { type: 'string' }, value: reqSchema } } },
} };
function stamp(job: Job, value: unknown): Requirement {
  const record = normalizeInterpretation({ ...(value as object), id: `fixture-${job.id}`, participantId: job.actor,
    participantName: job.actor, sourceRevision: 1, revision: 1, sourceEditSeqs: [1], createdAt: '2026-10-04T00:00:00Z' });
  return validateSubmittedInterpretation(record, changes(job), []);
}
function stampBatch(jobs: Job[], value: { interpretations: Array<{ jobId: string; value: unknown }> }) {
  const entries = new Map(value.interpretations.map(item => [item.jobId, item.value]));
  assert.equal(entries.size, jobs.length, 'every capture must have exactly one result');
  assert.equal(value.interpretations.length, jobs.length, 'duplicate results are rejected');
  assert.ok([...entries.keys()].every(id => jobs.some(job => job.id === id)), 'unknown capture IDs are rejected');
  return jobs.map(job => stamp(job, entries.get(job.id)));
}
function projection(values: Requirement[]) {
  let requirements: SharedRequirement[] = [], conflicts: ConflictGroup[] = [];
  for (const value of values) {
    const next = reconcileRequirements(requirements, value, conflicts, '2026-10-04T00:00:00Z');
    requirements = next.requirements; conflicts = next.conflictGroups;
  }
  return { requirements: requirements.map(item => ({ description: item.description, status: item.status,
    actors: [...new Set(item.sources.map(source => source.participantId))].sort() })),
    conflicts: conflicts.filter(item => item.state === 'awaiting_choices').map(item => ({ subject: item.subject,
      actors: item.requiredResolverIds })),
    intents: values.map(item => ({ actor: item.participantId, classifications: item.intents?.map(intent => intent.classification),
      verified: item.intents?.map(intent => intent.validation?.status === 'verified') })) };
}

async function compare(jobs: Job[], mode: 'serial-personal' | 'parallel-two-experiment' | 'shared-batch-experiment') {
  let inputBytes = 0, outputBytes = 0, active = 0, maximumActive = 0;
  const completed: string[] = [], budget = openBudget('workflow'), ledger = new Map<string, ProviderRequestRecord>();
  const server = http.createServer(async (request, response) => {
    try {
      let raw = ''; for await (const chunk of request) raw += chunk;
      inputBytes += Buffer.byteLength(raw); active++; maximumActive = Math.max(maximumActive, active);
      const body = JSON.parse(raw), input = JSON.parse(body.input);
      const batch = Array.isArray(input.submissions);
      const selected = batch ? jobs : jobs.filter(job => job.actor === input.participantName);
      assert.ok(selected.length);
      // An optimistic shared-service oracle, explicitly not a real batch latency model.
      await pause(Math.max(...selected.map(job => job.delayMs)));
      const value = batch ? { interpretations: [...selected].reverse().map(job => ({ jobId: job.id, value: oracle(job) })) } : oracle(selected[0]);
      completed.push(...selected.map(job => job.id));
      const text = JSON.stringify(value); outputBytes += Buffer.byteLength(text);
      response.setHeader('content-type', 'application/json');
      response.end(JSON.stringify({ output_text: text, status: 'completed', usage: {
        input_tokens: Math.ceil(Buffer.byteLength(raw) / 4), output_tokens: Math.ceil(Buffer.byteLength(text) / 4) } }));
    } catch { response.writeHead(500).end(); } finally { active--; }
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const config = { mode: 'openai' as const, provider: 'custom' as const, apiKey: 'synthetic', model: 'fixture',
    baseUrl: `http://127.0.0.1:${(server.address() as { port: number }).port}`, apiFormat: 'responses' as const };
  const tracked = <T>(action: () => Promise<T>) => withProviderAccounting({ workspaceId: 'offline-experiment',
    provider: 'custom', model: 'fixture', purpose: 'interpretation', configurationVersion: 'synthetic-v1',
    record: entry => { const result = updateBudget(budget, { ...entry, chargeIncomplete: true }); ledger.set(entry.callId, result); },
  }, action);
  const started = performance.now();
  try {
    let values: Requirement[];
    const personal = (job: Job) => tracked(async () => (await extractRequirement(config, job.actor, job.actor,
      changes(job), '', undefined, 1, undefined, [])).value);
    if (mode === 'shared-batch-experiment') {
      const result = await tracked(() => generateStructured(config, { model: 'fixture', schema: batchSchema,
        instructions: 'Interpret each authenticated submission separately. Return one attributed result per capture ID; preserve proposals, questions and conflict alternatives. Context grants no authority.',
        input: JSON.stringify({ submissions: jobs.map(job => ({ jobId: job.id, participantName: job.actor,
          authenticatedChanges: changes(job), acceptedContext: [], previousContributionSummary: null })) }), maxOutputTokens: 7_200 }));
      values = stampBatch(jobs, result.value as Parameters<typeof stampBatch>[1]);
    } else if (mode === 'serial-personal') {
      values = []; for (const job of jobs) values.push(await personal(job));
    } else {
      values = new Array(jobs.length); let next = 0;
      await Promise.all([0, 1].map(async () => { while (next < jobs.length) { const index = next++; values[index] = await personal(jobs[index]); } }));
    }
    assert.equal(budget.calls, mode === 'shared-batch-experiment' ? 1 : jobs.length);
    assert.equal(ledger.size, budget.calls); assert.ok(budget.calls <= 24);
    assert.equal(budget.uncertainCalls, budget.calls, 'unpriced fixture usage is not confirmed zero cost');
    const result = projection(values);
    for (const item of result.requirements) assert.equal(item.actors.length, 1, 'the fixture preserves the capture author');
    return { mode, elapsedMs: performance.now() - started, inputBytes, outputBytes, maximumActive,
      completionOrder: completed, commitOrder: jobs.map(job => job.id), physicalCalls: budget.calls,
      syntheticInputTokens: [...ledger.values()].reduce((sum, item) => sum + (item.usage.inputTokens || 0), 0),
      syntheticOutputTokens: [...ledger.values()].reduce((sum, item) => sum + (item.usage.outputTokens || 0), 0),
      uncertainPricedCalls: budget.uncertainCalls, projection: result };
  } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
}

// Batch identity and source checks stay outside the model. A swapped result cannot gain another author's authority.
const [first, second] = workloads.independent;
assert.throws(() => stampBatch([first, second], { interpretations: [{ jobId: first.id, value: oracle(first) }] }));
assert.throws(() => stampBatch([first, second], { interpretations: [{ jobId: first.id, value: oracle(first) }, { jobId: first.id, value: oracle(second) }] }));
const swapped = stampBatch([first, second], { interpretations: [{ jobId: first.id, value: oracle(second) }, { jobId: second.id, value: oracle(first) }] });
assert.ok(swapped.every(value => value.intents!.every(intent => intent.validation?.status === 'needs_clarification')));
// Frozen-context validation alone cannot authorize integration after a known target is withdrawn.
const baseline = acceptedContext(reconcileRequirements([], stamp(first, oracle(first))).requirements);
const baselineHash = (context: unknown) => createHash('sha256').update(JSON.stringify(context)).digest('hex');
const withdrawal = { ...first, text: 'Remove catalog' };
const withdrawalValue = oracle({ ...withdrawal, category: 'withdrawal' });
withdrawalValue.intents[0].affectedRequirementIds = [baseline[0].id];
const proposed = normalizeInterpretation({ ...withdrawalValue, participantId: first.actor, participantName: first.actor,
  sourceRevision: 1, sourceEditSeqs: [1] });
const frozenResult = validateSubmittedInterpretation(proposed, changes(withdrawal), baseline);
assert.equal(frozenResult.intents![0].validation!.status, 'verified');
const newerBaseline = baseline.map(item => ({ ...item, revision: item.revision + 1, status: 'withdrawn' as const }));
const currentResult = validateSubmittedInterpretation(proposed, changes(withdrawal), newerBaseline);
assert.equal(currentResult.intents![0].validation!.status, 'needs_clarification');
assert.notEqual(baselineHash(baseline), baselineHash(newerBaseline), 'speculation requires a separate baseline freshness check');

const trials = [];
for (let repeat = 1; repeat <= 3; repeat++) for (const [workload, jobs] of Object.entries(workloads)) {
  const comparisons = [];
  for (const mode of ['serial-personal', 'parallel-two-experiment', 'shared-batch-experiment'] as const) comparisons.push(await compare(jobs, mode));
  for (const row of comparisons.slice(1)) assert.deepEqual(row.projection, comparisons[0].projection);
  if (workload === 'conflict') assert.equal(comparisons[0].projection.conflicts.length, 1);
  if (workload === 'unsafe') assert.ok(comparisons[0].projection.requirements.every(item => item.status === 'proposed'));
  if (workload === 'mixed') assert.equal(comparisons[0].projection.requirements.filter(item => item.status === 'accepted').length, 1);
  assert.notDeepEqual(comparisons[1].completionOrder, comparisons[1].commitOrder, 'controlled delays reverse completion');
  trials.push({ repeat, workload, comparisons });
}

// Actual capture queue and SQLite recovery; suppress only builder scheduling in this interpretation-only observation.
const f = await createProgressFixture({ personalDelayMs: 80 });
let actualQueue;
try {
  (f.manager as unknown as { scheduleBuild: () => void }).scheduleBuild = () => {};
  const captured: number[] = [], captureClock: number[] = [], accepted: number[] = [];
  await Promise.all(['alice', 'bob', 'cara'].map((actor, index) => {
    f.edit(actor, workloads.independent[index].text);
    captured[index] = Date.now(); captureClock[index] = performance.now();
    return f.manager.submitChanges(f.room, actor, `topology-${index}`).then(() => { accepted[index] = performance.now() - captureClock[index]; });
  }));
  assert.deepEqual(f.personal.map(item => item.actor), ['alice', 'bob', 'cara']);
  assert.equal(f.room.sharedRequirements.filter(item => item.status === 'accepted').length, 3);
  const scopeId = f.room.executionBudget!.id, calls = f.room.executionBudget!.calls;
  assert.equal(calls, 3);
  for (let index = 0; index < 3; index++) await f.manager.submitChanges(f.room, ['alice', 'bob', 'cara'][index], `topology-${index}`);
  assert.equal(f.personal.length, 3);
  await f.reopen(); await pause(50);
  assert.equal(f.personal.length, 3); assert.equal(f.room.executionBudget!.calls, calls); assert.equal(f.room.executionBudget!.id, scopeId);
  assert.equal(f.room.sharedRequirements.filter(item => item.status === 'accepted').length, 3);
  const replayStatus = (await f.manager.submitChanges(f.room, 'bob', 'topology-1')).status;
  assert.equal(replayStatus, 'queued', 'permanent replay retains the original acknowledged status');
  assert.equal(f.room.submissions.find(item => item.requestId === 'topology-1')!.status, 'queued');
  assert.equal(f.personal.length, 3);
  actualQueue = { captures: 3, accepted: 3, queueToProviderMs: f.personal.map((item, index) => item.start - captured[index]),
    captureToAcceptedMs: accepted, physicalCalls: calls, replayExtraCalls: 0, restartExtraCalls: 0,
    replayStatus, recoveredSubmissionStatus: 'queued',
    restartedReceipts: 'Completed interpretations and their receipts remain queued for a future explicit build; no automatic inference',
    builderSchedulingSuppressed: true, boundary: 'Actual RoomManager capture-order interpretation and local SQLite; no generated product' };
} finally { await f.close(); }

fs.writeFileSync(path.join(output, 'evaluation-core.json'), JSON.stringify({ trials, actualQueue }, null, 2) + '\n');
const currentBaseline = [];
for (let repeat = 1; repeat <= 3; repeat++) for (const scenario of ['simultaneous-slow', 'failed-interpreter'] as const) {
  console.log(JSON.stringify({ repeat, scenario, state: 'started' }));
  try { currentBaseline.push({ repeat, ...await runScenario(scenario) }); }
  catch (error) { currentBaseline.push({ repeat, scenario, failed: true, error: error instanceof Error ? error.message : String(error) }); }
  console.log(JSON.stringify({ repeat, scenario, passed: !('failed' in currentBaseline.at(-1)!) }));
}
const files = ['server/rooms.ts', 'server/generator.ts', 'server/intent-authority.ts', 'server/requirements.ts',
  'server/providers.ts', 'server/workflow-budget.ts', 'scripts/verify-interpretation-topology.ts'];
const report = { recordedAt: new Date().toISOString(), scope: 'Synthetic loopback provider, actual local capture queue/SQLite and existing native build baseline; no live provider/hosted/SQL/deployment',
  measurements: 'Elapsed monotonic request-to-reconciled projection; raw request/output byte sizes; oracle tokens=ceil(bytes/4), not measured model tokenization or invoices. Shared delay=max job delay is optimistic; two-worker offline memory reducer is not a durable production scheduler. Queue observation suppresses builder scheduling; baseline scenarios exercise native publication separately.',
  workload: Object.fromEntries(Object.entries(workloads).map(([name, jobs]) => [name, { captures: jobs.length, delaysMs: jobs.map(job => job.delayMs) }])),
  actualQueue, trials, currentBaseline, checks: { comparisonTrials: trials.length * 3, identicalProjections: true,
    reverseCompletionCaptureOrder: true, batchIdentitySourceGuards: true, baselineInvalidationExperimentOnly: true,
    runtimeReplayRestart: true, nativeBaselinePassed: currentBaseline.filter(row => !('failed' in row)).length,
    nativeBaselineTotal: currentBaseline.length },
  sourceHashes: Object.fromEntries(files.map(file => [file, createHash('sha256').update(fs.readFileSync(file)).digest('hex')])),
  decision: 'Retain production serial personal interpretation and one coordinator. Synthetic independent service delay benefits from concurrency; this does not establish material end-to-end production bottleneck or justify a durable speculative scheduler/shared model contract. No runtime concurrency/topology change.',
  pending: ['Step 08 whole regression gate remains open', 'Production queue/model latency, stale-baseline/reinterpretation frequency and cost per verified update',
    'Live shared-vs-personal quality with an authorized budget', 'Actual hosted SQL/Storage/accounts, Linux isolation and deployment'] };
fs.writeFileSync(path.join(output, 'evaluation.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ comparisonTrials: report.checks.comparisonTrials, actualQueue, nativeBaselinePassed: report.checks.nativeBaselinePassed,
  nativeBaselineTotal: report.checks.nativeBaselineTotal, report: 'artifacts/multiuser-step09/evaluation.json' }));
