// Preserve historical deep links without exposing a second application origin.
export function legacyOriginResponse(
  request: Request,
  canonicalOrigin: string | undefined,
  legacyOrigin: string | undefined,
): Response | null {
  if (!canonicalOrigin || !legacyOrigin) return null;
  const incoming = new URL(request.url);
  if (incoming.origin !== legacyOrigin) return null;
  let target: URL;
  try { target = new URL(canonicalOrigin); }
  catch { return new Response('Application origin is unavailable.', { status: 503 }); }
  if (target.protocol !== 'https:' || target.username || target.password ||
      target.pathname !== '/' || target.search || target.hash) {
    return new Response('Application origin is unavailable.', { status: 503 });
  }
  if (!['GET', 'HEAD'].includes(request.method) ||
      request.headers.get('upgrade')?.toLowerCase() === 'websocket') {
    return new Response('Use the application on its canonical domain.', { status: 421 });
  }
  target.pathname = incoming.pathname;
  target.search = incoming.search;
  return new Response(null, { status: 308, headers: {
    Location: target.href, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer',
  } });
}
