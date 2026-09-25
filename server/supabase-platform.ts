import { createHash, randomBytes } from 'node:crypto';
import { verifyAuth } from '@supabase/server/core';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type ProjectRole = 'owner' | 'editor' | 'viewer';
export type ProjectSummary = {
  id: string; ownerId: string; title: string; workflowMode: 'developer' | 'analyst' | 'researcher';
  archivedAt?: string; createdAt: string; updatedAt: string; role: ProjectRole; canShare:boolean;
};
export type ProjectMemberSummary={userId:string;email:string;displayName:string;role:ProjectRole;canShare:boolean;joinedAt:string};
export type ProjectInviteSummary={id:string;email:string;role:Exclude<ProjectRole,'owner'>;expiresAt:string;createdAt:string;lastSentAt?:string;deliveryState:'pending'|'sent'|'failed'|'configuration_required';deliveryError?:string;resendCount:number};

type PlatformConfig = { url: string; publishableKey: string; secretKey: string; jwksUrl?: string; artifactBucket?: string };
export type AuthenticatedUser={id:string;email?:string;user_metadata:Record<string,unknown>};
type ProjectRow = { id:string; owner_id:string; title:string; workflow_mode:ProjectSummary['workflowMode']; archived_at:string|null; created_at:string; updated_at:string };

