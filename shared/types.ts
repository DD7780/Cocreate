export type AgentStatus = "idle" | "understanding" | "ready" | "error";
export type WorkflowStatus =
  | "Waiting for ideas"
  | "Collecting submissions"
  | "Understanding edits"
  | "Decision needed"
  | "Building"
  | "Updated"
  | "Error";
export type WorkflowPhase =
  | "draft"
  | "queued"
  | "running"
  | "awaiting_input"
  | "awaiting_approval"
  | "pause_requested"
  | "paused"
  | "completed"
  | "failed"
  | "cancel_requested"
  | "cancelled";
export type WorkflowTaskState =
  | "planned"
  | "queued"
  | "running"
  | "blocked"
  | "verifying"
  | "completed"
  | "failed"
  | "cancelled"
  | "stale"
  | "interrupted";
export type WorkflowEvidenceStatus =
  | "pending"
  | "passed"
  | "failed"
  | "unverified"
  | "stale";
export type WorkflowTask = {
  id: string;
  workflowId: string;
  kind: "developer_build" | "document_generation";
  title: string;
  state: WorkflowTaskState;
  requirementRevision: number;
  runId?: string;
  dependsOn: string[];
  assignedWorker?: string;
  acceptanceCriteria: string[];
  evidenceStatus: WorkflowEvidenceStatus;
  artifactVersion?: number;
  blocker?: string;
  createdAt: string;
  updatedAt: string;
};
export type WorkflowActivity = {
  sequence: number;
  type: string;
  actorId: string;
  actorType: string;
  occurredAt: string;
  runId?: string;
  taskId?: string;
  summary: string;
};
export type WorkflowOverview = {
  id: string;
  schemaVersion: number;
  phase: WorkflowPhase;
  revision: number;
  controllerId?: string;
  controlEpoch: number;
  updatedAt: string;
  tasks: WorkflowTask[];
  activity: WorkflowActivity[];
  activityCursor: number;
  lastVerifiedArtifact?: {
    versionId: number;
    summary: string;
    createdAt: string;
    verification: "passed" | "unverified";
  };
};
export type ChangeKind = "insert" | "delete" | "modify";
export type InterpretationClassification =
  | "proposal"
  | "question"
  | "explicit_request"
  | "decision"
  | "ambiguity";
export type SharedRequirementCategory =
  | "goal"
  | "feature"
  | "design"
  | "constraint";
export type InterpretationIntentCategory =
  | SharedRequirementCategory
  | "question"
  | "withdrawal";
export type IntentReference = {
  requirementId: string;
  revision: number;
  participantIds: string[];
  authority: "accepted_context";
};
export type IntentValidation = {
  status: "verified" | "needs_clarification";
  reason?: string;
};
export type IntentTarget =
  | { kind: "requirement"; id: string; revision: number }
  | { kind: "interpretation"; id: string; intentId: string; revision: number };
export type IntentCommand = {
  requestId: string;
  specificationRevision: number;
  target: IntentTarget;
  action: "correct" | "withdraw";
  text?: string;
  category?: InterpretationIntentCategory;
  classification?: "explicit_request" | "proposal" | "question";
};
export type IntentCommandResult = {
  requestId: string;
  specificationRevision: number;
  action: "correct" | "withdraw";
  buildPending: boolean;
};
export type IntentCorrection = {
  requestId: string;
  participantId: string;
  participantName: string;
  target: IntentTarget;
  action: "correct" | "withdraw";
  before: string;
  after?: string;
  recordedAt: string;
  sources: SharedRequirementSource[];
};
export type InterpretationIntent = {
  output?: ArtifactTarget;
  authority?: "authenticated_submission" | "human_correction";
  validation?: IntentValidation;
  contextReferences?: IntentReference[];
  withdrawn?: boolean;
  id: string;
  text: string;
  category: InterpretationIntentCategory;
  classification: InterpretationClassification;
  rationale: string;
  sourcePassage: string;
  affectedRequirementIds: string[];
  participantId: string;
  participantName: string;
  sourceRevision: number;
  sourceEditSeqs: number[];
};
export type Requirement = {
  id: string;
  participantId: string;
  participantName: string;
  goals: string[];
  features: string[];
  design: string[];
  constraints: string[];
  questions: string[];
  additions: string[];
  modifications: string[];
  withdrawals: string[];
  classification: InterpretationClassification;
  affectedRequirementIds: string[];
  sourceRevision: number;
  sourceEditSeqs: number[];
  sourcePassages: string[];
  revision: number;
  createdAt: string;
  intents?: InterpretationIntent[];
  classifierVersion?: string;
};
export type SharedRequirementStatus =
  | "proposed"
  | "accepted"
  | "withdrawn"
  | "superseded";
