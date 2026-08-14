/* sds-nav-pagination — where a list continues.

   Numbered, and every number an `href`: a page reachable only by scrolling is
   one a reader cannot send to anyone. The address is a whole URL with `{n}`
   where the number goes, because a list is as often at `?q=…&page=2&sort=date`
   as at the end of a path. Every number also fires `sds-change`, for a surface
   that pages in place and calls `preventDefault()` — not a second mode.

   The row is told the total and the page size and divides, so nothing hands
   over the same fact twice. The current page is text, not a link. */

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

export class SdsNavPagination extends SdsElement {
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

define('sds-nav-pagination', SdsNavPagination);
