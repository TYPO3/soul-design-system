/* The diagram cards' own scaffolding.

   Three of the four diagram specimens are the same card: a drawing, named by
   its file, with two notes under it saying what the drawing had to survive.
   Written out per card that was three copies of one layout.

   The drawing is referenced rather than linked, which is the part that must
   not drift: a card that showed the file through an `<img>` would show it in
   the light it was drawn in whatever mode the card was shot in, and these
   cards are shot in both. `src/lib/art.ts` holds the reason; the reference is
   written out here rather than through `sds-figure`, because what these cards
   document is the drawing and not the frame around it.

   The figures sit on the sunken plane, which is the card's ground rather than
   a box inside it, so the class goes on `<body>` through `bodyClass` on the
   card rather than on a wrapper here. */

import { inlineArtRefs } from '../../src/components/art.static.ts';
import { DIAGRAM_VIEWBOX } from '../../src/components/diagrams.generated.ts';
import { indent } from './specimen.ts';

/** A drawing: what it is called, and what it draws for a reader who cannot
    see it. */
export interface Figure {
  file: string;
  alt: string;
}

const drawing = ({ file, alt }: Figure): string => {
  const name = file.replace(/\.svg$/, '');
  const viewBox = DIAGRAM_VIEWBOX[name];
  if (!viewBox) throw new Error(`${file}: not a drawing this system ships — run \`make diagrams\``);
  return `<div>
  <div class="spec-h">${file}</div>
  ${inlineArtRefs(
    `<svg viewBox="${viewBox}" role="img" aria-label="${alt}" class="spec-figure spec-figure--framed"><use href="../../assets/diagrams/${file}#art"></use></svg>`,
  )}
</div>`;
};

/** A drawing with the notes under it. */
export const figureCard = (figure: Figure, notes: readonly string[]): string =>
  `<div style="padding:18px 20px; display:flex; flex-direction:column; gap:14px;">
${indent(drawing(figure), 2)}
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px 26px; border-top:1px solid var(--border-subtle); padding-top:12px;">
${indent(notes.map((n) => `<div class="spec-note">${n}</div>`).join('\n'), 4)}
  </div>
</div>`;
