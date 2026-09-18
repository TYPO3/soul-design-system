/* A sentence borrowed from somewhere.

   The markup lives in `src/components/quote.ts`. No `parameters.dsCard`. What
   a quote looks like is the type scale and a rule, both already on cards. What
   it is *for* is only visible in a column of prose. `Pages/Docs/Article` shows it
   there.

   `Unattributed` is the story to read, and it is the one arrangement the
   component does not permit. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/quote.ts';
import { type QuoteProps } from '../../packages/frontend/src/components/quote.ts';

export const sdsQuote = ({ body, by, as: what, href }: QuoteProps) =>
  html`<sds-quote .body="${body}" by="${by}" as="${what ?? ''}" href="${href ?? ''}"></sds-quote>`;

const meta: Meta<QuoteProps> = {
  title: 'Components/Content/Quote',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsQuote(args),
  argTypes: {
    body: { control: 'text' },
    by: { control: 'text' },
    as: { control: 'text' },
    href: { control: 'text' },
  },
  args: {
    body: 'A partial registry never looks complete. The source, the reason and the unread files travel with the result.',
    by: 'installation-fallback',
    as: 'diagram',
  },
};

export default meta;
type Story = StoryObj<QuoteProps>;

/** A document said it, so no monogram draws: the mark is initials, and a
    filename has none. The attribution is not optional either way — a quotation
    with no source is the product quoting itself for emphasis. */
export const Default: Story = {};

/** Where a reader can read it in full, the attribution is the link. */
export const Sourced: Story = {
  args: {
    body: 'Every source declares a precondition, so the reach of an answer stands clear before the question.',
    by: 'Sources and preconditions',
    as: 'documentation',
    meta: '12.4 release notes',
    href: '#',
  },
};

/** A person, where a person said it. The same byline that stands at the top
    of an article, because authorship is one thing wherever it stands. The
    initials come from the caller: a quote cannot tell a name from a filename. */
export const Person: Story = {
  args: {
    body: 'The fallback was never the problem. Not saying it was a fallback was the problem.',
    by: 'Benjamin Kott',
    initials: 'BK',
    as: 'maintainer',
    meta: '24 July 2026',
  },
};

/** The form a document uses: the sentence between the tags. A product surface
    quotes a line somebody composed and a property carries it. A passage lifted
    out of a page carries its links and its emphasis, and that is markup or it
    is nothing. */
export const FromContent: Story = {
  render: () => html`<sds-quote by="Benjamin Kott" initials="BK" as="maintainer" meta="24 July 2026">
    The fallback was never the problem. <em>Not saying it was a fallback</em>
    was the problem — see <a href="#">the release note</a>.
  </sds-quote>`,
};

/** Long enough to earn the borrow, short enough to stand at heading size.
    A paragraph in quotation marks is a paragraph, and belongs in the column
    with the rest of them. */
export const TooLong: Story = {
  args: {
    body: 'A tool declares the sources it can answer from. The server resolves that declaration against the machine it runs on. A source out of reach is not on offer. The result carries the one that answered, the releases it holds for and everything it left out.',
    by: 'the reference',
  },
};
