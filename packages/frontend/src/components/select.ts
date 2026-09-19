/* sds-select: one answer out of a list the reader does not need to see.

   Its own element, not a shape a field takes. A select and a text field
   share a box and nothing else. A select has a list, with headings, and
   entries on it but not on offer. It has nothing to type, no length, no
   pattern, no keyboard to choose.

   This element draws the list, the one place this system rebuilds a native
   control. A native `<select>` opens a window in the operating system's
   colours, out of the page's reach. So a dark page opens a light list.

   The cost is everything the platform did, and this file puts it all back.
   `role="combobox"` over `role="listbox"`, the arrows, Home and End,
   type-ahead, Enter and Escape, and `aria-activedescendant`, so the focus
   stays on the button. The list is a popover in the top layer, so no
   ancestor's overflow clips it, and a press outside is the platform's own
   dismissal.

   The real `<select>` stays underneath and carries the value. The form
   submits it, and a page with no script shows and operates it. The drawn
   list hides until this element upgrades. */

import { html, nothing, type TemplateResult } from 'lit';
import { define } from '../lib/element.ts';
import { fieldBox, type FieldSize } from '../lib/field-box.ts';
import { fieldRow } from '../lib/field-row.ts';
import { anchored, place } from '../lib/flyout.ts';
import { SdsFormElement } from '../lib/form-element.ts';
import './icon.ts';

/** One entry. A bare string is the label and the value at once, which most
    lists are. The object carries the three things a string cannot. */
export interface SelectOption {
  label: string;
  /** What it sends, where that is not the label. */
  value?: string;
  /** On the list and not on offer — a release out of support, a plan this
      account cannot reach. The reader sees why the answer is not there. */
  disabled?: boolean;
  /** The heading it stands under. Consecutive entries naming the same one
      become a single group, so the order of the list is the grouping. */
  group?: string;
}

export interface SelectProps {
  /** The visible label, which turns this into a control in a *form*: label
      above, hint under, error under both. Without one it is the bare box —
      right in a header or a filter row, where the surface says what it is for. */
  caption?: string;
  /** The control's name for anything that cannot see what it sits beside. A
      select with no visible label of its own owes one here. */
  label?: string;
  /** The answer's name in the form data. */
  name?: string;
  /** The control's id, so the label points at it and an error summary can. */
  fieldId?: string;
  /** The chosen value. Or, while there is no choice, what the closed box says
      instead. That entry is on the list and disabled, so the reader sees it
      and never picks it. */
  value?: string;
  /** The list. */
  options?: readonly (string | SelectOption)[];
  /** What the answer has to be, under the control. Never inside it. */
  hint?: string;
  /** What is wrong with the choice. Sets the invalid state with it, and the
      browser refuses to submit past it. */
  error?: string;
  /** A choice is mandatory. A word beside the label says so. */
  required?: boolean;
  /** Present, and not on offer. */
  disabled?: boolean;
  /** The three heights a button has. */
  size?: FieldSize;
  /** The width it asks for, in pixels — and what it gets is that or the room
      there is. The attribute is `min-width`. */
  minWidth?: number;
  /** A choice exists. A choice sets it. */
  filled?: boolean;
  /** Force the focus state for a still picture. */
  focused?: boolean;
  /** The box says the answer is wrong, with no sentence of its own. */
  invalid?: boolean;
  /** The list, drawn open, for a card. A card is a picture and runs no
      script, so it can neither press the button nor hold a popover. Never
      set on a page: the reader opens the list there. */
  open?: boolean;
}

/** Distinct ids per instance. The button names the list it opens and the
    option it is on. Two selects on one page must not share those names. */
let seq = 0;

export class SdsSelect extends SdsFormElement {
  static override properties = {
    caption: { type: String },
    label: { type: String },
    name: { type: String },
    fieldId: { type: String, attribute: 'field-id' },
    value: { type: String },
    options: { type: Array },
    hint: { type: String },
    error: { type: String },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    minWidth: { type: Number, attribute: 'min-width' },
    filled: { type: Boolean, reflect: true },
    focused: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    open: { type: Boolean, reflect: true },
    /** If the popover shows, read back from the browser, which owns that.
        Apart from `open`, which is a still picture's state and takes the
        popover away. One property for both re-adds the attribute the moment
        the list opens, and closes it again. */
    shown: { type: Boolean, state: true },
    /** Which entry the keys are on while the list is open. Not the chosen one:
        a reader walking the list has moved nothing until they say so. */
    active: { type: Number, state: true },
  };

