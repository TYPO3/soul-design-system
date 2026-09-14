/* sds-card — a way into something: a chapter, a product, a news entry, a page.

   A picture at the top, the row with the kind and the date, the title, the
   prose, and a foot with the action. Everything
   but the prose is a property, and everything but the picture is optional.

   **The whole card is the target and the title is the link.** The class layer
   stretches the anchor over the frame, so the name a reader hears is the
   title while the hit area is the card. One link, therefore: the call to
   action is words rather than a second anchor to the same place.

   Not a surface, which is the bare plane. This one holds document content —
   several blocks of it, between the tags. `.sds-card` is the plane it draws
   on, so the frame stands in one place. */

import { html, type TemplateResult } from 'lit';
import './badge.ts';
import './icon.ts';
import { type IconId } from './icon.ts';
import { art, exported } from '../lib/art.ts';
import { define, isBlank, SdsElement } from '../lib/element.ts';

export interface CardProps {
  /** The name of the entry. The whole card links to it, so this is the line
      a reader chooses by. */
  heading: string;
  /** What is behind the title. Blocks out of a document, a sentence out of a
      property — both land in the same part. */
  body: string | TemplateResult;
  /** Where the card goes. The frame is the link, not a control inside it —
      there is nothing else on a card to press. */
  href?: string;
  /** The picture. Named `src` because everything in this system that takes a
      file names it `src`. */
  src?: string;
  /** What the picture shows, for a reader who does not get it. Empty where
      it carries nothing the heading has not already said. */
  alt?: string;
  /** The tracked-out line over the title: the name or number of a set of
      cards — `CHAPTER 02`, `FOR EDITORS`. Or the entry's date, which is the
      same register and the same line. */
  label?: string;
  /** What kind of entry it is. A badge, because it is a fact about the entry
      rather than a result — no tone. It shares the line with the label. */
  tag?: string;
  /** A glyph above the label, where a set tells its cards apart at a glance. */
  icon?: IconId;
  /** One line under a hairline: what the reader gets there, who it is for,
      what state it is in. A label register, so it does not compete. */
  footer?: string;
  /** The call to action, in words — `Read the chapter`. Not a button and not a
      second link: the whole card already goes there, so this is the line that
      says so. */
  action?: string;
}

export class SdsCard extends SdsElement {
  static override properties = {
    heading: { type: String },
    body: { type: String },
    href: { type: String },
    src: { type: String },
    alt: { type: String },
    label: { type: String },
    tag: { type: String },
    icon: { type: String },
    footer: { type: String },
    action: { type: String },
  };

  declare heading: string;
  declare body: string | TemplateResult;
  declare href: string;
  declare src: string;
  declare alt: string;
  declare label: string;
  declare tag: string;
  declare icon?: IconId;
  declare footer: string;
  declare action: string;

  /* What a caller wrote between the tags, taken before Lit renders over it.
     The one thing about a card an attribute cannot hold: out of a document the
     body is paragraphs, and often a list beside them. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.heading = '';
    this.body = '';
    this.href = '';
    this.src = '';
    this.alt = '';
    this.label = '';
    this.tag = '';
    this.footer = '';
    this.action = '';
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    const medium = this.src
      ? html`<div class="sds-card__media${exported(this.src) ? ' sds-card__media--exported' : ''}">
    ${art(this.src, this.alt)}
  </div>`
      : '';

    /* Above the label rather than beside the title, for the reason
       `sds-surface` states: a reader scans a set of cards down its left edge. */
    const icon = this.icon
      ? html`<div class="sds-card__icon"><sds-icon name="${this.icon}" size="20"></sds-icon></div>`
      : '';
    /* The kind and the label on one line, and the line goes rather than stays
       empty. A card whose first row is blank has a hole where a set of them
       lines up. */
    const label =
      this.tag || this.label
        ? html`<div class="sds-row">
      ${this.tag ? html`<sds-badge label="${this.tag}"></sds-badge>` : ''}
      ${this.label ? html`<span class="sds-label">${this.label}</span>` : ''}
    </div>`
        : '';

    /* Blocks go in a `div` and a sentence in the `p` a sentence belongs in.
       The caller's hand-over decides which: a string is a sentence, and markup
       in the property is not. A page with a byline and a line under it
       otherwise gets a `div` inside a `p`, which no browser keeps. `content`
       is the written form where there are no children to lift — see
       `SdsElement`. */
    const written = this.taken ?? this.content;
    const blocks = written ?? (typeof this.body === 'string' ? undefined : this.body);
    const text = blocks
      ? html`<div class="sds-card__text">${blocks}</div>`
      : html`<p class="sds-card__text">${this.body}</p>`;

    /* Where there is nowhere to go, the title is a title. The card is then
       not a target either, since this anchor is what stretches over it. */
    const named = this.href
      ? html`<a href="${this.href}">${this.heading}</a>`
      : html`${this.heading}`;
    /* No heading, no heading. A card with a byline or a figure names itself
       inside its own body. An empty `h3` there is a level in the document
       outline with nothing under it. */
    const title = this.heading ? html`<h3 class="sds-card__title">${named}</h3>` : '';

    /* Only where there is somewhere to go, since it says the card goes there.
       A span and not an anchor. The title's link stretches over the whole
       card, and a second one under it is a second destination. */
    const action =
      this.action && this.href
        ? html`<span class="sds-card__action">${this.action}<sds-icon name="actions-arrow-right" size="16"></sds-icon></span>`
        : '';
    /* The foot goes when it is empty, so a row of cards has no hollow last
       line to line up against. */
    const foot =
      this.footer || action
        ? html`<div class="sds-card__foot">
    ${this.footer ? html`<span class="sds-card__note">${this.footer}</span>` : ''}
    ${action}
  </div>`
        : '';

    return html`<article class="sds-card">
  ${medium}
  <div class="sds-card__body">
    ${icon}
    ${label}
    ${title}
    ${text}
  </div>
  ${foot}
</article>`;
  }
}

define('sds-card', SdsCard);
