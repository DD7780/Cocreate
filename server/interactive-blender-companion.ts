import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import {spawn} from 'node:child_process';
import {randomUUID,randomBytes} from 'node:crypto';
import {InteractiveBlenderExecutor,assertInteractiveBlenderRuntime} from './interactive-blender-executor.js';
import {writeCompanionReceipt,type LocalBlenderApproval} from './blender-companion.js';
import {INTERACTIVE_BLENDER_POLICY} from '../shared/blender-interactive.js';
import {BLENDER_VERSION,BLENDER_OPERATIONS,validateBlenderScene,type BlenderResult,type BlenderCommand} from '../shared/blender.js';
import {interactiveHash,validateInteractiveState,type InteractiveCommand} from './blender-interactive-state.js';

type Options = {server:string;projectId:string;pairingToken?:string;resume?:boolean;executable:string;workspace:string;observe:string[];control:string[];operations:string[];name:string;approveLocal:(approval:LocalBlenderApproval)=>Promise<boolean>;signal:AbortSignal;onState?:(state:string)=>void};
type Receipt = {commandId:string;epoch:number;hash:string;state:'running'|'completed'|'unknown'|'cancelled'|'failed';result?:BlenderResult};
function privateDirectory(directory:string){
  const absolute=path.resolve(directory),stat=fs.lstatSync(absolute);
  if(fs.realpathSync(absolute)!==absolute||!stat.isDirectory()||stat.uid!==process.getuid?.()||(stat.mode&0o077)!==0)throw new Error('Use a dedicated owner-only Linux directory (mode 700), without links.');
  let current=absolute;while(path.dirname(current)!==current){if(fs.lstatSync(current).isSymbolicLink())throw new Error('Linked companion directory rejected.');current=path.dirname(current);}return absolute;
}
function privateFile(filename:string){const stat=fs.lstatSync(filename);if(!stat.isFile()||stat.isSymbolicLink()||stat.uid!==process.getuid?.()||(stat.mode&0o077)!==0||stat.size>8*1024**2)throw new Error('Companion receipt or credential permissions are invalid.');}
async function lease(workspace:string){
  const filename=path.join(workspace,'.cocreate-blender-lock');if(!fs.existsSync(filename))fs.closeSync(fs.openSync(filename,'wx',0o600));privateFile(filename);
  const child=spawn('/usr/bin/flock',['-n','-E','73',filename,process.execPath,'-e',"process.stdout.write('LOCKED\\n');process.stdin.resume();process.stdin.on('end',()=>process.exit());"],{windowsHide:true,stdio:['pipe','pipe','pipe'],env:{PATH:'/usr/bin:/bin',LANG:'C.UTF-8'}});
  const controller=new AbortController(),closed=new Promise<void>(resolve=>child.once('close',()=>{controller.abort();resolve();}));
  try{await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Exclusive companion lease unavailable.')),5000);const fail=()=>{clearTimeout(timer);reject(Error('Another companion owns this workspace.'));};child.once('error',fail);child.once('close',fail);child.stderr.resume();child.stdout.once('data',chunk=>{clearTimeout(timer);if(String(chunk)!=='LOCKED\n')return fail();child.removeListener('error',fail);child.removeListener('close',fail);resolve();});});}catch(error){child.stdin.end();await closed;throw error;}
  return {signal:controller.signal,release:async()=>{child.stdin.end();await closed;}};
}
function collect(executor:InteractiveBlenderExecutor,commandId:string,sceneHash:string):BlenderResult{
  const read=(name:string,max:number)=>{const file=path.join(executor.workspace,name),stat=fs.lstatSync(file);if(!stat.isFile()||stat.isSymbolicLink()||stat.size<1||stat.size>max)throw Error('Invalid dedicated app output.');return fs.readFileSync(file).toString('base64');};
  return {blend:read('scene.blend',4*1024**2),png:read('render.png',1024**2),evidence:{policy:INTERACTIVE_BLENDER_POLICY,blenderVersion:BLENDER_VERSION,commandId,sceneHash,cleanupVerified:true}};
}

/** Explicit local approval and native preflight precede pairing. No host display is captured. */
export async function runInteractiveBlenderCompanion(options:Options){
  assertInteractiveBlenderRuntime();
  if(path.resolve(options.executable)!=='/opt/cocreate-blender/blender')throw Error('Use the image-attested dedicated Linux Blender executable.');
  const server=new URL(options.server);
  if(server.username||server.password||server.search||server.hash||server.pathname!=='/'||!(server.protocol==='https:'||server.protocol==='http:'&&['127.0.0.1','localhost','[::1]'].includes(server.hostname)))throw Error('Use an authenticated HTTPS server or controlled loopback.');
  const workspace=privateDirectory(options.workspace),connectionFile=path.join(workspace,'.cocreate-blender-connection.json'),spool=path.join(workspace,'.cocreate-blender-receipts');
  if(fs.existsSync(connectionFile)&&!options.resume)throw Error('Connection exists. Explicitly resume or use a fresh dedicated workspace.');
  if(!fs.existsSync(spool))fs.mkdirSync(spool,{mode:0o700});privateDirectory(spool);
  const request=async(endpoint:string,body:unknown,token?:string,stopping=false)=>{
    const response=await fetch(new URL(endpoint,server),{method:'POST',redirect:'error',signal:stopping?AbortSignal.timeout(5000):AbortSignal.any([options.signal,AbortSignal.timeout(10000)]),headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});
    const chunks:Uint8Array[]=[];let size=0;for await(const chunk of response.body as any){size+=chunk.length;if(size>128*1024)throw Error('Companion response exceeded its bound.');chunks.push(chunk);}const value=JSON.parse(Buffer.concat(chunks).toString());
    if(!response.ok)throw Object.assign(Error(value.error||'Authenticated companion request failed.'),{status:response.status});return value;
  };
  const base=`/api/blender/devices/${encodeURIComponent(options.projectId)}`;
  let saved:any;if(options.resume&&fs.existsSync(connectionFile)){privateFile(connectionFile);saved=JSON.parse(fs.readFileSync(connectionFile,'utf8'));if(saved.server!==server.origin||saved.projectId!==options.projectId||saved.workspace!==workspace||saved.executable!==options.executable||saved.interactivePolicy!==INTERACTIVE_BLENDER_POLICY||!/^[a-f0-9-]{36}$/.test(saved.id)||!/^[A-Za-z0-9_-]{43}$/.test(saved.credential))throw Error('Saved companion target or policy differs; re-pair explicitly.');}
  const info=saved||await request(base+'/pair-info',{pairingToken:options.pairingToken});
  if(options.operations.length!==3||!BLENDER_OPERATIONS.every(op=>options.operations.includes(op)))throw Error('Explicitly allow create_scene,save,render.');
  const approval={...info,executable:options.executable,workspace,observe:saved?.observe||options.observe,control:saved?.control||options.control,operations:BLENDER_OPERATIONS,interactivePolicy:INTERACTIVE_BLENDER_POLICY};
  if(!await options.approveLocal(approval)||options.signal.aborted)throw Error('Local interactive approval declined.');
  const lock=await lease(workspace);options={...options,signal:AbortSignal.any([options.signal,lock.signal])};
  const outside=path.join(os.tmpdir(),'cocreate-gui-private-'+randomUUID());fs.writeFileSync(outside,'controlled private sentinel',{flag:'wx',mode:0o600});
  const listener=net.createServer(socket=>socket.destroy());await new Promise<void>(resolve=>listener.listen(0,'127.0.0.1',resolve));
  const probe={outside,port:(listener.address() as net.AddressInfo).port};
  let human:InteractiveBlenderExecutor|undefined,active:{id:string;epoch:number;controller:AbortController;promise:Promise<void>}|undefined,lastSuccess=Date.now(),lastFrame=0,receiptFailure:unknown,deviceBase='',credential='';
  let closing=Promise.resolve();
  const stopHuman=()=>{const prior=human;human=undefined;closing=closing.then(()=>prior?.close());return closing;};
  const monitor=setInterval(()=>{if(Date.now()-lastSuccess>=10000){active?.controller.abort();void stopHuman().catch(()=>undefined);}},100);
  const abort=()=>{active?.controller.abort();void stopHuman().catch(()=>undefined);};options.signal.addEventListener('abort',abort,{once:true});
  try{
    const preflight=new InteractiveBlenderExecutor();try{await preflight.start(probe,undefined,options.signal);await preflight.frame();}finally{await preflight.close();}
    credential=saved?.credential||randomBytes(32).toString('base64url');
    const session=saved||await request(base+'/pair',{credential,name:options.name,observe:options.observe,control:options.control,operations:[...BLENDER_OPERATIONS],blenderVersion:BLENDER_VERSION,localApproval:true,interactivePolicy:INTERACTIVE_BLENDER_POLICY},options.pairingToken);
    deviceBase=base+'/'+encodeURIComponent(session.id);
    if(!saved)writeCompanionReceipt(connectionFile,{...approval,server:server.origin,projectId:options.projectId,id:session.id,credential,expiresAt:session.expiresAt});
    lastSuccess=Date.now();options.onState?.('Connected dedicated Blender display. STOP / Ctrl+C removes the whole job and disconnects.');
    while(!options.signal.aborted){
      if(receiptFailure)throw receiptFailure;
      try{
        const packet=await request(deviceBase+'/poll',{},credential);lastSuccess=Date.now();
        if(packet.session.state!=='connected'||Date.now()>=packet.session.expiresAt)break;
        const ui=packet.interactive as InteractiveCommand|null,agent=packet.command as BlenderCommand|null;
        if(ui){validateInteractiveState({policy:INTERACTIVE_BLENDER_POLICY,state:'unknown',receipts:[ui]});if(ui.actorId!==packet.session.controllerId)throw Error('Controller authority changed.');}
        if(agent&&agent.sessionId!==session.id)throw Error('Device command targets another session.');
        if(active&&(packet.session.paused||packet.session.epoch!==active.epoch||ui?.state==='cancel_requested'||agent&&['cancel_requested','interrupted'].includes(agent.state))){active.controller.abort();await stopHuman();await active.promise;active=undefined;}
        if(packet.session.paused)await stopHuman();
        const command=agent||ui;
        if(command&&!active){
          const isAgent=!!agent,id=command.id,epoch=command.epoch;
          if(!/^[a-f0-9-]{36}$/.test(id)||epoch!==packet.session.epoch)throw Error('Stale dedicated app command.');
          const hash=isAgent?interactiveHash(validateBlenderScene(agent!.scene)):ui!.hash,filename=path.join(spool,(isAgent?'':'ui-')+id+'.json');
          if(fs.existsSync(filename)){
            privateFile(filename);const receipt=JSON.parse(fs.readFileSync(filename,'utf8')) as Receipt;
            if(receipt.commandId!==id||receipt.epoch!==epoch||receipt.hash!==hash)throw Error('Conflicting local receipt.');
            if(receipt.state==='running'){receipt.state=isAgent?'failed':'unknown';writeCompanionReceipt(filename,receipt);}
            const {hash:_hash,...body}=receipt;await request(deviceBase+(isAgent?'/result':'/interactive-result'),body,credential);
          }else{
            writeCompanionReceipt(filename,{commandId:id,epoch,hash,state:'running'});
            const controller=new AbortController(),signal=AbortSignal.any([controller.signal,options.signal]);
            const promise=(async()=>{
              let receipt:Receipt={commandId:id,epoch,hash,state:'completed'};
              try{
                if(command.state==='cancel_requested'||isAgent&&command.state==='interrupted'){await stopHuman();receipt.state='cancelled';}
                else if(isAgent){
                  await stopHuman();const executor=new InteractiveBlenderExecutor();try{await executor.start(probe,validateBlenderScene(agent!.scene),signal);await executor.waitClosed();receipt.result=collect(executor,id,hash);}finally{await executor.close();}
                }else if(ui!.action==='open'){await stopHuman();const executor=human=new InteractiveBlenderExecutor();await executor.start(probe,undefined,signal);}
                else if(ui!.action==='close')await stopHuman();
                else {if(!human)throw Error('Explicitly reopen the interrupted app.');if(ui!.action==='input'){const {kind,...fields}=ui!.input!;await human.call(kind,fields);}else{const executor=human;await executor.call('save');await executor.waitClosed();human=undefined;try{receipt.result=collect(executor,id,hash);}finally{await executor.close();}}}
              }catch{await stopHuman();receipt={commandId:id,epoch,hash,state:signal.aborted?'cancelled':isAgent?'failed':'unknown'};}
              writeCompanionReceipt(filename,receipt);
            })();
            active={id,epoch,controller,promise};void promise.then(()=>{if(active?.id===id)active=undefined;},error=>{receiptFailure=error;abort();});
          }
        }
        if(!active&&human&&packet.session.mode==='human'&&!packet.session.paused&&packet.session.interactive?.state==='open'&&Date.now()-lastFrame>=1000){await request(deviceBase+'/frame',{epoch:packet.session.epoch,png:(await human.frame()).toString('base64')},credential);lastFrame=Date.now();}
      }catch(error){options.onState?.('Companion disconnected or command uncertain; inspect without replay.');if([401,403].includes(Number((error as any)?.status))||Date.now()-lastSuccess>=10000)break;}
      await new Promise<void>(resolve=>{const timer=setTimeout(resolve,500);const wake=()=>{clearTimeout(timer);resolve();};options.signal.addEventListener('abort',wake,{once:true});setTimeout(()=>options.signal.removeEventListener('abort',wake),550).unref();});
    }
  }finally{
    clearInterval(monitor);options.signal.removeEventListener('abort',abort);active?.controller.abort();await stopHuman();await active?.promise;
    if(deviceBase)await request(deviceBase+'/stop',{},credential,true).catch(()=>undefined);
    await lock.release();await new Promise<void>(resolve=>listener.close(()=>resolve()));fs.unlinkSync(outside);
  }
}
