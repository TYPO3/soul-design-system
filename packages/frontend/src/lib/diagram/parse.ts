/* A diagram written as text: `parse(text)` is the spec `diagram()` draws.

   One statement per line. The first line names the layout, an indented line
   belongs to the statement above it, and `#` starts a comment. A text
   stands in double quotes, an identifier in backticks, an option is
   `key=value` and a flag is a bare word. A value with a space or a colon
   stands in quotes. `docs/design-system/diagrams/index.rst`
   shows each layout written out. */

import type { DiagramSpec } from './index.ts';
import { GLYPHS, glyphChar } from './paint.ts';

type Token =
  | { kind: 'word'; value: string }
  | { kind: 'text'; value: string; code: boolean }
  | { kind: 'option'; key: string; value: string; code: boolean }
  | { kind: 'arrow'; value: string }
  | { kind: 'colon' };

interface Line {
  number: number;
  indent: number;
  tokens: Token[];
  children: Line[];
}

const ARROWS = ['<->', '-->', '->', '=>', '-x'];

const fail = (line: Pick<Line, 'number'>, message: string): never => {
  throw new Error(`line ${line.number}: ${message}`);
};

/* A quoted run, from the quote at `at`, with `\"` for a quote inside it. */
const quoted = (source: string, at: number, quote: string, number: number): [string, number] => {
  let value = '';
  let i = at + 1;
  while (i < source.length && source[i] !== quote) {
    /* `\n` in a text starts a new paragraph. */
    if (source[i] === '\\' && quote === '"' && source[i + 1] === 'n') {
      value += '\n';
      i += 2;
      continue;
    }
    if (source[i] === '\\' && quote === '"' && i + 1 < source.length) i++;
    value += source[i];
    i++;
  }
  if (i >= source.length) fail({ number }, `a ${quote === '"' ? 'text' : 'name'} with no closing ${quote}`);
  /* A sign in a text, `{clock}`: a name the engine does not know stays as written. */
  if (quote === '"') value = value.replace(/\{([a-z]+)\}/g, (all, name: string) => glyphChar(name) ?? all);
  return [value, i + 1];
};

