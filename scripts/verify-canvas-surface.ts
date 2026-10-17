import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import WebSocket from 'ws';

// Local, controlled-mode browser checks for the Canvas writing surface. AI stays disconnected,
// so any submission attempt is refused client-side and no provider call can occur.
process.env.NODE_ENV = 'production';
process.env.TWOGUYS1CANVAS_AUTH_MODE = 'local';
const { createTwoGuysOneCanvasServer } = await import('../server/index.js');
const { createSession } = await import('../server/auth.js');
const output = path.resolve('artifacts/canvas-writing-surface');
const runtime = path.resolve(`output/canvas-surface-${process.pid}`);
fs.mkdirSync(output, { recursive: true });
fs.mkdirSync(runtime, { recursive: true });
const secret = 'local-canvas-surface-fixture';
const service = await createTwoGuysOneCanvasServer({ port: 0, host: '127.0.0.1', serveClient: true, dataDir: path.join(runtime, 'data'), sessionSecret: secret });
const room = service.manager.create('canvas-surface-fixture');
for (const [id, name] of [['alice', 'Alice'], ['bob', 'Bob']]) service.manager.join(room, id, name);
await service.manager.save(room);
const { url } = await service.start();
const port = 9650 + process.pid % 150;
const browser = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run', `--remote-debugging-port=${port}`, `--user-data-dir=${path.join(runtime, 'browser')}`, 'about:blank'], { stdio: 'ignore' });
const sockets: WebSocket[] = [], errors: string[] = [], checks: Record<string, unknown>[] = [];
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
function connect(endpoint: string) {
  return new Promise<{ call: (method: string, params?: Record<string, unknown>) => Promise<any> }>((resolve, reject) => {
    const socket = new WebSocket(endpoint); sockets.push(socket);
    let sequence = 0;
    const pending = new Map<number, { resolve: (result: any) => void; reject: (error: Error) => void }>();
    const call = (method: string, params = {}) => new Promise<any>((resolve, reject) => {
      const id = ++sequence; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params }));
    });
    socket.addEventListener('message', event => {
      const message = JSON.parse(String(event.data));
      if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
      if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map((arg: any) => arg.value ?? arg.description).join(' '));
      const next = pending.get(message.id);
      if (next) { pending.delete(message.id); message.error ? next.reject(new Error(message.error.message)) : next.resolve(message.result); }
    });
    socket.addEventListener('open', () => resolve({ call }), { once: true });
    socket.addEventListener('error', event => reject(new Error(`Browser connection failed: ${event.message}`)), { once: true });
  });
}
async function until(condition: () => Promise<boolean>, label: string) {
  for (let i = 0; i < 100; i++) { if (await condition()) return; await wait(100); }
  throw new Error(`Timed out: ${label}`);
}
const geometry = `(() => {
  const rect = element => { const r = element.getBoundingClientRect(); return { left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height), bottom: Math.round(r.bottom), right: Math.round(r.right) }; };
  const content = document.querySelector('.content'), paper = document.querySelector('.paper'), editor = document.querySelector('.document-editor'), first = editor.firstElementChild;
  const before = getComputedStyle(first, '::before');
  return {
    viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, contentWidth: content.clientWidth,
    contentScroll: { top: Math.round(content.scrollTop), height: content.scrollHeight, client: content.clientHeight },
    paper: rect(paper), editor: rect(editor), firstLine: rect(first),
    placeholder: before.content, placeholderColor: before.color,
    sidebar: !!document.querySelector('.document-layout .agent-panel'), anyPanel: !!document.querySelector('.agent-panel'),
    oldBox: document.body.innerText.includes('START WRITING') || getComputedStyle(editor, '::before').content.includes('START'),
    focused: document.activeElement === editor, text: editor.innerText.trim(),
    meta: document.querySelector('.doc-meta').innerText.replace(/\\s+/g, ' '),
  };
})()`;
try {
  let endpoint = '';
  await until(async () => { try { endpoint = (await fetch(`http://127.0.0.1:${port}/json/version`).then(r => r.json()) as any).webSocketDebuggerUrl; return !!endpoint; } catch { return false; } }, 'browser startup');
  const controller = await connect(endpoint);
  const open = async (participantId: string) => {
    const { browserContextId } = await controller.call('Target.createBrowserContext');
    const { targetId } = await controller.call('Target.createTarget', { url: 'about:blank', browserContextId });
    const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json()) as any[];
    const client = await connect(targets.find(target => target.id === targetId).webSocketDebuggerUrl);
    const evaluate = async (expression: string) => {
      const response = await client.call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
      return response.result.value;
    };
    const resize = async (width: number, height = 900) => { await client.call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 }); await wait(200); };
    const click = async (x: number, y: number) => {
      for (const type of ['mousePressed', 'mouseReleased']) await client.call('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
      await wait(80);
    };
    const key = async (keyName: string, code: string, keyCode: number, modifiers = 0) => {
      await client.call('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: keyName, code, windowsVirtualKeyCode: keyCode, modifiers });
      await client.call('Input.dispatchKeyEvent', { type: 'keyUp', key: keyName, code, windowsVirtualKeyCode: keyCode, modifiers });
    };
    const wheel = async (x: number, y: number, deltaY: number) => { await client.call('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY }); await wait(250); };
    const type = async (text: string) => { await client.call('Input.insertText', { text }); await wait(40); };
    const shot = async (name: string) => { const { data } = await client.call('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(output, name), Buffer.from(data, 'base64')); };
    await client.call('Page.enable'); await client.call('Runtime.enable');
    await resize(1440);
    await client.call('Page.navigate', { url });
    await until(async () => await evaluate('location.origin') === url, 'origin');
    await evaluate(`localStorage.setItem('2guys1canvas-session-${room.id}', ${JSON.stringify(createSession(secret, { roomId: room.id, participantId, name: participantId, role: participantId === 'alice' ? 'owner' : 'editor' }))})`);
    await client.call('Page.navigate', { url: `${url}/r/${room.id}` });
    try { await until(async () => await evaluate(`!!document.querySelector('.document-editor > p') && !document.querySelector('.connection-banner')`), `${participantId} canvas mount`); }
    catch (error) { throw new Error(`${String(error)}: ${await evaluate(`location.href + ' | ' + document.body.innerText.slice(0, 600) + ' | ' + (document.querySelector('.document-editor')?.outerHTML.slice(0, 300) ?? 'no editor')`)}`); }
    return { evaluate, resize, click, key, wheel, type, shot };
  };
  const alice = await open('alice'), bob = await open('bob');
  const callsBefore = room.providerCalls.length, runsBefore = room.aiRuns.length;

  // Empty editor at each width: no sidebar or reserved column, subtle placeholder at the top-left caret position.
  for (const width of [1440, 1024, 768, 390]) {
    await alice.resize(width);
    const g = await alice.evaluate(geometry);
    assert.equal(g.sidebar, false, `sidebar at ${width}`);
    assert.equal(g.anyPanel, false, `panel on Canvas at ${width}`);
    assert.equal(g.oldBox, false, `old empty box at ${width}`);
    assert.ok(g.scrollWidth <= width, `horizontal overflow at ${width}: ${g.scrollWidth}`);
    assert.equal(g.paper.width, g.contentWidth, `paper fills content at ${width}`);
    assert.equal(g.placeholder, '"Start writing…"', `placeholder at ${width}`);
    const inset = g.firstLine.left - g.paper.left;
    assert.ok(inset >= 16 && inset <= 96, `left margin ${inset} at ${width}`);
    assert.ok(g.editor.width >= g.paper.width - 2 * 96 - 1, `editor width ${g.editor.width} of ${g.paper.width}`);
    assert.ok(g.firstLine.top - g.paper.top <= 110, `first line offset ${g.firstLine.top - g.paper.top} at ${width}`);
    assert.ok(g.editor.bottom >= g.paper.bottom - 260, `editor fills height at ${width}`);
    checks.push({ check: `empty-${width}`, inset, firstLineOffset: g.firstLine.top - g.paper.top, paper: g.paper.width, editor: g.editor.width, contentWidth: g.contentWidth });
    await alice.shot(`empty-${width}.png`);
  }

  // Blank right margin click focuses the editor and typing lands on the first line.
  await alice.resize(1440);
  let g = await alice.evaluate(geometry);
  await alice.click(g.paper.right - 30, g.firstLine.top + 8);
  assert.equal(await alice.evaluate(`document.activeElement === document.querySelector('.document-editor')`), true, 'margin click focus');
  await alice.type('Hello from the margin');
  g = await alice.evaluate(geometry);
  assert.equal(g.text, 'Hello from the margin');
  assert.equal(g.placeholder, 'none', 'placeholder hides after typing');
  checks.push({ check: 'right-margin-click-focus-and-type', text: g.text });

  // Blur, then click far below the text inside the editor's grown area and type a new paragraph.
  await alice.evaluate(`document.activeElement.blur()`);
  await alice.click(Math.round(g.paper.left + g.paper.width / 2), g.paper.bottom - 40);
  assert.equal(await alice.evaluate(`document.activeElement === document.querySelector('.document-editor')`), true, 'bottom click focus');
  await alice.key('Enter', 'Enter', 13); await alice.type('Second line from blank space');
  // Formatting control remains usable.
  await alice.evaluate(`document.querySelector('.toolbar button[title="Bold"]').click()`); await alice.type(' bold');
  assert.equal(await alice.evaluate(`document.querySelector('.document-editor strong')?.textContent`), ' bold');
  await alice.evaluate(`document.querySelector('.toolbar button[title="Heading 2"]').click()`);
  assert.equal(await alice.evaluate(`!!document.querySelector('.document-editor h2')`), true);
  checks.push({ check: 'bottom-click-focus-and-format', paragraphs: await alice.evaluate(`document.querySelector('.document-editor').children.length`) });

  // Collaboration and presence: Bob receives text and sees Alice's caret.
  await until(async () => (await bob.evaluate(`document.querySelector('.document-editor').innerText`)).includes('Second line from blank space'), 'bob sync');
  await until(async () => await bob.evaluate(`!!document.querySelector('.collaboration-carets__caret')`), 'bob sees alice caret');
  checks.push({ check: 'collaboration-and-presence', bobCaretLabel: await bob.evaluate(`document.querySelector('.collaboration-carets__label')?.textContent`) });

  // Save status reflects the confirmed server save rather than a premature label.
  // .doc-meta is uppercase-transformed, so innerText reports “SYNCED”.
  let meta = '';
  try { await until(async () => /synced \d/i.test(meta = (await alice.evaluate(geometry)).meta), 'synced status'); }
  catch (error) { throw new Error(`${String(error)}: ${meta}`); }
  checks.push({ check: 'save-status', meta: (await alice.evaluate(geometry)).meta });

  // Populated document grows and scrolls vertically; clicking below the end appends there.
  await alice.evaluate(`document.querySelector('.document-editor').focus()`);
  await alice.key('End', 'End', 35, 2);
  for (let i = 1; i <= 45; i++) { await alice.key('Enter', 'Enter', 13); await alice.type(`Paragraph ${i}: the shared canvas keeps a calm document rhythm while collaborators add longer passages of planning text.`); }
  g = await alice.evaluate(geometry);
  assert.ok(g.contentScroll.height > g.contentScroll.client * 2, `content scrolls: ${JSON.stringify(g.contentScroll)}`);
  assert.ok(g.editor.height > 1800, `editor grew: ${g.editor.height}`);
  assert.ok(g.scrollWidth <= 1440);
  await alice.shot('populated-1440-top.png');
  await alice.evaluate(`document.querySelector('.content').scrollTop = 0`);
  await alice.shot('populated-1440-start.png');
  await alice.evaluate(`document.activeElement.blur(); document.querySelector('.content').scrollTop = 1e6`);
  await wait(150);
  g = await alice.evaluate(geometry);
  assert.ok(g.contentScroll.top > 0, 'scrolled down');
  await alice.click(Math.round(g.paper.left + 200), g.paper.bottom - 30);
  await alice.type(' END');
  assert.match(await alice.evaluate(`document.querySelector('.document-editor').lastElementChild.textContent`), / END$/);
  await alice.shot('populated-1440-end.png');
  checks.push({ check: 'populated-scroll', editorHeight: g.editor.height, scroll: g.contentScroll });

  for (const width of [1024, 768, 390]) {
    await alice.resize(width);
    g = await alice.evaluate(geometry);
    assert.ok(g.scrollWidth <= width && !g.sidebar && g.paper.width === g.contentWidth, `populated ${width}: ${JSON.stringify({ s: g.scrollWidth, p: g.paper.width, c: g.contentWidth })}`);
    await alice.evaluate(`document.querySelector('.content').scrollTop = 0`);
    await alice.shot(`populated-${width}.png`);
    checks.push({ check: `populated-${width}`, inset: g.firstLine.left - g.paper.left, paper: g.paper.width });
  }

  // Editor-focused Alt+X still routes through submission; with AI disconnected it is refused locally.
  await alice.resize(1440);
  await alice.evaluate(`document.querySelector('.document-editor').focus()`);
  await alice.key('x', 'KeyX', 88, 1);
  await until(async () => await alice.evaluate(`document.querySelector('.submission-notice')?.textContent === 'Connect an AI model before submitting changes.'`), 'Alt+X submission notice');
  assert.equal(await alice.evaluate(`document.activeElement === document.querySelector('.document-editor')`), true, 'focus preserved');
  checks.push({ check: 'alt-x-routes-to-submission', notice: 'Connect an AI model before submitting changes.' });

  // Split view and Artifacts keep their existing layout; Artifacts retains the reusable Shared context view.
  await alice.evaluate(`[...document.querySelectorAll('.control-actions button')].find(button => button.textContent.includes('Split view')).click()`);
  await wait(200);
  const split = await alice.evaluate(`({ document: !!document.querySelector('.is-split .document-layout .paper'), product: !!document.querySelector('.is-split .artifacts-layout'), panel: !!document.querySelector('.agent-panel'), width: document.documentElement.scrollWidth })`);
  assert.ok(split.document && split.product && !split.panel && split.width <= 1440, JSON.stringify(split));
  await alice.shot('split-1440.png');
  const splitTop = await alice.evaluate(`document.querySelector('.document-editor').getBoundingClientRect().top`);
  await alice.wheel(300, 600, 900);
  const splitScrolled = splitTop - await alice.evaluate(`document.querySelector('.document-editor').getBoundingClientRect().top`);
  assert.ok(splitScrolled > 200, `split document scrolls: ${splitScrolled}`);
  await alice.evaluate(`[...document.querySelectorAll('.tabs button')].find(button => button.textContent === 'Artifacts').click()`);
  await wait(200);
  assert.equal(await alice.evaluate(`!!document.querySelector('.artifacts-layout > .agent-panel .intent-revision-selector')`), true, 'Artifacts keeps Shared context');
  checks.push({ check: 'split-and-artifacts', split, splitScrolled, artifactsPanel: true });

  assert.equal(room.providerCalls.length, callsBefore, 'no provider calls');
  assert.equal(room.aiRuns.length, runsBefore, 'no AI runs');
  assert.deepEqual(errors, []);
  checks.push({ check: 'inference-free', providerCalls: room.providerCalls.length - callsBefore, aiRuns: room.aiRuns.length - runsBefore, consoleErrors: errors.length });
  fs.writeFileSync(path.join(output, 'browser-checks.json'), JSON.stringify({ recordedAt: new Date().toISOString(), mode: 'local controlled, AI disconnected', checks }, null, 2) + '\n');
  console.log(`Canvas surface checks passed: ${checks.length}`);
} finally {
  for (const socket of sockets) socket.close();
  browser.kill();
  await service.stop();
  await wait(300);
  try { fs.rmSync(runtime, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch { console.warn(`Left browser profile at ${runtime}`); }
}
