/* sds-surface — a plane holding a statement.

   The system has no shadows, so a plane is told apart by its fill and a
   hairline and by nothing else. A container must not share its corner with
   its contents, which is why `--radius-card` (6px) is one step larger than
   `--radius-control` (4px). Nothing here sets either by hand.

   All three planes are its answers, the unfilled one included: what tells
   this element from `sds-card` is not the box but where it goes — a card is
   a way into something, a surface stays and states. One box, one owner. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { define, isBlank, SdsElement } from '../lib/element.ts';

/** `raised` sits on the canvas and has to read as a plane. `sunken` is machine
    output: code, logs, structured content. `plain` is the hairline with no
    fill, for a statement that stands on the canvas without leaving it. The
    filled two are named for their fill — the tokens are `--surface-raised`
    and `--surface-sunken` — rather than for the box, which is the same box. */
export type Plane = 'plain' | 'raised' | 'sunken';

/** The class each plane is. `raised` writes `sds-panel`, which is the name the
    class layer has always had for that fill and which a template writes by
    hand — see the theme's sidebar. Renaming it would move one name into two
    places to make a second name agree with a token. */
const PLANE: Record<Plane, string> = {
  plain: 'sds-plane',
  raised: 'sds-panel',
  sunken: 'sds-sunken',
};

export interface SurfaceProps {
  plane?: Plane;
  title: string;
  body: string | TemplateResult;
  style?: string;
  /** The tracked-out line over the title, where a set of these is numbered or
      named as a set — `AUDIENCE 01`, `SOURCE`, `STEP 02`. */
  label?: string;
  /** A glyph above the label, where a set of cards is told apart before it is
      read. It stands beside the card's own title, never alone. */
  icon?: IconId;
}

export class SdsSurface extends SdsElement {
  static override properties = {
    plane: { type: String, reflect: true },
    label: { type: String },
    icon: { type: String },
    heading: { type: String },
    body: { type: String },
    /* Layout for the plane itself, which is the box that draws the frame — a
       style on the element sizes the block around it instead. */
    boxStyle: { type: String, attribute: 'box-style' },
  };

  declare plane: Plane;
  declare label: string;
  declare icon?: IconId;
  declare heading: string;
  declare body: string | TemplateResult;
  declare boxStyle: string;

  /* The statement, where it was written between the tags. A plane on a product
     surface holds a sentence somebody composed, which fits in a property; one
     in a document holds whatever the passage was — paragraphs, a list, a block
     of its own — and that is markup or it is nothing. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.plane = 'raised';
    this.label = '';
    this.heading = '';
    this.body = '';
    this.boxStyle = '';
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    /* Over the title rather than in it: a set of cards that is numbered or
       sourced says so in the label register, and a title that carries the
       number reads as part of the sentence. */
    const label = this.label ? html`<div class="sds-label">${this.label}</div>` : undefined;
    /* Above the label rather than beside the title: a glyph on the title's
       line competes with it for the start of the card, and a set of cards is
       scanned down its left edge. */
    const icon = this.icon
      ? html`<div class="sds-surface-icon"><sds-icon name="${this.icon}" size="20"></sds-icon></div>`
      : undefined;
    return html`<div class="${PLANE[this.plane] ?? PLANE.raised}" style="${this.boxStyle || nothing}">
  ${icon}
  ${label}
  <div class="sds-surface-title">${this.heading}</div>
  <div class="sds-surface-body">${this.taken ?? this.content ?? this.body}</div>
</div>`;
  }
}

define('sds-surface', SdsSurface);
