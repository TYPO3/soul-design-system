/* The diagram cards' own scaffolding.

   Most of the diagram specimens are the same card: a drawing named by its file,
   with two notes under it saying what the drawing had to survive.

   The drawing is referenced rather than linked, which is the part that must not
   drift — through an `<img>` it would show in the light it was drawn in
   whatever mode the card was shot in, and these are shot in both. Written out
   rather than through `sds-figure`, because what these document is the drawing
   and not the frame. The plane is the card's ground, so it goes on `<body>`. */

import { inlineArtRefs } from '../../packages/frontend/src/components/art.static.ts';
import { DIAGRAM_VIEWBOX } from '../../packages/frontend/src/components/diagrams.generated.ts';
import { REF } from '../../packages/frontend/src/lib/art.ts';
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
    /* The name from the one place that writes it. Spelled out here once, it
       went stale the first time it changed and the card shipped a reference
       into nothing — which every check reads as a card of the right height. */
    `<svg viewBox="${viewBox}" role="img" aria-label="${alt}" class="spec-figure spec-figure--framed"><use href="../../assets/diagrams/${file}#${REF}"></use></svg>`,
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
