/* What pills, tabs and the rail share.

   The three differ in their wrapper and in the class on an item. Everything
   else — which one is active, what an item is, how they are spaced — is the
   same navigation, so it is written once here and the three name their
   difference.

   Not a component: it registers no tag and is never used directly. */

import { html, type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.ts';

export interface NavProps {
  items: readonly string[];
  active?: number;
}

export abstract class SdsNav extends SdsElement {
  static override properties = {
    items: { type: Array },
    active: { type: Number, reflect: true },
  };

  declare items: string[];
  declare active: number;

  /** The class on the wrapper, e.g. `sds-pills`. */
  protected abstract readonly block: string;
  /** The class on each item, e.g. `sds-pill`. */
  protected abstract readonly item: string;

  constructor() {
    super();
    this.items = [];
    this.active = 0;
  }

  protected items_(): TemplateResult[] {
    return this.items.map(
      (label, i) => html`<span class="${i === this.active ? `${this.item} is-active` : this.item}">${label}</span>`,
    );
  }
}
