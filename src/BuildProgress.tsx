import type { BuildProgress as Progress } from "../shared/types";
import './build-progress.css';

export function BuildProgress({ progress, direct = false, hasAcceptedRequirements = true, needsInterpretationReview = false }: { progress?: Progress; direct?: boolean; hasAcceptedRequirements?: boolean; needsInterpretationReview?: boolean }) {
  if (!progress) return null;
  if (direct) return <div className="build-progress" role="status" aria-label="Shared build progress"><span>{progress.phase==='failed' ? 'Failed · previous artifact retained' : progress.phase==='building' ? 'Building' : progress.phase==='collecting' ? 'Queued' : progress.phase==='pending' ? 'Preparing prompt' : 'Saved'}</span><span>{progress.availableVersion===null ? 'No product available yet' : `Available v${progress.availableVersion}`}</span>{progress.pendingSubmissions>0 && <span>{progress.pendingSubmissions} submitted {progress.pendingSubmissions===1 ? 'change' : 'changes'} waiting{progress.phase==='building' ? ' for this build' : ''}</span>}</div>;
  const available = progress.availableVersion === null ? 'No product available yet' : `Available v${progress.availableVersion}${progress.availableRevision === undefined ? ' · revision not recorded' : ` · r${progress.availableRevision}`}`;
  const active = progress.buildingRevision === undefined ? needsInterpretationReview ? 'Interpretation needs review' : !hasAcceptedRequirements ? 'No accepted requirements yet' : progress.phase === 'collecting' ? `Collecting for accepted r${progress.acceptedRevision}` : `Accepted r${progress.acceptedRevision}` : `Building r${progress.buildingRevision}`;
  return <div className="build-progress" role="status" aria-label="Shared build progress">
    <span>{active}</span><span>{available}</span>
    {progress.queuedRevision !== undefined && <span>Next accepted r{progress.queuedRevision}</span>}
    {progress.pendingSubmissions > 0 && <span>{progress.pendingSubmissions} submitted {progress.pendingSubmissions === 1 ? 'change waiting' : 'changes waiting'}{progress.buildingRevision !== undefined ? ' for this build to finish' : ' for interpretation'}</span>}
  </div>;
}
