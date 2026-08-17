/* What a package under `packages/` is made of, and how one is assembled.

   One definition, read from three sides: `scripts/split.ts` mirrors these into
   the repositories they are published from, the gate assembles them to ask
   whether they still stand alone, and `scripts/guides.ts` assembles the theme
   to render this site against the package instead of against the tree. */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/* Every path that has moved is named twice: a mirror knowing only today's
   spelling replays half the history as an empty package. Newest first — the
   first one that exists in a tree is the one used. */
const THEME_AT = ['packages/guides-theme', 'guides-theme'];
const DROP_AT = ['packages/frontend/dist', 'dist'];
const ASSETS_AT = ['packages/frontend/assets', 'assets'];

/* What the theme package is made of. `acceptance/` is not in it: the control
   surface the theme is developed against, pointing at cards generated here.
   `LICENSE` is in the package directory rather than fetched from the root of
   this tree: npm packs a directory, so a licence only assembly knows about is
   one the npm tarball ships without and nothing here can see. */
const FROM_THEME = ['composer.json', 'README.md', 'LICENSE', 'src', 'resources/config', 'resources/template'];

/* The drop-in, minus the four that only ever reach npm: a PHP project installs
   no ESM package and reads no declarations. */
const NOT_IN_THE_DROP_IN = ['index.js', 'index.js.map', 'types', 'tsconfig.json'];

/* What the drop-in leaves out and the theme takes anyway. This package is the
   whole of what a Composer project gets — it has no npm install to reach for
   an illustration — and it is copied from where it is kept rather than through
   `dist/`, which carries what a page fetches and the icons its lookup names. */
const FROM_ASSETS = ['placeholders'];


/** Every file under a directory, relative to it — the package, not the
    repository it is kept in. */
export function* walk(dir: string, base = dir): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path, base);
    else yield relative(base, path);
  }
}

/** Every icon lookup in a package, against the files it names. A lookup is a
    promise about paths, it travels wherever the icons do, and a package
    answering one of those paths with nothing is the failure this asks about —
    once per copy, because the copies are what went wrong. */
const unresolved = (pkg: string): string[] => [...walk(pkg)]
  .filter((file) => file.endsWith(join('icons', 'icons.json')))
  .flatMap((file) => {
    const beside = join(pkg, file, '..');
    const { icons } = JSON.parse(readFileSync(join(pkg, file), 'utf8')) as { icons: Record<string, { svg: string }> };
    const named = Object.values(icons);
    const absent = named.filter((icon) => !existsSync(join(beside, icon.svg)));
    return absent.length
      ? [`${file.split(sep).join('/')} names ${named.length} icon(s) and ${absent.length} of them are not in the package — ${absent[0]?.svg} is the first`]
      : [];
  });

/** The first of several places that exists in a tree, told apart by a file that
    proves it is the package and not a directory of the same name. */
const found = (tree: string, places: readonly string[], proof: string): string | undefined =>
  places.map((at) => join(tree, at)).find((path) => existsSync(join(path, proof)));

export interface Package {
  /** What `make split ARGS=<name>` is called, and its directory under `.out/split/`. */
  name: string;
  /** Where it is published. */
  remote: string;
  /** Which paths a commit has to touch to belong to its history. */
  concerns: readonly string[];
  /** The manifest that says a package was assembled at all. */
  manifest: string;
  /** Where it is written in a given tree, if that tree has it. */
  at: (tree: string) => string | undefined;
  /** Build it out of one tree into an empty directory. */
  assemble: (tree: string, into: string) => void;
  /** What a project that installed it would find missing, said in the terms of
      what breaks. Each line is something left out of a package before. */
  incomplete: (pkg: string, tree: string) => string[];
}

