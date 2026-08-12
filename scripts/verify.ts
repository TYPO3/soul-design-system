#!/usr/bin/env node
/* The repo's own gate. Run it before shipping anything.

   Each check has a name and `--help` lists them; naming any runs only those —
   `make verify ARGS="refs fit"`. A partial run says so in its last line and
   never claims consistency, and an unrecognised name is an error: a filtered
   run that silently checked nothing reads exactly like a clean one.

   The build runs first, but only for `conventions`, the one check that reads
   `ds-bundle/`. That is also why arguments are passed directly rather than
   through a `sh -c` wrapper, where the filter would land on the shell. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { FRONTEND, cards, ROOT, screens } from './lib/cards.ts';

const fails: string[] = [];

/** The marker has to be the very first line, so that is what is tested. */
const firstLine = (text: string): string => text.split('\n', 1)[0] ?? '';
const list = cards();
const sp = screens();
/* Screens go through the same checks as cards: they ship with the system and
   are what a consuming project seeds a new design from. */
const all = [...list, ...sp];

interface Check {
  /** How it is asked for: `make verify ARGS=classes`. */
  name: string;
  /** The place in the sequence. Not derivable from the order — the letters
      are where a check was added between two that were already numbered. */
  step: string;
  /** What it holds, in the line it prints and in `--help`. */
  label: string;
  /** Reads `ds-bundle/`, so selecting it is what makes the build run. */
  bundle?: true;
  run: () => void;
}

/* Every check, in the order the gate runs them. Nothing here reads a value
   another one computed — a check is the unit that can be run alone. */
