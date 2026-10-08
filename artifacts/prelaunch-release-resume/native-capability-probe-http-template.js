// Temporary operator code only. Never part of the application release.
const probePath = '/__cocreate/operator-cgroup-probe';
const probeHash = '__TASK_NONCE_SHA256__';
const probeExpires = __TASK_EXPIRY_MILLISECONDS__;
async function probeAuthorized(value) {
  if (Date.now() > probeExpires || typeof value !== 'string' || value.length !== 64) return false;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('') === probeHash;
}
async function boundedProbeOutput(stream, process) {
  if (!stream) return '';
  const reader = stream.getReader(); let bytes = 0, result = '';
  const decoder = new TextDecoder();
  try {
    for (;;) {
      const chunk = await reader.read(); if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 4096) { process.kill(9); throw new Error('Operator diagnostic output exceeded 4 KiB.'); }
      result += decoder.decode(chunk.value, {stream: true});
    }
    return result + decoder.decode();
  } finally { reader.releaseLock(); }
}
// Inject only this method into the exact currently deployed Container subclass.
async function operatorCapabilityMethod(nonce) {
  if (!await probeAuthorized(nonce) || this.operatorProbeUsed) throw new Error('Operator probe unavailable.');
  if (!this.ctx.container.running) throw new Error('Container is not running; no start requested.');
  if (typeof this.ctx.container.exec !== 'function') throw new Error('Native Container exec is unavailable.');
  this.operatorProbeUsed = true;
  const output = [];
  // Native exec requires uid:gid; names fail with an internal error. These match the existing image users.
  for (const user of ['1000:1000', '0:0']) {
    const command = 'id; uname -r; /usr/bin/bwrap --version; /usr/bin/findmnt -n -o FSTYPE,OPTIONS /sys/fs/cgroup; test -w /sys/fs/cgroup && echo CGROUP_WRITABLE || echo CGROUP_NOT_WRITABLE; cat /sys/fs/cgroup/cgroup.controllers 2>/dev/null; cat /sys/fs/cgroup/cgroup.subtree_control 2>/dev/null; cat /proc/self/cgroup; cat /proc/sys/kernel/unprivileged_userns_clone 2>/dev/null; cat /proc/sys/user/max_user_namespaces 2>/dev/null';
    let process;
    try { process = await this.ctx.container.exec(['/usr/bin/env', '-i', 'PATH=/usr/bin:/bin', '/usr/bin/timeout', '--signal=KILL', '5', '/bin/sh', '-c', command], {user, stdout: 'pipe', stderr: 'pipe'}); }
    catch (error) { return {scope: 'Fixed read-only capability probe', phase: 'native-exec-start', user, output, diagnostic: String(error?.message || 'Native exec failed').replaceAll(nonce, '[redacted]').replace(/https?:\/\/\S+/g, '[redacted URL]').slice(0, 500)}; }
    const timer = setTimeout(() => process.kill(9), 6000);
    try {
      const [stdout, stderr, exitCode] = await Promise.all([boundedProbeOutput(process.stdout, process), boundedProbeOutput(process.stderr, process), process.exitCode]);
      output.push({user, stdout, stderr, exitCode});
    } finally { clearTimeout(timer); }
  }
  return {scope: 'Fixed read-only identity/kernel/cgroup metadata; no environment or project content', output};
}
// Inject only this branch before the exact deployed Worker's existing fetch handler.
async function operatorFetchBranch(request, env) {
  if (new URL(request.url).pathname !== probePath) return null;
  const nonce = request.headers.get('x-cocreate-operator-nonce');
  if (request.method !== 'POST' || !await probeAuthorized(nonce)) return Response.json({error: 'Not found.'}, {status: 404, headers: {'x-cocreate-operator-ready': probeHash.slice(0, 16), 'Cache-Control': 'no-store'}});
  try {
    const stub = getContainer(env.COCREATE_CONTAINER, 'primary');
    const probeRequest = method => new Request(request.url, {method, headers: {'x-cocreate-operator-nonce': nonce}});
    const ready = await stub.fetch(probeRequest('GET'));
    if (ready.headers.get('x-cocreate-operator-do-ready') !== probeHash.slice(0, 16)) {
      await ready.arrayBuffer();
      return Response.json({error: 'Container class propagation pending.'}, {status: 503, headers: {'Cache-Control': 'no-store'}});
    }
    const metadata = await ready.json();
    if (!metadata.running || !metadata.execAvailable) return Response.json({error: 'Running native execution unavailable.', metadata}, {status: 503});
    return await stub.fetch(probeRequest('POST'));
  } catch (error) {
    const reason = String(error?.message || 'Native probe execution failed.').replaceAll(nonce || '', '[redacted]').replace(/https?:\/\/\S+/g, '[redacted URL]').slice(0, 500);
    return Response.json({error: 'Fixed operator capability probe unavailable.', reason}, {status: 503, headers: {'Cache-Control': 'no-store'}});
  }
}
// Handle only the approved internal path. Other traffic retains the existing Container fetch behavior.
async function operatorContainerFetch(request) {
  if (new URL(request.url).pathname !== probePath) return null;
  const nonce = request.headers.get('x-cocreate-operator-nonce');
  if (!await probeAuthorized(nonce)) return Response.json({error: 'Not found.'}, {status: 404});
  if (request.method === 'GET') return Response.json({running: !!this.ctx.container?.running, execAvailable: typeof this.ctx.container?.exec === 'function'}, {headers: {'x-cocreate-operator-do-ready': probeHash.slice(0, 16), 'Cache-Control': 'no-store'}});
  if (request.method !== 'POST') return Response.json({error: 'Not found.'}, {status: 404});
  return Response.json(await operatorCapabilityMethod.call(this, nonce), {headers: {'Cache-Control': 'no-store'}});
}
