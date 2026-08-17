#!/usr/bin/env node
/* The repo's own gate. Run it before shipping anything.

   Each check has a name and `--help` lists them; naming any runs only those —
   `make verify ARGS="refs fit"`. A partial run says so in its last line and
   never claims consistency, and an unrecognised name is an error: a filtered
   run that silently checked nothing reads exactly like a clean one.

   A check is one row: its verdict, its numbers, and what it found only when
   it found something. What a child task reports is the contract in
   `lib/report.ts` — never a substring of its prose, which is how `fit` once
   passed its summary line to nobody. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

import { TAGS } from '../packages/frontend/src/index.ts';
import { FRONTEND, cards, ROOT, screens } from './lib/cards.ts';
import * as report from './lib/report.ts';

/** The marker has to be the very first line, so that is what is tested. */
const firstLine = (text: string): string => text.split('\n', 1)[0] ?? '';
const ENTITY_RE = /&(?:#[0-9]+|#x[0-9a-f]+|[a-z][a-z0-9]+);/i;

/** Every stylesheet the system has, the component files among them. Read from
    the directory rather than listed: a component added to a list by hand is
    one no check sees until somebody remembers. */
function stylesheets(dir = join(FRONTEND, 'src', 'styles')): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? stylesheets(path) : entry.name.endsWith('.css') ? [path] : [];
  });
}

/** Every class the system defines — including the sheet `styles.css`
    deliberately does not import: a name is defined if some sheet in the system
    defines it, and a surface told otherwise is told a lie about its own
    repository. */
