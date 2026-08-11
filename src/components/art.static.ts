/* What referenced artwork looks like once there is no server to resolve it.

   `art()` references the file with `<use>`, which is what lets the page's
   tokens reach the shapes. A specimen card is opened from disk: every file is
   its own origin there, the reference is refused before it is fetched, and the
   card shows an empty frame where the drawing belongs.

   So the artwork is put where the reference was. Same trade as
   `icon.static.ts`, and for the same reason — it comes from a generated module
   rather than from the files beside it, because the story modules import this
   path into Storybook's browser bundle, where `node:fs` does not exist.
   `src/index.ts` never imports it, so none of it reaches `soul.js`.

   Inlining also settles the colours the only other way they could be settled:
   the shapes are now in the document, so `var(--text-primary)` resolves
   against the card the same as it would against a page.

   The two kinds go in differently, and `scripts/diagrams.ts` says why: a
   drawing's wrapper already carries its coordinate system, so the shapes go in
   loose, while a mark's wrapper carries only a size and the mark arrives as a
   nested `<svg>` bringing its own. */

import { DIAGRAM_SHAPES, MARK_SVG } from './diagrams.svg.generated.ts';

/* The reference `art()` writes: a path ending in the file, and the name every
   piece of artwork points at. Run before the icons are inlined — `#art` fits
   the shape of an icon reference too, and would be looked up as one. */
const REFERENCE = /<use href="([^"#]*\/)?([a-z0-9-]+)\.svg#art"><\/use>/g;

/** Replace every reference with the artwork it points at. */
export function inlineArtRefs(html: string): string {
  return html.replace(REFERENCE, (whole, _dir: string | undefined, name: string) => {
    /* Left alone rather than thrown on: a `<use href="…#art">` this does not
       know is a consumer's own artwork, and a card that ships one is not this
       repo's card. */
    return DIAGRAM_SHAPES[name] ?? MARK_SVG[name] ?? whole;
  });
}
