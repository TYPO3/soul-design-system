/* sds-compare — before and after: two pictures side by side, each with
   its claim.

   A concept shows what stands and what it proposes, and a reader reads the
   two against each other. So they stand in one row, each a figure with its
   own caption, under a word that says which is which. The words are the
   caller's: `Before` and `After` where nobody names them, `As it stands`
   and `Proposed` where a paper does. Each half is `sds-figure`, so a press
   opens either at its own size. A picture arrives as every picture does: a
   link to a file, in the colours of its export. */

import { html, type TemplateResult } from 'lit';
import './figure.ts';
import { define, SdsElement } from '../lib/element.ts';

/** One half: a picture and its claim. */
export interface Half {
  src: string;
  alt: string;
  caption?: string;
}

export interface CompareProps {
  before: Half;
  after: Half;
  /** The word over the first half. */
  beforeLabel?: string;
  /** The word over the second half. */
  afterLabel?: string;
  /** A press opens either picture at its own size. */
  zoomable?: boolean;
}

export class SdsCompare extends SdsElement {
  static override properties = {
    beforeSrc: { type: String, attribute: 'before-src' },
    beforeAlt: { type: String, attribute: 'before-alt' },
    beforeCaption: { type: String, attribute: 'before-caption' },
    afterSrc: { type: String, attribute: 'after-src' },
    afterAlt: { type: String, attribute: 'after-alt' },
    afterCaption: { type: String, attribute: 'after-caption' },
    beforeLabel: { type: String, attribute: 'before-label' },
    afterLabel: { type: String, attribute: 'after-label' },
    zoomable: { type: Boolean },
  };

  declare beforeSrc: string;
  declare beforeAlt: string;
  declare beforeCaption: string;
  declare afterSrc: string;
  declare afterAlt: string;
  declare afterCaption: string;
  declare beforeLabel: string;
  declare afterLabel: string;
  declare zoomable: boolean;

  constructor() {
    super();
    this.beforeSrc = '';
    this.beforeAlt = '';
    this.beforeCaption = '';
    this.afterSrc = '';
    this.afterAlt = '';
    this.afterCaption = '';
    this.beforeLabel = 'Before';
    this.afterLabel = 'After';
    this.zoomable = false;
  }

  private half(label: string, one: Half): TemplateResult {
    return html`<div class="sds-compare__half">
  <p class="sds-label">${label}</p>
  <sds-figure src="${one.src}" alt="${one.alt}" caption="${one.caption ?? ''}" ?zoomable="${this.zoomable}"></sds-figure>
</div>`;
  }

  protected override render(): TemplateResult {
    return html`<div class="sds-compare">
  ${this.half(this.beforeLabel, { src: this.beforeSrc, alt: this.beforeAlt, caption: this.beforeCaption })}
  ${this.half(this.afterLabel, { src: this.afterSrc, alt: this.afterAlt, caption: this.afterCaption })}
</div>`;
  }
}

define('sds-compare', SdsCompare);
