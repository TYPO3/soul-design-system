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

  /** Whether a glyph is about direction rather than about the thing.

      The icon rule says a glyph leads its label and a direction glyph follows
      it, and that is a property of the glyph — so the component decides rather
      than the caller. A boolean here would be a caller's chance to put an
      arrow in front of a word, which is the one arrangement the rule forbids
      and the one a hurried page reaches for. */
  private static leads(icon: IconId): boolean {
    return !/^actions-(arrow|chevron|caret)-/.test(icon);
  }

  protected override render(): TemplateResult {
    /* `actions-window-open` follows for the same reason: it says where
       pressing the link goes, not what the link is. */
    const glyph = this.icon ? html`<sds-icon name="${this.icon}"></sds-icon>` : '';
    const lead = this.icon && SdsLink.leads(this.icon) ? glyph : '';
    const trail = this.icon && !SdsLink.leads(this.icon) ? glyph : '';
    return this.external
      ? html`<a class="sds-link sds-link--external" href="${this.href}" target="_blank" rel="noreferrer">${lead}${this.label} ${trail}<sds-icon name="actions-window-open"></sds-icon></a>`
      : html`<a class="sds-link" href="${this.href}">${lead}${this.label}${trail ? html` ${trail}` : ''}</a>`;
  }
}

define('sds-link', SdsLink);
