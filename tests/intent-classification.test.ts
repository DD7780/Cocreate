import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { RoomManager } from '../server/rooms.js';
import { classifyIntentText, normalizeInterpretation, reconcileRequirements, supersedeInterpretationSources } from '../server/requirements.js';
import type { Requirement } from '../src/types.js';

const legacyInterpretation=(text:string,classification:Requirement['classification']):Requirement=>({
  id:'restaurant-interpretation',participantId:'alice',participantName:'Alice',goals:[],features:[text],design:[],constraints:[],questions:[],additions:[text],modifications:[],withdrawals:[],classification,affectedRequirementIds:[],sourceRevision:1,sourceEditSeqs:[1],sourcePassages:[text],revision:1,createdAt:'2026-09-18T00:00:00.000Z',
});

test('a clear restaurant website assignment is accepted even when a model labels the batch as proposal',()=>{
  const result=reconcileRequirements([],legacyInterpretation('Create a website for my restaurant','proposal'));
  assert.equal(result.requirements[0].status,'accepted');
});

test('classification semantics distinguish requests, proposals, questions, quotes, hypotheticals, and negation',()=>{
  const cases:[string,Requirement['classification'],Requirement['classification']][]=[
    ['Create a website for my restaurant.','proposal','explicit_request'],
    ['Can you create a booking form?','question','explicit_request'],
    ['I want customers to reserve a table.','proposal','explicit_request'],
    ['Create a website for my resturant.','ambiguity','explicit_request'],
    ['Create a restaurant website; ask me for the menu later.','ambiguity','explicit_request'],
    ['Maybe we could add online ordering.','explicit_request','proposal'],
    ['How much would a booking integration cost?','question','question'],
    ['Example: “Create a checkout page.”','explicit_request','proposal'],
    ['If we created a loyalty program, would customers use it?','explicit_request','proposal'],
    ['Do not add customer login.','proposal','explicit_request'],
  ];
  for(const [text,model,expected]of cases)assert.equal(classifyIntentText(text,model),expected,text);
});

test('mixed contribution keeps request, proposal, and question separate',()=>{
  const base=legacyInterpretation('Create a restaurant website.','ambiguity');
  base.intents=[
    {id:'request',text:'Create a restaurant website.',category:'feature',classification:'explicit_request',rationale:'Direct instruction.',sourcePassage:'Create a restaurant website.',affectedRequirementIds:[],participantId:'alice',participantName:'Alice',sourceRevision:1,sourceEditSeqs:[1]},
    {id:'proposal',text:'Maybe add delivery later.',category:'feature',classification:'proposal',rationale:'Optional future idea.',sourcePassage:'Maybe add delivery later.',affectedRequirementIds:[],participantId:'alice',participantName:'Alice',sourceRevision:1,sourceEditSeqs:[1]},
    {id:'question',text:'Should we require login?',category:'question',classification:'question',rationale:'Requests a decision.',sourcePassage:'Should we require login?',affectedRequirementIds:[],participantId:'alice',participantName:'Alice',sourceRevision:1,sourceEditSeqs:[1]},
  ];
  const result=reconcileRequirements([],base);
  assert.deepEqual(result.requirements.map(item=>[item.description,item.status]).sort(),[['Create a restaurant website.','accepted'],['Maybe add delivery later.','proposed']]);
});

test('missing classifications become ambiguity and reinterpretation supersedes only its own source without duplicates',()=>{
  const normalized=normalizeInterpretation({...legacyInterpretation('Unclear restaurant note','ambiguity'),classification:undefined});
  assert.equal(normalized.classification,'ambiguity');
  const first=reconcileRequirements([],legacyInterpretation('Create a website for my restaurant','proposal'));
  const stripped=supersedeInterpretationSources(first.requirements,'restaurant-interpretation'),reinterpreted={...legacyInterpretation('Create a website for my restaurant','explicit_request'),id:'restaurant-interpretation-v2'},second=reconcileRequirements(stripped,reinterpreted,first.conflictGroups);
  assert.equal(second.requirements.length,1);
  assert.equal(second.requirements[0].status,'accepted');
  assert.deepEqual(second.requirements[0].sources.map(source=>source.interpretationId),['restaurant-interpretation-v2']);
});