export const PACKAGES: readonly Package[] = [
  {
    name: 'guides-theme',
    remote: 'git@github.com:TYPO3/soul-guides-theme.git',
    concerns: [...THEME_AT, ...DROP_AT, ...ASSETS_AT],
    manifest: 'composer.json',
    at: (tree) => found(tree, THEME_AT, 'composer.json'),

    /* The theme, and the drop-in it links — which lives in the other package
       and cannot be a Composer dependency of this one. Nothing is required to
       exist: a tree from before a file was written assembles into the package
       that release was. */
    assemble(tree, into) {
      const theme = this.at(tree);
      if (!theme) return;
      for (const path of FROM_THEME) {
        const from = join(theme, path);
        if (existsSync(from)) cpSync(from, join(into, path), { recursive: true });
      }

      const drop = found(tree, DROP_AT, 'soul.css');
      if (drop) {
        const out = join(into, 'resources', 'dist');
        mkdirSync(out, { recursive: true });
        for (const entry of readdirSync(drop)) {
          if (NOT_IN_THE_DROP_IN.includes(entry)) continue;
          cpSync(join(drop, entry), join(out, entry), { recursive: true });
        }
        const assets = found(tree, ASSETS_AT, 'icons');
        for (const path of assets ? FROM_ASSETS : []) {
          const from = join(assets as string, path);
          if (existsSync(from)) cpSync(from, join(out, 'assets', path), { recursive: true });
        }
      }
      writeFileSync(join(into, '.gitignore'), 'vendor/\ncomposer.lock\n');
    },

    incomplete(pkg, tree) {
      const missing = [
        'composer.json', 'README.md', 'LICENSE',
        'src/DependencyInjection/SoulExtension.php',
        'resources/config/soul.php',
        'resources/template/structure/layout.html.twig',
        'resources/dist/soul.css', 'resources/dist/soul.js',
        'resources/dist/soul-boot.js',
        'resources/dist/soul-finish.js',
      ].filter((path) => !existsSync(join(pkg, path)));

      /* Counted rather than listed: a template that stops being copied renders
         the core's own markup, which looks like a styling bug and is not one. */
      const twig = (dir: string): number =>
        (existsSync(dir) ? [...walk(dir)].filter((f) => f.endsWith('.html.twig')).length : 0);
      const here = twig(join(this.at(tree) ?? '', 'resources', 'template'));
      const there = twig(join(pkg, 'resources', 'template'));
      if (here !== there) missing.push(`${here - there} template(s) did not make it into the package`);

      const drop = join(pkg, 'resources', 'dist');
      if (!existsSync(join(drop, 'fonts')) || readdirSync(join(drop, 'fonts')).length === 0) {
        missing.push('resources/dist/fonts/ is empty — the site would serve system-ui');
      }
      if (!existsSync(join(drop, 'assets', 'icons', 'sprites'))) {
        missing.push('resources/dist/assets/icons/sprites/ is missing — every icon would be a blank box');
      }
      /* What a project has no second package to fetch from. The icons travel
         with the lookup that names them and are checked with it below; this is
         the one a media slot is filled with. */
      const art = join(drop, 'assets', 'placeholders');
      if (!existsSync(art) || readdirSync(art).length === 0) {
        missing.push('resources/dist/assets/placeholders/ is empty — a card with a media slot has nothing to put in it');
      }
      missing.push(...unresolved(pkg));
      const name = (JSON.parse(readFileSync(join(pkg, 'composer.json'), 'utf8')) as { name?: string }).name;
      if (name !== 'typo3/soul-guides-theme') missing.push(`composer.json names ${name}, not typo3/soul-guides-theme`);
      return missing;
    },
  },

  {
    name: 'frontend',
    remote: 'git@github.com:TYPO3/soul-frontend.git',
    concerns: ['packages/frontend'],
    manifest: 'package.json',
    at: (tree) => found(tree, ['packages/frontend'], 'package.json'),

    /* This one is its own directory, so assembling it is copying it. Its
       history starts where that directory does: before it, what is here was the
       monorepo's root, which was never a package anybody could install. */
    assemble(tree, into) {
      const dir = this.at(tree);
      if (!dir) return;
      for (const entry of readdirSync(dir)) {
        if (entry === '.dist-check' || entry === 'node_modules') continue;
        cpSync(join(dir, entry), join(into, entry), { recursive: true });
      }
      writeFileSync(join(into, '.gitignore'), 'node_modules/\n');
    },

    incomplete(pkg) {
      const missing = [
        'package.json', 'README.md', 'LICENSE',
        /* Generated, and shipped: `src/` is published and its own modules
           import these two. Nothing on the way out builds anything — a mirror
           replays what git has and a publish packs a checkout — so a generated
           file a package imports is a file git has to keep. */
        'src/components/icons.generated.ts', 'src/components/icons.svg.generated.ts',
        'src/index.ts', 'src/styles/styles.css', 'src/styles/reset.css',
        'src/styles/base.css', 'src/styles/layout.css', 'src/styles/components.css',
        'src/styles/components/card.css',
        'dist/soul.css', 'dist/soul.js', 'dist/soul-boot.js',
        'dist/index.js',
      ].filter((path) => !existsSync(join(pkg, path)));

      if (!existsSync(join(pkg, 'fonts')) || readdirSync(join(pkg, 'fonts')).length === 0) {
        missing.push('fonts/ is empty — every surface linking this falls back to system-ui');
      }

      missing.push(...unresolved(pkg));
      const manifest = JSON.parse(readFileSync(join(pkg, 'package.json'), 'utf8')) as { name?: string; private?: boolean };
      if (manifest.name !== '@typo3/soul-frontend') missing.push(`package.json names ${manifest.name}, not @typo3/soul-frontend`);
      /* The workspace root is private on purpose, and this must never be: that
         flag is the difference between a package and a refusal to publish. */
      if (manifest.private) missing.push('package.json is private — npm would refuse to publish it');
      return missing;
    },
  },
];
