/* sds-deck — slides one after the other, at the window's size.

   Two ways in. Slides between the tags are a deck of their own: the page
   shows the cover and a press that plays it. With none, the deck runs
   through the slides of the page, each where its section put it. Every one
   gets a press that opens the deck there. The deck holds no copy. It lends
   a slide the stage and puts it back where it stood.

     <sds-deck label="…"><sds-slide kind="cover" …></sds-slide>…</sds-deck>
     <sds-deck id="the-deck" from="main-content"></sds-deck> */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import type { SdsCommand } from './button.ts';
import type { SdsSlide } from './slide.ts';
import { define, isBlank, SdsElement } from '../lib/element.ts';

export interface DeckProps {
  /** The name of the deck, in its head: what the reader has open. */
  label?: string;
  /** The id of the part of the page whose slides the deck runs through.
      Empty is the whole document. A deck with slides of its own ignores it. */
  from?: string;
  /** If it stands over the page. */
  open?: boolean;
  /** What every slide of the deck has in common, said once. A slide that
      says its own keeps it. The lockup in every foot, and the larger mark a
      cover and a closing carry. */
  brand?: string;
  product?: string;
  signet?: string;
  signetLarge?: string;
  /** If the deck counts its slides in their feet. A cover and a closing
      carry no count. */
  numbered?: boolean;
}

/** The kinds that carry no count and the larger mark. */
const BOOKENDS = new Set(['cover', 'closing']);

/** A slide on the stage, and what it gave up to stand there. */
interface Loan {
  slide: SdsSlide;
  hold: HTMLElement;
  fit: boolean;
  zoomable: boolean;
}

/** The keys that move one slide. The keys inside a slide are the slide's. */
const STEP: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, PageDown: 1, ArrowLeft: -1, ArrowUp: -1, PageUp: -1 };

/** What keeps its own gesture: a drag that starts here is not a turn. */
const OWN = 'a, button, input, select, textarea, summary, label, [contenteditable], pre, .sds-code';

/** How far a drag goes before it turns the slide: this part of the stage,
    and never more than the reach of a thumb. */
const TURN = 0.15;
const REACH = 120;

/** A drag in progress: where it began, and if it has become one. */
interface Drag {
  id: number;
  x: number;
  y: number;
  dx: number;
  moved: boolean;
}

/** What a picture of a slide must not keep: a stop for the keyboard, a
    control, a thing that plays. */
const LIVE = new Set(['a', 'button', 'input', 'select', 'textarea', 'summary', 'details', 'label', 'iframe', 'video', 'audio', 'dialog']);

/** A slide as a picture, for the list. The frame's markup with every element
    and every control turned into a plain box of the same display. A copy
    of an element upgrades again and takes its own output for its content. */
function picture(frame: Element, { sized = false }: { sized?: boolean } = {}): HTMLElement {
  const copy = frame.cloneNode(true) as HTMLElement;
  if (!sized) copy.style.removeProperty('zoom');
  const from = [...frame.querySelectorAll('*')];
  const to = [...copy.querySelectorAll('*')];
  for (let i = to.length - 1; i >= 0; i -= 1) {
    const el = to[i] as HTMLElement;
    for (const name of ['id', 'tabindex', 'name', 'for', 'href']) el.removeAttribute(name);
    if (el.namespaceURI !== 'http://www.w3.org/1999/xhtml') continue;
    if (!el.localName.includes('-') && !LIVE.has(el.localName)) continue;
    const plain = document.createElement('span');
    for (const { name, value } of [...el.attributes]) plain.setAttribute(name, value);
    plain.style.display = getComputedStyle(from[i] as Element).display;
    plain.append(...el.childNodes);
    el.replaceWith(plain);
  }
  return copy;
}

/** What the list calls a slide: its title, its eyebrow, or its first words. */
function titleOf(slide: SdsSlide, index: number): string {
  const words = (slide.querySelector('.sds-slide__body')?.textContent ?? '').replace(/\s+/g, ' ').trim();
  return slide.heading || slide.eyebrow || words || `Slide ${index + 1}`;
}

