/* sds-embed — a document from somewhere else, in a frame this page controls.

   An iframe arrives carrying a size with no relation to the column it lands in,
   and browsers draw it with an inset border out of 1996; this gives it the
   hairline and sunken plane every other block here has.

   A video has a ratio and no size and fills the column, because a fixed 560 is
   a player with its side cut off. A specimen has a size and no ratio, measured
   at the viewport its card declares, so the frame keeps it and scrolls. An
   iframe a renderer wrote is lifted, not written again. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

export interface EmbedProps {
  /** The document to put in the frame. */
  src: string;
  /** What the frame holds, in a few words: it becomes the accessible name, and
      an unnamed frame is announced as "frame" and skipped. Not `title`, a
      global attribute, which on a `display: contents` host would be a tooltip
      over the frame and the caption both. */
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
  /** The claim, in a sentence, under the frame. It may also be written between
      the tags as `<div class="sds-embed__caption">` — the form for a caption
      carrying markup, and for a page read before the element upgrades. Either
      way it belongs to the element: see `captioned`. */
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

  /** Whether the frame is the size it was made for rather than the column's. A
      size alone says fixed; a ratio beside it is the answer that means "fill
      the column", so it wins and the size is what the document is asked for. */
  private get fixed(): boolean {
    return !this.ratio && this.width > 0 && this.height > 0;
  }

  /** What goes in the frame: the node a renderer wrote, or the iframe this
      writes when nobody did. Not lazy, deliberately — an embed is the evidence
      on the page, and one that loads on scroll is blank in every screenshot. */
  private get framed(): unknown {
    if (this.taken ?? this.content) return this.taken ?? this.content;
    /* Nothing to show, and an empty `src` is not nothing: a browser resolves
       it against the current document and embeds the page in itself. */
    if (!this.src) return nothing;
    const size = this.fixed ? `width:${this.width}px;height:${this.height}px` : nothing;
    return html`<iframe src="${this.src}" title="${this.label || nothing}" style="${size}" allow="${this.allow || nothing}" ?allowfullscreen="${this.allowfullscreen}"></iframe>`;
  }

  protected override render(): TemplateResult {
    /* A class rather than a rule the element writes: what "fixed" and "fluid"
       mean is the stylesheet's business, and the ratio is the only thing here
       no class can carry. Both names in full rather than a stem with the ending
       interpolated — a class assembled from pieces appears nowhere in the
       source, so `make coverage` and every search read it as dead. */
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
