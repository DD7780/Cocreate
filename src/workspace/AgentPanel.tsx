import { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronLeft,
  LoaderCircle,
  PanelLeftClose,
  Send,
  X,
} from "lucide-react";
import type {
  AIEffort,
  ConflictGroup,
  Participant,
  RoomView,
} from "../../shared/types";
import { api, tokenRole } from "../api";
import { dollars, rateSummary } from "../ai/display";
import { effortChoices } from "../ai/effort-options";

function EffortToggle({
  value,
  disabled,
  onChange,
}: {
  value: AIEffort;
  disabled: boolean;
  onChange: (effort: AIEffort) => Promise<void>;
}) {
  const activeIndex = Math.max(
      0,
      effortChoices.findIndex((item) => item.id === value),
    ),
    [draftIndex, setDraftIndex] = useState(activeIndex),
    pending = useRef<AIEffort | undefined>(undefined);
  useEffect(() => {
    if (!pending.current) {
      setDraftIndex(activeIndex);
      return;
    }
    if (pending.current === value) pending.current = undefined;
    setDraftIndex(activeIndex);
  }, [activeIndex, value]);
  const current =
      effortChoices[draftIndex] ||
      effortChoices[activeIndex] ||
      effortChoices[0],
    commit = async (index: number) => {
      const effort = effortChoices[index]?.id;
      if (!effort || effort === value || pending.current === effort) return;
      pending.current = effort;
      await onChange(effort);
      if (pending.current === effort) pending.current = undefined;
    };
  return (
    <div
      className="effort-toggle"
      data-effort={current.id}
      aria-disabled={disabled}
    >
      <input
        type="range"
        min="0"
        max="3"
        step="1"
        value={draftIndex}
        disabled={disabled}
        aria-label="AI effort"
        aria-valuetext={current.label}
        onChange={(event) => setDraftIndex(Number(event.target.value))}
        onPointerUp={(event) => void commit(Number(event.currentTarget.value))}
        onKeyUp={(event) => {
          if (
            [
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Home",
              "End",
              "PageUp",
              "PageDown",
            ].includes(event.key)
          )
            void commit(Number(event.currentTarget.value));
        }}
        onBlur={(event) => void commit(Number(event.currentTarget.value))}
      />
      <span className="effort-thumb" aria-hidden="true" />
      {effortChoices.map((item, index) => (
        <button
          key={item.id}
          type="button"
          className={draftIndex === index ? "selected" : ""}
          disabled={disabled}
          aria-pressed={draftIndex === index}
          onClick={() => {
            setDraftIndex(index);
            void commit(index);
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function ConflictChoice({
  group,
  participantId,
  canDecide,
  roomId,
  token,
}: {
  group: ConflictGroup;
  participantId?: string;
  canDecide: boolean;
  roomId: string;
  token: string;
}) {
  const current = group.selections.find(
    (selection) => selection.participantId === participantId,
  );
  const [choice, setChoice] = useState(current?.alternativeId || ""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const requestId = useRef<string>("");
  useEffect(() => {
    setChoice(current?.alternativeId || "");
    setError("");
    requestId.current = "";
  }, [group.updatedAt, current?.alternativeId]);
  const allowed =
    canDecide &&
    !!participantId &&
    group.requiredResolverIds.includes(participantId) &&
    group.state === "awaiting_choices";
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!allowed || !choice) return;
    setBusy(true);
    setError("");
    setMessage("");
    requestId.current ||= crypto.randomUUID();
    try {
      await api(
        `/api/rooms/${roomId}/conflicts/${group.id}/selections`,
        token,
        {
          method: "POST",
          body: JSON.stringify({
            groupRevision: group.revision,
            expectedUpdatedAt: group.updatedAt,
            alternativeId: choice,
            requestId: requestId.current,
          }),
        },
      );
      setMessage("Your choice was saved.");
      requestId.current = "";
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save your choice.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className="conflict-choice">
      <span>
        {group.state.replaceAll("_", " ")} · round {group.round}
      </span>
      <h3>{group.subject}</h3>
      <p>{group.explanation}</p>
      <form onSubmit={(event) => void submit(event)}>
        <fieldset disabled={!allowed || busy}>
          <legend>Choose an alternative for {group.subject}</legend>
          {group.alternatives.map((option) => (
            <label key={option.id}>
              <input
                type="radio"
                name={`conflict-${group.id}`}
                value={option.id}
                checked={choice === option.id}
                onChange={() => setChoice(option.id)}
              />
              {option.label}
            </label>
          ))}
          <label>
            <input
              type="radio"
              name={`conflict-${group.id}`}
              value="reject_both"
              checked={choice === "reject_both"}
              onChange={() => setChoice("reject_both")}
            />
            Reject both alternatives
          </label>
        </fieldset>
        {allowed && (
          <button type="submit" disabled={!choice || busy}>
            {busy ? "Saving…" : "Save my choice"}
          </button>
        )}
      </form>
      {!allowed && (
        <p>
          {group.state === "awaiting_choices"
            ? "Only affected contributors with edit permission can choose."
            : "This decision round is closed."}
        </p>
      )}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      <details>
        <summary>Decisions and history</summary>
        {group.selections.map((selection, index) => (
          <p key={index}>
            {selection.participantId}: {selection.alternativeId}
          </p>
        ))}
        {group.history.map((entry, index) => (
          <p key={index}>
            Round {entry.round} - {entry.state.replaceAll("_", " ")} -{" "}
            {new Date(entry.recordedAt).toLocaleString()}
          </p>
        ))}
      </details>
    </article>
  );
}

export function AgentPanel({
  me,
  state,
  token,
  id,
  hosted = false,
  onViewUsage,
}: {
  me?: Participant;
  state: RoomView;
  token: string;
  id: string;
  hosted?: boolean;
  onViewUsage?: () => void;
}) {
  const [selectedRevision, setSelectedRevision] = useState("latest");
  const revisions = state.requirementRevisions || [
      {
        revision: state.specificationRevision,
        accepted: state.requirements.filter(
          (item) => item.status === "accepted",
        ),
      },
    ],
    selected =
      selectedRevision === "latest"
        ? revisions.at(-1)
        : revisions.find((item) => String(item.revision) === selectedRevision),
    shownRevision = selected?.revision ?? state.specificationRevision;
  const [collapsed, setCollapsed] = useState(false),
    [conflictsOpen, setConflictsOpen] = useState(false),
    [drawer, setDrawer] = useState<"intent" | "conflicts" | null>(null),
    [correction, setCorrection] = useState(""),
    [busy, setBusy] = useState<"correct" | "reinterpret" | "effort" | null>(
      null,
    ),
    [effortMessage, setEffortMessage] = useState("");
  const accepted =
      selected?.accepted ||
      state.requirements.filter((item) => item.status === "accepted"),
    proposed = state.requirements.filter((item) => item.status === "proposed"),
    activeConflicts = state.conflictGroups.filter(
      (item) =>
        item.state === "awaiting_choices" || item.state === "disagreement",
    ),
    disagreements = state.conflictGroups.filter(
      (item) => item.state === "disagreement",
    ),
    latest = me?.latest,
    intents = latest?.intents?.length
      ? latest.intents
      : [...(latest?.features || []), ...(latest?.goals || [])]
          .slice(0, 1)
          .map((text, index) => ({
            id: `legacy-${index}`,
            text,
            classification: latest!.classification,
            rationale: "Legacy contribution-level classification.",
          })),
    protectedInterpretation =
      !!latest &&
      (latest.classification === "decision" ||
        latest.withdrawals.length > 0 ||
        latest.intents?.some(
          (intent) =>
            intent.classification === "decision" ||
            intent.category === "withdrawal",
        )),
    activeEffort = state.ai.setup?.effort || "medium",
    recommended = state.ai.setup?.mode === "recommended",
    owner = state.ownerId === me?.id;
  useEffect(() => {
    if (activeConflicts.length) {
      setCollapsed(false);
      setConflictsOpen(true);
    }
  }, [activeConflicts.length]);
  async function send() {
    setBusy("correct");
    try {
      await api(`/api/rooms/${id}/process`, token, {
        method: "POST",
        body: JSON.stringify({ correction }),
      });
      setCorrection("");
    } finally {
      setBusy(null);
    }
  }
  async function reinterpret() {
    setBusy("reinterpret");
    try {
      await api(`/api/rooms/${id}/reinterpret`, token, { method: "POST" });
    } finally {
      setBusy(null);
    }
  }
  async function changeEffort(effort: AIEffort) {
    if (!owner || state.ai.status !== "connected" || effort === activeEffort)
      return;
    setBusy("effort");
    setEffortMessage("");
    try {
      await api(`/api/rooms/${id}/ai/effort`, token, {
        method: "POST",
        body: JSON.stringify({ effort }),
      });
      setEffortMessage(
        `${effortChoices.find((item) => item.id === effort)?.label} effort applied to future submissions.`,
      );
    } catch (error) {
      setEffortMessage(
        error instanceof Error ? error.message : "Could not change AI effort.",
      );
    } finally {
      setBusy(null);
    }
  }
  const label = (classification: string) =>
    classification === "explicit_request"
      ? "Accepted request"
      : classification.replace("_", " ");
  if (collapsed)
    return (
      <aside className="agent-panel compact collapsed">
        <button
          className="panel-expand"
          aria-label="Open shared intent panel"
          onClick={() => setCollapsed(false)}
        >
          <ChevronLeft />
          <span>Intent</span>
          {activeConflicts.length > 0 && <b>{activeConflicts.length}</b>}
        </button>
      </aside>
    );
  return (
    <aside className="agent-panel compact">
      <header className="panel-heading">
        <div>
          <span className="section-eyebrow">Workspace</span>
          <strong>Shared context</strong>
        </div>
        <button
          aria-label="Collapse shared intent panel"
          title="Collapse panel"
          onClick={() => setCollapsed(true)}
        >
          <PanelLeftClose />
        </button>
      </header>
      {!hosted &&
        state.ai.setup?.mode !== "managed" &&
        state.ai.setup?.mode !== "byok_lease" && (
          <section
            className="canvas-effort compact-effort"
            aria-labelledby="canvas-effort-title"
          >
            <header>
              <div>
                <span className="section-eyebrow">Build control</span>
                <strong id="canvas-effort-title">AI effort</strong>
              </div>
              <small>Drag or choose a level</small>
            </header>
            <EffortToggle
              value={activeEffort}
              disabled={!!busy || !owner || state.ai.status !== "connected"}
              onChange={changeEffort}
            />
            <div className="effort-accounting">
              <span>
                {rateSummary(
                  "Interpreter",
                  state.ai.setup?.resolved?.personal?.rate,
                )}
              </span>
              <span>
                {rateSummary(
                  "Executor",
                  state.ai.setup?.resolved?.builder?.rate,
                )}
              </span>
              <span>
                Historical generation counter ·{" "}
                {state.usage.inputTokens.toLocaleString()} input +{" "}
                {state.usage.outputTokens.toLocaleString()} output · estimated
                provider charge {dollars(state.usage.estimatedCostUsd)}
              </span>
              <span>
                Recorded setup tests · {state.physicalUsage.setup.requests}{" "}
                physical request
                {state.physicalUsage.setup.requests === 1 ? "" : "s"} ·{" "}
                {state.physicalUsage.setup.inputTokens.toLocaleString()} input +{" "}
                {state.physicalUsage.setup.outputTokens.toLocaleString()} output
                · {dollars(state.physicalUsage.setup.estimatedCostUsd)}
              </span>
            </div>
            <small>
              {state.ai.status !== "connected"
                ? "Connect AI to choose effort."
                : !owner
                  ? "Owner controlled."
                  : `${recommended ? "Recommended routing" : "Advanced assignments"} · applies to future submissions only`}
            </small>
            {effortMessage && <p role="status">{effortMessage}</p>}
          </section>
        )}
      {!hosted && state.ai.setup?.mode === "managed" && (
        <section className="canvas-effort compact-effort">
          <header>
            <div>
              <span className="section-eyebrow">Builder</span>
              <strong>{state.ai.builderModel}</strong>
            </div>
          </header>
          <div className="effort-accounting">
            <span>
              Last build ·{" "}
              {dollars(state.aiRuns.at(-1)?.usage.estimatedChargeUsd)} estimated
              provider charge
            </span>
            <span>
              Project generation total ·{" "}
              {state.usage.inputTokens.toLocaleString()} input +{" "}
              {state.usage.outputTokens.toLocaleString()} output ·{" "}
              {dollars(state.usage.estimatedCostUsd)} estimated
            </span>
            <span>
              Managed credits and authorized spenders are shown in Builder
              settings.
            </span>
          </div>
        </section>
      )}
      <section className="shared-context-intent">
        <label className="intent-revision-selector">
          Shared Intent
          <select
            aria-label="Shared Intent revision"
            value={selectedRevision}
            onChange={(event) => setSelectedRevision(event.target.value)}
          >
            <option value="latest">
              r{state.specificationRevision} ·{" "}
              {revisions.at(-1)?.accepted.length || 0} accepted
            </option>
            {revisions
              .slice(0, -1)
              .reverse()
              .map((item) => (
                <option key={item.revision} value={String(item.revision)}>
                  r{item.revision} · {item.accepted.length} accepted
                </option>
              ))}
          </select>
        </label>
        <div className="accepted-requirements-card">
          <strong>Accepted requirements</strong>
          <ul className="intent-preview">
            {accepted.slice(0, 3).map((item) => (
              <li key={item.id} title={item.description}>
                {item.description}
              </li>
            ))}
          </ul>
          {!accepted.length && (
            <p>
              Accepted instructions appear here after changes are submitted and
              accepted.
            </p>
          )}
          <button onClick={() => setDrawer("intent")}>
            View requirements →
          </button>
        </div>
      </section>
      {onViewUsage && (
        <section className="project-token-card">
          <span>Recorded usage · partial</span>
          <strong>
            {state.physicalUsage.recorded.requests === 0 ||
            (state.physicalUsage.unknownUsageRequests ===
              state.physicalUsage.recorded.requests &&
              state.physicalUsage.recorded.inputTokens +
                state.physicalUsage.recorded.outputTokens ===
                0)
              ? "Unknown"
              : (
                  state.physicalUsage.recorded.inputTokens +
                  state.physicalUsage.recorded.outputTokens
                ).toLocaleString()}
          </strong>
          <span>reported tokens</span>
          <small>
            Workflow total · {state.physicalUsage.unknownUsageRequests} calls
            with incomplete usage; earlier history may be missing.
          </small>
          <button type="button" onClick={onViewUsage}>
            View usage →
          </button>
        </section>
      )}
      {(proposed.length > 0 || activeConflicts.length > 0) && (
        <details
          className="panel-section conflict-section"
          open={conflictsOpen}
          onToggle={(event) => setConflictsOpen(event.currentTarget.open)}
        >
          <summary>
            Needs attention · {proposed.length + activeConflicts.length}{" "}
            <span>{conflictsOpen ? "▾" : "▸"}</span>
          </summary>
          <div>
            {proposed.length > 0 && (
              <p>
                {proposed.length} proposal{proposed.length === 1 ? "" : "s"}{" "}
                await review.
              </p>
            )}
            {activeConflicts.length > 0 && (
              <p>
                {activeConflicts.length} conflict
                {activeConflicts.length === 1 ? "" : "s"} require an explicit
                decision.
              </p>
            )}
            <button
              onClick={() =>
                setDrawer(activeConflicts.length ? "conflicts" : "intent")
              }
            >
              Review items →
            </button>
          </div>
        </details>
      )}
      {disagreements.length > 0 && (
        <details className="panel-section">
          <summary>
            Disagreements · {disagreements.length} <span>▸</span>
          </summary>
          <div>
            {disagreements.map((group) => (
              <p key={group.id}>{group.subject}</p>
            ))}
            <button onClick={() => setDrawer("conflicts")}>
              View alternatives and history →
            </button>
          </div>
        </details>
      )}
      <details className="panel-section workflow-compact">
        <summary>
          Workflow · {state.workflow.phase.replaceAll("_", " ")} <span>▸</span>
        </summary>
        <div>
          <strong>Revision {state.workflow.revision}</strong>
          <p>
            {state.workflow.tasks.length
              ? `${state.workflow.tasks.length} tracked task${state.workflow.tasks.length === 1 ? "" : "s"}`
              : "No submitted work is planned yet."}
          </p>
        </div>
      </details>
      {!hosted && (
        <section className="panel-steering">
          <textarea
            value={correction}
            onChange={(event) => setCorrection(event.target.value)}
            placeholder="Submit steering or correct an assumption…"
          />
          <button onClick={send} disabled={!!busy || !correction.trim()}>
            {busy === "correct" ? <LoaderCircle className="spin" /> : <Send />}
            Submit steering
          </button>
        </section>
      )}
      {drawer && (
        <div
          className="context-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={
            drawer === "intent" ? "Shared intent details" : "Conflict details"
          }
        >
          <header>
            <strong>
              {drawer === "intent"
                ? "Shared Intent"
                : "Conflicts and decisions"}
            </strong>
            <button aria-label="Close details" onClick={() => setDrawer(null)}>
              <X />
            </button>
          </header>
          <div>
            {drawer === "intent" ? (
              <>
                <p>Accepted requirements · specification r{shownRevision}</p>
                {accepted.map((requirement) => (
                  <article key={requirement.id}>
                    <span>
                      {requirement.status} · {requirement.category}
                    </span>
                    <strong>{requirement.description}</strong>
                    <details>
                      <summary>Criteria and sources</summary>
                      {requirement.acceptanceCriteria.map(
                        (criterion, index) => (
                          <p key={index}>{criterion}</p>
                        ),
                      )}
                      {requirement.sources.map((source, index) => (
                        <p key={index}>
                          {source.participantName} · document r
                          {source.documentRevision}
                          {source.passages.map((passage, i) => (
                            <small key={i}>“{passage}”</small>
                          ))}
                        </p>
                      ))}
                    </details>
                  </article>
                ))}
                {latest && (
                  <>
                    <h3>Your latest intents</h3>
                    {intents.map((intent) => (
                      <article
                        className={`intent-entry ${intent.classification}`}
                        key={intent.id}
                      >
                        <span>{label(intent.classification)}</span>
                        <strong>{intent.text}</strong>
                        <small>{intent.rationale}</small>
                      </article>
                    ))}
                    {!hosted && (
                      <button
                        onClick={reinterpret}
                        disabled={!!busy || protectedInterpretation}
                      >
                        {busy === "reinterpret" ? (
                          <LoaderCircle className="spin" />
                        ) : (
                          <Bot />
                        )}
                        Reinterpret latest contribution
                      </button>
                    )}
                  </>
                )}
              </>
            ) : (
              state.conflictGroups.map((group) => (
                <ConflictChoice
                  key={group.id}
                  group={group}
                  participantId={me?.id}
                  canDecide={tokenRole(token) !== "viewer"}
                  roomId={id}
                  token={token}
                />
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
