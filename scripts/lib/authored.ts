/* A Lit template as the markup its author wrote, elements untouched.

   A story renders an element the way a surface writes it: `<sds-button
   variant="primary">Run</sds-button>`. The static renderer flattens that
   into the classes, and SSR draws the element and leaves its children out.
   A live preview wants neither. It wants the authored tag, so the bundle
   upgrades it, and the first frame drawn beside it. This writes the tag out
   of the template's own strings and values, one binding at a time.

   A property binding has no HTML. It goes into a table under a marker on
   the element, and a script in the preview sets it after the upgrade. */

import { nothing, type TemplateResult } from 'lit';
import { UnsafeHTMLDirective } from 'lit/directives/unsafe-html.js';
import { TAGS } from '../../packages/frontend/src/index.ts';
import { prerender } from './prerender.ts';

export interface Authored {
  html: string;
  /** Per marker, the properties a script sets: `{ items: [...] }`. */
  props: Record<string, unknown>[];
}

/* The attribute a binding stands in, read off the end of the output so far.
   Its prefix, name, opening quote and what of its value came before. */
const ATTRIBUTE = /([.?@]?)([\w-]+)=(["']?)([^"'<>=]*)$/;

const escapeText = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = (s: string): string => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const isTemplate = (v: unknown): v is TemplateResult =>
  typeof v === 'object' && v !== null && '_$litType$' in v && 'strings' in v;

interface Directive {
  _$litDirective$: unknown;
  values: unknown[];
}
const isDirective = (v: unknown): v is Directive =>
  typeof v === 'object' && v !== null && '_$litDirective$' in v;

/* A directive by the class that runs it, never by its name: the bundle
   minifies those. `unsafeHTML` carries markup as given, and `ifDefined` is
   no directive at all. Anything else has no authored form and is a bug to
   report, never to guess at. */
function unwrap(v: unknown): unknown {
  if (!isDirective(v)) return v;
  if (v._$litDirective$ === UnsafeHTMLDirective) return { raw: String(v.values[0] ?? '') };
  throw new Error('a story uses a directive that has no authored form');
}

/** A property's value as JSON can carry it. A template becomes authored
    markup drawn once, under `$html`, and the script puts it back as a
    template. An element inside it marks its own properties in the same table. */
function jsonable(v: unknown, props: Record<string, unknown>[]): unknown {
  const u = unwrap(v);
  if (isTemplate(u)) return { $html: prerender(walk(u, props), TAGS, props) };
  if (typeof u === 'object' && u !== null && 'raw' in u) return { $html: String((u as { raw: string }).raw) };
  if (Array.isArray(u)) return u.map((x) => jsonable(x, props));
  if (u === nothing || u === undefined) return null;
  if (typeof u === 'object' && u !== null) {
    return Object.fromEntries(Object.entries(u as Record<string, unknown>).map(([k, x]) => [k, jsonable(x, props)]));
  }
  return u;
}

function child(v: unknown, props: Record<string, unknown>[]): string {
  const u = unwrap(v);
  if (u === nothing || u === undefined || u === null || u === false) return '';
  if (isTemplate(u)) return walk(u, props);
  if (Array.isArray(u)) return u.map((x) => child(x, props)).join('');
  if (typeof u === 'object' && 'raw' in u) return String((u as { raw: string }).raw);
  return escapeText(String(u));
}

function walk(t: TemplateResult, props: Record<string, unknown>[]): string {
  let out = '';
  /* Set when a binding took its attribute with it, so the quote that closes
     the attribute in the next string goes too. */
  let dropQuote = '';
  for (let i = 0; i < t.strings.length; i++) {
    let s = t.strings[i] ?? '';
    if (dropQuote && s.startsWith(dropQuote)) s = s.slice(1);
    dropQuote = '';
    out += s;
    if (i >= t.values.length) continue;
    const v = t.values[i];
    const inTag = out.lastIndexOf('<') > out.lastIndexOf('>');
    const at = inTag ? ATTRIBUTE.exec(out) : null;
    if (!at) {
      out += child(v, props);
      continue;
    }
    const [whole, prefix, name, quote] = at;
    const u = unwrap(v);
    if (prefix === '?') {
      out = out.slice(0, out.length - whole.length) + (u ? name : '');
      dropQuote = quote ?? '';
      continue;
    }
    if (prefix === '.' || prefix === '@') {
      out = out.slice(0, out.length - whole.length);
      dropQuote = quote ?? '';
      if (prefix === '@') continue;
      /* One marker per element. A second property on the same tag joins the
         first's record rather than opening another. */
      const tag = out.slice(out.lastIndexOf('<'));
      const mark = /data-sds-prop="(\d+)"/.exec(tag);
      const n = mark ? Number(mark[1]) : props.push({}) - 1;
      if (!mark) out += `data-sds-prop="${n}"`;
      props[n]![name!] = jsonable(u, props);
      out = out.replace(/\s+$/, '');
      continue;
    }
    if (u === nothing) {
      /* The whole attribute goes, as Lit removes it. Only for a value that is
         the attribute's entire content. */
      if (!at[4]) {
        out = out.slice(0, out.length - whole.length).replace(/\s+$/, '');
        dropQuote = quote ?? '';
      }
      continue;
    }
    if (u === undefined || u === null) continue;
    out += escapeAttr(isTemplate(u) ? walk(u, props) : String(u));
  }
  return out;
}

/** The template as authored markup, its properties added to `props`: the
    markers count on from what the table already holds. */
export function authored(t: TemplateResult, props: Record<string, unknown>[] = []): Authored {
  const html = walk(t, props);
  return { html, props };
}
