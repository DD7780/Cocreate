import { createHmac, timingSafeEqual } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import type express from "express";
import type { SupabasePlatform } from "./supabase-platform.js";

export const waitlistMessage =
  "You’re registered. We’ll email you when a beta spot is available.";
export const betaDenied = () =>
  Object.assign(
    new Error(
      "Beta access is pending approval. Your project invitations remain available until their expiry.",
    ),
    { status: 403, code: "beta_access_pending" },
  );

export function validateRegistration(body: unknown): string {
  const input = body as Record<string, unknown> | null;
  if (
    !input ||
    typeof input.email !== "string" ||
    input.consent !== true ||
    input.website
  ) {
    throw Object.assign(
      new Error(
        "Enter a valid email and consent to beta invitations and product updates.",
      ),
      { status: 400 },
    );
  }
  const email = input.email.trim().toLowerCase();
  if (email.length > 254 || /[\u0000-\u001f\u007f]/.test(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw Object.assign(new Error("Enter a valid email address."), {
      status: 400,
    });
  }
  return email;
}

export function waitlistClientKey(
  req: express.Request,
  secret: string,
): string {
  const hmac = (text: string) =>
    createHmac("sha256", secret).update(text).digest("hex");
  const proof = String(req.headers["x-cocreate-waitlist-proof"] || "");
  const key = String(req.headers["x-cocreate-waitlist-key"] || "");
  const expected = hmac("waitlist-proxy-v1");
  if (
    /^[a-f0-9]{64}$/.test(proof) &&
    /^[a-f0-9]{64}$/.test(key) &&
    timingSafeEqual(Buffer.from(proof), Buffer.from(expected))
  )
    return key;
  // Never trust arbitrary forwarded IP headers. The Worker overwrites and authenticates its opaque key.
  return hmac(`waitlist-ip:${req.socket.remoteAddress || "unknown"}`);
}

export class LocalWaitlist {
  private db: DatabaseSync;
  constructor(directory: string) {
    fs.mkdirSync(directory, { recursive: true });
    this.db = new DatabaseSync(path.join(directory, "beta-waitlist.sqlite"));
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;
      CREATE TABLE IF NOT EXISTS registrations (email TEXT PRIMARY KEY, consent_version TEXT NOT NULL, registered_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);`);
  }
  register(email: string, key: string, now = Date.now()) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db.prepare("DELETE FROM attempts WHERE expires <= ?").run(now);
      for (const [client, maximum, period] of [
        ["global", 500, 3_600_000],
        [key, 5, 900_000],
      ] as const) {
        const window = Math.floor(now / period),
          bucket = `${client}:${window}`;
        const row = this.db
          .prepare("SELECT count FROM attempts WHERE key = ?")
          .get(bucket) as { count: number } | undefined;
        if ((row?.count || 0) >= maximum) {
          this.db.exec("COMMIT");
          return false;
        }
        this.db
          .prepare(
            "INSERT INTO attempts VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count=count+1",
          )
          .run(bucket, (window + 1) * period);
      }
      this.db
        .prepare(
          "INSERT INTO registrations VALUES (?, 'beta-updates-v1', ?) ON CONFLICT(email) DO NOTHING",
        )
        .run(email, new Date(now).toISOString());
      this.db.exec("COMMIT");
      return true;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
  close() {
    this.db.close();
  }
}

export function registerBetaRoutes(
  app: express.Express,
  options: {
    platform: SupabasePlatform | null;
    hosted: boolean;
    dataDir: string;
    secret: string;
  },
) {
  const local = options.hosted ? null : new LocalWaitlist(options.dataDir);
  app.post("/api/beta/waitlist", async (req, res) => {
    res.set("Cache-Control", "no-store");
    try {
      const origin = req.headers.origin;
      const allowed = [
        process.env.COCREATE_PUBLIC_ORIGIN,
        ...(process.env.COCREATE_APP_ORIGINS || "").split(","),
        `${req.protocol}://${req.get("host")}`,
      ];
      if (
        req.headers["sec-fetch-site"] === "cross-site" ||
        (origin && !allowed.includes(origin))
      )
        return res
          .status(403)
          .json({ error: "Submit this form from the application website." });
      const email = validateRegistration(req.body),
        key = waitlistClientKey(req, options.secret);
      if (options.hosted && !options.platform)
        throw new Error("Beta registration is unavailable.");
      const saved = options.platform
        ? await options.platform.registerWaitlist(email, key)
        : local!.register(email, key);
      if (!saved)
        return res
          .status(429)
          .set("Retry-After", "900")
          .json({
            error: "Too many attempts. Please wait 15 minutes before retrying.",
          });
      return res.json({ message: waitlistMessage });
    } catch (error) {
      const status = Number((error as { status?: number }).status) || 503;
      return res
        .status(status)
        .json({
          error:
            status === 400
              ? (error as Error).message
              : "Registration could not be saved. Please try again.",
        });
    }
  });
  if (options.platform)
    app.get("/api/beta/access", async (req, res) => {
      res.set("Cache-Control", "no-store");
      try {
        const user = await options.platform!.verifyUser(
          req.headers.authorization?.replace(/^Bearer\s+/i, "") || "",
        );
        res.json({ approved: await options.platform!.hasBetaAccess(user.id) });
      } catch (error) {
        res
          .status(Number((error as { status?: number }).status) || 503)
          .json({
            error: "Access could not be verified. Try again or sign in again.",
          });
      }
    });
  return () => local?.close();
}
