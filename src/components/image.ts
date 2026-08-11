/* sds-image — a picture that arrives in the mode of the page it lands in.

   A drawing this system did not draw is still a drawing: a project's signet, a
   product's mark, an illustration somebody made for one page. Linked as an
   image every one of them renders in a document of its own, where the tokens
   are not declared — so it keeps whichever grey its author baked in, on a page
   that has since gone dark. That is the failure this element exists to remove,
   and `src/lib/art.ts` is where the mechanism is written down.

   So an SVG is referenced into the page and a raster file is linked, and the
   caller says neither: the file name is the whole distinction. What an SVG has
   to do to be referenced is name its root `id="art"` — one attribute, no
   restructuring — and put its colours in `var(--token, #hex)` rather than in a
   `<style>` block, because a rule inside the file beats the attribute the
   reference would have coloured. `docs/guidelines/artwork.rst` is that as an
   instruction, and it is the page to send anyone who asks how to hand this
   system a mark of their own.

   `sds-figure` is this with a caption and a claim, and the two share the same
   function rather than each writing markup: a picture in a document is a
   figure, and a picture in a bar is not. Where a mark is what a surface shows,
   this is the element — the class it is given is the one it renders with, so a
   signet in a lockup is `<sds-image class="sds-signet">` and nothing here has
   to know what a signet is. */

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
    /* The class the caller wrote, read as a property rather than off the
       host. `this.className` exists only where there is a DOM, and the card
       generator renders these elements in Node — so a mark written
       `class="sds-signet"` came out of the export as `sds-art`, which is
       `width: 100%`, which is a 20px mark filling the bar. Declaring the
       attribute is what carries it through both renderings. */
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

  protected override render(): TemplateResult {
    const width = this.width || undefined;
    const height = this.height || undefined;
    /* A size states the box, and nothing else may then decide it. `.sds-art`
       is `width: 100%` — the right answer for a picture filling the column it
       was placed in, and the wrong one for a 64px mark, where a class beats a
       presentation attribute and the drawing is drawn the width of the page.
       So the default class is the unsized case only; a caller that asks for a
       size and a class gets both, and owns the collision.

       The class goes on the picture itself, which is where the stylesheet
       expects it: the class layer is the markup a surface running no script
       writes by hand, and an element that renders something else is an element
       the fallback cannot stand in for. Same contract as `sds-icon`. */
    const cls = this.cls || (width || height ? '' : 'sds-art');
    return art(this.src, this.alt, cls, width, height);
  }
}

define('sds-image', SdsImage);
