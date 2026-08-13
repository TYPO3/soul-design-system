/* sds-pager — the way on from a page.

   Two links and no more, because a page read in order has two neighbours. Not
   `sds-pagination`, which numbers the pages of a result list: that is a set a
   reader moves around inside, this is a line they are walking along, and the
   only two entries worth a row at the foot of a page are the one behind and
   the one ahead.

   Four attributes rather than two objects: a label and a target each fit in a
   string, and JSON is what a list of unknown length costs. A `<sds-pager>` in
   a page reads as what it points at.

   The direction is on the glyph, not on the link. A name written over the
   whole control replaces the page title a reader can see with a sentence they
   cannot; named on the mark, it joins the title instead. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { buttonLabel, buttonMarkup } from './button.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface PagerProps {
  /** The page behind this one — both halves, or neither: a control with a
      target and no name is a control nobody can read, and one with a name and
      no target is a control that does nothing. */
  previousHref?: string;
  previousLabel?: string;
  nextHref?: string;
  nextLabel?: string;
  /** What the row is called for a reader who cannot see that it is one. */
  label?: string;
}

export class SdsPager extends SdsElement {
  static override properties = {
    previousHref: { type: String, attribute: 'previous-href' },
    previousLabel: { type: String, attribute: 'previous-label' },
    nextHref: { type: String, attribute: 'next-href' },
    nextLabel: { type: String, attribute: 'next-label' },
    label: { type: String },
  };

  declare previousHref: string;
  declare previousLabel: string;
  declare nextHref: string;
  declare nextLabel: string;
  declare label: string;

  constructor() {
    super();
    this.previousHref = '';
    this.previousLabel = '';
    this.nextHref = '';
    this.nextLabel = '';
    this.label = 'Pages either side of this one';
  }

  /* `buttonMarkup` rather than `<sds-button>`, the way `sds-pagination` draws
     its own steps: an element given children draws none of them outside a
     browser, and a link that goes somewhere has nothing to upgrade for. The
     markup is the button's own, exported from the button. */
  private static step(href: string, body: unknown, rel: 'prev' | 'next'): TemplateResult {
    return buttonMarkup({ variant: 'secondary', href, rel }, body);
  }

  protected override render(): TemplateResult {
    const back = this.previousHref && this.previousLabel
      ? SdsPager.step(
          this.previousHref,
          html`<sds-icon name="actions-arrow-left" size="16" label="Previous page"></sds-icon>${buttonLabel(this.previousLabel)}`,
          'prev',
        )
      : '';
    const on = this.nextHref && this.nextLabel
      ? SdsPager.step(
          this.nextHref,
          html`${buttonLabel(this.nextLabel)}<sds-icon name="actions-arrow-right" size="16" label="Next page"></sds-icon>`,
          'next',
        )
      : '';

    /* `.sds-foot` is the class layer's own name for this row — one line, the
       way out of a page — so the shape is not drawn a second time here. What
       `.sds-pager` adds is which end each control sits at. */
    return html`<nav class="sds-foot sds-pager" aria-label="${this.label}">
  ${back}
  ${on ? html`<span class="sds-pager__next">${on}</span>` : ''}
</nav>`;
  }
}

define('sds-pager', SdsPager);
