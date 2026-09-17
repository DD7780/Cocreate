import { createHash, randomUUID } from 'node:crypto';
import { applyOperations, bundleProject, persistProject, type FileOperation, type ProjectFile } from './project.js';
import { EventStore, type ActorType } from './event-store.js';

type ToolBehavior='read'|'write';
type ToolName='project.apply_operations'|'project.bundle'|'project.promote';
type ToolInputs={
  'project.apply_operations':{current:ProjectFile[]|undefined;operations:FileOperation[]};
  'project.bundle':{files:ProjectFile[]};
  'project.promote':{files:ProjectFile[]};
};
type ToolOutputs={
  'project.apply_operations':{files:ProjectFile[]};
  'project.bundle':{javascript:string;css:string};
  'project.promote':{fileCount:number};
};
export type ToolContext={workspaceId:string;runId:string;actorId:string;actorType:ActorType;role:'builder'|'personal_agent'|'user'|'system';inputRevision:number};
export type ToolDefinition<K extends ToolName=ToolName>={
  name:K;purpose:string;behavior:ToolBehavior;permission:string;environment:'host-process-restricted-api';
  timeoutMs:number;resourceLimits:{maxFiles:number;maxInputBytes:number};retry:'none'|'idempotent';idempotent:boolean;
  cancellation:'before-start-only';logging:'metadata-and-hashes';inputSchema:string;outputSchema:string;
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
const outputSummary=(name:ToolName,output:ToolOutputs[ToolName])=>name==='project.bundle'
  ?{javascriptBytes:Buffer.byteLength((output as ToolOutputs['project.bundle']).javascript),cssBytes:Buffer.byteLength((output as ToolOutputs['project.bundle']).css)}
  :{fileCount:name==='project.apply_operations'?(output as ToolOutputs['project.apply_operations']).files.length:(output as ToolOutputs['project.promote']).fileCount};

const definitions:{[K in ToolName]:ToolDefinition<K>}={
  'project.apply_operations':{name:'project.apply_operations',purpose:'Validate and apply model-proposed edits to an in-memory candidate.',behavior:'write',permission:'builder:candidate:write',environment:'host-process-restricted-api',timeoutMs:2_000,resourceLimits:{maxFiles:16,maxInputBytes:160_000},retry:'idempotent',idempotent:true,cancellation:'before-start-only',logging:'metadata-and-hashes',inputSchema:'ProjectFile[] + FileOperation[]',outputSchema:'validated ProjectFile[]'},
  'project.bundle':{name:'project.bundle',purpose:'Compile a validated candidate using the fixed browser bundle operation.',behavior:'read',permission:'builder:candidate:build',environment:'host-process-restricted-api',timeoutMs:20_000,resourceLimits:{maxFiles:16,maxInputBytes:160_000},retry:'idempotent',idempotent:true,cancellation:'before-start-only',logging:'metadata-and-hashes',inputSchema:'validated ProjectFile[]',outputSchema:'browser JavaScript and CSS'},
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
    this.store.append({eventType:'tool.started',workspaceId:context.workspaceId,actorId:context.actorId,actorType:context.actorType,runId:context.runId,stepId,correlationId:context.runId,inputRevision:context.inputRevision,contentHash:inputHash,payload:{tool:name,timeoutMs:definition!.timeoutMs}});
    try{
      let output:ToolOutputs[ToolName];
      if(name==='project.apply_operations'){const typed=input as ToolInputs['project.apply_operations'];output={files:applyOperations(typed.current,typed.operations)}}
      else if(name==='project.bundle'){const typed=input as ToolInputs['project.bundle'];output=await bundleProject(typed.files)}
      else{const typed=input as ToolInputs['project.promote'];persistProject(context.workspaceId,typed.files);output={fileCount:typed.files.length}}
      this.store.append({eventType:'tool.succeeded',workspaceId:context.workspaceId,actorId:context.actorId,actorType:context.actorType,runId:context.runId,stepId,correlationId:context.runId,inputRevision:context.inputRevision,contentHash:inputHash,payload:{tool:name,output:outputSummary(name,output)}});
      return output as ToolOutputs[K];
    }catch(error){
      const message=error instanceof Error?error.message:String(error);
      this.store.append({eventType:'tool.failed',workspaceId:context.workspaceId,actorId:context.actorId,actorType:context.actorType,runId:context.runId,stepId,correlationId:context.runId,inputRevision:context.inputRevision,contentHash:inputHash,payload:{tool:name,error:message.slice(0,1000)}});
      throw error;
    }
  }
}
