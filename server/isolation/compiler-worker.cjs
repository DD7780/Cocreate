// This trusted worker reads a bounded input and compiles strings. Candidate code is never evaluated.
const fs = require('node:fs');
const path = require('node:path');
globalThis.self = globalThis;
(async () => {
 const raw=fs.readFileSync(process.argv[2]);
 if(raw.length>4*1024*1024)throw Error('Compiler input exceeded its bound.');
 const input=JSON.parse(raw.toString('utf8'));
 if(input.operation==='ready'){console.log(JSON.stringify({ok:true,result:{policy:'isolated-compile-v1'}}));return;}
 if(input.operation==='probe') {
  const result={environment:Object.keys(process.env),pid:process.pid};
  const attempt=(key,action)=>{try{result[key]={allowed:true,value:action()}}catch(error){result[key]={allowed:false,code:error.code}}};
  attempt('readOutside',()=>fs.readFileSync(input.outside,'utf8'));
  attempt('writeOutside',()=>fs.writeFileSync(input.outside,'changed'));
  if(!input.osOnly)attempt('spawn',()=>{const child=require('node:child_process').spawnSync(process.execPath,['-e','process.exit(0)'],{timeout:250});if(child.error)throw child.error;return child.status===0?'started':'denied'});
  if(!input.osOnly&&process.permission)attempt('worker',()=>{const worker=new(require('node:worker_threads').Worker)('0',{eval:true});worker.terminate();return 'created'});
  const net=require('node:net');
  result.network=await new Promise(resolve=>{const socket=net.connect(input.port,'127.0.0.1');socket.setTimeout(500);socket.once('connect',()=>{socket.destroy();resolve({allowed:true})});socket.once('error',error=>resolve({allowed:false,code:error.code}));socket.once('timeout',()=>{socket.destroy();resolve({allowed:false,code:'timeout'})})});
  console.log(JSON.stringify({ok:true,result}));return;
 }
 if(input.operation==='spin'){while(true){} }
 if(input.operation==='flood'){while(true)await new Promise(resolve=>process.stdout.write('x'.repeat(64*1024),resolve))}
 if(input.operation==='allocate'){const retained=[];while(true){const buffer=Buffer.alloc(16*1024*1024,1);retained.push(buffer)} }
 if(input.operation!=='compile')throw Error('Unknown isolated operation.');
 const esbuild=require('./esbuild.cjs');
 await esbuild.initialize({wasmModule:await WebAssembly.compile(fs.readFileSync(path.join(process.argv[3],'esbuild.wasm'))),worker:false});
 const sources=new Map(input.files.map(file=>[file.path,file.content]));
 const dependencies=new Map(input.dependencies.map(file=>[file.id,file]));
 const resolveSource=(importer,specifier)=>{
  const base=path.posix.normalize(path.posix.join(path.posix.dirname(importer),specifier));
  if(!base.startsWith('src/'))throw Error('Import leaves the candidate workspace.');
  return [base,...['.ts','.tsx','.js','.jsx','.css','.json'].map(ext=>base+ext),...['.ts','.tsx','.js','.jsx'].map(ext=>path.posix.join(base,'index'+ext))].find(candidate=>sources.has(candidate));
 };
 const plugin={name:'isolated-virtual-project',setup(api){
  api.onResolve({filter:/.*/},args=>{
   if(args.kind==='entry-point')return{path:'src/main.tsx',namespace:'project'};
   if(args.namespace==='dependency') {
    const id=dependencies.get(args.importer)?.imports[args.path];
    if(!id)throw Error('Unresolved trusted dependency.');return{path:id,namespace:'dependency'};
   }
   if(args.namespace==='project'&&args.path.startsWith('.')) {
    const resolved=resolveSource(args.importer,args.path);
    if(!resolved)throw Error('Candidate import is unavailable: '+args.path.slice(0,100));return{path:resolved,namespace:'project'};
   }
   if(args.namespace==='project'&&Object.hasOwn(input.roots,args.path))return{path:input.roots[args.path],namespace:'dependency'};
   throw Error('Dependency is not approved: '+args.path.slice(0,100));
  });
  api.onLoad({filter:/.*/,namespace:'project'},args=>({contents:sources.get(args.path),loader:path.posix.extname(args.path).slice(1)}));
  api.onLoad({filter:/.*/,namespace:'dependency'},args=>({contents:dependencies.get(args.path).content,loader:'js'}));
 }};
 try {
  const result=await esbuild.build({entryPoints:['entry'],plugins:[plugin],define:{'process.env.NODE_ENV':'"production"'},jsx:'automatic',bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',logLevel:'silent',outdir:'out'});
  const javascript=result.outputFiles.find(file=>file.path.endsWith('.js'))?.text,css=result.outputFiles.find(file=>file.path.endsWith('.css'))?.text||'';
  if(!javascript)throw Error('Candidate produced no browser bundle.');
  console.log(JSON.stringify({ok:true,result:{javascript,css}}));
 }catch(error){console.log(JSON.stringify({ok:false,error:(error.errors?.map(item=>item.text).join('; ')||error.message).slice(0,1000)}))}
 esbuild.stop();
})().catch(error=>{console.log(JSON.stringify({ok:false,error:String(error.message).slice(0,1000)}));process.exitCode=1});
