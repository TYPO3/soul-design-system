/* sds-link — a link.

   Always an `<a>` with an `href`, including the external one. It used to be
   drawn with inline styles, and the external variant was a `<span>` — a
   thing that looked like a link, could not be focused, could not be opened
   in a new tab, and was invisible to anything reading the page as a
   document. It also meant the card documenting `sds-link` was the one
   surface not using it.

   There is no `hovered` property. A hover state exists only under a
   pointer, and a specimen cannot be pointed at — so the card paints it, in
   `_specimen.css`, where the rest of the annotation lives. A component does
   not carry a fake state so that something else can photograph it.

   The size is inherited, deliberately: `sds-link` sets colour and hover and
   nothing else, so a link sets in the type of whatever it sits in — 15px
   among controls, 17px in body copy — without every caller pinning a size.

   `--external` carries `actions-window-open` after the label, which is the
   one direction icon that follows rather than leads. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface LinkProps {
  label: string;
  href?: string;
  /** Opens away from this surface: gets the glyph, and says so to the
      browser as well as to the eye. */
  external?: boolean;
  /** A glyph before the label — a repository, a chat, a feed. It never
      replaces the label: four glyphs in this system may stand alone, and all
      four say something about a result. A row of bare marks is a row of
      pictures the reader has to already know. */
  icon?: IconId;
}

export class SdsLink extends SdsElement {
  static override properties = {
    label: { type: String },
    href: { type: String, reflect: true },
    external: { type: Boolean, reflect: true },
    icon: { type: String },
  };

  declare label: string;
  declare href: string;
  declare external: boolean;
  declare icon?: IconId;

  constructor() {
    super();
    this.label = '';
    this.href = '#';
    this.external = false;
  }

  protected override render(): TemplateResult {
    /* The mark leads and the direction glyph follows, which is the icon rule
       stated in one line: a repository or a feed says what the link *is*, and
       `actions-window-open` says where pressing it goes. */
    const mark = this.icon ? html`<sds-icon name="${this.icon}"></sds-icon>` : '';
    return this.external
      ? html`<a class="sds-link sds-link--external" href="${this.href}" target="_blank" rel="noreferrer">${mark}${this.label} <sds-icon name="actions-window-open"></sds-icon></a>`
      : html`<a class="sds-link" href="${this.href}">${mark}${this.label}</a>`;
  }
}

define('sds-link', SdsLink);
