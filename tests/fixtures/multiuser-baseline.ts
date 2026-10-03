import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { performance } from 'node:perf_hooks';
import * as Y from 'yjs';
import { RoomManager, type Room } from '../../server/rooms.js';
import { EventStore } from '../../server/event-store.js';
import { ToolRegistry } from '../../server/tool-registry.js';

export const scenarioNames = ['simultaneous-slow', 'failed-interpreter', 'later-steering',
  'continuous-arrivals', 'ambiguous-reference', 'invented-passage', 'incorrect-product',
  'snapshot-body-gap', 'projection-growth', 'isolation-policy', 'restart-budget'] as const;
export type ScenarioName = typeof scenarioNames[number];
type Attempt = { phase: 'interpretation' | 'builder'; ordinal: number; startMs: number; endMs?: number; actor?: string; queueMs?: number };
export type Observation = { scenario: ScenarioName; observations: Record<string, number | boolean | string>;
  attempts: { phase: string; queueMs?: number; providerMs: number }[];
  physicalAttempts: { phase: string; durationMs?: number; outcome: string; usageStatus: string }[];
  reportedUsage: { calls: number; inputTokens: number; outputTokens: number; unknownCalls: number } };
const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export async function until(check: () => boolean, label: string, timeoutMs = 10_000) {
  const end = performance.now() + timeoutMs;
  while (performance.now() < end) { if (check()) return; await pause(5); }
  throw new Error(`Baseline observation timed out: ${label}`);
}
function removeScoped(target: string, parent: string) {
  const resolved = path.resolve(target), scope = path.resolve(parent);
  if (!resolved.startsWith(scope + path.sep)) throw new Error('Fixture cleanup escaped its scope');
  fs.rmSync(resolved, { recursive: true, force: true });
}
const interpretation = (text: string) => ({ goals: [text], features: [], design: [], constraints: [], questions: [],
  additions: [], modifications: [], withdrawals: [], classification: 'explicit_request', affectedRequirementIds: [],
  sourcePassages: [text], intents: [{ text, category: 'goal', classification: 'explicit_request',
    rationale: 'Controlled fixture', sourcePassage: text, affectedRequirementIds: [] }] });
const plan = () => ({ operations: [{ type: 'write', path: 'src/App.tsx',
  content: 'export default function App(){return <main>Fixture without requested filter</main>}' }],
  summary: 'Controlled candidate', decisions: [], conflicts: [], specification: { agreed: [], proposed: [], questions: [] } });

