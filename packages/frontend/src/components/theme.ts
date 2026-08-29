/* sds-theme — light or dark, as two segments with the chosen one filled.

   The same treatment as an active navigation item, because it is one. Never a
   switch and never one moon standing for the pair: there are three states, not
   two — light, dark, and the machine's, which is what a reader who has pressed
   neither gets. Pressing the current one gives the machine back.

   Each segment carries its own glyph, and the words go where the row has no
   room for them: a mark is what is left when a label cannot be afforded.

   The stored choice has to be read before the first paint or the page shows the
   other mode for a frame, so a line in the document head does that and this
   reads what it wrote. `localStorage`, under a key a consumer can name. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export type ThemeChoice = 'light' | 'dark';

/** One mark per segment. Not a set of two states in one glyph: each says which
    mode it *is*, so the pair still reads as two things to press. */
const GLYPH: Record<ThemeChoice, IconId> = {
  light: 'actions-brightness-high',
  dark: 'actions-moon',
};

/** What `sds-theme-change` carries: the choice, or null for the machine's. */
export interface ThemeChange {
  theme: ThemeChoice | null;
}

/** The line a document runs before its first paint, so a stored choice is in
    place before anything is drawn. Returned as source rather than run here:
    it belongs in the head, and by the time an element exists it is too late.
    The same default `soul-boot.js` has, both ends reading one name.

        <script>${themeBoot()}</script> */
export const themeBoot = (key = 'soul-theme'): string =>
  `var t=localStorage.getItem(${JSON.stringify(key)});if(t){document.documentElement.dataset.theme=t}`;

export class SdsTheme extends SdsElement {
  static override properties = {
    key: { type: String },
    compact: { type: Boolean, reflect: true },
    current: { type: String, state: true },
  };

  /** Where the choice is stored. Two products on one origin are two keys, and
      the default is `soul-boot.js`'s: what writes the mode before the paint and
      what shows which side is pressed have to read the same name, or the choice
      is made here and looked for somewhere else on the next page. */
  declare key: string;
  /** The words dropped, the glyphs left standing. Set from outside, because
      what has run out of room is the row and not the control — the bar sheds
      these two words before it sheds anything a reader came for. */
  declare compact: boolean;
  declare current: ThemeChoice | null;

  constructor() {
    super();
    this.key = 'soul-theme';
    this.compact = false;
    this.current = null;
  }

  /* Watching the attribute, not owning it: `soul-boot.js` writes it before
     the paint and again when the machine's setting changes, and a second tab
     changes it too. Read once on connect and the switch would show the side
     the reader is not looking at. */
  #watch: MutationObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    if (typeof document === 'undefined') return;
    this.#read();
    this.#watch = new MutationObserver(() => this.#read());
    this.#watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  override disconnectedCallback(): void {
    this.#watch?.disconnect();
    this.#watch = null;
    super.disconnectedCallback();
  }

  /* What the document already says. Reading the element's own idea of it
     would disagree with the paint. */
  #read(): void {
    const written = document.documentElement.dataset['theme'];
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
    /* The word is the name where it is drawn; where it is not, the same word
       is said to a reader who cannot see the mark. */
    const segment = (theme: ThemeChoice): TemplateResult => html`<button
      type="button"
      class="sds-mode${this.current === theme ? ' is-active' : ''}"
      aria-pressed="${this.current === theme}"
      aria-label="${this.compact ? theme : nothing}"
      @click="${() => this.choose(theme)}"
    ><sds-icon name="${GLYPH[theme]}"></sds-icon>${
      this.compact ? '' : html`<span class="sds-mode__label">${theme}</span>`
    }</button>`;

    /* A group rather than a radio set: neither being pressed is a state, and
       a radio group has no way to say it. */
    return html`<div class="sds-modes" role="group" aria-label="Colour mode">
  ${segment('light')}
  ${segment('dark')}
</div>`;
  }
}

define('sds-theme', SdsTheme);
