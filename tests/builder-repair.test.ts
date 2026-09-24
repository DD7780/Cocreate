import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { generateProjectPlan, projectSchema } from '../server/generator.js';

const plan=(operation:Record<string,unknown>)=>({operations:[operation],summary:'Calculator ready',decisions:[],conflicts:[],specification:{agreed:['Calculator'],proposed:[],questions:[]}});
const response=(value:unknown)=>({output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}],usage:{input_tokens:1,output_tokens:2},status:'completed'});

test('builder schema and planning repair missing or invalid file operations before tool execution',async()=>{
  const operationSchema=(projectSchema as any).properties.operations.items;
  assert.deepEqual(operationSchema.required,['type','path','content']);
  const replies=[
    plan({type:'write',path:'src/App.tsx'}),
    plan({type:'delete',path:'src/main.tsx',content:''}),
    plan({type:'write',path:'src/App.tsx',content:'export default function App(){return <main>Calculator</main>}'}),
  ],bodies:any[]=[];
  const provider=http.createServer(async(request,reply)=>{let raw='';for await(const chunk of request)raw+=chunk;bodies.push(JSON.parse(raw||'{}'));reply.writeHead(200,{'content-type':'application/json'});reply.end(JSON.stringify(response(replies.shift())))});
  await new Promise<void>(resolve=>provider.listen(0,'127.0.0.1',resolve));
  const baseUrl=`http://127.0.0.1:${(provider.address()as {port:number}).port}`;
  try{
    const result=await generateProjectPlan({mode:'openai',apiKey:'test-key',model:'builder-model',baseUrl,apiFormat:'responses',provider:'custom'},[],undefined);
    assert.equal(bodies.length,3,'one schema repair and one project-operation repair should be bounded');
    assert.match(JSON.parse(bodies[2].input).compilerError,/Project operation validation failed:.*src\/main\.tsx/i);
    assert.equal(result.value.operations[0].content,'export default function App(){return <main>Calculator</main>}');
    assert.deepEqual(result.usage,{inputTokens:3,outputTokens:6,rateLimitRemaining:undefined,rateLimitReset:undefined});
  }finally{await new Promise<void>(resolve=>provider.close(()=>resolve()))}
});

test('builder accepts locally recoverable JSON serialization around multiline TSX without a paid retry',async()=>{
  let calls=0;
  const malformed=`{\n  "operations": [{\n    "type": "write",\n    "path": "src/App.tsx",\n    "content": "export default function App(){\n  return <main>Decision Room</main>\n}",\n  }],\n  "summary": "Decision Room ready",\n  "decisions": [],\n  "conflicts": [],\n  "specification": {"agreed": ["Decision Room"], "proposed": [], "questions": [],},\n}`;
  const provider=http.createServer((_request,reply)=>{calls++;reply.writeHead(200,{'content-type':'application/json'});reply.end(JSON.stringify({output:[{content:[{type:'output_text',text:malformed}]}],usage:{input_tokens:2,output_tokens:3},status:'completed'}))});
  await new Promise<void>(resolve=>provider.listen(0,'127.0.0.1',resolve));
  const baseUrl=`http://127.0.0.1:${(provider.address()as {port:number}).port}`;
  try{
    const result=await generateProjectPlan({mode:'openai',apiKey:'test-key',model:'builder-model',baseUrl,apiFormat:'responses',provider:'custom'},[],undefined);
    assert.equal(calls,1);
    assert.match(result.value.operations[0].content||'',/Decision Room/);
  }finally{await new Promise<void>(resolve=>provider.close(()=>resolve()))}
});