  declare caption: string;
  declare label?: string;
  declare name: string;
  declare fieldId: string;
  declare value: string;
  declare options: readonly (string | SelectOption)[];
  declare hint: string;
  declare error: string;
  declare required: boolean;
  declare disabled: boolean;
  declare size: FieldSize;
  declare minWidth: number;
  declare filled: boolean;
  declare focused: boolean;
  declare invalid: boolean;
  declare open: boolean;
  declare shown: boolean;
  declare active: number;

  private readonly listId = `sds-select-list-${++seq}`;
  /** The anchor the list stands against, named per instance. One name for
      every select on a page resolves to whichever the browser met last. */
  private readonly anchor = `--${this.listId}`;
  /** What stops the placement this element made, where it made one. */
  private following?: () => void;

  constructor() {
    super();
    this.caption = '';
    this.name = '';
    this.fieldId = '';
    this.value = '';
    this.options = [];
    this.hint = '';
    this.error = '';
    this.required = false;
    this.disabled = false;
    this.size = 'md';
    this.minWidth = 220;
    this.filled = false;
    this.focused = false;
    this.invalid = false;
    this.open = false;
    this.shown = false;
    this.active = -1;
  }

  /* The answer the markup came with, which is what a reset puts back. */
  #initial?: string;

  protected override willUpdate(): void {
    this.#initial ??= this.filled ? this.value : '';
  }

  protected override restore(): void {
    this.value = this.#initial || this.value;
    this.filled = !!this.#initial;
  }

  override disconnectedCallback(): void {
    this.following?.();
    this.following = undefined;
    super.disconnectedCallback();
  }

  /** The list as entries, each with where it sits: one flat run, because the
      keys walk the answers and never the headings. */
  private get entries(): SelectOption[] {
    return this.options.map((entry) => (typeof entry === 'string' ? { label: entry } : entry));
  }

  /** Which entries a key can land on. A disabled one reads out, and the keys
      step over it, the way the platform does. */
  private get reachable(): number[] {
    return this.entries.flatMap((option, at) => (option.disabled ? [] : [at]));
  }

  /** What an entry sends. Not `valueOf`, which every object already has. */
  private sends(option: SelectOption): string {
    return option.value ?? option.label;
  }

  /** What the closed box says. The chosen entry's *label*, which is not always
      its value. And the prompt while there is no choice. */
  private get says(): string {
    if (!this.filled) return this.value;
    const chosen = this.entries.find((option) => this.sends(option) === this.value);
    return chosen?.label ?? this.value;
  }

  /** If the list is in front of the reader, by either route. The reader
      opened it, or a card that can press nothing drew it open. */
  private get listed(): boolean {
    return this.open || this.shown;
  }

  private get list(): HTMLElement | null {
    return this.querySelector<HTMLElement>('.sds-select__list');
  }

  private get button(): HTMLElement | null {
    return this.querySelector<HTMLElement>('.sds-select__button');
  }

  protected override updated(): void {
    const control = this.querySelector('select');
    if (control) {
      /* The `selected` attributes are the list's *defaults*, which a reset
         puts back. The live choice stands here. */
      if (this.filled) control.value = this.value;
      /* Once this element has upgraded there are two controls in the markup,
         and only one is the reader's. The other leaves the reading and the tab
         order. Set here, not in the template, so a page with no script gets a
         plain working `<select>`. */
      control.tabIndex = -1;
      control.setAttribute('aria-hidden', 'true');
      /* And it stops as the one that demands an answer. A control the browser
         cannot focus is a form that refuses to send with no reason on screen.
         The demand moves to the element's own validity, on the button. */
      control.required = false;
    }
    /* What the caller said is wrong, or else the absent answer. Both are
       validities the browser holds and refuses to submit past, on the button
       the reader can see. */
    const missing = this.required && !this.filled;
    if (this.error) this.setValidity(this.error, '.sds-select__button');
    else if (missing) this.setValidity('Choose one of the answers on the list', '.sds-select__button', 'valueMissing');
    else this.setValidity('');
    /* The row the keys are on, kept in view. A list a reader has walked past
       the bottom of is a list they cannot see themselves in. */
    if (this.listed && this.active >= 0) {
      this.querySelector(`#${this.listId}-${this.active}`)?.scrollIntoView({ block: 'nearest' });
    }
  }

  /** Where the keys start: on the choice, or on the first answer there is. A
      list that opens at the top every time makes a reader find their own
      answer again before they can move off it. */
  private aim(): void {
    const at = this.entries.findIndex((option) => this.sends(option) === this.value);
    this.active = at >= 0 && !this.entries[at]?.disabled ? at : (this.reachable[0] ?? -1);
  }

