import { createHash } from 'node:crypto';
import { ArtifactUnavailableError, canonicalJson } from './artifacts.js';
import type { BrowserState, BrowserDownload } from '../shared/browser-session.js';
export const browserHash = (value: string | Uint8Array) => createHash('sha256').update(value).digest('hex');
export function browserState(value?: unknown, recover = false): BrowserState {
  if (value === undefined) return { sessions: [], downloads: [] };
  const state = structuredClone(value) as BrowserState;
  const invalid = () => { throw new ArtifactUnavailableError('corrupt'); };
  const exact=(object:object,keys:string[])=>{if(Object.keys(object).some(key=>!keys.includes(key)))invalid();};
  if (!state || !Array.isArray(state.sessions) || state.sessions.length > 8 || !Array.isArray(state.downloads) || state.downloads.length > 128) invalid();
  exact(state,['sessions','downloads']);
  for (const session of state.sessions) {
    if (!session || !/^[a-f0-9-]{36}$/.test(session.id) || !session.ownerId || !session.controllerId || !Number.isSafeInteger(session.epoch) || session.epoch < 1 || !Number.isFinite(session.expiresAt) || !['connected','disconnected','expired'].includes(session.state) || typeof session.privateLogin !== 'boolean' || typeof session.paused !== 'boolean' || !Array.isArray(session.observe) || !Array.isArray(session.control) || session.observe.some(id => typeof id !== 'string') || session.control.some(id => !session.observe.includes(id)) || !session.control.includes(session.ownerId) || !session.control.includes(session.controllerId) || !Array.isArray(session.receipts) || session.receipts.length > 256) invalid();
    exact(session,['id','ownerId','controllerId','origin','epoch','observe','control','privateLogin','paused','state','expiresAt','receipts']);
    try { if (new URL(session.origin).origin !== session.origin) invalid(); } catch { invalid(); }
    for (const receipt of session.receipts) {if (!/^[a-f0-9-]{36}$/.test(receipt.id) || !receipt.actorId || !Number.isSafeInteger(receipt.epoch) || !/^[a-f0-9]{64}$/.test(receipt.hash) || !['pending','completed','unknown','cancelled'].includes(receipt.state) || typeof receipt.createdAt !== 'string') invalid();exact(receipt,['id','actorId','epoch','kind','hash','state','createdAt']);}
    if (recover) { session.state = 'disconnected'; session.epoch++; for (const receipt of session.receipts) if (receipt.state === 'pending') receipt.state = 'unknown'; }
  }
  for (const file of state.downloads) if (!file || typeof file.projectId !== 'string' || file.projectId.length > 100 || !/^[a-f0-9-]{36}$/.test(file.id) || !/^[a-f0-9-]{36}$/.test(file.sessionId) || !/^[a-f0-9-]{36}$/.test(file.commandId) || !file.participantId || !/^[A-Za-z0-9_. -]{1,80}\.(txt|md)$/.test(file.name) || file.mime !== 'text/plain' || !Number.isSafeInteger(file.byteLength) || file.byteLength < 1 || file.byteLength > 256 * 1024 || !/^[a-f0-9]{64}$/.test(file.contentHash) || !/^sha256:[a-f0-9]{64}$/.test(file.contentRef)) invalid();
  for(const file of state.downloads)exact(file,['id','sessionId','commandId','participantId','projectId','name','mime','byteLength','contentHash','contentRef','createdAt']);
  if(new Set(state.sessions.map(s=>s.id)).size!==state.sessions.length||new Set(state.downloads.map(d=>d.id)).size!==state.downloads.length||state.sessions.some(s=>new Set(s.receipts.map(r=>r.id)).size!==s.receipts.length))invalid();
  return state;
}
export function browserDownloadBytes(file: Omit<BrowserDownload,'contentRef'>, bytes: Uint8Array) {
  const text = new TextDecoder('utf-8', {fatal:true}).decode(bytes);
  if (!text.length || bytes.length > 256 * 1024 || text.includes('\0') || browserHash(bytes) !== file.contentHash || bytes.length !== file.byteLength) throw new Error('Downloaded file failed validation.');
  return Buffer.from(canonicalJson({ schemaVersion: 1, ...file, body: Buffer.from(bytes).toString('base64') }));
}
export function restoreBrowserDownload(bytes: Uint8Array, file: BrowserDownload) {
  try {
    const value = JSON.parse(Buffer.from(bytes).toString('utf8'));
    const {contentRef,...expected}=file;
    if (value.schemaVersion !== 1 || Object.entries(expected).some(([key,v])=>value[key]!==v) || typeof value.body !== 'string') throw new Error();
    const body=Buffer.from(value.body,'base64'); browserDownloadBytes(expected,body); return body;
  } catch { throw new ArtifactUnavailableError('corrupt'); }
}
