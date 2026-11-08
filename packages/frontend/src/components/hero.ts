/* sds-hero — the opening of a page: the claim, its press and one picture.

   It composes what the system has: a split, the display step, the lead, a
   figure and the presses of `sds-cta`. The picture stands beside the claim as
   decoration, so it does not open at full size.

   Blocks between the tags replace the lead. A renderer that writes its own
   heading there leaves `heading` out, so a page keeps one `h1`. A child with
   `slot="figure"` is the other half instead of the picture: a diagram, code, a
   card. An element there reads the page's tokens and follows its mode. */

import { html, type TemplateResult } from 'lit';
import './eyebrow.ts';
import './figure.ts';
import { type IconId } from './icon.ts';
import { pressRow } from './cta.ts';
import { define, SdsElement, TEXT } from '../lib/element.ts';

export type HeroAlign = 'start' | 'center' | 'end';
export type HeroLeads = 'start' | 'end';

export interface HeroProps {
  /** The claim, as the `h1` of the page. */
  heading?: string;
  /** The line over the title: what kind of page this is. */
  eyebrow?: string;
  /** The sentence under the title. */
  lead?: string;
  /** The press, in words. Without `href` no button draws. */
  action?: string;
  /** Where the press goes. */
  href?: string;
  /** A glyph in front of the press. */
  icon?: IconId;
  /** The quieter way beside the press. Written `second-href` for its target. */
  second?: string;
  secondHref?: string;
  /** The picture. Without it, and with no `slot="figure"`, the copy stands alone. */
  src?: string;
  /** What the picture shows. Empty for decoration. */
  alt?: string;
  /** No frame around the picture, for an illustration with no edge of its own. */
  plain?: boolean;
  /** Where the copy and the picture stand against each other, top to foot.
      Not `align`: a browser reads that attribute as `text-align` on any host. */
  valign?: HeroAlign;
  /** Which half comes first once the two have stacked. */
  leads?: HeroLeads;
}

const ALIGN: Record<HeroAlign, string> = { start: '', center: ' sds-split--center', end: ' sds-split--end' };

export class SdsHero extends SdsElement {
  /* The other half, when a caller writes it rather than names a file. */
  static override regions: readonly string[] = ['figure'];

  static override properties = {
    heading: { type: String },
    eyebrow: { type: String },
    lead: { type: String },
    action: { type: String },
    href: { type: String },
    icon: { type: String },
    second: { type: String },
    secondHref: { type: String, attribute: 'second-href' },
    src: { type: String },
    alt: { type: String },
    plain: { type: Boolean },
    valign: { type: String },
    leads: { type: String },
  };

  declare heading: string;
  declare eyebrow: string;
  declare lead: string;
  declare action: string;
  declare href: string;
  declare icon?: IconId;
  declare second: string;
  declare secondHref: string;
  declare src: string;
  declare alt: string;
  declare plain: boolean;
  declare valign: HeroAlign;
  declare leads: HeroLeads;

  /* The copy as a caller wrote it, taken before Lit renders over it. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.heading = '';
    this.eyebrow = '';
    this.lead = '';
    this.action = '';
    this.href = '';
    this.second = '';
    this.secondHref = '';
    this.src = '';
    this.alt = '';
    this.plain = false;
    this.valign = 'center';
    this.leads = 'start';
  }

  override connectedCallback(): void {
    /* The regions leave the element before its first render. Read here, both
       stay: the text as the copy, the figure in the cache `region` keeps. */
    const text = this.region(TEXT).map((one) => one.node as Node);
    if (text.length) this.taken = text;
    this.region('figure');
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    const copy = this.taken ?? this.content;
    const figure = this.region('figure');
    const reversed = this.leads === 'end' ? ' sds-split--leads-end' : '';
    return html`<div class="sds-hero sds-split${ALIGN[this.valign] ?? ALIGN.center}${reversed}">
  <div class="sds-column">
    ${this.eyebrow ? html`<sds-eyebrow label="${this.eyebrow}"></sds-eyebrow>` : ''}
    ${this.heading ? html`<h1 class="sds-display">${this.heading}</h1>` : ''}
    ${copy ?? (this.lead ? html`<p class="sds-lead">${this.lead}</p>` : '')}
    ${pressRow(this, 'sds-hero__actions')}
  </div>
  ${figure.length
    ? html`<div class="sds-column">${figure.map((one) => one.node)}</div>`
    : this.src ? html`<div class="sds-column"><sds-figure src="${this.src}" alt="${this.alt}" ?plain="${this.plain}"></sds-figure></div>` : ''}
</div>`;
  }
}

define('sds-hero', SdsHero);
