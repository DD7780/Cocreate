import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';
// Operator temporarily materializes HEAD:server/rooms.ts here; no live provider or app room.
const {RoomManager}=await import('../../server/.step08-before.js');
const {generateText}=await import('../../server/providers.js');
let calls=0;
const server=http.createServer(async(req,res)=>{for await(const _ of req){}calls++;res.setHeader('content-type','application/json');res.end(JSON.stringify({output_text:'OK',usage:{input_tokens:1,output_tokens:1}}));});
await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'budget-before-'));
const options={dataDir:dir,debounceMs:10,encryptionSecret:'synthetic'};
let manager=new RoomManager(options),room=manager.create('before');
try {
  for(let i=0;i<26;i++)await (manager as any).tracked(room,{purpose:'interpretation',provider:'custom',submissionId:`submission-${i}`},()=>generateText({provider:'custom',baseUrl:`http://127.0.0.1:${(server.address() as any).port}`,apiKey:'synthetic',apiFormat:'responses'},{model:'fixture',instructions:'Test',input:'Test',maxOutputTokens:64}));
  assert.equal(calls,26);
  (room as any).executionBudget={calls:23,reservedUsd:0};manager.save(room);manager.shutdown();manager=new RoomManager(options);room=manager.get('before')!;
  assert.equal(room.executionBudget,undefined);
  const result={base:'5784de627aaccb64a0a989a2f43b12e331c93dfe',controlledInterpretationAttempts:26,ceilingEnforced:false,budgetRestored:false,paidCalls:0};
  fs.writeFileSync('artifacts/multiuser-step08/before.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{manager.shutdown();server.closeAllConnections();server.close();const target=path.resolve(dir);assert.equal(path.dirname(target),path.resolve(os.tmpdir()));assert.match(path.basename(target),/^budget-before-/);fs.rmSync(target,{recursive:true,force:true});}
