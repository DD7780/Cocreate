import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { SupabasePlatform } from '../../server/supabase-platform.js';
/** Real SDK over loopback HTTP; synthetic Storage/PostgREST, not real Supabase or SQL. */
export async function createArtifactFixture() {
    const objects = new Map<string, Buffer>();
    const snapshots = new Map<string, {
        revision: number;
        yjs_state: string;
        harness_state: Record<string, any>;
        committed_at: string;
    }>();
    const counts = { uploads: 0, downloads: 0, commits: 0 };
    const trace: string[] = [];
    const controls = { publicBucket: false, failUpload: false, corruptUpload: false, failCommit: false,
        beforeCommit: undefined as undefined | ((body: any) => Promise<void>), failVersion: 0,
        afterDownload: undefined as undefined | (() => void) };
    const server = http.createServer(async (req, res) => {
        const url = new URL(req.url || '/', 'http://localhost');
        const respond = (status: number, value: unknown) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
        if (req.headers.authorization !== 'Bearer synthetic-service-key')
            return respond(403, { message: 'Denied by controlled fixture' });
        if (url.pathname === '/storage/v1/bucket/cocreate-artifacts')
            return respond(200, { id: 'cocreate-artifacts', name: 'cocreate-artifacts', public: controls.publicBucket });
        const objectMatch = /^\/storage\/v1\/object\/(?:authenticated\/)?cocreate-artifacts\/(.+)$/.exec(url.pathname);
        if (objectMatch) {
            const key = decodeURIComponent(objectMatch[1]);
            if (req.method === 'POST') {
                counts.uploads++;
                trace.push('upload');
                const chunks: Buffer[] = [];
                for await (const chunk of req)
                    chunks.push(Buffer.from(chunk));
                if (controls.failUpload)
                    return respond(500, { statusCode: '500', message: 'Controlled upload outage' });
                if (req.headers['x-upsert'] !== 'false')
                    return respond(400, { message: 'Fixture requires immutable upload' });
                if (objects.has(key))
                    return respond(400, { statusCode: '409', message: 'The resource already exists' });
                objects.set(key, controls.corruptUpload ? Buffer.from('corrupt') : Buffer.concat(chunks));
                return respond(200, { Key: `cocreate-artifacts/${key}`, Id: randomUUID() });
            }
            if (req.method === 'GET') {
                counts.downloads++;
                trace.push('download');
                const bytes = objects.get(key);
                if (!bytes)
                    return respond(404, { statusCode: '404', message: 'Object not found' });
                controls.afterDownload?.();
                res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
                res.end(bytes);
                return;
            }
        }
        if (url.pathname.startsWith('/rest/v1/rpc/')) {
            let raw = '';
            for await (const chunk of req)
                raw += chunk;
            const body = JSON.parse(raw), name = url.pathname.split('/').at(-1);
            if (name === 'claim_workflow_coordinator')
                return respond(200, 1);
            if (name === 'release_workflow_coordinator' || name === 'append_workflow_document_update' || name === 'record_workflow_provider_dispatch' || name === 'record_project_provider_request')
                return respond(200, null);
            if (name === 'commit_workflow_snapshot') {
                trace.push('commit');
                await controls.beforeCommit?.(body);
                if (controls.failCommit || body.target_harness_state.versions?.some((version: any) => version.id === controls.failVersion))
                    return respond(500, { code: 'XX000', message: 'Controlled commit interruption' });
                const previous = snapshots.get(body.target_project_id);
                if (previous && previous.revision > body.target_revision)
                    return respond(400, { code: '22023', message: 'Stale fixture revision' });
                counts.commits++;
                snapshots.set(body.target_project_id, { revision: body.target_revision, yjs_state: body.target_yjs_state,
                    harness_state: structuredClone(body.target_harness_state), committed_at: new Date().toISOString() });
                return respond(200, true);
            }
        }
        if (url.pathname === '/rest/v1/project_snapshots') {
            const project = (url.searchParams.get('project_id') || '').replace(/^eq\./, '');
            const snapshot = snapshots.get(project);
            return respond(200, snapshot ? [snapshot] : []);
        }
        if (url.pathname === '/rest/v1/project_provider_requests')
            return respond(200, []);
        respond(404, { message: 'Unknown controlled fixture route' });
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string')
        throw new Error('Fixture did not bind TCP');
    const origin = `http://127.0.0.1:${address.port}`;
    const platforms: SupabasePlatform[] = [];
    const platform = () => {
        const instance = new SupabasePlatform({ url: origin, publishableKey: 'synthetic-publishable', secretKey: 'synthetic-service-key' });
        platforms.push(instance);
        return instance;
    };
    return { origin, objects, snapshots, counts, trace, controls, platform,
        async close() { await Promise.all(platforms.map(instance => instance.coordinator.close())); await new Promise<void>(resolve => server.close(() => resolve())); } };
}