const tokenize = (source: string, number: number): Token[] => {
  const tokens: Token[] = [];
  let i = 0;
  while (i < source.length) {
    const c = source[i] ?? '';
    if (c === ' ' || c === '\t') {
      i++;
    } else if (c === '#') {
      break;
    } else if (c === '"' || c === '`') {
      const [value, next] = quoted(source, i, c, number);
      tokens.push({ kind: 'text', value, code: c === '`' });
      i = next;
    } else if (c === ':') {
      tokens.push({ kind: 'colon' });
      i++;
    } else {
      const arrow = ARROWS.find((a) => source.startsWith(a, i));
      if (arrow) {
        tokens.push({ kind: 'arrow', value: arrow });
        i += arrow.length;
        continue;
      }
      let word = '';
      while (i < source.length && !/[\s"`#:]/.test(source[i] ?? '') && source[i] !== '=' && !(word && ARROWS.some((a) => source.startsWith(a, i)))) {
        word += source[i++];
      }
      if (source[i] === '=') {
        i++;
        const q = source[i];
        if (q === '"' || q === '`') {
          const [value, next] = quoted(source, i, q, number);
          tokens.push({ kind: 'option', key: word, value, code: q === '`' });
          i = next;
        } else {
          let value = '';
          while (i < source.length && !/[\s#:]/.test(source[i] ?? '')) value += source[i++];
          tokens.push({ kind: 'option', key: word, value, code: false });
        }
      } else if (word) {
        tokens.push({ kind: 'word', value: word });
      } else {
        fail({ number }, `"${c}" stands where no statement expects it`);
      }
    }
  }
  return tokens;
};

/* The lines as a tree: a line indented under another is its child. */
const tree = (text: string): Line[] => {
  const root: Line = { number: 0, indent: -1, tokens: [], children: [] };
  const stack = [root];
  text.split('\n').forEach((source, i) => {
    const tokens = tokenize(source, i + 1);
    if (!tokens.length) return;
    const indent = source.length - source.trimStart().length;
    while ((stack.at(-1)?.indent ?? -1) >= indent) stack.pop();
    const line: Line = { number: i + 1, indent, tokens, children: [] };
    stack.at(-1)?.children.push(line);
    stack.push(line);
  });
  /* The top lines are statements of their own, never parts of another. */
  for (const line of root.children) fold(line);
  return root.children;
};

/* An option, a flag or a run of parts can stand on a line of its own, under
   its statement. So a long statement reads down the page. */
const OPTIONS = new Set([
  'active', 'at', 'badge', 'letter', 'bend', 'body', 'caption', 'cards', 'count', 'eyebrow', 'flow', 'foot', 'heading', 'id', 'mark', 'marker',
  'marks', 'missing', 'nav', 'over', 'place', 'placeholder', 'right', 'sign', 'size', 'span', 'sub', 'surface', 'tag',
  'rows', 'target', 'tone', 'unit', 'value', 'via', 'weight', 'width', 'icons', 'show',
  // the options of a layout's first line
  'across', 'axis', 'bands', 'claim', 'columns', 'direction', 'gap', 'head', 'height', 'key', 'label-width', 'max', 'notes', 'row-groups', 'slide', 'ticks',
]);
const FLAGS = new Set([
  'absent', 'boxed', 'chain', 'close', 'figures', 'fill', 'rise', 'curve', 'changed', 'cursor', 'degraded', 'emphasis', 'fan', 'focus', 'handle', 'hidden', 'ink', 'large', 'muted', 'new',
  'person', 'push', 'selected', 'slim', 'small', 'split', 'steps', 'store', 'strong', 'switch',
  'arrow', 'bare', 'plain', 'left', 'heads', 'blocks', 'corner', 'dashed', 'device', 'dim', 'head', 'inplace', 'on', 'over', 'pointer', 'rendered', 'ring',
  'round', 'dot', 'sheet', 'even', 'aside', 'end', 'square', 'ids', 'rules', 'bar', 'centred',
]);
const PARTS = new Set(['cells', 'chips', 'parts', 'segments']);

const fold = (line: Line): void => {
  const kept: Line[] = [];
  for (const child of line.children) {
    fold(child);
    const [head, value, ...rest] = child.tokens;
    const word = head?.kind === 'word' ? head.value : '';
    const colon = line.tokens.findIndex((t) => t.kind === 'colon');
    const before = (t: Token): void => {
      if (colon < 0) line.tokens.push(t);
      else line.tokens.splice(colon, 0, t);
    };
    /* Under a part, the first word of a line can name its layout, and a
       layout can share its name with an option: `columns chain`. */
    const layoutOfPart = line.tokens[0]?.kind === 'word' && line.tokens[0].value === 'part' && Object.hasOwn(LAYOUTS, word);
    /* In a column, a frame, a row or a region, a control keeps its name: `tag "Hero"`. A
       bare `arrow` there is the control, not the flag of a join. */
    const parent = line.tokens[0]?.kind === 'word' ? line.tokens[0].value : '';
    const control = ['column', 'frame', 'row', 'region', 'band'].includes(parent) && isWidget(word);
    if (child.children.length || layoutOfPart || control) {
      kept.push(child);
    } else if (FLAGS.has(word) && !value) {
      before({ kind: 'word', value: word });
    } else if ((OPTIONS.has(word) || line.tokens[0]?.kind === 'word' && line.tokens[0].value === 'legend') && value && !rest.length && (value.kind === 'text' || value.kind === 'word')) {
      before({ kind: 'option', key: word, value: value.value, code: value.kind === 'text' && value.code });
    } else if (PARTS.has(word)) {
      if (colon < 0) line.tokens.push({ kind: 'colon' });
      line.tokens.push(...child.tokens.slice(1).filter((t) => t.kind !== 'colon'));
    } else {
      kept.push(child);
    }
  }
  line.children = kept;
};

/* A group block: the rows under `group "Name"` carry that group. */
const ungroup = (lines: Line[]): Line[] =>
  lines.flatMap((line) => {
    const s = read(line);
    if (s.head !== 'group' || !line.children.length) return [line];
    const tag: Token = { kind: 'option', key: 'group', value: textOf(s), code: false };
    return line.children.map((child) => {
      const colon = child.tokens.findIndex((t) => t.kind === 'colon');
      const tokens = [...child.tokens];
      tokens.splice(colon < 0 ? tokens.length : colon, 0, tag);
      return { ...child, tokens };
    });
  });

/** What a statement says, sorted: its leading word, its texts, its options,
    its flags, and what stands after a colon. */
interface Statement {
  line: Line;
  head: string;
  texts: { value: string; code: boolean }[];
  options: Map<string, { value: string; code: boolean }>;
  flags: Set<string>;
  arrow?: string;
  words: string[];
  after: Token[];
}

const read = (line: Line): Statement => {
  const [first, ...rest] = line.tokens;
  const statement: Statement = {
    line,
    head: first?.kind === 'word' ? first.value : '',
    texts: [],
    options: new Map(),
    flags: new Set(),
    words: [],
    after: [],
  };
  const tokens = first?.kind === 'word' ? rest : line.tokens;
  const colon = tokens.findIndex((t) => t.kind === 'colon');
  const before = colon < 0 ? tokens : tokens.slice(0, colon);
  statement.after = colon < 0 ? [] : tokens.slice(colon + 1);
  for (const t of before) {
    if (t.kind === 'text') statement.texts.push({ value: t.value, code: t.code });
    else if (t.kind === 'option') statement.options.set(t.key, { value: t.value, code: t.code });
    else if (t.kind === 'arrow') statement.arrow = t.value;
    else if (t.kind === 'word') statement.words.push(t.value);
  }
  for (const w of statement.words) statement.flags.add(w);
  return statement;
};

const option = (s: Statement, key: string): string | undefined => s.options.get(key)?.value;

const numberOf = (s: Statement, key: string): number | undefined => {
  const raw = option(s, key);
  if (raw === undefined) return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n)) fail(s.line, `${key}=${raw} is not a number`);
  return n;
};

const numbers = (s: Statement, key: string): number[] | undefined => {
  const raw = option(s, key);
  if (raw === undefined) return undefined;
  return raw.split(',').map((part) => {
    const n = Number(part);
    if (!Number.isFinite(n)) fail(s.line, `${key}=${raw} is not a list of numbers`);
    return n;
  });
};

const textOf = (s: Statement, index = 0): string => {
  const t = s.texts[index];
  if (!t) return fail(s.line, `${s.head || 'this statement'} needs a text in double quotes`);
  return t.value;
};

const oneOf = <T extends string>(s: Statement, key: string, allowed: readonly T[]): T | undefined => {
  const raw = option(s, key);
  if (raw === undefined) return undefined;
  if (!(allowed as readonly string[]).includes(raw)) fail(s.line, `${key}=${raw}: write one of ${allowed.join(', ')}`);
  return raw as T;
};

const state = (s: Statement): 'absent' | 'degraded' | undefined =>
  s.flags.has('absent') ? 'absent' : s.flags.has('degraded') ? 'degraded' : undefined;

const shape = (s: Statement): 'person' | 'store' | undefined =>
  s.flags.has('person') ? 'person' : s.flags.has('store') ? 'store' : undefined;

const SIGNS = ['yes', 'partly', 'no', 'unknown', 'dot', 'ring', 'page', 'panel', 'both', 'form', 'bar', 'nav', 'docheader', 'any'] as const;
type SignWord = (typeof SIGNS)[number];
const isSign = (w: string): w is SignWord => (SIGNS as readonly string[]).includes(w);
const TONES = ['ink', 'muted', 'ok', 'warn', 'error'] as const;

/** Drop the keys an author did not write, so the spec reads like one
    written by hand. */
const clean = <T extends object>(o: T): T =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== false)) as T;

/* ---------------------------------------------------------------- layouts */

