import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { IntentCommand, Requirement } from '../shared/types.js';
import { RoomManager, type Room } from '../server/rooms.js';
import { acceptedContext, validateSubmittedInterpretation } from '../server/intent-authority.js';
import { normalizeInterpretation, reconcileRequirements } from '../server/requirements.js';

const interpretation=(id:string,text:string)=>normalizeInterpretation({id:'interpretation-'+id,participantId:id,participantName:id,
  revision:1,sourceRevision:1,sourceEditSeqs:[1],sourcePassages:[text],features:[text],classification:'explicit_request',
  intents:[{text,category:'feature',classification:'explicit_request',sourcePassage:text,affectedRequirementIds:[]}],createdAt:'2026-10-04T00:00:00.000Z'});
function setup(config:Partial<ConstructorParameters<typeof RoomManager>[0]>={}) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'intent-command-')),manager=new RoomManager({dataDir:dir,debounceMs:10,encryptionSecret:'fixture',...config}),room=manager.create('intent-fixture');
  for(const id of ['alice','bob','cara'])manager.join(room,id,id);
  const seed=(id:string,text:string)=>{const value=interpretation(id,text),result=reconcileRequirements(room.sharedRequirements,value,room.conflictGroups);room.sharedRequirements=result.requirements;room.conflictGroups=result.conflictGroups;room.contradictions=result.contradictions;room.specificationRevision++;room.participants.get(id)!.latest=value;room.requirements.push(value);};
  let stopped=false;const stop=()=>{if(!stopped){manager.shutdown();stopped=true;}};
  const close=()=>{stop();assert.equal(path.dirname(path.resolve(dir)),path.resolve(os.tmpdir()));fs.rmSync(dir,{recursive:true,force:true});};
  return{dir,manager,room,seed,close,stop};
}
function command(room:Room,id=room.sharedRequirements[0].id,overrides:Partial<IntentCommand>={}):IntentCommand {
  return{requestId:crypto.randomUUID(),specificationRevision:room.specificationRevision,target:{kind:'requirement',id,revision:room.sharedRequirements.find(item=>item.id===id)!.revision},action:'correct',text:'Make the header blue',category:'design',classification:'explicit_request',...overrides};
}

