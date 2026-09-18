import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

export type ActorType='user'|'personal_agent'|'builder'|'system'|'tool';
export type RunState='queued'|'interpreting'|'planning'|'awaiting_approval'|'executing'|'verifying'|'repairing'|'ready'|'failed'|'cancelled'|'interrupted';
export type EventInput={
  eventType:string;workspaceId:string;actorId:string;actorType:ActorType;
  runId?:string;stepId?:string;correlationId?:string;causationId?:string;
  inputRevision?:number;contentHash?:string;artifactRef?:string;payload?:unknown;
};
export type StoredEvent=EventInput&{eventId:string;workspaceSeq:number;occurredAt:string;schemaVersion:number};
export type StoredRun={runId:string;workspaceId:string;kind:string;state:RunState;inputRevision:number;attempt:number;triggerEventId?:string;lastEventId:string;createdAt:string;updatedAt:string;error?:string};

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
    this.db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
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
    `);
    this.db.prepare('INSERT OR IGNORE INTO schema_migrations(version,applied_at) VALUES(1,?)').run(new Date().toISOString());
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
