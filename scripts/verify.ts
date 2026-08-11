#!/usr/bin/env node
/* The repo's own gate. Run it before shipping anything.

   Six things have to hold, and each has gone wrong at least once:
     1. every card declares a @dsCard header the Design System pane can read
     2. no card uses a class the stylesheets do not define — a silent no-op
     3. every local href/src resolves; a card that ships unstyled looks fine
        in review and wrong everywhere else
     4. every card fits the viewport it declares, and still renders
     5. every card matches the story it comes from — and every card on disk
        has one, so a file cannot outlive the story that wrote it
     6. the types the components and the generator share still hold

     make verify
*/
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { cards, ROOT, screens } from './lib/cards.ts';

const fails: string[] = [];

/** The marker has to be the very first line, so that is what is tested. */
const firstLine = (text: string): string => text.split('\n', 1)[0] ?? '';
const list = cards();
const sp = screens();
/* Screens go through the same checks as cards: they ship with the system and
   are what a consuming project seeds a new design from. */
const all = [...list, ...sp];

/* fonts/ and assets/icons/ are generated from npm packages and gitignored.
   A clone that skipped `npm ci` has neither, and every card then renders in
   system-ui with no icons — which looks like a design bug and is not one. */
console.log('0. generated assets');
const GENERATED: readonly (readonly [dir: string, fix: string])[] = [
  ['fonts', 'make fonts'],
  ['assets/icons', 'make icons'],
];
for (const [dir, script] of GENERATED) {
  const n = existsSync(join(ROOT, dir)) ? readdirSync(join(ROOT, dir)).length : 0;
  console.log(`   ${dir}: ${n} files`);
  if (n === 0) fails.push(`${dir}/ is empty or missing — run \`${script}\``);
}

/* The drawings' viewBoxes and shapes are read out of the files into two
   modules. A recomposed drawing that did not go through `make diagrams` ships
   a wrapper sized to the old coordinate system — squashed by a fraction, and
   nothing else would notice. */
console.log('0b. the diagram modules match the drawings');
const dia = spawnSync(process.execPath, [join(ROOT, 'scripts/diagrams.ts'), '--check'], { encoding: 'utf8' });
process.stdout.write(dia.stdout);
process.stdout.write(dia.stderr ?? '');
if (dia.status !== 0) fails.push('src/components/diagrams*.generated.ts is out of date — run `make diagrams`');

console.log('1. @dsCard headers');
for (const c of list) {
  if (!/^<!--\s*@dsCard\s+group="[^"]*"[^>]*-->/.test(firstLine(c.text))) {
    fails.push(`${c.rel}: first line is not a @dsCard comment`);
  }
}
for (const s of sp) {
  if (!/^<!--\s*@startingPoint\s+section="[^"]*"[^>]*-->/.test(firstLine(s.text))) {
    fails.push(`${s.rel}: first line is not a @startingPoint comment`);
  }
}
console.log(`   ${list.length} cards, ${sp.length} starting points`);

/* An MDX page iframes a card at a height it states itself, and the card
   states its own in `@dsCard`. Nothing tied the two together, so a card that
   grew kept rendering into the old box in Storybook — cropped there and
   correct in the pane, which is the worst way to be wrong. Three had already
   drifted when this was added. */
console.log('1b. specimen heights match their cards');
const declared = new Map(all.map((c) => [c.rel, c.viewport]));
let mismatched = 0;
for (const page of readdirSync(join(ROOT, 'docs')).filter((f) => f.endsWith('.mdx'))) {
  const text = readFileSync(join(ROOT, 'docs', page), 'utf8');
  for (const m of text.matchAll(/<Specimen\s+src="([^"]+)"\s+viewport="(\d+x\d+)"/g)) {
    const [, src = '', vp = ''] = m;
    const want = declared.get(src);
    if (want && want !== vp) {
      mismatched++;
      fails.push(`docs/${page}: ${src} is embedded at ${vp}, the card declares ${want}`);
    }
  }
}
console.log(`   ${declared.size} cards, ${mismatched} embedded at the wrong height`);

console.log('2. class vocabulary');
const defined = new Set();
/* All three sheets, including the one `styles.css` deliberately does not
   import: a name is defined by the system if some sheet in the system defines
   it, and a card that used a document-layer name and was told it does not
   exist would be told a lie about its own repo. */
for (const sheet of ['src/styles/components.css', 'src/styles/_specimen.css', 'src/styles/document.css']) {
  for (const m of readFileSync(join(ROOT, sheet), 'utf8').matchAll(/\.([a-zA-Z][\w-]*)/g)) {
    defined.add(m[1]);
  }
}
/* Every class in every card and screen is checked against the stylesheets,
   with no exemption.

   There used to be one: a screen could carry a `<style>` block and the names
   it defined counted as defined. That was the escape hatch a page's own
   layout went through — and while it was open, a name in it was a name no
   other surface could use and nothing could keep true. Nothing has a
   `<style>` now, so the exemption is gone rather than merely unused. */
