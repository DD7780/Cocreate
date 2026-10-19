import { randomUUID } from "node:crypto";
import type express from "express";
import {
  betaMessageLimit,
  betaDeclineCooldownDays,
  type BetaRequest,
  type BetaRequestState,
} from "../shared/beta-access.js";
import type { SupabasePlatform } from "./supabase-platform.js";
import {
  transactionalEmailSenderFromEnv,
  type TransactionalEmailPayload,
  type TransactionalEmailSender,
} from "./invitation-email.js";
import { betaEmailPayload, type BetaDelivery } from "./beta-email.js";

const requestColumns =
  "id,requester_id,requester_email,status,message,requested_at,decided_at,decided_by";
const rowRequest = (row: Record<string, any>): BetaRequest => ({
  id: row.id,
  requesterId: row.requester_id,
  requesterEmail: row.requester_email,
  status: row.status,
  message: row.message,
  requestedAt: row.requested_at,
  decidedAt: row.decided_at,
  decidedBy: row.decided_by,
});
const databaseError = (error: { code?: string; message: string } | null) => {
  if (!error) return;
  const status =
    error.code === "42501" ? 403 : error.code === "22023" ? 409 : 503;
  throw Object.assign(
    new Error(
      status === 503
        ? "Beta request service is temporarily unavailable."
        : error.message,
    ),
    { status },
  );
};

export class BetaRequestService {
  constructor(
    readonly platform: SupabasePlatform,
    readonly sender: TransactionalEmailSender,
    readonly origin: string,
  ) {}

  async confirmedAccount(userId: string) {
    const { data, error } =
      await this.platform.admin.auth.admin.getUserById(userId);
    if (error)
      throw Object.assign(new Error("Your account could not be verified."), {
        status: 503,
      });
    const user = data.user;
    if (!user?.email || !user.email_confirmed_at || user.is_anonymous)
      throw Object.assign(
        new Error("Confirm your email before requesting beta access."),
        { status: 403 },
      );
    return user;
  }

  async isReviewer(userId: string) {
    const { data, error } = await this.platform.admin
      .from("beta_reviewers")
      .select("user_id")
      .eq("user_id", userId)
      .is("revoked_at", null)
      .maybeSingle();
    databaseError(error);
    return !!data && (await this.platform.hasBetaAccess(userId));
  }
  async requireReviewer(userId: string) {
    await this.confirmedAccount(userId);
    if (!(await this.isReviewer(userId)))
      throw Object.assign(new Error("Beta reviewer permission is required."), {
        status: 403,
      });
  }

  async state(userId: string): Promise<BetaRequestState> {
    const approved = await this.platform.hasBetaAccess(userId);
    const { data: access, error: accessError } = await this.platform.admin
      .from("beta_access")
      .select("revoked_at")
      .eq("user_id", userId)
      .maybeSingle();
    databaseError(accessError);
    const { data, error } = await this.platform.admin
      .from("beta_access_requests")
      .select(requestColumns)
      .eq("requester_id", userId)
      .order("requested_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();
    databaseError(error);
    const request = data ? rowRequest(data) : null;
    return {
      approved,
      reviewer: await this.isReviewer(userId),
      revoked: !approved && !!access?.revoked_at,
      request,
      resubmitAt:
        request?.status === "declined" && request.decidedAt
          ? new Date(
              Date.parse(request.decidedAt) +
                betaDeclineCooldownDays * 86_400_000,
            ).toISOString()
          : null,
    };
  }

  async create(userId: string, body: unknown): Promise<BetaRequest> {
    await this.confirmedAccount(userId);
    const input = body as { message?: unknown } | null;
    if (
      !input ||
      Array.isArray(input) ||
      typeof input !== "object" ||
      (input.message !== undefined &&
        (typeof input.message !== "string" ||
          input.message.length > betaMessageLimit))
    )
      throw Object.assign(
        new Error(
          `Use an optional message of at most ${betaMessageLimit} characters.`,
        ),
        { status: 400 },
      );
    const { data, error } = await this.platform.admin
      .rpc("request_beta_access", {
        actor_id: userId,
        requester_message: input.message || "",
      })
      .single();
    databaseError(error);
    if (!data) throw new Error("Request persistence was not confirmed.");
    return rowRequest(data);
  }

  async list(userId: string, selectedId?: string) {
    await this.requireReviewer(userId);
    const pending = await this.platform.admin
      .from("beta_access_requests")
      .select(requestColumns)
      .eq("status", "pending")
      .order("requested_at", { ascending: true })
      .limit(100);
    const recent = await this.platform.admin
      .from("beta_access_requests")
      .select(requestColumns)
      .neq("status", "pending")
      .order("decided_at", { ascending: false })
      .limit(30);
    databaseError(pending.error);
    databaseError(recent.error);
    let selected: BetaRequest | null = null;
    if (selectedId) {
      if (!/^[0-9a-f-]{36}$/i.test(selectedId))
        throw Object.assign(new Error("Invalid beta request link."), {
          status: 400,
        });
      const result = await this.platform.admin
        .from("beta_access_requests")
        .select(requestColumns)
        .eq("id", selectedId)
        .maybeSingle();
      databaseError(result.error);
      selected = result.data ? rowRequest(result.data) : null;
    }
    return {
      pending: (pending.data || []).map(rowRequest),
      recent: (recent.data || []).map(rowRequest),
      selected,
    };
  }

  async decide(userId: string, requestId: string, decision: unknown) {
    await this.requireReviewer(userId);
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        requestId,
      ) ||
      !["approved", "declined"].includes(String(decision))
    )
      throw Object.assign(
        new Error("Choose Give access or Decline for a valid request."),
        { status: 400 },
      );
    const { data, error } = await this.platform.admin
      .rpc("decide_beta_access", {
        actor_id: userId,
        target_request_id: requestId,
        decision,
      })
      .single();
    databaseError(error);
    if (!data) throw new Error("Decision persistence was not confirmed.");
    return rowRequest(data);
  }

  async deliverOne(): Promise<boolean> {
    if (!this.sender.configured) return false;
    const lease = randomUUID();
    const { data, error } = await this.platform.admin.rpc("claim_beta_email", {
      delivery_lease: lease,
    });
    databaseError(error);
    const row = data?.[0];
    if (!row) return false;
    const delivery: BetaDelivery = {
      id: row.id,
      requestId: row.request_id,
      recipientEmail: row.recipient_email,
      kind: row.kind,
      payload: row.provider_payload,
    };
    try {
      let payload = delivery.payload;
      if (!payload) {
        const result = await this.platform.admin
          .from("beta_access_requests")
          .select(requestColumns)
          .eq("id", delivery.requestId)
          .single();
        databaseError(result.error);
        payload = betaEmailPayload(
          delivery,
          rowRequest(result.data!),
          this.sender.from,
          this.origin,
        );
      }
      const prepared = await this.platform.admin.rpc("prepare_beta_email", {
        target_delivery: delivery.id,
        delivery_lease: lease,
        payload,
      });
      databaseError(prepared.error);
      const result = await this.sender.sendPayload(
        `cocreate-beta-${delivery.id}`,
        prepared.data as TransactionalEmailPayload,
      );
      const finished = await this.platform.admin.rpc("finish_beta_email", {
        target_delivery: delivery.id,
        delivery_lease: lease,
        message_id: result.state === "sent" ? result.providerMessageId : null,
        delivery_error: result.error || null,
      });
      databaseError(finished.error);
      if (finished.data !== true)
        throw new Error("Email delivery lease was lost.");
    } catch {
      // A crash/uncertain acknowledgement retains the same key and immutable payload for lease recovery.
      console.warn("Beta email delivery could not be confirmed", {
        deliveryId: delivery.id,
      });
    }
    return true;
  }
}

