import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import * as Y from 'yjs';
import { RoomManager } from '../../server/rooms.js';

export const pause = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
export async function waitFor(check: () => boolean, label: string, timeout = 15_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) { if (check()) return; await pause(10); }
  throw new Error(`Progress fixture timed out: ${label}`);
}

export async function createProgressFixture(options: {hold?: boolean;personalDelayMs?: number;buildMaxWaitMs?:number;buildDebounceMs?:number;authorize?: (actor:string)=>Promise<void>} = {}) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'build-progress-'));
  const gates = new Map<number, () => void>();
  const builders: Array<{revision:number;accepted:number;start:number}> = [];
  const personal: Array<{actor:string;start:number}> = [];
  const server = http.createServer(async (request, response) => {
    try {
      let raw = ''; for await (const chunk of request) raw += chunk;
      const body = JSON.parse(raw), input = JSON.parse(body.input);
      const interpreting = body.text?.format?.schema?.required?.includes('goals');
      let value: unknown;
      if (interpreting) {
        personal.push({actor:input.participantName.toLowerCase(),start:Date.now()});
        await pause(options.personalDelayMs || 0);
        const text = input.authenticatedChanges.map((change:{after:string})=>change.after).join(' ');
        value = {goals:[text],features:[],design:[],constraints:[],questions:[],additions:[],modifications:[],withdrawals:[],classification:'explicit_request',affectedRequirementIds:[],sourcePassages:[text],
          intents:[{text,category:'goal',classification:'explicit_request',rationale:'Controlled direct request',sourcePassage:text,affectedRequirementIds:[]}]};
      } else {
        builders.push({revision:room.specificationRevision,accepted:input.acceptedRequirements.length,start:Date.now()});
        if (options.hold) await new Promise<void>(resolve=>gates.set(builders.length,resolve));
        value = {operations:[{type:'write',path:'src/App.tsx',content:`export default function App(){return <main><h1>Progress sample</h1>{${JSON.stringify(input.acceptedRequirements.map((item:{description:string})=>item.description))}.map((text,index)=><p key={index}>{text}</p>)}</main>}`}],summary:'Controlled progress artifact',decisions:[],conflicts:[],specification:{agreed:[],proposed:[],questions:[]}};
      }
      if (!response.destroyed) {
        response.setHeader('content-type','application/json');
        response.end(JSON.stringify({output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}],status:'completed',usage:{input_tokens:10,output_tokens:20}}));
      }
    } catch { if (!response.destroyed) response.writeHead(500).end(); }
  });
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  const address=server.address(); assert.ok(address && typeof address !== 'string');
  const config={dataDir,debounceMs:10,buildDebounceMs:options.buildDebounceMs||30,buildCooldownMs:0,buildMaxWaitMs:options.buildMaxWaitMs||100,encryptionSecret:'controlled-progress',authorizeSubmission:options.authorize?async(_room:string,actor:string)=>options.authorize!(actor):undefined};
  let manager = new RoomManager(config);
  let room = manager.create(randomUUID());
  for (const [id,name] of [['alice','Alice'],['bob','Bob'],['cara','Cara']]) manager.join(room,id,name);
  const connection=await manager.saveConnection(room,{name:'Controlled progress',provider:'custom',baseUrl:`http://127.0.0.1:${address.port}`,apiFormat:'responses',apiKey:'synthetic'});
  room.ai.connections![0].checks.fixture={reachable:{status:'passed'},text:{status:'passed'},personal:{status:'passed'},builder:{status:'passed'}};
  await manager.assignAI(room,{connectionId:connection.id,model:'fixture'},{connectionId:connection.id,model:'fixture'});
  let stopped = false;
  const edit = (actor:string,text:string) => {
    const doc = new Y.Doc();
    try {
      Y.applyUpdate(doc,Y.encodeStateAsUpdate(room.doc)); const vector=Y.encodeStateVector(doc);
      const paragraph=new Y.XmlElement('paragraph'),value=new Y.XmlText();
      doc.transact(()=>{doc.getXmlFragment('default').push([paragraph]);paragraph.push([value]);value.insert(0,text);});
      manager.handleMessage(room,{participantId:actor,readyState:0,send(){},close(){}} as never,Buffer.concat([Buffer.from([0]),Buffer.from(Y.encodeStateAsUpdate(doc,vector))]),true);
    } finally {doc.destroy();}
  };
  const fixture = {
    get manager(){return manager;},get room(){return room;},dataDir,builders,personal,gates,edit,
    async submit(actor:string,text:string,key:string){edit(actor,text);return manager.submitChanges(room,actor,key);},
    release(index:number){assert.ok(gates.has(index));gates.get(index)!();gates.delete(index);},
    async reopen(){const id=room.id,active=room.buildTask;manager.shutdown();stopped=true;await active;manager=new RoomManager(config);room=manager.get(id)!;stopped=false;return room;},
    async close(){
      if(!stopped){const active=room.buildTask;manager.shutdown();stopped=true;await active;}
      for(const release of gates.values())release();
      server.closeAllConnections();await new Promise<void>(resolve=>server.close(()=>resolve()));
      if(path.dirname(path.resolve(dataDir))!==path.resolve(os.tmpdir())||!path.basename(dataDir).startsWith('build-progress-'))throw new Error('Unsafe fixture cleanup');
      fs.rmSync(dataDir,{recursive:true,force:true,maxRetries:4,retryDelay:100});
    },
  };
  return fixture;
}
