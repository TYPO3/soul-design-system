/* sds-nav-outline — the parts of a long document, beside it.

   The whole of a document with more places than a window is tall, in the
   panel that is its frame. Every part and every section, in one tree, so
   the reader always has the whole document in reach. Each entry can carry
   its number, `4` and `4.2`, counted from its place. It reads the page to
   find where the reader is, as the contents beside a column does. The
   marked row stays inside its own scrolling box.

     .entries = [{ label: 'Purpose', href: '#purpose', items: [ … ] }]

   Where the panel has no room beside the page, the list folds behind one
   press in the panel's head. The fold is a `<details>`, written open, so
   the list is there before any script and where none runs. The script
   shuts it where the press draws, and opens it again where the press does
   not. Before the script it is the list with nothing marked. */

import { html, nothing, type TemplateResult, type PropertyValues } from 'lit';
import './icon.ts';
import { lines } from '../lib/template.ts';
import { define, SdsElement } from '../lib/element.ts';
import { branch, type MenuEntry } from './nav-base.ts';

/** The name of the list of a document's parts, where nobody named it. */
const HEADING = 'Contents';

/** A heading the list points at, and the entry that points at it. */
interface Mark {
  href: string;
  node: Element;
}

export class SdsNavOutline extends SdsElement {
  static override properties = {
    label: { type: String },
    entries: { type: Array },
    numbered: { type: Boolean },
    at: { type: String, state: true },
  };

  /** The heading over the list, and the name of the navigation. */
  declare label: string;

  /** The parts of the document, nested as deep as the document nests them. */
  declare entries: MenuEntry[];

  /** Every entry carries its number, counted from its place in the list the
      way a numbered document counts its parts. Written as text: a browser
      leaves generated content out of the name a row has out loud. */
  declare numbered: boolean;

  /** Where the reader is, as the href of that part. Empty until the element
      reads the page, which is where a server stops and the data has the say. */
  declare at: string;

  private watching?: AbortController;
  private queued = 0;

  constructor() {
    super();
    this.label = HEADING;
    this.entries = [];
    this.numbered = false;
    this.at = '';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.watch();
  }

  /** The fold, and if its press draws. The stylesheet decides where the
      list folds, and draws the press only there. So the element asks the
      press rather than the window, and carries no width of its own. */
  private fold(): HTMLDetailsElement | null {
    return this.querySelector<HTMLDetailsElement>('.sds-outline__fold');
  }

  private folds(): boolean {
    return Boolean(this.querySelector<HTMLElement>('.sds-outline__toggle')?.getClientRects().length);
  }

  /** Put the fold in the state its width asks for: shut where it folds, open
      where it does not. Only on a change of width, so a reader who opened it
      keeps it open while they read. */
  private narrow = false;

  private fit(first = false): void {
    const fold = this.fold();
    if (!fold) return;
    const narrow = this.folds();
    if (!first && narrow === this.narrow) return;
    this.narrow = narrow;
    fold.open = !narrow;
  }

  /** A press on a row where the list folds: the reader chose a place, and
      the list has done its work. It shuts, and the page under it shows the
      place. */
  private chose(event: Event): void {
    const row = (event.target as Element).closest('.sds-outline__item');
    const fold = this.fold();
    if (row && fold && this.folds()) fold.open = false;
  }

  protected override firstUpdated(): void {
    this.fit(true);
  }

  override disconnectedCallback(): void {
    this.watching?.abort();
    cancelAnimationFrame(this.queued);
    super.disconnectedCallback();
  }

  /** One reading, a frame from now. A scroll fires far faster than a paint. */
  private soon(): void {
    cancelAnimationFrame(this.queued);
    this.queued = requestAnimationFrame(() => this.read());
  }

  /** Follow the page. On the document and on the way down: a scroll event
      does not bubble, and the column can be the scroller rather than the
      window. On resize too, which moves every heading at once. */
  private watch(): void {
    this.watching?.abort();
    this.watching = new AbortController();
    const { signal } = this.watching;
    const soon = (): void => this.soon();
    document.addEventListener('scroll', soon, { capture: true, passive: true, signal });
    window.addEventListener('resize', soon, { passive: true, signal });
    window.addEventListener('resize', () => this.fit(), { passive: true, signal });
    soon();
  }

  /** The entries the list draws, by target. Read from the rows rather than
      from the data, so a level a stylesheet hides never takes the mark.
      Empty before the first render. */
  private drawn(): Set<string> {
    const out = new Set<string>();
    for (const row of this.querySelectorAll<HTMLElement>('.sds-outline__item')) {
      if (row.getClientRects().length) out.add(row.getAttribute('href') ?? '');
    }
    return out;
  }

  /** The headings this list points at, in the order the page has them. An
      entry that points away from this page is a link and not a place in it,
      so it stays out. So does one the list does not draw. */
  private marks(): Mark[] {
    const drawn = this.drawn();
    const found: Mark[] = [];
    for (const entry of this.entries.flatMap(branch)) {
      const href = entry.href ?? '';
      if (href.length < 2 || !href.startsWith('#')) continue;
      if (drawn.size && !drawn.has(href)) continue;
      const node = document.getElementById(decodeURIComponent(href.slice(1)));
      if (node) found.push({ href, node });
    }
    return found;
  }

