import type express from 'express';
import { randomUUID } from 'node:crypto';
import type { Session } from './auth.js';
import type { Room, RoomManager } from './rooms.js';
import type { SupabasePlatform } from './supabase-platform.js';
import type { SharedBrowserSession } from '../shared/browser-session.js';
import { validateBrowserInput } from '../shared/browser-session.js';
import { SharedBrowserExecutor } from './shared-browser-executor.js';
import { approvedBrowserOrigin } from './browser-network.js';
import { browserState, browserHash, browserDownloadBytes, restoreBrowserDownload } from './browser-state.js';
import { artifactResponse } from './artifacts.js';
import { coordinatorResponse } from './coordinator-response.js';

export function registerSharedBrowserRoutes(app:express.Express,manager:RoomManager,authorize:(req:express.Request,res:express.Response)=>{room:Room;session:Session}|null,platform?:SupabasePlatform){
  const runtimes=new Map<string,SharedBrowserExecutor>();
  const fail:(message:string,status?:number)=>never=(message,status=403)=>{throw Object.assign(new Error(message),{status});};
  const headers=(res:express.Response)=>{res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Content-Type-Options','nosniff');};
  const error=(res:express.Response,e:unknown)=>{if(!artifactResponse(res,e)&&!coordinatorResponse(res,e))res.status(Number((e as any)?.status)||400).json({error:e instanceof Error?e.message:'Browser operation failed.'});};
  const fresh=async(room:Room,actor:string,write=false)=>{await platform?.requireMembership(room.id,actor,write?['owner','editor']:['owner','editor','viewer']);await platform?.assertCoordinator(room.id);};
  const access=(room:Room,id:string,actor:string,input=false)=>{
    const session=room.browser?.sessions.find(s=>s.id===id);if(!session||!session.observe.includes(actor))return fail('Session observation needs explicit owner permission.');
    if(session.privateLogin&&actor!==session.ownerId)return fail('This login/session screen is private to the connection owner.');
    if(input&&(!session.control.includes(actor)||session.controllerId!==actor))return fail('Only the explicitly granted active controller can send input.');
    return session;
  };
  const runtime=(session:SharedBrowserSession)=>{
    const value=runtimes.get(session.id);
    if(session.expiresAt<=Date.now()){value?.stop();session.state='expired';fail('Browser session expired. Explicitly reopen.',409);}
    if(session.state!=='connected'||!value?.alive)fail('Browser disconnected. Reopen a fresh session; recorded actions will not replay.',409);
    return value;
  };
  const views=(room:Room,actor:string)=>browserState(room.browser).sessions.filter(s=>s.observe.includes(actor)).map(s=>({ ...s,state:s.expiresAt<=Date.now()?'expired':runtimes.get(s.id)?.alive?s.state:'disconnected', receipts:s.receipts.map(({hash,...r})=>r) }));
  const networkAuthority=(room:Room,id:string)=>async()=>{const s=room.browser?.sessions.find(x=>x.id===id);if(!s||s.state!=='connected'||s.paused||s.expiresAt<=Date.now())fail('Browser network authority expired.',409);try{await fresh(room,s.ownerId,true);await fresh(room,s.controllerId,true);}catch(e){runtimes.get(id)?.stop();throw e;}};
  const authRoute=(operation:(req:express.Request,res:express.Response,auth:{room:Room;session:Session})=>Promise<void>)=>async(req:express.Request,res:express.Response)=>{const auth=authorize(req,res);if(!auth)return;headers(res);try{if(req.method==='GET')await auth.room.browserMutation?.catch(()=>undefined);await fresh(auth.room,auth.session.participantId,req.method!=='GET');const connection=auth.room.browser?.sessions.find(s=>s.id===req.params.sessionId);if(connection){try{await fresh(auth.room,connection.ownerId,true);}catch(e){runtimes.get(connection.id)?.stop();throw e;}}await operation(req,res,auth);}catch(e){error(res,e);}};
  app.get('/api/rooms/:id/browser',authRoute(async(_req,res,{room,session})=>{res.json({sessions:views(room,session.participantId),downloads:browserState(room.browser).downloads});}));
  app.post('/api/rooms/:id/browser',authRoute(async(req,res,{room,session})=>{
    const actor=session.participantId,{origin,observe=[],control=[]}=req.body;
    if(typeof origin!=='string')fail('Select an approved origin.',400);approvedBrowserOrigin(origin);
    if(Object.keys(req.body).some(key=>!['origin','observe','control'].includes(key))||!Array.isArray(observe)||!Array.isArray(control)||observe.length>20||control.length>20||[...observe,...control].some(id=>typeof id!=='string'||!room.participants.has(id))||control.some(id=>!observe.includes(id)))fail('Select exact current participants and separate grants.',400);
    const connection:SharedBrowserSession={id:randomUUID(),ownerId:actor,controllerId:actor,origin,epoch:1,observe:[...new Set([actor,...observe])],control:[...new Set([actor,...control])],privateLogin:true,paused:false,state:'disconnected',expiresAt:Date.now()+600_000,receipts:[]};
    await manager.mutateBrowser(room,actor,state=>{if(state.sessions.length>=8||state.sessions.filter(s=>s.state==='connected').length>=2)fail('Browser session limit reached.',409);state.sessions.push(connection);},()=>fresh(room,actor,true));
    const executor=new SharedBrowserExecutor();runtimes.set(connection.id,executor);
    try{await executor.start(origin,networkAuthority(room,connection.id));await manager.mutateBrowser(room,actor,state=>{state.sessions.find(s=>s.id===connection.id)!.state='connected';},()=>fresh(room,actor,true));}
    catch(e){await executor.dispose();runtimes.delete(connection.id);throw e;}
    res.json({sessions:views(room,actor)});
  }));
  app.get('/api/rooms/:id/browser/:sessionId/frame',authRoute(async(req,res,{room,session})=>{
    const s=access(room,String(req.params.sessionId),session.participantId),epoch=s.epoch;
    if(s.paused)fail('Session paused; no frames are shared.',409);
    const image=await runtime(s).frame();await fresh(room,session.participantId);const after=access(room,s.id,session.participantId);
    if(after.epoch!==epoch||after.paused||after.expiresAt<=Date.now())fail('Screen permission changed during capture.',409);res.type('image/png').send(image);
  }));
  app.post('/api/rooms/:id/browser/:sessionId/input',authRoute(async(req,res,{room,session})=>{
    const actor=session.participantId,id=String(req.params.sessionId),{commandId,epoch,input:raw}=req.body;
    if(!/^[a-f0-9-]{36}$/.test(commandId)||!Number.isSafeInteger(epoch)||Object.keys(req.body).some(k=>!['commandId','epoch','input'].includes(k)))fail('Invalid browser command.',400);
    const input=validateBrowserInput(raw),hash=browserHash(JSON.stringify({epoch,input}));let replay=false;
    await manager.mutateBrowser(room,actor,state=>{
      const s=access({...room,browser:state},id,actor,true),prior=s.receipts.find(r=>r.id===commandId);
      if(prior){if(prior.hash!==hash||prior.actorId!==actor)fail('Command ID replay changed its payload.',409);replay=true;return;}
      runtime(s);if(s.epoch!==epoch||s.paused||s.receipts.some(r=>r.state==='pending'))fail('Stale, paused or busy session.',409);
      if(s.receipts.length>=256)fail('Durable command limit reached; create a new session.',409);
      s.receipts.push({id:commandId,actorId:actor,epoch,kind:input.kind,hash,state:'pending',createdAt:new Date().toISOString()});
    },()=>fresh(room,actor,true));
    if(replay){res.json({sessions:views(room,actor),replayed:true});return;}
    const s=access(room,id,actor,true);let outcome:'completed'|'unknown'='unknown';
    try{await fresh(room,s.ownerId,true);await fresh(room,actor,true);if(s.epoch!==epoch)fail('Controller changed before input.',409);await runtime(s).input(s.origin,input,s.privateLogin,commandId);outcome='completed';}
    finally{await manager.mutateBrowser(room,actor,state=>{const current=state.sessions.find(x=>x.id===id)!;const receipt=current.receipts.find(r=>r.id===commandId)!;if(receipt.state==='pending')receipt.state=outcome;},()=>fresh(room,actor,true)).catch(()=>{runtimes.get(id)?.stop();});}
    await fresh(room,actor,true);res.json({sessions:views(room,actor),pendingDownloads:runtimes.get(id)?.pendingDownloads()||[]});
  }));
  app.post('/api/rooms/:id/browser/:sessionId/control',authRoute(async(req,res,{room,session})=>{
    const actor=session.participantId,id=String(req.params.sessionId),{action,epoch,actorId}=req.body;
    if(Object.keys(req.body).some(k=>!['action','epoch','actorId'].includes(k))||!['handoff','private_login','share_authenticated','pause','resume','cancel','disconnect'].includes(action))fail('Invalid browser control.',400);
    await manager.mutateBrowser(room,actor,state=>{
      const s=state.sessions.find(x=>x.id===id);if(!s||!s.control.includes(actor))fail('Explicit control permission required.');
      if(s.epoch!==epoch)fail('Stale controller epoch.',409);
      const ownerAction=['private_login','share_authenticated','disconnect','resume'].includes(action);
      if(ownerAction?actor!==s.ownerId:actor!==s.controllerId)fail('Only the current controller or connection owner can perform this operation.');
      if(['private_login','share_authenticated','handoff'].includes(action)&&(s.receipts.some(r=>r.state==='pending')||runtimes.get(id)?.busy))fail('Wait for the current input/network action to settle.',409);
      if(action==='handoff'){if(s.privateLogin||!s.control.includes(actorId))fail('Finish private login and explicitly share before handoff.');s.controllerId=actorId;s.epoch++;}
      if(action==='private_login'){s.privateLogin=true;s.controllerId=s.ownerId;s.epoch++;}
      if(action==='share_authenticated'){s.privateLogin=false;s.epoch++;}
      if(action==='pause'){s.paused=true;s.epoch++;runtimes.get(id)?.stop();s.state='disconnected';for(const r of s.receipts)if(r.state==='pending')r.state='unknown';}
      if(action==='resume'){if(!s.paused||s.expiresAt<=Date.now())fail('Only a paused unexpired session can resume; otherwise create a new connection.',409);s.paused=false;s.privateLogin=true;s.controllerId=s.ownerId;s.epoch++;s.state='disconnected';}
      if(action==='cancel'||action==='disconnect'){s.state='disconnected';s.epoch++;for(const r of s.receipts)if(r.state==='pending')r.state='unknown';runtimes.get(id)?.stop();}
    },()=>fresh(room,actor,true));
    if(action==='resume'){
      await runtimes.get(id)?.dispose();const executor=new SharedBrowserExecutor();runtimes.set(id,executor);
      try{await executor.start(room.browser!.sessions.find(s=>s.id===id)!.origin,networkAuthority(room,id));await manager.mutateBrowser(room,actor,state=>{state.sessions.find(s=>s.id===id)!.state='connected';},()=>fresh(room,actor,true));}
      catch(e){await executor.dispose();throw e;}
    }
    res.json({sessions:views(room,actor)});
  }));
  app.get('/api/rooms/:id/browser/:sessionId/downloads',authRoute(async(req,res,{room,session})=>{const s=access(room,String(req.params.sessionId),session.participantId,true);res.json({pendingDownloads:runtime(s).pendingDownloads()});}));
  app.post('/api/rooms/:id/browser/:sessionId/downloads/:downloadId/publish',authRoute(async(req,res,{room,session})=>{
    const actor=session.participantId,s=access(room,String(req.params.sessionId),actor,true),executor=runtime(s),downloadId=String(req.params.downloadId);
    if(actor!==s.ownerId||req.body.epoch!==s.epoch)fail('Only the connection owner may explicitly publish a downloaded file under the current epoch.');
    const file=executor.takeDownload(downloadId);
    await manager.mutateBrowser(room,actor,state=>{
      const current=access({...room,browser:state},s.id,actor,true);if(current.epoch!==req.body.epoch)fail('Stale download publication.',409);if(state.downloads.length>=128)fail('Saved download limit reached.',409);
      const command=current.receipts.find(r=>r.id===file.commandId&&r.state==='completed');if(!command)fail('Download has no settled command provenance.',409);
      const metadata={id:downloadId,sessionId:s.id,commandId:command.id,participantId:actor,projectId:room.id,name:file.name,mime:'text/plain' as const,byteLength:file.bytes.length,contentHash:browserHash(file.bytes),createdAt:new Date().toISOString()};
      const body=browserDownloadBytes(metadata,file.bytes),ref=manager.eventStore.writeArtifact(body,'application/vnd.cocreate.browser-download+json');
      state.downloads.push({...metadata,contentRef:ref.ref});
    },()=>fresh(room,actor,true));executor.releaseDownload(downloadId);res.json({downloads:browserState(room.browser).downloads});
  }));
  app.get('/api/rooms/:id/browser-downloads/:downloadId',authRoute(async(req,res,{room,session})=>{
    const file=room.browser?.downloads.find(d=>d.id===req.params.downloadId);if(!file||file.projectId!==room.id)fail('Saved browser file not found.',404);
    const bytes=restoreBrowserDownload(await manager.readArchivedArtifact(room,file.contentRef),file);await fresh(room,session.participantId);
    res.setHeader('Content-Disposition',`attachment; filename="${file.name}"`);res.type('text/plain').send(bytes);
  }));
  return async()=>{await Promise.all([...runtimes.values()].map(executor=>executor.dispose()));runtimes.clear();};
}
