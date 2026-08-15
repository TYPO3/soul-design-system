/* sds-field-group — a control and what stands with it, as one thing.

   A field, a row of actions, a hint: each owes no step by its own contract —
   a container or a set spaces them — and a page that wanted the set was
   writing a stack, which is layout wearing no name. This is the name: the
   group pays the normal step between its parts and the flow step around
   itself, so a surface addresses one thing instead of building it. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

export class SdsFieldGroup extends SdsElement {
  /* What a caller wrote between the tags, taken before Lit renders over it.
     What stands in the group is the caller's business; the group only pays
     the distances. */
  private taken: Node[] | null = null;

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    return html`<div class="sds-field-group">${this.taken ?? this.content}</div>`;
  }
}

define('sds-field-group', SdsFieldGroup);
