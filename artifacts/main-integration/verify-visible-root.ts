import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const checkout=process.cwd(),fixture=fs.mkdtempSync(path.join(os.tmpdir(),'cocreate-main-fixture-'));
fs.cpSync(path.join(checkout,'dist'),path.join(fixture,'dist'),{recursive:true});
fs.mkdirSync(path.join(fixture,'.runtime'));
fs.symlinkSync(path.join(checkout,'node_modules'),path.join(fixture,'node_modules'),'junction');
fs.symlinkSync(path.join(checkout,'.runtime/browser'),path.join(fixture,'.runtime/browser'),'junction');
const output=path.join(checkout,'artifacts/main-integration/browser');
process.env.COCREATE_INTEGRATION_OUTPUT=output;
try{
 process.chdir(fixture);
 await import(pathToFileURL(path.join(checkout,'scripts/verify-harness-integration.ts')).href);
}finally{
 process.chdir(checkout);
 if(path.dirname(path.resolve(fixture))!==path.resolve(os.tmpdir())||!/^cocreate-main-fixture-[A-Za-z0-9]+$/.test(path.basename(fixture)))throw Error('Unsafe fixture cleanup');
 fs.rmSync(fixture,{recursive:true,force:true,maxRetries:6,retryDelay:200});
}
