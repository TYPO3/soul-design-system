import { LitElement } from 'lit';
/** The name the prerenderer keeps a caller's own content under.

    An element rendered ahead of the browser has its output as its children.
    Without an inert `<template>` that holds the original, it reads that output
    back as its content — a card whose summary is the whole card. */
export declare const CONTENT = "data-sds-content";
export declare class SdsElement extends LitElement {
    #private;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    /** What a caller wrote between the tags, for a renderer that cannot write
        between them. `@lit-labs/ssr` never runs `connectedCallback`, so there are
        no children to lift in Node. A property is the one channel both sides
        have, and it carries markup, which an attribute cannot. Every component
        reads `this.taken ?? this.content`. */
    content?: unknown;
    /** The same content as the author wrote it, before anything in it
        rendered. For an element that reads facts out of its children and
        renders them itself: a set that numbers its entries. In Node the markup
        is the only form the children have. */
    authored?: string;
    /** Lit renders *after* whatever children it finds and does not empty the
        container. So an element that arrives with its own prerendered markup
        holds two copies. The marker says the build wrote that markup; content
        a caller wrote carries none and stays. */
    connectedCallback(): void;
    /** What a caller wrote between the tags, left where it stands: in the
        template of a prerendered element, as the children otherwise. For an
        element that reads facts out of its children before it takes them. A
        removal runs the removed child's own `connectedCallback`, and that
        takes what stood under it out of reach. */
    protected standing(): Node[];
    protected lifted(): Node[];
}
/** The newlines a template leaves between tags, and the markers Lit leaves
    among its bindings. Neither is content a caller wrote, and an element that
    counts one as content renders a part nobody asked for. */
export declare const isBlank: (node: Node) => boolean;
/** Register an element once. A second registration of a tag throws, which
    turns a hot reload or a twice-imported bundle into a hard error. And there
    is no registry in Node, which imports these modules for their template
    functions alone. */
export declare function define(tag: string, ctor: CustomElementConstructor): void;
