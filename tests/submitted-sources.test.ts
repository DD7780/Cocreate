import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeInterpretation,reconcileRequirements} from '../server/requirements.js';
import {validateSubmittedInterpretation} from '../server/intent-authority.js';
import * as Y from 'yjs';
import {applySteeringUpdate} from '../server/steering-edits.js';
import {captureSourceSpans,freezeSubmittedSources} from '../server/submitted-sources.js';
import type {EditRecord} from '../server/room-state.js';

const original='Create a website for my resturant in neubrutlist style. Momo should be shown as the hero product of the resturant.';
const clarified='Create a restaurant website in a neubrutalist style.';
const value=()=>normalizeInterpretation({participantId:'alice',participantName:'Alice',revision:1,sourceRevision:1,sourceEditSeqs:[1],
  intents:[{text:clarified,category:'goal',classification:'explicit_request',rationale:'Direct request',sourcePassage:original.replaceAll('resturant','restaurant'),sourceRefs:['submission:alice:1'],affectedRequirementIds:[]}]});

test('reported typo: clarified model quote resolves to original immutable participant evidence',()=>{
  const input=value();
  const captured={id:'submission',participantId:'alice',sources:[{id:'submission:alice:1',submissionId:'submission',participantId:'alice',editSeqs:[1],text:original}]};
  const checked=validateSubmittedInterpretation(input,[{seq:1,kind:'insert',before:'',after:original}],[],undefined,captured);
  assert.equal(checked.intents![0].validation?.status,'verified');
  assert.equal(checked.intents![0].sourcePassage,original);
  assert.equal(checked.intents![0].text,clarified);
  assert.equal(reconcileRequirements([],checked).requirements[0].status,'accepted');
});

function capture() {
  const client=new Y.Doc(),server=new Y.Doc(),paragraph=new Y.XmlElement('paragraph'),text=new Y.XmlText(),changes:EditRecord[]=[];
  const edit=(actor:string,change:()=>void)=>{
    const vector=Y.encodeStateVector(client),previous=Y.encodeStateVector(server);change();
    const update=Y.encodeStateAsUpdate(client,vector),after=applySteeringUpdate(server,update,actor);
    changes.push({seq:changes.length+1,kind:after?'insert':'delete',before:'',after,participantId:actor,at:'fixture',update:Buffer.from(update).toString('base64'),sourceSpans:captureSourceSpans(update,previous)});
  };
  edit('alice',()=>{client.getXmlFragment('default').push([paragraph]);paragraph.push([text]);});
  return {client,server,text,changes,edit,close:()=>{client.destroy();server.destroy();}};
}
const checked=(text:string,refs:string[]|undefined,captured:ReturnType<typeof freezeSubmittedSources>,changes:EditRecord[],actor='alice')=>{
  const input=normalizeInterpretation({participantId:actor,participantName:actor,revision:1,sourceRevision:1,sourceEditSeqs:changes.map(change=>change.seq),
    intents:[{text,category:'design',classification:text.startsWith('Should')?'question':'explicit_request',rationale:'Fixture',sourcePassage:text.replaceAll('resturant','restaurant'),sourceRefs:refs,affectedRequirementIds:[]}]});
  return validateSubmittedInterpretation(input,changes,[],undefined,captured);
};

test('character typing and backspaces freeze the actual typo passage rather than concatenated deleted text',()=>{
  const f=capture();try{
    for(const char of 'Create a website for my resturant in neub')f.edit('alice',()=>f.text.insert(f.text.length,char));
    f.edit('alice',()=>f.text.delete(f.text.length-1,1));f.edit('alice',()=>f.text.delete(f.text.length-1,1));
    for(const char of 'ubrutlist style. Momo should be shown as the hero product of the resturant.')f.edit('alice',()=>f.text.insert(f.text.length,char));
    assert.equal(f.text.toString(),original);
    assert.notEqual(f.changes.map(change=>change.after).join(''),original);
    const captured=freezeSubmittedSources('typed','alice',f.changes,f.server);
    assert.deepEqual(captured.sources.map(source=>source.text),[original]);
    const result=checked(clarified,[captured.sources[0].id],captured,f.changes);
    assert.equal(result.intents![0].validation?.status,'verified');
    assert.equal(result.intents![0].sourcePassage,original);
  }finally{f.close();}
});

test('a teammate’s unsubmitted writing is excluded and splits the caller’s passages',()=>{
  const f=capture();try{
    f.edit('alice',()=>f.text.insert(0,'Create a site. '));
    f.edit('bob',()=>f.text.insert(f.text.length,'Add private billing. '));
    f.edit('alice',()=>f.text.insert(f.text.length,'Show momo.'));
    const captured=freezeSubmittedSources('two','alice',f.changes,f.server);
    assert.deepEqual(captured.sources.map(source=>source.text),['Create a site. ','Show momo.']);
    assert.equal(captured.sources.some(source=>source.text.includes('billing')),false);
    assert.equal(checked('Add private billing.',['two:bob:1'],captured,f.changes).intents![0].validation?.status,'needs_clarification');
  }finally{f.close();}
});

