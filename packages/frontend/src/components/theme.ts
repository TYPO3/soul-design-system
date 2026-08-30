/* sds-theme — the mode the page is in, as one press that changes it.

   A state a reader flips rather than a choice they pick from a list, so it is
   the system's own icon button and not a control this file invents: square,
   ghost, and carrying its sentence in `title` — which is the accessible name
   and the words under the pointer, both from the one attribute.

   The mark is the mode the page is *in*, and the sentence is what pressing
   will do. Two marks are drawn and one is faded out, so a press confirms the
   change that just happened rather than moving anything.

   The stored choice has to be read before the first paint or the page shows the
   other mode for a frame, so a line in the document head does that and this
   reads what it wrote. `localStorage`, under a key a consumer can name. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export type ThemeChoice = 'light' | 'dark';

/** The mark for each mode — the one drawn is the mode in force. */
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
    current: { type: String, state: true },
    machine: { type: String, state: true },
  };

  /** Where the choice is stored. Two products on one origin are two keys, and
      the default is `soul-boot.js`'s: what writes the mode before the paint and
      what shows which side is pressed have to read the same name, or the choice
      is made here and looked for somewhere else on the next page. */
  declare key: string;
  /** What the reader chose, or null while they have chosen nothing and the
      machine's setting is what they are reading in. */
  declare current: ThemeChoice | null;
  /** What the machine asks for, watched: it is the mode in force until a
      press, and a button drawn against the wrong one is a button that lies
      about the page it is standing on. */
  declare machine: ThemeChoice;

  constructor() {
    super();
    this.key = 'soul-theme';
    this.current = null;
    this.machine = 'light';
  }

  /** The mode actually in force, which is what the mark shows. */
  private get inForce(): ThemeChoice {
    return this.current ?? this.machine;
  }

  /* Watching the attribute, not owning it: `soul-boot.js` writes it before
     the paint and again when the machine's setting changes, and a second tab
     changes it too. Read once on connect and the switch would show the side
     the reader is not looking at. */
  #watch: MutationObserver | null = null;

  #dark: MediaQueryList | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    if (typeof document === 'undefined') return;
    this.#read();
    this.#watch = new MutationObserver(() => this.#read());
    this.#watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    this.#dark = matchMedia('(prefers-color-scheme: dark)');
    this.#machine();
    this.#dark.addEventListener('change', this.#machine);
  }

  override disconnectedCallback(): void {
    this.#dark?.removeEventListener('change', this.#machine);
    this.#dark = null;
    this.#watch?.disconnect();
    this.#watch = null;
    super.disconnectedCallback();
  }

  #machine = (): void => {
    this.machine = this.#dark?.matches ? 'dark' : 'light';
  };

  /* What the document already says. Reading the element's own idea of it
     would disagree with the paint. */
  #read(): void {
    const written = document.documentElement.dataset['theme'];
    this.current = written === 'light' || written === 'dark' ? written : null;
  }

  /* One press, and it lands on the other mode explicitly. The machine's own
     setting is what a reader has until they press — after that the page is
     theirs, and `localStorage.removeItem` under the same key is what gives the
     machine back to anyone who clears it. */
  private flip(): void {
    const next: ThemeChoice = this.inForce === 'dark' ? 'light' : 'dark';
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
    /* Both marks are drawn and the stylesheet fades one out against the mode
       the document is in — not this element's idea of it. A page that runs no
       script is the case that decides: rendered from state, the button draws
       whatever the constructor happened to hold, and on a prerendered dark
       page that is a sun. From the document, it is right before anything runs.

       So the sentence cannot name a mode either, and does not: it says what
       pressing does, the mark says where you are, and neither needs a script
       to be true. The `title` is the whole accessible name of an icon-only
       button, and the words the pointer reveals.

       Each mark is a span around the glyph rather than the glyph itself: an
       icon is inlined on the way out and what stands in the page is the
       `<svg>` it drew, so a class on the element is one the page never sees. */
    const mark = (theme: ThemeChoice): TemplateResult => html`<span
      class="sds-theme__mark sds-theme__mark--${theme}"
    ><sds-icon name="${GLYPH[theme]}"></sds-icon></span>`;

    return html`<button
      type="button"
      class="sds-btn sds-btn--ghost sds-btn--icon sds-theme__toggle"
      title="Switch colour mode"
      @click="${() => this.flip()}"
    >${mark('light')}${mark('dark')}</button>`;
  }
}

define('sds-theme', SdsTheme);
