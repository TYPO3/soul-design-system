/* sds-slide — one 16:9 frame of a deck.

   A slide is the page at twice the size. The frame is 960 × 540 and the
   stylesheet doubles it. So the display step is a title, the body step is
   what a room reads, and every element between the tags keeps its own set.
   The element owns the frame: its kind, its ground, its head and its foot.
   The head is the eyebrow and the title, the foot the lockup and the count.
   A divider carries the deck's outline. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, isBlank, SdsElement } from '../lib/element.ts';
import { lockup } from '../lib/lockup.ts';
import './eyebrow.ts';
import './icon.ts';
import './image.ts';

/** What a slide is in the run of a deck. `cover` and `closing` hold the title
    up and the lockup down, and `section` holds the outline down. `statement`
    centres one sentence, and `content` keeps its title at the top margin.
    `speaker` gives the name the left column and a portrait the right, edge
    to edge. `figure` shows material from a page: a table, a drawing, a
    screenshot. Its title is a step smaller, and the material takes the rest. */
export type SlideKind = 'cover' | 'section' | 'statement' | 'content' | 'closing' | 'speaker' | 'figure';

/** The ground. A deck stands on paper, and the slide that opens it on the
    terminal. The flip is the emphasis, and the one accent stays where it is.
    Paper unless said, whatever mode the page is in. A room watches a deck,
    and a room has no mode. */
export type SlideGround = 'paper' | 'terminal';

const KIND: Record<SlideKind, string> = {
  cover: 'sds-slide--cover',
  section: 'sds-slide--section',
  statement: 'sds-slide--statement',
  content: '',
  closing: 'sds-slide--closing',
  speaker: 'sds-slide--speaker',
  figure: 'sds-slide--figure',
};

const GROUND: Record<SlideGround, string> = { paper: 'light', terminal: 'dark' };

/** What takes the keyboard on a page. On a slide none of it does. A slide is
    a picture of a part, and the part on the page is where its controls work. */
const STOPS = 'a[href], button, input, select, textarea, summary, iframe, [tabindex]:not([tabindex="-1"])';

export interface SlideProps {
  kind?: SlideKind;
  ground?: SlideGround;
  /** The line over the title, in the label register: the occasion, the
      section's number, the date. */
  eyebrow?: string;
  /** The title. A cover, a divider and a statement set it at the display
      step. A content slide sets it at the h2 step, so the body has room. */
  heading?: string;
  /** The sentence under a cover's or a closing's title. */
  lead?: string;
  /** The line under a statement: where the sentence is from. */
  note?: string;
  /** The slide's count, in the foot. A string, because a deck numbers its
      slides the way it likes: `03`, `3 / 12`. */
  number?: string;
  /** The mark and the name, as the bar and the footer draw them. The lockup
      stands at the foot of a cover and a closing, and in the foot of every
      other kind. Without a product there is no lockup. */
  signet?: string;
  brand?: string;
  product?: string;
  /** The deck's outline, on a divider, and which entry this section is. */
  sections?: readonly string[];
  current?: number;
  /** On a speaker slide: the portrait, which is the deck's own picture, as
      a product brings its own mark. A speaker has one. Without it the
      column stands empty, which is the gap it is. */
  portrait?: string;
  alt?: string;
  /** What the slide shows between its title and its foot. Markup where a
      caller holds it: the elements of the system at the page's size. */
  body?: string | TemplateResult;
  /** If the slide carries a press that opens it at the window's size. A deck
      sets it on every slide it runs through. */
  zoomable?: boolean;
  /** If the frame scales to the room it has: a stage. The room is the width
      and the height its parent gives it, and the window below its top. */
  fit?: boolean;
  /** If the frame is a picture in a column. It shrinks to a column that is
      narrower than it, and never grows past the size the stylesheet states.
      A measurement, so a page with no script draws the stated size. A deck
      sets it on every slide it runs through. */
  shrink?: boolean;
}

export class SdsSlide extends SdsElement {
  static override properties = {
    kind: { type: String, reflect: true },
    ground: { type: String, reflect: true },
    eyebrow: { type: String },
    heading: { type: String },
    lead: { type: String },
    note: { type: String },
    number: { type: String },
    signet: { type: String },
    brand: { type: String },
    product: { type: String },
    sections: { type: Array },
    current: { type: Number },
    portrait: { type: String },
    alt: { type: String },
    body: { type: String },
    fit: { type: Boolean, reflect: true },
    shrink: { type: Boolean, reflect: true },
    zoomable: { type: Boolean, reflect: true },
    /** The zoom the last measurement settled on. Zero is "not measured". */
    zoom: { type: Number, state: true },
  };

  declare kind: SlideKind;
  declare ground: SlideGround;
  declare eyebrow: string;
  declare heading: string;
  declare lead: string;
  declare note: string;
  declare number: string;
  declare signet: string;
  declare brand: string;
  declare product: string;
  declare sections: readonly string[];
  declare current: number;
  declare portrait: string;
  declare alt: string;
  declare body: string | TemplateResult;
  declare fit: boolean;
  declare shrink: boolean;
  declare zoomable: boolean;
  declare zoom: number;

