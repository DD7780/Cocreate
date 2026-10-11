import { ArtifactUnavailableError, artifactHash, canonicalJson } from './artifacts.js';
import type { PreviewConnection, PreviewPlan, PreviewReceipt, PreviewView } from '../shared/preview-release.js';
import type { EncryptedSecret } from './credentials.js';
export type PreviewState = Omit<PreviewView, 'connections'> & {
    connections: (PreviewConnection & {
        credential: EncryptedSecret;
    })[];
};
export type PreviewBytes = {
    schemaVersion: 1;
    kind: 'frontend-preview';
    projectId: string;
    versionId: number;
    sourceHash: string;
    assets: Record<string, string>;
};
export const previewHash = (value: unknown) => artifactHash(Buffer.from(canonicalJson(value)));
export const hashPlan = ({ planHash: _ignored, ...plan }: PreviewPlan) => previewHash(plan);
const id = (v: unknown): v is string => typeof v === 'string' && /^[a-f0-9-]{36}$/.test(v);
const hash = (v: unknown): v is string => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
const fail = (): never => { throw new ArtifactUnavailableError('corrupt'); };
export function previewState(raw: unknown, recovery = false): PreviewState {
    if (raw === undefined)
        return { connections: [], plans: [], receipts: [] };
    const state = structuredClone(raw) as PreviewState;
    if (!state || Object.keys(state).some(k => !['connections', 'plans', 'receipts'].includes(k)) || !Array.isArray(state.connections) || !Array.isArray(state.plans) || !Array.isArray(state.receipts) || state.connections.length > 4 || state.plans.length > 32 || state.receipts.length > 32)
        fail();
    for (const c of state.connections) {
        const t = c.target;
        if (!id(c.id) || typeof c.ownerId !== 'string' || !c.ownerId || !Array.isArray(c.actors) || c.actors.length > 20 || c.actors.some(a => typeof a !== 'string' || !a) || !Number.isSafeInteger(c.revision) || c.revision < 1 || typeof c.revoked !== 'boolean' || !Number.isFinite(Date.parse(c.verifiedAt)) || !t || !/^[a-f0-9]{32}$/.test(t.accountId) || !id(t.projectId) || !/^[a-z0-9][a-z0-9-]{0,57}$/.test(t.projectName) || !/^[a-z0-9-]+\.pages\.dev$/.test(t.subdomain) || typeof t.accountName !== 'string' || typeof t.productionBranch !== 'string' || !t.productionBranch || t.environment !== 'preview' || !c.credential || ['iv', 'tag', 'value'].some(k => typeof (c.credential as any)[k] !== 'string'))
            fail();
        if (!c.actors.includes(c.ownerId) || Object.keys(c.credential).some(k => !['iv', 'tag', 'value'].includes(k)) || Object.keys(c).some(k => !['id', 'ownerId', 'actors', 'revision', 'target', 'verifiedAt', 'revoked', 'credential'].includes(k)) || Object.keys(t).some(k => !['accountId', 'accountName', 'projectId', 'projectName', 'subdomain', 'productionBranch', 'environment'].includes(k)))
            fail();
    }
    for (const p of state.plans) {
        if (!id(p.id) || !id(p.projectId) || typeof p.createdBy !== 'string' || !Number.isFinite(Date.parse(p.createdAt)) || !Number.isSafeInteger(p.versionId) || p.versionId < 1 || !hash(p.sourceHash) || !/^sha256:[a-f0-9]{64}$/.test(p.contentRef) || p.branch !== `cocreate-${p.id.replaceAll('-', '')}` || !Array.isArray(p.files) || p.files.length !== 4 || p.files.some(f => !['index.html', 'app.js', 'app.css', 'cocreate-release.json'].includes(f.path) || !hash(f.hash) || !Number.isSafeInteger(f.byteLength) || f.byteLength < 0 || f.byteLength > 2 * 1024 ** 2) || new Set(p.files.map(f => f.path)).size !== 4 || p.exposure !== 'public-static-preview' || p.operation !== 'upload-static-assets-and-create-preview' || p.planHash !== hashPlan(p))
            fail();
        if (p.connection && (!id(p.connection.id) || !state.connections.some(c => c.id === p.connection!.id && c.ownerId === p.connection!.ownerId)))
            fail();
        if (Object.keys(p).some(k => !['id', 'projectId', 'createdBy', 'createdAt', 'versionId', 'sourceHash', 'contentRef', 'branch', 'files', 'connection', 'previousPlanId', 'recoveryOf', 'planHash', 'exposure', 'operation'].includes(k)) || p.files.some(f => Object.keys(f).some(k => !['path', 'hash', 'byteLength'].includes(k))) || (p.connection && Object.keys(p.connection).some(k => !['id', 'ownerId', 'revision', 'target'].includes(k))))
            fail();
    }
    for (const r of state.receipts) {
        if (!state.plans.some(p => p.id === r.planId && p.planHash === r.planHash) || typeof r.actorId !== 'string' || !Number.isFinite(Date.parse(r.approvedAt)) || !['dispatching', 'unknown', 'accepted', 'verified', 'failed'].includes(r.state) || !['assets', 'create_pending'].includes(r.dispatchPhase) || typeof r.detail !== 'string' || r.detail.length > 500 || (r.providerId !== undefined && !id(r.providerId)) || (r.url !== undefined && (typeof r.url !== 'string' || r.url.length > 240)))
            fail();
        if (recovery && r.state === 'dispatching') {
            r.state = 'unknown';
            r.detail = 'Server restarted during dispatch. Reconcile the unique branch; never repeat this plan.';
        }
        if (Object.keys(r).some(k => !['planId', 'planHash', 'actorId', 'approvedAt', 'state', 'dispatchPhase', 'providerId', 'url', 'verifiedAt', 'detail'].includes(k)))
            fail();
    }
    if (new Set(state.connections.map(c => c.id)).size !== state.connections.length || new Set(state.plans.map(p => p.id)).size !== state.plans.length || new Set(state.receipts.map(r => r.planId)).size !== state.receipts.length)
        fail();
    return state;
}
export function previewView(state: PreviewState): PreviewView {
    return { ...state, connections: state.connections.map(({ credential: _secret, ...connection }) => connection) };
}
export function restorePreviewBytes(bytes: Uint8Array, plan: PreviewPlan): PreviewBytes {
    try {
        const value = JSON.parse(Buffer.from(bytes).toString('utf8')) as PreviewBytes;
        if (value.schemaVersion !== 1 || value.kind !== 'frontend-preview' || value.projectId !== plan.projectId || value.versionId !== plan.versionId || value.sourceHash !== plan.sourceHash || artifactHash(bytes) !== plan.contentRef.slice(7) || !value.assets || Object.keys(value.assets).length !== 4)
            fail();
        for (const file of plan.files)
            if (typeof value.assets[file.path] !== 'string' || artifactHash(Buffer.from(value.assets[file.path])) !== file.hash || Buffer.byteLength(value.assets[file.path]) !== file.byteLength)
                fail();
        return value;
    }
    catch {
        return fail();
    }
}
