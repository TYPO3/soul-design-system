#!/usr/bin/env node
/* Render the documentation with the Guides theme.

     make guides

   `site/` is the publish root — what GitHub Pages will serve, and what the
   `site` container serves locally at a root of its own so the two are the
   same shape. It is published **standalone**: the repository around it does
   not go with it, so everything the pages need is copied inside and the last
   step here proves that nothing points out. More than one project goes into it:

     site/              the manual and the landing page   (from docs/)
     site/_acceptance/  every node the renderer emits     (guides-theme/acceptance/)

   The second is not documentation. It is the acceptance test for the theme —
   the page every claim about a gap is checked against — and it is a control
   surface for whoever works on this, not for a reader. The underscore says so,
   and the publish step leaves it behind.

   Three things happen per project, and only the middle one is interesting.

   **Dependencies.** The renderer is a Composer package and its tree lives in
   the working directory rather than in an image layer — pure PHP, identical on
   every platform, and readable without opening a container. Installed on first
   run, so nobody has to know that.

   **The stylesheets go into the source tree.** Guides copies assets it finds
   referenced from the documents it parsed; a `<link>` to a file outside that
   tree is reported as a missing image and dropped. So the drop-in is copied
   into the project as `styles/`, where `asset()` can find it and rewrite the
   URL per page — which is also what makes a page below the root resolve it.
   That directory is generated and gitignored.

   **The render.** One CLI call per project. Each `guides.xml` says which
   parser to use and where the theme's templates are. */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

import { cards, ROOT, screens } from './lib/cards.ts';

const THEME = join(ROOT, 'guides-theme');
const SITE = join(ROOT, 'site');
const DROP = join(ROOT, 'dist');

interface Project {
  /** What it is called in the output and in the log. */
  name: string;
  /** The documents, and the `guides.xml` beside them. */
  source: string;
  /** Where it lands under the publish root. */
  out: string;
}

const PROJECTS: Project[] = [
  /* The manual and the landing page. Renders into the root, because that is
     what Pages serves. */
  { name: 'docs', source: join(ROOT, 'docs'), out: SITE },
  /* The acceptance test for the theme: every node the renderer can emit, once,
     where it can be looked at. A control surface rather than a published one —
     hence the underscore, and hence excluded when the site is published. */
  { name: 'acceptance', source: join(THEME, 'acceptance'), out: join(SITE, '_acceptance') },
];

/* The specimen cards, where the documents can reach them.

   A guideline page shows the card that renders the rule it states — the same
   file Storybook iframes and the same one the design pane opens. It is a whole
   document with a stylesheet of its own, so it is embedded rather than
   inlined, and it has to be copied into the documentation source: `asset()`
   only carries what a parsed document points at.

   The links inside are rewritten on the way, the same job `build.ts` does for
   the upload bundle. A card links the repo's own `src/styles/`, which exists
   nowhere in a rendered site; from `_cards/x.html` the site's stylesheets are
   one directory up. Counted rather than written down — the same lesson as
   everywhere else in this repo. */
