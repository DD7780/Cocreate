import { VERIFICATION_POLICY_VERSION } from './ai-accounting.js';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import type { CandidateVerification, SharedRequirement } from '../src/types.js';
import type { ProjectFile } from './project.js';
import { previewHtml } from './generator.js';
import { withIsolatedBrowser } from './isolation/browser.js';

export const CHECK_VERSION = VERIFICATION_POLICY_VERSION;
type Kind = CandidateVerification['checks'][number]['kind'];
const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const sourceHash = (files: ProjectFile[]) => hash([...files].sort((a, b) => a.path.localeCompare(b.path)));
export const candidateHash = (files: ProjectFile[], compiled: {javascript: string; css: string}) => hash({sourceHash: sourceHash(files), ...compiled});

function checksFor(criterion: string): Kind[] {
  const text = criterion.replace(/^A user can verify this behavior in the product:\s*/i, '').trim().replace(/[.!]$/, '');
  // ponytail: deliberately narrow criteria grammar; add reviewed checks instead of guessing arbitrary prose.
  if (/^(?:build|create) (?:a |an )?(?:catalog|recipe catalog|recipe list|list) with (?:a )?(?:working |functional )?(?:filter|search)$/i.test(text)) return ['filter'];
  if (/^(?:add|include|enable|support) (?:favorites|favourites)(?: toggles?)?$/i.test(text)) return ['favorites'];
  if (/^(?:add|enable|support) (?:alphabetical )?sorting(?: by name)?$/i.test(text)) return ['sort'];
  return [];
}
export function planVerification(requirements: SharedRequirement[], specificationRevision: number) {
  const rows = requirements.map(item => ({requirementId: item.id, requirementRevision: item.revision,
    criteriaHash: hash(item.acceptanceCriteria), criteria: item.acceptanceCriteria.map(text => ({criterionHash: hash(text), checks: checksFor(text)}))}));
  return {policyVersion: CHECK_VERSION, specificationRevision, requirements: rows,
    kinds: [...new Set(rows.flatMap(row => row.criteria.flatMap(item => item.checks)))],
    planHash: hash({policyVersion: CHECK_VERSION, specificationRevision, requirements: rows})};
}

const observerScript = fs.readFileSync(new URL('./isolation/list-observer.cjs', import.meta.url), 'utf8');
type ListObservation = {implemented: boolean; names: string[]; state: string | null; controlType?: string; options: Array<{value: string; label: string}>; query?: string};

export async function verifyCandidate(files: ProjectFile[], compiled: {javascript: string; css: string}, requirements: SharedRequirement[], specificationRevision: number, signal?: AbortSignal): Promise<CandidateVerification> {
  const plan = planVerification(requirements, specificationRevision);
  const checks: CandidateVerification['checks'] = [];
  let browserVersion: string | undefined;
  if (plan.kinds.length) await withIsolatedBrowser(async browser => {
    browserVersion = (await browser.call('Browser.getVersion')).product;
    for (const kind of plan.kinds) {
      // Separate targets dispose the prior React runtime and DOM world, not just its markup.
      const {targetId} = await browser.call('Target.createTarget', {url: 'about:blank'});
      const {sessionId} = await browser.call('Target.attachToTarget', {targetId, flatten: true});
      await browser.call('Page.enable', {}, sessionId);
      const {frameTree} = await browser.call('Page.getFrameTree', {}, sessionId);
      const frameId = frameTree.frame.id;
      await browser.call('Page.setDocumentContent', {frameId, html: previewHtml(compiled.javascript, compiled.css)}, sessionId);
      const {executionContextId} = await browser.call('Page.createIsolatedWorld', {frameId, worldName: 'trusted-verification', grantUniveralAccess: false}, sessionId);
      const inspect = async (step: 'inspect' | 'change' | 'reset' = 'inspect', value?: string) => {
        const reply = await browser.call('Runtime.evaluate', {contextId: executionContextId, expression: `(${observerScript})(${JSON.stringify({kind, step, value})})`, returnByValue: true}, sessionId);
        if (reply.exceptionDetails || !reply.result.value) return {implemented:false,names:[],state:null,options:[]} as ListObservation;
        return reply.result.value as ListObservation;
      };
      const pause = () => new Promise(resolve => setTimeout(resolve, 50));
      let before = await inspect();
      // Preview starts after its existing 700 ms storage bootstrap; this is a bounded render wait.
      for (let attempt = 0; !before.implemented && attempt < 20; attempt++) {await pause(); before = await inspect();}
      let passed = false, message = 'Required visible list/control was not implemented.';
      if (before.implemented) {
        if (kind === 'filter') {
          const query = before.controlType === 'SELECT' ? before.options.find(option => option.value && !/^(all|any)/i.test(option.label || ''))?.value : before.query;
          if (query) {
            await inspect('change', query); await pause(); const narrowed = await inspect();
            await inspect('reset', before.options[0]?.value || ''); await pause(); const restored = await inspect();
            passed = narrowed.names.length > 0 && narrowed.names.length < before.names.length &&
              narrowed.names.every(name => before.names.includes(name) && (before.controlType === 'SELECT' || name.toLowerCase().includes(query.toLowerCase()))) && JSON.stringify(restored.names) === JSON.stringify(before.names);
          }
          message = passed ? 'Filtering narrows the list; clearing restores it.' : 'Filtering did not narrow and restore the visible list.';
        } else if (kind === 'favorites') {
          await inspect('change'); await pause(); const toggled = await inspect();
          await inspect('reset'); await pause(); const restored = await inspect();
          passed = (before.state === 'false' || before.state === 'true') && toggled.state !== before.state && restored.state === before.state &&
            JSON.stringify(restored.names) === JSON.stringify(before.names);
          message = passed ? 'The favorite state toggles and restores without removing items.' : 'The favorite control did not toggle and restore its pressed/checked state.';
        } else {
          const ascending = [...before.names].sort((a, b) => a.localeCompare(b)), descending = [...ascending].reverse();
          const values = before.controlType === 'SELECT' ? before.options.filter(option => option.value).map(option => option.value) : [undefined, undefined];
          for (const value of values.slice(0, 4)) {await inspect('change', value); await pause(); const sorted = (await inspect()).names;
            if (JSON.stringify(sorted) === JSON.stringify(ascending) || JSON.stringify(sorted) === JSON.stringify(descending)) {
              passed = JSON.stringify(sorted) !== JSON.stringify(before.names); if (passed) break;
            }
          }
          message = passed ? 'Sorting changes list order into alphabetical order without losing items.' : 'Sorting did not change the list into alphabetical order.';
        }
      }
      checks.push({kind, version: CHECK_VERSION, implemented: before.implemented, passed, message});
      await browser.call('Target.closeTarget', {targetId});
    }
  }, {signal});
  const rows: CandidateVerification['requirements'] = plan.requirements.map(row => {
    const criteria = row.criteria.map(item => ({...item, status: item.checks.length === 0 ? 'unverified' as const : item.checks.every(kind => checks.find(check => check.kind === kind)?.passed) ? 'passed' as const : 'failed' as const}));
    const related = checks.filter(check => row.criteria.some(item => item.checks.includes(check.kind)));
    return {...row, criteria, implementation: related.length === 0 ? 'unknown' : related.every(check => check.implemented) ? 'observed' : 'missing',
      status: criteria.some(item => item.status === 'failed') ? 'failed' : criteria.length && criteria.every(item => item.status === 'passed') ? 'verified' : 'unverified'};
  });
  return {policyVersion: CHECK_VERSION, specificationRevision, sourceHash: sourceHash(files), candidateHash: candidateHash(files, compiled), planHash: plan.planHash,
    checkedAt: new Date().toISOString(), browserVersion, checks, requirements: rows,
    status: checks.some(check => !check.passed) ? 'failed' : rows.length && rows.every(row => row.status === 'verified') ? 'passed' : 'unverified'};
}

