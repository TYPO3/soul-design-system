/* sds-search-hits — what a query was answered with.

   The list and the sentence a search with nothing to show gives, in one
   element that is handed the hits rather than finding them. `sds-search` does
   the finding: it owns the index, the field and the keys, and what it knows
   about a hit ends where this begins.

   Split out because an answer is the part worth looking at on its own — a
   story can hand it four hits, none, or a hit with a picture, and none of that
   needs an index behind it or a query typed into a field. */

import { html, type TemplateResult } from 'lit';
import './search-result.ts';
import { type SearchResultProps } from './search-result.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface SearchHitsProps {
  /** The hits, in the order they are read. */
  items: SearchResultProps[];
  /** What was searched for. Marked in every hit, and named in the sentence an
      empty answer gives. */
  match?: string;
  /** What was searched, said where the hits would have been. The default is
      what a site index holds; a caller searching something else says so. */
  empty?: string;
}

const SEARCHED =
  'Every page of this site was searched — its titles and its opening lines. ' +
  'What is not indexed is the body of a page, so a word used once deep in one ' +
  'of them will not be found.';

export class SdsSearchHits extends SdsElement {
  static override properties = {
    items: { type: Array },
    match: { type: String },
    empty: { type: String },
  };

  declare items: SearchResultProps[];
  declare match: string;
  declare empty: string;

  constructor() {
    super();
    this.items = [];
    this.match = '';
    this.empty = SEARCHED;
  }

  /** An answer of nothing is an answer: which pages were read, and what of
      them is not indexed — so a search that found nothing can be told from one
      that broke. */
  private nothing(): TemplateResult {
    const asked = this.match.trim();
    return html`<div class="sds-hits__empty">
    <div class="sds-surface-title">Nothing here matches${asked ? html` “${asked}”` : ''}</div>
    ${this.empty.trim() ? html`<p>${this.empty}</p>` : ''}
  </div>`;
  }

  protected override render(): TemplateResult {
    return html`<div class="sds-hits">
  ${this.items.length
      ? this.items.map(
        (hit) => html`<sds-search-result
    heading="${hit.heading}"
    href="${hit.href ?? '#'}"
    path="${hit.path ?? ''}"
    snippet="${hit.snippet ?? ''}"
    kind="${hit.kind ?? ''}"
    meta="${hit.meta ?? ''}"
    src="${hit.src ?? ''}"
    alt="${hit.alt ?? ''}"
    match="${this.match}"
  ></sds-search-result>`,
      )
      : this.nothing()}
</div>`;
  }
}

define('sds-search-hits', SdsSearchHits);
