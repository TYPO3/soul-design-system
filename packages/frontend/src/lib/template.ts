/* Templates composed with their line breaks intact.

   Lit concatenates an array binding with nothing between the items. So
   `${items.map(...)}` is one unbroken line — invisible in a browser, and a
   card no diff can read. `lines` puts in the separator Lit will not. A plain
   string in a binding renders as a text node, so `'\n  '` is exactly the
   newline and indent it looks like. */

/** Join templates, or the nodes an element lifted, with a newline and
    `indent` spaces between them. */
export function lines(parts: readonly unknown[], indent = 0): unknown[] {
  const gap = `\n${' '.repeat(indent)}`;
  const out: unknown[] = [];
  parts.forEach((part, i) => {
    if (i) out.push(gap);
    out.push(part);
  });
  return out;
}