const fail = (label:string, error:{message?:string}|null) => { if(error) throw new Error(`${label}: ${error.message || 'Supabase request failed.'}`); };
const hashToken = (token:string) => createHash('sha256').update(token).digest('hex');
export const normalizeProjectTitle=(value:string)=>{const title=value.trim();if(!title)throw Object.assign(new Error('Project name cannot be empty.'),{status:400});if(title.length>120)throw Object.assign(new Error('Project name must be 120 characters or fewer.'),{status:400});return title};
export const normalizeInviteEmail=(value:string)=>{const email=value.trim().toLowerCase();if(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Object.assign(new Error('Enter a valid recipient email address.'),{status:400});return email};

export class SupabasePlatform {
  readonly admin: SupabaseClient;
  readonly bucket: string;

  constructor(readonly config:PlatformConfig) {
    this.admin = createClient(config.url, config.secretKey, { auth:{ persistSession:false, autoRefreshToken:false } });
    this.bucket = config.artifactBucket || 'cocreate-artifacts';
  }

  private userClient(accessToken:string) {
    return createClient(this.config.url, this.config.publishableKey, {
      auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false },
      global:{ headers:{ Authorization:`Bearer ${accessToken}` } },
    });
  }

  async verifyUser(accessToken:string):Promise<AuthenticatedUser> {
    const request=new Request('http://cocreate.internal/auth',{headers:{Authorization:`Bearer ${accessToken}`}}),issuer=`${this.config.url.replace(/\/$/,'')}/auth/v1`;
    const {data,error}=await verifyAuth(request,{auth:'user',audience:'authenticated',issuer,env:{url:this.config.url,publishableKeys:{default:this.config.publishableKey},secretKeys:{default:this.config.secretKey},jwks:new URL(this.config.jwksUrl||`${issuer}/.well-known/jwks.json`)}});
    if(error||!data.userClaims)throw Object.assign(new Error(error?.message||'Authentication failed.'),{status:error?.status||401});
    return{id:data.userClaims.id,email:data.userClaims.email,user_metadata:data.userClaims.userMetadata||{}};
  }

  async membership(projectId:string,userId:string):Promise<{role:ProjectRole;canShare:boolean}|null> {
    const { data, error } = await this.admin.from('project_members').select('role,can_share').eq('project_id',projectId).eq('user_id',userId).maybeSingle();
    fail('Membership lookup failed',error);
    return data?{role:data.role as ProjectRole,canShare:Boolean(data.can_share)}:null;
  }

  async requireMembership(projectId:string,userId:string,allowed:ProjectRole[]=['owner','editor','viewer']) {
    const membership=await this.membership(projectId,userId);
    if(!membership||!allowed.includes(membership.role)) throw Object.assign(new Error('You do not have permission to access this project.'),{status:403});
    return membership.role;
  }

  async requireSharePermission(projectId:string,userId:string) {
    const membership=await this.membership(projectId,userId);
    if(!membership||(membership.role!=='owner'&&!membership.canShare))throw Object.assign(new Error('You do not have permission to manage project sharing.'),{status:403});
    return membership;
  }

  async listProjects(accessToken:string,options:{search?:string;archived?:boolean;offset?:number;limit?:number}={}) {
    const user=await this.verifyUser(accessToken);
    const client=this.userClient(accessToken),limit=Math.min(50,Math.max(1,options.limit||30)),offset=Math.max(0,options.offset||0);
    let query=client.from('projects').select('id,owner_id,title,workflow_mode,archived_at,created_at,updated_at,project_members!inner(role,user_id,can_share)',{count:'exact'})
      .eq('project_members.user_id',user.id)
      .order('updated_at',{ascending:false}).range(offset,offset+limit-1);
    if(options.search?.trim()) query=query.ilike('title',`%${options.search.trim().slice(0,80)}%`);
    query=options.archived?query.not('archived_at','is',null):query.is('archived_at',null);
    const {data,error,count}=await query;fail('Project list failed',error);
    const projects=(data||[]).map((row:any):ProjectSummary=>({id:row.id,ownerId:row.owner_id,title:row.title,workflowMode:row.workflow_mode,archivedAt:row.archived_at||undefined,createdAt:row.created_at,updatedAt:row.updated_at,role:row.project_members?.[0]?.role||row.project_members?.role,canShare:Boolean(row.project_members?.[0]?.can_share||row.project_members?.can_share||row.project_members?.[0]?.role==='owner')}));
    return {projects,total:count||0,nextOffset:offset+projects.length<(count||0)?offset+projects.length:null};
  }

  async createProject(accessToken:string,title='Untitled project',workflowMode:ProjectSummary['workflowMode']='developer') {
    const user=await this.verifyUser(accessToken),client=this.userClient(accessToken);
    const projectTitle=normalizeProjectTitle(title);
    const {data,error}=await client.rpc('create_project',{project_title:projectTitle,project_mode:workflowMode}).single();fail('Project creation failed',error);
    const row=data as unknown as ProjectRow;
    return {id:row.id,ownerId:user.id,title:row.title,workflowMode:row.workflow_mode,createdAt:row.created_at,updatedAt:row.updated_at,role:'owner' as const,canShare:true};
  }

  async updateProject(projectId:string,userId:string,patch:{title?:string;archived?:boolean}) {
    await this.requireMembership(projectId,userId,['owner']);
    const values:Record<string,unknown>={};
    if(patch.title!==undefined) values.title=normalizeProjectTitle(patch.title);
    if(patch.archived!==undefined) values.archived_at=patch.archived?new Date().toISOString():null;
    const {data,error}=await this.admin.from('projects').update(values).eq('id',projectId).select().single();fail('Project update failed',error);return data;
  }

  async projectTitle(projectId:string) {
    const {data,error}=await this.admin.from('projects').select('title').eq('id',projectId).single();fail('Project lookup failed',error);return String(data!.title);
  }

  async saveSnapshot(projectId:string,revision:number,payload:Record<string,unknown>) {
    const update=typeof payload.update==='string'?payload.update:'';
    const harness={...payload};delete harness.update;
    const bytes=Buffer.from(update,'base64'),contentHash=createHash('sha256').update(bytes).update(JSON.stringify(harness)).digest('hex');
    const {error}=await this.admin.from('project_snapshots').upsert({project_id:projectId,revision,yjs_state:bytes,harness_state:harness,content_hash:contentHash,committed_at:new Date().toISOString()},{onConflict:'project_id'});fail('Durable snapshot failed',error);
    await this.admin.from('projects').update({updated_at:new Date().toISOString()}).eq('id',projectId);
    return {contentHash};
  }

  async loadSnapshot(projectId:string) {
    const {data,error}=await this.admin.from('project_snapshots').select('revision,yjs_state,harness_state,committed_at').eq('project_id',projectId).maybeSingle();fail('Snapshot restore failed',error);
    if(!data)return null;
    const raw=data.yjs_state as unknown;
    const bytes=typeof raw==='string'?Buffer.from(raw.replace(/^\\x/,''),'hex'):Buffer.from(raw as Uint8Array);
    return {...(data.harness_state as Record<string,unknown>),update:bytes.toString('base64'),persistRevision:Number(data.revision),savedAt:data.committed_at};
  }

  async appendDocumentUpdate(projectId:string,sequence:number,actorId:string,update:Uint8Array) {
    const bytes=Buffer.from(update),digest=createHash('sha256').update(bytes).digest('hex');
    const {error}=await this.admin.from('project_document_updates').upsert({project_id:projectId,sequence,actor_id:actorId,update_bytes:bytes,update_hash:digest},{onConflict:'project_id,sequence',ignoreDuplicates:true});
    fail('Durable document update failed',error);
  }

  async listSharing(projectId:string,userId:string) {
    const membership=await this.requireSharePermission(projectId,userId);
    const membersResult=await this.admin.from('project_members').select('user_id,role,can_share,joined_at').eq('project_id',projectId).order('joined_at');fail('Member list failed',membersResult.error);
    const members:ProjectMemberSummary[]=[];
    for(const row of membersResult.data||[]){const result=await this.admin.auth.admin.getUserById(String(row.user_id));fail('Member profile lookup failed',result.error);const user=result.data.user;members.push({userId:String(row.user_id),email:user?.email||'Email unavailable',displayName:String(user?.user_metadata?.full_name||user?.user_metadata?.name||user?.email?.split('@')[0]||'Collaborator'),role:row.role as ProjectRole,canShare:row.role==='owner'||Boolean(row.can_share),joinedAt:String(row.joined_at)})}
    const invitesResult=await this.admin.from('project_invites').select('id,recipient_email,intended_role,expires_at,created_at,last_sent_at,delivery_state,delivery_error,resend_count').eq('project_id',projectId).is('accepted_at',null).is('revoked_at',null).order('created_at',{ascending:false});fail('Pending invitation list failed',invitesResult.error);
    const invitations=(invitesResult.data||[]).filter(row=>row.recipient_email).map((row:any):ProjectInviteSummary=>({id:row.id,email:row.recipient_email,role:row.intended_role,expiresAt:row.expires_at,createdAt:row.created_at,lastSentAt:row.last_sent_at||undefined,deliveryState:row.delivery_state,deliveryError:row.delivery_error||undefined,resendCount:Number(row.resend_count||0)}));
    return{permission:membership.role==='owner'?'owner':'member',members,invitations};
  }

  async createInvite(projectId:string,userId:string,email:string,role:Exclude<ProjectRole,'owner'>,ttlHours=72) {
    await this.requireSharePermission(projectId,userId);
    const recipientEmail=normalizeInviteEmail(email);
    const token=randomBytes(32).toString('base64url'),expiresAt=new Date(Date.now()+Math.min(168,Math.max(1,ttlHours))*3_600_000).toISOString();
    const {data,error}=await this.admin.rpc('create_project_invite',{target_project_id:projectId,actor_id:userId,recipient:recipientEmail,invite_role:role,invite_hash:hashToken(token),invite_expires_at:expiresAt}).single();fail('Invite creation failed',error);
    const row=data as any;return {id:String(row.id),token,email:recipientEmail,expiresAt,role,resendCount:Number(row.resend_count||0)};
  }

  async resendInvite(projectId:string,userId:string,inviteId:string,ttlHours=72) {
    await this.requireSharePermission(projectId,userId);
    const existing=await this.admin.from('project_invites').select('id').eq('id',inviteId).eq('project_id',projectId).is('accepted_at',null).is('revoked_at',null).maybeSingle();fail('Invitation lookup failed',existing.error);if(!existing.data)throw Object.assign(new Error('Invitation is no longer pending.'),{status:404});
    const token=randomBytes(32).toString('base64url'),expiresAt=new Date(Date.now()+Math.min(168,Math.max(1,ttlHours))*3_600_000).toISOString();
    const {data,error}=await this.admin.rpc('resend_project_invite',{prior_invite_id:inviteId,actor_id:userId,invite_hash:hashToken(token),invite_expires_at:expiresAt}).single();fail('Invitation resend failed',error);const row=data as any;if(String(row.project_id)!==projectId)throw Object.assign(new Error('Invitation does not belong to this project.'),{status:404});return{id:String(row.id),token,email:String(row.recipient_email),expiresAt,role:row.intended_role as Exclude<ProjectRole,'owner'>,resendCount:Number(row.resend_count||0)};
  }

  async recordInviteDelivery(inviteId:string,delivery:{state:string;error?:string;providerMessageId?:string}) {
    const values={delivery_state:delivery.state,delivery_error:delivery.error?.slice(0,500)||null,provider_message_id:delivery.providerMessageId||null,last_sent_at:delivery.state==='sent'?new Date().toISOString():null};
    const {error}=await this.admin.from('project_invites').update(values).eq('id',inviteId);fail('Invitation delivery update failed',error);
  }

  async revokeInvite(projectId:string,userId:string,inviteId:string) {
    await this.requireSharePermission(projectId,userId);const {data,error}=await this.admin.from('project_invites').update({revoked_at:new Date().toISOString()}).eq('id',inviteId).eq('project_id',projectId).is('accepted_at',null).is('revoked_at',null).select('id').maybeSingle();fail('Invitation revocation failed',error);if(!data)throw Object.assign(new Error('Invitation is no longer pending.'),{status:404});return{ok:true};
  }

  async updateMember(projectId:string,userId:string,memberId:string,patch:{role?:Exclude<ProjectRole,'owner'>;canShare?:boolean}) {
    const actor=await this.requireSharePermission(projectId,userId),target=await this.membership(projectId,memberId);if(!target)throw Object.assign(new Error('Project member not found.'),{status:404});if(target.role==='owner')throw Object.assign(new Error('The project owner role cannot be changed.'),{status:400});if(actor.role!=='owner'&&patch.canShare!==undefined)throw Object.assign(new Error('Only the owner can grant sharing permission.'),{status:403});if(actor.role!=='owner'&&patch.role!==undefined&&memberId===userId)throw Object.assign(new Error('Only the owner can change your own project role.'),{status:403});if(actor.role==='viewer'&&patch.role==='editor')throw Object.assign(new Error('A viewer cannot grant editor access.'),{status:403});const values:Record<string,unknown>={};if(patch.role)values.role=patch.role;if(patch.canShare!==undefined)values.can_share=patch.canShare;if(!Object.keys(values).length)throw Object.assign(new Error('No member changes were supplied.'),{status:400});const {error}=await this.admin.from('project_members').update(values).eq('project_id',projectId).eq('user_id',memberId);fail('Member update failed',error);return{ok:true};
  }

  async acceptInvite(accessToken:string,token:string) {
    await this.verifyUser(accessToken);const {data,error}=await this.userClient(accessToken).rpc('accept_project_invite',{invite_hash:hashToken(token)});fail('Invite acceptance failed',error);return String(data);
  }

  async storeArtifact(projectId:string,revision:number,contents:Uint8Array,metadata:Record<string,unknown>={}) {
    const hash=createHash('sha256').update(contents).digest('hex'),path=`${projectId}/${revision}/${hash}.zip`;
    const pending={project_id:projectId,revision,storage_path:path,content_hash:hash,state:'pending',metadata};
    let result=await this.admin.from('artifact_versions').upsert(pending,{onConflict:'project_id,revision'});fail('Artifact metadata reservation failed',result.error);
    const uploaded=await this.admin.storage.from(this.bucket).upload(path,contents,{contentType:'application/zip',upsert:false});
    if(uploaded.error && !/already exists/i.test(uploaded.error.message)){await this.admin.from('artifact_versions').update({state:'failed'}).eq('project_id',projectId).eq('revision',revision);throw new Error(`Artifact upload failed: ${uploaded.error.message}`);}
    const downloaded=await this.admin.storage.from(this.bucket).download(path);fail('Artifact verification failed',downloaded.error);
    const verifiedHash=createHash('sha256').update(Buffer.from(await downloaded.data!.arrayBuffer())).digest('hex');
    if(verifiedHash!==hash)throw new Error('Artifact verification failed: stored hash did not match.');
    result=await this.admin.from('artifact_versions').update({state:'finalized',finalized_at:new Date().toISOString()}).eq('project_id',projectId).eq('revision',revision);fail('Artifact finalization failed',result.error);
    return {path,hash};
  }
}

