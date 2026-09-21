/* sds-nav-toc — what is on this page, and where in it the reader is.

   The sections of the open page, as the entry every navigation of this system
   takes. It is the one list whose current entry no renderer can name: a
   heading is current because the reader scrolled to it. So the element reads
   the page, and the data only says where it starts.

     .entries = [{ label: 'Space scale', href: '#space-scale' }]

   Before the script it is the list with nothing marked, which is a contents. */

import { html, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { lines } from '../lib/template.ts';
import { define, SdsElement } from '../lib/element.ts';
import { branch, type MenuEntry } from './nav-base.ts';

/** The name of a list of a page's own sections, where nobody named it. */
const HEADING = 'On this page';

/** A heading the list points at, and the entry that points at it. */
interface Mark {
  href: string;
  node: Element;
}

export class SdsNavToc extends SdsElement {
  static override properties = {
    label: { type: String },
    entries: { type: Array },
    at: { type: String, state: true },
  };

  /** The heading over the list, and the name of the navigation. */
  declare label: string;

  /** The sections of the page, nested as deep as the page nests them. */
  declare entries: MenuEntry[];

  /** Where the reader is, as the href of that section. Empty until the
      element reads the page, which is where a server stops and the data has
      the say. */
  declare at: string;

  private watching?: AbortController;
  private queued = 0;

  constructor() {
    super();
    this.label = HEADING;
    this.entries = [];
    this.at = '';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.watch();
  }

  override disconnectedCallback(): void {
    this.watching?.abort();
    cancelAnimationFrame(this.queued);
    super.disconnectedCallback();
  }

  /** Follow the page. On the document and on the way down: a scroll event
      does not bubble, and the column can be the scroller rather than the
      window. On resize too, which moves every heading at once. One reading a
      frame — a scroll fires far faster than a paint. */
  private watch(): void {
    this.watching?.abort();
    this.watching = new AbortController();
    const { signal } = this.watching;
    const soon = (): void => {
      cancelAnimationFrame(this.queued);
      this.queued = requestAnimationFrame(() => this.read());
    };
    document.addEventListener('scroll', soon, { capture: true, passive: true, signal });
    window.addEventListener('resize', soon, { passive: true, signal });
    soon();
  }

  /** The entries the list draws, by target. Read from the rows rather than
      from the data. Beside the column it shows two levels and hides the rest,
      and which those are is the stylesheet's to say. Empty before the first
      render, and then it says nothing rather than nothing is on the page. */
  private drawn(): Set<string> {
    const out = new Set<string>();
    for (const row of this.querySelectorAll<HTMLElement>('.sds-toc__item')) {
      if (row.getClientRects().length) out.add(row.getAttribute('href') ?? '');
    }
    return out;
  }

  /** The headings this list points at, in the order the page has them. An
      entry that points away from this page is a link and not a place in it,
      so it stays out. So does one the list does not draw. A mark on a heading
      no row shows leaves every visible entry unmarked, which is the list gone
      blank inside a section. */
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
      page where none does. A pane with a scrollbar of its own is where the
      reader reads, and the top of the window is not on it. */
  private scroller(node: Element): Element {
    for (let up = node.parentElement; up; up = up.parentElement) {
      const flow = getComputedStyle(up).overflowY;
      if (/auto|scroll|overlay/.test(flow) && up.scrollHeight > up.clientHeight + 1) return up;
    }
    return document.scrollingElement ?? document.documentElement;
  }

  /** Where a heading comes to rest after a jump: the top of the scroller,
      plus the offset it keeps for whatever stands over it. That offset is
      `scroll-padding-top`, which answers the bar for every target at once.
      Measured against that line, the entry a press marks is the entry the
      scroll marks. */
  private line(box: Element): number {
    const page = box === (document.scrollingElement ?? document.documentElement);
    const pad = parseFloat(getComputedStyle(page ? document.documentElement : box).scrollPaddingTop);
    const top = page ? 0 : box.getBoundingClientRect().top;
    return top + (Number.isFinite(pad) ? pad : 0) + 1;
  }

  /** As far down as the reader can get. The last heading can stand below the
      line and never reach it. The list then marks the section above while the
      reader looks at the last one. Nothing to scroll is no foot to arrive at,
      with every section in view at once. */
  private ended(box: Element): boolean {
    const rest = box.scrollHeight - box.clientHeight;
    return rest > 2 && rest - box.scrollTop < 2;
  }

  /** Which section the reader is in: the last heading that has passed the
      line, and none while none has. A page opens above its first heading, and
      a mark there answers a question nobody asked. */
  private read(): void {
    this.keep();
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

  private list(entries: readonly MenuEntry[]): TemplateResult {
    return html`<ul class="sds-toc__list">
  ${lines(entries.map((entry) => this.row(entry)), 2)}
</ul>`;
  }

  /** One section, and whatever hangs under it. `aria-current="location"` and
      not `page`: every entry here is the page, and the mark is the part of it
      the reader is at. */
  private row(entry: MenuEntry): TemplateResult {
    const here = this.isCurrent(entry);
    const under = entry.items ?? [];
    return html`<li>
  <a
    class="${here ? 'sds-toc__item is-active' : 'sds-toc__item'}"
    href="${entry.href ?? '#'}"
    aria-current="${here ? 'location' : nothing}"
  >${entry.label}</a>
  ${under.length ? this.list(under) : nothing}
</li>`;
  }

  /** Keep the marked entry where the reader can see it. Beside the column the
      list is a box of its own and scrolls. A page with more sections than the
      box is tall marks one off its bottom edge. The list then says nothing
      about where the reader is, exactly where that matters. Its own `scrollTop`,
      never `scrollIntoView`: that walks up every scroller it finds and takes
      the page along with it. */
  private follow(): void {
    const here = this.querySelector<HTMLElement>('.sds-toc__item.is-active');
    const box = here?.closest<HTMLElement>('.sds-toc');
    if (!here || !box || box.scrollHeight - box.clientHeight < 2) return;
    const pad = getComputedStyle(box);
    const edge = box.getBoundingClientRect();
    const row = here.getBoundingClientRect();
    /* The least move that brings it inside. A list that already shows the
       entry stands still and does not fight a reader who scrolled it. */
    const above = row.top - (edge.top + (parseFloat(pad.paddingTop) || 0));
    const below = row.bottom - (edge.bottom - (parseFloat(pad.paddingBottom) || 0));
    if (above < 0) box.scrollTop += above;
    else if (below > 0) box.scrollTop += below;
  }

  /** A box with more rows than it shows keeps the wheel, by a class the
      sheet reads. Let through, the scroll runs on into the page at the edge,
      the mark moves, and the list jumps back under the reader's pointer.
      Only while it overflows: on a box with nothing to scroll, containment
      swallows the wheel and the page stops. So the element measures it. */
  private keep(): void {
    const box = this.querySelector<HTMLElement>('.sds-toc');
    box?.classList.toggle('is-scrollable', box.scrollHeight - box.clientHeight > 1);
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has('at') || changed.has('entries')) this.follow();
    this.keep();
  }

  protected override render(): TemplateResult {
    const label = this.label || HEADING;
    /* A `<nav>` that says which one it is. A page carries this, the rail and
       the trail, and a screen reader without the name announces "navigation,
       navigation, navigation". The label over the list is a label over links
       rather than a heading over prose, the register a rail names its own
       pages in. */
    return html`<nav class="sds-toc" aria-label="${label}">
  <p class="sds-label">${label}</p>
  ${this.list(this.entries)}
</nav>`;
  }
}

define('sds-nav-toc', SdsNavToc);
