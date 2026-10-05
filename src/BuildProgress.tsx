import type { BuildProgress as Progress } from "../shared/types";
import './build-progress.css';

export function BuildProgress({ progress }: { progress?: Progress }) {
  if (!progress) return null;
  const available = progress.availableVersion === null ? 'No product available yet' : `Available v${progress.availableVersion}${progress.availableRevision === undefined ? ' · revision not recorded' : ` · r${progress.availableRevision}`}`;
  const active = progress.buildingRevision === undefined ? progress.phase === 'collecting' ? `Collecting for accepted r${progress.acceptedRevision}` : `Accepted r${progress.acceptedRevision}` : `Building r${progress.buildingRevision}`;
  return <div className="build-progress" role="status" aria-label="Shared build progress">
    <span>{active}</span><span>{available}</span>
    {progress.queuedRevision !== undefined && <span>Next accepted r{progress.queuedRevision}</span>}
    {progress.pendingSubmissions > 0 && <span>{progress.pendingSubmissions} submitted {progress.pendingSubmissions === 1 ? 'change waiting' : 'changes waiting'}{progress.buildingRevision !== undefined ? ' for this build to finish' : ' for interpretation'}</span>}
  </div>;
}