export function registerBetaRequestRoutes(
  app: express.Express,
  platform: SupabasePlatform,
  env: NodeJS.ProcessEnv = process.env,
) {
  const service = new BetaRequestService(
    platform,
    transactionalEmailSenderFromEnv(env),
    env.COCREATE_PUBLIC_ORIGIN || "https://2guys1canvas.com",
  );
  let stopped = false,
    running: Promise<void> | null = null;
  const wake = () => {
    if (stopped || running || !service.sender.configured) return;
    running = (async () => {
      try {
        for (
          let count = 0;
          count < 10 && !stopped && (await service.deliverOne());
          count++
        ) {
          /* bounded batch */
        }
      } catch {
        console.warn("Beta email queue is unavailable.");
      } finally {
        running = null;
      }
    })();
  };
  const timer = service.sender.configured ? setInterval(wake, 60_000) : null;
  timer?.unref();
  const handler =
    (
      mutation: boolean,
      action: (req: express.Request, userId: string) => Promise<unknown>,
    ): express.RequestHandler =>
    async (req, res) => {
      res.set("Cache-Control", "no-store");
      try {
        if (mutation) {
          const origins = [
            env.COCREATE_PUBLIC_ORIGIN,
            ...(env.COCREATE_APP_ORIGINS || "").split(","),
            `${req.protocol}://${req.get("host")}`,
          ];
          if (
            req.headers["sec-fetch-site"] === "cross-site" ||
            (req.headers.origin && !origins.includes(req.headers.origin))
          )
            throw Object.assign(
              new Error("Submit this action from the application website."),
              { status: 403 },
            );
        }
        // No cookie/session fallback: mutations require an explicit verified bearer.
        const token =
          req.headers.authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];
        if (!token)
          throw Object.assign(
            new Error("Sign in before requesting or reviewing beta access."),
            { status: 401 },
          );
        const user = await platform.verifyUser(token);
        const result = await action(req, user.id);
        res.json(result);
        if (mutation) wake();
      } catch (error) {
        const status = Number((error as { status?: number }).status) || 503;
        res
          .status(status)
          .json({
            error:
              status === 503
                ? "Beta request service is temporarily unavailable."
                : (error as Error).message,
          });
      }
    };
  app.get(
    "/api/beta/request",
    handler(false, (_req, id) => service.state(id)),
  );
  app.post(
    "/api/beta/request",
    handler(true, (req, id) => service.create(id, req.body)),
  );
  app.get(
    "/api/beta/review",
    handler(false, (req, id) =>
      service.list(
        id,
        typeof req.query.request === "string" ? req.query.request : undefined,
      ),
    ),
  );
  app.post(
    "/api/beta/requests/:id/decision",
    handler(true, (req, id) =>
      service.decide(id, String(req.params.id), req.body?.decision),
    ),
  );
  wake();
  return async () => {
    stopped = true;
    if (timer) clearInterval(timer);
    await running;
  };
}
