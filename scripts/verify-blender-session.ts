// Two independent local browser profiles; controlled provider, no hosted identities or paid calls.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import WebSocket from 'ws';
import { createCanvasArtifactsFixture } from '../tests/fixtures/canvas-artifacts.js';
import { runBlenderCompanion } from '../server/blender-companion.js';
import { BLENDER_OPERATIONS } from '../shared/blender.js';
import { browserExecutable } from '../server/isolation/browser.js';

process.env.NODE_ENV = 'production';
process.env.COCREATE_AUTH_MODE = 'local';
const interactive = process.argv.includes('--interactive');
const output = path.resolve(interactive ? '.runtime/interactive-blender/browser' : 'artifacts/blender-session/browser');
fs.mkdirSync(output, { recursive: true });
const fixture = await createCanvasArtifactsFixture({ client: true });
const browserPath = process.env.COCREATE_UI_BROWSER || (interactive ? browserExecutable() : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe');
const checks: string[] = [];
let companionFailure: unknown;
const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
async function until(check: () => Promise<boolean>, label: string, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) { if (companionFailure) throw companionFailure; if (await check()) return; await wait(100); }
  throw new Error(`Browser check timed out: ${label}`);
}
type Browser = { call: (method: string, params?: object) => Promise<any>; evaluate: (expression: string) => Promise<any>; socket: WebSocket; processHandle: ReturnType<typeof spawn>; actor: string };
const browsers: Browser[] = [];
async function open(actor: string): Promise<Browser> {
  const profile = path.join(fixture.dataDir, `browser-${actor}`);
  // These profiles load only our controlled application fixture, never generated or third-party code.
  const processHandle = spawn(browserPath, ['--headless=new', '--disable-gpu', ...(process.platform === 'linux' ? ['--no-sandbox'] : []), '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore', windowsHide: true });
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
const executable = interactive ? '/opt/cocreate-blender/blender' : process.env.COCREATE_BLENDER_EXECUTABLE;
if (!executable) throw new Error('Real Blender acceptance requires COCREATE_BLENDER_EXECUTABLE.');
const companionStop = new AbortController(), localStates: string[] = [];
let companion: Promise<void> | undefined;
try {
  const alice = await open('alice'), bob = await open('bob');
  await clickText(alice, 'nav button', 'Artifacts'); await selectArtifact(alice, 'Connected Blender');
  await clickText(bob, 'nav button', 'Artifacts');
  await until(() => alice.evaluate("!!document.querySelector('.blender-session')"), 'Blender session view');
  assert.equal(fixture.calls.length, 0); checks.push('Independent browser navigation/view selection makes no inference or execution.');
  await clickText(alice, 'button', 'Connect my computer');
  await until(() => alice.evaluate("!!document.querySelector('.blender-pair input[autocomplete=off]')"), 'pairing token');
  const pairingToken = await alice.evaluate("document.querySelector('.blender-pair input[autocomplete=off]').value");
  const workspace = interactive ? fs.mkdtempSync(path.resolve('.runtime/gui-browser-')) : path.resolve('.runtime/blender-browser-tasks');
  fs.mkdirSync(workspace, { recursive: true, mode: 0o700 });
  companion = runBlenderCompanion({server:fixture.url,projectId:fixture.room.id,pairingToken,executable,workspace,interactive,observe:['bob'],control:['bob'],operations:[...BLENDER_OPERATIONS],name:interactive?'Verified dedicated Linux Blender':'Verified Windows Blender',signal:companionStop.signal,onState:value=>localStates.push(value),approveLocal:async approval=>{
    assert.equal(approval.ownerId,'alice'); assert.equal(approval.executable,path.resolve(executable)); assert.deepEqual(approval.observe,['bob']); assert.deepEqual(approval.control,['bob']);
    checks.push('Controlled local owner explicitly approves executable, workspace, operations and separate Bob session grants.'); return true;
  }});
  void companion.catch(error => { companionFailure = error; });
  await until(async () => !!fixture.room.blender?.devices.length, 'locally approved device');
  await until(() => alice.evaluate("document.querySelector('.blender-session')?.textContent.includes('Human control')"), 'connected actual executor');
  await clickText(alice, 'button', 'Hide pairing token');
  if (interactive) {
    const readyButton = (browser: Browser, text: string) => until(() => browser.evaluate(`Array.from(document.querySelectorAll('.blender-session button')).some(item=>item.textContent===${JSON.stringify(text)}&&!item.disabled)`), 'ready interactive control: ' + text);
    await readyButton(alice, 'Open dedicated app');
    await clickText(alice, 'button', 'Open dedicated app');
    await until(() => alice.evaluate("document.querySelector('[alt=\"Live dedicated Blender application\"]')?.naturalWidth===960"), 'actual owner app frame');
    await selectArtifact(bob, 'Connected Blender');
    await until(() => bob.evaluate("document.querySelector('[alt=\"Live dedicated Blender application\"]')?.naturalWidth===960"), 'actual granted observer app frame');
    assert.equal(await bob.evaluate("Array.from(document.querySelectorAll('.blender-session button')).find(item=>item.textContent==='g').disabled"), true);
    await screenshot(alice, 'owner-live-dedicated-app');
    await screenshot(bob, 'observer-live-dedicated-app');
    checks.push('Two independent authenticated profiles observe real isolated Blender frames; the observer cannot input.');
    await alice.evaluate("(()=>{const select=document.querySelector('.blender-controls select');select.value='bob';select.dispatchEvent(new Event('change',{bubbles:true}));})()");
    await clickText(alice, 'button', 'Hand off control');
    await readyButton(bob, 'Escape');
    assert.equal(fixture.room.blender!.devices[0].epoch, 2);
    await until(() => alice.evaluate("Array.from(document.querySelectorAll('.blender-session button')).find(item=>item.textContent==='g').disabled"), 'prior controller fenced in UI');
    await clickText(bob, 'button', 'Escape');
    await readyButton(bob, 'g');
    await bob.evaluate("(()=>{const image=document.querySelector('[alt=\"Live dedicated Blender application\"]'),r=image.getBoundingClientRect();image.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:r.left+r.width*450/960,clientY:r.top+r.height*300/640}));})()");
    for (const key of ['g', 'x']) {
      await readyButton(bob, key); await clickText(bob, 'button', key);
    }
    await bob.evaluate("(()=>{const input=Array.from(document.querySelectorAll('label')).find(item=>item.textContent.startsWith('Numeric input')).querySelector('input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'2');input.dispatchEvent(new Event('input',{bubbles:true}));})()");
    await readyButton(bob, 'Send numeric input'); await clickText(bob, 'button', 'Send numeric input');
    await readyButton(bob, 'Return'); await clickText(bob, 'button', 'Return');
    await readyButton(bob, 'Save scene and render'); await clickText(bob, 'button', 'Save scene and render');
    await until(async () => !!fixture.room.blenderArtifacts?.length, 'manual private publication');
    const saved = fixture.room.blenderArtifacts![0];
    await selectArtifact(bob, saved.title);
    await until(() => bob.evaluate("document.querySelector('.blender-render')?.naturalWidth===512"), 'manual saved render');
    const links = await bob.evaluate("Array.from(document.querySelectorAll('.document-artifact a[download]')).map(item=>item.href)");
    assert.equal(links.length, 2);
    for (const link of links) { const response = await fetch(link); assert.equal(response.status, 200); assert.ok((await response.arrayBuffer()).byteLength > 1000); }
    assert.equal(await alice.evaluate("document.querySelector('.artifact-controls select').value"), 'blender-session');
    await screenshot(bob, 'participant-private-saved-results');
    checks.push('Explicit handoff enables real UI input and private manual save/retrieval, with independent Artifacts selection.');
    companionStop.abort(); await companion;
    assert.equal(fixture.room.blender!.devices[0].state, 'revoked');
    assert.equal(fixture.calls.length, 0);
    await clickText(alice, 'nav button', 'Workflow');
    assert.match(await alice.evaluate("document.querySelector('#workflow-usage').textContent"), /0 recorded attempts/);
    checks.push('Local STOP removes the entire display job; manual viewing/input/saving makes zero inference calls and preserves Workflow accounting.');
    fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify({ verifiedAt: new Date().toISOString(), scope: 'Two independent local browser profiles, actual isolated Linux Blender 4.5.14 GUI and companion; not hosted identities.', checks, physicalCalls: 0 }, null, 2));
    console.log('INTERACTIVE_ARTIFACTS_UI', JSON.stringify({ checks: checks.length, profiles: 2, actualGui: true, physicalCalls: fixture.calls.length }));
  } else {
  await clickText(bob, 'nav button', 'Canvas'); await write(bob, 'Write a Markdown document titled "Bob notes".');
  await clickText(alice, 'nav button', 'Canvas'); await write(alice, 'Create a Blender scene titled "Demo" with a blue cube, camera and lighting. Save the scene and render an image.');
  await wait(300); assert.equal(fixture.calls.length,0); checks.push('Typing from two participants does not execute; Bob draft remains unsubmitted.');
  await clickText(alice, 'button', 'Build my changes');
  await until(async () => !!fixture.room.blenderArtifacts?.length, 'real .blend and PNG publication');
  assert.deepEqual(fixture.calls.map(call=>call.kind),['interpretation','blender']); assert.equal(fixture.room.documentArtifacts?.length||0,0);
  checks.push('Explicit Alice Canvas submission runs actual isolated Blender, saves a scene and renders a PNG.');
  await clickText(alice, 'nav button', 'Artifacts');
  await until(() => alice.evaluate("!!document.querySelector('.blender-session img')?.complete && document.querySelector('.blender-session img')?.naturalWidth===512"), 'completed execution preview');
  assert.match(await alice.evaluate("document.querySelector('.blender-session').textContent"), /background execution, not a live desktop stream/);
  await screenshot(alice,'owner-execution-preview'); checks.push('Artifacts displays the actual saved render with an honest background-execution label.');
  await clickText(bob, 'nav button', 'Artifacts'); await selectArtifact(bob,'Demo');
  await until(() => bob.evaluate("document.querySelector('.blender-render')?.naturalWidth===512"), 'teammate saved render');
  const downloads=await bob.evaluate("Array.from(document.querySelectorAll('.document-artifact a[download]')).map(item=>item.href)");
  assert.equal(downloads.length,2);
  for(const link of downloads){const response=await fetch(link);assert.equal(response.status,200);assert.ok((await response.arrayBuffer()).byteLength>1000);}
  checks.push('Bob independently previews/downloads both private results without becoming the active controller.');
  assert.equal(await alice.evaluate("document.querySelector('.artifact-controls select').value"),'blender-session');
  await screenshot(bob,'teammate-saved-results');
  await selectArtifact(bob,'Connected Blender');
  await until(() => bob.evaluate("!!document.querySelector('.blender-session button')"), 'Bob granted observer view');
  assert.equal(await bob.evaluate("Array.from(document.querySelectorAll('.blender-session button')).find(item=>item.textContent==='Pause').disabled"),true);
  await alice.evaluate("(()=>{const select=Array.from(document.querySelectorAll('.blender-controls select'))[0];select.value='bob';select.dispatchEvent(new Event('change',{bubbles:true}));})()");
  await clickText(alice,'button','Hand off control');
  await until(async()=>fixture.room.blender?.devices[0].controllerId==='bob','explicit handoff');
  await until(()=>bob.evaluate("!Array.from(document.querySelectorAll('.blender-session button')).find(item=>item.textContent==='Pause').disabled"),'Bob current control');
  assert.equal(fixture.room.blender!.devices[0].epoch,2); await screenshot(bob,'explicit-handoff'); checks.push('Only explicit handoff activates a locally granted controller and advances its epoch.');
  const before=fixture.calls.length;
  await clickText(bob,'button','Pause'); await until(async()=>!!fixture.room.blender?.devices[0].paused,'pause');
  await until(()=>bob.evaluate("Array.from(document.querySelectorAll('.blender-session button')).some(item=>item.textContent==='Resume'&&!item.disabled)"),'Resume control ready');
  await clickText(bob,'button','Resume'); await until(async()=>!fixture.room.blender?.devices[0].paused,'resume'); assert.equal(fixture.calls.length,before);
  companionStop.abort(); await companion;
  await until(async()=>fixture.room.blender?.devices[0].state==='revoked','local stop'); checks.push('Local stop revokes the connection; saved results remain independently accessible.');
  await selectArtifact(bob,'Demo'); await bob.call('Page.reload');
  await until(()=>bob.evaluate("!!document.querySelector('.document-editor') && !document.querySelector('.connection-banner')"),'reconnect');
  await clickText(bob,'nav button','Artifacts'); await until(()=>bob.evaluate("document.querySelector('.blender-render')?.naturalWidth===512"),'saved selection after reload'); assert.equal(fixture.calls.length,before); checks.push('Reload preserves participant-local selection and private saved results without replay.');
  await clickText(alice,'nav button','Workflow');
  assert.match(await alice.evaluate("document.querySelector('#workflow-usage').textContent"),new RegExp(`${fixture.calls.length} recorded attempts`)); await screenshot(alice,'workflow-accounting'); checks.push('Workflow layout and physical-call totals remain unchanged.');
  await bob.call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true}); await wait(250);assert.equal(await bob.evaluate('document.documentElement.scrollWidth<=window.innerWidth'),true);await screenshot(bob,'mobile-saved-render');checks.push('Saved render controls fit a 390 px viewport.');
  fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify({verifiedAt:new Date().toISOString(),scope:'Two independent local browser profiles, controlled provider, actual Windows Blender 4.5.14 AppContainer execution; not hosted accounts or interactive streaming.',checks,localStates,physicalCalls:fixture.calls.length,reportedTokens:fixture.manager.view(fixture.room).physicalUsage.recorded.inputTokens+fixture.manager.view(fixture.room).physicalUsage.recorded.outputTokens},null,2));
  console.log(JSON.stringify({checks:checks.length,calls:fixture.calls.length,output}));
  }
} catch (error) {
  console.error('Blender browser acceptance failed:', error);
  throw error;
} finally {
  companionStop.abort();await companion?.catch(() => undefined);
  for(const browser of browsers){
    await browser.call('Browser.close').catch(()=>undefined);
    browser.socket.close();
    if(browser.processHandle.exitCode===null) await Promise.race([new Promise<void>(resolve=>browser.processHandle.once('exit',()=>resolve())),wait(2000)]);
    if(browser.processHandle.exitCode===null){browser.processHandle.kill();await new Promise<void>(resolve=>browser.processHandle.once('exit',()=>resolve()));}
  }
  await fixture.close();
}
