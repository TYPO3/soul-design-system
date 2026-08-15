#!/usr/bin/env node
/* Where a component has to be visible, and what an implementation may invent.

   A component that exists only in `src/` is one the next person writes again.
   Three surfaces have to show it: the story, which the card is generated from;
   the class layer, where a name nothing draws rots unchecked; and the Guides
   render, where it meets markup it does not control.

   And one rule for whoever builds on the system: an implementation follows the
   page layouts and invents no class, or the layout exists twice. What counts as
   shown is deliberately generous — else this is a check people work around. */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

import { FRONTEND, ROOT, SPECIMENS } from './lib/cards.ts';
import { TAGS } from '../packages/frontend/src/index.ts';
import * as report from './lib/report.ts';

const THEME = join(ROOT, 'packages', 'guides-theme');

/* What the rule does not hold for yet.

   The list only shrinks. An entry that has become covered fails as loudly as
   one that is missing, so it cannot quietly outlive the work it stands for —
   which is what turns it into a work list rather than an exemption. */
const PENDING = {
  stories: [] as string[],
  classes: [] as string[],
  /* Not in the Guides render yet: each needs a node the renderer emits or a
     directive of the theme's own before there is a page to look at it in.
     "The render" is what the pages hold, not what the templates spell — an
     element the theme addresses brings everything it draws with it, so a
     figure's viewer is covered by the figure. */
  guides: [] as string[],
  themeClasses: [] as string[],
};

/* What a document has no node for — not a work list, and never becomes one.

   A manual has no form to fill in, no application chrome and no page numbers.
   Held to `PENDING`'s discipline from the other side: one of these turning up
   in the render is this classification being wrong, and the check says so. */
const ELSEWHERE = [
  /* A page is read, not filled in. The bar's search draws `.sds-field`, which
     is the class layer's name and not this element. */
  'sds-field',
  'sds-field-group',
  'sds-field-error',
  'sds-checkbox',
  'sds-radio',
  'sds-form-errors',
  /* Something a page opens over itself, which a document does not do. */
  'sds-modal',
  'sds-dialog',
  /* A wall of glyphs is an index of an asset set, which a manual page is not.
     A document that wanted one would be a catalog with prose round it, and
     that is a product surface — see `Pages/Catalog`. */
  'sds-icon-tile',
  /* The bar draws its own row of pills, as `sds-nav-main`'s content. A second
     one standing in a document would be a second navigation. */
  'sds-nav-pills',
  /* Numbered pages. The way on from a manual page is `sds-nav-pager` — the tree
     read in order, rather than one list cut into pages. */
  'sds-nav-pagination',
];

/* The shell every page layout under `specimens/screens/` is built out of: the
   frame, the bar, and the two bodies a page can have — a column beside a rail,
   or a run of full-bleed bands. An implementation that draws a page uses
   these. One that invents its own frame has left the system, and the pages it
   renders drift from the screens the system ships.

   The bar is the one of them that is addressed rather than written: what a
   header does as it runs out of room is measured, and a template that spelled
   `.sds-bar` by hand would be a row that cannot fold. */
const SHELL = ['sds-app', 'sds-shell', 'sds-nav-main', 'sds-body', 'sds-column', 'sds-bands', 'sds-band'];

function walk(dir: string, exts: readonly string[]): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...walk(path, exts));
    else if (exts.includes(extname(path))) out.push(path);
  }
  return out;
}

const read = (files: readonly string[]): string => files.map((f) => readFileSync(f, 'utf8')).join('\n');

/* Twig comments are prose about the template and name things the template does
   not write — the core class it replaces, the element it deliberately is not.
   Reading them as markup makes every explanation a violation. */
