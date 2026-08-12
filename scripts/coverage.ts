#!/usr/bin/env node
/* Where a component has to be visible, and what an implementation may invent.

     node scripts/coverage.ts        (step 2b of `make verify`)

   A component that exists only in `src/` is a component the next person
   writes again. Three surfaces have to show it, and each answers a different
   question:

     the story        — what it is and which variants it has. The story is
                        also the source the specimen card is generated from,
                        so a component without one has no card either.
     the class layer  — every name the stylesheets define is drawn somewhere.
                        A name nothing shows is a name nobody can check, and
                        it rots in silence.
     the Guides render — the document layer under a real renderer, with real
                        prose around it. It is where a component meets the
                        markup it does not control, and that is a different
                        proof from a specimen that was composed for it.

   And one rule for whoever builds on the system rather than in it: an
   implementation follows the page layouts. It writes no class the stylesheets
   do not define, and it builds its page out of the shell every screen shares
   — otherwise the layout exists twice, and the second copy is the one nothing
   keeps true.

   What counts as shown is deliberately generous, because the alternative is a
   check people work around: a class counts if a story, a card, a documentation
   page or an element that emits it names it. A class an element writes at
   runtime is drawn wherever that element is, and the element's own story is
   where it is looked at. */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

import { ROOT, SPECIMENS } from './lib/cards.ts';
import { TAGS } from '../src/index.ts';

const THEME = join(ROOT, 'guides-theme');

/* What the rule does not hold for yet.

   The list only shrinks. An entry that has become covered fails as loudly as
   one that is missing, so it cannot quietly outlive the work it stands for —
   which is what turns it into a work list rather than an exemption. */
const PENDING = {
  stories: [] as string[],
  /* Named in the stylesheets, drawn nowhere. The syntax colours are written by
     the highlighter rather than by a template, and the loading state and the
     two size-by-class escape hatches were declared ahead of a specimen. */
  classes: [
    'sds-code__key',
    'sds-code__string',
    'sds-h1',
    'sds-icon--20',
    'sds-loading',
    'sds-loading__label',
  ],
  /* Not in the Guides render. Each of these needs either a node the renderer
     already emits or a directive of the theme's own, and until it has one
     there is no page where it can be looked at in prose.

     "The render" is what the pages hold, not what the templates spell. An
     element the theme addresses brings everything it draws with it — the
     search on every page draws its own hits and its own empty state, and a
     figure draws the viewer it opens into — so those are covered by the
     element that draws them and left this list when the theme stopped
     rebuilding components and started addressing them. */
  guides: [
    'sds-button',
    'sds-field',
    'sds-field-error',
    'sds-checkbox',
    'sds-radio-group',
    'sds-form-errors',
    'sds-pills',
    'sds-accordion',
    'sds-surface',
    'sds-stat',
    'sds-overlay',
    'sds-modal',
    'sds-drawer',
    'sds-dialog',
    'sds-pagination',
    'sds-diff',
    'sds-quote',
    'sds-byline',
  ],
  /* Classes the theme writes that no stylesheet defines. `sds-confval` is a
     hook in this system's own namespace with nothing behind it, and it is
     decided by defining the name or dropping it, not by a template that keeps
     writing it. `footnote-ref` was the second and took the other answer: the
     mark is a `<sup>` with a link in it, both of which the document layer
     already sets, so the name went. */
  themeClasses: ['sds-confval'],
};

/* The shell every page layout under `specimens/screens/` is built out of: the
   frame, the bar, and the two bodies a page can have — a column beside a rail,
   or a run of full-bleed bands. An implementation that draws a page uses
   these. One that invents its own frame has left the system, and the pages it
   renders drift from the screens the system ships. */
const SHELL = ['sds-app', 'sds-shell', 'sds-bar', 'sds-body', 'sds-column', 'sds-bands', 'sds-band'];

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
  read(walk(join(ROOT, 'src', 'components'), ['.ts'])),
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

console.log('   a story for every element');
const hasStory = (tag: string): boolean => stories.includes(tag);
let missing = pending(PENDING.stories, hasStory, 'stories');
for (const tag of TAGS) {
  if (!hasStory(tag) && !missing.has(tag)) fails.push(`${tag}: no story names it — every element is shown in Storybook`);
}
console.log(`   ${TAGS.filter(hasStory).length} of ${TAGS.length} elements`);

console.log('   every class the system defines is drawn somewhere');
const classes = [
  ...new Set(
    [...readFileSync(join(ROOT, 'src/styles/components.css'), 'utf8').matchAll(/\.(sds-[\w-]*)/g)]
      .map((m) => m[1] as string),
  ),
].sort();
const isDrawn = (cls: string): boolean => shown.includes(cls);
missing = pending(PENDING.classes, isDrawn, 'classes');
for (const cls of classes) {
  if (!isDrawn(cls) && !missing.has(cls)) fails.push(`.${cls} is defined but no story, card, page or element draws it`);
}
console.log(`   ${classes.filter(isDrawn).length} of ${classes.length} classes`);

console.log('   every element appears in the Guides render');

/* What each element renders, read out of its own source. A template that
   names an element puts everything that element draws on the page too, and
   since the theme was changed to *address* components rather than rebuild
   them, that is where most of them now arrive: nothing writes `<sds-link>`
   any more, `sds-footer` does, and the footer is on every page. Following the
   composition is what keeps this check saying "is it in the render" rather
   than "is its name in a Twig file", which is not the same question and was
   only ever the same by accident. */
const emitted = new Map<string, string[]>();
for (const file of walk(join(ROOT, 'src', 'components'), ['.ts'])) {
  const source = readFileSync(file, 'utf8');
  const defines = source.match(/define\('(sds-[a-z-]+)'/);
  if (!defines?.[1]) continue;
  /* Comments first, and they are the whole reason this is not a plain match:
     the sources here name other elements constantly in prose — what a
     component deliberately is not, what its neighbour calls the same option —
     and reading those as composition would credit half the system to any file
     that explains itself. What is left is markup. */
  const markup = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
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
for (const tag of TAGS) {
  if (!inGuides(tag) && !missing.has(tag)) {
    fails.push(`${tag}: neither a template emits it nor the fixture asks for it — it is untested in a document`);
  }
}
console.log(`   ${TAGS.filter(inGuides).length} of ${TAGS.length} elements, ${PENDING.guides.length} pending`);

console.log('   the theme writes no name the system does not define');
const defined = new Set<string>();
for (const sheet of ['src/styles/components.css', 'src/styles/_specimen.css', 'src/styles/document.css']) {
  for (const m of readFileSync(join(ROOT, sheet), 'utf8').matchAll(/\.([a-zA-Z][\w-]*)/g)) defined.add(m[1] as string);
}
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
console.log(`   ${written.size} classes in ${templates.length} templates, ${PENDING.themeClasses.length} undefined`);

console.log('   the theme builds its pages out of the page layouts');
for (const cls of SHELL) {
  if (!theme.includes(cls)) {
    fails.push(`the theme names no .${cls} — a page is built out of the shell the screens share, not one of its own`);
  }
}
console.log(`   ${SHELL.filter((c) => theme.includes(c)).length} of ${SHELL.length} shell classes`);

if (fails.length) {
  for (const f of fails) console.log(`   ✗ ${f}`);
  process.exit(1);
}
