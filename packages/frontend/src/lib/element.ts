/* The base every `sds-` element extends.

   Light DOM — `createRenderRoot` returns the element — so the global `sds-`
   vocabulary in `components.css` styles the elements and hand-written markup
   alike. There is no encapsulation; `sds-` is it.

   Which box each element is stands in `styles/base.css`, beside the step it
   carries — a rule in a stylesheet a reader can open, not one written into the
   head at run time. No decorators anywhere: `static properties` is erasable,
   which is what lets Node run these files with no build step. */

import { LitElement } from 'lit';

/** The name the prerenderer keeps a caller's own content under.

    An element rendered ahead of the browser has its output as its children, so
    without an inert `<template>` holding the original it would read that output
    back as what it was given — a card whose summary is the whole card. */
export const CONTENT = 'data-sds-content';

export class SdsElement extends LitElement {
  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  /** What a caller wrote between the tags, for a renderer that cannot write
      between them. `@lit-labs/ssr` never runs `connectedCallback`, so there are
      no children to lift in Node; a property is the one channel both sides
      have, and it carries markup, which an attribute cannot. Every component
      reads `this.taken ?? this.content`. */
  declare content?: unknown;

  /** Asked once. These elements render into themselves, so after the first
      render the children are the element's own output — and `connectedCallback`
      runs again every time an element is moved in the document. A second look
      lifts that output and treats it as what the author wrote. */
  #looked = false;

  /** Lit renders *after* whatever children it finds rather than emptying the
      container, so an element arriving with its own prerendered markup would
      hold two copies. The marker says the build wrote that markup; content a
      caller wrote carries none and stays. */
  override connectedCallback(): void {
    if (this.querySelector(`:scope > template[${CONTENT}]`)) {
      for (const node of [...this.childNodes]) (node as ChildNode).remove();
    }
    super.connectedCallback();
  }

  protected lifted(): Node[] {
    if (this.#looked) return [];
    this.#looked = true;
    /* The template holds what was written; everything else in a prerendered
       element is last render's work and goes. */
    const kept = this.querySelector(`:scope > template[${CONTENT}]`) as HTMLTemplateElement | null;
    const nodes = kept ? [...kept.content.childNodes] : [...this.childNodes];
    if (kept) for (const node of [...this.childNodes]) (node as ChildNode).remove();
    /* Cast because a text node is typed `Node`, which has no `remove` —
       though every node reached here is a `ChildNode`. */
    for (const node of nodes) (node as ChildNode).remove();
    return nodes;
  }
}

/** The newlines a template leaves between tags, and the markers Lit leaves
    among its bindings. Neither is content a caller wrote, and an element that
    counts one as content renders a part nobody asked for. */
export const isBlank = (node: Node): boolean =>
  node.nodeType === 8 || (node.nodeType === 3 && !(node.textContent ?? '').trim());

/** Register an element once. Re-registering a tag throws, which would turn a
    hot reload or a doubly-imported bundle into a hard error; and there is no
    registry in Node, where these modules are imported for their template
    functions alone. */
export function define(tag: string, ctor: CustomElementConstructor): void {
  if (typeof customElements === 'undefined') return;
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}
