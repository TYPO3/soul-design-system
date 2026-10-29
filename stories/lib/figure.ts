/* The diagram cards' own scaffolding.

   Most of the diagram specimens are the same card. A drawing named by its
   file, with two notes under it that say what the drawing had to survive.

   The drawing is the element a page uses, `<sds-diagram>`, with the text
   that the file comes from. So the card shows it in the tokens of either mode, the
   way a page shows it. The plane is the card's ground, so it goes on
   `<body>`. */

import { html } from 'lit';
import '../../packages/frontend/src/components/diagram.ts';
import { DIAGRAM_SOURCES } from '../../packages/frontend/src/components/diagrams.svg.generated.ts';
import { indent, part } from './specimen.ts';

/** A drawing this system ships, by its file. */
export interface Figure {
  file: string;
}

const drawing = ({ file }: Figure): string => {
  const name = file.replace(/\.svg$/, '');
  const source = DIAGRAM_SOURCES[name];
  if (!source) throw new Error(`${file}: no .diagram text in assets/diagrams/ — run \`make diagrams\``);
  return `<div>
  <div class="spec-h">${file}</div>
  ${part(html`<sds-diagram name="${name}" .source="${source}"></sds-diagram>`)}
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
