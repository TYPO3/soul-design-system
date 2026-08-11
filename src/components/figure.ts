/* sds-figure — a picture and the claim it makes.

   The caption is not optional and not a title. A picture whose point has to be
   inferred means something slightly different to every reader, so the sentence
   under it states the claim it is there to carry — the same sentence the
   picture would be replaced by if it were cut.

   Two things can be in the frame and the element does not ask which. A drawing
   is one SVG written in the tokens, referenced into the page rather than
   linked, so it takes the mode of wherever it is placed. A photograph, a
   screenshot, an illustration is a raster file and is linked, because there is
   nothing in it for a mode to change — the same file in both, which is what
   the illustration rules already say. `src/lib/art.ts` tells the two apart,
   from the drawing's coordinate system and nothing else. */

import { html, type TemplateResult } from 'lit';
import './lightbox.ts';
import { type SdsLightbox } from './lightbox.ts';
import { art } from '../lib/art.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface FigureProps {
  /** The file — a drawing this system ships, or an image. */
  src: string;
  /** What the picture shows, for a reader who cannot see it. */
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
    alt: { type: String },
    caption: { type: String },
    zoomable: { type: Boolean, reflect: true },
  };

  declare src: string;
  declare alt: string;
  declare caption: string | TemplateResult;
  declare zoomable: boolean;

  constructor() {
    super();
    this.src = '';
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
    const picture = art(this.src, this.alt);

    const frame = this.zoomable
      ? html`<a class="sds-figure__zoom" href="${this.src}" title="Open the drawing at full size" @click="${this.zoom}">${picture}</a>`
      : picture;

    return html`<figure class="sds-figure">
  <div class="sds-figure__frame">
    ${frame}
  </div>
  ${this.caption ? html`<figcaption class="sds-figure__caption">${this.caption}</figcaption>` : ''}
  ${this.zoomable
    ? html`<sds-lightbox src="${this.src}" alt="${this.alt}" caption="${typeof this.caption === 'string' ? this.caption : ''}"></sds-lightbox>`
    : ''}
</figure>`;
  }
}

define('sds-figure', SdsFigure);
