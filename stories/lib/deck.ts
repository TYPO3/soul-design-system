/* What every slide of one deck has in common.

   A deck is a site of its own: one mark, one product, one outline. A copy per
   slide is where a deck comes to name its product two ways. So the deck
   stands here once, and each slide says which kind it is and what it shows.
   Nothing here is a component. */

import { html, nothing, type TemplateResult } from 'lit';
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

/** Where a slide stands in the outline, as its eyebrow says it: the number
    and the name. The deck writes the same for a slide that says none. */
export const place = (index: number): string => `${String(index + 1).padStart(2, '0')} · ${OUTLINE[index] ?? ''}`;

/** How a layout renders. `bare` leaves out what a deck gives every slide:
    the lockup and the count. A deck that holds the slide says those once. */
export interface DeckMode extends PageMode {
  bare?: boolean;
}

/** The lines of a slide's head, each in its region. A line nobody wrote
    stays out. */
export const head = ({ eyebrow, heading, lead, note }: Pick<SlideProps, 'eyebrow' | 'heading' | 'lead' | 'note'>): TemplateResult =>
  html`${eyebrow ? html`<span slot="eyebrow">${eyebrow}</span>` : nothing}${heading ? html`<h2 slot="heading">${heading}</h2>` : nothing}${lead ? html`<p slot="lead">${lead}</p>` : nothing}${note ? html`<p slot="note">${note}</p>` : nothing}`;

/** One slide, written the way a page writes it. The settings are
    attributes, and each line of the head and the body stands between the
    tags in its region. The same markup renders live and static. The live one fits the
    window, because a story opens in whatever canvas there is. The static one
    is its own viewport. */
export const slide = (
  { kind = 'content', ground, eyebrow, heading, lead, note, number, sections, current, portrait, alt, src, drawings, layout, bleed, framed }: SlideProps,
  body?: TemplateResult,
  { flat = false, bare = false }: DeckMode = {},
): TemplateResult => {
  const large = kind === 'cover' || kind === 'closing';
  const signet = bare ? '' : large ? DECK.signetLarge : DECK.signet;
  const brand = bare ? '' : DECK.brand;
  const product = bare ? '' : DECK.product;
  const count = bare ? '' : (number ?? '');
  /* The pictures go in their regions too: one drawing, a row of them, or
     a speaker's portrait. */
  const picture = (one: { src?: string; alt?: string; content?: unknown }): unknown =>
    one.content ?? html`<sds-image src="${one.src ?? ''}" alt="${one.alt ?? ''}"></sds-image>`;
  const figures = drawings?.length
    ? drawings.map((one) => html`<figure slot="figure" data-label="${one.label ?? ''}">${picture(one)}${one.caption ? html`<figcaption>${one.caption}</figcaption>` : nothing}</figure>`)
    : src
      ? html`<sds-image slot="figure" src="${src}" alt="${alt ?? ''}"></sds-image>`
      : nothing;
  const face = portrait ? html`<sds-image slot="portrait" src="${portrait}" alt="${alt ?? ''}"></sds-image>` : nothing;
  const regions = html`${head({ eyebrow, heading, lead, note })}${body ?? nothing}${figures}${face}`;
  /* An attribute stands only where it says something. A page leaves a
     default out, and so does this. */
  const said = (value: string | undefined, fallback = ''): string | typeof nothing => (value && value !== fallback ? value : nothing);
  return html`<sds-slide
      kind="${said(kind, 'content')}"
      ground="${said(ground, 'paper')}"
      layout="${said(layout, 'wide')}"
      ?bleed="${bleed ?? false}"
      ?framed="${framed ?? false}"
      sections="${sections?.length ? JSON.stringify(sections) : nothing}"
      current="${sections?.length ? String(current ?? 0) : nothing}"
      number="${said(count)}"
      signet="${said(signet)}"
      brand="${said(brand)}"
      product="${said(product)}"
      ?fit="${!flat}"
    >${regions}</sds-slide>`;
};
