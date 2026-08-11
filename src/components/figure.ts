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
import './lightbox.ts';
import { type SdsLightbox } from './lightbox.ts';
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
  /** Pressable, opening the drawing at the size it was drawn.

      The trigger is a link to the file. A surface running no script still
      opens the drawing with it, and the element takes the press over once it
      has upgraded — so this is never a control that looks like one and does
      nothing. Worth it for anything drawn wider than the column it sits in,
      and pointless for a photograph shown whole. */
  zoomable?: boolean;
}

export class SdsFigure extends SdsElement {
  static override properties = {
    src: { type: String },
    dark: { type: String },
    alt: { type: String },
    caption: { type: String },
    zoomable: { type: Boolean, reflect: true },
  };

  declare src: string;
  declare dark: string;
  declare alt: string;
  declare caption: string | TemplateResult;
  declare zoomable: boolean;

  constructor() {
    super();
    this.src = '';
    this.dark = '';
    this.alt = '';
    this.caption = '';
    this.zoomable = false;
  }

  /** Take the press over from the link. Only where there is something to take
      it over with: if the viewer has not upgraded, the browser follows the
      href and the reader still gets the drawing. */
  private zoom(event: Event): void {
    const viewer = this.querySelector('sds-lightbox') as SdsLightbox | null;
    if (!viewer?.show) return;
    event.preventDefault();
    viewer.show();
  }

  protected override render(): TemplateResult {
    const art = this.dark
      ? html`<img class="sds-art sds-art--light" src="${this.src}" alt="${this.alt}" />
    <img class="sds-art sds-art--dark" src="${this.dark}" alt="${this.alt}" />`
      : html`<img class="sds-art" src="${this.src}" alt="${this.alt}" />`;

    const frame = this.zoomable
      ? html`<a class="sds-figure__zoom" href="${this.src}" title="Open the drawing at full size" @click="${this.zoom}">${art}</a>`
      : art;

    return html`<figure class="sds-figure">
  <div class="sds-figure__frame">
    ${frame}
  </div>
  ${this.caption ? html`<figcaption class="sds-figure__caption">${this.caption}</figcaption>` : ''}
  ${this.zoomable
    ? html`<sds-lightbox src="${this.src}" dark="${this.dark}" alt="${this.alt}" caption="${typeof this.caption === 'string' ? this.caption : ''}"></sds-lightbox>`
    : ''}
</figure>`;
  }
}

define('sds-figure', SdsFigure);
