/* What pills, tabs and the rail share.

   The three differ in their wrapper and in the class on an item; everything
   else is the same navigation and is written once here.

   An item is a control, not a picture of one — focusable and pressable, and
   pressing it makes it current, announced with `sds-change` so whatever is
   beside it can follow. One that goes somewhere says `href` and is left to the
   browser. Not a component: it registers no tag. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { SdsElement } from '../lib/element.ts';

/** A label; or a label with a glyph, a target, or both. */
export type NavItem = string | { label: string; href?: string; icon?: IconId };

export interface NavProps {
  items: readonly NavItem[];
  active?: number;
}

/** What `sds-change` carries: which item was chosen, by position and by name. */
export interface NavChange {
  index: number;
  label: string;
}

export const navLabel = (item: NavItem): string => (typeof item === 'string' ? item : item.label);
const navHref = (item: NavItem): string | undefined => (typeof item === 'string' ? undefined : item.href);
const navIcon = (item: NavItem): IconId | undefined => (typeof item === 'string' ? undefined : item.icon);

export abstract class SdsNav extends SdsElement {
  static override properties = {
    items: { type: Array },
    active: { type: Number, reflect: true },
  };

  declare items: NavItem[];
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

  /** Make an item current, and say so. Called by the items this renders, and
      by a subclass that has its own reason to move. */
  protected choose(index: number): void {
    if (index === this.active) return;
    this.active = index;
    /* Composed, because a consumer listens on the element and the button that
       was pressed is inside it. The element has already moved; the event says
       what happened rather than asking permission, which is why nothing here
       is cancelable. */
    this.dispatchEvent(
      new CustomEvent<NavChange>('sds-change', {
        detail: { index, label: navLabel(this.items[index] as NavItem) },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** A glyph before the label, where the item asked for one. */
  protected inside_(item: NavItem): TemplateResult {
    const icon = navIcon(item);
    return icon ? html`<sds-icon name="${icon}"></sds-icon>${navLabel(item)}` : html`${navLabel(item)}`;
  }

  /** The class an item carries, active included. */
  protected class_(index: number): string {
    return index === this.active ? `${this.item} is-active` : this.item;
  }

  protected items_(): TemplateResult[] {
    return this.items.map((item, i) => {
      const cls = this.class_(i);
      const current = i === this.active;
      const href = navHref(item);
      const inside = this.inside_(item);
      /* `aria-current` and not `aria-selected` for the two that navigate:
         selection belongs to a tablist, and a tablist owes its panel an
         `aria-controls`. Current-within-a-set is what is true here. */
      return href
        ? html`<a class="${cls}" href="${href}" aria-current="${current ? 'page' : nothing}">${inside}</a>`
        : html`<button type="button" class="${cls}" aria-current="${current ? 'true' : nothing}" @click="${() => this.choose(i)}">${inside}</button>`;
    });
  }
}
