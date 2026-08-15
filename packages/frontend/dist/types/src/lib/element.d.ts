import { LitElement } from 'lit';
/** The name the prerenderer keeps a caller's own content under.

    An element rendered ahead of the browser has its output as its children, so
    without an inert `<template>` holding the original it would read that output
    back as what it was given — a card whose summary is the whole card. */
export declare const CONTENT = "data-sds-content";
export declare class SdsElement extends LitElement {
    #private;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    /** What a caller wrote between the tags, for a renderer that cannot write
        between them. `@lit-labs/ssr` never runs `connectedCallback`, so there are
        no children to lift in Node; a property is the one channel both sides
        have, and it carries markup, which an attribute cannot. Every component
        reads `this.taken ?? this.content`. */
    content?: unknown;
    /** Lit renders *after* whatever children it finds rather than emptying the
        container, so an element arriving with its own prerendered markup would
        hold two copies. The marker says the build wrote that markup; content a
        caller wrote carries none and stays. */
    connectedCallback(): void;
    /** Run `fn` once the form around this element has been reset, for a control
        that keeps state of its own. The listener has to sit on the form: `reset`
        is fired there and bubbles up, never down. A microtask, because the
        handler runs before the controls are put back. */
    protected whenFormReset(fn: () => void): void;
    disconnectedCallback(): void;
    protected lifted(): Node[];
}
/** The newlines a template leaves between tags, and the markers Lit leaves
    among its bindings. Neither is content a caller wrote, and an element that
    counts one as content renders a part nobody asked for. */
export declare const isBlank: (node: Node) => boolean;
/** Register an element once. Re-registering a tag throws, which would turn a
    hot reload or a doubly-imported bundle into a hard error; and there is no
    registry in Node, where these modules are imported for their template
    functions alone. */
export declare function define(tag: string, ctor: CustomElementConstructor): void;