const flow = (lines: Line[]): Record<string, unknown> => {
  const nodes: Record<string, unknown>[] = [];
  const edges: Record<string, unknown>[] = [];
  const groups: Record<string, unknown>[] = [];
  const node = (s: Statement): string => {
    const id = s.head;
    /* A node can be a list alone: its entries are `item` lines under it. */
    const items = s.line.children
      .map(read)
      .filter((c) => c.head === 'item')
      .map((c) => clean({ title: textOf(c), body: option(c, 'body'), value: option(c, 'value') }));
    const title = s.texts[0] ?? (items.length ? { value: '', code: false } : fail(s.line, `node ${id} needs its title in double quotes or backticks`));
    const at = numbers(s, 'at');
    if (!at || at.length !== 2) fail(s.line, `node ${id} needs at=column,row`);
    const mark = s.flags.has('new') ? 'new' : s.flags.has('changed') ? 'changed' : undefined;
    nodes.push(
      clean({
        id,
        at,
        span: numberOf(s, 'span'),
        rows: numberOf(s, 'rows'),
        title: title.value,
        code: title.code || undefined,
        body: option(s, 'body'),
        value: option(s, 'value'),
        items: items.length ? items : undefined,
        across: numberOf(s, 'across'),
        mark,
        shape: shape(s),
        state: state(s),
        emphasis: s.flags.has('emphasis') || undefined,
        fill: flag(s, 'fill'),
        ink: s.flags.has('ink') || undefined,
        strong: flag(s, 'strong'),
        plain: flag(s, 'plain'),
        dashed: flag(s, 'dashed'),
        eyebrow: option(s, 'eyebrow'),
        tag: option(s, 'tag'),
      }),
    );
    return id;
  };
  /* A boundary holds the nodes under it, and a boundary under it stands inside it. */
  const group = (line: Line, within?: string): string[] => {
    const s = read(line);
    const id = s.words.find((w) => !['absent', 'degraded'].includes(w));
    const label = textOf(s);
    const members = line.children.flatMap((child) => (read(child).head === 'group' ? group(child, id ?? `group:${label}`) : [node(read(child))]));
    groups.push(clean({ id, label, nodes: members, state: state(s), within, emphasis: flag(s, 'emphasis') }));
    return members;
  };
  const rows: Record<string, unknown>[] = [];
  const heads: string[] = [];
  const letters: string[] = [];
  const claims: number[] = [];
  const eyebrows: string[] = [];
  for (const line of lines) {
    const s = read(line);
    if (s.head === 'group') {
      group(line);
    } else if (s.head === 'column' && !s.arrow) {
      const index = Number(s.words[0]);
      if (!Number.isInteger(index) || index < 0) fail(line, 'a column head is `column <number> "head"`, from 0');
      while (heads.length <= index) heads.push('');
      heads[index] = textOf(s);
      if (s.flags.has('emphasis')) claims.push(index);
      const letter = option(s, 'letter');
      if (letter) {
        while (letters.length <= index) letters.push('');
        letters[index] = letter;
      }
      const eyebrow = option(s, 'eyebrow');
      if (eyebrow) {
        while (eyebrows.length <= index) eyebrows.push('');
        eyebrows[index] = eyebrow;
      }
    } else if (s.head === 'row' && !s.arrow) {
      const index = Number(s.words[0]);
      if (!Number.isInteger(index) || index < 0) fail(line, 'a row label is `row <number> "label"`, from 0');
      while (rows.length <= index) rows.push({});
      rows[index] = clean({ label: s.texts[0]?.value, note: option(s, 'note') ?? line.children.filter((c) => read(c).head === 'note').map((c) => textOf(read(c)))[0] });
    } else if (s.arrow) {
      const [to] = s.words.filter((w) => !['absent', 'degraded', 'emphasis'].includes(w));
      if (!to) fail(line, 'a connector needs the id it goes to');
      edges.push(
        clean({
          from: s.head,
          to,
          label: s.texts[0]?.value,
          via: oneOf(s, 'via', ['h', 'v'] as const),
          bend: numberOf(s, 'bend'),
          state: s.arrow === '-->' ? 'absent' : state(s),
          fails: s.arrow === '-x' || undefined,
          both: s.arrow === '<->' || undefined,
          emphasis: s.arrow === '=>' || s.flags.has('emphasis') || undefined,
        }),
      );
    } else {
      node(s);
    }
  }
  return clean({ nodes, edges, groups: groups.length ? groups : undefined, rows: rows.length ? rows : undefined, heads: heads.length ? heads : undefined, letters: letters.length ? letters : undefined, claims: claims.length ? claims : undefined, eyebrows: eyebrows.length ? eyebrows : undefined });
};

const sequence = (lines: Line[]): Record<string, unknown> => {
  const lanes: Record<string, unknown>[] = [];
  const hosts: Record<string, unknown>[] = [];
  const phases: Record<string, unknown>[] = [];
  const steps = (children: Line[]): Record<string, unknown>[] =>
    children.map((line) => {
      const s = read(line);
      if (s.head === 'note') {
        const over = option(s, 'over')?.split(',');
        if (over && over.length !== 2) fail(line, 'over=first,last names two lanes');
        return clean({ note: textOf(s), over });
      }
      if (!s.arrow) fail(line, 'a step is `from -> to "text"`, or a note');
      const [to] = s.words.filter((w) => !['absent', 'degraded', 'emphasis'].includes(w));
      if (!to) fail(line, 'a step needs the lane it goes to');
      return clean({
        from: s.head,
        to,
        text: textOf(s),
        state: s.arrow === '-->' ? 'absent' : state(s),
        fails: s.arrow === '-x' || undefined,
        emphasis: s.arrow === '=>' || s.flags.has('emphasis') || undefined,
      });
    });
  for (const line of lines) {
    const s = read(line);
    if (s.head === 'lane') {
      const [id] = s.words;
      if (!id) fail(line, 'a lane needs an id');
      lanes.push(clean({ id, label: textOf(s), sub: option(s, 'sub'), shape: shape(s) }));
    } else if (s.head === 'host') {
      hosts.push({ label: textOf(s), lanes: s.words });
    } else if (s.head === 'phase') {
      phases.push(clean({ title: s.texts[0]?.value, tone: oneOf(s, 'tone', ['error', 'warn', 'ok'] as const), steps: steps(line.children) }));
    } else {
      fail(line, `"${s.head}" is not a statement of a sequence: write lane, host or phase`);
    }
  }
  return clean({ lanes, hosts: hosts.length ? hosts : undefined, phases });
};

