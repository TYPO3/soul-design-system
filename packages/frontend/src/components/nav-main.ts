/* sds-nav-main — the bar at the top of a page, and what it does as it runs out.

   It is handed the site's whole menu, finished: every entry with its label,
   its target, what is under it and what is true of it on this page. The bar
   then draws as much of that as it can — the front doors in the row, the pages
   of one of them in a panel under it, and the whole tree in a drawer once the
   row has nothing left to give. One list, read three ways.

   Measured, never declared: a bar holds a product name for as long as the
   product is called, so a breakpoint written here is wrong on the next site. */

import { html, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { lines } from '../lib/template.ts';
import { lockup } from '../lib/lockup.ts';
import { define } from '../lib/element.ts';
import { SdsNav, type MenuEntry } from './nav-base.ts';
import './icon.ts';
import './overlay.ts';
import './search.ts';
import './theme.ts';

/** Where a section's pages stop being a drop under it and become a wall across
    the bar. Eight is what a reader takes in without scanning; more than that in
    one column is a list they read rather than a set they pick from. */
const WALL = 8;

/** How long a panel stays open after the pointer has left the section. The way
    to a panel crosses the row it hangs from, so a menu that closes the moment
    the pointer is off the pill is one that cannot be reached with a mouse at
    all. Long enough to cross a gap, short enough not to hang over the page. */
const GRACE = 200;

/** Distinct ids per instance: the toggle names the drawer it opens, and two
    bars on one page must not both call it `sds-bar-drawer`. */
let seq = 0;

/** Every box actually laid out in `row`. A child is not necessarily a box: the
    drawer is out of flow, and what draws nothing where it stands has none. */
function boxes(row: Element): HTMLElement[] {
  const out: HTMLElement[] = [];
  const walk = (parent: Element): void => {
    for (const child of parent.children) {
      const el = child as HTMLElement;
      const style = getComputedStyle(el);
      if (style.display === 'none') continue;
      if (style.display === 'contents') { walk(el); continue; }
      /* Out of flow takes no width from the row — the drawer itself is one. */
      if (style.position === 'absolute' || style.position === 'fixed') continue;
      out.push(el);
    }
  };
  walk(row);
  return out;
}

const widthOf = (el: HTMLElement): number => el.getBoundingClientRect().width;

export class SdsNavMain extends SdsNav {
  static override properties = {
    ...SdsNav.properties,
    home: { type: String },
    signet: { type: String },
    brand: { type: String },
    product: { type: String },
    search: { type: Boolean },
    index: { type: String },
    menu: { type: Object },
    label: { type: String },
    themeKey: { type: String, attribute: 'theme-key' },
    open: { type: Boolean, state: true },
    opened: { type: Number, state: true },
    stack: { type: Array, state: true },
    compactTheme: { type: Boolean, state: true },
    foldNav: { type: Boolean, state: true },
    foldSearch: { type: Boolean, state: true },
  };

  protected override readonly block = 'sds-bar';
  protected override readonly item = 'sds-pill';

  /** Where the mark goes: the way home, from anywhere on the site. */
  declare home: string;
  /** The mark, as a file to link. The 20–31px drawing, since that is the size
      a bar gives it — a mark picked for another box is redrawn, never scaled. */
  declare signet: string;
  /** Who publishes this, which is the word that stays across every site. */
  declare brand: string;
  /** What this one is called, set beside the brand. A site with only a brand
      leaves it off rather than repeating the brand in a lighter weight. */
  declare product: string;
  /** Whether the bar carries a search field. A field with no `index` searches
      nothing, which is a specimen rather than a site. */
  declare search: boolean;
  /** Where the index is, relative to the page. Setting it is asking for the
      field as well — a site that has an index has a search. */
  declare index: string;
  /** The site, as one entry with everything under it: the front doors in the
      row, the pages of one of them in the panel below it, and the whole of it
      in the drawer. The same entry a rail is given, one level up — a section
      holds pages, and the site holds sections. */
  declare menu: MenuEntry;
  /** What the toggle is called, for a reader who cannot see it is a menu. */
  declare label: string;
  /** Where `sds-theme` keeps the reader's choice, where it keeps one. Written
      onto it only when a bar names one: an empty attribute is a name too, and
      it is not the one the pre-paint script reads. */
  declare themeKey: string;
  declare open: boolean;
  /** Which section has its panel open, or -1. One at a time: two panels over
      one page is a reader working out which of them the bar is answering. */
  declare opened: number;
  /** How far into the menu the drawer has been stepped: the entries walked
      through, the last of them being the level on screen. */
  declare stack: MenuEntry[];
  declare compactTheme: boolean;
  declare foldNav: boolean;
  declare foldSearch: boolean;

  private readonly drawerId = `sds-bar-drawer-${++seq}`;

  /** What the sections, the field and the mode pair's two words need in the
      row. Zero means "not measured yet", and each can only be measured where
      it is — standing in the row. */
  private needNav = 0;
  private needSearch = 0;
  private needWords = 0;
  private watch?: ResizeObserver;
  private watched = false;
  /** The close a pointer asked for, still waiting out its grace. */
  private leaving?: ReturnType<typeof setTimeout>;
  /** Which way the drawer has just stepped, and how tall it was before it did.
      Both are read once, by the render that has to show the step. */
  private stepped: 'in' | 'out' | null = null;
  private stood = 0;
  /** The links a server wrote between the tags, moved into the row. A rendered
      site resolves its own navigation before the page is sent, and passing that
      back through `items` would encode and resolve it a second time — so they
      are kept as written, `target`, `rel` and current mark intact. */
  private taken: Element[] = [];

  constructor() {
    super();
    this.home = '';
    this.signet = '';
    this.brand = '';
    this.product = '';
    this.search = false;
    this.index = '';
    this.menu = { label: '' };
    this.label = 'Menu';
    this.themeKey = '';
    this.open = false;
    this.opened = -1;
    this.stack = [];
    this.compactTheme = false;
    this.foldNav = false;
    this.foldSearch = false;
  }

  override connectedCallback(): void {
    /* Before Lit renders into this element, because after it the children are
       its own output. Whitespace and comments are dropped: what a row is made
       of is its links. */
    const written = this.lifted().filter((node): node is Element => node.nodeType === 1);
    if (written.length) this.taken = written;
    super.connectedCallback();
    this.watch = new ResizeObserver(() => this.decide());
    /* Measured in the fallback face, the sections come out narrower than they
       will be — so the answer is asked for again once the real one is there,
       from the one state they can be measured in. */
    void document.fonts?.ready.then(() => {
      this.needNav = 0;
      this.needSearch = 0;
      this.needWords = 0;
      this.compactTheme = false;
      this.foldNav = false;
      this.foldSearch = false;
      void this.updateComplete.then(() => this.decide());
    });
    document.addEventListener('pointerdown', this.onOutside);
  }

  override disconnectedCallback(): void {
    clearTimeout(this.leaving);
    this.watch?.disconnect();
    document.removeEventListener('pointerdown', this.onOutside);
    super.disconnectedCallback();
  }

  private readonly onOutside = (event: Event): void => {
    if (!this.open && this.opened < 0) return;
    if (event.composedPath().includes(this)) return;
    this.open = false;
    this.opened = -1;
    this.reset();
  };

  /* A drawer opened to get somewhere has done its job when a page is chosen.
     Only a link: everything else in there — a fold, a heading, the field — is
     the reader still looking. */
  private readonly onFollow = (event: Event): void => {
    if ((event.target as Element | null)?.closest('a')) this.open = false;
  };

  /** Where the drawer opens: on the level the reader is standing on, which is
      the entry holding the page they are reading. A menu that always opened at
      the top would ask somebody three sections deep to walk back down to where
      they already were — and the way up is one press, which the way down is
      not. */
  private path(): MenuEntry[] {
    const walk = (entry: MenuEntry, trail: MenuEntry[]): MenuEntry[] | null => {
      for (const child of entry.items ?? []) {
        if (child.current) return trail;
        const under = walk(child, [...trail, child]);
        if (under) return under;
      }
      return null;
    };
    return walk(this.menu, []) ?? [];
  }

  /** Back to that level. A reader who stepped somewhere and closed the drawer
      is not still asking about it the next time they open one. */
  private reset(): void {
    const at = this.path();
    if (at.length !== this.stack.length || at.some((entry, i) => entry !== this.stack[i])) {
      this.stack = at;
    }
  }

  private onKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.opened >= 0) {
        /* The panel first, and the focus to the fold that opened it: escape
           puts a reader back where they pressed, not at the top of the bar. */
        const at = this.opened;
        this.opened = -1;
        void this.updateComplete.then(() =>
          this.querySelectorAll<HTMLElement>('.sds-bar__fold > summary')[at]?.focus(),
        );
        return;
      }
      if (!this.open) return;
      this.open = false;
      this.reset();
      this.querySelector<HTMLButtonElement>('.sds-bar__toggle')?.focus();
      return;
    }
    this.walk(event);
  }

  /** The rows of whichever list the key was pressed in: a panel under one
      section, or the drawer holding the whole menu. */
  private list(from: Element): HTMLElement[] {
    const drawer = from.closest('.sds-bar__drawer');
    const scope = drawer ?? from.closest('.sds-bar__section');
    if (!scope) return [];
    /* In a section it is the panel's pages and not the section's own link: the
       pill is in the row a reader tabs along, and stepping down into a list
       that begins with the thing above it is a step that goes nowhere. */
    const rows = drawer
      ? /* The folds count as rows: a tree read with the arrows is read as it
           stands, and a closed section is one line until it is opened. */
        scope.querySelectorAll<HTMLElement>('.sds-rail__group > summary, .sds-rail__item, .sds-pill, .sds-bar__link')
      : scope.querySelectorAll<HTMLElement>('.sds-bar__panel .sds-bar__link');
    /* A row inside a closed fold is not a row: the browser will not focus it,
       and a list that counts it steps onto nothing. Skipped contents keep
       their boxes, so the fold has to be asked rather than the geometry — and
       the fold's own summary is the row that stands for it. */
    return [...rows].filter((row) => {
      if (!row.getClientRects().length) return false;
      const shut = row.closest('details:not([open])');
      return !shut || row.matches('summary');
    });
  }

  /** Down a list of pages and back up it. The arrow that opens a panel steps
      into it in the same breath, and Tab is left alone: it is how a reader
      leaves. */
  private walk(event: KeyboardEvent): void {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    const from = event.target as HTMLElement | null;
    if (!from || !this.contains(from)) return;

    /* The bar's own marker, not any summary: a fold inside the drawer's menu
       is a row like the rest and the arrows walk past it. */
    const markers = [...this.querySelectorAll('.sds-bar__fold > summary')];
    const marker = from.closest('summary');
    if (marker && markers.includes(marker) && event.key === 'ArrowDown') {
      const at = markers.indexOf(marker);
      event.preventDefault();
      this.opened = at;
      void this.updateComplete.then(() => this.list(marker)[0]?.focus());
      return;
    }

    const rows = this.list(from);
    if (rows.length < 2) return;
    const at = rows.indexOf(from);
    if (at < 0) return;
    event.preventDefault();
    const to =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? rows.length - 1
          : /* Stops at the ends rather than wrapping: a list that starts over
               at the bottom hides how long it was from whoever cannot see it. */
            Math.min(rows.length - 1, Math.max(0, at + (event.key === 'ArrowDown' ? 1 : -1)));
    rows[to]?.focus();
  }

  protected override choose(index: number): void {
    super.choose(index);
    /* Choosing is what the drawer was opened for. It closes whether or not the
       item moved anything, because a panel left standing over the page after a
       press reads as a press that did nothing. */
    this.open = false;
  }

  /** What is in the row and what is in the drawer, from the room the row has
      rather than from a width. The order is what the bar can best do without:
      the field first, the sections last. */
  private decide(): void {
    const row = this.querySelector<HTMLElement>('.sds-bar');
    if (!row) return;

    const style = getComputedStyle(row);
    const gap = parseFloat(style.columnGap) || 0;
    const end = this.querySelector<HTMLElement>('.sds-bar__end');
    const endGap = end ? parseFloat(getComputedStyle(end).columnGap) || 0 : 0;

    const nav = this.querySelector<HTMLElement>('.sds-bar__nav');
    if (nav && !this.foldNav && !this.needNav) {
      /* From the items, not from the box around them: in the drawer that box
         is as wide as the bar, and in the row only as wide as it was allowed
         to be. The items are their own width in both. */
      const items = boxes(nav);
      if (!items.length) return;
      const itemGap = parseFloat(getComputedStyle(nav).columnGap) || 0;
      this.needNav = items.reduce((sum, el) => sum + widthOf(el), 0) + itemGap * (items.length - 1);
    }
    const field = this.querySelector<HTMLElement>('.sds-search');
    if (field && !this.foldSearch && !this.needSearch) this.needSearch = widthOf(field);
    /* Two words, and what they cost is the words plus the air between each and
       its own mark: dropping a label takes the gap beside it with it. */
    if (!this.compactTheme && !this.needWords) {
      const words = [...this.querySelectorAll<HTMLElement>('.sds-mode__label')];
      this.needWords = words.reduce((sum, el) => {
        const air = el.parentElement ? parseFloat(getComputedStyle(el.parentElement).columnGap) || 0 : 0;
        return sum + widthOf(el) + air;
      }, 0);
    }

    /* Everything in the row that never folds. The two that do and the button
       that stands there once they have are taken back out, so the floor is the
       same number in every state and there is no width where two of them
       disagree and it oscillates. */
    const standing = boxes(row);
    let used = standing.reduce((sum, el) => sum + widthOf(el), 0) + gap * (standing.length - 1);
    if (nav && !this.foldNav) used -= widthOf(nav) + gap;
    if (field && !this.foldSearch) used -= widthOf(field) + endGap;
    if (!this.compactTheme) used -= this.needWords;
    const toggle = this.querySelector<HTMLElement>('.sds-bar__toggle');
    if (toggle) used -= widthOf(toggle) + endGap;

    const room = row.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - used;
    /* A square of the control height, said by the stylesheet — asked of the
       token rather than of the button, which is not there to be measured in
       the state that is deciding whether to draw it. */
    const button = parseFloat(getComputedStyle(this).getPropertyValue('--control-height')) || 0;
    const wantsSearch = this.search || Boolean(this.index);
    const forNav = this.needNav ? this.needNav + gap : 0;
    const forSearch = wantsSearch ? this.needSearch + endGap : 0;
    const forButton = button + endGap;

    /* The states, widest first, and the first that fits is the one. Ordered by
       what the bar can best do without, and read in order so that it is
       monotonic: something put away stays away as the window narrows. Let the
       words come back once the field has gone and they would appear at a width
       narrower than the one that took them. */
    const fits = (need: number): boolean => need <= room;
    let compactTheme = false;
    let foldSearch = false;
    let foldNav = false;
    if (!fits(this.needWords + forSearch + forNav)) {
      compactTheme = true;
      if (!fits(forSearch + forNav)) {
        foldSearch = wantsSearch;
        if (!fits(forNav + forButton)) foldNav = Boolean(this.needNav);
      }
    }
    if (compactTheme === this.compactTheme && foldSearch === this.foldSearch && foldNav === this.foldNav) return;
    this.compactTheme = compactTheme;
    this.foldSearch = foldSearch;
    this.foldNav = foldNav;
    /* A drawer that has just given everything back would leave the toggle
       pressed with nothing to press it for. */
    if (!foldNav && !foldSearch) this.open = false;
  }

  private field(): TemplateResult {
    return html`<sds-search index="${this.index}"></sds-search>`;
  }

  /** The sections of the menu that stand in the row. Which of a site's
      sections are its front doors is the one thing its tree cannot say, so the
      menu says it; with none named, every section is one. */
  private doors(): MenuEntry[] {
    const sections = [...(this.menu.items ?? [])];
    const named = sections.filter((entry) => entry.front);
    return named.length ? named : sections;
  }

  /** One front door: the link, and the fold that opens its pages under the row.
      The link stays a link — pressing a section's name goes to that section,
      and what opens the panel is the marker beside it. A `<details>`, so the
      panel works before any script and the bar only has to say which one is
      open.

      A pointer opens it too, and on the whole section rather than the marker
      alone: a menu that only answers a press asks a reader who is already
      moving to stop and aim. Nothing is lost without it — the marker is the
      control, and the pointer is a shortcut to the same state. */
  private door(entry: MenuEntry, at: number): TemplateResult {
    const here = Boolean(entry.current || entry.here);
    const pill = html`<a
      class="${here ? 'sds-pill is-active' : 'sds-pill'}"
      href="${entry.href ?? '#'}"
      target="${entry.external ? '_blank' : nothing}"
      rel="${entry.external ? 'noreferrer' : nothing}"
      aria-current="${entry.current ? 'page' : here ? 'true' : nothing}"
    >${entry.label}</a>`;
    const under = entry.items ?? [];
    /* Wrapped whether or not it holds anything: the section is the shape the
       row draws, and one shape marks the current one. */
    if (!under.length) return html`<div class="sds-bar__section">${pill}</div>`;
    /* A drop where the section is a handful of pages, a wall where it is more
       than a reader takes in at a glance: the same panel, laid out by what is
       in it. */
    const wall = under.length > WALL;
    return html`<div
      class="${wall ? 'sds-bar__section' : 'sds-bar__section sds-bar__section--drop'}"
      @pointerenter="${(event: PointerEvent) => this.hover(at, event)}"
      @pointerleave="${(event: PointerEvent) => this.hover(-1, event)}"
    >
      ${pill}
      <details
        class="sds-bar__fold"
        ?open="${this.opened === at}"
        @toggle="${(event: Event) => this.fold(event, at)}"
      >
        <summary aria-label="Pages in ${entry.label}"><sds-icon name="actions-chevron-down"></sds-icon></summary>
        <div class="sds-bar__panel">
          ${lines(under.map((page) => this.page(page)), 10)}
        </div>
      </details>
    </div>`;
  }

  /** A page in a panel. Two levels and no more: the row is the site's own, the
      panel is one section's pages, and a third level under a bar is a sitemap
      hanging off a menu — what the drawer opens is where a whole tree is read.
      Where the rows break into columns is the stylesheet's: a wall is one list,
      and how many columns it takes is a question about the room. */
  private page(entry: MenuEntry): TemplateResult {
    return html`<a
      class="${entry.current ? 'sds-bar__link is-active' : 'sds-bar__link'}"
      href="${entry.href ?? '#'}"
      aria-current="${entry.current ? 'page' : nothing}"
    >${entry.label}</a>`;
  }

  /** A pointer over a section opens it, and leaving closes it — but only while
      the sections are standing in the row. In the drawer they are a list being
      scrolled past, and a panel that opens under a finger on its way somewhere
      is a menu answering a movement nobody made. A mouse only, for the same
      reason: a tap is a press, and the marker beside the link is what a press
      is for. */
  private hover(at: number, event: PointerEvent): void {
    if (this.foldNav || event.pointerType !== 'mouse') return;
    clearTimeout(this.leaving);
    if (at >= 0) {
      this.opened = at;
      return;
    }
    this.leaving = setTimeout(() => { this.opened = -1; }, GRACE);
  }

  /** Which panel a press left open. The event fires for the bar's own render
      as well as for a reader's press, and saying the same thing twice is what
      keeps the two from arguing. */
  private fold(event: Event, at: number): void {
    const open = (event.target as HTMLDetailsElement).open;
    if (open) this.opened = at;
    else if (this.opened === at) this.opened = -1;
  }

  /** One level of the menu: what the drawer shows once the row has given the
      sections up.

      A level and not the tree. A phone is a window onto a long list, and the
      whole site unfolded into one column is forty rows a reader scrolls past
      to reach the four that are the site. So the drawer starts at the top
      level and steps *into* a section — the way in is a control of its own,
      beside the link, because a section is both a page to read and a place to
      go through. The way back is the row above the list, naming what it
      returns to rather than saying "back" to a reader who has forgotten. */
  private level(): TemplateResult {
    const inside = this.stack[this.stack.length - 1];
    const entry = inside ?? this.menu;
    const above = this.stack.length > 1 ? this.stack[this.stack.length - 2] : undefined;
    const rows = entry.items ?? [];
    return html`<nav class="sds-bar__level" aria-label="${entry.label || 'Pages'}">
    ${inside
      ? html`<button
      type="button"
      class="sds-bar__back"
      @click="${() => { this.stack = this.stack.slice(0, -1); }}"
    ><sds-icon name="actions-chevron-start"></sds-icon>${above?.label ?? this.menu.label ?? 'Menu'}</button>
    ${/* The section's own page, first and unfolded. */ ''}
    ${inside.href ? this.step(inside, true) : ''}` : ''}
    ${lines(rows.map((row) => this.step(row)), 4)}
  </nav>`;
  }

  /** One row of a level: where it goes, and — where it holds pages — the way
      into them. Two controls rather than one, for the reason the row above the
      page has two: the label is the page, and the marker is what is under it. */
  private step(entry: MenuEntry, own = false): TemplateResult {
    const link = html`<a
      class="${entry.current ? 'sds-bar__link is-active' : 'sds-bar__link'}"
      href="${entry.href ?? '#'}"
      target="${entry.external ? '_blank' : nothing}"
      rel="${entry.external ? 'noreferrer' : nothing}"
      aria-current="${entry.current ? 'page' : nothing}"
    >${entry.label}</a>`;
    if (own || !entry.items?.length) return link;
    return html`<div class="sds-bar__row">
      ${link}
      <button
        type="button"
        class="sds-bar__into"
        aria-label="Pages in ${entry.label}"
        @click="${() => { this.stack = [...this.stack, entry]; }}"
      ><sds-icon name="actions-chevron-end"></sds-icon></button>
    </div>`;
  }

  /** The sections as parts, and which of them the reader is in. Four shapes
      arrive here: as the menu, lifted from the page, handed over as markup, or
      as data. Empty rather than absent where nothing was lifted, so the
      fallback is the length and not a `??` that a `[]` never reaches.
      `lifted()` runs in a browser only. */
  private sections(): { parts: unknown[]; at: number } {
    if (this.menu.items?.length) {
      const doors = this.doors();
      return {
        parts: doors.map((entry, at) => this.door(entry, at)),
        at: doors.findIndex((entry) => entry.current || entry.here),
      };
    }
    if (this.taken.length) {
      return {
        parts: [...this.taken],
        at: this.taken.findIndex((el) => el.matches('.is-active, [aria-current]')),
      };
    }
    /* Markup handed over whole is one part, and nothing in here can say which
       section is inside it — the renderer that wrote it marked its own. */
    if (this.content) return { parts: [this.content], at: -1 };
    return { parts: this.items_(), at: this.active < this.items.length ? this.active : -1 };
  }

  /** The sections: a row in the bar, a column in the drawer. */
  private nav_(): TemplateResult {
    const { parts } = this.sections();
    return html`<nav class="sds-bar__nav" aria-label="Sections">
    ${lines(parts as TemplateResult[], 4)}
  </nav>`;
  }

  private toggle_(): TemplateResult {
    /* Not `actions-menu`, which is an app launcher and at 16px reads as a
       keypad; the set has no hamburger and this is not the place to draw one.
       So it says what it opens: the pages of this site, listed. */
    return html`<button
      type="button"
      class="sds-bar__toggle"
      aria-expanded="${this.open ? 'true' : 'false'}"
      aria-controls="${this.drawerId}"
      aria-label="${this.label}"
      @click="${() => { this.open = !this.open; this.reset(); }}"
    ><sds-icon name="${this.open ? 'actions-close' : 'actions-list'}"></sds-icon></button>`;
  }

  protected override render(): TemplateResult {
    const hasNav = Boolean(this.menu.items?.length || this.taken.length || this.content || this.items.length);
    const wantsSearch = this.search || Boolean(this.index);
    const drawer = this.foldNav || this.foldSearch;

    return html`<header class="sds-bar" @keydown="${(e: KeyboardEvent) => this.onKey(e)}">
  ${lockup({ signet: this.signet, brand: this.brand, product: this.product, href: this.home || '#' })}
  ${hasNav && !this.foldNav ? this.nav_() : ''}
  <div class="sds-bar__end">
    ${wantsSearch && !this.foldSearch ? this.field() : ''}
    ${this.themeKey
      ? html`<sds-theme key="${this.themeKey}" ?compact="${this.compactTheme}"></sds-theme>`
      : html`<sds-theme ?compact="${this.compactTheme}"></sds-theme>`}
    ${drawer ? this.toggle_() : ''}
  </div>
  ${drawer
    ? html`${this.open ? html`<sds-overlay @click="${() => { this.open = false; }}"></sds-overlay>
  ` : ''}<div class="sds-bar__drawer" id="${this.drawerId}" ?hidden="${!this.open}" @click="${this.onFollow}">
    ${wantsSearch && this.foldSearch ? this.field() : ''}
    ${/* The menu where there is one, and the front doors alone where the bar
          was given nothing but them: the drawer holds every entry of the menu,
          and the row above it none. */ ''}
    ${hasNav && this.foldNav ? (this.menu.items?.length ? this.level() : this.nav_()) : ''}
  </div>`
    : ''}
</header>`;
  }

  protected override willUpdate(changed: PropertyValues<SdsNavMain>): void {
    /* A different set of sections is a different width, and neither can be
       measured while it is in the drawer. Forgetting the measurement puts them
       back in the row for one frame, which is the state they can be taken in. */
    if (changed.has('items') || changed.has('menu')) {
      this.needNav = 0;
      this.foldNav = false;
    }
    /* A different site is a different level to open on, and the first menu a
       bar is given is the one that decides where its drawer starts. */
    if (changed.has('menu')) this.stack = this.path();
    /* A panel is opened over a row that is standing there. Once the sections
       are in the drawer instead, there is no fold on the page to be open. */
    if (changed.has('foldNav') && this.foldNav) this.opened = -1;
    /* Which way the step went, measured before the level is replaced: a level
       that simply appears is a list that changed while the reader was looking
       at it, and nothing says whether they went in or came back. */
    /* Asked only where it can be answered: in Node there is nothing to
       measure and nothing that moves. */
    if (changed.has('stack') && typeof document !== 'undefined') {
      const before = changed.get('stack');
      this.stepped = before && before.length > this.stack.length ? 'out' : 'in';
      this.stood = this.querySelector<HTMLElement>('.sds-bar__drawer')?.getBoundingClientRect().height ?? 0;
    }
  }

  protected override updated(): void {
    /* The row rather than this element: what is measured is what lays the
       items out. Once, or every render hands the observer a target it is
       already watching and it answers its own callback. */
    if (!this.watched) {
      const row = this.querySelector<HTMLElement>('.sds-bar');
      if (row && this.watch) {
        this.watched = true;
        this.watch.observe(row);
      }
    }
    this.travel();
    this.decide();
  }

  /** The step, shown as one. The level arrives from the side it was reached
      from and the drawer grows into its new height rather than jumping to it,
      both in the one duration and curve the system moves anything in — read
      from the tokens, so a change there reaches this too.

      Held still for a reader who asked for that: what goes is the travel, not
      the answer. */
  private travel(): void {
    const how = this.stepped;
    this.stepped = null;
    if (!how || typeof matchMedia === 'undefined') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const level = this.querySelector<HTMLElement>('.sds-bar__level');
    const drawer = this.querySelector<HTMLElement>('.sds-bar__drawer');
    if (!level || !drawer) return;

    const style = getComputedStyle(level);
    const duration = parseFloat(style.getPropertyValue('--duration-fast'));
    const easing = style.getPropertyValue('--ease-out').trim();
    if (!duration || !easing) return;

    /* The way in is forwards, which is the end of the line the page reads
       towards — so the level comes from there and the way back from the
       start. */
    const away = parseFloat(style.getPropertyValue('--space-6')) || 24;
    const forwards = style.direction === 'rtl' ? -away : away;
    const from = how === 'in' ? forwards : -forwards;
    level.animate(
      [{ opacity: 0, transform: `translateX(${from}px)` }, { opacity: 1, transform: 'none' }],
      { duration, easing },
    );

    const now = drawer.getBoundingClientRect().height;
    if (this.stood && Math.abs(now - this.stood) > 1) {
      drawer.animate([{ height: `${this.stood}px` }, { height: `${now}px` }], { duration, easing });
    }
    this.stood = 0;
  }
}

define('sds-nav-main', SdsNavMain);
