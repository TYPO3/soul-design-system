import { SdsElement } from './element.js';
/** The parts of `ElementInternals` these controls use. Declared because a page
    rendered in Node never has one, and the base has to stand without it. */
type Internals = ElementInternals;
export declare class SdsFormElement extends SdsElement {
    /** What puts the element in `form.elements`, sends it the form's lifecycle
        callbacks and lets it hold a validity of its own. */
    static formAssociated: boolean;
    /** Absent in Node: `@lit-labs/ssr` constructs these elements to render them
        and has no `attachInternals`. Everything below is guarded on it, so a
        control renders on the server as the markup it is and gains the form
        behaviour when it upgrades. */
    protected readonly internals?: Internals;
    constructor();
    /** The form this control answers to, wherever it stands — including one it
        only reaches through the `form` attribute. */
    get form(): HTMLFormElement | null;
    /** The `<label>`s pointing at it, so a caller can move focus the way a
        platform control lets one. */
    get labels(): NodeList | undefined;
    get validity(): ValidityState | undefined;
    get validationMessage(): string;
    get willValidate(): boolean;
    checkValidity(): boolean;
    reportValidity(): boolean;
    /** Whether an ancestor `<fieldset disabled>` has turned this off. The
        element's own `disabled` is a property it renders; this is the other half,
        which nothing but the platform can tell it. */
    protected inheritedDisabled: boolean;
    formDisabledCallback(disabled: boolean): void;
    /** What the markup said, put back. The browser resets the real control inside
        at the same time and to the same value — this is the element's own copy of
        the state agreeing with it. */
    formResetCallback(): void;
    protected restore(): void;
    /** A message the browser refuses to submit past, reported on the real
        control inside — so the bubble points at the box and not at the element
        around it. An empty message clears it.
  
        Called after a render and never during one: there is no element to anchor
        to before the first, and in Node there is no `querySelector` at all. */
    protected setValidity(message: string, selector?: string, flag?: keyof ValidityStateFlags): void;
}
export {};
