/* sds-menu — the navigation in a header, and what it does as the header runs out.

   Pills in a row while there is room; a toggle and a panel below the bar when
   there is not. The decision is measured, not declared: a bar holds a product
   name as long as the product is called, so a breakpoint is wrong elsewhere.

   So it measures what its items need against the room the row has left, with
   itself out of the sum — nothing in the measurement depends on which state it
   is in, so there is no width where the two disagree and it oscillates.
   Collapsed, the panel is the same `<nav>` moved, never a second copy. */

import { html, type TemplateResult, type PropertyValues } from 'lit';
import { lines } from '../lib/template.ts';
import { define } from '../lib/element.ts';
import { SdsNav } from './nav-base.ts';
import './icon.ts';

/** Distinct ids per instance: the toggle names the panel it opens, and two
    menus on one page must not both call it `sds-menu-panel`. */
let seq = 0;

/** Every box actually laid out in `row`. The hosts are `display: contents`,
    so a DOM child is not necessarily a box — what the host renders is. */
function boxes(row: Element): HTMLElement[] {
  const out: HTMLElement[] = [];
  const walk = (parent: Element): void => {
    for (const child of parent.children) {
      const el = child as HTMLElement;
      const style = getComputedStyle(el);
      if (style.display === 'none') continue;
      if (style.display === 'contents') { walk(el); continue; }
      /* Out of flow takes no width from the row — the panel itself is one. */
      if (style.position === 'absolute' || style.position === 'fixed') continue;
      out.push(el);
    }
  };
  walk(row);
  return out;
}

const widthOf = (el: HTMLElement): number => el.getBoundingClientRect().width;

export class SdsMenu extends SdsNav {
  static override properties = {
    ...SdsNav.properties,
    label: { type: String },
    for: { type: String, reflect: true },
    open: { type: Boolean, state: true },
    collapsed: { type: Boolean, state: true },
  };

  protected override readonly block = 'sds-menu';
  protected override readonly item = 'sds-pill';

  /** What the toggle is called, for the reader who cannot see it is a menu. */
  declare label: string;
  /** The id of a navigation that lives outside the bar — the page rail. Given
      one, this element is that navigation's toggle and holds no items of its
      own. What differs is only who decides: the sections run out of room in the
      header, which this measures, and the rail runs out of a *column*, which
      `components.css` decides. So a menu with `for` presses, never measures. */
  declare for: string;
  declare open: boolean;
  declare collapsed: boolean;

  private readonly navId = `sds-menu-${++seq}`;
  /** The width the items need in a row. Zero means "not measured yet", which
      renders inline — the one state the row can be measured in. */
  private need = 0;
  private watch?: ResizeObserver;
  /** What is already watched, so re-observing does not call the observer back
      and ask again forever. */
  private readonly watched = new WeakSet<Element>();
  /** The items a server wrote between the tags, moved into the row. A rendered
      site resolves its own navigation before the page is sent, and passing that
      back through `items` would encode and resolve it a second time — so the
      links are kept as written, `target`, `rel` and current mark intact. Either
      way the element does the part a server cannot: measure whether they fit. */
  private taken: Element[] = [];

  constructor() {
    super();
    this.label = 'Menu';
    this.for = '';
    this.open = false;
    this.collapsed = false;
  }

  /** The navigation this opens, where that is not its own items. */
  private get target(): HTMLElement | null {
    return this.for ? document.getElementById(this.for) : null;
  }

  override connectedCallback(): void {
    /* Before Lit renders into this element, because after it the children are
       its own output. Whitespace and comments are dropped: what a row is made
       of is its links. */
    const written = this.lifted().filter((node): node is Element => node.nodeType === 1);
    if (written.length) this.taken = written;
    super.connectedCallback();
    /* The row, not this element: what changes the answer is how much room is
       left beside the menu, and that moves when the header does. Nothing to
       watch where the layout decides — see `for`. */
    if (!this.for) {
      this.watch = new ResizeObserver(() => this.decide());
      if (this.parentElement) this.watch.observe(this.parentElement);
      /* And the row's own contents, which `decide` adds as it finds them: the
         bar does not resize when what is in it does, so asking only the parent
         answers for whichever frame it was asked in. The fonts are the other
         half — items measured in the fallback face come out narrower than they
         will be, so it is asked again once the real one is there. */
      void document.fonts?.ready.then(() => {
        /* Both, and in this order: the items can only be measured in the row,
           so the row is what it is put back into before it is asked again. */
        this.need = 0;
        this.collapsed = false;
        void this.updateComplete.then(() => this.decide());
      });
    }
    /* A press anywhere else closes it, the way every other menu does. */
    document.addEventListener('pointerdown', this.onOutside);
  }

  override disconnectedCallback(): void {
    this.watch?.disconnect();
    document.removeEventListener('pointerdown', this.onOutside);
    this.target?.removeEventListener('click', this.onFollow);
    super.disconnectedCallback();
  }

  private readonly onOutside = (event: Event): void => {
    if (!this.open) return;
    const path = event.composedPath();
    if (path.includes(this)) return;
    /* What it opened counts as inside. A rail folds its groups with
       `<details>`, and a press on one of those is somebody using the panel,
       not leaving it — closing there took the list away mid-search. Following
       a link does close it, which is `onFollow`. */
    const target = this.target;
    if (target && path.includes(target)) return;
    this.open = false;
  };

  /* A navigation the toggle opened has done its job when a page is chosen.
     Only a link: everything else in there — a fold, a heading — is the reader
     still looking. */
  private readonly onFollow = (event: Event): void => {
    if ((event.target as Element | null)?.closest('a')) this.open = false;
  };

