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

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export type ThemeChoice = 'light' | 'dark';

/** What the button can be standing in, which is one more than a reader can
    choose: the machine's setting is where they start and where the cycle
    returns, and it is a state of its own rather than the absence of one. */
type ThemeState = ThemeChoice | 'machine';
const STATES: readonly ThemeState[] = ['machine', 'light', 'dark'];

/** The mark for each — the one drawn is the state in force. The machine's is
    a device, because what it says is "whatever this screen is set to". */
const GLYPH: Record<ThemeState, IconId> = {
  machine: 'actions-device-desktop',
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

  /** What the reader is reading in, which is not always what they chose. */
  private get inForce(): ThemeChoice {
    return this.current ?? this.machine;
  }

  /** Whether the document has been read yet. Until it has — a page carrying no
      script, or the frame before one runs — the button says only what pressing
      does, which is true in every state; naming a state it has not read would
      be a sentence that is wrong on two pages out of three. */
  #seen = false;

  /* Watching the attribute, not owning it: `soul-boot.js` writes the stored
     choice before the paint, and a second tab changes it too. Read once on
     connect and the switch would show the side the reader is not looking at.
     What it never carries is the machine's setting — an attribute written for
     that is a choice this element cannot tell from one, and the stop it can
     never come back to. */
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
    this.#seen = true;
  }

  /* One press, and it steps to the next of three. The machine's setting is a
     stop on the way round rather than something only a cleared key gives back:
     a control that can reach two of its three states is a control that takes
     the default away from whoever tries it once. */
  private step(): void {
    const at = STATES.indexOf(this.current ?? 'machine');
    const to = STATES[(at + 1) % STATES.length] ?? 'machine';
    const next: ThemeChoice | null = to === 'machine' ? null : to;
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
    const mark = (state: ThemeState): TemplateResult => html`<span
      class="sds-theme__mark sds-theme__mark--${state}"
    ><sds-icon name="${GLYPH[state]}"></sds-icon></span>`;

    /* The sentence a reader who cannot see the mark is given. Where the state
       has been read it names it and where the press goes; where it has not, it
       says only what pressing does — which the `title` says anyway, and which
       is true whichever of the three the page is standing in. */
    const at = STATES.indexOf(this.current ?? 'machine');
    const to = STATES[(at + 1) % STATES.length] ?? 'machine';
    const said: Record<ThemeState, string> = {
      machine: 'the machine’s setting',
      light: 'light',
      dark: 'dark',
    };

    return html`<button
      type="button"
      class="sds-btn sds-btn--ghost sds-btn--icon sds-theme__toggle"
      title="Switch colour mode"
      aria-label="${this.#seen
        ? `Colour mode: ${said[STATES[at] ?? 'machine']}. Switch to ${said[to]}.`
        : nothing}"
      @click="${() => this.step()}"
    >${mark('machine')}${mark('light')}${mark('dark')}</button>`;
  }
}

define('sds-theme', SdsTheme);
