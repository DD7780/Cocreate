import { assertVerificationBrowserAvailable, browserExecutable } from '../server/isolation/browser.js';

await assertVerificationBrowserAvailable();
console.log(JSON.stringify({executable: browserExecutable(), isolation: 'os', ready: true}));
