export const betaMessageLimit = 1_000;
export const betaDeclineCooldownDays = 7;

export type BetaRequest = {
  id: string;
  requesterId: string;
  requesterEmail: string;
  status: "pending" | "approved" | "declined";
  message: string;
  requestedAt: string;
  decidedAt: string | null;
  decidedBy: string | null;
};

export type BetaRequestState = {
  approved: boolean;
  reviewer: boolean;
  revoked: boolean;
  request: BetaRequest | null;
  resubmitAt: string | null;
};
