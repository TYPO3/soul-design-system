/* sds-pills — navigation for the sections of a page.

   The active item is a filled block, never a tint: a tint reads as "hovered"
   or "disabled" depending on what is under it, and this system already
   spends hover on a colour change. The accent marks the active item — one of
   the exactly three places `--accent` may appear at all. */

import { html, type TemplateResult } from 'lit';
import { lines } from '../lib/template.ts';
import { define } from '../lib/element.ts';
import { SdsNav } from './nav-base.ts';

export class SdsPills extends SdsNav {
  protected override readonly block = 'sds-pills';
  protected override readonly item = 'sds-pill';

  protected override render(): TemplateResult {
    return html`<nav class="${this.block}">
  ${lines(this.items_(), 2)}
</nav>`;
  }
}

define('sds-pills', SdsPills);
