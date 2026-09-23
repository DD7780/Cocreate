import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import type { WorkflowActivity, WorkflowPhase, WorkflowTask, WorkflowTaskState } from '../src/types.js';

export type ActorType='user'|'personal_agent'|'builder'|'system'|'tool';
export type RunState='queued'|'interpreting'|'planning'|'awaiting_approval'|'executing'|'verifying'|'repairing'|'ready'|'failed'|'cancelled'|'interrupted';
export type EventInput={
  eventType:string;workspaceId:string;actorId:string;actorType:ActorType;
  runId?:string;stepId?:string;correlationId?:string;causationId?:string;
  inputRevision?:number;contentHash?:string;artifactRef?:string;payload?:unknown;
};
export type StoredEvent=EventInput&{eventId:string;workspaceSeq:number;occurredAt:string;schemaVersion:number};
export type StoredRun={runId:string;workspaceId:string;kind:string;state:RunState;inputRevision:number;attempt:number;triggerEventId?:string;lastEventId:string;createdAt:string;updatedAt:string;error?:string};
export type StoredWorkflow={workflowId:string;workspaceId:string;phase:WorkflowPhase;revision:number;controllerId?:string;controlEpoch:number;lastEventId?:string;createdAt:string;updatedAt:string};

const sensitiveKey=/(api[-_]?key|authorization|credential|password|secret|token|cookie)/i;
const transitions:Record<RunState,Set<RunState>>={
  queued:new Set(['interpreting','planning','executing','cancelled','interrupted','failed']),
  interpreting:new Set(['planning','failed','cancelled','interrupted']),
  planning:new Set(['awaiting_approval','executing','failed','cancelled','interrupted']),
  awaiting_approval:new Set(['executing','failed','cancelled','interrupted']),
  executing:new Set(['verifying','repairing','ready','failed','cancelled','interrupted']),
  verifying:new Set(['repairing','ready','failed','cancelled','interrupted']),
  repairing:new Set(['executing','verifying','failed','cancelled','interrupted']),
  ready:new Set(),failed:new Set(),cancelled:new Set(),interrupted:new Set(),
};
const workflowTransitions:Record<WorkflowPhase,Set<WorkflowPhase>>={
  draft:new Set(['queued','running','awaiting_input','failed','cancel_requested','cancelled']),
  queued:new Set(['running','awaiting_input','awaiting_approval','pause_requested','failed','cancel_requested','cancelled']),
  running:new Set(['queued','awaiting_input','awaiting_approval','pause_requested','completed','failed','cancel_requested','cancelled']),
  awaiting_input:new Set(['queued','running','pause_requested','failed','cancel_requested','cancelled']),
  awaiting_approval:new Set(['queued','running','pause_requested','failed','cancel_requested','cancelled']),
  pause_requested:new Set(['paused','running','failed','cancel_requested','cancelled']),
  paused:new Set(['queued','running','cancel_requested','cancelled']),
  completed:new Set(['queued','running','awaiting_input','cancel_requested']),
  failed:new Set(['queued','running','awaiting_input','cancel_requested']),
  cancel_requested:new Set(['cancelled','failed']),
  cancelled:new Set(['queued']),
};
const taskTransitions:Record<WorkflowTaskState,Set<WorkflowTaskState>>={
  planned:new Set(['queued','blocked','cancelled','stale']),
  queued:new Set(['running','blocked','failed','cancelled','stale','interrupted']),
  running:new Set(['verifying','blocked','failed','cancelled','stale','interrupted']),
  blocked:new Set(['queued','running','cancelled','stale']),
  verifying:new Set(['completed','failed','cancelled','stale','interrupted']),
  completed:new Set(['stale']),failed:new Set(),cancelled:new Set(),stale:new Set(),interrupted:new Set(['queued','cancelled','stale']),
};

const hash=(value:string|Uint8Array)=>createHash('sha256').update(value).digest('hex');
const redact=(value:unknown):unknown=>{
  if(Array.isArray(value))return value.map(redact);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value as Record<string,unknown>).map(([key,item])=>[key,sensitiveKey.test(key)?'[REDACTED]':redact(item)]));
  if(typeof value==='string')return value.replace(/\bBearer\s+[A-Za-z0-9._~+/=-]{8,}/gi,'Bearer [REDACTED]').replace(/\b(?:sk|api)[-_][A-Za-z0-9_-]{8,}\b/gi,'[REDACTED]').replace(/([?&](?:api_key|key|token)=)[^&\s]+/gi,'$1[REDACTED]');
  return value;
};
const json=(value:unknown)=>JSON.stringify(redact(value??{}));

