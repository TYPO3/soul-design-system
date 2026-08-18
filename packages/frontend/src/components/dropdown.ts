/* sds-dropdown — a button, and the short list it opens under itself.

   What is in the list decides what the list is. Entries that carry a target
   are pages, so they are links in a disclosure and Tab walks them too; entries
   that carry none are commands, so they are a menu. The arrows open the panel
   and walk it either way — what the two kinds differ in is the announcement,
   and announcing menu commands over a list of pages is a promise the panel
   cannot keep.

   The panel is a popover, so the top layer holds it: no ancestor's overflow
   clips it and nothing on the page can be stacked over it. Opening, light
   dismiss, Escape and the focus going back to the button are the platform's
   too. Placement is the one part that is not — where the engine has anchor
   positioning the stylesheet does it, and where it has not this places it.

   The button is written from `buttonClass` rather than as `<sds-button>`: what
   a dropdown says about itself — expanded, and what it controls — belongs on
   the `<button>`, and an attribute set on a custom element never reaches it.
   That is what those exports are for. */

import { html, nothing, type TemplateResult } from 'lit';
import { lines } from '../lib/template.ts';
import { define, SdsElement } from '../lib/element.ts';
import { anchored, place } from '../lib/flyout.ts';
import { buttonClass, buttonLabel } from './button.ts';
import './icon.ts';
import { type IconId } from './icon.ts';

/** One entry of the list. */
export interface DropdownChoice {
  /** What it is called, which is the whole of what a reader picks by. */
  label: string;
  /** Where it goes. An entry that has one is a page and becomes a link; an
      entry with none is a command and reports itself instead. */
  href?: string;
  /** A glyph before the label, where the entry asked for one. */
  icon?: IconId;
  /** The one the reader is on, or the setting that is in force. */
  current?: boolean;
  /** Present but not available — said to everyone, never drawn alone. */
  disabled?: boolean;
  /** Its own language, for an entry naming one: a reader is told "Deutsch" in
      German rather than in the voice the page is set in. */
  lang?: string;
  /** Opened away from this page, which is said rather than only styled. */
  external?: boolean;
}

/** What `sds-dropdown-choose` carries: the entry, and where it sits. */
export interface DropdownChosen {
  choice: DropdownChoice;
  index: number;
}

export interface DropdownProps {
  /** What the button says. A dropdown whose entries are settings names the
      setting rather than the value, and lets `current` mark the one in force. */
  label?: string;
  /** What the control is called, where the label is too short to say it — a
      language code standing in for "Language". It is said in front of the
      label rather than instead of it: an accessible name that drops the word a
      reader can see is a name they cannot ask for by voice. */
  name?: string;
  /** The entries, in the order they are read. */
  choices?: readonly DropdownChoice[];
  /** Which side the panel hangs from. `end` where the button is at the end of
      a row, so the list opens back over the row rather than off the page. */
  align?: 'start' | 'end';
  /** The button's own variant, passed through — the trigger is a real button of
      this system and not a second kind of control that looks like one. */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** The button's size, passed through the same way. */
  size?: 'md' | 'sm' | 'lg';
  /** The label is dropped and the glyph stands alone, which then requires
      `title` on the button — so the accessible name is `label` either way. */
  iconOnly?: boolean;
  /** A glyph on the button itself. */
  icon?: IconId;
}

/** Distinct ids per instance: the button names the panel it opens, and two
    dropdowns on one page must not both call it `sds-dropdown-panel`. */
let seq = 0;

export class SdsDropdown extends SdsElement {
  static override properties = {
    label: { type: String },
    name: { type: String },
    choices: { type: Array },
    align: { type: String, reflect: true },
    variant: { type: String },
    size: { type: String },
    iconOnly: { type: Boolean, attribute: 'icon-only' },
    icon: { type: String },
    open: { type: Boolean, state: true },
  };