const cell = (t: Token, line: Line): unknown => {
  if (t.kind === 'word') {
    if (t.value === '-') return '';
    if (isSign(t.value)) return t.value;
    const noted = /^(\w+)\^(\d+)$/.exec(t.value);
    if (noted && isSign(noted[1] ?? '')) return { sign: noted[1], note: Number(noted[2]) };
    return fail(line, `"${t.value}" is not a cell: write ${SIGNS.join(', ')}, - or a text, and sign^1 for a note`);
  }
  if (t.kind === 'text') return clean({ text: t.value, code: t.code || undefined });
  if (t.kind === 'option') {
    if (t.key === 'chip') return { chips: t.value.split(',').map((x) => x.trim()).filter(Boolean) };
    if (t.key === 'path') return { path: t.value.split('›').map((x) => x.trim()).filter(Boolean) };
    if (!isSign(t.key)) fail(line, `"${t.key}" is not a sign: write a sign=text, chip=A1,A2 or path="a › b"`);
    return clean({ sign: t.key, text: t.value, code: t.code || undefined });
  }
  return fail(line, 'a cell is a sign, - or a text');
};

const matrix = (all: Line[]): Record<string, unknown> => {
  const lines = ungroup(all);
  const columns: Record<string, unknown>[] = [];
  const rows: Record<string, unknown>[] = [];
  const emphasis: { row: string[]; column: string[] } = { row: [], column: [] };
  let legend: Record<string, string> | undefined;
  let legendNote: string | undefined;
  const notes: string[] = [];
  for (const line of lines) {
    const s = read(line);
    if (s.head === 'column') columns.push(clean({ label: textOf(s), letter: option(s, 'letter'), sub: option(s, 'sub'), group: option(s, 'group'), split: s.flags.has('split') || undefined, sign: oneOf(s, 'sign', SIGNS), weight: numberOf(s, 'weight'), end: flag(s, 'end') }));
    else if (s.head === 'note') notes.push(textOf(s));
    else if (s.head === 'row') {
      if (!s.after.length) fail(line, 'a row lists its cells after a colon, or on a `cells …` line under it');
      rows.push(clean({ label: textOf(s), sub: option(s, 'sub'), group: option(s, 'group'), cells: s.after.map((t) => cell(t, line)) }));
    } else if (s.head === 'emphasis') {
      /* Several emphasis lines name peers that make one claim. */
      for (const key of ['row', 'column'] as const) {
        const value = option(s, key);
        if (value !== undefined) emphasis[key].push(value);
      }
    }
    else if (s.head === 'legend') {
      legend = Object.fromEntries([...s.options].filter(([k]) => k !== 'note').map(([k, v]) => [k, v.value]));
      legendNote = option(s, 'note');
    }
    else fail(line, `"${s.head}" is not a statement of a matrix: write column, row, note, emphasis or legend`);
  }
  const one = (all: string[]): string | string[] | undefined => (all.length > 1 ? all : all[0]);
  const marked = clean({ row: one(emphasis.row), column: one(emphasis.column) });
  return clean({ columns, rows, emphasis: Object.keys(marked).length ? marked : undefined, legend, legendNote, notes: notes.length ? notes : undefined });
};

const bars = (all: Line[]): Record<string, unknown> => {
  const lines = ungroup(all);
  const rows: Record<string, unknown>[] = [];
  let legend: Record<string, unknown>[] | undefined;
  for (const line of lines) {
    const s = read(line);
    if (s.head === 'row') {
      const segments = s.after.map((t) => {
        if (t.kind === 'option') {
          if (t.key === 'absent') return { value: Number(t.value), absent: true };
          const tone = (TONES as readonly string[]).includes(t.key) ? t.key : fail(line, `"${t.key}" is not a tone: write ${TONES.join(', ')} or absent`);
          return { value: Number(t.value), tone };
        }
        if (t.kind === 'word' && Number.isFinite(Number(t.value))) return { value: Number(t.value) };
        return fail(line, 'a segment is a number, or tone=number');
      });
      rows.push(
        clean({
          label: textOf(s),
          code: s.texts[0]?.code || undefined,
          sub: option(s, 'sub'),
          group: option(s, 'group'),
          segments,
          target: numberOf(s, 'target'),
          value: option(s, 'value'),
          emphasis: s.flags.has('emphasis') || undefined,
        }),
      );
    } else if (s.head === 'legend') {
      legend = [...s.options].map(([tone, v]) => ({ tone, label: v.value }));
    } else {
      fail(line, `"${s.head}" is not a statement of bars: write row or legend`);
    }
  }
  return clean({ rows, legend });
};

const tiles = (lines: Line[]): Record<string, unknown> => ({
  tiles: lines.map((line) => {
    const s = read(line);
    if (s.head !== 'tile') fail(line, 'tiles hold tile statements');
    return clean({
      value: textOf(s, 0),
      label: textOf(s, 1),
      unit: option(s, 'unit'),
      body: option(s, 'body'),
      sign: oneOf(s, 'sign', SIGNS),
      state: state(s),
      emphasis: s.flags.has('emphasis') || undefined,
    });
  }),
});

const WIDGETS = [
  'text', 'field', 'button', 'tabs', 'chip', 'hint', 'label', 'step', 'code', 'page', 'lock', 'image', 'tree', 'tools', 'lines', 'devices', 'site', 'rule',
  'keycap', 'toolbar', 'frame', 'list', 'pill', 'tag', 'arrow', 'progress', 'dots', 'thumb', 'crop', 'map', 'toggle', 'drop', 'insert', 'entry', 'keyboard', 'span',
] as const;
const isWidget = (head: string): boolean => (WIDGETS as readonly string[]).includes(head);
/* A `row` whose lines are all controls sets them side by side. A `row` of
   regions splits a screen. */
const isControlRow = (line: Line): boolean => read(line).head === 'row' && line.children.length > 0 && line.children.every((c) => isWidget(read(c).head));
const isControl = (line: Line): boolean => isWidget(read(line).head) || isControlRow(line);

const flag = (s: Statement, name: string): true | undefined => s.flags.has(name) || undefined;

