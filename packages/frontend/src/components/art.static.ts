/* What referenced artwork looks like once there is no server to resolve it.

   A card opens from disk, where every file is its own origin: the browser
   refuses the `<use>` before any fetch. So the artwork goes where the
   reference was, out of a generated module rather than the files beside it.
   The story modules pull this into Storybook's bundle, which has no `node:fs`.

   The two go in differently, and `scripts/diagrams.ts` says why. A drawing's
   wrapper carries its coordinate system, so its shapes go in loose. A mark
   arrives as a nested `<svg>` with its own. */

import { DIAGRAM_SHAPES, MARK_SVG } from './diagrams.svg.generated.ts';

/* The reference `art()` writes: a path that ends in the file, and the name
   every piece of artwork points at. Run before the icons inline — `#soul-ref`
   fits the shape of an icon reference too, and the lookup takes it for one. */
const REFERENCE = /<use href="([^"#]*\/)?([a-z0-9-]+)\.svg#soul-ref"><\/use>/g;

/** Replace every reference with the artwork it points at. */
export function inlineArtRefs(html: string): string {
  return html.replace(REFERENCE, (whole, _dir: string | undefined, name: string) => {
    /* Left alone rather than thrown on. A `<use href="…#soul-ref">` this does
       not know is a consumer's own artwork, and a card that ships one is not
       this repo's card. */
    return DIAGRAM_SHAPES[name] ?? MARK_SVG[name] ?? whole;
  });
}
