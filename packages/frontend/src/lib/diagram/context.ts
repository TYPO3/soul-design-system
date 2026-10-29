/* What every layout shares: where it draws, what it returns, and the one
   emphasis a drawing can spend. */

import { CLAIM, type Claim } from './paint.ts';

/** The band a layout draws in: its left edge, its top and its width. It
    chooses its own height and returns it. */
export interface Room {
  x: number;
  y: number;
  width: number;
}

export interface Drawn {
  svg: string;
  height: number;
  /** Where a drawing needs more than its room: the width it took. */
  width?: number;
}

/** A part that is not there: `absent` is not there or not yet reachable,
    `degraded` is there in a lesser form. Both draw as a dashed outline. */
export type State = 'present' | 'absent' | 'degraded';

export class Context {
  readonly name: string;
  readonly claim: string;
  /** The drawing is for a slide's room: every layout sets its controls,
      rows and gaps tighter, and its type at the same sizes. */
  readonly dense: boolean;
  /** The share of its stated height a screen of a sketch takes. A slide
      lowers it where the drawing is too tall for the room. */
  squeeze = 1;
  private spent = '';
  private kind = '';
  /** A part of a composed drawing whose legend a later part repeats draws none. */
  legend = true;
  /** The box of each control with an id, where the drawing last set it: the ends of a join. */
  readonly places = new Map<string, { x: number; y: number; width: number; height: number }>();

  constructor(name: string, claim: Claim = 'accent', dense = false) {
    this.name = name;
    this.claim = CLAIM[claim];
    this.dense = dense;
  }

  /** The page's metric, or the slide's where the drawing is dense. */
  pick<T>(page: T, slide: T): T {
    return this.dense ? slide : page;
  }

  /** The claim colour, for the one part the drawing is about, or for
      peers of one kind that make the same claim. A part of another kind
      that asks for it is an error, because two claims are two drawings. */
  emphasis(kind: string, what: string): string {
    if (this.spent && this.kind !== kind) throw new Error(`${this.name}: ${what} is a second emphasis after ${this.spent} — one claim: one part, or peers of one kind`);
    if (!this.spent) [this.spent, this.kind] = [what, kind];
    return this.claim;
  }

  /** One way to draw. A refusal takes back the claim it spent, so the next
      way starts where this one did. */
  attempt<T>(way: () => T): T {
    const [spent, kind] = [this.spent, this.kind];
    try {
      return way();
    } catch (error) {
      [this.spent, this.kind] = [spent, kind];
      throw error;
    }
  }

  fail(message: string): never {
    throw new Error(`${this.name}: ${message}`);
  }
}
