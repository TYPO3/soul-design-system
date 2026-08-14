/* sds-figure — a picture and the claim it makes.

   The caption is not optional and not a title: a picture whose point has to be
   inferred means something slightly different to every reader, so the sentence
   under it states the claim — the one the picture would be replaced by.

   The element does not ask what is in the frame. A drawing is referenced so it
   takes the mode of wherever it is placed; a raster file is linked, having
   nothing in it for a mode to change. `src/lib/art.ts` tells the two apart. */

import { html, type TemplateResult } from 'lit';
import { art } from '../lib/art.ts';
import { define, SdsElement } from '../lib/element.ts';
import { zoom } from '../lib/zoom.ts';

export interface FigureProps {
  /** The file — a drawing this system ships, or an image. */
  src: string;
  /** What the picture shows, for a reader who cannot see it. */
  alt: string;
  /** The claim, in a sentence. */
  caption?: string | TemplateResult;
  /** Pressable, opening the drawing at the size it was drawn. The trigger is a
      link to the file, so a surface running no script still opens it and the
      element only takes the press over once it has upgraded. Worth it for
      anything drawn wider than its column, pointless for a photograph. */
  zoomable?: boolean;
  /** The picture is linked rather than referenced — an SVG that never named
      `id="art"`. Written by the build, which is what can read the file;
      `src/lib/art.ts` holds the reasoning. */
  linked?: boolean;
  /** The referenced file's own `viewBox`, from the same reader — a reference
      carries no coordinate system across, and the frame keeps the picture's
      shape at every width only where the wrapper has one. */
  viewBox?: string;
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
    width: { type: Number },
    height: { type: Number },
    zoomable: { type: Boolean, reflect: true },
    linked: { type: Boolean },
    viewBox: { attribute: 'view-box', type: String },
  };

  declare src: string;
  declare alt: string;
  declare caption: string | TemplateResult;
  /** The picture's own size, where a document declared one. A figure fills its
      column and needs neither; a drawing that states a width in the source is
      stating a fact about the file, and dropping it left the renderer writing
      the `<img>` itself to keep it. */
  declare width?: number;
  declare height?: number;
  declare zoomable: boolean;
  declare linked: boolean;
  declare viewBox?: string;

  /* The picture a renderer wrote, taken before Lit renders over it. `src` is
     the form a story or a product surface uses; a renderer writing HTML cannot,
     because the picture has to be on the page before any script runs or a
     reader gets a caption under an empty frame. Kept exactly as `sds-code`
     keeps a block that arrived coloured. */
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
    this.linked = false;
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
       same question and the nodes win, because they are already in the page:
       rewriting them from `src` would replace a picture the reader can see
       with a second request for the same file. */
    const given = this.taken ?? this.content;
    const picture = given
      ? html`${given}`
      : art(this.src, this.alt, { width: this.width, height: this.height, linked: this.linked, viewBox: this.viewBox });

    /* The viewer carries the claim into its head, where the caption is a
       sentence; a caption written between the tags is markup and the viewer
       takes an attribute, so that one arrives as the alt text instead. */
    const press = this.zoomable
      ? zoom(this, picture, {
          src: this.src,
          alt: this.alt,
          linked: this.linked,
          viewBox: this.viewBox,
          caption: typeof this.caption === 'string' ? this.caption : '',
        })
      : null;

    /* Whichever form the caption arrived in, nodes first. Kept as it came
       rather than wrapped: a renderer writes the `<figcaption>` itself, which
       is the tag it has to be inside this `<figure>`, and wrapping it would
       nest one caption in another. */
    const caption = this.captioned
      ? html`${this.captioned}`
      : this.caption
        ? html`<figcaption class="sds-figure__caption">${this.caption}</figcaption>`
        : '';

    return html`<figure class="sds-figure">
  <div class="sds-figure__frame${this.linked ? ' sds-figure__frame--exported' : ''}">
    ${press ? press.trigger : picture}
  </div>
  ${caption}
  ${press ? press.viewer : ''}
</figure>`;
  }
}

define('sds-figure', SdsFigure);
