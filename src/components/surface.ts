/* sds-surface — the three planes, which differ only in fill.

   The system has no shadows, so a plane is told apart by its fill and a
   hairline and by nothing else. A container must not share its corner with
   its contents, which is why `--radius-card` (6px) is one step larger than
   `--radius-control` (4px). Nothing here sets either by hand.

   One element covers all three: they are the same thing at different depths,
   and three tags would invite treating them as three components. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

/** `card` is a hairline and 6px with no fill — the default container.
    `panel` is a raised fill, for when it sits on the canvas and has to read
    as a plane. `sunken` is machine output: code, logs, structured content. */
export type Plane = 'card' | 'panel' | 'sunken';

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
    /* The host is `display: contents`, so it is not in the box tree and
       cannot be sized from outside. Layout for the plane goes here and lands
       on the element that is actually laid out. */
    boxStyle: { type: String, attribute: 'box-style' },
  };

  declare plane: Plane;
  declare label: string;
  declare icon?: IconId;
  declare heading: string;
  declare body: string | TemplateResult;
  declare boxStyle: string;

  constructor() {
    super();
    this.plane = 'card';
    this.label = '';
    this.heading = '';
    this.body = '';
    this.boxStyle = 'flex:1; min-width:200px';
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
    return html`<div class="sds-${this.plane}" style="${this.boxStyle}">
  ${icon}
  ${label}
  <div class="sds-surface-title">${this.heading}</div>
  <div class="sds-surface-body">${this.body}</div>
</div>`;
  }
}

define('sds-surface', SdsSurface);
