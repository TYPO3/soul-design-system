/* What an element promises, read out of the element.

   The design agent gets a component API or it gets nothing, and it writes
   classes when it gets nothing. So every registered tag ships a contract
   compiled from its own source. The properties Lit declares, the attribute
   each one answers to, and what the props interface says about it. Read
   rather than written, because a second copy of a component's surface is a
   copy that is no longer true at the next property. */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { FRONTEND } from './cards.ts';
import { definedClasses } from './css.ts';

export interface ElementProp {
  /** The property as the class declares it. */
  name: string;
  /** What a page writes — Lit lowercases a property name unless told otherwise. */
  attribute: string;
  /** From the props interface where there is one, from the Lit type otherwise. */
  type: string;
  /** What Lit parses the attribute as, which is what a page can write there. */
  lit: string;
  /** The prose the source carries, unwrapped to one paragraph. */
  doc: string;
}

export interface ElementDoc {
  tag: string;
  /** The class, which is also the export the bundle exposes. */
  className: string;
  /** The source it came from, from the repository root. */
  source: string;
  /** The first paragraph of the file's own opening comment. */
  purpose: string;
  /* The paragraphs after it, which is where a component states what a table of
     attributes cannot. That a press on the active segment gives the machine's
     setting back, that a line has to run in the head before the first paint.
     Dropped, they were the half a reader had to rebuild the element to find. */
  notes: string[];
  props: ElementProp[];
  /** If the element reads what a caller wrote between its tags. */
  takesContent: boolean;
  /** What it says on its way out, so a page listens rather than polls. */
  events: string[];
  /** The classes it draws — its own names for its own nodes. A page that
      writes one has rebuilt the element instead of addressed it. */
  classes: string[];
}

const COMPONENTS = join(FRONTEND, 'src', 'components');

/* The name an element dispatches under. The constructor spans two lines as
   often as one, so this matches from `new …Event(` to the string and nothing
   in between. A line-anchored pattern found two thirds of them. */
const EVENT = /new (?:Custom)?Event(?:<[^>]*>)?\(\s*'([\w-]+)'/g;

/* What a design links to get the elements: the drop-in's own name. It is the
   drop-in's own code, packed for a page that links it rather than imports
   it. Not `_ds_bundle.js`. That name belongs to the design app, which rebuilds
   the file from sources it can compile and leaves an empty namespace there. */
export const ELEMENTS_JS = 'soul.js';

/* What an element draws, out of everything it renders. The map of variants at
   the top of the file as much as the class attribute below it. Comments go
   first, because a component that names another's class in prose draws
   nothing, and so do the tags it composes and its own registration. Filtered
   against the stylesheets, so a stray identifier does not read as a class. */
function drawn(chain: string, defined: ReadonlySet<string>): string[] {
  const rendered = chain
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/<\/?sds-[a-z-]+/g, ' ')
    .replace(/define\('[^']*'/g, ' ');
  const found = new Set<string>();
  for (const m of rendered.matchAll(/\bsds-[a-z0-9_-]+/g)) if (defined.has(m[0])) found.add(m[0]);
  return [...found].sort();
}

/** From the opening `{` at `open`, the text it encloses. */
function braced(src: string, open: number): string {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) return src.slice(open + 1, i);
  }
  return '';
}

/* One JSDoc block and never two. A lazy `[\s\S]*?` runs happily from one
   comment's opening to a later comment's close. What it hands back is then
   the prose of whichever block it started in. */
const JSDOC = String.raw`\/\*\*(?:[^*]|\*(?!\/))*\*\/`;

/** A JSDoc or block comment with its fencing taken off, paragraphs intact. */
function unwrap(comment: string): string[] {
  return comment
    .replace(/^\/\*\*?/, '')
    .replace(/\*\/$/, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\*?\s?/, '').trimEnd())
    .join('\n')
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/** A JSDoc or block comment as one paragraph of prose. */
function prose(comment: string): string {
  return unwrap(comment)[0] ?? '';
}

type Described = Map<string, { type: string; doc: string }>;

