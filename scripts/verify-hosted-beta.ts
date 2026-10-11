import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { WebSocket } from 'ws';
import { stagingConfiguration, type StagingTarget } from './prepare-hosted-staging.js';

const roles = ['owner','editor','viewer','unapproved','outsider','revoked'] as const;
type Role = typeof roles[number];
type Account = { userId: string; accessToken: string };
export type HostedFixture = {
  target: StagingTarget; sourceCommit: string; releaseFingerprint: string; projectId: string; otherProjectId: string;
  accounts: Record<Role, Account>; artifactPath: string; artifactSha256: string;
  storagePath: string; storageSha256: string; browserSessionId: string; blenderSessionId: string;
};
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const sha = /^[a-f0-9]{64}$/;

export function validateHostedFixture(value: HostedFixture, production: any): HostedFixture {
  stagingConfiguration(value.target, production);
  if (!/^[a-f0-9]{40}$/.test(value.sourceCommit) || !sha.test(value.releaseFingerprint) || !uuid.test(value.projectId) || !uuid.test(value.otherProjectId) || value.projectId === value.otherProjectId) throw new Error('Require exact candidate commit/fingerprint and two isolated fixture projects.');
  if (!value.accounts || Object.keys(value.accounts).sort().join() !== [...roles].sort().join() || new Set(roles.map(role => value.accounts[role]?.userId)).size !== roles.length) throw new Error('Configure six independent designated account identities.');
  for (const role of roles) {
    const account = value.accounts[role];
    if (!account || !uuid.test(account.userId) || typeof account.accessToken !== 'string' || account.accessToken.length < 20 || account.accessToken.length > 8192 || /\s/.test(account.accessToken)) throw new Error(`Configure a private access token for ${role}.`);
  }
  if (!sha.test(value.artifactSha256) || !sha.test(value.storageSha256) || !uuid.test(value.browserSessionId) || !uuid.test(value.blenderSessionId)) throw new Error('Configure real retained test artifacts and owner-private browser/Blender sessions.');
  if (!value.artifactPath.startsWith(`/api/rooms/${value.projectId}/`) || !/^\/api\/rooms\/[a-f0-9-]+\/(?:download\/\d+|artifacts\/doc_[a-f0-9]{24}\/versions\/\d+|blender\/artifacts\/blend_[a-f0-9]{24}\/versions\/\d+\/(?:scene\.blend|render\.png)|browser-downloads\/[a-f0-9-]+)$/.test(value.artifactPath)) throw new Error('Choose a fixed private artifact download in the test project.');
  if (!value.storagePath.startsWith(`${value.projectId}/`) || value.storagePath.includes('..') || !/^[A-Za-z0-9_./-]+$/.test(value.storagePath)) throw new Error('Choose a private immutable Storage object from this test project.');
  return value;
}

