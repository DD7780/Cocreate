import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import * as Y from 'yjs';
import { EventStore } from '../server/event-store.js';
import { RoomManager } from '../server/rooms.js';
import { ToolRegistry } from '../server/tool-registry.js';
import { reconcileRequirements } from '../server/requirements.js';
import type { Requirement } from '../src/types.js';

const temporaryData=()=>fs.mkdtempSync(path.join(os.tmpdir(),'cocreate-events-'));

test('event store orders events, redacts secrets, stores artifacts, and enforces run transitions',()=>{
  const dataDir=temporaryData(),store=new EventStore(dataDir),workspaceId='workspace-a';
  try{
    store.saveWorkspaceSnapshot(workspaceId,{title:'A'},'workspace.created');
    store.append({eventType:'connection.checked',workspaceId,actorId:'owner',actorType:'user',payload:{apiKey:'top-secret',nested:{authorization:'Bearer hidden'},message:'request used Bearer abcdefghijklmnop',result:'reachable'}});
    const update=Uint8Array.from([1,2,3,4]),documentEvent=store.recordDocumentUpdate(workspaceId,'participant-a',1,update,{kind:'insert'});
    assert.deepEqual(store.readArtifact(documentEvent.artifactRef!),Buffer.from(update));

    const runId=randomUUID();
    store.transitionRun({workspaceId,runId,kind:'builder',state:'queued',inputRevision:1});
    store.transitionRun({workspaceId,runId,kind:'builder',state:'executing',inputRevision:1,attempt:1});
    store.transitionRun({workspaceId,runId,kind:'builder',state:'verifying',inputRevision:1,attempt:1});
    store.transitionRun({workspaceId,runId,kind:'builder',state:'ready',inputRevision:1});
    assert.throws(()=>store.transitionRun({workspaceId,runId,kind:'builder',state:'executing',inputRevision:1}),/Illegal run transition/);

    const events=store.eventsForWorkspace(workspaceId);
    assert.deepEqual(events.map((event:any)=>event.workspaceSeq),events.map((_:unknown,index:number)=>index+1));
    assert.equal(events.find((event:any)=>event.eventType==='connection.checked').payload.apiKey,'[REDACTED]');
    assert.doesNotMatch(JSON.stringify(events),/top-secret|Bearer hidden|abcdefghijklmnop/);
    assert.equal(store.runsForWorkspace(workspaceId)[0].state,'ready');
    assert.equal(store.runsForWorkspace(workspaceId)[0].attempt,1,'terminal events retain the latest recorded attempt when omitted');
  }finally{store.close();fs.rmSync(dataDir,{recursive:true,force:true})}
});

test('tool policy denies personal agents and unknown tools before execution',async()=>{
  const dataDir=temporaryData(),store=new EventStore(dataDir),tools=new ToolRegistry(store),workspaceId='workspace-policy',runId=randomUUID();
  try{
    const base={workspaceId,runId,actorId:'personal-a',actorType:'personal_agent' as const,role:'personal_agent' as const,inputRevision:1};
    await assert.rejects(tools.execute('project.promote',{files:[]},base),/Only the shared builder/);
    await assert.rejects((tools as any).execute('host.shell',{command:'whoami'},{...base,actorId:'builder',actorType:'builder',role:'builder'}),/Unknown tools are denied/);
    const events=store.eventsForWorkspace(workspaceId);
    assert.equal(events.filter((event:any)=>event.eventType==='tool.requested').length,2);
    assert.equal(events.filter((event:any)=>event.eventType==='tool.denied').length,2);
    assert.equal(events.filter((event:any)=>event.eventType==='tool.started').length,0);
  }finally{store.close();fs.rmSync(dataDir,{recursive:true,force:true})}
});

test('append-only snapshot artifacts reconstruct a missing derived workspace view',()=>{
  const dataDir=temporaryData(),workspaceId='workspace-rebuild',file=path.join(dataDir,'cocreate.sqlite');
  const first=new EventStore(dataDir);
  first.saveWorkspaceSnapshot(workspaceId,{document:'durable',requirements:['addition'],latestVersion:3},'workspace.created');
  first.close();
  const database=new DatabaseSync(file);database.prepare('DELETE FROM workspace_state WHERE workspace_id=?').run(workspaceId);database.close();
  const recovered=new EventStore(dataDir);
  try{assert.deepEqual(recovered.readWorkspaceSnapshot(workspaceId),{document:'durable',requirements:['addition'],latestVersion:3})}
  finally{recovered.close();fs.rmSync(dataDir,{recursive:true,force:true})}
});

