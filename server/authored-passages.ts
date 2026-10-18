import * as Y from 'yjs';
import {createHash} from 'node:crypto';
import type {CaptureEnvelope} from '../shared/capture-command.js';
import type {EditRecord} from './room-state.js';

export type AuthoredSpan={client:number;clock:number;length:number};
export type AuthoredPassage={id:string;text:string;sources:Array<AuthoredSpan&{sourceId:string;seq:number;offset:number;eligible:boolean}>;deletions?:Array<{offset:number;seq:number}>};

/** Attribute only newly observed string clocks, never already-applied collaborator structs. */
export function insertedSpans(update:Uint8Array,before:Uint8Array):AuthoredSpan[]{
  const seen=Y.decodeStateVector(before);
  return Y.decodeUpdate(update).structs.flatMap(item=>{
    if(!(item instanceof Y.Item)||!(item.content instanceof Y.ContentString))return [];
    const clock=Math.max(item.id.clock,seen.get(item.id.client)||0),end=item.id.clock+item.length;
    return end>clock?[{client:item.id.client,clock,length:end-clock}]:[];
  });
}
export function deletedSpans(update:Uint8Array,before:string):AuthoredSpan[]{
  const seen=new Map<number,Array<[number,number]>>(JSON.parse(before)),result:AuthoredSpan[]=[];
  for(const [client,ranges] of Y.decodeUpdate(update).ds.clients)for(const range of ranges){
    let cursor=range.clock;const end=cursor+range.len;
    for(const [clock,length] of seen.get(client)||[]){if(clock+length<=cursor)continue;if(clock>=end)break;if(clock>cursor)result.push({client,clock:cursor,length:clock-cursor});cursor=Math.max(cursor,clock+length);if(cursor>=end)break;}
    if(cursor<end)result.push({client,clock:cursor,length:end-cursor});
  }
  return result;
}

/** Reconstruct the exact cutoff first, then select only this batch's authenticated character clocks. */
export function captureAuthoredPassages(doc:Y.Doc,batch:EditRecord[],cutoff:CaptureEnvelope['cutoff'],history:EditRecord[]=batch):AuthoredPassage[]|undefined{
  // Legacy edits retain their conservative fragment validator; do not invent missing provenance.
  if(batch.some(edit=>!edit.authoredSpans))return undefined;
  const ds=Y.createDeleteSet();
  for(const [client,ranges] of JSON.parse(cutoff.deletions) as Array<[number,Array<[number,number]>]>)ds.clients.set(client,ranges.map(([clock,len])=>({clock,len})));
  const frozen=Y.createDocFromSnapshot(doc,Y.createSnapshot(ds,Y.decodeStateVector(Buffer.from(cutoff.vector,'base64'))));
  const eligible=new Set(batch.map(edit=>edit.seq)),actor=batch[0]?.participantId;
  const owned=new Map<number,Array<AuthoredSpan&{sourceId:string;seq:number;eligible:boolean}>>();
  for(const edit of new Map([...history,...batch].filter(edit=>edit.participantId===actor).map(edit=>[edit.seq,edit])).values())for(const span of edit.authoredSpans||[]){const list=owned.get(span.client)||[];list.push({...span,sourceId:edit.sourceId||`edit-${edit.seq}`,seq:edit.seq,eligible:eligible.has(edit.seq)});owned.set(span.client,list);}
  const key=(node:Y.XmlText)=>{const position=Y.createRelativePositionFromTypeIndex(node,0);return JSON.stringify(position.type||position.tname);};
  const changed=new Set<string>();
  const deleted=new Map<number,Array<{clock:number;length:number;seq:number}>>();
  const touch=(client:number,clock:number,length:number)=>{
    const end=clock+length;
    while(clock<end){const item=Y.getItem(doc.store,Y.createID(client,clock));if(item.parent instanceof Y.XmlText)changed.add(key(item.parent));clock=Math.max(clock+1,item.id.clock+item.length);}
  };
  for(const edit of batch){
    for(const span of edit.authoredSpans!)touch(span.client,span.clock,span.length);
    // Deletion changes the final caller-owned passage, but never authorizes a withdrawal or coauthor text.
    for(const range of edit.deletedSpans||[])for(const span of owned.get(range.client)||[]){const from=Math.max(range.clock,span.clock),to=Math.min(range.clock+range.length,span.clock+span.length);if(to>from){touch(range.client,from,to-from);const list=deleted.get(range.client)||[];list.push({clock:from,length:to-from,seq:edit.seq});deleted.set(range.client,list);}}
  }
  const passages:AuthoredPassage[]=[];
  let text='',sources:AuthoredPassage['sources']=[],deletions:NonNullable<AuthoredPassage['deletions']>=[];
  const flush=()=>{if(text.trim()){const id=createHash('sha256').update(JSON.stringify({text,sources,deletions})).digest('hex');passages.push({id,text,sources,deletions});}text='';sources=[];deletions=[];};
  const visit=(node:unknown)=>{
    if(node instanceof Y.XmlText){
      if(!changed.has(key(node)))return;
      for(const item of Y.getTypeChildren(node)){
        if(item.deleted){for(const range of deleted.get(item.id.client)||[])if(range.clock<item.id.clock+item.length&&range.clock+range.length>item.id.clock)deletions.push({offset:text.length,seq:range.seq});continue;}
        if(item.content instanceof Y.ContentFormat)continue;
        if(!(item.content instanceof Y.ContentString)){flush();continue;}
        const content=item.content.str,start=item.id.clock,end=start+content.length;
        const ranges=(owned.get(item.id.client)||[]).filter(span=>span.clock<end&&span.clock+span.length>start).sort((a,b)=>a.clock-b.clock);
        let cursor=start;
        for(const range of ranges){const from=Math.max(cursor,range.clock),to=Math.min(end,range.clock+range.length);if(to<=from)continue;if(from>cursor)flush();sources.push({client:item.id.client,clock:from,length:to-from,sourceId:range.sourceId,seq:range.seq,offset:text.length,eligible:range.eligible});text+=content.slice(from-start,to-start);cursor=to;}
        if(cursor<end)flush();
      }
    }else if(node instanceof Y.XmlElement||node instanceof Y.XmlFragment){for(const child of node.toArray())visit(child);flush();}
  };
  try{visit(frozen.getXmlFragment('default'));flush();return passages;}finally{frozen.destroy();}
}
