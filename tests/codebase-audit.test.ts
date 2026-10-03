import test from "node:test";
import assert from "node:assert/strict";
import {
  inspectSources,
  validateReview,
  JEV_MODEL,
  scopeViolations,
} from "../scripts/codebase-audit.js";

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
