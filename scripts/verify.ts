#!/usr/bin/env node
/* The repo's own gate. Run it before shipping anything.

   Each check has a name and `--help` lists them; naming any runs only those —
   `make verify ARGS="refs fit"`. A partial run says so in its last line and
   never claims consistency, and an unrecognised name is an error: a filtered
   run that silently checked nothing reads exactly like a clean one.

   The build runs first, but only for `conventions`, the one check that reads
   `.out/bundle/`. That is also why arguments are passed directly rather than
   through a `sh -c` wrapper, where the filter would land on the shell. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

import { TAGS } from '../packages/frontend/src/index.ts';
import { FRONTEND, cards, ROOT, screens } from './lib/cards.ts';

const fails: string[] = [];

/** The marker has to be the very first line, so that is what is tested. */
const firstLine = (text: string): string => text.split('\n', 1)[0] ?? '';
const ENTITY_RE = /&(?:#[0-9]+|#x[0-9a-f]+|[a-z][a-z0-9]+);/i;

/** Every class the system defines, from all three sheets — including the one
    `styles.css` deliberately does not import: a name is defined if some sheet
    in the system defines it, and a surface told otherwise is told a lie about
    its own repository. */
function definedClasses(): Set<string> {
  const defined = new Set<string>();
  for (const sheet of ['src/styles/components.css', 'src/styles/_specimen.css', 'src/styles/document.css']) {
    for (const m of readFileSync(join(FRONTEND, sheet), 'utf8').matchAll(/\.([a-zA-Z][\w-]*)/g)) {
      defined.add(m[1] as string);
    }
  }
  return defined;
}

/** Every event the elements dispatch, read out of the sources that dispatch
    them. A document names these beside the elements and the classes, and they
    go stale the same way. */
function definedEvents(): Set<string> {
  const events = new Set<string>();
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) walk(path);
      else if (entry.endsWith('.ts')) {
        for (const m of readFileSync(path, 'utf8').matchAll(/new (?:Custom)?Event(?:<[^>]*>)?\('(sds-[a-z-]+)'/g)) {
          events.add(m[1] as string);
        }
      }
    }
  };
  walk(join(FRONTEND, 'src'));
  return events;
}

/** What is read as instruction: the root files, the manual, and what a package
    carries into its own repository. Not `.design-sync/conventions.md` — the
    `conventions` check holds that one against the built bundle, which is the
    same question asked harder. */