  declare label: string;
  declare name: string;
  declare choices: readonly DropdownChoice[];
  declare align: 'start' | 'end';
  declare variant: 'primary' | 'secondary' | 'ghost';
  declare size: 'md' | 'sm' | 'lg';
  declare iconOnly: boolean;
  declare icon?: IconId;
  declare open: boolean;

  private readonly panelId = `sds-dropdown-panel-${++seq}`;
  /** The anchor this panel is placed against, named per instance. One name
      shared by every dropdown on a page resolves to whichever one the browser
      met last, so each states its own and reads only that. */
  private readonly anchor = `--${this.panelId}`;
  /** What stops the placement this element made, where it made one. */
  private following?: () => void;

  constructor() {
    super();
    this.label = '';
    this.name = '';
    this.choices = [];
    this.align = 'start';
    this.variant = 'secondary';
    this.size = 'md';
    this.iconOnly = false;
    this.open = false;
  }

  override disconnectedCallback(): void {
    this.following?.();
    this.following = undefined;
    super.disconnectedCallback();
  }

  private get panel(): HTMLElement | null {
    return this.querySelector<HTMLElement>('.sds-dropdown__panel');
  }

  private get button(): HTMLElement | null {
    return this.querySelector<HTMLElement>('.sds-dropdown__button');
  }

  /** What the browser did, read back rather than assumed. Light dismiss and
      Escape are the platform's here, so a press outside or a key this element
      never saw still arrives as a state change — and `aria-expanded`, the
      marker and the placement all follow this one event. */
  private readonly onToggle = (event: Event): void => {
    this.open = (event as ToggleEvent).newState === 'open';
    this.following?.();
    this.following = undefined;
    if (this.open && !anchored() && this.panel && this.button) {
      this.following = place(this.panel, this.button, this.align, '--sds-dropdown-panel-gap');
    }
  };

  /** The whole name, with the label still in it. Dropping the visible word
      would leave a control nobody can ask for by the name they can see. */
  private get called(): string {
    return this.name && this.label ? `${this.name}: ${this.label}` : this.name || this.label;
  }

  /** Pages or commands. Asked of the entries rather than declared, because a
      caller who has to say which one it is can say the wrong one. */
  private get commands(): boolean {
    return this.choices.length > 0 && this.choices.every((choice) => !choice.href);
  }

  /** The rows a key can move between: what is drawn and not disabled. */
  private rows(): HTMLElement[] {
    return [...this.querySelectorAll<HTMLElement>('.sds-dropdown__item:not([aria-disabled="true"])')];
  }

  private onKey(event: KeyboardEvent): void {
    /* The browser closes the popover and puts the focus back on the button
       that opened it. What is left to do is keep the key here: a dropdown
       inside the bar would otherwise close the drawer around it in the same
       press, and a reader who asked for one thing would lose two. */
    if (event.key === 'Escape') {
      if (this.open) event.stopPropagation();
      return;
    }

    /* Both kinds, though only one is a menu: a reader standing on the button
       presses down before they try anything else, and a panel that answers
       that in one list and not in the other is a control they have to learn
       twice. The keys are taken from the page only where this acts on them. */
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const rows = this.rows();
    if (!rows.length) return;
    event.preventDefault();
    /* Opening with a key steps into the list in the same breath, from the end
       the key came from. */
    if (!this.open) {
      this.panel?.showPopover();
      const first = event.key === 'ArrowUp' || event.key === 'End';
      void this.updateComplete.then(() => {
        const now = this.rows();
        (first ? now[now.length - 1] : now[0])?.focus();
      });
      return;
    }
    const from = event.target as HTMLElement | null;
    const at = from ? rows.indexOf(from) : -1;
    const to =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? rows.length - 1
          : /* Stops at the ends rather than wrapping: a list that starts over at
               the bottom hides how long it was from whoever cannot see it. */
            Math.min(rows.length - 1, Math.max(0, at + (event.key === 'ArrowDown' ? 1 : -1)));
    rows[to]?.focus();
  }

