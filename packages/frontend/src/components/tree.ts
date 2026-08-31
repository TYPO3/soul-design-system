/* sds-tree — a directory, as the shape it has on disk.

   What a document draws as preformatted text with spaces counted by hand, and
   what a project's own page shows of the files it is asking for. Written as a
   nested list, because that is what it is: a name, and what is under it.

   It folds without a script. A `<details>` per directory, so a page rendered on
   a server and served to a reader who runs nothing still opens and closes —
   the reference this was taken from needed a framework's collapse and a second
   icon set for the same. */

import { html, nothing, type TemplateResult } from 'lit';
import { lines } from '../lib/template.ts';
import './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

/** One name in the tree, and whatever is under it. */
export interface TreeEntry {
  /** What it is called. A directory is written with its slash — that is how a
      reader tells an empty one from a file, and the only place it can be said:
      an entry with nothing under it looks the same either way. */
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
  /** How deep it stands open. Nothing is dropped below it: what is deeper is
      folded, which a reader can undo, rather than hidden, which they cannot. */
  level?: number;
  /** Whether a folder and a file are marked as such. Off by default: the fold
      says which is which wherever there is anything to fold, and a wall of
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

  /* The name and whatever stands beside it — one row, whether it folds or not,
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
