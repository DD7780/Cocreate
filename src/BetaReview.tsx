import { useCallback, useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  betaWaitlistPageSize,
  type BetaRequest,
  type BetaReviewList,
} from "../shared/beta-access";

export type AuthenticatedRequest = <T>(
  path: string,
  session: Session,
  init?: RequestInit,
) => Promise<T>;
const date = (value: string) => new Date(value).toLocaleString();

export function BetaReview({
  session,
  requestApi,
}: {
  session: Session;
  requestApi: AuthenticatedRequest;
}) {
  const [list, setList] = useState<BetaReviewList | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [waitlistOffset, setWaitlistOffset] = useState(0);
  const loadVersion = useRef(0);
  const load = useCallback(async () => {
    const version = ++loadVersion.current;
    setError("");
    setLoading(true);
    try {
      const query = new URLSearchParams(location.search);
      query.set("waitlistOffset", String(waitlistOffset));
      const result = await requestApi<BetaReviewList>(
        "/api/beta/review?" + query,
        session,
      );
      if (version === loadVersion.current) setList(result);
    } catch (error) {
      if (version !== loadVersion.current) return;
      setList(null);
      setError(
        error instanceof Error
          ? error.message
          : "Requests could not be loaded.",
      );
    } finally {
      if (version === loadVersion.current) setLoading(false);
    }
  }, [session, requestApi, waitlistOffset]);
  useEffect(() => {
    void load();
    return () => { loadVersion.current++; };
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
    <main className="beta-review" aria-busy={loading || busy}>
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
          <button disabled={busy || loading} onClick={() => void load()}>
            {loading ? "Refreshing…" : "Refresh requests"}
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
      {loading && <p role="status">Loading beta requests and registrations…</p>}
      {list && selectedId && !list.selected && (
        <p role="status">The linked request was not found.</p>
      )}
      {list && (
        <>
          <section aria-labelledby="pending-beta">
            <h2 id="pending-beta">Pending requests ({pending.length})</h2>
            <p>
              Confirmed accounts appear here after submitting Request beta access
              from their pending screen.
            </p>
            {!pending.length && (
              <p>No submitted access requests. Landing-page signups appear in Beta registrations below.</p>
            )}
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
                    disabled={busy || loading || item.requesterId === session.user.id}
                    onClick={() => void decide(item, "approved")}
                  >
                    Give access
                  </button>
                  <button
                    disabled={busy || loading || item.requesterId === session.user.id}
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
          <section aria-labelledby="beta-registrations">
            <h2 id="beta-registrations">Beta registrations ({list.waitlist.total})</h2>
            <p>
              People who joined the landing-page waitlist. Registration records
              interest; it does not create an account or grant access. To request
              approval, they must sign up, confirm their email, and submit Request
              beta access after signing in.
            </p>
            {!list.waitlist.total && <p>No beta registrations yet.</p>}
            {list.waitlist.registrations.map((item) => (
              <article className="beta-request" key={item.email}>
                <h3>{item.email}</h3>
                <p>Registered {date(item.registeredAt)}</p>
                <small>
                  Consented to beta invitations and product updates · {item.consentVersion}
                </small>
              </article>
            ))}
            {!!list.waitlist.total && (
              <nav aria-label="Beta registration pages">
                <button
                  disabled={busy || loading || waitlistOffset === 0}
                  onClick={() => setWaitlistOffset(Math.max(0, waitlistOffset - betaWaitlistPageSize))}
                >
                  Previous registrations
                </button>
                <p>
                  {list.waitlist.registrations.length
                    ? `${list.waitlist.offset + 1}–${list.waitlist.offset + list.waitlist.registrations.length} of ${list.waitlist.total}`
                    : "No registrations on this page. Return to the previous page."}
                </p>
                <button
                  disabled={busy || loading || list.waitlist.nextOffset === null}
                  onClick={() => setWaitlistOffset(list.waitlist.nextOffset!)}
                >
                  Next registrations
                </button>
              </nav>
            )}
          </section>
          <section aria-labelledby="recent-beta">
            <h2 id="recent-beta">Recent decisions (latest {list.recent.length})</h2>
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
