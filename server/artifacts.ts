import { createHash } from 'node:crypto';
import type { Version, ProductSource } from '../src/types.js';
import { validateFiles, type ProjectFile, type ProjectSpec } from './project.js';
import type { EventStore } from './event-store.js';
export type ArtifactReference = {
    ref: string;
    byteLength: number;
    mimeType: string;
};
export type ArtifactBody = ArtifactReference & {
    base64: string;
};
export type ArtifactVersion = Version & {
    bundle: string;
    css?: string;
    source?: ProductSource;
    files?: ProjectFile[];
    decisions?: string[];
    specification?: ProjectSpec;
    artifactRef?: string;
};
export type ArchivedVersion = Version & {
    artifactRef: string;
    downloadable: boolean;
};
export type RecoveryCheckpoint = {
    fingerprint: string;
    revision: number;
    files: ProjectFile[];
    task: string;
    index: number;
    total: number;
    artifactRef?: string;
};
const maxBytes = 8 * 1024 * 1024;
export class ArtifactUnavailableError extends Error {
    readonly status = 409;
    readonly code = 'artifact_unavailable';
    constructor(readonly reason: 'missing' | 'corrupt' | 'unavailable') {
        super(`Stored product or checkpoint data is ${reason === 'corrupt' ? 'corrupt' : reason === 'missing' ? 'missing' : 'unavailable'}. Reopen the project to retry, or ask the owner to recover a verified backup. Reopening does not start a build automatically.`);
    }
}
export function artifactHash(bytes: Uint8Array) { return createHash('sha256').update(bytes).digest('hex'); }
export function canonicalJson(value: unknown): string {
    if (Array.isArray(value))
        return `[${value.map(canonicalJson).join(',')}]`;
    if (value && typeof value === 'object')
        return `{${Object.entries(value as Record<string, unknown>)
            .filter(([, item]) => item !== undefined).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
            .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(',')}}`;
    return JSON.stringify(value);
}
export function checkReference(value: unknown): ArtifactReference {
    const ref = value as Partial<ArtifactReference> | null;
    if (!ref || typeof ref.ref !== 'string' || !/^sha256:[a-f0-9]{64}$/.test(ref.ref) ||
        !Number.isSafeInteger(ref.byteLength) || Number(ref.byteLength) < 0 || Number(ref.byteLength) > maxBytes ||
        typeof ref.mimeType !== 'string' || ref.mimeType.length > 120)
        throw new ArtifactUnavailableError('corrupt');
    return { ref: ref.ref, byteLength: Number(ref.byteLength), mimeType: ref.mimeType };
}
export function artifactPath(projectId: string, reference: ArtifactReference) {
    if (!/^[A-Za-z0-9_-]{1,100}$/.test(projectId))
        throw new ArtifactUnavailableError('corrupt');
    return `${projectId}/bodies/${checkReference(reference).ref.slice(7)}`;
}
export function verifyArtifact(reference: ArtifactReference, bytes: Uint8Array) {
    const checked = checkReference(reference);
    if (bytes.byteLength !== checked.byteLength || artifactHash(bytes) !== checked.ref.slice(7))
        throw new ArtifactUnavailableError('corrupt');
    return Buffer.from(bytes);
}
export function decodeArtifactBody(body: ArtifactBody) {
    if (!body || typeof body.base64 !== 'string' || body.base64.length > Math.ceil(maxBytes / 3) * 4 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(body.base64))
        throw new ArtifactUnavailableError('corrupt');
    return verifyArtifact(body, Buffer.from(body.base64, 'base64'));
}
export function bodyFromBytes(bytes: Uint8Array, mimeType: string): ArtifactBody {
    const ref = { ref: `sha256:${artifactHash(bytes)}`, byteLength: bytes.byteLength, mimeType };
    checkReference(ref);
    return { ...ref, base64: Buffer.from(bytes).toString('base64') };
}
function withoutRef<T extends {
    artifactRef?: string;
}>(value: T) { const copy = { ...value }; delete copy.artifactRef; return copy; }
export function versionArtifactBytes(projectId: string, version: Pick<ArtifactVersion, 'id' | 'bundle' | 'css' | 'source' | 'files'>) {
    if (!version || !Number.isSafeInteger(version.id) || version.id < 1 || typeof version.bundle !== 'string' || (version.css !== undefined && typeof version.css !== 'string'))
        throw new ArtifactUnavailableError('corrupt');
    if (version.files !== undefined)
        checkFiles(version.files);
    return Buffer.from(canonicalJson({ schemaVersion: 1, projectId, kind: 'version', version: { id: version.id, bundle: version.bundle, css: version.css, source: version.source, files: version.files } }));
}
export function checkpointArtifactBytes(projectId: string, checkpoint: RecoveryCheckpoint) {
    const bytes = Buffer.from(canonicalJson({ schemaVersion: 1, projectId, kind: 'checkpoint', checkpoint: withoutRef(checkpoint) }));
    restoreCheckpoint(bytes, projectId, checkpoint);
    return bytes;
}
export function versionMetadata(version: ArtifactVersion): ArchivedVersion {
    if (!version.artifactRef)
        throw new ArtifactUnavailableError('corrupt');
    return { id: version.id, specificationRevision: version.specificationRevision, createdAt: version.createdAt, summary: version.summary, fileCount: version.fileCount,
        conflicts: version.conflicts, aiRun: version.aiRun, artifactRef: version.artifactRef, downloadable: !!version.files?.length };
}
export function versionStub(version: Record<string, unknown>) {
    const result = { ...version };
    for (const key of ['bundle', 'css', 'source', 'files'])
        delete result[key];
    return result;
}
function envelope(bytes: Uint8Array, projectId: string, kind: string): Record<string, unknown> {
    try {
        const value = JSON.parse(Buffer.from(bytes).toString('utf8'));
        if (!value || value.schemaVersion !== 1 || value.projectId !== projectId || value.kind !== kind)
            throw new Error();
        return value;
    }
    catch {
        throw new ArtifactUnavailableError('corrupt');
    }
}
function checkFiles(files: unknown): ProjectFile[] {
    try {
        if (!Array.isArray(files) || files.some(file => !file || typeof file.path !== 'string' || typeof file.content !== 'string') ||
            new Set(files.map(file => file.path)).size !== files.length)
            throw new Error();
        // Legacy archives can contain a partial source set. Validate their paths/content
        // under the same policy without requiring the modern entrypoint in that archive.
        validateFiles(files.some(file => file.path === 'src/main.tsx') ? files : [...files, { path: 'src/main.tsx', content: '' }]);
        return files;
    }
    catch {
        throw new ArtifactUnavailableError('corrupt');
    }
}
export function restoreVersion(bytes: Uint8Array, projectId: string, expected: ArchivedVersion | Record<string, unknown>): ArtifactVersion {
    const value = envelope(bytes, projectId, 'version').version as ArtifactVersion;
    if (!value || value.id !== expected.id || !Number.isSafeInteger(value.id) || value.id < 1 ||
        typeof value.bundle !== 'string' || typeof expected.summary !== 'string' || typeof expected.createdAt !== 'string' ||
        (value.css !== undefined && typeof value.css !== 'string'))
        throw new ArtifactUnavailableError('corrupt');
    if (value.files !== undefined)
        value.files = checkFiles(value.files);
    return { ...expected, ...value, artifactRef: String(expected.artifactRef) } as ArtifactVersion;
}
export function restoreCheckpoint(bytes: Uint8Array, projectId: string, expected: Record<string, unknown>): RecoveryCheckpoint {
    const value = envelope(bytes, projectId, 'checkpoint').checkpoint as RecoveryCheckpoint;
    if (!value || typeof value.fingerprint !== 'string' || !Number.isSafeInteger(value.revision) || value.revision < 0 ||
        typeof value.task !== 'string' || !Number.isSafeInteger(value.index) || !Number.isSafeInteger(value.total) ||
        value.index < 1 || value.total < 1 || value.total > 8 || value.index > value.total)
        throw new ArtifactUnavailableError('corrupt');
    for (const key of ['fingerprint', 'revision', 'task', 'index', 'total'] as const)
        if (value[key] !== expected[key])
            throw new ArtifactUnavailableError('corrupt');
    return { ...value, files: checkFiles(value.files), artifactRef: String(expected.artifactRef) };
}
/** Capture immutable bodies in the local cache; canonical publication happens later. */
export function captureArtifacts(room: {
    id: string;
    versions: ArtifactVersion[];
    recoveryCheckpoint?: RecoveryCheckpoint;
    artifactHistory?: ArchivedVersion[];
}, store: EventStore) {
    const history = new Map((room.artifactHistory || []).map(version => [version.id, version]));
    const refs: string[] = [];
    for (const version of room.versions) {
        const bytes = versionArtifactBytes(room.id, version);
        version.artifactRef = store.writeArtifact(bytes, 'application/vnd.cocreate.product+json').ref;
        refs.push(version.artifactRef);
        const prior = history.get(version.id);
        if (prior && prior.artifactRef !== version.artifactRef)
            throw new ArtifactUnavailableError('corrupt');
        history.set(version.id, versionMetadata(version));
    }
    if (room.recoveryCheckpoint) {
        const bytes = checkpointArtifactBytes(room.id, room.recoveryCheckpoint);
        room.recoveryCheckpoint.artifactRef = store.writeArtifact(bytes, 'application/vnd.cocreate.checkpoint+json').ref;
        refs.push(room.recoveryCheckpoint.artifactRef);
    }
    return { artifactHistory: [...history.values()].sort((a, b) => a.id - b.id), artifactBodies: store.artifactBodiesForWorkspace(room.id, refs) };
}
export function artifactResponse(res: import('express').Response, error: unknown) {
    if (!(error instanceof ArtifactUnavailableError))
        return false;
    res.setHeader('Cache-Control', 'no-store');
    res.status(error.status).json({ code: error.code, reason: error.reason, error: error.message });
    return true;
}
