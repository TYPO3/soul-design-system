/* The mark and the name, as one construction.

   Both ends of a site carry it, the bar and the footer. A copy in each is how
   a site comes to say its own name two ways. The mark hides from a reader who
   cannot see it rather than announces itself: the wordmark beside it already
   spells what it says. */

import { html, type TemplateResult } from 'lit';
import '../components/image.ts';

export interface Lockup {
  /** The mark, as the file that holds the drawing. `sds-image` shows it, so it
      is a link like every other picture and draws in its own file's colours. */
  signet?: string;
  /** Whose product it is, where that is a second name — the quiet half of the
      lockup, with the accent rule between the two. */
  brand?: string;
  /** The machine's name for it, set as the machine's: a product, a package, a
      repository — verbatim, and never title-cased. */
  product?: string;
  /** Where it goes. A bar's mark is the way home. A footer's is not a link:
      the reader has just arrived at the end of the thing it names. */
  href?: string;
}

/** The lockup, or nothing where there is neither a mark nor a name to draw. */
export function lockup({ signet = '', brand = '', product = '', href = '' }: Lockup): TemplateResult | '' {
  if (!signet && !product) return '';

  /* The pipe is a 2px accent rule the stylesheet draws — one of exactly three
     places that colour appears. So it is an empty span and never a `|`. It
     stands only where there are two halves to separate. A single name is the
     whole mark and sets at the mark's weight, which `brand.css` reads off the
     absent half rather than hears from here. */
  const inside = html`${signet
    ? html`<sds-image class="sds-signet" src="${signet}" alt="" width="24" height="24"></sds-image>`
    : ''}${product
    ? html`<span class="sds-wordmark">${brand
        ? html`<span class="sds-wordmark__brand">${brand}</span><span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">${product}</span>`
        : html`${product}`}</span>`
    : ''}`;

  return href ? html`<a class="sds-lockup" href="${href}">${inside}</a>` : html`<span class="sds-lockup">${inside}</span>`;
}
