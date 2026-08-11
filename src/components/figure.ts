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

/* A caption written between the tags, told apart from the picture by the class
   the component itself would emit for it — the marker `sds-code` and
   `sds-embed` both use, and for the same reasons: light DOM has no slot to
   name it with, and a class the stylesheet already defines is what makes the
   caption read in the window before the upgrade. */
const isCaption = (node: Node): boolean =>
  node.nodeType === 1 && (node as Element).matches('.sds-figure__caption');

/* The newlines a template left between the tags, and the markers Lit leaves
   among its own bindings. Neither is a picture. */
const isNothing = (node: Node): boolean =>
  node.nodeType === 8 || (node.nodeType === 3 && !(node.textContent ?? '').trim());

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

  /* The picture a renderer wrote, taken before Lit renders over it.

     `src` is the form a story or a product surface uses: a path, and the
     element decides from it whether the file is referenced or linked. A
     documentation renderer cannot use that form — it writes HTML, and the
     picture has to be in the page before any script has run, or a reader
     without one gets a caption under an empty frame. So it writes the picture
     itself and this keeps it, exactly as `sds-code` keeps a block that
     arrived already coloured. */
  private taken: Node[] | null = null;

  /* And its caption, where that was written between the tags too: a caption
     from a document carries markup — a literal, a link, an emphasis — and an
     attribute is a string. */
  private captioned: Node[] | null = null;

  constructor() {
    super();
    this.src = '';
    this.alt = '';
    this.caption = '';
    this.zoomable = false;
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isNothing(node));
    const caption = written.filter(isCaption);
    const picture = written.filter((node) => !isCaption(node));
    if (caption.length) this.captioned = caption;
    if (picture.length) this.taken = picture;
    super.connectedCallback();
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
    /* What a renderer wrote, where it wrote one. The two forms answer the
       same question and the nodes win, because they are already in the page:
       rewriting them from `src` would replace a picture the reader can see
       with a second request for the same file. */
    const picture = this.taken ? html`${this.taken}` : art(this.src, this.alt);

    const frame = this.zoomable
      ? html`<a class="sds-figure__zoom" href="${this.src}" title="Open the drawing at full size" @click="${this.zoom}">${picture}</a>`
      : picture;

    /* Whichever form the caption arrived in — the nodes first, for the same
       reason and with the same markup in them.

       Kept as it came rather than wrapped: a renderer writes the `<figcaption>`
       itself, which is the tag it has to be once this element has rendered the
       `<figure>` around it, and wrapping it would nest one caption inside
       another. */
    const caption = this.captioned
      ? html`${this.captioned}`
      : this.caption
        ? html`<figcaption class="sds-figure__caption">${this.caption}</figcaption>`
        : '';

    return html`<figure class="sds-figure">
  <div class="sds-figure__frame">
    ${frame}
  </div>
  ${caption}
  ${this.zoomable
    ? html`<sds-lightbox src="${this.src}" alt="${this.alt}" caption="${typeof this.caption === 'string' ? this.caption : ''}"></sds-lightbox>`
    : ''}
</figure>`;
  }
}

define('sds-figure', SdsFigure);
