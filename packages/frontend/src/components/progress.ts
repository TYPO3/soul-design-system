/* sds-progress — how far a running job has got.

   A share, not a sequence of stops: `sds-steps` says which stage work is at,
   this says how much of it is done. The number stands beside the bar because
   a filled length on its own is a position nobody can read back or report,
   and the note under it is where the work says what it is doing right now.

   Where the share is not known there is nothing to fill: that is
   `.sds-loading` with a spinner, which claims no distance at all. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, isBlank, SdsElement } from '../lib/element.ts';

/** How the position is said. Never `none` where the bar stands on its own —
    the read-out is the only part of it a reader can quote. */
export type ProgressReadout = 'percent' | 'count' | 'none';
export type ProgressSize = 'medium' | 'small';

/* A count cannot be split from what it counts across a line, so the space
   before a unit is a narrow no-break one and the one around "of" is a full
   no-break — the narrow space reads as no space at all between words. */
const NNBSP = '\u202f';
const NBSP = '\u00a0';

export interface ProgressProps {
  /** What the work is, over the bar. Without one the bar is bare — right
      where the surface around it names the job — and it still owes `label`. */
  caption?: string;
  /** What it is called for anything that cannot see what it sits beside. */
  label?: string;
  /** Where it stands, in the same unit as `max`. Set it from outside as the
      work reports; the bar travels to the new width in `--duration-fast`. */
  value?: number;
  /** The whole the value is a part of. */
  max?: number;
  /** `percent` is the share, `count` is the two numbers themselves — "3 of
      12 files", where what is being counted is the useful part. */
  readout?: ProgressReadout;
  /** What the numbers count, said after them in a `count` read-out. */
  unit?: string;
  /** What the work is doing right now. Over 2s this is what has to say why,
      and the same line may be written between the tags where it carries a
      link or a name in mono. */
  note?: string | TemplateResult;
  /** `small` is the bar in a row of other things — the track alone gets
      thinner, and nothing else about it changes. */
  size?: ProgressSize;
  /** That work is happening right now: a hatch travels through the filled
      part while the bar stands still. Off the moment the work stops — one
      travelling at a standstill claims something nobody measured — and off
      when the run is done. */
  pulsing?: boolean;
}

export class SdsProgress extends SdsElement {
  static override properties = {
    caption: { type: String },
    label: { type: String },
    value: { type: Number },
    max: { type: Number },
    readout: { type: String },
    unit: { type: String },
    note: { type: String },
    size: { type: String },
    pulsing: { type: Boolean },
  };

  declare caption: string;
  declare label?: string;
  declare value: number;
  declare max: number;
  declare readout: ProgressReadout;
  declare unit: string;
  declare note: string | TemplateResult;
  declare size: ProgressSize;
  declare pulsing: boolean;

  /* What a caller wrote between the tags, taken before Lit renders over it. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.caption = '';
    this.value = 0;
    this.max = 100;
    this.readout = 'percent';
    this.unit = '';
    this.note = '';
    this.size = 'medium';
    this.pulsing = false;
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  /** The whole, which a caller counting from a total it has not got yet may
      report as zero — and a share of nothing is a division this cannot do. */
  private get whole(): number {
    return this.max > 0 ? this.max : 100;
  }

  /** Where it stands, clamped: work that overruns its own estimate draws a
      full bar, never one running out of its track, and a value that is not a
      number at all is nothing done rather than a bar of `NaN`. */
  private get at(): number {
    if (!Number.isFinite(this.value)) return 0;
    return Math.min(Math.max(this.value, 0), this.whole);
  }

  /** The number a reader is given. Rounded, because a percentage carrying two
      decimals is a measurement and this is a position. */
  private get percent(): number {
    return Math.round((this.at / this.whole) * 100);
  }

  /** What the read-out says, and what a screen reader is given in place of the
      bare number. Empty where the caller asked for no read-out. */
  private said(): string {
    if (this.readout === 'count') {
      return `${this.at}${NBSP}of${NBSP}${this.whole}${this.unit ? `${NNBSP}${this.unit}` : ''}`;
    }
    return this.readout === 'percent' ? `${this.percent}%` : '';
  }

  protected override render(): TemplateResult {
    const said = this.said();
    /* An empty `aria-label` is no name at all — the attribute stays off the
       bar rather than standing there empty, which reads as a name given. */
    const name = this.label || this.caption;
    const note = this.taken ?? this.content ?? (this.note || undefined);
    /* Named rather than interpolated: the size arrives as an attribute, and a
       word this layer does not have would become a class nothing defines. */
    const cls = ['sds-progress'];
    if (this.size === 'small') cls.push('sds-progress--small');
    if (this.pulsing) cls.push('sds-progress--pulsing');
    /* The width as its own property rather than a width in the style: it is
       the one value a surface may want to read, and the fill is drawn from it
       in the stylesheet where every other distance of this component is. */
    const width = `${Math.round((this.at / this.whole) * 10000) / 100}%`;

    return html`<div class="${cls.join(' ')}" style="--sds-progress-at:${width}">
  ${this.caption || said
    ? html`<span class="sds-progress__head">
    <span class="sds-progress__caption">${this.caption}</span>
    ${said ? html`<span class="sds-progress__value">${said}</span>` : nothing}
  </span>`
    : nothing}
  <span
    class="sds-progress__track"
    role="progressbar"
    aria-valuemin="0"
    aria-label="${name || nothing}"
    aria-valuemax="${this.whole}"
    aria-valuenow="${this.at}"
    aria-valuetext="${said || nothing}"
    aria-busy="${this.pulsing ? 'true' : nothing}"
  ><span class="sds-progress__fill"></span></span>
  ${note ? html`<span class="sds-progress__note">${note}</span>` : nothing}
</div>`;
  }
}

define('sds-progress', SdsProgress);
