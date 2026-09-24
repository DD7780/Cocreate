import { Container, getContainer } from "@cloudflare/containers";
import { env } from "cloudflare:workers";

const baseEnv = {
  NODE_ENV: "production",
  COCREATE_HOSTED: "true",
  PORT: "5173",
};

export class CoCreateContainer extends Container {
  defaultPort = 5173;
  sleepAfter = "30m";
  enableInternet = true;
  pingEndpoint = "localhost/__cocreate/app-health";
  envVars = {
    ...baseEnv,
    SESSION_SECRET: env.SESSION_SECRET,
    CREDENTIAL_ENCRYPTION_SECRET: env.CREDENTIAL_ENCRYPTION_SECRET,
    COCREATE_AUTH_MODE: "supabase",
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: env.SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SECRET_KEY: env.SUPABASE_SECRET_KEY,
    SUPABASE_JWKS_URL: env.SUPABASE_JWKS_URL,
    SUPABASE_ARTIFACT_BUCKET: env.SUPABASE_ARTIFACT_BUCKET || "cocreate-artifacts",
    COCREATE_APP_ORIGINS: env.COCREATE_APP_ORIGINS,
  };

  onStart() {
    console.log(JSON.stringify({ message: "CoCreate container started" }));
  }

  onError(error) {
    console.error(
      JSON.stringify({
        message: "CoCreate container lifecycle error",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
  }

  onStop() {
    console.log(JSON.stringify({ message: "CoCreate container stopped" }));
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/__cocreate/health") {
      return Response.json({ status: "ok", service: "cocreate-worker" });
    }

    try {
      return await getContainer(env.COCREATE_CONTAINER, "primary").fetch(
        request,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        JSON.stringify({
          message: "CoCreate Worker routing failed",
          error: message,
          path: url.pathname,
        }),
      );
      return Response.json(
        {
          error: "CoCreate could not start.",
          detail: message,
        },
        { status: 503 },
      );
    }
  },
};
