#!/usr/bin/env node
/* The written text against ASD-STE100 and the terse rule.

   The check reads three kinds of text: documents, comments and the strings a
   component or a task prints. It measures what a machine can measure. A
   sentence has a word limit, and a paragraph has a sentence limit. The check
   finds the passive voice, -ing verb forms, the modal verbs the standard does
   not approve and the words this tree replaced. The dictionary of the
   standard holds the rest. `docs/design-system/writing.rst` is the rule. */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';

import { ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

/** A sentence in a paragraph, and the shorter limit for an instruction: an
    item in a list, a cell in a table and a step. */
const WORDS = { paragraph: 25, item: 20 };
const SENTENCES = 6;

/* The words the standard does not approve that turned up in this tree, with
   the approved word to write. Review adds a line when it finds one. */
const WORDS_REPLACED: readonly (readonly [RegExp, string])[] = [
  [/\b(accomplish(?:es|ed)?)\b/gi, 'do'],
  [/\b(allow(?:s|ed)?)\b/gi, 'let, permit'],
  [/\b(as well as)\b/gi, 'and'],
  [/\b(assist(?:s|ed)?)\b/gi, 'help'],
  [/\b(assure(?:s|d)?)\b/gi, 'make sure'],
  [/\b(attempt(?:s|ed)?)\b/gi, 'try'],
  [/\b(carr(?:y|ies|ied) out)\b/gi, 'do'],
  [/\b(commence(?:s|d)?)\b/gi, 'start'],
  [/\b(concerning)\b/gi, 'about'],
  [/\b(demonstrate(?:s|d)?)\b/gi, 'show'],
  [/\b(due to)\b/gi, 'because of'],
  [/\b(e\.g\.)/gi, 'for example'],
  [/\b(employ(?:s|ed)?)\b/gi, 'use'],
  [/\b(ensure(?:s|d)?)\b/gi, 'make sure'],
  [/\b(furthermore|moreover)\b/gi, 'and, also'],
  [/\b(however)\b/gi, 'but'],
  [/\b(i\.e\.)/gi, 'that is'],
  [/\b(in order to)\b/gi, 'to'],
  [/\b(in the event (?:of|that))\b/gi, 'if'],
  [/\b(indicate(?:s|d)?)\b/gi, 'show'],
  [/\b(initiate(?:s|d)?)\b/gi, 'start'],
  [/\b(modif(?:y|ies|ied))\b/gi, 'change'],
  [/\b(nevertheless|nonetheless)\b/gi, 'but'],
  [/\b(notif(?:y|ies|ied))\b/gi, 'tell'],
  [/\b(obtain(?:s|ed)?)\b/gi, 'get'],
  [/\b(perform(?:s|ed)?)\b/gi, 'do'],
  [/\b(prior to)\b/gi, 'before'],
  [/\b(regarding)\b/gi, 'about'],
  [/\b(require(?:s|d)?)\b/gi, 'need, must'],
  [/\b(retain(?:s|ed)?)\b/gi, 'keep'],
  [/\b(subsequently)\b/gi, 'then'],
  [/\b(terminate(?:s|d)?)\b/gi, 'stop'],
  [/\b(upon)\b/gi, 'on'],
  [/\b(utili[sz]e(?:s|d)?)\b/gi, 'use'],
  [/\b(verif(?:y|ies|ied))\b/gi, 'make sure, check'],
  [/\b(via)\b/gi, 'through'],
  [/\b(whether)\b/gi, 'if'],
  [/\b(whilst)\b/gi, 'while'],
  [/\b(with regard to)\b/gi, 'about'],
];

const MODAL = /\b(shall|should|may|might|could|would|ought)\b/gi;

/* The participles that do not end in -ed. A stem of three letters before
   "ed" keeps "red" and "bed" out. */
const IRREGULAR = 'written|drawn|shown|read|held|built|made|kept|given|seen|taken|known|put|set|run|found|left|sent|told|done|gone|met|hidden|lost|thrown|cut|bound|chosen|spelt|split|hit|meant|said|paid|laid|led|brought|bought|caught|taught|thought|sought|fought|sold|won|begun|hung|struck|stuck|worn|torn|driven|frozen|broken|spoken|stolen|forgotten|understood|withdrawn|overridden|rewritten|redrawn|reread|undone|lit|cast|fed|bred|swept|dealt|felt|sat|stood|become|come|rung|sung|sunk|shrunk|spun|spread|let|shut|slid|bitten|beaten|eaten|fallen|forgiven|grown|thrown|risen|shaken|sworn|woken|born|torn';
const PASSIVE = new RegExp(`\\b(?:is|are|was|were|be|been|being|get|gets|got)\\s+(?:(?:not|also|then|still|never|always|only|already|first|now|once|all|both|each|either|neither)\\s+)?([a-z]{3,}ed|${IRREGULAR})\\b`, 'gi');

/* An -ing word after one of these is a verb form. The list below names the
   nouns that end in -ing and are not. */
const ING = /(?:^|\b(?i:by|of|for|when|while|before|after|without|is|are|was|were|keep|keeps|kept|stop|stops|start|starts|avoid|worth|from|than|and|or|on|in|instead of|means|about|through)\s+)([A-Za-z][a-z]{2,}ing)\b/g;
const ING_NOUNS = new Set(['thing', 'string', 'nothing', 'anything', 'everything', 'something', 'during', 'sibling', 'ceiling', 'padding', 'spacing', 'kerning', 'leading', 'heading', 'setting', 'building', 'ring', 'wing', 'king', 'morning', 'evening', 'warning', 'opening', 'ending', 'beginning', 'meaning', 'listing', 'spring', 'bring', 'sing', 'sting', 'swing', 'cling', 'fling', 'rendering', 'landing', 'pricing', 'housing', 'clothing', 'writing', 'drawing', 'lining', 'tracking', 'timing', 'binding', 'encoding', 'wording', 'coupling', 'lettering', 'wrapping', 'marking', 'crossing', 'nesting', 'spelling', 'tooling', 'dumping', 'loading', 'rounding', 'lighting', 'starting', 'finishing', 'including', 'according']);

interface Finding {
  line: number;
  what: string;
}

/** Sentences of a block. Inline code became CODE before this, so a dot in a
    name does not split anything. */
function sentences(text: string): string[] {
  const guarded = text.replace(/\b(e\.g|i\.e|etc|vs|cf|no|fig)\./gi, (m) => m.replace('.', '\u0000'));
  return guarded
    .split(/(?<=[.!?][)"'”’]?)\s+(?=[A-Z0-9(“"'`‘])/)
    .map((s) => s.replace(/\u0000/g, '.').trim())
    .filter(Boolean);
}

const words = (s: string): number => s.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;

/** The rules over one block of prose. `item` is an instruction and takes the
    shorter limit. */
function judge(text: string, line: number, item: boolean, out: Finding[]): void {
  const parts = sentences(text);
  if (!item && parts.length > SENTENCES) out.push({ line, what: `${parts.length} sentences in one paragraph, the limit is ${SENTENCES}` });
  const limit = item ? WORDS.item : WORDS.paragraph;
  for (const s of parts) {
    const n = words(s);
    if (n > limit) out.push({ line, what: `${n} words, the limit is ${limit}: “${s.slice(0, 60)}…”` });
    for (const m of s.matchAll(PASSIVE)) out.push({ line, what: `passive voice “${m[0]}”` });
    for (const m of s.matchAll(ING)) {
      const w = (m[1] as string).toLowerCase();
      if (!ING_NOUNS.has(w)) out.push({ line, what: `-ing verb form “${m[0].trim()}”` });
    }
    for (const m of s.matchAll(MODAL)) out.push({ line, what: `the standard does not approve “${m[0]}”, write “must”, “can” or “will”` });
    for (const [re, to] of WORDS_REPLACED) {
      for (const m of s.matchAll(re)) out.push({ line, what: `the standard does not approve “${m[0]}”, write “${to}”` });
    }
  }
}

/* One block of text on its way to `judge`. The block joins its lines, and an
   item starts a block of its own. */
interface Block {
  line: number;
  item: boolean;
  lines: string[];
}

class Blocks {
  readonly out: Finding[] = [];
  private open: Block | null = null;

  get empty(): boolean {
    return this.open === null;
  }

  add(text: string, line: number, item = false): void {
    if (item || !this.open) this.flush(), (this.open = { line, item, lines: [text] });
    else this.open.lines.push(text);
  }

  flush(): void {
    if (this.open) {
      const text = inline(this.open.lines.join(' '));
      if (text) judge(text, this.open.line, this.open.item, this.out);
    }
    this.open = null;
  }
}

/* Inline markup becomes words: a code span and a role become CODE, a link
   keeps its text. */
function inline(text: string): string {
  return text
    .replace(/``[^`]*``|`[^`]*`/g, 'CODE')
    .replace(/:[a-z:-]+:CODE/g, 'CODE')
    .replace(/\|[^|\s][^|]*\|/g, 'CODE')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<https?:[^>]*>/g, 'CODE')
    .replace(/\bhttps?:\/\/\S+/g, 'CODE')
    .replace(/\*\*|\*|__/g, '')
    .replace(/(\S+)_\b/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

const SKIP_RST = /^(code-block|code|literalinclude|toctree|math|image|directory-tree|contents|configuration-block|specimen|swatch|include|raw)$/;
const ADORN = /^([=\-~^"'`#*+:._])\1{2,}\s*$/;
const ITEM = /^(?:[-*+•]|#\.|\d+[.)])\s+|^\* - |^- /;

function rst(source: string): Finding[] {
  const blocks = new Blocks();
  const lines = source.split('\n');
  let skipTo = -1;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i] as string;
    const indent = raw.length - raw.trimStart().length;
    const text = raw.trim();
    if (skipTo >= 0) {
      if (text && indent <= skipTo) skipTo = -1;
      else continue;
    }
    if (!text) { blocks.flush(); continue; }
    const next = (lines[i + 1] ?? '').trim();
    if (ADORN.test(text) || (ADORN.test(next) && next.length >= text.length)) { blocks.flush(); continue; }
    const directive = /^\.\. ([a-z:-]+)::/.exec(text);
    if (directive) {
      blocks.flush();
      if (SKIP_RST.test(directive[1] as string)) skipTo = indent;
      continue;
    }
    if (/^\.\.( |$)/.test(text) || /^:[a-z-]+:/.test(text) || /^[+|=]/.test(text)) { blocks.flush(); continue; }
    const item = ITEM.test(text);
    blocks.add(text.replace(ITEM, '').replace(/^- /, ''), i + 1, item);
    if (/(^|\s)::$/.test(text)) { blocks.flush(); skipTo = indent; }
  }
  blocks.flush();
  return blocks.out;
}

/** The cells of a Markdown table row. A pipe inside a code span is text. */
function cells(row: string): string[] {
  const out: string[] = [];
  let cell = '';
  let code = false;
  for (const ch of row.slice(1)) {
    if (ch === '`') code = !code;
    if (ch === '|' && !code) { out.push(cell); cell = ''; continue; }
    cell += ch;
  }
  return out;
}

function md(source: string): Finding[] {
  const blocks = new Blocks();
  const lines = source.split('\n');
  let fence = false;
  let front = source.startsWith('---');
  for (let i = 0; i < lines.length; i++) {
    const text = (lines[i] as string).trim();
    if (front) { if (i > 0 && text === '---') front = false; continue; }
    if (/^(```|~~~)/.test(text)) { fence = !fence; blocks.flush(); continue; }
    if (fence || !text || /^#/.test(text) || /^<!--/.test(text) || /^@/.test(text) || /^\|[\s:-]*\|?[\s|:-]*$/.test(text)) { blocks.flush(); continue; }
    if (/^\|/.test(text)) {
      blocks.flush();
      for (const cell of cells(text)) blocks.add(cell, i + 1, true);
      continue;
    }
    if (/^    /.test(lines[i] as string) && blocks.empty) continue;
    if (/^>/.test(text)) { blocks.add(text.replace(/^>\s*/, ''), i + 1); continue; }
    blocks.add(text.replace(ITEM, ''), i + 1, ITEM.test(text));
  }
  blocks.flush();
  return blocks.out;
}

/* The comments and the string literals of a source file, in one pass. One
   walk tells a `//` in a URL from a comment, and a backtick in a comment from
   a template. `${…}` in a template becomes CODE. */
interface Token {
  kind: 'comment' | 'string';
  text: string;
  line: number;
  /** The column the comment's text starts at; a line indented four columns
      past it is code. */
  base: number;
}

function tokens(source: string, ext: string): Token[] {
  const out: Token[] = [];
  const hash = /^(\.yml|\.yaml|\.sh|\.php|)$/.test(ext);
  const slash = /^\.(ts|js|php|css|twig)$/.test(ext);
  const lines = /^\.(ts|js|php)$/.test(ext);
  let i = 0;
  let line = 1;
  const advance = (to: number): void => {
    line += (source.slice(i, to).match(/\n/g) ?? []).length;
    i = to;
  };
  while (i < source.length) {
    const rest = source.slice(i, i + 3);
    if ((slash && rest.startsWith('/*')) || (ext === '.twig' && rest.startsWith('{#'))) {
      const close = rest.startsWith('{#') ? '#}' : '*/';
      // `{#-` and `-#}` are Twig's whitespace control, not a dash in the text.
      const open = rest.startsWith('/**') || rest === '{#-' ? 3 : 2;
      const end = source.indexOf(close, i + open);
      const stop = end < 0 ? source.length : end;
      const col = i - source.lastIndexOf('\n', i - 1) - 1;
      out.push({ kind: 'comment', text: source.slice(i + open, stop).replace(/-$/, ''), line, base: col + open + 1 });
      advance(stop + close.length);
      continue;
    }
    if ((lines && rest.startsWith('//')) || (hash && rest.startsWith('#') && !rest.startsWith('#!'))) {
      const end = source.indexOf('\n', i);
      const stop = end < 0 ? source.length : end;
      out.push({ kind: 'comment', text: source.slice(i + (rest.startsWith('//') ? 2 : 1), stop), line, base: 0 });
      advance(stop);
      continue;
    }
    const ch = source[i] as string;
    if (ch === '"' || ch === "'" || ch === '`') {
      let j = i + 1;
      let text = '';
      let depth = 0;
      while (j < source.length) {
        const c = source[j] as string;
        if (c === '\\') { text += source[j + 1] ?? ''; j += 2; continue; }
        if (ch === '`' && c === '$' && source[j + 1] === '{') { depth = 1; text += 'CODE'; j += 2; while (j < source.length && depth) { if (source[j] === '{') depth++; else if (source[j] === '}') depth--; j++; } continue; }
        if (c === ch) break;
        if (c === '\n' && ch !== '`') break;
        text += c;
        j++;
      }
      const tag = /(css|html|svg)$/.exec(source.slice(Math.max(0, i - 4), i));
      if (ch !== '`' || tag?.[1] === 'html' || !tag) out.push({ kind: 'string', text, line, base: 0 });
      advance(j + 1);
      continue;
    }
    if (ch === '\n') line++;
    i++;
  }
  return out;
}

/* The prose of a comment. A line indented four columns past the comment is
   code, and so is a line that starts like a command or a tag. */
function comments(source: string, ext: string): Finding[] {
  const blocks = new Blocks();
  for (const t of tokens(source, ext)) {
    if (t.kind !== 'comment') continue;
    let line = t.line;
    for (const raw of t.text.split('\n')) {
      const stripped = raw.replace(/^\s*\*(?!\/)\s?/, '');
      const indent = stripped.length - stripped.trimStart().length;
      const body = stripped.trim();
      const code = indent >= t.base + 4 || /^(\$|make |node |npm |<|\{|@|\|)/.test(body) || (/^[\w-]+:\s+\S/.test(body) && !/\s[a-z]+\s[a-z]+\s/.test(body));
      if (!body || code) blocks.flush();
      else blocks.add(body.replace(ITEM, ''), line, ITEM.test(body));
      line++;
    }
    blocks.flush();
  }
  return blocks.out;
}

/* The sentences a file prints or renders: a literal of four words or more
   that reads as prose. Markup in a template becomes its text. */
function strings(source: string, ext: string): Finding[] {
  const blocks = new Blocks();
  for (const t of tokens(source, ext)) {
    if (t.kind !== 'string') continue;
    const text = t.text
      .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
      .replace(/<[^>]+>/g, '\n')
      .replace(/&[a-z]+;|&#\d+;/g, ' ');
    for (const piece of text.split('\n')) {
      const p = inline(piece);
      /* A command is words too, but a path or a flag among them says it is
         one, and a command is not prose. */
      if (/\/|--/.test(p) && !/[.:!?]\s|[A-Z]/.test(p)) continue;
      if (words(p) >= 4 && /[a-z]{2,}\s+[a-z]{2,}\s+[a-z]{2,}/.test(p) && !/[{};=]/.test(p)) {
        blocks.add(p, t.line, true);
        blocks.flush();
      }
    }
  }
  return blocks.out;
}

/* Which files hold text. Generated output, licences and the words of another
   project are not this tree's writing. */
const IGNORE = /(^|\/)(node_modules|\.out|\.git|\.claude|\.ds-sync|\.cache|dist|specimens|_cards|fonts|icons|vendor|storybook-static|\.dist-check)(\/|$)|\.generated\.|LICENSE|THIRD-PARTY|CHANGELOG|package-lock|composer\.lock/;
const DOC = /\.(rst|md)$/;
const CODE = /\.(ts|js|css|php|twig|yml|yaml|sh)$|(^|\/)(Makefile|Dockerfile)$/;
const PRINTS = /^(scripts|packages\/frontend\/src|stories|\.storybook|tests|packages\/guides-theme\/(src|resources))\//;

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name);
    const rel = relative(ROOT, path);
    if (IGNORE.test(rel)) continue;
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

report.open('prose', 'the written text against ASD-STE100 and the terse rule');

const rows = [
  { name: 'documents', label: 'every page, README and instruction' },
  { name: 'comments', label: 'every comment in a source file' },
  { name: 'strings', label: 'every sentence a component or a task prints' },
];
report.align(rows);

const counts = { documents: 0, comments: 0, strings: 0 };
const found: Record<keyof typeof counts, string[]> = { documents: [], comments: [], strings: [] };

for (const path of walk(ROOT)) {
  const rel = relative(ROOT, path);
  const ext = extname(path);
  const name = basename(path);
  if (DOC.test(name)) {
    counts.documents++;
    for (const f of ext === '.rst' ? rst(readFileSync(path, 'utf8')) : md(readFileSync(path, 'utf8'))) found.documents.push(`${rel}:${f.line}  ${f.what}`);
    continue;
  }
  if (!CODE.test(rel)) continue;
  const source = readFileSync(path, 'utf8');
  counts.comments++;
  for (const f of comments(source, /Makefile|Dockerfile/.test(name) ? '' : ext)) found.comments.push(`${rel}:${f.line}  ${f.what}`);
  if (PRINTS.test(rel) && /\.(ts|js|php|twig)$/.test(ext)) {
    counts.strings++;
    for (const f of strings(source, ext)) found.strings.push(`${rel}:${f.line}  ${f.what}`);
  }
}

const problems: string[] = [];
for (const row of rows) {
  const key = row.name as keyof typeof counts;
  const list = found[key];
  report.row(list.length ? 'bad' : 'ok', row.name, row.label, `${counts[key]} files · ${list.length} findings`);
  // Under the gate the summary prints them, after the facts line the gate reads first.
  if (!report.REPORTING) for (const f of list) report.detail(f);
  problems.push(...list.map((f) => `${key}: ${f}`));
}

report.summary(`${counts.documents} documents · ${counts.comments} sources · ${problems.length} findings`, problems, { shown: true });
process.exit(problems.length ? 1 : 0);
