/* The diagram cards' own scaffolding.

   Three of the four diagram specimens are the same card: a drawing shown as
   the light/dark pair it ships as, with two notes under it saying what the
   drawing had to survive. Written out per card that was three copies of one
   layout, and the pair markup is the part that must not drift — a card that
   showed one file of a pair would document the half of the system that is
   easy.

   The figures sit on the sunken plane, which is the card's ground rather than
   a box inside it, so the class goes on `<body>` through `bodyClass` on the
   card rather than on a wrapper here. */

import { indent } from './specimen.ts';

/** One file of the pair: what it is called, and what it draws for a reader
    who cannot see it. */
export interface Figure {
  file: string;
  alt: string;
}

const figure = ({ file, alt }: Figure): string =>
  `<div>
  <div class="spec-h">${file}</div>
  <img src="../assets/diagrams/${file}" alt="${alt}" class="spec-figure spec-figure--framed" />
</div>`;

/**
 * A drawing as the two files it ships as, with the notes under it.
 *
 * The light file is named without a suffix and the dark one carries `-dark`,
 * which is the convention the generator writes and the `<picture>` in a
 * consuming page selects between.
 */
export const figurePair = (light: Figure, dark: Figure, notes: readonly string[]): string =>
  `<div style="padding:18px 20px; display:flex; flex-direction:column; gap:14px;">
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
${indent([figure(light), figure(dark)].join('\n'), 2)}</div>
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px 26px; border-top:1px solid var(--border-subtle); padding-top:12px;">
${indent(notes.map((n) => `<div class="spec-note">${n}</div>`).join('\n'), 4)}
  </div>
</div>`;
