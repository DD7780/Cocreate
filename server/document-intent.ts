import { createHash } from 'node:crypto';
import type { ArtifactTarget } from '../shared/types.js';

/** Routing is derived from authenticated source, never a provider-selected tool/target. */
export function submittedOutput(passage: string, correctedTarget?: ArtifactTarget): { output?: ArtifactTarget; reason?: string } {
  // App instructions such as "show Markdown documents in the app" still target the app.
  if (!/\b(?:write|generate|draft|create|revise|update|make)\s+(?:(?:a|an|the|my|our|this|new|existing|short|project|markdown)\s+){0,4}(?:markdown\s+)?(?:document|brief|report|readme)\b/i.test(passage)) {
    if (/\b(?:(?:use|open|control|launch|automate) (?:a |the )?(?:browser|desktop|chrome|edge)|browser automation|desktop control|blender|provision|deploy|spreadsheet|xlsx|powerpoint|pptx|pdf|word document|docx)\b/i.test(passage))
      return { reason: 'This workflow supports application builds and Markdown documents. Browser/desktop control, Blender, provisioning, deployment and other document formats are unavailable.' };
    return correctedTarget && !/\b(?:build|create|generate|update|revise)\s+(?:(?:a|an|the|my|our|existing|new)\s+){0,3}(?:app|application|website)\b/i.test(passage) ? { output: correctedTarget } : {};
  }
  if (/\b(?:as|in|export(?:ed)? (?:as|to)|save (?:as|to))\s+(?:(?:a|an|the)\s+)?(?:pdf|docx|xlsx|pptx|word|powerpoint|spreadsheet)\b/i.test(passage))
    return { reason: 'Document generation supports Markdown only. PDF, Word, PowerPoint and spreadsheet exports are unavailable.' };
  const titles = [...passage.matchAll(/\b(?:titled|named|document|brief|report|readme)\s+["“]([^"”\n]{1,120})["”]/gi)].map(match => match[1].trim());
  if (new Set(titles.map(title => title.normalize('NFKC').toLowerCase().replace(/\s+/g, ' '))).size > 1 || /\b(?:build|create|generate|update|revise)\s+(?:(?:a|an|the|my|our|existing|new)\s+){0,3}(?:app|application|website)\b/i.test(passage))
    return { reason: 'This passage names multiple output targets. Submit a separate explicit instruction for each application or quoted document title.' };
  const title = titles[0] || correctedTarget?.title;
  if (!title) return { reason: 'Name the document with a quoted title, for example: Write a Markdown document titled "Launch brief". Reuse its title to revise it.' };
  const key = title.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ');
  return { output: { kind: 'markdown', id: `doc_${createHash('sha256').update(key).digest('hex').slice(0, 24)}`, title } };
}
