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

/** What a slide is in the run of a deck. `cover` and `closing` hold the title
    up and the lockup down, and `section` holds the outline down. `statement`
    centres one sentence, and `content` keeps its title at the top margin. */
export type SlideKind = 'cover' | 'section' | 'statement' | 'content' | 'closing';

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
};

const GROUND: Record<SlideGround, string> = { paper: 'light', terminal: 'dark' };

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
  /** What the slide shows between its title and its foot. Markup where a
      caller holds it: the elements of the system at the page's size. */
  body?: string | TemplateResult;
  /** If the frame scales to the room it has. The room is the width its
      parent gives it and the height from there to the bottom of the window.
      Unset, it draws at the size the stylesheet states: a 1920 × 1080
      viewport. */
  fit?: boolean;
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
    body: { type: String },
    fit: { type: Boolean, reflect: true },
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
  declare body: string | TemplateResult;
  declare fit: boolean;
  declare zoom: number;

  private watch?: ResizeObserver;

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
    this.body = '';
    this.fit = false;
    this.zoom = 0;
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
    if (!this.fit) return;
    /* The room is the parent's width and the window's height. Measured off
       the frame itself it reads back its own answer and never moves. And a
       frame taller than the window is a slide nobody sees whole. */
    this.watch = new ResizeObserver(() => this.decide());
    if (this.parentElement) this.watch.observe(this.parentElement);
    this.watch.observe(document.documentElement);
    void this.updateComplete.then(() => this.decide());
  }

  override disconnectedCallback(): void {
    this.watch?.disconnect();
    super.disconnectedCallback();
  }

  /** How far to scale the frame so it fits. The frame's size comes off the
      stylesheet, never a copy here. `--sds-slide-width` and its height are
      the set's, and a copy in TypeScript is the copy that goes stale. */
  private decide(): void {
    const box = this.firstElementChild as HTMLElement | null;
    if (!box || !this.fit) return;
    const style = getComputedStyle(box);
    const width = parseFloat(style.getPropertyValue('--sds-slide-width'));
    const height = parseFloat(style.getPropertyValue('--sds-slide-height'));
    const parent = this.parentElement;
    if (!parent) return;
    /* The parent's content box, not its border box: a stage with padding
       gives the frame the air it asked for. */
    const rect = parent.getBoundingClientRect();
    const around = getComputedStyle(parent);
    const room = rect.width - parseFloat(around.paddingLeft) - parseFloat(around.paddingRight);
    const tall = window.innerHeight - Math.max(0, rect.top + parseFloat(around.paddingTop)) - parseFloat(around.paddingBottom);
    if (!(width > 0) || !(height > 0) || !(room > 0) || !(tall > 0)) return;
    this.zoom = Math.min(room / width, tall / height);
  }

  /* The title's step follows the kind. The display step stands alone on a
     slide that says one thing. A content slide's title shares the frame
     with a body and takes the h2 step. Both are the page's own registers. */
  private head(): TemplateResult | typeof nothing {
    if (!this.eyebrow && !this.heading && !this.lead) return nothing;
    const display = this.kind !== 'content';
    return html`<div class="sds-slide__head">
    ${this.eyebrow ? html`<sds-eyebrow label="${this.eyebrow}"></sds-eyebrow>` : nothing}
    ${this.heading
      ? display
        ? html`<h1 class="sds-display">${this.heading}</h1>`
        : html`<h2 class="sds-h2">${this.heading}</h2>`
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

  protected override render(): TemplateResult {
    const body = this.taken ?? this.content ?? this.body;
    /* A style rather than a property of the set, because it is a measurement
       and not a value anybody states. */
    const zoom = this.zoom > 0 ? `zoom:${this.zoom}` : nothing;
    return html`<div class="sds-slide${KIND[this.kind] ? ` ${KIND[this.kind]}` : ''}" data-theme="${GROUND[this.ground] ?? GROUND.paper}" style="${zoom}">
  ${this.head()}
  ${body ? html`<div class="sds-slide__body">${body}</div>` : nothing}
  ${this.outline()}
  ${this.foot()}
</div>`;
  }
}

define('sds-slide', SdsSlide);
