# Responsiveness evidence

## 2026-09-26 measured slice

This is a small engineering benchmark, not a production percentile. The repeatable harness is `scripts/measure-responsiveness.ts`. It uses Node v22.23.2 on Windows 10.0.26200, an Intel i5-10300H, localhost WebSockets, two authenticated local participants, five cold room samples, and synthetic 2,000- and 200,000-character Yjs documents. It makes no provider calls.

| Measure (median of 5) | 2k before | 2k after | 200k before | 200k after |
| --- | ---: | ---: | ---: | ---: |
| Open and receive document | 14.88 ms | 14.39 ms | 14.65 ms | 12.45 ms |
| Edit propagation | 15.75 ms | 15.48 ms | 15.08 ms | 14.22 ms |
| Submission flush acknowledgement | 15.54 ms | 15.39 ms | 15.63 ms | 15.57 ms |
| Reconnect and catch up | 28.98 ms | 15.20 ms | 16.36 ms | 15.85 ms |
| Peer messages in scenario | 9 | 8 | 9 | 8 |
| Peer bytes in scenario | 10,958 | 8,797 | 208,961 | 206,800 |
| Full room-state messages | 4 | 3 | 4 | 3 |
| Concurrent subscriptions | 2 | 2 | 2 | 2 |

The retained improvement is the deterministic traffic reduction: an edit no longer broadcasts the full room view in addition to its incremental Yjs update. Localhost latency samples overlap, so they do not support a latency-improvement claim. Durable save acknowledgement and explicit submission semantics are unchanged.

The production build previously shipped one 1,023.50 kB JavaScript file (310.98 kB gzip) before route code could be excluded. After route splitting it emits a 421.61 kB shared entry (121.17 kB gzip), a 26.58 kB project/auth shell (8.02 kB gzip), and a lazy 573.83 kB workspace/editor chunk (181.73 kB gzip). The login/projects shell therefore transfers about 129.19 kB gzip before opening the editor, 58% less than the previous single bundle. This is transferred-byte evidence, not login-to-usable timing.

The browser workspace formerly requested the complete room view over HTTP and then immediately received document and room state through its WebSocket. Initial state now comes from the authenticated WebSocket only; the HTTP state read remains available solely for reconnect failure diagnosis. One WebSocket/provider is created per mounted workspace and existing disposal/backoff tests cover listener cleanup, bounded jitter, terminal authentication failures, and disconnected-edit state-vector recovery.

Queue delay and model execution time were not measured here because the benchmark deliberately spent no provider credits; the workflow already records run timing, but no representative authorized production dataset was available. Likewise, a real Supabase login-to-workspace timing, multi-project switching trace, slow-network production trace, and warm-cache sample remain unclaimed. The production browser smoke covers editor focus, shortcut submission guards, mobile layout, and invalid-session UI; it is not a network-performance benchmark.

Verification: 92/92 controlled tests passed, the TypeScript/Vite production build passed, and the Windows Chrome production smoke passed. Firefox, Safari, Linux, macOS, real network throttling, two real browser accounts, and provider execution were not exercised.