  private watch?: ResizeObserver;
  private settling = 0;

  /* The body, where it stood between the tags. A deck's slide holds the
     system's elements, which is markup or it is nothing. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.kind = 'content';
    this.ground = 'paper';
    this.eyebrow = '';
    this.heading = '';
    this.lead = '';
    this.note = '';
    this.number = '';
    this.signet = '';
    this.brand = '';
    this.product = '';
    this.sections = [];
    this.current = 0;
    this.portrait = '';
    this.alt = '';
    this.body = '';
    this.fit = false;
    this.shrink = false;
    this.zoomable = false;
    this.zoom = 0;
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
    /* The room is the parent's width, and under `fit` the window's height.
       Measured off the frame itself it reads back its own answer and never
       moves. And a frame taller than the window is a slide nobody sees whole. */
    this.watch = new ResizeObserver(() => {
      cancelAnimationFrame(this.settling);
      this.settling = requestAnimationFrame(() => this.isConnected && this.decide());
    });
    if (this.parentElement) this.watch.observe(this.parentElement);
    this.watch.observe(document.documentElement);
    void this.updateComplete.then(() => {
      this.decide();
      const fit = this.querySelector('.sds-slide__fit');
      if (fit) this.watch?.observe(fit);
    });
  }

  override disconnectedCallback(): void {
    this.watch?.disconnect();
    cancelAnimationFrame(this.settling);
    super.disconnectedCallback();
  }

  /* A deck lends the slide its stage and sets `fit` for the loan. */
  protected override updated(changed: Map<PropertyKey, unknown>): void {
    if ((changed.has('fit') && changed.get('fit') !== undefined) || (changed.has('shrink') && changed.get('shrink') !== undefined)) requestAnimationFrame(() => this.isConnected && this.decide());
  }

  /* The frame first, then what stands in it. */
  private decide(): void {
    this.measure();
    this.settle();
    this.quiet();
  }

  /* No stop for the keyboard inside the body. The pointer the stylesheet
     keeps out. The text stays, for a reader who hears the page. */
  private quiet(): void {
    for (const stop of this.querySelectorAll('.sds-slide__fit :is(' + STOPS + ')')) stop.setAttribute('tabindex', '-1');
  }

  /* The material is a picture too. What is taller or wider than the body
     shrinks until it fits, and nothing grows. Its width stays what it was,
     so nothing wraps anew and the shrink is exact. Measurements, so styles. */
  private settle(): void {
    const fit = this.querySelector<HTMLElement>('.sds-slide__fit');
    const body = fit?.parentElement;
    if (!fit || !body) return;
    fit.style.removeProperty('zoom');
    fit.style.removeProperty('width');
    fit.style.removeProperty('align-self');
    const room = body.getBoundingClientRect();
    const need = fit.getBoundingClientRect();
    if (!(room.height > 0) || !(need.height > 0)) return;
    const wide = fit.scrollWidth > fit.clientWidth + 1 ? fit.clientWidth / fit.scrollWidth : 1;
    const ratio = Math.min(room.height / need.height, wide);
    if (ratio >= 1) return;
    fit.style.width = getComputedStyle(fit).width;
    fit.style.alignSelf = 'center';
    /* Laid out, a zoom rounds to whole pixels. So the element measures the
       fit again and takes off what still stands over. */
    let zoom = ratio;
    for (let pass = 0; pass < 3; pass += 1) {
      fit.style.zoom = String(zoom);
      const over = fit.getBoundingClientRect().bottom - body.getBoundingClientRect().bottom;
      if (over <= 0) return;
      zoom *= (need.height * zoom - over) / (need.height * zoom);
    }
  }

  /** How far to scale the frame so it fits. The frame's size comes off the
      stylesheet, never a copy here. `--sds-slide-width` and its height are
      the set's, and a copy in TypeScript is the copy that goes stale. */
  private measure(): void {
    const box = this.firstElementChild as HTMLElement | null;
    if (!box) return;
    const style = getComputedStyle(box);
    const width = parseFloat(style.getPropertyValue('--sds-slide-width'));
    const height = parseFloat(style.getPropertyValue('--sds-slide-height'));
    const stated = parseFloat(style.getPropertyValue('--sds-slide-zoom'));
    const parent = this.parentElement;
    if (!parent) return;
    /* The parent's content box, not its border box: a stage with padding
       gives the frame the air it asked for. */
    const rect = parent.getBoundingClientRect();
    const around = getComputedStyle(parent);
    const room = rect.width - parseFloat(around.paddingLeft) - parseFloat(around.paddingRight);
    if (!this.fit) {
      /* A picture: smaller where the column is, never larger than stated.
         Neither, and the frame keeps the size the stylesheet states. */
      if (!this.shrink) {
        this.zoom = 0;
        return;
      }
      if (!(width > 0) || !(room > 0)) return;
      this.zoom = room / width < stated ? room / width : 0;
      return;
    }
    /* The height is the parent's own, and the window's below it where the
       parent starts in view. A parent below the fold has no window left, and
       a slide there still fits its width: a page of stories is such a page. */
    const pads = parseFloat(around.paddingTop) + parseFloat(around.paddingBottom);
    const inner = rect.height - pads;
    const below = window.innerHeight - Math.max(0, rect.top + parseFloat(around.paddingTop)) - parseFloat(around.paddingBottom);
    const tall = below > 0 ? Math.min(below, inner) : inner;
    if (!(width > 0) || !(height > 0) || !(room > 0)) return;
    this.zoom = tall > 0 ? Math.min(room / width, tall / height) : room / width;
  }

  /* The title's step follows the kind. The display step stands alone on a
     slide that says one thing. A content slide's title shares the frame
     with a body and takes the h2 step. Both are the page's own registers. */
  private head(): TemplateResult | typeof nothing {
    if (!this.eyebrow && !this.heading && !this.lead) return nothing;
    const display = this.kind !== 'content' && this.kind !== 'figure';
    const step = this.kind === 'figure' ? 'sds-h3' : 'sds-h2';
    return html`<div class="sds-slide__head">
    ${this.eyebrow ? html`<sds-eyebrow label="${this.eyebrow}"></sds-eyebrow>` : nothing}
    ${this.heading
      ? display
        ? html`<h1 class="sds-display">${this.heading}</h1>`
        : html`<h2 class="${step}">${this.heading}</h2>`
      : nothing}
    ${this.lead ? html`<p class="sds-lead">${this.lead}</p>` : nothing}
    ${this.note ? html`<p class="sds-slide__note">${this.note}</p>` : nothing}
  </div>`;
  }

  private outline(): TemplateResult | typeof nothing {
    if (this.kind !== 'section' || !this.sections.length) return nothing;
    return html`<ol class="sds-slide__nav">${this.sections.map(
      (label, i) => html`<li class="sds-slide__nav-item${i === this.current ? ' is-active' : ''}">${label}</li>`,
    )}</ol>`;
  }

  /* One lockup, drawn where the kind puts it. The foot is the row every slide
     that carries a count has; a cover and a closing end on the mark alone. */
  private foot(): TemplateResult | typeof nothing {
    const mark = lockup({ signet: this.signet, brand: this.brand, product: this.product });
    if (this.kind === 'cover' || this.kind === 'closing') {
      return mark ? html`<div class="sds-slide__lockup">${mark}</div>` : nothing;
    }
    if (!mark && !this.number) return nothing;
    return html`<div class="sds-slide__foot">
    ${mark || html`<span></span>`}
    ${this.number ? html`<p class="sds-slide__count">${this.number}</p>` : nothing}
  </div>`;
  }

  /* The right column of a speaker slide: the portrait, edge to edge. */
  private portraitColumn(): TemplateResult {
    return html`<div class="sds-slide__portrait">${this.portrait
      ? html`<sds-image src="${this.portrait}" alt="${this.alt}"></sds-image>`
      : nothing}</div>`;
  }

  /* The slide does not open itself. It asks, and the deck that runs
     through it answers with the slide at the window's size. */
  private readonly open = (): void => {
    this.dispatchEvent(new CustomEvent('sds-slide-open', { bubbles: true, composed: true }));
  };

  /* A press anywhere on a slide that opens is a press on its button, as a
     press on a picture opens the picture. */
  private readonly onFrame = (): void => {
    if (this.zoomable) this.open();
  };

  protected override render(): TemplateResult {
    const body = this.taken ?? this.content ?? this.body;
    /* A style rather than a property of the set, because it is a measurement
       and not a value anybody states. */
    const zoom = this.zoom > 0 ? `zoom:${this.zoom}` : nothing;
    const page = html`${this.head()}
  ${body ? html`<div class="sds-slide__body"><div class="sds-slide__fit">${body}</div></div>` : nothing}
  ${this.outline()}
  ${this.foot()}`;
    /* A speaker slide is two columns, and the foot pins inside the second.
       So that one gets its own page; every other kind is the frame. */
    return html`<div class="sds-slide${KIND[this.kind] ? ` ${KIND[this.kind]}` : ''}" data-theme="${GROUND[this.ground] ?? GROUND.paper}" style="${zoom}" @click="${this.onFrame}">
  ${this.kind === 'speaker' ? html`<div class="sds-slide__page">${page}</div>${this.portraitColumn()}` : page}
</div>${this.zoomable
      ? html`<button class="sds-btn sds-btn--secondary sds-btn--sm sds-btn--icon sds-slide__zoom" type="button" title="Open the slide" data-theme="${GROUND[this.ground] ?? GROUND.paper}" @click="${this.open}"><sds-icon name="actions-fullscreen"></sds-icon></button>`
      : nothing}`;
  }
}

define('sds-slide', SdsSlide);
