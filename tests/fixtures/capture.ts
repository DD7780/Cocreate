import * as Y from 'yjs';
import {deletionSignature} from '../../shared/document-state.js';
import {encodeCaptureBytes,type CaptureEnvelope} from '../../shared/capture-command.js';
import type {RoomManager,Room} from '../../server/rooms.js';

export function captureEnvelope(room:Room,actor:string,requestId:string):CaptureEnvelope{
  return {version:1,requestId,cutoff:{vector:encodeCaptureBytes(Y.encodeStateVector(room.doc)),deletions:deletionSignature(room.doc)},sourceIds:(room.pending.get(actor)||[]).flatMap(edit=>edit.sourceId?[edit.sourceId]:[]),updates:[]};
}
const envelopes=new WeakMap<RoomManager,Map<string,CaptureEnvelope>>();
/** Existing downstream tests explicitly wait for interpretation, separate from admission. */
export async function captureAndProcess(manager:RoomManager,room:Room,actor:string,requestId:string){
  const frozen=captureEnvelope(room,actor,requestId);
  const durable=(manager as any).config.durableStore;
  if(durable&&!durable.commitCapture){
    const rows=new Map<string,any>();
    durable.readCapture=async(project:string,actor:string,id:string)=>rows.get(JSON.stringify([project,actor,id]));
    durable.commitCapture=async(project:string,record:any)=>{const key=JSON.stringify([project,record.submission.participantId,record.submission.requestId]),prior=rows.get(key);if(prior&&prior.payloadHash!==record.payloadHash)throw new Error('Fixture capture conflict');const saved=prior||{...structuredClone(record),cursor:rows.size+1};rows.set(key,saved);return structuredClone(saved);};
  }
  let cache=envelopes.get(manager);if(!cache){cache=new Map();envelopes.set(manager,cache);}
  const key=JSON.stringify([room.id,actor,requestId]);
  let envelope=cache.get(key);if(!envelope){
    const prior=await manager.captureReceipt(room,actor,requestId);
    if(prior)return {status:room.submissions.find(item=>item.id===prior.commandId)?.status||room.commandReceipts?.[JSON.stringify([actor,requestId])]?.status||prior.state,message:prior.message,submissionId:prior.commandId};
    envelope=frozen;cache.set(key,envelope);
  }
  let receipt;
  try{receipt=await manager.captureChanges(room,actor,envelope);}catch(error){if((error as {status?:number}).status===422)return {status:'empty',message:'No new changes to submit',submissionId:undefined};throw error;}
  await new Promise(resolve=>setImmediate(resolve));
  await room.submissionTasks?.get(receipt.commandId);
  const submission=room.submissions.find(item=>item.id===receipt.commandId);
  return {status:submission?.status||room.commandReceipts?.[JSON.stringify([actor,requestId])]?.status||receipt.state,message:submission?.error||'Changes accepted and queued',submissionId:receipt.commandId};
}
