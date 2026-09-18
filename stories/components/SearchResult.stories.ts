/* One hit in a list of them.

   The markup lives in `src/components/search-result.ts`. No
   `parameters.dsCard`. A hit earns its review in a list, against the ones
   above and below it, and a card is a fragment at a fixed size.
   `Components/SearchHits` is the list, and `Pages/Search` the page around it.

   The story to read is `Marked`. The marks stand on the search term, and this
   element makes them. A page that marks by hand marks what it thinks it
   searched for. The two part company the first time a query loses its
   spaces or its capitals on the way in. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/search-result.ts';
import { type SearchResultProps } from '../../packages/frontend/src/components/search-result.ts';

export const sdsSearchResult = ({ heading, href, path, snippet, match, kind, meta, src, alt }: SearchResultProps) =>
  html`<sds-search-result
    heading="${heading}"
    href="${href ?? '#'}"
    path="${path ?? ''}"
    snippet="${snippet ?? ''}"
    match="${match ?? ''}"
    kind="${kind ?? ''}"
    meta="${meta ?? ''}"
    src="${src ?? ''}"
    alt="${alt ?? ''}"
  ></sds-search-result>`;

const HIT: SearchResultProps = {
  kind: 'reference',
  path: 'Documentation · Tools',
  heading: 'typo3_label_lookup',
  snippet:
    'Reads labels from the installation. Where that cannot boot, the tool reads the package files instead and says which labels that leaves out.',
  match: 'label',
  meta: '13.4 · 14.3',
};

const meta: Meta<SearchResultProps> = {
  title: 'Components/Navigation/Search result',
  tags: ['autodocs', '!dev'],
  excludeStories: ['sdsSearchResult'],
  render: (args) => sdsSearchResult(args),
  argTypes: {
    heading: { control: 'text' },
    path: { control: 'text' },
    snippet: { control: 'text' },
    match: { control: 'text' },
    kind: { control: 'text' },
    meta: { control: 'text' },
    src: { control: 'text' },
    alt: { control: 'text' },
  },
  args: HIT,
};

export default meta;
type Story = StoryObj<SearchResultProps>;

/** All four parts. The second — where it is — is the one a result list
    usually leaves out. And it is the question the reader had when they
    searched at all. */
export const Marked: Story = {};

/** Nothing to mark. The snippet is still the sentence it came from, cut
    from the text rather than written for the list. */
export const Unmatched: Story = { args: { ...HIT, match: '' } };

/** A query that is not a word in the text but a fragment of one. The marking
    is by occurrence and not by word, because that is what a substring search
    actually found. */
export const Fragment: Story = { args: { ...HIT, match: 'lookup' } };

/** Without a path or a kind — a result from a source that has no structure to
    report. Avoid it: it makes the reader open the page to find out what it
    is. */
export const Bare: Story = {
  args: { heading: HIT.heading, snippet: HIT.snippet, match: 'label' },
};

/** With the picture the page carries. Beside the words and never over them: a
    hit stays a line, so a list of them still reads down one edge. Cropped to
    the same box whatever shape the file is, which is what keeps that edge. */
export const Thumbnail: Story = {
  args: {
    ...HIT,
    src: 'assets/placeholders/tool-package-registry.png',
    alt: '',
  },
};

/** A drawing rather than a photograph. It keeps the colours of its export, so
    it gets the ground those are for. And it fits into the box instead of a
    crop, because a diagram with its edges cut off says nothing at this
    size. */
export const Drawing: Story = {
  args: { ...HIT, src: 'assets/diagrams/answer-sources.svg', alt: '' },
};
