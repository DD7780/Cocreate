import { useEffect, useState, type ReactNode } from 'react';
import type { RoomView } from '../shared/types';
import { api } from './api';
import { MarkdownDocument } from './MarkdownDocument';
import './artifacts.css';

type Selection = { artifactId: string; versionId: number | null };
export const artifactSelectionKey = (projectId: string, participantId: string) => `cocreate-artifacts:${encodeURIComponent(projectId)}:${encodeURIComponent(participantId)}`;
function readSelection(key: string): Selection {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    if (typeof value?.artifactId === 'string' && (value.versionId === null || Number.isSafeInteger(value.versionId) && value.versionId > 0)) return value;
  } catch { /* Selection is a preference, never permission. */ }
  return { artifactId: 'application', versionId: null };
}
export function Artifacts({ state, token, participantId, application }: { state: RoomView; token: string; participantId: string; application: (version?: number) => ReactNode }) {
  const key = artifactSelectionKey(state.roomId, participantId), artifacts = state.artifacts || [];
  const [selection, setSelection] = useState<Selection>(() => readSelection(key)), [sourceView, setSourceView] = useState(false);
  const [content, setContent] = useState<{ path: string; markdown?: string; error?: string }>();
  const [cacheError, setCacheError] = useState('');
  useEffect(() => { setSelection(readSelection(key)); }, [key]);
  const selected = artifacts.find(item => item.id === selection.artifactId) || artifacts[0];
  const version = selected?.versions.find(item => item.id === selection.versionId) || selected?.versions.at(-1);
  const path = selected?.kind === 'markdown' && version ? `/api/rooms/${state.roomId}/artifacts/${selected.id}/versions/${version.id}` : '';
  useEffect(() => {
    let active = true;
    if (path) {
      setContent({ path });
      void api(path, token).then(value => { if (active) setContent({ path, markdown: value.markdown }); }).catch(error => { if (active) setContent({ path, error: String(error.message || error) }); });
    }
    return () => { active = false; };
  }, [path, token]);
  const choose = (value: Selection) => {
    setSelection(value); setSourceView(false);
    try { if (participantId) localStorage.setItem(key, JSON.stringify(value)); setCacheError(''); }
    catch { setCacheError('Viewer preference could not be saved on this device.'); }
  };
  useEffect(() => {
    if (selected && selected.id !== selection.artifactId) {
      const value = { artifactId: selected.id, versionId: null };
      setSelection(value);
      try { if (participantId) localStorage.setItem(key, JSON.stringify(value)); } catch { /* Optional device preference. */ }
    }
  }, [selected?.id, selection.artifactId, key, participantId]);
  const tasks = state.workflow.tasks.filter(task => ['queued', 'running', 'verifying', 'failed', 'interrupted'].includes(task.state)).slice(-3);
  return <section className="artifact-workspace" aria-label="Project artifacts">
    <div className="artifact-controls">
      <label>Artifact<select value={selected?.id || ''} disabled={!artifacts.length} onChange={event => choose({ artifactId: event.target.value, versionId: null })}>
        {!artifacts.length && <option value="">No saved artifacts</option>}
        {artifacts.map(item => <option key={item.id} value={item.id}>{item.title} · {item.kind === 'markdown' ? 'Document' : 'App'}</option>)}
      </select></label>
      {selected && <label>Version<select value={selection.versionId && selected.versions.some(item => item.id === selection.versionId) ? selection.versionId : ''} onChange={event => choose({ artifactId: selected.id, versionId: event.target.value ? Number(event.target.value) : null })}>
        <option value="">Latest (v{selected.versions.at(-1)?.id})</option>
        {[...selected.versions].reverse().map(item => <option key={item.id} value={item.id}>v{item.id} · {new Date(item.createdAt).toLocaleString()}</option>)}
      </select></label>}
    </div>
    {cacheError && <p role="status">{cacheError}</p>}
    {!!tasks.length && <div className="artifact-task-status" role="status" aria-live="polite">{tasks.map(task => <p key={task.id}><strong>{task.title}</strong> · {task.state}{task.blocker && <span> — {task.blocker}</span>}</p>)}</div>}
    {selected?.kind === 'application' ? application(version?.id) : selected?.kind === 'markdown' && version ? <section className="document-artifact">
      <div className="preview-bar"><div><strong>{selected.title} · v{version.id}</strong><span>Published · storage and structure checked · factual accuracy unverified</span></div>
        <div><button aria-pressed={sourceView} onClick={() => setSourceView(value => !value)}>{sourceView ? 'Read document' : 'View source'}</button><a href={`${path}?download=1&token=${encodeURIComponent(token)}`} download>Download .md</a></div>
      </div>
      <p className="artifact-provenance">Requested by {state.participants.find(item => item.id === ('participantId' in version ? version.participantId : ''))?.name || ('participantId' in version ? version.participantId : '')} · accepted revision r{version.specificationRevision}</p>
      <p className="artifact-provenance">Input reference for a later Canvas instruction: <code>artifact:{selected.id}@v{version.id}</code></p>
      {content?.path === path && content.error ? <div className="preview-empty" role="alert"><h2>Content unavailable</h2><p>{content.error}</p><button onClick={() => { setContent({ path }); void api(path, token).then(value => setContent({ path, markdown: value.markdown })).catch(error => setContent({ path, error: error.message })); }}>Reload content</button></div> : content?.path === path && content.markdown !== undefined ? sourceView ? <pre className="document-source">{content.markdown}</pre> : <MarkdownDocument source={content.markdown}/> : <p role="status">Loading saved content…</p>}
    </section> : <div className="preview-empty"><h2>Your work will appear here</h2><p>Submit application instructions or write: Create a Markdown document titled "Launch brief". Reuse a title to revise that document. Discussion and opening Artifacts do not start generation.</p></div>}
  </section>;
}
