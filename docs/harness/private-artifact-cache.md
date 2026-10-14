# Private artifact cache and revocation — bounded change packet

## Outcome and evidence

Real isolated staging checks against source `6f6ef3a` passed 33/35 on 2026-10-13. A participant's existing JWT lost project-row access immediately after membership/beta revocation, but an already fetched private Storage object URL still returned its exact bytes. The same identity was denied on a fresh URL. The diagnostic recorded `CF-Cache-Status: HIT` and `Cache-Control: public, max-age=3600`. These failed receipts remain dated evidence; a cache-busting request cannot turn this into successful revocation proof.

Graphify query `Supabase private artifact upload cacheControl private download revocation` points to `SupabasePlatform.uploadVerified`, `artifactPath`, and the Storage fixture. Source confirms the real SDK's default upload TTL is 3600; the app's download routes already require membership and return `no-store`. Publication must explicitly upload private immutable bodies with explicit private/no-store/zero-TTL/must-revalidate headers and verify the stored cache metadata before committing references, including duplicate-body reconciliation. Do not overwrite or delete immutable bodies to force a passing check.

## Scope and contracts

Allowed runtime change: `server/supabase-platform.ts`, a restrictive Storage migration, the hosted permission/release validators, focused Storage/SQL fixtures and tests, affected canonical steering and evidence. Keep content hashes, v6 recovery reads, coordinator fencing, caller attribution, Canvas, Workflow and token accounting unchanged. Private bucket alone is insufficient. SDK object metadata must attest `private, no-store, max-age=0, must-revalidate` before a body is newly published or reused for publication; unknown/older metadata fails closed. Recovery reads of historical bodies remain compatible. A repair of old cache metadata cannot establish eviction of copies already cached by a provider/browser; legacy warm URLs remain a release gate until separately verified.

## Verification and recovery

Run focused artifact publication/restoration/replay regressions, reject cacheable duplicate bodies without committing a snapshot, build/typecheck/boundaries and exact native CI for the new candidate. On actual isolated Supabase, publish a new canonical immutable body through the changed publisher, warm the exact authenticated URL with two participants, remove designated membership and revoke/restore designated beta approval, and check the same JWT and same URL without nonce/query/header bypass. Hash-verify surviving participant bytes and recovery; preserve the original cached object and failed proof.

Main remains held. This checks the real database/storage boundary separately from the still-blocked container/API/socket/browser/Blender/generated-preview gates. Production is untouched. No cache purge, unknown mutation replay, paid inference or new resource is authorized. Supabase's [Storage caching documentation](https://supabase.com/docs/guides/storage/cdn/fundamentals) and [Smart CDN cautions](https://supabase.com/docs/guides/storage/cdn/smart-cdn) were reviewed 2026-10-13; empirical evidence owns the hosted boundary.

The first attempted fix with only max-age=0 failed real same-URL revocation again (7/9); the provider returned HIT even with zero TTL. Preserve that experiment and require no-store itself. The first metadata probe also found the real SDK info shape places cacheControl at the top level; the controlled fixture was corrected to match it. No success is inferred from these failures.

## Verified boundary revision

Explicit no-store also failed same-URL revocation with fresh tokens (7/9). Therefore response headers alone cannot authorize private delivery. Add a restrictive authenticated Storage SELECT policy that denies raw reads for the app bucket; only the server uses its guarded administrator connection. The already implemented app download route checks current membership before/after restoration and returns no-store. Participants retain normal artifact downloads through that route. The real hosted verifier must require raw Storage denial for all six roles plus hash-verified app downloads for approved members. Add release gates for warm app-URL revocation, restoration, and the legacy Storage cache cutoff. Do not relabel old warmed URLs as safe, and do not erase the failed experiments. A changed boundary is preparation until real hosted application tests pass.

Native SQL checks must verify that a participant cannot recover permission through another permissive Storage policy, while the service role can read. Local app with real staging backend may exercise that boundary, but cannot replace the designated hosted-origin gate.

## Legacy cutoff remains failed — 2026-10-13

[Exact a53 source receipt](../../artifacts/staging-preparation/legacy-storage-cutoff-20261013.json) records 26/30 passing requests, four failures. Original no-store warmed Storage bytes still returned HTTP 200 / CF HIT at KTM to retained expired viewer/revoked JWTs, both initial/repeated requests, with the same URL and no cache bypass. The earlier warm receipt did not retain a token fingerprint: equality is inferred from unchanged private fixture checkpoint lineage and is explicitly disclosed. All six freshly authenticated roles were denied all three raw URLs (18/18). Expiry, elapsed original TTL and fresh-role denial do not prove legacy eviction. Global cutoff and hosted application recovery remain unproved.

Original token material is retained in a separate QUTA4/SYSTEM-only checkpoint before fresh sign-ins. Objects, policies, memberships and approvals were not mutated by this check. Preserve immutable bytes and all failed receipts. The [bounded provider handoff](staging-cache-provider-handoff.md) is prepared but unsent. Official manual CDN purge requires Pro or above; this is a Free project, with no upgrade, purge, deletion or paid inference performed. Retest the affected held-URL cases only after a relevant confirmed provider change; main remains held.