test('room restart reconstructs the last product and interrupts an in-flight run',()=>{
  const dataDir=temporaryData(),workspaceId='workspace-restart',runId=randomUUID();
  const first=new RoomManager({debounceMs:500,encryptionSecret:'test-secret',dataDir});
  try{
    const room=first.create(workspaceId);
    first.join(room,'alice','Alice');
    const paragraph=new Y.XmlElement('paragraph'),text=new Y.XmlText();
    room.doc.transact(()=>{room.doc.getXmlFragment('default').push([paragraph]);paragraph.push([text]);text.insert(0,'Build a durable calculator.')} ,'test');
    room.requirements=[{id:'requirement-alice',participantId:'alice',participantName:'Alice',createdAt:new Date().toISOString(),revision:1,goals:['Create a calculator'],features:['Addition'],design:[],constraints:[],questions:[],additions:['Addition'],modifications:[],withdrawals:[],classification:'explicit_request',affectedRequirementIds:[],sourceRevision:1,sourceEditSeqs:[1],sourcePassages:['Create a calculator']}];
    room.versions=[{id:1,createdAt:new Date().toISOString(),summary:'Calculator',fileCount:1,conflicts:[],files:[{path:'src/App.tsx',content:'export default function App(){return <main>Calculator</main>}' }],bundle:'document.body.textContent="Calculator"',css:'',decisions:[],specification:{agreed:['Calculator'],proposed:[],questions:[]}}];
    room.status='Updated';
    first.save(room,'product.promoted','builder','builder');
    first.eventStore.transitionWorkflow({workspaceId,phase:'queued'});
    first.eventStore.createTask({workspaceId,taskId:runId,runId,title:'Build calculator',requirementRevision:1,assignedWorker:'shared-executor',acceptanceCriteria:['Calculator remains runnable.']});
    first.eventStore.transitionTask({workspaceId,taskId:runId,state:'queued'});
    first.eventStore.transitionTask({workspaceId,taskId:runId,state:'running'});
    first.eventStore.transitionWorkflow({workspaceId,phase:'running'});
    first.eventStore.transitionRun({workspaceId,runId,kind:'builder',state:'queued',inputRevision:1});
    first.eventStore.transitionRun({workspaceId,runId,kind:'builder',state:'executing',inputRevision:1,attempt:1});
  }finally{first.shutdown()}

  const second=new RoomManager({debounceMs:500,encryptionSecret:'test-secret',dataDir});
  try{
    const recovered=second.get(workspaceId)!;
    assert.match(recovered.doc.getXmlFragment('default').toJSON(),/durable calculator/);
    assert.equal(recovered.requirements[0].participantId,'alice');
    assert.equal(recovered.versions.at(-1)?.summary,'Calculator');
    assert.equal(second.eventStore.runsForWorkspace(workspaceId).find(run=>run.runId===runId)?.state,'interrupted');
    assert.equal(second.eventStore.tasksForWorkspace(workspaceId).find(task=>task.id===runId)?.state,'interrupted');
    assert.equal(second.eventStore.workflowForWorkspace(workspaceId)?.phase,'awaiting_input');
    assert.equal(second.eventStore.pendingApprovals(workspaceId).length,0);
    assert.ok(second.eventStore.eventsForWorkspace(workspaceId).some(event=>event.eventType==='run.interrupted'));
  }finally{second.shutdown();fs.rmSync(dataDir,{recursive:true,force:true})}
});

test('legacy workspace migration makes a backup before importing state',()=>{
  const dataDir=temporaryData(),workspaceId='legacy-workspace',legacyFile=path.join(dataDir,`${workspaceId}.json`);
  fs.writeFileSync(legacyFile,JSON.stringify({participants:[],requirements:[],versions:[],ai:{mode:'disconnected'},editHistory:[],requestedRevision:0,persistRevision:2,savedAt:new Date().toISOString()}));
  const manager=new RoomManager({debounceMs:500,encryptionSecret:'test-secret',dataDir});
  try{
    assert.ok(manager.get(workspaceId));
    assert.ok(fs.existsSync(path.join(dataDir,'backups','pre-event-store',`${workspaceId}.json`)));
    assert.equal(manager.eventStore.eventsForWorkspace(workspaceId)[0].eventType,'workspace.legacy_imported');
  }finally{manager.shutdown();fs.rmSync(dataDir,{recursive:true,force:true})}
});

