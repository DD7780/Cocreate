import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import type { WebSocket } from "ws";
import type {
  AgentAssignment,
  AIRunCall,
  AIRunRecord,
  AIFormat,
  AIModel,
  AIProvider,
  AISetupPolicy,
  AIUsage,
  ConflictGroup,
  Contradiction,
  ModelChecks,
  Participant,
  ProductSource,
  ProviderRequestRecord,
  Requirement,
  RoomView,
  RequirementRevision,
  SharedRequirement,
  Version,
} from "../shared/types.js";
import { type AgentChange } from "./generator.js";
import { type ProjectFile, type ProjectSpec } from "./project.js";
import { type EncryptedSecret } from "./credentials.js";

export type ProjectRole = "owner" | "editor" | "viewer";

export type DurableStore = {
  saveSnapshot: (
    projectId: string,
    revision: number,
    payload: Record<string, unknown>,
  ) => Promise<unknown>;
  appendDocumentUpdate: (
    projectId: string,
    sequence: number,
    actorId: string,
    update: Uint8Array,
  ) => Promise<unknown>;
  assertCoordinator?: (projectId: string) => Promise<void>;
  recordProviderRequest?: (record: ProviderRequestRecord) => Promise<void>;
  reserveManagedRequest?: (input: {
    callId: string;
    projectId: string;
    actorId: string;
    modelId: string;
    catalogVersion: string;
    reservedUsd: number;
  }) => Promise<void>;
  settleManagedRequest?: (input: {
    callId: string;
    actualUsd: number | null;
    providerRequestId?: string;
    usage: Record<string, unknown>;
  }) => Promise<void>;
};

export type ClientSocket = WebSocket & {
  authorizeRead?: () => Promise<void>;
  deliveryQueue?: Promise<void>;
  participantId?: string;
  awarenessClientId?: number;
  role?: ProjectRole;
  ticketExpiresAt?: number;
};

export type StoredVersion = Version & {
  source?: ProductSource;
  files?: ProjectFile[];
  bundle: string;
  css?: string;
  decisions?: string[];
  specification?: ProjectSpec;
};

export type EditRecord = AgentChange & {
  participantId: string;
  at: string;
  update: string;
};

export type SubmissionStatus =
  | "submitted"
  | "interpreting"
  | "queued"
  | "built"
  | "failed";

export type StoredSubmission = {
  capturedChanges?: EditRecord[];
  id: string;
  requestId: string;
  participantId: string;
  editSeqs: number[];
  documentRevision: number;
  snapshot: string;
  previousInterpretationId?: string;
  createdAt: string;
  status: SubmissionStatus;
  error?: string;
  assignment?: AgentAssignment;
  setup?: AISetupPolicy;
};

export type StoredConnection = {
  id: string;
  name: string;
  provider: AIProvider;
  baseUrl: string;
  apiFormat: AIFormat;
  encryptedKey?: EncryptedSecret;
  models: AIModel[];
  checks: Record<string, ModelChecks>;
  status: "saved" | "reachable" | "error";
  lastError?: string;
};

export type AISettings = {
  mode: "disconnected" | "demo" | "openai" | "managed" | "byok_lease";
  connections?: StoredConnection[];
  personal?: AgentAssignment;
  builder?: AgentAssignment;
  participantOverrides?: Record<string, AgentAssignment>;
  savedCustom?: {
    personal: AgentAssignment;
    builder: AgentAssignment;
    participantOverrides: Record<string, AgentAssignment>;
  };
  setup?: AISetupPolicy;
  provider?: AIProvider;
  baseUrl?: string;
  apiFormat?: AIFormat;
  personalModel?: string;
  builderModel?: string;
  encryptedKey?: EncryptedSecret;
};

export type BudgetWindow = {
  id: string;
  startedAt: number;
  maximumUsd: number;
  reservedUsd: number;
  actualUsd: number;
  uncertainUsd: number;
  inputTokens: number;
  outputTokens: number;
  physicalCalls?: number;
  physicalReservedUsd?: number;
  presetVersion: string;
  pricingVersion: string;
  setup: AISetupPolicy;
};

export type BudgetReservation = {
  amount: number;
  layer: NonNullable<NonNullable<AISetupPolicy["resolved"]>["personal"]>;
};

export type RunWindow = { id: string; startedAt: number; calls: AIRunCall[] };

export type UsageMeta = {
  phase: "interpretation" | "builder" | "repair";
  participantId?: string;
  provider: AIProvider;
  model: string;
};

export type Room = {
  id: string;
  coordinatorEpoch: number;
  doc: Y.Doc;
  awareness: Awareness;
  clients: Set<ClientSocket>;
  participants: Map<string, Participant>;
  ownerId: string | null;
  requirements: Requirement[];
  sharedRequirements: SharedRequirement[];
  requirementRevisions?: RequirementRevision[];
  commandReceipts?: Record<
    string,
    {
      id: string;
      participantId: string;
      requestId: string;
      status: SubmissionStatus;
    }
  >;
  recoveryCheckpoint?: {
    fingerprint: string;
    revision: number;
    files: ProjectFile[];
    task: string;
    index: number;
    total: number;
  };
  executionBudget?: { calls: number; reservedUsd: number; maximumUsd?: number };
  conflictGroups: ConflictGroup[];
  contradictions: Contradiction[];
  specificationRevision: number;
  versions: StoredVersion[];
  ai: AISettings;
  status: RoomView["status"];
  lastError?: string;
  pending: Map<string, EditRecord[]>;
  steeringQueue?: Promise<unknown>;
  persistQueue?: Promise<unknown>;
  documentQueue?: Promise<unknown>;
  submissions: StoredSubmission[];
  editHistory: EditRecord[];
  agentRevisions: Map<string, number>;
  agentTasks: Map<string, Promise<void>>;
  agentControllers: Map<string, AbortController>;
  timers: Map<string, NodeJS.Timeout>;
  requestedRevision: number;
  buildTask?: Promise<void>;
  buildTimer?: NodeJS.Timeout;
  buildController?: AbortController;
  pendingBuildSince?: number;
  lastEditAt?: number;
  lastBuildAt?: number;
  lastBuiltFingerprint?: string;
  lastBuiltRequirements?: SharedRequirement[];
  usage: AIUsage;
  providerCalls: ProviderRequestRecord[];
  providerLedger?: Map<string, ProviderRequestRecord>;
  budgetWindow?: BudgetWindow;
  runWindow?: RunWindow;
  aiRuns: AIRunRecord[];
  saveTimer?: NodeJS.Timeout;
  persistRevision: number;
  savedAt?: string;
};
