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

/**
 * One entry of a navigation — the whole contract, for every navigation in the
 * system.
 *
 * A bar, a rail, a trail, a row of pills and the columns of a footer are the
 * same list read at different sizes, so they are given the same entry: where it
 * goes, what is under it, and what is true of it on the page being rendered.
 * Whoever renders the page knows all of that; a component works none of it out,
 * and a second shape for the same list is a second place to keep in step.
 */
export interface MenuEntry {
  label: string;
  /** Where it goes. An entry with none is a choice rather than a way out —
      pressing it moves the set it is in and says so with `sds-change`. */
  href?: string;
  icon?: IconId;
  /** Somebody else's site: it opens away, and is never the current entry. */
  external?: boolean;
  /** The page — or the item — the reader is on. */
  current?: boolean;
  /** On the way to it: an entry the current one sits under. */
  here?: boolean;
  /** A front door: it stands in the bar's row as well as in its menu. Which of
      a site's sections those are is the one thing a tree cannot say. */
  front?: boolean;
  /** A fold that starts open whatever else is true. One holding the current
      entry opens anyway, which is the case that matters and needs no saying. */
  open?: boolean;
  items?: readonly MenuEntry[];
}

/** An entry, or the label alone where that is all there is — what a story
    writes when the set is a row of words. */
export type NavItem = string | MenuEntry;

export interface NavProps {
  items: readonly NavItem[];
  active?: number;
}

/** What `sds-change` carries: which item was chosen, by position and by name. */
export interface NavChange {
  index: number;
  label: string;
}

/** The entry behind either shape. */
export const asEntry = (item: NavItem): MenuEntry => (typeof item === 'string' ? { label: item } : item);
/** An entry and everything under it, in reading order. */
export const branch = (entry: MenuEntry): MenuEntry[] => [entry, ...(entry.items ?? []).flatMap(branch)];

export const navLabel = (item: NavItem): string => asEntry(item).label;
/** A glyph before the label, where the item asked for one. */
export const navInside = (item: NavItem): TemplateResult => {
  const { icon, label } = asEntry(item);
  return icon ? html`<sds-icon name="${icon}"></sds-icon>${label}` : html`${label}`;
};
const navHref = (item: NavItem): string | undefined => asEntry(item).href;

export abstract class SdsNav extends SdsElement {
  static override properties = {
    items: { type: Array },
    active: { type: Number, reflect: true },
  };

  /** The entries, each a label or an entry that carries its own target, glyph
      and children. A bar handed a `menu` builds these from it instead. */
  declare items: NavItem[];
  /** Which entry is the current one, by position. The navigation says where
      the reader is; it does not find out on its own, except `sds-nav-toc`. */
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
    return navInside(item);
  }

  /** Which entry is the current one: the entry that says so, and `active`
      where none does. Data wins — a list naming the page it is on is stating a
      fact, while `active` is a position in a set, and believing both at once
      is how two items come out marked. */
  protected at(): number {
    const named = this.items.findIndex((item) => asEntry(item).current);
    return named >= 0 ? named : this.active;
  }

  /** The class an item carries, active included. An entry the current one sits
      under is marked too: a section is where the reader is, without being the
      page they are on. */
  protected class_(index: number): string {
    const here = index === this.at() || Boolean(asEntry(this.items[index] as NavItem).here);
    return here ? `${this.item} is-active` : this.item;
  }

  protected items_(): TemplateResult[] {
    const at = this.at();
    return this.items.map((item, i) => {
      const cls = this.class_(i);
      const current = i === at;
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
