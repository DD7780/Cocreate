import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {runPreviewAssetHelper} from '../server/preview-asset-helper.js';

async function helperFixture(hold = false) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cocreate-helper-test-'));
  const assets = path.join(root, 'assets'), manifest = path.join(root, 'manifest.json');
  fs.mkdirSync(assets);
  const files = {'index.html':'<!doctype html><main>Controlled preview</main>', 'app.js':'document.title="Controlled";', 'app.css':'main{color:blue}', 'cocreate-release.json':'{"sourceHash":"controlled"}'};
  for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(assets,name),text);
  const jwt = 'e30.' + Buffer.from(JSON.stringify({exp:Math.floor(Date.now()/1000)+300,max_file_count_allowed:4})).toString('base64url') + '.fixture';
  const calls: string[] = [], uploaded = new Map<string,string>();
  let failure: unknown, contacted!:()=>void, pid = 0, diagnostics = '';
  const contact = new Promise<void>(resolve=>contacted=resolve);
  const server = http.createServer(async(req,res)=>{
    try {
      assert.equal(req.method,'POST'); assert.equal(req.headers.authorization,'Bearer '+jwt);
      assert.ok(['/pages/assets/check-missing','/pages/assets/upload','/pages/assets/upsert-hashes'].includes(req.url!),'Only asset requests are permitted');
      calls.push(req.url!); contacted();
      let body='';for await(const chunk of req){body+=chunk;assert.ok(body.length<16384);}
      const value=JSON.parse(body);
      if(hold)return;
      let result:unknown = null;
      if(req.url==='/pages/assets/check-missing') {assert.equal(value.hashes.length,4);result=value.hashes;}
      else if(req.url==='/pages/assets/upload') for(const item of value){assert.equal(item.base64,true);assert.equal(typeof item.metadata.contentType,'string');uploaded.set(item.key,Buffer.from(item.value,'base64').toString());}
      else assert.equal(value.hashes.length,4);
      res.setHeader('content-type','application/json');res.end(JSON.stringify({success:true,result,errors:[],messages:[]}));
    }catch(error){failure=error;res.writeHead(500).end();}
  });
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin=`http://127.0.0.1:${(server.address() as any).port}`;
  const launch = ((command:string,args:string[],options:any)=>{
    assert.equal(command,process.execPath);
    assert.deepEqual(args.slice(2,5),['pages','project','upload']);
    assert.equal(options.env.CLOUDFLARE_API_BASE_URL,undefined);
    assert.equal(options.env.CLOUDFLARE_API_TOKEN,jwt);
    assert.equal(options.env.OPENAI_API_KEY,undefined);
    assert.equal(options.env.WRANGLER_SEND_METRICS,'false');
    const child=spawn(command,args,{...options,env:{...options.env,CLOUDFLARE_API_BASE_URL:origin}});pid=child.pid!;
    child.stdout!.on('data',chunk=>diagnostics=(diagnostics+chunk).slice(-8000));child.stderr!.on('data',chunk=>diagnostics=(diagnostics+chunk).slice(-8000));return child;
  }) as typeof spawn;
  return {root,assets,manifest,jwt,files,calls,uploaded,launch,contact,get pid(){return pid;},get failure(){return failure;},get diagnostics(){return diagnostics.replaceAll(jwt,'[synthetic token]');},async close(){server.closeAllConnections();await new Promise<void>(resolve=>server.close(()=>resolve()));fs.rmSync(root,{recursive:true,force:true});}};
}

test('actual pinned asset-only helper uploads exact frozen bytes and writes its real provider manifest without creating a deployment',async()=>{
  const f=await helperFixture();try{
    await runPreviewAssetHelper(f.root,f.assets,f.manifest,f.jwt,new AbortController().signal,f.launch).catch(error=>{throw Error(error.message+' '+f.diagnostics);});
    assert.equal(f.failure,undefined);
    const manifest=JSON.parse(fs.readFileSync(f.manifest,'utf8'));
    assert.deepEqual(Object.keys(manifest).sort(),Object.keys(f.files).map(x=>'/'+x).sort());
    for(const [name,text] of Object.entries(f.files)){assert.match(manifest['/'+name],/^[a-f0-9]{32,64}$/);assert.equal(f.uploaded.get(manifest['/'+name]),text);}
    assert.equal(f.calls.filter(x=>x.endsWith('check-missing')).length,1);
    assert.equal(f.calls.filter(x=>x.endsWith('upsert-hashes')).length,1);
    assert.equal(f.uploaded.size,4);
  }finally{await f.close();}
});

test('actual asset helper cancellation awaits child removal and never advances to manifest or deployment creation',async()=>{
  const f=await helperFixture(true),controller=new AbortController();let running:Promise<void>|undefined;try{
    running=runPreviewAssetHelper(f.root,f.assets,f.manifest,f.jwt,controller.signal,f.launch);
    const failed=assert.rejects(running,/not confirmed/);
    await Promise.race([f.contact,new Promise<never>((_,reject)=>setTimeout(()=>reject(Error('Controlled asset contact timed out '+f.diagnostics)),10000).unref())]);
    controller.abort();await failed;
    assert.equal(f.failure,undefined);assert.equal(fs.existsSync(f.manifest),false);
    assert.throws(()=>process.kill(f.pid,0));assert.deepEqual(f.calls,['/pages/assets/check-missing']);
  }finally{controller.abort();await running?.catch(()=>undefined);await f.close();}
});
