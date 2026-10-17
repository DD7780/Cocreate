import * as Y from 'yjs';

// Browser recovery only. Permissions, accepted intent and billing remain on the server.
export type LocalDraftStatus = 'loading' | 'saving' | 'saved' | 'unavailable';
export interface DraftStore {
  read(key: string): Promise<Uint8Array | undefined>;
  merge(key: string, update: Uint8Array): Promise<void>;
}
const databaseName = '2guys1canvas-drafts-v1';
const legacyDatabaseName = 'cocreate-drafts-v1';
const maxBytes = 8 * 1024 * 1024;
export function draftKey(room: string, participant: string) {
  return JSON.stringify([room, participant]);
}
function database(name: string, create = true): Promise<IDBDatabase | undefined> {
  return new Promise((resolve, reject) => {
    let absent = false;
    const request = indexedDB.open(name, 1);
    request.onupgradeneeded = () => {
      if (!create) { absent = true; request.transaction!.abort(); return; }
      request.result.createObjectStore('documents');
    };
    request.onerror = () => absent ? resolve(undefined) : reject(request.error);
    request.onblocked = () => reject(new Error('Local storage is blocked by another tab.'));
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
  });
}
function validatedUpdate(value: unknown) {
  if (!(value instanceof Uint8Array) && !(value instanceof ArrayBuffer)) throw new Error('Invalid cached draft update.');
  const bytes = new Uint8Array(value);
  if (bytes.byteLength > maxBytes) throw new Error('Draft exceeds local storage limit.');
  const probe = new Y.Doc();
  try { Y.applyUpdate(probe, bytes); } finally { probe.destroy(); }
  return bytes;
}
async function readDatabase(name: string, key: string, create = true) {
    const db = await database(name, create);
    if (!db) return;
    try {
      return await new Promise<Uint8Array | undefined>((resolve, reject) => {
        const tx = db.transaction('documents', 'readonly');
        const request = tx.objectStore('documents').get(key);
        tx.oncomplete = () => {
          try { resolve(request.result === undefined ? undefined : validatedUpdate(request.result)); }
          catch (error) { reject(error); }
        };
        tx.onerror = tx.onabort = () => reject(tx.error || new Error('Local read failed.'));
      });
    } finally { db.close(); }
}
async function mergeDatabase(name: string, key: string, update: Uint8Array) {
    const db = (await database(name))!;
    try {
      return await new Promise<Uint8Array>((resolve, reject) => {
        let merged: Uint8Array, failure: unknown;
        // Read/merge/write in one transaction prevents competing tabs losing updates.
        const tx = db.transaction('documents', 'readwrite');
        const store = tx.objectStore('documents'), request = store.get(key);
        request.onsuccess = () => {
          try {
            merged = request.result === undefined ? update : Y.mergeUpdates([validatedUpdate(request.result), update]);
            if (merged.byteLength > maxBytes) throw new Error('Draft exceeds local storage limit.');
            store.put(merged, key);
          } catch (error) { failure = error; tx.abort(); }
        };
        tx.oncomplete = () => resolve(merged!);
        tx.onerror = tx.onabort = () => reject(failure || tx.error || new Error('Local draft could not be saved.'));
      });
    } finally { db.close(); }
}
export const browserDraftStore: DraftStore = {
  async read(key) {
    const [current, legacy] = await Promise.all([readDatabase(databaseName, key), readDatabase(legacyDatabaseName, key, false)]);
    if (!current && !legacy) return;
    const update = validatedUpdate(Y.mergeUpdates([current, legacy].filter((value): value is Uint8Array => !!value)));
    const merged = await mergeDatabase(databaseName, key, update);
    if (legacy) await mergeDatabase(legacyDatabaseName, key, merged);
    return merged;
  },
  async merge(key, update) {
    const legacy = await readDatabase(legacyDatabaseName, key, false);
    const merged = await mergeDatabase(databaseName, key, validatedUpdate(legacy ? Y.mergeUpdates([legacy, validatedUpdate(update)]) : validatedUpdate(update)));
    // Retain a merged original for old tabs and rollback; never delete either store during this bridge.
    await mergeDatabase(legacyDatabaseName, key, merged);
  },
};

export async function restoreDraft(doc: Y.Doc, key: string, store = browserDraftStore) {
  const update = await store.read(key);
  if (!update) return;
  // Validate before touching the live collaborative document.
  const probe = new Y.Doc();
  try { Y.applyUpdate(probe, update); } finally { probe.destroy(); }
  Y.applyUpdate(doc, update);
}

export function persistDraft(doc: Y.Doc, key: string, status: (value: LocalDraftStatus) => void, store = browserDraftStore) {
  let queue = Promise.resolve(), stopped = false, revision = 0;
  const save = (update: Uint8Array) => {
    const current = ++revision;
    status('saving');
    queue = queue.then(() => store.merge(key, update)).then(() => {
      if (!stopped && current === revision) status('saved');
    }).catch(() => { if (!stopped) status('unavailable'); });
  };
  doc.on('update', save);
  return () => { stopped = true; doc.off('update', save); };
}
