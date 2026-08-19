/* The base every control extends: an element the form itself knows about.

   `ElementInternals` is what makes a custom element a member of the form
   rather than a box that happens to contain one. From it come the four things
   a hand-rolled control never gets right — a reset that reaches the element and
   not only the input inside it, a `<fieldset disabled>` that actually disables
   what is under it, a validity the browser refuses to submit past and reports
   on the right box, and `form`, `labels` and `checkValidity()` answering on the
   element the way they answer on an `<input>`.

   What internals deliberately do **not** carry here is the value. Every control
   in this system renders a real named `<input>`, `<select>` or `<textarea>` into
   the light DOM, and that is what the browser submits — including on a page
   that was rendered ahead of time and runs no script at all. Calling
   `setFormValue` as well would send every answer twice. */

import { SdsElement } from './element.ts';

/** The parts of `ElementInternals` these controls use. Declared because a page
    rendered in Node never has one, and the base has to stand without it. */
type Internals = ElementInternals;

export class SdsFormElement extends SdsElement {
  /** What puts the element in `form.elements`, sends it the form's lifecycle
      callbacks and lets it hold a validity of its own. */
  static formAssociated = true;

  /** Absent in Node: `@lit-labs/ssr` constructs these elements to render them
      and has no `attachInternals`. Everything below is guarded on it, so a
      control renders on the server as the markup it is and gains the form
      behaviour when it upgrades. */
  protected readonly internals?: Internals;

  constructor() {
    super();
    if (typeof this.attachInternals === 'function') this.internals = this.attachInternals();
  }

  /** The form this control answers to, wherever it stands — including one it
      only reaches through the `form` attribute. */
  get form(): HTMLFormElement | null {
    return this.internals?.form ?? null;
  }

  /** The `<label>`s pointing at it, so a caller can move focus the way a
      platform control lets one. */
  get labels(): NodeList | undefined {
    return this.internals?.labels;
  }

  get validity(): ValidityState | undefined {
    return this.internals?.validity;
  }

  get validationMessage(): string {
    return this.internals?.validationMessage ?? '';
  }

  get willValidate(): boolean {
    return this.internals?.willValidate ?? false;
  }

  checkValidity(): boolean {
    return this.internals?.checkValidity() ?? true;
  }

  reportValidity(): boolean {
    return this.internals?.reportValidity() ?? true;
  }

  /** Whether an ancestor `<fieldset disabled>` has turned this off. The
      element's own `disabled` is a property it renders; this is the other half,
      which nothing but the platform can tell it. */
  protected inheritedDisabled = false;

  formDisabledCallback(disabled: boolean): void {
    this.inheritedDisabled = disabled;
    this.requestUpdate();
  }

  /** What the markup said, put back. The browser resets the real control inside
      at the same time and to the same value — this is the element's own copy of
      the state agreeing with it. */
  formResetCallback(): void {
    this.restore();
  }

  protected restore(): void {}

  /** A message the browser refuses to submit past, reported on the real
      control inside — so the bubble points at the box and not at the element
      around it. An empty message clears it.

      Called after a render and never during one: there is no element to anchor
      to before the first, and in Node there is no `querySelector` at all. */
  protected setValidity(
    message: string,
    selector = 'input, select, textarea',
    flag: keyof ValidityStateFlags = 'customError',
  ): void {
    if (!this.internals) return;
    if (!message) {
      this.internals.setValidity({});
      return;
    }
    const anchor = this.querySelector(selector) as HTMLElement | null;
    this.internals.setValidity({ [flag]: true }, message, anchor ?? undefined);
  }
}
