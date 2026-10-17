/** Read canonical settings first; legacy deployment inputs are explicit compatibility aliases. */
export function productEnvironment(env: Record<string, unknown>, name: string): string | undefined {
  const current = env[name];
  if (typeof current === 'string') return current;
  const legacy = env[name.replace('TWOGUYS1CANVAS_', 'COCREATE_')];
  return typeof legacy === 'string' ? legacy : undefined;
}

export function canonicalProductEnvironment(env: Record<string, string | undefined>) {
  const result = { ...env };
  for (const key of Object.keys(env)) {
    if (/^(VITE_)?COCREATE_/.test(key)) {
      const canonical = key.replace('COCREATE_', 'TWOGUYS1CANVAS_');
      if (result[canonical] === undefined) result[canonical] = env[key];
    }
  }
  return result;
}
