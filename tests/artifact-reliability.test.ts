import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyIntentText,normalizeInterpretation,reconcileRequirements} from '../server/requirements.js';
import type {Requirement} from '../shared/types.js';
import * as Y from 'yjs';
import {insertedSpans,deletedSpans,captureAuthoredPassages} from '../server/authored-passages.js';
import {applySteeringUpdate} from '../server/steering-edits.js';
import {validateSubmittedInterpretation} from '../server/intent-authority.js';
import {deletionSignature} from '../shared/document-state.js';
import type {EditRecord} from '../server/room-state.js';
import {supabasePlatformFromEnv} from '../server/supabase-platform.js';
import {createTwoGuysOneCanvasServer} from '../server/index.js';
import {IsolationError,safeIsolationDiagnostics} from '../server/isolation.js';
import {candidateHash} from '../server/verification.js';
import {createProgressFixture,waitFor} from './fixtures/build-progress.js';

const contribution=(actor:string,text:string):Requirement=>normalizeInterpretation({participantId:actor,participantName:actor,features:[text],classification:'explicit_request',sourcePassages:[text]});

test('hosted startup rejects missing, short and development signing/encryption secrets without reading real configuration',async()=>{
  const base={TWOGUYS1CANVAS_HOSTED:'true',SUPABASE_URL:'https://fixture.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_synthetic',SUPABASE_SECRET_KEY:'sb_secret_synthetic'};
  const valid={SESSION_SECRET:'synthetic-signing-secret-for-hosted-fixtures-2026',CREDENTIAL_ENCRYPTION_SECRET:'synthetic-encryption-secret-for-hosted-fixtures-2026'};
  for(const secrets of [{},{...valid,SESSION_SECRET:'cocreate-local-session-secret'},{...valid,SESSION_SECRET:'short'},{...valid,CREDENTIAL_ENCRYPTION_SECRET:''}]){
    const state=supabasePlatformFromEnv({...base,...secrets});assert.equal(state.platform,null);assert.match(state.error||'',/SECRET/);
  }
  assert.equal(supabasePlatformFromEnv({...base,...valid}).error,null);
  await assert.rejects(createTwoGuysOneCanvasServer({platform:{} as any,sessionSecret:'short',encryptionSecret:'short',serveClient:false}),/Hosted startup refused/);
  assert.equal(supabasePlatformFromEnv({TWOGUYS1CANVAS_AUTH_MODE:'local'}).mode,'local');
});

test('tentative imperatives and withheld decisions cannot authorize a build',()=>{
  for(const text of ['Add online ordering, maybe; we have not decided.','Add online ordering; we have not decided.','Use blue, perhaps.']){
    assert.equal(classifyIntentText(text,'explicit_request'),'proposal',text);
    assert.equal(reconcileRequirements([],contribution('alice',text)).requirements[0].status,'proposed');
  }
  assert.equal(classifyIntentText('Create a restaurant website; ask me for the menu later.','ambiguity'),'explicit_request');
  assert.equal(classifyIntentText('Do not add customer login.','proposal'),'explicit_request');
  assert.equal(classifyIntentText('Should we add customer login?','explicit_request'),'question');
  assert.equal(classifyIntentText('Make the header blue or green.','explicit_request'),'ambiguity');
  assert.equal(classifyIntentText('Add ordering; we have not yet decided.','explicit_request'),'proposal');
});

test('foreground and background values bind to their own property',()=>{
  const first=reconcileRequirements([],contribution('alice','Use black text on a white background.'));
  const compatible=reconcileRequirements(first.requirements,contribution('bob','Use a white background.'),first.conflictGroups);
  assert.equal(compatible.conflictGroups.filter(group=>group.state!=='obsolete').length,0);
  const opposed=reconcileRequirements(compatible.requirements,contribution('carol','Use a blue background.'),compatible.conflictGroups);
  assert.equal(opposed.conflictGroups.filter(group=>group.state!=='obsolete').length,1);
});

test('short model quotes cannot strip the same-sentence withheld decision',()=>{
  const source='Add online ordering, maybe; we have not decided.',request=contribution('alice','Add online ordering');
  const result=validateSubmittedInterpretation(request,[],[],undefined,[{id:'frozen',text:source,sources:[{client:1,clock:0,length:source.length,sourceId:'fixture-source',seq:1,offset:0,eligible:true}]}]);
  assert.equal(result.intents![0].classification,'proposal');
  assert.equal(reconcileRequirements([],result).requirements[0].status,'proposed');
  assert.equal(result.intents![0].sourcePassage,source);
});

test('compiler diagnostics never alter artifact identity or disclose arbitrary error data',()=>{
  const compiled={javascript:'safe bundle',css:'safe style'},files=[{path:'src/main.tsx',content:'safe fixture'}];
  assert.equal(candidateHash(files,compiled),candidateHash(files,{...compiled,diagnostics:{elapsedMs:1}} as typeof compiled));
  assert.equal(JSON.stringify(safeIsolationDiagnostics({phase:'bundle',diagnostic:'private source or secret',elapsedMs:10,phasesMs:{bundle:4,privateText:'secret'}})).includes('secret'),false);
});

