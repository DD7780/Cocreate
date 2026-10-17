import * as Y from 'yjs';
import {deletionSignature} from '../shared/document-state';
import {decodeCaptureBytes, encodeCaptureBytes, validateCaptureEnvelope, type CaptureEnvelope, type CaptureReceipt, type CaptureSource} from '../shared/capture-command';
import {browserDraftStore, type DraftStore} from './local-drafts';

type Attempt={envelope:CaptureEnvelope;createdAt:number};
export type LocalCommandState='preparing'|'sending'|'unknown'|CaptureReceipt['state'];
export class CaptureCommandController {
  private cache=new Y.Doc();
  private values=this.cache.getMap<string>('commands');
  private writes=Promise.resolve();
  private busy=false;
  private disposed=false;
  constructor(private key:string,private store:DraftStore=browserDraftStore){}
  async restore(doc?:Y.Doc){
    const bytes=await this.store.read(this.key);if(bytes)Y.applyUpdate(this.cache,bytes);
    if(doc){
      const updates=this.sources().map(source=>decodeCaptureBytes(source.update)),probe=new Y.Doc();
      try{Y.applyUpdate(probe,Y.encodeStateAsUpdate(doc));for(const update of updates)Y.applyUpdate(probe,update);}finally{probe.destroy();}
      for(const update of updates)Y.applyUpdate(doc,update,'command-recovery');
    }
  }
  private persist(){
    const bytes=Y.encodeStateAsUpdate(this.cache);
    this.writes=this.writes.catch(()=>{}).then(()=>this.store.merge(this.key,bytes));
    return this.writes;
  }
  record(update:Uint8Array):CaptureSource{
    const source={id:crypto.randomUUID(),update:encodeCaptureBytes(update)};
    this.values.set(`source:${source.id}`,JSON.stringify(source));
    // Admission awaits a fresh complete cache write, including any failed backup.
    void this.persist().catch(()=>{});
    return source;
  }
  sources(){return [...this.values].filter(([key])=>key.startsWith('source:')).map(([,value])=>JSON.parse(value) as CaptureSource);}
  private pending(){return [...this.values].filter(([key])=>key.startsWith('attempt:')).map(([,value])=>JSON.parse(value) as Attempt).sort((a,b)=>a.createdAt-b.createdAt)[0];}
  private async complete(attempt:Attempt,receipt:CaptureReceipt){
    if(!receipt.durable||receipt.requestId!==attempt.envelope.requestId)throw new Error('Invalid canonical capture receipt. Retain this attempt and recover its status.');
    for(const source of attempt.envelope.updates)this.values.delete(`source:${source.id}`);
    this.values.delete(`attempt:${attempt.envelope.requestId}`);
    try{await this.persist();}catch{return {...receipt,message:receipt.message||'Captured durably; device command backup could not be updated. Reopening may recover this same receipt again.'};}
    return receipt;
  }
  /** Called only by a gesture. The cutoff is frozen synchronously, before storage or HTTP. */
  async capture(doc:Y.Doc,sourceIds:string[],transport:{lookup:(id:string)=>Promise<CaptureReceipt|undefined>;send:(envelope:CaptureEnvelope)=>Promise<CaptureReceipt>},onState:(state:LocalCommandState)=>void){
    if(this.disposed)throw new Error('This workspace is closed. Reopen it to recover the command.');
    if(this.busy)throw new Error('A capture is already in progress.');
    this.busy=true;
    let attempt=this.pending();const recovering=!!attempt;let deliveryPossible=recovering;
    try{
      if(!attempt){
        attempt={createdAt:Date.now(),envelope:validateCaptureEnvelope({version:1,requestId:crypto.randomUUID(),cutoff:{vector:encodeCaptureBytes(Y.encodeStateVector(doc)),deletions:deletionSignature(doc)},sourceIds:[...new Set(sourceIds)].sort(),updates:this.sources()})};
        this.values.set(`attempt:${attempt.envelope.requestId}`,JSON.stringify(attempt));
      }
      onState('preparing');await this.persist();
      if(this.disposed)throw new Error('Workspace closed before sending; the attempt is retained.');
      if(recovering){
        onState('unknown');const found=await transport.lookup(attempt.envelope.requestId);
        if(found){const receipt=await this.complete(attempt,found);onState(receipt.state);return receipt;}
      }
      if(this.disposed)throw new Error('Workspace closed; recover the retained attempt after reopening.');
      onState('sending');deliveryPossible=true;
      let receipt:CaptureReceipt;
      try{receipt=await transport.send(attempt.envelope);}catch(error){
        const status=(error as {status?:number}).status;
        // A definitive pre-commit rejection permits a new gesture. Conflicts and
        // server/network errors retain the original identity for canonical lookup.
        if(status&&[400,401,403,413,422,426].includes(status)){
          deliveryPossible=false;this.values.delete(`attempt:${attempt.envelope.requestId}`);await this.persist();
        }
        throw error;
      }
      const result=await this.complete(attempt,receipt);onState(result.state);return result;
    }catch(error){onState(deliveryPossible?'unknown':'failed');throw error;}finally{this.busy=false;}
  }
  dispose(){this.disposed=true;void this.writes.finally(()=>this.cache.destroy()).catch(()=>{});}
}

/** HTTP delivery is bounded; a timeout never asserts that a remote commit failed. */
export function captureTransport(projectId:string,token:()=>string,fetchImpl:typeof fetch=fetch){
  const request=async(path:string,body?:CaptureEnvelope)=>{
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15_000);
    try{
      const response=await fetchImpl(`/api/rooms/${encodeURIComponent(projectId)}/commands/${path}`,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token()}`},body:body?JSON.stringify(body):undefined,signal:controller.signal});
      const value=await response.json();
      if(response.status===404&&value.code==='capture_not_found')return undefined;
      if(!response.ok)throw Object.assign(new Error(value.error||'Capture could not be confirmed. Recover its status with Build my changes.'),{status:response.status});
      return value as CaptureReceipt;
    }catch(error){
      if(typeof (error as {status?:number}).status==='number')throw error;
      throw new Error(`${body?'Capture delivery':'Receipt lookup'} outcome is unknown. Your original command and edits are retained; use Build my changes to recover its receipt.`);
    }finally{clearTimeout(timer);}
  };
  return {lookup:(id:string)=>request(encodeURIComponent(id)),send:async(envelope:CaptureEnvelope)=>{const receipt=await request('capture',envelope);if(!receipt)throw new Error('Capture response is missing. Recover its status.');return receipt;}};
}
