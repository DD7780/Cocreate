import test from 'node:test';
import { runScenario, scenarioNames } from './fixtures/multiuser-baseline.js';

// These assertions lock observations, including known gaps, not future acceptance.
// Later fixes should replace gap observations with the accepted outcome and retain evidence history.
for (const scenario of scenarioNames) test(`Current outcome of Step 01 scenario: ${scenario}`, { timeout: 30_000 }, async () => {
  await runScenario(scenario);
});
