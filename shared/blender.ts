/** Data only: no source code, paths, imports, URLs or runtime options. */
export type Vec3 = [number, number, number];
export type BlenderScene = {
  objects: Array<{ kind: 'cube' | 'sphere' | 'plane'; name: string; location: Vec3; scale: Vec3; color: Vec3 }>;
  camera: { location: Vec3; target: Vec3 };
  lights: Array<{ location: Vec3; energy: number }>;
};
export const BLENDER_OPERATIONS = ['create_scene', 'save', 'render'] as const;
export type BlenderOperation = typeof BLENDER_OPERATIONS[number];
export const BLENDER_VERSION = '4.5.14';
export const BLENDER_POLICY = 'windows-appcontainer-blender-v1';
export type BlenderResult = { blend: string; png: string; evidence: { policy: string; blenderVersion: string; commandId: string; sceneHash: string; cleanupVerified: boolean } };
export type BlenderFrozenInput = { participantId: string; fingerprint: string; specificationRevision: number; submissionIds: string[]; requirementRevisions: Array<{ id: string; revision: number }>; inputVersions: Array<{ artifactId: string; versionId: number; contentRef: string }> };
export type BlenderCommand = { id: string; sessionId: string; epoch: number; taskId: string; frozen: BlenderFrozenInput; scene: BlenderScene; state: 'queued' | 'running' | 'interrupted' | 'cancel_requested' | 'completed' | 'cancelled' | 'failed'; result?: BlenderResult; error?: string };
export type BlenderSessionView = {
  id: string; deviceId: string; deviceName: string; ownerId: string; controllerId: string; epoch: number;
  mode: 'human' | 'agent'; state: 'connected' | 'disconnected' | 'revoked' | 'expired';
  expiresAt: number; lastSeenAt: number; paused: boolean;
  observe: string[]; control: string[]; task?: Pick<BlenderCommand, 'id' | 'taskId' | 'state' | 'error'>;
};
export type BlenderVersion = {
  id: number; projectId: string; artifactId: string; title: string; taskId: string; participantId: string;
  submissionIds: string[]; specificationRevision: number; requirementRevisions: Array<{ id: string; revision: number }>;
  inputVersions: Array<{ artifactId: string; versionId: number; contentRef: string }>;
  fingerprint: string; contentRef: string; contentHash: string; byteLength: number; createdAt: string;
  outputs: { blend: { hash: string; byteLength: number }; png: { hash: string; byteLength: number } };
  evidence: BlenderResult['evidence'];
};
export type BlenderArtifact = { kind: 'blender'; id: string; title: string; projectId: string; versions: BlenderVersion[] };

const fail = (): never => { throw new Error('Unsupported Blender scene. Use bounded cubes, spheres, planes, colors, camera and lights; scripts, paths, URLs and imported files are unavailable.'); };
function object(value: unknown, keys: string[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).sort().join() !== [...keys].sort().join()) return fail();
  return value as Record<string, unknown>;
}
function vector(value: unknown, min: number, max: number): Vec3 {
  if (!Array.isArray(value) || value.length !== 3 || value.some(item => typeof item !== 'number' || !Number.isFinite(item) || item < min || item > max)) return fail();
  return [...value] as Vec3;
}
export function validateBlenderScene(value: unknown): BlenderScene {
  const scene = object(value, ['objects', 'camera', 'lights']);
  if (!Array.isArray(scene.objects) || scene.objects.length < 1 || scene.objects.length > 12 || !Array.isArray(scene.lights) || scene.lights.length < 1 || scene.lights.length > 3) return fail();
  const names = new Set<string>();
  const objects = scene.objects.map(item => {
    const obj = object(item, ['kind', 'name', 'location', 'scale', 'color']);
    if (typeof obj.kind !== 'string' || !['cube', 'sphere', 'plane'].includes(obj.kind) || typeof obj.name !== 'string' || !/^[A-Za-z0-9 _-]{1,40}$/.test(obj.name) || names.has(obj.name)) return fail();
    names.add(obj.name);
    return { kind: obj.kind as 'cube' | 'sphere' | 'plane', name: obj.name, location: vector(obj.location, -20, 20), scale: vector(obj.scale, 0.05, 10), color: vector(obj.color, 0, 1) };
  });
  const camera = object(scene.camera, ['location', 'target']);
  const location = vector(camera.location, -30, 30), target = vector(camera.target, -20, 20);
  if (location.every((axis, index) => Math.abs(axis - target[index]) < 0.01)) return fail();
  const lights = scene.lights.map(item => {
    const light = object(item, ['location', 'energy']);
    if (typeof light.energy !== 'number' || !Number.isFinite(light.energy) || light.energy < 1 || light.energy > 2000) return fail();
    return { location: vector(light.location, -20, 20), energy: light.energy };
  });
  return { objects, camera: { location, target }, lights };
}
export const blenderSceneSchema = {
  type: 'object', additionalProperties: false, required: ['objects', 'camera', 'lights'], properties: {
    objects: { type: 'array', minItems: 1, maxItems: 12, items: { type: 'object', additionalProperties: false, required: ['kind', 'name', 'location', 'scale', 'color'], properties: { kind: { type: 'string', enum: ['cube', 'sphere', 'plane'] }, name: { type: 'string' }, location: { $ref: '#/$defs/vector' }, scale: { $ref: '#/$defs/vector' }, color: { $ref: '#/$defs/vector' } } } },
    camera: { type: 'object', additionalProperties: false, required: ['location', 'target'], properties: { location: { $ref: '#/$defs/vector' }, target: { $ref: '#/$defs/vector' } } },
    lights: { type: 'array', minItems: 1, maxItems: 3, items: { type: 'object', additionalProperties: false, required: ['location', 'energy'], properties: { location: { $ref: '#/$defs/vector' }, energy: { type: 'number' } } } }
  }, $defs: { vector: { type: 'array', minItems: 3, maxItems: 3, items: { type: 'number' } } }
};