export async function verifyHostedBeta(fixture: HostedFixture, socketProbe = socketStatus) {
  const checks: Array<{ name: string; passed: boolean }> = [];
  const tickets = new Map<Role, string>();
  const disabledGrantChecks: string[] = [];
  const check = (name: string, passed: boolean) => { checks.push({ name, passed }); };
  const hash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
  const json = (bytes: Buffer) => { try { return JSON.parse(bytes.toString()); } catch { return null; } };
  const request = async (origin: string, route: string, token?: string, method = 'GET', body?: object) => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      if (body) headers['Content-Type'] = 'application/json';
      if (origin === fixture.target.supabaseUrl) headers.apikey = fixture.target.publishableKey;
      const response = await fetch(origin + route, { method, headers, body: body ? JSON.stringify(body) : undefined, redirect: 'error', signal: AbortSignal.timeout(10_000) });
      const reader = response.body?.getReader(); const parts: Uint8Array[] = []; let size = 0;
      try { if (reader) for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 8 * 1024 * 1024) throw new Error('Response exceeded fixture bound.'); parts.push(value); } }
      finally { await reader?.cancel(); }
      return { status: response.status, bytes: Buffer.concat(parts), cache: response.headers.get('cache-control') || '' };
    } catch { return { status: 0, bytes: Buffer.alloc(0), cache: '' }; }
  };
  const app = fixture.target.origin, backend = fixture.target.supabaseUrl;
  const health = await request(app, '/__cocreate/app-health');
  check('exact_candidate_health', health.status === 200 && json(health.bytes)?.release_fingerprint === fixture.releaseFingerprint);
  if (!checks[0].passed) return { checks, complete: false, pending: ['Candidate identity mismatch; no account requests sent'] };
  check('public_prelaunch', (await request(app, '/')).status === 200);
  for (const role of roles) {
    const account = fixture.accounts[role];
    const identity = await request(backend, '/auth/v1/user', account.accessToken);
    const valid = identity.status === 200 && json(identity.bytes)?.id === account.userId;
    check(`${role}_real_identity`, valid);
    if (!valid) continue;
    const opened = await request(app, `/api/projects/${fixture.projectId}/session`, account.accessToken, 'POST');
    const member = ['owner','editor','viewer'].includes(role);
    if (member && opened.status === 200) {
      const data = json(opened.bytes) || {};
      check(`${role}_project_role`, data.role === role && data.participantId === account.userId && typeof data.token === 'string');
      if (data.role === role && data.participantId === account.userId && typeof data.token === 'string') tickets.set(role, data.token);
    } else check(`${role}_project_access`, !member && opened.status === 403);
    const rows = await request(backend, `/rest/v1/projects?select=id&id=eq.${fixture.projectId}`, account.accessToken);
    check(`${role}_direct_RLS`, rows.status === 200 && JSON.stringify(json(rows.bytes)) === JSON.stringify(member ? [{ id: fixture.projectId }] : []));
    const otherRows = await request(backend, `/rest/v1/projects?select=id&id=eq.${fixture.otherProjectId}`, account.accessToken);
    check(`${role}_cross_project_RLS`, otherRows.status === 200 && JSON.stringify(json(otherRows.bytes)) === '[]');
    const stored = await request(backend, `/storage/v1/object/authenticated/cocreate-artifacts/${fixture.storagePath}`, account.accessToken);
    check(`${role}_private_storage`, member ? stored.status === 200 && hash(stored.bytes) === fixture.storageSha256 : [400,401,403,404].includes(stored.status));
    const cross = await request(app, `/api/projects/${fixture.otherProjectId}/session`, account.accessToken, 'POST');
    check(`${role}_cross_project_denied`, cross.status === 403);
    if (role === 'unapproved') check('beta_approval_required', (await request(app, '/api/projects', account.accessToken)).status === 403);
    if (role === 'outsider' || role === 'revoked') {
      const listed = await request(app, '/api/projects', account.accessToken);
      const data = json(listed.bytes);
      check(`${role}_approval_not_membership`, listed.status === 200 && Array.isArray(data?.projects) && !data.projects.some((item: any) => item.id === fixture.projectId || item.id === fixture.otherProjectId));
    }
  }
  for (const role of roles) {
    const ticket = tickets.get(role);
    const saved = await request(app, fixture.artifactPath, ticket);
    check(`${role}_private_artifact`, ticket ? saved.status === 200 && hash(saved.bytes) === fixture.artifactSha256 && saved.cache.includes('no-store') : saved.status === 401);
    if (ticket) {
      check(`${role}_room_state`, (await request(app, `/api/rooms/${fixture.projectId}/state`, ticket)).status === 200);
      const crossArtifact = await request(app, fixture.artifactPath.replace(fixture.projectId, fixture.otherProjectId), ticket);
      check(`${role}_cross_project_artifact_denied`, [401,403].includes(crossArtifact.status));
      if (role === 'viewer') {
        for (const [name, route, body] of [
          ['submit', '/submit', { requestId: 'hosted-viewer-denial' }],
          ['budget_reset', '/workflow-budget/reset', { requestId: 'hosted-viewer-denial' }],
          ['provider_connection', '/previews/connections', {}],
        ] as const) check(`viewer_${name}_denied`, (await request(app, `/api/rooms/${fixture.projectId}${route}`, ticket, 'POST', body)).status === 403);
        check('viewer_project_edit_denied', (await request(app, `/api/projects/${fixture.projectId}`, fixture.accounts.viewer.accessToken, 'PATCH', { title: 'Hosted permission fixture denial' })).status === 403);
        check('viewer_role_escalation_denied', (await request(app, `/api/projects/${fixture.projectId}/members/${fixture.accounts.viewer.userId}`, fixture.accounts.viewer.accessToken, 'PATCH', { role: 'editor' })).status === 403);
      }
      if (role !== 'owner') for (const [kind, id] of [['browser', fixture.browserSessionId], ['blender/sessions', fixture.blenderSessionId]]) {
        const frame = await request(app, `/api/rooms/${fixture.projectId}/${kind}/${id}/frame`, ticket);
        if (frame.status === 503) disabledGrantChecks.push(`${role}_${kind}: capability disabled; grant enforcement untested`);
        else check(`${role}_${kind}_separate_grant`, frame.status === 403);
      }
    }
    check(`${role}_socket`, await socketProbe(app, fixture.projectId, ticket, Boolean(ticket)));
  }
  const publicObject = await request(backend, `/storage/v1/object/public/cocreate-artifacts/${fixture.storagePath}`);
  check('storage_public_URL_denied', [400,401,403,404].includes(publicObject.status));
  const anonymousRows = await request(backend, `/rest/v1/projects?select=id&id=eq.${fixture.projectId}`);
  check('anonymous_direct_RLS', [401,403].includes(anonymousRows.status) || anonymousRows.status === 200 && JSON.stringify(json(anonymousRows.bytes)) === '[]');
  check('anonymous_project_api_denied', (await request(app, '/api/projects')).status === 401);
  check('anonymous_artifact_denied', (await request(app, fixture.artifactPath)).status === 401);
  check('anonymous_socket_denied', await socketProbe(app, fixture.projectId, undefined, false));
  return {
    checkedAt: new Date().toISOString(), sourceCommit: fixture.sourceCommit, releaseFingerprint: fixture.releaseFingerprint, stagingOrigin: app,
    environment: socketProbe === socketStatus ? 'designated isolated staging' : 'controlled test transport', checks, complete: false,
    permissionChecksPassed: checks.every(item => item.passed),
    pending: [...disabledGrantChecks, 'Interactive signed-in browser demonstration', 'Revocation of an already-open ticket/socket', 'Concurrent caller-only submission and replay with controlled inference', 'Coordinator replacement/expiry and unknown outcomes', 'Generated application live provider acceptance', 'Authorized platform production release and smoke checks'],
  };
}

