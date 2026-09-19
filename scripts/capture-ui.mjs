import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const label = process.argv[2] || 'current';
const origin = 'http://localhost:5173';
const outputDir = path.resolve('artifacts/ui-redesign');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

fs.mkdirSync(outputDir, { recursive: true });
const room = await fetch(`${origin}/api/rooms`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
}).then(response => response.json());
const session = await fetch(`${origin}/api/session`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ roomId: room.roomId, name: 'Alex Morgan' }),
}).then(response => response.json());

const port = 9750 + (process.pid % 150);
const profile = path.join(os.tmpdir(), `cocreate-capture-${process.pid}-${Date.now()}`);
fs.mkdirSync(profile, { recursive: true });
const browser = spawn(chrome, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-gpu-sandbox',
  '--disable-gpu-compositing', '--disable-software-rasterizer', '--disable-features=Vulkan',
  '--no-first-run', '--no-default-browser-check', `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' });
let socket;

try {
  let target;
  for (let attempt = 0; attempt < 80 && !target; attempt += 1) {
    await wait(100);
    try { target = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' }).then(response => response.json()); } catch {}
  }
  if (!target) throw new Error('Chrome did not start.');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const task = pending.get(message.id);
    pending.delete(message.id);
    message.error ? task.reject(new Error(message.error.message)) : task.resolve(message.result);
  });
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const callId = ++id;
    const timer = setTimeout(() => reject(new Error(`${method} timed out`)), 15_000);
    pending.set(callId, {
      resolve: value => { clearTimeout(timer); resolve(value); },
      reject: error => { clearTimeout(timer); reject(error); },
    });
    socket.send(JSON.stringify({ id: callId, method, params }));
  });
  const evaluate = async expression => (await call('Runtime.evaluate', {
    expression, returnByValue: true, awaitPromise: true,
  })).result.value;

  await call('Page.enable');
  await call('Runtime.enable');
  await call('Page.navigate', { url: origin });
  await wait(500);
  await evaluate(`localStorage.setItem('cocreate-session-${room.roomId}',${JSON.stringify(session.token)});localStorage.setItem('cocreate-name','Alex Morgan')`);
  await call('Page.navigate', { url: `${origin}/r/${room.roomId}` });
  for (let attempt = 0; attempt < 60 && !await evaluate(`!!document.querySelector('.document-editor')`); attempt += 1) await wait(100);
  await evaluate(`document.querySelector('[aria-label="Close API connections"]')?.click();document.querySelector('.document-editor')?.focus()`);
  await call('Input.insertText', { text: 'A neighborhood restaurant website\nSeasonal menu, reservations, and a warm story about the kitchen.\nMake opening hours and location easy to find.' });
  await wait(300);

  const sizes = [
    ['desktop', 1440, 900], ['wide', 1280, 800], ['compact', 1024, 768],
    ['tablet', 768, 900], ['mobile', 390, 844],
    // A 720 CSS-pixel viewport represents a 1440px viewport at 200% browser zoom.
    ['zoom200', 720, 450],
  ];
  const metrics = [];
  for (const [name, width, height] of sizes) {
    await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
    await wait(250);
    const measurement = await evaluate(`(()=>{const visible=selector=>{const node=document.querySelector(selector);if(!node)return false;const style=getComputedStyle(node),box=node.getBoundingClientRect();return style.display!=='none'&&style.visibility!=='hidden'&&box.width>0&&box.height>0};const api=[...document.querySelectorAll('button')].find(button=>button.textContent.includes('API connections'));return{name:${JSON.stringify(name)},viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,document:visible('.document-layout'),editor:visible('.document-editor'),build:visible('.control-actions .primary'),apiVisible:!!api&&visible('.api-connections'),apiLabel:api?.textContent.trim(),navigation:visible('.tabs'),supportPresent:!!document.querySelector('.agent-panel'),paperWidth:Math.round(document.querySelector('.paper')?.getBoundingClientRect().width||0)}})()`);
    if (measurement.scrollWidth > measurement.viewport) throw new Error(`${name} has horizontal overflow: ${measurement.scrollWidth} > ${measurement.viewport}`);
    if (!measurement.document || !measurement.editor || !measurement.build || !measurement.apiVisible || !measurement.navigation || !measurement.supportPresent) throw new Error(`${name} hides an essential workspace control: ${JSON.stringify(measurement)}`);
    if (!measurement.apiLabel?.includes('API connections')) throw new Error(`${name} loses the API connections label`);
    metrics.push(measurement);
    const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(path.join(outputDir, `${label}-${name}.png`), Buffer.from(shot.data, 'base64'));
  }

  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent.includes('Split view'))?.click()`);
  await wait(200);
  const split = await evaluate(`({document:!!document.querySelector('.document-layout'),product:!!document.querySelector('.product-shell'),overflow:document.documentElement.scrollWidth>innerWidth})`);
  if (!split.document || !split.product || split.overflow) throw new Error(`Split view regression: ${JSON.stringify(split)}`);

  await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent.includes('Document'))?.click()`);
  const longDocument = await evaluate(`(()=>{const editor=document.querySelector('.document-editor');for(let index=0;index<45;index+=1)editor.insertAdjacentHTML('beforeend','<p>Long-form planning paragraph '+index+' keeps the collaborative brief readable.</p>');editor.insertAdjacentHTML('beforeend','<p data-long-end>End of long document</p>');document.querySelector('[data-long-end]').scrollIntoView();const box=document.querySelector('[data-long-end]').getBoundingClientRect();const content=document.querySelector('.content');return{pageScrollable:content.scrollHeight>content.clientHeight,endReachable:box.top>=0&&box.bottom<=innerHeight+1}})()`);
  if (!longDocument.pageScrollable || !longDocument.endReachable) throw new Error(`Long document is not reachable: ${JSON.stringify(longDocument)}`);

  await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent.includes('Product'))?.click()`);
  await wait(250);
  let shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(outputDir, `${label}-product.png`), Buffer.from(shot.data, 'base64'));

  await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent.includes('API connections'))?.click()`);
  await wait(250);
  const dialog = await evaluate(`({label:document.querySelector('[role="dialog"]')?.getAttribute('aria-labelledby'),heading:document.querySelector('[role="dialog"] h2')?.id,scrollable:document.querySelector('[role="dialog"]')?.scrollHeight>=document.querySelector('[role="dialog"]')?.clientHeight})`);
  if (!dialog.label || dialog.label !== dialog.heading) throw new Error(`API dialog is not accessibly labelled: ${JSON.stringify(dialog)}`);
  shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(outputDir, `${label}-dialog.png`), Buffer.from(shot.data, 'base64'));
  await evaluate(`document.querySelector('[aria-label="Close API connections"]')?.click()`);
  await wait(100);
  const focusReturned = await evaluate(`document.activeElement?.classList.contains('api-connections')`);
  if (!focusReturned) throw new Error('API dialog did not return focus to its launcher.');

  console.log(JSON.stringify({ label, metrics, split, longDocument, dialog, focusReturned }));
} finally {
  socket?.close();
  browser.kill();
}
