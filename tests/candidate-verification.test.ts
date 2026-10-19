import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { withIsolatedBrowser } from '../server/isolation/browser.js';
import { IsolationError } from '../server/isolation.js';
import { applyOperations, bundleProject } from '../server/project.js';
import { assertPromotionEvidence, planVerification, verifyCandidate } from '../server/verification.js';
import { reconcileRequirements, normalizeInterpretation } from '../server/requirements.js';
import { verifiedList } from './fixtures/verified-list.js';

export function requirementsFor(texts: string[]) {
  return reconcileRequirements([], normalizeInterpretation({id:'fixture',participantId:'alice',participantName:'Alice',revision:1,
    sourceRevision:1,sourceEditSeqs:[1],createdAt:new Date().toISOString(),goals:texts,features:[],design:[],constraints:[],questions:[],additions:[],modifications:[],withdrawals:[],
    sourcePassages:texts,intents:texts.map(text=>({text,category:'goal',classification:'explicit_request',rationale:'Fixture',sourcePassage:text,affectedRequirementIds:[]}))}), []).requirements;
}
const filesFor = (source: string) => applyOperations(undefined, [{type:'write',path:'src/App.tsx',content:source}]);

test('real isolated browser verifies accepted filter, favorites and sorting and binds evidence to the candidate', async () => {
  const requirements = requirementsFor(['Build a catalog with a working filter','Add favorites','Add sorting']);
  assert.deepEqual(planVerification(requirements, 3).kinds, ['filter','favorites','sort']);
  const files = filesFor(verifiedList), compiled = await bundleProject(files);
  const report = await verifyCandidate(files, compiled, requirements, 3);
  console.log(JSON.stringify(report));
  assert.equal(report.status, 'passed'); assert.equal(report.checks.length, 3);
  assert.ok(report.requirements.every(row=>row.status==='verified'&&row.implementation==='observed'));
  assertPromotionEvidence(report, files, compiled, requirements, 3);
  assert.throws(()=>assertPromotionEvidence(undefined, files, compiled, requirements, 3), /missing|stale/);
  assert.throws(()=>assertPromotionEvidence(report, filesFor(verifiedList+'\n// new candidate'), compiled, requirements, 3), /stale/);
  assert.throws(()=>assertPromotionEvidence(report, files, {...compiled,css:compiled.css+'body{}'}, requirements, 3), /stale/);
  assert.throws(()=>assertPromotionEvidence(report, files, compiled, requirements, 4), /stale/);
  assert.throws(()=>assertPromotionEvidence(report, files, compiled, requirements.map(item=>({...item,revision:item.revision+1})), 3), /stale/);
  assert.throws(()=>assertPromotionEvidence(report, files, compiled, requirements.map(item=>({...item,acceptanceCriteria:['Different criterion']})), 3), /stale/);
  for (const change of [{policyVersion:'old'}, {checks:[]}, {status:'unverified'}, {requirements:report.requirements.map(row=>({...row,status:'unverified'}))}]) {
    assert.throws(()=>assertPromotionEvidence({...report,...change} as typeof report, files, compiled, requirements, 3));
  }
});

test('compiling controls without behavior fail; retained feature regressions are checked on every candidate', async () => {
  const requirements = requirementsFor(['Build a catalog with a working filter','Add favorites','Add sorting']);
  for (const source of [verifiedList.replace('setQuery(e.target.value)', 'void e'), verifiedList.replace('setFavorite(!favorite)','void 0'), verifiedList.replace('setSorted(!sorted)','void 0')]) {
    const files = filesFor(source), compiled = await bundleProject(files), report = await verifyCandidate(files, compiled, requirements, 3);
    assert.equal(report.status,'failed'); assert.ok(report.checks.some(item=>item.implemented&&!item.passed));
    assert.throws(()=>assertPromotionEvidence(report,files,compiled,requirements,3), /failed/);
  }
});

test('unsupported prose remains unverified and generated assertion tampering cannot replace trusted checks', async () => {
  const requirements = requirementsFor(['Build a catalog with a working filter','Make it delightful']);
  const source=verifiedList.replace('setQuery(e.target.value)','void e')+`\nElement.prototype.getClientRects=function(){return [{width:1}] as any}; (globalThis as any).verification={status:'passed'};`;
  const files=filesFor(source), compiled=await bundleProject(files), report=await verifyCandidate(files,compiled,requirements,2);
  assert.equal(report.status,'failed'); assert.equal(report.requirements[1].status,'unverified');
  assert.equal(report.requirements[1].implementation,'unknown'); assert.equal(report.checks[0].passed,false);
  const unknown=requirementsFor(['Make it delightful']), evidence=await verifyCandidate(files,compiled,unknown,1);
  assert.equal(evidence.status,'unverified');assert.equal(evidence.checks.length,0);
  assertPromotionEvidence(evidence,files,compiled,unknown,1);
});

