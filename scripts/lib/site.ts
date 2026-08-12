/* What happens to a rendered site after the renderer has finished with it.

   `phpdocumentor/guides` writes documents. It does not know that the elements
   on a page have to be drawn before a reader without a script arrives, that the
   bar searches an index nothing has written, or that a stylesheet it never
   parsed has to stand beside the output. Those are the three steps between a
   render and a site. They live here rather than in `scripts/guides.ts` because
   the same three run in a project that has only Composer, out of
   `dist/soul-finish.js` — one implementation, so the site published here and
   the site somebody else builds are built by the same code. */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

import { prerender } from './prerender.ts';

/* What a page links, and what those files ask for beside themselves. The
   stylesheet reaches for `fonts/` and the script resolves the icon sprite
   against its own URL, so the six travel together or the site serves
   `system-ui` and blank boxes with nothing in the log. */
export const DROP_IN = ['soul.css', 'document.css', 'soul.js', 'soul-boot.js', 'fonts', 'assets'];

/** Every rendered page under a directory. */
export function* pages(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* pages(p);
    else if (entry.name.endsWith('.html')) yield p;
  }
}

/** The drop-in, into the output, in one piece. Returns what was copied. */
export function dropIn(from: string, into: string): string[] {
  const copied: string[] = [];
  mkdirSync(into, { recursive: true });
  for (const name of DROP_IN) {
    const source = join(from, name);
    if (!existsSync(source)) continue;
    cpSync(source, join(into, name), { recursive: true });
    copied.push(name);
  }
  return copied;
}

/* Every element in the site, rendered before the browser gets there — what lets
   the theme *address* a component rather than rebuild one; `prerender.ts` holds
   the reasoning. Over the output rather than inside the PHP, because the
   renderer is a Composer package and the components are TypeScript. */
export function draw(root: string): number {
  let drawn = 0;
  for (const file of pages(root)) {
    const page = readFileSync(file, 'utf8');
    const done = prerender(page);
    if (done === page) continue;
    writeFileSync(file, done);
    drawn++;
  }
  return drawn;
}

/* The index the bar searches, written from what was rendered rather than what
   was parsed: a page that did not make it into the site is not one anybody can
   find. A title, a URL and the first paragraph — enough to tell two pages apart
   and small enough that fetching it costs nothing. A path beginning with an
   underscore is a control surface and is left out. */
export function index(root: string, name = '_search.json'): number {
  const entries: { title: string; url: string; text: string }[] = [];
  for (const file of pages(root)) {
    const url = relative(root, file).split(sep).join('/');
    if (url.split('/').some((part) => part.startsWith('_'))) continue;
    const html = readFileSync(file, 'utf8');
    const title = /<title>([\s\S]*?)<\/title>/.exec(html)?.[1]?.split('—')[0]?.trim() ?? url;
    const first = /<article class="sds-prose">[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/.exec(html)?.[1] ?? '';
    const text = first.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400);
    entries.push({ title, url, text });
  }
  entries.sort((a, b) => a.url.localeCompare(b.url));
  writeFileSync(join(root, name), JSON.stringify(entries));
  return entries.length;
}

/* Nothing may point outside the site. A reference that resolves during the
   build because the build happened in a checkout resolves to nothing on the
   server, and arrives as a page with no stylesheet rather than as an error
   somebody reads. `--fail-on-error` covers the references the renderer knows
   about and says nothing about the ones a theme or a copy step introduced. */
export function escapes(root: string): string[] {
  const bad: string[] = [];
  for (const file of pages(root)) {
    const text = readFileSync(file, 'utf8').replace(/&lt;[\s\S]*?&gt;/g, '');
    for (const m of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const ref = m[1];
      if (!ref || /^(https?:|data:|mailto:|#)/.test(ref)) continue;
      const target = resolve(dirname(file), ref.split('#')[0] ?? ref);
      if (!target.startsWith(root + sep)) {
        bad.push(`${relative(root, file)} → ${ref} (leaves the site)`);
      } else if (!existsSync(target)) {
        bad.push(`${relative(root, file)} → ${ref}`);
      }
    }
  }
  return bad;
}

export interface Finished {
  /** Pages that carry their elements already rendered. */
  drawn: number;
  /** Pages in the search index, or `null` where none was written. */
  indexed: number | null;
  /** References that do not resolve inside the site. */
  broken: string[];
}

/** The three steps between a render and a site, in the one order that works:
    drawing before indexing, because a card's title lives in the element until
    it is drawn; checking last, because the copy step is one of the things that
    can break a reference. */
export function finish(root: string, options: { drop?: string; styles?: string; search?: string | false } = {}): Finished {
  const { drop, styles = 'styles', search = '_search.json' } = options;
  if (drop) dropIn(drop, join(root, styles));
  const drawn = draw(root);
  const indexed = search === false ? null : index(root, search);
  return { drawn, indexed, broken: escapes(root) };
}
