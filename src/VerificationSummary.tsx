import type { AIRunRecord, RoomView } from "../shared/types";
import './build-progress.css';

export function VerificationSummary({ run, revisions, submissions }: {run?: AIRunRecord; revisions: RoomView['requirementRevisions']; submissions?: RoomView['directSubmissions']}) {
  if (!run) return null;
  const report = run.verification.evidence;
  if (!report) return <div className="verification-summary">Functional checks were not recorded for this build.</div>;
  const unverified = report.requirements.filter(item => item.status === 'unverified').length;
  const title = run.outcome === 'failed' ? 'Build failed' : report.status === 'passed' ? 'Covered behavior checks passed' : 'Limited functional coverage';
  const accepted = revisions?.find(item => item.revision === report.specificationRevision)?.accepted;
  return <details className="verification-summary">
    <summary>{title} · checked r{report.specificationRevision}{unverified > 0 && ` · ${unverified} ${submissions ? unverified === 1 ? 'instruction' : 'instructions' : unverified === 1 ? 'requirement' : 'requirements'} unverified`}</summary>
    <p>Compilation {run.verification.compilationPassed ? 'passed' : 'did not pass'}. These checks cover the behaviors listed below. Unverified criteria still need review.</p>
    <ul>{report.requirements.map(item => <li key={item.requirementId}>
      <strong>{submissions?.find(submission=>submission.id===item.requirementId)?.prompt || accepted?.find(requirement => requirement.id === item.requirementId)?.description || (submissions ? 'Submitted instruction' : 'Accepted requirement')}</strong>
      <span>{item.implementation === 'observed' ? 'Implemented control observed' : item.implementation === 'missing' ? 'Required control missing' : 'Implementation unknown'} · {item.status}</span>
      {report.checks.filter(check => item.criteria.some(criterion => criterion.checks.includes(check.kind))).map(check => <p key={check.kind}>{check.passed ? 'Passed' : 'Failed'}: {check.message}</p>)}
    </li>)}</ul>
  </details>;
}
