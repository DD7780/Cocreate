const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = process.cwd();
const prefix = 'artifacts/multiuser-step07/';
const read = file => fs.readFileSync(path.resolve(root, file), 'utf8');
const documents = ['context.md', 'product.md', 'instructions.md', 'api.md', 'README.md',
  'docs/harness/architecture.md', 'docs/harness/checklist.md', 'docs/harness/decisions.md',
  'docs/harness/reliability-verification.md', 'docs/harness/multiuser-step07-handoff.md'];
const sources = ['server/rooms.ts', 'server/tool-registry.ts', 'server/verification.ts',
  'server/isolation/browser.ts', 'server/isolation/list-observer.cjs', 'server/isolation/windows-runner.cs',
  'server/ai-accounting.ts', 'server/generator.ts', 'src/App.tsx', 'src/types.ts',
  'src/VerificationSummary.tsx', 'src/build-progress.css', 'tests/candidate-verification.test.ts',
  'tests/event-store.test.ts', 'tests/reliability.test.ts', 'tests/fixtures/multiuser-baseline.ts',
  'tests/fixtures/verified-list.ts', 'scripts/verify-candidate-evidence.ts',
  'scripts/prepare-verification-browser.ts', 'scripts/prepare-verification-browser.ps1', 'Dockerfile'];
function testResult(log) {
  const value = read(prefix + log);
  const count = key => Number(value.match(new RegExp('^# ' + key + ' (\\d+)', 'm'))?.[1]);
  assert.ok(Number.isFinite(count('tests')), log + ' did not finish');
  return {tests: count('tests'), passed: count('pass'), failed: count('fail'), skipped: count('skipped'),
    cancelled: count('cancelled'), durationMs: Number(value.match(/^# duration_ms ([\d.]+)/m)[1]), log};
}
async function main() {
  const full = testResult('full-tests-final.log');
  assert.equal(full.tests, 203);
  assert.equal(full.skipped, 0); assert.equal(full.cancelled, 0);
  const focused = testResult('reuse-focused.log');
  assert.equal(focused.failed, 0);
  assert.match(read(prefix + 'build.log'), /built in/);
  assert.equal(read(prefix + 'script-types-final.log').trim(), '');
  assert.equal(read(prefix + 'types-final.log').trim(), '');
  assert.match(read(prefix + 'prepare-browser.log'), /ready/i);
  const browser = JSON.parse(read(prefix + 'browser/checks.json'));
  assert.equal(browser.participants, 3); assert.equal(browser.physicalCalls, 6);
  assert.deepEqual(browser.promotedRevisions, [1, 3]);
  for (const key of ['failedCandidateBlocked', 'priorProductVisible', 'failedEvidenceConverged',
    'passedChecksWithHonestUnverifiedCoverage', 'reloadAddsNoInference', 'replayAddsNoInference',
    'viewerDenied', 'keyboardDetails']) assert.equal(browser[key], true, key);
  assert.match(read(prefix + 'browser-final.log'), /failedCandidateBlocked/);
  const graph = read(prefix + 'graphify.log').match(/Rebuilt: (\d+) nodes, (\d+) edges, (\d+) communities/);
  assert.ok(graph);
  assert.equal(JSON.parse(read('graphify-out/graph.json')).nodes.length, Number(graph[1]));
  let checkedLocalLinks = 0;
  const missing = [];
  for (const file of documents) for (const match of read(file).matchAll(/!?\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
    const target = match[1].replace(/^<|>$/g, '').split('#')[0];
    if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    checkedLocalLinks++;
    const resolved = path.resolve(root, path.dirname(file), decodeURIComponent(target));
    if (resolved !== path.resolve(root, prefix + 'verification.json') && !fs.existsSync(resolved)) missing.push({file, target});
  }
  assert.deepEqual(missing, []);
  const decisions = [...read('docs/harness/decisions.md').matchAll(/^## (D-\d+)/gm)].map(match => match[1]);
  assert.equal(new Set(decisions).size, decisions.length); assert.ok(decisions.includes('D-0050'));
  const health = await fetch('http://localhost:5173/__cocreate/app-health');
  const client = await fetch('http://localhost:5173/r/f3Up_EmJ0X31-j7RR0XnEP6S');
  assert.equal(health.status, 200); assert.equal(client.status, 200);
  assert.deepEqual(await health.json(), {status: 'ok', service: 'cocreate-app'});
  assert.match(await client.text(), /@vite\/client/);
  const report = {
    recordedAt: new Date().toISOString(),
    scope: 'Step 07 local Windows OS isolation, disposable SQLite, controlled loopback providers and three signed local browser profiles; no live provider, paid inference, hosted accounts, SQL execution, migration or deployment',
    fullTests: full, functionalFocusedTests: focused,
    productionBuild: 'passed', standaloneScriptTypes: 'passed', browserPreparation: 'passed',
    browserReport: 'browser/checks.json', browserRun: 'browser-final.log',
    browserScreenshotsInspected: ['failed-desktop.png', 'retained-product.png', 'desktop.png', 'mobile.png'],
    graphify: {scope: 'AST only; no LLM calls; optional SQL parser unavailable; semantic labels not refreshed',
      nodes: Number(graph[1]), edges: Number(graph[2]), communities: Number(graph[3])},
    documentation: {files: documents, checkedLocalLinks, missing, uniqueDecisionIds: decisions.length},
    localPreview: {health: health.status, client: client.status, url: client.url, refresh: 'local-preview.json'},
    sourceSha256: Object.fromEntries(sources.map(file => [file, crypto.createHash('sha256').update(read(file)).digest('hex')])),
    retainedAttempts: fs.readdirSync(prefix).filter(file => /\.log$/.test(file) && !/^dev\./.test(file)),
    limits: ['Narrow reviewed filter/favorites/alphabetical-sort grammar; arbitrary prose remains unverified',
      'Observed DOM interactions do not prove persistence, all variants, arbitrary semantics or live provider quality',
      'Existing 20-second/512-MiB/one-process/10-CPU-second worker bounds unchanged',
      'Newly browser-covered fixture observations allow 25 seconds; unrelated legacy deadlines unchanged',
      'Executor allowance remains in memory; workflow-wide durable budgeting deferred to Step 08'],
    pending: ['Step 08 unstarted', 'Actual Linux browser/address-space/namespace adversity',
      'Real hosted membership and private Storage/RLS/replacement', 'Both unapplied coordinator migrations and real Postgres contention',
      'Live provider quality and production scale/reference comparison'],
  };
  if (full.failed) report.pending.unshift('Required full test suite has failures; see exact count/log and handoff');
  fs.writeFileSync(path.join(__dirname, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({fullTests: full, focused, graphify: report.graphify,
    documentation: report.documentation, localPreview: report.localPreview}));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
