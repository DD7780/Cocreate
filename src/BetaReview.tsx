import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { BetaRequest } from "../shared/beta-access";

export type AuthenticatedRequest = <T>(
  path: string,
  session: Session,
  init?: RequestInit,
) => Promise<T>;
type ReviewList = {
  pending: BetaRequest[];
  recent: BetaRequest[];
  selected: BetaRequest | null;
};
const date = (value: string) => new Date(value).toLocaleString();

export function BetaReview({
  session,
  requestApi,
}: {
  session: Session;
  requestApi: AuthenticatedRequest;
}) {
  const [list, setList] = useState<ReviewList | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    setError("");
    try {
      setList(
        await requestApi<ReviewList>(
          "/api/beta/review" + location.search,
          session,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Requests could not be loaded.",
      );
    }
  }, [session, requestApi]);
  useEffect(() => {
    void load();
  }, [load]);
  const decide = async (
    item: BetaRequest,
    decision: "approved" | "declined",
  ) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await requestApi<BetaRequest>(
        `/api/beta/requests/${item.id}/decision`,
        session,
        { method: "POST", body: JSON.stringify({ decision }) },
      );
      setNotice(
        result.decidedBy !== session.user.id || result.status !== decision
          ? `Another reviewer already recorded this request as ${result.status}.`
          : `Request ${result.status}. The requester notification is queued.`,
      );
      await load();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "The decision could not be saved.",
      );
    } finally {
      setBusy(false);
    }
  };
  const selectedId = new URLSearchParams(location.search).get("request");
  const pending =
    list?.selected?.status === "pending" &&
    !list.pending.some((item) => item.id === list.selected!.id)
      ? [list.selected, ...list.pending]
      : list?.pending || [];
  const recent =
    list?.selected &&
    list.selected.status !== "pending" &&
    !list.recent.some((item) => item.id === list.selected!.id)
      ? [list.selected, ...list.recent]
      : list?.recent || [];
  return (
    <main className="beta-review">
      <header>
        <div>
          <p className="kicker">2guys1canvas</p>
          <h1>Beta access requests</h1>
          <p>
            Give ordinary beta access. Private projects still require
            membership.
          </p>
        </div>
        <nav>
          <a href="/app">Back to app</a>
          <button disabled={busy} onClick={() => void load()}>
            Refresh requests
          </button>
        </nav>
      </header>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="auth-notice">
          {notice}
        </p>
      )}
      {!list && !error && <p>Loading requests…</p>}
      {list && (
        <>
          <section aria-labelledby="pending-beta">
            <h2 id="pending-beta">Pending requests</h2>
            {!pending.length && <p>No pending requests.</p>}
            {pending.map((item) => (
              <article
                className={
                  item.id === selectedId
                    ? "beta-request selected"
                    : "beta-request"
                }
                key={item.id}
              >
                <h3>{item.requesterEmail}</h3>
                <p>Requested {date(item.requestedAt)}</p>
                {item.message && (
                  <p className="beta-request-message">{item.message}</p>
                )}
                <div className="beta-review-actions">
                  <button
                    className="primary"
                    disabled={busy || item.requesterId === session.user.id}
                    onClick={() => void decide(item, "approved")}
                  >
                    Give access
                  </button>
                  <button
                    disabled={busy || item.requesterId === session.user.id}
                    onClick={() => void decide(item, "declined")}
                  >
                    Decline
                  </button>
                </div>
                {item.requesterId === session.user.id && (
                  <p>You cannot review your own request.</p>
                )}
              </article>
            ))}
            {pending.length >= 100 && (
              <p>
                Showing the oldest 100 pending requests. Refresh after reviewing
                these to see more.
              </p>
            )}
          </section>
          <section aria-labelledby="recent-beta">
            <h2 id="recent-beta">Recent decisions</h2>
            {!recent.length && <p>No decisions yet.</p>}
            {recent.map((item) => (
              <article
                className={
                  item.id === selectedId
                    ? "beta-request selected"
                    : "beta-request"
                }
                key={item.id}
              >
                <h3>{item.requesterEmail}</h3>
                <p>
                  {item.status === "approved" ? "Approved" : "Declined"}{" "}
                  {item.decidedAt ? date(item.decidedAt) : ""}
                </p>
                {item.message && (
                  <p className="beta-request-message">{item.message}</p>
                )}
                <small>Reviewer account: {item.decidedBy}</small>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
