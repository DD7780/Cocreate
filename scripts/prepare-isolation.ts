import { prepareIsolation, assertIsolationAvailable, isolationPolicy } from '../server/isolation.js';
await prepareIsolation();
if(!process.argv.includes('--files-only'))await assertIsolationAvailable();
console.log(JSON.stringify({policy:isolationPolicy.version,platform:process.platform,scope:process.argv.includes('--files-only')?'Trusted files prepared; kernel boundary not exercised':'Actual OS boundary preflight passed; no inference'}));
