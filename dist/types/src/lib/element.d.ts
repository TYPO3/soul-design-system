import { LitElement } from 'lit';
export declare class SdsElement extends LitElement {
    #private;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    protected lifted(): Node[];
}
/** Called by the bundle entry so the rule exists even before the first
    element upgrades. `define()` keeps it current from then on. */
export declare function installHostRule(doc?: Document): void;
/** Register an element once.

    Two guards, both load-bearing. Re-registering a tag throws, which would
    turn a hot reload or a doubly-imported bundle into a hard error for no
    reason. And there is no registry at all in Node — the card generator
    imports these modules for their template functions, never to upgrade an
    element — so registration is simply not something that happens there. */
export declare function define(tag: string, ctor: CustomElementConstructor): void;
