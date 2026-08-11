/* sds-footer — the end of a site, not the end of a screen.

   `.sds-foot` is the other one: a single row with the way out of this page,
   which is all one screen owes its reader. A site of many pages owes the rest
   of itself — grouped, so the columns are read as sections rather than as a
   list somebody stopped writing.

   The last line is the reason the two are separate components rather than one
   with a modifier. It says what the product is, and it is the surface where
   that has to be unambiguous: no surface here may imply an endorsement it does
   not have, so the line is a required property and not a slot a page may
   forget to fill. */

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
  /** What has to travel with it: a licence, a version, a legal page. */
  meta?: readonly FooterLink[];
}

export class SdsFooter extends SdsElement {
  static override properties = {
    groups: { type: Array },
    note: { type: String },
    meta: { type: Array },
  };

  declare groups: readonly FooterGroup[];
  declare note: string;
  declare meta: readonly FooterLink[];

  constructor() {
    super();
    this.groups = [];
    this.note = '';
    this.meta = [];
  }

  private static link(item: FooterLink): TemplateResult {
    return item.icon
      ? html`<sds-link label="${item.label}" href="${item.href ?? '#'}" ?external="${item.external ?? false}" icon="${item.icon}"></sds-link>`
      : html`<sds-link label="${item.label}" href="${item.href ?? '#'}" ?external="${item.external ?? false}"></sds-link>`;
  }

  protected override render(): TemplateResult {
    return html`<footer class="sds-footer">
  <div class="sds-footer__groups">
    ${this.groups.map(
      (group) => html`<div class="sds-footer__group">
      <div class="sds-label">${group.label}</div>
      <div class="sds-footer__links">
        ${group.items.map((item) => SdsFooter.link(item))}
      </div>
    </div>`,
    )}
  </div>
  <div class="sds-footer__end">
    <span>${this.note}</span>
    ${this.meta.map((item) => SdsFooter.link(item))}
  </div>
</footer>`;
  }
}

define('sds-footer', SdsFooter);