export class SdsDeck extends SdsElement {
  static override properties = {
    label: { type: String },
    from: { type: String },
    open: { type: Boolean, reflect: true },
    at: { type: Number, state: true },
    titles: { type: Array, state: true },
    listed: { type: Boolean, state: true },
    full: { type: Boolean, state: true },
    brand: { type: String },
    product: { type: String },
    signet: { type: String },
    signetLarge: { type: String, attribute: 'signet-large' },
    numbered: { type: Boolean },
  };

  declare label: string;
  declare from: string;
  declare open: boolean;
  declare at: number;
  declare titles: string[];
  declare listed: boolean;
  declare full: boolean;
  declare brand: string;
  declare product: string;
  declare signet: string;
  declare signetLarge: string;
  declare numbered: boolean;

  /** The slides written between the tags, if any. */
  private own: SdsSlide[] = [];
  private slides: SdsSlide[] = [];
  private loan?: Loan;
  private keys?: AbortController;
  private asks?: AbortController;
  /** The slide to come back to after a print, if the deck was open. */
  private resume = -1;
  private drag?: Drag;
  /** A drag just ended, so the click the pointer sends after it is no press. */
  private dragged = false;

  constructor() {
    super();
    this.label = 'Slides';
    this.from = '';
    this.open = false;
    this.at = 0;
    this.titles = [];
    this.listed = false;
    this.full = false;
    this.brand = '';
    this.product = '';
    this.signet = '';
    this.signetLarge = '';
    this.numbered = false;
  }

  private get dialog(): HTMLDialogElement | null {
    return this.querySelector('dialog');
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.own = written.filter((node): node is SdsSlide => (node as Element).localName === 'sds-slide');
    super.connectedCallback();
    this.addEventListener('sds-command', this.onCommand as EventListener);
    this.asks = new AbortController();
    document.addEventListener('sds-slide-open', this.onAsk, { signal: this.asks.signal });
    const slides = this.collect();
    this.hand(slides);
    if (!this.own.length) for (const slide of slides) slide.setAttribute('zoomable', '');
  }

  /* What the deck says once, given to every slide that does not say it. An
     attribute, because a slide can still wait for its upgrade, and a value
     set on it then outweighs the attribute its author wrote. The count and
     the outline come from the order: nobody keeps either by hand. */
  private hand(slides: readonly SdsSlide[]): void {
    const kind = (slide: Element): string => slide.getAttribute('kind') || 'content';
    const give = (slide: Element, name: string, value: string): void => {
      if (value && !slide.getAttribute(name)) slide.setAttribute(name, value);
    };
    const dividers = slides.filter((slide) => kind(slide) === 'section');
    const outline = JSON.stringify(dividers.map((slide) => slide.getAttribute('heading') ?? ''));
    slides.forEach((slide, i) => {
      const bookend = BOOKENDS.has(kind(slide));
      /* A slide of a deck stands on a page as a picture of its column. */
      if (!slide.hasAttribute('shrink')) slide.setAttribute('shrink', '');
      give(slide, 'brand', this.brand);
      give(slide, 'product', this.product);
      give(slide, 'signet', bookend ? this.signetLarge || this.signet : this.signet);
      if (this.numbered && !bookend) give(slide, 'number', String(i + 1).padStart(2, '0'));
      const said = slide.getAttribute('sections');
      if (dividers.includes(slide) && (!said || said === '[]')) {
        slide.setAttribute('sections', outline);
        slide.setAttribute('current', String(dividers.indexOf(slide)));
      }
    });
  }

  override disconnectedCallback(): void {
    this.removeEventListener('sds-command', this.onCommand as EventListener);
    this.keys?.abort();
    this.asks?.abort();
    this.giveBack();
    super.disconnectedCallback();
  }

  /* The slides between the tags go where the poster draws them, once. Lit
     leaves a node alone that no binding placed, so a loan survives a render. */
  protected override firstUpdated(): void {
    const [cover, ...rest] = this.own;
    if (cover) this.querySelector('.sds-deck__cover')?.append(cover);
    this.querySelector('.sds-deck__rest')?.append(...rest);
  }

  private readonly onCommand = (event: CustomEvent<SdsCommand>): void => {
    const command = event.detail?.command ?? 'show';
    if (command === 'close') this.close();
    else if (command === 'toggle') (this.open ? this.close() : this.show());
    else this.show();
  };