function documents(): string[] {
  const out = readdirSync(ROOT).filter((f) => f.endsWith('.md')).map((f) => join(ROOT, f));
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(rst|md)$/.test(entry)) out.push(path);
    }
  };
  walk(join(ROOT, 'docs'));
  for (const pkg of readdirSync(join(ROOT, 'packages'))) {
    for (const file of ['README.md', 'GAPS.md']) {
      const path = join(ROOT, 'packages', pkg, file);
      if (existsSync(path)) out.push(path);
    }
  }
  return out;
}
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
  /** Reads `.out/bundle/`, so selecting it is what makes the build run. */
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

  /* A tree points at its mark from `guides.xml`, and the file has to sit beside
     the documents for the renderer to carry it. That copy is the one place the
     wrong optical size can get in without anything noticing: a signet named
     for 16 and drawn at 24 is scaled by 1.5, and every edge in it lands on a
     half pixel. */
  {
    name: 'marks',
    step: '0c',
    label: 'the documents\' marks match the drawings',
    run() {
      const em = spawnSync(process.execPath, [join(ROOT, 'scripts/embed.ts'), '--check'], { encoding: 'utf8' });
      process.stdout.write(em.stdout);
      process.stdout.write(em.stderr ?? '');
      if (em.status !== 0) fails.push('a mark beside the documents is out of date — run `make embed`');
    },
  },

  {
    name: 'headers',
    step: '1',
    label: '@dsCard and @startingPoint use literal metadata',
    run() {
      for (const c of list) {
        const marker = firstLine(c.text);
        if (!/^<!--\s*@dsCard\s+group="[^"]*"[^>]*-->/.test(marker)) {
          fails.push(`${c.rel}: first line is not a @dsCard comment`);
        }
        /* A marker is comment data, not rendered text. No browser decodes a
           character reference before the pane and this parser read it. */
        const entity = ENTITY_RE.exec(marker)?.[0];
        if (entity) fails.push(`${c.rel}: @dsCard metadata uses "${entity}" — write the literal character`);
      }
      for (const s of sp) {
        const marker = firstLine(s.text);
        if (!/^<!--\s*@startingPoint\s+section="[^"]*"[^>]*-->/.test(marker)) {
          fails.push(`${s.rel}: first line is not a @startingPoint comment`);
        }
        const entity = ENTITY_RE.exec(marker)?.[0];
        if (entity) fails.push(`${s.rel}: @startingPoint metadata uses "${entity}" — write the literal character`);
      }
      console.log(`   ${list.length} cards, ${sp.length} starting points`);
    },
  },

  /* A page embeds a card at a size it states itself, and the card states its
     own in `@dsCard`. Nothing ties the two together, so a card that grows keeps
     rendering into the old box — cropped on the page and correct in the pane,
     which is the worst way to be wrong. Three had already drifted when this was
     first written, against the MDX pages the documentation was then; it read
     those long after the last one became reStructuredText, which is to say it
     guarded nothing. */
  {
    name: 'heights',
    step: '1b',
    label: 'specimens match the cards they embed',
    run() {
      /* The directive names a path under `_cards/`, and a card knows itself by
         its path in the repository — so the two meet at the tail. */
      const declared = new Map(all.map((c) => [c.rel.split('specimens/')[1] ?? c.rel, c.viewport]));
      /* What the directive draws where the page does not say — see
         `docs/guides-theme/directives.rst`, which is where this number is the
         documented default rather than a guess. */
      const DEFAULT_VIEWPORT = '700x260';
      let embedded = 0;
      let mismatched = 0;

      const pages = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
        .flatMap((e) => (e.isDirectory() ? pages(join(dir, e.name)) : e.name.endsWith('.rst') ? [join(dir, e.name)] : []));

      for (const page of pages(join(ROOT, 'docs'))) {
        const text = readFileSync(page, 'utf8');
        for (const m of text.matchAll(/^\.\.\s+specimen::\s+(\S+)\s*$((?:\n[ \t]+\S.*)*)/gm)) {
          const [, src = '', options = ''] = m;
          embedded++;
          const vp = /:viewport:\s*(\d+x\d+)/.exec(options)?.[1] ?? DEFAULT_VIEWPORT;
          const want = declared.get(src);
          if (!want) {
            mismatched++;
            fails.push(`${relative(ROOT, page)}: embeds ${src}, which is not a generated card`);
          } else if (want !== vp) {
            mismatched++;
            fails.push(`${relative(ROOT, page)}: ${src} is embedded at ${vp}, the card declares ${want}`);
          }
        }
      }
      console.log(`   ${embedded} specimens embedded, ${mismatched} at a size the card does not declare`);
    },
  },

  {
    name: 'classes',
    step: '2',
    label: 'every class resolves in its own layer',
    run() {
      const defined = definedClasses();
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
      /* Cards link `_specimen.css`; elements and starting points do not. The
         union above can prove a card's annotation exists, but it must not make
         a specimen class look available to product source. */
      let specimenLeaks = 0;
      const productSources = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
        .flatMap((entry) => entry.isDirectory()
          ? productSources(join(dir, entry.name))
          : entry.name.endsWith('.ts') ? [join(dir, entry.name)] : []);
      for (const file of productSources(join(FRONTEND, 'src'))) {
        for (const match of readFileSync(file, 'utf8').matchAll(/\bspec-[a-z0-9-]+\b/g)) {
          specimenLeaks++;
          fails.push(`${relative(ROOT, file)}: product source names specimen-only class "${match[0]}"`);
        }
      }
      for (const screen of sp) {
        for (const match of screen.text.matchAll(/\bclass="[^"]*\b(spec-[a-z0-9-]+)\b[^"]*"/g)) {
          specimenLeaks++;
          fails.push(`${screen.rel}: starting point uses specimen-only class "${match[1]}"`);
        }
      }
      console.log(`   ${specimenLeaks} specimen-only classes in product source`);
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

  /* The third direction: a name a document writes. Prose is where a name
     outlives the code that had it — nothing renders it, so nothing breaks —
     and a page naming an element the registry has never heard of teaches a
     reader to write markup that stays inert. `conventions` asked this of one
     file; every other document was unheld. */
  {
    name: 'names',
    step: '2c',
    label: 'every sds- name a document writes exists',
    run() {
      const defined = definedClasses();
      for (const tag of TAGS) defined.add(tag);
      for (const event of definedEvents()) defined.add(event);
      const docs = documents();
      /* `sds-x__y` is how the rule about part names is stated, about no
         component in particular. A confval's `:name:` is spelt out of the
         element and the property it documents — an anchor, not a name the
         system defines. */
      const used = new Map<string, string[]>();
      for (const path of docs) {
        const rel = relative(ROOT, path);
        const text = readFileSync(path, 'utf8').replace(/^\s*:name:.*$/gm, '');
        for (const m of text.matchAll(/(?<![\w-])(sds-[a-z0-9]+(?:[-_]+[a-z0-9]+)*)/g)) {
          const name = m[1] as string;
          if (/^sds-x(__y)?$/.test(name)) continue;
          const where = used.get(name) ?? [];
          if (!where.includes(rel)) where.push(rel);
          used.set(name, where);
        }
      }
      let unknown = 0;
      for (const [name, where] of [...used].sort()) {
        if (defined.has(name)) continue;
        unknown++;
        fails.push(`"${name}" is written in ${where.join(', ')} and is neither a class nor an element`);
      }
      console.log(`   ${used.size} names in ${docs.length} documents, ${unknown} unknown`);
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

  /* The screens against the scale and the grid, both read out of the tokens so
     the measurement cannot drift from them. A size or a gap somebody typed is
     invisible to every other check — it renders, it fits, and it is simply not
     on the system's steps. `make rhythm` names one screen; here it is all of
     them, and only what failed is printed. */
  {
    name: 'rhythm',
    step: '4a',
    label: 'every screen sets sizes on the scale and gaps on the grid',
    run() {
      const rhythm = spawnSync(process.execPath, [join(ROOT, 'scripts/rhythm.ts')], { encoding: 'utf8' });
      process.stdout.write(
        rhythm.stdout
          .split('\n')
          .filter((l) => l.includes('OFF SCALE') || l.includes('not a step') || l.includes('screen(s),'))
          .map((l) => `  ${l.trim()}\n`)
          .join(''),
      );
      if (rhythm.status !== 0) fails.push('a screen sets a size off the scale or a gap off the grid (see above, and `make rhythm`)');
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
