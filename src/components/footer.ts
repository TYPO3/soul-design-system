/* sds-footer — the end of a site, not the end of a screen.

   `.sds-foot` is the other one: a single row with the way out of this page,
   which is all one screen owes its reader. A site of many pages owes the rest
   of itself, grouped so the columns read as sections.

   The last line says what the product is, and no surface here may imply an
   endorsement it does not have — so it is a required property rather than a
   slot a page may forget to fill. */

import { html, type TemplateResult } from 'lit';
import './link.ts';
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
      a repository — verbatim, and never title-cased. */
  product?: string;
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
    copyright: { type: String },
    meta: { type: Array },
    marks: { type: Array },
  };

  declare groups: readonly FooterGroup[];
  declare note: string;
  declare product: string;
  declare copyright: string;
  declare meta: readonly FooterLink[];
  declare marks: readonly FooterLink[];

  constructor() {
    super();
    this.groups = [];
    this.note = '';
    this.product = '';
    this.copyright = '';
    this.meta = [];
    this.marks = [];
  }

  private static link(item: FooterLink): TemplateResult {
    return item.icon
      ? html`<sds-link label="${item.label}" href="${item.href ?? '#'}" ?external="${item.external ?? false}" icon="${item.icon}"></sds-link>`
      : html`<sds-link label="${item.label}" href="${item.href ?? '#'}" ?external="${item.external ?? false}"></sds-link>`;
  }

  protected override render(): TemplateResult {
    return html`<footer class="sds-footer">
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
  <div class="sds-footer__end">
    ${this.product ? html`<span class="sds-mono">${this.product}</span>` : ''}
    ${this.note ? html`<span>${this.note}</span>` : ''}
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