/** Observations only: no runtime hook, prompt logging, provider credentials or external requests. */
export async function runScenario(scenario: ScenarioName): Promise<Observation> {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'multiuser-baseline-'));
  const roomId = `baseline-${crypto.randomUUID()}`;
  const started = performance.now(), attempts: Attempt[] = [], captures = new Map<string, number>();
  const gates = new Map<number, () => void>();
  let builderCount = 0, interpretationCount = 0, manager: RoomManager | undefined, room: Room | undefined;
  const provider = http.createServer(async (req, res) => {
    try {
      let raw = ''; for await (const chunk of req) raw += chunk;
      const body = JSON.parse(raw), input = JSON.parse(body.input);
      const personal = body.text.format.schema.required.includes('goals');
      const attempt: Attempt = { phase: personal ? 'interpretation' : 'builder',
        ordinal: personal ? ++interpretationCount : ++builderCount, startMs: performance.now() - started,
        actor: personal ? input.participantName : undefined };
      if (attempt.actor && captures.has(attempt.actor)) attempt.queueMs = attempt.startMs - captures.get(attempt.actor)!;
      attempts.push(attempt);
      if (scenario === 'simultaneous-slow' && personal && attempt.actor === 'Alice') await pause(80);
      if (personal && scenario === 'failed-interpreter' && attempt.actor === 'Alice') {
        attempt.endMs = performance.now() - started;
        res.writeHead(400, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: { message: 'maximum context length exceeded' } })); return;
      }
      if (!personal && (scenario === 'later-steering' || scenario === 'continuous-arrivals')) {
        await new Promise<void>(resolve => gates.set(attempt.ordinal, resolve));
      }
      const authored = personal ? input.authenticatedChanges.map((item: { after: string }) => item.after).join(' ') : '';
      // Deliberately incorrect provider output exposes current acceptance/promotion gaps.
      const value = personal ? interpretation(scenario === 'invented-passage' ? 'Build a private billing dashboard' : authored) : plan();
      attempt.endMs = performance.now() - started;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ output: [{ content: [{ type: 'output_text', text: JSON.stringify(value) }] }],
        status: 'completed', usage: { input_tokens: 10, output_tokens: 20 } }));
    } catch { res.writeHead(500); res.end(); }
  });
  await new Promise<void>(resolve => provider.listen(0, '127.0.0.1', resolve));
  const baseUrl = `http://127.0.0.1:${(provider.address() as { port: number }).port}`;
  const createManager = () => new RoomManager({ dataDir: temp, debounceMs: 10, buildDebounceMs: 20,
    buildCooldownMs: 0, buildMaxWaitMs: 100, encryptionSecret: 'synthetic-baseline' });
  const observations: Observation['observations'] = {};
  try {
    manager = createManager(); room = manager.create(roomId);
    for (const [id, name] of [['alice', 'Alice'], ['bob', 'Bob'], ['cara', 'Cara']]) manager.join(room, id, name);
    const connection = (await manager.saveConnection(room, { name: 'Controlled baseline', provider: 'custom',
      baseUrl, apiFormat: 'responses', apiKey: 'synthetic' })).id;
    room.ai.connections![0].checks.fixture = { reachable: { status: 'passed' }, text: { status: 'passed' },
      personal: { status: 'passed' }, builder: { status: 'passed' } };
    await manager.assignAI(room, { connectionId: connection, model: 'fixture' }, { connectionId: connection, model: 'fixture' });
    const edit = (id: string, text: string) => {
      const doc = new Y.Doc();
      try {
        Y.applyUpdate(doc, Y.encodeStateAsUpdate(room!.doc)); const vector = Y.encodeStateVector(doc);
        const paragraph = new Y.XmlElement('paragraph'), value = new Y.XmlText();
        doc.transact(() => { doc.getXmlFragment('default').push([paragraph]); paragraph.push([value]); value.insert(0, text); });
        manager!.handleMessage(room!, { participantId: id, readyState: 0, send() {}, close() {} } as never,
          Buffer.concat([Buffer.from([0]), Buffer.from(Y.encodeStateAsUpdate(doc, vector))]), true);
      } finally { doc.destroy(); }
    };
    const submit = (id: string, key: string) => {
      captures.set(id === 'alice' ? 'Alice' : 'Bob', performance.now() - started);
      return manager!.submitChanges(room!, id, key);
    };
    const drain = () => until(() => !!room!.versions.length && !room!.buildTask &&
      room!.submissions.every(item => item.status === 'built' || item.status === 'failed'), 'finite workload drain');

    if (scenario === 'simultaneous-slow' || scenario === 'failed-interpreter') {
      edit('alice', 'Build a catalog'); edit('bob', 'Add favorites'); edit('cara', 'Add unsubmitted filters');
      assert.equal(attempts.length, 0, 'typing has no inference');
      const result = await Promise.allSettled([submit('alice', 'request-a'), submit('bob', 'request-b')]);
      assert.deepEqual(attempts.filter(a => a.phase === 'interpretation').map(a => a.actor), ['Alice', 'Bob']);
      await drain();
      observations.failedSubmissions = result.filter(r => r.status === 'rejected').length;
      observations.acceptedCount = room.sharedRequirements.filter(r => r.status === 'accepted').length;
      observations.unsubmittedDraftRetained = room.pending.has('cara');
      assert.equal(observations.acceptedCount, scenario === 'failed-interpreter' ? 1 : 2);
      assert.equal(observations.failedSubmissions, scenario === 'failed-interpreter' ? 1 : 0);
      assert.equal(observations.unsubmittedDraftRetained, true);
      if (scenario === 'failed-interpreter') assert.equal(room.pending.get('alice')?.length, 1);
      const calls = attempts.length; await manager.submitChanges(room, 'bob', 'request-b');
      assert.equal(attempts.length, calls, 'duplicate command is inference-free');
      observations.duplicateExtraCalls = attempts.length - calls;
    } else if (scenario === 'later-steering' || scenario === 'continuous-arrivals') {
      const arrivals = scenario === 'later-steering' ? 2 : 5;
      edit('alice', 'Build initial catalog'); await submit('alice', 'request-0');
      await until(() => gates.has(1), 'first candidate started');
      for (let i = 1; i < arrivals; i++) {
        edit('bob', `Add feature number ${i}`); await submit('bob', `request-${i}`);
        const before: number = room.versions.length; gates.get(i)!();
        await until(() => gates.has(i + 1), 'superseding candidate started');
        assert.equal(room.versions.length, before, 'stale candidates cannot promote');
      }
      observations.promotionsWhileArriving = room.versions.length;
      observations.callsBeforeFinalRelease = room.executionBudget?.calls || 0;
      assert.equal(observations.callsBeforeFinalRelease, arrivals, 'supersession did not reset executor calls');
      gates.get(arrivals)!(); await drain();
      const tasks = manager.view(room).workflow.tasks;
      observations.arrivals = arrivals; observations.staleCandidates = tasks.filter(t => t.state === 'stale').length;
      observations.finalPromotions = room.versions.length;
      assert.equal(observations.staleCandidates, arrivals - 1); assert.equal(room.versions.length, 1);
      assert.equal(room.submissions.filter(s => s.status === 'built').length, arrivals);
    } else if (scenario === 'ambiguous-reference' || scenario === 'invented-passage' || scenario === 'incorrect-product') {
      const text = scenario === 'ambiguous-reference' ? 'Make that blue' : scenario === 'invented-passage' ?
        'How should we discuss styling?' : 'Build a catalog with a working filter';
      edit('alice', text); await submit('alice', 'request-one');
      if(scenario==='incorrect-product')await drain();else await until(()=>!room!.buildTask&&!room!.buildTimer,'unverified intent stays outside build');
      observations.acceptedCount = room.sharedRequirements.filter(r => r.status === 'accepted').length;
      observations.functionalVerified = room.aiRuns.at(-1)?.verification.verified||false;
      observations.compilationPassed = room.aiRuns.at(-1)?.verification.compilationPassed||false;
      assert.equal(observations.acceptedCount, scenario==='incorrect-product'?1:0); assert.equal(observations.functionalVerified, false);
      if (scenario === 'ambiguous-reference') {
        observations.unresolvedReferenceAccepted = room.sharedRequirements.some(item=>item.description===text&&item.status==='accepted');
        assert.equal(observations.unresolvedReferenceAccepted, false);assert.equal(builderCount,0);assert.equal(room.participants.get('alice')?.latest?.intents?.[0].validation?.status,'needs_clarification');
      } else if (scenario === 'invented-passage') {
        observations.passageAbsentFromCapturedEdits = !text.includes(room.sharedRequirements[0].sources[0].passages[0]);
        assert.equal(observations.passageAbsentFromCapturedEdits, true);assert.equal(builderCount,0);assert.equal(room.sharedRequirements[0].status,'proposed');
        assert.ok(room.sharedRequirements[0].sources.every(s => s.participantId === 'alice'), 'provider cannot invent another author');
      } else {
        observations.filterControlAbsentFromSource = !room.versions.at(-1)!.files!.some(f => /<input|<select/.test(f.content));
        assert.equal(observations.filterControlAbsentFromSource, true);
      }
    } else if (scenario === 'snapshot-body-gap') {
      const artifact = manager.eventStore.writeArtifact('synthetic archival body', 'text/plain');
      manager.eventStore.append({ workspaceId: roomId, actorId: 'fixture', actorType: 'system',
        eventType: 'fixture.artifact', artifactRef: artifact.ref });
      const projection = manager.eventStore.exportHarness(roomId);
      const freshDir = fs.mkdtempSync(path.join(os.tmpdir(), 'multiuser-baseline-restore-'));
      const fresh = new EventStore(freshDir);
      try {
        fresh.restoreHarness(roomId, projection);
        observations.referenceRestored = fresh.eventsForWorkspace(roomId).some(e => e.artifactRef === artifact.ref);
        observations.bodyRestored = fresh.readArtifact(artifact.ref) !== null;
        observations.projectionBytes = Buffer.byteLength(JSON.stringify(projection));
        assert.equal(observations.referenceRestored, true); assert.equal(observations.bodyRestored, false);
      } finally { fresh.close(); removeScoped(freshDir, os.tmpdir()); }
    } else if (scenario === 'projection-growth') {
      for (const count of [0, 10, 50]) {
        const current = manager.eventStore.eventsForWorkspace(roomId).filter(e => e.eventType === 'fixture.history').length;
        for (let i = current; i < count; i++) manager.eventStore.append({ workspaceId: roomId,
          actorId: 'fixture', actorType: 'system', eventType: 'fixture.history', payload: { sequence: i } });
        const projection = manager.eventStore.exportHarness(roomId);
        observations[`bytesAt${count}`] = Buffer.byteLength(JSON.stringify(projection));
        observations[`historyEventsAt${count}`] = projection.events.filter(e => (e as { event_type: string }).event_type === 'fixture.history').length;
        assert.equal(observations[`historyEventsAt${count}`], count);
      }
      assert.ok(Number(observations.bytesAt50) > Number(observations.bytesAt10));
    } else if (scenario === 'isolation-policy') {
      const tools = new ToolRegistry(manager.eventStore).list();
      observations.toolCount = tools.length;
      observations.allHostProcess = tools.every(t => t.environment === 'host-process-restricted-api');
      observations.allCancellationBeforeStart = tools.every(t => t.cancellation === 'before-start-only');
      observations.compilerIsolated=tools.find(tool=>tool.name==='project.bundle')?.environment==='isolated-process';
      observations.compilerCancellable=tools.find(tool=>tool.name==='project.bundle')?.cancellation==='during-execution';
      assert.equal(observations.allHostProcess, false); assert.equal(observations.allCancellationBeforeStart, false);
      assert.equal(observations.compilerIsolated,true);assert.equal(observations.compilerCancellable,true);
    } else {
      room.executionBudget = { calls: 23, reservedUsd: 1, maximumUsd: 2 };
      manager.save(room); manager.shutdown(); manager = createManager(); room = manager.get(roomId)!;
      observations.executorBudgetRestored = room.executionBudget !== undefined;
      assert.equal(observations.executorBudgetRestored, false);
      observations.automaticInferenceOnRestart = attempts.length;
      assert.equal(observations.automaticInferenceOnRestart, 0);
    }
    const events = manager.eventStore.eventsForWorkspace(roomId);
    const promoted = events.filter(e => e.eventType === 'product.promoted').at(-1);
    const accepted = events.filter(e => e.eventType === 'requirement.registry_reconciled').at(-1);
    if (promoted && accepted) observations.lastAcceptedToPromotionMs = Date.parse(promoted.occurredAt) - Date.parse(accepted.occurredAt);
    observations.promotedVersions = room.versions.length;
    const usage = manager.view(room).physicalUsage;
    return { scenario, observations, attempts: attempts.map(a => ({ phase: a.phase,
      ...(a.queueMs !== undefined ? { queueMs: a.queueMs } : {}),
      providerMs: Math.max(0, (a.endMs ?? performance.now() - started) - a.startMs) })),
      physicalAttempts: manager.eventStore.allProviderRequestRecordsForWorkspace(roomId).map(call => ({
        phase: call.purpose, ...(call.endedAt ? { durationMs: Date.parse(call.endedAt) - Date.parse(call.startedAt) } : {}),
        outcome: call.outcome, usageStatus: call.usageStatus })),
      reportedUsage: { calls: usage.recorded.requests, inputTokens: usage.recorded.inputTokens,
        outputTokens: usage.recorded.outputTokens, unknownCalls: usage.unknownUsageRequests } };
  } finally {
    for (const release of gates.values()) release();
    manager?.shutdown();
    await new Promise<void>(resolve => provider.close(() => resolve()));
    removeScoped(temp, os.tmpdir());
    removeScoped(path.join(process.cwd(), 'generated', 'rooms', roomId), path.join(process.cwd(), 'generated', 'rooms'));
  }
}
