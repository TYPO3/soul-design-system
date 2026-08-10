/* What `sds-icon` looks like once there is no browser to resolve it.

   The element renders a `<use>` into the category sprite, which is right
   everywhere a document is displayed. A specimen card is not: it is opened
   with `styles.css` and nothing else, so a reference resolves to nothing and
   the card shows a hole where a glyph belongs.

   This turns those references back into the glyph. The markup comes from a
   generated module rather than from the files beside it, and that is not a
   free choice: the story modules import the render path to build their
   specimen HTML, so this ends up in Storybook's browser bundle, where
   `node:fs` does not exist. It costs nothing where it matters — `src/index.ts`
   never imports the render path, so none of it reaches `soul.js`.

   It lives beside the element rather than inside the render helper because it
   is the icon component's own knowledge: `render.ts` should not know how an
   icon is built any more than it knows how a button is. */

import { ICON_SVG } from './icons.svg.generated.ts';
import type { IconId } from './icons.generated.ts';

/* Any href ending in `#identifier`. The browser reference carries the
   sprite's URL in front of it, resolved against wherever the module sits —
   in Node a `file://` path, which must never reach a card. */
const REFERENCE = /<svg([^>]*)><use href="[^"]*#([a-z0-9-]+)"><\/use><\/svg>/g;

/** The package ships each glyph pretty-printed over several lines. Collapsed
    to the inline form the cards have always carried, which is what lets a
    generated card pixel-match its baseline. The shapes are expanded because a
    card is parsed as HTML, where a self-closing tag on a non-void element does
    not close. */
function glyph(id: string): string {
  const svg = ICON_SVG[id as IconId];
  if (!svg) {
    throw new Error(`unknown icon "${id}" — add its category to CATEGORIES in scripts/icons.ts and run \`make icons\``);
  }
  return svg
    .replace(/[\n\t]/g, ' ')
    .replace(/\s*version="1\.1"/, '')
    .replace(/<(path|rect|circle|polygon|ellipse|line|polyline)([^>]*?)\s*\/>/g, '<$1$2></$1>')
    .trimEnd()
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>$/, '');
}

/** Replace every sprite reference with the glyph it points at. */
export function inlineIconRefs(html: string): string {
  return html.replace(REFERENCE, (_whole, attrs: string, id: string) =>
    `<svg${attrs}>${glyph(id)}</svg>`);
}
