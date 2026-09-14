/* sds-figure — a picture and the claim it makes.

   The caption is not optional and not a title. A picture with no stated point
   means something different to every reader. So the sentence under it states
   the claim — the one that stands in for the picture.

   The element does not ask what is in the frame. It shows the file it gets,
   as an image, and the ground under it is the one for colours that do not
   follow the page. `src/lib/art.ts` holds why. */

import { html, type TemplateResult } from 'lit';
import { art, exported } from '../lib/art.ts';
import { define, SdsElement } from '../lib/element.ts';
import { zoom } from '../lib/zoom.ts';

export interface FigureProps {
  /** The file — a drawing this system ships, or an image. */
  src: string;
  /** What the picture shows, for a reader who cannot see it. */
  alt: string;
  /** The claim, in a sentence. */
  caption?: string | TemplateResult;
  /** Pressable, and it opens the drawing at its own size. The trigger is a
      link to the file, so a surface with no script still opens it. The
      element only takes the press over once it has upgraded. Worth it for
      anything drawn wider than its column, pointless for a photograph. */
  zoomable?: boolean;
}

/* A caption between the tags, told apart from the picture by the class the
   component emits for it. The marker `sds-code` and `sds-embed` both use, for
   the same reasons. Light DOM has no slot to name it with, and a class the
   stylesheet already defines makes the caption read before the upgrade. */
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
    width: { type: Number },
    height: { type: Number },
    zoomable: { type: Boolean, reflect: true },
  };

  declare src: string;
  declare alt: string;
  declare caption: string | TemplateResult;
  /** The picture's own size, where a document declared one. A figure fills its
      column and needs neither. A drawing that states a width in the source
      states a fact about the file. An element that dropped it left the
      renderer to write the `<img>` itself. */
  declare width?: number;
  /** The drawing’s own height in pixels, so the page holds the space before
      it loads and does not jump under the reader. */
  declare height?: number;
  declare zoomable: boolean;

  /* The picture a renderer wrote, taken before Lit renders over it. `src` is
     the form a story or a product surface uses. A renderer that writes HTML
     cannot. The picture must be on the page before any script runs, or a
     reader gets a caption under an empty frame. Kept exactly as `sds-code`
     keeps a block that arrived coloured. */
  private taken: Node[] | null = null;

  /* And its caption, where that stood between the tags too. A caption from a
     document carries markup — a literal, a link, an emphasis — and an
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

  protected override render(): TemplateResult {
    /* What a renderer wrote, where it wrote one. The two forms answer the
       same question and the nodes win, because they are already in the page.
       A rewrite from `src` replaces a picture the reader can see with a
       second request for the same file. */
    const given = this.taken ?? this.content;
    const picture = given
      ? html`${given}`
      : art(this.src, this.alt, { width: this.width, height: this.height });

    /* The viewer carries the claim into its head, where the caption is a
       sentence. A caption between the tags is markup and the viewer takes an
       attribute, so that one arrives as the alt text instead. */
    const press = this.zoomable
      ? zoom(this, picture, {
          src: this.src,
          alt: this.alt,
          caption: typeof this.caption === 'string' ? this.caption : '',
        })
      : null;

    /* Whichever form the caption arrived in, nodes first. Kept as it came
       rather than wrapped. A renderer writes the `<figcaption>` itself, which
       is the tag it must be inside this `<figure>`, and a wrapper nests one
       caption in another. */
    const caption = this.captioned
      ? html`${this.captioned}`
      : this.caption
        ? html`<figcaption class="sds-figure__caption">${this.caption}</figcaption>`
        : '';

    return html`<figure class="sds-figure">
  <div class="sds-figure__frame${exported(this.src) ? ' sds-figure__frame--exported' : ''}">
    ${press ? press.trigger : picture}
  </div>
  ${caption}
  ${press ? press.viewer : ''}
</figure>`;
  }
}

define('sds-figure', SdsFigure);
