import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { randomUUID } from 'node:crypto';
import { executeBlender } from '../server/blender-executor.js';
import type { BlenderScene } from '../shared/blender.js';

const executable = process.env.COCREATE_BLENDER_EXECUTABLE;
if (!executable) throw new Error('Set COCREATE_BLENDER_EXECUTABLE to the approved portable Blender 4.5.14 executable.');
const workspace = path.resolve('.runtime/blender-verification');
fs.mkdirSync(workspace, { recursive: true });
const outside = path.resolve('.runtime/blender-private-' + randomUUID());
fs.writeFileSync(outside, 'test-only-private-sentinel', { flag: 'wx' });
const server = net.createServer(socket => socket.end());
await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
process.env.COCREATE_TEST_SECRET = 'test-only-secret';
const port = (server.address() as net.AddressInfo).port;
try {
  const probe = await executeBlender({ executable, workspace, commandId: randomUUID(), probe: { outside, port } });
  console.log(JSON.stringify({ isolation: probe.probe, diagnostics: probe.diagnostics }));
  const scene: BlenderScene = {
    objects: [
      { kind: 'cube', name: 'Blue cube', location: [0,0,1], scale: [1,1,1], color: [0.1,0.25,0.8] },
      { kind: 'sphere', name: 'Orange sphere', location: [2,0,0.7], scale: [0.7,0.7,0.7], color: [0.9,0.25,0.08] },
      { kind: 'plane', name: 'Ground', location: [0,0,0], scale: [5,5,1], color: [0.65,0.65,0.65] }
    ], camera: { location: [7,-9,6], target: [0.5,0,0.8] }, lights: [{ location: [2,-3,7], energy: 1000 }]
  };
  const run = await executeBlender({ executable, workspace, commandId: randomUUID(), scene });
  if (!run.result) throw new Error('Missing real scene/render');
  console.log(JSON.stringify({ workspace: run.workspace, sceneBytes: Buffer.from(run.result.blend, 'base64').length, pngBytes: Buffer.from(run.result.png, 'base64').length, evidence: run.result.evidence, diagnostics: run.diagnostics }));
} finally {
  server.close(); fs.unlinkSync(outside); delete process.env.COCREATE_TEST_SECRET;
}
