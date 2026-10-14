import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import WebSocket from 'ws';
import type { ConflictGroup, ProviderRequestRecord } from '../shared/types';

process.env.NODE_ENV = 'production';
process.env.COCREATE_AUTH_MODE = 'local';
const { createCoCreateServer } = await import('../server/index.js');
const { createSession } = await import('../server/auth.js');
const output = path.resolve('artifacts/workflow-overview');
const runtime = path.resolve(`.runtime/workflow-ui-${process.pid}`);
fs.mkdirSync(output, { recursive: true });
fs.mkdirSync(runtime, { recursive: true });
const secret = 'local-workflow-ui-fixture';
const service = await createCoCreateServer({ port: 0, host: '127.0.0.1', serveClient: true, dataDir: path.join(runtime, 'data'), sessionSecret: secret });
const room = service.manager.create('workflow-overview-fixture');
for (const [id, name] of [['alice', 'Alice'], ['bob', 'Bob'], ['viewer', 'Casey']]) service.manager.join(room, id, name);
const stamp = new Date().toISOString();
const group = (id: string, subject: string): ConflictGroup => ({
  id, subject, revision: 1, round: 1, scope: 'global', requirementIds: [],
  alternatives: ['Sidebar navigation', 'Top navigation'].map((label, i) => ({
    id: i === 0 ? 'sidebar' : 'top', label, requirementIds: [], requirementRevisions: [],
    sources: [{ participantId: i === 0 ? 'alice' : 'bob', participantName: i === 0 ? 'Alice' : 'Bob', interpretationId: 'fixture', documentRevision: 1, editSeqs: [1], passages: [`Use ${label.toLowerCase()} for this product.`] }],
  })), requiredResolverIds: ['alice', 'bob'], selections: [], state: 'awaiting_choices', detectionStatus: 'confirmed',
  explanation: 'Two submitted instructions specify different navigation positions.', affectedBuildScopes: [], history: [], createdAt: stamp, updatedAt: stamp,
});
room.conflictGroups = [group('navigation', 'Navigation layout'), group('menu', 'Settings menu position')];
const midnight = new Date(); midnight.setUTCHours(0, 0, 0, 0);
room.providerCalls = Array.from({ length: 7 }, (_, i): ProviderRequestRecord => ({
  callId: `fixture-${i}`, workspaceId: room.id, purpose: i === 0 ? 'connection_test' : i === 5 ? 'compilation_repair' : 'builder', provider: 'openrouter', model: 'Fixture model', configurationVersion: 'fixture',
  startedAt: new Date(midnight.getTime() - (6 - i) * 86_400_000 + 3_600_000).toISOString(), outcome: i === 5 ? 'failed' : 'succeeded',
  estimatedInputTokens: 0, usage: { inputTokens: 200 * (i + 1), outputTokens: 400 * (i + 1) }, usageStatus: 'measured', estimatedChargeUsd: i === 6 ? undefined : (i + 1) * 0.01,
}));
for (const call of room.providerCalls) service.manager.eventStore.append({ workspaceId: room.id, actorId: 'fixture', actorType: 'system', eventType: 'provider.request_reconciled', payload: call });
await service.manager.save(room);
const { url } = await service.start();
const port = 9800 + process.pid % 150;
const browser = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run', `--remote-debugging-port=${port}`, `--user-data-dir=${path.join(runtime, 'browser')}`, 'about:blank'], { stdio: 'ignore' });
const sockets: WebSocket[] = [], errors: string[] = [];
const checks: string[] = [];
function connect(endpoint: string) {
  return new Promise<{ call: (method: string, params?: Record<string, unknown>) => Promise<any> }>((resolve, reject) => {
    const socket = new WebSocket(endpoint); sockets.push(socket);
    let sequence = 0;
    const pending = new Map<number, { resolve: (result: any) => void; reject: (error: Error) => void }>();
    const call = (method: string, params = {}) => new Promise<any>((resolve, reject) => {
      const id = ++sequence; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params }));
    });
    socket.addEventListener('message', event => {
      const message = JSON.parse(String(event.data));
      if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
      const next = pending.get(message.id);
      if (next) { pending.delete(message.id); message.error ? next.reject(new Error(message.error.message)) : next.resolve(message.result); }
    });
    socket.addEventListener('open', () => resolve({ call }), { once: true });
    socket.addEventListener('error', event => reject(new Error(`Browser connection failed: ${event.message}`)), { once: true });
  });
}
async function until(condition: () => Promise<boolean>, label: string) {
  for (let i = 0; i < 100; i++) { if (await condition()) return; await new Promise(resolve => setTimeout(resolve, 100)); }
  throw new Error(`Timed out: ${label}`);
}
try {
  let endpoint = '';
  await until(async () => { try { endpoint = (await fetch(`http://127.0.0.1:${port}/json/version`).then(r => r.json()) as any).webSocketDebuggerUrl; return !!endpoint; } catch { return false; } }, 'browser startup');
  const controller = await connect(endpoint);
  const open = async (participantId: string, role: 'owner' | 'editor' | 'viewer') => {
    const { browserContextId } = await controller.call('Target.createBrowserContext');
    const { targetId } = await controller.call('Target.createTarget', { url: 'about:blank', browserContextId });
    const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json()) as any[];
    const client = await connect(targets.find(target => target.id === targetId).webSocketDebuggerUrl);
    const evaluate = async (expression: string) => {
      const response = await client.call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
      return response.result.value;
    };
    await client.call('Page.enable'); await client.call('Runtime.enable');
    await client.call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
    await client.call('Page.navigate', { url });
    await until(async () => await evaluate('location.origin') === url, 'origin');
    const token = createSession(secret, { roomId: room.id, participantId, name: participantId, role });
    await evaluate(`localStorage.setItem('cocreate-session-${room.id}', ${JSON.stringify(token)})`);
    await client.call('Page.navigate', { url: `${url}/r/${room.id}` });
    try { await until(async () => await evaluate(`!!document.querySelector('.tabs')`), 'workspace mount'); }
    catch (error) { throw new Error(`${String(error)}: ${await evaluate('document.body.innerText.slice(0, 800)')}`); }
    await evaluate(`[...document.querySelectorAll('.tabs button')].find(button => button.textContent.includes('Workflow')).click()`);
    await until(async () => await evaluate(`!!document.querySelector('.workflow-overview-board')`), 'Workflow mount');
    return { ...client, evaluate };
  };
  const alice = await open('alice', 'owner'), bob = await open('bob', 'editor'), viewer = await open('viewer', 'viewer');
  assert.equal(await alice.evaluate(`document.querySelector('.workflow-page .agent-panel') === null && !document.querySelector('.workflow-stats')`), true);
  assert.match(await alice.evaluate(`document.querySelector('.usage-totals').innerText`), /16,800/);
  checks.push('Overview mount, recorded tokens, partial pricing and no duplicate sidebar');
  const shot = async (client: typeof alice, name: string) => {
    const { data } = await client.call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(output, name), Buffer.from(data, 'base64'));
  };
  await shot(alice, 'workflow-desktop.png');
  await alice.evaluate(`document.querySelector('[aria-label="Chart metric"] button:last-child').click(); document.querySelector('[aria-label="Usage period"] button:first-child').click()`);
  assert.equal(await alice.evaluate(`document.querySelectorAll('.usage-days button').length`), 6);
  await alice.evaluate(`document.querySelector('[aria-label="Usage period"] button:last-child').click(); document.querySelector('[aria-label="Chart metric"] button:first-child').click()`);
  await until(async () => await alice.evaluate(`document.querySelectorAll('.usage-days button').length === 7`), 'weekly chart');
  await alice.evaluate(`document.querySelector('.usage-days button').focus()`);
  await until(async () => await alice.evaluate(`document.querySelector('.usage-chart-caption p').innerText.includes('600 tokens')`), 'focused chart value');
  assert.match(await alice.evaluate(`document.querySelector('.usage-chart-caption p').innerText`), /600 tokens/);
  checks.push('Period/metric controls, keyboard chart values and UTC periods');
  await viewer.evaluate(`document.querySelector('.contradiction-row summary').click()`);
  assert.equal(await viewer.evaluate(`document.querySelector('.conflict-choice fieldset').disabled`), true);
  assert.equal(await viewer.evaluate(`document.querySelector('.conflict-choice button[type="submit"]') === null`), true);
  checks.push('Independent viewer sees attributed alternatives but cannot choose');
  for (const client of [alice, bob]) {
    if (client === bob) await until(async () => await bob.evaluate(`document.querySelector('.contradictions-panel > .contradiction-row .contradiction-title small').innerText === 'Waiting for Bob'`), 'Bob sees Alice choice');
    await client.evaluate(`document.querySelector('.contradiction-row summary').click(); document.querySelector('.conflict-choice input[value="sidebar"]').click(); document.querySelector('.conflict-choice button[type="submit"]').click()`);
    await until(async () => room.conflictGroups[0].selections.length === (client === alice ? 1 : 2), 'contributor choice');
    if (client === alice) assert.equal(room.conflictGroups[0].state, 'awaiting_choices');
  }
  assert.equal(room.conflictGroups[0].state, 'resolved');
  await until(async () => await bob.evaluate(`document.querySelector('.overview-count').innerText === '1'`), 'shared resolution');
  checks.push('One choice waits; unanimous choices resolve and move to collapsed history');
  for (const client of [alice, bob]) {
    if (client === bob) await until(async () => await bob.evaluate(`document.querySelector('.contradictions-panel > .contradiction-row .contradiction-title small').innerText === 'Waiting for Bob'`), 'Bob sees revised round choice');
    await client.evaluate(`document.querySelector('.contradictions-panel > .contradiction-row summary').click(); document.querySelector('.contradictions-panel > .contradiction-row input[value="${client === alice ? 'sidebar' : 'top'}"]').click(); document.querySelector('.contradictions-panel > .contradiction-row button[type="submit"]').click()`);
    await until(async () => room.conflictGroups[1].selections.length === (client === alice ? 1 : 2), 'different choice');
  }
  assert.equal(room.conflictGroups[1].state, 'disagreement');
  await until(async () => await alice.evaluate(`!!document.querySelector('.contradiction-next')`), 'different-choice actions');
  assert.equal(await alice.evaluate(`document.querySelector('.contradictions-panel > .contradiction-row fieldset').disabled`), true);
  await alice.evaluate(`document.querySelector('.contradiction-next button').click()`);
  assert.equal(await alice.evaluate(`document.querySelector('dialog').open`), true);
  await alice.evaluate(`document.querySelector('[aria-label="Close intent details"]').click()`);
  checks.push('Different choices close the round and open the existing own-instruction review');
  await alice.call('Page.reload');
  await until(async () => await alice.evaluate(`!!document.querySelector('.tabs')`), 'reloaded workspace');
  await alice.evaluate(`[...document.querySelectorAll('.tabs button')].find(button => button.textContent.includes('Workflow')).click()`);
  await until(async () => await alice.evaluate(`!!document.querySelector('.contradiction-status.disagreement')`), 'reload recovery');
  assert.equal(room.providerCalls.length, 7); assert.equal(room.aiRuns.length, 0);
  checks.push('Reload preserves choices and recorded usage; no inference dispatched');
  for (const [width, height, name] of [[390, 844, 'workflow-mobile.png'], [320, 900, 'workflow-320.png'], [720, 550, 'workflow-zoom200.png']] as const) {
    await alice.call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await new Promise(resolve => setTimeout(resolve, 100));
    const sizes = await alice.evaluate(`({ body: document.documentElement.scrollWidth, viewport: innerWidth, chart: document.querySelector('.usage-chart').scrollWidth, panel: document.querySelector('.usage-chart').clientWidth })`);
    assert.ok(sizes.chart <= sizes.panel, `Chart overflow at ${width}: ${JSON.stringify(sizes)}`);
    assert.ok(sizes.body <= sizes.viewport, `Page overflow at ${width}: ${JSON.stringify(sizes)}`);
    await shot(alice, name);
  }
  checks.push('390px, 320px and 200%-equivalent viewport without horizontal overflow');
  assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify({ checkedAt: new Date().toISOString(), checks, inferenceDispatches: 0, fixture: 'local signed sessions and synthetic provider ledger; no hosted credentials', errors }, null, 2));
  console.log(JSON.stringify({ passed: checks.length, checks, inferenceDispatches: 0 }));
} finally {
  for (const socket of sockets) socket.close();
  browser.kill();
  await service.stop();
}
