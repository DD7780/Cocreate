import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash, randomUUID } from 'node:crypto';
import { spawn, type ChildProcess } from 'node:child_process';
import type { ProjectFile } from './project.js';

const require = createRequire(import.meta.url);
const sourceDirectory = fileURLToPath(new URL('./isolation/', import.meta.url));
const runtimeDirectory = path.resolve('.runtime/isolation');
const maxOutput = 4 * 1024 * 1024;
export const isolationPolicy = Object.freeze({ version: 'isolated-compile-v1', wallMs: 20_000,
  cpuSeconds: 10, windowsMemoryBytes: 512 * 1024 * 1024, linuxAddressSpaceBytes: 2 * 1024 ** 3,
  heapMiB: 128, windowsProcesses: 1, linuxTasksPerUser: 64, network: 'none', outputBytes: maxOutput });
export class IsolationError extends Error {
  constructor(readonly code: 'isolation_unavailable' | 'isolation_cancelled' | 'isolation_timeout' | 'isolation_resource_limit', message: string) { super(message); }
}
const unavailable = () => new IsolationError('isolation_unavailable', 'Generated execution isolation is unavailable. The previous artifact is retained. Ask the operator to prepare or repair the isolated runtime, then explicitly retry; no host execution fallback is allowed.');
const cancelled = () => new IsolationError('isolation_cancelled', 'Generated execution was cancelled and its isolated child was removed.');
const hostEnvironment = () => process.platform === 'win32' ? { SystemRoot: process.env.SystemRoot || 'C:\\Windows', windir:process.env.SystemRoot||'C:\\Windows', USERPROFILE:os.homedir(), LOCALAPPDATA:process.env.LOCALAPPDATA||path.join(os.homedir(),'AppData','Local'), APPDATA:process.env.APPDATA||path.join(os.homedir(),'AppData','Roaming'), TEMP: os.tmpdir(), TMP: os.tmpdir() } : { PATH: '/usr/bin:/bin', LANG: 'C.UTF-8' };
let preparing: Promise<string> | undefined;
function trustedProcess(executable: string, args: string[], cwd: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(executable, args, { cwd, env: hostEnvironment(), windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
    let error = ''; const timer = setTimeout(() => { child.kill(); reject(unavailable()); }, 15_000);
    child.stderr?.on('data', chunk => { error += chunk; if(error.length > 3000) child.kill(); });
    child.once('error', () => { clearTimeout(timer); reject(unavailable()); });
    child.once('close', code => { clearTimeout(timer); code === 0 ? resolve() : reject(new IsolationError('isolation_unavailable', `Trusted isolation helper preparation failed (${code}). ${error.slice(0,1000)}`)); });
  });
}
/** Prepare only trusted compiler/runtime files. Candidate input never enters this operation. */
export function prepareIsolation() {
  preparing ??= (async () => {
    if(!['win32','linux'].includes(process.platform))throw unavailable();
    const packageRoot=path.dirname(require.resolve('esbuild-wasm/package.json'));
    const browser=fs.readFileSync(path.join(packageRoot,'lib/browser.js'));
    const worker=fs.readFileSync(path.join(sourceDirectory,'compiler-worker.cjs'));
    const native=fs.readFileSync(path.join(sourceDirectory,'windows-runner.cs'));
    const key=createHash('sha256').update(browser).update(worker).update(native).update(process.version+process.arch+process.platform).digest('hex').slice(0,24);
    const target=path.join(runtimeDirectory,key),lock=target+'.lock';fs.mkdirSync(runtimeDirectory,{recursive:true});
    if(fs.existsSync(path.join(target,'ready')))return target;
    let owner=false;try{fs.mkdirSync(lock);owner=true}catch(error){if((error as NodeJS.ErrnoException).code!=='EEXIST')throw error}
    if(!owner){for(let attempt=0;attempt<150;attempt++){if(fs.existsSync(path.join(target,'ready')))return target;await new Promise(resolve=>setTimeout(resolve,100))}throw unavailable()}
    try{
      fs.mkdirSync(target,{recursive:true});fs.writeFileSync(path.join(target,'worker.cjs'),worker);fs.writeFileSync(path.join(target,'esbuild.cjs'),browser);
      fs.copyFileSync(path.join(packageRoot,'esbuild.wasm'),path.join(target,'esbuild.wasm'));
      if(process.platform==='win32'){
        const nodeRoot=path.join(runtimeDirectory,'node-'+process.version+'-'+process.arch);fs.mkdirSync(nodeRoot,{recursive:true});
        const node=path.join(nodeRoot,'node.exe');if(!fs.existsSync(node)){const temp=node+'.'+randomUUID();fs.copyFileSync(process.execPath,temp);try{fs.renameSync(temp,node)}catch{fs.unlinkSync(temp);if(!fs.existsSync(node))throw unavailable()}}
        if(!fs.existsSync(path.join(target,'node.exe')))fs.linkSync(node,path.join(target,'node.exe'));
        const compiler=path.join(process.env.SystemRoot||'C:\\Windows','Microsoft.NET','Framework64','v4.0.30319','csc.exe');
        if(!fs.existsSync(compiler))throw unavailable();
        await trustedProcess(compiler,['/nologo','/target:exe','/platform:x64','/out:'+path.join(target,'runner.exe'),path.join(sourceDirectory,'windows-runner.cs')],target);
      } else if(!fs.existsSync('/usr/bin/bwrap')||!fs.existsSync('/usr/bin/prlimit'))throw unavailable();
      fs.writeFileSync(path.join(target,'ready'),key);return target;
    }finally{fs.rmdirSync(lock)}
  })().catch(error => { preparing = undefined; throw error; });
  return preparing;
}
type Dependency = {id:string;content:string;imports:Record<string,string>};
let dependencyCache: {roots:Record<string,string>;dependencies:Dependency[]} | undefined;
function trustedDependencies(){
  if(dependencyCache)return dependencyCache;
  const approved=new Set(['react','react-dom','scheduler']),byPath=new Map<string,Dependency>();
  const load=(filename:string):string=>{
    const existing=byPath.get(filename);if(existing)return existing.id;
    const item:Dependency={id:'module'+byPath.size,content:fs.readFileSync(filename,'utf8'),imports:{}};byPath.set(filename,item);
    for(const match of item.content.matchAll(/\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g)){
      const specifier=match[1];if(!specifier.startsWith('.')&&!approved.has(specifier.split('/')[0]))throw unavailable();
      item.imports[specifier]=load(createRequire(filename).resolve(specifier));
    }
    return item.id;
  };
  const roots=Object.fromEntries(['react','react-dom/client','react/jsx-runtime'].map(specifier=>[specifier,load(require.resolve(specifier))]));
  dependencyCache={roots,dependencies:[...byPath.values()]};return dependencyCache;
}
export type IsolatedRequest = { operation:'compile';files:ProjectFile[] } |
  { operation:'probe';outside:string;port:number } | { operation:'ready'|'spin'|'allocate'|'flood' };
