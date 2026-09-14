/* sds-embed — a document from somewhere else, in a frame this page controls.

   An iframe arrives with a size unrelated to the column it lands in, and
   browsers draw it with an inset border out of 1996. This gives it the
   hairline and sunken plane every other block here has.

   A video has a ratio and no size and fills the column, because a fixed 560 is
   a player with its side cut off. A specimen has a size and no ratio, measured
   at the viewport its card declares, so the frame keeps it and scrolls. An
   iframe a renderer wrote moves in, and nothing writes it again. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

export interface EmbedProps {
  /** The document to put in the frame. */
  src: string;
  /** What the frame holds, in a few words. It becomes the accessible name,
      and a screen reader announces an unnamed frame as "frame" and skips it.
      Not `title`, a global attribute, which on the element is a tooltip over
      the frame and the caption both. */
  label: string;
  /** The shape the frame holds while it fills the column, as CSS writes it —
      `16 / 9`. This is what a video, a map or anything else that has no size
      of its own wants, and it is the default. */
  ratio?: string;
  /** The document's own size, in pixels. Both together, and without a
      `ratio`, make the frame fixed. It is exactly this wide, and it scrolls
      rather than reflows what it holds. */
  width?: number;
  /** A height in pixels, for the embed whose own shape is not a ratio.
      `ratio` is the usual answer; this is for the one that is not. */
  height?: number;
  /** The claim, in a sentence, under the frame. It can also stand between
      the tags as `<div class="sds-embed__caption">`. That is the form for a
      caption with markup, and for a page read before the element upgrades.
      Either way it belongs to the element: see `captioned`. */
  caption?: string;
  /** The permissions policy the frame gets. A video player asks for
      `encrypted-media; picture-in-picture; web-share`; a card asks for
      nothing, and gets nothing. */
  allow?: string;
  /** If the frame can take the whole screen. A player usually can, and a
      form in a frame has no reason to. */
  allowfullscreen?: boolean;
}

/* A caption between the tags, told apart from the frame by the class the
   component emits for it. The same marker `sds-code` uses, for the same
   reason: these elements render light DOM, so there is no slot to name it
   with. A class the stylesheet already defines makes the caption read right
   in the window before the upgrade. */
const isCaption = (node: Node): boolean =>
  node.nodeType === 1 && (node as Element).matches('.sds-embed__caption');

/* The newlines a template wrote between the tags, and the markers Lit leaves
   among its own bindings. Neither is content, and both otherwise count as a
   frame the caller supplied. An element with only a caption then has no
   frame at all, because it stopped writing one. */
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

  /* And its caption, where that stood between the tags too. Kept apart
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

  /* The page's mode, watched so the frame follows a switch. */
  #watch: MutationObserver | null = null;

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isNothing(node));
    const caption = written.filter(isCaption);
    const framed = written.filter((node) => !isCaption(node));
    if (caption.length) this.captioned = caption;
    if (framed.length) this.taken = framed;
    super.connectedCallback();
    if (typeof document === 'undefined') return;
    this.#watch = new MutationObserver(this.#paint);
    this.#watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    /* Captured, because `load` on a frame does not bubble. */
    this.addEventListener('load', this.#paint, true);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('load', this.#paint, true);
    this.#watch?.disconnect();
    this.#watch = null;
    super.disconnectedCallback();
  }

  protected override firstUpdated(): void {
    this.#paint();
  }

  /* A frame is a document of its own and inherits nothing. A card made for
     both modes carries no `data-theme`. On its own it then answers the
     machine's setting inside a page that chose the other one. The
     frame belongs to this element, so this element paints it, and a page with
     no theme control has frames all the same. */
  #paint = (): void => {
    const mode = document.documentElement.dataset['theme'];
    for (const frame of this.querySelectorAll('iframe')) {
      try {
        const inner = frame.contentDocument?.documentElement;
        if (!inner) continue;
        if (mode) inner.dataset['theme'] = mode;
        else delete inner.dataset['theme'];
      } catch {
        /* Another origin. Nothing to do, and nothing broken. */
      }
    }
  };

  /** If the frame has the document's own size rather than the column's. A
      size alone says fixed. A ratio beside it means "fill the column", so it
      wins and the size becomes the document's request. */
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
    /* A class rather than a rule the element writes. What "fixed" and "fluid"
       mean is the stylesheet's business, and the ratio is the only thing here
       no class can carry. Both names in full rather than an interpolated
       ending. A class assembled from pieces appears nowhere in the source, so
       `make coverage` and every search read it as dead. */
    const shape = this.fixed ? 'sds-embed__frame--fixed' : 'sds-embed__frame--fluid';
    const style = this.fixed ? nothing : `aspect-ratio:${this.ratio || '16 / 9'}`;
    /* Whichever form the caption arrived in. The nodes win where there are
       both. They are what a renderer wrote, and the attribute beside them can
       only be the same sentence without its markup. */
    const caption = this.captioned
      ? html`${this.captioned}`
      : this.caption
        ? html`<div class="sds-embed__caption">${this.caption}</div>`
        : undefined;

    /* A frame that keeps its measured width scrolls below it. The key that
       scrolls a region must reach it — a pointer is not the only way down a
       page. Only where it scrolls: a tab stop on a frame that fits is a stop
       at nothing. */
    return html`<div class="sds-embed">
  <div class="sds-embed__frame ${shape}" style="${style}" tabindex="${this.fixed ? '0' : nothing}">${this.framed}</div>
  ${caption}
</div>`;
  }
}

define('sds-embed', SdsEmbed);
