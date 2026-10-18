import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {randomUUID} from 'node:crypto';
import {betaDatabase,betaAccounts} from './fixtures/beta-database.js';

test('canonical capture SQL fences ownership, locks replay identity and preserves source provenance with service-only access',async()=>{
  const db=await betaDatabase(),project=randomUUID(),owner=randomUUID(),actor=betaAccounts.founder,other=betaAccounts.cofounder;
  try{
    await db.exec('create table public.projects(id uuid primary key);');
    const ownership=fs.readFileSync(new URL('../supabase/migrations/20261001104120_workflow_coordinator_fencing.sql',import.meta.url),'utf8');
    await db.exec(ownership.slice(0,ownership.indexOf('create function')));
    await db.exec('alter default privileges in schema public grant all on tables to service_role; alter default privileges in schema public grant all on sequences to service_role;');
    await db.exec(fs.readFileSync(new URL('../supabase/migrations/20261017150000_workflow_capture_commands.sql',import.meta.url),'utf8'));
    assert.equal((await db.query("select has_table_privilege('service_role','public.workflow_capture_commands','update') allowed")).rows[0].allowed,true,'reproduce hosted default grants');
    await db.exec(fs.readFileSync(new URL('../supabase/migrations/20261018044436_workflow_capture_privileges.sql',import.meta.url),'utf8'));
    await db.query('insert into public.projects values($1)',[project]);
    await db.query("insert into public.project_members(project_id,user_id,role) values($1,$2,'owner'),($1,$3,'editor')",[project,actor,other]);
    await db.query("insert into public.workflow_coordinator_leases values($1,$2,1,clock_timestamp()+interval '5 minutes')",[project,owner]);
    const hash='a'.repeat(64),sourceHash='b'.repeat(64);
    const record=(request:string,who=actor)=>({payloadHash:hash,submission:{id:randomUUID(),requestId:request,participantId:who,status:'submitted',capturedChanges:[{sourceId:'source-one',sourceHash}]}});
    const commit=(request:string,value=record(request),payloadHash=hash,epoch=1)=>db.asRole('service_role','select public.commit_workflow_capture($1,$2,$3,$4,$5,$6,$7) receipt',[project,owner,epoch,value.submission.participantId,request,payloadHash,JSON.stringify(value)]);
    const lookup=(request:string,who=actor)=>db.asRole('service_role','select public.read_workflow_capture($1,$2,1,$3,$4) receipt',[project,owner,who,request]);
    const value=record('first'),duplicates=await Promise.all([commit('first',value),commit('first',value)]);
    assert.equal(duplicates[0].rows[0].receipt.cursor,duplicates[1].rows[0].receipt.cursor);
    assert.equal((await lookup('first')).rows[0].receipt.submission.id,value.submission.id);
    assert.equal((await lookup('first',other)).rows[0].receipt,null);
    await assert.rejects(commit('first',{...value,payloadHash:'c'.repeat(64)},'c'.repeat(64)),/identity conflict/);
    await assert.rejects(commit('forged',record('forged',other)),/source identity conflict/);
    await assert.rejects(commit('stale',record('stale'),hash,2),/Stale/);
    for(const role of ['anon','authenticated'] as const){
      await assert.rejects(db.asRole(role,'select * from public.workflow_capture_commands'),/permission denied/);
      await assert.rejects(db.asRole(role,'select * from public.workflow_capture_sources'),/permission denied/);
      await assert.rejects(db.asRole(role,'select public.read_workflow_capture($1,$2,1,$3,$4)',[project,owner,actor,'first']),/permission denied/);
      await assert.rejects(db.asRole(role,'select public.commit_workflow_capture($1,$2,1,$3,$4,$5,$6)',[project,owner,actor,'first',hash,JSON.stringify(value)]),/permission denied/);
    }
    await assert.rejects(db.asRole('service_role','delete from public.workflow_capture_commands'),/permission denied/);
    await assert.rejects(db.asRole('service_role',"update public.workflow_capture_commands set request_id='changed'"),/permission denied/);
    await assert.rejects(db.asRole('service_role','delete from public.workflow_capture_sources'),/permission denied/);
    await assert.rejects(db.asRole('service_role',"update public.workflow_capture_sources set source_hash='changed'"),/permission denied/);
    await assert.rejects(db.asRole('service_role','truncate public.workflow_capture_commands'),/permission denied/);
    await assert.rejects(db.asRole('service_role',"select setval('public.workflow_capture_commands_cursor_seq',1)"),/permission denied/);
    const ordered=await Promise.all([commit('second'),commit('third')]);assert.notEqual(ordered[0].rows[0].receipt.cursor,ordered[1].rows[0].receipt.cursor);
    if(db.concurrentConnections){
      await db.exec("create function public.capture_delay() returns trigger language plpgsql as $$ begin if new.request_id='blocked' then perform pg_sleep(0.25); end if; return new; end $$; create trigger capture_delay before insert on public.workflow_capture_commands for each row execute function public.capture_delay();");
      const pending=commit('blocked');void pending.catch(()=>{});
      const deadline=Date.now()+5000;let sleeping=false;
      while(Date.now()<deadline){sleeping=Number((await db.query("select count(*) n from pg_stat_activity where datname=current_database() and wait_event='PgSleep' and query like '%commit_workflow_capture%'")).rows[0].n)>0;if(sleeping)break;await new Promise(resolve=>setTimeout(resolve,10));}
      assert.ok(sleeping,'native writer reached the transaction gate');
      const found=await lookup('blocked');assert.ok(found.rows[0].receipt,'lookup waits for the uncertain writer to commit');await pending;
      console.log('Native PostgreSQL capture contention and linearizable lookup passed');
    }else console.log('Embedded PostgreSQL capture semantics passed; native contention remains a separate CI gate');
    await db.query('delete from public.project_members where project_id=$1 and user_id=$2',[project,actor]);
    await assert.rejects(lookup('first'),/membership denied/);await assert.rejects(commit('revoked'),/membership denied/);
    assert.equal(Number((await db.query('select count(*) n from public.workflow_capture_commands')).rows[0].n),db.concurrentConnections?4:3);
  }finally{await db.close();}
});
