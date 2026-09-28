import * as Y from 'yjs';

// Browser recovery only. Permissions, accepted intent and billing remain on the server.
export type LocalDraftStatus = 'loading' | 'saving' | 'saved' | 'unavailable';
export interface DraftStore {
  read(key: string): Promise<Uint8Array | undefined>;
  merge(key: string, update: Uint8Array): Promise<void>;
}
const databaseName = 'cocreate-drafts-v1';
const maxBytes = 8 * 1024 * 1024;
export function draftKey(room: string, participant: string) {
  return JSON.stringify([room, participant]);
}
function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('documents');
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Local storage is blocked by another tab.'));
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
  });
}
export const browserDraftStore: DraftStore = {
  async read(key) {
    const db = await database();
    try {
      return await new Promise<Uint8Array | undefined>((resolve, reject) => {
        const tx = db.transaction('documents', 'readonly');
        const request = tx.objectStore('documents').get(key);
        tx.oncomplete = () => resolve(request.result ? new Uint8Array(request.result) : undefined);
        tx.onerror = tx.onabort = () => reject(tx.error || new Error('Local read failed.'));
      });
    } finally { db.close(); }
  },
  async merge(key, update) {
    const db = await database();
    try {
      await new Promise<void>((resolve, reject) => {
        // Read/merge/write in one transaction prevents competing tabs losing updates.
        const tx = db.transaction('documents', 'readwrite');
        const store = tx.objectStore('documents'), request = store.get(key);
        request.onsuccess = () => {
          try {
            const merged = request.result ? Y.mergeUpdates([new Uint8Array(request.result), update]) : update;
            if (merged.byteLength > maxBytes) throw new Error('Draft exceeds local storage limit.');
            store.put(merged, key);
          } catch { tx.abort(); }
        };
        tx.oncomplete = () => resolve();
        tx.onerror = tx.onabort = () => reject(tx.error || new Error('Local draft could not be saved.'));
      });
    } finally { db.close(); }
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
