import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import http from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {productEnvironment, canonicalProductEnvironment} from '../shared/product-environment.js';
import {readBrowserStorage, writeBrowserStorage, removeBrowserStorage, clearProjectSessionCache} from '../src/browser-storage.js';
import {previewMessageKind, previewInitType} from '../shared/preview-protocol.js';
import {resolveSupabaseAuthConfig} from '../src/auth-config.js';
import {EventStore} from '../server/event-store.js';
import {previewDocument} from '../server/preview.js';
import {createTwoGuysOneCanvasServer} from '../server/index.js';
import {createSession} from '../server/auth.js';
import {applyOperations, infrastructureFiles} from '../server/project.js';
import {generateStructured} from '../server/providers.js';
import {invitationEmailSenderFromEnv} from '../server/invitation-email.js';

function storage(): Storage {
  const result: Record<string, unknown> = {};
  Object.defineProperties(result, {
    getItem: {value: (key: string) => result[key] ?? null},
    setItem: {value: (key: string, value: string) => {result[key]=String(value)}},
    removeItem: {value: (key: string) => {delete result[key]}},
    clear: {value: () => {for(const key of Object.keys(result))delete result[key]}},
  });
  return result as unknown as Storage;
}
function temporary() {return fs.mkdtempSync(path.join(os.tmpdir(),'2guys1canvas-naming-'))}
function removeTemporary(dir:string){assert.equal(path.dirname(dir),path.resolve(os.tmpdir()));fs.rmSync(dir,{recursive:true,force:true})}

