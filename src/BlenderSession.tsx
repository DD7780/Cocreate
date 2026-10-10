import { useEffect, useState } from 'react';
import type { RoomView } from '../shared/types';
import type { BlenderSessionView } from '../shared/blender';
import { api, tokenRole } from './api';

export function BlenderRender({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false), [retry, setRetry] = useState(0);
  useEffect(() => { setFailed(false); setRetry(0); }, [src]);
  return failed ? <div className="preview-empty" role="alert"><p>Saved render unavailable. Reopen the project or reload the verified content.</p><button onClick={() => { setFailed(false); setRetry(value => value + 1); }}>Reload render</button></div> : <img className="blender-render" src={src + (retry ? `&retry=${retry}` : '')} alt={alt} onError={() => setFailed(true)}/>;
}

export function BlenderSession({ state, token, participantId }: { state: RoomView; token: string; participantId: string }) {
  const [sessions, setSessions] = useState<BlenderSessionView[]>([]), [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState(''), [busy, setBusy] = useState(false), [handoff, setHandoff] = useState('');
  const [pair, setPair] = useState<{ pairingToken: string; expiresAt: number }>();
  const base = `/api/rooms/${state.roomId}/blender`, session = sessions.find(item => item.id === selectedId) || sessions[0];
  const saved = state.artifacts?.filter(item => item.kind === 'blender').flatMap(artifact => artifact.versions.map(version => ({ artifact, version }))).find(item => item.version.taskId === session?.task?.taskId);
  useEffect(() => {
    let active = true;
    const load = () => api(`${base}/sessions`, token).then(value => { if (active) { setSessions(value.sessions); setError(''); } }).catch(exception => { if (active) setError(exception.message); });
    void load();
    const timer = setInterval(load, 2000);
    return () => { active = false; clearInterval(timer); };
  }, [base, token]);
  const control = async (action: string, actorId?: string) => {
    if (!session) return;
    setBusy(true); setError('');
    try {
      const result = await api(`${base}/sessions/${session.id}/control`, token, { method: 'POST', body: JSON.stringify({ action, epoch: session.epoch, ...(actorId ? { actorId } : {}) }) });
      setSessions(result.sessions); setHandoff('');
    } catch (exception) { setError(exception instanceof Error ? exception.message : 'Session command failed.'); }
    finally { setBusy(false); }
  };
  const connect = async () => {
    setBusy(true);
    try { setPair(await api(`${base}/pair`, token, { method: 'POST', body: '{}' })); setError(''); }
    catch (exception) { setError(exception instanceof Error ? exception.message : 'Pairing failed.'); }
    finally { setBusy(false); }
  };
  const name = (id: string) => state.participants.find(item => item.id === id)?.name || id;
  const canControl = !!session && session.state === 'connected' && session.control.includes(participantId) && session.controllerId === participantId && tokenRole(token) !== 'viewer';
  return <section className="document-artifact blender-session" aria-label="Connected Blender">
    <div className="preview-bar"><div><strong>Connected Blender</strong><span>Background Blender execution with rendered previews · Windows x64 · Blender 4.5.14 LTS</span></div><button disabled={busy || tokenRole(token) === 'viewer'} onClick={() => void connect()}>Connect my computer</button></div>
    <p>Only a dedicated task process is used. This view does not stream your desktop or provide an in-browser .blend editor. Closing the viewer keeps an authorized task running.</p>
    {pair && <div className="blender-pair" role="status">
      <strong>Single-use pairing · expires {new Date(pair.expiresAt).toLocaleTimeString()}</strong>
      <p>Run the local companion, choose your executable/workspace and exact observation/control grants, then type CONNECT locally.</p>
      <label>Project ID<input readOnly value={state.roomId}/></label><label>Pairing token<input readOnly autoComplete="off" value={pair.pairingToken}/></label>
      <p>Companion: <code>node --import tsx scripts/blender-companion.ts</code> with <code>--server {location.origin} --project {state.roomId} --pair &lt;token&gt; --blender &lt;path&gt; --workspace &lt;directory&gt; --operations create_scene,save,render</code>. Add <code>--observe</code> and <code>--control</code> only for approved participant IDs.</p>
      <p>{state.participants.map(item => `${item.name}: ${item.id}`).join(' · ')}</p><button onClick={() => setPair(undefined)}>Hide pairing token</button>
    </div>}
    {error && <p role="alert">{error}</p>}
    {!session ? <div className="preview-empty"><h2>No granted Blender session</h2><p>Project membership lets you access saved scenes and renders. Session observation and control require separate approval on the device.</p></div> : <>
      <label>Session<select value={session.id} onChange={event => setSelectedId(event.target.value)}>{sessions.map(item => <option key={item.id} value={item.id}>{item.deviceName}</option>)}</select></label>
      <p role="status">{session.deviceName} · {session.state} · expires {new Date(session.expiresAt).toLocaleTimeString()}</p>
      <p>Active controller: <strong>{name(session.controllerId)}</strong> · {session.mode === 'agent' ? 'Agent executing authorized task' : 'Human control'} · epoch {session.epoch}</p>
      <p>Task: {session.task?.state || 'Idle'}{session.task?.error && ` · ${session.task.error}`} · {session.paused ? 'Paused' : 'Ready for explicit Canvas submission'}</p>
      {saved && <figure><BlenderRender src={`/api/rooms/${state.roomId}/blender/artifacts/${saved.artifact.id}/versions/${saved.version.id}/render.png?token=${encodeURIComponent(token)}`} alt={`Saved render of ${saved.artifact.title}`}/><figcaption className="artifact-provenance">Completed rendered preview · saved v{saved.version.id} · background execution, not a live desktop stream</figcaption></figure>}
      <div className="blender-controls">
        <button disabled={!canControl || busy} onClick={() => void control(session.paused ? 'resume' : 'pause')}>{session.paused ? 'Resume' : 'Pause'}</button>
        <button disabled={!canControl || busy || !session.task || !['running','queued'].includes(session.task.state)} onClick={() => void control('cancel')}>Cancel task</button>
        <button disabled={session.ownerId !== participantId || session.state === 'revoked' || session.state === 'expired' || busy} onClick={() => void control('disconnect')}>Disconnect device</button>
        <label>Hand control to<select value={handoff} disabled={!canControl || busy} onChange={event => setHandoff(event.target.value)}><option value="">Choose approved participant</option>{session.control.filter(id => id !== participantId).map(id => <option key={id} value={id}>{name(id)}</option>)}</select></label>
        <button disabled={!canControl || !handoff || busy || session.mode === 'agent' || !!session.task && ['queued','running','cancel_requested'].includes(session.task.state)} onClick={() => void control('handoff', handoff)}>Hand off control</button>
      </div>
      <p>In Canvas: <code>Create a Blender scene titled "Demo" with a blue cube, camera and lighting. Save the scene and render an image.</code> Then explicitly submit. Only the current controller can dispatch. Pause cancels current execution after cleanup; resume does not retry. STOP or Ctrl+C in the companion cancels and disconnects. Connection expires after 30 minutes or 10 idle minutes; network loss cancels after approximately 10 seconds.</p>
    </>}
  </section>;
}
