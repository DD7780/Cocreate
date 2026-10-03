const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const sha = name => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex');
const prefix = 'artifacts/multiuser-step05/';
const documents = ['README.md','api.md','context.md','product.md','instructions.md','docs/harness/architecture.md','docs/harness/checklist.md','docs/harness/decisions.md','docs/harness/reliability-verification.md','docs/harness/multiuser-step05-handoff.md'];
const sources = ['server/intent-authority.ts','server/intent-commands.ts','server/generator.ts','server/index.ts','server/requirements.ts','server/rooms.ts','src/IntentReview.tsx','src/intent-review.css','src/App.tsx','src/types.ts','scripts/verify-intent-ui.ts','scripts/verify-reliability.ts','tests/intent-corrections.test.ts','tests/artifact-restoration.test.ts','tests/auto-build-budget.test.ts','tests/integration.test.ts','tests/reliability.test.ts','tests/multiuser-baseline.test.ts','tests/fixtures/multiuser-baseline.ts'];
const full = read(prefix+'full-tests.log');
const count = key => Number(full.match(new RegExp('^# '+key+' (\\d+)','m'))?.[1]);
assert.equal(count('tests'),186); assert.equal(count('pass'),186); assert.equal(count('fail'),0); assert.equal(count('skipped'),0);
assert.match(read(prefix+'build.log'), /built in/);
assert.equal(read(prefix+'script-types.log').trim(),'');
const browser = JSON.parse(read(prefix+'browser/checks.json'));
assert.equal(browser.deviceCacheFailureVisible,true); assert.equal(browser.participants,3); assert.equal(browser.functionalVerified,false);
const preservation = JSON.parse(read(prefix+'database-preserved.json'));
assert.equal(preservation.quickCheck,'ok'); assert.equal(preservation.canonicalMirrorIdentical,true); assert.equal(preservation.projectRecordsDeleted,0);
const graphLog = read(prefix+'graphify.log');
const graphCounts = graphLog.match(/Rebuilt: (\d+) nodes, (\d+) edges, (\d+) communities/);
assert.ok(graphCounts);
const graph = JSON.parse(read('graphify-out/graph.json'));
assert.equal(graph.nodes.length,Number(graphCounts[1]));
const missing = []; let checkedLocalLinks = 0;
for(const file of documents) for(const match of read(file).matchAll(/!?\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
  const target = match[1].replace(/^<|>$/g,'').split('#')[0];
  if(!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
  checkedLocalLinks++;
  if(!fs.existsSync(path.resolve(root,path.dirname(file),decodeURIComponent(target)))) missing.push({file,target});
}
assert.deepEqual(missing,[]);
const decisions = [...read('docs/harness/decisions.md').matchAll(/^## (D-\d+)/gm)].map(match=>match[1]);
assert.equal(new Set(decisions).size,decisions.length); assert.ok(decisions.includes('D-0048'));
(async()=>{
  const health = await fetch('http://localhost:5173/api/health'); assert.equal(health.status,200);
  const client = await fetch('http://localhost:5173/'); assert.equal(client.status,200);
  const report = {
    scope:'Step 05 local Windows tests and three signed local Chrome profiles, loopback controlled provider, real SQLite and Windows compiler isolation; no paid inference, hosted account, SQL migration or deployment',
    fullTests:{passed:count('pass'),failed:count('fail'),skipped:count('skipped'),durationMs:Number(full.match(/^# duration_ms ([\d.]+)/m)[1])},
    focusedTests:{passed:16,failed:0,log:'final-focused-tests.log'},
    productionBuild:'passed',standaloneScriptTypes:'passed',browserReport:'browser/checks.json',
    browserScreenshotsInspected:['desktop.png','mobile.png','corrected-history.png','stale-correction.png'],
    graphify:{scope:'AST only; no LLM calls; optional SQL parser unavailable; semantic labels not refreshed',nodes:Number(graphCounts[1]),edges:Number(graphCounts[2]),communities:Number(graphCounts[3])},
    documentation:{files:documents,checkedLocalLinks,missing,uniqueDecisionIds:decisions.length},
    databasePreservation:'database-preserved.json',
    localPreview:{health:health.status,client:client.status,url:'http://localhost:5173'},
    sourceSha256:Object.fromEntries(sources.map(name=>[name,sha(name)])),
    retainedFailedAttempts:['focused-tests.log','full-tests-first.log','full-tests-disk-full.log','full-tests-deadline.log','archive-deadline-rerun.log','regression-tests.log','browser.log','browser-second.log','browser-third.log','browser-fourth.log'],
    pending:['Real hosted account/membership and canonical SQL uncertainty/takeover/replay acceptance','Both unapplied coordinator migrations and real Postgres contention','Real private Storage/RLS/deployed replacement','Linux isolation kernel/container adversity','Production history/receipt scale and reference comparison','Step 06 onwards; generated functional evidence remains unverified'],
  };
  fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({tests:report.fullTests,documentation:report.documentation,graphify:report.graphify,localPreview:report.localPreview}));
})().catch(error=>{console.error(error);process.exitCode=1});
