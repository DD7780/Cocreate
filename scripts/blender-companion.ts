import { createInterface } from 'node:readline/promises';
import { runBlenderCompanion } from '../server/blender-companion.js';

const args = process.argv.slice(2);
const option = (name: string) => { const index=args.indexOf('--'+name);return index<0?'':args[index+1]||''; };
const list = (name: string) => option(name).split(',').filter(Boolean);
const controller = new AbortController(), terminal = createInterface({input:process.stdin,output:process.stdout});
const stop = () => controller.abort();process.once('SIGINT',stop);process.once('SIGTERM',stop);
try {
  await runBlenderCompanion({server:option('server'),projectId:option('project'),pairingToken:option('pair'),resume:args.includes('--resume'),executable:option('blender'),workspace:option('workspace'),observe:list('observe'),control:list('control'),operations:list('operations'),name:option('name')||'My Blender device',signal:controller.signal,onState:state=>console.log(state),approveLocal:async approval=>{
    console.log(JSON.stringify({...approval,expiresAt:new Date(approval.expiresAt).toISOString()},null,2));
    console.log('Only new basic scenes will execute. No generated scripts, imported scenes, desktop capture or shell. STOP or Ctrl+C cancels the dedicated job.');
    const approved=(await terminal.question('Device owner: type CONNECT to approve this project, executable, workspace, operations and exact participant grants: ')).trim()==='CONNECT';
    terminal.on('line',line=>{if(line.trim().toUpperCase()==='STOP')stop();});
    return approved;
  }});
} finally {terminal.close();process.removeListener('SIGINT',stop);process.removeListener('SIGTERM',stop);}
