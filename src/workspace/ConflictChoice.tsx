import { useEffect, useRef, useState } from 'react';
import type { ConflictGroup, RoomView } from '../../shared/types';
import { api } from '../api';

export function ConflictChoice({
  group,
  participantId,
  canDecide,
  roomId,
  token,
  context,
  onCorrect,
  onCanvas,
}: {
  group: ConflictGroup;
  participantId?: string;
  canDecide: boolean;
  roomId: string;
  token: string;
  context?: RoomView;
  onCorrect?: () => void;
  onCanvas?: () => void;
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
  const name = (id: string) => context?.participants.find(person => person.id === id)?.name
    || group.alternatives.flatMap(option => option.sources).find(source => source.participantId === id)?.participantName
    || 'Former contributor';
  const optionName = (id: string) => id === 'reject_both' ? 'Reject both alternatives' : group.alternatives.find(option => option.id === id)?.label || 'Earlier alternative';
  const status = { awaiting_choices: 'Waiting for choices', disagreement: 'Different choices', resolved: 'Resolved', obsolete: 'Superseded' }[group.state];
  const waiting = group.requiredResolverIds.filter(id => !group.selections.some(selection => selection.participantId === id));
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!allowed || !choice || busy) return;
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
        {context ? status : group.state.replaceAll("_", " ")} · round {group.round}
      </span>
      <h3>{group.subject}</h3>
      <p>{group.explanation}</p>
      {context && <>
        {group.detectionStatus === 'needs_clarification' && <p>Needs clarification</p>}
        {waiting.length > 0 && group.state === 'awaiting_choices' && <p className="contradiction-waiting">Waiting for {waiting.map(name).join(', ')}.</p>}
        {current && <p>Your saved choice: <strong>{optionName(current.alternativeId)}</strong></p>}
      </>}
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
              {context && <small>{[...new Set(option.sources.map(source => source.participantName))].join(', ') || 'Recorded instruction'}</small>}
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
        {context && allowed && <p className="choice-consequence">Agreement may resume submitted work using connected AI.</p>}
      </form>
      {!allowed && (
        <p>
          {group.state === "awaiting_choices"
            ? "Only affected contributors with edit permission can choose."
            : "This decision round is closed."}
        </p>
      )}
      {context && group.state === 'disagreement' && <div className="contradiction-next">
        <p>All choices are recorded. Discuss a revision, then correct your own instruction.</p>
        {canDecide && participantId && group.requiredResolverIds.includes(participantId) && <button onClick={onCorrect}>Review my instructions</button>}
        <button onClick={onCanvas}>Discuss on Canvas</button>
      </div>}
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
            {context ? name(selection.participantId) : selection.participantId}: {context ? optionName(selection.alternativeId) : selection.alternativeId}
          </p>
        ))}
        {group.history.map((entry, index) => (
          <p key={index}>
            Round {entry.round} - {context ? { awaiting_choices: 'Waiting for choices', disagreement: 'Different choices', resolved: 'Resolved', obsolete: 'Superseded' }[entry.state] : entry.state.replaceAll("_", " ")} -{" "}
            {new Date(entry.recordedAt).toLocaleString()}
            {context && entry.selections.map(selection => <span className="contradiction-history-choice" key={selection.participantId}>{name(selection.participantId)}: {optionName(selection.alternativeId)}</span>)}
          </p>
        ))}
      </details>
      {context && <details><summary>Original instructions and baseline</summary>
        {group.alternatives.map(option => <div key={option.id}><strong>{option.label}</strong>{option.sources.map((source, index) => <div key={index}><small>{source.participantName} · Canvas revision {source.documentRevision}</small>{source.passages.map((passage, i) => <blockquote key={i}>{passage}</blockquote>)}</div>)}</div>)}
        <p>Last agreed baseline: {group.lastAgreedBaseline ? `${group.lastAgreedBaseline.requirementIds.map(id => context.requirements.find(requirement => requirement.id === id)?.description).filter(Boolean).join('; ') || optionName(group.lastAgreedBaseline.alternativeId)} · ${new Date(group.lastAgreedBaseline.decidedAt).toLocaleString()}` : 'No earlier agreed choice recorded.'}</p>
        {group.obsoleteReason && <p>{group.obsoleteReason}</p>}
      </details>}
    </article>
  );
}

