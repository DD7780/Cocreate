import {useEffect, useState} from 'react';
import {Eye, EyeOff, Plug, X} from 'lucide-react';
import type {AIConnection, TemporaryModel} from '../shared/types';

type Lease = NonNullable<AIConnection['temporary']>;

const dollars = (value:number) => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumSignificantDigits:6}).format(value);

function ModelChoice({label,description,models,value,busy,onChange,allowance}:{label:string;description:string;models:TemporaryModel[];value:string;busy:boolean;onChange:(value:string)=>void;allowance:number}){
  const selected=models.find(model=>model.id===value);
  return <div>
    <label>{label}<br/><small>{description}</small>
      <select aria-label={label} value={value} disabled={busy} onChange={event=>onChange(event.target.value)}>
        <option value="">Choose {label==='Builder'?'a builder':'an interpretation model'}</option>
        {[true,false].map(free=>{
          const choices=models.filter(model=>model.isFree===free);
          return choices.length>0&&<optgroup key={String(free)} label={free?'FREE models — $0 token cost':'PAID models — billed to your OpenRouter key'}>
            {choices.map(model=><option key={model.id} value={model.id}>{model.isFree?'FREE':'PAID'} · {model.name} · {model.id}{model.isFree?'':` · ${dollars(model.inputPerMillion)} in / ${dollars(model.outputPerMillion)} out per 1M`}</option>)}
          </optgroup>;
        })}
      </select>
    </label>
    {selected&&<p className="provider-hint" aria-live="polite">
      <strong>{selected.isFree?'FREE — $0 model token cost':'PAID'}</strong>
      {!selected.isFree&&` · ${dollars(selected.inputPerMillion)} input / ${dollars(selected.outputPerMillion)} output per 1M tokens`}
      {selected.requestPriceUsd>0&&` · ${dollars(selected.requestPriceUsd)} per request`}
      <br/>{allowance.toLocaleString('en-US')} response tokens per call, including reasoning.
      {selected.reasoningConfig&&` Reasoning: ${'effort' in selected.reasoningConfig?selected.reasoningConfig.effort:'off'}.`}
    </p>}
  </div>;
}

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
    <p className="setup-copy">Write together now; connect AI when you are ready. Paid model usage is billed to the key owner.</p>
    {!owner?<div className="connection-readonly"><strong>{lease?'OpenRouter connected':'AI not connected'}</strong><p>{lease?'The owner must authorize your builds on their key. You cannot see the key.':'The owner can connect a key later. You can keep writing.'}</p></div>:<>
      {(changing||!lease)&&<><label>OpenRouter API key<div className="secret-field"><input type={showKey?'text':'password'} autoComplete="off" spellCheck={false} value={key} onChange={event=>setKey(event.target.value)} placeholder="sk-or-…"/><button type="button" aria-label={showKey?'Hide API key':'Show API key'} onClick={()=>setShowKey(value=>!value)}>{showKey?<EyeOff/>:<Eye/>}</button></div></label><div className="setup-actions"><a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer">Get an OpenRouter key</a><button className="primary" type="button" disabled={busy||!key.trim()} onClick={()=>void connect()}>{busy?'Working…':'Connect'}</button></div></>}
      {lease&&<><p className="connection-status">Key connected · expires {new Date(lease.expiresAt).toLocaleString()}. Models below meet the requirements for each role.</p>
        <ModelChoice label="Builder" description="Generates and edits the shared application." models={lease.builders} value={builder} busy={busy} onChange={setBuilder} allowance={16_000}/>
        <ModelChoice label="Interpretation model" description="Interprets each participant’s submitted changes." models={lease.interpreters} value={interpreter} busy={busy} onChange={setInterpreter} allowance={8_000}/>
        <p className="provider-hint">FREE means no published model charges; provider rate limits still apply. PAID prices are estimates and may vary by provider. Models meet published compatibility requirements; build quality has not been tested.</p>
        <details><summary>Allow editors to build with my key</summary><p>Sharing a project does not authorize spending. Grant permission to each editor explicitly.</p>{(current.participants||[]).filter(person=>person.id!==lease.sponsorId).map(person=><label key={person.id}><input type="checkbox" checked={lease.authorizedSpenderIds.includes(person.id)} disabled={busy} onChange={event=>void authorize(person.id,event.target.checked)}/>{person.name} may build</label>)}</details>
        <div className="recommended-actions"><button type="button" disabled={busy} onClick={()=>setChanging(true)}>Change key</button><button type="button" disabled={busy} onClick={()=>void disconnect()}>Disconnect</button><button className="primary" type="button" disabled={busy||!lease.builders.some(model=>model.id===builder)||!lease.interpreters.some(model=>model.id===interpreter)} onClick={()=>void save()}>{busy?'Working…':'Save models'}</button></div>
      </>}
    </>}
    {message&&<p role="status" className="provider-hint">{message}</p>}
    <p className="security-note">Your key is held in server memory for two hours and never saved in the project. Reconnect after expiry or a server restart. Selecting and saving models makes no provider request.</p>
  </section></div>;
}