  /* A press on a slide of the page opens the deck at that slide. */
  private readonly onAsk = (event: Event): void => {
    if (this.own.length || this.open) return;
    const at = this.collect().indexOf(event.target as SdsSlide);
    if (at >= 0) this.show(at);
  };

  /** The slides in the order the page has them, read at every opening. A
      page that grew a slide since the last one has it in the deck. A slide
      of another deck belongs to that one. */
  private collect(): SdsSlide[] {
    if (this.own.length) return this.own;
    const root = this.from ? document.getElementById(this.from) : document;
    if (!root) return [];
    return [...root.querySelectorAll<SdsSlide>('sds-slide')].filter((slide) => !slide.closest('sds-deck'));
  }

  show(at = 0): void {
    this.slides = this.collect();
    this.titles = this.slides.map(titleOf);
    this.open = true;
    void this.updateComplete.then(() => {
      this.draw();
      const el = this.dialog;
      if (el && !el.open) el.showModal();
      this.listen();
      this.go(at);
    });
  }

  close(): void {
    if (document.fullscreenElement && document.fullscreenElement === this.screen) void document.exitFullscreen();
    this.dialog?.close();
  }

  /* What goes to the full screen. Not the dialog: the platform refuses a
     `<dialog>` there. The box inside it carries all it shows. */
  private get screen(): HTMLElement | null {
    return this.querySelector('.sds-deck__screen');
  }

  /** The deck on the whole screen, or back in the window. The head steps
      aside until the pointer asks for it, and a press on the slide turns it,
      as a room expects of a deck. */
  fullscreen(): void {
    const el = this.screen;
    if (!el) return;
    if (document.fullscreenElement === el) void document.exitFullscreen();
    else void el.requestFullscreen?.().catch(() => undefined);
  }

  /** Show slide `index`, counted from zero. Past either end it stays. The
      slide on the stage goes out the way the deck moves, and the next one
      comes in behind it. `from` is where a drag let go of the slide. */
  go(index: number, { from = 0 }: { from?: number } = {}): void {
    if (!this.slides.length) return;
    const to = Math.min(Math.max(index, 0), this.slides.length - 1);
    /* The slide on show already: nothing to lend, and a drag at the end of
       the deck springs back in place. */
    if (to === this.at && this.loan) return;
    const stage = this.stage;
    const frame = this.loan?.slide.querySelector(':scope > .sds-slide');
    const way = Math.sign(to - this.at);
    const moves = Boolean(stage && frame && way) && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ghost = moves && stage && frame ? this.ghost(frame, stage) : undefined;
    this.lend(to);
    if (ghost && stage) this.push(stage, ghost, way, from);
    void this.updateComplete.then(() => this.follow());
  }

  /* The slide that leaves, as a picture where it stands, so the slide the
     deck lends next can take the stage at once. A push still under way
     ends here: the next one starts from where the slides are. */
  private ghost(frame: Element, stage: HTMLElement): HTMLElement {
    for (const old of stage.querySelectorAll('.sds-deck__ghost')) old.remove();
    const box = frame.getBoundingClientRect();
    const room = stage.getBoundingClientRect();
    const ghost = document.createElement('div');
    ghost.className = 'sds-deck__ghost';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.inert = true;
    ghost.style.insetInlineStart = `${box.left - room.left}px`;
    ghost.style.insetBlockStart = `${box.top - room.top}px`;
    ghost.style.inlineSize = `${box.width}px`;
    ghost.style.blockSize = `${box.height}px`;
    ghost.append(picture(frame, { sized: true }));
    stage.append(ghost);
    return ghost;
  }

  /* Both slides move one stage width, side by side: the old one out, the
     new one in from where the old one goes next. The new one starts with
     no transition, the stylesheet runs the rest. */
  private push(stage: HTMLElement, ghost: HTMLElement, way: number, from: number): void {
    const width = stage.clientWidth;
    stage.classList.add('is-placing');
    stage.style.setProperty('--sds-deck-drag', `${from + way * width}px`);
    void stage.offsetWidth;
    stage.classList.remove('is-placing');
    stage.style.removeProperty('--sds-deck-drag');
    ghost.style.translate = `${-way * width - from}px 0`;
    const gone = (): void => ghost.remove();
    ghost.addEventListener('transitionend', gone, { once: true });
    /* A transition that never runs sends no end. */
    setTimeout(gone, 1000);
  }

