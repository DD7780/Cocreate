import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { checkStagingPreparation, type AccountInspection } from '../scripts/check-staging-preparation.js';
import { assertPrivateHostedFixture, validateHostedFixture, verifyHostedBeta, type HostedFixture } from '../scripts/verify-hosted-beta.js';

const production = JSON.parse(fs.readFileSync('wrangler.jsonc','utf8'));
const now = Date.parse('2026-10-12T08:00:00Z');
const inspection = (): AccountInspection => ({ checkedAt:new Date(now).toISOString(), source:'provider_dashboard',
  supabase:{ organizationId:'lflzfrqblfyjopsjuqxk', plan:'free',activeVisibleProjects:1,freeEligibilityConfirmed:true },
  cloudflare:{ accountId:production.account_id,workersPaidConfirmed:true,billingCycleStart:'2026-10-01T00:00:00Z',billingCycleEnd:'2026-11-01T00:00:00Z' } });
const target = { accountId:production.account_id,workerName:'cocreate-beta-staging',origin:'https://cocreate-beta-staging.susan981314271.workers.dev',supabaseUrl:`https://${'a'.repeat(20)}.supabase.co`,publishableKey:'sb_publishable_synthetic_public_key' };

test('preparation separates reviewed account availability, allocated config and actual authority', () => {
  const unallocated = checkStagingPreparation(inspection(),null,production,now);
  assert.equal(unallocated.readyForResourceReview,true); assert.equal(unallocated.publicConfigurationPrepared,false);
  assert.deepEqual(unallocated.pending,['allocated_isolated_public_target']);
  const result = checkStagingPreparation(inspection(),target,production,now);
  assert.deepEqual(result.pending,[]); assert.match(result.draftConfigurationSha256!,/^[a-f0-9]{64}$/);
  for(const key of ['creationAuthorized','deploymentPerformed','hostedVerified','mainPushPerformed'] as const)assert.equal(result[key],false);
});

test('unknown, false, incomplete, stale or wrong-account inspection never passes resource review', () => {
  for(const value of [null,false]) {
    const a=inspection();a.supabase.freeEligibilityConfirmed=value;assert.equal(checkStagingPreparation(a,target,production,now).readyForResourceReview,false);
    const b=inspection();b.cloudflare.workersPaidConfirmed=value;assert.equal(checkStagingPreparation(b,target,production,now).readyForResourceReview,false);
  }
  for(const update of [
    (v:AccountInspection)=>{v.source='incomplete'},(v:AccountInspection)=>{v.checkedAt='2026-10-10T00:00:00Z'},
    (v:AccountInspection)=>{v.cloudflare.billingCycleEnd='2026-10-11T00:00:00Z'},(v:AccountInspection)=>{v.cloudflare.accountId='b'.repeat(32)},
    (v:AccountInspection)=>{v.supabase.organizationId='b'.repeat(20)},(v:AccountInspection)=>{v.supabase.activeVisibleProjects=2},
  ]){const v=inspection();update(v);assert.equal(checkStagingPreparation(v,target,production,now).readyForResourceReview,false);}
});

test('preparation rejects undeclared secret fields and invalid timestamps without echoing their values', () => {
  for(const update of [(v:any)=>{v.token='synthetic_private_value'},(v:any)=>{v.cloudflare.token='synthetic_private_value'},(v:any)=>{v.supabase.password='synthetic_private_value'},(v:any)=>{v.cloudflare.billingCycleStart='invalid'}]) {
    const v=inspection();update(v);assert.throws(()=>checkStagingPreparation(v,target,production,now),error=>!String(error).includes('synthetic_private_value'));
  }
});

