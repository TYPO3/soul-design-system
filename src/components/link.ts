/* sds-link — a link.

   Always an `<a>` with an `href`, the external one included: anything else
   looks like a link, cannot be focused or opened in a new tab, and is invisible
   to whatever reads the page as a document.

   No `hovered` property — a component does not carry a fake state so a specimen
   can photograph it; `_specimen.css` paints that. The size is inherited, so a
   link sets in the type of whatever it sits in. `--external` carries
   `actions-window-open` after the label, the one icon that follows. */

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

  /** Whether a glyph is about direction rather than about the thing. A glyph
      leads its label and a direction glyph follows it, which is a property of
      the glyph — so the component decides. A boolean here would be a caller's
      chance to put an arrow in front of a word. */
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
