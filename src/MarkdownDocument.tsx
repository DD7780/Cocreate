import type { ReactNode } from 'react';

export function safeDocumentLink(value: string) {
  try {
    const url = new URL(value);
    return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}
function inline(value: string): ReactNode[] {
  return value.split(/(`[^`\n]+`|\*\*[^*\n]+\*\*|\[[^\]\n]+\]\([^\s)]+\))/g).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (match) {
      const href = safeDocumentLink(match[2]);
      return href ? <a key={index} href={href} target="_blank" rel="noopener noreferrer">{match[1]}</a> : <span key={index}>{match[1]} (blocked link)</span>;
    }
    return part;
  });
}
/** A bounded Markdown subset rendered as React text; HTML/images never become DOM or requests. */
export function MarkdownDocument({ source }: { source: string }) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n'), blocks: ReactNode[] = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (/^\s*```/.test(line)) {
      const code: string[] = []; i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) code.push(lines[i++]);
      if (i < lines.length) i++;
      blocks.push(<pre key={blocks.length}><code>{code.join('\n')}</code></pre>); continue;
    }
    const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (heading) {
      const Heading = `h${heading[1].length}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      blocks.push(<Heading key={blocks.length}>{inline(heading[2])}</Heading>); i++; continue;
    }
    if (/^\s*(?:[-*_]\s*){3,}$/.test(line)) { blocks.push(<hr key={blocks.length}/>); i++; continue; }
    const ordered = /^\d+[.)]\s+/.test(line), bullet = /^[-*+]\s+/.test(line);
    if (ordered || bullet) {
      const items: ReactNode[] = [], pattern = ordered ? /^\d+[.)]\s+/ : /^[-*+]\s+/;
      while (i < lines.length && pattern.test(lines[i])) items.push(<li key={items.length}>{inline(lines[i++].replace(pattern, ''))}</li>);
      blocks.push(ordered ? <ol key={blocks.length}>{items}</ol> : <ul key={blocks.length}>{items}</ul>); continue;
    }
    if (/^>\s?/.test(line)) {
      blocks.push(<blockquote key={blocks.length}>{inline(line.replace(/^>\s?/, ''))}</blockquote>); i++; continue;
    }
    const paragraph = [line]; i++;
    while (i < lines.length && lines[i].trim() && !/^(?:#{1,6}\s|```|[-*+]\s|\d+[.)]\s|>)/.test(lines[i])) paragraph.push(lines[i++]);
    blocks.push(<p key={blocks.length}>{inline(paragraph.join('\n'))}</p>);
  }
  return <article className="markdown-document">{blocks}</article>;
}
