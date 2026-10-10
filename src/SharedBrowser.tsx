import { useEffect, useRef, useState } from 'react';
import { api, tokenRole } from './api';
import type { RoomView } from '../shared/types';
import type { BrowserDownload, BrowserInput, SharedBrowserSession } from '../shared/browser-session';

export function SharedBrowser({state,token,participantId}:{state:RoomView;token:string;participantId:string}){
  const base=`/api/rooms/${state.roomId}/browser`,key=`cocreate-browser-view:${state.roomId}:${participantId}`;
  const [sessions,setSessions]=useState<SharedBrowserSession[]>([]),[files,setFiles]=useState<BrowserDownload[]>([]);
  const [selected,setSelected]=useState(()=>localStorage.getItem(key)||''),[origin,setOrigin]=useState(''),[grants,setGrants]=useState<string[]>([]);
  const [url,setUrl]=useState(''),[text,setText]=useState(''),[target,setTarget]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  const [frame,setFrame]=useState(''),[pending,setPending]=useState<Array<{id:string;name:string}>>([]);
  const frameUrl=useRef('');const session=sessions.find(s=>s.id===selected),privateScreen=!!session?.privateLogin&&session.ownerId!==participantId;
  const canControl=!!session&&session.controllerId===participantId&&session.control.includes(participantId)&&!privateScreen&&session.state==='connected'&&!session.paused&&tokenRole(token)!=='viewer';
  const refresh=async()=>{const result=await api(base,token);setSessions(result.sessions);setFiles(result.downloads);};
  const action=async(operation:()=>Promise<void>)=>{setBusy(true);setError('');try{await operation();await refresh();}catch(e){setError(e instanceof Error?e.message:'Browser request failed.');}finally{setBusy(false);}};
  useEffect(()=>{let active=true;const update=()=>api(base,token).then(result=>{if(active){setSessions(result.sessions);setFiles(result.downloads);}}).catch(e=>{if(active)setError(e.message);});void update();const timer=setInterval(()=>void update(),2000);return()=>{active=false;clearInterval(timer);};},[base,token]);
  useEffect(()=>{let active=true;const capture=async()=>{
    if(!session||privateScreen||session.paused||session.state!=='connected'){setFrame('');return;}
    try{const response=await fetch(`${base}/${session.id}/frame`,{headers:{Authorization:`Bearer ${token}`},cache:'no-store'});if(!response.ok)throw new Error((await response.json()).error);const blob=await response.blob();if(!active)return;const next=URL.createObjectURL(blob);URL.revokeObjectURL(frameUrl.current);frameUrl.current=next;setFrame(next);}
    catch(e){if(active){setFrame('');setError(e instanceof Error?e.message:'Viewport unavailable.');}}
  };void capture();const timer=setInterval(()=>void capture(),1200);return()=>{active=false;clearInterval(timer);URL.revokeObjectURL(frameUrl.current);frameUrl.current='';};},[base,token,session?.id,session?.epoch,session?.state,session?.paused,privateScreen]);
  const input=(value:BrowserInput)=>action(async()=>{if(!session)return;await api(`${base}/${session.id}/input`,token,{method:'POST',body:JSON.stringify({commandId:crypto.randomUUID(),epoch:session.epoch,input:value})});const result=await api(`${base}/${session.id}/downloads`,token);setPending(result.pendingDownloads);});
  const control=(value:string)=>action(async()=>{if(session)await api(`${base}/${session.id}/control`,token,{method:'POST',body:JSON.stringify({action:value,epoch:session.epoch,...(value==='handoff'?{actorId:target}:{})})});});
  return <section className="document-artifact shared-browser" aria-label="Shared browser">
    <div className="preview-bar"><div><strong>Shared browser</strong><span>Isolated viewport · explicit owner permissions · no desktop capture</span></div></div>
    <p>Canvas remains shared instructions. Page text cannot authorize tools. New connections start with a private owner screen; sharing a signed-in screen requires the owner’s explicit action.</p>
    <form onSubmit={event=>{event.preventDefault();void action(async()=>{const result=await api(base,token,{method:'POST',body:JSON.stringify({origin,observe:grants,control:grants})});const id=result.sessions.at(-1)?.id;if(id){setSelected(id);localStorage.setItem(key,id);setUrl(origin);}});}}>
      <label>Operator-approved website origin<input value={origin} onChange={event=>setOrigin(event.target.value)} placeholder="https://approved.example" required/></label>
      <fieldset><legend>Explicit observation and control grants</legend>{state.participants.filter(p=>p.id!==participantId).map(p=><label key={p.id}><input type="checkbox" checked={grants.includes(p.id)} onChange={event=>setGrants(ids=>event.target.checked?[...ids,p.id]:ids.filter(id=>id!==p.id))}/>{p.name}</label>)}</fieldset>
      <button disabled={busy||tokenRole(token)==='viewer'}>Open private browser</button>
    </form>
    <label>Session<select value={selected} onChange={event=>{setSelected(event.target.value);try{localStorage.setItem(key,event.target.value);}catch{setError('Viewer preference could not be saved.');}}}><option value="">Choose your viewer</option>{sessions.map(s=><option key={s.id} value={s.id}>{s.origin} · {s.state}</option>)}</select></label>
    {session&&<>
      <p role="status">{session.state} · controller {state.participants.find(p=>p.id===session.controllerId)?.name||session.controllerId} · epoch {session.epoch} · {session.privateLogin?'Private owner login':'Owner-authorized shared screen'}</p>
      {privateScreen?<p>Login and authenticated screens are private. Wait for explicit owner sharing.</p>:frame&&<img className="shared-browser-frame" src={frame} alt="Authorized live browser viewport" draggable={false} onClick={event=>{if(!canControl||busy)return;const box=event.currentTarget.getBoundingClientRect();void input({kind:'click',x:Math.min(959,Math.floor((event.clientX-box.left)/box.width*960)),y:Math.min(639,Math.floor((event.clientY-box.top)/box.height*640))});}}/>}
      <form onSubmit={event=>{event.preventDefault();void input({kind:'navigate',url});}}><label>Navigate inside approved origin<input value={url} onChange={event=>setUrl(event.target.value)}/></label><button disabled={!canControl||busy}>Navigate</button></form>
      <form onSubmit={event=>{event.preventDefault();const value=text;setText('');void input({kind:'text',text:value});}}><label>Type into focused browser field<input type={session.privateLogin?'password':'text'} autoComplete="off" value={text} onChange={event=>setText(event.target.value)}/></label><button disabled={!canControl||busy||!text}>Send text</button></form>
      <div className="artifact-controls">{(['Enter','Tab','Backspace','Escape'] as const).map(key=><button key={key} disabled={!canControl||busy} onClick={()=>void input({kind:'key',key})}>{key}</button>)}<button disabled={!canControl||busy} onClick={()=>void input({kind:'scroll',delta:400})}>Scroll down</button></div>
      {session.ownerId===participantId&&<div className="artifact-controls"><button disabled={busy} onClick={()=>void control('private_login')}>Private login handoff</button><button disabled={busy||!session.privateLogin||session.state!=='connected'} onClick={()=>void control('share_authenticated')}>Share this authenticated screen with granted participants</button><button disabled={busy} onClick={()=>void control('disconnect')}>Disconnect</button></div>}
      <div className="artifact-controls"><button disabled={!canControl||busy} onClick={()=>void control('pause')}>Pause and close private profile</button><button disabled={!canControl||busy} onClick={()=>void control('cancel')}>Cancel session</button><label>Approved controller<select value={target} onChange={event=>setTarget(event.target.value)}><option value="">Choose participant</option>{session.control.filter(id=>id!==participantId).map(id=><option key={id} value={id}>{state.participants.find(p=>p.id===id)?.name||id}</option>)}</select></label><button disabled={!canControl||busy||!target||session.privateLogin} onClick={()=>void control('handoff')}>Hand off control</button></div>
      {session.paused&&session.ownerId===participantId&&<button disabled={busy} onClick={()=>void control('resume')}>Resume with fresh private login</button>}
      <p>Pause, cancel, expiry or transport loss closes the disposable profile. Resume or reopen explicitly for fresh login; uncertain commands never replay.</p>
      {session.ownerId===participantId&&pending.map(file=><p key={file.id}>{file.name} <button disabled={busy} onClick={()=>void action(async()=>{await api(`${base}/${session.id}/downloads/${file.id}/publish`,token,{method:'POST',body:JSON.stringify({epoch:session.epoch})});setPending(files=>files.filter(f=>f.id!==file.id));})}>Publish validated file to project artifacts</button></p>)}
    </>}
    {error&&<p role="alert">{error}</p>}
    <h3>Saved browser files</h3><p>Private project artifacts remain available independently of session access. Only validated UTF-8 .txt/.md downloads are supported.</p>
    {files.map(file=><p key={file.id}><a href={`/api/rooms/${state.roomId}/browser-downloads/${file.id}?token=${encodeURIComponent(token)}`} download>{file.name}</a> · {file.byteLength} bytes · immutable {file.contentHash.slice(0,12)}</p>)}
  </section>;
}
