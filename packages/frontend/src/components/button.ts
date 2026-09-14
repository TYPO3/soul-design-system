/* sds-button — the action that starts work.

   One primary per view; a second makes neither mean anything. The label is
   content, not a string — a name in mono, a count and a glyph are all things a
   button's label is often enough.

   `buttonMarkup` is what the element renders, exported for the caller that has
   no element: `renderStatic` cannot flatten an element with children.
   `buttonClass` one layer down, because the class list is the contract with
   `components.css` and a surface that writes plain markup needs it. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { define, isBlank, SdsElement } from '../lib/element.ts';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm' | 'lg';

export interface ButtonProps {
  /** What kind of press it is. `primary` starts the work the view is for.
      `secondary` stands beside it. `ghost` belongs in a bar or a head, where a
      filled box is one weight too many. `danger` is the press with no way
      back. */
  variant?: ButtonVariant;
  /** `sm` for a control inside another surface, `lg` for the one action a
      screen is for — a landing's single call, never a row of them. */
  size?: ButtonSize;
  /** No label at all — the icon is the whole control, which then needs
      `title`, because nothing else names it. */
  iconOnly?: boolean;
  /** The tooltip, and the accessible name where the label cannot carry it.
      A must with `icon-only`, because a glyph names nothing on its own. */
  title?: string;
  /** The real attribute, so the pointer, the keyboard and a screen reader
      all agree that it takes no press. Never a class that only looks it. */
  disabled?: boolean;
  /** What a press does to a form around it. `button` by default, which is
      the whole reason the property exists. A `<button>` with no type inside a
      `<form>` submits it, so a Cancel drawn with this element sends the form.
      A real submit says so — and then Enter in a text field submits too,
      which only that button must carry. */
  type?: 'button' | 'submit' | 'reset';
  /** Where it goes, for the press that is a link rather than an action. It
      renders an `<a>` and nothing else changes: same classes, same shape. The
      browser adds its own middle-click, hover target and status line, which
      a `<button>` with a handler has none of. */
  href?: string;
  /** What that link is to this page — `prev`, `next`, `external`. Only with
      `href`, being the anchor's own attribute. */
  rel?: string;
}

export function buttonClass({ variant = 'primary', size = 'md', iconOnly = false, disabled = false }: ButtonProps): string {
  const cls = ['sds-btn', `sds-btn--${variant}`];
  /* Named rather than interpolated: the size arrives as an attribute, and a
     word this layer does not have becomes a class nothing defines. */
  if (size === 'sm' || size === 'lg') cls.push(`sds-btn--${size}`);
  if (iconOnly) cls.push('sds-btn--icon');
  if (disabled) cls.push('is-disabled');
  return cls.join(' ');
}

const LABEL = 'sds-btn__label';

/** The label as the one node it is.

    `.sds-btn` is a flex row, so a word and a version in mono beside each
    other become two items placed by their boxes. Two faces never centre onto
    one baseline that way, at any size or leading. In one item they share a
    line box and align as the text they are. */
export const buttonLabel = (body: unknown): TemplateResult =>
  html`<span class="${LABEL}">${body}</span>`;

/* The same control as an anchor. A link has no disabled state: a control
   nobody must follow is one nobody writes. So the state stops here, rather
   than as a grey link the browser follows anyway. */
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
  /* A string cannot hold a glyph, so it is a label whole and gets the span.
     Markup can, and there whoever wrote it says where the label is. */
  const inner = typeof body === 'string' && body ? buttonLabel(body) : body;
  /* A press that goes somewhere is a link and renders as one. The class
     layer has always let it — the skip link is an `<a class="sds-btn">`. An
     element that cannot emit it leaves every such control hand-written,
     which is the drift this system exists to stop. */
  if (props.href) return linkMarkup(props, inner);
  const cls = buttonClass(props);
  /* Written always, because the default is a decision: without it a button in
     a form is a submit button. See `type` above for what that costs. */
  const type = props.type ?? 'button';
  /* Both optional attributes branch rather than bind. An omitted one still
     leaves the space in front of it in Lit's SSR output: `<button class="…"
     >`. This markup goes to files that must match the browser's byte for
     byte. Four lines to say two things, and the alternative is a space
     nothing can see and every diff can. */
  if (props.title) {
    return props.disabled
      ? html`<button class="${cls}" type="${type}" title="${props.title}" disabled>${inner}</button>`
      : html`<button class="${cls}" type="${type}" title="${props.title}">${inner}</button>`;
  }
  return props.disabled
    ? html`<button class="${cls}" type="${type}" disabled>${inner}</button>`
    : html`<button class="${cls}" type="${type}">${inner}</button>`;
}

/* Written between the tags, a glyph arrives as a node beside the words. It
   stays a sibling — the row's gap is what it is for — and everything else is
   one label. A label a caller wrote themselves stays as it is, or an upgrade
   puts a second span around the one already in the markup. */
const isGlyph = (node: Node): boolean => {
  const el = node as Element;
  return el.tagName?.toLowerCase() === 'sds-icon' || (el.classList?.contains('sds-icon') ?? false);
};

function labelled(nodes: Node[]): unknown[] {
  const out: unknown[] = [];
  let run: Node[] = [];
  /* A run of nothing but whitespace is not a label. Flex draws no such item,
     and wrapped it becomes one — a gap either side of nothing. */
  const close = (): void => {
    if (run.some((node) => !isBlank(node))) out.push(buttonLabel(run));
    run = [];
  };
  for (const node of nodes) {
    if (isGlyph(node) || (node as Element).classList?.contains(LABEL)) {
      close();
      out.push(node);
    } else run.push(node);
  }
  close();
  return out;
}

/** What a press asks of something else on the page.

    `source` is the button. A handler that hears the command usually needs
    to know where it came from: which of three buttons, and where the focus
    goes back to. */
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
  /** The id of what this button acts on — the label element's spelling for
      the same relationship, which a reader of the markup already knows. */
  declare for: string;
  /** What it asks of it. `show` unless a caller says otherwise, since a
      button pointed at a viewer or a dialog is almost always the one that
      opens it. */
  declare command: string;
  /** That the label is one glyph and the button is the square. Inferred from
      the label where it arrives as nodes. As markup it cannot be — see
      `SdsElement` — and a button that loses its shape there is a round
      control gone rectangular in a bar. So a caller can also say it. */
  declare iconOnly: boolean;

  /* The label, taken before Lit renders over it — the element renders light
     DOM, so `render()` otherwise replaces exactly what it is for. */
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
     neither end holds the other and a page wires the two in markup. It fires
     **on the target**, the way the platform's own invokers do, so what
     answers listens to itself. It bubbles, so a page that wants every
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
    /* Icon-only is the square, and a fact about the content rather than a
       property. A button whose whole label is one glyph is one. */
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
      this.taken.length ? labelled(this.taken) : (this.content ?? this.taken),
    );
  }
}

define('sds-button', SdsButton);
