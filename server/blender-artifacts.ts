import { BLENDER_POLICY, BLENDER_VERSION, type BlenderArtifact, type BlenderResult, type BlenderVersion } from '../shared/blender.js';
import { artifactHash, canonicalJson, ArtifactUnavailableError } from './artifacts.js';

export const BLENDER_MIME = 'application/vnd.cocreate.blender+json';
function binary(value: unknown, limit: number) {
  if (typeof value !== 'string' || value.length > Math.ceil(limit / 3) * 4 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) throw new Error('Invalid bounded Blender output.');
  const bytes = Buffer.from(value, 'base64');
  if (!bytes.length || bytes.length > limit) throw new Error('Blender output exceeded its byte limit.');
  return bytes;
}
export function checkBlenderResult(value: unknown, commandId: string, sceneHash: string) {
  const result = value as BlenderResult;
  if (!result || Object.keys(result).sort().join() !== ['blend','png','evidence'].sort().join() || result.evidence?.policy !== BLENDER_POLICY || result.evidence.blenderVersion !== BLENDER_VERSION || result.evidence.commandId !== commandId || result.evidence.sceneHash !== sceneHash || result.evidence.cleanupVerified !== true) throw new Error('Blender execution evidence does not match the frozen command.');
  const blend = binary(result.blend, 4 * 1024 ** 2), png = binary(result.png, 1024 * 1024);
  if (blend.length < 12 || blend.subarray(0,7).toString() !== 'BLENDER' || !['_','-'].includes(String.fromCharCode(blend[7])) || !['v','V'].includes(String.fromCharCode(blend[8])) || blend.subarray(9,12).toString() !== '405' || png.length < 45 || !png.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) || png.subarray(12,16).toString() !== 'IHDR' || png.readUInt32BE(16) !== 512 || png.readUInt32BE(20) !== 512 || png.subarray(-8,-4).toString() !== 'IEND') throw new Error('Expected Blender 4.5 scene and 512 × 512 PNG output.');
  return { result: structuredClone(result), blend, png, outputs: { blend: { hash: artifactHash(blend), byteLength: blend.length }, png: { hash: artifactHash(png), byteLength: png.length } } };
}
export function blenderBytes(projectId: string, artifactId: string, versionId: number, result: BlenderResult) {
  return Buffer.from(canonicalJson({ schemaVersion: 1, projectId, artifactId, versionId, kind: 'blender', result }));
}
export function restoreBlender(bytes: Uint8Array, version: BlenderVersion) {
  try {
    if (artifactHash(bytes) !== version.contentHash || bytes.length !== version.byteLength) throw new Error();
    const value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (value.schemaVersion !== 1 || value.kind !== 'blender' || value.projectId !== version.projectId || value.artifactId !== version.artifactId || value.versionId !== version.id) throw new Error();
    const checked = checkBlenderResult(value.result, version.evidence.commandId, version.evidence.sceneHash);
    if (canonicalJson(checked.outputs) !== canonicalJson(version.outputs) || canonicalJson(value.result.evidence) !== canonicalJson(version.evidence)) throw new Error();
    return checked;
  } catch { throw new ArtifactUnavailableError('corrupt'); }
}
export function snapshotBlender(snapshot: Record<string, unknown>, projectId: string): BlenderArtifact[] {
  if (snapshot.blenderArtifacts !== undefined && !Array.isArray(snapshot.blenderArtifacts) || [3,4,5].includes(snapshot.artifactContractVersion as number) && !Array.isArray(snapshot.blenderArtifacts)) throw new ArtifactUnavailableError('corrupt');
  const artifacts = snapshot.blenderArtifacts || [];
  if (!Array.isArray(artifacts) || (artifacts.length && ![3,4,5].includes(snapshot.artifactContractVersion as number))) throw new ArtifactUnavailableError('corrupt');
  const ids = new Set<string>();
  for (const artifact of artifacts) {
    if (!artifact || artifact.kind !== 'blender' || artifact.projectId !== projectId || !/^blend_[a-f0-9]{24}$/.test(artifact.id) || ids.has(artifact.id) || typeof artifact.title !== 'string' || !artifact.title.trim() || artifact.title.length > 120 || !Array.isArray(artifact.versions)) throw new ArtifactUnavailableError('corrupt');
    ids.add(artifact.id);
    let prior = 0;
    for (const version of artifact.versions) {
      if (!version || !Number.isSafeInteger(version.id) || version.id <= prior || version.projectId !== projectId || version.artifactId !== artifact.id || version.title !== artifact.title || !/^[a-f0-9-]{36}$/.test(version.taskId) || typeof version.participantId !== 'string' || !version.participantId || !Array.isArray(version.submissionIds) || version.submissionIds.some((id: unknown) => typeof id !== 'string') || !Array.isArray(version.requirementRevisions) || version.requirementRevisions.some((ref: any) => typeof ref.id !== 'string' || !Number.isSafeInteger(ref.revision) || ref.revision < 1) || !Array.isArray(version.inputVersions) || version.inputVersions.some((ref: any) => typeof ref.artifactId !== 'string' || !Number.isSafeInteger(ref.versionId) || ref.versionId < 1 || !/^sha256:[a-f0-9]{64}$/.test(ref.contentRef)) || !Number.isSafeInteger(version.specificationRevision) || version.specificationRevision < 0 || typeof version.fingerprint !== 'string' || !Number.isFinite(Date.parse(version.createdAt)) || !Number.isSafeInteger(version.byteLength) || version.byteLength < 1 || version.byteLength > 8 * 1024 ** 2 || !/^[a-f0-9]{64}$/.test(version.contentHash) || version.contentRef !== `sha256:${version.contentHash}` || version.evidence?.policy !== BLENDER_POLICY || version.evidence.blenderVersion !== BLENDER_VERSION || version.evidence.cleanupVerified !== true || !/^[a-f0-9-]{36}$/.test(version.evidence.commandId) || !/^[a-f0-9]{64}$/.test(version.evidence.sceneHash)) throw new ArtifactUnavailableError('corrupt');
      for (const kind of ['blend','png'] as const) if (!version.outputs?.[kind] || !/^[a-f0-9]{64}$/.test(version.outputs[kind].hash) || !Number.isSafeInteger(version.outputs[kind].byteLength) || version.outputs[kind].byteLength < 1 || version.outputs[kind].byteLength > (kind === 'blend' ? 4 : 1) * 1024 ** 2) throw new ArtifactUnavailableError('corrupt');
      prior = version.id;
    }
  }
  return artifacts;
}
