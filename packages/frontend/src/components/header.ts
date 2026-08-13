/* sds-header — the bar at the top of a page, and what it does as it runs out.

   Mark, sections and controls in a row while there is room. What no longer
   fits is not dropped: it waits in one drawer under one button — the search,
   the sections, and the page's rail hanging under the section it is the pages
   of — because a reader looking for the way somewhere has one place to press
   and one tree to read.

   Measured, never declared: a bar holds a product name for as long as the
   product is called, so a breakpoint written here is wrong on the next site. */

import { html, type TemplateResult, type PropertyValues } from 'lit';
import { lines } from '../lib/template.ts';
import { lockup } from '../lib/lockup.ts';
import { define } from '../lib/element.ts';
import { SdsNav } from './nav-base.ts';
import './icon.ts';
import './badge.ts';
import './overlay.ts';
import { type BadgeTone } from './badge.ts';
import './search.ts';
import './theme.ts';

/** Distinct ids per instance: the toggle names the drawer it opens, and two
    bars on one page must not both call it `sds-bar-drawer`. */
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
      /* Out of flow takes no width from the row — the drawer itself is one. */
      if (style.position === 'absolute' || style.position === 'fixed') continue;
      out.push(el);
    }
  };
  walk(row);
  return out;
}

const widthOf = (el: HTMLElement): number => el.getBoundingClientRect().width;

export class SdsHeader extends SdsNav {
  static override properties = {
    ...SdsNav.properties,
    home: { type: String },
    signet: { type: String },
    brand: { type: String },
    product: { type: String },
    version: { type: String },
    tone: { type: String },
    search: { type: Boolean },
    index: { type: String },
    rail: { type: String },
    label: { type: String },
    themeKey: { type: String, attribute: 'theme-key' },
    open: { type: Boolean, state: true },
    compactTheme: { type: Boolean, state: true },
    foldNav: { type: Boolean, state: true },
    foldSearch: { type: Boolean, state: true },
    foldRail: { type: Boolean, state: true },
  };

  protected override readonly block = 'sds-bar';
  protected override readonly item = 'sds-pill';

  /** Where the mark goes: the way home, from anywhere on the site. */
  declare home: string;
  declare signet: string;
  declare brand: string;
  declare product: string;
  /** What is true of the page the reader is on, as the badge beside the
      controls — a fact about this documentation rather than part of its name,
      which is why it is here and not in the lockup. */
  declare version: string;
  /** The badge's tone. Accent, that fact being a version nine times in ten;
      a screen whose bar names something else says so, because the accent is
      how a reader is told which version they are reading. */
  declare tone: BadgeTone;
  /** Whether the bar carries a search field. A field with no `index` searches
      nothing, which is a specimen rather than a site. */
  declare search: boolean;
  /** Where the index is, relative to the page. Setting it is asking for the
      field as well — a site that has an index has a search. */
  declare index: string;
  /** The id of the page rail. The bar does not own it: a rail is the page's
      navigation and stands where the page put it, until the layout takes its
      column away and it has nowhere to be but in here. */
  declare rail: string;
  /** What the toggle is called, for a reader who cannot see it is a menu. */
  declare label: string;
  /** Where `sds-theme` keeps the reader's choice, where it keeps one. */
  declare themeKey: string;
  declare open: boolean;
  declare compactTheme: boolean;
  declare foldNav: boolean;
  declare foldSearch: boolean;
  declare foldRail: boolean;

  private readonly drawerId = `sds-bar-drawer-${++seq}`;

