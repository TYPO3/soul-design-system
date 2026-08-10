/* What `sds-icon` looks like once there is no browser to resolve it.

   The element renders a `<use>` into the category sprite, which is right
   everywhere a document is being displayed. A specimen card is not: it is
   opened with `styles.css` and nothing else, so a reference resolves to
   nothing and the card shows a hole where a glyph belongs.

   This turns those references back into the glyph. It lives beside the
   element rather than inside the render helper because it is the icon
   component's own knowledge — `render.ts` should not know how an icon is
   built any more than it knows how a button is.

   It is a separate module from `icon.ts` on purpose. The markup table is
   200 kB of strings, and the browser bundle must not carry them; the only
   importer of this file runs in Node. */

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
function inline(svg: string): string {
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
  return html.replace(REFERENCE, (_whole, attrs: string, id: string) => {
    const svg = ICON_SVG[id as IconId];
    if (!svg) {
      throw new Error(`unknown icon "${id}" — add its category to CATEGORIES in scripts/icons.ts and run \`make icons\``);
    }
    return `<svg${attrs}>${inline(svg)}</svg>`;
  });
}
