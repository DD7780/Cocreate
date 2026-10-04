import test from "node:test";
import assert from "node:assert/strict";
import {
  inspectSources,
  validateReview,
  JEV_MODEL,
  scopeViolations,
  reviewService,
  requestReview,
  VERCEL_JEV_MODEL,
  cachedReview,
} from "../scripts/codebase-audit.js";

test("audit follows the prepared isolated worker without hiding missing source imports", () => {
  const result = inspectSources([
    { file: "server/index.ts", source: 'import "./isolation.js";' },
    {
      file: "server/isolation.ts",
      source: 'const worker = readFileSync(join(sourceDirectory, "compiler-worker.cjs"));',
    },
    {
      file: "server/isolation/compiler-worker.cjs",
      source: 'const compiler = require("./esbuild.cjs"); require("./missing.cjs");',
    },
    { file: "server/other.cjs", source: 'require("./esbuild.cjs");' },
  ]);
  const worker = result.files.find(file => file.file.endsWith("compiler-worker.cjs"))!;
  assert.equal(worker.runtimeReachable, true);
  assert.equal(worker.unknownDynamicLoad, true);
  assert.deepEqual(worker.importedBy, ["server/isolation.ts"]);
  assert.deepEqual(result.unresolvedLocalImports.sort(), [
    "server/isolation/compiler-worker.cjs: ./missing.cjs",
    "server/other.cjs: ./esbuild.cjs",
  ]);
});

test("UI scope rejects backend authority, shared contracts and migrations", () => {
  assert.deepEqual(
    scopeViolations(
      [
        "src/App.tsx",
        "server/rooms.ts",
        "shared/types.ts",
        "supabase/migrations/example.sql",
        "worker/container.js",
      ],
      "ui",
    ),
    [
      "server/rooms.ts",
      "shared/types.ts",
      "supabase/migrations/example.sql",
      "worker/container.js",
    ],
  );
  assert.deepEqual(
    scopeViolations(["server/rooms.ts", "shared/types.ts"], "full"),
    [],
  );
  assert.throws(() => scopeViolations([], "unknown"));
  assert.deepEqual(
    scopeViolations(
      [
        "README.md",
        "supabase/migrations/change.sql",
        "Dockerfile",
        "package.json",
      ],
      "docs",
    ),
    ["supabase/migrations/change.sql", "Dockerfile", "package.json"],
  );
});

test("Vercel and direct TypeSafe reviews use separate endpoints and credentials without retries", async () => {
  const gateway = reviewService("vercel");
  assert.equal(gateway.credentialEnv, "AI_GATEWAY_API_KEY");
  assert.equal(gateway.model, VERCEL_JEV_MODEL);
  assert.equal(gateway.modelVersionPinned, false);
  const direct = reviewService("typesafe");
  assert.equal(direct.endpoint, "https://api.typesafe.ai/v1/systemone");
  assert.equal(direct.credentialEnv, "TYPESAFE_API_KEY");
  assert.equal(direct.model, JEV_MODEL);
  assert.equal(direct.modelVersionPinned, true);
  assert.throws(() => reviewService("https://untrusted.example"));
  let calls = 0;
  const mockFetch: typeof fetch = async (url, options) => {
    calls++;
    assert.equal(url, "https://ai-gateway.vercel.sh/typesafe/v1/systemone");
    assert.equal(options?.redirect, "error");
    assert.equal(
      (options?.headers as Record<string, string>).Authorization,
      "Bearer fixture-only",
    );
    assert.equal(JSON.parse(options?.body as string).model, VERCEL_JEV_MODEL);
    return new Response(null, { status: 403 });
  };
  await assert.rejects(
    requestReview(gateway, "fixture-only", { model: gateway.model }, mockFetch),
    /vercel HTTP 403/,
  );
  assert.equal(calls, 1);
});

test("audit retains literal dynamic and type imports, ambient declarations and tooling roots", () => {
  const result = inspectSources([
    {
      file: "src/main.tsx",
      source:
        "import('./App'); import type { State } from '../shared/types.js';",
    },
    { file: "src/App.tsx", source: "export const App = 1;" },
    { file: "shared/types.ts", source: "export type State = string;" },
    { file: "src/vite-env.d.ts", source: "declare const ambient: string;" },
    { file: "tests/example.test.ts", source: "import '../server/tool.js';" },
    { file: "server/tool.ts", source: "export const tool = true;" },
    { file: "components/unused.tsx", source: "export const unused = 1;" },
  ]);
  assert.deepEqual(result.candidates, ["components/unused.tsx"]);
  assert.equal(
    result.files.find((file) => file.file === "shared/types.ts")
      ?.runtimeReachable,
    true,
  );
  assert.deepEqual(result.boundaryViolations, []);
});

