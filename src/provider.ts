import { deletionSignature } from './document-state';
import * as Y from 'yjs';
import { Awareness, applyAwarenessUpdate, encodeAwarenessUpdate } from 'y-protocols/awareness';
import type { RoomView } from './types';

export type ConnectionStatus =
  | { state: 'connecting' | 'connected'; message: string }
  | { state: 'reconnecting'; message: string; attempt: number; retryInMs: number }
  | { state: 'error'; reason: 'invalid-session' | 'missing-room' | 'forbidden' | 'unavailable'; message: string };

type ProviderDependencies = {
  WebSocketImpl?: typeof WebSocket; fetchImpl?: typeof fetch; origin?: string; random?: () => number; maxRetries?: number;
  setTimer?: (callback: () => void, delay: number) => number; clearTimer?: (timer: number) => void;
};

const retryDelay = (attempt: number, random = Math.random) => {
  const base = Math.min(10_000, 500 * 2 ** Math.max(0, attempt - 1));
  return Math.round(base * (0.8 + random() * 0.4));
};

export class CoCreateProvider {
  awareness: Awareness; ws?: WebSocket;
  private stopped = false; private retry?: number; private generation = 0; private failedAttempts = 0;
  private flushes = new Map<string, { resolve: () => void; reject: (error: Error) => void; timer: number }>();
  private WebSocketImpl: typeof WebSocket; private fetchImpl: typeof fetch; private origin: string; private random: () => number;
  private maxRetries: number; private setTimer: (callback: () => void, delay: number) => number; private clearTimer: (timer: number) => void;
  private coordinatorRetryMs=0;
  private pendingUpdates: Uint8Array[] = [];
  private stateCursor=-1; private stateRevision=-1; private savedRevision=-1; private dirty=false;
  private updateTimer?: number;
  private sendPendingUpdates(){if(this.updateTimer!==undefined){this.clearTimer(this.updateTimer);this.updateTimer=undefined}const updates=this.pendingUpdates.splice(0);if(updates.length&&this.ws?.readyState===this.WebSocketImpl.OPEN)this.ws.send(this.wrap(0,Y.mergeUpdates(updates)))}
  private handleDocUpdate = (update: Uint8Array, origin: unknown) => { if(origin===this)return;this.dirty=true;this.onSave(this.ws?.readyState===this.WebSocketImpl.OPEN?'saving':'unsynced');if(this.ws?.readyState===this.WebSocketImpl.OPEN){this.pendingUpdates.push(update);if(this.updateTimer===undefined)this.updateTimer=this.setTimer(()=>this.sendPendingUpdates(),40)} };
  private handleAwarenessUpdate = ({added,updated,removed}:{added:number[];updated:number[];removed:number[]},origin:unknown) => {if(origin!==this&&this.ws?.readyState===this.WebSocketImpl.OPEN)this.ws.send(this.wrap(1,encodeAwarenessUpdate(this.awareness,[...added,...updated,...removed])))};

