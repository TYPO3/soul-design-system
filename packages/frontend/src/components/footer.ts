/* sds-footer — the end of a site, not the end of a screen.

   `.sds-foot` is the other one: a single row with the way out of this page,
   which is all one screen owes its reader. A site of many pages owes the rest
   of itself, grouped so the columns read as sections.

   The last line says what the product is, and no surface here may imply an
   endorsement it does not have — so it is a required property rather than a
   slot a page may forget to fill. */

import { html, type TemplateResult } from 'lit';
import './link.ts';
import './image.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

/** A link in a column. `external` gets the glyph and opens away; `icon` is
    for the marks a footer is the usual home of — a repository, a chat, a
    feed. Labelled, always: a row of bare brand glyphs is a row of pictures
    the reader has to already recognise. */
export interface FooterLink {
  label: string;
  href?: string;
  external?: boolean;
  icon?: IconId;
}

/** One column: what it collects, and what is in it. */
export interface FooterGroup {
  label: string;
  items: readonly FooterLink[];
}

export interface FooterProps {
  groups: readonly FooterGroup[];
  /** What this is. Stated, never implied — and never whose it is. */
  note: string;
  /** The machine's name for it, set as the machine's. A product, a package,
      a repository — verbatim, and never title-cased. It is the name in the
      lockup: the end of a site says which site, and the mark alone is a
      picture the reader has to already know. */
  product?: string;
  /** The mark, as the file it is drawn in. Same file the bar carries, and the
      same distinction: an SVG is referenced into the page and follows it into
      dark, anything else is linked. */
  signet?: string;
  /** Whose product it is, where that is a second name — the first half of the
      lockup, with the accent rule between the two. The bar's own form. */
  brand?: string;
  /** Whose it is and from when. A separate line from the note because it is a
      separate claim, and a footer that runs the two together reads as though
      the sentence were part of the notice. */
  copyright?: string;
  /** What has to travel with it: a licence, a version, a legal page. */
  meta?: readonly FooterLink[];
  /** Where else it lives — a repository, a chat, a feed. At the far end of the
      line, because they are the one thing in a footer a reader looks for by
      position rather than by reading. */
  marks?: readonly FooterLink[];
}

export class SdsFooter extends SdsElement {
  static override properties = {
    groups: { type: Array },
    note: { type: String },
    product: { type: String },
    signet: { type: String },
    brand: { type: String },
    copyright: { type: String },
    meta: { type: Array },
    marks: { type: Array },
  };

  declare groups: readonly FooterGroup[];
  declare note: string;
  declare product: string;
  declare signet: string;
  declare brand: string;
  declare copyright: string;
  declare meta: readonly FooterLink[];
  declare marks: readonly FooterLink[];

  constructor() {
    super();
    this.groups = [];
    this.note = '';
    this.product = '';
    this.signet = '';
    this.brand = '';
    this.copyright = '';
    this.meta = [];
    this.marks = [];
  }

  private static link(item: FooterLink): TemplateResult {
    return item.icon
      ? html`<sds-link label="${item.label}" href="${item.href ?? '#'}" ?external="${item.external ?? false}" icon="${item.icon}"></sds-link>`
      : html`<sds-link label="${item.label}" href="${item.href ?? '#'}" ?external="${item.external ?? false}"></sds-link>`;
  }

  /* The mark and the name, in the lockup the bar draws — one construction, so
     the two ends of a site cannot say the name two ways. The mark is hidden
     from a reader who cannot see it rather than announced: the wordmark beside
     it already spells what it says. */
  private lockup(): TemplateResult | '' {
    if (!this.signet && !this.product) return '';
    return html`<span class="sds-lockup">
      ${this.signet
        ? html`<sds-image class="sds-signet" src="${this.signet}" alt="" width="24" height="24"></sds-image>`
        : ''}
      ${this.product
        ? html`<span class="sds-wordmark">${
            this.brand
              ? html`${this.brand}<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">${this.product}</span>`
              : html`${this.product}`
          }</span>`
        : ''}
    </span>`;
  }

  protected override render(): TemplateResult {
    /* What the site is, before the list of its pages: a footer opening with
       the mark and the sentence reads as the end of that site, and one opening
       with a column of links reads as more navigation. */
    const brand = this.lockup();
    const said = brand || this.note
      ? html`<div class="sds-footer__brand">
      ${brand}
      ${this.note ? html`<p class="sds-footer__note">${this.note}</p>` : ''}
    </div>`
      : '';

    return html`<footer class="sds-footer">
  <div class="sds-footer__top">
    ${said}
    ${this.groups.length
      ? html`<div class="sds-footer__groups">
      ${this.groups.map(
        (group) => html`<div class="sds-footer__group">
        <div class="sds-label">${group.label}</div>
        <div class="sds-footer__links">
          ${group.items.map((item) => SdsFooter.link(item))}
        </div>
      </div>`,
      )}
    </div>`
      : ''}
  </div>
  <div class="sds-footer__end">
    ${this.copyright ? html`<span>${this.copyright}</span>` : ''}
    ${this.meta.map((item) => SdsFooter.link(item))}
    ${this.marks.length
      ? html`<span class="sds-row__end">${this.marks.map((item) => SdsFooter.link(item))}</span>`
      : ''}
  </div>
</footer>`;
  }
}

define('sds-footer', SdsFooter);
