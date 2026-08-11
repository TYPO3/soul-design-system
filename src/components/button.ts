/* sds-button — the action that starts work.

   One primary per view. Everything else is secondary or ghost; a second
   primary makes neither of them mean anything.

   The label is content:

     <sds-button variant="primary"><sds-icon name="actions-play"></sds-icon>Run the checks</sds-button>

   It used to be a `label=` string with an `icon=` beside it, which could
   carry a word and nothing else — not a name in mono, not a count, not two
   glyphs. A button's label is markup often enough that a string was the
   wrong shape for it.

   `buttonMarkup` is what the element renders, and it is exported for the one
   caller that has no element: a specimen card is written by `renderStatic`,
   which cannot flatten an element that was given children — Lit's SSR emits
   them beside the element's own template and `connectedCallback` never runs
   in Node to move them. One function, two renderers, so the card and the
   browser cannot drift.

   `buttonClass` is exported for the same reason one layer down: the class
   list *is* the contract with `components.css`, and a PHP surface writing
   plain markup needs it. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** No label at all — the icon is the whole control, which then requires
      `title`, because nothing else names it. */
  iconOnly?: boolean;
  title?: string;
  disabled?: boolean;
  /** What pressing it does to a form around it.

      `button` by default, and that default is the whole reason this property
      exists: a `<button>` with no type inside a `<form>` is a submit button,
      so a filter, a toggle or a Cancel drawn with this element submits the
      form the moment it is pressed. The browser then also blocks the
      submission on the first invalid required field and moves the focus
      there — which is a page doing something nobody asked it to, decided by an
      attribute nobody wrote.

      A real submit says so. Then Enter in a text field submits too, which is
      the behaviour a form should have and only that button should carry. */
  type?: 'button' | 'submit' | 'reset';
}

export function buttonClass({ variant = 'primary', size = 'md', iconOnly = false, disabled = false }: ButtonProps): string {
  const cls = ['sds-btn', `sds-btn--${variant}`];
  if (size === 'sm') cls.push('sds-btn--sm');
  if (iconOnly) cls.push('sds-btn--icon');
  if (disabled) cls.push('is-disabled');
  return cls.join(' ');
}

/** The markup a button is, given whatever stands inside it. */
export function buttonMarkup(props: ButtonProps, body: unknown): TemplateResult {
  const cls = buttonClass(props);
  /* Written always, because the default is a decision: without it a button in
     a form is a submit button. See `type` above for what that costs. */
  const type = props.type ?? 'button';
  /* Both optional attributes are branched rather than bound: an omitted one
     still leaves the space in front of it in Lit's SSR output —
     `<button class="…" >` — and this markup is written to files that have to
     match the browser's byte for byte. Four lines to say two things, and the
     alternative is a space nothing can see and every diff can. */
  if (props.title) {
    return props.disabled
      ? html`<button class="${cls}" type="${type}" title="${props.title}" disabled>${body}</button>`
      : html`<button class="${cls}" type="${type}" title="${props.title}">${body}</button>`;
  }
  return props.disabled
    ? html`<button class="${cls}" type="${type}" disabled>${body}</button>`
    : html`<button class="${cls}" type="${type}">${body}</button>`;
}

export class SdsButton extends SdsElement {
  static override properties = {
    variant: { type: String, reflect: true },
    size: { type: String, reflect: true },
    title: { type: String },
    disabled: { type: Boolean, reflect: true },
    type: { type: String, reflect: true },
  };

  declare variant: ButtonVariant;
  declare size: ButtonSize;
  declare disabled: boolean;
  declare type: 'button' | 'submit' | 'reset';

  /* The label, taken before Lit renders over it — the element renders light
     DOM, so `render()` would otherwise replace exactly what it is for. */
  private taken: Node[] = [];

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'md';
    this.disabled = false;
    this.type = 'button';
  }

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    /* Icon-only is the square, and it is a fact about the content rather than
       a property to set: a button whose whole label is one glyph is one. */
    const iconOnly = this.taken.every(
      (node) => node.nodeType === 8 || (node.textContent ?? '').trim() === '',
    ) && this.taken.some((node) => (node as Element).tagName?.toLowerCase() === 'sds-icon');

    return buttonMarkup(
      { variant: this.variant, size: this.size, iconOnly, title: this.title, disabled: this.disabled, type: this.type },
      this.taken,
    );
  }
}

define('sds-button', SdsButton);