/** A control and the controls indented under it, from its line. */
const controlOf = (line: Line): Record<string, unknown> => {
  if (!isControl(line)) fail(line, `"${read(line).head}" is not a control: write row or one of ${WIDGETS.join(', ')}`);
  const s = read(line);
  return clean({ ...widgetOf(s), push: flag(s, 'push'), weight: numberOf(s, 'weight'), id: option(s, 'id'), corner: flag(s, 'corner'), pointer: flag(s, 'pointer') });
};

/* A row of a list. Two spaces before its label stand for one level of indent. */
const listRow = (line: Line): Record<string, unknown> => {
  const s = read(line);
  if (s.head !== 'row') fail(line, 'a list holds `row "Label"` statements');
  const raw = textOf(s);
  const label = raw.trimStart();
  return clean({
    text: label,
    indent: numberOf(s, 'indent') ?? (Math.floor((raw.length - label.length) / 2) || undefined),
    selected: flag(s, 'selected'),
    boxed: flag(s, 'boxed'),
    muted: flag(s, 'muted'),
    strong: flag(s, 'strong'),
    state: state(s),
    emphasis: flag(s, 'emphasis'),
    right: option(s, 'right'),
    button: option(s, 'button'),
    mark: oneOf(s, 'mark', TONES),
    chip: option(s, 'chip'),
    head: flag(s, 'head'),
    marker: option(s, 'marker'),
    id: option(s, 'id'),
  });
};

/* The `line "…"` statements under a code block or a field, in order. */
const lines = (s: Statement, what: string): string[] | undefined => {
  const out = s.line.children.map((c) => {
    const l = read(c);
    if (l.head !== 'line') fail(c, `${what} holds \`line "…"\` statements`);
    return textOf(l);
  });
  return out.length ? out : undefined;
};

/** A control of an interface, from its statement. */
const widgetOf = (s: Statement): Record<string, unknown> => {
  const marker = option(s, 'marker');
  const chip = option(s, 'chip');
  const strong = flag(s, 'strong');
  const t = s.texts[0];
  switch (s.head) {
    case 'text':
      return clean({ w: 'text', text: textOf(s), code: t?.code || undefined, strong, large: flag(s, 'large'), small: flag(s, 'small'), tone: oneOf(s, 'tone', ['ink', 'muted', 'error'] as const), marker, chip });
    case 'field':
      return clean({
        w: 'field',
        text: t?.value,
        code: t?.code || undefined,
        placeholder: option(s, 'placeholder'),
        cursor: s.flags.has('cursor') || undefined,
        tag: option(s, 'tag'),
        lines: numberOf(s, 'lines'),
        focus: s.flags.has('focus') || undefined,
        emphasis: flag(s, 'emphasis'),
        large: s.flags.has('large') || undefined,
        slim: flag(s, 'slim'),
        strong,
        state: state(s),
        hidden: flag(s, 'hidden'),
        ring: flag(s, 'ring'),
        dim: flag(s, 'dim'),
        inplace: flag(s, 'inplace'),
        right: option(s, 'right'),
        more: lines(s, 'a field'),
        dot: flag(s, 'dot'),
        bare: flag(s, 'bare'),
        marker,
        chip,
      });
    case 'button':
      return clean({ w: 'button', text: textOf(s), strong, ink: flag(s, 'ink'), small: flag(s, 'small'), round: flag(s, 'round'), square: flag(s, 'square'), emphasis: flag(s, 'emphasis'), marker, chip });
    case 'tabs':
      return clean({ w: 'tabs', items: textOf(s).split(',').map((x) => x.trim()), active: numberOf(s, 'active'), switch: flag(s, 'switch'), small: flag(s, 'small'), marker, chip });
    case 'toolbar':
      return clean({ w: 'toolbar', items: textOf(s).split(',').map((x) => x.trim()), active: numbers(s, 'active'), strong, ink: flag(s, 'ink'), marker, chip });
    case 'pill':
      return clean({ w: 'pill', text: textOf(s), ink: flag(s, 'ink'), marker, chip });
    case 'tag':
      return clean({ w: 'tag', text: textOf(s), marker, chip });
    case 'arrow':
      return clean({ w: 'arrow', text: t?.value, marker });
    case 'progress': {
      const value = numberOf(s, 'value') ?? fail(s.line, 'a progress bar needs value= from 0 to 1');
      if (value < 0 || value > 1) fail(s.line, `value=${value}: a progress bar takes a share from 0 to 1`);
      return clean({ w: 'progress', value, marker });
    }
    case 'chip':
      return clean({ w: 'chip', text: textOf(s), label: s.texts[1]?.value, emphasis: flag(s, 'emphasis'), fill: flag(s, 'fill'), strong, marker });
    case 'dots': {
      const of = numberOf(s, 'of') ?? fail(s.line, 'dots need of= for the whole, and value= for the filled ones');
      const value = numberOf(s, 'value') ?? fail(s.line, 'dots need value= for the filled ones');
      if (!Number.isInteger(of) || !Number.isInteger(value) || of < 1 || value < 0 || value > of) fail(s.line, `value=${value} of=${of}: write whole counts, the value no more than the whole`);
      return clean({ w: 'dots', value, of, text: t?.value, marker });
    }
    case 'keycap':
      return clean({ w: s.head, text: textOf(s), marker });
    case 'hint':
      return clean({ w: 'hint', text: textOf(s), right: option(s, 'right'), emphasis: flag(s, 'emphasis'), marker, chip });
    case 'label':
    case 'step':
      return clean({ w: s.head, text: textOf(s), chip, marker });
    case 'code': {
      /* A block of code: a `line "…"` under it for each line, its spaces kept. */
      const block = lines(s, 'a code block');
      if (!block && !t) fail(s.line, 'code needs a text, or `line "…"` lines under it');
      return clean({ w: 'code', text: t?.value, lines: block, strong, marker, chip });
    }
    case 'thumb':
      return clean({
        w: 'thumb',
        text: t?.value,
        show: oneOf(s, 'show', ['picture', 'lines', 'teaser', 'page', 'person'] as const),
        split: numbers(s, 'split'),
        selected: flag(s, 'selected'),
        state: state(s),
        marker,
      });
    case 'crop':
      return clean({ w: 'crop', marker });
    case 'map':
      return clean({ w: 'map', text: t?.value, marker });
    case 'toggle':
      return clean({ w: 'toggle', text: textOf(s), on: flag(s, 'on'), marker });
    case 'drop':
      return clean({ w: 'drop', text: t?.value, marker });
    case 'insert':
      return clean({ w: 'insert', strong, marker, chip });
    case 'keyboard':
      return clean({ w: 'keyboard', marker });
    case 'span':
      return clean({ w: 'span', text: textOf(s), marker });
    case 'entry':
      return clean({ w: 'entry', text: textOf(s), body: option(s, 'body'), sign: oneOf(s, 'sign', GLYPHS), selected: flag(s, 'selected'), state: state(s), marker, chip });
    case 'lock':
      return clean({ w: s.head, text: textOf(s), strong, marker, chip });
    case 'page':
      return clean({ w: s.head, text: textOf(s), dot: flag(s, 'dot'), marker });
    case 'image':
      return clean({ w: 'image', text: t?.value, lines: numberOf(s, 'lines'), marker });
    case 'tree':
    case 'lines':
      return clean({ w: s.head, lines: numberOf(s, 'lines'), marker });
    case 'tools':
      return clean({ w: 'tools', count: numberOf(s, 'count'), marker });
    case 'devices':
      return clean({ w: 'devices', text: textOf(s), active: oneOf(s, 'active', ['phone', 'tablet', 'desktop'] as const), chip, marker });
    case 'site':
      return clean({
        w: 'site',
        name: textOf(s),
        nav: option(s, 'nav'),
        heading: option(s, 'heading'),
        cards: numberOf(s, 'cards'),
        width: numberOf(s, 'width'),
        selected: s.flags.has('selected') || undefined,
        cursor: s.flags.has('cursor') || undefined,
        marker,
      });
    case 'row':
      return clean({ w: 'row', items: s.line.children.map(controlOf), bar: flag(s, 'bar') });
    case 'frame':
      return clean({
        w: 'frame',
        title: t?.value,
        close: flag(s, 'close'),
        tone: oneOf(s, 'tone', ['ok', 'warn', 'error'] as const),
        strong,
        state: state(s),
        hidden: flag(s, 'hidden'),
        width: numberOf(s, 'width'),
        ink: flag(s, 'ink'),
        over: flag(s, 'over'),
        bare: flag(s, 'bare'),
        fill: flag(s, 'fill'),
        sheet: flag(s, 'sheet'),
        device: flag(s, 'device'),
        dot: flag(s, 'dot'),
        chip,
        marker,
        items: s.line.children.map(controlOf),
      });
    case 'list':
      if (!s.line.children.length) fail(s.line, 'a list needs its `row "Label"` lines under it');
      return clean({ w: 'list', handle: flag(s, 'handle'), steps: flag(s, 'steps'), columns: numbers(s, 'columns'), rendered: flag(s, 'rendered'), marker, rows: s.line.children.map(listRow) });
    default:
      return { w: 'rule' };
  }
};

