/* sds-icon — a TYPO3 icon.

   Colour follows the UI, which is the whole icon rule: an `<img>` cannot
   inherit `currentColor`, so a glyph has to be in the document rather than
   linked from it.

   In a browser that is a `<use>` into the category sprite. The reference is
   external and that is fine: the shapes carry `fill="currentColor"`, and an
   inherited property crosses into the shadow tree `<use>` builds, so a glyph
   takes the colour of whatever it sits in.

   In Node there is nothing to reference, so `renderStatic` replaces every
   `<use>` with the glyph itself. That markup lives in
   `icon.static.ts` beside it, which only Node reaches: 200 kB of
   strings the browser bundle must not carry. */

import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { define, SdsElement } from '../lib/element.ts';
import { ICON_IDS, type IconId } from './icons.generated.ts';

export type { IconId };

/** The system's size scale: 16, 20, 24 or a whole multiple — never 18 or 22.
    16 is the floor; below it, no icon at all.

    `em` is the exception and the one that is not a number: an icon written
    inside text — a button's label, a link, a line of prose — is as big as
    that text and changes with it. A glyph beside 13px type has no business
    being 16px because 16 is the floor for a glyph standing on its own. */
export type IconSize = 16 | 20 | 24 | 32 | 48 | 'em';

/* An icon almost always sits inside something that has a text size — a
   button's label, a badge, a table cell, a line of prose — and matching it is
   what makes a glyph look placed rather than dropped in. So `em` is the
   default and a number is the exception: a standalone glyph, an empty state,
   a signet-scale mark. */
const DEFAULT_SIZE: IconSize = 'em';

/* What the viewBox is in. The attributes stay in these units whatever the
   rendered size, because they are the drawing's own. */
const INTRINSIC = 16;

/* Where the sprite is.

   Resolved against this module by default, which is right for the drop-in:
   `dist/soul.js` sits beside `dist/assets/`, wherever that directory was
   copied to. A bundler puts the module somewhere the assets are not, so a
   consumer that bundles says where instead. Get it wrong and every icon is
   blank with a 404 in the console — there is no silent failure here.

   Bundled to a classic script there is no module to resolve against at all,
   and `import.meta.url` is gone: `new URL()` then throws, at import time,
   which kills the bundle before the consumer reaches `setIconSprite`. The
   fallback is a path that resolves against the document — wrong often enough
   that it is not an answer, but a blank glyph is a thing you can see and
   fix, and a dead bundle is a blank page. */
function bundledBeside(): string {
  try {
    return new URL('./assets/icons/sprites/actions.svg', import.meta.url).href;
  } catch {
    return 'assets/icons/sprites/actions.svg';
  }
}

let spriteUrl = bundledBeside();

/** Point the icons at a sprite this build serves somewhere else. */
export const setIconSprite = (url: string): void => {
  spriteUrl = url;
};

export class SdsIcon extends SdsElement {
  static override properties = {
    name: { type: String, reflect: true },
    size: { type: Number, reflect: true },
    /** Only for an icon that stands without a label. SKILL.md lists the four
        that may: answered, version-bound, not bootable, a stated boundary.
        Everything else sits beside its own text and is hidden from assistive
        tech rather than read out twice. */
    label: { type: String },
  };

  declare name: IconId;
  declare size: IconSize;
  declare label?: string;

  constructor() {
    super();
    this.size = DEFAULT_SIZE;
  }

  protected override render(): TemplateResult {
    if (!ICON_IDS.includes(this.name)) {
      /* Loud rather than blank: a missing glyph reads as a design decision,
         and the fix is a one-line edit in scripts/icons.ts. */
      throw new Error(`unknown icon "${this.name}" — add its category to CATEGORIES in scripts/icons.ts and run \`make icons\``);
    }

    /* `data-icon` survives into the static export, where the glyph itself is
       inlined and the identifier would otherwise be lost. It is what lets the
       parity test compare the two renderings, and what lets a reader of a card
       tell which icon they are looking at. */
    const a11y = this.label ? `role="img" aria-label="${this.label}"` : 'aria-hidden="true"';
    /* `sds-icon--em` rather than an inline width: the modifier exists in the
       class layer, so hand-written markup asks for the same thing the same
       way. */
    const cls = this.className || (this.size === 'em' ? 'sds-icon sds-icon--em' : 'sds-icon');
    /* A size in pixels is written as a style, not only as an attribute:
       `.sds-icon` sets a width from a token, and a class beats a presentation
       attribute — so `size="24"` was a property that did nothing. Only where
       one was asked for: written unconditionally it would override
       `sds-icon--24` on markup that set the class and no size, which is how
       hand-written markup asks. */
    const sized = this.size === 'em' ? '' : ` style="width:${this.size}px;height:${this.size}px"`;
    return html`${unsafeHTML(
      `<svg width="${INTRINSIC}" height="${INTRINSIC}"${sized}` +
        ` class="${cls}" ${a11y} viewBox="0 0 16 16" data-icon="${this.name}">` +
        `<use href="${spriteUrl}#${this.name}"></use></svg>`,
    )}`;
  }
}

define('sds-icon', SdsIcon);

/** Every identifier this system ships — what the icons specimen renders. */
export const iconIds: readonly IconId[] = ICON_IDS;
