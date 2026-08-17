/* sds-nav-breadcrumb — where the page sits, as a trail.

   The last entry is the page itself and is not a link, and says so with
   `aria-current="page"` rather than leaving it to be inferred from position.

   No active mark, unlike every other navigation here: the trail is read as a
   path and its end is where the reader already is, so spending the accent there
   would leave nothing to mark what they came to do. The separator is a
   character, not an icon — punctuation between two words, at their size. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

/** One step of the trail. The last one wants no `href` — it is this page. */
export interface Crumb {
  label: string;
  href?: string;
}

export interface CrumbsProps {
  /** The trail, from the root to the page being read — set from script,
      being a list. The last entry is the page itself and is not a link. */
  items: readonly Crumb[];
  /** What the trail is called for a reader who cannot see it is one. */
  label?: string;
}

export class SdsNavBreadcrumb extends SdsElement {
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

define('sds-nav-breadcrumb', SdsNavBreadcrumb);
