import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { CloudflarePreviewProvider, type ProviderDeployment } from '../../server/preview-provider.js';
import { artifactHash } from '../../server/artifacts.js';
export async function createPreviewProviderFixture() {
    const target = { accountId: 'a'.repeat(32), accountName: 'Controlled account', projectId: randomUUID(), projectName: 'controlled-app', subdomain: 'controlled-app.pages.dev', productionBranch: 'main', environment: 'preview' as const };
    const control = { posts: 0, reads: 0, assetUploads: 0, failAfterCreate: false, hidden: false, corrupt: false, changedTarget: false, hold: undefined as undefined | Promise<void> };
    const deployments: ProviderDeployment[] = [], outputs = new Map<string, Record<string, string>>();
    let assets: Record<string, string> = {};
    const server = http.createServer(async (req, res) => {
        try {
            const url = new URL(req.url!, 'http://fixture');
            let result: unknown;
            if (url.pathname.startsWith('/live/')) {
                const [, , id, file] = url.pathname.split('/');
                if (req.headers.authorization)
                    throw Error('Credentials reached the public preview.');
                const text = outputs.get(id)?.[file];
                if (text === undefined)
                    res.writeHead(404).end();
                else
                    res.end(control.corrupt && file === 'app.js' ? 'corrupt' : text);
                return;
            }
            if (!req.headers.authorization?.startsWith('Bearer ')) {
                res.writeHead(403).end();
                return;
            }
            control.reads++;
            if (url.pathname.endsWith('/upload-token'))
                result = { jwt: 'fixture_upload_jwt' };
            else if (url.pathname.endsWith('/deployments') && req.method === 'POST') {
                control.posts++;
                let body = '';
                for await (const chunk of req)
                    body += chunk;
                const field = (name: string) => body.match(new RegExp(`name="${name}"\\r\\n\\r\\n([^\\r]+)`))?.[1] || '';
                const id = randomUUID(), url = `https://${artifactHash(Buffer.from(id)).slice(0, 8)}.${target.subdomain}/`;
                outputs.set(id, { ...assets });
                deployments.unshift({ id, url, environment: 'preview', deployment_trigger: { metadata: { branch: field('branch'), commit_hash: field('commit_hash') } }, latest_stage: { name: 'deploy', status: 'success' } });
                if (control.failAfterCreate) {
                    req.socket.destroy();
                    return;
                }
                result = deployments[0];
            }
            else if (url.pathname.endsWith('/deployments'))
                result = control.hidden ? [] : deployments;
            else if (url.pathname.endsWith('/pages/projects/' + target.projectName))
                result = { id: target.projectId, name: target.projectName, subdomain: target.subdomain, production_branch: control.changedTarget ? 'other-production' : target.productionBranch, source: null };
            else if (url.pathname.endsWith('/accounts/' + target.accountId))
                result = { id: target.accountId, name: target.accountName };
            else {
                res.writeHead(404).end();
                return;
            }
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify({ success: true, result, errors: [] }));
        }
        catch {
            if (!res.destroyed)
                res.writeHead(500).end();
        }
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${(server.address() as any).port}`;
    const request: typeof fetch = async (input, init) => {
        const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
        if (url.hostname === 'api.cloudflare.com')
            return fetch(origin + url.pathname.replace('/client/v4', '') + url.search, init);
        const deployment = deployments.find(d => new URL(d.url).hostname === url.hostname);
        if (!deployment)
            throw Error('Unrecognized preview hostname.');
        return fetch(`${origin}/live/${deployment.id}/${url.pathname.slice(1)}`, init);
    };
    const provider = new CloudflarePreviewProvider(request, async (_jwt, next, signal) => { control.assetUploads++; assets = { ...next }; let stop: () => void = () => { }; try {
        await Promise.race([control.hold, new Promise<never>((_resolve, reject) => { stop = () => reject(new Error('Controlled asset helper stopped.')); if (signal.aborted)
                stop();
            else
                signal.addEventListener('abort', stop, { once: true }); })]);
    }
    finally {
        signal.removeEventListener('abort', stop);
    } return Object.fromEntries(Object.entries(next).map(([name, text]) => ['/' + name, artifactHash(Buffer.from(text))])); });
    return { provider, target, control, deployments, async close() { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); } };
}
