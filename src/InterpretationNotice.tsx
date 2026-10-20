import {useState} from 'react';
import type {Participant,RoomView} from '../shared/types';
import {api,tokenRole} from './api';
import {IntentReview} from './IntentReview';

export function InterpretationNotice({state,me,token,id}:{state:RoomView;me?:Participant;token:string;id:string}) {
  const [open,setOpen]=useState(false);
  const blocked=me?.latest?.intents?.filter(intent=>!intent.withdrawn&&intent.validation?.status==='needs_clarification')||[];
  if(!blocked.length&&!open)return null;
  return <>{blocked.length>0&&<section className="interpretation-notice" role="status">
    <strong>Your changes were saved, but their interpretation needs review before building.</strong>
    <ul>{blocked.map(intent=><li key={intent.id}>{intent.text}</li>)}</ul>
    <button onClick={()=>setOpen(true)}>Review and correct my interpretation</button>
  </section>}
    {open&&<IntentReview state={state} participantId={me?.id} canEdit={!!me&&tokenRole(token)!=='viewer'} shownRevision={state.specificationRevision}
      onClose={()=>setOpen(false)}
      onCommand={command=>api(`/api/rooms/${id}/intent-commands`,token,{method:'POST',body:JSON.stringify(command)})}
      onBuild={requestId=>api(`/api/rooms/${id}/intent-build`,token,{method:'POST',body:JSON.stringify({requestId})})}/>}
  </>;
}
