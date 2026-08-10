/* sds-tabs — switching the content of a panel rather than the page.

   The active item is a filled block, never a tint: a tint reads as "hovered"
   or "disabled" depending on what is under it, and this system already
   spends hover on a colour change. The accent marks the active item — one of
   the exactly three places `--accent` may appear at all. */

import { html, type TemplateResult } from 'lit';
import { lines } from '../lib/template.ts';
import { define } from '../lib/element.ts';
import { SdsNav } from './nav-base.ts';

export class SdsTabs extends SdsNav {
  protected override readonly block = 'sds-tabs';
  protected override readonly item = 'sds-tab';

  protected override render(): TemplateResult {
    return html`<div class="${this.block}">
  ${lines(this.items_(), 2)}
</div>`;
  }
}

define('sds-tabs', SdsTabs);