  /** What a press reports, and what it does not do. An entry with a target is
      a link and stays one — the event is said beside the navigation rather than
      instead of it, so a page that never listens still works. Preventing the
      event is how an app takes the navigation over. */
  private choose(choice: DropdownChoice, index: number, event: Event): void {
    if (choice.disabled) {
      event.preventDefault();
      return;
    }
    const told = this.dispatchEvent(
      new CustomEvent<DropdownChosen>('sds-dropdown-choose', {
        detail: { choice, index },
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    if (!told) event.preventDefault();
    /* Choosing is what the panel was opened for. It closes whether or not
       anything moved, because a panel still standing reads as a press that did
       nothing. Asked of the panel rather than of the state: the browser owns
       whether a popover is open, and `open` is this element reading that back. */
    this.panel?.hidePopover();
  }

  private entry(choice: DropdownChoice, index: number): TemplateResult {
    const inside = choice.icon
      ? html`<sds-icon name="${choice.icon}"></sds-icon>${choice.label}`
      : html`${choice.label}`;
    const shared = {
      class: choice.current ? 'sds-dropdown__item is-active' : 'sds-dropdown__item',
      lang: choice.lang,
    };

    if (this.commands) {
      return html`<button
        type="button"
        role="menuitem"
        class="${shared.class}"
        lang="${shared.lang ?? nothing}"
        aria-disabled="${choice.disabled ? 'true' : nothing}"
        @click="${(event: Event) => this.choose(choice, index, event)}"
      >${inside}</button>`;
    }

    return html`<a
      class="${shared.class}"
      href="${choice.href ?? '#'}"
      lang="${shared.lang ?? nothing}"
      hreflang="${shared.lang ?? nothing}"
      target="${choice.external ? '_blank' : nothing}"
      rel="${choice.external ? 'noreferrer' : nothing}"
      aria-current="${choice.current ? 'true' : nothing}"
      aria-disabled="${choice.disabled ? 'true' : nothing}"
      @click="${(event: Event) => this.choose(choice, index, event)}"
    >${inside}</a>`;
  }

  protected override render(): TemplateResult {
    const commands = this.commands;
    const cls = `${buttonClass({ variant: this.variant, size: this.size, iconOnly: this.iconOnly })} sds-dropdown__button`;
    /* The glyph the caller asked for, then the label, then the marker that says
       this one opens something. The marker is the element's own and not a
       caller's decision: a control that drops it looks like a button that acts. */
    const inside = this.iconOnly
      ? html`${this.icon ? html`<sds-icon name="${this.icon}"></sds-icon>` : ''}`
      : html`${this.icon ? html`<sds-icon name="${this.icon}"></sds-icon>` : ''}${buttonLabel(this.label)}<span
        class="sds-dropdown__marker"
      ><sds-icon name="actions-chevron-down"></sds-icon></span>`;
    /* `popovertarget` rather than a handler: the browser opens it, closes it on
       a press outside or on Escape, puts the focus back on this button, and
       draws it in the top layer where no ancestor's overflow can clip it. All
       of that used to be written here, and none of it was as correct. */
    return html`<div class="sds-dropdown" @keydown="${(e: KeyboardEvent) => this.onKey(e)}">
  <button
    type="button"
    class="${cls}"
    style="anchor-name: ${this.anchor}"
    title="${this.iconOnly ? this.called : nothing}"
    aria-label="${this.name && !this.iconOnly ? this.called : nothing}"
    aria-haspopup="${commands ? 'menu' : nothing}"
    aria-expanded="${this.open ? 'true' : 'false'}"
    aria-controls="${this.panelId}"
    popovertarget="${this.panelId}"
  >${inside}</button>
  <div
    class="sds-dropdown__panel"
    id="${this.panelId}"
    popover
    style="position-anchor: ${this.anchor}"
    role="${commands ? 'menu' : nothing}"
    aria-label="${commands ? this.called : nothing}"
    @toggle="${this.onToggle}"
  >
    ${lines(this.choices.map((choice, at) => this.entry(choice, at)), 4)}
  </div>
</div>`;
  }
}

define('sds-dropdown', SdsDropdown);
