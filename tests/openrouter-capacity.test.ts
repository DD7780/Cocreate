import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {callOpenAI, generateProjectPlan} from '../server/generator.js';
import {generateText, withProviderAccounting, ProviderError} from '../server/providers.js';
import {recoverProjectPlan} from '../server/build-recovery.js';
import {applyOperations} from '../server/project.js';

const schema = {type:'object',required:['value'],properties:{value:{type:'string'}},additionalProperties:false};
const plan = {operations:[{type:'write',path:'src/App.tsx',content:'export default function App(){return <main>Fixture</main>}'}],summary:'Fixture',decisions:[],conflicts:[],specification:{agreed:[],proposed:[],questions:[]}};

test('OpenRouter interpretation, structured repair, builder and recovery defer capacity to the provider', async () => {
  const bodies:any[]=[];
  const fixture=http.createServer(async(req,res)=>{
    let raw='';for await(const chunk of req)raw+=chunk;
    const body=JSON.parse(raw);bodies.push(body);
    const format=body.response_format?.json_schema.schema;
    const value=format?.required?.includes('tasks')?{tasks:[{title:'Entry',path:'src/App.tsx',instruction:'Write entry'}]}:format?.required?.includes('operations')?plan:{value:'ok'};
    res.setHeader('content-type','application/json');
    res.end(JSON.stringify({choices:[{message:{content:JSON.stringify(value)},finish_reason:bodies.length===1?'length':'stop'}],usage:{prompt_tokens:12,completion_tokens:30,completion_tokens_details:{reasoning_tokens:20},cost:.001}}));
  });
  await new Promise<void>(resolve=>fixture.listen(0,'127.0.0.1',resolve));
  const baseUrl=`http://127.0.0.1:${(fixture.address() as {port:number}).port}`;
  const provider={provider:'openrouter' as const,baseUrl,apiKey:'synthetic',apiFormat:'chat-completions' as const};
  const records:any[]=[];
  try {
    const result=await withProviderAccounting({workspaceId:'capacity',purpose:'interpretation',provider:'openrouter',model:'fixture',configurationVersion:'test',maxInputTokens:1,record:entry=>{records.push(entry);}},()=>callOpenAI<{value:string}>('synthetic','fixture','Interpret','x'.repeat(150_001),schema,baseUrl,'chat-completions','openrouter',undefined,2400));
    assert.equal(result.value.value,'ok');assert.equal(result.usage.outputTokens,60);
    assert.equal(bodies.length,2,'truncation still uses exactly one structured repair');
    assert.equal(records.filter(entry=>entry.outcome==='dispatching').length,2);
    assert.equal(records.at(-1).providerCostUsd,.001);
    const files=applyOperations(undefined,[{type:'write',path:'src/App.tsx',content:'// '+ 'x'.repeat(38_000)}]);
    await generateProjectPlan({...provider,mode:'openai',model:'fixture',maxOutputTokens:8000},[],files);
    assert.deepEqual(JSON.parse(bodies[2].messages[1].content).currentProject.find((file:{path:string})=>file.path==='src/App.tsx'),files.find(file=>file.path==='src/App.tsx'));
    await recoverProjectPlan({provider,model:'fixture',maxOutputTokens:8000,instructions:'Build',schema:{type:'object',required:['operations','summary','decisions','conflicts','specification'],properties:{}},requirements:[],currentFiles:files});
    assert.equal(bodies.length,5,'recovery remains one planner and one planned file');
    for(const body of bodies){assert.equal('max_tokens' in body,false);assert.equal('max_completion_tokens' in body,false);assert.equal('max_output_tokens' in body,false);}
    assert.equal(JSON.parse(bodies[4].messages[1].content).currentProject.find((file:{path:string})=>file.path==='src/App.tsx').content,files.find(file=>file.path==='src/App.tsx')!.content);
    // Explicit small setup probes retain their operator-selected bound.
    await generateText(provider,{model:'fixture',instructions:'Probe',input:'',maxOutputTokens:64});
    assert.equal(bodies.at(-1).max_tokens,64);
  } finally {fixture.closeAllConnections();await new Promise<void>(resolve=>fixture.close(()=>resolve()));}
});

test('provider context rejection stays distinct from truncation and triggers no repair', async()=>{
  const originalFetch=globalThis.fetch;let calls=0;
  globalThis.fetch=async()=>{calls++;return new Response(JSON.stringify({error:{code:'context_length_exceeded',message:'maximum context length exceeded'}}),{status:400,headers:{'content-type':'application/json'}});};
  try {await assert.rejects(()=>callOpenAI('synthetic','fixture','Build','large',schema,'https://openrouter.ai/api/v1','chat-completions','openrouter'),error=>error instanceof ProviderError&&error.kind==='context_limit');assert.equal(calls,1);}
  finally{globalThis.fetch=originalFetch;}
});
