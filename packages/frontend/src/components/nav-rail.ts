/* sds-nav-rail — the 210px navigation rail.

   One entry with its pages under it: the entry's label is the heading over the
   list, and what it holds is the list. Rows are often things the machine named,
   so they set in mono verbatim, and the current one is a filled block in the
   accent, never a tint.

     .entry = { label: 'Components', items: [{ label: 'sds-badge', href: '…' }] }

   A page with pages of its own is a fold, at whatever depth the tree has them.
   It is a `<details>`, so the fold works before any script and the one holding
   the current page starts open. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { lines } from '../lib/template.ts';
import { define, SdsElement } from '../lib/element.ts';
import { branch, navInside, type MenuEntry, type NavChange } from './nav-base.ts';

export class SdsNavRail extends SdsElement {
  static override properties = {
    entry: { type: Object },
    picked: { type: Number, state: true },
  };

  /** What this is the list of, and the list. A rail holding one section of a
      site is that section: its label stands over the pages as the way to the
      section's own page, and an entry with no label has no heading — which is
      right where the rail is the whole navigation there is. */
  declare entry: MenuEntry;

  /** Which row a reader pressed, where the rows are choices rather than links.
      -1 until they have: a list that names its own current page is stating a
      fact about the page, and a press is the only thing allowed to overrule
      it. */
  declare picked: number;

  /** The rows a server wrote between the tags. A renderer that has resolved
      its own tree writes the classes below, so the two shapes are one shape. */
  private taken: Element[] = [];

  constructor() {
    super();
    this.entry = { label: '' };
    this.picked = -1;
  }

  override connectedCallback(): void {
    /* Before Lit renders into this element: after the first render its
       children are its own output. */
    const written = this.lifted().filter((node): node is Element => node.nodeType === 1);
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  /** Every page in the rail, folds flattened: a rail has one current page
      wherever it sits, and a caller thinking in "third item of the second
      group" is thinking about the markup. */
  private flat(): MenuEntry[] {
    return (this.entry.items ?? []).flatMap(branch);
  }

  private isCurrent(entry: MenuEntry): boolean {
    return this.picked >= 0 ? this.flat()[this.picked] === entry : Boolean(entry.current);
  }

  /** One page, and whatever hangs under it.

      A page that holds pages is a row like any other with the marker that
      opens them beside it — the same pair the bar's row draws, so a reader
      meets one shape and not two. What it holds is set in by a step, because
      a list where everything starts on the same edge says nothing about what
      belongs to what. */
  private row(entry: MenuEntry): TemplateResult {
    const under = entry.items ?? [];
    if (!under.length) return this.one(entry);
    const holds = branch(entry).some((page) => this.isCurrent(page));
    return html`<div class="sds-rail__group">
    ${entry.href ? this.one(entry) : html`<span class="sds-rail__item">${entry.label}</span>`}
    <details class="sds-rail__fold" ?open="${Boolean(entry.open) || holds}">
      <summary aria-label="Pages in ${entry.label}"><sds-icon name="actions-chevron-down"></sds-icon></summary>
      ${lines(under.map((page) => this.row(page)), 6)}
    </details>
  </div>`;
  }

  private one(entry: MenuEntry): TemplateResult {
    const current = this.isCurrent(entry);
    const cls = current ? 'sds-rail__item is-active' : 'sds-rail__item';
    const inside = navInside(entry);
    return entry.href
      ? html`<a class="${cls}" href="${entry.href}" aria-current="${current ? 'page' : nothing}">${inside}</a>`
      : html`<button type="button" class="${cls}" aria-current="${current ? 'true' : nothing}" @click="${() => this.pick(entry)}">${inside}</button>`;
  }

  protected override render(): TemplateResult {
    /* A rail is navigation, so it is a `<nav>` and says what it is a
       navigation of — a page can hold this one and the sections in the bar,
       and "navigation, navigation" is what a screen reader announces without
       it. */
    const label = this.entry.label;
    const written = this.taken.length ? this.taken : this.content;
    const under = this.entry.items ?? [];
    /* The folds go last, whatever order the tree put them in: a page is a row
       and a fold is a row with rows under it, so one standing between the
       pages breaks the column a reader is scanning. */
    const rows = written
      ? [written]
      : [
          ...under.filter((page) => !page.items?.length).map((page) => this.row(page)),
          ...under.filter((page) => page.items?.length).map((page) => this.row(page)),
        ];

    /* The heading is the section's own page where it has one — the way a
       footer column's heading is. */
    const here = this.isCurrent(this.entry);
    const head = !label
      ? nothing
      : this.entry.href
        ? html`<a
    class="${here ? 'sds-label sds-rail__heading is-active' : 'sds-label sds-rail__heading'}"
    href="${this.entry.href}"
    aria-current="${here ? 'page' : nothing}"
  >${label}</a>`
        : html`<div class="sds-label">${label}</div>`;

    return html`<nav class="sds-rail" aria-label="${label || 'Pages'}">
  ${head}
  ${lines(rows as TemplateResult[], 2)}
</nav>`;
  }

  /** A row with nowhere to go is a choice: pressing it makes it current and
      says so, for whatever is beside it to follow. */
  private pick(entry: MenuEntry): void {
    const index = this.flat().indexOf(entry);
    if (index < 0 || index === this.picked) return;
    this.picked = index;
    this.dispatchEvent(
      new CustomEvent<NavChange>('sds-change', {
        detail: { index, label: entry.label },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

define('sds-nav-rail', SdsNavRail);
