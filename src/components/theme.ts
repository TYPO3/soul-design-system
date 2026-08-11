/* sds-theme — light or dark, as two segments with the chosen one filled.

   The same treatment as an active navigation item, because it is one: a set
   of choices with one of them current. Never a switch and never a moon: a
   switch says on-or-off about a thing that has three states — light, dark, and
   the machine's — and a moon says which mode you are in or which one you would
   get, depending on who is reading it.

   Three states, and the third is the point. A reader who has pressed neither
   follows their machine, and `color-scheme: light dark` with `light-dark()`
   tokens means that costs nothing: the page is already correct before this
   element exists. Pressing one writes `data-theme` on the document and stores
   it; pressing the one that is current gives the machine back.

   The stored choice has to be read before the first paint or the page shows
   the other mode for a frame, and that is a line of script in the document
   head — too early for any element. This reads what that line already wrote.

   Storage is `localStorage` under a key a consumer can name, because two
   surfaces on one origin are two products and should not fight over it. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

export type ThemeChoice = 'light' | 'dark';

/** What `sds-theme-change` carries: the choice, or null for the machine's. */
export interface ThemeChange {
  theme: ThemeChoice | null;
}

/** The line a document runs before its first paint, so a stored choice is in
    place before anything is drawn. Returned as source rather than run here:
    it belongs in the head, and by the time an element exists it is too late.

        <script>${themeBoot()}</script> */
export const themeBoot = (key = 'theme'): string =>
  `var t=localStorage.getItem(${JSON.stringify(key)});if(t){document.documentElement.dataset.theme=t}`;

export class SdsTheme extends SdsElement {
  static override properties = {
    key: { type: String },
    current: { type: String, state: true },
  };

  /** Where the choice is stored. Two products on one origin are two keys. */
  declare key: string;
  declare current: ThemeChoice | null;

  constructor() {
    super();
    this.key = 'theme';
    this.current = null;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    /* What the document already says, which the boot line wrote. Reading the
       element's own idea of it would disagree with the paint. */
    const written = typeof document !== 'undefined' ? document.documentElement.dataset['theme'] : undefined;
    this.current = written === 'light' || written === 'dark' ? written : null;
  }

  private choose(theme: ThemeChoice): void {
    /* Pressing the one that is current gives the machine back. Without this
       there is no way to undo a choice, and the machine's setting — which is
       the default and the one most readers are on — becomes unreachable the
       moment anyone presses anything. */
    const next = this.current === theme ? null : theme;
    this.current = next;

    if (next) {
      document.documentElement.dataset['theme'] = next;
      localStorage.setItem(this.key, next);
    } else {
      delete document.documentElement.dataset['theme'];
      localStorage.removeItem(this.key);
    }

    this.dispatchEvent(
      new CustomEvent<ThemeChange>('sds-theme-change', {
        detail: { theme: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected override render(): TemplateResult {
    const segment = (theme: ThemeChoice): TemplateResult => html`<button
      type="button"
      class="sds-mode${this.current === theme ? ' is-active' : ''}"
      aria-pressed="${this.current === theme}"
      @click="${() => this.choose(theme)}"
    >${theme}</button>`;

    /* A group rather than a radio set: neither being pressed is a state, and
       a radio group has no way to say it. */
    return html`<div class="sds-modes" role="group" aria-label="Colour mode">
  ${segment('light')}
  ${segment('dark')}
</div>`;
  }
}

define('sds-theme', SdsTheme);
