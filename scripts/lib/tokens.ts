/* The tokens as `tokens.json`, read out of the token sheets.

   The Design System artifact reads one shape: a list of `{name, value, usage}`
   per family, a colour with one value per theme. The sheets write every
   colour once as `light-dark()`, so the two values come out of that call.
   `usage` is the comment beside the declaration: the first comment of a run
   speaks for the run, a later one for the declaration under it. A blank
   line ends a run. */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { FRONTEND } from './cards.ts';

const TOKENS = join(FRONTEND, 'src', 'tokens');
const BASE = join(FRONTEND, 'src', 'styles', 'base.css');

export interface Entry {
  name: string;
  value: string | Record<string, string>;
  usage?: string;
}

interface Style {
  name: string;
  fontSize: string;
  lineHeight?: string;
  fontWeight?: number;
  letterSpacing?: string;
  sample?: string;
  usage?: string;
}

/* The two themes, first one the fallback. `light-dark(a, b)` reads as
   `{light: a, dark: b}`, in this order. */
const THEMES = [{ id: 'light', name: 'Light' }, { id: 'dark', name: 'Dark' }];

/* Which family a token goes to. The page keeps the four it draws sections for
   under their own keys and shows every other list under its key's name.
   `type` is a shape of its own and takes the families below. A key called
   `motion` the page refuses, so the durations go under `timing`. */
const FAMILY: readonly (readonly [RegExp, string])[] = [
  [/^--shadow-/, 'shadow'],
  [/^--(orange|surface|border-(subtle|strong|accent-quiet|error-quiet)|text|accent|status|syntax)/, 'color'],
  [/^--space-/, 'spacing'],
  [/^--radius-/, 'radius'],
  [/^--(border|focus)-/, 'border'],
  [/^--(gutter|width|height|measure-modal|modal)-?/, 'layout'],
  [/^--(font-size|leading|tracking|weight|measure|font-modifier)-/, 'typography'],
  [/^--(duration|ease)-/, 'timing'],
];

interface Declaration {
  name: string;
  value: string;
  usage: string;
}

/** One line of prose out of a comment block. */
const prose = (comment: string): string =>
  comment.replace(/^\/\*|\*\/$/g, '').split('\n').map((l) => l.trim()).join(' ').replace(/\s+/g, ' ').trim();

/** Every declaration of a sheet's `:root`, with the comment that speaks for it. */
function declarations(css: string): Declaration[] {
  const root = /:root\s*\{([\s\S]*?)\n  \}/.exec(css)?.[1] ?? '';
  const out: Declaration[] = [];
  let run = '';
  let own = '';
  let inRun = false;
  const lines = root.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim();
    if (!line) {
      run = '';
      own = '';
      inRun = false;
      continue;
    }
    if (line.startsWith('/*')) {
      let block = line;
      while (!block.endsWith('*/') && i + 1 < lines.length) block += `\n${lines[++i]!.trim()}`;
      if (inRun) own = prose(block);
      else run = prose(block);
      continue;
    }
    const m = /^(--[\w-]+):\s*(.*?);?$/.exec(line);
    if (!m) continue;
    let value = m[2]!;
    /* A value over several lines, as the shadows are. */
    let last = line;
    while (!last.endsWith(';') && i + 1 < lines.length) {
      last = lines[++i]!.trim();
      value += ` ${last.replace(/;$/, '')}`;
    }
    out.push({ name: m[1]!, value: value.trim(), usage: own || run });
    own = '';
    inRun = true;
  }
  return out;
}

/** A value with every `var()` replaced by the literal it names. */
function resolve(value: string, all: Map<string, string>, depth = 0): string {
  if (depth > 16) return value;
  return value.replace(/var\((--[\w-]+)\)/g, (whole, name: string) => {
    const v = all.get(name);
    return v ? resolve(v, all, depth + 1) : whole;
  });
}

/** `light-dark(a, b)` split into one string per theme. Nested calls stay whole. */
function perTheme(value: string): Record<string, string> | null {
  if (!value.includes('light-dark(')) return null;
  const pick = (which: 0 | 1): string =>
    value.replace(/light-dark\(((?:[^()]|\([^()]*\))*)\)/g, (_, inner: string) => {
      const parts: string[] = [];
      let depth = 0;
      let buf = '';
      for (const c of inner) {
        if (c === '(') depth++;
        if (c === ')') depth--;
        if (c === ',' && depth === 0) {
          parts.push(buf.trim());
          buf = '';
        } else buf += c;
      }
      parts.push(buf.trim());
      return parts[which] ?? '';
    });
  return { light: pick(0), dark: pick(1) };
}

