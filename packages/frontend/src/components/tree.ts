/* sds-tree — a directory, as the shape it has on disk.

   What a document draws as preformatted text with hand-counted spaces, and
   what a project's own page shows of the files it asks for. Written as a
   nested list, because that is what it is: a name, and what is under it.

   It folds without a script. A `<details>` per directory, so a page from a
   server still opens and closes for a reader who runs nothing. */

import { html, nothing, type TemplateResult } from 'lit';
import { lines } from '../lib/template.ts';
import './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

/** One name in the tree, and whatever is under it. */
export interface TreeEntry {
  /** Its name. A directory carries its slash. That is how a reader tells an
      empty one from a file, and the only place to say it. An entry with
      nothing under it looks the same either way. */
  label: string;
  /** What it is for, beside the name. The annotation a tree drawn as text
      lines up with spaces, and the reason those trees go stale. */
  note?: string;
  /** What is under it. Nothing, and it is a leaf. */
  items?: readonly TreeEntry[];
}

export interface TreeProps {
  /** The tree, set from script — being a list, and a nested one. */
  entries?: readonly TreeEntry[];
  /** How deep it stands open. Nothing below it goes: what is deeper folds,
      which a reader can undo, rather than hides, which they cannot. */
  level?: number;
  /** If a folder and a file carry a mark that says so. Off by default. The
      fold says which is which wherever there is anything to fold. A wall of
      glyphs down the left of a short tree is decoration. */
  icons?: boolean;
}

export class SdsTree extends SdsElement {
  static override properties = {
    entries: { type: Array },
    level: { type: Number, reflect: true },
    icons: { type: Boolean, reflect: true },
  };

  declare entries: readonly TreeEntry[];
  declare level: number;
  declare icons: boolean;

  constructor() {
    super();
    this.entries = [];
    this.level = 2;
    this.icons = false;
  }

  /* The glyph for what a row is, where a caller asked for them. */
  private glyph(branch: boolean): TemplateResult | typeof nothing {
    if (!this.icons) return nothing;
    return html`<sds-icon class="sds-tree__glyph" name="${branch ? 'actions-folder' : 'actions-file'}"></sds-icon>`;
  }

  /* The name and whatever stands beside it — one row, with a fold or without,
     so a leaf's name begins where a directory's does. */
  private said(entry: TreeEntry, branch: boolean): TemplateResult {
    return html`<span class="sds-tree__mark">${
      branch ? html`<sds-icon name="actions-chevron-down"></sds-icon>` : nothing
    }</span>${this.glyph(branch)}<span class="sds-tree__name">${entry.label}</span>${
      entry.note ? html`<span class="sds-tree__note">${entry.note}</span>` : nothing
    }`;
  }

  private row(entry: TreeEntry, depth: number): TemplateResult {
    const under = entry.items ?? [];
    if (!under.length) {
      return html`<li class="sds-tree__item">
  <span class="sds-tree__row">${this.said(entry, false)}</span>
</li>`;
    }
    /* Open down to the level asked for and folded below it. `<details>` is the
       whole mechanism: the state is the element's, the press is the platform's,
       and a page that runs nothing still folds. */
    return html`<li class="sds-tree__item">
  <details class="sds-tree__fold" ?open="${depth < this.level}">
    <summary class="sds-tree__row">${this.said(entry, true)}</summary>
    ${this.list(under, depth + 1)}
  </details>
</li>`;
  }

  private list(entries: readonly TreeEntry[], depth: number): TemplateResult {
    return html`<ul class="sds-tree__list">
  ${lines(entries.map((entry) => this.row(entry, depth)), 2)}
</ul>`;
  }

  protected override render(): TemplateResult {
    return html`<div class="sds-tree">
  ${this.list(this.entries, 0)}
</div>`;
  }
}

define('sds-tree', SdsTree);
