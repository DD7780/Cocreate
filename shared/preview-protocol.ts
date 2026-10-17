const kinds = ['storage-ready', 'storage-init', 'storage-set', 'storage-remove', 'storage-clear', 'preview-error'] as const;
type PreviewKind = typeof kinds[number];
export function previewMessageKind(type: unknown): PreviewKind | undefined {
  if (typeof type !== 'string') return;
  for (const kind of kinds) if (type === `2guys1canvas-${kind}` || type === `cocreate-${kind}`) return kind;
}
export function previewInitType(readyType: unknown) {
  return readyType === 'cocreate-storage-ready' ? 'cocreate-storage-init' : '2guys1canvas-storage-init';
}