  /* A picture of every slide for the list, before the first loan. Each
     slide still stands where the page drew it, fitted to its column. */
  private draw(): void {
    const boxes = this.querySelectorAll('.sds-deck__thumb');
    this.slides.forEach((slide, i) => {
      const frame = slide.querySelector(':scope > .sds-slide');
      const box = boxes[i];
      if (frame && box) box.replaceChildren(picture(frame));
    });
  }

  /* The slide leaves the page for the stage, and a box of its height holds
     its place. So the page under the backdrop does not move, and the reader
     comes back to the scroll they left. */
  private lend(index: number): void {
    const slide = this.slides[index];
    const stage = this.querySelector('.sds-deck__stage');
    if (!slide || !stage) return;
    this.giveBack();
    const hold = document.createElement('div');
    hold.className = 'sds-deck__hold';
    hold.style.height = `${slide.getBoundingClientRect().height}px`;
    slide.replaceWith(hold);
    this.loan = { slide, hold, fit: slide.fit, zoomable: slide.zoomable };
    slide.fit = true;
    slide.zoomable = false;
    stage.append(slide);
    this.at = index;
  }

  private giveBack(): SdsSlide | undefined {
    const loan = this.loan;
    if (!loan) return undefined;
    this.loan = undefined;
    loan.slide.fit = loan.fit;
    loan.slide.zoomable = loan.zoomable;
    loan.hold.replaceWith(loan.slide);
    return loan.slide;
  }

  /* The current entry stays in view in the list. Its own `scrollTop`, never
     `scrollIntoView`, which also moves the page under the backdrop. */
  private follow(): void {
    const list = this.querySelector<HTMLElement>('.sds-deck__nav');
    /* The entry, never a mark inside a picture of a slide. */
    const row = list?.querySelector<HTMLElement>('.sds-deck__entry.is-active');
    if (!list || !row || list.hidden) return;
    if (row.offsetTop < list.scrollTop) list.scrollTop = row.offsetTop;
    else if (row.offsetTop + row.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = row.offsetTop + row.offsetHeight - list.clientHeight;
    }
  }

  /* On the document, not the dialog: a press that disables the last button
     leaves the focus on no element inside it. */
  private listen(): void {
    this.keys?.abort();
    this.keys = new AbortController();
    document.addEventListener('keydown', this.onKey, { signal: this.keys.signal });
    document.addEventListener(
      'fullscreenchange',
      () => {
        this.full = Boolean(document.fullscreenElement) && document.fullscreenElement === this.screen;
        /* The focus leaves the head, or the head stays in view for it. The
           keys still turn the slides: they listen on the document. */
        if (this.full) this.screen?.focus();
      },
      { signal: this.keys.signal },
    );
  }

