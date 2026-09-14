/* What a query got as its answer.

   The markup lives in `src/components/search-hits.ts`. It is the part of a
   search that stands on its own. The hits, in the order a reader reads them,
   and the sentence a search with nothing to show gives.

   No `parameters.dsCard`: `Pages/Search` is where a list of answers gets its
   review, against the field and the facets above it. Here it is the list
   with no index behind it and nothing typed into anything. Four hits, none,
   or hits with a picture, handed straight to the element. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../../packages/frontend/src/components/search-hits.ts';
import { type SearchResultProps } from '../../packages/frontend/src/components/search-result.ts';
import { type SearchHitsProps } from '../../packages/frontend/src/components/search-hits.ts';

const QUERY = 'label';

const HITS: readonly SearchResultProps[] = [
  {
    kind: 'reference',
    path: 'Documentation · Tools',
    heading: 'typo3_label_lookup',
    snippet:
      'Reads labels from the installation. Where that cannot boot, the tool reads the package files instead and says which labels that leaves out.',
    meta: '13.4 · 14.3',
    href: '#',
  },
  {
    kind: 'guide',
    path: 'News · Guides',
    heading: 'The package registry, read while the installation will not boot',
    snippet:
      'The fallback returns every declared entry — labels among them — and none of the dynamically registered ones. The shortfall travels with the result.',
    meta: '24 July 2026',
    href: '#',
  },
  {
    kind: 'changelog',
    path: 'Documentation · Changelog',
    heading: 'Label overrides resolve before the extension loads',
    snippet:
      'A label from TypoScript that an extension overrides now resolves in the order the core documents, which changed in 13.4.',
    meta: '13.4',
    href: '#',
  },
];

const meta: Meta<SearchHitsProps> = {
  title: 'Components/SearchHits',
  tags: ['autodocs', '!dev'],
  parameters: { layout: 'padded' },
  /* `empty` stays unset rather than blank. The element's own sentence is
     what a site index holds, and `empty=""` is a caller who says there is
     nothing to add to the heading. */
  render: ({ items, match, empty }) =>
    html`<sds-search-hits
      .items="${items}"
      match="${match ?? ''}"
      empty="${ifDefined(empty)}"
    ></sds-search-hits>`,
  argTypes: { match: { control: 'text' }, empty: { control: 'text' } },
  args: { items: [...HITS], match: QUERY },
};

export default meta;
type Story = StoryObj<SearchHitsProps>;

/** Three answers to one query. The marks are the element's own. The list gets
    the query and hands it to every hit. So the marks stand on the search
    term rather than on what a page thought it searched. */
export const Answers: Story = {};

/** Two of them carry the picture their page does, and one does not. The box is
    the same wherever there is a file for it. Where there is none the hit
    keeps the column's own edge. An indent past an empty box is a hole with a
    hit beside it. */
export const WithThumbnails: Story = {
  args: {
    items: HITS.map((hit, at) =>
      at === 0 ? hit : { ...hit, src: `assets/placeholders/${at === 1 ? 'tool-package-registry' : 'tool-changelog-history'}.png`, alt: '' },
    ),
    match: QUERY,
  },
};

/** Nothing found, which is an answer and says so. The search term, and what
    of it the index lacks, so a query that matched nothing stands apart from a
    search that broke. */
export const Nothing: Story = { args: { items: [], match: 'labeller' } };

/** A search of something other than a site. The sentence is the caller's,
    because only the caller knows the question. */
export const NothingElsewhere: Story = {
  args: {
    items: [],
    match: 'labeller',
    empty:
      'The search reached your installation, and no label in it matches. Bundled knowledge is a separate search and holds three answers for the same query.',
  },
};