test('coauthor correction preserves teammate wording and exact sources, audit and previous revision',async()=>{
  const f=setup();try{f.seed('alice','Make the header red');f.seed('bob','Make the header red');await f.manager.save(f.room);
    const red=structuredClone(f.room.sharedRequirements[0]),previous=structuredClone(f.room.participants.get('alice')!.latest),calls=f.room.usage.requests;
    await f.manager.mutateIntent(f.room,'alice',command(f.room));
    const preserved=f.room.sharedRequirements.find(item=>item.id===red.id)!;
    assert.equal(preserved.description,red.description);assert.equal(preserved.status,'accepted');assert.deepEqual(preserved.sources,red.sources.filter(s=>s.participantId==='bob'));
    assert.equal(f.room.sharedRequirements.find(item=>item.description==='Make the header blue')!.sources[0].participantId,'alice');
    assert.deepEqual(f.room.interpretationHistory!.at(-1),previous);assert.deepEqual(f.room.intentCorrections![0].sources,red.sources.filter(s=>s.participantId==='alice'));
    assert.equal(f.room.usage.requests,calls);assert.equal(f.room.intentBuildPending,true);assert.equal(f.room.buildTimer,undefined);
  }finally{f.close();}
});
test('withdrawal removes only caller support and survives restart; same request replays before stale checks',async()=>{
  const f=setup();let restarted:RoomManager|undefined;try{f.seed('alice','Add history');f.seed('bob','Add history');const c=command(f.room,undefined,{action:'withdraw'}),result=await f.manager.mutateIntent(f.room,'alice',c);
    assert.deepEqual(f.room.sharedRequirements[0].sources.map(s=>s.participantId),['bob']);const revision=f.room.specificationRevision;
    f.stop();restarted=new RoomManager({dataDir:f.dir,debounceMs:10,encryptionSecret:'fixture'});const room=restarted.get(f.room.id)!;
    assert.deepEqual(await restarted.mutateIntent(room,'alice',c),result);assert.equal(room.specificationRevision,revision);assert.equal(room.intentCorrections!.length,1);assert.equal(room.usage.requests,0);
    await assert.rejects(()=>restarted!.mutateIntent(room,'alice',{...c,action:'correct',text:'Add login',category:'feature',classification:'explicit_request'}),/already belongs/);
  }finally{restarted?.shutdown();f.close();}
});
test('unauthorized, stale and forged targets cannot mutate accepted intent',async()=>{
  const f=setup();try{f.seed('alice','Add history');const original=JSON.stringify(f.room.sharedRequirements);
    await assert.rejects(()=>f.manager.mutateIntent(f.room,'bob',command(f.room)),/own attributable/);
    await assert.rejects(()=>f.manager.mutateIntent(f.room,'alice',command(f.room,undefined,{specificationRevision:0})),/specification changed/);
    await assert.rejects(()=>f.manager.mutateIntent(f.room,'alice',command(f.room,undefined,{target:{kind:'interpretation',id:'interpretation-bob',intentId:'forged',revision:1}})),/interpretation changed/);
    assert.throws(()=>f.manager.mutateIntent(f.room,'alice',{...command(f.room),classification:'decision'}),/explicit request/);
    assert.equal(JSON.stringify(f.room.sharedRequirements),original);assert.equal(f.room.intentCorrections,undefined);
  }finally{f.close();}
});
test('concurrent stale corrections serialize and only one current revision commits',async()=>{
  const f=setup();try{f.seed('alice','Add history');const results=await Promise.allSettled([f.manager.mutateIntent(f.room,'alice',command(f.room)),f.manager.mutateIntent(f.room,'alice',command(f.room))]);
    assert.deepEqual(results.map(item=>item.status),['fulfilled','rejected']);assert.equal(f.room.intentCorrections!.length,1);
  }finally{f.close();}
});
test('ambiguous current intent can be corrected explicitly as proposal, question or request without inference',async()=>{
  const f=setup();try{f.seed('alice','Make that blue');const p=f.room.participants.get('alice')!,latest=p.latest!,intent=latest.intents![0];
    latest.intents![0]={...intent,classification:'ambiguity',validation:{status:'needs_clarification',reason:'Name the target'}};
    const c=command(f.room,undefined,{target:{kind:'interpretation',id:latest.id,intentId:intent.id,revision:latest.revision},text:'Make the header blue',classification:'proposal'});
    await f.manager.mutateIntent(f.room,'alice',c);assert.equal(f.room.sharedRequirements.find(item=>item.description==='Make the header blue')!.status,'proposed');
    const latest2=p.latest!,fixed=latest2.intents!.at(-1)!;
    await f.manager.mutateIntent(f.room,'alice',{...c,requestId:crypto.randomUUID(),specificationRevision:f.room.specificationRevision,target:{kind:'interpretation',id:latest2.id,intentId:fixed.id,revision:latest2.revision},classification:'explicit_request'});
    assert.equal(f.room.sharedRequirements.find(item=>item.description==='Make the header blue'&&item.status==='accepted')!.sources[0].authority,'human_correction');assert.equal(f.room.usage.requests,0);
  }finally{f.close();}
});
test('correction of one current intent preserves other entries and their independently withdrawable attribution',async()=>{
  const f=setup();try{
    const value=interpretation('alice','Add history');const second=interpretation('alice','Add favorites').intents![0];value.intents!.push(second);
    f.room.participants.get('alice')!.latest=value;f.room.requirements=[value];f.room.sharedRequirements=reconcileRequirements([],value).requirements;f.room.specificationRevision=1;
    const target=value.intents![0];await f.manager.mutateIntent(f.room,'alice',command(f.room,undefined,{target:{kind:'interpretation',id:value.id,intentId:target.id,revision:value.revision},text:'Add sorting'}));
    const current=f.room.participants.get('alice')!.latest!;assert.equal(current.intents!.find(i=>i.id===second.id)!.text,'Add favorites');
    await f.manager.mutateIntent(f.room,'alice',command(f.room,undefined,{action:'withdraw',target:{kind:'interpretation',id:current.id,intentId:second.id,revision:current.revision}}));
    assert.equal(f.room.sharedRequirements.find(i=>i.description==='Add favorites')!.status,'withdrawn');assert.equal(f.room.sharedRequirements.find(i=>i.description==='Add sorting')!.status,'accepted');
  }finally{f.close();}
});
test('accepted change aborts an old candidate but proposal-only change leaves independent work running',async()=>{
  const f=setup();try{f.seed('alice','Add history');const candidate=new AbortController();f.room.buildController=candidate;await f.manager.mutateIntent(f.room,'alice',command(f.room));assert.equal(candidate.signal.aborted,true);
    const proposal=interpretation('cara','Maybe add settings'),r=reconcileRequirements(f.room.sharedRequirements,proposal,f.room.conflictGroups);f.room.sharedRequirements=r.requirements;f.room.participants.get('cara')!.latest=proposal;
    const controller=new AbortController();f.room.buildController=controller;const id=f.room.sharedRequirements.find(i=>i.description==='Maybe add settings')!.id;
    await f.manager.mutateIntent(f.room,'cara',command(f.room,id,{text:'Maybe add profile',classification:'proposal'}));assert.equal(controller.signal.aborted,false);assert.equal(f.room.buildTimer,undefined);
  }finally{f.close();}
});