test('actual verification browser denies a private host file and loopback network and removes its child/profile', async () => {
  const outside=fs.mkdtempSync(path.join(os.tmpdir(),'browser-private-')), secret=path.join(outside,'private.html');
  fs.writeFileSync(secret,'<body>synthetic private sentinel</body>');let connections=0,pid=0;
  const server=http.createServer((_req,res)=>{connections++;res.end('Unexpected connection');});
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  const address=server.address();assert.ok(address&&typeof address!=='string');
  try {
    await withIsolatedBrowser(async browser=>{
      const {targetId}=await browser.call('Target.createTarget',{url:'about:blank'});
      const {sessionId}=await browser.call('Target.attachToTarget',{targetId,flatten:true});
      const result=await browser.call('Runtime.evaluate',{expression:`fetch('http://127.0.0.1:${address.port}').then(()=>true,()=>false)`,awaitPromise:true,returnByValue:true},sessionId);
      assert.equal(result.result.value,false);assert.equal(connections,0);
      const file=await browser.call('Page.navigate',{url:'file:///'+secret.replaceAll('\\','/')},sessionId);
      assert.match(file.errorText,/ERR_ACCESS_DENIED|ERR_FILE_NOT_FOUND/);
      const page=await browser.call('Runtime.evaluate',{expression:'document.body?.textContent',returnByValue:true},sessionId);
      assert.doesNotMatch(page.result.value || '',/synthetic private sentinel/);
    },{onStarted:child=>{pid=child;}});
    assert.ok(pid);assert.throws(()=>process.kill(pid,0),{code:'ESRCH'});
    assert.deepEqual(fs.readdirSync(path.resolve('.runtime/isolation/jobs')),[]);
    assert.equal(fs.readFileSync(secret,'utf8'),'<body>synthetic private sentinel</body>');
  } finally {
    await new Promise<void>(resolve=>server.close(()=>resolve()));
    assert.equal(path.dirname(path.resolve(outside)),path.resolve(os.tmpdir()));fs.rmSync(outside,{recursive:true,force:true});
  }
});

for (const [resource, expression] of [['CPU', 'while(true){}'], ['protocol output', "'x'.repeat(5*1024*1024)"]]) {
  test(`browser ${resource} remains inside the isolated job bounds`, async () => {
    let pid=0;
    await assert.rejects(withIsolatedBrowser(async browser=>{
      const {targetId}=await browser.call('Target.createTarget',{url:'about:blank'});
      const {sessionId}=await browser.call('Target.attachToTarget',{targetId,flatten:true});
      await browser.call('Runtime.evaluate',{expression,returnByValue:true},sessionId);
    },{wallMs:20_000,onStarted:child=>{pid=child;}}),error=>{
      if (!(error instanceof IsolationError && error.code === 'isolation_resource_limit')) console.error('Resource diagnostic:', resource, error);
      return error instanceof IsolationError && error.code === 'isolation_resource_limit';
    });
    assert.ok(pid);assert.throws(()=>process.kill(pid,0),{code:'ESRCH'});
    assert.deepEqual(fs.readdirSync(path.resolve('.runtime/isolation/jobs')),[]);
  });
}

test('cancellation and wall limits terminate browser execution and leave no child jobs', async () => {
  for(const cancel of [true,false]) {
    let pid=0;const controller=new AbortController();
    await assert.rejects(withIsolatedBrowser(async browser=>{
      const {targetId}=await browser.call('Target.createTarget',{url:'about:blank'});
      const {sessionId}=await browser.call('Target.attachToTarget',{targetId,flatten:true});
      if(cancel)setTimeout(()=>controller.abort(),100);
      await browser.call('Runtime.evaluate',{expression:'while(true){}'},sessionId);
    },{signal:controller.signal,wallMs:cancel?5_000:2_000,onStarted:child=>{pid=child;}}),error=>error instanceof IsolationError&&error.code===(cancel?'isolation_cancelled':'isolation_timeout'));
    assert.ok(pid);assert.throws(()=>process.kill(pid,0),{code:'ESRCH'});
    assert.deepEqual(fs.readdirSync(path.resolve('.runtime/isolation/jobs')),[]);
  }
});
