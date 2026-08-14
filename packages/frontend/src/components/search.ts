/* sds-search — finding a page in a site that has no server.

   A rendered site is files, so the index is a file too: a small JSON the build
   writes, fetched the first time somebody types. What was found is drawn by
   `sds-search-hits` rather than rebuilt in the drop.

   The hits drop from the field rather than from whatever box happens to be
   positioned above it. Without JavaScript neither the element nor the field is
   there: a search box that cannot search is worse than an honest absence, and
   the rail still lists every page. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import './search-hits.ts';
import { define, SdsElement } from '../lib/element.ts';
import { type SearchResultProps } from './search-result.ts';

/** One page, as the index has it. */
export interface SearchEntry {
  title: string;
  url: string;
  /** The first paragraph, or as much of it as the build kept. */
  text: string;
  /** The picture the page carries, where the index kept one. Named from the
      root like `url`, and resolved the same way. */
  image?: string;
}

/** Distinct ids per instance: the field names the panel it opens, and two
    search fields on one page must not both call it `sds-search-panel`. */
let seq = 0;

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

  private readonly panelId = `sds-search-${++seq}`;

  constructor() {
    super();
    this.index = '';
    this.label = 'Search';
    this.query = '';
    this.entries = null;
    this.open = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    /* A press anywhere else closes it. Not `blur`: a press on a result blurs
       the field before the link is followed, so closing there is a race the
       panel wins about as often as the reader does — and it was being settled
       with a 150ms guess. */
    document.addEventListener('pointerdown', this.onOutside);
  }

  override disconnectedCallback(): void {
    document.removeEventListener('pointerdown', this.onOutside);
    super.disconnectedCallback();
  }

  private readonly onOutside = (event: Event): void => {
    if (!this.open || event.composedPath().includes(this)) return;
    this.open = false;
  };

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

  /** Where the site's root is, from this page. The index lists every page as
      the build sees them, and a reader is rarely standing in the root — so a
      path out of it is resolved against the index's own address, which *is*
      the root. Left to the browser, a hit one directory down names a page that
      does not exist — and a picture beside it a file that is not there. */
  private from(path: string): string {
    return new URL(path, new URL('.', new URL(this.index, location.href))).href;
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

  /** The links in the drop, in the order they are read.

      Asked of the markup rather than kept as a list, because what is in the
      panel is drawn by `sds-search-result` and the class is the contract between
      them — the same contract the stylesheet works through. */
  private links(): HTMLAnchorElement[] {
    return [...this.querySelectorAll<HTMLAnchorElement>('.sds-search__panel a')];
  }

  /** In the field: down goes into the list, Escape gives the page back.

      Focus moves for real rather than a row being marked as though it had —
      these are links, and a reader who has arrowed to one should be able to
      open it in a new tab like any other. */
  private onFieldKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.open = false;
      return;
    }
    if (event.key !== 'ArrowDown' || !this.open) return;
    /* An arrow in a text field otherwise jumps the caret to one end of it. */
    event.preventDefault();
    this.links()[0]?.focus();
  }

  /** In the drop: the arrows walk it, and up from the first goes back to what
      was typed. Escape closes from anywhere in it, which is where a reader who
      changed their mind is standing. */
  private onPanelKey(event: KeyboardEvent): void {
    const field = this.querySelector<HTMLInputElement>('.sds-input');
    if (event.key === 'Escape') {
      this.open = false;
      field?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();

    const links = this.links();
    const here = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = here + (event.key === 'ArrowDown' ? 1 : -1);
    if (next < 0) field?.focus();
    else links[Math.min(next, links.length - 1)]?.focus();
  }

  /** Left entirely — a press elsewhere, or a tab out of the last hit. */
  private onLeave(event: FocusEvent): void {
    const to = event.relatedTarget as Node | null;
    if (to && this.contains(to)) return;
    this.open = false;
  }

  /* The field says it is a combobox, because that is the only way it may say
     the rest: `aria-expanded` and `aria-controls` are not attributes a plain
     text input carries, and axe reports the pair without the role as a serious
     violation. It is also what this is — a box you type in that offers a list
     underneath. */
  protected override render(): TemplateResult {
    const hits = this.hits;
    const open = this.open && this.query.trim().length > 0;

    return html`<div class="sds-search" @focusout="${(e: FocusEvent) => this.onLeave(e)}">
  <span class="sds-field">
    <sds-icon name="actions-search" size="16"></sds-icon>
    <input
      class="sds-input"
      type="text"
      role="combobox"
      aria-autocomplete="list"
      autocomplete="off"
      spellcheck="false"
      .value="${this.query}"
      placeholder="${this.label}"
      aria-label="${this.label}"
      aria-controls="${this.panelId}"
      aria-expanded="${open ? 'true' : 'false'}"
      @input="${(e: Event) => void this.type(e)}"
      @keydown="${(e: KeyboardEvent) => this.onFieldKey(e)}"
      @focus="${() => { this.open = this.query.trim().length > 0; }}"
    />
  </span>
  ${open ? this.panel(hits) : nothing}
</div>`;
  }

  /** What the index has, as what a result is drawn from. The only place the
      two vocabularies meet: a page has a title and a URL, a hit has a heading
      and an href, and nothing below here knows about an index.

      The whole sentence the index kept: how much of it a reader is shown is
      the drop's question and not this one's, and the class layer answers it —
      a hit under a field gives two lines of it, a page of results the lot. */
  private hitOf(entry: SearchEntry): SearchResultProps {
    return {
      heading: entry.title,
      href: this.from(entry.url),
      path: entry.url,
      snippet: entry.text,
      src: entry.image ? this.from(entry.image) : '',
    };
  }

  /** The drop, and what is in it. The box is this element's — where it hangs
      and how far it may grow are questions about the field it belongs to —
      and `sds-search-hits` draws the answer inside it, hits or none.

      The query is handed over rather than the marking done here, because what
      is highlighted has to be what was actually searched. */
  private panel(hits: SearchEntry[]): TemplateResult {
    return html`<div
  class="sds-search__panel"
  id="${this.panelId}"
  aria-label="${this.label}"
  @keydown="${(e: KeyboardEvent) => this.onPanelKey(e)}"
>
  <sds-search-hits
    .items="${hits.map((hit) => this.hitOf(hit))}"
    match="${this.query}"
  ></sds-search-hits>
</div>`;
  }
}

define('sds-search', SdsSearch);
