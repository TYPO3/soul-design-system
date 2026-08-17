/* What an element promises, read out of the element.

   The design agent is handed a component API or it is handed nothing, and it
   writes classes when it is handed nothing. So every registered tag ships a
   contract compiled from its own source: the properties Lit declares, the
   attribute each one answers to, and what the props interface says about it.
   Read rather than written, because a second copy of a component's surface is
   a copy that stops being true at the next property. */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { FRONTEND } from './cards.ts';

export interface ElementProp {
  /** The property as the class declares it. */
  name: string;
  /** What a page writes — Lit lowercases a property name unless told otherwise. */
  attribute: string;
  /** From the props interface where there is one, from the Lit type otherwise. */
  type: string;
  /** What Lit parses the attribute as, which is what a page may write there. */
  lit: string;
  /** The prose the source carries, unwrapped to one paragraph. */
  doc: string;
}

export interface ElementDoc {
  tag: string;
  /** The class, which is also the export the bundle exposes. */
  className: string;
  /** The source it was read from, from the repository root. */
  source: string;
  /** The first paragraph of the file's own opening comment. */
  purpose: string;
  props: ElementProp[];
  /** Whether the element reads what a caller wrote between its tags. */
  takesContent: boolean;
}

const COMPONENTS = join(FRONTEND, 'src', 'components');

/** From the opening `{` at `open`, the text it encloses. */
function braced(src: string, open: number): string {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) return src.slice(open + 1, i);
  }
  return '';
}

/** A JSDoc or block comment as one paragraph of prose. */
function prose(comment: string): string {
  return comment
    .replace(/^\/\*\*?/, '')
    .replace(/\*\/$/, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\*?\s?/, '').trimEnd())
    .join('\n')
    .split(/\n\s*\n/)[0]
    ?.replace(/\s+/g, ' ')
    .trim() ?? '';
}

/** Every member of `<Name>Props`, with the prose written above it. */
function fromInterface(src: string): Map<string, { type: string; doc: string }> {
  const out = new Map<string, { type: string; doc: string }>();
  const at = /export interface \w+Props\s*\{/.exec(src);
  if (!at) return out;
  const body = braced(src, at.index + at[0].length - 1);
  /* One member at a time: whatever comment stands above it, then the name, then
     the type up to the semicolon that ends it — a union may run over lines. */
  const member = /(\/\*\*[\s\S]*?\*\/)?\s*(?:readonly\s+)?(\w+)\??:\s*([\s\S]*?);/g;
  for (const m of body.matchAll(member)) {
    const [, comment, name, type] = m;
    if (!name || !type) continue;
    out.set(name, { type: type.replace(/\s+/g, ' ').trim(), doc: comment ? prose(comment) : '' });
  }
  return out;
}

/* A property Lit parses from an attribute takes a string there, whatever else
   it accepts from script: markup goes between the tags, and an alternative
   naming a template is a page told it may write one into a quoted value. */
function attributable(documented: string, lit: string): string {
  if (lit !== 'string' || !documented.includes('TemplateResult')) return documented;
  const kept = documented.split('|').map((s) => s.trim()).filter((s) => !s.includes('TemplateResult'));
  return kept.length ? kept.join(' | ') : 'string';
}

/* A name says less than the values behind it, and the agent has only what is
   written here — but a generated union of every icon identifier is longer than
   the document it lands in, so a long one keeps its name. */
function resolveAliases(src: string, type: string): string {
  const alias = /^\w+$/.test(type) ? new RegExp(`export type ${type} =([^;]+);`).exec(src)?.[1] : undefined;
  const union = alias?.replace(/\s+/g, ' ').trim() ?? '';
  return union && union.length <= 90 ? union : type;
}

const LIT_TYPE: Readonly<Record<string, string>> = {
  String: 'string', Boolean: 'boolean', Number: 'number', Object: 'object', Array: 'array',
};

/** The `static properties` block: what Lit registers, and under which attribute. */
function fromProperties(src: string): { name: string; attribute: string; type: string }[] {
  const at = /static (?:override )?properties\s*=\s*\{/.exec(src);
  if (!at) return [];
  const body = braced(src, at.index + at[0].length - 1);
  const out: { name: string; attribute: string; type: string }[] = [];
  for (const m of body.matchAll(/(\w+):\s*\{([^}]*)\}/g)) {
    const [, name, opts = ''] = m;
    if (!name) continue;
    /* An attribute Lit would not name after the property is spelled out in the
       declaration, and `attribute: false` means the property is not one. */
    const named = /attribute:\s*'([^']+)'/.exec(opts)?.[1];
    if (/attribute:\s*false/.test(opts)) continue;
    const lit = /type:\s*(\w+)/.exec(opts)?.[1] ?? '';
    out.push({ name, attribute: named ?? name.toLowerCase(), type: LIT_TYPE[lit] ?? 'string' });
  }
  return out;
}

/** Every tag the components directory defines, in the order Lit registers them. */
export function elements(): ElementDoc[] {
  const out: ElementDoc[] = [];
  for (const file of readdirSync(COMPONENTS).sort()) {
    if (!file.endsWith('.ts') || file.endsWith('.generated.ts')) continue;
    const src = readFileSync(join(COMPONENTS, file), 'utf8');
    const defined = /define\('([\w-]+)',\s*(\w+)\)/.exec(src);
    if (!defined?.[1] || !defined[2]) continue;
    const documented = fromInterface(src);
    out.push({
      tag: defined[1],
      className: defined[2],
      source: `packages/frontend/src/components/${file}`,
      purpose: prose(/^\/\*[\s\S]*?\*\//.exec(src)?.[0] ?? '').replace(/^[\w-]+ — /, ''),
      props: fromProperties(src).map((p) => ({
        ...p,
        lit: p.type,
        type: resolveAliases(src, attributable(documented.get(p.name)?.type ?? p.type, p.type)),
        doc: documented.get(p.name)?.doc ?? '',
      })),
      /* Both ways a component reaches what was written between its tags — the
         nodes in a browser, the `content` property where it rendered first. */
      takesContent: /this\.taken|this\.content/.test(src),
    });
  }
  return out;
}