  /** What the browser did, read back, not assumed. Light dismiss and Escape
      are the platform's, so a press outside or a key this element never saw
      still arrives as a state change. So does a press on the button, which
      opens the popover through `popovertarget` and never comes past `show`. */
  private readonly onToggle = (event: Event): void => {
    this.shown = (event as ToggleEvent).newState === 'open';
    this.following?.();
    this.following = undefined;
    if (!this.shown) {
      this.active = -1;
      return;
    }
    if (this.active < 0) this.aim();
    if (!anchored() && this.list && this.button) {
      this.following = place(this.list, this.button, 'start', '--sds-select-list-gap');
    }
  };

  /* Open and close move this element's own state first and the popover second.
     The browser queues `toggle` and does not fire it at its cause. So a key
     straight after another one arrives while this still holds the list shut,
     and reads as a second press to open it. */
  private show(): void {
    if (this.disabled || this.inheritedDisabled || this.shown) return;
    this.shown = true;
    this.aim();
    this.list?.showPopover();
  }

  private hide(): void {
    this.shown = false;
    this.active = -1;
    this.list?.hidePopover();
  }

  /** Move the keys `step` entries along, stopping at the ends. A list that
      starts over at the bottom hides how long it was from whoever cannot see
      it. */
  private step(step: number): void {
    const rows = this.reachable;
    if (!rows.length) return;
    const at = rows.indexOf(this.active);
    const to = at < 0 ? (step > 0 ? 0 : rows.length - 1) : Math.min(rows.length - 1, Math.max(0, at + step));
    this.active = rows[to] as number;
  }

  /** The typed text at the list in the last second, and what it matched.
      Type-ahead is how a reader who knows the answer gets to it. It is the
      only way to use a long list from the keyboard. */
  #typed = '';
  #typedAt = 0;

  private typeahead(key: string, now: number): boolean {
    if (key.length !== 1 || key === ' ') return false;
    this.#typed = now - this.#typedAt > 1000 ? key : this.#typed + key;
    this.#typedAt = now;
    const wanted = this.#typed.toLowerCase();
    const rows = this.reachable;
    /* From the one after the current, so a repeated letter walks the entries
       that start with it and does not stick on the first. */
    const from = rows.indexOf(this.active) + 1;
    const order = [...rows.slice(from), ...rows.slice(0, from)];
    const hit = order.find((at) => (this.entries[at] as SelectOption).label.toLowerCase().startsWith(wanted));
    if (hit === undefined) return false;
    this.active = hit;
    if (!this.shown) this.choose(hit);
    return true;
  }

