import * as Y from 'yjs';
import type {Participant} from '../shared/types.js';
import type {EditRecord,StoredSubmission} from './room-state.js';

export type CaptureRecord = {
  epoch?:number;releaseFingerprint?:string;
  cursor:number; payloadHash:string; documentUpdate:string; documentSequence:number;
  ownerId:string|null; participant:Participant; submission:StoredSubmission;
  drafts?:Array<[string,EditRecord[]]>; participants?:Participant[];
};

/** Checkpoints are projections. Immutable newer commands survive an older checkpoint write. */
export function replayCaptureJournal(checkpoint:any,records:CaptureRecord[]){
  const meta=structuredClone(checkpoint||{}),doc=new Y.Doc();
  try{
    if(meta.update)Y.applyUpdate(doc,Buffer.from(meta.update,'base64'));
    meta.pending||=[];meta.submissions||=[];meta.commandReceipts||={};meta.participants||=[];meta.captureSources||={};Object.setPrototypeOf(meta.captureSources,null);
    for(const record of records.sort((a,b)=>a.cursor-b.cursor)){
      const submission=record.submission,key=JSON.stringify([submission.participantId,submission.requestId]);
      for(const edit of submission.capturedChanges||[])if(edit.sourceId)meta.captureSources[edit.sourceId]={actorId:submission.participantId,hash:edit.sourceHash};
      if(!meta.commandReceipts[key])meta.commandReceipts[key]={id:submission.id,participantId:submission.participantId,requestId:submission.requestId,status:submission.status,payloadHash:record.payloadHash};
      if(record.cursor<=(meta.captureCursor||0))continue;
      Y.applyUpdate(doc,Buffer.from(record.documentUpdate,'base64'));
      if(!meta.submissions.some((item:StoredSubmission)=>item.id===submission.id))meta.submissions.push(structuredClone(submission));
      for(const [actor,batch] of record.drafts||[]){
        for(const edit of batch)if(edit.sourceId)meta.captureSources[edit.sourceId]={actorId:actor,hash:edit.sourceHash};
        let existing=meta.pending.find(([id]:[string])=>id===actor);
        if(!existing){existing=[actor,[]];meta.pending.push(existing);}
        const known=new Set(existing[1].map((edit:EditRecord)=>edit.seq));
        existing[1].push(...structuredClone(batch.filter(edit=>!known.has(edit.seq))));
      }
      for(const participant of record.participants||[])if(!meta.participants.some((person:Participant)=>person.id===participant.id))meta.participants.push(structuredClone(participant));
      const consumed=new Set(submission.editSeqs);
      meta.pending=meta.pending.map(([actor,batch]:[string,any[]])=>[actor,actor===submission.participantId?batch.filter(edit=>!consumed.has(edit.seq)):batch]);
      meta.editHistory||=[];
      for(const edit of submission.capturedChanges||[])if(!meta.editHistory.some((item:any)=>item.seq===edit.seq))meta.editHistory.push(structuredClone(edit));
      if(!meta.participants.some((person:Participant)=>person.id===record.participant.id))meta.participants.push(structuredClone(record.participant));
      meta.ownerId||=record.ownerId;meta.documentSequence=Math.max(meta.documentSequence||0,record.documentSequence);
      meta.captureCursor=record.cursor;
    }
    meta.update=Buffer.from(Y.encodeStateAsUpdate(doc)).toString('base64');
    return meta;
  }finally{doc.destroy()}
}
