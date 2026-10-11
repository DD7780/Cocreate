export type PreviewTarget = {
    accountId: string;
    accountName: string;
    projectId: string;
    projectName: string;
    subdomain: string;
    productionBranch: string;
    environment: 'preview';
};
export type PreviewConnection = {
    id: string;
    ownerId: string;
    actors: string[];
    revision: number;
    target: PreviewTarget;
    verifiedAt: string;
    revoked: boolean;
};
export type PreviewPlan = {
    id: string;
    projectId: string;
    createdBy: string;
    createdAt: string;
    versionId: number;
    sourceHash: string;
    contentRef: string;
    branch: string;
    files: {
        path: string;
        hash: string;
        byteLength: number;
    }[];
    connection?: Omit<PreviewConnection, 'actors' | 'revoked' | 'verifiedAt'>;
    previousPlanId?: string;
    recoveryOf?: string;
    planHash: string;
    exposure: 'public-static-preview';
    operation: 'upload-static-assets-and-create-preview';
};
export type PreviewReceipt = {
    planId: string;
    planHash: string;
    actorId: string;
    approvedAt: string;
    state: 'dispatching' | 'unknown' | 'accepted' | 'verified' | 'failed';
    dispatchPhase: 'assets' | 'create_pending';
    providerId?: string;
    url?: string;
    verifiedAt?: string;
    detail: string;
};
export type PreviewView = {
    connections: PreviewConnection[];
    plans: PreviewPlan[];
    receipts: PreviewReceipt[];
};
