/* sds-result — one hit in a list of them.

   What was found, **where it is**, the sentence it was found in, and what kind
   of thing it is. The second is what a list of titles and snippets leaves out,
   and the reader opens a page to learn it. The hit is an anchor: the whole of
   it is the link, named by its heading.

   The match is marked here, not by the caller: what is highlighted has to be
   what was searched for, and a page marking by hand marks what it thinks it
   searched for. Not `sds-card`: that invites, this answers. */

import { html, nothing, type TemplateResult } from 'lit';
import './badge.ts';
import { art, exported } from '../lib/art.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface SearchResultProps {
  /** What the page is called. The whole row is the link to it, not the title
      alone. */
  heading: string;
  /** Where the hit goes, already resolved — a path out of the index is
      relative to the root, and a reader is rarely standing in it. */
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
  /** The picture the thing found carries, where it has one. Named `src`
      because everything in this system that takes a file names it `src`. */
  src?: string;
  /** What the thumbnail shows. Empty where it adds nothing the heading has
      not said. */
  alt?: string;
}

export class SdsSearchResult extends SdsElement {
  static override properties = {
    heading: { type: String },
    href: { type: String },
    path: { type: String },
    snippet: { type: String },
    match: { type: String },
    kind: { type: String },
    meta: { type: String },
    src: { type: String },
    alt: { type: String },
  };

  declare heading: string;
  declare href: string;
  declare path: string;
  declare snippet: string;
  declare match: string;
  declare kind: string;
  declare meta: string;
  declare src: string;
  declare alt: string;

  constructor() {
    super();
    this.heading = '';
    this.href = '#';
    this.path = '';
    this.snippet = '';
    this.match = '';
    this.kind = '';
    this.meta = '';
    this.src = '';
    this.alt = '';
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

  /* Beside the text rather than over it: a hit is read as a line, and a
     picture on top of one would make a list of them a grid of cards. Empty
     `alt` where the caller wrote none — the title names the target already,
     and a second name for it is the same page announced twice. */
  private thumb(): unknown {
    if (!this.src) return nothing;
    const kind = exported(this.src) ? ' sds-result__thumb--exported' : '';
    return html`<div class="sds-result__thumb${kind}">${art(this.src, this.alt)}</div>`;
  }

  /* What kind of thing it is, where it is and what it holds for, on one line.
     The line is dropped rather than left empty: a source that reports none of
     the three is a source with no structure to report, and a blank first row
     is a hole above every title in the list. */
  private above(): unknown {
    if (!this.kind && !this.path && !this.meta) return nothing;
    return html`<span class="sds-row">
      ${this.kind ? html`<sds-badge label="${this.kind}"></sds-badge>` : nothing}
      ${this.path ? html`<span class="sds-result__path">${this.path}</span>` : nothing}
      ${this.meta ? html`<span class="sds-result__meta">${this.meta}</span>` : nothing}
    </span>`;
  }

  /** The whole hit is the link, so the hit *is* an anchor — one element rather
      than a title's anchor stretched over the row by a pseudo-element, which
      is what a card does and what costs a reader the ability to select the
      text. Named by its heading: without that the link's name is everything in
      the row read out at once. Nowhere to go, no anchor. */
  protected override render(): TemplateResult {
    const body = html`${this.thumb()}
  <span class="sds-result__body">
    ${this.above()}
    <h3 class="sds-result__title">${this.marked(this.heading)}</h3>
    ${this.snippet ? html`<p class="sds-result__text">${this.marked(this.snippet)}</p>` : nothing}
  </span>`;

    return this.href
      ? html`<a class="sds-result" href="${this.href}" aria-label="${this.heading}">${body}</a>`
      : html`<article class="sds-result">${body}</article>`;
  }
}

define('sds-search-result', SdsSearchResult);