const columns = (all: Line[]): Record<string, unknown> => {
  const legend = all.filter((l) => read(l).head === 'key').map((l) => {
    const k = read(l);
    return clean({ label: textOf(k), chip: option(k, 'chip'), badge: option(k, 'badge'), pill: option(k, 'pill'), sign: oneOf(k, 'sign', SIGNS) });
  });
  const lines = all.filter((l) => read(l).head !== 'key');
  return clean({ legend: legend.length ? legend : undefined, ...columnsOf(lines) });
};

const columnsOf = (lines: Line[]): Record<string, unknown> => ({
  columns: lines.map((line) => {
    const s = read(line);
    if (s.head !== 'column') fail(line, 'columns hold column statements');
    const items: Record<string, unknown>[] = [];
    const terminal: string[] = [];
    const widgets: Record<string, unknown>[] = [];
    const notes: string[] = [];
    const joins: Record<string, unknown>[] = [];
    for (const child of line.children) {
      const i = read(child);
      if (i.head === 'join') {
        const [from, to] = i.words;
        if (!from || !to) fail(child, 'a join names two ids: `join a b`');
        joins.push(clean({ from, to, dashed: flag(i, 'dashed'), arrow: flag(i, 'arrow'), right: flag(i, 'right') }));
        continue;
      }
      if (isControl(child)) {
        widgets.push(controlOf(child));
        continue;
      }
      if (i.head === 'line') {
        terminal.push(textOf(i));
        continue;
      }
      if (i.head === 'note' && !i.options.size) {
        notes.push(textOf(i));
        continue;
      }
      if (i.head !== 'item') fail(child, `a column holds item, line, join and control statements: row, ${WIDGETS.join(', ')}`);
      const marks = option(i, 'marks')?.split(',');
      for (const m of marks ?? []) if (!(TONES as readonly string[]).includes(m)) fail(child, `"${m}" is not a tone: write ${TONES.join(', ')}`);
      items.push(
        clean({
          text: textOf(i),
          code: i.texts[0]?.code || undefined,
          id: option(i, 'id'),
          sign: oneOf(i, 'sign', SIGNS),
          mark: oneOf(i, 'mark', TONES),
          marks,
          boxed: i.flags.has('boxed') || undefined,
          strong: flag(i, 'strong'),
          state: state(i),
          emphasis: i.flags.has('emphasis') || undefined,
          fill: flag(i, 'fill'),
        }),
      );
    }
    return clean({
      eyebrow: option(s, 'eyebrow'),
      letter: option(s, 'letter'),
      value: option(s, 'value'),
      title: s.texts[0]?.value,
      sub: option(s, 'sub'),
      id: option(s, 'id'),
      place: oneOf(s, 'place', SIGNS),
      badge: option(s, 'badge'),
      widgets: widgets.length ? widgets : undefined,
      joins: joins.length ? joins : undefined,
      body: option(s, 'body'),
      items: items.length ? items : undefined,
      terminal: terminal.length ? terminal : undefined,
      note: option(s, 'note') ?? (notes.length ? notes.join(' ') : undefined),
      foot: option(s, 'foot'),
      strong: flag(s, 'strong'),
      state: state(s),
      emphasis: s.flags.has('emphasis') || undefined,
    });
  }),
});

