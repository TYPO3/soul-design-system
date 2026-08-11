/* sds-figure — a drawing and the claim it makes.

   The caption is not optional and not a title. A diagram whose point has to be
   inferred means something slightly different to every reader, so the sentence
   under it states the claim the drawing is there to carry — the same sentence
   the drawing would be replaced by if it were cut.

   A drawing ships as two files, one per mode, and both are in the markup. The
   swap is the stylesheet's: which one shows follows the nearest forced mode
   the way every colour does, and `.sds-art--*` in `components.css` says why
   that cannot be `light-dark()` or a `<picture>`. The same two classes carry
   the drawing wherever else it appears, so a thumbnail cannot swap by a
   different rule than the figure it links to.

   `alt` goes on both images. Only one of them is in the box tree, so only one
   is in the accessibility tree — the hidden file is not read out twice, and
   the pair does not need a rule of its own to stay quiet. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

export interface FigureProps {
  /** The drawing. The light file, where there is a pair. */
  src: string;
  /** The dark file. Without one, the same drawing is shown in both modes —
      correct for a photograph, wrong for anything drawn in these tokens. */
  dark?: string;
  /** What the drawing shows, for a reader who cannot see it. */
  alt: string;
  /** The claim, in a sentence. */
  caption?: string | TemplateResult;
}

export class SdsFigure extends SdsElement {
  static override properties = {
    src: { type: String },
    dark: { type: String },
    alt: { type: String },
    caption: { type: String },
  };

  declare src: string;
  declare dark: string;
  declare alt: string;
  declare caption: string | TemplateResult;

  constructor() {
    super();
    this.src = '';
    this.dark = '';
    this.alt = '';
    this.caption = '';
  }

  protected override render(): TemplateResult {
    const art = this.dark
      ? html`<img class="sds-art sds-art--light" src="${this.src}" alt="${this.alt}" />
    <img class="sds-art sds-art--dark" src="${this.dark}" alt="${this.alt}" />`
      : html`<img class="sds-art" src="${this.src}" alt="${this.alt}" />`;

    return html`<figure class="sds-figure">
  <div class="sds-figure__frame">
    ${art}
  </div>
  ${this.caption ? html`<figcaption class="sds-figure__caption">${this.caption}</figcaption>` : ''}
</figure>`;
  }
}

define('sds-figure', SdsFigure);
