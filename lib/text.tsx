import { Fragment, type ReactNode } from 'react';

export const PLACEHOLDER_RE = /\{\{[A-Z0-9_]+\}\}/;
export const isPlaceholder = (s: string) => PLACEHOLDER_RE.test(s);

/** A visibly-marked unresolved value. */
export function Ph({ children }: { children: string }) {
  return (
    <mark className="ph" title="Placeholder: not supplied yet (see MISSING.md)">
      {children}
    </mark>
  );
}

/**
 * Renders `*emphasis*` as accent italics and `{{PLACEHOLDER}}` tokens as marked dummy text.
 */
export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /(\*[^*]+\*|\{\{[A-Z0-9_]+\}\})/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={k++}>{text.slice(last, m.index)}</Fragment>);
    const tok = m[0];
    if (tok.startsWith('{{')) out.push(<Ph key={k++}>{tok}</Ph>);
    else out.push(<em key={k++} className="em">{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(<Fragment key={k++}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}

/** Strip markup for plain-text contexts (aria-labels, mailto bodies). */
export const plain = (text: string) => text.replace(/\*([^*]+)\*/g, '$1');
