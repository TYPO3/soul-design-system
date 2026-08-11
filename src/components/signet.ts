/* sds-signet — this system's own mark.

   Redrawn per optical size rather than scaled. A mark that is merely shrunk
   loses its lightest parts first: at 16px the crop marks are two thin hooks
   and the three inner parts have to do the recognising, so they are drawn
   heavier and further apart than the large one would suggest. Three drawings,
   one mark.

   The ink is `currentColor` and the accent is the token. The files under
   `assets/` cannot do that — an `<img>` inherits nothing, so each carries a
   `<style>` with two literal greys and a `prefers-color-scheme` query. Inlined
   into a page that `<style>` is document-scoped and its `.ink` class leaks
   into everything around it, which is the reason this exists as markup rather
   than as a `source()` of the file.

   Only the system's mark. The Dev Companion and Tryout signets under
   `assets/` are examples of the family, and a product's mark belongs to the
   product. */

import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { define, SdsElement } from '../lib/element.ts';

/** Which drawing. `s` is 16–19px, `m` 20–31, `l` from 32 up. */
export type SignetSize = 's' | 'm' | 'l';

/* Each drawing is a viewBox and its shapes. The numbers are the ones in
   `assets/design-system-signet-*.svg`, and the guideline cards that document
   the construction are drawn from those files — so a change to the mark is a
   change in both places, on purpose: one is the artwork, this is the element,
   and `brand-signet-sizes` is where they are compared. */
const DRAWINGS: Record<SignetSize, { box: string; shapes: string }> = {
  s: {
    box: '-6 -20 140 140',
    shapes:
      '<path d="M56 94.5H20A14.5 14.5 0 0 1 5.5 80V44" fill="none" stroke="currentColor" stroke-width="11" stroke-linejoin="round" stroke-linecap="round"></path>' +
      '<rect fill="currentColor" x="39" y="30.5" width="11" height="39" rx="5.5"></rect>' +
      '<rect fill="currentColor" x="55.5" y="30.5" width="17" height="39" rx="5.5"></rect>' +
      '<rect fill="currentColor" x="78" y="30.5" width="11" height="39" rx="5.5"></rect>' +
      '<path d="M72 5.5H108A14.5 14.5 0 0 1 122.5 20V56" fill="none" stroke="var(--accent)" stroke-width="11" stroke-linejoin="round" stroke-linecap="round"></path>',
  },
  m: {
    box: '-6 -6 140 112',
    shapes:
      '<path d="M56 95.75H20A15.75 15.75 0 0 1 4.25 80V44" fill="none" stroke="currentColor" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round"></path>' +
      '<rect fill="currentColor" x="39" y="30.5" width="10.5" height="39" rx="4.25"></rect>' +
      '<rect fill="currentColor" x="53.75" y="30.5" width="20.5" height="39" rx="4.25"></rect>' +
      '<rect fill="currentColor" x="78.5" y="30.5" width="10.5" height="39" rx="4.25"></rect>' +
      '<path d="M72 4.25H108A15.75 15.75 0 0 1 123.75 20V56" fill="none" stroke="var(--accent)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round"></path>',
  },
  l: {
    box: '-6 -6 140 112',
    shapes:
      '<path d="M56 96.5H20A16.5 16.5 0 0 1 3.5 80V44" fill="none" stroke="currentColor" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"></path>' +
      '<rect fill="currentColor" x="39" y="30.5" width="11" height="39" rx="3.5"></rect>' +
      '<rect fill="currentColor" x="53.5" y="30.5" width="21" height="39" rx="3.5"></rect>' +
      '<rect fill="currentColor" x="78" y="30.5" width="11" height="39" rx="3.5"></rect>' +
      '<path d="M72 3.5H108A16.5 16.5 0 0 1 124.5 20V56" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"></path>',
  },
};

/** The drawing for a size in pixels — the bands the mark was drawn for. */
export const signetFor = (px: number): SignetSize => (px < 20 ? 's' : px < 32 ? 'm' : 'l');

export class SdsSignet extends SdsElement {
  static override properties = {
    size: { type: Number, reflect: true },
    label: { type: String },
  };

  declare size: number;
  /** What the mark is called, for anything that cannot see it. Empty where
      the wordmark beside it already says the name. */
  declare label?: string;

  constructor() {
    super();
    this.size = 20;
  }

  protected override render(): TemplateResult {
    const drawing = DRAWINGS[signetFor(this.size)];
    const a11y = this.label ? `role="img" aria-label="${this.label}"` : 'aria-hidden="true"';
    return html`${unsafeHTML(
      `<svg class="sds-signet" width="${this.size}" height="${this.size}" viewBox="${drawing.box}" ${a11y}>${drawing.shapes}</svg>`,
    )}`;
  }
}

define('sds-signet', SdsSignet);