const region = (line: Line): Record<string, unknown> => {
  const s = read(line);
  if (!['row', 'column', 'region'].includes(s.head)) fail(line, `"${s.head}" is not a region: write row, column or region`);
  const regions = line.children.filter((c) => !isControl(c));
  const widgets = line.children.filter(isControl).map(controlOf);
  const children = regions.map(region);
  return clean({
    label: s.texts[0]?.value,
    split: s.head === 'region' ? undefined : s.head,
    size: numberOf(s, 'size'),
    surface: oneOf(s, 'surface', ['raised', 'sunken', 'none'] as const),
    lines: numberOf(s, 'lines'),
    marker: option(s, 'marker'),
    state: state(s),
    emphasis: s.flags.has('emphasis') || undefined,
    strong: flag(s, 'strong'),
    hidden: flag(s, 'hidden'),
    head: flag(s, 'head'),
    plain: flag(s, 'plain'),
    flow: oneOf(s, 'flow', ['row', 'column'] as const),
    across: numberOf(s, 'across'),
    icons: numberOf(s, 'icons'),
    widgets: widgets.length ? widgets : undefined,
    children: children.length ? children : undefined,
  });
};

const sketch = (lines: Line[]): Record<string, unknown> => ({
  screens: lines.map((line) => {
    const s = read(line);
    if (s.head !== 'screen') fail(line, 'a sketch holds screen statements');
    /* A `band` under the region is a dashed strip under the screen. */
    const bands = line.children.filter((c) => read(c).head === 'band');
    const [root, ...more] = line.children.filter((c) => !bands.includes(c));
    if (!root || more.length) fail(line, 'a screen holds exactly one region, and a band under it');
    if (bands.length > 1) fail(bands[1] as Line, 'a screen holds one band');
    const b = bands[0];
    const band = b ? clean({ label: read(b).texts[0]?.value, across: numberOf(read(b), 'across'), widgets: b.children.map(controlOf) }) : undefined;
    return clean({ title: s.texts[0]?.value, caption: option(s, 'caption'), weight: numberOf(s, 'weight'), device: flag(s, 'device'), root: region(root as Line), band });
  }),
});

const units = (lines: Line[]): Record<string, unknown> => ({
  rows: lines.map((line) => {
    const s = read(line);
    if (s.head !== 'row') fail(line, 'units hold row statements');
    if (!s.after.length) fail(line, 'a row lists its parts after a colon, or on a `parts …` line under it');
    const parts = s.after.map((t) => {
      if (t.kind === 'word' && Number.isInteger(Number(t.value))) return { count: Number(t.value) };
      if (t.kind === 'option' && (t.key === 'absent' || t.key === 'degraded') && Number.isInteger(Number(t.value))) return { count: Number(t.value), state: t.key };
      return fail(line, 'a part is a count, or absent=count or degraded=count');
    });
    const below = line.children.filter((c) => read(c).head === 'note').map((c) => textOf(read(c)));
    const sub = [option(s, 'sub'), option(s, 'note'), ...below].filter((v): v is string => Boolean(v));
    return clean({ label: textOf(s), sub: sub.length ? sub : undefined, parts, missing: option(s, 'missing'), emphasis: s.flags.has('emphasis') || undefined });
  }),
});

/* A chip in its short form: `A1` filled, `(A1)` outlined, `~A1` bare, with
   `*` after it for the ring and `!` for the emphasis. */
const chipOf = (t: Token, line: Line): Record<string, unknown> => {
  if (t.kind !== 'word') return fail(line, 'a chip is a bare identifier: A1, (A1) or ~A1');
  const m = /^(~?)(\(?)([^()*!~]+)\)?([*!]*)$/.exec(t.value);
  if (!m) return fail(line, `"${t.value}" is not a chip: write A1, (A1) or ~A1, with * or ! after it`);
  return clean({
    id: m[3],
    kind: m[1] ? 'plain' : m[2] ? 'outline' : undefined,
    ring: m[4]?.includes('*') || undefined,
    emphasis: m[4]?.includes('!') || undefined,
  });
};

const subOf = (s: Statement): string[] | undefined => option(s, 'sub')?.split('|').map((x) => x.trim());

const chips = (lines: Line[]): Record<string, unknown> => {
  const groups: Record<string, unknown>[] = [];
  let legend: Record<string, unknown>[] | undefined;
  for (const line of lines) {
    const s = read(line);
    if (s.head === 'legend') {
      legend = [...s.options].map(([kind, v]) =>
        ['filled', 'outline', 'plain', 'ring'].includes(kind) ? { kind, label: v.value } : fail(line, `"${kind}" is not a chip: write filled, outline, plain or ring`),
      );
    } else if (s.head === 'row' || s.head === 'column') {
      const tasks = line.children.filter((c) => read(c).head === 'task').map((c) => textOf(read(c)));
      const more = line.children.filter((c) => read(c).head === 'chips').flatMap((c) => read(c).after);
      groups.push(clean({ label: textOf(s), sub: subOf(s), tasks: tasks.length ? tasks : undefined, chips: [...s.after, ...more].map((t) => chipOf(t, line)) }));
    } else {
      fail(line, `"${s.head}" is not a statement of chips: write row, column or legend`);
    }
  }
  return clean({ groups, legend });
};

const cells = (lines: Line[]): Record<string, unknown> => {
  const groups: Record<string, unknown>[] = [];
  let legend: Record<string, string> | undefined;
  for (const line of lines) {
    const s = read(line);
    if (s.head === 'legend') legend = Object.fromEntries([...s.options].map(([k, v]) => [k, v.value]));
    else if (s.head === 'group') {
      const inline = s.after.map((t) => {
        if (t.kind === 'option' && isSign(t.value)) return { id: t.key, sign: t.value };
        if (t.kind === 'word') return { id: t.value };
        return fail(line, 'a cell is an id, or id=sign');
      });
      /* One cell to a line under the group: its id, then its sign. */
      const below = line.children.map((child) => {
        const [id, mark, ...rest] = child.tokens;
        if (id?.kind !== 'word' || rest.length || (mark && (mark.kind !== 'word' || !isSign(mark.value)))) {
          return fail(child, `a cell is its id and its sign: write F1.1 partly, with a sign of ${SIGNS.join(', ')}`);
        }
        return clean({ id: id.value, sign: mark?.kind === 'word' ? mark.value : undefined });
      });
      const list = [...inline, ...below];
      groups.push(clean({ title: textOf(s), sub: option(s, 'sub'), tone: oneOf(s, 'tone', ['ok', 'warn', 'error'] as const), cells: list }));
    } else fail(line, `"${s.head}" is not a statement of cells: write group or legend`);
  }
  return clean({ groups, legend });
};

