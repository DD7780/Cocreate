import http from 'node:http';
import {createCoCreateServer} from '../../server/index.js';
import {verifiedList} from './verified-list.js';

export const typoSource='Create a website for my resturant in neubrutlist style. Momo should be shown as the hero product of the resturant.';
export async function provenanceFixture(dataDir:string,port=0,serveClient=false,submissionMode:'direct'|'intent'='intent') {
  const calls:Array<{purpose:string;input:any}>=[];
  const control={fabricated:false,emptyPrompt:false,failBuild:false,holdBuilder:false};
  let releaseBuilder:()=>void=()=>{};
  const release=()=>{control.holdBuilder=false;releaseBuilder();};
  const provider=http.createServer(async(req,res)=>{
    res.setHeader('content-type','application/json');
    if(req.method==='GET'){res.end(JSON.stringify({data:[{id:'fixture',context_length:64000}]}));return;}
    let raw='';for await(const chunk of req)raw+=chunk;
    const body=JSON.parse(raw),input=JSON.parse(body.input),direct=body.text.format.schema.required.includes('prompt'),personal=direct || body.text.format.schema.required.includes('goals');
    calls.push({purpose:personal?'interpretation':'builder',input});
    if (!personal && control.holdBuilder) await new Promise<void>(resolve=>{releaseBuilder=resolve;});
    const sources=input.submittedSources||[],text=sources.map((source:any)=>source.text).join(' ');
    const descriptions=text.includes('resturant')?['Create a restaurant website in a neubrutalist style.','Show Momo as the hero product of the restaurant.']:[text.trim()];
    const value=direct ? {prompt:control.emptyPrompt?'':input.submittedWriting.join(' ').replaceAll('resturant','restaurant')} : personal?{goals:descriptions,features:[],design:[],constraints:[],questions:[],additions:[],modifications:[],withdrawals:[],classification:'explicit_request',affectedRequirementIds:[],
      sourcePassages:[text.replaceAll('resturant','restaurant')],intents:descriptions.map(description=>({text:description,category:'goal',classification:'explicit_request',rationale:'Controlled clarification of spelling',
        sourcePassage:text.replaceAll('resturant','restaurant'),sourceRefs:control.fabricated?['fabricated-reference']:sources.map((source:any)=>source.id),affectedRequirementIds:[]}))}:
      {operations:[{type:'write',path:control.failBuild?'../blocked.ts':'src/App.tsx',content:verifiedList.replace('<h1>Catalog</h1>','<h1>Momo House</h1><p>Momo — our hero product</p>')},{type:'write',path:'src/styles.css',content:'body{margin:0;background:#fff8dd;color:#191919;font-family:system-ui}main{margin:30px;padding:30px;border:4px solid;box-shadow:8px 8px #191919}h1{font-size:48px;background:#fdcf3c;border:3px solid;padding:16px}button,input{font:inherit;padding:10px;border:3px solid;margin:8px}button{background:#f9a6dc;box-shadow:3px 3px #191919}'}],summary:'Momo restaurant fixture',decisions:[],conflicts:[],specification:{agreed:[],proposed:[],questions:[]}};
    res.end(JSON.stringify({output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}],status:'completed',usage:{input_tokens:50,output_tokens:50}}));
  });
  await new Promise<void>(resolve=>provider.listen(0,'127.0.0.1',resolve));
  const baseUrl=`http://127.0.0.1:${(provider.address() as {port:number}).port}`;
  const app=await createCoCreateServer({submissionMode,baseUrl,dataDir,port,host:'127.0.0.1',serveClient,sessionSecret:'local-provenance-fixture-only',encryptionSecret:'local-provenance-fixture-only',debounceMs:10,buildDebounceMs:30,buildCooldownMs:0});
  const room=app.manager.get('provenance-fixture')||app.manager.create('provenance-fixture');
  const connection=(await app.manager.saveConnection(room,{name:'LOCAL FIXTURE — no paid inference',provider:'custom',baseUrl,apiFormat:'responses',apiKey:'synthetic-never-valid'})).id;
  room.ai.connections!.find(item=>item.id===connection)!.checks.fixture={reachable:{status:'passed'},text:{status:'passed'},personal:{status:'passed'},builder:{status:'passed'}};
  await app.manager.assignAI(room,{connectionId:connection,model:'fixture'},{connectionId:connection,model:'fixture'});
  const info=await app.start();
  return {app,room,calls,control,release,info,close:async()=>{release();await app.stop();provider.closeAllConnections();await new Promise<void>(resolve=>provider.close(()=>resolve()));}};
}
