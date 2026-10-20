import * as Y from 'yjs';
import type { AgentChange } from './generator.js';

export type SourceSpan = { client: number; clock: number; text: string };
export type SubmittedSource = {
  id: string;
  submissionId: string;
  participantId: string;
  editSeqs: number[];
  text: string;
};
export type SubmittedSources = { id: string; participantId: string; sources: SubmittedSource[] };
type CapturedChange = AgentChange & { participantId?: string; sourceSpans?: SourceSpan[] };

/** Only new string identities in this authenticated update confer authorship. */
export function captureSourceSpans(update: Uint8Array, previousVector: Uint8Array): SourceSpan[] {
  const previous = Y.decodeStateVector(previousVector);
  return Y.decodeUpdate(update).structs.flatMap(item => {
    if (!(item instanceof Y.Item) || !(item.content instanceof Y.ContentString)) return [];
    const start = Math.max(item.id.clock, previous.get(item.id.client) || 0);
    const offset = start - item.id.clock;
    return offset < item.length
      ? [{ client: item.id.client, clock: start, text: item.content.str.slice(offset) }]
      : [];
  });
}

/** Freeze caller insertions in submitted order; foreign characters split passages. */
export function freezeSubmittedSources(
  id: string,
  participantId: string,
  changes: CapturedChange[],
  doc?: Y.Doc,
): SubmittedSources {
  const own = changes.filter(change => change.participantId === undefined || change.participantId === participantId);
  const sources: SubmittedSource[] = [];
  const add = (text: string, editSeqs: number[]) => {
    if (text.trim()) sources.push({
      id: `${id}:${participantId}:${sources.length + 1}`,
      submissionId: id, participantId, editSeqs: [...new Set(editSeqs)], text,
    });
  };
  if (doc && own.every(change => change.sourceSpans !== undefined)) {
    const characters = new Map<string, { text: string; seq: number }>();
    for (const change of own) {
      for (const span of change.sourceSpans || []) {
        for (let i = 0; i < span.text.length; i++) {
          characters.set(`${span.client}:${span.clock + i}`, { text: span.text[i], seq: change.seq });
        }
      }
    }
    for (const node of doc.getXmlFragment('default').createTreeWalker(node => node instanceof Y.XmlText)) {
      const text = node as Y.XmlText;
      let passage = '', seqs: number[] = [];
      const flush = () => { add(passage, seqs); passage = ''; seqs = []; };
      for (let i = 0; i < text.length; i++) {
        const identity = Y.createRelativePositionFromTypeIndex(text, i).item;
        const captured = identity && characters.get(`${identity.client}:${identity.clock}`);
        if (captured) { passage += captured.text; seqs.push(captured.seq); }
        else flush();
      }
      flush();
    }
  } else {
    // Legacy captures lack identities. Never reconstruct deleted before-text.
    for (const change of own) if (change.after) add(change.after, [change.seq]);
    if (own.length > 1) {
      add(own.map(change => change.after).join(''), own.map(change => change.seq));
      add(own.map(change => change.after).join(' '), own.map(change => change.seq));
    }
  }
  return { id, participantId, sources };
}
