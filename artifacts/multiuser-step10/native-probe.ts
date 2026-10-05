import fs from 'node:fs';
import { bundleProject, applyOperations } from '../../server/project.js';
import { assertIsolationAvailable } from '../../server/isolation.js';
const rows:unknown[]=[];
for(let repeat=1;repeat<=3;repeat++){
 const started=Date.now();
 try{await assertIsolationAvailable();const compiled=await bundleProject(applyOperations(undefined,[{type:'write',path:'src/App.tsx',content:'export default function App(){return <main>Native timing probe</main>}'}]));rows.push({repeat,passed:true,ms:Date.now()-started,bytes:compiled.javascript.length});}
 catch(error){rows.push({repeat,passed:false,ms:Date.now()-started,error:String(error),cause:(error as Error).cause});}
}
fs.writeFileSync('artifacts/multiuser-step10/native-probe.json',JSON.stringify({scope:'Three real Windows preflight plus isolated minimum React builds; no provider calls, policy and limits unchanged',rows},null,2));
console.log(JSON.stringify(rows));
