/* sds-swatch — one colour, stated as a fact.

   A chip, what the colour is called, and the value it resolves to. All three,
   because none of them is enough alone: a chip says nothing a reader can type,
   a token name says nothing about what the mode does with it, and a hex out of
   context says nothing about where it may be used.

   A hairline is a colour too and cannot be shown as a fill — `line` paints the
   chip's edge instead of its middle, which is the only way to show a value
   that is one pixel wide wherever it is really used. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

/** How the chip carries the value. `fill` is a surface, `line` a hairline. */
export type SwatchKind = 'fill' | 'line';

/* What may be painted. A colour arrives from a document, and a document is
   written by somebody who is not this element — so the value goes into a style
   attribute only if it is a colour and nothing else. Anything rejected is
   dropped rather than guessed at: an unpainted chip beside its name is a
   reader who can still read the value, and a smuggled declaration is not.

   Hex, the colour functions, a custom property, and the bare words CSS
   already knows. */
const COLOUR = /^(#[0-9a-f]{3,8}|(rgb|hsl|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\([^;{}]*\)|var\(--[\w-]+(,\s*[^;{}]*)?\)|[a-z]+)$/i;

export interface SwatchProps {
  /** What paints the chip — a token as it is written, or a literal where the
      value belongs to a mode this page is not being read in. */
  value: string;
  /** What it is called. The token where there is one, because that is the name
      a design writes; the human name where a set has no tokens. */
  name: string;
  /** What the name resolves to, written out. A token alone documents half the
      system: the value is the half that says what the mode did with it. */
  resolved?: string;
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
    /* A hairline is drawn as its own edge, so the chip keeps the page's ground
       behind it — a fill would be the same value doing a different job. */
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
