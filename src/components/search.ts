/* sds-search — finding a page in a site that has no server.

   A rendered documentation site is files. There is nothing to ask, so the
   index is a file too: a small JSON the build writes, fetched the first time
   somebody types and not before — a reader who never searches pays nothing.

   What it draws is the class layer's own: `.sds-field` for the input,
   `.sds-result` for a hit, `.sds-empty` when there are none. The panel is the
   menu's drop, because that is what this is.

   Without JavaScript the element is not there at all, and neither is the
   field. That is deliberate: a search box that cannot search is worse than an
   honest absence, and the rail beside it still lists every page. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

/** One page, as the index has it. */
export interface SearchEntry {
  title: string;
  url: string;
  /** The first paragraph, or as much of it as the build kept. */
  text: string;
}

export class SdsSearch extends SdsElement {
  static override properties = {
    /** Where the index is. Relative to the page, like every other asset. */
    index: { type: String },
    label: { type: String },
    query: { type: String, state: true },
    entries: { type: Array, state: true },
    open: { type: Boolean, state: true },
  };

  declare index: string;
  declare label: string;
  declare query: string;
  declare entries: SearchEntry[] | null;
  declare open: boolean;

  constructor() {
    super();
    this.index = '';
    this.label = 'Search';
    this.query = '';
    this.entries = null;
    this.open = false;
  }

  /* Fetched once, on the first keystroke. */
  private async load(): Promise<void> {
    if (this.entries || !this.index) return;
    try {
      const res = await fetch(this.index);
      this.entries = (await res.json()) as SearchEntry[];
    } catch {
      this.entries = [];
    }
  }

  private get hits(): SearchEntry[] {
    const q = this.query.trim().toLowerCase();
    if (!q || !this.entries) return [];
    return this.entries
      .filter((e) => `${e.title} ${e.text}`.toLowerCase().includes(q))
      .slice(0, 8);
  }

  private async type(event: Event): Promise<void> {
    this.query = (event.target as HTMLInputElement).value;
    this.open = this.query.trim().length > 0;
    await this.load();
  }

  protected override render(): TemplateResult {
    const hits = this.hits;
    return html`<span class="sds-field">
  <sds-icon name="actions-search" size="16"></sds-icon>
  <input
    class="sds-input"
    type="search"
    .value="${this.query}"
    placeholder="${this.label}"
    aria-label="${this.label}"
    @input="${(e: Event) => void this.type(e)}"
    @focus="${() => { this.open = this.query.trim().length > 0; }}"
    @blur="${() => { setTimeout(() => { this.open = false; }, 150); }}"
  />
</span>
${this.open
      ? html`<div class="sds-menu__panel sds-search__panel">
  ${hits.length
        ? hits.map(
          (hit) => html`<article class="sds-result">
    <h3 class="sds-result__title"><a href="${hit.url}">${hit.title}</a></h3>
    <span class="sds-result__path">${hit.url}</span>
  </article>`,
        )
        : html`<div class="sds-empty"><span class="sds-empty__body">Nothing matches “${this.query}”.</span></div>`}
</div>`
      : nothing}`;
  }
}

define('sds-search', SdsSearch);
