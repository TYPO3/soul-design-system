/* sds-card — a way into something: a chapter, a product, a news entry, a page.

   A picture at the top, the row saying what kind of thing it is and when, the
   title that goes there, the prose, and a foot carrying the action. Everything
   but the prose is a property, and everything but the picture may be left out.

   **The whole card is the target and the title is the link.** The anchor is
   stretched over the frame by the class layer, so the name a reader hears is
   the title while the hit area is the card. One link, therefore: the call to
   action is words rather than a second anchor to the same place.

   Not a surface, which is the bare plane. What this one holds is document
   content — several blocks of it, written between the tags — and `.sds-card`
   is the plane it is drawn on, so the frame is stated once. */

import { html, type TemplateResult } from 'lit';
import './badge.ts';
import './icon.ts';
import { type IconId } from './icon.ts';
import { art, exported } from '../lib/art.ts';
import { define, isBlank, SdsElement } from '../lib/element.ts';

export interface CardProps {
  heading: string;
  /** What is behind the title. Blocks out of a document, a sentence out of a
      property — both land in the same part. */
  body: string | TemplateResult;
  href?: string;
  /** The picture. Named `src` because everything in this system that takes a
      file names it `src`. */
  src?: string;
  alt?: string;
  /** The tracked-out line over the title: what a set of cards is named or
      numbered as — `CHAPTER 02`, `FOR EDITORS` — or when the entry is from,
      which is the same register and the same line. */
  label?: string;
  /** What kind of entry it is. A badge, because it is a fact about the entry
      rather than a result — no tone. It shares the line with the label. */
  tag?: string;
  /** A glyph above the label, where a set is told apart before it is read. */
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
       `sds-surface` states: a set of cards is scanned down its left edge. */
    const icon = this.icon
      ? html`<div class="sds-card__icon"><sds-icon name="${this.icon}" size="20"></sds-icon></div>`
      : '';
    /* The kind and the label on one line, and the line is dropped rather than
       left empty: a card whose first row is blank is a card with a hole where
       a set of them lines up. */
    const label =
      this.tag || this.label
        ? html`<div class="sds-row">
      ${this.tag ? html`<sds-badge label="${this.tag}"></sds-badge>` : ''}
      ${this.label ? html`<span class="sds-label">${this.label}</span>` : ''}
    </div>`
        : '';

    /* Blocks go in a `div` and a sentence in the `p` a sentence belongs in.
       Which it is, is what the caller handed over: a string is a sentence, and
       markup passed as the property is not — a page composing a byline and a
       line under it would otherwise get a `div` inside a `p`, which no browser
       keeps. `content` is the written form arriving where there are no
       children to lift — see `SdsElement`. */
    const written = this.taken ?? this.content;
    const blocks = written ?? (typeof this.body === 'string' ? undefined : this.body);
    const text = blocks
      ? html`<div class="sds-card__text">${blocks}</div>`
      : html`<p class="sds-card__text">${this.body}</p>`;

    /* Where there is nowhere to go, the title is a title — and the card is
       then not a target either, since this anchor is what stretches over it. */
    const named = this.href
      ? html`<a href="${this.href}">${this.heading}</a>`
      : html`${this.heading}`;
    /* No heading, no heading: a card holding a byline or a figure names itself
       inside its own body, and an empty `h3` there is a level in the document
       outline with nothing under it. */
    const title = this.heading ? html`<h3 class="sds-card__title">${named}</h3>` : '';

    /* Drawn only where there is somewhere to go, since it says the card goes
       there. A span and not an anchor: the title's link is stretched over the
       whole card, and a second one under it would be a second destination. */
    const action =
      this.action && this.href
        ? html`<span class="sds-card__action">${this.action}<sds-icon name="actions-arrow-right" size="16"></sds-icon></span>`
        : '';
    /* The foot is dropped when it would be empty, so a row of cards has no
       hollow last line to line up against. */
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
