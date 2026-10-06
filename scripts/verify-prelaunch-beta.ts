// Controlled UI checks only: synthetic identities, private temp SQLite, no email/provider/hosted DB.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import { SupabasePlatform } from "../server/supabase-platform.js";
import { LocalWaitlist } from "../server/beta.js";

process.env.NODE_ENV = "production";
const { createCoCreateServer } = await import("../server/index.js");
const output = path.resolve("artifacts/prelaunch-beta/browser");
fs.mkdirSync(output, { recursive: true });
const directory = fs.mkdtempSync(path.join(os.tmpdir(), "cocreate-beta-ui-"));
const local = new LocalWaitlist(directory),
  approved = new Set(["owner", "approved"]);
const platform = new SupabasePlatform({
  url: "https://synthetic.supabase.co",
  publishableKey: "sb_publishable_synthetic",
  secretKey: "sb_secret_synthetic",
});
platform.verifyUser = async (token) => {
  if (!["owner", "approved", "pending"].includes(token))
    throw Object.assign(new Error("Sign in again"), { status: 401 });
  return {
    id: token,
    email: `${token}@example.test`,
    user_metadata: { full_name: token },
  };
};
platform.hasBetaAccess = async (user) => approved.has(user);
platform.registerWaitlist = async (email, key) => local.register(email, key);
platform.listProjects = async (token) => {
  const user = await platform.verifyUser(token);
  await platform.requireBetaAccess(user.id);
  return { projects: [], total: 0, nextOffset: null };
};
const service = await createCoCreateServer({
  platform,
  port: 0,
  host: "127.0.0.1",
  dataDir: directory,
});
const { url } = await service.start();
const chrome = path.resolve(
  ".runtime/browser/154.0.8037.92/chrome-headless-shell-win64/chrome-headless-shell.exe",
);
const port = 9650 + (process.pid % 100);
const browser = spawn(
  chrome,
  [
    "--headless",
    "--no-sandbox",
    "--disable-gpu",
    "--no-first-run",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${path.join(directory, "browser")}`,
    "about:blank",
  ],
  { stdio: "ignore", windowsHide: true },
);
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let socket: WebSocket | undefined;
const checks: Record<string, unknown> = {
  scope:
    "Controlled local HTTP, SQLite and mocked account/approval UI. No hosted database, live identity, email or provider verification.",
};
try {
  let target: any;
  for (let i = 0; i < 100 && !target; i++) {
    await wait(100);
    try {
      target = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
        method: "PUT",
      }).then((r) => r.json());
    } catch {}
  }
  assert.ok(target?.webSocketDebuggerUrl, "Chrome startup");
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise<void>((resolve, reject) => {
    socket!.addEventListener("open", () => resolve(), { once: true });
    socket!.addEventListener("error", reject, { once: true });
  });
  let next = 0;
  const pending = new Map<
    number,
    { resolve: (value: any) => void; reject: (error: Error) => void }
  >();
  socket.addEventListener("message", (event) => {
    const reply = JSON.parse(String(event.data));
    const task = pending.get(reply.id);
    if (task) {
      pending.delete(reply.id);
      reply.error
        ? task.reject(new Error(reply.error.message))
        : task.resolve(reply.result);
    }
  });
  const call = (method: string, params = {}) =>
    new Promise<any>((resolve, reject) => {
      const id = ++next;
      pending.set(id, { resolve, reject });
      socket!.send(JSON.stringify({ id, method, params }));
    });
  const evaluate = async (expression: string) => {
    const reply = await call("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (reply.exceptionDetails)
      throw new Error(JSON.stringify(reply.exceptionDetails));
    return reply.result.value;
  };
  const until = async (expression: string) => {
    for (let i = 0; i < 100; i++) {
      try {
        if (await evaluate(`!!document.body && (${expression})`)) return;
      } catch (error) {
        if (!/Inspected target navigated|Execution context was destroyed|Cannot find context/.test(String(error))) throw error;
      }
      await wait(100);
    }
    throw new Error(`UI timeout: ${expression}`);
  };
  await call("Page.enable");
  await call("Runtime.enable");
  await call("Network.enable");
  await call("Network.setBlockedURLs", {
    urls: [
      "https://*.supabase.co/*",
      "https://fonts.googleapis.com/*",
      "https://fonts.gstatic.com/*",
    ],
  });
  await call("Page.navigate", { url });
  await until("!!document.querySelector('.landing h1')");
  const desktop = await evaluate(
    "({heading:document.querySelector('h1').innerText,forms:document.forms.length,video:!!document.querySelector('video,iframe'),planned:document.body.innerText.includes('Planned: automatic routing'),overflow:document.documentElement.scrollWidth>innerWidth})",
  );
  assert.match(desktop.heading, /One canvas/);
  assert.equal(desktop.forms, 1);
  assert.equal(desktop.video, false);
  assert.equal(desktop.planned, true);
  checks.desktop = desktop;
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1000],
    ["mobile", 390, 844],
    ["narrow", 320, 800],
    ["zoom200", 720, 500],
  ] as const) {
    await call("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: name === "zoom200" ? 2 : 1,
      mobile: false,
    });
    await wait(100);
    const layout = await evaluate(
      "({width:innerWidth,scroll:document.documentElement.scrollWidth})",
    );
    assert.ok(layout.scroll <= layout.width, `${name} has horizontal overflow`);
    checks[name] = layout;
    const screenshot = await call("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    fs.writeFileSync(
      path.join(output, `${name}.png`),
      Buffer.from(screenshot.data, "base64"),
    );
  }
  await call("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  checks.reducedMotion = await evaluate(
    "matchMedia('(prefers-reduced-motion:reduce)').matches",
  );
  assert.equal(checks.reducedMotion, true);
  await evaluate("document.activeElement?.blur()");
  await call("Page.navigate", { url });
  await until("!!document.querySelector('.landing-skip')");
  await call("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Tab",
    code: "Tab",
    windowsVirtualKeyCode: 9,
  });
  await call("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Tab",
    code: "Tab",
    windowsVirtualKeyCode: 9,
  });
  checks.keyboardSkip = await evaluate(
    "document.activeElement.classList.contains('landing-skip')",
  );
  assert.equal(checks.keyboardSkip, true);
  await evaluate(
    "document.querySelector('#waitlist-email').value='browser@example.test';document.querySelector('[name=consent]').checked=true;document.querySelector('#waitlist').scrollIntoView()",
  );
  // Delay the actual endpoint response to inspect loading and durable-first UI.
  await evaluate(
    "window.originalFetch=window.fetch;window.fetch=async(...args)=>{const response=await window.originalFetch(...args);await new Promise(resolve=>setTimeout(resolve,700));return response};document.forms[0].requestSubmit()",
  );
  await until("document.forms[0].getAttribute('aria-busy')==='true'");
  assert.equal(
    await evaluate("!!document.querySelector('.waitlist-success')"),
    false,
  );
  await until("!!document.querySelector('.waitlist-success')");
  checks.waitlist = await evaluate(
    "document.querySelector('.waitlist-success').innerText",
  );
  const db = new DatabaseSync(path.join(directory, "beta-waitlist.sqlite"));
  assert.equal(
    (db.prepare("SELECT count(*) n FROM registrations").get() as { n: number })
      .n,
    1,
  );
  db.close();
  checks.durableBeforeSuccess = true;
  await call("Page.navigate", { url });
  await until("!!document.forms[0]");
  await evaluate(
    "window.fetch=async()=>new Response(JSON.stringify({error:'Registration could not be saved. Please try again.'}),{status:503,headers:{'Content-Type':'application/json'}});document.querySelector('#waitlist-email').value='retry@example.test';document.querySelector('[name=consent]').checked=true;document.forms[0].requestSubmit()",
  );
  await until("!!document.querySelector('.waitlist-error')");
  assert.equal(
    await evaluate("!!document.querySelector('.waitlist-success')"),
    false,
  );
  checks.errorRetryAvailable = await evaluate(
    "!document.querySelector('form button').disabled",
  );
  await call("Page.navigate", { url: url + "/login?returnTo=%2Fapp" });
  await until("document.body.innerText.includes('Beta tester sign-in')");
  checks.login = true;
  await call("Page.navigate", {
    url: url + "/forgot-password?returnTo=%2Fapp",
  });
  await until("!!document.querySelector('.auth-form')");
  checks.recovery = true;
  const publicUrl =
    process.env.VITE_SUPABASE_URL || "https://dnsapasubeoxxsgkiotw.supabase.co";
  const sessionKey = `sb-${new URL(publicUrl).hostname.split(".")[0]}-auth-token`;
  const setSession = async (actor: string) =>
    evaluate(
      `localStorage.setItem(${JSON.stringify(sessionKey)},JSON.stringify({access_token:${JSON.stringify(actor)},refresh_token:'synthetic-refresh',expires_at:Math.floor(Date.now()/1000)+3600,expires_in:3600,token_type:'bearer',user:{id:${JSON.stringify(actor)},email:${JSON.stringify(actor + "@example.test")},user_metadata:{}}}))`,
    );
  await setSession("pending");
  await call("Page.navigate", { url: url + "/invite/retained-token" });
  await until(
    "document.body.innerText.includes('Your beta access is pending')",
  );
  checks.pendingInvite = await evaluate(
    "({preserved:document.body.innerText.includes('has not been accepted or erased'),switch:document.body.innerText.includes('Log out / switch account'),workspace:!!document.querySelector('.project-app'),path:location.pathname})",
  );
  assert.equal((checks.pendingInvite as any).preserved, true);
  assert.equal((checks.pendingInvite as any).workspace, false);
  fs.writeFileSync(
    path.join(output, "pending.png"),
    Buffer.from(
      (await call("Page.captureScreenshot", { format: "png" })).data,
      "base64",
    ),
  );
  try {
    await evaluate(`localStorage.setItem('cocreate-session-fixture','old-ticket');localStorage.setItem('cocreate-product-storage-fixture','old-cache');const originalFetch=window.fetch;window.fetch=(...args)=>String(args[0]).startsWith(${JSON.stringify(publicUrl + '/auth/v1/logout')})?Promise.resolve(new Response(null,{status:204})):originalFetch(...args);[...document.querySelectorAll('button')].find(button=>button.textContent.includes('Log out / switch account')).click()`);
  } catch(error) {
    if (!/Inspected target navigated|Execution context was destroyed|Cannot find context/.test(String(error))) throw error;
  }
  await until("location.pathname==='/login' && !!document.querySelector('.auth-form')");
  checks.accountSwitch=await evaluate("({returnTo:new URLSearchParams(location.search).get('returnTo'),cacheCleared:!localStorage.getItem('cocreate-session-fixture')&&!localStorage.getItem('cocreate-product-storage-fixture')})");
  assert.equal((checks.accountSwitch as any).returnTo,'/invite/retained-token');
  assert.equal((checks.accountSwitch as any).cacheCleared,true);
  await setSession('pending');
  approved.add("pending");
  await call("Page.navigate", { url: url + "/app" });
  await until(
    "document.body.innerText.includes('Your shared work starts here')",
  );
  checks.approvedApp = true;
  approved.delete("pending");
  await call("Page.reload");
  await until(
    "document.body.innerText.includes('Your beta access is pending')",
  );
  checks.revocation = true;
  await setSession("owner");
  await call("Page.navigate", { url: url + "/app" });
  await until(
    "document.body.innerText.includes('Your shared work starts here')",
  );
  checks.ownerApp = true;
  await call("Page.navigate", { url });
  await until("!!document.querySelector('.landing h1')");
  checks.publicWhileSignedIn = true;
  fs.writeFileSync(
    path.join(output, "checks.json"),
    JSON.stringify(checks, null, 2),
  );
  console.log(JSON.stringify(checks, null, 2));
} catch (error) {
  fs.writeFileSync(
    path.join(output, "failure.json"),
    JSON.stringify({ checks, error: String(error) }, null, 2),
  );
  throw error;
} finally {
  socket?.close();
  browser.kill();
  await service.stop();
  local.close();
  assert.ok(
    directory.startsWith(path.resolve(os.tmpdir()) + path.sep),
  ); /* Browser holds its disposable profile briefly; retain only in OS temp for OS cleanup. */
}
