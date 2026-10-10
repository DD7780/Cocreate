// Two independent local browser profiles; controlled provider, no hosted identities or paid calls.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import WebSocket from 'ws';
import { createCanvasArtifactsFixture } from '../tests/fixtures/canvas-artifacts.js';

process.env.NODE_ENV = 'production';
process.env.COCREATE_AUTH_MODE = 'local';
const output = path.resolve('artifacts/canvas-artifacts/browser');
fs.mkdirSync(output, { recursive: true });
const fixture = await createCanvasArtifactsFixture({ client: true });
const browserPath = process.env.COCREATE_UI_BROWSER || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const checks: string[] = [];
const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
async function until(check: () => Promise<boolean>, label: string, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) { if (await check()) return; await wait(100); }
  throw new Error(`Browser check timed out: ${label}`);
}
type Browser = { call: (method: string, params?: object) => Promise<any>; evaluate: (expression: string) => Promise<any>; socket: WebSocket; processHandle: ReturnType<typeof spawn>; actor: string };
const browsers: Browser[] = [];
async function open(actor: string): Promise<Browser> {
  const profile = path.join(fixture.dataDir, `browser-${actor}`);
  const processHandle = spawn(browserPath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore', windowsHide: true });
  let port = 0;
  await until(async () => { try { port = Number(fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]); return port > 0; } catch { return false; } }, 'debug port');
  let target: { webSocketDebuggerUrl: string } | undefined;
  await until(async () => { try { target = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' }).then(value => value.json()); return !!target?.webSocketDebuggerUrl; } catch { return false; } }, 'browser startup');
  const socket = new WebSocket(target!.webSocketDebuggerUrl);
  await new Promise<void>((resolve, reject) => { socket.addEventListener('open', () => resolve(), { once: true }); socket.addEventListener('error', reject, { once: true }); });
  let sequence = 0;
  const pending = new Map<number, { resolve: (value: any) => void; reject: (error: Error) => void }>();
  socket.addEventListener('message', event => { const value = JSON.parse(String(event.data)), item = pending.get(value.id); if (item) { pending.delete(value.id); value.error ? item.reject(new Error(value.error.message)) : item.resolve(value.result); } });
  const call = (method: string, params: object = {}) => new Promise<any>((resolve, reject) => {
    const id = ++sequence, timer = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)); }, 15000);
    pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression: string) => {
    const value = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (value.exceptionDetails) throw new Error(JSON.stringify(value.exceptionDetails)); return value.result.value;
  };
  const browser = { call, evaluate, socket, processHandle, actor };
  browsers.push(browser);
  await call('Page.enable'); await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await call('Page.navigate', { url: fixture.url }); await wait(250);
  await evaluate(`localStorage.setItem('cocreate-session-${fixture.room.id}',${JSON.stringify(fixture.token(actor))})`);
  await call('Page.navigate', { url: `${fixture.url}/r/${fixture.room.id}` });
  await until(() => evaluate("!!document.querySelector('.document-editor') && !document.querySelector('.connection-banner')"), 'workspace connected');
  return browser;
}
const clickText = (browser: Browser, selector: string, text: string) => browser.evaluate(`Array.from(document.querySelectorAll(${JSON.stringify(selector)})).find(item=>item.textContent.trim()===${JSON.stringify(text)}).click()`);
const write = async (browser: Browser, text: string) => { await browser.evaluate("document.querySelector('.document-editor').focus()"); await browser.call('Input.insertText', { text }); };
const selectArtifact = (browser: Browser, title: string) => browser.evaluate(`(()=>{const select=document.querySelector('.artifact-controls select');select.value=Array.from(select.options).find(option=>option.textContent.startsWith(${JSON.stringify(title)})).value;select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
const screenshot = async (browser: Browser, name: string) => { const result = await browser.call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); fs.writeFileSync(path.join(output, `${name}.png`), Buffer.from(result.data, 'base64')); };
try {
  const alice = await open('alice'), bob = await open('bob');
  await write(bob, 'Create a Markdown document titled "Notes" with a section "Decisions".');
  await write(alice, 'Create a Markdown document titled "Brief" with sections "Summary" and "Risks".');
  await wait(300); assert.equal(fixture.calls.length, 0); checks.push('Typing in two participant sessions makes no inference.');
  await clickText(alice, 'button', 'Build my changes');
  await until(async () => !!fixture.room.documentArtifacts?.some(item => item.title === 'Brief'), 'first document');
  assert.equal(fixture.room.documentArtifacts?.some(item => item.title === 'Notes'), false); assert.ok(fixture.room.pending.get('bob')?.length);
  checks.push('Alice submission captures Alice only; Bob draft remains unsubmitted.');
  await clickText(alice, 'nav button', 'Artifacts');
  await until(() => alice.evaluate("!!document.querySelector('.markdown-document h1')"), 'document viewer');
  const counts = fixture.calls.length;
  await clickText(bob, 'nav button', 'Artifacts'); await wait(250); assert.equal(fixture.calls.length, counts);
  checks.push('Opening Artifacts is inference-free.');
  await clickText(bob, 'nav button', 'Canvas'); await clickText(bob, 'button', 'Build my changes');
  await until(async () => fixture.room.documentArtifacts?.length === 2, 'second document');
  await clickText(bob, 'nav button', 'Artifacts'); await selectArtifact(bob, 'Notes');
  await until(() => bob.evaluate("document.querySelector('.markdown-document h1')?.textContent==='Notes'"), 'Bob Notes selection');
  assert.equal(await alice.evaluate("document.querySelector('.markdown-document h1').textContent"), 'Brief');
  checks.push('Two participants retain independent artifact selections.');
  await clickText(alice, 'button', 'View source'); assert.match(await alice.evaluate("document.querySelector('.document-source').textContent"), /## Risks/);
  const download = await alice.evaluate("document.querySelector('.document-artifact a[download]').href");
  const response = await fetch(download); assert.equal(response.status, 200); assert.match(await response.text(), /# Brief/); checks.push('Source inspection and authenticated Markdown download.');
  await clickText(alice, 'button', 'Read document');
  await clickText(alice, 'nav button', 'Canvas');
  fixture.control.markdown = '# Brief\n\n## Summary\n\n## Risks\n\n<script>window.generatedExecuted=true</script>\n<img src=x onerror="window.generatedExecuted=true">\n\n[unsafe](javascript:alert) [safe](https://example.com)';
  await write(alice, ' Update document "Brief" with a section "Summary".'); await clickText(alice, 'button', 'Build my changes');
  await until(async () => fixture.room.documentArtifacts?.find(item => item.title === 'Brief')?.versions.length === 2, 'Brief revision');
  await clickText(alice, 'nav button', 'Artifacts');
  await until(() => alice.evaluate("document.querySelector('.markdown-document')?.textContent.includes('window.generatedExecuted')"), 'hostile source safely visible');
  assert.equal(await alice.evaluate("!!window.generatedExecuted || !!document.querySelector('.markdown-document script,.markdown-document img,.markdown-document a[href^=javascript]')"), false);
  checks.push('Hostile HTML/scripts/images and unsafe links remain inert.');
  await alice.evaluate("(()=>{const select=document.querySelectorAll('.artifact-controls select')[1];select.value='1';select.dispatchEvent(new Event('change',{bubbles:true}));})()");
  await until(() => alice.evaluate("!document.querySelector('.markdown-document')?.textContent.includes('window.generatedExecuted')"), 'historical version');
  assert.match(await alice.evaluate("document.querySelector('.document-artifact .preview-bar').textContent"), /v1/);
  await screenshot(alice, 'alice-brief-v1'); await screenshot(bob, 'bob-notes-v1');
  const beforeReload = fixture.calls.length;
  await alice.call('Page.reload'); await bob.call('Page.reload');
  await until(() => alice.evaluate("!!document.querySelector('.document-editor') && !document.querySelector('.connection-banner')"), 'Alice reconnect');
  await until(() => bob.evaluate("!!document.querySelector('.document-editor') && !document.querySelector('.connection-banner')"), 'Bob reconnect');
  await clickText(alice, 'nav button', 'Artifacts'); await clickText(bob, 'nav button', 'Artifacts');
  await until(() => alice.evaluate("document.querySelector('.markdown-document h1')?.textContent==='Brief'"), 'saved Alice selection');
  await until(() => bob.evaluate("document.querySelector('.markdown-document h1')?.textContent==='Notes'"), 'saved Bob selection');
  assert.match(await alice.evaluate("document.querySelector('.document-artifact .preview-bar').textContent"), /v1/); assert.equal(fixture.calls.length, beforeReload);
  checks.push('Selections/version survive reload and reconnect without inference.');
  await clickText(alice, 'nav button', 'Workflow');
  const usage = await alice.evaluate("document.querySelector('#workflow-usage').textContent"); assert.match(usage, new RegExp(`${fixture.calls.length} recorded attempts`)); checks.push('Existing Workflow layout records the same physical-call totals.');
  await screenshot(alice, 'workflow');
  await clickText(alice, 'nav button', 'Artifacts'); await alice.call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true }); await wait(250);
  assert.equal(await alice.evaluate('document.documentElement.scrollWidth<=window.innerWidth'), true); await screenshot(alice, 'mobile-document'); checks.push('390 px document controls remain within viewport.');
  fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify({ verifiedAt: new Date().toISOString(), scope: 'Two independent local Chrome profiles, synthetic provider only; not hosted accounts.', checks, physicalCalls: fixture.calls.length, reportedTokens: fixture.manager.view(fixture.room).physicalUsage.recorded.inputTokens + fixture.manager.view(fixture.room).physicalUsage.recorded.outputTokens }, null, 2));
  console.log(JSON.stringify({ checks: checks.length, calls: fixture.calls.length, output }));
} finally {
  for (const browser of browsers) { browser.socket.close(); browser.processHandle.kill(); await new Promise<void>(resolve => { if (browser.processHandle.exitCode !== null) resolve(); else browser.processHandle.once('exit', () => resolve()); }); }
  await fixture.close();
}
