/* sds-menu — the navigation in a header, and what it does as the header runs out.

   Pills in a row while there is room for them; a toggle and a panel below the
   bar when there is not. Same items, same element, one decision in between —
   and the decision is measured rather than declared.

   A breakpoint would be a guess about content. The bar holds a mark whose
   product name is as long as the product is called, a version badge, a search
   field and a mode switch, so the width at which four words stop fitting is
   different on every surface that uses it — and a number picked for one of
   them drops the navigation early on the others or overflows late on this
   one. That is what a fixed 1140px did here: it took the whole navigation off
   a landing page that had 400px to spare.

   So the element asks. It measures the width its items need, and the room the
   row has left once everything else in it is accounted for, and collapses
   when the first exceeds the second. The room is computed with this element
   left out of the sum, which is what makes the answer the same in both
   states: nothing about the measurement depends on which one it is in, so
   there is no width where the two disagree and it oscillates.

   Collapsed, the panel is the same `<nav>` moved below the bar rather than a
   second copy of the links — a duplicate list is two of everything a screen
   reader announces, and two places for the current item to be marked.

   The panel is positioned against the nearest positioned ancestor, which
   `.sds-bar` is for exactly this. */

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
  /** The id of a navigation that lives outside the bar — the page rail.

      Given one, this element is that navigation's toggle and holds no items of
      its own. It is the same button opening the same panel; what differs is
      only which of the two runs out of room first, and therefore who decides.
      The sections run out of room in the header, which this element measures.
      The rail runs out of a *column*, which is the page layout's decision and
      is made in `components.css` at the width where the rail stops being one.
      So a menu with `for` does not measure anything: it presses. */
  declare for: string;
  declare open: boolean;
  declare collapsed: boolean;

  private readonly navId = `sds-menu-${++seq}`;
  /** The width the items need in a row. Zero means "not measured yet", which
      renders inline — the one state the row can be measured in. */
  private need = 0;
  private watch?: ResizeObserver;

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
    super.connectedCallback();
    /* The row, not this element: what changes the answer is how much room is
       left beside the menu, and that moves when the header does. Nothing to
       watch where the layout decides — see `for`. */
    if (!this.for) {
      this.watch = new ResizeObserver(() => this.decide());
      if (this.parentElement) this.watch.observe(this.parentElement);
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
    const inner = row.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);

    const collapsed = this.need > inner - used;
    if (collapsed === this.collapsed) return;
    this.collapsed = collapsed;
    /* An open panel that becomes a row would leave the toggle pressed with
       nothing to press it for. */
    if (!collapsed) this.open = false;
  }

  /** The button, which is the same button in both cases. */
  private toggle_(controls: string): TemplateResult {
    return html`<button
    type="button"
    class="sds-menu__toggle"
    aria-expanded="${this.open ? 'true' : 'false'}"
    aria-controls="${controls}"
    aria-label="${this.label}"
    ?hidden="${!this.for && !this.collapsed}"
    @click="${() => { this.open = !this.open; }}"
  ><sds-icon name="${this.open ? 'actions-close' : 'actions-menu'}"></sds-icon></button>`;
  }

  protected override render(): TemplateResult {
    /* Opening something else: the button alone. What it opens is already on
       the page, written where it belongs — a rail is the page's navigation
       whether or not it is currently a column, and rendering a second copy of
       it in here would be two of everything a reader is offered. */
    if (this.for) {
      return html`<div class="sds-menu sds-menu--for" @keydown="${(e: KeyboardEvent) => this.onKey(e)}">
  ${this.toggle_(this.for)}
</div>`;
    }

    const shown = !this.collapsed || this.open;
    return html`<div class="sds-menu${this.collapsed ? ' is-collapsed' : ''}" @keydown="${(e: KeyboardEvent) => this.onKey(e)}">
  ${this.toggle_(this.navId)}
  <nav
    id="${this.navId}"
    class="sds-menu__items${this.collapsed ? ' sds-menu__panel' : ''}"
    aria-label="${this.label}"
    ?hidden="${!shown}"
  >
    ${lines(this.items_(), 4)}
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
