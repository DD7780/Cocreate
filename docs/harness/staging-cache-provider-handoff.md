# Staging legacy cache recovery request — prepared, not sent

This is a bounded provider-assisted recovery draft, not permission to send it or upgrade a plan. Target only the existing Free Supabase project `ctnjxvwyttnjehnbfktq` and private bucket `cocreate-artifacts`. No production project, JWT, secret key, password or private artifact content belongs in the request.

## Reviewable operation

Ask Supabase support whether they can invalidate the three exact warmed staging object paths below on all edge cache variants, while retaining the underlying immutable objects and restrictive origin authorization. Request an operation ID, completion time, scope and confirmation whether any charge or plan change is required before proceeding. Prefer a no-charge provider-assisted remediation. Eligibility is unverified; do not claim support will perform it.

The [official manual purge API](https://supabase.com/docs/guides/storage/cdn/purge-cdn-cache) requires Pro or above and a server secret. This project is Free; no upgrade or paid purge is authorized or attempted. That API invalidates CDN entries rather than deleting stored objects, may take up to 60 seconds, and does not clear bytes already in browser caches. Previously delivered bytes cannot be recalled.

## Draft for the project owner to submit privately

Our isolated Free staging project `ctnjxvwyttnjehnbfktq` has a private `cocreate-artifacts` bucket. A restrictive authenticated SELECT policy now denies all participant raw reads; delivery is through our membership-checked server with no-store responses. At 2026-10-13 12:38:08 UTC, the original authenticated no-store warmed URL still returned exact test bytes with HTTP 200 / CF-Cache-Status HIT at edge KTM to two retained, currently expired participant JWTs. We did not alter the URL or bypass cache. All six independently freshly authenticated roles were denied all three raw paths. The stored no-store body response had `public, private, no-store, max-age=0, must-revalidate`. The warm receipt is dated 08:49:26 UTC; token equality to that receipt is inferred from unchanged private fixture checkpoint lineage because a token fingerprint was not recorded then.

Please investigate and, if available without upgrading or charging this Free project, invalidate the cached authorization variants of these exact test object paths globally without changing or deleting their stored bytes:

1. `319c32bd-3a50-4363-b876-347a81150ee2/fixtures/89e4ca06e0db2bc095803c57a81f3390a74fa766c7d83ddc4ca570f79f11a9e8.txt`
2. `319c32bd-3a50-4363-b876-347a81150ee2/bodies/fe5bdd1f1a4b176f628b85bed5cb60ef699b459fc93d20a98819b94c48abbce0`
3. `319c32bd-3a50-4363-b876-347a81150ee2/bodies/7beb34302e12d48717e04257a2979fef2c1e194d768773a7a7c772487edeec16`

The third path failed four held-token initial/repeat checks; the first two were denied at this observed edge. They remain in the bounded request because all three were warmed in the earlier cache experiments and global cutoff is unproved. We can supply sanitized status/hash receipts without credentials or object contents. Please confirm the cause, safe prevention for future private objects, remediation eligibility and a completion receipt. Do not change our plan or delete stored objects.

## Admission after an actual provider change

Keep held original URL/JWT material in its operator-only checkpoint. After confirmed provider action, rerun only the affected held-URL checks with unchanged paths/headers/tokens, followed by the fresh-role raw-read boundary and hash-verified application recovery on deployed exact source. Record provider operation and new dated receipt; preserve the 26/30 failed receipt. Local edge denial is not independent evidence of global invalidation. Main remains held until the legacy-cutoff gate and full hosted release gates pass.

Cleanup retains immutable bodies, private checkpoints, signing/encryption values and v6 readers. No cleanup deletes source evidence. Any resource deletion, subscription change or outbound support message requires its concrete authorization.
