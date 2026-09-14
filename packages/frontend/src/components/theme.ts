/* sds-theme — the mode the page is in, as one press that changes it.

   A state a reader flips, not a choice from a list. So it is the system's own
   icon button, not a control this file invents: square, ghost, with its
   sentence in `title`. That attribute is the accessible name and the tooltip
   in one.

   The mark is the mode the page is *in*, and the sentence is what a press
   will do. Both marks render and one fades out, so a press confirms the
   change that just happened and moves nothing.

   The stored choice must load before the first paint, or the page shows the
   other mode for a frame. A line in the document head does that, and this
   reads what it wrote: `localStorage`, under a key a consumer can name. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export type ThemeChoice = 'light' | 'dark';

/** The states of the button, which are one more than a reader can choose.
    The machine's setting is where they start and where the cycle returns.
    It is a state of its own rather than the absence of one. */
type ThemeState = ThemeChoice | 'machine';
const STATES: readonly ThemeState[] = ['machine', 'light', 'dark'];

/** The mark for each — the visible one is the state in force. The machine's
    is a device, because what it says is "whatever this screen uses". */
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
    place before anything renders. Returned as source rather than run here:
    it belongs in the head, and by the time an element exists it is too late.
    The same default `soul-boot.js` has, so both ends read one name.

        <script>${themeBoot()}</script> */
export const themeBoot = (key = 'soul-theme'): string =>
  `var t=localStorage.getItem(${JSON.stringify(key)});if(t){document.documentElement.dataset.theme=t}`;

export class SdsTheme extends SdsElement {
  static override properties = {
    key: { type: String },
    current: { type: String, state: true },
    machine: { type: String, state: true },
  };

  /** Where the choice lives. Two products on one origin are two keys, and the
      default is the one `soul-boot.js` has. The boot line and this button
      must read the same name, or the next page looks for the choice
      somewhere else. */
  declare key: string;
  /** What the reader chose, or null while they have chosen nothing and read
      in the machine's setting. */
  declare current: ThemeChoice | null;
  /** What the machine asks for, watched. It is the mode in force until a
      press, and a button drawn against the wrong one lies about its page. */
  declare machine: ThemeChoice;

  constructor() {
    super();
    this.key = 'soul-theme';
    this.current = null;
    this.machine = 'light';
  }

  /** What the reader reads in, which is not always what they chose. */
  private get inForce(): ThemeChoice {
    return this.current ?? this.machine;
  }

  /** If this element has read the document yet. Until it has — a page with no
      script, or the frame before one runs — the button says only what a press
      does. That is true in every state. A state it has not read is a
      sentence that is wrong on two pages out of three. */
  #seen = false;

  /* Watches the attribute, does not own it. `soul-boot.js` writes the stored
     choice before the paint, and a second tab changes it too. Read once on
     connect, the switch shows the wrong side. The attribute never carries
     the machine's setting. An attribute for that is a choice this element
     cannot tell from one, and a stop with no way back. */
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

  /* What the document already says. The element's own idea of it disagrees
     with the paint. */
  #read(): void {
    const written = document.documentElement.dataset['theme'];
    this.current = written === 'light' || written === 'dark' ? written : null;
    this.#seen = true;
  }

  /* One press, and it steps to the next of three. The machine's setting is a
     stop on the way round, not something only a cleared key gives back. A
     control that reaches two of its three states takes the default away from
     whoever tries it once. */
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
    /* Both marks render and the stylesheet fades one out against the mode
       the document is in — not this element's idea of it. A page that runs no
       script is the case that decides. Rendered from state, the button draws
       whatever the constructor holds, and on a prerendered dark page that is
       a sun. From the document, it is right before anything runs.

       So the sentence names no mode either. It says what a press does, the
       mark says where you are, and neither needs a script to be true. The
       `title` is the whole accessible name of an icon-only button, and the
       words under the pointer.

       Each mark is a span around the glyph rather than the glyph itself. An
       icon inlines on the way out and the page holds the `<svg>` it drew. So
       a class on the element is one the page never sees. */
    const mark = (state: ThemeState): TemplateResult => html`<span
      class="sds-theme__mark sds-theme__mark--${state}"
    ><sds-icon name="${GLYPH[state]}"></sds-icon></span>`;

    /* The sentence for a reader who cannot see the mark. With the state
       read, it names it and where the press goes. Without, it says only
       what a press does — which the `title` says anyway, and which is true
       in all three states. */
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
