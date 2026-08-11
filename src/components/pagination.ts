/* sds-pagination — where a list continues.

   Numbered, and every number an `href`. "Load more" has no address: the page a
   reader was on becomes a place they can only reach by scrolling to it again,
   and nothing they send to someone else points at what they were reading.

   The address is written whole, with `{n}` standing where the number goes.
   A prefix the number is appended to only reaches the pages whose number ends
   the URL, and a list is as often at `?q=typo3&page=2&sort=date` — where the
   caller would have to rewrite the query it already has to put the number
   last.

   Every number is also a press the row announces. The address and the event
   are not two modes a caller picks between: the link is what the page is
   worth on its own, and `sds-change` is how a surface that pages in place
   hears about it. That surface calls `preventDefault()` on the event — the
   navigation is dropped and the row moves itself, so the numbers are right
   without the caller writing `current` back.

   The page they are on is the active item of a navigation and is drawn like
   every other one — the accent, filled — and it is text rather than a link,
   because a control that navigates to where you already are is a control that
   does nothing.

   Which numbers are shown is the component's, not the caller's: the first, the
   last, and the ones around the current, with a gap standing in for the rest.
   A caller that had to work that out would work it out differently on each
   page it built.

   How many pages there are is not asked for. The row is told how many there
   are in all and how many go on a page, and divides — a caller that hands over
   both a total and a page count has handed over the same fact twice, and the
   day a filter takes the list from 84 to 12 it is the division nobody
   remembered to redo that draws nine pages of nothing.

   The count at the end is that number and the word for what was counted, and
   the two are kept apart. One string — "84 entries" — is a number a caller has
   already formatted and a noun this system cannot see, so nothing can group
   the digits, and a total the element has to read out of a sentence is not one
   it can divide. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface PaginationProps {
  /** How many there are in all — the list, not the page. The pages follow from
      it. */
  count: number;
  /** How many go on one page. */
  perPage?: number;
  /** One-based, the way it is written in the page. */
  current?: number;
  /** A page's whole address, with `{n}` where its number goes —
      `/news/page/{n}/`, `?q=typo3&page={n}&sort=date`. `#page-{n}` by default,
      so the element works on a surface that has no routes yet. A template with
      no `{n}` in it is a prefix and the number is appended. */
  href?: string;
  /** What was counted, in the label register — "entries", "results". Left off,
      the row ends with the bare number. */
  label?: string;
}

/** What `sds-change` carries: the page that was asked for, one-based. */
export interface PageChange {
  page: number;
}

/** A page's address: the number written into the template where `{n}` stands.
    The whole address and not a prefix the number is stuck onto — a page lives
    at `?q=typo3&page=2&sort=date` as readily as at the end of a path, and a
    caller that can only append has to reorder the query it already has. */
export function pageHref(href: string, page: number): string {
  return href.includes('{n}') ? href.replace(/\{n\}/g, String(page)) : `${href}${page}`;
}

/** Grouped in threes. Written out rather than left to `toLocaleString`: the
    same row is rendered in a browser and outside one, and a separator that
    follows whichever locale the machine was started with makes those two
    different markup. */
const grouped = (n: number): string => String(n).replace(/\B(?=(\d{3})+$)/g, ',');

/** How many pages a list of `count` runs to at `perPage` each. Never fewer
    than one: a list with nothing in it is still on its first page, and a row
    with zero pages has no number to draw itself around. */
export function pageCount(count: number, perPage: number): number {
  return Math.max(1, Math.ceil(count / Math.max(1, perPage)));
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
    count: { type: Number },
    perPage: { type: Number, attribute: 'per-page' },
    current: { type: Number, reflect: true },
    href: { type: String },
    label: { type: String },
  };

  declare count: number;
  declare perPage: number;
  declare current: number;
  declare href: string;
  declare label: string;

  constructor() {
    super();
    this.count = 0;
    this.perPage = 10;
    this.current = 1;
    this.href = '#page-{n}';
    this.label = '';
  }

  /** What the row is drawn from, and the one place the division happens. */
  get pages(): number {
    return pageCount(this.count, this.perPage);
  }

  /** Say which page was asked for, and let the answer decide what the press
      does. Cancelable, because stopping the navigation is the only way a
      surface that pages in place can take the press over, and it is the same
      press either way. */
  private ask(event: Event, to: number): void {
    const change = new CustomEvent<PageChange>('sds-change', {
      detail: { page: to },
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    this.dispatchEvent(change);
    if (!change.defaultPrevented) return;
    event.preventDefault();
    this.current = to;
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
      : html`<a class="${cls}" href="${pageHref(this.href, to)}" rel="${icon === 'actions-chevron-start' ? 'prev' : 'next'}" @click="${(event: Event) => this.ask(event, to)}">${inner}</a>`;
  }

  protected override render(): TemplateResult {
    return html`<nav class="sds-pagination" aria-label="Pages">
  ${this.step('Previous', this.current - 1, 'actions-chevron-start')}
  ${pageNumbers(this.pages, this.current).map((n) =>
    n === 0
      ? html`<span class="sds-pagination__gap" aria-hidden="true">…</span>`
      : n === this.current
        ? html`<span class="sds-pagination__page is-active" aria-current="page">${n}</span>`
        : html`<a class="sds-pagination__page" href="${pageHref(this.href, n)}" @click="${(event: Event) => this.ask(event, n)}">${n}</a>`,
  )}
  ${this.step('Next', this.current + 1, 'actions-chevron-end')}
  ${this.count > 0 ? html`<span class="sds-pagination__count">${grouped(this.count)}${this.label ? ` ${this.label}` : ''}</span>` : ''}
</nav>`;
  }
}

define('sds-pagination', SdsPagination);
