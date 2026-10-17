
type Stage = 'ingress-queue' | 'ingress-membership' | 'ingress-coordinator' | 'save-wait' | 'canonical-queue' | 'snapshot-prepare' | 'artifact-prepare' | 'remote-commit' | 'delivery' | 'delivery-authority';
type Timing = {stage:Stage; startedMs:number; durationMs?:number; code?:string; status?:number};
const safeId=(value:unknown)=>typeof value==='string'&&/^[A-Za-z0-9_-]{1,100}$/.test(value)&&!/(?:^sk-|sb_secret|bearer|api[_-]?key|token)/i.test(value)?value:undefined;

/** Bounded timing metadata only. Observing expiry never aborts or releases a write. */
export class SaveTrace {
  private started=performance.now();
  private stages=new Map<Stage,Timing>();
  private snapshots:SaveTrace[]=[];
  private observers:SaveTrace[]=[];
  private emissions=0;
  finished=false;
  constructor(private context:{requestId?:string;connectionId?:string;revision?:number}={}){
    if(context.requestId!==undefined){
      this.start('ingress-queue');this.emit('received');
    }
  }
  start(stage:Stage){this.stages.set(stage,{stage,startedMs:Math.round(performance.now()-this.started)})}
  end(stage:Stage,error?:unknown,status?:number){
    const timing=this.stages.get(stage);if(!timing)return;
    timing.durationMs=Math.max(0,Math.round(performance.now()-this.started)-timing.startedMs);
    const code=(error as {code?:unknown}|undefined)?.code;
    if(typeof code==='string'&&/^(?:[A-Z0-9]{5}|PGRST\d{3})$/.test(code))timing.code=code;
    if(typeof status==='number'&&status>=100&&status<=599)timing.status=status;
  }
  attach(snapshot:SaveTrace){
    if(snapshot===this||this.snapshots.includes(snapshot)||this.snapshots.length>=4)return;
    this.snapshots.push(snapshot);
    if(snapshot.observers.length<4)snapshot.observers.push(this);
  }
  committed(){for(const observer of this.observers)if(observer.finished)observer.emit('late_commit')}
  private snapshot(){return {revision:this.context.revision,elapsedMs:Math.max(0,Math.round(performance.now()-this.started)),stages:[...this.stages.values()]}}
  emit(outcome:'received'|'acknowledged'|'unknown'|'failed'|'closed'|'late_commit'|'late_reply'){
    if(this.emissions++>=4)return;
    console.info(JSON.stringify({event:this.context.requestId?'command.capture':'document.save',requestId:safeId(this.context.requestId),connectionId:safeId(this.context.connectionId),outcome,...this.snapshot(),snapshots:this.snapshots.map(snapshot=>snapshot.snapshot())}));
  }
  finish(outcome:'acknowledged'|'unknown'|'failed'|'closed'){
    if(this.finished){if(outcome==='acknowledged')this.emit('late_reply');return}
    this.finished=true;this.emit(outcome);
  }
}
