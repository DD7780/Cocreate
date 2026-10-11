import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { runPreviewAssetHelper } from './preview-asset-helper.js';
import type { PreviewPlan, PreviewTarget } from '../shared/preview-release.js';
import type { PreviewBytes } from './preview-state.js';
import { previewHash } from './preview-state.js';
export type ProviderDeployment = {
    id: string;
    url: string;
    environment: string;
    deployment_trigger: {
        metadata: {
            branch: string;
            commit_hash: string;
        };
    };
    latest_stage: {
        name: string;
        status: string;
    };
};
export interface PreviewProvider {
    verify(token: string, accountId: string, projectName: string): Promise<PreviewTarget>;
    upload(token: string, plan: PreviewPlan, bytes: PreviewBytes, authorize: () => Promise<void>, beforeCreate: () => Promise<void>, signal: AbortSignal): Promise<void>;
    find(token: string, plan: PreviewPlan): Promise<ProviderDeployment[]>;
    live(url: string, target: PreviewTarget, file: string): Promise<Uint8Array>;
}
async function boundedBody(response: Response, maximum: number): Promise<Uint8Array> {
    if (!response.ok || !response.body)
        throw new Error('Provider request failed. Inspect the durable receipt; no automatic upload retry.');
    const chunks: Uint8Array[] = [];
    let size = 0;
    const reader = response.body.getReader();
    try {
        for (;;) {
            const value = await reader.read();
            if (value.done)
                break;
            size += value.value.byteLength;
            if (size > maximum)
                throw new Error('Provider response exceeded the bound.');
            chunks.push(value.value);
        }
    }
    finally {
        await reader.cancel();
    }
    return Buffer.concat(chunks);
}
export class CloudflarePreviewProvider implements PreviewProvider {
    constructor(private readonly request: typeof fetch = fetch, private readonly assetHelper?: (jwt: string, assets: Record<string, string>, signal: AbortSignal) => Promise<Record<string, string>>) { }
    private async api(token: string, resource: string, init: RequestInit = {}) {
        const response = await this.request(`https://api.cloudflare.com/client/v4${resource}`, { ...init, headers: { Authorization: `Bearer ${token}`, ...init.headers }, redirect: 'error', signal: init.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000) });
        const body = JSON.parse(Buffer.from(await boundedBody(response, 1024 * 1024)).toString('utf8'));
        if (body.success !== true || body.errors?.length)
            throw new Error('Cloudflare did not confirm the request. Reconcile instead of repeating an upload.');
        return body.result;
    }
    async verify(token: string, accountId: string, projectName: string): Promise<PreviewTarget> {
        if (!/^[a-f0-9]{32}$/.test(accountId) || !/^[a-z0-9][a-z0-9-]{0,57}$/.test(projectName) || ['cocreate', '2guys1canvas'].includes(projectName))
            throw new Error('Choose an existing dedicated generated-app Pages project.');
        const account = await this.api(token, `/accounts/${accountId}`);
        const project = await this.api(token, `/accounts/${accountId}/pages/projects/${projectName}`);
        if (account.id !== accountId || typeof account.name !== 'string' || project.name !== projectName || !/^[a-f0-9-]{36}$/.test(project.id) || !/^[a-z0-9-]+\.pages\.dev$/.test(project.subdomain) || typeof project.production_branch !== 'string' || !project.production_branch || project.source)
            throw new Error('Target must be a verified existing Direct Upload project, with an explicit production branch.');
        return { accountId, accountName: account.name, projectId: project.id, projectName, subdomain: project.subdomain, productionBranch: project.production_branch, environment: 'preview' };
    }
    async upload(token: string, plan: PreviewPlan, bytes: PreviewBytes, authorize: () => Promise<void>, beforeCreate: () => Promise<void>, signal: AbortSignal) {
        const target = plan.connection!.target;
        if (plan.branch === target.productionBranch)
            throw new Error('Production release is forbidden.');
        const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cocreate-preview-')), assets = path.join(root, 'assets'), manifestPath = path.join(root, 'manifest.json');
        fs.mkdirSync(assets);
        for (const [name, text] of Object.entries(bytes.assets))
            fs.writeFileSync(path.join(assets, name), text);
        try {
            await authorize();
            signal.throwIfAborted();
            const { jwt } = await this.api(token, `/accounts/${target.accountId}/pages/projects/${target.projectName}/upload-token`);
            if (typeof jwt !== 'string' || jwt.length > 16384)
                throw new Error('Invalid bounded asset token.');
            // Use only the trusted upload helper. Wrangler's deployment command retries uncertain POSTs,
            // so it is deliberately excluded; creation below is one explicit HTTP attempt.
            if (this.assetHelper)
                fs.writeFileSync(manifestPath, JSON.stringify(await this.assetHelper(jwt, bytes.assets, signal)));
            else
                await runPreviewAssetHelper(root, assets, manifestPath, jwt, signal);
            signal.throwIfAborted();
            const stat = fs.lstatSync(manifestPath);
            if (!stat.isFile() || stat.size > 4096)
                throw new Error('Invalid asset manifest.');
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            if (Object.keys(manifest).length !== 4 || Object.keys(bytes.assets).some(name => typeof manifest[`/${name}`] !== 'string' || !/^[a-f0-9]{32,64}$/.test(manifest[`/${name}`])))
                throw new Error('Asset manifest does not match the frozen file set.');
            await authorize();
            if (previewHash(await this.verify(token, target.accountId, target.projectName)) !== previewHash(target))
                throw new Error('Provider target changed; prepare a new plan.');
            const form = new FormData();
            form.set('manifest', JSON.stringify(manifest));
            form.set('branch', plan.branch);
            form.set('commit_hash', plan.sourceHash);
            form.set('commit_message', `CoCreate plan ${plan.id}`);
            form.set('commit_dirty', 'false');
            await beforeCreate();
            await authorize();
            signal.throwIfAborted();
            await this.api(token, `/accounts/${target.accountId}/pages/projects/${target.projectName}/deployments`, { method: 'POST', body: form, signal });
        }
        finally {
            if (path.dirname(root) !== os.tmpdir() || !path.basename(root).startsWith('cocreate-preview-'))
                throw new Error('Unsafe preview cleanup path.');
            fs.rmSync(root, { recursive: true, force: true });
        }
    }
    async find(token: string, plan: PreviewPlan): Promise<ProviderDeployment[]> {
        const target = plan.connection!.target;
        const matches: ProviderDeployment[] = [];
        // Bounded read-only reconciliation. Absence is never treated as proof of non-dispatch.
        for (let page = 1; page <= 3; page++) {
            const values = await this.api(token, `/accounts/${target.accountId}/pages/projects/${target.projectName}/deployments?env=preview&per_page=50&page=${page}`);
            if (!Array.isArray(values))
                throw new Error('Invalid deployment listing.');
            matches.push(...values.filter((d: ProviderDeployment) => d.deployment_trigger?.metadata?.branch === plan.branch));
            if (values.length < 50)
                break;
        }
        return matches;
    }
    async live(url: string, target: PreviewTarget, file: string): Promise<Uint8Array> {
        const address = new URL(url);
        if (address.protocol !== 'https:' || address.username || address.password || address.port || address.search || address.hash || address.pathname !== '/' || !new RegExp(`^[a-f0-9]{8}\\.${target.subdomain.replaceAll('.', '\\.')}$`).test(address.hostname) || !['index.html', 'app.js', 'app.css', 'cocreate-release.json'].includes(file))
            throw new Error('Only the immutable verified Pages preview URL may be checked.');
        return boundedBody(await this.request(new URL(file, address), { redirect: 'error', signal: AbortSignal.timeout(10000), headers: { 'Cache-Control': 'no-cache' } }), 2 * 1024 ** 2);
    }
}