  /** What the sections, the field and the mode pair's two words need in the
      row. Zero means "not measured yet", and each can only be measured where
      it is — standing in the row. */
  private needNav = 0;
  private needSearch = 0;
  private needWords = 0;
  private watch?: ResizeObserver;
  private watched = false;
  /** Where the rail stood, so it can be put back exactly there. A remembered
      parent is not enough: a body holds other things, and a rail appended back
      to the end of one is a column in the wrong order. */
  private anchor?: Comment;
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
    this.version = '';
    this.tone = 'accent';
    this.search = false;
    this.index = '';
    this.rail = '';
    this.label = 'Menu';
    this.themeKey = '';
    this.open = false;
    this.compactTheme = false;
    this.foldNav = false;
    this.foldSearch = false;
    this.foldRail = false;
  }

  override connectedCallback(): void {
    /* Before Lit renders into this element, because after it the children are
       its own output. Whitespace and comments are dropped: what a row is made
       of is its links. */
    const written = this.lifted().filter((node): node is Element => node.nodeType === 1);
    if (written.length) this.taken = written;
    super.connectedCallback();
    /* Both questions, because a window that moved answers both: how much room
       the row has left, and whether the layout still lays the rail beside the
       text. Asking only the first left the rail standing on a stacked page —
       nothing in the row had changed at that width, so nothing re-rendered,
       and the one place that looked was never reached. */
    this.watch = new ResizeObserver(() => {
      this.place();
      this.decide();
    });
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
    this.watch?.disconnect();
    document.removeEventListener('pointerdown', this.onOutside);
    /* The rail is somebody else's node. A bar taken off the page with the rail
       still in its drawer takes the page's navigation with it. */
    this.release();
    super.disconnectedCallback();
  }

  private readonly onOutside = (event: Event): void => {
    if (!this.open) return;
    if (event.composedPath().includes(this)) return;
    this.open = false;
  };

  /* A drawer opened to get somewhere has done its job when a page is chosen.
     Only a link: everything else in there — a fold, a heading, the field — is
     the reader still looking. */
  private readonly onFollow = (event: Event): void => {
    if ((event.target as Element | null)?.closest('a')) this.open = false;
  };

  private onKey(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.open) return;
    this.open = false;
    this.querySelector<HTMLButtonElement>('.sds-bar__toggle')?.focus();
  }

  protected override choose(index: number): void {
    super.choose(index);
    /* Choosing is what the drawer was opened for. It closes whether or not the
       item moved anything, because a panel left standing over the page after a
       press reads as a press that did nothing. */
    this.open = false;
  }

  /** Whether the layout has taken the rail's column away. Read back from the
      layout rather than decided a second time here: the same rule that stacks
      the body says so, so the two cannot disagree about which width it is. */
  private railFolds(home: Element | null): boolean {
    if (!home) return false;
    return getComputedStyle(home).getPropertyValue('--rail-folded').trim() === '1';
  }

  /** Asked only where it can be answered: in Node there is no document to look
      in, and the bar is rendered there before any page has a rail. */
  private get railEl(): HTMLElement | null {
    if (!this.rail || typeof document === 'undefined') return null;
    return document.getElementById(this.rail);
  }

  /** The rail, back where the page put it. */
  private release(): void {
    const rail = this.railEl;
    if (!rail || !this.anchor) return;
    this.anchor.replaceWith(rail);
    this.anchor = undefined;
  }

  /** Where the rail belongs at this width, and whether it is there yet. */
  private place(): void {
    const rail = this.railEl;
    if (!rail) {
      this.foldRail = false;
      return;
    }
    this.foldRail = this.railFolds(this.anchor?.parentElement ?? rail.parentElement);
    if (!this.foldRail) return;
    const slot = this.querySelector('.sds-bar__rail');
    if (!slot || rail.parentElement === slot) return;
    this.anchor ??= document.createComment('page rail');
    rail.before(this.anchor);
    slot.append(rail);
  }

  /** What is in the row and what is in the drawer, from the room the row has
      rather than from a width. The order is what the bar can best do without:
      the field first, the sections last, and the rail whenever it has no
      column of its own. */
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
    if (!foldNav && !foldSearch && !this.foldRail) this.open = false;
  }

  private field(): TemplateResult {
    return html`<sds-search index="${this.index}"></sds-search>`;
  }

  /** The sections as parts, and which of them the reader is in. Three shapes
      arrive here: lifted from the page, handed over as markup, or as data.
      Empty rather than absent where nothing was lifted, so the fallback is the
      length and not a `??` that a `[]` never reaches — which is how a
      prerendered bar came to hold an empty `<nav>` and a page with no script
      lost its sections. `lifted()` runs in a browser only. */
  private sections(): { parts: unknown[]; at: number } {
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

  /** The sections: a row in the bar, a column in the drawer. Given `rail`, the
      box the page's own rail is moved into hangs under the section whose pages
      it holds — so the drawer is one tree, and not two lists a reader has to
      tell apart by guessing which is the level they are on. */
  private nav_(rail?: TemplateResult): TemplateResult {
    const { parts, at } = this.sections();
    const inside = !rail
      ? parts
      : at < 0
        ? [...parts, rail]
        : [...parts.slice(0, at + 1), rail, ...parts.slice(at + 1)];
    return html`<nav class="sds-bar__nav" aria-label="Sections">
    ${lines(inside as TemplateResult[], 4)}
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
      @click="${() => { this.open = !this.open; }}"
    ><sds-icon name="${this.open ? 'actions-close' : 'actions-list'}"></sds-icon></button>`;
  }

  protected override render(): TemplateResult {
    const hasNav = Boolean(this.taken.length || this.content || this.items.length);
    const wantsSearch = this.search || Boolean(this.index);
    const drawer = this.foldNav || this.foldSearch || this.foldRail;
    /* One box, wherever it ends up standing: inside the tree where the sections
       are in here too, and on its own where they are still in the row. */
    const slot = html`<div class="sds-bar__rail"></div>`;

    return html`<header class="sds-bar" @keydown="${(e: KeyboardEvent) => this.onKey(e)}">
  ${lockup({ signet: this.signet, brand: this.brand, product: this.product, href: this.home || '#' })}
  ${hasNav && !this.foldNav ? this.nav_() : ''}
  <div class="sds-bar__end">
    ${this.version ? html`<sds-badge label="${this.version}" tone="${this.tone}"></sds-badge>` : ''}
    ${wantsSearch && !this.foldSearch ? this.field() : ''}
    <sds-theme key="${this.themeKey}" ?compact="${this.compactTheme}"></sds-theme>
    ${drawer ? this.toggle_() : ''}
  </div>
  ${drawer
    ? html`${this.open ? html`<sds-overlay @click="${() => { this.open = false; }}"></sds-overlay>
  ` : ''}<div class="sds-bar__drawer" id="${this.drawerId}" ?hidden="${!this.open}" @click="${this.onFollow}">
    ${wantsSearch && this.foldSearch ? this.field() : ''}
    ${hasNav && this.foldNav ? this.nav_(slot) : slot}
  </div>`
    : ''}
</header>`;
  }

  protected override willUpdate(changed: PropertyValues<SdsHeader>): void {
    /* A different set of sections is a different width, and neither can be
       measured while it is in the drawer. Forgetting the measurement puts them
       back in the row for one frame, which is the state they can be taken in. */
    if (changed.has('items')) {
      this.needNav = 0;
      this.foldNav = false;
    }
    /* Out before the drawer is, and not after: Lit takes the whole drawer away
       in the same render, and a rail still standing in it goes with it — off
       the page, with nothing left saying where it was. */
    if (changed.has('foldRail') && !this.foldRail) this.release();
    /* And out for the same reason when the sections move, which moves the box
       the rail stands in: Lit builds the new one rather than carrying the old
       one across. `place()` puts it back into whichever box this render made. */
    if (changed.has('foldNav')) this.release();
  }

  protected override updated(): void {
    /* The row rather than this element: a host is `display: contents` and has
       no box to observe. Once, or every render hands the observer a target it
       is already watching and it answers its own callback. */
    if (!this.watched) {
      const row = this.querySelector<HTMLElement>('.sds-bar');
      if (row && this.watch) {
        this.watched = true;
        this.watch.observe(row);
      }
    }
    this.place();
    this.decide();
  }
}

define('sds-header', SdsHeader);
