// During mixed-version rollout the original slot stays authoritative; originals are never deleted on read.
const legacyKey = (key: string) => {
  if (!key.startsWith('2guys1canvas-')) throw new Error('Unknown application storage namespace.');
  return key.replace(/^2guys1canvas-/, 'cocreate-');
};
export function readBrowserStorage(store: Storage, key: string) {
  return store.getItem(legacyKey(key)) ?? store.getItem(key);
}
export function writeBrowserStorage(store: Storage, key: string, value: string) {
  store.setItem(legacyKey(key), value);
  store.setItem(key, value);
}
export function removeBrowserStorage(store: Storage, key: string) {
  store.removeItem(legacyKey(key));
  store.removeItem(key);
}
export function clearProjectSessionCache(local: Storage, session: Storage) {
  session.clear();
  for (const key of Object.keys(local)) {
    if (/^(2guys1canvas|cocreate)-(session-|product-storage-)/.test(key)) local.removeItem(key);
  }
}
