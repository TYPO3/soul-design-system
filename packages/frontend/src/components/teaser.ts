/* sds-teaser — one entry in a list of them.

   An image where the entry has one, what it is and when, the headline, and the
   two lines that decide whether it is opened. Anything else is in `meta`.

   **The title is the link and the card is not.** A card wrapped in one anchor
   announces its whole contents as that link's name; it follows on hover
   instead. **And it is addressed, not built** — everything that fits in a
   string is a property, and only the summary may be written between the tags,
   because a summary out of a document is paragraphs. */

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
  /** The picture is linked rather than referenced — an SVG that never named
      `id="art"`. Written by the build, which is what can read the file;
      `src/lib/art.ts` holds the reasoning. */
  linked?: boolean;
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
    linked: { type: Boolean },
  };

  declare heading: string;
  declare body: string | TemplateResult;
  declare href: string;
  declare tag: string;
  declare meta: string;
  declare src: string;
  declare alt: string;
  declare linked: boolean;

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
    this.linked = false;
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    const medium = this.src
      ? html`<div class="sds-teaser__image">
    ${art(this.src, this.alt, { linked: this.linked })}
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