test('canonical intent remains invisible until remote acknowledgement; lost reply recovers one receipt',async()=>{
  let canonical:any,blocked=false,release!:()=>void,entered!:()=>void;
  const started=new Promise<void>(resolve=>{entered=resolve}),gate=new Promise<void>(resolve=>{release=resolve});
  const f=setup({durableStore:{saveSnapshot:async(_id,_revision,payload)=>{canonical=structuredClone(payload);if(blocked&&payload.intentCorrections){entered();await gate;throw new Error('reply lost after commit');}},appendDocumentUpdate:async()=>{}}});
  let restored:RoomManager|undefined,restoredDir:string|undefined;
  try{f.seed('alice','Add history');await f.manager.save(f.room);blocked=true;const c=command(f.room),oldRevision=f.room.specificationRevision,promise=f.manager.mutateIntent(f.room,'alice',c);await started;
    assert.equal(f.manager.view(f.room).specificationRevision,oldRevision);assert.equal(f.manager.view(f.room).requirements[0].description,'Add history');
    release();await assert.rejects(()=>promise,/outcome is uncertain/);assert.equal(f.manager.view(f.room).specificationRevision,oldRevision);
    await assert.rejects(()=>f.manager.mutateIntent(f.room,'alice',c),/temporarily unavailable/);
    restoredDir=fs.mkdtempSync(path.join(os.tmpdir(),'intent-canonical-'));restored=new RoomManager({dataDir:restoredDir,debounceMs:10,encryptionSecret:'fixture'});const recovered=restored.hydrate(f.room.id,canonical);
    const result=await restored.mutateIntent(recovered,'alice',c);assert.equal(result.specificationRevision,oldRevision+1);assert.equal(recovered.intentCorrections!.length,1);assert.equal(recovered.usage.requests,0);
  }finally{release();restored?.shutdown();if(restoredDir){assert.equal(path.dirname(path.resolve(restoredDir)),path.resolve(os.tmpdir()));fs.rmSync(restoredDir,{recursive:true,force:true});}f.close();}
});

