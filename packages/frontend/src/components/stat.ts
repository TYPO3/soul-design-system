/* sds-stat — a number stated as a fact.

   The value first and largest, the label under it, and a line that says what
   bounds the number. The third is why this is a component rather than two
   divs. A figure with no bound is a claim, and "5 sources" says nothing until
   it says which five.

   Set in sans. Mono means the machine named the thing, and a count is a fact
   about the software rather than a string it returns. A version is one, which
   is why `note` takes a template. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, isBlank, SdsElement } from '../lib/element.ts';
import './icon.ts';
import { type IconId } from './icon.ts';

/* A line break must not split a number from what it counts, so the space
   before a unit is a narrow no-break one. Here rather than at every caller:
   a page that has to know the codepoint is a page that will forget it. */
const NNBSP = '\u202f';
/* And a full one between words. The narrow space is for a number and its
   unit, and between "of" and a figure it reads as no space at all. */
const NBSP = '\u00a0';

export interface StatProps {
  /** The figure. Concrete — "5", "240", "12.4+" — never "many". */
  value: string;
  /** What the figure is in — "ms", "%", "kB". Set smaller and quieter than
      the number, because a reader reads the unit after it and never instead. */
  unit?: string;
  /** The counted thing, in the label register. */
  label: string;
  /** The whole the figure is a part of, said after it — "2 of 3". Only where
      the figure really is a part: 240 ms is out of nothing. */
  of?: string;
  /** With `of`, a bar under the figure: the share it is of the whole, so a
      reader sees the proportion before the numbers. */
  bar?: boolean;
  /** One share of a list of them: the label and the count on one line
      over the bar, and the note under it. For a set of shares where the
      proportion is the point and the figure only its read-out. Takes `of`,
      and draws the bar. */
  list?: boolean;
  /** A glyph on the figure's own line, before it. Muted and never in a status
      colour, for the reason a card's is: a figure is a subject, not a result.
      Beside the number rather than over it — a glyph on a line of its own
      floats above the one thing the tile is for. */
  icon?: IconId;
  /** What bounds the figure. Without one, the number is a boast. The same
      line can stand between the tags instead, which is where it goes when it
      carries a link. */
  note?: string | TemplateResult;
}

export class SdsStat extends SdsElement {
  static override properties = {
    value: { type: String },
    unit: { type: String },
    label: { type: String },
    of: { type: String },
    bar: { type: Boolean, reflect: true },
    list: { type: Boolean, reflect: true },
    icon: { type: String },
    note: { type: String },
  };

  declare value: string;
  declare unit: string;
  declare label: string;
  declare of: string;
  declare bar: boolean;
  declare list: boolean;
  declare icon?: IconId;
  declare note: string | TemplateResult;

  /* The bound as a caller wrote it between the tags, taken before Lit renders
     over it. A sentence fits in the property; out of a document the same
     sentence carries a link, and that is what an attribute cannot hold. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.value = '';
    this.unit = '';
    this.label = '';
    this.of = '';
    this.bar = false;
    this.list = false;
    this.note = '';
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  /* The share, as a length. A measurement, so a style: no class names one.
     It stands on the figure's box, where the set mixes the fill from it. */
  private at(): string | undefined {
    const part = Number.parseFloat(this.value);
    const whole = Number.parseFloat(this.of);
    if (!(this.bar || this.list) || !(whole > 0) || !Number.isFinite(part)) return undefined;
    return `--sds-stat-at: ${Math.min(Math.max(part / whole, 0), 1) * 100}%`;
  }

  private share(): TemplateResult | string {
    return this.at() ? html`<div class="sds-stat__bar" aria-hidden="true"><span></span></div>` : '';
  }

  protected override render(): TemplateResult {
    /* `content` is the written form arriving where there are no children to
       lift — see `SdsElement`. Either way it is the same line. */
    const bound = this.taken ?? this.content ?? (this.note || undefined);
    if (this.list) {
      return html`<div class="sds-stat sds-stat--list" style="${this.at() ?? nothing}">
  <div class="sds-stat__head"><span class="sds-stat__name">${this.label}</span><span class="sds-stat__count">${this.value}${this.of ? `${NBSP}of${NBSP}${this.of}` : ''}${this.unit ? `${NNBSP}${this.unit}` : ''}</span></div>${this.share()}
  ${bound ? html`<div class="sds-stat__note">${bound}</div>` : ''}
</div>`;
    }
    return html`<div class="sds-stat" style="${this.at() ?? nothing}">
  <div class="sds-stat__value">${this.icon ? html`<span class="sds-stat__icon"><sds-icon name="${this.icon}" size="24"></sds-icon></span>` : ''}${this.value}${this.unit ? html`<span class="sds-stat__unit">${NNBSP}${this.unit}</span>` : ''}${this.of ? html`<span class="sds-stat__unit">${NBSP}of${NBSP}${this.of}</span>` : ''}</div>${this.share()}
  <div class="sds-label">${this.label}</div>
  ${bound ? html`<div class="sds-stat__note">${bound}</div>` : ''}
</div>`;
  }
}

define('sds-stat', SdsStat);
