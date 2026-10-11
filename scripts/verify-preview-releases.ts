// Two independent application profiles; controlled Cloudflare API/assets fixtures only.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import WebSocket from 'ws';
import { createCanvasArtifactsFixture } from '../tests/fixtures/canvas-artifacts.js';
import { createPreviewProviderFixture } from '../tests/fixtures/preview-provider.js';
import { applyOperations } from '../server/project.js';
import { browserExecutable } from '../server/isolation/browser.js';
process.env.NODE_ENV = 'production';
process.env.COCREATE_AUTH_MODE = 'local';
const output = path.resolve('artifacts/preview-release/browser');
fs.mkdirSync(output, { recursive: true });
const provider = await createPreviewProviderFixture(), fixture = await createCanvasArtifactsFixture({ client: true, previewProvider: provider.provider }), checks: string[] = [];
const files = applyOperations(undefined, [{ type: 'write', path: 'src/App.tsx', content: 'export default function App(){return <main><h1>Controlled generated preview</h1><button>Preview button</button></main>}' }]);
fixture.room.versions.push({ id: 1, createdAt: new Date().toISOString(), summary: 'Controlled generated frontend', files, bundle: 'fixture', css: '', fileCount: files.length });
await fixture.manager.save(fixture.room);
await fixture.room.persistQueue;
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
async function until(check: () => Promise<boolean>, label: string) { const start = Date.now(); while (Date.now() - start < 30000) {
    if (await check())
        return;
    await wait(100);
} throw new Error('Preview demonstration timed out: ' + label); }
const viewers: Array<{
    call: (method: string, params?: object) => Promise<any>;
    evaluate: (expression: string) => Promise<any>;
    socket: WebSocket;
    child: ReturnType<typeof spawn>;
}> = [];
async function viewer(actor: string) {
    const profile = path.join(fixture.dataDir, 'shared-viewer-' + actor), child = spawn(browserExecutable(), ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
    let port = 0;
    await until(async () => { try {
        port = Number(fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]);
        return port > 0;
    }
    catch {
        return false;
    } }, 'viewer startup');
    const target = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' }).then(r => r.json()), socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise<void>((resolve, reject) => { socket.once('open', resolve); socket.once('error', reject); });
    let seq = 0;
    const pending = new Map<number, {
        resolve: (value: any) => void;
        reject: (error: Error) => void;
    }>();
    socket.on('message', raw => { const message = JSON.parse(String(raw)), task = pending.get(message.id); if (task) {
        pending.delete(message.id);
        message.error ? task.reject(new Error('Trusted viewer protocol failed.')) : task.resolve(message.result);
    } });
    const call = (method: string, params: object = {}) => new Promise<any>((resolve, reject) => { const id = ++seq, timer = setTimeout(() => { pending.delete(id); reject(new Error(method + ' timed out')); }, 15000); pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } }); socket.send(JSON.stringify({ id, method, params })); });
    const evaluate = async (expression: string) => { const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails)
        throw new Error('Trusted viewer evaluation failed: ' + JSON.stringify(result.exceptionDetails)); return result.result.value; };
    const value = { call, evaluate, socket, child };
    viewers.push(value);
    await call('Page.enable');
    await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await call('Page.navigate', { url: fixture.url });
    await wait(250);
    await evaluate(`localStorage.setItem('cocreate-session-${fixture.room.id}',${JSON.stringify(fixture.token(actor))})`);
    await call('Page.navigate', { url: `${fixture.url}/r/${fixture.room.id}` });
    await until(() => evaluate("!!document.querySelector('.document-editor')&&!document.querySelector('.connection-banner')"), 'workspace');
    return value;
}
const click = async (v: Awaited<ReturnType<typeof viewer>>, text: string) => { await until(() => v.evaluate(`(()=>{const button=Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()===${JSON.stringify(text)});return !!button&&!button.disabled})()`), 'button ready: ' + text); await v.evaluate(`Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()===${JSON.stringify(text)}).click()`); };
const choose = (v: Awaited<ReturnType<typeof viewer>>, id: string) => v.evaluate(`(()=>{const s=document.querySelector('.artifact-controls select');s.value=${JSON.stringify(id)};s.dispatchEvent(new Event('change',{bubbles:true}));})()`);
const capture = async (v: Awaited<ReturnType<typeof viewer>>, name: string) => { const image = await v.call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); fs.writeFileSync(path.join(output, name + '.png'), Buffer.from(image.data, 'base64')); };
const input = (v: Awaited<ReturnType<typeof viewer>>, label: string, value: string) => v.evaluate(`(()=>{const element=Array.from(document.querySelectorAll('label')).find(l=>l.textContent.startsWith(${JSON.stringify(label)})).querySelector('input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(element,${JSON.stringify(value)});element.dispatchEvent(new Event('input',{bubbles:true}));})()`);
const selectConnection = (v: Awaited<ReturnType<typeof viewer>>, value: string) => v.evaluate(`(()=>{const element=Array.from(document.querySelectorAll('label')).find(l=>l.textContent.startsWith('Verified connection')).querySelector('select');element.value=${JSON.stringify(value)};element.dispatchEvent(new Event('change',{bubbles:true}));})()`);
try {
    const alice = await viewer('alice'), bob = await viewer('bob');
    for (const v of [alice, bob]) {
        await click(v, 'Artifacts');
        await choose(v, 'preview-releases');
        await until(() => v.evaluate("!!document.querySelector('[aria-label=\"Generated application releases\"]')"), 'release viewer');
    }
    await click(alice, 'Prepare preview plan');
    await until(async () => fixture.room.preview?.plans.length === 1, 'account-free preparation');
    await until(() => alice.evaluate("document.body.innerText.includes('Target unverified.')"), 'reviewable plan');
    await capture(alice, 'prepared-without-account');
    checks.push('Exact frontend v1, source/output hashes and private files prepared with no account or inference.');
    await click(bob, 'Refresh receipts');
    await until(() => bob.evaluate("document.body.innerText.includes('Source SHA-256:')"), 'second participant private plan');
    await choose(bob, 'application');
    assert.equal(await alice.evaluate("document.querySelector('.artifact-controls select').value"), 'preview-releases');
    await choose(bob, 'preview-releases');
    checks.push('Two independent participants can read private plans and retain independent Artifacts selection.');
    await alice.evaluate("document.querySelector('[aria-label=\"Generated application releases\"] > details').open=true");
    await input(alice, 'Account ID', provider.target.accountId);
    await input(alice, 'Existing dedicated Pages project', provider.target.projectName);
    await input(alice, 'Scoped API token', 'synthetic_scoped_token_123456789');
    await click(alice, 'Verify connection');
    await until(async () => fixture.room.preview?.connections.length === 1, 'read-only target verification');
    const connection = fixture.room.preview!.connections[0];
    await selectConnection(alice, connection.id);
    await click(alice, 'Prepare preview plan');
    await until(async () => fixture.room.preview?.plans.length === 2, 'bound plan');
    await until(() => alice.evaluate("document.body.innerText.includes('Controlled account (')"), 'exact target review');
    await click(bob, 'Refresh receipts');
    await until(() => bob.evaluate("document.body.innerText.includes('Controlled account (')"), 'ungranted view');
    assert.equal(await bob.evaluate("Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='Approve and upload preview').disabled"), true);
    checks.push('Verified account/project/unique preview branch is reviewable; membership alone grants no release authority.');
    const approve = async (v: typeof alice) => { await v.evaluate("Array.from(document.querySelectorAll('label')).find(l=>l.textContent.startsWith('I authorize')).querySelector('input').click()"); await click(v, 'Approve and upload preview'); };
    await approve(alice);
    await until(async () => fixture.room.preview?.receipts[0]?.state === 'verified', 'owner release');
    await until(() => alice.evaluate("!!Array.from(document.querySelectorAll('a')).find(a=>a.textContent==='Open verified immutable preview')"), 'verified receipt UI');
    await capture(alice, 'owner-verified-preview');
    checks.push('Owner explicitly approves frozen public preview; one creation, live byte hashes and real isolated render pass.');
    await alice.evaluate("Array.from(document.querySelectorAll('[aria-label=\"Generated application releases\"] > details')).at(-1).open=true;Array.from(document.querySelectorAll('fieldset')).at(-1).querySelector('input').click()");
    await click(alice, 'Save explicit release grants');
    await until(async () => fixture.room.preview!.connections[0].actors.includes('bob'), 'explicit grant');
    await click(alice, 'Prepare preview plan');
    await until(async () => fixture.room.preview?.plans.length === 3, 'new grant-bound plan');
    await click(bob, 'Refresh receipts');
    await until(() => bob.evaluate("document.body.innerText.includes('I authorize')"), 'Bob exact plan');
    await approve(bob);
    await until(async () => fixture.room.preview!.receipts.length === 2 && fixture.room.preview!.receipts.at(-1)!.state === 'verified', 'granted participant release');
    await capture(bob, 'participant-verified-preview');
    checks.push('Explicit owner grant requires a new approval-bound plan; second participant releases and observes durable results.');
    const active = fixture.room.preview!.plans.at(-1)!;
    const saved = await bob.evaluate(`fetch(${JSON.stringify(`${fixture.url}/api/rooms/${fixture.room.id}/previews/plans/${active.id}/files/app.js?token=${encodeURIComponent(fixture.token('bob'))}`)}).then(r=>r.text()).then(t=>t.includes('Controlled generated preview'))`);
    assert.equal(saved, true);
    checks.push('Second participant retrieves the exact saved immutable output through authenticated project access.');
    await click(alice, 'Refresh receipts');
    await until(() => alice.evaluate("Array.from(document.querySelectorAll('button')).some(b=>b.textContent==='Prepare recovery of these exact files')"), 'owner recovery review');
    await click(alice, 'Prepare recovery of these exact files');
    await until(async () => fixture.room.preview?.plans.length === 4, 'recovery plan');
    assert.equal(fixture.room.preview!.plans.at(-1)!.contentRef, active.contentRef);
    await capture(alice, 'reviewable-recovery');
    checks.push('Recovery prepares a new unique preview plan reusing verified immutable bytes; no production rollback mutation.');
    await bob.call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await wait(150);
    assert.equal(await bob.evaluate('document.documentElement.scrollWidth<=innerWidth'), true);
    await capture(bob, 'mobile-release-viewer');
    checks.push('Preview review and hashes fit a 390-pixel viewport.');
    await click(alice, 'Workflow');
    await capture(alice, 'workflow-unchanged');
    assert.equal(fixture.calls.length, 0);
    assert.equal(fixture.room.providerCalls.length, 0);
    assert.equal(provider.control.posts, 2);
    checks.push('Workflow, Canvas and token tracking remain unchanged; zero inference and only controlled provider operations.');
    fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify({ verifiedAt: new Date().toISOString(), scope: 'Two independent local authenticated browser profiles; controlled provider API/asset helper and actual isolated compiler/render verifier. No live Cloudflare account or hosted acceptance.', checks, physicalCalls: 0, controlledDeploymentPosts: provider.control.posts }, null, 2));
    console.log(JSON.stringify({ checks: checks.length, physicalCalls: 0, output }));
}
finally {
    for (const v of viewers) {
        await v.call('Browser.close').catch(() => { });
        v.socket.close();
        if (v.child.exitCode === null)
            await Promise.race([new Promise<void>(resolve => v.child.once('exit', () => resolve())), wait(2000)]);
        if (v.child.exitCode === null) {
            v.child.kill();
            await new Promise<void>(resolve => v.child.once('exit', () => resolve()));
        }
    }
    await fixture.close();
    await provider.close();
}
