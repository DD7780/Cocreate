import {
  emailHtml,
  type TransactionalEmailPayload,
} from "./invitation-email.js";
import type { BetaRequest } from "../shared/beta-access.js";

export type BetaDelivery = {
  id: string;
  requestId: string;
  recipientEmail: string;
  kind: "review" | "approved" | "declined";
  payload: TransactionalEmailPayload | null;
};

export function betaEmailPayload(
  delivery: BetaDelivery,
  request: BetaRequest,
  from: string,
  origin: string,
): TransactionalEmailPayload {
  const base = new URL(origin);
  if (
    base.username ||
    base.password ||
    base.search ||
    base.hash ||
    base.pathname !== "/" ||
    (base.protocol !== "https:" &&
      !(
        base.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(base.hostname)
      ))
  )
    throw new Error("Configure a canonical application origin for beta email.");
  const url =
    delivery.kind === "review"
      ? `${base.origin}/beta/review?request=${encodeURIComponent(request.id)}`
      : `${base.origin}/app`;
  if (delivery.kind === "review")
    return {
      from,
      to: [delivery.recipientEmail],
      subject: "A beta access request needs your review",
      text: `Beta access requested by ${request.requesterEmail}\nRequested: ${request.requestedAt}\nMessage: ${request.message || "(none)"}\n\nReview request: ${url}\nSign in, then explicitly give access or decline. Opening this link does not change access.`,
      html: `<p>Beta access requested by <strong>${emailHtml(request.requesterEmail)}</strong>.</p><p>Requested: ${emailHtml(request.requestedAt)}</p><p>Message: ${emailHtml(request.message || "(none)")}</p><p><a href="${emailHtml(url)}">Review request</a></p><p>Sign in, then explicitly give access or decline. Opening this link does not change access.</p>`,
    };
  const approved = delivery.kind === "approved";
  const result = approved
    ? "Your beta access is approved."
    : "Your beta access request was declined. You may request again seven days after this decision.";
  return {
    from,
    to: [delivery.recipientEmail],
    subject: approved
      ? "Your 2guys1canvas beta access is approved"
      : "Your 2guys1canvas beta access request was declined",
    text: `${result}\nDecision: ${request.decidedAt}\n${approved ? `Open the app: ${url}\nAccess to each private project still requires membership.` : `Check your request status: ${url}`}`,
    html: `<p>${emailHtml(result)}</p><p>Decision: ${emailHtml(request.decidedAt || "")}</p><p><a href="${emailHtml(url)}">${approved ? "Open the app" : "Check request status"}</a></p>${approved ? "<p>Access to each private project still requires membership.</p>" : ""}`,
  };
}
