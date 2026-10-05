import { runScenario } from '../../tests/fixtures/multiuser-baseline.js';

console.log(JSON.stringify(await runScenario('continuous-arrivals'), null, 2));
