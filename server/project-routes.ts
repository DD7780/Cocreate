import type express from 'express';
import type { RoomManager } from './rooms.js';
import { createSession } from './auth.js';
import type { ProjectRole, SupabasePlatform } from './supabase-platform.js';

const bearer=(req:express.Request)=>req.headers.authorization?.replace(/^Bearer\s+/i,'')||'';
const message=(error:unknown)=>error instanceof Error?error.message:String(error);
const status=(error:unknown)=>Number((error as {status?:number})?.status)||400;
const displayName=(user:{email?:string;user_metadata?:Record<string,unknown>})=>String(user.user_metadata?.full_name||user.user_metadata?.name||user.email?.split('@')[0]||'Collaborator').slice(0,40);

export function registerProjectRoutes(app:express.Express,platform:SupabasePlatform,manager:RoomManager,sessionSecret:string,ticketTtlSeconds=300){
  app.get('/api/projects',async(req,res)=>{try{res.json(await platform.listProjects(bearer(req),{search:String(req.query.search||''),archived:req.query.archived==='true',offset:Number(req.query.offset||0),limit:Number(req.query.limit||30)}))}catch(error){res.status(status(error)).json({error:message(error)})}});
  app.post('/api/projects',async(req,res)=>{try{const project=await platform.createProject(bearer(req),String(req.body.title||'Untitled project'),String(req.body.workflowMode||'developer')as 'developer'|'analyst'|'researcher');const room=manager.hydrate(project.id,{ownerId:project.ownerId,participants:[],ai:{mode:'disconnected'},persistRevision:0});manager.join(room,project.ownerId,'Owner');res.status(201).json(project)}catch(error){res.status(status(error)).json({error:message(error)})}});
  app.patch('/api/projects/:id',async(req,res)=>{try{const user=await platform.verifyUser(bearer(req));res.json(await platform.updateProject(String(req.params.id),user.id,{title:req.body.title===undefined?undefined:String(req.body.title),archived:req.body.archived===undefined?undefined:Boolean(req.body.archived)}))}catch(error){res.status(status(error)).json({error:message(error)})}});
  app.post('/api/projects/:id/session',async(req,res)=>{try{const accessToken=bearer(req),user=await platform.verifyUser(accessToken),projectId=String(req.params.id),role=await platform.requireMembership(projectId,user.id);let room=manager.rooms.get(projectId);if(!room){const snapshot=await platform.loadSnapshot(projectId);room=manager.hydrate(projectId,snapshot||{ownerId:role==='owner'?user.id:null,participants:[],ai:{mode:'disconnected'},persistRevision:0})}const name=displayName(user);manager.join(room,user.id,name);const exp=Math.floor(Date.now()/1000)+ticketTtlSeconds,token=createSession(sessionSecret,{roomId:projectId,participantId:user.id,accountId:user.id,name,role,exp});res.json({token,participantId:user.id,role,expiresAt:new Date(exp*1000).toISOString()})}catch(error){res.status(status(error)).json({error:message(error)})}});
  app.post('/api/projects/:id/invites',async(req,res)=>{try{const user=await platform.verifyUser(bearer(req)),role=String(req.body.role||'editor')as Exclude<ProjectRole,'owner'>;if(!['editor','viewer'].includes(role))return res.status(400).json({error:'Invites may grant editor or viewer access.'});res.status(201).json(await platform.createInvite(String(req.params.id),user.id,role,Number(req.body.ttlHours||72)))}catch(error){res.status(status(error)).json({error:message(error)})}});
  app.post('/api/invites/accept',async(req,res)=>{try{res.json({projectId:await platform.acceptInvite(bearer(req),String(req.body.token||''))})}catch(error){res.status(status(error)).json({error:message(error)})}});
}
