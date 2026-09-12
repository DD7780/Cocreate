import { Container, getContainer } from "@cloudflare/containers";

const baseEnv = {
  NODE_ENV: "production",
  COCREATE_HOSTED: "true",
  PORT: "5173",
};

const generatedSecretsKey = "cocreate-generated-secrets-v1";

function randomSecret() {
  return `${crypto.randomUUID()}${crypto.randomUUID()}`;
}

export class CoCreateContainer extends Container {
  defaultPort = 5173;
  sleepAfter = "30m";
  enableInternet = true;
  envVars = baseEnv;

  async runtimeSecrets() {
    let generated = await this.ctx.storage.get(generatedSecretsKey);
    if (!generated) {
      generated = {
        session: randomSecret(),
        credentials: randomSecret(),
      };
      await this.ctx.storage.put(generatedSecretsKey, generated);
    }

    return {
      SESSION_SECRET: this.env.SESSION_SECRET || generated.session,
      CREDENTIAL_ENCRYPTION_SECRET:
        this.env.CREDENTIAL_ENCRYPTION_SECRET || generated.credentials,
    };
  }

  async fetch(request) {
    try {
      const secrets = await this.runtimeSecrets();
      await this.startAndWaitForPorts({
        ports: [this.defaultPort],
        startOptions: {
          envVars: { ...baseEnv, ...secrets },
          enableInternet: this.enableInternet,
        },
      });
      return await this.containerFetch(request);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        JSON.stringify({
          message: "CoCreate container request failed",
          error: message,
          path: new URL(request.url).pathname,
        }),
      );
      return Response.json(
        {
          error: "CoCreate is temporarily unavailable.",
          detail: message,
        },
        { status: 503 },
      );
    }
  }

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