/** The type registers as styles, read from the rules that bind them. */
function styles(all: Map<string, string>): Style[] {
  const css = readFileSync(BASE, 'utf8');
  const REGISTERS: readonly (readonly [string, string, string])[] = [
    ['display', '.sds-display', 'The one line above the scale, on a landing page.'],
    ['h1', '.sds-h1', 'The page title.'],
    ['h2', '.sds-h2', 'A section title.'],
    ['h3', '.sds-h3', 'A block title.'],
    ['lead', '.sds-lead', 'The paragraph under a title, at its own measure.'],
    ['body', 'p', 'Running text.'],
  ];
  const out: Style[] = [];
  for (const [name, selector, usage] of REGISTERS) {
    const props: Record<string, string> = {};
    /* Every rule whose selector list carries the register, in source order,
       so a later rule refines an earlier one the way the cascade does. */
    for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selectors = m[1]!.split(',').map((s) => s.trim().split('\n').pop()!.trim());
      if (!selectors.includes(selector)) continue;
      for (const d of m[2]!.matchAll(/([\w-]+):\s*([^;]+);/g)) props[d[1]!] = resolve(d[2]!.trim(), all);
    }
    if (!props['font-size']) continue;
    const style: Style = { name, fontSize: props['font-size'], usage };
    if (props['line-height']) style.lineHeight = props['line-height'];
    if (props['letter-spacing']) style.letterSpacing = props['letter-spacing'];
    if (props['font-weight']) style.fontWeight = Number(props['font-weight']);
    out.push(style);
  }
  return out;
}

/** Every font file the sheet declares, as the page lists a face. */
function fonts(): { family: string; file: string; weight: string; style: string }[] {
  const css = readFileSync(join(FRONTEND, 'fonts', 'fonts.css'), 'utf8');
  const out: { family: string; file: string; weight: string; style: string }[] = [];
  for (const m of css.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
    const get = (p: string): string => new RegExp(`${p}:\\s*([^;]+);`).exec(m[1]!)?.[1]?.trim() ?? '';
    const file = /url\('([^']+)'\)/.exec(get('src'))?.[1];
    if (!file) continue;
    out.push({ family: get('font-family').replace(/^'|'$/g, ''), file: `fonts/${file}`, weight: get('font-weight'), style: get('font-style') });
  }
  return out;
}

/** `tokens.json`, whole. */
export function tokens(title: string): Record<string, unknown> {
  const all = new Map<string, string>();
  const decls: Declaration[] = [];
  for (const file of readdirSync(TOKENS).sort()) {
    if (!file.endsWith('.css')) continue;
    for (const d of declarations(readFileSync(join(TOKENS, file), 'utf8'))) {
      decls.push(d);
      all.set(d.name, d.value);
    }
  }
  const families = new Map<string, Entry[]>();
  const add = (family: string, entry: Entry): void => {
    if (!families.has(family)) families.set(family, []);
    families.get(family)!.push(entry);
  };
  const colours = new Set(decls.filter((d) => FAMILY.find(([re]) => re.test(d.name))?.[1] === 'color').map((d) => d.name));
  const typeFamilies: Record<string, string> = {};
  for (const d of decls) {
    const family = FAMILY.find(([re]) => re.test(d.name))?.[1];
    const name = d.name.slice(2);
    const usage = d.usage || undefined;
    if (d.name === '--font-sans' || d.name === '--font-mono') {
      typeFamilies[name.slice(5)] = d.value;
      continue;
    }
    if (!family) {
      add('controls', { name, value: resolve(d.value, all), usage });
      continue;
    }
    if (family === 'color') {
      /* An alias of another colour stays one, so a theme that moves the
         target moves this. Any other reference resolves to its literal. */
      const alias = /^var\((--[\w-]+)\)$/.exec(d.value)?.[1];
      const value = alias && colours.has(alias) ? `{${alias.slice(2)}}` : (perTheme(d.value) ?? d.value);
      add('color', { name, value, usage });
      continue;
    }
    const literal = resolve(d.value, all);
    add(family, { name, value: perTheme(literal) ?? literal, usage });
  }
  const list = (family: string): { tokens: Entry[] } => ({ tokens: families.get(family) ?? [] });
  return {
    name: title,
    version: 1,
    color: { themes: THEMES, ...list('color') },
    type: {
      fonts: fonts(),
      families: typeFamilies,
      groups: [{ name: 'Registers', family: 'sans', note: 'Every step in the scale, named for the register it is.', styles: styles(all) }],
    },
    spacing: list('spacing'),
    radius: list('radius'),
    shadow: list('shadow'),
    border: list('border'),
    layout: list('layout'),
    typography: list('typography'),
    controls: list('controls'),
    timing: list('timing'),
  };
}
