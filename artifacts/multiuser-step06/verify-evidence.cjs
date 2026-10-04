const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = process.cwd();
const prefix = 'artifacts/multiuser-step06/';
const read = file => fs.readFileSync(path.resolve(root, file), 'utf8');
const documents = ['context.md', 'product.md', 'instructions.md', 'api.md', 'README.md',
  'docs/harness/architecture.md', 'docs/harness/checklist.md', 'docs/harness/decisions.md',
  'docs/harness/reliability-verification.md', 'docs/harness/multiuser-step06-handoff.md'];
const sources = ['server/rooms.ts', 'server/build-progress.ts', 'server/index.ts', 'server/artifacts.ts',
  'src/App.tsx', 'src/types.ts', 'src/BuildProgress.tsx', 'src/build-progress.css', 'vite.config.ts',
  'tests/build-progress.test.ts', 'tests/fixtures/build-progress.ts', 'tests/fixtures/multiuser-baseline.ts',
  'tests/reliability.test.ts', 'scripts/verify-build-progress.ts', prefix + 'reproduce.ts'];
const full = read(prefix + 'full-tests-final.log');
const count = key => Number(full.match(new RegExp('^# ' + key + ' (\\d+)', 'm'))?.[1]);
assert.equal(count('tests'), 194);
assert.equal(count('pass'), 194);
for (const key of ['fail', 'skipped', 'cancelled']) assert.equal(count(key), 0);
const focused = read(prefix + 'progress-reliability.log');
assert.match(focused, /^# pass 23$/m);
assert.match(focused, /^# fail 0$/m);
assert.match(read(prefix + 'build.log'), /built in/);
assert.equal(read(prefix + 'script-types-final.log').trim(), '');
const browser = JSON.parse(read(prefix + 'browser/checks.json'));
assert.equal(browser.participants, 3);
assert.equal(browser.functionalVerified, false);
assert.equal(browser.physicalCalls, 7);
assert.deepEqual(browser.promotedRevisions, [1, 3, 4]);
for (const key of ['capturedPendingDurable', 'reloadDuringBuild', 'replayAddsNoInference',
  'viewerDenied', 'convergedRevisionLabels', 'progressWithFurtherCaptures']) assert.equal(browser[key], true);
const comparison = JSON.parse(read(prefix + 'comparison.json'));
assert.equal(comparison.before.staleCandidates, 4);
assert.equal(comparison.after.staleCandidates, 0);
assert.equal(comparison.after.promotionsWhileArriving, 4);
assert.equal(comparison.before.calls, comparison.after.calls);
const graphCounts = read(prefix + 'graphify.log').match(/Rebuilt: (\d+) nodes, (\d+) edges, (\d+) communities/);
assert.ok(graphCounts);
assert.equal(JSON.parse(read('graphify-out/graph.json')).nodes.length, Number(graphCounts[1]));
let checkedLocalLinks = 0;
const missing = [];
for (const file of documents) for (const match of read(file).matchAll(/!?\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
  const target = match[1].replace(/^<|>$/g, '').split('#')[0];
  if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
  checkedLocalLinks++;
  if (!fs.existsSync(path.resolve(root, path.dirname(file), decodeURIComponent(target)))) missing.push({file, target});
}
assert.deepEqual(missing, []);
const decisions = [...read('docs/harness/decisions.md').matchAll(/^## (D-\d+)/gm)].map(match => match[1]);
assert.equal(new Set(decisions).size, decisions.length);
assert.ok(decisions.includes('D-0049'));
async function main() {
  const health = await fetch('http://localhost:5173/api/health');
  const client = await fetch('http://localhost:5173/');
  assert.equal(health.status, 200);
  assert.equal(client.status, 200);
  const report = {
    recordedAt: new Date().toISOString(),
    scope: 'Step 06 local Windows, real disposable SQLite, loopback controlled providers and three signed local Chrome profiles; no hosted accounts, paid inference, SQL execution, migration or deployment',
    fullTests: {passed: count('pass'), failed: count('fail'), skipped: count('skipped'),
      durationMs: Number(full.match(/^# duration_ms ([\d.]+)/m)[1]), log: 'full-tests-final.log'},
    focusedTests: {passed: 23, failed: 0, newOutcomeTests: 8, log: 'progress-reliability.log'},
    productionBuild: 'passed', standaloneScriptTypes: 'passed',
    browserReport: 'browser/checks.json',
    browserScreenshotsInspected: ['pending-desktop.png', 'available-during-build.png', 'desktop.png', 'mobile.png'],
    comparison: 'comparison.json',
    graphify: {scope: 'AST only; no LLM calls; optional SQL parser unavailable; semantic labels not refreshed',
      nodes: Number(graphCounts[1]), edges: Number(graphCounts[2]), communities: Number(graphCounts[3])},
    documentation: {files: documents, checkedLocalLinks, missing, uniqueDecisionIds: decisions.length},
    localPreview: {health: health.status, client: client.status, url: 'http://localhost:5173'},
    sourceSha256: Object.fromEntries(sources.map(file => [file, crypto.createHash('sha256').update(read(file)).digest('hex')])),
    retainedFailedAttempts: ['before-runner-first.log', 'types-first.log', 'script-types-first.log',
      'focused-first.log', 'focused-second.log', 'focused-third.log', 'browser-first.log', 'full-tests.log'],
    limits: ['Single controlled latency sample; total calls unchanged', 'Compilation remains functionally unverified',
      'Executor budget is in memory and excludes interpretation/setup; durable restart scope deferred to Step 08'],
    pending: ['Step 07 unstarted: requirement-linked functional evidence through Step 04 isolation',
      'Real hosted membership/funding/load and canonical SQL uncertainty/replay acceptance',
      'Both unapplied coordinator migrations and real Postgres contention', 'Private Storage/RLS/deployed cache replacement',
      'Linux kernel/container isolation adversity', 'Production projection scale and appearance-reference comparison'],
  };
  fs.writeFileSync(path.join(__dirname, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({tests: report.fullTests, graphify: report.graphify,
    documentation: report.documentation, localPreview: report.localPreview}));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