export function assertPromotionEvidence(report: CandidateVerification | undefined, files: ProjectFile[], compiled: {javascript: string; css: string}, requirements: SharedRequirement[], revision: number) {
  const plan = planVerification(requirements, revision);
  if (!report || report.policyVersion !== CHECK_VERSION || report.specificationRevision !== revision || report.sourceHash !== sourceHash(files) ||
      report.candidateHash !== candidateHash(files, compiled) || report.planHash !== plan.planHash || report.requirements.length !== plan.requirements.length) throw new Error('Verification evidence is missing or stale for this candidate and accepted revision.');
  if (report.checks.length !== plan.kinds.length || new Set(report.checks.map(item => item.kind)).size !== plan.kinds.length ||
      report.checks.some(item => !plan.kinds.includes(item.kind) || item.version !== CHECK_VERSION || typeof item.implemented !== 'boolean' || typeof item.passed !== 'boolean') || (plan.kinds.length && !report.browserVersion)) throw new Error('Verification check set is incomplete or invalid.');
  for (const row of plan.requirements) {
    const evidence = report.requirements.find(item => item.requirementId === row.requirementId);
    if (!evidence || evidence.requirementRevision !== row.requirementRevision || evidence.criteriaHash !== row.criteriaHash) throw new Error('Requirement verification evidence is stale.');
    const criteria = row.criteria.map(item => ({...item, status: item.checks.length === 0 ? 'unverified' : item.checks.every(kind => report.checks.find(check => check.kind === kind)?.passed) ? 'passed' : 'failed'}));
    const related = report.checks.filter(check => row.criteria.some(item => item.checks.includes(check.kind)));
    const implementation = related.length === 0 ? 'unknown' : related.every(check => check.implemented) ? 'observed' : 'missing';
    const status = criteria.some(item => item.status === 'failed') ? 'failed' : criteria.length && criteria.every(item => item.status === 'passed') ? 'verified' : 'unverified';
    if (JSON.stringify(evidence.criteria) !== JSON.stringify(criteria) || evidence.implementation !== implementation || evidence.status !== status) throw new Error('Requirement verification results are inconsistent.');
  }
  for (const kind of plan.kinds) if (!report.checks.some(check => check.kind === kind && check.version === CHECK_VERSION && check.implemented && check.passed)) throw new Error('Required behavior verification failed. The previous artifact is retained. Correct the accepted scope or retry the selected builder explicitly.');
  if (report.status === 'failed') throw new Error('Required behavior verification failed. The previous artifact is retained.');
  const status = report.requirements.length && report.requirements.every(row => row.status === 'verified') ? 'passed' : 'unverified';
  if (report.status !== status) throw new Error('Candidate verification status is inconsistent.');
}
