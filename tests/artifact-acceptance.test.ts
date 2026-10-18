import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createProgressFixture,waitFor,pause} from './fixtures/build-progress.js';
import {captureAndProcess} from './fixtures/capture.js';
import {restaurantFiles} from './fixtures/restaurant.js';
import {withIsolatedBrowser} from '../server/isolation/browser.js';
import {previewDocument} from '../server/preview.js';

test('two contributors produce a visible restaurant, increment safely, retain proposals and preserve the prior product after verification failure',async()=>{
  const f=await createProgressFixture({builderFiles:restaurantFiles});
  const settled=async(version:number)=>{await waitFor(()=>(f.room.versions.length===version||f.room.status==='Error')&&!f.room.buildTask&&!f.room.buildTimer,'candidate completion',90_000);assert.equal(f.room.versions.length,version,f.room.lastError);};
  try{
    f.edit('alice','Create a restaurant website.');f.edit('bob','Add online ordering, maybe; we have not decided.');
    await captureAndProcess(f.manager,f.room,'alice','restaurant-first');await settled(1);
    assert.deepEqual(f.personal.map(item=>item.actor),['alice']);
    assert.deepEqual(f.builders[0].requirementTexts,['Create a restaurant website.']);assert.ok(f.room.pending.get('bob')?.length);
    const first=f.room.versions[0];assert.equal(first.aiRun?.verification.verified,false,'restaurant prose remains explicitly coverage-limited');
    await withIsolatedBrowser(async browser=>{
      const {targetId}=await browser.call('Target.createTarget',{url:'about:blank'}),{sessionId}=await browser.call('Target.attachToTarget',{targetId,flatten:true});
      await browser.call('Page.enable',{},sessionId);const {frameTree}=await browser.call('Page.getFrameTree',{},sessionId);
      await browser.call('Page.setDocumentContent',{frameId:frameTree.frame.id,html:previewDocument(first.bundle,first.css||'')},sessionId);
      const read=()=>browser.call('Runtime.evaluate',{expression:"document.body.innerText",returnByValue:true},sessionId);
      let visible='';for(let attempt=0;attempt<40;attempt++){visible=(await read()).result.value||'';if(visible.includes('Chicken momo'))break;await pause(50);}
      assert.match(visible,/Mountain Momo/);assert.match(visible,/Chicken momo/);assert.match(visible,/Vegetable momo/);
      const screenshot=await browser.call('Page.captureScreenshot',{format:'png'},sessionId);
      const output=path.resolve('artifacts/artifact-reliability');fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'restaurant.png'),Buffer.from(screenshot.data,'base64'));
    });
    await f.submit('alice','Use black text on a white background.','restaurant-increment');await settled(2);
    f.edit('bob','Use a white background.');await captureAndProcess(f.manager,f.room,'bob','compatible-background');await settled(3);
    assert.equal(f.room.conflictGroups.filter(group=>group.state!=='obsolete').length,0);
    assert.ok(f.builders.every(build=>build.requirementTexts.every(text=>!text.includes('online ordering'))));
    const before=f.builders.length;
    await f.submit('alice','Add delivery, maybe; we have not decided.','proposal-only');await pause(150);
    assert.equal(f.builders.length,before);assert.equal(f.room.versions.length,3);
    await f.reopen();await pause(150);assert.equal(f.builders.length,before);assert.equal(f.room.versions.length,3);
    await f.submit('alice','Add favorites.','failed-verification');
    await waitFor(()=>f.room.status==='Error'&&!f.room.buildTask,'functional failure',90_000);
    assert.equal(f.room.versions.length,3);assert.match(f.room.lastError||'',/verification failed/i,JSON.stringify({error:f.room.lastError,failedTools:f.manager.eventStore.eventsForWorkspace(f.room.id).filter(event=>event.eventType==='tool.failed').map(event=>event.payload)}));assert.equal(f.builders.length,before+1,'functional failure does not authorize model repairs');
  }finally{await f.close();}
});
