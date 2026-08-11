/* Break a minified stylesheet back onto one rule per line.

   `dist/` is committed, which is what lets a consumer take the drop-in over a
   plain clone — and a minified stylesheet is one line, so every change to it
   is a change to *the* line. Two people touching different components collide
   on a hunk neither of them wrote, and git has nothing to merge with: no line
   boundary means no common ground. A rule to a line gives the diff the same
   grain the source has, so the generated side merges wherever the source did.

   Only the whitespace between rules comes back. Selectors, values and names
   stay exactly as the minifier wrote them, and a rule whose block holds
   nothing but declarations stays on its single line — the point is a seam
   every rule, not a pretty-printed sheet. */

/** A statement in a stylesheet: a declaration or at-rule (`body` null), or a
    rule with a block. Style rules, at-rules and keyframe steps are all this
    shape, which is why nothing here carries a list of at-rule names. */
interface Node {
  prelude: string;
  body: Node[] | null;
}

/** Index of the `}` closing the `{` at `open`, aware of strings and comments
    so a brace inside either does not count. */
function close(src: string, open: number): number {
  let depth = 0;
  let quote = '';
  for (let i = open; i < src.length; i++) {
    const c = src[i]!;
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = '';
      continue;
    }
    if (c === '"' || c === "'") quote = c;
    else if (c === '/' && src[i + 1] === '*') i = src.indexOf('*/', i + 2) + 1 || src.length;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return i;
  }
  return src.length;
}

/** Split a sheet — or one block's contents — into its statements. */
function statements(src: string): Node[] {
  const out: Node[] = [];
  let buf = '';
  let quote = '';
  for (let i = 0; i < src.length; i++) {
    const c = src[i]!;
    if (quote) {
      buf += c;
      if (c === '\\') buf += src[++i] ?? '';
      else if (c === quote) quote = '';
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      buf += c;
    } else if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      buf += src.slice(i, end < 0 ? src.length : end + 2);
      i = end < 0 ? src.length : end + 1;
    } else if (c === ';') {
      const prelude = buf.trim();
      if (prelude) out.push({ prelude, body: null });
      buf = '';
    } else if (c === '{') {
      const end = close(src, i);
      out.push({ prelude: buf.trim(), body: statements(src.slice(i + 1, end)) });
      buf = '';
      i = end;
    } else {
      buf += c;
    }
  }
  const rest = buf.trim();
  if (rest) out.push({ prelude: rest, body: null });
  return out;
}

/** A block whose statements are all declarations prints as the minifier wrote
    it; one holding rules of its own — a media query, a layer, keyframes —
    opens, indents what it wraps, and closes. */
function render(nodes: Node[], indent: string): string[] {
  const lines: string[] = [];
  for (const n of nodes) {
    if (!n.body) lines.push(`${indent}${n.prelude};`);
    else if (n.body.every((c) => !c.body)) {
      lines.push(`${indent}${n.prelude}{${n.body.map((c) => c.prelude).join(';')}}`);
    } else {
      lines.push(`${indent}${n.prelude}{`, ...render(n.body, `${indent}  `), `${indent}}`);
    }
  }
  return lines;
}

export function rulePerLine(css: string): string {
  const lines = render(statements(css), '');
  return lines.length ? `${lines.join('\n')}\n` : '';
}
