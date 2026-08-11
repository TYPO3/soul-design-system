/* The base every `sds-` element extends.

   Two decisions are baked in here, and both follow from what this system
   already is.

   **Light DOM.** `createRenderRoot` returns the element itself, so there is
   no shadow root. The whole `sds-` vocabulary lives in `components.css` as a
   global stylesheet, and a shadow root would keep every one of those rules
   out. Light DOM means the component and the hand-written markup in the PHP
   product are styled by the same file — one source of truth, which is the
   property the system was built around. The cost is real and worth naming:
   there is no style encapsulation, so a component cannot assume it owns its
   own selectors. It does not need to; `sds-` is the encapsulation.

   **`display: contents` on the host.** The custom element wraps its own
   markup, so `<sds-button>` sits between a flex container and the `<button>`
   it renders, and would otherwise become the flex item — collapsing every
   gap, alignment and `flex:1` the layout depends on. `display: contents`
   removes the wrapper from the box tree so the button is the flex item
   again, which is what both the CSS and the static cards assume.

   No decorators anywhere: `static properties` is the erasable form, and
   erasable syntax is what lets Node run these files with no build step.
   `tsconfig.json` enforces that with `erasableSyntaxOnly`. */

import { LitElement } from 'lit';

export class SdsElement extends LitElement {
  /* Render into the element itself — see above. */
  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  /** The content a caller wrote between the tags, taken out of the way.

      Asked **once**, and that is the whole reason it is here rather than
      written out in each component that takes content. These elements render
      into themselves, so after the first render an element's children are its
      own output — and `connectedCallback` runs again every time an element is
      moved in the document. A component that looks a second time therefore
      lifts its own rendering and treats it as what the author wrote: a code
      block whose content is the head and the `<pre>` it just produced, which
      reads back as an empty block.

      Nothing moved elements around until tabs began composing them, which is
      why three components carried the same latent bug and none of them showed
      it. */
  #looked = false;

  protected lifted(): Node[] {
    if (this.#looked) return [];
    this.#looked = true;
    const nodes = [...this.childNodes];
    /* `ChildNode.remove` rather than `Node.remove`: a text node between the
       tags is a Node and has no `remove` on the type, though every one of
       them here is a ChildNode. */
    for (const node of nodes) (node as ChildNode).remove();
    return nodes;
  }
}

/* `display: contents` for every registered host, written from the registry
   rather than from a list.

   It used to be a hand-kept string, and it had drifted: it named `sds-card`
   and `sds-panel`, which are not tags, and omitted `sds-pills`, `sds-tabs`,
   `sds-rail` and `sds-surface`, which are — so those four became flex items
   and swallowed the gap and alignment of every layout around them. A list
   that has to be kept in step with `define()` will fall out of step with
   `define()`, so `define()` writes it.

   The rule has to be in place before an element upgrades, or the first frame
   lays out with the wrapper still in the box tree and everything shifts. */
const registered = new Set<string>();

function writeHostRule(doc: Document): void {
  if (!registered.size) return;
  const id = 'sds-host-rule';
  const style = doc.getElementById(id) ?? doc.createElement('style');
  style.id = id;
  style.textContent = `${[...registered].join(',')}{display:contents}`;
  if (!style.isConnected) doc.head.append(style);
}

/** Called by the bundle entry so the rule exists even before the first
    element upgrades. `define()` keeps it current from then on. */
export function installHostRule(doc: Document = document): void {
  writeHostRule(doc);
}

/** Register an element once.

    Two guards, both load-bearing. Re-registering a tag throws, which would
    turn a hot reload or a doubly-imported bundle into a hard error for no
    reason. And there is no registry at all in Node — the card generator
    imports these modules for their template functions, never to upgrade an
    element — so registration is simply not something that happens there. */
export function define(tag: string, ctor: CustomElementConstructor): void {
  if (typeof customElements === 'undefined') return;
  registered.add(tag);
  if (typeof document !== 'undefined') writeHostRule(document);
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}
