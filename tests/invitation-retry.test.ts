import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import express from'express';
import{registerProjectRoutes}from'../server/project-routes.js';
import type{SupabasePlatform}from'../server/supabase-platform.js';import type{RoomManager}from'../server/rooms.js';

test('replaying the same invitation request keeps its link and does not send twice after provider acceptance',async()=>{
  const app=express();app.use(express.json());let sent=0;const rows=new Map<string,{id:string;token:string;email:string;expiresAt:string;role:'editor';deliveryState:string}>();
  const platform={verifyUser:async()=>({id:'owner',email:'owner@example.test',user_metadata:{}}),projectTitle:async()=> 'Project',createInvite:async(_project:string,_actor:string,email:string,_role:string,_ttl:number,key:string)=>{let row=rows.get(key);if(!row){row={id:'invite-1',token:'same-token',email,expiresAt:'2030-01-01T00:00:00Z',role:'editor',deliveryState:'pending'};rows.set(key,row)}return row},recordInviteDelivery:async(_id:string,delivery:{state:string})=>{for(const row of rows.values())row.deliveryState=delivery.state}} as unknown as SupabasePlatform;
  registerProjectRoutes(app,platform,{} as RoomManager,'ticket-secret',{configured:true,send:async()=>{sent++;return{state:'sent',providerMessageId:'message-1'}}});
  const server=app.listen(0,'127.0.0.1');try{await new Promise<void>(resolve=>server.once('listening',resolve));const address=server.address();if(!address||typeof address==='string')throw new Error('No test port');const url=`http://127.0.0.1:${address.port}/api/projects/project-1/invites`,body={emails:['person@example.test'],role:'editor',requestId:'stable-request'};const post=async()=>{const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});assert.equal(response.status,201);return(await response.json() as any).invitations[0]};const first=await post(),retry=await post();assert.equal(first.id,retry.id);assert.equal(first.shareUrl,retry.shareUrl);assert.equal(sent,1);assert.equal(rows.size,1)}finally{await new Promise<void>(resolve=>server.close(()=>resolve()))}
});

test('additive invitation migration retains prior hashes and membership roles',()=>{
  const sql=fs.readFileSync(new URL('../supabase/migrations/202609300001_preserve_invites_and_idempotent_delivery.sql',import.meta.url),'utf8');
  assert.match(sql,/drop index if exists public\.project_invites_one_active_email_idx/);
  assert.match(sql,/on conflict \(project_id, user_id\) do nothing/);
  assert.match(sql,/return existing/);
  assert.doesNotMatch(sql,/update public\.project_invites set revoked_at/);
});