const notes = (lines: Line[]): Record<string, unknown> => ({
  notes: lines.map((line) => {
    const s = read(line);
    if (s.head !== 'note' || !s.words[0]) fail(line, 'a note is `note <marker> "Title" body="…"`');
    return clean({ marker: s.words[0], title: textOf(s), body: option(s, 'body') });
  }),
});

/* A part of a composed drawing: its first line names its layout, and the
   lines after it are that layout's. */
const compose = (lines: Line[]): Record<string, unknown> => ({
  parts: lines.map((line) => {
    const s = read(line);
    if (s.head !== 'part') fail(line, 'a composed drawing holds part statements');
    /* A label of the part can stand on a line of its own over its layout. */
    const labels = line.children.filter((c) => read(c).head === 'label' && !c.children.length);
    const [first, ...rest] = line.children.filter((c) => !labels.includes(c));
    if (!first) return fail(line, 'a part needs its layout on the line under it');
    const label = option(s, 'label') ?? (labels[0] ? textOf(read(labels[0])) : undefined);
    return clean({ weight: numberOf(s, 'weight'), label, spec: layoutOf(first, [...first.children, ...rest]) });
  }),
});

const LAYOUTS: Record<string, (lines: Line[]) => Record<string, unknown>> = { flow, sequence, matrix, bars, tiles, columns, sketch, units, chips, cells, notes, compose };

/** The layout a head line names, with its options, over the lines under it. */
function layoutOf(first: Line, body: Line[]): Record<string, unknown> {
  const head = read(first);
  const layout = LAYOUTS[head.head] ?? fail(first, `"${head.head}" is not a layout: write ${Object.keys(LAYOUTS).join(', ')}`);
  const options = clean({
    columns: numbers(head, 'columns'),
    gap: numbers(head, 'gap'),
    max: numberOf(head, 'max'),
    unit: option(head, 'unit'),
    ticks: numbers(head, 'ticks'),
    bands: option(head, 'bands')?.split(',').map((b) => b.trim()),
    axis: option(head, 'axis'),
    lines: numberOf(head, 'lines'),
    head: option(head, 'head'),
    key: option(head, 'key'),
    height: numberOf(head, 'height'),
    labelWidth: numberOf(head, 'label-width'),
    rowGroups: oneOf(head, 'row-groups', ['over', 'beside'] as const),
    notesOutside: oneOf(head, 'notes', ['outside'] as const) === 'outside' || undefined,
    direction: head.head === 'compose' ? oneOf(head, 'direction', ['row', 'column'] as const) : oneOf(head, 'direction', ['rows', 'columns'] as const),
    across: numberOf(head, 'across'),
    figures: head.flags.has('figures') || undefined,
    left: head.head === 'matrix' ? head.flags.has('left') || undefined : undefined,
    blocks: head.head === 'matrix' ? head.flags.has('blocks') || undefined : undefined,
    chain: head.flags.has('chain') || undefined,
    rise: head.flags.has('rise') || undefined,
    heads: head.head === 'sketch' ? head.flags.has('heads') || undefined : undefined,
    boxed: head.head === 'cells' ? head.flags.has('boxed') || undefined : undefined,
    bare: head.head === 'columns' ? head.flags.has('bare') || undefined : undefined,
    centred: head.head === 'columns' ? head.flags.has('centred') || undefined : undefined,
    aside: head.head === 'tiles' ? head.flags.has('aside') || undefined : undefined,
    ids: head.head === 'matrix' ? head.flags.has('ids') || undefined : undefined,
    rules: head.head === 'matrix' ? head.flags.has('rules') || undefined : undefined,
    rows: head.head === 'columns' ? option(head, 'rows')?.split(',').map((r) => r.trim()) : undefined,
    fan: head.flags.has('fan') || undefined,
    curve: head.flags.has('curve') || undefined,
    even: head.head === 'flow' ? head.flags.has('even') || undefined : undefined,
  });
  if (head.head === 'tiles' && options.columns) Object.assign(options, { columns: options.columns[0] });
  if (head.head === 'compose' && options.gap) Object.assign(options, { gap: options.gap[0] });
  return { kind: head.head, ...options, ...layout(body) };
}

/** The spec a text describes. Throws with the line number on anything it
    cannot read. The drawing's own checks run in `diagram()`. */
export const parse = (text: string): DiagramSpec => {
  const [first, ...rest] = tree(text);
  if (!first) throw new Error('line 1: the text is empty — start with the layout, for example `flow`');
  const head = read(first);
  let title: string | undefined;
  let description: string | undefined;
  const body: Line[] = [...first.children];
  for (const line of rest) {
    const s = read(line);
    if (s.head === 'title') title = textOf(s);
    else if (s.head === 'description') description = textOf(s);
    else body.push(line);
  }
  if (!LAYOUTS[head.head]) fail(first, `"${head.head}" is not a layout: write ${Object.keys(LAYOUTS).join(', ')}`);
  if (!title) fail(first, 'a diagram needs a `title "…"` line: it is the accessible name of the file');
  if (!description) fail(first, 'a diagram needs a `description "…"` line: it is what a reader who cannot see the drawing gets');
  const spec = layoutOf(first, body);
  const claim = oneOf(head, 'claim', ['accent', 'error', 'warn', 'ok'] as const);
  const room = numbers(head, 'slide');
  if (room && room.length !== 2) fail(first, 'slide=width,height names the room of a slide');
  return clean({ ...spec, title, description, claim, slide: room ? { width: room[0], height: room[1] } : undefined }) as unknown as DiagramSpec;
};
