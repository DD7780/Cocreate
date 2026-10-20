import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as Y from 'yjs';
import {provenanceFixture,typoSource} from './fixtures/provenance.js';

const waitFor=async(check:()=>boolean)=>{const end=Date.now()+30_000;while(!check()){if(Date.now()>end)throw new Error('Provenance fixture timed out');await new Promise(resolve=>setTimeout(resolve,30));}};
test('forged source blocks builder; explicit recovery replays once without resetting spend; typo submission reaches real compiler and verification',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'provenance-flow-')),f=await provenanceFixture(dir);
  const {app,room}=f,manager=app.manager;manager.join(room,'alice','Alice');
  const client=new Y.Doc();Y.applyUpdate(client,Y.encodeStateAsUpdate(room.doc));
  const edit=(text:string)=>{const vector=Y.encodeStateVector(client),p=new Y.XmlElement('paragraph'),t=new Y.XmlText();client.transact(()=>{client.getXmlFragment('default').push([p]);p.push([t]);t.insert(0,text);});manager.handleMessage(room,{participantId:'alice',readyState:0,send(){}} as any,Buffer.concat([Buffer.from([0]),Buffer.from(Y.encodeStateAsUpdate(client,vector))]),true);};
  try{
    f.control.fabricated=true;edit('Build a catalog with a working filter');
    const result=await manager.submitChanges(room,'alice','blocked');
    await waitFor(()=>!room.agentTasks.size&&!room.buildTimer&&!room.buildTask);
    assert.match(result.message,/interpretation needs review/);assert.equal(f.calls.filter(call=>call.purpose==='builder').length,0);
    assert.equal(room.versions.length,0);assert.equal(room.sharedRequirements[0].status,'proposed');
    const budget=structuredClone(room.executionBudget!),latest=room.participants.get('alice')!.latest!,history=structuredClone(latest),intent=latest.intents![0];
    const correction={requestId:'explicit-correction',specificationRevision:room.specificationRevision,target:{kind:'interpretation' as const,id:latest.id,intentId:intent.id,revision:latest.revision},action:'correct' as const,text:'Build a catalog with a working filter',category:'goal' as const,classification:'explicit_request' as const};
    await manager.mutateIntent(room,'alice',correction);const revision=room.specificationRevision;
    await manager.mutateIntent(room,'alice',correction);
    assert.equal(room.specificationRevision,revision);assert.equal(room.intentCorrections!.length,1);assert.deepEqual(room.interpretationHistory!.at(-1),history);
    assert.deepEqual(room.executionBudget,budget);assert.equal(f.calls.length,1);assert.equal(room.buildTimer,undefined);
    await manager.buildAcceptedChanges(room,'alice','explicit-build');
    await waitFor(()=>room.versions.length===1&&!room.buildTask);
    const calls=f.calls.length,built=room.specificationRevision;
    await manager.buildAcceptedChanges(room,'alice','explicit-build');
    assert.equal(f.calls.length,calls);assert.equal(room.specificationRevision,built);assert.equal(room.versions.length,1);
    assert.equal(room.executionBudget!.id,budget.id);assert.equal(room.executionBudget!.calls,budget.calls+1);
    assert.equal(room.aiRuns.at(-1)?.verification.evidence?.checks.find(check=>check.kind==='filter')?.passed,true);
    f.control.fabricated=false;edit(typoSource);await manager.submitChanges(room,'alice','typo');
    await waitFor(()=>room.versions.length===2&&!room.buildTask);
    const actual=room.participants.get('alice')!.latest!;
    assert.ok(actual.intents!.every(intent=>intent.validation?.status==='verified'&&intent.sourcePassage===typoSource));
    assert.equal(room.sharedRequirements.filter(item=>item.status==='accepted').length,3);
    assert.equal(room.aiRuns.at(-1)?.verification.compilationPassed,true);
    assert.equal(room.aiRuns.at(-1)?.verification.evidence?.checks.find(check=>check.kind==='filter')?.passed,true);
    assert.ok(manager.view(room).latestVersion);assert.equal(f.calls.length,4);
    await manager.submitChanges(room,'alice','typo');assert.equal(f.calls.length,4);assert.equal(room.versions.length,2);
  }finally{client.destroy();await f.close();assert.equal(path.dirname(path.resolve(dir)),path.resolve(os.tmpdir()));fs.rmSync(dir,{recursive:true,force:true});}
});
