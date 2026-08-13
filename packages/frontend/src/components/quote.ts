/* sds-quote — a sentence borrowed from somewhere, with where it came from.

   The attribution is required, and that is the whole of why this is a
   component: an unattributed quotation in a product's own writing reads as the
   product quoting itself for emphasis, and nothing else here is allowed
   emphasis without a source either.

   It is a `sds-byline`, not a caption: authorship is one thing and looks the
   same wherever it is claimed. A caption-sized line under a borrowed sentence
   said the source mattered less than the sentence. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';
import './byline.ts';

export interface QuoteProps {
  /** The sentence. Long enough to be worth borrowing, short enough to stand
      at heading size — a paragraph in quotation marks is a paragraph. */
  body: string | TemplateResult;
  /** Who said it. A person, a document, a release note. */
  by: string;
  /** What it is to the subject, where the name alone does not say. The
      attribute is `as` and not `role`: `role` is the global ARIA attribute, so
      `role="maintainer"` claims a role that does not exist, and axe says so. */
  as?: string;
  /** Where it can be read in full. */
  href?: string;
  /** When, and anything else in the label register: a release, a revision. */
  meta?: string;
  /** Their initials, and the mark is drawn only where they are given. A byline
      derives them from the name because a byline is a person; a quote does
      not, because half of what is worth quoting is a document, and a monogram
      of a filename is a person invented for a source that has none. */
  initials?: string;
}

export class SdsQuote extends SdsElement {
  static override properties = {
    body: { type: String },
    by: { type: String },
    as: { type: String },
    href: { type: String },
    meta: { type: String },
    initials: { type: String },
  };

  declare body: string | TemplateResult;
  declare by: string;
  declare as: string;
  declare href: string;
  declare meta: string;
  declare initials: string;

  constructor() {
    super();
    this.body = '';
    this.by = '';
    this.as = '';
    this.href = '';
    this.meta = '';
    this.initials = '';
  }

  protected override render(): TemplateResult {
    return html`<figure class="sds-quote">
  <blockquote class="sds-quote__body">${this.body}</blockquote>
  <figcaption class="sds-quote__by"><sds-byline
    name="${this.by}"
    as="${this.as}"
    meta="${this.meta}"
    href="${this.href}"
    initials="${this.initials}"
    ?unmarked="${!this.initials}"
  ></sds-byline></figcaption>
</figure>`;
  }
}

define('sds-quote', SdsQuote);
