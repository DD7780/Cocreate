import * as Y from 'yjs';
import { Awareness, applyAwarenessUpdate, encodeAwarenessUpdate } from 'y-protocols/awareness';
import type { RoomView } from './types';

export class CoCreateProvider {
  awareness: Awareness;
  ws?: WebSocket;
  private stopped = false;
  private retry?: number;
  private flushes = new Map<string, {resolve:()=>void; reject:(error:Error)=>void; timer:number}>();

  constructor(
    public doc: Y.Doc,
    private roomId: string,
    private token: string,
    private onState: (state: RoomView) => void,
    private onStatus: (status: 'connected' | 'reconnecting' | 'offline') => void,
    private onSave: (status: 'saving' | 'saved', at?: string) => void,
  ) {
    this.awareness = new Awareness(doc);
    doc.on('update', (update, origin) => {
      if (origin !== this) {
        this.onSave('saving');
        if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(this.wrap(0, update));
      }
    });
    this.awareness.on('update', ({ added, updated, removed }: { added:number[]; updated:number[]; removed:number[] }, origin:unknown) => {
      if (origin !== this && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(this.wrap(1, encodeAwarenessUpdate(this.awareness, [...added, ...updated, ...removed])));
      }
    });
    this.connect();
  }

  private wrap(type:number, data:Uint8Array) { const output=new Uint8Array(data.length+1); output[0]=type; output.set(data,1); return output; }

  private connect() {
    const protocol=location.protocol==='https:'?'wss:':'ws:';
    this.ws=new WebSocket(`${protocol}//${location.host}/ws?room=${encodeURIComponent(this.roomId)}&token=${encodeURIComponent(this.token)}`);
    this.ws.binaryType='arraybuffer';
    this.ws.onopen=()=>{
      this.onStatus('connected');
      this.ws?.send(JSON.stringify({type:'awareness-client',clientId:this.doc.clientID}));
      if(this.awareness.getLocalState()) this.ws?.send(this.wrap(1,encodeAwarenessUpdate(this.awareness,[this.doc.clientID])));
    };
    this.ws.onmessage=(event)=>{
      if(typeof event.data==='string'){
        try{const message=JSON.parse(event.data);if(message.type==='room-state')this.onState(message.state);if(message.type==='saved')this.onSave('saved',message.savedAt);if(message.type==='flushed'){const pending=this.flushes.get(message.requestId);if(pending){clearTimeout(pending.timer);this.flushes.delete(message.requestId);pending.resolve()}}}catch{}
        return;
      }
      const data=new Uint8Array(event.data);
      if(data[0]===0)Y.applyUpdate(this.doc,data.slice(1),this);
      if(data[0]===1)applyAwarenessUpdate(this.awareness,data.slice(1),this);
      if(data[0]===2){const missing=Y.encodeStateAsUpdate(this.doc,data.slice(1));if(missing.length>2)this.ws?.send(this.wrap(0,missing));}
    };
    this.ws.onclose=()=>{if(this.stopped)return;this.onStatus('reconnecting');this.retry=window.setTimeout(()=>this.connect(),1000)};
    this.ws.onerror=()=>this.onStatus('offline');
  }

  flush(timeoutMs=3_000){
    if(this.ws?.readyState!==WebSocket.OPEN)return Promise.reject(new Error('Reconnect to the shared document before submitting changes.'));
    const requestId=crypto.randomUUID();
    return new Promise<void>((resolve,reject)=>{const timer=window.setTimeout(()=>{this.flushes.delete(requestId);reject(new Error('The final document update was not acknowledged. Try again.'))},timeoutMs);this.flushes.set(requestId,{resolve,reject,timer});this.ws!.send(JSON.stringify({type:'flush',requestId}))});
  }

  destroy(){this.stopped=true;if(this.retry)clearTimeout(this.retry);for(const pending of this.flushes.values()){clearTimeout(pending.timer);pending.reject(new Error('The document connection closed.'))}this.flushes.clear();this.ws?.close();this.awareness.destroy();}
}
