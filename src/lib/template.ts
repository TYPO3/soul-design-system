/* Composing templates without losing the line breaks.

   Lit renders an array binding by concatenating its items with nothing
   between them, so `${items.map(...)}` produces one unbroken line. That is
   invisible in a browser and wrong in a file: the specimen cards under
   `components/` are read and reviewed as text, and a table whose forty rows
   arrive as a single line cannot be diffed.

   `lines` interleaves the separator that Lit will not. Plain strings in a
   binding render as text nodes, so a `'\n  '` between two items is exactly
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
