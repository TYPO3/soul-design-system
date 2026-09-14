/* sds-quote — a sentence borrowed from somewhere, with where it came from.

   The attribution is a must, and that is the whole of why this is a component.
   A quotation with no source in a product's own writing reads as the product
   quoting itself for emphasis. Nothing else here gets emphasis without a
   source either.

   It is a `sds-byline`, not a caption: authorship is one thing and looks the
   same wherever a page claims it. A caption-sized line under a borrowed
   sentence said the source mattered less than the sentence. */

import { html, type TemplateResult } from 'lit';
import { define, isBlank, SdsElement } from '../lib/element.ts';
import './byline.ts';

export interface QuoteProps {
  /** The sentence. Long enough to deserve the borrow, short enough to stand
      at heading size — a paragraph in quotation marks is a paragraph. */
  body: string | TemplateResult;
  /** Who said it. A person, a document, a release note. */
  by: string;
  /** What it is to the subject, where the name alone does not say. The
      attribute is `as` and not `role`. `role` is the global ARIA attribute, so
      `role="maintainer"` claims a role that does not exist, and axe says so. */
  as?: string;
  /** Where the full text is. */
  href?: string;
  /** When, and anything else in the label register: a release, a revision. */
  meta?: string;
  /** Their initials, and the mark draws only where a caller gives them. A
      byline derives them from the name because a byline is a person. A quote
      does not: half of what deserves a quote is a document. A monogram of a
      filename is a person invented for a source that has none. */
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

  /* The sentence, where it stood between the tags. A product surface quotes
     a line somebody composed and a property carries it. A document quotes the
     passage it found, with links and emphasis in it — which is markup or it
     is nothing. */
  private taken: Node[] | null = null;

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    return html`<figure class="sds-quote">
  <blockquote class="sds-quote__body">${this.taken ?? this.content ?? this.body}</blockquote>
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
