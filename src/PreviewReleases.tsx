import { useEffect, useState } from 'react';
import type { RoomView } from '../shared/types';
import type { PreviewView, PreviewPlan } from '../shared/preview-release';
import { api } from './api';
export function PreviewReleases({ state, token, participantId }: {
    state: RoomView;
    token: string;
    participantId: string;
}) {
    const [view, setView] = useState<PreviewView>({ connections: [], plans: [], receipts: [] }), [error, setError] = useState(''), [busy, setBusy] = useState(false);
    const [version, setVersion] = useState(state.versions.at(-1)?.id || 0), [connection, setConnection] = useState(''), [selected, setSelected] = useState(''), [approve, setApprove] = useState(false);
    const [account, setAccount] = useState(''), [project, setProject] = useState(''), [credential, setCredential] = useState(''), [actors, setActors] = useState<string[]>([]);
    const [grants, setGrants] = useState<Record<string, string[]>>({}), [replacement, setReplacement] = useState<Record<string, string>>({});
    const root = `/api/rooms/${state.roomId}/previews`;
    const load = async () => { try {
        setView(await api(root, token));
        setError('');
    }
    catch (e) {
        setError((e as Error).message);
    } };
    useEffect(() => { void load(); }, [root, token]);
    const run = async (path: string, body: unknown) => { setBusy(true); setError(''); try {
        const next: PreviewView = await api(root + path, token, { method: 'POST', body: JSON.stringify(body) });
        setView(next);
        setApprove(false);
        if (path === '/plans')
            setSelected(next.plans.at(-1)!.id);
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } };
    const plan = view.plans.find(p => p.id === selected) || view.plans.at(-1), receipt = view.receipts.find(r => r.planId === plan?.id), current = view.connections.find(c => c.id === plan?.connection?.id);
    const mayRelease = current && !current.revoked && current.revision === plan?.connection?.revision && current.actors.includes(participantId);
    const previous = plan?.previousPlanId && view.plans.find(p => p.id === plan.previousPlanId);
    const prepare = (recovery?: PreviewPlan) => run('/plans', { versionId: recovery?.versionId || version, ...(connection ? { connectionId: connection } : {}), ...(recovery ? { recoveryOf: recovery.id } : {}) });
    return <section className="shared-browser" aria-label="Generated application releases">
    <h2>Application previews</h2>
    <p>Prepare a frozen frontend version before connecting an account. Uploads publish static application code to a public preview. Provider acceptance, live file checks and application acceptance are recorded separately.</p>
    <div className="browser-actions"><label>Application version<select value={version} onChange={e => setVersion(Number(e.target.value))}>{state.versions.map(v => <option key={v.id} value={v.id}>v{v.id} · {v.summary}</option>)}</select></label>
      <label>Verified connection<select value={connection} onChange={e => setConnection(e.target.value)}><option value="">Prepare without an account</option>{view.connections.filter(c => !c.revoked).map(c => <option key={c.id} value={c.id}>{c.target.accountName} / {c.target.projectName} · preview</option>)}</select></label>
      <button disabled={busy || !version} onClick={() => void prepare()}>Prepare preview plan</button><button disabled={busy} onClick={() => void load()}>Refresh receipts</button></div>
    <details><summary>Connect an existing Cloudflare Pages project</summary>
      <p>Only verifies the existing account and Direct Upload project. This does not upload, create projects or grant teammates release authority. A scoped API token needs account read and Pages permissions; it is encrypted on the server.</p>
      <form onSubmit={e => { e.preventDefault(); const value = credential; setCredential(''); void run('/connections', { accountId: account, projectName: project, credential: value, actors }); }}>
        <label>Account ID<input value={account} onChange={e => setAccount(e.target.value)} autoComplete="off"/></label>
        <label>Existing dedicated Pages project<input value={project} onChange={e => setProject(e.target.value)} autoComplete="off"/></label>
        <label>Scoped API token<input type="password" value={credential} onChange={e => setCredential(e.target.value)} autoComplete="off"/></label>
        <fieldset><legend>Explicit release participants</legend>{state.participants.filter(p => p.id !== participantId).map(p => <label key={p.id}><input type="checkbox" checked={actors.includes(p.id)} onChange={e => setActors(a => e.target.checked ? [...a, p.id] : a.filter(id => id !== p.id))}/>{p.name}</label>)}</fieldset>
        <button disabled={busy || !credential}>Verify connection</button>
      </form>
    </details>
    {view.connections.filter(c => c.ownerId === participantId).map(c => <details key={c.id}><summary>{c.target.accountName} / {c.target.projectName} · owned by you · {c.revoked ? 'revoked' : 'active'}</summary>
      <fieldset><legend>Release grants for this connection</legend>{state.participants.filter(p => p.id !== participantId).map(p => <label key={p.id}><input type="checkbox" checked={(grants[c.id] || c.actors).includes(p.id)} onChange={e => setGrants(value => ({ ...value, [c.id]: e.target.checked ? [...(value[c.id] || c.actors), p.id] : (value[c.id] || c.actors).filter(id => id !== p.id) }))}/>{p.name}</label>)}</fieldset>
      <button disabled={busy} onClick={() => void run(`/connections/${c.id}/grants`, { actors: grants[c.id] || c.actors, expectedRevision: c.revision })}>Save explicit release grants</button>
      {!c.revoked && <button disabled={busy} onClick={() => void run(`/connections/${c.id}/revoke`, {})}>Revoke release authority</button>}
      <p>Grant changes invalidate outstanding approvals. The owner may still reconcile an old receipt by read-only provider checks.</p>
      <label>Replacement scoped token<input type="password" value={replacement[c.id] || ''} onChange={e => setReplacement(value => ({ ...value, [c.id]: e.target.value }))} autoComplete="off"/></label>
      <button disabled={busy || !replacement[c.id]} onClick={() => { const value = replacement[c.id]; setReplacement(v => ({ ...v, [c.id]: '' })); void run(`/connections/${c.id}/credential`, { credential: value }); }}>Verify replacement token</button>
    </details>)}
    {!!view.plans.length && <label>Saved release plan<select value={plan?.id} onChange={e => { setSelected(e.target.value); setApprove(false); }}>{view.plans.map(p => <option key={p.id} value={p.id}>v{p.versionId} · {p.branch}</option>)}</select></label>}
    {plan && <div className="document-artifact">
      <h3>Review preview release · v{plan.versionId}</h3>
      <p>{plan.connection ? `${plan.connection.target.accountName} (${plan.connection.target.accountId}) / ${plan.connection.target.projectName} (${plan.connection.target.projectId})` : 'Target unverified. Connect an existing project, then prepare a new target-bound plan.'}</p>
      <p>Environment: preview · Branch: <code>{plan.branch}</code> · Exposure: public static code · Billing: governed by the selected account; cost not verified.</p>
      <p>Source SHA-256: <code>{plan.sourceHash}</code><br />Approval SHA-256: <code>{plan.planHash}</code></p>
      <ul>{plan.files.map(f => <li key={f.path}><a href={`${root}/plans/${plan.id}/files/${f.path}?token=${encodeURIComponent(token)}`} download>{f.path}</a> · {f.byteLength.toLocaleString()} bytes · <code>{f.hash}</code></li>)}</ul>
      <p>{previous ? `Recovery version: v${previous.versionId}, retained immutable files and prior successful preview.` : 'First preview: no previous verified release. Failure preserves existing application artifacts.'}</p>
      {receipt ? <><p role="status"><strong>{receipt.state}</strong> · {receipt.detail}</p>{receipt.url && <a href={receipt.url} target="_blank" rel="noreferrer">Open verified immutable preview</a>}{!['verified', 'failed'].includes(receipt.state) && <button disabled={busy} onClick={() => void run(`/plans/${plan.id}/reconcile`, {})}>Reconcile outcome</button>}</> : <><label><input type="checkbox" checked={approve} onChange={e => setApprove(e.target.checked)}/>I authorize this exact account/project/preview branch and public static upload under its billing terms.</label><button disabled={busy || !approve || !mayRelease} onClick={() => void run(`/plans/${plan.id}/release`, { planHash: plan.planHash, approvePublicPreview: true })}>Approve and upload preview</button></>}
      {receipt?.state === 'verified' && <button disabled={busy} onClick={() => void prepare(plan)}>Prepare recovery of these exact files</button>}
    </div>}
    {busy && <p role="status">Preparing or reconciling the saved operation…</p>}{error && <p role="alert">{error}</p>}
  </section>;
}
