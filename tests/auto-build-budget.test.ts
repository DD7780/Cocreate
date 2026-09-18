import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import * as Y from 'yjs';
import { RoomManager } from '../server/rooms.js';

const waitFor = async (check: () => boolean, timeout = 5_000) => {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (check()) return;
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  throw new Error('Timed out waiting for automatic build state');
};

const response = (value: unknown, inputTokens: number, outputTokens: number) => ({
  output: [{ content: [{ type: 'output_text', text: JSON.stringify(value) }] }],
  usage: { input_tokens: inputTokens, output_tokens: outputTokens },
});

test('automatic builds coalesce typing, skip unchanged intent, and expose token usage', async () => {
  let personalCalls = 0;
  let builderCalls = 0;
  const personalBodies: any[] = [];
  const builderBodies: any[] = [];
  const fake = http.createServer(async (request, reply) => {
    let raw = '';
    for await (const chunk of request) raw += chunk;
    const body = JSON.parse(raw || '{}');
    const required = body.text?.format?.schema?.required || [];
    reply.writeHead(200, { 'Content-Type': 'application/json' });
    if (required.includes('goals')) {
      personalCalls++;
      personalBodies.push(body);
      reply.end(JSON.stringify(response({
        goals: ['Build a calm shared workspace'],
        features: ['Live collaborative canvas'],
        design: [],
        constraints: [],
        questions: [],
        additions: ['Keep automatic builds'],
        modifications: [],
        withdrawals: [],
        classification: 'explicit_request',
        affectedRequirementIds: [],
        sourcePassages: ['Build a calm shared workspace'],
        intents: [{text:'Build a calm shared workspace',category:'goal',classification:'explicit_request',rationale:'Direct build instruction.',sourcePassage:'Build a calm shared workspace',affectedRequirementIds:[]}],
      }, 13, 3)));
      return;
    }
    builderCalls++;
    builderBodies.push(body);
    reply.end(JSON.stringify(response({
      operations: [{
        type: 'write',
        path: 'src/App.tsx',
        content: "export default function App(){return <main>Automatic build</main>}",
      }],
      summary: 'Built the latest stable canvas revision',
      decisions: [],
      conflicts: [],
      specification: { agreed: ['Automatic builds'], proposed: [], questions: [] },
    }, 21, 5)));
  });
  await new Promise<void>(resolve => fake.listen(0, '127.0.0.1', resolve));
  const port = (fake.address() as { port: number }).port;
  const manager = new RoomManager({
    debounceMs: 80,
    buildDebounceMs: 100,
    buildCooldownMs: 0,
    buildMaxWaitMs: 500,
    encryptionSecret: 'automatic-build-budget-test',
    baseUrl: `http://127.0.0.1:${port}/v1`,
  });
  const room = manager.create(`automatic-build-${crypto.randomUUID()}`);
  const participant = manager.join(room, 'alice', 'Alice');
  const connectionId = (await manager.saveConnection(room, {
    name: 'Fake provider',
    provider: 'custom',
    baseUrl: `http://127.0.0.1:${port}/v1`,
    apiFormat: 'responses',
    apiKey: 'test-key',
  })).id;
  const checks = {
    reachable: { status: 'passed' as const },
    text: { status: 'passed' as const },
    personal: { status: 'passed' as const },
    builder: { status: 'passed' as const },
    checkedAt: new Date().toISOString(),
  };
  room.ai.connections!.find(connection => connection.id === connectionId)!.checks['test-model'] = checks;
  await manager.assignAI(room, { connectionId, model: 'test-model' }, { connectionId, model: 'test-model' });

  const local = new Y.Doc();
  const paragraph = new Y.XmlElement('paragraph');
  const text = new Y.XmlText();
  let initialized = false;
  const socket = { participantId: participant.id, readyState: 0, send() {} } as any;
  const typeLetter = (letter: string) => {
    const vector = Y.encodeStateVector(local);
    local.transact(() => {
      if (!initialized) {
        local.getXmlFragment('default').push([paragraph]);
        paragraph.push([text]);
        initialized = true;
      }
      text.insert(text.length, letter);
    });
    const update = Y.encodeStateAsUpdate(local, vector);
    manager.handleMessage(room, socket, Buffer.concat([Buffer.from([0]), Buffer.from(update)]), true);
  };

  try {
    for (const letter of 'automatic') {
      typeLetter(letter);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    await waitFor(() => room.versions.length === 1);
    assert.equal(personalCalls, 1, 'a typing burst should produce one personal-agent call');
    assert.equal(builderCalls, 1, 'a typing burst should produce one automatic build');
    assert.equal(personalBodies[0].max_output_tokens, 2_400);
    assert.equal(builderBodies[0].max_output_tokens, 6_000);
    assert.ok(JSON.parse(personalBodies[0].input).sharedBrainstormCanvas.length <= 6_000);
    assert.ok(JSON.parse(builderBodies[0].input).acceptedRequirements.length > 0);

    typeLetter('!');
    await waitFor(() => personalCalls === 2);
    await new Promise(resolve => setTimeout(resolve, 180));
    assert.equal(builderCalls, 1, 'semantically unchanged intent should not rebuild');
    assert.equal(room.status, 'Updated');
    assert.deepEqual(room.usage, {
      requests: 3,
      personalRequests: 2,
      builderRequests: 1,
      inputTokens: 47,
      outputTokens: 11,
    });

    await manager.buildNow(room);
    assert.equal(builderCalls, 2, 'Build now should bypass automatic-build suppression');
    assert.equal(room.versions.length, 2);
    assert.equal(room.usage.builderRequests, 2);
  } finally {
    manager.shutdown();
    local.destroy();
    await new Promise<void>(resolve => fake.close(() => resolve()));
  }
});
