/* sds-button — the action that starts work.

   One primary per view; a second makes neither mean anything. The label is
   content, not a string — a name in mono, a count and a glyph are all things a
   button's label is often enough.

   `buttonMarkup` is what the element renders, exported for the caller that has
   no element: `renderStatic` cannot flatten an element that was given children.
   `buttonClass` one layer down, because the class list is the contract with
   `components.css` and a surface writing plain markup needs it. */

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
  /** What pressing it does to a form around it. `button` by default, which is
      the whole reason the property exists: a `<button>` with no type inside a
      `<form>` submits it, so a filter or a Cancel drawn with this element sends
      the form the moment it is pressed. A real submit says so — and then Enter
      in a text field submits too, which only that button should carry. */
  type?: 'button' | 'submit' | 'reset';
  /** Where it goes, for the press that is a link rather than an action. It
      renders an `<a>` and nothing else changes: same classes, same shape, and
      the browser's own middle-click, hover target and status line, none of
      which a `<button>` with a handler on it has. */
  href?: string;
  /** What that link is to this page — `prev`, `next`, `external`. Only with
      `href`, being the anchor's own attribute. */
  rel?: string;
}

export function buttonClass({ variant = 'primary', size = 'md', iconOnly = false, disabled = false }: ButtonProps): string {
  const cls = ['sds-btn', `sds-btn--${variant}`];
  if (size === 'sm') cls.push('sds-btn--sm');
  if (iconOnly) cls.push('sds-btn--icon');
  if (disabled) cls.push('is-disabled');
  return cls.join(' ');
}

/* The same control as an anchor. A link cannot be disabled — a control that
   must not be followed is one that is not written — so the state is dropped
   here rather than drawn as a grey link the browser follows anyway. */
function linkMarkup(props: ButtonProps, body: unknown): TemplateResult {
  const cls = buttonClass({ ...props, disabled: false });
  const href = props.href ?? '';
  if (props.rel) {
    return props.title
      ? html`<a class="${cls}" href="${href}" rel="${props.rel}" title="${props.title}">${body}</a>`
      : html`<a class="${cls}" href="${href}" rel="${props.rel}">${body}</a>`;
  }
  return props.title
    ? html`<a class="${cls}" href="${href}" title="${props.title}">${body}</a>`
    : html`<a class="${cls}" href="${href}">${body}</a>`;
}

/** The markup a button is, given whatever stands inside it. */
export function buttonMarkup(props: ButtonProps, body: unknown): TemplateResult {
  /* A press that goes somewhere is a link and is written as one. The class
     layer has always allowed it — the skip link is an `<a class="sds-btn">` —
     and an element that could not emit it left every such control to be
     hand-written, which is the drift this system exists to stop. */
  if (props.href) return linkMarkup(props, body);
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

/** What a press asks of something else on the page.

    `source` is the button, because a handler that hears the command usually
    needs to know where it came from — which of three buttons was pressed, and
    where the focus goes back to. */
export interface SdsCommand {
  command: string;
  source: Element;
}

export class SdsButton extends SdsElement {
  static override properties = {
    variant: { type: String, reflect: true },
    size: { type: String, reflect: true },
    title: { type: String },
    disabled: { type: Boolean, reflect: true },
    type: { type: String, reflect: true },
    href: { type: String },
    rel: { type: String },
    for: { type: String, reflect: true },
    command: { type: String, reflect: true },
    iconOnly: { type: Boolean, attribute: 'icon-only', reflect: true },
  };

  declare variant: ButtonVariant;
  declare size: ButtonSize;
  declare disabled: boolean;
  declare type: 'button' | 'submit' | 'reset';
  /** Where it goes, where the press is a link rather than an action. */
  declare href: string;
  declare rel: string;
  /** The id of what this button acts on — the same spelling `sds-menu` uses
      for the navigation it opens, because it is the same relationship. */
  declare for: string;
  /** What it asks of it. `show` unless something else is written, since a
      button pointed at a viewer, a dialog or a drawer is almost always the one
      that opens it. */
  declare command: string;
  /** That the label is one glyph and the button is the square. Inferred where
      the label can be read, which it cannot be when it arrives as markup rather
      than nodes — see `SdsElement`, and a button that loses its shape there is
      a round control gone rectangular in a bar. So a caller can also say it. */
  declare iconOnly: boolean;

  /* The label, taken before Lit renders over it — the element renders light
     DOM, so `render()` would otherwise replace exactly what it is for. */
  private taken: Node[] = [];

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'md';
    this.disabled = false;
    this.type = 'button';
    this.href = '';
    this.rel = '';
    this.for = '';
    this.command = 'show';
    this.iconOnly = false;
  }

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
    this.addEventListener('click', this.onPress);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.onPress);
    super.disconnectedCallback();
  }

  /* The press, sent to whatever the button names. An id and an event, so
     neither end holds the other and a page wires the two in markup. Dispatched
     **on the target**, the way the platform's own invokers do it, so what
     answers listens to itself — and it bubbles, so a page that wants every
     command still hears them. Without `for` the button keeps its own click. */
  private readonly onPress = (): void => {
    if (!this.for || this.disabled) return;
    const target = document.getElementById(this.for);
    if (!target) return;
    target.dispatchEvent(
      new CustomEvent<SdsCommand>('sds-command', {
        detail: { command: this.command || 'show', source: this },
        bubbles: true,
        composed: true,
      }),
    );
  };

  protected override render(): TemplateResult {
    /* Icon-only is the square, and it is a fact about the content rather than
       a property to set: a button whose whole label is one glyph is one. */
    const iconOnly =
      this.iconOnly ||
      (this.taken.every(
        (node) => node.nodeType === 8 || (node.textContent ?? '').trim() === '',
      ) &&
        this.taken.some((node) => (node as Element).tagName?.toLowerCase() === 'sds-icon'));

    return buttonMarkup(
      {
        variant: this.variant, size: this.size, iconOnly, title: this.title,
        disabled: this.disabled, type: this.type, href: this.href, rel: this.rel,
      },
      this.taken.length ? this.taken : (this.content ?? this.taken),
    );
  }
}

define('sds-button', SdsButton);
