import { LitElement, type PropertyDeclarations, type TemplateResult } from 'lit';
/** The name the prerenderer keeps a caller's own content under.

    An element rendered ahead of the browser has its output as its children.
    Without an inert `<template>` that holds the original, it reads that output
    back as its content — a card whose summary is the whole card. */
export declare const CONTENT = "data-sds-content";
/** One child of a named region, the same in a browser and in Node. The
    browser reads it off the node, the prerenderer off the markup. `node` is
    the child whole, `inner` what stands in it, `text` its words alone. */
export interface Region {
    tag: string;
    attrs: Readonly<Record<string, string>>;
    node: Node | TemplateResult;
    inner: readonly Node[] | TemplateResult;
    text: string;
    children: readonly Region[];
}
/** The name of the region a child without a `slot` goes to. */
export declare const TEXT = "text";
/** A node as a region's child, one level of its own children with it. */
export declare function regionOf(node: Node): Region;
export declare class SdsElement extends LitElement {
    #private;
    /** The regions an element takes between its tags, by name. A child names
        its region with `slot`, and one with none goes to `text`. */
    static regions: readonly string[];
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    /** What a caller wrote between the tags, for a renderer that cannot write
        between them. `@lit-labs/ssr` never runs `connectedCallback`, so there are
        no children to lift in Node. A property is the one channel both sides
        have, and it carries markup, which an attribute cannot. Every component
        reads `this.taken ?? this.content`. A property, so a caller who hands
        over another set gets it drawn. */
    static properties: PropertyDeclarations;
    /** The regions as the prerenderer hands them over, where no child can be
        read: `{ figure: [Region, …] }`. */
    regions?: Readonly<Record<string, readonly Region[]>>;
    /** The children of one region. In a browser, off what the caller wrote,
        which leaves the element on the first call. In Node, off `regions`. A
        region nobody wrote is empty. The text region holds every child whose
        `slot` names no region of the element. */
    protected region(name: string): readonly Region[];
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