test('durable workflow projection records task transitions and supports cursor recovery',()=>{
  const dataDir=temporaryData(),store=new EventStore(dataDir),workspaceId='workflow-a',taskId=randomUUID();
  try{
    const initial=store.ensureWorkflow(workspaceId);
    assert.equal(initial.phase,'draft');
    store.assignInitialController(workspaceId,'alice');
    store.transitionWorkflow({workspaceId,phase:'queued',expectedRevision:0,actorId:'alice',actorType:'user'});
    store.createTask({workspaceId,taskId,runId:taskId,title:'Build specification r3',requirementRevision:3,assignedWorker:'shared-executor',acceptanceCriteria:['The calculator adds two numbers.']});
    store.transitionTask({workspaceId,taskId,state:'queued'});
    store.transitionTask({workspaceId,taskId,state:'running'});
    store.transitionWorkflow({workspaceId,phase:'running'});
    const cursorBeforeVerification=store.latestSequence(workspaceId);
    store.transitionTask({workspaceId,taskId,state:'verifying'});
    store.transitionTask({workspaceId,taskId,state:'completed',evidenceStatus:'unverified',artifactVersion:2});
    store.transitionWorkflow({workspaceId,phase:'completed'});

    const workflow=store.workflowForWorkspace(workspaceId)!;
    const task=store.tasksForWorkspace(workspaceId)[0];
    assert.equal(workflow.controllerId,'alice');
    assert.equal(workflow.phase,'completed');
    assert.equal(task.artifactVersion,2);
    assert.equal(task.evidenceStatus,'unverified','compilation alone must not become verified evidence');
    const missed=store.activityForWorkspace(workspaceId,cursorBeforeVerification,10);
    assert.ok(missed.length>=3);
    assert.ok(missed.every(event=>event.sequence>cursorBeforeVerification));
    assert.deepEqual(missed.map(event=>event.sequence),[...new Set(missed.map(event=>event.sequence))]);
    assert.throws(()=>store.transitionTask({workspaceId,taskId,state:'running'}),/Illegal task transition/);
    assert.throws(()=>store.transitionWorkflow({workspaceId,phase:'running',expectedRevision:0}),/Stale workflow revision/);
  }finally{store.close();fs.rmSync(dataDir,{recursive:true,force:true})}
});

test('restart preserves a pending multi-option conflict group and resolver membership',()=>{
  const dataDir=temporaryData(),workspaceId='workspace-conflict-restart',make=(participantId:string,participantName:string,feature:string):Requirement=>({id:randomUUID(),participantId,participantName,goals:[],features:[feature],design:[],constraints:[],questions:[],additions:[feature],modifications:[],withdrawals:[],classification:'explicit_request',affectedRequirementIds:[],sourceRevision:1,sourceEditSeqs:[1],sourcePassages:[feature],revision:1,createdAt:new Date().toISOString()}),alice=make('alice','Alice','Make the header red'),bob=make('bob','Bob','Make the header green');
  const first=new RoomManager({debounceMs:500,encryptionSecret:'test-secret',dataDir});
  try{const room=first.create(workspaceId);first.join(room,'alice','Alice');first.join(room,'bob','Bob');const one=reconcileRequirements([],alice),two=reconcileRequirements(one.requirements,bob,one.conflictGroups);room.requirements=[alice,bob];room.sharedRequirements=two.requirements;room.conflictGroups=two.conflictGroups;room.contradictions=two.contradictions;room.specificationRevision=2;first.save(room,'requirement.registry_reconciled','bob','personal_agent')}finally{first.shutdown()}
  const second=new RoomManager({debounceMs:500,encryptionSecret:'test-secret',dataDir});
  try{const recovered=second.get(workspaceId)!;assert.equal(recovered.conflictGroups.length,1);assert.equal(recovered.conflictGroups[0].state,'awaiting_choices');assert.deepEqual(recovered.conflictGroups[0].requiredResolverIds,['alice','bob']);assert.equal(second.view(recovered).status,'Decision needed')}finally{second.shutdown();fs.rmSync(dataDir,{recursive:true,force:true})}
});