export type IsolationOptions = {signal?:AbortSignal;wallMs?:number; onStarted?:(pid:number)=>void;
  /** Operator-owned boundary test only; compile always retains Node permissions. */
  osProbe?:boolean };
function linuxCommand(runtime:string,workspace:string,osProbe:boolean){
  // Fresh user/PID/network/IPC/mount namespaces; only runtime and candidate input are visible.
  const args=['--as='+isolationPolicy.linuxAddressSpaceBytes,'--cpu='+isolationPolicy.cpuSeconds,'--nproc='+isolationPolicy.linuxTasksPerUser,'--fsize='+maxOutput,'--nofile=64','--','/usr/bin/bwrap','--json-status-fd','3','--unshare-all','--die-with-parent','--new-session','--clearenv','--ro-bind',runtime,'/runtime','--ro-bind',workspace,'/job','--ro-bind',process.execPath,'/node','--proc','/proc','--dev','/dev','--tmpfs','/tmp'];
  for(const directory of ['/lib','/lib64','/usr/lib'])if(fs.existsSync(directory))args.push('--ro-bind',directory,directory);
  args.push('--setenv','NODE_ENV','production','--setenv','UV_THREADPOOL_SIZE','1','--chdir','/job','/node');
  if(!osProbe)args.push('--permission','--allow-fs-read=/runtime','--allow-fs-read=/job');
  args.push('--max-old-space-size=128','--disable-wasm-trap-handler','/runtime/worker.cjs','/job/input.json','/runtime');
  return {executable:'/usr/bin/prlimit',args};
}
/** Internal trusted primitive. No HTTP/model output can choose operations, commands or runtime flags. */
export async function runIsolated(request:IsolatedRequest,options:IsolationOptions={}) : Promise<unknown> {
  if(process.env.COCREATE_ISOLATION_MODE&&process.env.COCREATE_ISOLATION_MODE!=='os')throw unavailable();
  if(options.signal?.aborted)throw cancelled();
  if(options.osProbe&&request.operation==='compile')throw unavailable();
  const runtime=await prepareIsolation();if(options.signal?.aborted)throw cancelled();
  const workspace=path.join(runtimeDirectory,'jobs',randomUUID());
  const profile='cocreate.isolation.'+path.basename(workspace).replaceAll('-','');
  const payload=request.operation==='compile'?{...request,...trustedDependencies()}:{...request,osOnly:options.osProbe===true};
  const serialized=JSON.stringify(payload);if(Buffer.byteLength(serialized)>maxOutput)throw new IsolationError('isolation_resource_limit','Compiler input exceeded its bound.');
  fs.mkdirSync(workspace,{recursive:true});
  const wallMs=Math.min(isolationPolicy.wallMs,Math.max(10,options.wallMs??isolationPolicy.wallMs));
  const command=process.platform==='win32'?{executable:path.join(runtime,'runner.exe'),args:[runtime,workspace,profile,String(process.pid),String(wallMs),options.osProbe?'os-probe':'restricted']}:linuxCommand(runtime,workspace,options.osProbe===true);
  let child:ChildProcess|undefined,aborted=false,limited=false,timedOut=false;
  try{
    fs.writeFileSync(path.join(workspace,'input.json'),serialized);
    return await new Promise((resolve,reject)=>{
      let stdout='',stderr='',statusBuffer='',statusBytes=0,sandboxExit:number|undefined,done=false,force:NodeJS.Timeout|undefined;
      const stop=(reason:'abort'|'timeout'|'limit')=>{
        aborted ||= reason==='abort';timedOut ||=reason==='timeout';limited ||=reason==='limit';
        if(process.platform==='win32'){try{fs.writeFileSync(path.join(workspace,'cancel'),'cancel')}catch{};force??=setTimeout(()=>child?.kill(),1000)}
        else if(child?.pid){try{process.kill(-child.pid,'SIGKILL')}catch{child.kill()}}
      };
      const abort=()=>stop('abort');
      child=spawn(command.executable,command.args,{cwd:workspace,env:hostEnvironment(),windowsHide:true,detached:process.platform!=='win32',stdio:process.platform==='linux'?['ignore','pipe','pipe','pipe']:['ignore','pipe','pipe']});
      const timer=setTimeout(()=>stop('timeout'),wallMs+500);
      options.signal?.addEventListener('abort',abort,{once:true});if(options.signal?.aborted)abort();
      const finish=(error?:Error,result?:unknown)=>{if(done)return;done=true;clearTimeout(timer);clearTimeout(force);options.signal?.removeEventListener('abort',abort);error?reject(error):resolve(result)};
      child.stdout!.on('data',chunk=>{if(limited)return;stdout+=chunk;if(Buffer.byteLength(stdout)>maxOutput)stop('limit')});
      child.stderr!.on('data',chunk=>{if(limited)return;stderr+=chunk;if(Buffer.byteLength(stderr)>16_000)stop('limit');const match=stderr.match(/ISOLATION_STARTED (\d+)/);if(match){options.onStarted?.(Number(match[1]));options.onStarted=undefined}});
      // Bubblewrap writes host-visible lifecycle IDs on this pipe and closes it in the sandbox child.
      if(process.platform==='linux'){
        const status=child.stdio[3] as NodeJS.ReadableStream;
        status.on('error',()=>stop('limit'));
        status.on('data',chunk=>{
          statusBytes+=Buffer.byteLength(chunk);if(statusBytes>16_000){stop('limit');return;}
          statusBuffer+=chunk;let end:number;
          while((end=statusBuffer.indexOf('\n'))>=0){
            const line=statusBuffer.slice(0,end);statusBuffer=statusBuffer.slice(end+1);
            try{const value=JSON.parse(line);const pid=value['child-pid'];if(Number.isSafeInteger(pid)&&pid>0){options.onStarted?.(pid);options.onStarted=undefined;}if(Number.isInteger(value['exit-code']))sandboxExit=value['exit-code'];}
            catch{stop('limit');}
          }
        });
      }
      child.once('error',()=>finish(unavailable()));
      child.once('close',code=>{
        if(aborted)return finish(cancelled());
        if(timedOut||code===124)return finish(new IsolationError('isolation_timeout','Generated execution exceeded its wall-time bound and was removed.'));
        const linuxResource=process.platform==='linux'&&((sandboxExit===137||sandboxExit===152)||(/out of memory|allocation failed/i.test(stderr)||(request.operation==='allocate'&&/allocation failed/i.test(stdout))));
        if(limited||code===125||linuxResource){const error=new IsolationError('isolation_resource_limit','Generated execution failed within its memory/process/CPU/output limits. The previous artifact is retained.');error.cause={exitCode:code,limit:limited?'output':'kernel',diagnostic:stderr.slice(0,2000)};return finish(error);}
        if(code!==0){const error=unavailable();error.cause={exitCode:code,diagnostic:stderr.slice(0,2000)};return finish(error);}
        try{const response=JSON.parse(stdout);if(!response||typeof response.ok!=='boolean')throw Error();if(!response.ok)return finish(new Error('Candidate compilation failed: '+String(response.error).slice(0,1000)));finish(undefined,response.result)}catch{return finish(unavailable())}
      });
    });
  }finally{
    // Resolve/reject only after the launcher has closed its kill-on-close Job Object/process group.
    if(process.platform==='win32')await trustedProcess(path.join(runtime,'runner.exe'),['cleanup',profile],runtime).catch(()=>{});
    const root=path.resolve(runtimeDirectory,'jobs');if(path.dirname(path.resolve(workspace))!==root)throw unavailable();
    fs.rmSync(workspace,{recursive:true,force:true,maxRetries:3,retryDelay:50});
  }
}
export async function compileIsolated(files:ProjectFile[],signal?:AbortSignal){
  const result=await runIsolated({operation:'compile',files},{signal}) as {javascript?:unknown;css?:unknown};
  if(typeof result?.javascript!=='string'||typeof result.css!=='string')throw unavailable();
  return {javascript:result.javascript,css:result.css};
}


let readiness:Promise<unknown>|undefined;
/** Inference-free preflight of the actual kernel boundary before generation dispatch. */
export async function assertIsolationAvailable(signal?:AbortSignal){
  if(process.env.COCREATE_ISOLATION_MODE&&process.env.COCREATE_ISOLATION_MODE!=='os')throw unavailable();
  if(signal?.aborted)throw cancelled();
  readiness??=runIsolated({operation:'ready'}).catch(error=>{readiness=undefined;throw error});
  await readiness;if(signal?.aborted)throw cancelled();
}
