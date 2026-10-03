import {useEffect, useState} from 'react';
import {Eye, EyeOff, Plug, X} from 'lucide-react';
import type {AIConnection} from '../shared/types';

type Lease = NonNullable<AIConnection['temporary']>;

async function request(path:string, token:string, method:'POST'|'PUT', body?:unknown){
  const response=await fetch(path,{method,headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:body===undefined?undefined:JSON.stringify(body)});
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(result.error||'Request failed.');
  return result;
}

export function ByokSetup({id,token,current,owner,onClose}:{id:string;token:string;current:AIConnection;owner:boolean;onClose:()=>void}){
  const [lease,setLease]=useState<Lease|undefined>(current.temporary);
  const [key,setKey]=useState('');
  const [showKey,setShowKey]=useState(false);
  const [changing,setChanging]=useState(!current.temporary);
  const [builder,setBuilder]=useState(current.setup?.mode==='byok_lease'?current.builderModel||'':'');
  const [interpreter,setInterpreter]=useState(current.setup?.mode==='byok_lease'?current.personalModel||'':'');
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  useEffect(()=>setLease(current.temporary),[current.temporary?.handle]);

  async function run(work:()=>Promise<void>){setBusy(true);setMessage('');try{await work()}catch(error){setMessage(error instanceof Error?error.message:'Action failed.')}finally{setBusy(false)}}
  const connect=()=>run(async()=>{
    const next=await request(`/api/rooms/${id}/ai/openrouter/connect`,token,'POST',{apiKey:key.trim()}) as Lease;
    setLease(next);setKey('');setChanging(false);setBuilder('');setInterpreter('');
    setMessage('Key validated without a generation request. Choose both models, then save.');
  });
  const save=()=>run(async()=>{
    if(!lease)throw new Error('Connect your key first.');
    const result=await request(`/api/rooms/${id}/ai/openrouter/models`,token,'POST',{handle:lease.handle,builderModel:builder,interpreterModel:interpreter});
    if(result.builderModel!==builder||result.personalModel!==interpreter)throw new Error('The server did not confirm both model selections.');
    onClose();
  });
  const disconnect=()=>run(async()=>{
    await request(`/api/rooms/${id}/ai/openrouter/disconnect`,token,'POST');
    setLease(undefined);setKey('');setBuilder('');setInterpreter('');setChanging(true);
    setMessage('Disconnected. New provider requests are blocked.');
  });
  const authorize=(memberId:string,authorized:boolean)=>run(async()=>{
    const next=await request(`/api/rooms/${id}/ai/openrouter/spenders/${memberId}`,token,'PUT',{authorized}) as Lease;
    setLease(next);
  });

  return <div className="modal-backdrop"><section className="setup-card connections-card" role="dialog" aria-modal="true" aria-labelledby="byok-title">
    <div className="setup-heading"><div className="agent-orb"><Plug/></div><div><p className="kicker">OpenRouter · bring your own key</p><h2 id="byok-title">Connect models</h2></div><button className="icon-button" aria-label="Close AI setup" onClick={onClose}><X/></button></div>
    <p className="setup-copy">Write together now; connect AI when you are ready. OpenRouter bills the key owner for builds.</p>
    {!owner?<div className="connection-readonly"><strong>{lease?'OpenRouter connected':'AI not connected'}</strong><p>{lease?'The owner must authorize your builds on their key. You cannot see the key.':'The owner can connect a key later. You can keep writing.'}</p></div>:<>
      {(changing||!lease)&&<><label>OpenRouter API key<div className="secret-field"><input type={showKey?'text':'password'} autoComplete="off" spellCheck={false} value={key} onChange={event=>setKey(event.target.value)} placeholder="sk-or-…"/><button type="button" aria-label={showKey?'Hide API key':'Show API key'} onClick={()=>setShowKey(value=>!value)}>{showKey?<EyeOff/>:<Eye/>}</button></div></label><div className="setup-actions"><a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer">Get an OpenRouter key</a><button className="primary" type="button" disabled={busy||!key.trim()} onClick={()=>void connect()}>{busy?'Working…':'Connect'}</button></div></>}
      {lease&&<><p className="connection-status">Key connected · expires {new Date(lease.expiresAt).toLocaleString()}. Models have not been generation tested.</p>
        <label>Builder <small>Generates and edits the shared application.</small><select value={builder} disabled={busy} onChange={event=>setBuilder(event.target.value)}><option value="">Choose a builder</option>{lease.builders.map(model=><option key={model.id} value={model.id}>{model.name} · {model.id}</option>)}</select></label>
        <label>Interpretation model <small>Interprets each participant’s submitted changes.</small><select value={interpreter} disabled={busy} onChange={event=>setInterpreter(event.target.value)}><option value="">Choose an interpreter</option>{lease.interpreters.map(model=><option key={model.id} value={model.id}>{model.name} · {model.id}</option>)}</select></label>
        <details><summary>Allow editors to build with my key</summary><p>Sharing a project does not authorize spending. Grant permission to each editor explicitly.</p>{(current.participants||[]).filter(person=>person.id!==lease.sponsorId).map(person=><label key={person.id}><input type="checkbox" checked={lease.authorizedSpenderIds.includes(person.id)} disabled={busy} onChange={event=>void authorize(person.id,event.target.checked)}/>{person.name} may build</label>)}</details>
        <div className="recommended-actions"><button type="button" disabled={busy} onClick={()=>setChanging(true)}>Change key</button><button type="button" disabled={busy} onClick={()=>void disconnect()}>Disconnect</button><button className="primary" type="button" disabled={busy||!builder||!interpreter} onClick={()=>void save()}>{busy?'Working…':'Save and start building'}</button></div>
      </>}
    </>}
    {message&&<p role="status" className="provider-hint">{message}</p>}
    <p className="security-note">Your key is held in server memory for two hours and never saved in the project. Reconnect after expiry or a server restart. Selecting and saving models makes no provider request.</p>
  </section></div>;
}