  /** What moves the headings: the nearest ancestor that scrolls, and the
      page where none does. */
  private scroller(node: Element): Element {
    for (let up = node.parentElement; up; up = up.parentElement) {
      const flow = getComputedStyle(up).overflowY;
      if (/auto|scroll|overlay/.test(flow) && up.scrollHeight > up.clientHeight + 1) return up;
    }
    return document.scrollingElement ?? document.documentElement;
  }

  /** Where a heading comes to rest after a jump: the top of the scroller,
      plus `scroll-padding-top`. Measured against that line, the entry a
      press marks is the entry the scroll marks. */
  private line(box: Element): number {
    const page = box === (document.scrollingElement ?? document.documentElement);
    const pad = parseFloat(getComputedStyle(page ? document.documentElement : box).scrollPaddingTop);
    const top = page ? 0 : box.getBoundingClientRect().top;
    return top + (Number.isFinite(pad) ? pad : 0) + 1;
  }

  /** As far down as the reader can get. The last heading can stand below the
      line and never reach it. */
  private ended(box: Element): boolean {
    const rest = box.scrollHeight - box.clientHeight;
    return rest > 2 && rest - box.scrollTop < 2;
  }

  /** Which part the reader is in: the last heading that has passed the line,
      and none while none has. A document opens above its first heading. */
  private read(): void {
    const marks = this.marks();
    const first = marks[0];
    if (!first) return;
    const box = this.scroller(first.node);
    const line = this.line(box);
    let at = '';
    for (const mark of marks) {
      if (mark.node.getBoundingClientRect().top > line) break;
      at = mark.href;
    }
    this.at = this.ended(box) ? (marks[marks.length - 1] as Mark).href : at;
  }

  /** The entry the reader is in. The page wins once the element has read it.
      The data is what a card, a story and a server-rendered page have instead. */
  private isCurrent(entry: MenuEntry): boolean {
    return this.at ? entry.href === this.at : Boolean(entry.current);
  }

  /** The entries at one level, each numbered by its place under the number
      of the entry above: `4`, then `4.1`, `4.2`. */
  private list(entries: readonly MenuEntry[], above = ''): TemplateResult {
    return html`<ul class="sds-outline__list">
  ${lines(entries.map((entry, i) => this.row(entry, above ? `${above}.${i + 1}` : String(i + 1))), 2)}
</ul>`;
  }

  /** One row. `aria-current="location"` and not `page`: every entry here is
      the document, and the mark is the part of it the reader is at. The
      space after the number is text, so the name a row has out loud keeps
      the two apart. The name stands in a node of its own, so the underline
      under the pointer is the name's and never the space's. */
  private item(entry: MenuEntry, number: string): TemplateResult {
    const here = this.isCurrent(entry);
    return html`<a
    class="${here ? 'sds-outline__item is-active' : 'sds-outline__item'}"
    href="${entry.href ?? '#'}"
    aria-current="${here ? 'location' : nothing}"
  >${this.numbered ? html`<span class="sds-outline__number">${number}</span> ` : nothing}<span class="sds-outline__label">${entry.label}</span></a>`;
  }

  /** One part, and the sections under it. */
  private row(entry: MenuEntry, number: string): TemplateResult {
    const under = entry.items ?? [];
    return html`<li>
  ${this.item(entry, number)}
  ${under.length ? this.list(under, number) : nothing}
</li>`;
  }

  /** Keep the marked row where the reader can see it, by the least move that
      brings it inside. A box that already shows the row stands still and does
      not fight a reader who scrolled it. Its own `scrollTop`, never
      `scrollIntoView`: that walks up every scroller and takes the page along. */
  private follow(): void {
    const here = this.querySelector<HTMLElement>('.sds-outline__item.is-active');
    const box = here?.closest<HTMLElement>('.sds-outline');
    if (!here || !box || box.scrollHeight - box.clientHeight < 2) return;
    const pad = getComputedStyle(box);
    const edge = box.getBoundingClientRect();
    const row = here.getBoundingClientRect();
    const above = row.top - (edge.top + (parseFloat(pad.paddingTop) || 0));
    const below = row.bottom - (edge.bottom - (parseFloat(pad.paddingBottom) || 0));
    if (above < 0) box.scrollTop += above;
    else if (below > 0) box.scrollTop += below;
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has('at') || changed.has('entries')) this.follow();
  }

  protected override render(): TemplateResult {
    const label = this.label || HEADING;
    /* A `<nav>` that says which one it is, for the same reason the contents
       beside a column does. The press stands first, for the head it joins
       where the list folds; the label is the list's own where it does not.
       `open` stands in the markup, not in a binding: the reader and the
       width move it, and a binding puts it back on every reading. */
    return html`<nav class="sds-outline" aria-label="${label}" @click="${(event: Event) => this.chose(event)}">
  <details class="sds-outline__fold" open>
    <summary class="sds-outline__toggle"><sds-icon name="actions-list"></sds-icon><span>${label}</span><sds-icon name="actions-chevron-down"></sds-icon></summary>
    <p class="sds-label">${label}</p>
    ${this.list(this.entries)}
  </details>
</nav>`;
  }
}

define('sds-nav-outline', SdsNavOutline);