  private readonly onKey = (event: KeyboardEvent): void => {
    if (!this.open || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    /* A key inside the slide is the slide's: a code block scrolls with it. */
    const target = event.target as Element | null;
    if (target?.closest?.('.sds-deck__stage')) return;
    const step = STEP[event.key];
    if (event.key === 'Home') this.go(0);
    else if (event.key === 'End') this.go(this.slides.length - 1);
    else if (event.key === 'f' || event.key === 'F') this.fullscreen();
    else if (step) this.go(this.at + step);
    else return;
    event.preventDefault();
  };

  /** Every slide on a page of its own, and the browser's print. Its dialog
      saves a PDF: text stays text, and a link stays a link. The slides go
      back when the print is over. */
  print(): void {
    this.resume = this.open ? this.at : -1;
    /* The slide on the stage goes home before anything else moves. The
       dialog's `close` arrives a task later, and a loan still open then
       takes its slide off the sheet and leaves a hold behind. */
    this.giveBack();
    if (this.open) this.close();
    const sheet = document.createElement('div');
    sheet.className = 'sds-deck__print';
    document.body.append(sheet);
    const loans = this.collect().map((slide) => {
      const hold = document.createElement('div');
      hold.className = 'sds-deck__hold';
      slide.replaceWith(hold);
      const loan: Loan = { slide, hold, fit: slide.fit, zoomable: slide.zoomable };
      slide.fit = false;
      slide.zoomable = false;
      sheet.append(slide);
      return loan;
    });
    document.documentElement.setAttribute('data-sds-deck-print', '');
    /* Once, on whichever comes first: the event, or the return of a print
       that waits for its dialog. A browser that sends no event still gets
       its slides back. */
    let done = false;
    const restore = (): void => {
      if (done) return;
      done = true;
      document.documentElement.removeAttribute('data-sds-deck-print');
      for (const loan of loans) {
        loan.slide.fit = loan.fit;
        loan.slide.zoomable = loan.zoomable;
        loan.hold.replaceWith(loan.slide);
      }
      sheet.remove();
      const at = this.resume;
      this.resume = -1;
      if (at >= 0) this.show(at);
    };
    window.addEventListener('afterprint', restore, { once: true });
    /* Two frames, so every slide has fitted itself on the sheet first. */
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        window.print();
        restore();
      }),
    );
  }

  private get stage(): HTMLElement | null {
    return this.querySelector('.sds-deck__stage');
  }

  /* A finger or a pointer drags the slide. Past a part of the stage it
     turns, short of that it goes back. At either end of the deck it gives
     a third of the way, so the reader feels the end rather than hits it. */
  private readonly onDown = (event: PointerEvent): void => {
    if (event.button !== 0 || !this.slides.length) return;
    if ((event.target as Element | null)?.closest?.(OWN)) return;
    this.drag = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, moved: false };
  };

  private readonly onMove = (event: PointerEvent): void => {
    const drag = this.drag;
    const stage = this.stage;
    if (!drag || !stage || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved) {
      /* Sideways first, or it is a scroll and not a drag. */
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) this.drag = undefined;
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
      drag.moved = true;
      /* A pointer the platform does not track refuses the capture, and the
         drag goes on without it. */
      try {
        stage.setPointerCapture(event.pointerId);
      } catch {
        /* no capture */
      }
      stage.classList.add('is-dragging');
    }
    const end = (dx > 0 && this.at === 0) || (dx < 0 && this.at === this.slides.length - 1);
    drag.dx = dx;
    stage.style.setProperty('--sds-deck-drag', `${end ? dx / 3 : dx}px`);
  };

  private readonly onUp = (event: PointerEvent): void => {
    const drag = this.drag;
    const stage = this.stage;
    if (!drag || event.pointerId !== drag.id) return;
    this.drag = undefined;
    if (!drag.moved || !stage) return;
    /* The click a drag ends in comes in the same task, if it comes at all.
       A mark that outlives the task swallows the next real press. */
    this.dragged = true;
    setTimeout(() => {
      this.dragged = false;
    });
    stage.classList.remove('is-dragging');
    stage.style.removeProperty('--sds-deck-drag');
    if (event.type === 'pointercancel') return;
    if (Math.abs(drag.dx) > Math.min(REACH, stage.clientWidth * TURN)) this.go(this.at + (drag.dx < 0 ? 1 : -1), { from: drag.dx });
  };

  /* On the whole screen a press on the slide turns it. Not on a link or a
     control, and not the press a drag ends in. */
  private readonly onStageClick = (event: MouseEvent): void => {
    if (this.dragged) {
      this.dragged = false;
      return;
    }
    if (!this.full || (event.target as Element | null)?.closest?.(OWN)) return;
    this.go(this.at + 1);
  };

  /* The slide goes back first, then the page scrolls to it. The reader
     leaves the deck where the slide stands, or at the cover it played from. */
  private readonly onClose = (): void => {
    this.keys?.abort();
    const slide = this.giveBack();
    this.open = false;
    if (this.resume >= 0) return;
    const back = this.own.length ? this.querySelector('.sds-deck__poster') : slide;
    back?.scrollIntoView({ block: 'nearest' });
  };

  protected override updated(): void {
    const el = this.dialog;
    if (!el || !this.isConnected) return;
    if (!this.open && el.open) el.close();
  }

  /* The cover as the page shows it, and the press over it. The rest of the
     deck takes the cover's width out of sight, because a slide fits itself
     to the room it has. */
  private poster(): TemplateResult | typeof nothing {
    if (!this.own.length) return nothing;
    /* The cover plays the deck on a press too. The keyboard has the button
       under it, which says so in words. */
    return html`<div class="sds-deck__poster">
  <div class="sds-deck__cover" @click="${() => this.show(0)}"></div>
  <div class="sds-deck__presses">
    <button class="sds-btn sds-btn--secondary sds-btn--icon" type="button" title="Save as PDF" @click="${() => this.print()}"><sds-icon name="actions-file-pdf"></sds-icon></button>
    <button class="sds-btn sds-btn--primary sds-deck__play" type="button" @click="${() => this.show(0)}"><sds-icon name="actions-play"></sds-icon>Play the deck · ${this.own.length} slides</button>
  </div>
  <div class="sds-deck__rest"></div>
</div>`;
  }

  /* A list that stands over the stage, on a narrow screen, gives the stage
     back once the reader has chosen. The stylesheet says which it is. */
  private pick(index: number): void {
    this.go(index);
    const nav = this.querySelector('.sds-deck__nav');
    if (nav && getComputedStyle(nav).position === 'absolute') this.listed = false;
  }

  private list(): TemplateResult {
    return html`<nav class="sds-deck__nav" aria-label="All slides" ?hidden="${!this.listed}">
  <ol class="sds-deck__list">${this.titles.map((title, i) => html`<li>
    <button class="${i === this.at ? 'sds-deck__entry is-active' : 'sds-deck__entry'}" type="button" aria-current="${i === this.at ? 'true' : nothing}" @click="${() => this.pick(i)}">
      <span class="sds-deck__thumb" aria-hidden="true" inert></span>
      <span class="sds-deck__entry-line">
        <span class="sds-deck__entry-count">${String(i + 1).padStart(2, '0')}</span>
        <span class="sds-deck__entry-title">${title}</span>
      </span>
    </button>
  </li>`)}</ol>
</nav>`;
  }

  protected override render(): TemplateResult {
    const total = this.titles.length;
    const count = total ? `${this.at + 1} / ${total}` : '';
    /* How far through, as a share of the track. A measurement, so a style. */
    const through = total ? `inline-size: ${((this.at + 1) / total) * 100}%` : 'inline-size: 0';
    return html`${this.poster()}<dialog class="${this.full ? 'sds-deck is-full' : 'sds-deck'}" aria-label="${this.label}" @close="${this.onClose}">
  <div class="sds-deck__screen" tabindex="-1">
  <div class="sds-modal__head">
    <div class="sds-deck__start">
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" type="button" title="${this.listed ? 'Hide the slides' : 'Show all slides'}" aria-expanded="${this.listed ? 'true' : 'false'}" @click="${() => {
        this.listed = !this.listed;
        void this.updateComplete.then(() => this.follow());
      }}"><sds-icon name="actions-list"></sds-icon></button>
      <span class="sds-modal__title">${this.label}</span>
    </div>
    <div class="sds-deck__controls">
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" type="button" title="Previous slide (←)" ?disabled="${this.at <= 0}" @click="${() => this.go(this.at - 1)}"><sds-icon name="actions-arrow-left"></sds-icon></button>
      <p class="sds-deck__count" aria-live="polite">${count}</p>
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" type="button" title="Next slide (→)" ?disabled="${this.at >= total - 1}" @click="${() => this.go(this.at + 1)}"><sds-icon name="actions-arrow-right"></sds-icon></button>
    </div>
    <div class="sds-deck__end">
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" type="button" title="Save as PDF" @click="${() => this.print()}"><sds-icon name="actions-file-pdf"></sds-icon></button>
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" type="button" title="${this.full ? 'Leave the full screen (F)' : 'Full screen (F)'}" aria-pressed="${this.full ? 'true' : 'false'}" @click="${() => this.fullscreen()}"><sds-icon name="actions-fullscreen"></sds-icon></button>
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon sds-modal__close" type="button" title="Close (Esc)" @click="${() => this.close()}"><sds-icon name="actions-close"></sds-icon></button>
    </div>
  </div>
  <div class="sds-deck__progress" aria-hidden="true"><span style="${through}"></span></div>
  <div class="sds-deck__main">
    ${this.list()}
    <div
      class="sds-deck__stage"
      @pointerdown="${this.onDown}"
      @pointermove="${this.onMove}"
      @pointerup="${this.onUp}"
      @pointercancel="${this.onUp}"
      @dragstart="${(event: DragEvent) => event.preventDefault()}"
      @click="${this.onStageClick}"
    ></div>
  </div>
  </div>
</dialog>`;
  }
}

define('sds-deck', SdsDeck);
