/* sds-select — one answer out of a list the reader does not need to see.

   Its own element rather than a shape a field takes: a select and a text field
   share a box and nothing else. What a select has is a list, with headings and
   entries that are on it but not on offer; what it has not is anything to type,
   a length, a pattern, a keyboard to choose.

   The list is drawn here rather than left to the browser, which is the one
   place this system rebuilds a native control. A native `<select>` opens a
   window the page has no reach into: it is the operating system's colours, on
   the operating system's canvas, so a dark page opens a light list and the
   headings of a grouped one come out in a grey nothing here chose.

   What that costs is everything the platform was doing, and all of it is put
   back by hand: `role="combobox"` over `role="listbox"`, the arrows, Home and
   End, type-ahead, Enter and Escape, and `aria-activedescendant` so the focus
   never leaves the button a reader arrived on. The list is a popover, so the
   top layer holds it — no ancestor's overflow clips it and a press outside is
   the platform's own dismissal.

   The real `<select>` stays underneath and carries the value. It is what the
   form submits, it is what a page with no script still shows and operates —
   the drawn list is hidden until this element upgrades — and it is why nothing
   here has to reimplement a form control's other half. */

import { html, nothing, type TemplateResult } from 'lit';
import { define } from '../lib/element.ts';
import { fieldBox, type FieldSize } from '../lib/field-box.ts';
import { fieldRow } from '../lib/field-row.ts';
import { anchored, place } from '../lib/flyout.ts';
import { SdsFormElement } from '../lib/form-element.ts';
import './icon.ts';

/** One entry. A bare string is the label and the value at once, which is what
    most lists are; the object carries the three things a string cannot. */
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
  /** What the control is called for anything that cannot see what it sits
      beside. A select with no visible label of its own owes one here. */
  label?: string;
  /** What the answer is called when the form is sent. */
  name?: string;
  /** The control's id, so the label points at it and an error summary can. */
  fieldId?: string;
  /** The chosen value — or, while nothing is chosen, what the closed box says
      instead. That entry is on the list and disabled, so it is what the reader
      sees and never what they can pick. */
  value?: string;
  /** The list. */
  options?: readonly (string | SelectOption)[];
  /** What the answer has to be, under the control. Never inside it. */
  hint?: string;
  /** What is wrong with what is chosen. Sets the invalid state with it, and the
      browser refuses to submit past it. */
  error?: string;
  /** Something has to be chosen. Said in words beside the label. */
  required?: boolean;
  /** Present, and not on offer. */
  disabled?: boolean;
  /** The three heights a button has. */
  size?: FieldSize;
  /** The width it asks for, in pixels — and what it gets is that or the room
      there is. The attribute is `min-width`. */
  minWidth?: number;
  /** Something has been chosen. Choosing sets it. */
  filled?: boolean;
  /** Force the focus state for a still picture. */
  focused?: boolean;
  /** The box says the answer is wrong, with no sentence of its own. */
  invalid?: boolean;
  /** The list, drawn standing open, for a card — which is a picture and runs
      no script, so it can neither press the button nor hold a popover. Never
      set on a page: what opens the list there is the reader. */
  open?: boolean;
}

/** Distinct ids per instance: the button names the list it opens and the option
    it is on, and two selects on one page must not both call them the same. */
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
    /** Whether the popover is showing — read back from the browser, which owns
        that. Kept apart from `open`, which is a still picture's state and takes
        the popover away: one property doing both would re-add the attribute the
        moment the list opened, and close it again. */
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
  /** The anchor the list is placed against, named per instance. One name shared
      by every select on a page resolves to whichever the browser met last. */
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

  /** Which entries a key may land on. A disabled one is read out and stepped
      over, the way the platform steps over one. */
  private get reachable(): number[] {
    return this.entries.flatMap((option, at) => (option.disabled ? [] : [at]));
  }

  /** What an entry sends. Not `valueOf`, which every object already has. */
  private sends(option: SelectOption): string {
    return option.value ?? option.label;
  }

  /** What the closed box says. The chosen entry's *label*, which is not always
      its value — and the prompt while nothing is chosen. */
  private get says(): string {
    if (!this.filled) return this.value;
    const chosen = this.entries.find((option) => this.sends(option) === this.value);
    return chosen?.label ?? this.value;
  }

  /** Whether the list is in front of the reader, however it got there: opened
      by them, or drawn open by a card that can press nothing. */
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
      /* The `selected` attributes are the list's *defaults*, which is what a
         reset puts back; where the choice actually stands is written here. */
      if (this.filled) control.value = this.value;
      /* Once this element has upgraded there are two controls in the markup and
         only one of them is the reader's. The other is taken out of the reading
         and out of the tab order — set here rather than in the template, so what
         a page with no script receives is a plain working `<select>`. */
      control.tabIndex = -1;
      control.setAttribute('aria-hidden', 'true');
      /* And it stops being the one that has to be answered: a control the
         browser cannot focus, because nothing here can be looked at, is a form
         that refuses to send with nothing on screen saying why. The requirement
         moves to the element's own validity, reported on the button. */
      control.required = false;
    }
    /* What the caller said is wrong, and — failing that — the answer that is
       missing. Both are validities the browser holds and refuses to submit
       past, reported on the button the reader can actually see. */
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

  /** Where the keys start: on whatever is chosen, or on the first answer there
      is. A list that opens at the top every time makes a reader find their own
      answer again before they can move off it. */
  private aim(): void {
    const at = this.entries.findIndex((option) => this.sends(option) === this.value);
    this.active = at >= 0 && !this.entries[at]?.disabled ? at : (this.reachable[0] ?? -1);
  }

  /** What the browser did, read back rather than assumed. Light dismiss and
      Escape are the platform's, so a press outside or a key this element never
      saw still arrives as a state change — and so does a press on the button,
      which opens the popover through `popovertarget` and never comes past
      `show`. */
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
     `toggle` is queued rather than fired where it is caused, so a key pressed
     straight after another one would arrive while this still believed the list
     was shut — and be read as a second press to open it. */
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

  /** What has been typed at the list in the last second, and what it matched.
      Type-ahead is how a reader who knows the answer gets to it, and the only
      way a long list is usable at all from the keyboard. */
  #typed = '';
  #typedAt = 0;

  private typeahead(key: string, now: number): boolean {
    if (key.length !== 1 || key === ' ') return false;
    this.#typed = now - this.#typedAt > 1000 ? key : this.#typed + key;
    this.#typedAt = now;
    const wanted = this.#typed.toLowerCase();
    const rows = this.reachable;
    /* From the one after the current, so repeating a letter walks the entries
       that start with it rather than sticking on the first. */
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
         What is left is keeping the key here: a select inside a dialog would
         otherwise close the dialog around it in the same press. */
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
      /* Typing on a closed select moves the answer without opening it, which is
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
        /* Leaving with an answer under the keys takes it: a list walked to an
           entry and Tabbed away from would otherwise throw the walk away. */
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
       wrong next; leaving the old sentence standing would block the form on a
       value nobody has judged yet. */
    this.error = '';
    /* The real control is what the form reads, so it is moved before anything
       is announced — a listener that reads the form data must not see the old
       answer. */
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

    /* The button carries the id and the label points at it: a `<label for>` has
       to name something a reader can reach, and the `<select>` under this is
       hidden the moment the element upgrades. */
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
    aria-label="${this.label || nothing}"
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
