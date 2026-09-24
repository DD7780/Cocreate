import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export type Session = { roomId: string; participantId: string; name: string; accountId?: string; role?: 'owner'|'editor'|'viewer'; exp?: number };

const b64 = (input: string | Buffer) => Buffer.from(input).toString('base64url');

export function createSession(secret: string, session: Session) {
  const payload = b64(JSON.stringify(session));
  const sig = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySession(secret: string, token: string | undefined): Session | null {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = createHmac('sha256', secret).update(payload).digest();
  let actual: Buffer;
  try { actual = Buffer.from(sig, 'base64url'); } catch { return null; }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString()) as Session;
    if(parsed.exp && parsed.exp <= Math.floor(Date.now()/1000)) return null;
    return parsed.roomId && parsed.participantId && parsed.name ? parsed : null;
  } catch { return null; }
}

export const roomToken = () => randomBytes(18).toString('base64url');
export const participantId = () => randomBytes(10).toString('base64url');
