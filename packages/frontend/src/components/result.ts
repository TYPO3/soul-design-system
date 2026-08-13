/* sds-result — one hit in a list of them.

   What was found, **where it is**, the sentence it was found in, and what kind
   of thing it is. The second is what a list of titles and snippets leaves out,
   and the reader opens a page to learn it.

   The match is marked here, not by the caller: what is highlighted has to be
   what was searched for, and a page marking by hand marks what it thinks it
   searched for — the two part the first time a query is normalised. Not
   `sds-card`: that invites, this answers. */

import { html, nothing, type TemplateResult } from 'lit';
import './badge.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface ResultProps {
  heading: string;
  href?: string;
  /** Where it is, as the site's own trail — `Documentation · Tools`. Mono,
      because a path is a machine-named thing. */
  path?: string;
  /** The sentence it was found in, cut from the text and not written for the
      list. */
  snippet?: string;
  /** What was searched for. Every occurrence of it in the snippet and the
      heading is marked. */
  match?: string;
  /** What kind of thing it is — reference, guide, changelog. */
  kind?: string;
  /** The release it holds for, where it holds for one. */
  meta?: string;
}

export class SdsResult extends SdsElement {
  static override properties = {
    heading: { type: String },
    href: { type: String },
    path: { type: String },
    snippet: { type: String },
    match: { type: String },
    kind: { type: String },
    meta: { type: String },
  };

  declare heading: string;
  declare href: string;
  declare path: string;
  declare snippet: string;
  declare match: string;
  declare kind: string;
  declare meta: string;

  constructor() {
    super();
    this.heading = '';
    this.href = '#';
    this.path = '';
    this.snippet = '';
    this.match = '';
    this.kind = '';
    this.meta = '';
  }

  /** The text with every occurrence of the query in a `<mark>`.

      Split rather than replaced, so nothing is ever inserted as markup: what
      comes back is text nodes and elements, and a query containing `<` is a
      query and not a tag. */
  private marked(text: string): unknown {
    const needle = this.match.trim();
    if (!needle || !text) return text;

    const out: unknown[] = [];
    const hay = text.toLowerCase();
    const find = needle.toLowerCase();
    let at = 0;
    for (let i = hay.indexOf(find, 0); i !== -1; i = hay.indexOf(find, at)) {
      if (i > at) out.push(text.slice(at, i));
      out.push(html`<mark class="sds-mark">${text.slice(i, i + needle.length)}</mark>`);
      at = i + needle.length;
    }
    out.push(text.slice(at));
    return out;
  }

  protected override render(): TemplateResult {
    return html`<article class="sds-result">
  <div class="sds-row">
    ${this.kind ? html`<sds-badge label="${this.kind}"></sds-badge>` : nothing}
    ${this.path ? html`<span class="sds-result__path">${this.path}</span>` : nothing}
    ${this.meta ? html`<span class="sds-label sds-row__end">${this.meta}</span>` : nothing}
  </div>
  <h3 class="sds-result__title"><a href="${this.href}">${this.marked(this.heading)}</a></h3>
  ${this.snippet ? html`<p class="sds-result__text">${this.marked(this.snippet)}</p>` : nothing}
</article>`;
  }
}

define('sds-result', SdsResult);
