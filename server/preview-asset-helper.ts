import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';

/** Only trusted server code can replace the launcher; no runtime endpoint override. */
export async function runPreviewAssetHelper(root: string, assets: string, manifestPath: string, jwt: string, signal: AbortSignal, launch: typeof spawn = spawn) {
    const cli = path.resolve('node_modules/wrangler/wrangler-dist/cli.js');
    if (JSON.parse(fs.readFileSync(path.resolve('node_modules/wrangler/package.json'),'utf8')).version !== '4.131.1') throw new Error('Review the trusted upload helper before changing Wrangler versions.');
    await new Promise<void>((resolve, reject) => {
        signal.throwIfAborted();
        // Wrangler requires env authentication even with explicit JWT headers.
        // Give it the same limited upload JWT, never the account credential.
        const child = launch(process.execPath, ['--max-old-space-size=512', cli, 'pages', 'project', 'upload', assets, '--output-manifest-path', manifestPath], { cwd: root, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], env: { SystemRoot: process.env.SystemRoot || '', PATH: path.dirname(process.execPath), HOME: root, USERPROFILE: root, APPDATA: root, LOCALAPPDATA: root, TEMP: root, TMP: root, CF_PAGES_UPLOAD_JWT: jwt, CLOUDFLARE_API_TOKEN: jwt, WRANGLER_SEND_METRICS: 'false', CI: 'true' } });
        let size = 0, timedOut = false;
        // Wait for close before removing files still owned by the helper.
        const timer = setTimeout(() => { timedOut = true; child.kill('SIGKILL'); }, 60000);
        const discard = (chunk: Buffer) => {
            size += chunk.length;
            if (size > 128 * 1024)
                child.kill('SIGKILL');
        };
        const stop = () => child.kill('SIGKILL');
        signal.addEventListener('abort', stop, { once: true });
        child.stdout!.on('data', discard);
        child.stderr!.on('data', discard);
        child.once('error', e => { clearTimeout(timer); signal.removeEventListener('abort', stop); reject(e); });
        child.once('close', code => { clearTimeout(timer); signal.removeEventListener('abort', stop); code === 0 && size <= 128 * 1024 && !timedOut && !signal.aborted ? resolve() : reject(new Error('Asset upload was not confirmed; reconcile before a new release.')); });
    });

}
