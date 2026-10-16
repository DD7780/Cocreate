export const betaMessageLimit = 1_000;
export const betaDeclineCooldownDays = 7;
export const betaWaitlistPageSize = 50;

export type BetaWaitlistRegistration = {
  email: string;
  registeredAt: string;
  consentVersion: string;
};

export type BetaReviewList = {
  pending: BetaRequest[];
  recent: BetaRequest[];
  selected: BetaRequest | null;
  waitlist: {
    registrations: BetaWaitlistRegistration[];
    total: number;
    offset: number;
    nextOffset: number | null;
  };
};

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