function copyCards(source: string): void {
  const out = join(source, '_cards');
  rmSync(out, { recursive: true, force: true });
  /* Screens as well as cards. A guideline page about layout embeds whole
     pages, and they are specimens by the same definition — a rendering of a
     rule, kept beside the rule. */
  for (const card of [...cards(), ...screens()]) {
    const rel = relative(join(ROOT, 'specimens'), card.path);
    const target = join(out, rel);
    mkdirSync(join(target, '..'), { recursive: true });
    /* Two levels: `_cards/<group>/<file>` in the output, so the climb is
       counted from where each card lands rather than assumed flat. */
    const up = '../'.repeat(rel.split('/').length);
    writeFileSync(target, readFileSync(card.path, 'utf8')
      .replace(/href="(?:\.\.\/)+src\/styles\/styles\.css"/g, `href="${up}styles/soul.css"`)
      .replace(/href="(?:\.\.\/)+src\/styles\/_specimen\.css"/g, `href="${up}styles/_specimen.css"`)
      .replace(/(src|href)="(?:\.\.\/)+assets\//g, `$1="${up}assets/`));
  }
}

const run = (cmd: string, args: string[], cwd = ROOT): number =>
  spawnSync(cmd, args, { cwd, stdio: 'inherit' }).status ?? 1;

if (!existsSync(join(THEME, 'vendor', 'bin', 'guides'))) {
  console.log('installing the renderer (first run only)');
  const code = run('composer', ['install', '--no-interaction', '--no-progress'], THEME);
  if (code !== 0) process.exit(code);
}

/* The drop-in, not the sources: what a consuming site links is one built
   stylesheet and one built script, and rendering against anything else would
   prove the theme works with something nobody ships. */
if (!existsSync(join(DROP, 'soul.css'))) {
  console.error('dist/soul.css is missing — run `make dist` first');
  process.exit(1);
}

rmSync(SITE, { recursive: true, force: true });

for (const project of PROJECTS) {
  const styles = join(project.source, 'styles');
  rmSync(styles, { recursive: true, force: true });
  mkdirSync(styles, { recursive: true });
  for (const file of ['soul.css', 'document.css', 'soul.js', 'soul-boot.js']) {
    cpSync(join(DROP, file), join(styles, file));
  }
  copyCards(project.source);

  const code = run(join(THEME, 'vendor', 'bin', 'guides'), [
    project.source,
    `--output=${project.out}`,
    '-c', project.source,
    '--no-progress',
    /* A missing reference is the whole point of the exercise, so it must not
       be something a reader has to notice in a log. */
    '--fail-on-error',
  ]);
  if (code !== 0) process.exit(code);

  /* The faces, afterwards and by hand.

     Guides copies an asset it can see a document reach for, and nothing sees
     these: `soul.css` asks for `fonts/` beside itself, and the renderer does
     not read stylesheets. Left out, the whole site falls back to system-ui —
     a page that looks broken while every file it names is present. */
  cpSync(join(DROP, 'fonts'), join(project.out, 'styles', 'fonts'), { recursive: true });
  /* What the cards themselves point at — signets, icons, diagrams. Same
     reason as the faces: nothing parses a card, so nothing copies them. */
  cpSync(join(ROOT, 'assets'), join(project.out, 'assets'), { recursive: true });
  /* The chrome the cards are drawn with. Not part of the drop-in and it must
     not be — a design built with this system inherits the token and component
     layers only — but inside a specimen frame it is what draws the captions.
     Copied here rather than into the source because nothing in a document
     points at it: only the cards do, and nothing parses a card. */
  cpSync(join(ROOT, 'src', 'styles', '_specimen.css'), join(project.out, 'styles', '_specimen.css'));
}

/* Nothing may point outside the site.

   What is published is `site/` and nothing else — not the repository around
   it, not `dist/`, not `specimens/`. A reference that resolves here because
   this happens to be a checkout is a reference that resolves to nothing on the
   server, and the failure arrives as a page with no stylesheet rather than as
   an error anybody sees. So it is asked here, once, over every file the site
   ships: cards included, since those are documents too.

   The same check the upload bundle gets, for the same reason and after the
   same defect. */
function escapes(): string[] {
  const bad: string[] = [];
  for (const file of walkHtml(SITE)) {
    const text = readFileSync(file, 'utf8').replace(/&lt;[\s\S]*?&gt;/g, '');
    for (const m of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const ref = m[1];
      if (!ref || /^(https?:|data:|mailto:|#)/.test(ref)) continue;
      const target = resolve(dirname(file), ref.split('#')[0] ?? ref);
      if (!target.startsWith(SITE + sep)) {
        bad.push(`${relative(SITE, file)} → ${ref} (leaves the site)`);
      } else if (!existsSync(target)) {
        bad.push(`${relative(SITE, file)} → ${ref}`);
      }
    }
  }
  return bad;
}

function* walkHtml(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkHtml(p);
    else if (entry.name.endsWith('.html')) yield p;
  }
}

/* The index a reader searches, written from what was rendered rather than
   from what was parsed: a page that did not make it into the site is not a
   page anybody can find. Titles and the first paragraph — enough to tell two
   pages apart, small enough that fetching it costs nothing.

   `_acceptance` is left out: it is a control surface, and a reader searching
   the manual should not be handed the kitchen sink. */
function writeIndex(): number {
  const entries: { title: string; url: string; text: string }[] = [];
  for (const file of walkHtml(SITE)) {
    const url = relative(SITE, file).split(sep).join('/');
    if (url.startsWith('_')) continue;
    const html = readFileSync(file, 'utf8');
    const title = /<title>([\s\S]*?)<\/title>/.exec(html)?.[1]?.split('—')[0]?.trim() ?? url;
    const first = /<article class="sds-prose">[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/.exec(html)?.[1] ?? '';
    const text = first.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400);
    entries.push({ title, url, text });
  }
  entries.sort((a, b) => a.url.localeCompare(b.url));
  writeFileSync(join(SITE, '_search.json'), JSON.stringify(entries));
  return entries.length;
}

const indexed = writeIndex();

const broken = escapes();
if (broken.length) {
  console.error(`\n✗ ${broken.length} reference(s) do not resolve inside site/:`);
  for (const line of broken.slice(0, 12)) console.error(`  - ${line}`);
  process.exit(1);
}

console.log(`
  ${indexed} pages indexed for search.
  ${PROJECTS.length} project(s) into site/ — the publish root.
  Open http://localhost:4173/ (the port \`make start\` reports), or photograph a page:
    make look ARGS='site/index.html 900'`);
