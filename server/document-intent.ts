import { createHash } from 'node:crypto';
import type { ArtifactTarget } from '../shared/types.js';

/** Routing is derived from authenticated source, never a provider-selected tool/target. */
export function submittedOutput(passage: string, correctedTarget?: ArtifactTarget): { output?: ArtifactTarget; reason?: string } {
  const blenderRequest = /\b(?:create|make|build|generate|revise|update)\s+(?:(?:a|the|simple|basic|new|our|my)\s+){0,5}blender\s+scene\b/i.test(passage);
  if (blenderRequest || correctedTarget?.kind === 'blender') {
    if (/\b(?:python|script|shell|import|download|open existing|desktop|browser|deploy|network|animation|video|simulation|addon|add-on|pdf|docx|xlsx|pptx)\b/i.test(passage))
      return { reason: 'Connected Blender supports new basic scenes, materials, camera, lighting, .blend saves and PNG renders only. Scripts, imported scenes/assets, desktop streaming and other operations are unavailable.' };
  }
  if (blenderRequest) {
    if (/\b(?:write|draft|create|generate|build|make|update|revise)\s+(?:(?:a|an|the|new|markdown)\s+){0,4}(?:document|brief|report|app|application|website)\b/i.test(passage) || new Set([...passage.matchAll(/\b(?:titled|named)\s+["“]([^"”\n]{1,120})["”]/gi)].map(match => match[1].trim().toLowerCase())).size > 1)
      return { reason: 'This passage names multiple output targets. Submit a separate explicit instruction for each application, document or Blender scene.' };
    const title = passage.match(/\b(?:titled|named)\s+["“]([^"”\n]{1,120})["”]/i)?.[1]?.trim() || (correctedTarget?.kind === 'blender' ? correctedTarget.title : 'Blender scene');
    const key = title.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ');
    return { output: { kind: 'blender', id: `blend_${createHash('sha256').update(key).digest('hex').slice(0,24)}`, title } };
  }
  // App instructions such as "show Markdown documents in the app" still target the app.
  if (!/\b(?:write|generate|draft|create|revise|update|make)\s+(?:(?:a|an|the|my|our|this|new|existing|short|project|markdown)\s+){0,4}(?:markdown\s+)?(?:document|brief|report|readme)\b/i.test(passage)) {
    if (/\b(?:(?:use|open|control|launch|automate) (?:a |the )?(?:browser|desktop|chrome|edge)|browser automation|desktop control|blender|provision|deploy|spreadsheet|xlsx|powerpoint|pptx|pdf|word document|docx)\b/i.test(passage))
      return { reason: 'This workflow supports application builds, Markdown documents and basic scenes on a locally approved connected Blender device. Shared browser viewing/input requires explicit owner-authorized Artifacts controls. Agent browser automation, desktop control, provisioning, deployment and other formats are unavailable.' };
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