export class EventStore{
  readonly file:string;
  private db:DatabaseSync;
  constructor(readonly dataDir=path.join(process.cwd(),'data')){
    fs.mkdirSync(dataDir,{recursive:true});
    this.file=path.join(dataDir,'cocreate.sqlite');
    this.db=new DatabaseSync(this.file);
    this.db.exec('PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;');
    this.migrate();
  }
  private migrate(){
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS schema_migrations(version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS workspace_sequences(workspace_id TEXT PRIMARY KEY, next_seq INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS events(
        event_id TEXT PRIMARY KEY,event_type TEXT NOT NULL,workspace_id TEXT NOT NULL,
        actor_id TEXT NOT NULL,actor_type TEXT NOT NULL,run_id TEXT,step_id TEXT,
        occurred_at TEXT NOT NULL,workspace_seq INTEGER NOT NULL,correlation_id TEXT,causation_id TEXT,
        schema_version INTEGER NOT NULL,payload_json TEXT NOT NULL,artifact_ref TEXT,input_revision INTEGER,
        content_hash TEXT NOT NULL,UNIQUE(workspace_id,workspace_seq)
      );
      CREATE INDEX IF NOT EXISTS events_workspace_type ON events(workspace_id,event_type,workspace_seq);
      CREATE INDEX IF NOT EXISTS events_run ON events(run_id,workspace_seq);
      CREATE TABLE IF NOT EXISTS artifacts(
        content_hash TEXT PRIMARY KEY,mime_type TEXT NOT NULL,byte_length INTEGER NOT NULL,
        content BLOB NOT NULL,created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS workspace_state(
        workspace_id TEXT PRIMARY KEY,state_json TEXT NOT NULL,state_hash TEXT NOT NULL,
        source_event_id TEXT NOT NULL,updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS run_state(
        run_id TEXT PRIMARY KEY,workspace_id TEXT NOT NULL,kind TEXT NOT NULL,state TEXT NOT NULL,
        input_revision INTEGER NOT NULL,attempt INTEGER NOT NULL DEFAULT 0,trigger_event_id TEXT,
        last_event_id TEXT NOT NULL,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,error TEXT
      );
      CREATE INDEX IF NOT EXISTS run_state_workspace ON run_state(workspace_id,updated_at);
      CREATE TABLE IF NOT EXISTS approval_state(
        approval_id TEXT PRIMARY KEY,workspace_id TEXT NOT NULL,status TEXT NOT NULL,
        action_json TEXT NOT NULL,input_hash TEXT NOT NULL,requested_by TEXT NOT NULL,
        authorized_role TEXT NOT NULL,source_event_id TEXT NOT NULL,updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS workflow_state(
        workflow_id TEXT PRIMARY KEY,workspace_id TEXT NOT NULL UNIQUE,phase TEXT NOT NULL,
        revision INTEGER NOT NULL,controller_id TEXT,control_epoch INTEGER NOT NULL DEFAULT 0,
        last_event_id TEXT,created_at TEXT NOT NULL,updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS task_state(
        task_id TEXT PRIMARY KEY,workflow_id TEXT NOT NULL,workspace_id TEXT NOT NULL,kind TEXT NOT NULL,
        title TEXT NOT NULL,state TEXT NOT NULL,requirement_revision INTEGER NOT NULL,run_id TEXT,
        depends_on_json TEXT NOT NULL,assigned_worker TEXT,acceptance_json TEXT NOT NULL,
        evidence_status TEXT NOT NULL,artifact_version INTEGER,blocker TEXT,last_event_id TEXT NOT NULL,
        created_at TEXT NOT NULL,updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS task_state_workspace ON task_state(workspace_id,updated_at);
    `);
    this.db.prepare('INSERT OR IGNORE INTO schema_migrations(version,applied_at) VALUES(1,?)').run(new Date().toISOString());
    this.db.prepare('INSERT OR IGNORE INTO schema_migrations(version,applied_at) VALUES(2,?)').run(new Date().toISOString());
  }
  private nextSequence(workspaceId:string){
    const row=this.db.prepare('SELECT next_seq AS nextSeq FROM workspace_sequences WHERE workspace_id=?').get(workspaceId) as {nextSeq:number}|undefined;
    if(!row){this.db.prepare('INSERT INTO workspace_sequences(workspace_id,next_seq) VALUES(?,2)').run(workspaceId);return 1}
    this.db.prepare('UPDATE workspace_sequences SET next_seq=? WHERE workspace_id=?').run(row.nextSeq+1,workspaceId);return row.nextSeq;
  }
  private insert(input:EventInput):StoredEvent{
    const eventId=randomUUID(),occurredAt=new Date().toISOString(),workspaceSeq=this.nextSequence(input.workspaceId),payloadJson=json(input.payload),contentHash=input.contentHash||hash(payloadJson),schemaVersion=1;
    this.db.prepare(`INSERT INTO events(event_id,event_type,workspace_id,actor_id,actor_type,run_id,step_id,occurred_at,workspace_seq,correlation_id,causation_id,schema_version,payload_json,artifact_ref,input_revision,content_hash) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(eventId,input.eventType,input.workspaceId,input.actorId,input.actorType,input.runId??null,input.stepId??null,occurredAt,workspaceSeq,input.correlationId??null,input.causationId??null,schemaVersion,payloadJson,input.artifactRef??null,input.inputRevision??null,contentHash);
    return{...input,eventId,occurredAt,workspaceSeq,schemaVersion,contentHash,payload:JSON.parse(payloadJson)};
  }
  append(input:EventInput){this.db.exec('BEGIN IMMEDIATE');try{const event=this.insert(input);this.db.exec('COMMIT');return event}catch(error){this.db.exec('ROLLBACK');throw error}}
  private insertArtifact(content:string|Uint8Array,mimeType='application/octet-stream'){
    const bytes=typeof content==='string'?Buffer.from(content):Buffer.from(content),contentHash=hash(bytes);
    this.db.prepare('INSERT OR IGNORE INTO artifacts(content_hash,mime_type,byte_length,content,created_at) VALUES(?,?,?,?,?)').run(contentHash,mimeType,bytes.byteLength,bytes,new Date().toISOString());
    return{ref:`sha256:${contentHash}`,contentHash,byteLength:bytes.byteLength};
  }
  writeArtifact(content:string|Uint8Array,mimeType='application/octet-stream'){return this.insertArtifact(content,mimeType)}
  readArtifact(ref:string){const contentHash=ref.replace(/^sha256:/,'');const row=this.db.prepare('SELECT content FROM artifacts WHERE content_hash=?').get(contentHash) as {content:Uint8Array}|undefined;return row?Buffer.from(row.content):null}
  hasWorkspace(workspaceId:string){return!!this.db.prepare("SELECT 1 AS present FROM workspace_state WHERE workspace_id=? UNION SELECT 1 AS present FROM events WHERE workspace_id=? AND artifact_ref IS NOT NULL LIMIT 1").get(workspaceId,workspaceId)}
  saveWorkspaceSnapshot(workspaceId:string,state:unknown,eventType='workspace.snapshot_recorded',actorId='system',actorType:ActorType='system'){
    const stateJson=JSON.stringify(state),stateHash=hash(stateJson),updatedAt=new Date().toISOString();
    this.db.exec('BEGIN IMMEDIATE');try{
      const artifact=this.insertArtifact(stateJson,'application/vnd.cocreate.workspace+json');
      const event=this.insert({eventType,workspaceId,actorId,actorType,contentHash:stateHash,artifactRef:artifact.ref,payload:{stateHash,byteLength:artifact.byteLength}});
      this.db.prepare(`INSERT INTO workspace_state(workspace_id,state_json,state_hash,source_event_id,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(workspace_id) DO UPDATE SET state_json=excluded.state_json,state_hash=excluded.state_hash,source_event_id=excluded.source_event_id,updated_at=excluded.updated_at`).run(workspaceId,stateJson,stateHash,event.eventId,updatedAt);
      this.db.exec('COMMIT');return event;
    }catch(error){this.db.exec('ROLLBACK');throw error}
  }
  readWorkspaceSnapshot<T=unknown>(workspaceId:string){const row=this.db.prepare('SELECT state_json AS stateJson FROM workspace_state WHERE workspace_id=?').get(workspaceId) as {stateJson:string}|undefined;if(row)return JSON.parse(row.stateJson) as T;const artifact=this.db.prepare(`SELECT a.content FROM events e JOIN artifacts a ON a.content_hash=substr(e.artifact_ref,8) WHERE e.workspace_id=? AND e.artifact_ref LIKE 'sha256:%' AND a.mime_type='application/vnd.cocreate.workspace+json' ORDER BY e.workspace_seq DESC LIMIT 1`).get(workspaceId) as {content:Uint8Array}|undefined;return artifact?JSON.parse(Buffer.from(artifact.content).toString('utf8')) as T:null}
  importLegacyWorkspace(workspaceId:string,legacyFile:string){
    if(this.hasWorkspace(workspaceId))return false;
    const raw=fs.readFileSync(legacyFile,'utf8'),backupDir=path.join(this.dataDir,'backups','pre-event-store'),backup=path.join(backupDir,path.basename(legacyFile));
    fs.mkdirSync(backupDir,{recursive:true});if(!fs.existsSync(backup))fs.copyFileSync(legacyFile,backup);
    this.saveWorkspaceSnapshot(workspaceId,JSON.parse(raw),'workspace.legacy_imported','migration','system');return true;
  }
  recordDocumentUpdate(workspaceId:string,actorId:string,inputRevision:number,update:Uint8Array,payload:Record<string,unknown>){
    this.db.exec('BEGIN IMMEDIATE');try{const artifact=this.insertArtifact(update,'application/vnd.yjs-update'),event=this.insert({eventType:'document.update_recorded',workspaceId,actorId,actorType:'user',inputRevision,artifactRef:artifact.ref,contentHash:artifact.contentHash,payload:{...payload,byteLength:artifact.byteLength}});this.db.exec('COMMIT');return event}catch(error){this.db.exec('ROLLBACK');throw error}
  }
  transitionRun(input:{workspaceId:string;runId:string;kind:string;state:RunState;inputRevision:number;attempt?:number;actorId?:string;actorType?:ActorType;triggerEventId?:string;error?:string;payload?:unknown}){
    const current=this.db.prepare('SELECT state,created_at AS createdAt,attempt FROM run_state WHERE run_id=?').get(input.runId) as {state:RunState;createdAt:string;attempt:number}|undefined;
    if(current&&!transitions[current.state].has(input.state))throw new Error(`Illegal run transition: ${current.state} -> ${input.state}`);
    if(!current&&input.state!=='queued')throw new Error(`Run ${input.runId} must begin in queued state.`);
    const updatedAt=new Date().toISOString(),createdAt=current?.createdAt||updatedAt,attempt=input.attempt??current?.attempt??0;
    this.db.exec('BEGIN IMMEDIATE');try{
      const event=this.insert({eventType:`run.${input.state}`,workspaceId:input.workspaceId,actorId:input.actorId||'builder',actorType:input.actorType||'builder',runId:input.runId,correlationId:input.runId,inputRevision:input.inputRevision,payload:{kind:input.kind,attempt,error:input.error,...(input.payload&&typeof input.payload==='object'?input.payload as object:{})}});
      this.db.prepare(`INSERT INTO run_state(run_id,workspace_id,kind,state,input_revision,attempt,trigger_event_id,last_event_id,created_at,updated_at,error) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(run_id) DO UPDATE SET state=excluded.state,input_revision=excluded.input_revision,attempt=excluded.attempt,last_event_id=excluded.last_event_id,updated_at=excluded.updated_at,error=excluded.error`).run(input.runId,input.workspaceId,input.kind,input.state,input.inputRevision,attempt,input.triggerEventId??null,event.eventId,createdAt,updatedAt,input.error??null);
      this.db.exec('COMMIT');return event;
    }catch(error){this.db.exec('ROLLBACK');throw error}
  }
  ensureWorkflow(workspaceId:string){
    const current=this.workflowForWorkspace(workspaceId);if(current)return current;
    const workflowId=`workflow:${workspaceId}`,createdAt=new Date().toISOString();
    this.db.prepare('INSERT INTO workflow_state(workflow_id,workspace_id,phase,revision,controller_id,control_epoch,last_event_id,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)').run(workflowId,workspaceId,'draft',0,null,0,null,createdAt,createdAt);
    return this.workflowForWorkspace(workspaceId)!;
  }
  assignInitialController(workspaceId:string,participantId:string){
    const workflow=this.ensureWorkflow(workspaceId);if(workflow.controllerId)return workflow;
    const updatedAt=new Date().toISOString();this.db.exec('BEGIN IMMEDIATE');try{
      const event=this.insert({eventType:'workflow.controller_assigned',workspaceId,actorId:participantId,actorType:'user',inputRevision:workflow.revision,payload:{workflowId:workflow.workflowId,controllerId:participantId,controlEpoch:1}});
      this.db.prepare('UPDATE workflow_state SET controller_id=?,control_epoch=1,last_event_id=?,updated_at=? WHERE workspace_id=? AND controller_id IS NULL').run(participantId,event.eventId,updatedAt,workspaceId);
      this.db.exec('COMMIT');return this.workflowForWorkspace(workspaceId)!;
    }catch(error){this.db.exec('ROLLBACK');throw error}
  }
  transitionWorkflow(input:{workspaceId:string;phase:WorkflowPhase;actorId?:string;actorType?:ActorType;expectedRevision?:number;payload?:unknown}){
    const current=this.ensureWorkflow(input.workspaceId);if(current.phase===input.phase)return current;
    if(input.expectedRevision!==undefined&&current.revision!==input.expectedRevision)throw new Error(`Stale workflow revision: expected ${input.expectedRevision}, current ${current.revision}.`);
    if(!workflowTransitions[current.phase].has(input.phase))throw new Error(`Illegal workflow transition: ${current.phase} -> ${input.phase}`);
    const revision=current.revision+1,updatedAt=new Date().toISOString();this.db.exec('BEGIN IMMEDIATE');try{
      const event=this.insert({eventType:`workflow.${input.phase}`,workspaceId:input.workspaceId,actorId:input.actorId||'coordinator',actorType:input.actorType||'system',inputRevision:revision,payload:{workflowId:current.workflowId,from:current.phase,to:input.phase,revision,...(input.payload&&typeof input.payload==='object'?input.payload as object:{})}});
      this.db.prepare('UPDATE workflow_state SET phase=?,revision=?,last_event_id=?,updated_at=? WHERE workspace_id=?').run(input.phase,revision,event.eventId,updatedAt,input.workspaceId);
      this.db.exec('COMMIT');return this.workflowForWorkspace(input.workspaceId)!;
    }catch(error){this.db.exec('ROLLBACK');throw error}
  }
  createTask(input:{workspaceId:string;taskId:string;title:string;kind?:'developer_build';requirementRevision:number;runId?:string;dependsOn?:string[];assignedWorker?:string;acceptanceCriteria:string[]}){
    const existing=this.task(input.taskId);if(existing)return existing;const workflow=this.ensureWorkflow(input.workspaceId),createdAt=new Date().toISOString();this.db.exec('BEGIN IMMEDIATE');try{
      const event=this.insert({eventType:'task.planned',workspaceId:input.workspaceId,actorId:'coordinator',actorType:'system',runId:input.runId,stepId:input.taskId,inputRevision:input.requirementRevision,payload:{taskId:input.taskId,title:input.title,kind:input.kind||'developer_build',dependsOn:input.dependsOn||[],acceptanceCriteria:input.acceptanceCriteria}});
      this.db.prepare(`INSERT INTO task_state(task_id,workflow_id,workspace_id,kind,title,state,requirement_revision,run_id,depends_on_json,assigned_worker,acceptance_json,evidence_status,artifact_version,blocker,last_event_id,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(input.taskId,workflow.workflowId,input.workspaceId,input.kind||'developer_build',input.title,'planned',input.requirementRevision,input.runId??null,JSON.stringify(input.dependsOn||[]),input.assignedWorker??null,JSON.stringify(input.acceptanceCriteria),'pending',null,null,event.eventId,createdAt,createdAt);
      this.db.exec('COMMIT');return this.task(input.taskId)!;
    }catch(error){this.db.exec('ROLLBACK');throw error}
  }
  transitionTask(input:{workspaceId:string;taskId:string;state:WorkflowTaskState;actorId?:string;actorType?:ActorType;evidenceStatus?:WorkflowTask['evidenceStatus'];artifactVersion?:number;blocker?:string;payload?:unknown}){
    const current=this.task(input.taskId);if(!current)throw new Error(`Task ${input.taskId} does not exist.`);if(current.state===input.state&&input.evidenceStatus===undefined&&input.artifactVersion===undefined&&input.blocker===undefined)return current;
    if(current.state!==input.state&&!taskTransitions[current.state].has(input.state))throw new Error(`Illegal task transition: ${current.state} -> ${input.state}`);
    const updatedAt=new Date().toISOString(),evidenceStatus=input.evidenceStatus??current.evidenceStatus,artifactVersion=input.artifactVersion??current.artifactVersion,blocker=input.blocker??current.blocker;this.db.exec('BEGIN IMMEDIATE');try{
      const event=this.insert({eventType:`task.${input.state}`,workspaceId:input.workspaceId,actorId:input.actorId||'coordinator',actorType:input.actorType||'system',runId:current.runId,stepId:input.taskId,inputRevision:current.requirementRevision,payload:{taskId:input.taskId,from:current.state,to:input.state,evidenceStatus,artifactVersion,blocker,...(input.payload&&typeof input.payload==='object'?input.payload as object:{})}});
      this.db.prepare('UPDATE task_state SET state=?,evidence_status=?,artifact_version=?,blocker=?,last_event_id=?,updated_at=? WHERE task_id=?').run(input.state,evidenceStatus,artifactVersion??null,blocker??null,event.eventId,updatedAt,input.taskId);
      this.db.exec('COMMIT');return this.task(input.taskId)!;
    }catch(error){this.db.exec('ROLLBACK');throw error}
  }
  private mapTask(row:any):WorkflowTask{return{id:row.id,workflowId:row.workflowId,kind:row.kind,title:row.title,state:row.state,requirementRevision:row.requirementRevision,runId:row.runId||undefined,dependsOn:JSON.parse(row.dependsOnJson),assignedWorker:row.assignedWorker||undefined,acceptanceCriteria:JSON.parse(row.acceptanceJson),evidenceStatus:row.evidenceStatus,artifactVersion:row.artifactVersion??undefined,blocker:row.blocker||undefined,createdAt:row.createdAt,updatedAt:row.updatedAt}}
  task(taskId:string){const row=this.db.prepare('SELECT task_id AS id,workflow_id AS workflowId,kind,title,state,requirement_revision AS requirementRevision,run_id AS runId,depends_on_json AS dependsOnJson,assigned_worker AS assignedWorker,acceptance_json AS acceptanceJson,evidence_status AS evidenceStatus,artifact_version AS artifactVersion,blocker,created_at AS createdAt,updated_at AS updatedAt FROM task_state WHERE task_id=?').get(taskId);return row?this.mapTask(row):null}
  tasksForWorkspace(workspaceId:string){return(this.db.prepare('SELECT task_id AS id,workflow_id AS workflowId,kind,title,state,requirement_revision AS requirementRevision,run_id AS runId,depends_on_json AS dependsOnJson,assigned_worker AS assignedWorker,acceptance_json AS acceptanceJson,evidence_status AS evidenceStatus,artifact_version AS artifactVersion,blocker,created_at AS createdAt,updated_at AS updatedAt FROM task_state WHERE workspace_id=? ORDER BY created_at').all(workspaceId) as any[]).map(row=>this.mapTask(row))}
  workflowForWorkspace(workspaceId:string){return this.db.prepare('SELECT workflow_id AS workflowId,workspace_id AS workspaceId,phase,revision,controller_id AS controllerId,control_epoch AS controlEpoch,last_event_id AS lastEventId,created_at AS createdAt,updated_at AS updatedAt FROM workflow_state WHERE workspace_id=?').get(workspaceId) as StoredWorkflow|undefined}
  activityForWorkspace(workspaceId:string,after=0,limit=30):WorkflowActivity[]{const bounded=Math.max(1,Math.min(100,Math.trunc(limit)||30)),rows=this.db.prepare('SELECT event_type AS type,actor_id AS actorId,actor_type AS actorType,run_id AS runId,step_id AS taskId,occurred_at AS occurredAt,workspace_seq AS sequence,payload_json AS payloadJson FROM events WHERE workspace_id=? AND workspace_seq>? ORDER BY workspace_seq LIMIT ?').all(workspaceId,Math.max(0,Math.trunc(after)||0),bounded) as any[];return rows.map(row=>{const payload=JSON.parse(row.payloadJson);return{sequence:row.sequence,type:row.type,actorId:row.actorId,actorType:row.actorType,occurredAt:row.occurredAt,runId:row.runId||undefined,taskId:row.taskId||undefined,summary:this.activitySummary(row.type,payload)}})}
  latestSequence(workspaceId:string){return Number((this.db.prepare('SELECT MAX(workspace_seq) AS sequence FROM events WHERE workspace_id=?').get(workspaceId) as {sequence?:number}|undefined)?.sequence||0)}
  private activitySummary(type:string,payload:any){if(type==='task.planned')return`Planned ${payload.title||'workflow task'}.`;if(type.startsWith('task.'))return`Task ${String(type).slice(5).replaceAll('_',' ')}.`;if(type.startsWith('workflow.'))return`Workflow ${String(type).slice(9).replaceAll('_',' ')}.`;if(type.startsWith('tool.'))return`${payload.tool||'Tool'} ${String(type).slice(5).replaceAll('_',' ')}.`;if(type.startsWith('run.'))return`Executor ${String(type).slice(4).replaceAll('_',' ')}.`;if(type.startsWith('participant.'))return`Participant ${String(type).slice(12).replaceAll('_',' ')}.`;if(type==='submission.submitted')return'Steering submission received.';if(type==='requirement.registry_reconciled')return'Accepted requirements reconciled.';if(type==='product.promoted')return'Verified candidate promoted.';return String(type).replaceAll('.',' · ').replaceAll('_',' ')}
  recoverWorkflow(workspaceId:string){const active=this.tasksForWorkspace(workspaceId).filter(task=>['queued','running','verifying'].includes(task.state));for(const task of active)this.transitionTask({workspaceId,taskId:task.id,state:'interrupted',actorId:'recovery',actorType:'system',evidenceStatus:'unverified',blocker:'Server restarted before the task outcome was durably recorded.'});const workflow=this.ensureWorkflow(workspaceId);if(active.length&&['queued','running','awaiting_approval','pause_requested'].includes(workflow.phase))this.transitionWorkflow({workspaceId,phase:'awaiting_input',actorId:'recovery',actorType:'system',payload:{reason:'Interrupted tasks require review before retry.'}});return active.length}
  interruptActiveRuns(workspaceId:string){
    const rows=this.db.prepare(`SELECT run_id AS runId,kind,input_revision AS inputRevision,attempt FROM run_state WHERE workspace_id=? AND state IN ('queued','interpreting','planning','awaiting_approval','executing','verifying','repairing')`).all(workspaceId) as Array<{runId:string;kind:string;inputRevision:number;attempt:number}>;
    for(const run of rows)this.transitionRun({workspaceId,runId:run.runId,kind:run.kind,state:'interrupted',inputRevision:run.inputRevision,attempt:run.attempt,actorId:'recovery',actorType:'system',error:'Server restarted before the run outcome was durably recorded.'});
    return rows.length;
  }
  runsForWorkspace(workspaceId:string){return this.db.prepare('SELECT run_id AS runId,workspace_id AS workspaceId,kind,state,input_revision AS inputRevision,attempt,trigger_event_id AS triggerEventId,last_event_id AS lastEventId,created_at AS createdAt,updated_at AS updatedAt,error FROM run_state WHERE workspace_id=? ORDER BY created_at').all(workspaceId) as unknown as StoredRun[]}
  pendingApprovals(workspaceId:string){return this.db.prepare("SELECT * FROM approval_state WHERE workspace_id=? AND status='pending' ORDER BY updated_at").all(workspaceId)}
  eventsForWorkspace(workspaceId:string){return this.db.prepare('SELECT event_id AS eventId,event_type AS eventType,workspace_id AS workspaceId,actor_id AS actorId,actor_type AS actorType,run_id AS runId,step_id AS stepId,occurred_at AS occurredAt,workspace_seq AS workspaceSeq,correlation_id AS correlationId,causation_id AS causationId,schema_version AS schemaVersion,payload_json AS payloadJson,artifact_ref AS artifactRef,input_revision AS inputRevision,content_hash AS contentHash FROM events WHERE workspace_id=? ORDER BY workspace_seq').all(workspaceId).map((row:any)=>({...row,payload:JSON.parse(row.payloadJson)}))}
  close(){this.db.close()}
}