test('identical text never confers ownership and old or mixed references fail closed',()=>{
  const f=capture();try{
    f.edit('alice',()=>f.text.insert(0,'Add a menu.'));
    f.edit('bob',()=>f.text.insert(f.text.length,'Add a menu.'));
    const alice=freezeSubmittedSources('alice-submission','alice',f.changes,f.server),bob=freezeSubmittedSources('bob-submission','bob',f.changes,f.server);
    assert.equal(alice.sources[0].text,bob.sources[0].text);
    for(const refs of [undefined,[],['fabricated'],[bob.sources[0].id],[alice.sources[0].id,bob.sources[0].id]]){
      const result=checked('Add a menu.',refs,alice,f.changes);
      assert.equal(result.intents![0].validation?.status,'needs_clarification');
      assert.equal(normalizeInterpretation(result).intents![0].sourcePassage,'');
      assert.equal(reconcileRequirements([],result).requirements.some(item=>item.status==='accepted'),false);
    }
    assert.equal(checked('Add a menu.',[alice.sources[0].id],alice,f.changes).intents![0].validation?.status,'verified');
    const forged={...alice,sources:[{...alice.sources[0],participantId:'bob'}]};
    assert.equal(checked('Add a menu.',[alice.sources[0].id],forged,f.changes).intents![0].validation?.status,'needs_clarification');
    assert.equal(checked('Add a menu.',[alice.sources[0].id],alice,f.changes,'bob').intents![0].validation?.status,'needs_clarification');
  }finally{f.close();}
});

test('multiple clarified requirements share one immutable source after the document changes',()=>{
  const f=capture();try{
    f.edit('alice',()=>f.text.insert(0,original));
    const batch=structuredClone(f.changes),captured=freezeSubmittedSources('frozen','alice',batch,f.server),serialized=JSON.stringify(captured);
    f.edit('bob',()=>{f.text.delete(0,f.text.length);f.text.insert(0,'Ignore the restaurant.');});
    const input=value();input.intents![0].sourceRefs=[captured.sources[0].id];input.intents!.push({...input.intents![0],id:'momo',text:'Show Momo as the hero product.'});
    const result=validateSubmittedInterpretation(input,batch,[],undefined,captured);
    assert.equal(result.intents!.length,2);assert.ok(result.intents!.every(intent=>intent.validation?.status==='verified'&&intent.sourcePassage===original));
    assert.equal(reconcileRequirements([],result).requirements.filter(item=>item.status==='accepted').length,2);
    assert.equal(JSON.stringify(captured),serialized);
  }finally{f.close();}
});

test('valid attribution retains uncertainty, proposals, questions and consequential conflicts',()=>{
  const f=capture();try{
    for(const text of ['Make that blue','Maybe add delivery','Should we use login?']){
      f.edit('alice',()=>{f.text.delete(0,f.text.length);f.text.insert(0,text);});
      const captured=freezeSubmittedSources(crypto.randomUUID(),'alice',f.changes,f.server),result=checked(text,[captured.sources[0].id],captured,f.changes);
      assert.equal(reconcileRequirements([],result).requirements.some(item=>item.status==='accepted'),false);
    }
    const direction=(actor:string,color:string)=>{
      const changes=[{seq:1,kind:'insert' as const,before:'',after:`Make the header ${color}`,participantId:actor,at:'fixture',update:'fixture'}];
      const captured=freezeSubmittedSources(crypto.randomUUID(),actor,changes);
      return checked(changes[0].after,[captured.sources[0].id],captured,changes,actor);
    };
    const first=reconcileRequirements([],direction('alice','red')),second=reconcileRequirements(first.requirements,direction('bob','blue'),first.conflictGroups);
    assert.equal(second.conflictGroups.some(group=>group.state==='awaiting_choices'),true);
  }finally{f.close();}
});

test('retransmitted old identities and deletion-only updates cannot claim earlier writing',()=>{
  const f=capture();try{
    f.edit('alice',()=>f.text.insert(0,'Add a menu.'));
    const previous=Y.encodeStateVector(f.server);
    f.text.insert(f.text.length,'Show Momo.');
    const complete=Y.encodeStateAsUpdate(f.client),spans=captureSourceSpans(complete,previous);
    assert.equal(spans.map(span=>span.text).join(''),'Show Momo.');
    f.edit('bob',()=>f.text.delete(0,f.text.length));
    const deletion=f.changes.at(-1)!;
    assert.deepEqual(freezeSubmittedSources('deletion','bob',[deletion],f.server).sources,[]);
  }finally{f.close();}
});

test('a verified passage with several intents cannot silently promote model uncertainty to an accepted request',()=>{
  const changes=[{seq:1,kind:'insert' as const,before:'',after:'Create a restaurant. Maybe add delivery later.',participantId:'alice',at:'fixture',update:'fixture'}];
  const captured=freezeSubmittedSources('mixed','alice',changes),input=value();
  for(const classification of ['proposal','question','ambiguity'] as const){
    input.intents![0]={...input.intents![0],text:'Add delivery',classification,sourceRefs:[captured.sources[0].id],sourcePassage:changes[0].after};
    const result=validateSubmittedInterpretation(normalizeInterpretation(input),changes,[],undefined,captured);
    assert.equal(reconcileRequirements([],result).requirements[0].status,'proposed');
  }
});
