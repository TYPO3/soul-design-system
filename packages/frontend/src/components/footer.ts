/* sds-footer — how a page ends.

   One shape, and every part of it falls away when nothing is set: a site of
   many pages owes the rest of itself in columns, a single screen owes what it
   is and the way out of it, and that is the same footer with less in it. No
   variant to choose — a page states what it has, and the ending it gets is
   what it stated.

   The last thing said is what the product is, and no surface here may imply an
   endorsement it does not have — so it is a required property rather than a
   slot a page may forget to fill. */

import { html, type TemplateResult } from 'lit';
import './link.ts';
import './image.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

/** A link in a column. `external` gets the glyph and opens away; `icon` is
    for the marks a footer is the usual home of — a repository, a chat, a
    feed. In a column the glyph leads the label; as a mark in `marks` it is
    the whole of the link, which is the one place in this system a brand glyph
    stands alone. */
export interface FooterLink {
  label: string;
  href?: string;
  external?: boolean;
  icon?: IconId;
}

/** One column: what it collects, and what is in it. `href` is the page the
    heading itself names, where the thing it collects has one — a section with
    a page of its own is reachable from its column or from nowhere, and
    repeating its name as the first entry under it is a column saying the same
    word twice. */
export interface FooterGroup {
  label: string;
  href?: string;
  items: readonly FooterLink[];
}

export interface FooterProps {
  /** The columns, where there are any. A page with none is a page with none:
      the block goes and what is left closes up. */
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

  /* What a column names, where that is a page. Not `sds-link`: the heading
     keeps the label's register and the label's colour, and at the links' it
     reads as the first entry of the list it names. The trail above a heading
     is written the same way and for the same reason — see `.sds-crumbs a`. */
  private static heading(group: FooterGroup): TemplateResult {
    return group.href
      ? html`<a class="sds-label sds-footer__heading" href="${group.href}">${group.label}</a>`
      : html`<div class="sds-label">${group.label}</div>`;
  }

  /* A mark, at the end of the line where marks are looked for: the glyph
     alone, at the size a mark is read at, named for whoever cannot see it.
     One with no glyph in the set is the labelled link it always was — the
     alternative is an account nobody can reach. */
  private static mark(item: FooterLink): TemplateResult {
    return item.icon
      ? html`<sds-link bare label="${item.label}" href="${item.href ?? '#'}" ?external="${item.external ?? false}" icon="${item.icon}"></sds-link>`
      : SdsFooter.link(item);
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
              ? html`<span class="sds-wordmark__brand">${this.brand}</span><span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">${this.product}</span>`
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

    /* Each block goes when there is nothing in it, rather than standing as an
       empty box the next one is spaced away from: a footer of one line is one
       line, not a line under a hand's width of nothing. */
    const closing = this.copyright || this.meta.length || this.marks.length;
    const top = said || this.groups.length;

    return html`<footer class="sds-footer">
  ${top
    ? html`<div class="sds-footer__top">
    ${said}
    ${this.groups.length
      ? html`<div class="sds-footer__groups">
      ${this.groups.map(
        (group) => html`<div class="sds-footer__group">
        ${SdsFooter.heading(group)}
        <div class="sds-footer__links">
          ${group.items.map((item) => SdsFooter.link(item))}
        </div>
      </div>`,
      )}
    </div>`
      : ''}
  </div>`
    : ''}
  ${closing
    ? html`<div class="sds-footer__end">
    ${this.copyright ? html`<span>${this.copyright}</span>` : ''}
    ${this.meta.map((item) => SdsFooter.link(item))}
    ${this.marks.length
      ? html`<span class="sds-footer__marks">${this.marks.map((item) => SdsFooter.mark(item))}</span>`
      : ''}
  </div>`
    : ''}
</footer>`;
  }
}

define('sds-footer', SdsFooter);
