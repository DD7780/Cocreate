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
