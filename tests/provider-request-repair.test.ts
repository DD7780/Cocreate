import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {generateStructured, generateText, ProviderError, ProviderAccountingError, withProviderAccounting} from '../server/providers.js';
import type {ProviderRequestRecord} from '../shared/types.js';
import {reqSchema} from '../server/generator.js';

const schema={type:'object',additionalProperties:false,required:['value'],properties:{value:{type:'string'}}};
async function fixture(reply:(res:http.ServerResponse,attempt:number,body:any)=>void){
  let attempts=0;
  const server=http.createServer(async(req,res)=>{const chunks:Buffer[]=[];for await(const chunk of req)chunks.push(Buffer.from(chunk));reply(res,++attempts,JSON.parse(Buffer.concat(chunks).toString()||'{}'))});
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  return {config:{provider:'openrouter' as const,baseUrl:`http://127.0.0.1:${(server.address() as any).port}`,apiKey:'synthetic'},attempts:()=>attempts,close:()=>new Promise<void>(resolve=>server.close(()=>resolve()))};
}
test('generic HTTP 400 makes one physical attempt and one final accounting record',async()=>{
  const f=await fixture(res=>{res.writeHead(400,{'Content-Type':'application/json','x-request-id':'req_synthetic'});res.end(JSON.stringify({error:{code:400,message:'Request contains an invalid argument.'}}))});
  const records:ProviderRequestRecord[]=[];
  try{
    await assert.rejects(withProviderAccounting({workspaceId:'synthetic',purpose:'interpretation',provider:'openrouter',model:'google/gemini-3.7-flash',configurationVersion:'test',record:entry=>{records.push(entry)}},()=>generateStructured(f.config,{model:'google/gemini-3.7-flash',instructions:'Return JSON.',input:'Synthetic request.',schema})),error=>error instanceof ProviderError&&!error.retryable);
    assert.equal(f.attempts(),1,'a rejected argument is never a transport retry');
    assert.equal(records.filter(entry=>entry.outcome==='dispatching').length,1);
    assert.equal(records.filter(entry=>entry.outcome==='failed').length,1);
    assert.equal(new Set(records.map(entry=>entry.callId)).size,1);
  }finally{await f.close()}
});

test('the selected OpenRouter interpretation route retains its full strict schema and reasoning configuration on rejection',async()=>{
  let body:any;
  const f=await fixture((res,_attempt,request)=>{body=request;res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({error:{code:400,message:'Request contains an invalid argument.'}}))});
  try{
    await assert.rejects(generateStructured({...f.config,reasoningConfig:{effort:'low'}},{model:'google/gemini-3.7-flash',instructions:'Synthetic interpretation.',input:'Synthetic caller-only steering.',schema:reqSchema,maxOutputTokens:12000}),error=>error instanceof ProviderError&&error.kind==='invalid_request');
    assert.equal(f.attempts(),1);assert.equal(body.model,'google/gemini-3.7-flash');
    assert.deepEqual(body.response_format.json_schema.schema,reqSchema);assert.equal(body.response_format.json_schema.strict,true);
    assert.deepEqual(body.reasoning,{effort:'low'});assert.deepEqual(body.provider,{require_parameters:true});assert.equal(body.max_tokens,12000);
    const check=(node:any)=>{
      if(node.type==='object'){assert.equal(node.additionalProperties,false);assert.deepEqual([...node.required].sort(),Object.keys(node.properties).sort());Object.values(node.properties).forEach(check)}
      if(node.items)check(node.items);
    };check(body.response_format.json_schema.schema);
  }finally{await f.close()}
});

test('typed context rejection is permanent and does not trust private provider wording',async()=>{
  const f=await fixture(res=>{res.writeHead(400);res.end(JSON.stringify({error:{message:'synthetic private content',metadata:{error_type:'context_length_exceeded'}}}))});
  try{await assert.rejects(generateText(f.config,{model:'synthetic',instructions:'',input:''}),error=>error instanceof ProviderError&&error.kind==='context_limit'&&!error.retryable);assert.equal(f.attempts(),1)}finally{await f.close()}
});