test("audit reports browser/server coupling and preserves uncertainty about nonliteral loads", () => {
  const result = inspectSources([
    {
      file: "src/main.tsx",
      source: "import '../server/private.js'; import(moduleName);",
    },
    { file: "server/private.ts", source: "export const internal = true;" },
  ]);
  assert.deepEqual(result.boundaryViolations, [
    "src/main.tsx -> server/private.ts",
  ]);
  assert.equal(result.files[1].unknownDynamicLoad, true);
  const changed = inspectSources([
    { file: "src/main.tsx", source: "export const changed = true;" },
  ]);
  assert.notEqual(result.fingerprint, changed.fingerprint);
});

test("untrusted Jev output cannot introduce unknown options, invalid probabilities or a different model", () => {
  const valid = {
    model: JEV_MODEL,
    answers: {
      purpose: {
        type: "choice",
        choice: "uncertain",
        confidence: 0.5,
        probabilities: {
          active: 0.1,
          tooling: 0.1,
          compatibility: 0.1,
          obsolete_candidate: 0.1,
          uncertain: 0.6,
        },
      },
      relevance: { type: "score", score: 1.5, confidence: 0.7 },
    },
    usage: { input_tokens: 123 },
  };
  assert.equal(validateReview(valid).inputTokens, 123);
  const gatewayResponse = {
    ...valid,
    model: VERCEL_JEV_MODEL,
    provider_metadata: { gateway: { cost: "0.00001155" } },
  };
  assert.equal(
    validateReview(gatewayResponse, VERCEL_JEV_MODEL).reportedCostUsd,
    0.00001155,
  );
  const now = Date.parse("2026-10-04T00:00:00Z");
  assert.equal(
    cachedReview(
      { ...gatewayResponse, evaluatedAt: new Date(now).toISOString() },
      reviewService("vercel"),
      now,
    ).inputTokens,
    123,
  );
  assert.throws(() =>
    cachedReview(gatewayResponse, reviewService("vercel"), now),
  );
  assert.throws(() =>
    cachedReview(
      { ...gatewayResponse, evaluatedAt: "2026-10-02T00:00:00Z" },
      reviewService("vercel"),
      now,
    ),
  );
  assert.throws(() =>
    cachedReview(
      { ...gatewayResponse, evaluatedAt: "2026-10-05T00:00:00Z" },
      reviewService("vercel"),
      now,
    ),
  );
  assert.equal(
    cachedReview(valid, reviewService("typesafe"), now).inputTokens,
    123,
  );
  assert.throws(() => validateReview(gatewayResponse));
  assert.throws(() =>
    validateReview(
      { ...gatewayResponse, model: "openai/other" },
      VERCEL_JEV_MODEL,
    ),
  );
  assert.throws(() =>
    validateReview(
      {
        ...gatewayResponse,
        provider_metadata: { gateway: { cost: "unknown" } },
      },
      VERCEL_JEV_MODEL,
    ),
  );
  assert.equal(
    validateReview(
      { ...gatewayResponse, provider_metadata: { gateway: { cost: "0" } } },
      VERCEL_JEV_MODEL,
    ).reportedCostUsd,
    0,
  );
  assert.throws(() => validateReview({ ...valid, model: "other-model" }));
  assert.throws(() =>
    validateReview({ ...valid, usage: { input_tokens: -1 } }),
  );
  assert.throws(() =>
    validateReview({
      ...valid,
      answers: {
        ...valid.answers,
        purpose: { ...valid.answers.purpose, choice: "delete_now" },
      },
    }),
  );
  assert.throws(() =>
    validateReview({
      ...valid,
      answers: {
        ...valid.answers,
        purpose: {
          ...valid.answers.purpose,
          probabilities: {
            ...valid.answers.purpose.probabilities,
            uncertain: 3,
          },
        },
      },
    }),
  );
});
