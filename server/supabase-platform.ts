import { artifactPath, bodyFromBytes, versionArtifactBytes, checkpointArtifactBytes, versionMetadata, checkReference, decodeArtifactBody, verifyArtifact, versionStub, restoreVersion, restoreCheckpoint, ArtifactUnavailableError, type RecoveryCheckpoint, type ArtifactBody, type ArtifactReference } from './artifacts.js';
import { CoordinatorUnavailableError, RemoteCoordinator } from './coordinator.js';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { verifyAuth } from '@supabase/server/core';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import * as Y from 'yjs';
import { decodePersistedYjsUpdate, encodePostgresBytea, persistedRawBytes } from './yjs-persistence.js';
import { encryptSecret, decryptSecret, type EncryptedSecret } from './credentials.js';
import type { ProviderRequestRecord } from '../shared/types.js';

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
  private verifiedPublications=new Set<string>();
  readonly bucket: string;readonly coordinator:RemoteCoordinator;
  onCoordinatorLost(listener:(projectId:string)=>void){return this.coordinator.onLost(listener)}
  claimCoordinator(projectId:string){return this.coordinator.claim(projectId)}
  assertCoordinator(projectId:string){return this.coordinator.assert(projectId)}

  constructor(readonly config:PlatformConfig) {
    this.admin = createClient(config.url, config.secretKey, { auth:{ persistSession:false, autoRefreshToken:false } });
    this.coordinator=new RemoteCoordinator((name,input)=>this.admin.rpc(name,input));
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

  async managedFunding(projectId:string,userId:string) {
    await this.requireMembership(projectId,userId);
    const {data:funding,error}=await this.admin.from('project_managed_funding')
      .select('funding_account_id,max_concurrent,daily_limit_usd,max_request_usd')
      .eq('project_id',projectId).single();
    fail('Managed funding lookup failed',error);
    const {data:account,error:accountError}=await this.admin.from('managed_credit_accounts')
      .select('balance_usd,reserved_usd').eq('account_id',funding!.funding_account_id).single();
    fail('Managed credit lookup failed',accountError);
    const {data:spenders,error:spendersError}=await this.admin.from('project_managed_spenders')
      .select('user_id').eq('project_id',projectId);
    fail('Managed spender lookup failed',spendersError);
    return {fundingAccountId:funding!.funding_account_id,
      availableUsd:Math.max(0,Number(account!.balance_usd)-Number(account!.reserved_usd)),
      maxConcurrent:Number(funding!.max_concurrent),dailyLimitUsd:Number(funding!.daily_limit_usd),
      maxRequestUsd:Number(funding!.max_request_usd),authorizedSpenderIds:(spenders||[]).map(row=>row.user_id),
      canManage:(await this.membership(projectId,userId))?.role==='owner'};
  }

  async setManagedSpender(projectId:string,actorId:string,memberId:string,authorized:boolean) {
    await this.requireMembership(projectId,actorId,['owner']);
    await this.requireMembership(projectId,memberId,['owner','editor']);
    if(memberId===actorId&&!authorized)throw Object.assign(new Error('The funding owner remains an authorized spender.'),{status:400});
    if(authorized){const {error}=await this.admin.from('project_managed_spenders')
      .upsert({project_id:projectId,user_id:memberId,authorized_by:actorId},{onConflict:'project_id,user_id'});
      fail('Managed spending authorization failed',error);
    }else{const {error}=await this.admin.from('project_managed_spenders')
      .delete().eq('project_id',projectId).eq('user_id',memberId);
      fail('Managed spending revocation failed',error)}
    return {ok:true};
  }

  async reserveManagedRequest(input:{callId:string;projectId:string;actorId:string;modelId:string;catalogVersion:string;reservedUsd:number}) {
    const {error}=await this.admin.rpc('reserve_managed_request',{
      p_call_id:input.callId,p_project_id:input.projectId,p_actor_id:input.actorId,
      p_model_id:input.modelId,p_catalog_version:input.catalogVersion,p_reserved_usd:input.reservedUsd,
    });
    fail('Managed request blocked',error);
  }

  async settleManagedRequest(input:{callId:string;actualUsd:number|null;providerRequestId?:string;usage:Record<string,unknown>}) {
    const {error}=await this.admin.rpc('settle_managed_request',{
      p_call_id:input.callId,p_actual_usd:input.actualUsd,
      p_provider_request_id:input.providerRequestId||null,p_usage:input.usage,
    });
    fail('Managed usage reconciliation failed',error);
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
    const harness=await this.publishSnapshotArtifacts(projectId,payload);delete harness.update;
    const bytes=Buffer.from(update,'base64'),contentHash=createHash('sha256').update(bytes).update(JSON.stringify(harness)).digest('hex');
    const {data,error}=await this.admin.rpc('commit_workflow_snapshot',{target_project_id:projectId,...this.coordinator.fence(projectId),target_revision:revision,target_yjs_state:encodePostgresBytea(bytes),target_harness_state:harness,target_content_hash:contentHash});this.checkFenceError(projectId,error);fail('Durable fenced snapshot failed',error);if(data!==true)throw new Error('Durable snapshot commit was not confirmed.');
    // Project timestamp is committed in the same fenced transaction.
    return {contentHash,artifactManifest:harness.artifactManifest};
  }

  async recordProviderRequest(record:ProviderRequestRecord){
    const dispatch=record.outcome==='dispatching';const {error}=await this.admin.rpc(dispatch?'record_workflow_provider_dispatch':'record_project_provider_request',{target_project_id:record.workspaceId,target_call_id:record.callId,request_record:record,...(dispatch?this.coordinator.fence(record.workspaceId):{})});if(dispatch)this.checkFenceError(record.workspaceId,error);
    fail('Durable provider accounting failed',error);
  }

  async loadProviderRecords(projectId:string):Promise<ProviderRequestRecord[]>{
    const records:ProviderRequestRecord[]=[];
    for(let offset=0;;offset+=1000){
      const {data,error}=await this.admin.from('project_provider_requests').select('record').eq('project_id',projectId).order('first_recorded_at').order('call_id').range(offset,offset+999);
      fail('Provider accounting restore failed',error);
      records.push(...(data||[]).map(row=>row.record as ProviderRequestRecord));
      if((data||[]).length<1000)break;
    }
    return records;
  }

  async loadSnapshot(projectId:string) {
    const {data,error}=await this.admin.from('project_snapshots').select('revision,yjs_state,harness_state,committed_at').eq('project_id',projectId).maybeSingle();fail('Snapshot restore failed',error);
    if(!data)return null;
    const raw=data.yjs_state as unknown;
    let decoded:ReturnType<typeof decodePersistedYjsUpdate>;
    try{decoded=decodePersistedYjsUpdate(raw)}catch(error){
      await this.quarantine(projectId,'snapshot',Number(data.revision),raw,error);
      const recovered=await this.recoverDocumentUpdates(projectId);
      if(!recovered)throw new Error('Stored collaboration data is unreadable and no verified update history can recover it. The original bytes were quarantined; contact the project owner before making further edits.');
      return {...await this.restoreSnapshotArtifacts(projectId,data.harness_state as Record<string,unknown>),update:recovered.toString('base64'),persistRevision:Number(data.revision),savedAt:data.committed_at,persistenceRecovery:'verified_update_history'};
    }
    if(decoded.legacyBufferJson&&!await this.quarantine(projectId,'snapshot',Number(data.revision),raw,new Error('Legacy Node Buffer JSON serialization backed up before verified in-memory recovery.')))throw new Error('The collaboration snapshot is recoverable, but its required backup could not be recorded. Apply the persistence-quarantine migration before reopening this project.');
    return {...await this.restoreSnapshotArtifacts(projectId,data.harness_state as Record<string,unknown>),update:decoded.bytes.toString('base64'),persistRevision:Number(data.revision),savedAt:data.committed_at,persistenceRecovery:decoded.legacyBufferJson?'legacy_buffer_json':undefined};
  }

  async appendDocumentUpdate(projectId:string,sequence:number,actorId:string,update:Uint8Array) {
    const bytes=Buffer.from(update),digest=createHash('sha256').update(bytes).digest('hex');
    const {error}=await this.admin.rpc('append_workflow_document_update',{target_project_id:projectId,...this.coordinator.fence(projectId),target_sequence:sequence,target_actor_id:actorId,target_update_bytes:encodePostgresBytea(bytes),target_update_hash:digest});this.checkFenceError(projectId,error);
    fail('Durable document update failed',error);
  }

  private checkFenceError(projectId:string,error:{code?:string}|null){if(error?.code==='40001'){this.coordinator.invalidate(projectId);throw new CoordinatorUnavailableError()}}
  private async quarantine(projectId:string,kind:'snapshot'|'update',sourceRevision:number,raw:unknown,error:unknown){
    try{const{error:storageError}=await this.admin.from('project_persistence_quarantine').upsert({project_id:projectId,record_kind:kind,source_revision:sourceRevision,raw_bytes:encodePostgresBytea(persistedRawBytes(raw)),reason:error instanceof Error?error.message.slice(0,500):'Invalid persisted Yjs data'},{onConflict:'project_id,record_kind,source_revision',ignoreDuplicates:true});return!storageError}catch{return false}
  }

  private async recoverDocumentUpdates(projectId:string){
    const {data,error}=await this.admin.from('project_document_updates').select('sequence,update_bytes,update_hash').eq('project_id',projectId).order('sequence');
    fail('Document recovery lookup failed',error);if(!data?.length)return null;
    const recovered=new Y.Doc();let applied=0;
    try{for(const row of data){try{const decoded=decodePersistedYjsUpdate(row.update_bytes),digest=createHash('sha256').update(decoded.bytes).digest('hex');if(digest!==row.update_hash)throw new Error('Stored update hash did not match its decoded bytes.');Y.applyUpdate(recovered,decoded.bytes,'verified-recovery');applied++}catch(error){await this.quarantine(projectId,'update',Number(row.sequence),row.update_bytes,error)}}return applied?Buffer.from(Y.encodeStateAsUpdate(recovered)):null}finally{recovered.destroy()}
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

  private inviteTokenSecret(){const secret=process.env.CREDENTIAL_ENCRYPTION_SECRET||process.env.SESSION_SECRET;if(!secret)throw new Error('Invitation delivery requires CREDENTIAL_ENCRYPTION_SECRET or SESSION_SECRET.');return secret}

  async createInvite(projectId:string,userId:string,email:string,role:Exclude<ProjectRole,'owner'>,ttlHours=72,requestId:string=randomUUID()) {
    await this.requireSharePermission(projectId,userId);
    const recipientEmail=normalizeInviteEmail(email);
    const token=randomBytes(32).toString('base64url'),expiresAt=new Date(Date.now()+Math.min(168,Math.max(1,ttlHours))*3_600_000).toISOString();
    const ciphertext=JSON.stringify(encryptSecret(this.inviteTokenSecret(),token));
    const {data,error}=await this.admin.rpc('create_project_invite_v2',{target_project_id:projectId,actor_id:userId,recipient:recipientEmail,invite_role:role,invite_hash:hashToken(token),invite_expires_at:expiresAt,delivery_request_key:requestId,token_ciphertext:ciphertext}).single();fail('Invite creation failed',error);
    const row=data as any;return{id:String(row.id),token:decryptSecret(this.inviteTokenSecret(),JSON.parse(row.encrypted_token) as EncryptedSecret),email:recipientEmail,expiresAt:String(row.expires_at),role,deliveryState:String(row.delivery_state),providerMessageId:row.provider_message_id||undefined,pending:row.accepted_at===null&&row.revoked_at===null&&Date.parse(String(row.expires_at))>Date.now(),resendCount:Number(row.resend_count||0)};
  }

  async resendInvite(projectId:string,userId:string,inviteId:string,ttlHours=72,requestId:string=randomUUID()) {
    await this.requireSharePermission(projectId,userId);
    const existing=await this.admin.from('project_invites').select('id').eq('id',inviteId).eq('project_id',projectId).maybeSingle();fail('Invitation lookup failed',existing.error);if(!existing.data)throw Object.assign(new Error('Invitation does not belong to this project.'),{status:404});
    const token=randomBytes(32).toString('base64url'),expiresAt=new Date(Date.now()+Math.min(168,Math.max(1,ttlHours))*3_600_000).toISOString();
    const ciphertext=JSON.stringify(encryptSecret(this.inviteTokenSecret(),token));
    const {data,error}=await this.admin.rpc('resend_project_invite_v2',{prior_invite_id:inviteId,actor_id:userId,invite_hash:hashToken(token),invite_expires_at:expiresAt,delivery_request_key:requestId,token_ciphertext:ciphertext}).single();fail('Invitation resend failed',error);const row=data as any;if(String(row.project_id)!==projectId)throw Object.assign(new Error('Invitation does not belong to this project.'),{status:404});return{id:String(row.id),token:decryptSecret(this.inviteTokenSecret(),JSON.parse(row.encrypted_token) as EncryptedSecret),email:String(row.recipient_email),expiresAt:String(row.expires_at),role:row.intended_role as Exclude<ProjectRole,'owner'>,deliveryState:String(row.delivery_state),providerMessageId:row.provider_message_id||undefined,pending:row.accepted_at===null&&row.revoked_at===null&&Date.parse(String(row.expires_at))>Date.now(),resendCount:Number(row.resend_count||0)};
  }

  async recordInviteDelivery(inviteId:string,delivery:{state:string;error?:string;providerMessageId?:string}) {
    const values={delivery_state:delivery.state,delivery_error:delivery.error?.slice(0,500)||null,provider_message_id:delivery.providerMessageId||null,last_sent_at:delivery.state==='sent'?new Date().toISOString():null};
    const {error}=await this.admin.from('project_invites').update(values).eq('id',inviteId).neq('delivery_state','sent');fail('Invitation delivery update failed',error);
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

  private async privateArtifactBucket() {
    const { data, error } = await this.admin.storage.getBucket(this.bucket);
    if (error || !data || data.public !== false)
        throw new ArtifactUnavailableError('unavailable');
}
  private async uploadVerified(path: string, contents: Uint8Array, mimeType: string) {
    const storage = this.admin.storage.from(this.bucket);
    const uploaded = await storage.upload(path, contents, { contentType: mimeType, upsert: false });
    if (uploaded.error && !/already exists|duplicate|resourcealreadyexists/i.test(uploaded.error.message) && String(uploaded.error.statusCode) !== '409')
        throw new ArtifactUnavailableError('unavailable');
    const downloaded = await storage.download(path);
    if (downloaded.error || !downloaded.data)
        throw new ArtifactUnavailableError('unavailable');
    const bytes = Buffer.from(await downloaded.data.arrayBuffer());
    if (createHash('sha256').update(bytes).digest('hex') !== createHash('sha256').update(contents).digest('hex'))
        throw new ArtifactUnavailableError('corrupt');
}
  async readArtifact(projectId: string, reference: ArtifactReference) {
    const checked = checkReference(reference);
    await this.privateArtifactBucket();
    const { data, error } = await this.admin.storage.from(this.bucket).download(artifactPath(projectId, checked));
    if (error || !data)
        throw new ArtifactUnavailableError(error && (/not found|does not exist|nosuchkey/i.test(error.message) || String(error.statusCode) === '404') ? 'missing' : 'unavailable');
    return verifyArtifact(checked, new Uint8Array(await data.arrayBuffer()));
}
  async publishArtifactBodies(projectId: string, bodies: ArtifactBody[]) {
    this.coordinator.fence(projectId);
    if (bodies.length)
        await this.privateArtifactBucket();
    const references: ArtifactReference[] = [];
    for (const body of bodies) {
        const reference = checkReference(body), bytes = decodeArtifactBody(body), path = artifactPath(projectId, reference);
        if (!this.verifiedPublications.has(path)) {
            await this.uploadVerified(path, bytes, reference.mimeType);
            this.verifiedPublications.add(path);
        }
        references.push(reference);
    }
    if (bodies.length)
        await this.assertCoordinator(projectId);
    return references;
}
  private async publishSnapshotArtifacts(projectId: string, payload: Record<string, unknown>) {
    this.coordinator.fence(projectId);
    const harness = { ...payload };
    delete harness.artifactBodies;
    const raw = payload.artifactManifest ?? [];
    if (!Array.isArray(raw) || !Array.isArray(payload.artifactBodies ?? []))
        throw new ArtifactUnavailableError('corrupt');
    const manifest = new Map<string, ArtifactReference>(raw.map(item => { const ref = checkReference(item); return [ref.ref, ref]; }));
    const bodies = [...((payload.artifactBodies ?? []) as ArtifactBody[])];
    const versions = (Array.isArray(payload.versions) ? payload.versions : []).map(version => {
        if (!version || typeof version !== 'object')
            throw new ArtifactUnavailableError('corrupt');
        if (version.artifactRef)
            return version;
        // Compatibility: explicitly imported legacy inline versions use the same publication gate.
        const body = bodyFromBytes(versionArtifactBytes(projectId, version), 'application/vnd.cocreate.product+json');
        bodies.push(body);
        return { ...version, artifactRef: body.ref };
    });
    const history = new Map((Array.isArray(payload.artifactHistory) ? payload.artifactHistory : []).map(version => { if (!version || !Number.isSafeInteger(version.id) || version.id < 1)
        throw new ArtifactUnavailableError('corrupt'); return [version.id, version]; }));
    let checkpoint = payload.recoveryCheckpoint as RecoveryCheckpoint | undefined;
    if (checkpoint && !checkpoint.artifactRef) {
        const body = bodyFromBytes(checkpointArtifactBytes(projectId, checkpoint), 'application/vnd.cocreate.checkpoint+json');
        bodies.push(body);
        checkpoint = { ...checkpoint, artifactRef: body.ref };
    }
    for (const version of versions) {
        const prior = history.get(version.id);
        if (prior && prior.artifactRef !== version.artifactRef)
            throw new ArtifactUnavailableError('corrupt');
        history.set(version.id, versionMetadata(version));
    }
    harness.artifactHistory = [...history.values()].sort((a, b) => a.id - b.id);
    for (const reference of await this.publishArtifactBodies(projectId, bodies))
        manifest.set(reference.ref, reference);
    const requireRef = (ref: unknown) => { if (typeof ref !== 'string' || !manifest.has(ref))
        throw new ArtifactUnavailableError('missing'); };
    harness.versions = versions.map(version => { requireRef(version.artifactRef); return versionStub(version); });
    if (checkpoint) {
        requireRef(checkpoint.artifactRef);
        harness.recoveryCheckpoint = { ...checkpoint };
        delete (harness.recoveryCheckpoint as Record<string, unknown>).files;
    }
    if (Array.isArray(harness.artifactHistory))
        for (const version of harness.artifactHistory)
            requireRef(version.artifactRef);
    harness.artifactSchemaVersion = 1;
    harness.artifactManifest = [...manifest.values()].sort((a, b) => a.ref.localeCompare(b.ref));
    return harness;
}
  private async restoreSnapshotArtifacts(projectId: string, harness: Record<string, unknown>) {
    if (harness.artifactSchemaVersion === undefined)
        return harness; // Legacy inline versions remain readable; no fabricated older history.
    if (harness.artifactSchemaVersion !== 1 || !Array.isArray(harness.artifactManifest) || !Array.isArray(harness.versions))
        throw new ArtifactUnavailableError('corrupt');
    const manifest = new Map<string, ArtifactReference>(harness.artifactManifest.map(item => { const ref = checkReference(item); return [ref.ref, ref]; }));
    if (!Array.isArray(harness.artifactHistory) || harness.artifactHistory.some(version => !version || !Number.isSafeInteger(version.id) || version.id < 1 || typeof version.summary !== 'string' || typeof version.createdAt !== 'string' || !manifest.has(version.artifactRef)))
        throw new ArtifactUnavailableError('corrupt');
    const bodies = new Map<string, ArtifactBody>();
    const load = async (ref: unknown) => {
        if (typeof ref !== 'string' || !manifest.has(ref))
            throw new ArtifactUnavailableError('missing');
        let body = bodies.get(ref);
        if (!body) {
            const reference = manifest.get(ref)!, bytes = await this.readArtifact(projectId, reference);
            body = { ...reference, base64: bytes.toString('base64') };
            bodies.set(ref, body);
        }
        return decodeArtifactBody(body);
    };
    const versions = [];
    for (const version of harness.versions) {
        if (!version || typeof version !== 'object')
            throw new ArtifactUnavailableError('corrupt');
        versions.push(restoreVersion(await load(version.artifactRef), projectId, version));
    }
    let checkpoint = harness.recoveryCheckpoint;
    if (checkpoint) {
        const expected = checkpoint as Record<string, unknown>;
        checkpoint = restoreCheckpoint(await load(expected.artifactRef), projectId, expected);
    }
    return { ...harness, versions, recoveryCheckpoint: checkpoint, artifactBodies: [...bodies.values()] };
}
  async storeArtifact(projectId:string,revision:number,contents:Uint8Array,metadata:Record<string,unknown>={}) {
    const hash=createHash('sha256').update(contents).digest('hex'),path=`${projectId}/${revision}/${hash}.zip`;
    const pending={project_id:projectId,revision,storage_path:path,content_hash:hash,state:'pending',metadata};
    let result=await this.admin.from('artifact_versions').upsert(pending,{onConflict:'project_id,revision'});fail('Artifact metadata reservation failed',result.error);
    await this.privateArtifactBucket();await this.uploadVerified(path,contents,'application/zip');
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
