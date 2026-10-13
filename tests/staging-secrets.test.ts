import assert from 'node:assert/strict';
import test from 'node:test';
import {parseStagingSecrets,readStagingSecrets} from '../scripts/check-staging-secrets.js';

const fixture = {SESSION_SECRET:'a'.repeat(64),CREDENTIAL_ENCRYPTION_SECRET:'b'.repeat(64),SUPABASE_SECRET_KEY:'sb_secret_synthetic_private_value'};
test('private staging configuration accepts independent secrets without changing their values',()=>{
  assert.deepEqual(parseStagingSecrets(JSON.stringify(fixture)),fixture);
});
test('private staging parser never exposes malformed or invalid credential values in errors',()=>{
  for (const json of [
    '{"SUPABASE_SECRET_KEY":sb_secret_synthetic_private_value}',
    JSON.stringify({...fixture,SESSION_SECRET:fixture.SUPABASE_SECRET_KEY}),
    JSON.stringify({...fixture,CREDENTIAL_ENCRYPTION_SECRET:fixture.SESSION_SECRET}),
    JSON.stringify({...fixture,SUPABASE_SECRET_KEY:null}),
    JSON.stringify({...fixture,unexpected:fixture.SUPABASE_SECRET_KEY}),
    JSON.stringify([fixture]),'null',JSON.stringify({...fixture,SUPABASE_SECRET_KEY:'sb_secret_'+ 'x'.repeat(4096)}),
  ]) assert.throws(()=>parseStagingSecrets(json),error=> error instanceof Error && !String(error.stack).includes('synthetic_private_value') && /credential details suppressed/.test(error.message));
  assert.throws(()=>readStagingSecrets('missing-synthetic-private-value.json'),error=>error instanceof Error && !String(error.stack).includes('missing-synthetic-private-value'));
});
