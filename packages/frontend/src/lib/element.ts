/* The base every `sds-` element extends.

   Light DOM — `createRenderRoot` returns the element — so the global `sds-`
   vocabulary in `components.css` styles the elements and hand-written markup
   alike. There is no encapsulation; `sds-` is it.

   Which box each element is stands in `styles/base.css`, beside the step it
   carries. A rule in a stylesheet a reader can open, not one written into the
   head at run time. No decorators anywhere: `static properties` is erasable,
   which is what lets Node run these files with no build step. */

import { LitElement, type PropertyDeclarations, type TemplateResult } from 'lit';

/** The name the prerenderer keeps a caller's own content under.

    An element rendered ahead of the browser has its output as its children.
    Without an inert `<template>` that holds the original, it reads that output
    back as its content — a card whose summary is the whole card. */
export const CONTENT = 'data-sds-content';

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
export const TEXT = 'text';

/** A node as a region's child, one level of its own children with it. */
export function regionOf(node: Node): Region {
  const el = node.nodeType === 1 ? (node as Element) : null;
  const inner = el ? [...el.childNodes] : [];
  return {
    tag: el?.localName ?? '',
    attrs: el ? Object.fromEntries([...el.attributes].map((a) => [a.name, a.value])) : {},
    node,
    inner,
    text: (node.textContent ?? '').trim(),
    children: el ? [...el.children].map((child) => regionOf(child)) : [],
  };
}

export class SdsElement extends LitElement {
  /** The regions an element takes between its tags, by name. A child names
      its region with `slot`, and one with none goes to `text`. */
  static regions: readonly string[] = [];

  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  /** What a caller wrote between the tags, for a renderer that cannot write
      between them. `@lit-labs/ssr` never runs `connectedCallback`, so there are
      no children to lift in Node. A property is the one channel both sides
      have, and it carries markup, which an attribute cannot. Every component
      reads `this.taken ?? this.content`. A property, so a caller who hands
      over another set gets it drawn. */
  static override properties: PropertyDeclarations = {
    content: { attribute: false },
    regions: { attribute: false },
  };

  /** The regions as the prerenderer hands them over, where no child can be
      read: `{ figure: [Region, …] }`. */
  declare regions?: Readonly<Record<string, readonly Region[]>>;

  /* The regions a browser read off the children, once. */
  #own: Map<string, Region[]> | null = null;

  /** The children of one region. In a browser, off what the caller wrote,
      which leaves the element on the first call. In Node, off `regions`. A
      region nobody wrote is empty. The text region holds every child whose
      `slot` names no region of the element. */
  protected region(name: string): readonly Region[] {
    if (this.regions) {
      if (name !== TEXT) return this.regions[name] ?? [];
      /* A slot the element does not know is text, as it is in a browser. */
      const named = (this.constructor as typeof SdsElement).regions;
      return Object.entries(this.regions).flatMap(([key, list]) => (key === TEXT || !named.includes(key) ? list : []));
    }
    /* Node renders with no children to read, and hands over `content`. */
    if (typeof this.querySelector !== 'function') return [];
    if (!this.#own) {
      const named = (this.constructor as typeof SdsElement).regions;
      this.#own = new Map();
      for (const node of this.lifted().filter((one) => !isBlank(one))) {
        const slot = node.nodeType === 1 ? (node as Element).getAttribute('slot') : null;
        const key = slot && named.includes(slot) ? slot : TEXT;
        this.#own.set(key, [...(this.#own.get(key) ?? []), regionOf(node)]);
      }
    }
    return this.#own.get(name) ?? [];
  }

  declare content?: unknown;

  /** The same content as the author wrote it, before anything in it
      rendered. For an element that reads facts out of its children and
      renders them itself: a set that numbers its entries. In Node the markup
      is the only form the children have. */
  declare authored?: string;

  /** Asked once. These elements render into themselves, so after the first
      render the children are the element's own output. `connectedCallback`
      runs again every time an element moves in the document, and a second
      look lifts that output as what the author wrote. */
  #looked = false;

  /** Lit renders *after* whatever children it finds and does not empty the
      container. So an element that arrives with its own prerendered markup
      holds two copies. The marker says the build wrote that markup; content
      a caller wrote carries none and stays. */
  override connectedCallback(): void {
    if (this.querySelector(`:scope > template[${CONTENT}]`)) {
      for (const node of [...this.childNodes]) (node as ChildNode).remove();
    }
    super.connectedCallback();
  }

  /** What a caller wrote between the tags, left where it stands: in the
      template of a prerendered element, as the children otherwise. For an
      element that reads facts out of its children before it takes them. A
      removal runs the removed child's own `connectedCallback`, and that
      takes what stood under it out of reach. */
  protected standing(): Node[] {
    const kept = this.querySelector(`:scope > template[${CONTENT}]`) as HTMLTemplateElement | null;
    return kept ? [...kept.content.childNodes] : [...this.childNodes];
  }

  protected lifted(): Node[] {
    if (this.#looked) return [];
    this.#looked = true;
    /* The template holds the written content; everything else in a
       prerendered element is last render's work and goes. */
    const kept = this.querySelector(`:scope > template[${CONTENT}]`);
    const nodes = this.standing();
    if (kept) for (const node of [...this.childNodes]) (node as ChildNode).remove();
    /* Cast because a text node has the type `Node`, which has no `remove` —
       though every node that reaches here is a `ChildNode`. */
    for (const node of nodes) (node as ChildNode).remove();
    return nodes;
  }
}

/** The newlines a template leaves between tags, and the markers Lit leaves
    among its bindings. Neither is content a caller wrote, and an element that
    counts one as content renders a part nobody asked for. */
export const isBlank = (node: Node): boolean =>
  node.nodeType === 8 || (node.nodeType === 3 && !(node.textContent ?? '').trim());

/** Register an element once. A second registration of a tag throws, which
    turns a hot reload or a twice-imported bundle into a hard error. And there
    is no registry in Node, which imports these modules for their template
    functions alone. */
export function define(tag: string, ctor: CustomElementConstructor): void {
  if (typeof customElements === 'undefined') return;
  /* A script in the head registers before the parser reaches the markup,
     and an element then upgrades at its opening tag with no children. So
     the registration waits for the parse to end, and every element's first
     look is at a complete tree. A module or a deferred script is past that
     point already and registers at once. */
  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => define(tag, ctor), { once: true });
    return;
  }
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}
