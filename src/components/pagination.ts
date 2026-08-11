/* sds-pagination — where a list continues.

   Numbered, and every number an `href`. "Load more" has no address: the page a
   reader was on becomes a place they can only reach by scrolling to it again,
   and nothing they send to someone else points at what they were reading.

   The page they are on is the active item of a navigation and is drawn like
   every other one — the accent, filled — and it is text rather than a link,
   because a control that navigates to where you already are is a control that
   does nothing.

   Which numbers are shown is the component's, not the caller's: the first, the
   last, and the ones around the current, with a gap standing in for the rest.
   A caller that had to work that out would work it out differently on each
   page it built. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface PaginationProps {
  pages: number;
  /** One-based, the way it is written in the page. */
  current?: number;
  /** A page's target, with the number appended. `#page-` by default, so the
      element works on a surface that has no routes yet. */
  href?: string;
  /** What is being paged, for the count at the end of the row — "84 entries".
      Left off, the row is only the controls. */
  count?: string;
}

/** The numbers a row shows: the ends, the neighbours of the current one, and
    `0` where a run was left out. Two gaps at most, and never a gap standing in
    for a single number — "1 … 3" is longer than "1 2 3" and says less. */
export function pageNumbers(pages: number, current: number): readonly number[] {
  const keep = new Set<number>();
  for (let i = 1; i <= pages; i++) {
    if (i <= 1 || i >= pages || Math.abs(i - current) <= 1) keep.add(i);
  }
  const out: number[] = [];
  let last = 0;
  for (const n of [...keep].sort((a, b) => a - b)) {
    if (last && n - last > 1) out.push(n - last === 2 ? last + 1 : 0);
    out.push(n);
    last = n;
  }
  return out;
}

export class SdsPagination extends SdsElement {
  static override properties = {
    pages: { type: Number },
    current: { type: Number, reflect: true },
    href: { type: String },
    count: { type: String },
  };

  declare pages: number;
  declare current: number;
  declare href: string;
  declare count: string;

  constructor() {
    super();
    this.pages = 1;
    this.current = 1;
    this.href = '#page-';
    this.count = '';
  }

  private step(label: string, to: number, icon: 'actions-chevron-start' | 'actions-chevron-end'): TemplateResult {
    const off = to < 1 || to > this.pages;
    const cls = `sds-pagination__step${off ? ' is-disabled' : ''}`;
    const glyph = html`<sds-icon name="${icon}"></sds-icon>`;
    const inner = icon === 'actions-chevron-start' ? html`${glyph}${label}` : html`${label}${glyph}`;
    /* Disabled is a span, not a link with the pointer taken away: a step with
       nowhere to go is not a target, and leaving it in the tab order is a stop
       that answers nothing. */
    return off
      ? html`<span class="${cls}" aria-disabled="true">${inner}</span>`
      : html`<a class="${cls}" href="${this.href}${to}" rel="${icon === 'actions-chevron-start' ? 'prev' : 'next'}">${inner}</a>`;
  }

  protected override render(): TemplateResult {
    return html`<nav class="sds-pagination" aria-label="Pages">
  ${this.step('Previous', this.current - 1, 'actions-chevron-start')}
  ${pageNumbers(this.pages, this.current).map((n) =>
    n === 0
      ? html`<span class="sds-pagination__gap" aria-hidden="true">…</span>`
      : n === this.current
        ? html`<span class="sds-pagination__page is-active" aria-current="page">${n}</span>`
        : html`<a class="sds-pagination__page" href="${this.href}${n}">${n}</a>`,
  )}
  ${this.step('Next', this.current + 1, 'actions-chevron-end')}
  ${this.count ? html`<span class="sds-pagination__count">${this.count}</span>` : ''}
</nav>`;
  }
}

define('sds-pagination', SdsPagination);
