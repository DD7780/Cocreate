import { productEnvironment } from '../shared/product-environment.js';
import { Container, getContainer } from "@cloudflare/containers";
import { env } from "cloudflare:workers";
import { legacyOriginResponse } from './legacy-origin.js';

const baseEnv = {
  NODE_ENV: "production",
  TWOGUYS1CANVAS_HOSTED: "true",
  PORT: "5173",
};

export class TwoGuysOneCanvasContainer extends Container {
  defaultPort = 5173;
  sleepAfter = "30m";
  enableInternet = true;
  pingEndpoint = "localhost/__2guys1canvas/app-health";
  envVars = {
    ...baseEnv,
    SESSION_SECRET: env.SESSION_SECRET,
    CREDENTIAL_ENCRYPTION_SECRET: env.CREDENTIAL_ENCRYPTION_SECRET,
    TWOGUYS1CANVAS_AUTH_MODE: "supabase",
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: env.SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SECRET_KEY: env.SUPABASE_SECRET_KEY,
    SUPABASE_JWKS_URL: env.SUPABASE_JWKS_URL,
    SUPABASE_ARTIFACT_BUCKET: env.SUPABASE_ARTIFACT_BUCKET || "cocreate-artifacts",
    TWOGUYS1CANVAS_APP_ORIGINS: productEnvironment(env, 'TWOGUYS1CANVAS_APP_ORIGINS'),
    TWOGUYS1CANVAS_PUBLIC_ORIGIN: productEnvironment(env, 'TWOGUYS1CANVAS_PUBLIC_ORIGIN'),
    RESEND_API_KEY: env.RESEND_API_KEY,
    TWOGUYS1CANVAS_EMAIL_FROM: productEnvironment(env, 'TWOGUYS1CANVAS_EMAIL_FROM'),
  };

  onStart() {
    console.log(JSON.stringify({ message: "2guys1canvas container started" }));
  }

  onError(error) {
    console.error(
      JSON.stringify({
        message: "2guys1canvas container lifecycle error",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
  }

  onStop() {
    console.log(JSON.stringify({ message: "2guys1canvas container stopped" }));
  }
}

export default {
  async scheduled(_event, env) {
    if(!env.RESEND_API_KEY || !productEnvironment(env, 'TWOGUYS1CANVAS_EMAIL_FROM') || !env.SUPABASE_SECRET_KEY || !env.SUPABASE_URL)return;
    // Wake a sleeping container only for durable due mail, using the existing private service key.
    const response=await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/has_due_beta_email`,{
      method:'POST',headers:{apikey:env.SUPABASE_SECRET_KEY,Authorization:`Bearer ${env.SUPABASE_SECRET_KEY}`,'Content-Type':'application/json'},
      body:'{}',signal:AbortSignal.timeout(10_000),
    });
    if(!response.ok)throw new Error(`Beta email schedule lookup failed (${response.status}).`);
    if(await response.json()!==true)return;
    const container=getContainer(env.TWOGUYS1CANVAS_CONTAINER ?? env.COCREATE_CONTAINER,'primary');
    const readiness=await container.fetch(new Request('http://localhost/__2guys1canvas/app-health'));
    const health=readiness.ok?await readiness.json():undefined;
    if(health?.release_fingerprint!==productEnvironment(env, 'TWOGUYS1CANVAS_RELEASE_FINGERPRINT'))throw new Error('Beta email release is still updating.');
  },
  async fetch(request, env) {
    const redirect = legacyOriginResponse(request, productEnvironment(env, 'TWOGUYS1CANVAS_PUBLIC_ORIGIN'), productEnvironment(env, 'TWOGUYS1CANVAS_LEGACY_ORIGIN'), productEnvironment(env, 'TWOGUYS1CANVAS_WWW_ORIGIN'));
    if (redirect) return redirect;
    const url = new URL(request.url);
    if (["/__2guys1canvas/health", "/__cocreate/health"].includes(url.pathname)) {
      return Response.json({ status: "ok", service: "2guys1canvas-worker" });
    }

    try {
      // Worker/image activation is not atomic. Never proxy old ungated application code during rollout.
      if (!/^[a-f0-9]{64}$/.test(productEnvironment(env, 'TWOGUYS1CANVAS_RELEASE_FINGERPRINT') || '')) return Response.json({error:'Release verification unavailable.'}, {status:503});
      const container = getContainer(env.TWOGUYS1CANVAS_CONTAINER ?? env.COCREATE_CONTAINER, 'primary');
      const readiness = await container.fetch(new Request('http://localhost/__2guys1canvas/app-health'));
      const health = readiness.ok ? await readiness.json() : undefined;
      if (health?.release_fingerprint !== productEnvironment(env, 'TWOGUYS1CANVAS_RELEASE_FINGERPRINT')) return Response.json({error:'Application release is updating. Retry shortly.'}, {status:503,headers:{'Cache-Control':'no-store'}});
      if (url.pathname === '/api/beta/waitlist' && env.SESSION_SECRET) {
        const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.SESSION_SECRET), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
        const sign = async (value) => [...new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)))].map(byte=>byte.toString(16).padStart(2,'0')).join('');
        const headers = new Headers(request.headers);
        headers.set('x-2guys1canvas-waitlist-key', await sign(`waitlist-ip:${request.headers.get('CF-Connecting-IP') || 'unknown'}`));
        headers.set('x-cocreate-waitlist-key', headers.get('x-2guys1canvas-waitlist-key'));
        headers.set('x-2guys1canvas-waitlist-proof', await sign('waitlist-proxy-v1'));
        headers.set('x-cocreate-waitlist-proof', headers.get('x-2guys1canvas-waitlist-proof'));
        request = new Request(request, {headers});
      }
      return await container.fetch(
        request,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        JSON.stringify({
          message: "2guys1canvas Worker routing failed",
          error: message,
          path: url.pathname,
        }),
      );
      return Response.json(
        {
          error: "2guys1canvas could not start.",
          detail: message,
        },
        { status: 503 },
      );
    }
  },
};

// Keep the deployed Durable Object class identity until a separately verified resource cutover.
export { TwoGuysOneCanvasContainer as CoCreateContainer };
