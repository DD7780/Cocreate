import express from 'express';
import type { Session } from './auth.js';
import type { Room, RoomManager } from './rooms.js';
import type { SupabasePlatform } from './supabase-platform.js';
import { artifactResponse } from './artifacts.js';
import { coordinatorResponse } from './coordinator-response.js';

export function registerBlenderRoutes(app: express.Express, manager: RoomManager, authorize: (req: express.Request, res: express.Response) => { room: Room; session: Session } | null, platform?: SupabasePlatform) {
  const error = (res: express.Response, exception: unknown) => {
    if (!artifactResponse(res, exception) && !coordinatorResponse(res, exception)) res.status(Number((exception as { status?: number })?.status) || 400).json({ error: exception instanceof Error ? exception.message : 'Blender operation failed.' });
  };
  const fresh = async (room: Room, actor: string, write = false) => { await platform?.requireMembership(room.id, actor, write ? ['owner','editor'] : ['owner','editor','viewer']); await platform?.assertCoordinator(room.id); };
  app.post('/api/rooms/:id/blender/pair', async (req, res) => {
    const auth = authorize(req, res); if (!auth) return;
    try { res.setHeader('Cache-Control','no-store'); res.json(await manager.blenderPair(auth.room, auth.session.participantId, () => fresh(auth.room, auth.session.participantId, true))); } catch (exception) { error(res, exception); }
  });
  app.get('/api/rooms/:id/blender/sessions', async (req, res) => {
    const auth = authorize(req, res); if (!auth) return;
    try { await fresh(auth.room, auth.session.participantId); res.setHeader('Cache-Control','no-store'); res.json({ sessions: manager.blenderSessions(auth.room, auth.session.participantId) }); } catch (exception) { error(res, exception); }
  });
  app.post('/api/rooms/:id/blender/sessions/:sessionId/control', async (req, res) => {
    const auth = authorize(req, res); if (!auth) return;
    try { res.json({ sessions: await manager.blenderControl(auth.room, String(req.params.sessionId), auth.session.participantId, req.body, () => fresh(auth.room, auth.session.participantId, true)) }); } catch (exception) { error(res, exception); }
  });
  // Only this endpoint admits larger output bodies; ordinary Canvas/command limits stay 40 KB.
  app.use('/api/blender/devices', express.json({ limit: '8mb' }));
  const deviceRoom = async (projectId: string) => {
    if (!/^[A-Za-z0-9_-]{1,100}$/.test(projectId)) throw new Error('Invalid project ID.');
    const room = platform ? manager.rooms.get(projectId) : manager.get(projectId);
    if (!room) throw Object.assign(new Error('Reopen the authenticated project to recover its coordinator. Reconnection does not execute tasks.'), { status: 503 });
    return room;
  };
  app.post('/api/blender/devices/:projectId/pair-info', async (req, res) => {
    try { const room = await deviceRoom(String(req.params.projectId)), info = manager.blenderPairInfo(room, String(req.body.pairingToken || '')); await fresh(room, info.ownerId, true); res.setHeader('Cache-Control','no-store'); res.json(info); } catch (exception) { error(res, exception); }
  });
  app.post('/api/blender/devices/:projectId/pair', async (req, res) => {
    try { const room = await deviceRoom(String(req.params.projectId)), token = String(req.headers.authorization?.replace(/^Bearer /,'') || ''), info = manager.blenderPairInfo(room, token); res.setHeader('Cache-Control','no-store'); res.json(await manager.blenderApprove(room, token, req.body, () => fresh(room, info.ownerId, true))); } catch (exception) { error(res, exception); }
  });
  for (const operation of ['poll','result','stop'] as const) app.post(`/api/blender/devices/:projectId/:deviceId/${operation}`, async (req, res) => {
    try {
      const room = await deviceRoom(String(req.params.projectId)), id = String(req.params.deviceId), token = String(req.headers.authorization?.replace(/^Bearer /,'') || '');
      const actor = manager.blenderDeviceOwner(room, id, token), authorizeDevice = async () => { const current = manager.blenderDeviceOwner(room, id, token); await fresh(room, current.ownerId, true); await fresh(room, current.controllerId, true); manager.blenderDeviceOwner(room, id, token); };
      res.setHeader('Cache-Control','no-store');
      res.json(operation === 'poll' ? await manager.blenderPoll(room, id, token, authorizeDevice) : operation === 'result' ? await manager.blenderResult(room, id, token, req.body, authorizeDevice) : await manager.blenderStopped(room, id, token, () => fresh(room, actor.ownerId, true)));
    } catch (exception) { error(res, exception); }
  });
  app.get('/api/rooms/:id/blender/artifacts/:artifactId/versions/:version/:file', async (req, res) => {
    const auth = authorize(req, res); if (!auth) return;
    try {
      const artifactId = String(req.params.artifactId), versionId = Number(req.params.version), file = String(req.params.file);
      if (!/^blend_[a-f0-9]{24}$/.test(artifactId) || !Number.isSafeInteger(versionId) || versionId < 1 || !['scene.blend','render.png'].includes(file)) throw new Error('Select a saved Blender scene or render.');
      const content = await manager.blenderContent(auth.room, artifactId, versionId);
      if (!content) return res.status(404).json({ error: 'Saved Blender version not found in this project.' });
      await fresh(auth.room, auth.session.participantId);
      if (auth.session.exp && auth.session.exp <= Date.now() / 1000) return res.status(401).json({ error: 'Project session expired.' });
      res.setHeader('Cache-Control','no-store'); res.setHeader('X-Content-Type-Options','nosniff'); res.setHeader('Referrer-Policy','no-referrer');
      if (file === 'scene.blend' || req.query.download === '1') res.setHeader('Content-Disposition',`attachment; filename="${artifactId}-v${versionId}.${file === 'scene.blend' ? 'blend' : 'png'}"`);
      res.type(file === 'scene.blend' ? 'application/octet-stream' : 'image/png').send(file === 'scene.blend' ? content.blend : content.png);
    } catch (exception) { error(res, exception); }
  });
}
