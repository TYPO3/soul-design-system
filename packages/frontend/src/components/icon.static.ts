/* What `sds-icon` looks like once there is no browser to resolve it.

   The element renders a `<use>` into the category sprite, and a card opened
   with `styles.css` and nothing else resolves that to a hole. This turns the
   references back into glyphs, out of a generated module rather than the files
   beside it: the story modules pull the render path into Storybook's browser
   bundle, where `node:fs` does not exist. `src/index.ts` never imports it.

   Beside the element, not inside the renderer: `render.ts` should no more know
   how an icon is built than how a button is. */

import { ICON_SVG } from './icons.svg.generated.ts';
import type { IconId } from './icons.generated.ts';

/* A reference into a sprite, and only into a sprite: the browser reference
   carries the sprite's URL in front of the identifier, which in Node is a
   `file://` path and must never reach a card. The path is part of the pattern
   rather than left to the order things run in — a referenced drawing has the
   same `<use href="…#soul-ref">` shape, and would be looked up as an icon. */
const REFERENCE = /<svg([^>]*)><use href="[^"]*\/sprites\/[^"]*#([a-z0-9-]+)"><\/use><\/svg>/g;

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
