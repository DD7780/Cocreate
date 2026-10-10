export type BrowserReceipt = { id: string; actorId: string; epoch: number; kind: string; hash: string; state: 'pending' | 'completed' | 'unknown' | 'cancelled'; createdAt: string };
export type SharedBrowserSession = {
  id: string; ownerId: string; controllerId: string; origin: string; epoch: number;
  observe: string[]; control: string[]; privateLogin: boolean; paused: boolean;
  state: 'connected' | 'disconnected' | 'expired'; expiresAt: number; receipts: BrowserReceipt[];
};
export type BrowserDownload = { id: string; sessionId: string; commandId: string; participantId: string; projectId: string; name: string; mime: 'text/plain'; byteLength: number; contentHash: string; contentRef: string; createdAt: string };
export type BrowserState = { sessions: SharedBrowserSession[]; downloads: BrowserDownload[] };
export type BrowserInput =
  | { kind: 'navigate'; url: string }
  | { kind: 'click'; x: number; y: number }
  | { kind: 'text'; text: string }
  | { kind: 'key'; key: 'Enter' | 'Tab' | 'Backspace' | 'Escape' | 'ArrowUp' | 'ArrowDown' }
  | { kind: 'scroll'; delta: number };

export function validateBrowserInput(value: unknown): BrowserInput {
  if (!value || typeof value !== 'object') throw new Error('Invalid browser input.');
  const input = value as Record<string, unknown>, fields: Record<string, string[]> = { navigate: ['url'], click: ['x','y'], text: ['text'], key: ['key'], scroll: ['delta'] };
  if (typeof input.kind !== 'string' || !fields[input.kind] || Object.keys(input).some(key => key !== 'kind' && !fields[input.kind as string].includes(key))) throw new Error('Unsupported browser operation.');
  if (input.kind === 'navigate' && (typeof input.url !== 'string' || input.url.length > 2048)) throw new Error('Invalid navigation URL.');
  if (input.kind === 'click' && (![input.x,input.y].every(x => Number.isInteger(x) && Number(x) >= 0) || Number(input.x) >= 960 || Number(input.y) >= 640)) throw new Error('Click outside viewport.');
  if (input.kind === 'text' && (typeof input.text !== 'string' || input.text.length < 1 || input.text.length > 1000 || /[\u0000-\u0008\u000b-\u001f]/.test(input.text))) throw new Error('Invalid text input.');
  if (input.kind === 'key' && !['Enter','Tab','Backspace','Escape','ArrowUp','ArrowDown'].includes(String(input.key))) throw new Error('Unsupported key.');
  if (input.kind === 'scroll' && (!Number.isInteger(input.delta) || Math.abs(Number(input.delta)) > 640)) throw new Error('Invalid scroll.');
  return input as BrowserInput;
}
