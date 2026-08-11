/* sds-crumbs — where the page sits, as a trail.

   The last entry is the page itself and is not a link: a link to here is a
   control that does nothing, and a reader who follows it learns that the trail
   cannot be trusted. It carries `aria-current="page"` rather than being
   inferred from position, because position is not something assistive tech
   can see.

   No active mark, unlike every other navigation in this system. The trail is
   read as a path and its end is where the reader already is — spending the one
   accent on that would leave nothing to mark the thing they came to do.

   The separator is a character and not an icon: it is punctuation between two
   words, at the size of the words, and a 16px glyph between two 13px labels
   sits a pixel off no matter where it is nudged. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

/** One step of the trail. The last one wants no `href` — it is this page. */
export interface Crumb {
  label: string;
  href?: string;
}

export interface CrumbsProps {
  items: readonly Crumb[];
  /** What the trail is called for a reader who cannot see it is one. */
  label?: string;
}

export class SdsCrumbs extends SdsElement {
  static override properties = {
    items: { type: Array },
    label: { type: String },
  };

  declare items: readonly Crumb[];
  declare label: string;

  constructor() {
    super();
    this.items = [];
    this.label = 'Breadcrumb';
  }

  protected override render(): TemplateResult {
    return html`<nav class="sds-crumbs" aria-label="${this.label}">
  ${this.items.map((crumb, i) => {
    /* The end of the trail is the page, whether or not a caller gave it an
       href — a trail whose last step is a link is a trail that was pasted
       from the one above it. */
    const here = i === this.items.length - 1;
    const step = here
      ? html`<span class="sds-crumbs__here" aria-current="page">${crumb.label}</span>`
      : html`<a href="${crumb.href ?? '#'}">${crumb.label}</a>`;
    return html`${i > 0 ? html`<span class="sds-crumbs__sep" aria-hidden="true">/</span>` : ''}${step}`;
  })}
</nav>`;
  }
}

define('sds-crumbs', SdsCrumbs);
