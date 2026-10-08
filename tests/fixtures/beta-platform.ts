import { createClient } from "@supabase/supabase-js";
import { SupabasePlatform } from "../../server/supabase-platform.js";
import { betaAccounts, type BetaDatabase } from "./beta-database.js";

// Test-only PostgREST/Auth transport. The SDK and actual SQL functions run; no external request leaves this fixture.
export function betaPlatform(db: BetaDatabase) {
  const platform = new SupabasePlatform({
    url: "https://synthetic.supabase.co",
    publishableKey: "sb_publishable_synthetic",
    secretKey: "sb_secret_synthetic",
  });
  const rpcArguments: Record<string, string[]> = {
    request_beta_access: ["actor_id", "requester_message"],
    decide_beta_access: ["actor_id", "target_request_id", "decision"],
    claim_beta_email: ["delivery_lease"],
    prepare_beta_email: ["target_delivery", "delivery_lease", "payload"],
    finish_beta_email: [
      "target_delivery",
      "delivery_lease",
      "message_id",
      "delivery_error",
    ],
    has_due_beta_email: [],
  };
  const request: typeof fetch = async (input, init) => {
    const url = new URL(String(input)),
      headers = new Headers(init?.headers);
    try {
      if (url.pathname.startsWith("/auth/v1/admin/users/")) {
        const id = url.pathname.split("/").at(-1);
        const { rows } = await db.query(
          "select * from auth.users where id=$1",
          [id],
        );
        return Response.json(rows[0] || {}, {
          status: rows.length ? 200 : 404,
        });
      }
      const functionName = url.pathname.split("/rpc/")[1];
      if (functionName) {
        const names = rpcArguments[functionName];
        if (!names) throw new Error("Unknown synthetic RPC.");
        const args = JSON.parse(String(init?.body || "{}"));
        const result = await db.asRole(
          "service_role",
          `select * from public.${functionName}(${names.map((_, index) => `$${index + 1}`).join(",")})`,
          names.map((name) => args[name] ?? null),
        );
        const scalar = [
          "prepare_beta_email",
          "finish_beta_email",
          "has_due_beta_email",
        ].includes(functionName);
        return Response.json(
          scalar
            ? result.rows[0]?.[functionName]
            : headers
                  .get("Accept")
                  ?.includes("application/vnd.pgrst.object+json")
              ? result.rows[0]
              : result.rows,
        );
      }
      const table = url.pathname.split("/").at(-1)!;
      if (
        ![
          "beta_access",
          "beta_reviewers",
          "beta_access_requests",
          "beta_email_deliveries",
          "project_members",
        ].includes(table)
      )
        throw new Error("Unknown synthetic table.");
      const columns = url.searchParams.get("select") || "*";
      if (!/^[a-z_,*]+$/.test(columns))
        throw new Error("Invalid synthetic selection.");
      const params: unknown[] = [],
        conditions: string[] = [];
      for (const [key, value] of url.searchParams) {
        if (["select", "order", "limit"].includes(key)) continue;
        if (!/^[a-z_]+$/.test(key))
          throw new Error("Invalid synthetic filter.");
        if (value === "is.null") conditions.push(`${key} is null`);
        else {
          const operator = value.split(".")[0];
          if (!["eq", "neq"].includes(operator))
            throw new Error("Unsupported synthetic filter.");
          params.push(value.slice(operator.length + 1));
          conditions.push(
            `${key}${operator === "eq" ? "=" : "<>"}$${params.length}`,
          );
        }
      }
      const order = url.searchParams.get("order"),
        limit = url.searchParams.get("limit");
      if (order && !/^[a-z_]+\.(asc|desc)(,[a-z_]+\.(asc|desc))*$/.test(order))
        throw new Error("Invalid synthetic order.");
      if (limit && !/^\d+$/.test(limit))
        throw new Error("Invalid synthetic limit.");
      const result = await db.asRole(
        "service_role",
        `select ${columns} from public.${table}${conditions.length ? " where " + conditions.join(" and ") : ""}${order ? " order by " + order.replaceAll(".", " ") : ""}${limit ? " limit " + limit : ""}`,
        params,
      );
      const single = headers
        .get("Accept")
        ?.includes("application/vnd.pgrst.object+json");
      return Response.json(single ? result.rows[0] || null : result.rows);
    } catch (error) {
      return Response.json(
        {
          message: (error as Error).message,
          code: (error as { code?: string }).code || "55000",
        },
        { status: 400 },
      );
    }
  };
  const admin = createClient(
    "https://synthetic.supabase.co",
    "sb_secret_synthetic",
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: request },
    },
  );
  Object.defineProperty(platform, "admin", { value: admin });
  platform.verifyUser = async (token) => {
    if (!Object.values(betaAccounts).includes(token))
      throw Object.assign(new Error("Invalid synthetic account."), {
        status: 401,
      });
    const { rows } = await db.query("select * from auth.users where id=$1", [
      token,
    ]);
    return {
      id: token,
      email: rows[0].email,
      user_metadata: { beta_approved: true, is_owner: true },
    };
  };
  return platform;
}
