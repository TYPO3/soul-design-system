/* sds-rail — the 210px navigation rail.

   Items are often things the machine named, so they set in mono verbatim. The
   active one is a filled block in the accent, never a tint.

     .items = ['overview', { label: 'tools', items: [...] }]

   Data rather than composed elements, unlike the tabs: a group holds links and
   no content of its own. It is a `<details>`, so the fold works before any
   script and the group holding the current item starts open. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { lines } from '../lib/template.ts';
import { define } from '../lib/element.ts';
import { SdsNav, navLabel, type NavItem } from './nav-base.ts';

/** A folded section of a rail. */
export interface RailGroup {
  label: string;
  items: readonly NavItem[];
  /** Open whatever else is true. A group holding the current item opens
      anyway, which is the case that matters and needs no saying. */
  open?: boolean;
}

export type RailEntry = NavItem | RailGroup;

const isGroup = (entry: RailEntry): entry is RailGroup =>
  typeof entry !== 'string' && Array.isArray((entry as RailGroup).items);

export class SdsRail extends SdsNav {
  static override properties = {
    ...SdsNav.properties,
    label: { type: String },
  };

  protected override readonly block = 'sds-rail';
  protected override readonly item = 'sds-rail__item';

  /** What this is the list of, standing over it. A rail holding one section of
      a site says which; a column of ten links with nothing above it does not.
      Left empty there is no heading, which is right where the rail is the whole
      navigation there is. */
  declare label: string;

  /** The items a server wrote between the tags. Same reason as `sds-header`: a
      renderer resolves its own tree, and every one of those answers would have
      to be encoded and worked out again to arrive as `items`. What it writes
      are the classes below, so the two shapes are one shape. */
  private taken: Element[] = [];

  /* `active` counts across the whole rail, groups flattened, because a rail
     has one current item wherever it sits. A caller that thinks in
     "third item of the second group" is thinking about the markup. */
  private flat(): NavItem[] {
    return (this.items as readonly RailEntry[]).flatMap((entry) =>
      isGroup(entry) ? [...entry.items] : [entry],
    );
  }

  constructor() {
    super();
    this.label = '';
  }

  override connectedCallback(): void {
    /* Before Lit renders into this element: after the first render its
       children are its own output. */
    const written = this.lifted().filter((node): node is Element => node.nodeType === 1);
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  /** The heading, where there is one. */
  private heading(): TemplateResult | typeof nothing {
    return this.label ? html`<div class="sds-label">${this.label}</div>` : nothing;
  }

  protected override render(): TemplateResult {
    /* A rail is navigation, so it is a `<nav>` and says what it is a
       navigation of — a page can hold this one and the sections in the bar,
       and "navigation, navigation" is what a screen reader announces without
       it. */
    const written = this.taken.length ? this.taken : this.content;
    if (written) {
      return html`<nav class="${this.block}" aria-label="${this.label || 'Pages'}">
  ${this.heading()}
  ${written}
</nav>`;
    }

    const entries = this.items as readonly RailEntry[];
    if (!entries.some(isGroup)) {
      return html`<nav class="${this.block}" aria-label="${this.label || 'Pages'}">
  ${this.heading()}
  ${lines(this.items_(), 2)}
</nav>`;
    }

    /* One walk, so a group knows which of its items is the current one
       without counting from the outside. */
    let at = 0;
    const rendered = entries.map((entry) => {
      if (!isGroup(entry)) return this.one(entry, at++);
      const from = at;
      const items = entry.items.map((item) => this.one(item, at++));
      const holdsCurrent = this.active >= from && this.active < at;
      /* The marker sits after the label, not before it: a rail is one column of
         rows, and a chevron in front of the heading is the only thing in it that
         starts anywhere else. */
      return html`<details class="sds-rail__group" ?open="${Boolean(entry.open) || holdsCurrent}">
    <summary>${entry.label}<sds-icon name="actions-chevron-down"></sds-icon></summary>
    ${lines(items, 4)}
  </details>`;
    });

    return html`<nav class="${this.block}" aria-label="${this.label || 'Pages'}">
  ${this.heading()}
  ${lines(rendered, 2)}
</nav>`;
  }

  /** One item, at its position in the flattened rail. */
  private one(item: NavItem, index: number): TemplateResult {
    const cls = index === this.active ? `${this.item} is-active` : this.item;
    const href = typeof item === 'string' ? undefined : item.href;
    const inside = this.inside_(item);
    return href
      ? html`<a class="${cls}" href="${href}" aria-current="${index === this.active ? 'page' : nothing}">${inside}</a>`
      : html`<button type="button" class="${cls}" aria-current="${index === this.active ? 'true' : nothing}" @click="${() => this.pick(index)}">${inside}</button>`;
  }

  /* `choose` is the base's, and it reads the label out of `items` — which for
     a grouped rail is the entries and not the items. Flattened first, so the
     event says the name of the thing that was pressed. */
  private pick(index: number): void {
    const flat = this.flat();
    if (index === this.active) return;
    this.active = index;
    this.dispatchEvent(
      new CustomEvent('sds-change', {
        detail: { index, label: navLabel(flat[index] as NavItem) },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

define('sds-rail', SdsRail);
