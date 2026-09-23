/* What every slide of one deck has in common.

   A deck is a site of its own: one mark, one product, one outline. A copy per
   slide is where a deck comes to name its product two ways. So the deck
   stands here once, and each slide says which kind it is and what it shows.
   Nothing here is a component. */

import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/slide.ts';
import { type SlideProps } from '../../packages/frontend/src/components/slide.ts';
import { type PageMode } from './page.ts';

/** The mark at the foot of a cover, and the smaller one in every other foot.
    Each file is true at its own size, and a slide draws at twice the page.
    So the 32 draws at 64 and the 24 at 48, both whole multiples. */
export const DECK = {
  brand: 'TYPO3',
  product: 'Dev Companion',
  signet: 'assets/design-system-signet-m.svg',
  signetLarge: 'assets/design-system-signet-l.svg',
} as const;

/** The deck's sections, in order. A divider shows them and marks its own. */
export const OUTLINE: readonly string[] = ['Why one system', 'What it consists of', 'How to build a slide', 'Where to start'];

/** How a layout renders. `bare` leaves out what a deck gives every slide:
    the lockup and the count. A deck that holds the slide says those once. */
export interface DeckMode extends PageMode {
  bare?: boolean;
}

/** One slide, in whichever form the rendering can hold. The body goes between
    the tags where the page is live, and as a property where it is static. A
    file has no `connectedCallback` to lift authored children. The live one
    fits the window, because a story opens in whatever canvas there is. The
    static one is its own viewport. */
export const slide = (
  { kind = 'content', ground, eyebrow, heading, lead, note, number, sections, current, portrait, alt }: SlideProps,
  body?: TemplateResult,
  { flat = false, bare = false }: DeckMode = {},
): TemplateResult => {
  const large = kind === 'cover' || kind === 'closing';
  const signet = bare ? '' : large ? DECK.signetLarge : DECK.signet;
  const brand = bare ? '' : DECK.brand;
  const product = bare ? '' : DECK.product;
  const count = bare ? '' : (number ?? '');
  return flat
    ? html`<sds-slide
        kind="${kind}"
        ground="${ground ?? 'paper'}"
        eyebrow="${eyebrow ?? ''}"
        heading="${heading ?? ''}"
        lead="${lead ?? ''}"
        note="${note ?? ''}"
        number="${count}"
        signet="${signet}"
        brand="${brand}"
        product="${product}"
        sections="${JSON.stringify(sections ?? [])}"
        current="${current ?? 0}"
        portrait="${portrait ?? ''}"
        alt="${alt ?? ''}"
        .body="${body ?? ''}"
      ></sds-slide>`
    : html`<sds-slide
        kind="${kind}"
        ground="${ground ?? 'paper'}"
        eyebrow="${eyebrow ?? ''}"
        heading="${heading ?? ''}"
        lead="${lead ?? ''}"
        note="${note ?? ''}"
        number="${count}"
        signet="${signet}"
        brand="${brand}"
        product="${product}"
        sections="${JSON.stringify(sections ?? [])}"
        current="${current ?? 0}"
        portrait="${portrait ?? ''}"
        alt="${alt ?? ''}"
        fit
      >${body ?? ''}</sds-slide>`;
};
