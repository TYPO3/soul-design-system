/* sds-swatch — one colour, stated as a fact.

   A chip, the colour's name, and the value it resolves to. All three, because
   none of them is enough alone. A chip says nothing a reader can type. A token
   name says nothing about what the mode does with it. A hex out of context
   says nothing about where it belongs.

   A hairline is a colour too and no fill can show it. `line` paints the chip's
   edge instead of its middle, the only way to show a value that is one pixel
   wide wherever it really stands. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

/** How the chip carries the value. `fill` is a surface, `line` a hairline. */
export type SwatchKind = 'fill' | 'line';

/* What the chip can paint. A colour arrives from a document, and somebody who
   is not this element wrote the document. So the value goes into a style
   attribute only if it is a colour and nothing else. A rejected value goes,
   with no guess. An unpainted chip beside its name is a reader who can still
   read the value, and a smuggled declaration is not.

   Hex, the colour functions, a custom property, and the bare words CSS
   already knows. */
const COLOUR = /^(#[0-9a-f]{3,8}|(rgb|hsl|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\([^;{}]*\)|var\(--[\w-]+(,\s*[^;{}]*)?\)|[a-z]+)$/i;

export interface SwatchProps {
  /** What paints the chip — a token as written, or a literal where the value
      belongs to a mode this page is not in. */
  value: string;
  /** Its name. The token where there is one, because that is the name a
      design writes; the human name where a set has no tokens. */
  name: string;
  /** What the name resolves to, written out. A token alone documents half the
      system: the value is the half that says what the mode did with it. */
  resolved?: string;
  /** What the token is for. `fill` is a surface or an ink, `line` a border —
      a hairline drawn as a filled square reads as a colour it is not. */
  kind?: SwatchKind;
}

export class SdsSwatch extends SdsElement {
  static override properties = {
    value: { type: String },
    name: { type: String, reflect: true },
    resolved: { type: String },
    kind: { type: String, reflect: true },
  };

  declare value: string;
  declare name: string;
  declare resolved: string;
  declare kind: SwatchKind;

  constructor() {
    super();
    this.value = '';
    this.name = '';
    this.resolved = '';
    this.kind = 'fill';
  }

  protected override render(): TemplateResult {
    const paint = COLOUR.test(this.value.trim()) ? this.value.trim() : '';
    /* A hairline draws as its own edge, so the chip keeps the page's ground
       behind it. A fill is the same value at a different job. */
    const style = paint
      ? this.kind === 'line'
        ? `border-color:${paint}`
        : `background:${paint}`
      : '';

    return html`<div class="sds-swatch${this.kind === 'line' ? ' sds-swatch--line' : ''}">
  <span class="sds-swatch__chip" style="${style}" aria-hidden="true"></span>
  <span class="sds-swatch__body">
    <span class="sds-swatch__name">${this.name}</span>
    ${this.resolved ? html`<span class="sds-swatch__value">${this.resolved}</span>` : nothing}
  </span>
</div>`;
  }
}

define('sds-swatch', SdsSwatch);
