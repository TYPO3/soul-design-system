/* What referenced artwork looks like once there is no server to resolve it.

   A card is opened from disk, where every file is its own origin: the `<use>`
   is refused before it is fetched. So the artwork is put where the reference
   was, out of a generated module rather than the files beside it — the story
   modules pull this into Storybook's bundle, where `node:fs` does not exist.

   The two go in differently, and `scripts/diagrams.ts` says why: a drawing's
   wrapper carries its coordinate system, so its shapes go in loose, while a
   mark arrives as a nested `<svg>` bringing its own. */

import { DIAGRAM_SHAPES, MARK_SVG } from './diagrams.svg.generated.ts';

/* The reference `art()` writes: a path ending in the file, and the name every
   piece of artwork points at. Run before the icons are inlined — `#soul-ref` fits
   the shape of an icon reference too, and would be looked up as one. */
const REFERENCE = /<use href="([^"#]*\/)?([a-z0-9-]+)\.svg#soul-ref"><\/use>/g;

/** Replace every reference with the artwork it points at. */
export function inlineArtRefs(html: string): string {
  return html.replace(REFERENCE, (whole, _dir: string | undefined, name: string) => {
    /* Left alone rather than thrown on: a `<use href="…#soul-ref">` this does not
       know is a consumer's own artwork, and a card that ships one is not this
       repo's card. */
    return DIAGRAM_SHAPES[name] ?? MARK_SVG[name] ?? whole;
  });
}
