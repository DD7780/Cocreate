import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { runScenario, scenarioNames } from '../tests/fixtures/multiuser-baseline.js';

process.env.COCREATE_AUTH_MODE = 'local';
const output = path.resolve('artifacts/multiuser-step01');
fs.mkdirSync(output, { recursive: true });
const trials = [];
for (let repeat = 0; repeat < 3; repeat++) {
  for (const scenario of scenarioNames) trials.push({ repeat: repeat + 1, ...await runScenario(scenario) });
}
const report = { recordedAt: new Date().toISOString(), scope: 'Local RoomManager, SQLite and loopback controlled provider; no hosted/live provider',
  measurements: 'Monotonic capture-to-provider queue and provider-handler elapsed ms; physical-attempt ledger start-to-end wall-clock ms (dispatch persistence and response read included); last durable acceptance-to-product.promoted wall-clock ms, a preview-availability proxy rather than browser paint. Controlled delays/fixture overhead included; not production latency or quality.',
  privacy: 'Bounded synthetic workload; only scenario names, numeric timing/counts and observation flags; no prompts, source bodies, identities or secrets.',
  workload: { repeats: 3, slowFirstInterpreterMs: 80, collectionMs: 20, maxWaitMs: 100, continuousArrivals: 5,
    candidateRelease: 'Barrier after next accepted steering; final barrier released once arrivals stop', timeoutMs: 10_000 },
  sourceHashes: Object.fromEntries(['server/rooms.ts','server/generator.ts','server/requirements.ts','server/event-store.ts',
    'server/coordinator.ts','server/tool-registry.ts','server/providers.ts','server/supabase-platform.ts',
    'tests/fixtures/multiuser-baseline.ts','scripts/multiuser-baseline.ts','scripts/verify-reliability.ts']
    .map(file => [file, createHash('sha256').update(fs.readFileSync(file)).digest('hex')])), trials };
fs.writeFileSync(path.join(output, 'baseline.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ scenarios: scenarioNames.length, trials: trials.length, report: 'artifacts/multiuser-step01/baseline.json' }));