/** Every member of `<Name>Props`, with the prose written above it. */
function fromInterface(src: string): Described {
  const out: Described = new Map();
  const at = /export interface \w+Props\s*\{/.exec(src);
  if (!at) return out;
  const body = braced(src, at.index + at[0].length - 1);
  /* One member at a time. Whatever comment stands above it, then the name, then
     the type up to the semicolon that ends it — a union can run over lines. */
  const member = new RegExp(`(${JSDOC})?\\s*(?:readonly\\s+)?(\\w+)\\??:\\s*([\\s\\S]*?);`, 'g');
  for (const m of body.matchAll(member)) {
    const [, comment, name, type] = m;
    if (!name || !type) continue;
    out.set(name, { type: type.replace(/\s+/g, ' ').trim(), doc: comment ? prose(comment) : '' });
  }
  return out;
}

/** Every `declare` field of the class, with the prose written above it. */
function fromFields(src: string): Described {
  const out: Described = new Map();
  for (const m of src.matchAll(new RegExp(`(${JSDOC})?\\s*declare\\s+(\\w+)\\??:\\s*([^;]+);`, 'g'))) {
    const [, comment, name, type] = m;
    if (!name || !type) continue;
    out.set(name, { type: type.replace(/\s+/g, ' ').trim(), doc: comment ? prose(comment) : '' });
  }
  return out;
}

/* What the source says about a property, from both places a component can say
   it. A props interface is the fuller statement and wins where there is one.
   The fields are what a component writes when it has none. The interface
   alone shipped an empty column to the one reader with nothing else. */
function describe(src: string): Described {
  const fields = fromFields(src);
  const out: Described = new Map(fields);
  for (const [name, member] of fromInterface(src)) {
    out.set(name, { type: member.type, doc: member.doc || fields.get(name)?.doc || '' });
  }
  return out;
}

/* A property Lit parses from an attribute takes a string there, whatever else
   it accepts from script. Markup goes between the tags, and an alternative
   that names a template tells a page it can write one into a quoted value. */
function attributable(documented: string, lit: string): string {
  if (lit !== 'string' || !documented.includes('TemplateResult')) return documented;
  const kept = documented.split('|').map((s) => s.trim()).filter((s) => !s.includes('TemplateResult'));
  return kept.length ? kept.join(' | ') : 'string';
}

/* A name says less than the values behind it, and the agent has only what
   stands here. But a generated union of every icon identifier is longer than
   the document it lands in, so a long one keeps its name. */
function resolveAliases(src: string, type: string): string {
  const alias = /^\w+$/.test(type) ? new RegExp(`export type ${type} =([^;]+);`).exec(src)?.[1] : undefined;
  const union = alias?.replace(/\s+/g, ' ').trim() ?? '';
  return union && union.length <= 90 ? union : type;
}

const LIT_TYPE: Readonly<Record<string, string>> = {
  String: 'string', Boolean: 'boolean', Number: 'number', Object: 'object', Array: 'array',
};

interface Registered {
  name: string;
  attribute: string;
  type: string;
}

/** The `static properties` block: what Lit registers, and under which attribute.
    Keyed so a subclass restating an inherited property stays in one row. */
function fromProperties(sources: string[]): Registered[] {
  const out = new Map<string, Registered>();
  for (const src of sources) {
    const at = /static (?:override )?properties\s*=\s*\{/.exec(src);
    if (!at) continue;
    const body = braced(src, at.index + at[0].length - 1);
    for (const m of body.matchAll(/(\w+):\s*\{([^}]*)\}/g)) {
      const [, name, opts = ''] = m;
      if (!name) continue;
      /* An attribute Lit does not name after the property stands in the
         declaration, and `attribute: false` means the property is not one. So
         does `state: true`, which is a component's own working memory — how far
         a reader has stepped into a drawer, which panel stands open. Listed as
         attributes, they read as things a page can set, and a page that sets
         one writes into the element's hands. */
      const named = /attribute:\s*'([^']+)'/.exec(opts)?.[1];
      if (/attribute:\s*false/.test(opts) || /state:\s*true/.test(opts)) continue;
      const lit = /type:\s*(\w+)/.exec(opts)?.[1] ?? '';
      out.set(name, { name, attribute: named ?? name.toLowerCase(), type: LIT_TYPE[lit] ?? 'string' });
    }
  }
  return [...out.values()];
}

/* A subclass spreads its base's block rather than restates it, and half of
   what a nav promises stands one file up. Followed to the import it came
   from. A property the base registers is one a page writes, and the element
   that never mentions it is the only thing the reader has. */
function inherited(src: string, dir: string): string[] {
  const out: string[] = [];
  for (const m of src.matchAll(/\.\.\.(\w+)\.properties/g)) {
    const base = m[1];
    if (!base) continue;
    const path = new RegExp(`import\\s*\\{[^}]*\\b${base}\\b[^}]*\\}\\s*from\\s*'(\\.[^']+)'`).exec(src)?.[1];
    if (!path) continue;
    const source = readFileSync(join(dir, path), 'utf8');
    out.push(...inherited(source, dir), source);
  }
  return out;
}

/** Every tag the components directory defines, in the order Lit registers them. */
export function elements(): ElementDoc[] {
  const out: ElementDoc[] = [];
  const declared = definedClasses();
  for (const file of readdirSync(COMPONENTS).sort()) {
    if (!file.endsWith('.ts') || file.endsWith('.generated.ts')) continue;
    const src = readFileSync(join(COMPONENTS, file), 'utf8');
    const defined = /define\('([\w-]+)',\s*(\w+)\)/.exec(src);
    if (!defined?.[1] || !defined[2]) continue;
    /* The base's sources first, so the file that declares an inherited property
       describes it, and the subclass only where it restates one. */
    const opening = /^\/\*[\s\S]*?\*\//.exec(src)?.[0] ?? '';
    const chain = [...inherited(src, COMPONENTS), src];
    const documented: Described = new Map();
    for (const s of chain) for (const [name, entry] of describe(s)) documented.set(name, entry);
    const written = chain.join('\n');
    out.push({
      tag: defined[1],
      className: defined[2],
      source: `packages/frontend/src/components/${file}`,
      purpose: prose(opening).replace(/^[\w-]+ — /, ''),
      notes: unwrap(opening).slice(1),
      props: fromProperties(chain).map((p) => ({
        ...p,
        lit: p.type,
        type: resolveAliases(written, attributable(documented.get(p.name)?.type ?? p.type, p.type)),
        doc: documented.get(p.name)?.doc ?? '',
      })),
      /* Both ways a component reaches what stands between its tags — the
         nodes in a browser, the `content` property where it rendered first. */
      takesContent: /this\.taken|this\.content/.test(src),
      /* Read from the chain, not the file: half the navigations say
         `sds-change` through the base they extend and name it nowhere. */
      events: [...new Set([...written.matchAll(EVENT)].map((m) => m[1]!))].sort(),
      classes: drawn(written, declared),
    });
  }
  return out;
}
