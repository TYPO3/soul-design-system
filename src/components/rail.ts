/* sds-rail — the 210px tool rail.

   Items are tool names, so they set in mono verbatim: never title-cased,
   never prettified. `typo3_icon_lookup` is what `typo3_icon_lookup` is
   called.

   The active item is a filled block, never a tint: a tint reads as "hovered"
   or "disabled" depending on what is under it, and this system already
   spends hover on a colour change. The accent marks the active item — one of
   the exactly three places `--accent` may appear at all. */

import { html, type TemplateResult } from 'lit';
import { lines } from '../lib/template.ts';
import { define } from '../lib/element.ts';
import { SdsNav } from './nav-base.ts';

export class SdsRail extends SdsNav {
  protected override readonly block = 'sds-rail';
  protected override readonly item = 'sds-rail__item';

  protected override render(): TemplateResult {
    return html`<div class="${this.block}">
  ${lines(this.items_(), 2)}
</div>`;
  }
}

define('sds-rail', SdsRail);
