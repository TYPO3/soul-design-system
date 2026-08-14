/* What a query was answered with.

   The markup lives in `src/components/search-hits.ts`. It is the part of a
   search worth looking at on its own: the hits, in the order they are read,
   and the sentence a search with nothing to show gives.

   No `parameters.dsCard`: `Pages/Search` is where a list of answers is judged,
   against the field and the facets above it. What is judged here is the list
   with no index behind it and nothing typed into anything — four hits, none,
   or hits carrying a picture, handed straight to the element. */

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
      'Reads labels from the installation. Where it cannot be booted the tool reads the package files instead and says which labels that leaves out.',
    meta: '13.4 · 14.3',
    href: '#',
  },
  {
    kind: 'guide',
    path: 'News · Guides',
    heading: 'Reading the package registry when the installation will not boot',
    snippet:
      'The fallback returns every declared entry — labels among them — and none of the dynamically registered ones. The shortfall travels with the result.',
    meta: '24 July 2026',
    href: '#',
  },
  {
    kind: 'changelog',
    path: 'Documentation · Changelog',
    heading: 'Label overrides resolve before the extension is loaded',
    snippet:
      'A label defined in TypoScript and overridden by an extension now resolves in the order the core documents, which changed in 13.4.',
    meta: '13.4',
    href: '#',
  },
];

const meta: Meta<SearchHitsProps> = {
  title: 'Components/SearchHits',
  tags: ['autodocs', '!dev'],
  parameters: { layout: 'padded' },
  /* `empty` is left unset rather than blanked: the element's own sentence is
     what a site index holds, and `empty=""` is a caller saying there is
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

/** Three answers to one query. The marking is the element's own — the query
    is handed to the list, which hands it to every hit, so what is highlighted
    is what was searched rather than what a page thought it searched. */
export const Answers: Story = {};

/** Two of them carry the picture their page does, and one does not. The box is
    the same wherever there is a file for it; where there is none the hit keeps
    the column's own edge rather than indenting past a box holding nothing,
    which is a hole with a hit beside it. */
export const WithThumbnails: Story = {
  args: {
    items: HITS.map((hit, at) =>
      at === 0 ? hit : { ...hit, src: `/assets/placeholders/${at === 1 ? 'tool-package-registry' : 'tool-changelog-history'}.png`, alt: '' },
    ),
    match: QUERY,
  },
};

/** Nothing found, which is an answer and says so: what was searched, and what
    of it is not indexed — so a query that matched nothing can be told from a
    search that broke. */
export const Nothing: Story = { args: { items: [], match: 'labeller' } };

/** Searching something other than a site. The sentence is the caller's,
    because only the caller knows what was asked. */
export const NothingElsewhere: Story = {
  args: {
    items: [],
    match: 'labeller',
    empty:
      'Your installation was reached and searched, and no label in it matches. Bundled knowledge is searched separately and holds three answers for the same query.',
  },
};