export type SharedRequirementSource = {
  participantId: string;
  participantName: string;
  interpretationId: string;
  intentId?: string;
  authority?: "authenticated_submission" | "human_correction";
  documentRevision: number;
  editSeqs: number[];
  passages: string[];
};
export type SharedRequirement = {
  output?: ArtifactTarget;
  id: string;
  revision: number;
  category: SharedRequirementCategory;
  description: string;
  acceptanceCriteria: string[];
  status: SharedRequirementStatus;
  authority: "automatic" | "owner" | "unresolved";
  sources: SharedRequirementSource[];
  createdAt: string;
  updatedAt: string;
};
export type Contradiction = {
  id: string;
  requirementIds: string[];
  reason: string;
  question: string;
  status: "open" | "resolved";
  consequential: boolean;
  createdAt: string;
  resolvedAt?: string;
};
export type ConflictGroupState =
  | "awaiting_choices"
  | "disagreement"
  | "resolved"
  | "obsolete";
export type ConflictDetectionStatus = "confirmed" | "needs_clarification";
export type ConflictAlternative = {
  id: string;
  label: string;
  requirementIds: string[];
  requirementRevisions: Array<{ id: string; revision: number }>;
  sources: SharedRequirementSource[];
};
export type ConflictSelection = {
  participantId: string;
  alternativeId: string | "reject_both";
  groupRevision: number;
  requestId: string;
  submittedAt: string;
};
export type ConflictDecisionRecord = {
  round: number;
  groupRevision: number;
  state: ConflictGroupState;
  selections: ConflictSelection[];
  selectedAlternativeId?: string | "reject_both";
  recordedAt: string;
};
export type ConflictGroup = {
  id: string;
  revision: number;
  round: number;
  subject: string;
  scope: string;
  requirementIds: string[];
  alternatives: ConflictAlternative[];
  requiredResolverIds: string[];
  selections: ConflictSelection[];
  state: ConflictGroupState;
  detectionStatus: ConflictDetectionStatus;
  explanation: string;
  affectedBuildScopes: string[];
  history: ConflictDecisionRecord[];
  lastAgreedBaseline?: {
    alternativeId: string;
    requirementIds: string[];
    decidedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  obsoleteReason?: string;
};
export type Participant = {
  id: string;
  name: string;
  color: string;
  active: boolean;
  lastSeen: string;
  agentStatus: AgentStatus;
  latest?: Requirement;
};
export type ProductSource = {
  app: string;
  css: string;
  summary: string;
  decisions: string[];
  conflicts: string[];
};
export type TaskComplexity = "simple" | "standard" | "complex" | "uncertain";
export type AIRoutingEvidenceStatus = "measured" | "provisional" | "hypothesis";
export type NormalizedAIUsage = {
  inputTokens?: number;
  cachedInputTokens?: number;
  cacheWriteTokens?: number;
  outputTokens?: number;
  reasoningTokens?: number;
  reasoningIncludedInOutput?: boolean;
};
export type ProviderRequestPurpose =
  | "connection_test"
  | "capability_text"
  | "capability_personal"
  | "capability_builder"
  | "interpretation"
  | "builder"
  | "structured_output_repair"
  | "operation_repair"
  | "compilation_repair"
  | "provider_format_fallback"
  | "model_discovery";
export type ProviderRequestRecord = {
    budgetScopeId?: string;
    budgetScopeKind?: 'workflow' | 'setup';
    reservedChargeUsd?: number;
    callId: string;
    workspaceId: string;
    workflowRunId?: string;
    submissionId?: string;
    parentCallId?: string;
    purpose: ProviderRequestPurpose;
    retryReason?: string;
    provider: AIProvider;
    model?: string;
    configurationVersion: string;
    pricingVersion?: string;
    startedAt: string;
    endedAt?: string;
    outcome: 'dispatching' | 'succeeded' | 'failed' | 'cancelled' | 'unknown';
    providerRequestId?: string;
    terminationReason?: string;
    estimatedInputTokens: number;
    estimatedOutputTokens?: number;
    usage: NormalizedAIUsage;
    usageStatus: 'estimated' | 'measured' | 'incomplete' | 'unknown';
    estimatedChargeUsd?: number;
    providerCostUsd?: number;
    chargeIncomplete?: boolean;
    errorKind?: string;
};
export type AIRunCall = {
  phase: "interpretation" | "builder" | "repair";
  participantId?: string;
  provider: AIProvider;
  model: string;
  pricingVersion: string;
  rate?: AIRate;
  usage: NormalizedAIUsage;
  estimatedChargeUsd?: number;
  chargeIncomplete: boolean;
  uncertain: boolean;
  outcome: "succeeded" | "failed" | "unknown";
};
export type AIRunRecord = {
  artifactKind?: 'application' | 'markdown';
  documentVerification?: DocumentVersion['verification'];
    runId: string;
    catalogVersion: string;
    pricingVersion: string;
    routingRuleVersion: string;
    verificationPolicyVersion: string;
    workflowMode?: AIWorkflowMode;
    specialty?: LegacyAISpecialty;
    effort?: AIEffort;
    complexity: TaskComplexity;
    evidenceStatus: AIRoutingEvidenceStatus;
    routingReason: string;
    personalModels: string[];
    builderModel: string;
    calls: AIRunCall[];
    usage: NormalizedAIUsage & {
        estimatedChargeUsd?: number;
        uncertainChargeUsd?: number;
        chargeIncomplete: boolean;
    };
    latencyMs: number;
    outcome: 'promoted' | 'failed';
    verification: {
        evidence?: CandidateVerification;
        operationsApplied: boolean;
        compilationPassed: boolean;
        requirementSatisfaction: 'not_measured' | 'passed' | 'failed';
        regressionCheck: 'not_run' | 'passed' | 'failed';
        verified: boolean;
    };
};
export type Version = {
    provenance?: { projectId: string; artifactId: 'application'; title: string; taskId: string; participantId: string; submissionIds: string[]; requirementRevisions: Array<{ id: string; revision: number }>; inputVersions: ArtifactInputVersion[] };
    contentRef?: string;
    contentHash?: string;
    byteLength?: number;
    verificationStatus?: 'passed' | 'unverified';
    specificationRevision?: number;
    id: number;
    createdAt: string;
    summary: string;
    fileCount?: number;
    conflicts?: string[];
    aiRun?: AIRunRecord;
};
export type ArtifactTarget = { kind: 'markdown'; id: string; title: string };
export type ArtifactInputVersion = { artifactId: string; versionId: number; contentRef: string };
export type DocumentVersion = {
  id: number;
  projectId: string;
  artifactId: string;
  title: string;
  taskId: string;
  participantId: string;
  submissionIds: string[];
  specificationRevision: number;
  requirementRevisions: Array<{ id: string; revision: number }>;
  inputVersions: ArtifactInputVersion[];
  fingerprint: string;
  contentRef: string;
  contentHash: string;
  byteLength: number;
  encoding: 'utf-8';
  createdAt: string;
  verification: { status: 'passed'; policy: 'markdown-v1'; checkedAt: string; requiredHeadings: string[]; factualAccuracy: 'unverified' };
};
export type DocumentArtifact = ArtifactTarget & { projectId: string; versions: DocumentVersion[] };
export type ProjectArtifact = DocumentArtifact | { kind: 'application'; id: 'application'; title: string; projectId: string; versions: Version[] };
export type AIProvider =
  | "openai"
  | "anthropic"
  | "gemini"
  | "openrouter"
  | "deepseek"
  | "custom"
  | "ollama";
export type AIFormat = "responses" | "chat-completions";
export type CapabilityCheck = {
  status: "unverified" | "passed" | "failed";
  reason?: string;
};
export type ModelChecks = {
  reachable: CapabilityCheck;
  text: CapabilityCheck;
  personal: CapabilityCheck;
  builder: CapabilityCheck;
  checkedAt?: string;
};
export type AIModel = {
  id: string;
  name: string;
  contextLength?: number;
  textOutput?: boolean | "unknown";
};
export type SafeAIConnection = {
  id: string;
  name: string;
  provider: AIProvider;
  baseUrl: string;
  apiFormat?: AIFormat;
  hasCredential: boolean;
  status: "saved" | "reachable" | "error";
  models: AIModel[];
  checks: Record<string, ModelChecks>;
  lastError?: string;
};
export type AgentAssignment = { connectionId: string; model: string };
export type AIWorkflowMode = "developer" | "analyst" | "researcher";
/** Read-only compatibility for persisted setup snapshots and historical run records. */
export type LegacyAISpecialty =
  | "general"
  | "engineer"
  | "designer"
  | "web_developer"
  | "motion_designer";
export type AIEffort = "light" | "medium" | "high" | "extra";
export type AIRateTier = {
  aboveInputTokens: number;
  inputMultiplier: number;
  outputMultiplier: number;
  label: string;
};
export type AIRate = {
  currency: "USD";
  inputPerMillion: number;
  outputPerMillion: number;
  cachedInputPerMillion?: number;
  cacheWrite5mPerMillion?: number;
  cacheWrite1hPerMillion?: number;
  platformMultiplier?: number;
  reasoningBilling:
    | "included_in_output"
    | "output_rate"
    | "not_separately_reported";
  reasoningNote: string;
  tiers?: AIRateTier[];
  additionalCharges?: string[];
  sourceUrl: string;
  verifiedAt: string;
};
export type AIResolvedLayer = {
  connectionId: string;
  connectionName: string;
  provider: AIProvider;
  model: string;
  rate: AIRate;
  maxInputTokens: number;
  maxOutputTokens: number;
  reasoning?: string[];
};
export type AIRecommendation = {
  available: boolean;
  workflowMode: AIWorkflowMode;
  modeAvailable: boolean;
  unavailableReason?: string;
  effort: AIEffort;
  presetVersion: string;
  pricingVersion: string;
  routingRuleVersion: string;
  status: AIRoutingEvidenceStatus;
  routingReason: string;
  personal?: AIResolvedLayer;
  builder?: AIResolvedLayer;
  builderCandidates?: AIResolvedLayer[];
  onePassEstimateUsd?: number;
  maximumEstimateUsd?: number;
  estimateComplete: boolean;
  estimateScope: string;
  defaultMaximumSpendUsd: number;
  repairAttempts: number;
  assumptions: string[];
  missing: string[];
};
export type AISetupPolicy = {
  mode: "custom" | "recommended" | "managed" | "byok_lease";
  credentialHandle?: string;
  workflowMode?: AIWorkflowMode;
  /** Legacy active presets migrate to Developer; retained only for compatibility. */ specialty?: LegacyAISpecialty;
  effort?: AIEffort;
  maximumSpendUsd?: number;
  presetVersion?: string;
  pricingVersion?: string;
  routingRuleVersion?: string;
  status?: AIRoutingEvidenceStatus;
  routingReason?: string;
  resolved?: {
    personal: AIResolvedLayer;
    builder: AIResolvedLayer;
    builderCandidates?: AIResolvedLayer[];
    repairAttempts: number;
  };
  updatedAt?: string;
};
export type TemporaryModel = {
  id: string;
  name: string;
  inputPerMillion: number;
  outputPerMillion: number;
  contextLength: number;
  maxOutputTokens?: number;
};
export type AIConnection = {
  status: "disconnected" | "connected";
  connections: SafeAIConnection[];
  personal?: AgentAssignment;
  builder?: AgentAssignment;
  participantOverrides?: Record<string, AgentAssignment>;
  savedCustom?: {
    personal: AgentAssignment;
    builder: AgentAssignment;
    participantOverrides: Record<string, AgentAssignment>;
  };
  participants?: Participant[];
  setup?: AISetupPolicy;
  temporary?: {
    handle: string;
    sponsorId: string;
    expiresAt: string;
    builders: TemporaryModel[];
    interpreters: TemporaryModel[];
    authorizedSpenderIds: string[];
  };
  provider?: AIProvider;
  baseUrl?: string;
  apiFormat?: AIFormat;
  personalModel?: string;
  builderModel?: string;
};
export type AIUsage = {
  requests: number;
  personalRequests: number;
  builderRequests: number;
  inputTokens: number;
  cachedInputTokens?: number;
  cacheWriteTokens?: number;
  outputTokens: number;
  reasoningTokens?: number;
  estimatedCostUsd?: number;
  uncertainCostUsd?: number;
};
export type PhysicalUsage = {
  recorded: AIUsage;
  generation: AIUsage;
  setup: AIUsage;
  unknownUsageRequests: number;
  recordedFrom?: string;
  coverage: "partial";
};
export type RequirementRevision = {
  revision: number;
  accepted: SharedRequirement[];
};
export type RoomView = {
    artifacts?: ProjectArtifact[];
    workflowBudget?: {
        id: string;
        calls: number;
        maximumCalls: number;
        reservedUsd: number;
        maximumUsd?: number;
        uncertainCalls: number;
        closed?: boolean;
        legacyAllowanceUnknown?: boolean;
    };
    buildProgress?: BuildProgress;
    interpretationHistory?: Requirement[];
    intentCorrections?: IntentCorrection[];
    intentBuildPending?: boolean;
    requirementRevisions?: RequirementRevision[];
    roomId: string;
    ownerId: string | null;
    ai: AIConnection;
    status: WorkflowStatus;
    workflow: WorkflowOverview;
    participants: Participant[];
    requirements: SharedRequirement[];
    conflictGroups: ConflictGroup[];
    contradictions: Contradiction[];
    specificationRevision: number;
    latestVersion: number | null;
    versions: Version[];
    aiRuns: AIRunRecord[];
    providerCalls: ProviderRequestRecord[];
    setupUsage: AIUsage;
    physicalUsage: PhysicalUsage;
    lastError?: string;
    debounceMs: number;
    buildDebounceMs: number;
    buildCooldownMs: number;
    usage: AIUsage;
    savedAt?: string;
    persistRevision: number;
    requirementsRevision: number;
};

export type CandidateVerification = {
    policyVersion: string;
    specificationRevision: number;
    sourceHash: string;
    candidateHash: string;
    planHash: string;
    status: 'passed' | 'failed' | 'unverified';
    checkedAt: string;
    browserVersion?: string;
    requirements: Array<{
        requirementId: string;
        requirementRevision: number;
        criteriaHash: string;
        implementation: 'observed' | 'missing' | 'unknown';
        status: 'verified' | 'failed' | 'unverified';
        criteria: Array<{
            criterionHash: string;
            status: 'passed' | 'failed' | 'unverified';
            checks: string[];
        }>;
    }>;
    checks: Array<{
        kind: 'filter' | 'favorites' | 'sort';
        version: string;
        implemented: boolean;
        passed: boolean;
        message: string;
    }>;
};

export type BuildProgress = {
    policy: 'bounded-collection-v1';
    phase: 'collecting' | 'building' | 'pending' | 'idle' | 'failed';
    acceptedRevision: number;
    buildingRevision?: number;
    availableVersion: number | null;
    availableRevision?: number;
    queuedRevision?: number;
    pendingSubmissions: number;
    collectionEndsAt?: string;
};
