import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const args=new Set(process.argv.slice(2)),apply=args.has('--apply'),mappingArg=process.argv.find((_,index,list)=>list[index-1]==='--mapping'),dataArg=process.argv.find((_,index,list)=>list[index-1]==='--data-dir');
const dataDir=path.resolve(dataArg||'data'),mappingPath=mappingArg?path.resolve(mappingArg):'',url=process.env.SUPABASE_URL||'',secret=process.env.SUPABASE_SECRET_KEY||'';
const projectIdFor=(legacyId:string)=>{const hex=createHash('sha256').update(`cocreate:${legacyId}`).digest('hex').slice(0,32).split('');hex[12]='5';hex[16]=((parseInt(hex[16],16)&3)|8).toString(16);return`${hex.slice(0,8).join('')}-${hex.slice(8,12).join('')}-${hex.slice(12,16).join('')}-${hex.slice(16,20).join('')}-${hex.slice(20).join('')}`};
if(!mappingPath)throw new Error('Provide --mapping <trusted-owner-map.json>. Display names and room links are never accepted as ownership evidence.');
const mapping=JSON.parse(fs.readFileSync(mappingPath,'utf8')) as Record<string,string>,files=fs.existsSync(dataDir)?fs.readdirSync(dataDir).filter(name=>/^[A-Za-z0-9_-]+\.json$/.test(name)):[];
const records=files.map(file=>{const roomId=file.replace(/\.json$/,''),raw=fs.readFileSync(path.join(dataDir,file)),state=JSON.parse(raw.toString('utf8')),ownerId=mapping[roomId];return{roomId,file,ownerId,state,hash:createHash('sha256').update(raw).digest('hex'),quarantined:!ownerId}});
console.log(JSON.stringify({mode:apply?'apply':'dry-run',source:dataDir,total:records.length,mapped:records.filter(record=>!record.quarantined).length,quarantined:records.filter(record=>record.quarantined).map(record=>record.roomId),records:records.map(({roomId,ownerId,hash,quarantined,state})=>({roomId,ownerId:ownerId||null,hash,quarantined,documentBytes:Buffer.from(String(state.update||''),'base64').length,versions:Array.isArray(state.versions)?state.versions.length:0}))},null,2));
if(!apply)process.exit(0);
if(!url||!secret)throw new Error('SUPABASE_URL and the complete server-only SUPABASE_SECRET_KEY are required for --apply.');
if(!args.has('--confirm-target'))throw new Error('Re-run with --confirm-target after verifying SUPABASE_URL is the intended project.');
const backup=path.resolve(`data-backup-${new Date().toISOString().replace(/[:.]/g,'-')}`);fs.cpSync(dataDir,backup,{recursive:true,errorOnExist:true});console.log(`Backup created: ${backup}`);
const client=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
for(const record of records){if(record.quarantined)continue;const projectId=projectIdFor(record.roomId),project={id:projectId,legacy_room_id:record.roomId,owner_id:record.ownerId,title:String(record.state.title||'Untitled project').slice(0,120),workflow_mode:'developer'};let response=await client.from('projects').upsert(project,{onConflict:'legacy_room_id'});if(response.error)throw response.error;response=await client.from('project_members').upsert({project_id:projectId,user_id:record.ownerId,role:'owner'},{onConflict:'project_id,user_id'});if(response.error)throw response.error;const harness={...record.state,legacyRoomId:record.roomId};delete harness.update;response=await client.from('project_snapshots').upsert({project_id:projectId,revision:Number(record.state.persistRevision||0),yjs_state:Buffer.from(String(record.state.update||''),'base64'),harness_state:harness,content_hash:record.hash,committed_at:record.state.savedAt||new Date().toISOString()},{onConflict:'project_id'});if(response.error)throw response.error;}
console.log(JSON.stringify({imported:records.filter(record=>!record.quarantined).length,quarantined:records.filter(record=>record.quarantined).length,backup},null,2));
