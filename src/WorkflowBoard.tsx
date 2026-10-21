import { useEffect, useState } from 'react';
import type { Participant, RoomView } from '../shared/types';
import { IntentReview } from './IntentReview';
import { api, tokenRole } from './api';
import { ConflictChoice } from './workspace/ConflictChoice';
import { projectWorkflowUsage, usageCost, usageTokens, type UsageBucket, type UsageRange } from './workspace/workflow-usage';
import './workflow-overview.css';

const number = (value: number) => value.toLocaleString('en-US');
const date = (value: Date) => value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const statuses = { awaiting_choices: 'Waiting for choices', disagreement: 'Different choices', resolved: 'Resolved', obsolete: 'Superseded' };

function UsageChart({ buckets, metric }: { buckets: UsageBucket[]; metric: 'tokens' | 'cost' }) {
  const [selected, setSelected] = useState<string>();
  const active = buckets.find(bucket => bucket.key === selected) || buckets.at(-1)!;
  const highest = Math.max(...buckets.map(bucket => metric === 'tokens' ? bucket.input + bucket.output : bucket.usd));
  const magnitude = 10 ** Math.floor(Math.log10(highest || (metric === 'tokens' ? 1 : 0.01)));
  const ceiling = Math.ceil((highest || magnitude) / magnitude) * magnitude;
  const tick = (value: number) => metric === 'tokens' ? new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value) : value > 0 && value < 0.0001 ? '<$0.0001' : `$${value.toFixed(value < 0.01 && value > 0 ? 4 : 2)}`;
  return <div className="usage-chart">
    <div className="usage-chart-plot">
      <div className="usage-axis" aria-hidden="true"><span>{tick(ceiling)}</span><span>{tick(ceiling / 2)}</span><span>{tick(0)}</span></div>
      <svg viewBox="0 0 700 160" preserveAspectRatio="none" aria-hidden="true">
        {[0, 80, 159].map(y => <line key={y} x1="0" x2="700" y1={y} y2={y} className="usage-grid" />)}
        {buckets.map((bucket, index) => {
          const slot = 700 / buckets.length, x = index * slot + slot * 0.24, width = slot * 0.52;
          const value = metric === 'tokens' ? bucket.input + bucket.output : bucket.usd;
          const unknown = bucket.calls > 0 && !(metric === 'tokens' ? bucket.tokenReports : bucket.costReports);
          const height = value / ceiling * 148;
          return <g key={bucket.key} opacity={bucket.key === active.key ? 1 : 0.75}>
            {unknown ? <rect x={x} y="132" width={width} height="27" className="usage-unknown" /> : metric === 'tokens' ? <>
              <rect x={x} y={159 - height} width={width} height={bucket.output / ceiling * 148} className="usage-output" />
              <rect x={x} y={159 - bucket.input / ceiling * 148} width={width} height={bucket.input / ceiling * 148} className="usage-input" />
            </> : <rect x={x} y={159 - height} width={width} height={height} className="usage-output" />}
          </g>;
        })}
      </svg>
    </div>
    <div className="usage-days" style={{ gridTemplateColumns: `repeat(${buckets.length}, minmax(0, 1fr))` }} aria-label="Chart periods">
      {buckets.map(bucket => <button key={bucket.key} aria-pressed={active.key === bucket.key} onClick={() => setSelected(bucket.key)} onFocus={() => setSelected(bucket.key)} aria-label={`${bucket.label} UTC: ${usageTokens(bucket)} tokens${bucket.incompleteTokens ? ', incomplete' : ''}, ${usageCost(bucket)} estimated AI cost${bucket.incompleteCost ? ', incomplete' : ''}`}>
        {bucket.label.includes(':') ? bucket.label : <><span>{bucket.label.split(' ')[0]}</span>{' '}<span>{bucket.label.split(' ')[1]}</span></>}
      </button>)}
    </div>
    <div className="usage-chart-caption">
      {metric === 'tokens' && <span className="usage-legend"><span><i className="usage-input" />Input</span><span><i className="usage-output" />Output</span></span>}
      <p role="status">{active.label} UTC · {metric === 'tokens' ? `${usageTokens(active)} tokens` : `${usageCost(active)} estimated AI cost`}{(metric === 'tokens' ? active.incompleteTokens : active.incompleteCost) > 0 ? ' · incomplete' : ''}</p>
    </div>
    <details className="usage-table"><summary>View chart data</summary><div className="usage-table-scroll"><table><caption>Recorded usage · UTC</caption><thead><tr><th scope="col">Period</th><th scope="col">Input</th><th scope="col">Output</th><th scope="col">Estimated AI cost (USD)</th></tr></thead><tbody>{buckets.map(bucket => <tr key={bucket.key}><th scope="row">{bucket.label}</th><td>{bucket.calls && !bucket.inputReports ? 'Unavailable' : number(bucket.input)}</td><td>{bucket.calls && !bucket.outputReports ? 'Unavailable' : number(bucket.output)}{bucket.incompleteTokens > 0 && ' · partial'}</td><td>{usageCost(bucket)}{bucket.incompleteCost > 0 && ' · partial'}</td></tr>)}</tbody></table></div></details>
  </div>;
}

