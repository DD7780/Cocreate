import type { Response } from 'express';
import { CoordinatorUnavailableError, coordinatorRetry } from './coordinator.js';
export function coordinatorResponse(res: Response, error: unknown, ownershipBoundary = false) {
    if (!ownershipBoundary && !(error instanceof CoordinatorUnavailableError))
        return false;
    res.setHeader('Retry-After', '2');
    res.setHeader('Cache-Control', 'no-store');
    res.status(503).json(coordinatorRetry);
    return true;
}
