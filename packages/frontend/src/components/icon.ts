/* sds-icon — a TYPO3 icon.

   Colour follows the UI, which is the whole icon rule: an `<img>` cannot
   inherit `currentColor`, so a glyph is in the document rather than linked
   from it. In a browser that is a `<use>` into the category sprite — the shapes
   carry `fill="currentColor"` and an inherited property crosses into the shadow
   tree it builds. In Node there is nothing to reference, so `renderStatic`
   swaps in the glyph from `icon.static.ts`, which the browser bundle never
   loads. */

import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { define, SdsElement } from '../lib/element.ts';
import { ICON_CATEGORIES, ICON_IDS, type IconId } from './icons.generated.ts';

export type { IconId };

/** The system's size scale: 16, 20, 24 or a whole multiple — never 18 or 22.
    16 is the floor; below it, no icon at all. `em` is the exception: an icon
    written inside text is as big as that text and changes with it, because the
    floor is for a glyph standing on its own. */
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

/* Where the sprites are — the *directory*, because there is one file per
   category and an icon is drawn out of its own. Resolved against this module by
   default, which is right for the drop-in; a consumer that bundles says where
   instead. Bundled to a classic script `import.meta.url` is gone and `new URL()`
   would throw at import time, so the fallback resolves against the document —
   often wrong, but a blank glyph can be seen and fixed and a dead bundle is a
   blank page. */
function bundledBeside(): string {
  try {
    return new URL('./assets/icons/sprites/', import.meta.url).href;
  } catch {
    return 'assets/icons/sprites/';
  }
}

let spriteDir = bundledBeside();

/** Point the icons at the sprites this build serves somewhere else. The
    directory, not one file: every category is a request of its own. */
export const setIconSprites = (dir: string): void => {
  spriteDir = dir.endsWith('/') ? dir : `${dir}/`;
};

/** Which sprite carries this glyph. An identifier opens with its own category —
    `scripts/icons.ts` checks that before it writes the list — and the longest
    match wins, so two categories sharing a start cannot take each other's. */
function spriteFor(id: string): string {
  const category = ICON_CATEGORIES.find((c) => id.startsWith(`${c}-`));
  return `${spriteDir}${category ?? ICON_CATEGORIES[0]}.svg`;
}

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

  /** Which icon, by its TYPO3 identifier — `actions-play`,
      `actions-chevron-down`. */
  declare name: IconId;
  /** How big, in pixels. `em` by default, which takes the size of the text
      it stands in and is what a glyph beside words wants. */
  declare size: IconSize;
  /** What it says, where it stands without words. Without one it is hidden
      from assistive technology rather than read out beside text that already
      says it. */
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
    /* `.sds-icon` is already `1em`, which is this element's default too — so
       an unsized icon and hand-written `<svg class="sds-icon">` are the same
       thing, which is the whole contract between the element and the class
       layer. */
    const cls = this.className || 'sds-icon';
    /* A size in pixels is a style, not only an attribute: `.sds-icon` sets a
       width from a token and a class beats a presentation attribute. Only where
       one was asked for — written unconditionally it would override
       `sds-icon--24`, which is how hand-written markup asks. */
    const sized = this.size === 'em' ? '' : ` style="width:${this.size}px;height:${this.size}px"`;
    return html`${unsafeHTML(
      `<svg width="${INTRINSIC}" height="${INTRINSIC}"${sized}` +
        ` class="${cls}" ${a11y} viewBox="0 0 16 16" data-icon="${this.name}">` +
        `<use href="${spriteFor(this.name)}#${this.name}"></use></svg>`,
    )}`;
  }
}

define('sds-icon', SdsIcon);

/** Every identifier this system ships — what the icons specimen renders. */
export const iconIds: readonly IconId[] = ICON_IDS;
