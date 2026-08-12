import { LitElement } from 'lit';
/** The name the prerenderer keeps a caller's own content under.

    An element rendered ahead of the browser has its rendering as its children,
    and the next thing to run is the element itself asking what it was given.
    Without somewhere to put the original it would read its own output back —
    a card whose summary is the whole card — so the prerenderer moves what was
    written into an inert `<template>` and this is how both sides find it. */
export declare const CONTENT = "data-sds-content";
export declare class SdsElement extends LitElement {
    #private;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    /** What a caller wrote between the tags, for a renderer that cannot write
        between them.
  
        Node has no children to lift: `@lit-labs/ssr` builds the element, calls
        `render()` and never runs `connectedCallback`, so anything a component
        reads out of its own subtree is empty there. That is the whole reason the
        static export used to refuse elements with content in them. A property
        is a channel that exists in both places — the prerenderer sets it, the
        browser leaves it alone and lifts the children instead — and it is why
        every component below reads `this.taken ?? this.content` rather than one
        or the other.
  
        Not an attribute: what it holds is markup, which is the one thing an
        attribute cannot carry. */
    content?: unknown;
    protected lifted(): Node[];
}
/** The newlines a template left between the tags, and the markers Lit leaves
    among its own bindings. Neither is content a caller wrote, and every
    element that reads what it was given has to drop both before counting —
    a component that treats one newline as content renders a part nobody
    asked for. */
export declare const isBlank: (node: Node) => boolean;
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
