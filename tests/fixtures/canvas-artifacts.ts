import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import * as Y from 'yjs';
import { createCoCreateServer } from '../../server/index.js';
import { createSession } from '../../server/auth.js';
import type { DurableStore } from '../../server/room-state.js';
import type { BlenderScene } from '../../shared/blender.js';

export async function createCanvasArtifactsFixture(options: { durableStore?: DurableStore; projectId?: string; client?: boolean } = {}) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'canvas-artifacts-'));
  const calls: Array<{ kind: 'interpretation' | 'document' | 'application' | 'blender'; input: any }> = [];
  const control = { fail: false, missingUsage: false, markdown: '', hold: false, release: undefined as undefined | (() => void), scene: {
    objects: [{ kind: 'cube', name: 'Blue cube', location: [0,0,1], scale: [1,1,1], color: [0.1,0.25,0.8] }, { kind: 'plane', name: 'Ground', location: [0,0,0], scale: [5,5,1], color: [0.65,0.65,0.65] }], camera: { location: [7,-9,6], target: [0,0,1] }, lights: [{ location: [2,-3,7], energy: 1000 }]
  } as BlenderScene };
  const provider = http.createServer(async (request, response) => {
    let raw = ''; for await (const chunk of request) raw += chunk;
    try {
      const body = JSON.parse(raw), input = JSON.parse(body.input || body.messages?.at(-1)?.content), schema = body.text?.format?.schema || body.response_format?.json_schema?.schema;
      const kind = schema?.required?.includes('goals') ? 'interpretation' : schema?.required?.includes('markdown') ? 'document' : schema?.required?.includes('objects') ? 'blender' : 'application';
      calls.push({ kind, input });
      if (kind !== 'interpretation' && control.hold) await new Promise<void>(resolve => { control.release = resolve; });
      if (kind === 'document' && control.fail) { response.writeHead(400).end(JSON.stringify({ error: { message: 'Controlled document failure' } })); return; }
      const text = kind === 'interpretation' ? input.authenticatedChanges.map((change: { after: string }) => change.after).join(' ') : '';
      const value = kind === 'interpretation' ? { goals: [text], features: [], design: [], constraints: [], questions: [], additions: [], modifications: [], withdrawals: [], classification: 'explicit_request', affectedRequirementIds: [], sourcePassages: [text],
        intents: [{ text, category: 'goal', classification: 'explicit_request', rationale: 'Controlled direct instruction', sourcePassage: text, affectedRequirementIds: [] }] } : kind === 'document' ? { markdown: control.markdown || `# ${input.title}\n\n${(input.requiredHeadings as string[]).map(heading => `## ${heading}\n\nControlled content.\n`).join('\n')}\nRevision of ${input.inputEvidence.length} frozen inputs.` } :
        kind === 'blender' ? control.scene : { operations: [{ type: 'write', path: 'src/App.tsx', content: 'export default function App(){return <main><h1>Controlled application</h1><p>Preserved preview.</p></main>}' }], summary: 'Controlled application', decisions: [], conflicts: [], specification: { agreed: [], proposed: [], questions: [] } };
      response.setHeader('content-type', 'application/json');
      response.end(JSON.stringify(body.messages ? { choices: [{ message: { content: JSON.stringify(value) }, finish_reason: 'stop' }], ...(!control.missingUsage ? { usage: { prompt_tokens: 10, completion_tokens: 20 } } : {}) } : { output: [{ content: [{ type: 'output_text', text: JSON.stringify(value) }] }], status: 'completed', ...(!control.missingUsage ? { usage: { input_tokens: 10, output_tokens: 20 } } : {}) }));
    } catch { if (!response.destroyed) response.writeHead(500).end(); }
  });
  await new Promise<void>(resolve => provider.listen(0, '127.0.0.1', resolve));
  const address = provider.address(); if (!address || typeof address === 'string') throw new Error('Fixture provider did not start.');
  const serverOptions = { dataDir, port: 0, host: '127.0.0.1', buildDebounceMs: 30, buildCooldownMs: 0, buildMaxWaitMs: 100, serveClient: options.client || false, sessionSecret: 'canvas-artifacts-synthetic', baseUrl: `http://127.0.0.1:${address.port}` };
  let service = await createCoCreateServer(serverOptions), manager = service.manager;
  // Use the production durable save path against the controlled private Storage fixture, when supplied.
  if (options.durableStore) (manager as any).config.durableStore = options.durableStore;
  const projectId = options.projectId || randomUUID();
  let room = manager.create(projectId), url = (await service.start()).url;
  for (const actor of ['alice', 'bob']) manager.join(room, actor, actor === 'alice' ? 'Alice' : 'Bob');
  const connection = await manager.saveConnection(room, { name: 'Controlled provider', provider: 'custom', baseUrl: `http://127.0.0.1:${address.port}`, apiFormat: 'responses', apiKey: 'synthetic' });
  room.ai.connections![0].checks.controlled = { reachable: { status: 'passed' }, text: { status: 'passed' }, personal: { status: 'passed' }, builder: { status: 'passed' } };
  await manager.assignAI(room, { connectionId: connection.id, model: 'controlled' }, { connectionId: connection.id, model: 'controlled' });
  await room.persistQueue;
  const token = (actor: string) => createSession('canvas-artifacts-synthetic', { roomId: room.id, participantId: actor, name: actor === 'alice' ? 'Alice' : 'Bob', role: actor === 'alice' ? 'owner' : 'editor' });
  const edit = (actor: string, text: string) => {
    const doc = new Y.Doc();
    try {
      Y.applyUpdate(doc, Y.encodeStateAsUpdate(room.doc)); const vector = Y.encodeStateVector(doc);
      const paragraph = new Y.XmlElement('paragraph'), value = new Y.XmlText();
      doc.transact(() => { doc.getXmlFragment('default').push([paragraph]); paragraph.push([value]); value.insert(0, text); });
      manager.handleMessage(room, { participantId: actor, readyState: 0, send() {}, close() {} } as never, Buffer.concat([Buffer.from([0]), Buffer.from(Y.encodeStateAsUpdate(doc, vector))]), true);
    } finally { doc.destroy(); }
  };
  return {
    get service() { return service; }, get manager() { return manager; }, get room() { return room; }, get url() { return url; }, calls, control, edit, token, dataDir,
    async submit(actor: string, text: string, requestId: string = randomUUID()) { edit(actor, text); return manager.submitChanges(room, actor, requestId); },
    async build() {
      clearTimeout(room.buildTimer); room.buildTimer = undefined;
      if (!room.buildTask) (manager as any).requestBuild(room);
      await room.buildTask; await room.persistQueue;
    },
    async reopen() { await service.stop(); service = await createCoCreateServer(serverOptions); manager = service.manager; room = manager.get(projectId)!; url = (await service.start()).url; return room; },
    async close() {
      control.release?.(); await service.stop(); provider.closeAllConnections(); await new Promise<void>(resolve => provider.close(() => resolve()));
      if (path.dirname(path.resolve(dataDir)) !== path.resolve(os.tmpdir()) || !path.basename(dataDir).startsWith('canvas-artifacts-')) throw new Error('Unsafe fixture cleanup.');
      try { fs.rmSync(dataDir, { recursive: true, force: true, maxRetries: 4, retryDelay: 100 }); }
      catch (error) {
        if (process.platform !== 'win32' || (error as NodeJS.ErrnoException).code !== 'EPERM') throw error;
        // Windows profile cleanup can fail in libuv after Chrome exit; native LiteralPath removal is bounded again inside PowerShell.
        const cleanup = "$target=[IO.Path]::GetFullPath($env:COCREATE_VERIFICATION_CLEANUP); if ([IO.Path]::GetDirectoryName($target) -ne [IO.Path]::GetFullPath($env:TEMP).TrimEnd('\\') -or -not [IO.Path]::GetFileName($target).StartsWith('canvas-artifacts-')) { throw 'Unsafe verification cleanup' }; Remove-Item -LiteralPath $target -Recurse -Force -ErrorAction Stop";
        execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-EncodedCommand',Buffer.from(cleanup,'utf16le').toString('base64')],{windowsHide:true,timeout:10_000,stdio:'pipe',env:{SystemRoot:process.env.SystemRoot||'C:\\Windows',TEMP:os.tmpdir(),COCREATE_VERIFICATION_CLEANUP:dataDir}});
      }
    },
  };
}
