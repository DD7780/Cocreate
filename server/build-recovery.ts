import type { SharedRequirement } from '../src/types.js';
import { applyOperations, budgetProjectFiles, validateProjectPath, type ProjectFile, type ProjectPlan } from './project.js';
import { generateStructured, ProviderError, type ProviderConfig, type Usage } from './providers.js';

export type RecoveryCheckpoint = { task: string; index: number; total: number; files: ProjectFile[]; plan: ProjectPlan };
const taskSchema = {
  type: 'object', additionalProperties: false, required: ['tasks'], properties: {
    tasks: { type: 'array', minItems: 1, maxItems: 8, items: {
      type: 'object', additionalProperties: false, required: ['title', 'path', 'instruction'],
      properties: { title: { type: 'string' }, path: { type: 'string' }, instruction: { type: 'string' } },
    } },
  },
};
const addUsage = (target: Usage, usage: Usage) => {
  for (const key of ['inputTokens', 'outputTokens', 'cachedInputTokens', 'cacheWriteTokens', 'reasoningTokens'] as const) {
    if (usage[key] !== undefined) target[key] = (target[key] ?? 0) + usage[key]!;
  }
  if (usage.reasoningIncludedInOutput) target.reasoningIncludedInOutput = true;
};

/** Whole JSON envelopes cannot be resumed safely. Plan smaller complete operations instead. */
export async function recoverProjectPlan(input: {
  provider: ProviderConfig; model: string; maxOutputTokens: number; instructions: string;
  schema: Record<string, unknown>; requirements: SharedRequirement[]; changedRequirements?:SharedRequirement[];removedRequirements?:SharedRequirement[];currentFiles?: ProjectFile[];
  signal?: AbortSignal; initialUsage?: Usage; checkpoint?: (value: RecoveryCheckpoint) => Promise<void>;
}) {
  const usage: Usage = { ...input.initialUsage };
  const acceptedRequirements = input.requirements.map(({ id, description, acceptanceCriteria }) => ({ id, description, acceptanceCriteria }));
  const request = { model: input.model, signal: input.signal, timeoutMs: 150_000, retryTruncated: false };
  let planned:Awaited<ReturnType<typeof generateStructured>>;
  try{planned = await generateStructured(input.provider, {
    ...request, maxOutputTokens: Math.min(2_000, input.maxOutputTokens), schema: taskSchema,
    instructions: 'The previous whole-project response exceeded its output allowance. Decompose the accepted change into at most eight small, ordered, coherent file tasks. Each task writes one source file. Introduce focused modules before the entrypoint that imports them. Preserve working behavior. Do not include code in this plan. Only src/ paths. Do not regenerate unchanged files. If a file is large, split it into modules. Focus only on changed and removed requirements. Preserve already implemented accepted behavior; do not regenerate the complete product.',
    input: JSON.stringify({ acceptedRequirements,changedRequirements:input.changedRequirements,removedRequirements:input.removedRequirements, files: (input.currentFiles || []).map(file => ({ path: file.path, bytes: Buffer.byteLength(file.content) })) }),
  });}catch(error){
    if(error instanceof ProviderError)addUsage(usage,error.usage||{});
    throw new ProviderError(error instanceof ProviderError?error.kind:'invalid_output',`Recovery planner failed on its bounded attempt; 0 file tasks completed. The working artifact is retained. Submit a smaller change or select a compatible builder. ${error instanceof Error?error.message:String(error)}`,false,undefined,usage);
  }
  addUsage(usage, planned.usage);
  const tasks = planned.value.tasks as { title: string; path: string; instruction: string }[];
  for(const task of tasks)validateProjectPath(task.path);
  let working = input.currentFiles, lastPlan: ProjectPlan | undefined;
  const operations: ProjectPlan['operations'] = [];
  for (const [index, task] of tasks.entries()) {
    const project = budgetProjectFiles(working, 24_000);
    // Always include the complete target file, even when omitted from the general context budget.
    const target = working?.find(file => file.path === task.path);
    const files = target ? [...project.files.filter(file => file.path !== target.path), target] : project.files;
    try {
      const result = await generateStructured(input.provider, {
        ...request, maxOutputTokens: input.maxOutputTokens, schema: input.schema,
        instructions: `${input.instructions}\nExecute ONLY this small file task. Return exactly one complete write operation for the specified path. Do not repeat other files. This is a new complete JSON envelope, never a continuation of truncated text.`,
        input: JSON.stringify({ acceptedRequirements, task, taskIndex: index + 1, totalTasks: tasks.length, currentProject: files, omittedUnchangedFiles: project.omitted }),
      });
      addUsage(usage, result.usage);
      const plan = result.value as ProjectPlan;
      if (plan.operations.length !== 1 || plan.operations[0].path !== task.path || plan.operations[0].type !== 'write') {
        throw new Error('Recovery must return exactly the planned complete file operation.');
      }
      working = applyOperations(working, plan.operations);
      await input.checkpoint?.({ task: task.title, index: index + 1, total: tasks.length, files: working, plan });
      operations.push(...plan.operations);
      lastPlan = plan;
    } catch (error) {
      if (error instanceof ProviderError) addUsage(usage, error.usage || {});
      throw new ProviderError(error instanceof ProviderError ? error.kind : 'invalid_output',
        `Recovery task ${index + 1}/${tasks.length} (${task.title}, ${task.path}) failed after ${index} completed tasks. Completed results are checkpointed; the working artifact is retained. Submit a smaller change or reconnect/select a compatible builder and Retry build. ${error instanceof Error ? error.message : String(error)}`,
        false, undefined, usage);
    }
  }
  return { value: { ...lastPlan!, operations }, usage };
}