test('genuine transient HTTP errors retain three separately accounted bounded attempts',async()=>{
  const f=await fixture((res,attempt)=>{res.writeHead(attempt<3?503:200,{'Content-Type':'application/json','Retry-After':'0'});res.end(JSON.stringify(attempt<3?{error:{message:'Temporary outage'}}:{choices:[{message:{content:'ok'},finish_reason:'stop'}]}))});
  const records:ProviderRequestRecord[]=[];
  try{
    const result=await withProviderAccounting({workspaceId:'synthetic',purpose:'interpretation',provider:'openrouter',configurationVersion:'test',record:entry=>{records.push(entry)}},()=>generateText(f.config,{model:'synthetic',instructions:'',input:'synthetic'}));
    assert.equal(result.text,'ok');assert.equal(f.attempts(),3);
    assert.equal(new Set(records.filter(entry=>entry.outcome==='dispatching').map(entry=>entry.callId)).size,3);
  }finally{await f.close()}
});

for(const status of [200,400])test(`HTTP ${status} API rejection records only bounded safe diagnostics and never repairs model output`,async()=>{
  const privateText='synthetic private document content',secret='sk-synthetic-credential';
  const f=await fixture(res=>{res.writeHead(status,{'Content-Type':'application/json','x-request-id':'req_bounded'});res.end(JSON.stringify({error:{code:400,message:`Request contains an invalid argument. ${privateText} ${secret}`,param:secret,metadata:{error_type:'invalid_request',raw:JSON.stringify({error:{status:'INVALID_ARGUMENT',message:privateText,details:[{fieldViolations:[{field:'generationConfig.responseSchema.properties.intents',description:privateText},{field:secret},{field:'messages[0].content'}]}]}})}}}))});
  const records:ProviderRequestRecord[]=[];
  try{
    let failure:ProviderError|undefined;
    try{await withProviderAccounting({workspaceId:'synthetic',purpose:'interpretation',provider:'openrouter',configurationVersion:'test',record:entry=>{records.push(entry)}},()=>generateStructured(f.config,{model:'google/gemini-3.7-flash',instructions:'Do not reveal input',input:privateText,schema}))}catch(error){assert.ok(error instanceof ProviderError);failure=error}
    assert.equal(f.attempts(),1);assert.equal(failure?.kind,'invalid_request');
    assert.deepEqual(failure?.diagnostics,{httpStatus:status,requestId:'req_bounded',type:'invalid_request',code:'INVALID_ARGUMENT',parameterPaths:['generationConfig.responseSchema.properties.intents','messages[0].content']});
    assert.deepEqual(records.at(-1)?.diagnostics,failure?.diagnostics);
    assert.doesNotMatch(JSON.stringify({records,message:failure?.message}),new RegExp(privateText+'|'+secret));
  }finally{await f.close()}
});

test('a pre-cancelled request dispatches no paid attempt',async()=>{
  const controller=new AbortController();controller.abort();const f=await fixture(res=>res.end('{}'));const records:ProviderRequestRecord[]=[];
  try{await assert.rejects(withProviderAccounting({workspaceId:'synthetic',purpose:'interpretation',provider:'openrouter',configurationVersion:'test',record:entry=>{records.push(entry)}},()=>generateText(f.config,{model:'synthetic',instructions:'',input:'',signal:controller.signal})),error=>error instanceof ProviderError&&error.kind==='cancelled');assert.equal(f.attempts(),0);assert.equal(records.length,0)}finally{await f.close()}
});

test('a terminal accounting failure never becomes another physical provider call',async()=>{
  let failed=false;const records:ProviderRequestRecord[]=[];
  const f=await fixture(res=>res.end(JSON.stringify({choices:[{message:{content:'ok'},finish_reason:'stop'}]})));
  try{
    await assert.rejects(withProviderAccounting({workspaceId:'synthetic',purpose:'interpretation',provider:'openrouter',configurationVersion:'test',record:entry=>{
      records.push(entry);if(entry.outcome!=='dispatching'&&!failed){failed=true;throw new Error('Synthetic persistence failure')}
    }},()=>generateText(f.config,{model:'synthetic',instructions:'',input:''})),ProviderAccountingError);
    assert.equal(f.attempts(),1);assert.equal(records.length,2);assert.equal(new Set(records.map(entry=>entry.callId)).size,1);
  }finally{await f.close()}
});
