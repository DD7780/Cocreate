import { assertPromotionEvidence, verifyCandidate } from './verification.js';
import type { CandidateVerification, SharedRequirement } from '../src/types.js';
import { isolationPolicy, IsolationError } from './isolation.js';
import { createHash, randomUUID } from 'node:crypto';
import { applyOperations, bundleProject, persistProject, type FileOperation, type ProjectFile } from './project.js';
import { EventStore, type ActorType } from './event-store.js';

type ToolBehavior='read'|'write';
type ToolName='project.apply_operations'|'project.bundle'|'project.verify'|'project.promote';
type ToolInputs={
  'project.apply_operations':{current:ProjectFile[]|undefined;operations:FileOperation[]};
  'project.bundle':{files:ProjectFile[]};
  'project.verify':{files:ProjectFile[];compiled:{javascript:string;css:string};requirements:SharedRequirement[]};
  'project.promote':{files:ProjectFile[]};
};
type ToolOutputs={
  'project.apply_operations':{files:ProjectFile[]};
  'project.bundle':{javascript:string;css:string};
  'project.verify':CandidateVerification;
  'project.promote':{fileCount:number};
};
export type ToolContext={workspaceId:string;runId:string;actorId:string;actorType:ActorType;role:'builder'|'personal_agent'|'user'|'system';inputRevision:number;signal?:AbortSignal;verification?:{report:CandidateVerification;requirements:SharedRequirement[];compiled:{javascript:string;css:string}}};
export type ToolDefinition<K extends ToolName=ToolName>={
  name:K;purpose:string;behavior:ToolBehavior;permission:string;environment:'host-process-restricted-api'|'isolated-process';
  timeoutMs:number;resourceLimits:{maxFiles:number;maxInputBytes:number;memoryBytes?:number;cpuSeconds?:number;maxProcesses?:number};retry:'none'|'idempotent';idempotent:boolean;
  cancellation:'before-start-only'|'during-execution';logging:'metadata-and-hashes';inputSchema:string;outputSchema:string;
};

const stable=(value:unknown):string=>{
  if(Array.isArray(value))return`[${value.map(stable).join(',')}]`;
  if(value&&typeof value==='object')return`{${Object.entries(value as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>`${JSON.stringify(key)}:${stable(item)}`).join(',')}}`;
  return JSON.stringify(value);
};
const digest=(value:unknown)=>createHash('sha256').update(stable(value)).digest('hex');
const inputSummary=(name:ToolName,input:ToolInputs[ToolName])=>name==='project.apply_operations'
  ?{operationCount:(input as ToolInputs['project.apply_operations']).operations.length,paths:(input as ToolInputs['project.apply_operations']).operations.map(operation=>operation.path)}
  :{fileCount:(input as ToolInputs['project.bundle']).files.length,paths:(input as ToolInputs['project.bundle']).files.map(file=>file.path)};
const outputSummary=(name:ToolName,output:ToolOutputs[ToolName])=>name==='project.verify'
  ?{candidateHash:(output as CandidateVerification).candidateHash,status:(output as CandidateVerification).status,checkCount:(output as CandidateVerification).checks.length}
  :name==='project.bundle'
  ?{javascriptBytes:Buffer.byteLength((output as ToolOutputs['project.bundle']).javascript),cssBytes:Buffer.byteLength((output as ToolOutputs['project.bundle']).css)}
  :{fileCount:name==='project.apply_operations'?(output as ToolOutputs['project.apply_operations']).files.length:(output as ToolOutputs['project.promote']).fileCount};

const definitions:{[K in ToolName]:ToolDefinition<K>}={
  'project.apply_operations':{name:'project.apply_operations',purpose:'Validate and apply model-proposed edits to an in-memory candidate.',behavior:'write',permission:'builder:candidate:write',environment:'host-process-restricted-api',timeoutMs:2_000,resourceLimits:{maxFiles:16,maxInputBytes:160_000},retry:'idempotent',idempotent:true,cancellation:'before-start-only',logging:'metadata-and-hashes',inputSchema:'ProjectFile[] + FileOperation[]',outputSchema:'validated ProjectFile[]'},
  'project.bundle':{name:'project.bundle',purpose:'Compile a validated candidate in a secret-free OS-isolated process.',behavior:'read',permission:'builder:candidate:build',environment:'isolated-process',timeoutMs:isolationPolicy.wallMs,resourceLimits:{maxFiles:16,maxInputBytes:160_000,memoryBytes:process.platform==='win32'?isolationPolicy.windowsMemoryBytes:isolationPolicy.linuxAddressSpaceBytes,cpuSeconds:isolationPolicy.cpuSeconds,maxProcesses:process.platform==='win32'?1:isolationPolicy.linuxTasksPerUser},retry:'idempotent',idempotent:true,cancellation:'during-execution',logging:'metadata-and-hashes',inputSchema:'validated ProjectFile[]',outputSchema:'browser JavaScript and CSS'},
  'project.verify':{name:'project.verify',purpose:'Observe trusted acceptance and retained covered behaviors in an OS-contained browser.',behavior:'read',permission:'builder:candidate:verify',environment:'isolated-process',timeoutMs:isolationPolicy.wallMs,resourceLimits:{maxFiles:16,maxInputBytes:isolationPolicy.outputBytes,memoryBytes:process.platform==='win32'?isolationPolicy.windowsMemoryBytes:isolationPolicy.linuxAddressSpaceBytes,cpuSeconds:isolationPolicy.cpuSeconds,maxProcesses:process.platform==='win32'?1:isolationPolicy.linuxTasksPerUser},retry:'none',idempotent:true,cancellation:'during-execution',logging:'metadata-and-hashes',inputSchema:'validated files + compiled bytes + frozen accepted requirements',outputSchema:'candidate-bound requirement/check evidence'},
  'project.promote':{name:'project.promote',purpose:'Persist an already verified candidate inside the current workspace project.',behavior:'write',permission:'builder:workspace:promote',environment:'host-process-restricted-api',timeoutMs:5_000,resourceLimits:{maxFiles:16,maxInputBytes:160_000},retry:'idempotent',idempotent:true,cancellation:'before-start-only',logging:'metadata-and-hashes',inputSchema:'validated ProjectFile[]',outputSchema:'persisted file count'},
};