  private onKey(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.open) return;
    this.open = false;
    this.querySelector<HTMLButtonElement>('.sds-menu__toggle')?.focus();
  }

  protected override choose(index: number): void {
    super.choose(index);
    /* Choosing is what the panel was opened for. It closes whether or not the
       item moved anything, because a panel left standing over the page after
       a press reads as a press that did nothing. */
    this.open = false;
  }

  /** Collapsed or not, from the room the row has rather than from a width. */
  private decide(): void {
    const row = this.parentElement;
    const nav = this.querySelector<HTMLElement>('.sds-menu__items');
    if (!row || !nav) return;

    if (!this.need) {
      /* Measured from the items themselves, not from the nav box: in the
         panel that box is as wide as the header, and in the row it is only as
         wide as it was allowed to be. The items are their own width in both. */
      const items = boxes(nav);
      if (!items.length) return;
      const gap = parseFloat(getComputedStyle(nav).columnGap) || 0;
      this.need = items.reduce((sum, el) => sum + widthOf(el), 0) + gap * (items.length - 1);
    }

    const style = getComputedStyle(row);
    const gap = parseFloat(style.columnGap) || 0;
    const others = boxes(row).filter((el) => !this.contains(el));
    const used = others.reduce((sum, el) => sum + widthOf(el), 0) + gap * others.length;
    /* Each of them once. They are what the room is left over from, so each is
       worth an answer of its own when it changes width; watching one twice
       would have the observer answer its own callback. */
    for (const el of others) {
      if (this.watched.has(el)) continue;
      this.watched.add(el);
      this.watch?.observe(el);
    }
    const inner = row.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);

    const collapsed = this.need > inner - used;
    if (collapsed === this.collapsed) return;
    this.collapsed = collapsed;
    /* An open panel that becomes a row would leave the toggle pressed with
       nothing to press it for. */
    if (!collapsed) this.open = false;
  }

  /** The button, which is the same button in both cases — and says which of the
      two it is, because on a narrow page both are in the bar at once. Not
      `actions-menu`, which is an app launcher and at 16px reads as a keypad;
      the set has no hamburger and this is not the place to draw one. So each
      says what it opens: a list of pages, or a column folded away. */
  private get glyph(): string {
    if (this.open) return 'actions-close';
    return this.for ? 'actions-menu-sidebar-collapsed' : 'actions-list';
  }

  private toggle_(controls: string): TemplateResult {
    return html`<button
    type="button"
    class="sds-menu__toggle"
    aria-expanded="${this.open ? 'true' : 'false'}"
    aria-controls="${controls}"
    aria-label="${this.label}"
    ?hidden="${!this.for && !this.collapsed}"
    @click="${() => { this.open = !this.open; }}"
  ><sds-icon name="${this.glyph}"></sds-icon></button>`;
  }

  protected override render(): TemplateResult {
    /* Opening something else: the button alone. What it opens is already on
       the page, written where it belongs — a rail is the page's navigation
       whether or not it is currently a column, and rendering a second copy of
       it in here would be two of everything a reader is offered. */
    if (this.for) {
      /* And nothing at all where that something is not on the page: the same
         bar is on every page, so the button answers for its own absence rather
         than each layout remembering to leave it out. Asked only where it can
         be answered — in Node there is no document to look in. */
      if (typeof document !== 'undefined' && !this.target) return html``;
      return html`<div class="sds-menu sds-menu--for" @keydown="${(e: KeyboardEvent) => this.onKey(e)}">
  ${this.toggle_(this.for)}
</div>`;
    }

    /* Empty rather than absent where nothing was lifted, so the fallback is
       the length and not a `??` that a `[]` never reaches — which is how a
       prerendered bar came to hold an empty `<nav>` and a page with no script
       lost its sections. `lifted()` runs in a browser only; in Node the same
       links arrive as `content`. */
    const written = this.taken.length ? this.taken : this.content;
    const shown = !this.collapsed || this.open;
    return html`<div class="sds-menu${this.collapsed ? ' is-collapsed' : ''}" @keydown="${(e: KeyboardEvent) => this.onKey(e)}">
  ${this.toggle_(this.navId)}
  <nav
    id="${this.navId}"
    class="sds-menu__items${this.collapsed ? ' sds-menu__panel' : ''}"
    aria-label="${this.label}"
    ?hidden="${!shown}"
  >
    ${written || lines(this.items_(), 4)}
  </nav>
</div>`;
  }

  protected override willUpdate(changed: PropertyValues<SdsMenu>): void {
    /* A different set of items is a different width, and the panel cannot be
       measured while it is closed. Forgetting the measurement puts the row
       back for one frame, which is the state it can be taken in. */
    if (changed.has('items')) {
      this.need = 0;
      this.collapsed = false;
    }
  }

  protected override updated(): void {
    if (this.for) {
      /* The open state lives on what was opened. It is a class rather than
         `hidden`, because above the fold width that element is a column in
         view and nothing here may take it away. */
      const target = this.target;
      if (!target) return;
      /* Said on the element rather than assumed by the stylesheet: the layout
         hides what a toggle can open, and until this element exists there is
         no toggle — a rail hidden with no button to bring it back is the one
         failure worth ruling out in markup that renders before any script. */
      target.classList.add('is-collapsible');
      target.classList.toggle('is-open', this.open);
      target.removeEventListener('click', this.onFollow);
      target.addEventListener('click', this.onFollow);
      return;
    }
    this.decide();
  }
}

define('sds-menu', SdsMenu);
