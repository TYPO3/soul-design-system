/* sds-embed — a document from somewhere else, in a frame this page controls.

   An iframe is the one thing on a page that the page did not write: a video,
   a map, a card this system's own generator produced. It arrives carrying a
   size of its own, with no relation to the column it lands in, and browsers
   draw it with an inset border out of 1996. That is what this frames — the
   hairline and the corner every other block here has, the sunken plane the
   document already uses for machine output, and a caption saying what the
   reader is looking at.

   Two shapes, and the difference is what the embed is *for*.

   A video has a ratio and no size. It fills the column and holds `16 / 9`
   whatever the column does, because 560 pixels of player is a player with its
   right-hand side cut off as soon as the column is narrower than that.

   A specimen has a size and no ratio. It was measured at the viewport its
   card declares, and a card shown at any other width is a card documenting
   something that was never checked — so the frame keeps that size and scrolls
   when there is less room, which is the answer a wide table already gets
   here.

   And it takes the frame it is given. A renderer that ships HTML writes the
   iframe itself, so the reader has the document before any script has run;
   this lifts that node and wraps it rather than writing a second one, which
   would fetch the same document twice. Same arrangement as `sds-code`, and
   for the same reason. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

export interface EmbedProps {
  /** The document to put in the frame. */
  src: string;
  /** What the frame holds, in a few words. It becomes the frame's accessible
      name, which is the only thing a screen reader has to go on — an unnamed
      frame is announced as "frame" and skipped.

      Not `title`, which is a global HTML attribute: written on the host it
      would be a tooltip over everything inside, because `display: contents`
      leaves the attribute inheriting onto the frame and the caption both.
      Same collision the block's `code-lang`, the table's `scrollable` and the
      note's `heading` were renamed for. */
  label: string;
  /** The shape the frame holds while it fills the column, as CSS writes it —
      `16 / 9`. This is what a video, a map or anything else that has no size
      of its own wants, and it is the default. */
  ratio?: string;
  /** The size the document was made for, in pixels. Both together, and
      without a `ratio`, are what makes the frame fixed: it is exactly this
      wide, and it scrolls rather than reflowing what it holds. */
  width?: number;
  height?: number;
  /** The claim, in a sentence, under the frame.

      A caption may also be written between the tags as
      `<div class="sds-embed__caption">`, and that is the form for a renderer
      whose caption carries markup — a size in the mono face, a link — and for
      a page that has to read before the element upgrades. Either way it
      belongs to the element: see `captioned`. */
  caption?: string;
  /** The permissions policy the frame is granted. A video player asks for
      `encrypted-media; picture-in-picture; web-share`; a card asks for
      nothing, and gets nothing. */
  allow?: string;
  allowfullscreen?: boolean;
}

/* A caption written between the tags, told apart from the frame by the class
   the component itself would emit for it — the same marker `sds-code` uses,
   and for the same reason: these elements render light DOM, so there is no
   slot to name it with, and a class the stylesheet already defines is what
   makes the caption read right in the window before the upgrade. */
const isCaption = (node: Node): boolean =>
  node.nodeType === 1 && (node as Element).matches('.sds-embed__caption');

/* The newlines a template wrote between the tags, and the markers Lit leaves
   among its own bindings. Neither is content, and both would otherwise count
   as a frame the caller supplied — which would leave an element that was
   given only a caption with no frame at all, because it stopped writing one. */
const isNothing = (node: Node): boolean =>
  node.nodeType === 8 || (node.nodeType === 3 && !(node.textContent ?? '').trim());

export class SdsEmbed extends SdsElement {
  static override properties = {
    src: { type: String },
    label: { type: String },
    ratio: { type: String },
    width: { type: Number },
    height: { type: Number },
    caption: { type: String },
    allow: { type: String },
    allowfullscreen: { type: Boolean },
  };

  declare src: string;
  declare label: string;
  declare ratio: string;
  declare width: number;
  declare height: number;
  declare caption: string;
  declare allow: string;
  declare allowfullscreen: boolean;

  /* The frame a renderer wrote, taken before Lit renders over it. */
  private taken: Node[] | null = null;

  /* And its caption, where that was written between the tags too. Kept apart
     from `taken`, which everything else here reads as the frame itself. */
  private captioned: Node[] | null = null;

  constructor() {
    super();
    this.src = '';
    this.label = '';
    this.ratio = '';
    this.width = 0;
    this.height = 0;
    this.caption = '';
    this.allow = '';
    this.allowfullscreen = false;
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isNothing(node));
    const caption = written.filter(isCaption);
    const framed = written.filter((node) => !isCaption(node));
    if (caption.length) this.captioned = caption;
    if (framed.length) this.taken = framed;
    super.connectedCallback();
  }

  /** Whether the frame is the size it was made for rather than the column's.

      A size on its own says fixed, and a ratio beside it says the caller has
      two answers to one question — the ratio is the one that means "fill the
      column", so it wins and the size is what the document inside is asked
      for. */
  private get fixed(): boolean {
    return !this.ratio && this.width > 0 && this.height > 0;
  }

  /** What goes in the frame: the node a renderer wrote, or the iframe this
      writes when nobody did.

      Not lazy, and that is a decision rather than an omission. An embed is the
      evidence on the page, and a frame that loads on scroll is a frame that is
      blank in every screenshot taken of it — which is the one place somebody
      looks at all of them at once. */
  private get framed(): unknown {
    if (this.taken) return this.taken;
    /* Nothing to show, and an empty `src` is not nothing: a browser resolves
       it against the current document and embeds the page in itself. */
    if (!this.src) return nothing;
    const size = this.fixed ? `width:${this.width}px;height:${this.height}px` : nothing;
    return html`<iframe src="${this.src}" title="${this.label || nothing}" style="${size}" allow="${this.allow || nothing}" ?allowfullscreen="${this.allowfullscreen}"></iframe>`;
  }

  protected override render(): TemplateResult {
    /* The shape is a class rather than a rule the element writes out, because
       what "fixed" and "fluid" mean is the stylesheet's business — one holds
       its size and scrolls, the other fills the column and holds a ratio. The
       ratio itself is the only thing here no class can carry.

       Both names in full, and not one stem with the ending interpolated: a
       class assembled from pieces appears nowhere in the source, so `make
       coverage` cannot see that anything draws it and the name reads as dead
       to every search that goes looking for it. */
    const shape = this.fixed ? 'sds-embed__frame--fixed' : 'sds-embed__frame--fluid';
    const style = this.fixed ? nothing : `aspect-ratio:${this.ratio || '16 / 9'}`;
    /* Whichever form the caption arrived in. The nodes win where there are
       both: they are what a renderer wrote, and the attribute beside them
       could only be the same sentence with its markup taken out. */
    const caption = this.captioned
      ? html`${this.captioned}`
      : this.caption
        ? html`<div class="sds-embed__caption">${this.caption}</div>`
        : undefined;

    return html`<div class="sds-embed">
  <div class="sds-embed__frame ${shape}" style="${style}">${this.framed}</div>
  ${caption}
</div>`;
  }
}

define('sds-embed', SdsEmbed);
