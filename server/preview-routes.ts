import type express from 'express';
import { randomUUID } from 'node:crypto';
import type { Session } from './auth.js';
import type { Room, RoomManager } from './rooms.js';
import type { SupabasePlatform } from './supabase-platform.js';
import type { PreviewPlan } from '../shared/preview-release.js';
import { encryptSecret, decryptSecret } from './credentials.js';
import { artifactHash, canonicalJson, artifactResponse } from './artifacts.js';
import { coordinatorResponse } from './coordinator-response.js';
import { bundleProject } from './project.js';
import { previewHash, previewState, previewView, hashPlan, restorePreviewBytes, type PreviewBytes } from './preview-state.js';
import { CloudflarePreviewProvider, type PreviewProvider } from './preview-provider.js';
import { withIsolatedBrowser } from './isolation/browser.js';
import { previewDocument } from './preview.js';
export function registerPreviewRoutes(app: express.Express, manager: RoomManager, authorize: (req: express.Request, res: express.Response) => {
    room: Room;
    session: Session;
} | null, secret: string, platform?: SupabasePlatform, provider: PreviewProvider = new CloudflarePreviewProvider()) {
    function fail(message: string, status = 409): never { throw Object.assign(new Error(message), { status }); }
    const admitted = { compile: new Set<string>(), provider: new Set<string>() };
    const active = new Map<string, {
        connectionId: string;
        abort: AbortController;
    }>();
    const stopConnection = (id: string) => { for (const job of active.values())
        if (job.connectionId === id)
            job.abort.abort(new Error('Release authority changed.')); };
    const fresh = async (room: Room, actor: string, write = true) => { if (!platform)
        return; let timer: NodeJS.Timeout | undefined; try {
        await Promise.race([(async () => { await platform.requireMembership(room.id, actor, write ? ['owner', 'editor'] : ['owner', 'editor', 'viewer']); await platform.assertCoordinator(room.id); })(), new Promise<never>((_resolve, reject) => { timer = setTimeout(() => reject(new Error('Current preview authority unavailable. No dispatch retry.')), 6000); timer.unref(); })]);
    }
    finally {
        clearTimeout(timer);
    } };
    const respond = async (room: Room, actor: string, res: express.Response, data: unknown) => { await fresh(room, actor, false); res.json(data); };
    const route = (operation: (req: express.Request, res: express.Response, auth: {
        room: Room;
        session: Session;
    }) => Promise<void>, admission?: 'compile' | 'provider') => async (req: express.Request, res: express.Response) => {
        const auth = authorize(req, res);
        if (!auth)
            return;
        let acquired = false;
        res.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' });
        try {
            if (secret.length < 32 && (req.body?.credential !== undefined || /\/(?:release|reconcile)$/.test(req.path)))
                fail('Preview credentials require a configured server encryption secret of at least 32 characters.', 503);
            if (admission) {
                if (admitted[admission].size >= 2 || admitted[admission].has(auth.room.id))
                    fail('Preview operation is already active or at capacity. Inspect the receipt before another action.', 409);
                admitted[admission].add(auth.room.id);
                acquired = true;
            }
            await auth.room.previewMutation?.catch(() => undefined);
            await fresh(auth.room, auth.session.participantId, req.method !== 'GET');
            await operation(req, res, auth);
        }
        catch (e) {
            if (!artifactResponse(res, e) && !coordinatorResponse(res, e))
                res.status(Number((e as any)?.status) || 400).json({ error: e instanceof Error ? e.message : 'Preview operation failed.' });
        }
        finally {
            if (admission && acquired)
                admitted[admission].delete(auth.room.id);
        }
    };
    const mutate = (room: Room, actor: string, operation: Parameters<RoomManager['mutatePreview']>[2]) => manager.mutatePreview(room, actor, operation, () => fresh(room, actor));
    const current = (room: Room, planId: string) => room.preview?.plans.find(p => p.id === planId) || fail('Preview plan not found.', 404);
    const authority = async (room: Room, actor: string, plan: PreviewPlan, readOnlyReconcile = false) => {
        const connection = room.preview?.connections.find(c => c.id === plan.connection?.id);
        const ownerReconcile = readOnlyReconcile && connection?.ownerId === actor && connection.ownerId === plan.connection?.ownerId;
        if (!connection || (!ownerReconcile && (connection.revoked || !connection.actors.includes(actor) || connection.revision !== plan.connection?.revision)) || previewHash(connection.target) !== previewHash(plan.connection!.target))
            fail('Release authority or verified target changed. Prepare a new plan.', 403);
        await fresh(room, connection.ownerId);
        await fresh(room, actor);
        return connection;
    };
    const key = (plan: PreviewPlan) => previewHash({ account: plan.connection!.target.accountId, project: plan.connection!.target.projectId, environment: 'preview' });
    const lock = async (room: Room, plan: PreviewPlan, release = false) => {
        if (!platform) {
            if (release)
                manager.eventStore.releasePreviewTarget(key(plan), room.id, plan.id);
            else
                manager.eventStore.reservePreviewTarget(key(plan), room.id, plan.id);
            return;
        }
        const fence = platform.coordinator.fence(room.id);
        let timer: NodeJS.Timeout | undefined;
        let result;
        try {
            result = await Promise.race([platform.admin.rpc(release ? 'release_preview_target' : 'reserve_preview_target', { target_key: key(plan), target_project_id: room.id, target_plan_id: plan.id, ...fence }), new Promise<never>((_resolve, reject) => { timer = setTimeout(() => reject(new Error('Preview reservation RPC outcome uncertain.')), 6000); timer.unref(); })]);
        }
        finally {
            clearTimeout(timer);
        }
        if (result.error || result.data !== true)
            fail('Global preview target lock unavailable. Reconcile; do not dispatch or retry.', 503);
    };
    const reconcile = async (room: Room, actor: string, plan: PreviewPlan) => {
        const connection = await authority(room, actor, plan, true);
        let receipt = room.preview!.receipts.find(r => r.planId === plan.id) || fail('No dispatched receipt to reconcile.');
        if (receipt.state === 'dispatching' && !active.has(plan.id)) {
            await mutate(room, actor, state => { const r = state.receipts.find(r => r.planId === plan.id)!; r.state = 'unknown'; r.detail = 'The worker ended before settlement. Reconcile without repeating upload.'; });
            receipt = room.preview!.receipts.find(r => r.planId === plan.id)!;
        }
        if (receipt.state === 'verified' || receipt.state === 'failed') {
            await lock(room, plan, true);
            return;
        }
        if (receipt.state === 'unknown' && receipt.dispatchPhase === 'assets') {
            // Terminal persistence prevents a still-running worker from recording create intent.
            // Asset hashes may remain uploaded, but no deployment POST was authorized by this plan.
            await mutate(room, actor, state => {
                const r = state.receipts.find(r => r.planId === plan.id)!;
                if (r.state !== 'unknown' || r.dispatchPhase !== 'assets')
                    fail('Dispatch phase changed; reconcile again.');
                r.state = 'failed';
                r.detail = 'Creation intent was never recorded. Deployment dispatch is permanently cancelled; uploaded content-addressed assets may remain.';
            });
            await lock(room, plan, true);
            return;
        }
        const token = decryptSecret(secret, connection.credential), deployments = await provider.find(token, plan);
        await authority(room, actor, plan, true);
        if (deployments.length !== 1) {
            await mutate(room, actor, state => { const r = state.receipts.find(r => r.planId === plan.id)!; r.state = 'unknown'; r.detail = deployments.length ? 'Multiple provider records; inspect before any new release.' : 'No matching record in bounded provider listing. This does not prove absence; never repeat this plan.'; });
            return;
        }
        const found = deployments[0], metadata = found.deployment_trigger?.metadata;
        if (!/^[a-f0-9-]{36}$/.test(found.id) || found.environment !== 'preview' || metadata?.branch !== plan.branch || metadata?.commit_hash !== plan.sourceHash || typeof found.url !== 'string')
            fail('Provider record does not match the exact authorized release.');
        await mutate(room, actor, state => { const r = state.receipts.find(r => r.planId === plan.id)!; r.providerId = found.id; r.state = 'accepted'; r.detail = 'Provider record found; live bytes and browser rendering not yet verified.'; });
        if (found.latest_stage?.status === 'failure') {
            await mutate(room, actor, state => { const r = state.receipts.find(r => r.planId === plan.id)!; r.state = 'failed'; r.detail = 'Provider confirmed failure. Prepare a separate reviewed release; never replay this plan.'; });
            await lock(room, plan, true);
            return;
        }
        if (found.latest_stage?.name !== 'deploy' || found.latest_stage.status !== 'success')
            return;
        const frozen = restorePreviewBytes(await manager.readArchivedArtifact(room, plan.contentRef), plan);
        for (const file of plan.files) {
            const bytes = await provider.live(found.url, connection.target, file.path);
            if (artifactHash(bytes) !== file.hash || bytes.byteLength !== file.byteLength)
                fail('Live file does not match frozen release. Keep the prior verified preview.');
        }
        // Fetches prove the live immutable URL serves these exact bytes. Render only those bytes
        // in the existing isolated verifier, with no provider credentials or network authority.
        await withIsolatedBrowser(async (browser) => {
            const { targetId } = await browser.call('Target.createTarget', { url: 'about:blank' }), { sessionId } = await browser.call('Target.attachToTarget', { targetId, flatten: true });
            await browser.call('Page.enable', {}, sessionId);
            const { frameTree } = await browser.call('Page.getFrameTree', {}, sessionId);
            await browser.call('Page.setDocumentContent', { frameId: frameTree.frame.id, html: previewDocument(frozen.assets['app.js'], frozen.assets['app.css']) }, sessionId);
            const { executionContextId } = await browser.call('Page.createIsolatedWorld', { frameId: frameTree.frame.id, worldName: 'trusted-preview-smoke', grantUniveralAccess: false }, sessionId);
            const check = await browser.call('Runtime.evaluate', { expression: "new Promise(resolve=>{const deadline=Date.now()+3000;function inspect(){if(document.getElementById('root')?.childElementCount)resolve(true);else if(Date.now()>deadline)resolve(false);else setTimeout(inspect,50)}inspect()})", contextId: executionContextId, returnByValue: true, awaitPromise: true }, sessionId);
            if (check.result?.value !== true)
                fail('The exact live bundle failed the isolated render smoke check.');
        });
        await authority(room, actor, plan, true);
        await mutate(room, actor, state => { const r = state.receipts.find(r => r.planId === plan.id)!; r.state = 'verified'; r.url = found.url; r.verifiedAt = new Date().toISOString(); r.detail = 'Exact live file hashes and isolated render smoke passed. Application semantics and real-user flows require acceptance.'; });
        await lock(room, plan, true);
    };
    app.get('/api/rooms/:id/previews', route(async (_req, res, { room, session }) => { await respond(room, session.participantId, res, previewView(previewState(room.preview))); }));
    app.post('/api/rooms/:id/previews/connections', route(async (req, res, { room, session }) => {
        const { accountId, projectName, credential, actors = [] } = req.body, actor = session.participantId;
        if (Object.keys(req.body).some(k => !['accountId', 'projectName', 'credential', 'actors'].includes(k)) || typeof credential !== 'string' || !/^[A-Za-z0-9_-]{20,4096}$/.test(credential) || !Array.isArray(actors) || actors.length > 20 || actors.some(id => typeof id !== 'string' || !room.participants.has(id)))
            fail('Enter exact target and current release participants; use a scoped server-side token.', 400);
        const target = await provider.verify(credential, accountId, projectName);
        await fresh(room, actor);
        await mutate(room, actor, state => {
            if (state.connections.length >= 4)
                fail('Connection limit reached.');
            state.connections.push({ id: randomUUID(), ownerId: actor, actors: [...new Set([actor, ...actors])], revision: 1, target, verifiedAt: new Date().toISOString(), revoked: false, credential: encryptSecret(secret, credential) });
        });
        await respond(room, session.participantId, res, previewView(room.preview!));
    }, 'provider'));
    app.post('/api/rooms/:id/previews/connections/:connectionId/revoke', route(async (_req, res, { room, session }) => {
        await mutate(room, session.participantId, state => {
            const c = state.connections.find(c => c.id === _req.params.connectionId);
            if (!c || c.ownerId !== session.participantId)
                fail('Only the connection owner can revoke it.', 403);
            c.revoked = true;
            c.revision++;
        });
        stopConnection(String(_req.params.connectionId));
        await respond(room, session.participantId, res, previewView(room.preview!));
    }));
    app.post('/api/rooms/:id/previews/connections/:connectionId/grants', route(async (req, res, { room, session }) => {
        const { actors, expectedRevision } = req.body;
        if (Object.keys(req.body).some(k => !['actors', 'expectedRevision'].includes(k)) || !Array.isArray(actors) || actors.length > 20 || actors.some(id => typeof id !== 'string' || !room.participants.has(id)))
            fail('Select exact current release participants.', 400);
        await mutate(room, session.participantId, state => {
            const c = state.connections.find(c => c.id === req.params.connectionId);
            if (!c || c.ownerId !== session.participantId)
                fail('Connection owner permission required.', 403);
            if (c.revision !== expectedRevision)
                fail('Stale grant revision.');
            c.actors = [...new Set([c.ownerId, ...actors])];
            c.revoked = false;
            c.revision++;
        });
        stopConnection(String(req.params.connectionId));
        await respond(room, session.participantId, res, previewView(room.preview!));
    }));
    app.post('/api/rooms/:id/previews/connections/:connectionId/credential', route(async (req, res, { room, session }) => {
        const { credential } = req.body, c = room.preview?.connections.find(c => c.id === req.params.connectionId);
        if (!c || c.ownerId !== session.participantId)
            fail('Connection owner permission required.', 403);
        if (Object.keys(req.body).length !== 1 || typeof credential !== 'string' || !/^[A-Za-z0-9_-]{20,4096}$/.test(credential))
            fail('Provide a scoped replacement token.', 400);
        if (previewHash(await provider.verify(credential, c.target.accountId, c.target.projectName)) !== previewHash(c.target))
            fail('Replacement token resolves a different target.');
        await mutate(room, session.participantId, state => { const saved = state.connections.find(x => x.id === c.id)!; saved.credential = encryptSecret(secret, credential); saved.revision++; });
        stopConnection(c.id);
        await respond(room, session.participantId, res, previewView(room.preview!));
    }, 'provider'));
    app.post('/api/rooms/:id/previews/plans', route(async (req, res, { room, session }) => {
        const { versionId, connectionId, recoveryOf } = req.body, actor = session.participantId;
        if (Object.keys(req.body).some(k => !['versionId', 'connectionId', 'recoveryOf'].includes(k)) || !Number.isSafeInteger(versionId) || versionId < 1)
            fail('Select an exact saved application version.', 400);
        let bytes: Uint8Array, sourceHash: string, files: PreviewPlan['files'];
        if (recoveryOf) {
            const old = current(room, recoveryOf);
            if (old.versionId !== versionId || !room.preview?.receipts.some(r => r.planId === old.id && r.state === 'verified'))
                fail('Recovery requires an exact previous verified version.');
            bytes = await manager.readArchivedArtifact(room, old.contentRef);
            restorePreviewBytes(bytes, old);
            sourceHash = old.sourceHash;
            files = old.files;
        }
        else {
            const version = await manager.restoredVersion(room, versionId);
            if (!version?.files?.length)
                fail('Stored frontend source unavailable.');
            const frozen = structuredClone(version.files), compiled = await bundleProject(frozen);
            sourceHash = previewHash([...frozen].sort((a, b) => a.path.localeCompare(b.path)));
            const assets = { 'index.html': '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src &apos;none&apos;; script-src &apos;self&apos;; style-src &apos;self&apos; &apos;unsafe-inline&apos;; connect-src &apos;none&apos;; img-src data:; base-uri &apos;none&apos;; form-action &apos;none&apos;; frame-src &apos;none&apos;; object-src &apos;none&apos;"><link rel="stylesheet" href="/app.css"><title>Application preview</title></head><body><div id="root"></div><script src="/app.js"></script></body></html>', 'app.js': compiled.javascript, 'app.css': compiled.css, 'cocreate-release.json': canonicalJson({ projectId: room.id, versionId, sourceHash }) };
            files = Object.entries(assets).map(([path, text]) => ({ path, hash: artifactHash(Buffer.from(text)), byteLength: Buffer.byteLength(text) }));
            if (files.some(f => f.byteLength > 2 * 1024 ** 2))
                fail('Frontend output exceeds the preview bound.');
            bytes = Buffer.from(canonicalJson({ schemaVersion: 1, kind: 'frontend-preview', projectId: room.id, versionId, sourceHash, assets } satisfies PreviewBytes));
        }
        await fresh(room, actor);
        const contentRef = manager.eventStore.writeArtifact(bytes, 'application/vnd.cocreate.frontend-preview+json').ref;
        await mutate(room, actor, state => {
            if (state.plans.length >= 32)
                fail('Durable release plan limit reached.');
            const connection = connectionId ? state.connections.find(c => c.id === connectionId && !c.revoked) : undefined;
            if (connectionId && !connection)
                fail('Connection unavailable.');
            const id = randomUUID(), last = state.receipts.filter(r => r.state === 'verified' && (!connection || state.plans.find(p => p.id === r.planId)?.connection?.target.projectId === connection.target.projectId)).at(-1);
            const plan: PreviewPlan = { id, projectId: room.id, createdBy: actor, createdAt: new Date().toISOString(), versionId, sourceHash, contentRef, branch: `cocreate-${id.replaceAll('-', '')}`, files, exposure: 'public-static-preview', operation: 'upload-static-assets-and-create-preview', planHash: '', ...(connection ? { connection: { id: connection.id, ownerId: connection.ownerId, revision: connection.revision, target: connection.target } } : {}), ...(last ? { previousPlanId: last.planId } : {}), ...(recoveryOf ? { recoveryOf } : {}) };
            plan.planHash = hashPlan(plan);
            state.plans.push(plan);
        });
        await respond(room, session.participantId, res, previewView(room.preview!));
    }, 'compile'));
    app.post('/api/rooms/:id/previews/plans/:planId/release', route(async (req, res, { room, session }) => {
        const plan = current(room, String(req.params.planId)), actor = session.participantId;
        if (Object.keys(req.body).some(k => !['planHash', 'approvePublicPreview'].includes(k)) || req.body.planHash !== plan.planHash || req.body.approvePublicPreview !== true || hashPlan(plan) !== plan.planHash)
            fail('Approve the exact reviewed plan and public preview exposure.');
        const connection = await authority(room, actor, plan);
        const prior = room.preview!.receipts.find(r => r.planId === plan.id);
        if (prior) {
            if (prior.actorId !== actor)
                fail('This release has a different approving actor.', 403);
            await respond(room, actor, res, { ...previewView(room.preview!), replayed: true });
            return;
        }
        const token = decryptSecret(secret, connection.credential);
        if (previewHash(await provider.verify(token, connection.target.accountId, connection.target.projectName)) !== previewHash(plan.connection!.target))
            fail('Target changed; prepare a new plan.');
        restorePreviewBytes(await manager.readArchivedArtifact(room, plan.contentRef), plan);
        await authority(room, actor, plan);
        // Intent is permanent before either account mutation or the global reservation.
        await mutate(room, actor, state => {
            if (state.receipts.some(r => r.planId === plan.id))
                fail('Release already recorded; reconcile it.');
            state.receipts.push({ planId: plan.id, planHash: plan.planHash, actorId: actor, approvedAt: new Date().toISOString(), state: 'dispatching', dispatchPhase: 'assets', detail: 'Explicit approval recorded before dispatch. No automatic replay.' });
        });
        const abort = new AbortController();
        active.set(plan.id, { connectionId: connection.id, abort });
        let checking = false;
        const timer = setInterval(() => { if (checking)
            return; checking = true; void authority(room, actor, plan).catch(() => abort.abort(new Error('Current release authority unavailable.'))).finally(() => { checking = false; }); }, 1000);
        timer.unref();
        try {
            await lock(room, plan);
            await authority(room, actor, plan);
            const bytes = restorePreviewBytes(await manager.readArchivedArtifact(room, plan.contentRef), plan);
            const dispatchAuthority = async () => {
                abort.signal.throwIfAborted();
                await authority(room, actor, plan);
                abort.signal.throwIfAborted();
                if (room.preview!.receipts.find(r => r.planId === plan.id)?.state !== 'dispatching')
                    fail('Dispatch authority ended.');
            };
            await provider.upload(token, plan, bytes, dispatchAuthority, async () => {
                await dispatchAuthority();
                await mutate(room, actor, state => {
                    const r = state.receipts.find(r => r.planId === plan.id)!;
                    if (r.state !== 'dispatching')
                        fail('Dispatch ended before creation.');
                    r.dispatchPhase = 'create_pending';
                });
            }, abort.signal);
            await mutate(room, actor, state => { const r = state.receipts.find(r => r.planId === plan.id)!; r.state = 'unknown'; r.detail = 'Upload returned. Reconciliation must identify the unique provider record and exact live bytes.'; });
            await reconcile(room, actor, plan);
        }
        catch {
            await mutate(room, actor, state => {
                const r = state.receipts.find(r => r.planId === plan.id)!;
                if (r.state !== 'verified' && r.state !== 'failed') {
                    r.state = 'unknown';
                    r.detail = 'Outcome uncertain or verification incomplete. Global target reservation remains held. Reconcile; never repeat upload.';
                }
            });
        }
        finally {
            clearInterval(timer);
            active.delete(plan.id);
        }
        await respond(room, session.participantId, res, previewView(room.preview!));
    }, 'provider'));
    app.post('/api/rooms/:id/previews/plans/:planId/reconcile', route(async (req, res, { room, session }) => {
        if (Object.keys(req.body).length)
            fail('Reconciliation takes no mutable plan fields.', 400);
        await reconcile(room, session.participantId, current(room, String(req.params.planId)));
        await respond(room, session.participantId, res, previewView(room.preview!));
    }, 'provider'));
    app.get('/api/rooms/:id/previews/plans/:planId/files/:file', route(async (req, res, { room, session }) => {
        const plan = current(room, String(req.params.planId)), f = String(req.params.file);
        if (!plan.files.some(x => x.path === f))
            fail('Frozen file unavailable.', 404);
        const bytes = restorePreviewBytes(await manager.readArchivedArtifact(room, plan.contentRef), plan);
        await fresh(room, session.participantId, false);
        res.setHeader('Content-Disposition', `attachment; filename="${f}"`);
        res.type('application/octet-stream').send(Buffer.from(bytes.assets[f]));
    }));
    return () => { for (const job of active.values())
        job.abort.abort(new Error('Server disconnect; reconcile saved receipt.')); };
}