const uncomment = (twig: string): string => twig.replace(/\{#[\s\S]*?#\}/g, '');

const stories = read(walk(join(ROOT, 'stories'), ['.ts']));
const shown = [
  stories,
  read(walk(join(ROOT, 'docs'), ['.mdx', '.rst', '.html'])),
  read(walk(join(ROOT, SPECIMENS), ['.html'])),
  /* An element's own source: the classes it emits are drawn wherever it is. */
  read(walk(join(FRONTEND, 'src', 'components'), ['.ts'])),
].join('\n');

const templates = walk(join(THEME, 'resources', 'template'), ['.twig']);
const theme = uncomment(read(templates));
/* Only the fixture's own documents. `acceptance/_cards/` is a copy of the
   specimen cards, put there so a guideline page can embed one — a component
   that appears only in a copied card was never rendered by the theme. */
const fixture = read(walk(join(THEME, 'acceptance'), ['.rst']).filter((f) => !f.includes('_cards')));

const fails: string[] = [];

/* An entry stays on a pending list only as long as it is true. */
function pending(list: readonly string[], covered: (name: string) => boolean, axis: string): Set<string> {
  for (const name of list) {
    if (covered(name)) fails.push(`${name} is covered now — remove it from PENDING.${axis} in scripts/coverage.ts`);
  }
  return new Set(list);
}

/* Six questions, each its own row and its own numbers. `fails` is the whole
   run's, so an axis owns whatever was added while it ran — which is what lets
   the row that failed be the row the findings sit under. */
const AXES = [
  { name: 'stories', label: 'a story for every element' },
  { name: 'classes', label: 'every class the system defines is drawn' },
  { name: 'render', label: 'every element appears in the Guides render' },
  { name: 'parts', label: 'the theme names no component\u2019s own part' },
  { name: 'vocabulary', label: 'the theme writes no name the system does not define' },
  { name: 'shell', label: 'the theme builds its pages out of the page layouts' },
];
report.align(AXES);
report.open('coverage', 'every component is shown');

let told = 0;
function axis(name: string, facts: string): void {
  const found = fails.slice(told);
  told = fails.length;
  report.row(found.length ? 'bad' : 'ok', name, AXES.find((a) => a.name === name)?.label ?? name, facts);
  for (const f of found) report.detail(f);
}

const hasStory = (tag: string): boolean => stories.includes(tag);
let missing = pending(PENDING.stories, hasStory, 'stories');
for (const tag of TAGS) {
  if (!hasStory(tag) && !missing.has(tag)) fails.push(`${tag}: no story names it — every element is shown in Storybook`);
}
axis('stories', `${TAGS.filter(hasStory).length} of ${TAGS.length} elements`);

/** Every stylesheet the system has, the file-per-component among them. Read
    from the directory: a list by hand goes stale at the next component. */
function stylesheets(dir = join(FRONTEND, 'src/styles')): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? stylesheets(path) : entry.name.endsWith('.css') ? [path] : [];
  });
}

/* The specimen chrome and the document layer are not the class vocabulary a
   design draws with, so what has to be *shown* is read without them. */
const drawn = stylesheets().filter((f) => !/_specimen\.css|document\.css/.test(f));

const classes = [
  ...new Set(
    [...read(drawn).matchAll(/\.(sds-[\w-]*)/g)].map((m) => m[1] as string),
  ),
].sort();
const isDrawn = (cls: string): boolean => shown.includes(cls);
missing = pending(PENDING.classes, isDrawn, 'classes');
for (const cls of classes) {
  if (!isDrawn(cls) && !missing.has(cls)) fails.push(`.${cls} is defined but no story, card, page or element draws it`);
}
axis('classes', `${classes.filter(isDrawn).length} of ${classes.length} classes`);

/* What each element renders, read out of its own source: a template naming an
   element puts everything that element draws on the page too, which is how most
   of them arrive now that the theme addresses components rather than rebuilding
   them. Following the composition keeps this asking "is it in the render"
   rather than "is its name in a template". */
const emitted = new Map<string, string[]>();

/* What a helper under `src/lib/` writes on the element's behalf, read as the
   element's own markup. A part two components share is a module rather than a
   copy in each, and without this, extracting one would take whatever it draws
   out of the render while the page it produces stays exactly the same. */
const helped = (source: string): string =>
  [...source.matchAll(/from '\.\.\/lib\/([\w.-]+)'/g)]
    .map((m) => join(FRONTEND, 'src', 'lib', m[1] as string))
    .filter((path) => existsSync(path))
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n');

