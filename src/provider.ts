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
  private handleDocUpdate = (update: Uint8Array, origin: unknown) => { if(origin===this)return;this.onSave('saving');if(this.ws?.readyState===this.WebSocketImpl.OPEN)this.ws.send(this.wrap(0,update)) };
  private handleAwarenessUpdate = ({added,updated,removed}:{added:number[];updated:number[];removed:number[]},origin:unknown) => {if(origin!==this&&this.ws?.readyState===this.WebSocketImpl.OPEN)this.ws.send(this.wrap(1,encodeAwarenessUpdate(this.awareness,[...added,...updated,...removed])))};

  constructor(public doc:Y.Doc,private roomId:string,private token:string,private onState:(state:RoomView)=>void,private onStatus:(status:ConnectionStatus)=>void,private onSave:(status:'saving'|'saved',at?:string)=>void,dependencies:ProviderDependencies={}){
    this.WebSocketImpl=dependencies.WebSocketImpl||WebSocket;this.fetchImpl=dependencies.fetchImpl||globalThis.fetch.bind(globalThis);this.origin=dependencies.origin||location.origin;this.random=dependencies.random||Math.random;this.maxRetries=dependencies.maxRetries??6;this.setTimer=dependencies.setTimer||((callback,delay)=>window.setTimeout(callback,delay));this.clearTimer=dependencies.clearTimer||(timer=>clearTimeout(timer));
    this.awareness=new Awareness(doc);doc.on('update',this.handleDocUpdate);this.awareness.on('update',this.handleAwarenessUpdate);this.onStatus({state:'connecting',message:'Connecting to live collaboration…'});this.connect();
  }
  private wrap(type:number,data:Uint8Array){const output=new Uint8Array(data.length+1);output[0]=type;output.set(data,1);return output}
  private rejectFlushes(message:string){for(const pending of this.flushes.values()){this.clearTimer(pending.timer);pending.reject(new Error(message))}this.flushes.clear()}
  private async diagnose(generation:number):Promise<ConnectionStatus|null>{try{const response=await this.fetchImpl(`${this.origin}/api/rooms/${encodeURIComponent(this.roomId)}/state`,{headers:{Authorization:`Bearer ${this.token}`}});if(generation!==this.generation||this.stopped)return null;if(response.status===401)return{state:'error',reason:'invalid-session',message:'Your participant session expired or is invalid. Rejoin this room.'};if(response.status===404)return{state:'error',reason:'missing-room',message:'This room is no longer available on the server. Return home and create a new room.'};if(response.status===403)return{state:'error',reason:'forbidden',message:'This session no longer has permission to join the room.'};return null}catch{return null}}
  private scheduleRetry(generation:number){this.failedAttempts+=1;if(this.failedAttempts>this.maxRetries){this.onStatus({state:'error',reason:'unavailable',message:'Live collaboration is unavailable after several retries. Check your connection, then reload the page.'});return}const delay=retryDelay(this.failedAttempts,this.random);this.onStatus({state:'reconnecting',message:'Live collaboration disconnected. Your in-memory edits are retained on this page.',attempt:this.failedAttempts,retryInMs:delay});this.retry=this.setTimer(()=>{if(!this.stopped&&generation===this.generation)this.connect()},delay)}
  private connect(){if(this.stopped)return;if(this.ws&&(this.ws.readyState===this.WebSocketImpl.OPEN||this.ws.readyState===this.WebSocketImpl.CONNECTING))return;const generation=++this.generation,origin=new URL(this.origin),protocol=origin.protocol==='https:'?'wss:':'ws:',socket=new this.WebSocketImpl(`${protocol}//${origin.host}/ws?room=${encodeURIComponent(this.roomId)}&token=${encodeURIComponent(this.token)}`);this.ws=socket;socket.binaryType='arraybuffer';
    socket.onopen=()=>{if(this.stopped||generation!==this.generation||this.ws!==socket)return socket.close();this.onStatus({state:'connected',message:'Live collaboration connected.'});socket.send(JSON.stringify({type:'awareness-client',clientId:this.doc.clientID}));if(this.awareness.getLocalState())socket.send(this.wrap(1,encodeAwarenessUpdate(this.awareness,[this.doc.clientID])))};
    socket.onmessage=event=>{if(generation!==this.generation||this.ws!==socket)return;if(typeof event.data==='string'){try{const message=JSON.parse(event.data);if(message.type==='room-state'){this.failedAttempts=0;this.onState(message.state)}if(message.type==='saved')this.onSave('saved',message.savedAt);if(message.type==='flushed'){const pending=this.flushes.get(message.requestId);if(pending){this.clearTimer(pending.timer);this.flushes.delete(message.requestId);pending.resolve()}}}catch{}return}const data=new Uint8Array(event.data);if(data[0]===0)Y.applyUpdate(this.doc,data.slice(1),this);if(data[0]===1)applyAwarenessUpdate(this.awareness,data.slice(1),this);if(data[0]===2){const missing=Y.encodeStateAsUpdate(this.doc,data.slice(1));if(missing.length>2&&socket.readyState===this.WebSocketImpl.OPEN)socket.send(this.wrap(0,missing))}};
    socket.onerror=()=>{};socket.onclose=async()=>{if(generation!==this.generation||this.ws!==socket)return;this.ws=undefined;this.rejectFlushes('The document disconnected before your changes were acknowledged. No build was started.');if(this.stopped)return;const terminal=await this.diagnose(generation);if(generation!==this.generation||this.stopped)return;if(terminal)this.onStatus(terminal);else this.scheduleRetry(generation)};
  }
  flush(timeoutMs=3_000){if(this.ws?.readyState!==this.WebSocketImpl.OPEN)return Promise.reject(new Error('Reconnect to the shared document before submitting changes.'));const requestId=crypto.randomUUID();return new Promise<void>((resolve,reject)=>{const timer=this.setTimer(()=>{this.flushes.delete(requestId);reject(new Error('The final document update was not acknowledged. Try again.'))},timeoutMs);this.flushes.set(requestId,{resolve,reject,timer});this.ws!.send(JSON.stringify({type:'flush',requestId}))})}
  destroy(){this.stopped=true;this.generation+=1;if(this.retry!==undefined)this.clearTimer(this.retry);this.rejectFlushes('The document connection closed.');this.doc.off('update',this.handleDocUpdate);this.awareness.off('update',this.handleAwarenessUpdate);const socket=this.ws;this.ws=undefined;if(socket&&socket.readyState<this.WebSocketImpl.CLOSING)socket.close();this.awareness.destroy()}
}

export const providerInternals={retryDelay};
