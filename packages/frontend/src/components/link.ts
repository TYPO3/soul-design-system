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
  /** A glyph before the label — a repository, a chat, a feed. In running text
      it never replaces the label: the glyphs that say something about a result
      may stand alone, and a word in a sentence may not be a picture. */
  icon?: IconId;
  /** The label names the link without being drawn, and the glyph is the whole
      of it. For a mark that stands where a reader looks for marks — the row of
      accounts at the end of a footer — and nowhere a link sits in a sentence.
      Drawn at 24, because alone it is a target as well as a picture, and the
      external glyph goes: two marks on one link say one thing twice. */
  bare?: boolean;
}

export class SdsLink extends SdsElement {
  static override properties = {
    label: { type: String },
    href: { type: String, reflect: true },
    external: { type: Boolean, reflect: true },
    icon: { type: String },
    bare: { type: Boolean, reflect: true },
  };

  declare label: string;
  declare href: string;
  declare external: boolean;
  declare icon?: IconId;
  declare bare: boolean;

  constructor() {
    super();
    this.label = '';
    this.href = '#';
    this.external = false;
    this.bare = false;
  }

  /** Whether a glyph is about direction rather than about the thing. A glyph
      leads its label and a direction glyph follows it, which is a property of
      the glyph — so the component decides. A boolean here would be a caller's
      chance to put an arrow in front of a word. */
  private static leads(icon: IconId): boolean {
    return !/^actions-(arrow|chevron|caret)-/.test(icon);
  }

  protected override render(): TemplateResult {
    /* The mark alone, named for whoever cannot see it. `title` as well as
       `aria-label`: a picture with no word beside it is a question for a
       pointer too, and the tooltip is the only answer the page has. */
    if (this.bare && this.icon) {
      const mark = html`<sds-icon name="${this.icon}" size="24"></sds-icon>`;
      return this.external
        ? html`<a class="sds-link sds-link--bare" href="${this.href}" target="_blank" rel="noreferrer" aria-label="${this.label}" title="${this.label}">${mark}</a>`
        : html`<a class="sds-link sds-link--bare" href="${this.href}" aria-label="${this.label}" title="${this.label}">${mark}</a>`;
    }

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
