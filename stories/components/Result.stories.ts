/* One hit in a list of them.

   The markup lives in `src/components/result.ts`. No `parameters.dsCard`: a
   result is judged in a list, against the ones above and below it, and a card
   is a fragment at a fixed size. `Pages/Search` shows the list.

   The story worth reading is `Marked`. What is highlighted is what was
   searched for, and this element does the marking — a page that marks by hand
   marks what it thinks it searched for, and the two part company the first
   time a query is trimmed or lower-cased on the way in. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/result.ts';
import { type ResultProps } from '../../src/components/result.ts';

export const sdsResult = ({ heading, href, path, snippet, match, kind, meta }: ResultProps) =>
  html`<sds-result
    heading="${heading}"
    href="${href ?? '#'}"
    path="${path ?? ''}"
    snippet="${snippet ?? ''}"
    match="${match ?? ''}"
    kind="${kind ?? ''}"
    meta="${meta ?? ''}"
  ></sds-result>`;

const HIT: ResultProps = {
  kind: 'reference',
  path: 'Documentation · Tools',
  heading: 'typo3_label_lookup',
  snippet:
    'Reads labels from the installation. Where it cannot be booted the tool reads the package files instead and says which labels that leaves out.',
  match: 'label',
  meta: '13.4 · 14.3',
};

const meta: Meta<ResultProps> = {
  title: 'Components/Result',
  tags: ['autodocs', '!dev'],
  excludeStories: ['sdsResult'],
  render: (args) => sdsResult(args),
  argTypes: {
    heading: { control: 'text' },
    path: { control: 'text' },
    snippet: { control: 'text' },
    match: { control: 'text' },
    kind: { control: 'text' },
    meta: { control: 'text' },
  },
  args: HIT,
};

export default meta;
type Story = StoryObj<ResultProps>;

/** All four parts. The second — where it is — is the one a result list
    usually leaves out, and it is the question the reader was answering by
    searching at all. */
export const Marked: Story = {};

/** Nothing to mark. The snippet is still the sentence it was found in, cut
    from the text rather than written for the list. */
export const Unmatched: Story = { args: { ...HIT, match: '' } };

/** A query that is not a word in the text but a fragment of one. The marking
    is by occurrence and not by word, because that is what a substring search
    actually found. */
export const Fragment: Story = { args: { ...HIT, match: 'lookup' } };

/** Without a path or a kind — a result from a source that has no structure to
    report, which is worth avoiding: it makes the reader open the page to find
    out what it is. */
export const Bare: Story = {
  args: { heading: HIT.heading, snippet: HIT.snippet, match: 'label' },
};