  private onKey(event: KeyboardEvent): void {
    if (this.disabled || this.inheritedDisabled) return;
    const now = event.timeStamp;

    if (event.key === 'Escape') {
      /* The browser closes the popover and puts the focus back on the button.
         What remains is to keep the key here. Otherwise a select inside a
         dialog closes the dialog around it in the same press. */
      if (this.shown) event.stopPropagation();
      return;
    }

    if (!this.shown) {
      /* The four keys that open a list, and the two that open it at an end.
         `Alt+ArrowDown` is the platform's own, so it is here too. */
      if (['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        this.show();
        if (event.key === 'Home') this.active = this.reachable[0] ?? -1;
        else if (event.key === 'End') this.active = this.reachable.at(-1) ?? -1;
        return;
      }
      /* A key on a closed select moves the answer without an open, which is
         what a native one does. */
      if (this.typeahead(event.key, now)) event.preventDefault();
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.step(1);
        return;
      case 'ArrowUp':
        event.preventDefault();
        this.step(-1);
        return;
      case 'Home':
        event.preventDefault();
        this.active = this.reachable[0] ?? -1;
        return;
      case 'End':
        event.preventDefault();
        this.active = this.reachable.at(-1) ?? -1;
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.commit();
        return;
      case 'Tab':
        /* An exit with an answer under the keys takes it. Otherwise a Tab away
           from an entry throws the walk away. */
        this.commit();
        return;
      default:
        if (this.typeahead(event.key, now)) event.preventDefault();
    }
  }

  /** Take whatever the keys are on, and close. */
  private commit(): void {
    if (this.active >= 0) this.choose(this.active);
    this.hide();
  }

  private choose(at: number): void {
    const option = this.entries[at];
    if (!option || option.disabled) return;
    this.value = this.sends(option);
    this.filled = true;
    this.active = at;
    /* A choice is an answer to whatever was wrong. The caller decides what is
       wrong next. The old sentence in place blocks the form on a value nobody
       has judged yet. */
    this.error = '';
    /* The form reads the real control, so it moves before any announcement.
       A listener that reads the form data must not see the old answer. */
    const control = this.querySelector('select');
    if (control) control.value = this.value;
    this.dispatchEvent(new CustomEvent<string>('sds-change', { detail: this.value, bubbles: true, composed: true }));
  }

  /** The `<select>` the form actually submits, and the whole control on a page
      that runs no script. The stylesheet hides it once this element upgrades. */
  private native(): TemplateResult {
    const prompt =
      !this.filled && this.value ? html`<option value="" selected disabled>${this.value}</option>` : nothing;
    const runs: { group?: string; items: SelectOption[] }[] = [];
    for (const option of this.entries) {
      const last = runs.at(-1);
      if (last && last.group === option.group) last.items.push(option);
      else runs.push({ group: option.group, items: [option] });
    }
    const one = (option: SelectOption): TemplateResult => {
      const value = this.sends(option);
      return html`<option value="${value}" ?selected="${value === this.value}" ?disabled="${option.disabled ?? false}">${option.label}</option>`;
    };
    return html`<select
    class="sds-input sds-select__native"
    name="${this.name || nothing}"
    aria-label="${this.label || this.caption || nothing}"
    ?required="${this.required}"
    ?disabled="${this.disabled || this.inheritedDisabled}"
    @change="${(e: Event) => {
      const control = e.target as HTMLSelectElement;
      const at = this.entries.findIndex((option) => this.sends(option) === control.value);
      if (at >= 0) this.choose(at);
    }}"
  >${prompt}${runs.map((run) =>
      run.group ? html`<optgroup label="${run.group}">${run.items.map(one)}</optgroup>` : html`${run.items.map(one)}`,
    )}</select>`;
  }

  /** The drawn list: headings as groups the keys walk past, answers as options
      the keys land on. */
  private drawn(): TemplateResult[] {
    const rows: TemplateResult[] = [];
    let group: string | undefined;
    this.entries.forEach((option, at) => {
      if (option.group && option.group !== group) {
        rows.push(html`<span class="sds-select__group" role="presentation">${option.group}</span>`);
      }
      group = option.group;
      const chosen = this.filled && this.sends(option) === this.value;
      rows.push(html`<div
      class="sds-select__option${chosen ? ' is-chosen' : ''}${at === this.active ? ' is-active' : ''}"
      id="${this.listId}-${at}"
      role="option"
      aria-selected="${chosen ? 'true' : 'false'}"
      aria-disabled="${option.disabled ? 'true' : nothing}"
      @click="${() => {
        /* A press on an answer that is not on offer does nothing at all — the
           list stays open, the way it does when a native one is clicked. */
        if (option.disabled) return;
        this.choose(at);
        this.hide();
      }}"
      @pointermove="${() => {
        if (!option.disabled) this.active = at;
      }}"
    ><span class="sds-select__tick"><sds-icon name="actions-check"></sds-icon></span>${option.label}</div>`);
    });
    return rows;
  }

  protected override render(): TemplateResult {
    const cls = `${fieldBox(this)} sds-select${this.open ? ' is-open' : ''}`;
    const box = `width:${this.minWidth}px; max-width:100%`;
    const disabled = this.disabled || this.inheritedDisabled;
    const id = this.fieldId || nothing;

    /* The button carries the id and the label points at it. A `<label for>`
       has to name something a reader can reach, and the `<select>` under this
       hides the moment the element upgrades. */
    const control = html`<span class="${cls}" style="${box}" @keydown="${(e: KeyboardEvent) => this.onKey(e)}">${this.native()}<button
    type="button"
    class="sds-select__button"
    id="${id}"
    style="anchor-name: ${this.anchor}"
    role="combobox"
    aria-haspopup="listbox"
    aria-expanded="${this.listed ? 'true' : 'false'}"
    aria-controls="${this.listId}"
    aria-activedescendant="${this.listed && this.active >= 0 ? `${this.listId}-${this.active}` : nothing}"
    aria-label="${this.label || this.caption || nothing}"
    aria-invalid="${this.invalid || this.error ? 'true' : nothing}"
    ?disabled="${disabled}"
    popovertarget="${this.open ? nothing : this.listId}"
  ><span class="sds-select__value">${this.says}</span></button><span class="sds-select__mark"><sds-icon name="actions-chevron-down"></sds-icon></span><div
    class="sds-select__list"
    id="${this.listId}"
    style="position-anchor: ${this.anchor}"
    role="listbox"
    aria-label="${this.label || this.caption || nothing}"
    ?popover="${!this.open}"
    @toggle="${this.onToggle}"
  >${this.drawn()}</div></span>`;

    return fieldRow(this, control);
  }
}

define('sds-select', SdsSelect);