test('canonical env values take precedence, including explicit empty values; old deployment inputs still work',()=>{
  const env={COCREATE_AUTH_MODE:'local',TWOGUYS1CANVAS_AUTH_MODE:'supabase',COCREATE_EMAIL_FROM:'old@sender.test',TWOGUYS1CANVAS_EMAIL_FROM:''};
  assert.equal(productEnvironment(env,'TWOGUYS1CANVAS_AUTH_MODE'),'supabase');
  assert.equal(productEnvironment(env,'TWOGUYS1CANVAS_EMAIL_FROM'),'');
  assert.equal(productEnvironment({COCREATE_AUTH_MODE:'local'},'TWOGUYS1CANVAS_AUTH_MODE'),'local');
  const publicEnv={VITE_SUPABASE_URL:'https://example.supabase.co',VITE_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test',VITE_COCREATE_APP_ORIGIN:'https://2guys1canvas.com'};
  assert.equal(resolveSupabaseAuthConfig(publicEnv).config?.appOrigin,'https://2guys1canvas.com');
  assert.equal(canonicalProductEnvironment(publicEnv).VITE_TWOGUYS1CANVAS_APP_ORIGIN,'https://2guys1canvas.com');
  assert.equal(publicEnv.VITE_COCREATE_APP_ORIGIN,'https://2guys1canvas.com','the original configuration is not mutated');
});

test('legacy browser sessions, preview data and uncertain intent identities survive mixed-version reads/writes',()=>{
  const store=storage();
  for(const suffix of ['session-room','product-storage-room','intent-command-room-alice','auth-return','name']){
    const old='cocreate-'+suffix,current='2guys1canvas-'+suffix;
    store.setItem(old,'original-request-id');assert.equal(readBrowserStorage(store,current),'original-request-id');
    writeBrowserStorage(store,current,'same-request-id');writeBrowserStorage(store,current,'same-request-id');
    assert.equal(store.getItem(old),'same-request-id');assert.equal(store.getItem(current),'same-request-id');
    store.setItem(old,'update-from-old-tab');assert.equal(readBrowserStorage(store,current),'update-from-old-tab');
    removeBrowserStorage(store,current);assert.equal(store.getItem(old),null);assert.equal(store.getItem(current),null);
  }
  assert.throws(()=>readBrowserStorage(store,'another-app-key'),/namespace/);
});

test('sign-out clears both project/session namespaces while preserving unrelated user data',()=>{
  const local=storage(),session=storage();
  for(const key of ['cocreate-session-a','2guys1canvas-session-a','cocreate-product-storage-a','2guys1canvas-product-storage-a'])local.setItem(key,'synthetic');
  local.setItem('user-own-document','CoCreate is user-authored content');session.setItem('cocreate-auth-return','/projects/a');session.setItem('2guys1canvas-auth-return','/projects/a');
  clearProjectSessionCache(local,session);assert.deepEqual(Object.keys(local),['user-own-document']);assert.equal(Object.keys(session).length,0);
});

test('fresh SQLite uses the canonical name; existing legacy events, MIME receipts and authored content reopen unchanged',()=>{
  const dir=temporary(),fresh=new EventStore(dir);assert.equal(path.basename(fresh.file),'2guys1canvas.sqlite');fresh.close();
  const legacyDir=temporary(),legacy=path.join(legacyDir,'cocreate.sqlite');new DatabaseSync(legacy).close();
  try{
    let store=new EventStore(legacyDir);assert.equal(store.file,legacy);
    const state={text:'CoCreate is my historical project title',requestId:'permanent-id'};
    store.saveWorkspaceSnapshot('room',state);const eventId=store.eventsForWorkspace('room')[0].eventId;store.close();
    const seed=new DatabaseSync(legacy);seed.exec("DELETE FROM workspace_state; UPDATE artifacts SET mime_type='application/vnd.cocreate.workspace+json' WHERE mime_type='application/vnd.2guys1canvas.workspace+json'");seed.close();
    store=new EventStore(legacyDir);assert.deepEqual(store.readWorkspaceSnapshot('room'),state);assert.equal(store.eventsForWorkspace('room')[0].eventId,eventId);assert.equal(store.artifactBodiesForWorkspace('room').length,0);store.close();
    fs.writeFileSync(path.join(legacyDir,'2guys1canvas.sqlite'),'keep both');assert.throws(()=>new EventStore(legacyDir),/Two local workflow databases/);assert.ok(fs.statSync(legacy).size>0);
  }finally{removeTemporary(dir);removeTemporary(legacyDir)}
});

for(const prefix of ['2guys1canvas','cocreate'])test(`new preview interoperates with ${prefix} parent without changing authored content or accepting outsider initialization`,()=>{
  const listeners=new Map<string,(event:any)=>void>(),messages:any[]=[],parent={postMessage(message:any){messages.push(message)}};
  const context=vm.createContext({parent,addEventListener:(name:string,callback:(event:any)=>void)=>listeners.set(name,callback),setTimeout:()=>0});
  const html=previewDocument("globalThis.restored=localStorage.getItem('kept');localStorage.setItem('own','CoCreate user text');",'');
  for(const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(script[1],context);
  assert.ok(messages.some(item=>item.type===prefix+'-storage-ready'));
  listeners.get('message')!({source:{},data:{type:prefix+'-storage-init',values:{kept:'bad'}}});assert.equal(context.restored,undefined);
  listeners.get('message')!({source:parent,data:{type:prefix+'-storage-init',values:{kept:'original'}}});
  assert.equal(context.restored,'original');assert.equal(messages.at(-1).type,prefix+'-storage-set');assert.equal(messages.at(-1).value,'CoCreate user text');
  listeners.get('message')!({source:parent,data:{type:'cocreate-storage-init',values:{kept:'late overwrite'}}});assert.equal(context.restored,'original');
  assert.equal(previewMessageKind(prefix+'-storage-set'),'storage-set');assert.equal(previewInitType(prefix+'-storage-ready'),prefix+'-storage-init');assert.equal(previewMessageKind('evil-storage-set'),undefined);
});

test('generated/exported identity is canonical while user source bytes and download authorization stay intact',async()=>{
  const dir=temporary(),previous=process.env.TWOGUYS1CANVAS_AUTH_MODE;process.env.TWOGUYS1CANVAS_AUTH_MODE='local';
  const service=await createTwoGuysOneCanvasServer({port:0,host:'127.0.0.1',serveClient:false,dataDir:dir,sessionSecret:'synthetic',encryptionSecret:'synthetic'});
  try{
    const {url}=await service.start(),room=service.manager.create('naming');service.manager.join(room,'alice','Alice');
    const source='export default function App(){return <main>CoCreate user-owned restaurant</main>}';
    room.versions=[{id:1,createdAt:new Date().toISOString(),summary:'User project',files:applyOperations(undefined,[{type:'write',path:'src/App.tsx',content:source}]),bundle:'',css:'',fileCount:2}];
    const token=createSession('synthetic',{roomId:room.id,participantId:'alice',name:'Alice'});
    assert.equal((await fetch(url+'/api/rooms/naming/download/1')).status,401);
    const response=await fetch(url+'/api/rooms/naming/download/1',{headers:{Authorization:'Bearer '+token}});assert.equal(response.status,200);
    assert.match(response.headers.get('content-disposition')!,/2guys1canvas-naming-v1.zip/);const zip=Buffer.from(await response.arrayBuffer());
    assert.ok(zip.includes(Buffer.from(source)));assert.ok(zip.includes(Buffer.from('2guys1canvas-generated-app')));
    assert.equal(JSON.parse(infrastructureFiles.find(file=>file.path==='package.json')!.content).name,'2guys1canvas-generated-app');
    for(const route of ['/__2guys1canvas/app-health','/__cocreate/app-health'])assert.equal((await fetch(url+route).then(res=>res.json())).service,'2guys1canvas-app');
  }finally{await service.stop();previous===undefined?delete process.env.TWOGUYS1CANVAS_AUTH_MODE:process.env.TWOGUYS1CANVAS_AUTH_MODE=previous;removeTemporary(dir)}
});

test('model schema identity is canonical and user requests remain verbatim',async()=>{
  let captured:any;const server=http.createServer(async(req,res)=>{let raw='';for await(const chunk of req)raw+=chunk;captured=JSON.parse(raw);res.setHeader('Content-Type','application/json');res.end(JSON.stringify({output:[{content:[{type:'output_text',text:'{"ok":true}'}]}],usage:{input_tokens:1,output_tokens:1}}))});
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{
    const input='Keep the user phrase CoCreate untouched';await generateStructured({provider:'custom',apiFormat:'responses',baseUrl:`http://127.0.0.1:${(server.address() as any).port}`,apiKey:'synthetic'},{model:'synthetic',instructions:'Return the requested object.',input,schema:{type:'object',properties:{ok:{type:'boolean'}},required:['ok'],additionalProperties:false}});
    assert.equal(captured.text.format.name,'two_guys_one_canvas_output');assert.equal(JSON.parse(captured.input).request,input);
  }finally{await new Promise<void>(resolve=>server.close(()=>resolve()))}
});

test('rendered email branding is canonical and provider idempotency remains compatible without sending email',async()=>{
  let payload:any,headers:any;const sender=invitationEmailSenderFromEnv({RESEND_API_KEY:'synthetic',COCREATE_EMAIL_FROM:'2guys1canvas <invites@verified.test>'},async(_url,init)=>{payload=JSON.parse(String(init?.body));headers=init?.headers;return Response.json({id:'synthetic'})});
  await sender.send({invitationId:'same-id',recipientEmail:'synthetic@recipient.test',inviterName:'Alice',projectTitle:'Restaurant',role:'editor',inviteUrl:'https://2guys1canvas.com/invites/synthetic',expiresAt:'2026-10-18T00:00:00Z'});
  assert.match(payload.subject,/2guys1canvas/);assert.doesNotMatch(JSON.stringify(payload),/co[-_ ]?create/i);assert.equal(headers['Idempotency-Key'],'cocreate-project-invite-same-id');
});
