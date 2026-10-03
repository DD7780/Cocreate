# Feature change packet

Use this before implementation. Fill in the outcome and scope, retrieve a bounded subgraph, then verify its facts against source. The current rules are in [instructions.md](../../instructions.md).

1. **Outcome:** user-visible trigger, current behavior and required behavior. Identify local/hosted mode and one concrete regression to preserve.
2. **Scope:** UI, server, shared contract or documentation. List allowed files. Explain any shared/backend change required by a UI request before editing it.
3. **Evidence:** Graphify query/path/explain result with source locations, exact imports/callers and relevant current steering. Link dated history only when compatibility requires it.
4. **Required contracts:** include affected `shared/types.ts` shapes, runtime validators, authorization, durable receipts and recovery/accounting rules. Optional relevance ranking cannot remove these.
5. **Verification:** relevant existing regression tests, full test/build requirements, and browser scenarios for changed interaction. State controlled-provider versus live-hosted limits.

```powershell
graphify query "repository vocabulary for the feature" --budget 1800
corepack pnpm audit:code -- --check --scope ui --base origin/main
corepack pnpm audit:code -- --jev --limit 20 --budget-usd 0.10 --brief "specific change" --files src/App.tsx,src/workspace/AgentPanel.tsx,shared/types.ts
```

Choose query terms from the graph vocabulary per the Graphify skill. The Jev shortlist above is an example; retrieve the actual feature's files and retain its mandatory contracts. Keep the coding agent's edit context bounded to this packet. Jev scores semantic relevance, not safe deletion or authorization.

If a scope check flags a required contract change, explicitly widen the packet and run the additional server/shared checks. Do not bypass a scope check by hiding edits. Record implementation evidence in the checklist, update affected canonical documents, and refresh graph coverage after code changes.
