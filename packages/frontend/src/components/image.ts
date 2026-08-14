/* sds-image — a picture, at the size the caller gives it.

   Every picture is linked: a drawing renders in a document of its own, where
   no token is declared, and keeps whichever grey its author wrote as the
   fallback. `src/lib/art.ts` holds why the alternative is not taken.

   `sds-figure` is this with a caption. The class a caller gives is the one it
   renders with, so a signet is `<sds-image class="sds-signet">` and nothing
   here has to know what a signet is. */

import { html, type TemplateResult } from 'lit';
import { art } from '../lib/art.ts';
import { define, SdsElement } from '../lib/element.ts';
import { zoom } from '../lib/zoom.ts';

export interface ImageProps {
  /** The file. */
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
  /** Pressable, opening the picture at the size it was made. The trigger is a
      link to the file, so a surface running no script still opens it and the
      element only takes the press over once it has upgraded. What a picture
      shrunk into its column asks for, and what a mark in a lockup never does. */
  zoomable?: boolean;
}

export class SdsImage extends SdsElement {
  static override properties = {
    src: { type: String },
    alt: { type: String },
    width: { type: Number, reflect: true },
    height: { type: Number, reflect: true },
    zoomable: { type: Boolean, reflect: true },
    /* The class the caller wrote, read as a property rather than off the host:
       `this.className` exists only where there is a DOM, and these render in
       Node too. Declaring the attribute is what carries it through both. */
    cls: { attribute: 'class', type: String },
  };

  declare src: string;
  declare alt: string;
  declare width: number;
  declare height: number;
  declare zoomable: boolean;
  declare cls: string;

  constructor() {
    super();
    this.src = '';
    this.alt = '';
    this.width = 0;
    this.height = 0;
    this.zoomable = false;
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
    const picture = art(this.src, this.alt, { cls, width, height });
    if (!this.zoomable) return picture;
    const { trigger, viewer } = zoom(this, picture, { src: this.src, alt: this.alt });
    return html`${trigger}
${viewer}`;
  }
}

define('sds-image', SdsImage);
