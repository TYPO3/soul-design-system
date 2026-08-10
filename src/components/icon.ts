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
    16 is the floor; below it, no icon at all. */
export type IconSize = 16 | 20 | 24 | 32 | 48;

/* Where the sprite is.

   Resolved against this module by default, which is right for the drop-in:
   `dist/soul.js` sits beside `dist/assets/`, wherever that directory was
   copied to. A bundler puts the module somewhere the assets are not, so a
   consumer that bundles says where instead. Get it wrong and every icon is
   blank with a 404 in the console — there is no silent failure here. */
let spriteUrl = new URL('./assets/icons/sprites/actions.svg', import.meta.url).href;

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
    this.size = 16;
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
    const cls = this.className || 'sds-icon';
    return html`${unsafeHTML(
      `<svg width="${this.size}" height="${this.size}" class="${cls}" ${a11y} viewBox="0 0 16 16" data-icon="${this.name}">` +
        `<use href="${spriteUrl}#${this.name}"></use></svg>`,
    )}`;
  }
}

define('sds-icon', SdsIcon);

/** Every identifier this system ships — what the icons specimen renders. */
export const iconIds: readonly IconId[] = ICON_IDS;
