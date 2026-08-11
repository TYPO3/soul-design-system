/* sds-quote — a sentence borrowed from somewhere, with where it came from.

   The attribution is required, and that is the whole of why this is a
   component. An unattributed quotation in a product's own writing reads as the
   product quoting itself for emphasis — and this system's writing rules do not
   allow emphasis without a source anywhere else either: an answer names what
   answered it, a figure names what it counts, and a sentence in quotation
   marks is not an exception.

   No quotation marks are drawn. The rule against ornament applies here as much
   as anywhere: the block is set apart by its measure and a rule at its start,
   which is position rather than decoration, and a punctuation mark scaled to
   40px is decoration wearing a glyph. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

export interface QuoteProps {
  /** The sentence. Long enough to be worth borrowing, short enough to read at
      lead size — a paragraph in quotation marks is a paragraph. */
  body: string | TemplateResult;
  /** Who said it. A person, a document, a release note. */
  by: string;
  /** What they are to the subject, where the name alone does not say. */
  role?: string;
  /** Where it can be read in full. */
  href?: string;
}

export class SdsQuote extends SdsElement {
  static override properties = {
    body: { type: String },
    by: { type: String },
    role: { type: String },
    href: { type: String },
  };

  declare body: string | TemplateResult;
  declare by: string;
  declare role: string;
  declare href: string;

  constructor() {
    super();
    this.body = '';
    this.by = '';
    this.role = '';
    this.href = '';
  }

  protected override render(): TemplateResult {
    const who = this.href
      ? html`<a class="sds-link" href="${this.href}">${this.by}</a>`
      : html`${this.by}`;
    return html`<figure class="sds-quote">
  <blockquote class="sds-quote__body">${this.body}</blockquote>
  <figcaption class="sds-quote__by">${who}${this.role ? html` · ${this.role}` : ''}</figcaption>
</figure>`;
  }
}

define('sds-quote', SdsQuote);
