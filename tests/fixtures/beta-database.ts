import { createRequire } from "node:module";
import fs from "node:fs";
import pg from "pg";
import { randomUUID } from "node:crypto";

export type SqlResult = { rows: Record<string, any>[] };
export type BetaDatabase = {
  query(sql: string, params?: unknown[]): Promise<SqlResult>;
  exec(sql: string): Promise<unknown>;
  asRole(
    role: "service_role" | "authenticated" | "anon",
    sql: string,
    params?: unknown[],
  ): Promise<SqlResult>;
  close(): Promise<void>;
  concurrentConnections: boolean;
};

export const betaAccounts = {
  founder: "11111111-1111-4111-8111-111111111111",
  cofounder: "22222222-2222-4222-8222-222222222222",
  requester: "33333333-3333-4333-8333-333333333333",
  other: "44444444-4444-4444-8444-444444444444",
  unconfirmed: "55555555-5555-4555-8555-555555555555",
};

export async function betaDatabase(): Promise<BetaDatabase> {
  const connection = process.env.COCREATE_BETA_TEST_DATABASE_URL;
  let db: BetaDatabase;
  if (connection) {
    const url = new URL(connection);
    if (
      !["localhost", "127.0.0.1"].includes(url.hostname) ||
      url.pathname !== "/cocreate_beta_test"
    )
      throw new Error(
        "Beta SQL tests require a disposable local cocreate_beta_test database.",
      );
    // Create a fresh database; never reset schemas or delete data in the supplied database.
    const databaseName = `cocreate_beta_test_${randomUUID().replaceAll("-", "")}`;
    const administrator = new pg.Client({ connectionString: connection });
    await administrator.connect();
    try {
      await administrator.query(`create database "${databaseName}"`);
    } finally {
      await administrator.end();
    }
    url.pathname = `/${databaseName}`;
    const pool = new pg.Pool({ connectionString: url.toString(), max: 4 });
    db = {
      query: (sql, params) => pool.query(sql, params),
      exec: (sql) => pool.query(sql),
      concurrentConnections: true,
      async asRole(role, sql, params) {
        const client = await pool.connect();
        try {
          await client.query("begin");
          await client.query(`set local role ${role}`);
          const result = await client.query(sql, params);
          await client.query("commit");
          return result;
        } catch (error) {
          await client.query("rollback");
          throw error;
        } finally {
          client.release();
        }
      },
      close: () => pool.end(),
    };
  } else {
    // Reuse the pinned Prisma development dependency; native PostgreSQL CI verifies contention.
    const require = createRequire(import.meta.url),
      prismaRequire = createRequire(require.resolve("prisma/package.json"));
    const { PGlite } = prismaRequire("@electric-sql/pglite");
    let engine = new PGlite();
    db = {
      query: (sql, params) => engine.query(sql, params),
      exec: (sql) => engine.exec(sql),
      concurrentConnections: false,
      asRole: (role, sql, params) =>
        engine.transaction(async (tx: any) => {
          await tx.exec(`set local role ${role}`);
          return tx.query(sql, params);
        }),
      async close() {
        await engine.close();
        // Release the WASM database before another fixture runs in the bounded CI image.
        engine = null;
        globalThis.gc?.();
      },
    };
  }
  try {
    await db.exec(`
      do $$ begin
        if not exists(select 1 from pg_roles where rolname='service_role') then create role service_role bypassrls; end if;
        if not exists(select 1 from pg_roles where rolname='authenticated') then create role authenticated; end if;
        if not exists(select 1 from pg_roles where rolname='anon') then create role anon; end if;
      end $$;
      create schema if not exists auth; create schema if not exists private;
      create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,is_anonymous boolean not null default false);
      create table public.beta_access(user_id uuid primary key references auth.users(id),is_owner boolean not null default false,approved_at timestamptz not null default now(),revoked_at timestamptz);
      alter table public.beta_access enable row level security;
      revoke all on public.beta_access from public,anon,authenticated;
      grant select,insert,update,delete on public.beta_access to service_role;
      grant usage on schema auth to service_role;
      create table public.project_members(project_id uuid,user_id uuid,role text,can_share boolean not null default false);
      grant select on public.project_members to service_role;
      -- Deliberately NO auth.users grant: matches observed hosted permissions.
    `);
    await db.exec(
      fs.readFileSync(
        new URL(
          "../../supabase/migrations/20261008191401_beta_access_requests.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    for (const [name, id] of Object.entries(betaAccounts))
      await db.query(
        "insert into auth.users(id,email,email_confirmed_at) values($1,$2,$3)",
        [
          id,
          `${name}@example.test`,
          name === "unconfirmed" ? null : new Date().toISOString(),
        ],
      );
    await db.query(
      "insert into public.beta_access(user_id,is_owner) values($1,true),($2,false)",
      [betaAccounts.founder, betaAccounts.cofounder],
    );
    await db.query(
      "insert into public.beta_reviewers(user_id) values($1),($2)",
      [betaAccounts.founder, betaAccounts.cofounder],
    );
    return db;
  } catch (error) {
    await db.close();
    throw error;
  }
}