for (const file of walk(join(FRONTEND, 'src', 'components'), ['.ts'])) {
  const source = readFileSync(file, 'utf8');
  const defines = source.match(/define\('(sds-[a-z-]+)'/);
  if (!defines?.[1]) continue;
  /* Comments first, and they are the whole reason this is not a plain match:
     the sources here name other elements constantly in prose — what a
     component deliberately is not, what its neighbour calls the same option —
     and reading those as composition would credit half the system to any file
     that explains itself. What is left is markup. */
  const markup = `${source}\n${helped(source)}`.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  emitted.set(
    defines[1],
    [...markup.matchAll(/<(sds-[a-z-]+)/g)].map((m) => m[1] as string),
  );
}

/* One walk out from what the theme names, so an element three deep in a
   composition is credited the same as one the template wrote itself. */
const reached = new Set<string>();
const follow = (tag: string): void => {
  if (reached.has(tag)) return;
  reached.add(tag);
  for (const next of emitted.get(tag) ?? []) follow(next);
};
for (const tag of TAGS) if (theme.includes(tag) || fixture.includes(tag)) follow(tag);

const inGuides = (tag: string): boolean => reached.has(tag);
missing = pending(PENDING.guides, inGuides, 'guides');
const elsewhere = new Set(ELSEWHERE);
for (const tag of ELSEWHERE) {
  if (inGuides(tag)) {
    fails.push(
      `${tag} is in the render — it is not outside a document after all. ` +
        'Say where it belongs in scripts/coverage.ts rather than leaving it in ELSEWHERE.',
    );
  }
}
for (const tag of TAGS) {
  if (!inGuides(tag) && !missing.has(tag) && !elsewhere.has(tag)) {
    fails.push(`${tag}: neither a template emits it nor the fixture asks for it — it is untested in a document`);
  }
}
axis(
  'render',
  `${TAGS.filter(inGuides).length} of ${TAGS.length} elements` +
    ` \u00b7 ${PENDING.guides.length} pending \u00b7 ${ELSEWHERE.length} outside a document`,
);

/* A part belongs to the element that draws it and to nothing else. A template
   writing `sds-card__body` has made that name public API: the card can then
   move nothing without the theme changing in the same commit. Only parts of
   elements that exist — `sds-bar__end` names no component, that being the class
   layer's vocabulary, which the theme may write. */
for (const m of theme.matchAll(/\b(sds-[a-z-]+)__[a-z-]+/g)) {
  const owner = m[1] as string;
  /* `TAGS` is a tuple of literals, so the tag has to be widened to be asked
     about at all — the question is whether a string is one of them, which is
     exactly what the narrow type will not let a caller ask. */
  if (!(TAGS as readonly string[]).includes(owner)) continue;
  fails.push(
    `${m[0]}: a template writes a part of <${owner}>. The part is the element\u2019s — ` +
      'address the element and let it draw its own markup.',
  );
}

axis('parts', `${templates.length} templates`);

const defined = new Set<string>();
for (const m of read(stylesheets()).matchAll(/\.([a-zA-Z][\w-]*)/g)) defined.add(m[1] as string);
const written = new Set<string>();
for (const m of theme.matchAll(/class="([^"]*)"/g)) {
  /* Half of these attributes are composed at render time. The literal parts
     of one are still names and are checked; what an expression evaluates to is
     not knowable here, so the expression is dropped and what is left has to
     look like a class name — an attribute this cannot read is not a licence to
     invent one, it is simply out of reach of this check. */
  const literal = (m[1] ?? '').replace(/\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}/g, ' ');
  for (const cls of literal.split(/\s+/)) {
    if (/^[a-zA-Z][\w-]*$/.test(cls)) written.add(cls);
  }
}
/* `language-*` is the fence's grammar rather than a hook — the name every
   Markdown renderer writes onto a `<code>`, and the one class in the system
   that is deliberately not a style. The card check exempts it for the same
   reason; here the language is a binding, so only the stem is left to see. */
const MARKER = /^language-/;
missing = pending(PENDING.themeClasses, (cls) => !written.has(cls) || defined.has(cls), 'themeClasses');
for (const cls of [...written].sort()) {
  if (MARKER.test(cls)) continue;
  if (!defined.has(cls) && !missing.has(cls)) {
    fails.push(`the theme writes class "${cls}", which no stylesheet defines — close the gap in the system, not in the template`);
  }
}
axis('vocabulary', `${written.size} classes \u00b7 ${PENDING.themeClasses.length} undefined`);
for (const cls of SHELL) {
  if (!theme.includes(cls)) {
    fails.push(`the theme names no .${cls} — a page is built out of the shell the screens share, not one of its own`);
  }
}
axis('shell', `${SHELL.filter((c) => theme.includes(c)).length} of ${SHELL.length} shell classes`);

report.summary(`${TAGS.length} elements \u00b7 ${classes.length} classes \u00b7 ${templates.length} templates`, fails, { shown: true });
process.exit(fails.length ? 1 : 0);