test('an explicit infrastructure retry reuses the persisted candidate without another model call',async()=>{
  const f=await createProgressFixture();
  try{
    const tools=(f.manager as any).tools,execute=tools.execute.bind(tools);let failed=false;
    tools.execute=async(name:string,input:unknown,context:unknown)=>{if(name==='project.bundle'&&!failed){failed=true;const error=new IsolationError('isolation_timeout','Controlled compiler infrastructure timeout');error.cause={phase:'wasm_initialize',elapsedMs:20000};throw error;}return execute(name,input,context);};
    await f.submit('alice','Create a restaurant website.','retained-compile');
    await waitFor(()=>f.room.status==='Error'&&!f.room.buildTask,'compiler failure',90_000);
    assert.equal(f.builders.length,1);assert.equal(f.room.versions.length,0);
    assert.match(f.room.lastError||'',/compiler failed/);assert.doesNotMatch(f.room.lastError||'',/reconnect.*builder/i);
    assert.ok(f.room.recoveryCheckpoint?.compileRetry);
    await f.reopen();assert.equal(f.builders.length,1);assert.equal(f.room.buildTask,undefined,'recovery never starts work');
    // Exercise the existing accepted-candidate worker; public retry authority is covered by managed-ai tests.
    (f.manager as any).requestBuild(f.room,true);
    await waitFor(()=>(f.room.versions.length===1||f.room.status==='Error')&&!f.room.buildTask,'retained candidate promotion',90_000);
    assert.equal(f.room.versions.length,1,JSON.stringify({status:f.room.status,error:f.room.lastError,failedTools:f.manager.eventStore.eventsForWorkspace(f.room.id).filter(event=>event.eventType==='tool.failed').map(event=>event.payload)}));
    assert.equal(f.builders.length,1);assert.equal(f.personal.length,1);
    assert.ok(f.manager.eventStore.eventsForWorkspace(f.room.id).some(event=>event.eventType==='build.infrastructure_retry'));
  }finally{await f.close();}
});

test('corrected final authored passage validates at its cutoff without coauthor or later text',()=>{
  const doc=new Y.Doc({gc:false}),client=new Y.Doc({gc:false}),batch:EditRecord[]=[];
  const paragraph=new Y.XmlElement('paragraph'),text=new Y.XmlText();
  const edit=(action:()=>void,actor='alice')=>{const before=Y.encodeStateVector(client),beforeDeletes=deletionSignature(doc);client.transact(action);const update=Y.encodeStateAsUpdate(client,before),spans=insertedSpans(update,Y.encodeStateVector(doc)),after=applySteeringUpdate(doc,update,actor);batch.push({seq:batch.length+1,participantId:actor,at:'fixture',update:Buffer.from(update).toString('base64'),kind:'modify',before:'',after,authoredSpans:spans,deletedSpans:deletedSpans(update,beforeDeletes)});};
  try{
    edit(()=>{client.getXmlFragment('default').push([paragraph]);paragraph.push([text]);text.insert(0,'Create a red header.');});
    edit(()=>{text.delete(9,3);text.insert(9,'blue');});
    const selected=[...batch],cutoff={vector:Buffer.from(Y.encodeStateVector(doc)).toString('base64'),deletions:deletionSignature(doc)};
    edit(()=>text.insert(text.length,' Later private draft.'));
    const passages=captureAuthoredPassages(doc,selected,cutoff)!;
    assert.deepEqual(passages.map(item=>item.text),['Create a blue header.']);
    const incremental=captureAuthoredPassages(doc,[selected[1]],cutoff,selected)!;
    assert.deepEqual(incremental.map(item=>item.text),['Create a blue header.'],'unchanged author context survives an incremental correction');
    assert.ok(incremental[0].sources.some(source=>!source.eligible));assert.ok(incremental[0].sources.some(source=>source.eligible));
    const request=contribution('alice','Create a blue header.');
    assert.equal(validateSubmittedInterpretation(request,selected,[]).intents![0].validation?.status,'needs_clarification','old insertion concatenation reproduces the audit failure');
    const verified=validateSubmittedInterpretation(request,selected,[],undefined,passages);
    assert.equal(verified.intents![0].validation?.status,'verified');assert.equal(verified.intents![0].sourceReferences?.[0].passageId,passages[0].id);
    edit(()=>text.insert(0,'Bob private phrase. '),'bob');
    const current={vector:Buffer.from(Y.encodeStateVector(doc)).toString('base64'),deletions:deletionSignature(doc)};
    const own=captureAuthoredPassages(doc,batch.filter(edit=>edit.participantId==='alice'),current)!;
    assert.ok(own.every(item=>!item.text.includes('Bob private')));
    edit(()=>text.delete(0,text.length));
    const deleted=captureAuthoredPassages(doc,batch.filter(edit=>edit.participantId==='alice'),{vector:Buffer.from(Y.encodeStateVector(doc)).toString('base64'),deletions:deletionSignature(doc)})!;
    assert.deepEqual(deleted,[]);
  }finally{client.destroy();doc.destroy();}
});
