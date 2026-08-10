/* sds-icon — a TYPO3 icon.

   Icons are inlined rather than linked because an `<img>` cannot inherit
   `currentColor`, and the whole icon rule in SKILL.md is that colour follows
   the UI. Doing that by hand, once per occurrence, is what the cards used to
   do; this does it once, so a component and the card generated from it
   cannot disagree about a glyph.

   The source strings come from `src/lib/icons.generated.ts`, written by
   `scripts/icons.ts` out of the `@typo3/icons` package alongside
   `assets/icons/*.svg`. */

import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { define, SdsElement } from '../lib/element.ts';
import { ICON_SVG, type IconId } from '../lib/icons.generated.ts';

export type { IconId };

/** The system's size scale: 16, 20, 24 or a whole multiple — never 18 or 22.
    16 is the floor; below it, no icon at all. */
export type IconSize = 16 | 20 | 24 | 32 | 48;

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

  /* The package ships each icon pretty-printed over several lines.
     Collapsing newlines and tabs to single spaces reproduces, character for
     character, the inline form the hand-written cards carried — which is what
     lets the generated cards pixel-match the baseline instead of merely
     looking the same. `version="1.1"` is dropped (it means nothing in SVG 2)
     and the self-closing shapes are expanded, because a card is parsed as
     HTML, where a self-closing tag on a non-void element does not close. */
  private inline(svg: string): string {
    return svg
      .replace(/[\n\t]/g, ' ')
      .replace(/\s*version="1\.1"/, '')
      .replace(/<(path|rect|circle|polygon|ellipse|line|polyline)([^>]*?)\s*\/>/g, '<$1$2></$1>')
      .trimEnd();
  }

  protected override render(): TemplateResult {
    const svg = ICON_SVG[this.name];
    if (!svg) {
      /* Loud rather than blank: a missing glyph in a specimen reads as a
         design decision, and the fix is a one-line edit in scripts/icons.ts. */
      throw new Error(`unknown icon "${this.name}" — add it to the ICONS list in scripts/icons.ts and run \`make icons\``);
    }

    const a11y = this.label ? `role="img" aria-label="${this.label}"` : 'aria-hidden="true"';
    const cls = this.className || 'sds-icon';
    const open = `<svg width="${this.size}" height="${this.size}" class="${cls}" ${a11y} `;
    return html`${unsafeHTML(this.inline(svg).replace(/^<svg\s*/, open))}`;
  }
}

define('sds-icon', SdsIcon);

/** Every identifier this system ships — what the icons specimen renders. */
export const iconIds = Object.keys(ICON_SVG) as IconId[];