const used = new Map<string, string[]>();
for (const c of all) {
  if (c.text.includes('<style>')) {
    fails.push(`${c.rel}: carries a <style> block — layout belongs in components.css, not in a generated file`);
  }
  for (const m of c.text.matchAll(/class="([^"]*)"/g)) {
    for (const cls of (m[1] ?? '').split(/\s+/).filter(Boolean)) {
      const where = used.get(cls) ?? [];
      where.push(c.rel);
      used.set(cls, where);
    }
  }
}
/* Names that are markers rather than hooks.

   `language-*` is the fence's grammar, written onto the `<code>` by the code
   block the way every Markdown renderer writes it — it says what the block is
   for anything that reads the DOM, and the colour is on the `hljs-` spans
   inside it. There is nothing for it to be defined as, and it is the only
   class in the system that is deliberately not a style. */
const MARKERS = [/^language-[\w-]+$/];

let unknown = 0;
for (const [cls, where] of [...used].sort()) {
  if (MARKERS.some((rx) => rx.test(cls))) continue;
  if (!defined.has(cls)) {
    unknown++;
    fails.push(`class "${cls}" is used in ${where.length} file(s) but defined in no stylesheet (first: ${where[0]})`);
  }
}
console.log(`   ${used.size} distinct classes used, ${defined.size} defined, ${unknown} unknown`);

console.log('3. local references');
let refs = 0, broken = 0;
for (const c of all) {
  // Only real attributes: escaped example markup (&lt;link href="…"&gt;) is documentation.
  const real = c.text.replace(/&lt;[\s\S]*?&gt;/g, '');
  for (const m of real.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const ref = m[1];
    if (!ref || /^(https?:|data:|#)/.test(ref)) continue;
    refs++;
    if (!existsSync(resolve(dirname(c.path), ref))) {
      broken++;
      fails.push(`${c.rel}: ${ref} does not resolve`);
    }
  }
}
console.log(`   ${refs} references, ${broken} broken`);

console.log('4. render + fit');
const fit = spawnSync(process.execPath, [join(ROOT, 'scripts/fit.ts')], { encoding: 'utf8' });
process.stdout.write(fit.stdout.split('\n').filter((l) => l.includes('CROPPED') || l.includes('cards,')).map((l) => `  ${l.trim()}\n`).join(''));
if (fit.status !== 0) fails.push('some cards are cropped by the viewport they declare (see above)');

/* Every element renders in Node, not only the seven that appear in a card.
   See scripts/ssr.ts for why that is the rule and what it does not prove. */
console.log('4b. every element renders under SSR');
const ssr = spawnSync(process.execPath, [join(ROOT, 'scripts/ssr.ts')], { encoding: 'utf8' });
process.stdout.write(ssr.stdout);
if (ssr.status !== 0) fails.push('an element cannot be rendered outside a browser (see above)');

/* The seven component cards are generated from their stories. A card edited
   by hand looks fine in review and is silently reverted by the next
   `make cards` — so a stale card is a failure, not a warning. */
/* The drop-in is committed, so it can go stale against its own source. */
console.log('4c. the committed drop-in matches its source');
const dist = spawnSync(process.execPath, [join(ROOT, 'scripts/dist.ts'), '--check'], { encoding: 'utf8' });
process.stdout.write((dist.stdout ?? '').split('\n').filter((l) => l.includes('out of date') || l.includes('✗')).map((l) => `${l}\n`).join(''));
if (dist.status !== 0) fails.push('dist/ is out of date — run `make dist` and commit it');

console.log('5. every card matches its story, and has one');
const gen = spawnSync(process.execPath, [join(ROOT, 'scripts/cards.ts'), '--check'], { encoding: 'utf8' });
process.stdout.write(
  gen.stdout.split('\n')
    .filter((l) => l.includes('STALE') || l.includes('ORPHAN') || l.includes('generated cards'))
    .map((l) => `  ${l.trim()}\n`).join(''),
);
if (gen.status !== 0) fails.push('a card no longer matches its story, or has none — see above, and run `make cards`');

/* Types are the contract the components and the card generator share. Node
   strips them without checking them, so nothing else would ever notice. */
console.log('6. types');
const tsc = spawnSync(process.execPath, [join(ROOT, 'node_modules/typescript/bin/tsc'), '--noEmit'], { encoding: 'utf8' });
const tscOut = (tsc.stdout ?? '').trim();
console.log(`   ${tscOut ? tscOut.split('\n').length : 0} type error(s)`);
if (tsc.status !== 0) {
  process.stdout.write(tscOut.split('\n').slice(0, 10).map((l) => `  ${l}\n`).join(''));
  fails.push('typecheck failed (see above)');
}

console.log('7. conventions header');
const conv = spawnSync(process.execPath, [join(ROOT, 'scripts/conventions.ts')], { encoding: 'utf8' });
process.stdout.write(conv.stdout);
if (conv.status !== 0) fails.push('conventions.md names something the build no longer defines (see above)');

console.log();
if (fails.length) {
  console.log(`✗ ${fails.length} problem(s):`);
  for (const f of fails) console.log('  -', f);
  process.exit(1);
}
console.log('✓ design system is consistent');