async function socketStatus(origin: string, projectId: string, token: string | undefined, allowed: boolean) {
  return new Promise<boolean>(resolve => {
    const url = new URL('/ws', origin); url.protocol = 'wss:'; url.searchParams.set('room', projectId);
    if (token) url.searchParams.set('token', token);
    const socket = new WebSocket(url, { origin, handshakeTimeout: 10_000 });
    const timer = setTimeout(() => finish(false), 12_000);
    const finish = (passed: boolean) => { clearTimeout(timer); socket.removeAllListeners(); socket.on('error', () => {}); socket.terminate(); resolve(passed); };
    socket.once('open', () => { if (!allowed) finish(false); });
    socket.on('message', (raw, binary) => { if (!binary) { try { if (JSON.parse(raw.toString()).type === 'room-state') finish(allowed); } catch { finish(false); } } });
    socket.once('unexpected-response', (_request, response) => { response.resume(); finish(!allowed && [401,403].includes(response.statusCode || 0)); });
    socket.once('error', () => finish(false));
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const credentials = path.resolve('.runtime/hosted-beta/credentials.json');
  if (!process.argv.includes('--run-staging')) throw new Error('Configure the private fixture, then explicitly select --run-staging. No requests were sent.');
  try {
    const info = fs.lstatSync(credentials);
    if (!info.isFile() || info.isSymbolicLink() || process.platform !== 'win32' && (info.mode & 0o077) !== 0) throw new Error('Require a private regular credential fixture.');
    const fixture = validateHostedFixture(JSON.parse(fs.readFileSync(credentials, 'utf8')), JSON.parse(fs.readFileSync('wrangler.jsonc', 'utf8')));
    const result = await verifyHostedBeta(fixture);
    fs.writeFileSync('.runtime/hosted-beta/permission-evidence.json', JSON.stringify(result, null, 2) + '\n', { mode: 0o600 });
    console.log(JSON.stringify({ passed: result.checks.filter(item => item.passed).length, total: result.checks.length, releaseComplete: false, evidence: '.runtime/hosted-beta/permission-evidence.json' }));
    if (result.checks.some(item => !item.passed)) process.exitCode = 1;
  } catch { console.error('Hosted beta probe failed. Check private fixture, target identity, token freshness and connectivity. Credentials and response bodies are not logged.'); process.exitCode = 1; }
}
