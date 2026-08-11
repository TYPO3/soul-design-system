/* sds-teaser — one entry in a list of them.

   What a list page is made of: a drawing where the entry has one, what it is
   and when, the headline, and the two lines that decide whether the reader
   opens it. Everything else a teaser is sometimes given — an author, a reading
   time, a share count — is either in `meta` or is not worth the row.

   **The title is the link and the card is not.** A card wrapped in one anchor
   announces its entire contents as that link's name, and takes selecting the
   text inside it away from the reader. The card follows on hover instead,
   which is what makes it feel like the target it deliberately is not.

   The drawing is the same pair mechanism a figure uses — `sds-art--light` and
   `sds-art--dark` — rather than a second one at thumbnail size. Two swaps
   would differ in the mode nobody is looking at. */

import { html, type TemplateResult } from 'lit';
import './badge.ts';
import { define, SdsElement } from '../lib/element.ts';

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
  /** The drawing. The light file where there is a pair. */
  art?: string;
  /** The dark file. Without one the entry shows no drawing at all rather than
      the wrong one: a light drawing on the dark canvas is worse than none. */
  artDark?: string;
  alt?: string;
}

export class SdsTeaser extends SdsElement {
  static override properties = {
    heading: { type: String },
    body: { type: String },
    href: { type: String },
    tag: { type: String },
    meta: { type: String },
    art: { type: String },
    artDark: { type: String, attribute: 'art-dark' },
    alt: { type: String },
  };

  declare heading: string;
  declare body: string | TemplateResult;
  declare href: string;
  declare tag: string;
  declare meta: string;
  declare art: string;
  declare artDark: string;
  declare alt: string;

  constructor() {
    super();
    this.heading = '';
    this.body = '';
    this.href = '#';
    this.tag = '';
    this.meta = '';
    this.art = '';
    this.artDark = '';
    this.alt = '';
  }

  protected override render(): TemplateResult {
    /* `--light` only where a dark file exists to be swapped for. On its own it
       would hide the drawing in the mode it has no counterpart for, which is
       the one failure this pair of classes is here to prevent. */
    const art = this.art
      ? html`<div class="sds-teaser__art">
    <img class="sds-art${this.artDark ? ' sds-art--light' : ''}" src="${this.art}" alt="${this.alt}" />
    ${this.artDark ? html`<img class="sds-art sds-art--dark" src="${this.artDark}" alt="${this.alt}" />` : ''}
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

    return html`<article class="sds-teaser">
  ${art}
  <div class="sds-teaser__body">
    ${meta}
    <h3 class="sds-teaser__title"><a href="${this.href}">${this.heading}</a></h3>
    <p class="sds-teaser__text">${this.body}</p>
  </div>
</article>`;
  }
}

define('sds-teaser', SdsTeaser);
