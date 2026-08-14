/* The mark and the name, as one construction.

   Both ends of a site carry it, the bar and the footer, and a copy in each is
   how a site comes to say its own name two ways. The mark is hidden from a
   reader who cannot see it rather than announced: the wordmark beside it
   already spells what it says. */

import { html, type TemplateResult } from 'lit';
import '../components/image.ts';

export interface Lockup {
  /** The mark, as the file it is drawn in. Shown by `sds-image`, so it is
      linked like every other picture and drawn in its own file's colours. */
  signet?: string;
  /** Whose product it is, where that is a second name — the quiet half of the
      lockup, with the accent rule between the two. */
  brand?: string;
  /** The machine's name for it, set as the machine's: a product, a package, a
      repository — verbatim, and never title-cased. */
  product?: string;
  /** Where it goes. A bar's mark is the way home; a footer's is not a link,
      the reader having just arrived at the end of the thing it names. */
  href?: string;
}

/** The lockup, or nothing where there is neither a mark nor a name to draw. */
export function lockup({ signet = '', brand = '', product = '', href = '' }: Lockup): TemplateResult | '' {
  if (!signet && !product) return '';

  /* The pipe is a 2px accent rule drawn by the stylesheet — one of exactly
     three places that colour appears — so it is an empty span and never a `|`.
     It stands only where there are two halves to separate: a single name is
     the mark itself, in the mark's own weight. */
  const inside = html`${signet
    ? html`<sds-image class="sds-signet" src="${signet}" alt="" width="24" height="24"></sds-image>`
    : ''}${product
    ? html`<span class="sds-wordmark">${brand
        ? html`<span class="sds-wordmark__brand">${brand}</span><span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">${product}</span>`
        : html`${product}`}</span>`
    : ''}`;

  return href ? html`<a class="sds-lockup" href="${href}">${inside}</a>` : html`<span class="sds-lockup">${inside}</span>`;
}
