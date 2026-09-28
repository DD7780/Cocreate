import type { RoomView } from './types';
export function WorkflowBoard({state, onCanvas, onArtifacts}: {state: RoomView; onCanvas: () => void; onArtifacts: () => void}) {
  const tasks = state.workflow.tasks;
  return <section className="workflow-board">
    <header><span className="section-eyebrow">Team workspace · revision {state.workflow.revision}</span><h1>From idea to working product.</h1><p>Write together. Submit your changes. Follow the work here.</p><button className="primary" onClick={onCanvas}>Open canvas →</button></header>
    <div className="workflow-stats"><article><span>Workflow</span><strong>{state.workflow.phase.replaceAll('_', ' ')}</strong></article><article><span>Accepted requirements</span><strong>{state.requirements.filter(item => item.status === 'accepted').length}</strong></article><article><span>Latest artifact</span><strong>{state.latestVersion ? `v${state.latestVersion}` : 'Not built yet'}</strong>{state.latestVersion && <button onClick={onArtifacts}>View product →</button>}</article></div>
    <section><h2>Work in progress</h2>{tasks.length ? <ol className="workflow-task-list">{tasks.map(task => <li key={task.id}><div><strong>{task.title}</strong><span className="task-state">{task.state.replaceAll('_', ' ')}</span></div><p>Verification: {task.evidenceStatus}</p>{task.blocker && <p className="form-error">{task.blocker}</p>}</li>)}</ol> : <p className="workflow-empty">No submitted tasks yet. Writing is free of model calls; use Build my changes when ready.</p>}</section>
    <details><summary>Recent activity · {state.workflow.activity.length}</summary><ol className="workflow-activity">{state.workflow.activity.slice(-12).reverse().map(event => <li key={event.sequence}><span>{event.summary}</span><time dateTime={event.occurredAt}>{new Date(event.occurredAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</time></li>)}</ol></details>
  </section>;
}
