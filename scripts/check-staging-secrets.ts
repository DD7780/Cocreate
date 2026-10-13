import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {assertPrivateHostedFixture} from './verify-hosted-beta.js';
import {serverSecrets} from '../server/credentials.js';

export function parseStagingSecrets(json: string): {SESSION_SECRET:string; CREDENTIAL_ENCRYPTION_SECRET:string; SUPABASE_SECRET_KEY:string} {
  try {
    if (Buffer.byteLength(json) > 4096) throw new Error();
    const value = JSON.parse(json);
    if (!value || Array.isArray(value) || Object.keys(value).sort().join() !== 'CREDENTIAL_ENCRYPTION_SECRET,SESSION_SECRET,SUPABASE_SECRET_KEY' ||
      typeof value.SUPABASE_SECRET_KEY !== 'string' || !/^sb_secret_[A-Za-z0-9_-]{10,}$/.test(value.SUPABASE_SECRET_KEY)) throw new Error();
    serverSecrets({sessionSecret:value.SESSION_SECRET,encryptionSecret:value.CREDENTIAL_ENCRYPTION_SECRET}, {COCREATE_HOSTED:'true'});
    if (value.SESSION_SECRET === value.SUPABASE_SECRET_KEY || value.CREDENTIAL_ENCRYPTION_SECRET === value.SUPABASE_SECRET_KEY) throw new Error();
    return value;
  } catch { throw new Error('Private staging configuration invalid. Use exactly three declared keys with quoted JSON string values; credential details suppressed.'); }
}

export function readStagingSecrets(file: string) {
  try {
    assertPrivateHostedFixture(file);
    if (fs.statSync(file).size > 4096) throw new Error();
    return parseStagingSecrets(fs.readFileSync(file,'utf8'));
  } catch { throw new Error('Private staging configuration unavailable or invalid. Check ownership, exclusive ACLs and quoted JSON values; credential details suppressed.'); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    readStagingSecrets('.runtime/hosted-beta/server-secrets.json');
    console.log('Private staging configuration and ACL validation passed. Values suppressed; no provider contacted.');
  } catch {
    console.error('Private staging configuration validation failed. Check exclusive file permissions and quoted JSON values. No credential details displayed or provider contacted.');
    process.exitCode=1;
  }
}
