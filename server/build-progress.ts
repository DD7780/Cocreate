import type { BuildProgress, Version } from "../shared/types.js";
import type { Room } from './rooms.js';
import { acceptedRequirementFingerprint, eligibleRequirements } from './requirements.js';

export function buildProgressFor(room: Room, available?: Version): BuildProgress {
  const pendingSubmissions = room.submissions.filter(item => (room.submissionMode!=='direct' || item.mode==='direct') && (item.status === 'submitted' || item.status === 'interpreting')).length;
  const pendingAccepted = room.submissionMode!=='direct' && eligibleRequirements(room.sharedRequirements, room.conflictGroups).length > 0 && acceptedRequirementFingerprint(room.sharedRequirements, room.conflictGroups) !== room.lastBuiltFingerprint;
  return {
    policy: 'bounded-collection-v1',
    phase: room.status === 'Error' ? 'failed' : room.buildTask ? 'building' : room.buildTimer || room.buildAdmissionClosed ? 'collecting' : pendingSubmissions || room.submissionMode!=='direct' && room.intentBuildPending ? 'pending' : 'idle',
    acceptedRevision: room.specificationRevision,
    buildingRevision: room.buildingRevision,
    availableVersion: available?.id ?? null,
    availableRevision: available?.specificationRevision,
    queuedRevision: pendingAccepted && room.specificationRevision !== room.buildingRevision ? room.specificationRevision : undefined,
    pendingSubmissions,
    collectionEndsAt: room.collectionEndsAt ? new Date(room.collectionEndsAt).toISOString() : undefined,
  };
}
