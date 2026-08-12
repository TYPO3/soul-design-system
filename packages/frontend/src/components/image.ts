/* sds-image — a picture that arrives in the mode of the page it lands in.

   An SVG is referenced into the page and a raster file is linked; the caller
   says neither, the file name is the whole distinction. A drawing linked as an
   image renders in a document of its own, where no token is declared, and keeps
   whichever grey its author baked in — `src/lib/art.ts` holds the mechanism.

   `sds-figure` is this with a caption. The class a caller gives is the one it
   renders with, so a signet is `<sds-image class="sds-signet">` and nothing
   here has to know what a signet is. */

import { type TemplateResult } from 'lit';
import { art } from '../lib/art.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface ImageProps {
  /** The file. An SVG is referenced, anything else is linked. */
  src: string;
  /** What the picture shows, for a reader who cannot see it. Empty where the
      text beside it already says the same thing — a mark in a lockup whose
      wordmark spells the name — and the picture is hidden rather than
      announced without a name. */
  alt: string;
  /** A size in pixels, for a picture no stylesheet sizes. Both, and the file's
      own coordinate system keeps the proportions inside them: a 5:4 mark given
      a square box is drawn 5:4 and centred, never stretched to fit. */
  width?: number;
  height?: number;
}

export class SdsImage extends SdsElement {
  static override properties = {
    src: { type: String },
    alt: { type: String },
    width: { type: Number, reflect: true },
    height: { type: Number, reflect: true },
    /* The class the caller wrote, read as a property rather than off the host:
       `this.className` exists only where there is a DOM, and these render in
       Node too. Declaring the attribute is what carries it through both. */
    cls: { attribute: 'class', type: String },
  };

  declare src: string;
  declare alt: string;
  declare width: number;
  declare height: number;
  declare cls: string;

  constructor() {
    super();
    this.src = '';
    this.alt = '';
    this.width = 0;
    this.height = 0;
    this.cls = '';
  }

  /** What a server wrote between the tags, dropped. The element takes no
      content — the picture follows from `src` — but it does take a fallback:
      the same picture in the class layer, for a surface rendering before any
      script and for a reader who runs none. The element redraws it and the
      server's copy goes, or light DOM leaves two pictures in one box. */
  override connectedCallback(): void {
    this.lifted();
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    const width = this.width || undefined;
    const height = this.height || undefined;
    /* A size states the box and nothing else may then decide it: `.sds-art` is
       `width: 100%`, and a class beats a presentation attribute, so the default
       class is the unsized case only. A caller asking for both owns the
       collision. The class goes on the picture itself, where the stylesheet
       expects it — the fallback markup is written that way by hand. */
    const cls = this.cls || (width || height ? '' : 'sds-art');
    return art(this.src, this.alt, cls, width, height);
  }
}

define('sds-image', SdsImage);
