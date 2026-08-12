/* sds-quote — a sentence borrowed from somewhere, with where it came from.

   The attribution is required, and that is the whole of why this is a
   component: an unattributed quotation in a product's own writing reads as the
   product quoting itself for emphasis, and nothing else here is allowed
   emphasis without a source either.

   No quotation marks are drawn. The block is set apart by its measure and a
   rule at its start — position rather than ornament. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

export interface QuoteProps {
  /** The sentence. Long enough to be worth borrowing, short enough to read at
      lead size — a paragraph in quotation marks is a paragraph. */
  body: string | TemplateResult;
  /** Who said it. A person, a document, a release note. */
  by: string;
  /** What it is to the subject, where the name alone does not say. The
      attribute is `as` and not `role`: `role` is the global ARIA attribute, so
      `role="maintainer"` claims a role that does not exist, and axe says so. */
  as?: string;
  /** Where it can be read in full. */
  href?: string;
}

export class SdsQuote extends SdsElement {
  static override properties = {
    body: { type: String },
    by: { type: String },
    as: { type: String },
    href: { type: String },
  };

  declare body: string | TemplateResult;
  declare by: string;
  declare as: string;
  declare href: string;

  constructor() {
    super();
    this.body = '';
    this.by = '';
    this.as = '';
    this.href = '';
  }

  protected override render(): TemplateResult {
    const who = this.href
      ? html`<a class="sds-link" href="${this.href}">${this.by}</a>`
      : html`${this.by}`;
    return html`<figure class="sds-quote">
  <blockquote class="sds-quote__body">${this.body}</blockquote>
  <figcaption class="sds-quote__by">${who}${this.as ? html` · ${this.as}` : ''}</figcaption>
</figure>`;
  }
}

define('sds-quote', SdsQuote);
