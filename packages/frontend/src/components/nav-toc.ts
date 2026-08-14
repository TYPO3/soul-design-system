/* sds-nav-toc — what is on this page, and where in it the reader is.

   The sections of the page being read, as the entry every navigation of this
   system is given. It is the one list whose current entry nothing rendering
   the page can name: a heading is current because the reader has scrolled to
   it, so the element reads the page and the data only says where it starts.

     .entries = [{ label: 'Space scale', href: '#space-scale' }]

   Before the script it is the list with nothing marked, which is a contents. */

import { html, nothing, type TemplateResult } from 'lit';
import { lines } from '../lib/template.ts';
import { define, SdsElement } from '../lib/element.ts';
import { branch, type MenuEntry } from './nav-base.ts';

/** What a list of a page's own sections is called where nobody named it. */
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

  /** The heading over the list, and what the navigation is called. */
  declare label: string;

  /** The sections of the page, nested as deep as the page nests them. */
  declare entries: MenuEntry[];

  /** Where the reader is, as the href of that section — empty until the page
      has been read, which is where a server stops and the data has the say. */
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

  /** Follow the page. On the document and on the way down, because a scroll
      event does not bubble and the column may be the scroller rather than the
      window; and on resize, which moves every heading at once. One reading a
      frame — a scroll fires far faster than anything can be drawn. */
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

  /** The headings this list points at, in the order the page has them. An
      entry pointing anywhere but at this page is a link and not a place in it,
      and is left out of the reading rather than made a target of. */
  private marks(): Mark[] {
    const found: Mark[] = [];
    for (const entry of this.entries.flatMap(branch)) {
      const href = entry.href ?? '';
      if (href.length < 2 || !href.startsWith('#')) continue;
      const node = document.getElementById(decodeURIComponent(href.slice(1)));
      if (node) found.push({ href, node });
    }
    return found;
  }

  /** What is moving the headings: the nearest ancestor that scrolls, and the
      page where none does. A pane with a scrollbar of its own is where the
      reading is happening, and the top of the window is not on it. */
  private scroller(node: Element): Element {
    for (let up = node.parentElement; up; up = up.parentElement) {
      const flow = getComputedStyle(up).overflowY;
      if (/auto|scroll|overlay/.test(flow) && up.scrollHeight > up.clientHeight + 1) return up;
    }
    return document.scrollingElement ?? document.documentElement;
  }

  /** Where a heading jumped to comes to rest: the top of the scroller, plus
      the offset it keeps for whatever stands over it — `scroll-padding-top`,
      which is how the bar is answered for every target on the page at once.
      Measured against that line, the entry a press marks is the entry the
      scroll marks. */
  private line(box: Element): number {
    const page = box === (document.scrollingElement ?? document.documentElement);
    const pad = parseFloat(getComputedStyle(page ? document.documentElement : box).scrollPaddingTop);
    const top = page ? 0 : box.getBoundingClientRect().top;
    return top + (Number.isFinite(pad) ? pad : 0) + 1;
  }

  /** As far down as the reader can get. The last heading can stand below the
      line and never reach it, and the list would mark the section above while
      the reader is looking at the last one. Nothing to scroll is no foot to
      arrive at, every section being in view at once. */
  private ended(box: Element): boolean {
    const rest = box.scrollHeight - box.clientHeight;
    return rest > 2 && rest - box.scrollTop < 2;
  }

  /** Which section the reader is in: the last heading that has passed the
      line, and none while none has — a page opens above its first heading, and
      a list marking something there answers a question nobody asked. */
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

  /** The entry the reader is in. The page wins once it has been read, and the
      data is what a card, a story and a server-rendered page have instead. */
  private isCurrent(entry: MenuEntry): boolean {
    return this.at ? entry.href === this.at : Boolean(entry.current);
  }

  private list(entries: readonly MenuEntry[]): TemplateResult {
    return html`<ul class="sds-toc__list">
  ${lines(entries.map((entry) => this.row(entry)), 2)}
</ul>`;
  }

  /** One section, and whatever hangs under it. `aria-current="location"` and
      not `page`: every entry here is the page, and what is marked is the part
      of it the reader is at. */
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

  protected override render(): TemplateResult {
    const label = this.label || HEADING;
    /* A `<nav>` that says which one it is: a page carries this and the rail
       and the trail, and "navigation, navigation, navigation" is what a screen
       reader announces without it. The label over the list is a label over
       links rather than a heading over prose, which is the register a rail
       names its own pages in. */
    return html`<nav class="sds-toc" aria-label="${label}">
  <p class="sds-label">${label}</p>
  ${this.list(this.entries)}
</nav>`;
  }
}

define('sds-nav-toc', SdsNavToc);
