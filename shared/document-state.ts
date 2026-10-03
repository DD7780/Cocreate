import * as Y from "yjs";

/** State vectors cover inserted clocks; deletion ranges need their own receipt. */
export function deletionSignature(doc: Y.Doc) {
  const entries = [...Y.decodeUpdate(Y.encodeStateAsUpdate(doc)).ds.clients];
  return JSON.stringify(
    entries
      .sort(([a], [b]) => a - b)
      .map(([client, ranges]) => [
        client,
        ranges.map(({ clock, len }) => [clock, len]),
      ]),
  );
}