export class ToolRegistry{
  constructor(private store:EventStore){}
  list(){return Object.values(definitions)}
  private authorize(name:string,context:ToolContext){
    if(!(name in definitions))return{allowed:false,reason:'Unknown tools are denied by default.'};
    if(context.role!=='builder'||context.actorType!=='builder')return{allowed:false,reason:'Only the shared builder may use generated-project tools.'};
    return{allowed:true,reason:'Allowed for the shared builder within its current workspace candidate.'};
  }
  async execute<K extends ToolName>(name:K,input:ToolInputs[K],context:ToolContext):Promise<ToolOutputs[K]>{
    const definition=definitions[name],stepId=randomUUID(),inputHash=digest(input),summary=definition?inputSummary(name,input as ToolInputs[ToolName]):{unrecognizedInput:true};
    this.store.append({eventType:'tool.requested',workspaceId:context.workspaceId,actorId:context.actorId,actorType:context.actorType,runId:context.runId,stepId,correlationId:context.runId,inputRevision:context.inputRevision,contentHash:inputHash,payload:{tool:name,permission:definition?.permission,input:summary}});
    const decision=this.authorize(name,context);
    this.store.append({eventType:decision.allowed?'tool.authorized':'tool.denied',workspaceId:context.workspaceId,actorId:'policy',actorType:'system',runId:context.runId,stepId,correlationId:context.runId,inputRevision:context.inputRevision,contentHash:inputHash,payload:{tool:name,reason:decision.reason}});
    if(!decision.allowed)throw new Error(`Tool denied: ${decision.reason}`);
    this.store.append({eventType:'tool.started',workspaceId:context.workspaceId,actorId:context.actorId,actorType:context.actorType,runId:context.runId,stepId,correlationId:context.runId,inputRevision:context.inputRevision,contentHash:inputHash,payload:{tool:name,timeoutMs:definition!.timeoutMs,environment:definition!.environment,isolationPolicy:(name==='project.bundle'||name==='project.verify')?isolationPolicy.version:undefined}});
    try{
      if(context.signal?.aborted)throw new IsolationError('isolation_cancelled','Candidate operation cancelled before execution.');
      let output:ToolOutputs[ToolName];
      if(name==='project.apply_operations'){const typed=input as ToolInputs['project.apply_operations'];output={files:applyOperations(typed.current,typed.operations)}}
      else if(name==='project.bundle'){const typed=input as ToolInputs['project.bundle'];output=await bundleProject(typed.files,context.signal)}
      else if(name==='project.verify'){const typed=input as ToolInputs['project.verify'];output=await verifyCandidate(typed.files,typed.compiled,typed.requirements,context.inputRevision,context.signal)}
      else{const typed=input as ToolInputs['project.promote'];if(!context.verification)throw new Error('Promotion requires coordinator-owned verification evidence.');assertPromotionEvidence(context.verification.report,typed.files,context.verification.compiled,context.verification.requirements,context.inputRevision);persistProject(context.workspaceId,typed.files);output={fileCount:typed.files.length}}
      this.store.append({eventType:'tool.succeeded',workspaceId:context.workspaceId,actorId:context.actorId,actorType:context.actorType,runId:context.runId,stepId,correlationId:context.runId,inputRevision:context.inputRevision,contentHash:inputHash,payload:{tool:name,output:outputSummary(name,output)}});
      return output as ToolOutputs[K];
    }catch(error){
      const message=error instanceof Error?error.message:String(error);
      const diagnostic=error instanceof IsolationError?error.cause as {exitCode?:number;diagnostic?:string}|undefined:undefined;
      this.store.append({eventType:'tool.failed',workspaceId:context.workspaceId,actorId:context.actorId,actorType:context.actorType,runId:context.runId,stepId,correlationId:context.runId,inputRevision:context.inputRevision,contentHash:inputHash,payload:{tool:name,error:message.slice(0,1000),isolation:error instanceof IsolationError?{code:error.code,exitCode:diagnostic?.exitCode,nativeExitCode:Number(diagnostic?.diagnostic?.match(/ISOLATION_EXIT (\d+)/)?.[1])||undefined,peakProcessBytes:Number(diagnostic?.diagnostic?.match(/ISOLATION_PEAK_BYTES (\d+)/)?.[1])||undefined}:undefined}});
      throw error;
    }
  }
}