test('production, unallocated, foreign-account or larger interactive targets remain unprepared', () => {
  for(const v of [{...target,origin:production.vars.COCREATE_PUBLIC_ORIGIN},{...target,supabaseUrl:production.vars.SUPABASE_URL},{...target,accountId:'b'.repeat(32)},{...target,publishableKey:'REPLACE_WITH_KEY'},{...target,workerName:'cocreate-unapproved-staging'}])assert.equal(checkStagingPreparation(inspection(),v,production,now).publicConfigurationPrepared,false);
  const larger=structuredClone(production);larger.containers[0].instance_type='standard-1';assert.equal(checkStagingPreparation(inspection(),target,larger,now).publicConfigurationPrepared,false);
});

test('native Windows fixture admission accepts private ACL and rejects a Users-readable file', {skip:process.platform !== 'win32'}, () => {
  const file=path.resolve('.runtime',`staging-acl-test-${randomUUID()}.json`);
  fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,'{"scope":"synthetic private-file check; no credentials"}');
  const powershell=path.join(process.env.SystemRoot || 'C:\\Windows','System32','WindowsPowerShell','v1.0','powershell.exe');
  const run=(script:string)=>execFileSync(powershell,['-NoProfile','-NonInteractive','-Command',"$ErrorActionPreference='Stop';"+script],{env:{...process.env,COCREATE_FIXTURE_PATH:file},windowsHide:true,stdio:'pipe'});
  try {
    run(`$sid=[Security.Principal.WindowsIdentity]::GetCurrent().User;$acl=[IO.File]::GetAccessControl($env:COCREATE_FIXTURE_PATH);$acl.SetAccessRuleProtection($true,$false);$acl.AddAccessRule([Security.AccessControl.FileSystemAccessRule]::new($sid,'FullControl','Allow'));[IO.File]::SetAccessControl($env:COCREATE_FIXTURE_PATH,$acl)`);
    assertPrivateHostedFixture(file);
    run(`$acl=[IO.File]::GetAccessControl($env:COCREATE_FIXTURE_PATH);$acl.AddAccessRule([Security.AccessControl.FileSystemAccessRule]::new([Security.Principal.SecurityIdentifier]::new('S-1-5-32-545'),'Read','Allow'));[IO.File]::SetAccessControl($env:COCREATE_FIXTURE_PATH,$acl)`);
    assert.throws(()=>assertPrivateHostedFixture(file));
  } finally {fs.unlinkSync(file);}
});

test('platform-first permission fixtures need no optional session and reject enabled capability before credentials', async () => {
  const projectId=randomUUID();
  const fixture:HostedFixture={target,sourceCommit:'a'.repeat(40),releaseFingerprint:'b'.repeat(64),projectId,otherProjectId:randomUUID(),
    accounts:Object.fromEntries(['owner','editor','viewer','unapproved','outsider','revoked'].map(role=>[role,{userId:randomUUID(),accessToken:`synthetic_private_token_${role}`}])) as HostedFixture['accounts'],
    artifactPath:`/api/rooms/${projectId}/download/1`,artifactSha256:'c'.repeat(64),storagePath:`${projectId}/bodies/test`,storageSha256:'d'.repeat(64),browserSessionId:null,blenderSessionId:null};
  validateHostedFixture(fixture,production);
  const original=globalThis.fetch;let enabled=false;const requested:string[]=[];
  globalThis.fetch=async(input)=>{const url=String(input);requested.push(url);return url.endsWith('/__cocreate/app-health')?Response.json({release_fingerprint:fixture.releaseFingerprint,capabilities:{shared_browser:enabled,connected_blender:false}}):new Response('',{status:401})};
  try {
    const result=await verifyHostedBeta(fixture,async()=>false);
    assert.equal(result.complete,false);assert.ok(result.pending.some(name=>name.includes('no session configured')));
    assert.ok(result.checks.find(item=>item.name==='browser_fixture_capability_disabled')?.passed);
    assert.ok(!requested.some(url=>/\/browser\/|\/blender\//.test(url)));
    enabled=true;requested.length=0;
    const blocked=await verifyHostedBeta(fixture,async()=>false);
    assert.ok(blocked.checks.some(item=>item.name==='browser_fixture_capability_disabled'&&!item.passed));assert.equal(requested.length,1);
  } finally {globalThis.fetch=original;}
});