export function supabasePlatformFromEnv(env=process.env) {
  const hosted=env.COCREATE_HOSTED==='true',mode=env.COCREATE_AUTH_MODE||(hosted?'supabase':'local');
  if(mode==='local')return {mode:'local' as const,platform:null,error:null};
  const url=env.SUPABASE_URL,publishableKey=env.SUPABASE_PUBLISHABLE_KEY,secretKey=env.SUPABASE_SECRET_KEY;
  if(!url||!publishableKey||!secretKey)return {mode:'supabase' as const,platform:null,error:'SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, and server-only SUPABASE_SECRET_KEY are required.'};
  try{
    const projectUrl=new URL(url),suffix='.supabase.co',projectRef=projectUrl.hostname.endsWith(suffix)?projectUrl.hostname.slice(0,-suffix.length):'';
    if(projectUrl.protocol!=='https:'||!projectRef||projectUrl.pathname!=='/'||projectUrl.search||projectUrl.hash)throw new Error('SUPABASE_URL must be the intended HTTPS project origin under supabase.co.');
    const credentialRef=(key:string)=>{if(!key.includes('.'))return null;try{const payload=JSON.parse(Buffer.from(key.split('.')[1],'base64url').toString('utf8'));return typeof payload.ref==='string'?payload.ref:''}catch{return''}};
    for(const key of [publishableKey,secretKey]){const ref=credentialRef(key);if(ref==='')throw new Error('A configured Supabase credential is malformed.');if(ref&&ref!==projectRef)throw new Error('The configured Supabase URL and credentials belong to different projects.');}
    const expectedJwks=`${projectUrl.origin}/auth/v1/.well-known/jwks.json`;
    if(env.SUPABASE_JWKS_URL&&env.SUPABASE_JWKS_URL!==expectedJwks)throw new Error('SUPABASE_JWKS_URL does not match SUPABASE_URL.');
  }catch(error){return{mode:'supabase' as const,platform:null,error:error instanceof Error?error.message:'Supabase server configuration is invalid.'};}
  return {mode:'supabase' as const,platform:new SupabasePlatform({url,publishableKey,secretKey,jwksUrl:env.SUPABASE_JWKS_URL,artifactBucket:env.SUPABASE_ARTIFACT_BUCKET}),error:null};
}

export const supabasePlatformInternals={hashToken};
