/* sds-teaser — one entry in a list of them.

   What a list page is made of: an image where the entry has one, what it is
   and when, the headline, and the two lines that decide whether the reader
   opens it. Everything else a teaser is sometimes given — an author, a reading
   time, a share count — is either in `meta` or is not worth the row.

   **The title is the link and the card is not.** A card wrapped in one anchor
   announces its entire contents as that link's name, and takes selecting the
   text inside it away from the reader. The card follows on hover instead,
   which is what makes it feel like the target it deliberately is not.

   The image is one file and is shown unchanged in both modes. A photograph is
   the same photograph whichever mode the page is in, and what a teaser carries
   is a photograph.

   **The card is addressed, not built.** Everything about an entry that fits in
   a string is a property — the headline, where it goes, the kind, the date,
   the picture — and a caller sets those and is done. Only the summary may be
   written between the tags, because a summary out of a document is paragraphs
   and there is no attribute that carries those.

   That line is the contract, and this element lost it for a while. A renderer
   that could not pass markup wrote the card's own parts instead —
   `.sds-teaser__body`, `.sds-teaser__title` — and the element did no more than
   frame markup somebody else had already built: every internal name became
   public API, neither side could change without the other, and the reason to
   have a component at all was gone. What made it possible to take back is that
   the pages are now rendered ahead of the browser — see
   `scripts/lib/prerender.ts` — so a property reaches a reader who runs no
   script, which is the only thing writing the parts ever bought. */

import { html, type TemplateResult } from 'lit';
import './badge.ts';
import { art } from '../lib/art.ts';
import { define, isBlank, SdsElement } from '../lib/element.ts';

export interface TeaserProps {
  heading: string;
  /** The two lines that decide whether it is opened. Not the first two lines
      of the entry — a summary is written, not cut. */
  body: string | TemplateResult;
  href?: string;
  /** What kind of entry it is. A badge, because it is a fact about the entry
      rather than a result — no tone. */
  tag?: string;
  /** When, and anything else that belongs in the label register. */
  meta?: string;
  /** The picture. Named `src` because every element in this system that
      takes a file names it `src` — `sds-image`, `sds-figure`, `sds-embed`,
      `sds-lightbox` — and a component that is the odd one out is one an
      author has to look up rather than write. */
  src?: string;
  alt?: string;
}

export class SdsTeaser extends SdsElement {
  static override properties = {
    heading: { type: String },
    body: { type: String },
    href: { type: String },
    tag: { type: String },
    meta: { type: String },
    src: { type: String },
    alt: { type: String },
  };

  declare heading: string;
  declare body: string | TemplateResult;
  declare href: string;
  declare tag: string;
  declare meta: string;
  declare src: string;
  declare alt: string;

  /* The summary a caller wrote between the tags, taken before Lit renders over
     it. The one thing about an entry that an attribute cannot hold: a summary
     out of a document is paragraphs, and sometimes a list. Everything else the
     card draws arrives as a property. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.heading = '';
    this.body = '';
    this.href = '';
    this.tag = '';
    this.meta = '';
    this.src = '';
    this.alt = '';
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    const medium = this.src
      ? html`<div class="sds-teaser__image">
    ${art(this.src, this.alt)}
  </div>`
      : '';

    /* The row is dropped rather than left empty: a card whose first line is
       blank is a card with a hole where a set of them lines up. */
    const meta =
      this.tag || this.meta
        ? html`<div class="sds-row">
      ${this.tag ? html`<sds-badge label="${this.tag}"></sds-badge>` : ''}
      ${this.meta ? html`<span class="sds-label">${this.meta}</span>` : ''}
    </div>`
        : '';

    /* A summary written between the tags is blocks — a renderer's summary is
       paragraphs and a list is not unheard of — so it is held in a `div`. The
       property form stays a `p`: it is a sentence, and a paragraph is what a
       sentence goes in. `content` is the same written form arriving where there
       are no children to lift — see `SdsElement`. */
    const written = this.taken ?? this.content;
    const text = written
      ? html`<div class="sds-teaser__text">${written}</div>`
      : html`<p class="sds-teaser__text">${this.body}</p>`;

    /* Where there is nowhere to go, the title is a title. A card whose
       headline is an anchor to nothing is a control that does nothing, and a
       reader who presses it learns the card cannot be trusted. */
    const title = this.href
      ? html`<a href="${this.href}">${this.heading}</a>`
      : html`${this.heading}`;

    return html`<article class="sds-teaser">
  ${medium}
  <div class="sds-teaser__body">
    ${meta}
    <h3 class="sds-teaser__title">${title}</h3>
    ${text}
  </div>
</article>`;
  }
}

define('sds-teaser', SdsTeaser);