  constructor(public doc:Y.Doc,private roomId:string,private token:string,private onState:(state:RoomView)=>void,private onStatus:(status:ConnectionStatus)=>void,private onSave:(status:'saving'|'saved'|'unsynced',at?:string)=>void,dependencies:ProviderDependencies={}){
    this.WebSocketImpl=dependencies.WebSocketImpl||WebSocket;this.fetchImpl=dependencies.fetchImpl||globalThis.fetch.bind(globalThis);this.origin=dependencies.origin||location.origin;this.random=dependencies.random||Math.random;this.maxRetries=dependencies.maxRetries??6;this.setTimer=dependencies.setTimer||((callback,delay)=>window.setTimeout(callback,delay));this.clearTimer=dependencies.clearTimer||(timer=>clearTimeout(timer));
    this.awareness=new Awareness(doc);doc.on('update',this.handleDocUpdate);this.awareness.on('update',this.handleAwarenessUpdate);this.onStatus({state:'connecting',message:'Connecting to live collaborationâ€¦'});this.connect();
  }
  private wrap(type:number,data:Uint8Array){const output=new Uint8Array(data.length+1);output[0]=type;output.set(data,1);return output}
  private rejectFlushes(message:string){for(const pending of this.flushes.values()){this.clearTimer(pending.timer);pending.reject(new Error(message))}this.flushes.clear()}
  private async diagnose(generation:number):Promise<ConnectionStatus|null>{
    const controller=new AbortController();let timer:ReturnType<typeof setTimeout>|undefined;
    try{
      const response=await Promise.race([this.fetchImpl(`${this.origin}/api/rooms/${encodeURIComponent(this.roomId)}/state`,{headers:{Authorization:`Bearer ${this.token}`},signal:controller.signal}),new Promise<never>((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new Error('Diagnosis timed out'))},3000)})]);
      if(generation!==this.generation||this.stopped)return null;
      if(response.status===401)return{state:'error',reason:'invalid-session',message:'Your participant session expired or is invalid. Rejoin this room.'};
      if(response.status===404)return{state:'error',reason:'missing-room',message:'This room is no longer available on the server. Return home and create a new room.'};
      if(response.status===403)return{state:'error',reason:'forbidden',message:'This session no longer has permission to join the room.'};
      this.coordinatorRetryMs=response.status===503?Math.max(2000,Math.min(10000,(Number(response.headers.get('Retry-After'))||2)*1000)):0;
      return null;
    }catch{return null}finally{clearTimeout(timer)}
  }
  private scheduleRetry(generation:number){this.failedAttempts+=1;if(this.failedAttempts>this.maxRetries){this.onStatus({state:'error',reason:'unavailable',message:this.coordinatorRetryMs?'The workflow owner is unavailable after several retries. Your in-memory edits remain on this page. Reopen the project to try again.':'Live collaboration is unavailable after several retries. Check your connection, then reload the page.'});return}const delay=Math.max(this.coordinatorRetryMs,retryDelay(this.failedAttempts,this.random));this.onStatus({state:'reconnecting',message:this.coordinatorRetryMs?'Waiting for the workflow owner. Your in-memory edits are retained on this page.':'Live collaboration disconnected. Your in-memory edits are retained on this page.',attempt:this.failedAttempts,retryInMs:delay});this.retry=this.setTimer(()=>{if(!this.stopped&&generation===this.generation)this.connect()},delay)}
  private connect(){if(this.stopped)return;if(this.ws&&(this.ws.readyState===this.WebSocketImpl.OPEN||this.ws.readyState===this.WebSocketImpl.CONNECTING))return;this.stateCursor=-1;this.stateRevision=-1;this.savedRevision=-1;const generation=++this.generation,origin=new URL(this.origin),protocol=origin.protocol==='https:'?'wss:':'ws:',socket=new this.WebSocketImpl(`${protocol}//${origin.host}/ws?room=${encodeURIComponent(this.roomId)}&token=${encodeURIComponent(this.token)}`);this.ws=socket;socket.binaryType='arraybuffer';
    socket.onopen=()=>{if(this.stopped||generation!==this.generation||this.ws!==socket)return socket.close();this.onStatus({state:'connected',message:'Live collaboration connected.'});socket.send(JSON.stringify({type:'awareness-client',clientId:this.doc.clientID}));if(this.awareness.getLocalState())socket.send(this.wrap(1,encodeAwarenessUpdate(this.awareness,[this.doc.clientID])))};
    socket.onmessage=event=>{if(generation!==this.generation||this.ws!==socket)return;if(typeof event.data==='string'){try{const message=JSON.parse(event.data);if(message.type==='room-state'){const cursor=message.state.workflow?.activityCursor??0,revision=message.state.persistRevision??0;if(cursor>=this.stateCursor&&revision>=this.stateRevision){this.stateCursor=cursor;this.stateRevision=revision;this.failedAttempts=0;this.coordinatorRetryMs=0;this.onState(message.state)}}if(message.type==='saved'&&(message.revision??0)>=this.savedRevision){this.savedRevision=message.revision??0;const persisted=typeof message.vector==='string'?Y.decodeStateVector(Uint8Array.from(atob(message.vector),c=>c.charCodeAt(0))):undefined;const local=Y.decodeStateVector(Y.encodeStateVector(this.doc));if((persisted?[...local].every(([id,clock])=>(persisted.get(id)||0)>=clock):!this.dirty)&&(message.deletions===deletionSignature(this.doc)||(!message.deletions&&deletionSignature(this.doc)==='[]'))){this.dirty=false;this.onSave('saved',message.savedAt)}}if(message.type==='save-error')this.onSave('unsynced');if(message.type==='flush-error'){const pending=this.flushes.get(message.requestId);if(pending){this.clearTimer(pending.timer);this.flushes.delete(message.requestId);pending.reject(new Error(message.message||'The document could not be durably saved.'))}}if(message.type==='permission-error')this.onStatus({state:'error',reason:'forbidden',message:String(message.message||'You do not have permission to edit this project.')});if(message.type==='flushed'){const pending=this.flushes.get(message.requestId);if(pending){this.clearTimer(pending.timer);this.flushes.delete(message.requestId);pending.resolve()}}}catch{}return}const data=new Uint8Array(event.data);if(data[0]===0)Y.applyUpdate(this.doc,data.slice(1),this);if(data[0]===1)applyAwarenessUpdate(this.awareness,data.slice(1),this);if(data[0]===2){const missing=Y.encodeStateAsUpdate(this.doc,data.slice(1));if(missing.length>2&&socket.readyState===this.WebSocketImpl.OPEN)socket.send(this.wrap(0,missing))}};
    socket.onerror=()=>{};socket.onclose=async()=>{if(generation!==this.generation||this.ws!==socket)return;this.ws=undefined;if(this.dirty)this.onSave('unsynced');this.rejectFlushes('The document disconnected before your changes were acknowledged. No build was started.');if(this.stopped)return;const terminal=await this.diagnose(generation);if(generation!==this.generation||this.stopped)return;if(terminal)this.onStatus(terminal);else this.scheduleRetry(generation)};
  }
  flush(timeoutMs=3_000){if(this.ws?.readyState!==this.WebSocketImpl.OPEN)return Promise.reject(new Error('Reconnect to the shared document before submitting changes.'));this.sendPendingUpdates();const requestId=crypto.randomUUID();return new Promise<void>((resolve,reject)=>{const timer=this.setTimer(()=>{this.flushes.delete(requestId);reject(new Error('The final document update was not acknowledged. Try again.'))},timeoutMs);this.flushes.set(requestId,{resolve,reject,timer});this.ws!.send(JSON.stringify({type:'flush',requestId}))})}
  destroy(){this.sendPendingUpdates();this.stopped=true;this.generation+=1;if(this.retry!==undefined)this.clearTimer(this.retry);this.rejectFlushes('The document connection closed.');this.doc.off('update',this.handleDocUpdate);this.awareness.off('update',this.handleAwarenessUpdate);const socket=this.ws;this.ws=undefined;if(socket&&socket.readyState<this.WebSocketImpl.CLOSING)socket.close();this.awareness.destroy()}
}

export const providerInternals={retryDelay};
