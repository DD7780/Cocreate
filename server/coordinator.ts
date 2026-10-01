import { randomUUID } from 'node:crypto';

type Rpc = (name:string, input:Record<string,unknown>) => PromiseLike<{data:unknown;error:{message?:string}|null}>;
/** Remote leases fence every canonical snapshot commit; a lost lease is never reacquired by an old worker. */
export class RemoteCoordinator {
  readonly ownerId=randomUUID();
  private epochs=new Map<string,number>();
  private claims=new Map<string,Promise<void>>();
  private lost=new Set<string>();
  private timer:NodeJS.Timeout;
  constructor(private rpc:Rpc){
    this.timer=setInterval(()=>{for(const id of this.epochs.keys())void this.assert(id).catch(()=>this.epochs.delete(id))},10_000);
    this.timer.unref();
  }
  private async call(projectId:string,epoch:number|null){
    const {data,error}=await this.rpc('claim_workflow_coordinator',{target_project_id:projectId,target_owner_id:this.ownerId,expected_epoch:epoch});
    if(error||typeof data!=='number')throw new Error(`Workflow coordinator unavailable: ${error?.message||'ownership changed'}. Reconnect. The coordinator migration must be applied before hosted use.`);
    return data;
  }
  claim(projectId:string){
    if(this.lost.has(projectId))return Promise.reject(new Error('Coordinator ownership was lost. Restart this process before claiming again.'));
    if(this.epochs.has(projectId))return this.assert(projectId);
    const pending=this.claims.get(projectId);if(pending)return pending;
    const task=this.call(projectId,null).then(epoch=>{this.epochs.set(projectId,epoch)}).finally(()=>this.claims.delete(projectId));
    this.claims.set(projectId,task);return task;
  }
  async assert(projectId:string){const epoch=this.epochs.get(projectId);if(epoch===undefined)throw new Error('This process does not own the workflow. Reconnect.');try{const current=await this.call(projectId,epoch);if(current!==epoch)throw new Error('Stale coordinator cannot save or promote.');}catch(error){this.epochs.delete(projectId);this.lost.add(projectId);throw error;}}
  fence(projectId:string){const epoch=this.epochs.get(projectId);if(epoch===undefined)throw new Error('Workflow ownership is unavailable. Reconnect.');return{target_owner_id:this.ownerId,expected_epoch:epoch};}
  async close(){clearInterval(this.timer);for(const [projectId,epoch] of this.epochs){await this.rpc('release_workflow_coordinator',{target_project_id:projectId,target_owner_id:this.ownerId,expected_epoch:epoch})}this.epochs.clear();}
}
