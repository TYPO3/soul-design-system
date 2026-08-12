/* sds-tab-item — one tab, and the content it stands for.

   A tab is a label and a panel, and the pairing is the entire component:

     <sds-tabs><sds-tab-item label="standalone">…</sds-tab-item></sds-tabs>

   Light DOM, so `render()` would replace what was written between the tags: it
   is lifted on connect and handed back as nodes. Which item shows is
   `sds-tabs`'s answer — nothing here reads its own position. */

import { html, type TemplateResult } from 'lit';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

/* Enough to point a tab at its panel and back. A tab and the panel it
   controls have to name each other for a screen reader to follow the pair,
   and neither id is anybody's to write. */
let seq = 0;

export class SdsTabItem extends SdsElement {
  static override properties = {
    label: { type: String, reflect: true },
    /** A glyph before the label. For a tab whose subject has one — a file
        type, a tool — never as decoration on a set that reads fine without. */
    icon: { type: String, reflect: true },
    active: { type: Boolean, reflect: true },
  };

  declare label: string;
  declare icon?: IconId;
  declare active: boolean;

  /** Whether a set of tabs is deciding which panel is shown. A panel decides
      for itself until one is — which is what a panel is on a page where nothing
      switches it, and hiding every one there leaves content in the document and
      invisible in it. The set claims them the moment it exists. */
  managed = false;

  /** The id its tab points at, and the id its tab carries. */
  readonly panelId: string;
  readonly tabId: string;

  private taken: Node[] | null = null;

  constructor() {
    super();
    this.label = '';
    this.active = false;
    seq += 1;
    this.panelId = `sds-tab-panel-${seq}`;
    this.tabId = `sds-tab-${seq}`;
  }

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    /* Hidden rather than unrendered: what is in the other panels stays in the
       document, so a find-in-page reaches it and switching back costs nothing
       — and anything with state in there keeps it. */
    return html`<div class="sds-tab__panel" role="tabpanel" id="${this.panelId}" aria-labelledby="${this.tabId}" ?hidden="${this.managed && !this.active}">${this.taken ?? this.content}</div>`;
  }
}

define('sds-tab-item', SdsTabItem);