function definedClasses(): Set<string> {
  const defined = new Set<string>();
  for (const sheet of stylesheets()) {
    for (const m of readFileSync(sheet, 'utf8').matchAll(/\.([a-zA-Z][\w-]*)/g)) {
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
    const path = join(ROOT, 'packages', pkg, 'README.md');
    if (existsSync(path)) out.push(path);
  }
  return out;
}
const list = cards();
const sp = screens();
/* Screens go through the same checks as cards: they ship with the system and
   are what a consuming project seeds a new design from. */
const all = [...list, ...sp];

/** What a check hands back: the numbers its row carries, and what it found.
    A check with no problems is a passing check — nothing else decides. */
interface Result {
  facts: string;
  problems?: string[];
  /** The command that puts it right, printed under the problems. */
  fix?: string;
}

/** Run another task under the reporting contract: its first line is the facts
    for the row, the rest is what it found. Exit status alone decides. */
function child(script: string, ...args: string[]): Result {
  const run = spawnSync(process.execPath, [join(ROOT, script), ...args], {
    encoding: 'utf8',
    env: { ...process.env, SDS_REPORT: '1' },
  });
  const lines = `${run.stdout ?? ''}\n${run.stderr ?? ''}`.split('\n').map((l) => l.trimEnd()).filter(Boolean);
  const ok = run.status === 0;
  if (!lines.length) return ok ? { facts: 'nothing to report' } : { facts: 'the task did not run', problems: ['it printed nothing and exited non-zero'] };
  const [facts = '', ...rest] = lines;
  return ok ? { facts } : { facts, problems: rest.length ? rest : ['see the task itself'] };
}

interface Check {
  /** How it is asked for: `make verify ARGS=classes`. */
  name: string;
  /** What it holds, in its row and in `--help`. */
  label: string;
  /** Reads `.out/bundle/`, so selecting it is what makes the build run. */
  bundle?: true;
  run: () => Result;
}

/* Every check, in the order the gate runs them. Nothing here reads a value
   another one computed — a check is the unit that can be run alone. */
const CHECKS: readonly Check[] = [
  /* What is generated from an npm package. All of it is committed now — a
     package is packed from a checkout — so this is no longer about a clone
     that skipped `npm ci`, but about a tree where a generator half ran or
     something was deleted. Empty, every card renders in system-ui with no
     glyph to draw from, which looks like a design bug and is not one. */
  {
    name: 'assets',
    label: 'the generated fonts and icons are there',
    run() {
      const GENERATED: readonly (readonly [dir: string, fix: string])[] = [
        ['fonts', 'make fonts'],
        ['assets/icons/svgs', 'make icons'],
      ];
      const problems: string[] = [];
      const counts: string[] = [];
      for (const [dir, script] of GENERATED) {
        const n = existsSync(join(FRONTEND, dir)) ? readdirSync(join(FRONTEND, dir)).length : 0;
        counts.push(`${n} ${dir}`);
        if (n === 0) problems.push(`${dir}/ is empty or missing — run \`${script}\``);
      }
      return { facts: counts.join(' · '), problems };
    },
  },

  /* The drawings' viewBoxes and shapes are read out of the files into two
     modules. A recomposed drawing that did not go through `make diagrams`
     ships a wrapper sized to the old coordinate system — squashed by a
     fraction, and nothing else would notice. */
  {
    name: 'diagrams',
    label: 'the modules match the drawings',
    run: () => ({ ...child('scripts/diagrams.ts', '--check'), fix: 'make diagrams' }),
  },

  /* A tree points at its mark from `guides.xml`, and the file has to sit beside
     the documents for the renderer to carry it. That copy is the one place the
     wrong optical size can get in without anything noticing: a signet named
     for 16 and drawn at 24 is scaled by 1.5, and every edge in it lands on a
     half pixel. */
  {
    name: 'marks',
    label: 'the documents’ marks match the drawings',
    run: () => ({ ...child('scripts/embed.ts', '--check'), fix: 'make embed' }),
  },

  {
    name: 'headers',
    label: '@dsCard and @startingPoint use literal metadata',
    run() {
      const problems: string[] = [];
      const marker = (rel: string, text: string, kind: 'dsCard' | 'startingPoint', field: string): void => {
        const head = firstLine(text);
        if (!new RegExp(`^<!--\\s*@${kind}\\s+${field}="[^"]*"[^>]*-->`).test(head)) {
          problems.push(`${rel}: first line is not a @${kind} comment`);
        }
        /* A marker is comment data, not rendered text. No browser decodes a
           character reference before the pane and this parser read it. */
        const entity = ENTITY_RE.exec(head)?.[0];
        if (entity) problems.push(`${rel}: @${kind} metadata uses "${entity}" — write the literal character`);
      };
      for (const c of list) marker(c.rel, c.text, 'dsCard', 'group');
      for (const s of sp) marker(s.rel, s.text, 'startingPoint', 'section');
      return { facts: `${list.length} cards · ${sp.length} starting points`, problems };
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
    label: 'the specimens match the cards they embed',
    run() {
      /* The directive names a path under `_cards/`, and a card knows itself by
         its path in the repository — so the two meet at the tail. */
      const declared = new Map(all.map((c) => [c.rel.split('specimens/')[1] ?? c.rel, c.viewport]));
      /* What the directive draws where the page does not say — see
         `docs/guides-theme/directives.rst`, which is where this number is the
         documented default rather than a guess. */
      const DEFAULT_VIEWPORT = '700x260';
      const problems: string[] = [];
      let embedded = 0;

      const pages = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
        .flatMap((e) => (e.isDirectory() ? pages(join(dir, e.name)) : e.name.endsWith('.rst') ? [join(dir, e.name)] : []));

      for (const page of pages(join(ROOT, 'docs'))) {
        const text = readFileSync(page, 'utf8');
        for (const m of text.matchAll(/^\.\.\s+specimen::\s+(\S+)\s*$((?:\n[ \t]+\S.*)*)/gm)) {
          const [, src = '', options = ''] = m;
          embedded++;
          const vp = /:viewport:\s*(\d+x\d+)/.exec(options)?.[1] ?? DEFAULT_VIEWPORT;
          const want = declared.get(src);
          if (!want) problems.push(`${relative(ROOT, page)}: embeds ${src}, which is not a generated card`);
          else if (want !== vp) problems.push(`${relative(ROOT, page)}: ${src} is embedded at ${vp}, the card declares ${want}`);
        }
      }
      return { facts: `${embedded} embedded`, problems };
    },
  },

  {
    name: 'classes',
    label: 'every class resolves in its own layer',
    run() {
      const defined = definedClasses();
      const problems: string[] = [];
      /* Every class in every card and screen, against the stylesheets, with no
         exemption. A `<style>` block whose names counted as defined would be
         the escape hatch a page's own layout goes through, and a name in one is
         a name no other surface can use. */
      const used = new Map<string, string[]>();
      for (const c of all) {
        if (c.text.includes('<style>')) {
          problems.push(`${c.rel}: carries a <style> block — layout belongs in components.css, not in a generated file`);
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
      const productSources = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
        .flatMap((entry) => entry.isDirectory()
          ? productSources(join(dir, entry.name))
          : entry.name.endsWith('.ts') ? [join(dir, entry.name)] : []);
      for (const file of productSources(join(FRONTEND, 'src'))) {
        for (const match of readFileSync(file, 'utf8').matchAll(/\bspec-[a-z0-9-]+\b/g)) {
          problems.push(`${relative(ROOT, file)}: product source names specimen-only class "${match[0]}"`);
        }
      }
      for (const screen of sp) {
        for (const match of screen.text.matchAll(/\bclass="[^"]*\b(spec-[a-z0-9-]+)\b[^"]*"/g)) {
          problems.push(`${screen.rel}: starting point uses specimen-only class "${match[1]}"`);
        }
      }
      /* Names that are markers rather than hooks. `language-*` is the fence's
         grammar, written onto the `<code>` the way every Markdown renderer
         writes it: it says what the block is for anything reading the DOM, and
         the colour is on the `hljs-` spans inside. There is nothing for it to
         be defined as — the one class here deliberately not a style. */
      const MARKERS = [/^language-[\w-]+$/];

      for (const [cls, where] of [...used].sort()) {
        if (MARKERS.some((rx) => rx.test(cls))) continue;
        if (!defined.has(cls)) {
          problems.push(`class "${cls}" is used in ${where.length} file(s) but defined in no stylesheet (first: ${where[0]})`);
        }
      }
      return { facts: `${used.size} used · ${defined.size} defined`, problems };
    },
  },

  /* The other direction of the same rule. `classes` catches a name that is
     used and not defined; this catches one that is defined and never drawn, an
     element with no story, and an implementation that builds a page out of
     names of its own. See scripts/coverage.ts for what each surface proves. */
  {
    name: 'coverage',
    label: 'every component is shown',
    run: () => child('scripts/coverage.ts'),
  },

  /* The third direction: a name a document writes. Prose is where a name
     outlives the code that had it — nothing renders it, so nothing breaks —
     and a page naming an element the registry has never heard of teaches a
     reader to write markup that stays inert. `conventions` asked this of one
     file; every other document was unheld. */
  {
    name: 'names',
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
      const problems: string[] = [];
      for (const [name, where] of [...used].sort()) {
        if (defined.has(name)) continue;
        problems.push(`"${name}" is written in ${where.join(', ')} and is neither a class nor an element`);
      }
      return { facts: `${used.size} names · ${docs.length} documents`, problems };
    },
  },

  {
    name: 'refs',
    label: 'every local reference resolves',
    run() {
      const problems: string[] = [];
      let refs = 0;
      for (const c of all) {
        // Only real attributes: escaped example markup (&lt;link href="…"&gt;) is documentation.
        const real = c.text.replace(/&lt;[\s\S]*?&gt;/g, '');
        for (const m of real.matchAll(/(?:href|src)="([^"]+)"/g)) {
          const ref = m[1];
          if (!ref || /^(https?:|data:|#)/.test(ref)) continue;
          refs++;
          /* A fragment names something inside the file, not a second file: a
             referenced drawing is written `…/mark.svg#soul-ref`. */
          if (!existsSync(resolve(dirname(c.path), ref.replace(/#.*$/, '')))) {
            problems.push(`${c.rel}: ${ref} does not resolve`);
          }
        }
      }
      return { facts: `${refs} references`, problems };
    },
  },

  /* Every component is a property set, and its own declarations read that set
     and nothing else. A value reaching a declaration past the set is how
     `line-height: 1.55` ends up in one component and `--leading-body` in every
     other — and it is the difference between a surface retheming one instance
     by setting a property and one writing a class this system never heard of.

     Two things are read straight because they are the system's and not the
     component's: the focus ring, which is one ring, and the colours that mean
     something — a component able to re-point those could draw an error green.
     Two files are not a component at all and say so here. */
  {
    name: 'sets',
    label: 'a component draws from its own property set',
    run() {
      const SHARED = new Set([
        'accent-ring', 'border-emphasis', 'focus-halo', 'focus-offset',
        'accent', 'status-ok', 'status-warn', 'status-error',
        'syntax-key', 'syntax-string', 'syntax-comment', 'syntax-text',
      ]);
      /* What turns the page over, and what a picture is before anything frames
         it. Neither draws one component, so neither has a set to draw from. */
      const NOT_A_COMPONENT = new Set(['art.css', 'direction.css']);

      const dir = join(FRONTEND, 'src', 'styles', 'components');
      const problems: string[] = [];
      let read = 0;
      const files = readdirSync(dir).filter((f) => f.endsWith('.css')).sort();
      for (const file of files) {
        if (NOT_A_COMPONENT.has(file)) continue;
        const css = readFileSync(join(dir, file), 'utf8');
        const own = new Set([...css.matchAll(/^\s*(--sds-[a-z0-9-]+)\s*:/gm)].map((m) => m[1] as string));
        /* Only what the component draws. A file opens `@layer base` as well, to
           state the flow contract its element and its class share, and that step
           is the system's own value rather than anything this component set. */
        const drawnOnly = css.split('@layer components {').slice(1).join('@layer components {');
        for (const line of drawnOnly.split('\n')) {
          const text = line.trim();
          if (!text || text.startsWith('/*') || text.startsWith('*')) continue;
          /* Assignments are where the set is built, and one may share a line
             with the selector it is written on. Taken out before the rest is
             read, or `.sds-panel { --fill: var(--surface-raised); }` reads as a
             declaration reaching past its own set. */
          const drawn = text.replace(/--[a-z][a-z0-9-]*\s*:[^;}]*;?/g, '');
          for (const m of drawn.matchAll(/var\((--[a-z0-9-]+)/g)) {
            const name = m[1] as string;
            read++;
            if (own.has(name) || SHARED.has(name.slice(2))) continue;
            problems.push(`${file}: ${text.slice(0, 60)} reads ${name} past the set`);
          }
        }
      }
      return { facts: `${files.length} files · ${read} reads`, problems };
    },
  },

  /* The widths the design changes at, against the page that names them. There
     is no way to write a breakpoint once — a media query reads no custom
     property — so the set is prose and the stylesheets repeat it, which is
     exactly the drift this asks about. A sixth width is a state of the layout
     nobody described and nothing selects; a named one nothing uses is a band
     that was removed in one place. */
  {
    name: 'breakpoints',
    label: 'every width the layer changes at is a width a document names',
    run() {
      const page = join(ROOT, 'docs', 'frontend', 'layout.rst');
      const shed = readFileSync(page, 'utf8').split(/^Where it sheds$/m)[1] ?? '';
      const named = new Set([...shed.split(/\n[A-Z][^\n]*\n=+\n/)[0]!.matchAll(/\b(\d{3,4})px\b/g)]
        .map((m) => Number(m[1])));

      const used = new Map<number, string[]>();
      for (const sheet of stylesheets()) {
        const css = readFileSync(sheet, 'utf8');
        for (const m of css.matchAll(/@media[^{]*?\(\s*(?:min|max)-width:\s*(\d+)px\s*\)/g)) {
          const at = Number(m[1]);
          used.set(at, [...(used.get(at) ?? []), relative(join(FRONTEND, 'src', 'styles'), sheet)]);
        }
      }

      const problems: string[] = [];
      for (const [at, sheets] of [...used].sort((a, b) => b[0] - a[0])) {
        if (!named.has(at)) {
          problems.push(`${at}px changes the layout in ${[...new Set(sheets)].join(', ')} and no document names it`);
        }
      }
      for (const at of [...named].sort((a, b) => b - a)) {
        if (!used.has(at)) problems.push(`${at}px is named in docs/frontend/layout.rst and no stylesheet uses it`);
      }
      return { facts: `${used.size} width(s) · ${named.size} named`, problems };
    },
  },

  {
    name: 'fit',
    label: 'every card renders inside the viewport it declares',
    run: () => child('scripts/fit.ts'),
  },

  /* Every element renders in Node, not only the ones that appear in a card.
     See scripts/ssr.ts for why that is the rule and what it does not prove. */
  {
    name: 'ssr',
    label: 'every element renders outside a browser',
    run: () => child('scripts/ssr.ts'),
  },

  /* A release is one tag and one version. Packagist reads the theme's off that
     tag, npm reads the frontend's out of a manifest, and the site renders its
     own into a footer — so the number is written down in several files, and
     this is what keeps the copies from drifting into a published version
     nobody meant. The rendered one is the copy a reader actually sees. */
  {
    name: 'version',
    label: 'this tree names one version',
    run: () => ({ ...child('scripts/release.ts', '--check'), fix: 'make release ARGS=<version>' }),
  },

  /* The drop-in is committed, so it can go stale against its own source. */
  {
    name: 'dist',
    label: 'the committed drop-in matches its source',
    run: () => ({ ...child('scripts/dist.ts', '--check'), fix: 'make dist, and commit it' }),
  },

  /* The theme is published as a package of its own, assembled rather than
     split out of the history — it has to contain the drop-in, which does not
     live in `guides-theme/`. Assembling it here is what keeps a renamed
     template or a moved file from being found at release time. */
  {
    name: 'split',
    label: 'each package assembles into something installable',
    run: () => ({ ...child('scripts/split.ts', '--check'), fix: 'make split ARGS=--check' }),
  },

  /* The cards are generated from their stories. A card edited by hand looks
     fine in review and is silently reverted by the next `make cards` — so a
     stale card is a failure, not a warning. */
  {
    name: 'cards',
    label: 'every card matches its story, and has one',
    run: () => ({ ...child('scripts/cards.ts', '--check'), fix: 'make cards' }),
  },

  /* Types are the contract the components and the card generator share. Node
     strips them without checking them, so nothing else would ever notice. */
  {
    name: 'types',
    label: 'the contract the components and the generator share',
    run() {
      const tsc = spawnSync(process.execPath, [join(ROOT, 'node_modules/typescript/bin/tsc'), '--noEmit'], { encoding: 'utf8' });
      const lines = (tsc.stdout ?? '').trim().split('\n').filter(Boolean);
      if (tsc.status === 0) return { facts: 'no type errors' };
      /* Ten is enough to see the shape of a break; the count says what is
         behind them, so nothing is dropped without saying so. */
      const shown = lines.slice(0, 10);
      if (lines.length > shown.length) shown.push(`… and ${lines.length - shown.length} more — run \`make typecheck\``);
      return { facts: `${lines.length} type error(s)`, problems: shown };
    },
  },

  /* The stylesheets have a written shape — `docs/frontend/stylesheets.rst` —
     and this is the part of it a rule can hold: the safety rules, the indent,
     and the colour-literal ban outside `tokens/`. */
  {
    name: 'css',
    label: 'the stylesheets against their shape',
    run: () => ({ ...child('scripts/css.ts', '--check'), fix: 'make css' }),
  },

  /* The renderer is written in PHP, and nothing else here reads it. Without
     this the one part of the repository in another language is also the one
     part with no shape agreed on — and a theme meant to be read by people
     who work on TYPO3 every day is the last place to invent a house style. */
  {
    name: 'php',
    label: 'the theme’s sources against the coding standard',
    run: () => ({ ...child('scripts/php.ts', '--check'), fix: 'make php' }),
  },

  {
    name: 'conventions',
    label: 'the header names what the build defines',
    bundle: true,
    run: () => child('scripts/conventions.ts'),
  },
];

report.align(CHECKS);

function names(): void {
  for (const c of CHECKS) report.row('skip', c.name, c.label);
}

const asked = process.argv.slice(2);
if (asked.includes('--help') || asked.includes('-h')) {
  report.open('verify', 'the gate');
  report.align([{ name: '', label: 'make verify ARGS="a b"' }]);
  report.fact('make verify', 'all of it');
  report.fact('make verify ARGS="a b"', 'only these checks');
  console.log();
  report.align(CHECKS);
  names();
  process.exit(0);
}

/* An unknown name stops the run. Skipping it would leave a filtered run that
   checked less than it was asked to and still printed a tick. */
const unknownName = asked.find((a) => !CHECKS.some((c) => c.name === a));
if (unknownName) {
  report.open('verify', 'the gate');
  report.bad(`there is no check called "${unknownName}" — the names are:`);
  console.log();
  names();
  process.exit(1);
}

const selected = asked.length ? CHECKS.filter((c) => asked.includes(c.name)) : CHECKS;

report.open('verify', asked.length ? `${selected.map((c) => c.name).join(', ')} — not the gate` : 'the gate');

/* `conventions` reads the assembled bundle, so it is what makes the build run
   — and it runs here rather than inside the check, so the full gate prints in
   the order it always has. */
if (selected.some((c) => c.bundle)) {
  const built = child('scripts/build.ts');
  report.row(built.problems ? 'bad' : 'ok', 'bundle', 'assembled, for the checks that read it', built.facts);
  if (built.problems) {
    for (const p of built.problems) report.detail(p);
    report.close('bad', 'the bundle did not build — nothing below it can be trusted');
    process.exit(1);
  }
}

const failed: string[] = [];
for (const check of selected) {
  const { facts, problems = [], fix } = check.run();
  report.row(problems.length ? 'bad' : 'ok', check.name, check.label, facts);
  for (const p of problems) report.detail(p);
  if (fix && problems.length) report.detail(report.dim(`run \`${fix}\``));
  if (problems.length) failed.push(check.name);
}

if (failed.length) {
  report.close('bad', `${failed.join(', ')} — ${failed.length} of ${selected.length} checks failed`);
  process.exit(1);
}
report.close('ok', selected.length === CHECKS.length
  ? 'design system is consistent'
  : `${selected.length} of ${CHECKS.length} checks, not the gate`);
