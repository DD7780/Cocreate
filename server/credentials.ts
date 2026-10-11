import{createCipheriv,createDecipheriv,createHash,randomBytes}from'node:crypto';
export type EncryptedSecret={iv:string;tag:string;value:string};const keyFor=(secret:string)=>createHash('sha256').update(secret).digest();
export function encryptSecret(secret:string,plaintext:string):EncryptedSecret{const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',keyFor(secret),iv),value=Buffer.concat([cipher.update(plaintext,'utf8'),cipher.final()]);return{iv:iv.toString('base64url'),tag:cipher.getAuthTag().toString('base64url'),value:value.toString('base64url')}}
export function decryptSecret(secret:string,encrypted:EncryptedSecret){const decipher=createDecipheriv('aes-256-gcm',keyFor(secret),Buffer.from(encrypted.iv,'base64url'));decipher.setAuthTag(Buffer.from(encrypted.tag,'base64url'));return Buffer.concat([decipher.update(Buffer.from(encrypted.value,'base64url')),decipher.final()]).toString('utf8')}

export function serverSecrets(options: { sessionSecret?: string; encryptionSecret?: string }, env = process.env) {
  const sessionSecret = options.sessionSecret || env.SESSION_SECRET;
  const encryptionSecret = options.encryptionSecret || env.CREDENTIAL_ENCRYPTION_SECRET;
  if (env.COCREATE_HOSTED === 'true') {
    for (const [name, value] of [['SESSION_SECRET', sessionSecret], ['CREDENTIAL_ENCRYPTION_SECRET', encryptionSecret]]) {
      if (!value || value.length < 32 || value.length > 512 || value.trim() !== value || /^(?:replace|cocreate-local)/i.test(value)) {
        throw new Error(`Hosted startup requires a private non-placeholder ${name} of 32–512 characters.`);
      }
    }
    if (sessionSecret === encryptionSecret) throw new Error('Hosted signing and credential-encryption secrets must be independent.');
  }
  return { sessionSecret: sessionSecret || 'cocreate-local-session-secret', encryptionSecret: encryptionSecret || sessionSecret || 'cocreate-local-session-secret' };
}