test('targeted reinterpretation reuses authenticated edits, preserves identity, avoids duplicate builds, and protects decisions',async()=>{
  let providerCalls=0;
  const provider=http.createServer(async(req,res)=>{
    let raw='';for await(const chunk of req)raw+=chunk;
    if(!req.url?.endsWith('/chat/completions')){res.writeHead(404);return res.end()}
    providerCalls++;
    const result={goals:[],features:['Create a website for my restaurant'],design:[],constraints:[],questions:[],additions:['Create a website for my restaurant'],modifications:[],withdrawals:[],classification:'explicit_request',affectedRequirementIds:[],sourcePassages:['Create a website for my restaurant'],intents:[{text:'Create a website for my restaurant',category:'feature',classification:'explicit_request',rationale:'Direct action request.',sourcePassage:'Create a website for my restaurant',affectedRequirementIds:[]}]};
    res.setHeader('content-type','application/json');res.end(JSON.stringify({choices:[{message:{content:JSON.stringify(result)},finish_reason:'stop'}]}));
  });
  await new Promise<void>(resolve=>provider.listen(0,'127.0.0.1',resolve));
  const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'cocreate-reinterpret-')),
    baseUrl=`http://127.0.0.1:${(provider.address()as any).port}`,
    manager=new RoomManager({debounceMs:10,buildDebounceMs:60_000,buildCooldownMs:0,buildMaxWaitMs:60_000,encryptionSecret:'reinterpret-test',baseUrl,dataDir}),
    room=manager.create('reinterpret-room');
  try{
    const participant=manager.join(room,'alice','Alice'),old=legacyInterpretation('Create a website for my restaurant','proposal'),initial=reconcileRequirements([],old);
    participant.latest=old;room.requirements=[old];room.sharedRequirements=initial.requirements;room.conflictGroups=initial.conflictGroups;room.contradictions=initial.contradictions;
    room.editHistory=[{seq:1,participantId:'alice',at:'2026-09-18T00:00:00.000Z',update:'authenticated-update',kind:'insert',before:'',after:'Create a website for my restaurant'}];room.agentRevisions.set('alice',1);
    const {id}=await manager.saveConnection(room,{name:'Test provider',provider:'custom',baseUrl,apiFormat:'chat-completions',apiKey:'test-key'});
    room.ai.personal={connectionId:id,model:'personal-test'};room.ai.builder={connectionId:id,model:'builder-test'};room.ai.mode='openai';

    await manager.reinterpretLatest(room,'alice');
    assert.equal(room.sharedRequirements.length,1);
    assert.equal(room.sharedRequirements[0].status,'accepted');
    assert.equal(participant.latest?.classifierVersion,'intent-v2');
    assert.equal(manager.eventStore.eventsForWorkspace(room.id).at(-1)?.eventType,'interpretation.reinterpreted');
    const stableId=room.sharedRequirements[0].id;

    clearTimeout(room.buildTimer);room.buildTimer=undefined;room.pendingBuildSince=undefined;
    await manager.reinterpretLatest(room,'alice');
    assert.equal(room.sharedRequirements.length,1);
    assert.equal(room.sharedRequirements[0].id,stableId);
    assert.equal(room.buildTimer,undefined);

    const callsBeforeDecision=providerCalls;
    participant.latest={...participant.latest!,classification:'ambiguity',intents:[...participant.latest!.intents!,{...participant.latest!.intents![0],id:'settled-decision',text:'Use the selected restaurant direction.',classification:'decision',rationale:'Settled direction.'}]};
    await assert.rejects(()=>manager.reinterpretLatest(room,'alice'),/human correction/);
    assert.equal(providerCalls,callsBeforeDecision);
  }finally{
    manager.shutdown();
    await new Promise<void>(resolve=>provider.close(()=>resolve()));
    fs.rmSync(dataDir,{recursive:true,force:true});
  }
});
