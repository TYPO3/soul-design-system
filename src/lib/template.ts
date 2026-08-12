/* Composing templates without losing the line breaks.

   Lit concatenates an array binding with nothing between the items, so
   `${items.map(...)}` is one unbroken line — invisible in a browser, and a
   card that cannot be diffed. `lines` interleaves the separator Lit will not:
   a plain string in a binding renders as a text node, so `'\n  '` is exactly
   the newline and indent it looks like. */

import type { TemplateResult } from 'lit';

/** Join templates with a newline and `indent` spaces between them. */
export function lines(parts: readonly TemplateResult[], indent = 0): unknown[] {
  const gap = `\n${' '.repeat(indent)}`;
  const out: unknown[] = [];
  parts.forEach((part, i) => {
    if (i) out.push(gap);
    out.push(part);
  });
  return out;
}
