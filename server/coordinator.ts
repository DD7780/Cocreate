import { randomUUID } from 'node:crypto';
type Rpc = (name: string, input: Record<string, unknown>) => PromiseLike<{
    data: unknown;
    error: {
        message?: string;
    } | null;
}>;
export const coordinatorRetry = {
    code: 'coordinator_unavailable', retryAfterMs: 2000, retryable: true,
    error: 'The workflow is temporarily unavailable on this server. Retry with the same request ID in two seconds. If this continues, reopen the project.',
} as const;
export class CoordinatorUnavailableError extends Error {
    readonly status = 503;
    constructor() { super(coordinatorRetry.error); }
}
/** A process that loses ownership never reacquires it, including after a delayed RPC. */
export class RemoteCoordinator {
    readonly ownerId = randomUUID();
    private epochs = new Map<string, number>();
    private claims = new Map<string, Promise<void>>();
    private renewals = new Map<string, Promise<void>>();
    private lost = new Set<string>();
    private listeners = new Set<(projectId: string) => void>();
    private closed = false;
    private timer: NodeJS.Timeout;
    private timeoutMs: number;
    constructor(private rpc: Rpc, options: {
        timeoutMs?: number;
        heartbeatMs?: number;
    } = {}) {
        this.timeoutMs = options.timeoutMs ?? 5000;
        this.timer = setInterval(() => { for (const id of this.epochs.keys())
            void this.assert(id).catch(() => { }); }, options.heartbeatMs ?? 10000);
        this.timer.unref();
    }
    onLost(listener: (projectId: string) => void) { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; }
    invalidate(projectId: string) {
        this.epochs.delete(projectId);
        if (this.lost.has(projectId))
            return;
        this.lost.add(projectId);
        for (const listener of this.listeners)
            listener(projectId);
    }
    private async bounded(name: string, input: Record<string, unknown>) {
        let timer: NodeJS.Timeout | undefined;
        try {
            return await Promise.race([Promise.resolve(this.rpc(name, input)), new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new CoordinatorUnavailableError()), this.timeoutMs); })]);
        }
        finally {
            clearTimeout(timer);
        }
    }
    private async call(projectId: string, epoch: number | null) {
        try {
            const { data, error } = await this.bounded('claim_workflow_coordinator', { target_project_id: projectId, target_owner_id: this.ownerId, expected_epoch: epoch });
            if (error || !Number.isSafeInteger(data) || Number(data) <= 0)
                throw new CoordinatorUnavailableError();
            return data as number;
        }
        catch {
            throw new CoordinatorUnavailableError();
        }
    }
    claim(projectId: string): Promise<void> {
        if (this.closed || this.lost.has(projectId))
            return Promise.reject(new CoordinatorUnavailableError());
        if (this.epochs.has(projectId))
            return this.assert(projectId);
        const pending = this.claims.get(projectId);
        if (pending)
            return pending;
        const task = this.call(projectId, null).then(async (epoch) => {
            if (this.closed || this.lost.has(projectId)) {
                await this.release(projectId, epoch).catch(() => { });
                throw new CoordinatorUnavailableError();
            }
            this.epochs.set(projectId, epoch);
        }).finally(() => this.claims.delete(projectId));
        this.claims.set(projectId, task);
        return task;
    }
    assert(projectId: string): Promise<void> {
        const epoch = this.epochs.get(projectId);
        if (this.closed || this.lost.has(projectId) || epoch === undefined)
            return Promise.reject(new CoordinatorUnavailableError());
        const pending = this.renewals.get(projectId);
        if (pending)
            return pending;
        const task = this.call(projectId, epoch).then(current => {
            if (this.closed || this.lost.has(projectId) || current !== epoch || this.epochs.get(projectId) !== epoch)
                throw new CoordinatorUnavailableError();
        }).catch(() => { this.invalidate(projectId); throw new CoordinatorUnavailableError(); }).finally(() => this.renewals.delete(projectId));
        this.renewals.set(projectId, task);
        return task;
    }
    fence(projectId: string) {
        const epoch = this.epochs.get(projectId);
        if (this.closed || this.lost.has(projectId) || epoch === undefined)
            throw new CoordinatorUnavailableError();
        return { target_owner_id: this.ownerId, expected_epoch: epoch };
    }
    private release(projectId: string, epoch: number) { return this.bounded('release_workflow_coordinator', { target_project_id: projectId, target_owner_id: this.ownerId, expected_epoch: epoch }); }
    async close() {
        if (this.closed)
            return;
        this.closed = true;
        clearInterval(this.timer);
        const held = [...this.epochs];
        for (const [id] of held)
            this.invalidate(id);
        await Promise.allSettled([...held.map(([id, epoch]) => this.release(id, epoch)), ...this.claims.values(), ...this.renewals.values()]);
        this.listeners.clear();
    }
}