test('provider provenance guard rejects invented passages and consequential pronouns; exact ordinary requests remain accepted',()=>{
  for(const text of ['Make that blue','Make it blue']){const value=validateSubmittedInterpretation(interpretation('alice',text),[{seq:1,kind:'insert',before:'',after:text}],[]);assert.equal(value.intents![0].classification,'ambiguity');assert.equal(reconcileRequirements([],value).requirements[0].status,'proposed');}
  const invented=validateSubmittedInterpretation(interpretation('alice','Add private billing'),[{seq:1,kind:'insert',before:'',after:'How should styling work?'}],[]);assert.equal(invented.intents![0].validation!.status,'needs_clarification');
  const direct=validateSubmittedInterpretation(interpretation('alice','Add a button that saves favorites'),[{seq:1,kind:'insert',before:'',after:'Add a button that saves favorites'}],[]);assert.equal(reconcileRequirements([],direct).requirements[0].status,'accepted');
});
test('accepted context is attributed; named pronoun resolves with unique evidence, model IDs alone do not',()=>{
  const initial=reconcileRequirements([],interpretation('bob','Make the header red')).requirements,context=acceptedContext(initial),id=initial[0].id;
  const value=interpretation('alice','Make that blue');value.intents![0].affectedRequirementIds=[id];
  assert.equal(validateSubmittedInterpretation(value,[{seq:1,kind:'insert',before:'',after:'Make that blue'}],context).intents![0].classification,'ambiguity');
  const explicit=interpretation('alice','Make that header blue');explicit.intents![0].affectedRequirementIds=[id];const checked=validateSubmittedInterpretation(explicit,[{seq:1,kind:'insert',before:'',after:'Make that header blue'}],context);
  assert.equal(checked.intents![0].validation!.status,'verified');assert.deepEqual(checked.intents![0].contextReferences,[{requirementId:id,revision:1,participantIds:['bob'],authority:'accepted_context'}]);
  assert.equal(checked.intents![0].participantId,'alice');assert.equal(initial[0].sources[0].participantId,'bob');
});
test('model cannot forge human authority, decision references, or withdraw teammates via deleted source',()=>{
  const initial=reconcileRequirements([],interpretation('bob','Add history')).requirements,id=initial[0].id,forged=interpretation('alice','Withdraw Add history');
  Object.assign(forged.intents![0],{participantId:'bob',authority:'human_correction',category:'withdrawal',affectedRequirementIds:[id],validation:{status:'verified'}});
  const checked=validateSubmittedInterpretation(forged,[{seq:1,kind:'delete',before:'Withdraw Add history',after:''}],acceptedContext(initial));
  assert.equal(checked.intents![0].participantId,'alice');assert.equal(checked.intents![0].authority,'authenticated_submission');assert.equal(checked.intents![0].classification,'ambiguity');assert.deepEqual(reconcileRequirements(initial,checked).requirements,initial);
});
test('affected model IDs do not overwrite a teammate or silently withdraw the caller',()=>{
  const first=reconcileRequirements([],interpretation('alice','Make the header red')).requirements,second=reconcileRequirements(first,interpretation('bob','Make the header red')).requirements;
  const change=interpretation('alice','Make the header blue');change.affectedRequirementIds=[second[0].id];change.intents![0].affectedRequirementIds=[second[0].id];
  const result=reconcileRequirements(second,change).requirements,old=result.find(i=>i.id===second[0].id)!;assert.equal(old.description,'Make the header red');assert.deepEqual(old.sources,second[0].sources);
});
test('unverified/proposed matching descriptions never confer accepted teammate attribution',()=>{
  const initial=reconcileRequirements([],interpretation('bob','Add history')).requirements,value=interpretation('alice','Add history');value.intents![0].validation={status:'needs_clarification',reason:'Invented source'};
  const result=reconcileRequirements(initial,value).requirements;assert.deepEqual(result.find(i=>i.status==='accepted')!.sources,initial[0].sources);assert.equal(result.find(i=>i.status==='proposed')!.sources[0].participantId,'alice');
});

test('queued intent commands recheck current membership before any durable mutation',async()=>{
  const f=setup();try{f.seed('alice','Add history');let release!:()=>void;f.room.steeringQueue=new Promise<void>(resolve=>{release=resolve});let authorized=true;
    const promise=f.manager.mutateIntent(f.room,'alice',command(f.room),async()=>{if(!authorized)throw Object.assign(new Error('Membership revoked'),{status:403});});authorized=false;release();await assert.rejects(()=>promise,/Membership revoked/);assert.equal(f.room.specificationRevision,1);assert.equal(f.room.intentCorrections,undefined);
  }finally{f.close();}
});

test('a provider cannot quote only the color to conceal an unresolved source target or invent contextual attribution',()=>{
  const masked=interpretation('alice','Make the header blue');masked.intents![0].sourcePassage='blue';
  const checked=validateSubmittedInterpretation(masked,[{seq:1,kind:'insert',before:'',after:'Make that blue'}],[]);
  assert.equal(checked.intents![0].classification,'ambiguity');
  const teammate=reconcileRequirements([],interpretation('bob','Add private billing')).requirements;
  const injected=validateSubmittedInterpretation(interpretation('alice','Add private billing'),[{seq:2,kind:'insert',before:'',after:'Add catalog search'}],acceptedContext(teammate));
  const result=reconcileRequirements(teammate,injected).requirements;assert.deepEqual(result.find(item=>item.status==='accepted')!.sources,teammate[0].sources);
});

test('typed insertion fragments and shorter replacements retain authenticated request text; deletion-only text grants no new intent',()=>{
  const request='Build a catalog';const fragments=[...request].map((after,index)=>({seq:index+1,kind:'insert' as const,before:'',after}));
  assert.equal(validateSubmittedInterpretation(interpretation('alice',request),fragments,[]).intents![0].validation!.status,'verified');
  const replacement=validateSubmittedInterpretation(interpretation('alice','Add search'),[{seq:1,kind:'delete',before:'A longer old draft',after:'Add search'}],[]);
  assert.equal(reconcileRequirements([],replacement).requirements[0].status,'accepted');
  const removed=validateSubmittedInterpretation(interpretation('alice','Add search'),[{seq:1,kind:'delete',before:'Add search',after:''}],[]);
  assert.equal(reconcileRequirements([],removed).requirements[0].status,'proposed');
});