export function WorkflowBoard({ state, me, token, onCanvas }: { state: RoomView; me?: Participant; token: string; onCanvas: () => void }) {
  const [range, setRange] = useState<UsageRange>('week'), [metric, setMetric] = useState<'tokens' | 'cost'>('tokens');
  const [now, setNow] = useState(() => new Date()), [intent, setIntent] = useState(false);
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 60_000); return () => clearInterval(timer); }, []);
  const usage = projectWorkflowUsage(state.providerCalls, range, now), total = usage.total;
  const open = state.conflictGroups.filter(group => group.state === 'awaiting_choices' || group.state === 'disagreement');
  const closed = state.conflictGroups.filter(group => group.state === 'resolved' || group.state === 'obsolete');
  const canEdit = !!me && ['owner', 'editor'].includes(tokenRole(token) || '');
  const name = (id: string, group: RoomView['conflictGroups'][number]) => state.participants.find(person => person.id === id)?.name || group.alternatives.flatMap(option => option.sources).find(source => source.participantId === id)?.participantName || 'Former contributor';
  const row = (group: RoomView['conflictGroups'][number]) => {
    const waiting = group.requiredResolverIds.filter(id => !group.selections.some(selection => selection.participantId === id));
    return <details className="contradiction-row" key={group.id}>
      <summary><span className="contradiction-title"><strong>{group.subject}</strong><small>{group.state === 'awaiting_choices' ? `Waiting for ${waiting.map(id => name(id, group)).join(', ') || 'recorded confirmation'}` : group.state === 'disagreement' ? 'Review choices and revise your instructions' : group.state === 'resolved' ? 'Agreed by all affected contributors' : 'A newer instruction replaced this round'}</small></span><span className={`contradiction-status ${group.state}`}>{statuses[group.state]}</span><span className="contradiction-review">Review <span aria-hidden="true">↗</span></span></summary>
      <ConflictChoice group={group} participantId={me?.id} canDecide={canEdit} roomId={state.roomId} token={token} context={state} onCorrect={() => setIntent(true)} onCanvas={onCanvas} />
    </details>;
  };
  return <section className="workflow-board workflow-overview-board">
    <header><div><span className="section-eyebrow">Project overview</span><h1>Workflow</h1></div>{state.submissionMode!=='direct' && <button className="overview-intent-button" onClick={() => setIntent(true)}>Project instructions <span>r{state.specificationRevision}</span></button>}</header>
    <section id="workflow-usage" className="overview-panel" aria-labelledby="workflow-usage-title">
      <header><h2 id="workflow-usage-title">AI usage</h2><div className="usage-controls" role="group" aria-label="Usage period"><button aria-pressed={range === 'today'} onClick={() => setRange('today')}>Today</button><button aria-pressed={range === 'week'} onClick={() => setRange('week')}>Last 7 days</button></div></header>
      <div className="usage-totals"><div><span>Reported tokens</span><strong>{usageTokens(total)}</strong><small>{total.incompleteTokens ? 'Known subtotal · incomplete reports' : 'Input + output'}</small></div><div><span>Estimated AI cost <small>USD</small></span><strong>{usageCost(total)}</strong><small>{total.incompleteCost ? 'Known subtotal · incomplete pricing' : 'Recorded model calls'}</small></div></div>
      <div className="usage-chart-heading"><span>{date(usage.start)}{range === 'week' ? ` – ${date(new Date(usage.end.getTime() - 1))}` : ''} · UTC</span><div className="usage-controls" role="group" aria-label="Chart metric"><button aria-pressed={metric === 'tokens'} onClick={() => setMetric('tokens')}>Tokens</button><button aria-pressed={metric === 'cost'} onClick={() => setMetric('cost')}>AI cost</button></div></div>
      <UsageChart buckets={usage.buckets} metric={metric} />
      {total.calls === 0 && <p className="overview-empty">No provider calls recorded in this period.</p>}
      <footer className="usage-coverage"><span>Partial history · recent recorded calls</span><details><summary>Usage details</summary><dl><div><dt>Recorded calls in this period</dt><dd>{total.calls} calls</dd></div><div><dt>Generation, including retries</dt><dd>{usage.generation.calls} calls · {usageTokens(usage.generation)} tokens · {usageCost(usage.generation)}{(usage.generation.incompleteTokens || usage.generation.incompleteCost) > 0 && ' · incomplete'}</dd></div><div><dt>Setup tests</dt><dd>{usage.setupTests.calls} calls · {usageTokens(usage.setupTests)} tokens · {usageCost(usage.setupTests)}{(usage.setupTests.incompleteTokens || usage.setupTests.incompleteCost) > 0 && ' · incomplete'}</dd></div></dl><p>Estimates cover recorded AI calls, including setup and retries. Earlier calls may be missing. This is not an invoice, hosting bill or context-window counter. Cached and reasoning tokens are already included where reported.</p>{usage.invalidDates > 0 && <p>{usage.invalidDates} calls have no usable timestamp and are excluded from this chart.</p>}<ul>{usage.calls.slice(0, 8).map(call => <li key={call.callId}>{call.purpose.replaceAll('_', ' ')} · {call.model || call.provider} · {call.outcome} · {new Date(call.startedAt).toLocaleString('en-US', { timeZone: 'UTC' })} UTC</li>)}</ul></details></footer>
    </section>
    {state.submissionMode!=='direct' && <section className="overview-panel contradictions-panel" aria-labelledby="workflow-contradictions-title"><header><h2 id="workflow-contradictions-title">Contradictions <span className="overview-count">{open.length}</span></h2><span className="overview-subtle">{open.length ? 'Needs attention' : 'All clear'}</span></header>{open.length ? open.map(row) : <p className="overview-empty">No open contradictions.</p>}{closed.length > 0 && <details className="contradictions-history"><summary>Resolved history · {closed.length}</summary>{closed.slice().reverse().map(row)}</details>}</section>}
    {state.submissionMode==='direct' && <section className="overview-panel"><header><h2>Build history</h2></header><p>Saved → Preparing prompt → Queued → Building → Available / Failed. Later submitted instructions can revise earlier behavior.</p>{state.directSubmissions?.slice().reverse().map(item=><details key={item.id}><summary>{state.participants.find(p=>p.id===item.participantId)?.name || 'Contributor'} · {item.status==='interpreting' ? 'Preparing prompt' : item.status==='built' ? `Available v${item.artifactVersion}` : item.status}</summary>{item.prompt && <p>{item.prompt}</p>}{item.error && <p role="alert">{item.error}</p>}</details>)}</section>}
    {state.submissionMode!=='direct' && intent && <IntentReview state={state} participantId={me?.id} canEdit={canEdit} shownRevision={state.specificationRevision} onClose={() => setIntent(false)} onCommand={command => api(`/api/rooms/${state.roomId}/intent-commands`, token, { method: 'POST', body: JSON.stringify(command) })} onBuild={requestId => api(`/api/rooms/${state.roomId}/intent-build`, token, { method: 'POST', body: JSON.stringify({ requestId }) })} />}
  </section>;
}