const CHECKS: readonly Check[] = [
  /* fonts/ and assets/icons/ are generated from npm packages and gitignored.
     A clone that skipped `npm ci` has neither, and every card then renders in
     system-ui with no icons — which looks like a design bug and is not one. */
  {
    name: 'assets',
    step: '0',
    label: 'generated fonts and icons are present',
    run() {
      const GENERATED: readonly (readonly [dir: string, fix: string])[] = [
        ['fonts', 'make fonts'],
        ['assets/icons', 'make icons'],
      ];
      for (const [dir, script] of GENERATED) {
        const n = existsSync(join(FRONTEND, dir)) ? readdirSync(join(FRONTEND, dir)).length : 0;
        console.log(`   ${dir}: ${n} files`);
        if (n === 0) fails.push(`${dir}/ is empty or missing — run \`${script}\``);
      }
    },
  },

  /* The drawings' viewBoxes and shapes are read out of the files into two
     modules. A recomposed drawing that did not go through `make diagrams`
     ships a wrapper sized to the old coordinate system — squashed by a
     fraction, and nothing else would notice. */
  {
    name: 'diagrams',
    step: '0b',
    label: 'the modules match the drawings',
    run() {
      const dia = spawnSync(process.execPath, [join(ROOT, 'scripts/diagrams.ts'), '--check'], { encoding: 'utf8' });
      process.stdout.write(dia.stdout);
      process.stdout.write(dia.stderr ?? '');
      if (dia.status !== 0) fails.push('packages/frontend/src/components/diagrams*.generated.ts is out of date — run `make diagrams`');
    },
  },

  {
    name: 'headers',
    step: '1',
    label: '@dsCard and @startingPoint',
    run() {
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
    },
  },

  /* An MDX page iframes a card at a height it states itself, and the card
     states its own in `@dsCard`. Nothing tied the two together, so a card that
     grew kept rendering into the old box in Storybook — cropped there and
     correct in the pane, which is the worst way to be wrong. Three had already
     drifted when this was added. */
  {
    name: 'heights',
    step: '1b',
    label: 'specimens match the cards they embed',
    run() {
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
    },
  },

  {
    name: 'classes',
    step: '2',
    label: 'every name used is defined',
    run() {
      const defined = new Set();
      /* All three sheets, including the one `styles.css` deliberately does not
         import: a name is defined by the system if some sheet in the system
         defines it, and a card that used a document-layer name and was told it
         does not exist would be told a lie about its own repo. */
      for (const sheet of ['src/styles/components.css', 'src/styles/_specimen.css', 'src/styles/document.css']) {
        for (const m of readFileSync(join(FRONTEND, sheet), 'utf8').matchAll(/\.([a-zA-Z][\w-]*)/g)) {
          defined.add(m[1]);
        }
      }
      /* Every class in every card and screen, against the stylesheets, with no
         exemption. A `<style>` block whose names counted as defined would be
         the escape hatch a page's own layout goes through, and a name in one is
         a name no other surface can use. */
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
      /* Names that are markers rather than hooks. `language-*` is the fence's
         grammar, written onto the `<code>` the way every Markdown renderer
         writes it: it says what the block is for anything reading the DOM, and
         the colour is on the `hljs-` spans inside. There is nothing for it to
         be defined as — the one class here deliberately not a style. */
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
    },
  },

  /* The other direction of the same rule. `classes` catches a name that is
     used and not defined; this catches one that is defined and never drawn, an
     element with no story, and an implementation that builds a page out of
     names of its own. See scripts/coverage.ts for what each surface proves. */
  {
    name: 'coverage',
    step: '2b',
    label: 'every component is shown',
    run() {
      const cov = spawnSync(process.execPath, [join(ROOT, 'scripts/coverage.ts')], { encoding: 'utf8' });
      process.stdout.write(cov.stdout);
      if (cov.status !== 0) fails.push('a component is missing from a surface it has to be shown on (see above)');
    },
  },

  {
    name: 'refs',
    step: '3',
    label: 'every local reference resolves',
    run() {
      let refs = 0, broken = 0;
      for (const c of all) {
        // Only real attributes: escaped example markup (&lt;link href="…"&gt;) is documentation.
        const real = c.text.replace(/&lt;[\s\S]*?&gt;/g, '');
        for (const m of real.matchAll(/(?:href|src)="([^"]+)"/g)) {
          const ref = m[1];
          if (!ref || /^(https?:|data:|#)/.test(ref)) continue;
          refs++;
          /* A fragment names something inside the file, not a second file: a
             referenced drawing is written `…/mark.svg#art`. */
          if (!existsSync(resolve(dirname(c.path), ref.replace(/#.*$/, '')))) {
            broken++;
            fails.push(`${c.rel}: ${ref} does not resolve`);
          }
        }
      }
      console.log(`   ${refs} references, ${broken} broken`);
    },
  },

  {
    name: 'fit',
    step: '4',
    label: 'every card renders inside the viewport it declares',
    run() {
      const fit = spawnSync(process.execPath, [join(ROOT, 'scripts/fit.ts')], { encoding: 'utf8' });
      process.stdout.write(fit.stdout.split('\n').filter((l) => l.includes('CROPPED') || l.includes('cards,')).map((l) => `  ${l.trim()}\n`).join(''));
      if (fit.status !== 0) fails.push('some cards are cropped by the viewport they declare (see above)');
    },
  },

  /* Every element renders in Node, not only the seven that appear in a card.
     See scripts/ssr.ts for why that is the rule and what it does not prove. */
  {
    name: 'ssr',
    step: '4b',
    label: 'every element renders outside a browser',
    run() {
      const ssr = spawnSync(process.execPath, [join(ROOT, 'scripts/ssr.ts')], { encoding: 'utf8' });
      process.stdout.write(ssr.stdout);
      if (ssr.status !== 0) fails.push('an element cannot be rendered outside a browser (see above)');
    },
  },

  /* The drop-in is committed, so it can go stale against its own source. */
  {
    name: 'dist',
    step: '4c',
    label: 'the committed drop-in matches its source',
    run() {
      const dist = spawnSync(process.execPath, [join(ROOT, 'scripts/dist.ts'), '--check'], { encoding: 'utf8' });
      process.stdout.write((dist.stdout ?? '').split('\n').filter((l) => l.includes('out of date') || l.includes('✗')).map((l) => `${l}\n`).join(''));
      if (dist.status !== 0) fails.push('dist/ is out of date — run `make dist` and commit it');
    },
  },

  /* The theme is published as a package of its own, assembled rather than
     split out of the history — it has to contain the drop-in, which does not
     live in `guides-theme/`. Assembling it here is what keeps a renamed
     template or a moved file from being found at release time. */
  {
    name: 'split',
    step: '4d',
    label: 'the theme assembles into a package that stands alone',
    run() {
      const split = spawnSync(process.execPath, [join(ROOT, 'scripts/split.ts'), '--check'], { encoding: 'utf8' });
      process.stdout.write(split.stdout ?? '');
      process.stdout.write(split.stderr ?? '');
      if (split.status !== 0) fails.push('the Guides theme does not assemble into a complete package — see `make split ARGS=--check`');
    },
  },

  /* The seven component cards are generated from their stories. A card edited
     by hand looks fine in review and is silently reverted by the next
     `make cards` — so a stale card is a failure, not a warning. */
  {
    name: 'cards',
    step: '5',
    label: 'every card matches its story, and has one',
    run() {
      const gen = spawnSync(process.execPath, [join(ROOT, 'scripts/cards.ts'), '--check'], { encoding: 'utf8' });
      process.stdout.write(
        gen.stdout.split('\n')
          .filter((l) => l.includes('STALE') || l.includes('ORPHAN') || l.includes('generated cards'))
          .map((l) => `  ${l.trim()}\n`).join(''),
      );
      if (gen.status !== 0) fails.push('a card no longer matches its story, or has none — see above, and run `make cards`');
    },
  },

  /* Types are the contract the components and the card generator share. Node
     strips them without checking them, so nothing else would ever notice. */
  {
    name: 'types',
    step: '6',
    label: 'the contract the components and the generator share',
    run() {
      const tsc = spawnSync(process.execPath, [join(ROOT, 'node_modules/typescript/bin/tsc'), '--noEmit'], { encoding: 'utf8' });
      const tscOut = (tsc.stdout ?? '').trim();
      console.log(`   ${tscOut ? tscOut.split('\n').length : 0} type error(s)`);
      if (tsc.status !== 0) {
        process.stdout.write(tscOut.split('\n').slice(0, 10).map((l) => `  ${l}\n`).join(''));
        fails.push('typecheck failed (see above)');
      }
    },
  },

  /* The renderer is written in PHP, and nothing else here reads it. Without
     this the one part of the repository in another language is also the one
     part with no shape agreed on — and a theme meant to be read by people
     who work on TYPO3 every day is the last place to invent a house style. */
  {
    name: 'php',
    step: '6b',
    label: 'the theme’s sources against the coding standard',
    run() {
      const php = spawnSync(process.execPath, [join(ROOT, 'scripts/php.ts'), '--check'], { encoding: 'utf8' });
      const out = `${php.stdout ?? ''}${php.stderr ?? ''}`;
      console.log(`   ${(/Found (\d+) of (\d+) files/.exec(out)?.[0]) ?? 'nothing to fix'}`);
      if (php.status !== 0) {
        process.stdout.write(out.split('\n').filter((l) => /^\s+\d+\) /.test(l)).map((l) => `  ${l.trim()}\n`).join(''));
        fails.push('the theme’s PHP has drifted from the coding standard — run `make php`');
      }
    },
  },

  {
    name: 'conventions',
    step: '7',
    label: 'the header names what the build defines',
    bundle: true,
    run() {
      const conv = spawnSync(process.execPath, [join(ROOT, 'scripts/conventions.ts')], { encoding: 'utf8' });
      process.stdout.write(conv.stdout);
      if (conv.status !== 0) fails.push('conventions.md names something the build no longer defines (see above)');
    },
  },
];

function names(): void {
  const width = Math.max(...CHECKS.map((c) => c.name.length));
  for (const c of CHECKS) console.log(`  ${c.name.padEnd(width)}  ${c.label}`);
}

const asked = process.argv.slice(2);
if (asked.includes('--help') || asked.includes('-h')) {
  console.log('make verify              the gate, all of it');
  console.log('make verify ARGS="a b"   only these checks\n');
  names();
  process.exit(0);
}

/* An unknown name stops the run. Skipping it would leave a filtered run that
   checked less than it was asked to and still printed a tick. */
const unknownName = asked.find((a) => !CHECKS.some((c) => c.name === a));
if (unknownName) {
  console.error(`unknown check "${unknownName}" — the names are:\n`);
  names();
  process.exit(1);
}

const selected = asked.length ? CHECKS.filter((c) => asked.includes(c.name)) : CHECKS;

/* `conventions` reads the assembled bundle, so it is what makes the build run
   — and it runs here rather than inside the check, so the full gate prints in
   the order it always has. */
if (selected.some((c) => c.bundle)) {
  const built = spawnSync(process.execPath, [join(ROOT, 'scripts/build.ts')], { stdio: 'inherit' });
  if (built.status !== 0) {
    console.error('\n✗ the bundle did not build — nothing below it can be trusted');
    process.exit(1);
  }
}

for (const check of selected) {
  console.log(`${check.step}. ${check.name} — ${check.label}`);
  check.run();
}

console.log();
if (fails.length) {
  console.log(`✗ ${fails.length} problem(s):`);
  for (const f of fails) console.log('  -', f);
  process.exit(1);
}
if (selected.length === CHECKS.length) {
  console.log('✓ design system is consistent');
} else {
  console.log(`✓ ${selected.map((c) => c.name).join(', ')} — ${selected.length} of ${CHECKS.length} checks, not the gate`);
}
